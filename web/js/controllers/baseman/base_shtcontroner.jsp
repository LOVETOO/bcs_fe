<%@ page language="java" contentType="application/x-javascript; charset=UTF-8"%>
<%
    String shtid = request.getParameter("shtid");
    
%>
/**
 * Created by wzf on 2016-12-19.
 */
var basemanControllers = angular.module('inspinia');
function ctrl_shtcontroner_<%=shtid%>($scope, $location, $rootScope, $stateParams, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};

    $scope.iFrameHeight = function(){
        var ifm= document.getElementById("iframepage");
        var subWeb = document.frames ? document.frames["iframepage"].document : ifm.contentDocument;
        if(ifm != null && subWeb != null) {
            ifm.height = subWeb.body.scrollHeight;
            ifm.width = subWeb.body.scrollWidth;
        }
    }
    // 初始化通过页面传递过来的参数
    $scope.data.shtid = <%=shtid%>;
    $scope.data.url = '/web/sht/sht_<%=shtid%>.jsp';
    //动态给frame的src赋值，如果直接用控制器在src绑定变量会报错
    //angular.element('#iframepage').attr('src', '/web/sht/cpctest/sht_' + $scope.data.shtid + '.jsp');
$scope.startwf = function(shttmpid, shtinsid, wftmpid,shtname) {
	//选择流程后在查询返回流程的数据，显示在界面上
	BasemanService.RequestPost('cpcwftemp', 'selectref', {
			wftempid: wftmpid
		})
		.then(function(res) {
			window.shtwfid = 0;
			for(var i = 0; i < res.wfproctempofwftemps.length; i++) {
							if(res.wfproctempofwftemps[i].wfpubtempofwfproctemps != undefined) {
								var keys = "wfpublishofwfprocs";

								res.wfproctempofwftemps[i][keys] = res.wfproctempofwftemps[i]["wfpubtempofwfproctemps"];
								delete res.wfproctempofwftemps[i]["wfpubtempofwfproctemps"];
							}
						}
						//判断是某每一个节点都是一个人
						for(var i = 0; i < res.wfproctempofwftemps.length; i++) {
							//开始和结束不用判断
							if(i != 0 && i != res.wfproctempofwftemps.length - 1) {
								//判断每个节点是否都是一个人如果不是则要选择
								if(res.wfproctempofwftemps[i].procusertempofwfproctemps.length < 0) {
									$scope.referring(res);
									return
								}
								//每个节点信息res.wfproctempofwftemps[i]
								var arr = $scope.if_isposition(res.wfproctempofwftemps[i].procusertempofwfproctemps);
								if(arr) {
									if(arr.length > 1) {
										//某个节点中的审批人isposition=3的有两个人以上时需要选人
										console.log(res.wfproctempofwftemps[i].procusertempofwfproctemps);
										$scope.referring(res);
										return;
									}
								}
							}
						}
			<!--//如果都是一个人,直接走流程-->
			var postdata = {
				flag: 2,
				wfid: 0,
				submitctrl: 2,
				breakprocid: 99999,
				priority: 1,
				period: 0,
				aperiod: 0,
				objid: 0,
				objtype: 0,
				stat: 0,
				autosubmitmode: 1
			};
			postdata.wfname = res.wftempname;
			postdata.subject = shtname;
			postdata.wftempid = res.wftempid;
			postdata.proccondofwfs = res.proccondtempofwftemps;
			postdata.wfprocofwfs = res.wfproctempofwftemps;
			for(var i = 0; i < postdata.wfprocofwfs.length; i++) {
				postdata.wfprocofwfs[i].procid = parseInt(postdata.wfprocofwfs[i].proctempid)
				postdata.wfprocofwfs[i].procname = (postdata.wfprocofwfs[i].proctempname)
				if(postdata.wfprocofwfs[i].procusertempofwfproctemps) {
					postdata.wfprocofwfs[i].procuserofwfprocs = postdata.wfprocofwfs[i].procusertempofwfproctemps
					for(var j = 0; j < postdata.wfprocofwfs[i].procuserofwfprocs.length; j++) {
						postdata.wfprocofwfs[i].procuserofwfprocs[j].procid = parseInt(postdata.wfprocofwfs[i].procuserofwfprocs[j].proctempid);
						if(postdata.wfprocofwfs[i].procuserofwfprocs[j].username == '流程启动者') {
							postdata.wfprocofwfs[i].procuserofwfprocs[j].username = $scope.userbean.username;
							postdata.wfprocofwfs[i].procuserofwfprocs[j].userid = $scope.userbean.userid;
						}
					}
				}

				delete postdata.wfprocofwfs[i].procusertempofwfproctemps

			}
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			<!--var node = $scope.zTree.getSelectedNodes()[0];-->
			postdata.wfobjofwfs = [];
			var obj={};
			obj.wfid=0;
			obj.objtype=0;
			obj.objid=0;
			obj.procid=0;
			obj.stat=0;
			obj.objname="";
			obj.objrev=0;
			postdata.wfobjofwfs.push(obj);
			postdata.wfobjofwfs[0].wfid = 0;
			postdata.wfobjofwfs[0].objtype = 999;
			postdata.wfobjofwfs[0].objid = shtinsid;
			postdata.wfobjofwfs[0].procid = 0;
			postdata.wfobjofwfs[0].stat = 0;
			postdata.wfobjofwfs[0].objname = shtname;
			postdata.wfobjofwfs[0].objrev = 0;
			BasemanService.RequestPost('cpcwf', 'insert', postdata)
				.then(function(data) {
					<!--file.wfid = parseInt(data.wfid);-->
					$scope.wfid = parseInt(data.wfid);
					window.shtwfid = $scope.wfid;
					BasemanService.openFrm("views/baseman/sht_wf.html", sht_wf, $scope, "", "", false).result.then(function(data) {

					})
					BasemanService.notice("提交成功", "alert-info");
				},function(e){
					window.shtwfid = -1;
				})
		})
		
		//该方法用于判断节点中是否有isposition==3;
	$scope.if_isposition = function(arrays) {
		for(var i = 0; i < arrays.length; i++) {
			if(arrays[i].isposition == 3) {
				var arr = arrays;
			}
		}
		return arr;
	}
		

	$scope.referring = function(res) {
		$scope.data_res = res;
		BasemanService.openFrm("views/baseman/approval_options.html", approval_options, $scope, "", "").result.then(function(data) {
			var postdata = {
				flag: 2,
				wfid: 0,
				submitctrl: 2,
				breakprocid: 99999,
				priority: 1,
				period: 0,
				aperiod: 0,
				objid: 0,
				objtype: 0,
				stat: 0,
				autosubmitmode: 1
			};
			postdata.wfname = res.wftempname;
			postdata.subject = shtname;
			postdata.wftempid = res.wftempid;
			postdata.proccondofwfs = res.proccondtempofwftemps;
			postdata.wfprocofwfs = data;
			for(var i = 0; i < postdata.wfprocofwfs.length; i++) {
				postdata.wfprocofwfs[i].procid = parseInt(postdata.wfprocofwfs[i].proctempid)
				postdata.wfprocofwfs[i].procname = (postdata.wfprocofwfs[i].proctempname)
				if(postdata.wfprocofwfs[i].procusertempofwfproctemps) {
					postdata.wfprocofwfs[i].procuserofwfprocs = postdata.wfprocofwfs[i].procusertempofwfproctemps
					for(var j = 0; j < postdata.wfprocofwfs[i].procuserofwfprocs.length; j++) {
						postdata.wfprocofwfs[i].procuserofwfprocs[j].procid = parseInt(postdata.wfprocofwfs[i].procuserofwfprocs[j].proctempid);

						if(postdata.wfprocofwfs[i].procuserofwfprocs[j].username == '流程启动者') {
							postdata.wfprocofwfs[i].procuserofwfprocs[j].username = $scope.userbean.username;
							postdata.wfprocofwfs[i].procuserofwfprocs[j].userid = $scope.userbean.userid;
						}
					}
				}

				delete postdata.wfprocofwfs[i].procusertempofwfproctemps

			}
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			<!--var node = $scope.zTree.getSelectedNodes()[0];-->
			postdata.wfobjofwfs = [];
			var obj={};
			obj.wfid=0;
			obj.objtype=0;
			obj.objid=0;
			obj.procid=0;
			obj.stat=0;
			obj.objname="";
			obj.objrev=0;
			postdata.wfobjofwfs.push(obj);
			<!--postdata.wfobjofwfs.push($scope.gridGetRow('options'));-->
			postdata.wfobjofwfs[0].wfid = 0;
				postdata.wfobjofwfs[0].objtype = 999;
			postdata.wfobjofwfs[0].objid = shtinsid;
			postdata.wfobjofwfs[0].procid = 0;
			postdata.wfobjofwfs[0].stat = 0;
			postdata.wfobjofwfs[0].objname = shtname;
			postdata.wfobjofwfs[0].objrev = 0;
			BasemanService.RequestPost('cpcwf', 'insert', postdata)
				.then(function(data) {
					<!--file.wfid = parseInt(data.wfid);-->
					$scope.wfid = parseInt(data.wfid);
					window.shtwfid = $scope.wfid;
					BasemanService.openFrm("views/baseman/sht_wf.html", sht_wf, $scope, "", "", false).result.then(function(data) {

					})
					BasemanService.notice("提交成功", "alert-info");
				},function(e){
					window.shtwfid = -1;
				})
		})
	}
	//加载控制器
	var approval_options = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance, FormValidatorService) {
		approval_options = HczyCommon.extend(approval_options, ctrl_bill_public);
		approval_options.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
		$scope.title = "选择审批人";
		$scope.data_res = $scope.$parent.data_res;
		//用于存放人员数据
		$scope.leadership = [];
		for(var i = 0; i < $scope.data_res.wfproctempofwftemps.length; i++) {
			console.log($scope.data_res.wfproctempofwftemps[i]);
			if(i != 0 && i != $scope.data_res.wfproctempofwftemps.length - 1) {
				if($scope.data_res.wfproctempofwftemps[i].procusertempofwfproctemps.length == 0) {
					$scope.data_res.wfproctempofwftemps[i].needselect = 2;
				}
			}
			$scope.leadership.push($scope.data_res.wfproctempofwftemps[i]);
		}
		$scope.stats = 0;
		$scope.new_leadership = function(item, andix) {
			$scope.proctempname = item.proctempname;
			item.needselect = 2;
			$scope.andix = andix;
			BasemanService.openFrm("views/baseman/add_examinant.html", share_add, $scope, "", "").result.then(function(data) {
				for(var i = 0; i < data.length; i++) {
					if(angular.isUndefined(data[i].orgname)) {
						data[i].orgname = "";
					}
					var obj = "{userid:'" + data[i].userid + "',username:'" + data[i].name + "',orgcode:" + data[i].code + ",orgname:'" + data[i].orgname + "',proctempid:" + 0 + ",stats:" + 1 + "}";
					item.procusertempofwfproctemps.push(eval("(" + obj + ")"));
				}
			})

		}

		$scope.leaderships = function(a) {
			if(a.stats == undefined || a.stats == 0) {
				a.stats = 1;
			} else {
				a.stats = 0;
			}
		}

		$scope.ok = function() {
			//定义一个数组放全部数据
			$scope.arrays_sum = $scope.leadership;

			for(var i = 0; i < $scope.arrays_sum.length; i++) {
				//流程节点的第一个和最后一个不用判断,如果该节点是一个人的时候不用判断
				if(i != 0 && i != $scope.arrays_sum.length - 1 && $scope.arrays_sum[i].needselect == 2) {
					console.log($scope.arrays_sum[i]);

					var users = $scope.arrays_sum[i].procusertempofwfproctemps;

					if(users.length == 0) {
						BasemanService.notice($scope.arrays_sum[i].proctempname + '没有选择审批人！', "alert-warning");
						return;
					} else {
						var valid = false;
						for(var j = 0; j < users.length; j++) {
							var user = users[j]
							if(parseInt(user.stats) == 1) {
								valid = true;
								break;
							}
						}

						if(!valid) {
							BasemanService.notice($scope.arrays_sum[i].proctempname + '没有选择审批人！', "alert-warning");
							return;
						}
					}
				}
			}

			for(var i = 0; i < $scope.arrays_sum.length; i++) {
				//流程节点的第一个和最后一个不用判断,如果该节点是一个人的时候不用判断
				if(i != 0 && i != $scope.arrays_sum.length - 1 && $scope.arrays_sum[i].needselect == 2) {
					for(var j = 0; j < $scope.arrays_sum[i].procusertempofwfproctemps.length; j++) {
						//如果没有状态或是状态为0时删该用户
						if($scope.arrays_sum[i].procusertempofwfproctemps[j].stats == undefined || $scope.arrays_sum[i].procusertempofwfproctemps[j].stats == 0) {
							//此处删除..$scope.arrays_sum[i].procusertempofwfproctemps[j]
							//调用删除数组听元素方法
							$scope.arrays_sum[i].procusertempofwfproctemps.remove($scope.arrays_sum[i].procusertempofwfproctemps[j]);
							j--;
						}

					}

				}
			}

			console.log($scope.arrays_sum);

			$modalInstance.close($scope.arrays_sum);
		}
		$scope.cancel = function(e) {
			$modalInstance.dismiss('cancel');
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

	}
	
	var sht_wf = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		sht_wf = HczyCommon.extend(sht_wf, ctrl_bill_public);
		sht_wf.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
	$scope.objconf = {
        name: "cpcwf",
        key: "wfid",
        wftempid: 12127,
        FrmInfo: {},
        grids: []
    };

    $scope.clearinformation = function() {
        $scope.data = {};
        $scope.data.currItem = {
        };
    };
    $scope.close_down=function(){
    	$modalInstance.dismiss('cancel');
    }
    BasemanService.RequestPost('cpcwf', 'select', {
				wfid: $scope.$parent.wfid
			})
			.then(function(data) {
				$scope.data.currItem = data;
				console.log($scope.data.currItem.wfname);
			})
	
	}
	var share_add = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		share_add = HczyCommon.extend(share_add, ctrl_bill_public);
		share_add.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
		var TimeFn=null;
		$scope.data.currItem = {};

		$scope.title = "添加" + $scope.$parent.proctempname;
		$scope.data.currItem.sj_people = [];
		$scope.search_peopele = function(flag) {
			$scope.data.is_search = 2;
			if($scope.data.username == '' || $scope.data.username == undefined) {
				$scope.data.is_search = 1;
				return;
			}

			BasemanService.RequestPost("cpcemail_contact_list", "search", {
				username: $scope.data.username,
				flag: 3,
				emailtype: 3
			}).then(function(data) {
				$scope.data.currItem.cpcorgs = data.cpcorgs;
			})
		}
		$scope.contact_people = function(item) {
			var object = {};
			object.userid = item.userid
			object.username = item.username;
			object.orgcode = item.code;
			object.orgname = item.name;
			for(var i = 0; i < $scope.data.currItem.sj_people.length; i++) {
				if(object.userid == $scope.data.currItem.sj_people[i].userid) {
					BasemanService.notice("选择人员重复", "alert-info");
					return;
				}
			}
			$scope.data.currItem.sj_people.push(object);
		}
		//用户

		Array.prototype.push.apply($scope.data.currItem.sj_people, $scope.arrays_user);
		//添加用户
		$scope.add_sj = function() {
			var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
			var node = zTree.getSelectedNodes()[0];

			if(node == undefined || node.isParent == true) {
				BasemanService.notice("请选择人员", "alert-info");
				return;
			}
			var object = {};
			object.username = node.name;
			object.userid = (node.userid);
			for(var i = 0; i < $scope.data.currItem.sj_people.length; i++) {
				if(object.userid == $scope.data.currItem.sj_people[i].userid) {
					BasemanService.notice("选择人员重复", "alert-info");
					return;
				}
			}

			$scope.data.currItem.sj_people.push(node);
		}

		//点击当前用户加光标
		$scope.click_sj = function(e, index) {
			$scope.sj_index = index;
			$(e.delegateTarget).siblings().removeClass("high");
			$(e.delegateTarget).addClass('high');
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
		BasemanService.RequestPost("cpcemail_contact_list", "search", {
				emailtype: 3
			})
			.then(function(data) {
				for(var i = 0; i < data.cpcorgs.length; i++) {
					data.cpcorgs[i].id = parseInt(data.cpcorgs[i].id);
					data.cpcorgs[i].pId = parseInt(data.cpcorgs[i].pid);
					if(data.cpcorgs[i].username) {
						data.cpcorgs[i].orgname = data.cpcorgs[i].name;
						data.cpcorgs[i].name = data.cpcorgs[i].username
					} else {
						data.cpcorgs[i].isParent = true;
					}
				}
				$scope.data.cpcorgs = data.cpcorgs;
				$.fn.zTree.init($("#treeDemo4"), setting4, $scope.data.cpcorgs);
			})
		//树状结构定义
		var setting4 = {
			async: {
				enable: true,
				url: "../jsp/authman.jsp?classid=base_search&action=loginuserinfo&format=mjson",
				autoParam: ["id", "name=n", "level=lv"],
				otherParam: {
					"id": 108
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
				onClick: zTreeOnClick //单击事件
			}
		};

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
			var obj = BasemanService.RequestPostNoWait('cpcemail_contact_list', 'search', postdata)
			var children = obj.data.cpcorgs;
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
			$modalInstance.close($scope.data.currItem.sj_people);
		}
		function beforeExpand() {
			//双击时取消单机事件
			if(TimeFn) {
				clearTimeout(TimeFn);
			}
		}
		//单击选择添加用户和机构
		function zTreeOnClick(event, treeId, treeNode) {
			clearTimeout(TimeFn);
			TimeFn = setTimeout(function(event, treeId, treeNode) {
			var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
			var node = zTree.getSelectedNodes()[0];

			if(node == undefined) {
				BasemanService.notice("请选择审批人", "alert-info");
				return;
			}
			if(node.isParent == true) {
				return;
			}
			console.log(node);
			var object = {};
			object.username = node.name;
			object.userid = node.userid;
			for(var i = 0; i < $scope.data.currItem.sj_people.length; i++) {
				if(object.userid == $scope.data.currItem.sj_people[i].userid) {
					BasemanService.notice("选择人员重复", "alert-info");
					return;
				}
			}
			$scope.data.currItem.sj_people.push(node);
			});
		};
	}
	
	

}

    

    window.startwf = $scope.startwf;
}
//加载控制器
basemanControllers.controller('ctrl_shtcontroner_<%=shtid%>', ctrl_shtcontroner_<%=shtid%>)