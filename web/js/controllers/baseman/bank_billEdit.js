var basemanControllers = angular.module('inspinia');
function bank_billEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    bank_billEdit = HczyCommon.extend(bank_billEdit, ctrl_bill_public);
    bank_billEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "bill_bank",
        key: "bank_id",
        // wftempid: 10137,
        FrmInfo: {},
        grids:[],
        // grids: [{optionname: 'options_13', idname: 'pro_item_ysamts'}]
    };
    /****************************初始化**********************/
    var myDate = new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            usable:2,
        };
    };
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('bank_billEdit', bank_billEdit);
