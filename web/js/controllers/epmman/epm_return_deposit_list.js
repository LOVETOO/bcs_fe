/**
 * author：zengjinhua
 * since：2020/2/20
 * Description：保证金退还
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
                    },{
                        field: 'audit_stat',
                        headerName: '审核状态',
                        cellStyle: {
                            'text-align': 'center'
                        }
                    },{
                        field: 'apply_code',
                        headerName: '申请单号'
                    },{
                        field: 'creator_name',
                        headerName: '申请人'
                    },{
                        field: 'apply_time',
                        headerName: '申请时间',
                        type : '时间'
                    }, {
                        field: 'project_code',
                        headerName: '报备项目编码'
                    },  {
                        field: 'project_name',
                        headerName: '报备项目名称'
                    }, {
                        field: 'area_full_name',
                        headerName: '报备项目地址'
                    }, {
                        field: 'contract_type',
                        headerName: '签约方式',
                        hcDictCode: 'epm.contract_type',
                        cellStyle:  {
                            'text-align': 'center'
                        },
                        valueFormatter: function (params) {
                            var value;
                            if(params.data.autotrophy == 'Y' && params.data.sell == 'Y'){
                                value = '直销、经销';
                            }else if(params.data.autotrophy == 'Y'){
                                value = '直销';
                            }else{
                                value = '经销';
                            }
                            return value;
                        }
                    },{
                        field: 'customer_code',
                        headerName: '客户编码'
                    }, {
                        field: 'customer_name',
                        headerName: '客户名称'
                    }, {
                        field: 'division_id',
                        headerName: '所属事业部',
                        hcDictCode:'epm.division'
                    }, {
                        field: 'trading_company_name',
                        headerName: '交易公司'
                    }, {
                        field: 'billing_unit_name',
                        headerName: '开票单位'
                    }, {
                        field: 'remittance_type',
                        headerName: '汇款方式',
                        hcDictCode:'epm.remittance_type'
                    }, {
                        field: 'remittance_bilino',
                        headerName: '扣账单号'
                    }, {
                        field: 'remittance_bond',
                        headerName: '汇款金额',
                        type : '金额'
                    }, {
                        field: 'remittance_remark',
                        headerName: '保证金汇款说明'
                    }, {
                        field: 'return_type',
                        headerName: '退还方式',
                        hcDictCode: 'epm.return_type'
                    }, {
                        field: 'delivered_qty_rate',
                        headerName: '发货数量完成率',
                        type:'百分比'
                    }, {
                        field: 'discounted_amount',
                        headerName: '合同折后总额',
                        type:'金额'
                    }, {
                        field: 'task_amount',
                        headerName: '申请任务划拨',
                        type:'金额'
                    }, {
                        field: 'after_sale_amount',
                        headerName: '申请售后服务费',
                        type:'金额'
                    }, {
                        field: 'cfm_delivered_qty_rate',
                        headerName: '核实发货数量完成率',
                        type:'百分比'
                    }, {
                        field: 'cfm_discounted_amount',
                        headerName: '核实合同折后总额',
                        type:'金额'
                    }, {
                        field: 'cfm_task_amount',
                        headerName: '核实任务划拨',
                        type:'金额'
                    }, {
                        field: 'cfm_after_sale_amount',
                        headerName: '核实售后服务费',
                        type:'金额'
                    }, {
                        field: 'remark',
                        headerName: '备注'
                    }, {
                        field: 'agent_opinion',
                        headerName: '经办人审批意见'
                    }, {
                        field: 'creator_name',
                        headerName: '创建者'
                    }, {
                        field: 'createtime',
                        headerName: '创建时间',
                        type : '时间'
                    }, {
                        field: 'updator_name',
                        headerName: '最后修改人'
                    }, {
                        field: 'updatetime',
                        headerName: '最后修改时间',
                        type : '时间'
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

