/**
 * 费用预算分解-列表页
 * 2018-12-12
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
                    columnDefs : [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'fee_bud_head_no',
                            headerName: '费用预算单号'
                        }
                        , {
                            field: 'bud_year',
                            headerName: '预算编制年度'
                        }
                        , {
                            field: 'period_type',
                            headerName: '预算期间类别',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'org_code',
                            headerName: '部门编码'
                        }
                        , {
                            field: 'org_name',
                            headerName: '部门名称'
                        }
                        // , {
                        //     field: 'bud_type_code',
                        //     headerName: '预算类别编码'
                        // }
                        // , {
                        //     field: 'bud_type_name',
                        //     headerName: '预算类别名称'
                        // }
                        // , {
                        //     field: 'fee_type_name',
                        //     headerName: '所属费用大类'
                        // }
                        , {
                            field: 'comp_budyear_salesamt',
                            headerName: '总预算销售收入',
                            type: '金额'
                        }
                        // , {
                        //     field: 'target_salesamt',
                        //     headerName: '部门预算销售收入',
                        //     type: '金额'
                        // }
                        // , {
                        //     field: 'growth_rate',
                        //     headerName: '部门销售增长率%',
                        //     type: '百分比不转换'
                        // }
                        , {
                            field: 'total_bud_fee_amt',
                            headerName: '费用预算总额',
                            type: '金额'
                        }
                        , {
                            field: 'note',
                            headerName: '说明'
                        }
                        , {
                            field: 'creator',
                            headerName: '创建人'
                        }
                        , {
                            field: 'create_time',
                            headerName: '创建时间'
                        }
                        , {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: '*'
                        }
                    ],
                    hcObjType: 18121101
                };

                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                //按钮
                $scope.toolButtons.downloadImportFormat.hide = true;
                $scope.toolButtons.import.hide = true;
                $scope.toolButtons.copy.hide = true;
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
