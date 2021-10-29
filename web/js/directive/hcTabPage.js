/**
 * 标签页组件
 * @since 2018-10-06
 */
define(
	['module', 'directiveApi'],
	function (module, directiveApi) {
		'use strict';

		//定义指令
		var directive = [function () {
			return {
				restrict: 'A',
				link: function ($scope, $element) {
					$element.addClass('tab-content');
                    $element.children().addClass('tab-pane');
				}
			}
		}];

		//使用Api注册指令
		//需传入require模块和指令定义
		return directiveApi.directive({
			module: module,
			directive: directive
		});
	}
);