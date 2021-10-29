/**
 * 应收账款明细报表
 * date:2019-01-16
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', 'openBizObj', 'strApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, openBizObj, strApi) {
        'use strict';

        var controller = [
                //声明依赖注入
                '$scope',
                //控制器函数
                function ($scope) {
                    $scope.data = {};
                    $scope.data.currItem = {};
                    $scope.gridOptions = {
                        columnDefs: [
                            {

                                id: 'seq',
                                type: '序号'
                            }, {
                                field: 'date_sum',
                                headerName: '日期',
                                type: '日期'
                            }, {
                                field: 'brief',
                                headerName: '摘要'
                            },
                            {
                                field: 'crm_entid',
                                headerName: '品类',
                                hcDictCode: 'crm_entid'
                            },
                            {
                                headerName: '已开票/含税',
                                children: [
                                    {
                                        field: 'debit',
                                        headerName: '应收',
                                        type: '金额'
                                    },
                                    {
                                        field: 'creditor',
                                        headerName: '实收',
                                        type: '金额'
                                    },
                                    {
                                        field: 'balance',
                                        headerName: '余额',
                                        type: '金额'
                                    }
                                ]
                            },
                            {
                                headerName: '未开票/含税',
                                children: [
                                    {
                                        field: 'debit_f',
                                        headerName: '出库金额',
                                        type: '金额'
                                    },
                                    {
                                        field: 'creditor_f',
                                        headerName: '匹配金额',
                                        type: '金额'
                                    },
                                    {
                                        field: 'balance_f',
                                        headerName: '余额',
                                        type: '金额'
                                    }
                                ]
                            },
                            {
                                field: 'credence_no',
                                headerName: '凭证号'
                            },
                            {
                                field: 'remark',
                                headerName: '备注'
                            }
                        ],
                        hcRequestAction: "getdata",
                        hcClassId: "ar_month_invoice_business",
                        hcBeforeRequest: function (searchObj) {
                            angular.extend(searchObj, $scope.data.currItem);
                        },
                        hcSearchWhenReady: false,
                        onRowDoubleClicked: function (args) {
                            // openBizObj({
                            //     stateName: 'proman.inv_in_bill_red_prop',
                            //     params:{title:"xxxxxx"}
                            // });
                        },
                        hcEvents: {
                            //双击事件
                            cellDoubleClicked: function (params) {
                                console.log('cellDoubleClicked：' + params.colDef.field);
                                console.log(params);

                                if (!params.colDef.onCellDoubleClicked) {
                                    return showDetail(params.data.proj_ecn_id);
                                }
                            }
                        }
                    };

                    function showDetail(id) {
                        // return BasemanService.openModal({
                        //     url: '/index.jsp#invman/proj_ecn/' + id,
                        //     title: '来源单据',
                        //     obj: $scope
                        // });
                    }

                    $scope.gridOptions1 = {
                        columnDefs: [{
                            type: '序号'
                        }, {
                            headerName: "单据号",
                            field: "bill_no",
                            pinned: 'left'
                        }, {
                            headerName: "单据类型",
                            field: "bill_type",
                            pinned: 'left'
                        }, {
                            headerName: "产品编码",
                            field: "item_code",
                            pinned: 'left'
                        }, {
                            headerName: "产品名称",
                            field: "item_name",
                            pinned: 'left'
                        },
                            {
                                headerName: "数量",
                                field: "sum_qty",
                                type: "数量"
                            },
                            {
                                headerName: "客户编码",
                                field: "customer_code"
                            }, {
                                id: 'customer_name',
                                headerName: "客户名称",
                                field: "customer_name"
                            },
                            {
                                headerName: "仓库编码",
                                field: "warehouse_code"
                            }, {
                                headerName: "仓库名称",
                                field: "warehouse_name"
                            },
                            {
                                headerName: "开单价",
                                field: "price_bill"
                            },
                            {
                                headerName: "开单金额",
                                field: "amount_bill"
                            },
                            {
                                headerName: "单据月份",
                                field: "year_month"
                            },
                            {
                                headerName: "品类",
                                field: "crm_entid"
                            },
                            {
                                headerName: "产品线",
                                field: "entorgid"
                            }, {
                                headerName: "创建人",
                                field: "creator"
                            },
                            {
                                headerName: "创建时间",
                                field: "create_date"
                            }
                        ]
                    };

                    controllerApi.extend({
                        controller: base_diy_page.controller,
                        scope: $scope
                    });

                    /** 初始化数据 **/
                    $scope.data.currItem.ar_flag_is_off = 2;
                    $scope.data.currItem.ar_flag_is_on = 2;
                    $scope.data.currItem.ar_flag = 0;
                    $scope.data.currItem.beginyear_month = new Date().Format('yyyy-MM');
                    $scope.data.currItem.endyear_month = new Date().Format('yyyy-MM');

                    /**
                     * 查总公司
                     * @type {{afterOk: afterOk}}
                     */
                    $scope.chooseGroupCustomer = {
                        postData: {
                            sqlwhere: " nvl(Is_GroupCustomer,0)=2 ",
                            search_flag: 5
                        },
                        dataRelationName: "customer_orgofcustomer_orgs",
                        afterOk: function (response) {
                            ['customer_id', 'customer_name', 'customer_code'].forEach(function (value) {
                                $scope.data.currItem['group_' + value] = response [value];
                            });
                            // $scope.data.currItem.sqlwhere = " nvl(Is_GroupCustomer,0)=2 and Group_Customer_Code = '" + $scope.data.currItem.group_customer_code + "' ";
                        }
                    };

                    /**
                     * 查客户
                     * @type {{afterOk: afterOk}}
                     */
                    $scope.chooseCustomer = {
                        dataRelationName: "customer_orgs",
                        checkbox: true,
                        afterOk: function (customers) {
                            var customer_code = "";
                            var customer_name = "";
                            var customer_id = 0;
                            $scope.data.currItem.customer_ids = "";
                            if (customers.length && customers.length > 1) {
                                customer_id = 0;
                                var sqlwhere = " Customer_id IN (";
                                var clength = customers.length;
                                customers.forEach(function (customer, i) {
                                    customer_code += customer['customer_code'] + ","
                                    customer_name += customer['customer_name'] + ","
                                    $scope.data.currItem.customer_ids += customer['customer_id'] + ",";
                                    sqlwhere += " " + customer['customer_id'] + " ";
                                    sqlwhere += i == clength - 1 ? "" : ",";
                                })
                                sqlwhere += " ) ";
                                $scope.data.currItem.sqlwhere = sqlwhere;
                                $scope.is_mutiplyCustomer = true;
                            }
                            else {
                                customer_id = customers[0].customer_id;
                                customer_code = customers[0].customer_code;
                                customer_name = customers[0].customer_name;
                                $scope.is_mutiplyCustomer = false;
                            }
                            $scope.data.currItem.customer_id = customer_id;
                            $scope.data.currItem.customer_code = customer_code;
                            $scope.data.currItem.customer_name = customer_name;
                        }
                    };

                    //添加按钮
                    $scope.toolButtons = {

                        search: {
                            title: '查询',
                            icon: 'fa fa-search',
                            click: function () {
                                $scope.searchClick && $scope.searchClick();
                            }
                        },

                        export: {
                            title: '导出',
                            icon: 'glyphicon glyphicon-log-out',
                            click: function () {
                                $scope.export && $scope.export();
                            }

                        }

                    };


                    /**
                     * 查询按钮点击事件
                     */
                    $scope.searchClick = function () {
                        if (strApi.isNull($scope.data.currItem.customer_code) && strApi.isNull($scope.data.currItem.group_customer_code)) {
                            swalApi.info("请先选择总公司或者客户");
                            return;
                        }
                        $scope.data.currItem.year_month = $scope.data.current_period;
                        $scope.search();
                    }
                    // 查询
                    $scope.search = function () {
                        if ($scope.is_mutiplyCustomer && strApi.isNotNull($scope.data.currItem.customer_ids) && strApi.isNotNull($scope.data.currItem.customer)) {
                            $scope.gridOptions.hcRequestAction = "getdatabymutiplycustomer"; //根据多个客户去查询数据；
                        }
                        else {
                            $scope.gridOptions.hcRequestAction = "getdata";
                        }
                        $('#tab11').tab('show');
                        $scope.data.lines = [];
                        return $scope.gridOptions.hcApi.search();
                    };


                    $scope.refresh = function () {
                        $scope.search();
                    }


                    $scope.export = function () {
                        $scope.gridOptions.hcApi.exportToExcel();
                    }

                    $scope.data.lines = [];

                    /**
                     *是否开单checkbox选择事件
                     * ar_flag :1 为已开票
                     * @constructor
                     */
                    $scope.ChangeAr_flag = function (flag) {
                        if (parseInt($scope.data.currItem.ar_flag_is_off) === parseInt($scope.data.currItem.ar_flag_is_on)) {//全部显示
                            $scope.data.currItem.ar_flag = 0;
                            $scope.gridOptions.columnApi.setColumnsVisible(['debit', 'creditor', 'balance', 'debit_f', 'creditor_f', 'balance_f'], true);
                        }
                        // else if ($scope.data.currItem.ar_flag_is_off === $scope.data.currItem.ar_flag_is_on && $scope.data.currItem.ar_flag_is_on === 1) { //全部不显示
                        //     $scope.data.currItem.ar_flag = 0;
                        //     $scope.gridOptions.columnApi.setColumnsVisible(['debit', 'creditor', 'balance', 'debit_f', 'creditor_f', 'balance_f'], false);
                        // }
                        else if ($scope.data.currItem.ar_flag_is_off === 1 && $scope.data.currItem.ar_flag_is_on === 2) { //只显示已开票
                            $scope.data.currItem.ar_flag = 1;
                            $scope.gridOptions.columnApi.setColumnsVisible(['debit', 'creditor', 'balance'], true);
                            $scope.gridOptions.columnApi.setColumnsVisible(['debit_f', 'creditor_f', 'balance_f'], false);
                        }
                        else if ($scope.data.currItem.ar_flag_is_off === 2 && $scope.data.currItem.ar_flag_is_on === 1) {//只显示未开票
                            $scope.data.currItem.ar_flag = 2;
                            $scope.gridOptions.columnApi.setColumnsVisible(['debit', 'creditor', 'balance'], false);
                            $scope.gridOptions.columnApi.setColumnsVisible(['debit_f', 'creditor_f', 'balance_f'], true);
                        }
                        $scope.search();
                    };


                    /** 查出当前应付期间 **/
                    requestApi.post("gl_account_period", "search", {sqlwhere: " is_current_period_ar=2 "})
                        .then(function (data) {
                            $scope.data.current_period = data.gl_account_periods[0].year_month;
                            $scope.data.currItem.year_month = data.gl_account_periods[0].year_month;
                            $scope.data.currItem.beginyear_month = $scope.data.currItem.year_month;
                            $scope.data.currItem.endyear_month = $scope.data.currItem.year_month;
                        })
                }
            ]
        ;

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);