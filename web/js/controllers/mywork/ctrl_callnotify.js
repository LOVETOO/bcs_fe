function ctrl_callnotify($scope, $state, $rootScope, $modal, BasemanService, localeStorageService) {
	$scope.data = {};
	
	$scope.choseone = function(index,e){
		$scope.index = index;
		$(e.currentTarget).siblings("tr").removeClass("info").end().addClass("info");
	}
	
	//跟进状态
	$scope.manual_stats = [];
	BasemanService.getParameters($scope,"manual_stat");
	
	$scope.data.notifies = [{
		types:"维修/已派工/未延期",
		cust_name:"张三",
		mobile:"13409877890",
		type:1,
		address:"广东/佛山/顺德/人民南路25号",
		note:"超滤净水器/不出水"
	},{
		types:"维修/已派工/延期",
		cust_name:"张三",
		mobile:"13409877890",
		not_null:true,
		type:2,
		address:"广东/佛山/顺德/人民南路25号",
		note:"超滤净水器/不出水"
	},{
		types:"维修/已接单/未延期",
		cust_name:"张三",
		mobile:"13409877890",
		type:3,
		address:"广东/佛山/顺德/人民南路25号",
		note:"超滤净水器/不出水"
	},{
		types:"维修/已派工/未延期",
		cust_name:"张三",
		mobile:"13409877890",
		type:4,
		address:"广东/佛山/顺德/人民南路25号",
		note:"超滤净水器/不出水"
	},{
		types:"维修/已接单/未延期",
		cust_name:"张三",
		mobile:"13409877890",
		type:5,
		address:"广东/佛山/顺德/人民南路25号",
		note:"超滤净水器/不出水"
	},{
		types:"维修/已派工/未延期",
		cust_name:"张三",
		mobile:"13409877890",
		address:"广东/佛山/顺德/人民南路25号",
		note:"超滤净水器/不出水"
	}];
	
}

angular
    .module('inspinia')
    .controller('ctrl_callnotify', ctrl_callnotify)
