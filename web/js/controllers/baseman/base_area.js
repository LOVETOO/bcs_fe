/**
 * 行政区域树型页
 *  2018-11-9
 */
define(
    ['module', 'controllerApi', 'base_tree_list', 'openBizObj', 'zTreeApi', 'requestApi', 'swalApi'],
    function (module, controllerApi, base_tree_list, openBizObj, zTreeApi, requestApi, swalApi) {
        'use strict';
        var controller = [ 
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.title = "地区";
                //主页面的表列数据
                $scope.gridOptions = {
                    hcName:"行政区域",
                    columnDefs: [{
                        headerName: "区域编码",
                        field: "areacode"
                    }, {
                        headerName: "区域名称",
                        field: "areaname"
                    }, {
                        headerName: "简称",
                        field: "shorter_form"

                    }, {
                        headerName: "电话区号",
                        field: "telzone"
                    }, {
                        headerName: "类型",
                        field: "areatype",
                        hcDictCode: '*'
                    }, {
                        headerName: "备注",
                        field: "note"
                    }]
                };
                $scope.treeSetting = {
                    //返回根节点或其承诺
                    hcGetRootNodes: function () {
                        return {
                            name: '所有地区',
                            data: {
                                areaid: 0
                            },
                            isParent: true
                        };
                    },
                    //返回指定节点的子节点或其承诺
                    hcGetChildNodes: function (node) {
                        return requestApi.post({
                                classId: 'scparea',
                                action: 'search',
                                data: {
                                    superid: node.data.areaid,
                                    search_flag: 99
                                }
                            })
                            .then(function (response) {
                                node.data.scpareas = response.scpareas;
                                // $scope.treeObj.updateNode(node);

                                return response.scpareas.map(function (data) {
                                    return {
                                        name: data.areaname,
                                        objType: 13,
                                        isParent: true,
                                        data: data
                                    };
                                });
                            });
                    },
                    //返回指定节点的表格数据或其承诺
                    hcGetGridData: function (node) {
                        return node.data.scpareas
                    }
                };

                //继承主控制器
                controllerApi.extend({
                    controller: base_tree_list.controller,
                    scope: $scope
                });


                //屏蔽按钮
                $scope.toolButtons.search.hide = true;
                $scope.toolButtons.openProp.hide = true;
                //更改按钮
                $scope.toolButtons.add.title = "新建区域";
                $scope.toolButtons.delete.title = "删除区域";
                $scope.toolButtons.delete.hide = true;
                //双击重写事件方法
                $scope.openProp = function () {
                    // console.log("当前选中行", $scope.gridOptions.hcApi.getFocusedData())
                    //调用打开通用模态框的方法 参数id是当前选中数据的主键id
                    openBizObj({
                        stateName: 'baseman.base_area_prop',
                        params: {
                            id: $scope.gridOptions.hcApi.getFocusedData().areaid
                        }
                    });

                };
                //重写增加区域的方法 打开通用的模态框
                $scope.add = function () {
                    var treeNodes = $scope.treeSetting.zTreeObj.getSelectedNodes();
                    if (!treeNodes[0]) {
                        return swalApi.info('请先选中要添加区域的地区').then($q.reject);
                    } else {
                        openBizObj({
                            stateName: 'baseman.base_area_prop',
                            params: {
                                id: 0,
                                superid: $scope.treeSetting.zTreeObj.getSelectedNodes()[0].data.areaid
                            }
                        }).result.finally($scope.refresh)
                    }
                };

                //删除节点
                $scope.deleteNode = function (treeNodes) {
                    swalApi.confirmThenSuccess({
                        title: "确认删除？",
                        okFun: function () {
                           return requestApi.post
                            ({
                                classId: 'scparea',
                                action: 'delete',
                                data: {
                                    areaid: treeNodes[0].data.areaid
                                }
                            }).then(function () {
                                $scope.treeSetting.zTreeObj.removeNode(treeNodes[0]);
                            })
                        },
                        okTitle: '删除成功'
                    })
                };

                //删除节点下的区域
                $scope.deleteNodeItem = function (rowNode) {
                    swalApi.confirmThenSuccess({
                        title: "确认删除？",
                        okFun: function () {
                           return requestApi.post
                            ({
                                classId: 'scparea',
                                action: 'delete',
                                data: {
                                    areaid: rowNode.data.areaid
                                }
                            }).then($scope.refresh)
                        },
                        okTitle: '删除成功'
                    })
                };

                //重写删除区域的方法
                $scope.delete = function () {
                    var treeNodes = $scope.treeSetting.zTreeObj.getSelectedNodes();
                    var rowNode = $scope.gridOptions.hcApi.getFocusedNode();
                    if (!treeNodes[0]) {
                        return swalApi.info('请先选中要删除的区域').then($q.reject);
                    } else if (!rowNode) {
                        $scope.deleteNode(treeNodes);
                    } else if (!treeNodes[0].children[0].getNextNode()) {
                        $scope.deleteNodeItem(rowNode);
                    } else {
                        return swalApi.info("请先删除该层级下的区域");
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