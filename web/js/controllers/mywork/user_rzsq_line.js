/**这是信息编辑界面js*/
function user_rzsq_line($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
	user_rzsq_line = HczyCommon.extend(user_rzsq_line, ctrl_bill_public);
	user_rzsq_line.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
	
	
	$scope.objconf = {
		name: "user_rzsq",
		key: "keyid",
		wftempid: 10164,
		FrmInfo: {},
		grids: [
			{ optionname: 'opt_itemline',	idname: 'user_rzsqsofuser_rzsqs'},
			{ optionname: 'user_pxqks',	idname: 'user_rzsq_pxqksofuser_rzsq_pxqks'},
			{ optionname: 'user_gzjls',	idname: 'user_rzsq_gzjlsofuser_rzsq_gzjls'},
			{ optionname: 'user_jtqks',	idname: 'user_rzsq_jtqksofuser_rzsq_jtqks'}
		]
	};
	/******************界面初始化****************************/
	$scope.clearinformation = function() {
		$scope.searchlist = false;
		$scope.data = {};
		$scope.data.currItem = {
			creator: userbean.userid,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			usable: 2,
			user_rzsqsofuser_rzsqs: []
		};
	};
	
	//测试获取民族词汇
	BasemanService.RequestPost("base_search", "searchdict", {
		dictcode: "mz"
	}).then(function(data) {
		var mzs = [];
		for(var i = 0; i < data.dicts.length; i++) {
			object = {};
			object.value = data.dicts[i].dictvalue;
			object.desc = data.dicts[i].dictname;
			mzs.push(object);
		}
		$scope.mzs = mzs;
	});

	//获取学历系统词汇
	BasemanService.RequestPost("base_search", "searchdict", {
		dictcode: "xl"
	}).then(function(data) {
		var xls = [];
		for(var i = 0; i < data.dicts.length; i++) {
			object = {};
			object.value = data.dicts[i].dictvalue;
			object.desc = data.dicts[i].dictname;
			xls.push(object);
		}
		$scope.xls = xls;
	});


	

	

	$scope.fzr = function() {
		$scope.arrays_user = [];
		$scope.fzr_userids = $scope.data.currItem.fzr_userids;
		$scope.fzr_usernames = $scope.data.currItem.fzr_usernames;
		$scope.fzr_sysuserids = $scope.data.currItem.fzr_sysuserids;
		if($scope.fzr_userids) {
			$scope.contactid = $scope.fzr_userids.split(',');
		}
		if($scope.fzr_usernames) {
			$scope.contactname = $scope.fzr_usernames.split(',');
		}
		if($scope.fzr_sysuserids) {
			$scope.contactsysid = $scope.fzr_sysuserids.split(',');
		}
		if($scope.fzr_userids) {
			for(var i = 0; i < $scope.contactid.length; i++) {
				$scope.arrays_user.push({
					userid: $scope.contactid[i],
					username: $scope.contactname[i],
					sysuserid: $scope.contactsysid[i],
				});
			}
		}

		BasemanService.openFrm("views/mywork/share_add.html", share_add, $scope, "", "").result.then(function(data) {
			$scope.data.currItem.fzr_userids = '';
			$scope.data.currItem.fzr_usernames = '';
			$scope.data.currItem.fzr_sysuserids = '';
			//添加用户
			for(var i = 0; i < data.sj_people.length; i++) {
				//判断是否是第一次选择用户
				if($scope.data.currItem.fzr_userids == '') {
					$scope.data.currItem.fzr_userids += data.sj_people[i].userid;
					$scope.data.currItem.fzr_usernames += data.sj_people[i].username;
					$scope.data.currItem.fzr_sysuserids += data.sj_people[i].sysuserid;
				} else {
					$scope.data.currItem.fzr_userids += ',' + data.sj_people[i].userid;
					$scope.data.currItem.fzr_usernames += ',' + data.sj_people[i].username;
					$scope.data.currItem.fzr_sysuserids += ',' + data.sj_people[i].sysuserid;
				}

			}
		})

	};
	var share_add = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		share_add = HczyCommon.extend(share_add, ctrl_bill_public);
		share_add.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
		var TimeFn = null;
		$scope.data.hide_org = true;
		$scope.data.currItem = {};
		$timeout(function() {
			$('.lm_panel1 #lm150338581407203951792705359891tree').height(400);
		})
		//获取已选中的名字id
		$scope.contact = $scope.$parent.data.currItem.contact;

		//查询联系人
		$scope.search_peopele = function(flag) {
			$scope.data.is_search = 2;
			if($scope.data.username == '' || $scope.data.username == undefined) {
				$scope.data.is_search = 1;
				return;
			}

			BasemanService.RequestPost("scpemail_contact_list", "search", {
				username: $scope.data.username,
				flag: 3,
				emailtype: 3
			}).then(function(data) {
				$scope.data.currItem.scporgs = data.scporgs;
			})
		}
		//用户
		$scope.data.currItem.sj_people = [];
		Array.prototype.push.apply($scope.data.currItem.sj_people, $scope.arrays_user);
		//添加用户
		$scope.add_sj = function() {
			if($scope.data.is_search == 2) {
				var object = $scope.data.currItem.scporgs[$scope.index];
				for(var i = 0; i < $scope.data.currItem.sj_people.length; i++) {
					if(object.userid == $scope.data.currItem.sj_people[i].userid) {
						BasemanService.notice("选择人员重复", "alert-info");
						return;
					}
				}

			} else {

				var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
				var node = zTree.getSelectedNodes()[0];

				if(node == undefined || node.isParent == true) {
					BasemanService.notice("请选择人员", "alert-info");
					return;
				}
				var object = {};
				object.username = node.name;
				object.userid = (node.userid);
				object.sysuserid = node.sysuserid;
				for(var i = 0; i < $scope.data.currItem.sj_people.length; i++) {
					if(object.userid == $scope.data.currItem.sj_people[i].userid) {
						BasemanService.notice("选择人员重复", "alert-info");
						return;
					}
				}
			}
			$scope.data.currItem.sj_people.push(object);
		}
		//点击当前用户加光标
		$scope.click_sj = function(e, index) {
			$scope.sj_index = index;
			$(e.delegateTarget).siblings().removeClass("high");
			$(e.delegateTarget).addClass('high');
		}
		$scope.close_people = function() {
			if($scope.data.is_search == 2) {
				$scope.data.is_search = 1;
				$scope.data.username = '';
			}
		}
		$scope.contact_people = function(e, index) {

			$scope.index = index;
			$(e.delegateTarget).siblings().removeClass("high");
			$(e.delegateTarget).addClass('high');

			$scope.add_sj();

		}

		//删除用户
		$scope.del_sj = function() {
			$scope.data.currItem.sj_people.splice($scope.sj_index, 1);
		}

		//双击删除用户
		$scope.del_user = function() {
			$scope.data.currItem.sj_people.splice($scope.sj_index, 1);
		}

		function showIconForTree(treeId, treeNode) {
			return !treeNode.isParent;
		};
		BasemanService.RequestPost("scpemail_contact_list", "search", {
				emailtype: 3
			})
			.then(function(data) {
				for(var i = 0; i < data.scporgs.length; i++) {
					data.scporgs[i].id = parseInt(data.scporgs[i].id);
					data.scporgs[i].pId = parseInt(data.scporgs[i].pid);
					if(data.scporgs[i].username) {
						data.scporgs[i].orgname = data.scporgs[i].name;
						data.scporgs[i].name = data.scporgs[i].username
					} else {
						data.scporgs[i].isParent = true;
					}
				}
				$scope.data.scporgs = data.scporgs;
				$.fn.zTree.init($("#treeDemo4"), setting4, $scope.data.scporgs);
			})
		//树状结构定义
		var setting4 = {
			async: {
				enable: true,
				url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
				autoParam: ["id", "name=n", "level=lv"],
				otherParam: {
					"flag": 1
				},
				dataFilter: filter
			},
			view: {
				showIcon: showIconForTree
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				beforeExpand: beforeExpand,
				//onRightClick : OnRightClick,//右键事件
				//onDblClick: zTreeonDblClick, //双击事件,
				onClick: zTreeonClick //单击事件

			}
		};
		//这个是异步
		function filter(treeId, parentNode, childNodes) {
			var treeNode = parentNode;
			if(treeNode && treeNode.children) {
				return;
			}
			if(treeNode) {
				var postdata = treeNode
			} else {
				var postdata = {};
			}
			postdata.flag = 1;
			postdata.emailtype = 3;
			postdata.orgid = parseInt(postdata.id);
			var obj = BasemanService.RequestPostNoWait('scpemail_contact_list', 'search', postdata)
			var children = obj.data.scporgs;
			if(children) {
				treeNode.children = [];
				for(var i = 0; i < children.length; i++) {
					if(parseInt(children[i].sysuserid) > 0) {
						children[i].name = children[i].username;
					} else {
						children[i].isParent = true;
					}

				}
			}
			return children;

		}
		$scope.cancel = function(e) {
			$modalInstance.dismiss('cancel');
		}

		$scope.ok = function(e) {
			$modalInstance.close($scope.data.currItem);
		}

		function beforeExpand() {
			//双击时取消单机事件
			if(TimeFn) {
				clearTimeout(TimeFn);
			}
		}
		//单击选择用户
		function zTreeonClick(event, treeId, treeNode) {
			clearTimeout(TimeFn);
			TimeFn = setTimeout(function(event, treeId, treeNode) {
				var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
				var node = zTree.getSelectedNodes()[0];
				if(node == undefined) {
					BasemanService.notice("请选择参与人", "alert-info");
					return;
				}
				if(node.userid) {
					var object = {};
					object.username = node.name;
					object.userid = (node.userid);
					object.sysuserid = node.sysuserid;
					for(var i = 0; i < $scope.data.currItem.sj_people.length; i++) {
						if(object.userid == $scope.data.currItem.sj_people[i].userid) {
							BasemanService.notice("选择人员重复", "alert-info");
							return;
						}
					}
					$scope.data.currItem.sj_people.push(object);
				}

			});
		}
	}

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

	
	

	
	//部门
	$scope.org_name = function() {
		$scope.FrmInfo = {
			classid: "scporg",
			backdatas: "orgs",
			sqlBlock: " 1=1  "
		};

		BasemanService.open(CommonPopController, $scope).result.then(function(data) {
			$scope.data.currItem.orgid = data.orgid;
			$scope.data.currItem.rzbm = data.orgname;

			$scope.data.currItem.cust_id = 0;
			$scope.data.currItem.cust_code = "";
			$scope.data.currItem.cust_name = "";

			$scope.clearItem();
		});
	};



	$scope.xb = [{
			desc: '女',
			value: 1
		},
		{
			desc: '男',
			value: 2
		}
	];

	$scope.hyzks = [{
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
	
	$scope.hkxz = [{
			desc: '本市城镇',
			value: 1
		},
		{
			desc: '本市农村',
			value: 2
		},
		{
			desc: '外市城镇',
			value: 3
		},
		{
			desc: '外市农村',
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
						$scope.data.currItem.zp = $scope.data.photo.docid;
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
				key: 'xm',
				desc: '姓名'
			},
			{
				key: 'xb',
				desc: '性别'
			},
			{
				key: 'csrq',
				desc: '出生日期'
			},
			{
				key: 'sfzh',
				desc: '身份证号'
			},			
			{
				key: 'hyzk',
				desc: '婚姻状况'
			},
			{
				key: 'dh',
				desc: '电话'
			},
			{
				key: 'yx',
				desc: '邮箱'
			},
			{
				key: 'qqh',
				desc: 'QQ号'
			},
			{
				key: 'xl',
				desc: '学历'
			},
			{
				key: 'byyx',
				desc: '毕业院校'
			},
			{
				key: 'hkxz',
				desc: '户口性质'
			},
			{
				key: 'zz',
				desc: '现住地址'
			},
			{
				key: 'hjdz',
				desc: '户籍地址'
			},
			{
				key: 'byyx',
				desc: '毕业院校'
			},
			{
				key: 'zy',
				desc: '专业'
			},
			{
				key: 'rzgs',
				desc: '入职公司'
			},
			{
				key: 'rzrq',
				desc: '入职日期'
			},
			{
				key: 'rzbm',
				desc: '入职部门'
			},
			
			{
				key: 'zw',
				desc: '职务'
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
		
		return true;
	}	
	

	//查询用户
	$scope.searchuser= function() {
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
	
	//新增
	$scope.addItempx = function() {
		$scope.gridAddItem('user_pxqks', {});
	}

	//删除行
	$scope.delItempx = function() {
		$scope.gridDelItem('user_pxqks');
	}
	
		//新增
	$scope.addItemgz = function() {
		$scope.gridAddItem('user_gzjls', {});
	}
	

	//删除行
	$scope.delItemgz = function() {
		$scope.gridDelItem('user_gzjls');
	}
	
	$scope.addItemjt = function() {
		$scope.gridAddItem('user_jtqks', {});
	}
	

	//删除行
	$scope.delItemjt = function() {
		$scope.gridDelItem('user_jtqks');
	}


	//清空网格
	$scope.clearItem = function() {
		$scope.data.currItem.opt_itemline = [];
		$scope.data.currItem.total_qty = 0;
		$scope.data.currItem.total_amount = 0;
		$scope.opt_itemline.api.setRowData($scope.data.currItem.opt_itemline);

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
		headerName: "起止时间", //标题
		field: "qzsj", //字段名
		editable: true, //是否可编辑
		width: 160, //宽度
		cellEditor: "text", //字段类型:"年月日"、"时分秒"、"下拉框"、"弹出框"、"文本框"、"整数框"、"浮点框"、"复选框"、"树状结构"、"选择框
		filter: 'number', //过滤类型 text, number, set, date
		enableRowGroup: true, //是否允许作为汇总条件
		enablePivot: true, //是否允许Toolpanel显示
		enableValue: true, //固定值
		floatCell: true //固定值
	}, {
		headerName: "学校",
		field: "xx",
		editable: true,
		width: 160,
		cellEditor: "text",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "主修专业",
		field: "zxzy",
		editable: true,
		width: 160,
		cellEditor: "text",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "学位",
		field: "xw",
		editable: true,
		width: 160,
		cellEditor: "text",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},];
	
	
	$scope.user_pxqks = {
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

	$scope.px = [{
		headerName: "起止时间", //标题
		field: "qzsj", //字段名
		editable: true, //是否可编辑
		width: 160, //宽度
		cellEditor: "text", //字段类型:"年月日"、"时分秒"、"下拉框"、"弹出框"、"文本框"、"整数框"、"浮点框"、"复选框"、"树状结构"、"选择框
		filter: 'number', //过滤类型 text, number, set, date
		enableRowGroup: true, //是否允许作为汇总条件
		enablePivot: true, //是否允许Toolpanel显示
		enableValue: true, //固定值
		floatCell: true //固定值
	}, {
		headerName: "培训课程",
		field: "pxkc",
		editable: true,
		width: 160,
		cellEditor: "text",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "培训机构",
		field: "pxjg",
		editable: true,
		width: 160,
		cellEditor: "text",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "证书",
		field: "zs",
		editable: true,
		width: 160,
		cellEditor: "text",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},];
	$scope.user_gzjls = {
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

	$scope.gz = [{
		headerName: "起止时间", //标题
		field: "qzsj", //字段名
		editable: true, //是否可编辑
		width: 160, //宽度
		cellEditor: "text", //字段类型:"年月日"、"时分秒"、"下拉框"、"弹出框"、"文本框"、"整数框"、"浮点框"、"复选框"、"树状结构"、"选择框
		filter: 'number', //过滤类型 text, number, set, date
		enableRowGroup: true, //是否允许作为汇总条件
		enablePivot: true, //是否允许Toolpanel显示
		enableValue: true, //固定值
		floatCell: true //固定值
	}, {
		headerName: "工作单位",
		field: "dw",
		editable: true,
		width: 160,
		cellEditor: "text",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "岗位/职务",
		field: "gw",
		editable: true,
		width: 160,
		cellEditor: "text",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "证明人",
		field: "zmr",
		editable: true,
		width: 160,
		cellEditor: "text",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},{
		headerName: "联系电话",
		field: "lxdh",
		editable: true,
		width: 160,
		cellEditor: "text",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	},];
	
	$scope.user_jtqks = {
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
	
	$scope.jt = [{
		headerName: "姓名", //标题
		field: "xm", //字段名
		editable: true, //是否可编辑
		width: 160, //宽度
		cellEditor: "text", //字段类型:"年月日"、"时分秒"、"下拉框"、"弹出框"、"文本框"、"整数框"、"浮点框"、"复选框"、"树状结构"、"选择框
		filter: 'number', //过滤类型 text, number, set, date
		enableRowGroup: true, //是否允许作为汇总条件
		enablePivot: true, //是否允许Toolpanel显示
		enableValue: true, //固定值
		floatCell: true //固定值
	}, {
		headerName: "与本人关系",
		field: "gx",
		editable: true,
		width: 160,
		cellEditor: "text",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}, {
		headerName: "工作单位或住址",
		field: "dz",
		editable: true,
		width: 160,
		cellEditor: "text",
		enableRowGroup: true,
		enablePivot: true,
		enableValue: true,
		floatCell: true
	}];
	$scope.initdata();

}

//注册控制器
angular.module('inspinia').controller('user_rzsq_line', user_rzsq_line);