var basemanControllers = angular.module('inspinia');

function oa_home($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
	//继承基类方法
	oa_home = HczyCommon.extend(oa_home, ctrl_bill_public);
	oa_home.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
	//设置当前单据对象基本信息
	$scope.objconf = {
		name: "oa_home",
		key: "schedulerid",
		classid: "oa_home",
		nextStat: "more_news",
		FrmInfo: {},
		grids: []
	};
	$scope.homeinfo = [];
	//计数
	$scope.count = 1;
	$scope.countBirthday = 1;
	//新员工要显示的行数
	var employee_linage = 3;
	//员工生日要显示的行数
	var birthday_linage = 3;

	//界面初始化
	$scope.clearinformation = function() {

	}

	//新闻公告
	BasemanService.RequestPost("oa_home_info", "gethomedata", {})
		.then(function(data) {
			$scope.homeinfo = data.oa_home_infos;

			$.base64.utf8encode = true;
			$scope.homeinfo.map(function(item) {
				var param = {
					id: item.info_id
				}
				item.url_param = $.base64.btoa(JSON.stringify(param), true);
			})

			$scope.oa_home_newemp_infos = data.oa_home_newemp_infos;
			$scope.birthdays = data.birthdays;

			$scope.data.arr_show = $scope.oa_home_newemp_infos.slice(0, employee_linage);
			$scope.data.arr_birthday = $scope.birthdays.slice(0, birthday_linage);

			//该定时器是用于循环滚动新员工信息
			if($scope.oa_home_newemp_infos.length > employee_linage) {
				setInterval(function() {
					$scope.data.arr_show = [];
					if($scope.count + employee_linage <= $scope.oa_home_newemp_infos.length) {
						//如果当前取出的数据小于数组的长度,直接取
						$scope.data.arr_show = $scope.oa_home_newemp_infos.slice($scope.count, $scope.count + employee_linage)

					} else {
						//最后数组中还有的条数
						var n = $scope.oa_home_newemp_infos.length - $scope.count;
						//还要取的条数
						var m = employee_linage - n;

						var a1 = $scope.oa_home_newemp_infos.slice($scope.count, $scope.count + n);
						var a2 = $scope.oa_home_newemp_infos.slice(0, m);

						$scope.data.arr_show = a1.concat(a2);
					}

					$scope.count += 1;
					if($scope.count == $scope.oa_home_newemp_infos.length) {
						$scope.count = 0;
					}

					$scope.$apply();
				}, 5000);
			}

			//该定时器是用于滚动员工生日信息
			if($scope.birthdays.length > birthday_linage) {
				setInterval(function() {
					$scope.data.arr_birthday = [];
					if($scope.countBirthday + birthday_linage <= $scope.birthdays.length) {
						$scope.data.arr_birthday = $scope.birthdays.slice($scope.countBirthday, $scope.countBirthday + birthday_linage)

					} else {
						//最后数组中还有的条数
						var n = $scope.birthdays.length - $scope.countBirthday;
						//还要取的条数
						var m = employee_linage - n;

						var a1 = $scope.birthdays.slice($scope.countBirthday, $scope.countBirthday + n);
						var a2 = $scope.birthdays.slice(0, m);

						$scope.data.arr_birthday = a1.concat(a2);
					}

					$scope.countBirthday += 1;
					if($scope.countBirthday == $scope.birthdays.length) {
						$scope.countBirthday = 0;
					}

					$scope.$apply();
				}, 5000);
			}
		}, function(error) {

		});

	$scope.newstypeidx = 1;
	$scope.newstypeclick = function(idx) {
		$scope.newstypeidx = idx;
	}

	$scope.filterNews = function(idx) {
		return $scope.homeinfo.filter(function(currentValue, index, arr) {
			return idx == 1 ? currentValue.info_mod == idx && currentValue.info_type == $scope.newstypeidx : currentValue.info_mod == idx
		})
	}
	$scope.more_news = function(idx) {
		window.location.href = "#/crmman/" + $scope.objconf.nextStat + "?flag=" + idx;
	}

	$scope.on_statistics = function(info_id) {
		BasemanService.RequestPost("oa_home_info", "update_read_sum", {
			info_id: info_id
		}).then(function(data) {

		});
	}
	
	setTimeout(function() {
		$scope.height1 = ($("#myhome-left").height() - $("#banner").height()) / 2 - 100;
		$scope.height2 = ($("#myhome-left").height() - $("#banner").height()) / 2 - 100;
		$scope.height3 = ($("#myhome-left").height() - $("#banner").height()) / 2 - 100;
	}, 500);

	window.onresize = function() {
		setTimeout(function() {
			$scope.height1 = ($("#myhome-left").height() - $("#banner").height()) / 2 - 100;
			$scope.height2 = ($("#myhome-left").height() - $("#banner").height()) / 2 - 100;
			$scope.height3 = ($("#myhome-left").height() - $("#banner").height()) / 2 - 100;
		}, 100);
	}

	$scope.initdata();
}

//加载控制器
basemanControllers.controller('oa_home', oa_home);