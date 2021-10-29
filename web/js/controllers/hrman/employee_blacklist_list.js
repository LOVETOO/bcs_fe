/**
 * 特殊名单登记 hr_employee_blacklist_list
 * Created by sgc
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_list', 'dateApi'], defineFn);
})(function (module, controllerApi, base_obj_list, dateApi) {
    'use strict';

    /**
     * 控制器
     */
    var controller = [
        //声明依赖注入
        '$scope', '$stateParams',
        //控制器函数
        function ($scope, $stateParams) {
            $scope.gridOptions = {
                columnDefs: [{
                    type: '序号'
                }, {
                    field: 'stat',
                    headerName: '单据状态',
                    hcDictCode: 'stat'
                }, {
                    field: 'employee_code',
                    headerName: '人员编码'
                }, {
                    field: 'employee_name',
                    headerName: '员工名称'
                }, {
                    field: 'idcard',
                    headerName: '身份证号'
                }, {
                    field: 'sex',
                    headerName: '性别',
                    hcDictCode: 'sex'
                }, {
                    field: 'hometown',
                    headerName: '籍贯'
                }, {
                    field: 'nation',
                    headerName: '民族'
                }, {
                    field: 'phone',
                    headerName: '联系电话'
                }, {
                    field: 'org_code',
                    headerName: '部门编码'
                }, {
                    field: 'org_name',
                    headerName: '部门名称'
                }, {
                    field: 'position_name',
                    headerName: '职位名称'
                }, {
                    field: 'start_date',
                    headerName: '上岗日期',
                    type: '日期'
                }, {
                    field: 'note',
                    headerName: '备注'
                }, {
                    field: 'lock_type',
                    headerName: '锁定类型'
                }, {
                    field: 'lock_start_date',
                    headerName: '开始锁定日期',
                    type: '日期'
                }, {
                    field: 'lock_end_date',
                    headerName: '截止锁定日期',
                    type: '日期'
                }, {
                    field: 'lock_days',
                    headerName: '锁定天数'
                }, {
                    field: 'reason',
                    headerName: '列入原因'
                }, {
                    field: 'dispose',
                    headerName: '建议举措'
                }, {
                    field: 'registor',
                    headerName: '登记单位'
                }, {
                    field: 'unlock_reason',
                    headerName: '解除原因'
                }, {
                    field: 'unlock_advise',
                    headerName: '解除后建议'
                }, {
                    field: 'unlock_date',
                    headerName: '解除日期',
                    type: '日期'
                }, {
                    field: 'unlock_man',
                    headerName: '解除人'
                }, {
                    field: 'bill_stat',
                    headerName: '特殊名单状态',
                    hcDictCode: 'is_specialbill_stat'
                }, {
                    field: 'creator',
                    headerName: '创建人'
                }, {
                    field: 'create_time',
                    headerName: '创建时间',
                    type: 'date'
                }, {
                    field: 'updator',
                    headerName: '最后修改人'
                }, {
                    field: 'update_time',
                    headerName: '最后修改时间',
                    type: 'date'
                }],
                hcBeforeRequest: function (searchObj) {
                    if (!$scope.data.isApply) {
                        searchObj.flag = 2;
                    }
                }
            };

            $scope.data = $scope.data || {};
            $scope.data.isApply = $stateParams.isApply === 'true' ? true : false;


            //如果是名单解除则把过滤器隐藏
            if (!$scope.data.isApply) {
                $scope.filterSetting = null;
            }
            //继承控制器
            controllerApi.run({
                controller: base_obj_list.controller,
                scope: $scope
            });

            //按钮
            $scope.toolButtons.add.hide = !$scope.data.isApply;
            $scope.toolButtons.delete.hide = !$scope.data.isApply;

            if (!$scope.data.isApply) {
                $scope.toolButtons.copy.hide = true;
            }

            /**
             * 向属性页传菜单url参数
             * @returns {{isApply: *|string}}
             */
            $scope.getPropRouterParams = function () {
                return {
                    isApply: $stateParams.isApply
                };
            };

        }
    ];

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: controller
    });
});