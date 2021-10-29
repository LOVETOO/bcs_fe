/**
 * 费用类别 树列表页 fee_type_tree_list
 * Created by zhl on 2019/3/29.
 */
define(
    ['module', 'controllerApi', 'base_tree_list', 'requestApi', 'numberApi', 'openBizObj', 'swalApi', 'loopApi'],
    function (module, controllerApi, base_tree_list, requestApi, numberApi, openBizObj, swalApi, loopApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q', '$modal',
            //控制器函数
            function ($scope, $q, $modal) {

                $scope.data = {};
                $scope.data.currItem = {};
                $scope.data.currItem.fee_types = {};

                /**
                 * 表格定义
                 */
                $scope.gridOptions = {
                    columnDefs: [{
                        type: "序号",
                        headerCheckboxSelection: true,
                        checkboxSelection: function (args) {
                            //console.log(args,"args");
                            if (args.data.type == 2)
                                return false;

                            return true;
                        }
                    }, {
                        headerName: "编码",
                        field: "fee_code"
                    }, {
                        headerName: "名称",
                        field: "fee_name"
                    }, {
                        headerName: "报销方式",
                        field: "apply_type",
                        hcDictCode: "fin_fee_header_apply_type"
                    }, {
                        headerName: "状态",
                        field: "stat",
                        hcDictCode: "fin_fee_header_stat"
                    }, {
                        headerName: "费用类型",
                        field: "fee_property",
                        hcDictCode: "fee_property"
                    }, {
                        headerName: "提示",
                        field: "subject_desc"
                    }, {
                        headerName: "备注",
                        field: "note"
                    }],
                    hcNoPaging: true

                };

                /**
                 * 树设置
                 */
                $scope.treeSetting = {
                    //获取根节点的方法
                    hcGetRootNodes: function () {
                        return {
                            name: '费用类别',
                            data: {
                                //sqlwhere: 'pid = 0'
                            },
                            isParent: true,
                            fee_type_id: 0,
                            hcIsRoot: true
                        };
                    },
                    //获取子节点的方法
                    hcGetChildNodes: function (node) {
                        var sqlwhere;

                        if (node.data.fee_type_id)
                            sqlwhere = 'pid = ' + node.data.fee_type_id;
                        else
                            sqlwhere = 'pid = 0';

                        return requestApi
                            .post({
                                classId: 'fin_fee_type',
                                action: 'search',
                                data: {
                                    //orgid: node.data.orgid
                                    //fee_type_id:node.data.fee_type_id
                                    fee_type_id: node.data.fee_type_id,
                                    sqlwhere: sqlwhere,
                                    flag: 2
                                }
                            })
                            .then(function (response) {
                                //node.data.fin_fee_types = response.fin_fee_types;
                                node.responseData = response;

                                return response.fin_fee_types.map(function (element) {
                                    return {
                                        id: element.fee_type_id,
                                        pId: element.pid,
                                        name: element.fee_type_name,
                                        data: element,
                                        isParent: true
                                    };
                                });
                            });
                    },
                    //表格信息仅显示[费用项目]
                    hcGetGridData: function (node) {
                        $scope.data.fee_type_heads = node.responseData.fin_fee_headeroffin_fee_types;

                        var tempArr = [];

                        loopApi.forLoop($scope.data.fee_type_heads.length, function (i) {
                            tempArr.push($scope.data.fee_type_heads[i].fee_id);
                        });

                        //树节点(费用类别)的表格数据(费用项目)的id组成的字符串，用于[新增费用项目]过滤
                        $scope.gridIdGroup = tempArr.toString();

                        return $scope.data.fee_type_heads;
                    },
                    hcMenuItems: {
                        refresh: {
                            title: '刷新',
                            icon: 'fa fa-refresh',
                            click: function (params) {
                                $scope.treeSetting.hcApi.reload(params.node);
                            }
                        },
                        add: {
                            title: function () {
                                return "新增";
                            },
                            icon: 'fa fa-file-o',
                            click: function (params) {
                                $scope.add();
                            }
                        },
                        deleteOrg: {
                            title: '删除',
                            icon: 'fa fa-trash-o',
                            click: function (params) {
                                $scope.delete();
                            },
                            hide: function (params) {
                                return isRoot()
                            }
                        },
                        openProp: {
                            title: '查看详情',
                            icon: 'fa fa-info-circle',
                            click: function (params) {
                                $scope.openProp('isTree');
                            },
                            hide: function (params) {
                                return isRoot()
                            }
                        }
                    }
                };

                //继承基础控制器
                controllerApi.extend({
                    controller: base_tree_list.controller,
                    scope: $scope
                });

                /*---------------------------工具栏按钮及相关事件定义 开始---------------------------*/

                //定义[查看费用项目]
                $scope.toolButtons.viewFeeProjectDetail = {
                    title: '费用项目',
                    groupId: '费用项目',
                    icon: 'iconfont hc-search',
                    click: function () {
                        $scope.openProp();
                    },
                    hide: function () {
                        return isRoot();
                    }
                };

                //定义[删除费用项目]
                $scope.toolButtons.deleteFeeProject = {
                    title: '费用项目',
                    groupId: '费用项目',
                    icon: 'fa fa-trash-o',
                    click: function () {
                        $scope.deleteFeeProject();
                    },
                    hide: function () {
                        return isRoot();
                    }
                };

                //定义[新增费用项目]
                $scope.toolButtons.addFeeProject = {
                    title: '费用项目',
                    groupId: '费用项目',
                    icon: 'iconfont hc-add',
                    click: function () {
                        $scope.addFeeProject();
                    },
                    hide: function () {
                        return isRoot();
                    }
                };

                //查询并选中费用项目
                $scope.addFeeProject = function () {
                    $modal.openCommonSearch({  //打开模态框
                            classId: 'fin_fee_header',  //类id
                            postData: {},  //请求的携带数据(可以没有)
                            title: "费用项目",  //模态框标题
                            sqlWhere: ($scope.gridIdGroup && $scope.gridIdGroup.length > 0) ?
                            ' fee_id not in (' + $scope.gridIdGroup + ') ' : '', //过滤表格中已有的费用项目
                            checkbox: true,
                            gridOptions: {  //表格定义
                                columnDefs: [
                                    {
                                        type: '序号'
                                    }, {
                                        field: "fee_code",
                                        headerName: "费用项目编码"
                                    }, {
                                        field: "fee_name",
                                        headerName: "费用项目名称"
                                    }
                                ]
                            }
                        })
                        .result  //响应数据
                        .then(function (result) {
                            console.log(result, 'result');

                            var fin_fee_headeroffin_fee_types = result.map(function (element) {
                                return {
                                    fee_id: element.fee_id
                                }
                            });

                            console.log(fin_fee_headeroffin_fee_types, 'fin_fee_headeroffin_fee_types');

                            //获取当前的树节点
                            var node = $scope.treeSetting.zTreeObj.getSelectedNodes()[0];

                            var postData = {
                                fee_type_id: node.data.fee_type_id,
                                idpath: node.data.idpath,
                                fin_fee_headeroffin_fee_types: fin_fee_headeroffin_fee_types
                            };

                            return requestApi.post('fin_fee_type', 'insert_fee_info', postData).then(function (data) {
                                var a = data;
                                console.log(data, 'add success');
                            }).then(function () {
                                console.log('reload after add project');
                                $scope.treeSetting.hcApi.reload(node);
                            });
                        });
                };

                //批量删除费用项目
                $scope.deleteFeeProject = function (){
                    var selectedNodes = $scope.gridOptions.hcApi.getSelectedNodes('checkbox');

                    if(!selectedNodes.length)
                        return swalApi.info('请先勾选费用项目');

                    var tempArr  = [];

                    loopApi.forLoop(selectedNodes.length, function (i) {
                        tempArr.push(selectedNodes[i].data.fee_id);
                    });

                    var selectFeeIdGroup = tempArr.toString();

                    //获取当前的树节点
                    var node = $scope.treeSetting.zTreeObj.getSelectedNodes()[0];

                    var postData = {
                        sqlwhere:' fee_id in ( '+ selectFeeIdGroup +' ) and fee_type_id = ' + node.data.fee_type_id
                    };

                    return requestApi.post('fin_fee_type', 'delete_fee_info', postData).then(function () {
                        $scope.treeSetting.hcApi.reload(node);
                    });
                };

                //双击树节点打开[费用类别]属性页
                $scope.openTreeProp = openProp;

                function openProp() {
                    return $scope.openProp('isTreeNode');
                }

                /**
                 *双击打开模态框
                 * @param params 传入params则认为是双击树节点
                 * @returns {*}
                 *
                 * 双击树节点修改数据：
                 * 1、打开[费用类别]属性页
                 * 2、获取父节点并reload(父节点)
                 *
                 * 双击网格\右键-查看详情 修改数据：
                 * 1、打开[费用项目]属性页
                 * 2、获取当前节点并reload（当前节点）
                 */
                $scope.openProp = function (params) {
                    var id, parentNode, node;

                    return $q
                        .when()
                        .then(function () {
                            if (angular.isUndefined(params)) {
                                var focusedNode = $scope.gridOptions.hcApi.getFocusedNode();
                                //从表格中获取id
                                id = focusedNode.data.fee_id
                            } else {
                                return $scope.treeSetting.hcApi
                                    .getSelectedNodesWithNotice({
                                        actionName: '查看'
                                    })
                                    .then(function (nodes) {
                                        node = nodes[0];

                                        if (node.hcIsRoot) {
                                            console.log('根节点无法打开！');
                                            return $q.reject();
                                        }

                                        //从树节点获取id
                                        id = numberApi.toNumber(node.data.fee_type_id);

                                        //获取父节点
                                        parentNode = node.getParentNode();
                                    });
                            }

                        })
                        .then(function () {
                            if (id === 0)
                                throw new Error('查看产品分类失败：缺少必要参数 id');
                        }).then(function () {

                            var stateName, title;
                            if (angular.isUndefined(params)) {
                                stateName = 'finman.fin_fee_prop';
                                title = '费用项目';
                            } else {
                                stateName = 'finman.fee_type_prop';
                                title = '费用类别';
                            }

                            openBizObj({
                                stateName: stateName,
                                width: '1000px',
                                height: '300px',
                                params: {
                                    id: id,
                                    title: title
                                }
                            }).result
                                .finally(function () {
                                    //刷新树节点的表格数据
                                    if (angular.isUndefined(params))
                                        $scope.treeSetting.hcApi.reload($scope.treeSetting.zTreeObj.getSelectedNodes()[0]);
                                    //刷新树节点数据
                                    else {
                                        return requestApi.post('fin_fee_type', 'select', {fee_type_id: id})
                                            .then(function (response) {
                                                node.name = response.fee_type_name;
                                                $scope.treeSetting.zTreeObj.updateNode(node);
                                            });
                                    }

                                });
                        });
                }

                //新增费用类别
                $scope.add = function (params) {
                    var pid = 0;

                    return $q
                        .when()
                        .then(function () {
                            if (angular.isUndefined(params)) {
                                return $scope.treeSetting.hcApi
                                    .getSelectedNodesWithNotice({
                                        actionName: '作为父分类'
                                    })
                                    .then(function (nodes) {
                                        pid = nodes[0].data.fee_type_id;
                                    });
                            }
                            else if (angular.isNumber(params) || angular.isString(params)) {
                                pid = numberApi.toNumber(params);
                            }
                            else if (angular.isObject(params)) {
                                if ('pid' in params) {
                                    pid = numberApi.toNumber(params.pid);
                                }
                                else if ('superNode' in params) {
                                    pid = numberApi.toNumber(params.superNode.data.pid);
                                }
                            }
                        })
                        .then(function () {
                            openBizObj({
                                stateName: 'finman.fee_type_prop',
                                width: '1000px',
                                height: '300px',
                                params: {
                                    id: 0,
                                    pid: pid,
                                    title: '费用类别'
                                }
                            }).result
                                .finally($scope.refresh);
                        });
                }

                //删除费用类别
                $scope.delete = function (params) {
                    var fee_type_id = 0;

                    var postData = {};

                    var node, parentNode;

                    return $q
                        .when()
                        .then(function () {
                            if (angular.isUndefined(params)) {
                                return $scope.treeSetting.hcApi
                                    .getSelectedNodesWithNotice({
                                        actionName: '删除分类'
                                    })
                                    .then(function (nodes) {
                                        node = nodes[0];

                                        parentNode = node.getParentNode();

                                        fee_type_id = numberApi.toNumber(node.data.fee_type_id);
                                    });
                            }
                        })
                        .then(function () {
                            return swalApi.confirmThenSuccess({
                                title: '确定要删除费用类别【' + node.data.fee_type_name + '】吗?',
                                okFun: function () {
                                    postData.fee_type_id = fee_type_id;

                                    return requestApi
                                        .post({
                                            classId: 'fin_fee_type',
                                            action: 'delete',
                                            data: postData
                                        })
                                        .then(function () {
                                            var parentNode = node.getParentNode();

                                            if (parentNode)
                                                $scope.treeSetting.hcApi.clickNode(parentNode);
                                            else
                                                $scope.gridOptions.hcApi.setRowData([]);

                                            $scope.treeSetting.zTreeObj.removeNode(node);

                                            //刷新表格
                                            /*refreshGrid(parentNode)*/
                                        });
                                },
                                okTitle: '删除成功'
                            });
                        });

                };

                //是否根节点（所有分类）
                function isRoot() {
                    return $scope.$eval('treeSetting.zTreeObj.getSelectedNodes()[0].hcIsRoot');
                }

                //是否树节点的第level层级(最底层：level = 0)
                function isLevel(level) {
                    return $scope.$eval('treeSetting.zTreeObj.getSelectedNodes()[0].level == ' + level);
                }

                //刷新树节点的表格数据
                $scope.toolButtons.refresh.click = function (params) {
                    $scope.treeSetting.hcApi.reload(params.node);
                };

                //根节点选中时，删除类别隐藏
                $scope.toolButtons.delete.hide = function () {
                    return isRoot();
                };

                //根节点选中时，[查看类别]按钮隐藏
                $scope.toolButtons.openProp.hide = function () {
                    return isRoot();
                };
                $scope.toolButtons.openProp.title = '费用类别';
                $scope.toolButtons.openProp.groupId = '费用类别';
                $scope.toolButtons.openProp.icon = 'iconfont hc-search';
                $scope.toolButtons.openProp.click = function(){
                    $scope.openProp('isTree');
                };

                //[删除类别]
                $scope.toolButtons.delete.title = '费用类别';
                $scope.toolButtons.delete.groupId = '费用类别';

                //[新增类别]
                $scope.toolButtons.add.title = '费用类别';
                $scope.toolButtons.add.groupId = '费用类别';



                /*---------------------------工具栏按钮事件定义 结束---------------------------*/

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

