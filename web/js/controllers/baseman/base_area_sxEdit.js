var basemanControllers = angular.module('inspinia');
function base_area_sxEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    base_area_sxEdit = HczyCommon.extend(base_area_sxEdit, ctrl_bill_public);
    base_area_sxEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "base_area_sx",
        key: "sx_id",
        // wftempid: 10137,
        FrmInfo: {},
        grids:[],
        // grids: [{optionname: 'options_13', idname: 'pro_item_ysamts'}]
    };
    /****************************初始化**********************/
    $scope.selectorg = function () {
        $scope.FrmInfo = {

            classid: "scporg",
            postdata:{},
            sqlBlock: "Stat =2 and OrgType in (3) and superid=211",
            backdatas: "orgs",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.area_name = result.orgname;
            $scope.data.currItem.area_id = result.orgid;

        });
    }
    var myDate= new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time:myDate.toLocaleDateString(),
        };
    };
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('base_area_sxEdit', base_area_sxEdit);
