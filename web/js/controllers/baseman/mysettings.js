/**
 * 我的设置
 */
define(
    ['module', 'angular', 'swalApi', '$q', 'requestApi', 'controllerApi', 'base/ctrl_bill_public', 'base_diy_page', 'fileApi',
        'common', 'directive/hcGrid', 'directive/hcInput', 'directive/hcTreeList', 'directive/hcCropperModal', 'services', 'directive/hcModal'
    ],
    function (module, angular, swalApi, $q, requestApi, controllerApi, ctrl_bill_public, base_diy_page, fileApi) {
        'use strict';

        var mysettings = [
            //声明angular依赖
            '$rootScope', '$scope', '$timeout', '$modal', '$state', 'BasemanService',
            //控制器函数
            function ($rootScope, $scope, $timeout, $modal, $state, BasemanService) {

                $scope.data = {};
                $scope.data.currItem = {};
                $scope.data.currItem.agents = {};


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
                        action: $scope.chooseWfTemp,
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


                /*=================================出差设置网格配置 start================================*/
                /**
                 * 代理用户网格配置
                 */
                $scope.gooutOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            headerName: "代理用户",
                            field: "agentname",
                            onCellDoubleClicked: function (args) {
                                $scope.agentid(args);
                            }
                        },
                        {
                            headerName: "代理用户名称",
                            field: "agentname"
                        },
                        {
                            headerName: "代理流程",
                            field: "wftempname",
                            onCellDoubleClicked: function (args) {
                                $scope.chooseWfTemp(args);
                            }
                        }
                    ]
                };

                /**
                 * 人员查询
                 * @param args ag网格
                 */
                $scope.agentid = function (args) {
                    var base_view_erpemployee_org = {
                        classId: 'base_view_erpemployee_org',
                        afterOk: function (res) {
                            args.data.agentid = res.employee_code;
                            args.data.agentname = res.employee_name;
                            args.api.refreshView();//刷新网格
                        }
                    };
                    return $modal.openCommonSearch(base_view_erpemployee_org).result
                };

                /**
                 * 代理流程查询
                 * @param args ag网格
                 */
                $scope.chooseWfTemp = function (params) {
                    //弹出选择流程
                    /* BasemanService.openFrm("views/baseman/choose_wf.html", choose_wf, $scope, "", "", false).result.then(function (res) {
                        params.data.wftempid = res.wftempid;
                        params.data.wftempname = res.wftempname;
                        params.api.refreshView();//刷新网格
					}); */

					params.api.stopEditing(true);
					
					return $modal
						.openCommonSearch({
							classId: 'scpwftemp',
						})
						.result
						.then(function (wfTemp) {
							params.data.wftempid = wfTemp.wftempid;
							params.api.hcApi.setCellValue(params.node, 'wftempname', wfTemp.wftempname);
						});
                };

                /**
                 * 选择代理流程控制器
                 */
                var choose_wf = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
                    controllerApi.extend({
                        controller: base_diy_page.controller,
                        scope: $scope
                    });

                    $scope.objconf = {
                        name: "myfiles",
                        key: "fileid",
                        FrmInfo: {},
                        grids: []
                    };

                    /**
                     * 代理流程网格配置
                     */
                    $scope.wfOptions = {
                        columnDefs: [
                            {
                                type: '序号'
                            },
                            {
                                headerName: "名称",
                                field: "wftempname",
                                onCellDoubleClicked: function (args) {
                                    $scope.DblGrid(args);
                                }
                            },
                            {
                                headerName: "时间",
                                field: "createtime",
                                onCellDoubleClicked: function (args) {
                                    $scope.DblGrid(args);
                                }
                            }
                        ]
                    };

                    /**
                     * 网格双击
                     */
                    $scope.DblGrid = function (args) {
                        $modalInstance.close(args.data);
                    };

                    /**
                     * 确定
                     */
                    $scope.ok = function () {
                        $modalInstance.close($scope.wfOptions.hcApi.getFocusedData());
                    };

                    /**
                     * 取消
                     */
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };

                    /**
                     * 加载树
                     */
                    $scope.treeSetting = {
                        //获取根节点的方法
                        hcGetRootNodes: function () {
                            var wsobj = {
                                "wsid": -19,
                                "wstag": -19,
                                "excluderight": 1,
                                "wsright": "00000000000000000000FFFF000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
                            };
                            return requestApi.post("scpworkspace", "selectref", wsobj)
                                .then(function (data) {
                                    //根节点数据
                                    var itemNode = {};
                                    itemNode.name = data.fdrs[0].fdrname;
                                    itemNode.id = data.fdrs[0].fdrid;
                                    itemNode.data = data.fdrs[0];
                                    itemNode.hcIsRoot = true;
                                    return itemNode;
                                });
                        },
                        //获取子节点的方法
                        hcGetChildNodes: function (node) {
                            var param = {
                                "fdrid": node.data.fdrid
                            };
                            return requestApi.post("scpfdr", "selectref", param)
                                .then(function (data) {
                                    var itemNodes = [];
                                    for (var i = 0; i < data.fdrs.length; i++) {
                                        var itemNode = {}, row = data.fdrs[i];
                                        itemNode.name = row.fdrname;
                                        itemNode.id = row.fdrid;
                                        itemNode.data = row;
                                        itemNodes.push(itemNode)
                                    }
                                    return itemNodes;
                                });
                        },
                        hcGridOptions: $scope.wfOptions,
                        hcGetGridData: function (node) {
                            var param = {
                                "fdrid": node.data.fdrid
                            };
                            return requestApi.post("scpfdr", "selectref", param)
                                .then(function (data) {
                                    return data.wftemps;
                                });
                        }
                    };


                    /*/!*树配置*!/
                     var zTree = {};
                     var zTreeNodes = [];

                     var setting = {
                     callback: {
                     onClick: zTreeOnClick,
                     beforeExpand: beforeExpand
                     }
                     };

                     $scope.init_Tree = function () {
                     var wsobj = {
                     "wsid": -19,
                     "wstag": -19,
                     "excluderight": 1,
                     "wsright": "00000000000000000000FFFF000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
                     };
                     requestApi.post("scpworkspace", "selectref", wsobj)
                     .then(function (data) {
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

                     /!**
                     * 展开树节点-数据加载
                     *!/
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

                     /!**
                     * 树单击事件
                     *!/
                     function zTreeOnClick(event, treeId, treeNode) {
                     $scope.currentNode = treeNode
                     load_tree(treeNode);
                     };


                     function showIconForTree(treeId, treeNode) {
                     return !treeNode.isParent;
                     };



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



                     /!**
                     * 加载网格数据
                     *!/
                     function setGridData(datas) {
                     $scope.wfOptions.hcApi.setRowData(datas);
                     }

                     $scope.init_Tree();*/

                };

                /*=================================出差设置网格配置 end================================*/


                /*=================================出差设置 start================================*/
                /**
                 * 获取出差设置数据
                 */
                $scope.gooutSetting = function () {
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
                            $scope.gooutOptions.hcApi.setRowData(data.useragentofusers);
                        });
                };

                /**
                 * 删除按钮
                 */
                $scope.gooutbuttonRenderer = function () {
                    var index = $scope.gooutOptions.hcApi.getFocusedRowIndex();
                    if (index < 0) {
                        return swalApi.info("请先选择网格");
                    } else {
                        $scope.gooutOptions.hcApi.removeSelections();
                    }
                };

                /**
                 * 新增按钮
                 */
                $scope.addItem = function () {
                    $scope.gooutOptions.hcApi.addEmptyRow();
                };

                //删除明细
                /*$scope.delLineData = function (o) {
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
                 }*/

                /**
                 * 是否出差复选框改变事件
                 */
                $scope.gooutChange = function (e) {
                    if ($scope.goout == 1) {
                        $scope.data.currItem.gooutstarttime = "";
                        $scope.data.currItem.gooutendtime = "";
                    }
                };

                /**
                 * 保存
                 */
                $scope.gooutsave = function () {
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
                    if ($scope.goout = 2) {
                        for (var i = 0; i < checklist.length; i++) {
                            var value = checklist[i]
                            if (item[value.key] == 0 || item[value.key] == '' || item[value.key] == undefined) {
                                swalApi.info(value.desc + '为空，请输入！');
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
                        swalApi.info("开始时间不能大于结束时间");
                        return;
                    }
                    var msg = [];
                    var lines = [];
                    lines = $scope.gooutOptions.hcApi.getRowData();
                    if (lines.length == 0) {
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
                        swalApi.info(msg);
                        return;
                    }
                    $scope.goout = 1;
                    //判断用户是否选择出差
                    if ($("input[type='checkbox']").is(':checked')) {
                        $scope.goout = 2;
                    }

                    //发包保存
                    requestApi.post("scpuser", "changeagent", {
                        userid: $scope.userid,
                        goout: $scope.goout,
                        gooutstarttime: $scope.data.currItem.gooutstarttime,
                        gooutendtime: $scope.data.currItem.gooutendtime,
                        useragentofusers: lines
                    }).then(function (data) {
                        try {
                            $scope.data.currItem.agents = data;
                            swalApi.success("出差设置成功！")
                        } catch (e) {
                            swalApi.info(e);
                        }
                    });
                };

                /*=================================出差设置 end================================*/


                /**
                 * 网格列选项属性定义
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


                /**--------------------------------保存数据方法-------------------------------------------------*/
                /**
                 * 保存个人资料
                 */
                $scope.saveUserImfo = function () {
                    requestApi.post("scpuser", "update", {"userid": strUserId}).then(function (result) {
                        $scope.data.currItem = result;
                    })
                }


                /*=================================修改密码================================*/
                /**
                 * 修改密码
                 */
                $scope.change_password = function () {

                    $scope.oldpass = "";
                    $scope.newpass = "";
                    $scope.renewpass = "";

                    //保存密码校验 提交到后台
                    $scope.pwSave = function () {
                        if ($scope.newpass != $scope.renewpass) {
                            swalApi.info("两次输入的密码不一致!");
                            return;
                        }
                        var postdata = {
                            userpass: $scope.oldpass,
                            userpass2: $scope.newpass
                        };
                        requestApi.post("login", "setuserpassword", postdata)
                            .then(function (data) {
                                if (data.issuccess == "1") {
                                    swalApi.info("密码修改成功,请重新登录!");
                                } else {
                                    swalApi.info("密码修改失败!");
                                }
                            });
                    }
                };


                /*=================================获取账号信息================================*/
                /**
                 * 获取账号信息
                 */
                $scope.searchData = function () {
                    requestApi.post("scpuser", "select", {"userid": strUserId}).then(function (result) {
                        $scope.data.currItem = result;
                    }).then(function () {
                        $scope.gooutSetting()//默认加载出差设置界面
                        $scope.autoGooutGrid()//计算网格高度
                        $scope.setting();
                    })
                };
                /**
                 * 个人参数网格配置
                 */
                $scope.settingOptions = {
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
                $scope.settingOptions = {
                    columnDefs: [
                        {
                            type: '序号',
                            width: 90 // 宽度
                        },
                        {
                            headerName: "参数名称",
                            field: "confname",
                            onCellDoubleClicked: function (args) {
                                $scope.setvalue(args);
                            }
                        },
                        {
                            headerName: "参数描述",
                            field: "confdesc",
                            onCellDoubleClicked: function (args) {
                                $scope.setvalue(args);
                            }
                        },
                        {
                            headerName: "参数类型",
                            field: "datatype",
                            width: 200,
                            onCellDoubleClicked: function (args) {
                                $scope.setvalue(args);
                            }
                        },
                        {
                            headerName: "参数值",
                            field: "confvalue",
                            onCellDoubleClicked: function (args) {
                                $scope.setvalue(args);
                            }
                        },
                        {
                            headerName: "参数说明",
                            field: "note",
                            onCellDoubleClicked: function (args) {
                                $scope.setvalue(args);
                            }
                        }
                    ]
                };

                $scope.setting = function () {
                    BasemanService.RequestPost("scpuserprofile", "selectref", {
                            userid: userbean.userid
                        })
                        .then(function (data) {
                            $scope.settingOptions.hcApi.setRowData(data.userprofileofusers);
                        });
                };

                $scope.setvalue = function (args) {
                    $scope.settingModal.open({
                        controller: ['$scope', function ($modalScope) {
                            $modalScope.title = "个人参数设置";
                            $modalScope.data = args.data;
                            $modalScope.footerRightButtons.rightTest = {
                                title: '保存',
                                click: function () {
                                    requestApi.post('scpuserprofile', 'update', $modalScope.data)
                                        .then(function (response) {
                                            args.api.hcApi.setCellValue(args.node, args.column, $modalScope.data.confvalue);
                                            $modalScope.$close();
                                            swalApi.info("保存成功");
                                        })
                                }
                            };
                        }]
                    })
                }
                /*=================================初始化================================*/
                //继承
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });


                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    return $scope.hcSuper.doInit()
                        .then($scope.searchData)
                };


                /*=================================上传头像================================*/
                /*
                 /!**
                 * 点击头像
                 *!/
                 $scope.updateHead = function () {
                 $('#photofile').click();
                 };


                 /!**
                 * 选择文件后
                 *!/
                 function fileChange(e) {
                 var file = e.target.files[0];
                 $("#image").cropper('replace', URL.createObjectURL(file))
                 e.target.value = '';
                 }

                 window.fileChange = fileChange;


                 /!**
                 * 初始化裁剪插件
                 *!/
                 $scope.initCropper = function () {
                 $('#image').cropper({
                 aspectRatio: 1 / 1,//默认比例
                 crop: function (event) {
                 console.log(event.detail.x);
                 console.log(event.detail.y);
                 console.log(event.detail.width);
                 console.log(event.detail.height);
                 console.log(event.detail.rotate);
                 console.log(event.detail.scaleX);
                 console.log(event.detail.scaleY);
                 }
                 });
                 };

                 /!**
                 * 获取裁剪文件
                 *!/
                 $scope.getCropper = function () {
                 $('#image').cropper('getCroppedCanvas', {
                 maxWidth: 4096,
                 maxHeight: 4096
                 })
                 .toBlob(function (blob) {
                 console.log(blob);
                 $scope.uploadFile(blob)
                 })
                 };
                 */

                /**
                 * 上传文件
                 */
                $scope.uploadFile = function (file) {
                    fileApi.uploadFile([file])
                        .then(function (data) {
                            console.log(data);
                            var postdata = {
                                headimgdocid: data[0].docid,
                                userid: strUserId
                            };
                            return requestApi.post("scpuser", 'updateheaderimg', postdata)
                        })
                        .then(function (data) {
                            $scope.data.currItem.headimgdocid = data.headimgdocid;
                            top.$(".user-box img").attr('src', '/downloadfile?docid=' + data.headimgdocid);
                            swalApi.success("修改头像成功");
                        })
                };

                /**
                 * 配置裁剪指令
                 */
                $scope.data.hcCropper = {
                    option: {
                        aspectRatio: 1 / 1
                    },
                    reData: $scope.uploadFile,
                    title: '修改头像'
                };


                /*=================================计算出差设置网格高度================================*/
                $scope.autoGooutGrid = function () {
                    var $e = $("#gooutGrid");
                    var $s = $("#settingGrid");
                    var eH = $e.height();
                    var $body = $e.closest('body')
                    var bodyH = $body.height();
                    var myinforH = $body.find(".myinfor").height();
                    var myinfortextH = $body.find(".myinfor-text").height();
                    $e.height(eH + (bodyH - myinforH - myinfortextH) - 60);
                    $s.height(eH + (bodyH - myinforH - myinfortextH) - 60);
                }


            }
        ];

        //注册控制器
        return controllerApi.controller({
            module: module,
            controller: mysettings
        });
    }
)
;

