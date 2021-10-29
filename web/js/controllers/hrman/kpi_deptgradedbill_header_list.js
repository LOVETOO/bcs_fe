/**
 * 部门绩效评分列表
 * 2019/6/20
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
                $scope.data = {};
                $scope.data.currItem = {};
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
                        },{
                            field: 'deptkpibill_no',
                            headerName: '部门绩效表单编码'
                        }, {
                            field: 'kpicase_name',
                            headerName: '考核方案名称'
                        },{
                            field: 'appraiseman_userid',
                            headerName: '参评人'
                        }, {
                            field: 'org_name',
                            headerName: '部门名称'
                        }, {
                            field: 'note',
                            headerName: '备注'
                        } ,{
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