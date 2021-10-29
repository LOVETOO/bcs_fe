/**
 * 价格类型  sa_saleprice_type
 * 2018-12-03 zhl
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
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'saleprice_type_code',
                            headerName: '价格类型编码',
                            editable: false,
                            pinned: 'left'
                        }, {
                            field: 'saleprice_type_name',
                            headerName: '价格类型名称',
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
                //数据加载
                requestApi.post("sa_saleprice_type", "search", {}).then(function (data) {
                    if (!data.sa_saleprice_types) {
                        data.sa_saleprice_types = [];
                    }
                    $scope.gridOptions.hcApi.setRowData(data.sa_saleprice_types);
                });
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                //表格双击事件
                //单元格双击事件
                $scope.gridOptions.onCellDoubleClicked = function (node) {
                    $('#newModal').modal('show');
                    // console.log("11", node)
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
                //重写新增方法
                $scope.add = function () {
                    $scope.data.currItem = {};
                    $('#newModal').modal('show');
                };
                // 查询
                $scope.gridOptions.hcClassId = 'sa_saleprice_type';
                $scope.search = function () {
                    //用表格产生条件，并查询
                    return $scope.gridOptions.hcApi.searchByGrid();
                };
                // 刷新
                $scope.refresh = function () {
                    //刷新即是用上此的查询条件再查询一次
                    return $scope.gridOptions.hcApi.search();
                };
                //删除
                $scope.delete = function () {
                    // 获取选中的行的数据
                    var focuseData = $scope.gridOptions.hcApi.getFocusedData();
                    if (!focuseData || !focuseData.sa_saleprice_type_id) {
                        return swalApi.info("请选择要删除的行!")
                    }
                    ;
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除编码为" + focuseData.saleprice_type_code + "的产品吗?",
                        okFun: function () {
                            //函数区域
                            requestApi.post("sa_saleprice_type", "delete", {
                                sa_saleprice_type_id: focuseData.sa_saleprice_type_id
                            }).then(function (data) {
                                $scope.refresh();
                                //清除选中
                                $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                            });
                        },
                        okTitle: '删除成功'
                    });
                }

                /**
                 * 标签页头部
                 * @since 2018-10-06
                 */
                $scope.tabs = {
                    'base': {
                        title: '单据详情',
                        active: true
                    },
                    'attach': {
                        title: '附件'
                    },
                    'wf': {
                        title: '审批流程'
                    }
                };

                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;
                //修改标签页标题
                $scope.tabs.base.title = '基本信息';

                $scope.tabs.other = {
                    title:"其他"
                }

                //保存
                $scope.save = function () {
                    if (!$scope.data.currItem.saleprice_type_code) {
                        return swalApi.error("价格类型编码的不能为空!")
                    }
                    if (!$scope.data.currItem.saleprice_type_name) {
                        return swalApi.error("价格类型名称的不能为空!")
                    }
                    if (!$scope.data.currItem.sa_saleprice_type_id) {
                        //新增
                        requestApi.post("sa_saleprice_type", "insert", $scope.data.currItem).then(function (data) {
                            $scope.refresh();
                            //清除选中
                            $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                            return swalApi.success("保存成功!")
                        });
                    } else {
                        //更新
                        requestApi.post("sa_saleprice_type", "update", $scope.data.currItem).then(function (data) {
                            $scope.refresh();
                            //清除选中
                            $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                            return swalApi.success("保存成功!")
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
