/**
 * 工程费用摊销-列表页
 * shenguocheng
 * 2019-07-10
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: 'stat'
                        }, {
                            field: 'fee_allot_code',
                            headerName: '摊销单号'
                        }, {
                            field: 'allot_dimension',
                            headerName: '摊销形式',
                            hcDictCode:'epm.allot_dimension'
                        }, {
                            headerName: '工程信息',
                            children: [
                                {
                                    field: 'project_code',
                                    headerName: '工程编码'
                                }, {
                                    field: 'project_name',
                                    headerName: '工程名称'
                                }
                                , {
                                    field: 'customer_code_name',
                                    headerName: '客户信息',
                                    width : 120,
                                    suppressAutoSize: true,
                                    suppressSizeToFit: true
                                }
                            ]
                        }, {
                            headerName: '费用记录',
                            children: [
                                {
                                    field: 'ffr_creator',
                                    headerName: '申请人'
                                }, {
                                    field: 'dept_name',
                                    headerName: '申请部门'
                                }, {
                                    field: 'createtime',
                                    headerName: '申请日期',
                                    type: '日期'
                                }, {
                                    field: 'org_name',
                                    headerName: '报销部门'
                                }, {
                                    field: 'bud_type_name',
                                    headerName: '预算类别'
                                }, {
                                    field: 'fee_name',
                                    headerName: '费用项目'
                                }
                            ]
                        }, {
                            field: 'allot_amt',
                            headerName: '摊销金额(元)',
                            type: '金额'
                        }, {
                            field: 'creator_name',
                            headerName: '创建人'
                        }, {
                            field: 'createtime',
                            headerName: '创建时间'
                        }, {
                            field: 'updator_name',
                            headerName: '修改人'
                        }, {
                            field: 'updatetime',
                            headerName: '修改时间'
                        }
                    ],
                    hcAfterRequest:function(response){//请求完表格事件后触发
                        response.epm_fee_allots.forEach(function (value) {
                            value.customer_code_name = value.customer_code + "-" + value.customer_name;
                        });
                    }
                };

                //继承控制器
                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                /**
                 * 重写删除方法
                 */
                $scope.delete = function () {
                    return $q
                        .when()
                        .then($scope.hcSuper.delete)
                        .then($scope.refresh);
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
