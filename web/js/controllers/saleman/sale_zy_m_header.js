var basemanControllers = angular.module('inspinia');
function sale_zy_m_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_pi_m_header",
        key: "pi_m_id",
        nextStat: "sale_zy_m_headerEdit",
        classids: "sale_pi_m_headers",
        postdata:{
            sqlwhere: "nvl(bill_flag,0)=2 and pi_m_no like 'ZY%'",
        },
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    $scope.headername="散件专用机型变更";
    sale_zy_m_header = HczyCommon.extend(sale_zy_m_header,ctrl_view_public);
    sale_zy_m_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
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
        },{
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
    .controller('sale_zy_m_header',sale_zy_m_header);

