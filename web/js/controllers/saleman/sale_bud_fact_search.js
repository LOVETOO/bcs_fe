var finmanControllers = angular.module('inspinia');
function sale_bud_fact_search($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_bud_fact_search = HczyCommon.extend(sale_bud_fact_search, ctrl_bill_public);
    sale_bud_fact_search.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_ys_grant_header",
   /*     key: "funds_id",*/
        wftempid: 10008,
        FrmInfo: {
            sqlBlock: "funds_type=2",
        },
        grids: [{optionname: 'options_11', idname: 'sale_ys_grant_headers'}, {
            optionname: 'options_12',
            idname: 'sale_ys_grant_headers'
        }/*, {optionname: 'options_13', idname: 'fin_funds_xypmoffin_funds_headers'}, {
            optionname: 'options_14',
            idname: 'fin_funds_sapoffin_funds_headers'
        }*/]
    };
    
    //下拉
    $scope.search_styles = [{
      	id:1,
        	name:"接单数据",
        },{
       	id:2,
        	name:"销售数据",
        }]
BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "search_style"}).then(function (data) {
        $scope.search_style = data.search_style;
    })

     
     $scope.sell_months = [{id:1,name:"1",},{id:2,name:"2",},{id:3,name:"3",},{id:4,name:"4",},{id:5,name:"5",},{id:6,name:"6",}
     					  ,{id:7,name:"7",},{id:8,name:"8",},{id:9,name:"9",},{id:10,name:"10",},{id:11,name:"11",},{id:12,name:"12",}]
    
    
    /*查询*/
   $scope.search = function () {
	   sqlBlock=" 1 =1 ";
	   if($scope.data.currItem.org_id!="" && $scope.data.currItem.org_id!=undefined){
			sqlBlock+=" and h.Org_id   like '%"+$scope.data.currItem.org_id+"%'"
		}
		if($scope.data.currItem.cust_id!="" && $scope.data.currItem.cust_id!=undefined){
				sqlBlock+=" and h.Cust_id  like '%"+$scope.data.currItem.cust_id+"%'"
		}
	   if($scope.data.currItem.sell_year=="" || $scope.data.currItem.sell_year==undefined){
		   BasemanService.notice("请选择查询年份", "alert-warning");
            return;
	   }
	   if($scope.data.currItem.sell_month=="" || $scope.data.currItem.sell_month==undefined){
		   BasemanService.notice("请选择查询月份", "alert-warning");
            return;
	   }
	    if($scope.data.currItem.search_style=="" || $scope.data.currItem.search_style==undefined){
		   BasemanService.notice("请选择查询类型", "alert-warning");
            return;
	   }
	  
	
	
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:1,
            sqlwhere  : sqlBlock,
            org_code: $scope.data.currItem.org_code,
            org_id: $scope.data.currItem.org_id,
			cust_code: $scope.data.currItem.cust_code,
			cust_id: $scope.data.currItem.cust_id,
			search_style: $scope.data.currItem.search_style,
			stat:$scope.data.currItem.search_style,
			sell_year: $scope.data.currItem.sell_year,
			sell_month: $scope.data.currItem.sell_month
      
        };
 BasemanService.RequestPost("sale_ys_grant_header", "search", postdata)
        .then(function(data){
            $scope.data.currItem.sale_ys_grant_headers=data.sale_ys_grant_headers;
             $scope.options_11.api.setRowData(data.sale_ys_grant_headers);
			 $scope.options_12.api.setRowData(data.sale_ys_grant_headers);
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
   $scope.selectcust = function () {
             var sqlwhere="";
			if($scope.data.currItem.org_id!="" && $scope.data.currItem.org_id!=undefined){
				sqlwhere+= "org_id = " + $scope.data.currItem.org_id;
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
            sqlBlock: sqlwhere
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			 $scope.data.currItem.cust_code = result.cust_code;
			 $scope.data.currItem.cust_name = result.cust_name;
			 $scope.data.currItem.cust_id = result.cust_id;
        });

    }
	
    /**********************隐藏、显示*************************/
	//汇总
	 $scope.clickchange2=function(){
        if ($scope.data.currItem.check2 == true) {
            $scope.data.currItem.check3 =false;
            $scope.data.currItem.check4 =false;
            $scope.options_12.columnApi.hideColumns(["porg_name"]);
            $scope.options_12.columnApi.setColumnsVisible(["org_name"]);
            $scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
        }else{$scope.options_12.columnApi.setColumnsVisible(["porg_name"])}
    };
    $scope.clickchange3=function(){
        if ($scope.data.currItem.check3 == true) {
            $scope.data.currItem.check2 =false;
            $scope.data.currItem.check4 =false;
            $scope.options_12.columnApi.hideColumns(["org_name"])
            $scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
            $scope.options_12.columnApi.setColumnsVisible(["porg_name"]);
        }else{$scope.options_12.columnApi.setColumnsVisible(["org_name"])}
    };
    $scope.clickchange4=function(){
        if ($scope.data.currItem.check4 == true) {
            $scope.data.currItem.check3 =false;
            $scope.data.currItem.check2 =false;
            $scope.options_12.columnApi.hideColumns(["cust_code"]);
            $scope.options_12.columnApi.setColumnsVisible(["porg_name"]);
            $scope.options_12.columnApi.setColumnsVisible(["org_name"]);
        }else{$scope.options_12.columnApi.setColumnsVisible(["cust_code"])}
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
     
        column[0] = "zz_year";         
        column[1] = "last_t_qty";
        column[2] = "dc_year";
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
        total.currency_code = "合计";
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
            headerName: "大区", field: "porg_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
/*            cellEditorParams: {
                values: [{value: "1", desc: "空调组织"}]
            },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "部门名称", field: "org_name", editable: false, filter: 'set', width: 100,
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
        headerName: '本月',
        children: [
            {headerName: "预测数量", field: "gl_qty", width: 180, editable: false, filter: 'set',
                tooltipField: 'gameName',
        cellClass: function () {
            return 'alphabet';
        },
		action:$scope.selectAll,
        cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
    },
    {
        headerName: "实际数量", field: "qty",editable: false, filter: 'set',  width: 200,
		cellEditor:"整数框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "达成率（%）", field: "dc_month",editable: false, filter: 'set',  width: 200,
		cellEditor:"浮点框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "上年实际数量", field: "last_qty",editable: false, filter: 'set',  width: 200,
		cellEditor:"整数框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "增长率（%）", field: "zz_month",editable: false, filter: 'set',  width: 200,
		cellEditor:"浮点框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true}
        ]
    },{
        headerName: '累计',
        children: [
            {
        headerName: "预测数量", field: "far_qty", width: 180, editable: false, filter: 'set',
                tooltipField: 'gameName',
        cellClass: function () {
            return 'alphabet';
        },
		action:$scope.selectAll,
        cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
    },
    {
        headerName: "实际数量", field: "act_far_qty",editable: false, filter: 'set',  width: 200,
		cellEditor:"整数框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "达成率（%）", field: "dc_year",editable: false, filter: 'set',  width: 200,
		cellEditor:"浮点框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "上年实际数量", field: "last_t_qty",editable: false, filter: 'set',  width: 200,
		cellEditor:"整数框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "增长率（%）", field: "zz_year",editable: false, filter: 'set',  width: 200,
		cellEditor:"浮点框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true}
        ]
    }
    ];
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
    $scope.columns_12 = [ {
            headerName: "大区", field: "porg_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
/*            cellEditorParams: {
                values: [{value: "1", desc: "空调组织"}]
            },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "部门名称", field: "org_name", editable: false, filter: 'set', width: 100,
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
        headerName: '本月',
        children: [
            {headerName: "预测数量", field: "gl_qty", width: 180, editable: false, filter: 'set',
                tooltipField: 'gameName',
        cellClass: function () {
            return 'alphabet';
        },
		action:$scope.selectAll,
        cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
    },
    {
        headerName: "实际数量", field: "qty",editable: false, filter: 'set',  width: 200,
		cellEditor:"整数框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "达成率（%）", field: "dc_month",editable: false, filter: 'set',  width: 200,
		cellEditor:"浮点框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "上年实际数量", field: "last_qty",editable: false, filter: 'set',  width: 200,
		cellEditor:"整数框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "增长率（%）", field: "zz_month",editable: false, filter: 'set',  width: 200,
		cellEditor:"浮点框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true}
        ]
    },{
        headerName: '累计',
        children: [
            {
        headerName: "预测数量", field: "far_qty", width: 180, editable: false, filter: 'set',
                tooltipField: 'gameName',
        cellClass: function () {
            return 'alphabet';
        },
		action:$scope.selectAll,
        cellEditor:"整数框",
        enableRowGroup: true,
        enablePivot: true,
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
    },
    {
        headerName: "实际数量", field: "act_far_qty",editable: false, filter: 'set',  width: 200,
		cellEditor:"整数框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "达成率（%）", field: "dc_year",editable: false, filter: 'set',  width: 200,
		cellEditor:"浮点框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "上年实际数量", field: "last_t_qty",editable: false, filter: 'set',  width: 200,
		cellEditor:"整数框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "增长率（%）", field: "zz_year",editable: false, filter: 'set',  width: 200,
		cellEditor:"浮点框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true}
        ]
    }
    ];
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
    .controller('sale_bud_fact_search', sale_bud_fact_search);
