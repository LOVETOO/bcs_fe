var basemanControllers = angular.module('inspinia');

function oa_resource($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {

	$scope.res_id = 0;
	$scope.data = {};
	$scope.data.currItem = {
		creator: userbean.userid,
		createtime: moment().format('YYYY-MM-DD HH:mm:ss')
	};
	var treeSetting = {
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			beforeExpand: beforeExpand,
			onClick: treeNodeSelected,
			onRightClick: OnRightClick //右键事件
		}
	};

	function treeNodeSelected() {
		var zTree = $.fn.zTree.getZTreeObj("treeRes");
		var node = zTree.getSelectedNodes()[0];

		console.log(node);

		if(node.res_type != 2) {
			$scope.res_id = node.res_id;
		} else {
			$scope.res_id = 0;
		}

		$('#calendar').fullCalendar('refetchEvents');
	}

	function beforeExpand(treeId, treeNode) {
		if(treeNode.children) {
			return;
		}

		var postdata = treeNode;
		BasemanService.RequestPost('oa_resource', 'search', {
				super_id: postdata.id
			})
			.then(function(data) {
				data.children = data.oa_resources;
				if(data.children) {
					treeNode.children = [];
					var zTree = $.fn.zTree.getZTreeObj("treeRes");
					for(var i = 0; i < data.children.length; i++) {
						data.children[i].isParent = (data.children[i].res_type == 2);
						data.children[i].name = data.children[i].res_name
						data.children[i].pId = parseInt(treeNode.id);
						data.children[i].id = parseInt(data.children[i].res_id)
						data.children[i].item_type = 1;
						zTree.addNodes(treeNode, data.children[i])
					}
					//zTree.expandNode(treeNode, true, false, false);

				}

			});
	}

	function OnRightClick(event, treeId, treeNode) {
		//只有超级用户才有权限
		if(userbean.userid != "admin" && !userbean.userauth.admins) {
			return;
		}

		$scope.bottom = 1;
		if(treeNode) {
			var top = $(window).scrollTop();
			//将用户点击的参数传
			$scope.tree_node = treeNode;

			zTree.selectNode(treeNode);
			if(treeNode.getParentNode()) {
				var isParent = treeNode.isParent;
				if(isParent) { //非叶子节点
					showRMenu("firstNode", event.clientX, event.clientY + top); //处理位置，使用的是绝对位置
				} else { //叶子节点
					//叶的子节点不能增加分类和增加资源
					$scope.bottom = 2;
					showRMenu("secondNode", event.clientX, event.clientY + top);
				}
			} else {
				showRMenu("root", event.clientX, event.clientY + top); //根节点
			}
		}
	}

	function showRMenu(type, x, y) {
		$("#rMenu ul").show();
		rMenu.css({
			"top": y - 52 + "px",
			"left": x - 167 + "px",
			"visibility": "visible"
		});
		$scope.$apply();
		//在当前页面绑定 鼠标事件
		$(document).bind("mousedown", onBodyMouseDown);
	}

	//事件触发 隐藏菜单
	function onBodyMouseDown(event) {
		if(!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
			rMenu.css({
				"visibility": "hidden"
			});
		}
	}

	//隐式 隐藏右键菜单
	function hideRMenu() {
		if(rMenu) {
			rMenu.css({
				"visibility": "hidden"
			});
		}
		//取消绑定
		$(document).unbind("mousedown", onBodyMouseDown);
	}
	//增加分类
	$scope.add_classify = function() {
		hideRMenu();
		$scope.type = 2;
		//添加一个文件夹
		BasemanService.openFrm("views/mywork/file_management.html", file_management, $scope, "", "").result.then(function(data) {
			if(data) {
				initData()
			}
		})
	}

	//增加资源
	$scope.add_resource = function() {
		hideRMenu();
		$scope.type = 1;
		//添加一个文件
		BasemanService.openFrm("views/mywork/file_management.html", file_management, $scope, "", "").result.then(function(data) {
			if(data) {
				initData()
			}
		})
	}

	//属性
	$scope.property = function() {
		hideRMenu();
		$scope.type = 3;
		BasemanService.openFrm("views/mywork/file_management.html", file_management, $scope, "", "").result.then(function(data) {
			if(data) {
				initData()
			}
		})
	}
	//删除
	$scope.del_file = function(flag) {
		hideRMenu();
		var zTree = $.fn.zTree.getZTreeObj("treeRes");
		var node = zTree.getSelectedNodes()[0];
		$scope.res_id = node.res_id;

		ds.dialog.confirm("确定删除？", function() {
			BasemanService.RequestPost('oa_resource', 'delete', {
					res_id: $scope.res_id
				})
				.then(function(data) {
					if(data) {
						initData()
					}
					BasemanService.notice('删除成功');
				})
		}, function() {
			//if (e) e.currentTarget.disabled = false;
		});

	}
	var initData = function() {
		BasemanService.RequestPost("oa_resource", "search", {
			sqlwhere: "super_id=0"
		}).then(function(data) {
			$scope.archiveTree = data.oa_resources;

			var zNodes = {};
			zNodes.name = '资源'
			zNodes.id = 0;
			zNodes.isParent = true;
			data.children = data.oa_resources;
			for(var i = 0; i < data.children.length; i++) {
				data.children[i].isParent = (data.children[i].res_type == 2);
				data.children[i].name = data.children[i].res_name;
				//文件夹的时候设置为1
				data.children[i].item_type = 1;
				data.children[i].id = parseInt(data.children[i].res_id);
			}
			zNodes.children = data.children;
			zTree = $.fn.zTree.init($("#treeRes"), treeSetting, zNodes);
			//展开根节点
			zTree.expandNode(zTree.getNodes()[0], true, false, false);
			rMenu = $("#rMenu");
		});
	}

	$timeout(function() {
		initData()
	}, 100)

	$('#calendar').fullCalendar({
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
		defaultDate: moment().format("YYYY-MM-DD"),
		navLinks: true, // can click day/week names to navigate views
		selectable: true,
		selectHelper: true,
		defaultView: 'agendaWeek',
		locale: 'zh-cn',
		eventDrop: function(event, delta, revertFunc) {
			if(event.data && event.data.owner_id != userbean.userid) {
				alert("不是事件的所有人，不能操作！");
				revertFunc();
				return;
			}

			var a = (new Date(event.data.s_time.split(" ")[0].replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数
			var b = (new Date(event.start.format("YYYY-MM-DD").replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数
			if(a > b) {
				BasemanService.notice("开始时间不能小于当前时间", "alert-warning");
				revertFunc();
				return;
			}

			if(!confirm("确定将" + event.title + "的开始时间移动到" + event.start.format() + "?")) {
				revertFunc();
			} else {
				var postdata = event.data;
				postdata.s_time = event.start.format().replace('T', ' ');
				if(!event.end) {
					event.end = event.start.add(1, "hours");
				}
				postdata.e_time = event.end.format().replace('T', ' ');

				BasemanService.RequestPost("oa_resource_reserve", "update", postdata).then(function(data) {}, function(error) {
					console.log(error);
					revertFunc()
				})
			}

		},
		eventRender: function(event, element) {
			//console.log(event, element);
		},
		resourceRender: function(resourceObj, labelTds, bodyTds) {
			console.log(resourceObj, labelTds, bodyTds);
			labelTds.css('background', 'blue');
		},
		eventResize: function(event, delta, revertFunc) {
			if(event.data && event.data.owner_id != userbean.userid) {
				alert("不是事件的所有人，不能操作！");
				revertFunc();
				return;
			}

			if(!confirm("确定将" + event.title + "的结束时间修改为:" + event.end.format() + "?")) {
				revertFunc();
			} else {
				var postdata = event.data;
				postdata.s_time = event.start.format().replace('T', ' ');
				if(!event.end) {
					event.end = event.start.add(1, "hours");
				}
				postdata.e_time = event.end.format().replace('T', ' ');

				BasemanService.RequestPost("oa_resource_reserve", "update", postdata).then(function(data) {}, function(error) {
					console.log(error);
					revertFunc()
				})
			}

		},
		eventClick: function(calEvent, jsEvent, view) {
			$scope.calEvent = calEvent;
			$scope.type = 2;
			BasemanService.openFrm("views/mywork/oa_resource_reserve.html", oa_resource_reserve, $scope, "", "").result.then(function(data) {
				$('#calendar').fullCalendar('refetchEvents');
			})
		},
		eventMouseover: function(calEvent, jsEvent, view) {

			var eventID = calEvent.id;
			var event = calEvent;
			$(this).unbind('mouseup').bind("mouseup", function(e) {
				if(e.altKey) {

					if(event.data && event.data.owner_id != userbean.userid) {
						alert("不是事件的所有人，不能删除！");
					} else if(confirm("是否确认删除事件：" + event.title)) {
						BasemanService.RequestPost("oa_resource_reserve", "delete", {
							reserve_id: event.data.reserve_id
						}).then(function(data) {
							$('#calendar').fullCalendar('removeEvents', eventID);
						}, function(error) {
							console.log(error);
						})

					}

					e.preventdefault();
					e.stopPropagation();
					return true;
				}
			})
		},

		select: function(start, end) {

			if($scope.res_id == 0) {
				alert("请先在左侧选择相应资源");
				$('#calendar').fullCalendar('unselect');
				return;
			}
			$scope.type = 1;
			$scope.res_id = $scope.res_id;
			$scope.s_time = start.format('YYYY-MM-DD HH:mm:ss');
			$scope.e_time = end.format('YYYY-MM-DD HH:mm:ss');

			//获取当前时间
			var createtime = moment().format('YYYY-MM-DD');
			var s_time = start.format('YYYY-MM-DD');
			var a = (new Date(createtime.replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数
			var b = (new Date(s_time.replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数

			if(a > b) {
				BasemanService.notice("开始时间不能小于当前时间", "alert-warning");
				$('#calendar').fullCalendar('unselect');
				return;
			}
			BasemanService.openFrm("views/mywork/oa_resource_reserve.html", oa_resource_reserve, $scope, "", "").result.then(function(data) {
				$('#calendar').fullCalendar('refetchEvents');
			}, function(reason) {
				$('#calendar').fullCalendar('unselect');
			})
		},
		editable: true,
		eventLimit: true, // allow "more" link when too many events
		resourceRender: function(resource, cellEls) {
			cellEls.on('click', function(e) {
				console.log(e);

				if(confirm('Are you sure you want to delete ' + resource.title + '?')) {
					$('#calendar').fullCalendar('removeResource', resource);
				}
			});
		},
		events: function(start, end, timezone, callback) {
			if($scope.res_id == 0) {
				callback([]);
				return;
			}

			var postdata = {
				res_id: $scope.res_id,
				s_time: start.format('YYYY-MM-DD HH:mm:ss'),
				e_time: end.format('YYYY-MM-DD HH:mm:ss')
			}

			BasemanService.RequestPost("oa_resource_reserve", "getreservedata", postdata).then(function(data) {
				var events = [];

				for(var i = 0; i < data.oa_resource_reserves.length; i++) {
					var e = data.oa_resource_reserves[i];
					events.push({
						id: e.reserve_id,
						title: e.subject + '(' + e.owner_name + ')',
						start: e.s_time.replace(' 00:00:00', ''),
						end: e.e_time.replace(' 00:00:00', ''),
						owner: e.owner_id,
						reserve_id: e.reserve_id,
						data: e
					});
				}

				callback(events);
			});
		},
	});
}
var file_management = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance, FormValidatorService) {
	file_management = HczyCommon.extend(file_management, ctrl_bill_public);
	file_management.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

	$scope.data = {};
	$scope.data.currItem = {
		creator: userbean.userid,
		create_time: moment().format('YYYY-MM-DD HH:mm:ss')
	};
	//获取用户点击的是添加分类还是资源
	$scope.type = $scope.$parent.type;
	//获取用户点击的位置
	$scope.tree_node = $scope.$parent.tree_node;
	$scope.resid = $scope.tree_node.res_id;

	if($scope.type != 3) {
		if($scope.type == 1) {
			$scope.title = "添加资源";
			$scope.file_name = "资源名称"
		} else {
			$scope.title = "添加分类";
			$scope.file_name = "分类名称"
		}
		$scope.ok_save = function() {
			if($scope.data.currItem.res_name == '' || $scope.data.currItem.res_name == undefined) {
				BasemanService.notice('名称不能为空，请输入！', "alert-warning");
				return;
			}
			BasemanService.RequestPost("oa_resource", "insert", {
				res_name: $scope.data.currItem.res_name,
				res_desc: $scope.data.currItem.res_desc,
				res_type: $scope.type,
				super_id: $scope.resid,
				creator: $scope.data.currItem.creator,
				create_time: $scope.data.currItem.create_time
			}).then(function(data) {
				$modalInstance.close(data);
			}, function(error) {
				console.log(error);
			});

		}
	} else {
		$scope.title = "属性";
		if(parseInt($scope.tree_node.res_type) == 1) {
			$scope.file_name = "资源名称"
		} else {
			$scope.file_name = "分类名称"
		}
		//将当前信息显示到界面
		$scope.data.currItem.res_name = $scope.tree_node.res_name;
		$scope.data.currItem.res_desc = $scope.tree_node.res_desc;
		$scope.data.currItem.creator = $scope.tree_node.creator;
		$scope.data.currItem.createtime = $scope.tree_node.create_time;
		$scope.data.currItem.updator = $scope.tree_node.updator;
		$scope.data.currItem.updatetime = $scope.tree_node.update_time;
		$scope.res_type = $scope.tree_node.res_type;
		$scope.super_id = $scope.tree_node.super_id;
		$scope.res_id = $scope.tree_node.res_id;

	}
	$scope.ok_save = function() {
		if($scope.data.currItem.res_name == '' || $scope.data.currItem.res_name == undefined) {
			BasemanService.notice('名称不能为空，请输入！', "alert-warning");
			return;
		}
		if($scope.type != 3) {
			$scope.method = "insert";
			$scope.parameter = {
				res_name: $scope.data.currItem.res_name,
				res_desc: $scope.data.currItem.res_desc,
				res_type: $scope.type,
				super_id: $scope.resid,
				creator: $scope.data.currItem.creator,
				create_time: $scope.data.currItem.create_time
			}
		} else {
			$scope.method = "update";
			$scope.parameter = {
				res_id: $scope.res_id,
				res_name: $scope.data.currItem.res_name,
				res_desc: $scope.data.currItem.res_desc,
				res_type: $scope.res_type,
				super_id: $scope.super_id,
				creator: $scope.data.currItem.creator,
				create_time: $scope.data.currItem.createtime,
				updator: $scope.data.currItem.creator,
				updatetime: $scope.data.currItem.create_time
			}
		}
		BasemanService.RequestPost("oa_resource", $scope.method, $scope.parameter).then(function(data) {
			$modalInstance.close(data);
		}, function(error) {
			console.log(error);
		});

	}

	$scope.cancel = function(e) {
		$modalInstance.dismiss('cancel');
	}

}

var oa_resource_reserve = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance, FormValidatorService) {
	oa_resource_reserve = HczyCommon.extend(oa_resource_reserve, ctrl_bill_public);
	oa_resource_reserve.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

	$scope.data = {};
	$scope.data.currItem = {
		creator: userbean.userid,
		create_time: moment().format('YYYY-MM-DD HH:mm:ss')
	};
	$scope.present = userbean.userid;
	console.log($scope.present);

	$scope.type = $scope.$parent.type;
	//获取用户点击的数据
	$scope.calEvent = $scope.$parent.calEvent;
	if($scope.$parent.type != 1) {
		$scope.title = "详情";
		$scope.data.currItem.reserve_id = $scope.calEvent.data.reserve_id;
		$scope.data.currItem.res_id = $scope.calEvent.data.res_id;
		$scope.data.currItem.subject = $scope.calEvent.data.subject;
		$scope.data.currItem.s_time = $scope.calEvent.data.s_time;
		$scope.data.currItem.e_time = $scope.calEvent.data.e_time;
		$scope.data.currItem.creator = $scope.calEvent.data.creator;
		$scope.data.currItem.createtime = $scope.calEvent.data.create_time;
		$scope.data.currItem.updator = $scope.calEvent.data.updator;
		$scope.data.currItem.updatetime = $scope.calEvent.data.update_time;
		$scope.data.currItem.note = $scope.calEvent.data.note;
		$scope.data.currItem.owner_id = $scope.calEvent.data.owner_id;
		$scope.data.currItem.owner_name = $scope.calEvent.data.owner_name;

		$scope.ok_save = function() {
			BasemanService.RequestPost("oa_resource_reserve", "update", {
				reserve_id: $scope.data.currItem.reserve_id,
				res_id: $scope.data.currItem.res_id,
				subject: $scope.data.currItem.subject,
				s_time: $scope.data.currItem.s_time,
				e_time: $scope.data.currItem.e_time,
				super_id: $scope.super_id,
				creator: $scope.data.currItem.creator,
				create_time: $scope.data.currItem.createtime,
				updator: $scope.data.currItem.creator,
				updatetime: $scope.data.currItem.create_time,
				note: $scope.data.currItem.note,
				owner_id: $scope.data.currItem.owner_id,
				owner_name: $scope.data.currItem.owner_name
			}).then(function(data) {
				$modalInstance.close(data);
			}, function(error) {
				console.log(error);
			});
		}

	} else {
		$scope.$parent.type = 2;
		$scope.title = "新增预订";
		$scope.res_id = $scope.$parent.res_id;

		$scope.data.currItem.s_time = $scope.$parent.s_time;
		$scope.data.currItem.e_time = $scope.$parent.e_time;

		$scope.ok_save = function() {
			if($scope.data.currItem.subject == '' || $scope.data.currItem.subject == undefined) {
				BasemanService.notice('主题不能为空，请输入！', "alert-warning");
				return;
			}

			BasemanService.RequestPost("oa_resource_reserve", "insert", {
				subject: $scope.data.currItem.subject,
				res_id: $scope.res_id,
				owner_id: userbean.userid,
				owner_name: userbean.username,
				s_time: $scope.data.currItem.s_time,
				e_time: $scope.data.currItem.e_time,
				note: $scope.data.currItem.note
			}).then(function(data) {
				$modalInstance.close(data);
			}, function(error) {
				console.log(error);
			});
		}

	}

	$scope.del_detailed = function(e) {
		if(confirm("是删除当前主题：" + $scope.data.currItem.subject + "？")) {
			BasemanService.RequestPost("oa_resource_reserve", "delete", {
					reserve_id: $scope.data.currItem.reserve_id
				})
				.then(function(data) {
					$modalInstance.close(data);
					BasemanService.notice('删除成功');
				})
		}

	}
	$scope.cancel = function(e) {
		$modalInstance.dismiss('cancel');
	}
}
//加载控制器
basemanControllers
	.controller('oa_resource', oa_resource)
	.controller('file_management', file_management)
	.controller('oa_resource_reserve', oa_resource_reserve)