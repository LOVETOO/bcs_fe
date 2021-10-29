/**
 * 采购退货出库-列表页
 * 2018-12-10
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'openBizObj','swalApi','requestApi'],
    function (module, controllerApi, base_obj_list, openBizObj, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope','$stateParams',
            //控制器函数
            function ($scope, $stateParams) {
                $scope.gridOptions = {
                    columnDefs : [
                        {
                            type: '序号'
                        }, {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'invbilldate',
                            headerName: '单据日期',
                            type: '日期'
                        }
                        , {
                            field: 'invbillno',
                            headerName: '退货单号'
                        }
                        , {
                            field: 'vendor_code',
                            headerName: '供应商编码'
                        }
                        , {
                            field: 'vendor_name',
                            headerName: '供应商名称'
                        }
                        , {
                            field: 'price_type',
                            headerName: '价格类型',
                            hcDictCode: '*'
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
                            field: 'total_qty',
                            headerName: '合计数量',
                            type: '数量'
                        }
                        , {
                            field: 'amount_total',
                            headerName: '合计金额',
                            type: '金额'
                        }
                        , {
                            field: 'total_cubage',
                            headerName: '合计体积',
                            type:'体积'
                        },{
                            field: 'create_date',
                            headerName: '创建时间'
                        }, {
                            field: 'creator',
                            headerName: '创建人'
                        }


                       /* , {
                            field: 'year_month',
                            headerName: '记账月份'
                        }*/
                        , {
                            field: 'note',
                            headerName: '备注'
                        }
                    ],
                    hcObjType: 1904,
                    hcBeforeRequest: function (searchObj) {
                        searchObj.searchflag = 2;
                    }
                };

                $scope.data = $scope.data || {};

                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                //按钮
                $scope.toolButtons.import.hide = true;
                $scope.toolButtons.export.hide = true;
                $scope.toolButtons.downloadImportFormat.hide = true;



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
