/**
 * Created by zhl on 2019/7/4.
 *服务措施（维护措施） css_fix_step_tree
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
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'fix_step_code',
                            headerName: '服务措施编码',
                            width: 90
                        }, {
                            field: 'fix_step_name',
                            headerName: '服务类型名称',
                            width: 160
                        }, {
                            field: 'server_type',
                            headerName: '服务类型',
                            hcDictCode:'server_type'
                        }, {
                            field: 'item_class_code',
                            headerName: '产品大类编码'
                        }, {
                            field: 'item_class_name',
                            headerName: '产品大类名称'
                        }, /*{
                         field: 'temp',
                         headerName: '是否有效'
                         },  {
                         field: 'unknown',
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
                            name: '所有措施',
                            data: {},
                            isParent: true,
                            fix_step_pid: 0,
                            hcIsRoot: true
                        };
                    },
                    //获取子节点的方法
                    hcGetChildNodes: function (node) {
                        var sqlwhere;

                        //如果不是自定义根节点，搜索该根节点下的子节点作为第二级
                        if (node.data.fix_step_id)
                            sqlwhere = 'fix_step_pid = ' + node.data.fix_step_id;
                        //如果是自定义根节点，搜索无父节点的节点作为第二级
                        else
                            sqlwhere = 'fix_step_pid = 0';

                        return requestApi
                            .post({
                                classId: 'css_fix_step',
                                action: 'search',
                                data: {
                                    sqlwhere: sqlwhere
                                }
                            })
                            .then(function (response) {
                                node.data.css_fix_steps = response.css_fix_steps;

                                var isParent;

                                return response.css_fix_steps.map(function (data) {
                                    //节点默认有子节点
                                    isParent = true;

                                    //需要java中有single_node额外字段，single_node记录所有无子节点的节点
                                    /*if (data.single_node.indexOf(data.problem_id) != -1)
                                     isParent = false;*/

                                    return {
                                        id: data.fix_step_id,
                                        pId: data.fix_step_pid,
                                        name: data.fix_step_name,
                                        data: data,
                                        isParent: isParent
                                    };
                                });
                            });
                    },
                    //返回指定节点的表格数据或其承诺
                    hcGetGridData: function (node) {
                        return node.data.css_fix_steps;
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

                //是否根节点（所有措施）
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
                                id = focusedNode.data.fix_step_id
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
                                        id = numberApi.toNumber(node.data.fix_step_id);

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
                                stateName: 'cssman.css_fix_step_tree_prop',
                                width: '1000px',
                                height: '300px',
                                params: {
                                    id: id,
                                    title: '服务措施'
                                }
                            }).result
                                .finally(function () {
                                    //刷新树节点(通过树节点打开属性页)
                                    if (params) {
                                        return requestApi.post('css_fix_step', 'select', {fix_step_id: id})
                                            .then(function (response) {
                                                node.name = response.fix_step_name;
                                                refreshGrid(parentNode);//刷新父节点
                                            });
                                    }
                                    //刷新表格（通过列表打开属性页）
                                    else
                                        refreshGrid(node);//刷新当前节点
                                });
                        });
                }

                //新增
                $scope.add = function (params) {
                    //新增时默认父id为0（无父节点）
                    var fix_step_pid = 0;

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
                                        fix_step_pid = nodes[0].data.fix_step_id;
                                    });
                            }
                            else if (angular.isNumber(params) || angular.isString(params)) {
                                fix_step_pid = numberApi.toNumber(params);
                            }
                            else if (angular.isObject(params)) {
                                if ('fix_step_pid' in params) {
                                    fix_step_pid = numberApi.toNumber(params.fix_step_pid);
                                }
                                else if ('superNode' in params) {
                                    fix_step_pid = numberApi.toNumber(params.superNode.data.fix_step_pid);
                                }
                            }
                        })
                        .then(function () {
                            openBizObj({
                                stateName: 'cssman.css_fix_step_tree_prop',
                                width: '800',
                                height: '220px',
                                params: {
                                    id: 0,
                                    fix_step_pid: fix_step_pid,
                                    title: '服务措施'
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
                    var fix_step_id = 0;

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

                                        fix_step_id = numberApi.toNumber(node.data.fix_step_id);
                                    });
                            }
                        })
                        .then(function () {
                            return swalApi.confirmThenSuccess({
                                title: '确定要删除服务措施【' + node.data.fix_step_name + '】吗?',
                                okFun: function () {
                                    postData.fix_step_id = fix_step_id;

                                    return requestApi
                                        .post({
                                            classId: 'css_fix_step',
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
                                return refreshGrid(node.data.fix_step_pid);
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