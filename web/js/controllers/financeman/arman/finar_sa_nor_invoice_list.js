/**
 * 销售普通发票
 * 2019-01-10
 * huderong
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'openBizObj', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_list, openBizObj, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope, $stateParams) {
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'invoice_bill_no',
                            headerName: '发票流水号',
                            editable: false
                        },
                        {
                            field: 'refer_no',
                            headerName: '来源单号',
                            editable: false
                        },
                        {
                            field: 'invoice_no',
                            headerName: '发票号',
                            editable: false
                        }, {
                            field: 'date_bill',
                            headerName: '记帐日期',
                            editable: false,
                            type: "日期"
                        },
                        {
                            field: 'year_month',
                            headerName: '记账月份',
                            editable: false,
                        },
                        {
                            field: '',
                            headerName: '客户',
                            children: [
                                {
                                    field: 'customer_code',
                                    headerName: '编码',
                                    editable: false
                                },
                                {
                                    field: 'customer_name',
                                    headerName: '名称',
                                    editable: false
                                },
                                {
                                    field: 'tax_no',
                                    headerName: '税号',
                                    editable: false
                                },
                                {
                                    field: 'bank',
                                    headerName: '开户银行',
                                    editable: false
                                }, {
                                    field: 'bank_no',
                                    headerName: '银行账号',
                                    editable: false
                                },
                                {
                                    field: 'tax_rate',
                                    headerName: '税率',
                                    editable: false,
                                    type: "百分比"
                                },
                            ]
                        },
                        {
                            field: 'currency_name',
                            headerName: '货币名称',
                            editable: false
                        },
                        {
                            field: 'amount_goods_f',
                            headerName: '货款',
                            editable: false,
                            type: "金额"
                        },
                        {
                            field: 'amount_tax_f',
                            headerName: '税款',
                            editable: false,
                            type: "金额"
                        },
                        {
                            field: 'is_discount',
                            headerName: '是否低开',
                            editable: false,
                            type: "是否"
                        },
                        {
                            field: 'amount_apply',
                            headerName: '低开前发票额',
                            editable: false,
                            type: "金额"
                        },
                        {
                            field: 'amount_discount',
                            headerName: '低开金额',
                            editable: false,
                            type: "金额"
                        }, {
                            field: 'amount_bill_f',
                            headerName: '发票总额',
                            editable: false,
                            type: "金额"
                        },
                        {
                            field: 'income_credence_no',
                            headerName: '收入凭证号',
                            editable: false
                        },
                        {
                            field: 'cost_credence_no',
                            headerName: '成本凭证号',
                            editable: false
                        },
                        {
                            field: 'date_invoice',
                            headerName: '发票日期',
                            editable: false,
                            type: "日期"
                        },
                        {
                            field: 'sourcebilltype',
                            headerName: '单据类型',
                            hcDictCode: "ar_invoice_sourcebilltype"
                        },
                        {
                            field: 'note',
                            headerName: '备注',
                            editable: false
                        },
                        {
                            headerName: '部门',
                            children: [
                                {
                                    field: 'dept_code',
                                    headerName: '编码',
                                    editable: false
                                },
                                {
                                    field: 'dept_name',
                                    headerName: '名称',
                                    editable: false
                                }
                            ]
                        },
                        {
                            field: 'date_plan_pay',
                            headerName: '预计付款日期',
                            editable: false,
                            type: "日期"
                        },
                        {
                            field: 'created_by',
                            headerName: '创建人',
                            editable: false
                        },
                        {
                            field: 'creation_date',
                            headerName: '创建日期',
                            editable: false
                        },
                        {
                            field: 'last_updated_by',
                            headerName: '最后修改人',
                            editable: false
                        },
                        {
                            field: 'last_update_date',
                            headerName: '最后修改日期',
                            editable: false
                        }
                    ],
                    hcObjType: $stateParams.objtypeid,
                    hcBeforeRequest: function (searchObj) {
                    }
                };

                $scope.data = $scope.data || {};

                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                $scope.toolButtons.add.hide = true;
                $scope.toolButtons.delete.hide = true;
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
