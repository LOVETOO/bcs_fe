/**
 * 流程展示器（新）
 * @since 2019-06-20
 */
define(['module', 'directiveApi', 'jquery', 'requestApi', 'promiseApi', 'requireApi', 'wfApi', 'directive/hcImg', 'directive/hcButton'], function (module, directiveApi, $, requestApi, promiseApi, requireApi, wfApi) {

	/**
	 * 指令
	 */
	function wfDirective() {
		return {
			scope: {
				wf: '=hcWfAs',
				onClickObj: '&hcNewWfOnClickObj'
			},
			templateUrl: directiveApi.getTemplateUrl(module),
			controller: WfWontroller
		};
	}

	/**
	 * 控制器
	 */
	WfWontroller.$inject = ['$scope', '$element', '$attrs', '$compile', '$timeout'];
	function WfWontroller($scope, $element, $attrs, $compile, $timeout) {
		$element.css({
			'position': 'relative'
		});

		$scope.$parent.$watch($attrs.hcNewWf, function (wfId) {
			wfId = +wfId;

			if ($scope.$eval('wfId == wf.wfid', {
				wfId: wfId
			})) {
				return;
			}

			return $scope.refresh(wfId);
		});

		/**
		 * 刷新
		 */
		$scope.refresh = function (wfId) {
			if (wfId === undefined) {
				wfId = $scope.$eval('wf.wfid');
			}

			if (!wfId) {
				$scope.wf = null;
				$scope.wfProcs = [];
				$scope.userOpinions = [];
				return;
			}

			return requestApi
				.post({
					classId: 'scpwf',
					action: 'select',
					data: {
						wfid: wfId
					}
				})
				.then(function (wf) {
					$scope.wf = null;
					$scope.wfProcs = [];
					$scope.userOpinions = [];

					if (wf.stat == wfApi.WF_STAT.BREAK) {
						return;
					}

					$scope.wf = wf;

					$scope.wfProcs = $scope.wf.wfprocofwfs.slice(1, $scope.wf.wfprocofwfs.length - 1);

					$scope.wfProcs.forEach(function (wfProc) {//流程状态名称，图标，calss
						if (wfProc.stat == 3) {
							wfProc.statname = '已启动';
						}
						else if (wfProc.stat == 1) {
							wfProc.statname = '未到达';
							wfProc.class = 'plan';
							wfProc.icon = 'hc-dengdai';
						}
						else if (wfProc.stat == 4) {
							wfProc.statname = '待审批';
							wfProc.class = 'execute active';
							wfProc.icon = 'hc-dengdai90';
						}
						else if (wfProc.stat == 5) {
							wfProc.statname = '已驳回';
							wfProc.class = 'reject';
							wfProc.icon = 'hc-bohui1';
						}
						else if (wfProc.stat == 7) {
							wfProc.statname = '已完成';
							wfProc.class = 'finish';
							wfProc.icon = 'hc-dui';
						}
						if (wfProc.useropinionofwfprocs) {
							wfProc.useropinionofwfprocs.forEach(function (userOpinion) {//意见状态名称
								userOpinion.wfProc = wfProc;

								if (userOpinion.stat == 1) {
									userOpinion.statname = '未到达';
									userOpinion.btnClass = 'btn btn-blue'
								}
								else if (userOpinion.act == 4) {
									userOpinion.statname = '转办';
									userOpinion.btnClass = 'btn btn-orange'
								}
								else if (userOpinion.stat == 5) {
									userOpinion.statname = '驳回';
									userOpinion.btnClass = 'btn btn-orange'
								}
								else if (userOpinion.stat == 7) {
									userOpinion.statname = '提交';
									userOpinion.btnClass = 'btn btn-blue'
								}
								$scope.userOpinions.push(userOpinion);//将所有意见堆放到一个数组;
								wfProc.procuserofwfprocs.forEach(function (procUser) {//将意见放到对应的procuserofwfprocs下
									if (userOpinion.username == procUser.username) {
										procUser.opinion = userOpinion.opinion;
										procUser.pstatime = userOpinion.pstatime;
										procUser.signtime = userOpinion.signtime;
									}
									var first_str = procUser.username.substr(0, 1).charCodeAt();
									if ((first_str >= 0x0001 && first_str <= 0x007e) || (0xff60 <= first_str && first_str <= 0xff9f)) {
										//首字母英文 取前两个字母
										procUser.headName = procUser.username.substr(0, 1).toUpperCase() + procUser.username.substr(1, 1);
									} else {
										// 首字母中文 取后两个中文
										procUser.headName = procUser.username.substr(procUser.username.length - 2, 2);
									}
								});
							});
						}
					});

					$scope.userOpinions.sort(function (userOpinion1, userOpinion2) {
						if (userOpinion1.signtime === userOpinion2.signtime) {
							return 0;
						}

						if (userOpinion1.signtime < userOpinion2.signtime) {
							return -1;
						}

						return 1;
					});
				});
		};

		require(['wfApi'], function (wfApi) {
			wfApi.onRefresh(function (eventData) {
				//若处理的流程是当前流程，刷新
				if ($scope.$eval('wf.wfId == eventData.data.wfid'), {
					eventData: eventData
				}) {
					$scope.refresh();
				}
			});
		});

		/**
		 * 打开流程图
		 */
		$scope.openFlowChart = function () {
			if (!$scope.wf) return;

			/* require(['openBizObj'], function (openBizObj) {
				openBizObj({
					stateName: 'baseman.wf',
					params: {
						id: $scope.wf.wfid
					}
				});
			}); */

			$scope.flowChartVisible = true;

			if ($scope.flowChart) return;

			return requireApi
				.usePromiseToRequire(['jquery', 'directive/hcWf'])
				.then(function ($) {
					var flowChartElement;

					flowChartElement = $('<hc-wf>', {
						'css': {
							'display': 'block',
							'height': '100%',
							'overflow': 'auto'
						},
						'ng-show': 'wf && flowChart && flowChartVisible'
					});

					$scope.$on('hcWfReady', function (event, data) {
						$scope.flowChart = data.wfController;

						$timeout(function () {
							$scope.flowChart.setWfId($scope.wf.wfid);
						});
					});

					flowChartElement = $compile(flowChartElement)($scope);

					flowChartElement.appendTo($element);
				});
		};

		/**
		 * 提交
		 * @since 2019-06-27
		 */
		$scope.submit = function () {
			return requireApi
				.usePromiseToRequire('wfApi')
				.then(function (wfApi) {
					return wfApi.submit({
						wfId: $scope.wf.wfid
					});
				});
		};

		/**
		 * 驳回
		 * @since 2019-06-27
		 */
		$scope.reject = function () {
			return requireApi
				.usePromiseToRequire('wfApi')
				.then(function (wfApi) {
					return wfApi.reject({
						wfId: $scope.wf.wfid
					});
				});
		};

		/**
		 * 转办
		 * @since 2019-06-27
		 */
		$scope.transfer = function () { };

		/**
		 * 中断
		 * @since 2019-06-27
		 */
		$scope.break = function () {
			return requireApi
				.usePromiseToRequire('wfApi')
				.then(function (wfApi) {
					return wfApi.break({
						wf: $scope.wf
					});
				});
		};

		promiseApi.whenTrue(function () {
			return $('#show').length > 0
		}).then(function () {
			$('#show').click(function () {
				$(".approval-list").toggleClass("showAll");
			});
		});

	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: wfDirective
	});
});