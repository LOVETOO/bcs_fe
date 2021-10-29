/**
 * 预算调整- 对象列表页
 * 2018-10-31
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode: 'stat',
                        pinned: 'left'
                    }, {
                        field: 'style',
                        headerName: '调整类型',
                        hcDictCode: 'style',
                        pinned: 'left'
                    }, {
                        field: 'adjust_no',
                        headerName: '调整单编码',
                        pinned: 'left'
                    }, {
                        field: 'bill_type',
                        headerName: '单据类型',
                        hcDictCode: 'bill_type',
                        pinned: 'left'
                    }, {
                        field: 'bill_date',
                        headerName: '调整日期'
                    }, {
                        field: 'creator',
                        headerName: '制单人'
                    }, {
                        field: 'create_time',
                        headerName: '制单时间'
                    }, {
                        field: 'org_code',
                        headerName: '制单部门编码'
                    }, {
                        field: 'org_name',
                        headerName: '制单部门'
                    }, {
                        field: 'bud_year',
                        headerName: '预算年度'
                    }, {
                        field: 'note',
                        headerName: '备注'
                    }, {
                        field: 'test',
                        headerName: '测试',
                        columnTypes: "下拉"
                    }
                    ]
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