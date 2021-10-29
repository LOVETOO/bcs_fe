/**
 * 仓库资料树型页
 *  2018-12-3
 */
define(
    ['module', 'controllerApi', 'base_tree_list', 'openBizObj', 'zTreeApi', 'requestApi', 'promiseApi', 'swalApi'],
    function (module, controllerApi, base_tree_list, openBizObj, zTreeApi, requestApi, promiseApi, swalApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            // 'BasemanService',
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.title = "仓库"
                //主页面的表列数据
                $scope.gridOptions = {
                    columnDefs: [{
                        headerName: "资产所有权",
                        field: "asset_property",
                        hcDictCode: "asset_property"
                    }, {
                        headerName: "仓库编码",
                        field: "warehouse_code"
                    }, {
                        headerName: "仓库名称",
                        field: "warehouse_name"
                    }, {
                        headerName: "仓库类型",
                        field: "warehouse_type",
                        hcDictCode: 'warehouse_type'
                    }, {
                        headerName: "仓库属性",
                        field: "warehouse_property",
                        hcDictCode: 'warehouse_property'
                    }, {
                        headerName: "仓库使用者",
                        field: "is_service",
                        hcDictCode: "is_service"
                    }, {
                        headerName: "仓库层级",
                        field: "is_zb",
                        hcDictCode: "is_zb"
                    }, {
                        headerName: "管理责任人",
                        field: "management_people"
                    }, {
                        headerName: "原仓库编码",
                        field: "attribute11"
                    }, {
                        headerName: "原仓库名称",
                        field: "attribute21"
                    }, {
                        headerName: "仓库面积(㎡)",
                        field: "warehouse_area"
                    }, {
                        headerName: "仓库地址",
                        field: "vendor_address_id"
                    }, {
                        headerName: "所属部门",
                        field: "orgname"
                    }, {
                        headerName: "服务网点",
                        field: "fix_org_name"
                    }, {
                        headerName: "客户",
                        field: "customer_name"
                    }, {
                        headerName: "门店",
                        field: "terminal_name"
                    }, {
                        headerName: "有效",
                        field: "usable",
                        type: "是否"
                    }, {
                        headerName: "明细仓",
                        field: "is_end",
                        type: "是否"
                    }, {
                        headerName: "物流仓",
                        field: "id_wl",
                        type: "是否"
                    }, {
                        headerName: "备注",
                        field: "note"
                    }]
                };


                $scope.treeSetting = {
                    callback: {
                        onDblClick: zTreeOnDblClick
                    },
                    //返回根节点或其承诺
                    hcGetRootNodes: function () {
                        return {
                            id: 0,
                            name: '所有仓库',
                            data: {
                                warehouse_id: 0
                            },
                            isParent: true
                        };
                    },
                    //返回指定节点的子节点或其承诺
                    hcGetChildNodes: function (node) {
                        // console.log("选中列的节点",node)
                        return requestApi.post({
                                classId: 'warehouse',
                                action: 'search',
                                data: {
                                    sqlwhere: "warehouse_pid =" + node.data.warehouse_id
                                }
                            })
                            .then(function (response) {
                                // console.log("返回子数据", response)
                                node.data.warehouses = response.warehouses;
                                // $scope.treeObj.updateNode(node);

                                return response.warehouses.map(function (data) {
                                    return {
                                        id: data.warehouse_id,
                                        name: data.warehouse_name,
                                        isParent: true,
                                        data: data
                                    };
                                });
                            });
                    },
                    //返回指定节点的表格数据或其承诺
                    hcGetGridData: function (node) {
                        // console.log("111", node)
                        return node.data.warehouses
                    }

                }

                function zTreeOnDblClick() {
                    var node = $scope.treeSetting.zTreeObj.getSelectedNodes()[0];
                    if (!node && node.id == 0) {
                        return swalApi.info("请选中正确的节点!");
                    }
                    openBizObj({
                        stateName: 'baseman.warehouse_prop',
                        params: {
                            id: node.data.warehouse_id
                        }
                    });
                };

                //继承主控制器
                controllerApi.extend({
                    controller: base_tree_list.controller,
                    scope: $scope
                });

                //按钮自定义
                $scope.toolButtons = {

                    add: {
                        title: '新增',
                        icon: 'iconfont hc-add',
                        click: function () {
                            $scope.add && $scope.add();
                        }
                    },
                    delete: {
                        title: '删除',
                        icon: 'iconfont hc-delete',
                        click: function () {
                            $scope.delete && $scope.delete();
                        }
                    },
                    openProp: {
                        title: '查看',
                        icon: 'iconfont hc-search',
                        click: function () {
                            $scope.openProp && $scope.openProp();
                        }
                    },
                    refresh: {
                        title: '刷新',
                        icon: 'iconfont hc-refresh',
                        click: function () {
                            $scope.refresh && $scope.refresh();
                        }
                    },
                    search: {
                        title: '筛选',
                        icon: 'iconfont hc-shaixuan',
                        click: function () {
                            $scope.search && $scope.search();
                        }
                    }
                };

                //增加按钮：下载导入格式、导入、导出
                $scope.toolButtons.export = {
                    title: '导出',
                    icon: 'iconfont hc-daochu',
                    click: function () {
                        $scope.export && $scope.export();
                    }
                };
                $scope.toolButtons.import = {
                    title: '导入',
                    icon: 'iconfont hc-daoru',
                    click: function () {
                        $scope.import && $scope.import();
                    }
                };
                $scope.toolButtons.downloadImportFormat = {
                    title: '下载导入格式',
                    icon: 'iconfont hc-icondownload',
                    click: function () {
                        $scope.downloadImportFormat && $scope.downloadImportFormat();
                    }
                };

                //单击表格 同步到树
                $scope.gridOptions.onCellClicked = function (node) {
                    //找到对应的树节点
                    var newnode = $scope.treeSetting.zTreeObj.getNodeByParam("id", node.data.warehouse_id, null);
                    $scope.treeSetting.zTreeObj.selectNode(newnode);
                };


                //双击表格弹出框
                $scope.openProp = function () {
                    // console.log("当前选中行", $scope.gridOptions.hcApi.getFocusedData())
                    openBizObj({
                        stateName: 'baseman.warehouse_prop',
                        params: {
                            id: $scope.gridOptions.hcApi.getFocusedData().warehouse_id
                        }
                    });
                }
                //新建分类的弹出
                $scope.add = function () {
                    var warehouse = $scope.treeSetting.zTreeObj.getSelectedNodes()[0];
                    if (warehouse) {
                        if (warehouse.data.warehouse_type == 1) {//实物仓不能新建子仓库
                            swalApi.info(warehouse.data.warehouse_name + "为实物仓，不能新增子仓库。")
                            return;
                        }
                    }
                    openBizObj({
                        stateName: 'baseman.warehouse_prop',
                        params: {
                            id: 0,
                            warehouse_pid: $scope.treeSetting.zTreeObj.getSelectedNodes()[0].data.warehouse_id
                        }
                    });
                }
                //删除
                $scope.delete = function () {
                    //获取选中节点
                    var node = $scope.treeSetting.zTreeObj.getSelectedNodes()[0];
                    if (!node || node.name == "所有仓库") {
                        return swalApi.info("请选中要删除的节点!");
                    }
                    ;
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除名称为" + node.name + "的节点吗?",
                        okFun: function () {
                            requestApi.post('warehouse', 'delete', node.data).then(function (result) {
                                //选中父节点进行刷新操作
                                var parentNode = node.getParentNode();
                                var parentdata = parentNode.hcGridData.map(function (data) {
                                    return data.warehouse_id;
                                });
                                parentNode.hcGridData.splice(parentdata.indexOf(node.data.warehouse_id), 1);
                                $scope.treeSetting.zTreeObj.cancelSelectedNode();
                                $scope.treeSetting.zTreeObj.selectNode(parentNode)
                                $scope.newrefresh();
                                //清空焦点
                                $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                            });

                        },
                        okTitle: '删除成功'
                    });
                }
                // 筛选
                $scope.gridOptions.hcClassId = 'warehouse';
                $scope.search = function () {
                    //用表格产生条件，并筛选
                    return $scope.gridOptions.hcApi.searchByGrid();
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