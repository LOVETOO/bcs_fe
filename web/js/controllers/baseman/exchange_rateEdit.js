var basemanControllers = angular.module('inspinia');
function exchange_rateEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    exchange_rateEdit = HczyCommon.extend(exchange_rateEdit, ctrl_bill_public);
    exchange_rateEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"exchange_rate",
        key:"rate_id",
        FrmInfo: {},
        grids:[]
    };
    /**----弹出框区域*---------------*/
       //查询
    $scope.search = function () {
         $scope.FrmInfo = {
             classid: "exchange_rate",
             postdata: {},
             backdatas: "exchange_rates"
         };
         BasemanService.open(CommonPopController, $scope)
             .result.then(function (result) {
              HczyCommon.stringPropToNum(result);
              for (var name in result) {
                   $scope.data.currItem[name] = result[name];
              }
         });
     };
     //查询货币
    $scope.selectCurrency = function () {
            $scope.FrmInfo = {
                classid: "base_currency",
                sqlBlock: "1=1",
            };
            BasemanService.open(CommonPopController, $scope, "", "lg")
                .result.then(function (result) {
                 $scope.data.currItem.currency_id = result.currency_id;
                 $scope.data.currItem.currency_code = result.currency_code;
                 $scope.data.currItem.currency_name = result.currency_name;
            });
        };
    /*词汇值*/
    $scope.months=[
    {id:1,name:"1月"}, {id:2,name:"2月"}, {id:3,name:"3月"}, {id:4,name:"4月"}, {id:5,name:"5月"}, {id:6,name:"6月"},
     {id:7,name:"7月"}, {id:8,name:"8月"}, {id:9,name:"9月"}, {id:10,name:"10月"}, {id:11,name:"11月"}, {id:12,name:"12月"},
    ]
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
         //获取完整的日期
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
    .controller('exchange_rateEdit', exchange_rateEdit);
