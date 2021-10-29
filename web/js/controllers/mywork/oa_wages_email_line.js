function oa_wages_email_line($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
	oa_wages_email_line = HczyCommon.extend(oa_wages_email_line, ctrl_bill_public);
	oa_wages_email_line.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

	$scope.objconf = {
		name: "oa_wages_email",
		key: "wages_id",
		wftempid: 0,
		FrmInfo: {},
		grids: [{
			optionname: 'opt_itemline',
			idname: 'oa_wages_emailofoa_wages_email_lines'
		}]
	};
	/******************界面初始化****************************/
	$scope.clearinformation = function() {
		$scope.searchlist = false;
		$scope.data = {};
		$scope.data.currItem = {
			creator: userbean.userid,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			stat: 1,
			year: moment().format('YYYY'),
			oa_wages_emailofoa_wages_email_lines: []
		};

	};

	//查询用户
	$scope.searchuser = function() {
		$scope.FrmInfo = {
			classid: "oa_wages_email", //请求类
			backdatas: "oa_wages_emails",
			sqlBlock: "1=1"
		};

		BasemanService.open(CommonPopController, $scope).result.then(function(data) {
			$scope.data.currItem.sysuserid = data.sysuserid;
			$scope.data.currItem.username = data.username;
			$scope.clearItem();
		});
	}

	function upperJSONKey(jsonObj) {
		for(var key in jsonObj) {
			jsonObj["\"" + key.toUpperCase() + "\""] = jsonObj[key];
			delete(jsonObj[key]);
		}
		return jsonObj;
	}
	//发送
	$scope.check = function() {
		//保存方法
		$scope.validate();

		//获取明细
		var msg = [];
		var arrays = [];
		var lines = $scope.gridGetData('opt_itemline');
		for(var i = 0; i < $scope.reseau.length; i++) {
			var obj = "{code:'" + $scope.reseau[i].field + "',name:'" + $scope.reseau[i].headerName + "',width:" + $scope.reseau[i].width + "}";
			arrays.push(eval("(" + obj + ")"));
		}
		console.log(arrays);
		if(!lines.length) {
			BasemanService.notice('明细不能为空!', "alert-warning");
			return;
		}
		for(var i = 0; i < lines.length; i++) {
			var value = lines[i];
			var emp_name = value.emp_name;
			var org_name = value.org_name;
			var year = value.year;
			var month = value.month;

			if(emp_name == '' || emp_name == 0 || emp_name == undefined) {
				msg.push('明细第' + (i + 1) + '行名字不能为空，请修改！');
			}
			if(org_name == '' || org_name == 0 || org_name == undefined) {
				msg.push('明细第' + (i + 1) + '行部门不能为空，请修改！');
			}
			if(year == '' || year == 0 || year == undefined) {
				msg.push('明细第' + (i + 1) + '行年份不能为空，请修改！');
			}
			if(month == '' || month == 0 || month == undefined) {
				msg.push('明细第' + (i + 1) + '行月份不能为空，请修改！');
			}
		}

		if(msg.length > 0) {
			BasemanService.notice(msg, "alert-warning");
			return;
		}
		//		
		//			$(".desabled-window").css("display", "flex");
		//			BasemanService.RequestPost("oa_wages_email", "check", {
		//				wages_id: $scope.data.currItem.wages_id,
		//				columnsids: arrays,
		//				oa_wages_emailofoa_wages_email_lines: lines
		//			}).then(function(data) {
		//				$(".desabled-window").css("display", "none");
		//				$scope.data.currItem.wages_id = data.wages_id;
		//				$scope.refresh();
		//			}, function(e) {
		//				$(".desabled-window").css("display", "none");
		//
		//			});
		//		})
		if(confirm("是否发送该工资条?")) {
			$(".desabled-window").css("display", "flex");
			setTimeout(function() {
				BasemanService.RequestPost("oa_wages_email", "check", {
					wages_id: $scope.data.currItem.wages_id,
					columnsids: arrays,
					oa_wages_emailofoa_wages_email_lines: lines
				}).then(function(data) {
					$(".desabled-window").css("display", "none");
					$scope.data.currItem.wages_id = data.wages_id;
					$scope.refresh();
				}, function(e) {
					$(".desabled-window").css("display", "none");

				});
			}, 100);
		}

	}
	//状态
	$scope.stats = [{
		desc: '未发送',
		value: 1
	}, {
		desc: '已发送',
		value: 2
	}];
	//月份
	$scope.months = [{
		desc: '1',
		value: 1
	}, {
		desc: '2',
		value: 2
	}, {
		desc: '3',
		value: 3
	}, {
		desc: '4',
		value: 4
	}, {
		desc: '5',
		value: 5
	}, {
		desc: '6',
		value: 6
	}, {
		desc: '7',
		value: 7
	}, {
		desc: '8',
		value: 8
	}, {
		desc: '9',
		value: 9
	}, {
		desc: '10',
		value: 10
	}, {
		desc: '11',
		value: 11
	}, {
		desc: '12',
		value: 12
	}];

	//删除行
	$scope.delItem = function() {
		$scope.gridDelItem('opt_itemline');
		//var data = $scope.gridDelselectedData('opt_itemline');
		//$scope.opt_itemline.api.setRowData(data);
	}

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

	//清空网格
	$scope.clearItem = function() {
		$scope.data.currItem.oa_wages_emailofoa_wages_email_lines = [];
		$scope.data.currItem.total_qty = 0;
		$scope.data.currItem.total_amount = 0;
		$scope.opt_itemline.api.setRowData($scope.data.currItem.oa_wages_emailofoa_wages_email_lines);

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
		headerName: "部门",
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
		headerName: "岗位",
		field: "gw_name",
		editable: true,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "姓名",
		field: "emp_name",
		editable: true,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "年份",
		field: "year",
		editable: true,
		filter: 'text',
		width: 80,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "月份",
		field: "month",
		editable: true,
		filter: 'text',
		width: 80,
		cellEditor: "下拉框",
		cellEditorParams: {
			values: [{
				desc: '1',
				value: 1
			}, {
				desc: '2',
				value: 2
			}, {
				desc: '3',
				value: 3
			}, {
				desc: '4',
				value: 4
			}, {
				desc: '5',
				value: 5
			}, {
				desc: '6',
				value: 6
			}, {
				desc: '7',
				value: 7
			}, {
				desc: '8',
				value: 8
			}, {
				desc: '9',
				value: 9
			}, {
				desc: '10',
				value: 10
			}, {
				desc: '11',
				value: 11
			}, {
				desc: '12',
				value: 12
			}]
		},
		enableRowGroup: false,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "基本工资",
		field: "amount1",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "岗位津贴",
		field: "amount2",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "绩效奖金",
		field: "amount3",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "高温补贴",
		field: "amount4",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "奖励",
		field: "amount5",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "托儿补助",
		field: "amount6",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "补发",
		field: "amount7",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "应发合计",
		field: "amount8",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "病假天数",
		field: "bj_day",
		editable: true,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "扣病假",
		field: "amount9",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "事假天数",
		field: "sj_day",
		editable: true,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "扣事假",
		field: "amount10",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "未到职天数",
		field: "wdz_day",
		editable: true,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "扣未到职",
		field: "amount11",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "应扣合计",
		field: "amount12",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "代扣社保",
		field: "amount13",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "代扣公积金",
		field: "amount14",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "代扣个人所得税",
		field: "amount15",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "代扣借款",
		field: "amount16",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "代扣油卡",
		field: "amount17",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "代扣合计",
		field: "amount18",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "实发",
		field: "amount19",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "出勤天数",
		field: "amount20",
		editable: true,
		filter: 'number',
		width: 100,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "备注",
		field: "note",
		editable: true,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}];

	$scope.initdata();

}

//注册控制器
angular.module('inspinia').controller('oa_wages_email_line', oa_wages_email_line);