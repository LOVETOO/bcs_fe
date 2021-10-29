/**
 * 采购发票匹配
 * 2019-01-08
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
                            field: 'ordinal_no',
                            headerName: '采购发票流水号',
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
                        },
                        {
                            field: '',
                            headerName: '供应商',
                            children: [
                                {
                                    field: 'vendor_code',
                                    headerName: '编码',
                                    editable: false,
                                },
                                {
                                    field: 'vendor_name',
                                    headerName: '名称',
                                    editable: false,
                                }
                            ]
                        },
                        {
                            field: 'invoicet_property',
                            headerName: '发票性质',
                            editable: false,
                            hcDictCode: "invoicet_property"
                        },
                        {
                            field: 'crm_entid',
                            headerName: '品类',
                            editable: false,
                            hcDictCode: "crm_entid"
                        },
                        {
                            field: 'date_invoice',
                            headerName: '发票日期',
                            type: '日期'
                        },
                        {
                            field: 'date_bill',
                            headerName: '记帐日期',
                            type: '日期'
                        },
                        {
                            field: 'year_month',
                            headerName: '记账月份',
                            editable: false,
                        },
                        {
                            headerName: '部门',
                            children: [
                                {
                                    field: 'dept_code',
                                    headerName: '编码',
                                    editable: false,
                                },
                                {
                                    field: 'dept_name',
                                    headerName: '名称',
                                    editable: false,
                                }
                            ]
                        },
                        {
                            field: 'credence_no',
                            headerName: '凭证号',
                            editable: false,
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
                            field: 'amount_bill_f',
                            headerName: '发票金额',
                            editable: false,
                            type: "金额"
                        },
                        {
                            field: 'amount_zk_f',
                            headerName: '折扣金额',
                            editable: false,
                            type: "金额"
                        },
                        {
                            field: 'currency_name',
                            headerName: '结算货币',
                            editable: false
                        },
                        {
                            field: 'tax_rate',
                            headerName: '税率',
                            editable: false,
                            type: "百分比"
                        },
                        {
                            field: 'exch_rate',
                            headerName: '汇率',
                            editable: false,
                            type: "百分比"
                        },
                        {
                            field: 'bluered',
                            headerName: '是否红冲单',
                            editable: false,
                            type: "下拉",
                            cellEditorParams: {
                                values: ["R", "B"],
                                names: ["是", "否"]
                            }
                        },
                        // {
                        //     field: 'sourcebilltype',
                        //     headerName: '来源单据类型',
                        //     editable: false,
                        // },
                        {
                            field: 'note',
                            headerName: '备注',
                            editable: false
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
                        searchObj.bill_type = 1;
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
