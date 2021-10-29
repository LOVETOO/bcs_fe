/**
 * 费用类别 属性页
 * 2018-10-27
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope, $stateParams) {

                /*-------------------数据定义开始------------------------*/
                $scope.data = {};
                $scope.data.currItem = {};

                /*-------------------数据定义结束------------------------*/

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                // 将所需要的参数superid 设置到增加方法所传的数据对象中
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.usable = 2;
                    bizData.pid = $stateParams.pid;

                    //console.log(bizData,"bizData");
                };

                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;

                //修改标签页标题
                $scope.tabs.base.title = '费用类别';

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
