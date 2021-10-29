/**
 * 客户访问权限
 * @since 2019-03-11
 */
(function (defineFn) {
	define(['module', 'controllerApi', 'requestApi', 'directive/hcSplitterBox', 'directive/hcInput', 'directive/hcGrid', 'directive/hcTab', 'directive/hcTabPage', 'directive/hcButtons'], defineFn);
})(function (module,   controllerApi,   requestApi) {

	/**
	 * 控制器
	 */
	AccessCustomer.$inject = ['$scope', '$q'];
	function AccessCustomer(   $scope,   $q) {

		var currItem;

		$scope.flag = 1;

		$scope.$watch('flag', function (newValue, oldValue) {
			if (newValue === oldValue) return;

			var leftGridOptions, middleGridOptions, rightGridOptions;

			if (newValue == 1) {
				leftGridOptions = {
					hcName: '用户',
					hcClassId: 'scpuser',
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
				};

				middleGridOptions = {
					columnDefs: [{
						type: '复选框'
					}, {
						type: '序号',
					}, {
						field: 'customer_code',
						headerName: '客户编码'
					}, {
						field: 'customer_name',
						headerName: '客户名称'
					}]
				};
			}
			else if (newValue == 2) {
				leftGridOptions = {
					hcName: '客户',
					hcClassId: 'customer_org',
					hcDataRelationName: 'customer_orgs',
					columnDefs: [{
						type: '序号'
					}, {
						field: 'customer_code',
						headerName: '客户编码'
					}, {
						field: 'customer_name',
						headerName: '客户名称'
					}]
				};

				middleGridOptions = {
					columnDefs: [{
						type: '复选框'
					}, {
						type: '序号'
					}, {
						field: 'userid',
						headerName: '用户账号'
					}, {
						field: 'username',
						headerName: '用户名称'
					}]
				};
			}

			rightGridOptions = angular.copy(middleGridOptions);

			angular.extend($scope.middleGridOptions, middleGridOptions);

			$scope.middleGridOptions.api.setColumnDefs(middleGridOptions.columnDefs);

			angular.extend($scope.rightGridOptions, rightGridOptions);

			$scope.rightGridOptions.api.setColumnDefs(rightGridOptions.columnDefs);

			angular.extend($scope.leftGridOptions, leftGridOptions);

			$scope.leftGridOptions.api.setColumnDefs(leftGridOptions.columnDefs);

			$scope.leftGridOptions.hcApi.search();
		});

		$scope.leftGridOptions = {
			hcName: '用户',
			hcClassId: 'scpuser',
			hcDataRelationName: 'users',
			hcNoPaging: true,
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
					if (params.rowIndex == null) return;

					var node = params.api.hcApi.getNodeOfRowIndex(params.rowIndex);

					currItem = node.data;

					select();
				}
			}
		};

		$scope.middleGridOptions = {
			hcNoPaging: true,
			columnDefs: [{
				type: '复选框'
			}, {
				type: '序号',
			}, {
				field: 'customer_code',
				headerName: '客户编码'
			}, {
				field: 'customer_name',
				headerName: '客户名称'
			}]
		};

		$scope.rightGridOptions = {
			hcNoPaging: true,
			columnDefs: [{
				type: '复选框'
			}, {
				type: '序号'
			}, {
				field: 'customer_code',
				headerName: '客户编码'
			}, {
				field: 'customer_name',
				headerName: '客户名称'
			}]
		};

		function select(refresh) {
			var dataPromise;

			if (currItem.cache && !refresh) {
				dataPromise = currItem.cache;
			}
			else {
				dataPromise = requestApi
					.post({
						classId: 'fin_expense',
						action: 'getaccessctrlcustomer',
						data: currItem
					})
					.then(function (response) {
						currItem.cache = response;
						return currItem.cache;
					});
			}

			return $q
				.when(dataPromise)
				.then(function (response) {
					$scope.middleGridOptions.hcApi.setRowData(response.customer_access_ctrloffin_expenses);
					$scope.rightGridOptions.hcApi.setRowData(response.customeroffin_expenses);
				});
		}

		/**
		 * 添加选中
		 */
		$scope.addPart = function () {
			var nodes = $scope.rightGridOptions.hcApi.getSelectedNodes('checkbox');

			if (!nodes.length) return;

			$scope.editing = true;

			var exchangeData = nodes.map(function (node) {
				return node.data;
			});

			$scope.rightGridOptions.api.updateRowData({
				remove: exchangeData
			});

			$scope.middleGridOptions.api.updateRowData({
				add: exchangeData
			});

			$scope.rightGridOptions.hcApi.setFocusedCell();
		};

		/**
		 * 添加全部
		 */
		$scope.addAll = function () {
			var exchangeData = $scope.rightGridOptions.hcApi.getRowData();

			if (!exchangeData.length) return;

			$scope.editing = true;

			$scope.rightGridOptions.api.updateRowData({
				remove: exchangeData
			});

			$scope.middleGridOptions.api.updateRowData({
				add: exchangeData
			});

			$scope.rightGridOptions.hcApi.setFocusedCell();
		};

		/**
		 * 删除选中
		 */
		$scope.deletePart = function () {
			var nodes = $scope.middleGridOptions.hcApi.getSelectedNodes('checkbox');

			if (!nodes.length) return;

			$scope.editing = true;

			var exchangeData = nodes.map(function (node) {
				return node.data;
			});

			$scope.middleGridOptions.api.updateRowData({
				remove: exchangeData
			});

			$scope.rightGridOptions.api.updateRowData({
				add: exchangeData
			});
		};

		/**
		 * 删除全部
		 */
		$scope.deleteAll = function () {
			var exchangeData = $scope.middleGridOptions.hcApi.getRowData();

			if (!exchangeData.length) return;

			$scope.editing = true;

			$scope.middleGridOptions.api.updateRowData({
				remove: exchangeData
			});

			$scope.rightGridOptions.api.updateRowData({
				add: exchangeData
			});
		};

		/**
		 * 确定
		 */
		$scope.ok = function () {
			var postData = {};

			if ($scope.flag == 1) {
				postData.sysuserid = currItem.sysuserid;
				postData.userid = currItem.userid;
			}
			else {
				postData.customer_id = currItem.customer_id;
			}

			postData.customer_access_ctrloffin_expenses = $scope.middleGridOptions.hcApi.getRowData();

			return requestApi
				.post({
					classId: 'fin_expense',
					action: 'updatecustomerctrl',
					data: postData
				})
				.then(function () {
					return select(true);
				})
				.then(function () {
					$scope.editing = false;
				});
		};

		/**
		 * 取消
		 */
		$scope.cancel = function () {
			return select().then(function () {
				$scope.editing = false;
			});
		};

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: AccessCustomer
	});
});