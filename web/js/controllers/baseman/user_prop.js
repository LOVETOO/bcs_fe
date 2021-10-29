/**
 * 用户属性
 * @since 2019-01-02
 */
(function (defineFn) {
    // 
    define(['module', 'controllerApi', 'base_obj_prop', 'angular', 'numberApi', 'constant', 'requestApi', 'promiseApi', 'swalApi', 'zTreeApi', 'ztree.excheck'], defineFn);
})(function (module, controllerApi, base_obj_prop, angular, numberApi, constant, requestApi, promiseApi, swalApi, zTreeApi) {
    'use strict';

    UserProp.$inject = ['$scope', '$stateParams', '$modal', '$q'];

    function UserProp($scope, $stateParams, $modal, $q) {
        var hasRight = userbean.hasRole('OrgManagers', true);

        //继承基础控制器
        controllerApi.extend({
            controller: base_obj_prop.controller,
            scope: $scope
        });

        /**
         * @override
         */
        $scope.isFormReadonly = function () {
            return !hasRight || $scope.hcSuper.isFormReadonly();
        }

        var whenOrgSelected;

        function selectOrg(orgId) {
            return whenOrgSelected = requestApi
                .post({
                    classId: 'scporg',
                    action: 'select',
                    data: {
                        orgid: orgId
                    }
                })
                .then(function (response) {
                    $scope.defaultOrg = response;
                    return $scope.defaultOrg;
                });
        }

        /**
         * 标签页
         */
        angular.extend($scope.tabs, {
            entAndRole: {
                title: '职责和角色'
            },
            org: {
                title: '所属机构',
                hide: function () {
                    return $scope.data.isInsert;
                }
            },
            permission: {
                title: '权限',
                hide: function () {
                    return $scope.data.isInsert;
                }
            },
            position: {
                title: '所属岗位',
                hide: function () {
                    return $scope.data.isInsert;
                }
            },
        });

        /* 定义关联用户可操作数据 */
        $scope.isChangeUserType = false;

        /**
         * 修改用户类型
         *
         */
        $scope.changeUserType = function () {
            if ($scope.data.currItem.usertype == 3) {
                $scope.isChangeUserType = true;
            } else {
                $scope.data.currItem.customer_id = undefined;
                $scope.data.currItem.customer_code = undefined;
                $scope.isChangeUserType = false;
            }
        };

        /**
         * 用户查询
         */
        $scope.searchObjectCustomerOrg = {
            postData: {
                search_flag: 128
            },
            afterOk: function (custoemr) {
                ['customer_id', 'customer_code'].forEach(function (filed) {
                    $scope.data.currItem[filed] = custoemr[filed];
                })
            }
        };

        /**
         * 新增业务数据时
         * @override
         * @since 2019-01-03
         */
        $scope.newBizData = function (bizData) {
            var orgId = numberApi.toNumber($stateParams.orgId);

            if (orgId === 0) {
                console.error('无法新增用户：缺少必要路由参数 orgId');

                $scope.footerRightButtons.save.hide = true;

                $scope.isFormReadonly = function () {
                    return true;
                };

                return;
            }

            $scope.hcSuper.newBizData(bizData);

            bizData.parentid = orgId;
            bizData.parenttype = constant.objType.org;

            bizData.actived = 2;	//状态为可用
            bizData.enablepwd = 2;	//允许修改密码
            bizData.clas = 1; //仅限局域网

            bizData.entofusers = [];	//职责
            bizData.roleofusers = [];	//角色

            selectOrg(orgId).then(function () {
                bizData.entofusers.push({
                    entid: $scope.defaultOrg.entid,
                    entname: $scope.defaultOrg.entname
                });

                $scope.entGridOptions.hcApi.setRowData(bizData.entofusers);

                bizData.orgofusers = bizData.orgofusers ? bizData.orgofusers : [];
                //新增时默认机构设置（新增未保存之前，明细【所属机构】没有显示，如果此时改成显示，可能要后台新增方法）
                bizData.orgofusers.push({
                    entid: $scope.defaultOrg.entid,
                    orgid: $scope.defaultOrg.orgid,
                    orgname: $scope.defaultOrg.orgname,
                    isdefault: 2,
                    orgtype: $scope.defaultOrg.orgtype,//机构类型、机构路径、备注需设置，否则新增保存后这些无法显示
                    namepath: "\\" + $scope.defaultOrg.entname + "\\" + $scope.defaultOrg.orgname,
                    inheritrole: 2,
                    note: $scope.defaultOrg.note
                });
            });

            return setModMenuData();

        };

        /**
         * 设置业务数据时
         * @override
         * @since 2019-01-03
         */
        $scope.setBizData = function (bizData) {
            $scope.hcSuper.setBizData(bizData);

            $scope.shouldUpdatePass = userbean.shouldUpdatePass;//是否必须修改密码（首次登录、密码过期时）
            bizData.userpass = '';	//不显示密码

            $scope.entGridOptions.hcApi.setRowData(bizData.entofusers);	//运营单元
            //角色作为运营单元的子表动态设置数据 //角色

            $scope.orgGridOptions.hcApi.setRowData(bizData.orgofusers);	//所属机构

            $scope.positionGridOptions.hcApi.setRowData(bizData.positionofusers);	//所属岗位


            $scope.defaultOrg = bizData.orgofusers.find(function (org) {
                return org.isdefault == 2;
            });

            selectOrg($scope.defaultOrg.orgid);

            $scope.changeUserType(); // 是否客户

            return setModMenuData();
        };

        /**
         * 保存业务数据时
         * @override
         * @since 2019-01-14
         */
        $scope.saveBizData = function (bizData) {
            $scope.hcSuper.saveBizData(bizData);

            bizData.roleofusers = [];

            bizData.entofusers.forEach(function (ent) {
                Array.prototype.push.apply(bizData.roleofusers, ent.roles);
            });

            bizData.modofusers = [];
            bizData.menuofusers = [];
            //保存的时候，显示所有节点
            var menuNodes = $scope.zTree2.getNodes(); //这个方法只是取得了根节点的子节点
            menuNodes = $scope.zTree2.transformToArray(menuNodes); //再用这个方法才能得到所有的节点
            $scope.zTree2.showNodes(menuNodes);

            var currModCheckedNodes = $scope.zTree1.getCheckedNodes();
            for (var i = 0; i < currModCheckedNodes.length; i++) {
                bizData.modofusers.push(currModCheckedNodes[i].data);
            }
            var currMenuCheckedNodes = $scope.zTree2.getCheckedNodes();
            for (var i = 0; i < currMenuCheckedNodes.length; i++) {
                bizData.menuofusers.push(currMenuCheckedNodes[i].data);
            }
        };

        /**
         * 保存请求后的处理
         * @param responseData
         */
        $scope.doAfterSave = function (responseData) {
            //成功修改密码后关闭模态框
            if ($scope.shouldUpdatePass) {
                $scope.shouldUpdatePass = false;
                userbean.shouldUpdatePass = false;
            }
        };

        /**
         * 表单验证
         * 实现方式：收集验证不通过的信息
         * @param {string[]} invalidBox 信息盒子，字符串数组，验证不通过时，往里面放入信息即可
         * @override
         * @since 2019-01-03
         */
        $scope.validCheck = function (invalidBox) {
            $scope.hcSuper.validCheck(invalidBox);

            $scope.data.currItem.userpass = $scope.data.currItem.userpass || '';
            $scope.data.currItem.confirmuserpass = $scope.data.currItem.confirmuserpass || '';

            if ($scope.data.currItem.userpass !== $scope.data.currItem.confirmuserpass)
                invalidBox.push('', '2次输入的密码不一致，请检查');
        };

        /**
         * 修改账号时
         */
        $scope.doWhenUserIdChange = function () {
            if ($scope.form.username.$dirty || !$scope.data.isInsert) return;
            $scope.data.currItem.username = $scope.data.currItem.userid;
        };

        /**
         * 修改名称时
         */
        $scope.doWhenUserNameChange = function () {
            if ($scope.form.userid.$dirty || !$scope.data.isInsert) return;
            $scope.data.currItem.userid = $scope.data.currItem.username;
        };

        /**
         * 【运营单元】表格
         */
        $scope.entGridOptions = {
            hcName: '所属组织',
            hcRequired: true,
            defaultColDef: {
                cellStyle: {
                    'text-align': 'center'
                }
            },
            columnDefs: [{
                type: '序号'
            }, {
                field: 'entid',
                headerName: '组织ID'
            }, {
                field: 'entname',
                headerName: '组织名称',
                width: 200
            }],
            hcEvents: {
                cellFocused: function (params) {
                    params.node = $scope.entGridOptions.hcApi.getNodeOfRowIndex(params.rowIndex);

                    if ($scope.currEntNode !== params.node) {
                        $scope.currEntNode = params.node;

                        var ent = $scope.currEntNode.data;
                        ent.roles = ent.roles || [];

                        $scope.roleGridOptions.hcApi.setRowData(ent.roles);
                    }
                },
                rowDataUpdated: onEntGridDataChangedOrUpdated,
                rowDataChanged: onEntGridDataChangedOrUpdated
            }
        };

        /**
         * 当运营单元表格的数据改变或更新时
         */
        function onEntGridDataChangedOrUpdated() {
            $q.when().then(function () {
                $scope.entGridOptions.hcApi.setFocusedCell();

                if ($scope.entGridOptions.hcApi.isEmpty()) {
                    $scope.roleGridOptions.hcApi.setRowData([]);
                    $scope.currEntNode = null;
                }
            });
        }

        /**
         * 【角色】表格
         */
        $scope.roleGridOptions = {
            hcName: '角色',
            columnDefs: [{
                type: '序号'
            }, {
                field: 'roleid',
                headerName: '角色代号',
                width: 200,
                cellStyle: {
                    'text-align': 'center'
                }
            }, {
                field: 'rolename',
                headerName: '角色名称',
                width: 200,
                cellStyle: {
                    'text-align': 'center'
                }
            }, {
                field: 'note',
                headerName: '说明',
                width: 300
            }]
        };


        /**==============岗位页签 ===============================**/
        (function definePositionButton() {
            /**
             * 【岗位】表格
             */
            $scope.positionGridOptions = {
                hcName: '所属岗位',
                // hcRequired: function () {
                //     return !$scope.data.isInsert;
                // },
                columnDefs: [{
                    type: '序号'
                }, {
                    field: 'positionid',
                    headerName: '岗位名称',
                    cellStyle: {
                        'text-align': 'center'
                    }
                }, {
                    field: 'positiondesc',
                    headerName: '岗位描述',
                    width: 200,
                    cellStyle: {
                        'text-align': 'center'
                    }
                }, {
                    field: 'orgname',
                    headerName: '机构名称',
                    width: 100,
                    cellStyle: {
                        'text-align': 'center'
                    }
                }]
            };

            angular.extend($scope.footerLeftButtons, {
                addPosition: {
                    icon: 'fa fa-plus',
                    hide: function () {
                        return !$scope.tabs.position.active;
                    },
                    click: function () {
                        $modal
                            .openCommonSearch({
                                classId: 'scpposition',
                                checkbox: true,
                                postData: {
                                    positions: $scope.positionGridOptions.hcApi.getRowData()
                                }
                            })
                            .result
                            .then(function (positions) {
                                //模态框查询已统一添加过滤，查询方法返回结果不会与已选择内容重复
                                positions.forEach(function (cur) {
                                    $scope.data.currItem.positionofusers.push(cur);
                                });

                                $scope.positionGridOptions.hcApi.setRowData($scope.data.currItem.positionofusers);
                                $scope.positionGridOptions.hcApi.refreshCells();

                                /*var positionIdMapOrg = {};

                                $scope.positionGridOptions.api.forEachNode(function (node) {
                                    positionIdMapOrg[node.data.orgid] = node.data;
                                });

                                positions = positions.filter(function (org) {
                                    return !positionIdMapOrg[org.orgid];
                                });

                                if (positions.length) {
                                    $scope.positionGridOptions.api.updateRowData({
                                        add: positions
                                    });
                                    $scope.data.currItem.positionofusers = $scope.positionGridOptions.hcApi.getRowData();
                                }*/
                            });
                    }
                },
                deletePosition: {
                    icon: 'fa fa-minus',
                    hide: function () {
                        return !$scope.tabs.position.active;
                    },
                    click: function () {
                        $scope.positionGridOptions.hcApi.removeSelections();
                        $scope.data.currItem.positionofusers = $scope.positionGridOptions.hcApi.getRowData();
                    }
                }
            });
        })();

        /**==============【运营单元】和【角色】页签 ===============================**/
        /**
         * 【运营单元】和【角色】的按钮
         */
        (function defineEntAndRoleButton() {
            /**
             * 何时隐藏【运营单元】和【角色】的按钮
             */
            function whenToHideEntAndRoleButton() {
                return !$scope.tabs.entAndRole.active;
            }

            angular.extend($scope.footerLeftButtons, {
                addEnt: {
                    title: '关联组织',
                    icon: 'fa fa-plus',
                    click: function () {
                        $modal
                            .openCommonSearch({
                                classId: 'scpent',
                                title: '请选择用户所属的组织',
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
                                    var newFocusedRowIndex = $scope.entGridOptions.api.getModel().getRowCount();

                                    ents.forEach(function (ent) {
                                        ent.roles = [];
                                    });

                                    $scope.entGridOptions.api.updateRowData({
                                        add: ents
                                    });

                                    $scope.data.currItem.entofusers = $scope.entGridOptions.hcApi.getRowData();

                                    $scope.entGridOptions.hcApi.setFocusedCell(newFocusedRowIndex);
                                }
                            });
                    },
                    hide: whenToHideEntAndRoleButton
                },
                deleteEnt: {
                    title: '取消关联组织',
                    icon: 'fa fa-minus',
                    click: function () {
                        // if (
                        //     $scope.entGridOptions.hcApi.getSelectedNodes('auto').some(function (node) {
                        //         return node.data.entid == $scope.defaultOrg.entid;
                        //     })
                        // ) {
                        //     return swalApi.error([
                        //         '默认机构所属的组织不能取消关联',
                        //         $scope.defaultOrg.entid + ' - ' + $scope.defaultOrg.entname
                        //     ]);
                        // }

                        $scope.entGridOptions.hcApi.removeSelections();
                        $scope.data.currItem.entofusers = $scope.entGridOptions.hcApi.getRowData();
                    },
                    hide: whenToHideEntAndRoleButton
                },
                addRole: {
                    title: '关联角色',
                    icon: 'fa fa-plus',
                    click: function () {
                        if (!$scope.currEntNode) return;

                        var ent = $scope.currEntNode.data;

                        $modal
                            .openCommonSearch({
                                classId: 'scprole',
                                checkbox: true,
                                postData: {
                                    entid: ent.entid,
                                    roles: $scope.roleGridOptions.hcApi.getRowData().map(function (role) {
                                        return {
                                            roleid: role.roleid
                                        };
                                    })
                                }
                            })
                            .result
                            .then(function (roles) {
                                var roleIdToRole = {};

                                $scope.roleGridOptions.api.forEachNode(function (node) {
                                    roleIdToRole[node.data.roleid] = node.data;
                                });

                                roles = roles.filter(function (role) {
                                    return !roleIdToRole[role.roleid];
                                });

                                if (roles.length) {
                                    roles.forEach(function (role) {
                                        role.entid = ent.entid
                                    });

                                    $scope.roleGridOptions.api.updateRowData({
                                        add: roles
                                    });

                                    $scope.currEntNode.data.roles = $scope.roleGridOptions.hcApi.getRowData();
                                }
                            });
                    },
                    hide: function () {
                        return !$scope.currEntNode || whenToHideEntAndRoleButton();
                    }
                },
                deleteRole: {
                    title: '取消关联角色',
                    icon: 'fa fa-minus',
                    click: function () {
                        $scope.roleGridOptions.hcApi.removeSelections();

                        $scope.currEntNode.data.roles = $scope.roleGridOptions.hcApi.getRowData();
                    },
                    hide: function () {
                        return !$scope.currEntNode || whenToHideEntAndRoleButton();
                    }
                }
            });

            /**
             * 【机构】表格
             */
            $scope.orgGridOptions = {
                hcName: '所属机构',
                hcRequired: function () {
                    return !$scope.data.isInsert;
                },
                columnDefs: [
                    {
                        type: '序号'
                    },
                    {
                        field: 'isdefault',
                        headerName: '默认机构',
                        type: '是否',
                        cellStyle: {
                            'text-align': 'center'
                        }
                    },
                    {
                        field: 'orgname',
                        headerName: '机构名称',
                        width: 200,
                        cellStyle: {
                            'text-align': 'center'
                        }
                    },
                    {
                        field: 'orgtype',
                        headerName: '机构类型',
                        hcDictCode: 'org_type',
                        width: 100,
                        cellStyle: {
                            'text-align': 'center'
                        }
                    },
                    {
                        field: 'namepath',
                        headerName: '机构路径',
                        width: 400
                    },
                    {
                        field: 'inheritrole',
                        headerName: '继承机构角色权限',
                        type: '是否',
                        editable: true
                    },
                    {
                        field: 'note',
                        headerName: '备注'
                    }]
            };

            angular.extend($scope.footerLeftButtons, {
                addOrg: {
                    icon: 'fa fa-plus',
                    hide: function () {
                        return !$scope.tabs.org.active;
                    },
                    click: function () {
                        $modal
                            .openCommonSearch({
                                classId: 'scporg',
                                checkbox: true,
                                postData: {
                                    orgs: $scope.orgGridOptions.hcApi.getRowData()
                                }
                            })
                            .result
                            .then(function (orgs) {
                                //模态框查询已统一添加过滤，查询方法返回结果不会与已选择内容重复
                                orgs.forEach(function (cur, idx) {
                                    cur.inheritrole = 2;
                                    $scope.data.currItem.orgofusers.push(cur);
                                });

                                $scope.orgGridOptions.hcApi.setRowData($scope.data.currItem.orgofusers);
                                $scope.orgGridOptions.hcApi.refreshCells();

                                /*var orgIdMapOrg = {};

                                $scope.orgGridOptions.api.forEachNode(function (node) {
                                    orgIdMapOrg[node.data.orgid] = node.data;
                                });

                                orgs = orgs.filter(function (org) {
                                    return !orgIdMapOrg[org.orgid];
                                });

                                if (orgs.length) {
                                    $scope.orgGridOptions.api.updateRowData({
                                        add: orgs
                                    });

                                    $scope.data.currItem.orgofusers = $scope.orgGridOptions.hcApi.getRowData();
                                }*/
                            });
                    }
                },
                deleteOrg: {
                    icon: 'fa fa-minus',
                    hide: function () {
                        return !$scope.tabs.org.active;
                    },
                    click: function () {
                        if (
                            $scope.orgGridOptions.hcApi.getSelectedNodes('auto').some(function (node) {
                                return node.data.isdefault == 2;
                            })
                        ) {
                            return swalApi.error([
                                '默认机构不能取消关联',
                                $scope.defaultOrg.orgname
                            ]);
                        }

                        $scope.orgGridOptions.hcApi.removeSelections();
                        $scope.data.currItem.orgofusers = $scope.orgGridOptions.hcApi.getRowData();
                    }
                }
            });
        })();


        /**==============权限树表格 ===============================**/

        //左边的树参数
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
        }

        //左边树单击事件
        function zTreeOnClick1(event, ztree, node) {
            $scope.zTree2.refresh();
            // console.log('11', node)
            $scope.zTree2.hideNodes($scope.zTree2.getNodes());
            var showNodes = $scope.zTree2.getNodesByParam("modid", node.id, null);
            // console.log(showNodes)
            $scope.zTree2.showNodes(showNodes);

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

        }


        // 查询树数据
        setModMenuData.dataPromise = requestApi.post({
            classId: "scpuser",
            action: "getsysmodandmenu",
            data: {}
        });

        //设置模块菜单数据
        function setModMenuData() {
            // 查询树数据
            return setModMenuData.dataPromise.then(function (result) {
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
                    if (!$scope.data.currItem.modofusers) {
                        $scope.data.currItem.modofusers = [];
                    }
                    $scope.data.currItem.modofusers.forEach(function (data) {
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
                    if (!$scope.data.currItem.menuofusers) {
                        $scope.data.currItem.menuofusers = [];
                    }
                    $scope.data.currItem.menuofusers.forEach(function (data) {
                        if (data.menuid == menu.menuid) {
                            menuNode.checked = true;
                        }
                    })
                    zTree2Nodes.push(menuNode);
                });

                var modTree = $("#mod_tree");
                $scope.zTree1 = zTreeApi.create(modTree, setting1);
                $scope.zTree1.addNodes(null, zTree1Nodes);
                var menuTree = $("#menu_tree");
                $scope.zTree2 = zTreeApi.create(menuTree, setting2);
                $scope.zTree2.addNodes(null, zTree2Nodes);
                // console.log(zTree1Nodes)
                // console.log("数据", $scope.data.currItem);
            })
        }
    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: UserProp
    });
});