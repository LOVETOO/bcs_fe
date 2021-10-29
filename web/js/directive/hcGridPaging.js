/**
 * 表格分页组件
 * @since 2018-09-18
 */
define(
	['module', 'directiveApi'],
	function (module, directiveApi) {

		//定义指令
		var directive = [
			function () {
				return {
					restrict: 'AE',
					templateUrl: directiveApi.getTemplateUrl(module)
				};
			}
		];

		//使用Api注册指令
		//需传入require模块和指令定义
		return directiveApi.directive({
			module: module,
			directive: directive
		});
	}
);