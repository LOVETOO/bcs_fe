/**
 * 工程-销售区域列表
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
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'sale_area_code',
                            headerName: '销售区域编码',
                        }, {
                            field: 'sale_area_name',
                            headerName: '销售区域名称',
                        }, {
                            field: 'isuseable',
                            headerName: '可用',
                            type: "是否",
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'center' //文本居中
                                });
                            }
                        }, {
                            field: 'remark',
                            headerName: '备注',
                        }, {
                            field: 'created_by_name',
                            headerName: '创建人',
                        }, {
                            field: 'creation_date',
                            headerName: '创建时间',
                        }, {
                            field: 'last_updated_by_name',
                            headerName: '最后修改人',
                        }, {
                            field: 'last_update_date',
                            headerName: '最后修改时间',
                        }
                    ],
                    hcBeforeRequest: function (searchObj) {
                        searchObj.use_type = 2
                    },
                    hcClassId: 'sale_salearea'
                };

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