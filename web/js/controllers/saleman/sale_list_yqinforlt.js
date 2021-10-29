var finmanControllers = angular.module('inspinia');
function sale_list_yqinforlt($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_list_yqinforlt = HczyCommon.extend(sale_list_yqinforlt, ctrl_bill_public);
    sale_list_yqinforlt.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "edi_extended_list",
        /*     key: "funds_id",*/
        wftempid: 10008,
        FrmInfo: {
            sqlBlock: "funds_type=2",
        },
        grids: [{optionname: 'options_11', idname: 'edi_extended_lists'}, {
            optionname: 'options_12',
            idname: 'edi_extended_lists'
        }/*, {optionname: 'options_13', idname: 'fin_funds_xypmoffin_funds_headers'}, {
         optionname: 'options_14',
         idname: 'fin_funds_sapoffin_funds_headers'
         }*/]
    };

    //下拉
    $scope.search_styles = [{
        id: 1,
        name: "预测录入",
    }, {
        id: 2,
        name: "预测发放",
    }]
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stat = data.dicts;
    });
    $scope.months = [{id: 1, name: "1月"}, {id: 2, name: "2月"}, {id: 3, name: "3月"}, {id: 4, name: "4月"}, {
        id: 5,
        name: "5月"
    }, {id: 6, name: "6月"}, {id: 7, name: "7月"},
        {id: 8, name: "8月"}, {id: 9, name: "9月"}, {id: 10, name: "10月"}, {id: 11, name: "11月"}, {id: 12, name: "12月"}];

    /*查询*/
    $scope.search = function () {
        sqlBlock = "";
        //BasemanService.getSqlWhereBlock(sqlBlock);
        var postdata = {
            //sqlwhere  : sqlBlock,
            org_id: $scope.data.currItem.org_id,
            cust_id: $scope.data.currItem.cust_id,
            invoiceno: $scope.data.currItem.invoiceno,
             area_name: $scope.data.currItem.area_ids,
            start_date: $scope.data.currItem.startdate,
            end_date: $scope.data.currItem.enddate,
            area_ids: $scope.data.currItem.area_name,
        };
        //按天查询
        if ($scope.data.currItem.day_yesorno) {

        } else {
            //按月份查询时
            if ($scope.data.currItem.month_yesorno) {
                if ($scope.data.currItem.month && $scope.data.currItem.year) {
                    postdata.flag = 2;
                    postdata.year = $scope.data.currItem.year;
                    postdata.month = $scope.data.currItem.month;
                } else {
                    BasemanService.notice("请选择年份和月份", "alert-warning")
                    return;
                }
            }
        }
        BasemanService.RequestPost("edi_extended_list", "search", postdata)
            .then(function (data) {
                console.log(data.edi_extended_lists);
                $scope.data.currItem.edi_extended_lists = data.edi_extended_lists;
                $scope.options_11.api.setRowData(data.edi_extended_lists);
            });
    }

    $scope.selectcode = function () {

        $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
            backdatas: "orgs",
            sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_id = result.orgid;
        });

    }

    $scope.selectcodedq = function () {
        ;
        $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
            backdatas: "orgs",
            type: "checkbox",
            sqlBlock: 'CpcOrg.Stat =2 and OrgType in (3)  '
        };
        $scope.data.currItem.area_code = "";
        $scope.data.currItem.area_ids = "";
        $scope.data.currItem.area_name = "";
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (items) {
            for (var i = 0; i < items.length; i++) {
                if ($scope.data.currItem.area_code == "") {
                    $scope.data.currItem.area_code = items[i].code;
                    $scope.data.currItem.area_ids = items[i].orgid;
                    $scope.data.currItem.area_name = items[i].orgname;
                } else {
                    $scope.data.currItem.area_code = $scope.data.currItem.area_code + "," + items[i].code;
                    $scope.data.currItem.area_ids = $scope.data.currItem.area_ids + "," + items[i].orgid;
                    $scope.data.currItem.area_name = $scope.data.currItem.area_name + ',' + items[i].orgname;
                }
            }
            // $scope.data.currItem.area_code = result.code;
            // $scope.data.currItem.area_name = result.orgname;
            /*$scope.data.currItem.cust_id = result.cust_id;*/
        });

    }
    //业务部门
    $scope.changeAreaName = function () {

        $scope.data.currItem.org_name = "";
        $scope.data.currItem.org_id = "";
    };
    //客户
    $scope.change_customer = function () {

        $scope.data.currItem.cust_name = "";
        $scope.data.currItem.cust_id = "";
        $scope.data.currItem.cust_codea = "";
    };
    //大区
    $scope.change_area = function () {

        $scope.data.currItem.area_name = "";
        $scope.data.currItem.area_ids = "";
    };

    $scope.selectcust = function () {
        var fla = "";
        if ($scope.data.currItem.org_id != "" && $scope.data.currItem.org_id != undefined) {
            fla = "org_id = " + $scope.data.currItem.org_id;
        }

        $scope.FrmInfo = {
            classid: "customer",
            postdata: {},
            backdatas: "customers",
            sqlBlock: fla
        };

        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_id = result.cust_id;
        });

    }
    /**********************隐藏、显示*************************/
    $scope.clickchange2 = function () {
        if ($scope.data.currItem.check2 == true) {
            $scope.options_12.columnApi.hideColumns(["area_name"])
        } else {
            $scope.options_12.columnApi.setColumnsVisible(["area_name"])
        }
    };
    $scope.clickchange3 = function () {
        if ($scope.data.currItem.check3 == true) {
            $scope.options_12.columnApi.hideColumns(["org_name"])
        } else {
            $scope.options_12.columnApi.setColumnsVisible(["org_name"])
        }
    };
    $scope.clickchange4 = function () {
        if ($scope.data.currItem.check4 == true) {
            $scope.options_12.columnApi.hideColumns(["cust_code"])
        } else {
            $scope.options_12.columnApi.setColumnsVisible(["cust_code"])
        }
    };
    $scope.clickchange5 = function () {
        if ($scope.data.currItem.check5 == true) {
            $scope.options_12.columnApi.hideColumns(["fact_invoice_no"])
        } else {
            $scope.options_12.columnApi.setColumnsVisible(["fact_invoice_no"])
        }
    };
    $scope.clickchange6 = function () {
        if ($scope.data.currItem.check6 == true) {
            $scope.options_12.columnApi.hideColumns(["month"])
        } else {
            $scope.options_12.columnApi.setColumnsVisible(["month"])
        }
    };
    //汇总保留2位
    $scope.sum_retain = function () {
        var nodes = $scope.options_12.api.getModel().rootNode.childrenAfterSort;
        var data = $scope.gridGetData("options_12");
        for (var i = 0; i < $scope.columns_12.length; i++) {
            for (var j = 0; j < data.length; j++) {
                if ($scope.columns_12[i].field == "prod_amt") {
                    if (data[j].prod_amt != undefined) {
                        data[j].prod_amt = parseFloat(data[j].prod_amt || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "new_qty") {
                    if (data[j].new_qty != undefined) {
                        data[j].new_qty = parseFloat(data[j].new_qty || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "redo_qty") {
                    if (data[j].redo_qty != undefined) {
                        data[j].redo_qty = parseFloat(data[j].redo_qty || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "s1") {
                    if (data[j].s1 != undefined) {
                        data[j].s1 = parseFloat(data[j].s1 || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "s3") {
                    if (data[j].s3 != undefined) {
                        data[j].s3 = parseFloat(data[j].s3 || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "s8") {
                    if (data[j].s8 != undefined) {
                        data[j].s8 = parseFloat(data[j].s8 || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "s6") {
                    if (data[j].s6 != undefined) {
                        data[j].s6 = parseFloat(data[j].s6 || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "s11") {
                    if (data[j].s11 != undefined) {
                        data[j].s11 = parseFloat(data[j].s11 || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "s12") {
                    if (data[j].s12 != undefined) {
                        data[j].s12 = parseFloat(data[j].s12 || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "amt4") {
                    if (data[j].amt4 != undefined) {
                        data[j].amt4 = parseFloat(data[j].amt4 || 0).toFixed(2);
                    }
                }
            }

        }
        $scope.options_12.api.refreshCells(nodes, ["prod_amt", "amt4", "s12", "s11", "s6", "s8", "s3", "s1", "redo_qty", "new_qty", "prod_amt"]);
    };
    //汇总列
    $scope.groupby = function (arr, column, datas) {
        if ($scope.data.currItem.check1 == false && $scope.data.currItem.check2 == false && $scope.data.currItem.check3 == false
            && $scope.data.currItem.check4 == false && $scope.data.currItem.check5 == false && $scope.data.currItem.check6 == false) {
            BasemanService.notice("请选择条件再汇总!", "alert-warning");
            return;
        }
        $scope.sumcontainer = [];
        var arr = [], column = [];
        var sortmodel = [];
        var datas = $scope.gridGetData("options_11");
        // var datas=$scope.data.currItem.sale_lists;

        if ($scope.data.currItem.check2 == true) {
            arr.push("area_name");
            $scope.options_12.columnApi.hideColumns(["area_name"])
            sortmodel.push({colId: "area_name", sort: "desc"})
        }
        if ($scope.data.currItem.check3 == true) {
            arr.push("org_name");
            $scope.options_12.columnApi.hideColumns(["org_name"])
            sortmodel.push({colId: "org_name", sort: "desc"})
        }
        if ($scope.data.currItem.check4 == true) {
            arr.push("cust_code");
            $scope.options_12.columnApi.hideColumns(["cust_code"])
            sortmodel.push({colId: "cust_code", sort: "desc"})
        }
        if ($scope.data.currItem.check5 == true) {
            arr.push("fact_invoice_no");
            $scope.options_12.columnApi.hideColumns(["fact_invoice_no"])
            sortmodel.push({colId: "fact_invoice_no", sort: "desc"})
        }
        if ($scope.data.currItem.check6 == true) {
            arr.push("month");
            $scope.options_12.columnApi.hideColumns(["month"])
            sortmodel.push({colId: "month", sort: "desc"})
        }
        column[0] = "kh_amt2";
        column[1] = "invoice_amt";
        column[2] = "yq_amt";
        column[3] = "new_qty";
        column[4] = "redo_qty";
        column[5] = "s1";
        column[6] = "s3";
        column[7] = "s8";
        column[8] = "s6";
        column[9] = "s11";
        column[10] = "s12";
        column[11] = "amt4";
        var sumcontainer = HczyCommon.Summary(arr, column, datas);

        //汇总最后一行
        var total = {};
        for (var j = 0; j < column.length; j++) {
            var arr = column[j];
            total[arr] = 0;
        }
        for (var i = 0; i < sumcontainer.length; i++) {
            for (var j = 0; j < column.length; j++) {
                var arr = column[j];
                if (sumcontainer[i][arr] != undefined) {
                    total[arr] += parseFloat(sumcontainer[i][arr]);
                }
            }
        }
        for (var j = 0; j < column.length; j++) {
            var arr = column[j];
            total[arr] = parseFloat(total[arr]).toFixed(2);
        }
        total.sales_user_id = "合计";
        sumcontainer.push(total);
        $scope.options_12.api.setRowData(sumcontainer);
        $scope.options_12.api.setSortModel(sortmodel)

        $scope.sum_retain();
    };
    $scope.show_11 = false;
    $scope.show11 = function () {
        $scope.show_11 = !$scope.show_11;
    };
    $scope.show_12 = false;
    $scope.show12 = function () {
        $scope.show_12 = !$scope.show_12;
    };
    $scope.show_13 = false;
    $scope.show13 = function () {
        $scope.show_13 = !$scope.show_13;
    };
    //隐藏区域
    $scope.show_11 = false;
    $scope.show_sap = function () {
        $scope.show_11 = !$scope.show_11;
    };

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
    //单据明细
    $scope.columns_11 = [
        {
            headerName: "月份", field: "month", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            /*            cellEditorParams: {
             values: [{value: "1", desc: "空调组织"}]
             },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "考核日期", field: "create_time", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "大区", field: "area_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "发票金额", field: "invoice_amt", editable: false, filter: 'set', width: 250,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "逾期金额", field: "yq_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "到期日期", field: "dq_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "考核日期", field: "kh_time", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "考核金额（CNY）", field: "kh_amt2", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }];
    $scope.options_11 = {
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
            var isGrouping = $scope.options_11.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    //产品部信息
    $scope.columns_12 = [
        {
            headerName: "月份", field: "month", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            /*            cellEditorParams: {
             values: [{value: "1", desc: "空调组织"}]
             },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "大区", field: "area_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "部门", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "发票金额", field: "invoice_amt", editable: false, filter: 'set', width: 250,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "逾期金额", field: "yq_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "到期日期", field: "dq_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "考核日期", field: "kh_time", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }, {
            headerName: "考核金额（CNY）", field: "kh_amt2", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true

        }];
    $scope.options_12 = {
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
            var isGrouping = $scope.options_12.columnApi.getRowGroupColumns().length > 0;
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
finmanControllers
    .controller('sale_list_yqinforlt', sale_list_yqinforlt);
