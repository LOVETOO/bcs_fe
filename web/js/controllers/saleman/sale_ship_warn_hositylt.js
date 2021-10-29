var basemanControllers = angular.module('inspinia');
function sale_ship_warn_hositylt($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_ship_warn_hositylt = HczyCommon.extend(sale_ship_warn_hositylt, ctrl_bill_public);
    sale_ship_warn_hositylt.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_ship_warn_header",
        /* key: "out_id",*/
        //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_ship_warn_headers'}]
    };
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            k1: 2,
        };
    };
    //查询条件清除
    $scope.clear_org = function () {
        $scope.data.currItem.org_id = "",
            $scope.data.currItem.org_id = "",
            $scope.data.currItem.org_name = ""
    }
    $scope.clear_cust = function () {
        $scope.data.currItem.cust_id = "",
            $scope.data.currItem.cust_id = "",
            $scope.data.currItem.cust_name = ""
    }
//查询
    $scope.search = function () {
		console.log("--"+$scope.data.currItem.k1+$scope.data.currItem.k2+$scope.data.currItem.k3)
        var postdata = {
            flag: 16,
            org_id: $scope.data.currItem.org_id,
            warn_no: $scope.data.currItem.warn_no,
            cust_id: $scope.data.currItem.cust_id,
            create_time: $scope.data.currItem.startdate,
            update_time: $scope.data.currItem.enddate
        };
        if ($scope.data.currItem.k1 != 1 && $scope.data.currItem.k2 != 2 && $scope.data.currItem.k3 != 3) {
            BasemanService.notice("请选择用什么日期查询", "alert-warning");
            return;
        }
        else {
            if ($scope.data.currItem.k1 == 1) {
                postdata.stat = 1
            }
            if ($scope.data.currItem.k2 == 2) {
                postdata.stat = 2
            }
            if ($scope.data.currItem.k3 == 3) {
                postdata.stat = 3
            }
        }
        BasemanService.RequestPost("sale_ship_warn_header", "search", postdata)
            .then(function (data) {
                $scope.data.currItem.sale_ship_warn_headers = data.sale_ship_warn_headers;
                $scope.options_13.api.setRowData(data.sale_ship_warn_headers);
            });
    }

    //清空
    $scope.clear = function () {
        $scope.options_13.api.setRowData();

    }
    /***************************弹出框***********************/
    $scope.select = function () {
        $scope.FrmInfo = {

            classid: "scporg",
            postdata: {},
            sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",
            backdatas: "orgs",

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = result.orgid;
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname
        });
    }

    $scope.select2 = function () {
		var fag="org_id=" + $scope.data.currItem.org_id;
        if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
            fag="";
        }
        $scope.FrmInfo = {

            classid: "customer",
            postdata: {},
            sqlBlock: fag,
            backdatas: "customers"

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_name = result.cust_name;

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
    $scope.columns_13 = [{
        headerName: "出货预告号", field: "warn_no", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "合同号", field: "pi_no", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        //cellchange:$scope.bankBalance,
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
        headerName: "业务部门", field: "org_name", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "单据状态", field: "stat", editable: false, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '制单'}, {value: 2, desc: '提交'}, {value: 3, desc: '启动'}, {value: 4, desc: '驳回'},
                {value: 5, desc: '审核'}, {value: 10, desc: '红冲'}, {value: 99, desc: '关闭'},]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "驳回人", field: "creator", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "执行时间", field: "create_time", editable: false, filter: 'set', width: 150,
        cellEditor: "年月日",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "执行意见", field: "cust_desc", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "驳回次数", field: "qty", editable: false, filter: 'set', width: 150,
        cellEditor: "浮点框",

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
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('sale_ship_warn_hositylt', sale_ship_warn_hositylt);
