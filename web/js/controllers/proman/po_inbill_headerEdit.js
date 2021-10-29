var salemanControllers = angular.module('inspinia');
function po_inbill_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    po_inbill_headerEdit = HczyCommon.extend(po_inbill_headerEdit, ctrl_bill_public);
    po_inbill_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "po_inbill_header",
        key: "in_id",
        // wftempid: 10165,
        FrmInfo: {},
        grids: [{optionname: 'options_11', idname: 'po_inbill_lineofpo_inbill_headers'}]
    };
    /******************界面初始化****************************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD'),
            stat: 1,
        };
        if($rootScope.$state.$current.self.name=="crmman.po_inbill_headerEdit"){
            $scope.data.currItem.in_type=1;
        }
        if($rootScope.$state.$current.self.name=="crmman.po_inbill_header_qtEdit"){
            $scope.data.currItem.in_type=2;
        }
    };
    $scope.beforClearInfo = function () {
        var name = $rootScope.$state.$current.self.name;
        if (name == "crmman.po_inbill_headerEdit") {//采购入库
            $scope.s_flag = 1;
            $scope.headername = "采购入库";
            $scope.objconf.FrmInfo.sqlBlock="in_type=1";
            $scope.objconf.wftempid=10165;
        } else if (name == "crmman.po_inbill_header_qtEdit") {//其他入库
            $scope.s_flag = 2;
            $scope.headername = "其他入库";
            $scope.objconf.FrmInfo.sqlBlock="in_type=2";
            $scope.objconf.wftempid=10185;
        }
    };
    $scope.beforClearInfo();

    /******************弹出框******************/
    //客户
    $scope.selectcust = function () {
        if($scope.s_flag==1){
            return
        }
        $scope.FrmInfo = {
            classid: "customer",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_name = result.cust_name;
        });
    }
    //采购单号
    $scope.selectsource = function () {
        $scope.FrmInfo = {
            classid: "po_purchase_header",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.source_bill_no = result.po_no;
            $scope.data.currItem.source_bill_id = result.po_id;
            $scope.data.currItem.vender_name = result.vender_name;
            $scope.data.currItem.vender_code = result.vender_code;
            $scope.data.currItem.vender_id = result.vender_id;
            $scope.data.currItem.org_name = result.org_name;
            $scope.data.currItem.org_code = result.org_code;
            $scope.data.currItem.org_id = result.org_id;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_id = result.cust_id;
            var postdata={po_id:result.po_id}
            BasemanService.RequestPost("po_purchase_header", "select",postdata)
                .then(function (data1) {
                    $scope.options_11.api.setRowData(data1.po_purchase_lineofpo_purchase_headers);
                });
        });
    }
    //仓库
    $scope.selectwh = function () {
        $scope.FrmInfo = {
            classid: "po_warehouse",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.wh_code = result.wh_code;
            $scope.data.currItem.wh_name = result.wh_name;
            $scope.data.currItem.wh_id = result.wh_id;

        });
    }
    //物料
    $scope.selectitem = function () {
        $scope.FrmInfo = {
            classid: "po_item"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var data = [];
            var index = $scope.options_11.api.getFocusedCell().rowIndex;
            var node = $scope.options_11.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            var postdata = {
                po_item_code: result.po_item_code,
                vender_id: $scope.data.currItem.vender_id,
                vender_code: $scope.data.currItem.vender_code,
                curr_code: $scope.data.currItem.curr_code,
            }
            BasemanService.RequestPost("po_contract_header", "getcontractprice", postdata)
                .then(function (data1) {
                    data[index].price = data1.price;
                    data[index].uom_name = result.uom_name;
                    data[index].po_item_id = result.po_item_id;
                    data[index].po_item_code = result.po_item_code;
                    data[index].po_item_name = result.po_item_name;
                    $scope.options_11.api.setRowData(data);
                });
        });
    }
    /******************网格定义区域****************************/
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
        cellRendererParams: {
            checkbox: true
        }
    };
    //明细
    $scope.columns_11 = [{
        headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
        cellEditor: "文本框",
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "物料编码", field: "po_item_code", editable: true, filter: 'set', width: 150,
        cellEditor: "弹出框",
        action: $scope.selectitem,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "物料名称", field: "po_item_name", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "单位", field: "uom_name", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "申请数量", field: "apply_qty", editable: true, filter: 'set', width: 100,
        cellEditor: "整数框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "已入库数量", field: "in_qty", editable: true, filter: 'set', width: 100,
        cellEditor: "整数框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "未入库数量", field: "un_qty", editable: true, filter: 'set', width: 100,
        cellEditor: "整数框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "本次入库数量", field: "qty", editable: true, filter: 'set', width: 100,
        cellEditor: "整数框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }];
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
        }
    };

    $scope.initdata();

}

//加载控制器
salemanControllers
    .controller('po_inbill_headerEdit', po_inbill_headerEdit);
