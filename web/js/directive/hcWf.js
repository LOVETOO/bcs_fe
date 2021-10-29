/**
 * 流程实例展示器
 * @since 2018-11-27
 */
define(['module', 'directiveApi', 'requestApi', 'numberApi', 'swalApi', 'openBizObj', 'strApi', 'angularApi', 'fileApi', 'constant', 'GooFlow', 'directive/hcModal'], function (module, directiveApi, requestApi, numberApi, swalApi, openBizObj, strApi, angularApi, fileApi, constant) {
    require(['cssApi'], function (cssApi) {
        cssApi.loadCss([
            'js/plugins/GooFlow/GooFlow.css',
            'js/plugins/GooFlow/fonts/iconflow.css'
        ]);
    });

    //流程实例展示器的控制器
    HcWfController.$inject = ['$scope', '$attrs', '$q', '$modal'];
    function HcWfController(   $scope,   $attrs,   $q,   $modal) {
		var wfController = this;

		(function () {
			var wfControllerName = $attrs.hcWfName || $attrs.name || 'wfController';
			if (wfControllerName in $scope.$parent)
				throw new Error('流程实例控制器重名');

			// $scope.$parent[wfControllerName] = wfController;
			// $element.data('wfController', wfController);
		})();

		/**
		 * 返回当前对象
		 * @return {CPCWf|CPCWfTemp}
		 */
		function getCurrItem() {
			return $scope.data.currItem;
		}

		/**
		 * 设置当前对象
		 * @param {CPCWf|CPCWfTemp} currItem
		 */
		function setCurrItem(currItem) {
			if (currItem !== $scope.data.currItem) {
				$scope.data.currItem = currItem;
				drawFlow();
			}

			return $scope.data.currItem;
		}

		/**
		 * 画图
		 */
		function drawFlow() {
			var currItem = $scope.data.currItem;

			var wfId = numberApi.toNumber($scope.data.currItem.wfid), //流程ID
				wfTempId = numberApi.toNumber($scope.data.currItem.wftempid), //流程模板ID
				isInstance = $scope.data.isInstance = wfId !== 0, //是流程实例吗？
				isTemplate = $scope.data.isTemplate = !isInstance, //是流程模板吗？
				procDrName = $scope.data.procDrName = isTemplate ? 'wfproctempofwftemps' : 'wfprocofwfs', //流程节点关联对象名
				procUserDrName = $scope.data.procUserDrName = isTemplate ? 'procusertempofwfproctemps' : 'procuserofwfprocs', //节点用户关联对象名
				procCondDrName = $scope.data.procCondDrName = isTemplate ? 'proccondtempofwftemps' : 'proccondofwfs'; //节点连线关联对象名

			if (isInstance) {
				//从流程实例获取对象配置
				if ($scope.data.currItem.wfobjofwfs.length > 0) (function () {
					var wfObj = $scope.data.currItem.wfobjofwfs[0];
					var objType = numberApi.toNumber(wfObj.objtype);
					if (objType !== 0)
						setObjType(objType);
				})();
			}

			if (isTemplate) {
				$scope.data.currItem.wfname = currItem.wftempname;
				$scope.data.currItem.currprocid = 1;

				$scope.data.currItem.wfobjofwfs = $scope.data.currItem.wfobjofwfs || [];

				$scope.data.currItem.wfobjofwfs[0] = {
					objid: $scope.data.objId,
					objtype: $scope.objConf.objtypeid,
					objtypename: $scope.objConf.objtypename
				};
			}

			//清空流程数据
			$scope.wfflowObj.clearData();

			var procs = $scope.data.currItem[procDrName] || [];
			$scope.procnodes = {};
			procs.forEach(function (proc) {
				procUsers = proc[procUserDrName] || [];

				//若是流程模板
				if (isTemplate) {
					proc.procid = proc.proctempid;
					proc.procname = proc.proctempname;

					procUsers.forEach(function (procUser) {
						if (procUser.userid === '流程启动者') {
							procUser.userid = strUserId;
							procUser.username = procUser.userid;
						}
					});

					//若第一个节点没有启动者，默认为流程发起人
					if (proc.proctempid == 1 && procUsers.length === 0) {
						procUsers[0] = {
							userid: strUserId,
							username: strUserId
						};
					}
				}

				proc.top = parseFloat(proc.posy);
				proc.left = parseFloat(proc.posx);
				proc.width = parseFloat(proc.width);
				proc.height = parseFloat(proc.height);

				proc.name = proc.procid + ' - ' + proc.procname;

				proc.procusers = procUsers;
				proc.procuserofwfprocs = procUsers;

				//节点类型：”start”,”end”,”task”,”node”,”chat”,”state”,”plug”,”fork”,”join”,”complex”
				proc.type = "task";
				if (0 == proc.procid) {
					proc.type = "start  round";
				}
				else if (99999 == proc.procid) {
					proc.type = "end  round";
				}

				$scope.procnodes['proc' + proc.procid] = proc;
			});

			var procConds = $scope.data.currItem[procCondDrName] || [];
			$scope.proclines = {};
			procConds.forEach(function (procCond) {
				$scope.proclines['line_' + procCond.fromprocid + '_' + procCond.toprocid] = {
					type: "sl",
					from: 'proc' + procCond.fromprocid,
					to: 'proc' + procCond.toprocid,
					name: procCond.lefttext,
					lefttext: procCond.lefttext,
					righttext: procCond.righttext,
					fromprocid: procCond.fromprocid,
					toprocid: procCond.toprocid,
					marked: false
				};
			});

			var wfData = {
				title: $scope.data.currItem.wfname,
				lines: $scope.proclines,
				nodes: $scope.procnodes
			};

			$scope.wfflowObj.loadData(wfData);
			$scope.wfflowObj.reinitSize();

			//初始化权限
			initWfRight();

			if (isInstance)
				initWfOpions();
		}

		wfController.setWfTempId = setWfTempId;

		/**
		 * 设置流程模板ID
		 * @param {number} wfTempId
		 * @param {boolean} [needRefresh=false]
		 * @return {Promise<CPCWfTemp>}
		 * @since 2018-11-30
		 */
		function setWfTempId(wfTempId, needRefresh) {
			return $q
				.when()
				.finally(function () {
					wfTempId = numberApi.toNumber(wfTempId);

					if (wfTempId !== $scope.data.currItem.wftempid || needRefresh === true) {
						return requestApi
							.post({
								classId: 'scpwftemp',
								action: 'select',
								data: {
									'wftempid': wfTempId,
									'stat': 2
								}
							})
							.then(setCurrItem);
					}
				})
				.then(getCurrItem);
		}

		wfController.setWfId = setWfId;

		/**
		 * 设置流程实例ID
		 * @param {number} wfId
		 * @param {boolean} [needRefresh=false]
		 * @return {Promise<CPCWf>}
		 * @since 2018-11-30
		 */
		function setWfId(wfId, needRefresh) {
			return $q
				.when()
				.finally(function () {
					wfId = numberApi.toNumber(wfId);

					if (wfId != $scope.data.currItem.wfid || needRefresh === true)
						return requestApi
							.post({
								classId: 'scpwf',
								action: 'select',
								data: {
									wfid: wfId
								}
							})
							.then(setCurrItem);
				})
				.then(getCurrItem);
		}

		/**
		 * 刷新流程模板或实例
		 * @return {Promise<CPCWfTemp|CPCWf>}
		 * @since 2018-11-30
		 */
		function refresh() {
			var wfId = numberApi.toNumber($scope.data.currItem.wfid);
			if (wfId != 0)
				return setWfId(wfId, true);

			var wfTempId = numberApi.toNumber($scope.data.currItem.wftempid);
			if (wfTempId != 0)
				return setWfTempId(wfTempId, true);

			$q.reject('没有流程模板或实例，无法刷新');
		}

		require(['wfApi'], function (wfApi) {
			wfApi.onRefresh(function (eventData) {
				//若处理的流程是当前流程，刷新
				if ($scope.data.currItem.wfid == eventData.data.wfid) {
					refresh();
				}
			});
		});

		wfController.setObjType = setObjType;

		/**
		 * 设置对象类型
		 * @param {number} objType
		 * @return {Promise<CPCObjConf>}
		 * @since 2018-11-30
		 */
		function setObjType(objType) {
			return requestApi.getObjConf(objType).then(setObjConf);
		}

		wfController.setObjConf = setObjConf;

		/**
		 * 设置对象配置
		 * @param {CPCObjConf} objConf
		 * @since 2018-12-03
		 */
		function setObjConf(objConf) {
			$scope.objConf = objConf;

			objConf.obj_diy_opinions.forEach(function (diyOpinion) {
				[
					'wftempids',
					'procids'
				].forEach(function (key) {
					var array = diyOpinion[key];

					if (!angular.isArray(array)) {
						if (array)
							array = array.split(',');
						else
							array = [];

						diyOpinion[key] = array;
					}
				});

				[
					'js_url',
					'html_url'
				].forEach(function (key) {
					var url = diyOpinion[key];

					if (url[0] === '/')
						url = location.origin + url;
					else
						url = location.origin + '/web/' + url;

					diyOpinion[key] = url;
				});
			});

			$scope.wfTemps = $scope.objConf.objwftempofobjconfs;
			/* if ($scope.wfTemps.length === 1) {
				return setWfTempId($scope.wfTemps[0].wftempid);
			} */
		}

		wfController.setObjId = setObjId;

		/**
		 * 设置首个对象ID
		 * @param {number} objId
		 */
		function setObjId(objId) {
			$scope.data.objId = objId;

			$scope.data.currItem.wfobjofwfs = $scope.data.currItem.wfobjofwfs || [];

			$scope.data.currItem.wfobjofwfs[0] = {
				objid: objId,
				objtype: $scope.objConf.objtypeid,
				objtypename: $scope.objConf.objtypename
			};
		}

		wfController.setObjIds = setObjIds;

		/**
		 * 批量设置对象ID(整体替换)
		 * @param {number[]} objIds
		 */
		function setObjIds(objIds) {
			var wfObjs = objIds
				.map(function (objId) {
					return numberApi.toNumber(objId);
				})
				.filter(function (objId) {
					return objId;
				})
				.map(function (objId) {
					return {
						objid: objId,
						objtype: $scope.objConf.objtypeid,
						objtypename: $scope.objConf.objtypename
					};
				});

			$scope.data.objId = wfObjs.length ? wfObjs[0].objid : 0;
			$scope.data.currItem.wfobjofwfs = wfObjs;
		}

		var refreshObj = null;

		wfController.setObjRefresher = setObjRefresher;

		/**
		 * 设置对象刷新器
		 * @param {function} objRefresher
		 */
		function setObjRefresher(objRefresher) {
			refreshObj = objRefresher;
		}

		wfController.show = show;

		/**
		 * 显示流程模板或实例
		 * @return {Promise}
		 * @since 2018-11-30
		 */
		function show() {
			if (show.promise) return;

			show.promise = $q
				.when()
				.then(function () {
					var wfId = numberApi.toNumber($scope.data.currItem.wfid);
					var wfTempId = numberApi.toNumber($scope.data.currItem.wftempid);
					if (wfId != 0 || wfTempId != 0) return;

					if (!$scope.objConf)
						throw new Error('未关联对象配置');

					$scope.wfTemps = $scope.objConf.objwftempofobjconfs;
					if ($scope.wfTemps.length === 0) {
						throw new Error('未关联流程模板');
					}
					else if ($scope.wfTemps.length === 1) {
						return setWfTempId($scope.wfTemps[0].wftempid);
					}
					else {
						return $modal.open({
							template: '<ul class="list-group"><li class="list-group-item" ng-repeat="wfTemp in wfTemps"><a ng-bind="wfTemp.wftempname" ng-click="$close(wfTemp)"></a></li></ul>',
							scope: $scope
						})
							.result
							.then(function (wfTemp) {
								return wfTemp.wftempid;
							})
							.then(setWfTempId);
					}
				})
				.then(getCurrItem);
		}

		wfController.startWf = startWf;
		$scope.startWf = startWf;

		/**
		 * 启动流程
		 * @param {boolean} [needConfirm=false] 是否需要确认提示，默认为 false
		 * @since 2018-12-06
		 */
		function startWf(needConfirm) {
			function throwError(message) {
				swalApi.error(message);
				throw new Error(message);
			}

			//是否需要确认提示，默认为 false
			if (needConfirm !== true)
				needConfirm = false;

			var wfId = numberApi.toNumber($scope.data.currItem.wfid);
			if (wfId !== 0)
				throwError('流程已经启动，不能重复启动');

			var wfTempId = numberApi.toNumber($scope.data.currItem.wftempid);
			if (wfTempId === 0)
				throwError('缺少流程模板');

			var objType = numberApi.toNumber($scope.objConf.objtypeid);
			if (objType === 0)
				throwError('缺少对象配置');

			var objId = numberApi.toNumber($scope.data.objId);
			if (objId === 0)
				throwError('缺少流程对象');

			if (needConfirm) {
				return swalApi.confirmThenSuccess({
					title: '确定要启动流程吗？',
					okFun: doStartWf,
					okTitle: '启动成功'
				});
			}
			else {
				return doStartWf().then(function () {
					return swalApi.success('启动成功');
				});
			}

			function doStartWf() {
				/* $scope.data.currItem.wfobjofwfs = [{
					objtype: objType,
					objid: objId
				}]; */

				swalApi.close();

				return selectPositionUser()
					.then(function () {
						//流程过程
						$scope.data.currItem.wfprocofwfs = $scope.getWfProcData();
						//流程过程条件
						$scope.data.currItem.proccondofwfs = $scope.getWfCondData();

						//新增后启动流程
						$scope.data.currItem.flag = 2;
					})
					.then(function () {
						//新增流程
						return requestApi
							.post({
								classId: 'scpwf',
								action: 'insert',
								data: angular.copy($scope.data.currItem)
							})
					})
					.then(setCurrItem)
					.then(refreshObj);
			}
		}

		/**
		 * 选择岗位用户
		 */
		function selectPositionUser() {
			return requestApi
				.post({
					classId: 'scpwftemp',
					action: 'getPositionUserToSelect',
					data: {
						wftempid: $scope.data.currItem.wftempid
					}
				})
				.then(function (wfTemp) {
					if (!wfTemp.wfproctempofwftemps.length) return;

					return $scope.positionUserModal.open({
						controller: ['$scope', function ($modalScope) {
							$modalScope.title = '部分岗位匹配到多个用户，请从中选择';
							var t=setInterval(function(){
								if($(window.top.document).find(".modal-body").length>0){
									$(window.top.document).find(".modal-body").css("overflow-y","visible");
									clearInterval(t)
								}
							},100)
							$modalScope.wfproctempofwftemps = wfTemp.wfproctempofwftemps;

							$modalScope.getSelectOptions = function (position) {
								return position.positionusers.map(function (user) {
									return {
										name: user.username,
										value: user.userid
									};
								});
							};

							$modalScope.footerRightButtons.ok.hide = false;
							$modalScope.footerRightButtons.ok.disabled = function () {
								return $modalScope.modalForm.$invalid;
							};
							$modalScope.footerRightButtons.ok.click = function () {
								$modalScope.wfproctempofwftemps.forEach(function (proc) {
									var theProc = $scope.data.currItem.wfproctempofwftemps.find(function (x) {
										return x.proctempid == proc.proctempid;
									});

									proc.procusertempofwfproctemps.forEach(function (position) {
										var theProcUser = theProc.procusertempofwfproctemps.find(function (x) {
											return x.syspositionid == position.syspositionid;
										});

										if (theProcUser) {
											theProcUser.userid = position.userid;
											theProcUser.username = position.username;
										}
									});
								});

								drawFlow();

								$modalScope.$close();
							};
						}]
					})
						.result;
				});
		}

		wfController.startThenSubmitWf = startThenSubmitWf;

		function startThenSubmitWf() {
			startWf(false).then(submit);
		}

		$scope.breakWf = breakWf;

		/**
		 * 中断流程
		 * @since 2018-12-06
		 */
		function breakWf() {
			var wfId = numberApi.toNumber($scope.data.currItem.wfid);
			if (wfId === 0) {
				swalApi.error('流程还未提交！');
				throw new Error('流程还未提交！');
			}

			var wfTempId = numberApi.toNumber($scope.data.currItem.wftempid);

			return swalApi.confirmThenSuccess({
				title: '确定要中断流程吗？',
				okFun: doBreakWf,
				okTitle: '中断成功'
			});

			function doBreakWf() {
				return requestApi
					.post({
						classId: 'scpwf',
						action: 'break',
						data: angular.copy($scope.data.currItem)
					})
					.then(function () {
						$scope.data.currItem = {};
					})
					.then(function () {
						return setWfTempId(wfTempId);
					})
					.then(refreshObj);
			}
		}

		/**
		 * 获得当前选中流程节点数据
		 */
		function getCurrProc() {
			var procobj;
			//先判断是否有选中的节点
			if ($scope.wfflowObj.$focus != "" && $scope.wfflowObj.$focus != "proc0" && $scope.wfflowObj.$focus != "proc99999" &&
				$scope.wfflowObj.$focus.indexOf("proc") > -1) {
				procobj = HczyCommon.extend({}, $scope.wfflowObj.$nodeData[$scope.wfflowObj.$focus]);
				if (procobj && procobj.procuserofwfprocs && procobj.procuserofwfprocs.length > 0) {
					if (procobj.useropinionofwfprocs && procobj.useropinionofwfprocs.length == 0) {
						delete procobj.useropinionofwfprocs;
					}
					if (procobj.wfprocnoticeofwfprocs && procobj.wfprocnoticeofwfprocs.length == 0) {
						delete procobj.wfprocnoticeofwfprocs;
					}
					if (procobj.wfprocsignofwfprocs && procobj.wfprocsignofwfprocs.length == 0) {
						delete procobj.wfprocsignofwfprocs;
					}
					if (procobj.wfuserrangeofwfprocs && procobj.wfuserrangeofwfprocs.length == 0) {
						delete procobj.wfuserrangeofwfprocs;
					}
					if (procobj.prototype) {
						delete procobj.prototype;
					}
				}
			}
			return procobj;
		}

		/**
		 *
		 */
		function initWfRight() {
			//选中当前节点
			if ($scope.data.currItem.currprocid > 0 && $scope.data.currItem.currprocid < 99999) {
				$scope.wfflowObj.focusItem("proc" + $scope.data.currItem.currprocid, true);
			}

			//设置按钮权限
			setButtonRight();
		}

		/**
		 * 初始化流程意见
		 */
		function initWfOpions() {
			$scope.data.currItem.opinions = [];
			for (var i = $scope.data.currItem.wfprocofwfs.length - 1; i > -1; i--) {
				var proc = $scope.data.currItem.wfprocofwfs[i];
				if (proc.useropinionofwfprocs && proc.useropinionofwfprocs.length > 0) {
					for (var j = 0; j < proc.useropinionofwfprocs.length; j++) {
						var useropinion = proc.useropinionofwfprocs[j];
						$scope.data.currItem.opinions.push(useropinion);
						$scope.data.currItem.opinions.sort(function (a, b) {
							return a.signtime < b.signtime ? 1 : -1
						});
					}
				}
			}
		}

		/**
		 * 设置按钮权限
		 */
		function setButtonRight() {
			//设置提交权限 是当前过程用户，而且流程处于执行状态，且用户没有提交过，当前节点处于执行状态
			$scope.data.currRightObj.canSubmit = $scope.isProcUser($scope.data.currProc)
				&& ($scope.data.currItem.stat == 4)
				&& ($scope.data.currProc.stat == 4)
				&& ($scope.data.currProc.proctype != 21)//外部系统提交禁止手工提交
				&& (!$scope.isSubmited($scope.data.currProc));
			$scope.data.currRightObj.canReject = $scope.isProcUser($scope.data.currProc)
				&& ($scope.data.currItem.stat == 4)
				&& ($scope.data.currProc.stat == 4)
				&& ($scope.data.currProc.proctype != 21)//外部系统提交禁止手工驳回
				&& ($scope.data.currProc.canreject != 1) //当前节点允许驳回
				&& (!$scope.isSubmited($scope.data.currProc)
				&& ($scope.data.currProc.procid != 1));
			//流程管理员或者流程启动者可以中断流程
			$scope.data.currRightObj.canBreak = $scope.data.currItem.wfid != 0 //有流程
			 	&& $scope.data.currItem.stat != 8 //未中断
				&& (
					$scope.bWfManager() //是流程管理员
					|| (
						$scope.data.currItem.currprocid <= $scope.data.currItem.breakprocid
					 && $scope.data.currItem.startor == window.userbean.userid //是流程启动者
						)
					)
				;
			//能否显示高级功能
			$scope.data.currRightObj.canModifyFunc = $scope.bWfManager() && ($scope.data.currItem.wfid > 0);
			//能否修改流程执行人
			//流程添加用户功能只有流程管理员可以操作，待完善
			//$scope.data.currRightObj.canModifyProcUser = $scope.data.currProc.stat < 5 && $scope.bWfManager($scope.data.currProc) && ($scope.data.currProc.canmodify == 1);
			//流程未启动时
			if ($scope.data.currItem.stat == 0) {
				$scope.data.currRightObj.canModifyProcUser = $scope.data.currProc.canmodify == 1;
			} else {
				$scope.data.currRightObj.canModifyProcUser = $scope.data.currProc.stat < 7 && ($scope.bWfManager() || ($scope.haveCtrlProcRight() && $scope.data.currProc.canmodify == 1));
			}
			$scope.data.currRightObj.isAdmin = window.userbean.userid == 'admin';
		}

		$scope.saveProc = saveProc;

		function saveProc(proc) {
			proc = proc || $scope.data.currProc;

			var postData = angular.copy(proc);

			//设置flag为1,去掉后台修改人的权限校验
			postData.flag = 1;

			requestApi
				.post({
					classId: 'scpwfproc',
					action: 'update',
					data: postData
				})
				.then(function () {
					return swalApi.success('保存成功');
				})
				.then(function () {
					$("#procprop").modal("hide");
					// $("#procprop").closest("body").find('.modal-backdrop')[0].style.display = "none";
				});
		}

		$scope.clickWfObj = clickWfObj;

		function clickWfObj(wfObj) {
			/* if (wfObj.objid == $scope.data.objId) {
				swalApi.info([
					'当前窗口正在展示',
					wfObj.objtypename,
					'【' + wfObj.objname + '】'
				]);

				return;
			} */

			var params = {
				objId: numberApi.toNumber(wfObj.objid),
				objType: numberApi.toNumber(wfObj.objtype)
			};

			if (!params.objId || !params.objType) return;

			if (params.objType === constant.objType.doc && fileApi.isImage(wfObj.objname))
				params = {
					imageId: params.objId,
					images: $scope.data.currItem.wfobjofwfs
						.filter(function (wfObj) {
							return wfObj.objtype == constant.objType.doc;
						})
						.map(function (wfObj) {
							return {
								docid: wfObj.objid
							};
						})
				};

			openBizObj(params);
		}

		var $stateParams = {};

		//全局对象定义
		$scope.data = {
			currItem: {},
			wftempid: $stateParams.wftempid,
			wfid: $stateParams.wfid,
			objtypeid: $stateParams.objtypeid,
			objid: $stateParams.objid,
			//自动启动流程和提交流程第一步的标志 1-是 0-否
			autoSubmit: $stateParams.submit,
			//当前过程
			currProc: {},
			//当前连接线
			currLine: {},
			//当前泳道
			currArea: {},
			//当前权限对象
			currRightObj: {
				//能否修改流程高级功能
				canModifyFunction: false,
				//能否提交流程
				canSubmit: false,
				//能否中断
				canBreak: false,
				//能否驳回
				canReject: false,
				//能否转办
				canTransfer: false,
				//能否修改高级功能
				canModifyFunc: false,
				//能否修改流程执行人
				canModifyProcUser: false,
				//是不是管理员
				isAdmin: false
			},
			transferobj: { "shift_name": '', "shift_note": '', "": '', "": '' },
			rejectProcs: [] //可驳回过程列表
		};
		//流程节点
		$scope.procnodes = {};
		//流程节点连线
		$scope.proclines = {};

        //过程状态
        $scope.stats = [
            {id: 1, name: "计划", value: 1},
            {id: 2, name: "下达", value: 2},
            {id: 3, name: "启动", value: 3},
            {id: 4, name: "执行", value: 4},
            {id: 5, name: "驳回", value: 5},
            {id: 6, name: "中止", value: 6},
            {id: 7, name: "完成", value: 7},
            {id: 8, name: "归档", value: 8},
            {id: 9, name: "发布", value: 9},
            {id: 10, name: "变更", value: 10},
            {id: 11, name: "废止", value: 11}];

        //过程类型
        $scope.proctypes = [
            {id: 3, name: "普通", value: 3},
            {id: 4, name: "归档", value: 4},
            {id: 5, name: "发布目标", value: 5},
            {id: 6, name: "发布审核", value: 6},
            {id: 7, name: "发布", value: 7},
            {id: 8, name: "取消归档", value: 8},
            {id: 9, name: "加入论坛", value: 9},
            {id: 10, name: "监控", value: 10},
            {id: 11, name: "延迟处理", value: 11},
            {id: 12, name: "决策", value: 12},
            {id: 20, name: "审核", value: 20},
			{id: 21, name: '外部系统提交'}];

        //过程权限
        $scope.operrights = [
            {id: 1, name: "只读", value: 1},
            {id: 2, name: "修改", value: 2},
            {id: 3, name: "完全控制", value: 3}];

        //过程优先级 
        $scope.prioritys = [
            {id: 1, name: "高", value: 1},
            {id: 2, name: "中", value: 2},
            {id: 3, name: "低", value: 3}];

        //后续节点类型
        $scope.sufproctypes = [
            {id: 1, name: "无条件执行", value: 1},
            {id: 2, name: "自动条件执行", value: 2},
            {id: 3, name: "手动条件执行(单分支)", value: 3},
            {id: 4, name: "手动条件执行(多分支)", value: 4},
            {id: 5, name: "半自动条件(单分支)", value: 5}];

        //过程权限
        $scope.isskips = [
            {id: 1, name: "必须执行", value: 1},
            {id: 2, name: "允许跳过", value: 2},
            {id: 3, name: "自动执行(立即)", value: 3},
            {id: 4, name: "自动执行(到期)", value: 4}];

        //驳回类型
        $scope.canrejects = [
            {id: 1, name: "不能驳回", value: 1},
            {id: 2, name: "允许驳回", value: 2},
            {id: 3, name: "监控人驳回", value: 3}];

        //归档设置
        $scope.archivesets = [
            {id: 1, name: "提升版本", value: 1},
            {id: 2, name: "替换版本", value: 2}];

        //监控转交
        $scope.ctrltranss = [
            {id: 1, name: "不能转交", value: 1},
            {id: 2, name: "当前步", value: 2},
            {id: 3, name: "前一步", value: 3}];

        //检查设置
        $scope.checksets = [
            {id: 1, name: "不检查", value: 1},
            {id: 2, name: "提交时检查", value: 2},
            {id: 3, name: "驳回时检查", value: 3},
            {id: 4, name: "提交和驳回都检查", value: 4}];

		$scope.headername = "流程定义";
		$scope.flowChartProperty = {
			//toolBtns: ["start round mix", "end round", "task", "node", "chat", "state", "plug", "join", "fork", "complex mix"],
			haveHead: false,
			width: 994,
			height: 200,
			headLabel: false,
			//headBtns: ["new", "open", "save", "undo", "redo", "reload", "print"],//如果haveHead=true，则定义HEAD区的按钮
			haveTool: false,
			// haveDashed: false,
			// haveGroup: false,
			useOperStack: false
		};


		//流程对象初始化
		$scope.wfflowObj = $.createGooFlow($('#wfFlowChart'), $scope.flowChartProperty);

		//网格设置
		$scope.gridOptions = {
			enableCellNavigation: true,
			enableColumnReorder: false,
			editable: false,
			enableAddRow: false,
			asyncEditorLoading: false,
			autoEdit: true,
			autoHeight: true
			//onClick:dgOnClick
		};

		//用户网格字段
		$scope.userColumns = [
			{
				id: "userid",
				name: "代号",
				behavior: "select",
				field: "userid",
				editable: false,
				filter: 'set',
				width: 200,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			},
			{
				id: "username",
				name: "姓名",
				behavior: "select",
				field: "username",
				editable: false,
				filter: 'set',
				width: 200,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}
		];

		//通知网格字段
		$scope.noticeColumns = [
			{
				id: "seq",
				name: "序号",
				field: "seq",
				behavior: "select",
				cssClass: "cell-selection",
				width: 45,
				cannotTriggerInsert: true,
				resizable: false,
				selectable: false,
				focusable: false
			},
			{
				id: "noticemode",
				name: "通知方式",
				behavior: "select",
				field: "noticemode",
				editable: false,
				filter: 'set',
				width: 150,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			},
			{
				id: "noticetarget",
				name: "通知目标",
				behavior: "select",
				field: "noticetarget",
				editable: false,
				filter: 'set',
				width: 150,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			},
			{
				id: "noticetype",
				name: "通知类型",
				behavior: "select",
				field: "noticetype",
				editable: false,
				filter: 'set',
				width: 100,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			},
			{
				id: "delayperiod",
				name: "延期周期(小时)",
				behavior: "select",
				field: "delayperiod",
				editable: false,
				filter: 'set',
				width: 100,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			},
			{
				id: "note",
				name: "备注",
				behavior: "select",
				field: "note",
				editable: false,
				filter: 'set',
				width: 200,
				cellEditor: "文本框",
				enableRowGroup: true,
				enablePivot: true,
				enableValue: true,
				floatCell: true
			}
		];

		//可控过程流程网格配置项目
		$scope.ctrlProcOptions = {
			columnDefs: [{
				id: "procname",
				headerName: "过程名称",
				field: "procname",
				width: 120
			},{
				id: "userid",
				headerName: "用户",
				field: "userid",
				width: 120,
				editable: true,
				action: $scope.selectUser,
				cellEditor: "弹出框",
				cellStyle: { 'background-color': 'rgb(233, 242, 243)' }
			}],
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
			showToolPanel: false
		};

		//驳回过程网格
		$scope.rejectProcColums = [
			{
				id: "procid",
				name: "过程号",
				headerName: "过程号",
				field: "procid",
				width: 80,
				checkboxSelection: true,
				headerCheckboxSelection: true
			},
			{
				id: "procname",
				name: "过程名称",
				headerName: "过程名称",
				field: "procname",
				width: 150
			}
		]

		//驳回过程流程网格配置项目
		$scope.rejectProcOptions = {
			groupKeys: undefined,
			groupHideGroupColumns: false,
			enableColResize: true, //one of [true, false]
			enableSorting: false, //one of [true, false]
			enableFilter: false, //one of [true, false]
			enableStatusBar: false,
			enableRangeSelection: false,
			rowDeselection: false,
			quickFilterText: null,
			rowDoubleClicked: null,
			rowClicked: null,
			cellEditingStopped: null,
			groupSelectsChildren: false, // one of [true, false]
			suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
			showToolPanel: false,
			toolPanelSuppressSideButtons: true,
			rowHeight: 30,
			fixedGridHeight: 130,
			rowSelection: 'single'
		};

		//执行人网格初始化
		/* $scope.userGridView = new Slick.Grid("#usergrid", [], $scope.userColumns, $scope.gridOptions);
		//用户范围网格初始化
		$scope.userRangeGridView = new Slick.Grid("#userrangegrid", [], $scope.userColumns, $scope.gridOptions);
		//通知网格初始化
		// $scope.noticeSetGridView = new Slick.Grid("#noticesetgrid", [], $scope.noticeColumns, $scope.gridOptions);

		$scope.userRangeGridView.onDblClick.subscribe(userRangeDblClick); */

		$scope.userGridOptions = {
			columnDefs: [{
				type: '序号'
			}, {
				field: 'username',
				headerName: '用户'
			}]
		};

		$scope.userRangeGridOptions = {
			columnDefs: [{
				type: '序号'
			}, {
				field: 'username',
				headerName: '用户'
			}]
		};

		/* $scope.noticeSettingGridOptions = {
			columnDefs: [{
				type: '序号'
			}, {
				field: 'noticemode',
				headerName: '通知方式'
			}, {
				field: 'noticetarget',
				headerName: '通知目标'
			}, {
				field: 'noticetype',
				headerName: '通知类型'
			}, {
				field: 'delayperiod',
				headerName: '延期周期(小时)'
			}, {
				field: 'note',
				headerName: '备注'
			}]
		}; */

		/**
		 * 元素选中事件
		 * @param id
		 * @param type
		 */
		$scope.wfflowObj.onItemFocus = function (id, type) {
			if ("node" == type) {
				$scope.data.currProc = $scope.wfflowObj.$nodeData[id];
				//设置按钮权限
				setButtonRight();
			} else if ("line" == type) {

			} else if ("area" == type) {

			}

			angularApi.applyToScope($scope);

			return true; //返回false可以阻止浏览器默认的右键菜单事件
		}

		/**
		 * 流程节点单元格双击事件
		 * @param id
		 * @param type
		 * @returns {boolean}
		 */
		$scope.wfflowObj.onItemDbClick = function (id, type) {
			if ("node" == type) {
				$scope.data.currProc = $scope.wfflowObj.$nodeData[id];
				$scope.data.currProc.id = id;
				if ($scope.data.currProc.procid == 0 || $scope.data.currProc.procid == 99999) {
					return false;
				}

				$scope.userGridOptions.hcApi.setRowData($scope.data.currProc[$scope.data.procUserDrName]);
				$scope.userRangeGridOptions.hcApi.setRowData($scope.data.currProc['wfuserrangeofwfprocs']);

				$("#procprop").modal();
				$scope.$apply();
			} else if ("line" == type) {
				$scope.data.currLine = $scope.wfflowObj.$lineData[id];
				//初始化当前节点的来源过程和目标过程名称
				$scope.getcurrLineProcName();
				$("#condprop").modal();
			} else if ("area" == type) {

			}

			return false;//返回false可以阻止浏览器默认的右键菜单事件
		}

		/**
		 * 获得当前连线的过程名称
		 */
		$scope.getcurrLineProcName = function () {
			if ($scope.data.currLine && $scope.wfflowObj.$nodeData) {
				for (nodename in $scope.wfflowObj.$nodeData) {
					var nodeobj = $scope.wfflowObj.getItemInfo(nodename, "node");
					if (nodeobj.procid == $scope.data.currLine.fromprocid) {
						$scope.data.currLine.fromprocname = nodeobj.procname;
					}
					if (nodeobj.procid == $scope.data.currLine.toprocid) {
						$scope.data.currLine.toprocname = nodeobj.procname;
					}
				}
			}
		}

		/**
		 *添加节点后触发的事件
		 * @param id id是单元的唯一标识ID,
		 * @param type type是单元的种类,有"node","line","area"三种取值
		 * @param json json即addNode,addLine或addArea方法的第二个传参json
		 */
		$scope.wfflowObj.onItemAdd = function () {
			//没有过程名称说明是新添加的过程
			// if (!json.procname && type == "node") {
			//     json = $scope.initNewProc(json);
			// } else if (!json.procname && type == "line") {
			//     json = $scope.initNewLine(json);
			// }
			return true;
		}

		/**
		 * 元素的删除事件
		 * @param id
		 * @param type
		 */
		$scope.wfflowObj.onItemDel = function (id, type) {
			//type是单元的种类,有"node","line","area"三种取值
			if ("node" == type) {

			} else if ("line" == type) {

			} else if ("area" == type) {

			}
			return true;
		}
		/**
		 * 新过程初始化
		 * @param json
		 */
		$scope.initNewProc = function (json) {
			var newProcObj = {
				//"width": 104,
				"astatime": "",
				"varsufproc": 1,
				//"height": 100,
				"aendtime": "",
				"defcid": 0,
				"delayperiod": 0,
				"isskip": 1,
				"noticemode": 1,
				"noticeusers": "",
				//"minperson": 0,
				"sufproctype": 1,
				"alarmmode": 0,
				"pstatime": "",
				"ctrlprocname": "",
				"proctype": 3,
				"canmodify": 1,
				"pendtime": "",
				//"wftempid": 369,
				//"endprocid": -1,
				"archivetoid": "",
				"allperson": 1,
				//"posy": 30,
				//"posx": 130,
				"delayrate": 0,
				"priority": 1,
				"note": "",
				"failuser": "",
				"proctempid": 1,
				"addexpertfromkeyc": 1,
				"checkset": 0,
				"punishrate": 0,
				"delaytimes": 0,
				"submitfunc": "",
				"pubset": 0,
				"needevaluate": 0,
				"period": 100,
				"freq": 0,
				"canreject": 2,
				"arrivefunc": "",
				"keepshortcut": 1,
				"archiveset": 0,
				"clientsubfunc": "",
				"ctrlsubmitfunc": "",
				"absent": 0,
				"rejectprocname": "",
				"defopinion": "",
				"sufprocuserset": 1,
				"checkfunc": "",
				"checkkeydefprop": 1,
				"ctrlproc": "",
				"alarmperiod": 0,
				"ctrluser": "",
				"wfproctempnoticeofwfproctemps": [],
				"procusertempofwfproctemps": [],
				"prizerate": 0,
				"unreject": 1,
				"stat": 1,
				"wfuserrangeofwfproctemps": [],
				"archivetotype": "",
				"signflag": "",
				"operright": 1,
				"manager": "",
				"rejectfunc": "",
				"ctrltrans": 0,
				"rejectprocid": ""
			}

			var iprocId = 0;//$scope.getMaxProcId($scope.wfflowObj.$nodeData);
			if ($scope.wfflowObj.$nodeCount > 0) {
				for (var proc in $scope.wfflowObj.$nodeData) {
					if ($scope.wfflowObj.$nodeData[proc].procid == 0 || $scope.wfflowObj.$nodeData[proc].procid == 99999) {
						continue
					} else {
						iprocId = $scope.wfflowObj.$nodeData[proc].procid;
					}
				}
			}
			if (json.type.indexOf("start") > -1) {
				newProcObj.proctempid = 0;
				newProcObj.procid = 0;
				newProcObj.procname = "开始";
				newProcObj.proctempname = "开始";
				newProcObj.name = "开始";
				newProcObj.type = "start";
			} else if (json.type.indexOf("end") > -1) {
				newProcObj.proctempid = 99999;
				newProcObj.procid = 99999;
				newProcObj.procname = "结束";
				newProcObj.proctempname = "结束";
				newProcObj.name = "结束";
				newProcObj.type = "end";
			} else {
				newProcObj.proctempid = iprocId + 1;
				newProcObj.procid = iprocId + 1;
				newProcObj.procname = "过程" + newProcObj.proctempid;
				newProcObj.proctempname = "过程" + newProcObj.proctempid;
				newProcObj.name = "过程" + newProcObj.proctempid;
				newProcObj.type = "task";
			}
			//继承
			if (!json.wftempid) {
				json = HczyCommon.extend(json, newProcObj);
			}

			return json
		}

		/**
		 * 初始化开始和结束节点
		 */
		$scope.initStartAndEndProc = function () {
			var procData = {
				"astatime": "",
				"varsufproc": 1,
				//"height": 100,
				"aendtime": "",
				"defcid": 0,
				"delayperiod": 0,
				"isskip": 1,
				"noticemode": 1,
				"noticeusers": "",
				//"minperson": 0,
				"sufproctype": 1,
				"alarmmode": 0,
				"pstatime": "",
				"ctrlprocname": "",
				"canmodify": 1,
				"pendtime": "",
				"archivetoid": "",
				"allperson": 1,
				"delayrate": 0,
				"priority": 1,
				"note": "",
				"failuser": "",
				"addexpertfromkeyc": 1,
				"checkset": 0,
				"punishrate": 0,
				"delaytimes": 0,
				"submitfunc": "",
				"pubset": 0,
				"needevaluate": 0,
				"period": 100,
				"freq": 0,
				"keepshortcut": 1,
				"archiveset": 0,
				"absent": 0,
				"rejectprocname": "",
				"defopinion": "",
				"sufprocuserset": 1,
				"checkfunc": "",
				"checkkeydefprop": 1,
				"ctrlproc": "",
				"alarmperiod": 0,
				"ctrluser": "",
				//"wfproctempnoticeofwfproctemps": [],
				"prizerate": 0,
				"unreject": 1,
				"stat": 1,
				//"wfuserrangeofwfproctemps": [],
				"archivetotype": "",
				"signflag": "",
				"operright": 1,
				"manager": "",
				//"preproc": 4,
				"rejectfunc": "",
				"ctrltrans": 0,
				"rejectprocid": ""
			}

			//继承
			$scope.procnodes['proc0'] = HczyCommon.extend({
				"proctempid": 0,
				"procid": 0,
				"procname": "开始",
				"proctempname": "开始",
				"proctype": 1,
				"name": "开始",
				"top": 50,
				"left": 100,
				"type": "start"
			}, procData);
			$scope.procnodes['proc99999'] = HczyCommon.extend({
				"proctempid": 99999,
				"procid": 99999,
				"procname": "结束",
				"proctempname": "结束",
				"name": "结束",
				"proctype": 2,
				"top": 50,
				"left": 500,
				"type": "end"
			}, procData);

			var wftempdata = {
				title: "新建流程模版",
				lines: $scope.proclines,
				nodes: $scope.procnodes,
			};
			$("#myModal5").modal();
			$scope.wfflowObj.loadData(wftempdata);
			$scope.wfflowObj.reinitSize();
		}

		/**
		 * 初始化新连接线
		 */
		$scope.initNewLine = function (json) {
			var condObj = {
				"actived": "0",
				//"conditions": "",
				"fromprocid": "0",
				"isdefault": "2",
				//"lefttext": "",
				"points": "",
				"righttext": "",
				"stat": "0",
				"toprocid": "1",
			}

			condObj.fromprocid = $scope.wfflowObj.$nodeData[json.from].procid;
			condObj.toprocid = $scope.wfflowObj.$nodeData[json.to].procid;
			//继承
			json = HczyCommon.extend(json, condObj);
			return json;
		}

		/**
		 * 获取最大过程ID,排除99999
		 * @param dataArray
		 * @returns {number}
		 */
		$scope.getMaxProcId = function (dataArray) {
			var iprocId = 0;
			if (dataArray) {
				for (var proc in dataArray) {
					if (proc.procid == 0 || proc.procid == 99999) {
						continue
					} else {
						iprocId = proc.procid;
					}
				}
			}
			return iprocId;
		}

		/**
		 * 刷新
		 */
		$scope.refresh = function () {

		}

		/**
		 * 初始化流程图
		 * @param args
		 */
		$scope.drawWfFlow = function () {
			if ($scope.data.wftempid && !$scope.data.wfid) {
				var postData = { "wftempid": $scope.data.wftempid, "stat": 2 };
				requestApi.post("scpwftemp", "select", JSON.stringify(postData))
					.then(function (data) {
						$scope.data.currItem = data;
						$scope.data.currItem.wfname = data.wftempname;
						//初始化流程图对象
						$scope.wfflowObj.clearData();
						//组织初始化数据
						$scope.initWfByTemp($scope.data.currItem);
						//如果是自动提交需要启动流程
						if ($scope.data.autoSubmit == 1) {
							//启动流程
							$scope.saveWf();
						}
					});
			} else if ($scope.data.wfid && $scope.data.wfid > 0) {
				//显示流程实例，初始画图时，只需刷新流程，不需刷新单据，单据自己会刷新自己
				$scope.refreshwf($scope.data.wfid, true);
			} else {
				$("#myModal5").modal();
				$scope.wfflowObj.loadData({});
			}
		};

		/**
		 * 刷新流程显示
		 * @param wfid
		 * @param {boolean} [doNotRefreshBill=false] 别刷新单据
		 */
		$scope.refreshwf = function (wfid, doNotRefreshBill) {
			var postData = { "wfid": $scope.data.wfid };
			requestApi.post("scpwf", "select", JSON.stringify(postData))
				.then(function (data) {
					$scope.data.currItem = data;
					//初始化流程图对象
					$scope.wfflowObj.clearData();
					//组织初始化数据
					$scope.initWfByIns($scope.data.currItem);
					//刷新当前单据
					if (doNotRefreshBill !== true)
						$scope.refreshCurrBill();
				});
		}


		/**
		 * 获取岗位用户
		 * @param position
		 */
		$scope.getPositionUser = function (proctemp) {
			var result = { "userid": "", "username": "" };
			// requestApi.post("scpprocusertemp", "getpositionuser", JSON.stringify(proctemp))
			//     .then(function (data) {
			//         console.log('getpositionuser: ' + JSON.stringify(data));
			//         if (data.procusertemps && data.procusertemps.length > 0) {
			//             result = {"userid": data.procusertemps[0].userid, "username": data.procusertemps[0].username};
			//         }
			//         return result;
			//     })


			var data = requestApi.postSync("scpprocusertemp", "getpositionuser", proctemp);
			if (data.procusertemps && data.procusertemps.length > 0) {
				result = { "userid": data.procusertemps[0].userid, "username": data.procusertemps[0].username };
			}
			return result;
		}


		/**
		 * 初始化流程模版显示
		 * @param wfTemp
		 */
		$scope.initWfByTemp = function (wfTemp) {
			var procs = wfTemp.wfproctempofwftemps;
			var aProc, users, i, j;
			for (j = 0; j < procs.length; j++) {
				aProc = HczyCommon.stringPropToNum(procs[j]);
				users = aProc.procusertempofwfproctemps || [];
				//delete aProc.procusertempofwfproctemps;
				for (i = 0; i < users.length; i++) {
					if (users[i].userid == '流程启动者') {
						users[i].userid = strUserId;
						users[i].username = strUserId;
					}
					//岗位
					//else if (users[i].isposition > 1) {
					//    users[i].positionid = users[i].userid;
					//    users[i] = $scope.getPositionUser(users[i])
					//}
				}
				//若第一个节点没有启动者，默认为流程发起人
				if (aProc.proctempid == 1 && users.length == 0) {
					users[0] = { "userid": strUserId, "username": strUserId };
				}
				aProc.procid = aProc.proctempid;
				aProc.top = parseFloat(aProc.posy);
				aProc.left = parseFloat(aProc.posx);
				aProc.width = parseFloat(aProc.width);
				aProc.height = parseFloat(aProc.height);
				aProc.procid = aProc.proctempid;
				aProc.procname = aProc.proctempname;
				aProc.name = aProc.proctempid + ' - ' + aProc.proctempname;
				aProc.procusers = users;
				aProc.procuserofwfprocs = users;
				//节点类型：”start”,”end”,”task”,”node”,”chat”,”state”,”plug”,”fork”,”join”,”complex”
				aProc.type = "task";
				if (0 == aProc.proctempid) {
					aProc.type = "start  round";
				} else if (99999 == aProc.proctempid) {
					aProc.type = "end  round";
				}

				$scope.procnodes['proc' + aProc.proctempid] = aProc;
			}

			var procConds = wfTemp.proccondtempofwftemps;
			for (i = 0; i < procConds.length; i++) {
				aLine = procConds[i];
				$scope.proclines['line_' + aLine.fromprocid + '_' + aLine.toprocid] = {
					type: "sl",
					from: 'proc' + aLine.fromprocid,
					to: 'proc' + aLine.toprocid,
					name: aLine.lefttext,
					lefttext: aLine.lefttext,
					righttext: aLine.righttext,
					fromprocid: aLine.fromprocid,
					toprocid: aLine.toprocid,
					conditions: aLine.conditions,
					actived: aLine.actived,
					stat: aLine.stat,
					marked: false
				};
			}

			var wfdata = {
				title: wfTemp.wftempname,
				lines: $scope.proclines,
				nodes: $scope.procnodes,
				// initNum: $scope.getMaxProcId($scope.procnodes)
			};
			$("#myModal5").modal();
			$scope.wfflowObj.loadData(wfdata);
			$scope.wfflowObj.reinitSize();
		}

		/**
		 * 初始化流程显示
		 * @param wfTemp
		 */
		$scope.initWfByIns = function (wf) {
			//清空流程数据
			$scope.wfflowObj.loadData({});
			var procs = wf.wfprocofwfs;
			var aProc, users, i, j;
			for (j = 0; j < procs.length; j++) {
				aProc = HczyCommon.stringPropToNum(procs[j]);
				users = aProc.procuserofwfprocs || [];
				//delete aProc.procusertempofwfproctemps;
				for (i = 0; i < users.length; i++) {
					if (users[i].userid == '流程启动者') {
						users[i].userid = strUserId;
						users[i].username = strUserId;
					}
				}
				//若第一个节点没有启动者，默认为流程发起人
				if (aProc.proctempid == 1 && users.length == 0) {
					users[0] = { "userid": strUserId, "username": strUserId };
				}
				aProc.top = parseFloat(aProc.posy);
				aProc.left = parseFloat(aProc.posx);
				aProc.width = parseFloat(aProc.width);
				aProc.height = parseFloat(aProc.height);
				aProc.name = aProc.procid + ' - ' + aProc.procname;
				aProc.procusers = users;
				//节点类型：”start”,”end”,”task”,”node”,”chat”,”state”,”plug”,”fork”,”join”,”complex”
				aProc.type = "task";
				if (0 == aProc.procid) {
					aProc.type = "start  round";
				} else if (99999 == aProc.procid) {
					aProc.type = "end  round";
				}

				$scope.procnodes['proc' + aProc.procid] = aProc;
			}

			var procConds = wf.proccondofwfs;
			for (i = 0; i < procConds.length; i++) {
				aLine = procConds[i];
				$scope.proclines['line_' + aLine.fromprocid + '_' + aLine.toprocid] = {
					type: "sl",
					from: 'proc' + aLine.fromprocid,
					to: 'proc' + aLine.toprocid,
					name: aLine.lefttext,
					lefttext: aLine.lefttext,
					righttext: aLine.righttext,
					fromprocid: aLine.fromprocid,
					toprocid: aLine.toprocid,
					marked: false
				};
			}

			var wfdata = {
				title: wf.wfname,
				lines: $scope.proclines,
				nodes: $scope.procnodes
			};
			$("#myModal5").modal();
			$scope.wfflowObj.loadData(wfdata);
			$scope.wfflowObj.reinitSize();
			//console.log($scope.wfflowObj);

			//初始化权限
			$scope.initWfRight();

			$scope.initWfOpions();

			//刷新当前单据
			// $scope.refreshCurrBill();
		}

		/**
		 * 判断当前用户是否过程用户
		 */
		$scope.isProcUser = function (proc) {
			var result = false;
			if (proc && proc.procuserofwfprocs && proc.procuserofwfprocs.length > 0) {
				for (var i = 0; i < proc.procuserofwfprocs.length; i++) {
					if (proc.procuserofwfprocs[i].userid == window.userbean.userid) {
						result = true;
						break;
					}
				}
			}
			return result;
		}

		/**
		 * 判断当前用户是不是流程管理员
		 */
		$scope.bWfManager = function () {
			var result = false;
			if (window.userbean.userid == 'admin') {
				result = true;
			} else {
				if ($scope.data.currItem.managers) {
					if (($scope.data.currItem.managers + ",").indexOf(window.userbean.userid + ",")) {
						result = true;
					}
				}
			}
			return result;
		}

		/**
		 * 判断是否有可控过程权限
		 */
		$scope.haveCtrlProcRight = function () {
			var bResult = false;
			//获得当前节点
			var currWfProc = $scope.wfflowObj.$nodeData["proc" + $scope.data.currItem.currprocid];
			//如果当前过程ID在可控过程列表中则执行以下逻辑
			if (currWfProc.ctrlproc && (currWfProc.ctrlproc + ",").indexOf($scope.data.currProc.procid + ",") > -1) {
				if (currWfProc && currWfProc.procuserofwfprocs && currWfProc.procuserofwfprocs.length > 0) {
					for (var i = 0; i < currWfProc.procuserofwfprocs.length; i++) {
						if (currWfProc.procuserofwfprocs[i].userid == window.userbean.userid) {
							bResult = true;
							break;
						}
					}
				}
			}
			return bResult;
		}

		/**
		 * 判断当前用户是否已提交过
		 */
		$scope.isSubmited = function (proc) {
			var result = false;
			if (proc && proc.procuserofwfprocs && proc.procuserofwfprocs.length > 0) {
				for (var i = 0; i < proc.procuserofwfprocs.length; i++) {
					if (proc.procuserofwfprocs[i].userid == window.userbean.userid && proc.procuserofwfprocs[i].issigned == 2) {
						result = true;
						break;
					}
				}
			}
			return result;
		}

		/**
		 * 保存过程条件数据
		 */
		$scope.saveCondData = function () {
			$("#condprop").modal("hide");
		}

		/**
		 * 获取流程节点数据
		 */
		$scope.getWfProcData = function () {
			var procDatas = [];
			if ($scope.wfflowObj.$nodeData) {
				for (nodeData in $scope.wfflowObj.$nodeData) {
					var objProc = $scope.wfflowObj.getItemInfo(nodeData, "node");
					delete objProc.prototype;
					delete objProc.__proto__;
					objProc.posx = objProc.left;
					objProc.posy = objProc.top;
					if (objProc.height < 50) {
						objProc.height = 100;
					}
					procDatas.push(objProc)
				}
			}
			return procDatas;
		}

		/**
		 * 获取流程模版过程条件数据
		 */
		$scope.getWfCondData = function () {
			var condDatas = [];
			if ($scope.wfflowObj.$lineData) {
				for (lineData in $scope.wfflowObj.$lineData) {
					var objCond = $scope.wfflowObj.getItemInfo(lineData, "line");
					delete objCond.prototype;
					delete objCond.__proto__;
					condDatas.push(objCond)
				}
			}
			return condDatas;
		}

		/**
		 * 保存流程数据
		 */
		$scope.saveWf = function () {
			if ($scope.data.currItem.wftempid != 0) {
				//流程过程
				$scope.data.currItem.wfprocofwfs = $scope.getWfProcData();
				//流程过程条件
				$scope.data.currItem.proccondofwfs = $scope.getWfCondData();
				if ($scope.data.objtypeid > 0 && $scope.data.objid > 0) {
					$scope.data.currItem.wfobjofwfs = [{
						objtype: $scope.objConf.objtypeid,
						objid: $scope.data.objId
					}];
				}
			}
			//新增后启动流程
			$scope.data.currItem.flag = 2;
			//新增流程
			requestApi
				.post({
					classId: 'scpwf',
					action: 'insert',
					data: angular.copy($scope.data.currItem)
				})
				.then(function (wf) {
					return setWf(wf);
				})
				.then(function () {
					return swalApi.success('流程成功启动');
				});
		}

		/**
		 * 删除过程用户
		 */
		$scope.delProcUser = function () {
			var rowIndex = $scope.userGridOptions.hcApi.getFocusedRowIndex();
			if ($scope.data.currProc.procuserofwfprocs.length > 0 && rowIndex >= 0) {
				$scope.data.currProc.procuserofwfprocs.splice(rowIndex, 1);
				$scope.userGridOptions.hcApi.setRowData($scope.data.currProc.procuserofwfprocs);
			}
		}

		$scope.submit = submit;

		/**
		 * 提交流程
		 */
		function submit() {
			if (!$scope.data.currProc) {
				swalApi.info('请选择流程过程！');
				return false;
			}

			var diyOpinions = $scope.objConf.obj_diy_opinions.filter(function (diyOpinion) {
				return diyOpinion.wftempids.some(function (wfTempId) {
					return wfTempId == $scope.data.currItem.wftempid;
				}) && diyOpinion.procids.some(function (procId) {
					return procId == $scope.data.currItem.currprocid;
				});
			});

			if (diyOpinions.length > 1) {
				throw new Error('匹配的自定义意见界面多于1个');
			}

			if (diyOpinions.length === 1) {
				require([diyOpinions[0].js_url], function (test) {
					$modal
						.open({
							templateUrl: diyOpinions[0].html_url,
							controller: ['$scope', '$modalInstance', '$controller', '$q', '$timeout', 'bizData', function ($scope, $modalInstance, $controller, $q, $timeout, bizData) {
								$scope.title = '请输入流程意见';

								$scope.data = {
									currItem: angular.copy(bizData)
								};

								$scope.data.currItem.opinion = '同意。';

								$scope.validCheck = function (invalidBox) {
									var len = invalidBox.length;

									//获取【必填验证不通过】的【模型控制器】数组
									var requiredInvalidModelControllers = $scope.modalForm.$error.required;
									if (requiredInvalidModelControllers && requiredInvalidModelControllers.length) {
										requiredInvalidModelControllers.forEach(function (modelController) {
											//获取【模型控制器】的【输入组件控制器】的【文本标签】
											invalidBox.push(modelController.getInputController().getLabel());
										});
									}

									//表格必填验证
									angular.forEach($scope.gridCache, function (gridOptions) {
										gridOptions.hcApi.validCheckForRequired(invalidBox);
									});

									if (invalidBox.length > len) {
										invalidBox.splice(len, 0, '以下内容为必填项，请补充完整');
									}
								};

								$scope.footerRightButtons.ok.hide = false;
								$scope.footerRightButtons.ok.click = function () {
									var invalidInfoBox;

									return $q.when()
										.then(function () {
											//停止所有表格的编辑
											$scope.stopEditingAllGrid && $scope.stopEditingAllGrid();

											return $timeout(300);
										})
										.then(function () {
											//装 验证不通过的信息 的盒子
											return invalidInfoBox = [];
										})
										.then($scope.validCheck)
										.then(function () {
											//若盒子非空，验证不通过，弹框
											if (invalidInfoBox.length)
												return swalApi.error(invalidInfoBox)
													.then(function () {
														return $q.reject(invalidInfoBox);
													});
										})
										.then($scope.ok)
										.then(function () {
											$scope.$close({
												opinion: $scope.data.currItem.opinion
											});
										});
								};

								return $controller(test, {
									$scope: $scope,
									$modalInstance: $modalInstance
								});
							}],
							resolve: {
								bizData: function () {
									var postParams = {
										classId: $scope.objConf.tablename.toLowerCase(),
										action: 'select',
										data: {}
									};

									postParams.data[$scope.objConf.pkfield.toLowerCase()] = $scope.data.currItem.wfobjofwfs[0].objid;

									return requestApi.post(postParams);
								}
							}
						})
						.result
						.then(afterOk);
				});

				return;
			}

			$scope.opinionModal
				.open({
					controller: opinionModalController,
					resolve: {
						isReject: false,
						procs: null
					}
				})
				.result
				.then(afterOk);

				function afterOk(result) {
					var currProc = getCurrProc();
					//获取流程节点后续过程列表
					var sufProcs = $scope.getSufProcList(currProc);
					//判断是不是用户为空
					if ($scope.checkIsAllEmptyUser(sufProcs)) {
						var procs = [];
						for (var i = 0; i < sufProcs.length; i++) {
							procs.push({
								procid: sufProcs[i].procid,
								procname: sufProcs[i].procname,
								userid: ''
							});
						}
						$scope.ctrlProcOptions.api.setRowData(procs);
						//弹出用户选择界面
						$("#ctrlproc").modal("show");
					} else {
						requestApi
							.post({
								classId: 'scpwfproc',
								action: 'submit',
								data: angular.extend({}, result, {
									wfid: $scope.data.currItem.wfid,
									procid: currProc.procid
								})
							})
							.then(refresh)
							.then(function () {
								return swalApi.success('提交成功');
							})
							.then(refreshObj);
					}
				}
		}

		$scope.reject = reject;

		/**
		 * 驳回流程
		 */
		function reject() {
			if (!$scope.data.currProc) {
				swalApi.info('请选择流程过程！');
				return false;
			}

			var procs = getRejectList($scope.data.currProc);
			if (!procs.length)
				return swalApi.error('没有可驳回的过程');

			$scope.opinionModal
				.open({
					controller: opinionModalController,
					resolve: {
						isReject: true,
						procs: procs
					}
				})
				.result
				.then(function (result) {
					requestApi
						.post({
							classId: 'scpwfproc',
							action: 'reject',
							data: angular.extend({}, result, {
								wfid: $scope.data.currItem.wfid,
								procid: currProc.procid
							})
						})
						.then(refresh)
						.then(function () {
							return swalApi.success('驳回成功');
						})
						.then(refreshObj);
				});
		}

		function getRejectList(theProc) {
			var assignedRejectProcIds = {}, //指定的可驳回过程ID
				actualCanRejectProcs = {}, //实际的可驳回过程
				noAssigned, //未指定可驳回过程ID
				executedProcs = {}; //已执行过递归函数的过程

			//若指定了可驳回过程ID
			if (theProc.rejectprocid) {
				(function () {
					noAssigned = false;

					var assignedRejectProcIdArray = strApi.commonSplit(theProc.rejectprocid);

					assignedRejectProcIdArray.forEach(function (procId) {
						assignedRejectProcIds[procId] = true;
					});
				})();
			}
			else
				noAssigned = true;

			//递归查找可驳回过程
			(function iterativeSearchForReject(proc) {
				if (!proc) return;

				if (executedProcs[proc.procid]) return;

				executedProcs[proc.procid] = proc;

				if (proc.procid == 0 || proc.procid == 99999) return;

				angular.forEach($scope.wfflowObj.$lineData, function (line) {
					if (line.toprocid != proc.procid) return;

					//预期的可驳回目标过程
					var targetProc = $scope.wfflowObj.$nodeData['proc' + line.fromprocid];

					//满足以下条件时，目标过程确实可驳回
					var canReject = targetProc.procid != 0 //目标过程不是【开始】
						&& targetProc.stat == 7 //目标过程必须【已执行】
						&& targetProc.unreject != 2 //目标过程未设置【不可驳回】
						&& (noAssigned || assignedRejectProcIds[targetProc.procid]) //【未指定】可驳回过程或目标过程【在指定范围内】

					if (canReject) actualCanRejectProcs[targetProc.procid] = targetProc;

					//继续递归
					iterativeSearchForReject(targetProc);
				});
			})(theProc);

			var result = [];

			//使用对象是为了去重，转为数组
			angular.forEach(actualCanRejectProcs, function (proc) {
				result.push(proc);
			});

			//按过程ID排序
			result.sort(function (proc1, proc2) {
				return (proc1.procid - 0) - (proc2.procid - 0);
			});

			result = result.map(function (proc) {
				return {
					procid: proc.procid,
					procname: proc.procname,
					userids: proc.procusers
						.map(function (user) {
							return user.userid
						})
						.join('、')
				};
			});

			return result;
		}

		opinionModalController.$inject = ['$scope', '$q', 'isReject', 'procs'];
		function opinionModalController($modalScope, $q, isReject, procs) {
			$modalScope.isReject = isReject;
			$modalScope.procs = procs;

			$modalScope.title = '请输入' + (isReject ? '驳回原因' : '流程意见');

			$modalScope.obj = {
				opinion: isReject ? '' : '同意！'
			};

			if (isReject) {
				$modalScope.rejectProcGridOptions = {
					columnDefs: [{
						type: '序号',
						field: 'procid',
						checkboxSelection: false //procs.length > 1
					}, {
						field: 'procname',
						headerName: '过程'
					}, {
						field: 'userids',
						headerName: '执行人'
					}],
					rowData: procs,
					hcReady: $q.deferPromise()
				};

				$modalScope.rejectProcGridOptions.hcReady.then(function () {
					if (procs.length === 1)
						$modalScope.rejectProcGridOptions.hcApi.setFocusedCell();
				});
			}

			$modalScope.footerRightButtons.ok = {
				title: '确定',
				click: function () {
					if (!$modalScope.obj.opinion)
						return swalApi.error('请填写' + (isReject ? '驳回原因' : '流程意见'));

					if (isReject) {
						var nodes = $modalScope.rejectProcGridOptions.hcApi.getSelectedNodes('auto');

						if (nodes && nodes.length) {
							$modalScope.obj.rejectto = nodes
								.map(function (node) {
									return node.data.procid;
								})
								.join(',');
						}
						else
							return swalApi.error('请选中要驳回到的过程');
					}

					$modalScope.$close($modalScope.obj);
				}
			};
		}

		/**
		 *获取可驳回过程列表
		 * @param proc 指定过程
		 * @param procList 过程列表
		 */
		// $scope.getRejectList = function (proc, procList) {
		// 	if (proc.procid > 0) {
		// 		for (line in $scope.wfflowObj.$lineData) {
		// 			var objCond = $scope.wfflowObj.$lineData[line];
		// 			//已经执行过的节点才能被驳回
		// 			if (objCond.toprocid == proc.procid
		// 				&& $scope.wfflowObj.$nodeData['proc' + objCond.fromprocid].stat == 7
		// 				&& $scope.wfflowObj.$nodeData['proc' + objCond.fromprocid].unreject != 2//不能被驳回的去掉
		// 				&& $scope.wfflowObj.$nodeData['proc' + objCond.fromprocid].procid != 0) {//第一步去掉
		// 				procList.push($scope.wfflowObj.$nodeData['proc' + objCond.fromprocid]);
		// 				//递归查询
		// 				$scope.getRejectList($scope.wfflowObj.$nodeData['proc' + objCond.fromprocid], procList);
		// 			}
		// 		}
		// 	}
		// }

		/**
		 * 驳回流程
		 */
		// $scope.reject = function () {
		// 	//console.log("reject");
		// 	$scope.data.rejectProcs = [];
		// 	var currProc = $scope.getCurrProc();
		// 	if (currProc) {
		// 		//如果有可驳回过程设置则设置可驳回过程
		// 		if (currProc.rejectprocid && currProc.rejectprocid.length > 0) {
		// 			var procids = currProc.rejectprocid.split(",");
		// 			for (var i = 0; i < procids.length; i++) {
		// 				$scope.data.rejectProcs.push($scope.wfflowObj.$nodeData['proc' + procids[i]]);
		// 			}
		// 		} else {
		// 			//获取当前过程的可驳回列表
		// 			$scope.getRejectList($scope.data.currProc, $scope.data.rejectProcs);
		// 		}
		// 		//删除不能被驳回的节点
		// 		if ($scope.data.rejectProcs.length == 0) {
		// 			BasemanService.notice("没有可驳回的节点！", "alert-warning");//warning
		// 			return false;
		// 		}

		// 	} else {
		// 		BasemanService.notice("请选择流程节点！", "alert-warning");//warning
		// 	}
		// 	//驳回
		// 	$scope.data.currItem.action = 2;
		// 	$scope.rejectProcOptions.api.setRowData($scope.data.rejectProcs);

		// 	$("#procopinion").modal();
		// }

		/**
		 * 驳回确认
		 */
		$scope.confirmreject = function () {
			//console.log("confirmreject: " + $scope.data.currItem.opinion);
			var currProc = $scope.getCurrProc();
			if (currProc) {
				currProc.opinion = $scope.data.currItem.opinion;
				var selectNodes = $scope.rejectProcOptions.api.getSelectedNodes();
				var strIds = "";
				if (selectNodes && selectNodes.length > 0) {
					for (var i = 0; i < selectNodes.length; i++) {
						if (strIds.length > 0) {
							strIds += "," + selectNodes[i].data.procid;
						} else {
							strIds = selectNodes[i].data.procid + "";
						}
					}
				}

				if (strIds == "") {
					swalApi.info('请选择驳回过程');
				} else {
					$('#procopinion').modal('hide');
					currProc.rejectto = strIds;
					requestApi
						.post({
							classId: 'scpwfproc',
							action: 'reject',
							data: currProc
						})
						.then(function (data) {
							return $scope.refreshwf(data.wfid);
						})
						.then(function () {
							return swalApi.success('驳回成功！');
						});
				}
			}
		}

		/**
		 * 得到过程的前置过程列表
		 * @param proc
		 */
		$scope.getPrevProcList = function (proc) {
			var preProcs = [];
			if (proc.procid > 0) {
				for (line in $scope.wfflowObj.$lineData) {
					var objCond = $scope.wfflowObj.$lineData[line];
					if (objCond.toprocid == proc.procid) {
						preProcs.push($scope.wfflowObj.$nodeData['proc' + objCond.fromprocid]);
						// if (procids == "") {
						//     procids += objCond.fromprocid
						// } else {
						//     procids += "," + objCond.fromprocid;
						// }
					}
				}
			}
			return preProcs;
		}

		/**
		 * 得到过程的后续过程列表
		 * @param proc
		 */
		$scope.getSufProcList = function (proc) {
			var sufProcs = [];
			if (proc.procid > 0) {
				for (line in $scope.wfflowObj.$lineData) {
					var objCond = $scope.wfflowObj.$lineData[line];
					if (objCond.fromprocid == proc.procid) {
						sufProcs.push($scope.wfflowObj.$nodeData['proc' + objCond.toprocid]);
					}
				}
			}
			return sufProcs;
		}

		/**
		 * 通用查询
		 */
		$scope.addProcUser = function () {
			$modal
				.openCommonSearch({
					classId: 'scpuser',
					checkbox: true
				})
				.result
				.then(function (users) {
					if (!$scope.data.currProc.procuserofwfprocs) {
						$scope.data.currProc.procuserofwfprocs = [];
					}

					if ($scope.data.currProc.procuserofwfprocs.length) {
						users = users.filter(function (user) {
							return !$scope.data.currProc.procuserofwfprocs.find(function (procUser) {
								return procUser.isposition == 1 && procUser.userid === user.userid;
							});
						});
					}

					users = users.map(function (user) {
						return {
							'agent': '',
							'emptyset': 1,
							'ismajor': 1,
							'isposition': 1,
							'note': '',
							'rate': 1,
							'stat': 0,
							'userid': user.userid,
							'username': user.username
						}
					});

					Array.prototype.push.apply($scope.data.currProc.procuserofwfprocs, users);

					$scope.userGridOptions.hcApi.setRowData($scope.data.currProc.procuserofwfprocs);
				});
		};

		/**
		 *添加企业岗位
		 */
		$scope.addSysPosition = function () {
			$modal
				.openCommonSearch({
					classId: 'scpsysconf',
					action: 'getallposition',
					checkbox: true
				})
				.result
				.then(function (positions) {
					if (!$scope.data.currProc.procuserofwfprocs) {
						$scope.data.currProc.procuserofwfprocs = [];
					}

					if ($scope.data.currProc.procuserofwfprocs.length) {
						positions = positions.filter(function (position) {
							return !$scope.data.currProc.procuserofwfprocs.find(function (procUser) {
								return procUser.isposition == 2 && procUser.userid === position.positionid;
							});
						});
					}

					positions = positions.map(function (position) {
						return {
							'agent': '',
							'emptyset': 1,
							'ismajor': 1,
							'isposition': 2,
							'note': '',
							'rate': 1,
							'stat': 0,
							'userid': position.positionid,
							'username': position.positionname
						}
					});

					Array.prototype.push.apply($scope.data.currProc.procuserofwfprocs, positions);

					$scope.userGridOptions.hcApi.setRowData($scope.data.currProc.procuserofwfprocs);
				});
		}

		/**
		 *添加机构岗位
		 */
		$scope.addOrgPosition = function () {
			$modal
				.openCommonSearch({
					classId: 'scpposition',
					checkbox: true
				})
				.result
				.then(function (positions) {
					if (!$scope.data.currProc.procuserofwfprocs) {
						$scope.data.currProc.procuserofwfprocs = [];
					}

					if ($scope.data.currProc.procuserofwfprocs.length) {
						positions = positions.filter(function (position) {
							return !$scope.data.currProc.procuserofwfprocs.find(function (procUser) {
								return procUser.isposition == 3 && procUser.userid === position.positionid;
							});
						});
					}

					positions = positions.map(function (position) {
						return {
							'agent': '',
							'emptyset': 1,
							'ismajor': 1,
							'isposition': 3,
							'note': '',
							'rate': 1,
							'stat': 0,
							'userid': position.positionid,
							'username': position.positionname
						}
					});

					Array.prototype.push.apply($scope.data.currProc.procuserofwfprocs, positions);

					$scope.userGridOptions.hcApi.setRowData($scope.data.currProc.procuserofwfprocs);
				});
		}

		/**
		 * 下载文件
		 * @param file
		 */
		$scope.downloadAttFile = function (file) {
			window.open("/downloadfile.do?docid=" + file.docid);
		}

		/**
		 * 刷新当前单据
		 */
		$scope.refreshCurrBill = function () {
			/**
			 * 如果当前窗体有父窗体，且父窗体有对应scope对象和方法，则调用对应刷新方法
			 */
			if (window.parent && window.parent != window && window.parent.currScope && window.parent.currScope.selectCurrenItem) {
				window.parent.currScope.selectCurrenItem();
				$scope.objattachs = window.parent.currScope.data.currItem.objattachs;

			}
		}

		/**
		 * 转办
		 */
		$scope.transfer = function () {
			$("#transferModal").modal("show");
		}

		/**
		 * 转办
		 */
		$scope.confirmTransfer = function () {
			if (!$scope.data.transferobj.shift_code || $scope.data.transferobj.shift_code == '') {
				swalApi.info("请选择转办用户！");//warning
				return true;
			}

			if (!$scope.data.transferobj.shift_note || $scope.data.transferobj.shift_note == '') {
				swalApi.info("请填写转办意见！");//warning
				return true;
			}
			var currProc = $scope.getCurrProc();
			currProc.tranuserid = $scope.data.transferobj.shift_code;
			currProc.tranopinion = $scope.data.transferobj.shift_note;
			requestApi.post("scpwfproc", "transferto", JSON.stringify(currProc))
				.then(function () {
					$("#transferModal").modal("hide");
					//刷新流程实例
					return $scope.refreshwf($scope.data.wfid);
				})
				.then(function () {
					return swalApi.success("转办成功！");
				});
		}

		/**
		 * 转办用户查询
		 */
		$scope.shiftMan = function () {
			$modal
				.openCommonSearch({
					classId: 'scpuser'
				})
				.result
				.then(function (user) {
					$scope.data.transferobj.shift_id = user.userid;
					$scope.data.transferobj.shift_code = user.username;
					$scope.data.transferobj.shift_name = user.username;
				});
		};

		/**
		 * 用户范围删除
		 */
		$scope.delProcUserScope = function () {
			var cell = $scope.userRangeGridView.getActiveCell();
			var rangeData = $scope.userRangeGridView.getData();
			if (rangeData.length > 0) {
				rangeData.splice(cell.row, 1);
				$scope.userRangeGridView.setData(rangeData);
				$scope.userRangeGridView.invalidateAllRows();
				$scope.userRangeGridView.render();
			}
		}

		/**
		 * 用户范围双击
		 */
		function userRangeDblClick(args) {
			for (var i = 0; i < $scope.data.currProc.procuserofwfprocs.length; i++) {
				if ($scope.data.currProc.procuserofwfprocs[i].userid == args.grid.getDataItem(args.row).userid) {
					swal.info("请勿重复添加用户");
					return;
				}
			}
			$scope.data.currProc.procuserofwfprocs.push(args.grid.getDataItem(args.row));
			$scope.userGridView.setData([]);
			//设置数据
			$scope.userGridView.setData($scope.data.currProc.procuserofwfprocs);
			$scope.userGridView.invalidateAllRows();
			$scope.userGridView.render();
		}

		/**
		 * 检查过程用户是否都为空,必须要执行的节点才检查
		 * @param procs
		 */
		$scope.checkIsAllEmptyUser = function (procs) {
			var result = false;
			for (var i = 0; i < procs.length; i++) {
				//必須执行时才判断执行人是否为空
				if ((procs[i].procuserofwfprocs == null || procs[i].procuserofwfprocs.length == 0) && procs[i].isskip == 1
					&& procs[i].procid != 99999) {
					result = true;
					break;
				}
			}
			return result;
		}

		/**
		 * 可控过程用户选择
		 */
		$scope.saveCtrlProcUser = function () {
			var strUserid = "";
			$scope.ctrlProcOptions.api.stopEditing(false);
			//获取设置用户
			$scope.ctrlProcOptions.api.getModel().forEachNode(function (node) {
				if (strUserid == "") {
					strUserid = node.data.userid;
				} else {
					strUserid += "," + node.data.userid;
				}
			});

			if (strUserid == "") {
				//提示用户选择过程用户
				swalApi.info("请选择后续过程用户!", "alert-info");
			} else {
				var currProc = $scope.getCurrProc();
				currProc.sufprocuser = strUserid;
		
				currProc.opinion = $scope.data.currItem.opinion;
				requestApi.post("scpwfproc", "submit", JSON.stringify(currProc))
					.then(function (data) {
						swalApi.success("提交成功！");//warning
						$scope.refreshwf(data.wfid);
					});
			}
			$("#ctrlproc").modal("hide");
		}

		$scope.$emit('hcWfReady', {
			wfController: wfController
		});
	}

	//流程实例展示器的连接函数
	function wfLink($scope, $element, $attrs, wfController) {

	}

	//流程实例展示器的指令
	function wfDirective() {
		return {
			require: 'hcWf',
			templateUrl: directiveApi.getTemplateUrl(module),
			scope: {},
			controller: HcWfController,
			link: wfLink
		};
	};

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: wfDirective
	});
});