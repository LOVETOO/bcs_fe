var finmanControllers = angular.module('inspinia');
function sale_list_prodinfor($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_list_prodinfor = HczyCommon.extend(sale_list_prodinfor, ctrl_bill_public);
    sale_list_prodinfor.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_list",
   /*     key: "funds_id",*/
        wftempid: 10008,
        FrmInfo: {
            sqlBlock: "funds_type=2",
        },
        grids: [{optionname: 'options_11', idname: 'sale_lists'}, {
            optionname: 'options_12',
            idname: 'sale_lists'
        }/*, {optionname: 'options_13', idname: 'fin_funds_xypmoffin_funds_headers'}, {
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
	   var date1=$scope.data.currItem.startdate;
		var date2=$scope.data.currItem.enddate;
		var sqlBlock="";
		if(date1>date2){
		 BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
	}
	var fag=4;
		if($scope.data.currItem.deliver_datec!=""  && $scope.data.currItem.deliver_datec!=undefined){
			fag=1;
          
		}
		if($scope.data.currItem.deliver_dateb!=""  && $scope.data.currItem.deliver_dateb!=undefined){
			fag=2;
            
		}
		if($scope.data.currItem.deliver_date!=""  && $scope.data.currItem.deliver_date!=undefined){
			fag=3;
          
		}
	sqlBlock="";
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:8,
        sqlwhere  : sqlBlock,
		start_date: $scope.data.currItem.startdate,
		end_date: $scope.data.currItem.enddate,
		org_code: $scope.data.currItem.org_code,
		org_id: $scope.data.currItem.org_id,
		cust_code: $scope.data.currItem.cust_code,
		cust_id: $scope.data.currItem.cust_id,
		erp_code: $scope.data.currItem.pi_no,
		time_flag : fag
            
      
        };
 BasemanService.RequestPost("sale_list", "search", postdata)
        .then(function(data){
            $scope.data.currItem.sale_lists=data.sale_lists;
             $scope.options_11.api.setRowData(data.sale_lists);
        });
}
   
   $scope.selectcode = function () {

		$scope.FrmInfo = {
			
            classid: "scporg",
	        postdata:{},
			sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",
            backdatas: "orgs",
           
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			$scope.data.currItem.org_id = result.orgid;
			 $scope.data.currItem.org_code = result.code;   
			 $scope.data.currItem.org_name = result.orgname			
        });

    }
   
   $scope.clear = function () {
         $scope.data.currItem.sale_lists="";
             $scope.options_11.api.setRowData("");
    }
    $scope.cheked2 = function () {
        if ($scope.data.currItem.deliver_dateb) {
            $scope.data.currItem.deliver_datea = false;
			$scope.data.currItem.deliver_date = false;
			$scope.data.currItem.deliver_datec = false;
            $scope.data.currItem.time_flag = 2;
        }
    }
    $scope.cheked = function () {
        if ($scope.data.currItem.deliver_datec) {
            $scope.data.currItem.deliver_date = false;
			$scope.data.currItem.deliver_datea = false;
			$scope.data.currItem.deliver_dateb = false;
            $scope.data.currItem.time_flag = 0;
        } else {
            $scope.data.currItem.time_flag = 0;
        }
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
    $scope.cheked3 = function () {
        if ($scope.data.currItem.deliver_date) {
            $scope.data.currItem.deliver_datea = false;
			$scope.data.currItem.deliver_dateb = false;
			$scope.data.currItem.deliver_datec = false;
            $scope.data.currItem.time_flag = 3;
        } else {
            $scope.data.currItem.time_flag = 3;
        }
    }
   $scope.selectcust = function () {

			if ($scope.data.currItem.org_code == undefined || $scope.data.currItem.org_code == "") {
            BasemanService.notice("请先选业务部门", "alert-warning");
            return;
			}

		 $scope.FrmInfo = {
			title: "客户",
			thead: [
				{
				name: "客户编码",
                code: "cust_code",
				 show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "SAP编码",
                code: "sap_code",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "客户名称",
                code: "cust_name",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "客户描述",
                code: "cust_desc",
				show: true,
                iscond: true,
                type: 'string'
            }],
			is_custom_search:true,
			is_high:true,
            classid: "customer",
            sqlBlock: "org_id = " + $scope.data.currItem.org_id
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			 $scope.data.currItem.cust_code = result.cust_code;
			 $scope.data.currItem.cust_name = result.cust_name;
			 $scope.data.currItem.cust_id = result.cust_id;
        });

    }
	//汇总
	 $scope.clickchange2=function(){
        if ($scope.data.currItem.check2 == true) {
            $scope.options_12.columnApi.hideColumns(["zone_name"])
        }else{$scope.options_12.columnApi.setColumnsVisible(["zone_name"])}
    };
    $scope.clickchange3=function(){
        if ($scope.data.currItem.check3 == true) {
            $scope.options_12.columnApi.hideColumns(["org_name"])
        }else{$scope.options_12.columnApi.setColumnsVisible(["org_name"])}
    };
    $scope.clickchange4=function(){
        if ($scope.data.currItem.check4 == true) {
            $scope.options_12.columnApi.hideColumns(["cust_code"])
        }else{$scope.options_12.columnApi.setColumnsVisible(["cust_code"])}
    };
    $scope.clickchange5=function(){
        if ($scope.data.currItem.check5 == true) {
            $scope.options_12.columnApi.hideColumns(["inspection_batchno"])
        }else{$scope.options_12.columnApi.setColumnsVisible(["inspection_batchno"])}
    };
	    //汇总保留2位
    $scope.sum_retain = function () {
        var nodes=$scope.options_12.api.getModel().rootNode.childrenAfterSort;
        var data = $scope.gridGetData("options_12");
        for(var i=0;i<$scope.columns_12.length;i++){
            for (var j = 0; j < data.length; j++) {
                if($scope.columns_12[i].field=="prod_amt"){
                    if(data[j].prod_amt!= undefined){
                        data[j].prod_amt=parseFloat( data[j].prod_amt||0).toFixed(2);
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
                if($scope.columns_12[i].field=="s12"){
                    if(data[j].s12!= undefined){
                        data[j].s12=parseFloat( data[j].s12||0).toFixed(2);
                    }
                }
                if($scope.columns_12[i].field=="amt4"){
                    if(data[j].amt4!= undefined){
                        data[j].amt4=parseFloat(data[j].amt4||0).toFixed(2);
                    }
                }
            }

        }
        $scope.options_12.api.refreshCells(nodes, ["prod_amt","amt4","s12","s11","s6","s8","s3","s1","redo_qty","new_qty","prod_amt"]);
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
        if ($scope.data.currItem.check1 == true) {
            arr.push("sale_ent_type");
            sortmodel.push({colId:"sale_ent_type",sort:"desc"})
        }
        if ($scope.data.currItem.check2 == true) {
            arr.push("zone_name");
            $scope.options_12.columnApi.hideColumns(["zone_name"])
            sortmodel.push({colId:"zone_name",sort:"desc"})
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
        if ($scope.data.currItem.check5 == true) {
            arr.push("inspection_batchno");
            $scope.options_12.columnApi.hideColumns(["inspection_batchno"])
            sortmodel.push({colId:"inspection_batchno",sort:"desc"})
        }
        if ($scope.data.currItem.check6 == true) {
            arr.push("currency_code");
            $scope.options_12.columnApi.hideColumns(["currency_code"])
            sortmodel.push({colId:"currency_code",sort:"desc"})
        }
        column[0] = "require_qty";
        column[1] = "prod_qty";
        column[2] = "prod_amt";
        column[3] = "new_qty";
        column[4] = "redo_qty";
        column[5] = "s1";
        column[6] = "s3";
        column[7] = "s8";
        column[8] = "s6";
        column[9] = "s11";
        column[10] = "s12";
        column[11] = "amt4";
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
        total.currency_code = "合计";
        sumcontainer.push(total);
        $scope.options_12.api.setRowData(sumcontainer);
        $scope.options_12.api.setSortModel(sortmodel)

        $scope.sum_retain();
    };
    /**********************隐藏、显示*************************/
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
            headerName: "大区", field: "zone_name", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
/*            cellEditorParams: {
                values: [{value: "1", desc: "空调组织"}]
            },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "部门", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "商检批号", field: "inspection_batchno", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "订单号", field: "pi_no", editable: false, filter: 'set', width: 100,
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
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 150,
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
            headerName: "套数", field: "require_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "下单时间", field: "prod_time", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "入库时间", field: "deliver_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "审核时间", field: "check_time", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "商标", field: "brand_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "压缩机型号", field: "comp_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "压缩机数量", field: "comp_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "出口国", field: "area_name", editable: false, filter: 'set', width: 100,
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
            headerName: "工厂型号", field: "item_h_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "排产金额", field: "prod_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "行类型", field: "line_type", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "生产通知号", field: "prod_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "工厂交期回复", field: "pre_over_time", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "客户型号", field: "cust_item_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
        headerName: '内机',
        children: [
            {headerName: "SAP订单号", field: "sap_no", width: 180, editable: false, filter: 'set',
                tooltipField: 'gameName',
        cellClass: function () {
            return 'alphabet';
        },
		action:$scope.selectAll,
        cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
		},{
        headerName: "工厂订单号", field: "fac_order_no",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "内机ERP编码", field: "erp_code",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "内机客户型号", field: "nj_item_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "内机数量", field: "prod_qty",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "内机全新生产数量", field: "new_Qqty",editable: false, filter: 'set',  width: 150,
		cellEditor:"浮点框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "内机返包数量", field: "redo_qty",editable: false, filter: 'set',  width: 200,
		cellEditor:"浮点框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true}
        ]
    },{
        headerName: '外机',
        children: [
            {headerName: "ERP编码", field: "erp_code1", width: 180, editable: false, filter: 'set',
                tooltipField: 'gameName',
        cellClass: function () {
            return 'alphabet';
        },
		action:$scope.selectAll,
        cellEditor:"文本框",
        enableRowGroup: true,
        enablePivot: true,
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
		},{
        headerName: "外机客户型号", field: "wj_item_name",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "SAP订单号", field: "sap_no1",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "工厂订单号", field: "fac_order_no1",editable: false, filter: 'set',  width: 150,
		cellEditor:"文本框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "外机数量", field: "amt1",editable: false, filter: 'set',  width: 100,
		cellEditor:"浮点框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "外机全新生产数量", field: "amt2",editable: false, filter: 'set',  width: 150,
		cellEditor:"整数框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "外机返包数量", field: "amt3",editable: false, filter: 'set',  width: 200,
		cellEditor:"浮点框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true}
        ]
    },{
        headerName: "返包信息", field: "redo_note",editable: false, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},{
        headerName: "BOM编制完成时间", field: "pdm_bom_date",editable: false, filter: 'set',  width: 200,
		cellEditor:"年月日",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},{
        headerName: "BOM编制状态", field: "pdm_bom_stat",editable: false, filter: 'set',  width: 200,
		cellEditor:"浮点框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
		},{
        headerName: "贸易类型", field: "sale_ent_type",editable: false, filter: 'set',  width: 200,
		cellEditor:"浮点框",
		//cellchange:$scope.bankBalance,
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
    $scope.columns_12 = [{
            headerName: "区域", field: "zone_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide:false
        }, {
            headerName: "部门", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide:false
        }, {
            headerName: "客户", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide:false
        }, {
            headerName: "商检批号", field: "inspection_batchno", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide:false
        },{
            headerName: "订单号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "套数", field: "require_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "下单时间", field: "prod_time", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "入库时间", field: "deliver_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "审核时间", field: "check_time", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "商标", field: "brand_name", editable: false, filter: 'set', width: 100,
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
    .controller('sale_list_prodinfor', sale_list_prodinfor);
