/**
 * 项目开票申请 列表页
 * 2019/7/4
 * shenguocheng
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
                            field: 'audit_stat',
                            headerName: '审核状态',
                            cellStyle: {
                                'text-align': 'center'
                            }
                        }, {
                            field: 'translate_out_stat',
                            headerName: '请求发送状态',
                            cellStyle:function (args) {
                                return {
                                    'color':args.data.translate_out_stat == "失败" ? "#F35A05" : "#333",
                                    'text-align': 'center'
                                }
                            }
                        }, {
                            field: 'invoice_apply_code',
                            headerName: '申请单号'
                        }, {
                            field: 'creator_name',
                            headerName: '申请人'
                        }, {
                            field: 'createtime',
                            headerName: '申请时间',
                            type : '日期'
                        }, {
                            field: 'customer_code',
                            headerName: '客户编码'
                        }, {
                            field: 'customer_name',
                            headerName: '客户名称'
                        }, {
                            field: 'invoice_make_out_type',
                            headerName: '开票类型',
                            hcDictCode: 'epm.invoice_make_out_type'
                        }, {
                            field: 'legal_entity_code',
                            headerName: '法人客户编码'
                        }, {
                            field: 'legal_entity_name',
                            headerName: '法人客户名称'
                        }, {
                            field: 'gl_date',
                            headerName: 'GL日期',
                            type:'日期'
                        }, {
                            field: 'trx_number',
                            headerName: '事务处理编号'
                        }, {
                            field: 'trading_company_name',
                            headerName: '交易公司'
                        }, {
                            field: 'invoice_number',
                            headerName: '发票号'
                        }, {
                            field: 'invoice_time',
                            headerName: '审核日期'
                        }, {
                            field: 'remittances_received',
                            headerName: '已汇款',
                            type : '是否'
                        }, {
                            field: 'apply_note',
                            headerName: '申请说明'
                        }, {
                            field: 'creator_name',
                            headerName: '创建人'
                        }, {
                            field: 'createtime',
                            headerName: '创建时间'
                        }, {
                            field: 'updator_name',
                            headerName: '修改人'
                        }, {
                            field: 'updatetime',
                            headerName: '修改时间'
                        }
                    ]
                };

                //继承控制器
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
    }
);