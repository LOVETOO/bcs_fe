function sales_target($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
	sales_target = HczyCommon.extend(sales_target, ctrl_bill_public);
	sales_target.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

	$scope.objconf = {
		name: "oa_saledash_data_task",
		key: "task_id",
		wftempid: 0,
		FrmInfo: {},
		grids: [{
			optionname: 'oa_saledash_data_task',
			idname: 'oa_saledash_data_tasks'
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
			oa_saledash_data_tasks: []
		};

	};

	BasemanService.RequestPost("oa_saledash_data", "getgrouplist", {}).then(function(data) {
		var group_names = [];
		for(var i = 0; i < data.totaldashinfoa.length; i++) {
			object = {};
			object.value = data.totaldashinfoa[i].group_name;
			object.desc = data.totaldashinfoa[i].group_name;
			group_names.push(object);
		}
		$scope.group_names = group_names;
	});

	$scope.select_target = function() {
		if($scope.data.currItem.group_name == 0 || $scope.data.currItem.group_name == '' || $scope.data.currItem.group_name == undefined) {
			BasemanService.notice('统计主体为空，请选择！', "alert-warning");
			return;
		}
		if($scope.data.currItem.iyear == 0 || $scope.data.currItem.iyear == '' || $scope.data.currItem.iyear == undefined) {
			BasemanService.notice('年份为空，请选择！', "alert-warning");
			return;
		}
		BasemanService.RequestPost("oa_saledash_data_task", "search", {
			sqlwhere: "(iyear='" + $scope.data.currItem.iyear + "' and group_name='" + $scope.data.currItem.group_name + "')"
		}).then(function(data) {
			$scope.gridSetData("oa_saledash_data_task", data.oa_saledash_data_tasks);
		});
	}

	//发布
	$scope.publish = function() {
		ds.dialog.confirm("确定发布该销售任务？", function() {

			if($scope.data.currItem.group_name == 0 || $scope.data.currItem.group_name == '' || $scope.data.currItem.group_name == undefined) {
				BasemanService.notice("统计主统为空请选择!", "alert-warning");
				return;
			}
			if($scope.data.currItem.iyear == 0 || $scope.data.currItem.iyear == '' || $scope.data.currItem.iyear == undefined) {
				BasemanService.notice('年份为空，请选择！', "alert-warning");
				return;
			}
			BasemanService.RequestPost("oa_saledash_data_task", "publish", {
				sqlwhere: "(iyear='" + $scope.data.currItem.iyear + "' and group_name='" + $scope.data.currItem.group_name + "')"
			}).then(function(data) {
				$scope.gridSetData("oa_saledash_data_task", data.oa_saledash_data_tasks);
			});

		}, function() {});
	}
	//保存
	$scope.insert = function() {
		var lines = $scope.gridGetData('oa_saledash_data_task');
		if(lines.length == 0) {
			BasemanService.notice('明细为空，无法保存！', "alert-warning");
			return;
		}
		if($scope.data.currItem.group_name == 0 || $scope.data.currItem.group_name == '' || $scope.data.currItem.group_name == undefined) {
			BasemanService.notice('统计主体为空，请选择！', "alert-warning");
			return;
		}
		if($scope.data.currItem.iyear == 0 || $scope.data.currItem.iyear == '' || $scope.data.currItem.iyear == undefined) {
			BasemanService.notice('年度为空，请选择！', "alert-warning");
			return;
		}
		var msg = [];

		for(var i = 0; i < lines.length; i++) {
			if($.isEmptyObject(lines[i])) {
				lines.remove(lines[i]);
				i--;
				continue;
			}
			var value = lines[i];
			var group_name = value.group_name;
			var org_name = value.org_name;
			var area_name = value.area_name;

			if(group_name == '' || group_name == 0 || group_name == undefined) {
				BasemanService.notice('明细统计主体不能为空，请修改！', "alert-warning");
				return;
			}

			if(group_name != $scope.data.currItem.group_name) {
				BasemanService.notice('选择的统计主体与导入的统计主体不一致，无法保存!', "alert-warning");
				return;
			}

			if(org_name == '' || org_name == 0 || org_name == undefined) {
				BasemanService.notice('明细部门不能为空，请修改！', "alert-warning");
				return;
			}
			if(area_name == '' || area_name == 0 || area_name == undefined) {
				BasemanService.notice('明细店铺/区域不能为空，请修改！', "alert-warning");
				return;
			}
			lines[i].m01 = parseFloat(lines[i].m01 || 0).toFixed(2);
			lines[i].m02 = parseFloat(lines[i].m02 || 0).toFixed(2);
			lines[i].m03 = parseFloat(lines[i].m03 || 0).toFixed(2);
			lines[i].m04 = parseFloat(lines[i].m04 || 0).toFixed(2);
			lines[i].m05 = parseFloat(lines[i].m05 || 0).toFixed(2);
			lines[i].m06 = parseFloat(lines[i].m06 || 0).toFixed(2);
			lines[i].m07 = parseFloat(lines[i].m07 || 0).toFixed(2);
			lines[i].m08 = parseFloat(lines[i].m08 || 0).toFixed(2);
			lines[i].m09 = parseFloat(lines[i].m09 || 0).toFixed(2);
			lines[i].m10 = parseFloat(lines[i].m10 || 0).toFixed(2);
			lines[i].m11 = parseFloat(lines[i].m11 || 0).toFixed(2);
			lines[i].m12 = parseFloat(lines[i].m12 || 0).toFixed(2);
			if(isNaN(lines[i].m01)) {
				lines[i].m01 = 0;
			}
			if(isNaN(lines[i].m02)) {
				lines[i].m02 = 0;
			}
			if(isNaN(lines[i].m03)) {
				lines[i].m03 = 0;
			}
			if(isNaN(lines[i].m04)) {
				lines[i].m04 = 0;
			}
			if(isNaN(lines[i].m05)) {
				lines[i].m05 = 0;
			}
			if(isNaN(lines[i].m06)) {
				lines[i].m06 = 0;
			}
			if(isNaN(lines[i].m07)) {
				lines[i].m07 = 0;
			}
			if(isNaN(lines[i].m08)) {
				lines[i].m08 = 0;
			}
			if(isNaN(lines[i].m09)) {
				lines[i].m09 = 0;
			}
			if(isNaN(lines[i].m10)) {
				lines[i].m10 = 0;
			}
			if(isNaN(lines[i].m11)) {
				lines[i].m11 = 0;
			}
			if(isNaN(lines[i].m12)) {
				lines[i].m12 = 0;
			}
		}

		BasemanService.RequestPost("oa_saledash_data_task", "import", {
			group_name: $scope.data.currItem.group_name,
			iyear: $scope.data.currItem.iyear,
			oa_saledash_data_tasks: lines
		}).then(function(data) {
			$scope.select_target();
		}, function(e) {});

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

	//明细网格
	$scope.oa_saledash_data_task = {
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
	$scope.oa_saledash_data_tasks = [{
		headerName: "序号", //标题
		field: "task_id", //字段名
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
		headerName: "统计主体",
		field: "group_name",
		editable: true,
		filter: 'text',
		width: 200,
		cellEditor: "文本框",
		//action: $scope.orgname,
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "部门",
		field: "org_name",
		editable: true,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "店铺/区域",
		field: "area_name",
		editable: true,
		filter: 'text',
		width: 200,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "1月",
		field: "m01",
		editable: true,
		filter: 'number',
		width: 80,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "2月",
		field: "m02",
		editable: true,
		filter: 'number',
		width: 80,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "3月",
		field: "m03",
		editable: true,
		filter: 'number',
		width: 80,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "4月",
		field: "m04",
		editable: true,
		filter: 'number',
		width: 80,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "5月",
		field: "m05",
		editable: true,
		filter: 'number',
		width: 80,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "6月",
		field: "m06",
		editable: true,
		filter: 'number',
		width: 80,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "7月",
		field: "m07",
		editable: true,
		filter: 'number',
		width: 80,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "8月",
		field: "m08",
		editable: true,
		filter: 'number',
		width: 80,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "9月",
		field: "m09",
		editable: true,
		filter: 'number',
		width: 80,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "10月",
		field: "m10",
		editable: true,
		filter: 'number',
		width: 80,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "11月",
		field: "m11",
		editable: true,
		filter: 'number',
		width: 80,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "12月",
		field: "m12",
		editable: true,
		filter: 'number',
		width: 80,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}];
	//弹出导入框
	$scope.on_leading = function() {
		BasemanService.openFrm("views/mywork/sales_excel_target.html", sales_excel_target, $scope, "", "", false).result.then(function(data) {
			$scope.data.currItem.iyear = data.iyear;
			$scope.data.currItem.group_name = data.group_name;
			$scope.select_target();
		})
	}
	var sales_excel_target = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		sales_excel_target = HczyCommon.extend(sales_excel_target, ctrl_bill_public);
		sales_excel_target.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
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
		$scope.title = "销售任务导入"

		$scope.ok = function() {
			if($scope.data.currItem.group_name == 0 || $scope.data.currItem.group_name == '' || $scope.data.currItem.group_name == undefined) {
				BasemanService.notice('统计主体为空，请选择！', "alert-warning");
				return;
			}
			if($scope.data.currItem.iyear == 0 || $scope.data.currItem.iyear == '' || $scope.data.currItem.iyear == undefined) {
				BasemanService.notice('年度为为空，请选择！', "alert-warning");
				return;
			}
			var msg = [];
			var lines = $scope.gridGetData('opt_itemline');
			if(!lines.length) {
				BasemanService.notice('明细不能为空!', "alert-warning");
				return;
			}

			for(var i = 0; i < lines.length; i++) {
				if($.isEmptyObject(lines[i])) {
					lines.remove(lines[i]);
					i--;
					continue;
				}
				var value = lines[i];
				var group_name = value.group_name;
				var org_name = value.org_name;
				var area_name = value.area_name;

				if(group_name == '' || group_name == 0 || group_name == undefined) {
					BasemanService.notice('明细统计主体不能为空，请修改！', "alert-warning");
					return;
				}

				if(group_name != $scope.data.currItem.group_name) {
					BasemanService.notice('选择的统计主体与导入的统计主体不一致，无法保存!', "alert-warning");
					return;
				}

				if(org_name == '' || org_name == 0 || org_name == undefined) {
					BasemanService.notice('明细部门不能为空，请修改！', "alert-warning");
					return;
				}
				if(area_name == '' || area_name == 0 || area_name == undefined) {
					BasemanService.notice('明细店铺/区域不能为空，请修改！', "alert-warning");
					return;
				}
				lines[i].m01 = parseFloat(lines[i].m01 || 0).toFixed(2);
				lines[i].m02 = parseFloat(lines[i].m02 || 0).toFixed(2);
				lines[i].m03 = parseFloat(lines[i].m03 || 0).toFixed(2);
				lines[i].m04 = parseFloat(lines[i].m04 || 0).toFixed(2);
				lines[i].m05 = parseFloat(lines[i].m05 || 0).toFixed(2);
				lines[i].m06 = parseFloat(lines[i].m06 || 0).toFixed(2);
				lines[i].m07 = parseFloat(lines[i].m07 || 0).toFixed(2);
				lines[i].m08 = parseFloat(lines[i].m08 || 0).toFixed(2);
				lines[i].m09 = parseFloat(lines[i].m09 || 0).toFixed(2);
				lines[i].m10 = parseFloat(lines[i].m10 || 0).toFixed(2);
				lines[i].m11 = parseFloat(lines[i].m11 || 0).toFixed(2);
				lines[i].m12 = parseFloat(lines[i].m12 || 0).toFixed(2);
				if(isNaN(lines[i].m01)) {
					lines[i].m01 = 0;
				}
				if(isNaN(lines[i].m02)) {
					lines[i].m02 = 0;
				}
				if(isNaN(lines[i].m03)) {
					lines[i].m03 = 0;
				}
				if(isNaN(lines[i].m04)) {
					lines[i].m04 = 0;
				}
				if(isNaN(lines[i].m05)) {
					lines[i].m05 = 0;
				}
				if(isNaN(lines[i].m06)) {
					lines[i].m06 = 0;
				}
				if(isNaN(lines[i].m07)) {
					lines[i].m07 = 0;
				}
				if(isNaN(lines[i].m08)) {
					lines[i].m08 = 0;
				}
				if(isNaN(lines[i].m09)) {
					lines[i].m09 = 0;
				}
				if(isNaN(lines[i].m10)) {
					lines[i].m10 = 0;
				}
				if(isNaN(lines[i].m11)) {
					lines[i].m11 = 0;
				}
				if(isNaN(lines[i].m12)) {
					lines[i].m12 = 0;
				}
			}

			BasemanService.RequestPost("oa_saledash_data_task", "import", {
				group_name: $scope.data.currItem.group_name,
				iyear: $scope.data.currItem.iyear,
				oa_saledash_data_tasks: lines
			}).then(function(data) {
				$modalInstance.close(data);
			}, function(e) {});

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
		$scope.cancel = function(e) {
			$modalInstance.dismiss('cancel');
		}
		//删除行
		$scope.delItem = function() {
			$scope.gridDelItem('opt_itemline');
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
			field: "task_id", //字段名
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
			headerName: "统计主体",
			field: "group_name",
			editable: true,
			filter: 'text',
			width: 200,
			cellEditor: "文本框",
			//action: $scope.orgname,
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "部门",
			field: "org_name",
			editable: true,
			filter: 'text',
			width: 100,
			cellEditor: "文本框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "店铺/区域",
			field: "area_name",
			editable: true,
			filter: 'text',
			width: 200,
			cellEditor: "文本框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "1月",
			field: "m01",
			editable: true,
			filter: 'number',
			width: 80,
			cellEditor: "浮点框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "2月",
			field: "m02",
			editable: true,
			filter: 'number',
			width: 80,
			cellEditor: "浮点框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "3月",
			field: "m03",
			editable: true,
			filter: 'number',
			width: 80,
			cellEditor: "浮点框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "4月",
			field: "m04",
			editable: true,
			filter: 'number',
			width: 80,
			cellEditor: "浮点框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "5月",
			field: "m05",
			editable: true,
			filter: 'number',
			width: 80,
			cellEditor: "浮点框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "6月",
			field: "m06",
			editable: true,
			filter: 'number',
			width: 80,
			cellEditor: "浮点框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "7月",
			field: "m07",
			editable: true,
			filter: 'number',
			width: 80,
			cellEditor: "浮点框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "8月",
			field: "m08",
			editable: true,
			filter: 'number',
			width: 80,
			cellEditor: "浮点框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "9月",
			field: "m09",
			editable: true,
			filter: 'number',
			width: 80,
			cellEditor: "浮点框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "10月",
			field: "m10",
			editable: true,
			filter: 'number',
			width: 80,
			cellEditor: "浮点框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "11月",
			field: "m11",
			editable: true,
			filter: 'number',
			width: 80,
			cellEditor: "浮点框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "12月",
			field: "m12",
			editable: true,
			filter: 'number',
			width: 80,
			cellEditor: "浮点框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}];
	}
	$scope.initdata();
}

//注册控制器
angular.module('inspinia').controller('sales_target', sales_target);