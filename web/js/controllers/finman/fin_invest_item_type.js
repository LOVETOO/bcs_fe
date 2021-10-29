/**
 * 投资项目类型-列表页
 * date:2018-12-13
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'openBizObj', 'promiseApi', 'zTreeApi', 'requestApi', 'jquery', 'swalApi', 'directive/hcObjProp','directive/hcSplitterBox'],
    function (module, controllerApi, base_diy_page, openBizObj, promiseApi, zTreeApi, requestApi, $, swalApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {
                $scope.data = {}
                $scope.data.currItem = {}
                var setting = {
                    callback: {
                        // onClick: zTreeOnClick,
                        onClick: zTreeOnClick
                    },
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pId",
                            rootPId: 0
                        }
                    }
                };

                /**
                 * 节点点击事件;
                 * @param event
                 * @param treeId
                 * @param treeNode
                 */
                function zTreeOnClick(event, treeId, treeNode) {
                    // console.log(event,"treeId" ,treeId, "节点",treeNode)
                    $scope.data.currItem = treeNode.data;
                    $scope.currNode = treeNode;
                    $scope.parentNode = treeNode.getParentNode();
                }

                /**
                 * 发送请求获取树数据
                 */
                $scope.getdata = function () {
                    var def = $q.defer();
                    requestApi.post({
                        classId: "fin_investitem_type",
                        action: "search",
                        data: {}
                    }).then(function (result) {
                        // console.log("查询结果", result)
                        var zNodes = result.fin_investitem_types.map(function (data) {
                            return {
                                name: data.invitem_type,
                                id: data.invitem_type_id,
                                pId: data.pid,
                                isParent: true,
                                data: data
                            }
                        })
                        def.resolve(zNodes);
                    })

                    return def.promise;

                }
                /**
                 * 设置树数据
                 * @param zNodes
                 */
                $scope.setdata = function (zNodes) {
                    zNodes.sort(function (a, b) {
                        return Number(a.data.sortindex) - Number(b.data.sortindex)
                    })
                    var e = $("#zTree");
                    $scope.zTree = zTreeApi.create(e, setting)
                    // console.log("树", $scope.zTree)
                    $scope.zTree.addNodes(null, zNodes)
                }

                /**
                 * 增加树节点
                 * @param data
                 */
                function addNode(data, ParentNode) {
                    var node = {
                        name: data.invitem_type,
                        id: data.invitem_type_id,
                        pId: data.pid,
                        isParent: true,
                        data: data
                    };
                    $scope.zTree.addNodes(ParentNode, -1, node);
                }

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
                        title: '详情',
                        active: true
                    }
                };

                $scope.toolButtons = {
                    save: {
                        title: '保存',
                        icon: 'iconfont hc-save',
                        click: function () {
                            $scope.save && $scope.save();
                        }
                    },
                    refresh: {
                        title: '刷新',
                        icon: 'iconfont hc-refresh',
                        click: function () {
                            $scope.refresh && $scope.refresh();
                        }
                    },
                    delete: {
                        title: '删除',
                        icon: 'iconfont hc-delete',
                        click: function () {
                            $scope.delete && $scope.delete();
                        }
                    },
                    addSort: {
                        title: '新建大类',
                        icon: 'iconfont hc-add',
                        click: function () {
                            $scope.addSort && $scope.addSort();
                        }
                    },
                    addModule: {
                        title: '新建类型',
                        icon: 'iconfont hc-add',
                        click: function () {
                            $scope.addModule && $scope.addModule();
                        }
                    }
                };
                //刷新
                $scope.refresh = function () {
                    $scope.getdata().then(
                        function (data) {
                            data.sort(function (a, b) {
                                return Number(a.data.sortindex) - Number(b.data.sortindex)
                            })
                            $.fn.zTree.init($("#zTree"), setting, data);
                        }
                    )
                    $scope.data.currItem = {};
                }
                //保存
                $scope.save = function () {
                    if ($scope.data.currItem.invitem_type_id > 0) {
                        requestApi.post("fin_investitem_type", "update", $scope.data.currItem)
                            .then(function (data) {
                                if (parseInt($scope.data.currItem.class) == 1) {
                                    $scope.refresh();
                                } else {
                                    $scope.zTree.removeNode($scope.currNode);//移除节点;
                                    addNode(data, $scope.parentNode);//将修改后的节点加进去
                                }
                                return swalApi.success('保存成功').then($q.reject);
                            });
                    } else {
                        requestApi.post("fin_investitem_type", "insert", $scope.data.currItem)
                            .then(function (data) {
                                if (parseInt($scope.data.currItem.class) == 1) {
                                    $scope.refresh();
                                } else {
                                    $scope.data.currItem = data;
                                    addNode(data, $scope.currNode);//将新的节点加进去;
                                }
                                // $scope.data.currItem = {};
                                return swalApi.success('保存成功').then($q.reject);
                            });
                    }
                }
                //删除
                $scope.delete = function () {
                    var a = $scope.zTree.getSelectedNodes();
                    if (a.length == 0) {
                        return swalApi.info('请先选中节点').then($q.reject);
                    }
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除类别吗?",
                        okFun: function () {
                            //函数区域
                            requestApi.post("fin_investitem_type", "delete", {
                                invitem_type_id: $scope.data.currItem.invitem_type_id
                            }).then(function (data) {
                                if (parseInt($scope.data.currItem.class) == 1) {
                                    $scope.getdata().then($scope.setdata);
                                } else {
                                    $scope.zTree.removeNode($scope.currNode);//移除节点;
                                }
                                $scope.data.currItem = {};
                            });
                        },
                        okTitle: '删除成功'
                    });
                }
                //新建分类
                $scope.addSort = function () {
                    $scope.data.currItem = {};
                    $scope.data.currItem.isitem = 1;
                    $scope.data.currItem.flag = 2;
                    $scope.data.currItem.isws = 2;
                    $scope.data.currItem.class = 1;
                }
                //新建模块
                $scope.addModule = function () {
                    var a = $scope.zTree.getSelectedNodes();
                    // console.log("当前选中节点", a)
                    if (a.length == 0) {
                        if ($scope.zTree.getNodes().length == 0) {
                            return swalApi.info('请先创建大类').then($q.reject);
                        }
                        return swalApi.info('请先选中节点').then($q.reject);
                    }
                    $scope.data.currItem = {};
                    $scope.data.currItem.isitem = 2;
                    $scope.data.currItem.flag = 2;
                    $scope.data.currItem.isws = 2;
                    $scope.data.currItem.class = parseInt(a[0].data.class) + 1;
                    $scope.data.currItem.parentidpath = a[0].data.invitem_type_idpath;
                    $scope.data.currItem.pid = a[0].data.invitem_type_id;
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