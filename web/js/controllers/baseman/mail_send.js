var billmanControllers = angular.module('inspinia');
function mail_send($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    mail_send = HczyCommon.extend(mail_send, ctrl_bill_public);
    mail_send.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "seaport",
        key: "seaport_id",
        //wftempid: 10003,
        FrmInfo: {},
        grids: []
    };
    //界面初始化
    $scope.clearinformation = function () {
        if (!$scope.data) $scope.data = {}
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            usable:2,
            seaport_type:1
        };
    };
    /**--------系统词汇词------*/
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "seaport_type"}).then(function (data) {
        $scope.seaport_types = data.dicts;
    });
    /**----弹出框区域*---------------*/
    //国家查询框
    $scope.openAreaNameFrm = function () {
        $scope.FrmInfo = {
            classid: "scparea"
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
            $scope.data.currItem.area_id = result.areaid;
            $scope.data.currItem.area_code = result.areacode;
            $scope.data.currItem.area_name = result.areaname;
        });
    };
	$('.note-editing-area').keydown(function(event){
       event.stopPropagation();
	   console.warn(event);
     })
	$scope.send_email =function(){
		var postdata={
			sysuserid:userbean.sysuserid,
			fromuser:userbean.userid,
		};
		if($scope.data.currItem.snedto){
			postdata.sendto = $scope.data.currItem.snedto
		}
		if($scope.data.currItem.subject){
			postdata.subject = $scope.data.currItem.subject
		}
		if($scope.data.currItem.content){
			postdata.content = $scope.data.currItem.content
		}
		BasemanService.RequestPost("scpemail", "insert", postdata)
	    .then(function(data) {
              console.warn(data);
			  BasemanService.notice("发送成功!", "alert-info");
	    });
		
		
	}
    //数据缓存
    $scope.initdata();

};


angular.module('inspinia')
    .controller('mail_send', mail_send)

