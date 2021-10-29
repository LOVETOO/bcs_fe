/**
 * 应收账款报表
 * huderong
 * date:2019-01-22
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', 'numberApi', 'openBizObj', 'directive/hcTab',
        'directive/hcTabPage'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, numberApi, openBizObj) {
        'use strict';

        var controller = [
                //声明依赖注入
                '$scope', '$stateParams', '$q',
                //控制器函数
                function ($scope, $stateParams, $q) {
                    $scope.data = {};
                    $scope.data.currItem = {};
                    $scope.gridOptions = {
                        pinnedBottomRowData: [{seq: "合计"}],
                        columnDefs: [{
                            id: 'seq',
                            type: '序号'
                        }, {
                            field: 'customer_code',
                            headerName: '客户编码'
                        }, {
                            field: 'customer_name',
                            headerName: '客户名称'
                        }, {
                            field: 'group_customer_code',
                            headerName: '总公司编码'
                        }, {
                            field: 'group_customer_name',
                            headerName: '总公司名称'
                        }, {
                            field: 'dept_code',
                            headerName: '部门编码'
                        }, {
                            field: 'dept_name',
                            headerName: '部门名称'
                        }, {
                            field: 'sale_employee_name',
                            headerName: '业务员名称'
                        },
                            {
                                field: 'sale_area_name',
                                headerName: '所属销售区域'
                            },
                            {
                                headerName: '已开票/含税',
                                children: [
                                    {
                                        field: 'amount_lm',
                                        headerName: '本期期初'
                                    },
                                    {
                                        field: 'amount_in',
                                        headerName: '本期发生额'
                                    },
                                    {
                                        field: 'amount_out',
                                        headerName: '本期付款额'
                                    },
                                    {
                                        field: 'amount_blnc',
                                        headerName: '本期结余'
                                    }
                                ]
                            },
                            {
                                headerName: '未开票/含税',
                                children: [
                                    {
                                        field: 'amount_lm_nobill',
                                        headerName: '本期期初'
                                    },
                                    {
                                        field: 'amount_in_nobill',
                                        headerName: '本期发生额'
                                    },
                                    {
                                        field: 'amount_out_nobill',
                                        headerName: '本期付款额'
                                    },
                                    {
                                        field: 'amount_blnc_nobill',
                                        headerName: '本期结余'
                                    }
                                ]
                            },
                            {
                                field: 'amount_sum',
                                headerName: '合计'
                            },
                            // {
                            //     field: 'remark',
                            //     headerName: '备注'
                            // }
                        ],
                        hcObjType: $stateParams.objtypeid,
                        hcClassId: "ar_month_sum",
                        hcRequestAction: "getarmonthsumdata",
                        hcBeforeRequest: function (searchObj) {
                            angular.extend(searchObj, $scope.data.currItem);
                        },
                        hcAfterRequest: countSum,
                        hcSearchWhenReady: false,
                        onRowDoubleClicked: function (args) {
                        }
                    };

                    controllerApi.extend({
                        controller: base_diy_page.controller,
                        scope: $scope
                    });

                    /** 初始化数据 **/
                    $scope.tabs_detail = {
                        lines: {
                            title: "明细",
                            active: true
                        },
                        collect: {
                            title: "汇总"
                        }
                    };
                    $scope.data.currItem.ap_flag_is_off = 2;
                    $scope.data.currItem.ap_flag_is_on = 2;
                    $scope.data.currItem.order_type = 0;
                    $scope.data.currItem.year_month = new Date().Format('yyyy-MM');
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
                            }
                            else {
                                customer_id = customers[0].customer_id;
                                customer_code = customers[0].customer_code;
                                customer_name = customers[0].customer_name;
                            }
                            $scope.data.currItem.customer_id = customer_id;
                            $scope.data.currItem.customer_code = customer_code;
                            $scope.data.currItem.customer_name = customer_name;
                        }
                    };

                    /**
                     * 通用查询 - 销售区域
                     */
                    $scope.chooseSaleArea = {
                        dataRelationName: "sale_saleareas",
                        afterOk: function (response) {
                            ['sale_area_id', 'sale_area_code', 'sale_area_name'].forEach(function (value) {
                                $scope.data.currItem[value] = response [value];
                            });
                        }
                    };

                    /**
                     * 通用查询 - 业务员
                     */
                    $scope.chooseEmployee = {
                        dataRelationName: "sale_employees",
                        afterOk: function (response) {
                            ['sale_employee_id', 'employee_name', 'employee_code'].forEach(function (value) {
                                $scope.data.currItem[value] = response [value];
                            });
                        }
                    };

                    /**
                     * 通用查询 - 部门
                     */
                    $scope.chooseDept = {
                        dataRelationName: "depts",
                        afterOk: function (response) {
                            ['dept_id', 'dept_name', 'dept_code'].forEach(function (value) {
                                $scope.data.currItem[value] = response [value];
                            });
                        }
                    };

                    //添加按钮
                    $scope.toolButtons = {

                        search: {
                            title: '查询',
                            icon: 'fa fa-search',
                            click: function () {
                                $scope.search && $scope.search();
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

                    // 查询

                    $scope.search = function () {

                        $q.when()
                            .then(function () {
                                if (!$scope.data.currItem.year_month && !$scope.data.currItem.endyear_month) {
                                    swalApi.info("请先选择起始月份和终结月份");
                                    return $q.reject();
                                }

                                if (($scope.data.currItem.beginvendor_code && !$scope.data.currItem.endvendor_code) || (!$scope.data.currItem.beginvendor_code && $scope.data.currItem.endvendor_code)) {
                                    swalApi.info("请指定正确的供应商编码范围");
                                    return $q.reject();
                                }
                            })
                            .then(
                                function () {
                                    if (!$scope.data.is_collect) {
                                        return;
                                    }
                                    return getGroupConditions();
                                }
                            )
                            .then(function (info) {
                                if (info) {
                                    swalApi.info(info);
                                    return;
                                }
                                $scope.data.lines = [];
                                return $scope.gridOptions.hcApi.search();
                            })
                    };


                    $scope.refresh = function (bizData) {
                        $scope.search();
                    }


                    $scope.export = function () {
                        $scope.gridOptions.hcApi.exportToExcel();
                    }

                    $scope.data.lines = [];

                    function countSum(data) {
                        //计算合计
                        $scope.gridOptions.api.setPinnedBottomRowData([
                            {
                                seq: '合计',
                                amount_lm: numberApi.sum(data.ar_month_sums, 'amount_lm'),
                                amount_in: numberApi.sum(data.ar_month_sums, 'amount_in'),
                                amount_out: numberApi.sum(data.ar_month_sums, 'amount_out'),
                                amount_blnc: numberApi.sum(data.ar_month_sums, 'amount_blnc'),
                                amount_lm_nobill: numberApi.sum(data.ar_month_sums, 'amount_lm_nobill'),
                                amount_in_nobill: numberApi.sum(data.ar_month_sums, 'amount_in_nobill'),
                                amount_out_nobill: numberApi.sum(data.ar_month_sums, 'amount_out_nobill'),
                                amount_blnc_nobill: numberApi.sum(data.ar_month_sums, 'amount_blnc_nobill')
                            }
                        ]);
                    }

                    /** =============================汇总 ==========================**/

                    /**
                     * 页签切换事件
                     * @param params
                     */
                    $scope.onTabChange = function (params) {
                        $scope.data.is_collect = (params.id == "collect") ? true : false;
                    };

                    $scope.group_conditions = {};
                    $scope.data.is_collect = false;
                    $scope.group_conditions = {
                        customer: 1,
                        group_customer: 1,
                        sale_area: 1,
                        sale_employee: 1
                    };
                    $scope.gridOptions_collect = angular.copy($scope.gridOptions);

                    /**
                     * 获取汇总条件
                     */
                    function getGroupConditions() {

                        var group_conditions = "";
                        angular.forEach($scope.group_conditions, function (value, key) {
                            var flag = false;
                            var fieldArr = [];
                            fieldArr.push(key + "_code");
                            fieldArr.push(key + "_name");
                            if (value == 2) {
                                flag = true;
                                group_conditions += " " + (key + "_code,") + (key + "_name") + ",";
                            }
                            $scope.gridOptions_collect.columnApi.setColumnsVisible(fieldArr, flag);
                        });

                        if (group_conditions === "") {
                            return $q.resolve("请先选择汇总条件");
                        }
                        else {
                            $scope.data.currItem.group_conditions = group_conditions.substring(0, group_conditions.lastIndexOf(","));

                            return requestApi.post("ar_month_sum", "getgrouparmonthsumdata", $scope.data.currItem)
                                .then(function (response) {
                                    $scope.gridOptions_collect.api.setRowData(response.ar_month_sums);
                                    return $q.reject();
                                })
                        }
                    }

                    /** 查出当前应付期间 **/
                    requestApi.post("gl_account_period", "search", {sqlwhere: " is_current_period_ar=2 "})
                        .then(function (data) {
                            $scope.data.current_period = data.gl_account_periods[0].year_month;
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