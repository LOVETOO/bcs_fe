var finmanControllers = angular.module('inspinia');
function sale_list_prodinforsya($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_list_prodinforsya = HczyCommon.extend(sale_list_prodinforsya, ctrl_bill_public);
    sale_list_prodinforsya.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "bill_invoice_header",
   /*     key: "funds_id",*/
        wftempid: 10008,
        FrmInfo: {
            sqlBlock: "funds_type=2",
        },
        grids: [{optionname: 'options_11', idname: 'bill_invoice_headers'}/*, {
            optionname: 'options_12',
            idname: 'fin_funds_kind_lineoffin_funds_headers'
        }, {optionname: 'options_13', idname: 'fin_funds_xypmoffin_funds_headers'}, {
            optionname: 'options_14',
            idname: 'fin_funds_sapoffin_funds_headers'
        }*/]
    };
	 //下拉
     $scope.search_styles = [{
			id:0,
        	name:"全部",
        },{
        	id:1,
        	name:"进出口贸易",
        },{
        	id:2,
        	name:"香港转口贸易",
        },{
        	id:3,
        	name:"香港直营贸易",
        },{
        	id:4,
        	name:"工厂直营",
        }]
    // BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
    //    $scope.sale_ent_types = data.dicts;
 //   })
 
    /*查询*/
   $scope.search = function () {
	sqlBlock=" 1=1 ";
	//BasemanService.getSqlWhereBlock(sqlBlock);
	
	var postdata = { 
			flag:10,
            sqlwhere  : sqlBlock,
              pi_no: $scope.data.currItem.pi_no,
         invoice_no: $scope.data.currItem.invoice_id,
      sales_user_id: $scope.data.currItem.sales_user_id,
		     sap_no: $scope.data.currItem.invoice_on,
			cust_id: $scope.data.currItem.cust_id,		
			org_id: $scope.data.currItem.org_id,
		start_date: $scope.data.currItem.startdate,
		   td_date: $scope.data.currItem.startdatet,
		  end_date: $scope.data.currItem.enddate,
		  sale_ent_type: $scope.data.currItem.search_style
        };
 BasemanService.RequestPost("bill_invoice_header", "search", postdata)
        .then(function(data){
			 $scope.data.currItem.bill_invoice_headers=data.bill_invoice_headers;
			for (var i = 0; i < $scope.data.currItem.bill_invoice_headers.length; i++) {
                             if($scope.data.currItem.bill_invoice_headers[i].sale_ent_type=="1"){
								$scope.data.currItem.bill_invoice_headers[i].sale_ent_type="进出口贸易";
							}
							 if($scope.data.currItem.bill_invoice_headers[i].sale_ent_type=="2"){
								$scope.data.currItem.bill_invoice_headers[i].sale_ent_type="香港转口贸易";
							}
							 if($scope.data.currItem.bill_invoice_headers[i].sale_ent_type=="3"){
								$scope.data.currItem.bill_invoice_headers[i].sale_ent_type="香港直营贸易";
							} 
							 if($scope.data.currItem.bill_invoice_headers[i].sale_ent_type=="4"){
								$scope.data.currItem.bill_invoice_headers[i].sale_ent_type="工厂直营";
							}
							 
            }
           
             $scope.options_11.api.setRowData(data.bill_invoice_headers);
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
    };
	 $scope.change_pelope = function () {
        $scope.data.currItem.sales_user_id = "";
        $scope.data.currItem.psy = "";
       // $scope.data.currItem.cust_id = "";
    };
   $scope.selectcode = function () {

		 $scope.FrmInfo = {
			classid: "scporg",
			postdata:{},
			sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",
            backdatas:"orgs"
            /*sqlBlock: "org_id = " + $scope.data.currItem.org_id*/
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			 $scope.data.currItem.org_code = result.code;
			 $scope.data.currItem.org_name = result.orgname;
			 $scope.data.currItem.org_id = result.orgid;
        });

    }
	
	 $scope.Invoice = function () {
        
        $scope.FrmInfo = {
            classid: "bill_invoice_header",
            postdata: {},
        };
        BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
		
            $scope.data.currItem.fact_invoice_no = result.fact_invoice_no;
            $scope.data.currItem.hth = result.pi_no;
            $scope.data.currItem.invoice_id = result.invoice_no;
        })
    };
   $scope.psy =function(){
		$scope.FrmInfo = {
            classid: "scpuser",
			backdatas:"users"
			/*sqlBlock: "org_id = " + $scope.data.currItem.org_id*/
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			console.log(result);
			$scope.data.currItem.sales_user_id=result.userid;
            $scope.data.currItem.psy = result.userid;
        });
	}
	
   	//PI查询
	$scope.selectpi_no =function(){
		
		$scope.FrmInfo = {
            classid: "sale_pi_header",
			sqlBlock:" "
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
				
            $scope.data.currItem.pi_id=parseInt(result.pi_id);
			$scope.data.currItem.pi_no=result.pi_no;
	})
	};
	$scope.selectcust = function () {
		var  fag="";
		if($scope.data.currItem.org_id!= "" && $scope.data.currItem.org_id!=undefined){
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
	 $scope.clickchange5=function(){
        if ($scope.data.currItem.check5 != true) { 
            $scope.options_12.columnApi.setColumnsVisible(["item_name"])
        }else{
			$scope.options_12.columnApi.hideColumns(["item_name"]);
			$scope.options_12.columnApi.setColumnsVisible(["area_name"]);
			$scope.options_12.columnApi.setColumnsVisible(["other_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["pi_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["fact_invoice_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["delorder_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["sale_ent_type"]);
			$scope.options_12.columnApi.setColumnsVisible(["notice_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["invoice_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["month"]);
		   // $scope.options_12.columnApi.setColumnsVisible(["item_name"]);
			//$scope.options_12.columnApi.setColumnsVisible(["org_name"]);
			//$scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
			//$scope.options_12.columnApi.setColumnsVisible(["org_code"]);
			if($scope.data.currItem.check4 != true){
                $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
                $scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
            }
            if($scope.data.currItem.check3 != true){
                $scope.options_12.columnApi.setColumnsVisible(["org_name"])
				$scope.options_12.columnApi.setColumnsVisible(["org_code"]);
            }
            if($scope.data.currItem.check6 != true){
                $scope.options_12.columnApi.setColumnsVisible(["item_type_name"]);
            }
		}
    };
	$scope.clickchange6=function(){
        if ($scope.data.currItem.check6 != true) {
            $scope.options_12.columnApi.setColumnsVisible(["item_type_name"])
        }else{
			$scope.options_12.columnApi.hideColumns(["item_type_name"]);
			$scope.options_12.columnApi.setColumnsVisible(["area_name"]);
			$scope.options_12.columnApi.setColumnsVisible(["other_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["pi_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["fact_invoice_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["delorder_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["sale_ent_type"]);
			$scope.options_12.columnApi.setColumnsVisible(["notice_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["invoice_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["month"]);
			//$scope.options_12.columnApi.setColumnsVisible(["item_name"]);
			//$scope.options_12.columnApi.setColumnsVisible(["org_name"]);
			//$scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
			//$scope.options_12.columnApi.setColumnsVisible(["org_code"]);
			if($scope.data.currItem.check4 != true){
                $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
                $scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
            }
            if($scope.data.currItem.check5 != true){
                $scope.options_12.columnApi.setColumnsVisible(["item_name"]);
            }
            if($scope.data.currItem.check3 != true){
                $scope.options_12.columnApi.setColumnsVisible(["org_name"])
				$scope.options_12.columnApi.setColumnsVisible(["org_code"]);
            }
		}
    };
    $scope.clickchange3=function(){
        if ($scope.data.currItem.check3 != true) {
            $scope.options_12.columnApi.setColumnsVisible(["org_name"])
			$scope.options_12.columnApi.setColumnsVisible(["org_code"]);
        }else{
			//$scope.options_12.columnApi.setColumnsVisible(["item_type_name"]);  
			$scope.options_12.columnApi.hideColumns(["org_name"]);
            $scope.options_12.columnApi.hideColumns(["org_code"]);			
			$scope.options_12.columnApi.setColumnsVisible(["area_name"]);
			$scope.options_12.columnApi.setColumnsVisible(["other_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["pi_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["fact_invoice_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["delorder_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["sale_ent_type"]);
			$scope.options_12.columnApi.setColumnsVisible(["notice_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["invoice_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["month"]);
			//$scope.options_12.columnApi.setColumnsVisible(["item_name"]);
			//$scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
			if($scope.data.currItem.check4 != true){
                $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
                $scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
            }
            if($scope.data.currItem.check5 != true){
                $scope.options_12.columnApi.setColumnsVisible(["item_name"]);
            }
            if($scope.data.currItem.check6 != true){
                $scope.options_12.columnApi.setColumnsVisible(["item_type_name"]);
            }
		}
    };
    $scope.clickchange4=function(){
        if ($scope.data.currItem.check4 != true) {
            $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
            $scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
        }else{
			//$scope.options_12.columnApi.setColumnsVisible(["item_type_name"]);        
			$scope.options_12.columnApi.setColumnsVisible(["area_name"]);
			$scope.options_12.columnApi.setColumnsVisible(["other_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["pi_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["fact_invoice_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["delorder_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["sale_ent_type"]);
			$scope.options_12.columnApi.setColumnsVisible(["notice_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["invoice_no"]);
			$scope.options_12.columnApi.setColumnsVisible(["month"]);
			//$scope.options_12.columnApi.setColumnsVisible(["item_name"]);
			$scope.options_12.columnApi.setColumnsVisible(["org_code"]);
			$scope.options_12.columnApi.hideColumns(["cust_name"]);
            $scope.options_12.columnApi.hideColumns(["cust_code"]);
			if($scope.data.currItem.check3 != true){
                $scope.options_12.columnApi.setColumnsVisible(["org_name"])
			$scope.options_12.columnApi.setColumnsVisible(["org_code"]);
            }
            if($scope.data.currItem.check5 != true){
                $scope.options_12.columnApi.setColumnsVisible(["item_name"]);
            }
            if($scope.data.currItem.check6 != true){
                $scope.options_12.columnApi.setColumnsVisible(["item_type_name"]);
            }
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
     
        if ($scope.data.currItem.check6 == true) {
            arr.push("item_name"); 
            $scope.options_12.columnApi.hideColumns(["item_name"])
            sortmodel.push({colId:"item_name",sort:"desc"})
        }
		 if ($scope.data.currItem.check5 == true) {
            arr.push("item_type_name");
            $scope.options_12.columnApi.hideColumns(["item_type_name"])
            sortmodel.push({colId:"item_type_name",sort:"desc"})
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
     
        column[0] = "line_amt";            
        column[1] = "price";
        column[2] = "invoice_qty";
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
        total.year = "合计";
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
            headerName: "年份", field: "year", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
/*            cellEditorParams: {
                values: [{value: "1", desc: "空调组织"}]
            },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "月份", field: "month", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "发票流水号", field: "invoice_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "实际发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "发货通知单号", field: "notice_no", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "贸易类型", field: "sale_ent_type", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "SAP交货单号", field: "delorder_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "SAP开票号", field: "kaipiao_sap", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "合同号", field: "pino_new", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "PI单号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "资金单号", field: "other_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "区域", field: "area_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "业务部门编码", field: "org_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
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
            headerName: "产品大类", field: "item_type_name", editable: false, filter: 'set', width: 100,
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
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "品牌", field: "brand_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "汇率", field: "exchange_rate", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "开票时间", field: "check_time", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "提单日期", field: "td_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "ERP产品编码", field: "erp_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "产品名称", field: "item_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "PI数量", field: "qty", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "开票数量", field: "invoice_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "销售价", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "销售金额", field: "line_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "货币", field: "currency_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "付款方式", field: "payment_type_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "回款期限", field: "days", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "价格条款", field: "price_type_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "已引ERP标志", field: "is_erp_process", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "内外机编码", field: "item_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "批次", field: "inspection_batchno", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "结算价", field: "p6", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "差价", field: "c_price", editable: false, filter: 'set', width: 100,
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
              headerName: "年份", field: "year", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
/*            cellEditorParams: {
                values: [{value: "1", desc: "空调组织"}]
            },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "月份", field: "month", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "商业发票号", field: "invoice_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "发货通知单号", field: "notice_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "贸易类型", field: "sale_ent_type", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "SAP交货单号", field: "delorder_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "实际发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "PI单号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "资金单号", field: "other_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "区域", field: "area_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "业务部门编码", field: "org_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
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
            headerName: "产品大类", field: "item_type_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "产品名称", field: "item_name", editable: false, filter: 'set', width: 100,
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
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "客户所在国家", field: "country_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "客户类型", field: "cust_type", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		},{
            headerName: "品牌", field: "brand_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "汇率", field: "exchange_rate", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "开票时间", field: "check_time", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		},{
            headerName: "提单日期", field: "td_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "ERP产品编码", field: "erp_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "PI数量", field: "qty", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "开票数量", field: "invoice_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		},{
            headerName: "销售价", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "销售金额", field: "line_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		},{
            headerName: "付款方式", field: "payment_type_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "回款期限", field: "days", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		},{
            headerName: "价格条款", field: "price_type_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		},{
            headerName: "已引ERP标志", field: "is_erp_process", editable: false, filter: 'set', width: 100,
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
    .controller('sale_list_prodinforsya', sale_list_prodinforsya);
