var finmanControllers = angular.module('inspinia');
function sale_list_kehuinforlt($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_list_kehuinforlt = HczyCommon.extend(sale_list_kehuinforlt, ctrl_bill_public);
    sale_list_kehuinforlt.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_amount_search",
   /*     key: "funds_id",*/
        wftempid: 10008,
        FrmInfo: {
            sqlBlock: "funds_type=2",
        },
        grids: [{optionname: 'options_11', idname: 'fin_amount_searchs'}/*, {
            optionname: 'options_12',
            idname: 'fin_funds_kind_lineoffin_funds_headers'
        }, {optionname: 'options_13', idname: 'fin_funds_xypmoffin_funds_headers'}, {
            optionname: 'options_14',
            idname: 'fin_funds_sapoffin_funds_headers'
        }*/]
    };
    
    //下拉
     $scope.search_styles = [{
        	id:1,
        	name:"预测录入",
        },{
        	id:2,
        	name:"预测发放",
        }]
     BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stat = data.dicts;
    })
    
    /*查询*/
   $scope.search = function () {
	   if($scope.data.currItem.end_date=="" || $scope.data.currItem.end_date==undefined){
		    BasemanService.notice("截止日期不能为空", "alert-warning");
            return;
	   } 
	   if($scope.data.currItem.end_date< $scope.data.currItem.start_date && $scope.data.currItem.end_date!="" && $scope.data.currItem.end_date!=undefined){
		    BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
	   }
	sqlBlock="";
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:1,
            sqlwhere  : sqlBlock,
         
            org_id: $scope.data.currItem.org_id,
			cust_id: $scope.data.currItem.cust_id,
			cust_name: $scope.data.currItem.cust_name,
		   
			start_date: $scope.data.currItem.start_date,
			
			end_date: $scope.data.currItem.end_date
        };
 BasemanService.RequestPost("fin_amount_search", "search", postdata)
        .then(function(data){
            $scope.data.currItem.fin_amount_searchs=data.fin_amount_searchs;
             $scope.options_11.api.setRowData(data.fin_amount_searchs);
        });
}
   
   $scope.selectcode = function () {

		 $scope.FrmInfo = {
			classid: "scporg",
			postdata:{},
            backdatas:"orgs",
            sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			 $scope.data.currItem.org_code = result.code;
			 $scope.data.currItem.org_name = result.orgname;
			 $scope.data.currItem.org_id = result.orgid;
			 /*$scope.data.currItem.cust_id = result.cust_id;*/
        });

    }
	//业务部门
    $scope.changeAreaName = function () {

        $scope.data.currItem.org_name = "";
        $scope.data.currItem.org_id = "";
    };
    //客户
    $scope.change_customer = function () {
      
        $scope.data.currItem.cust_name = "";
        $scope.data.currItem.cust_id = "";
		$scope.data.currItem.cust_codea = "";
    };
	 $scope.selectcodedq = function () {

		 $scope.FrmInfo = {
			classid: "scporg",
			postdata:{},
            backdatas:"orgs"
            /*sqlBlock: "org_id = " + $scope.data.currItem.org_id*/
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			 $scope.data.currItem.org_codedq = result.code;
			 $scope.data.currItem.org_namedq = result.orgname;
			 /*$scope.data.currItem.cust_id = result.cust_id;*/
        });

    }
   
   
   $scope.selectcust = function () {
	    var fag="";
	  if($scope.data.currItem.org_id!="" && $scope.data.currItem.org_id!=undefined){
		  fag="org_id = " + $scope.data.currItem.org_id;
	  }

			$scope.FrmInfo = {
			classid: "customer",
			postdata:{},
            backdatas:"customers",
            sqlBlock: fag
        };
		 
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			 $scope.data.currItem.cust_code = result.cust_code;
			 $scope.data.currItem.cust_name = result.cust_name;
			 $scope.data.currItem.cust_id = result.cust_id;
        });

    }
    /**********************隐藏、显示*************************/
	//汇总
    $scope.clickchange3=function(){
        if ($scope.data.currItem.check3 != true) {
            $scope.options_12.columnApi.setColumnsVisible(["org_name"]);
        }else{
            $scope.options_12.columnApi.hideColumns(["org_name"])
			$scope.options_12.columnApi.setColumnsVisible(["funds_date"]);
            $scope.options_12.columnApi.setColumnsVisible(["org_code"]);
			$scope.options_12.columnApi.setColumnsVisible(["pay_type"]);
			$scope.options_12.columnApi.setColumnsVisible(["item_kind"]);
			$scope.options_12.columnApi.setColumnsVisible(["actual_ship_date"]);
			$scope.options_12.columnApi.setColumnsVisible(["erp_so_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
            if($scope.data.currItem.check4 != true)
            $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
			}
    };
    $scope.clickchange4=function(){
        if ($scope.data.currItem.check4 != true) {
            $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
        }else{
            $scope.options_12.columnApi.hideColumns(["cust_name"])
			$scope.options_12.columnApi.setColumnsVisible(["funds_date"]);
			$scope.options_12.columnApi.setColumnsVisible(["pay_type"]);
			$scope.options_12.columnApi.setColumnsVisible(["item_kind"]);
			$scope.options_12.columnApi.setColumnsVisible(["actual_ship_date"]);
			$scope.options_12.columnApi.setColumnsVisible(["erp_so_no"]);
            if($scope.data.currItem.check3 != true) {
                $scope.options_12.columnApi.setColumnsVisible(["org_name"]);
            }
			$scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
			}
    };

	    //汇总保留2位
    $scope.sum_retain = function () {
        var nodes=$scope.options_12.api.getModel().rootNode.childrenAfterSort;
        var data = $scope.gridGetData("options_12");
        for(var i=0;i<$scope.columns_12.length;i++){
            for (var j = 0; j < data.length; j++) {
                if($scope.columns_12[i].field=="zz_year"){
                    if(data[j].zz_year!= undefined){
                        data[j].zz_year=parseFloat( data[j].zz_year||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="new_qty"){
                    if(data[j].new_qty!= undefined){
                        data[j].new_qty=parseFloat(data[j].new_qty||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="redo_qty"){
                    if(data[j].redo_qty!= undefined){
                        data[j].redo_qty=parseFloat( data[j].redo_qty||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="s1"){
                    if(data[j].s1!= undefined){
                        data[j].s1=parseFloat(data[j].s1||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="s3"){
                    if(data[j].s3!= undefined){
                        data[j].s3=parseFloat( data[j].s3||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="s8"){
                    if(data[j].s8!= undefined){
                        data[j].s8=parseFloat(data[j].s8||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="s6"){
                    if(data[j].s6!= undefined){
                        data[j].s6=parseFloat( data[j].s6||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="s11"){
                    if(data[j].s11!= undefined){
                        data[j].s11=parseFloat(data[j].s11||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="gl_qty"){
                    if(data[j].gl_qty!= undefined){
                        data[j].gl_qty=parseFloat( data[j].gl_qty||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="last_t_qty"){
                    if(data[j].last_t_qty!= undefined){
                        data[j].last_t_qty=parseFloat(data[j].last_t_qty||0).toFixed(2);
                    }
                }
            }

        }
        $scope.options_12.api.refreshCells(nodes, ["zz_year","last_t_qty","gl_qty","s11","s6","s8","s3","s1","redo_qty","new_qty","prod_amt"]);
    };
	 //汇总列
    $scope.groupby = function (arr,column,datas) {
        if (  $scope.data.currItem.check2 == false && $scope.data.currItem.check3 == false
            && $scope.data.currItem.check4 == false && $scope.data.currItem.check5 == false) {
            BasemanService.notice("请选择条件再汇总!", "alert-warning");
            return;
        }
        $scope.sumcontainer = [];
        var arr = [], column = [];
        var sortmodel=[];
        var data = $scope.gridGetData("options_11");
     
        if ($scope.data.currItem.check2 == true) {
            arr.push("porg_name");
            $scope.options_12.columnApi.hideColumns(["porg_name"])
            sortmodel.push({colId:"porg_name",sort:"desc"})
        }
        if ($scope.data.currItem.check3 == true) {
            arr.push("org_name");
            $scope.options_12.columnApi.hideColumns(["org_name"])
            sortmodel.push({colId:"org_name",sort:"desc"})
        }
        if ($scope.data.currItem.check4 == true) {
            arr.push("cust_code");
            $scope.options_12.columnApi.hideColumns(["cust_code"])
            sortmodel.push({colId:"cust_code",sort:"desc"})
        }
     
        column[0] = "send_amt";            
        column[1] = "temp_amt";
        column[2] = "price";
        column[3] = "act_far_qty";
        column[4] = "far_qty";
        column[5] = "act_far_qty";
        column[6] = "zz_month";
        column[7] = "s8";
        column[8] = "last_qty";
        column[9] = "dc_month";
        column[10] = "qty";
        column[11] = "gl_qty";
        var sumcontainer = HczyCommon.Summary(arr,column,data);

        //汇总最后一行
        var total = {};
        for (var j = 0; j < column.length; j++) {
            var arr = column[j];
            total[arr] = 0;
        }
        for (var i = 0; i < sumcontainer.length; i++) {
            for (var j = 0; j < column.length; j++) {
                var arr = column[j];
                if (sumcontainer[i][arr] != undefined) {
                    total[arr] += parseFloat(sumcontainer[i][arr]);
                }
            }
        }
        for (var j = 0; j < column.length; j++) {
            var arr = column[j];
            total[arr] = parseFloat(total[arr]).toFixed(2);
        }
        total.other_no = "合计";
        sumcontainer.push(total);
        $scope.options_12.api.setRowData(sumcontainer);
        $scope.options_12.api.setSortModel(sortmodel)

        $scope.sum_retain();
    };
    $scope.show_11 = false;
    $scope.show11 = function () {
        $scope.show_11 = !$scope.show_11;
    };
    $scope.show_12 = false;
    $scope.show12 = function () {
        $scope.show_12 = !$scope.show_12;
    };
    $scope.show_13 = false;
    $scope.show13 = function () {
        $scope.show_13 = !$scope.show_13;
    };
    //隐藏区域
    $scope.show_11 = false;
    $scope.show_sap = function () {
        $scope.show_11 = !$scope.show_11;
    };
   
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
    //单据明细
    $scope.columns_11 = [
        {
            headerName: "业务部门编码", field: "org_code", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
/*            cellEditorParams: {
                values: [{value: "1", desc: "空调组织"}]
            },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "业务部门", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "客户", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "单号", field: "other_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "ERP销售订单号", field: "erp_so_no", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "实际出货日期", field: "actual_ship_date", editable: false, filter: 'set', width: 180,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "产品部", field: "item_kind", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "付款类型", field: "pay_type", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "日期", field: "funds_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "工厂型号编码", field: "item_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "ERP编码", field: "erp_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "数量", field: "qty", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "价格", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "回款金额", field: "temp_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "发货金额", field: "send_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
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
    //产品部信息
    $scope.columns_12 = [
        {
            headerName: "业务部门编码", field: "org_code", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
/*            cellEditorParams: {
                values: [{value: "1", desc: "空调组织"}]
            },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "业务部门", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "客户", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "单号", field: "other_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "ERP销售订单号", field: "erp_so_no", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "实际出货日期", field: "actual_ship_date", editable: false, filter: 'set', width: 180,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "产品部", field: "item_kind", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "付款类型", field: "pay_type", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "日期", field: "funds_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "工厂型号编码", field: "item_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "ERP编码", field: "erp_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "数量", field: "qty", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "价格", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "回款金额", field: "temp_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "发货金额", field: "send_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
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
        }
    };
   
    $scope.initdata();
}

//加载控制器
finmanControllers
    .controller('sale_list_kehuinforlt', sale_list_kehuinforlt);
