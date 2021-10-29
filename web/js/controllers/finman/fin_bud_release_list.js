/**
 * 预算释放- 列表页
 * huderong
 *  2019-03-04
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
                            field: 'fin_bud_release_no',
                            headerName: '预算释放单号'
                        },
                        {
                            field: 'bud_year',
                            headerName: '年度'
                        },
                        {
                            field: 'dept_name',
                            headerName: '部门'
                        },
                        {
                            field: 'dname',
                            headerName: '预算期间'
                        },
                        {
                            field: 'period_type',
                            headerName: '预算期间类别',
                            hcDictCode: "period_type"
                        },
                        {
                            field: 'bud_control_type',
                            headerName: '预算控制方式',
                            hcDictCode: "fin_bud_control_types"
                        },
                        {
                            field: 'expect_progress_rate',
                            headerName: '预计进度',
                            type:"百分比"
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
                        },
                        {
                            field: 'note',
                            headerName: '说明'
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