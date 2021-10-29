/**
 * 人员关联设置（报备专员/驻外人员）
 */
function personnel_association($scope, $location, $rootScope, $modal, $timeout, AgGridService,Magic,
                               BasemanService, BaseService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};

    //获取路由名称
    var routeName = $state.current.name;

    /**
     * 清空条件
     */
    $scope.clear = function () {
        $scope.data.currItem = {};
    }



    //定义网格字段
    $scope.headerColumns = [
        {   id: "id",
            headerName: "序号",
            field: "id",
            width: 60
        }, {
            id: "userid",
            headerName: "用户",
            field: "userid",
            width: 150,
            type:"string"
        },{
            id: "orgname",
            headerName: "运营中心",
            field: "orgname",
            width: 250,
            type:"string"
        },{
            id: "charge_type",
            headerName: "关联类型",
            field: "charge_type",
            width: 120,
            hcDictCode: 'org_rel_type',
            cellEditorParams: {values:[]},
            type:"list"
        }
    ];

    var headerOptions = {
        columnDefs: $scope.headerColumns,
        //右键菜单
        getContextMenuItems: function (params) {
            var items = headerOptions.hcDefaultOptions.getContextMenuItems(params);
            return items;
        },
    };

    //初始化网格
    AgGridService.createAgGrid('headerGrid', headerOptions);

    /**
     * 增加记录
     */
    $scope.data.currItem.user_charge_orgs = [];
    $scope.addLine = function () {
        //选择用户
        $scope.isSetPage = false;
        BasemanService.chooseUser({
            scope: $scope,
        }).then(function (result) {
            //选择机构
            $scope.searchOrg(result);
        })
    }


    /**
     * 查询机构
     */
    $scope.searchOrg = function (data) {
        var insertData = [];
        var userid = data.employee_code;
        $scope.FrmInfo = {
            title: "选择机构",
            thead: [{
                name: '编码',
                code: 'dept_code'
            }, {
                name: '名称',
                code: 'dept_name'
            }, {
                name: '简称',
                code: 'short_name'
            }],
            classid: "dept",
            url: "/jsp/req.jsp",
            direct: "center",
            sqlBlock: " (dept_type = 6 or dept_type = 5)",
            ignorecase: true, //忽略大小写
            is_high:false,
            postdata: {},
            type:"checkbox",
            searchlist: ["dept_code", "dept_name", "short_name"],
        };
        $scope.pageS = "50";
        $scope.isSetPage = true;
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            //遍历选中的运营中心
            for(var i = 0; i < result.length; i++){
                var flag = false;
                for (var j = 0; j < $scope.data.currItem.user_charge_orgs.length; j++) {
                    var orgname = $scope.data.currItem.user_charge_orgs[j].orgname;
                    if ($scope.data.currItem.user_charge_orgs[j]
                        && $scope.data.currItem.user_charge_orgs[j].orgid == result[i].dept_id
                        && $scope.data.currItem.user_charge_orgs[j].userid == userid) {
                        flag = true;
                        BasemanService.swalWarning("提示",
                            "用户【"+userid+"】与运营中心【"+orgname+"】的关联已建立!");
                        return;
                    }
                }
                if (flag == false) {
                    // $scope.data.currItem.user_charge_orgs.push(result[i]);
                    insertData.push(result[i]);
                    insertData[i].userid = userid;//每次选择同一用户
                }
            }

            for(var i=0; i<insertData.length; i++){
                insertData[i].orgid = insertData[i].dept_id;
                insertData[i].orgname = insertData[i].dept_name;

                //判断驻外或报备
                if(routeName === 'baseman.personnel_association_report'){
                    insertData[i].charge_type = 1;
                }
                if(routeName === 'baseman.personnel_association_outside'){
                    insertData[i].charge_type = 2;
                }
            }

            //序号
            // var seqKey = $scope.headerColumns[0].field;
            // insertData.forEach(function (e, i) {
            //     e[seqKey] = i + 1;
            // });

            //后台insert请求
            BasemanService.RequestPost('user_charge_org', 'insert', {user_charge_orgs:insertData})
                .then(function () {
                    BasemanService.swalSuccess("成功","添加成功！");
                    $scope.searchData();
                });
        })
    }

    /**
     * 删除行
     */
    $scope.deleteLine = function () {
        var FocusedCell = headerOptions.api.getFocusedCell();
        var node;
        if (FocusedCell) {
            node = headerOptions.api.getModel().getRow(FocusedCell.rowIndex);
        }
        if (!node) {
            BasemanService.swal("提示",'请选中要删除的行');
            return;
        }
        var selections = headerOptions.api.getRangeSelections();

        if (selections.length === 1) {
            var oldIndex = selections[0].start.rowIndex;
            var delCount = selections[0].end.rowIndex - oldIndex + 1;

            //获取选中行数据
            var delData = [];
            var idx = oldIndex;
            for(var i = 0; i < delCount; i++){
                delData.push($scope.data.currItem.user_charge_orgs[idx]);
                idx++;
            }


            // var data = $scope.data.currItem.user_charge_orgs;

            return Magic.swalConfirmThenSuccess({
                title: '确定要删除所选记录吗？',
                okFun: function () {
                    return BasemanService.RequestPost('user_charge_org', 'delete',
                        {user_charge_orgs:delData}).then(function () {
                        // data.splice(oldIndex, delCount);
                        // headerOptions.api.setRowData(data);
                        $scope.searchData();
                    });
                },
                okTitle: '删除成功'
            });
        }
    }
    
    /**
     * 查询主表数据
     */
    $scope.searchData = function (postdata) {
        if (!postdata) {
            $scope.oldPage = 1;
            $scope.currentPage = 1;
            if (!$scope.pageSize) {
                $scope.pageSize = "20";
            }
            $scope.totalCount = 1;
            $scope.pages = 1;
            postdata = {
                pagination: "pn=1,ps=20,pc=0,cn=0,ci=0"
            }
        }
        if($scope.sqlwhere && $scope.sqlwhere != ""){
            postdata.sqlwhere = $scope.sqlwhere;
        }
        //菜单入口-报备专员设置
        if(routeName === 'baseman.personnel_association_report'){
            postdata.search_flag = 1;
        }
        //菜单入口-驻外人员设置
        if(routeName === 'baseman.personnel_association_outside'){
            postdata.search_flag = 2;
        }

        BasemanService.RequestPost("user_charge_org", "search", postdata)
            .then(function (data) {
                $scope.data.currItem = data;
                loadGridData(headerOptions, data.user_charge_orgs);
                BaseService.pageInfoOp($scope, data.pagination);
            });
    }


    /**
     * 条件搜索
     */
    $scope.searchBySql = function () {
        $scope.FrmInfo = {
            ignorecase: 'true', //忽略大小写
            is_high: true
        };

        $scope.FrmInfo.thead = $scope.headerColumns.slice(1).map(function (column) {
            var result = {
                name: column.headerName,
                code: column.field
            };

            result.type = 'string';
            if (column.type === '词汇') {
                result.type = 'list';
                result.dicts = column.cellEditorParams.values.map(function (value, index) {
                    return {
                        value: value,
                        desc: column.cellEditorParams.names[index]
                    };
                });
            }

            return result;
        });

        sessionStorage.setItem('frmInfo', JSON.stringify($scope.FrmInfo));

        return BasemanService.open(CommonPopController1, $scope).result.then(function (sqlwhere) {
            $scope.sqlwhere = sqlwhere;
        }).then($scope.searchData);
    }

    /**
     * 加载网格数据
     */
    function loadGridData(gridOptions, datas) {
        var index = $scope.pageSize*($scope.currentPage-1);
        //加序号
        if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                datas[i].id = index + i + 1;
            }
        }
        //设置数据
        gridOptions.api.setRowData(datas);
    }



    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();

    //初始化分页
    BaseService.pageGridInit($scope);
}
//注册控制器
angular.module('inspinia')
    .controller('ctrl_personnel_association', personnel_association)