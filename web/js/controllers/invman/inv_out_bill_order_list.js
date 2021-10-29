/**
 * 销售订单出库列表
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
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode: '*'
                    },{
                        field: 'invbillno',
                        headerName: '出库单号'
                    }, {
                        field: 'cust_order_no',
                        headerName: '销售单号'
                    }, {
                        field: 'date_invbill',
                        headerName: '单据日期',
                        type:"日期"
                    }, {
                        field: 'customer_code',
                        headerName: '客户编码'
                    }, {
                        field: 'customer_name',
                        headerName: '客户名称'
                    }, {
                        field: 'dept_code',
                        headerName: '部门编码'
                    }, {
                        field: 'dept_name',
                        headerName: '部门名称'
                    }, {
                        field: 'sale_area_name',
                        headerName: '销售区域'
                    }, {
                        field: 'employee_name',
                        headerName: '业务员'
                    }, {
                        field: 'address1',
                        headerName: '收货地址'
                    }, {
                        field: 'take_man',
                        headerName: '收货人'
                    }, {
                        field: 'phone_code',
                        headerName: '收货人电话'
                    }, {
                        field: 'crm_entid',
                        headerName: '品类',
                        hcDictCode:'crm_entid'
                    },
                        {
                        field: 'warehouse_code',
                        headerName: '出库仓编码'
                    }, {
                        field: 'warehouse_name',
                        headerName: '出库仓名称'
                    },
                        {
                        field: 'qty_sum',
                        headerName: '合计数量',
                        type:'数量'
                    }, {
                        field: 'amount_total',
                        headerName: '含税总额',
                        type:'金额'
                    },{
                        field: 'total_cubage',
                        headerName: '合计体积',
                        type:'体积'
                    },{
                        field: 'tax_rate',
                        headerName: '税率',
                        type:"百分比"
                    }, {
                        field: 'is_direct',
                        headerName: '现款销售',
                        type:"是否"
                    },
                    //     {
                    //     field: 'note',
                    //     headerName: '运输说明'
                    // },
                        {
                        field: 'creator',
                        headerName: '创建人'
                    },{
                        field: 'create_time',
                        headerName: '创建时间'
                    },{
                        field: 'mo_remark',
                        headerName: '备注'
                    }],
                    hcBeforeRequest:function (searchObj) {
                        searchObj.search_flag = 7;
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
