var basemanControllers = angular.module('inspinia');

function ProItemHeaderDetail($scope, $http, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {

    localeStorageService.pageHistory($scope, function () {
        return $scope.data.currItem
    });
    $scope.data = {};
    $scope.userbean = {};
    $scope.data.currItem = {
        price_type_lineofprice_types: []
    };
    //是否可用
    $scope.sub = function () {
        $scope.showType = !$scope.showType;
    };
    $scope.init = function () {
        BasemanService.pageInit($scope);
        var postdata = {
            sqlwhere: ""
        };
        // 登录用户
        $scope.userbean = window.userbean;
        $scope.mainbtn = {
            search: false,
            add: false
        };

    };

    $scope.init();
//产品分类
    $scope.trade_types = [{dictname: '正贸', dictvalue: '1'},
        {dictname: '边贸', dictvalue: '2'},
        {dictname: '越南内销', dictvalue: '3'}];
    $scope.item_styles = [{dictname: '正贸', dictvalue: '1'},
        {dictname: '边贸', dictvalue: '2'},
        {dictname: '越南内销', dictvalue: '3'}];
    $scope.proptypes=[{dictname: '正贸', dictvalue: '1'},
        {dictname: '边贸', dictvalue: '2'},
        {dictname: '越南内销', dictvalue: '3'}]
    $scope.mb_stands=[{dictname: '正贸', dictvalue: '1'},
        {dictname: '边贸', dictvalue: '2'},
        {dictname: '越南内销', dictvalue: '3'}]
	$scope.item_types=[{dictname: '正贸', dictvalue: '1'},
        {dictname: '边贸', dictvalue: '2'},
        {dictname: '越南内销', dictvalue: '3'}]

//删除
    $scope.delete = function (index) {
        var postdata = {
            item_h_id: $scope.data.currItem.item_h_id
        };
        ds.dialog.confirm("您确定删除这条记录吗？", function () {
            if (postdata.item_h_id == undefined || postdata.item_h_id == 0) {
                BasemanService.notify(notify, "单据ID不存在，不能删除", "alert-warning", 1000);
                return;
            }
            ;

            var promise = BasemanService.RequestPost("pro_item_header", "delete", postdata);
            promise.then(function (data) {
                BasemanService.notify(notify, "删除成功!", "alert-info", 1000);
                $scope.new();
            });
        });
    }
    $scope.search=function(){
	$scope.FrmInfo = {
            title: "标准机型查询",
            thead: [{
            name: "整机编码",
            code: "item_h_code"
        }, {
            name: "整机名称",
            code: "item_h_name"
        }, {
            name: "整机型号",
            code: "h_spec"
        }, {
            name: "产品平台",
            code: "item_platform"
        }, {
            name: "备注",
            code: "note"
        }],
        classid: "pro_item_header",
        searchlist: ["item_h_code","item_h_name","h_spec","item_platform","note"]
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
		    $scope.data.currItem.item_h_id = result.item_h_id;
            $scope.refresh(2);
			
        })
}

	 //刷新
    $scope.refresh = function (flag) {
        var postdata = {
            item_h_id: $scope.data.currItem.item_h_id
        };
        if (postdata.item_h_id == undefined || postdata.item_h_id == 0) {
            BasemanService.notify(notify, "单据没有保存，无法刷新", "alert-warning", 1000);
            return;
        }
        ;
        var promise = BasemanService.RequestPost("pro_item_header", "select", postdata);
        promise.then(function (data) {
            //HczyCommon.stringPropToNum(data);
            if (flag != 2) {
                BasemanService.notify(notify, "刷新成功", "alert-info", 500);
            };
			$scope.data.currItem=data;
            $scope.data.currItem.usable = data.usable;
            $scope.data.currItem.pro_itemofpro_item_headers = data.pro_itemofpro_item_headers;
            $scope.feeoptions.api.setRowData($scope.data.currItem.pro_itemofpro_item_headers);

            $scope.aoptions.api.setRowData($scope.data.currItem.pro_itemofpro_item_headers[0].pro_item_partofpro_items);
        });
        $scope.showType = 1;
    };
    $scope.bigc_search = function () {
        $scope.FrmInfo = {};
        $scope.FrmInfo.title = "大类查询";
        $scope.FrmInfo.initsql = " lev=3 ";
        $scope.FrmInfo.thead = [{
            name: "大类编码",
            code: "item_type_no"
        }, {
            name: "大类名称",
            code: "item_type_name"
        }];
        $scope.sqlwhere = ["bigc_name", "bigc_code"]
        $scope.classname = "pro_item_type";
        $scope.fun = "search";

        BasemanService.openFrm("views/common/Pop_Common.html", CommonController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.bigc_name = result.item_type_name;
            $scope.data.currItem.bigc_code = result.item_type_no;
            $scope.data.currItem.bigc_id = result.item_type_id;

        });
    };

    $scope.gk_search = function () {
        $scope.FrmInfo = {};
        $scope.FrmInfo.title = "大类查询";
        $scope.FrmInfo.thead = [{
            name: "大类编码",
            code: "item_type_no"
        }, {
            name: "大类名称",
            code: "item_type_name"
        }];
        $scope.sqlwhere = ["bigc_name", "bigc_code"]
        $scope.classname = "pro_item_header.gk";
        $scope.fun = "search";
        BasemanService.openFrm("views/common/Pop_Common.html", CommonController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.bigc_name = result.item_type_name;
            $scope.data.currItem.bigc_code = result.item_type_no;
            $scope.data.currItem.bigc_id = result.item_type_id;

        });
    };


    $scope.save = function (e) {
        HczyCommon.commitGrid_GetData_setSeq($scope);
        var postdata = {}
        for (var name in $scope.data.currItem) {
            if (name != "pro_item_partofpro_items") {
                postdata[name] = $scope.data.currItem[name];
            }
        }


        var postdata = $scope.data.currItem;
        delete $scope.data.currItem.pro_type;
        delete $scope.data.currItem.pro_item_partofpro_items

        var action = "update";
        if (postdata.item_h_id == undefined || postdata.item_h_id == 0) {
            var action = "insert";
        }
        var promise = BasemanService.RequestPost("pro_item_header", action, postdata);
        promise.then(function (data) {
            BasemanService.notify(notify, "保存成功!", "alert-info", 1000);
            $scope.isEdit = true;
        });

    }


    $scope.additem = function () {
        var item = {
            seq: 1
        };
        $scope.feeoptions.grid.getData().push(item);
        $scope.feeoptions.grid.resizeCanvas();
        //$scope.aoptions.grid.render();
    };
    $scope.delitem = function () {
        var grid = $scope.feeoptions.grid;
        var rowidx = grid.getActiveCell().row;
        $scope.feeoptions.grid.getData().splice(rowidx, 1);
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();
    };

    //customer
    $scope.addcntitem = function () {
        var grid = $scope.feeoptions.grid;

        if (!grid.getActiveCell()) {
            BasemanService.notify(notify, "请点击行对应分体机", "alert-info", 1000);
            return;
        }
        var rowidx = grid.getActiveCell().row;
        var data = grid.getData();
        $scope.FrmInfo = {
            title: "易损件查询",
            thead: [
                {
                    name: "配件编码",
                    code: "item_code"
                }, {
                    name: "数量",
                    code: "qty"
                }, {
                    name: "描述",
                    code: "part_desc"
                }],
            classid: "base_pro_part",
            postdata: {flag: 1, item_code: data[rowidx].item_code},
            type: "checkbox",
            searchlist: ["note"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (items) {
            if (items.length) {
                var grid = $scope.aoptions.grid;
                var data = grid.getData();
                var length = data.length;
                for (var i = 0; i < items.length; i++) {
                    var tempobj = new Object();
                    tempobj.part_code = items[i].part_code;
                    tempobj.part_name = items[i].part_name;
                    tempobj.part_en_name = items[i].part_en_name;
                    tempobj.price = items[i].price;
                    tempobj.item_h_id = items[i].item_h_id;
                    tempobj.part_class = items[i].part_class;
                    tempobj.qty = items[i].qty;
                    tempobj.part_desc = items[i].part_desc;
                    tempobj.seq = (i + 1 + length);
                    tempobj.item_code = items[i].item_code;
                    data.push(tempobj);
                }
            }
            grid.setData(data);
            grid.invalidateAllRows();
            grid.render();
        });
    }


    $scope.addcntitem1 = function () {
        var item = {
            seq: 1
        };
        $scope.aoptions.grid.getData().push(item);
        $scope.aoptions.grid.resizeCanvas();
    }
    $scope.delcntitem = function () {
        var grid = $scope.aoptions.grid;
        var rowidx = grid.getActiveCell().row;
        $scope.aoptions.grid.getData().splice(rowidx, 1);
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();
    };
    $scope.deleteLine = function () {

        var grid = $scope.aoptions.grid;
        if (grid.getActiveCell()) {
            var rowidx = grid.getActiveCell().row;
            $scope.aoptions.grid.getData().splice(rowidx, 1);
            grid.invalidateAllRows();
            grid.updateRowCount();
            grid.render();
        }

    };

    var groupColumn = {
    headerName: "Group",
    width: 200,
    field: 'name',
    valueGetter: function(params) {
        if (params.node.group) {
            return params.node.key;
        } else {
            return params.data[params.colDef.field];
        }
    },
    comparator: agGrid.defaultGroupComparator,
    cellRenderer: 'group',
    cellRendererParams: function(params){
        //checkbox: true
    }
};
    $scope.rowClicked=function(event){
		if(event.data){
     $scope.aoptions.api.setRowData(event.data.pro_item_partofpro_items);
		}
	}
    $scope.feeoptions = {
    rowGroupPanelShow: 'onlyWhenGrouping',  //on of ['always','onlyWhenGrouping']
    pivotPanelShow: 'always',
    groupKeys: undefined, 
    groupHideGroupColumns: true,
    enableColResize: true, 
    enableSorting: true, 
    enableFilter: true, 
    enableStatusBar: false,
    enableRangeSelection: true,
    rowSelection: "multiple",
    rowDeselection: true,
	rowClicked:$scope.rowClicked,
    quickFilterText: null,
    groupSelectsChildren: true, 
    suppressRowClickSelection: true,
    groupColumnDef: groupColumn,
    showToolPanel: false,
    checkboxSelection: function (params) {
        var isGrouping = $scope.feeoptions.columnApi.getRowGroupColumns().length > 0;
        return params.colIndex === 0 && !isGrouping;
    },
    icons: {
        columnRemoveFromGroup: '<i class="fa fa-remove"/>',
        filter: '<i class="fa fa-filter"/>',
        sortAscending: '<i class="fa fa-long-arrow-down"/>',
        sortDescending: '<i class="fa fa-long-arrow-up"/>',
    }
    };

	$scope.feecolumns = [       
    {
        headerName: "序号", field: "seq",editable: false, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "机型类别", field: "pro_type",editable: true, filter: 'set',  width: 200,
		cellEditor:"下拉框",
        cellEditorParams: {
            values:[{desc:'English',value:1}, {desc:'Spanish',value:2}, {desc:'French',value:3}, {desc:'LLL',value:4}]
        },
        enableRowGroup: true,
        enablePivot: true,       
	},
	{
        headerName: "分体机编码", field: "item_code",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "分体机名称", field: "item_name",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "市场贸易型号", field: "sale_scspec",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}  
]
    
    $scope.aoptions = {
    rowGroupPanelShow: 'always',
    pivotPanelShow: 'always',
    groupKeys: undefined, 
    groupHideGroupColumns: true,
    enableColResize: true, 
    enableSorting: true, 
    enableFilter: true, 
    enableStatusBar: true,
    enableRangeSelection: true,
    rowSelection: "multiple",
    rowDeselection: true,
    quickFilterText: null,
    groupSelectsChildren: true, 
    suppressRowClickSelection: true,
    groupColumnDef: groupColumn,
    showToolPanel: true,
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
        headerName: "序号", field: "seq",editable: false, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "分类", field: "part_class",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "数量", field: "seq",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "配件编码", field: "item_code",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}
];
    
    var _stateName = $rootScope.$state.$current.name;
    var data = localeStorageService.get(_stateName);
    if (data == undefined) {
        var temp = localeStorageService.getHistoryItem($rootScope.$state.$current.name);
        if (temp) {//历史纪录
            $scope.data.currItem = temp;
        } else {
        }

    } else {
        if (!$scope.data.currItem) {
            $scope.data.currItem = {};
        }
        $scope.data.currItem = data;
        $scope.refresh(2);
    }


}

//加载控制器
basemanControllers
    .controller('ProItemHeaderDetail', ProItemHeaderDetail);
