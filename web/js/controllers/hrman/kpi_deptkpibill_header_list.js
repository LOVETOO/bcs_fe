/**
 * 部门绩效列表
 * 2019/06/21
 * Created by shenguocheng
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
                            hcDictCode: 'check_stat',
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'center' //文本居中
                                });
                            }
                        }, {
                            field: 'deptkpibill_no',
                            headerName: '部门绩效表单编码'
                        }, {
                            field: 'kpicase_name',
                            headerName: '考核方案名称'
                        }, {
                            field: 'kpi_period',
                            headerName: '考核周期类型',
                            hcDictCode: 'kpi_period'
                        }, {
                            field: 'cyear',
                            headerName: '考核年度'
                        }, {
                            field: 'seasonmth',
                            headerName: '考核期间',
                            type: '',
                            hcSelectOptions: '',
                            col_type: 1
                        }, {
                            field: 'org_name',
                            headerName: '被考核部门'
                        }, {
                            field: 'note',
                            headerName: '备注'
                        }, {
                            field: 'creator',
                            headerName: '创建人'
                        }, {
                            field: 'create_time',
                            headerName: '创建时间'
                        }, {
                            field: 'updator',
                            headerName: '修改人'
                        }, {
                            field: 'update_time',
                            headerName: '修改时间'
                        }
                    ],
                    hcAfterRequest: function (args) {
                        determine(args);
                    }
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                //考核期间显示
                function determine(args) {
                    args.kpi_deptkpibill_headers.forEach(function (val) {
                        switch (parseInt(val.kpi_period)) {
                            case 1:
                                $scope.gridOptions.columnDefs.forEach(function (col) {
                                    if (col.col_type) {
                                        val[col.type] = '数量';
                                    }
                                });
                                break;
                            case 2:
                                $scope.gridOptions.columnDefs.forEach(function (col) {
                                    if (col.col_type) {
                                        if (val.seasonmth == 1) {
                                            val.seasonmth = '上半年'
                                        }
                                        if (val.seasonmth == 2) {
                                            val.seasonmth = '下半年'
                                        }
                                    }
                                });
                                break;
                            case 3:
                                $scope.gridOptions.columnDefs.forEach(function (col) {
                                    if (col.col_type) {
                                        if (val.seasonmth == 1) {
                                            val.seasonmth = '1季度'
                                        }
                                        if (val.seasonmth == 2) {
                                            val.seasonmth = '2季度'
                                        }
                                        if (val.seasonmth == 3) {
                                            val.seasonmth = '3季度'
                                        }
                                        if (val.seasonmth == 4) {
                                            val.seasonmth = '4季度'
                                        }
                                    }
                                });
                                break;
                            case 4:
                                $scope.gridOptions.columnDefs.forEach(function (col) {
                                    if (col.col_type) {
                                        val[col.type] = '数量';
                                    }
                                });
                                break;
                        }
                    })
                };

                //隐藏新增按钮
                $scope.toolButtons.add.hide = true;

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