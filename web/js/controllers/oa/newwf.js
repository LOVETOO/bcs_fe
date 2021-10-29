

define(
	['module', 'controllerApi', 'base_diy_page', 'requestApi'],
	function (module, controllerApi, base_diy_page, requestApi) {
		'use strict';

		var controller = ['$scope', '$timeout',

			function newwf($scope, $timeout) {

				controllerApi.extend({
					controller: base_diy_page.controller,
					scope: $scope
				});
				$scope.data = {
					currItem: {

					}
				}
				$scope.userOpinions = [];
				requestApi.post({
					classId: 'scpwf',
					action: 'select',
					data: {// 2849 
						wfid: 2896
					}
				}).then(function (res) {
					$scope.data.currItem = res;
					$scope.wfProcs = $scope.data.currItem.wfprocofwfs
					$scope.wfProcs.shift();
					$scope.wfProcs.pop();
					$scope.wfProcs.map(function (item) {//流程状态名称，图标，calss
						if (item.stat == 3) {
							item.statname = '启动';
						}
						else if (item.stat == 1) {
							item.statname = '未到达';
							item.class = 'plan';
							item.icon = 'hc-dengdai';
						}
						else if (item.stat == 4) {
							item.statname = '待审';
							item.class = 'execute';
							item.icon = 'hc-dengdai';
						}
						else if (item.stat == 5) {
							item.statname = '驳回';
							item.class = 'execute';
							item.icon = 'hc-dengdai';
						}
						else if (item.stat == 7) {
							item.statname = '完成';
							item.class = 'finish';
							item.icon = 'hc-dui';
						}
						if (item.useropinionofwfprocs) {
							item.useropinionofwfprocs.forEach(function (useropinion) {//意见状态名称
								if (useropinion.stat == 1) {
									useropinion.statname = '未到达';
									useropinion.btnClass = 'btn btn-blue'
								}
								else if (useropinion.act == 4) {
									useropinion.statname = '转办';
									useropinion.btnClass = 'btn btn-orange'
								}
								else if (useropinion.stat == 5) {
									useropinion.statname = '驳回';
									useropinion.btnClass = 'btn btn-orange'
								}
								else if (useropinion.stat == 7) {
									useropinion.statname = '提交';
									useropinion.btnClass = 'btn btn-blue'
								}
								$scope.userOpinions.push(useropinion);//将所有意见堆放到一个数组;
								item.procuserofwfprocs.forEach(function (val) {//将意见放到对应的procuserofwfprocs下
									if (useropinion.username == val.username) {
										val.opinion = useropinion.opinion;
										val.pstatime = useropinion.pstatime;
										val.signtime = useropinion.signtime;
									}
								});
							});
						}

					});
					console.log($scope.wfProcs);
					console.log($scope.userOpinions);
				});
				/**
				 * 启动流程
				 * @param {boolean} [needConfirm=false] 是否需要确认提示，默认为 false
				 * @since 2018-12-06
				 */
				$scope.startWf = function (needConfirm) {
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

			}]



		//加载控制器
		return controllerApi.controller({
			controller: controller,
			module: module
		});
	});