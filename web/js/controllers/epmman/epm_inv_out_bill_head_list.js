/**
 * 工程订单出库
 * 2019/7/1
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
                    }
                    // ,{
                    //     field: 'invbillno',
                    //     headerName: '出库单号'
                    // }
                    , {
                        field: 'invbill_sap_no',
                        headerName: 'ERP出库单号'
                    },  {
                        field: 'order_type',
                        headerName: '订单类型',
                        hcDictCode:'epm.bill_type'
                    }, {
                        field: 'customer_code',
                        headerName: '客户编码'
                    }, {
                        field: 'customer_name',
                        headerName: '客户名称'
                    }, {
                        field: 'delivery_base',
                        headerName: '发货基地'
                    }, {
                        field: 'outbill_date',
                        headerName: '发货日期',
                        type:'日期'
                    }, {
                        field: 'contract_code',
                        headerName: '合同编码'
                    }, {
                        field: 'contract_name',
                        headerName: '合同名称'
                    }, {
                        field: 'take_man',
                        headerName: '提货人'
                    }, {
                        field: 'qty_sum',
                        headerName: '总数量',
                        type:'数量'
                    }, {
                        field: 'legal_entity_code',
                        headerName: '法人客户编码'
                    }, {
                        field: 'legal_entity_name',
                        headerName: '法人客户名称'
                    }, {
                        field: 'total_cubage',
                        headerName: '总体积',
                        type:'体积'
                    }, {
                        field: 'wtamount_total_f',
                        headerName: '总金额',
                        type:'金额'
                    }, {
                        field: 'attribute4',
                        headerName: '广告费点数'
                    }, {
                        field: 'attribute5',
                        headerName: '返点点数'
                    }, {
                        field: 'plate_number',
                        headerName: '车牌号'
                    }, {
                        field: 'printtimes',
                        headerName: '打印次数'
                    }, {
                        field: 'note',
                        headerName: '备注'
                    }, {
                        field: 'creator_name',
                        headerName: '创建人'
                    }, {
                        field: 'create_time',
                        headerName: '创建时间',
                        type:'时间'
                    }],
                    hcPostData: {
                        search_flag : 9
                    }
                };
                //继承列表页基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                $scope.toolButtons.add.hide = true;
                $scope.toolButtons.delete.hide = true;


            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });

