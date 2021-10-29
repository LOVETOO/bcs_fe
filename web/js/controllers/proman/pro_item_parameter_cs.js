var billmanControllers = angular.module('inspinia');
function pro_item_parameter_cs($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService, notify) {
    //继承基类方法
    pro_item_parameter_cs = HczyCommon.extend(pro_item_parameter_cs, ctrl_bill_public);
    pro_item_parameter_cs.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //
    $scope.objconf = {
        name: "",
        key:"",
        // wftempid:10142,
        FrmInfo: {},
        grids:[]
    };
    /************初始化******************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            parameter_item_type:"内机",
            parameter_item_type1:"外机",
        };
    };
    /************下拉值******************/
    //产品平台
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "item_platform"}).then(function (data) {
        $scope.item_platforms =  data.dicts;
    })
    //冷暖
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cool_type"}).then(function (data) {
        $scope.nj_pm_weights =  data.dicts;
    })
    //截止阀规格
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "jzfgg"}).then(function (data) {
        $scope.wj_zx_weights =  data.dicts;
    })
/***************内机********************/
    //内机测算
    $scope.njcs = function () {
        if($scope.data.currItem.item_platform==""||$scope.data.currItem.item_platform==undefined){
            BasemanService.notice("产品平台不能为空！");
            return;
        }
        if($scope.data.currItem.gb_weight==""||$scope.data.currItem.gb_weight==undefined){
            BasemanService.notice("连线长度不能为空！");
            return;
        }
        if($scope.data.currItem.nj_pm_weight==""||$scope.data.currItem.nj_pm_weight==undefined){
            BasemanService.notice("单冷/冷暖不能为空！");
            return;
        }
        if($scope.data.currItem.ng_zx_weight==""||$scope.data.currItem.ng_zx_weight==undefined){
            BasemanService.notice("内机净重不能为空！");
            return;
        }
        var postdata={
            parameter_item_type:2,
            item_platform: Number($scope.data.currItem.item_platform),
            gb_weight: parseFloat($scope.data.currItem.gb_weight),
            nj_pm_weight: Number($scope.data.currItem.nj_pm_weight),
            ng_zx_weight: parseFloat($scope.data.currItem.ng_zx_weight)
        };
        BasemanService.RequestPost("pro_item_parameter", "njcs", postdata)
            .then(function (data) {
                $scope.data.currItem.amt=data.amt;
            });
    }
   //清空内机测算条件
    $scope.njqc = function () {
        $scope.data.currItem.amt="";
        $scope.data.currItem.ng_zx_weight="";
        $scope.data.currItem.nj_pm_weight="";
        $scope.data.currItem.gb_weight="";
        $scope.data.currItem.item_platform="";
    }
    /***************外机********************/
    $scope.wjcs = function () {
        if($scope.data.currItem.item_platform1==""||$scope.data.currItem.item_platform1==undefined){
            BasemanService.notice("产品平台不能为空！");
            return;
        }
        if($scope.data.currItem.wj_zx_weight==""||$scope.data.currItem.wj_zx_weight==undefined){
            BasemanService.notice("截止阀规格不能为空！");
            return;
        }
        if($scope.data.currItem.wj_pm_weight==""||$scope.data.currItem.wj_pm_weight==undefined){
            BasemanService.notice("钢管长度不能为空！");
            return;
        }
        if($scope.data.currItem.azfj_weight==""||$scope.data.currItem.azfj_weight==undefined){
            BasemanService.notice("外机净重不能为空！");
            return;
        }
        var postdata={
            parameter_item_type1:3,
            item_platform1: Number($scope.data.currItem.item_platform1),
            wj_pm_weight: parseFloat($scope.data.currItem.wj_pm_weight),
            wj_zx_weight: Number($scope.data.currItem.wj_zx_weight),
            azfj_weight: parseFloat($scope.data.currItem.azfj_weight)
        };
        BasemanService.RequestPost("pro_item_parameter", "wjcs", postdata)
            .then(function (data) {
                $scope.data.currItem.amt1=data.amt1;
            });
    }
    //清空外机测算条件
    $scope.wjqc = function () {
        $scope.data.currItem.amt1="";
        $scope.data.currItem.item_platform1="";
        $scope.data.currItem.wj_pm_weight="";
        $scope.data.currItem.wj_zx_weight="";
        $scope.data.currItem.azfj_weight="";
    }
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('pro_item_parameter_cs', pro_item_parameter_cs)
