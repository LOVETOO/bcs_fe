/**
 * Created by wzf on 2016-12-19.
 */
var basemanControllers = angular.module('inspinia');
function ctrl_shtcontroner($scope, $location, $rootScope, $stateParams, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};

    $scope.iFrameHeight = function(){
        var ifm= document.getElementById("iframepage");
        var subWeb = document.frames ? document.frames["iframepage"].document : ifm.contentDocument;
        if(ifm != null && subWeb != null) {
            ifm.height = subWeb.body.scrollHeight;
            ifm.width = subWeb.body.scrollWidth;
        }
    }
    // 初始化通过页面传递过来的参数
    $scope.data.shtid = $stateParams.shtid;
	$scope.data.url = '/web/sht/sht_' + $stateParams.shtid + '.jsp';
    //动态给frame的src赋值，如果直接用控制器在src绑定变量会报错
    //angular.element('#iframepage').attr('src', '/web/sht/scptest/sht_' + $scope.data.shtid + '.jsp');
}
//加载控制器
basemanControllers.controller('ctrl_shtcontroner', ctrl_shtcontroner)