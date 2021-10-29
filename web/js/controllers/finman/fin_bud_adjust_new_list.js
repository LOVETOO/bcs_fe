/**
 * 预算调整(新)- 列表页
 * huderong
 *  2019-02-27
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'stat',
                            headerName: '状态',
                            hcDictCode: "stat"
                        },
                        {
                            field: 'adjust_no',
                            headerName: '调整单号'
                        },
                        {
                            field: 'bill_date',
                            headerName: '调整日期',
                            type: "日期"
                        },
                        {
                            field: 'bud_year',
                            headerName: '预算年度'
                        },
                        {
                            field: 'adjust_type',
                            headerName: '调整类型',
                            hcDictCode: 'fin_bud_adjust_type'
                        },
                        {
                            field: 'note',
                            headerName: '调整说明'
                        },
                        {
                            field: 'creator',
                            headerName: '创建人'
                        },
                        {
                            field: 'create_time',
                            headerName: '创建时间'
                        },
                        {
                            field: 'updator',
                            headerName: '修改人'
                        },
                        {
                            field: 'update_time',
                            headerName: '修改时间'
                        }
                    ]
                }

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