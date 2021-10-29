var salemanControllers = angular.module('inspinia');
function sale_venderEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_venderEdit = HczyCommon.extend(sale_venderEdit, ctrl_bill_public);
    sale_venderEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_vender",
        key: "vender_id",
//        wftempid: 10162,
        FrmInfo: {},
        grids: []
    };
    /******************界面初始化****************************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            created_by: window.strUserId,
            creation_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            stat: 1,
        };
    };
    /***************************词汇值***************************/
    // 订单类型词汇
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.wfflag = data.dictcode;
            $scope.stats = HczyCommon.stringPropToNum(data.dicts);
        });
    /***********************权限控制*********************/
    $scope.initdata();

}

//加载控制器
salemanControllers
    .controller('sale_venderEdit', sale_venderEdit);
