function my_settings($scope, $location, $state, $http, $rootScope, $modal, BasemanService, localeStorageService, $timeout) {
    my_settings = HczyCommon.extend(my_settings, ctrl_bill_public);
    my_settings.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    $scope.data = {}
    $scope.data.currItem = {}
    $scope.data.currItem.agents = {}


    //选择流程弹出框控制器
    var choose_wf = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
            choose_wf = HczyCommon.extend(choose_wf, ctrl_bill_public);
            choose_wf.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
            $scope.objconf = {
                name: "myfiles",
                key: "fileid",
                FrmInfo: {},
                grids: []
            };

            $scope.onDblClick = function (params) {
                var data = $scope.wfOptions.api.getModel().getRow(params.rowIndex).data
                $modalInstance.close(data);
            }
            $scope.onClick = function(params){
                $scope.returndata = $scope.wfOptions.api.getModel().getRow(params.rowIndex).data
            }
            $scope.wfOptions = {
                groupKeys: undefined,
                groupHideGroupColumns: false,
                enableColResize: true, //one of [true, false]
                enableSorting: false, //one of [true, false]
                enableFilter: false, //one of [true, false]
                enableStatusBar: false,
                enableRangeSelection: false,
                rowDeselection: false,
                fixedGridHeight: true,
                quickFilterText: null,
                groupSelectsChildren: false, // one of [true, false]
                suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
                rowDoubleClicked: $scope.onDblClick,
                rowClicked:$scope.onClick,
                // groupColumnDef: groupColumn,
                ColumnDef: $scope.lineColumns,
                showToolPanel: false,
                toolPanelSuppressSideButtons: true,
                rowHeight: 30
            }
            $scope.wfColumns = [
                {
                    id: "seq",
                    headerName: "序号",
                    field: "seq",
                    behavior: "select",
                    cssClass: "cell-selection",
                    width: 75,
                },
                {
                    id: "wftempname",
                    headerName: "名称",
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
                    headerName: "时间",
                    behavior: "select",
                    field: "createtime",
                    editable: false,
                    filter: 'set',
                    width: 200,
                    cellEditor: "年月日",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }
            ]

            var zTree = {}
            var zTreeNodes = []
            $scope.ok = function () {
                $modalInstance.close($scope.returndata);
            }
            $scope.cancel = function (e) {
                $modalInstance.dismiss('cancel');
            }
            var setting = {
                // async: {
                //     enable: true,
                //     url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
                //     autoParam: ["id", "name=n", "level=lv"],
                //     otherParam: {
                //         "flag": 1
                //     },
                //     // dataFilter: filter
                // },
                callback: {
                    onClick: zTreeOnClick,
                    beforeExpand: beforeExpand
                }
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
                        zTree.removeChildNodes(treeNode);
                        zTree.addNodes(treeNode, zTreeNodes);
                        //标记为已加载数据
                        treeNode.isLoadChilded = true;
                        zTree.updateNode($scope.currentNode);
                    });
            }

            function showIconForTree(treeId, treeNode) {
                return !treeNode.isParent;
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
                    zTree = $.fn.zTree.init(angular.element("#treeDemo4"), setting, []);
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
                    zTree.addNodes(null, zTreeNodes);
                    //加载网格数据
                    var param = {
                        "fdrid": data.fdrs[0].fdrid
                    }
                    BasemanService.RequestPost("scpfdr", "selectref", param).then(function (data) {
                        setGridData(data.wftemps);
                    });
                    //1级
                    $.each(zTreeNodes, function (i, item) {
                        var treeNode = zTree.getNodeByParam("id", item.id);
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
                                zTree.addNodes(treeNode, zTreeNodes);
                                //标记为已加载数据
                                treeNode.isLoadChilded = true;
                                zTree.updateNode($scope.currentNode);
                                //2级
                                $.each(zTreeNodes, function (i, item) {
                                    var treeNode = zTree.getNodeByParam("id", item.id);
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
                                            zTree.addNodes(treeNode, zTreeNodes);
                                            //标记为已加载数据
                                            treeNode.isLoadChilded = true;
                                            zTree.updateNode($scope.currentNode);
                                        });
                                });
                            });
                    });
                });
            }

            function load_tree(treeNode) {
                var param = {
                    "fdrid": treeNode.id,
                }
                BasemanService.RequestPost("scpfdr", "selectref", param).then(function (data) {
                    //列表加载
                    setGridData(data.wftemps);
                    zTree.expandNode($scope.currentNode, true, false, false);
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
                        zTree.removeChildNodes($scope.currentNode);
                        zTree.addNodes($scope.currentNode, zTreeNodes);
                        //标记为已加载数据
                        $scope.currentNode.isLoadChilded = true;
                        zTree.updateNode($scope.currentNode);
                    }
                });
            }

            /**
             * 树单击事件
             */
            function zTreeOnClick(event, treeId, treeNode) {
                $scope.currentNode = treeNode
                load_tree(treeNode);
            };

            /**
             * 加载网格数据
             */
            function setGridData(datas) {

                //加序号
                if (datas.length > 0) {
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].seq = i + 1;
                    }
                }
                //设置数据
                $scope.wfOptions.api.setRowData(datas);
            }

            $scope.init_Tree();

        }

    //出差
    var scpuseragen = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance, FormValidatorService) {
        scpuseragen = HczyCommon.extend(scpuseragen, ctrl_bill_public);
        scpuseragen.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

        $scope.title = '出差设置';

        $scope.refresh = function (flag) {

            $scope.data = {};
            $scope.data.currItem = {
                gooutstarttime: '',
                gooutendtime: '',
                useragentofusers: []
            };
            //页面加载时,要将出差消息显示出来
            BasemanService.RequestPost("scpuser", "getagent", {
                userid: userbean.userid
            })
                .then(function (data) {
                    $scope.userid = data.userid;
                    if (parseInt(data.goout) == 2) {
                        $("input[type='checkbox']").attr("checked", true);
                    }
                    $scope.data.currItem.gooutstarttime = data.gooutstarttime;
                    $scope.data.currItem.gooutendtime = data.gooutendtime;
                    $scope.gridSetData('gooutOptions', data.useragentofusers);
                });

            if ($scope.refresh_after && typeof $scope.refresh_after == "function") {
                try {
                    $scope.refresh_after();
                } catch (error) {
                    BasemanService.notice(error.message)
                }
            }
            $scope.setgridstat(1);
            $scope.setitemline1($scope.data.currItem);

            if (flag != 2) {
                BasemanService.notice("刷新成功", "alert-info");
            }
            //处理网格全选
            var ecells = $(".selectAll");
            for (var i = 0; i < ecells.length; i++) {
                ecells[i].children[1].attributes.style.nodeValue = "display: inline;"
                ecells[i].children[0].attributes.style.nodeValue = "display: none;"
            }
        };

        $scope.ok_save = function (e) {

            var checklist = [{
                key: 'gooutstarttime',
                desc: '出差时间'
            },
                {
                    key: 'gooutendtime',
                    desc: '结束时间'
                }
            ];
            var item = $scope.data.currItem;
            for (var i = 0; i < checklist.length; i++) {
                var value = checklist[i]
                if (item[value.key] == 0 || item[value.key] == '' || item[value.key] == undefined) {
                    BasemanService.notice(value.desc + '为空，请输入！', "alert-warning");
                    return;
                }
            }

            var gooutstarttime = $scope.data.currItem.gooutstarttime;
            var gooutendtime = $scope.data.currItem.gooutendtime;
            //开始时间毫秒值
            var a = (new Date(gooutstarttime.replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数
            var b = (new Date(gooutendtime.replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数

            if (a > b) {
                BasemanService.notice("开始时间不能大于结束时间", "alert-warning");
                return;
            }
            var msg = [];
            var lines = $scope.gridGetData('gooutOptions');
            for (var i = 0; i < lines.length; i++) {
                var value = lines[i];
                var agentid = value.agentid;
                var wftempid = value.wftempid;
                if (agentid == '' || agentid == 0 || agentid == undefined) {
                    msg.push('明细第' + (i + 1) + '行代理用户不能为空，请修改！');
                }
                if (wftempid == '' || wftempid == 0 || wftempid == undefined) {
                    msg.push('明细第' + (i + 1) + '行代理流程不能为空，请修改！');
                }
            }

            if (msg.length > 0) {
                BasemanService.notice(msg, "alert-warning");
                return;
            }
            $scope.goout = 1;
            //判断用户是否选择出差
            if ($("input[type='checkbox']").is(':checked')) {
                $scope.goout = 2;
            }

            //发包保存
            BasemanService.RequestPost("scpuser", "changeagent", {
                userid: $scope.userid,
                goout: $scope.goout,
                gooutstarttime: $scope.data.currItem.gooutstarttime,
                gooutendtime: $scope.data.currItem.gooutendtime,
                useragentofusers: lines

            }).then(function (data) {
                try {
                    $modalInstance.close(data);
                } catch (e) {
                    BasemanService.notice(e, "alert-warning");
                }
            });
        }

        $scope.cancel = function (e) {
            $modalInstance.dismiss('cancel');
        }


        //新增
        $scope.addItem = function () {
            $scope.gridAddItem('gooutOptions', {});
        }

        //删除行
        $scope.delItem = function () {
            $scope.gridDelItem('gooutOptions');
        }
        $scope.gooutOptions = {
            rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
            pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
            groupKeys: undefined,
            groupHideGroupColumns: false,
            enableColResize: true, //one of [true, false]
            enableSorting: true, //one of [true, false]
            enableFilter: true, //one of [true, false]
            enableStatusBar: false,
            fixedGridHeight: true,
            enableRangeSelection: false,
            rowSelection: "single", // one of ['single','multiple'], leave blank for no selection
            rowDeselection: false,
            quickFilterText: null,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            showToolPanel: false,
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.reseau = [{
            headerName: "序号", //标题
            field: "seq", //字段名
            editable: false, //是否可编辑
            width: 90, //宽度
            cellEditor: "整数框", //字段类型:"年月日"、"时分秒"、"下拉框"、"弹出框"、"文本框"、"整数框"、"浮点框"、"复选框"、"树状结构"、"选择框
            filter: 'number', //过滤类型 text, number, set, date
            valueGetter: function (params) {
                return parseInt(params.node.id) + 1;
            },
            enableRowGroup: true, //是否允许作为汇总条件
            enablePivot: true, //是否允许Toolpanel显示
            enableValue: true, //固定值
            floatCell: true //固定值
        }, {
            headerName: "代理用户",
            field: "agentname",
            editable: true,
            filter: 'text',
            width: 140,
            cellEditor: "弹出框",
            action: $scope.agentid,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "代理流程",
            field: "wftempname",
            editable: true,
            filter: 'text',
            width: 333,
            cellEditor: "弹出框",
            action: $scope.wftempid,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
        $scope.initdata();
        $timeout(function () {
            $scope.refresh(2);
        }, 1000);
    }


    /**
     * ------------------------------弹出查询事件方法集合----------------------------
     */

    //获取网格代理人方法
    $scope.agentid = function () {
        BasemanService.chooseUser({
            title: '人员查询',
            scope: $scope,
            then: function (res) {
                var data = $scope.gridGetRow("gooutOptions");
                data.agentid = res.employee_code;
                data.agentname = res.employee_name;
                $scope.gridUpdateRow("gooutOptions", data);
            }
        });
    }

    //代理流程查询
    $scope.wftempid = function () {
        //弹出选择流程
        BasemanService.openFrm("views/baseman/choose_wf.html", choose_wf, $scope, "", "", false).result.then(function (res) {
            var data = $scope.gridGetRow("gooutOptions");
            data.wftempid = res.wftempid;
            data.wftempname = res.wftempname;
            $scope.gridUpdateRow("gooutOptions", data);
        })
    }

    //新增
    $scope.addItem = function () {
        $scope.gridAddItem('gooutOptions', {});
    }



    /**
     * 网格列选项属性定义
     * @type {{rowGroupPanelShow: string, pivotPanelShow: string, groupKeys: undefined, groupHideGroupColumns: boolean, enableColResize: boolean, enableSorting: boolean, enableFilter: boolean, enableStatusBar: boolean, fixedGridHeight: boolean, enableRangeSelection: boolean, rowSelection: string, rowDeselection: boolean, quickFilterText: null, groupSelectsChildren: boolean, suppressRowClickSelection: boolean, showToolPanel: boolean, icons: {columnRemoveFromGroup: string, filter: string, sortAscending: string, sortDescending: string}}}
     */
    /**---------------------个人资料----------*/
    $scope.userImfoOptions = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        fixedGridHeight: true,
        enableRangeSelection: false,
        rowSelection: "single", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        showToolPanel: false,
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    }

    $scope.userImfoColumns = [
        {
            headerName: "序号", //标题
            field: "seq", //字段名
            editable: false, //是否可编辑
            width: 90, //宽度
            cellEditor: "整数框", //字段类型:"年月日"、"时分秒"、"下拉框"、"弹出框"、"文本框"、"整数框"、"浮点框"、"复选框"、"树状结构"、"选择框
            filter: 'number', //过滤类型 text, number, set, date
            valueGetter: function (params) {
                return parseInt(params.node.id) + 1;
            },
            enableRowGroup: true, //是否允许作为汇总条件
            enablePivot: true, //是否允许Toolpanel显示
            enableValue: true, //固定值
            floatCell: true //固定值
        }, {
            headerName: "姓名",
            field: "username",
            editable: true,
            filter: 'text',
            width: 140,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "部门",
            field: "dept",
            editable: true,
            filter: 'text',
            width: 140,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "职位",
            field: "wftempname",
            editable: true,
            filter: 'text',
            width: 140,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生日",
            field: "wftempname",
            editable: true,
            filter: 'text',
            width: 140,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "手机",
            field: "mobile",
            editable: true,
            filter: 'text',
            width: 140,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "邮箱",
            field: "wftempname",
            editable: true,
            filter: 'text',
            width: 140,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "住址",
            field: "wftempname",
            editable: true,
            filter: 'text',
            width: 140,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
    ]


    /**---------------------出差设置----------*/


    $scope.gooutOptions = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        fixedGridHeight: true,
        enableRangeSelection: false,
        rowSelection: "single", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        showToolPanel: false,
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    }

    $scope.gooutColumns = [
        {
            headerName: "序号", //标题
            field: "seq", //字段名
            editable: false, //是否可编辑
            width: 90, //宽度
            cellEditor: "整数框", //字段类型:"年月日"、"时分秒"、"下拉框"、"弹出框"、"文本框"、"整数框"、"浮点框"、"复选框"、"树状结构"、"选择框
            filter: 'number', //过滤类型 text, number, set, date
            valueGetter: function (params) {
                return parseInt(params.node.id) + 1;
            },
            enableRowGroup: true, //是否允许作为汇总条件
            enablePivot: true, //是否允许Toolpanel显示
            enableValue: true, //固定值
            floatCell: true //固定值
        }, {
            headerName: "代理用户",
            field: "agentname",
            editable: true,
            filter: 'text',
            width: 140,
            cellEditor: "弹出框",
            action: $scope.agentid,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            headerName: "代理用户名称",
            field: "agentname",
            editable: true,
            filter: 'text',
            width: 140,
            cellEditor: "文本框",
            // action: $scope.agentid,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editable: false
        }, {
            headerName: "代理流程",
            field: "wftempname",
            editable: true,
            filter: 'text',
            width: 333,
            cellEditor: "弹出框",
            action: $scope.wftempid,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "操作",
            field: "wftempname",
            editable: true,
            filter: 'text',
            width: 76,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellRenderer: function (params) {
                return $scope.gooutbuttonRenderer(params)
            }
        }
    ]


    /**--------------------------------保存数据方法-------------------------------------------------*/
    /**
     * 保存个人资料
     */
    $scope.saveUserImfo = function () {
        BasemanService.RequestPost("scpuser", "update", {"userid": strUserId}).then(function (result) {
            $scope.data.currItem = result;
        })
    }

    /**
     * 出差设置
     */
    $scope.gooutSetting = function () {

        //删除按钮
        $scope.gooutbuttonRenderer = function (params) {
            this.button = $('<div class="btn-group"></div>');
            $button = $('<button class="btn btn-white btn-xs"  style="padding-top: 0px;padding-bottom: 0px">删除</button>');
            $button.on("click", $scope.delLineData);
            this.button.append($button);
            return this.button[0];
        }

        //页面加载时,要将出差消息显示出来
        BasemanService.RequestPost("scpuser", "getagent", {
            userid: userbean.userid
        })
            .then(function (data) {
                $scope.data.currItem.agents = data;
                $scope.userid = data.userid;
                $scope.goout = data.goout
                if (parseInt(data.goout) == 2) {
                    $("input[type='checkbox']").attr("checked", true);
                }
                $scope.data.currItem.gooutstarttime = data.gooutstarttime;
                $scope.data.currItem.gooutendtime = data.gooutendtime;
                $scope.gridSetData('gooutOptions', data.useragentofusers);
            });

        //删除明细
        $scope.delLineData = function (o) {
            var flag = 0;//是否空行
            var idx = $scope.gooutOptions.api.getFocusedCell().rowIndex;

            var lines = $scope.gridGetData('gooutOptions');
            var agentid = lines[idx].agentid;
            var wftempid = lines[idx].wftempid;

            if (!agentid || !wftempid) {
                flag = 1;
            }

            if(flag == 1){
                $scope.gridDelItem('gooutOptions');
            }else{ //非空行先询问
                BasemanService.swalDelete("删除","确定删除？",function(bool){
                    if(bool){
                        $scope.gridDelItem('gooutOptions');
                    }else{
                        return;
                    }
                })
            }
        }

        /**
         * 是否出差复选框改变事件
         */
        $scope.gooutChange = function (e) {
            if($scope.goout == 1){
                $scope.data.currItem.gooutstarttime = "";
                $scope.data.currItem.gooutendtime = "";
            }
        }

        /**
         * 保存
         * @param e
         */
        $scope.gooutsave = function (e) {
            var checklist = [{
                key: 'gooutstarttime',
                desc: '出差时间'
            },
                {
                    key: 'gooutendtime',
                    desc: '结束时间'
                }
            ];
            var item = $scope.data.currItem;
            if($scope.goout = 2){
                for (var i = 0; i < checklist.length; i++) {
                    var value = checklist[i]
                    if (item[value.key] == 0 || item[value.key] == '' || item[value.key] == undefined) {
                        BasemanService.notice(value.desc + '为空，请输入！', "alert-warning");
                        return;
                    }
                }
            }


            var gooutstarttime = $scope.data.currItem.gooutstarttime;
            var gooutendtime = $scope.data.currItem.gooutendtime;
            //开始时间毫秒值
            var a = (new Date(gooutstarttime.replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数
            var b = (new Date(gooutendtime.replace(new RegExp("-", "gm"), "/"))).getTime(); //得到毫秒数

            if (a > b) {
                BasemanService.notice("开始时间不能大于结束时间", "alert-warning");
                return;
            }
            var msg = [];
            var lines = []
            lines = $scope.gridGetData('gooutOptions');
            if (lines.length ==0) {
                msg.push('请增加出差代理明细');
            }
            for (var i = 0; i < lines.length; i++) {
                var value = lines[i];
                var agentid = value.agentid;
                var wftempid = value.wftempid;
                if (agentid == '' || agentid == 0 || !agentid) {
                    msg.push('明细第' + (i + 1) + '行代理用户不能为空，请修改！');
                }
                if (wftempid == '' || wftempid == 0 || !wftempid) {
                    msg.push('明细第' + (i + 1) + '行代理流程不能为空，请修改！');
                }
            }

            if (msg.length > 0) {
                BasemanService.notice(msg, "alert-warning");
                return;
            }
            $scope.goout = 1;
            //判断用户是否选择出差
            if ($("input[type='checkbox']").is(':checked')) {
                $scope.goout = 2;
            }

            //发包保存
            BasemanService.RequestPost("scpuser", "changeagent", {
                userid: $scope.userid,
                goout: $scope.goout,
                gooutstarttime: $scope.data.currItem.gooutstarttime,
                gooutendtime: $scope.data.currItem.gooutendtime,
                useragentofusers: lines
            }).then(function (data) {
                try {
                    $scope.data.currItem.agents = data;
                    BasemanService.swalSuccess("出差设置成功！")
                } catch (e) {
                    BasemanService.notice(e, "alert-warning");
                }
            });
        }
    }


    /**
     * 修改密码
     */
    $scope.change_password = function () {

        $scope.oldpass = "";
        $scope.newpass = "";
        $scope.renewpass = "";

        //保存密码校验 提交到后台
        $scope.pwSave = function () {
            console.log($scope.oldpass);
            if ($scope.newpass != $scope.renewpass) {
                alert("两次输入的密码不一致!");
                return;
            }
            var postdata = {
                userpass: $scope.oldpass,
                userpass2: $scope.newpass
            };
            var promise = BasemanService.RequestPost("login", "setuserpassword", postdata);
            promise.then(function (data) {
                if (data.issuccess == "1") {
                    BasemanService.swalSuccess("密码修改成功!!!");
                } else {
                    BasemanService.swalWarning("密码修改失败!!!");
                }
            });
        }

    }


    $scope.searchData = function () {
        BasemanService.RequestPost("scpuser", "select", {"userid": strUserId}).then(function (result) {
            $scope.data.currItem = result;
        }).then(function () {
            $scope.gooutSetting()//默认加载出差设置界面
        })
    }


    $scope.searchData()



}

//注册控制器
angular.module('inspinia')
    .controller('my_settings', my_settings)
// .controller('scpuseragen', scpuseragen)
// .controller('scpuseralert', scpuseralert)
// .controller('change_password', change_password)