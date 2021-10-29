var basemanControllers = angular.module('inspinia');
function sale_prod_weight_search($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_prod_weight_search = HczyCommon.extend(sale_prod_weight_search, ctrl_bill_public);
    sale_prod_weight_search.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_prod_weight_search",
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_prod_weight_searchs'}]
    };


//下拉框   

		 /*$scope.sy_stats = [{
        	id:1,
        	name:"技术参数",
        },{
        	id:2,
        	name:"称重",
        }]*/
     /*  var promise = BasemanService.RequestPost("base_search", "searchdict", {dictcode: "sy_stat"});
    	promise.then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            $scope.viewColumns[0].cellEditorParams.values[i] = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
        }
    });*/
//查询
$scope.search = function () {
	sqlBlock="1=1";
 if($scope.data.currItem.inspection_batchno!="" && $scope.data.currItem.inspection_batchno!=undefined){
	 sqlBlock+="and Upper(a.inspection_batchno) like '%"+$scope.data.currItem.inspection_batchno+"%'";
	}
	if($scope.data.currItem.erp_code!="" && $scope.data.currItem.erp_code!=undefined){
	 sqlBlock+="and Upper(b.erp_code) like '%"+$scope.data.currItem.erp_code+"%'";
	}
	var postdata = {
            sqlwhere  : sqlBlock,
			inspection_batchno: $scope.data.currItem.inspection_batchno,
			erp_code:$scope.data.currItem.erp_code
      
        };

 BasemanService.RequestPost("sale_prod_weight_search", "search", postdata)
        .then(function(data){
        	$scope.data.currItem.sale_prod_weight_searchs=data.sale_prod_weight_searchs;
             $scope.options_13.api.setRowData(data.sale_prod_weight_searchs);
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
            headerName: "ERP产品编码", field: "erp_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "毛重", field: "unit_gw", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
                headerName: "净重", field: "unit_nw", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
               
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
        },{
            headerName: "重要来源", field: "sy_stat", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
			cellEditorParams:{
                values:[]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "来源时间", field: "sy_date", editable: false, filter: 'set', width: 150,
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
    .controller('sale_prod_weight_search', sale_prod_weight_search);
