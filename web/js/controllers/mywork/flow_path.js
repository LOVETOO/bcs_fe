function flow_path($scope, $location, $state, $http, $rootScope, $modal, BasemanService, localeStorageService) {
	// flag=1 待审批
	// flag=2 我启动 （流程未结束）
	// flag=3 未达到（流程未结束）
	// flag=4 我已完成
	$scope.data = {};
	var wf;
	try {
		//获取当前url
		var str = $location.absUrl();
		//截取url参数
		var flag = parseInt(str.match(/=(\S*)/)[1]);
	} catch(e) {}
	console.log(flag);
	if(!flag) {
		//flag = $scope.data.flag;
		flag = 1;
	}
	$scope.getwflist = function(flag) {
		var delayed;
		$scope.data.wfcurrents = []; //所有循环的数据都放置在这里
		$scope.data.wftype = flag;
		if(flag == 5) {
			flag = 1;
			delayed = 1;
		}
		BasemanService.RequestPost("omsworkhint", "search", {
			flag: flag
		}).then(function(data) {
			$scope.delay_stat = 1;
			for(var i = 0; i < data.workhits.length; i++) {

				//只有是点击查询超时才执行下面判断
				if(flag == 1 && delayed == 1) {
					//将后台返回的到达时间字符串日期格式化
					end_str = (data.workhits[i].lasttime).replace(/-/g, "/");
					var end_date = new Date(end_str);
					//计算到达的小时数
					var arrive = parseInt(end_date.getTime() / (1000 * 60 * 60));

					var myDate = new Date();
					//计算现在的小时数
					var present = parseInt(myDate.getTime() / (1000 * 60 * 60));
					//到达时间超过当前时间8小时则为延迟
					if(present - arrive > 8) {
						$scope.delay_stat = 2;
						wf = data.workhits[i];
					} else {
						//如果不是超时的不添加到数组中...跳过本次循环
						continue;
					}
				} else {
					wf = data.workhits[i];
				}

				if(wf.subject == "") {
					wf.subject = "无主题";
				}
				//url param
				$.base64.utf8encode = true;
				var param = {
					id: wf.objid,
					initsql: '',
					userid: window.strUserId
				}
				wf.url_param = $.base64.btoa(JSON.stringify(param), true);

				var handed = false;
				for(var j = 0; j < $scope.data.wfcurrents.length; j++) {

					var wftmp = $scope.data.wfcurrents[j];

					if(wftmp.wftempid == wf.wftempid) {
						handed = true;
						wftmp.wf.push(wf);
						switch(wf.delay_stat) {
							case "3":
								wftmp.overqty = wftmp.overqty + 1;
								break;
							case "2":
								wftmp.delayqty = wftmp.delayqty + 1;
								break;
							default:
								wftmp.normalqty = wftmp.normalqty + 1;
								break;
						}
						break;
					}
				};
				if(!handed) {
					//wf.delay_stat=3;
					wftmp = {
						wftempid: wf.wftempid,
						wfname: wf.wfname,
						normalqty: 0,
						delayqty: 0,
						overqty: 0,
						wf: [],
						hide: true,
						normalqty: 0,
						delayqty: 0,
						overqty: 0
					};

					wftmp.wf.push(wf);

					if($scope.data.wfcurrents.length == 0) {
						wftmp.hide = false;
					}
					switch(wf.delay_stat) {
						case "3":
							wftmp.overqty = 1;
							break;
						case "2":
							wftmp.delayqty = 1;
							break;
						default:
							wftmp.normalqty = 1;
							break;
					}
					$scope.data.wfcurrents.push(wftmp);
				};
			};

		});
	}
	$scope.getwflist(flag);

	$scope.wftempcheck = function(index) {

		$scope.data.wfcurrents[index].hide = !$scope.data.wfcurrents[index].hide;
	}

}
//注册控制器
angular.module('inspinia')
	.controller('flow_path', flow_path)