var basemanControllers = angular.module('inspinia');
function price_typeEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    price_typeEdit = HczyCommon.extend(price_typeEdit, ctrl_bill_public);
    price_typeEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"price_type",
        key:"price_type_id",
        //wftempid:
        FrmInfo: {},
        grids:[ {optionname: 'aoptions', idname: 'price_type_lineofprice_types'}]
    };
    /**----弹出框区域*---------------*/
    $scope.fee_code = function () {
        $scope.FrmInfo = {
            title: "付款条件查询",
            thead: [{
                name: "付款条件编码",
                code: "order_fee_code"
            }, {
                name: "付款条件名称",
                code: "order_fee_name"
            }],
            classid: "sale_order_fee",
            searchlist: ["order_fee_code", "order_fee_name"]
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (data) {
            var nodes = $scope.aoptions.api.getModel().rootNode.allLeafChildren;
            var cell = $scope.aoptions.api.getFocusedCell();
            nodes[cell.rowIndex].data.order_fee_code = data.order_fee_code;
            nodes[cell.rowIndex].data.order_fee_name = data.order_fee_name;
            nodes[cell.rowIndex].data.order_fee_id = data.order_fee_id;
            $scope.aoptions.api.refreshRows(nodes);
        })
    };
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss')
        };
    };

    /**------保存校验区域-----*/


    /**-------网格定义区域 ------*/
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
    //收货信息
    $scope.aoptions = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.aoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.acolumns = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "订单费用编码", field: "order_fee_code", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            action:$scope.fee_code,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "订单费用名称", field: "order_fee_name", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    //增加当前行、删除当行前
    $scope.additem = function () {
//避免填写数据丢失
        $scope.aoptions.api.stopEditing(false);
        var data = [];
        var node = $scope.aoptions.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        var item = {
            seq: node.length + 1
        };
        data.push(item);
        $scope.aoptions.api.setRowData(data);
        $scope.data.currItem.price_type_lineofprice_types = data;
    };
    $scope.delitem = function () {
//避免填写数据丢失
        $scope.aoptions.api.stopEditing(false);
        var data = [];
        var rowidx = $scope.aoptions.api.getFocusedCell().rowIndex;
        var node = $scope.aoptions.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.aoptions.api.setRowData(data);
        $scope.data.currItem.price_type_lineofprice_types = data;

    };
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('price_typeEdit', price_typeEdit);
