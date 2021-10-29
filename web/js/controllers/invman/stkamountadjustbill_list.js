/**
 * 入库单列表0301(库存金额调整单)
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_list, swalApi, requestApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode:'stat'
                    },{
                        field: 'invbillno',
                        headerName: '单据号',
                    }, {
                        field: 'invbilldate',
                        headerName: '单据日期',
                        type:"日期"
                    }, {
                        field: 'warehouse_code',
                        headerName: '仓库代码',

                    }, {
                        field: 'warehouse_name',
                        headerName: '仓库名称',
                    },{
                        field: 'dept_code',
                        headerName: '部门编码',
                    }, {
                        field: 'dept_name',
                        headerName: '部门名称',
                    }, {
                        field: 'is_auditing_wh',
                        headerName: '仓库审核',
                        type: '是否'
                    }, {
                        field: 'creator',
                        headerName: '创建人'
                    }, {
                        field: 'create_date',
                        headerName: '创建时间'
                    }
                    ],
                    hcBeforeRequest: function (searchObj) {
                        searchObj.searchflag = 10;
                    }
                };
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                $scope.toolButtons.audit = {
                    title: '审核',
                    click: function () {
                        return $scope.audit && $scope.audit();
                    }
                };

                $scope.toolButtons.unaudit = {
                    title: '反审核',
                    click: function () {
                        return $scope.unaudit && $scope.unaudit();
                    }
                };

                $scope.audit = function () {
                    var data = $scope.gridOptions.hcApi.getFocusedData();
                    if (data==undefined) {
                        return swalApi.info("请选中要审核的单据");
                    }else {
                        var postData = {
                            classId: "inv_in_bill_head",
                            action: 'amountadjustcheck',
                            data: {inv_in_bill_head_id: data.inv_in_bill_head_id}
                        };
                        return requestApi.post(postData)
                            .then(function (data) {
                                $scope.refresh();
                                swalApi.success("审核成功");

                            });
                    }
                }

                $scope.unaudit = function () {
                    var data = $scope.gridOptions.hcApi.getFocusedData();
                    if (data==undefined) {
                        return swalApi.info("请选中要反审核的单据");
                    }else{
                        var postData = {
                            classId: "inv_in_bill_head",
                            action: 'amountadjustuncheck',
                            data: {inv_in_bill_head_id:data.inv_in_bill_head_id}
                        };
                        return requestApi.post(postData)
                            .then(function (data) {
                                $scope.refresh();
                                swalApi.success("反审核成功");
                            });
                    }
                }
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