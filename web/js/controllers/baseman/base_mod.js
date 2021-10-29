/**
 * 模块定义
 *  2018-11-12
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'openBizObj', 'promiseApi', 'zTreeApi', 'requestApi', 'jquery', 'swalApi', 'fileApi','iconApi', 'directive/hcObjProp', 'directive/hcSplitterBox', 'fileApi'],
    function (module, controllerApi, base_diy_page, openBizObj, promiseApi, zTreeApi, requestApi, $, swalApi, fileApi,iconApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            // 'BasemanService',
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {
                $scope.data = {}
                $scope.data.currItem = {}
                $scope.data.bool = false
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

                function zTreeOnClick(event, treeId, treeNode) {
                    // console.log(event,"treeId" ,treeId, "节点",treeNode)
                    $scope.data.currItem = treeNode.data;
                    console.log($scope.data.currItem.docid);
                    if ($scope.data.currItem.docid == "0") {
                        $(".invoice_div_img").css("display", "none");
                        $scope.data.bool = false;
                    } else {
                        promiseApi.whenTrue(function () {
                            return $(".invoice_div_img").length > 0
                        }, 200).then(function () {
                            $(".invoice_div_img").css("display", "block");
                            $(".invoice_div_img").css("height", "98px");
                            $scope.data.bool = true;
                        });
                    }
                }

                //获取树数据
                $scope.getdata = function () {
                    var def = $q.defer();
                    requestApi.post({
                        classId: "scpmod",
                        action: "search",
                        data: {}
                    }).then(function (result) {
                        // console.log("查询结果", result)
                        var zNodes = result.scpmods.map(function (data) {
                            return {
                                name: data.modname,
                                id: data.modid,
                                pId: data.modpid,
                                isParent: true,
                                data: data
                            }
                        })
                        def.resolve(zNodes);
                    })

                    return def.promise;

                }
                $scope.setdata = function (zNodes) {
                    zNodes.sort(function (a, b) {
                        return Number(a.data.sortindex) - Number(b.data.sortindex)
                    })
                    var e = $("#zTree")
                    $scope.zTree = zTreeApi.create(e, setting)
                    // console.log("树", $scope.zTree)
                    $scope.zTree.addNodes(null, zNodes)
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
                // 选择图标
                $scope.chooseIcon = function () {
                    iconApi.chooseIcon().then(function (icon) {
                        $scope.data.currItem.webimageurl = icon.class;
                    });
                }
                //上传图片
                $scope.uploadFile = function () {
                    fileApi.uploadFile({
                        multiple: false,
                        accept: 'image/*'
                    }).then(function (docs) {
                        if (docs[0].oldsize / 1024 / 1024 > 1) {
                            swalApi.error('图标大小不能超过1M，请重新上传');
                            return;
                        }
                        $scope.data.currItem.docid = docs[0].docid;
                        promiseApi.whenTrue(function () {
                            return $(".invoice_div_img").length > 0
                        }, 200).then(function () {
                            $(".invoice_div_img").css("height", "98px");
                            $(".invoice_div_img").css("display", "block");
                            $scope.data.bool = true;
                        });
                    });
                }

                //移除图片
                $scope.del_invoice_image = function () {
                    $scope.data.currItem.docid = undefined;
                    $(".invoice_div_img").css("display", "none");
                    $scope.data.bool = false;
                }
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
                    addSort: {
                        title: '新建分类',
                        icon: 'fa fa-plus',
                        click: function () {
                            $scope.addSort && $scope.addSort();
                        }
                    },
                    addModule: {
                        title: '新建模块',
                        icon: 'fa fa-plus',
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
                            $(".invoice_div_img").css("display", "none");
                            $scope.data.bool = false;
                        }
                    )
                    $scope.data.currItem = {};
                }
                //保存
                $scope.save = function () {
                    if ($scope.data.currItem.modid > 0) {
                        requestApi.post("scpmod", "update", $scope.data.currItem)
                            .then(function (data) {
                                // $scope.refresh();
                                return swalApi.success('保存成功').then($q.reject);
                            });
                    } else {
                        if ($scope.data.currItem.modtype == null || $scope.data.currItem.modtype == "") {
                            return swalApi.info('请指定添加分类还是模块').then($q.reject);
                        }
                        requestApi.post("scpmod", "insert", $scope.data.currItem)
                            .then(function (data) {
                                $scope.refresh();
                                // $scope.data.currItem = {};
                                return swalApi.success('保存成功').then($q.reject);
                            });
                    }
                }
                //删除
                $scope.delete = function () {
                    var a = $scope.zTree.getSelectedNodes()
                    if (a.length == 0) {
                        return swalApi.info('请先选中节点').then($q.reject);
                    }
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除类别吗?",
                        okFun: function () {
                            //函数区域
                            requestApi.post("scpmod", "delete", {
                                modid: $scope.data.currItem.modid
                            }).then(function (data) {
                                $scope.getdata().then($scope.setdata)
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
                    $scope.data.currItem.modtype = 2;
                    $scope.data.currItem.clas = 2;
                }
                //新建模块
                $scope.addModule = function () {
                    var a = $scope.zTree.getSelectedNodes()
                    // console.log("当前选中节点", a)
                    if (a.length == 0) {
                        return swalApi.info('请先选中节点').then($q.reject);
                    }
                    $scope.data.currItem = {};
                    $scope.data.currItem.isitem = 2;
                    $scope.data.currItem.flag = 2;
                    $scope.data.currItem.isws = 2;
                    $scope.data.currItem.modtype = 2;
                    $scope.data.currItem.clas = 2;
                    $scope.data.currItem.parentidpath = a[0].data.modidpath;
                    $scope.data.currItem.modpid = a[0].data.modid;
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