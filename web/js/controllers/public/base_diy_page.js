/**
 * 空白页面基础控制器
 * @since 2018-09-14
 */
define(
    ['module', 'controllerApi', 'angular', 'directive/hcDiyPage'],
    function (module, controllerApi, angular) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$timeout', '$q',
            //控制器函数
            function ($scope, $timeout, $q) {

                /**
                 * 定义数据
                 */
                function defineData() {

                    /* ============================== 工具栏按钮 ============================== */
                    /**
                     * 工具栏按钮定义
                     * id: 按钮ID，唯一，不可变 - string {
					 *     title: 按钮显示名称 - string
					 *     icon: 图标，写类名，用于<i></i>标签 - string
					 *     click: 点击事件 - function({
					 *         id: 按钮ID - string
					 *         def: 按钮定义 - string
					 *         event: 事件对象 - $event
					 *     })
					 *     hide: 隐藏，布尔值或函数，设为函数可动态显隐 - boolean or function({
					 *         id: 按钮ID - string
					 *         def: 按钮定义 - string
					 *     })
					 * }
                     * @since 2018-09-29
                     */
                    $scope.toolButtons = {};


                }

                /**
                 * 定义函数，所有函数请都定义在此处
                 * @param {object} target 函数定义在哪个对象上
                 */
                function defineFunction(target) {

                    /**
                     * 工具栏按钮是否需要隐藏
                     * @param params = {
					 *     id: 按钮ID - string
					 *     def: 按钮定义 - object
					 * }
                     * @return {boolean}
                     * @since 2018-09-29
                     */
                    target.isToolButtonNeedHide = function (params) {
                        var hide = params.def.hide;

                        if (hide === true)
                            return true;

                        if (angular.isFunction(hide))
                            return hide(params);

                        return false;
                    };

                    /**
                     * 初始化
                     * @since 2018-11-12
                     */
                    target.doInit = function () {
                        $scope.hideToolButtons = $.isEmptyObject($scope.toolButtons);
                        return $q.resolve();
                    };

                }

                //定义数据
                defineData();

                //在作用域上定义函数
                defineFunction($scope);

                //在 hcSuper 上再定义一次函数，这样子控制器重写函数的时候可以调用父控制器的函数
                defineFunction($scope.hcSuper = $scope.hcSuper || {});

                //执行初始化
                /* $(function () {
                 $timeout(100)
                 .then(function () {
                 return $scope.doInit();
                 })
                 .then(angular.noop)
                 .then($scope.$applyAsync)
                 ;
                 }); */

                //给window对象绑定清理对象的方法，此方法会在tab标签页关闭时调用
                window.destoryObj = function () {
                    console.log("...call destoryObj function...");
                    angular.forEach($scope, function (value, key, obj) {
                        if ($.isFunction(obj[key])) {
                            obj[key] = null;
                        }
                    });
                    $scope = null;
                }
            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);