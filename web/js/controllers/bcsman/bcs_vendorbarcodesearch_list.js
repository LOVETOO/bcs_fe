/*
 * @Author: 黄太平
 * @Date: 2020-07-13 13:36:45
 * @LastEditTime: 2020-07-13 13:39:45
 * @LastEditors: wzf
 * @Description: 供应商条码使用情况查询
 * @FilePath: \bcs\www\web\js\controllers\bcsman\bcs_vendorbarcodesearch_list.js
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

                //与“客户编码”关联的字段
                $scope.customerRelationField = [];
                $scope.flag = 1;
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'vendorcode',
                            headerName: '供应商编码'
                        },
                        {
                            field: 'supplier_name',
                            headerName: '供应商名称'    
                        },
                        {
                            field: 'warehousename',
                            headerName: '基地'    
                        },
                        {
                            field: 'qty',
                            headerName: '领用数量',
                            cellStyle: {
                                "text-align": "center"
                            }
                        },
                        {
                            field: 'usedcount',
                            headerName: '回收数量',
                            cellStyle: {
                                "text-align": "center"
                            }
                        },
                    ],
                    hcRequestAction: 'searchbracodcount', //打开页面前的请求方法
                    hcDataRelationName: 'bcs_inv_stocks',
                    hcClassId: 'bcs_bnv_stock',
                    hcAfterRequest: function (response) {//请求完表格事件后触发
                    }
                };

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                /*---------------------按钮隐藏--------------------------*/
                $scope.filterSetting = {};

                $scope.toolButtons.add.hide = true;
                $scope.toolButtons.delete.hide = true;
                $scope.toolButtons.openProp.hide = true;
                $scope.toolButtons.filter.hide = true;
                $scope.toolButtons.refresh.hide = true;

                $scope.toolButtonGroups.more.hide = true;
            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.registerController({
            module: module,
            controller: controller
        });
    }
);

