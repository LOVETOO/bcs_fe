var basemanControllers = angular.module('inspinia');
function bill_finacingEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    bill_finacingEdit = HczyCommon.extend(bill_finacingEdit, ctrl_bill_public);
    bill_finacingEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "bill_finacing",
        key: "bill_id",
        wftempid: 10172,
        FrmInfo: {},    
        grids: []
    };
    /************************角色控制*********************************/
    $scope.Currprocname=function(){
        if (window.userbean.stringofrole.indexOf("单证员")) {
            $scope.objconf.Frminfo={sqlBlock:"1=1 and"};
        }else if(window.userbean.stringofrole.indexOf("单证组长")){
            $scope.objconf.Frminfo={sqlBlock:"1=1"};
        }else if(window.userbean.stringofrole.indexOf("单证主管")){
            $scope.objconf.Frminfo={sqlBlock:"1=1"};
        }else if(window.userbean.stringofrole.indexOf("admin")){
            $scope.objconf.Frminfo={sqlBlock:"1=1"};
        }else if(window.userbean.stringofrole.indexOf("admins")){
            $scope.objconf.Frminfo={sqlBlock:"1=1"};
        }
    };
    $scope.Currprocname();
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
    //融资银行
    $scope.BankRz = function () {
        $scope.FrmInfo = {
            classid: "bill_bank",
            postdata: {flag:0},
            title: "银行",
            is_high: true,
            is_custom_search:true,
            thead: [
                {
                    name: "银行名称",
                    code: "bank_name",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "SWIFT_CODE",
                    code: "swift_code",
                    show: true, iscond: true, type: 'string'
                }]
        };
        BasemanService.open(CommonPopController, $scope).result
            .then(function (result) {
                $scope.data.currItem.rongzi_bank = result.bank_name;
            });
    };
    $scope.Rongzi_Days =function DateDiff() {  //sDate1和sDate2是yyyy-MM-dd格式
        var aDate,iDays;
        var oDate1=$scope.data.currItem.rongzi_date;
        var oDate2=$scope.data.currItem.funds_date;
        if(oDate1){
            aDate = oDate1.split("-");
            oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);  //转换为yyyy-MM-dd格式
        }
        if(oDate2){
            aDate = oDate2.split("-");
            oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
        }
        if(oDate1&&oDate2){
            iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
            $scope.data.currItem.rongzi_days=iDays;
        }

    };
    /*********************系统词汇值**************************/
    //融资类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "rongzi_type"}).then(function (data) {
        $scope.rongzi_types = HczyCommon.stringPropToNum(data.dicts);
    });
     /********************************保存校验******************/
    /* $scope.validate = function () {
         if ($scope.data.currItem.lc_bill_date > $scope.data.currItem.rec_lc_date) {
             BasemanService.notice("信用证日期不能大于收证日期", "alert-warning");
             return false;
         }
         return true;
     };
     $scope.save_before=function(postdata){
         if (window.userbean.stringofrole.indexOf("单证") == -1 || window.userbean.stringofrole.indexOf("admin") == 0 && $scope.data.currItem.stat == 3) {
             postdata.flag = 10;
         }
     };
    //节点控制
    $scope.authority =function(){
        if ($scope.data.currItem.procid==2) {
            $timeout(function(){
                $("#myid1,#myid2,#myid3,#myid4,#myid5,#myid6,#myid7,#myid8,#myid9,#myid10,#myid11").attr('disabled', false).trigger("chosen:updated")

            },1000);
        }
    };*/
    $scope.save_before=function(){
        delete $scope.data.currItem.objattachs;
    }
    /********************初始化***************************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            objattachs: [],
            stat: 1,
        };
    };
    /********************保存校验区域***************************/
    //数据缓存
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('bill_finacingEdit', bill_finacingEdit);
