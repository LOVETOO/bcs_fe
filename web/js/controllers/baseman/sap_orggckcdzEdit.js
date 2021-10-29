var basemanControllers = angular.module('inspinia');
function sap_orggckcdzEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sap_orggckcdzEdit = HczyCommon.extend(sap_orggckcdzEdit, ctrl_bill_public);
    sap_orggckcdzEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sap_orggckcdz",
        key: "orggckcdz_id",
        // wftempid: 10137,
        FrmInfo: {},
        grids:[],
        // grids: [{optionname: 'options_13', idname: 'pro_item_ysamts'}]
    };
    // BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
    //     $scope.sale_ent_types = data.dicts;
    // })
    $scope.sale_ent_types=[{dictvalue:1,dictname:"进出口贸易"},{dictvalue:2,dictname:"香港转口贸易"},
        {dictvalue:3,dictname:"香港直营"},{dictvalue:5,dictname:"工厂直营"}];
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('sap_orggckcdzEdit', sap_orggckcdzEdit);
