define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {
                    currItem: {}
                };
                /**
                 * 列表定义
                 **/
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },{
                            field: 'invbillno',
                            headerName: '单据编号'
                        },{
                            field: 'invbilldate',
                            headerName: '单据日期'
                        },{
                            field: 'bill_type',
                            hcDictCode:"bill_type",
                            headerName: '单据类型'
                        },{
                            field: 'customer_code',
                            headerName: '客户编码'
                        },{
                            field: 'customer_name',
                            headerName: '客户名称'
                        }, {
                            field: 'invbillmonth',
                            headerName: '单据月份'
                        },{
                            field: 'quantity_total',
                            type: '数量',
                            headerName: '总数量'
                        },{
                            field: 'amount_total',
                            type: '金额',
                            headerName: '总金额'
                        }, {
                            field: 'note',
                            headerName: '备注'
                        },
                    ]

                }
                /**
                 * 继承控制器
                 **/
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });


                $scope.toolButtons.copy.hide = true;



                /*   $scope.toolButtons.copy.click=function () {
                       return $scope.copy && $scope.copy();
                   }*/

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