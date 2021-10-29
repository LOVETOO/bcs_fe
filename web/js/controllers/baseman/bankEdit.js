var basemanControllers = angular.module('inspinia');
function bankEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    bankEdit = HczyCommon.extend(bankEdit, ctrl_bill_public);
    bankEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"bank",
        key:"bank_id",
        //wftempid:
        FrmInfo: {},
        grids:[]
    };
    /**----弹出框区域*---------------*/
    /*词汇值*/
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "return_ent_type"})
        .then(function (data) {
            $scope.return_ent_types = HczyCommon.stringPropToNum(data.dicts);
        });
    //币种
    BasemanService.RequestPost("base_search", "searchcurrency", {})
        .then(function (data) {
            $scope.base_currencys = data.base_currencys;
        });
    $scope.currency_change = function () {
        for (var i = 0; i < $scope.base_currencys.length; i++) {
            if ($scope.data.currItem.currency_id == $scope.base_currencys[i].currency_id) {
                $scope.data.currItem.currency_code = $scope.base_currencys[i].currency_code;
                $scope.data.currItem.currency_name = $scope.base_currencys[i].currency_name;
            }
        }
    };
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            currency_id : "4"
        };
    };

    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('bankEdit', bankEdit);
