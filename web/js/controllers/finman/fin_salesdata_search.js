/**
 * 历史销售数据查询
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi','numberApi','openBizObj'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi,numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};

                /*获取数据模型*/
                function getCurrItem() {
                    return $scope.data.currItem;
                }

                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'sales_year',
                            headerName: '预算年度'
                        }, {
                            field: 'item_code',
                            headerName: '产品编码'
                        }
                        , {
                            field: 'item_name',
                            headerName: '产品名称'
                        }
                        , {
                            field: 'uom_name',
                            headerName: '计量单位',
                            type: '单位'
                        }
                        , {
                            field: 'customer_code',
                            headerName: '客户编码'
                        }
                        , {
                            field: 'customer_name',
                            headerName: '客户名称'
                        }
                        , {
                            field: 'org_code',
                            headerName: '部门编码'
                        }
                        , {
                            field: 'org_name',
                            headerName: '部门名称'
                        }
                        ,
                        {
                            headerName: '前年销售数据',
                            children: [
                                {
                                    field: 'lyear_sales_qty',
                                    headerName: '销售数量',
                                    type: '数量'
                                }
                                , {
                                    field: 'lyear_sales_price',
                                    headerName: '销售单价',
                                    type: '金额'
                                }
                                , {
                                    field: 'lyear_sales_amt',
                                    headerName: '销售金额',
                                    type: '金额'
                                }
                                , {
                                    field: 'lyear_cost_price',
                                    headerName: '成本单价',
                                    type: '金额'
                                }
                                , {
                                    field: 'lyear_cost_amt',
                                    headerName: '成本金额',
                                    type: '金额'
                                }
                            ]
                        }
                        , {
                            headerName: '去年前三季度累计销售数据',
                            children: [
                                {
                                    field: 'tyear1_sales_qty',
                                    headerName: '销售数量',
                                    type: '数量'
                                }
                                , {
                                    field: 'tyear1_sales_price',
                                    headerName: '销售单价',
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear1_sales_amt',
                                    headerName: '销售金额',
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear1_cost_price',
                                    headerName: '成本单价',
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear1_cost_amt',
                                    headerName: '成本金额',
                                    type: '金额'
                                }
                            ]
                        }, {
                            headerName: '去年第四季度预计销售数据',
                            children: [
                                {
                                    field: 'tyear2_sales_qty',
                                    headerName: '销售数量',
                                    type: '数量'
                                }
                                , {
                                    field: 'tyear2_sales_price',
                                    headerName: '销售单价',
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear2_sales_amt',
                                    headerName: '销售金额',
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear2_cost_price',
                                    headerName: '成本单价',
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear2_cost_amt',
                                    headerName: '成本金额',
                                    type: '金额'
                                }
                            ]
                        }
                        , {
                            headerName: '去年销售数据',
                            children: [
                                {
                                    field: 'tyear3_sales_qty',
                                    headerName: '销售数量',
                                    type: '数量'
                                }
                                , {
                                    field: 'tyear3_sales_price',
                                    headerName: '销售单价',
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear3_sales_amt',
                                    headerName: '销售金额',
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear3_cost_price',
                                    headerName: '成本单价',
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear3_cost_amt',
                                    headerName: '成本金额',
                                    type: '金额'
                                }
                            ]
                        }
                        , {
                            field: 'note',
                            headerName: '备注说明'
                        }
                    ],
                    hcBeforeRequest:function (searchObj) {
                        angular.extend(searchObj,$scope.data.currItem);
                        searchObj.search_flag = 1;
                    },
                    hcAfterRequest:function (response) {
                        $scope.calSum(response);
                    }
                };


                $scope.gridOptions.hcClassId = 'fin_salesdata_head';
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                $scope.customerObj = {
                    sqlWhere:"usable = 2",
                    afterOk: function (result) {
                        getCurrItem().customer_id = result.customer_id;
                        getCurrItem().customer_code = result.customer_code;
                        getCurrItem().customer_name = result.customer_name;
                    }
                };

                $scope.deptObj = {
                    afterOk: function (result) {
                        getCurrItem().org_id = result.dept_id;
                        getCurrItem().org_code = result.dept_code;
                        getCurrItem().org_name = result.dept_name;
                    }
                };

                $scope.itemObj = {
                    afterOk: function (result) {
                        getCurrItem().item_id = result.item_id;
                        getCurrItem().item_code = result.item_code;
                        getCurrItem().item_name = result.item_name;
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
                    return $scope.gridOptions.hcApi.search().then($scope.calSum);
                }

                $scope.export = function () {
                    $scope.gridOptions.hcApi.exportToExcel();
                }

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function (response) {
                    if(response){
                        getCurrItem().fin_salesdata_heads = response.fin_salesdata_heads;
                    }else{
                        getCurrItem().fin_salesdata_heads = $scope.gridOptions.hcApi.getRowData();
                    }
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            lyear_sales_qty: numberApi.sum(getCurrItem().fin_salesdata_heads, 'lyear_sales_qty'),
                            lyear_sales_amt: numberApi.sum(getCurrItem().fin_salesdata_heads, 'lyear_sales_amt'),
                            lyear_cost_amt: numberApi.sum(getCurrItem().fin_salesdata_heads, 'lyear_cost_amt'),
                            tyear1_sales_qty: numberApi.sum(getCurrItem().fin_salesdata_heads, 'tyear1_sales_qty'),
                            tyear1_sales_amt: numberApi.sum(getCurrItem().fin_salesdata_heads, 'tyear1_sales_amt'),
                            tyear1_cost_amt: numberApi.sum(getCurrItem().fin_salesdata_heads, 'tyear1_cost_amt'),
                            tyear2_sales_qty: numberApi.sum(getCurrItem().fin_salesdata_heads, 'tyear2_sales_qty'),
                            tyear2_sales_amt: numberApi.sum(getCurrItem().fin_salesdata_heads, 'tyear2_sales_amt'),
                            tyear2_cost_amt: numberApi.sum(getCurrItem().fin_salesdata_heads, 'tyear2_cost_amt'),
                            tyear3_sales_qty: numberApi.sum(getCurrItem().fin_salesdata_heads, 'tyear3_sales_qty'),
                            tyear3_sales_amt: numberApi.sum(getCurrItem().fin_salesdata_heads, 'tyear3_sales_amt'),
                            tyear3_cost_amt: numberApi.sum(getCurrItem().fin_salesdata_heads, 'tyear3_cost_amt')
                        }
                    ]);
                };

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