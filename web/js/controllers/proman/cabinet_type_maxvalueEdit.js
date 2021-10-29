var promanControllers = angular.module('inspinia');
function cabinet_type_maxvalueEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    cabinet_type_maxvalueEdit = HczyCommon.extend(cabinet_type_maxvalueEdit, ctrl_bill_public);
    cabinet_type_maxvalueEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "cabinet_type_maxvalue",
        key: "ctm_id",
        FrmInfo: {},
        grids: []
    };
    //柜型词汇
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "box_type"}).then(function (data) {
            $scope.box_types = HczyCommon.stringPropToNum(data.dicts);
    });
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss')
        };
    };
    //数据缓存
    $scope.initdata();

}
//加载控制器
promanControllers
    .controller('cabinet_type_maxvalueEdit', cabinet_type_maxvalueEdit);
