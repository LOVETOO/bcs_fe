function sales_order($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
	sales_order = HczyCommon.extend(sales_order, ctrl_bill_public);
	sales_order.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

	$scope.objconf = {
		name: "oa_saledash_data_so",
		key: "so_id",
		wftempid: 0,
		FrmInfo: {},
		grids: [{
			optionname: 'oa_saledash_data_so',
			idname: 'oa_saledash_data_sos'
		}]
	};
	/******************界面初始化****************************/
	$scope.clearinformation = function() {
		$scope.searchlist = false;
		$scope.data = {};
		$scope.data.currItem = {
			creator: userbean.userid,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			oa_saledash_data_sos: []
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

	$scope.select_order = function() {
		if($scope.data.currItem.group_name == 0 || $scope.data.currItem.group_name == '' || $scope.data.currItem.group_name == undefined) {
			BasemanService.notice('统计主体为空，请选择！', "alert-warning");
			return;
		}
		if($scope.data.currItem.s_date == 0 || $scope.data.currItem.s_date == '' || $scope.data.currItem.s_date == undefined) {
			BasemanService.notice('开始时间为空，请选择！', "alert-warning");
			return;
		}
		if($scope.data.currItem.e_date == 0 || $scope.data.currItem.e_date == '' || $scope.data.currItem.e_date == undefined) {
			BasemanService.notice('结束时间为空，请选择！', "alert-warning");
			return;
		}
		var a = (new Date($scope.data.currItem.s_date.replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数
		var b = (new Date($scope.data.currItem.e_date.replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数

		if(a > b) {
			BasemanService.notice("结束时间不能小于开始时间", "alert-warning");
			return;
		}
		BasemanService.RequestPost("oa_saledash_data_so", "search", {
			sqlwhere: "(group_name='" + $scope.data.currItem.group_name + "' and so_date between to_date('" + $scope.data.currItem.s_date + "','yyyy-mm-dd') and to_date('" + $scope.data.currItem.e_date + "','yyyy-mm-dd'))"
		}).then(function(data) {
			$scope.gridSetData("oa_saledash_data_so", data.oa_saledash_data_sos);
		});
	}

	//明细网格
	$scope.oa_saledash_data_so = {
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
	$scope.oa_saledash_data_sos = [{
		headerName: "序号", //标题
		field: "so_id", //字段名
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
		editable: false,
		filter: 'text',
		width: 200,
		cellEditor: "文本框",
		//action: $scope.orgname,
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "主体",
		field: "group_name2",
		editable: false,
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
		editable: false,
		filter: 'text',
		width: 100,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "客户编码",
		field: "cust_no",
		editable: false,
		filter: 'text',
		width: 110,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "店铺/客户",
		field: "cust_name",
		editable: false,
		filter: 'text',
		width: 110,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "出仓日期整理",
		field: "so_date",
		editable: false,
		filter: 'date',
		width: 110,
		cellEditor: "年月日",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "订单号",
		field: "so_no",
		editable: false,
		filter: 'text',
		width: 150,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "商品编码",
		field: "item_no",
		editable: false,
		filter: 'text',
		width: 110,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "商品名称",
		field: "item_name",
		editable: false,
		filter: 'text',
		width: 200,
		cellEditor: "文本框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "数量",
		field: "qty",
		editable: false,
		filter: 'number',
		width: 110,
		cellEditor: "整数框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "单价",
		field: "price",
		editable: false,
		filter: 'number',
		width: 110,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "含税金额",
		field: "rebate",
		editable: false,
		filter: 'number',
		width: 110,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "不含税金额-万",
		field: "amt",
		editable: false,
		filter: 'number',
		width: 110,
		cellEditor: "浮点框",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}];
	//弹出导入框
	$scope.on_leading = function() {
		BasemanService.openFrm("views/mywork/sales_excel_order.html", sales_excel_order, $scope, "", "", false).result.then(function(data) {
			$scope.data.currItem.group_name = data.group_name;
			$scope.data.currItem.s_date = data.s_date;
			$scope.data.currItem.e_date = data.e_date;
			$scope.select_order();
		})
	}
	var sales_excel_order = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		sales_excel_order = HczyCommon.extend(sales_excel_order, ctrl_bill_public);
		sales_excel_order.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
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
		$scope.title = "销售订单导入"

		$scope.ok = function() {
			if($scope.data.currItem.group_name == 0 || $scope.data.currItem.group_name == '' || $scope.data.currItem.group_name == undefined) {
				BasemanService.notice('统计主体为空，请选择！', "alert-warning");
				return;
			}
			if($scope.data.currItem.s_date == 0 || $scope.data.currItem.s_date == '' || $scope.data.currItem.s_date == undefined) {
				BasemanService.notice('开始时间为空，请选择！', "alert-warning");
				return;
			}
			if($scope.data.currItem.e_date == 0 || $scope.data.currItem.e_date == '' || $scope.data.currItem.e_date == undefined) {
				BasemanService.notice('结束时间为空，请选择！', "alert-warning");
				return;
			}

			var a = (new Date($scope.data.currItem.s_date.replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数
			var b = (new Date($scope.data.currItem.e_date.replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数

			if(a > b) {
				BasemanService.notice("结束时间不能小于开始时间", "alert-warning");
				return;
			}

			var lines = $scope.gridGetData('opt_itemline');
			var msg = [];
			if(!lines.length) {
				BasemanService.notice('明细不能为空!', "alert-warning");
				return;
			}
			for(var i = 0; i < lines.length; i++) {
				console.log(lines[i]);
				//删除空对象
				if($.isEmptyObject(lines[i])) {
					lines.remove(lines[i]);
					i--;
					continue;
				}
				var value = lines[i];
				var group_name = value.group_name;
				var group_name2 = value.group_name2;
				var org_name = value.org_name;
				var cust_name = value.cust_name;
				var so_date = value.so_date;
				var so_no = value.so_no;
				var item_no = value.item_no;
				var item_name = value.item_name;
				var qty = value.qty;
				var price = value.price;
				var amt = value.amt;

				if(group_name == '' || group_name == 0 || group_name == undefined) {
					BasemanService.notice('明细统计主体不能为空，请修改！', "alert-warning");
					return;
				}

				if(group_name2 == '' || group_name2 == 0 || group_name2 == undefined) {
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

				if(cust_name == '' || cust_name == 0 || cust_name == undefined) {
					BasemanService.notice('明细店铺整理不能为空，请修改！', "alert-warning");
					return;
				}
				if(so_date == '' || so_date == 0 || so_date == undefined) {
					BasemanService.notice('明细出仓日期整理不能为空，请修改！', "alert-warning");
					return;
				}

				var a = (new Date($scope.data.currItem.s_date.replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数
				var b = (new Date($scope.data.currItem.e_date.replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数
				//判断出仓日期是否在用户选择的日期之间
				var c = (new Date(so_date.replace(new RegExp("-", "gm"), "/"))).getTime();
				if(a > c || c > b) {
					BasemanService.notice('明细出仓日期整理的日期不在开始日期和结束日期之间，请修改！', "alert-warning");
					return;
				}

				if(so_no == '' || so_no == 0 || so_no == undefined) {
					BasemanService.notice('明细订单号不能为空，请修改！', "alert-warning");
					return;
				}
				if(item_no == '' || item_no == 0 || item_no == undefined) {
					BasemanService.notice('明细商品编码不能为空，请修改！', "alert-warning");
					return;
				}
				if(item_name == '' || item_name == 0 || item_name == undefined) {
					BasemanService.notice('明细商品名称不能为空，请修改！', "alert-warning");
					return;
				}
				if(qty == '' || qty == 0 || qty == undefined) {
					BasemanService.notice('明细数量不能为空，请修改！', "alert-warning");
					return;
				}
			}

			BasemanService.RequestPost("oa_saledash_data_so", "import", {
				group_name: $scope.data.currItem.group_name,
				s_date: $scope.data.currItem.s_date,
				e_date: $scope.data.currItem.e_date,
				oa_saledash_data_sos: lines
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
			field: "so_id", //字段名
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
			headerName: "主体",
			field: "group_name2",
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
			headerName: "客户编码",
			field: "cust_no",
			editable: true,
			filter: 'text',
			width: 110,
			cellEditor: "文本框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "店铺整理",
			field: "cust_name",
			editable: true,
			filter: 'text',
			width: 110,
			cellEditor: "文本框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "出仓日期整理",
			field: "so_date",
			editable: true,
			filter: 'date',
			width: 110,
			cellEditor: "年月日",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "订单号",
			field: "so_no",
			editable: true,
			filter: 'text',
			width: 150,
			cellEditor: "文本框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "商品编码",
			field: "item_no",
			editable: true,
			filter: 'text',
			width: 110,
			cellEditor: "文本框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "商品名称",
			field: "item_name",
			editable: true,
			filter: 'text',
			width: 200,
			cellEditor: "文本框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "数量",
			field: "qty",
			editable: true,
			filter: 'number',
			width: 110,
			cellEditor: "整数框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "单价",
			field: "price",
			editable: true,
			filter: 'number',
			width: 110,
			cellEditor: "浮点框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "含税金额",
			field: "rebate",
			editable: true,
			filter: 'number',
			width: 110,
			cellEditor: "浮点框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}, {
			headerName: "不含税金额-万",
			field: "amt",
			editable: true,
			filter: 'number',
			width: 110,
			cellEditor: "浮点框",
			enableRowGroup: true,
			enablePivot: true,
			enableValue: true,
			floatCell: true
		}];
	}
}

//注册控制器
angular.module('inspinia').controller('sales_order', sales_order);