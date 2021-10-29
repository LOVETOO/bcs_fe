var billmanControllers = angular.module('inspinia');
function edi_buyerinfoEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    edi_buyerinfoEdit = HczyCommon.extend(edi_buyerinfoEdit, ctrl_bill_public);
    edi_buyerinfoEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "edi_buyerinfo",
        key:"corpserialno2",
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
        $scope.data.currItem.org_name == undefined ? errorlist.push("销售区域为空") : 0;
        $scope.data.currItem.cust_code == undefined ? errorlist.push("客户编码为空") : 0;
		
        if (errorlist.length) {
            BasemanService.notify(notify,errorlist, "alert-danger");
            return false;
        }
        return true;
    }
	$scope.search=function () {
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
            classid: "edi_buyerinfo",
        }
            BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
                for(name in result){
                    $scope.data.currItem[name]=result[name];
                }
        })
    }
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
    
	 $scope.selectcust = function () {

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
    .controller('edi_buyerinfoEdit', edi_buyerinfoEdit)
