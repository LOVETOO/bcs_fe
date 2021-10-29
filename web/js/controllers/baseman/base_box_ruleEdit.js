var basemanControllers = angular.module('inspinia');
function base_box_ruleEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    base_box_ruleEdit = HczyCommon.extend(base_box_ruleEdit, ctrl_bill_public);
    base_box_ruleEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"base_box_rule",
        key:"rule_id",
        //wftempid:
        FrmInfo: {},
        grids:[]
    };
    /**----弹出框区域*---------------*/
        //柜型词汇
    BasemanService.RequestPost("base_search", "searchdict", {dictcode:"box_type"})
        .then(function(data) {
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

    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('base_box_ruleEdit', base_box_ruleEdit);
