var basemanControllers = angular.module('inspinia');
function sale_list_used($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_list_used = HczyCommon.extend(sale_list_used, ctrl_bill_public);
    sale_list_used.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_list",
        //key: "org_id",
        //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_lists'}]
    };


    //查询
    $scope.search = function () {
        var date1 = $scope.data.currItem.startdate;
        var date2 = $scope.data.currItem.enddate;
        var sqlBlock = "";
        if (date1 > date2) {
            BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
        }
        if($scope.data.currItem.startdate.substring(0,4)!=$scope.data.currItem.enddate.substring(0,4)){
            BasemanService.notice("查询时间只能是同一年!", "alert-warning");
            return;
        }
        sqlBlock = "";
        BasemanService.getSqlWhereBlock(sqlBlock);
        var postdata = {
            flag: 17,
            sqlwhere: sqlBlock,
            start_date: $scope.data.currItem.startdate,
            end_date: $scope.data.currItem.enddate

        };
        var data = $scope.data.currItem.sale_lists;
        BasemanService.RequestPost("sale_list", "search", postdata)
            .then(function (data) {
                console.log(data);
                $scope.data.currItem.sale_lists = data.sale_lists;
                $scope.options_13.api.setRowData(data.sale_lists);
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
            headerName: "数据分类", field: "info1", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "年份", field: "info2", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "单数", field: "amt1", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "总用时（天）", field: "amt2", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "平均用时（天）", field: "amt3", editable: false, filter: 'set', width: 150,
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

    //数据缓存
    $scope.initdata();

    $scope.clearinformation = function () {
        $scope.data.currItem.enddate = moment().format('YYYY-MM-DD HH:mm:ss');
        $scope.data.currItem.startdate = moment().format('YYYY-MM') + '-01'
    };
    $scope.clearinformation();
}

//加载控制器
basemanControllers
    .controller('sale_list_used', sale_list_used);
