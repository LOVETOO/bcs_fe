/**
 * 模块定义
 * 2018-2-5 by mjl
 */
function sys_mod($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.data.currItem.isitem = 2;

    var zTreeObj;
    var zTreeNodes = [];
    var currentNode;
    var setting = {
        view: {
            selectedMulti: false,showIcon:false
        },
        callback: {
            onClick: zTreeOnClick,
            //beforeExpand: beforeExpand,
            onDblClick:zTreeOnDblClick,
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: 0
            }
        }
    }

    //模块类型
    $scope.class = [];
    //显示方式
    $scope.showstyles = [];
    //客户端类型
    $scope.modtypes = [];

    //词汇表模块类型取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "class"})
        .then(function (data) {
            $scope.class = data.dicts;
            //HczyCommon.stringPropToNum(data.dicts);
        });
    //词汇表显示方式取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "showstyles"})
        .then(function (data) {
            $scope.showstyles = data.dicts;
            //HczyCommon.stringPropToNum(data.dicts);
        });
    //词汇表客户端类型取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "modtypes"})
        .then(function (data) {
            $scope.modtypes = data.dicts;
            //HczyCommon.stringPropToNum(data.dicts);
        });
    /**
     * 加载工作区
     */
    $scope.searchws = function () {
        BasemanService.RequestPost("scpmod", "search", {})
            .then(function (data) {
                initModTree(data);
            });
    }

    /**
     * 初始化 模块树
     */
    function initModTree(data) {
        //初始化模块树
        zTreeNodes = [];
        $.each(data.scpmods, function (i, item) {
            var itemNode = {};
            itemNode.name = item.modname;
            itemNode.id = item.modid;
            itemNode.pId = item.modpid;
            itemNode.isParent = true;
            //itemNode.open = true;
            itemNode.data = item;
            zTreeNodes.push(itemNode);
        });
        zTreeObj = $.fn.zTree.init(angular.element("#tree"), setting, zTreeNodes);
    }

    /**
     * 刷新
     */
    $scope.refresh = function () {
        $scope.searchws();
        zTreeObj.refresh();
    }

    /**
     * 初始化 - Modal框tab页 - 把tab框显示到第一标签
     */
    $scope.initModal = function () {
        var tabs = $(".nav-tabs");
        if(tabs){
            $.each(tabs, function (i, tab) {
                var tabLis = $(tab).children("li");
                $.each(tabLis, function (i, li) {
                    $(li).removeClass("active");
                })
                $(tabLis.get(0)).addClass("active");
            })
        }
        var tabContents = $(".tab-content");
        if(tabContents){
            $.each(tabContents, function (i, tabContent) {
                var tabPanes = $(tabContent).children(".tab-pane");
                $.each(tabPanes, function (i, tabPane) {
                    $(tabPane).removeClass("active");
                })
                $(tabPanes.get(0)).addClass("active");
            })
        }
    }

    /**
     * 添加 - 分类
     */
    $scope.addCat = function () {
        $scope.initModal();
        $scope.data.currItem = {};
        $scope.data.currItem.isitem = 1;
        $scope.data.currItem.flag = 2;
        $scope.data.currItem.isws = 2;
        if(typeof(currentNode) == "undefined"){
            alert("请选择分类或模块！");
        }
    }

    /**
     * 添加 - 模块
     */
    $scope.addMod = function () {
        $scope.initModal();
        $scope.data.currItem = {};
        $scope.data.currItem.isitem = 2;
        $scope.data.currItem.flag = 2;
        $scope.data.currItem.isws = 2;
        $scope.data.currItem.modtype = 2;
        if(typeof(currentNode) == "undefined"){
            alert("请选择分类或模块");
        }
    }

    /**
     * 编辑
     */
    function edit(treeNode) {
        $scope.initModal();
        var postData = {};
        postData.modid = treeNode.id;
        BasemanService.RequestPost("scpmod", "select", JSON.stringify(postData))
            .then(function (data) {
                $scope.data.currItem = data;
                $scope.$digest();
            });
    };

    /**
     * 保存
     */
    $scope.save = function () {
        if ($scope.data.currItem.modid > 0) {
            BasemanService.RequestPost("scpmod", "update", JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    BasemanService.notice("保存成功！", "alert-success");
                });
        } else {
            $scope.data.currItem.flag = 2;
            $scope.data.currItem.modpid = currentNode.id;
            $scope.data.currItem.parentidpath = currentNode.data.modidpath;
            BasemanService.RequestPost("scpmod", "insert", JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    BasemanService.notice("保存成功！", "alert-success");
                });
        }
    };

    /**
     * 删除
     */
    $scope.del = function () {
        if (confirm("确定要删除 " + currentNode.data.modname + " 吗？")) {
            var postData = {
                "modid": currentNode.data.modid,
            }
            BasemanService.RequestPost("scpmod", "delete", postData)
                .then(function (data) {
                    zTreeObj.removeNode(zTreeObj.getSelectedNodes()[0]);
                    $scope.data.currItem = {};
                    BasemanService.notice("操作成功！", "alert-success");
                });
        }
    };

    /**
     * 树单击事件
     */
    function zTreeOnClick(event, treeId, treeNode) {
        currentNode = treeNode;
    };

    /**
     * 树双击事件
     */
    function zTreeOnDblClick(event, treeId, treeNode) {
        currentNode = treeNode;
        //zTreeObj.expandNode(treeNode,true);
        edit(treeNode);
    };

    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();
}
//注册控制器
angular.module('inspinia') .controller('sys_mod', sys_mod)