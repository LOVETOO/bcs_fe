var basemanControllers = angular.module('inspinia');
function sale_ship_notice_header_ncrelation($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_ship_notice_header_ncrelation = HczyCommon.extend(sale_ship_notice_header_ncrelation, ctrl_bill_public);
    sale_ship_notice_header_ncrelation.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_ship_notice_header",
      //  key: "out_id",
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_ship_notice_headers'}]
    };



//查询
$scope.search = function () {
	var sqlBlock=" 1=1 ";
	var sqlBlock2=" 1=1 ";
	var date1=$scope.data.currItem.notice_time_start;
	var date2=$scope.data.currItem.notice_time_end;

	var date3=$scope.data.currItem.custosm_time_start;
	var date4=$scope.data.currItem.custosm_time_end;

	if($scope.data.currItem.chk1==2){
		if(date1 !="" && date1 != undefined){
			sqlBlock+=" and to_char(nh.check_time,'YYYY-MM-DD') >= " + "'"+date1+"'";
		}	
		if(date2 !="" && date2 != undefined){
			sqlBlock+=" and to_char(nh.check_time,'YYYY-MM-DD') <= " + "'"+date2+"'";
		}	
	}
	
	if($scope.data.currItem.chk2==2){
		if(date1 !="" && date1 != undefined){
			sqlBlock+=" and to_char(nh.kaip_date,'YYYY-MM-DD') >= " + "'"+date1+"'";
		}	
		if(date2 !="" && date2 != undefined){
			sqlBlock+=" and to_char(nh.kaip_date,'YYYY-MM-DD') <= " + "'"+date2+"'";
		}	
	}

	if(date3 !="" && date3 != undefined){
		sqlBlock2+=" and to_char(h.check_time,'YYYY-MM-DD') >= " + "'"+date3+"'";
	}	
	if(date4 !="" && date4 != undefined){
		sqlBlock2+=" and to_char(h.check_time,'YYYY-MM-DD') <= " + "'"+date4+"'";
	}

	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:103,
            sqlwhere  : sqlBlock,
			sqlwhere2 : sqlBlock2,
			warn_no: $scope.data.currItem.warn_no,
			pi_no: $scope.data.currItem.pi_no,
			inspection_batchno: $scope.data.currItem.inspection_batchno,
			erp_code: $scope.data.currItem.erp_code,
			eight_code: $scope.data.currItem.eight_code,
			customs_no: $scope.data.currItem.customs_no,
			notice_no: $scope.data.currItem.notice_no
        };
 var data=$scope.data.currItem.sale_ship_out_lineofsale_ship_out_headers;
 BasemanService.RequestPost("sale_ship_notice_header", "search", postdata)
        .then(function(data){
        	$scope.data.currItem.sale_ship_notice_headers=data.sale_ship_notice_headers;
             $scope.options_13.api.setRowData(data.sale_ship_notice_headers);
        });
}

//清空
//$scope.clear = function () {
//	var postdata={};
//	var data=$scope.data.currItem.sale_ship_out_lineofsale_ship_out_headers;
//	 BasemanService.RequestPost("sale_ship_out_header", "search", postdata)
//      .then(function(data){
//        $scope.options_13.api.setRowData();
//      });
//}

  
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
            headerName: "发货通知单号", field: "notice_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "出货预告号", field: "warn_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "合同号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "报关单号", field: "customs_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
		
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "商检批号", field: "comminspec_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
         
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "ERP编码", field: "erp_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货数量", field: "out_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "发货金额", field: "line_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "报关数量", field: "customs_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "报关金额", field: "customs_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "差异数量", field: "dif_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "差异金额", field: "dif_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "SAP交货订单号", field: "eight_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "SAP发票号", field: "fapiao_sap", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "SAP发票凭证", field: "kaipiao_sap", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "SAP公司间发票号", field: "company_fapiao", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "SAP公司间发票凭证号", field: "company_kaipiao", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "部门编码", field: "org_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "部门名称", field: "org_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "贸易类型", field: "sale_ent_type", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "Check_Time", field: "check_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "Custosm_Time", field: "custosm_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "差异凭证号", field: "other_sapno", editable: false, filter: 'set', width: 150,
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
        //数据缓存
        $scope.initdata();

	}

//加载控制器
basemanControllers
    .controller('sale_ship_notice_header_ncrelation', sale_ship_notice_header_ncrelation);
