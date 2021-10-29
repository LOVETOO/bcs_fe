/**发票抬头 - 列表页 
 * 2018-12-5
 */
define(
    ['module', 'controllerApi' ,'base_diy_page', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                /**数据定义 */
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'company_name',
                        headerName: '名称',
                        minWidth:300
                    }, {
                        field: 'tax_no',
                        headerName: '纳税人识别号',
                        minWidth:300
                    }, {
                        field: 'address',
                        headerName: '单位地址',
                        minWidth:300
                    }, {
                        field: 'phone',
                        headerName: '电话号码',
                        minWidth:300
                    }, {
                        field: 'bank',
                        headerName: '开户银行',
                        minWidth:250
                    }, {
                        field: 'account_no',
                        headerName: '银行账号',
                        minWidth:300
                    }]
                };
                /**通用查询 */
               
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                 //单元格双击事件
                 $scope.gridOptions.onCellDoubleClicked = function (node) {
                    $('#newModal').modal('show');
                    $scope.data.currItem = node.data;
                };


                //添加按钮
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
                    openProp: {
                        title: '查看详情',
                        icon: '',
                        click: function () {
                            $scope.openProp && $scope.openProp();
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
                $scope.gridOptions.hcClassId = 'fin_invoice_head';
                $scope.search = function () {
                    //用表格产生条件，并查询
                    return $scope.gridOptions.hcApi.searchByGrid();
                };
                // 刷新
                $scope.refresh = function () {
                    //刷新即是用上此的查询条件再查询一次
                    return $scope.gridOptions.hcApi.search();
                };


                 //查看详情
                 $scope.openProp = function () {
                    var index = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    var focuseData = $scope.gridOptions.hcApi.getFocusedData();
                    if (index < 0 ) {
                        return swalApi.info("请选择要查看详情的行!");
                    };
                    $('#newModal').modal('show');
                    $scope.data.currItem = focuseData ;
                };
                //删除一条数据
                $scope.delete = function () {
                    // 获取选中的行的数据
                    var focuseData = $scope.gridOptions.hcApi.getFocusedData();
                    if (!focuseData || !focuseData.invoice_head_id) {
                        return swalApi.info("请选择要删除的行!");
                    };
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除名称为" + focuseData.company_name + "的发票抬头吗?",
                        okFun: function () {
                            //函数区域
                            requestApi.post("fin_invoice_head", "delete", {
                                invoice_head_id: focuseData.invoice_head_id
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
                    //清除选中
                    $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                    $scope.data.currItem = {};
                    $('#newModal').modal('show');
                }
                //保存
                $scope.save = function () {
                    if (!$scope.data.currItem.company_name ||
                        !$scope.data.currItem.tax_no ||
                        !$scope.data.currItem.address ||
                        !$scope.data.currItem.phone ||
                        !$scope.data.currItem.bank ||
                        !$scope.data.currItem.account_no) {
                        return swalApi.error("必填项不能为空,请检查!");
                    }

                    if (!$scope.data.currItem.invoice_head_id) {
                        //新增
                        requestApi.post("fin_invoice_head", "insert", $scope.data.currItem).then(function (data) {
                            // console.log(data)
                            $scope.data.currItem = data
                            $scope.refresh();
                            //清除选中
                            $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                            return swalApi.success("保存成功!");
                        });
                    } else {
                        //更新
                        requestApi.post("fin_invoice_head", "update", $scope.data.currItem).then(function (data) {
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