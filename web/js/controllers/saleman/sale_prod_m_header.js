var basemanControllers = angular.module('inspinia');
function sale_prod_m_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_prod_m_header",
        key: "prod_m_id",
        nextStat: "sale_prod_m_headerEdit",
        classids: "sale_prod_m_headers",
        sqlBlock:"1=1",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    $scope.headername="生产变更单";
    sale_prod_m_header = HczyCommon.extend(sale_prod_m_header,ctrl_view_public);
    sale_prod_m_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
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
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "sale_ent_type"})
    .then(function (data) {
		for(var i=0;i<data.dicts.length;i++){
			var object={};
			object.value=data.dicts[i].dictvalue;
			object.desc=data.dicts[i].dictname;
			$scope.viewColumns[16].cellEditorParams.values.push(object);
		}
    });
	//订单类型
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "sale_order_type"})
    .then(function (data) {
		for(var i=0;i<data.dicts.length;i++){
			var object={};
			object.value=data.dicts[i].dictvalue;
			object.desc=data.dicts[i].dictname;
			$scope.viewColumns[17].cellEditorParams.values.push(object);
		}
    });
	$scope.rowClicked =function(){
		var data=$scope.gridGetData("viewOptions");
		var index=$scope.viewOptions.api.getFocusedCell().rowIndex;
		var colid=$scope.viewOptions.api.getFocusedCell().column.colId;
	}
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
            headerName: "商检批号", field: "inspection_batchno",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "生产变更单号", field: "prod_m_no",editable: false, filter: 'set',  width: 100,
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
            headerName: "品牌", field: "brand_name",editable: false, filter: 'set',  width: 85,
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
            headerName: "客户编码", field: "cust_code",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "客户名称", field: "cust_name",editable: false, filter: 'set',  width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "货币代码", field: "currency_code",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "货币名称", field: "currency_name",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "付款方式", field: "payment_type_name",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "价格条款", field: "price_type_name",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
 		{
             headerName: "业务员", field: "sales_user_id",editable: false, filter: 'set',  width: 85,
             cellEditor:"文本框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
         },
 		{
             headerName: "此次排产总套数", field: "total_prod_qty",editable: false, filter: 'set',  width: 120,
             cellEditor:"文本框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
         },
 		{
             headerName: "订单总金额", field: "pi_amt",editable: false, filter: 'set',  width: 120,
             cellEditor:"文本框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
         },
 		{
             headerName: "此次排产总额", field: "prod_amt",editable: false, filter: 'set',  width: 120,
             cellEditor:"文本框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
         },
		{
             headerName: "贸易类型", field: "sale_ent_type",editable: false, filter: 'set',  width: 120,
             cellEditor:"下拉框",
             cellEditorParams: {
                values: []
             },
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
         },
		{
             headerName: "订单类型", field: "sale_order_type",editable: false, filter: 'set',  width: 120,
             cellEditor:"下拉框",
             cellEditorParams: {
                values: []
             },
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
         },{
            headerName: "产品部", field: "item_kind",editable: false, filter: 'set',  width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{
                    value: 1,
                    desc: "空调组织"
                }]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "产品大类名称", field: "item_type_name",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "版本号", field: "version",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "业务部门", field: "org_name",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "预计出货日期", field: "pre_ship_date",editable: false, filter: 'set',  width: 110,
            cellEditor:"年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "最迟出货日期", field: "latest_ship_date",editable: false, filter: 'set',  width: 120,
            cellEditor:"年月日",
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
             headerName: "特批理由", field: "lead_note",editable: false, filter: 'set',  width: 100,
             cellEditor:"文本框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
         },
		 {
            headerName: "是否客户PO号", field: "have_custpo",editable: false, filter: 'set',  width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [
                {
                    value: 1,
                    desc: "有"
                },
               {
                    value: 2,
                    desc: "无"
                }
                ]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "是否整机下单", field: "is_item_order",editable: false, filter: 'set',  width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [
                {
                    value: 2,
                    desc: "整机下单"
                },
               {
                    value: 1,
                    desc: "裸机下单"
                }
                ]
            },
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
    .controller('sale_prod_m_header',sale_prod_m_header);

