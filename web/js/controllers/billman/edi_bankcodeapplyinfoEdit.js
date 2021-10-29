var billmanControllers = angular.module('inspinia');
function edi_bankcodeapplyinfoEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    edi_bankcodeapplyinfoEdit = HczyCommon.extend(edi_bankcodeapplyinfoEdit, ctrl_bill_public);
    edi_bankcodeapplyinfoEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "edi_bankcodeapplyinfo",
        key:"corpserialid",
        wftempid:10140,
        FrmInfo: {},
		grids:[]
    };

    /************************初始化页面***********************/
	var myDate= new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,			
            create_time:myDate.toLocaleDateString()
        };
    };
    /**---------------------初始化页面----------------------*/
    /***********************保存校验区域*********************/
    $scope.validate = function () {
        var errorlist = [];
        $scope.data.currItem.engname == undefined ? errorlist.push("银行英文名称为空") : 0;
        $scope.data.currItem.address == undefined ? errorlist.push("银行地址为空") : 0;
        $scope.data.currItem.countrycode == undefined ? errorlist.push("银行国家代码为空") : 0;


		
        if (errorlist.length) {
            BasemanService.notify(notify,errorlist, "alert-danger");
            return false;
        }
        return true;
    }
	
	
	
    /**----------------------保存校验区域-------------------*/

	/**********************刷新******************************/
	$scope.refresh_after= function(){

	}
	/*---------------------刷新------------------------------*/
	
	$scope.refresh_after= function(){
		
		//复制历史
		if($scope.data.currItem.copy==1){
			$scope.data.currItem.corpserialid="";
		}
		
	}
	/***********************权限控制*********************/

	if (window.userbean) {
        $scope.userbean = window.userbean;
    }
    //用户权限
    $scope.user_auth = {
        //知否有区域总监权限
        area_auth: false
    };
    //业务员,区总,系总,财务,事总权限
	var mystring = $scope.userbean.stringofrole;
    $scope.user_auth.saleman_auth = mystring.indexOf("销售人员") > -1 ? true : false;
    $scope.user_auth.areamanager_auth = mystring.indexOf("大区总监") > -1 ? true : false;
    $scope.user_auth.system_auth = mystring.indexOf("外总") > -1 ? true : false;
    $scope.user_auth.departmen_auth = mystring.indexOf("事总") > -1 ? true : false;
    $scope.user_auth.infance_auth = mystring.indexOf("财务部") > -1 ? true : false;
    $scope.user_auth.admin_auth = mystring.indexOf("admin") > -1 ? true : false;

    /**---------------------权限控制-------------------*/
	

   


    /**********************下拉框值查询（系统词汇）***************/

    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        var stats = [];
        for (var i = 0; i < data.dicts.length; i++) {
            object = {};
            object.id = data.dicts[i].dictvalue;
            object.name = data.dicts[i].dictname;
            stats.push(object);
        }
        $scope.stats = stats;
    })
    /**********************弹出框值查询**************************/
   

 
 $scope.selectaddress = function () {
     if($scope.data.currItem.stat!=1){
         return
     }
        $scope.FrmInfo = {
            classid: "edi_countrycode",
	        postdata:{flag:11},
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			 $scope.data.currItem.countrycode = result.country_name;
			 
           
        });
    }

    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('edi_bankcodeapplyinfoEdit', edi_bankcodeapplyinfoEdit)
