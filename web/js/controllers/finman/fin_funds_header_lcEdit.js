var finmanControllers = angular.module('inspinia');
function fin_funds_header_lcEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_funds_header_lcEdit = HczyCommon.extend(fin_funds_header_lcEdit, ctrl_bill_public);
    fin_funds_header_lcEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_funds_header",
        key: "funds_id",
        wftempid: 10008,
        FrmInfo: {sqlBlock: "Funds_Type=2"},
        grids: [{optionname: 'options_12', idname: 'fin_funds_lineoffin_funds_headers'},//单据明细
            {optionname: 'options_13', idname: 'fin_funds_kind_lineoffin_funds_headers'},//产品部信息
            {optionname: 'options_14', idname: 'fin_funds_xypmoffin_funds_headers'},//信用证扣费明细
            {optionname: 'options_11', idname: 'fin_funds_sapoffin_funds_headers'},//sap凭证明细
        ]
    };
    /******************弹出框区域*******************/
    {
        //汇出国家
        $scope.scparea = function () {
            $scope.FrmInfo = {
                classid: "scparea",
                sqlBlock: "areatype=2",
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.areacode = result.areacode;
                $scope.data.currItem.areaname = result.areaname;
                $scope.data.currItem.areaid = result.areaid;
            })
        };
        //会计期间
        $scope.fin_bud_period_header = function () {
            $scope.FrmInfo = {
                classid: "fin_bud_period_header",
                postdata: {
                    flag: 3
                }
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.period_year = result.period_year;
                $scope.data.currItem.period_id = result.period_id;
                $scope.data.currItem.period_line_id = result.period_line_id;
                $scope.data.currItem.dname = result.dname;
            })
        };
        //信用证号
        $scope.openLcNoSearchFrm = function () {
            $scope.FrmInfo = {
                title: "信用证号查询",
                is_high: true,
                is_custom_search: true,
                thead: [
                    {
                        name: "分配单号",
                        code: "lc_allot_no",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "信用证号",
                        code: "lc_no",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "商业发票号",
                        code: "fact_invoice_no",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "PI号",
                        code: "pi_no",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "金额",
                        code: "amt",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "客户代码",
                        code: "lc_bill_date",
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
                        name: "部门代码",
                        code: "org_code",
                        show: true,
                        iscond: true,
                        type: 'date'
                    }, {
                        name: "部门",
                        code: "org_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "日期",
                        code: "lc_date",
                        show: true,
                        iscond: true,
                        type: 'date'
                    }, {
                        name: "水单编号",
                        code: "lc_bill_no",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "日期",
                        code: "lc_bill_date",
                        show: true,
                        iscond: true,
                        type: 'date'
                    }],
                classid: "fin_lc_allot_header",
                sqlBlock: "Fin_LC_Allot_Header.Stat = 5",
                searchlist: ["fin_lc_allot_header.lc_allot_no", "fin_lc_allot_header.lc_no"
                    , "bill_invoice_header.fact_invoice_no", "bill_invoice_header.pi_no"
                    , "fin_lc_allot_header.amt", "fin_lc_allot_header.cust_code"
                    , "fin_lc_allot_header.cust_name"],
                postdata: {flag: 1}
            };
            BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
                result = HczyCommon.stringPropToNum(result);
                $scope.data.currItem.lc_no = result.lc_no;
                $scope.data.currItem.lc_bill_no = result.lc_bill_no;
                $scope.data.currItem.lc_bill_id = result.lc_bill_id;
                $scope.data.currItem.org_code = result.org_code;
                $scope.data.currItem.org_id = result.org_id;
                $scope.data.currItem.org_name = result.org_name;
                $scope.data.currItem.idpath = result.idpath;
                $scope.data.currItem.cust_code = result.cust_code;
                $scope.data.currItem.cust_id = result.cust_id;
                $scope.data.currItem.idpath = result.idpath;
                $scope.data.currItem.cust_name = result.cust_name;
                $scope.data.currItem.hth = result.pi_no;
                $scope.data.currItem.fact_invoice_no = result.fact_invoice_no;
                $scope.data.currItem.return_ent_type = result.return_ent_type;
                if (result.sales_user_id != undefined) {
                    $scope.data.currItem.sales_user_id = result.sales_user_id;
                }
                $scope.data.currItem.currency_name = result.currency_name;
                $scope.data.currItem.currency_code = result.currency_code;
                $scope.data.currItem.currency_id = result.currency_id;
                $scope.data.currItem.trans_currency_name = result.trans_currency_name;
                $scope.data.currItem.trans_currency_code = result.trans_currency_code;
                $scope.data.currItem.trans_currency_id = result.trans_currency_id;
                $scope.getHxLine();
            })
        };
        //自动带出核销明细、产品明细
        $scope.getHxLine = function () {
            if ($scope.data.currItem.cust_code == undefined
                || $scope.data.currItem.lc_no == undefined
                || $scope.data.currItem.sale_order_type == undefined
                || $scope.data.currItem.lc_cash_type == undefined) {
                return;
            }
            var sql = "nvl(is_check_over,1)<2 and a.stat = 5 and a.lc_bill_id=" + $scope.data.currItem.lc_bill_id
                + " and a.cust_id=" + $scope.data.currItem.cust_id
                + " and nvl(bill_type,1) <> 2 and nvl(is_red,1) <> 2 and a.sale_order_type="
                + $scope.data.currItem.sale_order_type;
            BasemanService.RequestPost("bill_invoice_header", "search", {
                flag: 14,
                sqlwhere: sql
            }).then(function (result) {
                if (result.bill_invoice_headers.length > 0) {
                    var data = result.bill_invoice_headers;
                    //单据明细
                    var GridData = [];
                    for (i = 0; i < data.length; i++) {
                        data[i].amount = data[i].tt_amt - data[i].tt_check_amt;
                        var item = {};
                        item.seq = i + 1;
                        item.notice_no = data[i].notice_no;
                        item.pi_no = data[i].pi_no;
                        item.invoice_no = data[i].invoice_no;
                        item.fact_invoice_no = data[i].fact_invoice_no;
                        item.tt_check_amt = data[i].tt_check_amt;
                        item.amount = data[i].amount;
                        item.notice_id = data[i].notice_id;
                        item.invoice_id = data[i].invoice_id;
                        item.pi_id = data[i].pi_id;
                        item.tt_amt = data[i].tt_amt;
                        item.item_kind = data[i].item_kind;
                        GridData.push(item);
                    }
                    $scope.options_12.api.setRowData(GridData);
                    $scope.data.currItem.fin_funds_lineoffin_funds_headers = GridData;
                    //产品明细
                    var GridData2 = [];
                    data[0].amount = parseFloat(data[0].tt_amt || 0) - parseFloat(data[0].tt_check_amt || 0);
                    $scope.data.currItem.lc_interest = parseFloat($scope.data.currItem.lc_interest) || 0;
                    $scope.data.currItem.amt = parseFloat($scope.data.currItem.amt) || 0;
                    $scope.data.currItem.amt_deduct = parseFloat($scope.data.currItem.amt_deduct) || 0;
                    var item = {};
                    item.seq = 1;
                    item.item_kind = data[0].item_kind;
                    item.amt_deduct = $scope.data.currItem.amt_deduct || 0;
                    item.amt = $scope.data.currItem.amt || 0;
                    item.lc_interest = $scope.data.currItem.lc_interest || 0;
                    item.fact_amt = $scope.data.currItem.lc_interest + $scope.data.currItem.amt + $scope.data.currItem.amt_deduct;
                    item.canuse_amt = $scope.data.currItem.lc_interest + $scope.data.currItem.amt + $scope.data.currItem.amt_deduct;
                    GridData2.push(item);

                    $scope.options_13.api.setRowData(GridData2);
                    $scope.data.currItem.fin_funds_kind_lineoffin_funds_headers = GridData2;
                } else {
                    $scope.AmtChangeLC();
                }

            })
        };
        //银行
        $scope.bank = function () {
            if ($scope.s_flag == 2) {
                return;
            }
            $scope.FrmInfo = {
                classid: "bank",
                sqlBlock: "usable=2",
            };
            BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
                $scope.data.currItem.bank_name = result.bank_name;
                $scope.data.currItem.bank_code = result.bank_code;
                $scope.data.currItem.bank_jc = result.bank_jc;
                $scope.data.currItem.account_no = result.account_no;
                $scope.data.currItem.sap_account = result.sap_account;
                $scope.data.currItem.bank_id = result.bank_id;
                $scope.data.currItem.return_ent_type = parseInt(result.return_ent_type);
                $scope.data.currItem.entid = result.entid;
            })
        };
        //发票号
        $scope.Invoice = function () {
            $scope.FrmInfo = {
                classid: "bill_invoice_header",
                postdata: {s_flag: 1},
                sqlBlock: ' stat = 5 '
            };
            BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
                $scope.data.currItem.fact_invoice_no = result.fact_invoice_no;
                $scope.data.currItem.hth = result.pi_no;
                $scope.data.currItem.invoice_id = result.invoice_id;
            })
        };
        //业务部门
        $scope.scporg = function () {
            if ($scope.s_flag == 3) {
                return;
            }//信用证录入
            $scope.FrmInfo = {
                classid: "scporg",
                sqlBlock: "1=1 and stat =2 and OrgType = 5",
                backdatas: "orgs"
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.org_name = result.orgname;
                $scope.data.currItem.org_code = result.code;
                $scope.data.currItem.org_id = result.orgid;
            })
        };
        //客户
        $scope.customer = function () {
            if ($scope.s_flag == 3) {
                return;
            }//信用证录入
            if ($scope.s_flag == 1 && $scope.data.currItem.confirm_stat == 2 && $scope.s_flag == 1) {
                return;
            }//TT到款确认
            if ($scope.s_flag == 1 && ($scope.data.currItem.tt_type == 1 || $scope.data.currItem.tt_type == 7 || $scope.data.currItem.tt_type == 8 || $scope.data.currItem.tt_type == 9)) {
                BasemanService.notice("此到款类型不能选择客户", "alert-warning");
                return;
            }
            if ($scope.data.currItem.currency_code == undefined || $scope.data.currItem.currency_code == "") {
                BasemanService.notice("请先选择币种", "alert-warning");
                return;
            }
            if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
                BasemanService.notice("请先选择业务部门", "alert-warning");
                return;
            }
            $scope.FrmInfo = {
                postdata: {
                    flag: 1
                },
                classid: "customer"
            };
            $scope.FrmInfo.sqlBlock = " (org_id=" + $scope.data.currItem.org_id
                + " or idpath like '%," + $scope.data.currItem.org_id + ",%')";
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.cust_desc = result.cust_desc;
                $scope.data.currItem.cust_id = result.cust_id;
                $scope.data.currItem.cust_name = result.cust_name;
                $scope.data.currItem.cust_code = result.sap_code;
                //产品部明细
                if ($scope.s_flag == 2) {
                    $scope.AmtChange();
                }
            })
        };
        $scope.AmtChange = function () {
            var data = $scope.gridGetData("options_15");
            var griddata = [];
            var item = {}
            item.item_kind = "1";
            item.amt_deduct = $scope.data.currItem.amt_deduct;
            item.amt = $scope.data.currItem.amt;
            item.lc_interest = $scope.data.currItem.lc_interest;
            item.fact_amt = $scope.data.currItem.amt + $scope.data.currItem.amt_deduct + $scope.data.currItem.lc_interest;
            item.canuse_amt = $scope.data.currItem.amt + $scope.data.currItem.amt_deduct + $scope.data.currItem.lc_interest;//可分配金额
            griddata.push(item);
            $scope.options_15.api.setRowData(griddata);
            $scope.data.currItem.fin_funds_kind_lineoffin_funds_headers = griddata;
        };
        $scope.AmtChangeLC = function () {
            var data = $scope.gridGetData("options_13");
            var griddata = [];
            var item = {};
            item.item_kind = "1";
            item.amt_deduct = $scope.data.currItem.amt_deduct;
            item.amt = $scope.data.currItem.amt;
            item.lc_interest = $scope.data.currItem.lc_interest;
            item.fact_amt = $scope.data.currItem.amt + $scope.data.currItem.amt_deduct + $scope.data.currItem.lc_interest;
            item.canuse_amt = $scope.data.currItem.amt + $scope.data.currItem.amt_deduct + $scope.data.currItem.lc_interest;//可分配金额
            griddata.push(item);
            $scope.options_13.api.setRowData(griddata);
            $scope.data.currItem.fin_funds_kind_lineoffin_funds_headers = griddata;
        };
        //扣费
        $scope.lc_interestChange = function () {
            $scope.data.currItem.fact_amt = $scope.data.currItem.fact_amt || 0;//付款总额
            $scope.data.currItem.fact_amt = parseFloat($scope.data.currItem.amt || 0) + parseFloat($scope.data.currItem.amt_deduct || 0)
                + parseFloat($scope.data.currItem.lc_interest || 0);
            $scope.data.currItem.amt = $scope.data.currItem.amt || 0;//实收金额
            $scope.data.currItem.amt_deduct = $scope.data.currItem.amt_deduct || 0;//扣费
            $scope.data.currItem.lc_interest = $scope.data.currItem.lc_interest || 0;
            if ($scope.s_flag == 2) {
                $scope.AmtChange();
            }
            ;
            if ($scope.s_flag == 3) {
                $scope.AmtChangeLC();
            }
            ;

        };
        //生成分配单
        $scope.Update = function () {
            var postdata = {
                flag: 1000,
                funds_id: $scope.data.currItem.funds_id
            };
            BasemanService.RequestPost("fin_funds_header", "update", postdata).then(
                function () {
                    BasemanService.notice("生成完成");
                })
        };
        //拆分到款单
        $scope.Split = function () {
            var data = $scope.data.currItem.fin_funds_lineoffin_funds_headers;
            var lineamt = 0;

            for (var i = 0; i < data.length; i++) {
                data[i].allot_amt = parseFloat(data[i].allot_amt) || 0;
                lineamt = lineamt + data[i].allot_amt;
                if (lineamt > $scope.data.currItem.fact_amt) {
                    BasemanService.notice("到款总额已经分配完成,不能拆分!");
                    return;
                }
            }
            var MaxAmt = $scope.data.currItem.fact_amt - lineamt;
            var postdata = {
                funds_id: $scope.data.currItem.funds_id,
                fact_amt: parseFloat($scope.data.currItem.amt) || 0
            };
            BasemanService.RequestPost("fin_funds_header", "split", postdata).then(
                function (data) {
                    BasemanService.notice('新到款单号是:' + $scope.data.currItem.funds_no + ',请查看!');
                    $scope.refresh(2);
                })

        };
        //导入资金系统
        $scope.Import = function () {
            if ($scope.data.currItem.funds_id == undefined || $scope.data.currItem.funds_id == 0) {
                return;
            }
            localeStorageService.set("crmman.fin_funds_headerSearch", {
                other_no: $scope.data.currItem.other_no
            });
            $state.go("crmman.fin_funds_headerSearch");
        };
    }
    /**********************网格处理事件************/
    {
        //增加行
        $scope.addline11 = function () {
            if ($scope.s_flag == 3 && ($scope.data.currItem.lc_no == undefined || $scope.data.currItem.lc_no == "")) {
                BasemanService.notice("信用证号为空", "alert-warning");
                return;
            }
            if ($scope.data.currItem.cust_code == undefined || $scope.data.currItem.cust_code == "") {
                BasemanService.notice("客户为空", "alert-warning");
                return;
            }
            if ($scope.s_flag == 3 && ($scope.data.currItem.sale_order_type == undefined || $scope.data.currItem.sale_order_type == "")) {
                BasemanService.notice("订单类型不能为空", "alert-warning");
                return;
            }
            if ($scope.s_flag == 3 && $scope.data.currItem.lc_cash_type == undefined) {
                BasemanService.notice("LC到款类型不能为空", "alert-warning");
                return;
            }
            $scope.FrmInfo = {
                title: "商业发票查询",
                is_high: true,
                is_custom_search: true,
                thead: [
                    {
                        name: "商业发票号",
                        code: "invoice_no",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "实际发票号",
                        code: "fact_invoice_no",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "形式发票号",
                        code: "pi_no",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "发票金额",
                        code: "invoice_amt",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "业务部门",
                        code: "org_code",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "客户",
                        code: "cust_code",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }],
                type: "checkbox",
                classid: "bill_invoice_header",
                commitRigthNow: true,
                searchlist: ["code", "orgname", "manager", "note"],
                postdata: {flag: 14}
            };
            $scope.FrmInfo.initsql = " nvl(is_check_over,1)<2 and a.stat=5 and nvl(is_red,1)<>2 and a.lc_no='"
                + $scope.data.currItem.lc_no
                + "' and a.cust_id=" + $scope.data.currItem.cust_id
                + " and nvl(bill_type,1)<>2 and a.sale_order_type="
                + $scope.data.currItem.sale_order_type;
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                var lcs = $scope.gridGetData("options_12");
                var isExists = false;
                for (var i = 0; i < result.length; i++) {
                    var isExists = HczyCommon.isExist(lcs, result[i], ["invoice_id"], ["invoice_id"]).exist;
                    if (isExists) {
                        continue;
                    }
                    result[i].amount = parseFloat(result[i].tt_amt || 0) - parseFloat(result[i].tt_check_amt || 0);
                    $scope.gridAddItem('options_12', result[i]);
                }

            })
        };
        //费用名称
        $scope.subjects_name = function () {
            $scope.FrmInfo = {
                title: "费用查询",
                is_high: true,
                is_custom_search: true,
                thead: [
                    {
                        name: "费用名称",
                        code: "subjects_name",
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
                classid: "crm_sap_finance_subjects",
                postdata: {},
                sqlBlock: "Fin_Type=2",
                searchlist: ["note", "subjects_name"],
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                var focusData = $scope.gridGetRow('options_14');
                focusData.subjects_no = data.subjects_no;
                focusData.subjects_id = data.subjects_id;
                focusData.subjects_name = data.subjects_name;
                $scope.gridUpdateRow('options_14', focusData);
            });
        };
    }
    /*********************词汇值******************/
    {
        //状态
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
            $scope.stats = data.dicts;
        });
        //使用组织
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "scpent"}).then(function (data) {
            $scope.scpents = data.dicts;
        });
        //回款组织
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "return_ent_type"}).then(function (data) {
            $scope.return_ent_types = data.dicts;
        });
        //到款类型2
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "tt_type"}).then(function (data) {
            $scope.tt_types = HczyCommon.stringPropToNum(data.dicts);
        });
        //到款类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"}).then(function (data) {
            $scope.pay_types = HczyCommon.stringPropToNum(data.dicts);
        });
        //LC到款类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "lc_cash_type"})
            .then(function (data) {
                $scope.lc_cash_types = HczyCommon.stringPropToNum(data.dicts);
            });
        //融资类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "rongzi_type"}).then(function (data) {
            $scope.rongzi_types = HczyCommon.stringPropToNum(data.dicts);
        });
        //订单类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "sale_order_type"}).then(function (data) {
            $scope.sale_order_types = HczyCommon.stringPropToNum(data.dicts);
        });
        //货币类型
        BasemanService.RequestPostAjax("base_search", "searchcurrency", {}).then(function (data) {
            $scope.base_currencys = HczyCommon.stringPropToNum(data.base_currencys);
        });
        //转换币种
        $scope.trans_currencys = [
            {
                id: 4,
                name: "美元"
            }, {
                id: 5,
                name: "人民币"
            },
            {
                id: 6,
                name: "欧元"
            }, {
                id: 45,
                name: "港币"
            }, {
                id: 46,
                name: "测试币"
            },
            {
                id: 47,
                name: "英镑"
            },
            {
                id: 48,
                name: "加拿元"
            }];
        $scope.trueorfalsetests = [
            {
                id: 1,
                name: "否"
            }, {
                id: 2,
                name: "是"
            }];
        //付款总额保留4位
        $scope.amtChangeAmt = function () {
            if ($scope.data.currItem.fact_amt != undefined && $scope.data.currItem.fact_amt > 0) {
                $scope.data.currItem.fact_amt = parseFloat($scope.data.currItem.fact_amt).toFixed(4);
            }
        };
        $scope.HKchange = function () {
            //回款组织
            $scope.data.currItem.other_no = "";
        };
        $scope.changeCurrency = function () {
            for (i = 0; i < $scope.base_currencys.length; i++) {
                if ($scope.base_currencys[i].currency_code == $scope.data.currItem.currency_code) {
                    $scope.data.currItem.currency_code = $scope.base_currencys[i].currency_code;
                    $scope.data.currItem.currency_id = $scope.base_currencys[i].currency_id;
                    $scope.data.currItem.currency_name = $scope.base_currencys[i].currency_name;
                    break;
                }
            }
        };
        $scope.changetranscurrency=function(){
            for (i = 0; i < $scope.base_currencys.length; i++) {
                if ($scope.base_currencys[i].currency_id == $scope.data.currItem.trans_currency_id) {
                    $scope.data.currItem.trans_currency_code = $scope.base_currencys[i].currency_code;
                    $scope.data.currItem.trans_currency_id = $scope.base_currencys[i].currency_id;
                    $scope.data.currItem.trans_currency_name = $scope.base_currencys[i].currency_name;
                    break;
                }
            }
        }
    }
    /*********************网格定义区域************/
    {
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
        //sap凭证明细
        $scope.columns_11 = [
            {
                headerName: "凭证号", field: "sap_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "凭证日期", field: "gl_date", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "单据编码", field: "finfunds_code", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "凭证组织", field: "org_code", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "单据状态", field: "fin_stat", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{value: "1", desc: "可用"}, {value: "2", desc: "红冲"}]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
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
        //单据明细
        $scope.columns_12 = [
            {
                headerName: "产品部", field: "item_kind", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{value: "1", desc: "空调组织"}]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "通知单No", field: "notice_no", editable: false, filter: 'set', width: 130,
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
                headerName: "发票流水号", field: "invoice_no", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "实际发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "待核销总额", field: "tt_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "已核销金额", field: "tt_check_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
            , {
                headerName: "待核销金额", field: "amount", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
            , {
                headerName: "此次分配金额", field: "allot_amt", editable: true, filter: 'set', width: 120,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
            , {
                headerName: "拆分发票号", field: "split_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
        ];
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
        //产品部信息
        $scope.columns_13 = [
            {
                headerName: "产品部", field: "item_kind", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{value: "1", desc: "空调组织"}]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "实收金额", field: "amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "扣费", field: "amt_deduct", editable: false, filter: 'set', width: 150,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "利息", field: "lc_interest", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "付款总额", field: "fact_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "已分配金额", field: "allocated_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
            , {
                headerName: "可分配金额", field: "canuse_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
        ];
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
        //信用证扣费名称
        $scope.columns_14 = [
            {
                headerName: "费用名称", field: "subjects_name", editable: true, filter: 'set', width: 200,
                cellEditor: "弹出框",
                action: $scope.subjects_name,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "金额", field: "price", editable: true, filter: 'set', width: 200,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "备注", field: "note", editable: true, filter: 'set', width: 200,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }];
        $scope.options_14 = {
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
                var isGrouping = $scope.options_14.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };

    }
    /**********保存校验区域/界面初始化************/
    {
        $scope.validate = function () {
            var errorlist = [];
            //实收金额不能为负数
            if (Number($scope.data.currItem.amt||0) < 0) {
                BasemanService.notice("实收金额不能为负数,到款金额不能为负数", "alert-warning");
                return false;
            }
            //转换币种
            if ($scope.data.currItem.trans_currency_id) {
                if (($scope.data.currItem.currency_id != $scope.data.currItem.trans_currency_id)
                    && parseFloat($scope.data.currItem.trans_currency_amt || 0) == 0) {
                    BasemanService.notice("'转换币种金额'不能为空或0", "alert-warning");
                    return;
                }
                if (($scope.data.currItem.currency_id != $scope.data.currItem.trans_currency_id)
                    && ($scope.data.currItem.trans_amt==""||$scope.data.currItem.trans_amt==undefined)) {
                    BasemanService.notice("'转换币种扣费'不能为空", "alert-warning");
                    return;
                }

            }
            //当转换币种<>币种
            if (($scope.data.currItem.currency_id != $scope.data.currItem.trans_currency_id)
                && (parseFloat($scope.data.currItem.is_yd || 0) == 0)) {
                BasemanService.notice("'是否客户约定汇率'不能为空或0", "alert-warning");
                return;
            }
            if (Number($scope.data.currItem.is_yd || 0) == 2
                && (parseFloat($scope.data.currItem.yd_rate || 0)==0)) {
                BasemanService.notice("'约定汇率'不能为空或为0", "alert-warning");
                return;
            }
            if (($scope.data.currItem.currency_id != $scope.data.currItem.trans_currency_id)
                && Number($scope.data.currItem.is_yd || 0) >0) {
                //扣费=转换币种扣费/约定汇率，保留2位小数；
                if(parseFloat($scope.data.currItem.trans_amt || 0)>0 && parseFloat($scope.data.currItem.yd_rate || 0)>0){
                    $scope.data.currItem.amt_deduct = (parseFloat($scope.data.currItem.trans_amt || 0) / parseFloat($scope.data.currItem.yd_rate || 0)).toFixed(2);
                }else{
                    $scope.data.currItem.amt_deduct=0;
                }
                //实收金额=转换币种金额/约定汇率，保留2位小数；
                if(Number($scope.data.currItem.trans_currency_amt || 0)>0&&Number($scope.data.currItem.yd_rate || 0)>0){
                    $scope.data.currItem.amt = (Number($scope.data.currItem.trans_currency_amt || 0) / Number($scope.data.currItem.yd_rate || 0)).toFixed(2);
                }else{
                    $scope.data.currItem.amt=0;
                }
                //付款总额=实收金额+扣费，保留2位小数；
                $scope.data.currItem.fact_amt = (parseFloat($scope.data.currItem.amt || 0) + parseFloat($scope.data.currItem.amt_deduct || 0)).toFixed(2);
            }
            //资金系统单号
            if ($scope.data.currItem.other_no == undefined || $scope.data.currItem.other_no == "") {
                BasemanService.notice("资金系统单号不能为空", "alert-warning");
                return false;
            }
            if (Number($scope.data.currItem.is_into_amt||0) == 0) {
                BasemanService.notice("是否引资金系统不能为空", "alert-warning");
                return false;
            }
            $scope.data.currItem.fin_funds_kind_lineoffin_funds_headers.length == 0 ? errorlist.push("产品部信息为空") : 0;
            if (errorlist.length) {
                BasemanService.notice(errorlist, "alert-warning");
                return false;
            }
            return true;
        };
        //保存之前
        $scope.save_before = function () {
            $scope.changeCurrency();
            $scope.changetranscurrency();
            $scope.data.currItem.flag = 3;
            if ($scope.data.currItem.return_ent_type_bak != undefined
                && $scope.data.currItem.return_ent_type_bak != $scope.data.currItem.return_ent_type) {
                $scope.data.currItem.is_changent = 2;
            }
            /*if ($scope.data.currItem.funds_type == "TT") {
                $scope.data.currItem.fin_funds_kind_lineoffin_funds_headers = [{
                    item_kind: "1",
                    amt: $scope.data.currItem.amt,
                    amt_deduct: $scope.data.currItem.amt_deduct,
                    fact_amt: $scope.data.currItem.fact_amt,
                    lc_interest: $scope.data.currItem.lc_interest
                }]
            }*/
            if (!($scope.data.currItem.trans_currency_id)){
                $scope.data.currItem.trans_currency_id = $scope.data.currItem.currency_id;
                $scope.data.currItem.trans_currency_code = $scope.data.currItem.currency_code;
                $scope.data.currItem.trans_currency_name = $scope.data.currItem.currency_name;
            }
            //原币种首次实收金额”自动赋值为“实收金额”
            $scope.data.currItem.f_amt = Number($scope.data.currItem.amt || 0);//原币种首次实收金额
            $scope.data.currItem.f_amt_deduct = Number($scope.data.currItem.amt_deduct || 0);//原币种首次实收金额
            $scope.data.currItem.f_fact_amt = Number($scope.data.currItem.fact_amt || 0);//原币种首次实收金额
        };
        $scope.refresh_after = function () {
            $scope.data.currItem.return_ent_type_bak = $scope.data.currItem.return_ent_type;
        };
        $scope.clearinformation = function () {
            var requestobj = BasemanService.RequestPostNoWait("fin_bud_period_header", "search", {flag: 3});
            if (requestobj.pass) {
                $scope.data.currItem.period_year = requestobj.data.fin_bud_period_headers[0].period_year;
                $scope.data.currItem.period_id = requestobj.data.fin_bud_period_headers[0].period_id;
                $scope.data.currItem.period_line_id = requestobj.data.fin_bud_period_headers[0].period_line_id;
                $scope.data.currItem.dname = requestobj.data.fin_bud_period_headers[0].dname;
            }
            $scope.data.currItem.stat = 1;
            $scope.data.currItem.creator = window.userbean.userid;
            $scope.data.currItem.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
            $scope.data.currItem.funds_date = moment().format('YYYY-MM-DD HH:mm:ss');
            $scope.data.currItem.lc_cash_type = 4;
            $scope.data.currItem.is_into_amt = 1;
            $scope.data.currItem.is_yin = 2;
            $scope.data.currItem.sale_order_type = 1;
            $scope.data.currItem.amt_deduct = 0;
            $scope.data.currItem.fact_amt = 0;
            $scope.data.currItem.currency_name = "美元";
            $scope.data.currItem.currency_code = "USD";
            $scope.data.currItem.currency_id = 4;
            $scope.data.currItem.trans_currency_code = "USD";
            $scope.data.currItem.trans_currency_id = 4;
            $scope.data.currItem.trans_currency_name = "美元";
            $scope.data.currItem.return_ent_type = 1;
            $scope.data.currItem.funds_type = 2;
            $scope.s_flag = 3;
        };
    }
    $scope.initdata();
};
//加载控制器
finmanControllers
    .controller('fin_funds_header_lcEdit', fin_funds_header_lcEdit);
