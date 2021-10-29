/**
 * 模块菜单点击日志 - 对象列表页
 * 2019-01-17
 */
(function (defineFn) {
	define(['module', 'controllerApi', 'base_obj_list'], defineFn);
})(function (module,   controllerApi,   base_obj_list) {
	'use strict';

	/**
	 * 控制器
	 */
	MenuLogList.$inject = ['$scope'];
	function MenuLogList($scope) {
		$scope.gridOptions = {
			columnDefs: [{
				type: '序号'
			}, {
				field: 'typename',
				headerName: '类型'
			}, {
				field: 'objname',
				headerName: '名称'
			}, {
				field: 'userid',
				headerName: '账号'
			}, {
				field: 'logtime',
				headerName: '时间'
			}, {
				field: 'clientip',
				headerName: 'IP'
			}]
		};

		//继承列表页基础控制器
		controllerApi.extend({
			controller: base_obj_list.controller,
			scope: $scope
		});

		[
			'add',
			'delete',
			'openProp'
		].forEach(function (buttonId) {
			$scope.toolButtons[buttonId].hide = true;
		});

		$scope.openProp = function () {};

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: MenuLogList
	});
});