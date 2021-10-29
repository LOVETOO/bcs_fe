/**
 * 对象配置 对象列表页
 * 2018-2-1 add by mjl
 * 2018-10-25 modify by wzf
 */
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
                        },
                        {
                            field: "objtypeid",
                            headerName: "对象类型编号",
                            pinned: 'left'
                        },
                        {
                            field: "objtypename",
                            headerName: "对象类型描述",
                            pinned: 'left'
                        },
                        {
                            field: "tablename",
                            headerName: "表名"
                        },
                        {
                            field: "pkfield",
                            headerName: "主键名"
                        },
                        {
                            field: "codefield",
                            headerName: "编码字段"
                        },
                        {
                            field: "javaname",
                            headerName: 'JAVA类名'
                        },
                        {
                            field: "namefield",
                            headerName: "名称字段"
                        },
                        {
                            field: "isbill",
                            headerName: "单据",
                            type: '是否'
                        },
                        {
                            field: "isflow",
                            headerName: "有流程",
                            type: '是否'
                        },
                        {
                            field: "haspath",
                            headerName: "有路径",
                            type: '是否'
                        },
                        {
                            field: "hasrev",
                            headerName: "有版本",
                            type: '是否'
                        },
                        {
                            field: 'cancopy',
                            headerName: '可复制',
                            type: '是否'
                        },
                        {
							field: 'reverseauditable',
                            headerName: '可逆向审核',
                            type: '是否'
                        }
                    ],
                    hcObjType: -1
                };

                //基类继承
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