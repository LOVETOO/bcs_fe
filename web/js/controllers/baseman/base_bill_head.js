/**
 * 单据浏览页，基础控制器
 * @since 2018-09-14
 */
define(
	['module', 'controllerApi', 'angular', 'gridApi', 'requestApi', 'swalApi', 'directive/objList'],
	function (module, controllerApi, angular, gridApi, requestApi, swalApi) {
		'use strict';

		var controller = [
			//声明依赖注入
			'$scope', '$timeout', 'BasemanService',
			//控制器函数
			function ($scope, $timeout, BasemanService) {

				/**
				 * 定义数据
				 */
				function defineData() {
					/* ============================== 业务数据 ============================== */
					$scope.data = {
						currItem: {}
					};

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
				}

				/**
				 * 定义函数，所有函数请都定义在此处
				 * @param {object} target 函数定义在哪个对象上
				 */
				function defineFunction(target) {

					/**
					 * 工具栏按钮是否隐藏
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
					 * @since 2018-09-29
					 */
					target.search = function () {
						$scope.FrmInfo = {
							direct: 'left',
							ignorecase: 'true', //忽略大小写
							postdata: {},
							is_high: true
						};

						$scope.FrmInfo.thead = $scope.gridOptions.columnDefs
							.slice(1)
							.map(function (column) {
								var result = {
									name: column.headerName,
									code: column.field,
									type: column.type
								};

								if (column.type === '词汇') {
									result.type = 'list';
									result.dicts = column.cellEditorParams.values.map(function (value, index) {
										return {
											value: value,
											desc: column.cellEditorParams.names[index]
										};
									});
								}
								else if (column.type === '数量' || column.type === '金额')
									result.type = 'number';

								return result;
							});

						sessionStorage.setItem("frmInfo", JSON.stringify($scope.FrmInfo));

						BasemanService.open(CommonPopController1, $scope).result
							.then(function (result) {
								var postdata = {
									pagination: "pn=1,ps=20,pc=0,cn=0,ci=0",
									sqlwhere: result
								}
								$scope.data.sqlWhere = result;
								$scope.searchData(postdata)
							});
					};

					/**
					 * 刷新，由刷新按钮使用
					 * @return {Promise}
					 * @since 2018-09-29
					 */
					target.refresh = function () {
						//刷新即是用上此的查询条件再查询一次
						return $scope.searchWith({
							sqlwhere: $scope.data.sqlWhere || ''
						});
					};

					target.searchWith = function (postData) {
						postData = postData || {};

						$scope.processSearchObj(postData);

						return requestApi({
							classId: $scope.getClassId(),
							action: 'search',
							data: postData
						})
							.then(function (response) {
								return response[$scope.getClassId() + 's'];
							})
							.then($scope.setData);
					};

					/**
					 * 在请求前对查询对象进行加工。
					 * 比如：赋值查询标识  searchObj.search_flag = ?
					 * @param {object} searchObj 查询对象
					 * @return {object} 查询对象
					 */
					target.processSearchObj = function (searchObj) {
						return searchObj;
					};

					/**
					 * 返回类ID
					 * @return {string}
					 * @since 2018-09-29
					 */
					target.getClassId = function () {
						var msg = '尚未定义类ID';
						swalApi.error(msg);
						throw msg;
					};

					/**
					 * 设置数据到表格
					 * @param {object[]} data 业务数据数组
					 */
					target.setData = function (data) {
						$scope.gridOptions.hcApi.setRowData(data);
					};

				}

				//定义数据
				defineData();

				//在作用域上定义函数
				defineFunction($scope);

				//在 hcSuper 上再定义一次函数，这样子控制器重写函数的时候可以调用父控制器的函数
				defineFunction($scope.hcSuper = $scope.hcSuper || {});

				//等待模板加载完成后再创建表格
				$timeout(function () {
					return gridApi.create('grid', $scope.gridOptions);
				}, 100);

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