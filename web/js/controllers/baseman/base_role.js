// /**
//  *角色管理
//  * 2018-1-25 by mjl
//  */

define(
    ['module', 'controllerApi', 'base_tree_list', 'openBizObj', 'promiseApi', 'zTreeApi', 'ztree.exhide', 'requestApi', 'jquery', 'swalApi', 'directive/hcObjProp'],
    function (module, controllerApi, base_tree_list, openBizObj, promiseApi, zTreeApi, ztreeexhide, requestApi, $, swalApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {
                $scope.data = {};
                $scope.data.title = "角色";
                /*数据定义 */
                // $scope.treeSetting = {
                //     data: {
                //         simpleData: {
                //             enable: true,
                //             idKey: "id",
                //             pIdKey: "pId",
                //             rootPId: 0
                //         }
                //     }
                // }
                //表格列数据
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        headerName: "角色代号",
                        field: "roleid",
                        width: 200
                    }, {
                        headerName: "角色名称",
                        field: "rolename",
                        width: 200
                    }, {
                        headerName: "备注",
                        field: "note",
                        width: 600
                    }
                    ]
                };
                $scope.treeSetting = {
                    hcGetRootNodes: function (node) {
                        return requestApi.post('scprole', 'getuserent', {
                            entid: 0
                        })
                            .then(function (data) {
                                var a = data.entofroles.map(function (item) {
                                    return {
                                        name: item.entname,
                                        id: item.entid,
                                        isParent: true,
                                        data: item
                                    }
                                });
                                //加载网格数据
                                requestApi.post('scprole', 'selectall', {
                                    excluderight: 2,
                                    entid: data.entofroles[0].entid
                                })
                                    .then(function (data) {
                                        // console.log("网格数据",data)
                                        $scope.gridOptions.api.setRowData(data.roles);
                                    })

                                return a;
                            });
                    }
                };

                /***继承主控制器 */
                controllerApi.extend({
                    controller: base_tree_list.controller,
                    scope: $scope
                });

                $scope.data.title = '角色';
                //按钮控制
                $scope.toolButtons.openProp.hide = true;
                // $scope.toolButtons.delete.hide = true;
                $scope.toolButtons.add.title = '新建角色';

                //双击打开详情页
                $scope.openProp = function () {
                    // console.log("当前选中行", $scope.gridOptions.hcApi.getFocusedData())
                    openBizObj({
                        stateName: 'baseman.base_role_prop',
                        params: {
                            id: $scope.gridOptions.hcApi.getFocusedData().sysroleid
                        }
                    });
                }

                //新建角色
                $scope.add = function () {
                    openBizObj({
                        stateName: 'baseman.base_role_prop',
                        params: {}
                    });
                }
                //刷新
                $scope.refresh = function () {
                    requestApi.post('scprole', 'getuserent', {
                        entid: 0
                    })
                        .then(function (data) {
                            var a = data.entofroles.map(function (item) {
                                return {
                                    name: item.entname,
                                    id: item.entid,
                                    isParent: true,
                                    data: item
                                }
                            });
                            //加载网格数据
                            requestApi.post('scprole', 'selectall', {
                                excluderight: 2,
                                entid: data.entofroles[0].entid
                            })
                                .then(function (data) {
                                    // console.log("网格数据",data)
                                    $scope.gridOptions.api.setRowData(data.roles);
                                })
                            //
                            // console.log("....",$scope.treeSetting)//.hcElement

                            $.fn.zTree.init($("div [hc-tree='treeSetting']"), $scope.treeSetting, a);
                        });
                }
                //删除
                $scope.delete = function () {
                    //获取选中数据
                    var node = $scope.gridOptions.hcApi.getFocusedData();
                    if (!node) {
                        return swalApi.info('请选中一个角色').then($q.reject);
                    }
                    // console.log("获取选中数据",node)
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除名称为" + node.rolename + "的角色吗?",
                        okFun: function () {
                            //函数区域
                            requestApi.post("scprole", "delete", node).then(function (data) {
                                //清除选中
                                $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                                $scope.refresh();
                            });
                        },
                        okTitle: '删除成功'
                    });
                }
            }
        ]
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);
