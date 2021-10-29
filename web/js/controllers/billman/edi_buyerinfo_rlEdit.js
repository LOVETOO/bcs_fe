var billmanControllers = angular.module('inspinia');
function edi_buyerinfo_rlEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    edi_buyerinfo_rlEdit = HczyCommon.extend(edi_buyerinfo_rlEdit, ctrl_bill_public);
    edi_buyerinfo_rlEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "edi_buyerinfo",
        key:"corpserialno2",
        FrmInfo: { },
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
        $scope.data.currItem.cust_code == undefined ? errorlist.push("客户编码为空") : 0;
		
        if (errorlist.length) {
            BasemanService.notify(notify,errorlist, "alert-danger");
            return false;
        }
        return true;
    }
    $scope.save_before = function () {
        var postdata = $scope.data.currItem;
        postdata.flag = 2;
    }


    /**----------------------保存校验区域-------------------*/
	/**********************刷新******************************/
	$scope.refresh_after= function(){

	}
	/*---------------------刷新------------------------------*/
	$scope.refresh_after= function(){

	}

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

    }
    $scope.search = function () {
        $scope.FrmInfo = {
            title: "买方档案查询",
            is_high: true,
            is_custom_search: true,
            thead: [
                {
                    name: "单号",
                    code: "corpserialno",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "销售区域",
                    code: "areano",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户编码",
                    code: "cust_code",
                    show: true,
                    iscond: true,
                    type: 'string'
                },
                {
                    name: "银行国家代码",
                    code: "countrycode",
                    show: true,
                    iscond: true,
                    type: 'string'
                },
                {
                    name: "状态",
                    code: "stat",
                    show: true,
                    iscond: true,
                    type: 'list',
                    dicts: [{id: 1, name: "制单"}, {id: 3, name: "启动"}, {id: 5, name: "审核"}]
                }],
            sqlBlock:"cust_code='600000'",
            classid:"edi_buyerinfo"
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
            $scope.data.currItem.org_id = result.org_id;
            for (name in result) {
                $scope.data.currItem[name] = result[name];
            }
        });
    }
	 $scope.selectcust = function () {
         if($scope.data.currItem.stat!=1){
             return
         }
        $scope.FrmInfo = {
			is_custom_search:true,
            title: "客户查询",
            thead: [{
                name: "客户编码",
                code: "cust_code",
				  show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "SAP编码",
                code: "sap_code",
				  show: true,
                iscond: true,
                type: 'string'

            },{
				name:"客户名称",
				code:"cust_name",
				  show: true,
                iscond: true,
                type: 'string'
			
			}],
			is_custom_search: true,
            sqlBlock:"(org_id=" + $scope.data.currItem.org_id
            + " or other_org_ids like '%," + $scope.data.currItem.org_id + ",%')",
            classid: "customer",
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;
			$scope.data.currItem.engaddress = result.invoice_address;
			$scope.data.currItem.engname = result.cust_name;
        });
    }
    
 $scope.selectaddress = function () {

    }

 $scope.selectarea = function () {

    }
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('edi_buyerinfo_rlEdit', edi_buyerinfo_rlEdit)
