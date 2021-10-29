/**
 * 会计科目列表页
 * @since 2018-10-10
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', 'numberApi', 'openBizObj'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, numberApi, openBizObj) {
        'use strict';

        var gl_account_subject_list = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {
                $scope.data = {};
                $scope.data.currItem = {};
                //初始化？
                $scope.objconf = {
                    name: "gl_account_subject",
                    key: "gl_account_subject_id",//gl_account_subject_id
                    // wftempid: 10082,
                    FrmInfo: {},
                    grids: [
                        {
                            optionname: 'gridOptions',
                            idname: 'gl_account_subjects',
                            istree: true//$scope.objconf.grids[0]，必须放到第一个
                        }]
                };

                //会计科目列定义
                $scope.columnDefs = [
                    {
                        type: '序号'
                    },
                    {
                        field: 'km_code',
                        headerName: '科目编码',
                        width: 90,
                        cellRenderer: 'agGroupCellRenderer',
                        // cellStyle: sizeCellStyle,
                        cellRendererParams: {
                            // innerRenderer: innerCellRenderer,
                            suppressCount: true//这个是显示树形结构比较关键的一个参数
                        },
                        cellStyle: function (params) {
                            var style = '';//$scope.lineOptions.hcApi.getDefaultCellStyle(params);
                            //仓库取值非默认逻辑取值
                            if (params.data.is_default == 1) {
                                style = {
                                    'color': 'red', //字体红色
                                    'font-weight': 'bold' //字体加粗
                                };
                            }
                            return style;
                        },
                    },
                    {
                        field: 'km_desc',
                        headerName: '科目名称',
                        width: 160
                    },
                    //{
                    //    field: 'km_desc',
                    //    headerName: '科目描述',
                    //    width: 160
                    //},
                    {
                        field: 'help_code',
                        headerName: '助记码'
                    }, {
                        field: 'km_type',
                        headerName: '科目类型',
                        type: '词汇',
                        cellEditorParams: {
                            names: ['资产', '负债', '权益', '成本', '损益'],
                            values: [1, 2, 3, 4, 5]
                        }
                    }, {
                        field: 'km_property',
                        headerName: '科目性质',
                        type: '词汇',
                        cellEditorParams: {
                            names: ['借方', '贷方'],
                            values: [1, 2]
                        }
                    }, {
                        field: 'page_type',
                        headerName: '账业格式',
                        type: '词汇',
                        cellEditorParams: {
                            names: ['金额式', '数量金额式'],
                            values: [1, 2]
                        }
                    }, {
                        field: 'km_level',
                        headerName: '科目级别',
                        type: '词汇',
                        cellEditorParams: {
                            names: ['', '1级', '2级', '3级', '4级', '5级', '6级'],
                            values: [0, 1, 2, 3, 4, 5, 6]
                        }
                    },
                    {
                        headerName: "记账货币",
                        children: [
                            {
                                field: 'currency_code',
                                headerName: '编码'
                            },
                            {
                                field: 'currency_name',
                                headerName: '名称'
                            }
                        ]
                    },
                    {
                        field: 'customer_calculate',
                        headerName: '客户核算',
                        type: "是否"
                    }, {
                        field: 'dept_calculate',
                        headerName: '部门核算',
                        type: "是否"
                    }, {
                        field: 'vendor_calculate',
                        headerName: '供应商核算',
                        type: "是否"
                    }, {
                        field: 'is_fd_account',
                        headerName: '资金账号核算',
                        type: "是否"
                    }, {
                        field: 'ac_object_calculate',
                        headerName: '往来单位核算',
                        type: "是否"
                    }, {
                        field: 'person_calculate',
                        headerName: '个人核算',
                        type: "是否"
                    }, {
                        field: 'end_km',
                        headerName: '明细科目',
                        type: "是否"
                    }, {
                        field: 'is_freeze',
                        headerName: '冻结',
                        type: "是否"
                    }, {
                        field: 'item_calculate',
                        headerName: '物料核算',
                        type: "是否"
                    }, {
                        field: 'is_fee',
                        headerName: '经费核算',
                        type: "是否"
                    }, {
                        field: 'is_cash',
                        headerName: '资金类科目',
                        type: "是否"
                    }, {
                        field: 'is_shop_calculate',
                        headerName: '门店核算',
                        type: "是否"
                    }, {
                        field: 'is_area_calculate',
                        headerName: '区域核算',
                        type: "是否"
                    }, {
                        field: 'crm_entid_calculate',
                        headerName: '品类核算',
                        type: "是否"
                    }, {
                        field: 'entorgid_calculate',
                        headerName: '产品线核算',
                        type: "是否"
                    }
                ];

                /**
                 * 第一列标题渲染事件
                 * @param params
                 * @returns {string}
                 */
                function innerCellRenderer(params) {
                    var image;
                    if (params.node.group) {
                        image = params.node.level === 0 ? 'disk' : 'folder';
                    } else {
                        image = 'file';
                    }
                    var imageFullUrl = '/example-file-browser/' + image + '.png';
                    return '<img src="' + imageFullUrl + '" style="padding-left: 4px;" /> ' + params.data.name;
                }

                function sizeCellStyle() {
                    return {'text-align': 'right'};
                }

                //网格配置
                $scope.gridOptions = {
                    columnDefs: $scope.columnDefs,
                    rowData: [],
                    getRowNodeId: function (data) {
                        return data.gl_account_subject_id;
                    },
                    //deltaRowDataMode: true,
                    hcClassId: 'gl_account_subject',
                    hcAfterRequest: function (data) {
                        //加入顶层树节点
                        data.gl_account_subjects.push({"gl_account_subject_pid":"-1","gl_account_subject_id":"0","km_code":"会计科目"});
                        data.gl_account_subjects = $scope.initTraditionTree(data.gl_account_subjects);
                        console.log("data.gl_account_subjects", data.gl_account_subjects);
                    },
                    hcBeforeRequest: function (data) {
                        data.search_flag = 2;
                    },
                    getNodeChildDetails: function (data) {
                        if (data.hasChildren) {
                            return {
                                group: true,
                                children: data.children,
                                expanded: data.open
                            };
                        } else {
                            return null;
                        }
                    },
                    hcEvents: {
                        rowClicked: function (e) {
                            //console.log("rowClicked", e);
                        },
                        rowDoubleClicked: function (e) {
                            $scope.editTreeItem();
                        }
                    },
                    //扩展右键菜单
                    getContextMenuItems: function (params) {
                        var menuItems = $scope.gridOptions.hcDefaultOptions.getContextMenuItems(params);
                        menuItems.push('separator');
                        menuItems.push({
                            icon: '<i class="fa fa-edit"></i>',
                            name: '查看',
                            action: $scope.editTreeItem
                        });

                        menuItems.push({
                            icon: '<i class="fa fa-plus-square-o">',
                            name: '新增',
                            action: $scope.add
                        });

                        menuItems.push({
                            icon: '<i class="fa fa-trash">',
                            name: '删除',
                            action: $scope.deleteTreeItem
                        });

                        return menuItems;
                    }
                };
                //继承基类的方法
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });


                // 增加按钮
                $scope.toolButtons = {
                    search: {
                        title: '查询',
                        icon: 'fa fa-search',
                        click: function () {
                            $scope.search && $scope.search();
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
                            $scope.deleteTreeItem();
                        }
                    },
                    add: {
                        title: '新增',
                        icon: 'fa fa-plus',
                        click: function () {
                            $scope.add();
                        }
                    }
                };
                //重写新增方法
                $scope.add = function () {
                    var focusData = $scope.gridOptions.hcApi.getFocusedData();
                    var km_level = 0;
                    var pid = 0;
                    var km_code = '';
                    var km_type = 1;
                    if (focusData && focusData.km_level) {
                        km_level = numberApi.toNumber(focusData.km_level) + 1;
                        pid = focusData.gl_account_subject_id;
                        km_code = focusData.km_code;
                        km_type = focusData.km_code;
                    }
                    var modalResultPromise = openBizObj({
                        stateName: "finman.gl_account_subject_prop",
                        params: {
                            "id": 0,
                            "pid": pid,
                            "km_level": km_level,
                            "km_code": km_code,
                            "km_type":km_type
                        }
                    }).result;

                    modalResultPromise.finally(function () {
                        //刷新数据
                        //$scope.refresh();
                        console.log("close modal  add");
                    });
                };

                $scope.search = function () {
                    //用表格产生条件，并查询
                    return $scope.gridOptions.hcApi.searchByGrid();
                };
                // 刷新
                $scope.refresh = function () {
                    //刷新即是用上此的查询条件再查询一次
                    return $scope.gridOptions.hcApi.search();
                };

                /**
                 * 编辑树节点
                 * @param e
                 */
                $scope.editTreeItem = function () {
                    console.log("editTreeItem: ", $scope.gridOptions.hcApi.getFocusedData());
                    var modalResultPromise = openBizObj({
                        stateName: "finman.gl_account_subject_prop",
                        params: {
                            "id": $scope.gridOptions.hcApi.getFocusedData().gl_account_subject_id,
                            "pid": $scope.gridOptions.hcApi.getFocusedData().gl_account_subject_pid
                        }
                    }).result;

                    modalResultPromise.finally(function (e) {
                        console.log("close modal", e);
                    });
                }

                /**
                 * 删除树节点
                 * @param e
                 */
                $scope.deleteTreeItem = function () {
                    var currentRowData = $scope.gridOptions.hcApi.getFocusedData();
                    if (currentRowData.children) {
                        return swalApi.error("该行数据有子节点，不可直接删除！").then($q.reject);
                    } else {
                        // var parentData = $scope.getParentTreeData(currentRowData.gl_account_subject_pid);
                        // for (var i = 0; i < parentData.children.length; i++) {
                        //     if (parentData.children[i].gl_account_subject_id == currentRowData.gl_account_subject_id) {
                        //         parentData.children.splice(i, 1);
                        //         //$scope.gridOptions.api.removeItems([$scope.gridOptions.hcApi.getFocusedNode()]);
                        //         var allData = $scope.gridOptions.hcApi.getRowData();
                        //         for (var j = 0; j < allData.length; j++) {
                        //             if (allData[j].gl_account_subject_id = parentData.gl_account_subject_id) {
                        //                 allData[j] = parentData;
                        //                 break;
                        //             }
                        //         }
                        //         var newTreeData = $scope.initTraditionTree(allData);
                        //         $scope.gridOptions.api.setRowData(newTreeData);
                        //         break;
                        //     }
                        // }

                        // requestApi.post("gl_account_subject", "delete",).then(function () {
                        //     $scope.refresh();
                        //     return swalApi.success("删除成功!");
                        // });

                        return swalApi.confirmThenSuccess({
                            title: '确定要删除编码为"' + currentRowData.km_code + '"的记录吗？',
                            okFun: function () {
                                var postData = {
                                    classId: "gl_account_subject",
                                    action: 'delete',
                                    data: {"gl_account_subject_id": currentRowData.gl_account_subject_id}
                                };

                                return requestApi.post(postData)
                                    .then(function () {
                                        $scope.refresh();
                                    });
                            },
                            okTitle: '删除成功'
                        });

                        // var allData = $scope.gridOptions.hcApi.getRowData();
                        // for (var i = 0; i < allData.length; i++) {
                        //     if (allData[i].gl_account_subject_id = currentRowData.gl_account_subject_id) {
                        //         allData.splice(i, 1);
                        //         console.log("allData1: ", allData);
                        //         var newTreeData = $scope.initTraditionTree(allData);
                        //         $scope.gridOptions.api.setRowData(newTreeData);
                        //         console.log("allData2: ", $scope.gridOptions.hcApi.getRowData());
                        //         break;
                        //     }
                        // }
                        console.log("allData3: ", allData);
                    }
                }

                /**
                 * 初始化传统的树结构数据
                 * @param datas 需要初始化的树
                 * @returns {*}
                 */
                $scope.initTraditionTree = function (datas) {
                    var treeData = [];
                    for (var i = 0; i < datas.length; i++) {

                        var childTmp = $scope.getTreeChild(datas, "gl_account_subject_pid", datas[i].gl_account_subject_id);
                        if (childTmp.length > 0) {
                            datas[i].hasChildren = true;
                            datas[i].children = childTmp;
                            datas[i].open = false;
                            //只放置第一层数据
                            if (numberApi.toNumber(datas[i].gl_account_subject_pid) == -1) {
                                treeData.push(datas[i]);
                            }
                        } else {
                            datas[i].hasChildren = false;
                           // datas[i].km_code = "&nbsp;&nbsp;" + datas[i].km_code;//没有子的节点编码加空格对其
                        }
                    }
                    //默认展开第一个节点
                    if (treeData.length > 0 && treeData[0].hasChildren) {
                        treeData[0].open = true;
                    }
                    return treeData; //返回
                }

                /**
                 *依据父节点数据获取父节点
                 * @param pId
                 * @returns {Array} 依据pI获取的父节点
                 */
                $scope.getParentTreeData = function (pId) {
                    var parentData = null;
                    var treeDatas = $scope.gridOptions.hcApi.getRowData();
                    if (treeDatas) {
                        for (var i = 0; i < treeDatas.length; i++) {
                            if (treeDatas[i].gl_account_subject_id == pId) {
                                parentData = treeDatas[i];
                                break;
                            }
                        }
                    }
                    return parentData;
                }

                /**
                 *查找指定节点的数据
                 * @param datas 需要循环的数据
                 * @param parentID 父ID的属性名称
                 * @param id
                 * @returns {Array} 返回节点的子节点数据
                 */
                $scope.getTreeChild = function (datas, parentID, id) {
                    var result = [];
                    if (datas.length == 0) {
                        return result;
                    } else {
                        for (var i = 0; i < datas.length; i++) {
                            if (datas[i][parentID] == id) {
                                result.push(datas[i]);
                            }
                        }
                    }
                    return result;
                }

                $scope.setData = function (e) {
                    e.data.expanded = e.node.expanded;
                }

                $scope.rowClick = function (e) {
                    console.log("rowClick", e);
                }

                $scope.rowDoubleClicked = function (e) {
                    console.log("rowDoubleClicked", e);
                }
                //初始化
                $scope.clearinformation = function () {
                    $scope.data.currItem[$scope.objconf.grids[0].idname] = [];
                    $scope.data.currItem.create_time = new Date();
                    $scope.data.currItem.creator = window.userbean.userid;
                    $scope.search();
                };

                $scope.refresh_after = function () {

                    $scope.$parent.tree_options.api.setRowData($scope.$parent.data.currItem[$scope.$parent.objconf.grids[0].idname]);
                    $scope.new();
                }

                /**
                 * 初始化
                 * @return {Promise}
                 * @since 2018-12-06
                 */
                $scope.doInit = function () {
                    return $q
                        .when()
                        .then($scope.hcSuper.doInit)
                        .then(function () {
                            return requestApi.post("gl_account_subject", "search", {"search_flag": 2});
                        })
                        .then(function (data) {
                            $scope.data.currItem[$scope.objconf.grids[0].idname] = data[$scope.objconf.grids[0].idname];
                            //加入顶层树节点
                            data.gl_account_subjects.push({"gl_account_subject_pid":"-1","gl_account_subject_id":"0","km_code":"会计科目"});
                            $scope.gridOptions.rowData = $scope.initTraditionTree(data.gl_account_subjects);
                            $scope.gridOptions.hcApi.setRowData($scope.gridOptions.rowData);
                        });
                }
            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: gl_account_subject_list
        });
    }
);
