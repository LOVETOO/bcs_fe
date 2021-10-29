/**
 * Created by asus on 2019/4/22.
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_list'], defineFn);
})(function (module, controllerApi, base_obj_list) {
    'use strict';

    /**
     * 控制器
     */
    HrInsrncPolicyList.$inject = ['$scope'];
    function HrInsrncPolicyList($scope) {
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'insrnc_group_code',
                headerName: '社保组编码'
            }, {
                field: 'insrnc_group_name',
                headerName: '社保组名称'
            }, {
                field: 'start_month',
                headerName: '生效日期'
            }, {
                field: 'total_personal_money',
                headerName: '个人缴纳汇总额',
                type:'金额'
            }, {
                field: 'total_company_money',
                headerName: '公司缴纳汇总额',
                type:'金额'
            }, {
                field: 'total_sum_money',
                headerName: '合计缴纳汇总额',
                type:'金额'
            }, {
                field: 'remark',
                headerName: '备注'
            }, {
                field: 'created_by',
                headerName: '创建者'
            }, {
                field: 'creation_date',
                headerName: '创建日期'
            }, {
                field: 'last_updated_by',
                headerName: '最后修改人'
            }, {
                field: 'last_update_date',
                headerName: '最后修改日期'
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
        controller: HrInsrncPolicyList
    });
});

