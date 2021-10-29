/**
 * 商品明细账查询
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi','numberApi','dateApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi,numberApi,dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                /**
                 * 获取上一个月
                 *
                 * @date 格式为yyyy-mm的日期，如：2014-01
                 */
                var preMonth = function(date) {
                    var arr = date.split('-');
                    var year = arr[0]; //获取当前日期的年份
                    var month = arr[1]; //获取当前日期的月份
                    var year2 = year;
                    var month2 = parseInt(month) - 1;
                    if (month2 == 0) {
                        year2 = parseInt(year2) - 1;
                        month2 = 12;
                    }
                    if (month2 < 10) {
                        month2 = '0' + month2;
                    }
                    var t2 = year2 + '-' + month2;
                    return t2;
                }

                $scope.data = {};
                $scope.data.currItem = {
                    year_month:preMonth(dateApi.nowYear()+'-'+dateApi.nowMonth()),
                    year_month_last:dateApi.nowYear()+'-'+dateApi.nowMonth()
                };


                $scope.gridOptions = {
                    hcSearchWhenReady:false,
                    columnDefs: [{
                            type: '序号'
                        }, {
                            headerName: "月份",
                            field: "year_month"
                        }, {
                            headerName: "单据号/行号",
                            field: "billlineno"
                        },{
                            headerName: "订单号/行号",
                            field: "molineno"
                        }, {
                            headerName: "摘要",
                            field: "excerpta"
                        },{
                            headerName: "入库",
                            children:[
                                {
                                    id:'qty_in',
                                    headerName: "数量",
                                    field: "qty_in",
                                    type:"数量"
                                }, {
                                    id:'price_in',
                                    headerName: "单价",
                                    field: "price_in",
                                    type:"金额"
                                }, {
                                    id:'amount_in',
                                    headerName: "金额",
                                    field: "amount_in",
                                    type:"金额"
                                }
                            ]
                        },{
                            headerName: "出库",
                            children:[
                                {
                                    id:'qty_out',
                                    headerName: "数量",
                                    field: "qty_out",
                                    type:"数量"
                                }, {
                                    id:'price_out',
                                    headerName: "单价",
                                    field: "price_out",
                                    type:"金额"
                                }, {
                                    id:'amount_out',
                                    headerName: "金额",
                                    field: "amount_out",
                                    type:"金额"
                                }
                            ]
                        },{
                            headerName: "结存",
                            children:[
                                {
                                    id:'qty_blnc',
                                    headerName: "数量",
                                    field: "qty_blnc",
                                    type:"数量"
                                }, {
                                    id:'price_blnc',
                                    headerName: "单价",
                                    field: "price_blnc",
                                    type:"金额"
                                }, {
                                    id:'amount_blnc',
                                    headerName: "金额",
                                    field: "amount_blnc",
                                    type:"金额"
                                }
                            ]
                        },{
                            headerName: "仓库",
                            children:[
                                {
                                    headerName: "仓库编码",
                                    field: "warehouse_code"
                                },{
                                    headerName: "仓库名称",
                                    field: "warehouse_name"
                                }
                            ]
                        },{
                            headerName: "委托代销仓",
                            children:[
                                {
                                    headerName: "仓库编码",
                                    field: "warehouse_code2"
                                },{
                                    headerName: "仓库名称",
                                    field: "warehouse_name2"
                                }
                            ]
                        },
                        {
                            headerName: "单据类型名称",
                            field: "billtypename"
                        },
                        {
                            headerName: "其他单据名称",
                            field: "billtype2name"
                        },
                        {
                            headerName: "创建人",
                            field: "created_by"
                        },
                        {
                            headerName: "创建日期",
                            field: "creation_date"
                        },
                        {
                            headerName: "审核人",
                            field: "auditing_wh_by"
                        },{
                            headerName: "审核时间",
                            field: "auditing_date"
                        }
                    ]
                };

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });


                $scope.item_org =  {
                    classId: 'item_org',
                    title: '产品查询',
                    //sqlWhere: 'usable = 2 and warehouse_type = 1',
                    afterOk: function (result) {
                        $scope.data.currItem.item_id = result.item_id;
                        $scope.data.currItem.item_code = result.item_code;
                        $scope.data.currItem.item_name = result.item_name;
                    }
                };

                /**
                 * 查仓库
                 */
                $scope.warehouse =  {
                    classId: 'warehouse',
                    title: '仓库查询',
                    sqlWhere: 'usable = 2 and warehouse_type = 1',
                    gridOptions: {
                        "columnDefs": [
                            {
                                headerName: "仓库编码",
                                field: "warehouse_code"
                            }, {
                                headerName: "仓库名称",
                                field: "warehouse_name"
                            }, {
                                headerName: "仓库类型",
                                field: "warehouse_type",
                                hcDictCode:"warehouse_type"
                            }
                        ]
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.warehouse_code = result.warehouse_code;
                        $scope.data.currItem.warehouse_name = result.warehouse_name;
                        $scope.data.currItem.warehouse_id = result.warehouse_id;
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


                $scope.refresh = function () {
                    $scope.search();
                }


                $scope.export = function () {
                    $scope.gridOptions.hcApi.exportToExcel();
                }

                $scope.search = function () {
                    if(check()){
                        var postData = {
                            classId: "inv_monthsum",
                            action: 'itemlist',
                            data: $scope.data.currItem
                        };
                        return requestApi.post(postData)
                            .then(function (data) {
                                $scope.gridOptions.hcApi.setRowData(data.inv_monthsumofinv_monthsums);
                            });
                    }else{
                        swalApi.info("请填写起始月份或结束月份");
                    }
                }

                //检查筛选月份期间
                function check(){
                    if($scope.data.currItem.year_month
                        &&$scope.data.currItem.year_month_last){
                        return true;
                    }else{
                        return false;
                    }
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