function oa_employee_info($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
	//设置当前对象名及主键名
	$scope.objconf = {
		classid: "oa_employee_info", //表名类名
		key: "emp_id", //主键
		nextStat: "oa_employee_info_line", //详情页菜单stat
		classids: "oa_employee_infos", //后台返回的列表名
		sqlBlock: "1=1", //初始条件
		thead: [], //固定为空
		grids: [{ optionname: 'viewOptions', idname: 'contains' }] //网格的option列表
	};

	//设置标题
	$scope.headername = "员工档案";
	//从基类：ctrl_view_public 继承
	oa_employee_info = HczyCommon.extend(oa_employee_info, ctrl_view_public);
	oa_employee_info.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
		$timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService
	]);

	//定义网格字段
	$scope.viewColumns = [{
		headerName: "序号", //标题
		field: "emp_id", //字段名
		editable: false, //是否可编辑
		width: 70, //宽度
		cellEditor: "整数框", //字段类型:"年月日"、"时分秒"、"下拉框"、"弹出框"、"文本框"、"整数框"、"浮点框"、"复选框"、"树状结构"、"选择框
		filter: 'number', //过滤类型 text, number, set, date
		enableRowGroup: true, //是否允许作为汇总条件
		enablePivot: true, //是否允许Toolpanel显示
		enableValue: true, //固定值
		floatCell: true //固定值
	}, {
		headerName: "员工名字",
		field: "emp_name",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "性别",
		field: "sex",
		editable: false,
		filter: 'text',
		width: 70,
		cellEditor: "下拉框",
		cellEditorParams: { values: [{ value: 1, desc: '女' }, { value: 2, desc: '男' }] },
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "出生日期",
		field: "birth_day",
		editable: false,
		filter: 'text',
		width: 110,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "婚姻状况",
		field: "marital_status",
		editable: false,
		filter: 'set',
		width: 100,
		cellEditor: "下拉框",
		cellEditorParams: { values: [{ value: 1, desc: '未婚' }, { value: 2, desc: '已婚' }, { value: 3, desc: '离异' }] },
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "籍贯",
		field: "origo_name",
		editable: false,
		filter: 'set',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "户口所在地",
		field: "domicile_name",
		editable: false,
		filter: 'set',
		width: 120,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "家庭住址",
		field: "address_name",
		editable: false,
		filter: 'set',
		width: 120,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "学历",
		field: "education",
		editable: false,
		filter: 'set',
		width: 100,
		cellEditor: "下拉框",
		cellEditorParams: { values: [{ value: 1, desc: '初中' }, { value: 2, desc: '高中' }, { value: 3, desc: '中专' }, { value: 4, desc: '大专' }, { value: 5, desc: '本科' }, { value: 6, desc: '硕士' }, { value: 7, desc: '博士' }] },
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "毕业院校",
		field: "graduated_from",
		editable: false,
		filter: 'set',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "毕业时间",
		field: "graduation_time",
		editable: false,
		filter: 'set',
		width: 120,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "入职日期",
		field: "hire_date",
		editable: false,
		filter: 'set',
		width: 120,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "所属部门",
		field: "org_name",
		editable: false,
		filter: 'set',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "职务",
		field: "duties",
		editable: false,
		filter: 'set',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "合同起始日期",
		field: "validity_date",
		editable: false,
		filter: 'set',
		width: 120,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "合同到期日期",
		field: "expiration_date",
		editable: false,
		filter: 'set',
		width: 120,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "在职状态",
		field: "status",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "下拉框",
		cellEditorParams: { values: [{ value: 1, desc: '在职' }, { value: 2, desc: '离职' }] },
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, ];

	//调用基类的初始化方法
	$scope.initData();

}
//注册控制器
angular.module('inspinia')
	.controller('oa_employee_info', oa_employee_info);