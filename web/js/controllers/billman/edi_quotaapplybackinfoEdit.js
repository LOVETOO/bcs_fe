var billmanControllers = angular.module('inspinia');
function edi_quotaapplybackinfoEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    edi_quotaapplybackinfoEdit = HczyCommon.extend(edi_quotaapplybackinfoEdit, ctrl_bill_public);
    edi_quotaapplybackinfoEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "edi_quotaapplybackinfo",
        key:"corpserialid",
        wftempid:10150,
        FrmInfo: {sqlBlock: "stat=1"},
		grids:[]
    };

    /************************初始化页面***********************/
	var myDate= new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,
			goodscode:0,
			elsegoodsname:"空调器",
            create_time:myDate.toLocaleDateString()
        };
    };
    /**---------------------初始化页面----------------------*/
    /***********************保存校验区域*********************/
    $scope.validate = function () {
        var errorlist = [];
        $scope.data.currItem.applybackdate == undefined ? errorlist.push("倒签生效日期为空") : 0;
		$scope.data.currItem.applybackdate >$scope.data.currItem.effectdate  ? errorlist.push("倒签生效日期要在生效日期前") : 0;
        $scope.data.currItem.bebackreason == undefined ? errorlist.push("申请倒签原因为空") : 0;

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
 $scope.seletsource_code = function () {
     if($scope.data.currItem.stat!=1){
         return
     }
        $scope.FrmInfo = {
		title: "限额申请单查询",
		thead: [
        {
            name: "开证行swift",
            code: "openbankswift",
            show: true,
            iscond: true,
            type: 'string'
        }, {
            name: "限额申请单号",
            code: "source_code",
            show: true,
            iscond: true,
            type: 'string'
        }, {
            name: "买方代码",
            code: "sinosurebuyerno",
            show: true,
            iscond: true,
            type: 'string'
        },
		{
            name: "客户编码",
            code: "cust_code",
            show: true,
            iscond: true,
            type: 'string'
        },
        {
            name: "客户名称",
            code: "cust_name",
            show: true,
            iscond: true,
            type: 'string'
		},
        {
            name: "买方名称",
            code: "buyerengname",
            show: true,
            iscond: true,
            type: 'string'
		}],
			is_high:true,
			is_custom_search: true,
            postdata: {flag:2},
            classid: "edi_lcquotaapplyinfo",
            sqlBlock: "",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            for (name in result) {
                $scope.data.currItem[name] = result[name];
            }
            $scope.data.currItem.stat =1;
            $scope.data.currItem.wfid =0;
            $scope.data.currItem.wfflag =0;
            $scope.data.currItem.source_code =result.corpserialno;
            $scope.data.currItem.source_id =result.corpserialid;
            $scope.data.currItem.corpserialno ="";
            $scope.data.currItem.corpserialid ="0";
        });
    }
    
	 $scope.selectopenswift = function () {
       
    }
    
	$scope.selectexbankswift = function () {
      
    }

	$scope.selectorg = function () {
       
    }
	
	$scope.selectbuyer = function () {
       
    }
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('edi_quotaapplybackinfoEdit', edi_quotaapplybackinfoEdit)
