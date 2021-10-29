/**
 * 价格类型
 * 2018-12-03 zhl
 */
define(
    ['module', 'controllerApi', 'base_obj_list' ],
    function (module, controllerApi, base_obj_list) {
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
                            field: 'saleprice_type_code',
                            headerName: '价格类型编码',
                            pinned: 'left'
                        }, {
                            field: 'saleprice_type_name',
                            headerName: '价格类型名称',
                            type:"string",
                            pinned: 'left'
                        }, {
                            field: 'remark',
                            headerName: '备注',
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
                    hcClassId: 'sa_saleprice_type',
                    hcBeforeRequest: function (searchObj) {
                        searchObj.searchflag = 1;
                    }
                };
               /* //数据加载
                requestApi.post("sa_saleprice_type", "search", {}).then(function (data) {
                    if (!data.sa_saleprice_types) {
                        data.sa_saleprice_types = [];
                    }
                    $scope.gridOptions.hcApi.setRowData(data.sa_saleprice_types);
                });*/
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
