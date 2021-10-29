var basemanControllers = angular.module('inspinia');

function oa_home($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
	//继承基类方法
	oa_home = HczyCommon.extend(oa_home, ctrl_single_table);
	oa_home.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
	//设置当前单据对象基本信息
	$scope.objconf = {
		name: "oa_home",
		key: "schedulerid",
		classid: "oa_home",
		FrmInfo: {},
		grids: []
	};

	//界面初始化

	$scope.clearinformation = function() {
		$scope.data = {
			currItem: {
				schedulerid: 0,
				autorun: 1,
				runinterval: 1,
				intervalunit: 10,
				maxcount: 0,
				nexttime: moment().format('YYYY-MM-DD HH:mm:ss'),
				totalcount: 0
			}
		}
	}

	$scope.initdata();

}

//加载控制器
basemanControllers
	.controller('oa_home', oa_home);

//滚动条
$(function() {
	debugger;
	var $this = $(".userinfo");
	var scrollTimer;
	$this.hover(function() {
		clearInterval(scrollTimer);
	}, function() {
		scrollTimer = setInterval(function() {
			scrollNews($this);
		}, 2000);
	}).trigger("mouseleave");

	function scrollNews(obj) {
		var $self = obj.find("div");
		var lineHeight = $self.find("div:first").height();
		$self.animate({
			"marginTop": -lineHeight + "px"
		}, 600, function() {
			$self.css({
				marginTop: 0
			}).find("li:first").appendTo($self);
		})
	}
})