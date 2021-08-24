/**
 * 演示 - 对象列表页
 * @since 2018-09-12
 */
define(
	['module', 'controllerApi', 'base_tree_list', 'requestApi'],
	function (module, controllerApi, base_tree_list, requestApi) {
		'use strict';

		var controller = [
			//声明依赖注入
			'$scope',
			//控制器函数
			function ($scope) {

				/**
				 * 表格选项
				 */
				$scope.gridOptions = {
					columnDefs: [
						{
							type: '序号'
						}
						, {
							field: 'userid',
							headerName: '用户代号',
							pinned: 'left'
						}
					]
				};

				/**
				 * 树设置
				 */
				$scope.treeSetting = {
					//获取根节点的方法
					hcGetRootNodes: function () {
						return requestApi
							.post({
								classId: 'scpworkspace',
								action: 'selectref',
								data: {
									excluderight: 1,
									wsid: -16,
									wsright: '00000000000000000000FFFF000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
									wstag: -16
								}
							})
							.then(function (response) {
								return response.orgs.map(function (org) {
									return {
										name: org.orgname,
										data: org
									};
								});
							})
							;
					},
					//获取子节点的方法
					hcGetChildNodes: function (node) {
						return requestApi
							.post({
								classId: 'scporg',
								action: 'selectref',
								data: {
									orgid: node.data.orgid
								}
							})
							.then(function (response) {
								node.hcGridData = response.useroforgs;

								return response.orgoforgs.map(function (data) {
									return {
										name: data.orgname,
										data: data
									};
								});
							})
							;
					}
				};

				controllerApi.extend({
					controller: base_tree_list.controller,
					scope: $scope
				});
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