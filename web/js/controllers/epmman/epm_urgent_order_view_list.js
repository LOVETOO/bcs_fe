/**
 * 订单紧急要货报表
 * zengjinhua
 * 2019/12/23
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'swalApi', 'requestApi', 'numberApi'],
    function (module, controllerApi, base_obj_list, swalApi, requestApi, numberApi) {
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
                        },
                        {
                            field: 'intf_result',
                            headerName: '接口状态',
                            type : '词汇',
                            cellEditorParams:{
                                names:['失败','成功'],
                                values:['E','S']
                            }
                        },
                        {
                            field: 'intf_info',
                            headerName: '接口处理信息',
                            suppressAutoSize: true,
                            suppressSizeToFit: true,
                            width : 150
                        },
                        {
                            field: 'urgent_order_billno',
                            headerName: '紧急要货单号'
                        },
                        {
                            field: 'sa_salebillno',
                            headerName: '要货单号'
                        },
                        {
                            field: 'date_approval',
                            headerName: '审批日期',
                            type : '时间'
                        },
                        {
                            field: 'date_invbill',
                            headerName: '订单日期',
                            type : '日期'
                        },
                        {
                            field: 'customer_code',
                            headerName: '客户编码'
                        },
                        {
                            field: 'customer_name',
                            headerName: '客户名称'
                        },
                        {
                            field: 'trading_company_name',
                            headerName: '交易公司'
                        },
                        {
                            field: 'contract_code',
                            headerName: '合同编码'
                        },
                        {
                            field: 'contract_name',
                            headerName: '合同名称'
                        },
                        {
                            field: 'project_code',
                            headerName: '项目编码'
                        },
                        {
                            field: 'project_name',
                            headerName: '项目名称'
                        },
                        {
                            field: 'billing_unit_name',
                            headerName: '开票单位'
                        },
                        {
                            field: 'bill_type',
                            headerName: '订单类型',
                            hcDictCode : 'epm.bill_type'
                        },
                        {
                            field: 'order_stat',
                            headerName: '订单状态',
                            hcDictCode : 'epm.require_bill.order_stat'
                        },
                        {
                            field: 'in_date',
                            headerName: '期望到达日期',
                            type : '日期'
                        },
                        {
                            field: 'remark',
                            headerName: '备注'
                        },
                        {
                            field: 'item_code',
                            headerName: '产品编码'
                        }, 
                        {
                            field: 'item_name',
                            headerName: '产品名称'
                        },
                        {
                            field: 'entorgid',
                            headerName: '产品线',
                            hcDictCode : 'entorgid'
                        },
                        {
                            field: 'model',
                            headerName: '型号'
                        },
                        {
                            field: 'uom_name',
                            headerName: '单位'
                        },
                        {
                            field: 'qty_bill',
                            headerName: '订单数量',
                            type : '数量'
                        },
                        {
                            field: 'confirm_out_qty',
                            headerName: '已出库数量',
                            type : '数量'
                        },
                        {
                            field: 'cancel_qty',
                            headerName: '取消数量',
                            type : '数量'
                        },
                        {
                            field: 'not_shipped_qty',
                            headerName: '未出库数量',
                            type : '数量'
                        },
                        {
                            field: 'urgent_qty',
                            headerName: '紧急要货数量',
                            type : '数量'
                        },
                        {
                            field: 'discounted_price',
                            headerName: '折后单价',
                            type : '金额'
                        },
                        {
                            field: 'urgent_discounted_amount',
                            headerName: '紧急要货折后金额',
                            type : '金额'
                        },
                        {
                            field: 'pick_up_date',
                            headerName: '提货时间回复',
                            type : '日期' 
                        },
                        {
                            field: 'delivery_base_name',
                            headerName: '发货基地'
                        },
                        {
                            field: 'reserved_qty',
                            headerName: '当前保留数量',
                            type : '数量'
                        },
                        {
                            field: 'pre_reserved_qty',
                            headerName: '当前预占数量',
                            type : '数量'
                        },
                        {
                            field: 'released_qty',
                            headerName: '已释放数量',
                            type : '数量'
                        },
                        {
                            field: 'valid_date',
                            headerName: '有效期至',
                            type : '日期'
                        },
                        {
                            field: 'is_cancel',
                            headerName: '有效否',
                            type : '词汇',
                            cellEditorParams:{
                                names:['失效'],
                                values:['2']
                            }
                        }
                    ],
                    hcRequestAction: 'seleteview', //打开页面前的请求方法
                    hcDataRelationName: 'epm_urgent_orders',
                    hcClassId: 'epm_urgent_order'
                };

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                /*---------------------按钮隐藏--------------------------*/
                $scope.toolButtons.add.hide = true;
                $scope.toolButtons.delete.hide = true;
                $scope.toolButtons.openProp.hide = true;
                $scope.toolButtons.filter.hide = true;
                $scope.toolButtons.refresh.hide = true;

                $scope.toolButtonGroups.more.hide = true;

                /*---------------------通用查询--------------------------*/
                /**
                 * 通用查询
                 */
                $scope.commonSearch = {
                    /*客户编码*/
                    customer_org: {
                        afterOk: function (result) {
                            $scope.searchObj.customer_id = result.customer_id;
                            $scope.searchObj.customer_code = result.customer_code;
                            $scope.searchObj.customer_name = result.customer_name;
                        }
                    },
                    /* 交易公司查询
                     * 有“客户编码”时，只查询该客户资料明细-开票单位下的交易公司
                     * */
                    trading_company_name: {
                        title: '交易公司',
                        postData: {
                            search_flag: 1
                        },
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "交易公司编码",
                                    field: "trading_company_code"
                                }, {
                                    headerName: "交易公司名称",
                                    field: "trading_company_name"
                                }
                            ]
                        },
                        dataRelationName: 'panel_fields',
                        action: 'getfieldforpanel',
                        afterOk: function (result) {
                            $scope.searchObj.trading_company_id = result.trading_company_id;
                            $scope.searchObj.trading_company_name = result.trading_company_name;
                        }
                    },
                    /* 开票单位查询
                     * 有“客户编码”时，只查询客户资料明细-开票单位下的开票单位
                     * */
                    billing_unit_name: {
                        title: '开票单位',
                        postData: {
                            search_flag: 2
                        },
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "开票单位编码",
                                    field: "legal_entity_code"
                                }, {
                                    headerName: "开票单位名称",
                                    field: "legal_entity_name"
                                }
                            ]
                        },
                        dataRelationName: 'panel_fields',
                        action: 'getfieldforpanel',
                        afterOk: function (result) {
                            $scope.searchObj.billing_unit_id = result.legal_entity_id;
                            $scope.searchObj.billing_unit_name = result.legal_entity_name;
                        }
                    },
                    /* 合同查询 */
                    contract_code: {
                        sqlWhere: function () {
                            var sqlwhere = "valid = 2 and is_frame <> 2 and contract_character = 'AR'";
                            return sqlwhere;
                        },
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "工程合同编码",
                                    field: "contract_code"
                                }, {
                                    headerName: "工程合同名称",
                                    field: "contract_name"
                                }, {
                                    headerName: "工程编码",
                                    field: "project_code"
                                }, {
                                    headerName: "工程名称",
                                    field: "project_name"
                                }, {
                                    headerName: "签约类型",
                                    field: "contract_type",
                                    hcDictCode: 'epm.contract_type'
                                }, {
                                    headerName: "签约时间",
                                    field: "signed_date",
                                    type: '日期'
                                }
                            ]
                        },
                        afterOk: function (result) {
                            $scope.searchObj.contract_code = result.contract_code;
                            $scope.searchObj.contract_name = result.contract_name;
                        }
                    },
                    /* 项目查询 */
                    project_code: {
                        sqlWhere: function () {
                            var sqlwhere = " project_valid in (2,4) ";
                            return sqlwhere;
                        },
                        postData: function () {
                            return {
                                report_type: 1
                            };
                        },
                        afterOk: function (proj) {
                            $scope.searchObj.project_code = proj.project_code;
                            $scope.searchObj.project_name = proj.project_name;
                        }
                    },
                    /* 产品查询 */
                    item_code: {
                        postData: function () {
                            return {
                                need_price: 2
                            };
                        },
                        afterOk: function (item) {
                            $scope.searchObj.item_code = item.item_code;
                            $scope.searchObj.item_name = item.item_name;
                        }
                    }
                };

            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.registerController({
            module: module,
            controller: controller
        });
    }
);
