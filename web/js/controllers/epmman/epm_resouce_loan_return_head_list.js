/**
 * 资源借出申请
 * 2019/5/27   epm_resouce_loan_return_head_list
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        /**
         * 控制器
         */
        var CustomerOrgOwnerList = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode:'stat'
                    }, {
                        field: 'apply_bill_no',
                        headerName: '借出单号'
                    }, {
                        field: 'estimated_loan_date',
                        headerName: '预计借出日期',
                        type:'日期'
                    }, {
                        field: 'estimated_return_date',
                        headerName: '预计归还日期',
                        type:'日期'
                    }, {
                        field: 'apply_person_name',
                        headerName: '申请人'
                    }, {
                        field: 'apply_dept_name',
                        headerName: '申请部门'
                    }, {
                        field: 'loan_project_name',
                        headerName: '使用项目'
                    }, {
                        field: 'loan_person_name',
                        headerName: '使用人'
                    }, {
                        field: 'loan_description',
                        headerName: '用途'
                    }, {
                        field: 'remark',
                        headerName: '备注'
                    }, {
                        field: 'create_by_name',
                        headerName: '创建人'
                    }, {
                        field: 'create_date',
                        headerName: '创建时间'
                    }, {
                        field: 'last_updated_by_name',
                        headerName: '修改人'
                    }, {
                        field: 'last_updated_date',
                        headerName: '修改时间'
                    }]
                };
                //继承列表页基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });
            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: CustomerOrgOwnerList
        });
    });

