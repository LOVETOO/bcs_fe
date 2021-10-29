// hjx
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'jquery', 'openBizObj', 'numberApi', 'directive/hcObjList', 'directive/hcTree'],
    function (module, controllerApi, base_diy_page, requestApi, $, openBizObj, numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q', '$state',
            //控制器函数
            function ($scope, $q, $state) {
                /*--------------------数据定义------------------------*/
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.iid = 1;
                $scope.viewnum = 0;


                //记录点击节点
                $scope.arrNode = 0;
                $scope.discodes = [];
                /*--------------------网格配置------------------------*/
                /**
                 * 第一层树节点对应网格配置  去掉
                 */
                $scope.firstColumnDefs = [{
                    field: 'name',
                    headerName: '名称'
                }];
                $scope.data.firstChild = [];
                /**
                 * 第二层树节点对应网格配置
                 */
                $scope.secondColumnDefs = [
                    {
                        type: '序号'
                    }, {
                        field: 'is_top',
                        headerName: '置顶',
                        width: 65,
                        cellRenderer: function (params) {
                            var node = params.node;
                            return $('<div>', {
                                'css': {
                                    //'display': 'flex',
                                    //'justify-content': 'space-around',
                                    //'align-items': 'center',
                                    //'box-sizing': 'border-box',
                                    //'padding': '0 4px'
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex',
                                    'justify-content': 'center',
                                    'align-items': 'center'
                                },
                                'html': [
                                    node.data.is_top != 2 ? null : $('<img>', {
                                        'class': 'iconfont hc-add',
                                        'css': {
                                            'display': 'flex',
                                            'align-items': 'center',
                                            'margin': '0 4px',
                                            'cursor': 'pointer',
                                            'color': 'green',
                                            'width': '20px'
                                        },
                                        'src': '/web/img/hot.jpg'
                                    })
                                ]
                            })[0];
                        }
                    },
                    {
                        field: 'noticewf',
                        headerName: '发布状态',
                        hcDictCode: 'new_stat'
                    },
                    {
                        field: 'node',
                        headerName: '发文编码'
                    }, {
                        field: 'noticetype',
                        headerName: '通知类型',
                        hcDictCode: 'noticetype'
                    },

                    {
                        field: 'subject',
                        headerName: '公告主题'
                    },
                    {
                        field: 'pub_time',
                        headerName: '发布时间'
                    },
                    {
                        field: 'expire_date',
                        headerName: '过期时间'
                    },
                    {
                        field: 'publisher',
                        headerName: '发布人'
                    },
                    {
                        field: 'publish_dept',
                        headerName: '发布部门'
                    },
                    {
                        field: 'create_time',
                        headerName: '创建时间',
                        cellStyle: {
                            'text-align': 'center' //文本居中
                        }
                    },
                    {
                        field: 'creator',
                        headerName: '创建人',
                        cellStyle: {
                            'text-align': 'center' //文本居中
                        }
                    },
                    {
                        field: 'dept_name',
                        headerName: '创建部门',
                        cellStyle: {
                            'text-align': 'center' //文本居中
                        }
                    },

                    {
                        field: 'summary',
                        headerName: '备注'
                    }
                ];

                /**
                 * 初始化网格配置
                 */
                $scope.gridOptions = {
                    columnDefs: $scope.secondColumnDefs,
                    rowClassRules: {
                        'sick-days-isread': 'data.isread!=undefined && data.isread != 2',
                        'sick-days-flag': 'data.flag!=undefined && data.flag == -1'
                    }

                };

                /*----------------------配置------------------------*/
                /**
                 * 单击网格切换树焦点节点所需数据
                 * 在数据中插入唯一标示iid
                 * @param arr
                 * @param parentIid 在网格为流程单据信息时,点击聚焦至其父节点
                 */
                $scope.reHcGridData = function (arr, parentIid) {
                    arr && arr.map(function (data) {
                        data.iid = parentIid ? parentIid : ($scope.iid++);
                    });
                    return arr;
                };

                console.log($scope.data.firstChild)



                /**
                 * 请求网格相关单据
                 */
                $scope.gridPost = function (node) {
                    var body = {
                        wftempid: node.data.wftempid,
                        wfname: node.data.wfname,
                        flag: node.data.flag
                    };
                    $scope.gridOptions.hcClassId = 'scp_news';
                    $scope.gridOptions.hcRequestAction = 'search';
                    $scope.gridOptions.hcDataRelationName = 'scp_newss';
                    $scope.gridOptions.hcApi.search(body);
                };


                /**
                 * 返回指定节点的子节点或其承诺
                 */
                $scope.hcGetChildNodes = function (node) {
                    console.log("加载节点数据", node);
                    if (!node) {
                        node = $scope.treeSetting.zTreeObj.getSelectedNodes()[0];
                    }
                    if (node.level == 0) {
                        return requestApi.getDict("noticetype").then(function (data) {
                            data.forEach(function (item, i) {
                                //用于点击后缓存原始的节点数据，不点击则不保存
                                var str = '$scope.arr' + (i + 1) + '=[]';
                                eval(str);
                                $scope.data.firstChild.push({
                                    name: item.dictname,
                                    isParent: true,
                                    data: {
                                        type: numberApi.toNumber(item.dictvalue)
                                    }
                                });

                            });
                            return $scope.data.firstChild;
                        });
                    } else if (node.level == 1) {
                        //第一次点击按钮时会调用，将拿回来的节点数据存储在固定的数组中
                        var data = {
                            noticetype: node.data.type,
                            is_publis: 5
                        }
                        /* if ($scope.viewnum) {
                            data.sqlwhere = "viewnum = " + $scope.viewnum
                        } */
                        return requestApi.post({
                            classId: 'scp_news',
                            action: 'search',
                            data: data
                        }).then(function (response) {

                            if (node.data.type) {
                                $scope['arr' + node.data.type] = response.scp_newss
                            }

                            $scope.changeoption();
                        });
                    }
                };


                /**
                 * 设置 zTree 仅仅 level=2 的节点不显示图标
                 */
                $scope.showIconForTree = function (treeId, treeNode) {
                    return treeNode.level != 2;
                };

                /**
                 * 设置树文字样式
                 */
                $scope.setFontCss = function (treeId, treeNode) {
                    //console.log(treeNode);
                    var css = {};
                    if (treeNode.level == 2 && treeNode.data.flag == -1) {
                        css.color = 'red';
                    }
                    return css;
                };


                /**
                 * 树配置
                 */
                $scope.treeSetting = {
                    //返回根节点或其承诺
                    hcGetRootNodes: function () {
                        return {
                            name: "通知公告分类",
                            icon: '/web/img/icon_work.png',
                            data: {
                                pid: 0
                            },
                            isParent: true,
                            iid: 0,
                            hcGridData: $scope.reHcGridData($scope.data.firstChild)
                        };
                    },
                    //返回指定节点的子节点或其承诺
                    //添加树子节点
                    hcGetChildNodes: $scope.hcGetChildNodes,
                    callback: {
                        onClick: function (event, treeId, node) {
                            if ($scope.gridOptions.api) {
                                x();
                            }
                            else {
                                $scope.gridOptions.hcReady.then(x);
                            }

                            function x() {
                                if (node.level == 0) {
                                    //$scope.gridOptions.api.setColumnDefs($scope.firstColumnDefs);
                                    //$scope.gridOptions.api.setRowData($scope.data.firstChild);
                                    $scope.gridOptions.api.setRowData([]);
                                } else if (node.level == 1) {
                                    $scope.arrNode = node.data.type;
                                    $scope.changeoption();
                                }
                            }
                        }
                    },
                    //绑定网格
                    //取hcGridData缓存的值刷新网格
                    hcGridOptions: $scope.gridOptions,
                    //显示图标
                    view: {
                        showIcon: $scope.showIconForTree,
                        fontCss: $scope.setFontCss
                    },
                    //右键菜单
                    hcMenuItems: {
                        refresh: {
                            title: '刷新',
                            click: function (params) {
                                $scope.treeSetting.hcApi.reload(params.node);
                            },
                            hide: function (params) {
                                //console.log(params);
                                return !(params.node && params.node.level > 0);
                            }
                        }
                    }
                };


                /**
                 * 继承主控制器
                 */
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                $scope.changeoption = function () {
                    //根据筛选条件过滤点击节点的信息set到列表中
                    var strarr = [];
                    var strarr2 = [];
                    strarr = $scope['arr' + $scope.arrNode]
                    if (strarr.length > 0) {
                        //过滤筛选项 
                        if ($scope.viewnum == 1) {
                            for (var i = 0; i < strarr.length; i++) {
                                if (numberApi.toNumber(strarr[i].vh_viewnum) < 1) {
                                    //删除这个元素，游标回退
                                    /*  strarr.splice(i, 1);
                                     --i; */
                                    strarr2.push(strarr[i]);
                                }
                            }
                        } else if ($scope.viewnum == 2) {
                            for (var i = 0; i < strarr.length; i++) {
                                if (numberApi.toNumber(strarr[i].vh_viewnum) > 0) {
                                    //删除这个元素，游标回退
                                    /*  strarr.splice(i, 1);
                                     --i; */
                                    strarr2.push(strarr[i]);
                                }
                            }
                        } else {
                            strarr2 = strarr;
                        }
                    }
                    $scope.gridOptions.api.setColumnDefs($scope.secondColumnDefs);
                    $scope.gridOptions.api.setRowData(strarr2);
                }


                $scope.doInit = function () {
                    return $scope.hcSuper.doInit().then(function () {
                        //$scope.gridOptions.api.setRowData($scope.data.firstChild);

                        //默认当前流程
                        var newnode = $scope.treeSetting.zTreeObj.getNodeByParam("iid", 0, null);
                        // newnode && $scope.treeSetting.zTreeObj.addNodes(newnode, $scope.data.firstChild);
                        var nownode = $scope.treeSetting.zTreeObj.getNodeByParam("name", "", null);
                        newnode && $scope.treeSetting.zTreeObj.selectNode(newnode);
                        nownode && $scope.treeSetting.hcApi.clickNode(nownode).then(function () {
                            var node = $scope.treeSetting.zTreeObj.getNodeByParam("name", "", null);

                            //若【待我审批】的只有1个流程模板，展开
                            if (node && node.children && node.children.length === 1) {
                                $scope.treeSetting.hcApi.clickNode(node.children[0]);
                            }
                        });
                    })
                };

                //过滤器
                $scope.filterSetting = {
                    filters: {
                        viewnum: {
                            options: [{
                                name: '已阅读',
                                value: 2
                            }, {
                                name: '未阅读',
                                value: 1
                            }]
                        }
                    },
                    onChange: function (params) {
                        $scope.viewnum = params.option.value;
                        var node = $scope.treeSetting.zTreeObj.getSelectedNodes()[0];
                        if (node.level == 0) {
                            //$scope.gridOptions.api.setColumnDefs($scope.firstColumnDefs);
                            //$scope.gridOptions.api.setRowData($scope.data.firstChild);
                            $scope.gridOptions.api.setRowData([]);
                        } else {
                            $scope.changeoption();
                        }

                    }
                };


                /*-------------------顶部右边按钮------------------------*/
                $scope.toolButtons = {};

                /*-------------------网格事件------------------------*/
                //单击表格 同步到树
                /*$scope.gridOptions.onCellClicked = function (node) {
                 var newnode = $scope.treeSetting.zTreeObj.getNodeByParam("iid", node.data.iid, null);
                 newnode && $scope.treeSetting.zTreeObj.selectNode(newnode);
                 };*/

                //双击表格
                $scope.gridOptions.onCellDoubleClicked = function (node) {
                    var newnode = $scope.treeSetting.zTreeObj.getNodeByParam("iid", node.data.iid, null);
                    //打开树节点
                    if (newnode) {
                        $scope.treeSetting.zTreeObj.selectNode(newnode);
                        $scope.treeSetting.zTreeObj.expandNode(newnode, true, false, true, true);
                        if (newnode.level == 2) {
                            $scope.changeoption();
                        }
                        if (newnode.level == 1) {
                            $scope.gridOptions.api.setColumnDefs($scope.secondColumnDefs);
                            $scope.changeoption();
                        }
                    }
                    //打开单据
                    if (node.data.newsid) {
                        var newis = node.data.newsid;
                        $state.go('oa.scp_news_show', { id: newis });
                        $scope.$apply();
                    }
                };

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);