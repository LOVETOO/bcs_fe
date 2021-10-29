/**
 * 客户资料  sale_employee_list
 * 2018-12-06 zhl
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
                            field: 'customer_code',
                            headerName: '客户编码',
                            pinned:'left'
                        }, {
                            field: 'customer_name',
                            headerName: '客户名称',
                            maxWidth:400,
                            pinned:'left'
                        }, {
                            field: 'short_name',
                            headerName: '客户简称'
                        }, {
                            field: 'saleprice_type_name',
                            headerName: '销售价格类型'
                        }, {
                            field: 'sale_type',
                            headerName: '发货类型',
                            hcDictCode:'sale_types'
                        }, {
                            field: 'employee_name',
                            headerName: '业务员'
                        }, {
                            field: 'customer_type',
                            headerName: '客户类型',
                            hcDictCode:'customer_types'
                        }, {
                            field: 'areaname',
                            headerName: '行政区域'
                        }, {
                            field: 'dept_name',
                            headerName: '销售归属部门'
                        }, {
                            field: 'sale_area_name',
                            headerName: '销售区域'
                        }, {
                            field: 'address1',
                            headerName: '送货地址'
                        }, {
                            field: 'take_man',
                            headerName: '提货人姓名'
                        }, {
                            field: 'phone_code',
                            headerName: '提货人电话'
                        }
                    ],

                    hcObjType:'1812053'
                    /*
                     hcClassId: 'customer_org',
                    hcBeforeRequest: function (searchObj) {
                        searchObj.searchflag = 1;
                    }*/
                };

                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });



                //导入
                $scope.import = function () {

                }
                //按钮显示
                $scope.toolButtons.downloadImportFormat.hide = false;
                $scope.toolButtons.import.hide = false;

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

