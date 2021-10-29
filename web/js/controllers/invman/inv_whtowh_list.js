/**
 * 商品调拨单-列表页
 * date:2018-12-24
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_list, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope, $stateParams) {
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'inv_whtowh_head_no',
                            headerName: '单据号'
                        },
                        {
                            field: 'bill_date',
                            headerName: '单据日期',
                            type: "日期"
                        },
                        {
                            field: 'from_wh_name',
                            headerName: '调出仓库',
                        },
                        {
                            field: 'to_wh_name',
                            headerName: '调入仓库',
                        },
                        {
                            field: 'inv_in_bill_head_no',
                            headerName: '入库单据号',
                        },
                        {
                            field: 'inv_out_bill_head_no',
                            headerName: '出库单据号'
                        },
                        // {
                        //     field: 'is_checked',
                        //     headerName: '是否审核',
                        //     type: "是否"
                        // },
                        {
                            field: 'creator',
                            headerName: '创建人'
                        },
                        {
                            field: 'create_time',
                            headerName: '创建日期'
                        },
                        {
                            field: 'updator',
                            headerName: '最后修改人'
                        },
                        {
                            field: 'update_time',
                            headerName: '最后修改日期'
                        },
                        {
                            field: 'remark',
                            headerName: '备注',
                        },
                        {
                            field: 'qty_sum',
                            headerName: '合计数量',
                            type: "数量"
                        },
                        {
                            field: 'amount_total',
                            headerName: '合计金额',
                            type: "金额"
                        },
                        {
                            field: 'move_type',
                            headerName: '调拨类型',
                            hcDictCode: 'inv_move_type'
                        },
                        {
                            field: 'total_cubage',
                            headerName: '合计体积',
                        },
                        {
                            field: 'shipmode_name',
                            headerName: '发运方式'
                        }
                    ],
                    hcObjType: $stateParams.objtypeid,
                    hcBeforeRequest: function (searchObj) {
                        searchObj.search_flag = 1;
                    }
                };
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
    }
);