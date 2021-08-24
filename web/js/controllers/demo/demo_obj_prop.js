/**
 * 演示 - 对象属性页
 * @since 2018-10-02
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_prop'], defineFn)
})(function (module,   controllerApi,   base_obj_prop) {

    DemoObjProp.$inject = ['$scope']

    function DemoObjProp($scope) {
        controllerApi.extend({
            controller: base_obj_prop.controller,
            scope: $scope
        });
    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: DemoObjProp
    });
});