/**
 * 我的工作
 * 2018-12-14 add by qch
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'jquery', 'openBizObj', 'directive/hcObjList', 'directive/hcTree'],
    function (module, controllerApi, base_diy_page, requestApi, $, openBizObj) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {
                /*--------------------数据定义------------------------*/
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.iid = 1;


                /*--------------------网格配置------------------------*/
                /**
                 * 第一层树节点对应网格配置  去掉
                 */
                $scope.firstColumnDefs = [{
                    field: 'name',
                    headerName: '名称'
                }];

                /**
                 * 第二层树节点对应网格配置
                 */
                $scope.secondColumnDefs = [{
                    type: '序号',
                    width: 50,
                    maxWidth: 50
                }, {
                    field: 'wfname',
                    headerName: '工作流模板',
                    suppressAutoSize: true, //禁止自动宽度
                    width: 500,
                    minwidth: 500,
                    maxWidth: 500
                }];

                /**
                 * 第三层树节点对应网格配置
                 */
                $scope.thirdlyColumnDefs = [{
                    type: '序号',
                    width: 50,
                    maxWidth: 50,
                }, {
                    field: 'objname',
                    headerName: '工作流内容(对象)'
                }, {
                    field: 'priority',
                    headerName: '紧急程度',
                    type: '词汇',
                    cellEditorParams: {
                        names: ['普通', '急', '紧急'],
                        values: [1, 2, 3]
                    }
                }, {
                    field: 'startor',
                    headerName: '启动用户'
                }, {
                    field: 'currprocname',
                    headerName: '当前过程'
                }, {
                    field: 'curruser',
                    headerName: '当前用户'
                }, {
                    field: 'lastuser',
                    headerName: '上一步用户'
                }, {
                    field: 'lasttime',
                    headerName: '到达时间'
                }, {
                    field: 'statime',
                    headerName: '启动时间'
                }, {
                    field: 'endtime',
                    headerName: '结束时间'
                }];


                /**
                 * 初始化网格配置
                 */
                $scope.gridOptions = {
                    columnDefs: [],
                    /*getRowStyle: function (params) {
                     var css = {};
                     if (params.data.isread == 2) {
                     css["font-weight"] = "blod";
                     }
                     if (params.data.flag != -1) {
                     css["color"] = "red";
                     }
                     return css;
                     },*/
                    rowClassRules: {
                        'sick-days-isread': 'data.isread!=undefined && data.isread != 2',
                        'sick-days-flag': 'data.flag!=undefined && data.flag == -1'
                    }
                };


                /*----------------------配置------------------------*/
                /**
                 * 单击网格切换树焦点节点所需数据
                 * 在数据中插入唯一标示iid
                 * @param arr
                 * @param parentIid 在网格为流程单据信息时,点击聚焦至其父节点
                 */
                $scope.reHcGridData = function (arr, parentIid) {
                    arr && arr.map(function (data) {
                        data.iid = parentIid ? parentIid : ($scope.iid++);
                    });
                    return arr;
                };

                /**
                 * 写死第一层树的子节点
                 */
                $scope.data.firstChild = [{
                    name: '待我审批',
                    isParent: true,
                    icon: '/web/img/icon_present.png',
                    data: {
                        flag: 1
                    }
                }, {
                    name: '我发起的',
                    isParent: true,
                    icon: '/web/img/icon_me.png',
                    data: {
                        flag: 4
                    }
                }, {
                    name: '未到达流程',
                    isParent: true,
                    icon: '/web/img/ico_none.png',
                    data: {
                        flag: 2
                    }
                }, {
                    name: '我已审批',
                    isParent: true,
                    icon: '/web/img/icon_fulfill.png',
                    data: {
                        flag: 3
                    }
                }, {
                    name: '抄送我的',
                    isParent: true,
                    icon: '/web/img/icon_inform.png',
                    data: {
                        flag: 5
                    }
                }, {
                    name: '我终审的',
                    isParent: true,
                    icon: '/web/img/icon_decision.png',
                    data: {
                        flag: 6
                    }
                }];

                /**
                 * 请求网格相关单据
                 */
                $scope.gridPost = function (node) {
                    var body = {
                        wftempid: node.data.wftempid,
                        wfname: node.data.wfname,
                        flag: node.data.flag
                    };
                    $scope.gridOptions.hcClassId = 'scpwf';
                    $scope.gridOptions.hcRequestAction = 'selectref';
                    $scope.gridOptions.hcDataRelationName = 'wfs';
                    $scope.gridOptions.hcApi.search(body);
                };


                /**
                 * 返回指定节点的子节点或其承诺
                 */
                $scope.hcGetChildNodes = function (node) {
                    //console.log("加载节点数据", node);
                    if (node.level == 0) {
                        return $scope.data.firstChild.map(function (data) {
                            return data;
                        });
                    } else if (node.level == 1) {
                        return requestApi.post({
                            classId: 'scpwf',
                            action: 'selectall',
                            data: {
                                flag: node.data.flag
                            }
                        }).then(function (response) {
                            node.hcGridData = $scope.reHcGridData(response.wfs);
                            $scope.gridOptions.api.setRowData(node.hcGridData);

                            return node.hcGridData.map(function (data) {
                                return {
                                    name: data.wfname,
                                    isParent: true,
                                    iid: data.iid,
                                    data: data
                                };
                            });
                        });
                    } else if (node.level == 2) {
                        $scope.gridPost(node);
                    }
                };


                /**
                 * 设置 zTree 仅仅 level=2 的节点不显示图标
                 */
                $scope.showIconForTree = function (treeId, treeNode) {
                    return treeNode.level != 2;
                };

                /**
                 * 设置树文字样式
                 */
                $scope.setFontCss = function (treeId, treeNode) {
                    //console.log(treeNode);
                    var css = {};
                    if (treeNode.level == 2 && treeNode.data.flag == -1) {
                        css.color = 'red';
                    }
                    return css;
                };


                /**
                 * 树配置
                 */
                $scope.treeSetting = {
                    //返回根节点或其承诺
                    hcGetRootNodes: function () {
                        return {
                            name: '我的流程',
                            icon: '/web/img/icon_work.png',
                            data: {
                                pid: 0
                            },
                            isParent: true,
                            iid: 0,
                            hcGridData: $scope.reHcGridData($scope.data.firstChild)
                        };
                    },
                    //返回指定节点的子节点或其承诺
                    //添加树子节点
                    hcGetChildNodes: $scope.hcGetChildNodes,
                    callback: {
						onClick: function (event, treeId, node) {

							if ($scope.gridOptions.api) {
								x();
							}
							else {
								$scope.gridOptions.hcReady.then(x);
							}

							function x() {
								if (node.level == 0) {
									$scope.gridOptions.api.setColumnDefs($scope.firstColumnDefs);
									$scope.gridOptions.api.setRowData($scope.data.firstChild);
								} else if (node.level == 1) {
									$scope.gridOptions.api.setColumnDefs($scope.secondColumnDefs);
								} else if (node.level == 2) {
									$scope.gridOptions.api.setColumnDefs($scope.thirdlyColumnDefs);
									$scope.gridPost(node);
								}
							}
                        }
                    },
                    //绑定网格
                    //取hcGridData缓存的值刷新网格
                    hcGridOptions: $scope.gridOptions,
                    //显示图标
                    view: {
                        showIcon: $scope.showIconForTree,
                        fontCss: $scope.setFontCss
                    },
                    //右键菜单
                    hcMenuItems: {
                        refresh: {
                            title: '刷新',
                            click: function (params) {
                                $scope.treeSetting.hcApi.reload(params.node);
                            },
                            hide: function (params) {
                                //console.log(params);
                                return !(params.node && params.node.level > 0);
                            }
                        }
                    }
                };


                /**
                 * 继承主控制器
                 */
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });


                $scope.doInit = function () {
                    return $scope.hcSuper.doInit().then(function () {
                        $scope.gridOptions.api.setRowData($scope.data.firstChild);

                        //默认当前流程
                        var newnode = $scope.treeSetting.zTreeObj.getNodeByParam("iid", 0, null);
                        // newnode && $scope.treeSetting.zTreeObj.addNodes(newnode, $scope.data.firstChild);
                        var nownode = $scope.treeSetting.zTreeObj.getNodeByParam("name", "待我审批", null);
                        newnode && $scope.treeSetting.zTreeObj.selectNode(newnode);
						nownode && $scope.treeSetting.hcApi.clickNode(nownode).then(function () {
							var node = $scope.treeSetting.zTreeObj.getNodeByParam("name", "待我审批", null);

							//若【待我审批】的只有1个流程模板，展开
							if (node && node.children && node.children.length === 1) {
								$scope.treeSetting.hcApi.clickNode(node.children[0]);
							}
						});
                        $scope.gridOptions.api.setColumnDefs($scope.secondColumnDefs);
                    })
                };


                /*-------------------顶部右边按钮------------------------*/
                $scope.toolButtons = {};

                /*-------------------网格事件------------------------*/
                //单击表格 同步到树
                /*$scope.gridOptions.onCellClicked = function (node) {
                 var newnode = $scope.treeSetting.zTreeObj.getNodeByParam("iid", node.data.iid, null);
                 newnode && $scope.treeSetting.zTreeObj.selectNode(newnode);
                 };*/

                //双击表格
                $scope.gridOptions.onCellDoubleClicked = function (node) {
                    var newnode = $scope.treeSetting.zTreeObj.getNodeByParam("iid", node.data.iid, null);
                    //打开树节点
                    if (newnode) {
                        $scope.treeSetting.zTreeObj.selectNode(newnode);
                        $scope.treeSetting.zTreeObj.expandNode(newnode, true, false, true, true);
                        if (newnode.level == 2) {
                            $scope.gridOptions.api.setColumnDefs($scope.thirdlyColumnDefs);
                            $scope.gridOptions.api.setRowData(node.hcGridData);
                        }
                        if (newnode.level == 1) {
                            $scope.gridOptions.api.setColumnDefs($scope.secondColumnDefs);
                            $scope.gridOptions.api.setRowData(node.hcGridData);
                        }
                    }
                    //打开单据
                    if (node.data.wfid) {
                        openBizObj({wfId: node.data.wfid})
                            .result
                            .finally(function () {
                                $scope.gridPost($scope.treeSetting.zTreeObj.getSelectedNodes()[0])
                            });
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