function wffile_d($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    wffile_d = HczyCommon.extend(wffile_d, ctrl_bill_public);
    wffile_d.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

    $scope.objconf = {
        name: "scpwf",
        key: "wfid",
        wftempid: 12127,
        FrmInfo: {},
        grids: []
    };

    $scope.clearinformation = function() {
        $scope.data = {};
        $scope.data.currItem = {
           
        };

    };

    /*归档发布设置*/
    $scope.loginGUID = strLoginGuid;
    $scope.initdata();
}

//注册控制器
angular.module('inspinia')
    .controller('wffile_d', wffile_d);
