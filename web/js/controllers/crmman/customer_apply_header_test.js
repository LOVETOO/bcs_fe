var basemanControllers = angular.module('inspinia');

function cust_search($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
	
  //设置当前对象名及主键名
  $scope.objconf = {
        classid: "customer_apply_header",
        key: "cust_apply_id",
        nextStat: "customer_apply_headerEdit",
        classids: "customer_apply_headers",
		sqlBlock:"stat!=99",
		grids:[{optionname:'viewOptions', idname:'contains'}]
    }
  $scope.headername="机构";
  
  //$scope.contain=$scope.objconf.classids;
  cust_search = HczyCommon.extend(cust_search,ctrl_view_public);
  cust_search.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
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
    {
        headerName: "序号", field: "queue",editable: false, filter: 'set',  width: 60,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "客户编码", field: "erp_code",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "客户名称", field: "cust_name",editable: false, filter: 'set',  width: 300,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "区域名称", field: "org_name",editable: false, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "客户地址", field: "address",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "客户电话", field: "tel",editable: false, filter: 'set',  width: 100,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "单据状态", field: "stat",editable: false, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[{value:1,desc:'制单'},{value:2,desc:'提交'},{value:3,desc:'启动'},{value:4,desc:'驳回'},{value:5,desc:'审核'},
		{value:10,desc:'红冲'},{value:99,desc:'关闭'}]},
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "操作", field: "",editable: false, filter: 'set',  width: 100,
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
    .controller('cust_search',cust_search)
