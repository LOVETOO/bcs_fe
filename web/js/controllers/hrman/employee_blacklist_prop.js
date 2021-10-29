/**
 * 特殊名单登记 employee_blacklist_prop
 * Created by sgc
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', 'fileApi', 'strApi', 'directive/hcImg'], defineFn)
})(function (module, controllerApi, base_obj_prop, requestApi, swalApi, fileApi, strApi) {

    EmployeeBlacklistProp.$inject = ['$scope', '$stateParams'];

    function EmployeeBlacklistProp($scope, $stateParams) {
        /*----------------------------------数据定义-------------------------------------------*/
        $scope.data = {
            isApply: $stateParams.isApply === 'false' ? false : true,   //是否特殊名单登记菜单入口
            currItem: {}
        };
        //继承基础控制器
        controllerApi.extend({
            controller: base_obj_prop.controller,
            scope: $scope
        });

        /*----------------------------------通用查询-------------------------------------------*/
        //员工 查询
        $scope.commonSearchSettingOfEmployee_Header = {
            afterOk: function (result) {
                $scope.data.currItem.employee_id = result.employee_id;
                $scope.data.currItem.employee_code = result.employee_code;
                $scope.data.currItem.employee_name = result.employee_name;
                $scope.data.currItem.idcard = result.idcard;
                $scope.data.currItem.nation = result.nation;
                $scope.data.currItem.hometown = result.hometown;
                $scope.data.currItem.phone = result.phone;
                $scope.data.currItem.note = result.note;
                $scope.data.currItem.org_name = result.org_name;
                $scope.data.currItem.position_name = result.position_name;
                $scope.data.currItem.start_date = result.start_date;
                $scope.data.currItem.sex = result.sex;

                //校验员工是否重复登记
                return requestApi.post({
                        classId: 'employee_blacklist',
                        action: 'search',
                        data: {
                            sqlwhere: "bill_stat=1"
                        }
                    })
                    .then(function (response) {
                        if (response.employee_blacklists.length < 0) {
                            return;
                        }
                        for (var i = 0; i < response.employee_blacklists.length; i++) {
                            var obj = response.employee_blacklists[i];
                            if ($scope.data.currItem.employee_code == obj.employee_code) {
                                swalApi.info("员工【" + $scope.data.currItem.employee_code + "】已列入特殊名单，不能重复添加");
                                $scope.data.currItem.employee_code = '';
                                $scope.data.currItem.employee_name = '';
                                $scope.data.currItem.idcard = '';
                                $scope.data.currItem.nation = '';
                                $scope.data.currItem.hometown = '';
                                $scope.data.currItem.phone = '';
                                $scope.data.currItem.note = '';
                                $scope.data.currItem.org_name = '';
                                $scope.data.currItem.position_name = '';
                                $scope.data.currItem.start_date = '';
                                $scope.data.currItem.sex = '';
                            }
                        }
                    })
            }
        };

        /*----------------------------------计算-------------------------------------------*/
        //计算截止锁定日期日期
        $scope.setLockEndDate = function () {
            var lock_start_date = new Date($scope.data.currItem.lock_start_date).getTime();
            var lock_days = $scope.data.currItem.lock_days * 24 * 60 * 60 * 1000;
            var lock_end_date = lock_start_date + lock_days;

            var lock_end_li = new Date(lock_end_date);

            var year = lock_end_li.getFullYear();
            var month = lock_end_li.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            var today = lock_end_li.getDate();
            if (today < 10) {
                today = "0" + today;
            }
            $scope.data.currItem.lock_end_date = year + "-" + month + "-" + today;
        };
        //计算锁定天数
        $scope.setLockDays = function () {
            var lock_end_date = new Date($scope.data.currItem.lock_end_date).getTime();
            var lock_start_date = new Date($scope.data.currItem.lock_start_date).getTime();
            var lock_days = lock_end_date - lock_start_date;
            $scope.data.currItem.lock_days = parseInt(lock_days / 1000 / 60 / 60 / 24);
            if ($scope.data.currItem.lock_days < 0) {
                swalApi.info("截止锁定日期必须大于开始锁定日期");
                $scope.data.currItem.lock_end_date = '';
                $scope.data.currItem.lock_start_date = '';
                $scope.data.currItem.lock_days = '';
            }
        };
        //锁定类型改为无限期时清空所有日期
        $scope.typeChange = function () {
            if ($scope.data.currItem.lock_type == 1) {
                $scope.data.currItem.lock_end_date = '';
                $scope.data.currItem.lock_start_date = '';
                $scope.data.currItem.lock_days = '';
            }
        }

        //通过isApply参数控制过滤标签页的显示与否
        if (!$scope.data.isApply) {
            $scope.tabs.wf.hide = true;
        }
        ;

        //解除按钮方法 通过填写原因和建议更新后台数据
        $scope.unlock = function () {
            return swalApi.input({
                title: '请填写解除原因',
                inputValidator: function (data) {
                    if (strApi.isNull(data) || (data && data.trim() == '')) {
                        return '解除原因不能为空！'
                    }
                }
            }).then(function (data) {
                $scope.data.currItem.unlock_reason = data;
            }).then(function () {
                return swalApi.input({
                    title: '请填写建议',
                    inputValidator: function (data) {
                        if (strApi.isNull(data) || (data && data.trim() == '')) {
                            return '解除建议不能为空！'
                        }
                    }
                }).then(function (data) {
                    $scope.data.currItem.unlock_advise = data;
                }).then(function () {
                    var action = 'unlock';
                    var postdata = {
                        bill_stat: 2,
                        employee_id: $scope.data.currItem.employee_id,
                        blacklist_id: $scope.data.currItem.blacklist_id,
                        reason: $scope.data.currItem.unlock_reason,
                        unlock_advise: $scope.data.currItem.unlock_advise
                    };
                    //调用后台保存方法
                    requestApi.post("employee_blacklist", action, postdata).then(function (data) {
                        return swalApi.success('解除成功!');
                    }).then($scope.refresh);
                });
            });
        }

        if ($scope.data.isInsert) {
            $scope.uploadFile = function () {
                fileApi.uploadFile({
                    multiple: false,
                    accept: 'image/*'
                }).then(function (docs) {
                    $scope.data.currItem.docid1 = docs[0].docid;
                });
            }
        };
        //底部右边按钮
        //特殊名单解除菜单使用
        $scope.footerRightButtons.unlock = {
            title: '名单解除',
            click: function () {
                $scope.unlock && $scope.unlock();
            },
            hide: $scope.data.isApply
        };

        $scope.footerRightButtons.saveThenAdd.hide = !$scope.data.isApply;
        $scope.footerRightButtons.save.hide = !$scope.data.isApply;


    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: EmployeeBlacklistProp
    });

});