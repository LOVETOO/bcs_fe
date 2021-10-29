function ctrl_oa_attrecord($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
	ctrl_oa_attrecord = HczyCommon.extend(ctrl_oa_attrecord, ctrl_bill_public);
	ctrl_oa_attrecord.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

	$scope.objconf = {
		name: "oa_attrecord",
		key: "attr_id",
		wftempid: 0,
		FrmInfo: {},
		//oa_attrecord_11:上下班打卡日统计
		//oa_attrecord_12:上下班打卡月统计
		//oa_attrecord_21:外出打卡日统计
		//oa_attrecord_22:外出打卡月统计
		grids: [{
				optionname: 'oa_attrecord_11',
				idname: 'reseau_11'
			},
			{
				optionname: 'oa_attrecord_12',
				idname: 'reseau_12'
			}
		]
	};
	//初始化
	$scope.clearinformation = function() {
		$scope.searchlist = false;
		$scope.data = {};
		$scope.data.currItem = {
			creator: userbean.userid,
			start_time_day: moment().format('YYYY-MM-DD'),
			finish_time_day: moment().format('YYYY-MM-DD'),
			start_time_mody: moment().format('YYYY-MM'),
			finish_time_mody: moment().format('YYYY-MM'),
			reseau_11: [],
			reseau_12: []
		};
	};

	function getDateyearmonth(dt) {
		return(dt.getFullYear() + '-' + (dt.getMonth()));
	}

	function getDatetime(dt) {
		return(dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate());
	}

	//默认是上下班
	$scope.idx = 1;
	$scope.interior_andex = 1;
	//上下班
	$scope.on_interior = function(index) {
		$scope.interior_andex = index;
		setTimeout(function() {
			$('#grid1').height($("#row_div").height() - $("#maintabs").height() - 100);
		}, 200);
		window.onresize = function() {
			setTimeout(function() {
				$('#grid1').height($("#row_div").height() - $("#maintabs").height() - 100);
			}, 200);
		}

	}

	$scope.changing_over = function(idx) {
		$scope.idx = idx;
	}

	$scope.search = function() {
		$scope.gridSetData("oa_attrecord_11", "")
		var checklist = [{
			key: 'start_time_day',
			desc: '开始时间'
		}, {
			key: 'finish_time_day',
			desc: '结束时间'
		}];
		var item = $scope.data.currItem;
		for(var i = 0; i < checklist.length; i++) {
			var value = checklist[i]
			if(item[value.key] == 0 || item[value.key] == '' || item[value.key] == undefined) {
				BasemanService.notice(value.desc + '为空，请输入！', "alert-warning");
				return;
			}
		}
		//按日
		var param = {
			s_date: $scope.data.currItem.start_time_day,
			e_date: $scope.data.currItem.finish_time_day,
			username: $scope.data.currItem.name
		};
		BasemanService.RequestPost("oa_checkin_data_r", "getstatistics", param).then(function(data) {
			$scope.gridSetData("oa_attrecord_11", data.daily_statistics);
		}, function(error) {
			$scope.gridSetData("oa_attrecord_11", "");
		});
	}

	$scope.search_mody = function() {
		$scope.gridSetData("oa_attrecord_12", "")
		var checklist = [{
			key: 'start_time_mody',
			desc: '开始月份'
		}, {
			key: 'finish_time_mody',
			desc: '结束月份'
		}];
		var item = $scope.data.currItem;
		for(var i = 0; i < checklist.length; i++) {
			var value = checklist[i]
			if(item[value.key] == 0 || item[value.key] == '' || item[value.key] == undefined) {
				BasemanService.notice(value.desc + '为空，请输入！', "alert-warning");
				return;
			}
		}
		var param = {
			s_date: $scope.data.currItem.start_time_mody,
			e_date: $scope.data.currItem.finish_time_mody,
			username: $scope.data.currItem.name1
		};
		BasemanService.RequestPost("oa_checkin_data_r", "getmonthstatistics", param).then(function(data) {
			$scope.gridSetData("oa_attrecord_12", data.month_statistics);
		}, function(error) {
			$scope.gridSetData("oa_attrecord_12", "");
		});
	}
	//导入日报数据
	$scope.on_leading = function() {
		BasemanService.openFrm("views/mywork/leading_attrecord.html", leading_attrecord, $scope, "", "", false).result.then(function(data) {

		})
	}
	//导入明细
	$scope.on_detail = function() {
		BasemanService.openFrm("views/mywork/leading_deteil.html", leading_deteil, $scope, "", "", false).result.then(function(data) {

		})
	}
	var leading_deteil = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		leading_deteil = HczyCommon.extend(leading_deteil, ctrl_bill_public);
		leading_deteil.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
		$scope.objconf = {
			name: "myfiles",
			key: "fileid",
			FrmInfo: {},
			grids: []
		};
		$scope.data = {};
		$scope.data.currItem = {
			creator: userbean.userid,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss')
		};

		$scope.title = "导入考勤明细";

		$scope.ok = function() {
			var lines = $scope.gridGetData('oa_attrecord_2');
			var msg = [];
			if(!lines.length) {
				BasemanService.notice('明细不能为空!', "alert-warning");
				return;
			}
			for(var i = 0; i < lines.length; i++) {
				//删除空对象
				if($.isEmptyObject(lines[i])) {
					lines.remove(lines[i]);
					i--;
					continue;
				}
				var value = lines[i];
				var check_day = value.check_day;
				var org_name = value.org_name;
				var username = value.username;
				if(check_day == '' || check_day == 0 || check_day == undefined) {
					BasemanService.notice('明细日期不能为空，请修改！', "alert-warning");
					return;
				}

				if(username == '' || username == 0 || username == undefined) {
					BasemanService.notice('明细名字不能为空，请修改！', "alert-warning");
					return;
				}
				if(org_name == '' || org_name == 0 || org_name == undefined) {
					BasemanService.notice('部门不能为空，请修改！', "alert-warning");
					return;
				}
			}

			BasemanService.RequestPost("oa_checkin_data_r", "import_deteil", {
				oa_checkin_data_r_deteil: lines
			}).then(function(data) {
				$modalInstance.close(data);
			}, function(e) {

			});
		}
		Array.prototype.indexOf = function(val) {
			for(var i = 0; i < this.length; i++) {
				if(this[i] == val) return i;
			}
			return -1;
		};
		Array.prototype.remove = function(val) {
			var index = this.indexOf(val);
			if(index > -1) {
				this.splice(index, 1);
			}
		};
		//删除行
		$scope.delItem = function() {
			$scope.gridDelItem('oa_attrecord_2');
		}
		$scope.cancel = function(e) {
			$modalInstance.dismiss('cancel');
		}
		$scope.oa_attrecord_2 = {
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
		$scope.reseau_2 = [{
				headerName: "序号", //标题
				field: "r_id", //字段名
				editable: false, //是否可编辑
				width: 60, //宽度
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
				headerName: "日期",
				field: "check_day",
				editable: true,
				filter: 'date',
				width: 100,
				cellEditor: "年月日",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			},
			{
				headerName: "帐号",
				field: "userid",
				editable: true,
				filter: 'string',
				width: 100,
				cellEditor: "text",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "姓名",
				field: "username",
				editable: true,
				filter: 'string',
				width: 100,
				cellEditor: "text",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "部门",
				field: "org_name",
				editable: true,
				filter: 'text',
				width: 240,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "打卡地点",
				field: "on_site",
				editable: true,
				filter: 'text',
				width: 350,
				cellEditor: "文本框",
				enableRowGroup: false,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}
		];
	}
	var leading_attrecord = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		leading_attrecord = HczyCommon.extend(leading_attrecord, ctrl_bill_public);
		leading_attrecord.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
		$scope.objconf = {
			name: "myfiles",
			key: "fileid",
			FrmInfo: {},
			grids: []
		};
		$scope.data = {};
		$scope.data.currItem = {
			creator: userbean.userid,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss')
		};

		$scope.title = "导入考勤日报";

		$scope.ok = function() {
			var lines = $scope.gridGetData('oa_attrecord_1');
			var msg = [];
			if(!lines.length) {
				BasemanService.notice('明细不能为空!', "alert-warning");
				return;
			}
			for(var i = 0; i < lines.length; i++) {
				//删除空对象
				if($.isEmptyObject(lines[i])) {
					lines.remove(lines[i]);
					i--;
					continue;
				}
				var value = lines[i];
				var check_day = value.check_day;
				var org_name = value.org_name;
				var username = value.username;
				if(check_day == '' || check_day == 0 || check_day == undefined) {
					BasemanService.notice('明细日期不能为空，请修改！', "alert-warning");
					return;
				}

				if(username == '' || username == 0 || username == undefined) {
					BasemanService.notice('明细名字不能为空，请修改！', "alert-warning");
					return;
				}
				if(org_name == '' || org_name == 0 || org_name == undefined) {
					BasemanService.notice('部门不能为空，请修改！', "alert-warning");
					return;
				}
			}
			BasemanService.RequestPost("oa_checkin_data_r", "import", {
				oa_checkin_data_rs: lines
			}).then(function(data) {
				$modalInstance.close(data.daily_statistics);
			}, function(e) {

			});
		}
		//删除行
		$scope.delItem = function() {
			$scope.gridDelItem('oa_attrecord_1');
		}
		$scope.cancel = function(e) {
			$modalInstance.dismiss('cancel');
		}
		$scope.oa_attrecord_1 = {
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
		$scope.reseau_1 = [{
				headerName: "序号", //标题
				field: "r_id", //字段名
				editable: false, //是否可编辑
				width: 60, //宽度
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
				headerName: "时间",
				field: "check_day",
				editable: true,
				filter: 'date',
				width: 100,
				cellEditor: "年月日",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			},
			{
				headerName: "帐号",
				field: "userid",
				editable: true,
				filter: 'string',
				width: 100,
				cellEditor: "text",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "姓名",
				field: "username",
				editable: true,
				filter: 'string',
				width: 100,
				cellEditor: "text",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "部门",
				field: "org_name",
				editable: true,
				filter: 'text',
				width: 150,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "所属规则",
				field: "checkin_role",
				editable: true,
				filter: 'text',
				width: 120,
				cellEditor: "文本框",
				enableRowGroup: false,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "最早打卡",
				field: "checkin_f_time",
				editable: true,
				filter: 'text',
				width: 100,
				cellEditor: "文本框",
				//cellEditorParams: { values: [] },
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "最晚打卡",
				field: "checkin_l_time",
				editable: true,
				filter: 'text',
				width: 100,
				cellEditor: "文本框",
				//cellEditorParams: { values: [] },
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "打卡次数",
				field: "checkin_times",
				editable: true,
				filter: 'number',
				width: 100,
				cellEditor: "整数框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "工作时长",
				field: "work_times",
				editable: true,
				filter: 'text',
				width: 100,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "状态",
				field: "stat_desc",
				editable: true,
				filter: 'text',
				width: 100,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "校准状态",
				field: "jz_stat",
				editable: true,
				filter: 'text',
				width: 100,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}
		];

	}

	//获取员工在职状态词汇
	$scope.statuss = [{
		desc: '正常',
		value: 1
	}, {
		desc: '缺卡',
		value: 2
	}, {
		desc: '请假',
		value: 3
	}, {
		desc: '出差',
		value: 4
	}, {
		desc: '调休',
		value: 5
	}];

	//清空部门
	$scope.empty_org_name = function() {
		$scope.data.currItem.org_id = 0;
		$scope.data.currItem.org_name = '';
	};

	//新增行
	$scope.addItem = function(option_name) {
		$scope.gridAddItem(option_name, {});
	}

	//删除行
	$scope.delItem = function(option_name) {
		$scope.gridDelItem(option_name);
	}

	//上下班日统计
	$scope.oa_attrecord_11 = {
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
		getRowHeight: function(params) {
			//return 20 * (Math.floor(params.data.on_site.length / 25) + 1.3);
			return 20 * (Math.floor($scope.getmax_length(params))+0.5);
		},
		icons: {
			columnRemoveFromGroup: '<i class="fa fa-remove"/>',
			filter: '<i class="fa fa-filter"/>',
			sortAscending: '<i class="fa fa-long-arrow-down"/>',
			sortDescending: '<i class="fa fa-long-arrow-up"/>',
		}
	};
	$scope.reseau_11 = [{
			headerName: "序号", //标题
			field: "r_id", //字段名
			editable: false, //是否可编辑
			width: 60, //宽度
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
			headerName: "时间",
			field: "check_day",
			editable: false,
			filter: 'date',
			width: 100,
			cellEditor: "年月日",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		},
		{
			headerName: "帐号",
			field: "userid",
			editable: false,
			filter: 'string',
			width: 100,
			cellEditor: "text",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "姓名",
			field: "username",
			editable: false,
			filter: 'string',
			width: 100,
			cellEditor: "text",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "部门",
			field: "org_name",
			editable: false,
			filter: 'text',
			width: 150,
			cellEditor: "文本框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "打卡纪录",
			children: [{
				headerName: "最早",
				field: "checkin_f_time",
				editable: false,
				filter: 'text',
				width: 100,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "最晚",
				field: "checkin_l_time",
				editable: false,
				filter: 'text',
				width: 100,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "次数",
				field: "checkin_times",
				editable: false,
				filter: 'text',
				width: 100,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "工作时长",
				field: "work_times",
				editable: false,
				filter: 'text',
				width: 100,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "状态",
				field: "stat_desc",
				editable: false,
				filter: 'text',
				width: 100,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "校准状态",
				field: "jz_stat",
				editable: false,
				filter: 'text',
				width: 100,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}]
		}, {
			headerName: "其它",
			children: [{
				headerName: "请假",
				field: "b",
				editable: false,
				filter: 'text',
				width: 100,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "出差",
				field: "d",
				editable: false,
				filter: 'text',
				width: 100,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "调休",
				field: "c",
				editable: false,
				filter: 'text',
				width: 100,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "补卡",
				field: "e",
				editable: false,
				filter: 'text',
				width: 100,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "加班",
				field: "f",
				editable: false,
				filter: 'text',
				width: 100,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}]
		}, {
			headerName: "打卡地点",
			field: "on_site",
			editable: false,
			filter: 'text',
			width: 300,
			cellEditor: "文本框",
			enableRowGroup: false,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}
	];

	//上下班月统计
	$scope.oa_attrecord_12 = {
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

	$scope.reseau_12 = [{
		headerName: "序号", //标题
		field: "id", //字段名
		editable: false, //是否可编辑
		width: 60, //宽度
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
		headerName: "时间",
		field: "m",
		editable: false,
		filter: 'date',
		width: 100,
		cellEditor: "年月日",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "姓名",
		field: "username",
		editable: false,
		filter: 'string',
		width: 100,
		cellEditor: "text",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "部门",
		field: "org_name",
		editable: false,
		filter: 'text',
		width: 150,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "该打卡天数",
		field: "ydkts",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		//cellEditorParams: { values: [] },
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "正常天数",
		field: "zcts",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		//cellEditorParams: { values: [] },
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "异常天数",
		field: "ycts",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "漏卡补卡次数",
		field: "degree",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "外出补卡次数",
		field: "go_degree",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "调休天数",
		field: "rest_days",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "出差天数",
		field: "go_days",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "周末加班",
		field: "weekend_days",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "节假日加班",
		field: "festivals_days",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "病假",
		field: "sick_days",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "事假",
		field: "matter_days",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "婚假",
		field: "wed_days",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "丧假",
		field: "funeral_days",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "生育假",
		field: "birth_days",
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "年假",
		field: "year_days",
		editable: false,
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
angular.module('inspinia')
	.controller('ctrl_oa_attrecord', ctrl_oa_attrecord)