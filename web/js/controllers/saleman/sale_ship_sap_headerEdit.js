var basemanControllers = angular.module('inspinia');
function sale_ship_sap_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_ship_sap_headerEdit = HczyCommon.extend(sale_ship_sap_headerEdit, ctrl_bill_public);
    sale_ship_sap_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_ship_sap_header",
        key: "ship_id",
        wftempid: 10125,
        FrmInfo: {sqlBlock: "stat=5"},
        grids: [{optionname: 'options_9', idname: 'sale_ship_sap_lineofsale_ship_sap_headers'}]
    };

    /************************系统词汇**************************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        var stats = [];
        for (var i = 0; i < data.dicts.length; i++) {
            object = {};
            object.id = data.dicts[i].dictvalue;
            object.name = data.dicts[i].dictname;
            stats.push(object);
        }
        $scope.stats = stats;
    })

    /***************************弹出框***********************/
    $scope.selectnotice_no = function () {
        if ($scope.data.currItem.stat != 1) {
            return
        }
        $scope.FrmInfo = {
            classid: "sale_ship_notice_header"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            if (result.notice_id == undefined) {
                return;
            }
            $scope.data.currItem.notice_id = result.notice_id;
            $scope.data.currItem.notice_no = result.notice_no;
            var postdata = {notice_id: result.notice_id};
            BasemanService.RequestPost("sale_ship_notice_header", "select", postdata)
                .then(function (data) {
                    $scope.options_9.api.setRowData(data.sale_ship_notice_sap_lineofsale_ship_notice_headers);
                });
        });
    }

    $scope.gridAddItem = function () {
        $scope.FrmInfo = {
            classid: "sale_ship_notice_header"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            if (result.notice_id == undefined) {
                return;
            }
            $scope.data.currItem.notice_id = result.notice_id;
            $scope.data.currItem.notice_no = result.notice_no;
            var postdata = {notice_id: result.notice_id};
            BasemanService.RequestPost("sale_ship_notice_header", "select", postdata)
                .then(function (data) {
                    var items = $scope.gridGetData("options_9");
                    var obj = {};
                    for (var i = 0; i < data.sale_ship_notice_sap_lineofsale_ship_notice_headers.length; i++) {
                        obj = data.sale_ship_notice_sap_lineofsale_ship_notice_headers[i];
                        if (!HczyCommon.isExist(items, obj, ["delorder_sap", "notice_id"]).exist) {
                            items.push(obj);
                        }
                    }
                    $scope.options_9.api.setRowData(items);
                });
        });

    }

    $scope.importComplete = function () {
        var items = $scope.gridGetData("options_9");
        var date = moment().format("YYYY-MM-DD HH:Mi:SS");
        for (var i = 0; i < items.length; i++) {
            if (items[i].kaip_date == undefined || items[i].kaip_date == "") {
                items[i].kaip_date == date;
            }
        }
        BasemanService.RequestPost("sale_ship_sap_header", "checkline", {sale_ship_sap_lineofsale_ship_sap_headers: items}).then(function (data) {
            $scope.gridSetData("options_9", data.sale_ship_sap_lineofsale_ship_sap_headers);
        })
    }

    $scope.to_null_date = function () {
        var items = $scope.gridGetData("options_9");
        for (var i = 0; i < items.length; i++) {
            if (items[i].kaip_date == undefined || items[i].kaip_date == "") {
                items[i].kaip_date == $scope.data.currItem.kaip_date;
            }
        }
        $scope.options_9.api.setRowData(items);
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

    function colorRenderer(params) {
        if (params.data.flag == 2) {
            params.eGridCell.style.backgroundColor = "yellow";
        }
        return params.value || "";
    }

    $scope.columns_9 = [
        {
            headerName: "发货单号", field: "notice_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            cellRenderer: function (params) {
                return colorRenderer(params)
            },
            enableValue: true,
            floatCell: true
        }, {
            headerName: "SAP内部订单号", field: "interior_sap", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            cellRenderer: function (params) {
                return colorRenderer(params)
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "SAP销售订单号", field: "sale_sap", editable: false, filter: 'set', width: 125,
            cellEditor: "文本框",
            cellRenderer: function (params) {
                return colorRenderer(params)
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "SAP发货订单号", field: "outno_sap", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            cellRenderer: function (params) {
                return colorRenderer(params)
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "SAP交货订单号", field: "delorder_sap", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            cellRenderer: function (params) {
                return colorRenderer(params)
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "开票日期", field: "kaip_date", editable: true, filter: 'set', width: 120,
            cellEditor: "年月日",
            cellRenderer: function (params) {
                return colorRenderer(params)
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "SAP发票号", field: "fapiao_sap", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            cellRenderer: function (params) {
                return colorRenderer(params)
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "SAP发票凭证号", field: "kaipiao_sap", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            cellRenderer: function (params) {
                return colorRenderer(params)
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "SAP公司间发票号", field: "company_fapiao", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            cellRenderer: function (params) {
                return colorRenderer(params)
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "SAP公司间发票凭证", field: "company_kaipiao", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            cellRenderer: function (params) {
                return colorRenderer(params)
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_9 = {
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
            var isGrouping = $scope.options_9.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    /***********************保存校验区域*********************/
    $scope.validate = function () {
        var errorlist = [];
        // $scope.data.currItem.notice_no == undefined ? errorlist.push("发货单号为空") : 0;
        $scope.data.currItem.kaip_date == undefined || $scope.data.currItem.kaip_date == "" ? errorlist.push("开票时间为空") : 0;
        var obj = {};
        for (var i = 0; i < $scope.data.currItem.sale_ship_sap_lineofsale_ship_sap_headers.length; i++) {
            obj = $scope.data.currItem.sale_ship_sap_lineofsale_ship_sap_headers[i];
            if (obj.flag == 2) {
                errorlist.push("第" + (i + 1) + "行在系统中没有对应的发货通知单!");
            }
        }
        if (errorlist.length > 0) {
            BasemanService.notice(errorlist, "alert-danger");
            return false;
        }
        return true;
    }
    $scope.save_before = function () {

    }

    /**----------------------保存校验区域-------------------*/


    $scope.refresh_after = function () {

    }
    /*---------------------刷新------------------------------*/

    $scope.refresh_after = function () {

        //复制历史
        if ($scope.data.currItem.copy == 1) {
            $scope.data.currItem.ship_id = "";
        }

    }
    /****************************初始化**********************/
    var myDate = new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        if (window.userbean) {
            $scope.userbean = window.userbean;
        }
        ;
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,
            create_time: myDate.toLocaleDateString(),
            sale_ship_sap_lineofsale_ship_sap_headers: []
        };
        $scope.data.currItem.sale_ship_sap_lineofsale_ship_sap_headers = [];
        if ($scope.options_9.api) {
            $scope.options_9.api.setRowData(data);
        }
    };

    //数据缓存
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('sale_ship_sap_headerEdit', sale_ship_sap_headerEdit);
