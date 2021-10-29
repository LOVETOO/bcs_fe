/**这是信息查询界面js*/
function oa_home_info($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
	//设置当前对象名及主键名
	$scope.objconf = {
		classid: "oa_home_info", //表名类名
		key: "info_id", //主键
		nextStat: "oa_home_info_attach", //详情页菜单stat
		classids: "oa_home_infos", //后台返回的列表名
		sqlBlock: "1=1", //初始条件
		thead: [], //固定为空
		grids: [{
			optionname: 'viewOptions',
			idname: 'contains'
		}] //网格的option列表
	};

	//设置标题
	$scope.headername = "信息发布首页";
	//从基类：ctrl_view_public 继承
	oa_home_info = HczyCommon.extend(oa_home_info, ctrl_view_public);
	oa_home_info.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
		$timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService
	]);

	//定义网格字段
	$scope.viewColumns = [{
		headerName: "序号", //标题
		field: "info_id", //字段名
		editable: false, //是否可编辑
		width: 70, //宽度
		cellEditor: "文本框", //字段类型:"年月日"、"时分秒"、"下拉框"、"弹出框"、"文本框"、"整数框"、"浮点框"、"复选框"、"树状结构"、"选择框
		filter: 'number', //过滤类型 text, number, set, date
		enableRowGroup: true, //是否允许作为汇总条件
		enablePivot: true, //是否允许Toolpanel显示
		enableValue: true, //固定值
		floatCell: true //固定值
	}, {
		headerName: "模块名",
		field: "info_mod",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "下拉框",
		cellEditorParams: {
			values: [{
				value: 1,
				desc: '新闻中心'
			}, {
				desc: '通知公告',
				value: 2
			}, {
				desc: '公司制度',
				value: 3
			}, {
				desc: '员工活动',
				value: 4
			}, {
				desc: '发展历程',
				value: 5
			}, {
				desc: '人才体系',
				value: 6
			}, {
				desc: '知识管理',
				value: 7
			}]
		},
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "分类",
		field: "info_type",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "下拉框",
		cellEditorParams: {
			values: [{
				value: 0,
				desc: ''
			}, {
				value: 1,
				desc: '人事新闻'
			}, {
				desc: '销售新闻',
				value: 2
			}, {
				desc: '项目新闻',
				value: 3
			}, {
				desc: '市场新闻',
				value: 4
			}, {
				desc: '产品动态',
				value: 5
			}]
		},
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "标题",
		field: "title",
		editable: false,
		filter: 'text',
		width: 180,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "创建人",
		field: "creator",
		editable: false,
		filter: 'text',
		width: 90,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "创建时间",
		field: "create_time",
		editable: false,
		filter: 'text',
		width: 150,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "过期日期",
		field: "expire_date",
		editable: false,
		filter: 'text',
		width: 150,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "状态",
		field: "stat",
		editable: false,
		filter: 'text',
		width: 90,
		cellEditor: "下拉框",
		cellEditorParams: {
			values: [{
				desc: '制单',
				value: 1
			}, {
				desc: '启动',
				value: 3
			}, {
				desc: '已审核',
				value: 5
			}, {
				desc: '作废',
				value: 99
			}]
		},
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true,
		is_define: true
	}, {
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
	}, ];

	//调用基类的初始化方法
	$scope.initData();

}

//注册控制器
angular.module('inspinia')
	.controller('oa_home_info', oa_home_info)