/**
 * APP模块定义
 *  2019-10-14
 *  hjx
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'openBizObj', 'promiseApi', 'zTreeApi', 'requestApi', 'jquery', 'swalApi', 'fileApi', 'iconApi', 'directive/hcObjProp', 'fileApi'],
    function (module, controllerApi, base_diy_page, openBizObj, promiseApi, zTreeApi, requestApi, $, swalApi, fileApi, iconApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$q', '$timeout',
            //控制器函数
            function ($scope, $q, $timeout) {
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.data.bool = false;
                var setting = {
                    callback: {
                        onClick: zTreeOnClick
                    },
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pid",
                            rootPId: 0
                        }
                    }
                };

                function zTreeOnClick(event, treeId, treeNode) {
                    $scope.data.currItem = treeNode.data;
                    $scope.currNode = treeNode;
                    $scope.parentNode = treeNode.getParentNode();
                }

                /**
                 * 增加树节点
                 * @param data
                 */
                function addNode(data, ParentNode) {
                    var node = {
                        name: data.menuname,
                        id: data.appmenuid,
                        pid: data.pid,
                        isParent: true,
                        data: data
                    };
                    var t = $scope.zTree.addNodes(ParentNode, -1, node);
                    console.log("t" + t)
                }

                //获取树数据
                $scope.getdata = function () {
                    var def = $q.defer();
                    requestApi.post({
                        classId: "scpappmenu",
                        action: "search",
                        data: {}
                    }).then(function (result) {
                        console.log("查询结果", result);
                        if (result.scpappmenus.length > 0) {
                            var zNodes = result.scpappmenus.map(function (data) {
                                return {
                                    name: data.menuname,
                                    id: data.appmenuid,
                                    pid: data.pid,
                                    isParent: true,
                                    data: data
                                }
                            });
                        } else {
                            var zNodes = [{
                                name: '',
                                id: 0,
                                pid: 0,
                                isParent: true,
                                data: {}
                            }]
                        }
                        zNodes.push({
                            name: 'app菜单',
                            id: 0,
                            pid: 0,
                            isParent: true,
                            data: {}
                        })
                        def.resolve(zNodes);
                    });

                    return def.promise;

                };
                $scope.setdata = function (zNodes) {
                    zNodes.sort(function (a, b) {
                        return Number(a.data.seq) - Number(b.data.seq)
                    });
                    var e = $("#zTree");
                    $scope.zTree = zTreeApi.create(e, setting);
                    console.log("树", $scope.zTree);
                    $scope.zTree.addNodes(null, zNodes);

                    var menuNodes = $scope.zTree.getNodes(); //这个方法只是取得了根节点的子节点
                    menuNodes = $scope.zTree.transformToArray(menuNodes); //再用这个方法才能得到所有的节点
                    for (var i = 0; i < menuNodes.length; i++) {
                        $scope.zTree.expandNode(menuNodes[i], true);
                    }
                    $scope.zTree.showNodes(menuNodes);
                    $scope.zTree.selectNode($scope.zTree.getNodes()[0]);//选中节点
                    $scope.data.currItem = $scope.zTree.getNodes()[0].data;
                };

                //继承主控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });
                //等页面加载完成后再执行
                $scope.doInit = function () {
                    return $scope.hcSuper.doInit()
                        .then($scope.getdata)
                        .then($scope.setdata)
                };

                //标签名称
                $scope.tabs = {
                    'base': {
                        title: '常规',
                        active: true
                    },
                    'other': {
                        title: '其他'
                    }
                };

                $scope.toolButtons = {
                    save: {
                        title: '保存',
                        icon: 'fa fa-save',
                        click: function () {
                            $scope.save && $scope.save();
                        }
                    },
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
                    addModule: {
                        title: '新建菜单',
                        icon: 'fa fa-plus',
                        click: function () {
                            $scope.addModule && $scope.addModule();
                        }
                    }
                    /*addSort: {
                        title: '新建分类',
                        icon: 'fa fa-plus',
                        click: function () {
                            $scope.addSort && $scope.addSort();
                        }
                    },*/
                };
                //刷新
                $scope.refresh = function () {
                    $scope.getdata().then(
                        function (data) {
                            data.sort(function (a, b) {
                                return Number(a.data.seq) - Number(b.data.seq)
                            });
                            $.fn.zTree.init($("#zTree"), setting, data);
                            $scope.data.bool = false;
                            var menuNodes = $scope.zTree.getNodes(); //这个方法只是取得了根节点的子节点
                            menuNodes = $scope.zTree.transformToArray(menuNodes); //再用这个方法才能得到所有的节点
                            for (var i = 0; i < menuNodes.length; i++) {
                                $scope.zTree.expandNode(menuNodes[i], true);
                            }
                            $scope.zTree.showNodes(menuNodes);
                            $scope.zTree.selectNode($scope.zTree.getNodes()[0]);//选中节点
                            $scope.data.currItem = $scope.zTree.getNodes()[0].data;
                        }
                    );
                };

                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    return invalidBox;
                };

                //保存
                $scope.save = function () {
                    if($scope.data.currItem.menucode == undefined){
                        swalApi.info('菜单编码不能为空');
                        return;
                    }
                    if($scope.data.currItem.menuname == undefined){
                        swalApi.info('菜单名称不能为空');
                        return;
                    }
                    if ($scope.data.currItem.appmenuid > 0) {
                        requestApi.post("scpappmenu", "update", $scope.data.currItem)
                            .then(function (data) {
                                $scope.zTree.removeNode($scope.currNode);//移除节点;
                                addNode(data, $scope.parentNode);//将修改后的节点加进去
                                if ($scope.zTree.getNodes().length < 3) {
                                    $scope.refresh();
                                }
                                $scope.zTree.selectNode($scope.currNode);
                                return swalApi.success('保存成功').then($q.reject);
                            });
                    } else {
                        requestApi.post("scpappmenu", "insert", $scope.data.currItem)
                            .then(function (data) {
                                if (parseInt($scope.data.currItem.class) == 1) {
                                    $scope.refresh();
                                } else {
                                    $scope.data.currItem = data;
                                    addNode(data, $scope.currNode);//将新的节点加进去;
                                    $scope.zTree.selectNode($scope.currNode);
                                    if ($scope.zTree.getNodes().length < 3) {
                                        $scope.refresh();
                                    }
                                }
                                return swalApi.success('保存成功').then($q.reject);
                            });
                    }
                };


                //删除
                $scope.delete = function () {
                    var a = $scope.zTree.getSelectedNodes();
                    var menuNodes = $scope.zTree.getNodes(); //这个方法只是取得了根节点的子节点
                    menuNodes = $scope.zTree.transformToArray(menuNodes); //再用这个方法才能得到所有的节点
                    if (menuNodes.length < 2) {
                        return swalApi.info('已达到最顶层！').then($q.reject);
                    }
                    if (a.length == 0) {
                        return swalApi.info('请先选中菜单').then($q.reject);
                    }

                    var showNodes = $scope.zTree.getNodesByParam("id", $scope.zTree.getSelectedNodes()[0].id, null);
                    if (showNodes[0].children != undefined && showNodes[0].children.length > 0) {
                        return swalApi.info('请删除该菜单下的子菜单').then($q.reject);
                    }
                    console.log("getSelectedNodes+" + $scope.zTree.getSelectedNodes()[0].id);
                    console.log("showNodes+" + showNodes);

                    return swalApi.confirmThenSuccess({
                        title: "确定要删除菜单吗?",
                        okFun: function () {
                            //函数区域
                            requestApi.post("scpappmenu", "delete", {
                                appmenuid: $scope.data.currItem.appmenuid
                            }).then(function (data) {
                                $scope.getdata().then($scope.setdata);
                                $scope.data.currItem = {};
                                $scope.refresh();
                            });

                        },
                        okTitle: '删除成功'
                    });
                };

                //新建模块
                $scope.addModule = function () {
                    var a = $scope.zTree.getSelectedNodes();
                    if (a.length == 0) {
                        $scope.data.currItem = {};
                        $scope.data.currItem.pid = 0;
                    } else {
                        $scope.data.currItem = {};
                        $scope.data.currItem.pid = a[0].data.appmenuid;
                    }
                };
                /*$scope.addSort = function () {
                    $scope.data.currItem = {};
                    $scope.data.currItem.pid = 0;
                }*/


            }
        ]
            ;
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);