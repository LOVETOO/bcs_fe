var basemanControllers = angular.module('inspinia');
function custom_elementsEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    custom_elementsEdit = HczyCommon.extend(custom_elementsEdit, ctrl_bill_public);
    custom_elementsEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "custom_elements",
        key: "elements_id",
        // wftempid: 10137,
        FrmInfo: {},
        grids:[],
    };
    //初始化
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
    .controller('custom_elementsEdit', custom_elementsEdit);
