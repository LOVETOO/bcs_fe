var billmanControllers = angular.module('inspinia');
function po_org_budgetEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService, notify) {
    //继承基类方法
    po_org_budgetEdit = HczyCommon.extend(po_org_budgetEdit, ctrl_bill_public);
    po_org_budgetEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "po_org_budget",
        key: "budget_id",
        //    wftempid:10150,
        FrmInfo: {},
        grids: [{optionname: 'options_10', idname: 'po_org_budget_lineofpo_org_budgets'}]
    };

    /************************初始化页面***********************/
    var myDate = new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: myDate.toLocaleDateString()
        };
    };
    /**---------------------初始化页面----------------------*/
    /***********************保存校验区域*********************/
    $scope.validate = function () {
        var errorlist = [];
        $scope.data.currItem.org_code == undefined ? errorlist.push("部门编码为空") : 0;
        $scope.data.currItem.cyear == undefined ? errorlist.push("年度为空") : 0;
        $scope.data.currItem.amount == undefined ? errorlist.push("预算金额为空") : 0;

        if (errorlist.length) {
            BasemanService.notify(notify, errorlist, "alert-danger");
            return false;
        }
        return true;
    }

    /**----------------------保存校验区域-------------------*/
    $scope.refresh_after = function () {

    }
    /*---------------------刷新------------------------------*/
    /**********************弹出框值查询**************************/
    $scope.selectorg = function () {
        $scope.FrmInfo = {

            postdata: {},
            classid: "scporg",
            backdatas: "orgs",
            sqlBlock: "stat =2 and orgtype = 5",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = result.orgid;
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;

        });
    }
    //网格区域定义
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
    $scope.columns_10 = [{
            headerName: "月份", field: "cmonth", editable: false, filter: 'set', width: 90,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "预算金额", field: "amount", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "已使用金额", field: "used_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "已预占金额", field: "keeped_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "可使用金额", field: "canuse_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_10 = {
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
            var isGrouping = $scope.options_10.columnApi.getRowGroupColumns().length > 0;
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
}
//加载控制器
billmanControllers
    .controller('po_org_budgetEdit', po_org_budgetEdit)
