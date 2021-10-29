var basemanControllers = angular.module('inspinia');
function base_pdm_bill_wf_seach($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    base_pdm_bill_wf_seach = HczyCommon.extend(base_pdm_bill_wf_seach, ctrl_bill_public);
    base_pdm_bill_wf_seach.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "base_process_header",
        key: "wftempid",
        //  wftempid:10008,
        FrmInfo: {},
        grids: [{optionname: 'options_1', idname: 'pro_itemofpro_item_headers'},
            {optionname: 'options_2', idname: 'pro_itemofpro_item_headers'},
            {optionname: 'options_3', idname: 'pro_itemofpro_item_headers'}]
    };


    //查询1标准机型
    $scope.search1 = function () {
        $scope.gridSetData("options_1", "");
        var postdata = {
            flag: 10,
            wfname: $scope.data.currItem.item_code,
            wftempname: $scope.data.currItem.item_h_code,
            statime: $scope.data.currItem.statdate,
            endtime: $scope.data.currItem.enddate,
        };
        BasemanService.RequestPost("base_process_header", "search", postdata)
            .then(function (data) {
                $scope.gridSetData("options_1", data.base_process_headers);
            });
    }
    //查询2标准机型变更
    $scope.search2 = function () {
        $scope.gridSetData("options_2", "");
        var postdata = {
            flag: 11,
            wfname: $scope.data.currItem.item_code2,
            wftempname: $scope.data.currItem.item_h_code2,
            statime: $scope.data.currItem.statdate2,
            endtime: $scope.data.currItem.enddate2,
        };
        BasemanService.RequestPost("base_process_header", "search", postdata)
            .then(function (data) {
                $scope.gridSetData("options_2", data.base_process_headers);
            });
    }
    //查询3临时方案
    $scope.search3 = function () {
        $scope.gridSetData("options_3", "");
        var postdata = {
            flag: 12,
            wfname: $scope.data.currItem.file_no,
            statime: $scope.data.currItem.statdate3,
            endtime: $scope.data.currItem.enddate3,
        };
        BasemanService.RequestPost("base_process_header", "search", postdata)
            .then(function (data) {
                $scope.gridSetData("options_2", data.base_process_headers);
            });
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
    $scope.columns_1 = [{
        headerName: "标机编码", field: "wfname", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "是否可用", field: "usable", editable: false, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 0, desc: '禁用'}, {value: 1, desc: '禁用'}, {value: 2, desc: '可用'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "单据状态", field: "stat", editable: false, filter: 'set', width: 250,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '制单'}, {value: 3, desc: '启动'}, {value: 5, desc: '审核'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: '节点1',
        children: [
            {
                headerName: "审核人", field: "manager1", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time1", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time1", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours1", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点2',
        children: [
            {
                headerName: "审核人", field: "manager2", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time2", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time2", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours2", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点3',
        children: [
            {
                headerName: "审核人", field: "manager3", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time3", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time3", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours3", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点4',
        children: [
            {
                headerName: "审核人", field: "manager4", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time4", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time4", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours4", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点5',
        children: [
            {
                headerName: "审核人", field: "manager5", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time5", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time5", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours5", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }]


    $scope.options_1 = {
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
            var isGrouping = $scope.options_1.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_2 = [{
        headerName: "标机编码", field: "wfname", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "是否可用", field: "usable", editable: false, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 0, desc: '禁用'}, {value: 1, desc: '禁用'}, {value: 2, desc: '可用'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "单据状态", field: "stat", editable: false, filter: 'set', width: 250,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '制单'}, {value: 3, desc: '启动'}, {value: 5, desc: '审核'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: '节点1',
        children: [
            {
                headerName: "审核人", field: "manager1", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time1", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time1", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours1", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点2',
        children: [
            {
                headerName: "审核人", field: "manager2", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time2", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time2", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours2", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点3',
        children: [
            {
                headerName: "审核人", field: "manager3", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time3", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time3", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours3", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点4',
        children: [
            {
                headerName: "审核人", field: "manager4", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time4", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time4", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours4", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点5',
        children: [
            {
                headerName: "审核人", field: "manager5", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time5", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time5", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours5", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }];
    $scope.options_2 = {
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
            var isGrouping = $scope.options_2.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_3 = [{
        headerName: "方案号", field: "wfname", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "是否可用", field: "usable", editable: false, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 0, desc: '禁用'}, {value: 1, desc: '禁用'}, {value: 2, desc: '可用'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "单据状态", field: "stat", editable: false, filter: 'set', width: 250,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '制单'}, {value: 3, desc: '启动'}, {value: 5, desc: '审核'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: '节点1',
        children: [
            {
                headerName: "审核人", field: "manager1", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time1", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time1", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours1", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点2',
        children: [
            {
                headerName: "审核人", field: "manager2", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time2", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time2", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours2", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点3',
        children: [
            {
                headerName: "审核人", field: "manager3", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time3", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time3", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours3", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点4',
        children: [
            {
                headerName: "审核人", field: "manager4", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time4", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time4", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours4", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点5',
        children: [
            {
                headerName: "审核人", field: "manager5", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time5", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time5", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours5", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点6',
        children: [
            {
                headerName: "审核人", field: "manager6", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time6", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time6", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours6", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点7',
        children: [
            {
                headerName: "审核人", field: "manager7", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time7", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time7", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours7", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点8',
        children: [
            {
                headerName: "审核人", field: "manager8", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time8", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time8", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours8", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点9',
        children: [
            {
                headerName: "审核人", field: "manager9", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time9", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time9", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours9", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点10',
        children: [
            {
                headerName: "审核人", field: "manager10", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time10", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time10", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours10", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '节点11',
        children: [
            {
                headerName: "审核人", field: "manager11", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "开始时间", field: "start_time11", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "结束时间", field: "end_time11", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "停留时间", field: "hours11", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }];
    $scope.options_3 = {
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
            var isGrouping = $scope.options_3.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.initdata();
}
//加载控制器
basemanControllers
    .controller('base_pdm_bill_wf_seach', base_pdm_bill_wf_seach);
