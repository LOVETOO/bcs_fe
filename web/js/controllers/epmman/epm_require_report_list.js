/**
 * Created by 钟昊良 on 2019/10/19.
 * epm_require_report_list 要货订单报表
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

                //与“客户编码”关联的字段
                $scope.customerRelationField = [];

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'order_stat',
                            headerName: '订单状态',
                            hcDictCode: "epm.require_bill.order_stat"
                        },
                        {
                            field: 'sa_salebillno',
                            headerName: '要货单号'
                        },
                        {
                            field: 'date_invbill',
                            headerName: '订单日期',
                            type:'日期'
                        },
                        {
                            field: 'created_by',
                            headerName: '申请人'
                        },
                        {
                            field: 'bill_type',
                            headerName: '订单类型',
                            hcDictCode: "epm.bill_type"
                        },
                        {
                            field: 'customer_code',
                            headerName: '客户编码'
                        },
                        {
                            field: 'short_name',
                            headerName: '客户简称'
                        },
                        {
                            field: 'customer_name',
                            headerName: '客户名称'
                        },
                        {
                            field: 'dhl_no',
                            headerName: '客户自编号'
                        },
                        {
                            field: 'order_pdt_line',
                            headerName: '订单产品线',
                            hcDictCode: "epm.order_pdt_line"
                        },
                        {
                            field: 'business_type',
                            headerName: '业务类型',
                            hcDictCode: "epm.business_type"
                        },
                        {
                            field: 'trading_company_name',
                            headerName: '交易公司'
                        },
                        {
                            field: 'billing_unit_name',
                            headerName: '开票单位'
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
                            field: 'contract_type',
                            headerName: '签约方式',
                            hcDictCode: 'epm.contract_type'
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
                            field: 'division_id',
                            headerName: '事业部',
                            hcDictCode: "epm.division"
                        },
                        {
                            field: 'discount_apply_code',
                            headerName: '折扣单号'
                        },
                        {
                            field: 'discount_valid_date',
                            headerName: '折扣有效期至'
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
                            field: "entorgid",
                            headerName: "产品线",
                            hcDictCode: 'entorgid'
                        },
                        {
                            field: 'note',
                            headerName: '备注'
                        },
                        {
                            field: 'qty_bill',
                            headerName: '本次下单数量',
                            type: '数量'
                        },
                        {
                            field: 'confirm_out_qty',
                            headerName: '已发数量',
                            type: '数量'
                        },
                        {
                            //qty_bill-confirm_out_qty - cancel_qty
                            field: 'not_shipped_qty',
                            headerName: '未发数量',
                            type: '数量'
                        },
                        {
                            field: 'cancel_qty',
                            headerName: '取消数量',
                            type: '数量'
                        },
                        {
                            field: 'price_bill',
                            headerName: '标准单价(元)',
                            type: '金额'
                        },
                        {
                            field: 'base_discount_rate',
                            headerName: '出厂折扣率',
                            type: '百分比'
                        },
                        {
                            field: 'discount_rate',
                            headerName: '应用折扣率',
                            type: '百分比'
                        },
                        {
                            field: 'discounted_price',
                            headerName: '折后单价',
                            type: '金额'
                        },
                        {
                            field: 'wtamount_bill',
                            headerName: '折后金额',
                            type: '金额'
                        },
                        {
                            field: 'custom_item_code',
                            headerName: '定制产品编码'
                        }
                    ],
                    hcRequestAction: 'searchoutbillreport', //打开页面前的请求方法
                    hcDataRelationName: 'sa_out_bill_heads',
                    hcClassId: 'sa_out_bill_head',
                    hcAfterRequest:function(result){
                        result.sa_out_bill_heads.forEach(function (cur) {
                            cur.not_shipped_qty
                                = numberApi.sub(numberApi.sub(cur.qty_bill,cur.confirm_out_qty),cur.cancel_qty);
                        })
                    }
                };

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                        .then(function () {
                            //通用查询时需要根据“客户编码”过滤的字段
                            $scope.customerRelationField.push(
                                'trading_company_name',
                                'billing_unit_name',
                                'contract_code',
                                'contract_name',
                                'project_code',
                                'project_name'
                            )
                        })
                        .then(function () {
                            //如果只有一个可选用户，给客户编码、客户名称赋值
                            return requestApi.post('customer_org','search',{})
                                .then(function(result){
                                    if(result.customer_orgs && result.customer_orgs.length == 1){
                                        $scope.searchObj.customer_id = result.customer_orgs[0].customer_id;
                                        $scope.searchObj.customer_code = result.customer_orgs[0].customer_code;
                                        $scope.searchObj.customer_name = result.customer_orgs[0].customer_name;
                                    }
                                });
                        })
                };

                /*---------------------按钮隐藏--------------------------*/
                $scope.filterSetting = {};

                $scope.toolButtons.add.hide = true;
                $scope.toolButtons.delete.hide = true;
                $scope.toolButtons.openProp.hide = true;
                $scope.toolButtons.filter.hide = true;
                $scope.toolButtons.refresh.hide = true;

                $scope.toolButtonGroups.more.hide = true;

                /*---------------------事件定义--------------------------*/
                /**
                 * 清空与“客户编码”关联的查询条件
                 */
                $scope.clearCustomerRelation = function () {
                    $scope.customerRelationField.forEach(function (cur) {
                        $scope.searchObj[cur] = '';
                    });
                };

                /**
                 * 日期合理性验证
                 */
                $scope.checkDate = function (field) {
                    if ($scope.searchObj.date_invbill_start
                        && $scope.searchObj.date_invbill_end
                        && ($scope.searchObj.date_invbill_start > $scope.searchObj.date_invbill_end)) {
                        $scope.searchObj[field] = '';
                        return swalApi.info('起始时间不能大于结束时间');
                    }
                };

                /*---------------------通用查询--------------------------*/
                /**
                 * 通用查询
                 */
                $scope.commonSearch = {
                    /*客户编码*/
                    customer_org: {
                        afterOk: function (result) {
                            if ($scope.searchObj.customer_code != result.customer_code) {
                                $scope.clearCustomerRelation();
                            }
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
                            search_flag: 1,
                            customer_id: function () {
                                return $scope.searchObj.customer_id;
                            }
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
                            ],
                            hcBeforeRequest: function (searchObj) {
                                if ($scope.searchObj.customer_id) {
                                    searchObj.customer_id = $scope.searchObj.customer_id;
                                }
                            }
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
                            ],
                            hcBeforeRequest: function (searchObj) {
                                if ($scope.searchObj.customer_id) {
                                    searchObj.customer_id = $scope.searchObj.customer_id;
                                }
                                if ($scope.searchObj.trading_company_id) {
                                    searchObj.trading_company_id = $scope.searchObj.trading_company_id;
                                }
                            }
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
                            if ($scope.searchObj.customer_id) {
                                sqlwhere += ' and customer_id = ' + $scope.searchObj.customer_id;
                            }
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
                        beforeOk: function (result) {
                            $scope.searchObj.contract_code = result.contract_code;
                            $scope.searchObj.contract_name = result.contract_name;
                        }
                    },
                    /* 项目查询 */
                    project_code: {
                        sqlWhere: function () {
                            var sqlwhere = " project_valid in (2,4) ";
                            if ($scope.searchObj.customer_id) {
                                sqlwhere += ' and customer_id = ' + $scope.searchObj.customer_id;
                            }
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
