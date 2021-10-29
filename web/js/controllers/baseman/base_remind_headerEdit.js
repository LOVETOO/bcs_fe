var basemanControllers = angular.module('inspinia');
function base_remind_headerEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    base_remind_headerEdit = HczyCommon.extend(base_remind_headerEdit, ctrl_bill_public);
    base_remind_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"base_remind_header",
        key:"remind_id",
        //wftempid:
        FrmInfo: {},
        grids:[]
    };
    /**----弹出框区域*---------------*/
    //是否可用
    $scope.sub = function () {
        $scope.showType = !$scope.showType;
    };
    $scope.save_before=function(){
        if(!$scope.data.currItem.remind_type && !$scope.data.currItem.power_type){
            alert("必填项不能为空!");
            return;
        }
    };
    //词汇值
    $scope.powerlist = [
        {id: 1, name: "部门"},
        {id: 2, name: "客户"},
        {id: 3, name: "用户"},
        {id: 4, name: "仓库"},
        {id: 5, name: "<不控制>"}];
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
    };
    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('base_remind_headerEdit', base_remind_headerEdit);
