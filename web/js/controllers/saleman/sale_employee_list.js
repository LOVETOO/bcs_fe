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
                            field: 'employee_code',
                            headerName: '业务员编码',
                            pinned: 'left'
                        }, {
                            field: 'employee_name',
                            headerName: '业务员名称',
                            pinned: 'left'
                        }, {
                            field: 'remark',
                            headerName: '备注',
                            pinned: 'left'
                        }, {
                            field: 'isuseable',
                            headerName: '可用',
                            type: '是否',
                            pinned: 'left'
                        }, {
                            field: 'created_by',
                            headerName: '创建人',
                            pinned: 'left'
                        }, {
                            field: 'creation_date',
                            headerName: '创建时间',
                            pinned: 'left'
                        }, {
                            field: 'last_updated_by',
                            headerName: '最后修改人',
                            pinned: 'left'
                        }, {
                            field: 'last_update_date',
                            headerName: '最后修改时间',
                            pinned: 'left'
                        },
                    ],
                    hcClassId: 'sale_employee',
                    hcBeforeRequest: function (searchObj) {
                        searchObj.searchflag = 2;
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

