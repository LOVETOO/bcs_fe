/**
 * 访问权限综合设置
 * @since 2019-03-10
 */
(function (defineFn) {
	define(['module', 'controllerApi', 'requestApi', 'directive/hcSplitterBox', 'directive/hcInput', 'directive/hcGrid', 'directive/hcTab', 'directive/hcTabPage', 'directive/hcButtons'], defineFn);
})(function (module,   controllerApi,   requestApi) {

	/**
	 * 控制器
	 */
	BaseAccess.$inject = ['$scope', '$q'];
	function BaseAccess(   $scope,   $q) {

		$scope.owners = {
			user: {
				gridOptions: {
					hcName: '用户',
					hcClassId: 'cpcuser',
					hcDataRelationName: 'users',
					columnDefs: [{
						type: '序号'
					}, {
						field: 'userid',
						headerName: '用户账号'
					}, {
						field: 'username',
						headerName: '用户名称'
					}],
					hcEvents: {
						cellFocused: function (params) {
							var node = params.api.hcApi.getNodeOfRowIndex(params.rowIndex),
								owner = currOwner = node.data,
								dataPromise;

							if (owner.cache) {
								dataPromise = owner.cache;
							}
							else {
								dataPromise = requestApi
									.post({
										classId: 'fin_expense',
										action: 'getaccessctrlsadept',
										data: owner
									})
									.then(function (response) {
										owner.cache = response;
										return owner.cache;
									});
							}

							$q
								.when(dataPromise)
								.then(function (response) {
									angular.forEach($scope.targets, function (target) {
										['yes', 'no'].forEach(function (prefix) {
											var rowData = response[target[prefix + 'DataRelationName']];
											var gridOptions = target[prefix + 'GridOptions'];

											gridOptions.hcReady.then(function () {
												gridOptions.hcApi.setRowData(rowData);
											});
										});
									});
								});
						}
					}
				}
			}/* ,
			role: {
				gridOptions: {
					hcName: '角色',
					hcClassId: 'cpcrole',
					hcDataRelationName: 'roles',
					columnDefs: [{
						type: '序号'
					}, {
						field: 'roleid',
						headerName: '编码'
					}, {
						field: 'rolename',
						headerName: '名称'
					}]
				}
			} */
		};

		$scope.ownerTabs = {};

		$scope.currOwnerId = 'user';

		angular.forEach($scope.owners, function (owner, id) {
			$scope.ownerTabs[id] = {
				title: owner.gridOptions.hcName,
				active: id === $scope.currOwnerId
			};
		});

		$scope.targets = {
			dept: {
				yesDataRelationName: 'sa_deptaccessctrloffin_expenses',
				noDataRelationName: 'deptoffin_expenses',
				gridOptions: {
					hcName: '部门',
					columnDefs: [{
						type: '序号'
					}, {
						field: 'dept_name',
						headerName: '部门名称'
					}]
				}
			},
			customer: {
				yesDataRelationName: 'customer_access_ctrloffin_expenses',
				noDataRelationName: 'customeroffin_expenses',
				gridOptions: {
					hcName: '客户',
					columnDefs: [{
						type: '序号'
					}, {
						field: 'customer_code',
						headerName: '客户编码'
					}, {
						field: 'customer_name',
						headerName: '客户名称'
					}]
				}
			}
		};

		$scope.targetTabs = {};

		$scope.currTargetId = 'dept';

		angular.forEach($scope.targets, function (target, id) {
			$scope.targetTabs[id] = {
				title: target.gridOptions.hcName,
				active: id === $scope.currTargetId
			};

			target.gridOptions.hcEvents = target.gridOptions.hcEvents || {};

			target.yesGridOptions = angular.copy(target.gridOptions);
			target.noGridOptions = angular.copy(target.gridOptions);

			target.yesGridOptions.hcReady = $q.deferPromise();
			target.noGridOptions.hcReady = $q.deferPromise();

			target.yesGridOptions.hcEvents.cellDoubleClicked = function () {
				$scope.deletePart();
			};

			target.noGridOptions.hcEvents.cellDoubleClicked = function () {
				$scope.addPart();
			};
		});

		['owners', 'targets'].forEach(function (type) {
			angular.forEach($scope[type], function (x) {
				x.gridOptions.hcReady = $q.deferPromise();
			});
		});

		$scope.addPart = function () {
			var target = $scope.targets[$scope.currTargetId];

			var nodes = target.noGridOptions.hcApi.getSelectedNodes('auto');

			if (!nodes.length) return;

			$scope.editing = true;

			var exchangeData = nodes.map(function (node) {
				return node.data;
			});

			target.noGridOptions.api.updateRowData({
				remove: exchangeData
			});

			target.yesGridOptions.api.updateRowData({
				add: exchangeData
			});

			target.noGridOptions.hcApi.setFocusedCell();
		};

		$scope.addAll = function () {
			var target = $scope.targets[$scope.currTargetId];

			var exchangeData = target.noGridOptions.hcApi.getRowData();

			if (!exchangeData.length) return;

			$scope.editing = true;

			target.noGridOptions.api.updateRowData({
				remove: exchangeData
			});

			target.yesGridOptions.api.updateRowData({
				add: exchangeData
			});

			target.noGridOptions.hcApi.setFocusedCell();
		};

		$scope.deletePart = function () {
			var target = $scope.targets[$scope.currTargetId];

			var nodes = target.yesGridOptions.hcApi.getSelectedNodes('auto');

			if (!nodes.length) return;

			$scope.editing = true;

			var exchangeData = nodes.map(function (node) {
				return node.data;
			});

			target.yesGridOptions.api.updateRowData({
				remove: exchangeData
			});

			target.noGridOptions.api.updateRowData({
				add: exchangeData
			});
		};

		$scope.deleteAll = function () {
			var target = $scope.targets[$scope.currTargetId];

			var exchangeData = target.yesGridOptions.hcApi.getRowData();

			if (!exchangeData.length) return;

			$scope.editing = true;

			target.yesGridOptions.api.updateRowData({
				remove: exchangeData
			});

			target.noGridOptions.api.updateRowData({
				add: exchangeData
			});
		};

		$scope.ok = function () {
			$scope.editing = false;
		};

		$scope.cancel = function () {
			$scope.editing = false;
		};

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: BaseAccess
	});
});