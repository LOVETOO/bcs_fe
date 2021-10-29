/**
 * 机构工作区
 * @since 2019-01-02
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'angular', 'base_tree_list', 'requestApi', 'numberApi', 'openBizObj', 'swalApi', 'gridApi', 'strApi', 'jurisdictionApi'], defineFn);
})(function (module, controllerApi, angular, base_tree_list, requestApi, numberApi, openBizObj, swalApi, gridApi, strApi, jurisdictionApi) {
    'use strict';

    OrgTreeList.$inject = ['$scope', '$q', '$timeout', '$modal'];

    function OrgTreeList($scope, $q, $timeout, $modal) {

        var hasRight = userbean.hasRole('OrgManagers', true);

        $scope.data = {
            currItem: {},
            //权限对象
            rightObj: {
                all: 0,//所有完全控制
                view: 0,//浏览
                read: 0,//读取
                modify: 0,//修改
                add: 0,//新增
                delete: 0,//删除
                dir: 0,//目录列表
                export: 0,//输出
                cantransfer: 1//能否转授2-客转授
            }
        };
        //临时容器，存放复制、剪切时的选中数据
        $scope.item_list = [];
        $scope.searchByUser = 2;//默认勾选用户查询
        $scope.searchType = 1;//默认搜索模式 用户

        //请求词汇
        requestApi.getDict('org_type')
            .then(function (dicts) {
                var names = [], values = [];
                dicts.map(function (dict) {
                    names.push(dict.dictname);
                    values.push(dict.dictvalue);
                });
                $scope.org_type = {names: names, values: values}
            });


        /**
         * 表格选项
         */
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'username',
                headerName: '名称',
                pinned: 'left'
            }, {
                field: 'position',
                headerName: '岗位'
            }, {
                field: 'userid',
                headerName: '账号'
            }, {
                field: 'mobil',
                headerName: '手机'
            }, {
                field: 'telh',
                headerName: '办公电话'
            }, {
                field: 'email',
                headerName: '邮箱'
            }, {
                field: 'namepath',
                headerName: '路径'
            }, {
                field: 'note',
                headerName: '备注'
            }],
            //扩展右键菜单
            getContextMenuItems: function (params) {
                var menuItems = $scope.gridOptions.hcDefaultOptions.getContextMenuItems(params);

                if ($scope.isSearchMod) {
                    menuItems.push('separator');
                    menuItems.push({
                        icon: '',
                        name: '定位',
                        action: function () {
                            return locate(params.node);
                        }
                    });
                }

                if (hasRight) {
                    menuItems.push('separator');

                    if (params.node) {
                        menuItems.push({
                            icon: '<i class="fa fa-scissors"></i>',
                            name: '剪切',
                            action: $scope.cutItem
                        });
                    }
                    else if (!params.node && $scope.item_list.length) {
                        menuItems.push({
                            icon: '<i class="fa fa-clipboard"></i>',
                            name: '粘贴',
                            action: $scope.pasteItem
                        });
                    }
                }

                menuItems.push({
                    icon: '<i class="fa fa-info-circle"></i>',
                    name: '属性',
                    action: $scope.cutItem
                });

                return menuItems;
            },
            hcClassId: 'scpuser',
            hcDataRelationName: 'users',
            hcSearchWhenReady: false
        };

        //搜索关键字段
        $scope.keys = ['userid', 'username', 'userid_py', 'username_py'];

        /*
         * 剪切机构/用户
         * */
        $scope.cutItem = function (params) {
            //行数据或者树节点数据
            var row;

            if (params) {
                var zTree = $scope.treeSetting.zTreeObj;
                row = zTree.getSelectedNodes()[0];//选中树节点数据
            } else {
                var FocusedNode = $scope.gridOptions.hcApi.getFocusedNode();
                if (!FocusedNode || !FocusedNode.data) {
                    return swalApi.info("请先选择用户")
                }
                row = FocusedNode.data;
            }
            //更新临时储存
            $scope.item_list[0] = row;
            $scope.item_list.is_cut = true;

            var zTree = $scope.treeSetting.zTreeObj;
            var node = zTree.getSelectedNodes()[0];

            //取得被剪切用户的orgid
            requestApi.post({
                classId: 'scporg',
                action: 'selectref',
                data: node
            })
                .then(function (result) {
                    $scope.data.sourceorgid = result.orgid;
                    console.log(result, "result");
                });
        };

        /**
         * 粘贴
         */
        $scope.pasteItem = function () {
            if ($scope.item_list.length <= 0) {
                return swalApi.info("请先选择机构/用户");
            }

            var zTree = $scope.treeSetting.zTreeObj;
            var node = zTree.getSelectedNodes()[0];

            //被剪切数据
            var row = $scope.item_list[0];

            //复制/剪切到的目标路径
            //前台没有parentid数据,通过请求返回
            requestApi.post({
                classId: 'scporg',
                action: 'selectref',
                data: node
            })
                .then(function (result) {
                    var data = {
                        parentid: result.parentid + result.orgid + "\\",
                        parenttype: result.parenttype + "12\\",
                        wsright: result.wsright,
                        sourceorgid: $scope.data.sourceorgid,
                    };


                    //用户
                    if (row.sysuserid) {
                        data.sysuserid = row.sysuserid;
                        data.username = row.username;
                        console.log("------ 粘贴用户");
                    } else {//机构
                        data.orgid = row.data.orgid;
                        data.orgname = row.data.orgname;
                        console.log("------ 粘贴机构");
                    }

                    return data;
                })
                .then(function (data) {
                    return requestApi.post({
                        classId: row.sysuserid ? 'scpuser' : 'scporg',
                        action: ($scope.item_list.is_cut == true ? 'cut' : 'paste'),
                        data: data
                    })
                })
                .then(function (params) {
                    //刷新数据原来位置与数据目标位置
                    $scope.treeSetting.hcApi.reload(params.node);

                    $scope.item_list = [];
                });
        };

        /**
         * 树设置
         */
        $scope.treeSetting = {
            //获取根节点的方法
            hcGetRootNodes: function () {
                return {
                    name: '机构',
                    hcIsRoot: true,
                    data: {
                        wsid: -16
                    }
                };
            },
            //获取子节点的方法
            hcGetChildNodes: function (node) {
                if (node.hcIsRoot) {
                    return requestApi
                        .post({
                                 classId: 'scpworkspace',
                                 action: 'selectref',
                                 data: {
                                 excluderight: 1,
                                 wsid: -16,
                                 wsright: '00000000000000000000FFFF000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                                 wstag: -16
                             }
                            //classId: 'scporg',
                            //action: 'search',
                            //data: {
                            //    superid: -1
                            //}
                        })
                        .then(function (response) {
                            return response.orgs.map(function (org) {
                                return {
                                    name: org.orgname,
                                    data: org
                                };
                            });
                        });
                }

                return requestApi
                    .post({
                        classId: 'scporg',
                        /* action: 'selectref',
                         data: {
                         orgid: node.data.orgid
                         } */
                        action: 'search',
                        data: {
                            superid: node.data.orgid
                        }
                    })
                    .then(function (response) {
                        node.data.orgoforgs = response.orgoforgs;
                        // node.data.useroforgs = response.useroforgs;

                        return response.orgoforgs.map(function (data) {
                            return {
                                name: data.orgname,
                                data: data
                            };
                        });
                    })
                    /*获取权限数据插入node.objaccess中*/
                    .then(function (data) {
                        var promises = [];

                        data.forEach(function (item) {
                            var postdata = {
                                idpath: item.data.idpath,
                                typepath: item.data.typepath
                            };
                            var promise = requestApi.post("scpobjright", "select", postdata)
                                .then(function (response) {
                                    item.objaccess = response.objaccess;
                                    return item
                                });
                            promises.push(promise);
                        });

                        return $q.all(promises)
                    })
                    .then(function (data) {
                        return data;
                    });
            },
            hcGetGridData: function (node) {
                if (node.hcIsRoot) return null;
                // return node.data.useroforgs;

                return requestApi
                    .post({
                        classId: 'scporg',
                        action: 'selectref',
                        data: {
                            orgid: node.data.orgid
                        }
                    })
                    .then(function (response) {
                        node.data.useroforgs = response.useroforgs;

                        return response.useroforgs;
                    });
            },
            hcAllowMenuWithoutNode: true,
            hcMenuItems: {
                authority: {
                    title: '权限',
                    icon: 'fa fa-share',
                    click: function (params) {
                        $scope.share(params.node, 'tree');
                    },
                    hide: function (params) {
                        return !params.node || params.node.hcIsRoot || !hasRight || !$scope.judge_right_authority(params.node);
                    }
                },
                refresh: {
                    title: '刷新',
                    icon: 'fa fa-refresh',
                    click: function (params) {
                        $scope.treeSetting.hcApi.reload(params.node);
                    }
                },
                addOrg: {
                    title: function (params) {
                        return '新增' + (params.node && params.node.hcIsRoot ? '' : '子') + '机构';
                    },
                    icon: 'fa fa-file-o',
                    click: function (params) {
                        addOrg({
                            superNode: params.node
                        });
                    },
                    hide: function (params) {
                        return !params.node || !hasRight;
                    }
                },
                deleteOrg: {
                    title: '删除机构',
                    icon: 'fa fa-trash-o',
                    click: function (params) {
                        deleteOrg({
                            node: params.node
                        });
                    },
                    hide: function (params) {
                        return !params.node || params.node.hcIsRoot || !hasRight;
                    }
                },
                cutOrg: {
                    title: '剪切机构',
                    icon: 'fa fa-scissors',
                    click: function (params) {
                        $scope.cutItem({
                            node: params.node
                        });
                    },
                    hide: function (params) {
                        return !params.node || params.node.hcIsRoot || !hasRight;
                    }
                },
                openOrg: {
                    title: '属性',
                    icon: 'fa fa-info-circle',
                    click: function (params) {
                        openOrg({
                            node: params.node
                        });
                    },
                    hide: function (params) {
                        return !params.node || params.node.hcIsRoot;
                    }
                }
            }
        };
        $scope.gridOptions_user_copy = angular.copy($scope.gridOptions);//用户网格


        /**
         *checkbox点击改变事件
         * @param type
         */
        $scope.onSearchTypeChange = function () {
            $scope.searchByKeyword();
        }
        /**
         * 根据搜索类型切换网格
         */
        $scope.switchGrid = function () {

            if ($scope.searchType == 1 && $scope.gridOptions.hcClassId != 'scpuser') {//用户
                $scope.gridOptions.columnDefs = $scope.gridOptions_user_copy.columnDefs;
                //扩展右键菜单
                $scope.gridOptions.getContextMenuItems = getUserContextMenuItems
                $scope.gridOptions.hcClassId = 'scpuser';
                $scope.gridOptions.hcDataRelationName = 'users';
                $scope.gridOptions.hcSearchWhenReady = false;
                $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);

                //搜索关键字段
                $scope.keys = ['userid', 'username', 'userid_py', 'username_py'];
            }
            if ($scope.searchType == 2 && $scope.gridOptions.hcClassId != 'scporg') {//机构
                $scope.gridOptions.columnDefs = [
                    {
                        type: '序号'
                    }, {
                        field: 'orgname',
                        headerName: '名称',
                        pinned: 'left'
                    }, {
                        field: 'orgtype',
                        headerName: '类型',
                        // hcDictCode: 'org_type'
                        type: '下拉',
                        cellEditorParams: $scope.org_type
                    }, {
                        field: 'manager',
                        headerName: '负责人'
                    }, {
                        field: 'code',
                        headerName: '编码'
                    }, {
                        field: 'namepath',
                        headerName: '路径'
                    }, {
                        field: 'note',
                        headerName: '备注'
                    }];
                //扩展右键菜单
                $scope.gridOptions.hcBeforeRequest = function (searchObj) {
                    searchObj.flag = 1;
                }
                $scope.gridOptions.getContextMenuItems = getUserContextMenuItems;
                $scope.gridOptions.hcClassId = 'scporg';
                $scope.gridOptions.hcDataRelationName = 'orgoforgs';
                $scope.gridOptions.hcSearchWhenReady = false;
                $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);

                //搜索关键字段
                $scope.keys = ['orgid', 'orgname'];
            }
        };

        //继承基础控制器
        controllerApi.extend({
            controller: base_tree_list.controller,
            scope: $scope
        });

        /**
         * 监视是否除以查询状态，退出查询时需要换回用户网格
         */
        $scope.$watch('isSearchMod', function (newVal) {
            if (!newVal) {
                $scope.gridOptions.columnDefs = $scope.gridOptions_user_copy.columnDefs;
                //扩展右键菜单
                $scope.gridOptions.getContextMenuItems = getUserContextMenuItems
                $scope.gridOptions.hcClassId = 'scpuser';
                $scope.gridOptions.hcDataRelationName = 'users';
                $scope.gridOptions.hcSearchWhenReady = false;
                if ($scope.gridOptions.api)
                    $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
            }
        })
        /**
         * 输入框值改变搜索事件
         */
        $scope.onKeywordChange = function () {
            $scope.switchGrid();
            $scope.hcSuper.onKeywordChange();
        };

        /**
         * 点击搜索
         */
        $scope.searchByKeyword = function () {
            $scope.switchGrid();
            $scope.hcSuper.searchByKeyword();
        }

        function isRoot() {
            return $scope.$eval('treeSetting.zTreeObj.getSelectedNodes()[0].hcIsRoot');
        }

        /**
         * 工具栏
         */
        $scope.toolButtons = {
            addUser: {
                title: '新增用户',
                icon: 'iconfont hc-add',
                click: function (params) {
                    addUser();
                },
                hide: function () {
                    return !hasRight || isRoot() || $scope.isSearchMod;
                }
            },
            openUser: {
                title: '查看用户',
                icon: 'iconfont hc-search',
                click: function (params) {
                    openUser();
                },
                hide: isRoot
            },
            deleteUser: {
                title: '删除用户',
                icon: 'iconfont hc-delete',
                click: function (params) {
                    deleteUser();
                },
                hide: true
            },
            addOrg: {
                title: function () {
                    return '新增' + (isRoot() ? '' : '子') + '机构';
                },
                icon: 'iconfont hc-add',
                click: function (params) {
                    addOrg();
                },
                hide: function () {
                    return !hasRight || $scope.isSearchMod;
                }
            },
            openOrg: {
                title: '查看机构',
                icon: 'iconfont hc-search',
                click: function (params) {
                    openOrg();
                },
                hide: function () {
                    return isRoot() || $scope.isSearchMod;
                }
            },
            deleteOrg: {
                title: '删除机构',
                icon: 'iconfont hc-delete',
                click: function (params) {
                    deleteOrg();
                },
                hide: function () {
                    return !hasRight || isRoot() || $scope.isSearchMod;
                }
            }
        };

        $scope.locate = locate;

        function locate(node) {
            return $q
                .when()
                .then(function () {
                    if (node) return node;

                    return $scope.gridOptions.hcApi.getFocusedNodeWithNotice({
                        actionName: '定位'
                    });
                })
                .then(function (node) {
                    $scope.isSearchMod = false;

                    if ($scope.searchType == 2) {
                        return $scope.orgLocate({
                            path: node.data.idpath + " \0",
                            key: 'orgid',
                            gridKey: 'orgid'
                        })
                    }

                    return $scope.treeSetting.hcApi.locate({
                        path: node.data.idpath,
                        key: 'orgid',
                        locateToGrid: true,
                        gridKey: 'sysuserid'
                    });
                });
        }

        /**
         * 机构定位
         * @param params
         * @since 2019-03-12
         */
        $scope.orgLocate = function (params) {
            var currNode = $scope.treeSetting.zTreeObj.getNodes()[0];

            var treeNodeIds = strApi.commonSplit(params.path);

            var gridNodeId;
            if (params.locateToGrid)
                gridNodeId = treeNodeIds.pop();

            var promise = $scope.treeSetting.hcApi.reload(currNode);

            treeNodeIds.forEach(function (id) {
                promise = promise.then(function () {
                    currNode = $scope.treeSetting.zTreeObj.getNodesByFilter(function (node) {
                        return node.data[params.key] == id;
                    }, true, currNode);

                    if (currNode)
                        return $scope.treeSetting.hcApi.clickNode(currNode);
                });
            });

            //定位到机构后，表格要重新换回用户展示
            $scope.gridOptions.columnDefs = $scope.gridOptions_user_copy.columnDefs;
            //扩展右键菜单
            $scope.gridOptions.getContextMenuItems = getUserContextMenuItems;

            $scope.gridOptions.hcClassId = 'scpuser';
            $scope.gridOptions.hcDataRelationName = 'users';
            $scope.gridOptions.hcSearchWhenReady = false;
            $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);

            promise = promise.then(function () {
                var rowNode = $scope.treeSetting.hcGridOptions.hcApi.getNodesByFilter(function (node) {
                    return node.data[params.gridKey] == gridNodeId;
                })[0];

                if (rowNode)
                    $scope.treeSetting.hcGridOptions.hcApi.setFocusedCell(rowNode.rowIndex);
            });

            return promise;
        }

        /**
         * 新增子机构
         * @param params
         */
        function addOrg(params) {
            var superId = 0, wsId = 0;

            return $q
                .when()
                .then(function () {
                    if (angular.isUndefined(params)) {
                        return $scope.treeSetting.hcApi
                            .getSelectedNodesWithNotice({
                                actionName: '作为父机构'
                            })
                            .then(function (nodes) {
                                var node = nodes[0];
                                if (node.hcIsRoot)
                                    wsId = numberApi.toNumber(node.data.wsid);
                                else
                                    superId = numberApi.toNumber(node.data.orgid);
                            });
                    }
                    else if (angular.isNumber(params) || angular.isString(params)) {
                        superId = numberApi.toNumber(params);
                    }
                    else if (angular.isObject(params)) {
                        if ('superId' in params) {
                            superId = numberApi.toNumber(params.superId);
                        }
                        else if ('wsId' in params) {
                            wsId = numberApi.toNumber(params.wsId);
                        }
                        else if ('superNode' in params) {
                            if (params.superNode.hcIsRoot)
                                wsId = numberApi.toNumber(params.superNode.data.wsid);
                            else
                                superId = numberApi.toNumber(params.superNode.data.orgid);
                        }
                    }
                })
                .then(function () {
                    if (superId === 0 && wsId === 0)
                        throw new Error('新增机构失败：缺少必要参数 superId 或 wsId');
                })
                .then(function () {
                    var openParams = {
                        stateName: 'baseman.org_prop',
                        params: {}
                    };

                    if (superId)
                        openParams.params.superId = superId;
                    else
                        openParams.params.wsId = wsId;

                    var promise = openBizObj(openParams).result;

                    if (superId)
                        promise = promise.finally($scope.refresh);
                    else
                        promise = promise.finally(function () {
                            $scope.treeSetting.hcApi.reload(null);
                        });
                });
        }

        $scope.openTreeProp = openOrg;

        /**
         * 查看机构
         * @param params
         */
        function openOrg(params) {
            var id = 0;

            return $q
                .when()
                .then(function () {
                    if (angular.isUndefined(params)) {
                        return $scope.treeSetting.hcApi
                            .getSelectedNodesWithNotice({
                                actionName: '查看'
                            })
                            .then(function (nodes) {
                                if (nodes[0].hcIsRoot) return $q.reject();
                                id = numberApi.toNumber(nodes[0].data.orgid);
                            });
                    }
                    else if (angular.isNumber(params) || angular.isString(params)) {
                        id = numberApi.toNumber(params);
                    }
                    else if (angular.isObject(params)) {
                        if ('id' in params) {
                            id = numberApi.toNumber(params.id);
                        }
                        else if ('node' in params) {
                            id = numberApi.toNumber(params.node.data.orgid);
                        }
                    }
                })
                .then(function () {
                    if (id === 0)
                        throw new Error('查看机构失败：缺少必要参数 id');
                })
                .then(function () {
                    return openBizObj({
                        stateName: 'baseman.org_prop',
                        params: {
                            id: id
                        }
                    })
                        .result
                        .finally($scope.refresh);
                });
        }

        /**
         * 删除机构
         * @param params
         */
        function deleteOrg(params) {
            var id, node;

            return $q
                .when()
                .then(function () {
                    if (angular.isUndefined(params)) {
                        return $scope.treeSetting.hcApi
                            .getSelectedNodesWithNotice({
                                actionName: '删除'
                            })
                            .then(function (nodes) {
                                node = nodes[0];
                                id = numberApi.toNumber(node.data.orgid);
                            });
                    }
                    else if (angular.isObject(params)) {
                        if ('node' in params) {
                            node = params.node;
                            id = numberApi.toNumber(node.data.orgid);
                        }
                    }
                })
                .then(function () {
                    if (!node)
                        throw new Error('删除机构失败：缺少必要参数 node');
                })
                .then(function () {
                    return swalApi.confirmThenSuccess({
                        title: '确定要删除机构【' + node.data.orgname + '】吗?',
                        okFun: function () {
                            return requestApi
                                .post({
                                    classId: 'scporg',
                                    action: 'delete',
                                    data: {
                                        orgid: id
                                    }
                                })
                                .then(function () {
                                    var parentNode = node.getParentNode();

                                    if (parentNode)
                                        $scope.treeSetting.hcApi.clickNode(parentNode);
                                    else
                                        $scope.gridOptions.hcApi.setRowData([]);

                                    $scope.treeSetting.zTreeObj.removeNode(node);
                                });
                        },
                        okTitle: '删除成功'
                    });
                });
        }

        /**
         * 新增用户
         * @param params
         */
        function addUser(params) {
            var orgId = 0;

            return $q
                .when()
                .then(function () {
                    if (angular.isUndefined(params)) {
                        return $scope.treeSetting.hcApi
                            .getSelectedNodesWithNotice({
                                actionName: '作为父机构'
                            })
                            .then(function (nodes) {
                                orgId = numberApi.toNumber(nodes[0].data.orgid);
                            });
                    }
                    else if (angular.isNumber(params) || angular.isString(params)) {
                        orgId = numberApi.toNumber(params);
                    }
                    else if (angular.isObject(params)) {
                        if ('orgId' in params) {
                            orgId = numberApi.toNumber(params.orgId);
                        }
                        else if ('superNode' in params) {
                            orgId = numberApi.toNumber(params.superNode.data.orgid);
                        }
                    }
                })
                .then(function () {
                    if (orgId === 0)
                        throw new Error('新增用户失败：缺少必要参数 orgId');
                })
                .then(function () {
                    return openBizObj({
                        stateName: 'baseman.user_prop',
                        params: {
                            orgId: orgId,
                            title: '用户'
                        }
                    })
                        .result
                        .finally($scope.refresh);
                });
        }

        $scope.openProp = openUser;

        /**
         * 查看用户
         * @param params
         */
        function openUser(params) {
            var id;

            return $q
                .when()
                .then(function () {
                    if (angular.isUndefined(params)) {
                        return $scope.gridOptions.hcApi
                            .getFocusedNodeWithNotice({
                                actionName: '查看'
                            })
                            .then(function (node) {
                                id = numberApi.toNumber(node.data.sysuserid);
                            });
                    }
                    else if (angular.isNumber(params) || angular.isString(params)) {
                        id = numberApi.toNumber(params);
                    }
                    else if (angular.isObject(params)) {
                        if ('id' in params) {
                            id = numberApi.toNumber(params.id);
                        }
                        else if ('node' in params) {
                            id = numberApi.toNumber(params.node.data.sysuserid);
                        }
                    }
                })
                .then(function () {
                    if (id === 0)
                        throw new Error('查看用户失败：缺少必要参数 id');
                })
                .then(function () {
                    return openBizObj({
                        stateName: 'baseman.user_prop',
                        params: {
                            id: id,
                            title: '用户'
                        }
                    })
                        .result
                        .finally($scope.refresh);
                });
        }

        /**
         * 删除用户
         * @param params
         */
        function deleteUser(params) {
            var id, node;

            return $q
                .when()
                .then(function () {
                    if (angular.isUndefined(params)) {
                        return $scope.gridOptions.hcApi
                            .getFocusedNodeWithNotice({
                                actionName: '删除'
                            })
                            .then(function (focusedNode) {
                                node = focusedNode;
                                id = numberApi.toNumber(node.data.sysuserid);
                            });
                    }
                    else if (angular.isObject(params)) {
                        if ('node' in params) {
                            node = params.node;
                            id = numberApi.toNumber(node.data.sysuserid);
                        }
                    }
                })
                .then(function () {
                    if (!node)
                        throw new Error('删除用户失败：缺少必要参数 node');
                })
                .then(function () {
                    return swalApi.confirmThenSuccess({
                        title: '确定要删除用户【' + node.data.userid + '】吗?',
                        okFun: function () {
                            return requestApi
                                .post({
                                    classId: 'scpuser',
                                    action: 'delete',
                                    data: {
                                        sysuserid: id
                                    }
                                })
                                .then(function () {
                                    $scope.gridOptions.api.updateRowData({
                                        remove: [node.data]
                                    });
                                });
                        },
                        okTitle: '删除成功'
                    });

                });
        }

        /**
         * 获取用户列表菜单
         */
        function getUserContextMenuItems(params) {
            var menuItems = $scope.gridOptions.hcDefaultOptions.getContextMenuItems(params);

            if ($scope.isSearchMod) {
                menuItems.push('separator');
                menuItems.push({
                    icon: '',
                    name: '定位',
                    action: function () {
                        return locate(params.node);
                    }
                });
            }

            if (hasRight) {
                menuItems.push('separator');

                if (params.node) {
                    menuItems.push({
                        icon: '<i class="fa fa-scissors"></i>',
                        name: '剪切机构',
                        action: $scope.cutItem
                    });
                }
                else if (!params.node && $scope.item_list.length && $scope.gridOptions.hcClassId == 'scpuser') {
                    menuItems.push({
                        icon: '<i class="fa fa-clipboard"></i>',
                        name: '粘贴',
                        action: $scope.pasteItem
                    });
                }
            }

            menuItems.push({
                icon: '<i class="fa fa-info-circle"></i>',
                name: '属性',
                action: function () {
                    if ($scope.gridOptions.hcClassId == 'scpuser')
                        return openUser();//打开用户
                    else {
                        params = $scope.gridOptions.hcApi.getSelectedNodes('auto')[0].data.orgid;
                        return openOrg(params); //打开机构
                    }
                }
            });

            return menuItems;
        }

        /**
         * 解析权限
         */
        $scope.initObjRights = function (treeNode) {
            $scope.data.rightObj = jurisdictionApi.initObjRights(treeNode);
        };

        /**
         * 判断是否有权限
         * @param rightNames
         * @returns {boolean}
         */
        $scope.hasRight = function (rightNames) {
            return jurisdictionApi.hasRight(rightNames, $scope.data.rightObj)
        };

        /**
         * 判断是否拥有 树 右键 权限的权限
         */
        $scope.judge_right_authority = function (treeNode) {
            $scope.initObjRights(treeNode);
            return $scope.hasRight(['cantransfer', 'all'])
        };


        /**
         * 权限弹框
         * @param node
         * @param flag 'tree' 'grid'
         */
        $scope.share = function (node, flag) {
            $scope.share_choose_data = {node: node, flag: flag};
            jurisdictionApi.openshare(flag,$scope);
            /*BasemanService.openFrm("views/baseman/share.html", jurisdictionApi.shareController, $scope, "", "").result.then(function (data) {
                jurisdictionApi.shareControllerOk(data, flag,$scope);
            })*/
        };

    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: OrgTreeList
    });
});