var salemanControllers = angular.module('inspinia');
function sale_payreg_headerEdit($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {
    //继承基类方法
    sale_payreg_headerEdit = HczyCommon.extend(sale_payreg_headerEdit, ctrl_bill_public);
    sale_payreg_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_payreg_header",
        key: "reg_id",
        wftempid: 10082,
        FrmInfo: {},
        grids: [
            {
                optionname: 'options_11',
                idname: 'sale_payreg_lineofsale_payreg_headers'
            },
            {
                optionname: 'options_12',
                idname: 'sale_payreg_headers1'
            },
            {
                optionname: 'options_13',
                idname: 'sale_payreg_headers2'
            }
        ]
    };
    $scope.headername = "费用登记";
    if ($scope.$state.params.ExpandValue || $scope.$state.current.url == "/sale_payreg_headercheckEdit") {
        $scope.ExpandValue = 2;
        $scope.objconf.FrmInfo.sqlBlock = " stat=5";
        $scope.headername = "费用登记取消审核";
    }
    /****************取消审核*******************/
    $scope.docancel = function (e) {
        try {
            var msg = '确定要将' + $scope.data.currItem.reg_no + '单据取消审核!'
            ds.dialog.confirm(msg, function () {
                if (e) e.currentTarget.disabled = true;
                $(".desabled-window").css("display", "flex");
                var postdata = {
                    reg_id: $scope.data.currItem.reg_id,
                    flag: 1,
                }
                BasemanService.RequestPost($scope.objconf.name, "updateall", postdata)
                    .then(function (data) {
                        BasemanService.notice("取消审核成功!");
                        $scope.refresh(2);
                        $(".desabled-window").css("display", "none");
                        if (e) e.currentTarget.disabled = false;
                    }, function () {
                        $(".desabled-window").css("display", "none");
                        if (e) e.currentTarget.disabled = false;
                    });
            }, function () {
                $(".desabled-window").css("display", "none");
                if (e) e.currentTarget.disabled = false;
            })
        } finally {
            $(".desabled-window").css("display", "none");
            if (e) e.currentTarget.disabled = false;
        }
    };
    /*******************网格事件****************/
    { //出货预告
        $scope.selectwarn_no = function () {
            $scope.FrmInfo = {
                classid: "sale_ship_warn_header",
                postdata: {},
                sqlBlock: "stat in (5,99) and exists (select 1 from sale_ship_warn_box_line l " +
                "where l.warn_id=Sale_Ship_Warn_Header.warn_id) and update_time>=to_date('2012-12-08','yyyy-mm-dd')",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                HczyCommon.stringPropToNum(result);
                for (name in result) {
                    $scope.data.currItem[name] = result[name];
                }
                $scope.data.currItem.stat = 1;
                var postdata = {};
                if (postdata.warn_id == 0) {
                    return;
                }
                postdata.stat = 1;
                if (result.creator != "") {
                    postdata.creator = result.creator;
                } else {
                    postdata.creator = ""
                }
                ;
                if (result.create_time != "") {
                    postdata.create_time = result.create_time;
                } else {
                    postdata.create_time = ""
                }
                ;
                if (result.wfid != "") {
                    postdata.wfid = Number(result.wfid) || 0;
                } else {
                    postdata.wfid = 0
                }
                ;
                if (result.wfflag != "") {
                    postdata.wfflag = Number(result.wfflag) || 0;
                } else {
                    postdata.wfflag = 0
                }
                ;
                if (result.note != "") {
                    postdata.note = result.note;
                } else {
                    postdata.note = ""
                }
                ;
                postdata.updator = "";
                postdata.update_time = "";
                postdata.total_amt = 0;
                postdata.sj_valid_date = "";
                postdata.is_sj = 1;
                postdata.bg_address = "";
                postdata.is_bg = 1;
                $scope.data.currItem.pi_no = result.pi_no;
                $scope.data.currItem.cust_name = result.cust_name;
                var postdata = {};
                postdata.warn_id = Number(result.warn_id || 0);
                postdata.reg_id = Number(result.reg_id || 0);
                BasemanService.RequestPost("sale_payreg_header", "getlist", postdata)
                    .then(function (data) {
                        //已登记
                        var dataline = data.sale_payreg_lineofsale_payreg_headers;
                        $scope.options_13.api.setRowData(dataline);
                        $scope.SumInvoiceFee('HistroyInvoice', 0);
                    });
            });
        };
        //柜型
        $scope.box_type = function () {
            if ($scope.data.currItem.warn_id == undefined || $scope.data.currItem.warn_id == 0) {
                BasemanService.notice("请先选择出货预告", "alert-warning");
                return;
            }
            $scope.FrmInfo = {
                title: "柜型查询",
                is_high: true,
                is_custom_search: true,
                thead: [
                    {
                        name: "柜型",
                        code: "box_type",
                        show: true,
                        iscond: true,
                        type: 'list',
                        dicts: [{id: 1, name: "20GP"}, {id: 2, name: "40GP"}, {id: 3, name: "40HQ"}, {
                            id: 4,
                            name: "45HQ"
                        },
                            {id: 5, name: "40RH"}, {id: 6, name: "拼箱"}, {id: 7, name: "空运"}, {id: 8, name: "一卡一车"},
                            {id: 9, name: "二卡一车"}, {id: 10, name: "三卡一车"}]
                    }, {
                        name: "参考柜号",
                        code: "ref_box_no",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }],
                classid: "sale_ship_warn_header",
                postdata: {
                    flag: 7,
                    warn_id: $scope.data.currItem.warn_id
                },
                is_custom_search: true,
                searchlist: ["box_type", "ref_box_no"]
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                data = HczyCommon.stringPropToNum(data)
                var focusData = $scope.gridGetRow('options_11');
                focusData.box_type = data.box_type;
                focusData.ref_box_no = data.ref_box_no;
                focusData.pi_box_id = data.pi_box_id;
                $scope.gridUpdateRow('options_11', focusData);
            });
        };
        //赋值柜型
        $scope.cellRender = function (params) {
            if (params.colDef.field == "box_type") {
                for (var i = 0; i < $scope.box_types.length; i++) {
                    if (parseInt(params.value) == $scope.box_types[i].dictvalue) {
                        return $scope.box_types[i].dictname
                    }
                }
                if (params.value == undefined || params.value == "") {
                    return params.value = "";
                }
            }
        };
        //货代公司
        $scope.transit_name = function () {
            $scope.FrmInfo = {
                title: "供应商查询",
                is_high: true,
                is_custom_search: true,
                thead: [{
                    name: "供应商编码",
                    code: "supplier_code",
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
                    type: 'string'
                }],
                classid: "supplier",
                sqlwhere: "usable = 2",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                var focusData = $scope.gridGetRow('options_11');
                focusData.transit_id = data.supplier_id;
                focusData.transit_code = data.supplier_code;
                focusData.transit_name = data.supplier_name;
                $scope.gridUpdateRow('options_11', focusData);
            });
        };
        //费用编码
        $scope.order_fee_code = function () {
            $scope.FrmInfo = {
                title: "费用编码查询",
                is_high: true,
                is_custom_search: true,
                thead: [{
                    name: "订单费用编码",
                    code: "order_fee_code",
                    show: true,
                    iscond: true,
                    type: 'string'
                }
                    , {
                        name: "订单费用名称",
                        code: "order_fee_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }
                    , {
                        name: "备注",
                        code: "note",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }
                ],
                is_custom_search: true,
                classid: "sale_order_fee",
                postdata: {},
                sqlwhere: "( 1=1 ) and usable=2",
                searchlist: ["order_fee_code", "order_fee_name", "note"]
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                var focusData = $scope.gridGetRow('options_11');
                focusData.order_fee_code = data.order_fee_code;
                focusData.order_fee_name = data.order_fee_name;
                focusData.order_fee_id = data.order_fee_id;
                $scope.gridUpdateRow('options_11', focusData);
            });
        };
        //货币
        $scope.currency_name = function () {
            if ($scope.data.currItem.warn_id == undefined || $scope.data.currItem.warn_id == 0) {
                BasemanService.notice("请先选择出货预告", "alert-warning");
                return;
            }
            $scope.FrmInfo = {
                title: "货币查询",
                is_high: true,
                is_custom_search: true,
                thead: [
                    {
                        name: "货币代码",
                        code: "currency_code",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }
                    , {
                        name: "货币名称",
                        code: "currency_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }
                    , {
                        name: "备注",
                        code: "note",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }
                ],
                is_custom_search: true,
                classid: "base_currency",
                postdata: {},
                searchlist: ["currency_code", "currency_name", "note"],
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                var focusData = $scope.gridGetRow('options_11');
                focusData.currency_code = data.currency_code;
                focusData.currency_name = data.currency_name;
                focusData.currency_id = data.currency_id;
                focusData.note = data.note;
                $scope.gridUpdateRow('options_11', focusData);
            });
        };
        //增加当前行、删除当行前
        $scope.additem = function () {
            $scope.options_11.api.stopEditing(false);
            var h_line = [];
            var node = $scope.options_11.api.getModel().rootNode.allLeafChildren;
            for (var i = 0; i < node.length; i++) {
                h_line.push(node[i].data);
            }
            var item = {
                seq: node.length + 1
            };
            h_line.push(item);
            $scope.options_11.api.setRowData(h_line);
            $scope.data.currItem.sale_payreg_lineofsale_payreg_headers = h_line;
            // $scope.SumInvoiceFee('', h_line);
        };
        //货代公司选择
        $scope.pay_objectcellchange = function () {
            $scope.options_11.api.stopEditing();
            var _this = $(this);
            var val = _this.val();
            var index = $scope.options_11.api.getFocusedCell().rowIndex;
            var nodes = $scope.options_11.api.getModel().rootNode.childrenAfterSort;
            var itemtemp = nodes[index].data;
            if (nodes[index].data.pay_object == 3 || nodes[index].data.pay_object == "" || nodes[index].data.pay_object == undefined) {
                itemtemp.transit_id = 0;
                itemtemp.transit_code = 0;
                itemtemp.transit_name = "";
                $scope.columns_11[3].editable = "true";
                $scope.transit_name();
                $scope.options_11.api.refreshCells(nodes, ["transit_name"]);
            } else if (nodes[index].data.pay_object == 2 || nodes[index].data.pay_object == 1) {
                $scope.columns_11[3].editable = "true";
                BasemanService.RequestPost("sale_payreg_header", "gettransit", {
                    warn_id: $scope.data.currItem.warn_id,
                    pay_object: nodes[index].data.pay_object,
                }).then(function (result) {
                    itemtemp.transit_id = result.transit_id;
                    itemtemp.transit_code = result.transit_code;
                    itemtemp.transit_name = result.transit_name;
                    $scope.options_11.api.refreshCells(nodes, ["transit_name"]);
                })
            }
        };
        //单元格值改变
        $scope.lineCellChange = function () {
            // var forcusRow = $scope.gridGetRow('options_11');
            
            var dataline = $scope.gridGetData("options_11");
            var _this = $(this);
            var val = _this.val();
            
            var nodes = $scope.options_11.api.getModel().rootNode.childrenAfterGroup;
            var cell = $scope.options_11.api.getFocusedCell();
            var field = cell.column.colDef.field;

            var h_line = nodes[cell.rowIndex].data;
            var refreshFields = [];
            // if(field == "box_qty"){
            //     h_line.amt = Number(h_line.box_price || 0) * Number(val || 0);
            //     refreshFields = ["amt"];
            // }
            if (field == "box_price") {
                h_line.amt = Number(val || 0) * Number(h_line.box_qty || 0);
                refreshFields = ["amt"];
                $scope.options_11.api.refreshCells(nodes, refreshFields);
                $scope.calTotalAmt(dataline);
            } else if (field == "pay_object") {
                if (Number(h_line.pay_object || 0) == 3) {
                    h_line.transit_id = 0;
                    h_line.transit_code = 0;
                    h_line.transit_name = 0;
                    refreshFields = ["transit_id", "transit_name", "transit_code"]
                } else {
                    $scope.getTransit();
                }
            } else if (field == "order_fee_code") {
                if (h_line.order_fee_code == undefined || h_line.order_fee_code == "") {
                    h_line.order_fee_id = 0;
                    h_line.order_fee_name = 0;
                    refreshFields = ["order_fee_id", "order_fee_name"]
                }
            }
            if (field == "box_qty" || field == "box_price" || field == "amt") {
                $scope.SumInvoiceFee('', h_line);
            }
            $scope.options_11.api.refreshCells(nodes, refreshFields);
        };
        //根据支付对象取货代公司
        $scope.getTransit = function () {
            var forcusRow = $scope.gridGetRow('options_11');
            var postdata = {};
            postdata.warn_id = Number($scope.data.currItem.warn_id || 0);
            postdata.pay_object = Number(forcusRow.pay_object || 0);
            BasemanService.RequestPost("sale_payreg_header", "gettransit", postdata)
                .then(function (data) {
                    forcusRow.transit_id = data.transit_id;
                    forcusRow.transit_code = data.transit_code;
                    forcusRow.transit_name = data.transit_name;
                    $scope.gridUpdateRow('options_11', forcusRow);
                })
        };
        $scope.calTotalAmt = function (dataline) {
            var nodes = $scope.options_11.api.getModel().rootNode.childrenAfterGroup;
            var refreshFields = [];
            var showmsg = "", Currencyname = "", totalamt = 0;
            for (var i = 0; i < dataline.length; i++) {
                dataline[i].printed = "1";
                refreshFields = ["printed"];
                $scope.options_11.api.refreshCells(nodes, refreshFields);
            }
            for (var i = 0; i < dataline.length; i++) {
                if (dataline[i].printed == "2") {
                    continue;
                }
                Currencyname = dataline[i].currency_name || "";
                totalamt = 0;
                for (var j = 0; j < dataline.length; j++) {
                    if (dataline[j].currency_name == Currencyname) {
                        totalamt = totalamt + Number(dataline[j].amt || 0);
                        dataline[j].printed = "2"
                        refreshFields = ["printed"];
                        $scope.options_11.api.refreshCells(nodes, refreshFields);
                    }
                }
                showmsg = showmsg + Currencyname + ":" + Number(totalamt || 0) + "   ";
            }
            $scope.data.currItem.total_amt = showmsg;
        };
        $scope.SumInvoiceFee = function (aInvoiceNo, h_line, aDataFlag) {
            var aDataFlag = 1;
            var lines = $scope.gridGetData("options_11");
            var InvoiceSumFee = $scope.gridGetData("options_12");
            var RcdeddgInvoice = function (aInvoiceNo) {
                var InvoiceSumFees = $scope.gridGetData("options_12");
                for (var i = 0; i < InvoiceSumFees.length; i++) {
                    if ((InvoiceSumFees[i].invoice_no || "") == aInvoiceNo) {
                        return i;
                        break;
                    }
                }
                return -1;
            };
            var iInvoiceRIndex = -1;
            var dInvoiceSumFee = 0, dInvoiceSumFee = 0;
            var sInvoiceNo = "";
            var sMoneyType = "";
            if (aInvoiceNo.indexOf('HistroyInvoice') == -1 && aInvoiceNo.indexOf('CorrectInvoice') == -1) {
                if (aInvoiceNo == "") {
                    var f = 1;
                    sInvoiceNo = h_line.invoice_no;
                    sMoneyType = h_line.currency_code;
                } else {
                    sInvoiceNo = aInvoiceNo;
                }
                //登记金额
                dInvoiceSumFee = 0;
                for (var i = 0; i < lines.length; i++) {
                    if (sInvoiceNo == lines[i].invoice_no) {
                        dInvoiceSumFee += Number(lines[i].amt || 0)
                    }
                }
                var kk = -1;
                kk = RcdeddgInvoice(sInvoiceNo);
                // var sumfee1=[];
                if (kk > -1) {
                    dFactSumFee = 0;
                    dActFee = 0;
                    InvoiceSumFee[kk].sumfee = parseFloat(InvoiceSumFee[kk].sumfee) || 0;//已登记金额
                    InvoiceSumFee[kk].factsumfee = InvoiceSumFee[kk].sumfee + dInvoiceSumFee;//合计基恩
                    InvoiceSumFee[kk].actfee = dInvoiceSumFee;//本次金额
                    delete InvoiceSumFee[kk].seq;
                    $scope.gridUpdateRow("options_12", InvoiceSumFee[kk]);
                    $scope.options_12.api.setRowData(InvoiceSumFee);
                    /*if (aDataFlag = -1) {
                     dactfee = Number(InvoiceSumFee[kk].actfee || 0);
                     dfactsumfee = Number(InvoiceSumFee[kk].factsumfee || 0);
                     InvoiceSumFee[kk].factsumfee = parseFloat(dfactsumfee - h_line.amt || 0);
                     InvoiceSumFee[kk].actfee = parseFloat(dactfee - h_line.amt || 0);
                     $scope.gridUpdateRow("options_12", InvoiceSumFee[kk]);
                     }*/
                    if ((InvoiceSumFee[kk].factsumfee == 0) && (InvoiceSumFee[kk].factsumfee == InvoiceSumFee[kk].sumfee)) {
                        delete InvoiceSumFee[kk]
                    }

                } else {
                    var items = [];
                    var obj = {};
                    obj.invoice_no = sInvoiceNo;
                    obj.factsumfee = dInvoiceSumFee;
                    obj.actfee = 0;
                    obj.sumfee = dInvoiceSumFee;
                    items.push(obj);
                    for (var i = 0; i < items.length; i++) {
                        if (HczyCommon.isExist(InvoiceSumFee, items[i], ["invoice_no"], ["invoice_no"]).exist) {
                            continue;
                        }
                        $scope.gridAddItem("options_12", items[i]);
                    }

                }
            } else {
                if (aInvoiceNo.indexOf('HistroyInvoice') != -1) {
                    $scope.options_12.api.setRowData([]);
                    var dataline2 = $scope.gridGetData("options_13");
                    var sumfee2 = [];
                    for (var j = 0; j < dataline2.length; j++) {
                        var sInvoiceNo = '';
                        if (dataline2[j] == "" || dataline2[j] == undefined) {
                            continue
                        }
                        sInvoiceNo = dataline2[j].invoice_no;
                        var kk = -1;
                        kk = RcdeddgInvoice(sInvoiceNo);
                        // for (var i = 1; InvoiceSumFee.length; i++) {
                        //     if (InvoiceSumFee[i].invoice_no == sInvoiceNo) {
                        //         kk == i;
                        //         break;
                        //     }
                        // }
                        if (kk > -1) {
                            dInvoiceSumFee = Number(InvoiceSumFee[kk].sumfee) + Number(dataline2[j].amt);
                            InvoiceSumFee[kk].sumfee = parseFloat(dInvoiceSumFee);
                            InvoiceSumFee[kk].factsumfee = parseFloat(dInvoiceSumFee);
                            InvoiceSumFee[kk].actfee = 0;
                        } else {
                            var obj = {
                                invoice_no: sInvoiceNo,
                                factsumfee: parseFloat(dataline2[j].amt) || 0,
                                actfee: 0,
                                sumfee: parseFloat(dataline2[j].amt) || 0,
                            };
                            sumfee2.push(obj);

                        }
                    }
                    $scope.options_12.api.setRowData(sumfee2);
                    // $scope.gridAddItem("options_12", sumfee2);
                }
            }
            ;
            if (aInvoiceNo.indexOf('HistroyInvoice') != -1 && aInvoiceNo.indexOf('CorrectInvoice') != -1) {
                var dataline = $scope.gridGetData("options_11");
                var sumfee3 = [];
                for (var i = 0; i < dataline.length; i++) {
                    dActFee = 0;
                    sInvoiceNo = '';
                    if (dataline.length < 0) {
                        continue;
                    }
                    sInvoiceNo = dataline[i].invoice_no;
                    kk = -1;
                    kk = RcdeddgInvoice(sInvoiceNo);
                    if (kk > -1) {
                        dActFee = Number(InvoiceSumFee[kk].actfee || 0);
                        StrToIntDef(dgInvoiceSumFee.ValueByField2['ActFee', kk], 0) + StrToIntDef(dgline.ValueByField2['amt', ii], 0);
                        dInvoiceSumFee = Number(InvoiceSumFee[kk].sumfee || 0) + Number(InvoiceSumFee[kk].amt || 0);
                        StrToIntDef(dgInvoiceSumFee.ValueByField2['SumFee', kk], 0) + StrToIntDef(dgline.ValueByField2['amt', ii], 0);
                        //dgInvoiceSumFee.CellByField2['SumFee', kk] := FloatToStr(dInvoiceSumFee);
                        InvoiceSumFee[kk].factsumfee = parseFloat(dActFee || 0);
                        InvoiceSumFee[kk].sumfee = parseFloat(dActFee || 0);
                    } else {
                        var obj = {
                            invoice_no: sInvoiceNo,
                            factsumfee: parseFloat(dataline2[i].amt) || 0,
                            actfee: 0,
                            sumfee: parseFloat(dataline2[i].amt) || 0,
                        }
                        sumfee3.push(obj);
                    }
                }
                $scope.options_12.api.setRowData(sumfee3);

            }
        };
        //点击事件
        $scope.rowClicked11 = function (e) {
            if ($scope.data.currItem.stat != 1) {
                return;
            }
            if (e.colDef.field != "box_price" && e.colDef.field != "amt" && e.colDef.field != "transit_name") {
                return
            }
            if(Number(e.data.box_type || 0) > 0 && e.colDef.field == "box_price") {
                e.colDef.editable = true;
            }else if(Number(e.data.order_fee_code || 0) != 0 && e.colDef.field == "box_price") {
                e.colDef.editable = true;
            }else if(Number(e.data.box_type || 0) == 0 && e.colDef.field == "amt") {
                e.colDef.editable = true;
            }else if(Number(e.data.pay_object || 0)==3 && e.colDef.field == "pay_object") {
                e.colDef.editable = true;
            }else if(Number(e.data.pay_object || 0)==3 && e.colDef.field == "transit_name") {
                e.colDef.editable = true;
            }else{
                e.colDef.editable = false;
            }
        };
        //根据柜型取柜数
        $scope.getBoxQty = function () {
            var forcusRow = $scope.gridGetRow('options_11');
            var postdata = {};
            postdata.warn_id = Number($scope.data.currItem.warn_id || 0);
            postdata.box_type = Number(forcusRow.box_type || 0);
            BasemanService.RequestPost("sale_payreg_header", "getboxqty", postdata)
                .then(function (data) {
                    focusData.box_type = Number(data.box_type || 0);
                    $scope.gridUpdateRow('options_11', forcusRow);
                    $scope.calAmt();
                })
        };
    }
    /*******************系统词汇*****************/
    {
        //柜型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "box_type"}).then(function (data) {
            $scope.box_types = data.dicts;
            for (var i = 0; i < data.dicts.length; i++) {
                var newobj = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
                $scope.columns_13[1].cellEditorParams.values.push(newobj);
                $scope.columns_11[$scope.getIndexByField("columns_11", "box_type")].cellEditorParams.values.push(newobj);
            }
        });
        //运费付款方式
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_style"}).then(function (data) {
            $scope.pay_styles = HczyCommon.stringPropToNum(data.dicts);
        });
        //状态
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
            $scope.stats = data.dicts;
        });
        //货代类型
        var promise = BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "hd_type"});
        promise.then(function (data) {
            $scope.hd_types = HczyCommon.stringPropToNum(data.dicts);
        });
        //需要查询  -- 柜型信息
//        var promise = BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "box_type"});
//        promise.then(function (data) {
//            $scope.box_types = HczyCommon.stringPropToNum(data.dicts);
//        });
    }
    /******************网格配置*******************/
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
        //options
        $scope.options_11 = {
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
            rowClicked: $scope.rowClicked11,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_11.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };

        $scope.columns_11 = [
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
                headerName: "柜型",
                field: "box_type",
                editable: true,
                filter: 'set',
                width: 100,
                cellEditor: "弹出框",
                action: $scope.box_type,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellRenderer: function (params) {
                    return $scope.cellRender(params)
                },
                cellEditorParams: {values: []},
            }, {
                headerName: "支付对象",
                field: "pay_object",
                editable: true,
                filter: 'set',
                width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{value: 1, desc: '协议货代'}, {value: 2, desc: '指定货代'}, {value: 3, desc: '车队'}]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellchange: $scope.lineCellChange,
            }, {
                headerName: "货代公司",
                field: "transit_name",
                editable: true,
                filter: 'set',
                width: 100,
                cellEditor: "弹出框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                action: $scope.transit_name,
            }, {
                headerName: "发票号",
                field: "invoice_no",
                editable: true,
                filter: 'set',
                width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发票日期",
                field: "invoice_date",
                editable: true,
                filter: 'set',
                width: 120,
                cellEditor: "年月日",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "货币",
                field: "currency_name",
                editable: true,
                filter: 'set',
                width: 120,
                cellEditor: "弹出框",
                action: $scope.currency_name,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "费用编码",
                field: "order_fee_code",
                width: 100,
                editable: true,
                filter: 'set',
                cellEditor: "弹出框",
                action: $scope.order_fee_code,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                // cellchange: $scope.order_fee_code,
            }, {
                headerName: "费用名称",
                field: "order_fee_name",
                width: 100,
                editable: true,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
            }, {
                headerName: "柜数",
                field: "box_qty",
                width: 100,
                editable: true,
                filter: 'set',
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellchange: $scope.lineCellChange
            }, {
                headerName: "单柜费用",
                field: "box_price",
                width: 100,
                editable: true,
                filter: 'set',
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellchange: $scope.lineCellChange
            }, {
                headerName: "总费用",
                field: "amt",
                width: 100,
                editable: false,
                filter: 'set',
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellchange: $scope.lineCellChange
            }, {
                headerName: "付款公司",
                field: "pay_company",
                width: 100,
                editable: true,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "原因",
                field: "pay_reason",
                width: 100,
                editable: true,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "责任人",
                field: "reason_man",
                width: 100,
                editable: true,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "是否额外费用",
                field: "is_ewfee",
                width: 100,
                editable: true,
                filter: 'set',
                cellEditor: "复选框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "报告号",
                field: "baog_no",
                width: 100,
                editable: true,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "备注",
                field: "note",
                width: 100,
                editable: true,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "列名",
                field: "printed",
                width: 100,
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                hide: true
            }];

        if ($scope.ExpandValue == 2) {
            $scope.columns_11[$scope.getIndexByField("columns_11", "box_type")].cellEditor = "下拉框";
        }
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
            rowClicked: undefined,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_12.columnApi.getRowGroupColumns().length > 0;
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
            /*{
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
             }, */{
                headerName: "发票号",
                field: "invoice_no",
                editable: false,
                filter: 'set',
                width: 100,
                cellEditor: "文本框",
                action: $scope.box_type,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "已登记",
                field: "sumfee",
                editable: false,
                filter: 'set',
                width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "本次登记",
                field: "actfee",
                editable: false,
                filter: 'set',
                width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "合计金额",
                field: "factsumfee",
                editable: false,
                filter: 'set',
                width: 120,
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
            rowClicked: undefined,
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
        $scope.columns_13 = [
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
                headerName: "柜型",
                field: "box_type",
                editable: false,
                filter: 'set',
                width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "支付对象",
                field: "pay_object",
                editable: false,
                filter: 'set',
                width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{value: 1, desc: '协议货代'}, {value: 2, desc: '指定货代'}, {value: 3, desc: '车队'}]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "货代公司",
                field: "transit_name",
                editable: false,
                filter: 'set',
                width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发票号",
                field: "invoice_no",
                editable: false,
                filter: 'set',
                width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发票日期",
                field: "invoice_date",
                editable: false,
                filter: 'set',
                width: 120,
                cellEditor: "年月日",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "货币",
                field: "currency_name",
                editable: false,
                filter: 'set',
                width: 120,
                cellEditor: "弹出框",
                action: $scope.currency_name,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "费用编码",
                field: "order_fee_code",
                width: 100,
                editable: false,
                filter: 'set',
                cellEditor: "弹出框",
                action: $scope.order_fee_code,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "费用名称",
                field: "order_fee_name",
                width: 100,
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "柜数",
                field: "box_qty",
                width: 100,
                editable: false,
                filter: 'set',
                cellEditor: "弹出框",
                action: $scope.box_qty,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "单柜费用",
                field: "box_price",
                width: 100,
                editable: false,
                filter: 'set',
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "总费用",
                field: "amt",
                width: 100,
                editable: false,
                filter: 'set',
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "付款公司",
                field: "pay_company",
                width: 100,
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "原因",
                field: "pay_reason",
                width: 100,
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "责任人",
                field: "reason_man",
                width: 100,
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "是否额外费用",
                field: "is_ewfee",
                width: 100,
                editable: false,
                filter: 'set',
                cellEditor: "复选框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "报告号",
                field: "baog_no",
                width: 100,
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "备注",
                field: "note",
                width: 100,
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
    }
    /******************保存校验********************/
    //校验：
    $scope.validate = function () {
        var order_fee_id;
        var amt = 0;
        var invoice_no = "";
        var InvoiceInfoError = "";
        var dataline = $scope.gridGetData("options_11");
        if (dataline.length == 0 || dataline.length == undefined) {
            BasemanService.notice("本次登记明细行不能为空!", "alert-warning");
            return false;
        }
        ;
        var InvoiceInfo = [];
        var dataline2 = $scope.gridGetData("options_13");
        for (var i = 0; i < dataline2.length; i++) {
            var obj = {};
            obj.invoiceno = dataline2[i].invoice_no || "";
            obj.currency_name = dataline2[i].currency_name || "";
            obj.order_fee_code = dataline2[i].order_fee_code || "";
            InvoiceInfo.push(obj);
        }
        for (var i = 0; i < dataline.length; i++) {
            amt = parseFloat(dataline[i].amt || 0);
            var order_fee_id = parseFloat(dataline[i].order_fee_id || 0);
            if (amt <= 0 && order_fee_id > 0) {
                BasemanService.notice('第' + (i + 1) + '行申请金额不能为0!', "alert-warning");
                return false;
            }
            if (dataline[i].currency_name == "" || dataline[i].currency_name == undefined) {
                BasemanService.notice('第' + (i + 1) + '行的货币不能为空!', "alert-warning");
                invoice_no = dataline[i].invoice_no;
                return false;
            }
            if (dataline[i].invoice_no == "" || dataline[i].invoice_no == undefined) {
                BasemanService.notice('第' + (i + 1) + '行的发票号不能为空!', "alert-warning");
                invoice_no = dataline[i].invoice_no;
                return false;
            }
            invoice_no = dataline[i].invoice_no;
            j=i;
            //发票号
            if (dataline[i].is_ewfee == 2 && (dataline[i].baog_no == "" || dataline[i].baog_no == undefined)) {
                BasemanService.notice("第" + (i + 1) + "行是额外费用，必须填写报告号!", "alert-warning");
                return false;
            }
            InvoiceInfoError = '';
            for (var k = 0; k < InvoiceInfo.length; k++) {
                if (InvoiceInfo[k].invoiceno == invoice_no ) {

                    if (dataline[i].currency_name != InvoiceInfo[k].currency_name) {
                        BasemanService.notice('发票号' + dataline[i].invoice_no + '的货币类型不一致!!', "alert-warning");
                    } else if (dataline2[i].order_fee_code != InvoiceInfo[k].order_fee_code) {

                    }
                }
                //Showmessage(dgline.ValueByField2['Currency_Name', i] + #13 + InvoiceInfo[k].Currency_Name + #13 + dgline.ValueByField2['Order_Fee_Code', i] + #13 + InvoiceInfo[k].Order_Fee_Code);
                //strErr := strErr + Format('发票号%s的费用类型重复!', [invoice_no]) + #13#10;  //hide by jfd 20140919
                //InvoiceInfoError := InvoiceInfoError + Format('发票号%s的费用类型重复!', [invoice_no]) + #13#10; //hide by jfd 20140919
                //Break;
            }
            /*if(InvoiceInfo.length==0){
               InvoiceInfo.invoice_no=dataline2[i].invoice_no;
               InvoiceInfo.currency_name=dataline[i].currency_name;
               InvoiceInfo.order_fee_code=dataline[i].order_fee_code;
             }*/
        }
        ;
        for (var k = 0; k < InvoiceInfo.length; k++) {
            InvoiceInfo[k].invoice_no = "";
            InvoiceInfo[k].currency_name = "";
            InvoiceInfo[k].order_fee_code = "";
        }
        return true;
    };
    $scope.save_before = function () {
        delete $scope.data.currItem.sale_payreg_headers1;
        delete $scope.data.currItem.sale_payreg_headers2;
    };
    //初始化
    $scope.clearinformation = function () {
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.create_time = new Date();
        $scope.data.currItem.creator = window.userbean.userid;
        $scope.data.currItem.org_id = window.userbean.org_id;
        $scope.data.currItem.org_name = window.userbean.org_name;
    };
    $scope.initdata();
}//加载控制器
salemanControllers
    .controller('sale_payreg_headerEdit', sale_payreg_headerEdit)

