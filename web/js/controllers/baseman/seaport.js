var basemanControllers = angular.module('inspinia');

function seaport_search($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
	
  //设置当前对象名及主键名
  $scope.objconf = {
        classid: "seaport",
        key: "seaport_id",
        nextStat: "seaportEdit",
        classids: "seaports",
        sqlBlock:"1=1",
		grids:[{optionname:'viewOptions', idname:'contains'}]
    }
  $scope.headername="港口";

  //$scope.contain=$scope.objconf.classids;
  seaport_search = HczyCommon.extend(seaport_search,ctrl_view_public);
  seaport_search.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
		
/**------- 系统词汇词查询区域------*/
 /**   BasemanService.RequestPost("base_search","search",{flag:1, flag_name:'stat'})
        .then(function(data){
            $scope.stats = [];
            for(var i=0;i<data.stats.length;i++){
                var newobj = {
                    value: data.stats[i].id,
                    desc: data.stats[i].name
                }
                $scope.stats.push(newobj);
            }
			
			for(var i=0;i<$scope.viewColumns.length;i++){
				if($scope.viewColumns[i].field=="stat"){
				$scope.viewColumns[i].cellEditorParams=$scope.stats;
				}
			}
			
        },function(data){
            $scope.cust_price_types = new Array();
        });*/

/**--------------------------*/

		
/**----弹出框事件区域  ----------*/


/**---------------*/

/**----修改文本框触发事件区域  ----------*/
$scope.bankBalance=function(){
	var _this = $(this);
	var val = _this.val();
	//需要刷新的网格的列,要去掉自身
	var key=["idpath"];
	
	var nodes=$scope.viewOptions.api.getModel().rootNode.childrenAfterGroup;
    var cell=$scope.viewOptions.api.getFocusedCell();
    nodes[cell.rowIndex].data.idpath=val;	
	$scope.viewOptions.api.refreshCells(nodes,key);	
}   
/**-----------------*/

/**----网格列区域  ----------*/ 
$scope.viewColumns = [       
		//港口编码、港口名称、英文名称、港口类型、是否可用、操作
    {		
        headerName: "港口编码", field: "seaport_code",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "港口名称", field: "seaport_name",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "英文名称", field: "english_name",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "港口类型", field: "seaport_type",editable: false, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[{value:1,desc:'出货港'},{value:2,desc:'入货港'}]},
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "是否可用", field: "usable",editable: false, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[{value:1,desc:'否'},{value:2,desc:'是'}]},
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},{
        headerName: "备注", field: "note",editable: false, filter: 'set',  width: 200,
        cellEditor:"文本框",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },
	{
        headerName: "操作", field: "",editable: false, filter: 'set',  width: 58,
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true,
		cellRenderer:"链接渲染"
	}
];
/**----------------------------*/ 
//数据缓存
$scope.initData();

}
//加载控制器
basemanControllers
    .controller('seaport_search',seaport_search)
