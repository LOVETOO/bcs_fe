var billmanControllers = angular.module('inspinia');
function aux_oms_sapEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService, notify) {
    //继承基类方法
    aux_oms_sapEdit = HczyCommon.extend(aux_oms_sapEdit, ctrl_bill_public);
    aux_oms_sapEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "aux_oms_sap",
        key: "oms_sap_id",
        //    wftempid:10150,
        FrmInfo: {},
        grids: []
    };
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            usable:2,
        };
    };
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('aux_oms_sapEdit', aux_oms_sapEdit)
