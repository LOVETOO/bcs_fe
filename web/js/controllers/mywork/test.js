/**这是信息编辑界面js*/
function test($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, $sce) {
	test = HczyCommon.extend(test, ctrl_bill_public);
	test.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

	$scope.objconf = {
		name: "",
		key: "",
		FrmInfo: {},
		grids: [],
		serves: 1
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
	//服务政策

	//定义一个开头
	$scope.switchs = 1;

	//服务政策
	$scope.serve = function() {
		$scope.switchs = 1;
		console.log("服务政策");
	}

	//收费标准
	$scope.collect = function() {
		$scope.switchs = 2
		console.log("收费");
	}
	//家居
	$scope.fitting = function() {
		$scope.switchs = 3;
		console.log("家居");
	}
	//厨具
	$scope.kitchen_ware = function() {
		$scope.switchs = 4;
		console.log("厨具");
	}
	$scope.initdata();
}

//注册控制器
angular.module('inspinia')
	.controller('test', test)