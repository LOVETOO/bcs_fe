var basemanControllers = angular.module('inspinia');
function sale_prod_tp($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_prod_tp",
        key: "tp_id",
        nextStat: "sale_prod_tpEdit",
        classids: "sale_prod_tps",
        sqlBlock:"1=1",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    $scope.headername="生产特批单";
    sale_prod_tp = HczyCommon.extend(sale_prod_tp,ctrl_view_public);
    sale_prod_tp.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
		
    /**------ 下拉框词汇值------------*/
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "stat"})
    .then(function (data) {
		for(var i=0;i<data.dicts.length;i++){
			var object={};
			object.value=data.dicts[i].dictvalue;
			object.desc=data.dicts[i].dictname;
			$scope.viewColumns[0].cellEditorParams.values.push(object);
//			$scope.viewColumns[4].cellEditorParams.values.push(object);
		}
    });
    
	//贸易类型
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "trade_type"})
    .then(function (data) {
		for(var i=0;i<data.dicts.length;i++){
			var object={};
			object.value=data.dicts[i].dictvalue;
			object.desc=data.dicts[i].dictname;
			$scope.viewColumns[15].cellEditorParams.values.push(object);
		}
    });
	//订单类型
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "sale_order_type"})
    .then(function (data) {
		for(var i=0;i<data.dicts.length;i++){
			var object={};
			object.value=data.dicts[i].dictvalue;
			object.desc=data.dicts[i].dictname;
			$scope.viewColumns[16].cellEditorParams.values.push(object);
		}
    });
	/**-----------------------------------*/
    /**----网格列区域  ----------*/
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
	
    $scope.viewColumns = [	
        {
            headerName: "状态", field:"stat",editable: false, filter: 'set',  width: 80,
            cellEditor:"下拉框",
            cellEditorParams:{values:[]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "特批单号", field: "tp_no",editable: false, filter: 'set',  width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产单号", field: "prod_no",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
 		{
             headerName: "创建人", field: "creator",editable: false, filter: 'set',  width: 85,
             cellEditor:"文本框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
         },
 		{
             headerName: "创建时间", field: "create_time",editable: false, filter: 'set',  width: 100,
             cellEditor:"年月日",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
         },
 		{
             headerName: "修改人", field: "updator",editable: false, filter: 'set',  width: 100,
             cellEditor:"文本框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
         },
 		{
             headerName: "修改时间", field: "update_time",editable: false, filter: 'set',  width: 100,
             cellEditor:"年月日",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
         },
		{
             headerName: "特批理由", field: "note",editable: false, filter: 'set',  width: 300,
             cellEditor:"文本框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
         },
        {
            headerName: "操作", field: "", editable: false, filter: 'set', width: 58,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            pinned: 'right',
            cellRenderer: "链接渲染"
        }];
    //数据缓存
    $scope.initData();
}
//加载控制器
basemanControllers
    .controller('sale_prod_tp',sale_prod_tp);

