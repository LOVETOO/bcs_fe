/**
 * Created by 钟昊良 on 2019/10/21.
 * epm_out_bill_report_list 出库单报表
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_list, swalApi, requestApi) {
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
                            field: 'invbillno',
                            headerName: 'ERP出库单号'
                        },
                        {
                            field: 'date_invbill',
                            headerName: '发货日期',
                            type: '日期'
                        },
                        {
                            field: 'qty_sum',
                            headerName: '总数量',
                            type: '数量'
                        },
                        {
                            field: 'wtamount_total_f',
                            headerName: '总金额',
                            type: '金额'
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
                            field: 'short_name',
                            headerName: '客户简称'
                        },
                        /* {
                         field: 'division_id',
                         headerName: '事业部',
                         hcDictCode:'epm.division'
                         },*/
                        {
                            field: 'sa_salebillno',
                            headerName: '要货单号'
                        },
                        {
                            field: 'order_type',
                            headerName: '订单类型',
                            hcDictCode: "epm.bill_type"
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
                            field: 'specs',
                            headerName: '规格'
                        },
                        {
                            field: 'item_model',
                            headerName: '型号'
                        },
                        {
                            field: 'item_color',
                            headerName: '颜色'
                        },
                        {
                            field: 'batch_no',
                            headerName: '色号'
                        },
                        {
                            field: 'qty_bill',
                            headerName: '实发数量',
                            type: '数量'
                        },
                        {
                            field: 'uom_name',
                            headerName: '单位'
                        },
                        {
                            field: 'price_bill_f',
                            headerName: '标准单价',
                            type: '金额'
                        },
                        {
                            field: 'discount_tax',
                            headerName: '应用折扣率',
                            type: '百分比'
                        },
                        {
                            field: 'wtpricec_bill_f',
                            headerName: '折后单价',
                            type: '金额'
                        },
                        {
                            field: 'wtamount_bill_f',
                            headerName: '折后金额',
                            type: '金额'
                        },
                        /*{
                         field: 'cubage',
                         headerName: '体积',
                         type: '体积'
                         },*/
                        {
                            field: 'total_cubage',
                            headerName: '总体积',
                            type: '体积'
                        },
                        {
                            field: 'weight',
                            headerName: '总重量',
                            type: '数量'
                        },
                        {
                            //产品小类名
                            field: 'item_class_name',
                            headerName: '品类'
                        },
                        {
                            field: 'delivery_base',
                            headerName: '发货基地'
                        },
                        {
                            field: 'plate_number',
                            headerName: '车牌号'
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
                            field: 'contract_code',
                            headerName: '合同编码'
                        },
                        {
                            field: 'contract_name',
                            headerName: '合同名称'
                        },
                        {
                            field: 'legal_entity_code',
                            headerName: '法人客户编码'
                        },
                        {
                            field: 'legal_entity_name',
                            headerName: '法人客户名称'
                        }
                    ],
                    hcRequestAction: 'searchoutbillreport', //打开页面前的请求方法
                    hcDataRelationName: 'inv_out_bill_heads',
                    hcClassId: 'inv_out_bill_head',
                    hcAfterRequest: function (response) {//请求完表格事件后触发
                        requestApi.getDict('epm.division')
                            .then(function (dicts) {
                                response.inv_out_bill_heads.forEach(function (cur, idx) {
                                    var dict = dicts.find(function (curDict) {
                                        return curDict.dictvalue == cur.division_id;
                                    });

                                    // 设置拼接字段  客户简称-事业部名称
                                    if (dict) {
                                        var division_name = dict.dictname;
                                        response.inv_out_bill_heads[idx].shortNameAndDivision += '-' + division_name;
                                    }
                                });
                                $scope.gridOptions.hcApi.setRowData(response.inv_out_bill_heads);
                            });
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
                                'legal_entity_code',
                                'legal_entity_name',
                                'contract_code',
                                'contract_name'
                            )
                        })
                        .then(function () {
                            //如果只有一个可选用户，给客户编码、客户名称赋值
                            return requestApi.post('customer_org', 'search', {})
                                .then(function (result) {
                                    if (result.customer_orgs && result.customer_orgs.length == 1) {
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
                    /* 发货基地(交易公司)查询
                     * 有“客户编码”时，只查询该客户资料明细-开票单位下的交易公司
                     * */
                    epm_discount_apply: {
                        title: '发货基地',
                        postData: {
                            search_flag: 1,
                            customer_id: function () {
                                return $scope.searchObj.customer_id;
                            }
                        },
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "发货基地编码",
                                    field: "trading_company_code"
                                }, {
                                    headerName: "发货基地名称",
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
                        action: 'getpanelfielddata',
                        afterOk: function (result) {
                            $scope.searchObj.delivery_base = result.trading_company_name;
                        }
                    },
                    /* 法人客户(开票单位)查询
                     * 有“客户编码”时，只查询客户资料明细-开票单位下的开票单位
                     * */
                    legal_entity: {
                        title: '法人客户',
                        postData: {
                            search_flag: 2
                        },
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "法人客户编码",
                                    field: "legal_entity_code"
                                }, {
                                    headerName: "法人客户名称",
                                    field: "legal_entity_name"
                                }
                            ],
                            hcBeforeRequest: function (searchObj) {
                                if ($scope.searchObj.customer_id) {
                                    searchObj.customer_id = $scope.searchObj.customer_id;
                                }
                            }
                        },
                        dataRelationName: 'panel_fields',
                        action: 'getpanelfielddata',
                        afterOk: function (result) {
                            $scope.searchObj.legal_entity_id = result.legal_entity_id;
                            $scope.searchObj.legal_entity_code = result.legal_entity_code;
                            $scope.searchObj.legal_entity_name = result.legal_entity_name;
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
