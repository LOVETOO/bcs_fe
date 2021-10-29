/**
 * Created by asus on 2019/4/25.
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_list'], defineFn);
})(function (module, controllerApi, base_obj_list) {
    'use strict';

    /**
     * 控制器
     */
    HrEmployeeAbdicateHeadList.$inject = ['$scope'];
    function HrEmployeeAbdicateHeadList($scope) {
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'stat',
                headerName: '单据状态',
                hcDictCode:'stat'
            },{
                field: 'bill_no',
                headerName: '离职单号'
            }, {
                field: 'change_type_name',
                headerName: '离职类型'
            },  {
                field: 'abdicate_date',
                headerName: '离职生效日期',
                type:'日期'
            }, {
                field: 'employee_name',
                headerName: '员工姓名'
            }, {
                field: 'org_name',
                headerName: '所属部门'
            }, {
                field: 'position_name',
                headerName: '职位'
            }, {
                field: 'start_date',
                headerName: '入职日期',
                type:'日期'
            }, {
                field: 'salary_stop_date',
                headerName: '薪资截至日期',
                type:'日期'
            }, {
                field: 'is_need_stop_insure',
                headerName: '需要停保',
                hcDictCode:'is_need_stop_insure'
            }, {
                field: 'remark',
                headerName: '备注'
            }]
        };

        //继承列表页基础控制器
        controllerApi.extend({
            controller: base_obj_list.controller,
            scope: $scope
        });
    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: HrEmployeeAbdicateHeadList
    });
});

