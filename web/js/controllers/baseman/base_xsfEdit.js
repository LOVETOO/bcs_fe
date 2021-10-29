var basemanControllers = angular.module('inspinia');
function base_xsfEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    base_xsfEdit = HczyCommon.extend(base_xsfEdit, ctrl_bill_public);
    base_xsfEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "base_sx",
        key: "sx_id",
        // wftempid: 10137,
        FrmInfo: {},
        grids:[],
        // grids: [{optionname: 'options_13', idname: 'pro_item_ysamts'}]
    };
     BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cool_stand"}).then(function (data) {
         $scope.cool_stands = data.dicts;
     })
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "mb_stand"}).then(function (data) {
        $scope.mb_stands = data.dicts;
    })
    // $scope.mb_stands=[{dictvalue: 1, dictname: 'N'}, {dictvalue: 2, dictname: 'K'},{dictvalue: 3, dictname: 'E'}, {dictvalue: 4, dictname: 'S'},
    //     {dictvalue: 5, dictname: 'Q'}, {dictvalue: 6, dictname: 'P'},{dictvalue: 7, dictname: 'V'}, {dictvalue: 8, dictname: '默认'},
    //     {dictvalue: 9, dictname: 'L'}, {dictvalue: 10, dictname: 'F'},{dictvalue: 11, dictname: 'Y'},{dictvalue: 12, dictname: 'M'},
    //     {dictvalue: 13, dictname: 'A'},{dictvalue: 14, dictname: 'U'}, {dictvalue: 15, dictname: 'AK'},{dictvalue: 16, dictname: '其他'}];
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('base_xsfEdit', base_xsfEdit);
