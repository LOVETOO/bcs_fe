var basemanControllers = angular.module('inspinia');
function po_cust_credit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    po_cust_credit = HczyCommon.extend(po_cust_credit, ctrl_bill_public);
    po_cust_credit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "po_cust_credit",
        key: "pcc_id",
        FrmInfo: {},
        grids: [{optionname: 'options_27', idname: 'po_cust_credits'}]
    };
    $scope.setusable = function (e) {
        if(userbean.stringofrole.indexOf("财务")>-1) {
            e.colDef.editable = true;
        }
    }
    //查询
    $scope.select = function () {
        $scope.gridSetData("options_27","");
        // var sqlBlock = BasemanService.getSqlWhereBlock(sqlBlock);
        var postdata = {
            // sqlwhere: sqlBlock,
            cust_code: $scope.data.currItem.cust_code||"",
            source_bill_date1:$scope.data.currItem.source_bill_date1,
            source_bill_date2:$scope.data.currItem.source_bill_date2,
            k1:$scope.data.currItem.k1,
            k2:$scope.data.currItem.k2,
        };
        BasemanService.RequestPost("po_cust_credit", "search", postdata)
            .then(function (data) {
                $scope.gridSetData("options_27", data.po_cust_credits);
            });
    }
    //保存
    $scope.save = function () {
        var datas = $scope.gridGetData("options_27");
        var postdata={};
        postdata.po_cust_credits=datas
        BasemanService.RequestPost("po_cust_credit", "update",postdata)
            .then(function (data) {

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
    $scope.columns_27 = [{
        headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    },{
        headerName: "客户", field: "cust_code", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "来源类型", field: "source_bill_type", editable: false, filter: 'set', width: 120,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '发货计提'}, {value: 2, desc: '发货单作废'}, {value: 3, desc: '费用发票'},
                {value: 4, desc: '采购申请'}, {value: 5, desc: '外购件发货'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "来源单号", field: "source_bill_no", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "单据日期", field: "source_bill_date", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "计提金额", field: "amount", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "累计已使用", field: "used_amt", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "未使用金额", field: "act_amt", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "是否可用", field: "usable", editable: false, filter: 'set', width: 90,
        cellEditor: "复选框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "备注", field: "note", editable: false, filter: 'set', width: 250,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }];
    $scope.refresh_after=function () {

    }
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
        rowClicked:$scope.setusable,
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
    $scope.initdata();
}
//加载控制器
basemanControllers
    .controller('po_cust_credit', po_cust_credit);
