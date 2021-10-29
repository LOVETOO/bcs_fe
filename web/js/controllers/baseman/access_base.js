/**
 * 访问权限基础控制器
 * @since 2019-03-11
 */
(function (defineFn) {
	define(['module', 'controllerApi', 'directive/hcSplitterBox', 'directive/hcInput', 'directive/hcGrid', 'directive/hcTab', 'directive/hcTabPage', 'directive/hcButtons'], defineFn);
})(function (module,   controllerApi) {

	/**
	 * 控制器
	 */
	AccessBase.$inject = ['$scope'];
	function AccessBase(   $scope) {
		//
	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: AccessBase
	});
});