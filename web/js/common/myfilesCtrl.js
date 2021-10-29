/**
 * 弹出框个人文件
 * 2018-12-24
 */
define(
    ['module', 'controllerApi', 'jquery' ,'directive/agGridview','base/ctrl_bill_public','requestApi','base_diy_page','swalApi','plugins/aggrid/ag-grid-enterprise.hc','directive/hcGrid'],
    function (module, controllerApi, $,agGrid,ctrl_bill_public,requestApi,base_diy_page,swalApi) {
        'use strict';
        var myfilesCtrl = [
            //声明依赖注入
            // 'BasemanService',
            '$scope', '$q', '$location', '$modal', '$timeout', 'BasemanService', '$modalInstance',
            //控制器函数
            function ($scope, $q, $location, $modal, $timeout, BasemanService, $modalInstance) {
                //继承
                controllerApi.extend({
                    controller: ctrl_bill_public.controller,
                    scope: $scope
                });

                $scope.data = {};
                $scope.data.currItem = {};

                /**
                 * 确定
                 */
                $scope.ok = function () {
                    // var data = $scope.gridGetSelectedData('options');
                    var data = $scope.options.hcApi.getSelectedData({type: 'auto'});
                    if (data.length == 0)
                        return swalApi.info("请先选择文件");
                    var infoBool = false;
                    data.forEach(function (item) {
                        if (!item.docid)
                            infoBool = true;
                    });
                    if (infoBool)
                        return swalApi.info("选中的数据中包含有非文件类型");
                    $modalInstance.close(data);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                /**
                 * 弃用
                 */
                $scope.rowDoubleClicked = function (e) {
                    var data = $scope.gridGetRow('options');
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    var postdata = {};
                    for (name in e.data) {
                        if (name != 'children') {
                            postdata[name] = e.data[name];
                        }
                    }
                    if (data.docid) {
                        //域名
                        var net = window.location.href
                        $scope.viewDoc(data, net);
                        BasemanService.RequestPost('file', 'getdownstatus', data)
                            .then(function (res) {
                                //
                            })
                        //是工作去区和回收站时
                    } else {
                        if (e.data.wsid) {
                            var classname = 'scpworkspace'
                        } else {
                            var classname = 'scpfdr'
                        }
                        BasemanService.RequestPost(classname, 'selectref', postdata)
                            .then(function (data) {
                                if (data.shortcuts && data.shortcuts.length > 0) {
                                    for (var i = 0; i < data.shortcuts.length; i++) {
                                        data.shortcuts[i].fdrname = data.shortcuts[i].scname;
                                        data.shortcuts[i].fdrid = parseInt(data.shortcuts[i].refid);
                                    }
                                    data.fdrs = data.shortcuts;
                                    data.children = data.shortcuts;
                                } else {
                                    data.children = data.fdrs;
                                }
                                var treeNode = $scope.zTree.getNodesByParam("id", e.data.fdrid, null);
                                //var treeNode = zTree.getNodesByParam("id",e.data.id,null);
                                $scope.zTree.selectNode(treeNode[0]);
                                if (data.children) {

                                    //treeNode[0].children=[];

                                    for (var i = 0; i < data.fdrs.length; i++) {
                                        data.fdrs[i].name = data.fdrs[i].fdrname;
                                        data.fdrs[i].item_type = 1;
                                        if (data.fdrs[i].creator == userbean.userid) {
                                            data.fdrs[i].objaccess = '2222222';
                                        }
                                    }
                                    if (data.docs) {
                                        for (var i = 0; i < data.docs.length; i++) {
                                            data.docs[i].name = data.docs[i].docname;
                                            if (data.docs[i].creator == userbean.userid) {
                                                data.docs[i].objaccess = '2222222';
                                            }
                                        }
                                        $scope.data.currItem.files = data.fdrs.concat(data.docs);
                                        ;
                                    } else {
                                        $scope.data.currItem.files = data.fdrs;
                                    }

                                    if (!treeNode.children) {
                                        for (var i = 0; i < data.children.length; i++) {
                                            data.children[i].isParent = true;
                                            data.children[i].name = data.children[i].fdrname
                                            data.children[i].pId = parseInt(treeNode.id);
                                            data.children[i].id = parseInt(data.children[i].fdrid)
                                            data.children[i].item_type = 1;
                                            //zTree.addNodes(treeNode,data.children[i])
                                        }
                                    }
                                    $scope.zTree.expandNode(treeNode[0], true, false, true, true);
                                    $timeout(
                                        function () {
                                            $scope.options.api.setRowData($scope.data.currItem.files)
                                        }, 250
                                    )

                                }

                            });
                    }

                }

                /**
                 * 双击选择
                 */
                $scope.rowDoubleClicked1 = function () {
                    var data = $scope.options.hcApi.getFocusedData();
                    if (!data.docid)
                        return swalApi.info("请选择文件类型数据");
                    $modalInstance.close([data]);
                };

                $scope.options = {
                    hcEvents: {rowDoubleClicked: $scope.rowDoubleClicked1},
                    // rowDoubleClicked: $scope.rowDoubleClicked,
                    suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
                    rowDeselection: true,
                    rowHeight: 25,
                    getNodeChildDetails: function (file) {
                        if (file.group) {
                            file.group = file.group;
                            return file;
                        } else {
                            return null;
                        }
                    },
                    enableColResize: true,
                    icons: {
                        groupExpanded: '<i class="fa fa-minus-square-o"/>',
                        groupContracted: '<i class="fa fa-plus-square-o"/>',
                        columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                        filter: '<i class="fa fa-filter"/>',
                        sortAscending: '<i class="fa fa-long-arrow-down"/>',
                        sortDescending: '<i class="fa fa-long-arrow-up"/>',
                    },
                    columnDefs:[{
                        headerName: "名称",
                        field: "name",
                        width: 280,
                        onclick: $scope.rowClicked,
                        //cellClass:function(params){return cellClassf(params)},
                        cellRenderer: function (params) {
                            return imageRenderer(params)
                        },
                        //cellClass: 'fa fa-file-excel-o'

                    }, {
                        headerName: "类型",
                        field: "item_type",
                        width: 100,
                        cellEditor: "文本框",
                        cellRenderer: function (params) {
                            return itemtypeRenderer(params)
                        }
                    }, {
                        headerName: "版本",
                        field: "isvirtual",
                        width: 80,
                        cellStyle: {
                            'font-style': 'normal'
                        }
                    }, {
                        headerName: "大小(Byte)",
                        field: "oldsize",
                        width: 100,
                        cellStyle: {
                            'font-style': 'normal'
                        }
                    }, {
                        headerName: "时间",
                        field: "createtime",
                        width: 100,
                        cellEditor: "时分秒",
                        cellStyle: {
                            'font-style': 'normal'
                        }
                    }, {
                        headerName: "用户",
                        field: "creator",
                        width: 100,
                        cellEditor: "文本框",
                        cellStyle: {
                            'font-style': 'normal'
                        }
                    }],
                };

                function imageRenderer(params) {
                    if (params.data.item_type == 1) {
                        return "<img src='/web/img/file.png'>" + params.data[params.colDef.field];
                    } else {
                        var classname = HczyCommon.getAttachIcon(params.value);
                        var plus = '';
                        if (parseInt(params.data.wfid) > 0) {
                            plus += ';background-color:#5de466';
                        }
                        if (parseInt(params.data.stat) == 8) {
                            plus += ';background-color:#e2e20e';
                        }

                        var color = '';
                        if (classname == 'fa-file-pdf-o') {
                            color = 'style="color:#8c0404' + plus + '"';
                        } else if (classname == 'fa-file-excel-o') {
                            color = 'style="color:green' + plus + '"'
                        } else if (classname == 'fa-file-word-o') {
                            color = 'style="color:#0808de' + plus + '"'
                        } else if (classname == 'fa-file-powerpoint-o') {
                            color = 'style="color:red' + plus + '"'
                        } else if (classname == 'fa-file-image-o') {
                            color = 'style="color:blue' + plus + '"';
                        } else {
                            color = 'style="' + plus + '"';
                        }
                        /**if(){
						//return '<span class="fa-stack fa-lg"><i class="fa '+classname+' fa-stack-2x"></i><i class="fa fa-flag fa-stack-1x fa-inverse"'+'style="color:red"'+'></i></span>'
						return '<i '+color+' background-color: rgb(255, 255, 0) '+' class="fa '+classname+' fa-lg">'+'</i>'+params.data[params.colDef.field];
					}else{

					}*/
                        return '<i class="fa ' + classname + ' fa-lg"' + color + '>' + '</i>' + params.data[params.colDef.field];

                    }
                }

                function itemtypeRenderer(params) {
                    if (parseInt(params.value) == 1) {
                        return '文件夹';
                    } else {
                        var doc = params.data;
                        if (doc.docname && (doc.docname.toLowerCase().toString().endsWith(".jpg") || doc.docname.toLowerCase().endsWith(".png") || doc.docname.toLowerCase().endsWith(".jpeg") || doc.docname.toLowerCase().endsWith(".bmp"))) {
                            return '图片文件'
                        } else if (doc.docname && (doc.docname.toLowerCase().endsWith(".doc") || doc.docname.toLowerCase().endsWith(".docx"))) {
                            return 'word 文件'
                        } else if (doc.docname && doc.docname.toLowerCase().endsWith(".xlsx") || doc.docname.toLowerCase().endsWith(".xls")) {
                            return 'excel 文件'
                        } else if (doc.docname && doc.docname.toLowerCase().endsWith(".txt")) {
                            return '文本文件'
                        } else if (doc.docname && (doc.docname.toLowerCase().endsWith(".ppt")) || (doc.docname.toLowerCase().endsWith(".pptx"))) {
                            return 'PPT 文件'
                        } else if (doc.docname && (doc.docname.toLowerCase().endsWith(".pdf"))) {
                            return 'pdf 文件'
                        } else {
                            return '其它文件'
                        }

                    }
                }


                function cellClassf(params) {
                    if (params.data.item_type != 1) {
                        var classname = HczyCommon.getAttachIcon(params.value);
                        return 'fa ' + classname;
                    }
                }

                /**
                 * 树配置
                 */
                var setting = {
                    async: {
                        enable: true,
                        url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
                        autoParam: ["id", "name=n", "level=lv"],
                        otherParam: {
                            "id": 108
                        },
                        dataFilter: filter
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        beforeExpand: beforeExpand,
                        //onAsyncSuccess: onAsyncSuccess,//回调函数，在异步的时候，进行节点处理（有时间延迟的），后续章节处理
                        onClick: menuShowNode
                    }
                };

                function beforeExpand(treeId, treeNode) {
                    if (treeNode.children) {
                        return;
                    }
                    if (treeNode.wsid) {
                        var classname = 'scpworkspace'
                    } else {
                        var classname = 'scpfdr'
                    }
                    var postdata = treeNode;
                    postdata.excluderight = 1;
                    var obj = BasemanService.RequestPostNoWait(classname, 'selectref', postdata)
                    var data = obj.data
                    if (data.shortcuts && data.shortcuts.length > 0) {
                        for (var i = 0; i < data.shortcuts.length; i++) {
                            data.shortcuts[i].fdrname = data.shortcuts[i].scname;
                            data.shortcuts[i].fdrid = data.shortcuts[i].refid;
                        }
                        data.children = data.shortcuts;
                    } else {
                        data.children = data.fdrs;
                    }

                    if (data.children) {
                        treeNode.children = [];
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo_frm");
                        for (var i = 0; i < data.children.length; i++) {
                            data.children[i].isParent = true;
                            data.children[i].name = data.children[i].fdrname
                            data.children[i].pId = parseInt(treeNode.id);
                            data.children[i].id = parseInt(data.children[i].fdrid)
                            data.children[i].item_type = 1;
                            data.children[i].icon = '/web/img/file.png';
                            if (data.children[i].creator == userbean.userid) {
                                data.children[i].objaccess = treeNode.objaccess;
                            }

                            //zTree.addNodes(treeNode,data.children[i])
                        }
                        $scope.zTree.addNodes(treeNode, [0], data.children, true)
                        //zTree.expandNode(treeNode, true, false, false);

                        $scope.options.api.setRowData(data.children);
                    }
                }

                function filter(treeId, parentNode, childNodes) {
                    return null;
                    /**for (var i=0, l=childNodes.length; i<l; i++) {
			childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
		}
                     return childNodes;*/
                }

                function ajaxGetNodes(treeNode, reloadType) {
                    //var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    if (reloadType == "refresh") {
                        $scope.zTree.updateNode(treeNode);
                    }
                }

                //单击节点 显示节点
                function menuShowNode() {
                    //$scope['options'].api.setRowData([{docid:17872,docname:"600-300.png"}]);
                    //var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    var node = $scope.zTree.getSelectedNodes()[0];
                    if (node.id == 0) {
                        $scope['options'].api.setRowData($scope.data.fdrs_levelOne);
                    } else if (node.wsid) {
                        var postdata = {};
                        for (name in node) {
                            if (name != 'children') {
                                postdata[name] = node[name];
                            }
                        }
                        postdata.excluderight = 1;
                        BasemanService.RequestPost('scpworkspace', 'selectref', postdata)
                            .then(function (data) {
                                //如果是文件，那么提前放到左边的父类文件夹中
                                if (data.fdrs.length > 0) {
                                    if (!node.children) {
                                        var children = [];
                                        for (var i = 0; i < data.fdrs.length; i++) {
                                            data.fdrs[i].isParent = true;
                                            data.fdrs[i].pId = node.id;
                                            data.fdrs[i].id = parseInt(data.fdrs[i].fdrid);
                                            data.fdrs[i].item_type = 1;
                                            data.fdrs[i].name = data.fdrs[i].fdrname;
                                            data.fdrs[i].icon = "/web/img/file.png";
                                            children.push(data.fdrs[i]);
                                        }
                                        $scope.zTree.addNodes(node, [0], children, true)
                                    }
                                    for (var i = 0; i < data.fdrs.length; i++) {
                                        data.fdrs[i].name = data.fdrs[i].fdrname;
                                        data.fdrs[i].item_type = 1;
                                    }
                                    $scope.data.currItem.files = data.fdrs;
                                }
                                if (data.shortcuts.length > 0) {
                                    if (!node.children || node.children.length == 0) {
                                        var children = [];
                                        for (var i = 0; i < data.shortcuts.length; i++) {
                                            data.shortcuts[i].isParent = true;
                                            data.shortcuts[i].pId = node.id;
                                            data.shortcuts[i].id = parseInt(data.shortcuts[i].refid);
                                            data.shortcuts[i].fdrid = parseInt(data.shortcuts[i].refid);
                                            data.shortcuts[i].item_type = 1;
                                            data.shortcuts[i].name = data.shortcuts[i].scname;
                                            data.shortcuts[i].fdrname = data.shortcuts[i].scname;
                                            data.shortcuts[i].icon = "/web/img/file.png";
                                            children.push(data.shortcuts[i]);
                                        }
                                        $scope.zTree.addNodes(node, [0], children, true)
                                    }
                                    for (var i = 0; i < data.shortcuts.length; i++) {
                                        data.shortcuts[i].name = data.shortcuts[i].scname;
                                        data.shortcuts[i].fdrid = parseInt(data.shortcuts[i].refid);
                                        data.shortcuts[i].fdrname = data.shortcuts[i].scname;
                                        data.shortcuts[i].item_type = 1;

                                    }
                                    $scope.data.currItem.files = data.shortcuts;
                                }
                                $scope['options'].api.setRowData($scope.data.currItem.files);
                            });
                    } else {

                        $scope.selectfdr(node);
                    }
                }

                $scope.selectfdr = function (node) {

                    var postdata = {};
                    for (name in node) {
                        if (name != 'children') {
                            postdata[name] = node[name];
                        }
                    }
                    postdata.flag = 1;
                    BasemanService.RequestPost('scpfdr', 'selectref', postdata)
                        .then(function (data) {
                            //如果是文件，那么提前放到左边的父类文件夹中
                            if (data.fdrs) {
                                if (!node.children) {
                                    var children = [];
                                    for (var i = 0; i < data.fdrs.length; i++) {
                                        data.fdrs[i].isParent = true;
                                        data.fdrs[i].pId = node.id;
                                        data.fdrs[i].id = parseInt(data.fdrs[i].fdrid);
                                        data.fdrs[i].item_type = 1;
                                        data.fdrs[i].name = data.fdrs[i].fdrname;
                                        data.fdrs[i].icon = "/web/img/file.png";
                                        children.push(data.fdrs[i]);
                                        if (data.fdrs[i].creator == userbean.userid) {
                                            data.fdrs[i].objaccess = node.objaccess;
                                        }
                                    }
                                    $scope.zTree.addNodes(node, [0], children, true)
                                }

                            }
                            for (var i = 0; i < data.docs.length; i++) {
                                data.docs[i].name = data.docs[i].docname;
                                if (data.docs[i].creator == userbean.userid) {
                                    data.docs[i].objaccess = node.objaccess;
                                }
                            }
                            for (var i = 0; i < data.fdrs.length; i++) {
                                data.fdrs[i].name = data.fdrs[i].fdrname;
                                data.fdrs[i].item_type = 1;
                            }
                            $scope.data.currItem.files = data.fdrs.concat(data.docs);
                            $scope['options'].api.setRowData($scope.data.currItem.files);
                        });
                }

                /**
                 * 获取根目录
                 */
                /*requestApi.post({
                    classId: 'scpworkspace',
                    action: 'selectall',
                    data: {
                        /!*wstype: 4,
                         userid: window.userbean.userid,
                         modid: 933,
                         sysuserid: window.userbean.sysuserid,*!/
                        wstype: 4,
                        userid: window.userbean.userid,
                        modid: 12,
                        sysuserid: window.userbean.sysuserid
                    }
                })*/
                requestApi.post({
                    classId: 'scpworkspace',
                    action: 'selectref',
                    data: {wsid: userbean.wsid, wstype: 4, excluderight: 1, wsright: 'FF0000FFFF0000000000000000FF'}
                })
                    .then(function (data) {
                        //var  post   =data.workspaces[1]
                        /*var zNodes = {
                            icon: "/web/img/file_01.png"
                        };
                        zNodes.name = window.userbean.userid + "的文件管理";
                        if (userbean.userauth.admins) {
                            zNodes.objaccess = '2222222';
                        }
                        //zNodes.name = '公司文档'
                        zNodes.id = 0;
                        zNodes.isParent = true;
                        zNodes.fdrid = 0;
                        $scope.data.fdrs_levelOne = data.workspaces
                        data.children = data.workspaces;

                        for (var i = 0; i < data.children.length; i++) {
                            data.children[i].isParent = true;
                            data.children[i].name = data.children[i].wsname;
                            //文件夹的时候设置为1
                            data.children[i].item_type = 1;
                            data.children[i].id = parseInt(i + 1);
                            data.children[i].fdrid = parseInt(i + 1);
                            data.children[i].icon = '/web/img/computer.png';
                            data.children[i].objaccess = '2222222';
                        }
                        zNodes.children = data.children;
                        $scope.tree_data = zNodes;*/


                        var zNodes = {
                            icon: "/web/img/file.png"
                        };
                        zNodes.name = "我的文件";
                        zNodes.objaccess = 0;
                        zNodes.id = 0;
                        zNodes.isParent = true;
                        zNodes.fdrid = 0;
                        zNodes.idpath = 1;
                        $scope.data.fdrs_levelOne = data.fdrs;
                        data.children = data.fdrs;
                        //添加快捷方式
                        if(data.shortcuts){
                            data.shortcuts.forEach(function(item,index){
                                item.fdrname = item.scname;
                                item.item_type = -2;
                                data.children.push(item);
                            });
                        }
                        for (var i = 0; i < data.children.length; i++) {
                            data.children[i].isParent = true;
                            data.children[i].name = data.children[i].fdrname;
                            //文件夹的时候设置为1
                            data.children[i].item_type = 1;
                            data.children[i].id = data.children[i].fdrid;
                            data.children[i].objaccess = 127;
                            data.children[i].icon = "/web/img/file.png";
                        }
                        zNodes.children = data.children;
                        $scope.tree_data = zNodes;

                        $timeout(function () {
                            if ($scope.data.currItem.tree_datas) {
                                $scope.tree_data = $scope.data.currItem.tree_datas;
                            }
                            var zTree = $.fn.zTree.init($("#treeDemo_frm",parent.document), setting, $scope.tree_data);
                            if ($scope.data.currItem.selectNode) {
                                zTree.selectNode($scope.data.currItem.selectNode[0]);
                            }

                            $scope.zTree = $.fn.zTree.getZTreeObj("treeDemo_frm");
                            //展开根节点
                            zTree.expandNode(zTree.getNodes()[0], true, false, false);
                        }, 100)
                    })


                //new agGrid.Grid($('#ag-gridview'), gridOptions);

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: myfilesCtrl
        });
    }
);