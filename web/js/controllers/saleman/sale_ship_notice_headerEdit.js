var billmanControllers = angular.module('inspinia');
function sale_ship_notice_headerEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {
    //继承基类方法
    sale_ship_notice_headerEdit = HczyCommon.extend(sale_ship_notice_headerEdit, ctrl_bill_public);
    sale_ship_notice_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_ship_notice_header",
        key: "notice_id",
        wftempid: 10006,
        FrmInfo: {},
        grids: [{optionname: 'options_11', idname: 'sale_ship_notice_lc_lineofsale_ship_notice_headers'},//信用证信息
            {optionname: 'options_12', idname: 'sale_ship_notice_sap_lineofsale_ship_notice_headers'},//sap回写信息

            {optionname: 'options_21', idname: 'sale_ship_item_lineofsale_ship_notice_headers'},//产品信息
            {optionname: 'options_22', idname: 'sale_ship_item_line_cofsale_ship_notice_headers'},//出货预告手工行

            {optionname: 'options_31', idname: 'sale_ship_package_lineofsale_ship_notice_headers'},//散件包装箱

            {optionname: 'options_41', idname: 'sale_pi_pay_lineofsale_ship_notice_headers'},//资金风险sale_pi_pay_lineofsale_ship_notice_headers
            {optionname: 'options_42', idname: 'sale_ship_notice_money_lineofsale_ship_notice_headers'},//款项分配明细
            {optionname: 'options_43', idname: 'sale_ship_notice_ciofsale_ship_notice_headers'},//中信保分配明细
            {optionname: 'options_44', idname: 'sale_ship_notice_feeofsale_ship_notice_headers'},//费用明细

            {optionname: 'options_51', idname: 'sale_ship_item_line2ofsale_ship_notice_headers'},//产品明细汇总
        ]
    };
    //发货通知、凭证差异录入初始化
    $scope.beforClearInfo = function () {
        var name = $rootScope.$state.$current.self.name;
        if (name == "crmman.sale_ship_notice_headerEdit") {//发货通知
            $scope.s_flag = 1;
            $scope.objconf.FrmInfo = {sqlBlock: ""}
        } else if (name == "crmman.sale_ship_notice_header_cyEdit") {//凭证差异录入
            $scope.s_flag = 2;
            $scope.objconf.FrmInfo = {sqlBlock: "sale_ship_notice_header.stat =5"}
        }
    };
    $scope.beforClearInfo();
    //出货预告跳转
    $scope.buttonClick = function () {
        if ($scope.data.currItem.notice_id == undefined || $scope.data.currItem.notice_id == 0) {
            return;
        }
        localeStorageService.set("crmman.sale_ship_warn_headerEdit", {
            warn_id: $scope.data.currItem.warn_id,
            flag: 3
        });
        $state.go("crmman.sale_ship_warn_headerEdit");

    };
    /****************系统词汇***************/
    {
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
        });
        //到款组织
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "scpent"}).then(function (data) {
            $scope.scpents = HczyCommon.stringPropToNum(data.dicts);
        });
        //付款方式系统词汇值
        BasemanService.RequestPost("base_search", "searchdict", {dictcode: "pay_style"}).then(function (data) {
            $scope.pay_styles = HczyCommon.stringPropToNum(data.dicts);
        });
        // 订单类型词汇
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "sale_order_type"}).then(function (data) {
            $scope.sale_order_types = HczyCommon.stringPropToNum(data.dicts);
        });
        //发运方式
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "ship_type"}).then(function (data) {
            $scope.ship_types = HczyCommon.stringPropToNum(data.dicts);
        });
        // 贸易类型词汇
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
            $scope.trade_types = HczyCommon.stringPropToNum(data.dicts);
        });
        //价格条款名称
        BasemanService.RequestPost("base_search", "search", {dictcode: "price_type"}).then(function (data) {
            $scope.price_types = HczyCommon.stringPropToNum(data.dicts);
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
            }
//        , {
//            id: 4,
//            name: "外销样机订单"
//        }
        ];
        /*********网格下拉值************/
        //机型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pro_type"}).then(function (data) {
            var pro_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                pro_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_21', 'pro_type')) {
                $scope.columns_21[$scope.getIndexByField('columns_21', 'pro_type')].cellEditorParams.values = pro_types;
            }
            if ($scope.getIndexByField('columns_22', 'pro_type')) {
                $scope.columns_22[$scope.getIndexByField('columns_22', 'pro_type')].cellEditorParams.values = pro_types;
            }

        });
        //剩余数量处理
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "deal_other"}).then(function (data) {
            var deal_others = [];
            for (var i = 0; i < data.dicts.length; i++) {
                deal_others[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_21', 'deal_other')) {
                $scope.columns_21[$scope.getIndexByField('columns_21', 'deal_other')].cellEditorParams.values = deal_others;
            }
            if ($scope.getIndexByField('columns_31', 'deal_other')) {
                $scope.columns_31[$scope.getIndexByField('columns_31', 'deal_other')].cellEditorParams.values = deal_others;
            }

        });
        //付款方式
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"}).then(function (data) {
            var pay_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                pay_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_41', 'pay_type')) {
                $scope.columns_41[$scope.getIndexByField('columns_41', 'pay_type')].cellEditorParams.values = pay_types;
            }
            $scope.columns_42[$scope.getIndexByField('columns_42', 'pay_type')].cellEditorParams.values = pay_types;
            if ($scope.getIndexByField('columns_43', 'pay_type')) {
                $scope.columns_43[$scope.getIndexByField('columns_43', 'pay_type')].cellEditorParams.values = pay_types;
            }

        });
        //柜型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "box_type"}).then(function (data) {
            var box_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                box_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_21', 'box_type')) {
                $scope.columns_21[$scope.getIndexByField('columns_21', 'box_type')].cellEditorParams.values = box_types;
            }
            if ($scope.getIndexByField('columns_22', 'box_type')) {
                $scope.columns_22[$scope.getIndexByField('columns_22', 'box_type')].cellEditorParams.values = box_types;
            }
            if ($scope.getIndexByField('columns_31', 'box_type')) {
                $scope.columns_31[$scope.getIndexByField('columns_31', 'box_type')].cellEditorParams.values = box_types;
            }

        });
    }
    /****************弹出窗口*****************/
    {
        //出货预告
        $scope.selectnotice = function () {
            if ($scope.data.currItem.stat != 1) {
                return;
            }
            $scope.FrmInfo = {
                title: "出货预告号查询",
                is_high: true,
                thead: [{
                    name: "出货预告号", code: "warn_no",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "合同号", code: "pi_no",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "PI号", code: "pi_nos",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "业务员", code: "sales_user_id",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "业务部门", code: "org_name",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "客户名称", code: "cust_name",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "备注", code: "note",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "状态", code: "stat",
                    show: true, iscond: true, type: 'string'
                }],
                classid: "sale_ship_warn_header",
                postdata: {},
                action: "search",
                is_custom_search: true,
                sqlBlock: "stat = 5 and is_notice_comp <> 2 and not exists (select 1 from sale_ship_warn_c_header warnc where warnc.warn_id=sale_ship_warn_header.warn_id and warnc.stat <> 5 and warnc.is_change=3)",
                searchlist: ["warn_no", "pi_no", "pi_nos", "sales_user_id", "org_name", "cust_name"]
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                result = HczyCommon.stringPropToNum(result)
                for (name in result) {
                    $scope.data.currItem[name] = result[name];
                }
                $scope.data.currItem.stat = 1;
                $scope.data.currItem.ship_type = parseInt(result.ship_type);
                $scope.data.currItem.pi_no = "";
                $scope.data.currItem.pino_new = result.pi_no;
                $scope.data.currItem.arr_entid = parseInt(result.entid);
                var postdata = {
                    warn_id: $scope.data.currItem.warn_id
                };
                BasemanService.RequestPost("sale_ship_notice_header", "dogetlcline", postdata)
                    .then(function (data) {
                        $scope.data.currItem.sale_ship_notice_lc_lineofsale_ship_notice_headers = data.sale_ship_notice_lc_lineofsale_ship_notice_headers;
                        $scope.options_11.api.setRowData($scope.data.currItem.sale_ship_notice_lc_lineofsale_ship_notice_headers);
                        //sap回写
                        $scope.data.currItem.sale_ship_notice_sap_lineofsale_ship_notice_headers = data.sale_notice_sapofsale_ship_notice_headers;
                        $scope.options_11.api.setRowData(data.sale_notice_sapofsale_ship_notice_headers);
                        //散件包装
                        $scope.data.currItem.sale_ship_package_lineofsale_ship_notice_headers = data.sale_ship_package_lineofsale_ship_notice_headers;
                        $scope.options_11.api.setRowData(data.sale_ship_package_lineofsale_ship_notice_headers);
                    })
            });
        };
        //PI号查询
        $scope.selectpi = function () {
            if ($scope.data.currItem.stat != 1) {
                return;
            }
            if ($scope.data.currItem.warn_id == undefined) {
                BasemanService.notice("请先选择出货预告", "alert-warning");
                return;
            }
            $scope.FrmInfo = {
                title: "PI号查询",
                is_high: true,
                thead: [{
                    name: "出货预告号", code: "warn_no",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "PI单号", code: "pi_no",
                    show: true, iscond: true, type: 'string'
                }],
                classid: "sale_pi_header",
                searchlist: ["h.warn_no", "p.pi_no"],
                is_custom_search: true,
                postdata: {flag: 5},
                sqlBlock: "l.warn_id =" + $scope.data.currItem.warn_id + " and h.stat= 5 "
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                $scope.data.currItem.pi_id = result.pi_id;
                $scope.data.currItem.pi_no = result.pi_no;
                BasemanService.RequestPost("sale_pi_header", "select", {
                        pi_id: $scope.data.currItem.pi_id,
                        pi_no: $scope.data.currItem.pi_no
                    })
                    .then(function (data) {
                        HczyCommon.stringPropToNum(data);
                        $scope.data.currItem.seaport_out_code = data.seaport_out_code;
                        $scope.data.currItem.seaport_out_id = data.seaport_out_id;
                        $scope.data.currItem.seaport_out_name = data.seaport_out_name;
                        $scope.data.currItem.sale_order_type = data.sale_order_type;
                        $scope.data.currItem.sale_ent_type = data.sale_ent_type;
                        $scope.data.currItem.exchange_rate = data.exchange_rate;
                        $scope.data.currItem.item_type_name = data.item_type_name;
                        $scope.data.currItem.item_type_no = data.item_type_no;
                        $scope.data.currItem.item_type_id = data.item_type_id;
                        $scope.data.currItem.price_type_code = data.price_type_code;
                        $scope.data.currItem.price_type_id = data.price_type_id;
                        $scope.data.currItem.price_type_name = data.price_type_name;

                        $scope.data.currItem.pre_ship_date = data.pre_ship_date;
                        $scope.data.currItem.currency_name = data.currency_name;
                        $scope.data.currItem.currency_code = data.currency_code;
                        $scope.data.currItem.currency_id = data.currency_id;
                        $scope.data.currItem.payment_type_code = data.payment_type_code;
                        $scope.data.currItem.payment_type_name = data.payment_type_name;
                        $scope.data.currItem.payment_type_id = data.payment_type_id;
                        $scope.data.currItem.pi_amt_total = data.amt_total;
                        $scope.data.currItem.total_amt = 0;

                        $scope.data.currItem.item_type_no = data.item_type_no;
                        $scope.data.currItem.brand_name = data.brand_name;
                        $scope.data.currItem.inspection_batchnos = data.inspection_batchnos;
                        $scope.data.currItem.area_name = data.area_name;


                        // total_pi_amt rate1 rate2 total_pi_u_amt apple_total_amt
                        $scope.data.currItem.total_pi_amt = data.amt_total;//PI总金额
                        //$scope.data.currItem.rate1 = data.last_out_date;//合同订金率
                        //$scope.data.currItem.rate2 = data.tt_amt_gathering;//TT出货订金率
                        //$scope.data.currItem.total_pi_u_amt = data.payment_type_name;//pi累计总额
                        //$scope.data.currItem.apple_total_amt = data.payment_type_code;//此次申请发货额

                        //最迟装柜日期 汇率 产品大类 货币  贸易类型 / 国家 付款类型
                        //费用明细
                        $scope.data.currItem.sale_ship_notice_feeofsale_ship_notice_headers = data.sale_pi_feeofsale_pi_headers;
                        $scope.options_44.api.setRowData(data.sale_pi_feeofsale_pi_headers);
                        //付款方式
                        $scope.data.currItem.sale_pi_pay_lineofsale_ship_notice_headers = data.sale_pi_pay_lineofsale_pi_headers;
                        $scope.options_41.api.setRowData(data.sale_pi_pay_lineofsale_pi_headers);
                        $scope.GetAmtMsgNot();
                    });
            })
        };
        $scope.GetAmtMsgNot = function () {
            BasemanService.RequestPost("sale_ship_notice_header", "getamtmsgnot", {
                    notice_id: $scope.data.currItem.notice_id,
                    cust_id: $scope.data.currItem.cust_id
                })
                .then(function (data) {
                    HczyCommon.stringPropToNum(data);
                    $scope.data.currItem.amt1 = parseFloat(data.amt1) || 0;
                    $scope.data.currItem.amt2 = parseFloat(data.amt2) || 0;
                    if (data.amt2 < 0) {
                        data.amt2 = 0
                    }
                    $scope.data.currItem.amt4 = parseFloat(data.amt4) || 0;
                    $scope.data.currItem.amt5 = parseFloat(data.amt5) || 0;
                    $scope.data.currItem.amt6 = parseFloat(data.amt6) || 0;
                    $scope.data.currItem.amt7 = parseFloat(data.amt7) || 0;
                    $scope.data.currItem.amt8 = parseFloat(data.amt8) || 0;
                    $scope.data.currItem.amt9 = parseFloat(data.amt9) || 0;
                    $scope.data.currItem.tq_amt = parseFloat(data.tq_amt) || 0;
                    $scope.data.currItem.rate2 = parseFloat(data.rate2) || 0;
                    $scope.data.currItem.rate1 = parseFloat(data.rate1) || 0;
                    $scope.data.currItem.total_pi_u_amt = parseFloat(data.total_pi_u_amt) || 0;
                    $scope.data.currItem.total_pi_a_amt = parseFloat(data.total_pi_a_amt) || 0;
                    $scope.data.currItem.max_pi_u_amt = parseFloat(data.max_pi_u_amt) || 0;
                    $scope.data.currItem.apple_total_amt = parseFloat(data.apple_total_amt) || 0;
                    if ($scope.data.currItem.amt1 > 0) {
                        $scope.data.currItem.amt2 / $scope.data.currItem.amt1 >= 1 ? $scope.data.currItem.ttsjchdjl = 100 : $scope.data.currItem.ttsjchdjl = $scope.data.currItem.amt2 / $scope.data.currItem.total_amt * 100;
                    } else {
                        $scope.data.currItem.ttsjchdjl = 0;
                        $scope.data.currItem.amt1 - $scope.data.currItem.amt2 > 0 ? $scope.data.currItem.ttsjchdjl = ($scope.data.currItem.amt1 - $scope.data.currItem.amt2).toFixed(4) : $scope.data.currItem.tttpje = 0;
                    }
                    if ($scope.data.currItem.amt1 - $scope.data.currItem.amt2 > 0) {
                        $scope.data.currItem.tttpje = ($scope.data.currItem.amt1 - $scope.data.currItem.amt2).toFixed(4);
                    } else {
                        $scope.data.currItem.tttpje = 0
                    }
                    ;

                    if ($scope.data.currItem.amt9 - $scope.data.currItem.amt8 > 0) {
                        $scope.data.currItem.lctpje = $scope.data.currItem.amt9 - $scope.data.currItem.amt8;
                    } else {
                        $scope.data.currItem.lctpje = 0
                    }
                    ;

                    if ($scope.data.currItem.amt7 - $scope.data.currItem.amt6 > 0) {
                        $scope.data.currItem.oatpje = $scope.data.currItem.amt7 - $scope.data.currItem.amt6;
                    } else {
                        $scope.data.currItem.oatpje = 0
                    }
                    ;

                });
        };
        //买方代码
        $scope.selectBuyerInfo = function () {
            if ($scope.data.currItem.stat != 1) {
                return;
            }
            $scope.FrmInfo = {
                title: "买方代码查询",
                is_high: true,
                thead: [
                    {
                        name: "中信保买方代码", code: "buyerno",
                        show: true, iscond: true, type: 'string'
                    }, {
                        name: "客户编码", code: "cust_code",
                        show: true, iscond: true, type: 'string'
                    }, {
                        name: "客户名称", code: "cust_name",
                        show: true, iscond: true, type: 'string'
                    }, {
                        name: "买方英文名称", code: "engname",
                        show: true, iscond: true, type: 'string'
                    }, {
                        name: "买方英文地址", code: "engaddress",
                        show: true, iscond: true, type: 'string'
                    }, {
                        name: "买方中文地址", code: "chnaddress",
                        show: true, iscond: true, type: 'string'
                    }, {
                        name: "买方中文名称", code: "chnname",
                        show: true, iscond: true, type: 'string'
                    }],
                classid: "edi_buyerinfo",
                sqlBlock: "",
                is_custom_search: true,
                action: "search",
                searchlist: ["buyerno", "cust_code", "cust_name", "engname", "engaddress", "chnaddress", "chnname"]
            };
            if ($scope.data.currItem.cust_id == undefined) $scope.data.currItem.cust_id = 0;
            $scope.FrmInfo.sqlBlock = "cust_id =" + $scope.data.currItem.cust_id;
            BasemanService.open(CommonPopController, $scope, "", "lg")
                .result.then(function (result) {
                $scope.data.currItem.buyer_code = result.buyerno;
                $scope.gridSetData('options_43', []);
            });
        };
        //OA申请
        $scope.chooseOA = function () {
            if ($scope.data.currItem.stat != 1) {
                return;
            }
            if ($scope.data.currItem.buyer_code == "" || $scope.data.currItem.buyer_code == undefined) {
                BasemanService.notice('请选择买方代码', "alert-info");
                return;
            }
            $scope.FrmInfo = {
                title: "OA申请单",
                is_high: true,
                thead: [
                    {
                        name: "额度申请单号", code: "ci_no",
                        show: true, iscond: true, type: 'string'
                    }, {
                        name: "中信保买方代码", code: "ci_code",
                        show: true, iscond: true, type: 'string'
                    }, {
                        name: "中信保买方名称", code: "ci_name",
                        show: true, iscond: true, type: 'string'
                    }, {
                        name: "买方英文名称", code: "engname",
                        show: true, iscond: true, type: 'string'
                    }, {
                        name: "中信保批复支付方式", code: "pay_type",
                        show: true, iscond: true, type: 'string'
                    }],
                classid: "sale_ci_header",
                sqlBlock: " sinosurebuyerno = '" + $scope.data.currItem.buyer_code + "'",
                action: "search",
                postdata: {flag: 10},
            };
            BasemanService.open(CommonPopController, $scope, "", "lg")
                .result.then(function (items) {
                var boo = false;
                if ($scope.gridGetData("options_43").length > 0) {
                    var data_ci = $scope.gridGetData("options_43");
                    for (var i = 0; i < data_ci.length; i++) {
                        if ((data_ci[i].ci_id == items.ci_id) && (data_ci[i].pay_type == items.pay_type)) {
                            boo = true;
                            break;
                        }
                    }
                }
                if (boo == false) {
                    var itemtemp = {
                        ci_no: items.ci_no || 0,
                        ci_id: items.ci_id || 0,
                        ci_code: items.ci_code || 0,
                        pay_type: Number(items.pay_type || 0),
                        credit_term: items.credit_term || 0,
                        amt_total: Number(items.amt_total || 0),
                        allot_amt: Number(items.allot_amt || 0),
                        use_amt: Number(items.use_amt || 0) + Number(items.sy_use_amt || 0),
                        newlapsdate: items.newlapsdate || 0,
                    }
                    $scope.gridAddItem('options_43', itemtemp);
                }
            });
        };
        //LC申请
        $scope.chooseLC = function () {
            if ($scope.data.currItem.stat != 1) {
                return;
            }
            if ($scope.data.currItem.buyer_code == "" || $scope.data.currItem.buyer_code == undefined) {
                BasemanService.notice('请选择买方代码', "alert-info");
                return;
            }
            var lcno = '';
            for (var i = 0; i < $scope.data.currItem.sale_ship_notice_money_lineofsale_ship_notice_headers.length; i++) {
                if (Number($scope.data.currItem.sale_ship_notice_money_lineofsale_ship_notice_headers[i].pay_type || 0) == 2) {
                    lcno = $scope.data.currItem.sale_ship_notice_money_lineofsale_ship_notice_headers[i].money_bill_no;
                }
            }
            if (lcno == "") {
                BasemanService.notice('请载入信用证!', "alert-info");
                return;
            }
            $scope.FrmInfo = {
                title: "LC申请单",
                is_high: true,
                thead: [
                    {
                        name: "额度申请单号",
                        code: "ci_no",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "中信保买方代码",
                        code: "ci_code",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "中信保买方名称",
                        code: "ci_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "信用期限",
                        code: "credit_term",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "中信保批复支付方式",
                        code: "pay_type",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "swift",
                        code: "swift",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "金额",
                        code: "amt_total",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }],
                classid: "sale_ci_header",
                sqlBlock: " sinosurebuyerno = '" + $scope.data.currItem.buyer_code + "'",
                action: "search",
                postdata: {
                    flag: 11,
                    creator: lcno
                },
            };
            BasemanService.open(CommonPopController, $scope, "")
                .result.then(function (items) {
                var boo = false;
                var data_ci = $scope.data.currItem.sale_ship_notice_ciofsale_ship_notice_headers;
                if (dataci.length > 0) {
                    for (var i = 0; i < dataci.length; i++) {
                        if ((dataci[i].ci_id == items.ci_id) && (dataci[i].pay_type == items.pay_type)) {
                            boo = true;
                            break;
                        }
                    }
                }
                if (boo == true) {
                    var itemtemp = {
                        ci_no: items.ci_no || 0,
                        ci_code: items.ci_code || 0,
                        pay_type: Number(items.pay_type || 0),
                        credit_term: items.credit_term || 0,
                        amt_total: Number(items.amt_total || 0),
                        allot_amt: Number(items.allot_amt || 0),
                        use_amt: Number(items.use_amt || 0) + Number(items.sy_use_amt || 0),
                        newlapsdate: items.newlapsdate || 0,
                    }
                    $scope.gridAddItem('options_43', itemTemp);
                    $scope.data.currItem.sale_ship_notice_ciofsale_ship_notice_headers = itemTemp;
                }
            });
        };
        //载入PI最新款项明细
        $scope.choosePILine = function () {
            if ($scope.data.currItem.stat != 1) {
                return;
            }
            if ($scope.data.currItem.warn_id == undefined || $scope.data.currItem.warn_id == 0) {
                BasemanService.notice("请先选择出货预告", "alert-warning");
                return;
            }
            if ($scope.data.currItem.pi_id == undefined || $scope.data.currItem.pi_id == 0) {
                BasemanService.notice("请选择PI号", "alert-warning");
                return;
            }
            BasemanService.RequestPost("sale_pi_header", "getmoneyline", {
                warn_id: $scope.data.currItem.notice_id,
                pi_id: $scope.data.currItem.pi_id,
                confirm_amt: 0,
                flag: 1
            }).then(function (items) {
                items = HczyCommon.stringPropToNum(items);
                var lcs = $scope.gridGetData("options_42");
                var isExists = false;
                for (var i = 0; i < items.length; i++) {
                    var isExists = HczyCommon.isExist(lcs, items[i], ["sprod_id", "sprod_no"], ["sprod_id", "sprod_no"]).exist;
                    items[i].pay_type = parseFloat(items[i].pay_type || 0);
                    if (isExists) {
                        continue;
                    }
                    $scope.gridAddItem('options_42', items[i]);
                }

            })
        };
    }
    /***************网格事件处理****************/
    {
        /***增加行、删除行*/
        $scope.additem = function () {
            if ($scope.data.currItem.warn_no == 0 || $scope.data.currItem.warn_no == undefined) {
                BasemanService.notice("清先选择'出货预告'", "alert-info");
                return;
            }
            if ($scope.data.currItem.pi_no == 0 || $scope.data.currItem.pi_no == undefined) {
                BasemanService.notice("清先选择'PI号'", "alert-info");
                return;
            }
            $scope.FrmInfo = {
                title: "产品查询",
                is_high: true,
                thead: [
                    {
                        name: "出货预告号",
                        code: "warn_no",
                        show: true,
                        iscond: true,
                        type: 'string',
                        // dicts:[{id:1,name:"ERP升级前"},{id:2,name:"ERP升级后"}]
                    }, {
                        name: "整机名称",
                        code: "cust_item_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "erp产品编码",
                        code: "erp_code",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "参考柜号",
                        code: "ref_box_no",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "数据状态",
                        code: "csh",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "装柜数量",
                        code: "qty",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "单价",
                        code: "price",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "备注",
                        code: "note",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }],
                classid: "sale_ship_warn_header",
                type: "checkbox",
                is_custom_search: true,
                searchlist: ["warn_no", "cust_item_name", "ref_box_no", "csh", "qty", "price", "note"],
                backdatas: "sale_ship_warn_lineofsale_ship_warn_headers",
                postdata: {
                    warn_id: $scope.data.currItem.warn_id,
                    pi_id: $scope.data.currItem.pi_id,
                    flag: 2
                }
            };
            BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (items) {
                if (items.length) {
                    var postdata = {};
                    var data1 = [];
                    var data = $scope.gridGetData("options_21");
                    if (data == undefined) {
                        data = [];
                    }
                    for (var i = 0; i < items.length; i++) {
                        var count3 = 0;
                        for (var j = 0; j < data.length; j++) {
                            if (items[i].warn_line_id == data[j].warn_line_id) {
                                count3 = count3 + 1;
                            }
                        }
                        if (count3 == 0) {
                            data.push(items[i]);
                        }

                    }
                    BasemanService.RequestPost("sale_ship_notice_header", "getpgflag", {
                        warn_id: $scope.data.currItem.warn_id,
                        pi_id: $scope.data.currItem.pi_id
                    }).then(function (data) {
                        $scope.data.currItem.is_pg = data.is_pg
                    });
                    BasemanService.RequestPost("sale_pi_header", "getboxqty", {
                        warn_id: $scope.data.currItem.warn_id,
                        pi_id: $scope.data.currItem.pi_id
                    }).then(function (data) {
                        //$scope.data.currItem.sale_pi_box_lineofsale_ship_notice_headers = data.sale_pi_box_lineofsale_pi_headers;
                        //$scope.data.currItem.sale_pi_feeofsale_ship_notice_headers = data.sale_pi_feeofsale_pi_headers
                    });
                    BasemanService.RequestPost("sale_ship_notice_header", "search", {notice_id: $scope.data.currItem.notice_id}).then(function (data) {
                        $scope.data.currItem.sale_ship_item_h_lineofsale_ship_notice_headers = data.sale_ship_item_h_lineofsale_ship_notice_headers;
                    });
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].deal_other == undefined || data[i].deal_other == "") {
                            data[i].deal_other = 0;
                        }
                    }
                    $scope.options_21.api.setRowData(data);
                    $scope.data.currItem.sale_ship_item_lineofsale_ship_notice_headers = data;
                    for (var i = 0; i < $scope.data.currItem.sale_ship_item_lineofsale_ship_notice_headers.length; i++) {
                        $scope.data.currItem.sale_ship_item_lineofsale_ship_notice_headers[i].seq = parseInt(i + 1);
                    }
                }
                $scope.aggreate();
                $scope.partSummary();
            })
        };
        $scope.delitem = function () {
            //避免填写数据丢失
            $scope.options_21.api.stopEditing(false);
            var data = [];
            var rowidx = $scope.options_21.api.getFocusedCell().rowIndex;
            var node = $scope.options_21.api.getModel().rootNode.allLeafChildren;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            }
            data.splice(rowidx, 1);
            $scope.options_21.api.setRowData(data);
            $scope.data.currItem.sale_ship_item_lineofsale_ship_notice_headers = data;
            $scope.aggreate();
        };
        $scope.addnoticeitem = function () {
            if ($scope.data.currItem.warn_no == "") {
                BasemanService.notice('请先选择出货预告号', "alert-info");
                return;
            }
            var postdata = {
                warn_id: $scope.data.currItem.warn_id
            };
            // var data = $scope.data.currItem.sale_ship_item_lineofsale_ship_notice_headers
            var data = $scope.gridGetData("options_21");
            if (data.length > 0) {
                var sql = "";
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ref_box_no == undefined) {
                        data[i].ref_box_no = "";
                    }
                    if (i == 0) {
                        sql = data[i].ref_box_no;
                    } else {
                        sql = sql + "," + data[i].ref_box_no
                    }
                }
                postdata.sqlwhere = 'ref_box_no in (' + sql + ')';
                BasemanService.RequestPost("sale_ship_warn_header", "seleteitemline_c", postdata)
                    .then(function (result) {
                        //发货数量  已发货确认数量 实际发货数量 取数逻辑
                        //进厂时间  出厂时间 控制
                        $scope.options_22.api.setRowData(result.sale_ship_warn_lineofsale_ship_warn_headers);
                        $scope.data.currItem.sale_ship_item_line_cofsale_ship_notice_headers = result.sale_ship_warn_lineofsale_ship_warn_headers;
                        // $scope.GetTotolRow();
                    });
            }
        };
        $scope.GetTotolRow = function () {
            var data = $scope.gridGetData("options_21");
            if (data[0].prod_no == "") {
                var count = 0;
            } else {
                count = data.length - 1;
                // s=tsItemLine.Caption;
            }
        };
        $scope.delnoticeitem = function () {
            //避免填写数据丢失
            $scope.options_22.api.stopEditing(false);
            var data = [];
            var rowidx = $scope.options_22.api.getFocusedCell().rowIndex;
            var node = $scope.options_22.api.getModel().rootNode.allLeafChildren;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            }
            data.splice(rowidx, 1);
            $scope.options_22.api.setRowData(data);
            $scope.data.currItem.sale_ship_item_line_cofsale_ship_notice_headers = data;
            $scope.aggreate();
        };
        /**拆分行*/
        $scope.split = function () {
            var select_row = $scope.selectGridGetData('options_21');
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
            BasemanService.openFrm("views/popview/Pop_SpliceDrpg.html", PopCopyLineController, $scope)
                .result.then(function (result) {
                var spiltRow = new Array(result.split_num);
                var selectedRow = new Array(result.split_num);
                for (i = 0; i < result.split_num; i++) {
                    spiltRow[i] = new Object();
                    for (var name in datachose) {
                        spiltRow[i][name] = datachose[name];
                    }
                    spiltRow[i].seq = seqMax + i + 1;
                    selectedRow[i] = dataAoColumn.length + i;
                }
                //数量拆分
                var sumTotal = datachose.qty;
                for (i = 0; i < result.split_num; i++) {
                    spiltRow[i].qty = parseInt(sumTotal / (result.split_num - i));
                    sumTotal = sumTotal - spiltRow[i].qty;
                    dataAoColumn.push(spiltRow[i]);
                    //根据数量赋值
                    spiltRow[i].notice_line_id = 0;
                    spiltRow[i].notice_id = 0;
                    spiltRow[i].line_amt = spiltRow[i].price * spiltRow[i].qty;
                    spiltRow[i].total_nw = spiltRow[i].unit_nw * spiltRow[i].qty;
                    spiltRow[i].total_nw = spiltRow[i].unit_nw * spiltRow[i].qty;
                    spiltRow[i].p_total_nw = spiltRow[i].unit_nw * spiltRow[i].qty;
                    spiltRow[i].total_gw = spiltRow[i].unit_nw * spiltRow[i].qty;
                    spiltRow[i].p_total_gw = spiltRow[i].unit_nw * spiltRow[i].qty;
                    spiltRow[i].total_tj = parseFloat(spiltRow[i].pack_rule) * spiltRow[i].qty;
                    spiltRow[i].p_total_tj = parseFloat(spiltRow[i].pack_rule) * spiltRow[i].qty;
                    spiltRow[i].pack_style = spiltRow[i].qty;
                    spiltRow[i].printqty = spiltRow[i].qty;
                    spiltRow[i].printxqty = spiltRow[i].qty;

                }
                $scope.options_21.api.setRowData(dataAoColumn);
                $scope.data.currItem.sale_ship_item_lineofsale_ship_notice_headers = data;
            });
        };
        //产品明细汇总
        $scope.aggreate = function () {
            var data2 = [], identify = [];
            var data = $scope.gridGetData("options_21");
            for (var i = 0; i < data.length; i++) {
                var count = 0;
                if (i == 0) {
                    identify.push(data[i].erp_code)
                } else {
                    for (var j = 0; j < identify.length; j++) {
                        if (data[i].erp_code == identify[j]) {
                            count = count + 1;
                        }
                    }
                }
                if (count == 0 && i != 0) {
                    identify.push(data[i].erp_code);
                }
            }
            for (var i = 0; i < identify.length; i++) {
                var count1 = 0;
                for (var j = 0; j < data.length; j++) {
                    if (identify[i] == data[j].erp_code) {
                        if (count1 == 0) {
                            var object = $.extend({}, data[j]);
                            count1 = count1 + 1;
                        } else {
                            object.qty = parseInt(object.qty) + parseInt(data[j].qty);
                            object.line_amt = parseInt(object.line_amt) + parseInt(data[j].line_amt);
                            object.total_gw = parseInt(object.total_gw) + parseInt(data[j].total_gw);
                            object.total_nw = parseInt(object.total_nw) + parseInt(data[j].total_nw);
                        }
                    }
                }
                data2.push(object);
            }
            // $scope.options_41.grid.setData(data2);
            // $scope.options_41.grid.resizeCanvas();
            $scope.options_51.api.setRowData(data2);
            $scope.data.currItem.sale_ship_item_line2ofsale_ship_notice_headers = data2;
        };
        //合计
        $scope.partSummary = function () {
            $timeout(function () {
                var griddata = $scope.gridGetData("options_21");
                $scope.data.currItem.le_amt = 0;
                $scope.data.currItem.pk_style = 0;
                $scope.data.currItem.ut_gw = 0;
                $scope.data.currItem.tl_gw = 0;
                $scope.data.currItem.ut_nw = 0;
                $scope.data.currItem.tl_nw = 0;
                //金额
                for (var i = 0; i < griddata.length; i++) {
                    if (parseFloat(griddata[i].line_amt) != undefined) {
                        $scope.data.currItem.le_amt += parseFloat(griddata[i].line_amt || 0);
                    }
                    if (parseFloat(griddata[i].pack_style) != undefined) {
                        $scope.data.currItem.pk_style += parseFloat(griddata[i].pack_style || 0);
                    }
                    if (parseFloat(griddata[i].unit_gw) != undefined) {
                        $scope.data.currItem.ut_gw += parseFloat(griddata[i].unit_gw || 0);
                    }
                    if (parseFloat(griddata[i].total_gw) != undefined) {
                        $scope.data.currItem.tl_gw += parseFloat(griddata[i].total_gw || 0);
                    }
                    if (parseFloat(griddata[i].unit_nw) != undefined) {
                        $scope.data.currItem.ut_nw += parseFloat(griddata[i].unit_nw || 0);
                    }
                    if (parseFloat(griddata[i].total_nw) != undefined) {
                        $scope.data.currItem.tl_nw += parseFloat(griddata[i].total_nw || 0);
                    }
                }
                //金额
                $scope.data.currItem.le_amt = $scope.data.currItem.le_amt.toFixed(2);
                //总件数
                $scope.data.currItem.pk_style = $scope.data.currItem.pk_style.toFixed(2);
                //毛重
                $scope.data.currItem.ut_gw = $scope.data.currItem.ut_gw.toFixed(2);
                //总毛重
                $scope.data.currItem.tl_gw = $scope.data.currItem.tl_gw.toFixed(2);
                //总单位净重
                $scope.data.currItem.ut_nw = $scope.data.currItem.ut_nw.toFixed(2);
                //净重小计
                $scope.data.currItem.tl_nw = $scope.data.currItem.tl_nw.toFixed(2);
            }, 1);
        };
        //参考柜号关联-实际柜号、封条号、车牌号
        $scope.acellchange = function () {
            var options = "options_21";
            var _this = $(this);
            var val = _this.val();
            var data = $scope.gridGetData("options_21");
            var nodes = $scope[options].api.getModel().rootNode.childrenAfterGroup;
            var cell = $scope[options].api.getFocusedCell();
            var field = cell.column.colDef.field;
            var item = nodes[cell.rowIndex].data;
            for (var i = 0; i < data.length; i++) {
                if (i != cell.rowIndex) {
                    if (data[i].ref_box_no == data[cell.rowIndex].ref_box_no) {
                        data[i][field] = val;
                    }
                }
            }
            var cellnodes = [];
            for (var j = 0; j < nodes.length; j++) {
                if (j != cell.rowIndex) {
                    cellnodes.push(nodes[j]);
                }
            }
            $scope.options_21.api.refreshCells(cellnodes, [field]);
        };
        //散件包装箱
        $scope.acellchange31 = function () {
            var options = "options_31";
            var _this = $(this);
            var val = _this.val();
            var data = $scope.gridGetData("options_31");
            var nodes = $scope[options].api.getModel().rootNode.childrenAfterGroup;
            var cell = $scope[options].api.getFocusedCell();
            var field = cell.column.colDef.field;
            var item = nodes[cell.rowIndex].data;
            for (var i = 0; i < data.length; i++) {
                if (i != cell.rowIndex) {
                    if (data[i].ref_box_no == data[cell.rowIndex].ref_box_no) {
                        data[i][field] = val;
                    }
                }
            }
            var cellnodes = [];
            for (var j = 0; j < nodes.length; j++) {
                if (j != cell.rowIndex) {
                    cellnodes.push(nodes[j]);
                }
            }
            $scope.options_31.api.refreshCells(cellnodes, [field]);
        };
        /**网格切换事件*/
        $scope.rowClicked21 = function (e) {

        };
    }
    /****************网格定义***************/
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
        //信用证
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
            rowClicked: $scope.rowClicked,
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
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "信用证号", field: "lc_bill_no", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发货人", field: "send_man", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "收货人", field: "receive_man", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "通知人", field: "notice_man", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "船证明", field: "vessel_certificate", editable: false, filter: 'set', width: 150,
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
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "其它要求", field: "note", editable: true, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
        ];
        //sap信息
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
            rowClicked: $scope.rowClicked,
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
            {
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "通知单No", field: "notice_no", editable: true, filter: 'set', width: 200,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "PI号", field: "pi_no", editable: true, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "SAP内部订单号", field: "interior_sap", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "SAP销售订单号", field: "sale_sap", editable: true, filter: 'set', width: 200,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "SAP交货订单号", field: "delorder_sap", editable: true, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "SAP发货订单号", field: "outno_sap", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "SAP发票号", field: "fapiao_sap", editable: true, filter: 'set', width: 200,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "SAP发票凭证号", field: "kaipiao_sap", editable: true, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "SAP发货单手工行开票凭证号", field: "shougong_sap", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "SAP免费样机/配件出库凭证号", field: "yangji_sap", editable: true, filter: 'set', width: 200,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "SAP公司间发票号", field: "company_fapiao", editable: true, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "SAP公司间发票凭证号", field: "company_kaipiao", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
        ];
        //sheet页第二页 产品信息
        $scope.options_21 = {
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
            selectAll: true,
            rowClicked: $scope.rowClicked21,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_21.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };

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
                    items[i].lc_no = item.lc_no;
                }
            }
            $scope.gridSetData("aoptions", items);
        }

        $scope.a_select_lc = function () {
            var forcusrow = $scope.gridGetRow("options_21");
            $scope.FrmInfo = {
                sqlBlock: " pi_id =" + $scope.data.currItem.pi_id,
                classid: "fin_lc_bill",
                postdata: {
                    flag: 3,
                },
            }
            BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
                if (result.lc_bill_id == undefined) {
                    return;
                }
                forcusrow.lc_bill_no = result.lc_bill_no;
                forcusrow.lc_bill_id = result.lc_bill_id;
                forcusrow.lc_no = result.lc_no;
                $scope.gridUpdateRow("options_21", forcusrow);
            })

        }

        $scope.columns_21 = [
            {
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                checkboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                }
            }, {
                headerName: "机型类别", field: "pro_type", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "柜型", field: "box_type", editable: false, filter: 'set', width: 80,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "客户机型", field: "cust_item_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "Erp产品编码", field: "erp_code", editable: false, filter: 'set', width: 140,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "AB票", field: "ab_votes", editable: false, filter: 'set', width: 80,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            /*{
             headerName: "铭牌编号", field: "plate_code", editable: true, filter: 'set', width: 120,
             cellEditor: "浮点框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
             },*/
            {
                headerName: "产品名称", field: "item_name", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "参考柜号", field: "ref_box_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "排柜序号", field: "box_seq", editable: false, filter: 'set', width: 85,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "装柜数量", field: "qty", editable: false, filter: 'set', width: 85,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "实际柜号", field: "actual_box_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellchange: $scope.acellchange
            }, {
                headerName: "封条号", field: "seal", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellchange: $scope.acellchange
            }, {
                headerName: "车牌号", field: "car_code", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellchange: $scope.acellchange
            }, {
                headerName: "进厂时间", field: "car_intime", editable: false, filter: 'set', width: 100,
                cellEditor: "时分秒",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                non_empty: true,
                cellchange: $scope.acellchange
            }, {
                headerName: "出厂时间", field: "car_outtime", editable: false, filter: 'set', width: 100,
                cellEditor: "时分秒",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                non_empty: true,
                cellchange: $scope.acellchange
            }, {
                headerName: "实际发货数量", field: "out_qty", editable: false, filter: 'set', width: 120,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                non_empty: true,
                floatCell: true
            }, {
                headerName: "提单号", field: "td_code", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellchange: $scope.acellchange
            }/*, {
             headerName: "业务选配结算差价", field: "c_price", editable: false, filter: 'set', width: 140,
             cellEditor: "浮点框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
             }*/, {
                headerName: "预计到柜时间", field: "pre_box_date", editable: false, filter: 'set', width: 120,
                cellEditor: "时分秒",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "工厂超时原因", field: "car_note", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }/*, {
             headerName: "汇兑损益", field: "S4", editable: false, filter: 'set', width: 100,
             cellEditor: "浮点框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
             }, {
             headerName: "返利", field: "S7", editable: false, filter: 'set', width: 85,
             cellEditor: "浮点框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
             }*/, {
                headerName: "剩余数量处理", field: "deal_other", editable: true, filter: 'set', width: 130,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "单价", field: "price", editable: false, filter: 'set', width: 85,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "金额", field: "line_amt", editable: false, filter: 'set', width: 85,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "件数", field: "pack_style", editable: true, filter: 'set', width: 85,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "单位毛重", field: "unit_gw", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "毛重小计", field: "total_gw", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "单位净重", field: "unit_nw", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "净重小计", field: "total_nw", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "商检批次号", field: "inspection_batchno", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "备注", field: "note", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
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
        //出货预告手工号
        $scope.options_22 = {
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
            //rowClicked: $scope.rowClicked,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_22.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_22 = [
            {
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                //cellchange:$scope.bankBalance,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "机型类别", field: "pro_type", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "柜型", field: "box_type", editable: false, filter: 'set', width: 80,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "客户机型", field: "cust_item_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "Erp产品编码", field: "erp_code", editable: false, filter: 'set', width: 140,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "产品名称", field: "item_name", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "排柜序号", field: "box_seq", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "参考柜号", field: "ref_box_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "实际柜号", field: "actual_box_no", editable: false, filter: 'set', width: 100,
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
                headerName: "发货数量", field: "send_qty", editable: true, filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "已发货确认数量", field: "actual_out_qty", editable: false, filter: 'set', width: 130,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "实际发货数量", field: "out_qty", editable: true, filter: 'set', width: 120,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "件数", field: "pack_style", editable: false, filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "体积", field: "pack_rule", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "毛重", field: "unit_gw", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "净重", field: "unit_nw", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },

            {
                headerName: "总毛重", field: "total_gw", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "总净重", field: "total_nw", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "总体积", field: "total_tj", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "预计到柜时间", field: "pre_box_date", editable: false, filter: 'set', width: 120,
                cellEditor: "时分秒",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "实际到柜时间", field: "actual_box_date", editable: true, filter: 'set', width: 100,
                cellEditor: "时分秒",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "进厂时间", field: "car_intime", editable: false, filter: 'set', width: 100,
                cellEditor: "时分秒",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "出厂时间", field: "car_outtime", editable: false, filter: 'set', width: 100,
                cellEditor: "时分秒",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "批次号", field: "inspection_batchno", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        /*****************第3页*****************/
        //散件包装箱
        $scope.options_31 = {
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
            //rowClicked: $scope.rowClicked,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_22.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_31 = [
            {
                headerName: "商检批号", field: "inspection_batchno", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "ERP编码", field: "erp_code", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "成品物料描述", field: "cust_spec", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "柜序号", field: "box_seq", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "柜型", field: "box_type", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "参考柜号", field: "ref_box_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "包装箱编码", field: "package_code", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "包装箱条码", field: "package_code2", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "包装箱描述", field: "package_desc", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "毛重", field: "package_gw", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "净重", field: "package_nw", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "体积", field: "package_tj", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "数量", field: "qty", editable: false, filter: 'set', width: 100,
                cellEditor: "整数框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "实发数量", field: "out_qty", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "剩余数量处理", field: "deal_other", editable: false, filter: 'set', width: 130,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: []
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "实际柜号", field: "actual_box_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellchange: $scope.acellchange31,
            },
            {
                headerName: "封条号", field: "seal", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellchange: $scope.acellchange31,
            },
            {
                headerName: "车牌号", field: "car_code", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellchange: $scope.acellchange31,
            },
            {
                headerName: "提单号", field: "td_code", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellchange: $scope.acellchange31,
            },
            {
                headerName: "进厂时间", field: "car_intime", editable: false, filter: 'set', width: 100,
                cellEditor: "时分秒",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellchange: $scope.acellchange31,
            },
            {
                headerName: "出厂时间", field: "car_outtime", editable: false, filter: 'set', width: 100,
                cellEditor: "时分秒",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellchange: $scope.acellchange31,
            },
            {
                headerName: "发货备注", field: "car_note", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
        ];
        /*************第4页资金风险**************/
        $scope.options_41 = {
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
            //rowClicked: $scope.rowClicked,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_41.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_41 = [
            {
                headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "付款方式", field: "pay_type", editable: false, filter: 'set', width: 150,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "付款比例(%)", field: "pay_ratio", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "本次应支付金额", field: "amount", editable: false, filter: 'set', width: 150,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];

        $scope.rowClicked_42 = function (e) {
            if ($scope.data.currItem.stat >= 5 ) {
                return;
            }
            if( e.data.pay_type != "2"){
                e.colDef.editable = false;
                return;
            }
            if (e.colDef.field == "y_amt" || e.colDef.field == "b_amt") {
                e.colDef.editable = true;
            }
        }

        //款项分配明细
        $scope.options_42 = {
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
            rowClicked: $scope.rowClicked_42,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_42.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_42 = [
            {
                headerName: "付款方式", field: "pay_type", editable: false, filter: 'set', width: 150,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "对应单据号", field: "source_bill_no", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "资金单号", field: "money_bill_no", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "生产单分配金额", field: "amount", editable: false, filter: 'set', width: 150,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "发货分配金额", field: "this_send_amt", editable: true, filter: 'set', width: 150,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "海运费", field: "y_amt", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "保险费", field: "b_amt", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "已发货金额", field: "send_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "生产单号", field: "sprod_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        //中信保明细
        $scope.options_43 = {
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
            //rowClicked: $scope.rowClicked,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_43.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_43 = [
            {
                headerName: "中信保申请单号", field: "ci_no", editable: false, filter: 'set', width: 140,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "中信保买方代码", field: "ci_code", editable: false, filter: 'set', width: 125,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "中信保支付方式", field: "pay_type", editable: false, filter: 'set', width: 140,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "信用期限", field: "credit_term", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "申请金额", field: "amt_total", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
            , {
                headerName: "分配金额", field: "allot_amt", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                non_empty: true,
                floatCell: true
            }
            , {
                headerName: "已使用金额", field: "use_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
            , {
                headerName: "预计失效时间", field: "newlapsdate", editable: false, filter: 'set', width: 130,
                cellEditor: "时分秒",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        //费用明细
        $scope.options_44 = {
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
            //rowClicked: $scope.rowClicked,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_44.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_44 = [
            {
                headerName: "形式发票ID", field: "pi_id", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "订单费用编码", field: "order_fee_code", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "订单费用名称", field: "order_fee_name", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "费用", field: "notice_fee", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "PI费用", field: "amt_fee", editable: true, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "订单费用ID", field: "order_fee_id", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "形式发票单号", field: "pi_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "通知单No", field: "notice_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "备注", field: "note", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        //第四页产品明细汇总
        $scope.options_51 = {
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
            //rowClicked: $scope.rowClicked,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_51.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_51 = [
            {
                headerName: "排产单号", field: "prod_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "PI单号", field: "pi_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "客户机型", field: "cust_item_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "产品名称", field: "item_name", editable: false, filter: 'set', width: 200,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "Erp产品编码", field: "erp_code", editable: false, filter: 'set', width: 100,
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
                headerName: "单价", field: "price", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "金额", field: "line_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "商检批号", field: "inspection_batchno", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
    }
    /***************导出excel**********/
    {
        $scope.exportjy1 = function () {
            if (!$scope.data.currItem.pi_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_notice_header", "exporttoexceljy1", {'notice_id': $scope.data.currItem.notice_id})
                .then(function (data) {
                    if (data.docid != undefined && Number(data.docid) != 0) {
                        var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                        window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                    } else {
                        BasemanService.notice("导出失败!", "alert-info");
                    }
                });
        };
        $scope.exportjy2 = function () {
            if (!$scope.data.currItem.pi_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_notice_header", "exporttoexceljy2", {'notice_id': $scope.data.currItem.notice_id})
                .then(function (data) {
                    if (data.docid != undefined && Number(data.docid) != 0) {
                        var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                        window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                    } else {
                        BasemanService.notice("导出失败!", "alert-info");
                    }
                });
        };
        $scope.exportjy3 = function () {
            if (!$scope.data.currItem.pi_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_notice_header", "exporttoexceljy3", {'notice_id': $scope.data.currItem.notice_id})
                .then(function (data) {
                    if (data.docid != undefined && Number(data.docid) != 0) {
                        var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                        window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                    } else {
                        BasemanService.notice("导出失败!", "alert-info");
                    }
                });
        };
        $scope.exportjy3 = function () {
            if (!$scope.data.currItem.pi_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_notice_header", "exporttoexceljy3", {'notice_id': $scope.data.currItem.notice_id})
                .then(function (data) {
                    if (data.docid != undefined && Number(data.docid) != 0) {
                        var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                        window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                    } else {
                        BasemanService.notice("导出失败!", "alert-info");
                    }
                });
        };
        $scope.exportjy4 = function () {
            if (!$scope.data.currItem.pi_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_notice_header", "exporttoexceljy4", {'notice_id': $scope.data.currItem.notice_id})
                .then(function (data) {
                    if (data.docid != undefined && Number(data.docid) != 0) {
                        var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                        window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                    } else {
                        BasemanService.notice("导出失败!", "alert-info");
                    }
                });
        };
        $scope.exportjy5 = function () {
            if (!$scope.data.currItem.pi_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_notice_header", "exporttoexceljy5", {'notice_id': $scope.data.currItem.notice_id})
                .then(function (data) {
                    if (data.docid != undefined && Number(data.docid) != 0) {
                        var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                        window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                    } else {
                        BasemanService.notice("导出失败!", "alert-info");
                    }
                });
        };
        $scope.exportjy6 = function () {
            if (!$scope.data.currItem.pi_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_notice_header", "exporttoexceljy6", {'notice_id': $scope.data.currItem.notice_id})
                .then(function (data) {
                    if (data.docid != undefined && Number(data.docid) != 0) {
                        var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                        window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                    } else {
                        BasemanService.notice("导出失败!", "alert-info");
                    }
                });
        };
        $scope.exportjy7 = function () {
            if (!$scope.data.currItem.pi_id) {
                BasemanService.notice("未识别单据", "alert-info");
                return;
            }
            BasemanService.RequestPost("sale_ship_notice_header", "exporttoexceljy7", {'notice_id': $scope.data.currItem.notice_id})
                .then(function (data) {
                    if (data.docid != undefined && Number(data.docid) != 0) {
                        var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                        window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                    } else {
                        BasemanService.notice("导出失败!", "alert-info");
                    }
                });
        };
    }
    /********************初始化页面、保存校验***********************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,
            seaport_out_id: 1,
            pi_date: moment().format('YYYY-MM-DD HH:mm:ss'),
//             delivery_date: moment().add('days', 35).format('YYYY-MM-DD HH:mm:ss'),
            currency_id: 4,
            order_type_id: 1,
            price_type_id: 1,
            ship_type: 1,
            arr_entid: 101
        };
    };
    $scope.validate = function () {
        var errorlist = [];
        $scope.data.currItem.sale_ship_item_lineofsale_ship_notice_headers.length == 0 ? errorlist.push("产品信息为空") : 0;
//        $scope.data.currItem.total_amt == 0 ? errorlist.push("资金风险页中'发货总额'不能为0") : 0;
        if (errorlist.length) {
            BasemanService.notice(errorlist, "alert-warning");
            return false;
        }
        if ($scope.data.currItem.stat != 1 && $scope.data.currItem.currprocname == '仓库') {
            //仓库节点校验  散件包装箱
            var data31 = $scope.data.currItem.sale_ship_package_lineofsale_ship_notice_headers;
            if (data31.length > 0) {
                for (var i = 0; i < data31.length; i++) {
                    if ((Number(data31[i].out_qty || 0) == 0) && ($scope.data.currItem.stat != 5) && (Number(data31[i].deal_other || 0) == 0)) {
                        BasemanService.notice("'散件包装箱'明细第" + (i + 1) + "行实发数量为0，请填写'剩余数量处理'", "alert-warning");
                        return;
                    }
                }
            }
            //产品明细判断
            var data21 = $scope.data.currItem.sale_ship_item_lineofsale_ship_notice_headers;
            if (data21.length > 0) {
                for (var i = 0; i < data21.length; i++) {
                    if (Number(data21[i].out_qty || 0) == 0 && $scope.data.currItem.stat != 5 && Number(data21[i].deal_other || 0) == 0) {
                        BasemanService.notice("'产品信息'明细第" + (i + 1) + "行实际发数量为0，请填写'剩余数量处理'", "alert-warning");
                        return;
                    }
                }
            }
        }
        return true;
    };
    //保存之前
    $scope.save_before = function (postdata) {
        var name = $rootScope.$state.$current.self.name;
        if (name == "crmman.sale_ship_notice_header_cyEdit") {
            $scope.data.currItem.flag = 20;
        }
        delete  $scope.data.currItem.sale_pi_box_lineofsale_ship_notice_headers;
        delete  $scope.data.currItem.sale_pi_feeofsale_ship_notice_headers;
        delete  $scope.data.currItem.sale_pi_pay_lineofsale_pi_headers;
        var msg = [];
        var data = $scope.gridGetData("options_42");
        for (var i = 0; i < data.length; i++) {
            if (!(data[i].this_send_amt == undefined || data[i].this_send_amt == "0")) {
                msg.push(data[i]);
            }
        }
        ;
        postdata.sale_ship_notice_money_lineofsale_ship_notice_headers = msg;
        if ($scope.data.currItem.currprocname == '仓库' || $scope.data.currItem.currprocname == 'admin' && $scope.data.currItem.stat == 3) {
            postdata.flag = 12;
        }
        //付款方式
        // $scope.GetAmtMsgNot();
    };
    //权限设置
    $scope.refresh_after = function () {
        //合计
        $scope.partSummary();
        var data = $scope.data.currItem.sale_ship_notice_money_lineofsale_ship_notice_headers;

        $scope.options_42.api.setRowData(data);
        for (var i = 0; i < $scope.data.currItem.sale_ship_item_lineofsale_ship_notice_headers.length; i++) {
            $scope.data.currItem.sale_ship_item_lineofsale_ship_notice_headers[i].seq = parseInt(i + 1);
        }
        //实际发货、实际柜号、进厂时间、出厂时间、封条号、提单号、工厂超时原因
        if ($scope.data.currItem.stat != 1 && $scope.data.currItem.currprocname == '业务员') {

        } else if ($scope.data.currItem.stat != 1 && $scope.data.currItem.currprocname == '仓库') {
            //资金风险控制设为不可编辑
            for (var i = 0; i < $scope.columns_42.length; i++) {
                $scope.columns_42[i].editor = true;
            }
            for (var i = 0; i < $scope.columns_21.length; i++) {
                if ($scope.columns_21[i].field == "out_qty") {
                    $scope.columns_21[i].editable = true;
                }
                if ($scope.columns_21[i].field == "actual_box_no") {
                    $scope.columns_21[i].editable = true;
                }
                if ($scope.columns_21[i].field == "car_intime") {
                    $scope.columns_21[i].editable = true;
                }
                if ($scope.columns_21[i].field == "car_outtime") {
                    $scope.columns_21[i].editable = true;
                }
                if ($scope.columns_21[i].field == "seal") {
                    $scope.columns_21[i].editable = true;
                }
                if ($scope.columns_21[i].field == "td_code") {
                    $scope.columns_21[i].editable = true;
                }
                if ($scope.columns_21[i].field == "car_note") {
                    $scope.columns_21[i].editable = true;
                }
                if ($scope.columns_21[i].field == "car_code") {
                    $scope.columns_21[i].editable = true;
                }
                if ($scope.columns_21[i].field == "deal_other") {
                    $scope.columns_21[i].editable = true;
                }

            }
            for (var i = 0; i < $scope.columns_22.length; i++) {
                if ($scope.columns_22[i].field == "actual_box_no") {
                    $scope.columns_22[i].editable = true;
                }
                if ($scope.columns_22[i].field == "car_intime") {
                    $scope.columns_22[i].editable = true;
                }
                if ($scope.columns_22[i].field == "car_outtime") {
                    $scope.columns_22[i].editable = true;
                }
                if ($scope.columns_22[i].field == "out_qty") {
                    $scope.columns_22[i].editable = true;
                }
            }
            for (var i = 0; i < $scope.columns_31.length; i++) {
                if ($scope.columns_31[i].field == "out_qty") {
                    $scope.columns_31[i].editable = true;
                }
                if ($scope.columns_31[i].field == "actual_box_no") {
                    $scope.columns_31[i].editable = true;
                }
                if ($scope.columns_31[i].field == "car_intime") {
                    $scope.columns_31[i].editable = true;
                }
                if ($scope.columns_31[i].field == "car_outtime") {
                    $scope.columns_31[i].editable = true;
                }
                if ($scope.columns_31[i].field == "seal") {
                    $scope.columns_31[i].editable = true;
                }
                if ($scope.columns_31[i].field == "td_code") {
                    $scope.columns_31[i].editable = true;
                }
                if ($scope.columns_31[i].field == "car_note") {
                    $scope.columns_31[i].editable = true;
                }
                if ($scope.columns_31[i].field == "car_code") {
                    $scope.columns_31[i].editable = true;
                }
                if ($scope.columns_31[i].field == "deal_other") {
                    $scope.columns_31[i].editable = true;
                }
                if ($scope.columns_31[i].field == "note") {
                    $scope.columns_31[i].editable = true;
                }
            }
            //产品明细判断
            var data21 = $scope.data.currItem.sale_ship_item_lineofsale_ship_notice_headers;
            var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterGroup;
            for (var i = 0; i < data21.length; i++) {
                if (Number(data21[i].out_qty || 0) == 0 && $scope.data.currItem.stat != 5 && Number(data21[i].deal_other || 0) == 0) {
                    data21[i].out_qty = Number(data21[i].qty || 0);
                    $scope.options_21.api.refreshCells(nodes, ["out_qty"]);
                }
            }
            //散件包装箱
            var data31 = $scope.data.currItem.sale_ship_package_lineofsale_ship_notice_headers;
            var nodes = $scope.options_31.api.getModel().rootNode.childrenAfterGroup;
            for (var i = 0; i < data31.length; i++) {
                if ((Number(data31[i].out_qty || 0) == 0) && ($scope.data.currItem.stat != 5) && (Number(data31[i].deal_other || 0) == 0)) {
                    data31[i].out_qty = Number(data31[i].qty || 0);
                    $scope.options_31.api.refreshCells(nodes, ["out_qty"]);
                }
            }
            //出货预告手工行
            var data22 = $scope.data.currItem.sale_ship_item_line_cofsale_ship_notice_headers;
            var nodes = $scope.options_21.api.getModel().rootNode.childrenAfterGroup;
            for (var i = 0; i < data22.length; i++) {
                if ((Number(data22[i].out_qty || 0) == 0) && ($scope.data.currItem.stat != 5) && (Number(data22[i].deal_other || 0) == 0)) {
                    data22[i].out_qty = Number(data22[i].send_qty || 0);
                    $scope.options_22.api.refreshCells(nodes, ["out_qty"]);
                }
            }
            $scope.updateColumns();
        } else {
            //产品表设置不可编辑
            for (var i = 0; i < $scope.columns_21.length; i++) {
                $scope.columns_21[i].editor = false;
            }
            //信用证信息不可编辑
            for (var i = 0; i < $scope.columns_11.length; i++) {
                $scope.columns_11[i].editor = false;
            }
            //资金风险控制不可编辑
            for (var i = 0; i < $scope.columns_42.length; i++) {
                $scope.columns_42[i].editor = false;
            }
        }

    };
    //提交
    $scope.wfstart_before = function () {
        //提示
        var data = $scope.data.currItem.sale_pi_pay_lineofsale_ship_notice_headers;
        if (data.length > 0) {
            var havenottt = false;
            for (var i = 0; i < data.length; i++) {
                if (Number(data[i].pay_type || 0) != 1) {
                    havenottt = true;
                }
            }
            if (havenottt && (parseFloat($scope.data.currItem.total_amt || 0) > 0)) {
                var dataci = $scope.data.currItem.sale_ship_notice_ciofsale_ship_notice_headers;
                if (dataci.length > 0) {
                    if (dataci[0].ci_no == "") {
                        ds.dialog.confirm('没有引入中信保分配明细,是否确定无投保?', function () {

                        }, function () {
                            $scope.newWindow.close();
                        });
                    }
                }

            }
        }
        var obj = BasemanService.RequestPost("sale_ship_notice_header", "auditcheck", {
            notice_id: $scope.data.currItem.notice_id, notice_no: $scope.data.currItem.notice_no,
            this_use_amt: $scope.data.currItem.this_use_amt
        });
        return obj;

    };
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('sale_ship_notice_headerEdit', sale_ship_notice_headerEdit)
