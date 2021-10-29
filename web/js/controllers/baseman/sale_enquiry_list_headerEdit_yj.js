var billmanControllers = angular.module('inspinia');
function sale_enquiry_list_headerEdit_yj($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {

    //继承基类方法
    sale_enquiry_list_headerEdit_yj = HczyCommon.extend(sale_enquiry_list_headerEdit_yj, ctrl_bill_public);
    sale_enquiry_list_headerEdit_yj.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_enquiry_list_header",
        key: "enquirylist_id",
        wftempid: 10077,
        FrmInfo: {sqlBlock:" bill_type=2"},
        grids: [{//船务信息
                optionname: 'cntoptions',
                idname: 'sale_enquiry_list_lineofsale_enquiry_list_headers'
            }
        ]
    };
    // $scope.save_before = function () {
    //      $scope.data.currItem.flag=4;
    //
    // }
    /**网格配置*/
    {
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


        //cntoptions
        {
            $scope.cntoptions = {
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
                rowClicked: undefined,
                groupSelectsChildren: false, // one of [true, false]
                suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
                groupColumnDef: groupColumn,
                showToolPanel: false,
                checkboxSelection: function (params) {
                    var isGrouping = $scope.cntoptions.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                }
            };
            //货代公司
            $scope.searchLogistics = function () {
                $scope.FrmInfo = {
                    is_custom_search:true,
                    title: "船务公司名称查询",
                    is_high: true,
                    thead: [
                        {
                            name: "供应商编码",
                            code: "supplier_Code",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "供应商名称",
                            code: "supplier_name",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "简称",
                            code: "short_name",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "供应商地址",
                            code: "addr",
                            show: true,
                            iscond: true,
                            type: 'string',
                        }],
                    classid: "supplier",
                    sqlBlock: 'usable = 2 and supplier_type=2'
                };
                BasemanService.open(CommonPopController, $scope)
                    .result.then(function (data) {
                    var focusData = $scope.gridGetRow('cntoptions');
                    focusData.logistics_shortname = data.short_name;
                    focusData.logistics_name = data.supplier_name;
                    focusData.logistics_code = data.supplier_code;
                    focusData.logistics_id = data.supplier_id;
                    $scope.gridUpdateRow('cntoptions', focusData);
                });
            };

            $scope.selectboat = function () {
                $scope.FrmInfo = {
                    classid: "supplier",
                    sqlBlock: 'usable = 2 and supplier_type=2 ',
                };
                BasemanService.open(CommonPopController, $scope)
                    .result.then(function (data) {
                    var focusData = $scope.gridGetRow('cntoptions');
                    focusData.tow_cop_name = data.supplier_name;
                    focusData.tow_cop_code = data.supplier_code;
                    focusData.tow_cop_id = data.supplier_id;
                    $scope.gridUpdateRow('cntoptions', focusData);
                });
            };

            $scope.selectcurrency = function () {
                $scope.FrmInfo = {
                    classid: "base_currency",
                };
                BasemanService.open(CommonPopController, $scope)
                    .result.then(function (data) {
                    var focusData = $scope.gridGetRow('cntoptions');
                    focusData.currency_name = data.currency_name;
                    focusData.currency_code = data.currency_code;
                    $scope.gridUpdateRow('cntoptions', focusData);
                });
            };

            $scope.selectuom = function () {
                $scope.FrmInfo = {
                    classid: "uom",
                };
                BasemanService.open(CommonPopController, $scope)
                    .result.then(function (data) {
                    var focusData = $scope.gridGetRow('cntoptions');
                    focusData.uom_code = data.uom_code;
                    focusData.uom_name = data.uom_name;
                    $scope.gridUpdateRow('cntoptions', focusData);
                });
            };

            $scope.cntcellchange = function () {
                var options = "cntoptions";
                var _this = $(this);
                var val = _this.val();

                var nodes = $scope[options].api.getModel().rootNode.childrenAfterGroup;
                var cell = $scope[options].api.getFocusedCell()
                var field = cell.column.colDef.field;

                var data = nodes[cell.rowIndex].data;
                data[field] = val;
                var key = [];
                var total_amt = 0, add_amt = 0 ;
                var columns = $scope[options].columnApi.getColumnState();
                for (var i = 1; i < 11; i++) {
                    if (!columns[$scope.getIndexByField("cntcolumns", "box_price" + i)].hide) {
                        total_amt += Number(data["box_price" + i] || 0) * Number(data["box_qty" + i] || 0);
                        add_amt += Number(data["box_add_price" + i] || 0) * Number(data["box_qty" + i] || 0);
                    }
                }
                data.total_amt = total_amt;
                data.add_amt = add_amt;
                data.add_to_total_amt = add_amt + total_amt;
                $scope[options].api.refreshCells(nodes, ["total_amt","add_amt","add_to_total_amt"]);

            }

            $scope.cntcolumns = [
                {
                    headerName: "序号",
                    field: "seq",
                    editable: false,
                    filter: 'set',
                    width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "货代简称",
                    field: "logistics_shortname",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "货代公司",
                    field: "logistics_name",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "弹出框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    action: $scope.searchLogistics,
                }, {
                    headerName: "船公司简称",
                    field: "tow_shortname",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "弹出框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    action: $scope.selectboat,
                }, {
                    headerName: "船公司",
                    field: "tow_cop_name",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "弹出框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    action: $scope.selectboat,
                }, {
                    headerName: "截关日期",
                    field: "pre_jieg_date",
                    editable: true,
                    filter: 'set',
                    width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    non_empty: true,
                }, {
                    headerName: "货币",
                    field: "currency_name",
                    editable: true,
                    filter: 'set',
                    width: 120,
                    cellEditor: "弹出框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    action: $scope.selectcurrency,
                }, {
                    headerName: "价格有效期",
                    field: "pre_jiag_date",
                    editable: true,
                    filter: 'set',
                    width: 120,
                    cellEditor: "年月日",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    non_empty: true,
                }, {
                    headerName: "单位",
                    field: "uom_name",
                    editable: true,
                    filter: 'set',
                    width: 120,
                    cellEditor: "弹出框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    action: $scope.selectuom,
                }, {
                    headerName: "20GP数量",
                    field: "box_qty1",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "20GP单价",
                    field: "box_price1",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "20GP固定价",
                    field: "box_add_price1",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "40GP数量",
                    field: "box_qty2",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                    hide: true
                }, {
                    headerName: "40GP单价",
                    field: "box_price2",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "40GP固定价",
                    field: "box_add_price2",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "40HQ数量",
                    field: "box_qty3",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "40HQ单价",
                    field: "box_price3",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "40HQ固定价",
                    field: "box_add_price3",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "45HQ数量",
                    field: "box_qty4",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "45HQ单价",
                    field: "box_price4",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "45HQ固定价",
                    field: "box_add_price4",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "40RH数量",
                    field: "box_qty5",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "40RH单价",
                    field: "box_price5",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "40RH固定价",
                    field: "box_add_price5",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "拼箱数量",
                    field: "box_qty6",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                    hide: true
                }, {
                    headerName: "拼箱单价",
                    field: "box_price6",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "拼箱固定价",
                    field: "box_add_price6",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                    hide: true
                }, {
                    headerName: "空运数量",
                    field: "box_qty7",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "空运单价",
                    field: "box_price7",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "空运固定价",
                    field: "box_add_price7",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "一卡一车数量",
                    field: "box_qty8",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                }, {
                    headerName: "一卡一车单价",
                    field: "box_price8",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "一卡一车固定价",
                    field: "box_add_price8",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "二卡一车数量",
                    field: "box_qty9",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "二卡一车单价",
                    field: "box_price9",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                    hide: true
                }, {
                    headerName: "二卡一车固定价",
                    field: "box_add_price9",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "三卡一车数量",
                    field: "box_qty10",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "三卡一车单价",
                    field: "box_price10",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }
                , {
                    headerName: "三卡一车固定价",
                    field: "box_add_price10",
                    width: 100,
                    editable: true,
                    filter: 'set',
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    hide: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "总金额",
                    field: "total_amt",
                    editable: false,
                    filter: 'set',
                    width: 120,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "综合低价",
                    field: "add_to_total_amt",
                    editable: false,
                    filter: 'set',
                    width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "综合排名",
                    field: "paiming",
                    editable: false,
                    filter: 'set',
                    width: 150,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "最晚订舱日",
                    field: "last_dc_date",
                    editable: true,
                    filter: 'set',
                    width: 150,
                    cellEditor: "年月日",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "预计航程(天数)",
                    field: "hang_chen",
                    editable: true,
                    filter: 'set',
                    width: 150,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    non_empty: true,
                    floatCell: true
                }, {
                    headerName: "确定船司",
                    field: "usable",
                    editable: true,
                    filter: 'set',
                    width: 150,
                    cellEditor: "复选框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    non_empty: true,
                    cellchange: $scope.cntcellchange,
                }, {
                    headerName: "其它要求",
                    field: "note",
                    editable: true,
                    filter: 'set',
                    width: 150,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }];

        }


    }

    /*选择框*/
    {
        //scporg
        $scope.scporg = function () {
            if($scope.data.currItem.stat!=1){
                return
            }
            $scope.FrmInfo = {
                classid: "scporg",
                postdata: {},
                sqlBlock: " orgtype=5 ",
                backdatas: "orgs",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                $scope.data.currItem.org_id = result.orgid;
                $scope.data.currItem.org_code = result.code;
                $scope.data.currItem.org_name = result.orgname;
            });
        }
        //scparea
        $scope.scparea = function () {
            if($scope.data.currItem.stat!=1){
                return
            }
            $scope.FrmInfo = {
                classid: "scparea",
                sqlBlock: "areatype = 2",
                postdata: {},
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                $scope.data.currItem.area_name = data.areaname;
                $scope.data.currItem.area_code = data.areacode;
                $scope.data.currItem.area_id = data.areaid;
            });
        }

        //查询出货港
        $scope.searchoutport = function () {
            if($scope.data.currItem.stat!=1){
                return
            }
            $scope.FrmInfo = {
                classid: "seaport",
                postdata: {
                    flag: 1
                },
                sqlBlock: "seaport_type=1",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                $scope.data.currItem.seaport_out_name = data.seaport_name;
                $scope.data.currItem.seaport_out_id = data.seaport_id;
                $scope.data.currItem.seaport_out_code = data.seaport_code;
            });
        }

        //查询到货港
        $scope.searchinport = function () {
            if($scope.data.currItem.stat!=1){
                return
            }
            $scope.FrmInfo = {
                classid: "seaport",
                postdata: {
                    flag: 2
                },
                sqlBlock: "seaport_type=2",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                $scope.data.currItem.seaport_in_name = data.seaport_name;
                $scope.data.currItem.seaport_in_id = parseInt(data.seaport_id);
                $scope.data.currItem.seaport_in_code = data.seaport_code;
            });
        }

        //查询船公司
        $scope.selectboat = function () {
            if($scope.data.currItem.stat!=1){
                return
            }
            $scope.FrmInfo = {
                classid: "supplier",
                postdata: {
                    flag: 1
                },
                sqlBlock: "usable = 2 and supplier_type=2 ",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                $scope.data.currItem.tow_cop_name = data.supplier_name;
                $scope.data.currItem.tow_cop_code = data.supplier_code;
                $scope.data.currItem.tow_cop_id = parseInt(data.supplier_id);
            });
        }

        $scope.selectbox_names = function () {
            if($scope.data.currItem.stat!=1){
                return
            }
            $scope.FrmInfo = {
                title: "柜型查询",
                is_high: true,
                is_custom_search: true,
                thead: [{
                    name: "柜型",
                    code: "box_names",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "柜型id",
                    code: "box_ids",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
                classid: "sale_enquiry_list_header",
                postdata: {flag: 2},
                type: "checkbox",
                searchlist: ["dictname", "dictvalue"],
                commitRigthNow: true,
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (items) {
                if (items.length == 0) {
                    return
                }
                var ids = '', names = '', ids = [];
                for (var i = 0; i < items.length; i++) {
                    names += items[i].box_names + ',';
                    ids += items[i].box_ids + ',';
                    items.push[items[i].box_ids]
                }
                $scope.setColumnsVisible(ids);
                names = names.substring(0, names.length - 1);
                ids = ids.substring(0, ids.length - 1);
                $scope.data.currItem.box_names = names;
                $scope.data.currItem.box_ids = ids;
                var datas = $scope.gridGetData("cntoptions");
                for (var j = 0; j < datas.length; j++) {
                    datas[j].total_amt = 0;
                    for (var i = 0; i < ids.length; i++) {
                        datas[j].total_amt += Number(datas[j]["box_price" + ids[i]] || 0) * Number(datas[j]["box_qty" + ids[i]] || 0);
                    }
                }
                var datas = $scope.gridSetData("cntoptions", datas);
            });
        }

        //查询出货预告
        $scope.selectwarn_no = function () {
            if($scope.data.currItem.stat!=1){
                return
            }
            if ($scope.data.currItem.org_id == "" || $scope.data.currItem.org_id == undefined) {
                BasemanService.notice("请先选择销售区域", "alert-info");
                return;
            }
            $scope.FrmInfo = {
                classid: "sale_ship_warn_header",
                postdata: {},
                sqlBlock: " pay_style =1 and org_id=" + $scope.data.currItem.org_id + "and create_time>=to_date('2012-11-01','yyyy-mm-dd')",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                $scope.data.currItem.seaport_out_name = data.seaport_out_name;
                $scope.data.currItem.seaport_out_id = data.seaport_out_id;
                $scope.data.currItem.seaport_out_code = data.seaport_out_code;
                $scope.data.currItem.area_name = data.to_area_name;
                $scope.data.currItem.area_code = data.to_area_code;
                $scope.data.currItem.area_id = data.to_area_id;
                $scope.data.currItem.seaport_in_name = data.seaport_in_name;
                $scope.data.currItem.seaport_in_id = data.seaport_in_id;
                $scope.data.currItem.seaport_in_code = data.seaport_in_code;
                $scope.data.currItem.pi_no = data.pi_no;
                $scope.data.currItem.pre_ship_date = data.pre_ship_date;
                $scope.data.currItem.warn_no = data.warn_no;
                $scope.data.currItem.warn_id = data.warn_id;

            });
        };


    }


    /*系统词汇*/
    {

        $scope.routs = [
            {
                id: 0,
                name: ""
            }, {
                id: 1,
                name: "中转"
            }, {
                id: 2,
                name: "直达"
            }, {
                id: 3,
                name: "无要求"
            }];
        $scope.cateass = [
            {
                id: 1,
                name: "提单上显示"
            }, {
                id: 2,
                name: "船证明上显示"
            }, {
                id: 3,
                name: "无需显示"
            }];

    }

    /**导出excel*/
    $scope.export = function () {
        if (!$scope.data.currItem.enquirylist_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("sale_enquiry_list_header", "exporttoexcel", {'enquirylist_id': $scope.data.currItem.enquirylist_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }
    $scope.save_before = function () {
        $scope.data.currItem.flag=4;
        delete $scope.data.currItem.objattachs;
        var columns = $scope["cntoptions"].columnApi.getColumnState();
        var data = {};
        for (var j = 0; j < $scope.data.currItem.sale_enquiry_list_lineofsale_enquiry_list_headers.length; j++) {
            data = $scope.data.currItem.sale_enquiry_list_lineofsale_enquiry_list_headers[j];
            data.total_amt = 0;
            for (var i = 1; i < 11; i++) {
                if (columns[$scope.getIndexByField("cntcolumns", "box_price" + i)].hide) {
                    data["box_price" + i] = 0;
                    data["box_qty" + i] = 0;
                }
                data.total_amt += Number(data["box_price" + i] || 0) * Number(data["box_qty" + i] || 0);
            }
        }
    }


    $scope.refresh_after = function () {
        var items = [];
        $scope.data.currItem.box_ids += "";
        if ($scope.data.currItem.box_ids == undefined | $scope.data.currItem.box_ids == "") {
            return;
        }
        if ($scope.data.currItem.box_ids.indexOf(",") == -1) {
            items = [$scope.data.currItem.box_ids];
        } else {
            items = $scope.data.currItem.box_ids.split(",");
        }
        if (window.userbean.stringofrole.indexOf("船务") != -1) {// && $scope.data.currItem.currprocname == ""
            var columns = $scope["cntoptions"].defaultColumns;
            for (var i = 0; i < $scope.cntcolumns.length; i++) {
                $scope.cntcolumns[i].editable = columns[i].editable;
            }
        }
        $scope.setColumnsVisible(items);
        if ($scope.data.currItem.stat == 5) {
            return;
        }
    }

    $scope.setColumnsVisible = function (items) {
        for (var i = 1; i < 11; i++) {
            $scope.cntoptions.columnApi.setColumnVisible('box_price' + i, false);
            $scope.cntoptions.columnApi.setColumnVisible('box_qty' + i, false);
        }
        if (items.length) {
            for (var i = 0; i < items.length; i++) {
                $scope.cntoptions.columnApi.setColumnVisible('box_price' + items[i], true);
                $scope.cntoptions.columnApi.setColumnVisible('box_qty' + items[i], true);
            }
        }
    }

    $scope.clearinformation = function () {
        $scope.data.currItem.bill_type = 2;
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.create_time = new Date();
        $scope.data.currItem.creator = window.userbean.userid;
        $scope.data.currItem.org_id = window.userbean.org_id;
        $scope.data.currItem.org_name = window.userbean.org_name;
        $scope.data.currItem.seaport_out_id = 771;
        $scope.data.currItem.seaport_out_code = "NINGBO";
        $scope.data.currItem.seaport_out_name = "NINGBO";
    }
    $scope.initdata();
}//加载控制器
billmanControllers
    .controller('sale_enquiry_list_headerEdit_yj', sale_enquiry_list_headerEdit_yj)

