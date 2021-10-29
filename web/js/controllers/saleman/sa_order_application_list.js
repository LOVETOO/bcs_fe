/**
 * 销售订单申请 sa_order_application_list
 * Created by zhl on 2019/1/18.
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
                    }, {
                        field: 'sa_salebillno',
                        headerName: '销售订单号'
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
                    }, {
                        field: 'warehouse_code',
                        headerName: '出库仓编码'
                    }, {
                        field: 'warehouse_name',
                        headerName: '出库仓名称'
                    }, {
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
                    },{
                        field: 'created_by',
                        headerName: '创建人'
                    },{
                        field: 'creation_date',
                        headerName: '创建时间'
                    },{
                        field: 'last_updated_by',
                        headerName: '修改人'
                    },{
                        field: 'last_update_date',
                        headerName: '修改时间'
                    },{
                        field: 'mo_remark',
                        headerName: '备注'
                    },]
                };

                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                //显示导入按钮
                //$scope.toolButtons.import.hide = false;
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
