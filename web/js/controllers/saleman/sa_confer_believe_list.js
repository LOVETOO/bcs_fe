/**
 * 客户授信申请 - 对象列表页 sa_confer_believe_list
 * 2018-12-27 zhl
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
                //网格定义
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'bill_no',
                        headerName: '授信单号',
                        pinned:'left'
                    }, {
                        field: 'bill_date',
                        headerName: '单据日期',
                        type: '日期'
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode: 'stat'
                    }, {
                        field: 'customer_code',
                        headerName: '客户编码',
                        pinned:'left'
                    }, {
                        field: 'customer_name',
                        headerName: '客户名称',
                        pinned:'left'
                    }, {
                        field: 'amount',
                        headerName: '授信额度',
                        type: '金额'
                    }, {
                        field: 'star_date',
                        headerName: '生效日期',
                        type: '日期'
                    }, {
                        field: 'end_date',
                        headerName: '失效日期',
                        type: '日期'
                    }, {
                        field: 'fact_return_date',
                        headerName: '承诺还款日期',
                        type: '日期'
                    }, {
                        field: 'is_cancellation',
                        headerName: '作废',
                        type: '是否'
                    }, {
                        field: 'employee_name',
                        headerName: '责任人'
                    }, {
                        field: 'crm_entid',
                        headerName: '授信品类',
                        hcDictCode: 'crm_entid'
                    }, {
                        field: 'cnsx',
                        headerName: '承诺事项'
                    }, {
                        field: 'floor_type',
                        headerName: '授信类型',
                        hcDictCode: 'saleman.floor_type'
                    }, {
                        field: 'total_sale_amount',
                        headerName: '累计销售额',
                        type:'金额'
                    }, {
                        field: 'total_receive_payment',
                        headerName: '累计回款',
                        type:'金额'
                    }, {
                        field: 'current_receive_balance',
                        headerName: '当前应收余额',
                        type:'金额'
                    }, {
                        field: 'total_confer_believe_time',
                        headerName: '累计授信次数',
                        type:'数量'
                    }, {
                        field: 'total_confer_believe_amount',
                        headerName: '累计授信额度',
                        type:'金额'
                    }, {
                        field: 'remark',
                        headerName: '备注'
                    }, {
                        field: 'created_by',
                        headerName: '创建人'
                    }, {
                        field: 'creation_date',
                        headerName: '创建时间'
                    }], /*累计销售额 FACT_AMOUNT?、累计回款 Return_Money？、
                     当前应收余额 Balance_Amount?、累计授信次数、累计授信额度*/
                    hcObjType: 1012
                };

                //继承基础控制器
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

