var basemanControllers = angular.module('inspinia');
function pro_item_update_bill($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    pro_item_update_bill = HczyCommon.extend(pro_item_update_bill, ctrl_bill_public);
    pro_item_update_bill.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "pro_item_update_bill",
        key: "item_code",
        //  wftempid:10008,
        FrmInfo: {},
        grids: [{optionname: 'options_27', idname: 'pro_itemofpro_item_headers'}]
    };

    /***************************弹出框***********************/
    $scope.selectitem = function () {
        $scope.FrmInfo = {
            title: "产品查询",
            thead: [
                {
                    name: "产品编码",
                    code: "item_code",
                    show: true,
                    iscond: true,
                    type: 'string'

                }, {
                    name: "产品名称",
                    code: "item_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "产品型号",
                    code: "spec",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "产品简称",
                    code: "item_short_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            is_custom_search: true,
            is_high: true,
            classid: "pro_item",
            //      sqlBlock: "org_id = " + $scope.data.currItem.org_id
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.item_code = result.item_code;
            $scope.data.currItem.item_name = result.item_name;
            $scope.data.currItem.item_id = result.item_id;
        });

    }
    //清除查询条件
    $scope.clear_item = function () {
        $scope.data.currItem.item_code = "";
        $scope.data.currItem.item_name = "";
        $scope.data.currItem.item_id = "";
    }
//查询
    $scope.getbillmsg = function () {
        if ($scope.data.currItem.item_code == "" || $scope.data.currItem.item_code == undefined) {
            BasemanService.notice("请输入要查询的标机", "alert-warning");
        }
        var flag = 0;
        if ($scope.data.currItem.showonly == 2) {
            var flag = 9;
        }
        var postdata = {
            flag: flag,
            item_h_code: $scope.data.currItem.item_code
        };
        BasemanService.RequestPost("pro_item_header", "getbillmsg", postdata)
            .then(function (data) {

                $scope.gridSetData("options_27", data.pro_itemofpro_item_headers);
                $scope.data.currItem.pro_itemofpro_item_headers = data.pro_itemofpro_item_headers
            });
    }
    //同步
    $scope.updatebillmsg = function () {
        var data = $scope.gridGetData("options_27");
        var selectRows = $scope.selectGridGetData('options_27');
        if (!selectRows.length) {
            BasemanService.notice("请先选择要导入的产品", "alert-warning");
            return;
        }
        ds.dialog.confirm("是否导入ERP？", function () {
            for (var i = 0; i < selectRows.length; i++) {
                if(selectRows[i].receiveflag=="2"){
                    selectRows.splice(i,1);
                    continue;
                };
                selectRows[i].receiveflag="2";
            }

            BasemanService.RequestPost("pro_item", "updatebillmsg", {
                pro_itemofpro_items:selectRows,
                item_code:$scope.data.currItem.item_code})
                .then(function () {

                });
            $scope.options_27.api.refreshView();
        }, function () {
            $scope.newWindow.close();
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

        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        checkboxSelection: function (params) {
            return params.columnApi.getRowGroupColumns().length === 0;
        },
    }, {
        headerName: "ERP编码", field: "item_code", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "原客户产品名称", field: "item_name", editable: false, filter: 'set', width: 250,
        cellEditor: "文本框",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "新客户产品名称", field: "item_short_name", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "商检批号", field: "uom_code", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "生产单号", field: "uom_name", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "订单BOM编制单", field: "usable", editable: false, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '未编制'}, {value: 2, desc: '已编制'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "已同步标志", field: "receiveflag", editable: false, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '否'}, {value: 2, desc: '是'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }];
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
    .controller('pro_item_update_bill', pro_item_update_bill);
