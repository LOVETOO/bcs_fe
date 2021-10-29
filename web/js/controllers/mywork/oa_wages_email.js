function oa_wages_email($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
	//设置当前对象名及主键名
	$scope.objconf = {
		classid: "oa_wages_email", //表名类名
		key: "wages_id", //主键
		nextStat: "oa_wages_email_line", //详情页菜单stat
		classids: "oa_wages_emails", //后台返回的列表名
		sqlBlock: "1=1", //初始条件
		thead: [], //固定为空
		grids: [{
			optionname: 'viewOptions',
			idname: 'contains'
		}] //网格的option列表
	};

	//设置标题
	$scope.headername = "批量发送工资条";
	//从基类：ctrl_view_public 继承
	oa_wages_email = HczyCommon.extend(oa_wages_email, ctrl_view_public);
	oa_wages_email.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
		$timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService
	]);

	//定义网格字段
	$scope.viewColumns = [{
			headerName: "序号", //标题
			field: "wages_id", //字段名
			editable: false, //是否可编辑
			width: 70, //宽度
			cellEditor: "整数框", //字段类型:"年月日"、"时分秒"、"下拉框"、"弹出框"、"文本框"、"整数框"、"浮点框"、"复选框"、"树状结构"、"选择框
			filter: 'number', //过滤类型 text, number, set, date
			valueGetter: function(params) {
				return parseInt(params.node.id) + 1;
			},
			enableRowGroup: true, //是否允许作为汇总条件
			enablePivot: true, //是否允许Toolpanel显示
			enableValue: true, //固定值
			floatCell: true //固定值
		}, {
			headerName: "创建人",
			field: "creator",
			editable: false,
			filter: 'text',
			width: 100,
			cellEditor: "文本框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "创建时间",
			field: "create_time",
			editable: false,
			filter: 'date',
			width: 100,
			cellEditor: "年月日",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "审核人",
			field: "checkor",
			editable: false,
			filter: 'text',
			width: 100,
			cellEditor: "文本框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "审核时间",
			field: "check_time",
			editable: false,
			filter: 'tate',
			width: 100,
			cellEditor: "年月日",
			enableRowGroup: false,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "状态",
			field: "stat",
			editable: false,
			filter: 'text',
			width: 100,
			cellEditor: "下拉框",
			cellEditorParams: {values: [{value: 1,desc: '未发送'}, {value: 2,desc: '已发送'}]},
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true,
			is_define: true
		}, {
			headerName: "年份",
			field: "year",
			editable: false,
			filter: 'text',
			width: 80,
			cellEditor: "文本框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		},
		{
			headerName: "月份",
			field: "month",
			editable: false,
			filter: 'text',
			width: 80,
			cellEditor: "文本框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		},
		{
			headerName: "备注",
			field: "note",
			editable: false,
			filter: 'text',
			width: 100,
			cellEditor: "文本框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}
	];

	//调用基类的初始化方法
	$scope.initData();

}

//注册控制器
angular.module('inspinia')
	.controller('oa_wages_email', oa_wages_email)