/**
 * 项目报备 - 列表页
 * @since 2019-06-20
 */
define(['module', 'controllerApi', 'base_obj_list'], function (module, controllerApi, base_obj_list) {

	EpmProjectFilingList.$inject = ['$scope']
	function EpmProjectFilingList(   $scope) {

		/**
		 * 表格选项
		 */
		$scope.gridOptions = {
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: '报备号',
					headerName: '报备号'
				}
			]
		};
		
		//继承
		controllerApi.extend({
			controller: base_obj_list.controller,
			scope: $scope
		});

	}
	
	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EpmProjectFilingList
	});
});