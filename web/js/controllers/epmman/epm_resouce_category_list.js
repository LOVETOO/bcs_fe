/**
 * 服务资源分类
 *  create by ljb
 *  2019-6-3
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', 'numberApi', 'openBizObj'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, numberApi, openBizObj) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {

                $scope.data = {
                    currItem : {}
                };

                //初始化？
                $scope.objconf = {
                    name: "epm_resouce_category",
                    key: "resouce_category_id",//gl_account_subject_id
                    // wftempid: 10082,
                    FrmInfo: {},
                    grids: [
                        {
                            optionname: 'gridOptions',
                            idname: 'epm_resouce_category',
                            istree: true//$scope.objconf.grids[0]，必须放到第一个
                        }]
                };

                $scope.columnDefs = [

                    {
                        field: 'resouce_category_code',
                        headerName: '编码',
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
                        field: 'resouce_category_name',
                        headerName: '名称',
                        width: 180
                    },{
                        field: 'resouce_type',
                        headerName: '类型',
                        width: 180,
                        hcDictCode: 'resouce_type'
                    }, {
                        field: 'remark',
                        width: 200,
                        headerName: '备注'
                    }
                ]


                //网格配置
                $scope.gridOptions = {
                    hcName : '资源分类',
                    columnDefs: $scope.columnDefs,
                    rowData: [],
                    getRowNodeId: function (data) {
                        return data.resouce_category_id;
                    },
                    //deltaRowDataMode: true,
                    hcClassId: 'epm_resouce_category',
                    hcAfterRequest: function (data) {
                        //加入顶层树节点
                        if(data.epm_resouce_categorys.length!=0){
                            data.epm_resouce_categorys.push({"resouce_category_pid":"-1","resouce_category_id":"0","resouce_category_code":"所有分类"});
                            data.epm_resouce_categorys = $scope.initTraditionTree(data.epm_resouce_categorys);
                            console.log("data.epm_resouce_categorys", data.epm_resouce_categorys);
                        }else{
                            data.epm_resouce_categorys.push({resouce_category_pid:"-1",resouce_category_id:"0",resouce_category_code:"所有分类",open:true,hasChildren:false});
                            console.log("data.epm_resouce_categorys", data.epm_resouce_categorys);
                        }
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

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                // 增加按钮
                $scope.toolButtons = {
                    // search: {
                    //     title: '查询',
                    //     icon: 'fa fa-search',
                    //     click: function () {
                    //         $scope.search && $scope.search();
                    //     }
                    // },
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
                    var resouce_category_code;
                    if (focusData.resouce_category_id == 0) {
                         resouce_category_code = "";
                    } else {
                        resouce_category_code = focusData.resouce_category_code;
                    }
                    var resouce_category_pid = focusData.resouce_category_id;
                    var resouce_type = focusData.resouce_type;
                    var idpath = focusData.idpath;

                    var modalResultPromise = openBizObj({
                        stateName: "epmman.epm_resouce_category_prop",
                        params: {
                            "pid" : resouce_category_pid,
                            "idpath" : idpath,
                            "code" : resouce_category_code,
                            "type" : resouce_type,
                        }
                    }).result;

                    modalResultPromise.finally(function () {
                        $scope.refresh();
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
                        stateName: "epmman.epm_resouce_category_prop",
                        params: {
                            "id": $scope.gridOptions.hcApi.getFocusedData().resouce_category_id,
                            "pid": $scope.gridOptions.hcApi.getFocusedData().resouce_category_pid
                        }
                    }).result;

                    modalResultPromise.finally(function (e) {
                        $scope.refresh();
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

                        return swalApi.confirmThenSuccess({
                            title: '确定要删除编码为"' + currentRowData.resouce_category_code + '"的记录吗？',
                            okFun: function () {
                                var postData = {
                                    classId: "epm_resouce_category",
                                    action: 'delete',
                                    data: {"resouce_category_id": currentRowData.resouce_category_id}
                                };

                                return requestApi.post(postData)
                                    .then(function () {
                                        $scope.refresh();
                                    });
                            },
                            okTitle: '删除成功'
                        });

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

                        var childTmp = $scope.getTreeChild(datas, "resouce_category_pid", datas[i].resouce_category_id);
                        if (childTmp.length > 0) {
                            datas[i].hasChildren = true;
                            datas[i].children = childTmp;
                            datas[i].open = false;
                            //只放置第一层数据
                            if (numberApi.toNumber(datas[i].resouce_category_pid) == -1) {
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
                            if (treeDatas[i].resouce_category_id == pId) {
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
                    $scope.data.currItem.create_date = new Date();
                    $scope.data.currItem.create_by = window.userbean.userid;
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
                            return requestApi.post("epm_resouce_category", "search", {"search_flag": 0});
                        })
                        .then(function (data) {
                            $scope.data.currItem[$scope.objconf.grids[0].idname] = data[$scope.objconf.grids[0].idname];
                            // //加入顶层树节点
                            // data.epm_resouce_categorys.push({"resouce_category_pid":"-1","resouce_category_id":"0","resouce_category_code":"所有分类"});
                            // $scope.gridOptions.rowData = $scope.initTraditionTree(data.epm_resouce_categorys);
                            // $scope.gridOptions.hcApi.setRowData($scope.gridOptions.rowData);

                            //加入顶层树节点
                            if(data.epm_resouce_categorys.length!=0){
                                data.epm_resouce_categorys.push({"resouce_category_pid":"-1","resouce_category_id":"0","resouce_category_code":"所有分类"});
                                data.epm_resouce_categorys = $scope.initTraditionTree(data.epm_resouce_categorys);
                                $scope.gridOptions.hcApi.setRowData(data.epm_resouce_categorys);
                            }else{
                                data.epm_resouce_categorys.push({resouce_category_pid:"-1",resouce_category_id:"0",resouce_category_code:"所有分类",open:true,hasChildren:false});
                                $scope.gridOptions.hcApi.setRowData(data.epm_resouce_categorys);
                            }
                        });
                }

            }
        ]

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
)