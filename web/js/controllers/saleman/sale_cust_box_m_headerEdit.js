var basemanControllers = angular.module('inspinia');
function sale_cust_box_m_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_cust_box_m_headerEdit = HczyCommon.extend(sale_cust_box_m_headerEdit, ctrl_bill_public);
    sale_cust_box_m_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_cust_box_m_header",
        key: "cust_box_m_id",
        wftempid: 10132,
        FrmInfo: {},
        grids: [{optionname: "options1", idname: "sale_cust_box_m_lineofsale_cust_box_m_headers"}]
    };
    /**----弹出框区域*---------------*/
    //界面初始化
    //分组功能
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
        cellRendererParams: function (params) {
        }
    };

    //资金预览
    $scope.options1 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        rowClicked: undefined,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options1.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pro_type"}).then(function (data) {
        var pro_types = [];
        for (var i = 0; i < data.dicts.length; i++) {
            pro_types[i] = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
        }
        if ($scope.getIndexByField('columns1', 'pro_type')) {
            $scope.columns1[$scope.getIndexByField('columns1', 'pro_type')].cellEditorParams.values = pro_types;
        }
    })
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "box_type"}).then(function (data) {
        var box_types = [];
        for (var i = 0; i < data.dicts.length; i++) {
            box_types[i] = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
        }
        if ($scope.getIndexByField('columns1', 'box_type')) {
            $scope.columns1[$scope.getIndexByField('columns1', 'box_type')].cellEditorParams.values = box_types;
        }
    })

    //cust_box_no
    $scope.cust_box_no = function () {
        $scope.FrmInfo = {
            classid: "sale_cust_box_header",
            postdata: {},
            sqlBlock: " stat = 5 and " +
            "not exists (select 1 from sale_cust_box_m_header c where c.cust_box_id = h.cust_box_id and c.stat <> 5)",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (data) {
            if (data.cust_box_id == undefined) {
                return;
            }
            BasemanService.RequestPost("sale_cust_box_header", "select", {cust_box_id: data.cust_box_id}).then(function (data) {
                delete data.stat;
                delete data.creator;
                delete data.create_time;
                delete data.checkor;
                delete data.check_time;
                delete data.wfid;
                delete data.wfflag;
                for (var name in data) {
                    if (data[name] instanceof Array) {
                        continue;
                    }
                    $scope.data.currItem[name] = data[name];
                }
                $scope.data.currItem.sale_cust_box_m_lineofsale_cust_box_m_headers = data.sale_cust_box_lineofsale_cust_box_headers;
                $scope.gridSetData("options1", $scope.data.currItem.sale_cust_box_m_lineofsale_cust_box_m_headers)
            })
        })
    }

    //customer
    $scope.customer = function () {
        return;
        $scope.FrmInfo = {
            classid: "customer",
            postdata: {},
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.org_code = result.org_code;
            $scope.data.currItem.org_id = result.org_id;
            $scope.data.currItem.org_name = result.org_name;
        });
    }

    $scope.seleitem_code = function () {
        if ($scope.data.currItem.stat > 1) {
            return;
        }
        var data = $scope.gridGetRow("options1")
        if (data.pro_type == undefined || data.pro_type == "") {
            BasemanService.notice("请先选择类型!")
            return;
        }
        $scope.FrmInfo = {
            classid: "pro_item_header",
            postdata: {
                flag: 2,
                pro_type: data.pro_type,
            },
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            if (result.item_h_id == undefined) {
                return
            }
            data.item_id = result.item_h_id;
            data.item_code = result.item_h_code;
            data.item_name = result.item_h_name;
            data.is_usable = "2";
            $scope.gridUpdateRow("options1", data);
        })
    }

    $scope.break_name = function () {
        if ($scope.data.currItem.stat > 1) {
            return;
        }
        var data = $scope.gridGetRow("options1")
        if (data.pro_type == undefined || data.pro_type == "") {
            BasemanService.notice("请先选择类型!")
            return;
        }
        $scope.FrmInfo = {
            classid: "sale_break_header",
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            if (result.break_id == undefined) {
                return
            }
            data.break_id = result.break_id;
            data.break_name = result.break_name;
            $scope.gridUpdateRow("options1", data);
        })
    }
    $scope.columns1 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
        {
            headerName: "类型", field: "pro_type", editable: true, filter: 'set', width: 60,
            cellEditor: "下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: []
            },
        },
        {
            headerName: "机型编码", field: "item_code", editable: true, filter: 'set', width: 120,
            cellEditor: "弹出框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            action: $scope.seleitem_code,
        },
        {
            headerName: "机型名称", field: "item_name", editable: true, filter: 'set', width: 250,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "打散名称", field: "break_name", editable: true, filter: 'set', width: 120,
            cellEditor: "弹出框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            action: $scope.break_name,
        },
        {
            headerName: "柜型", field: "box_type", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: []
            },
        },
        {
            headerName: "数量", field: "qty", editable: true, filter: 'set', width: 80,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "有效", field: "is_usable", editable: true, filter: 'set', width: 100,
            cellEditor: "复选框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ]

    $scope.refresh_after = function () {
        $scope.gridSetData("options1", $scope.data.currItem.sale_cust_box_m_lineofsale_cust_box_m_headers);
    }

    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('sale_cust_box_m_headerEdit', sale_cust_box_m_headerEdit);
