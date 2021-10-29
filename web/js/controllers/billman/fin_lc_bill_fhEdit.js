var basemanControllers = angular.module('inspinia');
function fin_lc_bill_fhEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_lc_bill_fhEdit = HczyCommon.extend(fin_lc_bill_fhEdit, ctrl_bill_public);
    fin_lc_bill_fhEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_lc_bill",
        key: "lc_bill_id",
        wftempid: 10011,
        FrmInfo: {sqlBlock:"1=1 and nvl(send_again,0)<>2"},
        grids: []
    };
    /********************初始化***************************/
    $scope.clearinformation = function () {
        $scope.data.currItem = {
            is_money_over:1,
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            objattachs: [],
            stat: 1,
            usable: 2,
            lc_bill_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            seaport_out_name: "",
            deliver_amt: 0,
            lc_type: 1,
            currency_code: "USD",
            version:"1"
        };
    };
    /*********************弹出框区域**************************/
       //订单拆分
	$scope.senddeal=function(){
        if ($scope.data.currItem.lc_bill_id == undefined || $scope.data.currItem.lc_bill_id == "") {
            BasemanService.notice("请先保存!", "alert-warning");
            return;
        }
        var postdata={
            lc_bill_id:$scope.data.currItem.lc_bill_id,
            lc_bill_no:$scope.data.currItem.lc_bill_no
        }
        BasemanService.RequestPost("fin_lc_bill", "senddeal", postdata)
        .then(function (data) {
			BasemanService.notice("处理成功", "alert-info");
		});
	};
    //销售部门弹窗
    $scope.openSalesPartFrm = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
            sqlBlock: "orgtype=5",
            backdatas: "orgs",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.manger = result.manger;
            $scope.data.currItem.note = result.note;
            $scope.data.currItem.org_id = result.orgid;
        });
    };
    //业务员
    $scope.openSalesUserFrm = function () {
        if ($scope.data.currItem.org_name == undefined || $scope.data.currItem.org_name == "") {
            BasemanService.notice("请先选择业务部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            classid: "scpuser",
            postdata: {
                flag: 10
            },
            backdatas: "users",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.sales_user_id = result.userid;
        });
    };
    //单证人弹窗
    $scope.openProverFrm = function () {
        $scope.FrmInfo = {
            classid: "scpuser",
            backdatas: "users",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.prover = result.userid;
        });
    };
    //通知银行赋值
    $scope.openInFormBankFrm = function () {
        $scope.bill_bank(0);
        $scope.result.then(function (result) {
            $scope.data.currItem.lc_inform_bank_id = result.bank_id;
            $scope.data.currItem.lc_inform_bank_code = result.bank_code;
            $scope.data.currItem.lc_inform_bank_name = result.bank_name;
            $scope.data.currItem.lc_inform_bank_no = result.account_no;
        })
        $scope.result = undefined;
    };
    //开证银行赋值
    $scope.openOpenBankFrm = function () {
        if ($scope.data.currItem.usable == 2) {
            $scope.bill_bank(1);
        } else {
            $scope.bill_bank(0);
        }

        $scope.result.then(function (result) {
            $scope.data.currItem.lc_open_bank_id = result.bank_id;
            $scope.data.currItem.lc_open_bank_code = result.bank_code;
            $scope.data.currItem.lc_open_bank_name = result.bank_name;

            $scope.data.currItem.swift = result.swift_code;
        })
        $scope.result = undefined;
    };
    //议付银行赋值
    $scope.openConsultBankFrm = function () {
        $scope.bill_bank(0);
        $scope.result.then(function (result) {
            $scope.data.currItem.lc_consult_bank_id = result.bank_id;
            $scope.data.currItem.lc_consult_bank_code = result.bank_code;
            $scope.data.currItem.lc_consult_bank_name = result.bank_name;
        })
        $scope.result = undefined;
    };
    //福费廷银行赋值
    $scope.openFftFrm = function () {
        $scope.bill_bank(0);
        $scope.result.then(function (result) {
            $scope.data.currItem.fft_bank = result.bank_name;
        })
        $scope.result = undefined;
    };
    //保兑银行赋值
    $scope.openExchangeBankFrm = function () {
        $scope.bill_bank(1);
        $scope.result.then(function (result) {
            $scope.data.currItem.lc_exchange_bank_id = result.bank_id;
            $scope.data.currItem.lc_exchange_bank_code = result.bank_code;
            $scope.data.currItem.lc_exchange_bank_name = result.bank_name;
        })
        $scope.result = undefined
    };
    //银行查询
    $scope.bill_bank = function (flag) {
        $scope.FrmInfo = {
            classid: "bill_bank",
            postdata: {
                flag: flag,
            },
        };
        $scope.result = BasemanService.open(CommonPopController, $scope).result;
    };
    //到货港港口弹窗
    $scope.openSeaPortInFrm = function () {
        $scope.postdata = {
            sqlwhere: " seaport_type =2"
        };
        if ($scope.data.currItem.area_id != undefined && $scope.data.currItem.area_id != "") {
            $scope.postdata.sqlwhere = $scope.postdata.sqlwhere + " and area_id in(0," + $scope.data.currItem.area_id + ")";
        }
        $scope.openSeaPortInOrOutFrm();
        $scope.result.then(function (result) {
            $scope.data.currItem.seaport_in_id = result.seaport_id;
            $scope.data.currItem.seaport_in_name = result.seaport_name;
            $scope.data.currItem.seaport_in_code = result.seaport_code;
        });
        $scope.result = undefined;
    };
    //出货港弹窗
    $scope.openSeaPortOutFrm = function () {
        $scope.postdata = {
            sqlwhere: " seaport_type =1"
        };
        $scope.openSeaPortInOrOutFrm();
        $scope.result.then(function (result) {
            $scope.data.currItem.seaport_out_id = result.seaport_id;
            $scope.data.currItem.seaport_out_name = result.seaport_name;
            $scope.data.currItem.seaport_out_code = result.seaport_code;
        });
        $scope.result = undefined;
    };
    //港口查询
    $scope.openSeaPortInOrOutFrm = function () {
        $scope.FrmInfo = {
            classid: "seaport",
            sqlBlock: $scope.postdata.sqlwhere,
        };
        $scope.result = BasemanService.open(CommonPopController, $scope).result
    };
    //所在国家  
    $scope.openAreaNameFrm = function () {
        $scope.FrmInfo = {
            classid: "scparea",
            sqlBlock: "areatype = 2",
            postdata: {},
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.area_id = result.areaid;
            $scope.data.currItem.area_code = result.areacode;
            $scope.data.currItem.area_name = result.areaname;
        });
    };
    //客户查询
    $scope.openCustFrm = function () {
        if ($scope.data.currItem.org_code == undefined || $scope.data.currItem.org_code == "") {
            BasemanService.notice("请先选择业务部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            classid: "customer",
            postdata: {},
            sqlBlock: "(org_id = 248 or other_org_ids like '%,248,%')",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;
        });
    };
    //填写金额(inc_rate),影响实际金额(fact_amt),上浮后金额(amt)
    $scope.inc_amtChangeAmt = function () {
        $scope.data.currItem.fact_amt = $scope.data.currItem.inc_amt;
        $scope.data.currItem.amt = $scope.data.currItem.inc_amt * (1 + $scope.data.currItem.inc_rate / 100) || $scope.data.currItem.fact_amt;
        $scope.amtChangeAmt();
    };
    //填写金额(inc_rate),影响实际金额(fact_amt),上浮后金额(amt)
    $scope.inc_rateChangeAmt = function () {
        if ($scope.data.currItem.inc_rate > 10) {
            BasemanService.notice("上浮比率不能大于10%,请重新输入!", "alter-warning");
            $scope.data.currItem.inc_rate = "";
        }
        $scope.data.currItem.amt = $scope.data.currItem.inc_amt * (1 + $scope.data.currItem.inc_rate / 100) || $scope.data.currItem.fact_amt;
        $scope.amtChangeAmt();
    };
    //金额保留两位
    $scope.amtChangeAmt = function () {
        if ($scope.data.currItem.amt != undefined && $scope.data.currItem.amt > 0) {
            $scope.data.currItem.amt = HczyCommon.toDecimal2($scope.data.currItem.amt);
        }
    };
    /*********************系统词汇值**************************/
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stats = data.dicts;
    });
    //信用证类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "lc_type"})
        .then(function (data) {
            $scope.lc_types = HczyCommon.stringPropToNum(data.dicts);
        });
    //付款方式
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "fkfs_type"}).then(function (data) {
        $scope.fkfs_types = HczyCommon.stringPropToNum(data.dicts);
    });
    //LC受益人--回款组织
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "return_ent_type"}).then(function (data) {
        $scope.return_ent_types = HczyCommon.stringPropToNum(data.dicts);
    });
    //币种
    BasemanService.RequestPostAjax("base_search", "searchcurrency", {dictcode: "base_currency"}).then(function (data) {
        $scope.base_currencys = HczyCommon.stringPropToNum(data.dicts);
    });
    //货币类型
    BasemanService.RequestPostAjax("base_search", "searchcurrency", {}).then(function (data) {
        $scope.base_currencys = HczyCommon.stringPropToNum(data.base_currencys);
    });
    $scope.currencyChange = function () {
        for (var i = 0; i < $scope.base_currencys.length; i++) {
            if ($scope.base_currencys[i].currency_code == $scope.data.currItem.currency_code) {
                $scope.data.currItem.currency_code = $scope.base_currencys[i].currency_code;
                $scope.data.currItem.currency_name = $scope.base_currencys[i].currency_name;
                $scope.data.currItem.currency_id = $scope.base_currencys[i].currency_id;
                break;
            }
        }
    };

    $scope.trueorfalsetests = [
        {
            id: 1,
            name: "否"
        }, {
            id: 2,
            name: "是"
        }];
    $scope.is_part_shipments = [
        {
            id: 1,
            name: "否"
        }, {
            id: 2,
            name: "是"
        }];
    $scope.change_types = [
        {
            id: 1,
            name: "内部变更"
        }, {
            id: 2,
            name: "外部变更"
        }];
    $scope.confirm_stats = [
        {
            id: 1,
            name: "未确认"
        }, {
            id: 2,
            name: "已确认"
        }];
    //回款时点
    $scope.fksds = [
        {
            id: 1,
            name: "AT SIGHT"
        }, {
            id: 2,
            name: "AFTER/FROM BILL OF LADING DATE(SHIPMENT DATE)"
        }, {
            id: 3,
            name: "AFTER/FROM DATE OF RECEIVING DOC"
        }, {
            id: 4,
            name: "AFTER/FROM DATE OF PRESENTATION"
        }, {
            id: 5,
            name: "FROM NEGOTIATION"
        }, {
            id: 6,
            name: "AFTER SIGHT"
        }];
    //orgin产地证origin
    $scope.origins = [
        {
            id: 1,
            orginvalue: "CO"
        }, {
            id: 2,
            orginvalue: "FORM A"
        }, {
            id: 3,
            orginvalue: "FORM E"
        }, {
            id: 4,
            orginvalue: "FORM F"
        }, {
            id: 5,
            orginvalue: "其他"
        }];
    //SY_MAN受益人
    $scope.sy_mans = [
        {
            id: 1,
            name: "Aux Electric(Hong Kong) Company Limited SUITE 4018, 40/F JARDINE HSE 1 CONNAUGHT PLACE CENTRAL HONG KONG"
        }, {
            id: 2,
            name: "NINGBO AUX IMP.AND EXP. CO.,LTD. NO.1166 NORTH MINGGUANG ROAD JIANGSHAN TOWN, YINZHOU DISTRICT"
        }];
    //业务方式
    $scope.fft_types = [
        {
            fft_typeid: 1,
            fft_typename: "押汇"
        }, {
            fft_typeid: 2,
            fft_typename: "福费廷"
        }];

    /********************************增加历史信用证******************/
    $scope.addpro = function () {
        if($scope.data.currItem.lc_bill_id==undefined || $scope.data.currItem.lc_bill_id==0){
            BasemanService.notice("单据没有，不允许复制")
        }
        $scope.data.currItem.creator= window.strUserId;
        $scope.data.currItem.stat= 1;
        $scope.data.currItem.lc_bill_date= moment().format('YYYY-MM-DD HH:mm:ss');
        $scope.data.currItem.lc_bill_no = '';

        delete $scope.data.currItem.lc_bill_id;
        delete $scope.data.currItem.wfid;
        delete $scope.data.currItem.wfflag;
        delete $scope.data.currItem.chector;
        delete $scope.data.currItem.checktime;
        delete $scope.data.currItem.lc_consult_bank_name;

        delete $scope.data.currItem.confirm_man;
        delete $scope.data.currItem.confirm_date;
        delete $scope.data.currItem.seaport_out_name;
        delete $scope.data.currItem.seaport_in_name;
        delete $scope.data.currItem.area_code;
        delete $scope.data.currItem.area_name;
        delete $scope.data.currItem.fft_bank;
        delete $scope.data.currItem.origin;
        delete $scope.data.currItem.fft_type;
        delete $scope.data.currItem.vessel_certificate;
        delete $scope.data.currItem.sy_man;
        delete $scope.data.currItem.modify_info;

        delete $scope.data.currItem.lc_no;
        delete $scope.data.currItem.rec_lc_date;
        delete $scope.data.currItem.confirm_amt;
        delete $scope.data.currItem.amt_dist
        delete $scope.data.currItem.deliver_amt;
        delete $scope.data.currItem.is_money_over;
        delete $scope.data.currItem.feedback_info;
        
    };
    $scope.clearinformation = function () {
            $scope.data.currItem = {
                is_money_over:1,
                creator: window.strUserId,
                create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                objattachs: [],
                stat: 1,
                usable: 2,
                lc_bill_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                seaport_out_name: "",
                deliver_amt: 0,
                lc_type: 1,
                currency_code: "USD",
                version:"1"
            };
        };
    /********************保存校验区域***************************/
    //数据缓存
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('fin_lc_bill_fhEdit', fin_lc_bill_fhEdit);
