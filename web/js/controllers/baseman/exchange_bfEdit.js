var basemanControllers = angular.module('inspinia');
function exchange_bfEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    exchange_bfEdit = HczyCommon.extend(exchange_bfEdit, ctrl_bill_public);
    exchange_bfEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"exchange_bf",
        key:"rate_id",
		
        //wftempid:
        FrmInfo: {},
        grids:[],
		postdata:{}
    };
     //查询货币
	$scope.selectCurrency = function () {
        $scope.FrmInfo = {
            title: "货币查询",
            thead: [{
            name: "货币名称",
            code: "currency_name"
        },{
            name:"货币编码",
            code:"currency_code"
        },{
            name:"备注",
            code:"note"
        }],
            classid: "base_currency",
            backdatas: "base_currencys",
            sqlBlock: "1=1",
            searchlist: ["currency_name", "currency_code", "note"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.currency_id = result.currency_id;
            $scope.data.currItem.currency_code = result.currency_code;
            $scope.data.currItem.currency_name = result.currency_name;
        });
    };
    /*词汇值*/
	//月份
	$scope.months = [{id:1,name:1},{id:2,name:2},{id:3,name:3},{id:4,name:4},{id:5,name:5},{id:6,name:6},{id:7,name:7},{id:8,name:8}
	,{id:9,name:9},{id:10,name:10},{id:11,name:11},{id:12,name:12}];
    //是否远期汇率
    $scope.sub1 = function () {
        $scope.showType = !$scope.showType;
    };
    //会计期间是否可用
    $scope.sub2 = function () {
        $scope.showType = !$scope.showType;
    };
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        //当前年
        var date=new Date;
        $scope.data.currItem.rate_year=date.getFullYear();
        var month=date.getMonth()+1;
        $scope.data.currItem.rate_month =(month<10 ? "0"+month:month);
    };
    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('exchange_bfEdit', exchange_bfEdit);
