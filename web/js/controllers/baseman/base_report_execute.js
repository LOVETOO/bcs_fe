/**
 * 自定义报表 - 执行页
 * @since 2019-02-16
 */
(function (defineFn) {
	define(['module', 'controllerApi', 'requestApi', 'directive/hcObjList'], defineFn);
})(function (module,   controllerApi,   requestApi) {

	/**
	 * 控制器
	 */
	ReportExecute.$inject = ['$scope', '$stateParams'];
	function ReportExecute(   $scope,   $stateParams) {

		$scope.toolButtons = {
			refresh: {
				title: '刷新',
				icon: 'iconfont hc-refresh',
				click: function () {
					return $scope.gridOptions.hcApi.search();
				}
			},
			search: {
				title: '筛选',
				icon: 'iconfont hc-shaixuan',
				click: function () {
					return $scope.gridOptions.hcApi.searchByGrid();
				}
			},
			export: {
				title: '导出',
				icon: 'iconfont hc-daochu',
				click: function () {
					return $scope.gridOptions.hcApi.exportToExcel();
				}
			}
		};

		requestApi
			.post({
				classId: 'base_report',
				action: 'select',
				data: {
					code: $stateParams.code
				}
			})
			.then(function (reportSetting) {
				$scope.gridOptions = JSON.parse(reportSetting.gridoptions);

				angular.extend($scope.gridOptions, {
                    hcName: reportSetting.name,
					hcClassId: 'base_report',
					hcRequestAction: 'execute',
					hcDataRelationName: 'results',
					hcSqlWhere: $stateParams.sqlWhere,
					hcPostData: {
						code: $stateParams.code
                    },
                    enableSorting: true
				});
			});
	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: ReportExecute
	});
});