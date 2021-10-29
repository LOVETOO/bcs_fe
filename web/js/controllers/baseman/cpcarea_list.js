/**
 *产品分类
 */
function scparea($scope, BasemanService) {
    $scope.data = {};
    $scope.data.currItem = {};

    var zTreeObj;
    var zTreeNodes = [];
    var zTreeNode = {};
    var currentNode;
    var setting = {
        view: {
            selectedMulti: false,showIcon:false
        },
        callback: {
            onClick: zTreeOnClick,
            beforeExpand: beforeExpand,
        }
    }
    //添加按钮
    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button>";
        //+"<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };

    $scope.levs = [
        {id: 1, name: "洲"},
        {id: 2, name: "国家"},
        {id: 3, name: "区域"},
        {id: 4, name: "省/直辖市"},
        {id: 5, name: "地级市/地区"},
        {id: 6, name: "县级市/县/区"},
        {id: 7, name: "乡镇/街道"}
    ];

    var levelFormat = function (row,cell,value) {
        var r = '';
        $.each($scope.levs, function (i, item) {
            if(item.id == value){
                r = item.name;
                return;
            }
        });
        return r;
    };

    //网格设置
    $scope.headerOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
        //onClick:dgOnClick
    };
    //定义网格字段
    $scope.headerColumns = [
        {   id: "seq",
            name: "序号",
            field: "seq",
            behavior: "select",
            cssClass: "cell-selection",
            width: 45,
            cannotTriggerInsert: true,
            resizable: false,
            selectable: false,
            focusable: false
        }, {
            name: "操作",
            editable: false,
            width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: false,
            formatter: editHeaderButtons
        }, {
            id: "areacode",
            name: "区域编码",
            behavior: "select",
            field: "areacode",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: false
        },
        {
            id: "areaname",
            name: "区域名称",
            behavior: "select",
            field: "areaname",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: false
        },
        {
            id: "shorter_form",
            name: "简称",
            field: "shorter_form",
            width: 100
        },
        {
            id: "telzone",
            name: "电话区号",
            field: "telzone",
            width: 100
        },
        {
            id: "areatype",
            name: "类型",
            behavior: "select",
            field: "areatype",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: false,
            formatter:levelFormat
        },
        {
            id: "note",
            name: "备注",
            behavior: "select",
            field: "note",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: false
        }
    ];

    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGrid", [], $scope.headerColumns, $scope.headerOptions);

    //主表清单绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    //双击事件
    $scope.headerGridView.onDblClick.subscribe(function(e,args){$scope.viewDetail(args)});

    /**
     * 事件判断
     */
    function dgOnClick(e, args) {
        if ($(e.target).hasClass("viewbtn")) {
            $scope.viewDetail(args);
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            del(args);
            e.stopImmediatePropagation();
        }
    };



    /**
     * 加载
     */
    $scope.init = function () {
        zTreeObj = $.fn.zTree.init(angular.element("#tree"), setting, []);
        //生成树节点
        zTreeNodes = [];
        var itemNode = {};
        itemNode.name = "所有地区";
        itemNode.id = 0;
        itemNode.isParent = true;
        itemNode.isLoadChilded = false;
        itemNode.data = {lev:1};
        currentNode = itemNode;
        zTreeNodes.push(itemNode);
        zTreeObj.addNodes(null, zTreeNodes);
        //跟节点
        var node = zTreeObj.getNodeByParam("id",itemNode.id );
        //zTreeObj.selectNode(node)
        //默认展开2级
        expandNode(node,true);
        //加载网格数据
        var param = {
            superid: 0
        }
        BasemanService.RequestPost("scparea", "search", param).then(function (data) {
            setGridData($scope.headerGridView, data.scpareas);
        });
    }

    /**
     * 刷新
     */
    $scope.refresh = function () {
        $scope.init();
    }


    /**
     * 加载网格数据
     */
    function setGridData(gridView, datas) {
        gridView.setData([]);
        //加序号
        if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                datas[i].seq = i + 1;
            }
        }
        //设置数据
        gridView.setData(datas);
        //重绘网格
        gridView.render();
    }

    /**
     * 树数据加载  ztree
     */
    function load_children() {
        var param = {
            superid: currentNode.id
        }
        BasemanService.RequestPost("scparea", "search", param).then(function (data) {
            //列表加载
            setGridData($scope.headerGridView, data.scpareas);
            zTreeObj.expandNode(currentNode, true, false, false);
            if (!currentNode.isLoadChilded) {
                zTreeNodes = [];
                $.each(data.scpareas, function (i, item) {
                    var itemNode = {};
                    itemNode.name = item.areaname;
                    itemNode.id = item.areaid;
                    itemNode.isParent = true;
                    itemNode.data = item;
                    zTreeNodes.push(itemNode);
                });
                zTreeObj.removeChildNodes(currentNode);
                zTreeObj.addNodes(currentNode, zTreeNodes);
                //标记为已加载数据
                currentNode.isLoadChilded = true;
                zTreeObj.updateNode(currentNode);
            }
        });
    }

    /**
     * 添加
     */
    $scope.add = function () {
        BasemanService.openModal({"style":{width:880,height:350},"url": "/index.jsp#/baseman/scparea_pro/0","title":"行政区域",
            "obj":$scope,"pid":currentNode.id,"pareacode":currentNode.data.areacode,
            "action":"insert",ondestroy: $scope.refresh});
    }


    /**
     * 详情
     * @param args
     */
    $scope.viewDetail = function (args) {
        BasemanService.openModal({"style":{width:880,height:350},"url": "/index.jsp#/baseman/scparea_pro/" + args.grid.getDataItem(args.row).areaid,
            "title":"行政区域","obj":$scope,"pareacode":currentNode.data.areacode,
            "action":"update",ondestroy: $scope.refresh});
    };



    /**
     * 删除
     */
    function del(args){
        var dg = $scope.headerGridView;
        var rowidx = args.row;
        var postData = {};
        var row = args.grid.getDataItem(args.row);
        postData.areaid = row.areaid;
        postData.areaname = row.areaname;
        BasemanService.swalDelete("删除", "确定要删除 " +postData.areaname+ " 吗？", function (bool) {
            if (bool) {
                //删除数据成功后再删除网格数据
                BasemanService.RequestPost("scparea", "delete", JSON.stringify(postData))
                    .then(function (data) {
                        dg.getData().splice(rowidx, 1);
                        dg.invalidateAllRows();
                        dg.render();
                        var node = zTreeObj.getNodeByParam("id",postData.areaid);
                        zTreeObj.removeNode(node);
                    });
            }else {
                return;
            }
        });
    };


    /**
     * 树单击事件
     */
    function zTreeOnClick(event, treeId, treeNode) {
        currentNode = treeNode
        load_children();
    };
    //展开树节点 - 事件
    function beforeExpand(treeId, treeNode) {
        expandNode(treeNode,false);
    }

    //展开树节点-数据加载
    function expandNode(treeNode,isAuto) {
        if (treeNode.isLoadChilded) {
            return;
        }
        //默认展开2级
        if(isAuto && treeNode.data.lev>2){
            return;
        }
        var param = {
            superid: treeNode.id
        }
        BasemanService.RequestPost("scparea", "search", param)
            .then(function (data) {
                //添加节点
                zTreeNodes = [];
                $.each(data.scpareas, function (i, item) {
                    var itemNode = {};
                    itemNode.name = item.areaname;
                    itemNode.id = item.areaid;
                    itemNode.isParent = true;
                    itemNode.isLoadChilded = false;
                    itemNode.data = item;
                    zTreeNodes.push(itemNode);
                });
                zTreeObj.removeChildNodes(treeNode);
                zTreeObj.addNodes(treeNode, zTreeNodes);
                //标记为已加载数据
                treeNode.isLoadChilded = true;
                zTreeObj.updateNode(currentNode);
                if(isAuto){
                    $.each(zTreeNodes, function (i, item) {
                        var node = zTreeObj.getNodeByParam("id",item.id );
                        //expandNode(node,true);
                    });
                }
            });
    }

    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();
}
//注册控制器
angular.module('inspinia')
    .controller('scparea', scparea);