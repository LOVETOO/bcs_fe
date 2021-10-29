/**
 * 薪资组设置
 *  2019/5/16.
 *  zengjinhua
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_list'], defineFn);
})(function (module, controllerApi, base_obj_list) {
    'use strict';
    /**
     * 控制器
     */
    HrSalaryGroupHeaderList.$inject = ['$scope'];
    function HrSalaryGroupHeaderList($scope) {
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'salary_group_code',
                headerName: '薪资组编码'
            }, {
                field: 'salary_group_name',
                headerName: '薪资组名称'
            },  {
                field: 'usable',
                headerName: '有效状态',
                hcDictCode:'usable_code'
            }, {
                field: 'remark',
                headerName: '备注'
            }, {
                field: 'created_by',
                headerName: '创建人'
            }, {
                field: 'creation_date',
                headerName: '创建时间',
                type:'时间'
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
        controller: HrSalaryGroupHeaderList
    });
});

