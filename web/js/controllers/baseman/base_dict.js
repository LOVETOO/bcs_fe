var salemanControllers = angular.module('inspinia');
function base_dict($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {
    //继承基类方法
    base_dict = HczyCommon.extend(base_dict, ctrl_bill_public);
    base_dict.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "base_dict",
        key: "dictid",
        // wftempid: 10082,
        FrmInfo: {},
        grids: [
            {
                optionname: 'options_11',
                idname: 'base_dicts',
                istree: true,
            }]
    };

    $scope.setforcus = function () {
        var data = $scope.gridGetRow("options_11");
        if (!data || data.dictid == undefined) {
            return $scope.forcusRow = false;
        }
        var roots = $scope.data.currItem[$scope.objconf.grids[0].idname][0].children;
        for (var i = 0; i < roots.length; i++) {
            if (data.dictid == roots[i].dictid) {
                $scope.forcusRow = roots[i];
                return;
            }
            if (roots[i].children == undefined) {
                continue;
            }
            for (var j = 0; j < roots[i].children.length; j++) {
                if (data.dictid == roots[i].children[j].dictid) {
                    $scope.forcusRow = roots[i].children[j];
                    $scope.Father = roots[i];
                    $scope.childeIndex = j;
                    return;
                }
            }
        }
        return $scope.forcusRow = false;

    }

    $scope.open_dict = function () {
        $scope.setforcus();
        BasemanService.openFrm("views/baseman/base_dictEdit.html", base_dictEdit, $scope, "", "").result.then(function () {
            $scope.options_11.api.setRowData($scope.data.currItem[$scope.objconf.grids[0].idname]);
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
        $scope.open_dict();
    }

    $scope.look_detail = function () {
        var forcusRow = $scope.gridGetRow("options_11", "First");
        $scope.data.flag = 1;//增加子节点
        $scope.open_dict();
    }


    $scope.delete = function () {
        $scope.setforcus();
        if (!$scope.forcusRow || $scope.forcusRow.isitem == "1") {//没有选中删除对象
            BasemanService.notice("请选需要删除的子节点!");
            return;
        }
        var msg = "删除" + $scope.Father.dictname + "下的" + $scope.forcusRow.dictname + "数据吗?";
        ds.dialog.confirm(msg, function () {
                BasemanService.RequestPost("scpdict", "delete", $scope.forcusRow).then(function () {
                    $scope.Father.children.splice($scope.childeIndex, 1);
                    $scope.options_11.api.setRowData($scope.data.currItem[$scope.objconf.grids[0].idname]);
                })
            }, function () {

            }
        );
    }

    $scope.search = function () {
        BasemanService.RequestPost("pro_new_dict", "getorguserlev", {})
            .then(function (data) {
                var shift = [];
                shift[0] = {
                    dictcode: "所有词汇类别",
                    group: true,
                    expanded: true,
                    children: [],
                };
                //循环递归处理树状数据结构
                $scope.callback(data.pro_new_dicts);
                for (var i = 0; i < data.pro_new_dicts.length; i++) {
                    if (data.pro_new_dicts[i].childrens) {
                        delete data.pro_new_dicts[i].childrens;
                    }
                }
                shift[0].children = data.pro_new_dicts;
                $scope.data.currItem[$scope.objconf.grids[0].idname] = [shift[0]];
                $scope.options_11.datasource = $scope.data.currItem[$scope.objconf.grids[0].idname];
                $scope.options_11.api.setRowData($scope.data.currItem[$scope.objconf.grids[0].idname]);
            });
    };

    var base_dictEdit = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
        base_dictEdit = HczyCommon.extend(base_dictEdit, ctrl_bill_public);
        base_dictEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
        $scope.objconf = {
            name: "scpdict",
            key: "dictid",
            FrmInfo: {},
            grids: []
        };

        var dict_options = $scope.$parent.options_11;
        var forcusRow = $scope.$parent.forcusRow;
        var flag = $scope.$parent.data.flag;
        $scope.invorgids = [{id: "0", name: "<无>"}]
        $scope.clearinformation = function () {
            if (flag == 1) {//1表示查看属性
                $scope.data.currItem = forcusRow;
                $scope.data.currItem.usable = Number($scope.data.currItem.usable);
            } else if (flag == 2) {//2表示增加子节点
                $scope.data.currItem.pid = forcusRow.dictid;
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
            if (flag == 2 && $scope.data.currItem.dictid != undefined && $scope.data.currItem.dictid > 0) {
                forcusRow.children = forcusRow.children || [];
                forcusRow.group = true;
                forcusRow.expanded = true;
                forcusRow.children.push($scope.data.currItem);
            }
            if ($scope.actionstr == "ok") {
                $modalInstance.close();
            }
            dict_options.api.refreshView();
            $scope.new();
        }

        $scope.validate = function () {
            var msg = []
            if ($scope.data.currItem.dictcode == undefined || $scope.data.currItem.dictcode == "") {
                msg.push("词汇编码不能为空");
            }
            if ($scope.data.currItem.dictname == undefined || $scope.data.currItem.dictname == "") {
                msg.push("词汇名称不能为空");
            }
            if ($scope.data.currItem.dictvalue == undefined || $scope.data.currItem.dictvalue == "") {
                msg.push("词汇值不能为空");
            }
            if (msg.length > 0) {
                BasemanService.notice(msg);
                return false;
            }
            return true;

        }

        $scope.initdata();

    }
    $scope.rowClicked11 = function (e) {
        if (e == undefined) {
            var forcusRow = $scope.gridGetRow('options_11');
        }
        if (e.data) {
            if (e.data.dictid == undefined) { //双击如果有子节点是打开
                return;
            }
            $scope.data.flag = 1;//双击弹出的是查看属性
            $scope.open_dict();
        }
    }

    //初始化
    $scope.clearinformation = function () {
        $scope.data.currItem[$scope.objconf.grids[0].idname] = [];
        $scope.data.currItem.create_time = new Date();
        $scope.data.currItem.creator = window.userbean.userid;
        $scope.search();
    };
    //递归方法 循环递归处理树状数据结构
    $scope.callback = function (array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].children) {
                array[i].group = true;
                array[i].expanded = false;
            }
            if (array[i].children) {
                for (var j = 0; j < array[i].children.length; j++) {
                    if (array[i].children[j].children) {
                        array[i].children[j].group = true;
                        array[i].children[j].expanded = false;
                        $scope.callback(array[i].children[j].children);
                    }
                }
            }
        }
    }
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


        $scope.options_11 = {
            rowSelection: 'multiple',
            enableColResize: true,
            enableSorting: true,
            rowDoubleClicked: $scope.rowClicked11,
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            rowHeight: 25,
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
        $scope.columns_11 = [{
            headerName: "词汇编码", field: "dictcode", editable: false, filter: 'set', width: 140,
            cellEditor: "树状结构"
        }, {
            headerName: "词汇名称", field: "dictname", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "词汇值", field: "dictvalue", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "启用库存组织", field: "useinvorg", editable: false, filter: 'set', width: 120,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: '否'}, {value: 2, desc: '是'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            headerName: "库存组织", field: "invorgid", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: "0", desc: '<无>'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "是否子项", field: "isitem", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: '分类'}, {value: 2, desc: '系统值'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "是否可用", field: "usable", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: '否'}, {value: 2, desc: '是'}]
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
    .controller('base_dict', base_dict);
