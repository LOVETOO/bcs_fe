/**
 * 电子仓
 *  2018-11-12
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        var controller = [
            //声明依赖注入
            // 'BasemanService',
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'locname',
                        headerName: '名称'
                    }, {
                        field: 'url',
                        headerName: '文件服务器',
                        width: 200
                    }, {
                        field: 'path',
                        headerName: '路径',
                        width: 200
                    }, {
                        field: 'sizes',
                        headerName: '容量'
                    }, {
                        field: 'used',
                        headerName: '已用容量'
                    }, {
                        field: 'creator',
                        headerName: '创建者'
                    }, {
                        field: 'createtime',
                        headerName: '创建时间',
                        width: 150
                    }],
                    hcObjType: 1234570
                };
                //继承主控制器    
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });
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