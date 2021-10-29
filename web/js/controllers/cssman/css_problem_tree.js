/**
 * Created by zhl on 2019/7/3.
 * 故障代码（故障现象维护） css_problem_tree
 */

define(
    ['module', 'controllerApi', 'base_tree_list', 'requestApi', 'numberApi', 'openBizObj', 'swalApi'],
    function (module, controllerApi, base_tree_list, requestApi, numberApi, openBizObj, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {

                /**
                 * 表格定义
                 */
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'problem_code',
                            headerName: '故障编码',
                            width: 90
                        }, {
                            field: 'problem_name',
                            headerName: '故障描述',
                            width: 160
                        }, {
                            field: 'item_class_name',
                            headerName: '产品类别'
                        }, /* {
                         field: 'remark',
                         headerName: '经营单位',
                         width:400
                         },*/ {
                            field: 'note',
                            headerName: '备注',
                            width: 400
                        }
                    ],
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
                            name: '所有故障',
                            data:{},
                            isParent: true,
                            problem_pid: 0,
                            hcIsRoot: true
                        };
                    },
                    //获取子节点的方法
                    hcGetChildNodes: function (node) {
                        var sqlwhere;

                        //如果不是自定义根节点，搜索该根节点下的子节点作为第二级
                        if (node.data.problem_id)
                            sqlwhere = 'problem_pid = ' + node.data.problem_id;
                        //如果是自定义根节点，搜索无父节点的节点作为第二级
                        else
                            sqlwhere = 'problem_pid = 0';

                        return requestApi
                            .post({
                                classId: 'css_problem',
                                action: 'search',
                                data: {
                                    sqlwhere: sqlwhere
                                }
                            })
                            .then(function (response) {
                                node.data.css_problems = response.css_problems;

                                var isParent;

                                return response.css_problems.map(function (data) {
                                    //节点默认有子节点
                                    isParent = true;

                                    //需要java中有single_node额外字段，single_node记录所有无子节点的节点
                                    /*if (data.single_node.indexOf(data.problem_id) != -1)
                                        isParent = false;*/

                                    return {
                                        id: data.problem_id,
                                        pId: data.problem_pid,
                                        name: data.problem_name,
                                        data: data,
                                        isParent: isParent
                                    };
                                });
                            });
                    },
                    //返回指定节点的表格数据或其承诺
                    hcGetGridData: function (node) {
                        return node.data.css_problems;
                    },
                    //设置树结构右键菜单
                    hcMenuItems: {
                        refresh: {
                            title: '刷新',
                            icon: 'fa fa-refresh',
                            click: function (params) {
                                $scope.treeSetting.hcApi.reload(params.node);
                            }
                        },
                        add: {
                            title: '新增',
                            icon: 'fa fa-file-o',
                            click: function (params) {
                                $scope.add();
                            }
                        },
                        deleteOrg: {
                            title: '删除',
                            icon: 'fa fa-trash-o',
                            click: function (params) {
                                $scope.delete();
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
                    }
                };

                controllerApi.extend({
                    controller: base_tree_list.controller,
                    scope: $scope
                });

                /*---------------------------工具栏按钮事件定义 开始---------------------------*/

                //是否根节点（所有故障）
                function isRoot() {
                    return $scope.$eval('treeSetting.zTreeObj.getSelectedNodes()[0].hcIsRoot');
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
                            //根据表格焦点打开模态框
                            if (angular.isUndefined(params)) {
                                var focusedNode = $scope.gridOptions.hcApi.getFocusedNode();
                                //从表格中获取id
                                id = focusedNode.data.problem_id
                            }
                            //根据树节点焦点打开模态框
                            else {
                                return $scope.treeSetting.hcApi
                                    .getSelectedNodesWithNotice({
                                        actionName: '查看'
                                    })
                                    .then(function (nodes) {
                                        node = nodes[0];

                                        //不允许查看根节点（根节点是自定义的）
                                        if (node.hcIsRoot) {
                                            return $q.reject();
                                        }

                                        //从树节点获取id
                                        id = numberApi.toNumber(node.data.problem_id);

                                        //获取父节点
                                        parentNode = node.getParentNode();
                                    });
                            }
                        })
                        .then(function () {
                            if (id === 0)
                                throw new Error('查看详情失败：缺少必要参数 id');
                        }).then(function () {
                            //打开模态框
                            openBizObj({
                                stateName: 'cssman.css_problem_tree_prop',
                                width: '1000px',
                                height: '300px',
                                params: {
                                    id: id,
                                    title: '故障代码'
                                }
                            }).result
                                .finally(function () {
                                    //刷新树节点
                                    if (params) {
                                        //$scope.treeSetting.hcApi.reload(parentNode);
                                        return requestApi.post('css_problem', 'select', {problem_id: id})
                                            .then(function (response) {
                                                node.name = response.problem_name;
                                                refreshGrid(parentNode);//刷新父节点
                                            });
                                    }
                                    //刷新表格
                                    else
                                        refreshGrid(node);//刷新当前节点
                                });
                        });
                }

                //新增
                $scope.add = function (params) {
                    //新增时默认父id为0（无父节点）
                    var problem_pid = 0;

                    return $q
                        .when()
                        .then(function () {
                            if (angular.isUndefined(params)) {
                                return $scope.treeSetting.hcApi
                                    .getSelectedNodesWithNotice({
                                        actionName: '作为父分类'
                                    })
                                    .then(function (nodes) {
                                        //设置当前选中节点id为新增节点的父id
                                        problem_pid = nodes[0].data.problem_id;
                                    });
                            }
                            else if (angular.isNumber(params) || angular.isString(params)) {
                                problem_pid = numberApi.toNumber(params);
                            }
                            else if (angular.isObject(params)) {
                                if ('problem_pid' in params) {
                                    problem_pid = numberApi.toNumber(params.problem_pid);
                                }
                                else if ('superNode' in params) {
                                    problem_pid = numberApi.toNumber(params.superNode.data.problem_pid);
                                }
                            }
                        })
                        .then(function () {
                            openBizObj({
                                stateName: 'cssman.css_problem_tree_prop',
                                width: '800',
                                height: '180px',
                                params: {
                                    id: 0,
                                    problem_pid: problem_pid,
                                    title: '故障代码'
                                }
                            }).result
                                .finally($scope.refresh);
                        });
                }

                //根节点选中时，删除按钮隐藏
                $scope.toolButtons.delete.hide = function () {
                    return isRoot();
                };

                //根节点选中时，查看详情隐藏
                $scope.toolButtons.openProp.hide = function () {
                    return isRoot();
                };

                $scope.toolButtons.openProp.icon = 'iconfont hc-search';

                //删除分类(删除选中的树节点)
                $scope.delete = function (params) {
                    var problem_id = 0;

                    var postData = {};

                    var node, parentNode;

                    return $q
                        .when()
                        .then(function () {
                            if (angular.isUndefined(params)) {
                                return $scope.treeSetting.hcApi
                                    .getSelectedNodesWithNotice({
                                        actionName: '删除分类'
                                    })
                                    .then(function (nodes) {
                                        node = nodes[0];

                                        parentNode = node.getParentNode();

                                        problem_id = numberApi.toNumber(node.data.problem_id);
                                    });
                            }
                        })
                        .then(function () {
                            return swalApi.confirmThenSuccess({
                                title: '确定要删除故障代码【' + node.data.problem_name + '】吗?',
                                okFun: function () {
                                    postData.problem_id = problem_id;

                                    return requestApi
                                        .post({
                                            classId: 'css_problem',
                                            action: 'delete',
                                            data: postData
                                        })
                                        .then(function () {
                                            var parentNode = node.getParentNode();

                                            /*if (parentNode)
                                             $scope.treeSetting.hcApi.clickNode(parentNode);
                                             else
                                             $scope.gridOptions.hcApi.setRowData([]);*/

                                            $scope.treeSetting.zTreeObj.removeNode(node);

                                            //刷新表格
                                            refreshGrid(parentNode)
                                        });
                                },
                                okTitle: '删除成功'
                            }).then(function () {
                                return refreshGrid(node.data.problem_pid);
                            });
                        });
                };

                //刷新按钮事件
                $scope.toolButtons.refresh.click = function (params) {
                    $scope.treeSetting.hcApi.reload(params.node);
                };

                //刷新树节点与表格
                function refreshGrid(node) {
                    $scope.treeSetting.hcApi.reload(node);
                }

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

