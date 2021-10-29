/**
 * 采购入库红冲  inv_in_bill_red_list
 * 2018-12-24 zhl
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_list, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode:'stat'
                        }, {
                            field: 'invbillno',
                            headerName: '红冲单号'
                        },{
                            field: 'invbilldate',
                            headerName: '单据日期',
                            type: '日期'
                        }, {
                            field: 'total_qty',
                            headerName: '合计红冲数量',
                            type:'数量'
                        }, {
                            field: 'amount_total',
                            headerName: '合计红冲金额',
                            type:'金额'
                        }, {
                            field: 'total_cubage',
                            headerName: '合计红冲体积',
                            type:'体积'
                        }, {
                            field: 'invbillno_relevant',
                            headerName: '入库单号'
                        }, {
                            field: 'vendor_code',
                            headerName: '供应商编码'
                        }, {
                            field: 'vendor_name',
                            headerName: '供应商名称'
                        },{
                            field: 'warehouse_code',
                            headerName: '仓库编码'
                        }, {
                            field: 'warehouse_name',
                            headerName: '仓库名称'
                        }, {
                            field: 'create_date',
                            headerName: '创建时间'
                        }, {
                            field: 'creator',
                            headerName: '创建人'
                        }, {
                            field: 'note',
                            headerName: '备注'
                        }
                    ],
                    hcObjType: 1156,
                    hcBeforeRequest: function (searchObj) {
                        searchObj.searchflag = 4;
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
