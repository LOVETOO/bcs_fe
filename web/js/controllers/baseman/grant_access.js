/**
 * 权限控制
 * @since 2019-03-01
 */
(function (defineFn) {
	define(['module', 'controllerApi', 'angular', 'requestApi', 'directive/hcGrid', 'directive/hcSplitterBox', 'directive/hcTab', 'directive/hcTabPage', 'directive/hcButtons'], defineFn);
})(function (module,   controllerApi,   angular,   requestApi) {
	'use strict'; //严格模式

	/**
	 * 控制器
	 */
	GrantAccess.$inject = ['$scope', '$q', '$modal'];
	function GrantAccess(   $scope,   $q,   $modal) {

		/**
		 * 表格选项
		 */
		$scope.gridOptions = {
			user: {
				hcName: '用户',
				_left: true,
				columnDefs: [{
					type: '序号'
				}, {
					field: 'userid',
					headerName: '账号'
				}, {
					field: 'username',
					headerName: '名称'
				}],
				hcClassId: 'cpcuser',
				hcDataRelationName: 'users',
				hcEvents: {
					cellFocused: onCellFocused
				}
			},
			role: {
				hcName: '角色',
				_left: true,
				columnDefs: [{
					type: '序号'
				}, {
					field: 'roleid',
					headerName: '编码'
				}, {
					field: 'rolename',
					headerName: '名称'
				}],
				hcClassId: 'cpcrole',
				hcDataRelationName: 'roles'
			},
			warehouse: {
				hcName: '仓库',
				columnDefs: [{
					type: '序号'
				}, {
					field: 'warehouse_code',
					headerName: '编码'
				}, {
					field: 'warehouse_name',
					headerName: '名称'
				}],
				hcDataRelationName: 'warehouseoffin_expenses'
			},
			dept: {
				hcName: '部门',
				_commonSearchSetting: {
					classId: 'dept'
				},
				columnDefs: [{
					type: '序号'
				}, {
					field: 'dept_name',
					headerName: '名称',

				}],
				hcDataRelationName: 'depts'
			},
			account: {
				hcName: '资金账户',
				columnDefs: [{
					type: '序号'
				}, {
					field: 'fund_account_code',
					headerName: '编码',

				}, {
					field: 'fund_account_name',
					headerName: '名称',

				}],
				hcDataRelationName: 'inv_wh_ctrloffin_expenses'
			},
			area: {
				hcName: '销售区域',
				columnDefs: [{
					type: '序号'
				}, {
					field: 'sale_area_code',
					headerName: '编码',

				}, {
					field: 'sale_area_name',
					headerName: '名称',

				}],
				hcDataRelationName: 'sale_saleareaoffin_expenses'
			},
			customer: {
				hcName: '客户',
				columnDefs: [{
					type: '序号'
				}, {
					field: 'customer_code',
					headerName: '编码',

				}, {
					field: 'customer_name',
					headerName: '名称',

				}],
				hcDataRelationName: 'customer_access_ctrloffin_expenses'
			},
			crmEnt: {
				hcName: '品类',
				columnDefs: [{
					type: '序号'
				}, {
					field: 'crment_name',
					headerName: '名称',

				}],
				hcDataRelationName: 'crment_access_ctrloffin_expenses'
			}
		};

		/**
		 * 左边表格
		 */
		$scope.leftGridOptions = {};

		/**
		 * 右边表格
		 */
		$scope.rightGridOptions = {};

		/**
		 * 左边标签页
		 */
		$scope.leftTabs = {};

		/**
		 * 右边标签页
		 */
		$scope.rightTabs = {};

		angular.forEach($scope.gridOptions, function (gridOptions, name) {
			gridOptions.columnDefs.forEach(function (colDef) {
				if (colDef.type !== '序号' && !('width' in colDef))
					colDef.width = 120;
			});

			var leftOrRight = gridOptions._left ? 'left' : 'right';

			$scope[leftOrRight + 'GridOptions'][name] = gridOptions;

			$scope[leftOrRight + 'Tabs'][name] = {
				title: gridOptions._left ? gridOptions.hcName : function () {
					return gridOptions.hcName + '(' + (gridOptions.api ? gridOptions.api.getModel().getRowCount() : 0) + ')';
				}
			};
		});

		$scope.leftTabs.user.active = true;
		$scope.rightTabs.warehouse.active = true;

		var currOwner;

		function onCellFocused(params) {
			var node = params.api.hcApi.getNodeOfRowIndex(params.rowIndex),
				owner = currOwner = node.data,
				dataPromise;

			if (owner.cache) {
				dataPromise = owner.cache;
			}
			else {
				dataPromise = requestApi
					.post({
						classId: 'base_access',
						action: 'getaccess',
						data: {
							owner_id: owner.sysuserid,
							owner_type: 13
						}
					})
					.then(function (response) {
						owner.cache = response;
						return owner.cache;
					});
			}

			$q
				.when(dataPromise)
				.then(function (response) {
					angular.forEach($scope.rightGridOptions, function (gridOptions) {
						var rowData = response[gridOptions.hcDataRelationName];
						gridOptions.hcApi.setRowData(rowData);
					});
				});
		}

		$scope.buttons = {
			add: {
				title: '新增',
				click: function () {
					var id = Object.keys($scope.rightTabs).find(function (id) {
						return $scope.rightTabs[id].active;
					});

					var gridOptions = $scope.gridOptions[id];

					gridOptions._commonSearchSetting.checkbox = true;

					$modal
						.openCommonSearch(gridOptions._commonSearchSetting)
						.result
						.then(function (targets) {
							var rowData = currOwner.cache[gridOptions.hcDataRelationName];

							Array.prototype.push.apply(rowData, targets);

							gridOptions.hcApi.setRowData(rowData);
						});
				}
			},
			delete: {
				title: '删除'
			}
		};

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: GrantAccess
	});
});