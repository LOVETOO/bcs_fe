var basemanControllers = angular.module('inspinia');
function sale_prod_cancel_headerEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_prod_cancel_headerEdit = HczyCommon.extend(sale_prod_cancel_headerEdit, ctrl_bill_public);
    sale_prod_cancel_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"sale_prod_cancel_header",
        key:"cancel_id",
        wftempid:10121,
        FrmInfo: {},
        grids:[ {optionname: 'aoptions', idname: 'sale_prod_cancel_lineofsale_prod_cancel_headers'}]
    };
    /**----弹出框区域*---------------*/
    $scope.cust_code11 = function () {
        $scope.FrmInfo = {
            title: "付款条件查询",
            thead: [],
            classid: "customer",
			sqlBlock:"",
            searchlist: ["order_fee_code", "order_fee_name"]
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (data) {
            var nodes = $scope.aoptions.api.getModel().rootNode.allLeafChildren;
            var cell = $scope.aoptions.api.getFocusedCell();
            nodes[cell.rowIndex].data.cust_code = data.cust_code;
            nodes[cell.rowIndex].data.cust_name = data.cust_name;
            nodes[cell.rowIndex].data.cust_id = data.cust_id;
            $scope.aoptions.api.refreshRows(nodes);
        })
    };
	
	$scope.qty11 = function () {
            var _this = $(this);	
			var val = _this.val();
            var index = $scope.aoptions.api.getFocusedCell().rowIndex;
            var node = $scope.aoptions.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            };	
			node[index].data.amt=parseInt(data[index].price||0)*parseInt(val||0);
			$scope.aoptions.api.refreshCells(node,["amt"]);			
    }
	$scope.price11 = function () {
            var _this = $(this);	
			var val = _this.val();
            var index = $scope.aoptions.api.getFocusedCell().rowIndex;
            var node = $scope.aoptions.api.getModel().rootNode.childrenAfterSort;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            };	
			node[index].data.amt=parseInt(data[index].qty||0)*parseInt(val||0);
			$scope.aoptions.api.refreshCells(node,["amt"]);					
    }
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			stat:1
        };
    };
    $scope.save_before =function(){
		delete $scope.data.currItem.price_type_lineofprice_types;
	}
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
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
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
            headerName: "生产单号", field: "prod_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "商检批次", field: "inspection_batchno", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "类型", field: "pro_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value:1,desc:"整机"},{value:2,desc:"内机"},{value:3,desc:"外机"},{value:4,desc:"配件"}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "产品编码", field: "item_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "产品名称", field: "item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "ERP编码", field: "erp_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "生产数量", field: "prod_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "发货数量", field: "warned_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "客户编码", field: "cust_code", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
			action:$scope.cust_code11,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "数量", field: "qty", editable: true, filter: 'set', width: 150,
            cellEditor: "整数框",
			cellchange:$scope.qty11,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "价格", field: "price", editable: true, filter: 'set', width: 150,
            cellEditor: "整数框",
			cellchange:$scope.price11,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "金额", field: "amt", editable: false, filter: 'set', width: 150,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "备注", field: "note", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "提示信息", field: "note2", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    //增加当前行、删除当行前
    $scope.additem = function () {		
		$scope.FrmInfo = {
			is_custom_search:true,
			type:"checkbox",
            title: "生产单明细查询",
            thead: [{
                name: "生产单号",
                code: "prod_no"
            }, {
                name: "商检批号",
                code: "inspection_batchno"
            }, {
                name: "产品编码",
                code: "item_code"
            }, {
                name: "ERP编码",
                code: "erp_code"
            }],
            classid: "sale_prod_header",
			postdata:{flag:13},
            searchlist: ["prod_no", "inspection_batchno", "item_code", "erp_code"]
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (items) {		
			var data=$scope.gridGetData("aoptions");
			var max=$scope.getmax(data,"seq");
			for(var i=0;i<items.length;i++){
				if(items[i].seq==undefined||parseInt(items[i].seq)==0||items[i].seq==""){
					items[i].seq=(max+i+1);
				}
			}
			var data=data.concat(items);
            $scope.aoptions.api.setRowData(data);
        })
    };
    $scope.delitem = function () {
        var data = [];
        var rowidx = $scope.aoptions.api.getFocusedCell().rowIndex;
        var node = $scope.aoptions.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.aoptions.api.setRowData(data);
    };
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('sale_prod_cancel_headerEdit', sale_prod_cancel_headerEdit);
