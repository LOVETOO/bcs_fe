/**
 * 产品通用属性
 * @since 2020-3-13
 * wzf
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi) {
        var controller = [
            '$scope', '$modal',
            function ($scope, $modal) {
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                };

                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                };
            }];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });