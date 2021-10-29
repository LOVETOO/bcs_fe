/**
 * 编辑+列表页模板
 * @since 2018-12-10
 */
(function (defineFn) {
	define(['module', 'directiveApi', 'directive/hcGrid', 'directive/hcInput', 'directive/hcButtons'], defineFn);
})(function (module, directiveApi) {
	//定义指令
	function hcEditListDirective() {
		return {
			transclude: true,
            templateUrl: directiveApi.getTemplateUrl(module),
            link: function ($scope, $element, $attrs) {
                $element.addClass('flex-column');
            }
		};
	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcEditListDirective
	});
});