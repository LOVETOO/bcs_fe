/**
 * 职群/职种设置 属性页 hr_position_group_prop
 * Created by zhl on 2019/4/1.
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

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });


                $scope.data.hr_position_group_pid = $stateParams.hr_position_group_pid;
                $scope.data.position_group_level = $stateParams.position_group_level;
                $scope.data.position_group_code = $stateParams.position_group_code;


                /*$scope.data = {
                 currItem: {},
                 hr_position_group_pid: $stateParams.hr_position_group_pid,
                 position_group_level: $stateParams.position_group_level,
                 position_group_code: $stateParams.position_group_code
                 };*/


                /**
                 * 新增时数据
                 * @param bizData
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.hr_position_group_pid = $scope.data.hr_position_group_pid;
                    if ($scope.data.position_group_level == 0)
                        $scope.data.position_group_level = 1;
                    bizData.position_group_level = $scope.data.position_group_level;
                    bizData.position_group_code = $scope.data.position_group_code;
                    bizData.usable = 2;
                };

                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;
                //修改标签页标题
                $scope.tabs.base.title = '职群/职种';

                $scope.tabs.other = {
                    title: "其他"
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
