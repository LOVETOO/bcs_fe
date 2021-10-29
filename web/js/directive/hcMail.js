/**
 * 对象属性页模板
 * @since 2018-10-05
 */
define(
    ['module', 'directiveApi', 'directive/hcAutomailheight'],
    function (module, directiveApi) {
        'use strict';

        //定义指令
        var directive = [
            function () {
                return {
                    transclude: true,
                    link: function (scope, element) {
                        //element.addClass('modal-footflex');
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