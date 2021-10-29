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
                            field: 'pkgname',
                            headerName: '包名称'
                        }
                        , {
                            field: 'routename',
                            headerName: '路由名称'
                        }
                        , {
                            field: 'objtypeid',
                            headerName: '对象配置id'
                        },{
                            field: 'pagetitle',
                            headerName: '页面标题'
                        }
                        , {
                            field: 'type',
                            headerName: '页面类型',
                            type: '词汇',
                            cellEditorParams: {
                                names: ['对象列表页面', '对象属性页面', '左树右列表页面', '空白自定义页面', '编辑面板+列表页面'],
                                values: [1, 2, 3, 4, 5]
                            }
                        }
                        , {
                            field: 'params',
                            headerName: '路由参数'
                        }
                        , {
                            field: 'statename',
                            headerName: '状态名称'
                        }
                        , {
                            field: 'url',
                            headerName: 'url'
                        }
                        , {
                            field: 'templateurl',
                            headerName: '模板文件名称'
                        }
                        , {
                            field: 'note',
                            headerName: '备注'
                        }
                        , {
                            field: 'usable',
                            headerName: '可用',
                            type: '是否'
                        }
                        , {
                            field: 'diy_html',
                            headerName: '自定义html',
                            type: '是否'
                        },
                        {
                            field: 'creator',
                            headerName: '创建人'
                        }
                        , {
                            field: 'createtime',
                            headerName: '创建时间'
                        }
                        , {
                            field: 'updator',
                            headerName: '更新人'
                        }
                        , {
                            field: 'updatetime',
                            headerName: '更新时间'
                        }

                    ],
                    hcOpenState: {
                        'objtypeid': {
                            name: 'baseman.objconf_prop',
                            idField: 'objtypeid'
                        }
                    }
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