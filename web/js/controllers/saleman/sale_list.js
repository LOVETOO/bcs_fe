var basemanControllers = angular.module('inspinia');
function sale_list($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_list = HczyCommon.extend(sale_list, ctrl_bill_public);
    sale_list.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_list",
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_lists'}]
    };


//查询
$scope.search = function () {
	var date1=$scope.data.currItem.startdate;
	var date2=$scope.data.currItem.enddate;
	var sqlBlock="";  
	var date11 = date1.substring(0,4);
	var date22 = date2.substring(0,4);
	console.log("年份"+date11);

	
	//var today = new Date();
	//$scope.formatDate = $filter('date')(today, 'yyyy-MM-dd');
	//var myJsDate=$filter('date')(date1,'yyyy');
	//var myJsDate=$filter('date')($scope.startdate,'yyyy-MM-dd');
	//console.log("年份------"+$scope.formatDate);
	sqlBlock="";
	if(date1=="" ||  date1==undefined){
		 BasemanService.notice("起始日期不能为空", "alert-warning");
            return;
	}else if(date2=="" || date2==undefined){
		 BasemanService.notice("结束日期不能为空", "alert-warning");
            return;
	}else if(date1>date2){
		 BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
	}else if(date11!=date22){
		 BasemanService.notice("查询只能是同一年！！", "alert-warning");
            return;
	}
	
	BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:18,
            sqlwhere  : sqlBlock,
            start_date: $scope.data.currItem.startdate,
            end_date: $scope.data.currItem.enddate
   };
 var data=$scope.data.currItem.sale_lists;
 BasemanService.RequestPost("sale_list", "search", postdata)
        .then(function(data){
             $scope.options_13.api.setRowData(data.sale_lists);
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
            headerName: "数据分类", field: "info1", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "分类二", field: "info3", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "年份", field: "info2", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "1月", field: "amt1", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
		
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "2月", field: "amt2", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
         
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "3月", field: "amt3", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "4月", field: "amt4", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "5月", field: "amt5", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "6月", field: "amt6", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "7月", field: "amt7", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "8月", field: "amt8", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "9月", field: "amt9", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "10月", field: "amt10", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "11月", field: "amt11", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "12月", field: "amt12", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "合计", field: "amt", editable: false, filter: 'set', width: 150,
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
    .controller('sale_list', sale_list);
