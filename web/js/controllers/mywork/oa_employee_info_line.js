/**这是信息编辑界面js*/
function oa_employee_info_line($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
	oa_employee_info_line = HczyCommon.extend(oa_employee_info_line, ctrl_bill_public);
	oa_employee_info_line.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

	$scope.objconf = {
		name: "oa_employee_info",
		key: "emp_id",
		wftempid: 10164,
		FrmInfo: {},
		grids: [{
			optionname: 'opt_itemline',
			idname: 'oa_employee_info_linesofoa_employee_infos'
		}]
	};
	/******************界面初始化****************************/
	$scope.clearinformation = function() {
		$scope.searchlist = false;
		$scope.data = {};
		$scope.data.currItem = {
			creator: userbean.userid,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			usable: 2,
			oa_employee_info_linesofoa_employee_infos: []
		};
	};

	//获取学历系统词汇
	BasemanService.RequestPost("base_search", "searchdict", {
		dictcode: "education"
	}).then(function(data) {
		var educations = [];
		for(var i = 0; i < data.dicts.length; i++) {
			object = {};
			object.value = data.dicts[i].dictvalue;
			object.desc = data.dicts[i].dictname;
			educations.push(object);
		}
		$scope.educations = educations;
	});

	//获取员工职级词汇
	BasemanService.RequestPost("base_search", "searchdict", {
		dictcode: "ranks"
	}).then(function(data) {
		var rankss = [];
		for(var i = 0; i < data.dicts.length; i++) {
			object = {};
			object.value = data.dicts[i].dictvalue;
			object.desc = data.dicts[i].dictname;
			rankss.push(object);
		}
		$scope.rankss = rankss;
	});

	//获取员工在职状态词汇
	BasemanService.RequestPost("base_search", "searchdict", {
		dictcode: "status"
	}).then(function(data) {
		var statuss = [];
		for(var i = 0; i < data.dicts.length; i++) {
			object = {};
			object.value = data.dicts[i].dictvalue;
			object.desc = data.dicts[i].dictname;
			statuss.push(object);
		}
		$scope.statuss = statuss;
	});

	//获取员工离职类型词汇
	BasemanService.RequestPost("base_search", "searchdict", {
		dictcode: "leave_type"
	}).then(function(data) {
		var leave_types = [];
		for(var i = 0; i < data.dicts.length; i++) {
			object = {};
			object.value = data.dicts[i].dictvalue;
			object.desc = data.dicts[i].dictname;
			leave_types.push(object);
		}
		$scope.leave_types = leave_types;
	});

	//获取调整类型
	BasemanService.RequestPost("base_search", "searchdict", {
		dictcode: "adj_type"
	}).then(function(data) {
		var adj_types = [];
		for(var i = 0; i < data.dicts.length; i++) {
			object = {};
			object.value = data.dicts[i].dictvalue;
			object.desc = data.dicts[i].dictname;
			adj_types.push(object);
		}
		$scope.adj_types = adj_types;
	});

	//清空系统用户
	$scope.empty_user_id = function() {
		$scope.data.currItem.userid = '';
	};

	//清空籍贯
	$scope.empty_origo = function() {
		$scope.data.currItem.origo_id = 0;
		$scope.data.currItem.origo_name = ' ';
	};

	//清空户口所在地
	$scope.empty_domicile = function() {
		$scope.data.currItem.domicile_id = 0;
		$scope.data.currItem.domicile_name = '';
	};

	//清空家庭住址
	$scope.empty_address = function() {
		$scope.data.currItem.address_id = 0;
		$scope.data.currItem.address_name = '';
	};

	//清空部门
	$scope.empty_org_name = function() {
		$scope.data.currItem.org_id = 0;
		$scope.data.currItem.org_name = '';
	};
	//清空直属上级
	$scope.empty_report_toname = function() {
		$scope.data.currItem.report_to = 0;
		$scope.data.currItem.report_toname = '';
	}
	//系统用户
	$scope.user_id = function() {
		$scope.FrmInfo = {
			classid: "scpuser",
			backdatas: "users",
			sqlBlock: " 1=1  "
		};

		BasemanService.open(CommonPopController, $scope).result.then(function(data) {
			$scope.data.currItem.userid = data.userid;
			$scope.data.currItem.username = "";
			$scope.data.currItem.cust_code = "";
			$scope.data.currItem.cust_name = "";
		});
	};

	//查询户口所在地
	$scope.domicile_name = function() {
		$scope.FrmInfo = {
			classid: "scparea",
			backdatas: "scpareas",
			sqlBlock: " 1=1  "
		};

		BasemanService.open(CommonPopController, $scope).result.then(function(data) {
			$scope.data.currItem.domicile_id = data.areaid;
			$scope.data.currItem.domicile_name = data.note;
			$scope.data.currItem.province_id = data.areaid4;
			$scope.data.currItem.city_id = data.areaid5;
			$scope.data.currItem.county_id = data.areaid6;
			$scope.data.currItem.xz_area_id = data.areaid7;
		});
	};

	//籍贯
	$scope.origo_name = function() {
		$scope.FrmInfo = {
			classid: "scparea",
			backdatas: "scpareas",
			sqlBlock: " 1=1  "
		};

		BasemanService.open(CommonPopController, $scope).result.then(function(data) {
			$scope.data.currItem.origo_id = data.areaid;
			$scope.data.currItem.origo_name = data.note;
			$scope.data.currItem.province_id = data.areaid4;
			$scope.data.currItem.city_id = data.areaid5;
			$scope.data.currItem.county_id = data.areaid6;
			$scope.data.currItem.xz_area_id = data.areaid7;
		});
	};

	//家庭住址
	$scope.address_name = function() {
		$scope.FrmInfo = {
			classid: "scparea",
			backdatas: "scpareas",
			sqlBlock: " 1=1  "
		};

		BasemanService.open(CommonPopController, $scope).result.then(function(data) {
			$scope.data.currItem.address_id = data.areaid;
			$scope.data.currItem.address_name = data.note;
			$scope.data.currItem.province_id = data.areaid4;
			$scope.data.currItem.city_id = data.areaid5;
			$scope.data.currItem.county_id = data.areaid6;
			$scope.data.currItem.xz_area_id = data.areaid7;
		});
	};

	//部门
	$scope.org_name = function() {
		$scope.FrmInfo = {
			classid: "scporg",
			backdatas: "orgs",
			sqlBlock: " 1=1  "
		};

		BasemanService.open(CommonPopController, $scope).result.then(function(data) {
			$scope.data.currItem.orgid = data.orgid;
			$scope.data.currItem.org_name = data.orgname;

			$scope.data.currItem.cust_id = 0;
			$scope.data.currItem.cust_code = "";
			$scope.data.currItem.cust_name = "";

			$scope.clearItem();
		});
	};

	//直属上级
	$scope.report_toname = function() {
		$scope.FrmInfo = {
			classid: "scpuser",
			backdatas: "users",
			sqlBlock: " 1=1  "
		};

		BasemanService.open(CommonPopController, $scope).result.then(function(data) {
			$scope.data.currItem.report_to = data.userid;
			$scope.data.currItem.report_toname = data.username;
			$scope.data.currItem.cust_code = "";
			$scope.data.currItem.cust_name = "";
		});
	}

	$scope.sex = [{
			desc: '女',
			value: 1
		},
		{
			desc: '男',
			value: 2
		}
	];

	$scope.marital_status = [{
			desc: '未婚',
			value: 1
		},
		{
			desc: '已婚',
			value: 2
		},
		{
			desc: '离异',
			value: 3
		}
	];

	$scope.user_photo = function() {
		$("#dropzone").click();
	}

	//将头像上传到服务器
	$timeout(function() {
		var tpl = $("<div id='preview-template' style='display: none;'><div></div></div>");
		$("#dropzone").dropzone({
			url: '/web/scp/filesuploadsave2.do',
			maxFilesize: 500,
			paramName: "docFile0",
			fallback: function() {
				BasemanService.notice("浏览器版本太低,文件上传功能将不可用！", "alert-warning");
			},
			addRemoveLinks: true,
			params: {
				scpsession: window.strLoginGuid,
				sessionid: window.strLoginGuid
			},
			previewTemplate: tpl.prop("outerHTML"),
			maxThumbnailFilesize: 5,
			//uploadMultiple:true,
			init: function() {
				this.on('addedfile', function(file) {
					//var l=0;
				})
				this.on('success', function(file, json) {
					try {
						$scope.data.photo = strToJson(json).data[0];
						//将docid保存到数据库中
						$scope.data.currItem.avatar_docid = $scope.data.photo.docid;
						$scope.$apply();
					} catch(e) {
						BasemanService.notice("上传数据异常!", "alert-warning");
					}
				})
				this.on("error", function() {
					BasemanService.notice("上传失败!", "alert-warning");
				})
			}
		});
	})

	//保存时校验
	$scope.validate = function() {
		//全不能为空..
		var checklist = [{
				key: 'emp_name',
				desc: '名字'
			},
			{
				key: 'sex',
				desc: '性别'
			},
			{
				key: 'birth_day',
				desc: '出生日期'
			},
			{
				key: 'idcard',
				desc: '身份证号码'
			},
			{
				key: 'marital_status',
				desc: '婚姻状况'
			},
			{
				key: 'education',
				desc: '学历'
			},
			{
				key: 'graduated_from',
				desc: '毕业院校'
			},
			{
				key: 'graduation_time',
				desc: '毕业时间'
			},
			{
				key: 'hire_date',
				desc: '入职日期'
			},
			{
				key: 'org_name',
				desc: '所属部门'
			},
			{
				key: 'duties',
				desc: '职务'
			},
			{
				key: 'ranks',
				desc: '职级'
			},
			{
				key: 'validity_date',
				desc: '合同起始日期'
			},
			{
				key: 'expiration_date',
				desc: '合同到期日期'
			},
			{
				key: 'status',
				desc: '在职状态'
			},
			{
				key: 'report_toname',
				desc: '直属上级'
			}
		];
		var item = $scope.data.currItem;
		for(var i = 0; i < checklist.length; i++) {
			var value = checklist[i]
			if(item[value.key] == 0 || item[value.key] == '' || item[value.key] == undefined) {
				BasemanService.notice(value.desc + '为空，请输入！', "alert-warning");
				return;
			}
		}

		//判断员工在职状况,如果是离职还需填写内容
		if($scope.data.currItem.status == 2) {
			var leave = [{
					key: 'leave_date',
					desc: '离职日期'
				},
				{
					key: 'leave_type',
					desc: '离职类型'
				},
				{
					key: 'leave_reason',
					desc: '离职类型'
				}
			];
			var item = $scope.data.currItem;
			for(var i = 0; i < leave.length; i++) {
				var value = leave[i]
				if(item[value.key] == 0 || item[value.key] == '' || item[value.key] == undefined) {
					BasemanService.notice(value.desc + '为空，请输入！', "alert-warning");
					return;
				}
			}
		}

		//判断身份证是否正确
		var ID = $scope.data.currItem.idcard;
		if(typeof ID !== 'string') {
			BasemanService.notice('身份证输入有误！', "alert-warning");
			return;
		}
		var city = {
			11: "北京",
			12: "天津",
			13: "河北",
			14: "山西",
			15: "内蒙古",
			21: "辽宁",
			22: "吉林",
			23: "黑龙江 ",
			31: "上海",
			32: "江苏",
			33: "浙江",
			34: "安徽",
			35: "福建",
			36: "江西",
			37: "山东",
			41: "河南",
			42: "湖北 ",
			43: "湖南",
			44: "广东",
			45: "广西",
			46: "海南",
			50: "重庆",
			51: "四川",
			52: "贵州",
			53: "云南",
			54: "西藏 ",
			61: "陕西",
			62: "甘肃",
			63: "青海",
			64: "宁夏",
			65: "新疆",
			71: "台湾",
			81: "香港",
			82: "澳门",
			91: "国外"
		};
		var birthday = ID.substr(6, 4) + '/' + Number(ID.substr(10, 2)) + '/' + Number(ID.substr(12, 2));
		var d = new Date(birthday);
		var newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate());
		var currentTime = new Date().getTime();
		var time = d.getTime();
		var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
		var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
		var sum = 0,
			i, residue;
		//if(!/^\d{17}(\d|x)$/i.test(ID)) return '非法身份证';
		if(!/^\d{17}(\d|x)$/i.test(ID)) {
			BasemanService.notice('身份证输入有误！', "alert-warning");
			return;
		}
		//if(city[ID.substr(0,2)] === undefined) return "非法地区";
		if(city[ID.substr(0, 2)] === undefined) {
			BasemanService.notice('身份证输入有误！', "alert-warning");
			return;
		}
		//if(time >= currentTime || birthday !== newBirthday) return '非法生日';
		if(time >= currentTime || birthday !== newBirthday) {
			BasemanService.notice('身份证输入有误！', "alert-warning");
			return;
		}
		for(i = 0; i < 17; i++) {
			sum += ID.substr(i, 1) * arrInt[i];
		}
		residue = arrCh[sum % 11];
		//if (residue !== ID.substr(17, 1)) return '非法身份证哦';
		if(residue !== ID.substr(17, 1)) {
			BasemanService.notice('身份证输入有误！', "alert-warning");
			return;
		}

		//保存时校检网格区的数据,起始日期,所在部门,职务,调整类型不能为空!
		var msg = [];
		var lines = $scope.gridGetData('opt_itemline');
		for(var i = 0; i < lines.length; i++) {
			var value = lines[i];
			var start_date = value.start_date;
			var org_name = value.org_name;
			var duties = value.duties;
			var adj_type = value.adj_type;

			if(start_date == '' || start_date == 0 || start_date == undefined) {
				msg.push('明细第' + (i + 1) + '行起始日期不能为空，请修改！');
			}
			if(org_name == '' || org_name == 0 || org_name == undefined) {
				msg.push('明细第' + (i + 1) + '行所在部门不能为空，请修改！');
			}
			if(duties == '' || duties == 0 || duties == undefined) {
				msg.push('明细第' + (i + 1) + '行职务不能为空，请修改！');
			}
			if(adj_type == '' || adj_type == 0 || adj_type == undefined) {
				msg.push('明细第' + (i + 1) + '行调整类型不能为空，请修改！');
			}
		}

		if(msg.length > 0) {
			BasemanService.notice(msg, "alert-warning");
			return;
		}

		return true;
	}

	//查询用户
	$scope.searchuser = function() {
		$scope.FrmInfo = {
			classid: "oa_employee_info", //请求类
			backdatas: "oa_home_infos",
			sqlBlock: "1=1"
		};

		BasemanService.open(CommonPopController, $scope).result.then(function(data) {
			$scope.data.currItem.sysuserid = data.sysuserid;
			$scope.data.currItem.username = data.username;
			$scope.clearItem();
		});
	}

	//新增
	$scope.addItem = function() {
		$scope.gridAddItem('opt_itemline', {});
	}

	//删除行
	$scope.delItem = function() {
		$scope.gridDelItem('opt_itemline');
	}

	//清空网格
	$scope.clearItem = function() {
		$scope.data.currItem.oa_employee_info_linesofoa_employee_infos = [];
		$scope.data.currItem.total_qty = 0;
		$scope.data.currItem.total_amount = 0;
		$scope.opt_itemline.api.setRowData($scope.data.currItem.oa_employee_info_linesofoa_employee_infos);

	}

	//明细网格
	$scope.opt_itemline = {
		rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
		pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
		groupKeys: undefined,
		groupHideGroupColumns: false,
		enableColResize: true, //one of [true, false]
		enableSorting: true, //one of [true, false]
		enableFilter: true, //one of [true, false]
		enableStatusBar: false,
		fixedGridHeight: true,
		enableRangeSelection: false,
		rowSelection: "single", // one of ['single','multiple'], leave blank for no selection
		rowDeselection: false,
		quickFilterText: null,
		groupSelectsChildren: false, // one of [true, false]
		suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
		showToolPanel: false,
		icons: {
			columnRemoveFromGroup: '<i class="fa fa-remove"/>',
			filter: '<i class="fa fa-filter"/>',
			sortAscending: '<i class="fa fa-long-arrow-down"/>',
			sortDescending: '<i class="fa fa-long-arrow-up"/>',
		}
	};

	//网格部门
	$scope.orgname = function() {
		$scope.FrmInfo = {
			classid: "scporg",
			backdatas: "orgs",
			sqlBlock: " 1=1  "
		};

		BasemanService.open(CommonPopController, $scope).result.then(function(res) {
			var data = $scope.gridGetRow("opt_itemline");
			data.org_id = res.orgid;
			data.org_name = res.orgname;
			$scope.gridUpdateRow("opt_itemline", data);
		});
	}

	//初始化网格的职级下拉选系统词汇
	BasemanService.RequestPost("base_search", "searchdict", {
		dictcode: "ranks"
	}).then(function(data) {
		for(var i = 0; i < data.dicts.length; i++) {
			var newobj = {
				value: data.dicts[i].dictvalue,
				desc: data.dicts[i].dictname
			}
			$scope.reseau[5].cellEditorParams.values.push(newobj);
		}
	});

	//初始化网格调整类型下拉选系统词汇
	BasemanService.RequestPost("base_search", "searchdict", {
		dictcode: "adj_type"
	}).then(function(data) {
		for(var i = 0; i < data.dicts.length; i++) {
			var newobj = {
				value: data.dicts[i].dictvalue,
				desc: data.dicts[i].dictname
			}
			$scope.reseau[6].cellEditorParams.values.push(newobj);
		}
	});

	$scope.reseau = [{
		headerName: "序号", //标题
		field: "seq", //字段名
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
		headerName: "起始日期",
		field: "start_date",
		editable: true,
		filter: 'date',
		width: 120,
		cellEditor: "年月日",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "终止日期",
		field: "ent_date",
		editable: true,
		filter: 'date',
		width: 120,
		cellEditor: "年月日",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "所在部门",
		field: "org_name",
		editable: true,
		filter: 'text',
		width: 100,
		cellEditor: "弹出框",
		action: $scope.orgname,
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "职务",
		field: "duties",
		editable: true,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: false,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "职级",
		field: "ranks",
		editable: true,
		filter: 'text',
		width: 100,
		cellEditor: "下拉框",
		cellEditorParams: {
			values: []
		},
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "调整类型",
		field: "adj_type",
		editable: true,
		filter: 'text',
		width: 100,
		cellEditor: "下拉框",
		cellEditorParams: {
			values: []
		},
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "说明",
		field: "note",
		editable: true,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, ];
	$scope.initdata();

}

//注册控制器
angular.module('inspinia').controller('oa_employee_info_line', oa_employee_info_line);