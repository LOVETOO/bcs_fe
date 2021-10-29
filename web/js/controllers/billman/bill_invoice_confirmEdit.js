var billmanControllers = angular.module('inspinia');
function bill_invoice_confirmEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    bill_invoice_confirmEdit = HczyCommon.extend(bill_invoice_confirmEdit, ctrl_bill_public);
    bill_invoice_confirmEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "bill_invoice_confirm",
        key: "bill_id",
        wftempid:10177,
        FrmInfo: {},
        grids: []
    };
    /***************************弹出框***********************/
    //发票号
    $scope.Invoice_No = function () {
        $scope.FrmInfo = {
            classid: "bill_invoice_header",
            sqlBlock: "stat =5",
            postdata: {sqlBlock:"(nvl(invoice_type,0)<> 2)"}
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (data) {
            delete data.wfid;
            delete data.wfflag;
            delete data.stat;
            delete data.creator;
            delete data.create_time;
            $scope.data.currItem.stat=1;
            $scope.data.currItem.invoice_no = data.invoice_no;
            $scope.data.currItem.fact_invoice_no = data.fact_invoice_no;
            $scope.data.currItem.pino_new = data.pino_new;
            $scope.data.currItem.org_id = data.org_id;
            $scope.data.currItem.org_name = data.org_name;
            $scope.data.currItem.org_code = data.org_code;
            $scope.data.currItem.cust_id = data.cust_id;
            $scope.data.currItem.cust_name = data.cust_name;
            $scope.data.currItem.cust_code = data.cust_code;

        });
    };
   /* //部门
    $scope.Org_Name = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            postdata:{},
            backdatas: "orgs",
            sqlBlock:"1=1 and OrgType = 5"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_code=result.code;
            $scope.data.currItem.org_name=result.orgname;
            $scope.data.currItem.org_id=result.orgid;
        });
    };
    //客户编码
    $scope.Cust_Code = function () {
        if($scope.data.currItem.org_name==""||$scope.data.currItem.org_name==undefined){
            BasemanService.notice("请选择部门！", "alter-warning")
            return;
        }
        $scope.FrmInfo = {
            classid: "customer",
            postdata: {}
        };
        if($scope.data.currItem.org_id > 0) {
            $scope.FrmInfo.sqlBlock = "(org_id =" + $scope.data.currItem.org_id
                + " or other_org_ids like '%," + $scope.data.currItem.org_id + ",%')";
        }else{
            $scope.FrmInfo.sqlBlock = "1=1";
        }
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {

            BasemanService.RequestPost("customer", "select", {cust_id: result.cust_id})
                .then(function (data) {
                    $scope.data.currItem.cust_code=result.sap_code;
                    $scope.data.currItem.cust_name=result.cust_name;
                    $scope.data.currItem.cust_id=result.cust_id;
                })
        });
    };*/
   /***********************保存校验区域*********************/
    $scope.validate = function () {
        var errorlist = [];
        if (errorlist.length) {
            BasemanService.notify(notify,errorlist, "alert-danger");
            return false;
        }
        return true;
    };
    /****************************初始化**********************/
	var myDate= new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,
            create_time:myDate.toLocaleDateString(),
        };
    };
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('bill_invoice_confirmEdit', bill_invoice_confirmEdit);
