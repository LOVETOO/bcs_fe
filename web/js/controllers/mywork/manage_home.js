var basemanControllers = angular.module('inspinia');

function manage_home($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {
	$scope.objconf = {
		name: "oa_work_report_header",
		key: "work_id",
		FrmInfo: {},
		backdata: 'oa_work_report_headers',
		grids:[]
	};
	
	//继承基类方法
	manage_home = HczyCommon.extend(manage_home, ctrl_bill_public);
	manage_home.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
	$scope.data = {};
	
	
	$scope.clearinformation = function(){
		$scope.data.currItem = {
		creator: userbean.userid,
		createtime: moment().format('YYYY-MM-DD HH:mm:ss'),
		start_date: moment().format('YYYY-MM-DD'),
		end_date: moment().format('YYYY-MM-DD'),
		type: 1
		};
	}
	$scope.index = 0;
	$scope.data.oa_work_report_lineofoa_work_report_headers = [];
	$scope.content = {};
	$scope.options = {
		rowDoubleClicked: $scope.rowDoubleClicked,
		suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
		rowHeight: 25,
		getNodeChildDetails: function(file) {
			if(file.group) {
				file.group = file.group;
				return file;
			} else {
				return null;
			}
		},
		icons: {
			groupExpanded: '<i class="fa fa-minus-square-o"/>',
			groupContracted: '<i class="fa fa-plus-square-o"/>',
			columnRemoveFromGroup: '<i class="fa fa-remove"/>',
			filter: '<i class="fa fa-filter"/>',
			sortAscending: '<i class="fa fa-long-arrow-down"/>',
			sortDescending: '<i class="fa fa-long-arrow-up"/>',
		}
	};
	//类型
	$scope.types = [{
			desc: '日报',
			value: 1
		},
		{
			desc: '周报',
			value: 2
		},
		{
			desc: '月报',
			value: 3
		}
	];

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

	$scope.report_ids = [{
		value: 1,
		desc: '日报'
	}, {
		value: 2,
		desc: '周报'
	}, {
		value: 3,
		desc: '月报'
	}];
	$scope.data.oa_work_report_headers = [];
	//查询
	$scope.search = function() {
		//获取日期
		if($scope.data.currItem.start_date == 0 || $scope.data.currItem.start_date == '' || $scope.data.currItem.start_date == undefined) {
			BasemanService.notice('开始时间为空，请输入！', "alert-warning");
			return;
		}
		if($scope.data.currItem.end_date == 0 || $scope.data.currItem.end_date == '' || $scope.data.currItem.end_date == undefined) {
			BasemanService.notice('结束时间为空，请输入！', "alert-warning");
			return;
		}
		if($scope.data.currItem.type == 0 || $scope.data.currItem.type == '' || $scope.data.currItem.type == undefined) {
			BasemanService.notice('类型为空，请输入！', "alert-warning");
			return;
		}
		var postdata = {
			start_date: $scope.data.currItem.start_date,
			end_date: $scope.data.currItem.end_date,
			work_type: $scope.data.currItem.type
		};
		BasemanService.RequestPost("oa_work_report_header", "search", postdata).then(function(data) {
			$scope.data.oa_work_report_headers = data.oa_work_report_headers;
			for(var i=0;i<$scope.data.oa_work_report_headers.length;i++){
				if(!$scope.data.oa_work_report_headers[i].avatar){
					$scope.data.oa_work_report_headers[i].avatar = 'img/aux-48px.jpg';
				}
			}
			$scope.data.oa_work_report_lineofoa_work_report_headers = data.oa_work_report_headers[0].oa_work_report_lineofoa_work_report_headers;
			$scope.oa_work_report_line2ofoa_work_report_headers = data.oa_work_report_headers[0].oa_work_report_line2ofoa_work_report_headers;
            for(var i=0;i<$scope.data.oa_work_report_lineofoa_work_report_headers.length;i++){
				if(!$scope.data.oa_work_report_lineofoa_work_report_headers[i].avatar){
					$scope.data.oa_work_report_lineofoa_work_report_headers[i].avatar = 'img/aux-48px.jpg';
				}
			}
		})
	}
	$scope.a = 1;
	//查询附件
	$scope.attachment = function(objattachs, a) {
		if(objattachs.length == 0) {
			return;
		}
		$scope.objattachs = objattachs;
		if(a == 1) {
			$scope.a = 2;
		} else {
			$scope.a = 1;
		}
	}
	//删除
	$scope.del = function(content, index) {
		ds.dialog.confirm("是否删除该报告？", function() {
			var postdata = {
				work_id: content.work_id,
				work_hz_id: content.work_hz_id
			}
			BasemanService.RequestPost("oa_work_report_header", "delete", postdata).then(function(data) {
				$scope.data.oa_work_report_headers[index] = data;
				BasemanService.notice("删除成功", "alert-info");
			})
		}, function() {});
	}

	//查看评论
	$scope.look_over = function(e,index) {
		$('.fa-caret-square-o-right').attr('class','fa fa-caret-square-o-left fa-2x');
		$(e.currentTarget).attr('class','fa fa-caret-square-o-right fa-2x');
		$scope.index = index;
		$scope.data.oa_work_report_lineofoa_work_report_headers = $scope.data.oa_work_report_headers[index].oa_work_report_lineofoa_work_report_headers;
		for(var i=0;i<$scope.data.oa_work_report_lineofoa_work_report_headers.length;i++){
			if(!$scope.data.oa_work_report_lineofoa_work_report_headers[i].avatar){
				$scope.data.oa_work_report_lineofoa_work_report_headers[i].avatar = 'img/aux-48px.jpg';
			}
		}
		
	}

	//评论
	$scope.speak = function(content, index) {
		BasemanService.openFrm("views/mywork/speak.html", speak, $scope, "", "", false).result.then(function(data) {
			var postdata = {
				work_hz_id: content.work_hz_id,
				work_id: content.work_id,
				content: data
			}
			BasemanService.RequestPost("oa_work_report_header", "add_comment", postdata).then(function(res) {
				$scope.data.oa_work_report_headers[index].oa_work_report_lineofoa_work_report_headers = res.oa_work_report_lineofoa_work_report_headers;
				$scope.data.oa_work_report_lineofoa_work_report_headers = res.oa_work_report_lineofoa_work_report_headers;
				for(var i=0;i<$scope.data.oa_work_report_lineofoa_work_report_headers.length;i++){
					if(!$scope.data.oa_work_report_lineofoa_work_report_headers[i].avatar){
						$scope.data.oa_work_report_lineofoa_work_report_headers[i].avatar = 'img/aux-48px.jpg';
					}
				}
				BasemanService.notice("评论成功", "alert-info");
			})
		})
	}
	var speak = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		speak = HczyCommon.extend(speak, ctrl_bill_public);
		speak.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
		$scope.data = {};
		$scope.data.currItem = {
			report_id: $scope.$parent.data.flag
		};

		$scope.ok = function() {
			$modalInstance.close($scope.data.currItem.content);
		}
		$scope.cancel = function(e) {
			$modalInstance.dismiss('cancel');
		}
	};
	//弹出周报，日报，月报
	$scope.open_report = function(flag) {
		$scope.data.flag = flag;
		BasemanService.openFrm("views/mywork/open_report.html", open_report, $scope, "", "", false).result.then(function(data) {
			console.log(data);
			var postdata = {
				work_type: data.report_id,
				content: data.content,
				cc_report_userids: data.cc_report_userids,
				cc_report_usernames: data.cc_report_usernames,
				cc_report_sysuserids: data.cc_report_sysuserids,
				objattachs: data.objattachs
			};
			BasemanService.RequestPost("oa_work_report_header", "insert", postdata).then(function(data) {
				BasemanService.notice("发布成功", "alert-info");
			})
		})
	}

	var open_report = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		open_report = HczyCommon.extend(open_report, ctrl_bill_public);
		open_report.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
		$scope.data = $scope.$parent.open_report;
		$scope.data.currItem = {
			report_id: $scope.$parent.data.flag
		};

		$scope.ok = function() {
			if($scope.data.currItem.content == 0 || $scope.data.currItem.content == '' || $scope.data.currItem.content == undefined) {
				BasemanService.notice('内容为空，请输入！', "alert-warning");
				return;
			}
			if($scope.data.currItem.cc_report_userids == 0 || $scope.data.currItem.cc_report_userids == '' || $scope.data.currItem.cc_report_userids == undefined) {
				BasemanService.notice('抄送人为空，请选择！', "alert-warning");
				return;
			}
			$scope.arrays = $scope.data.currItem.cc_report_userids.split(",");
			for(var i = 0; i < $scope.arrays.length; i++) {
				if($scope.arrays[i] == userbean.userid) {
					BasemanService.notice('抄送人不可以是自己：' + $scope.arrays[i], "alert-warning");
					return;
				}
			}

			$modalInstance.close($scope.data.currItem);
		}
		$scope.cancel = function(e) {
			$modalInstance.dismiss('cancel');
		}

		$scope.cc_report = function() {
			$scope.arrays_user = [];
			$scope.cc_report_userids = $scope.data.currItem.cc_report_userids;
			$scope.cc_report_usernames = $scope.data.currItem.cc_report_usernames;
			$scope.cc_report_sysuserids = $scope.data.currItem.cc_report_sysuserids;
			if($scope.cc_report_userids) {
				$scope.contactid = $scope.cc_report_userids.split(',');
			}
			if($scope.cc_report_usernames) {
				$scope.contactname = $scope.cc_report_usernames.split(',');
			}
			if($scope.cc_report_sysuserids) {
				$scope.contactsysid = $scope.cc_report_sysuserids.split(',');
			}
			if($scope.cc_report_userids) {
				for(var i = 0; i < $scope.contactid.length; i++) {
					$scope.arrays_user.push({
						userid: $scope.contactid[i],
						username: $scope.contactname[i],
						sysuserid: $scope.contactsysid[i],
					});
				}
			}

			BasemanService.openFrm("views/mywork/share_add.html", share_add, $scope, "", "").result.then(function(data) {
				$scope.data.currItem.cc_report_userids = '';
				$scope.data.currItem.cc_report_usernames = '';
				$scope.data.currItem.cc_report_sysuserids = '';
				//添加用户
				for(var i = 0; i < data.sj_people.length; i++) {
					//判断是否是第一次选择用户
					if($scope.data.currItem.cc_report_userids == '') {
						$scope.data.currItem.cc_report_userids += data.sj_people[i].userid;
						$scope.data.currItem.cc_report_usernames += data.sj_people[i].username;
						$scope.data.currItem.cc_report_sysuserids += data.sj_people[i].sysuserid;
					} else {
						$scope.data.currItem.cc_report_userids += ',' + data.sj_people[i].userid;
						$scope.data.currItem.cc_report_usernames += ',' + data.sj_people[i].username;
						$scope.data.currItem.cc_report_sysuserids += ',' + data.sj_people[i].sysuserid;
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

	}
	$scope.initdata();
}

//加载控制器
basemanControllers
	.controller('manage_home', manage_home)