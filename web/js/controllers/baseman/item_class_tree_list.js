/**
 * 产品分类 树列表页 item_class_list
 * Created by zhl on 2019/3/20.
 * updated by li meng on 2019/6/15
 */
define(
    ['module', 'controllerApi', 'base_tree_list', 'requestApi', 'numberApi', 'openBizObj', 'swalApi'],
    function (module, controllerApi, base_tree_list, requestApi, numberApi, openBizObj, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q', '$modal',
            //控制器函数
            function ($scope, $q, $modal) {

                /**
                 * 表格定义
                 */
                $scope.gridOptions = {
                    hcName:"产品分类",
                    columnDefs: [{
                        type: "序号"
                    }, {
                        headerName: "产品分类编码",
                        field: "item_class_code"
                    }, {
                        headerName: "产品分类名称",
                        field: "item_class_name"
                    }, {
                        headerName: "产品分类级别",
                        field: "item_class_level",
                        hcDictCode: "item_class_level"
                    }, {
                        headerName: "有效",
                        field: "item_usable",
                        type: "是否"
                    }],
                    //扩展右键菜单
                    getContextMenuItems: function (params) {
                        var menuItems = $scope.gridOptions.hcDefaultOptions.getContextMenuItems(params);

                        menuItems.push('separator');

                        menuItems.push({
                            icon: '<i class="fa fa-info-circle"></i>',
                            name: '查看详情',
                            action: $scope.openProp
                        });

                        return menuItems;
                    }
                };

                /**
                 * 树设置
                 */
                $scope.treeSetting = {
                    //获取根节点的方法
                    hcGetRootNodes: function () {
                        return {
                            name: '所有分类',
                            data: {
                                //sqlwhere: 'item_class_pid = 0'
                            },
                            isParent: true,
                            item_class_pid: 0,
                            hcIsRoot: true
                        };
                    },
                    //获取子节点的方法
                    hcGetChildNodes: function (node) {
                        var sqlwhere;

                        if (node.data.item_class_id)
                            sqlwhere = 'item_class_pid = ' + node.data.item_class_id;
                        else
                            sqlwhere = 'item_class_pid = 0';

                        return requestApi
                            .post({
                                classId: 'item_class',
                                action: 'search',
                                data: {
                                    //orgid: node.data.orgid
                                    //item_class_id:node.data.item_class_id
                                    sqlwhere: sqlwhere
                                }
                            })
                            .then(function (response) {
                                node.data.item_classs = response.item_classs;

                                var isParent;

                                return response.item_classs.map(function (data) {
                                    isParent = true;

                                    if (data.single_node.indexOf(data.item_class_id) != -1)
                                        isParent = false;

                                    return {
                                        id: data.item_class_id,
                                        pId: data.item_class_pid,
                                        name: data.item_class_name,
                                        data: data,
                                        isParent: isParent
                                    };
                                });
                            });
                    },
                    //返回指定节点的表格数据或其承诺
                    hcGetGridData: function (node) {
                        return node.data.item_classs;
                    },
                    //设置树结构右键菜单
                    hcMenuItems: {
                        refresh: {
                            title: '刷新',
                            icon: 'fa fa-refresh',
                            click: function (params) {
                                $scope.treeSetting.hcApi.reload(params.node);
                            },
                            hide: function () {
                                return isBottom();
                            }
                        },
                        add: {
                            title: function () {
                                var treeLevel = $scope.$eval('treeSetting.zTreeObj.getSelectedNodes()[0].level');
                                var titlePart = "";
                                if (treeLevel == 0)
                                    titlePart = "产品大类";
                                if (treeLevel == 1)
                                    titlePart = "产品中类";
                                if (treeLevel == 2)
                                    titlePart = "产品小类";

                                return "新增" + titlePart;
                            },
                            icon: 'fa fa-file-o',
                            click: function (params) {
                                $scope.add();
                            },
                            hide: function () {
                                return isBottom();
                            }
                        },
                        delete: {
                            title: '删除',
                            icon: 'fa fa-trash-o',
                            click: function (params) {
                                // 树结构右键删除
                                $scope.deleteByTreeNode('tree');
                            },
                            hide: function (params) {
                                return isRoot()
                            }
                        },
                        openProp: {
                            title: '查看详情',
                            icon: 'fa fa-info-circle',
                            click: function (params) {
                                $scope.openProp('isTree');
                            },
                            hide: function (params) {
                                return isRoot()
                            }
                        }
                    },
                    callback:{
                        //点击树节点时，该节点如果没有网格数据，则清空网格
                        onClick:function(event, treeId, treeNode){
                            if(!treeNode.hcGridData && $scope.gridOptions.hcApi){
                                $scope.gridOptions.hcApi.setRowData([]);
                            }
                        }
                    }
                };

                controllerApi.extend({
                    controller: base_tree_list.controller,
                    scope: $scope
                });

                /*---------------------------工具栏按钮事件定义 开始---------------------------*/

                //是否根节点（所有分类）
                function isRoot() {
                    return $scope.$eval('treeSetting.zTreeObj.getSelectedNodes()[0].hcIsRoot');
                }

                function isBottom() {
                    return $scope.$eval('treeSetting.zTreeObj.getSelectedNodes()[0].level == 3');
                }

                //双击树节点打开模态框
                $scope.openTreeProp = openProp;

                function openProp() {
                    return $scope.openProp('isTreeNode');
                }

                /**
                 *双击打开模态框
                 * @param params 传入params则认为是双击树节点
                 * @returns {*}
                 *
                 * 双击树节点修改数据：
                 * 获取父节点并reload(父节点)
                 *
                 * 双击网格\右键-查看详情 修改数据：
                 * 获取当前节点并reload（当前节点）
                 */
                $scope.openProp = function (params) {
                    var id, parentNode, node;

                    return $q
                        .when()
                        .then(function () {
                            if (angular.isUndefined(params)) {
                                var focusedNode = $scope.gridOptions.hcApi.getFocusedNode();
                                //从表格中获取id
                                id = focusedNode.data.item_class_id
                            } else {
                                return $scope.treeSetting.hcApi
                                    .getSelectedNodesWithNotice({
                                        actionName: '查看'
                                    })
                                    .then(function (nodes) {
                                        node = nodes[0];

                                        if (node.hcIsRoot) {
                                            return $q.reject();
                                        }

                                        //从树节点获取id
                                        id = numberApi.toNumber(node.data.item_class_id);

                                        //获取父节点
                                        parentNode = node.getParentNode();
                                    });
                            }
                        })
                        .then(function () {
                            if (id === 0)
                                throw new Error('查看产品分类失败：缺少必要参数 id');
                        }).then(function () {
                            openBizObj({
                                stateName: 'baseman.item_class_prop',
                                //width: '1000px',
                                //height: '300px',
                                params: {
                                    id: id,
                                    title: '产品分类'
                                }
                            }).result
                                .finally(function () {
                                    //刷新树节点
                                    if (params) {
                                        //$scope.treeSetting.hcApi.reload(parentNode);
                                        return requestApi.post('item_class', 'select', {item_class_id: id})
                                            .then(function (response) {
                                                console.log(response,'response');
                                                node.name = response.item_class_name;
                                                $scope.treeSetting.zTreeObj.updateNode(node);
                                            });
                                    }
                                    //刷新表格
                                    else
                                        $scope.refresh;
                                });
                        });
                };

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    //定义根节点
                    var rootNode;
                    $scope.hcSuper.doInit()
                        .then(function () {
                            //获取根节点
                            rootNode = $scope.treeSetting.zTreeObj.getNodes()[0];
                            //点击根节点
                            return $scope.treeSetting.hcApi.clickNode(rootNode);
                        })
                        .then(function () {
                            //创建一个异步
                            var promise = $q.when();

                            //循环点击节点
                            rootNode.children.slice().reverse().forEach(function (node) {
                                promise = promise.then(function () {
                                    return $scope.treeSetting.hcApi.clickNode(node);
                                });
                            });
                            //返回异步承诺
                            return promise;
                        })
                        .then(function () {
                            //展示根节点数据
                            $scope.treeSetting.hcApi.clickNode(rootNode);
                        })
                };

                //新增分类
                $scope.add = function (params) {
                    var item_class_pid = 0;
                    var item_class_level = 0;

                    return $q
                        .when()
                        .then(function () {
                            if (angular.isUndefined(params)) {
                                return $scope.treeSetting.hcApi
                                    .getSelectedNodesWithNotice({
                                        actionName: '作为父分类'
                                    })
                                    .then(function (nodes) {

                                        item_class_pid = nodes[0].data.item_class_id;
                                        item_class_level = nodes[0].level;//树节点level：0，1，2 ； 属性页中“分类级别”默认：大类1、中类2、小类3

                                    });
                            }
                            else if (angular.isNumber(params) || angular.isString(params)) {
                                item_class_pid = numberApi.toNumber(params);
                            }
                            else if (angular.isObject(params)) {
                                if ('item_class_pid' in params) {
                                    item_class_pid = numberApi.toNumber(params.item_class_pid);
                                }
                                else if ('superNode' in params) {
                                    item_class_pid = numberApi.toNumber(params.superNode.data.item_class_pid);
                                }
                            }
                        })
                        .then(function () {
                            openBizObj({
                                stateName: 'baseman.item_class_prop',
                                //width: '1000px',
                                //height: '300px',
                                params: {
                                    id: 0,
                                    item_class_pid: item_class_pid,
                                    item_class_level: item_class_level,
                                    title: '产品分类'
                                }
                            }).result
                                .finally($scope.refresh);
                        });
                }

                //根节点选中时，删除按钮的隐藏
                $scope.toolButtons.delete.hide = function () {
                    return isRoot();
                };

                $scope.toolButtons.openProp.hide = function () {
                    return isRoot();
                };

                $scope.toolButtons.openProp.icon = 'iconfont hc-search';

                //“产品小类”（树level为3）选中时，新增按钮的隐藏
                $scope.toolButtons.add.hide = function () {
                    return isBottom();
                };

                /**
                 * 刷新按钮点击事件
                 * @param params
                 */
                $scope.toolButtons.refresh.click = function (params) {
                    $scope.treeSetting.hcApi.reload(params.node);
                };

                /**
                 * 刷新表格
                 * @param node ztree节点对象
                 */
                function refreshGrid(node) {
                    $scope.treeSetting.hcApi.reload(node);
                }


                /**
                 * 右上角[删除]按钮事件
                 * @param params 网格行数据
                 * @returns {*}
                 */
                $scope.delete = function () {
                    return $scope.treeSetting.hcApi
                        .getSelectedNodesWithNotice({
                            actionName: '删除'
                        }).then(function(nodes){
                            var item_class = $scope.gridOptions.hcApi.getFocusedNode().data;
                            var parentNode = nodes[0];
                            if(item_class.is_init == 2){
                                return swalApi.info('该分类为外部系统引入的分类，不允许删除');
                            }
                            $scope.deleteRequest(item_class,parentNode);
                        });
                };

                /**
                 * 树结构右键[删除]按钮事件
                 */
                $scope.deleteByTreeNode = function(){
                    return $scope.treeSetting.hcApi
                        .getSelectedNodesWithNotice({
                            actionName: '删除分类'
                        })
                        .then(function (nodes) {
                            var node = nodes[0];
                            var item_class = node.data;
                            var parentNode = node.getParentNode();
                            if(item_class.is_init == 2){
                                return swalApi.info('该分类为外部系统引入的分类，不允许删除');
                            }
                            $scope.deleteRequest(item_class,parentNode);
                        });
                };

                /**
                 * 发送删除请求 并移除树节点中删除的节点，刷新网格数据
                 * @param deleteNode 被删除节点，需要item_class_id和item_class_name
                 * @param refreshTreeNode 删除后要刷新的树节点（别删除节点的父节点）
                 * @returns {*}
                 */
                $scope.deleteRequest = function(item_class,refreshTreeNode){
                    if(item_class.is_init == 2){
                        return swalApi.info('该分类为外部系统引入的分类，不允许删除');
                    }

                    return swalApi.confirmThenSuccess({
                        title: '确定要删除产品分类【' + item_class.item_class_name + '】吗?',
                        okFun: function () {
                            var removeNode = $scope.treeSetting.zTreeObj.getNodesByFilter(function(cur){
                                return cur.id == item_class.item_class_id;
                            });

                            return requestApi
                                .post({
                                    classId: 'item_class',
                                    action: 'delete',
                                    data: item_class
                                })
                                .then(function () {
                                    //移除被删除的节点
                                    $scope.treeSetting.zTreeObj.removeNode(removeNode[0]);

                                    //刷新树节点
                                    $scope.treeSetting.hcApi.clickNode(refreshTreeNode);
                                });
                        },
                        okTitle: '删除成功'
                    }).then(function () {
                        return refreshGrid(refreshTreeNode);
                    });

                };

                /*---------------------------工具栏按钮事件定义 结束---------------------------*/

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
