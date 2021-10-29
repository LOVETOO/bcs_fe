var crmmanControllers = angular.module('inspinia');
function customer_caseEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    customer_caseEdit = HczyCommon.extend(customer_caseEdit, ctrl_bill_public);
    customer_caseEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "customer_case",
        key: "case_id",
        // wftempid:10171,
        FrmInfo: {},
        grids: []
    };
    /************************系统词汇**************************/
    /***************************弹出框***********************/
    //部门
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
    };
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
crmmanControllers
    .controller('customer_caseEdit', customer_caseEdit);
