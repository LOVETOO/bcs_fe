var basemanControllers = angular.module('inspinia');
function sale_price_list_search_fhw($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_price_list_search_fhw = HczyCommon.extend(sale_price_list_search_fhw, ctrl_bill_public);
    sale_price_list_search_fhw.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_list",
        /*        key: "out_id",*/
        //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_11', idname: 'sale_lists'},
            {optionname: 'options_12', idname: 'sale_listshz'}]
    };
    $scope.clearinformation = function () {
        $scope.data.currItem.x1 = 2;
        $scope.data.currItem.x2 = 2;
        $scope.data.currItem.x3 = 2;
        $scope.data.currItem.x4 = 2;
        $scope.data.currItem.x5 = 2;
        $scope.data.currItem.x6 = 2;
    };
    // 查询条件勾选
    $scope.cheked1 = function () {
        if ($scope.data.currItem.check_time) {
            $scope.data.currItem.notice_time = false;
            $scope.data.currItem.create_time = false;
        }
    }
    $scope.cheked2 = function () {
        if ($scope.data.currItem.notice_time) {
            $scope.data.currItem.check_time = false;
            $scope.data.currItem.create_time = false;
        }
    }
    $scope.cheked3 = function () {
        if ($scope.data.currItem.create_time) {
            $scope.data.currItem.notice_time = false;
            $scope.data.currItem.check_time = false;
        }
    }
    //////////////////////////////////弹出框查询////////////////////////////////////////////////////////
    $scope.selectorg = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
            sqlBlock: "CpcOrg.Stat =2 and OrgType in (5, 14) and" + window.userbean.like_org_ids,
            backdatas: "orgs",

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_id = result.orgid;

        });
    }
    $scope.clearorg = function () {
        $scope.data.currItem.org_code = "";
        $scope.data.currItem.org_name = ""
        $scope.data.currItem.org_id = "";
    }
    //查询
    $scope.search = function () {
        var time_flag;
        if ($scope.data.currItem.check_time == 2) {
            time_flag = 1;
        }
        if ($scope.data.currItem.notice_time == 2) {
            time_flag = 2;
        }
        if ($scope.data.currItem.create_time == 2) {
            time_flag = 3;
        }
        if ($scope.data.currItem.deliver_date == 2) {
            time_flag = 4;
        }

        var postdata = {
            flag: 8,
            erp_code: $scope.data.currItem.erp_code || "",
            org_id: $scope.data.currItem.org_id || "",
            start_date: $scope.data.currItem.start_date || "",
            end_date: $scope.data.currItem.end_date || "",
            time_flag: time_flag || "",
        };
        BasemanService.RequestPost("sale_list", "search", postdata)
            .then(function (data) {
                $scope.options_11.api.setRowData(data.sale_lists);
            });
    }
    //清空
    $scope.clear = function () {
        $scope.options_11.api.setRowData();
        $scope.options_12.api.setRowData();
    }
    //显示隐藏列
    $scope.x1 = function () {
        if ($scope.data.currItem.x1 == 2) {
            $scope.options_12.columnApi.hideColumns(["zone_name"])
        } else {
            $scope.options_12.columnApi.setColumnsVisible(["zone_name"])
        }
    };
    $scope.x2 = function () {
        if ($scope.data.currItem.x2 == 2) {
            $scope.options_12.columnApi.hideColumns(["org_name"])
        } else {
            $scope.options_12.columnApi.setColumnsVisible(["org_name"])
        }
    };
    $scope.x3 = function () {
        if ($scope.data.currItem.x3 == 2) {
            $scope.options_12.columnApi.hideColumns(["cust_code"])
        } else {
            $scope.options_12.columnApi.setColumnsVisible(["cust_code"])
        }
    };
    $scope.x4 = function () {
        if ($scope.data.currItem.x4 == 2) {
            $scope.options_12.columnApi.hideColumns(["erp_code"])
        } else {
            $scope.options_12.columnApi.setColumnsVisible(["erp_code"])
        }
    };
    $scope.x5 = function () {
        if ($scope.data.currItem.x5 == 2) {
            $scope.options_12.columnApi.hideColumns(["sale_ent_type"]);
            var model = [{colId: "sale_ent_type", sort: "desc"}]//asc desc
            $scope.options_12.api.setSortModel(model)
        } else {
            $scope.options_12.columnApi.setColumnsVisible(["sale_ent_type"])
        }
    };
    //汇总
    $scope.sum_line = function (arr, column, datas) {
        $scope.gridSetData("options_12", "");
        $scope.sumcontainer = [];
        var arr = [], column = [];
        var data = $scope.gridGetData("options_11");
        if ($scope.data.currItem.x1 == 2) {//大区
            arr.push("zone_name");
        }
        if ($scope.data.currItem.x2 == 2) {//部门
            arr.push("org_name");
        }
        if ($scope.data.currItem.x3 == 2) {//客户
            arr.push("cust_code");
        }
        if ($scope.data.currItem.x4 == 2) {//erp_code
            arr.push("erp_code");
        }
        if ($scope.data.currItem.x5 == 2) {//
            arr.push("sale_ent_type");
        }
        column[0] = "require_qty";
        var sumcontainer = HczyCommon.Summary(arr, column, data);

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
        total.org_code = "合计";
        sumcontainer.push(total);
        $scope.options_12.api.setRowData(sumcontainer);
        // $scope.num2();
    };
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
    $scope.columns_11 = [
        {
            headerName: "大区", field: "zone_name", editable: false, filter: 'set', width: 90,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "部门", field: "org_name", editable: false, filter: 'set', width: 90,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "商检批号", field: "inspection_batchno", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "订单号", field: "pi_no", editable: false, filter: 'set', width: 100,
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
            headerName: "套数", field: "require_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "下单时间", field: "prod_time", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "入库时间", field: "deliver_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "审核时间", field: "check_time", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "工厂型号", field: "item_h_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "行类型", field: "line_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: '整机'}, {value: 2, desc: '内机'}, {value: 3, desc: '外机'},
                    {value: 4, desc: '配件'}, {value: 5, desc: '样机'}, {value: 5, desc: 'SKD'},
                    {value: 6, desc: 'CKD'}, {value: 7, desc: '支架或木托'}, {value: 8, desc: '促销品'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "生产通知单号", field: "prod_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "工厂交期回复", field: "pre_over_time", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户型号", field: "cust_item_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: '内机',
            children: [
                {
                    headerName: "内机ERP编码", field: "erp_code", editable: false, filter: 'set', width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "内机客户型号", field: "nj_item_name", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "内机数量", field: "prod_qty", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "内机全新生产数量", field: "new_qty", editable: false, filter: 'set', width: 110,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "内机返包数量", field: "redo_qty", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }]
        }, {
            headerName: '外机',
            children: [
                {
                    headerName: "外机ERP编码", field: "erp_code1", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "外机客户型号", field: "wj_item_name", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "外机数量", field: "amt1", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "外机全新生产数量", field: "amt2", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "外机返包数量", field: "amt3", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "压缩机型号", field: "comp_name1", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "压缩机数量", field: "comp_qty1", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }]
        }, {
            headerName: "返包信息", field: "redo_note", editable: false, filter: 'set', width: 220,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "BOM编制完成时间", field: "pdm_bom_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "BOM编制状态", field: "pdm_bom_stat", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: '未编制'}, {value: 3, desc: '已启动'}, {value: 5, desc: '已归档'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "贸易类型", field: "sale_ent_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: '进出口贸易'}, {value: 2, desc: '香港转口贸易'}, {value: 3, desc: '香港直营'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "有数量变更", field: "note", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否裸单", field: "is_item_order", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: '否'}, {value: 2, desc: '是'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "BOM是否补齐", field: "complete_bom", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: '否'}, {value: 2, desc: '是'}]
            },
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
    $scope.columns_12 = [{
        headerName: "大区", field: "zone_name", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "部门", field: "org_name", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "客户", field: "cust_code", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "商检批号", field: "erp_code", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "贸易类型", field: "sale_ent_type", editable: false, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '进出口贸易'}, {value: 2, desc: '香港转口贸易'}, {value: 3, desc: '香港直营'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "订单号", field: "pi_no", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "套数", field: "require_qty", editable: false, filter: 'set', width: 100,
        cellEditor: "浮点框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "下单时间", field: "prod_time", editable: false, filter: 'set', width: 150,
        cellEditor: "年月日",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "入库时间", field: "deliver_date", editable: false, filter: 'set', width: 150,
        cellEditor: "年月日",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "审核时间", field: "check_time", editable: false, filter: 'set', width: 150,
        cellEditor: "年月日",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "商标", field: "brand_name", editable: false, filter: 'set', width: 150,
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
basemanControllers
    .controller('sale_price_list_search_fhw', sale_price_list_search_fhw);
