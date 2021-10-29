var basemanControllers = angular.module('inspinia');
function sale_months_plan_list($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_months_plan_list = HczyCommon.extend(sale_months_plan_list, ctrl_bill_public);
    sale_months_plan_list.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_months_plan_list",
        key: "plan_id",
        //  wftempid:10008,
        FrmInfo: {},
        grids: [{optionname: 'options_27', idname: 'sale_months_plan_lineofsale_months_plan_headers'},
            {optionname: 'options_12', idname: 'sale_months_plan_lineofsum'}]
    };
    /**********************初始化**************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            launch_year: 2017,
            launch_month: "1",
        };
    };
    $scope.launch_months = [{dictvalue: 0, dictname: ""}, {dictvalue: 1, dictname: "1"}, {
        dictvalue: 2,
        dictname: "2"
    }, {dictvalue: 3, dictname: "3"},
        {dictvalue: 4, dictname: "4"}, {dictvalue: 5, dictname: "5"}, {dictvalue: 6, dictname: "6"}, {
            dictvalue: 7,
            dictname: "7"
        },
        {dictvalue: 8, dictname: "8"}, {dictvalue: 9, dictname: "9"}, {dictvalue: 10, dictname: "10"}, {
            dictvalue: 11,
            dictname: "11"
        },
        {dictvalue: 12, dictname: "12"}];
    /***************************弹出框***********************/
    $scope.selectarea = function () {
        $scope.FrmInfo = {
            type: "checkbox",
            backdatas: "orgs",
            classid: "scporg",
            sqlBlock: "stat =2 and orgtype in (3)"
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (items) {
            if (items.length == 0) {
                return
            }
            var ids = '', names = '', ids = [], codes = [];
            for (var i = 0; i < items.length; i++) {
                names += items[i].orgname + ',';
                ids += items[i].orgid + ',';
                codes += items[i].code + ',';
            }
            names = names.substring(0, names.length - 1);
            ids = ids.substring(0, ids.length - 1);
            codes = codes.substring(0, ids.length - 1);
            $scope.data.currItem.area_name = names;
            $scope.data.currItem.area_code = codes;
            $scope.data.currItem.area_id=ids;
        });
    }
    $scope.selectorg = function () {
        $scope.FrmInfo = {

            classid: "scporg",
            sqlBlock: "OrgType = 5",
            backdatas: "orgs",

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = result.orgid;
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;

        });
    }
    //搜索条件清空
    $scope.areaclear = function (){
        $scope.data.currItem.area_id="";
        $scope.data.currItem.area_name="";
    }
    $scope.orgclear = function (){
        $scope.data.currItem.org_id="";
        $scope.data.currItem.org_name="";
    }
    //查询
    $scope.getbillmsg = function () {
        if ($scope.data.currItem.launch_month == "" || $scope.data.currItem.launch_month == undefined) {
            BasemanService.notice("请输入正确的年月", "alert-warning");
            return;
        }
        if ($scope.data.currItem.launch_year == "" || $scope.data.currItem.launch_year == undefined) {
            BasemanService.notice("请输入正确的年月", "alert-warning");
            return;
        }
        var postdata = {
            flag: 2,
            launch_year: $scope.data.currItem.launch_year,
            launch_month: Number($scope.data.currItem.launch_month),
            org_code: $scope.data.currItem.area_id,
            org_id: $scope.data.currItem.org_id
        };
        BasemanService.RequestPost("sale_months_plan_header", "getitemlist", postdata)
            .then(function (data) {
                var m1, m2, m3, m4, m5, j, n;

                m1 = Number($scope.data.currItem.launch_month);

                $scope.columns_27[7].headerName = m1 + "月份下单预测";
                $scope.columns_27[8].children[0].headerName = m1 + "月";
                if (m1 >= 10) {
                    if (m1 == 10) {
                        $scope.columns_27[9].headerName = 11 + "月份下单预测";
                        $scope.columns_27[11].headerName = 12 + "月份下单预测";
                        $scope.columns_27[8].children[2].headerName = 11 + "月";
                        $scope.columns_27[8].children[4].headerName = 12 + "月";
                        $scope.columns_27[8].children[6].headerName = 1 + "月及以后";

                        $scope.columns_27[10].children[0].headerName = 11 + "月";
                        $scope.columns_27[10].children[2].headerName = 12 + "月";
                        $scope.columns_27[10].children[4].headerName = 1 + "月及以后";

                        $scope.columns_27[12].children[0].headerName = 12 + "月";
                        $scope.columns_27[12].children[2].headerName = 1 + "月及以后";
                    }
                    if (m1 == 11) {
                        $scope.columns_27[9].headerName = 12 + "月份下单预测";
                        $scope.columns_27[11].headerName = 1 + "月份下单预测";
                        $scope.columns_27[8].children[2].headerName = 12 + "月";
                        $scope.columns_27[8].children[4].headerName = 1 + "月";
                        $scope.columns_27[8].children[6].headerName = 2 + "月及以后";

                        $scope.columns_27[10].children[0].headerName = 12 + "月";
                        $scope.columns_27[10].children[2].headerName = 1 + "月";
                        $scope.columns_27[10].children[4].headerName = 2 + "月及以后";

                        $scope.columns_27[12].children[0].headerName = 1 + "月";
                        $scope.columns_27[12].children[2].headerName = 2 + "月及以后";
                    }

                    if (m1 == 12) {
                        $scope.columns_27[9].headerName = 1 + "月份下单预测";
                        $scope.columns_27[11].headerName = 2 + "月份下单预测";
                        $scope.columns_27[8].children[2].headerName = 1 + "月";
                        $scope.columns_27[8].children[4].headerName = 2 + "月";
                        $scope.columns_27[8].children[6].headerName = 3 + "月及以后";

                        $scope.columns_27[10].children[0].headerName = 1 + "月";
                        $scope.columns_27[10].children[2].headerName = 2 + "月";
                        $scope.columns_27[10].children[4].headerName = 3 + "月及以后";

                        $scope.columns_27[12].children[0].headerName = 2 + "月";
                        $scope.columns_27[12].children[2].headerName = 3 + "月及以后";
                    }
                }
                else {
                    $scope.columns_27[9].headerName = m1 + 1 + "月份下单预测";
                    $scope.columns_27[11].headerName = m1 + 2 + "月份下单预测";
                    $scope.columns_27[8].children[2].headerName = m1 + 1 + "月";
                    $scope.columns_27[8].children[4].headerName = m1 + 2 + "月";
                    $scope.columns_27[8].children[6].headerName = m1 + 3 + "月及以后";

                    $scope.columns_27[10].children[0].headerName = m1 + 1 + "月";
                    $scope.columns_27[10].children[2].headerName = m1 + 2 + "月";
                    $scope.columns_27[10].children[4].headerName = m1 + 3 + "月及以后";

                    $scope.columns_27[12].children[0].headerName = m1 + 2 + "月";
                    $scope.columns_27[12].children[2].headerName = m1 + 3 + "月及以后";
                }
                $scope.options_27.api.setColumnDefs($scope.columns_27);
                $scope.gridSetData("options_27", data.sale_months_plan_lineofsale_months_plan_headers);
            });
    }
    //汇总
    $scope.sum_line = function (arr,column,datas) {
        $scope.gridSetData("options_12", "");
        $scope.sumcontainer = [];
        var arr = [], column = [];
        var data = $scope.gridGetData("options_27");
        if ($scope.data.currItem.k3 == 2) {//大区
            arr.push("area_name");
        }
        if ($scope.data.currItem.k1 == 2) {//部门
            arr.push("org_name");
        }
        if ($scope.data.currItem.k2 == 2) {//客户
            arr.push("cust_code");
        }
        if ($scope.data.currItem.k4 == 2) {//整机
            arr.push("item_h_code");
        }

        column[0] = "o_xd_qty1";
        column[1] = "o_xd_qty2";
        column[2] = "o_xd_qty3";
        column[3] = "total_qty1";
        column[4] = "tw_xd_qty1";
        column[5] = "tw_xd_qty2";
        column[6] = "total_qty2";
        column[7] = "th_xd_qty1";
        var sumcontainer = HczyCommon.Summary(arr,column,data);

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
    $scope.columns_27 = [{
        headerName: "大区", field: "area_name", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "部门", field: "org_name", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 120,
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
        headerName: "机型类型", field: "line_type", editable: false, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '整机'}, {value: 2, desc: '内机'}, {value: 3, desc: '外机'},
                {value: 4, desc: '配件'}, {value: 5, desc: '样机'}, {value: 6, desc: 'SKD'},
                {value: 7, desc: 'CKD'}, {value: 8, desc: '支架或木托'}, {value: 9, desc: '促销品'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: '第一月下单',
        children: [
            {
                headerName: "上旬", field: "o_xd_qty1", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "中旬", field: "o_xd_qty2", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "下旬", field: "o_xd_qty3", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "合计", field: "total_qty1", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '排产数据(需生产)',
        children: [
            {
                headerName: "第一月", field: "o_prod_qty1", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发货月份", field: "o_ship_month1", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "第二月", field: "o_prod_qty2", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发货月份", field: "o_ship_month2", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "第三月", field: "o_prod_qty3", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发货月份", field: "o_ship_month3", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "第四月及以后", field: "o_prod_qty4", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发货月份", field: "o_ship_month4", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '第二月下单',
        children: [
            {
                headerName: "上旬", field: "tw_xd_qty1", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "下旬", field: "tw_xd_qty2", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "合计", field: "total_qty2", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '排产数据(需生产)',
        children: [
            {
                headerName: "第一月", field: "tw_prod_qty1", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发货月份", field: "tw_ship_month1", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "第二月", field: "tw_prod_qty2", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发货月份", field: "tw_ship_month2", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "第三月", field: "tw_prod_qty3", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发货月份", field: "tw_ship_month3", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '第三月下单',
        children: [
            {
                headerName: "下单", field: "th_xd_qty1", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '排产数据(需生产)',
        children: [
            {
                headerName: "第一月", field: "th_prod_qty1", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发货月份", field: "th_ship_month1", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "第二月", field: "th_prod_qty2", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发货月份", field: "th_ship_month2", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '压缩机',
        children: [
            {
                headerName: "型号", field: "comp_name", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "数量", field: "comp_qty", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "是否通用", field: "is_same", editable: false, filter: 'set', width: 160,
                cellEditor: "复选框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }];
    $scope.options_27 = {
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
            var isGrouping = $scope.options_27.columnApi.getRowGroupColumns().length > 0;
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
        headerName: "大区", field: "area_name", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "部门", field: "org_name", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: '第一月下单',
        children: [
            {
                headerName: "上旬", field: "o_xd_qty1", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "中旬", field: "o_xd_qty2", editable: false, filter: 'set', width: 170,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "下旬", field: "o_xd_qty3", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "合计", field: "total_qty1", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '第二月下单',
        children: [
            {
                headerName: "上旬", field: "tw_xd_qty1", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "下旬", field: "tw_xd_qty2", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "合计", field: "total_qty2", editable: false, filter: 'set', width: 160,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
    }, {
        headerName: '第三月下单',
        children: [
            {
                headerName: "下单", field: "th_xd_qty1", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }]
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
    .controller('sale_months_plan_list', sale_months_plan_list);
