var basemanControllers = angular.module('inspinia');
function bill_invoice_header_djEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    bill_invoice_header_djEdit = HczyCommon.extend(bill_invoice_header_djEdit, ctrl_bill_public);
    bill_invoice_header_djEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "bill_invoice_header_jd",
        key: "bill_id",
        wftempid: 10179,
        FrmInfo: {},    
        grids: []
    };
    /*********************弹出框区域**************************/
    //流水发票号
    $scope.Invoice_No = function () {
        $scope.FrmInfo = {
            classid: "bill_invoice_header",
            postdata: {},
            sqlBlock:" stat=5"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            result.stat = 1;
            result.creator = $scope.data.currItem.creator;
            result.create_time = $scope.data.currItem.create_time;
            result.wfid = $scope.data.currItem.wfid;
            result.wfflag = $scope.data.currItem.wfflag;
            //商业发票号 发票金额 付款方式 销售部门 客户 发票流水号
            $scope.data.currItem.invoice_id=result.invoice_id;
            $scope.data.currItem.invoice_no=result.invoice_no;
            $scope.data.currItem.fact_invoice_no=result.fact_invoice_no;
            $scope.data.currItem.invoice_amt=parseFloat(result.invoice_amt||0);
            $scope.data.currItem.payment_type_name=result.payment_type_name;
            $scope.data.currItem.payment_type_code=result.payment_type_code;
            $scope.data.currItem.payment_type_id=result.payment_type_id;
            $scope.data.currItem.org_name=result.org_name;
            $scope.data.currItem.org_code=result.org_code;
            $scope.data.currItem.org_id=result.org_id;
            $scope.data.currItem.cust_name=result.cust_name;
            $scope.data.currItem.cust_code=result.cust_code;
            $scope.data.currItem.cust_id=result.cust_id;
            $scope.data.currItem.pino_new=result.pi_no;
            $scope.data.currItem.pi_id=result.pi_id;
        });
    };
    //保兑银行赋值
    $scope.openExchangeBankFrm = function () {
        if ($scope.data.currItem.stat!=1 && $scope.data.currItem.procid!=2) {
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
    /*********************系统词汇值**************************/
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stats = HczyCommon.stringPropToNum(data.dicts);
    });
    //融资类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "rongzi_type"}).then(function (data) {
        $scope.rongzi_types = HczyCommon.stringPropToNum(data.dicts);
    });
    $scope.jd_stats=[
        {id:1,name:"未交单"},
        {id:2,name:"已交单"}
    ]
     /********************************保存校验******************/
    /********************************增加历史信用证******************/
	
    /********************初始化***************************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            stat: 1,
            jd_stat: 1
        };
    };

    /********************保存校验区域***************************/
    //数据缓存
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('bill_invoice_header_djEdit', bill_invoice_header_djEdit);
