var basemanControllers = angular.module('inspinia');
function fin_bud_period_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_bud_period_headerEdit = HczyCommon.extend(fin_bud_period_headerEdit, ctrl_bill_public);
    fin_bud_period_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_bud_period_header",
        key: "period_id",
        // wftempid:10137,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'fin_bud_period_lineoffin_bud_period_headers'}]
    };
    $scope.refresh_after = function () {
        $scope.options_13.api.setRowData($scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers);
    }

    // //
    // $scope.search = function () {
    //     $scope.FrmInfo = {
    //         postdata: {flag: 3},
    //         classid: "fin_bud_period_header",
    //     };
    //     BasemanService.open(CommonPopController, $scope)
    //         .result.then(function (result) {
    //         for (name in result) {
    //             $scope.data.currItem[name] = result[name];
    //         }
    //     });
    // };
    /***********************网格处理事件***************************/
    //增加行
    $scope.addpo = function () {
        var data = [];
        var node = $scope.options_13.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        item = {
            seq: node.length + 1,
            line_id: node.length + 1,
        };
        data.push(item);
        $scope.options_13.api.setRowData(data);
    };

    //删除行
    $scope.delpo = function () {
        var data = $scope.gridGetData("options_13");
        var rowidx = $scope.options_13.api.getFocusedCell().rowIndex;
        data.splice(rowidx, 1);
        $scope.options_13.api.setRowData(data);
    }
    /************************网格定义区域**************************/
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
    $scope.columns_13 = [
        {
            headerName: "名称", field: "dname", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "起始日期", field: "start_date", editable: true, filter: 'set', width: 150,
            cellEditor: "年月日",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "结束日期", field: "end_date", editable: true, filter: 'set', width: 100,
            cellEditor: "年月日",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "是否打开", field: "is_close", editable: true, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: '关闭'}, {value: 2, desc: '打开'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "描述", field: "description", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "期间ID", field: "period_id", editable: true, filter: 'set', width: 150, hide: true,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_13 = {
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
            var isGrouping = $scope.options_13.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    /************保存校验区域**********/
    $scope.validate = function () {
        var errorlist = [];
        //delete $scope.data.currItem[""];
        var data = $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers;
        if (data == "" || data == undefined) {
            BasemanService.notice("明细不能为空", "alert-warning");
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var seq = i + 1;
            if (data[i].start_date == undefined || data[i].start_date == "") {
                errorlist.push("明细第" + seq + "行起始日期不能为空");
            }
        }
        for (var i = 0; i < data.length; i++) {
            var seq = i + 1;
            if (data[i].end_date == undefined || data[i].end_date == "") {
                errorlist.push("明细第" + seq + "行结束日期不能为空");
            }
        }
        if (errorlist.length) {
            BasemanService.notify(notify, errorlist, "alert-danger");
            return false;
        }
        return true;
    }
    $scope.save_before = function () {

    }

    /****************************初始化**********************/
    $scope.clearinformation = function () {
        $scope.data = {};
        if (window.userbean) {
            $scope.userbean = window.userbean;
        }
        ;
        $scope.data.currItem = {
            period_year: 2016,
            fin_bud_period_lineoffin_bud_period_headers: []
        };
    };
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('fin_bud_period_headerEdit', fin_bud_period_headerEdit);
