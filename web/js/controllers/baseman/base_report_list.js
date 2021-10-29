/**
 * 报表设置 - 列表页
 * @since 2019-02-25
 */
(function (defineFn) {
	define(['module', 'controllerApi', 'base_obj_list'], defineFn);
})(function (module,   controllerApi,   base_obj_list) {

	/**
	 * 控制器
	 */
	BaseReportList.$inject = ['$scope'];
	function BaseReportList(   $scope) {

		/**
		 * 表格选项
		 */
		$scope.gridOptions = {
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'code',
					headerName: '报表编码'
				},
				{
					field: 'name',
					headerName: '报表名称'
				},
				{
					field: 'creator',
					headerName: '创建人'
				},
				{
					field: 'createtime',
					headerName: '创建时间'
				},
				{
					field: 'updator',
					headerName: '修改人'
				},
				{
					field: 'updatetime',
					headerName: '修改时间'
				}
			],
			hcDataRelationName: 'reports'
		};

		//继承
		controllerApi.extend({
			scope: $scope,
			controller: base_obj_list.controller
		});
	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: BaseReportList
	});
});