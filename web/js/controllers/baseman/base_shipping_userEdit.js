var basemanControllers = angular.module('inspinia');
function base_shipping_userEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    base_shipping_userEdit = HczyCommon.extend(base_shipping_userEdit, ctrl_bill_public);
    base_shipping_userEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"base_shipping_user",
        key:"shipping_id",
        //wftempid:
        FrmInfo: {},
        grids:[]
    };
    /**----弹出框区域*---------------*/
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss')
        };
    };
    $scope.personnel_types=[
        {id:1,name:"船务"},
        {id:2,name:"单证"}
    ];
    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('base_shipping_userEdit', base_shipping_userEdit);
