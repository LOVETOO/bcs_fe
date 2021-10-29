var basemanControllers = angular.module('inspinia');
function payment_typeEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    payment_typeEdit = HczyCommon.extend(payment_typeEdit, ctrl_bill_public);
    payment_typeEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "payment_type",
        key: "payment_type_id",
        FrmInfo: {},
        grids: [
            {optionname: 'paymenttype_Options', idname: 'payment_type_lineofpayment_types'},
            {optionname: 'level_Options', idname: 'payment_type_levelofpayment_types'},
        ]
    };
    /**----弹出框区域*---------------*/
    $scope.profit_stat = true;
    $scope.show_profit = function () {
        $scope.profit_stat = !$scope.profit_stat;
    };
    $scope.profit_stat2 = true;
    $scope.show_profit2 = function () {
        $scope.profit_stat2 = !$scope.profit_stat2;
    };

    $scope.profit_stat3 = true;
    $scope.show_profit3 = function () {
        $scope.profit_stat3 = !$scope.profit_stat3;
    };

    $scope.erptypeids = [
        {
        id: 1,
        name: "M"
    }, {
        id: 3,
        name: "N"
    }, {
        id: 5,
        name: "O"
    }, {
        id: 6,
        name: "S"
    }, {
        id: 7,
        name: "T"
    }, {
        id: 8,
        name: "V"
    }, {
        id: 9,
        name: "X"
    }, {
        id: 10,
        name: "Y"
    }];
    //界面初始化
    $scope.clearinformation = function () {
        if (!$scope.data) $scope.data = {};
        $scope.data.currItem = {
            stat: 1,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            creator: window.strUserId,
            payment_type_levelofpayment_types: [],
            payment_type_lineofpayment_types: [],
        };
        // $scope.setitemline($scope.data.currItem);
    };
    /**--------系统词汇词------*/
    //BasemanService.RequestPostAjax("base_search", "erptypeid", {}).then(function (data) {
    //    $scope.erptypeids = data.erptypeids;
    //});
    /**------保存校验区域-----*/
    /**-------网格定义区域 ------*/
    /**-------网格定义区域 ------*/
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
        cellRendererParams: {
            checkbox: true
        }
    };
    $scope.paymenttype_Options = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: true,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        //rowClicked:$scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.paymenttype_Options.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.paymenttype_Columns = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "基础付款方式", field: "pay_type", editable: true, filter: 'set', width: 120,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: 'TT'}, {value: 2, desc: 'LC'}, {
                    value: 3,
                    desc: 'OA'
                }, {value: 4, desc: '领导特批款'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "资金成本率", field: "interest_rate", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "基础扣费", field: "base_fee", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.level_Options = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: true,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.level_Options.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.level_Columns = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "区域等级", field: "pay_level", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: 'A1'}, {value: 2, desc: 'A2'}, {
                    value: 3,
                    desc: 'B1'
                }, {value: 4, desc: 'B2'}, {value: 5, desc: 'C1'}, {value: 6 ,desc: 'C2'}, {
                    value: 7,
                    desc: 'D1'
                }, {value: 8, desc: 'D2'}, {value: 9, desc: 'E'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "信保比例(%)", field: "interest_rate", editable: true, filter: 'set', width: 120,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    /**------ 对网格操作区域-------*/
        //增加当前行、删除当行前    //付款条件明细
    $scope.additem = function () {
        //避免填写数据丢失
        $scope.paymenttype_Options.api.stopEditing(false);
        var data = [];
        var node = $scope.paymenttype_Options.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        var item = {
            seq: node.length + 1
        };
        data.push(item);
        $scope.paymenttype_Options.api.setRowData(data);
        $scope.data.currItem.payment_type_lineofpayment_types = data;
    };
    $scope.delitem = function () {
        //避免填写数据丢失
        $scope.paymenttype_Options.api.stopEditing(false);
        var data = [];
        var rowidx = $scope.paymenttype_Options.api.getFocusedCell().rowIndex;
        var node = $scope.paymenttype_Options.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.paymenttype_Options.api.setRowData(data);
        $scope.data.currItem.payment_type_lineofpayment_types = data;

    };
    //付款比例明细
    $scope.additem2 = function () {
        //避免填写数据丢失
        $scope.level_Options.api.stopEditing(false);
        //判断最后一行是否为空
        var data = [];
        var node = $scope.level_Options.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        var item = {
            seq: node.length + 1
        };
        data.push(item);
        $scope.level_Options.api.setRowData(data);
        $scope.data.currItem.payment_type_levelofpayment_types = data;
    };
    $scope.delitem2 = function () {
        //避免填写数据丢失
        $scope.level_Options.api.stopEditing(false);

        var data = [];
        var rowidx = $scope.level_Options.api.getFocusedCell().rowIndex;
        var node = $scope.level_Options.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.level_Options.api.setRowData(data);
        $scope.data.currItem.payment_type_levelofpayment_types = data;

    };
    //数据缓存
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('payment_typeEdit', payment_typeEdit);