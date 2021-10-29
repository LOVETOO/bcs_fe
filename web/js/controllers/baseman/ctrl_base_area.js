var basemanControllers = angular.module('inspinia');

function base_area($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
  //设置当前对象名及主键名
  $scope.objconf = {
        classid: "scparea",
        key: "areaid",
        nextStat: "BaseA_0_2_E",
        classids: "scpareas",
		sqlBlock:"1=1",
		thead:[{name: "路径",code: "idpath",iscond: true,show:true,type: 'string'}],
		grids:[{optionname:'viewOptions', idname:'contains'}]
    }
  $scope.headername="区域";
  base_area = HczyCommon.extend(base_area,ctrl_view_public);
  base_area.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
		
 /**----弹出框事件区域  ----------*/
  $scope.selectAll=function(){
	$scope.FrmInfo = {
            title: "数据查询",
            thead: [{
                name: "弹出框控件测试",
                code: "idpath"
            }],
            classid: "scparea",
            searchlist: ["idpath"]
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (data) {
			var nodes=$scope.viewOptions.api.getModel().rootNode.childrenAfterGroup;
			var cell=$scope.viewOptions.api.getFocusedCell();
			nodes[cell.rowIndex].data.idpath=data.idpath;
			$scope.viewOptions.api.refreshRows(nodes);			
			
        })
};

function ageNowValueGetter(params) {
    return params.data.bought ;
}
/**---------------*/

/**----修改文本框触发事件区域  ----------*/
$scope.bankBalance=function(){
	var _this = $(this);
	var val = _this.val();
	var key=["idpath"];
	var nodes=$scope.viewOptions.api.getModel().rootNode.childrenAfterGroup;
    var cell=$scope.viewOptions.api.getFocusedCell();
    nodes[cell.rowIndex].data.idpath=val;	
	$scope.viewOptions.api.refreshCells(nodes,key);	
};
  
/**-----------------*/

/**----网格列区域  ----------*/
  var firstColumn = {
        headerName: '勾选控件',
        field: 'note',
        width: 200,
        editable: true,
        enableRowGroup: true,
        checkboxSelection: function (params) {
            // we put checkbox on the name if we are not doing no grouping
            return params.columnApi.getRowGroupColumns().length === 0;
        },
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
};	   
$scope.viewColumns = [
    {
        headerName: 'Participant',
        children: [
            firstColumn,
            {headerName: "日期控件", field: "areaname", width: 150, editable: true,
        enableRowGroup: true,
        enablePivot: true,
        cellEditor: "年月日",
        cellEditorParams: { 
            values: ["Argentina", "Brazil", "Colombia", "France", "Germany", "Greece", "Iceland", "Ireland",
                "Italy", "Malta", "Portugal", "Norway", "Peru", "Spain", "Sweden", "United Kingdom",
                "Uruguay", "Venezuela"]
        },
        pinned: 'left',
        floatCell: true,
        filterParams: {  
            cellHeight: 20,
            newRowsAction: 'keep'
        },
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
    },
    {
        headerName: "下拉控件", field: "areatype", width: 150, editable: true, filter: 'set',
        cellEditor:"下拉框",
        cellEditorParams: {
            values: [{value:1,desc:'English'}, {desc:'Spanish',value:2}, {desc:'French',value:3}, {desc:'LLL',value:4}]
        },
        enableRowGroup: true,
        enablePivot: true,
        
        headerTooltip: "Example tooltip for Language",
        filterParams: {newRowsAction: 'keep'},
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
            }
        ]
      },
    {
        headerName: 'Game of Choice',
        children: [
            {headerName: "弹出框控件", field: "idpath", width: 180, editable: true, filter: 'set',
                tooltipField: 'gameName',
        cellClass: function () {
            return 'alphabet';
        },
		action:$scope.selectAll,
		valueGetter: ageNowValueGetter,
        cellEditor:"弹出框",
        enableRowGroup: true,
        enablePivot: true,
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
            sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
        }
    },
    {
        headerName: "文本框(改变内部值测试)", field: "bought",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "整数框", field: "bought1",editable: true, filter: 'set',  width: 200,
		cellEditor:"整数框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "浮点框", field: "bought2",editable: true, filter: 'set',  width: 200,
		cellEditor:"浮点框",
		cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true},
{
        headerName: "复选框", field: "bought3",editable: true, filter: 'set',  width: 200,
		cellEditor:"复选框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true}
        ]
    },
    {
        headerName: 'Performance',
        groupId: 'performance',
        children: [
            {headerName: "Bank Balance", field: "bankBalance", width: 150, editable: true,
                enableValue: true,
                icons: {
                    sortAscending: '<i class="fa fa-sort-amount-asc"/>',
                    sortDescending: '<i class="fa fa-sort-amount-desc"/>'
                },
				cellValueChanged:$scope.bankBalance
            },
            {
                headerName: "Extra Info 1", columnGroupShow: 'open', width: 150, editable: false,
                suppressSorting: true, suppressMenu: true, cellStyle: {"text-align": "right"},
                cellRenderer: function() { return 'Abra...'; }
            },
            {
                headerName: "Extra Info 2", columnGroupShow: 'open', width: 150, editable: false,
                suppressSorting: true, suppressMenu: true, cellStyle: {"text-align": "left"},
                cellRenderer: function() { return '...cadabra!'; }
            }
        ],
    },
    {
        headerName: "Rating", field: "rating", width: 100, editable: true,
		cellEditor:"下拉框",
        floatCell: true,
		cellEditorParams: {
            values: [{desc:'English',value:1}, {desc:'Spanish',value:2}, {desc:'French',value:3}, {desc:'LLL',value:4}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true
    }, {
        headerName: "Total Winnings", field: "areatype", filter: 'number',
        editable: false, width: 150,
        enableValue: true,
		buttonclick:$scope.edit,
		cellRenderer:"编辑框渲染",
    }
];
$scope.initData();
/**----------------------------*/ 
}
//加载控制器
basemanControllers
    .controller('base_area',base_area)
