/**
 * 首页卡片组件 - 属性页
 * @since 2019-03-15
 */
(function (defineFn) {
	define(['module', 'controllerApi', 'cssApi', 'base_obj_prop', 'directive/hcWidget'], defineFn);
})(function (module,   controllerApi,   cssApi,   base_obj_prop) {

	cssApi.loadCss('css/hc.oa.css');

	/**
	 * 控制器
	 */
	BaseWidgetProp.$inject = ['$scope', '$modal', '$parse'];
	function BaseWidgetProp(   $scope,   $modal,   $parse) {

		//继承基础控制器
		controllerApi.extend({
			scope: $scope,
			controller: base_obj_prop.controller
		});

		/**
		 * @override
		 */
		$scope.setBizData = function (bizData) {
			$scope.hcSuper.setBizData(bizData);

			$scope.widget = {
				templateUrl: bizData.templateurl,
				scriptUrl: bizData.scripturl,
				class: bizData.class
			};

			angular.forEach($scope.gridOptions, function (gridOptions, id) {
				gridOptions.hcApi.setRowData(bizData[id + 's']);
			});
		};

		angular.extend($scope.tabs, {
			ent: {
				title: '授权组织',
				hide: function () {
					return $scope.data.currItem.isaccessent != 2;
				}
			},
			role: {
				title: '授权角色',
				hide: function () {
					return $scope.data.currItem.isaccessrole != 2;
				}
			},
			user: {
				title: '授权用户',
				hide: function () {
					return $scope.data.currItem.isaccessuser != 2;
				}
			}
		});

		Object.defineProperties($scope.data, {
			currGridModel: {
				get: function () {
					if (!$scope.tabs.activeTabId) return '';
					return 'data.currItem.' + $scope.tabs.activeTabId + 's';
				}
			},
			currGridOptions: {
				get: function () {
					if (!$scope.tabs.activeTabId) return null;
					return $scope.gridOptions[$scope.tabs.activeTabId];
				}
			}
		});

		/**
		 * 表格
		 */
		$scope.gridOptions = {
			ent: {
				_commonSearchSetting: {
					classId: 'scpent'
				},
				_keyField: 'entid',
				hcName: '授权组织',
				hcRequired: function () {
					return $scope.data.currItem.isaccessent == 2;
				},
				columnDefs: [
					{
						type: '序号'
					},
					{
						field: 'entid',
						headerName: '组织号'
					},
					{
						field: 'entname',
						headerName: '组织名称'
					}
				]
			},
			role: {
				_commonSearchSetting: {
					classId: 'scprole'
				},
				_keyField: 'sysroleid',
				hcName: '授权角色',
				hcRequired: function () {
					return $scope.data.currItem.isaccessrole == 2;
				},
				columnDefs: [
					{
						type: '序号'
					},
					{
						field: 'roleid',
						headerName: '角色代号'
					},
					{
						field: 'rolename',
						headerName: '角色名称'
					}
				]
			},
			user: {
				_commonSearchSetting: {
					classId: 'scpuser'
				},
				_keyField: 'sysuserid',
				hcName: '授权用户',
				hcRequired: function () {
					return $scope.data.currItem.isaccessuser == 2;
				},
				columnDefs: [
					{
						type: '序号'
					},
					{
						field: 'userid',
						headerName: '用户账号'
					},
					{
						field: 'username',
						headerName: '用户名称'
					}
				]
			}
		};

		/**
		 * 权限表格
		 */
		$scope.accessGridOptions = {};
		['ent', 'role', 'user'].forEach(function (id) {
			$scope.accessGridOptions[id] = $scope.gridOptions[id];
		});

		$scope.footerLeftButtons.addRow.click = function (params) {
			if (!$scope.data.currGridOptions || !$scope.data.currGridModel) return;

			function addRowData(data) {
				var getter = $parse($scope.data.currGridModel),
					setter = getter.assign.bind(null, $scope);

				getter = getter.bind(null, $scope);

				var gridData = getter();

				if (!gridData) {
					gridData = [];
					setter(gridData);
				}

				if (Array.isArray(data)) {
					Array.prototype.push.apply(gridData, data);
				}
				else {
					gridData.push(data);
				}

				$scope.data.currGridOptions.hcApi.setRowData(gridData);
			}


			if ($scope.data.currGridOptions._commonSearchSetting) {
				var commonSearchSetting = angular.extend({}, $scope.data.currGridOptions._commonSearchSetting);

				commonSearchSetting.checkbox = true;

				$modal
					.openCommonSearch(commonSearchSetting)
					.result
					.then(function (data) {
						//去重
						if ($scope.data.currGridOptions._keyField) {
							var keyField = $scope.data.currGridOptions._keyField,
								oldData = $scope.data.currGridOptions.hcApi.getRowData();

							data = data.filter(function (x) {
								return oldData.every(function (y) {
									return y[keyField] != x[keyField];
								});
							});
						}

						addRowData(data);
					});
			}
			else {
				addRowData({});
			}
		};

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: BaseWidgetProp
	});
});