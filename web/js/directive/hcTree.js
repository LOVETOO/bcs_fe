/**
 * 树指令
 * @since 2018-11-02
 */
define(
	['module', 'directiveApi', 'zTreeApi'],
	function (module, directiveApi, zTreeApi) {
		//定义指令
		var directive = [
			function () {
				return {
					scope: {
						getSetting: '&hcTree'
					},
					link: function (scope, element) {
						zTreeApi.create(element, scope.getSetting());
					}
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