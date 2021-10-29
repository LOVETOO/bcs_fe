/**
 * 机构用户管理
 * 2018-1-25 by mjl
 * modify by wzf 2018-09-28
 */
define(
    ['module', 'controllerApi'],
    function (module, controllerApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', 'BasemanService', 'BaseService', 'Magic', '$q',
            //控制器函数
            function ($scope, BasemanService, BaseService, Magic, $q) {
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.data.currTreeItem = {};
                //获取登录用户数据
                var userbean = window.userbean;
                //是否有组织管理权限-增删改
                // $scope.isOrgAdmin =
                //     (('admin'== userbean.userid) || ('sysorgadmins' == userbean.userid) || ('suborgadmins' == userbean.userid))?true:false;
                $scope.role = window.userbean.stringofrole.indexOf("admins");

                //机构类型
                $scope.OrgType = [];
                //员工类型
                $scope.usertype = [];
                //通用词汇查询
                BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "org_type"})
                    .then(function (data) {
                        var dicts = [];
                        for (var i = 0; i < data.dicts.length; i++) {
                            dicts[i] = {
                                id: parseInt(data.dicts[i].dictvalue),
                                name: data.dicts[i].dictname
                            };
                            $scope.OrgType.push(dicts[i]);
                        }
                        //if ($scope.getIndexByField('viewColumns', 'org_type')) {
                        //    $scope.viewColumns[$scope.getIndexByField('viewColumns', 'org_type')].options = dicts;
                        //    $scope.headerGridView.setColumns($scope.viewColumns);
                        //}
                    });
                //词汇表单据状态取值
                BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "order_sale_center"})
                    .then(function (data) {
                        $scope.sale_center = data.dicts;
                    });

                BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "usertype"})
                    .then(function (data) {
                        var dicts = [];
                        for (var i = 0; i < data.dicts.length; i++) {
                            dicts[i] = {
                                id: parseInt(data.dicts[i].dictvalue),
                                name: data.dicts[i].dictname
                            };
                            $scope.usertype.push(dicts[i]);
                        }
                        //if ($scope.getIndexByField('viewColumns', 'usertype')) {
                        //    $scope.viewColumns[$scope.getIndexByField('viewColumns', 'usertype')].options = dicts;
                        //    $scope.headerGridView.setColumns($scope.viewColumns);
                        //}
                    });
                //所属运营单位
                $scope.ents = [];
                //机构树 对象
                var zTreeObj;
                var zTreeNodes = [];
                var zTreeNode = {};
                //当前树节点
                var currentNode;
                //机构树-设置参数
                var setting = {
                    view: {
                        selectedMulti: false,
                        showIcon: false
                    },
                    callback: {
                        onClick: zTreeOnClick,
                        beforeExpand: beforeExpand,
                    }
                }

                //机构树 对象
                var entZTreeObj;
                var entZTreeNodes = [];
                var entZTreeNode = {};
                //机构树-设置参数
                var entSetting = {
                    view: {
                        selectedMulti: false, showIcon: false
                    },
                    callback: {
                        onClick: entZTreeOnClick,
                    },
                    check: {
                        enable: $scope.isOrgAdmin,
                        chkStyle: "checkbox",
                        chkboxType: {"Y": "p", "N": "s"}
                    }
                }
                //添加按钮
                var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
                    return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button>" +
                        "<button class='btn btn-sm btn-info dropdown-toggle delbtn' " + ($scope.isOrgAdmin ? "" : "disabled='true'") + " style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
                };

                //添加按钮 - 包含用户
                var lineUserButtons = function (row, cell, value, columnDef, dataContext) {
                    return "<button class='btn btn-sm btn-info dropdown-toggle delbtn' " + ($scope.isOrgAdmin ? "" : "disabled='true'") + " style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
                };
                var lineOrgButtons = function (row, cell, value, columnDef, dataContext) {
                    return "<button class='btn btn-sm btn-info dropdown-toggle delbtn' " + ($scope.isOrgAdmin ? "" : "disabled='true'") + " style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
                };
                var lineRoleButtons = function (row, cell, value, columnDef, dataContext) {
                    return "<button class='btn btn-sm btn-info dropdown-toggle delbtn' " + ($scope.isOrgAdmin ? "" : "disabled='true'") + " style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
                };
                var linePositionButtons = function (row, cell, value, columnDef, dataContext) {
                    return "<button class='btn btn-sm btn-info dropdown-toggle delbtn' " + ($scope.isOrgAdmin ? "" : "disabled='true'") + " style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
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
                        width: 45,
                    }, {
                        id: "username",
                        name: "名称",
                        behavior: "select",
                        field: "username",
                        width: 100,
                    }, {
                        id: "position",
                        name: "岗位",
                        behavior: "select",
                        field: "position",
                        width: 120,
                    }, {
                        id: "userid",
                        name: "用户账号",
                        behavior: "select",
                        field: "userid",
                        width: 120,
                    }, {
                        id: "telh",
                        name: "办公电话",
                        behavior: "select",
                        field: "telh",
                        width: 100
                    }, {
                        id: "mobil",
                        name: "手机",
                        behavior: "select",
                        field: "mobil",
                        width: 120,
                    }, {
                        id: "note",
                        name: "备注",
                        behavior: "select",
                        field: "note",
                        width: 100,
                    }, {
                        name: "操作",
                        width: 90,
                        formatter: editHeaderButtons
                    }
                ];
                //定义网格字段 - 包含用户
                $scope.lineUserColumns = [
                    {
                        id: "seq",
                        name: "序号",
                        field: "seq",
                        width: 45,
                    }, {
                        id: "userid",
                        name: "用户账号",
                        behavior: "select",
                        field: "userid",
                        width: 130,
                    }, {
                        id: "username",
                        name: "名称",
                        behavior: "select",
                        field: "username",
                        width: 100,
                    }, {
                        id: "note",
                        name: "备注",
                        behavior: "select",
                        field: "note",
                        width: 200,
                    }, {
                        name: "操作",
                        width: 120,
                        formatter: lineUserButtons
                    }
                ];

                //定义网格字段 - 用户隶属机构
                $scope.lineOrgColumns = [
                    {
                        id: "seq",
                        name: "序号",
                        field: "seq",
                        width: 45,
                    }, {
                        id: "orgname",
                        name: "机构名称",
                        behavior: "select",
                        field: "orgname",
                        width: 100,
                    }, {
                        id: "namepath",
                        name: "所在位置",
                        behavior: "select",
                        field: "namepath",
                        width: 400,
                    }, {
                        id: "note",
                        name: "备注",
                        behavior: "select",
                        field: "note",
                        width: 100,
                    }, {
                        name: "操作",
                        width: 120,
                        formatter: lineOrgButtons
                    }
                ];
                //定义网格字段 - 用户所属角色
                $scope.lineRoleColumns = [
                    {
                        id: "seq",
                        name: "序号",
                        field: "seq",
                        width: 45,
                    }, {
                        id: "roleid",
                        name: "角色代号",
                        field: "roleid",
                        width: 100,
                    }, {
                        id: "rolename",
                        name: "名称",
                        field: "rolename",
                        width: 100,
                    }, {
                        id: "note",
                        name: "备注",
                        field: "note",
                        width: 300,
                    }, {
                        name: "操作",
                        width: 120,
                        formatter: lineRoleButtons
                    }
                ];
                //定义网格字段 - 用户所属岗位
                $scope.linePositionColumns = [
                    {
                        id: "seq",
                        name: "序号",
                        field: "seq",
                        width: 45,
                    }, {
                        id: "positionid",
                        name: "岗位名称",
                        field: "positionid",
                        width: 150,
                    }, {
                        id: "positiondesc",
                        name: "岗位描述",
                        field: "positiondesc",
                        filter: 'set',
                        width: 300,
                    }, {
                        id: "orgname",
                        name: "机构名称",
                        field: "orgname",
                        width: 100,
                    }, {
                        name: "操作",
                        width: 120,
                        formatter: linePositionButtons
                    }
                ];

                //定义网格字段 - 用户所属角色
                $scope.lineMrpColumns = [
                    {
                        id: "seq",
                        name: "序号",
                        field: "seq",
                        width: 45
                    }, {
                        id: "factory_code",
                        name: "工厂编码",
                        field: "factory_code",
                        width: 100

                    }, {
                        id: "factory_name",
                        name: "工厂名称",
                        field: "factory_name",
                        width: 100
                    }, {
                        id: "mrp",
                        name: "MRP编码",
                        field: "mrp",
                        width: 100

                    }, {
                        id: "mrp_desc",
                        name: "MRP描述",
                        field: "mrp_desc",
                        width: 100
                    }, {
                        name: "操作",
                        width: 120,
                        formatter: lineRoleButtons
                    }
                ];

                //网格初始化 - 用户
                $scope.headerGridView = new Slick.Grid("#headerGrid", [], $scope.headerColumns, $scope.headerOptions);
                //网格初始化
                $scope.lineUserGridView = new Slick.Grid("#lineUserGridView", [], $scope.lineUserColumns, $scope.headerOptions);
                $scope.lineOrgGridView = new Slick.Grid("#lineOrgGridView", [], $scope.lineOrgColumns, $scope.headerOptions);
                $scope.lineRoleGridView = new Slick.Grid("#lineRoleGridView", [], $scope.lineRoleColumns, $scope.headerOptions);
                $scope.linePositionGridView = new Slick.Grid("#linePositionGridView", [], $scope.linePositionColumns, $scope.headerOptions);
                $scope.lineMrpGridView = new Slick.Grid("#lineMrpGridView", [], $scope.lineMrpColumns, $scope.headerOptions);

                //机构树初始化
                zTreeObj = $.fn.zTree.init(angular.element("#tree"), setting, []);
                //树初始化
                entZTreeObj = $.fn.zTree.init(angular.element("#entTree"), entSetting, []);
                //主表清单绑定点击事件
                $scope.headerGridView.onClick.subscribe(dgOnClick);
                $scope.headerGridView.onDblClick.subscribe(dgOnDblClick);
                //绑定点击事件
                $scope.lineUserGridView.onClick.subscribe(dgLineOnClick);
                $scope.lineOrgGridView.onClick.subscribe(dgLineOrgOnClick);
                $scope.lineRoleGridView.onClick.subscribe(dgLineRoleOnClick);
                $scope.linePositionGridView.onClick.subscribe(dgLinePostionOnClick);
                $scope.lineMrpGridView.onClick.subscribe(dgLineMrpOnClick);

                //事件判断
                function dgOnClick(e, args) {
                    if ($(e.target).hasClass("viewbtn")) {
                        $scope.scpuser_edit(args);
                        e.stopImmediatePropagation();
                    }
                    //点击删除按钮处理事件
                    if ($(e.target).hasClass("delbtn")) {
                        var dg = $scope.headerGridView;
                        var rowidx = args.row;
                        var postData = args.grid.getDataItem(args.row);
                        BasemanService.swalWarning("删除", "确定要删除对象 " + postData.username + " 吗？", function (bool) {
                            if (bool) {
                                //删除数据成功后再删除网格数据
                                BasemanService.RequestPost("scpuser", "delete", JSON.stringify(postData))
                                    .then(function (data) {
                                        dg.getData().splice(rowidx, 1);
                                        dg.invalidateAllRows();
                                        dg.render();
                                        e.stopImmediatePropagation();
                                        BasemanService.notice("删除成功！", "alert-success");
                                    });
                            } else {
                                return;
                            }
                        })

                    }
                }

                function dgOnDblClick(e, args) {
                    $scope.scpuser_edit(args);
                }

                //事件判断
                function dgLineOnClick(e, args) {
                    if ($(e.target).hasClass("delbtn")) {
                        delLineRow(args);
                        e.stopImmediatePropagation();
                    }
                };

                function dgLineOrgOnClick(e, args) {
                    if ($(e.target).hasClass("delbtn")) {
                        delLineOrg(args);
                        e.stopImmediatePropagation();
                    }
                };

                function dgLineRoleOnClick(e, args) {
                    if ($(e.target).hasClass("delbtn")) {
                        delLineRole(args);
                        e.stopImmediatePropagation();
                    }
                };

                function dgLineMrpOnClick(e, args) {
                    if ($(e.target).hasClass("delbtn")) {
                        delLineMrp(args);
                        e.stopImmediatePropagation();
                    }
                };

                function dgLinePostionOnClick(e, args) {
                    if ($(e.target).hasClass("delbtn")) {
                        delLinePosition(args);
                        e.stopImmediatePropagation();
                    }
                };

                /**
                 * 初始化数据
                 */
                function initData() {
                    //初始化Ent
                    BasemanService.RequestPost("scpent", "search", {})
                        .then(function (data) {
                            $.each(data.scpents, function (i, item) {
                                var ent = {};
                                ent.name = item.entname;
                                ent.id = parseInt(item.entid);
                                ent.data = item;
                                $scope.ents.push(ent);
                            });
                        });
                }

                /**
                 * 查询工作区
                 */
                var a = 0;
                $scope.searchData = function (postdata) {
                    if ($scope.role != -1) {
                        $scope.isOrgAdmin = true;
                    }
                    a += 1;
                    if (!postdata) {
                        if (!$scope.oldPage) {
                            $scope.oldPage = 1;
                        }
                        if (!$scope.currentPage) {
                            $scope.currentPage = 1;
                        }
                        if (!$scope.pageSize) {
                            $scope.pageSize = "10";
                        }
                        $scope.totalCount = 1;
                        $scope.pages = 1;
                        postdata = {
                            pagination: "pn=" + $scope.currentPage + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
                        }
                    }
                    initData();
                    var wsobj = {
                        "wsid": -16,
                        "wstag": -16,
                        "excluderight": 1,
                        "wsright": "00000000000000000000FFFF000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
                    }
                    if (a == 1) {
                        var data = BasemanService.RequestPostSync("scpworkspace", "selectref", wsobj);
                        zTreeObj = $.fn.zTree.init(angular.element("#tree"), setting, []);
                        //生成树节点
                        zTreeNodes = [];
                        var itemNode = {};
                        itemNode.name = data.orgs[0].orgname;
                        itemNode.id = data.orgs[0].orgid;
                        itemNode.isParent = true;
                        itemNode.data = data.orgs[0];
                        currentNode = itemNode;
                        zTreeNodes.push(itemNode);
                        zTreeObj.addNodes(null, zTreeNodes);
                        //跟节点
                        var node = zTreeObj.getNodeByParam("id", itemNode.id);
                        //zTreeObj.selectNode(node)
                        //默认展开2级
                        expandNode(node, true);
                    }

                    //加载网格数据
                    postdata.excluderight = 1;
                    postdata.orgid = currentNode.id;

                    BasemanService.RequestPost("scporg", "selectref", postdata)
                        .then(function (data) {
                            setGridData($scope.headerGridView, data.useroforgs);
                            BaseService.pageInfoOp($scope, data.pagination);
                        });
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
                 * 初始化 - Modal框tab页 - 把tab框显示到第一标签
                 */
                $scope.initModal = function () {
                    var tabs = $(".nav-tabs");
                    if (tabs) {
                        $.each(tabs, function (i, tab) {
                            var tabLis = $(tab).children("li");
                            $.each(tabLis, function (i, li) {
                                $(li).removeClass("active");
                            })
                            $(tabLis.get(0)).addClass("active");
                        })
                    }
                    var tabContents = $(".tab-content");
                    if (tabContents) {
                        $.each(tabContents, function (i, tabContent) {
                            var tabPanes = $(tabContent).children(".tab-pane");
                            $.each(tabPanes, function (i, tabPane) {
                                $(tabPane).removeClass("active");
                            })
                            $(tabPanes.get(0)).addClass("active");
                        })
                    }
                }

                //展开树节点 - 事件
                function beforeExpand(treeId, treeNode) {
                    expandNode(treeNode, false);
                }

                //展开树节点-数据加载
                function expandNode(treeNode, isAuto) {
                    if (treeNode.isLoadChilded) {
                        return;
                    }
                    //默认展开2级
                    if (isAuto && treeNode.data.lev > 2) {
                        return;
                    }
                    var org_obj = {
                        "excluderight": 1,
                        "orgid": treeNode.id
                    }
                    BasemanService.RequestPost("scporg", "selectref", org_obj)
                        .then(function (data) {
                            //添加节点
                            zTreeNodes = [];
                            $.each(data.orgoforgs, function (i, item) {
                                var itemNode = {};
                                itemNode.name = item.orgname;
                                itemNode.id = item.orgid;
                                itemNode.isParent = true;
                                itemNode.isLoadChilded = false;
                                itemNode.data = item;
                                zTreeNodes.push(itemNode);
                            });
                            zTreeObj.removeChildNodes(treeNode);
                            zTreeObj.addNodes(treeNode, zTreeNodes);
                            //标记为已加载数据
                            treeNode.isLoadChilded = true;
                            zTreeObj.updateNode(currentNode);
                            if (isAuto) {
                                $.each(zTreeNodes, function (i, item) {
                                    var node = zTreeObj.getNodeByParam("id", item.id);
                                    expandNode(node, true);
                                });
                            }
                        });
                }

                //机构数据加载
                function load_org(postdata) {
                    if (!postdata) {
                        if (!$scope.oldPage) {
                            $scope.oldPage = 1;
                        }
                        if (!$scope.currentPage) {
                            $scope.currentPage = 1;
                        }
                        if (!$scope.pageSize) {
                            $scope.pageSize = "10";
                        }
                        $scope.totalCount = 1;
                        $scope.pages = 1;
                        postdata = {
                            pagination: "pn=" + $scope.currentPage + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
                        }
                    }
                    postdata.excluderight = 1;
                    postdata.orgid = currentNode.id

                    BasemanService.RequestPost("scporg", "selectref", postdata)
                        .then(function (data) {
                            setGridData($scope.headerGridView, data.useroforgs);
                            zTreeObj.expandNode(currentNode, true, false, false);
                            if (!currentNode.isLoadChilded) {
                                //currentNode.open == false;
                                zTreeNodes = [];
                                $.each(data.orgoforgs, function (i, item) {
                                    var itemNode = {};
                                    itemNode.name = item.orgname;
                                    itemNode.id = item.orgid;
                                    itemNode.isParent = true;
                                    itemNode.isLoadChilded = false;
                                    itemNode.data = item;
                                    zTreeNodes.push(itemNode);
                                });
                                zTreeObj.removeChildNodes(currentNode);
                                zTreeObj.addNodes(currentNode, zTreeNodes);
                                //标记为已加载数据
                                currentNode.isLoadChilded = true;
                                zTreeObj.updateNode(currentNode);
                            }
                            BaseService.pageInfoOp($scope, data.pagination);
                        });
                }

                //添加机构
                $scope.scporg_add = function () {
                    $scope.initModal();
                    $scope.data.currTreeItem = {}
                    $scope.data.currTreeItem.entid = 1;
                    setGridData($scope.lineUserGridView, []);
                };
                //添加用户
                $scope.scpuser_add = function () {
                    $scope.initModal();
                    $scope.data.currItem = {}
                    $scope.data.currItem.actived = 2;
                    $scope.data.currItem.clas = 2;
                    $scope.data.currItem.enablepwd = 2;
                    setGridData($scope.lineOrgGridView, []);
                    setGridData($scope.lineRoleGridView, []);
                    setGridData($scope.linePositionGridView, []);
                    //加载职责数
                    BasemanService.RequestPost("scpent", "search", {})
                        .then(function (data) {
                            entZTreeObj = $.fn.zTree.init(angular.element("#entTree"), entSetting, []);
                            //生成树节点
                            zTreeNodes = [];
                            $.each(data.scpents, function (i, item) {
                                var itemNode = {};
                                itemNode.name = item.entname;
                                itemNode.id = item.entid;
                                itemNode.isParent = false;
                                itemNode.data = item;
                                zTreeNodes.push(itemNode);
                            });
                            entZTreeObj.addNodes(null, zTreeNodes);
                        });
                }
                //编辑机构
                $scope.scporg_edit = function () {
                    $scope.initModal();
                    $scope.data.currTreeItem = {};
                    var postData = {};
                    postData.orgid = currentNode.id;
                    BasemanService.RequestPost("scporg", "select", JSON.stringify(postData))
                        .then(function (data) {
                            $scope.data.currTreeItem = data;
                            setGridData($scope.lineUserGridView, data.useroforgs);
                        });
                }

                //编辑用户
                $scope.scpuser_edit = function (args) {
                    $scope.initModal();
                    var postData = {};
                    postData.userid = args.grid.getDataItem(args.row).userid;
                    BasemanService.RequestPost("scpuser", "select", JSON.stringify(postData))
                        .then(function (data) {
                            $scope.data.currItem = data;
                            $scope.data.olduserpass = "" + $scope.data.currItem.userpass;
                            $scope.data.currItem.userpass = '';
                            setGridData($scope.lineOrgGridView, data.orgofusers);
                            setGridData($scope.lineRoleGridView, data.roleofusers);
                            setGridData($scope.linePositionGridView, data.positionofusers);
                            setGridData($scope.lineMrpGridView, data.mrpofusers);
                            //加载职责树
                            entZTreeObj = $.fn.zTree.init(angular.element("#entTree"), entSetting, []);
                            //生成树节点
                            zTreeNodes = [];
                            $.each($scope.ents, function (i, item) {
                                var itemNode = {};
                                itemNode.name = item.name;
                                itemNode.id = item.id;
                                //默认选中
                                $.each($scope.data.currItem.entofusers, function (i, entItem) {
                                    if (item.id == entItem.entid) {
                                        itemNode.checked = true;
                                    }
                                })
                                itemNode.isParent = false;
                                itemNode.data = item.data;
                                zTreeNodes.push(itemNode);
                            });
                            entZTreeObj.addNodes(null, zTreeNodes);
                            $("#addUserModal").modal();
                        });

                }
                //保存机构
                $scope.scporg_save = function () {
                    if ($scope.data.currTreeItem.orgid > 0) {
                        BasemanService.RequestPost("scporg", "update", JSON.stringify($scope.data.currTreeItem))
                            .then(function (data) {
                                currentNode.name = $scope.data.currTreeItem.orgname;
                                currentNode.data = $scope.data.currTreeItem;
                                zTreeObj.updateNode(currentNode);
                                setGridData($scope.headerGridView, data.useroforgs);
                                BasemanService.notice("保存成功！", "alert-success");
                            });
                    } else {
                        $scope.data.currTreeItem.parentid = currentNode.data.idpath;
                        $scope.data.currTreeItem.parenttype = currentNode.data.typepath;
                        $scope.data.currTreeItem.lev = currentNode.data.lev + 1;
                        BasemanService.RequestPost("scporg", "insert", JSON.stringify($scope.data.currTreeItem))
                            .then(function (data) {
                                currentNode.isLoadChilded = false;
                                currentNode.checked = true;
                                zTreeObj.updateNode(currentNode)
                                zTreeObj.selectNode(currentNode);
                                $scope.data.currTreeItem = {};
                                //更新页面显示
                                load_org();
                                BasemanService.notice("保存成功！", "alert-success");
                            });
                    }
                }
                //保存用户
                $scope.scpuser_save = function () {
                    //获取选中职责
                    $scope.data.currItem.entofusers = [];
                    var currCheckedNodes = entZTreeObj.getCheckedNodes();
                    $.each(currCheckedNodes, function (i, currCheckedNode) {
                        $scope.data.currItem.entofusers.push(currCheckedNode.data);
                    });
                    // $scope.data_actived  2：否，1：是
                    // $scope.data_enablepwd 2：是，1：否
                    if (typeof($scope.data.currItem.clas) == "undefined") {
                        $scope.data.currItem.clas = 1;
                    }
                    if ($scope.data.currItem.sysuserid > 0) {
                        //调用后台select方法查询详情
                        BasemanService.RequestPost("scpuser", "update", JSON.stringify($scope.data.currItem))
                            .then(function (data) {
                                load_org();
                                BasemanService.notice("保存成功！", "alert-success");
                            });
                    } else {
                        $scope.data.currItem.parentid = currentNode.data.idpath;
                        $scope.data.currItem.parenttype = currentNode.data.typepath;
                        //调用后台select方法查询详情
                        BasemanService.RequestPost("scpuser", "insert", JSON.stringify($scope.data.currItem))
                            .then(function (data) {
                                load_org();
                                BasemanService.notice("保存成功！", "alert-success");//warning
                            });
                    }
                };
                //删除机构
                $scope.scporg_delete = function () {
                    BasemanService.swalWarning("提示", "确定要删除 " + currentNode.data.orgname + " 吗？", function (bool) {
                        if (bool) {
                            $scope.scporg_delete_data = {
                                "orgid": currentNode.data.orgid,
                            }
                            BasemanService.RequestPost("scporg", "delete", $scope.scporg_delete_data)
                                .then(function (data) {
                                    zTreeObj.removeNode(zTreeObj.getSelectedNodes()[0]);
                                    BasemanService.notice("删除成功！", "alert-success");
                                });
                        } else {
                            return;
                        }
                    })
                };
                //删除用户
                $scope.scpuser_delete = function (useroforg) {
                    BasemanService.swalWarning("删除", "确定要删除对象 " + useroforg.username + " 吗？", function (bool) {
                        if (bool) {
                            BasemanService.RequestPost("scpuser", "delete", useroforg)
                                .then(function (data) {
                                    load_org();
                                    BasemanService.notice("删除成功！", "alert-success");
                                });
                        } else {
                            return;
                        }
                    })
                };

                /**
                 *添加 - 用户、属于机构、角色、岗位
                 */
                function addLineRow(result) {
                    if (typeof ($scope.data.currTreeItem.useroforgs) == 'undefined') {
                        $scope.data.currTreeItem.useroforgs = [];
                    }
                    var isExist = false;
                    for (var i in $scope.data.currTreeItem.useroforgs) {
                        if ($scope.data.currTreeItem.useroforgs[i].userid == result.userid) {
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        $scope.data.currTreeItem.useroforgs.push(result);
                    }
                    setGridData($scope.lineUserGridView, $scope.data.currTreeItem.useroforgs)
                }

                function addLineOrg(result) {
                    if (typeof ($scope.data.currItem.orgofusers) == 'undefined') {
                        $scope.data.currItem.orgofusers = [];
                    }
                    var isExist = false;
                    for (var i in $scope.data.currItem.orgofusers) {
                        if ($scope.data.currItem.orgofusers[i].orgid == result.orgid) {
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        $scope.data.currItem.orgofusers.push(result);
                    }
                    setGridData($scope.lineOrgGridView, $scope.data.currItem.orgofusers)
                }

                function addLineRole(result) {
                    if (typeof ($scope.data.currItem.roleofusers) == 'undefined') {
                        $scope.data.currItem.roleofusers = [];
                    }
                    var isExist = false;
                    for (var i in $scope.data.currItem.roleofusers) {
                        if ($scope.data.currItem.roleofusers[i].roleid == result.roleid) {
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        $scope.data.currItem.roleofusers.push(result);
                    }
                    setGridData($scope.lineRoleGridView, $scope.data.currItem.roleofusers)
                }

                function addLineMrp(result) {
                    if (typeof ($scope.data.currItem.mrpofusers) == 'undefined') {
                        $scope.data.currItem.mrpofusers = [];
                    }
                    var isExist = false;
                    for (var i in $scope.data.currItem.mrpofusers) {
                        if ($scope.data.currItem.mrpofusers[i].mrp == result.mrp && $scope.data.currItem.mrpofusers[i].factory_code == result.factory_code) {
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        $scope.data.currItem.mrpofusers.push(result);
                    }
                    setGridData($scope.lineMrpGridView, $scope.data.currItem.mrpofusers)
                }

                function addLinePosition(result) {
                    if (typeof ($scope.data.currItem.positionofusers) == 'undefined') {
                        $scope.data.currItem.positionofusers = [];
                    }
                    var isExist = false;
                    for (var item in $scope.data.currItem.positionofusers) {
                        if (item.positionid == result.positionid) {
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        $scope.data.currItem.positionofusers.push(result);
                    }
                    setGridData($scope.linePositionGridView, $scope.data.currItem.positionofusers)
                }

                /**
                 * 删除明细-用户、属于机构、角色、岗位
                 */
                function delLineRow(args) {
                    var dg = $scope.lineUserGridView;
                    var rowidx = args.row;
                    var username = args.grid.getDataItem(args.row).username;
                    BasemanService.swalWarning("删除", "确定要删除对象 " + username + " 吗？", function (bool) {
                        if (bool) {
                            //删除网格数据
                            dg.getData().splice(rowidx, 1);
                            dg.invalidateAllRows();
                            dg.render();
                        } else {
                            return;
                        }
                    })
                };

                function delLineOrg(args) {
                    var dg = $scope.lineOrgGridView;
                    var rowidx = args.row;
                    var name = args.grid.getDataItem(args.row).orgname;
                    BasemanService.swalWarning("删除", "确定要删除机构 " + name + " 吗？", function (bool) {
                        if (bool) {
                            //删除网格数据
                            dg.getData().splice(rowidx, 1);
                            dg.invalidateAllRows();
                            dg.render();
                        } else {
                            return;
                        }
                    })
                };

                function delLineRole(args) {
                    var dg = $scope.lineRoleGridView;
                    var rowidx = args.row;
                    var name = args.grid.getDataItem(args.row).rolename;
                    BasemanService.swalWarning("删除", "确定要删除角色 " + name + " 吗？", function (bool) {
                        if (bool) {
                            //删除网格数据
                            dg.getData().splice(rowidx, 1);
                            dg.invalidateAllRows();
                            dg.render();
                        } else {
                            return;
                        }
                    })
                };

                function delLineMrp(args) {
                    var dg = $scope.lineMrpGridView;
                    var rowidx = args.row;
                    var mrp_desc = args.grid.getDataItem(args.row).mrp_desc;
                    BasemanService.swalWarning("删除", "确定要删除 " + mrp_desc + " 吗？", function (bool) {
                        if (bool) {
                            //删除网格数据
                            dg.getData().splice(rowidx, 1);
                            dg.invalidateAllRows();
                            dg.render();
                        } else {
                            return;
                        }
                    })
                };

                function delLinePosition(args) {
                    var dg = $scope.linePositionGridView;
                    var rowidx = args.row;
                    var name = args.grid.getDataItem(args.row).positionid;
                    BasemanService.swalWarning("删除", "确定要删除岗位 " + name + " 吗？", function (bool) {
                        if (bool) {
                            //删除网格数据
                            dg.getData().splice(rowidx, 1);
                            dg.invalidateAllRows();
                            dg.render();
                        } else {
                            return;
                        }
                    })
                };

                //单击事件方法 - 机构
                function zTreeOnClick(event, treeId, treeNode) {
                    currentNode = treeNode;
                    load_org();
                };

                //单击事件方法 - 机构
                function entZTreeOnClick(event, treeId, treeNode) {
                    load_ent(treeNode);
                };
                /**
                 * 通用查询
                 */
                $scope.searchUser = function (searchType) {
                    $scope.FrmInfo = {
                        title: "用户查询",
                        thead: [{
                            name: "用户编码",
                            code: "userid"
                        }, {
                            name: "用户名称",
                            code: "username"
                        }, {
                            name: "机构路径",
                            code: "namepath"
                        }],
                        classid: "scpuser",
                        //type:"checkbox",
                        url: "/jsp/req.jsp",
                        direct: "center",
                        sqlBlock: "",
                        backdatas: "users",
                        ignorecase: "true", //忽略大小写
                        is_high: false,
                        postdata: {
                            maxsearchrltcmt: 300
                        },
                        searchlist: ["userid", "username"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        if (searchType == 'addUserLineRow') {
                            addLineRow(result);
                        }
                        if (searchType == 'manager') {
                            $scope.data.currTreeItem.manager = result.username;
                        }
                        if (searchType == 'vicemanager') {
                            $scope.data.currTreeItem.vicemanager = result.username;
                        }
                    })
                };
                $scope.searchOrg = function () {
                    $scope.FrmInfo = {
                        title: "机构查询",
                        thead: [{
                            name: "机构编码",
                            code: "code"
                        }, {
                            name: "机构名称",
                            code: "orgname"
                        }, {
                            name: "机构路径",
                            code: "namepath"
                        }],
                        classid: "scporg",
                        url: "/jsp/req.jsp",
                        direct: "center",
                        sqlBlock: "",
                        backdatas: "orgs",
                        ignorecase: "true", //忽略大小写
                        is_high: false,
                        postdata: {
                            maxsearchrltcmt: 300
                        },
                        searchlist: ["code", "orgname"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        addLineOrg(result);
                    })
                };
                $scope.searchArea = function () {
                    return BasemanService
                        .chooseCity({
                            scope: $scope
                        })
                        .then(function (city) {
                            Magic.assignProperty(city, $scope.data.currTreeItem, [
                                'areaid',
                                'areacode',
                                'areaname'
                            ]);
                        })
                        ;
                };
                $scope.searchRole = function () {
                    $scope.FrmInfo = {
                        title: "角色查询",
                        thead: [{
                            name: "角色代号",
                            code: "roleid"
                        }, {
                            name: "名称",
                            code: "rolename"
                        }, {
                            name: "备注",
                            code: "note"
                        }],
                        classid: "scprole",
                        url: "/jsp/req.jsp",
                        direct: "center",
                        sqlBlock: "",
                        backdatas: "roles",
                        ignorecase: "true", //忽略大小写
                        is_high: false,
                        postdata: {
                            maxsearchrltcmt: 300
                        },
                        searchlist: ["roleid", "rolename", "note"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        result.entid = 1;
                        addLineRole(result);
                    })
                };
                $scope.searchPosition = function () {
                    $scope.FrmInfo = {
                        title: "岗位查询",
                        thead: [{
                            name: "岗位名称",
                            code: "positionid"
                        }, {
                            name: "职责概述",
                            code: "positiondesc"
                        }, {
                            name: "机构名称",
                            code: "orgname"
                        }],
                        classid: "scpposition",
                        url: "/jsp/req.jsp",
                        direct: "center",
                        sqlBlock: "",
                        backdatas: "positions",
                        ignorecase: "true",
                        is_high: false,
                        postdata: {"orgid": currentNode.id},
                        searchlist: ["positionid", "positiondesc", "orgname"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        addLinePosition(result);
                    })
                };

                $scope.searchMrp = function () {
                    $scope.FrmInfo = {
                        title: "MRP控制者",
                        thead: [{
                            name: "MRP编码",
                            code: "mrp"
                        }, {
                            name: "MRP名称",
                            code: "mrp_desc"
                        }, {
                            name: "工厂编码",
                            code: "factory_code"
                        }, {
                            name: "工厂名称",
                            code: "factory_name"
                        }],
                        classid: "item_org",
                        url: "/jsp/req.jsp",
                        sqlBlock: "",
                        backdatas: "mrps",
                        ignorecase: "true", //忽略大小写
                        is_high: false,
                        postdata: {
                            maxsearchrltcmt: 300,
                            searchflag: 24
                        },
                        searchlist: ["mrp", "mrp_desc", "factory_code", "factory_name"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        addLineMrp(result);
                    })
                };

                //勾选事件
                $scope.checkEnablepwd = function (e) {
                    var checkTarget = e.target;
                    if (checkTarget.checked) {
                        $scope.data.currItem.enablepwd = 1;
                    } else {
                        $scope.data.currItem.enablepwd = 2;
                    }
                };
                $scope.checkActived = function (e) {
                    var checkTarget = e.target;
                    if (checkTarget.checked) {
                        $scope.data.currItem.actived = 1;
                    } else {
                        $scope.data.currItem.actived = 2;
                    }
                };
                $scope.checkStat = function (e) {
                    var checkTarget = e.target;
                    if (checkTarget.checked) {
                        $scope.data.currTreeItem.stat = 1;
                    } else {
                        $scope.data.currTreeItem.stat = 2;
                    }
                };
                $scope.checkIsfeecenter = function (e) {
                    var checkTarget = e.target;
                    if (checkTarget.checked) {
                        $scope.data.currTreeItem.isfeecenter = 2;
                    } else {
                        $scope.data.currTreeItem.isfeecenter = 1;
                    }
                };

                /**
                 * 刷新
                 */
                $scope.org_refresh = function () {
                    $scope.searchData();
                    zTreeObj.refresh();
                }

                //网格高度自适应
                BasemanService.initGird();

                BaseService.pageGridInit($scope);

                // IncRequestCount()
                // DecRequestCount()


                //使用控制器Api注册控制器
                //需传入require模块和控制器定义
                return controllerApi.controller({
                    module: module,
                    controller: controller
                });
            }];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);