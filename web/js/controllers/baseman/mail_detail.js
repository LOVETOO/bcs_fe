var billmanControllers = angular.module('inspinia');
function mail_detail($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    mail_detail = HczyCommon.extend(mail_detail, ctrl_bill_public);
    mail_detail.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "scpemail",
        key: "emailid",
        //wftempid: 10003,
        FrmInfo: {},
        grids: []
    };
	
	
    //界面初始化
    $scope.clearinformation = function () {
        if (!$scope.data) $scope.data = {}
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            usable:2,
            seaport_type:1
        };
    };
    /**--------系统词汇词------*/
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "seaport_type"}).then(function (data) {
        $scope.seaport_types = data.dicts;
    });
   
    //数据缓存
    $scope.initdata();

};


angular.module('inspinia')
    .controller('mail_detail', mail_detail)

