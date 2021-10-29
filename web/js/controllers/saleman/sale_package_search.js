var basemanControllers = angular.module('inspinia');
function sale_package_search($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_package_search = HczyCommon.extend(sale_package_search, ctrl_bill_public);
    sale_package_search.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_package_header",
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_package_headers'},
            {optionname: 'options_12', idname: 'sale_package_headers1'}] ,
    };


    localeStorageService.pageHistory($scope, function () {
        $scope.data.currItem.page_info = {
            oldPage: $scope.oldPage,
            currentPage: $scope.currentPage,
            pageSize: $scope.pageSize,
            totalCount: $scope.totalCount,
            pages: $scope.pages
        }
    });

    localeStorageService.pageHistory($scope, function () {
        if ($scope.page_liftsave)$scope.page_liftsave();
        $scope.getitemline($scope.data.currItem);
        return $scope.data
    });
    $rootScope.currScope = $scope;

    BasemanService.pageInit($scope);

    /******************页面隐藏****************************/
    $scope.make_types = [{id: 1, name: "外购件"}, {id: 2, name: "自制件"}]
    $scope.package_wares = [{id: 2, name: "电子"}, {id: 3, name: "总装"}]

    $scope.getitem = function (flag) {
        $scope.FrmInfo = {
            is_high: true,
            title: "物料查询",
            is_custom_search: true,
            thead: [
                {
                    name: "物料编码",
                    code: "itemcode",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "物料名称",
                    code: "itemname",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            classid: "sale_package_header",
            postdata: {
                flag: 1,
            },
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (data) {
            if (data.itemid == undefined) {
                return
            }
            if(flag==1){
                $scope.data.currItem.item_code = data.itemcode;
                $scope.data.currItem.item_name = data.itemname;
            }else if(flag==2){
                $scope.data.currItem.item_code2 = data.itemcode;
                $scope.data.currItem.item_name2 = data.itemname;
            }
        })
    }

    $scope.pack_name = function () {
        $scope.FrmInfo = {
            classid: "sale_pack_type",
            postdata: {
                flag: 1,
            },
            sqlBlock: " usable=2 ",
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (data) {
            if (data.pack_id == undefined) {
                return
            }
            $scope.data.currItem.pack_name = data.pack_name;
        })
    }
    $scope.in_out_code = function (flag) {
        $scope.FrmInfo = {
            classid: "sale_box_maintain",
            postdata: {
                flag: 1,
            },
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (data) {
            if (data.box_code == undefined) {
                return
            }
            if (flag == "inner") {
                $scope.data.currItem.inner_code = data.box_code;
                $scope.data.currItem.inner_name = data.box_name;
            } else if (flag == "out") {
                $scope.data.currItem.out_code = data.box_code;
                $scope.data.currItem.out_name = data.box_name;
            }
        })
    }

    //查询
    $scope._pageLoad = function (postdata) {
        var strSql=" 1=1 ";
        var items=$scope.gridGetData("options_12");
        var str="'0'";
        for(var i=0;i<items.length;i++){
            if(items[i].item_code!=undefined&&items[i].item_code.length>0){
                str += ",'"+items[i].item_code+"'";
            }
        }
        if(str!="'0'"){
            strSql=" h.item_code in ("+str+")";
        }else{
            strSql=" 1=1 "
        }

        strSql=BasemanService.getSqlWhereBlock(strSql);
        postdata.sqlwhere=strSql;
        postdata.flag=2;
        BasemanService.RequestPost("sale_package_header", "search", postdata)
            .then(function (data) {
                if (data.pagination.length > 0) {
                    BasemanService.pageInfoOp($scope, data.pagination);
                }
                $scope.data.currItem.sale_package_headers = data.sale_package_headers;
                $scope.options_13.api.setRowData(data.sale_package_headers);
            });
    }
    /***************************弹出框***********************/
    $scope.selectorg = function () {
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
    }
    $scope.selectcust = function () {
        if ($scope.data.currItem.org_code == undefined || $scope.data.currItem.org_code == "") {
            BasemanService.notice("请先选业务部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            title: "客户编码 ",
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
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_id = result.cust_id;
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
            headerName: "方案号", field: "package_id", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "方案名称", field: "package_name", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料编码", field: "item_code", editable: false, filter: 'set', width: 140,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料描述", field: "item_desc", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单位", field: "item_uom", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包装方式", field: "package_desc", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "BOM包类型", field: "package_ware", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "包装工厂", field: "package_factory", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产类型", field: "made_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 1, desc: '外购件'}, {value: 2, desc: '自制件'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "方案类型", field: "pack_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: '内箱',
            children: [
                {
                    headerName: "原包装数量", field: "inner_qty", editable: false, filter: 'set', width: 100,
                    tooltipField: 'gameName',
                    cellClass: function () {
                        return 'alphabet';
                    },
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    icons: {
                        sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
                        sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
                    }
                }, {
                    headerName: "包装箱编码", field: "inner_code", editable: false, filter: 'set', width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "箱型名称", field: "inner_desc", editable: false, filter: 'set', width: 170,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "长", field: "inner_long", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "宽", field: "inner_wide", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "高", field: "inner_high", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }
            ]
        }, {
            headerName: '外箱',
            children: [
                {
                    headerName: "原包装数量", field: "out_qty", editable: false, filter: 'set', width: 100,
                    tooltipField: 'gameName',
                    cellClass: function () {
                        return 'alphabet';
                    },
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "包装箱编码", field: "out_code", editable: false, filter: 'set', width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "箱型名称", field: "out_desc", editable: false, filter: 'set', width: 200,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "长", field: "out_long", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "宽", field: "out_wide", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "高", field: "out_high", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }
            ]
        },
        {
            headerName: "包辅料编码", field: "itemcode", editable: false, filter: 'set', width: 140,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包辅料描述", field: "itemname", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包辅料用量", field: "item_qty", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "所属箱型", field: "item_type", editable: false, filter: 'set', width: 120,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 1, desc: '内箱'}, {value: 2, desc: '外箱'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "所属类型", field: "row_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 1, desc: '包辅料'}, {value: 2, desc: '包装箱'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "包辅料成本", field: "item_price", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "同步时间", field: "price_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];

    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "package_ware"})
        .then(function (data) {
            var package_wares = [];
            for (var i = 0; i < data.dicts.length; i++) {
                package_wares[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_13', 'package_ware')) {
                $scope.columns_13[$scope.getIndexByField('columns_13', 'package_ware')].cellEditorParams.values = package_wares;
            }
        });
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "package_ware"})
        .then(function (data) {
            var package_wares = [];
            for (var i = 0; i < data.dicts.length; i++) {
                package_wares[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_13', 'package_factory')) {
                $scope.columns_13[$scope.getIndexByField('columns_13', 'package_factory')].cellEditorParams.values = package_wares;
            }
        });
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
    $scope.columns_12 = [
        {
            headerName: "物料编码", field: "item_code", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_12 = {
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
    $timeout(
        function () {
            for(var i=0;i<5;i++){
                $scope.gridAddItem("options_12");
            }
        },10
    )
}

//加载控制器
basemanControllers
    .controller('sale_package_search', sale_package_search);
