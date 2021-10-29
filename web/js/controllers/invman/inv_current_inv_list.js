/**
 * 库存报表
 * date:2018-11-26
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi','numberApi','openBizObj'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi,numberApi,openBizObj) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [{
                        id:'seq',
                        type: '序号'
                    }, {
                            id:'warehouse',
                            headerName: "仓库",
                            children:[
                                {
                                    id:'warehouse_code',
                                    headerName: "仓库编码",
                                    field: "warehouse_code",
                                    pinned:'left',
                                    suppressSizeToFit:true,
                                    minWidth:90,
                                    width:90,
                                    maxWidth:90
                                },{
                                    id:'warehouse_name',
                                    headerName: "仓库名称",
                                    field: "warehouse_name",
                                    pinned:'left'
                                }
                            ]
                        },
                        {
                            id:'item',
                            headerName: "产品",
                            children:[
                                {
                                    id:'item_code',
                                    headerName: "产品编码",
                                    field: "item_code"/*,
                                    pinned:'left'*/
                                }, {
                                    id:'item_name',
                                    headerName: "产品名称",
                                    field: "item_name"/*,
                                    pinned:'left'*/
                                }
                            ]
                        },
                        {
                            id:'uom_name',
                            headerName: "单位",
                            field: "uom_name",
                            type:'单位',
                            suppressSizeToFit:true,
                            minWidth:90,
                            width:90
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
                            id:'qty_onhand',
                            headerName: "实际库存量",
                            field: "qty_onhand",
                            type:"数量"
                        },
                        {
                            id:'qty_keep',
                            headerName: "预占库存量",
                            field: "qty_keep",
                            hide:true,
                            type:"数量"
                        },
                        {
                            id:'qty_plan',
                            headerName: "可使用库存量",
                            field: "qty_plan",
                            hide:true,
                            type:"数量"
                        },
                        {
                            id:'item_class',
                            headerName: "产品分类",
                            children:[
                                {
                                    id:'item_class1_name',
                                    headerName: "产品大类",
                                    field: "item_class1_name"
                                }, {
                                    id:'item_class3_name',
                                    headerName: "产品小类",
                                    field: "item_class3_name"
                                }, {
                                    id:'specs',
                                    headerName: "产品型号",
                                    field: "specs"
                                }
                            ]
                        }
                        ,{
                            id:'customer',
                            headerName: "客户",
                            children:[
                                {
                                    id:'customer_code',
                                    headerName: "客户编码",
                                    field: "customer_code"
                                },{
                                    id:'customer_name',
                                    headerName: "客户名称",
                                    field: "customer_name"
                                }
                            ]
                        }

                    ],
                    hcBeforeRequest:function (searchObj) {
                        angular.extend(searchObj,$scope.data.currItem);
                        searchObj.search_flag = 2;
                    },
                    onRowDoubleClicked:function (args) {
                        // openBizObj({
                        //     stateName: 'proman.inv_in_bill_red_prop',
                        //     params:{title:"xxxxxx"}
                        // });
                    }


                };

                $scope.groupGridOptions = {
                    columnDefs: [{
                        id:'seq',
                        type: '序号'
                    }, {
                        id:'warehouse',
                        headerName: "仓库",
                        children:[
                            {
                                id:'warehouse_code',
                                headerName: "仓库编码",
                                field: "warehouse_code",
                                pinned:'left'
                            },{
                                id:'warehouse_name',
                                headerName: "仓库名称",
                                field: "warehouse_name",
                                pinned:'left'
                            }
                        ]
                    },
                        {
                            id:'item',
                            headerName: "产品",
                            children:[
                                {
                                    id:'item_code',
                                    headerName: "产品编码",
                                    field: "item_code",
                                    pinned:'left'
                                }, {
                                    id:'item_name',
                                    headerName: "产品名称",
                                    field: "item_name",
                                    pinned:'left'
                                }
                            ]
                        },
                        {
                            id:'uom_name',
                            headerName: "单位",
                            field: "uom_name"
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
                            id:'qty_onhand',
                            headerName: "实际库存量",
                            field: "qty_onhand",
                            type:"数量"
                        },
                        {
                            id:'qty_keep',
                            headerName: "预占库存量",
                            field: "qty_keep",
                            hide:true,
                            type:"数量"
                        },
                        {
                            id:'qty_plan',
                            headerName: "可使用库存量",
                            field: "qty_plan",
                            hide:true,
                            type:"数量"
                        },
                        {
                            id:'item_class',
                            headerName: "产品分类",
                            children:[
                                {
                                    id:'item_class1_name',
                                    headerName: "产品大类",
                                    field: "item_class1_name"
                                }, {
                                    id:'item_class3_name',
                                    headerName: "产品小类",
                                    field: "item_class3_name"
                                }, {
                                    id:'specs',
                                    headerName: "产品型号",
                                    field: "specs"
                                }
                            ]
                        }
                        ,{
                            id:'customer',
                            headerName: "客户",
                            children:[
                                {
                                    id:'customer_code',
                                    headerName: "客户编码",
                                    field: "customer_code"
                                },{
                                    id:'customer_name',
                                    headerName: "客户名称",
                                    field: "customer_name"
                                }
                            ]
                        }

                    ]


                };

                $scope.gridOptions1 = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                            headerName: "单据号",
                            field: "bill_no",
                            pinned:'left'
                        }, {
                            headerName: "单据类型",
                            field: "bill_type",
                            pinned:'left'
                        },{
                            headerName: "产品编码",
                            field: "item_code",
                            pinned:'left'
                        }, {
                            headerName: "产品名称",
                            field: "item_name",
                            pinned:'left'
                        },
                        {
                            headerName: "数量",
                            field: "sum_qty",
                            type:"数量"
                        },
                        {
                            headerName: "客户编码",
                            field: "customer_code"
                        },{
                            id:'customer_name',
                            headerName: "客户名称",
                            field: "customer_name"
                        },
                        {
                            headerName: "仓库编码",
                            field: "warehouse_code"
                        },{
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
                        },{
                            headerName: "创建人",
                            field: "creator"
                        },
                        {
                            headerName: "创建时间",
                            field: "create_date"
                        }
                    ]
                };

                $scope.gridOptions.hcClassId = 'inv_current_inv';
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

                /**
                 * 查客户
                 */
                $scope.chooseCustomer = {
                    afterOk: function (result) {
                        $scope.data.currItem.customer_name = result.customer_name;
                        $scope.data.currItem.customer_code = result.customer_code;
                        $scope.data.currItem.customer_id = result.customer_id;
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

                //查产品分类 小类
                $scope.chooseItemClasss = {
                    sqlWhere :" item_usable = 2 and item_class_level = " + 3,
                    afterOk: function (result) {
                        $scope.data.currItem.item_class3_id = result.item_class_id;
                        $scope.data.currItem.item_class3_code = result.item_class_code;
                        $scope.data.currItem.item_class3_name = result.item_class_name;
                    }
                };
                //查产品分类 大类
                $scope.chooseItemClass = {
                    sqlWhere :" item_usable = 2 and item_class_level = " + 1,
                    afterOk: function (result) {
                        $scope.data.currItem.item_class1_id = result.item_class_id;
                        $scope.data.currItem.item_class1_code = result.item_class_code;
                        $scope.data.currItem.item_class1_name = result.item_class_name;
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


                $scope.showRemain = function () {
                    var node = $scope.gridOptions.hcApi.getFocusedNode();
                    if (!node)
                        return swalApi.info('请先选中要查询的库存记录');

                    var postData = {
                        classId: "inv_current_inv",
                        action: 'getinvremainqty',
                        data: {
                            item_id : node.data.item_id,
                            warehouse_id:node.data.warehouse_id
                        }
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            $("#remainModal").modal();
                            $scope.gridOptions1.api.setRowData(data.inv_current_invofinv_current_invs);
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
                    if($scope.warehouse == 2)columns.push("仓库");
                    if($scope.item == 2)columns.push("产品");
                    if($scope.crm_entid == 2)columns.push("品类");
                    if($scope.entorgid == 2)columns.push("产品线");
                    if($scope.item_class == 2)columns.push("产品分类");
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

                    if($scope.data.currItem.plan_flag == 2){
                        $scope.groupGridOptions.columnApi.setColumnsVisible(['qty_keep','qty_plan'],true);
                    }
                    $scope.groupGridOptions.columnApi.setColumnsVisible(['qty_onhand','seq'],true);

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
                            if(v == '产品分类')key+=ai.item_class;
                        });
                        if(!map[key]){
                            map[key] = [ai];
                        }else{
                            map[key].push(ai);
                        }
                    }
                    Object.keys(map).forEach(function(key){
                        var row = map[key][0];
                        row.qty_onhand = numberApi.sum(map[key],'qty_onhand');
                        row.qty_keep = numberApi.sum(map[key],'qty_keep');
                        row.qty_plan = numberApi.sum(map[key],'qty_plan');
                        group_data.push(row);
                    });
                    $scope.groupGridOptions.hcApi.setRowData(group_data);
                }

                $scope.onPlanflagChange = function () {
                    if($scope.data.currItem.plan_flag == 2){
                        $scope.gridOptions.columnApi.setColumnsVisible(['qty_keep','qty_plan'], true);
                    }else{
                        $scope.gridOptions.columnApi.setColumnsVisible(['qty_keep','qty_plan'], false);
                    }
                    $scope.search();
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