var basemanControllers = angular.module('inspinia');
function sale_customs_headerlist($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_customs_headerlist = HczyCommon.extend(sale_customs_headerlist, ctrl_bill_public);
    sale_customs_headerlist.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_customs_header",
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_customs_headers'}]
    };

//下拉框   贸易类型

	 BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        $scope.sale_ent_types = data.dicts;
    })

//查询
$scope.search = function () {
	var date1=$scope.data.currItem.startdate;
	var date2=$scope.data.currItem.enddate;
	if(date1>date2){
		 BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
	}
	var postdata = {
            org_id: $scope.data.currItem.org_id,
			cust_id: $scope.data.currItem.cust_id,
			create_time:date1,
			update_time:date2,
			warn_id:$scope.data.currItem.warn_id,
			cpi_no:$scope.data.currItem.cpi_no
        };
 BasemanService.RequestPost("sale_customs_header", "getdiffoutmsg", postdata)
        .then(function(data){
            $scope.data.currItem.sale_customs_lineofsale_customs_headers=data.sale_customs_lineofsale_customs_headers;
			if(data.sale_customs_lineofsale_customs_headers.length==0){
				$scope.options_13.api.setRowData([]);
				BasemanService.notice("无数据返回", "alert-warning");
                 return;
			}
			for(var i=0;i<data.sale_customs_lineofsale_customs_headers.length;i++){
			data.sale_customs_lineofsale_customs_headers[i].chayqty=parseFloat(data.sale_customs_lineofsale_customs_headers[i].customs_qty||0)-parseFloat(data.sale_customs_lineofsale_customs_headers[i].out_qty||0)
			data.sale_customs_lineofsale_customs_headers[i].chayamt=parseFloat(data.sale_customs_lineofsale_customs_headers[i].customs_amt||0)-parseFloat(data.sale_customs_lineofsale_customs_headers[i].line_amt||0)
			}
			var re=[];
			var sum={};
			sum.customs_no="合计"
			sum.customs_id=data.sale_customs_lineofsale_customs_headers[0].customs_id;
			sum.line_amt=0;
			sum.customs_amt=0;
			sum.chayamt=0;
			for(var i=0;i<data.sale_customs_lineofsale_customs_headers.length;i++){
				if(i==data.sale_customs_lineofsale_customs_headers.length-1){
					re.push(data.sale_customs_lineofsale_customs_headers[i]);
					sum.customs_amt+=parseFloat(data.sale_customs_lineofsale_customs_headers[i].customs_amt||0);
					sum.line_amt+=parseFloat(data.sale_customs_lineofsale_customs_headers[i].line_amt||0);
					sum.chayamt+=parseFloat(data.sale_customs_lineofsale_customs_headers[i].chayamt||0);
					re.push(sum);
					
				}else{
				if(data.sale_customs_lineofsale_customs_headers[i].customs_no!=data.sale_customs_lineofsale_customs_headers[i+1].customs_no){
					sum.customs_amt+=parseFloat(data.sale_customs_lineofsale_customs_headers[i].customs_amt||0);
					sum.line_amt+=parseFloat(data.sale_customs_lineofsale_customs_headers[i].line_amt||0);
					sum.chayamt+=parseFloat(data.sale_customs_lineofsale_customs_headers[i].chayamt||0);
					re.push(data.sale_customs_lineofsale_customs_headers[i]);
					re.push(sum);
					var sum={};
					sum.customs_no="合计"
					sum.customs_id=data.sale_customs_lineofsale_customs_headers[i+1].customs_id;
			        sum.customs_amt=0;
					sum.line_amt=0;
			        sum.chayamt=0;	
				}else{
					re.push(data.sale_customs_lineofsale_customs_headers[i]);
					sum.customs_amt+=parseFloat(data.sale_customs_lineofsale_customs_headers[i].customs_amt||0);
					sum.line_amt+=parseFloat(data.sale_customs_lineofsale_customs_headers[i].line_amt||0);
					sum.chayamt+=parseFloat(data.sale_customs_lineofsale_customs_headers[i].chayamt||0);					
				}	
				}
				
			}
            $scope.options_13.api.setRowData(re);
        });
}

//清空
$scope.diff = function () {
	if($scope.data.currItem.sap_time==""||$scope.data.currItem.sap_time==undefined){
		BasemanService.notice("导SAP日期为空", "alert-warning");
        return;
	}
	var data=$scope.options_13.api.getSelectedRows();
	for(var i=0;i<data.length;i++){
		if(data[i].customs_no=="合计"){		
		postdata={};
		postdata.customs_id=data[i].customs_id;
		postdata.out_total_amt=data[i].chayamt;
		postdata.check_time=$scope.data.currItem.sap_time;
		BasemanService.RequestPost("sale_customs_header", "getdiffoutmsg", postdata)
	    .then(function(data){
        var res=$scope.gridGetData("options_13");
		for(var i=0;i<res.length;i++){
			if(parseInt(res[i].customs_id)==parseInt(data.customs_id)&&res[i].customs_no=="合计"){
				res[i].importflag=data.importdataflag;
				$scope.options_13.api.setRowData(res);
			}
		}
		
	    })
	  }
	}	
}

    /***************************弹出框***********************/
	$scope.selectorg = function () {
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
	$scope.warn_no = function () {
        $scope.FrmInfo = {
			
            classid: "sale_ship_warn_header",
	        postdata:{},
			sqlBlock: "stat = 5 and update_time>=to_date('2012-12-08','yyyy-mm-dd')"           
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			$scope.data.currItem.warn_no = result.warn_no;
			$scope.data.currItem.warn_id = result.warn_id;   		
        });
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

    /************************网格定义区域**************************/
 function colorRenderer(params){
		if((params.data.customs_no)=="合计"){
		params.eGridCell.style.background="yellow";
		}
        if((params.data.importflag)){
		params.eGridCell.style.color="green";	
		}	
		if(params.value==undefined){
			return ""
		}else{
		return params.value;	
		}
		
	}
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
$scope.columns_13 = [
        {
            headerName: "报关单号", field: "customs_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
			cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "合同号", field: "cpi_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
			cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "凭证号", field: "sap_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            cellRenderer:function(params){return colorRenderer(params)},			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户产品名称", field: "cust_spec", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "ERP产品编码", field: "erp_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "报关数量", field: "customs_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "报关单价", field: "customs_price", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "报关金额", field: "customs_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货数量", field: "out_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货单价", field: "price", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货金额", field: "line_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "差异数量", field: "chayqty", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "差异金额", field: "chayamt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货单号", field: "notice_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "flag", field: "flag", editable: false, filter: 'set', width: 80,
            cellEditor: "文本框",
			cellRenderer:function(params){return colorRenderer(params)},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_13 = {
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
			selectAll:true,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_13.columnApi.getRowGroupColumns().length > 0;
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
basemanControllers
    .controller('sale_customs_headerlist', sale_customs_headerlist);
