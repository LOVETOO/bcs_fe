var billmanControllers = angular.module('inspinia');
function edi_buyercodeapplyinfoEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    edi_buyercodeapplyinfoEdit = HczyCommon.extend(edi_buyercodeapplyinfoEdit, ctrl_bill_public);
    edi_buyercodeapplyinfoEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "edi_buyercodeapplyinfo",
        key:"corpserialid",
        wftempid:10141,
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
        $scope.data.currItem.areano == undefined ? errorlist.push("销售区域为空") : 0;
        $scope.data.currItem.areaname == undefined ? errorlist.push("客户为空") : 0;
        $scope.data.currItem.engname == undefined ? errorlist.push("英文名称为空") : 0;
        $scope.data.currItem.shtname == undefined ? errorlist.push("买方简称为空") : 0;
        $scope.data.currItem.engaddress == undefined ? errorlist.push("英文地址为空") : 0;
        $scope.data.currItem.countrycode == undefined ? errorlist.push("所属国家地区为空") : 0;

		
        if (errorlist.length) {
            BasemanService.notify(notify,errorlist, "alert-danger");
            return false;
        }
        return true;
    }
	
	
	
    /**----------------------保存校验区域-------------------*/
	
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
   

 $scope.selectorg = function () {
     if($scope.data.currItem.stat!=1){
         return
     }
        $scope.FrmInfo = {

            postdata: {},
            classid: "scporg",
            backdatas: "orgs",
            sqlBlock: "stat =2 and orgtype = 5",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = parseInt(result.orgid);
            $scope.data.currItem.areano = result.code;
            $scope.data.currItem.areaname = result.orgname;
        });
    }
    
	 $scope.selectcust = function () {
         if($scope.data.currItem.stat!=1){
             return
         }
		 if ($scope.data.currItem.areano == undefined || $scope.data.currItem.areano == "") {
            BasemanService.notice("请先选销售区域", "alert-warning");
            return;
			}
        $scope.FrmInfo = {

            postdata: {},
            backdatas: "",
             sqlBlock: "(org_id=" + $scope.data.currItem.org_id
            + " or other_org_ids like '%," + $scope.data.currItem.org_id + ",%')",
            classid: "customer",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;
			$scope.data.currItem.engaddress = result.invoice_address;
			$scope.data.currItem.engname = result.cust_name;
        });
    }
    
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

 $scope.selectarea = function () {
     if($scope.data.currItem.stat!=1){
         return
     }
        $scope.FrmInfo = {
            title: "省城查询",
            thead: [{
                name: "省城",
                code: "code",
				  show: true,
                iscond: true,
                type: 'string'

            }],
			
			is_custom_search: true,
			is_high:true,
            backdatas: "",
            sqlBlock: "",
            classid: "edi_countrycode",
			postdata:{flag:10}
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.regareanocity =result.code;

        });
    }
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('edi_buyercodeapplyinfoEdit', edi_buyercodeapplyinfoEdit)
