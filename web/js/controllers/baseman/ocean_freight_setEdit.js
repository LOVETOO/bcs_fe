var basemanControllers = angular.module('inspinia');
function ocean_freight_setEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    ocean_freight_setEdit = HczyCommon.extend(ocean_freight_setEdit, ctrl_bill_public);
    ocean_freight_setEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"ocean_freight_set",
        key:"set_id",
        //wftempid:
        FrmInfo: {},
        grids:[]
    };
    /**----弹出框区域*---------------*/
        //价格条款查询
    $scope.price_type = function () {
        $scope.FrmInfo = {
            title: "价格条款查询",
            thead: [
                {
                    name: "价格类型代码",
                    code: "price_type_code"
                }, {
                    name: "价格类型名称",
                    code: "price_type_name"
                }],
            classid: "price_type",
            sqlwhere:"1=1",
            postdata: {},
            searchlist: ["price_type_code", "price_type_name"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.price_type_id = result.price_type_id;
            $scope.data.currItem.price_type_code = result.price_type_code;
            $scope.data.currItem.price_type_name = result.price_type_name;
        });
    };
    //订单编码
    $scope.fee_code = function () {
        $scope.FrmInfo = {
            title: "订单费用编码",
            thead: [
                {
                    name: "订单费用编码",
                    code: "order_fee_code"
                }, {
                    name: "订单费用名称",
                    code: "order_fee_name"
                }, {
                    name: "备注",
                    code: "note"
                }],
            classid: "sale_order_fee",
            sqlwhere:"usable =2",
            postdata: {},
            searchlist: ["order_fee_code", "order_fee_name"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.order_fee_id = result.order_fee_id;
            $scope.data.currItem.order_fee_code = result.order_fee_code;
            $scope.data.currItem.order_fee_name = result.order_fee_name;
        });
    };
    //出货港
    $scope.seaport_out = function () {
        $scope.FrmInfo = {
            title: "出货港",
            thead: [
                {
                    name: "港口编码",
                    code: "seaport_code"
                }, {
                    name: "港口名称",
                    code: "seaport_name"
                }, {
                    name: "英文名称",
                    code: "english_name"
                }],
            classid: "seaport",
            sqlwhere:"seaport_type =1",
            postdata: {},
            searchlist: ["seaport_code", "seaport_name","english_name"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.seaport_id = result.seaport_id;
            $scope.data.currItem.seaport_code = result.seaport_code;
            $scope.data.currItem.seaport_out_name = result.seaport_name;
            $scope.data.currItem.english_name = result.english_name;
        });
    };
    //到货港
    $scope.seaport_in = function () {
        $scope.FrmInfo = {
            title: "到货港",
            thead: [
                {
                    name: "港口编码",
                    code: "seaport_code"
                }, {
                    name: "港口名称",
                    code: "seaport_name"
                }, {
                    name: "英文名称",
                    code: "english_name"
                }],
            classid: "seaport",
            sqlwhere:"seaport_type =2",
            postdata: {},
            searchlist: ["seaport_code", "seaport_name","english_name"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.seaport_id = result.seaport_id;
            $scope.data.currItem.seaport_code = result.seaport_code;
            $scope.data.currItem.seaport_in_name = result.seaport_name;
            $scope.data.currItem.english_name = result.english_name;
        });
    };
    //柜型
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "box_type"})
        .then(function (data) {
            $scope.box_types = data.dicts;
        });
    //币种
    BasemanService.RequestPostAjax("base_search", "searchcurrency", {}).then(function (data) {
        $scope.data.currItem.currency_name=data.base_currency;
        $scope.base_currencys = data.base_currencys;
    });
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            base_currency:4
        };
    };
    //柜型词汇
    BasemanService.RequestPost("base_search", "searchdict", {dictcode:"box_type"})
    .then(function(data) {
        $scope.boxtypes = HczyCommon.stringPropToNum(data.dicts);
    });
    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('ocean_freight_setEdit', ocean_freight_setEdit);
