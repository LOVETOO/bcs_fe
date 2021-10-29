var billmanControllers = angular.module('inspinia');
function sale_ship_warn_headerEdit($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {

    //继承基类方法
    sale_ship_warn_headerEdit = HczyCommon.extend(sale_ship_warn_headerEdit, ctrl_bill_public);
    sale_ship_warn_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_ship_warn_header",
        key: "warn_id",
        wftempid: 10017,
        FrmInfo: {},
        grids: [
            {//信用证
                optionname: 'cntoptions',
                idname: 'sale_ship_warn_lc_lineofsale_ship_warn_headers'
            }, {//询价记录
                optionname: 'enquiryoptions',
                idname: 'sale_ship_warn_enquiryofsale_ship_warn_headers'
            }, {//询价？？
                optionname: 'itemoptions',
                idname: 'sale_ship_warn_itemofsale_ship_warn_headers'
            }, {//免费配件金额
                optionname: 'partamtoptions',
                idname: 'sale_ship_warn_part_amt_lineofsale_ship_warn_headers'
            }, {//产品明细
                optionname: 'aoptions',
                idname: 'sale_ship_warn_line_sumofsale_ship_warn_headers'
            }, {//单列配件信息
                optionname: 'fissoptions',
                idname: 'sale_ship_warn_part_lineofsale_ship_warn_headers'
            }, {//柜型
                optionname: 'Cabinetoptions',
                idname: 'sale_ship_warn_box_lineofsale_ship_warn_headers',
                line: {//柜中明细
                    optionname: 'prearroptions',
                    idname: 'sale_ship_warn_line_sumofsale_ship_warn_box_lines'
                }
            }, {//待排箱货物
                optionname: 'waitarroptions',
                idname: 'waitdatas'
            }, {//排柜明细汇总
                optionname: 'boxsumoptions',
                idname: 'sale_ship_warn_lineofsale_ship_warn_headers'
            }, {
                optionname: 'packageoptions',
                idname: 'sale_ship_warn_package_lineofsale_ship_warn_headers'
            }
        ]
    };
    /**区域显示*/
    {
        $scope.cntShow = false;
        $scope.cntShowF = function () {
            $scope.cntShow = !$scope.cntShow
        }

        $scope.otherShow = false;
        $scope.otherShowF = function () {
            $scope.otherShow = !$scope.otherShow
        }

        $scope.enquiryShow = false;
        $scope.enquiryShowF = function () {
            $scope.enquiryShow = !$scope.enquiryShow
        }

        $scope.other1Show = false;
        $scope.other1ShowF = function () {
            $scope.other1Show = !$scope.other1Show
        }

        $scope.fissionShow = false;
        $scope.fissionShowF = function () {
            $scope.fissionShow = !$scope.fissionShow
        }

        $scope.credit_stat = false;
        $scope.show_credit = function () {
            $scope.credit_stat = !$scope.credit_stat;
        };
    }

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
            $scope.addcntitem = function () {
                var items = $scope.gridGetData("aoptions");
                if (items.length == 0) {
                    BasemanService.notice("先增加产品明细再选择信用证!");
                    return;
                }
                $scope.selectlc(items, undefined, true, true);
            }
            $scope.selectlc = function (itemlines, is_to_other, is_to_aoptions, ischeckbox) {
                var pi_id = "-1";
                for (i = 0; i < itemlines.length; i++) {
                    if (pi_id.indexOf(itemlines[i].pi_id) == -1) {
                        pi_id = itemlines[i].pi_id + "," + pi_id;
                    }
                }
                $scope.FrmInfo = {
                    sqlBlock: " pi_id in (" + pi_id + ")",
                    classid: "fin_lc_bill",
                    postdata: {
                        flag: 3,
                    },
                }
                if (ischeckbox) {
                    $scope.FrmInfo.type = "checkbox"
                }
                BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (items) {
                    if ((items.length == undefined || items.length == 0) && items.lc_bill_id == undefined) {
                        return;
                    }
                    var lcs = $scope.gridGetData("cntoptions");
                    var isExists = false;
                    if(!ischeckbox){
                        items=[items];
                    }
                    for (var i = 0; i < items.length; i++) {
                        /*处理产品明细的LC_bill_no*/
                        if (is_to_other) {//如果要影响其它列
                            itemlines = $scope.gridGetData('aoptions');
                        }
                        if (is_to_other == undefined) {
                            itemlines = [];
                        }
                        for (var i = 0; i < itemlines.length; i++) {
                            if (itemlines[i].pi_id == items[i].pi_id) {//pi_id相同的数据
                                itemlines[i].lc_bill_no = items[i].lc_bill_no;
                                itemlines[i].lc_bill_id = items[i].lc_bill_id;
                            }
                        }
                        /*对单证信息增加信用证行*/
                        if (!is_to_aoptions) {
                            continue;
                        }
                        var isExists = HczyCommon.isExist(lcs, items[i], ["lc_bill_no", "pi_no"], ["lc_no", "pi_no"]).exist;
                        if (isExists) {
                            continue;
                        }
                        items[i].lc_bill_no = items[i].lc_no;
                        items[i].last_tran_date = items[i].latest_shipment_date;
                        $scope.gridAddItem('cntoptions', items[i]);
                    }
                    if (is_to_other) {//如果要影响其它列
                        itemlines = $scope.gridGetData('aoptions');
                    } else if (is_to_other == false) {
                        itemlines = $scope.gridUpdateRow('aoptions', itemlines[0]);
                    }
                })
            }
            $scope.delcntitem = function () {
                var lc = $scope.gridGetRow("cntoptions");
                var itemlines = $scope.gridGetData("aoptions");
                for (var i = 0; i < itemlines.length; i++) {
                    if (itemlines[i].pi_id == lc.pi_id) {
                        itemlines[i].lc_bill_no = undefined;
                    }
                }
                $scope.gridDelItem('cntoptions')
            }

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
            $scope.cntcolumns = [
                {
                    headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "PI号", field: "pi_no", editable: false, filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    width: 100,
                }, {
                    headerName: "信用证号", field: "lc_bill_no", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "信用证货品", field: "pbrand_name", editable: true, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "船证明特殊条款", field: "vessel_certificate", editable: true, filter: 'set', width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "最迟运期", field: "last_tran_date", editable: true, filter: 'set', width: 120,
                    cellEditor: "年月日",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "发货人", field: "send_man", editable: true, filter: 'set', width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "收货人", field: "receive_man", editable: true, filter: 'set', width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "通知人", field: "notice_man", editable: true, filter: 'set', width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "船证明", field: "vessel_certificate", editable: true, filter: 'set', width: 150,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "信用证提单要求", field: "request_lcbill", editable: true, filter: 'set', width: 150,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "产地证", field: "origin", editable: true, filter: 'set', width: 150,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellEditorParams: {
                        values: [
                            {
                                value: "CO",
                                desc: "CO"
                            }, {
                                value: "FORM A",
                                desc: "FORM A"
                            }, {
                                value: "FORM E",
                                desc: "FORM E"
                            }, {
                                value: "FORM F",
                                desc: "FORM F"
                            }, {
                                value: "其他",
                                desc: "其他"
                            }]
                    }
                }, {
                    headerName: "其它要求", field: "note", editable: true, filter: 'set', width: 150,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }];

        }

        //enquiryoptions
        {

            /*增加行*/
            $scope.addenquiryitem = function () {
                var data = $scope.gridGetData("Cabinetoptions");
                if (data.length < 1) {
                    BasemanService.notice("请先排柜");
                    return;
                }
                $scope.FrmInfo = {
                    classid: "sale_enquiry_list_header",
                    postdata: {
                        warn_id: $scope.data.currItem.warn_id,
                        seaport_out_id: $scope.data.currItem.seaport_out_id,
                        seaport_in_id: $scope.data.currItem.seaport_in_id,
                        flag: 1
                    },
                    type: "checkbox",
                }
                BasemanService.open(CommonPopController, $scope)
                    .result.then(function (items) {
                    var enquirys = $scope.gridGetData("enquiryoptions");
                    for (var i = 0; i < items.length; i++) {
                        if (HczyCommon.isExist(enquirys, items[i], ["enquirylist_id"]).exist) {
                            continue;
                        }
                        $scope.data.currItem.tow_cop_code = items[i].tow_cop_code;
                        $scope.data.currItem.tow_cop_name = items[i].tow_cop_name;
                        $scope.data.currItem.tow_cop_id = items[i].tow_cop_id;
                        $scope.data.currItem.transit_code = items[i].transit_code;
                        $scope.data.currItem.transit_id = items[i].transit_id;
                        $scope.data.currItem.transit_name = items[i].transit_name;
                        $scope.data.currItem.xjnr = items[i].bi_tian;
                        $scope.data.currItem.xj_note = items[i].hnote;
                        $scope.gridAddItem("enquiryoptions", items[i]);
                    }
                })
            };

            $scope.enquiryoptions = {
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
                    var isGrouping = $scope.enquiryoptions.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                }
            };


            $scope.enquirycolumns = [
                {
                    headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "出货港", field: "seaport_out_name", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "到货港", field: "seaport_in_name", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "货代公司", field: "logistics_name", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "船公司名称", field: "tow_cop_name", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "货币", field: "currency_code", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "单位", field: "uom_name", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "总金额", field: "total_amt", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "开始日期", field: "start_jiag_date", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "截止日期", field: "pre_jiag_date", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "航程", field: "hang_chen", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "截关日期", field: "pre_jieg_date", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "最晚订仓日", field: "last_dc_date", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "证书要求", field: "cate_ask", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "航线", field: "route", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }];

        }

        //itemoptions
        {
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

            $scope.itemcolumns = [
                {
                    headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "出货预告", field: "warn_no", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "价格条款", field: "price_type_name", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "运费", field: "amt_fee", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "货币", field: "print_amt", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "保费", field: "uom_name", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "总金额", field: "total_amt", editable: false, filter: 'set', width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }];

        }

        //partamtoptions
        {
            $scope.partamtoptions = {
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

            $scope.partamtcolumns = [
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
                    headerName: "出货预告",
                    field: "warn_no",
                    editable: false,
                    filter: 'set',
                    width: 130,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "PI号",
                    field: "pi_no",
                    editable: false,
                    filter: 'set',
                    width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "免费配件金额(RMB)",
                    field: "part_amt",
                    editable: false,
                    filter: 'set',
                    width: 150,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }];

        }

        //aoptions,根据是否是空白行，判断列的可编辑
        {

            $scope.additem = function () {
                var msg = []
                if ($scope.data.currItem.price_type_name == undefined) {
                    msg.push("价格条款不能为空")
                }
                if ($scope.data.currItem.cust_code == undefined) {
                    msg.push("客户不能为空")
                }
                if ($scope.data.currItem.seaport_out_name == undefined) {
                    msg.push("出货港不能为空")
                }
                if ($scope.data.currItem.seaport_in_name == undefined && $scope.data.currItem.price_type_name.indexOf("FOB") == -1) {
                    msg.push("入货港不能为空")
                }
                if (msg.length > 0) {
                    BasemanService.notice(msg);
                    return;
                }
                $scope.FrmInfo = {
                    is_custom_search: true,
                    title: "生产单查询",
                    is_high: true,
                    thead: [
                        {
                            name: "PI单号",
                            code: "pi_no",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "生产单号",
                            code: "prod_no",
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
                            name: "产品名称",
                            code: "item_name",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "生产单数量",
                            code: "prod_qty",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "已做预告数量",
                            code: "warned_qty",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "客户机型",
                            code: "cust_item_name",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "ERP产品编码",
                            code: "erp_code",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }, {
                            name: "合同价",
                            code: "price",
                            show: true,
                            iscond: true,
                            type: 'string'
                        }],
                    classid: "sale_pi_header",
                    type: 'checkbox',
                    postdata: {
                        flag: 2,
                        price_type_id: $scope.data.currItem.price_type_id,
                        cust_id: $scope.data.currItem.cust_id,
                        price_type_name: $scope.data.currItem.price_type_name,
                        seaport_out_id: $scope.data.currItem.seaport_out_id,
                        seaport_in_id: $scope.data.currItem.seaport_in_id || "",
                    },
                };
                BasemanService.open(CommonPopController, $scope, "", "lg")
                    .result.then(function (items) {
                    if (items.length > 0) {
                        var waitData = $scope.gridGetData('waitarroptions');
                        var data = $scope.gridGetData('aoptions');
                        var boo = false;
                        for (var i = 0; i < items.length; i++) {

                            for (var j = 0; j < data.length; j++) {//判断是否已经存在
                                if (parseInt(items[i].prod_line_id) == parseInt(data[j].prod_line_id)
                                    && parseInt(items[i].prod_id) == parseInt(data[j].prod_id)
                                    && parseInt(items[i].pi_id) == parseInt(data[j].pi_id)) {
                                    boo = true;
                                    break
                                }
                            }
                            if (boo) {
                                continue
                            }
                            items[i].qty = items[i].prod_qty - items[i].warned_qty - items[i].donocheckqty;
                            items[i].pack_style = parseInt(items[i].qty);
                            items[i].is_needsj = 2;
                            //将所需资料写到dg上
                            items[i].bg_name = '';
                            items[i].saleorder_type = items[i].sale_order_type;
                            items[i].sj_type = items[i].stat;

                            items[i].pack_type = 2;
                            items[i].ab_votes = "A";
                            items[i].add_row = "1";
                            if (parseInt(items[i].sj_type) == 7) {
                                items[i].pack_style = "0";
                                items[i].printqty = "0";
                                items[i].printxqty = "0";
                            } else {
                                items[i].printqty = items[i].qty;
                                items[i].printxqty = items[i].pack_style;
                            }
                            items[i].total_gw = String(parseFloat(items[i].qty || 0 + 0) * parseFloat(items[i].unit_gw || 0 + 0));
                            items[i].total_nw = String(parseFloat(items[i].qty || 0 + 0) * parseFloat(items[i].unit_nw || 0 + 0));
                            items[i].total_tj = String(parseFloat(items[i].qty || 0 + 0) * parseFloat(items[i].pack_rule || 0 + 0));
                            items[i].p_total_gw = items[i].total_gw;
                            items[i].p_total_nw = items[i].total_nw;
                            items[i].p_total_tj = items[i].total_tj;
                            items[i].bg_trade_type = items[i].trade_type;
                            items[i].note = "";

                            data.push(items[i]);
                            var object = $.extend({}, items[i]);
                            waitData.push(object);

                        }
                        $scope.gridSetData('aoptions', data);
                        $scope.gridSetData('waitarroptions', waitData);
                    }
                });
            }

            /**拆分行*/
            $scope.split = function () {
                var select_row = $scope.selectGridGetData('aoptions');
                if (!select_row.length) {
                    BasemanService.notice("未选中拆分明细!", "alert-warning");
                    return;
                }
                var msg = [];
                if (select_row.length > 1) {
                    msg.push("不能选择拆分的行数大于1行");
                }
                if (!(select_row[0].qty > 1)) {
                    msg.push("被拆分行的需求数量必须大于1");
                }
                if (msg.length > 0) {
                    BasemanService.notice(msg)
                    return
                }
                var datachose = select_row[0];
                BasemanService.openFrm("views/Pop_copy_Line.html", PopCopyLineController, $scope)
                    .result.then(function (result) {
                    var spiltRow = new Array(result.lines);
                    for (i = 0; i < result.lines; i++) {
                        spiltRow[i] = new Object();
                        for (var name in datachose) {
                            spiltRow[i][name] = datachose[name];
                        }
                    }
                    //数量拆分
                    var sumTotal = datachose.qty;
                    $scope.selectGridDelItem('aoptions');//删除勾选行的数据
                    for (var i = 0; i < result.lines; i++) {
                        spiltRow[i].qty = parseInt(sumTotal / (result.lines - i));
                        sumTotal = sumTotal - spiltRow[i].qty;
                        spiltRow[i].warn_line_id = 0;
                        spiltRow[i].warn_sum_id = 0;
                        spiltRow[i].total_nw = spiltRow[i].unit_nw * spiltRow[i].qty;
                        spiltRow[i].total_gw = spiltRow[i].unit_gw * spiltRow[i].qty;
                        spiltRow[i].p_total_nw = spiltRow[i].unit_nw * spiltRow[i].qty;
                        spiltRow[i].total_gw = spiltRow[i].unit_nw * spiltRow[i].qty;
                        spiltRow[i].p_total_gw = spiltRow[i].unit_nw * spiltRow[i].qty;
                        spiltRow[i].total_tj = parseFloat(spiltRow[i].pack_rule) * spiltRow[i].qty;
                        spiltRow[i].p_total_tj = parseFloat(spiltRow[i].pack_rule) * spiltRow[i].qty;
                        spiltRow[i].pack_style = spiltRow[i].qty;
                        spiltRow[i].printqty = spiltRow[i].qty;
                        spiltRow[i].printxqty = spiltRow[i].qty;
                        $scope.gridAddItem('aoptions', spiltRow[i])
                    }
                });

            }

            /*增加空行*/
            $scope.addblankline = function () {
                var itemTemp = {
                    seq: 1,
                    add_row: 2,
                    ab_votes: "A",
                    sale_order_type: 1

                }
                $scope.gridAddItem('aoptions', itemTemp)
            }

            /*复制受工行
             * */
            $scope.copyline = function () {
                var select_row = $scope.selectGridGetData('aoptions');
                var msg = []
                if (select_row.length != 1) {
                    msg.push("只能选择一行")
                }
                if (select_row[0].add_row != 2) {
                    msg.push("只能选择手工行")
                }
                if (msg.length > 0) {
                    BasemanService.notice(msg)
                    return;
                }
                var inputobj = {}
                HczyCommon.copyobj(select_row[0], inputobj)
                inputobj.warn_sum_id = 0;
                inputobj.erp_code = '';
                inputobj.warn_h_id = 0;
                $scope.gridAddItem('aoptions', inputobj);
            }


            $scope.calgwnw = function () {
                var items = $scope.gridGetData('aoptions');
                var sums = $scope.gridGetData('boxsumoptions')
                var sumid;
                for (var i = 0; i < items.length; i++) {
                    sumid = items[i].warn_sum_id;
                    for (var j = 0; j < sums.length; j++) {
                        if (sumid == sums[j].warn_sum_id) {
                            sums[j].total_gw = Number(sums[j].qty || 0) * Number(sums[j].unit_gw || 0)
                            sums[j].total_nw = Number(sums[j].qty || 0) * Number(sums[j].unit_nw || 0)
                            sums[j].total_tj = Number(sums[j].qty || 0) * Number(sums[j].pack_rule || 0)
                            sums[j].p_total_gw = sums[j].total_gw
                            sums[j].p_total_nw = sums[j].total_nw
                            sums[j].p_total_tj = sums[j].total_tj
                        }
                    }
                }
                var boxlines = $scope.gridGetData('Cabinetoptions');
                var piboxid, seq, pack_rule, unit_gw, unit_nw;
                for (var i = 0; i < boxlines.length; i++) {
                    piboxid = boxlines[i].pi_box_id;
                    seq = boxlines[i].seq;
                    pack_rule = 0, unit_gw = 0, unit_nw = 0
                    for (var j = 0; j < sums.length; j++) {
                        if (seq == sums[j].box_seq && piboxid == sums[j].pi_box_id) {
                            unit_gw += Number(sums[j].total_gw || 0)
                            unit_nw += Number(sums[j].total_nw || 0)
                            pack_rule += Number(sums[j].total_tj || 0)
                        }
                    }
                    boxlines[i].total_pack_rule = pack_rule;
                    boxlines[i].total_unit_gw = unit_gw;
                    boxlines[i].total_unit_nw = unit_nw;
                }

                $scope.gridSetData('aoptions', items)
                $scope.gridSetData('boxsumoptions', sums)
                $scope.gridSetData('Cabinetoptions', boxlines)
            }
            $scope.getgw = function () {
                BasemanService.RequestPost("sale_ship_warn_header", "getitemgw", {varn_id: $scope.data.currItem.warn_id}).then(function (data) {
                    if (data.sale_ship_warn_lineofsale_ship_warn_headers.length < 1) {
                        BasemanService.notice("没有称重数据!")
                        return;
                    }
                    var objline = {}, qty
                    var items = $scope.gridGetData('aoptions');
                    for (var i = 0; i < data.sale_ship_warn_lineofsale_ship_warn_headers.length; i++) {
                        objline = data.sale_ship_warn_lineofsale_ship_warn_headers[i];
                        objline = HczyCommon.stringPropToNum(objline);
                        for (var j = 0; j < items.length; j++) {
                            if (objline.erp_code == items[j].erp_code) {
                                qty = Number(items[j].qty);
                                items[j].unit_gw = objline.unit_gw
                                items[j].unit_nw = objline.unit_nw
                                items[j].sy_stat = 2
                                items[j].total_gw = objline.unit_gw * qty
                                items[j].total_nw = objline.unit_nw * qty
                                items[j].p_total_gw = objline.unit_gw * qty
                                items[j].p_total_nw = objline.unit_nw * qty
                            }
                        }
                    }
                    $scope.gridSetData('aoptions', items)
                    var sums = $scope.gridGetData('boxsumoptions');
                    for (var i = 0; i < data.sale_ship_warn_lineofsale_ship_warn_headers.length; i++) {
                        objline = data.sale_ship_warn_lineofsale_ship_warn_headers[i];
                        for (var j = 0; j < items.length; j++) {
                            if (objline.erp_code == sums[j].erp_code) {
                                qty = Number(sums[j].qty);
                                sums[j].unit_gw = objline.unit_gw
                                sums[j].unit_nw = objline.unit_nw
                                sums[j].sy_stat = 2
                                sums[j].total_gw = objline.unit_gw * qty
                                sums[j].total_nw = objline.unit_nw * qty
                                sums[j].p_total_gw = objline.unit_gw * qty
                                sums[j].p_total_nw = objline.unit_nw * qty
                            }
                        }
                    }
                    $scope.gridSetData('boxsumoptions', sums)
                    BasemanService.notice("获取称重数据完成!")

                })

            }

            $scope.moveto = function () {
                $scope["aoptions"].api.ensureColumnVisible("saleorder_type");
                $scope["aoptions"].api.setFocusedCell(0, "saleorder_type");
            }

            $scope.delaoline = function () {
                var dellines = $scope.selectGridGetData("aoptions");
                var boxs = $scope.gridGetData("Cabinetoptions");
                var sums = $scope.gridGetData("boxsumoptions");
                var waitdatas = $scope.gridGetData("waitarroptions");
                var lines = [];
                var obj = {}
                for (var i = 0; i < boxs.length; i++) {
                    lines = boxs[i].sale_ship_warn_line_sumofsale_ship_warn_box_lines;
                    for (var j = 0; j < lines.length;) {
                        obj = lines[j];
                        if (HczyCommon.isExist(dellines, obj, ["warn_sum_id"]).exist) {
                            lines.splice(j, 1);
                        } else {
                            j++
                        }
                    }
                    $scope.calBoxline(boxs[i]);
                }
                for (var j = 0; j < waitdatas.length;) {
                    obj = waitdatas[j];
                    if (HczyCommon.isExist(dellines, obj, ["warn_sum_id"]).exist) {
                        waitdatas.splice(j, 1);
                    } else {
                        j++
                    }
                }
                for (var j = 0; j < sums.length;) {
                    obj = sums[j];
                    if (HczyCommon.isExist(dellines, obj, ["warn_sum_id"]).exist) {
                        sums.splice(j, 1);
                    } else {
                        j++
                    }
                }
                $scope.rowClicked();
                $scope.gridSetData("waitarroptions", waitdatas);
                $scope.selectGridDelItem("aoptions");
                $scope.gridSetData("boxsumoptions", sums);
            }

            $scope.aoptions = {
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
                rowClicked: function (e) {
                    if (e.data.add_row == '2') {
                        for (var i = 1; i < $scope.acolumns.length; i++) {
                            $scope.acolumns[i].editableBak = $scope.acolumns[i].editable;
                            $scope.acolumns[i].editable = true;
                        }
                    } else {
                        for (var i = 1; i < $scope.acolumns.length; i++) {
                            if ($scope.acolumns[i].editableBak != undefined)
                                $scope.acolumns[i].editable = $scope.acolumns[i].editableBak;
                        }

                        $scope.acolumns[$scope.getIndexByField('acolumns', 'erp_code')].editable = false;
                        $scope.acolumns[$scope.getIndexByField('acolumns', 'pi_no')].editable = false;
                        $scope.acolumns[$scope.getIndexByField('acolumns', 'inspection_batchno')].editable = false;

                        if (e.data.saleorder_type == '5') {
                            $scope.acolumns[$scope.getIndexByField('acolumns', 'erp_code')].editable = true;
                            $scope.acolumns[$scope.getIndexByField('acolumns', 'pi_no')].editable = true;
                            $scope.acolumns[$scope.getIndexByField('acolumns', 'inspection_batchno')].editable = true;
                        }
                    }
                },
                groupSelectsChildren: false, // one of [true, false]
                suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
                groupColumnDef: groupColumn,
                showToolPanel: false,
                checkboxSelection: function (params) {
                    var isGrouping = $scope.aoptions.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                }
            };

            $scope.check_warn_sum_id = function () {
                var aolines = $scope.gridGetData("aoptions");
                for (var i = 0; i < aolines.length; i++) {
                    if (aolines[i].warn_sum_id == undefined) {
                        BasemanService.notice("请先保存!")
                        return;
                    }
                }
                // $scope.gridSetData("Cabinetoptions", $scope.gridGetData("Cabinetoptions"));
            }

            $scope.acellchange = function () {
                var options = "aoptions"
                var _this = $(this);
                var val = _this.val();

                var nodes = $scope[options].api.getModel().rootNode.childrenAfterGroup;
                var cell = $scope[options].api.getFocusedCell()
                var field = cell.column.colDef.field;

                var boxs = $scope.gridGetData("Cabinetoptions");
                var data = nodes[cell.rowIndex].data;
                var key = [];

                if (field == "qty") {
                    data.qty = val;
                    data.printqty = data.qty
                    data.pack_style = data.qty
                    data.printxqty = data.qty
                    data.total_nw = Number(data.qty || 0) * Number(data.unit_nw || 0)
                    data.total_gw = Number(data.qty || 0) * Number(data.unit_gw || 0)
                    data.total_tj = Number(data.qty || 0) * Number(data.pack_rule || 0)
                    data.p_total_nw = data.total_nw
                    data.p_total_gw = data.total_gw
                    data.p_total_tj = data.total_tj
                    key = ["pack_style", "total_nw", "total_gw", "total_tj", "p_total_nw", "p_total_gw", "p_total_tj"]
                    $scope.set_wait_datas();
                }
                if (field == "pack_style") {
                    data.pack_style = Number(val || 0);
                    data.printxqty = data.pack_style;
                    key = ["printxqty"];
                }

                if (field == "unit_nw") {
                    data.unit_nw = Number(val || 0);
                    data.total_nw = Number(data.qty || 0) * Number(data.unit_nw || 0);
                    data.p_total_nw = data.total_nw
                    key = ["total_nw", "p_total_nw"];
                    $scope.set_line_gw_nw_pack_rule(boxs, "unit_nw", data);
                }
                if (field == "unit_gw") {
                    data.unit_gw = val;
                    data.total_gw = Number(data.qty || 0) * Number(data.unit_gw || 0);
                    data.p_total_gw = data.total_gw;
                    key = ["total_gw", "p_total_gw"];
                    $scope.set_line_gw_nw_pack_rule(boxs, "unit_gw", data);
                }
                if (field == "pack_rule") {
                    data.pack_rule = val
                    data.total_tj = Number(data.qty || 0) * Number(data.pack_rule || 0)
                    data.p_total_tj = data.total_tj
                    key = ["p_total_tj", "total_tj"]
                    $scope.set_line_gw_nw_pack_rule(boxs, "pack_rule", data);
                }
                if (field == "total_nw") {
                    data.total_nw = val
                    data.qty = Number(data.qty || 0)
                    if (data.qty == 0) {
                        data.total_nw = 0;
                        data.p_total_nw = 0
                        key = ["total_nw", "p_total_nw"]
                    } else {
                        data.unit_nw = (Number(data.total_nw) / data.qty).toFixed(2);
                        data.p_total_nw = data.total_nw
                        key = ["unit_nw", "p_total_nw"]
                        $scope.set_line_gw_nw_pack_rule(boxs, "unit_nw", data);
                    }
                }
                if (field == "total_gw") {
                    data.total_gw = val
                    data.qty = Number(data.qty || 0)
                    if (data.qty == 0) {
                        data.total_gw = 0;
                        data.p_total_gw = 0
                        key = ["total_gw", "p_total_gw"];
                    } else {
                        data.unit_gw = (Number(data.total_gw) / data.qty).toFixed(2);
                        data.p_total_gw = data.total_gw
                        key = ["unit_gw", "p_total_gw"];
                        $scope.set_line_gw_nw_pack_rule(boxs, "unit_gw", data);
                    }
                }
                if (field == "total_tj") {
                    data.total_tj = val
                    data.qty = Number(data.qty || 0)
                    if (data.qty == 0) {
                        data.total_tj = 0;
                        data.p_total_tj = 0
                        key = ["total_tj", "p_total_tj"];
                    } else {
                        data.pack_rule = (Number(data.total_tj) / data.qty).toFixed(3);
                        data.p_total_tj = data.total_tj
                        key = ["pack_rule", "p_total_tj"];
                        $scope.set_line_gw_nw_pack_rule(boxs, "pack_rule", data);
                    }
                }

                $scope[options].api.refreshCells(nodes, key);
            }

            $scope.set_line_gw_nw_pack_rule = function (boxs, columnName, data) {
                var line_totalcolumn = "", box_column = "";
                var p_column = "";
                var columnValue = data[columnName];
                if (columnName == "pack_rule") {
                    line_totalcolumn = "total_tj";
                    box_column = "total_pack_rule";
                } else if (columnName == "unit_gw") {
                    line_totalcolumn = "total_gw";
                    box_column = "total_unit_gw";
                } else if (columnName == "unit_nw") {
                    line_totalcolumn = "total_nw";
                    box_column = "total_unit_nw";
                }
                p_column = "p_" + line_totalcolumn;
                for (var j = 0; j < boxs.length; j++) {
                    var boxline = boxs[j].sale_ship_warn_line_sumofsale_ship_warn_box_lines;
                    var totalNumber = 0;
                    for (var i = 0; i < boxline.length; i++) {
                        if (boxline[i].warn_sum_id == data.warn_sum_id) {
                            boxline[i][columnName] = columnValue;
                            boxline[i][line_totalcolumn] = boxline[i][columnName] * boxline[i].qty;
                            boxline[i][p_column] = boxline[i][line_totalcolumn];
                        }
                        totalNumber += Number(boxline[i][line_totalcolumn]);
                    }
                    boxs[j][box_column] = totalNumber.toFixed(4);
                }
                $scope["Cabinetoptions"].api.refreshView();
                $scope["prearroptions"].api.refreshView();
            }

            $scope.a_select_lc = function () {
                var itemline = $scope.gridGetRow("aoptions");
                $scope.selectlc([itemline], false, false, false);
            }

            $scope.a_copy_lc = function () {
                var item = $scope.gridGetRow("aoptions");
                if (!item) {
                    BasemanService.notice("请用鼠标选中一行");
                }
                var items = $scope.gridGetData("aoptions");
                for (var i = 0; i < items.length; i++) {
                    if (items[i].pi_id == item.pi_id) {
                        items[i].lc_bill_no = item.lc_bill_no;
                        items[i].lc_bill_id = item.lc_bill_id;
                    }
                }
                $scope.gridSetData("aoptions", items);
            }

            $scope.acolumns = [
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
                    non_empty: true
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
                    cellchange: $scope.acellchange,
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
                    cellchange: $scope.acellchange,
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
                    cellchange: $scope.acellchange,
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
                    cellchange: $scope.acellchange,
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
                    cellchange: $scope.acellchange,
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
                    cellchange: $scope.acellchange,
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
                    cellchange: $scope.acellchange,
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
                    cellchange: $scope.acellchange,
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
                    action: $scope.a_select_lc,
                }];
        }

        //fissoptions
        {
            $scope.checkHavePart = function () {
                var havePart = false;
                var data = $scope.gridGetData('aoptions');
                for (var i = 0; i < data.length; i++) {
                    if (data[i].line_type == '4') {
                        havePart = true;
                        break;
                    }
                }
                return havePart;
            }

            /**增加行*/
            $scope.addpartitem = function () {
                if ($scope.checkHavePart) {
                    $scope.gridAddItem('fissoptions', {});
                } else {
                    BasemanService.notice("没有配件")
                }
            }
            $scope.fisscellchange = function () {
                var _this = $(this);
                var val = _this.val();

                var nodes = $scope.fissoptions.api.getModel().rootNode.childrenAfterGroup;
                var cell = $scope.fissoptions.api.getFocusedCell()
                var field = cell.column.colDef.field;

                var data = nodes[cell.rowIndex].data;
                var key = [];

                if (field == "qty") {
                    data.qty = val;
                    data.printqty = data.qty;
                    data.amt = Number(data.qty || 0) * Number(data.price || 0)
                    data.total_gw = Number(data.qty || 0) * Number(data.unit_gw || 0)
                    data.total_nw = Number(data.qty || 0) * Number(data.unit_nw || 0)
                    data.total_tj = Number(data.qty || 0) * Number(data.pack_rule || 0)
                    data.p_total_nw = data.total_nw
                    data.p_total_gw = data.total_gw
                    data.p_total_tj = data.total_tj
                    key = ["printqty", "amt", "total_gw", "total_tj", "p_total_nw", "p_total_gw", "p_total_tj"]
                }
                if (field == "pack_qty") {
                    data.pack_qty = Number(val || 0)
                    data.printxqty = data.pack_qty
                    key = ["printxqty"]
                }

                if (field == "unit_nw") {
                    data.unit_nw = Number(val || 0)
                    data.total_nw = Number(data.qty || 0) * Number(data.unit_nw || 0)
                    data.p_total_nw = data.total_nw
                    key = ["total_nw", "p_total_nw"]
                }
                if (field == "unit_gw") {
                    data.unit_gw = val
                    data.total_gw = Number(data.qty || 0) * Number(data.unit_gw || 0)
                    data.p_total_gw = data.total_gw
                    key = ["total_gw", "p_total_gw"]
                }

                if (field == "pack_rule") {
                    data.pack_rule = val
                    data.total_tj = Number(data.qty || 0) * Number(data.pack_rule || 0)
                    data.p_total_tj = data.total_tj
                    key = ["p_total_tj", "total_tj"]
                }

                if (field == "total_nw") {
                    data.total_nw = val
                    data.qty = Number(data.qty || 0)
                    if (data.qty == 0) {
                        data.total_nw = 0;
                        data.p_total_nw = 0
                        key = ["total_nw", "p_total_nw"]
                    } else {
                        data.unit_nw = (Number(data.total_nw) / data.qty).toFixed(2);
                        data.p_total_nw = data.total_nw
                        key = ["unit_nw", "p_total_nw"]
                    }
                }


                if (field == "total_gw") {
                    data.total_gw = val
                    data.qty = Number(data.qty || 0)
                    if (data.qty == 0) {
                        data.total_gw = 0;
                        data.p_total_gw = 0
                        key = ["total_gw", "p_total_gw"];
                    } else {
                        data.unit_gw = (Number(data.total_gw) / data.qty).toFixed(2);
                        data.p_total_gw = data.total_gw
                        key = ["unit_gw", "p_total_gw"];
                    }
                }


                if (field == "total_tj") {
                    data.total_tj = val
                    data.qty = Number(data.qty || 0)
                    if (data.qty == 0) {
                        data.total_tj = 0;
                        data.p_total_tj = 0
                        key = ["total_tj", "p_total_tj"];
                    } else {
                        data.pack_rule = (Number(data.total_tj) / data.qty).toFixed(2);
                        data.p_total_tj = data.total_tj
                        key = ["pack_rule", "p_total_tj"];
                    }
                }

                $scope.fissoptions.api.refreshCells(nodes, key);
            }


            $scope.fissoptions = {
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
                    var isGrouping = $scope.fissoptions.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                }
            };

            $scope.fisscolumns = [
                {
                    headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "PI号",
                    field: "pi_no",
                    editable: true,
                    filter: 'set',
                    width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "生产单号",
                    field: "prod_no",
                    editable: true,
                    filter: 'set',
                    width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "AB票",
                    field: "ab_votes",
                    editable: true,
                    filter: 'set',
                    width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "配件描述",
                    field: "part_desc",
                    editable: true,
                    filter: 'set',
                    width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
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
                    headerName: "数量",
                    field: "qty",
                    editable: true,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.fisscellchange,
                }, {
                    headerName: "价格",
                    field: "price",
                    editable: true,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.fisscellchange,
                }, {
                    headerName: "金额",
                    field: "amt",
                    editable: true,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.fisscellchange,
                }, {
                    headerName: "单位毛重",
                    field: "unit_gw",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.fisscellchange,
                }, {
                    headerName: "单位净重",
                    field: "unit_nw",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.fisscellchange,
                }, {
                    headerName: "单位体积",
                    field: "pack_rule",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.fisscellchange,
                }, {
                    headerName: "总毛重",
                    field: "total_gw",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.fisscellchange,
                }, {
                    headerName: "总净重",
                    field: "total_nw",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.fisscellchange,
                }, {
                    headerName: "总体积",
                    field: "total_rule",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.fisscellchange,
                }, {
                    headerName: "打印总毛重",
                    field: "p_total_gw",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "打印总净重",
                    field: "p_total_nw",
                    editable: true,
                    filter: 'set',
                    width: 120,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "打印总体积",
                    field: "p_total_rule",
                    editable: true,
                    filter: 'set',
                    width: 120,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }];
        }

        //Cabinetoptions
        {
            $scope.autogeneratebox = function () {
                var gridData = $scope.gridGetData("Cabinetoptions");
                BasemanService.RequestPost("sale_ship_warn_header", "createitemlineno", {box_nos: gridData.length})
                    .then(function (data) {
                        var result = data.sale_ship_warn_lineofsale_ship_warn_headers;
                        for (var i = 0; i < gridData.length; i++) {
                            if (gridData[i].ref_box_no == "" || gridData[i].ref_box_no == undefined) {
                                gridData[i].ref_box_no = result[i].ref_box_no;
                            }
                        }
                        $scope.gridSetData("Cabinetoptions", gridData);
                    })
                $scope.data.currItem.box_qty = gridData.length;
            }

            $scope.rowClicked = function (e) {
                if (e == undefined) {
                    var forcusRow = $scope.gridGetRow('Cabinetoptions');
                    if (!forcusRow) {
                        $scope.gridSetData('prearroptions', []);
                        $scope.set_wait_datas();
                        return;
                    }
                    $scope.gridSetData('prearroptions', forcusRow.sale_ship_warn_line_sumofsale_ship_warn_box_lines);
                    $scope.set_wait_datas();
                    return
                }
                if (e.data) {
                    if (e.data.sale_ship_warn_line_sumofsale_ship_warn_box_lines == undefined) {
                        e.data.sale_ship_warn_line_sumofsale_ship_warn_box_lines = []
                    }
                    $scope.gridSetData('prearroptions', e.data.sale_ship_warn_line_sumofsale_ship_warn_box_lines);
                }
                // $scope.calBoxline(e.data);//切换行的时候不重新计算件数
                $scope.partSummary();
                $scope.set_wait_datas();
            }
            $scope.cabDelLine = function () {
                var forcusRow = $scope.gridGetRow('Cabinetoptions');
                var boxs = $scope.gridGetData("Cabinetoptions");
                if (boxs.length == 0) {
                    return;
                }
                if (!forcusRow) {
                    forcusRow = boxs[boxs.length - 1];
                    $scope.gridSetData("prearroptions", []);
                }
                var nodes = $scope.gridGetNodes("packageoptions");
                for (var i = 0; i < nodes.length; i++) {
                    if (forcusRow.ref_box_no == nodes[i].data.ref_box_no) {
                        nodes[i].data.box_seq = '';
                        nodes[i].data.pi_box_id = '';
                        nodes[i].data.ref_box_no = '';
                        nodes[i].data.box_type = '';
                        nodes[i].data.ab_votes = '';
                    }
                }
                $scope["packageoptions"].api.refreshCells(nodes, ["box_seq", "pi_box_id", "ref_box_no", "box_type", "ab_votes"]);
                $scope.gridDelItem('Cabinetoptions', "seq", true);
                $scope.set_wait_datas();
            }

            $scope.calboxlineAll = function () {
                var boxlines = $scope.gridGetData("Cabinetoptions");
                for (var m = 0; m < boxlines.length; m++) {
                    var total_pack_rule = 0, total_unit_gw = 0, total_unit_nw = 0, pack_style = 0;
                    var datas = boxlines[m].sale_ship_warn_line_sumofsale_ship_warn_box_lines
                    for (var i = 0; i < datas.length; i++) {
                        total_pack_rule += Number(datas[i].total_tj);
                        total_unit_gw += Number(datas[i].unit_gw);
                        total_unit_nw += Number(datas[i].unit_nw);
                        pack_style += Number(datas[i].pack_style);
                    }
                    boxlines[m].pack_style = pack_style;
                    boxlines[m].total_pack_rule = total_pack_rule;
                    boxlines[m].total_unit_gw = total_unit_gw;
                    boxlines[m].total_unit_nw = total_unit_nw;
                }
                $scope.gridSetData("Cabinetoptions", boxlines)
            }

            $scope.Cabinetoptions = {
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
                rowClicked: $scope.rowClicked,
                groupSelectsChildren: false, // one of [true, false]
                suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
                groupColumnDef: groupColumn,
                showToolPanel: false,
                checkboxSelection: function (params) {
                    var isGrouping = $scope.Cabinetoptions.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                }
            };


            $scope.Cabinetcolumns = [
                {
                    headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "柜型", field: "box_type", editable: true, filter: 'set', width: 60,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellEditorParams: {values: []},
                }, {
                    headerName: "参考柜号", field: "ref_box_no",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "总体积", field: "total_pack_rule",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "总毛重", field: "total_unit_gw",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "总净重", field: "total_unit_nw",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "总件数", field: "total_xqty",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "运费对应PI", field: "box_pi_no",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "海运费", field: "amt_fee1",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "保险费", field: "amt_fee2",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }];
        }

        $scope.getmaxseq = function (sums, yes) {
            var maxseq = 0;
            for (var i = 0; i < sums.length; i++) {
                if (sums[i].seq > maxseq) {
                    maxseq = sums[i].seq
                }
            }
            for (var i = 0; i < yes.length; i++) {
                if (yes[i].seq > maxseq) {
                    maxseq = yes[i].seq
                }
            }
            return maxseq + 1
        }

        //prearroptions
        {
            $scope.delprearr = function () {
                var forcusRow = $scope.gridGetRow('Cabinetoptions');
                var selectDatas = $scope.selectGridGetData('prearroptions');
                if (selectDatas.length == 0) {
                    BasemanService.notice("请勾选需要删除的行!");
                    return;
                }
                if (forcusRow.box_type == "" || forcusRow.box_type == undefined) {
                    var ref_box_no = selectDatas[0].ref_box_no;
                    var data = $scope.gridGetData("Cabinetoptions");
                    for (var i = 0; i < data.length; i++) {
                        if (ref_box_no == data[i].ref_box_no) {
                            forcusRow = data[i];
                            $scope["Cabinetoptions"].api.setFocusedCell(i, "box_type");
                            break;
                        }
                    }
                }
                $scope.selectGridDelItem('prearroptions');
                forcusRow.sale_ship_warn_line_sumofsale_ship_warn_box_lines = $scope.gridGetData('prearroptions');
                $scope.gridUpdateRow('Cabinetoptions', forcusRow);
                $scope.calBoxline(forcusRow);
                $scope.set_wait_datas();
            }


            $scope.copyitem = function () {
                $scope.autogeneratebox();
                var warnitems = $scope.selectGridGetData('prearroptions');
                if (warnitems.length < 1) {
                    BasemanService.notice("没有选中复制行!")
                    return;
                }
                var boxlines_Bak = $scope.gridGetData("Cabinetoptions");
                if ($scope['Cabinetoptions'].api.getFocusedCell() == null) {
                    index = 0;
                } else {
                    index = $scope['Cabinetoptions'].api.getFocusedCell().rowIndex;
                }

                var boxlines = [];
                var j = 0;
                for (var i = 0; i < boxlines_Bak.length; i++) { //将进入弹出框的数据同boxlines绑定
                    if (i != index) {
                        boxlines[j] = boxlines_Bak[i]
                        j++;
                    }
                }

                $scope.FrmInfo = {
                    title: '复制排柜明细到',
                    datas: boxlines,
                    options: {},
                    type: 'checkbox',
                    columns: [{}],
                }
                HczyCommon.copyobj($scope.Cabinetoptions, $scope.FrmInfo.options)

                HczyCommon.copyobj($scope.Cabinetcolumns, $scope.FrmInfo.columns)

                BasemanService.openFrm("views/commonline.html", commonline, $scope, "", "lg").result
                    .then(function (data) {
                        $scope.FrmInfo.columns[0].checkboxSelection = undefined;
                        if (data.length == 0) {
                            return;
                        }
                        var sums = $scope.gridGetData('boxsumoptions');
                        var sumslength = sums.length;
                        for (var n = 0; n < data.length; n++) {
                            var isexists = false
                            var preData = data[n].sale_ship_warn_line_sumofsale_ship_warn_box_lines || [];
                            var prelength = preData.length;
                            for (var i = 0; i < warnitems.length; i++) {
                                var intoObj = {};
                                for (var name in warnitems[i]) {
                                    intoObj[name] = warnitems[i][name]
                                }
                                HczyCommon.copyobj(warnitems[i], intoObj);
                                for (var j = 0; j < prelength; j++) {
                                    var compareObj = preData[j];
                                    if (intoObj.warn_sum_id == compareObj.warn_sum_id) {
                                        isexists = true;
                                        compareObj = HczyCommon.stringPropToNum(compareObj)
                                        intoObj = HczyCommon.stringPropToNum(intoObj)
                                        compareObj.qty += intoObj.qty;
                                        compareObj.pack_style += intoObj.pack_style;
                                        compareObj.total_gw = compareObj.qty * compareObj.unit_gw;
                                        compareObj.total_nw = compareObj.qty * compareObj.unit_nw;
                                        compareObj.total_tj = compareObj.qty * compareObj.pack_rule;
                                        compareObj.p_total_gw = compareObj.total_gw;
                                        compareObj.p_total_nw = compareObj.total_nw;
                                        compareObj.p_total_tj = compareObj.total_tj;
                                    }
                                }
                                if (!isexists) {
                                    intoObj.pi_box_id = data[n].pi_box_id;
                                    intoObj.box_seq = data[n].seq;
                                    intoObj.ref_box_no = data[n].ref_box_no;
                                    intoObj.warn_line_id = 0;

                                    intoObj = HczyCommon.stringPropToNum(intoObj)
                                    intoObj.total_gw = intoObj.qty * intoObj.unit_gw;
                                    intoObj.total_nw = intoObj.qty * intoObj.unit_nw;
                                    intoObj.total_tj = intoObj.qty * intoObj.pack_rule;
                                    intoObj.p_total_gw = intoObj.total_gw;
                                    intoObj.p_total_nw = intoObj.total_nw;
                                    intoObj.p_total_tj = intoObj.total_tj;
                                    preData.push(intoObj);
                                }

                                //放入排柜明细汇总
                                if (!isexists) {
                                    sums.push(intoObj);
                                } else {
                                    for (var j = 0; j < sumslength; j++) {
                                        var compareObj = sums[j];
                                        if (intoObj.warn_sum_id == compareObj.warn_sum_id && compareObj.box_seq == data[n].seq) {
                                            compareObj = HczyCommon.stringPropToNum(compareObj)
                                            intoObj = HczyCommon.stringPropToNum(intoObj)
                                            compareObj.qty += intoObj.qty;
                                            compareObj.pack_style += intoObj.pack_style;
                                            compareObj.total_gw = compareObj.qty * compareObj.unit_gw;
                                            compareObj.total_nw = compareObj.qty * compareObj.unit_nw;
                                            compareObj.total_tj = compareObj.qty * compareObj.pack_rule;
                                            compareObj.p_total_gw = compareObj.total_gw;
                                            compareObj.p_total_nw = compareObj.total_nw;
                                            compareObj.p_total_tj = compareObj.total_tj;
                                            break;
                                        }
                                    }
                                }
                            }
                            data[n].sale_ship_warn_line_sumofsale_ship_warn_box_lines = preData
                        }
                        $scope.calboxlineAll();
                        $scope.gridSetData("boxsumoptions", sums, "seq1");
                        $scope.set_wait_datas();
                    })

            }


            $scope.mixCol = function (e) {
                var labelTxt = e.target.innerText.replace(/(^\s*)|(\s*$)/g, "");
                if (labelTxt == "冻结列") {
                    $scope["prearroptions"].columnApi.setColumnPinned("seq", "left")
                    $scope["prearroptions"].columnApi.setColumnPinned("pi_no", "left")
                    $scope["prearroptions"].columnApi.setColumnPinned("pro_type", "left")
                    e.target.innerText = "解除冻结"
                } else if (labelTxt == "解除冻结") {
                    $scope["prearroptions"].columnApi.setColumnPinned("seq", null)
                    $scope["prearroptions"].columnApi.setColumnPinned("pi_no", null)
                    $scope["prearroptions"].columnApi.setColumnPinned("pro_type", null)
                    e.target.innerText = "冻结列"
                }
            }
            $scope.precellchange = function () {
                var options = "prearroptions"
                var _this = $(this);
                var val = _this.val();

                var nodes = $scope[options].api.getModel().rootNode.childrenAfterGroup;
                var cell = $scope[options].api.getFocusedCell()
                var field = cell.column.colDef.field;

                var data = nodes[cell.rowIndex].data;
                var key = [];

                if (field == "qty") {
                    if (Number(val || 0) + Number(data.warned_qty || 0) > Number(data.prod_qty || 0) && data.add_row != '2') {
                        BasemanService.notice("此次出货预告数量大于生产单数量-已出货预告数量!");
                        val = Number(data.prod_qty || 0) - Number(data.warned_qty || 0);
                    }
                    data.qty = val;
                    if (data.qty_bak == undefined) {
                        data.qty_bak = data.qty;
                    }
                    data.printqty = data.qty;
                    data.pack_style = data.qty;
                    data.printxqty = data.qty;
                    data.total_nw = Number(data.qty || 0) * Number(data.unit_nw || 0);
                    data.total_gw = Number(data.qty || 0) * Number(data.unit_gw || 0);
                    data.total_tj = Number(data.qty || 0) * Number(data.pack_rule || 0);
                    data.p_total_nw = data.total_nw;
                    data.p_total_gw = data.total_gw;
                    data.p_total_tj = data.total_tj;
                    key = ["printqty", "printxqty", "pack_style", "total_nw", "total_gw", "total_tj", "p_total_nw", "p_total_gw", "p_total_tj"];
                    $scope.set_wait_datas();
                }

                if (field == "total_gw" || field == "total_nw" || field == "total_tj") {
                    var pfield = "p_" + field;
                    data[field] = val
                    data[pfield] = data[field];
                    key = [pfield, field];
                }
                $scope[options].api.refreshCells(nodes, key);
                $scope.calBoxline();
            }

            $scope.set_wait_datas = function () {
                var boxs = $scope.gridGetData("Cabinetoptions");
                var sums = [];
                for (var i = 0; i < boxs.length; i++) {
                    if (boxs[i].sale_ship_warn_line_sumofsale_ship_warn_box_lines == undefined) {
                        continue;
                    }
                    for (var j = 0; j < boxs[i].sale_ship_warn_line_sumofsale_ship_warn_box_lines.length; j++) {
                        sums.push(boxs[i].sale_ship_warn_line_sumofsale_ship_warn_box_lines[j]);
                    }
                }
                $scope.gridSetData("boxsumoptions", sums, "seq1");
                for (var i = 0; i < sums.length; i++) {
                    sums[i].isadd = false;
                }
                var waitdatas = [];
                for (var i = 0; i < sums.length; i++) {
                    if (sums[i].isadd) {
                        continue;
                    }
                    sums[i].isadd = true;
                    var obj = {}
                    for (var name in sums[i]) {
                        obj[name] = sums[i][name];
                    }
                    for (var j = 0; j < sums.length; j++) {
                        if (sums[j].isadd) {
                            continue;
                        }
                        if (sums[j].warn_sum_id == obj.warn_sum_id) {
                            sums[j].isadd = true;
                            obj = HczyCommon.stringPropToNum(obj);
                            sums[j] = HczyCommon.stringPropToNum(sums[j]);
                            obj.qty += sums[j].qty;
                        }
                    }
                    waitdatas.push(obj);
                }
                var waits = [];
                var itemlines = $scope.gridGetData("aoptions");
                var is_in_pre = false;
                for (var i = 0; i < itemlines.length; i++) {
                    is_in_pre = false;
                    for (var j = 0; j < waitdatas.length; j++) {
                        if (itemlines[i].warn_sum_id == waitdatas[j].warn_sum_id) {
                            if (Number(waitdatas[j].qty) < Number(itemlines[i].qty)) {
                                var objtemp = {};
                                waits[waits.length] = objtemp//将待排柜与产品明细分开
                                for (var name in itemlines[i]) {
                                    objtemp[name] = itemlines[i][name];
                                }
                                objtemp.qty = Number(itemlines[i].qty || 0) - Number(waitdatas[j].qty || 0);
                                objtemp.printqty = objtemp.qty;
                                objtemp.pack_style = objtemp.qty;
                                objtemp.printxqty = objtemp.qty;
                                objtemp.total_nw = Number(waitdatas[j].qty || 0) * Number(waitdatas[j].unit_nw || 0);
                                objtemp.total_gw = Number(waitdatas[j].qty || 0) * Number(waitdatas[j].unit_gw || 0);
                                objtemp.total_tj = Number(waitdatas[j].qty || 0) * Number(waitdatas[j].pack_rule || 0);
                                objtemp.p_total_nw = waitdatas[j].total_nw;
                                objtemp.p_total_gw = waitdatas[j].total_gw;
                                objtemp.p_total_tj = waitdatas[j].total_tj;
                            }
                            is_in_pre = true;
                            break;
                        }
                    }
                    if (is_in_pre) {
                        continue;
                    }
                    waits[waits.length] = {};//将待排柜与产品明细分开
                    for (var name in itemlines[i]) {
                        waits[waits.length - 1][name] = itemlines[i][name];
                    }
                }
                $scope.gridSetData("waitarroptions", waits);

            }

            $scope.prearroptions = {
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
                    var isGrouping = $scope.prearroptions.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                }
            };


            $scope.prearrcolumns = [
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
                    headerName: "参考柜号",
                    field: "ref_box_no",
                    editable: false,
                    filter: 'set',
                    width: 90,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "出货预告数量",
                    field: "qty",
                    editable: true,
                    filter: 'set',
                    width: 130,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.precellchange,
                }, {
                    headerName: "件数", field: "pack_style",
                    editable: true,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.precellchange,
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
                    headerName: "客户产品名称",
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
                    headerName: "ERP产品编码",
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
                    headerName: "商检批号",
                    field: "inspection_batchno",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "排产单数量",
                    field: "prod_qty",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "托数",
                    field: "mt_qty",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "包装类型",
                    field: "pack_type",
                    editable: false,
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
                    headerName: "单位毛重",
                    field: "unit_gw",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.precellchange,
                }, {
                    headerName: "单位净重",
                    field: "unit_nw",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.precellchange,
                }, {
                    headerName: "单位体积",
                    field: "pack_rule",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellchange: $scope.precellchange,
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
                    cellchange: $scope.precellchange,
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
                    cellchange: $scope.precellchange,
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
                    cellchange: $scope.precellchange,
                }, {
                    headerName: "唛头",
                    field: "marks",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "导出数量",
                    field: "printqty",
                    editable: false,
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
                    editable: false,
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
                    editable: false,
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
                    editable: false,
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
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "是否需要商检",
                    field: "is_needsj",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellEditorParams: {
                        values: [
                            {
                                value: 1,
                                desc: "否"
                            }, {
                                value: 2,
                                desc: "是"
                            }],
                    },
                }, {
                    headerName: "排产单号",
                    field: "prod_no",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
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
                    headerName: "型号",
                    field: "spec",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "报关价",
                    field: "bg_price",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "销售价",
                    field: "price",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "工厂结算价",
                    field: "settle_price",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "工厂结算价",
                    field: "settle_price",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "工厂结算价",
                    field: "settle_price",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "产品大类名称",
                    field: "item_type_name",
                    editable: false,
                    filter: 'set',
                    width: 100,
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
                        values: [],
                    }
                }, {
                    headerName: "报关贸易类型",
                    field: "bg_trade_type",
                    editable: false,
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
                }];
        }

        //waitarroptions
        {
            //装入
            $scope.load = function () {
                var aolines = $scope.gridGetData("aoptions");
                for (var i = 0; i < aolines.length; i++) {
                    if (aolines[i].warn_sum_id == undefined) {
                        BasemanService.notice("请先保存!")
                        return;
                    }
                }
                var focusRow = $scope.gridGetRow('Cabinetoptions', "First");
                if (focusRow.box_type == "" || focusRow.box_type == undefined) {
                    BasemanService.notice("请先选择柜型!");
                    return;
                }
                var waitSelectedData = $scope.selectGridGetData('waitarroptions');
                var preData = $scope.gridGetData('prearroptions');
                var prelength = preData.length;
                var isexists = false
                for (var i = 0; i < waitSelectedData.length; i++) {
                    var intoObj = {};
                    for (var name in waitSelectedData[i]) {
                        intoObj[name] = waitSelectedData[i][name];
                    }
                    for (var j = 0; j < prelength; j++) {
                        var compareObj = preData[j];
                        if (intoObj.warn_sum_id == compareObj.warn_sum_id) {
                            isexists = true;
                            compareObj = HczyCommon.stringPropToNum(compareObj)
                            intoObj = HczyCommon.stringPropToNum(intoObj)
                            compareObj.qty += intoObj.qty;
                            compareObj.pack_style += intoObj.pack_style;
                            compareObj.total_gw = compareObj.qty * compareObj.unit_gw;
                            compareObj.total_nw = compareObj.qty * compareObj.unit_nw;
                            compareObj.total_tj = compareObj.qty * compareObj.pack_rule;
                            compareObj.p_total_gw = compareObj.total_gw;
                            compareObj.p_total_nw = compareObj.total_nw;
                            compareObj.p_total_tj = compareObj.total_tj;
                            break;
                        }
                    }
                    if (!isexists) {
                        intoObj.pi_box_id = focusRow.pi_box_id;
                        intoObj.box_seq = focusRow.seq;
                        intoObj.ref_box_no = focusRow.ref_box_no;

                        intoObj = HczyCommon.stringPropToNum(intoObj)
                        intoObj.total_gw = intoObj.qty * intoObj.unit_gw;
                        intoObj.total_nw = intoObj.qty * intoObj.unit_nw;
                        intoObj.total_tj = intoObj.qty * intoObj.pack_rule;
                        intoObj.p_total_gw = intoObj.total_gw;
                        intoObj.p_total_nw = intoObj.total_nw;
                        intoObj.p_total_tj = intoObj.total_tj;
                        preData.push(intoObj);
                    }

                }

                focusRow.sale_ship_warn_line_sumofsale_ship_warn_box_lines = preData
                $scope.gridUpdateRow('Cabinetoptions', focusRow);
                $scope.gridSetData('prearroptions', preData);
                $scope.set_wait_datas();
                $scope.calBoxline(focusRow);
            }

            $scope.calBoxline = function (focusRow) {
                $scope.partSummary();
                if (focusRow == undefined) {
                    focusRow = $scope.gridGetRow('Cabinetoptions') || $scope.gridGetData('Cabinetoptions')[0];
                }
                var datas = focusRow.sale_ship_warn_line_sumofsale_ship_warn_box_lines;
                var total_pack_rule = 0, total_unit_gw = 0, total_unit_nw = 0, pack_style = 0;
                for (var i = 0; i < datas.length; i++) {
                    total_pack_rule += Number(datas[i].total_tj);
                    total_unit_gw += Number(datas[i].total_gw);
                    total_unit_nw += Number(datas[i].total_nw);
                    pack_style += Number(datas[i].pack_style);
                }
                focusRow.pack_style = pack_style.toFixed(2);
                focusRow.total_pack_rule = total_pack_rule.toFixed(3);
                focusRow.total_unit_gw = total_unit_gw.toFixed(3);
                focusRow.total_unit_nw = total_unit_nw.toFixed(3);

                var nodes = $scope['Cabinetoptions'].api.getModel().rootNode.allLeafChildren;
                var key = ["seq", "total_pack_rule", "pack_style", "total_unit_gw", "total_unit_nw", "amt_fee1", "amt_fee2"];
                $scope["Cabinetoptions"].api.refreshCells(nodes, key);
            }


            $scope.waitarroptions = {
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
                    var isGrouping = $scope.waitarroptions.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                }
            };

            $scope.waitarrcolumns = [
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
                    headerName: "PI号", field: "pi_no",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "客户机型", field: "cust_item_name",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "机型类别", field: "pro_type",
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
                    headerName: "出货预告数量", field: "qty",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "工厂型号编码", field: "item_h_code",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "AB票", field: "ab_votes",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    headerCssClass: 'not-null',
                }, {
                    headerName: "ERP产品编码", field: "erp_code",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    headerCssClass: 'not-null',
                }, {
                    headerName: "商检批号", field: "inspection_batchno",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "产品名称", field: "item_name",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "成品型号", field: "item_model",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "实际发货通知数量", field: "actual_notice_qty",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "排产单数量", field: "prod_qty",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "工厂型号", field: "spec",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "参考柜号", field: "ref_box_no",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "实际柜号", field: "actual_box_no",
                    editable: true,
                    filter: 'set',
                    width: 80,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "报关价", field: "bg_price",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "单位", field: "uom",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "件数", field: "pack_style",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "单位体积", field: "pack_rule",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "单位毛重", field: "unit_gw",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "单位净重", field: "unit_nw",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "整机名称", field: "item_h_name",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "包装类型", field: "pack_type",
                    editable: false,
                    filter: 'set',
                    width: 80,
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
                    }
                }, {
                    headerName: "是否已报关", field: "is_bg",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellEditorParams: {
                        values: [
                            {
                                value: 0,
                                desc: "否"
                            },
                            {
                                value: 1,
                                desc: "否"
                            }, {
                                value: 2,
                                desc: "是"
                            }],
                    },
                }, {
                    headerName: "是否需要商检", field: "is_needsj",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellEditorParams: {
                        values: [
                            {
                                value: 0,
                                desc: "否"
                            },
                            {
                                value: 1,
                                desc: "否"
                            }, {
                                value: 2,
                                desc: "是"
                            }],
                    },
                }, {
                    headerName: "备注", field: "note",
                    editable: false,
                    filter: 'set',
                    width: 200,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }];
        }

        //boxsumoptions
        {
            $scope.boxsumoptions = {
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
                    var isGrouping = $scope.boxsumoptions.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                }
            };

            $scope.boxsumcolumns = [
                {
                    headerName: "序号", field: "seq1", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "出货预告单号", field: "warn_no",
                    editable: false,
                    filter: 'set',
                    width: 135,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "PI号", field: "pi_no",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "客户机型", field: "cust_item_name",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "整机编码", field: "item_h_code",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "机型类别", field: "pro_type",
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
                    headerCssClass: 'not-null',
                }, {
                    headerName: "客户机型", field: "cust_item_name",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "客户产品名称", field: "cust_spec",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "ERP产品编码", field: "erp_code",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "铭牌编号", field: "plate_code",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    headerCssClass: 'not-null',
                }, {
                    headerName: "商检批号", field: "inspection_batchno",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    headerCssClass: 'not-null',
                }, {
                    headerName: "排柜序号", field: "box_seq",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "参考柜号", field: "ref_box_no",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "商检批号", field: "inspection_batchno",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "排柜序号", field: "box_seq",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    headerCssClass: 'not-null',
                }, {
                    headerName: "参考柜号", field: "ref_box_no",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "此次出货预告数量", field: "qty",
                    editable: false,
                    filter: 'set',
                    width: 120,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "排产单数量", field: "prod_qty",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "箱数", field: "pack_style",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "整数框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "总毛重", field: "total_gw",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "总净重", field: "total_nw",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "总体积", field: "total_tj",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }];
        }

        //packageoptions
        {
            $scope.addtobox = function () {
                var selectdata = $scope.selectGridGetData('packageoptions');
                if (selectdata.length == 0) {
                    BasemanService.notice("没有选中需装柜的包装箱!");
                    return;
                }

                var boxline = $scope.gridGetData('Cabinetoptions');
                for (var i = 0; i < boxline.length; i++) {
                    if (boxline[i].ref_box_no == undefined || boxline[i].ref_box_no == '') {
                        BasemanService.notice("请生成参考柜号!");
                        return;
                    }
                }

                $scope.FrmInfo = {
                    title: '装入柜',
                    options: {},
                    datas: $scope.gridGetData('Cabinetoptions'),
                    columns: [],
                    type: 'checkbox'
                }
                HczyCommon.copyobj($scope.Cabinetoptions, $scope.FrmInfo.options)
                HczyCommon.copyobj($scope.Cabinetcolumns, $scope.FrmInfo.columns)
                BasemanService.openFrm("views/commonline.html", commonline, $scope, "", "lg").result
                    .then(function (result) {
                        $scope.FrmInfo.columns[0].checkboxSelection = undefined;
                        if (result.length != 1) {
                            if (result.length > 1) BasemanService.notice("选择且只能选择一个柜!")
                            return;
                        }
                        var datas = $scope.gridGetData('packageoptions')
                        var nodes = $scope.packageoptions.api.getModel().rootNode.allLeafChildren;
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodes[i].selected) {
                                datas[i].box_seq = result[0].seq;
                                datas[i].pi_box_id = result[0].pi_box_id;
                                datas[i].ref_box_no = result[0].ref_box_no;
                                datas[i].box_type = result[0].box_type;
                                datas[i].ab_votes = result[0].ab_votes;
                                nodes[i].setSelected(false);
                            }
                        }
                        $scope.gridSetData('packageoptions', datas);
                        $scope.set_wait_datas();
                    })
            }
            $scope.delfrombox = function () {
                var selectdata = $scope.selectGridGetData('packageoptions');
                if (selectdata.length == 0) {
                    BasemanService.notice("没有选中取消装柜的包装箱!");
                    return;
                }

                var datas = $scope.gridGetData('packageoptions')

                var nodes = $scope.packageoptions.api.getModel().rootNode.allLeafChildren;
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].selected) {
                        datas[i].box_seq = '';
                        datas[i].pi_box_id = '';
                        datas[i].ref_box_no = '';
                        datas[i].box_type = '';
                        datas[i].ab_votes = '';
                        nodes[i].setSelected(false);
                    }
                }
                $scope.gridSetData('packageoptions', datas)

            }
            $scope.package_code2ShowF = function () {
                $scope.package_code2Show = !$scope.package_code2Show;
            }
            $scope.getPackage_code = function () {
                $scope.package_code2 = $scope.package_code2.replace(/(^\s*)|(\s*$)/g, "");
                if ($scope.package_code2.length == 0) {
                    return;
                }
                var package_code2 = $scope.package_code2.replace(/，/g, ",");
                package_code2 = package_code2.replace(/,,/g, ",")
                package_code2 = package_code2.replace(/\n/g, ",").replace(/,,/, ",");
                package_code2 = package_code2.replace(/,,/g, ",")
                var pack = package_code2.split(",");
                var nodes = $scope.packageoptions.api.getModel().rootNode.allLeafChildren;
                var datas = $scope.gridGetData('packageoptions')
                if (pack.length == 0 || pack[0].length == 0) {
                    return;
                }
                for (var i = 0; i < pack.length; i++) {
                    for (var j = 0; j < nodes.length; j++) {
                        if (nodes[j].data.package_code2 == pack[i]) {
                            nodes[j].setSelected(true);
                        }
                    }
                }

            }

            $scope.getsearch_packgage = function () {
                if ($scope.data.currItem.item_desc == undefined || $scope.data.currItem.item_desc == "") {
                    BasemanService.notice("请输入物料的描述信息!")
                    return;
                }

                if ($scope.data.currItem.warn_id == undefined || $scope.data.currItem.warn_id == "") {
                    BasemanService.notice("请先保存出货预告!")
                    return;
                }
                BasemanService.RequestPost("sale_ship_warn_header", "getpackage2", {
                    warn_id: $scope.data.currItem.warn_id,
                    warn_no: $scope.data.currItem.item_desc
                }).result.then(function (data) {
                    var nodes = $scope.gridGetNodes("")
                    for (var i = 0; i < data.sale_ship_warn_package_lineofsale_ship_warn_headers.length; i++) {
                        var obj = data.sale_ship_warn_package_lineofsale_ship_warn_headers[i];
                        for (var j = 0; j < nodes.length; j++) {
                            if (nodes[j].data.inspection_batchno == obj.inspection_batchno && nodes[j].data.package_code2 == obj.package_code2) {
                                nodes[j].setBackgroundColor("#f1a417");
                            }
                        }
                    }
                })
            }

            $scope.auto_box = function () {
                var packages = $scope.gridGetData("packageoptions");
                var boxlines = $scope.gridGetData("Cabinetoptions");
                var isexists2 = false;
                for (var i = 0; i < boxlines.length; i++) {
                    if (boxlines[i].ref_box_no == undefined || boxlines[i].ref_box_no == "") {
                        isexists2 = true;
                        break;
                    }
                }
                if (isexists2) {
                    BasemanService.notice("请生成参考柜号!");
                    return;
                }
                var packages = $scope.gridGetData("packageoptions");

                var i = 0;
                for (var k = 0; k < boxlines.length; k++) {
                    var seq = boxlines[k].seq,
                        pi_box_id = boxlines[k].pi_box_id,
                        ref_box_no = boxlines[k].ref_box_no,
                        box_type = boxlines[k].box_type;
                    var requestobj = BasemanService.RequestPostNoWait("cabinet_type_maxvalue", "search", {sqlwhere: " box_type=" + box_type,});
                    if (requestobj.pass) {
                        var datas = requestobj.data.cabinet_type_maxvalues
                        if (datas.length == undefined || datas.length == 0) {
                            continue;
                        }
                        var max_volume = data.cabinet_type_maxvalue[0].max_volume,
                            max_weight = data.cabinet_type_maxvalue[0].max_weight,
                            max_dj = data.cabinet_type_maxvalue[0].max_dj,
                            max_ysj = data.cabinet_type_maxvalue[0].max_ysj,
                            max_volume2 = boxlines[i].total_pack_rule,
                            max_weight2 = boxlines[i].total_unit_gw;
                        while (i < packages.length) {
                            if (packages[i].ref_box_no != undefined && packages[i].ref_box_no != "") {
                                i++;
                                continue;
                            }
                            var max_volume1 = packages[i].package_tj,
                                max_weight1 = packages[i].package_gw;
                            if ((max_volume1 + max_volume2 > max_volume) || (max_weight1 + max_weight2 > max_weight)) {
                                break;
                            }
                            packages[i].box_seq = box_seq;
                            packages[i].pi_box_id = pi_box_id;
                            packages[i].ref_box_no = ref_box_no;
                            packages[i].box_type = box_type;
                            packages[i].ab_votes = "A";
                            max_volume2 += max_volume1;
                            max_volume2 += max_weight1;
                            i++;
                        }
                    }
                    $scope.gridSetData("Cabinetoptions", boxlines);
                    $scope.gridSetData("packageoptions", packages);

                }
            }

            $scope.sale_prod_packages_earch = function (flag) {
                $scope.FrmInfo = {};
                if (flag != 1) { //双击弹出
                    var forcusdata = $scope.gridGetRow("packageoptions");
                    $scope.FrmInfo = {
                        inspection_batchno: forcusdata.inspection_batchno,
                        package_code2: forcusdata.package_code2,
                    }
                } else if (flag == 1) { //点击按钮弹出
                    var selectdata = $scope.selectGridGetData('packageoptions');
                    if (selectdata.length == 0) {
                        var griddata = $scope.gridGetData('packageoptions');
                        $scope.FrmInfo.inspection_batchno = griddata[0].inspection_batchno;
                    } else if (selectdata.length == 1) {
                        $scope.FrmInfo.inspection_batchno = selectdata[0].inspection_batchno;
                        $scope.FrmInfo.package_code2 = selectdata[0].package_code2;
                    } else {
                        $scope.FrmInfo.inspection_batchno = selectdata[0].inspection_batchno;
                    }
                }

                BasemanService.openFrm("views/saleman/sale_ship_warn_header_package_search.html", sale_prod_packages_earch, $scope, "", "lg").result
                    .then(function () {
                    })

            }

            $scope.packageoptions = {
                rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
                pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
                groupKeys: undefined,
                groupHideGroupColumns: true,
                enableColResize: true, //one of [true, false]
                enableSorting: true, //one of [true, false]
                enableFilter: true, //one of [true, false]
                enableStatusBar: false,
                enableRangeSelection: true,
                rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
                rowDeselection: true,
                quickFilterText: null,
                rowClicked: undefined,
                rowDoubleClicked: $scope.sale_prod_packages_earch,
                groupSelectsChildren: true, // one of [true, false]
                suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
                groupColumnDef: groupColumn,
                showToolPanel: false,
                checkboxSelection: function (params) {
                    var isGrouping = $scope.packageoptions.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                }
            };

            $scope.packagecolumns = [
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
                    headerName: "柜序号",
                    field: "box_seq",
                    editable: false,
                    filter: 'set',
                    width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "柜型",
                    field: "box_type",
                    editable: false,
                    filter: 'set',
                    width: 60,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    cellEditorParams: {
                        values: []
                    },
                    floatCell: true,
                }, {
                    headerName: "参考柜号",
                    field: "ref_box_no",
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
                    headerName: "生产批次",
                    field: "mo_code",
                    editable: false,
                    filter: 'set',
                    width: 100,
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
                    headerName: "成品物料描述",
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
                    headerName: "包装箱编码",
                    field: "package_code",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "包装箱条码",
                    field: "package_code2",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    headerCssClass: 'not-null',
                }, {
                    headerName: "包装箱描述",
                    field: "package_desc",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    headerCssClass: 'not-null',
                }, {
                    headerName: "毛重",
                    field: "package_gw",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "净重",
                    field: "package_nw",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "体积",
                    field: "package_tj",
                    editable: false,
                    filter: 'set',
                    width: 80,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "包装箱尺寸",
                    field: "package_rule",
                    editable: false,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    headerCssClass: 'not-null',
                }, {
                    headerName: "备注",
                    field: "note",
                    editable: false,
                    filter: 'set',
                    width: 200,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "散件ID",
                    field: "warn_package_id",
                    editable: false,
                    hide: false,
                    filter: 'set',
                    width: 40,
                    cellEditor: "文本框",
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

                if ($scope.getIndexByField('acolumns', 'saleorder_type')) {
                    $scope.acolumns[$scope.getIndexByField('acolumns', 'saleorder_type')].cellEditorParams.values = sale_order_types;
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

                if ($scope.getIndexByField('acolumns', 'line_type')) {
                    $scope.acolumns[$scope.getIndexByField('acolumns', 'line_type')].cellEditorParams.values = line_types;
                }
            });

        //需要查询--贸易类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"})
            .then(function (data) {
                var trade_types = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    trade_types[i] = {
                        value: data.dicts[i].dictvalue,
                        desc: data.dicts[i].dictname
                    };
                }

                if ($scope.getIndexByField('prearrcolumns', 'trade_type')) {
                    $scope.prearrcolumns[$scope.getIndexByField('prearrcolumns', 'trade_type')].cellEditorParams.values = trade_types;
                }
                if ($scope.getIndexByField('acolumns', 'trade_type')) {
                    $scope.acolumns[$scope.getIndexByField('acolumns', 'trade_type')].cellEditorParams.values = trade_types;
                }

                if ($scope.getIndexByField('acolumns', 'bg_trade_type')) {
                    $scope.acolumns[$scope.getIndexByField('acolumns', 'bg_trade_type')].cellEditorParams.values = trade_types;
                }
                //报关贸易类型
                if ($scope.getIndexByField('prearrcolumns', 'bg_trade_type')) {
                    $scope.prearrcolumns[$scope.getIndexByField('prearrcolumns', 'bg_trade_type')].cellEditorParams.values = trade_types;
                }
                if ($scope.getIndexByField('acolumns', 'bg_trade_type')) {
                    $scope.acolumns[$scope.getIndexByField('acolumns', 'bg_trade_type')].cellEditorParams.values = trade_types;
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

                if ($scope.getIndexByField('waitarrcolumns', 'pro_type')) {
                    $scope.waitarrcolumns[$scope.getIndexByField('waitarrcolumns', 'pro_type')].cellEditorParams.values = pro_types;
                }
                if ($scope.getIndexByField('acolumns', 'pro_type')) {
                    $scope.acolumns[$scope.getIndexByField('acolumns', 'pro_type')].cellEditorParams.values = pro_types;
                }
                if ($scope.getIndexByField('prearrcolumns', 'pro_type')) {
                    $scope.prearrcolumns[$scope.getIndexByField('prearrcolumns', 'pro_type')].cellEditorParams.values = pro_types;
                }

                if ($scope.getIndexByField('boxsumcolumns', 'pro_type')) {
                    $scope.boxsumcolumns[$scope.getIndexByField('boxsumcolumns', 'pro_type')].cellEditorParams.values = pro_types;
                }
            });

        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "box_type"}).then(function (data) {
            var box_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                box_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }

            if ($scope.getIndexByField('Cabinetcolumns', 'box_type')) {
                $scope.Cabinetcolumns[$scope.getIndexByField('Cabinetcolumns', 'box_type')].cellEditorParams.values = box_types;
            }

            if ($scope.getIndexByField('packagecolumns', 'box_type')) {
                $scope.packagecolumns[$scope.getIndexByField('packagecolumns', 'box_type')].cellEditorParams.values = box_types;
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

        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
            $scope.stats = data.dicts;
        })
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

    /**其它页面跳转及发货通知单、报关单自动生成*/
    {
        //发货通知
        $scope.buttonClick = function () {
            if (parseInt($scope.data.currItem.stat) != 5) {
                BasemanService.notice("出货预告没有审核完成!");
                return;
            }
            $scope.FrmInfo = {
                classid: "sale_ship_notice_header",
                sqlBlock: "warn_id =" + $scope.data.currItem.warn_id,
                commitRigthNow: true,
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                localeStorageService.set("gallery.sale_pro_shipment_notificationEdit", {
                    notice_id: data.notice_id,
                    flag: 3
                });
                $state.go("gallery.sale_pro_shipment_notificationEdit");
            })
        };
        //报关单
        $scope.buttonClick2 = function () {
            if (parseInt($scope.data.currItem.stat) != 5) {
                BasemanService.notice("出货预告没有审核完成!");
                return;
            }
            $scope.FrmInfo = {
                classid: "sale_customs_header",
                sqlBlock: "warn_id =" + $scope.data.currItem.warn_id,
                commitRigthNow: true,
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                localeStorageService.set("gallery.sale_customs_headerEdit", {customs_id: data.customs_id, flag: 3});
                $state.go("gallery.sale_customs_headerEdit");
            })
        };
        //形式发票
        $scope.buttonClick3 = function () {
            if ($scope.data.currItem.warn_id == undefined || $scope.data.currItem.warn_id == 0) {
                return;
            }
            $scope.FrmInfo = {
                classid: "sale_pi_header",
                sqlBlock: " exists (select 1\n" +
                "          from sale_ship_warn_line_sum\n" +
                "         where warn_id =" + $scope.data.currItem.warn_id +
                "            \n and sale_pi_header.pi_id = pi_id) ",
                commitRigthNow: true,

            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                localeStorageService.set("gallery.Sale_Pi_HeaderEdit", {pi_id: data.pi_id, flag: 3});
                $state.go("gallery.Sale_Pi_HeaderEdit");
            })

        };
        //生产单
        $scope.buttonClick4 = function () {
            if ($scope.data.currItem.warn_id == undefined || $scope.data.currItem.warn_id == 0) {
                return;
            }
            $scope.FrmInfo = {
                classid: "sale_prod_header",
                sqlBlock: " exists (select 1\n" +
                "          from sale_ship_warn_line_sum\n" +
                "         where warn_id =" + $scope.data.currItem.warn_id +
                "            \n and sale_prod_header.prod_id = prod_id) ",
                commitRigthNow: true,
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                localeStorageService.set("gallery.Sale_Prod_HeaderEdit", {prod_id: data.prod_id, flag: 3});
                $state.go("gallery.Sale_Prod_HeaderEdit");
            })

        };

        //通知单、报关单自动生成
        $scope.autonoticenew = function () {
            if (Number($scope.data.currItem.stat) != 5) {
                BasemanService.notice("出货预告未审核");
                return;
            }
            BasemanService.RequestPost("sale_ship_warn_header", "autonoticenew", {warn_id: $scope.data.currItem.warn_id}).then(
                function () {
                    BasemanService.notice("发货通知单生成完成");
                })
        }
        $scope.autocustoms = function () {
            if (Number($scope.data.currItem.stat) != 5) {
                BasemanService.notice("出货预告未审核");
                return;
            }
            BasemanService.RequestPost("sale_ship_warn_header", "autocustoms", {warn_id: $scope.data.currItem.warn_id}).then(
                function () {
                    BasemanService.notice("生成报关单完成");
                })
        }

    }

    /**查询框*/
    {
        //customer
        $scope.customer = function () {

            var sqlBlock = {}
            if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
                BasemanService.notice("请先选择业务部门", "alert-warning");
                return;
            } else {
                sqlBlock = "(org_id=" + $scope.data.currItem.org_id
                    + " or other_org_ids like '%," + $scope.data.currItem.org_id + ",%')";
            }
            $scope.FrmInfo = {
                classid: "customer",
                postdata: {},
                sqlBlock: sqlBlock,
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                $scope.data.currItem.cust_id = result.cust_id;
                $scope.data.currItem.cust_code = result.sap_code;
                $scope.data.currItem.cust_name = result.cust_name;
            });
        }

        //scporg
        $scope.scporg = function () {
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

        //查询船务操作员
        $scope.cw_dz_user = function (flag) {
            $scope.FrmInfo = {
                title: "船务单证人员查询",
                is_high: true,
                is_custom_search: true,
                thead: [{
                    name: "人员名称",
                    code: "user_id",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "TEL",
                    code: "tel",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "FAX",
                    code: "fax",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
                classid: "base_shipping_user",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                if (flag == 'cw_user') {
                    $scope.data.currItem.cw_user = data.user_id;
                    $scope.data.currItem.cw_tel = data.tel;
                    $scope.data.currItem.cw_fax = data.fax;
                }
                if (flag == 'dz_user') {
                    $scope.data.currItem.dz_user = data.user_id;
                    $scope.data.currItem.dz_tel = data.tel;
                    $scope.data.currItem.dz_fax = data.fax;
                }
            });

        }

        //查询目的国
        $scope.to_country = function (flag) {
            $scope.FrmInfo = {
                classid: "scparea",
                sqlBlock: "areatype = 2",
                postdata: {},
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                if (flag == "目的国") {
                    $scope.data.currItem.to_area_name = data.areaname;
                    $scope.data.currItem.to_area_code = data.areacode;
                    $scope.data.currItem.to_area_id = parseInt(data.areaid);
                }
                if (flag == "报关国家") {
                    $scope.data.currItem.bg_area_name = data.areaname;
                    $scope.data.currItem.bg_area_code = data.areacode;
                    $scope.data.currItem.bg_area_id = parseInt(data.areaid);
                }
            });
        };
        //查询付款类型
        $scope.selectPayMentType = function () {
            $scope.FrmInfo = {
                classid: "payment_type",
                postdata: {},
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                $scope.data.currItem.payment_type_id = data.payment_type_id;
                $scope.data.currItem.payment_type_code = data.payment_type_code;
                $scope.data.currItem.payment_type_name = data.payment_type_name;
            });
        }

        //查询出货港
        $scope.searchoutport = function () {
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

        //联系人查询
        $scope.relaman = function () {
            $scope.FrmInfo = {
                title: "联系人查询",
                is_high: true,
                is_custom_search: true,
                thead: [{
                    name: "联系人名称",
                    code: "relaman",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "传真",
                    code: "fax",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "联系人电话",
                    code: "phone",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
                classid: "supplier",
                postdata: {flag: 1},
                sqlBlock: " supplier_code = '" + $scope.data.currItem.logistics_code + "'",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                $scope.data.currItem.relaman = data.relaman;
                $scope.data.currItem.fax = data.fax;
                $scope.data.currItem.phone = data.phone;
            });
        };

        $scope.searchinport = function () {
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

        //查询协议货代
        $scope.selecttransit_name = function () {
            $scope.FrmInfo = {
                classid: "supplier",
                postdata: {},
                sqlBlock: "usable = 2 and supplier_type=1 and hd_type=1 ",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                $scope.data.currItem.transit_name = data.supplier_name;
                $scope.data.currItem.transit_code = data.supplier_code;
                $scope.data.currItem.transit_id = parseInt(data.supplier_id);
            });
        }
        //货代公司查询
        $scope.selecthd = function () {
            $scope.FrmInfo = {
                classid: "supplier",
                postdata: {},
                sqlBlock: " usable = 2 and supplier_type=1  ",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                $scope.data.currItem.logistics_name = data.supplier_name;
                $scope.data.currItem.logistics_code = data.supplier_code;
                $scope.data.currItem.zzzsh = data.zzzsh;
                $scope.data.currItem.zs_last_date = data.zs_last_date;
                $scope.data.currItem.logistics_id = parseInt(data.supplier_id);
                var postdata = {
                    supplier_id: $scope.data.currItem.logistics_id,// 币种
                };
                BasemanService.RequestPost("supplier", "select", postdata)
                    .then(function (data) {
                        if (data.supplier_itemofsuppliers.length > 0) {
                            $scope.data.currItem.fax = data.supplier_itemofsuppliers[0].fax;
                            $scope.data.currItem.relaman = data.supplier_itemofsuppliers[0].relaman;
                            $scope.data.currItem.phone = data.supplier_itemofsuppliers[0].phone;
                        } else {
                            $scope.data.currItem.relaman = "";
                            $scope.data.currItem.phone = "";
                            $scope.data.currItem.fax = "";
                        }
                    });
            });
        };

    }

    //价格条款改变
    $scope.changePricetype = function () {
        for (var i = 0; i < $scope.price_types.length; i++) {
            if ($scope.data.currItem.price_type_id == $scope.price_types[i].dictvalue) {
                $scope.data.currItem.price_type_id = $scope.price_types[i].dictvalue;
                $scope.data.currItem.price_type_code = $scope.price_types[i].dictcode;
                $scope.data.currItem.price_type_name = $scope.price_types[i].dictname;
            }
        }
        $scope["aoptions"].api.selectAll();
        $scope.delaoline();
        $scope.gridSetData("enquiryoptions", []);
        $scope.gridSetData("cntoptions", []);
        $scope.gridSetData("fissoptions", []);
        $scope["packageoptions"].api.selectAll();
        $scope.delfrombox();
        $scope["packageoptions"].api.deselectAll();
    };


    $scope.changeLogistics = function () {
        if ($scope.data.currItem.logistics_name == "") {
            $scope.data.currItem.logistics_code = "";
            $scope.data.currItem.logistics_id = "";
            $scope.data.currItem.fax = "";
            $scope.data.currItem.relaman = "";
            $scope.data.currItem.phone = "";
        }
    };

    //合计
    $scope.partSummary = function () {
        $timeout(function () {
            var data = $scope.gridGetData("prearroptions");
            $scope.data.currItem.tl_tj = 0;
            $scope.data.currItem.tl_gw = 0;
            $scope.data.currItem.tl_nw = 0;
            //总体积
            for (var i = 0; i < data.length; i++) {
                if (parseFloat(data[i].total_tj) != undefined) {
                    $scope.data.currItem.tl_tj += parseFloat(data[i].total_tj || 0);
                }

                if (parseFloat(data[i].total_gw) != undefined) {
                    $scope.data.currItem.tl_gw += parseFloat(data[i].total_gw || 0);
                }

                if (parseFloat(data[i].total_nw) != undefined) {
                    $scope.data.currItem.tl_nw += parseFloat(data[i].total_nw || 0);
                }
            }
            $scope.data.currItem.tl_tj = $scope.data.currItem.tl_tj.toFixed(2);
            $scope.data.currItem.tl_gw = $scope.data.currItem.tl_gw.toFixed(2);
            $scope.data.currItem.tl_nw = $scope.data.currItem.tl_nw.toFixed(2);
        }, 1);
    };
    $scope.waitSetDatas = function () {
        var sum = $scope.data.currItem.sale_ship_warn_line_sumofsale_ship_warn_headers;
        var line = $scope.data.currItem.sale_ship_warn_lineofsale_ship_warn_headers;
        if (sum == undefined || line == undefined) {
            return;
        }
        var datas = []
        for (var i = 0; i < sum.length; i++) {
            var obj = {}
            HczyCommon.copyobj(sum[i], obj);
            for (var j = 0; j < line.length; j++) {
                if (obj.warn_sum_id == line[j].warn_sum_id) {
                    obj.qty = Number(obj.qty) - Number(line[j].qty)
                }
            }
            if (obj.qty > 0) {
                datas.push(obj)
            }
        }
        $scope.gridSetData('waitarroptions', datas);

    }


    $scope.auth_right = {
        iscw: false,
    }
    var stringofrole = window.userbean.stringofrole;
    if (stringofrole.indexOf("船务") != -1) {
        $scope.auth_right.iscw = true;
    }

    $scope.refresh_after = function () {
        if (window.userbean.stringofrole.indexOf("船务") != -1) {// && $scope.data.currItem.currprocname == ""
            $scope.acolumns[$scope.getIndexByField("acolumns", "note")].editable = true;
            $scope.acolumns[$scope.getIndexByField("acolumns", "ab_votes")].editable = true;
            $scope.fisscolumns[$scope.getIndexByField("fisscolumns", "ab_votes")].editable = true;
            $scope.auth_right.iscw = true;
        }

        if (window.userbean.stringofrole.indexOf("单证") != -1) {// && $scope.data.currItem.currprocname == ""
            var columns = $scope.cntoptions.defaultColumns
            for (var i = 0; i < $scope.cntcolumns.length; i++) {
                $scope.cntcolumns[i].editable = columns[i].editable;
            }
        }
        $scope.partSummary();
        $scope.waitSetDatas();
        $scope.set_wait_datas();
    }
    $scope.save_before = function () {
        delete $scope.data.currItem.waitdatas;
        var obj = {};
        var msg = [];
        for (var i = 0; i < $scope.data.currItem.sale_ship_warn_line_sumofsale_ship_warn_headers.length; i++) {
            obj = $scope.data.currItem.sale_ship_warn_line_sumofsale_ship_warn_headers[i];
            if (obj.add_row == 2) {
                if (obj.item_name == undefined || obj.item_name == "") {
                    obj.item_name = obj.cust_spec || "";
                }
            }
        }
        for (var j = 0; j < $scope.data.currItem.sale_ship_warn_box_lineofsale_ship_warn_headers.length; j++) {
            var boxline = $scope.data.currItem.sale_ship_warn_box_lineofsale_ship_warn_headers[j];
            boxline.box_address = "宁波奥克斯外贸仓库";
            if (boxline.sale_ship_warn_line_sumofsale_ship_warn_box_lines == undefined) {
                continue
            }
            for (var i = 0; i < boxline.sale_ship_warn_line_sumofsale_ship_warn_box_lines.length; i++) {
                obj = boxline.sale_ship_warn_line_sumofsale_ship_warn_box_lines[i];
                if (obj.add_row == 2) {
                    if (obj.item_name == undefined || obj.item_name == "") {
                        obj.item_name = obj.cust_spec || "";
                        obj.box_seq = boxline.seq;
                    }
                }
            }
        }
        var packages = $scope.data.currItem.sale_ship_warn_package_lineofsale_ship_warn_headers;
        for (var i = 0; i < packages.length;) {
            if (packages[i].ref_box_no == undefined || packages[i].ref_box_no == "") {
                packages.splice(i, 1);
            } else {
                i++;
            }
        }
    }
    //复制柜型
    $scope.copyboxtype = function () {
        var item = $scope.gridGetRow("Cabinetoptions");
        if (item == false) {
            BasemanService.notice("请选中要复制的行")
            return;
        }
        var box_type = item.box_type;
        BasemanService.openFrm("views/Pop_copy_Line.html", PopCopyLineController, $scope)
            .result.then(function (result) {
            var spiltRow = new Array();

            var selectedRow = new Array();
            for (i = 0; i < result.lines; i++) {
                var obj = {
                    box_type: item.box_type,
                    box_type_name: item.box_type_name,
                    amt_fee1: 0,
                    amt_fee2: 0,
                }
                $scope.gridAddItem("Cabinetoptions", obj);
                $scope.data.currItem.box_qty = $scope.gridGetData("Cabinetoptions").length;
                $scope.autogeneratebox();
            }
        });
    };


    //selectsend_man 去除
    $scope.selectsend_man = function () {
        $scope.FrmInfo = {
            title: "发货人",
            is_high: true,
            thead: [
                {
                    name: "发货人",
                    code: "dictname",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            classid: "base_search",
            postdata: {
                dictcode: "send_man"
            },
            backdatas: "dicts",
            action: "searchdict",
            searchlist: ["dictname"],
            is_custom_search: true
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.send_man = result.dictname;
        });
    };


    /**导出excel*/
    {

        $scope.export = function () {
            if (!$scope.data.currItem.warn_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_warn_header", "exporttoexcel", {'warn_id': $scope.data.currItem.warn_id})
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
            if (!$scope.data.currItem.warn_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_warn_header", "exporttoexcel1", {'warn_id': $scope.data.currItem.warn_id})
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
            if (!$scope.data.currItem.warn_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_warn_header", "exporttoexcel2", {'warn_id': $scope.data.currItem.warn_id})
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
            if (!$scope.data.currItem.warn_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_warn_header", "exporttoexcel3", {'warn_id': $scope.data.currItem.warn_id})
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
            if (!$scope.data.currItem.warn_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_warn_header", "exporttoexcel4", {'warn_id': $scope.data.currItem.warn_id})
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

    $scope.validate = function () {
        var obj = {}, msg = [], linemsg = "";
        for (var i = 0; i < $scope.data.currItem.sale_ship_warn_line_sumofsale_ship_warn_headers.length; i++) {
            obj = $scope.data.currItem.sale_ship_warn_line_sumofsale_ship_warn_headers[i];
            if (Number(obj.unit_nw) > Number(obj.unit_gw)) {
                msg.push("第" + obj.seq + "行单位净重:" + obj.unit_nw + "大于单位毛重" + obj.unit_gw);
            }
        }
        for (var i = 0; i < $scope.data.currItem.sale_ship_warn_lc_lineofsale_ship_warn_headers.length; i++) {
            obj = $scope.data.currItem.sale_ship_warn_lc_lineofsale_ship_warn_headers[i];
            linemsg = "";
            if (obj.send_man == undefined || obj.send_man == "") {
                linemsg = linemsg.length == 0 ? "发货人不能为空" : msg + ",发货人不能为空";
            }
            if (obj.receive_man == undefined || obj.receive_man == "") {
                linemsg = linemsg.length == 0 ? "收货人不能为空" : msg + ",收货人不能为空";
            }
            if (obj.notice_man == undefined || obj.notice_man == "") {
                linemsg = linemsg.length == 0 ? "通知人不能为空" : msg + ",通知人不能为空";
            }
            if (obj.origin == undefined || obj.origin == "") {
                linemsg = linemsg.length == 0 ? "产地证不能为空" : msg + ",产地证不能为空";
            }
            if (obj.vessel_certificate == undefined || obj.vessel_certificate == "") {
                linemsg = linemsg.length == 0 ? "船证明特殊条款不能为空" : msg + ",船证明特殊条款不能为空";
            }
            if (linemsg.length != 0) {
                msg.push("单证信息第" + (i + 1) + "行" + linemsg);
            }
        }
        if ($scope.data.currItem.pay_style == "1") {
            for (var i = 0; i < $scope.data.currItem.sale_ship_warn_box_lineofsale_ship_warn_headers.length; i++) {
                obj = $scope.data.currItem.sale_ship_warn_box_lineofsale_ship_warn_headers[i];
                if (1) {
                }
            }
        }
        if (msg.length > 0) {
            BasemanService.notice(msg);
            return false;
        }
        return true;
    }

    $scope.wfstart_validDate = function () {
        if (!$scope.validate) {
            return false;
        }
        var data = $scope.gridGetData('waitarroptions');
        var msg = []
        if (data instanceof Array) {
            if (data.length > 0) {
                msg.push("还有待排柜货物，请排柜!");
            }
        }
        if ($scope.data.currItem.tow_cop_name == "" && $scope.data.currItem.logistics_name == "") {
            msg.push("没选择船公司或货代公司");
        }
        var data1 = $scope.gridGetData('aoptions');
        for (var j = 0; j < data1.length; j++) {
            if (data1[j].pack_rule == 0 || data1[j].unit_gw == 0 || data1[j].unit_nw == 0) {
                var str = "";
                if (data1[j].pack_rule == 0) {
                    str = "体积";
                }
                if (data1[j].unit_gw == 0) {
                    str += ",单位净重";
                }
                if (data1[j].unit_nw == 0) {
                    str += ",单位毛重";
                }
                msg.push('产品信息第' + (j + 1) + "行" + str + "不能为0")
            }
        }
        if (msg.length > 0) {
            BasemanService.notice(msg);
            return false;
        }
        return true;
    }

    $scope.warn_wfstart = function (e) {
        var obj = {}, message = "";
        for (var i = 0; i < $scope.data.currItem.sale_ship_warn_package_lineofsale_ship_warn_headers.length; i++) {
            obj = $scope.data.currItem.sale_ship_warn_package_lineofsale_ship_warn_headers[i];
            if (obj.ref_box_no == undefined || obj.ref_box_no == "") {
                message = "散件包排柜第" + (i + 1) + "行未排柜,确定提交";
                break;
            }
        }
        if (message.length > 0) {
            ds.dialog.confirm(message, function (e) {
                $scope.wfstart(e);
            }, function () {
                return;
            })
        } else {
            $scope.wfstart(e);
        }
    }

    $scope.tab_click = function () {
        // $scope.gridSetData("packageoptions", $scope.gridGetData("packageoptions"));
    }

    $scope.wfstart_before = function () {
        var requestArr = BasemanService.RequestPost("sale_ship_warn_header", "commitcheck", {warn_id: $scope.data.currItem.warn_id});
        return requestArr;
    }

    $scope.initdata();


}

//加载控制器
billmanControllers
    .controller('sale_ship_warn_headerEdit', sale_ship_warn_headerEdit)

