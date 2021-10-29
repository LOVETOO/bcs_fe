var basemanControllers = angular.module('inspinia');
function sale_package_header_ordersearch($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_package_header_ordersearch = HczyCommon.extend(sale_package_header_ordersearch, ctrl_bill_public);
    sale_package_header_ordersearch.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_package_header",
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_package_headers'},
            {optionname: 'options_12', idname: 'sale_package_headers'}]
    };

    /******************页面隐藏****************************/
    $scope.show_12 = false;
    $scope.show12 = function () {
        $scope.show_12 = !$scope.show_12;
    };
    $scope.show_13 = true;
    $scope.show13 = function () {
        $scope.show_13 = !$scope.show_13;
    };


    //查询
    $scope.search = function () {
        var strSql=" 1=1 ";
        var items=$scope.gridGetData("options_12");
        var str="'0'";
        for(var i=0;i<items.length;i++){
            if(items[i].pc_no!=undefined&&items[i].pc_no.length>0){
                str += ",'"+items[i].pc_no+"'";
            }
        }
        if(str!="'0'"){
            strSql=" pc_no in ("+str+")";
        }else{
            strSql=" 1=1 "
        }

        if($scope.data.currItem.pc_no!=undefined&&$scope.data.currItem.pc_no!=""){
            strSql += " and pc_no like '%" +$scope.data.currItem.pc_no+ "%'"
        }

        var date1 = $scope.data.currItem.start_date;
        var date2 = $scope.data.currItem.end_date;
        var sqlBlock = "";
        if (date1 > date2) {
            BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
        }
        var postdata = {
            flag: 88,
            org_id: $scope.data.currItem.org_id,
            cust_id: $scope.data.currItem.cust_id,
            cust_code: $scope.data.currItem.cust_code,
            cust_name: $scope.data.currItem.cust_name,
            org_code: $scope.data.currItem.org_code,
            org_name: $scope.data.currItem.org_name,
            start_date: $scope.data.currItem.start_date,
            end_date: $scope.data.currItem.end_date,
            org_id: $scope.data.currItem.org_id,
            sqlwhere: strSql,
        };
        var data = $scope.data.currItem.sale_package_headers;
        BasemanService.RequestPost("sale_package_header", "search", postdata)
            .then(function (data) {
                $scope.data.currItem.sale_package_headers = data.sale_package_headers;
                $scope.options_13.api.setRowData(data.sale_package_headers);
            });
    } 
    /***************************弹出框***********************/
    //业务部门
    $scope.changeAreaName = function () {

        $scope.data.currItem.org_name = "";
        $scope.data.currItem.org_id = "";
    };
    //客户
    $scope.change_customer = function () {

        $scope.data.currItem.cust_name = "";
        $scope.data.currItem.cust_id = "";
    };
    $scope.selectorg = function () {
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
    $scope.selectcust = function () {
        if ($scope.data.currItem.org_code == undefined || $scope.data.currItem.org_code == "") {
            BasemanService.notice("请先选业务部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            title: "客户编码 ",
            thead: [
                {
                    name: "客户编码",
                    code: "cust_code",
                    show: true,
                    iscond: true,
                    type: 'string'

                }, {
                    name: "SAP编码",
                    code: "sap_code",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户名称",
                    code: "cust_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户描述",
                    code: "cust_desc",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            is_custom_search: true,
            is_high: true,
            classid: "customer",
            sqlBlock: "org_id = " + $scope.data.currItem.org_id
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_id = result.cust_id;
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
    $scope.columns_13 = [
        {
            headerName: "PI号", field: "pinoer", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            checkboxSelection: function (params) {
                return params.columnApi.getRowGroupColumns().length === 0;
            },

        }, {
            headerName: "商检批号", field: "pc_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "PI开始时间", field: "pi_startime", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "PI结束时间", field: "pi_endtime", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "生产通知单开始日期", field: "sc_statime", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "生产通知单结束日期", field: "sc_endtime", editable: false, filter: 'set', width: 150,
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
    $scope.columns_12 = [
        {
            headerName: "批次号", field: "pc_no", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
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
    //数据缓存
    $scope.initdata();
    $timeout(
        function () {
            for(var i=0;i<5;i++){
                $scope.gridAddItem("options_12");
            }
        },10
    )
}

//加载控制器
basemanControllers
    .controller('sale_package_header_ordersearch', sale_package_header_ordersearch);
