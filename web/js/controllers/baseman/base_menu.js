/**
 * 模块定义
 *  2018-11-12
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'openBizObj', 'promiseApi', 'zTreeApi', 'ztree.exhide', 'requestApi', 'jquery', 'swalApi', 'directive/hcObjProp','directive/hcSplitterBox'],
    function (module, controllerApi, base_diy_page, openBizObj, promiseApi, zTreeApi, ztreeexhide, requestApi, $, swalApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {
                //树参数
                var setting1 = {
                    callback: {
                        onClick: zTreeOnClick1,
                    },
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pId",
                            rootPId: 0
                        }
                    },
                    view: {
                        showIcon: false
                    }
                }
                //左边树单击事件
                function zTreeOnClick1(event, ztree, node) {
                    $scope.zTree2.refresh();
                    // console.log('', node)
                    $scope.zTree2.hideNodes($scope.zTree2.getNodes());
                    var showNodes = $scope.zTree2.getNodesByParam("modid", node.id, null);
                    // console.log(showNodes)
                    $scope.zTree2.showNodes(showNodes);

                }
                //右边的树参数
                var setting2 = {
                    callback: {
                        onDblClick: zTreeOnClick2,
                    },
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pId",
                            rootPId: 0
                        }
                    },
                    view: {
                        showIcon: false
                    }
                }
                //右边树双击事件
                function zTreeOnClick2(event, ztree, node) {
                    console.log(node)
                    openBizObj({
                        stateName: 'baseman.base_menu_prop',
                        //给属性页传递参数
                        params: {
                            id: node.id,
                            modid: $scope.zTree1.getSelectedNodes()[0].id
                        }
                    });
                }

                //继承主控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                //获取树数据
                $scope.getdata1 = function () {
                    var def = $q.defer();
                    requestApi.post({
                        classId: "scpmod",
                        action: "search",
                        data: {
                            // menucode: '所有菜单',
                            // sqlwhere: 'MenuPId = 0'
                        }
                    }).then(function (result) {
                        // console.log("查询结果", result)
                        var zNodes1 = result.scpmods.map(function (data) {
                            return {
                                name: data.modname,
                                id: data.modid,
                                pId: data.modpid,
                                isParent: true,
                                data: data
                            };
                        });
                        def.resolve(zNodes1);
                    })
                    return def.promise;
                }
                $scope.getdata2 = function () {
                    var def = $q.defer();
                    requestApi.post({
                        classId: "scpmenu",
                        action: "search",
                        data: {}
                    }).then(function (result) {
                        console.log("查询结果", result)
                        var zNodes2 = result.menus.map(function (data) {
                            return {
                                name: data.menuname,
                                modid: data.modid,
                                id: data.menuid,
                                pId: data.menupid,
                                isParent: true,
                                isHidden: true,
                                data: data
                            };
                        });
                        def.resolve(zNodes2);
                    });
                    return def.promise;
                };
                //定义左边的树放入数据
                $scope.setdata1 = function (zNodes1) {
                    zNodes1.sort(function(a,b){
                        return Number(a.data.sortindex) - Number(b.data.sortindex);
                    });
                    var e = $("#zTree1");
                    $scope.zTree1 =  $.fn.zTree.init($("#zTree1"), setting1, zNodes1);
                    // $scope.zTree1.addNodes(null, zNodes1);
                }
                //定义右边的树放入数据
                $scope.setdata2 = function (zNodes2) {
                    zNodes2.sort(function(a,b){
                        return Number(a.data.sortindex) - Number(b.data.sortindex);
                    });
                    var e = $("#zTree2");
                    $scope.zTree2 = $.fn.zTree.init($("#zTree2"), setting2, zNodes2);
                    // $scope.zTree2.addNodes(null, zNodes2);
                }
                //加载
                $scope.doInit = function () {
                    return $scope.hcSuper.doInit()
                        .then($scope.getdata1)
                        .then($scope.setdata1)
                        .then($scope.getdata2)
                        .then($scope.setdata2);
                };
                //按钮定义
                $scope.toolButtons = {
                    refresh: {
                        title: '刷新',
                        icon: 'fa fa-refresh',
                        click: function () {
                            $scope.refresh && $scope.refresh();
                        }
                    },
                    delete: {
                        title: '删除',
                        icon: 'fa fa-minus',
                        click: function () {
                            $scope.delete && $scope.delete();
                        }
                    },
                    add: {
                        title: '新建菜单',
                        icon: 'fa fa-plus',
                        click: function () {
                            $scope.add && $scope.add();
                        }
                    }
                };

                //刷新
                $scope.refresh = function () {
                    $scope.getdata1().then(function(data){
                        data.sort(function (a, b) {
                            return Number(a.data.sortindex) - Number(b.data.sortindex);
                        })
                        $.fn.zTree.init($("#zTree1"), setting1, data);
                    });
                    $scope.getdata2().then(function(data){
                        data.sort(function (a, b) {
                            return Number(a.data.sortindex) - Number(b.data.sortindex);
                        })
                        $.fn.zTree.init($("#zTree2"), setting2, data);
                    });
                }
                //删除
                $scope.delete = function () {
                    if (!$scope.zTree2.getSelectedNodes()[0]) {
                        return swalApi.info('请先选中要删除的菜单').then($q.reject);
                    }
                    //判断是否有子菜单
                    var showNodes = $scope.zTree2.getNodesByParam("modid", $scope.zTree2.getSelectedNodes()[0].modid, null);
                    // console.log(showNodes);
                    showNodes.forEach(function (data) {
                        if ($scope.zTree2.getSelectedNodes()[0].id === data.pId) {
                            return swalApi.info('请删除该菜单下的子菜单').then($q.reject);
                        };

                    });
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除吗?",
                        okFun: function () {
                            //函数区域
                            requestApi.post("scpmenu", "delete", {
                                menuid: $scope.zTree2.getSelectedNodes()[0].id,
                                menuidpath: $scope.zTree2.getSelectedNodes()[0].data.menuidpath
                            }).then(function (data) {
                                $scope.zTree2.removeNode($scope.zTree2.getSelectedNodes()[0]);
                            });
                        },
                        okTitle: '删除成功'
                    });
                };
                //新建菜单
                $scope.add = function () {
                    if (!$scope.zTree1.getSelectedNodes()[0]) {
                        return swalApi.info('请先选中模块').then($q.reject);
                    }
                    var a ;
                    var b ;
                    if(!$scope.zTree2.getSelectedNodes()[0]){
                       a = "";
                       b = ""
                    }else{
                        a = $scope.zTree2.getSelectedNodes()[0].id;
                        b = $scope.zTree2.getSelectedNodes()[0].data.menuidpath;
                    }
                    openBizObj({
                        stateName: 'baseman.base_menu_prop',
                        //给属性页传递参数
                        params: {
                            id: 0,
                            modid: $scope.zTree1.getSelectedNodes()[0].id,
                            menuid:a,
                            menuidpath:b
                        }
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