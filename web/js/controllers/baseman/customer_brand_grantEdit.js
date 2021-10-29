var basemanControllers = angular.module('inspinia');
function customer_brand_grantEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    customer_brand_grantEdit = HczyCommon.extend(customer_brand_grantEdit, ctrl_bill_public);
    customer_brand_grantEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "customer_brand_grant",
        key: "grant_id",
        wftempid: 10259,
        FrmInfo: {},
        grids: []
    };
    /**----弹出框区域*---------------*/
    //客户
    $scope.selectcust = function () {
        $scope.FrmInfo = {
            classid: "customer",
            postdata: {},
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;
        });
    };
    //历史单
    $scope.grant_no_h = function () {
        $scope.FrmInfo = {
            classid: "customer_brand_grant",
            postdata: {},
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            HczyCommon.stringPropToNum(result);
            $scope.data.currItem.grant_no = result.grant_no;
            $scope.data.currItem.grant_no_h = result.grant_no;
            $scope.data.currItem.grant_id = result.grant_id;
            $scope.data.currItem.brand_name = result.brand_name;
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.start_date = result.start_date;
            $scope.data.currItem.end_date = result.end_date;
            $scope.data.currItem.brand_type = result.brand_type;
            $scope.data.currItem.note = result.note;
        });
    };
    //提交校验
    $scope.wfstart_validDate = function () {
        if ($scope.data.currItem.objattachs.length == 0&&$scope.data.currItem.stat==1) {
            BasemanService.notice("请上传附件!", "alert-warning");
            return false;
        }
        return true;
    };
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            stat: 1,
            useable:2,
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            objattachs : []
        };
    };
    //刷新
    $scope.refresh_after=function(){
        $scope.data.currItem.useable=2;
    };
    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('customer_brand_grantEdit', customer_brand_grantEdit);
