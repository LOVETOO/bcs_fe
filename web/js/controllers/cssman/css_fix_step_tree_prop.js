/**
 * Created by zhl on 2019/7/4.
 *服务措施（维护措施）-属性 css_fix_step_tree_prop
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope','$stateParams',
            //控制器函数
            function ($scope,$stateParams) {
                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                function getCurrItem() {
                    return $scope.data.currItem;
                }

                /**
                 * 新增时数据
                 * @param bizData
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.fix_step_pid = $stateParams.fix_step_pid;
                };

                /*---------------------------通用查询---------------------------*/
                //查询产品分类(大类)
                $scope.commonSearchSettingOfItemClass = {
                    sqlWhere:' item_class_level = 1 ',
                    afterOk: function (result) {
                        console.log(result, 'result');
                        getCurrItem().item_class_id = result.item_class_id;
                        getCurrItem().item_class_code = result.item_class_code;
                        getCurrItem().item_class_name = result.item_class_name;
                    }
                }

                //隐藏标签页
                //$scope.tabs.wf.hide = true;
                //$scope.tabs.attach.hide = true;
                //修改标签页标题
                $scope.tabs.base.title = '基本信息';

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





