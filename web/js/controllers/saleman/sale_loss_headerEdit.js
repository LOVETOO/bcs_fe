var billmanControllers = angular.module('inspinia');
function sale_loss_headerEdit($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {

    //继承基类方法
    sale_loss_headerEdit = HczyCommon.extend(sale_loss_headerEdit, ctrl_bill_public);
    sale_loss_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_loss_header",
        key: "loss_id",
        wftempid: 10183,
        FrmInfo: {},
        grids: [
            {
                optionname: 'options_4', idname: 'sale_loss_item_lineofsale_loss_headers',
                line: {optionname: 'options_8', idname: 'sale_loss_item_lineofsale_loss_item_lines'}
            },
            {optionname: 'options_8', idname: 'sale_loss_item_lineofsale_loss_item_lines'}
        ]
    };
    //初始化界面
    var myDate = new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,
            change_type: 1,
            create_time: myDate.toLocaleDateString(),
            sale_loss_item_lineofsale_loss_headers:[],
            sale_loss_item_lineofsale_loss_item_lines:[],
        };
    };
    //单据状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stats = data.dicts;
    })
    //变更类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "change_type"}).then(function (data) {
        $scope.change_types = data.dicts;
    })
    //ctrl_bill_public设置所有非制单的网格不可编辑   refresh_after重置
    $scope.refresh_after = function (){
        if ($scope.data.currItem.currprocname == '采购') {
            $scope.getIndexByField("columns_8", "cust_item_name",2).editable = true;
            $scope.getIndexByField("columns_8", "item_code",2).editable = true;
            $scope.getIndexByField("columns_8", "qty",2).editable = true;
            $scope.getIndexByField("columns_8", "amt",2).editable = true;
        }
        if($scope.data.currItem.currprocname == '计划管理'){
            $scope.getIndexByField("columns_8", "conf_qty",2).editable = true;
            $scope.getIndexByField("columns_8", "note",2).editable = true;
            $scope.getIndexByField("columns_8", "bs_qty",2).editable = true;
            $scope.getIndexByField("columns_8", "pend_qty",2).editable = true;
        }
    }
    $scope.save_before = function (){
        var data1=$scope.gridGetRow("options_4");
        var data2=$scope.data.currItem.sale_loss_item_lineofsale_loss_item_lines;
        data1.sale_loss_item_lineofsale_loss_item_lines =data2
         delete $scope.data.currItem.sale_loss_item_lineofsale_loss_item_lines
    }
    /**网格配置*/
    {
        //分组功能
        var groupColumn = {
            headerName: "Group",
            width: 200,
            field: 'name',
            valueGetter: function (params) {
                if (params.node.group) {
                    return params.node.key;
                } else {
                    return params.data[params.colDef.field];
                }
            },
            comparator: agGrid.defaultGroupComparator,
            cellRenderer: 'group',
            cellRendererParams: function (params) {
            }
        };
        {
            $scope.selectitem = function (e){
                $scope.options_8.api.setRowData(e.data.sale_loss_item_lineofsale_loss_item_lines)
            }
            $scope.options_4 = {
                rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
                pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
                groupKeys: undefined,
                groupHideGroupColumns: false,
                enableColResize: true, //one of [true, false]
                enableSorting: true, //one of [true, false]
                enableFilter: true, //one of [true, false]
                enableStatusBar: false,
                enableRangeSelection: true,
                rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
                rowDeselection: false,
                quickFilterText: null,
                rowClicked: $scope.selectitem,
                groupSelectsChildren: false, // one of [true, false]
                suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
                groupColumnDef: groupColumn,
                showToolPanel: false,
                checkboxSelection: function (params) {
                    var isGrouping = $scope.options_4.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                },
                getRowHeight: function (params) {
                    if (params.data.rowHeight == undefined) {
                        params.data.rowHeight = 25;
                    }
                    return params.data.rowHeight;
                }
            };

            $scope.columns_4 = [{
                headerName: "产品名称",
                field: "item_h_name",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                pinned: "left",
                width: 200,
            }, {
                headerName: "ERP编码",
                field: "erp_code",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                pinned: "left",
                width: 200,
            }, {
                headerName: "客户型号",
                field: "cust_item_name",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                pinned: "left",
                width: 120,
            }, {
                headerName: "原数量",
                field: "old_qty",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 90,
            }, {
                headerName: "更改后数量",
                field: "new_qty",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 120
            }];
        }

        //line2_options
        {

            $scope.options_8 = {
                rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
                pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
                groupKeys: undefined,
                groupHideGroupColumns: false,
                enableColResize: true, //one of [true, false]
                enableSorting: true, //one of [true, false]
                enableFilter: true, //one of [true, false]
                enableStatusBar: false,
                enableRangeSelection: true,
                rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
                rowDeselection: false,
                quickFilterText: null,
                rowClicked: undefined,
                groupSelectsChildren: false, // one of [true, false]
                suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
                groupColumnDef: groupColumn,
                showToolPanel: false,
                checkboxSelection: function (params) {
                    var isGrouping = $scope.options_8.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                },
            };
            $scope.add_line2 = function () {
                if($scope.data.currItem.currprocname != '采购'){
                    BasemanService.notice("流程处于采购状态才能新增报损明细", "alert-warning");
                    return;
                }
                if (!$scope.options_4.api.getFocusedCell()) {
                    BasemanService.notice("请先选择对应的生产单明细", "alert-warning");
                    return;
                }
                var data1=$scope.gridGetRow("options_4");
                item = {
                    cust_item_name: data1.item_h_name,
                };
                $scope.gridAddItem("options_8", item);
            };
            $scope.del_line2 = function () {
                if($scope.data.currItem.currprocname != '采购'){
                    BasemanService.notice("流程处于采购状态才能删除报损明细", "alert-warning");
                    return;
                }
                var data = $scope.gridGetData("options_8");
                var rowidx = $scope.options_8.api.getFocusedCell().rowIndex;
                data.splice(rowidx, 1);
                $scope.options_8.api.setRowData(data);
            }
            //机型
            $scope.cust_item_code = function () {
                $scope.FrmInfo = {
                    title: "产品查询",
                    is_high: true,
                    thead: [
                        {
                            name: "产品名称",
                            code: "item_h_name",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "客户机型",
                            code: "cust_item_name",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "合同价",
                            code: "price",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "工厂结算价",
                            code: "p4",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "PI数量",
                            code: "qty",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "已排产数量",
                            code: "proded_qty",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }],
                    postdata: {pi_id: $scope.data.currItem.pi_id,flag: 3},
                    classid: "sale_pi_header",
                    is_custom_search: true,
                };
                BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
                    var data2 = $scope.gridGetRow('options_8');
                    data2.cust_item_id = result.cust_item_id;
                    data2.cust_item_code = result. cust_item_code;
                    data2.cust_item_name = result.cust_item_name;
                    $scope.gridUpdateRow('options_8', data2);
                });
            };
            $scope.item_name = function () {
                var data1=$scope.gridGetRow("options_4");
                $scope.FrmInfo = {
                    is_custom_search: true,
                    is_high: true,
                    title: "物料",
                    thead: [
                        {
                            name: "物料编码",
                            code: "item_code",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "物料名称",
                            code: "item_name",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }],

                    postdata:{flag:8,
                        erp_code:data1.erp_code,
                    },
                    classid: "pro_item",
                };
                BasemanService.open(CommonPopController, $scope)
                    .result.then(function (result) {
                    var data2 = $scope.gridGetRow('options_8');
                    data2.item_id = result.item_id;
                    data2.item_code = result. item_code;
                    data2.item_name = result.item_name;
                    $scope.gridUpdateRow('options_8', data2);
                });
            };
            $scope.columns_8 = [{
                headerName: '物料呆滞情况',
                children: [ {
                    headerName: "机型", field: "cust_item_name", editable: false, filter: 'set', width: 120,
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },{
                    headerName: "物料编码", field: "item_code", editable: true, filter: 'set', width: 140,
                    cellEditor: "弹出框",
                    action: $scope.item_name,
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "物料", field: "item_name", editable: false, filter: 'set', width: 230,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                    {
                        headerName: "呆滞数量", field: "qty", editable: true, filter: 'set', width: 90,
                        cellEditor: "文本框",
                        enableRowGroup: true,
                        enablePivot: true,
                        enableValue: true,
                        floatCell: true
                    },
                    {
                        headerName: "金额", field: "amt", editable: true, filter: 'set', width: 90,
                        cellEditor: "文本框",
                        enableRowGroup: true,
                        enablePivot: true,
                        enableValue: true,
                        floatCell: true
                    }]
            }, {
                headerName: '确认结果',
                children: [
                    {
                        headerName: "确认数量", field: "conf_qty", editable: true, filter: 'set', width: 90,
                        cellEditor: "文本框",
                        enableRowGroup: true,
                        enablePivot: true,
                        enableValue: true,
                        floatCell: true
                    }, {
                        headerName: "处理意见", field: "note", editable: true, filter: 'set', width: 170,
                        cellEditor: "文本框",
                        enableRowGroup: true,
                        enablePivot: true,
                        enableValue: true,
                        floatCell: true
                    },
                    {
                        headerName: "报损数量", field: "bs_qty", editable: true, filter: 'set', width: 90,
                        cellEditor: "文本框",
                        enableRowGroup: true,
                        enablePivot: true,
                        enableValue: true,
                        floatCell: true
                    },
                    {
                        headerName: "待处理数量", field: "pend_qty", editable: true, filter: 'set', width: 90,
                        cellEditor: "文本框",
                        enableRowGroup: true,
                        enablePivot: true,
                        enableValue: true,
                        floatCell: true
                    }]
            }];
        }
    }
    $scope.initdata();
}//加载控制器
billmanControllers
    .controller('sale_loss_headerEdit', sale_loss_headerEdit)

