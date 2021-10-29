var billmanControllers = angular.module('inspinia');
function sale_ship_warn_m_headerEdit($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {

    //继承基类方法
    sale_ship_warn_m_headerEdit = HczyCommon.extend(sale_ship_warn_m_headerEdit, ctrl_bill_public);
    sale_ship_warn_m_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_ship_warn_m_header",
        key: "warn_m_id",
        wftempid: 10044,
        FrmInfo: {},
        grids: [{//产品明细
            optionname: 'itemoptions',
            idname: 'sale_ship_warn_m_lineofsale_ship_warn_m_headers'
        }
        ]
    };
    //出货预告
    $scope.warn_no = function () {
        $scope.FrmInfo = {
            classid: "sale_ship_warn_header",
            sqlBlock: ' stat =5 and not exists (select 1 from sale_ship_notice_header n where n.warn_id=sale_ship_warn_header.warn_id and n.stat <> 99 ) and is_notice_comp <> 2 '
            + ' and not exists (select 1 from sale_ship_warn_m_header mh where mh.warn_id=sale_ship_warn_header.warn_id'
            + '     and mh.stat < 5 )',
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (data) {
            if (data.warn_id == undefined) {
                return;
            }
            BasemanService.RequestPost("sale_ship_warn_header", "select", {warn_id: data.warn_id}).then(function (data) {
                delete data.stat;
                delete data.creator;
                delete data.create_time;
                delete data.wfid;
                delete data.wfflag;
                for (var name in data) {
                    if (data[name] instanceof Array) {
                        continue;
                    }
                    $scope.data.currItem[name] = data[name];
                }
                for (name in data) {
                    if (name == "org_code") {
                        continue;
                    }
                    if (data[name] instanceof Array) {
                        continue;
                    }
                    if (!isNaN(data[name]) && data[name] != "" && data[name] != undefined) {
                        data[name] = Number(data[name]);
                    }
                }
                $scope.data.currItem.sale_ship_warn_m_lineofsale_ship_warn_m_headers = data.sale_ship_warn_lineofsale_ship_warn_headers;
                $scope.data.currItem.sale_ship_warn_m_pi_lineofsale_ship_warn_m_headers = data.sale_ship_warn_pi_lineofsale_ship_warn_headers;
                $scope.data.currItem.sale_ship_warn_m_h_lineofsale_ship_warn_m_headers = data.sale_ship_warn_h_lineofsale_ship_warn_headers;
                $scope.setitemline1($scope.data.currItem);
            })
        })
    };

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


        //itemoptions
        {
            //itemoptions,根据是否是空白行，判断列的可编辑

            $scope.itemoptions = {
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
                    var isGrouping = $scope.itemoptions.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                }
            };


            $scope.moveto = function () {
                $scope["itemoptions"].api.ensureColumnVisible("saleorder_type")
                $scope["itemoptions"].api.setFocusedCell(0, "saleorder_type");
            }

            $scope.itemcolumns = [
                {
                    headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    checkboxSelection: function (params) {
                        // we put checkbox on the name if we are not doing no grouping
                        return params.columnApi.getRowGroupColumns().length === 0;
                    },
                }, {
                    headerName: "PI号",
                    field: "pi_no",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "贸易类型",
                    field: "trade_type",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellEditorParams: {
                        values: []
                    },
                }, {
                    headerName: "报关贸易类型",
                    field: "bg_trade_type",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellEditorParams: {
                        values: [],
                    }
                }, {
                    headerName: "机型类别",
                    field: "pro_type",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellEditorParams: {
                        values: []
                    },
                }, {
                    headerName: "AB票",
                    field: "ab_votes",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "客户型号",
                    field: "cust_item_name",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "公司型号",
                    field: "cust_spec",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "报关型号",
                    field: "bg_name",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "商检批号",
                    field: "inspection_batchno",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "此次出货预告数量",
                    field: "qty",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "生产单数量",
                    field: "prod_qty",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "件数",
                    field: "pack_style",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "包装类型", field: "pack_type",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellEditorParams: {
                        values: [
                            {
                                value: 1,
                                desc: "WOODEN"
                            }, {
                                value: 2,
                                desc: "CTNS"
                            }, {
                                value: 3,
                                desc: "CASE"
                            }, {
                                value: 4,
                                desc: "PALLET"
                            }, {
                                value: 5,
                                desc: "WOODEN BOX"
                            }, {
                                value: 6,
                                desc: "POLY WOODEN"
                            }, {
                                value: 7,
                                desc: "BOX"
                            }, {
                                value: 8,
                                desc: "裸装"
                            }, {
                                value: 9,
                                desc: "PACKAGES"
                            }],
                    },
                }, {
                    headerName: "重量来源", field: "sy_stat",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellEditorParams: {
                        values: [{desc: "技术参数", value: 0}, {desc: "技术参数", value: 1}, {desc: "称重", value: 2}],
                    },
                }, {
                    headerName: "单位毛重",
                    field: "unit_gw",
                    editable: true,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "单位净重",
                    field: "unit_nw",
                    editable: true,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "单位体积",
                    field: "pack_rule",
                    editable: true,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "总毛重",
                    field: "total_gw",
                    editable: true,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "总净重",
                    field: "total_nw",
                    editable: true,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "总体积",
                    field: "total_tj",
                    editable: true,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "订单类型",
                    field: "saleorder_type",
                    editable: false,
                    filter: 'set',
                    width: 105,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellEditorParams: {
                        values: [],
                    },
                }, {
                    headerName: "是否已报关", field: "is_bg",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellEditorParams: {
                        values: [{desc: "否", value: 0}, {desc: "否", value: 1}, {desc: "是", value: 2}],
                    },
                }, {
                    headerName: "导出数量",
                    field: "printqty",
                    editable: true,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "导出件数",
                    field: "printxqty",
                    editable: true,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "导出总体积",
                    field: "p_total_tj",
                    editable: true,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "导出总毛重",
                    field: "p_total_gw",
                    editable: true,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "导出总净重",
                    field: "p_total_nw",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "工厂交期回复",
                    field: "pre_over_time",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "年月日",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "生产单号",
                    field: "prod_no",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "整机编码",
                    field: "item_h_code",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "ERP编码",
                    field: "erp_code",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "行类型",
                    field: "line_type",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    cellEditorParams: {
                        values: []
                    },
                    floatCell: true,
                }, {
                    headerName: "整机名称",
                    field: "item_h_name",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "机型编码",
                    field: "item_code",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "机型名称",
                    field: "item_name",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    non_empty: true,
                }, {
                    headerName: "已做出货预告数量",
                    field: "warned_qty",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "实际柜号",
                    field: "actual_box_no",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "订舱号",
                    field: "actual_berth_no",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "备注", field: "note",
                    editable: true,
                    filter: 'set',
                    width: 150,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "品牌名",
                    field: "brand_name",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    cellEditorParams: {
                        values: []
                    },
                    floatCell: true,
                }, {
                    headerName: "信用证号", field: "lc_bill_no",
                    editable: true,
                    filter: 'set',
                    width: 120,
                    cellEditor: "弹出框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }];
        }
    }

    /**系统词汇*/

    {
        $scope.send_mans = [
            {
                value: 'AUX ELECTRIC (HONG KONG) COMPANY LIMITED SUITE 4018. 40/F JARDINE HSE 1  CONNAUGHT PLACE CENTRAL HONG KONG',
                name: 'AUX ELECTRIC (HONG KONG) COMPANY LIMITED SUITE 4018. 40/F JARDINE HSE 1  CONNAUGHT PLACE CENTRAL HONG KONG'
            },
            {
                value: 'NINGBO AUX IMP.AND EXP. CO.,LTD.NO.1166 NORTH MINGGUANG ROAD JIANGSHAN TOWN, YINZHOU DISTRICT 315191 NINGBO CHINA',
                name: 'NINGBO AUX IMP.AND EXP. CO.,LTD.NO.1166 NORTH MINGGUANG ROAD JIANGSHAN TOWN, YINZHOU DISTRICT 315191 NINGBO CHINA'
            }]

        $scope.jzlxs = [{id: '不监装', name: '不监装'},
            {id: '业务员监装', name: '业务员监装'},
            {id: '特定人员监装', name: '特定人员监装'}]

        $scope.origin_certificates = [
            {
                value: "CO",
                name: "CO"
            }, {
                value: "FORM A",
                name: "FORM A"
            }, {
                value: "FORM E",
                name: "FORM E"
            }, {
                value: "FORM F",
                name: "FORM F"
            }, {
                value: "其他",
                name: "其他"
            }];


        //到款组织
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "scpent"}).then(function (data) {
            $scope.scpents = HczyCommon.stringPropToNum(data.dicts);
        });

        //订单类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "sale_order_type"})
            .then(function (data) {
                var sale_order_types = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    sale_order_types[i] = {
                        value: data.dicts[i].dictvalue,
                        desc: data.dicts[i].dictname
                    }
                }

                if ($scope.getIndexByField('itemcolumns', 'saleorder_type')) {
                    $scope.itemcolumns[$scope.getIndexByField('itemcolumns', 'saleorder_type')].cellEditorParams.values = sale_order_types;
                }
            });
        //行类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "line_type"})
            .then(function (data) {
                var line_types = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    line_types[i] = {
                        value: data.dicts[i].dictvalue,
                        desc: data.dicts[i].dictname
                    }
                }

                if ($scope.getIndexByField('itemcolumns', 'line_type')) {
                    $scope.itemcolumns[$scope.getIndexByField('itemcolumns', 'line_type')].cellEditorParams.values = line_types;
                }
            });

        //需要查询--贸易类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"})
            .then(function (data) {
                $scope.sale_ent_types = data.dicts;
                var trade_types = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    trade_types[i] = {
                        value: data.dicts[i].dictvalue,
                        desc: data.dicts[i].dictname
                    };
                }
                if ($scope.getIndexByField('itemcolumns', 'trade_type')) {
                    $scope.itemcolumns[$scope.getIndexByField('itemcolumns', 'trade_type')].cellEditorParams.values = trade_types;
                }

                if ($scope.getIndexByField('itemcolumns', 'bg_trade_type')) {
                    $scope.itemcolumns[$scope.getIndexByField('itemcolumns', 'bg_trade_type')].cellEditorParams.values = trade_types;
                }

            });
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pro_type"})
            .then(function (data) {
                var pro_types = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    pro_types[i] = {
                        value: data.dicts[i].dictvalue,
                        desc: data.dicts[i].dictname
                    };
                }
                if ($scope.getIndexByField('itemcolumns', 'pro_type')) {
                    $scope.itemcolumns[$scope.getIndexByField('itemcolumns', 'pro_type')].cellEditorParams.values = pro_types;
                }
            });


        //运费付款方式系统词汇值
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_style"}).then(function (data) {
            $scope.pay_styles = HczyCommon.stringPropToNum(data.dicts);
        });
        //货代类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "hd_type"}).then(function (data) {
            $scope.hd_types = HczyCommon.stringPropToNum(data.dicts);
        });
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "ship_type"}).then(function (data) {
            $scope.ship_types = HczyCommon.stringPropToNum(data.dicts);
        });
        $scope.sale_types = [
            {
                id: 1,
                name: "外销常规订单"
            }, {
                id: 2,
                name: "外销散件订单"
            }, {
                id: 3,
                name: "配件订单"
            }]

        BasemanService.RequestPost("base_currency", "search", {})
            .then(function (data) {
                $scope.currencys = HczyCommon.stringPropToNum(data.base_currencys);
            });

        BasemanService.RequestPostAjax("price_type", "search", {})
            .then(function (data) {
                $scope.price_types = [];
                for (var i = 0; i < data.price_types.length; i++) {
                    $scope.price_types[i] = {
                        dictvalue: parseInt(data.price_types[i].price_type_id),
                        dictcode: data.price_types[i].price_type_code,
                        dictname: data.price_types[i].price_type_name
                    }
                }
            });

    }


    /**导出excel*/
    {

        $scope.export = function () {
            if (!$scope.data.currItem.warn_m_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_warn_m_header", "exporttoexcel", {'warn_m_id': $scope.data.currItem.warn_m_id})
                .then(function (data) {
                    if (data.docid != undefined && Number(data.docid) != 0) {
                        var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                        window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                    } else {
                        BasemanService.notice("导出失败!", "alert-info");
                    }
                });
        }

        $scope.export1 = function () {
            if (!$scope.data.currItem.warn_m_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_warn_m_header", "exporttoexcel1", {'warn_m_id': $scope.data.currItem.warn_m_id})
                .then(function (data) {
                    if (data.docid != undefined && Number(data.docid) != 0) {
                        var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                        window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                    } else {
                        BasemanService.notice("导出失败!", "alert-info");
                    }
                });
        }
        //订舱委托书
        $scope.export2 = function () {
            if (!$scope.data.currItem.warn_m_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_warn_m_header", "exporttoexcel2", {'warn_m_id': $scope.data.currItem.warn_m_id})
                .then(function (data) {
                    if (data.docid != undefined && Number(data.docid) != 0) {
                        var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                        window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                    } else {
                        BasemanService.notice("导出失败!", "alert-info");
                    }
                });
        }
        //托柜通知书
        $scope.export3 = function () {
            if (!$scope.data.currItem.warn_m_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_warn_m_header", "exporttoexcel3", {'warn_m_id': $scope.data.currItem.warn_m_id})
                .then(function (data) {
                    if (data.docid != undefined && Number(data.docid) != 0) {
                        var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                        window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                    } else {
                        BasemanService.notice("导出失败!", "alert-info");
                    }
                });
        }
        //预排分箱明细
        $scope.export4 = function () {
            if (!$scope.data.currItem.warn_m_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_warn_m_header", "exporttoexcel4", {'warn_m_id': $scope.data.currItem.warn_m_id})
                .then(function (data) {
                    if (data.docid != undefined && Number(data.docid) != 0) {
                        var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                        window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                    } else {
                        BasemanService.notice("导出失败!", "alert-info");
                    }
                });
        }
    }

    $scope.clearinformation = function () {
        $scope.package_code2Show = false;
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.ship_type = 2;
        $scope.data.currItem.creator = window.userbean.userid;
        $scope.data.currItem.org_id = window.userbean.org_id;
        $scope.data.currItem.org_name = window.userbean.org_name;
        $scope.data.currItem.sales_user_id = window.userbean.userid;
        $scope.data.currItem.arr_entid = 101;//家用
        $scope.data.currItem.seaport_out_name = "NINGBO";
        $scope.data.currItem.seaport_out_id = 771;
        $scope.data.currItem.seaport_out_code = "NINGBO";
    }


    $scope.initdata();


}

//加载控制器
billmanControllers
    .controller('sale_ship_warn_m_headerEdit', sale_ship_warn_m_headerEdit)

