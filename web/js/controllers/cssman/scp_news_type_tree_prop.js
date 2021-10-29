/**
 * Created by zhl on 2019/7/15.
 * 知识库分类-属性 scp_news_type_tree_prop
 */
define(
    ['module', 'controllerApi', 'base_obj_prop','numberApi'],
    function (module, controllerApi, base_obj_prop,numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope','$stateParams',
            //控制器函数
            function ($scope,$stateParams) {

                //继承基础控制器
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 新增时数据
                 * @param bizData
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.pid = $stateParams.pid;
                    bizData.news_type_level = numberApi.toNumber($stateParams.news_type_level)+1;
                };
            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.registerController({
            module: module,
            controller: controller
        });
    }
);