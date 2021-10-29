/**
 * 其他入库红冲 列表页
 * 2018-12-26 huderong
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
                        }, {
                            field: 'invbillno',
                            headerName: '入库红冲单号'
                        }, {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: 'stat'
                        }, {
                            field: 'invbilldate',
                            headerName: '单据日期',
                            type: '日期'
                        }, {
                            field: 'invbillno_relevant',
                            headerName: '入库单号',
                        }, {
                            field: 'vendor_code',
                            headerName: '供应商编码'
                        }, {
                            field: 'vendor_name',
                            headerName: '供应商名称'
                        }, {
                            field: 'customer_code',
                            headerName: '客户编码'
                        }, {
                            field: 'customer_name',
                            headerName: '客户名称'
                        },{
                            field: 'dept_name',
                            headerName: '部门'
                        },
                        {
                            field: 'total_qty',
                            headerName: '合计红冲数量'
                        }, {
                            field: 'amount_total',
                            headerName: '合计红冲金额'
                        },
                        {
                            field: 'creator',
                            headerName: '创建人'
                        },{
                            field: 'create_date',
                            headerName: '创建时间'
                        },  {
                            field: 'note',
                            headerName: '备注'
                        }
                    ],
                    hcObjType: $stateParams.objtypeid,
                    hcBeforeRequest: function (searchObj) {
                        searchObj.searchflag = 7;
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
