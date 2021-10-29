define(
    ['module', 'controllerApi', 'base_tree_list', 'requestApi', 'openBizObj', 'swalApi', 'directive/hcTab', 'directive/hcTabPage', 'directive/hcModal'],
    function (module, controllerApi, base_tree_list, requestApi, openBizObj, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {

                $scope.data = {
                    currItem: {}
                };
                // $scope.type={};

                /**
                 * 标签定义
                 */
                $scope.tabs = {
                    dept: {
                        title: '适用部门',
                        active: true
                    },
                    position: {
                        title: '适用岗位'
                    },
                    grade: {
                        title: '评分标准'
                    }
                };
                /**
                 * 表格定义
                 */
                $scope.gridOptions = {
                    columnDefs: [{
                        type: "序号",
                    }, {
                        headerName: "考核指标编码",
                        width: 150,
                        field: "kpiitem_no",
                        onCellDoubleClicked: function () {
                            $scope.search();
                        }
                    }, {
                        headerName: "考核指标名称",
                        width: 200,
                        field: "kpiitem_name",
                        onCellDoubleClicked: function () {
                            $scope.search();
                        }
                    }, {
                        headerName: "指标类别",
                        width: 200,
                        field: "itemtype_name",
                        onCellDoubleClicked: function () {
                            $scope.search();
                        }
                    }, {
                        headerName: "备注",
                        width: 400,
                        field: "note",
                        editable: true,
                        onCellDoubleClicked: function () {
                            $scope.search();
                        }
                    }]

                };

                $scope.gridOptions_dept = {
                    columnDefs: [{
                        type: "序号",
                    }, {
                        headerName: "部门编码",
                        field: "org_code"
                    }, {
                        headerName: "部门名称",
                        field: "org_name"
                    }]

                };
                $scope.gridOptions_position = {
                    columnDefs: [{
                        type: "序号",
                    }, {
                        headerName: "岗位名称",
                        field: "positionid"
                    }]

                };
                $scope.gridOptions_grade = {
                    columnDefs: [{
                        type: "序号",
                    }, {
                        headerName: "评分标准",
                        field: "gradeitem",
                        editable: true
                    }, {
                        headerName: "分值",
                        field: "value",
                        editable: true
                    }]

                };

                /**
                 * 树设置
                 */
                $scope.treeSetting = {
                    //获取根节点的方法
                    hcGetRootNodes: function () {
                        return {
                            name: '指标类别',
                            hcIsRoot: true,
                            data: {typid: 0}
                        };
                    },
                    //获取子节点的方法
                    hcGetChildNodes: function (node) {

                        return requestApi
                            .post({
                                classId: 'kpi_itemtypes',
                                action: 'search',
                                data: {
                                    typid: node.data.typid
                                }
                            })
                            .then(function (response) {
                                node.data.kpi_itemtypess = response.kpi_itemtypess;
                                return response.kpi_itemtypess.map(function (data) {
                                    return {
                                        name: data.itemtype,
                                        data: data
                                    };
                                });
                            })
                            .then(function (data) {
                                return data;
                            });

                    },
                    hcGetGridData: function (node) {
                        if (node.hcIsRoot) return null;

                        return requestApi
                            .post({
                                classId: 'kpi_itemtypes',
                                action: 'select',
                                data: {
                                    typid: node.data.typid
                                }
                            })
                            .then(function (response) {
                                node.data.kpi_kpiitemsofkpi_itemtypess = response.kpi_kpiitemsofkpi_itemtypess;
                                var data = response.kpi_kpiitemsofkpi_itemtypess;
                                if (data.length == 0) {
                                    var newline = {};
                                    data.push(newline);
                                }
                                $scope.gridOptions.hcApi.setRowData(data);
                                return response.kpi_kpiitemsofkpi_itemtypess;
                            });
                    }

                };

                //继承基础控制器
                controllerApi.extend({
                    controller: base_tree_list.controller,
                    scope: $scope
                });

                /**
                 * 按钮定义
                 */

                    //隐藏按钮
                (function (buttonIds) {
                    buttonIds.forEach(function (buttonId) {
                        $scope.toolButtons[buttonId].hide = true;
                    });
                })([
                    'delete',
                    'add',
                    'refresh',
                    'openProp'
                ]);

                $scope.toolButtons.deleteItem = {
                    title: '考核指标',
                    groupId: '考核指标',
                    icon: 'fa fa-trash-o',
                    click: function () {
                        $scope.deleteItem && $scope.deleteItem();
                    }
                };
                $scope.toolButtons.addItem = {
                    title: "考核指标",
                    groupId: '考核指标',
                    icon: 'iconfont hc-add',
                    click: function () {
                        $scope.add && $scope.add();
                    }
                };
                $scope.toolButtons.openItem = {
                    title: '考核指标',
                    groupId: '考核指标',
                    icon: 'iconfont hc-search',
                    click: function () {
                        $scope.search && $scope.search();
                    }
                };

                $scope.toolButtons.deleteType = {
                    title: '指标类别',
                    groupId: '指标类别',
                    icon: 'fa fa-trash-o',
                    click: function () {
                        $scope.deleteType && $scope.deleteType();
                    }
                };

                $scope.toolButtons.addType = {
                    title: "指标类别",
                    groupId: '指标类别',
                    icon: 'iconfont hc-add',
                    click: function () {
                        return $scope.type.open({
                            controller: ['$scope', function ($modalScope) {
                                $modalScope.data = {
                                    currItem: {}
                                };
                                var rowNode = $scope.treeSetting.zTreeObj.getSelectedNodes();
                                if (rowNode[0].data.typid == 0) {
                                    $modalScope.data.currItem.superid = 0;
                                } else {
                                    $modalScope.data.currItem.superid = rowNode[0].data.typid;
                                    $modalScope.data.currItem.idpath = rowNode[0].data.idpath;
                                }
                                $modalScope.data.currItem.usable = 2;

                                /**
                                 * 模态框按钮定义
                                 */
                                $modalScope.title = '指标类别';
                                $modalScope.footerRightButtons.save = {
                                    title: '保存',
                                    click: function () {
                                        if (!$modalScope.data.currItem.itemtype_name) {
                                            return swalApi.info("指标类别名称不能为空！");
                                        }
                                        return requestApi.post({
                                            classId: 'kpi_itemtypes',
                                            action: 'insert',
                                            data: {
                                                itemtype: $modalScope.data.currItem.itemtype_name,
                                                note: $modalScope.data.currItem.note,
                                                usable: $modalScope.data.currItem.usable,
                                                superid: $modalScope.data.currItem.superid,
                                                idpath: $modalScope.data.currItem.idpath,
                                            }
                                        }).then(function (data) {
                                            var newNode = {
                                                name: $modalScope.data.currItem.itemtype_name,
                                                idpath: $modalScope.data.currItem.idpath
                                            };
                                            newNode.data = {
                                                typid: data.typid,
                                                note: $modalScope.data.currItem.note,
                                                usable: $modalScope.data.currItem.usable,
                                                superid: $modalScope.data.currItem.superid
                                            };
                                            swalApi.info("保存成功！");
                                            $scope.treeSetting.zTreeObj.addNodes($scope.treeSetting.zTreeObj.getSelectedNodes()[0], newNode);

                                        }).then($modalScope.$close);
                                    }
                                };
                                //指标类别名称不能重复
                                $modalScope.checkItemTypeName = function () {
                                    requestApi.post({
                                            classId: 'kpi_kpiitems',
                                            action: 'kpiitemsearch',
                                            data: $scope.data.currItem
                                        })
                                        .then(function (response) {
                                            if (response.kpi_kpiitemss.length < 0) {
                                                return;
                                            }
                                            for (var i = 0; i < response.kpi_kpiitemss.length; i++) {
                                                var obj = response.kpi_kpiitemss[i];
                                                if ($modalScope.data.currItem.itemtype_name == obj.itemtype_name) {
                                                    swalApi.info("指标类别名称【" + $modalScope.data.currItem.itemtype_name + "】已存在，不能重复添加");
                                                    $modalScope.data.currItem.itemtype_name = '';
                                                }
                                            }
                                        })
                                };

                            }],
                            width: '500px',
                            height: '250px'
                        })
                    }
                };
                $scope.toolButtons.openType = {
                    title: '指标类别',
                    groupId: '指标类别',
                    icon: 'iconfont hc-search',
                    click: function () {
                        var rowNode = $scope.treeSetting.zTreeObj.getSelectedNodes();
                        //var parNode = $scope.treeSetting.zTreeObj.getParentNode();
                        if (!rowNode)
                            return swalApi.info('请先选中要查看"指标类别"的行').then($q.reject);

                        return $scope.type.open({
                            controller: ['$scope', function ($modalScope) {
                                $modalScope.data = {
                                    currItem: {}
                                }
                                var post = function (rowNode) {
                                    return requestApi.post({
                                            classId: 'kpi_itemtypes',
                                            action: 'select',
                                            data: {
                                                typid: rowNode[0].data.typid,
                                            }
                                        })
                                        .then(function (response) {
                                            $modalScope.data.currItem.typid = response.typid;
                                            $modalScope.data.currItem.itemtype_name = response.itemtype;
                                            $modalScope.data.currItem.note = response.note;
                                            $modalScope.data.currItem.usable = response.usable;
                                            $modalScope.data.currItem.idpath = response.idpath;
                                            $modalScope.data.currItem.superid = response.superid;
                                        })
                                };
                                post(rowNode);
                                /**
                                 * 模态框按钮定义
                                 */
                                $modalScope.title = '指标类别';
                                $modalScope.footerRightButtons.save = {
                                    title: '保存',
                                    click: function () {


                                        return requestApi.post({
                                                classId: 'kpi_itemtypes',
                                                action: 'update',
                                                data: {
                                                    typid: $modalScope.data.currItem.typid,
                                                    itemtype: $modalScope.data.currItem.itemtype,
                                                    note: $modalScope.data.currItem.note,
                                                    usable: $modalScope.data.currItem.usable,
                                                    idpath: $modalScope.data.currItem.idpath,
                                                    superid: $modalScope.data.currItem.superid
                                                }
                                            })
                                            .then(function () {
                                                swalApi.info("保存成功！");
                                            }).then($modalScope.$close);
                                    }
                                };

                            }],
                            width: '500px',
                            height: '250px'
                        })
                    }
                };

                //添加考核指标
                $scope.add = function () {
                    var treeNode = $scope.treeSetting.zTreeObj.getSelectedNodes();
                    var rowNode = $scope.gridOptions.hcApi.getFocusedNode();
                    if (!rowNode)
                        return swalApi.info('请先选中要添加"考核指标"的行').then($q.reject);

                    var data = $scope.gridOptions.hcApi.getFocusedData();
                    openBizObj({
                        stateName: 'hrman.hr_dept_pivojob_prop',		//路由名
                        params: {
                            kpiitem_id: data.kpiitem_id,     //路由参数
                            typid: treeNode[0].data.typid,
                            itemtype_name: treeNode[0].data.itemtype,
                        }
                    }).result.finally($scope.refresh)
                };

                //查看考核指标明细
                $scope.search = function () {
                    var treeNode = $scope.treeSetting.zTreeObj.getSelectedNodes();
                    var rowNode = $scope.gridOptions.hcApi.getFocusedNode();
                    if (!rowNode.data.kpiitem_id)
                        return swalApi.info('请先选中要查看"考核指标"的行').then($q.reject);

                    var data = $scope.gridOptions.hcApi.getFocusedData();
                    openBizObj({
                        stateName: 'hrman.hr_dept_pivojob_prop',		//路由名
                        params: {
                            id: data.kpiitem_id,     //路由参数
                            typid: treeNode[0].data.typid,
                            itemtype_name: data.itemtype_name
                        }
                    });
                };

                //删除指标类别
                $scope.deleteType = function () {
                    var treeNode = $scope.treeSetting.zTreeObj.getSelectedNodes();
                    var rowNode = $scope.gridOptions.hcApi.getFocusedNode();
                    if (!treeNode[0]) {
                        return swalApi.info('请先选中要删除的"指标类别"').then($q.reject);
                    } else if (treeNode[0].isParent) {
                        return swalApi.info('请先删除该层级下的指标类别');
                    } else if (rowNode.data.kpiitem_id) {
                        return swalApi.info('请先删除该指标类别下的考核指标');
                    } else {
                        return swalApi.confirmThenSuccess({
                            title: "确认删除？",
                            okFun: function () {

                                return requestApi.post
                                ({
                                    classId: 'kpi_itemtypes',
                                    action: 'delete',
                                    data: {
                                        typid: treeNode[0].data.typid
                                    }
                                }).then(function () {
                                    $scope.treeSetting.zTreeObj.removeNode(treeNode[0]);
                                });
                            },
                            okTitle: '删除成功'
                        })
                    }
                };

                //删除指标
                $scope.deleteItem = function () {
                    var rowNode = $scope.gridOptions.hcApi.getFocusedNode();
                    if (!rowNode.data.kpiitem_id) {
                        return swalApi.info('请先选中要删除的"考核指标"').then($q.reject);
                    } else {
                        return swalApi.confirmThenSuccess({
                            title: "确认删除？",
                            okFun: function () {
                                return requestApi.post
                                ({
                                    classId: 'kpi_kpiitems',
                                    action: 'delete',
                                    data: {
                                        kpiitem_id: rowNode.data.kpiitem_id
                                    }
                                })
                            },
                            okTitle: '删除成功'
                        }).then($scope.refresh);
                    }

                };

            }];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);