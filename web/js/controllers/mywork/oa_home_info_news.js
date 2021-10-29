/**这是信息编辑界面js*/
function oa_home_info_news($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, $sce) {
	oa_home_info_news = HczyCommon.extend(oa_home_info_news, ctrl_bill_public);
	oa_home_info_news.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

	$scope.objconf = {
		name: "oa_home_info",
		key: "info_id",
		wftempid: 10164,
		FrmInfo: {},
		grids: []
	};
	/******************界面初始化****************************/
	$scope.clearinformation = function() {
		$scope.searchlist = false;
		$scope.data = {};
		$scope.data.currItem = {
			creator: userbean.userid,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			usable: 2
		};
	};
	$scope.strLoginGuid = strLoginGuid;
	//将内容转换成html
	$scope.refresh_after = function() {
		$scope.data.read_sum = $scope.data.currItem.read_sum;
		$scope.data.creator = $scope.data.currItem.creator;
		$scope.data.create_time = $scope.data.currItem.create_time
		$scope.data.title = $sce.trustAsHtml($scope.data.currItem.title);
		$scope.data.contentHtml = $sce.trustAsHtml($scope.data.currItem.contant);
	}

	$scope.initdata();
}

//注册控制器
angular.module('inspinia')
	.controller('oa_home_info_news', oa_home_info_news)