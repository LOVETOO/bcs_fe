/**
 * Created by wzf on 2020/06/28.
 * bcs_barcodesearch_list 产品条码信息查询
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
                            field: 'short_barcode',
                            headerName: '防伪码'
                        },
                        {
                            field: 'outerboxno',
                            headerName: '外箱码', 
                        },
                        {
                            field: 'itemcode',
                            headerName: '产品编码', 
                        },
                        {
                            field: 'itemname',
                            headerName: '产品名称', 
                        },
                        {
                            field: 'consigneeid',
                            headerName: '客户编码' 
                        },
                        {
                            field: 'consigneename',
                            headerName: '客户名称' 
                        },
                        {
                            field: 'brand',
                            headerName: '品牌'
                        },
                        {
                            field: 'createat',
                            headerName: '防伪码创建时间'
                        },
                        {
                            field: 'edittime',
                            headerName: '出货时间'
                        }
                    ],
                    hcRequestAction: 'prodbarcodesearch', //打开页面前的请求方法
                    hcDataRelationName: 'bcs_mo_barcodes',
                    hcClassId: 'bcs_mo_barcode',
                    hcSearchWhenReady: false,
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
