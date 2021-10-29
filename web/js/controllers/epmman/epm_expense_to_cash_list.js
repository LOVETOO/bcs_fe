/**
 * 工程服务费兑换
 *  2019/8/17
 *  zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'fileApi'],
    function (module, controllerApi, base_obj_list, fileApi) {
        'use strict';
        /**
         * 控制器
         */
        var controller = [
            '$scope',
            function ($scope) {
                $scope.gridOptions={
                    columnDefs:[{
                        type:'序号'
                    },{
                        field:'stat',
                        headerName:'单据状态',
                        hcDictCode : 'stat'
                    },{
                        field:'cashing_no',
                        headerName:'兑现编码'
                    },{
                        field:'service_expense_no',
                        headerName:'服务费编码'
                    },{
                        field: 'customer_code',
                        headerName: '客户编码'
                    },
                    {
                        field: 'customer_name',
                        headerName: '客户名称'
                    },
                    {
                        field: 'billing_unit_code',
                        headerName: '法人客户编码'
                    },
                    {
                        field: 'billing_unit_name',
                        headerName: '法人客户名称'
                    },{
                        field:'total_auditt_amt',
                        headerName:'合同发货总额',
                        type:'金额'
                    },{
                        field:'total_check_amt',
                        headerName:'发货结算总额',
                        type:'金额'
                    },{
                        field:'service_amt',
                        headerName:'应结算服务费',
                        type:'金额'
                    },{
                        field:'total_cash_amt',
                        headerName:'已兑现总额',
                        type:'金额'
                    },{
                        field:'total_uncash_amt',
                        headerName:'未兑现总额',
                        type:'金额'
                    },{
                        headerName: '本次兑现信息',
                        children: [{
                            field:'cashing_way',
                            headerName:'兑现类型',
                            hcDictCode: 'epm.cashing_way'
                        },{
                            field:'deposit_deduct',
                            headerName:'应扣质保金',
                            type:'金额'
                        },{
                            field:'taxes_deduct',
                            headerName:'应扣税金',
                            type:'金额'
                        },{
                            field:'interest_on_credit',
                            headerName:'授信利息',
                            type:'金额'
                        },{
                            field:'other_deduct',
                            headerName:'应扣其他',
                            type:'金额'
                        },{
                            field:'cashable_amt',
                            headerName:'本次可兑现金额',
                            type:'金额'
                        },{
                            field:'apply_amt',
                            headerName:'本次实际兑现金额',
                            type:'金额'
                        }]
                    },{
                        field:'remark',
                        headerName:'备注'
                    },{
                        field:'creator_name',
                        headerName:'创建人'
                    },{
                        field:'createtime',
                        headerName:'创建时间'
                    }]
                };

                //继承列表页基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                //按钮显示
                $scope.toolButtons.downloadImportFormat.hide = false;
                $scope.toolButtons.import.hide = false;

                $scope.toolButtons.downloadImportFormat.click = function () {
                    fileApi.downloadFile(7307);
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

