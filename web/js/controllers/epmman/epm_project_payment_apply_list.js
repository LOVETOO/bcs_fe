/**
 * 项目付款申请-列表页
 * shenguocheng
 * 2019-07-15
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
                            type: '序号'
                        }, {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: 'stat'
                        }, {
                            field: 'project_payment_apply_no',
                            headerName: '申请单号'
                        }, {
                            field: 'apply_date',
                            headerName: '申请时间',
                            type: '日期'
                        }, {
                            field: 'apply_people',
                            headerName: '申请人'
                        }, {
                            field: 'apply_amount',
                            headerName: '本次申请金额(元)',
                            type: '金额'
                        }, {
                            field: 'approved_amount',
                            headerName: '本次批准金额(元)',
                            type: '金额'
                        }, {
                            field: 'addup_amount',
                            headerName: '已支付金额(元)',
                            type: '金额'
                        }, {
                            field: 'contract_name',
                            headerName: '合同名称'
                        }, {
                            field: 'contract_amt',
                            headerName: '合同金额(元)',
                            type:'金额'
                        }, {
                            field: 'payee_linkname',
                            headerName: '收款方'
                        }, {
                            field: 'project_name',
                            headerName: '项目名称'
                        }, {
                            field: 'manager',
                            headerName: '项目经理'
                        }, {
                            field: 'payee_bank',
                            headerName: '开户行'
                        }, {
                            field: 'payee_account',
                            headerName: '银行账号'
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
                            field: 'last_update_by_name',
                            headerName: '修改人'
                        }, {
                            field: 'last_update_date',
                            headerName: '修改时间'
                        }
                    ]
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
