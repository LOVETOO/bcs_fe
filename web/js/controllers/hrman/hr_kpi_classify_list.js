/**
 * 绩效考核方案
 * 2019/6/15
 * liujianbing
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
                $scope.data = {
                    currItem: {}
                };
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode:'check_stat'
                        }, {
                            field: 'empkpiclassify_no',
                            headerName: '考核分等编码'
                        }, {
                            field: 'kpicase_name',
                            headerName: '考核方案名称'
                        }, {
                            field: 'kpicase_type',
                            headerName: '方案类别',
                            hcDictCode:'kpicase_type'
                        }, {
                            field: 'kpi_period',
                            headerName: '考核周期类型',
                            hcDictCode:'kpi_period'
                        }, {
                            field: 'cyear',
                            headerName: '考核年度',
                            type:'年'
                        }, {
                            field: 'seasonmth',
                            headerName: '考核期间'
                        }, {
                            field: 'scale',
                            headerName: '分等比例'
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
                    ]

                }

                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });
                $scope.toolButtons.add.hide = true;
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