/**
 * 委托代销退货-列表页
 * 2019-01-04
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope, $stateParams) {
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
                            field: 'sa_salebillno',
                            headerName: '委托代销退货单号'
                        }
                        // , {
                        //     field: 'parent_billno',
                        //     headerName: '委托代销单号'
                        // }
                        , {
                            field: 'date_invbill',
                            headerName: '单据日期',
                            type: '日期'
                        }
                        // , {
                        //     field: 'date_invbill',
                        //     headerName: '记账月份',
                        //     type: '年月'
                        // }
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
                            field: 'warehouse_code',
                            headerName: '接收仓编码'
                        }
                        , {
                            field: 'warehouse_name',
                            headerName: '接收仓名称'
                        },
                        {
                            field: 'warehouse_code',
                            headerName: '代销仓编码'
                        }
                        , {
                            field: 'warehouse_name',
                            headerName: '代销仓名称'
                        }
                        , {
                            field: 'deliver_area_name',
                            headerName: '配送区域'
                        }, {
                            field: 'crm_entid',
                            headerName: '品类',
                            hcDictCode: 'crm_entid'
                        }
                        , {
                            field: 'qty_sum',
                            headerName: '合计数量',
                            type: '数量'
                        }
                        , {
                            field: 'amount_total',
                            headerName: '合计金额',
                            type: '金额'
                        }
                        , {
                            field: 'amount_total',
                            headerName: '合计体积',
                            type: '金额'
                        }
                        , {
                            field: 'amount_total',
                            headerName: '发运方式',
                        }
                        , {
                            field: 'take_man',
                            headerName: '退货人'
                        }, {
                            field: 'phone_code',
                            headerName: '退货人电话'
                        }
                        , {
                            field: 'address1',
                            headerName: '退货地址'
                        }
                        , {
                            field: 'created_by',
                            headerName: '创建人'
                        }
                        , {
                            field: 'creation_date',
                            headerName: '创建时间'
                        }
                        , {
                            field: 'note',
                            headerName: '备注'
                        }

                    ],
                    hcObjType: $stateParams.objtypeid,
                    hcBeforeRequest: function (searchObj) {
                        searchObj.search_flag = 3;
                    }
                };

                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                //显示导入按钮
                $scope.toolButtons.import.hide = false;
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
