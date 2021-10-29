/**
 *
 * @since 2018-10-08
 */
define(
    ['module', 'directiveApi', 'jquery'],
    function (module, directiveApi, $) {
        //定义指令
        var directive = [
            function () {
                return {
                    restrict: 'A',
                    compile: function (tElement, tAttrs) {
						tElement.addClass('hc-box');

						var tElementBoxTitle = tElement.children('hc-box-title');

						if (tElementBoxTitle.length) {
							tElementBoxTitle.addClass('hc-box-title');
						}
						else if (tAttrs.hcBox) {
							var tElementBoxTitle = $('<hc-box-title>', {
                                'class': 'hc-box-title',
                                'ng-bind-template': tAttrs.hcBox
                            });
						}
						
						if (tElementBoxTitle.length) {
							tElement.prepend(tElementBoxTitle);
						}
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