/**
 * 销售出库红冲-列表页
 * 2018-12-24
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
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'invbillno',
                            headerName: '出库红冲单号'
                        }
                        , {
                            field: 'parent_billno',
                            headerName: '出库单号'
                        }
                        , {
                            field: 'date_invbill',
                            headerName: '单据日期',
                            type: '日期'
                        }
                        , {
                            field: 'customer_code',
                            headerName: '客户编码'
                        }
                        , {
                            field: 'customer_name',
                            headerName: '客户名称'
                        }
                        , {
                            field: 'dept_code',
                            headerName: '部门编码'
                        }
                        , {
                            field: 'dept_name',
                            headerName: '部门名称'
                        }
                        , {
                            field: 'employee_name',
                            headerName: '业务员'
                        }
                        , {
                            field: 'crm_entid',
                            headerName: '品类',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'qty_sum',
                            headerName: '合计数量',
                            type: '数量'
                        }
                        , {
                            field: 'total_cubage',
                            headerName: '合计体积',
                            type: '体积'
                        }
                        , {
                            field: 'amount_total',
                            headerName: '合计金额',
                            type: '金额'
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
                            field: 'note',
                            headerName: '备注'
                        }

                    ],
                    hcObjType: 18122401,
                    hcBeforeRequest: function (searchObj) {
                        searchObj.search_flag = 2;
                    }

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
