var billmanControllers = angular.module('inspinia');
function bill_invoice_header_redEdit($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {
    //继承基类方法
    bill_invoice_header_redEdit = HczyCommon.extend(bill_invoice_header_redEdit, ctrl_bill_public);
    bill_invoice_header_redEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "bill_invoice_header",
        key: "invoice_id",
        wftempid: 10018,
        FrmInfo: {
            sqlBlock: "nvl(bill_type,1) = 2 and invoice_type<2",
        },
        grids: [
            {optionname: 'itemoptions', idname: 'bill_invoice_lineofbill_invoice_headers'},//分体机
            {optionname: 'fundsoptions', idname: 'bill_invoice_funds_lineofbill_invoice_headers'}
        ]
    };
    //需要查询--机型
    var promise = BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "inv_fee_type"});
    promise.then(function (data) {
        var fee_types = [];
        for (var i = 0; i < data.dicts.length; i++) {
            fee_types[i] = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
        }
        if ($scope.getIndexByField('itemcolumns', 'fee_type')) {
            $scope.itemcolumns[$scope.getIndexByField('itemcolumns', 'fee_type')].cellEditorParams.values = fee_types;
        }
    });

    var promise = BasemanService.RequestPost("base_search", "searchdict", {dictcode: "pay_type"});
    promise.then(function (data) {
        var pay_types = [];
        for (var i = 0; i < data.dicts.length; i++) {
            pay_types[i] = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
        }
        if ($scope.getIndexByField('fundscolumns', 'funds_type')) {
            $scope.fundscolumns[$scope.getIndexByField('fundscolumns', 'funds_type')].cellEditorParams.values = pay_types;
        }
    });


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
    //分体机信息
    $scope.itemoptions = {
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
        rowClicked: $scope.rowClicked22,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
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
    $scope.itemcellchange = function () {
        var options = "itemoptions";
        var _this = $(this);
        var val = _this.val();

        var nodes = $scope[options].api.getModel().rootNode.childrenAfterGroup;
        var cell = $scope[options].api.getFocusedCell()
        var field = cell.column.colDef.field;

        var item = nodes[cell.rowIndex].data;
        if (field == "invoice_qty" || field == "other_price") {
            item.invoice_amt = Number(item.invoice_qty || 0) * Number(item.price || 0);
            item.other_amt = Number(item.invoice_qty || 0) * Number(item.other_price || 0);
        }
        $scope.data.currItem.bill_invoice_lineofbill_invoice_headers=$scope.gridGetData("itemoptions");
        $scope.calLineInvoiceAmt()
    }

    $scope.itemcolumns =[
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "费用项目", field: "fee_type", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "工厂型号编码", field: "item_code", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "工厂型号", field: "item_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户型号", field: "cust_item_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户产品名称", field: "cust_spec", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "装柜数量", field: "qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "销售价", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "金额", field: "line_amt", editable: false, filter: 'set', width: 85,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已发货确认数量", field: "actual_out_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已开发票数量", field: "allready_invoice_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "开票单价", field: "other_price", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.itemcellchange,
        },
        {
            headerName: "开票数量", field: "invoice_qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.itemcellchange,
        },
        {
            headerName: "开票金额", field: "other_amt", editable: true, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.itemcellchange,
        },
        {
            headerName: "实际金额", field: "invoice_amt", editable: false, filter: 'set', width: 130,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "交单数量", field: "jd_qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "交单金额", field: "jd_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "箱数", field: "pack_style", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "体积", field: "pack_rule", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "毛重", field: "unit_gw", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "净重", field: "nw", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "通知单号", field: "notice_no", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];


    $scope.fundsoptions = {
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
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.fundsoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.fundscolumns = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "分配单号", field: "allo_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "资金系统单号", field: "other_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "本次分配金额", field: "allo_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "制单时间", field: "create_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "到款类型", field: "funds_type", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];

    $scope.select_invoice_no = function () {
        $scope.FrmInfo = {
            classid: "bill_invoice_header",
            postdata: {
                s_flag: 1
            },
            sqlBlock: "stat = 5 and nvl(bill_type,1) <> 2 and nvl(is_red,1) <> 2" +
            " and nvl(invoice_type,0) <> 2 " +
            "and not exists (select 1 from bill_invoice_header ih " +
            "where ih.old_invoice_id = bill_invoice_header.invoice_id and nvl(ih.bill_type,0)=2) "
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            if (result.invoice_id == undefined) {
                return;
            }

            BasemanService.RequestPost("bill_invoice_header", "select", {
                invoice_id: result.invoice_id,
            }).then(function (data) {
                data.wfid = 0;
                data.wfflag = 0
                data.stat = 1;
                data.checkor = "";
                data.check_time = "";
                data.updator = "";
                data.update_time = "";
                data.dname = "";
                data.creator = $scope.data.currItem.creator;
                data.create_time = $scope.data.currItem.create_time;
                data.invoice_amt = -Number(data.invoice_amt);
                data.can_invoice_amt = -Number(data.can_invoice_amt);
                data.already_invoice_amt = -Number(data.already_invoice_amt);
                data.tt_amt = -Number(data.tt_amt);
                data.tt_check_amt = -Number(data.tt_check_amt);
                $scope.data.currItem = data;
                $scope.data.currItem.old_invoice_no = data.invoice_no;
                $scope.data.currItem.old_invoice_id = data.invoice_id;
                $scope.data.currItem.invoice_no = "";
                $scope.data.currItem.invoice_id = 0;
                $scope.calLineInvoiceAmt();
                //产品明细
                var obj = {};
                for (var i = 0; i < $scope.data.currItem.bill_invoice_lineofbill_invoice_headers.length; i++) {
                    obj = $scope.data.currItem.bill_invoice_lineofbill_invoice_headers[i];
                    obj.seq = i + 1;
                    obj.invoice_qty = -Number(obj.invoice_qty);
                    obj.other_amt = -Number(obj.other_amt);
                    obj.invoice_amt = -Number(obj.invoice_amt);
                }
                for (var i = 0; i < $scope.data.currItem.bill_invoice_funds_lineofbill_invoice_headers.length; i++) {
                    obj = $scope.data.currItem.bill_invoice_funds_lineofbill_invoice_headers[i];
                    obj.seq = i + 1;
                }
                $scope.setitemline1($scope.data.currItem);
            });
        })
    }


    $scope.calLineInvoiceAmt = function () {
        var payment = $scope.data.currItem.payment_type_name, obj = {}, rateobj = {}, ttrate = 0, lcrate = 0;
        if (payment.indexOf("TT") != -1 && payment.indexOf("LC") != -1) {
            for (var i = 0; i < $scope.data.currItem.bill_invoice_h_lineofbill_invoice_headers.length; i++) {
                obj = $scope.data.currItem.bill_invoice_h_lineofbill_invoice_headers[i];
                if (obj.notice_id == 0) {
                    continue;
                }
                ttrate = 0, lcrate = 0;
                for (var j = 0; j < $scope.data.currItem.bill_invoice_rateofbill_invoice_headers.length; j++) {
                    rateobj = $scope.data.currItem.bill_invoice_rateofbill_invoice_headers[j]
                    if (obj.notice_id == rateobj.notice_id) {
                        ttrate = rateobj.tt_rate;
                        lcrate = rateobj.lc_rate;
                        break;
                    }
                }
                obj.other_amt = (Number(obj.other_price || "") * Number(obj.invoice_qty || "") * Number(lcrate || "") * 0.01).toFixed(4);
            }
            for (var i = 0; i < $scope.data.currItem.bill_invoice_lineofbill_invoice_headers.length; i++) {
                if (obj.notice_id == 0) {
                    continue;
                }
                if (obj.fee_type == 14) {
                    continue;
                }
                obj = $scope.data.currItem.bill_invoice_lineofbill_invoice_headers[i];
                for (var j = 0; j < $scope.data.currItem.bill_invoice_rateofbill_invoice_headers.length; j++) {
                    rateobj = $scope.data.currItem.bill_invoice_rateofbill_invoice_headers[j]
                    if (obj.notice_id == rateobj.notice_id) {
                        ttrate = rateobj.tt_rate;
                        lcrate = rateobj.lc_rate;
                        break;
                    }
                }
                obj.other_amt = (Number(obj.other_price || "") * Number(obj.invoice_qty || "") * Number(lcrate || "") * 0.01).toFixed(4);
            }
        }
    }


    //查询会计区间
    $scope.selectperiod = function () {
        $scope.FrmInfo = {
            classid: "fin_bud_period_header",
            postdata: {flag: 3}
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.dname = result.dname;
            $scope.data.currItem.period_year = result.period_year;
        });
    };


    $scope.export = function () {
        if (!$scope.data.currItem.invoice_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("bill_invoice_header", "exporttoexcel", {
                'invoice_id': $scope.data.currItem.invoice_id, 'splitorwhole': $scope.data.currItem.splitorwhole
                , 'istransfer': 1
            })
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
        if (!$scope.data.currItem.invoice_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("bill_invoice_header", "exporttoexcel1", {
                'invoice_id': $scope.data.currItem.invoice_id, 'splitorwhole': $scope.data.currItem.splitorwhole
                , 'istransfer': 1
            })
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }

    $scope.export2 = function () {
        if (!$scope.data.currItem.invoice_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("bill_invoice_header", "exporttoexcel", {
                'invoice_id': $scope.data.currItem.invoice_id, 'splitorwhole': $scope.data.currItem.splitorwhole
                , 'istransfer': 2
            })
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }

    $scope.export3 = function () {
        if (!$scope.data.currItem.invoice_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("bill_invoice_header", "exporttoexcel1", {
                'invoice_id': $scope.data.currItem.invoice_id, 'splitorwhole': $scope.data.currItem.splitorwhole
                , 'istransfer': 2
            })
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }

    $scope.clearinformation = function () {
        $scope.data.currItem.item_stat = 1;
        $scope.data.currItem.po_price_stat = 1;
        $scope.data.currItem.po_stat = 1;
        $scope.data.currItem.po_rcv_stat = 1;
        $scope.data.currItem.so_price_stat = 1;
        $scope.data.currItem.so_stat = 1;
        $scope.data.currItem.sel_stat = 1;
        $scope.data.currItem.is_check_over = 1;
        $scope.data.currItem.flag = 10;
    };
    $scope.initdata()

}

//加载控制器
billmanControllers
    .controller('bill_invoice_header_redEdit', bill_invoice_header_redEdit)

