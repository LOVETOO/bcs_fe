var basemanControllers = angular.module('inspinia');
function base_currencyEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    base_currencyEdit = HczyCommon.extend(base_currencyEdit, ctrl_bill_public);
    base_currencyEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"base_currency",
        key:"currency_id",
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
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            //sales_user_id: $scope.userbean.userid
        };
    };

    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('base_currencyEdit', base_currencyEdit);
