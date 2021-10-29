/**
 * 空白页面模板
 * @since 2018-11-12
 */
define(
	['module', 'directiveApi', 'directive/hcGrid', 'directive/hcButton', 'directive/hcInput'],
	function (module, directiveApi) {
		//定义指令
		var directive = [
			function () {
				return {
					transclude: true,
					templateUrl: directiveApi.getTemplateUrl(module),
					link: function (scope, element) {
						element.height('100%');
					}
				}
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