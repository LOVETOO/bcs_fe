/**
 *
 * @since 2018-10-06
 */
define(
	['module', 'directiveApi'],
	function (module, directiveApi) {
		'use strict';

		//定义指令
		var directive = [
			function () {
				return {
					restrict: 'A',
					replace: true,
					controller: function () {
						console.log('controller');
					},
					compile: function (element, attrs, transclude) {
						return function (scope, element, attrs) {
							transclude(scope, function (clone) {
								element.replaceWith(clone);
							});
						};
					}
					/* link: function (scope, element, attrs, controller, transclude) {
						if (transclude)
							transclude(function (clone, scope) {
								element.replaceWith(clone);
							});
					} */
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