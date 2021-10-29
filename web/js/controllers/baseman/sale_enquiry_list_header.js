var basemanControllers = angular.module('inspinia');

function sale_enquiry_list_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
	
  //设置当前对象名及主键名
  $scope.objconf = {
        classid: "sale_enquiry_list_header",
        key: "enquirylist_id",
        nextStat: "sale_enquiry_list_headerEdit",
        classids: "sale_enquiry_list_headers",
		sqlBlock:"stat!=99",
		grids:[{optionname:'viewOptions', idname:'contains'}]
    }
  $scope.headername="海运费约价";
  
  //$scope.contain=$scope.objconf.classids;
    sale_enquiry_list_header = HczyCommon.extend(sale_enquiry_list_header,ctrl_view_public);
    sale_enquiry_list_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

/**----网格列区域  ----------*/ 
$scope.viewColumns = [       
    {
        headerName: "询价单编码", field: "enquirylist_no",editable: false, filter: 'set',  width: 100,
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
    .controller('sale_enquiry_list_header',sale_enquiry_list_header)
