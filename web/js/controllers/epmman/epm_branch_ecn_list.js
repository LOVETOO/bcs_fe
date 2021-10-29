/**
 * 网点变更申请
 * 2020/03/05
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        /**
         * 控制器
         */
        var controller = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    },
                    {
                        field: 'audit_stat',
                        headerName: '审核状态',
                        cellStyle: {
                            'text-align': 'center'
                        }
                    },
                    {
                        field: 'branch_ecn_code',
                        headerName: '变更单号'
                    },
                    {
                        field: 'branch_message_code',
                        headerName: '网点编码'
                    },
                    {
                        field: 'branch_message_name',
                        headerName: '网点名称'
                    },
                    {
                        field: 'audittime',
                        headerName: '申请日期',
                        type : '日期'
                    },
                    {
                        field: 'auditor_name',
                        headerName: '申请人'
                    },
                    {
                        field: 'linkman',
                        headerName: '联系人'
                    },
                    {
                        field: 'phone',
                        headerName: '联系人电话'
                    },
                    {
                        field: 'business_name',
                        headerName: '营业执照名称'
                    },
                    {
                        field: 'branch_legal_name',
                        headerName: '网点法人'
                    },
                    {
                        field: 'customer_code',
                        headerName: '经销商编码'
                    },
                    {
                        field: 'customer_name',
                        headerName: '经销商名称'
                    },
                    {
                        field: 'address',
                        headerName: '地址'
                    },
                    {
                        field: 'ecn_note',
                        headerName: '变更说明'
                    },
                    {
                        field: 'creator_name',
                        headerName: '创建人'
                    },
                    {
                        field: 'createtime',
                        headerName: '创建时间',
                        type:'时间'
                    },
                    {
                        field: 'updator_name',
                        headerName: '修改人'
                    },
                    {
                        field: 'updatetime',
                        headerName: '修改时间',
                        type:'时间'
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
            controller: controller
        });
    });

