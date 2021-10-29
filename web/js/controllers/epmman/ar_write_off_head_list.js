/**
 *  工程到款核销
 *  2019/8/01.
 *  zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        /**
         * 控制器
         */
        var ArWriteHeadList = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'write_off_head_code',
                        headerName: '核销单号'
                    }, {
                        field: 'project_code',
                        headerName: '项目编码'
                    }, {
                        field: 'project_name',
                        headerName: '项目名称'
                    }, {
                        field: 'customer_code',
                        headerName: '经销商编码'
                    }, {
                        field: 'customer_name',
                        headerName: '经销商名称'
                    }, {
                        field: 'received_amt',
                        headerName: '到款金额(元)',
                        type : '金额'
                    }, {
                        field: 'write_off_amt',
                        headerName: '核销金额(元)',
                        type : '金额'
                    }, {
                        field: 'remark',
                        headerName: '备注'
                    }, {
                        field: 'creator_name',
                        headerName: '创建人'
                    }, {
                        field: 'createtime',
                        headerName: '创建时间',
                        type : '时间'
                    }]
                };

                //继承列表页基础控制器
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
            controller: ArWriteHeadList
        });
    });

