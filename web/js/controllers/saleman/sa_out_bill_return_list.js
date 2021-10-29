/**
 * 销售退货入库-列表页
 * 2018-12-25
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
                    columnDefs: [
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
                            headerName: '退货入库单号'
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
                        // , {
                        //     field: 'employee_name',
                        //     headerName: '业务员'
                        // }
                        // , {
                        //     field: 'address1',
                        //     headerName: '收货地址'
                        // }
                        , {
                            field: 'crm_entid',
                            headerName: '品类',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'attribute5',
                            headerName: '退货类型',
                            hcDictCode: 'sales_return_type'
                        }
                        , {
                            field: 'refer_no',
                            headerName: '退货单号'
                        }
                        , {
                            field: 'warehouse_code',
                            headerName: '仓库编码'
                        }
                        , {
                            field: 'warehouse_name',
                            headerName: '仓库名称'
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
                    hcObjType: 18122502,
                    hcBeforeRequest: function (searchObj) {
                        searchObj.search_flag = 3;
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
