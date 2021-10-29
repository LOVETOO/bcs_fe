var salemanControllers = angular.module('inspinia');
function inv_move_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    inv_move_headerEdit = HczyCommon.extend(inv_move_headerEdit, ctrl_bill_public);
    inv_move_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "inv_move_header",
        key: "move_id",
        wftempid:11018,
        FrmInfo: {},
        grids: [{optionname: 'options_3', idname: 'inv_move_lineofinv_move_headers'}]
    };

	var bill_type = $scope.$state.params.bill_type;
	$scope.beforClearInfo = function () {
		var move_types = [];
		if (Number(bill_type || 0)==1) {
			$scope.headername = "移库申请";
            $scope.objconf.FrmInfo={sqlBlock:"1=1 and nvl(bill_type,0) = 1"};
			move_types = [{id: 1, name: "同库位移库"},{id: 2, name: "库位间移库"}];
		} else if (Number(bill_type || 0)==2) {
			$scope.headername = "借用申请";
            $scope.objconf.FrmInfo={sqlBlock:"1=1 and nvl(bill_type,0) = 2"};
			move_types = [{id: 3, name: "借用"},{id: 4, name: "借用归还"}];
		} else if (Number(bill_type || 0)==3) {
			$scope.headername = "工厂返包申请";
            $scope.objconf.FrmInfo={sqlBlock:"1=1 and nvl(bill_type,0) = 3"};
			move_types = [{id: 5, name: "工厂返包"}];
		} else if (Number(bill_type || 0)==4) {
			$scope.headername = "报损申请";
            $scope.objconf.FrmInfo={sqlBlock:"1=1 and nvl(bill_type,0) = 4"};
			move_types = [{id: 6, name: "报损"},{id: 7, name: "招标"}];
		}

		$scope.move_types = move_types;
	};
	
	$scope.beforClearInfo();

    /************************系统词汇**************************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        var stats = [];
        for (var i = 0; i < data.dicts.length; i++) {
            object = {};
            object.id = data.dicts[i].dictvalue;
            object.name = data.dicts[i].dictname;
            stats.push(object);
        }
        $scope.stats = stats;
    })
    //移库类型

    /***************************弹出框***********************/
    $scope.selectorg = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        $scope.FrmInfo = {

            classid: "scporg",
            postdata:{},
            sqlBlock: "stat =2 and OrgType = 5",
            backdatas: "orgs",

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_id = result.orgid;
        });
	};

	//调入仓库 s_wh_code、wh_code
    $scope.warehouse = function () {
        if($scope.data.currItem.stat!=1){
            return;
        }
		if($scope.readonly_11){
			return;	
		}
        $scope.FrmInfo = {
            classid: "po_warehouse",
            postdata:{},
            sqlBlock: "",
            backdatas: "po_warehouses",

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.wh_id = result.wh_id;
            $scope.data.currItem.wh_code = result.wh_code;
            $scope.data.currItem.wh_name = result.wh_name;
        });
	};
	//调出仓库库
    $scope.warehouse2 = function () {
        if($scope.data.currItem.stat!=1){
            return;
        }
        $scope.FrmInfo = {
            classid: "po_warehouse",
            postdata:{},
            sqlBlock: "",
            backdatas: "po_warehouses",

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			if (Number($scope.data.currItem.s_wh_id || 0) != Number(result.wh_id || 0)) {
				$scope.options_3.api.setRowData([]);
			}

            $scope.data.currItem.s_wh_id = result.wh_id;
            $scope.data.currItem.s_wh_code = result.wh_code;
            $scope.data.currItem.s_wh_name = result.wh_name;
        });
		
	};
	//移库类型变更
	$scope.type_change =function(){ 
		//移库类型为借用、借用归还：部门必须填写
		if($scope.data.currItem.move_type==2 || $scope.data.currItem.move_type==3){
			$('#org_code')[0].attributes['data-rule-required'].value="true";
            $('#org_code')[0].attributes['data-msg-required'].value="部门不能空";

		}else{
			$('#org_code')[0].attributes['data-rule-required'].value="false";
            $('#org_code')[0].attributes['data-msg-required'].value="";
		}
		///
		//公司处理、报损：默认的移入仓库为：1802库位，不允许修改
		if($scope.data.currItem.move_type==5 || $scope.data.currItem.move_type==6){ 
			$('#wh_code')[0].attributes['ng-readonly'].value="true";
			$scope.readonly_11 = true;

			var postdata = {};
			postdata.sqlwhere=" wh_code='1101'";
			BasemanService.RequestPost("po_warehouse", "search", postdata)
				.then(function (data) {
					$scope.data.currItem.wh_id = data.po_warehouses[0].wh_id;
					$scope.data.currItem.wh_code = data.po_warehouses[0].wh_code;
					$scope.data.currItem.wh_name = data.po_warehouses[0].wh_name;
				});			
		}else if($scope.data.currItem.move_type==4){ 
			$('#wh_code')[0].attributes['ng-readonly'].value="true";
			$scope.readonly_11 = true;

			var postdata = {};
			postdata.sqlwhere=" wh_code='1101'";
			BasemanService.RequestPost("po_warehouse", "search", postdata)
				.then(function (data) {
					$scope.data.currItem.wh_id = data.po_warehouses[0].wh_id;
					$scope.data.currItem.wh_code = data.po_warehouses[0].wh_code;
					$scope.data.currItem.wh_name = data.po_warehouses[0].wh_name;
				});			
		}else{
			$('#wh_code')[0].attributes['ng-readonly'].value="false";
			$scope.readonly_11 = false;
		}

	};

    /***********************网格处理事件***************************/
	
	//增加行 addpo
    $scope.addpo = function () {
		var msg = []
		if ($scope.data.currItem.s_wh_code == undefined) {
			msg.push("调出仓库不能为空!")
		}
		if (msg.length > 0) {
			BasemanService.notice(msg);
			return;
		}

        $scope.FrmInfo = {
        title: "库存查询",
            thead: [{
                name: "仓库编码", code: "wh_code",
                show: true, iscond: true, type: 'string'
            },{
                name: "仓库名称", code: "wh_name",
                show: true, iscond: true, type: 'string'
            }, {
                name: "商检批次", code: "iv_vbeln",
                show: true, iscond: true, type: 'string'
            }, {
                name: "订单行号", code: "seq",
                show: true, iscond: true, type: 'string'
            }, {
                name: "ERP物料编码", code: "item_no",
                show: true, iscond: true, type: 'string'
            }, {
                name: "物料名称", code: "item_name",
                show: true, iscond: true, type: 'string'
            }, {
                name: "库存数量", code: "qty",
                show: true, iscond: true, type: 'string'
            }],
            classid: "oms_inventory", 
			type: "checkbox",
            postdata: {},
            sqlBlock: " upper(wh_code) like '%"+$scope.data.currItem.s_wh_code+"%'",
            searchlist: ["wh_code", "wh_name", "iv_vbeln", "item_no", "item_name"], 
        };

		BasemanService.open(CommonPopController, $scope, "", "lg")
			.result.then(function (items) {
			if (items.length > 0) {
				var data = $scope.gridGetData("options_3");
				var boo = false;
				for (var i = 0; i < items.length; i++) {
					for (var j = 0; j < data.length; j++) {//判断是否已经存在
						if (parseInt(items[i].wh_id) == parseInt(data[j].wh_id)
							&& parseInt(items[i].iv_vbeln) == parseInt(data[j].iv_vbeln)
							&& parseInt(items[i].line_id) == parseInt(data[j].line_id)
							&& items[i].item_no == data[j].item_no ) {
							boo = true;
							break;
						}
					}
					if (boo) {
						continue;
					}
					items[i].seq = $scope.getmax(data,"seq")+1;
					data.push(items[i]);
				}
				$scope.gridSetData('options_3', data);
			}
		});
    };	

	//删除行
	 $scope.delpo =function(){
		var data = $scope.gridGetData("options_3");
        var rowidx = $scope.options_3.api.getFocusedCell().rowIndex;
        data.splice(rowidx, 1);
        $scope.options_3.api.setRowData(data);

		$scope.CalTotal();
	 }

	//
	$scope.modifyqty = function () {
		var _this = $(this);
        var val = _this.val();	
        var index = $scope.options_3.api.getFocusedCell().rowIndex;
        var nodes = $scope.options_3.api.getModel().rootNode.childrenAfterSort;
        var item = nodes[index].data;
        //var before=nodes[index].data.modify_qty;
		var qty=nodes[index].data.qty; 

		var modify_qty,total_qty = 0;
		//item.modify_qty = item.modify_qty ? item.modify_qty : 0;

      //  $scope.data.currItem.total_qty=parseInt($scope.data.currItem.total_qty||0)+item.modify_qty-parseInt(before || 0);

		val = (Number(val || 0)>=0 &&  Number(val || 0)<=Number(qty || 0)) ? Number(val || 0) : 0;
		item.modify_qty = val;
	    var focusRow = $scope.gridGetRow("options_3");

		focusRow.modify_qty=(Number(val || 0)>=0 &&  Number(val || 0)<=Number(qty || 0)) ? Number(val || 0) : 0;
		$scope.gridUpdateRow("options_3", focusRow);

		var aGrid = $scope.gridGetData("options_3");

		for (var i = 0; i < aGrid.length; i++) {
			if(i!=index){
			modify_qty = parseInt(aGrid[i].modify_qty || 0);
			}else{
			modify_qty=parseInt(val||0);
			}
			total_qty = total_qty + modify_qty;
		}
		$scope.data.currItem.total_qty=total_qty;
		//var data=[]; 
		//data.push($scope.options_3.api.getModel().rootNode.allLeafChildren[0].data)
		//$scope.options_3.api.setRowData(data);
	}

	//计算总出库数量
	$scope.CalTotal = function () {
		var qty=0,total_qty=0;
		var aGrid = $scope.gridGetData("options_3");
		for (var i = 0; i < aGrid.length; i++) {
			qty = Number(aGrid[i].modify_qty || 0);
			total_qty = total_qty + qty;
		}
		$scope.data.currItem.total_qty=total_qty;
	}

    /************************网格定义区域**************************/
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
$scope.columns_3 = [
       {
            headerName: "商检批次", field: "iv_vbeln", editable: false, filter: 'set', width: 80,
            cellEditor: "文本框",
			action:$scope.selectcust,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "订单行号", field: "line_id", editable: false, filter: 'set', width: 90,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "ERP物料编码", field: "item_no", editable: false, filter: 'set', width: 110,
            cellEditor: "文本框",            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "物料名称 ", field: "item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "库存数量", field: "qty", editable: false, filter: 'set', width: 90,
            cellEditor: "整数框",            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "本次出库数量", field: "modify_qty", editable: true, filter: 'set', width: 130,
            cellEditor: "整数框",
            cellchange: $scope.modifyqty,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_3 = {
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
                var isGrouping = $scope.options_3.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
    /****************************初始化**********************/
	var myDate= new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
			bill_type: $scope.$state.params.bill_type,
            creator: window.strUserId,
            stat: 1,			
            create_time:myDate.toLocaleDateString(),
			in_date:myDate.toLocaleDateString(),
            inv_move_lineofinv_move_headers:[]
        };
    };
    $scope.initdata();
}

//加载控制器
salemanControllers
    .controller('inv_move_headerEdit', inv_move_headerEdit);
