var salemanControllers = angular.module('inspinia');
function po_outbill_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    po_outbill_headerEdit = HczyCommon.extend(po_outbill_headerEdit, ctrl_bill_public);
    po_outbill_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "po_outbill_header",
        key: "out_id",
        // wftempid: 10165,
        FrmInfo: {},
        grids: [{optionname: 'options_11', idname: 'po_outbill_lineofpo_outbill_headers'}]
    };
    /******************界面初始化****************************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD'),
            stat: 1,
        };
    };
    /******************弹出框******************/
    //部门
    $scope.selectorg = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        $scope.FrmInfo = {
            classid: "scporg",
            sqlBlock: "stat =2 and OrgType = 5",
            backdatas: "orgs",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_id = result.orgid;
        });
    }
    //客户
    $scope.selectcust = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        if($scope.data.currItem.org_code==0||$scope.data.currItem.org_code==undefined){
            BasemanService.notice("请先选部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            sqlBlock:"org_code='"+$scope.data.currItem.org_code+"'",
            classid: "customer",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_name = result.cust_name;
        });
    }
    //仓库
    $scope.selectwh = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
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
        if($scope.data.currItem.wh_code==undefined||$scope.data.currItem.wh_code==""){
            BasemanService.notice("请选择仓库", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            classid: "po_inventory",
            sqlBlock:"wh_code='"+$scope.data.currItem.wh_code+"'",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var data = [];
            var index = $scope.options_11.api.getFocusedCell().rowIndex;
            var node = $scope.options_11.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            data[index].canuse_qty = result.canuse_qty;
            data[index].po_item_id = result.po_item_id;
            data[index].po_item_code = result.po_item_code;
            data[index].po_item_name = result.po_item_name;

        });
    }
    //网格明细新增
    $scope.addline11 = function () {
        var data = $scope.gridGetData("options_11");
        var item = {seq: data.length + 1};
        data.push(item);
        $scope.options_11.api.setRowData(data);
    }
    //删除明细
    $scope.delline11 = function () {
        var data = [];
        var rowidx = $scope.options_11.api.getFocusedCell().rowIndex;
        var node = $scope.options_11.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_11.api.setRowData(data);
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
        headerName: "库存数量", field: "canuse_qty", editable: false, filter: 'set', width: 100,
        cellEditor: "整数框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "本次领用数量", field: "qty", editable: true, filter: 'set', width: 100,
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
    .controller('po_outbill_headerEdit', po_outbill_headerEdit);
