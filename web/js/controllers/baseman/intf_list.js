define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'intfname',
                            headerName: '接口名称',
                            pinned: 'left'
                        }
                        , {
                            field: 'dsname',
                            headerName: '外部数据源',
                            pinned: 'left'
                        }
                        , {
                            field: 'schedulerdesc',
                            headerName: '调度',
                            pinned: 'left'
                        }
                        , {
                            field: 'note',
                            headerName: '备注',
                            pinned: 'left'
                        }
                    ],
                    hcObjType: -3
                };
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