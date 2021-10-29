/**
 * 价格管理
 * date:2018-11-26
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope,$stateParams) {
                console.log($stateParams.isSearch);
                $scope.data = {};
                $scope.data.currItem = {};
                //初始化数据
                $scope.is_cancellation = [
                    {value:0,name:'全部'},
                    {value:1,name:'已打开'},
                    {value:2,name:'已关闭'}
                ];
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号',
                        headerCheckboxSelection: true,
                        headerCheckboxSelectionFilteredOnly: true,
                        checkboxSelection: true,
                        width:100
                    }, {
                            headerName: "价格状态",
                            field: "is_cancellation",
                            hcDictCode:"is_cancellation",
                            pinned:'left'
                        }, {
                            headerName: "价格类型名称",
                            field: "saleprice_type_name",
                            pinned:'left'
                        }, {
                            headerName: "产品编码",
                            field: "item_code",
                            pinned:'left'
                        }, {
                            headerName: "产品名称",
                            field: "item_name",
                        }, {
                            headerName: "生效日期",
                            field: "start_date",
                            type:"日期"
                        },  {
                            headerName: "失效日期",
                            field: "end_date",
                            type:"日期"
                        },{
                            headerName: "开单价",
                            field: "price_bill",
                            type:"金额"
                        },{
                            headerName: "封顶数量",
                            field: "max_qty",
                            type:"数量"
                        }, {
                            headerName: "客户编码",
                            field: "customer_code",
                        },{
                            headerName: "客户名称",
                            field: "customer_name",
                        },{
                            headerName: "价格类型编码",
                            field: "saleprice_type_code",
                        },  {
                            headerName: "单号",
                            field: "saleorder_no",
                        },  {
                            headerName: "备注",
                            field: "remark",
                        }

                    ],
                    hcBeforeRequest:function (searchObj) {
                        searchObj.search_flag = 1;

                        if(searchObj.sqlwhere){
                            searchObj.sqlwhere = searchObj.sqlwhere + getSqlWhere();
                        }else{
                            searchObj.sqlwhere = getSqlWhere();
                        }
                    }
                };

                $scope.gridOptions.hcClassId = 'sa_saleprice_head';
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });


                /**
                 * 价格类型查询
                 */
                $scope.choosePriceType = {
                    afterOk: function (result) {
                        $scope.data.currItem.saleprice_type_name = result.saleprice_type_name;
                    }
                };

                /**
                 * 查客户
                 */
                $scope.chooseCustomer = {
                    afterOk: function (result) {
                        $scope.data.currItem.customer_name = result.customer_name;
                        $scope.data.currItem.customer_code = result.customer_code;
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

                    },

                    close: {
                        title: '关闭',
                        icon: 'fa fa-close',
                        click: function () {
                            $scope.close && $scope.close();
                        },
                        hide:function () {
                            return $stateParams.isSearch == 'true';

                        }
                    },
                    open: {
                        title: '开启',
                        icon: 'glyphicon glyphicon-ok',
                        click: function () {
                            $scope.open && $scope.open();
                        },
                        hide:function () {
                            return $stateParams.isSearch == 'true';
                        }
                    }
                };

                // 查询

                $scope.search = function () {
                    return $scope.gridOptions.hcApi.search();
                };

                $scope.refresh = function () {
                    $scope.search();
                }

                function getSqlWhere() {
                    var sqlwhere = "";
                    //价格单号
                    if ($scope.data.currItem.saleorder_no) {
                        sqlwhere += " and lower(saleorder_no) like lower('%" + $scope.data.currItem.saleorder_no + "%')";
                    }
                    //产品编码
                    if ($scope.data.currItem.item_code) {
                        sqlwhere += " and lower(item_code) like lower('%" + $scope.data.currItem.item_code + "%')";
                    }
                    //有效期间
                    if (!$scope.data.currItem.start_date && $scope.data.currItem.end_date) {
                        sqlwhere += " and to_char(start_date,'yyyy-mm-dd') <= '" + $scope.data.currItem.end_date + "'";
                    } else if ($scope.data.currItem.start_date && !$scope.data.currItem.end_date) {
                        sqlwhere += " and to_char(end_date,'yyyy-mm-dd') >= '" + $scope.data.currItem.start_date + "'";
                    } else if ($scope.data.currItem.start_date && $scope.data.currItem.end_date) {
                        sqlwhere += " and ("
                            + " ('" + $scope.data.currItem.start_date + "'"
                            + " between to_char(start_date,'yyyy-mm-dd') and to_char(end_date,'yyyy-mm-dd') )"
                            + " or "
                            + " ('" + $scope.data.currItem.end_date + "'"
                            + " between to_char(start_date,'yyyy-mm-dd') and to_char(end_date,'yyyy-mm-dd') )"
                            + " )";
                    }
                    //是否已作废
                    if ($scope.data.currItem.is_cancellation && $scope.data.currItem.is_cancellation > 0) {
                        sqlwhere += " and is_cancellation = " + $scope.data.currItem.is_cancellation;
                    }

                    //客户编码
                    if ($scope.data.currItem.customer_code) {
                        sqlwhere += " and customer_code = '" + $scope.data.currItem.customer_code + "'";
                    }
                    //客户名称
                    if ($scope.data.currItem.customer_name) {
                        sqlwhere += " and (lower(customer_name) like lower('%" + $scope.data.currItem.customer_name + "%')";
                        sqlwhere += " or lower(customer_name) like lower('%" + $scope.data.currItem.customer_name + "%'))";
                    }
                    //价格类型
                    if ($scope.data.currItem.saleprice_type_name) {
                        sqlwhere += " and saleprice_type_name = '" + $scope.data.currItem.saleprice_type_name + "'";
                    }

                    return sqlwhere;
                }



                //关闭
                $scope.close = function () {
                    // 获取选中的行的数据
                    var settleRow = $scope.gridOptions.api.getSelectedRows();
                    if (settleRow.length == 0) {
                        return swalApi.info("请选择要关闭的价格行!");
                    }
                    
                    return swalApi.confirmThenSuccess({
                        title: "确定要关闭吗?",
                        okFun: function () {
                            //函数区域
                            requestApi.post("sa_saleprice_head", "cancelnew", {
                                is_cancellation:2,
                                sa_saleprice_lineofsa_saleprice_heads: settleRow
                            }).then(function (data) {
                                $scope.refresh();
                            });
                        },
                        okTitle: '关闭成功'
                    });
                }

                //打开
                $scope.open = function () {
                    // 获取选中的行的数据
                    var settleRow = $scope.gridOptions.api.getSelectedRows();
                    if (settleRow.length == 0) {
                        return swalApi.info("请选择要打开的价格行!");
                    }

                    return swalApi.confirmThenSuccess({
                        title: "确定要打开吗?",
                        okFun: function () {
                            //函数区域
                            requestApi.post("sa_saleprice_head", "cancelnew", {
                                is_cancellation:1,
                                sa_saleprice_lineofsa_saleprice_heads: settleRow
                            }).then(function (data) {
                                $scope.refresh();
                            });
                        },
                        okTitle: '打开成功'
                    });
                }

                $scope.export = function () {
                    $scope.gridOptions.hcApi.exportToExcel();
                }

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