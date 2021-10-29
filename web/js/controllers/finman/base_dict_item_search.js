var basemanControllers = angular.module('inspinia');
function base_dict_item_search($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    base_dict_item_search = HczyCommon.extend(base_dict_item_search, ctrl_bill_public);
    base_dict_item_search.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "pro_new_dict",
        /*        key: "out_id",*/
        //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'pro_new_dicts'}]
    };


//查询
    $scope.search = function () {
        var date1=$scope.data.currItem.start_date;
        var date2=$scope.data.currItem.end_date;
        var sqlBlock=" 1=1 ";
        if(date1>date2 && date1!="" && date2!=undefined && date1!=undefined && date2!=""){
            BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
        }
        if(  date1!="" && date1!=undefined) sqlBlock+=" and  UpdateTime >=('"+date1+"')";
        if(  date2!="" && date2!=undefined) sqlBlock+=" and  UpdateTime <=('"+date2+"')";

        //BasemanService.getSqlWhereBlock(sqlBlock);
        var postdata = { flag:101,
            sqlwhere  : sqlBlock,
            start_date: $scope.data.currItem.start_date,
            end_date: $scope.data.currItem.end_date

        };
        BasemanService.RequestPost("pro_new_dict", "search", postdata)
            .then(function(data){
                $scope.data.currItem.pro_new_dicts=data.pro_new_dicts;
                $scope.options_13.api.setRowData(data.pro_new_dicts);
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
            headerName: "词汇名称", field: "dictname", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "词汇值", field: "dictvalue", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "更新人", field: "updator", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "更新时间", field: "updatetime", editable: false, filter: 'set', width: 150,
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
    .controller('base_dict_item_search', base_dict_item_search);
