/**
 * 首页卡片组件 - 列表页
 * @since 2019-03-15
 */
(function (defineFn) {
	define(['module', 'controllerApi', 'base_obj_list'], defineFn);
})(function (module,   controllerApi,   base_obj_list) {

	/**
	 * 控制器
	 */
	BaseWidgetList.$inject = ['$scope'];
	function BaseWidgetList(   $scope) {

		/**
		 * 表格
		 */
		$scope.gridOptions = {
			hcPostData: {
				searchflag: 1
			},
			hcDataRelationName: 'widgets',
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'widgetcode',
					headerName: '组件编码'
				},
				{
					field: 'widgetname',
					headerName: '组件名称'
				},
				{
					field: 'templateurl',
					headerName: '模板路径'
				},
				{
					field: 'scripturl',
					headerName: '脚本路径'
				},
				{
					field: 'class',
					headerName: '固定样式类'
				}
			]
		};

		//继承基础控制器
		controllerApi.extend({
			scope: $scope,
			controller: base_obj_list.controller
		});

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: BaseWidgetList
	});
});