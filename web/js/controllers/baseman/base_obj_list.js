/**
 * 对象列表页基础控制器
 * @since 2018-09-14
 */
define(
	['module', 'controllerApi', 'angular', 'swalApi', '$q', 'requestApi', 'openBizObj', 'directive/hcObjList'],
	function (module, controllerApi, angular, swalApi, $q, requestApi, openBizObj) {
		'use strict';

		var controller = [
			//声明依赖注入
			'$scope', '$state',
			//控制器函数
			function ($scope, $state) {
				console.log('$state', $state);

				/**
				 * 定义数据
				 */
				function defineData() {
					/* ============================== 业务数据 ============================== */
					$scope.data = {};

					(function () {
						var index = $state.current.name.lastIndexOf('_list');
						if (index >= 0)
							$scope.data.propStateName = $state.current.name.substring(0, index) + '_prop';
					})();

					/* ============================== 工具栏按钮 ============================== */
					/**
					 * 工具栏按钮定义
					 * id: 按钮ID，唯一，不可变 - string {
					 *     title: 按钮显示名称 - string
					 *     icon: 图标，写类名，用于<i></i>标签 - string
					 *     click: 点击事件 - function({
					 *         id: 按钮ID - string
					 *         def: 按钮定义 - string
					 *         event: 事件对象 - $event
					 *     })
					 *     hide: 隐藏，布尔值或函数，设为函数可动态显隐 - boolean or function({
					 *         id: 按钮ID - string
					 *         def: 按钮定义 - string
					 *     })
					 * }
					 * @since 2018-09-29
					 */
					$scope.toolButtons = {
						search: {
							title: '查询',
							icon: 'fa fa-search',
							click: function () {
								$scope.search && $scope.search();
							}
						},
						refresh: {
							title: '刷新',
							icon: 'fa fa-refresh',
							click: function () {
								$scope.refresh && $scope.refresh();
							}
						},
						openProp: {
							title: '查看详情',
							icon: '',
							click: function () {
								$scope.openProp && $scope.openProp();
							}
						},
						delete: {
							title: '删除',
							icon: 'fa fa-minus',
							click: function () {
								$scope.delete && $scope.delete();
							}
						},
						add: {
							title: '新增',
							icon: 'fa fa-plus',
							click: function () {
								$scope.add && $scope.add();
							}
						}
					};

					/* ============================== 表格 ============================== */
					$scope.gridOptions = $scope.gridOptions || {};
					$scope.gridOptions.columnDefs = $scope.gridOptions.columnDefs || [];
					if (!$scope.gridOptions.columnDefs.length
						|| $scope.gridOptions.columnDefs[0].type !== '序号')
						$scope.gridOptions.columnDefs.unshift({
							type: '序号'
						});

					$scope.gridOptions.hcEvents = $scope.gridOptions.hcEvents || {};

					$scope.gridOptions.hcEvents.cellDoubleClicked = function () {
						$scope.openProp();
					};
				}

				/**
				 * 定义函数，所有函数请都定义在此处
				 * @param {object} target 函数定义在哪个对象上
				 */
				function defineFunction(target) {

					/**
					 * 工具栏按钮是否需要隐藏
					 * @param params = {
					 *     id: 按钮ID - string
					 *     def: 按钮定义 - object
					 * }
					 * @return {boolean}
					 * @since 2018-09-29
					 */
					target.isToolButtonNeedHide = function (params) {
						var hide = params.def.hide;

						if (hide === true)
							return true;

						if (angular.isFunction(hide))
							return hide(params);

						return false;
					};

					/**
					 * 查询，由查询按钮使用
					 * @return {Promise}
					 * @since 2018-09-29
					 */
					target.search = function () {
						//用表格产生条件，并查询
						return $scope.gridOptions.hcApi.searchByGrid();
					};

					/**
					 * 刷新，由刷新按钮使用
					 * @return {Promise}
					 * @since 2018-09-29
					 */
					target.refresh = function () {
						//刷新即是用上此的查询条件再查询一次
						return $scope.gridOptions.hcApi.search();
					};

					/**
					 * 查看详情，由查看详情按钮使用
					 * @return {Promise}
					 * @since 2018-10-12
					 */
					target.openProp = function () {
						if (!$scope.data.propStateName)
							return swalApi.error('无法' + $scope.toolButtons.openProp.title + '，请检查路由配置及命名是否符合标准').then($q.reject);

						openBizObj({
							stateName: $scope.data.propStateName,
							params: {
								id: 1
							}
						})
							.result;
					};

					/**
					 * 刷新，由新增按钮使用
					 * @since 2018-10-05
					 */
					target.add = function () {
						if (!$scope.data.propStateName)
							return swalApi.error('无法' + $scope.toolButtons.add.title + '，请检查路由配置及命名是否符合标准').then($q.reject);

						openBizObj({
							stateName: $scope.data.propStateName
						})
							.result;
					};

					/**
					 * 删除，由删除按钮使用
					 * @return {Promise}
					 * @since 2018-10-05
					 */
					target.delete = function () {
						var node = $scope.gridOptions.hcApi.getFocusedNode();

						if (!node)
							return swalApi.info('请先选中要删除的行').then($q.reject);

						var reason = $scope.undeletableReason({
							node: node,
							data: node.data
						});

						if (reason)
							return swalApi.error(reason).then($q.reject);

						return requestApi({
							classId: $scope.gridOptions.hcClassId,
							action: 'delete'
						});
					};

					/**
					 * 不可删除的原因
					 * @param params = {
					 *     node: 行节点
					 *     data: 节点数据
					 * }
					 * @return {string}
					 */
					target.undeletableReason = function (params) {
						var reason;

						if (params.data.stat == 5)
							reason = '该行记录已审核，不可删除';
						else if (params.data.stat == 3)
							reason = '该行记录正在走工作流，不可删除';
						else
							reason = '';

						return reason;
					};

				}

				//定义数据
				defineData();

				//在作用域上定义函数
				defineFunction($scope);

				//在 hcSuper 上再定义一次函数，这样子控制器重写函数的时候可以调用父控制器的函数
				defineFunction($scope.hcSuper = $scope.hcSuper || {});
			}
		];

		//使用控制器Api注册控制器
		//需传入require模块和控制器定义
		return controllerApi.controller({
			module: module,
			controller: controller
		});
	}
);