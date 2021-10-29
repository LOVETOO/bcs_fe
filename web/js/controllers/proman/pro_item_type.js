var salemanControllers = angular.module('inspinia');
function pro_item_type($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {
    //继承基类方法
    pro_item_type = HczyCommon.extend(pro_item_type, ctrl_bill_public);
    pro_item_type.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "pro_item_type",
        key: "item_type_id",
        // wftempid: 10082,
        FrmInfo: {},
        grids: [
            {
                optionname: 'tree_options',
                idname: 'pro_item_types',
                istree: true,//$scope.objconf.grids[0]，必须放到第一个
            }]
    };

    $scope.userbean = window.userbean;


    $scope.setforcus = function () {
        $scope.forcusRow = $scope.gridGetRow("tree_options");
        if ($scope.data.flag != 3) {
            return;
        }
        if (!$scope.forcusRow || $scope.forcusRow[$scope.objconf.key] == undefined) {
            return $scope.forcusRow = false;
        }
        if ($scope.tree_options.api.getRenderedNodes()[$scope.tree_options.api.getFocusedCell().rowIndex].parent) {
            $scope.Father = $scope.tree_options.api.getRenderedNodes()[$scope.tree_options.api.getFocusedCell().rowIndex].parent.data;
        }
        for (var i = 0; i < $scope.Father.children.length; i++) {
            if ($scope.forcusRow[$scope.objconf.key] == $scope.Father.children[i][$scope.objconf.key]) {
                $scope.childeIndex = i;
                return;
            }
        }
        return $scope.forcusRow = false;
    }

    $scope.open_edit = function () {
        $scope.setforcus();
        BasemanService.openFrm("views/proman/pro_item_typeEdit.html", pro_item_typeEdit, $scope, "", "").result.then(function () {

        })
    }

    $scope.newchild = function () {
        $scope.data.flag = 2;//增加子节点
        $scope.setforcus();
        if ($scope.forcusRow.isitem == "2") {
            BasemanService.notice("选中节点是子节点，不允许添加子节点!");
            return;
        }
        if (!$scope.forcusRow) {//没有选中父节点
            BasemanService.notice("请选中父节点!");
            return;
        }
        $scope.open_edit();
    }

    $scope.look_detail = function () {
        $scope.data.flag = 1;//增加子节点
        $scope.setforcus();
        $scope.open_edit();
    }


    $scope.delete = function () {
        $scope.data.flag = 3;//删除子节点
        $scope.setforcus();
        if (!$scope.forcusRow || ($scope.forcusRow.children != undefined && $scope.forcusRow.children.length > 0)) {//没有选中删除对象
            BasemanService.notice("请选需要删除的子节点!");
            return;
        }
        var msg = "删除" + $scope.Father.item_type_name + "下的" + $scope.forcusRow.item_type_name + "数据吗?";
        ds.dialog.confirm(msg, function () {
                BasemanService.RequestPost($scope.objconf.name, "delete", $scope.forcusRow).then(function () {
                    $scope.Father.children.splice($scope.childeIndex, 1);
                    $scope.Father.group = ($scope.Father.children.length > 0);
                    $scope.tree_options.api.setRowData($scope.data.currItem[$scope.objconf.grids[0].idname]);
                })
            }, function () {

            }
        );
    }

    $scope.search = function () {
        BasemanService.RequestPost($scope.objconf.name, "search", {})
            .then(function (data) {
                var shift = [];
                shift[0] = {
                    item_type_no: "所有产品类别",
                    group: true,
                    expanded: true,
                    children: [],
                };
                $scope.data.currItem[$scope.objconf.grids[0].idname] = shift;
                var tree = $scope.setTree(data[$scope.objconf.grids[0].idname], $scope.objconf.key, "pid");
                shift[0].children = [tree];
                $scope.tree_options.datasource = $scope.data.currItem[$scope.objconf.grids[0].idname];
                $scope.tree_options.api.setRowData($scope.data.currItem[$scope.objconf.grids[0].idname]);
            });
    };
    /*------START OF 下层的维护控制器-------*/
    var pro_item_typeEdit = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
        pro_item_typeEdit = HczyCommon.extend(pro_item_typeEdit, ctrl_bill_public);
        pro_item_typeEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
        $scope.objconf = {
            name: "pro_item_type",
            key: "item_type_id",
            FrmInfo: {},
            grids: []
        };

        var dict_options = $scope.$parent.tree_options;
        var forcusRow = $scope.$parent.forcusRow;
        var flag = $scope.$parent.data.flag;
        $scope.item_kinds = [{id: "1", name: "空调组织"}];
        $scope.levs = [{id: "1", name: "所有产品"}, {id: "2", name: "大类级"}, {id: "3", name: "小类级"}, {id: "4", name: "系列级"}];
        $scope.clearinformation = function () {
            if (flag == 1) {//1表示查看属性
                HczyCommon.stringPropToNum(forcusRow);
                $scope.data.currItem = forcusRow;
                $scope.data.currItem.lev = String($scope.data.currItem.lev);
                $scope.data.currItem.item_kind = String($scope.data.currItem.item_kind);
            } else if (flag == 2) {//2表示增加子节点
                $scope.data.currItem.pid = forcusRow[$scope.objconf.key];
                $scope.data.currItem.parentidpath = forcusRow.idpath;
                // $scope.data.currItem.dictcode = forcusRow.dictcode;
                $scope.data.currItem.useinvorg = 1;
                $scope.data.currItem.isitem = 2;
                $scope.data.currItem.usable = 2;
            }
        }

        $scope.ok = function () {
            $scope.actionstr = "ok";
            $scope.save(2);
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            dict_options.api.refreshView();
        }

        $scope.applyto = function () {
            $scope.actionstr = "applyto";
            $scope.save(2);
        }

        $scope.save_before = function () {
            if (flag == 1){
                $scope.children = $scope.data.currItem.children;
                delete $scope.data.currItem.children;
            }
        }

        $scope.refresh_after = function () {
            if (flag == 1){
                forcusRow.children = $scope.children;
            }
            if (flag == 2 && $scope.data.currItem[$scope.objconf.key] != undefined && $scope.data.currItem[$scope.objconf.key] > 0) {
                forcusRow.children = forcusRow.children || [];
                forcusRow.children.push($scope.data.currItem);
                forcusRow.group = (forcusRow.children.length > 0);
                forcusRow.expanded = forcusRow.group;
                $scope.$parent.tree_options.api.setRowData($scope.$parent.data.currItem[$scope.$parent.objconf.grids[0].idname]);
            }
            if ($scope.actionstr == "ok") {
                $modalInstance.close();
            }
            $scope.$parent.tree_options.api.setRowData($scope.$parent.data.currItem[$scope.$parent.objconf.grids[0].idname]);
            $scope.new();
        }

        $scope.validate = function () {
            var msg = []
            if ($scope.data.currItem.item_type_no == undefined || $scope.data.currItem.item_type_no == "") {
                msg.push("产品类别编码不能为空");
            }
            if ($scope.data.currItem.item_type_name == undefined || $scope.data.currItem.item_type_name == "") {
                msg.push("产品类别名称不能为空");
            }
            if (msg.length > 0) {
                BasemanService.notice(msg);
                return false;
            }
            return true;

        }
        $scope.initdata();
    }
    /*------END OF 下层的维护控制器-------*/

    $scope.setData = function (e) {
        e.data.expanded = e.node.expanded;
    }

    $scope.rowDoubleClicked = function (e) {
        e.data.expanded = e.node.expanded;
    }

    //初始化
    $scope.clearinformation = function () {
        $scope.data.currItem[$scope.objconf.grids[0].idname] = [];
        $scope.data.currItem.create_time = new Date();
        $scope.data.currItem.creator = window.userbean.userid;
        $scope.search();
    };
    /**网格配置*/
    {
        //分组功能
        var groupColumn = {
            headerName: "Group",
            width: 200,
            field: 'name',
            valueGetter: function (params) {
                if (params.node.group) {
                    return params.node.key;
                } else {
                    return params.data[params.colDef.field];
                }
            },
            comparator: agGrid.defaultGroupComparator,
            cellRenderer: 'group',
            cellRendererParams: function (params) {
            }
        };


        $scope.tree_options = {
            rowSelection: 'multiple',
            enableColResize: true,
            enableSorting: true,
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            rowHeight: 25,
            rowClicked: $scope.setData,
            rowDoubleClicked: $scope.rowDoubleClicked,
            getNodeChildDetails: function (file) {
                if (file.group) {
                    file.group = file.group;
                    return file;
                } else {
                    return null;
                }
            },
            icons: {
                groupExpanded: '<i class="fa fa-minus-square-o"/>',
                groupContracted: '<i class="fa fa-plus-square-o"/>',
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.tree_columns = [
            {
                headerName: "产品类别编码", field: "item_type_no", editable: false, filter: 'set', width: 140,
                cellEditor: "树状结构"
            }, {
                headerName: "产品类别名称", field: "item_type_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "是否可用", field: "usable", editable: false, filter: 'set', width: 100,
                cellEditor: "复选框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "整机单台制造费用", field: "p1", editable: false, filter: 'set', width: 140,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
            }, {
                headerName: "內机单台制造费用", field: "np1", editable: false, filter: 'set', width: 140,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
            }, {
                headerName: "外机单台制造费用", field: "wp1", editable: false, filter: 'set', width: 140,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
            }, {
                headerName: "整机单台变动制造费用", field: "p2", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
            }, {
                headerName: "內机单台变动制造费用", field: "np2", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
            }, {
                headerName: "外机单台变动制造费用", field: "wp2", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
            }, {
                headerName: "机型系数", field: "jxxs", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "层级", field: "lev", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{value: 1, desc: '所有产品'}, {value: 2, desc: '大类级'}, {value: 3, desc: '小类级'}, {
                        value: 4,
                        desc: '系列级'
                    }]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
        ];
    }
    $scope.initdata();
}//加载控制器
salemanControllers
    .controller('pro_item_type', pro_item_type);
