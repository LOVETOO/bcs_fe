/**
 * 流程管理
 * 2018-1-25 by mjl
 */
function base_flow($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.data.url = '';
    $scope.headername = "流程管理";

    var zTreeObj;
    var zTreeNodes = [];
    var zTreeNode = {};
    $scope.currentNode;
    var setting = {
        view: {
            selectedMulti: false, showIcon: false
        },
        callback: {
            onClick: zTreeOnClick,
            beforeExpand: beforeExpand,
        }
    }
    //添加按钮
    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button>" +
            "<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };

    //网格设置
    $scope.headerOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
        //onClick:dgOnClick
    };
    //定义网格字段
    $scope.headerColumns = [
        {
            id: "seq",
            name: "序号",
            field: "seq",
            behavior: "select",
            cssClass: "cell-selection",
            width: 45,
            cannotTriggerInsert: true,
            resizable: false,
            selectable: false,
            focusable: false
        },
        {
            id: "wftempname",
            name: "名称",
            behavior: "select",
            field: "wftempname",
            editable: false,
            filter: 'set',
            width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            id: "createtime",
            name: "时间",
            behavior: "select",
            field: "createtime",
            editable: false,
            filter: 'set',
            width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            name: "操作",
            editable: false,
            width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: editHeaderButtons
        }
    ];
    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGrid", [], $scope.headerColumns, $scope.headerOptions);
    //主表清单绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    //双击事件
    $scope.headerGridView.onDblClick.subscribe(function (e, args) {
        edit(args)
    });

    /**
     * 事件判断
     */
    function dgOnClick(e, args) {
        if ($(e.target).hasClass("viewbtn")) {
            edit(args);
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            del(args);
            e.stopImmediatePropagation();
        }
    };

    /**
     * 加载工作区
     */
    $scope.init_Tree = function () {
        var wsobj = {
            "wsid": -19,
            "wstag": -19,
            "excluderight": 1,
            "wsright": "00000000000000000000FFFF000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        }
        BasemanService.RequestPost("scpworkspace", "selectref", wsobj).then(function (data) {
            zTreeObj = $.fn.zTree.init(angular.element("#tree"), setting, []);
            //生成树节点
            zTreeNodes = [];
            var itemNode = {};
            itemNode.name = data.fdrs[0].fdrname;
            itemNode.id = data.fdrs[0].fdrid;
            itemNode.isParent = true;
            itemNode.isLoadChilded = false;
            itemNode.data = data.fdrs[0];
            $scope.currentNode = itemNode;
            zTreeNodes.push(itemNode);
            zTreeObj.addNodes(null, zTreeNodes);
            //加载网格数据
            var param = {
                "fdrid": data.fdrs[0].fdrid
            }
            BasemanService.RequestPost("scpfdr", "selectref", param).then(function (data) {
                setGridData($scope.headerGridView, data.wftemps);
            });
            //1级
            $.each(zTreeNodes, function (i, item) {
                var treeNode = zTreeObj.getNodeByParam("id", item.id);
                var param = {
                    "fdrid": treeNode.id,
                }
                BasemanService.RequestPost("scpfdr", "selectref", param)
                    .then(function (data) {
                        //添加节点
                        zTreeNodes = [];
                        $.each(data.fdrs, function (i, item) {
                            var itemNode = {};
                            itemNode.name = item.fdrname;
                            itemNode.id = item.fdrid;
                            itemNode.isParent = true;
                            itemNode.isLoadChilded = false;
                            itemNode.data = item;
                            zTreeNodes.push(itemNode);
                        });
                        zTreeObj.addNodes(treeNode, zTreeNodes);
                        //标记为已加载数据
                        treeNode.isLoadChilded = true;
                        zTreeObj.updateNode($scope.currentNode);
                        //2级
                        $.each(zTreeNodes, function (i, item) {
                            var treeNode = zTreeObj.getNodeByParam("id", item.id);
                            var param = {
                                "fdrid": treeNode.id,
                            }
                            BasemanService.RequestPost("scpfdr", "selectref", param)
                                .then(function (data) {
                                    //添加节点
                                    zTreeNodes = [];
                                    $.each(data.fdrs, function (i, item) {
                                        var itemNode = {};
                                        itemNode.name = item.fdrname;
                                        itemNode.id = item.fdrid;
                                        itemNode.isParent = true;
                                        itemNode.isLoadChilded = false;
                                        itemNode.data = item;
                                        zTreeNodes.push(itemNode);
                                    });
                                    zTreeObj.addNodes(treeNode, zTreeNodes);
                                    //标记为已加载数据
                                    treeNode.isLoadChilded = true;
                                    zTreeObj.updateNode($scope.currentNode);
                                });
                        });
                    });
            });
        });
    }

    /**
     * 刷新
     */
    $scope.refresh = function () {
        $scope.init_Tree();
        zTreeObj.refresh();
    }

    /**
     * 加载网格数据
     */
    function setGridData(gridView, datas) {
        gridView.setData([]);
        //加序号
        if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                datas[i].seq = i + 1;
            }
        }
        //设置数据
        gridView.setData(datas);
        //重绘网格
        gridView.render();
    }

    /**
     * 机构数据加载  ztree
     */
    function load_tree(treeNode) {
        var param = {
            "fdrid": treeNode.id,
        }
        BasemanService.RequestPost("scpfdr", "selectref", param).then(function (data) {
            //列表加载
            setGridData($scope.headerGridView, data.wftemps);
            zTreeObj.expandNode($scope.currentNode, true, false, false);
            if (!$scope.currentNode.isLoadChilded) {
                zTreeNodes = [];
                $.each(data.fdrs, function (i, item) {
                    var itemNode = {};
                    itemNode.name = item.fdrname;
                    itemNode.id = item.fdrid;
                    itemNode.isParent = true;
                    itemNode.data = item;
                    zTreeNodes.push(itemNode);
                });
                zTreeObj.removeChildNodes($scope.currentNode);
                zTreeObj.addNodes($scope.currentNode, zTreeNodes);
                //标记为已加载数据
                $scope.currentNode.isLoadChilded = true;
                zTreeObj.updateNode($scope.currentNode);
            }
        });
    }

    /**
     * 添加
     */
    $scope.add = function () {
        $scope.data.currItem = {};
        setGridData($scope.lineGridView, [])
    }

    /**
     * 编辑
     */
    function edit(args) {
        var postData = {};
        postData.wftempid = args.grid.getDataItem(args.row).wftempid;
        BasemanService.RequestPost("scpwftemp", "select", JSON.stringify(postData))
            .then(function (data) {
                $scope.data.currItem = data;
                //初始化frame
                //$scope.data.url = '/index.jsp#/crmman/wfform/' + $scope.data.currItem.wftempid + '/';
                angular.element('#iframepage').attr('src', '/web/index.jsp?t='+(new Date()).getTime()+'#/crmman/wfform/' + $scope.data.currItem.wftempid + '/?showmode=2&t=' + (new Date().getTime()));
                $("#myModal5").modal();
            });
    };

    /**
     * 保存
     */
    $scope.save = function () {
        if ($scope.data.currItem.wftempid > 0) {
            BasemanService.RequestPost("scpwftemp", "update", JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    load_tree();
                    BasemanService.notice("保存成功！", "alert-success");
                });
        } else {
            $scope.data.currItem.orgid = $scope.currentNode.id;
            BasemanService.RequestPost("scpwftemp", "insert", JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    load_tree();
                    BasemanService.notice("保存成功！", "alert-success");//warning
                });
        }
    };

    /**
     * 新建流程模版
     */
    $scope.newwftemp = function () {
        if ($scope.currentNode) {
            angular.element('#iframepage').attr('src', '/web/index.jsp?t='+(new Date()).getTime()+'#/crmman/wfform//' + $scope.currentNode.data.fdrid + '?showmode=2&t=' + (new Date().getTime()));
            $("#myModal5").modal();
        }
    };

    /**
     * 删除
     */
    function del(args) {
        var dg = $scope.headerGridView;
        var rowidx = args.row;
        var postData = {};
        postData.wftempid = args.grid.getDataItem(args.row).wftempid;
        postData.objaccess = args.grid.getDataItem(args.row).objaccess;
        postData.idpath = args.grid.getDataItem(args.row).idpath;
        postData.typepath = args.grid.getDataItem(args.row).typepath;
        //<parentid>-19\2044\2045\2071 <parenttype>1\2\2\2
        var idpth = args.grid.getDataItem(args.row).idpath.substr(0,args.grid.getDataItem(args.row).idpath.length-1);
        var typth = args.grid.getDataItem(args.row).typepath.substr(0,args.grid.getDataItem(args.row).typepath.length-1);

        postData.parentid = idpth.substring(0,idpth.lastIndexOf("\\"));
        postData.parenttype = typth.substring(0,typth.lastIndexOf("\\"));

        var name = args.grid.getDataItem(args.row).wftempname;
        if (confirm("确定要删除对象 " + name + " 吗？")) {
            //删除数据成功后再删除网格数据
            BasemanService.RequestPost("scpwftemp", "delete", JSON.stringify(postData))
                .then(function (data) {
                    dg.getData().splice(rowidx, 1);
                    dg.invalidateAllRows();
                    dg.render();
                    BasemanService.notice("删除成功！", "alert-success");//warning
                });
        }
    };

    /**
     * 树单击事件
     */
    function zTreeOnClick(event, treeId, treeNode) {
        $scope.currentNode = treeNode
        load_tree(treeNode);
    };

    /**
     * 展开树节点-数据加载
     */
    function beforeExpand(treeId, treeNode) {
        if (treeNode.isLoadChilded) {
            return;
        }
        var param = {
            "fdrid": treeNode.id
        }
        BasemanService.RequestPost("scpfdr", "selectref", param)
            .then(function (data) {
                //添加节点
                zTreeNodes = [];
                $.each(data.fdrs, function (i, item) {
                    var itemNode = {};
                    itemNode.name = item.fdrname;
                    itemNode.id = item.fdrid;
                    itemNode.isParent = true;
                    itemNode.isLoadChilded = false;
                    itemNode.data = item;
                    zTreeNodes.push(itemNode);
                });
                zTreeObj.removeChildNodes(treeNode);
                zTreeObj.addNodes(treeNode, zTreeNodes);
                //标记为已加载数据
                treeNode.isLoadChilded = true;
                zTreeObj.updateNode($scope.currentNode);
            });
    }

    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();

    //添加关闭窗体方法
    $scope.closeModalForm = function () {
        $("#myModal5").modal("hide");
    }

    //把关闭事件绑定到window对象上，以便弹出窗体调用
    window.closeModal = $scope.closeModalForm;

    BasemanService.ReadonlyGrid($scope.headerGridView);


    /**
     * 拖拽模态框
     */
    $("#myModal5>.modal-dialog").resizable({
        distance: 0,
        minHeight:440,
        minWidth:800
    });
    $("#myModal5>.modal-dialog").resize(function() {
        var mH = $(this).height();
        var mW = $(this).width();
        $(this).children(".modal-content").css({"height":mH,"width":mW});
        var mhH = $(this).children().children(".modal-header").outerHeight(true);
        // $(this).children().children(".modal-bodys").css("height",mH - mhH);
        $(this).children().children().children("iframe").css("height",mH - mhH);
    });
    //全屏
    $(".modmax").click(function () {
        var windowH = $(window).height();
        var tittleH = $(this).parent().height() + 11;
        var mod = $(this).parent().next();
        var modW = $(this).parents(".modal-dialog");
        $(this).children(".fa-expand").toggleClass("fa-compress");
        modW.toggleClass("bigmax");
        if (modW.hasClass("bigmax")) {
            mod.height(windowH - tittleH);
        }
        else {
            mod.removeAttr("style")
        }
    })
    $(".modal_lgmax .modal-header").dblclick(function () {
        var windowH = $(window).height();
        var tittleH = $(this).height() + 11;
        var mod = $(this).next();
        var modW = $(this).parents(".modal-dialog");
        $(this).find(".fa-expand").toggleClass("fa-compress");
        modW.toggleClass("bigmax");
        if (modW.hasClass("bigmax")) {
            mod.height(windowH - tittleH);
        }
        else {
            mod.removeAttr("style");
        }
    })
}

//注册控制器
angular.module('inspinia')
    .controller('base_flow', base_flow)