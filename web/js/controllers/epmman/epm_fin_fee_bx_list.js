/**
 * 工程费用报销-列表页
 * shenguocheng
 * 2019-07-06
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        
        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号',
                            checkboxSelection: true
                        }, {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: '*'
                        }, {
                            field: 'bx_no',
                            headerName: '报销单号'
                        }, {
                            field: 'chap_name',
                            headerName: '报销人'
                        }, {
                            field: 'org_name',
                            headerName: '报销部门'
                        }, {
                            field: 'balance_type_name',
                            headerName: '结算方式'
                        }, {
                            field: 'fee_apply_no',
                            headerName: '申请单号'
                        }, {
                            field: 'total_apply_amt',
                            headerName: '报销申请总额(元)',
                            type: '金额'
                        }, {
                            field: 'total_allow_amt',
                            headerName: '报销批准总额(元)',
                            type: '金额'
                        }, {
                            field: 'project_name',
                            headerName: '工程名称'
                        }, {
                            field: 'purpose',
                            headerName: '费用用途'
                        }, {
                            field: 'receiver',
                            headerName: '收款人'
                        }, {
                            field: 'receive_bank',
                            headerName: '收款银行'
                        }, {
                            field: 'receive_accno',
                            headerName: '收款账号'
                        }, {
                            field: 'credence_number',
                            headerName: '凭证号'
                        }, {
                            field: 'creator_name',
                            headerName: '创建人'
                        }, {
                            field: 'create_time',
                            headerName: '创建时间'
                        }, {
                            field: 'updator_name',
                            headerName: '修改人'
                        }, {
                            field: 'update_time',
                            headerName: '修改时间'
                        }
                    ],
                    hcDataRelationName: 'fin_fee_bx_headers'
                };

                //继承控制器
                controllerApi.run({
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
    }
);
