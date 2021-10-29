var salemanControllers = angular.module('inspinia');
function sale_months_inv_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_months_inv_headerEdit = HczyCommon.extend(sale_months_inv_headerEdit, ctrl_bill_public);
    sale_months_inv_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_months_inv_header",
        key: "months_inv_id",
        wftempid: 10161,
        FrmInfo: {},
        grids: [
            {optionname: 'options_11', idname: 'sale_months_inv_launchofsale_months_inv_header'},
            {optionname: 'options_21', idname: 'sale_months_inv_lineofsale_months_inv_header'},
        ]
    };
    /******************页面隐藏****************************/
    $scope.show_11 = true;
    $scope.show11 = function () {
        $scope.show_11 = !$scope.show_11;
    };
    //查询
    $scope.search = function () {
        $scope.FrmInfo = {
            classid: "sale_months_inv_header",
            postdata: {},
            backdatas: "sale_months_inv_header",
        };
        BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
            HczyCommon.stringPropToNum(result);
            for (name in result) {
                $scope.data.currItem[name] = result[name];
            }
        })
    };
    //明细业务员
    $scope.sales_user_id = function () {
        if ($scope.data.currItem.sale_months_inv_launchofsale_months_inv_header[$scope.options_11.api.getFocusedCell().rowIndex].org_id == undefined || $scope.data.currItem.sale_months_inv_launchofsale_months_inv_header[$scope.options_11.api.getFocusedCell().rowIndex].org_id == "") {
            BasemanService.notice("请选择部门！", "alter-warning")
            return;
        }
        $scope.FrmInfo = {
            classid: "scpuser",
            postdata: {
                flag: 13
            },
            backdatas: "users",
        };
        $scope.FrmInfo.sqlBlock = 'scporguser.orgid =' + $scope.data.currItem.sale_months_inv_launchofsale_months_inv_header[$scope.options_11.api.getFocusedCell().rowIndex].org_id;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var data = [];
            var index = $scope.options_11.api.getFocusedCell().rowIndex;
            var node = $scope.options_11.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            data[index].userid = result.userid;
            $scope.options_11.api.setRowData(data);
            $scope.data.currItem.sale_months_inv_launchofsale_months_inv_header = data;

        });
    };
    //选择年月份清除明细
    $scope.YearClear=function(){
        $scope.gridSetData("options_11", []);
        $scope.gridSetData("options_21", []);
    };
    $scope.MonthClear=function(){
        $scope.gridSetData("options_11", []);
        $scope.gridSetData("options_21", []);
    };
    /*************************网格事件处理**************************/
    $scope.calc = function () {
        if ($scope.data.currItem.months_inv_id == "" || $scope.data.currItem.months_inv_id == undefined) {
            BasemanService.notice("请先保存单据！", "alter-warning")
            return;
        }
        var postdata = {};
        postdata.months_inv_id = $scope.data.currItem.months_inv_id;
        postdata.months_inv_no = $scope.data.currItem.months_inv_no;
        BasemanService.RequestPost("sale_months_inv_header", "calc", postdata)
            .then(function (data) {
                BasemanService.notice("计算成功", "alert-info");
                $scope.refresh(2);
            })
    };
    /******************词汇值****************************/
    $scope.launch_months = [
        {id: 1, name: "1月"}, {id: 2, name: "2月"}, {id: 3, name: "3月"}, {id: 4, name: "4月"}, {id: 5, name: "5月"}, {
            id: 6,
            name: "6月"
        },
        {id: 7, name: "7月"}, {id: 8, name: "8月"}, {id: 9, name: "9月"}, {id: 10, name: "10月"}, {
            id: 11,
            name: "11月"
        }, {id: 12, name: "12月"},
    ];
    /****************************网格下拉***************************/
    //订单
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "sale_order_type"})
        .then(function (data) {
            var sale_order_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                sale_order_types[i] = {value: data.dicts[i].dictvalue, desc: data.dicts[i].dictname}
            }
            if ($scope.getIndexByField('columns_21', 'order_type')) {
                $scope.columns_21[$scope.getIndexByField('columns_21', 'order_type')].cellEditorParams.values = sale_order_types;
            }
        });
    //订单
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "line_type"})
        .then(function (data) {
            var line_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                line_types[i] = {value: data.dicts[i].dictvalue, desc: data.dicts[i].dictname}
            }
            if ($scope.getIndexByField('columns_21', 'line_type')) {
                $scope.columns_21[$scope.getIndexByField('columns_21', 'line_type')].cellEditorParams.values = line_types;
            }
        });
    /******************网格定义区域****************************/
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
    //明细
    $scope.columns_11 = [
        {
            headerName: "部门名称", field: "org_name", editable: true, filter: 'set', width: 180,
            cellEditor: "弹出框",
            action: $scope.org_name,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务员", field: "userid", editable: true, filter: 'set', width: 180,
            cellEditor: "弹出框",
            action: $scope.sales_user_id,
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
    $scope.columns_21 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 85,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产单", field: "prod_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单", field: "order_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单类型", field: "order_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "MRP控制者", field: "mrp_ctrl", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "预计发货日期", field: "pre_ship_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "部门", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户代码", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "弹出框",
            action: $scope.cust_code,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "行类型", field: "line_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 100,
            cellEditor: "弹出框",
            action: $scope.item_h_code11,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "库存", field: "inv_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发货日期", field: "ship_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "验货日期", field: "inspect_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发货数量", field: "ship_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发货节点", field: "ship_note", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "公司处理数量", field: "company_qty", editable: false, filter: 'set', width: 130,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },

        {
            headerName: "待定数量", field: "wait_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "线检日期", field: "line_inspect_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: " note", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    $scope.options_21 = {
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
            var isGrouping = $scope.options_21.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    /***************************提交*********************************/
    $scope.wfstart_validDate = function () {
        var data = $scope.gridGetData('options_21');
        if(data.length==0||data.length==undefined){
            BasemanService.notice("明细不能为空,请先'计算'", "alert-warning");
            return false;
        }
        var data2=$scope.gridGetData('options_11');
        for(var i=0;i<data2.length;i++){
            var msg = [];
            var seq = i + 1;
            if (data2[i].userid == undefined||data2[i].userid == "") {
                msg.push("第" + seq + "行业务员不能为空");
            }
            if (msg.length > 0) {
                BasemanService.notice(msg);
                return false;
            }
        }
        return true;
    };
    $scope.save_before=function(){
        $scope.data.currItem.sale_months_inv_launchofsale_months_inv_header=$scope.gridGetData('options_11');
        $scope.data.currItem.sale_months_inv_lineofsale_months_inv_header=$scope.gridGetData('options_21');
    };
    /******************界面初始化****************************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            stat: 1,
            cust_id: 0

        };
        var date = new Date;
        $scope.data.currItem.inv_year = date.getFullYear();
        var month = date.getMonth() + 1;
        $scope.data.currItem.inv_month = (month < 10 ? "0" + month : month);
    };

    $scope.initdata();

}

//加载控制器
salemanControllers
    .controller('sale_months_inv_headerEdit', sale_months_inv_headerEdit);
