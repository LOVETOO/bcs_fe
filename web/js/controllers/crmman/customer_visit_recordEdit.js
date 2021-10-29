var billmanControllers = angular.module('inspinia');
function customer_visit_recordEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    customer_visit_recordEdit = HczyCommon.extend(customer_visit_recordEdit, ctrl_bill_public);
    customer_visit_recordEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "customer_visit_record",
        key:"record_id",
        wftempid:10105,
        FrmInfo: {},
		grids:[]
    };

    /************************初始化页面***********************/
	var myDate= new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,			
            create_time:myDate.toLocaleDateString(),
            objattachs:[]
        };
    };
    /**---------------------下拉框----------------------*/
    $scope.refresh_after= function(){
        $scope.data.currItem.record_type=Number($scope.data.currItem.record_type);
    }
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stats = HczyCommon.stringPropToNum(data.dicts);
    })
	$scope.record_types = [{dictvalue: 1, dictname: "客户来访"}, {dictvalue: 2, dictname: "拜访记录"},
		{dictvalue: 3, dictname: "会谈记录"}, {dictvalue: 4, dictname: "不良记录"}];
   
    //提交校验附件
    $scope.wfstart_validDate = function () {
        var msg = []
        if ($scope.data.currItem.objattachs == "" || $scope.data.currItem.objattachs == undefined) {
            msg.push("没有附件");
        }
        if (msg.length > 0) {
            BasemanService.notice(msg);
            return false;
        }
        return true;
    }
    /**********************弹出框值查询**************************/
    $scope.selectorg = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        $scope.FrmInfo = {

            classid: "scporg",
            postdata:{},
            sqlBlock: "stat =2 and OrgType = 5",
            backdatas: "orgs",

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_id = result.orgid;

        });
    }
    $scope.selectcust = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        if ($scope.data.currItem.org_code == undefined || $scope.data.currItem.org_code == "") {
            BasemanService.notice("请先选部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {

            postdata: {},
            backdatas: "",
            sqlBlock: "(org_id=" + $scope.data.currItem.org_id
            + " or other_org_ids like '%," + $scope.data.currItem.org_id + ",%')",
            classid: "customer",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;
        });
    }
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('customer_visit_recordEdit', customer_visit_recordEdit)
