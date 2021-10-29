	var basemanControllers = angular.module('inspinia');
function show_bill_warning($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    show_bill_warning = HczyCommon.extend(show_bill_warning, ctrl_bill_public);
    show_bill_warning.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "show_bill_warning", 
		key: "",
        FrmInfo: {}, 
        grids: [
            {optionname: 'options_yq', idname: 'bill_invoice_headers' },
			{optionname: 'options_prod', idname: 'sale_prod_headers' },
			{optionname: 'options_printed', idname: 'sale_prod_m_headers' },
			{optionname: 'options_detail', idname: 'customer_receive_headers' },
			{optionname: 'options_list', idname: 'edi_quotaapply_lists' }]
    };


//查询
$scope.search = function () {
	var sqlBlock=""; 
	//应收逾期款
	BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:30
   };
 BasemanService.RequestPost("bill_invoice_header", "search", postdata)
        .then(function(data){ 
             $scope.options_yq.api.setRowData(data.bill_invoice_headers);
        });

	//生产定金7天未到提醒
	BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:20
   }; 
 BasemanService.RequestPost("Sale_Prod_Header", "search", postdata)
        .then(function(data){
             $scope.options_prod.api.setRowData(data.sale_prod_headers);
        });

 	//印刷件补充提醒
 	BasemanService.getSqlWhereBlock(sqlBlock);
 	var postdata = { flag:104
   }; 
 BasemanService.RequestPost("sale_prod_m_header", "search", postdata)
        .then(function(data){
             $scope.options_printed.api.setRowData(data.sale_prod_m_headers);
        });

	//客户来访接待审核提醒
	BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:3
   }; 
 BasemanService.RequestPost("customer_receive_header", "search", postdata)
        .then(function(data){
             $scope.options_detail.api.setRowData(data.customer_receive_headers);
        });

	//限额预撤销提醒
	BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:4
   }; 
 BasemanService.RequestPost("edi_quotaapply_list", "search", postdata)
        .then(function(data){
             $scope.options_list.api.setRowData(data.edi_quotaapply_lists);
        });
}

$scope.search();
   
    //流程状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            //印刷件补充提醒
            $scope.columns_printed[3].cellEditorParams.values.push(newobj); 
        }
    })
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
	
    $scope.columns_yq = [
        {
            headerName: "发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 112,
            cellEditor: "文本框", 
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 87,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
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
            headerName: "发票金额", field: "invoice_amt", editable: false, filter: 'set', width: 87,
            cellEditor: "文本框",		
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "逾期金额", field: "return_amt", editable: false, filter: 'set', width: 87,
            cellEditor: "文本框",         
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "到期日期", field: "update_time", editable: false, filter: 'set', width: 87,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "考核日期", field: "check_time", editable: false, filter: 'set', width: 87,
            cellEditor: "年月日",          
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "本月考核金额", field: "jd_totalamt", editable: false, filter: 'set', width: 113,
            cellEditor: "文本框",            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "累计考核金额", field: "invoice_check_amt", editable: false, filter: 'set', width: 113,
            cellEditor: "文本框",            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "数据来源", field: "note", editable: false, filter: 'set', width: 87,
            cellEditor: "文本框",           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "付款方式", field: "payment_type_name", editable: false, filter: 'set', width: 87,
            cellEditor: "文本框",            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "币种", field: "currency_code", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_yq = {
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
			fixedGridHeight :true,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_yq.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
		//
    $scope.columns_prod = [
        {
            headerName: "生产单号", field: "prod_no", editable: false, filter: 'set', width: 87,
            cellEditor: "文本框", 
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "商检批号", field: "inspection_batchno", editable: false, filter: 'set', width: 87,
            cellEditor: "文本框", 
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "生产单备案日期", field: "check_time", editable: false, filter: 'set', width: 127,
            cellEditor: "年月日",           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "超期天数", field: "note", editable: false, filter: 'set', width: 87,
            cellEditor: "文本框",         
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_prod = {
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
			fixedGridHeight :true,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_prod.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
	//印刷件补充提醒
    $scope.columns_printed = [
        {
            headerName: "生产单号", field: "prod_no", editable: false, filter: 'set', width: 87,
            cellEditor: "文本框", 
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "商检批号", field: "inspection_batchno", editable: false, filter: 'set', width: 87,
            cellEditor: "文本框", 
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "生产单备案日期", field: "check_time", editable: false, filter: 'set', width: 127,
            cellEditor: "年月日",           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "流程状态", field: "stat", editable: false, filter: 'set', width: 87,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "补充截止天数", field: "note", editable: false, filter: 'set', width: 113,
            cellEditor: "文本框",         
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_printed = {
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
			fixedGridHeight :true,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_printed.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
	//客户来访接待审核提醒
    $scope.columns_detail = [
        {
            headerName: "单号", field: "receive_no", editable: false, filter: 'set', width: 150,
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
            headerName: "部门名称", field: "org_name", editable: false, filter: 'set', width: 87,
            cellEditor: "年月日",           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 87,
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
            headerName: "制单人", field: "creator", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",         
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "制单时间", field: "create_time", editable: false, filter: 'set', width: 150,
            cellEditor: "年月日",         
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_detail = {
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
			fixedGridHeight :true,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_detail.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
	//限额预撤销提醒
    $scope.columns_list = [
        {
            headerName: "中信保卖家编号", field: "bizbuyerno", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框", 
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "限额生效日期", field: "effectdate", editable: false, filter: 'set', width: 150,
            cellEditor: "年月日", 
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "预计失效日期", field: "newlapsedate", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "银行swift", field: "bankswift", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_list = {
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
			fixedGridHeight :true,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_list.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
	//
        $scope.initdata();
	}

//加载控制器
basemanControllers
    .controller('show_bill_warning', show_bill_warning);
