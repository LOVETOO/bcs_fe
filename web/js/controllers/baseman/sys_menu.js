/**
 * 菜单定义
 * 2018-2-6 by mjl
 */
function sys_menu($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};

    var menuZTreeObj ;//菜单树对象
    var zTreeObj;//模块树对象
    var zTreeNodes = [];
    var currentNode;//当前选中节点 - 模块
    var currentMenuNode;//当前选中节点 - 菜单
    //模块树-设置参数
    var setting = {
        view: {
            selectedMulti: false,showIcon:false
        },
        callback: {
            onClick: zTreeOnClick,
            //beforeExpand: beforeExpand,
            //onDblClick:zTreeOnDblClick,
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
    //菜单树-设置参数
    var menuSetting = {
        view: {
            selectedMulti: false,showIcon:false
        },
        callback: {
            onClick: menuZTreeOnClick,
            onDblClick:menuZTreeOnDblClick,
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
    //类型
    $scope.class = [];
    //窗体类型
    $scope.formstyles = [];
    //客户端类型
    //$scope.menutypes = [];
    //关联对象类型
    $scope.objtypes = [];

    //词汇表模块类型取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "class"})
        .then(function (data) {
            $scope.class = data.dicts;
            //HczyCommon.stringPropToNum(data.dicts);
        });
    //词汇表窗体类型取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "formstyles"})
        .then(function (data) {
            $scope.formstyles = data.dicts;
            //HczyCommon.stringPropToNum(data.dicts);
        });
    //词汇表关联对象取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "objtypes"})
        .then(function (data) {
            $scope.objtypes = data.dicts;
            //HczyCommon.stringPropToNum(data.dicts);
        });

    /**
     * 加载工作区
     */
    $scope.searchws = function () {
        var postData = {};
        BasemanService.RequestPost("scpmod", "datapoolmod", postData)
            .then(function (data) {
                initModTree(data);
            });
        postData = {};
        postData.menucode = '所有菜单';
        postData.sqlwhere = 'MenuPId = 0';
        BasemanService.RequestPost("scpmenu", "search", {})
            .then(function (data) {
                initMenuTree(data);
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
     * 初始化 菜单树
     */
    function initMenuTree(data) {
        // 初始化 菜单树
        zTreeNodes = [];
        $.each(data.scpmenus, function (i, menu) {
            var itemNode = {};
            itemNode.name = menu.menuname;
            itemNode.id = menu.menuid;
            itemNode.pId = menu.menupid;
            itemNode.modid = menu.modid;
            itemNode.isParent = true;
            itemNode.isHidden = true;
            //itemNode.open = true;
            itemNode.data = menu;
            zTreeNodes.push(itemNode);
        });
        menuZTreeObj = $.fn.zTree.init(angular.element("#menuTree"), menuSetting, zTreeNodes);
    }

    /**
     * 菜单树 显示
     */
    function show_menu_tree(treeNode) {
        menuZTreeObj.hideNodes(menuZTreeObj.getNodes());
        var currMenuNodes = menuZTreeObj.getNodesByParam("modid", treeNode.id, null);
        menuZTreeObj.showNodes(currMenuNodes);
    }

    /**
     * 刷新
     */
    $scope.refresh = function () {
        $scope.searchws();
        zTreeObj.refresh();
        menuZTreeObj.refresh();
        currentNode = undefined;
        currentMenuNode = undefined;//当前选中节点 - 菜单
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
     * 添加
     */
    $scope.add = function () {
        if(typeof(currentNode) == "undefined") {
            alert("请选择模块！");
            return;
        }
        $scope.initModal();
        $scope.data.currItem = {};
        $scope.data.currItem.flag = 2;
        $scope.data.currItem.menutype = 2;
        $scope.data.currItem.modname = currentNode.data.modname;
        /*if(typeof(currentMenuNode) == "undefined"){
            alert("请选择菜单！");
            return;
        }*/
        $("#attributeModal").modal();
    }

    /**
     * 编辑
     */
    function edit(treeNode) {
        $scope.initModal();
        var postData = {};
        postData.menuid = treeNode.id;
        BasemanService.RequestPost("scpmenu", "select", JSON.stringify(postData))
            .then(function (data) {
                $scope.data.currItem = data;
                $("#attributeModal").modal();
            });
    };

    /**
     * 保存
     */
    $scope.save = function () {
        if ($scope.data.currItem.menuid > 0) {
            BasemanService.RequestPost("scpmenu", "update", JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    BasemanService.notice("保存成功！", "alert-success");
                });
        } else {
            $scope.data.currItem.modid = currentNode.id;
            if(typeof(currentMenuNode) != "undefined"){
                $scope.data.currItem.menupid = currentMenuNode.id;
                $scope.data.currItem.parentidpath = currentMenuNode.data.menuidpath;
            }
            $scope.data.currItem.sysbuiltinobj = 1;
            $scope.data.currItem.usemenupass = 1;
            BasemanService.RequestPost("scpmenu", "insert", JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    //插入节点
                    zTreeNodes = [];
                    var itemNode = {};
                    itemNode.name = data.menuname;
                    itemNode.id = data.menuid;
                    itemNode.pId = data.parentid;
                    itemNode.modid = data.modid;
                    itemNode.isParent = true;
                    itemNode.data = data;
                    zTreeNodes.push(itemNode);
                    if(typeof(currentMenuNode) != "undefined"){
                        menuZTreeObj.addNodes(currentMenuNode, zTreeNodes);
                        menuZTreeObj.expandNode(currentMenuNode,true)
                    }else{
                        menuZTreeObj.addNodes(null, zTreeNodes);
                    }
                    BasemanService.notice("保存成功！", "alert-success");
                });
        }
    };

    /**
     * 删除
     */
    $scope.del = function () {
        if (confirm("确定要删除 " + currentMenuNode.data.menuname + " 吗？")) {
            var postData = {}
            postData.menuid = currentMenuNode.id;
            postData.menuidpath = currentMenuNode.data.menuidpath;
            BasemanService.RequestPost("scpmenu", "delete", postData)
                .then(function () {
                    menuZTreeObj.removeNode(menuZTreeObj.getSelectedNodes()[0]);
                    BasemanService.notice("操作成功！", "alert-success");
                });
        }
    };

    /**
     * 树单击事件 - 模块树
     */
    function zTreeOnClick(event, treeId, treeNode) {
        currentNode = treeNode;
        show_menu_tree(treeNode);
    };

    /**
     * 树单击事件 - 菜单树
     */
    function menuZTreeOnClick(event, treeId, treeNode) {
        currentMenuNode = treeNode;
    };

    /**
     * 树双击事件 - 菜单树
     */
    function menuZTreeOnDblClick(event, treeId, treeNode) {
        currentMenuNode = treeNode;
        edit(treeNode);
    };

    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();
}
//注册控制器
angular.module('inspinia') .controller('sys_menu', sys_menu)