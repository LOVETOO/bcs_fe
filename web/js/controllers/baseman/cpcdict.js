/**
 * 系统词汇
 * 2018-3-6 by mjl
 */
function scpdict($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
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
    $scope.class = [
        {id: 1, name: "系统内建"},
        {id: 2, name: "自定义"},
        {id: 3, name: "外部程序"},
        {id: 4, name: "WEB"},
        {id: 5, name: "WEB(AutoLogin)"},
        {id: 6, name: "WEB2(AutoLogin)"},
        {id: 7, name: "Chrome"},
    ];
    //显示方式
    $scope.showstyles = [
        {id: 1, name: "缺省"},
        {id: 2, name: "树形"},
        {id: 3, name: "混合"},
    ];
    //客户端类型
    $scope.modtypes = [
        {id: 1, name: "DELPHI"},
        {id: 2, name: "WEB"},
        {id: 3, name: "DELPHI&WEB"},
    ];
    /**
     * 加载工作区
     */
    $scope.searchws = function () {
        var postData = {};
        postData.dictcode = '所有分类';
        postData.sqlwhere = 'PId = 0';
        BasemanService.RequestPost("scpdict", "search", {})
            .then(function (data) {
                initTree(data);
            });
    }

    /**
     * 初始化 模块树
     */
    function initTree(data) {
        //初始化模块树
        zTreeNodes = [];
        $.each(data.scpdicts, function (i, item) {
            var itemNode = {};
            itemNode.name = item.dictname;
            itemNode.id = item.dictid;
            itemNode.pId = item.pid;
            itemNode.isParent = (item.isitem==1);
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
        $scope.data.currItem.usable = 2;
    }

    /**
     * 添加 - 词汇值
     */
    $scope.addValue = function () {
        if(typeof(currentNode) == "undefined" || currentNode.data.isitem == "2"){
            alert("请选择词汇分类");
            return;
        }
        $scope.initModal();
        $scope.data.currItem = {};
        $scope.data.currItem.isitem = 2;
        $scope.data.currItem.usable = 2;

    }

    /**
     * 编辑
     */
    function edit(treeNode) {
        $scope.initModal();
        var postData = {};
        postData.dictid = treeNode.id;
        BasemanService.RequestPost("scpdict", "select", JSON.stringify(postData))
            .then(function (data) {
                $scope.data.currItem = data;
                $scope.$digest();
            });
    };

    /**
     * 保存
     */
    $scope.save = function () {
        if ($scope.data.currItem.dictid > 0) {
            BasemanService.RequestPost("scpdict", "update", JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    BasemanService.notice("保存成功！", "alert-success");
                    $scope.data.currItem = {};
                });
        } else {
            $scope.data.currItem.usable = 2;
            if($scope.data.currItem.isitem == 2){
                $scope.data.currItem.pid = currentNode.id;
            }
            BasemanService.RequestPost("scpdict", "insert", JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    BasemanService.notice("保存成功！", "alert-success");
                    $scope.data.currItem = {};
                });
        }
    };

    /**
     * 删除
     */
    $scope.del = function () {
        if (confirm("确定要删除 " + currentNode.data.dictname + " 吗？")) {
            var postData = {}
            postData.dictid = currentNode.id;
            postData.idpath = currentNode.data.idpath;
            BasemanService.RequestPost("scpdict", "delete", postData)
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
angular.module('inspinia') .controller('scpdict', scpdict)