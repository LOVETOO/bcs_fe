/**
 * 绩效考核方案列表
 * Created by sgc
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
                $scope.data = {};
                $scope.data.currItem = {};
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
                            }
                        },{
                            field: 'kpicase_name',
                            headerName: '考核方案名称'
                        },{
                            field: 'empkpibill_no',
                            headerName: '考核对象'
                        },{
                            field: 'kpicase_type',
                            headerName: '考核周期类型'
                        },{
                            field: 'cyear',
                            headerName: '考核年度'
                        }, {
                            field: 'kpi_period',
                            headerName: '考核期间'
                        }, {
                            field: 'userid',
                            headerName: '主评人权重'
                        }, {
                            field: 'org_name',
                            headerName: '自评人权重'
                        }, {
                            field: 'note',
                            headerName: '备注'
                        },{
                            field: 'creator',
                            headerName: '创建人'
                        },{
                            field: 'create_time',
                            headerName: '创建时间'
                        },{
                            field: 'updator',
                            headerName: '修改人'
                        },{
                            field: 'update_time',
                            headerName: '修改时间'
                        }
                    ]
                };

                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

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

                //确认按钮
                $scope.toolButtons.check = {
                    title: '确认',
                    click: function() {
                        $scope.check && $scope.check();
                    }
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