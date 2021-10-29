/**
 * 价格管理
 * date:2018-11-26
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
                $scope.data = {};
                $scope.data.currItem = {
                    is_viewwh2wh:2,
                    date_invbill_begin:dateApi.firstDay(),
                    date_invbill_end:dateApi.lastDay()
                };

                $scope.data.currItemLine = {};


                $scope.gridOptions = {
                    hcSearchWhenReady:true,
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                            id:'seq',
                            type: '序号'
                         },
                        {
                            id:'crm_entid',
                            headerName: "品类",
                            field: "crm_entid",
                            hcDictCode:'crm_entid'
                        },
                        {
                            id:'entorgid',
                            headerName: "产品线",
                            field: "entorgid",
                            hcDictCode:'entorgid'
                        },
                        {
                            id:'item_code',
                            headerName: "产品编码",
                            field: "item_code"
                        },
                        {
                            id:'item_name',
                            headerName: "产品名称",
                            field: "item_name"
                        }
                        ,
                        {
                            id:'uom_name',
                            headerName: "单位",
                            field: "uom_name"
                        },

                        {
                            id:'warehouse_code',
                            headerName: "仓库编码",
                            field: "warehouse_code"
                        },{
                            id:'warehouse_name',
                            headerName: "仓库名称",
                            field: "warehouse_name"
                        },
                        {
                            headerName: "期间期初",
                            children:[
                                {
                                    id:'qty_lm',
                                    headerName: "数量",
                                    field: "qty_lm",
                                    type:"数量"
                                }, {
                                    id:'price_lm',
                                    headerName: "单价",
                                    field: "price_lm",
                                    type:"金额"
                                }, {
                                    id:'amount_lm',
                                    headerName: "金额",
                                    field: "amount_lm",
                                    type:"金额"
                                }
                            ]
                        }
                        ,{
                            headerName: "期间收入",
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
                            headerName: "期间发出",
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
                            headerName: "期间结存",
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
                        }
                    ],
                    hcBeforeRequest:function (searchObj) {
                        angular.extend(searchObj,$scope.data.currItem);
                    },
                    hcAfterRequest:function (data) {
                        $scope.calSum(data.inv_datesums);
                    },
                    onRowDoubleClicked:function(args){
                        $("#remainModal").modal();
                        $scope.data.currItemLine.item_id = args.data.item_id;
                        $scope.data.currItemLine.item_code = args.data.item_code;
                        $scope.data.currItemLine.item_name = args.data.item_name;
                        $scope.data.currItemLine.warehouse_id = args.data.warehouse_id;
                        $scope.data.currItemLine.warehouse_code = args.data.warehouse_code;
                        $scope.data.currItemLine.warehouse_name = args.data.warehouse_name;
                        $scope.data.currItemLine.year_month = $scope.data.currItem.date_invbill_begin.substr(0,7);
                        $scope.data.currItemLine.year_month_last = $scope.data.currItem.date_invbill_end.substr(0,7);

                        $scope.doSearchItemList();
                    }

                };

                $scope.groupGridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                            id:'seq',
                            type: '序号'
                        },
                        {
                            id:'crm_entid',
                            headerName: "品类",
                            field: "crm_entid",
                            hcDictCode:'crm_entid'
                        },
                        {
                            id:'entorgid',
                            headerName: "产品线",
                            field: "entorgid",
                            hcDictCode:'entorgid'
                        },
                        {
                            id:'item_code',
                            headerName: "产品编码",
                            field: "item_code"
                        },
                        {
                            id:'item_name',
                            headerName: "产品名称",
                            field: "item_name"
                        }
                        ,
                        {
                            id:'uom_name',
                            headerName: "单位",
                            field: "uom_name"
                        },

                        {
                            id:'warehouse_code',
                            headerName: "仓库编码",
                            field: "warehouse_code"
                        },{
                            id:'warehouse_name',
                            headerName: "仓库名称",
                            field: "warehouse_name"
                        },
                        {
                            headerName: "期间期初",
                            children:[
                                {
                                    id:'qty_lm',
                                    headerName: "数量",
                                    field: "qty_lm",
                                    type:"数量"
                                }, {
                                    id:'price_lm',
                                    headerName: "单价",
                                    field: "price_lm",
                                    type:"金额"
                                }, {
                                    id:'amount_lm',
                                    headerName: "金额",
                                    field: "amount_lm",
                                    type:"金额"
                                }
                            ]
                        }
                        ,{
                            headerName: "期间收入",
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
                            headerName: "期间发出",
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
                            headerName: "期间结存",
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
                        }

                    ]

                };

                $scope.gridOptions1 = {
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

                $scope.gridOptions.hcClassId = 'inv_datesum';
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /**
                 * 查产品
                 */
                $scope.chooseItem = {
                    afterOk: function (result) {
                        $scope.data.currItem.item_id = result.item_id;
                        $scope.data.currItem.item_code = result.item_code;
                        $scope.data.currItem.item_name = result.item_name;
                    }
                };
                $scope.chooseItems = {
                    afterOk: function (result) {
                        $scope.data.currItemLine.item_id = result.item_id;
                        $scope.data.currItemLine.item_code = result.item_code;
                        $scope.data.currItemLine.item_name = result.item_name;
                    }
                };


                /**
                 * 查仓库
                 */
                $scope.chooseWarehouse = {
                    afterOk: function (result) {
                        $scope.data.currItem.warehouse_name = result.warehouse_name;
                        $scope.data.currItem.warehouse_code = result.warehouse_code;
                        $scope.data.currItem.warehouse_id = result.warehouse_id;
                    }
                };
                $scope.chooseWarehouses = {
                    afterOk: function (result) {
                        $scope.data.currItemLine.warehouse_name = result.warehouse_name;
                        $scope.data.currItemLine.warehouse_code = result.warehouse_code;
                        $scope.data.currItemLine.warehouse_id = result.warehouse_id;
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

                    show_group: {
                        title: '显示汇总',
                        icon: 'glyphicon glyphicon-indent-right',
                        click: function () {
                            $scope.group && $scope.group(this.title);
                        }

                    }

                };

                // 查询

                $scope.search = function () {
                    $('#tab11').tab('show');
                    $scope.data.lines = [];
                    $scope.groupGridOptions.hcApi.setRowData([]);
                    return $scope.gridOptions.hcApi.search();
                };



                $scope.refresh = function () {
                    $scope.search();
                }


                $scope.export = function () {
                    $scope.gridOptions.hcApi.exportToExcel();
                }


                $scope.getinvyearmonth = function () {
                    var postData = {
                        classId: "gl_account_period",
                        action: 'getinvyearmonth',
                        data: {}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            $scope.data.currItem.year_month = data.year_month;
                        });
                }

                //获取当前存货时间
                $scope.getinvyearmonth();

                $scope.doSearchItemList = function () {
                    var postData = {
                        classId: "inv_monthsum",
                        action: 'itemlist',
                        data: $scope.data.currItemLine
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            $scope.gridOptions1.hcApi.setRowData(data.inv_monthsumofinv_monthsums);
                        });
                }

                $scope.data.lines = [];
                $scope.group = function (title) {
                    if($scope.data.lines.length==0){
                        $scope.data.lines = $scope.gridOptions.hcApi.getRowData();
                    }
                    $("#groupModal").modal();

                }

                $scope.columns = [];
                $scope.initGroup = function () {
                    var columns = [];
                    var visables = [];
                    if($scope.warehouse == 2){
                        columns.push("仓库");
                        visables.push('warehouse_code','warehouse_name');
                    }
                    if($scope.item == 2){
                        columns.push("产品");
                        visables.push('item_code','item_name');
                    }
                    if($scope.crm_entid == 2){
                        columns.push("品类");
                        visables.push('crm_entid');
                    }
                    if($scope.entorgid == 2){
                        columns.push("产品线");
                        visables.push('entorgid');
                    }
                    if(columns.length==0){
                        swalApi.info("请选择汇总项");
                        return;
                    }
                    $scope.columns = columns;
                    $scope.groupGridOptions.columnDefs.forEach(function (column) {
                        if(columns.indexOf(column.headerName)>=0){
                            $scope.groupGridOptions.columnApi.setColumnVisible(column.id,true);
                            if(column.children){
                                column.children.forEach(function (child) {
                                    $scope.groupGridOptions.columnApi.setColumnVisible(child.id,true);
                                });
                            }
                        }else{
                            $scope.groupGridOptions.columnApi.setColumnVisible(column.id,false);
                            if(column.children) {
                                column.children.forEach(function (child) {
                                    $scope.groupGridOptions.columnApi.setColumnVisible(child.id, false);
                                });
                            }
                        }
                    });

                    $scope.groupGridOptions.columnApi.setColumnsVisible(visables,true);
                    $scope.groupGridOptions.columnApi.setColumnsVisible(
                        ['seq','qty_lm','price_lm','amount_lm','qty_in','price_in','amount_in'
                            ,'qty_out','price_out','amount_out','qty_blnc','price_blnc','amount_blnc'], true);

                    $("#groupModal").modal('hide');

                    $('#tab22').tab('show');

                    //数据分组
                    groupData($scope.data.lines,columns);
                }


                function groupData(lines,columns) {
                    var map = {};
                    var key = "";
                    var group_data = [];
                    for(var i = 0; i < lines.length; i++){
                        var ai = lines[i];
                        key = "";
                        columns.forEach(function (v) {
                            if(v == '仓库')key+=ai.warehouse_code;
                            if(v == '产品')key+=ai.item_code;
                            if(v == '品类')key+=ai.crm_entid;
                            if(v == '产品线')key+=ai.entorgid;
                        });
                        if(!map[key]){
                            map[key] = [ai];
                        }else{
                            map[key].push(ai);
                        }
                    }
                    Object.keys(map).forEach(function(key){
                        var row = map[key][0];
                        row.qty_lm = numberApi.sum(map[key],'qty_lm');
                        row.amount_lm = numberApi.sum(map[key],'amount_lm');
                        row.price_lm = numberApi.divide(row.amount_lm,row.qty_lm);

                        row.qty_in = numberApi.sum(map[key],'qty_in');
                        row.amount_in = numberApi.sum(map[key],'amount_in');
                        row.price_in = numberApi.divide(row.amount_in,row.qty_in);

                        row.qty_out = numberApi.sum(map[key],'qty_out');
                        row.amount_out = numberApi.sum(map[key],'amount_out');
                        row.price_out = numberApi.divide(row.amount_out,row.qty_out);

                        row.qty_blnc = numberApi.sum(map[key],'qty_blnc');
                        row.amount_blnc = numberApi.sum(map[key],'amount_blnc');
                        row.price_blnc = numberApi.divide(row.amount_blnc,row.qty_blnc);
                        group_data.push(row);
                    });
                    $scope.groupGridOptions.hcApi.setRowData(group_data);
                    $scope.groupGridOptions.api.setPinnedBottomRowData($scope.sum_row);
                }



                /**
                 * 计算合计数据
                 */
                $scope.sum_row = [];
                $scope.calSum = function (lines) {
                    var rows;
                    if(lines){
                        rows = lines;
                    }else{
                        rows = $scope.gridOptions.hcApi.getRowData();
                    }
                    $scope.sum_row=[{
                        seq: '合计',
                        qty_lm: numberApi.sum(rows, 'qty_lm'),
                        amount_lm: numberApi.sum(rows, 'amount_lm'),

                        qty_in: numberApi.sum(rows, 'qty_in'),
                        amount_in: numberApi.sum(rows, 'amount_in'),

                        qty_out: numberApi.sum(rows, 'qty_out'),
                        amount_out: numberApi.sum(rows, 'amount_out'),

                        qty_blnc: numberApi.sum(rows, 'qty_blnc'),
                        amount_blnc: numberApi.sum(rows, 'amount_blnc')
                    }];
                    $scope.gridOptions.api.setPinnedBottomRowData($scope.sum_row);
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