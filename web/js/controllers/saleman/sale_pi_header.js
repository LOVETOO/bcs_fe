var basemanControllers = angular.module('inspinia');
function sale_pi_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_pi_header",
        key: "pi_id",
        nextStat: "sale_pi_headerEdit",
        classids: "sale_pi_headers",
        //sqlBlock:"1=1 and pi_no like %PI%",
        thead:[],
		postdata :{sqlwhere:"1=1 and pi_no like '%PI%'"},
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    $scope.headername="形式发票";
	$scope.filed="pi_no";
    sale_pi_header = HczyCommon.extend(sale_pi_header,ctrl_view_public);
    sale_pi_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
		
    /**------ 下拉框词汇值------------*/
    var promise = BasemanService.RequestPost("base_search", "searchdict", {dictcode: "stat"});
    promise.then(function (data) {
		for(var i=0;i<data.dicts.length;i++){
			var object={};
			object.value=data.dicts[i].dictvalue;
			object.desc=data.dicts[i].dictname;
			$scope.viewColumns[0].cellEditorParams.values.push(object);
		}
    });
	
	//价格条款
	 var promise = BasemanService.RequestPost("price_type", "search");
    promise.then(function (data) {
        $scope.price_types = [];
        for (var i = 0; i < data.price_types.length; i++) {
			var object={};
			object.value=data.price_types[i].price_type_id;
			object.desc=data.price_types[i].price_type_name;
			$scope.viewColumns[5].cellEditorParams.values.push(object);
        }
    });
	
	//贸易类型
	var promise = BasemanService.RequestPost("base_search", "searchdict", {dictcode: "trade_type"});
    promise.then(function (data) {
            for(var i=0;i<data.dicts.length;i++){
			var object={};
			object.value=(data.dicts[i].dictvalue);
			object.desc=(data.dicts[i].dictname);
			$scope.viewColumns[10].cellEditorParams.values.push(object);
		    }
    });
	
	//订单类型
	var promise = BasemanService.RequestPost("base_search", "searchdict", {dictcode: "sale_order_type"});
    promise.then(function (data) {
            for(var i=0;i<data.dicts.length;i++){
			var object={};
			object.value=data.dicts[i].dictvalue;
			object.desc=data.dicts[i].dictname;
			$scope.viewColumns[13].cellEditorParams.values.push(object);
		    }
    });
	
	//客户等级
	var promise = BasemanService.RequestPost("base_search", "searchdict", {dictcode: "cust_level"});
    promise.then(function (data) {
            for(var i=0;i<data.dicts.length;i++){
			var object={};
			object.value=data.dicts[i].dictvalue;
			object.desc=data.dicts[i].dictname;
			$scope.viewColumns[14].cellEditorParams.values.push(object);
		    }
    });
	
	/**-----------------------------------*/
    /**----网格列区域  ----------*/
    $scope.viewColumns = [
	
        {
            headerName: "状态", field:"stat",editable: false, filter: 'set',  width: 60,
            cellEditor:"下拉框",
            cellEditorParams:{values:[]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "待审核人", field: "dshr",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		
        {
            headerName: "形式发票号", field: "pi_no",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "区域名称", field: "zone_name",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "销售区域", field: "org_name",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "价格条款", field: "price_type_id",editable: false, filter: 'set',  width: 100,
            cellEditor:"下拉框",
			cellEditorParams:{values:[]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "总数量", field: "qty_total",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "目的国", field: "area_name",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "总数量", field: "qty_total",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "备注", field: "note",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "贸易类型", field: "sale_ent_type",editable: false, filter: 'set',  width: 100,
            cellEditor:"下拉框",
			cellEditorParams:{values:[]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "创建时间", field: "create_time",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "审核时间", field: "check_time",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单类型", field: "sale_order_type",editable: false, filter: 'set',  width: 100,
            cellEditor:"下拉框",
			cellEditorParams:{values:[]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户等级", field: "cust_level",editable: false, filter: 'set',  width: 100,
            cellEditor:"下拉框",
			cellEditorParams:{values:[]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },		
		{
            headerName: "单据日期", field: "pi_date",editable: false, filter: 'set',  width: 180,
            cellEditor:"年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务员", field: "sales_user_id",editable: false, filter: 'set',  width: 180,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户编码", field: "cust_code",editable: false, filter: 'set',  width: 180,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户名称", field: "cust_name",editable: false, filter: 'set',  width: 180,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "付款方式", field: "payment_type_name",editable: false, filter: 'set',  width: 180,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "币种名称", field: "currency_name",editable: false, filter: 'set',  width: 85,
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
    .controller('sale_pi_header',sale_pi_header);

