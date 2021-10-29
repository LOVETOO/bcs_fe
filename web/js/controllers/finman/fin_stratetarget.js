/**
 * 公司战略目标-列表页
 * date:2018-11-27
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [{
                            type: '序号'
                        }, {
                            field: 'strate_year',
                            headerName: '年度',
                        }, {
                            field: 'entorgid',
                            headerName: '品类',
                        }, {
                            field: 'sales_amt',
                            headerName: '销售收入目标/元',
                        }, {
                            field: 'profit_amt',
                            headerName: '利润目标/元',
                        }, {
                            field: 'note',
                            headerName: '说明'
                        }

                    ]
                    // defaultColDef: {
                    //     editable: true
                    // }
                };
                // requestApi.post('fin_statetarget', 'search', {}).then(function (result) {
                //     // console.log("0.0", result);
                //     if (!result.fin_statetargets) {
                //         result.fin_statetargets = [];
                //     }
                //     $scope.gridOptions.hcApi.setRowData(result.fin_statetargets);
                // })
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });
                //单元格双击事件
                $scope.gridOptions.onCellDoubleClicked = function (node) {
                    $('#newModal').modal('show');
                    // console.log("11",node)
                    $scope.data.currItem = node.data;
                };
                // 增加按钮
                $scope.toolButtons = {
                    search: {
                        title: '查询',
                        icon: 'fa fa-search',
                        click: function () {
                            $scope.search && $scope.search();
                        }
                    },
                    refresh: {
                        title: '刷新',
                        icon: 'fa fa-refresh',
                        click: function () {
                            $scope.refresh && $scope.refresh();
                        }
                    },
                    delete: {
                        title: '删除',
                        icon: 'fa fa-minus',
                        click: function () {
                            $scope.delete && $scope.delete();
                        }
                    },
                    add: {
                        title: '新增',
                        icon: 'fa fa-plus',
                        click: function () {
                            $scope.add && $scope.add();
                        }
                    }
                };
                // 查询
                $scope.gridOptions.hcClassId = 'fin_stratetarget';
                $scope.search = function () {
                    //用表格产生条件，并查询
                    return $scope.gridOptions.hcApi.searchByGrid();
                };
                // 刷新
                $scope.refresh = function () {
                    //刷新即是用上此的查询条件再查询一次
                    return $scope.gridOptions.hcApi.search();
                };
                // $scope.refresh();
                $scope.delete = function () {
                    // 获取选中的行的数据
                    var focuseData = $scope.gridOptions.hcApi.getFocusedData();
                    if (!focuseData || !focuseData.stratetarget_id) {
                        return swalApi.info("请选择要删除的行!");
                    };
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除编码为" + focuseData.stratetarget_code + "的目标吗?",
                        okFun: function () {
                            //函数区域
                            requestApi.post("fin_stratetarget", "delete", {
                                stratetarget_id: focuseData.stratetarget_id
                            }).then(function (data) {
                                $scope.refresh();
                                //清除选中
                                $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                            });
                        },
                        okTitle: '删除成功'
                    });
                }
                //新增方法
                $scope.add = function () {
                    $scope.data.currItem = {};
                    $('#newModal').modal('show');
                }
                //保存
                $scope.save = function () {
                    if (!$scope.data.currItem.stratetarget_code) {
                        return swalApi.error("战略编码不能为空!");
                    }
                    if (!$scope.data.currItem.newitem_id) {
                        //新增
                        requestApi.post("fin_stratetarget", "insert", $scope.data.currItem).then(function (data) {
                            $scope.refresh();
                            //清除选中
                            $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                            return swalApi.success("保存成功!");
                        });
                    } else {
                        //更新
                        requestApi.post("fin_stratetarget", "update", $scope.data.currItem).then(function (data) {
                            $scope.refresh();
                            //清除选中
                            $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                            return swalApi.success("保存成功!");
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