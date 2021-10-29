/**
 * Created by wzf on 2020/02/28.
 * bcs_mobarcode_list 工单条码查询
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

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'serialno',
                            headerName: '条码'
                        },
                        {
                            field: 'productno',
                            headerName: '产品编码', 
                        },
                        {
                            field: 'itemname',
                            headerName: '产品名称', 
                        },
                        {
                            field: 'workorder',
                            headerName: '工单' 
                        },
                        {
                            field: 'printer',
                            headerName: '打印人' 
                        },
                        {
                            field: 'printnumber',
                            headerName: '打印数量'
                        },
                        {
                            field: 'printtime',
                            headerName: '打印时间'
                        },
                        {
                            field: 'updatetime',
                            headerName: '更新时间'
                        }
                    ],
                    hcRequestAction: 'search', //打开页面前的请求方法
                    hcDataRelationName: 'bcs_mo_barcodes',
                    hcClassId: 'bcs_mo_barcode',
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
