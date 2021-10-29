/**
 * 流程模板 - 树列表页
 * @since 2018-12-18
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_tree_list', 'requestApi', 'openBizObj', 'numberApi', 'swalApi', 'constant', 'unblockSwalApi', 'jurisdictionApi'], defineFn)
})(function (module, controllerApi, base_tree_list, requestApi, openBizObj, numberApi, swalApi, constant, unblockSwalApi, jurisdictionApi) {

        /**
         * 控制器
         */
        WfTemp.$inject = ['$scope', '$stateParams', '$q', '$modal'];

        function WfTemp($scope, $stateParams, $q, $modal) {
            $scope.data = {
                currItem: {},
                //权限对象
                rightObj: {
                    all: 0,//所有完全控制
                    view: 0,//浏览
                    read: 0,//读取
                    modify: 0,//修改
                    add: 0,//新增
                    delete: 0,//删除
                    dir: 0,//目录列表
                    export: 0,//输出
                    cantransfer: 1//能否转授2-客转授
                }
            }

            $scope.item_list = [];//临时容器，存放复制、剪切时的选中数据
            $scope.is_cutOrCopy = 0;//标示是复制还是剪切 1-复制 2-剪切
            $scope.originNode = {};//临时容器，存放复制、剪切操作时所来源的节点；
            $scope.is_fdr = false;//标示剪切的是否是文件夹

            /**
             * 表格设置
             */
            $scope.gridOptions = {
                columnDefs: [{
                    type: '序号'
                }, {
                    field: 'wftempname',
                    headerName: '流程模板名称'
                }
                    , {
                        field: 'creator',
                        headerName: '创建人'
                    }
                    , {
                        field: 'createtime',
                        headerName: '创建时间'
                    }
                    , {
                        field: 'updator',
                        headerName: '修改人'
                    }
                    , {
                        field: 'updatetime',
                        headerName: '修改时间'
                    }],
                getContextMenuItems: getContextMenuItems,
                hcClassId: 'scpwftemp',
                hcDataRelationName: 'wftempofwftemps',
                hcSearchWhenReady: false
            };

            /**
             * 树设置
             */
            $scope.treeSetting = {
                hcGetRootNodes: function () {
                    return {
                        name: '流程模板',
                        hcIsRoot: true,
                        fdrid: '',
                        id: 0,
                        icon: "/web/img/file.png",
                        iconClose: "/web/img/file.png",
                        data: {}
                    };
                },
                hcGetChildNodes: function (node) {
                    if (node.hcIsRoot == true) {
                        var wsobj = {
                            "wsid": -19,
                            "wstag": -19,
                            "excluderight": 1
                        }
                        return requestApi
                            .post({
                                classId: 'scpworkspace',
                                action: 'selectref',
                                data: wsobj
                            })
                            .then(function (response) {
                                return response.fdrs.map(function (fdr) {
                                    return {
                                        name: fdr.fdrname,
                                        fdrid: fdr.fdrid,
                                        data: fdr,
                                        icon: "/web/img/file.png"
                                    };
                                });
                            });
                    }
                    return requestApi
                        .post({
                            classId: 'scpfdr',
                            action: 'selectref',
                            data: node.data
                        })
                        .then(function (response) {
                            node.hcGridData = response.wftemps;
                            return response.fdrs.map(function (fdr) {
                                return {
                                    name: fdr.fdrname,
                                    data: fdr,
                                    icon: "/web/img/file.png"
                                };
                            });
                        })
                        /*获取权限数据插入node.objaccess中*/
                        .then(function (data) {
                            var promises = [];

                            data.forEach(function (item) {
                                var postdata = {
                                    idpath: item.data.idpath,
                                    typepath: item.data.typepath
                                };
                                var promise = requestApi.post("scpobjright", "select", postdata)
                                    .then(function (response) {
                                        item.objaccess = response.objaccess;
                                        return item
                                    });
                                promises.push(promise);
                            });

                            return $q.all(promises)
                        })
                        .then(function (data) {
                            return data;
                        });
                },
                hcMenuItems: {
                    authority: {
                        title: '权限',
                        icon: 'fa fa-share',
                        click: function (params) {
                            $scope.share(params.node, 'tree');
                        },
                        hide: function (params) {
                            return !params.node || params.node.hcIsRoot || !$scope.judge_right_authority(params.node);
                        }
                    },
                    add: {
                        title: '新建文件夹',
                        click: addFdr,
                        icon: 'fa fa-folder-open-o'
                    },
                    addWftemp: {
                        title: '新建流程模板',
                        click: function () {
                            return addWfTemp();
                        },
                        hide: function (params) {
                            return !params.node || params.node.hcIsRoot;
                        },
                        icon: 'fa fa-file-o'
                    },
                    copy: {
                        title: '复制',
                        click: function (params) {
                            $scope.copyItem(params);
                        },
                        hide: function (params) {
                            return !params.node || params.node.hcIsRoot;
                        },
                        icon: 'fa fa-files-o'
                    },
                    cut: {
                        title: '剪切',
                        click: function (params) {
                            $scope.cutItem(params);
                        },
                        hide: function (params) {
                            return !params.node || params.node.hcIsRoot;
                        },
                        icon: 'fa fa-scissors'
                    },
                    paste: {
                        title: '粘贴',
                        click: function (params) {
                            $scope.pasteItem(params);
                        },
                        hide: function () {
                            return !$scope.is_fdr || !$scope.item_list.length || $scope.item_list.length < 1;
                        },
                        icon: 'fa fa-clipboard'
                    },
                    delete: {
                        title: '删除',
                        click: deleteFdr,
                        hide: function (params) {
                            return !params.node || params.node.hcIsRoot;
                        },
                        icon: 'fa fa-trash-o'
                    },
                    refresh: {
                        title: '刷新',
                        click: function (params) {
                            $scope.treeSetting.hcApi.reload(params.node);
                        },
                        icon: 'fa fa-refresh'
                    },
                    rename: {
                        title: '重命名',
                        click: renameFdr,
                        hide: function (params) {
                            return !params.node || params.node.hcIsRoot;
                        },
                        icon: 'fa fa-pencil'
                    },
                    attribute: {
                        title: '文件夹属性',
                        click: function (params) {
                            var arributedata = params.node.data;
                            var parentNode = params.node.getParentNode();
                            arributedata.parentfdrid = parentNode.fdrid;
                            arributedata.parentfdrname = parentNode.name;
                            return $scope.open_attr(arributedata);
                        },
                        hide: function (params) {
                            return !params.node || params.node.hcIsRoot;
                        },
                        icon: 'fa fa-info-circle'
                    }
                },
                view: {
                    showIcon: true
                }
                // async:{
                //     dataFilter: filter
                // }
            };

            /** =============== 网格右键菜单 ==================**/
            //右键菜单
            function getContextMenuItems(params) {
                if (params.node && params.node.selected == false) {
                    params.node.setSelected(true, true);
                }

                $scope.nowtreeNode = $scope.treeSetting.zTreeObj.getSelectedNodes()[0];//选中树节点数据
                if ($scope.nowtreeNode.hcIsRoot) {
                    return;
                }

                var result = [];
                var obj1 = {
                    name: '打开流程模板',
                    icon: '<i class="fa fa-files-o"></i>',
                    action: function () {
                        openWfTemp(params.node.data.wftempid);
                    }
                };
                var obj1_2 = {
                    name: '新建流程模板',
                    icon: '<i class="fa fa-edit"></i>',
                    action: function () {
                        addWfTemp();
                    }
                };
                var obj2 = {
                    name: '复制',
                    icon: '<i class="fa fa-files-o"></i>',
                    action: function (params) {
                        return $scope.copyItemAll()
                    }
                };
                var obj3 = {
                    name: '剪切',
                    icon: '<i class="fa fa-scissors"></i>',
                    action: function (params) {
                        // return $scope.file_move()
                        return $scope.cutItem()
                    }
                };
                var obj23 = {
                    name: '粘贴',
                    icon: '<i class="fa fa-clipboard"></i>',
                    action: function (params) {
                        return $scope.pasteItem()
                    }
                };
                //文件删除
                var obj4_3 = {
                    name: '删除',
                    icon: '<i class="fa fa-trash-o"></i>',
                    action: function (params) {
                        return deleteWfTemp();
                    }
                };
                var obj5_2 = {
                    name: '刷新',
                    icon: '<i class="fa fa-refresh"></i>',
                    action: function () {
                        return $scope.treeSetting.hcApi.reload($scope.nowtreeNode);
                    }
                };
                //文件重命名
                var obj5_3 = {
                    name: '重命名',
                    icon: '<i class="fa fa-pencil"></i>',
                    action: renameWfTemp
                };
                var obj12_2 = {
                    name: '流程属性',//属性
                    icon: '<i class="fa fa-info-circle"></i>',
                    action: function () {
                        var arributedata;

                        if (params.node) {
                            arributedata = params.node.data;
                            arributedata.parentfdrid = $scope.nowtreeNode.data.fdrid;
                            arributedata.parentfdrname = $scope.nowtreeNode.data.fdrname;
                        }
                        // else {
                        //     arributedata = $scope.nowtreeNode.data;
                        //     var parentNode = $scope.nowtreeNode.getParentNode();
                        //     arributedata.parentfdrid = $scope.nowtreeNode.fdrid;
                        //     arributedata.parentfdrname = $scope.nowtreeNode.name;
                        // }
                        return $scope.open_attr(arributedata);
                    }
                };
                if (!$scope.is_fdr && $scope.item_list.length && $scope.item_list.length > 0) {
                    result.push(obj23);
                }
                if (params.node != null) {
                    result.push(obj2);
                    result.push(obj3);
                    result.push(obj4_3);
                    result.push(obj5_3);
                    result.unshift(obj1);
                    // result.push(obj12_2);
                } else {
                    result.push(obj1_2);
                    result.push(obj5_2);

                }

                return result;
            }

            /**===============================右键菜单 事件=================**/

            /**
             * 复制文件/文件夹
             */
            $scope.copyItem = function (params) {
                var row;
                if (params && params.node) {
                    row = params.node.data;//选中树节点数据
                } else {
                    var FocusedNode = $scope.gridOptions.hcApi.getFocusedNode();
                    if (!FocusedNode || !FocusedNode.data) {
                        return unblockSwalApi.info("请先选择要复制的文件夹或流程")
                    }
                    row = FocusedNode.data;//选中网格行数据
                }
                $scope.item_list = [];
                $scope.item_list.push(row);
                $scope.is_cutOrCopy = 2;//标示为复制
                var zTree = $scope.treeSetting.zTreeObj;
                $scope.originNode = zTree.getSelectedNodes()[0];
                unblockSwalApi.success("复制成功");
            };

            /**
             * 批量复制
             */
            $scope.copyItemAll = function () {
                var FocusedNode = $scope.gridOptions.api.getRangeSelections()
                if (!FocusedNode || !FocusedNode.length) {
                    return unblockSwalApi.info("请先选择要复制的文件夹或流程")
                }
                $scope.item_list = [];
                var data = $scope.gridOptions.hcApi.getRowData();
                var indexOf = -1;
                //选中网格行数据
                FocusedNode.forEach(function(value){
                    for(var i = value.start.rowIndex; i <= value.end.rowIndex; i++){
                        if(indexOf != i){
                            indexOf = i;
                            $scope.item_list.push(data[i]);
                        }
                    }
                });
                $scope.is_cutOrCopy = 2;//标示为复制
                var zTree = $scope.treeSetting.zTreeObj;
                $scope.originNode = zTree.getSelectedNodes()[0];
                unblockSwalApi.success("复制成功");
            };

            /*
             * 剪切文件夹、模板
             * */
            $scope.cutItem = function (params) {
                //行数据或者树节点数据
                var row;
                if (params) {//在树节点进行的操作，所以从树节点获取数据源
                    row = params.node.data;//选中树节点数据
                    $scope.is_fdr = true;
                    //更新临时储存
                    $scope.item_list[0] = row;
                } else {
                    var FocusedNodes = $scope.gridOptions.hcApi.getSelectedNodes('auto');

                    if (!FocusedNodes || !FocusedNodes.length) {//判断是否在流程模板网格进行操作
                        return unblockSwalApi.info("请先选择要剪切的文件夹或者流程模板")
                    }

                    $scope.item_list = [];
                    FocusedNodes.forEach(function (nodes) {
                        $scope.item_list.push(nodes.data);
                    })
                    $scope.is_fdr = false;
                }

                $scope.item_list.is_cut = true;
                $scope.is_cutOrCopy = 1;//标示为剪切

                var zTree = $scope.treeSetting.zTreeObj;
                var node = zTree.getSelectedNodes()[0];
                $scope.originNode = zTree.getSelectedNodes()[0];
                unblockSwalApi.success("剪切成功");
            };

            /**
             * 粘贴
             */
            $scope.pasteItem = function (params) {
                if ($scope.item_list.length <= 0) {
                    return unblockSwalApi.info("请先复制或剪切流程");
                }
                var node;
                var zTree = $scope.treeSetting.zTreeObj;

                if (params) {
                    node = params.node;
                } else {
                    var FocusedNodes = zTree.getSelectedNodes();
                    if (!FocusedNodes || !FocusedNodes.length) {
                        return unblockSwalApi.info("请先选择文件夹");
                    }
                    node = FocusedNodes[0];
                }

                if ($scope.item_list.length > 1 && $scope.is_cutOrCopy == 1) {
                    return $scope.batchPasteItem(node);//批量粘贴剪切
                }

                if($scope.item_list.length > 1){
                    for(var i = 0; i < $scope.item_list.length; i++){
                        var row = $scope.item_list[i];
                        var data = {
                            parentid: node.data.idpath,
                            parenttype: node.data.typepath,
                            wsright: node.data.wsright
                        };

                        //用户
                        if (row.wftempid) {
                            data.wftempid = row.wftempid;
                            data.wftempname = row.wftempname;
                            console.log("------ 粘贴流程");

                            // if ($scope.is_cutOrCopy == 2)//如果是复制的话
                            //     return swalApi.input({
                            //         title: '粘贴前请输入流程重命名名称',
                            //         inputValue: data.wftempname,
                            //         inputValidator: function (value) {
                            //             if (value == data.wftempname) {
                            //                 return '流程名称不能一致';
                            //             }
                            //             return ('' + value) ? '' : '流程名称不能为空';
                            //         }
                            //     })
                            //         .then(function (value) {
                            //             data.wftempname = value;
                            //             return data;
                            //         })

                        } else {//文件夹
                            data.fdrid = row.fdrid;
                            data.fdrname = row.fdrname;
                            console.log("------ 粘贴文件夹");
                        }

                        requestApi.post({
                            classId: row.wftempid ? 'scpwftemp' : 'scpfdr',
                            action: ($scope.is_cutOrCopy == 1 ? 'cut' : 'paste'),
                            data: data
                        })
                        .then(function () {
                            //刷新数据原来位置与数据目标位置
                            if ($scope.is_cutOrCopy == 1)
                                return $scope.treeSetting.hcApi.reload($scope.originNode);
                        })
                        .then(function () {
                            $scope.treeSetting.hcApi.reload(node);
                            $scope.originNode = {};
                            if ($scope.is_cutOrCopy != 2) {
                                //剪切完成后 要重置操作；
                                $scope.is_cutOrCopy = 0;
                                $scope.item_list = [];
                            }
                            unblockSwalApi.success("粘贴成功");
                        });//批量复制粘贴
                    }
                    //复制/剪切到的目标路径
                    //前台没有parentid数据,通过请求返回
                    return;
                }

                //被剪切数据
                var row = $scope.item_list[0];

                //复制/剪切到的目标路径
                //前台没有parentid数据,通过请求返回
                $q.when()
                    .then(function () {
                        var data = {
                            parentid: node.data.idpath,
                            parenttype: node.data.typepath,
                            wsright: node.data.wsright
                        };

                        //用户
                        if (row.wftempid) {
                            data.wftempid = row.wftempid;
                            data.wftempname = row.wftempname;
                            console.log("------ 粘贴流程");

                            if ($scope.is_cutOrCopy == 2)//如果是复制的话
                                return swalApi.input({
                                    title: '粘贴前请输入流程重命名名称',
                                    inputValue: data.wftempname,
                                    inputValidator: function (value) {
                                        if (value == data.wftempname) {
                                            return '流程名称不能一致';
                                        }
                                        return ('' + value) ? '' : '流程名称不能为空';
                                    }
                                })
                                    .then(function (value) {
                                        data.wftempname = value;
                                        return data;
                                    })

                        } else {//文件夹
                            data.fdrid = row.fdrid;
                            data.fdrname = row.fdrname;
                            console.log("------ 粘贴文件夹");
                        }

                        return data;
                    })
                    .then(function (data) {
                        return requestApi.post({
                            classId: row.wftempid ? 'scpwftemp' : 'scpfdr',
                            action: ($scope.is_cutOrCopy == 1 ? 'cut' : 'paste'),
                            data: data
                        })
                    })
                    .then(function () {
                        //刷新数据原来位置与数据目标位置
                        if ($scope.is_cutOrCopy == 1)
                            return $scope.treeSetting.hcApi.reload($scope.originNode);
                    })
                    .then(function () {
                        $scope.treeSetting.hcApi.reload(node);
                        $scope.originNode = {};
                        if ($scope.is_cutOrCopy != 2) {
                            //剪切完成后 要重置操作；
                            $scope.is_cutOrCopy = 0;
                            $scope.item_list = [];
                        }
                        unblockSwalApi.success("粘贴成功");
                    })
            };

            /**
             * 批量剪切
             * @param node
             */
            $scope.batchPasteItem = function (node) {
                var data = []
                $scope.item_list.forEach(function (item) {
                    data.push({
                        parentid: node.data.idpath,
                        parenttype: node.data.typepath,
                        wsright: node.data.wsright,
                        wftempid: item.wftempid,
                        wftempname: item.wftempname
                    })
                })
                requestApi.post({
                    classId: 'scpwftemp',
                    action: 'batchcut',
                    data: {wftempofwftemps: data}
                }).then(function () {

                })
                    .then(function () {
                        //刷新数据原来位置与数据目标位置
                        if ($scope.is_cutOrCopy == 1)
                            return $scope.treeSetting.hcApi.reload($scope.originNode);
                    })
                    .then(function () {
                        $scope.treeSetting.hcApi.reload(node);
                        $scope.originNode = {};
                        if ($scope.is_cutOrCopy != 2) {
                            //剪切完成后 要重置操作；
                            $scope.is_cutOrCopy = 0;
                            $scope.item_list = [];
                        }
                        unblockSwalApi.success("粘贴成功");
                    })
            }
            //继承基础控制器
            controllerApi.extend({
                controller: base_tree_list.controller,
                scope: $scope
            });

            /**
             * 工具栏按钮
             */
            $scope.toolButtons = {
                addWfTemp: {
                    title: '新建流程模板',
                    icon: 'iconfont hc-add',
                    click: function () {
                        return addWfTemp();
                    },
                    hide: function () {
                        return $scope.isSearchMod;
                    }
                },
                deleteWfTemp: {
                    title: '删除流程模板',
                    icon: 'iconfont hc-delete',
                    click: deleteWfTemp
                },
                addFdr: {
                    title: '新建文件夹',
                    icon: 'iconfont hc-add',
                    click: function () {
                        return addFdr();
                    },
                    hide: function () {
                        return $scope.isSearchMod;
                    }
                },
                deleteFdr: {
                    title: '删除文件夹',
                    icon: 'iconfont hc-delete',
                    click: function () {
                        return deleteFdr();
                    },
                    hide: function () {
                        return $scope.isSearchMod;
                    }
                }
                // text: {
                //     title: '测试',
                //     click: function () {
                //         unblockSwalApi.info('一二', '3');
                //     }
                // }
            };

            /**================ 流程模板 操作方法  ===================**/
            /**
             * 新建流程模板
             * @returns {Promise}
             */
            function addWfTemp(fdrid) {
                if (fdrid)
                    return openWfTemp(0, fdrid);
                return openWfTemp(0);

            }

            /**
             * 删除流程模板
             * @returns {Promise}
             */
            function deleteWfTemp() {
                var wfTemp = $scope.gridOptions.hcApi.getFocusedData();
                if (!wfTemp) {
                    return swalApi.info('请先选中想要删除的流程模板').then($q.reject);
                }

                return swalApi.confirmThenSuccess({
                    title: '确定要删除流程模板【' + wfTemp.wftempname + '】',
                    okFun: function () {
                        return requestApi
                            .post({
                                classId: 'scpwftemp',
                                action: 'delete',
                                data: {
                                    wftempid: wfTemp.wftempid
                                }
                            })
                            .then(function () {
                                $scope.gridOptions.api.updateRowData({
                                    remove: [wfTemp]
                                });
                                unblockSwalApi.success('删除成功');
                            });
                    }
                });
            }

            /**
             * 打开流程模板
             */
            function openWfTemp(wfTempId, fdrid) {
                var params = {
                    id: numberApi.toNumber(wfTempId),
                    title: $stateParams.title || '流程模板'
                }
                if (fdrid) {
                    params.fdrId = fdrid;
                }
                else if ($scope.treeSetting.zTreeObj.getSelectedNodes()[0].data) {
                    params.fdrId = $scope.treeSetting.zTreeObj.getSelectedNodes()[0].data.fdrid;
                }
                return openBizObj({
                    stateName: 'baseman.wftemp_prop',
                    params: params
                }).result.finally($scope.refresh);
            }

            /**
             * 重命名流程模板
             */
            function renameWfTemp() {
                var data = $scope.gridOptions.hcApi.getFocusedData();
                var selectNode = $scope.treeSetting.zTreeObj.getSelectedNodes()[0];
                if (!data) {
                    return swalApi.info('请先选中想要重命名的流程').then($q.reject);
                }
                return swalApi.input({
                    title: '请输入流程重命名名称',
                    inputValue: data.wftempname,
                    inputValidator: function (value) {
                        if (value == data.wftempname)
                            return '重命名不能一致'
                        return ('' + value) ? '' : '流程名称不能为空';
                    }
                }).then(function (wftempname) {
                    return requestApi
                        .post({
                            classId: 'scpwftemp',
                            action: 'rename',
                            data: {
                                wftempid: data.wftempid,
                                wftempname: wftempname
                            }
                        })
                        .then(function () {
                            $scope.gridOptions.hcApi.setRowData([]);
                        })
                        .then(function () {
                            $scope.treeSetting.hcApi.reload(selectNode.parentNode);
                        })
                })
            }

            /**
             * 打开属性页
             * @override
             */
            $scope.openProp = function () {
                var data = $scope.gridOptions.hcApi.getFocusedData();
                if (data)
                    return openWfTemp(data.wftempid);
            };

            /**
             * 新建文件夹
             * @returns {Promise}
             */
            function addFdr(params) {
                var focusNode = $scope.treeSetting.zTreeObj.getSelectedNodes()[0];
                if (params) {
                    focusNode = params.node;
                }
                return $q
                    .when()
                    .then(function () {
                        return swalApi.input({
                            title: '请输入文件夹名称',
                            inputValidator: function (value) {
                                return ('' + value) ? '' : '文件夹名称不能为空';
                            }
                        });
                    })
                    .then(function (fdrName) {
                        if (focusNode.id == 0) {
                            var data = {
                                parentid: -19,
                                parenttype: 1,
                                flag: 0,
                                fdrid: 0,
                                actived: 2,
                                fdrname: fdrName
                            };
                        } else {
                            var data = {
                                fdrname: fdrName,
                                parentid: focusNode.data.fdrid,
                                parenttype: constant.objType.fdr
                            }
                        }
                        return requestApi.post({
                            classId: 'scpfdr',
                            action: 'insert',
                            data: data
                        });
                    })
                    .then(function (fdr) {
                        var newFdrNode = $scope.treeSetting.zTreeObj.addNodes(focusNode, [{
                            name: fdr.fdrname,
                            data: fdr
                        }])[0];
                        $scope.treeSetting.zTreeObj.selectNode(newFdrNode);
                        $scope.treeSetting.hcApi.reload(newFdrNode);
                    })
                    .then(function () {
                        $scope.treeSetting.hcApi.reload(focusNode);
                    })
            }

            /**
             * 删除文件夹
             * @returns {Promise}
             */
            function deleteFdr(params) {
                var selectNodes = $scope.treeSetting.zTreeObj.getSelectedNodes();
                if (!selectNodes || selectNodes.length !== 1) {
                    return swalApi.info('请先选中想要删除的文件夹').then($q.reject);
                }

                var selectNode = selectNodes[0];
                if (params) {
                    selectNode = params.node;
                }
                var fdr = selectNode.data;

                return swalApi.confirmThenSuccess({
                    title: '确定要删除文件夹【' + fdr.fdrname + '】',
                    okFun: function () {
                        return requestApi
                            .post({
                                classId: 'scpfdr',
                                action: 'delete',
                                data: {
                                    fdrid: fdr.fdrid
                                }
                            })
                            .then(function () {
                                $scope.treeSetting.zTreeObj.removeNode(selectNode);
                                $scope.gridOptions.hcApi.setRowData([]);
                                $scope.treeSetting.hcApi.reload(selectNode.parentNode);
                                unblockSwalApi.success('删除成功');

                            });
                    },
                });
            }

            /**
             * 重命名文件夹
             */
            function renameFdr(params) {

                var selectNodes = $scope.treeSetting.zTreeObj.getSelectedNodes();

                var selectNode;
                if (params) {
                    selectNode = params.node;
                } else if (!selectNodes || selectNodes.length !== 1) {
                    return swalApi.info('请先选中想要重命名的文件夹').then($q.reject);
                } else {
                    selectNode = selectNodes[0];
                }
                var fdr = selectNode.data;
                return swalApi.input({
                    title: '请输入文件夹重命名名称',
                    inputValue: fdr.fdrname,
                    inputValidator: function (value) {
                        if (value == fdr.fdrname)
                            return '重命名不能一致'
                        return ('' + value) ? '' : '文件夹名称不能为空';
                    }
                }).then(function (fdrName) {
                    return requestApi
                        .post({
                            classId: 'scpfdr',
                            action: 'rename',
                            data: {
                                fdrid: fdr.fdrid,
                                fdrname: fdrName
                            }
                        })
                        .then(function () {
                            $scope.gridOptions.hcApi.setRowData([]);
                        })
                        .then(function () {
                            $scope.treeSetting.hcApi.reload(selectNode.parentNode);
                        })
                })

            }

            /**
             * 文件属性
             */
            $scope.open_attr = function (nodedata) {
                return $modal.open({
                    templateUrl: 'views/baseman/wftemp.html',
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                        $scope.data = nodedata;
                        $scope.title = nodedata.wftempid ? '流程属性' : '文件夹属性';
                        $scope.type = nodedata.wftempid ? 'wftemp' : 'fdr';//标示是流程还是文件夹；
                        $scope.footerRightButtons.rightTest = {
                            title: '确定',
                            click: function () {
                                $scope.$close($scope.data)
                            }
                        };
                    }],
                    resolve: {
                        $parent: function () {//data作为modal的controller传入的参数
                            return $scope;//用于传递数据
                        }
                    }
                });
            };

            /**
             * 文件夹/文件 属性modal配置
             */
            $scope.re_ModalSetting = function (node, title) {
                var ModalSetting = {
                    controller: ['$scope', function ($modalScope) {
                        $modalScope.title = title;
                        $modalScope.data = node;
                        $modalScope.footerRightButtons.rightTest = {
                            title: '确定',
                            click: function () {
                                $modalScope.$close($modalScope.data)
                            }
                        };
                    }]
                };
                return ModalSetting;
            };

            $scope.locate = locate;

            /**
             * 定位
             * @param node
             */
            function locate(node) {
                return $q
                    .when()
                    .then(function () {
                        if (node) return node;

                        return $scope.gridOptions.hcApi.getFocusedNodeWithNotice({
                            actionName: '定位'
                        });
                    })
                    .then(function (node) {
                        $scope.isSearchMod = false;

                        return $scope.treeSetting.hcApi.locate({
                            path: node.data.idpath,
                            key: 'fdrid',
                            locateToGrid: true,
                            gridKey: 'wftempid'
                        });
                    });
            }


            /**
             * 解析权限
             */
            $scope.initObjRights = function (treeNode) {
                $scope.data.rightObj = jurisdictionApi.initObjRights(treeNode);
            };

            /**
             * 判断是否有权限
             * @param rightNames
             * @returns {boolean}
             */
            $scope.hasRight = function (rightNames) {
                return jurisdictionApi.hasRight(rightNames, $scope.data.rightObj)
            };

            /**
             * 判断是否拥有 树 右键 权限的权限
             */
            $scope.judge_right_authority = function (treeNode) {
                $scope.initObjRights(treeNode);
                return $scope.hasRight(['cantransfer', 'all'])
            }


            /**
             * 权限弹框
             * @param node
             * @param flag 'tree' 'grid'
             */
            $scope.share = function (node, flag) {
                $scope.share_choose_data = {node: node, flag: flag};
                jurisdictionApi.openshare(flag,$scope);
                /*BasemanService.openFrm("views/baseman/share.html", jurisdictionApi.shareController, $scope, "", "").result.then(function (data) {
                    jurisdictionApi.shareControllerOk(data, flag,$scope);
                })*/
            };

        }

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: WfTemp
        });
    }
);