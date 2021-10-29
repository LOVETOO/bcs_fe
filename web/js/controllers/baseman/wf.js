/**
 * 流程实例属性页
 * @since 2018-12-25
 */
(function (defineFn) {
	define(['module', 'controllerApi', 'angular', 'numberApi', 'directive/hcObjProp', 'directive/hcWf'], defineFn);
})(function (module,   controllerApi,   angular,   numberApi) {

	/**
	 * 流程实例属性页
	 * @since 2018-12-25
	 */
	Wf.$inject = ['$scope', '$stateParams', '$q', '$modal'];
	function Wf(   $scope,   $stateParams,   $q,   $modal) {

		//流程控制器
		var wfController;

		//流程控制器就绪承诺
		var wfControllerReady = (function () {
			var deferred = $q.defer();

			//当流程控制器就绪时
			$scope.$on('hcWfReady', function (event, data) {
				wfController = data.wfController;
				deferred.resolve(wfController);
			});

			return deferred.promise;
		})();

		//流程实例ID
		var wfId = numberApi.toNumber($stateParams.id), objType, objIds, wfTempId, startWf;
		if (wfId) {
			wfControllerReady.then(function () {
				wfController.setWfId(wfId);
			});
		}
		else {
			objType = numberApi.toNumber($stateParams.objType);
			wfTempId = numberApi.toNumber($stateParams.wfTempId);
			startWf = $stateParams.startWf === 'true';
			if (objType) {
				if (angular.isString($stateParams.objId)) {
					objIds = [$stateParams.objId];
				}
				else if (angular.isArray($stateParams.objId)) {
					objIds = $stateParams.objId;
				}
				else {
					objIds = [];
				}

				wfControllerReady
					.then(function () {
						return wfController.setObjType(objType);
					})
					.then(function () {
						return wfController.setObjIds(objIds);
					})
					.then(function () {
						if (wfTempId) {
							if (wfTempId == -1)
								return $modal
									.openCommonSearch({
										classId: 'scpwftemp',
										title: '请选择流程模板'
									})
									.result
									.then(
										function (wfTemp) {
											wfTempId = wfTemp.wftempid;
											return wfController.setWfTempId(wfTempId);
										},
										function () {
											wfTempId = 0;
											close();
											return $q.reject();
										}
									);

							return wfController.setWfTempId(wfTempId);
						}
					})
					.then(function () {
						if (wfTempId && objIds.length && startWf)
							return wfController.startThenSubmitWf();
					});
			}
		}

		/**
		 * 标签页
		 */
		$scope.tabs = {
			wf: {
				title: '审批流程',
				active: true,
				hide: true
			}
		};

		/**
		 * 底部右侧按钮
		 */
		$scope.footerRightButtons = {
			close: {
				title: '关闭',
				click: close
			}
		};

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: Wf
	});
})