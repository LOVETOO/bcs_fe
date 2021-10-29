/**
 * 外部接口配置 - 对象列表页
 * 2018-12-20 add by qch
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_list'], defineFn);
})(function (module, controllerApi, base_obj_list) {
    'use strict';

    /**
     * 控制器
     */
    controller.$inject = ['$scope'];
    function controller($scope) {
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'api_typecode',
                headerName: '开放接口类型',
                hcDictCode: 'openapitype'
            }, {
                field: 'appcode',
                headerName: '开放接口类型编码(或ID)'
            }, {
                field: 'appname',
                headerName: '接口引用名称'
            }, {
                field: 'app_key',
                headerName: '接口app对应的key'
            }, {
                field: 'app_secret',
                headerName: '接口app对应的app_secret'
            }, {
                field: 'access_token',
                headerName: '接口访问token有效时间,秒为单位'
            }, {
                field: 'creator',
                headerName: '接口配置人'
            }, {
                field: 'create_date',
                headerName: '接口配置时间'
            }, {
                field: 'updator',
                headerName: '接口配置更新人'
            }, {
                field: 'update_date',
                headerName: '接口配置更新时间'
            }, {
                field: 'note',
                headerName: '备注'
            }]
        };

        //继承列表页基础控制器
        controllerApi.extend({
            controller: base_obj_list.controller,
            scope: $scope
        });
    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: controller
    });
});