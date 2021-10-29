var basemanControllers = angular.module('inspinia');
function pro_item_ysamtEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    pro_item_ysamtEdit = HczyCommon.extend(pro_item_ysamtEdit, ctrl_bill_public);
    pro_item_ysamtEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "pro_item_ysamt",
        key: "ysamt_id",
        // wftempid: 10137,
        FrmInfo: {},
        grids:[],
        // grids: [{optionname: 'options_13', idname: 'pro_item_ysamts'}]
    };

    /***************************弹出框***********************/
    $scope.selectys = function () {
        $scope.FrmInfo = {
            title: "分体机",
            thead: [{
                name: "编码",
                code: "itemcode",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "名称",
                code: "itemname",
                show: true,
                iscond: true,
                type: 'string'

            }],
            is_custom_search: true,
            is_high: true,
            classid: "sale_package_header",
            sqlBlock: "itemdesc like '%压缩机%'",
            postdata: {flag: 1}

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.ys_id = result.itemid;
            $scope.data.currItem.ys_code = result.itemcode;
            $scope.data.currItem.ys_name = result.itemname;

        });
    }
    $scope.selectitem = function () {
        $scope.FrmInfo = {
            title: "压缩机",
            thead: [{
                name: "整机编码",
                code: "item_h_code",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "整机名称",
                code: "item_h_name",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "分体机编码",
                code: "item_code",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "分体机名称",
                code: "item_name",
                show: true,
                iscond: true,
                type: 'string'

            }],
            is_custom_search: true,
            is_high: true,
            classid: "pro_item",
            postdata: {flag: 5}

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.item_h_id = result.item_h_id;
            $scope.data.currItem.item_h_code = result.item_h_code;
            $scope.data.currItem.item_h_name = result.item_h_name;
            $scope.data.currItem.item_id = result.item_h_id;
            $scope.data.currItem.item_code = result.item_code;
            $scope.data.currItem.item_name = result.item_name;
        });
    }
    // $scope.search = function (){
    //     var postdata={};
    //     BasemanService.RequestPost("pro_item_ysamt", "search", postdata)
    //         .then(function (data) {
    //             for (name in data.pro_item_ysamts[0]) {
    //                 var temp=data.pro_item_ysamts[0];
    //                 $scope.data.currItem[name] = temp[name];
    //             }
    //             $scope.gridSetData("options_13", data.pro_item_ysamts);
    //         });
    // }
    // $scope.save_before = function (postdata) {
    //
    //     $scope.search();
    // }
    /************************网格定义区域**************************/
    // var groupColumn = {
    //     headerName: "Group",
    //     width: 200,
    //     field: 'name',
    //     valueGetter: function (params) {
    //         if (params.node.group) {
    //             return params.node.key;
    //         } else {
    //             return params.data[params.colDef.field];
    //         }
    //     },
    //     comparator: agGrid.defaultGroupComparator,
    //     cellRenderer: 'group',
    //     cellRendererParams: {
    //         checkbox: true
    //     }
    // };
    // $scope.columns_13 = [
    //     {
    //         headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 150,
    //         cellEditor: "文本框",
    //         //cellchange:$scope.bankBalance,
    //         enableRowGroup: true,
    //         enablePivot: true,
    //         enableValue: true,
    //         floatCell: true
    //     }, {
    //         headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 150,
    //         cellEditor: "文本框",
    //         //cellchange:$scope.bankBalance,
    //         enableRowGroup: true,
    //         enablePivot: true,
    //         enableValue: true,
    //         floatCell: true
    //     }, {
    //         headerName: "分体机编码", field: "item_code", editable: false, filter: 'set', width: 100,
    //         cellEditor: "文本框",
    //
    //         enableRowGroup: true,
    //         enablePivot: true,
    //         enableValue: true,
    //         floatCell: true
    //     }, {
    //         headerName: "分体机名称", field: "item_name", editable: false, filter: 'set', width: 150,
    //         cellEditor: "文本框",
    //
    //         enableRowGroup: true,
    //         enablePivot: true,
    //         enableValue: true,
    //         floatCell: true
    //     },
    //     {
    //         headerName: "压缩机编码", field: "ys_code", editable: false, filter: 'set', width: 150,
    //         cellEditor: "文本框",
    //
    //         enableRowGroup: true,
    //         enablePivot: true,
    //         enableValue: true,
    //         floatCell: true
    //     },{
    //         headerName: "压缩机名称", field: "ys_name", editable: false, filter: 'set', width: 150,
    //         cellEditor: "文本框",
    //
    //         enableRowGroup: true,
    //         enablePivot: true,
    //         enableValue: true,
    //         floatCell: true
    //     },{
    //         headerName: "压缩机成本", field: "ys_price", editable: false, filter: 'set', width: 150,
    //         cellEditor: "文本框",
    //
    //         enableRowGroup: true,
    //         enablePivot: true,
    //         enableValue: true,
    //         floatCell: true
    //     }, {
    //         headerName: "是否可用", field: "usable", editable: false, filter: 'set', width: 120,
    //         cellEditor: "复选框",
    //         enableRowGroup: true,
    //         enablePivot: true,
    //         enableValue: true,
    //         floatCell: true,
    //     }, {
    //         headerName: "是否通用", field: "tongyong", editable: false, filter: 'set', width: 120,
    //         cellEditor: "复选框",
    //         enableRowGroup: true,
    //         enablePivot: true,
    //         enableValue: true,
    //         floatCell: true,
    //     }, {
    //         headerName: "维护人", field: "creator", editable: false, filter: 'set', width: 150,
    //         cellEditor: "文本框",
    //         //cellchange:$scope.bankBalance,
    //         enableRowGroup: true,
    //         enablePivot: true,
    //         enableValue: true,
    //         floatCell: true
    //     }, {
    //         headerName: "维护时间", field: "create_time", editable: false, filter: 'set', width: 150,
    //         cellEditor: "文本框",
    //         //cellchange:$scope.bankBalance,
    //         enableRowGroup: true,
    //         enablePivot: true,
    //         enableValue: true,
    //         floatCell: true
    //     }, {
    //         headerName: "更新人", field: "updator", editable: false, filter: 'set', width: 150,
    //         cellEditor: "文本框",
    //
    //         enableRowGroup: true,
    //         enablePivot: true,
    //         enableValue: true,
    //         floatCell: true
    //     }, {
    //         headerName: "更新时间", field: "update_time", editable: false, filter: 'set', width: 150,
    //         cellEditor: "文本框",
    //
    //         enableRowGroup: true,
    //         enablePivot: true,
    //         enableValue: true,
    //         floatCell: true
    //     }];
    //
    // $scope.setdata=function (e) {
    //     for (name in e.data) {
    //         $scope.data.currItem[name] = e.data[name];
    //     }
    //     $scope.data.currItem.usable = Number(e.data.usable);
    //     $scope.data.currItem.tongyong = Number(e.data.tongyong);
    // }
    // $scope.options_13 = {
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
    //     rowDoubleClicked:$scope.setdata,
    //     checkboxSelection: function (params) {
    //         var isGrouping = $scope.options_13.columnApi.getRowGroupColumns().length > 0;
    //         return params.colIndex === 0 && !isGrouping;
    //     },
    //     icons: {
    //         columnRemoveFromGroup: '<i class="fa fa-remove"/>',
    //         filter: '<i class="fa fa-filter"/>',
    //         sortAscending: '<i class="fa fa-long-arrow-down"/>',
    //         sortDescending: '<i class="fa fa-long-arrow-up"/>',
    //     }
    // };
    /****************************初始化**********************/
    var myDate = new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: myDate.toLocaleDateString(),
        };
    };
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('pro_item_ysamtEdit', pro_item_ysamtEdit);
