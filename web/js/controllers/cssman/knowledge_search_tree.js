/**
 * Created by zhl on 2019/7/5.
 * 知识库检索 knowledge_search_tree
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
        };

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
            }
        };

        //继承基础控制器
        controllerApi.extend({
            controller: base_tree_list.controller,
            scope: $scope
        });

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
        $scope.toolButtons = {};

    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: OrgTreeList
    });
});

