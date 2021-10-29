/**
 * 月度成本预算编制-列表页
 * 2018-11-27
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_list, swalApi, requestApi) {
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
                            hcDictCode: "cost_kind"
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
                            type: "金额"
                        }, {
                            field: 'total_sales_qty',
                            headerName: '预算销售总量',
                            type: "数量"
                        }, {
                            field: 'cost_type',
                            headerName: '成本计算方式',
                            hcDictCode: "cost_type"
                        }, {
                            field: 'cost_diff_rate',
                            headerName: '预算材料成本差异率',
                            type: "百分比"
                        }, {
                            field: 'fee_zz_rate',
                            headerName: '预算制造费用率',
                            type: "百分比"
                        }, {
                            field: 'cost_rg_rate',
                            headerName: '预算人工成本率',
                            type: "百分比"
                        }, {
                            field: 'cost_cl_amt',
                            headerName: '材料成本总额',
                            type: "金额"
                        }, {
                            field: 'cost_diff_amt',
                            headerName: '材料成本差异总额',
                            type: "金额"
                        }, {
                            field: 'fee_zz_amt',
                            headerName: '制造费用总额',
                            type: "金额"
                        }, {
                            field: 'cost_rg_amt',
                            headerName: '人工成本总额',
                            type: "金额"
                        }, {
                            field: 'total_cost_amt',
                            headerName: '销售成本总额',
                            type: "金额"
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
                    hcObjType: 181205
                };

                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                // $scope.toolButtons.confirm = {
                //     title: '审核',
                //     icon: 'glyphicon glyphicon-ok',
                //     click: function () {
                //         $scope.confirm_state && $scope.confirm_state();
                //     }
                // };

                /**
                 * 确认
                 */
                $scope.confirm_state = function () {

                    var node = $scope.gridOptions.hcApi.getFocusedNode();
                    if (!node)
                        return swalApi.info('请先选中要审核的行').then($q.reject);

                    var title = '确定要审核该记录吗？';
                    (function () {
                        var field = $scope.data.codeField || $scope.data.nameField;
                        if (!field) return;

                        var headerName = $scope.$eval('gridOptions.columnApi.getColumn(field).colDef.headerName', {
                            field: field
                        });

                        if (!headerName) return;

                        var value = node.data[$scope.data.codeField];
                        if (!value) return;

                        title = '确定要审核"' + headerName + '"为"' + value + '"的记录吗？';
                    })();

                    return swalApi.confirmThenSuccess({
                        title: title,
                        okFun: function () {
                            var postData = {
                                classId: "fin_bud_cost_month_head",
                                action: 'confirm_state',
                                data: {}
                            };
                            postData.data[$scope.data.idField] = node.data[$scope.data.idField];

                            return requestApi.post(postData)
                                .then(function () {
                                    node.data.stat = 5;
                                    $scope.gridOptions.api.refreshView();
                                });
                        },
                        okTitle: '审核成功'
                    });
                }

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
