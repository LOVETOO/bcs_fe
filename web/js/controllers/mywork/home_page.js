function home_page($rootScope, $scope,$location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
	$scope.data={};
	var parserDate = function (date) {  
		var t = Date.parse(date);  
		if (!isNaN(t)) {  
			return new Date(Date.parse(date.replace(/-/g, "/")));  
		} else {  
			return new Date();  
		}  
	};  
	$scope.minus_second =function(dat){
		var date1=new Date(); //开始时间
		var date2 = parserDate(dat)
		var date3=date2.getTime()-date1.getTime() //时间差的毫秒数
		//计算出相差天数
		var days=Math.floor(date3/(24*3600*1000))
		//计算出小时数
		var leave1=date3%(24*3600*1000) //计算天数后剩余的毫秒数
		var hours=Math.floor(leave1/(3600*1000))
		//计算相差分钟数
		var leave2=leave1%(3600*1000) //计算小时数后剩余的毫秒数
		var minutes=Math.floor(leave2/(60*1000))
		//计算相差秒数
		var leave3=leave2%(60*1000) //计算分钟数后剩余的毫秒数
		var seconds=Math.round(leave3/1000);
		//return days+'天'+hours+'小时'+minutes+'分钟'+seconds+'秒'
		return days
	}
	
	//刷新页面
	function myrefresh(){ 
		$scope.data.left_time = $scope.minus_second('2018-01-01 00:00:00')
		$scope.data.right_time = $scope.minus_second('2017-11-12 00:00:00')
		//
	} 
	myrefresh();
	setInterval(function() {
            myrefresh(); 
            $scope.$apply();			
    }, 1000);
}
angular
    .module('inspinia')
    .controller('home_page', home_page)