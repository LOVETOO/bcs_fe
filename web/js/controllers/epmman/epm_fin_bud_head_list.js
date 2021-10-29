/**
 * 工程预算编制 列表
 * 2019/6/24
 * shenguocheng
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
                        }, {
                            field: 'stat',
                            headerName: '单据状态',
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'center' //文本居中
                                });
                            },
                            hcDictCode: 'stat'
                        }, {
                            field: 'project_code',
                            headerName: '预算编制编号'
                        }, {
                            field: 'project_name',
                            headerName: '工程项目编码'
                        }, {
                            field: 'project_type',
                            headerName: '工程项目名称'
                        }, {
                            field: 'signup_time',
                            headerName: '项目经理'
                        }, {
                            field: 'signup_people',
                            headerName: '所属部门',
                        }, {
                            field: 'signup_method',
                            headerName: '编制说明',
                            width: 200
                        }, {
                            field: 'create_by',
                            headerName: '创建人'
                        }, {
                            field: 'create_date',
                            headerName: '创建时间'
                        }, {
                            field: 'last_updated_by',
                            headerName: '修改人'
                        }, {
                            field: 'last_updated_date',
                            headerName: '修改时间'
                        }
                    ]
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                //文本居中
                function getDefaultCellStyle(params) {
                    var style = {};

                    if ($scope.gridOptions.defaultColDef) {
                        var defaultStyle = $scope.gridOptions.defaultColDef.cellStyle;
                        if (defaultStyle) {
                            if (angular.isObject(defaultStyle))
                                style = defaultStyle;
                            else if (angular.isFunction(defaultStyle))
                                style = defaultStyle(params);
                        }
                    }
                    return style;
                };
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