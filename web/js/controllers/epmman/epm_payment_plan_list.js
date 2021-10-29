/**
 * 项目回款计划
 * 2019/7/8
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'numberApi'],
    function (module, controllerApi, base_obj_list, numberApi) {
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
                    },{
                        field: 'payment_plan_code',
                        headerName: '回款计划单号'
                    }, {
                        field: 'payment_stat',
                        headerName: '回款状态',
                        hcDictCode:'epm.payment_stat'
                    },  {
                        field: 'form_date',
                        headerName: '单据日期',
                        type:'日期'
                    }, {
                        field: 'contract_code',
                        headerName: '合同编码'
                    }, {
                        field: 'contract_name',
                        headerName: '合同名称'
                    }, {
                        field: 'project_code',
                        headerName: '项目编码'
                    }, {
                        field: 'project_name',
                        headerName: '项目名称'
                    }, {
                        field: 'customer_code',
                        headerName: '客户编码'
                    }, {
                        field: 'customer_name',
                        headerName: '客户名称'
                    }, {
                        field: 'plan_amt',
                        headerName: '计划回款金额',
                        type:'金额'
                    }, {
                        field: 'received_amt',
                        headerName: '已回款金额',
                        type:'金额'
                    }, {
                        field: 'collected_amt',
                        headerName: '待回款金额',
                        type:'金额'
                    }, {
                        field: 'remark',
                        headerName: '备注'
                    }, {
                        field: 'creator_name',
                        headerName: '创建人'
                    }, {
                        field: 'createtime',
                        headerName: '创建时间',
                        type:'时间'
                    }],hcAfterRequest:function (args) {
                        args.epm_payment_plans.forEach(function (val) {
                            val.collected_amt = numberApi.sub(val.plan_amt,val.received_amt);
                        })
                    }
                };
                //继承列表页基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                //$scope.toolButtons.add.hide = true;
                //$scope.toolButtons.delete.hide = true;

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });

