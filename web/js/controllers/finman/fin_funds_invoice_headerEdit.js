var billmanControllers = angular.module('inspinia');
function fin_funds_invoice_headerEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    fin_funds_invoice_headerEdit = HczyCommon.extend(fin_funds_invoice_headerEdit, ctrl_bill_public);
    fin_funds_invoice_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_funds_invoice_header",
        key: "allo_id",
        wftempid:10063,
        FrmInfo: {},
        grids: [
			{//金额分配明细
			optionname: 'options_grid', 
			idname: 'fin_funds_invoice_lineoffin_funds_invoice_headers'
			},{//产品部明细
				optionname: 'options_kind', 
				idname: 'fin_funds_invoice_kind_lineoffin_funds_invoice_headers'
			}
        ]
    };

    /************************初始化页面***********************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
			stat: 1,
			version: "1",
			funds_type: 1,
			org_id: $scope.userbean.org_id,
			org_code: $scope.userbean.org_code,
            org_name: $scope.userbean.org_name,
			idpath: $scope.userbean.idpath,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			creator: window.userbean.userid,
			fin_funds_invoice_lineoffin_funds_invoice_headers: [],
			fin_funds_invoice_kind_lineoffin_funds_invoice_headers: []
        };
    };
    /**---------------------初始化页面----------------------*/
    /***********************保存校验区域*********************/
    $scope.validate = function () {

		//CalTotalAmt
		var boo = true,Allot_Amt = 0;
		var errorlist = [];	
		var aGrid=$scope.options_grid.api.getModel().rootNode.childrenAfterSort;

		if(aGrid.length==0){
			BasemanService.notice("金额分配明细为空!","alert-warning");
			return;
		}

		$scope.CalTotalAmt();
	//Math.round toFixed(4)
		for(var i=0;i<aGrid.length;i++){ 
			if (parseFloat(aGrid[i].data.invoice_check_amt || 0) != 0){
				boo=false;
			}

			if (parseFloat(aGrid[i].data.tt_amt || 0) + 0.000001 <
				parseFloat(aGrid[i].data.invoice_check_amt || 0) + parseFloat(aGrid[i].data.tt_check_amt || 0)) {
					errorlist.push("第"+(i+1)+"行本次核销金额"+(aGrid[i].data.invoice_check_amt || 0)
						+"大于待核销总额"+(aGrid[i].data.tt_amt || 0)
						+"减已核销金额"+(aGrid[i].data.tt_check_amt || 0));
			}
		}
		
		if (boo) {
			errorlist.push("资金分配明细中本次分配金额全部为0，不能进行保存操作!");
		} else {
			for(var i=0;i<aGrid.length;i++){
				Allot_Amt = Allot_Amt+parseFloat(aGrid[i].data.invoice_check_amt || 0);
			}
			if (parseFloat(Allot_Amt || 0)>parseFloat($scope.data.currItem.total_allo_amt || 0)) {
				errorlist.push("待核销明细中本次分配金额之和"+Allot_Amt+"大于此次分配总额"
				+($scope.data.currItem.total_allo_amt || 0));
			}
		}
		
		if (parseFloat($scope.data.currItem.total_allo_amt || 0) > parseFloat($scope.data.currItem.canuse_amt || 0)) {
			errorlist.push("此次分配总额" + ($scope.data.currItem.total_allo_amt || 0) + "大于可分配金额"
			+($scope.data.currItem.canuse_amt || 0)+"!");		
		}
        if (errorlist.length) {
            BasemanService.notice(errorlist);
            return false;
        }
        return true;
    }
	/***********************权限控制*********************/

	if (window.userbean) {
        $scope.userbean = window.userbean;
    }
    //用户权限
    $scope.user_auth = {
        //知否有区域总监权限
        area_auth: false
    };
    //业务员,区总,系总,财务,事总权限
    var mystring = $scope.userbean.stringofrole;
    $scope.user_auth.saleman_auth = mystring.indexOf("销售人员") > -1 ? true : false;
    $scope.user_auth.areamanager_auth = mystring.indexOf("大区总监") > -1 ? true : false;
    $scope.user_auth.system_auth = mystring.indexOf("外总") > -1 ? true : false;
    $scope.user_auth.departmen_auth = mystring.indexOf("事总") > -1 ? true : false;
    $scope.user_auth.infance_auth = mystring.indexOf("财务部") > -1 ? true : false;
    $scope.user_auth.admin_auth = mystring.indexOf("admin") > -1 ? true : false;
    /**---------------------权限控制-------------------*/
	

    /******************  页面隐藏****************************/
    $scope.show_grid = false;
    $scope.showGrid = function () {
        $scope.show_grid = !$scope.show_grid;
    };
    $scope.show_kind = false;
    $scope.showKind = function () {
        $scope.show_kind = !$scope.show_kind;
    };
    /**----------------页面隐藏------------------------*/
 
    /**********************下拉框值查询（系统词汇）***************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stats = data.dicts;
    })
	//到款类型 funds_type
	$scope.funds_types=[{id:1,name:"TT"},{id:2,name:"LC"}]
	//回款组织
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "return_ent_type"}).then(function (data) {
        $scope.return_ent_types = data.dicts;
    });
    //贸易类型 trade_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        $scope.trade_types = data.dicts;
    })		
	//dgKind.item_kind 产品部
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "item_kind"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
			//产品部明细
			$scope.columns_kind[0].cellEditorParams.values.push(newobj);
        }
    })	
	//dgGrid.fee_type 费用项目
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "inv_fee_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
			//产品部明细
			$scope.columns_grid[0].cellEditorParams.values.push(newobj);
        }
    })	 
    /**********************下拉框值查询（系统词汇）***************/
    /**********************弹出框值查询**************************/
	//fnFundsNoClick 到款单号
    $scope.fnFundsNoClick = function () {
        $scope.FrmInfo = {
        title: "到款单号查询",	
            thead: [{
                name: "到款单号", code: "funds_no",
                show: true, iscond: true, type: 'string'
            },{
                name: "资金系统单号", code: "other_no",
                show: true, iscond: true, type: 'string'
            }, {
                name: "实际到款(含扣费)", code: "fact_amt",
                show: true, iscond: true, type: 'string'
            }, {
                name: "已分配金额", code: "allocated_amt",
                show: true, iscond: true, type: 'string'
            }, {
                name: "确认时间", code: "confirm_date",
                show: true, iscond: true, type: 'string'
            }, {
                name: "确认人", code: "confirm_man",
                show: true, iscond: true, type: 'string'
            }, {
                name: "业务部门", code: "org_name",
                show: true, iscond: true, type: 'string'
            }, {
                name: "客户名称", code: "cust_name",
                show: true, iscond: true, type: 'string'
            }, {
                name: "备注", code: "note",
                show: true, iscond: true, type: 'string'
            }],
            classid: "fin_funds_header",
            postdata: {},
            sqlBlock: " Fin_Funds_Header.Allocated_Amt < Fin_Funds_Header.Fact_Amt and stat =5 "
			+ " and nvl(Fin_Funds_Header.lc_cash_type,0) <> 1"
			+ " and nvl(Fin_Funds_Header.tt_type,0) not in  (3,6,7)",
            searchlist: ["funds_no", "other_no", "fact_amt", "allocated_amt","confirm_date","confirm_man","org_name","cust_name","note"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
       //     result = HczyCommon.stringPropToNum(result)
            for (name in result) {
                $scope.data.currItem[name] = result[name];
            }
			$scope.data.currItem.creator = "";
			$scope.data.currItem.create_time = "";
            $scope.data.currItem.stat = 1;
            $scope.data.currItem.wfid = 0;
            $scope.data.currItem.wfflag = 0;
			$scope.data.currItem.version = 1; //默认1
			$scope.data.currItem.total_amt = result.fact_amt;
			$scope.data.currItem.canuse_amt = parseFloat($scope.data.currItem.total_amt||0)-parseFloat(result.allocated_amt||0);
            $scope.data.currItem.funds_type = parseInt(result.funds_type);
            var postdata = {
                funds_id: $scope.data.currItem.funds_id
            };
            BasemanService.RequestPost("fin_funds_header", "select", postdata)
                .then(function (data) {
                    $scope.data.currItem.trade_type=1;
                    $scope.data.currItem.funds_type=Number(data.funds_type);
                    $scope.data.currItem.return_ent_type=Number(data.return_ent_type)
                    $scope.data.currItem.fin_funds_invoice_kind_lineoffin_funds_invoice_headers = data.fin_funds_kind_lineoffin_funds_headers;
                    $scope.options_kind.api.setRowData($scope.data.currItem.fin_funds_invoice_kind_lineoffin_funds_invoice_headers);
                })
        });
	};
    //客户
    $scope.fnCustCodeClick = function () {
        $scope.FrmInfo = {
        title: "客户查询",
            thead: [{
                name: "客户编码", code: "cust_code",
                show: true, iscond: true, type: 'string'
            },{
                name: "SAP编码", code: "sap_code",
                show: true, iscond: true, type: 'string'
            }, {
                name: "客户名称", code: "cust_name",
                show: true, iscond: true, type: 'string'
            }, {
                name: "客户描述", code: "cust_desc",
                show: true, iscond: true, type: 'string'
            }],
            classid: "customer",
            postdata: {flag : 1},
            sqlBlock: "",
            searchlist: ["cust_code", "sap_code", "cust_name", "cust_desc"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;
        });
    };	
    //部门
    $scope.selectorg = function () {
        $scope.FrmInfo = {
            title: "部门查询",
            thead: [{
                name: "部门编码",
                code: "code"
            }, {
                name: "部门名称",
                code: "orgname"
            }],
            classid: "scporg",
            backdatas: "orgs",
            sqlBlock: "stat =2 and orgtype = 5",
            searchlist: ["code", "orgname"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = parseInt(result.orgid);
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.idpath = result.idpath
        });
    };
    //增加明细 fnAddItemClick
    $scope.fnAddItemClick = function () {
		var msg = []
		if ($scope.data.currItem.cust_code == undefined) {
			msg.push("客户为空!")
		}
		if ($scope.data.currItem.org_code == undefined) {
			msg.push("机构为空!")
		}
		if ($scope.data.currItem.funds_type == undefined) {
			msg.push("到款类型为空!")
		}
        if ($scope.data.currItem.Funds_Type == 2 && $scope.data.currItem.lc_no == "") {
		    msg.push("到款类型为LC，请选择信用证!")
        }	
		if (msg.length > 0) {
			BasemanService.notice(msg);
			return;
		}

        $scope.FrmInfo = {
        title: "商业发票查询",
            thead: [{
                name: "商业发票号", code: "invoice_no",
                show: true, iscond: true, type: 'string'
            },{
                name: "实际发票号", code: "fact_invoice_no",
                show: true, iscond: true, type: 'string'
            }, {
                name: "形式发票号", code: "pi_no",
                show: true, iscond: true, type: 'string'
            }, {
                name: "费用项目", code: "fee_type",
                show: true, iscond: true, type: 'string'
            }, {
                name: "工厂型号", code: "item_name",
                show: true, iscond: true, type: 'string'
            }, {
                name: "开票金额", code: "tt_amt",
                show: true, iscond: true, type: 'string'
            }],
            classid: "bill_invoice_header",
			is_custom_search: true,
			type: "checkbox",
            postdata: {flag : 6},
            sqlBlock: " h.stat <> 53 and h.cust_id="+$scope.data.currItem.cust_id
				+" and h.org_id = "+$scope.data.currItem.org_id
				+" and h.currency_id="+$scope.data.currItem.currency_id,
            searchlist: ["invoice_no", "fact_invoice_no", "pi_no", "fee_type", "item_name", "tt_amt"], 
        };
        if (parseInt($scope.data.currItem.funds_type) == 2) {
            $scope.FrmInfo.sqlBlock += " and l.fee_type = 17 and h.lc_no='" + $scope.data.currItem.lc_no + "'";
        } else {
			$scope.FrmInfo.sqlBlock += " and l.fee_type <>17";
		}

		BasemanService.open(CommonPopController, $scope, "", "lg")
			.result.then(function (items) {
			if (items.length > 0) {
				var data = $scope.gridGetData("options_grid");
				var boo = false;
				for (var i = 0; i < items.length; i++) {
					for (var j = 0; j < data.length; j++) {//判断是否已经存在
						if (items[i].invoice_no == data[j].invoice_no 
                           && parseInt(items[i].fee_type) == parseInt(data[j].fee_type)) {
							boo = true;
							break
						}
					}
					if (boo) {
						continue
					}
					data.push(items[i]);
				}
				$scope.gridSetData('options_grid', data);
			}
		});
    };	
    //删除明细 fnDelItemClick
    $scope.fnDelItemClick = function () {
        var data = [];
        var rowidx = $scope.options_grid.api.getFocusedCell().rowIndex;
        var node = $scope.options_grid.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_grid.api.setRowData(data);

		$scope.CalTotalAmt();
    }
    /**--------------------弹出框值查询-------------------------------*/
    /**********************业务逻辑控制*******************************/
	//CalTotalAmt
	$scope.CalTotalAmt = function () {
		var allo_amt=0,total_allo_amt=0;
		var aGrid = $scope.gridGetData("options_grid");
		for (var i = 0; i < aGrid.length; i++) {
			allo_amt = parseFloat(aGrid[i].invoice_check_amt || 0);
			total_allo_amt = total_allo_amt + allo_amt;
		}
		$scope.data.currItem.total_allo_amt=total_allo_amt;
		$scope.options_kind.api.getModel().rootNode.childrenAfterSort[0].allo_amt = total_allo_amt;
	}
	//GridCellChange
    $scope.GridCellChange = function () {
		var _this = $(this);
        var val = _this.val(); 
	    var index = $scope.options_grid.api.getFocusedCell().rowIndex;

		var allo_amt=0,total_allo_amt=0;
		var aGrid = $scope.gridGetData("options_grid");
		for (var i = 0; i < aGrid.length; i++) {
			if(i!=index){
			allo_amt = parseFloat(aGrid[i].invoice_check_amt || 0);
			}else{
			allo_amt=parseFloat(val||0);
			}
			total_allo_amt = total_allo_amt + allo_amt;
		}
		$scope.data.currItem.total_allo_amt=total_allo_amt;
		var data=[];
		$scope.options_kind.api.getModel().rootNode.allLeafChildren[0].data.allo_amt = total_allo_amt;
		data.push($scope.options_kind.api.getModel().rootNode.allLeafChildren[0].data)
		$scope.options_kind.api.setRowData(data);
    };

    /**------------------ 业务逻辑控制--------------------------------**/
	$scope.save_before =function(){
		$scope.CalTotalAmt();
	//options_grid
		for(var i=0;i<$scope.data.currItem.fin_funds_invoice_lineoffin_funds_invoice_headers.length;i++){
			$scope.data.currItem.fin_funds_invoice_lineoffin_funds_invoice_headers[i].seq=parseInt(i+1);
		}
	//options_kind
		for(var i=0;i<$scope.data.currItem.fin_funds_invoice_kind_lineoffin_funds_invoice_headers.length;i++){
			$scope.data.currItem.fin_funds_invoice_kind_lineoffin_funds_invoice_headers[i].seq=parseInt(i+1);
		}
	}
    /**************************网格定义******************************/
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

	//金额分配明细
    $scope.options_grid = {
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
        rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_grid.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_grid = [
		{
            headerName: "费用项目", field: "fee_type", editable: false, filter: 'set', width: 120,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "形式发票号", field: "pi_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "商业发票号", field: "invoice_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true  
        },{
            headerName: "实际发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true  
        },{
            headerName: "此次核销金额", field: "invoice_check_amt", editable: true, filter: 'set', width: 200,
            cellEditor: "浮点框",
			cellchange: $scope.GridCellChange,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "待核销金额", field: "tt_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "已核销金额", field: "tt_check_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //费用明细
    $scope.options_kind = {
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
        rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_kind.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_kind = [		
		{
            headerName: "产品部", field: "item_kind", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "到款总额", field: "fact_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "已分配金额", field: "allocated_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "可分配金额", field: "canuse_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "本次分配金额", field: "allo_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    /**----------------网格区域-----------------------------**/
    /*******************************导出excel**********/
 

    /**--------------------网格定义--------------------------*/
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('fin_funds_invoice_headerEdit', fin_funds_invoice_headerEdit)
