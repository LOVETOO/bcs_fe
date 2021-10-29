var salemanControllers = angular.module('inspinia');

function company_files($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {

	//设置当前单据对象基本信息
	$scope.objconf = {
		name: "myfiles",
		key: "fileid",
		parentid: "pid",
		FrmInfo: {},
		backdata: 'files',
		grids: [{
			optionname: 'options',
			idname: 'files'
		}],
		z_trees:[{
			optionname:'treeDemo',
			idname:'tree_datas'
		}]
	};

	//加载下拉值

	//是否可用
	$scope.usables = [{
		value: 1,
		desc: '不可用'
	}, {
		value: 2,
		desc: '可用'
	}];
	//仓库属性
	$scope.warehouse_propertys = [];
	$scope.docids = [];
	$scope.file_types = []
	$scope.pro = 0;

	//继承基类方法
	company_files = SinoccCommon.extend(company_files, ctrl_bill_public);
	company_files.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

	//初始化
	$scope.clearinformation = function() {
		$scope.data.currItem[$scope.objconf.grids[0].idname] = [];
		$scope.data.currItem.create_time = new Date();
		$scope.data.currItem.creator = window.userbean.userid;
		$scope.data.currItem.entid = window.userbean.entid;
	};
	$scope.eror = function(index) {
		$scope.replace_file = $scope.file_list[index];
		if(parseInt($scope.replace_file.wfid) > 0) {
			BasemanService.notice($scope.replace_file.docname+"文件正在走流程", "alert-warning")
			return true;
		}
		if(parseInt($scope.replace_file.stat) == 8) {
			BasemanService.notice($scope.replace_file.docname+"该文件正在归档", "alert-warning")
			return true;
		}
		return false;
	}

	//文件录入
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
						var zTree = $.fn.zTree.getZTreeObj("treeDemo");
						var node = $scope.zTree.getSelectedNodes()[0];
						var object = strToJson(json);
						BasemanService.RequestPost('scpfdrref', 'insert', {
								refid: object.data[0].docid,
								fdrid: node.fdrid,
								reftype: 6,
								wsid: -4,
								idpath: node.idpath
							})
							.then(function(data) {})
						BasemanService.RequestPost('scpfdr', 'upwebscpdoc', {
								wsid: -4,
								idpath: node.idpath,
								typepath: node.typepath,
								docid: object.data[0].docid
							})
							.then(function(data) {})

					} catch(e) {
						BasemanService.notice("请选择文件夹", "alert-warning");
						$(".desabled-window").css("display", "none");
						if($('#pro')) {
							$('#pro').css({
								"visibility": "hidden"
							});
						}
					}
				})

				this.on("queuecomplete", function(file) {
					menuShowNode();
					$(".desabled-window").css("display", "none");
					if($('#pro')) {
						$('#pro').css({
							"visibility": "hidden"
						});
					}
				});
				this.on("totaluploadprogress", function(progress) {
					$(".desabled-window").css("display", "flex");
					if($('#pro')) {
						$('#pro').css({
							"visibility": "visible"
						});
					}

					    
					$scope.pro = progress;
					$scope.$apply();
				});
				this.on("error", function() {
					console.log("File upload error");
					if($('#pro')) {
						$('#pro').css({
							"visibility": "hidden"
						});
					}
					$(".desabled-window").css("display", "none");
				})

			}
		});
	})
	//文件复制到
	$scope.file_copy = function() {
		//权限控制
        $scope.file_list = [];
		$scope.error_list = [];
		for(var i=0;i<$scope.gridGetSelectedData('options').length;i++){
			if($scope.judge_copy($scope.gridGetSelectedData('options')[i])){
				$scope.file_list.push($scope.gridGetSelectedData('options')[i]);
			}else{
				$scope.error_list.push($scope.gridGetSelectedData('options')[i]);
			}
		}
		BasemanService.openFrm("views/baseman/file_structure.html", file_structure, $scope, "", "").result.then(function(res) {
			$scope.copy_file(0,res);
		})
	}

	//文件移动到
	$scope.file_move = function() {
		$scope.file_list = [];
		$scope.error_list = [];
		for(var i=0;i<$scope.gridGetSelectedData('options').length;i++){
			if($scope.judge_copy($scope.gridGetSelectedData('options')[i])){
				$scope.file_list.push($scope.gridGetSelectedData('options')[i]);
			}else{
				$scope.error_list.push($scope.gridGetSelectedData('options')[i]);
			}
		}
		var zTree = $.fn.zTree.getZTreeObj("treeDemo");
		var node = zTree.getSelectedNodes()[0];
		$scope.file_list.is_cut = true;
		$scope.file_list.fdrid = node.fdrid;
		
		BasemanService.openFrm("views/baseman/file_structure.html", file_structure, $scope, "", "").result.then(function(res) {
			$scope.cut_file(0,res);
		})
	}
	var file_structure = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		file_structure = SinoccCommon.extend(file_structure, ctrl_bill_public);
		file_structure.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
		$scope.objconf = {
			name: "myfiles",
			key: "fileid",
			FrmInfo: {},
			grids: []
		};
		var setting = {
			async: {
				enable: true,
				url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
				autoParam: ["id", "name=n", "level=lv"],
				otherParam: {
					"id": 108
				},
				dataFilter: filter
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				//beforeExpand: beforeExpand
			}
		};

		function beforeExpand(treeId, treeNode) {
			if(treeNode.children) {
				return;
			}
			/**var postdata = treeNode
			BasemanService.RequestPost('scpfdr', 'selectref', postdata)
				.then(function(data) {
					data.children = data.fdrs;
					if(data.children) {
						treeNode.children = [];
						var zTree = $.fn.zTree.getZTreeObj("treeDemo_frm");
						for(var i = 0; i < data.children.length; i++) {
							data.children[i].isParent = true;
							data.children[i].name = data.children[i].fdrname
							data.children[i].pId = parseInt(treeNode.id);
							data.children[i].id = parseInt(data.children[i].fdrid)
							data.children[i].item_type = 1;
							zTree.addNodes(treeNode, data.children[i])
						}
					}
				});*/
		}

		function filter(treeId, parentNode, childNodes) {
			if(parentNode && parentNode.children) {
				return '';
			}
			var postdata = parentNode;
			var init_data = BasemanService.RequestPostSync('scpfdr', "selectref", postdata);

			var children = init_data.fdrs;
			if(children) {
				parentNode.children = [];
				for(var i = 0; i < children.length; i++) {
					children[i].isParent = true;
					children[i].name = children[i].fdrname
					children[i].pId = parseInt(parentNode.id);
					children[i].id = parseInt(children[i].fdrid)
					children[i].item_type = 1;
				}
				//$scope.options.api.setRowData(children);
			}
			return children
		}
		$scope.clearinformation = function() {
			$timeout(function() {
				$scope.zTree = $.fn.zTree.init($("#treeDemo_frm"), setting, $scope.$parent.tree_data)
			});
		}

		$scope.ok = function() {
			if($scope.validate()) {
				var node = $scope.zTree.getSelectedNodes();
				$modalInstance.close(node[0]);
			}
		}

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		}
		$scope.validate = function() {
			var node = $scope.zTree.getSelectedNodes();
			if(node == '' || node == undefined) {
				BasemanService.notice('请选中一行');
				return false;
			}
			if(node[0].id == 0 || node[0].wsid) {
				BasemanService.notice('最上级无法加文件','alert-warning');
				return false;
			}
			return true;
		}
		$scope.initdata();
	}
	//共享
	$scope.share = function(flag) {
		if(flag == 3) {
			$scope.choose_grid = true;
		} else {
			hideRMenu();
			$scope.choose_grid = false;
		}

		BasemanService.openFrm("views/baseman/share.html", share, $scope, "", "").result.then(function(data) {
			//文件权限
			if(flag == 3) {

				//上级人员取出
				var zTree = $.fn.zTree.getZTreeObj("treeDemo");
				var node = $scope.zTree.getSelectedNodes()[0];
				BasemanService.RequestPost('scpobjright', 'select', {
						idpath: node.idpath,
						typepath: node.typepath
					})
					.then(function(res) {
						var node = $scope.zTree.getSelectedNodes()[0];
						for(var i = 0; i < res.objrights.length; i++) {
							res.objrights[i].accesstype = 2;
							res.objrights[i].accesspath = node.name;
						}
						for(var i = 0; i < data.length; i++) {
							data[i].accesstype = 1;
						}
						data = data.concat(res.objrights);
						var node = $scope.gridGetRow('options');
						BasemanService.RequestPost('scpobjright', 'update', {
								objrights: data,
								typepath: node.typepath,
								idpath: node.idpath
							})
							.then(function(data) {
								BasemanService.notice('共享成功');
							})
					})
			} else {
				var zTree = $.fn.zTree.getZTreeObj("treeDemo");
				var node = $scope.zTree.getSelectedNodes()[0];
				BasemanService.RequestPost('scpobjright', 'update', {
						objrights: data,
						typepath: node.typepath,
						idpath: node.idpath
					})
					.then(function(data) {
						BasemanService.notice('共享成功');
					})
			}

		})
	}

	var share = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		share = SinoccCommon.extend(share, ctrl_bill_public);
		share.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
		$scope.objconf = {
			name: "myfiles",
			key: "fileid",
			FrmInfo: {},
			grids: [{
				optionname: 'options_acl',
				idname: 'files'
			}]
		};

		var share_detail = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
			share_detail = SinoccCommon.extend(share_detail, ctrl_bill_public);
			share_detail.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
			$scope.objconf = {
				name: "myfiles",
				key: "fileid",
				FrmInfo: {},
				grids: []
			};
			$scope.search_orgname = function() {
				$scope.FrmInfo = {
					classid: "scporg",
					backdatas: "orgs",
					sqlBlock: "stat=2 and orgtype=5"
				};

				BasemanService.open(CommonPopController, $scope).result.then(function(data) {
					$scope.data.currItem.orgid = data.orgid;
					$scope.data.currItem.orgname = data.orgname;
				});
			};
			$scope.clearinformation = function() {
				if($scope.$parent.flag == 1) {
					for(name in $scope.$parent.data) {
						$scope.data.currItem[name] = $scope.$parent.data[name];
						if($scope.$parent.data.targettype == 1) {
							$scope.data.currItem.orgname = $scope.$parent.data.receivername;
						} else {
							$scope.data.currItem.username = $scope.$parent.data.receivername;
						}
					}
				} else {
					$scope.data.currItem = {};
					$scope.data.currItem.myright = 1;
					$scope.data.currItem.myright = 1;
					$scope.data.currItem.read = 2;
					var date = new Date();
					$scope.data.currItem.statime = date;
					$scope.data.currItem.endtime = '9999-12-31';
				}

			}
			$scope.del_orgname = function() {
				$scope.data.currItem.orgid = 0;
				$scope.data.currItem.orgname = "";
			};
			$scope.search_user = function() {
				$scope.FrmInfo = {
					classid: "scpuser",
					backdatas: "scpusers",
					sqlBlock: "1=1 "
				};

				BasemanService.open(CommonPopController, $scope).result.then(function(data) {
					$scope.data.currItem.sysuserid = data.sysuserid;
					$scope.data.currItem.username = data.username;

				});
			}
			$scope.clearuser = function() {
				$scope.data.currItem.sysuserid = 0;
				$scope.data.currItem.username = "";

			}
			$scope.myright = function() {
				if($scope.data.currItem.myright == 1) {

					$scope.data.currItem.read = 2;
					$scope.data.currItem.new = 1;
					$scope.data.currItem.modify = 1;
					$scope.data.currItem.delete = 1;
					$scope.data.currItem.export = 1;
					$scope.data.currItem.denied = 1;
					$scope.data.currItem.transfer = 1;

				} else if($scope.data.currItem.myright == 2) {

					$scope.data.currItem.read = 2;
					$scope.data.currItem.new = 2;
					$scope.data.currItem.modify = 2;
					$scope.data.currItem.delete = 2;
					$scope.data.currItem.export = 2;
					$scope.data.currItem.denied = 2;
					$scope.data.currItem.transfer = 2;

				} else {

					$scope.data.currItem.read = 1;
					$scope.data.currItem.new = 1;
					$scope.data.currItem.modify = 1;
					$scope.data.currItem.delete = 1;
					$scope.data.currItem.export = 1;
					$scope.data.currItem.denied = 1;
					$scope.data.currItem.transfer = 1;

				}
			}
			$scope.ok = function() {
				if($scope.validate()) {
					$modalInstance.close($scope.data.currItem);
				}
			}

			$scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			}
			$scope.validate = function() {
				var msg = []
				if(($scope.data.currItem.username == undefined || $scope.data.currItem.username == "") && ($scope.data.currItem.orgname == undefined || $scope.data.currItem.orgname == "")) {
					msg.push("用户和机构不能同时为空");
				}

				if(($scope.data.currItem.statime == undefined || $scope.data.currItem.statime == "") || ($scope.data.currItem.endtime == undefined || $scope.data.currItem.endtime == "")) {
					msg.push("生效日期和结束日期不能为空");
				}
				if($scope.data.currItem.statime > $scope.data.currItem.endtime) {
					msg.push("生效日期大于结束日期");
				}
				if(msg.length > 0) {
					BasemanService.notice(msg);
					return false;
				}
				return true;
			}
			$scope.initdata();
		}
		var share_add = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
			share_add = SinoccCommon.extend(share_add, ctrl_bill_public);
			share_add.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
			$scope.data.currItem = {};
			//用户
			$scope.data.currItem.sj_people = [];
            var TimeFn = null;
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
					for(var i = 0; i < $scope.data.currItem.sj_people.length; i++) {
						if(object.userid == $scope.data.currItem.sj_people[i].userid) {
							BasemanService.notice("选择人员重复", "alert-info");
							return;
						}
					}
				}
				$scope.data.currItem.sj_people.push(object);
			}
			//关闭查询联系人
			$scope.close_people = function() {
				if($scope.data.is_search == 2) {
					$scope.data.is_search = 1;
					$scope.data.username = '';
				}
			}

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

			$scope.contact_people = function(e, index) {

				$scope.index = index;
				$(e.delegateTarget).siblings().removeClass("high");
				$(e.delegateTarget).addClass('high');
				
				$scope.add_sj();

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

			//机构
			$scope.data.currItem.cs_people = [];
			//添加机构
			$scope.add_cs = function() {
				var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
				var node = zTree.getSelectedNodes()[0];

				if(node == undefined || node.isParent != true) {
					BasemanService.notice("请选择机构", "alert-info");
					return;
				}
				var object = {};
				object.orgname = node.name;
				object.orgid = parseInt(node.id);
				for(var i = 0; i < $scope.data.currItem.cs_people.length; i++) {
					if(object.orgid == $scope.data.currItem.cs_people[i].orgid) {
						BasemanService.notice("选择机构重复", "alert-info");
						return;
					}
				}

				$scope.data.currItem.cs_people.push(object);
			}
			//点击当前机构加光标
			$scope.click_cs = function(e, index) {
				$scope.cs_index = index;
				$(e.delegateTarget).siblings().removeClass("high");
				$(e.delegateTarget).addClass('high');
			}
			//删除机构
			$scope.del_cs = function() {
				$scope.data.currItem.cs_people.splice($scope.cs_index, 1);
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
					onClick: onClick_p
				}
			};
			
            function beforeExpand(){
				//双击时取消单机事件
				if(TimeFn){
					clearTimeout(TimeFn);
				}	
			}
			
			function onClick_p(event, treeId, treeNode) {
				
				clearTimeout(TimeFn);  
                //执行延时  
				TimeFn = setTimeout(function(){
					if(treeNode.userid) {
						$scope.add_sj();
					}else{
						$scope.add_cs();
					}
					$scope.$apply();
				},300)
			}
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

		}
		Date.prototype.Format = function(fmt) { //author: meizz 
			var o = {
				"M+": this.getMonth() + 1, //月份 
				"d+": this.getDate(), //日 
				"h+": this.getHours(), //小时 
				"m+": this.getMinutes(), //分 
				"s+": this.getSeconds(), //秒 
				"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
				"S": this.getMilliseconds() //毫秒 
			};
			if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			for(var k in o)
				if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		}
		$scope.add = function() {
			$scope.flag = 2;
			//权限添加机构和用户
			BasemanService.openFrm("views/baseman/share_add.html", share_add, $scope, "", "").result.then(function(data) {
				var acl_data = $scope.gridGetData('options_acl');
				//添加用户
				for(var i = 0; i < data.sj_people.length; i++) {

					data.sj_people[i].receivername = data.sj_people[i].username;
					data.sj_people[i].receiverid = data.sj_people[i].userid;
					data.sj_people[i].myright = 1;
					data.sj_people[i].read = 2;
					data.sj_people[i].new = 1;
					data.sj_people[i].modify = 1;
					data.sj_people[i].delete = 1;
					data.sj_people[i].export = 1;
					data.sj_people[i].denied = 1;
					data.sj_people[i].transfer = 1;
					if($scope.$parent.choose_grid == true) {
						data.sj_people[i].accesstype = 1;
					} else {
						data.sj_people[i].accesstype = 1;
					}

					data.sj_people[i].objaccess = 2111111
					data.sj_people[i].ismanager = 1;
					data.sj_people[i].flag = 2;
					var myDate = new Date();
					data.sj_people[i].statime = new Date().Format("yyyy-MM-dd");
					data.sj_people[i].endtime = '9999-12-31';
					data.sj_people[i].grantor = window.userbean.userid;
					for(var j = 0; j < acl_data.length; j++) {
						if(acl_data[j].receiverid == data.sj_people[i].receiverid) {
							break;
						}
					}
					if(j == acl_data.length) {
						acl_data.push(data.sj_people[i]);
					}
				}
				//添加机构
				for(var i = 0; i < data.cs_people.length; i++) {
					data.cs_people[i].receivername = data.cs_people[i].orgname;
					data.cs_people[i].receiverid = data.cs_people[i].orgid;
					data.cs_people[i].myright = 1;
					data.cs_people[i].read = 2;
					data.cs_people[i].new = 1;
					data.cs_people[i].modify = 1;
					data.cs_people[i].delete = 1;
					data.cs_people[i].export = 1;
					data.cs_people[i].denied = 1;
					data.cs_people[i].transfer = 1;
					data.cs_people[i].flag = 1;
					data.cs_people[i].ismanager = 1;
					if($scope.$parent.choose_grid == true) {
						data.cs_people[i].accesstype = 1;
					} else {
						data.cs_people[i].accesstype = 1;
					}
					data.cs_people[i].objaccess = 2111111;
					var myDate = new Date();
					data.cs_people[i].statime = new Date().Format("yyyy-MM-dd");
					data.cs_people[i].endtime = '9999-12-31';
					data.cs_people[i].grantor = window.userbean.userid
					for(var j = 0; j < acl_data.length; j++) {
						if(acl_data[j].receiverid == data.cs_people[i].receiverid) {
							break;
						}
					}
					if(j == acl_data.length) {
						acl_data.push(data.cs_people[i]);
					}
				}

				$scope.options_acl.api.setRowData(acl_data);

			})

		}
		$scope.del = function() {
			$scope.gridDelItem('options_acl');
		}
		//双击修改机构和用户的权限
		$scope.rowDoubleClick_az = function(e) {
			$scope.flag = 1;
			$scope.data = e.data;
			BasemanService.openFrm("views/baseman/share_detail.html", share_detail, $scope, "", "").result.then(function(res) {
				for(name in res) {
					$scope.data[name] = res[name];
				}
				$scope.data.objaccess = '' + parseInt($scope.data.read || 1) + parseInt($scope.data.new || 1) + parseInt($scope.data.modify || 1) + parseInt($scope.data.delete || 1) + parseInt($scope.data.export || 1) + parseInt($scope.data.denied || 1) + parseInt($scope.data.transfer || 1);
				$scope.options_acl.api.refreshView();
			})
		}
		//权限列表
		$scope.options_acl = {
			rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
			pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
			groupKeys: undefined,
			groupHideGroupColumns: false,
			enableColResize: true, //one of [true, false]
			enableSorting: true, //one of [true, false]
			enableFilter: true, //one of [true, false]
			enableStatusBar: false,
			enableRangeSelection: false,
			rowSelection: "single", // one of ['single','multiple'], leave blank for no selection
			rowDeselection: false,
			quickFilterText: null,
			rowDoubleClicked: $scope.rowDoubleClick_az, //双击事件
			// selectAll:true,
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
		$scope.columns_acl = [{
			headerName: "用户/机构",
			field: "receivername",
			width: 140,
			cellEditor: "弹出框",
			action: $scope.username,
			editable: false

		}, {
			headerName: "权限",
			field: "myright",
			width: 80,
			cellEditor: "下拉框",
			cellEditorParams: {
				values: [{
					value: 1,
					desc: "部分"
				}, {
					value: 2,
					desc: "完全"
				}, {
					value: 3,
					desc: "拒绝"
				}]
			},
			editable: false
		}, {
			headerName: "只读",
			field: "read",
			width: 80,
			cellEditor: "复选框",
			editable: false
		}, {
			headerName: "新增",
			field: "new",
			width: 80,
			cellEditor: "复选框",
			editable: false
		}, {
			headerName: "修改",
			field: "modify",
			width: 80,
			cellEditor: "复选框",
			editable: false
		}, {
			headerName: "删除",
			field: "delete",
			width: 80,
			cellEditor: "复选框",
			editable: false
		}, {
			headerName: "输出",
			field: "export",
			width: 80,
			cellEditor: "复选框",
			editable: false
		}, {
			headerName: "拒绝访问",
			field: "denied",
			width: 100,
			cellEditor: "复选框",
			editable: false
		}, {
			headerName: "可转授",
			field: "transfer",
			width: 100,
			cellEditor: "复选框",
			editable: false
		}, {
			headerName: "授权者",
			field: "grantor",
			width: 80,
			cellEditor: "文本框",
			editable: false

		}, {
			headerName: "生效日期",
			field: "statime",
			width: 120,
			cellEditor: "文本框",
			editable: false
		}, {
			headerName: "失效日期",
			field: "endtime",
			width: 120,
			cellEditor: "文本框",
			editable: false
		}];
		$scope.invorgids = [{
			id: "0",
			name: "<无>"
		}]
		$scope.clearinformation = function() {
			if($scope.$parent.choose_grid == true) {
				var node = $scope.$parent.gridGetRow('options');
			} else {
				var zTree = $.fn.zTree.getZTreeObj("treeDemo");
				var node = $scope.zTree.getSelectedNodes()[0];
			}
			BasemanService.RequestPost('scpobjright', 'select', {
					idpath: node.idpath,
					typepath: node.typepath
				})
				.then(function(data) {
                    data.objrights = $scope.merge_right(data.objrights);
					for(var i = 0; i < data.objrights.length; i++) {
						if(data.objrights[i].objaccess == '1111111'&&data.objrights[i].objaccess_fdr == '1111111') {
							data.objrights[i].myright = 3;
						} else if(data.objrights[i].objaccess == '2222222') {
							data.objrights[i].myright = 2;
							data.objrights[i].read = 2;
							data.objrights[i].new = 2;
							data.objrights[i].modify = 2;
							data.objrights[i].delete = 2;
							data.objrights[i].export = 2;
							data.objrights[i].denied = 2;
							data.objrights[i].transfer = 2;
						} else {
							data.objrights[i].myright = 1;
							var l = data.objrights[i].objaccess.length;
							
							for(var j = 0; j < data.objrights[i].objaccess.length; j++) {
								var value_file = parseInt(data.objrights[i].objaccess.substr(j, 1) || 1);
								var value_fdr =1;
								if(data.objrights[i].objaccess_fdr){
									 value_fdr = parseInt(data.objrights[i].objaccess_fdr.substr(j, 1) || 1);
								}								
								var value =1
								if(value_file==2||value_fdr==2){
									value =2
								}
								if(j == 0) {
									data.objrights[i].read = value;
								}
								if(j == 1) {
									data.objrights[i].new = value;
								}
								if(j == 2) {
									data.objrights[i].modify = value;
								}
								if(j == 3) {
									data.objrights[i].delete = value;
								}
								if(j == 4) {
									data.objrights[i].export = value;
								}
								if(j == 5) {
									data.objrights[i].denied = value;
								}
								if(j == 6) {
									data.objrights[i].transfer = value;
								}
							}
						}
					}
					$scope.options_acl.api.setRowData(data.objrights);
				})
		}
		$scope.merge_right =function(objrights){
			var data = [];
			for(var i=0;i<objrights.length;i++){
			    if(parseInt(objrights[i].accesstype)==1){
					data.push(objrights[i]);
				}	
			}
			for(var i=0;i<objrights.length;i++){
				for(var j=0;j<data.length;j++){
					if(data[j].receiverid == objrights[i].receiverid){
						data[j].objaccess_fdr = objrights[i].objaccess;
						break;
					}
				}
				if(j==data.length){
					data.push(objrights[i]);
				}
			}
			return data;
		}
		
		$scope.ok = function() {
			if($scope.validate()) {
				var data = $scope.gridGetData('options_acl');
				$modalInstance.close(data);
			}
		}

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		}
		$scope.validate = function() {
			var msg = []
			// if ($scope.data.currItem.filename == undefined || $scope.data.currItem.filenames == "") {
			// msg.push("名称不能为空");
			//   }

			if(msg.length > 0) {
				BasemanService.notice(msg);
				return false;
			}
			return true;

		}

		$scope.initdata();
	}
	$scope.create_file = function() {
		BasemanService.openFrm("views/baseman/create_file.html", create_file, $scope, "", "").result.then(function(res) {
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			var data = $scope.gridGetData('options');
			res.item_type = 1;
			res.name = res.fdrname;
			res.id = res.fdrid;
			data.push(res);
			$scope.options.api.setRowData(data);

			var node = $scope.zTree.getSelectedNodes()[0];
			res.isParent = true;
			res.pId = node.id
			$scope.zTree.addNodes(node, res)
		})
	}
	var create_file = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		create_file = SinoccCommon.extend(create_file, ctrl_bill_public);
		create_file.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
		$scope.objconf = {
			name: "myfiles",
			key: "fileid",
			FrmInfo: {},
			grids: []
		};
		var flag = $scope.$parent.data.flag;
		$scope.invorgids = [{
			id: "0",
			name: "<无>"
		}]
		$scope.clearinformation = function() {
			if(flag == 1) { //1表示查看属性

			} else if(flag == 2) { //2表示增加子节点

			}
		}
		$scope.ok = function() {
			if($scope.validate()) {
				var zTree = $.fn.zTree.getZTreeObj("treeDemo");
				var node = $scope.zTree.getSelectedNodes()[0];
				if(node.id == 0) {
					var postdata = {
						parentid: -4,
						parenttype: 1,
						flag: 0,
						fdrid: 0,
						actived: 2,
					};
				} else {
					var postdata = {
						parentid: node.idpath,
						actived: 2,
						parenttype: node.typepath
					};

				}
				if($scope.data.currItem.filename) {
					postdata.fdrname = $scope.data.currItem.filename;
				}
				if($scope.data.currItem.note) {
					postdata.note = $scope.data.currItem.note;
				}
				BasemanService.RequestPost('scpfdr', 'insert', postdata)
					.then(function(data) {
						$modalInstance.close(data);
					})
			}
		}

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		}
		$scope.validate = function() {
			var msg = []
			if($scope.data.currItem.filename == undefined || $scope.data.currItem.filenames == "") {
				msg.push("名称不能为空");
			}

			if(msg.length > 0) {
				BasemanService.notice(msg);
				return false;
			}
			return true;

		}
		$scope.initdata();
	}

	$scope.new_name = function(flag) {
		hideRMenu();
		if(flag == 1) {
			//左边右键修改文件夹名称
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			var node = $scope.zTree.getSelectedNodes()[0];
			$scope.data.fdrid = node.fdrid;
			$scope.data.fdrname = node.fdrname;
			//右边右键修改文件夹名称
		} else if(flag == 2) {
			//右边右键修改文件名称
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			var treenode = $scope.zTree.getSelectedNodes()[0];
			var node = $scope.gridGetRow('options');
			$scope.data.fdrid = node.fdrid;
			$scope.data.fdrname = node.fdrname;

		} else if(flag == 3) {
			var node = $scope.gridGetRow('options');
			$scope.data.fdrid = node.docid;
			$scope.data.fdrname = node.docname;

		}
		BasemanService.openFrm("views/baseman/new_name.html", new_name, $scope, "", "").result.then(function(data) {
			if(flag == 3) {
				var classid = 'scpdoc';
				var postdata = {
					docname: data.new_name,
					docid: parseInt(data.fileid)
				};
			} else {
				var postdata = {
					fdrname: data.new_name,
					fdrid: parseInt(data.fileid)
				}
				var classid = 'scpfdr';
			}
			BasemanService.RequestPost(classid, 'rename', postdata)
				.then(function(data) {
					if(flag == 1) {
						node.fdrname = data.fdrname;
						node.name = data.fdrname
						$scope.zTree.updateNode(node);
						var data = $scope.gridGetData('options');
						for(var i = 0; i < data.length; i++) {
							if(parseInt(data[i].fdrid) == node.id) {
								data[i].name = node.name;
								$scope.options.api.refreshView();
							}
						}
					} else if(flag == 2) {
						if(treenode.children) {
							for(var i = 0; i < treenode.children.length; i++) {
								if(treenode.children[i].id == data.fdrid) {
									treenode.children[i].name = data.fdrname;
									treenode.children[i].fdrname = data.fdrname;
									$scope.zTree.updateNode(treenode.children[i]);
								}
							}
						}
						node.name = data.fdrname;
						node.fdrname = data.fdrname;
						$scope.options.api.refreshView();
					} else if(flag == 3) {
						node.name = data.docname;
						node.docname = data.docname;
						$scope.options.api.refreshView();
					}
					BasemanService.notice('重命名成功');
				})
		})
	}

	var new_name = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		new_name = SinoccCommon.extend(new_name, ctrl_bill_public);
		new_name.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
		$scope.objconf = {
			name: "myfiles",
			key: "fileid",
			FrmInfo: {},
			grids: []
		};
		$scope.invorgids = [{
			id: "0",
			name: "<无>"
		}]
		$scope.clearinformation = function() {
			$scope.data.currItem.filename = $scope.$parent.data.fdrname;
			$scope.data.currItem.new_name = $scope.$parent.data.fdrname;
			$scope.data.currItem.fileid = $scope.$parent.data.fdrid;
		}
		$scope.ok = function() {
			if($scope.validate()) {
				$modalInstance.close($scope.data.currItem);
			}
		}

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		}
		$scope.validate = function() {
			var msg = []
			if($scope.data.currItem.new_name == undefined || $scope.data.currItem.new_name == "") {
				msg.push("新名称不能为空");
			}

			if(msg.length > 0) {
				BasemanService.notice(msg);
				return false;
			}
			return true;

		}
		$scope.initdata();
	}
	//删除文件夹或文件
	$scope.del_file = function(flag,index) {
		hideRMenu();
		if(index==0){
			ds.dialog.confirm("确定删除？", function() {
				$scope.del_mutifile(flag,index);
			}, function() {
				//if (e) e.currentTarget.disabled = false;
			});
        }else{
			 $scope.del_mutifile(flag,index);
		}
	}
	
	$scope.del_mutifile =function(flag,index){
		$scope.file_list = $scope.gridGetSelectedData('options').length==0?[$scope.gridGetRow('options')]:$scope.gridGetSelectedData('options')
		
		var treenode = $scope.zTree.getSelectedNodes()[0];
		if($scope.file_list.length>0){
			var node = $scope.file_list[index];
			if(node.docid){
				flag=3
			}else{
				flag=2
			}
			
		}
		
		if(flag == 1) {
			//左边右键删除文件
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			var node = $scope.zTree.getSelectedNodes()[0];
			$scope.data.fdrid = node.fdrid;
			$scope.data.fdrname = node.fdrname;
			//右边右键删除文件夹
		} else if(flag == 2) {
			//右边右键删除文件
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			
			//var node = $scope.gridGetRow('options');
			$scope.data.fdrid = node.fdrid;
			$scope.data.fdrname = node.fdrname;

		} else if(flag == 3) {
			
			//var node = $scope.gridGetRow('options');
			$scope.data.fdrid = node.docid;
			$scope.data.fdrname = node.docname;

		}
		if(flag == 3) {
			//校验
			if($scope.eror(index)) {
				if(index<$scope.file_list.length-1){
					$scope.del_file(flag,index+1);
				}					
				return;
			}
			var classid = 'scpdoc';
			var postdata = {
				docname: $scope.data.fdrname,
				docid: parseInt($scope.data.fdrid),
				flag: 1
			};
		} else {
			var postdata = {
				fdrname: $scope.data.fdrname,
				fdrid: parseInt($scope.data.fdrid),
				flag: 1
			}
			var classid = 'scpfdr';
		}
	
		BasemanService.RequestPost(classid, 'delete', postdata)
			.then(function(data) {
				if(flag == 1) {
					node.fdrname = data.fdrname;
					node.name = data.fdrname;
					var pnode = node.getParentNode();
					$scope.zTree.removeNode(node);
					pnode.isParent = true;
					$scope.zTree.updateNode(pnode);
					var data = $scope.gridGetData('options');
					for(var i = 0; i < data.length; i++) {
						if(data[i].id == node.id) {
							data.splice(i, 1);
							$scope.options.api.setRowData(data);
						}
					}
				} else if(flag == 2) {
					if(treenode.children) {
						for(var i = 0; i < treenode.children.length; i++) {
							if(treenode.children[i].id == data.fdrid) {
								treenode.children[i].name = data.fdrname;
								$scope.zTree.removeNode(treenode.children[i]);
								treenode.isParent = true;
								$scope.zTree.updateNode(treenode);
							}
						}
					}
					
					if(index<$scope.file_list.length-1){
						$scope.del_file(2,index+1);
					}else{
						$scope.selectfdr(treenode);
					}
				} else if(flag == 3) {
					
					if(index<$scope.file_list.length-1){
						$scope.del_file(3,index+1);
					}else{
						$scope.selectfdr(treenode);
					}
				}
				//BasemanService.notice('删除成功');
			},function(e){
				if(index<$scope.file_list.length-1){
					$scope.del_file(flag,index+1);
				}else{
					$scope.selectfdr(treenode);
				}
			})
	}
	$scope.addfile = function() {
		$("#dropzone").click();
		//$('#upJQuery').click();
	}
	$scope.process = function() {
		var file = $scope.gridGetRow('options');
		if(parseInt(file.wfid) != 0) {
			//弹出流程图
			$scope.wfid = parseInt(file.wfid);
			BasemanService.openFrm("views/baseman/doc_wf.html", doc_wf, $scope, "", "", false).result.then(function(data) {

			})
		} else {
			//弹出选择流程
			BasemanService.openFrm("views/baseman/choose_wf.html", choose_wf, $scope, "", "", false).result.then(function(data) {
				//选择流程后在查询返回流程的数据，显示在界面上
				BasemanService.RequestPost('scpwftemp', 'selectref', {
						wftempid: data.wftempid
					})
					.then(function(res) {
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
								if(res.wfproctempofwftemps[i].procusertempofwfproctemps.length == 0) {
									$scope.referring(res, file);
									return
								}
								//每个节点信息res.wfproctempofwftemps[i]
								var arr = $scope.if_isposition(res.wfproctempofwftemps[i].procusertempofwfproctemps);
								if(arr) {
									if(arr.length > 1) {
										//某个节点中的审批人isposition=3的有两个人以上时需要选人
										console.log(res.wfproctempofwftemps[i].procusertempofwfproctemps);
										$scope.referring(res, file);
										return;
									}
								}
							}
						}
						//如果都是一个人,直接走流程
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
						postdata.subject = file.docname
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
									//postdata.wfprocofwfs[i].procuserofwfprocs[j].procname = (postdata.wfprocofwfs[i].procuserofwfprocs[j].proctempname);
									if(postdata.wfprocofwfs[i].procuserofwfprocs[j].username == '流程启动者') {
										postdata.wfprocofwfs[i].procuserofwfprocs[j].username = $scope.userbean.username;
										postdata.wfprocofwfs[i].procuserofwfprocs[j].userid = $scope.userbean.userid;
									}
								}
							}

							delete postdata.wfprocofwfs[i].procusertempofwfproctemps

						}
						var zTree = $.fn.zTree.getZTreeObj("treeDemo");
						var node = $scope.zTree.getSelectedNodes()[0];
						postdata.wfobjofwfs = [];
						postdata.wfobjofwfs.push($scope.gridGetRow('options'));
						postdata.wfobjofwfs[0].wfid = 0;
						postdata.wfobjofwfs[0].objtype = 6;
						postdata.wfobjofwfs[0].objid = parseInt(postdata.wfobjofwfs[0].docid)
						postdata.wfobjofwfs[0].procid = 0;
						postdata.wfobjofwfs[0].stat = 0;
						postdata.wfobjofwfs[0].objname = postdata.wfobjofwfs[0].docname;
						postdata.wfobjofwfs[0].objrev = 1;
						BasemanService.RequestPost('scpwf', 'insert', postdata)
							.then(function(data) {
								file.wfid = parseInt(data.wfid);
								$scope.wfid = parseInt(data.wfid);
								$scope.options.api.refreshView();
								BasemanService.openFrm("views/baseman/doc_wf.html", doc_wf, $scope, "", "", false).result.then(function(data) {

								})
								BasemanService.notice("提交成功", "alert-info");
							})
					})

			})
		}
	}

	//该方法用于判断节点中是否有isposition==3;
	$scope.if_isposition = function(arrays) {
		for(var i = 0; i < arrays.length; i++) {
			if(arrays[i].isposition == 3) {
				var arr = arrays;
			}
		}
		return arr;
	}

	$scope.referring = function(res, file) {
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
			postdata.subject = file.docname
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
						//postdata.wfprocofwfs[i].procuserofwfprocs[j].procname = (postdata.wfprocofwfs[i].procuserofwfprocs[j].proctempname);
						if(postdata.wfprocofwfs[i].procuserofwfprocs[j].username == '流程启动者') {
							postdata.wfprocofwfs[i].procuserofwfprocs[j].username = $scope.userbean.username;
							postdata.wfprocofwfs[i].procuserofwfprocs[j].userid = $scope.userbean.userid;
						}
					}
				}

				delete postdata.wfprocofwfs[i].procusertempofwfproctemps

			}
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			var node = $scope.zTree.getSelectedNodes()[0];
			postdata.wfobjofwfs = [];
			postdata.wfobjofwfs.push($scope.gridGetRow('options'));
			postdata.wfobjofwfs[0].wfid = 0;
			postdata.wfobjofwfs[0].objtype = 6;
			postdata.wfobjofwfs[0].objid = parseInt(postdata.wfobjofwfs[0].docid)
			postdata.wfobjofwfs[0].procid = 0;
			postdata.wfobjofwfs[0].stat = 0;
			postdata.wfobjofwfs[0].objname = postdata.wfobjofwfs[0].docname;
			postdata.wfobjofwfs[0].objrev = 1;
			BasemanService.RequestPost('scpwf', 'insert', postdata)
				.then(function(data) {
					file.wfid = parseInt(data.wfid);
					$scope.wfid = parseInt(data.wfid);
					$scope.options.api.refreshView();
					BasemanService.openFrm("views/baseman/doc_wf.html", doc_wf, $scope, "", "", false).result.then(function(data) {

					})
					BasemanService.notice("提交成功", "alert-info");
				})
		})

	}
	var doc_wf = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		doc_wf = SinoccCommon.extend(doc_wf, ctrl_bill_public);
		doc_wf.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
		$scope.objconf = {
			name: "myfiles",
			key: "fileid",
			FrmInfo: {},
			grids: []
		};
		$scope.refresh = function() {
			var node = $scope.$parent.zTree.getSelectedNodes()[0];
			$scope.selectfdr(node);
		};

		$scope.data.currItem = {};
		$scope.ok = function() {

			$modalInstance.close($scope.data.currItem);
		}
		$scope.close_down = function(e) {
			$modalInstance.dismiss('cancel');
		}
		BasemanService.RequestPost('scpwf', 'select', {
				wfid: $scope.$parent.wfid
			})
			.then(function(data) {
				$scope.data.currItem = data;
			})
	}
	var choose_wf = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		choose_wf = SinoccCommon.extend(choose_wf, ctrl_bill_public);
		choose_wf.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
		$scope.objconf = {
			name: "myfiles",
			key: "fileid",
			FrmInfo: {},
			grids: []
		};
		$scope.ok = function() {
			var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
			var treeNode = zTree.getSelectedNodes()[0];
			$modalInstance.close(treeNode);
		}
		$scope.cancel = function(e) {
			$modalInstance.dismiss('cancel');
		}
		var setting = {
			async: {
				enable: true,
				url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
				autoParam: ["id", "name=n", "level=lv"],
				otherParam: {
					"flag": 1
				},
				dataFilter: filter
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				beforeExpand: beforeExpand,
				onAsyncSuccess: onAsyncSuccess
			}
		};

		function beforeExpand(treeId, treeNode) {
			/**var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
			var treeNode = zTree.getSelectedNodes()[0];
			if(treeNode.children){
				return;
			}
			var postdata = treeNode
			postdata.flag=2;
			BasemanService.RequestPost('scpfdr', 'selectref', postdata)
			.then(function(data) {
				
				data.children = data.wftemps;
				if(data.children){
					treeNode.children=[];
					var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
					for(var i=0;i<data.children.length;i++){
							data.children[i].name = data.children[i].wftempname
							data.children[i].pId=parseInt(treeNode.id);
							data.children[i].id = parseInt(data.children[i].wftempid)
							
					}
                    zTree.addNodes(treeNode,data.children)					
				}
							
			});*/
		}

		function onAsyncSuccess(event, treeId, treeNode, msg) {
			showLog("[ " + getTime() + " onAsyncSuccess ]&nbsp;&nbsp;&nbsp;&nbsp;" + ((!!treeNode && !!treeNode.name) ? treeNode.name : "root"));
		}

		function filter(treeId, parentNode, childNodes) {
			var treeNode = parentNode;
			if(treeNode && treeNode.children) {
				return;
			}
			var postdata = treeNode
			postdata.flag = 2;
			postdata.excluderight = 2;

			var obj = BasemanService.RequestPostNoWait('scpfdr', 'selectref', postdata)
			var children = obj.data.fdrs.concat(obj.data.wftemps);
			if(children) {
				treeNode.children = [];
				for(var i = 0; i < children.length; i++) {
					if(children[i].wftempid) {
						children[i].name = children[i].wftempname
						children[i].id = parseInt(children[i].wftempid)
					}
					if(children[i].fdrid) {
						children[i].isParent = true;
						children[i].name = children[i].fdrname;
						children[i].id = parseInt(children[i].fdrid)
					}
				}
			}
			return children;

		}

		function showIconForTree(treeId, treeNode) {
			return !treeNode.isParent;
		};
		BasemanService.RequestPost('scpworkspace', 'selectref', {
				wsid: -19,
				wstag: -19,
				wsname: '工作流工作区',
				wstype: 1,
				excluderight: 2,
				entid: 1
			})
			.then(function(data) {
				for(var i = 0; i < data.fdrs.length; i++) {
					data.fdrs[i].name = data.fdrs[i].fdrname;
					data.fdrs[i].id = data.fdrs[i].fdrid;
					data.fdrs[i].isParent = true;
				}
				var zNodes = data.fdrs;
				zTree = $.fn.zTree.init($("#treeDemo4"), setting, zNodes);
			})
	}

	//发邮件
	$scope.send_email = function() {
		$scope.file = [];
		var file = $scope.gridGetRow('options');
		$scope.file = $scope.gridGetSelectedData('options');;

		BasemanService.openFrm("views/baseman/send_mail.html", send_mail, $scope, "", "", false).result.then(function(data) {

		})
	}
	$scope.download = function(params) {
		var data = $scope.gridGetRow('options');
		var url = "/downloadfile.do?iswb=true&filecode=" + data.downloadcode;

		window.open(url);
	}
	//替换
	$scope.exchange = function(flag) {
		//校验
		if($scope.eror()) {
			return;
		}
		$scope.replace_file = $scope.gridGetRow('options');
		BasemanService.openFrm("views/baseman/replace_file.html", replace_file, $scope, "", "", false).result.then(function(data) {
			var treeNode = $scope.zTree.getSelectedNodes()[0];
			var postdata = {};
			postdata.docname = $scope.replace_file.docname;
			postdata.docid = $scope.replace_file.docid;
			postdata.idpath = treeNode.idpath;
			postdata.docid_new = data.docid;
			postdata.fdrid = treeNode.fdrid;

			//UpWebReplaceFile
			if(data.is_th == 2) {
				postdata.isvirtual = $scope.replace_file.isvirtual;
				var classid = 'scpfdr'
				var action = 'upwebreplacefile'
			} else {
				postdata.rev_docid = data.docid;

				var classid = 'scpdoc_web_rev'
				var action = 'add_rev'

			}
			BasemanService.RequestPost(classid, action, postdata)
				.then(function(res) {
					//刷新节点
					var node = $scope.zTree.getSelectedNodes()[0];
					$scope.selectfdr(node);
					if(data.is_th == 2) {
						BasemanService.notice("替换成功", "alert-warning")
					} else {
						BasemanService.notice("版本升级成功", "alert-warning")
					}
				})
		})
	}
	var replace_file = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		replace_file = SinoccCommon.extend(replace_file, ctrl_bill_public);
		replace_file.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
		$scope.data = $scope.$parent.replace_file;
		$scope.data.currItem = {};
		$scope.data.currItem.is_th = 2
		$scope.add_file = function() {
			$("#dropzone_add").click();
		}
		$scope.get = function(name) {
			var doc = {};
			doc.docname = name;
			if(doc.docname && (doc.docname.toLowerCase().toString().endsWith(".jpg") || doc.docname.toLowerCase().endsWith(".png") || doc.docname.toLowerCase().endsWith(".jpeg") || doc.docname.toLowerCase().endsWith(".bmp"))) {
				return '.jpg,.png,.jpeg,.bmp'
			} else if(doc.docname && (doc.docname.toLowerCase().endsWith(".doc") || doc.docname.toLowerCase().endsWith(".docx"))) {
				return '.doc,.docx'
			} else if(doc.docname && doc.docname.toLowerCase().endsWith(".xlsx") || doc.docname.toLowerCase().endsWith(".xls")) {
				return '.xlsx,.xls'
			} else if(doc.docname && doc.docname.toLowerCase().endsWith(".txt")) {
				return '.txt'
			} else if(doc.docname && (doc.docname.toLowerCase().endsWith(".ppt")) || (doc.docname.toLowerCase().endsWith(".pptx"))) {
				return '.ppt,.pptx'
			} else if(doc.docname && (doc.docname.toLowerCase().endsWith(".pdf"))) {
				return '.pdf'
			} else {
				return ''
			}
		}
		$scope.ok = function() {
			$modalInstance.close($scope.data.currItem);
		}
		$scope.cancel = function(e) {
			$modalInstance.dismiss('cancel');
		}
		$timeout(function() {
			var tpl = $("<div id='preview-template' style='display: none;'><div></div></div>");
			$("#dropzone_add").dropzone({
				url: '/web/scp/filesuploadsave2.do',
				maxFilesize: 500,
				paramName: "docFile0",
				fallback: function() {
					BasemanService.notice("浏览器版本太低,文件上传功能将不可用！", "alert-warning");
				},
				acceptedFiles: $scope.get($scope.data.docname),
				autoProcessQueue: false,
				uploadMultiple: false,
				addRemoveLinks: true,
				params: {
					scpsession: window.strLoginGuid,
					sessionid: window.strLoginGuid
				},
				previewTemplate: tpl.prop("outerHTML"),
				maxThumbnailFilesize: 5,
				//uploadMultiple:true,
				init: function() {
					var myzone = this;
					//myzone.options.acceptedFiles =$scope.get($scope.data.docname);
					this.on('addedfile', function(file) {

						if(myzone.files.length > 1) {
							myzone.files.splice(0, 1);
						}
						$scope.data.currItem.docname = file.name;
						$scope.$apply();
					})
					$scope.ok = function() {
						myzone.processQueue();

					}
					this.on('success', function(file, json) {
						try {
							var node = $scope.zTree.getSelectedNodes()[0];
							var object = strToJson(json);
							BasemanService.RequestPost('scpfdrref', 'insert', {
									refid: object.data[0].docid,
									fdrid: node.fdrid,
									reftype: 6,
									wsid: -4,
									idpath: node.idpath,
									objaccess: node.objaccess
								})
								.then(function(data) {})
							BasemanService.RequestPost('scpfdr', 'upwebscpdoc', {
									wsid: -4,
									idpath: node.idpath,
									typepath: node.typepath,
									docid: object.data[0].docid
								})
								.then(function(data) {})
							for(name in object.data[0]) {
								$scope.data.currItem[name] = object.data[0][name];
							}

						} catch(e) {
							BasemanService.notice("上传数据异常!", "alert-warning");
						}
					})
					this.on('complete', function(file) {
						$modalInstance.close($scope.data.currItem);
					})
					this.on("error", function() {
						console.log("File upload error");
					})
				}
			});
		})

	}
	$scope.history_version = function(flag) {

		BasemanService.openFrm("views/baseman/history_version.html", history_version, $scope, "", "", false).result.then(function(data) {

		})
	}
	var history_version = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		history_version = SinoccCommon.extend(history_version, ctrl_bill_public);
		history_version.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
		//$scope.data = $scope.$parent.replace_file;
		var postdata = $scope.gridGetRow('options');
		BasemanService.RequestPost('scpdoc_web_rev', 'search', postdata)
			.then(function(data) {
				$scope.options_version.api.setRowData(data.scpdoc_web_revs);
			})
		$scope.add_file = function() {
			$("#dropzone_add").click();
		}
		$scope.ok = function() {
			$modalInstance.close($scope.data.currItem);
		}
		$scope.cancel = function(e) {
			$modalInstance.dismiss('cancel');
		}
		//加
		$scope.open_view = function() {
			var data = $scope.gridGetRow('options_version');
			$scope.viewDoc(data);
		}
		//输出版本
		$scope.out_version = function() {
			var data = $scope.gridGetRow('options_version');
			var url = "/downloadfile.do?iswb=true&filecode=" + data.downloadcode;
			window.open(url);
		}
		//删除版本
		$scope.del_version = function() {
			var data = $scope.gridGetRow('options_version');
			if(parseInt(data.wfid) > 0) {
				BasemanService.notice("该文件正在走流程", "alert-warning")
				return;
			}
			if(parseInt(data.stat) == 8) {
				BasemanService.notice("该文件已归档", "alert-warning")
				return;
			}
			var node = $scope.zTree.getSelectedNodes()[0];
			postdata = data;
			postdata.idpath = node.idpath;
			postdata.fdrid = node.fdrid;
			BasemanService.RequestPost('scpdoc_web_rev', 'delete', postdata)
				.then(function(res) {
					var index = $scope.options_version.api.getFocusedCell().rowIndex;
					var data = $scope.gridGetData('options_version');
					data.splice(index, 1);
					$scope.options_version.api.setRowData(data);
				})
		}
		//打开文件
		$scope.open_version = function() {
			$scope.open_view();
		}

		$scope.options_version = {
			rowDoubleClicked: $scope.open_view,
			suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
			rowHeight: 25,
			enableColResize: true,
			icons: {
				groupExpanded: '<i class="fa fa-minus-square-o"/>',
				groupContracted: '<i class="fa fa-plus-square-o"/>',
				columnRemoveFromGroup: '<i class="fa fa-remove"/>',
				filter: '<i class="fa fa-filter"/>',
				sortAscending: '<i class="fa fa-long-arrow-down"/>',
				sortDescending: '<i class="fa fa-long-arrow-up"/>',
			}
		};
		$scope.columns_version = [{
			headerName: "版本",
			field: "rev",
			width: 100
		}, {
			headerName: "名字",
			field: "docname",
			width: 170
		}, {
			headerName: "编码",
			field: "code",
			width: 120
		}, {
			headerName: "用户",
			field: "creator",
			width: 100
		}, {
			headerName: "时间",
			field: "filetime",
			width: 130,
			cellEditor: "时分秒"
		}, {
			headerName: "动作",
			field: "act",
			width: 100,
			cellEditor: "文本框",
			cellRenderer: function(params) {
				if(params.data.updatetime) {
					return '检入'
				} else {
					return '创建'
				}
			}
		}];
		$timeout(function() {
			var tpl = $("<div id='preview-template' style='display: none;'><div></div></div>");
			$("#dropzone_add").dropzone({
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
							var object = strToJson(json);
							for(name in object.data[0]) {
								$scope.data.currItem[name] = object.data[0][name];
								$scope.$apply();
							}

						} catch(e) {
							BasemanService.notice("上传数据异常!", "alert-warning");
						}
					})
					this.on("error", function() {
						console.log("File upload error");
					})
				}
			});
		})

	}
	//右键菜单
	function getContextMenuItems(params) {
		if(params.node&&params.node.selected==false){
			params.node.setSelected(true,true);
		}else{
			
		}
		
		$scope.data.flag = 2;
		var obj1 = { // custom item
			name: '搜索',
			action: function() {
				window.alert('Alerting about ' + params.value);
			},
			cssClasses: ['redFont', 'bold']
		}
		var obj2 = {
			name: '复制到',
			action: function(params) {
				return $scope.file_copy(2);
			}
		}
		var obj3 = {
			name: '移动到',
			action: function(params) {
				return $scope.file_move(2);
			}
		}
		var obj4 = {
			name: '权限',
			action: function(params) {
				return $scope.share(3);
			}
		}
		//文件夹删除
		var obj4_2 = {
			name: '删除',
			action: function(params) {
				return $scope.del_file(2,0);
			}
		}
		//文件删除
		var obj4_3 = {
			name: '删除',
			action: function(params) {
				return $scope.del_file(3,0);
			}
		}
		//文件夹重命名
		var obj5_2 = {
			name: '重命名',
			action: function(params) {
				return $scope.new_name(2);
			}
		}
		//文件重命名
		var obj5_3 = {
			name: '重命名',
			action: function(params) {
				return $scope.new_name(3);
			}
		}
		var obj6 = {
			name: '替换',
			action: function(params) {
				return $scope.exchange(3);
			}
		}
		var obj7 = {
			name: '历史版本',
			action: function(params) {
				return $scope.history_version(3);
			}
		}
		var obj8 = {
			name: '发邮件',
			action: function(params) {
				return $scope.send_email(3);
			}
		}
		var obj9 = {
			name: '流程',
			action: function(params) {
				return $scope.process(3);
			}
		}
		var obj10 = {
			name: '下载',
			action: function(params) {
				return $scope.download(params);
			}
		}
		var obj11 = {
			name: '',
			action: function(params) {
				return $scope.open_double(3);
			}
		}
		if(params.value) {
			//itemtype 1 文件夹 2 文件
			var result = [];
			//解析权限
			$scope.judge_left(params.node.data);
			//如果是文件夹
			if(params.node.data.item_type == 1) {
				result.push({ // custom item
					name: '搜索',
					action: function() {
						window.alert('Alerting about ' + params.value);
					},
					cssClasses: ['redFont', 'bold']
				})
				//判断是否有转授权限
				if($scope.data.transfer == 2 || $scope.userbean.userid == 'admin') {
					result.push(obj2);
					result.push(obj3);
					result.push(obj4);
					result.push(obj4_2);
					result.push(obj5_2);
				} else {
					//判断是否有删除的权限
					if($scope.data.delete == 2) {
						result.push(obj2);
						result.push(obj3);
						result.push(obj4_2);
						result.push(obj5_2);

					} else {
						//判断是否有修改的权限
						if($scope.data.modify == 2) {
							result.push(obj2);
							result.push(obj3);
							result.push(obj4_2);
							result.push(obj5_2);
						}
					}
				}
			} else {

				//判断是否有转授权限
				if($scope.data.transfer == 2 || $scope.userbean.userid == 'admin') {
					result.push(obj2);
					result.push(obj3);
					result.push(obj4);
					result.push(obj6);
					result.push(obj7);
					result.push(obj8);
					result.push(obj4_3);
					result.push(obj5_3);
					result.push(obj9);
					result.push(obj10);
				} else {
					//判断是否有删除的权限
					if($scope.data.delete == 2) {
						result.push(obj2);
						result.push(obj3);
						result.push(obj6);
						result.push(obj7);
						result.push(obj8);
						result.push(obj4_3);
						result.push(obj5_3);
						result.push(obj9);
						result.push(obj10);

					} else {
						//判断是否有修改的权限
						if($scope.data.modify == 2) {
							result.push(obj2);
							result.push(obj3);
							result.push(obj6);
							result.push(obj7);
							result.push(obj8);
							result.push(obj5_3);
							result.push(obj9);
							result.push(obj10);
						} else {
							//判断是否有新增的权限
							if($scope.data.new == 2) {
								result.push(obj7);
								result.push(obj8);
								result.push(obj9);
								result.push(obj10);
							} else {
								//判断是否有输出的权限
								if($scope.data.new == 2) {
									result.push(obj7);
									result.push(obj8);
									result.push(obj10);
								} else {
									//判断是否有只读的权限
									if($scope.data.read == 2) {
										result.push(obj7);
									}
								}
							}
						}
					}
				}
			}

		} else {
			//右边空白处
			var result = [{ // custom item
					name: '搜索',
					action: function() {
						window.alert('Alerting about ' + params.value);
					},
					cssClasses: ['redFont', 'bold']
				},
				{ // custom item
					name: '刷新',
					action: function(){
					  var node = $scope.zTree.getSelectedNodes()[0];
					  return $scope.selectfdr(node)
					},
					tooltip: 'Very long tooltip, did I mention that I am very long, well I am! Long!  Very Long!'
				}
			]
			//判断左边权限
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			var node = $scope.zTree.getSelectedNodes()[0];
			$scope.judge_left(node);
			if($scope.data.modify == 2) {
				result.push('separator');
				result.push({ // custom item
					name: '复制到',
					action: function() {
						console.log('Windows Item Selected');
					}
				})
				result.push({ // custom item
					name: '移动到',
					action: function() {
						console.log('Windows Item Selected');
					}
				})
			}
			if($scope.data.new == 2) {
				result.push('separator');
				result.push({
					name: '新建',
					subMenu: [{
						name: '文件夹',
						action: $scope.create_file,
						icon: '<img src="../img/file.png"/>'
					}]
				})
				result.push('separator');
				result.push({ // custom item
					name: '文件录入',
					action: $scope.addfile,
					cssClasses: ['dropzone']
				})
				/**result.push({
					name: '导入',
					subMenu: [{
							name: '文件夹',
							action: function() {
								console.log('Niall was pressed');
							},
							icon: '<img src="../img/file.png"/>'
						},
						{
							name: '文档',
							action: function() {
								console.log('Niall was pressed');
							},
							icon: '<img src="../img/file.png"/>'
						}
					]
				})*/
			}
		}
		return result;
	}
	$scope.rowDoubleClicked = function(e) {
		var data = $scope.gridGetRow('options');
		if(data.docid) {
			//域名
			var net ='www.mshsoft.cn:8001'
			$scope.viewDoc(data);
		} else {
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			var postdata = {};
			for(name in e.data) {
				if(name != 'children') {
					postdata[name] = e.data[name];
				}
			}
			BasemanService.RequestPost('scpfdr', 'selectref', postdata)
				.then(function(data) {
					data.children = data.fdrs;
					var treeNode = $scope.zTree.getNodesByParam("id", e.data.fdrid, null);
					//var treeNode = zTree.getNodesByParam("id",e.data.id,null);
					$scope.zTree.selectNode(treeNode[0]);
					if(data.children) {
						for(var i = 0; i < data.docs.length; i++) {
							data.docs[i].name = data.docs[i].docname;
						}

						//treeNode[0].children=[];

						for(var i = 0; i < data.fdrs.length; i++) {
							data.fdrs[i].name = data.fdrs[i].fdrname;
							data.fdrs[i].item_type = 1;
						}
						$scope.data.currItem.files = data.fdrs.concat(data.docs);;

						for(var i = 0; i < data.children.length; i++) {
							data.children[i].isParent = true;
							data.children[i].name = data.children[i].fdrname
							data.children[i].pId = parseInt(treeNode.id);
							data.children[i].id = parseInt(data.children[i].fdrid)
							data.children[i].item_type = 1;
						}
						if(!treeNode[0].children) {
							treeNode[0].children = [];
							$scope.zTree.addNodes(treeNode[0], data.children);
						}
						$scope.zTree.expandNode(treeNode[0], true, false, true, true);
						$timeout(
							function() {

								$scope.options.api.setRowData($scope.data.currItem.files);
								$scope.options.api.hideOverlay();
							}, 250
						)

					}

				});
		}

	}
    
	$('#dropzone').click(function(e){
		if(e.target.className=="ag-body-viewport"){
		    $scope.options.api.deselectAll();
		}else{
			
		}
		
		
	})
	$scope.options = {
		rowDoubleClicked: $scope.rowDoubleClicked,
		suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
		rowDeselection:true,
		//rowClicked:$scope.setUnselect,
		rowHeight: 25,
		getContextMenuItems: getContextMenuItems,
		getNodeChildDetails: function(file) {
			if(file.group) {
				file.group = file.group;
				return file;
			} else {
				return null;
			}
		},
		enableColResize: true,
		icons: {
			groupExpanded: '<i class="fa fa-minus-square-o"/>',
			groupContracted: '<i class="fa fa-plus-square-o"/>',
			columnRemoveFromGroup: '<i class="fa fa-remove"/>',
			filter: '<i class="fa fa-filter"/>',
			sortAscending: '<i class="fa fa-long-arrow-down"/>',
			sortDescending: '<i class="fa fa-long-arrow-up"/>',
		}
	};

	function imageRenderer(params) {
		if(params.data.item_type == 1) {
			return "<img src='/web/img/file.png'>" + params.data[params.colDef.field];
		} else {
			var classname = SinoccCommon.getAttachIcon(params.value);
			var plus = '';
			if(parseInt(params.data.wfid) > 0) {
				plus += ';background-color:#5de466';
			}
			if(parseInt(params.data.stat) == 8) {
				plus += ';background-color:#e2e20e';
			}

			var color = '';
			if(classname == 'fa-file-pdf-o') {
				color = 'style="color:#8c0404' + plus + '"';
			} else if(classname == 'fa-file-excel-o') {
				color = 'style="color:green' + plus + '"'
			} else if(classname == 'fa-file-word-o') {
				color = 'style="color:#0808de' + plus + '"'
			} else if(classname == 'fa-file-powerpoint-o') {
				color = 'style="color:red' + plus + '"'
			} else if(classname == 'fa-file-image-o') {
				color = 'style="color:blue' + plus + '"';
			} else {
				color = ''
			}

			return '<i class="fa ' + classname + ' fa-lg"' + color + '>' + '</i>' + params.data[params.colDef.field];
		}
	}

	function itemtypeRenderer(params) {
		if(parseInt(params.value) == 1) {
			return '文件夹';
		} else {
			doc = params.data;
			if(doc.docname && (doc.docname.toLowerCase().toString().endsWith(".jpg") || doc.docname.toLowerCase().endsWith(".png") || doc.docname.toLowerCase().endsWith(".jpeg") || doc.docname.toLowerCase().endsWith(".bmp"))) {
				return '图片文件'
			} else if(doc.docname && (doc.docname.toLowerCase().endsWith(".doc") || doc.docname.toLowerCase().endsWith(".docx"))) {
				return 'word 文件'
			} else if(doc.docname && doc.docname.toLowerCase().endsWith(".xlsx") || doc.docname.toLowerCase().endsWith(".xls")) {
				return 'excel 文件'
			} else if(doc.docname && doc.docname.toLowerCase().endsWith(".txt")) {
				return '文本文件'
			} else if(doc.docname && (doc.docname.toLowerCase().endsWith(".ppt")) || (doc.docname.toLowerCase().endsWith(".pptx"))) {
				return 'PPT 文件'
			} else if(doc.docname && (doc.docname.toLowerCase().endsWith(".pdf"))) {
				return 'pdf 文件'
			} else {
				return '其它文件'
			}

		}
	}
	/**网格配置*/
	{
		$scope.columns = [{
			headerName: "名称",
			field: "name",
			width: 280,
			onclick: $scope.rowClicked,
			//cellClass:function(params){return cellClassf(params)},
			cellRenderer: function(params) {
				return imageRenderer(params)
			},
			//cellClass: 'fa fa-file-excel-o'

		}, {
			headerName: "类型",
			field: "item_type",
			width: 100,
			cellEditor: "文本框",
			cellRenderer: function(params) {
				return itemtypeRenderer(params)
			}
		}, {
			headerName: "版本",
			field: "isvirtual",
			width: 80,
			cellStyle: {
				'font-style': 'normal'
			}
		}, {
			headerName: "大小",
			field: "oldsize",
			width: 100,
			cellStyle: {
				'font-style': 'normal'
			}
		}, {
			headerName: "时间",
			field: "createtime",
			width: 100,
			cellEditor: "时分秒",
			cellStyle: {
				'font-style': 'normal'
			}
		}, {
			headerName: "用户",
			field: "creator",
			width: 100,
			cellEditor: "文本框",
			cellStyle: {
				'font-style': 'normal'
			}
		}];
	}

	function cellClassf(params) {
		if(params.data.item_type != 1) {
			var classname = SinoccCommon.getAttachIcon(params.value);
			return 'fa ' + classname + ' fa-lg';
		}
	}
	$scope.initdata();

	var setting = {
		async: {
			enable: true,
			url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
			autoParam: ["id", "name=n", "level=lv"],
			otherParam: {
				"id": 108
			},
			dataFilter: filter_first
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			//beforeExpand: beforeExpand,
			onRightClick: OnRightClick, //右键事件
			//onAsyncSuccess: onAsyncSuccess,//回调函数，在异步的时候，进行节点处理（有时间延迟的），后续章节处理
			onClick: menuShowNode
		}
	};

	function beforeExpand(treeId, treeNode) {
		if(treeNode.children) {
			return;
		} else {
			return '';
		}
	}

	function filter_first(treeId, parentNode, childNodes) {
		if(parentNode && parentNode.children) {
			return '';
		}
		var postdata = parentNode;
		var init_data = BasemanService.RequestPostSync('scpfdr', "selectref", postdata);

		var children = init_data.fdrs;
		if(children) {
			parentNode.children = [];
			for(var i = 0; i < children.length; i++) {
				children[i].isParent = true;
				children[i].name = children[i].fdrname
				children[i].pId = parseInt(parentNode.id);
				children[i].id = parseInt(children[i].fdrid)
				children[i].item_type = 1;
			}
			//$scope.options.api.setRowData(children);
		}
		return children
	}

	function ajaxGetNodes(treeNode, reloadType) {
		var zTree = $.fn.zTree.getZTreeObj("treeDemo");
		if(reloadType == "refresh") {
			$scope.zTree.updateNode(treeNode);
		}
	}
	$scope.judge_copy =function(treeNode){
		$scope.judge_left(treeNode);
		if($scope.data.transfer==2||$scope.data.modify==2||$scope.data.delete==2){
			return true;
		}else{
			return false;
		}
	}
	
	$scope.judge_left = function(treeNode) {
		if(treeNode.objaccess == '1111111') {
			$scope.data.read = 1;
			$scope.data.new = 1;
			$scope.data.modify = 1;
			$scope.data.delete = 1;
			$scope.data.export = 1;
			$scope.data.denied = 1;
			$scope.data.transfer = 1;
		} else if(treeNode.objaccess == '2222222' || userbean.userauth.admins) {
			$scope.data.read = 2;
			$scope.data.new = 2;
			$scope.data.modify = 2;
			$scope.data.delete = 2;
			$scope.data.export = 2;
			$scope.data.denied = 2;
			$scope.data.transfer = 2;
		} else {
			for(var j = 0; j < 7; j++) {
				var value = parseInt(treeNode.objaccess.substr(j, 1) || 1);
				if(!value||parseInt(value)!=2){
					value = 1;
				}
				if(j == 0) {
					$scope.data.read = value;
				}
				if(j == 1) {
					$scope.data.new = value;
				}
				if(j == 2) {
					$scope.data.modify = value;
				}
				if(j == 3) {
					$scope.data.delete = value;
				}
				if(j == 4) {
					$scope.data.export = value;
				}
				if(j == 5) {
					$scope.data.denied = value;
				}
				if(j == 6) {
					$scope.data.transfer = value;
				}
			}
		}
	}

	function OnRightClick(event, treeId, treeNode) {
		if(treeNode) {
			$scope.judge_left(treeNode);
			var top = $(window).scrollTop();

			$scope.zTree.selectNode(treeNode);
			if(treeNode.getParentNode()) {
				var isParent = treeNode.isParent;
				if(isParent) { //非叶子节点
					showRMenu("firstNode", event.clientX, event.clientY + top); //处理位置，使用的是绝对位置
				} else { //叶子节点
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
	//单击节点 显示节点
	function menuShowNode() {
		var node = $scope.zTree.getSelectedNodes()[0];
		$scope.selectfdr(node);
	}
	//刷新节点
	$scope.selectfdr = function(node) {
		if(node.id == 0) {
			$scope['options'].api.setRowData($scope.data.fdrs_levelOne);
		} else {

			var postdata = {};
			for(name in node) {
				if(name != 'children') {
					postdata[name] = node[name];
				}
			}
			postdata.flag = 1;
			BasemanService.RequestPost('scpfdr', 'selectref', postdata)
				.then(function(data) {
					//如果是文件，那么提前放到左边的父类文件夹中			
					if(data.fdrs) {
						if(!node.children) {
							node.children = [];
							var children = [];
							for(var i = 0; i < data.fdrs.length; i++) {
								data.fdrs[i].isParent = true;
								data.fdrs[i].pId = node.id;
								data.fdrs[i].id = parseInt(data.fdrs[i].fdrid);
								data.fdrs[i].item_type = 1;
								data.fdrs[i].name = data.fdrs[i].fdrname;
								children.push(data.fdrs[i]);
							}
							$scope.zTree.addNodes(node, children, true)
						}

					}
					for(var i = 0; i < data.docs.length; i++) {
						data.docs[i].name = data.docs[i].docname;
					}
					for(var i = 0; i < data.fdrs.length; i++) {
						data.fdrs[i].name = data.fdrs[i].fdrname;
						data.fdrs[i].item_type = 1;
					}
					$scope.data.currItem.files = data.fdrs.concat(data.docs);
					$scope['options'].api.setRowData($scope.data.currItem.files);
					$scope.options.api.hideOverlay();
				});
		}
	}

	BasemanService.RequestPost('scpworkspace', 'selectref', {
			wsid: -4,
			sysuserid: window.userbean.sysuserid
		})
		.then(function(data) {
			var zNodes = {
				icon: '/web/img/computer.png'
			};
			//zNodes.name = window.userbean.userid+"的文件";
			if(userbean.userauth.admins) {
				zNodes.objaccess = '2222222';
			}
			zNodes.name = '公司文档'
			zNodes.id = 0;
			zNodes.isParent = true;
			zNodes.fdrid = 0;
			$scope.data.fdrs_levelOne = data.fdrs
			data.children = data.fdrs;

			for(var i = 0; i < data.children.length; i++) {
				data.children[i].isParent = true;
				data.children[i].name = data.children[i].fdrname;
				//文件夹的时候设置为1
				data.children[i].item_type = 1;
				data.children[i].id = parseInt(data.children[i].fdrid);
			}
			zNodes.children = data.children;
			$scope.tree_data = zNodes;			
			rMenu = $("#rMenu");
			$timeout(function(){
				if($scope.data.currItem.tree_datas){
					$scope.tree_data = $scope.data.currItem.tree_datas;				
				}
				zTree = $.fn.zTree.init($("#treeDemo"), setting, $scope.tree_data);				
				$scope.zTree = $.fn.zTree.getZTreeObj("treeDemo");
				//展开根节点
			    zTree.expandNode(zTree.getNodes()[0], true, false, false);
				//选择节点
				if($scope.data.currItem.selectNode){
					var id = $scope.data.currItem.selectNode[0].id;
					var selectNode = zTree.getNodeByParam('id',id,null);
					zTree.selectNode(selectNode);
				}
			},100)

			
		});

	//加载控制器
	var approval_options = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance, FormValidatorService) {
		approval_options = SinoccCommon.extend(approval_options, ctrl_bill_public);
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
					var obj = "{userid:'" + data[i].userid + "',username:'" + data[i].username + "',positionid:" + data[i].positionid + ",orgname:'" + data[i].orgname + "',proctempid:" + 0 + ",stats:" + 1 + "}";
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
			$modalInstance.close($scope.arrays_sum);
		}
		$scope.cancel = function(e) {
			$modalInstance.dismiss('cancel');
		}
		Array.prototype.indexOf = function(val) {
			for(var k = 0; k < this.length; k++) {
				if(this[k] == val) return k;
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
	var share_add = function($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
		share_add = SinoccCommon.extend(share_add, ctrl_bill_public);
		share_add.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
		$scope.data.currItem = {};

		$scope.title = "添加" + $scope.$parent.proctempname;
		$scope.data.currItem.sj_people = [];
	    var TimeFn = null;
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
				onClick: zTreeOnClick //双击事件
			}
		};
        function beforeExpand(){
			//双击时取消单机事件
			if(TimeFn){
				clearTimeout(TimeFn);
			}	
		}
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
			$modalInstance.close($scope.data.currItem.sj_people);
		}
		//双击选择添加用户和机构
		function zTreeOnClick(event, treeId, treeNode) {
			// 取消上次延时未执行的方法  
			clearTimeout(TimeFn);  
				//执行延时  
			TimeFn = setTimeout(function(){
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
			})
		};
	}
	
	$scope.file_list = [];
	$(document).on("keydown",function (e) {
		if (event.ctrlKey == true && event.keyCode == 67) {//Ctrl+c
		    $scope.file_list = [];
			for(var i=0;i<$scope.gridGetSelectedData('options').length;i++){
				if($scope.judge_copy($scope.gridGetSelectedData('options')[i])){
					$scope.file_list.push($scope.gridGetSelectedData('options')[i]);
				}
			}
		}
		if (event.ctrlKey == true && event.keyCode == 88) {//Ctrl+X
		    $scope.file_list = [];
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			var node = zTree.getSelectedNodes()[0];
			for(var i=0;i<$scope.gridGetSelectedData('options').length;i++){
				if($scope.judge_copy($scope.gridGetSelectedData('options')[i])){
					$scope.file_list.push($scope.gridGetSelectedData('options')[i]);
				}
			}
			$scope.file_list.is_cut = true;
			$scope.file_list.fdrid = node.fdrid;
		
		}
		if (event.ctrlKey == true && event.keyCode == 86) {//Ctrl+v
		    if($scope.file_list.length>0){
				if($scope.file_list.is_cut){
					$scope.cut_file(0);
				}else{
					$scope.copy_file(0);
				}
				
			}
			
		}
		if (event.ctrlKey == true && event.keyCode == 79) {//Ctrl+N
			
		}
	})
	
	$scope.copy_file =function(i,res){
		var docid = $scope.file_list[i].docid;
		var zTree = $.fn.zTree.getZTreeObj("treeDemo");
		var node = res||zTree.getSelectedNodes()[0]; 
		if(node.id==0){
			BasemanService.notice("最上级无法加文件", "alert-info");
			return;
		}
		BasemanService.RequestPost('scpdoc_web_rev', 'copy_to', {
			docid: docid,
			fdrid: node.fdrid,
			idpath: node.idpath,
			typepath: node.typepath
		})
		.then(function(data) {
			menuShowNode();
			//$scope.selectfdr(node);
			if(i<$scope.file_list.length-1){
				$scope.copy_file(i+1,res);
			}else{
				BasemanService.notice("操作成功", "alert-info");
			}
			//BasemanService.notice("粘贴成功", "alert-info");
		})
	}
	
	$scope.cut_file =function(i,res){
		var docid = $scope.file_list[i].docid;
		var docname = $scope.file_list[i].docname;
		var zTree = $.fn.zTree.getZTreeObj("treeDemo");
		var node = res||zTree.getSelectedNodes()[0];
		if(node.id==0){
			BasemanService.notice("最上级无法加文件", "alert-info");
			return;
		}
		var fdrid = $scope.file_list.fdrid;
		BasemanService.RequestPost('scpdoc_web_rev', 'move_to', {
			docname: docname,
			docid: parseInt(docid),
			move_to_fdrid: node.fdrid,
			move_to_idpath: node.idpath,
			move_to_typepath: node.typepath,
			fdrid: fdrid
		})
		.then(function(data) {
			
			if(i<$scope.file_list.length-1){
				$scope.cut_file(i+1,res);
			}else{
				$scope.file_list = [];
				menuShowNode();
				//$scope.selectfdr(node);
			}
			
		})
	}
}
salemanControllers
	.controller('company_files', company_files)