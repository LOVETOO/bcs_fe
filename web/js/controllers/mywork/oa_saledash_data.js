function oa_saledash_data($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
	oa_saledash_data = HczyCommon.extend(oa_saledash_data, ctrl_bill_public);
	oa_saledash_data.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

	$scope.objconf = {
		name: "oa_saledash_data",
		key: "task_id",
		wftempid: 0,
		FrmInfo: {},
		grids: [{
			optionname: 'oa_saledash_datas',
			idname: 'oa_saledash_datass'
		}]
	};

	//获取主体
	BasemanService.RequestPost("oa_saledash_data", "getgrouplist", {}).then(function(data) {
		var group_names = [];
		if(data.totaldashinfoa.length > 0) {
			$scope.data.currItem.group_name = data.totaldashinfoa[0].group_name;
			$scope.search();
		}
		for(var i = 0; i < data.totaldashinfoa.length; i++) {
			object = {};
			object.value = data.totaldashinfoa[i].group_name;
			object.desc = data.totaldashinfoa[i].group_name;
			group_names.push(object);
		}
		$scope.group_names = group_names;
	});
	$scope.data = {};
	$scope.data.currItem = {};
	$scope.monthpro = 0;
	$scope.data.currItem.select_date = new Date().setDate(1);

	$scope.search = function() {
		if($scope.data.currItem.group_name == 0 || $scope.data.currItem.group_name == '' || $scope.data.currItem.group_name == undefined) {
			return;
		}
		if($scope.data.currItem.select_date == 0 || $scope.data.currItem.select_date == '' || $scope.data.currItem.select_date == undefined) {
			return;
		}
		var a = (new Date($scope.data.currItem.select_date.replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数

		var b = (new Date(moment().format('YYYY-MM-DD').replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数

		if(a > b) {
			BasemanService.notice("日期不能大于当前时间", "alert-warning");
			return;
		}

		var timearr = $scope.data.currItem.select_date.split("-");

		BasemanService.RequestPost("oa_saledash_data", "getsotaskdata", {
			iyear: timearr[0],
			imonth: timearr[1],
			iday: timearr[2],
			group_name: $scope.data.currItem.group_name
		}).then(function(data) {
			$scope.monthpro = data.monthpro;
			$scope.gridSetData("oa_saledash_datas", data.oa_saledash_datas);
		}, function(data) {
			$scope.monthpro = 0;
			$scope.gridSetData("oa_saledash_datas", "");

		});

	}
	console.log(userbean.userauth.saledashreport);
	//发布
	$scope.publish = function() {
		ds.dialog.confirm("确定发布该销售日报？", function() {

			if($scope.data.currItem.group_name == 0 || $scope.data.currItem.group_name == '' || $scope.data.currItem.group_name == undefined) {
				BasemanService.notice("统计主统为空请选择!", "alert-warning");
				return;
			}
			if($scope.data.currItem.select_date == 0 || $scope.data.currItem.select_date == '' || $scope.data.currItem.select_date == undefined) {
				BasemanService.notice("日期为空请选择!", "alert-warning");
				return;
			}
			var a = (new Date($scope.data.currItem.select_date.replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数

			var b = (new Date(moment().format('YYYY-MM-DD').replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数

			if(a > b) {
				BasemanService.notice("日期不能大于当前时间", "alert-warning");
				return;
			}

			var timearr = $scope.data.currItem.select_date.split("-");
			BasemanService.RequestPost("oa_saledash_data", "publish", {
				iyear: timearr[0],
				imonth: timearr[1],
				iday: timearr[2],
				group_name: $scope.data.currItem.group_name
			}).then(function(data) {
				BasemanService.notice("发布成功!", "alert-info");
			}, function(data) {

			});
		}, function() {});
	}

	$scope.oa_saledash_datas = {
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

	function colorRenderer(params) {
		if(parseInt(params.data.itype) == 2) {
			params.eGridCell.style.background = "#ddd";
			var str = "font-weight";
			params.eGridCell.style.fontWeight = 600;
		}
		if(params.value == undefined) {
			return ""
		} else {
			return params.value;
		}

	}

	function NumberRenderer(params) {
		if(params.value == 0 || params.value == undefined || params.value == "") {
			return "";
		}
		return formatNum(params.value.toFixed(2));
	}

	function sumber(params) {
		if(params.value == 0 || params.value == undefined || params.value == "") {
			return "";
		}
		return formatNum(params.value.toFixed(0));
	}

	//小数
	function formatNum(str) {
		var newStr = "";
		var count = 0; 
		if(str.indexOf(".") == -1) {   
			for(var i = str.length - 1; i >= 0; i--) { 
				if(count % 3 == 0 && count != 0) {   
					newStr = str.charAt(i) + "," + newStr; 
				} else {   
					newStr = str.charAt(i) + newStr; 
				} 
				count++;   
			}   
			str = newStr; //自动补小数点后两位
		} else {   
			for(var i = str.indexOf(".") - 1; i >= 0; i--) { 
				if(count % 3 == 0 && count != 0) {   
					newStr = str.charAt(i) + "," + newStr; 
				} else {   
					newStr = str.charAt(i) + newStr; //逐个字符相接起来
				} 
				count++;   
			}   
			str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);   
		}
		return str;
	}

	$scope.oa_saledash_datass = [{
			headerName: "", //标题
			field: "", //字段名
			editable: false, //是否可编辑
			width: 25, //宽度
			cellEditor: "整数框", //字段类型:"年月日"、"时分秒"、"下拉框"、"弹出框"、"文本框"、"整数框"、"浮点框"、"复选框"、"树状结构"、"选择框
			filter: 'number', //过滤类型 text, number, set, date
			valueGetter: function(params) {
				return parseInt(params.node.id) + 1;
			},
			cellRenderer: function(params) {
				return colorRenderer(params)
			},
			enableRowGroup: true, //是否允许作为汇总条件
			enablePivot: true, //是否允许Toolpanel显示
			enableValue: true, //固定值
			floatCell: true //固定值
		}, {

			headerName: '部门组织',
			children: [{
				headerName: "部门",
				field: "org_name",
				editable: false,
				filter: 'text',
				width: 100,
				cellEditor: "文本框",
				cellRenderer: function(params) {
					return colorRenderer(params)
				},
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "店铺",
				field: "cust_name",
				editable: false,
				filter: 'text',
				width: 180,
				hide: false,
				cellEditor: "文本框",
				cellRenderer: function(params) {
					return colorRenderer(params)
				},
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, ]
		}, {

			headerName: '本日实际销售',
			children: [{
				headerName: "实际",
				field: "d_amt",
				editable: false,
				filter: 'number',
				width: 80,
				cellEditor: "浮点框",
				cellRenderer: function(params) {
					colorRenderer(params);
					if(params.value == 0) {
						return "";
					}
					return NumberRenderer(params);
				},
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "比重",
				field: "d_amt_r",
				editable: false,
				filter: 'number',
				width: 60,
				hide: false,
				cellEditor: "浮点框",
				cellRenderer: function(params) {
					colorRenderer(params);
					if(sumber(params) == 0) {
						return "";
					}
					return sumber(params) + '%'
				},
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, ]
		},
		{
			headerName: '本月实际销售额',
			children: [{
				headerName: "任务",
				field: "m_amt_task",
				editable: false,
				filter: 'number',
				width: 80,
				cellEditor: "浮点框",
				cellRenderer: function(params) {
					colorRenderer(params);
					if(params.value == 0) {
						return "";
					}
					return NumberRenderer(params)
				},
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "实际",
				field: "m_amt",
				editable: false,
				filter: 'number',
				width: 80,
				hide: false,
				cellEditor: "浮点框",
				cellRenderer: function(params) {
					colorRenderer(params);
					if(params.value == 0) {
						return "";
					}
					return NumberRenderer(params);
				},
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "比重",
				field: "m_amt_r",
				editable: false,
				filter: 'number',
				width: 60,
				cellEditor: "浮点框",
				cellRenderer: function(params) {
					colorRenderer(params);
					if(params.value == 0) {
						return "";
					}
					return sumber(params) + '%'
				},
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "完成率",
				field: "m_amt_task_r",
				editable: false,
				filter: 'number',
				width: 80,
				cellEditor: "浮点框",
				cellRenderer: function(params) {
					colorRenderer(params);
					if(sumber(params) == 0) {
						return "";
					}
					return sumber(params) + '%'
				},
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "环比",
				field: "lm_amt_r",
				editable: false,
				filter: 'number',
				width: 60,
				cellEditor: "浮点框",
				cellRenderer: function(params) {
					colorRenderer(params);
					if(sumber(params) == 0) {
						return "";
					}
					return sumber(params) + '%'
				},
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, ]
		},
		{
			headerName: '去年同期销售',
			children: [{
				headerName: "实际销售",
				field: "lym_amt",
				editable: false,
				filter: 'number',
				width: 100,
				cellEditor: "浮点框",
				cellRenderer: function(params) {
					colorRenderer(params)
					if(params.value == 0) {
						return "";
					}
					return NumberRenderer(params)
				},
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "同比增长率",
				field: "lym_amt_r",
				editable: false,
				filter: 'number',
				width: 100,
				hide: false,
				cellEditor: "浮点框",
				cellRenderer: function(params) {
					colorRenderer(params);
					if(sumber(params) == 0) {
						return ""
					}
					return sumber(params) + '%'
				},
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, ]
		},
		{
			headerName: '本年累计销售额',
			children: [{
				headerName: "年度任务",
				field: "y_amt_task",
				editable: false,
				filter: 'number',
				width: 100,
				cellEditor: "浮点框",
				cellRenderer: function(params) {
					colorRenderer(params);
					if(params.value == 0) {
						return "";
					}
					return NumberRenderer(params)
				},
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "本年实际",
				field: "y_amt",
				editable: false,
				filter: 'number',
				width: 100,
				hide: false,
				cellEditor: "浮点框",
				cellRenderer: function(params) {
					colorRenderer(params)
					return NumberRenderer(params)
				},
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "比重",
				field: "y_amt_r",
				editable: false,
				filter: 'number',
				width: 60,
				hide: false,
				cellEditor: "浮点框",
				cellRenderer: function(params) {
					colorRenderer(params);
					if(sumber(params) == 0) {
						return "";
					}
					return sumber(params) + '%'
				},
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "年度完成率",
				field: "y_amt_task_r",
				editable: false,
				filter: 'number',
				width: 100,
				hide: false,
				cellEditor: "浮点框",
				cellRenderer: function(params) {
					colorRenderer(params);
					if(sumber(params) == 0) {
						return "";
					}
					return sumber(params) + '%'
				},
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, ]
		},
		{
			headerName: '累计当月预算分解',
			children: [{
				headerName: "累计预算",
				field: "m_total_task",
				editable: false,
				filter: 'number',
				width: 100,
				cellEditor: "浮点框",
				cellRenderer: function(params) {
					colorRenderer(params)
					if(params.value == 0) {
						return "";
					}
					return NumberRenderer(params)
				},
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}, {
				headerName: "完成情况",
				field: "m_total_task_r",
				editable: false,
				filter: 'number',
				width: 100,
				hide: false,
				cellEditor: "浮点框",
				cellRenderer: function(params) {
					colorRenderer(params)
					if(sumber(params) == 0) {
						return "";
					}

					return sumber(params) + '%'
				},
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}]
		}
	];
}

//注册控制器
angular.module('inspinia').controller('oa_saledash_data', oa_saledash_data);