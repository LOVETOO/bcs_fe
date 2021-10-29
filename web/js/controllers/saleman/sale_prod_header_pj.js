var salemanControllers = angular.module('inspinia');
function sale_prod_header_pj($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_prod_header",
        key: "prod_id",
        nextStat: "sale_prod_header_pjEdit",
        classids: "sale_prod_headers",
        postdata:{
          sqlwhere:"1=1 and  stat = 5  and nvl(package_over,0) <> 2",
          flag:10
        },
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };
    $scope.headername="配件打包";
    $scope.hide="true";
    sale_prod_header_pj = HczyCommon.extend(sale_prod_header_pj,ctrl_view_public);
    sale_prod_header_pj.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    //新增控制
    $scope.new = function () {
        if ($scope.objconf.nextStat) {
            BasemanService.notice("配件打包不能新增", "alert-warning");
            return;
        }
    };
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
	//贸易类型
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "sale_ent_type"})
    .then(function (data) {
		for(var i=0;i<data.dicts.length;i++){
			var object={};
			object.value=data.dicts[i].dictvalue;
			object.desc=data.dicts[i].dictname;
			$scope.viewColumns[12].cellEditorParams.values.push(object);
		}
    });
	//订单类型
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "sale_order_type"})
    .then(function (data) {
		for(var i=0;i<data.dicts.length;i++){
			var object={};
			object.value=data.dicts[i].dictvalue;
			object.desc=data.dicts[i].dictname;
			$scope.viewColumns[13].cellEditorParams.values.push(object);
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
        },{
            headerName: "商检批号", field: "inspection_batchno",editable: false, filter: 'set',  width: 100,
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
            headerName: "形式发票号", field: "pi_no",editable: false, filter: 'set',  width: 100,
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
            headerName: "货币名称", field: "currency_name",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "付款类型名称", field: "payment_type_name",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "价格条款名称", field: "price_type_name",editable: false, filter: 'set',  width: 120,
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
             headerName: "此次排产总套数", field: "total_prod_qty",editable: false, filter: 'set',  width: 130,
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
            headerName: "客户编码", field: "cust_code",editable: false, filter: 'set',  width: 100,
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
         },{
            headerName: "PDM编制BOM状态", field: "pdm_bom_stat",editable: false, filter: 'set',  width: 150,
            cellEditor:"下拉框",
            cellEditorParams:{values:[
              {value:1,desc:"制单"}, {value:3,desc:"已启动"}, {value:5,desc:"已归档"}
            ]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "bom编制完成时间", field: "pdm_bom_date",editable: false, filter: 'set',  width: 150,
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
             headerName: "是否承诺15天回定金", field: "is_cndk",editable: false, filter: 'set',  width: 160,
             cellEditor:"复选框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
         }
         ,{
            headerName: "需商检", field: "comminspec_stat",editable: false, filter: 'set',  width: 85,
             cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "是否客户PO号", field: "have_custpo",editable: false, filter: 'set',  width: 120,
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
            headerName: "是否整机下单", field: "is_item_order",editable: false, filter: 'set',  width: 130,
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
            headerName: "品牌名", field: "brand_name",editable: false, filter: 'set',  width: 85,
             cellEditor: "文本框",
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
salemanControllers
    .controller('sale_prod_header_pj',sale_prod_header_pj);

