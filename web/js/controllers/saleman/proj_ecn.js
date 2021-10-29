/**
 * 工程项目变更(详情页)
 * @since 2018-07-19
 */
HczyCommon.mainModule().controller('proj_ecn', function ($scope, $stateParams, $q, BasemanService, AgGridService, BillService, Magic, ProjService) {

    console.log('控制器开始：proj_ecn');
    console.log('$scope = ');
    console.log($scope);

    /* ==============================数据定义 - 开始============================== */
    $scope.data = {
        currItem: {},
        ecn: {},
        ngOptions: {}, //下拉值
        editable: false
    };

    /**
     * 当前业务对象
     * @return {Object}
     */
    function currItem() {
        return $scope.data.currItem;
    }

    /* ==============================加载词汇 - 开始============================== */
    angular.forEach({
        'stat': {}, //状态
        'project_type': {
            isStr: true
        }, //项目类型
        'project_period': {}, //项目阶段
        'model': {
            dictCode: 'crm_project.model'
        }, //采购模式
        'soure_amt': {
            dictCode: 'crm_project.soure_amt'
        }, //预采金额来源
        'remote': {
            dictCode: 'project.remote'
        }, //本地/异地
        'dealer_type': {
            dictCode: 'project.dealer_type'
        }
    }, function (params, field) {
        if (!params.dictCode)
            params.dictCode = field;

        BasemanService
            .RequestPost('base_search', 'searchdict', {
                dictcode: params.dictCode
            })
            .then(function (response) {
                $scope.data.ngOptions[field] = response.dicts.map(function (e) {
                    return {
                        'value': params.isStr ? e.dictvalue : parseInt(e.dictvalue),
                        'name': e.dictname
                    };
                });
            });
    });
    /* ==============================加载词汇 - 结束============================== */

    var projPromise = Magic.deferPromise();

    function requestProj(project_id) {
        return BasemanService.RequestPost('proj', 'select', {
            project_id: project_id
        });
    }

    /* ==============================数据定义 - 结束============================== */

    /* =============================按钮方法 - 开始============================== */
    $scope.btnSaveClick = btnSaveClick;

    function btnSaveClick() {
        return saveData();
    }

    var ecnFields = {
        project_name: {
            caption: '工程名称'
        },
        project_type: {
            caption: '项目类型'
        },
        dealer_name: {
            caption: '经销商'
        },
        project_address: {
            caption: '工程地址'
        }
    };

    /**
     * 数据校验
     * @return {Promise}
     */
    function checkData() {
        var reason = [];

        var count = 0;

        angular.forEach($scope.data.ecn, function (value, key) {
            count++;

            if (value.oldvalue == value.newvalue) {
                reason.push(ecnFields[key].caption + '的变更前后的值不能相同');
            }
        });

        if (count === 0)
            reason.push('变更内容不能为空，请点击按钮“选择变更项”');

        if (reason.length) {
            Magic.swalError(reason);
            return $q.reject(reason);
        }
    }

    /**
     * 保存前数据处理
     */
    function dealDataBeforeSave() {
        currItem().proj_ecn_fields = [];

        angular.forEach($scope.data.ecn, function (value, key) {
            currItem().proj_ecn_fields.push({
                field: key,
                oldvalue: value.oldvalue,
                newvalue: value.newvalue
            });
        });
    }

    /**
     * 保存请求
     * @return {Promise}
     */
    function requestSave() {
        return BasemanService.RequestPost('proj_ecn', 'save', JSON.stringify(currItem()));
    }

    /**
     * 保存数据
     * @return {Promise}
     */
    function saveData() {
        return $q
            .when()
            .then(checkData)
            .then(function () {
                Magic.swalInfo({
                    title: '保存中...',
                    closeOnConfirm: false
                });
            })
            .then(dealDataBeforeSave)
            .then(requestSave)
            .catch(Magic.defaultCatch)
            .then(setData)
            .then(function () {
                return Magic.swalSuccess('保存成功');
            })
            ;
    }

    /**
     * 设置数据
     * @param data
     */
    function setData(data) {
        $scope.data.editable = data.stat == 1 || data.wfright > 1;

        $scope.data.currItem = data;

        $scope.data.ecn = data.proj_ecn_fields.reduce(function (result, field) {
            result[field.field] = Magic.assignProperty(field, {}, ['oldvalue', 'newvalue']);

            return result;
        }, {});
    }

    /**
     * 刷新
     * @return {Promise}
     */
    function refreshData() {
        return BasemanService
            .RequestPost('proj_ecn', 'select', {
                proj_ecn_id: currItem().proj_ecn_id
            })
            .then(setData);
    }

    $scope.btnCloseClick = BillService.closeWindow;

    $scope.chooseEcn = chooseEcn;

    function chooseEcn() {
        $('#modal_ecn').modal('show');
    }

    $scope.chooseEcnClick = chooseEcnClick;

    function chooseEcnClick(field) {
        if (angular.isDefined($scope.data.ecn[field])) {
            delete $scope.data.ecn[field];
        }
        else {
            projPromise
                .then(function (proj) {
                    var value = proj[field].toString();
                    $scope.data.ecn[field] = {
                        oldvalue: value,
                        newvalue: value
                    };
                });
        }
    }

    $scope.projLikeness = projLikeness;

    /**
     * 相似性检索
     * @return {Promise}
     */
    function projLikeness() {
        return ProjService.projLikeness({
            scope: $scope,
            project_id: currItem().project_id
        });
    }
    /* =============================按钮方法 - 结束============================== */

    /* ==============================初始化 - 开始============================== */
    /**
     * 初始化
     */
    function doInit() {
        var id = Magic.toNum($stateParams.id);

        //修改
        if (id) {
            currItem().proj_ecn_id = id;
            refreshData()
                .then(function () {
                    return requestProj(currItem().project_id)
                })
                .then(function (response) {
                    projPromise.resolve(response);
                });
        }
        //新增
        else {
            if (parentScope.proj) {
                $scope.data.editable = true;
                Magic.assignProperty(parentScope.proj, currItem(), ['project_id', 'project_code', 'project_name']);
                projPromise.resolve(parentScope.proj);
                chooseEcn();
            }
        }

        window.currScope = $scope; //暴露这个作用域，才能被流程窗口访问到
        $scope.selectCurrenItem = refreshData; //暴露这个方法给流程窗口进行调用刷新
    }

    doInit(); //初始化
    /* ==============================初始化 - 结束============================== */

    console.log('控制器结束：proj_ecn');
});

function setData(param) {
    window.parentScope = param.obj;
}