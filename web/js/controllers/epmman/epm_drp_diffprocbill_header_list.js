/**
 * 项目合同变更
 * 2019/6/28
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        /**
         * 控制器
         */
        var controller = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode:'stat'
                    },{
                        field: 'diffbill_no',
                        headerName: '签收单号'
                    }, {
                        field: 'creator_name',
                        headerName: '签收人'
                    },  {
                        field: 'create_time',
                        headerName: '签收时间',
                        type:'日期'
                    }, {
                        field: 'outbill_no',
                        headerName: '出库单号',
                        hide : true
                    }, {
                        field: 'invbill_sap_no',
                        headerName: 'ERP出库单号'
                    }, {
                        field: 'cust_code',
                        headerName: '客户编码'
                    }, {
                        field: 'cust_name',
                        headerName: '客户名称'
                    }, {
                        field: 'send_date',
                        headerName: '出库日期',
                        type:'日期'
                    }, {
                        field: 'anticipate_date',
                        headerName: '到货日期',
                        type:'日期'
                    }, {
                        field: 'receive_address',
                        headerName: '收货地址'
                    }, {
                        field: 'qty_sum',
                        headerName: '出库数量',
                        type:'数量'
                    }, {
                        field: 'total_amount',
                        headerName: '出库金额',
                        type:'金额'
                    }, {
                        field: 'received_qty',
                        headerName: '签收数量',
                        type:'数量'
                    }, {
                        field: 'received_amount',
                        headerName: '签收金额',
                        type:'金额'
                    }, {
                        field: 'mo_remark',
                        headerName: '备注'
                    }, {
                        field: 'creator_name',
                        headerName: '创建人'
                    }, {
                        field: 'create_time',
                        headerName: '创建时间',
                        type:'时间'
                    }, {
                        field: 'updator_name',
                        headerName: '修改人'
                    }, {
                        field: 'update_time',
                        headerName: '修改时间',
                        type:'时间'
                    }],
                    hcPostData: {
                        flag : 1
                    }
                };
                //继承列表页基础控制器
                controllerApi.extend({
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
    });

