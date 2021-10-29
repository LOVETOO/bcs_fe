var basemanControllers = angular.module('inspinia');
function sale_ship_warn_liult($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_ship_warn_liult = HczyCommon.extend(sale_ship_warn_liult, ctrl_bill_public);
    sale_ship_warn_liult.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_ship_notice_header",
       /* key: "out_id",*/
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_ship_notice_headers'}]
    };

//下拉框   贸易类型

	$scope.is_overs = [{
        	id:1,
        	name:"否",
        },{
        	id:2,
        	name:"是",
        }]

//查询
$scope.search = function () {
	var date1=$scope.data.currItem.startdate;
	var date2=$scope.data.currItem.enddate;
	if(date1>date2){
		 BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
	}
	sqlBlock="";
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { //flag:15,
            sqlwhere  : sqlBlock,
            org_id: $scope.data.currItem.org_id,           
            cust_id: $scope.data.currItem.cust_id,
			cust_name: $scope.data.currItem.cust_name,
			create_time: $scope.data.currItem.startdate,			
			update_time: $scope.data.currItem.enddate
        };
 BasemanService.RequestPost("sale_ship_notice_header", "getorderlist", postdata)
        .then(function(data){
            $scope.data.currItem.sale_ship_item_lineofsale_ship_notice_headers=data.sale_ship_item_lineofsale_ship_notice_headers;
             $scope.options_13.api.setRowData(data.sale_ship_item_lineofsale_ship_notice_headers);
        });
}


    /***************************弹出框***********************/
    $scope.cust_clear=function () {
        $scope.data.currItem.cust_id="";
        $scope.data.currItem.cust_name="";
    }
    $scope.org_clear=function () {
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
			
            classid: "sale_ship_notice_header",
	        postdata:{},
/*			sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",*/
            backdatas: "sale_ship_notice_headers",
           
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
            headerName: "订舱日期", field: "create_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "合同号", field: "pi_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "商检批号", field: "inspection_batchno", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
                headerName: "目的港", field: "seaport_in_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
               
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
        },{
            headerName: "船司", field: "tow_cop_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
		
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "航线", field: "hanxian", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "箱量20GP", field: "boxnum1", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "20GP单价", field: "boxprice1", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "箱量40GP", field: "boxnum2", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "40GP单价", field: "boxprice2", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "箱量40HQ", field: "boxnum3", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "40HQ单价", field: "boxprice3", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "其他", field: "boxnum4", editable: false, filter: 'set', width: 180,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "总额", field: "line_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "到付/预付", field: "pay_style", editable: false, filter: 'set', width: 180,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "协议货代", field: "transit_name", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "指定货代", field: "logistics_name", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "指定船司", field: "tow_cop_name2", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "预计安排托卡日期", field: "pre_transit_date", editable: false, filter: 'set', width: 180,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "截关日", field: "cut_date", editable: false, filter: 'set', width: 180,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "码头", field: "matou", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "船期", field: "chuanqi", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "实际拖柜日期", field: "car_intime", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "提单签到天数", field: "td_days", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "指定货代费用确认备注", field: "hd_note", editable: false, filter: 'set', width: 200,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "实际开船日期", field: "depart_date", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "提单签到日期", field: "td_date", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "HB/L", field: "hbl", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "MB/L", field: "mbl", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "船务操作人", field: "cw_user", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "RMB费用", field: "rmb_fee", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "USD费用", field: "usd_fee", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "已经付款", field: "pay_date", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
           
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
    .controller('sale_ship_warn_liult', sale_ship_warn_liult);
