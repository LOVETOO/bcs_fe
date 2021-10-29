var basemanControllers = angular.module('inspinia');
function fin_lc_bill_changeEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_lc_bill_changeEdit = HczyCommon.extend(fin_lc_bill_changeEdit, ctrl_bill_public);
    fin_lc_bill_changeEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_lc_bill_change",
        key: "change_id",
        wftempid: 10066,
        FrmInfo: {},
        grids: []
    };
    /*********************弹出框区域**************************/
    //水单编号
    $scope.lc_bill_no = function () {
        $scope.FrmInfo = {
            classid: "fin_lc_bill",
            postdata: {},
            sqlBlock: ' stat = 5 and not exists (select 1 from fin_lc_bill_change g where g.lc_bill_id=Fin_Lc_Bill.lc_bill_id and g.stat<5)',
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            result.stat = 1;
            result.creator = $scope.data.currItem.creator;
            result.create_time = $scope.data.currItem.create_time;
            result.wfid = $scope.data.currItem.wfid;
            result.wfflag = $scope.data.currItem.wfflag;
            result.is_into_amt = 0;
            result.is_into_amt = undefined;
            for (name in result) {
                if (!isNaN(result[name] * 1)) {
                    if (result[name] * 1 != 0)   result[name] = parseFloat(result[name]);
                }
                if (result[name] != undefined) {
                    $scope.data.currItem[name] = result[name];
                }
            }
            $scope.data.currItem.y_amt = result.amt;
            $scope.data.currItem.y_inc_rate = result.inc_rate;
            $scope.data.currItem.y_inc_amt = result.inc_amt;
        });
    };
    //销售部门弹窗
    $scope.openSalesPartFrm = function () {
        if ($scope.data.currItem.stat != 1 && $scope.data.currItem.procid != 2 && $scope.data.currItem.procid != 4) {
            BasemanService.notice("流程已启动，此节点不能修改", "alert-warning");
            return;
        }
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
            $scope.data.currItem.org_id = result.orgid;
            $scope.data.currItem.idpath = result.idpath;
            // $scope.data.currItem.manger = result.manger;
            // $scope.data.currItem.note = result.note;
        });
    };
    //客户查询
    $scope.openCustFrm = function () {
        if ($scope.data.currItem.stat != 1 && $scope.data.currItem.procid != 2 && $scope.data.currItem.procid != 4) {
            BasemanService.notice("流程已启动，此节点不能修改", "alert-warning");
            return;
        }
        if ($scope.data.currItem.org_code == undefined || $scope.data.currItem.org_code == "") {
            BasemanService.notice("请先选择业务部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            classid: "customer",
            postdata: {},
        };
        if($scope.data.currItem.org_id > 0) {
            $scope.FrmInfo.sqlBlock = "(org_id =" + $scope.data.currItem.org_id
                + " or other_org_ids like '%," + $scope.data.currItem.org_id + ",%')";
        }else{
            $scope.FrmInfo.sqlBlock = "1=1";
        }
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;
            // $scope.GetCustDays();
            // $scope.GetShipperRelation();
        });
    };
    $scope.GetCustDays = function () {
        if($scope.data.currItem.cust_code==0){return;}
        var days="";
        var postdata={cust_id: $scope.data.currItem.cust_id,flag:10};
        BasemanService.RequestPost("customer_paytype_detail", "getpayline", postdata)
            .then(function (data) {
                if(data.customer_paytype_detailofcustomer.length>0){
                    days=0;
                    for(var i=0;i<data.customer_paytype_detailofcustomer.length;i++){
                        var line=data.customer_paytype_detailofcustomer[i];
                        if (days < line.Days){
                            days= Line.Days;
                        }
                    }
                    $scope.data.currItem.days=Number(days);
                }else{
                    if($scope.data.currItem.days==""){
                        BasemanService.notice('客户的付款方式中没有LC/TT+LC,请重新选择客户或对该客户进行维护!', "alert-warning");
                        return;
                    }
                }
            });
    };
    $scope.GetShipperRelation = function () {
        if($scope.data.currItem.cust_code==0){return;}
        var days="";
        var postdata={
            cust_id: $scope.data.currItem.cust_id,
            sqlBlock:"cust_Id =''"+$scope.data.currItem.cust_id +"''"
        };
        BasemanService.RequestPost("customer_shipper_relation", "search", postdata)
            .then(function (data) {
                if(data.customer_shipper_relation.length>0){
                    $scope.data.currItem.relaman=data.customer_shipper_relation[0].relaman;
                    $scope.data.currItem.relaman2=data.customer_shipper_relation[0].relaman1;
                }
            });
    };
    //业务员
    $scope.openSalesUserFrm = function () {
        if ($scope.data.currItem.stat != 1 && $scope.data.currItem.procid != 2 && $scope.data.currItem.procid != 4) {
            BasemanService.notice("流程已启动，此节点不能修改", "alert-warning");
            return;
        }
        if ($scope.data.currItem.org_name == undefined || $scope.data.currItem.org_name == "") {
            BasemanService.notice("请先选择业务部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            classid: "scpuser",
            postdata: {flag: 10},
            sqlBlock:' scporguser.orgid =' + $scope.data.currItem.org_id,
            backdatas: "users"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.sales_user_id = result.userid;
        });
    };
    //单证人弹窗
    $scope.openProverFrm = function () {
        if ($scope.data.currItem.stat != 1 && $scope.data.currItem.procid != 2) {
            BasemanService.notice("流程已启动，此节点不能修改", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            title: "单证人查询",
            is_high: true,
            thead: [
                {
                    name: "单证人员ID", code: "userid",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "单证人员名称", code: "username",
                    show: true, iscond: true, type: 'string'
                }],
            classid: "scpuser",
            backdatas: "users",
            searchlist: ["userid", "username"],
            is_custom_search: true
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.prover = result.userid;
        });
    };
    //议付银行赋值
    $scope.openConsultBankFrm = function () {
        if ($scope.data.currItem.stat != 1 && $scope.data.currItem.procid != 2) {
            BasemanService.notice("流程已启动，此节点不能修改", "alert-warning");
            return;
        }
        $scope.bill_bank(0);
        BasemanService.open(CommonPopController, $scope).result
            .then(function (result) {
                $scope.data.currItem.lc_consult_bank_id = result.bank_id;
                $scope.data.currItem.lc_consult_bank_code = result.bank_code;
                $scope.data.currItem.lc_consult_bank_name = result.bank_name;
            });
        $scope.result = undefined;
    };
    //通知银行赋值
    $scope.openInFormBankFrm = function () {
        if ($scope.data.currItem.stat != 1 && $scope.data.currItem.procid != 2) {
            BasemanService.notice("流程已启动，此节点不能修改", "alert-warning");
            return;
        }
        $scope.bill_bank(0);
        BasemanService.open(CommonPopController, $scope).result
            .then(function (result) {
                $scope.data.currItem.lc_inform_bank_id = result.bank_id;
                $scope.data.currItem.lc_inform_bank_code = result.bank_code;
                $scope.data.currItem.lc_inform_bank_name = result.bank_name;
                $scope.data.currItem.lc_inform_bank_no = result.account_no;
            })
        $scope.result = undefined;
    };
    //开证银行赋值
    $scope.openOpenBankFrm = function () {
        if ($scope.data.currItem.stat != 1 && $scope.data.currItem.procid != 2) {
            BasemanService.notice("流程已启动，此节点不能修改", "alert-warning");
            return;
        }
        if ($scope.data.currItem.usable == 2) {
            $scope.bill_bank(1);
        } else {
            $scope.bill_bank(0);
        }
        BasemanService.open(CommonPopController, $scope).result
            .then(function (result) {
                $scope.data.currItem.lc_open_bank_id = result.bank_id;
                $scope.data.currItem.lc_open_bank_code = result.bank_code;
                $scope.data.currItem.lc_open_bank_name = result.bank_name;

                $scope.data.currItem.swift = result.swift_code;
            })
        $scope.result = undefined;
    };

    //福费廷银行赋值
    $scope.openFftFrm = function () {
        if ($scope.data.currItem.stat != 1 && $scope.data.currItem.procid != 2) {
            BasemanService.notice("流程已启动，此节点不能修改", "alert-warning");
            return;
        }
        $scope.bill_bank(0);
        BasemanService.open(CommonPopController, $scope).result
            .then(function (result) {
                $scope.data.currItem.fft_bank = result.bank_name;
            })
        $scope.result = undefined;
    };
    //保兑银行赋值
    $scope.openExchangeBankFrm = function () {
        if ($scope.data.currItem.stat != 1 && $scope.data.currItem.procid != 2) {
            BasemanService.notice("流程已启动，此节点不能修改", "alert-warning");
            return;
        }
        $scope.bill_bank(1);
        BasemanService.open(CommonPopController, $scope).result
            .then(function (result) {
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
                flag: flag
            }
        };
        // $scope.result = BasemanService.open(CommonPopController, $scope).result;
    };
    //到货港港口弹窗
    $scope.openSeaPortInFrm = function () {
        if ($scope.data.currItem.stat != 1 && $scope.data.currItem.procid != 2) {
            BasemanService.notice("流程已启动，此节点不能修改", "alert-warning");
            return;
        }
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
        if ($scope.data.currItem.stat != 1 && $scope.data.currItem.procid != 2) {
            BasemanService.notice("流程已启动，此节点不能修改", "alert-warning");
            return;
        }
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
        if ($scope.data.currItem.stat != 1 && $scope.data.currItem.procid != 2) {
            BasemanService.notice("流程已启动，此节点不能修改", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            classid: "seaport",
            sqlBlock: $scope.postdata.sqlwhere,
        };
        $scope.result = BasemanService.open(CommonPopController, $scope).result
    };
    //所在国家  
    $scope.openAreaNameFrm = function () {
        if ($scope.data.currItem.stat != 1 && $scope.data.currItem.procid != 2) {
            BasemanService.notice("流程已启动，此节点不能修改", "alert-warning");
            return;
        }
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
    //已确认
    $scope.checkstats = [
        {
            id: 1,
            name: "未确认"
        }, {
            id: 2,
            name: "已确认"
        }];
    //orgin产地证
    $scope.orgins = [
        {
            id: 1,
            orginvalue: "CO"
        }, {
            id: 2,
            orginvalue: "FROM A"
        }, {
            id: 3,
            orginvalue: "FROM E"
        }, {
            id: 4,
            orginvalue: "FROM F"
        }, {
            id: 5,
            orginvalue: "其他"
        }];
    //状态
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
    //LC受益人
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
    /********************************保存校验******************/
    $scope.validate = function () {
        if ($scope.data.currItem.lc_bill_date > $scope.data.currItem.rec_lc_date) {
            BasemanService.notice("信用证日期不能大于收证日期", "alert-warning");
            return false;
        }
        if ($scope.data.currItem.fact_amt==undefined||$scope.data.currItem.fact_amt=="") {
            BasemanService.notice("实际金额不能为空", "alert-warning");
            return false;
        }
        if ($scope.data.currItem.procid == 4 && $scope.data.currItem.cust_name != $scope.data.currItem.lc_req_man) {
            BasemanService.notice("客户名称与申请人不一致", "alert-warning");
            return false;
        }
        return true;
    };
    $scope.save_before = function (postdata) {
        if (window.userbean.stringofrole.indexOf("单证") == -1 || window.userbean.stringofrole.indexOf("admin") == 0 && $scope.data.currItem.stat == 3) {
            postdata.flag = 10;
            // $scope.data.currItem.prover=window.strUserId;
        }
    };

    /********************************增加历史信用证******************/
    //复制历史
    $scope.addpro = function () {
        $scope.FrmInfo = {
            classid: "fin_lc_bill",
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.lc_bill_id = result.lc_bill_id;
            $scope.data.currItem.copy = 1;
            $scope.refresh(2);
        });

    };
    //单证节点控制
    $scope.authority = function () {
        if ($scope.data.currItem.procid == 2) {
            $timeout(function () {
                $("#myid1,#myid2,#myid3,#myid4,#myid5,#myid6,#myid7,#myid8,#myid9,#myid10,#myid11").attr('disabled', false).trigger("chosen:updated")

            }, 1000);
        }
    };
    $scope.refresh_after = function () {
        $scope.authority();
        //取当前的时间为单据的时间
        $scope.data.currItem.lc_bill_date = moment().format('YYYY-MM-DD HH:mm:ss');
        $scope.data.currItem.version = 1;
        //制单人为当前登录的用户
        $scope.data.currItem.creator = window.strUserId;
        $scope.data.currItem.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
        //复制历史
        if ($scope.data.currItem.copy == 1) {
            $scope.data.currItem.lc_bill_id = 0;
            $scope.data.currItem.lc_bill_no = "";
            $scope.data.currItem.wfid = 0;
            $scope.data.currItem.wfflag = 0;
            $scope.data.currItem.stat = 1;
            $scope.data.currItem.lc_no = "";

            $scope.data.currItem.updator = "";
            $scope.data.currItem.update_time = "";
            $scope.data.currItem.checkor = "";
            $scope.data.currItem.check_time = "";
            $scope.data.currItem.amt_dist = 0;
            $scope.data.currItem.rec_lc_date = "";
            $scope.data.currItem.confirm_amt = 0;
            $scope.data.currItem.reduce_amt = 0;
            $scope.data.currItem.deliver_amt = 0;
            $scope.data.currItem.is_money_over = 1;

            $scope.data.currItem.checktor;
            $scope.data.currItem.checktime = "";
            $scope.data.currItem.confirm_man = "";
            $scope.data.currItem.confirm_date = "";
            $scope.data.currItem.fft_bank = "";
            $scope.data.currItem.lc_no = "";
            $scope.data.currItem.rec_lc_date = "";
            $scope.data.currItem.confirm_amt = "";
            $scope.data.currItem.amt_dist = "";
            $scope.data.currItem.deliver_amt = "";
            $scope.data.currItem.is_money_over = "";
            $scope.data.currItem.suggest_info = "";
            if ($scope.data.currItem.procid == 2) {
                $scope.data.currItem.lc_bill_id = data.lc_bill_id;
                $scope.data.currItem.lc_bill_no = data.lc_bill_no;
                $scope.data.currItem.wfid = data.wfid || 0;
                $scope.data.currItem.wfflag = data.wfflag || 0;
                $scope.data.currItem.stat = 3;
                $scope.data.currItem.procid = 2;
                $scope.data.currItem.lc_no = data.lc_no;
                $scope.data.currItem.fft_bank = data.fft_bank;
                $scope.data.currItem.fft_type = data.fft_type || 0;
            }

        }

    };
    /********************初始化***************************/
    $scope.clearinformation = function () {
        $scope.data.currItem.creator = window.strUserId;
        $scope.data.currItem.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
        $scope.data.currItem.lc_bill_date = moment().format('YYYY-MM-DD HH:mm:ss')
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.lc_type = 1;
        $scope.data.currItem.prover = window.userbean.userid;
        $scope.data.currItem.confirm_stat = 1;
        $scope.data.currItem.currency_code = "USD";
        $scope.data.currItem.sales_user_id = window.userbean.userid;
    };
    /********************保存校验区域***************************/
    //数据缓存
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('fin_lc_bill_changeEdit', fin_lc_bill_changeEdit);
