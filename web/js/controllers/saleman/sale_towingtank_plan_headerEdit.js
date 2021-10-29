var basemanControllers = angular.module('inspinia');
function sale_towingtank_plan_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_towingtank_plan_headerEdit = HczyCommon.extend(sale_towingtank_plan_headerEdit, ctrl_bill_public);
    sale_towingtank_plan_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_towingtank_plan_header",
        key: "bill_id",
        FrmInfo: {},
        // wftempid: ,
        grids: [{optionname: 'lineoptions', idname: 'sale_towingtank_plan_lineofsale_towingtank_plan_headers'}]
    };

    $scope.months = [{id: 1, name: "1月"}, {id: 2, name: "2月"}, {id: 3, name: "3月"}, {id: 4, name: "4月"},
        {id: 5, name: "5月"}, {id: 6, name: "6月"}, {id: 7, name: "7月"}, {id: 8, name: "8月"}
        , {id: 9, name: "9月"}, {id: 10, name: "10月"}, {id: 11, name: "11月"}, {id: 12, name: "12月"}]

    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_style"}).then(function (data) {
        var pay_styles = [];
        for (var i = 0; i < data.dicts.length; i++) {
            pay_styles[i] = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            };
        }
        if ($scope.getIndexByField('linecolumns', 'pay_style')) {
            $scope.linecolumns[$scope.getIndexByField('linecolumns', 'pay_style')].cellEditorParams.values = pay_styles;
        }
    });

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
    //资金预览
    $scope.lineoptions = {
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
        rowDoubleClicked: $scope.rowDoubleClicked_view,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.lineoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.linecolumns = [
        {
            headerName: "序号",
            field: "seq",
            editable: false,
            filter: 'set',
            width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "大区", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            headerName: "计划下达时间", field: "plan_date",
            editable: true, filter: 'set', width: 120,
            cellEditor: "时分秒",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty: true,
        }, {
            headerName: "状态", field: "stat", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: [{value: "1", desc: "待拖柜"}, {value: "2", desc: "已拖柜"}, {value: "3", desc: "取消"}]
            },
            non_empty: true,
        }, {
            headerName: "出货预告号", field: "warn_no",
            editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            headerName: "PI号", field: "pi_nos",
            editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            headerName: "运费付款方式", field: "pay_style", editable: false, filter: 'set', width: 120,
            cellEditor: "下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: []
            },
        }, {
            headerName: '箱量',
            field: "box_qty",
            children: [
                {
                    headerName: "20GP",
                    field: "box_qty1",
                    width: 60,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "40GP",
                    field: "box_qty2",
                    width: 60,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "40HQ",
                    field: "box_qty3",
                    width: 60,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "45HQ",
                    field: "box_qty4",
                    width: 60,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "40RH",
                    field: "box_qty5",
                    width: 60,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "拼箱",
                    field: "box_qty6",
                    width: 60,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "空运",
                    field: "box_qty7",
                    width: 60,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "一卡一车",
                    field: "box_qty8",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "二卡一车",
                    field: "box_qty9",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "三卡一车",
                    field: "box_qty10",
                    width: 100,
                    editable: false,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }
            ]
        }, {
            headerName: "商检号", field: "inspection_batchno",
            editable: false, filter: 'set', width: 90,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            headerName: "船公司", field: "tow_cop_name",
            editable: false, filter: 'set', width: 90,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            headerName: "协议货代", field: "transit_name",
            editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            headerName: "截关日", field: "cut_date",
            editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }
    ];

    $scope.addline = function () {
        $scope.FrmInfo = {
            classid: "sale_ship_warn_header",
            type: "checkbox",
        };
        BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (items) {
            if (items.length == undefined) {
                return;
            }
            var lines = $scope.gridGetData("lineoptions");
            var isExist = true;
            for (var i = 0; i < items.length; i++) {
                var isExist = HczyCommon.isExist(lines, items[i], ["warn_no"]).exist;
                if (!isExist) {
                    $scope.add_one_line(items[i]);
                }
            }

        })

    }

    $scope.add_one_line=function (item) {
        delete item.stat;
        var requestPost = BasemanService.RequestPostNoWait("sale_towingtank_plan_header", "getmsg", {
            warn_id: item.warn_id,
            bill_id: $scope.data.currItem.bill_id || 0,
            flag:2,//flag=1时，校验该出货预告时候已经在line表中，返回商检单号，大区信息
        });
        if (requestPost.pass) {
            item.inspection_batchno = requestPost.data.inspection_batchno;
            item.org_code = requestPost.data.org_code;
            item.org_name = requestPost.data.org_name;
            item.org_id = requestPost.data.org_id;
            var lines=requestPost.data.sale_towingtank_plan_lineofsale_towingtank_plan_headers;
            for(var i=0;i<lines.length;i++){
                item["box_qty" + lines[i].box_type] = lines[i].box_qty
            }
            $scope.gridAddItem("lineoptions", item);
        }
    }

    $scope.change_box_col = function (lines) {
        var cols = $scope.linecolumns[$scope.getIndexByField("linecolumns", "box_qty")].children;
        for (var i = 0; i < cols.length; i++) {
            var field = cols[i].field;
            var notqty = true;
            for (var j = 0; j < lines.length; j++) {
                if (lines[j][field] != undefined && lines[j][field] > 0) {
                    notqty = false;
                    break;
                }
            }
            cols[i].hide = notqty;
        }
        $scope.lineoptions.api.setColumnDefs($scope.linecolumns);
        $scope.lineoptions.api.refreshView();
    }

    $scope.delline = function () {
        $scope.gridDelItem("lineoptions");
    }

    $scope.lastColIndex = $scope.linecolumns.length;

    $scope.refresh_after = function () {
        $scope.set_month_col($scope.data.currItem.p_year, $scope.data.currItem.p_month, false);
    }

    $scope.clearinformation = function () {
        $scope.data.currItem.p_month = Number(moment().format("M"));
        $scope.data.currItem.p_year = Number(moment().year());
        $scope.set_month_col($scope.data.currItem.p_year, $scope.data.currItem.p_month, true)
    }

    $scope.change_year_month = function () {
        if ($scope.data.currItem.p_month == undefined || $scope.data.currItem.p_month == "") {
            return;
        }
        if ($scope.data.currItem.p_year == undefined || $scope.data.currItem.p_year == "") {
            return;
        }
        $scope.set_month_col($scope.data.currItem.p_year, $scope.data.currItem.p_month, false);
    }

    $scope.set_month_col = function (year, month, isinit) {
        var monthFirstDay = year + "-" + month + "-01";
        var startIndex = $scope.data.lastColIndex;
        if (!isinit) {
            $scope.linecolumns.splice($scope.lastColIndex, 120);
        }
        for (var i = 0; i < 31;) {
            var dateh = moment(monthFirstDay).add(i, "d").format("YYYY-MM-DD");
            if (i > 27) { //2月份需要注意
                var month1 = moment(dateh).format("M");
                if (month1 != month) {
                    break;
                }
            }
            var headername = dateh + "  (" + moment(dateh).format("dddd") + ")";
            i++;
            var columnobj = {
                headerName: headername,
                field: "note" + i,
                headerClass: {
                    align: "center",
                },
                children: [
                    {
                        headerName: "上午(08:00-12:00)", field: "date_am" + i, editable: true, filter: 'set', width: 135,
                        cellEditor: "文本框",
                        enableRowGroup: true,
                        enablePivot: true,
                        enableValue: true,
                        floatCell: true,
                        non_empty: true,
                    }, {
                        headerName: "下午(12:00-18:00)", field: "date_pm" + i, editable: true, filter: 'set', width: 135,
                        cellEditor: "文本框",
                        enableRowGroup: true,
                        enablePivot: true,
                        enableValue: true,
                        floatCell: true,
                        non_empty: true,
                    }, {
                        headerName: "上午(18:00-08:00)", field: "date_em" + i, editable: true, filter: 'set', width: 135,
                        cellEditor: "文本框",
                        enableRowGroup: true,
                        enablePivot: true,
                        enableValue: true,
                        floatCell: true,
                        non_empty: true,
                    }, {
                        headerName: "备注", field: "note" + i, editable: true, filter: 'set', width: 135,
                        cellEditor: "文本框",
                        enableRowGroup: true,
                        enablePivot: true,
                        enableValue: true,
                        floatCell: true,
                        non_empty: true,
                    }]
            }
            $scope.linecolumns.push(columnobj);
        }
        if (!isinit) {
            $scope.lineoptions.api.setColumnDefs($scope.linecolumns);
            $scope.lineoptions.api.refreshView();
        }
    }
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('sale_towingtank_plan_headerEdit', sale_towingtank_plan_headerEdit);
