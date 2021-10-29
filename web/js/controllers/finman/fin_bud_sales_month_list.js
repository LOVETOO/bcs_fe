/**
 * 销售预算编制-列表页
 * 2018-11-27
 */
define(
    ['module', 'controllerApi', 'base_obj_list','swalApi','requestApi'],
    function (module, controllerApi, base_obj_list,swalApi,requestApi) {
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
                        }, {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: 'stat'
                        }
                        , {
                            field: 'sales_bud_head_no',
                            headerName: '销售预算单号'
                        }
                        , {
                            field: 'bud_year',
                            headerName: '编制年度',
                            type:'number'
                        }
                        , {
                            field: 'org_code',
                            headerName: '部门编码'
                        }
                        , {
                            field: 'org_name',
                            headerName: '部门名称'
                        }
                        ,
                        {
                            field: 'total_sales_qty',
                            headerName: '累计销售数量',
                            type:'数量'
                        },
                        {
                            field: 'total_sales_amt',
                            headerName: '累计销售金额',
                            type:'金额'
                        },
                        {
                            field: 'comp_target_salesamt',
                            headerName: '总预算销售收入',
                            type:'金额'
                        }
                        , {
                            field: 'dept_target_salesamt',
                            headerName: '部门预算销售收入',
                            type:'金额'
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
                            headerName: '创建时间',
                            type:"日期"
                        }

                    ],
                    hcObjType: 181201
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
                                classId: "fin_bud_sales_month_head",
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
