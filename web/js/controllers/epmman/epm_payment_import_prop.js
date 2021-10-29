/**
 * 项目到款引入
 * 2019/7/8
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {

        var controller = [
            '$scope',

            function ($scope) {

                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------按钮方法数据 定义-------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                };

                /**
                 * 只读
                 */
                $scope.isFormReadonly = function () {
                    return true;
                };

                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.hide = true;
                $scope.footerLeftButtons.deleteRow.hide = true;
                /*底部右边按钮*/
                $scope.footerRightButtons.save.hide = true;
                $scope.footerRightButtons.saveThenAdd.hide = true;
            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });

    });