function user_rzsq($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
	//设置当前对象名及主键名
	$scope.objconf = {
		classid: "user_rzsq", //表名类名
		key: "keyid", //主键
		nextStat: "user_rzsq_line", //详情页菜单stat
		classids: "user_rzsqs", //后台返回的列表名
		sqlBlock: "1=1", //初始条件
		thead: [], //固定为空
		grids: [{ optionname: 'viewOptions', idname: 'contains' }] //网格的option列表
	};

	//设置标题
	$scope.headername = "员工档案";
	//从基类：ctrl_view_public 继承
	user_rzsq = HczyCommon.extend(user_rzsq, ctrl_view_public);
	user_rzsq.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
		$timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService
	]);

	//定义网格字段
	$scope.viewColumns = [{
		headerName: "姓名", //标题
		field: "xm", //字段名
		editable: false, //是否可编辑
		width: 70, //宽度
		cellEditor: "文本框", //字段类型:"年月日"、"时分秒"、"下拉框"、"弹出框"、"文本框"、"整数框"、"浮点框"、"复选框"、"树状结构"、"选择框
		filter: 'text', //过滤类型 text, number, set, date
		enableRowGroup: true, //是否允许作为汇总条件
		enablePivot: true, //是否允许Toolpanel显示
		enableValue: true, //固定值
		floatCell: true //固定值
	},{
		headerName: "员工状态",
		field: "ygzt",
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
		field: "xb",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "婚姻状况",
		field: "hyzk",
		editable: false,
		filter: 'text',
		width: 70,
		cellEditor: "文本框",		
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "出生日期",
		field: "csrq",
		editable: false,
		filter: 'text',
		width: 110,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "籍贯",
		field: "jg",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "民族",
		field: "mz",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "政治面貌",
		field: "zzmm",
		editable: false,
		filter: 'text',
		width: 120,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "健康状况",
		field: "jkzk",
		editable: false,
		filter: 'text',
		width: 120,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "学历",
		field: "xl",
		editable: false,
		filter: 'set',
		width: 120,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "毕业院校",
		field: "byyx",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "专业",
		field: "zy",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "入职公司",
		field: "rzgs",
		editable: false,
		filter: 'text',
		width: 120,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "入职部门",
		field: "rzbm",
		editable: false,
		filter: 'set',
		width: 120,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "入职日期",
		field: "rzrq",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "职位",
		field: "zw",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "电话",
		field: "dh",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "QQ号",
		field: "qqh",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "邮箱",
		field: "yx",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "合同到期日期",
		field: "dqrq",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "身份证号",
		field: "sfzh",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "户口性质",
		field: "hkxz",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "联系人",
		field: "lxr",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "联系人关系",
		field: "lxrgx",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "联系人电话",
		field: "lxdh",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "户籍地址",
		field: "hjdz",
		editable: false,
		filter: 'text',
		width: 120,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "开户银行",
		field: "khyh",
		editable: false,
		filter: 'text',
		width: 120,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "银行账号",
		field: "yhzh",
		editable: false,
		filter: 'text',
		width: 120,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "OA用户名",
		field: "oayhm",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "电脑水平",
		field: "dlsp",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "所获证书",
		field: "shzs",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "英语水平",
		field: "yysp",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "所获证书",
		field: "shzs2",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "个人特长",
		field: "tc",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "个人兴趣",
		field: "xq",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "离职日期",
		field: "lzrq",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
        headerName: "详情",
        field: "",
        editable: false,
        filter: 'set',
        width: 65,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        cellRenderer: "链接渲染"
    }];
	
	//调用基类的初始化方法
	$scope.initData();

}
//注册控制器
angular.module('inspinia')
	.controller('user_rzsq', user_rzsq);