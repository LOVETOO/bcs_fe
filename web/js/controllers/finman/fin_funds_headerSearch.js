var basemanControllers = angular.module('inspinia');
function fin_funds_headerSearch($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_funds_headerSearch = HczyCommon.extend(fin_funds_headerSearch, ctrl_bill_public);
    fin_funds_headerSearch.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_funds_header",
        key: "funds_id",
      //  wftempid:10008,
        FrmInfo: {},
        grids: [{optionname: 'options_15', idname: 'fin_funds_headers'}]
    };

    /***************************弹出框***********************/
	$scope.selectcust = function () {
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
      //      sqlBlock: "org_id = " + $scope.data.currItem.org_id
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			 $scope.data.currItem.sap_code = result.sap_code;
			 $scope.data.currItem.cust_name = result.cust_name;
			 $scope.data.currItem.cust_id = result.cust_id;
			 $scope.data.currItem.cust_code = result.cust_code;
        });

    }
//查询
$scope.search = function () {
	var date1=$scope.data.currItem.funds_date1;
	var date2=$scope.data.currItem.funds_date2;
	var sqlBlock="";
	if(date1!="" && date2!=""){
		if(date1>date2){
			 BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
				return;
		}
	}
	sqlBlock=BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = {flag:101,
            sqlwhere  : sqlBlock
         //   cust_code:$scope.item.cust_code
        };
 var data=$scope.data.currItem.fin_funds_headers;
 BasemanService.RequestPost("fin_funds_header", "search", postdata)
        .then(function(data){
             $scope.options_15.api.setRowData(data.fin_funds_headers);
			$scope.data.currItem.fin_funds_headers=data.fin_funds_headers
        });
}
 //引入资金系统
    $scope.omstozj = function () {
        var data = $scope.gridGetData("options_15");
        var selectRows = $scope.selectGridGetData('options_15');
        if (!selectRows.length) {
            BasemanService.notice("请选择你要导入资金系统的到款!", "alert-warning");
            return;
        };
          var j=0;
          for(var i=0;i<selectRows.length;i++){
            var postdata=selectRows[i];
			postdata.objid=data[i].objid;
			postdata.m_stat=data[i].m_stat;
//			push(postdata);
          ds.dialog.confirm("是否引入ERP？", function () {
            BasemanService.RequestPost("fin_funds_header", "omstozj", postdata)
                .then(function (result) {
                    selectRows[j].erp_stat="2" ;
                    j++;
                    if(j==i){
                        $scope.selectGridGetData([]);
                        $scope.options_15.api.setRowData(data);
                    };
                });
           },function () {$scope.newWindow.close();});
		 }
    };
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
$scope.columns_15 = [
        {
            headerName: "引资金系统状态", field: "zj_stat", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
             cellEditorParams: {
                    values: [{value: 0, desc: '未引入'},{value: 1, desc: '未引入'}, {value: 2, desc: '已引入'}]
                },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
			 checkboxSelection: function (params) {
               return params.columnApi.getRowGroupColumns().length === 0;
           },
        },{
            headerName: "到款类型", field: "funds_type", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {
                    values: [{value: 1, desc: 'TT'},{value: 2, desc: 'LC'}]
                },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
                headerName: "单据类型", field: "m_stat", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
               cellEditorParams: {
                    values: [{value: 1, desc: '录入单'},{value: 2, desc: '变更单'}]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
        },{
            headerName: "回款组织", field: "return_ent_type", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
			cellEditorParams: {
                    values: [{value: 1, desc: '宁波'},{value: 2, desc: '香港'}]
                },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "资金系统单号", field: "other_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
         
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "到款单号", field: "funds_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "信用证号", field: "lc_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 150,
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
            headerName: "到款日期", field: "funds_date", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "实际到款", field: "fact_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "扣费", field: "amt_deduct", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "利息", field: "lc_interest", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "objid", field: "objid", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_15 = {
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
                var isGrouping = $scope.options_15.columnApi.getRowGroupColumns().length > 0;
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
    .controller('fin_funds_headerSearch', fin_funds_headerSearch);
