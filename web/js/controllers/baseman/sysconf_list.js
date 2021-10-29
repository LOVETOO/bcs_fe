/**
 * 路由 - 对象列表页
 * @since 2018-09-12
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
                        }
                        , {
                            field: 'confname',
                            headerName: '参数编码',
                            pinned: 'left'
                        }
                        , {
                            field: 'confdesc',
                            headerName: '参数名称',
                            pinned: 'left'
                        }
                        , {
                            field: 'conftype',
                            headerName: '分类',
                            pinned: 'left',
                            type: '词汇',
                            cellEditorParams: {
                                names: ['企业信息', '企业岗位','系统参数'],
                                values: [1,2,3]
                            }
                        }
                        , {
                            field: 'datatype',
                            headerName: '类型',
                            // hcDictCode: '*',
                            pinned: 'left'
                        }
                        , {
                            field: 'confvalue',
                            headerName: '值',
                            pinned: 'left'
                        }
                        , {
                            field: 'note',
                            headerName: '备注'
                        }    
                    ]
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