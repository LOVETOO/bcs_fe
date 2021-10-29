/**
 * 费用记录-属性页
 * 2018-11-02
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi'],
    function (module, controllerApi, base_obj_prop, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams','BasemanService','Magic',
            //控制器函数
            function ($scope, $stateParams,BasemanService,Magic) {

                /*-------------------数据定义开始------------------------*/
                $scope.data = {};

                /*-------------------数据定义结束------------------------*/
              

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;

                $scope.tabs.base.title = '发票列表';

                //底部右边按钮
                $scope.footerRightButtons.save.title = '确定';
  

                /**
                 * 搜索发票记录
                 */
                $scope.searchLine = function () {
                    
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
