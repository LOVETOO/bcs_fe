function more_news($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, $sce) {
	more_news = HczyCommon.extend(more_news, ctrl_bill_public);
	more_news.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

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

	//定义一个数据组用于存放数据
	var arrays = [];
	//定义一个显示的数组
	$scope.homeinfo = [];
	//每页要显示的行数
	$scope.line = 20;
	//当前页数
	$scope.count = 0;
	//纪录总数
	$scope.sum = 0;
	//总页数
	$scope.totalPageNum = 0;
	//设置样式
	$scope.css_i = 0;

	try {
		//获取当前url
		var str = $location.absUrl();
		//截取url参数
		var idx = parseInt(str.match(/=(\S*)/)[1]);
	} catch(e) {}
	$scope.count = 0;
	arrays = [];
	$scope.homeinfo = [];
	$scope.totalPageNum = 0;
	if(idx) {
		sqlwhere = {
			sqlwhere: "(( 1=1 ) and (1=1 and (info_mod in (" + idx + ") )))"
		};
	} else {
		sqlwhere = '{}';
		idx = 0;
	}
	$scope.css_i = idx;
	//初始化
	BasemanService.RequestPost("oa_home_info", "search", sqlwhere)
		.then(function(data) {
			$scope.totalPageNum = '';
			arrays = data.oa_home_infos;
			//显示总纪录数
			$scope.sum = arrays.length;

			if(arrays.length <= $scope.line) {
				$scope.homeinfo = arrays;
				$scope.totalPageNum = 1;
			} else {
				//初始化时从0开始取值
				for(var i = 0; i < $scope.line; i++) {
					$scope.homeinfo.push(arrays[i]);
				}
				//显示总页数
				$scope.totalPageNum = parseInt(($scope.sum + $scope.line - 1) / $scope.line);
			}

			$.base64.utf8encode = true;
			$scope.homeinfo.map(function(item) {
				var param = {
					id: item.info_id
				}
				item.url_param = $.base64.btoa(JSON.stringify(param), true);
			})
		});

	$scope.newstypeclick = function(idx) {
		$scope.css_i = idx;
		$scope.count = 0;
		arrays = [];
		$scope.homeinfo = [];
		$scope.totalPageNum = 0;
		if(idx != 0) {
			sqlwhere = {
				sqlwhere: "(( 1=1 ) and (1=1 and (info_mod in (" + idx + ") )))"
			};
		} else {
			sqlwhere = '';
		}
		BasemanService.RequestPost("oa_home_info", "search", sqlwhere)
			.then(function(data) {
				arrays = data.oa_home_infos;
				//显示总纪录数
				$scope.sum = arrays.length;

				if(arrays.length <= $scope.line) {
					$scope.homeinfo = arrays;
					$scope.totalPageNum = 1;
				} else {
					//显示总页数
					$scope.totalPageNum = parseInt(($scope.sum + $scope.line - 1) / $scope.line);
					//初始化时从0开始取值
					for(var i = 0; i < $scope.line; i++) {
						$scope.homeinfo.push(arrays[i]);
					}
				}

				$.base64.utf8encode = true;
				$scope.homeinfo.map(function(item) {
					var param = {
						id: item.info_id
					}
					item.url_param = $.base64.btoa(JSON.stringify(param), true);
				})
			});
	}
	//首页
	$scope.firstpage = function() {
		$scope.count = 0;
		$scope.homeinfo = [];
		if(arrays.length <= $scope.line) {
			$scope.homeinfo = arrays;
		} else {
			//初始化时从0开始取值
			for(var i = 0; i < $scope.line; i++) {
				$scope.homeinfo.push(arrays[i]);
			}
		}
	}
	//上一页
	$scope.prevpage = function() {
		$scope.count--;
		if($scope.count < 0) {
			$scope.count = 0;
			return;
		}
		var a = 0;
		$scope.homeinfo = [];
		for(var i = $scope.count * $scope.line; i < arrays.length && a < $scope.line; i++) {
			a++;
			$scope.homeinfo.push(arrays[i]);
		}
	}
	//下一页
	$scope.nextpage = function() {
		//判断是否是最后一面
		$scope.count++;
		if($scope.count == $scope.totalPageNum) {
			$scope.count--;
			return;
		}

		if(arrays.length > $scope.line) {
			//将原数组清空
			$scope.homeinfo = [];
			var a = 0;
			for(var i = $scope.count * $scope.line; i < arrays.length && a < $scope.line; i++) {
				a++;
				$scope.homeinfo.push(arrays[i]);
			}
		} else {
			$scope.homeinfo = arrays;
		}
	}

	//尾页
	$scope.lastpage = function() {
		//判断是否当前是最后一页
		if($scope.count == $scope.totalPageNum) {
			return;
		}
		$scope.count = $scope.totalPageNum - 1;
		$scope.homeinfo = [];
		for(var i = $scope.count * $scope.line; i < arrays.length; i++) {
			$scope.homeinfo.push(arrays[i]);
		}

	}
	$scope.on_statistics = function(info_id) {
		BasemanService.RequestPost("oa_home_info", "update_read_sum", {
			info_id: info_id
		}).then(function(data) {

		});
	}
	$scope.initdata();
}
//注册控制器
angular.module('inspinia')
	.controller('more_news', more_news)