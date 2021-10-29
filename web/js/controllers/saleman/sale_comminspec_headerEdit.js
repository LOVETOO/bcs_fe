var billmanControllers = angular.module('inspinia');
function sale_comminspec_headerEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {
    //继承基类方法
    sale_comminspec_headerEdit = HczyCommon.extend(sale_comminspec_headerEdit, ctrl_bill_public);
    sale_comminspec_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_comminspec_header",
        key: "comminspec_id",
        wftempid: 10078,
        FrmInfo: {},
        grids: [{
            optionname: 'hline_options', idname: 'sale_comminspec_h_lineofsale_comminspec_headers',
            line: {
                optionname: 'line_options',
                idname: 'sale_comminspec_lineofsale_comminspec_h_lines'
            }
        },
            {optionname: 'part_options', idname: 'sale_prod_line_partofsale_prod_headers'}
        ]
    };


    $scope.headername = "商检单制单";
    if ($scope.$state.params.ExpandValue || $scope.$state.current.url == "/sale_comminspec_headerEdit1") {
        $scope.ExpandValue = 2;
        $scope.objconf.FrmInfo.sqlBlock = " stat in(5,99)";
        $scope.headername = "商检单作废";
    }

    //作废方法
    $scope.docancel = function (e) {
        if ($scope.data.currItem.modify_note == undefined || $scope.data.currItem.modify_note == "") {
            BasemanService.notice("请填写作废原因!")
            return;
        }
        try {
            var msg = '确定要将' + $scope.data.currItem.comminspec_no + '单据作废!'
            ds.dialog.confirm(msg, function () {
                if (e) e.currentTarget.disabled = true;
                $(".desabled-window").css("display", "flex");
                var postdata = {
                    comminspec_id: $scope.data.currItem.comminspec_id,
                    modify_note: $scope.data.currItem.modify_note,
                }
                BasemanService.RequestPost($scope.objconf.name, "cancel", postdata)
                    .then(function (data) {
                        BasemanService.notice("作废成功!");
                        $scope.data.currItem.stat = 99;
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

    /**********************下拉框值查询***************/
    {

        $scope.buyer_names = [{
            id: "DE ZE COMPANY LTD",
            name: "DE ZE COMPANY LTD"
        }, {
            id: "AUX ELECTRIC (HONG KONG) COMPANY LIMITED",
            name: "AUX ELECTRIC (HONG KONG) COMPANY LIMITED"
        }];
        // 机型类别
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pro_type"}).then(function (data) {

            var pro_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                pro_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                }
            }
            if ($scope.getIndexByField('hline_columns', 'pro_type')) {
                $scope.hline_columns[$scope.getIndexByField('hline_columns', 'pro_type')].cellEditorParams.values = pro_types;
            }
            if ($scope.getIndexByField('line_columns', 'pro_type')) {
                $scope.line_columns[$scope.getIndexByField('line_columns', 'pro_type')].cellEditorParams.values = pro_types;
            }
        });
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
            $scope.trade_types = data.dicts
        })
        //
    }

    {  //按钮与弹出框

        //查询目的港
        $scope.searchinport = function () {
            $scope.FrmInfo = {
                title: "目的港查询",
                classid: "seaport",
                sqlBlock: "seaport_type = 2",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                $scope.data.currItem.seaport_in_id = result.seaport_id;
                $scope.data.currItem.seaport_in_code = result.seaport_code;
                $scope.data.currItem.seaport_in_name = result.seaport_name;
            });
        };

        //获取商检批号
        $scope.batchno = function (flag) {
            $scope.inspection_batchnos = [];
            var str = "", batchno = "";
            var datas = $scope.gridGetData("hline_options");
            for (var i = 0; i < datas.length; i++) {
                batchno = datas[i].inspection_batchno;
                if (str.indexOf(batchno) == -1) {
                    str += batchno;
                    $scope.inspection_batchnos.push({id: batchno, name: batchno});
                }
            }
            if (flag == 2) {
                if ($scope.inspection_batchnos.length > 0) {
                    $scope.data.currItem.inspection_batchnos = $scope.inspection_batchnos[0].id;
                }
                return;
            }
            var postdata = {};
            postdata.inspection_id = $scope.data.currItem.inspection_id || "";
            postdata.org_id = $scope.data.currItem.org_id || "";
            postdata.cust_id = $scope.data.currItem.cust_id || "";
            postdata.flag = 0;
            BasemanService.RequestPost("sale_inspection_header", "getinspection", postdata)
                .then(function (data) {
                    $scope.data.currItem.inspection_batchnos = data.inspection_batchno;
                    $scope.inspection_batchnos.push({id: data.inspection_batchno, name: data.inspection_batchno});
                });
        };

        //出货预告号
        $scope.selectwarn_no = function () {
            $scope.FrmInfo = {
                title: "出货预告查询",
                classid: "sale_ship_warn_header",
                postdata: {stat: 1},
                sqlwhere: "stat in (1,2,3,4,5) and update_time>=to_date('2012-12-08','yyyy-mm-dd')",
            };
            BasemanService.open(CommonPopController, $scope, "", "lg")
                .result.then(function (data) {
                if (data.warn_id == undefined) {
                    return;
                }
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
                if (data.bg_area_id > 0) {
                    $scope.data.currItem.area_code = data.bg_area_code;
                    $scope.data.currItem.area_id = data.bg_area_id;
                    $scope.data.currItem.area_name = data.bg_area_name;
                } else {
                    $scope.data.currItem.area_code = data.to_area_code;
                    $scope.data.currItem.area_id = data.to_area_id;
                    $scope.data.currItem.area_name = data.to_area_name;
                }
                $scope.data.currItem.cpi_no = data.pi_no;
                $scope.set_price_type2_name($scope.data.currItem.price_type_name);
                $scope.data.currItem.sale_comminspec_h_lineofsale_comminspec_headers = [];
                $scope.setitemline1($scope.data.currItem);

            });
        };

        $scope.cprice = function () {
            if ($scope.data.currItem.comminspec_id == undefined || $scope.data.currItem.comminspec_id == "") {
                BasemanService.notice("请先保存!");
                return;
            }
            if ($scope.data.currItem.part_amt == undefined || $scope.data.currItem.part_amt == "") {
                BasemanService.notice("免费配件金额为0,不需调整价格!");
                return;
            }
            if ($scope.data.currItem.price_changed == "2") {
                return;
            }
            var paramt = Number($scope.data.currItem.part_amt || 0);
            BasemanService.RequestPost("sale_comminspec_header", "getwarnqty", {
                comminspec_id: $scope.data.currItem.comminspec_id,
            }).then(function (data) {
                var qty = data.warn_qty, price = 0, lines;
                var hlines = $scope.gridGetData("hline_options");
                for (var i = 0; i < hlines.length; i++) {
                    if (hlines[i].pro_type == "4") {
                        continue;
                    }
                    if (hlines[i].new_row == "2") {
                        continue;
                    }
                    lines = hlines[i].sale_comminspec_lineofsale_comminspec_h_lines;
                    for (var j = 0; j < lines.length; j++) {
                        if (lines[j].pro_type == "2" || lines[j].pro_type == "3") {
                            lines[j].price = Number(lines[j].price || 0) - Number((paramt / qty).toFixed(2));
                            lines[j].amt = lines[j].price * Number(lines[j].prod_qty || 0);
                            lines[j].print_price = lines[j].price;
                            price += lines[j].price;
                        }
                    }
                    hlines[i].price = price;
                    hlines[i].print_price = hlines[i].price;
                    hlines[i].amt = hlines[i].price * Number(hlines[i].prod_qty || 0);
                    $scope.data.currItem.price_changed = "2";
                    $scope.gridSetData("hline_options", hlines);
                    var focusCell = $scope.hline_options.api.getFocusedCell(), index = 0;
                    if (focusCell != null) {
                        index = focusCell.rowIndex;
                    }
                    $scope.gridSetData("line_options", hlines[index].sale_comminspec_lineofsale_comminspec_h_lines);

                }
            })

        }
        $scope.cprice2 = function () {
            if ($scope.data.currItem.comminspec_id == undefined || $scope.data.currItem.comminspec_id == "") {
                BasemanService.notice("请先保存!");
                return;
            }
            if ($scope.data.currItem.part_amt == undefined || $scope.data.currItem.part_amt == "") {
                BasemanService.notice("运保费金额为0,不需调整价格!");
                return;
            }
            if ($scope.data.currItem.price_changed2 == "2") {
                return;
            }
            var paramt = Number($scope.data.currItem.part_amt || 0);
            BasemanService.RequestPost("sale_comminspec_header", "getwarnqty", {
                comminspec_id: $scope.data.currItem.comminspec_id,
            }).then(function (data) {
                var qty = data.warn_qty, price = 0, lines;
                var hlines = $scope.gridGetData("hline_options");
                for (var i = 0; i < hlines.length; i++) {
                    if (hlines[i].pro_type == "4") {
                        continue;
                    }
                    if (hlines[i].new_row == "2") {
                        continue;
                    }
                    lines = hlines[i].sale_comminspec_lineofsale_comminspec_h_lines;
                    for (var j = 0; j < lines.length; j++) {
                        if (lines[j].pro_type == "2" || lines[j].pro_type == "3") {
                            lines[j].print_price = Number(lines[j].print_price || 0) - Number((paramt / qty).toFixed(2));
                            lines[j].amt = lines[j].print_price * Number(lines[j].prod_qty || 0);
                            price += lines[j].print_price;
                        }
                    }
                    hlines[i].print_price = price;
                    hlines[i].amt = hlines[i].print_price * Number(hlines[i].prod_qty || 0);
                    $scope.data.currItem.price_changed2 = "2";
                    $scope.gridSetData("hline_options", hlines);
                    var focusCell = $scope.hline_options.api.getFocusedCell(), index = 0;
                    if (focusCell != null) {
                        index = focusCell.rowIndex;
                    }
                    $scope.gridSetData("line_options", hlines[index].sale_comminspec_lineofsale_comminspec_h_lines);

                }
            })
        }

        $scope.rprice = function () {
            var hlines = $scope.gridGetData("hline_options"), lines;
            for (var i = 0; i < hlines.length; i++) {
                if (hlines[i].pro_type != 1 && hlines[i].pro_type != 2 && hlines[i].pro_type != 3) {
                    continue;
                }
                hlines[i].price = hlines[i].warn_price;
                if ($scope.data.currItem.price_changed2 != "2") {
                    hlines[i].print_price = hlines[i].price;
                    hlines[i].amt = Number(hlines[i].price || 0) * Number(hlines[i].prod_qty || 0);
                }
                lines = hlines[i].sale_comminspec_lineofsale_comminspec_h_lines;
                for (var j = 0; j < lines.length; j++) {
                    if (lines[j].pro_type != 1 && lines[j].pro_type != 2 && lines[j].pro_type != 3) {
                        continue;
                    }
                    lines[j].price = lines[j].warn_price;
                    if ($scope.data.currItem.price_changed2 != "2") {
                        lines[j].print_price = lines[j].price;
                        lines[j].amt = Number(lines[j].price || 0) * Number(lines[j].prod_qty || 0);
                    }
                }

            }
            $scope.data.currItem.price_changed = "1";
            $scope.gridSetData("hline_options", hlines);
            var focusCell = $scope.hline_options.api.getFocusedCell(), index = 0;
            if (focusCell != null) {
                index = focusCell.rowIndex;
            }
            $scope.gridSetData("line_options", hlines[index].sale_comminspec_lineofsale_comminspec_h_lines);

        }
        $scope.rprice2 = function () {
            var hlines = $scope.gridGetData("hline_options"), lines;
            for (var i = 0; i < hlines.length; i++) {
                if (hlines[i].pro_type != 1 && hlines[i].pro_type != 2 && hlines[i].pro_type != 3) {
                    continue;
                }
                hlines[i].print_price = hlines[i].price;
                hlines[i].amt = Number(hlines[i].price || 0) * Number(hlines[i].prod_qty || 0);
                lines = hlines[i].sale_comminspec_lineofsale_comminspec_h_lines;
                for (var j = 0; j < lines.length; j++) {
                    if (lines[j].pro_type != 1 && lines[j].pro_type != 2 && lines[j].pro_type != 3) {
                        continue;
                    }
                    lines[j].print_price = lines[j].price;
                    lines[j].amt = Number(lines[j].price || 0) * Number(lines[j].prod_qty || 0);
                }
            }
            $scope.data.currItem.price_changed2 = "1";
            $scope.gridSetData("hline_options", hlines);
            var focusCell = $scope.hline_options.api.getFocusedCell(), index = 0;
            if (focusCell != null) {
                index = focusCell.rowIndex;
            }
            $scope.gridSetData("line_options", hlines[index].sale_comminspec_lineofsale_comminspec_h_lines);
        }

        $scope.set_price_type2_name = function (price_type_name) {
            if (price_type_name == "FOB") {
                $scope.data.currItem.price_type2_name = "FOB";
            } else if (price_type_name == "CIF") {
                $scope.data.currItem.price_type2_name = "FOB+I+F";
            } else if (price_type_name == "CFR") {
                $scope.data.currItem.price_type2_name = "FOB+F";
            }
        }

        $scope.getOtherMsg = function () {
            var postdata = {warn_id: $scope.data.currItem.warn_id};
            var promise = BasemanService.RequestPost("sale_comminspec_header", "getothermsg", postdata);
            promise.then(function (data) {
                $scope.data.currItem.brand_name = data.brand_name;
                $scope.data.currItem.ab_votes = data.ab_votes;
            });
        };

    }
    $scope.validate = function () {
        var msg = [];
        if ($scope.data.currItem.sale_comminspec_h_lineofsale_comminspec_headers.length < 1) {
            msg.push("明细不能为空!");
        }
        var obj = {}, objline = {}, comminspec_qty, qty;
        var abvotes = $scope.data.currItem.sale_comminspec_h_lineofsale_comminspec_headers[0].ab_votes;
        var is_one_abvote = true;
        for (var i = 0; i < $scope.data.currItem.sale_comminspec_h_lineofsale_comminspec_headers.length; i++) {
            obj = $scope.data.currItem.sale_comminspec_h_lineofsale_comminspec_headers[i];
            if (obj.ab_votes == undefined || obj.ab_votes == "") {
                msg.push("第" + (i + 1) + "行的分票内容不能为空!");
            }
            if (is_one_abvote && abvotes != $scope.data.currItem.sale_comminspec_h_lineofsale_comminspec_headers[i].ab_vote) {
                is_one_abvote = false;
            }
            for (var j = 0; j < obj.sale_comminspec_lineofsale_comminspec_h_lines.length; j++) {
                objline = obj.sale_comminspec_lineofsale_comminspec_h_lines[j];
                comminspec_qty = Number(objline.comminspec_qty || 0);
                qty = Number(objline.prod_qty || 0) - Number(objline.comminspec_in_qty || 0)
                if (comminspec_qty > qty && objline.warn_h_id > -9) {
                    msg.push("第" + (i + 1) + "行下的第" + (j + 1) + "行明细的本次商检数量" + comminspec_qty + "大于未商检数量" + qty);
                }
            }
        }
        if (!is_one_abvote) {
            msg.push("不能存在2种以上分票!");
        }
        if (msg.length > 0) {
            BasemanService.notice(msg);
            return false;
        }
        return true;
    }

    $scope.addhline = function () {
        var msg = [];
        if ($scope.data.currItem.warn_no == undefined || $scope.data.currItem.warn_no == "") {
            msg.push("出货预告不能为空");
        }
        if ($scope.data.currItem.cust_code == undefined || $scope.data.currItem.cust_code == "") {
            msg.push("客户不能为空");
        }
        if ($scope.data.currItem.price_type_name == undefined || $scope.data.currItem.price_type_name == "") {
            msg.push("价格条款不能为空");
        }
        if (msg.length > 0) {
            BasemanService.notice(msg);
            return;
        }

        $scope.FrmInfo = {
            title: "商检产品查询",
            classid: "sale_ship_warn_header",
            is_high: true,
            is_custom_search: true,
            thead: [
                {
                    name: "PI号", code: "pi_no",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "生产单号", code: "prod_no",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "商检批号", code: "inspection_batchno",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "机型类别", code: "pro_type",
                    show: true, iscond: true, type: 'list',
                    dicts: [{id: 1, name: "整机"}, {id: 2, name: "内机"}, {id: 3, name: "外机"}, {id: 4, name: "配件"}]
                }, {
                    name: "AB票", code: "ab_votes",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "产品编码", code: "item_code",
                    show: true, iscond: true, type: 'string',
                }, {
                    name: "客户产品名称", code: "cust_spec",
                    show: true, iscond: true, type: 'string',
                }, {
                    name: "数量", code: "prod_qty",
                    show: true, iscond: true, type: 'string',
                }],
            postdata: {
                flag: 10,
                warn_id: $scope.data.currItem.warn_id,
            },
            type: "checkbox",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (datas) {
            if (datas.length == undefined) {
                return;
            }
            var hlines = $scope.gridGetData("hline_options");
            for (var i = 0; i < datas.length; i++) {
                if (HczyCommon.isExist(hlines, datas[i], ["warn_h_id", "row_type"]).exist) {
                    continue;
                }
                var requestobj = BasemanService.RequestPostNoWait("sale_ship_warn_header", "getline", {
                    warn_id: $scope.data.currItem.warn_id,
                    row_type: datas[i].row_type,
                    warn_h_id: datas[i].warn_h_id,
                    cust_desc: datas[i].cust_spec,
                    pi_id: datas[i].pi_id,
                    item_code: datas[i].item_code,
                })
                if (requestobj.pass) {
                    var lines = requestobj.data.sale_ship_warn_line_sumofsale_ship_warn_headers;
                    for (var j = 0; j < lines.length; j++) {
                        lines[j].print_price = lines[j].price;
                        lines[j].comminspec_qty = lines[j].prod_qty;
                        lines[j].amt = Number(lines[j].price || 0) * Number(lines[j].prod_qty || 0);
                    }
                }
                datas[i].sale_comminspec_lineofsale_comminspec_h_lines = lines;
                hlines.push(datas[i]);
            }
            $scope.gridSetData("hline_options", hlines);
            var focusCell = $scope.hline_options.api.getFocusedCell(), index = 0;
            if (focusCell != null) {
                index = focusCell.rowIndex;
            }
            $scope.gridSetData("line_options", hlines[index].sale_comminspec_lineofsale_comminspec_h_lines);
            $scope.cal_total();
            $scope.batchno(2);
        });
    }


    $scope.delhline = function () {
        $scope.gridDelItem("hline_options", undefined, true);
        $scope.batchno(2);
        var focusRow = $scope.gridGetRow("hline_options");
        if (!focusRow) {
            $scope.gridSetData("line_options", []);
        } else {
            if (focusRow.sale_comminspec_lineofsale_comminspec_h_lines.length != undefined) {
                $scope.gridSetData("line_options", focusRow.sale_comminspec_lineofsale_comminspec_h_lines);
            }
        }
        $scope.cal_total();
    }

    $scope.addnullline = function () {
        var item = {
            new_row: 2,
            sale_comminspec_lineofsale_comminspec_h_lines: [{new_row: 2,}],
        }
        $scope.gridAddItem("hline_options", item);
    }

    $scope.copyline = function () {
        var msg = [];
        if ($scope.data.currItem.warn_no == undefined || $scope.data.currItem.warn_no == "") {
            msg.push("出货预告不能为空");
            return;
        }

        $scope.FrmInfo = {
            classid: "sale_comminspec_header",
            postdata: {
                flag: 100,
                warn_id: $scope.data.currItem.warn_id,
            }
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (data) {
            if (data.comminspec_id == undefined) {
                return;
            }
            BasemanService.RequestPost("sale_comminspec_header", "select", {
                comminspec_id: data.comminspec_id,
            }).then(function (data) {
                $scope.data.currItem.sale_comminspec_h_lineofsale_comminspec_headers = data.sale_comminspec_h_lineofsale_comminspec_headers;
                for (var i = 0; i < data.sale_comminspec_h_lineofsale_comminspec_headers; i++) {
                    data.sale_comminspec_h_lineofsale_comminspec_headers[i].new_row = "4";
                }
                $scope.setitemline1($scope.data.currItem);
                $scope.cal_total();
                $scope.batchno(2);
            })
        });
    }


    /**------------------ 业务逻辑控制--------------------------**/
    /**************************网格区域***************/
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


    $scope.rowClicked = function (e) {
        if (e.data) {
            if (e.data.sale_comminspec_lineofsale_comminspec_h_lines == undefined) {
                e.data.sale_comminspec_lineofsale_comminspec_h_lines = []
            }
            var focusCell = e.api.getFocusedCell();
            var colDef = focusCell.column.colDef;
            if (colDef.editable_bak != undefined) {
                colDef.editable = colDef.editable_bak;
            }
            if (e.data.new_row == 2) {
                if (colDef.field != "seq") {
                    if (colDef.editable_bak == undefined) {
                        colDef.editable_bak = colDef.editable;
                    }
                    colDef.editable = true;
                }
            }
            $scope.gridSetData('line_options', e.data.sale_comminspec_lineofsale_comminspec_h_lines);
        }
    }

    $scope.hcellchange = function () {
        var options = "hline_options"
        var _this = $(this);
        var val = _this.val();

        var nodes = $scope[options].api.getModel().rootNode.childrenAfterGroup;
        var cell = $scope[options].api.getFocusedCell()
        var field = cell.column.colDef.field;
        var data = nodes[cell.rowIndex].data;
        data[field] = val;
        var lines = data.sale_comminspec_lineofsale_comminspec_h_lines;
        var hkey = [];
        if (field == "cust_spec") {
            for (var i = 0; i < lines.length; i++) {
                lines[i].cust_spec = val;
            }
        }
        if (field == "comminspec_qty") {
            var qty = 0, nw = 0, gw = 0, tj = 0;
            for (var i = 0; i < lines.length; i++) {
                qty = Number(val || 0);
                lines[i].comminspec_qty = qty;
                lines[i].amt = qty * Number(lines[i].price || 0);

                nw += qty * Number(lines[i].unit_nw || 0);
                gw += qty * Number(lines[i].unit_gw || 0);
                tj += qty * Number(lines[i].unit_tj || 0);
            }
            data.unit_nw = nw;
            data.unit_gw = gw;
            data.unit_tj = tj;
            hkey = ["unit_nw", "unit_gw", "unit_tj"];
        }
        if (field == "price") {
            data.print_price = Number(val || 0);
            hkey = ["print_price"];
            var priceh = Number(data.warn_price || 0),
                price = Number(data.price || 0), aprice = 0, pricel = 0;
            if (priceh > 0) {
                for (var i = 0; i < lines.length; i++) {
                    if (i == lines.length - 1) {
                        lines[i].price = price - aprice;
                        lines[i].print_price = lines[i].price;
                        lines[i].amt = lines[i].price * Number(lines[i].comminspec_qty || 0);
                        continue;
                    }
                    pricel = Number(lines[i].warn_price || 0);
                    lines[i].price = (pricel / priceh * price).toFixed(2);
                    lines[i].print_price = lines[i].price;
                    aprice += lines[i].price;
                    lines[i].amt = lines[i].price * Number(lines[i].comminspec_qty || 0);
                }
            }
        }
        if (field == "uom_name" || field == "unit_nw") {
            if (data.uom_name == "2") {
                data.comminspec_qty = data.unit_nw;
                data.prod_qty = data.unit_nw;
                data.amt = Number(data.comminspec_qty || 0) * Number(data.price || 0);
                hkey = ["comminspec_qty", "prod_qty", "amt"];
            }
        }
        if (data.new_row == "2") {
            lines[0][field] = data[field];
            if (field == "nw" || field == "gw" || field == "tj") {
                lines[0].unit_nw = data.nw;
                lines[0].unit_gw = data.gw;
                lines[0].unit_tj = data.tj;
            } else if (field == "comminspec_qty") {
                data.amt = Number(data.comminspec_qty || 0) * Number(data.price || 0);
                lines[0].amt = data.amt;
            } else if (field == "prod_qty") {
                data.comminspec_qty = data.prod_qty;
                lines[0].comminspec_qty = lines[0].prod_qty;
            }
            if (data.warn_h_id == undefined || data.warn_h_id == 0) {
                data.warn_h_id = $scope.get_max_id();
                lines[0].warn_h_id = data.warn_h_id;
            }
        }
        $scope[options].api.refreshCells(nodes, hkey);
        $scope.gridSetData("line_options", lines);
        $scope.cal_total();

    }

    $scope.get_max_id = function () {
        var maxid = -9;
        var datas = $scope.gridGetData("hline_options");
        for (var i = 0; i < datas.length; i++) {
            if (Number(datas[i].warn_h_id || 0) < maxid) {
                maxid = datas[i].warn_h_id;
            }
        }
        return --maxid;
    }

    $scope.cal_total = function () {
        var hlines = $scope.gridGetData("hline_options");
        var total_gw = 0, total_nw = 0, total_tj = 0, total_qty = 0, total_amt = 0, total_xqty = 0;
        for (var i = 0; i < hlines.length; i++) {
            total_gw += Number(hlines[i].unit_gw || 0);
            total_nw += Number(hlines[i].unit_nw || 0);
            total_tj += Number(hlines[i].unit_tj || 0);
            total_qty += Number(hlines[i].comminspec_qty || 0);
            total_amt += Number(hlines[i].amt || 0);
            total_xqty += Number(hlines[i].x_qty || 0);
        }
        $scope.data.currItem.total_gw = total_gw.toFixed(2);
        $scope.data.currItem.total_nw = total_nw.toFixed(2);
        $scope.data.currItem.total_tj = total_tj.toFixed(3);
        $scope.data.currItem.total_qty = total_qty;
        $scope.data.currItem.total_amt = total_amt.toFixed(2);
        $scope.data.currItem.total_xqty = total_xqty;
    }

    //hline_options
    $scope.hline_options = {
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
            var isGrouping = $scope.hline_options.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.hline_columns = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "形式发票号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "分票", field: "ab_votes", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "机型类别", field: "pro_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: [],
            },
            cellchange: $scope.hcellchange,
        }, {
            headerName: "公司型号", field: "cust_spec", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "品名(英文)", field: "brand_name_en", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: [{
                    value: "AIR CONDITIONER",
                    desc: "AIR CONDITIONER"
                }, {
                    value: "SPLIT WALL-MOUNTED TYPE AIR CONDITIONER",
                    desc: "SPLIT WALL-MOUNTED TYPE AIR CONDITIONER"
                }, {value: "MOTOR", desc: "MOTOR"}],
            },
            cellchange: $scope.hcellchange,
        }, {
            headerName: "出货预告数量", field: "prod_qty", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "本次商检数量", field: "comminspec_qty", editable: true, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "件数", field: "x_qty", editable: true, filter: 'set', width: 70,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "单位", field: "uom_name", editable: true, filter: 'set', width: 70,
            cellEditor: "下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: [{value: "1", desc: "Unit"}, {value: "2", desc: "Kgs"}],
            },
            cellchange: $scope.hcellchange,
        }, {
            headerName: "出货预告价格", field: "warn_price", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "单价", field: "price", editable: true, filter: 'set', width: 70,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "打印价格", field: "print_price", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "金额", field: "amt", editable: false, filter: 'set', width: 70,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "单位体积", field: "tj", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "总体积", field: "unit_tj", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "单位毛重", field: "gw", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "总毛重", field: "unit_gw", editable: true, filter: 'set', width: 90,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "单位净重", field: "nw", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "总净重", field: "unit_nw", editable: true, filter: 'set', width: 90,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "备注", field: "note", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "客户机型", field: "cust_spec", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "产品编码", field: "item_h_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "商检批号", field: "inspection_batchno", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "warn_h_id", field: "warn_h_id", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }, {
            headerName: "printed", field: "printed", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellchange: $scope.hcellchange,
        }
    ];

    $scope.linecellchange = function () {
        var options = "line_options"
        var _this = $(this);
        var val = _this.val();

        var nodes = $scope[options].api.getModel().rootNode.childrenAfterGroup;
        var cell = $scope[options].api.getFocusedCell()
        var field = cell.column.colDef.field;
        var hline = $scope.gridGetRow("hline_options");
        var lines = $scope.gridGetData(options);
        var line = lines[cell.rowIndex];
        line[field] = val;
        var nw = 0, gw = 0, tj = 0, qty = 0;
        if (field == "unit_nw" || field == "unit_gw" || field == "unit_tj") {
            for (var i = 0; i < lines.length; i++) {
                qty += Number(lines[i].comminspec_qty || 0);
                nw += Number(lines[i].unit_nw || 0);
                gw += Number(lines[i].unit_gw || 0);
                tj += Number(lines[i].unit_tj || 0);
            }
            hline.unit_nw = nw;
            hline.unit_gw = gw;
            hline.unit_tj = tj;
        }
        if (hline.new_row == "2") {
            hline[field] = line[field];
            if (field == "comminspec_qty") {
                line.amt = Number(line.comminspec_qty || 0) * Number(line.price || 0);
                hline.unit_nw = Number(line.comminspec_qty || 0) * Number(line.unit_nw || 0);
                hline.unit_gw = Number(line.comminspec_qty || 0) * Number(line.unit_gw || 0);
                hline.unit_tj = Number(line.comminspec_qty || 0) * Number(line.unit_tj || 0);
                hline.amt = line.amt;
                $scope[options].api.refreshCells(nodes, ["amt"]);
            }

            if (data.warn_h_id == undefined || data.warn_h_id == 0) {
                data.warn_h_id = $scope.get_max_id();
                lines[0].warn_h_id = data.warn_h_id;
            }
        }
        $scope.gridUpdateRow("hline_options", hline);
        $scope.cal_total();
    }

    //line_options
    $scope.line_options = {
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
            var isGrouping = $scope.line_options.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.line_columns = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "形式发票号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "机型类别", field: "pro_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: [],
            },
        }, {
            headerName: "客户机型", field: "cust_item_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "公司型号", field: "cust_spec", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "品名(英文)", field: "brand_name_en", editable: true, filter: 'set', width: 120,
            cellEditor: "下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: [{
                    value: "AIR CONDITIONER",
                    desc: "AIR CONDITIONER"
                }, {
                    value: "SPLIT WALL-MOUNTED TYPE AIR CONDITIONER",
                    desc: "SPLIT WALL-MOUNTED TYPE AIR CONDITIONER"
                }, {value: "MOTOR", desc: "MOTOR"}],
            },
        }, {
            headerName: "出货预告数量", field: "prod_qty", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "件数", field: "x_qty", editable: false, filter: 'set', width: 70,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "单位", field: "uom_name", editable: true, filter: 'set', width: 70,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: [{value: 1, desc: "Unit"}, {value: 2, desc: "Kgs"}],
            },
        }, {
            headerName: "出货预告价格", field: "warn_price", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "单价", field: "price", editable: true, filter: 'set', width: 70,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "打印价格", field: "print_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "金额", field: "amt", editable: false, filter: 'set', width: 70,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "单位体积", field: "tj", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "单位毛重", field: "gw", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "单位净重", field: "nw", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "总体积", field: "unit_tj", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "总毛重", field: "unit_gw", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "总净重", field: "unit_nw", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "备注", field: "note", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "产品编码", field: "item_h_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "商检批号", field: "inspection_batchno", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "打印价格", field: "print_price", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    //part_options
    $scope.part_options = {
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
            var isGrouping = $scope.part_options.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.part_columns = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            headerName: "生产单号", field: "prod_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分体机编码", field: "item_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "分体机名称", field: "item_name", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户型号", field: "cust_item_name", editable: true, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "描述", field: "part_desc", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "ERP编码", field: "erp_code", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "参考批次", field: "note", editable: false, filter: 'set', width: 85,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "需求数量", field: "require_qty", editable: false, filter: 'set', width: 85,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "已生产数量", field: "pproded_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "本次生产数量", field: "pprod_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "销售价格", field: "psale_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "成本价", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "金额", field: "amt", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "英文名", field: "part_en_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];

    $scope.refresh_after = function () {
        $scope.set_price_type2_name($scope.data.currItem.price_type_name);
        $scope.cal_total();
        $scope.batchno();
    }

    $scope.clearinformation = function () {
        $scope.data.currItem.price_changed = 1;
        $scope.data.currItem.price_changed2 = 1;
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.wfid = 0;
        $scope.data.currItem.wfflag = 0;
        $scope.data.currItem.sales_user_id = window.userbean.userid;
        $scope.data.currItem.creator = window.userbean.userid;
        $scope.data.currItem.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    }


    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('sale_comminspec_headerEdit', sale_comminspec_headerEdit)
