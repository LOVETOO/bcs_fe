/**
 * 对象属性页模板
 * @since 2018-10-05
 */
define(
	['module', 'directiveApi', 'directive/hcTab', 'directive/hcTabPage', 'directive/hcGrid', 'directive/hcAutoHeight', 'directive/hcInput', 'directive/hcBox', 'directive/hcButtons', 'directive/hcNewWf', 'directive/hcAttach'],
    function (module, directiveApi) {
		'use strict';

		//区分新增和修改状态的样式
		var insertOrUpdateClasses = {
			'true': 'hc-insert',
			'false': 'hc-update'
		};

        //定义指令
        var directive = [
            function () {
                return {
                    transclude: true,
                    templateUrl: directiveApi.getTemplateUrl(module),
                    link: function ($scope, $element, $attrs) {
						$element.addClass('modal-footflex flex-column');

						$scope.$watch('data.isInsert', function (isInsert) {
							$attrs.$updateClass(insertOrUpdateClasses[!!isInsert], insertOrUpdateClasses[!isInsert]);
						});
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