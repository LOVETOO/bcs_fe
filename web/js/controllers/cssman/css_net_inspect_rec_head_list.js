/*
 * @Descripttion: 网点巡检记录列表页
 * @version: 
 * @Author: TSL
 * @Date: 2019-08-06 09:16:16
 * @LastEditors: TSL
 * @LastEditTime: 2019-08-06 13:00:25
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
                        hcDictCode: 'stat'
                    }, {
                        field: 'css_net_inspect_rec_no',
                        headerName: '单号'
                    }, {
                        field: 'input_name',
                        headerName: '录入人',
                        pinned: 'left'
                    }, {
                        field: 'input_time',
                        headerName: '录入时间'
                    }, {
                        field: 'dept_code',
                        headerName: '部门编码'
                    }, {
                        field: 'dept_name',
                        headerName: '部门名称'
                    }, {
                        field: 'cyear',
                        headerName: '年份'
                    }, {
                        field: 'cmonth',
                        headerName: '月份'
                    }, {
                        field: 'remark',
                        headerName: '备注'
                    }]
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
