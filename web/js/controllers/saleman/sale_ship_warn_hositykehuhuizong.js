var basemanControllers = angular.module('inspinia');
function sale_ship_warn_hositykehuhuizong($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_ship_warn_hositykehuhuizong = HczyCommon.extend(sale_ship_warn_hositykehuhuizong, ctrl_bill_public);
    sale_ship_warn_hositykehuhuizong.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "customer_visit_record",
        /* key: "out_id",*/
        //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'customer_receive_headers'}]
    };
    //下拉
    $scope.record_types = [
        {
        id: 1,
        name: "客户来访",
    }, {
        id: 2,
        name: "拜访记录",
    }, {
        id: 3,
        name: "会谈记录",
    }, {
        id: 4,
        name: "不良记录",
    }]
    //查询
    $scope.search = function () {
        var sqlBlock = "1=1";
        if ($scope.data.currItem.record_no!= ""&&$scope.data.currItem.record_no!=undefined) {
            sqlBlock += " and v.record_no like '%" + $scope.data.currItem.record_no + "%' ";
        }
        if ($scope.data.currItem.org_code!= ""&&$scope.data.currItem.org_code!=undefined) {
            sqlBlock += " and v.org_code=" + $scope.data.currItem.org_code;
        }
        if ($scope.data.currItem.cust_code!= ""&&$scope.data.currItem.cust_code!=undefined) {
            sqlBlock += " and v.cust_code=" + $scope.data.currItem.cust_code;
        }
        if ($scope.data.currItem.record_date!= ""&&$scope.data.currItem.record_date!=undefined) {
            sqlBlock +=  " and to_char(v.Record_Date,'yyyy-mm-dd') = '"  + $scope.data.currItem.record_date+"'";
        }
        if ($scope.data.currItem.record_type!= ""&&$scope.data.currItem.record_type!=undefined) {
            sqlBlock += " and v.record_type=" + $scope.data.currItem.record_type;
        }
        var postdata = {
            sqlwhere: sqlBlock,
            wfflag:1
     };
        BasemanService.RequestPost("customer_visit_record", "search", postdata)
            .then(function (data) {
                console.log(data);
                $scope.data.currItem.customer_visit_records = data.customer_visit_records;
                $scope.options_13.api.setRowData(data.customer_visit_records);
            });
    };
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
    };
    $scope.select2 = function () {
        if ($scope.data.currItem.org_code == undefined || $scope.data.currItem.org_code == "") {
            BasemanService.notice("请先选业务部门", "alert-warning");
            return;
        }

        $scope.FrmInfo = {
            title: "客户",
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
            $scope.data.currItem.cust_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_id = result.cust_id;
        });

    };
    /************************网格定义区域**************************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            var stats = [];
            for (var i = 0; i < data.dicts.length; i++) {
                stats[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_13', 'stat')) {
                $scope.columns_13[$scope.getIndexByField('columns_13', 'stat')].cellEditorParams.values = stats;
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
        cellRendererParams: {
            checkbox: true
        }
    };
    $scope.columns_13 = [
        {
            headerName: "单号", field: "record_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "部门编码", field: "org_code", editable: false, filter: 'set', width: 85,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "部门名称", field: "org_name", editable: false, filter: 'set', width: 100,
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
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        , {
            headerName: "状态", field: "stat", editable: false, filter: 'set', width: 85,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        , {
            headerName: "访谈类型", field: "record_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: '客户来访'}, {value: 2, desc: '拜访记录'}, {value: 3, desc: '会谈记录'}, {value: 3, desc: '不良记录'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        , {
            headerName: "访谈日期", field: "record_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "参会人员", field: "record_user", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "议题", field: "record_msg", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "会议内容", field: "record_note", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "附件名称", field: "docname", editable: false, filter: 'set', width: 150,
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
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('sale_ship_warn_hositykehuhuizong', sale_ship_warn_hositykehuhuizong);
