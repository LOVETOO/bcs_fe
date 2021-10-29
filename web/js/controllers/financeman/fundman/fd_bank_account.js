/**
 * 开户银行设置-编辑+列表页
 * 2018-12-14
 */
define(
    ['module', 'controllerApi' ,'base_edit_list' ],
    function (module, controllerApi, base_edit_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                /**数据定义 */
                $scope.data = {};
                $scope.data.currItem = {};

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'bank_code',
                            headerName: '银行编码'
                        }
                        , {
                            field: 'bank_name',
                            headerName: '银行名称'
                        }
                        , {
                            field: 'bank_accno',
                            headerName: '银行账号'
                        }
                        , {
                            field: 'bank_address',
                            headerName: '银行地址'
                        } 
                        , {
                            field: 'rate_bail',
                            headerName: '保证金比率',
                            type: '百分比'
                        }
                        , {
                            field: 'rate_discount',
                            headerName: '贴现金比率',
                            type: '百分比'
                        }
                        , {
                            field: 'remark',
                            headerName: '备注'
                        }

                    ]
                };

                controllerApi.extend({
                    controller: base_edit_list.controller,
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