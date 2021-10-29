var basemanControllers = angular.module('inspinia');
function rptset_head($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "rptset_head",
        //key: "rptset_head_id",
        nextStat: "rptset_headEdit",
        classids: "rptset_heads",
        //sqlBlock: "rptset_head_id=7",
        postdata:{
        	flag:2,
        	rptset_head_id:7
        },
        searchAction:"search",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    $scope.headername="跟单查询";
    rptset_head = HczyCommon.extend(rptset_head,ctrl_view_public);
    rptset_head.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
		
    /**------ 下拉框词汇值------------*/
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "stat"})
    .then(function (data) {
		for(var i=0;i<data.dicts.length;i++){
			var object={};
			object.value=data.dicts[i].dictvalue;
			object.desc=data.dicts[i].dictname;
			$scope.viewColumns[0].cellEditorParams.values.push(object);
		}
    });
//	
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
            headerName: "PI号", field:"pi_no",editable: false, filter: 'set',  width: 60,
            cellEditor:"文本框",
            cellEditorParams:{values:[]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "部门", field: "org_name",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户编码", field: "cust_code",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "客户名称", field: "cust_name",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务员", field: "sales_user_id",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "pi总数量", field: "qty_total",editable: false, filter: 'set',  width: 100,
            cellEditor:"数字框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "PI启动时间", field: "statime",editable: false, filter: 'set',  width: 85,
            cellEditor:"年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "PI结束时间", field: "endtime",editable: false, filter: 'set',  width: 150,
            cellEditor:"年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "PI当前执行人", field: "userid",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "PI流程到达时间", field: "lasttime",editable: false, filter: 'set',  width: 85,
            cellEditor:"年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "PI周期", field: "pi_zq",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "MO号", field: "prod_no",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "MO总数量", field: "mo_qty",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "MO启动时间", field: "mo_statime",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "MO结束时间", field: "mo_endtime",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "MO当前执行人", field: "mo_sales_user_id",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "MO流程到达时间", field: "mo_lasttime",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "MO周期", field: "mo_zq",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "MO总周期", field: "total_zq",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "状态", field: "stat1",editable: false, filter: 'set',  width: 85,
            cellEditor:"下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "计划管理审批时间", field: "endtime2",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "按计划管理统计总周期", field: "jh_zq",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "工厂交期回复", field: "pre_over_time",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "按生产单工厂下单周期", field: "gc_zq",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "按PI工厂下单周期", field: "gc_zq2",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "订单类型", field: "sale_order_type",editable: false, filter: 'set',  width: 85,
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
    .controller('rptset_head',rptset_head);

