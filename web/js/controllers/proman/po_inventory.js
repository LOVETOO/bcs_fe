var basemanControllers = angular.module('inspinia');
function po_inventory($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    po_inventory = HczyCommon.extend(po_inventory, ctrl_bill_public);
    po_inventory.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_list",
        /*        key: "out_id",*/
        //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_11', idname: 'sale_lists'},
            // {optionname: 'options_12', idname: 'sale_listshz'}
        ]
    };
    $scope.clearinformation = function () {
        $scope.data.currItem.x1 = 2;
        $scope.data.currItem.x2 = 2;
        $scope.data.currItem.x3 = 2;
        $scope.data.currItem.x4 = 2;
    };
    //////////////////////////////////弹出框查询////////////////////////////////////////////////////////
    $scope.selectwh = function () {
        $scope.FrmInfo = {
            classid: "po_warehouse",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.wh_code = result.wh_code;
            $scope.data.currItem.wh_name = result.wh_name;
            $scope.data.currItem.wh_id = result.wh_id;

        });
    }
    $scope.selectitem = function () {
        $scope.FrmInfo = {
            classid: "po_item",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.po_item_code = result.po_item_code;
            $scope.data.currItem.po_item_name = result.po_item_name;
            $scope.data.currItem.po_item_id = result.po_item_id;

        });
    }
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
    $scope.selectcust = function () {
        $scope.FrmInfo = {
            classid: "customer",
            sqlBlock: "org_id = " + $scope.data.currItem.org_id
        };
        if($scope.data.currItem.org_code == undefined || $scope.data.currItem.org_code == ""){
            $scope.FrmInfo.sqlBlock="1=1";
        }
        else{ $scope.FrmInfo.sqlBlock="org_id ="+ $scope.data.currItem.org_id;}
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_id = result.cust_id;
        });

    };
    $scope.clearorg = function () {
        $scope.data.currItem.org_code = "";
        $scope.data.currItem.org_name = ""
        $scope.data.currItem.org_id = "";
    }
    $scope.clearwh = function () {
        $scope.data.currItem.wh_code = "";
        $scope.data.currItem.wh_id = ""
        $scope.data.currItem.wh_name= "";
    }
    $scope.clearitem = function () {
        $scope.data.currItem.po_item_code = "";
        $scope.data.currItem.po_item_name = ""
        $scope.data.currItem.po_item_id = "";
    }
    $scope.clearcust = function () {
        $scope.data.currItem.cust_code = "";
        $scope.data.currItem.cust_name = ""
        $scope.data.currItem.cust_id = "";
    }
    //查询
    $scope.search = function () {
        var flag=0;
        if($scope.data.currItem.k1==2){
            flag=2;
        }
        var postdata = {
             flag: flag,
            wh_code: $scope.data.currItem.wh_code || "",
            org_code: $scope.data.currItem.org_code || "",
            cust_code: $scope.data.currItem.cust_code || "",
            po_item_code: $scope.data.currItem.po_item_code || "",
        };
        BasemanService.RequestPost("po_inventory", "search", postdata)
            .then(function (data) {
                // for(var i=0;i<data.po_inventorys.length;i++){
                //     data.po_inventorys[i].amount=data.po_inventorys[i].price*data.po_inventorys[i].qty;
                // }
                $scope.options_11.api.setRowData(data.po_inventorys);
            });
    }

    //显示隐藏列
    // $scope.x1 = function () {
    //     if ($scope.data.currItem.x1 == 2) {
    //         $scope.options_12.columnApi.hideColumns(["wh_code"])
    //     } else {
    //         $scope.options_12.columnApi.setColumnsVisible(["wh_code"])
    //     }
    // };
    // $scope.x2 = function () {
    //     if ($scope.data.currItem.x2 == 2) {
    //         $scope.options_12.columnApi.hideColumns(["org_name"])
    //     } else {
    //         $scope.options_12.columnApi.setColumnsVisible(["org_name"])
    //     }
    // };
    // $scope.x3 = function () {
    //     if ($scope.data.currItem.x3 == 2) {
    //         $scope.options_12.columnApi.hideColumns(["cust_code"])
    //     } else {
    //         $scope.options_12.columnApi.setColumnsVisible(["cust_code"])
    //     }
    // };
    // $scope.x4 = function () {
    //     if ($scope.data.currItem.x4 == 2) {
    //         $scope.options_12.columnApi.hideColumns(["po_item_code"])
    //     } else {
    //         $scope.options_12.columnApi.setColumnsVisible(["po_item_code"])
    //     }
    // };
    //汇总
    // $scope.groupby = function (arr, column, datas) {
    //     $scope.gridSetData("options_12", "");
    //     $scope.sumcontainer = [];
    //     var arr = [], column = [];
    //     var data = $scope.gridGetData("options_11");
    //     if ($scope.data.currItem.x1 == 2) {//仓库
    //         arr.push("wh_code");
    //     }
    //     if ($scope.data.currItem.x2 == 2) {//部门
    //         arr.push("org_name");
    //     }
    //     if ($scope.data.currItem.x3 == 2) {//客户
    //         arr.push("cust_code");
    //     }
    //     if ($scope.data.currItem.x4 == 2) {//物料
    //         arr.push("po_item_code");
    //     }
    //     column[0] = "qty";
    //     var sumcontainer = HczyCommon.Summary(arr, column, data);
    //
    //     //汇总最后一行
    //     var total = {};
    //     for (var j = 0; j < column.length; j++) {
    //         var arr = column[j];
    //         total[arr] = 0;
    //     }
    //     for (var i = 0; i < sumcontainer.length; i++) {
    //         for (var j = 0; j < column.length; j++) {
    //             var arr = column[j];
    //             if (sumcontainer[i][arr] != undefined) {
    //                 total[arr] += parseFloat(sumcontainer[i][arr]);
    //             }
    //         }
    //     }
    //     for (var j = 0; j < column.length; j++) {
    //         var arr = column[j];
    //         total[arr] = parseFloat(total[arr]).toFixed(2);
    //     }
    //     total.org_code = "合计";
    //     sumcontainer.push(total);
    //     $scope.options_12.api.setRowData(sumcontainer);
    //     // $scope.num2();
    // };
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
            headerName: "仓库", field: "wh_code", editable: false, filter: 'set', width: 90,
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
            headerName: "客户", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "物料编码", field: "po_item_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "物料名称", field: "po_item_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "库存数量", field: "qty", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "价格", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "金额", field: "amount", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",

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
    // $scope.columns_12 = [{
    //     headerName: "仓库", field: "wh_code", editable: false, filter: 'set', width: 90,
    //     cellEditor: "文本框",
    //     //cellchange:$scope.bankBalance,
    //     enableRowGroup: true,
    //     enablePivot: true,
    //     enableValue: true,
    //     floatCell: true
    // }, {
    //     headerName: "部门", field: "org_name", editable: false, filter: 'set', width: 90,
    //     cellEditor: "文本框",
    //     //cellchange:$scope.bankBalance,
    //     enableRowGroup: true,
    //     enablePivot: true,
    //     enableValue: true,
    //     floatCell: true
    // }, {
    //     headerName: "客户", field: "cust_code", editable: false, filter: 'set', width: 100,
    //     cellEditor: "文本框",
    //     enableRowGroup: true,
    //     enablePivot: true,
    //     enableValue: true,
    //     floatCell: true
    // }, {
    //     headerName: "物料编码", field: "po_item_code", editable: false, filter: 'set', width: 100,
    //     cellEditor: "文本框",
    //
    //     enableRowGroup: true,
    //     enablePivot: true,
    //     enableValue: true,
    //     floatCell: true
    // }, {
    //     headerName: "库存数量", field: "qty", editable: false, filter: 'set', width: 150,
    //     cellEditor: "浮点框",
    //     //cellchange:$scope.bankBalance,
    //     enableRowGroup: true,
    //     enablePivot: true,
    //     enableValue: true,
    //     floatCell: true
    // }, {
    //     headerName: "金额", field: "sum", editable: false, filter: 'set', width: 150,
    //     cellEditor: "浮点框",
    //     //cellchange:$scope.bankBalance,
    //     enableRowGroup: true,
    //     enablePivot: true,
    //     enableValue: true,
    //     floatCell: true
    // }];
    // $scope.options_12 = {
    //     rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
    //     pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
    //     groupKeys: undefined,
    //     groupHideGroupColumns: false,
    //     enableColResize: true, //one of [true, false]
    //     enableSorting: true, //one of [true, false]
    //     enableFilter: true, //one of [true, false]
    //     enableStatusBar: false,
    //     enableRangeSelection: true,
    //     rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
    //     rowDeselection: false,
    //     quickFilterText: null,
    //     groupSelectsChildren: false, // one of [true, false]
    //     suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
    //     groupColumnDef: groupColumn,
    //     showToolPanel: false,
    //     checkboxSelection: function (params) {
    //         var isGrouping = $scope.options_12.columnApi.getRowGroupColumns().length > 0;
    //         return params.colIndex === 0 && !isGrouping;
    //     },
    //     icons: {
    //         columnRemoveFromGroup: '<i class="fa fa-remove"/>',
    //         filter: '<i class="fa fa-filter"/>',
    //         sortAscending: '<i class="fa fa-long-arrow-down"/>',
    //         sortDescending: '<i class="fa fa-long-arrow-up"/>',
    //     }
    // };
    $scope.initdata();
}
//加载控制器
basemanControllers
    .controller('po_inventory', po_inventory);
