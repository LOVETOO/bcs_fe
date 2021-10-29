var basemanControllers = angular.module('inspinia');
function sale_allprice_synch($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {
    sale_allprice_synch = HczyCommon.extend(sale_allprice_synch, ctrl_bill_public);
    sale_allprice_synch.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    $scope.objconf = {
        name: undefined,
        key: undefined,
        wftempid: undefined,
        FrmInfo: {},
        grids: [
            {optionname: 'options_11', idname: 'sale_pi_priceapply_lineofsale_pi_priceapply_headers'},
            {optionname: 'options_12', idname: 'sale_pi_priceapply_line2ofsale_pi_priceapply_headers'},
        ]
    };
    //ItemHCode
    $scope.ItemHCode = function () {
        $scope.FrmInfo = {
            is_high: true,
            is_custom_search: true,
            title: "整机查询",
            thead: [
                {
                    name: "整机编码",
                    code: "item_h_code",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "整机名称",
                    code: "item_h_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            classid: "pro_item_header",
            postdata: {},
            sqlBlock: "item_type in (1,2) and usable=2",
            type: "checkbox",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (items) {
            if (items.length) {
                var ids = '', names = '';
                for (var i = 0; i < items.length; i++) {
                    if (i == items.length - 1) {
                        names += "'"+items[i].item_h_name+"'";
                        ids += "'"+items[i].item_h_code+"'";
                    } else {
                        names += "'"+items[i].item_h_name+"'";
                        names += ',';
                        ids += "'"+items[i].item_h_code+"'";
                        ids += ',';
                    }
                }
            }
            $scope.data.currItem.item_h_code = ids;
            $scope.data.currItem.item_h_name = names;
        });
    };
    $scope.ChangeItem=function(){
        $scope.data.currItem.item_h_code="";
        $scope.data.currItem.item_h_name="";
    }
    $scope.usable1 = function () {
        $scope.data.currItem.usable1 = 2;
        $scope.data.currItem.usable4 = 1;
    };
    $scope.usable4 = function () {
        $scope.data.currItem.usable1 = 1;
        $scope.data.currItem.usable4 = 2;
    };
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
    $scope.search_11 = function () {
        var postdata = {};
        postdata.flag = 0;
        if ($scope.data.currItem.item_h_code != undefined && $scope.data.currItem.item_h_code != "") {
            postdata.item_h_code = $scope.data.currItem.item_h_code
        }
        var promise = BasemanService.RequestPost("sale_pi_priceapply_header", "pi_priceapply", postdata);
        promise.then(function (data) {
            $scope.data.currItem.sale_pi_priceapply_lineofsale_pi_priceapply_headers =
                data.sale_pi_priceapply_lineofsale_pi_priceapply_headers;
            $scope.data.currItem.sale_pi_priceapply_line2ofsale_pi_priceapply_headers =
                data.sale_pi_priceapply_line2ofsale_pi_priceapply_headers;

            for (var i = 0; i < data.sale_pi_priceapply_lineofsale_pi_priceapply_headers.length; i++) {
                data.sale_pi_priceapply_lineofsale_pi_priceapply_headers[i].seq = (i + 1);
            }
            $scope.gridSetData('options_11', data.sale_pi_priceapply_lineofsale_pi_priceapply_headers)
            $scope.rowClicked_11(undefined);
        });
    }
    $scope.tb_11 = function () {
        var select_row = $scope.selectGridGetData('options_11');
        if (!select_row.length) {
            BasemanService.notice("未选中行!", "alert-warning");
            return;
        }
        var obj=[];
        for(var i=0;i<select_row.length;i++){
            var pdm_price=parseFloat(select_row[i].pdm_price||0);
            if(pdm_price==0){continue;}
            obj.push(select_row[i]);
            var ischeck=true;
        }
        if(ischeck==true){
            BasemanService.RequestPost("sale_pi_priceapply_header", "up_priceapply", {
                sale_pi_priceapply_lineofsale_pi_priceapply_headers: obj,
            }).then(function (data) {
                BasemanService.notice("同步价格结束！价格维护单号[" + data.price_apply_no + "]");
            })
        }
    };
    $scope.cancel_11 = function () {
        ds.dialog.confirm("你要作废所有的业务结算价，是否确认继续操作?", function () {
            BasemanService.RequestPost("sale_pi_priceapply_header", "cancel", {flag: 100}).then(function () {
                BasemanService.notice("作废完成!");
            })
        })

    };
    $scope.rowClicked_11 = function (e) {
        var data = {}
        if (e == undefined) {
            data = $scope.gridGetRow('options_11');
            if(!data){
                data=$scope.gridGetData('options_11')[0]
            }
        } else {
            data = e.data;
        }
        var datas = [], j = 0, obj = {}
        for (var i = 0; i < $scope.data.currItem.sale_pi_priceapply_line2ofsale_pi_priceapply_headers.length; i++) {
            obj = $scope.data.currItem.sale_pi_priceapply_line2ofsale_pi_priceapply_headers[i]
            if (obj.item_h_id == data.item_h_id) {
                obj.seq = ++j
                datas.push(obj);
            }
        }
        $scope.gridSetData('options_12', datas);
    };
    $scope.options_11 = {
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
        rowClicked: $scope.rowClicked_11,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_11.columnApi.getRowGroupColumns().length > 0;
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
    $scope.columns_11 = [
        {
            headerName: "序号",
            field: "seq",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            pinned: "left",
            checkboxSelection: function (params) {
                return params.columnApi.getRowGroupColumns().length == 0
            },
            width: 80,
        }, {
            headerName: "整机编码",
            field: "item_h_code",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120,
        }, {
            headerName: "整机名称",
            field: "item_h_name",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "原结算价(USD)",
            field: "base_price",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "原工厂结算价(RMB)",
            field: "settle_price",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "开始时间",
            field: "start_date",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "结束时间",
            field: "end_date",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "新结算价(USD)",
            field: "base_price1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "原工厂结算价(RMB)",
            field: "settle_price1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "材料成本",
            field: "pdm_price",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "单套制造费用",
            field: "p1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }];
    $scope.options_12 = {
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
            var isGrouping = $scope.options_12.columnApi.getRowGroupColumns().length > 0;
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
    $scope.columns_12 = [
        {
            headerName: "序号",
            field: "seq",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            pinned: "left",
            width: 80,
        }, {
            headerName: "整机编码",
            field: "item_h_code",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "整机名称",
            field: "item_h_name",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "分机编码",
            field: "item_code",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "分机名称",
            field: "item_name",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "原结算价(USD)",
            field: "base_price",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "原工厂结算价(RMB)",
            field: "settle_price",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "新结算价(USD)",
            field: "base_price1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "原工厂结算价(RMB)",
            field: "settle_price1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "材料成本",
            field: "pdm_price",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "单套制造费用",
            field: "p1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }];
    $scope.search_21 = function () {
        var postdata = {};
        if ($scope.data.currItem.item_h_code != undefined && $scope.data.currItem.item_h_code != "") {
            postdata.item_h_code = $scope.data.currItem.item_h_code
        }
        var promise = BasemanService.RequestPost("sale_std_priceapply_header", "pi_priceapply", postdata);
        promise.then(function (data) {
            $scope.data.currItem.sale_std_priceapply_lineofsale_std_priceapply_headers =
                data.sale_std_priceapply_lineofsale_std_priceapply_headers;
            $scope.data.currItem.sale_std_priceapply_line2ofsale_std_priceapply_headers =
                data.sale_std_priceapply_line2ofsale_std_priceapply_headers;

            for (var i = 0; i < data.sale_std_priceapply_lineofsale_std_priceapply_headers.length; i++) {
                data.sale_std_priceapply_lineofsale_std_priceapply_headers[i].seq = (i + 1);
            }
            $scope.gridSetData('options_21', data.sale_std_priceapply_lineofsale_std_priceapply_headers)
            $scope.rowClicked_21(undefined);
        });
    };
    $scope.rowClicked_21 = function (e) {
        var data = {}
        if (e == undefined) {
            data = $scope.gridGetRow('options_21');
            if(!data){
                data=$scope.gridGetData('options_21')[0]
            }
        } else {
            data = e.data;
        }
        var datas = [], j = 0, obj = {}
        for (var i = 0; i < $scope.data.currItem.sale_std_priceapply_line2ofsale_std_priceapply_headers.length; i++) {
            obj = $scope.data.currItem.sale_std_priceapply_line2ofsale_std_priceapply_headers[i]
            if (obj.item_h_id == data.item_h_id) {
                obj.seq = ++j
                datas.push(obj);
            }
        }
        $scope.gridSetData('options_22', datas);
    };
    $scope.tb_21 = function () {
        var datas = $scope.selectGridGetData('options_21');
        if (datas.length < 1) {
            BasemanService.notice("请先选择要同步价格的产品!")
            return
        }
        BasemanService.RequestPost("sale_std_priceapply_header", "up_priceapply", {
            sale_std_priceapply_lineofsale_std_priceapply_headers: datas,
        }).then(function (data) {
            BasemanService.notice("同步价格结束！价格维护单号[" + data.price_apply_no + "]");
        })
    };
    $scope.cancel_21 = function () {
        ds.dialog.confirm("你要作废所有的业务结算价，是否确认继续操作?", function () {
            BasemanService.RequestPost("sale_std_priceapply_header", "cancel", {flag: 100}).then(function () {
                BasemanService.notice("作废完成!");
            })
        })

    };
    $scope.options_21 = {
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
        rowClicked: $scope.rowClicked_21,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_21.columnApi.getRowGroupColumns().length > 0;
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
    $scope.columns_21 = [
        {
            headerName: "序号",
            field: "seq",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            pinned: "left",
            checkboxSelection: function (params) {
                return params.columnApi.getRowGroupColumns().length == 0
            },
            width: 80,
        }, {
            headerName: "整机编码",
            field: "item_h_code",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "整机名称",
            field: "item_h_name",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "原基准价(USD)",
            field: "base_price",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "原工厂基准价(RMB)",
            field: "settle_price",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "开始时间",
            field: "start_date",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "结束时间",
            field: "end_date",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "新基准价(USD)",
            field: "base_price1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "新工厂基准价(RMB)",
            field: "settle_price1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "材料成本",
            field: "std_price",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "单套制造费用",
            field: "p1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }];
    $scope.options_22 = {
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
            var isGrouping = $scope.options_22.columnApi.getRowGroupColumns().length > 0;
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
    $scope.columns_22 = [
        {
            headerName: "序号",
            field: "seq",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            pinned: "left",
            width: 80,
        }, {
            headerName: "整机编码",
            field: "item_h_code",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "整机名称",
            field: "item_h_name",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "分机编码",
            field: "item_code",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            id: "item_name",
            headerName: "分机名称",
            field: "item_name",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "原基准价(USD)",
            field: "base_price",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "原工厂基准价(RMB)",
            field: "settle_price",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "新基准价(USD)",
            field: "base_price1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "新工厂基准价(RMB)",
            field: "settle_price1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "材料成本",
            field: "std_price",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "单套制造费用",
            field: "p1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }];
    $scope.search_31 = function () {
        var postdata = {};
        if ($scope.data.currItem.item_h_code != undefined && $scope.data.currItem.item_h_code != "") {
            postdata.item_h_code = $scope.data.currItem.item_h_code
        }
        if ($scope.data.currItem.create_time != undefined && $scope.data.currItem.create_time != "") {
            postdata.create_time = $scope.data.currItem.create_time
        }
        var promise = BasemanService.RequestPost("sale_guide_priceapply_header", "getitemlist2", postdata);
        promise.then(function (data) {
            $scope.data.currItem.sale_guide_priceapply_line2ofsale_guide_priceapply_headers =
                data.sale_guide_priceapply_line2ofsale_guide_priceapply_headers;
            for (var i = 0; i < data.sale_guide_priceapply_line2ofsale_guide_priceapply_headers.length; i++) {
                data.sale_guide_priceapply_line2ofsale_guide_priceapply_headers[i].seq = (i + 1);
            }
            $scope.gridSetData('options_31', data.sale_guide_priceapply_line2ofsale_guide_priceapply_headers);
        });
    };
    $scope.tooms_31 = function () {
        var selectrows = $scope.selectGridGetData("options_31");
        if (selectrows.length < 1) {
            BasemanService.notice("请先选择要同步价格的产品!")
            return;
        }
        var postdata = {}, obj = {};
        if ($scope.data.currItem.tb_all) {
            postdata.flag = 10;
        }
        postdata.sale_guide_priceapply_lineofsale_guide_priceapply_headers = selectrows;
        var promise = BasemanService.RequestPost("sale_guide_priceapply_header", "pi_priceapply", postdata);
        promise.then(function (data) {
            for (var i = 0; i < data.sale_guide_priceapply_line2ofsale_guide_priceapply_headers.length; i++) {
                obj = data.sale_guide_priceapply_line2ofsale_guide_priceapply_headers[i];
                for (var j = 0; j < selectrows.length; j++) {
                    if (selectrows[j].item_h_id == obj.item_h_id && selectrows[j].item_id == obj.item_id) {
                        selectrows[j].base_price = obj.base_price;
                        selectrows[j].settle_price = obj.settle_price;
                        selectrows[j].Base_Price1 = obj.Base_Price1;
                        selectrows[j].std_price = obj.std_price;
                        selectrows[j].syn_date = $scope.data.currItem.create_time || "";
                        selectrows[j].syn_user = window.userbean.userid;
                        break;
                    }
                }
            }
            $scope["options_31"].api.deselectAll();
            $scope["options_31"].api.refreshView();
        })
    };
    $scope.tb_all = function () {
        $scope["options_31"].api.selectAll();
    };
    $scope.select_zero = function () {
        var nodes = $scope.gridGetNodes("options_31");
        for (var i = 0; i < nodes.length; i++) {
            if (Number(nodes[i].data.base_price1) == 0 && Number(nodes[i].data.settle_price1) == 0) {
                nodes[i].setSelected($scope.data.currItem.zero1);
            }
            if(nodes[i].isSelected()){
                continue;
            }
            if(Number(nodes[i].data.std_price) == 0){
                nodes[i].setSelected($scope.data.currItem.zero2);
            }
        }

    };
    $scope.tb_31 = function () {
        var datas = $scope.selectGridGetData('options_31');
        if (datas.length < 1) {
            BasemanService.notice("请先选择要同步价格的产品!")
            return
        }
        BasemanService.RequestPost("sale_guide_priceapply_header", "up_priceapply", {
            sale_guide_priceapply_line2ofsale_guide_priceapply_headers: datas,
        }).then(function (data) {
            BasemanService.notice("同步价格结束！价格维护单号[" + data.price_apply_no + "]");
        })
    };
    $scope.cancel_31 = function () {
        ds.dialog.confirm("你要作废所有的业务结算价，是否确认继续操作?", function () {
            BasemanService.RequestPost("sale_guide_priceapply_header", "cancel", {flag: 100}).then(function () {
                BasemanService.notice("作废完成!");
            })
        })

    };
    $scope.options_31 = {
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
            var isGrouping = $scope.options_31.columnApi.getRowGroupColumns().length > 0;
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
    $scope.columns_31 = [
        {
            headerName: "序号",
            field: "seq",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            pinned: "left",
            width: 80,
            checkboxSelection:function (params) {
                return params.columnApi.getRowGroupColumns().length == 0
            },
        }, {
            headerName: "整机编码",
            field: "item_h_code",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "整机名称",
            field: "item_h_name",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "分机编码",
            field: "item_code",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            id: "item_name",
            headerName: "分机名称",
            field: "item_name",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "原基准价(USD)",
            field: "base_price",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "原工厂基准价(RMB)",
            field: "settle_price",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 120
        }, {
            headerName: "新基准价(USD)",
            field: "base_price1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "新工厂基准价(RMB)",
            field: "settle_price1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "材料成本",
            field: "std_price",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "单套制造费用",
            field: "p1",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "同步日期",
            field: "syn_date",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }, {
            headerName: "同步人",
            field: "syn_user",
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            width: 100
        }];
    $scope.clearinformation = function () {
        $scope.data.currItem.usable1 = 2
    };
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('sale_allprice_synch', sale_allprice_synch);
