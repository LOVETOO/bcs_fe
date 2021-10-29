/**
 * 自动宽度
 * @since 2019-03-19
 */
(function (defineFn) {
	define(['module', 'directiveApi'], defineFn);
})(function (module,   directiveApi) {

	/**
	 * 指令
	 */
	hcAutoWidthDirective.$inject = [];
	function hcAutoWidthDirective() {
		return function hcAutoWidthLink($scope, $element, $attrs) {
			//
			var bigbox = $element.parent().width();
			    siblingbox = $element.siblings().outerWidth(true),
			    boxpm = $element.outerWidth(true) - $element.width();
			    
			$element.width(bigbox - siblingbox - boxpm);
		};
	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcAutoWidthDirective
	});
});