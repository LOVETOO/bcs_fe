/**
 * 巫奕海
 * 2019-12-24.
 * 防伪防窜界面
 */
define(
    ['module', 'controllerApi', 'base_diy_page', '$q', 'requestApi','swalApi', 'directive/hcTab', 'async!baidu'],
    function (module, controllerApi, base_diy_page, $q, requestApi,swalApi) {

        var controller = [
            '$scope', function ($scope) {

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                

            }]

        return controllerApi.controller({
            module: module,
            controller: controller
        });

    });