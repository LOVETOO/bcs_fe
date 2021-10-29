/**
 * 产品分类树型页
 *  2018-11-9
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'openBizObj', 'zTreeApi', 'requestApi', 'promiseApi', 'swalApi', 'directive/hcObjProp'],
    function (module, controllerApi, base_diy_page, openBizObj, zTreeApi, requestApi, promiseApi, swalApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            // 'BasemanService',
            '$scope',
            //控制器函数
            function ($scope) {
                /**数据定义 */
                $scope.data = {};
                $scope.data.currItem = {};
                //主页面的表列数据
                $scope.gridOptions = {
                    columnDefs: [{
                        type: "序号"
                    }, {
                        headerName: "分类编码",
                        field: "item_class_code"
                    }, {
                        headerName: "分类名称",
                        field: "item_class_name"
                    }, {
                        headerName: "分类级别",
                        field: "item_class_level",
                        hcDictCode: "item_class_level"
                    }, {
                        headerName: "有效",
                        field: "item_usable",
                        type: "是否"
                        // }, {
                        //     headerName: "说明",
                        //     field: "note",
                        //     minWidth:700,
                        //     maxWidth:800
                    }]
                };

                //树配置数据
                $scope.treeSetting = {
                    callback: {
                        onClick: zTreeOnClick,
                        onDblClick: zTreeOnDblClick
                    },
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pId",
                            rootPId: null
                        }
                    },
                    view: {
                        showIcon: false
                    }
                };

                function zTreeOnClick(a, b, node) {
                    if (!node.children) {
                        node.children = [];
                    }
                    ;
                    //把节点数据扔给表格
                    $scope.gridOptions.hcApi.setRowData(node.children.map(function (data) {
                        return data.data;
                    }));
                    //清空焦点
                    $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                }

                function zTreeOnDblClick(a, b, node) {
                    // alert("双击")
                    $('#newModal').modal('show');
                    requestApi.post({
                        classId: 'item_class',
                        action: 'select',
                        data: {
                            item_class_id: node.id
                        }
                    }).then(function (response) {
                        $scope.$applyAsync(function () {
                            $scope.data.currItem = response;
                        });
                    });
                }

                //继承主控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                // 加载数据
                requestApi.post({
                    classId: 'item_class',
                    action: 'search',
                    data: {}
                }).then(function (response) {
                    var zNodes = response.item_classs.map(function (data) {
                        return {
                            id: data.item_class_id,
                            pId: data.item_class_pid,
                            name: data.item_class_name,
                            data: data,
                            isParent: true
                        }
                    });
                    zNodes.push({
                        id: 0,
                        name: "所有分类",
                        pId: null,
                        isParent: true
                    });
                    $scope.zTreeObj = $.fn.zTree.init($("#ztree"), $scope.treeSetting, zNodes);
                    var newnode = $scope.zTreeObj.getNodeByParam("id", 0, null);
                    $scope.zTreeObj.selectNode(newnode);
                    //并展开
                    $scope.zTreeObj.expandNode(newnode);
                    $scope.gridOptions.hcApi.setRowData(newnode.children.map(function (data) {
                        return data.data;
                    }));
                });
                //标签名称
                $scope.tabs = {
                    base: {
                        title: '基本信息',
                        active: true
                    },
                    other: {
                        title: '其他'
                    }
                };
                // 增加按钮
                $scope.toolButtons = {
                    add: {
                        title: '新增',
                        icon: 'iconfont hc-add',
                        click: function () {
                            $scope.add && $scope.add();
                        }
                    }, delete: {
                        title: '删除',
                        icon: 'iconfont hc-delete',
                        click: function () {
                            $scope.delete && $scope.delete();
                        }
                    }, openProp: {
                        title: '查看',
                        icon: 'iconfont hc-search',
                        click: function () {
                            $scope.openProp && $scope.openProp();
                        }
                    }, refresh: {
                        title: '刷新',
                        icon: 'iconfont hc-refresh',
                        click: function () {
                            $scope.refresh && $scope.refresh();
                        }
                    }, search: {
                        title: '筛选',
                        icon: 'iconfont hc-shaixuan',
                        click: function () {
                            $scope.search && $scope.search();
                        }
                    }, export: {
                        title: '导出',
                        icon: 'iconfont hc-daochu',
                        click: function () {
                            $scope.export && $scope.export();
                        }
                    }

                };

                // 查询
                $scope.gridOptions.hcClassId = 'item_class';
                $scope.search = function () {
                    //用表格产生条件，并查询
                    return $scope.gridOptions.hcApi.searchByGrid();
                };

                //刷新
                $scope.refresh = function () {
                    requestApi.post({
                        classId: 'item_class',
                        action: 'search',
                        data: {}
                    }).then(function (response) {
                        var zNodes = response.item_classs.map(function (data) {
                            return {
                                id: data.item_class_id,
                                pId: data.item_class_pid,
                                name: data.item_class_name,
                                data: data,
                                isParent: true
                            }
                        });
                        zNodes.push({
                            id: 0,
                            name: "所有分类",
                            pId: null,
                            isParent: true
                        });
                        $.fn.zTree.init($("#ztree"), $scope.treeSetting, zNodes);
                        var newnode = $scope.zTreeObj.getNodeByParam("id", 0, null);
                        $scope.zTreeObj.selectNode(newnode);
                        //并展开
                        $scope.zTreeObj.expandNode(newnode);
                        $scope.gridOptions.hcApi.setRowData(newnode.children.map(function (data) {
                            return data.data;
                        }));
                        //清空焦点
                        $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                    });
                };
                //单击表格 同步到树
                $scope.gridOptions.onCellClicked = function (node) {
                    //找到对应的树节点
                    var newnode = $scope.zTreeObj.getNodeByParam("id", node.data.item_class_id, null);
                    $scope.zTreeObj.selectNode(newnode);
                };

                //双击表格弹出框
                $scope.gridOptions.onCellDoubleClicked = function (node) {
                    $('#newModal').modal('show');
                    requestApi.post({
                        classId: 'item_class',
                        action: 'select',
                        data: {
                            item_class_id: node.data.item_class_id
                        }
                    }).then(function (response) {
                        $scope.$applyAsync(function () {
                            $scope.data.currItem = response;
                        });
                    });
                }
                // 查看详情
                $scope.openProp = function () {
                    var node = $scope.zTreeObj.getSelectedNodes()[0];
                    if (node.id == 0) {
                        return swalApi.info("请选中要查看的节点!");
                    }
                    zTreeOnDblClick(null, null, node);
                };
                //新建分类的弹出
                $scope.add = function () {
                    var node = $scope.zTreeObj.getSelectedNodes()[0];
                    if (!node) {
                        return swalApi.info("请指定上级分类!");
                    }
                    ;
                    $('#newModal').modal('show');
                    $scope.data.currItem = {};
                    $scope.data.currItem.item_usable = 2;
                }
                //删除
                $scope.delete = function () {
                    //获取选中节点
                    var node = $scope.zTreeObj.getSelectedNodes()[0];
                    if (!node || node.name == "所有分类") {
                        return swalApi.info("请选中要删除的节点!");
                    }
                    ;
                    // if(node.children.length > 0){
                    //     return swalApi.info("请先删除子节点!");
                    // };
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除名称为" + node.data.item_class_name + "的节点吗?",
                        okFun: function () {
                            requestApi.post('item_class', 'delete', {
                                item_class_id: node.data.item_class_id
                            }).then(function (result) {
                                $scope.refresh();
                            });

                        },
                        okTitle: '删除成功'
                    });
                }
                //监听节点
                $scope.$watch('data.currItem', function (newValue, oldValue) {
                    if ($scope.data.currItem.isquote == 2) {
                        alert("已经被引用")
                    }
                }, true);

                //保存
                $scope.save = function () {
                    if (!$scope.data.currItem.item_class_code || !$scope.data.currItem.item_class_name || !$scope.data.currItem.item_class_level) {
                        return swalApi.info("分类编码或分类名称或分类层级不能为空!");
                    }
                    ;
                    if (!$scope.data.currItem.item_class_id) {
                        //新增
                        //获取当前的节点,pid 为当前节点的id
                        var node = $scope.zTreeObj.getSelectedNodes()[0];
                        $scope.data.currItem.item_class_pid = node.id;
                        requestApi.post("item_class", "insert", $scope.data.currItem).then(function (result) {
                            //刷新
                            $scope.refresh();
                            return swalApi.success("保存成功!");
                        });
                    } else {
                        //更改
                        requestApi.post("item_class", "update", $scope.data.currItem).then(function (result) {
                            //刷新
                            $scope.refresh();
                            return swalApi.success("保存成功!");
                        });
                    }
                    ;
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