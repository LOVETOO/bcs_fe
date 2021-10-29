var basemanControllers = angular.module('inspinia');
function sale_ship_warn_hosityxin($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_ship_warn_hosityxin = HczyCommon.extend(sale_ship_warn_hosityxin, ctrl_bill_public);
    sale_ship_warn_hosityxin.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_ship_out_header",
       /* key: "out_id",*/
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_ship_out_headerofsale_ship_out_headers'}]
    };

//下拉框   贸易类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        $scope.sale_ent_types = data.dicts;
    })

//查询
$scope.search = function () {
	var date1=$scope.data.currItem.startdate;
	var date2=$scope.data.currItem.enddate;
	if(date1>date2 && date2!=undefined && date1!=""){
		 BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
	}
	sqlBlock="1=1";
	if(date1!=undefined && date1!=""){
	sqlBlock+="and m.check_time >= to_Date('" + date1
						+ "','yyyy-MM-dd hh24:mi:ss')";
	}
	if(date2!=undefined && date2!=""){
	sqlBlock+="and m.check_time <= to_Date('" + date2+ "','yyyy-MM-dd hh24:mi:ss')";
	}
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:22,
	
            sqlwhere: sqlBlock,
             org_id: $scope.data.currItem.org_id,
            cust_id: $scope.data.currItem.cust_id,
			  pi_no: $scope.data.currItem.pi_no,
		   pino_new: $scope.data.currItem.pino_new,
		  notice_no: $scope.data.currItem.notice_no,
		    warn_no: $scope.data.currItem.warn_no,
 inspection_batchno: $scope.data.currItem.inspection_batchnos,
			prod_no: $scope.data.currItem.prod_no,
        sale_ent_type: $scope.data.currItem.sale_ent_type,
		  startdate: $scope.data.currItem.startdate,
			enddate: $scope.data.currItem.enddate
        };
 BasemanService.RequestPost("sale_ship_out_header", "getoutlist", postdata)
        .then(function(data){
			
			 $scope.data.currItem.sale_ship_out_headerofsale_ship_out_headers=data.sale_ship_out_headerofsale_ship_out_headers;
			      for (var i = 0; i < $scope.data.currItem.sale_ship_out_headerofsale_ship_out_headers.length; i++) {
                            if($scope.data.currItem.sale_ship_out_headerofsale_ship_out_headers[i].sale_ent_type=="1"){
								$scope.data.currItem.sale_ship_out_headerofsale_ship_out_headers[i].sale_ent_type="进出口贸易";
							}
							 if($scope.data.currItem.sale_ship_out_headerofsale_ship_out_headers[i].sale_ent_type=="2"){
								$scope.data.currItem.sale_ship_out_headerofsale_ship_out_headers[i].sale_ent_type="香港转口贸易";
							}
							 if($scope.data.currItem.sale_ship_out_headerofsale_ship_out_headers[i].sale_ent_type=="3"){
								$scope.data.currItem.sale_ship_out_headerofsale_ship_out_headers[i].sale_ent_type="香港直营贸易";
							}
							  if($scope.data.currItem.sale_ship_out_headerofsale_ship_out_headers[i].stat=="1"){
								$scope.data.currItem.sale_ship_out_headerofsale_ship_out_headers[i].stat="制单";
							} if($scope.data.currItem.sale_ship_out_headerofsale_ship_out_headers[i].stat=="3"){
								$scope.data.currItem.sale_ship_out_headerofsale_ship_out_headers[i].stat="启动";
							} if($scope.data.currItem.sale_ship_out_headerofsale_ship_out_headers[i].stat=="5"){
								$scope.data.currItem.sale_ship_out_headerofsale_ship_out_headers[i].stat="已审核";
							} if($scope.data.currItem.sale_ship_out_headerofsale_ship_out_headers[i].stat=="99"){
								$scope.data.currItem.sale_ship_out_headerofsale_ship_out_headers[i].stat="关闭";
							}
            }

			 
             $scope.options_13.api.setRowData(data.sale_ship_out_headerofsale_ship_out_headers);
			
        });
}


    /***************************弹出框***********************/
    //清除
    $scope.clear_cust = function () {
        $scope.data.currItem.cust_id="";
        $scope.data.currItem.cust_name="";
    }
    $scope.clear_org = function () {
        $scope.data.currItem.org_id="";
        $scope.data.currItem.org_name="";
    }
	$scope.select = function () {
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
	
	$scope.select2 = function () {
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
	
	$scope.select3 = function () {
        $scope.FrmInfo = {
			
            classid: "sale_ship_out_header",
	        postdata:{},
/*			sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",*/
            backdatas: "sale_ship_out_headers",
           
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			$scope.data.currItem.org_id = result.orgid;
			 $scope.data.currItem.org_code = result.code;   
			 $scope.data.currItem.org_name = result.orgname			
        });
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
$scope.columns_13 = [
        {
            headerName: "贸易类型", field: "sale_ent_type",editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货通知单号", field: "notice_no",editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
                headerName: "状态", field: "stat",editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
               
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
        },{
            headerName: "交货号", field: "sapno",editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
		
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "PI号", field: "pi_no",editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
         
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "合同号", field: "pino_new", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "商检批号", field: "inspection_batchno",editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "业务员", field: "sales_user_id",editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "业务部门", field: "org_name",editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户编码", field: "cust_code",editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户名称", field: "cust_name",editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "付款方式", field: "payment_type_name",editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "实际出货日期", field: "actual_ship_date",editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "货币名称", field: "currency_code",editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "产品名称", field: "item_name",editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "ERP编码", field: "erp_code",editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "数量", field: "qty",editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "销售价", field: "price",editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "金额", field: "out_amt",editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "备注", field: "note",editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
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
    .controller('sale_ship_warn_hosityxin', sale_ship_warn_hosityxin);
