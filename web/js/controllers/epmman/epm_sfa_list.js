/**
 * 战略合作协议
 * 2019/6/18
 * zengjinhua
 * update_by : zengjinhua
 * update_time : 2019-07-19
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        /**
         * 控制器
         */
        var EpmAutotrophyContractList = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'stat',
                        headerName: '审核状态',
                        hcDictCode:'stat'
                    },{
                        field: 'contract_code',
                        headerName: '合同编码'
                    }, {
                        field: 'contract_name',
                        headerName: '合同名称'
                    },  {
                        field: 'signed_date',
                        headerName: '签订时间',
                        type:'日期'
                    }, {
                        field: 'signed_location',
                        headerName: '签订地点'
                    }, {
                        field: 'project_code',
                        headerName: '战略项目编码'
                    }, {
                        field: 'project_name',
                        headerName: '战略项目名称'
                    },{
							field: 'contract_effect_date',
                            headerName: '合作开始时间',
                            type:'日期'
                    }, {
							field: 'contract_expire_date',
                            headerName: '合作结束时间',
                            type:'日期'
                    }, {
                            field: 'contract_amt',
                            headerName: '合同总额',
                            type:'金额'
                    }, {
                            field: 'deposit_amt',
                            headerName: '履约金',
                            type:'金额'
                    }, {
                            field: 'performance_bond',
                            headerName: '履约保证金金额',
                            type:'金额'
                        }, {
                            field: 'retention_money_ratio',
                            headerName: '质保金比例',
                            type : '百分比'
                        }, {
                            field: 'retention_money',
                            headerName: '质保金金额',
                            type:'金额'
                        }
                        , {
                            field: 'goods_scope',
                            headerName: '供货范围'
                        }, {
                            field: 'remark',
                            headerName: '备注'
                        },{
                            headerName:'甲方',
                            children:[{
                                field: 'party_a_name',
                                headerName: '名称'
                            }, {
                                field: 'party_a_address',
                                headerName: '地址'
                            }, {
                                field: 'party_a_legal_person',
                                headerName: '法定代表人/委托代理人'
                            }
                                /*, {
                                    field: 'party_a_agent_person',
                                    headerName: '委托代理人'
                                }*/
                                , {
                                    field: 'party_a_phone',
                                    headerName: '电话'
                                }]
                        },{
                            headerName:'乙方',
                            children:[{
                                field: 'party_b_name',
                                headerName: '名称'
                            }, {
                                field: 'party_b_address',
                                headerName: '地址'
                            }, {
                                field: 'party_b_legal_person',
                                headerName: '法定代表人/委托代理人'
                            }
                                /*, {
                                    field: 'party_b_agent_person',
                                    headerName: '委托代理人'
                                }*/
                                , {
                                    field: 'party_b_phone',
                                    headerName: '电话'
                                }]
                        },{
                            headerName:'交收信息',
                            children:[{
                                field: 'shipping_type',
                                headerName: '运输方式',
                                hcDictCode:'epm.shipping_type'
                            }, {
                                field: 'delivery_type',
                                headerName: '交货方式',
                                hcDictCode:'epm.delivery_type'
                            }, {
                                field: 'shipping_remark',
                                headerName: '运输说明'
                            }, {
                                field: 'delivery_place',
                                headerName: '交货地点'
                            }, {
                                field: 'receiving_party',
                                headerName: '收货人'
                            }, {
                                field: 'receiving_party_phone',
                                headerName: '联系方式'
                            }, {
                                field: 'warranty_period',
                                headerName: '质保期(年)',
                                type:'年'
                            }, {
                                field: 'warranty_remark',
                                headerName: '质保期说明'
                            }]
                        },{
                            headerName:'付款信息',
                            children:[{
                                field: 'payment_way',
                                headerName: '付款方式',
                                hcDictCode : 'epm.payment_way'
                            }, {
                                field: 'receiving_bank',
                                headerName: '付款方银行名称'
                            }, {
                                field: 'receiving_account',
                                headerName: '付款方银行账号'
                            }, {
                                field: 'payment_remark',
                                headerName: '付款说明'
                            }]
                        },{
                            headerName:'开票信息',
                            children:[
                                /*{
                                field: 'payment_unit_name',
                                headerName: '打款单位名称'
                            }, */
                                {
                                    field: 'billing_unit_name',
                                    headerName: '开票单位名称'
                                }, {
                                    field: 'tax_identify_num',
                                    headerName: '纳税识别号'
                                }, {
                                    field: 'billing_address',
                                    headerName: '单位地址'
                                }, {
                                    field: 'billing_phone',
                                    headerName: '电话'
                                }, {
                                    field: 'billing_bank',
                                    headerName: '开户银行'
                                }, {
                                    field: 'billing_account',
                                    headerName: '银行账号'
                                }]
                        }, {
                            field: 'creator_name',
                            headerName: '创建人'
                        }, {
                            field: 'createtime',
                            headerName: '创建时间',
                            type:'时间'
                        }, {
                            field: 'updator_name',
                            headerName: '修改人'
                        }, {
                            field: 'updatetime',
                            headerName: '修改时间',
                            type:'时间'
                        }],
                    hcPostData: {
                        is_frame : 2
                    }
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
            controller: EpmAutotrophyContractList
        });
    });

