var basemanControllers = angular.module('inspinia');
function base_contractEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    base_contractEdit = HczyCommon.extend(base_contractEdit, ctrl_bill_public);
    base_contractEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"base_contract",
        key:"contract_id",
        //wftempid:
        FrmInfo: {},
        grids:[]
    };
    /**----弹出框区域*---------------*/
    //大区
    $scope.zone_code = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
            sqlBlock: "stat =2 and orgtype = 3",
            backdatas: "orgs"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.zone_code = result.code;
            $scope.data.currItem.zone_name = result.orgname;
            $scope.data.currItem.org_id = result.orgid;
            $scope.data.currItem.zone_id = result.zone_id;
            $scope.data.currItem.superid = result.superid;
            $scope.data.currItem.entid = result.entid;
        });
    };
    //大区
    $scope.change_zone = function () {
        $scope.data.currItem.zone_code = "";
        $scope.data.currItem.zone_name = "";
        $scope.data.currItem.zone_id = "";
        $scope.data.currItem.org_code = "";
        $scope.data.currItem.org_name = "";
        $scope.data.currItem.org_id = "";
        $scope.data.currItem.superid = "";
        $scope.data.currItem.entid = "";
    };
    //销售部门弹窗
    $scope.orgname = function () {
        if($scope.data.currItem.org_id==""||$scope.data.currItem.org_id==undefined){
            BasemanService.notice("请选择大区！", "alter-warning")
            return;
        }
        $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
            sqlBlock: "1=1 and stat =2 and OrgType = 5 and superid =" + $scope.data.currItem.org_id,
            backdatas: "orgs"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_id = result.orgid;
            $scope.data.currItem.zone_id = result.zone_id;
            $scope.data.currItem.entid = result.entid;
        });
    };
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
    .controller('base_contractEdit', base_contractEdit);
