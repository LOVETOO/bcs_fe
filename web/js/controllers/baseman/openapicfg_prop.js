/**
 * 外部接口配置 - 对象属性页
 * 2018-12-20 add by qch
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi'],
    function (module, controllerApi, base_obj_prop, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$filter',
            //控制器函数
            function ($scope, $filter) {
                /*--------------------数据定义------------------------*/
                $scope.data = {};
                $scope.data.currItem = {};

                /**
                 * 网格配置
                 */
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'api_url',
                        headerName: '接口地址',
                        editable: true
                    }, {
                        field: 'api_ref',
                        headerName: '接口使用参考地址',
                        editable: true
                    }, {
                        field: 'api_callnum',
                        headerName: '接口调用次数'
                    }, {
                        field: 'lastcalltime',
                        headerName: '接口最后调用时间'
                    }, {
                        field: 'note',
                        headerName: '备注',
                        editable: true
                    }, {
                        field: 'reqaction',
                        headerName: '请求方法',
                        editable: true
                    }]
                };

                /**
                 * 继承主控制器
                 */
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });


                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);

                    bizData.api_id = 0;
                    bizData.base_openapi_intfs = [];

                    $scope.gridOptions.hcApi.setRowData(bizData.base_openapi_intfs);
                };


                /**
                 * 设置网格数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.base_openapi_intfs);
                };


                /*--------------------事件------------------------*/
                /**
                 * 保存
                 */
                $scope.save = function () {
                    var lines = $scope.data.currItem.base_openapi_intfs;

                    if (lines.length == 0) {
                        return swalApi.info('请添加明细！');
                    }

                    return $scope.hcSuper.save();
                };


                /**
                 * 增加行
                 */
                $scope.add_line = function () {
                    $scope.gridOptions.api.stopEditing();
                    var line = {};
                    $scope.data.currItem.base_openapi_intfs.push(line);

                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.base_openapi_intfs);
                };


                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.base_openapi_intfs.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.base_openapi_intfs);
                    }
                };


                /*--------------------底部左边按钮------------------------*/
                $scope.footerLeftButtons.add_line = {
                    title: '增加行',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    }
                };


                $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    }
                };

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