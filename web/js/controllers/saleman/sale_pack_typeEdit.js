var basemanControllers = angular.module('inspinia');
function sale_pack_typeEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_pack_typeEdit = HczyCommon.extend(sale_pack_typeEdit, ctrl_bill_public);
    sale_pack_typeEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"sale_pack_type",
        key:"pack_id",
        //wftempid:
        FrmInfo: {},
        grids:[]
    };
    /**----弹出框区域*---------------*/
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data.currItem.usable=2
    };

    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('sale_pack_typeEdit', sale_pack_typeEdit);
