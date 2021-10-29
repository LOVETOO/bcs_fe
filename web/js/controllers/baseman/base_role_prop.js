define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', 'zTreeApi', 'jurisdictionApi', 'numberApi', 'ztree.excheck'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi, zTreeApi, jurisdictionApi, numberApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$modal', '$q',
            //控制器函数
            function ($scope, $modal, $q) {
                //定义数据
                $scope.data = {};
                $scope.data.currItem = { ischangeusers: 0 };

                //工作区权限相关数据
                $scope.ws = {
                    workspaceofsyss: [],
                    showGrid: false
                };

                $scope.gridOptions_users = {
                    columnDefs: [{
                        type: '序号',
                        minWidth: 100
                    }, {
                        headerName: "用户",
                        field: "username",
                        minWidth: 150
                    }, {
                        headerName: "所在机构",
                        field: "namepath",
                        minWidth: 300
                    }]
                };

                $scope.gridOptions_organizations = {
                    columnDefs: [{
                        type: '序号',
                        minWidth: 100
                    }, {
                        headerName: "机构名称",
                        field: "orgname",
                        minWidth: 150
                    }, {
                        headerName: "所在位置",
                        field: "namepath",
                        minWidth: 300
                    }]
                };

                /**
                 * 工作区权限网格
                 */
                $scope.wsGridOptions = {
                    columnDefs: [{
                        headerName: "类型",
                        field: "objtype",
                        minWidth: 100,
                        type: "下拉",
                        cellEditorParams: {
                            values: ["2", "6", "7", "12", "13", "43", "999"],
                            names: ["文件夹", "文件", "流程模板", "机构", "用户", "岗位", "表单"]
                        }
                    }, {
                        headerName: "所有",
                        field: "all",
                        editable: true,
                        type: "下拉",
                        cellEditorParams: {
                            values: ["1", "0"],
                            names: ["✔", "×"]
                        }
                    }, {
                        headerName: "浏览",
                        field: "view",
                        editable: true,
                        type: "下拉",
                        cellEditorParams: {
                            values: ["1", "0"],
                            names: ["✔", "×"]
                        }
                    }, {
                        headerName: "读取",
                        field: "read",
                        editable: true,
                        type: "下拉",
                        cellEditorParams: {
                            values: ["1", "0"],
                            names: ["✔", "×"]
                        }
                    }, {
                        headerName: "修改",
                        field: "modify",
                        editable: true,
                        type: "下拉",
                        cellEditorParams: {
                            values: ["1", "0"],
                            names: ["✔", "×"]
                        }
                    }, {
                        headerName: "新增",
                        field: "add",
                        editable: true,
                        type: "下拉",
                        cellEditorParams: {
                            values: ["1", "0"],
                            names: ["✔", "×"]
                        }
                    }, {
                        headerName: "删除",
                        field: "delete",
                        editable: true,
                        type: "下拉",
                        cellEditorParams: {
                            values: ["1", "0"],
                            names: ["✔", "×"]
                        }
                    }, {
                        headerName: "目录",
                        field: "dir",
                        editable: true,
                        type: "下拉",
                        cellEditorParams: {
                            values: ["1", "0"],
                            names: ["✔", "×"]
                        }
                    }, {
                        headerName: "输出",
                        field: "export",
                        editable: true,
                        type: "下拉",
                        cellEditorParams: {
                            values: ["1", "0"],
                            names: ["✔", "×"]
                        }
                    }],
                    hcEvents: {
                        cellValueChanged: cellValueChanged
                    }
                };

                //继承主控制器
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 新增业务数据时
                 * @override
                 * @since 2019-01-16
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.allent = 2;

                    bizData.entofroles = [];
                    $scope.entGridOptions.hcApi.setRowData(bizData.entofroles);	//运营单元

                    //新建时将APP权限数据以及APP菜单数据查询并显示，拥有权限数据的则打勾
                    setAppMenuData(bizData);

                    return setModMenuData(bizData);
                };

                /**
                 * 设置业务数据时
                 * @override
                 * @since 2019-01-16
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    $scope.entGridOptions.hcApi.setRowData(bizData.entofroles);	//运营单元

                    $scope.gridOptions_users.hcApi.setRowData(bizData.userofroles); //用户
                    $scope.gridOptions_organizations.hcApi.setRowData(bizData.orgofroles); //组织
                    //设置数据时，将打勾的数据获取
                    setAppMenuData(bizData);
                    return setModMenuData(bizData);
                };

                /**
                 * 保存业务数据时
                 * @override
                 * @since 2019-01-16
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);

                    //保存 选中的模块和菜单
                    bizData.userofroles = $scope.gridOptions_users.hcApi.getRowData();
                    bizData.orgofroles = $scope.gridOptions_organizations.hcApi.getRowData();
                    bizData.modofroles = [];
                    bizData.menuofroles = [];
                    bizData.scproleappmenus = [];
                    //保存的时候，显示所有节点
                    var menuNodes = $scope.zTree2.getNodes(); //这个方法只是取得了根节点的子节点
                    menuNodes = $scope.zTree2.transformToArray(menuNodes); //再用这个方法才能得到所有的节点
                    $scope.zTree2.showNodes(menuNodes);

                    var currModCheckedNodes = $scope.zTree1.getCheckedNodes();
                    for (var i = 0; i < currModCheckedNodes.length; i++) {
                        bizData.modofroles.push(currModCheckedNodes[i].data);
                    }
                    var currMenuCheckedNodes = $scope.zTree2.getCheckedNodes();
                    for (var i = 0; i < currMenuCheckedNodes.length; i++) {
                        bizData.menuofroles.push(currMenuCheckedNodes[i].data);
                    }
                    //保存时获取获取选中的数据，得到节点数据
                    var currAppCheckedNodes = $scope.app1.getCheckedNodes();
                    for (var i = 0; i < currAppCheckedNodes.length; i++) {
                        bizData.scproleappmenus.push(currAppCheckedNodes[i].data);
                    }

                };

                /**
                 * 表单验证
                 * 实现方式：收集验证不通过的信息
                 * @param {string[]} invalidBox 信息盒子，字符串数组，验证不通过时，往里面放入信息即可
                 * @override
                 * @since 2019-01-16
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);

                    if ($scope.data.currItem.allent != 2) {
                        if (!$scope.data.currItem.entofroles || !$scope.data.currItem.entofroles.length) {
                            invalidBox.push(
                                '',
                                '当角色不是全运营单元共享时，必须指定所属运营单元'
                            );
                        }
                    }
                };

                //标签定义
                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;
                //修改标签页标题
                $scope.tabs.base.title = '常规';
                //增加标签页
                $scope.tabs.users = {
                    title: '包含用户'
                };
                $scope.tabs.permission = {
                    title: '权限'
                };
                $scope.tabs.appmenu = {
                    title: 'APP菜单授权'
                };
                $scope.tabs.organizations = {
                    title: '包含机构'
                };

                $scope.footerLeftButtons.add_line = {
                    title: '增加行',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    }
                };
                $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    }
                };

                // 添加行按钮在不需要的时候隐藏
                $scope.footerLeftButtons.add_line.hide = function () {
                    if ($scope.tabs.base.active == true) {
                        return true;
                    } else if ($scope.tabs.appmenu.active == true) {
                        return true;
                    } else if ($scope.tabs.permission.active == true) {
                        return true;
                    } else {
                        return false;
                    }
                };
                // 删除行按钮在不需要的时候隐藏
                $scope.footerLeftButtons.del_line.hide = function () {
                    if ($scope.tabs.base.active == true) {
                        return true;
                    } else if ($scope.tabs.appmenu.active == true) {
                        return true;
                    } else if ($scope.tabs.permission.active == true) {
                        return true;
                    } else {
                        return false;
                    }
                };
                $scope.add_line = function () {
                    if ($scope.tabs.users.active == true) {
                        $scope.addLineRow1();
                    }

                    if ($scope.tabs.organizations.active == true) {
                        $scope.addLineRow2();
                    }

                };
                $scope.del_line = function () {
                    if ($scope.tabs.users.active == true) {
                        $scope.deleteLineRow1();
                    }

                    if ($scope.tabs.organizations.active == true) {
                        $scope.deleteLineRow2();
                    }

                };
                // 用户查询/增加行
                $scope.addLineRow1 = function () {
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
                        is_high: false,
                        url: "/jsp/req.jsp",
                        direct: "left",
                        sqlBlock: "",
                        backdatas: "users",
                        ignorecase: "true", //忽略大小写
                        searchlist: ["userid", "username"]
                    };
                    $modal.openCommonSearch({
                        classId: 'scpuser',
                        searchWhenReady: true
                    }).result.then(function (result) {
                        var a = $scope.gridOptions_users.hcApi.getRowData();
                        var b = $scope.gridOptions_users.hcApi.getRowData().map(function (data) {
                            return data.sysuserid;
                        });
                        if (b.indexOf(result.sysuserid) < 0) {
                            a.push(result);
                        }
                        $scope.gridOptions_users.hcApi.setRowData(a);
                        $scope.data.currItem.ischangeusers = 2;
                    });

                };
                //删除行/用户数据
                $scope.deleteLineRow1 = function () {
                    var index = $scope.gridOptions_users.hcApi.getFocusedRowIndex();
                    if (index < 0) {
                        return swalApi.info('请先选中要删除的行').then($q.reject);
                    }
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除第" + (index + 1) + "行的数据吗?",
                        okFun: function () {
                            // console.log("选中行", $scope.gridOptions_users.hcApi.getFocusedData())
                            var a = $scope.gridOptions_users.hcApi.getRowData();
                            a.splice(index, 1);
                            $scope.gridOptions_users.hcApi.setRowData(a);
                            $scope.gridOptions_users.api.focusedCellController.clearFocusedCell();
                            $scope.data.currItem.ischangeusers = 2;
                        },
                        okTitle: '删除成功'
                    });

                };

                //查询机构/增加行
                $scope.addLineRow2 = function () {
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
                        is_high: false,
                        url: "/jsp/req.jsp",
                        direct: "center",
                        sqlBlock: "",
                        backdatas: "orgs",
                        ignorecase: "true", //忽略大小写
                        searchlist: ["code", "orgname"],
                        postdata: {}
                    };
                    $modal.openCommonSearch({
                        classId: 'scporg',
                        searchWhenReady: true
                    }).result.then(function (result) {
                        var a = $scope.gridOptions_organizations.hcApi.getRowData();
                        // console.log("11", a)
                        var b = $scope.gridOptions_organizations.hcApi.getRowData().map(function (data) {
                            return data.orgid;
                        });
                        if (b.indexOf(result.orgid) < 0) {
                            a.push(result);
                        }
                        $scope.gridOptions_organizations.hcApi.setRowData(a);
                    })


                };

                //删除行/用户数据
                $scope.deleteLineRow2 = function () {
                    var index = $scope.gridOptions_organizations.hcApi.getFocusedRowIndex();
                    if (index < 0) {
                        return swalApi.info('请先选中要删除的行').then($q.reject);
                    }
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除第" + (index + 1) + "行的数据吗?",
                        okFun: function () {
                            // console.log("选中行", $scope.gridOptions_organizations.hcApi.getFocusedData())
                            var a = $scope.gridOptions_organizations.hcApi.getRowData();
                            a.splice(index, 1);
                            $scope.gridOptions_organizations.hcApi.setRowData(a);
                            $scope.gridOptions_organizations.api.focusedCellController.clearFocusedCell();
                        },
                        okTitle: '删除成功'
                    });
                };

                /*-------------------------------------APP权限树设置---------------------------------------------------*/
                var Appsetting1 = {
                    callback: {
                        // onClick: AppOnClick1
                    },
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pId",
                            rootPId: "0"
                        }
                    },
                    check: {
                        enable: true
                    }
                };




                // 查询树数据
                setAppMenuData.dataPromise = requestApi.post({
                    classId: "scpappmenu",
                    action: "search",
                    data: {}
                });

                //设置模块菜单数据
                function setAppMenuData(bizData) {
                    return setAppMenuData.dataPromise
                        .then(function (result) {
                            var app1Nodes = [];
                            result.scpappmenus.forEach(function (appmenu) {
                                var appNode = {};
                                appNode.name = appmenu.menuname;
                                appNode.id = appmenu.appmenuid;
                                appNode.pId = appmenu.pid;
                                appNode.isParent = true;
                                appNode.open = true;
                                appNode.data = appmenu;
                                if (!$scope.data.currItem.scproleappmenus) {
                                    $scope.data.currItem.scproleappmenus = [];
                                }
                                $scope.data.currItem.scproleappmenus.forEach(function (data) {
                                    if (data.appmenuid == appmenu.appmenuid && data.entid == userbean.entid) {
                                        appNode.checked = true;
                                    }
                                });
                                app1Nodes.push(appNode);
                            });
                            var appTree1 = $("#app1");
                            $scope.app1 = zTreeApi.create(appTree1, Appsetting1);
                            $scope.app1.addNodes(null, app1Nodes);

                            console.log(app1Nodes);
                            console.log("数据", $scope.data.currItem);
                        })
                }
                /*-------------------------------------APP权限树设置结束------------------------------------------------*/

                var setting1 = {
                    callback: {
                        onClick: zTreeOnClick1,
                    },
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pId",
                            rootPId: "0"
                        }
                    },
                    check: {
                        enable: true
                    }
                };

                //左边树单击事件
                function zTreeOnClick1(event, ztree, node) {
                    $scope.zTree2.refresh();
                    // console.log('11', node)
                    $scope.zTree2.hideNodes($scope.zTree2.getNodes());
                    var showNodes = $scope.zTree2.getNodesByParam("modid", node.id, null);
                    // console.log(showNodes)
                    $scope.zTree2.showNodes(showNodes);

                    /*处理权限网格数据*/
                    if (node.data.isws == 2) {
                        var wsGridDatas = [];
                        $scope.ws.workspaceofsyss.forEach(function (item) {
                            if (item.modid == node.data.modid && item.entid == userbean.loginents[0].entid)
                                wsGridDatas.push(item)
                        });
                        if ($scope.data.currItem.rightofroles) {
                            wsGridDatas.forEach(function (itemG) {
                                $scope.data.currItem.rightofroles.forEach(function (itemR) {
                                    if (itemG.entid == itemR.entid && itemG.modid == itemR.modid && itemG.objtype == itemR.objtype) {
                                        itemG.objaccess = itemR.objright;
                                        jurisdictionApi.analysisRights({ objaccess: itemG.objaccess, obj: itemG });
                                    }
                                })
                            });
                        }
                        $scope.wsGridOptions.hcApi.setRowData(wsGridDatas);
                        $scope.ws.showGrid = true;
                    } else {
                        $scope.ws.showGrid = false;
                        $scope.wsGridOptions.hcApi.setRowData([]);
                    }
                }

                //右边的树参数
                var setting2 = {
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pId",
                            rootPId: "0"
                        }
                    },
                    check: {
                        enable: true
                    }
                };

                // 查询树数据
                setModMenuData.dataPromise = requestApi.post({
                    classId: "scpuser",
                    action: "getsysmodandmenu",
                    data: {}
                });

                //设置模块菜单数据
                function setModMenuData(bizData) {
                    return setModMenuData.dataPromise
                        .then(function (result) {
                            var zTree1Nodes = [];
                            // for (var i = 0; i < result.modofsyss.length; i++) {
                            result.modofsyss.forEach(function (mod) {
                                var modNode = {};
                                modNode.name = mod.modname;
                                modNode.id = mod.modid;
                                modNode.pId = mod.modpid;
                                modNode.isParent = true;
                                modNode.open = true;
                                modNode.data = mod;
                                if (!$scope.data.currItem.modofroles) {
                                    $scope.data.currItem.modofroles = [];
                                }
                                $scope.data.currItem.modofroles.forEach(function (data) {
                                    if (data.modid == mod.modid) {
                                        modNode.checked = true;
                                    }
                                })
                                zTree1Nodes.push(modNode);
                            });
                            var zTree2Nodes = [];
                            result.menuofsyss.forEach(function (menu) {
                                // for (var i = 0; i < result.menuofsyss.length; i++) {
                                var menuNode = {};
                                menuNode.name = menu.menuname;
                                menuNode.id = menu.menuid;
                                menuNode.pId = menu.menupid;
                                menuNode.isParent = true;
                                menuNode.open = true;
                                menuNode.data = menu;
                                menuNode.modid = menu.modid;
                                menuNode.isHidden = true;
                                if (!$scope.data.currItem.menuofroles) {
                                    $scope.data.currItem.menuofroles = [];
                                }
                                $scope.data.currItem.menuofroles.forEach(function (data) {
                                    if (data.menuid == menu.menuid) {
                                        menuNode.checked = true;
                                    }
                                })
                                zTree2Nodes.push(menuNode);
                            });


                            var modTree = $("#zTree1");
                            $scope.zTree1 = zTreeApi.create(modTree, setting1);
                            $scope.zTree1.addNodes(null, zTree1Nodes);
                            var menuTree = $("#zTree2");
                            $scope.zTree2 = zTreeApi.create(menuTree, setting2);
                            $scope.zTree2.addNodes(null, zTree2Nodes);
                            // console.log(zTree1Nodes)
                            // console.log("数据", $scope.data.currItem);

                            //放入财务人员数据到表格
                            $scope.gridOptions_users.hcApi.setRowData($scope.data.currItem.userofroles);
                            $scope.gridOptions_organizations.hcApi.setRowData($scope.data.currItem.orgofroles);


                        })
                        /*权限相关*/
                        .then(function () {
                            return requestApi.post("base_search", "getsysinfo", {})
                        })
                        .then(function (data) {
                            $scope.ws.workspaceofsyss = data.workspaceofsyss;
                        });
                }

                //权限 模块树加载

                // //重写保存方法

                /**
                 * 修改【全运营单元共享】时
                 */
                $scope.onAllEntChange = function onAllEntChange() {
                    if ($scope.data.currItem.allent == 2) {
                        $scope.data.currItem.entofroles = [];
                        $scope.entGridOptions.hcApi.setRowData($scope.data.currItem.entofroles);
                    }
                    else {
                        $scope.footerLeftButtons.addEnt.click();
                    }
                };

                /**
                 * 运营单元表格
                 */
                $scope.entGridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'entid',
                        headerName: '运营单元ID'
                    }, {
                        field: 'entname',
                        headerName: '运营单元名称'
                    }]
                };

                angular.extend($scope.footerLeftButtons, {
                    addEnt: {
                        icon: 'fa fa-plus',
                        hide: function () {
                            return $scope.$eval('!tabs.base.active||data.currItem.allent==2');
                        },
                        click: function () {
                            $modal
                                .openCommonSearch({
                                    classId: 'scpent',
                                    title: '请选择角色所属的运营单元',
                                    checkbox: true,
                                    postData: {
                                        scpents: $scope.entGridOptions.hcApi.getRowData().map(function (ent) {
                                            return {
                                                entid: ent.entid
                                            };
                                        })
                                    }
                                })
                                .result
                                .then(function (ents) {
                                    var entIdMapEnt = {};

                                    $scope.entGridOptions.api.forEachNode(function (node) {
                                        entIdMapEnt[node.data.entid] = node.data;
                                    });

                                    ents = ents.filter(function (ent) {
                                        return !entIdMapEnt[ent.entid];
                                    });

                                    if (ents.length) {
                                        $scope.entGridOptions.api.updateRowData({
                                            add: ents
                                        });
                                        $scope.data.currItem.entofroles = $scope.entGridOptions.hcApi.getRowData();
                                    }
                                });
                        }
                    },
                    deleteEnt: {
                        icon: 'fa fa-minus',
                        hide: function () {
                            return $scope.$eval('!tabs.base.active||data.currItem.allent==2');
                        },
                        click: function () {
                            $scope.entGridOptions.hcApi.removeSelections();
                            $scope.data.currItem.entofroles = $scope.entGridOptions.hcApi.getRowData();
                        }
                    }
                });

                /**
                 * 权限网格变化事件
                 * 保存网格信息
                 * @param obj
                 */
                function cellValueChanged(args) {
                    var active = 'insert';
                    args.data.objright = numberApi.bintoint(jurisdictionApi.createrRights(args.data));
                    $scope.data.currItem.rightofroles.forEach(function (item, i, arr) {
                        if (args.data.entid == item.entid && args.data.modid == item.modid && args.data.objtype == item.objtype) {
                            if (args.data.objright > 0) {
                                active = 'update';
                                arr[i] = args.data;
                            } else {
                                active = 'delete';
                                arr.splice(i, 1);
                            }
                        }
                    });
                    if (active == 'insert') {
                        $scope.data.currItem.rightofroles.push(args.data)
                    }
                }
            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });