/**
 * 业务员资料  sale_employee_list
 * 2018-12-03 zhl
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
                        }, {
                            field: 'customer_name',
                            headerName: '客户名称',
                        }, {
                            field: 'short_name',
                            headerName: '简称',
                            pinned: 'left'
                        }, {
                            field: 'saleprice_type_name',
                            headerName: '销售价格类型',
                        }, {
                            field: 'sale_type',
                            headerName: '发货类型',
                        }, {
                            field: 'customer_type',
                            headerName: '客户类型',
                        }, {
                            field: 'areaname',
                            headerName: '行政区域',
                        }, {
                            field: 'dept_name',
                            headerName: '销售归属部门',
                            pinned: 'left'
                        }, {
                            field: 'sale_area_name',
                            headerName: '销售区域',
                        }, {
                            field: 'address1',
                            headerName: '送货地址',
                        }, {
                            field: 'take_man',
                            headerName: '提货人姓名',
                        }, {
                            field: 'phone_code',
                            headerName: '提货人电话',
                        },
                    ],
                    hcClassId: 'customer_org',
                    hcBeforeRequest: function (searchObj) {
                        searchObj.searchflag = 1;
                    }
                };

              /*  /!*增加按钮：复制、导出*!/
                $scope.toolButtons.copy = {
                    title: '复制',
                    icon: 'fa fa-copy',
                    click: function () {
                        $scope.copyBill && $scope.copyBill();
                    }
                };
                $scope.toolButtons.export = {
                    title: '导出',
                    icon: 'glyphicon glyphicon-log-out',
                    click: function () {
                        $scope.export && $scope.export();
                    }
                };

                /!**
                 * 复制并新增单据
                 *!/
                $scope.copyBill = function () {
                    var node = $scope.gridOptions.hcApi.getFocusedNode();

                    if (!node)
                        return swalApi.info('请选中要复制的行');

                    var copyData = $scope.gridOptions.hcApi.getFocusedData();

                    //打开费用记录属性页
                    return openBizObj({
                        stateName: 'finman.fin_fee_record_prop',
                        params: {
                            id: 0,
                            isCopy: true,
                            preItem: JSON.stringify(copyData)
                        }
                    }).result;
                };

                /!**
                 * 导出
                 *!/
                $scope.export = function () {

                };
*/
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

