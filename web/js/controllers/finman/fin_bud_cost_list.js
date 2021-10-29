/**
 * 成本预算编制-列表页
 * 2018-11-27
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
                        } , {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'cost_bud_head_no',
                            headerName: '成本预算单号'
                        }
                        , {
                            field: 'bud_year',
                            headerName: '编制年度'
                        },

                        {
                            field: 'cost_kind',
                            headerName: '行业类型',
                            hcDictCode:"cost_kind"
                        }
                        // , {
                        //     field: 'org_code',
                        //     headerName: '部门编码'
                        // }
                        // , {
                        //     field: 'org_name',
                        //     headerName: '部门名称'
                        // }
                        , {
                            field: 'comp_target_salesamt',
                            headerName: '总预算销售收入',
                            type:"金额"
                        }, {
                            field: 'total_sales_qty',
                            headerName: '预算销售总量',
                            type:"数量"
                        }, {
                            field: 'cost_type',
                            headerName: '成本计算方式',
                            hcDictCode:"cost_type"
                        }, {
                            field: 'cost_diff_rate',
                            headerName: '预算材料成本差异率',
                            type:"百分比"
                        }, {
                            field: 'fee_zz_rate',
                            headerName: '预算制造费用率',
                            type:"百分比"
                        }, {
                            field: 'cost_rg_rate',
                            headerName: '预算人工成本率',
                            type:"百分比"
                        }, {
                            field: 'cost_cl_amt',
                            headerName: '材料成本总额',
                            type:"金额"
                        }, {
                            field: 'cost_diff_amt',
                            headerName: '材料成本差异总额',
                            type:"金额"
                        }, {
                            field: 'fee_zz_amt',
                            headerName: '制造费用总额',
                            type:"金额"
                        }, {
                            field: 'cost_rg_amt',
                            headerName: '人工成本总额',
                            type:"金额"
                        }, {
                            field: 'total_cost_amt',
                            headerName: '销售成本总额',
                            type:"金额"
                        }
                        , {
                            field: 'note',
                            headerName: '编制说明'
                        }
                        , {
                            field: 'creator',
                            headerName: '创建人'
                        }
                        , {
                            field: 'create_time',
                            headerName: '创建时间'
                        }

                    ],
                    hcObjType: 18112799
                };

                controllerApi.run({
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
