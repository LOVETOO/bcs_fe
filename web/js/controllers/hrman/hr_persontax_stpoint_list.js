/**
 * 结算方式-编辑+列表页
 * 2018-11-26
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
                //$scope.data = {};
                //$scope.data.currItem = {};

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'persontax_area_code',
                            headerName: '税收地域编码'
                        }
                        , {
                            field: 'persontax_area_name',
                            headerName: '税收地域名称'
                        }
                        , {
                            field: 'start_point',
                            headerName: '起征点',
                            cellStyle:moneycellStyle,
                            valueFormatter:moneyvalueFormatter,
                            editable: false
                        }
                        , {
                            field: 'start_month',
                            headerName: '生效年月'
                        }
                        , {
                            field: 'remark',
                            headerName: '备注',
                        }
                        , {
                            field: 'created_by',
                            headerName: '创建者',
                        }
                        , {
                            field: 'creation_date',
                            headerName: '创建日期',
                        }
                        , {
                            field: 'last_updated_by',
                            headerName: '最后修改人',
                        }
                        , {
                            field: 'last_update_date',
                            headerName: '修改时间',
                        }
                    ],
                    hcAfterRequest: function (response) {
                        console.log(response);
                    }
                };
                // 金额样式
                function moneycellStyle(params) {
                    return angular.extend($scope.gridOptions.hcApi.getDefaultCellStyle(params), {
                        'text-align': 'right' //文本居右
                    });
                }

                //金额样式值格式化器
                function moneyvalueFormatter(params) {
                    if (params.value == 0 || params.value == '0') {
                        return '';
                    }
                    return HczyCommon.formatMoney(params.value);
                }
                /*-------------------通用查询开始------------------------*/

                controllerApi.extend({
                    controller: base_edit_list.controller,
                    scope: $scope
                });

                $scope.commonSearchSetting = {
                    hr_persontax_area: {
                        afterOk: function (response) {
                            console.log(response);
                            $scope.data.currItem.hr_persontax_area_id=response.hr_persontax_area_id
                            $scope.data.currItem.persontax_area_code=response.persontax_area_code;
                            $scope.data.currItem.persontax_area_name=response.persontax_area_name;

                        }
                    }
                };



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