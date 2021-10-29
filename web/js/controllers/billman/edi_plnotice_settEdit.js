var billmanControllers = angular.module('inspinia');
function edi_plnotice_settEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    edi_plnotice_settEdit = HczyCommon.extend(edi_plnotice_settEdit, ctrl_bill_public);
    edi_plnotice_settEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "edi_plnotice_sett",
        key:"corpserialid",
        wftempid:10149,
        FrmInfo: {},
		grids: []
    };

    /************************初始化页面***********************/
	var myDate= new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,			
            create_time:myDate.toLocaleDateString(),
            // objattachs:[]
        };
    };
    /**---------------------初始化页面----------------------*/
    /***********************保存校验区域*********************/
    $scope.validate = function () {
		
        var errorlist = [];
		$scope.data.currItem.plreasoncode == undefined ? errorlist.push("可损原因") : 0;
        $scope.data.currItem.troverflag == undefined ? errorlist.push("是否委托我司追讨") : 0;
        $scope.data.currItem.financeflag == undefined ? errorlist.push("是否已办理贸易融资") : 0;
        $scope.data.currItem.ifinsuranturge == undefined ? errorlist.push("是否已签署《索赔权转让协议》") : 0;
        $scope.data.currItem.detainflag == undefined ? errorlist.push("是否已签署《赔款转让协议》") : 0;
        $scope.data.currItem.ifbankurge == undefined ? errorlist.push("是否已向保兑银行催款") : 0;
        $scope.data.currItem.ifarf == undefined ? errorlist.push("是否签署《应收账款转让协议》") : 0;
        $scope.data.currItem.sett_type == undefined ? errorlist.push("撤销处理类型") : 0;
		
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
        $scope.data.currItem.plreasoncode=Number($scope.data.currItem.plreasoncode);
        $scope.data.currItem.troverflag=Number($scope.data.currItem.troverflag);
        $scope.data.currItem.financeflag=Number($scope.data.currItem.financeflag);
        $scope.data.currItem.ifinsuranturge=Number($scope.data.currItem.ifinsuranturge);
        $scope.data.currItem.detainflag=Number($scope.data.currItem.detainflag);
        $scope.data.currItem.ifbankurge=Number($scope.data.currItem.ifbankurge);
        $scope.data.currItem.ifarf=Number($scope.data.currItem.ifarf);
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
    $scope.trueorfalses=[{id:0,name:"否"},{id:1,name:"是"}]
	$scope.plreasoncodes =[{id:0,name:"拖欠"},{id:1,name:"拒收"},{id:2,name:"破产"},{id:3,name:"其他"}];
	$scope.sett_types=[{id:1,name:"撤案"},{id:2,name:"结案"}]
 /**********************弹出框值查询**************************/
 
 $scope.selectorg = function () {
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
    
 $scope.selectbuyerno = function () {
        $scope.FrmInfo = {
        title: "买方代码查询",
		is_high: true,
            thead: [{
                    name: "中信保买方代码",
                    code: "buyerno",
					show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户编码",
                    code: "cust_code",
					show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户名称",
                    code: "cust_name",
					show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "买方英文名称",
                    code: "engname",
					show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "买方英文地址",
                    code: "engaddress",
					show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "买方中文地址",
                    code: "chnaddress",
					show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "买方中文名称",
                    code: "chnname",
					show: true,
                    iscond: true,
                    type: 'string'
                }],			
			is_custom_search: true,
            backdatas: "",
            sqlBlock: "",
            classid: "edi_buyerinfo",
			postdata:{}
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			$scope.data.currItem.sinosurebuyerno = result.buyerno;
			$scope.data.currItem.shtname = result.shtname;
            $scope.data.currItem.cust_code = result.cust_code;
			$scope.data.currItem.cust_name = result.cust_name;
			$scope.data.currItem.buyerengaddress = result.engaddress;
            $scope.data.currItem.buyerengname = result.engname;
            $scope.data.currItem.plreasoncode = result.plreasoncode;
        });
    }
	$scope.selectbankno = function () {
        $scope.FrmInfo = {
        title: "买方国家查询",
            thead: [{
                    name: "企业内部编码",
                    code: "corpserialno"
                }, {
                    name: "swift",
                    code: "bankswift"
                }, {
                    name: "中文名称",
                    code: "chnname"
                }, {
                    name: "英文名称",
                    code: "engname"
                }, {
                    name: "国家代码",
                    code: "countrycode"
                }, {
                    name: "英文地址",
                    code: "address"
                }],			
			is_custom_search: true,
            backdatas: "",
            sqlBlock: "",
            classid: "edi_bankinfo",
			postdata:{}
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			$scope.data.currItem.bizopenbankno = result.bankswift;
			$scope.data.currItem.openbankengname = result.engname;
            $scope.data.currItem.openbankaddress = result.address;
        });
    }
	
	$scope.selectbs = function () {
        $scope.FrmInfo = {
        title: "买方国家查询",
            thead: [{
                    name: "企业内部编码",
                    code: "corpserialno"
                }, {
                    name: "swift",
                    code: "bankswift"
                }, {
                    name: "中文名称",
                    code: "chnname"
                }, {
                    name: "英文名称",
                    code: "engname"
                }, {
                    name: "国家代码",
                    code: "countrycode"
                }, {
                    name: "英文地址",
                    code: "address"
                }],			
			is_custom_search: true,
            backdatas: "",
            sqlBlock: "",
            classid: "edi_bankinfo",
			postdata:{}
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			$scope.data.currItem.bizexbankno = result.bankswift;
			$scope.data.currItem.exbankengname = result.engname;
            $scope.data.currItem.exbankaddress = result.address;
        });
    }
     
	 $scope.source_no = function () {
        $scope.FrmInfo = {
        title: "可损通知查询",
            thead: [{
                    name: "可损单号",
                    code: "corpserialno"
                }, {
                    name: "买方代码",
                    code: "sinosurebuyerno"
                }, {
                    name: "买方名称",
                    code: "buyerengname"
                }, {
                    name: "客户编码",
                    code: "cust_code"
                }, {
                    name: "客户名称",
                    code: "cust_name"
                }],			
			is_custom_search: true,
            backdatas: "",
            sqlBlock: "",
            classid: "edi_plnotice",
			postdata:{flag:1}
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
		 for(name in result){
			 if(name!="corpserialno"&&name!="stat"&&name!="corpserialid"){
				 $scope.data.currItem[name]=result[name];
			 }else{
				 
				 $scope.data.currItem.source_no=result.corpserialno;
			 }
		 }
        });
    }
     
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('edi_plnotice_settEdit', edi_plnotice_settEdit)

