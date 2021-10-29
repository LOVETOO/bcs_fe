var basemanControllers = angular.module('inspinia');
function ship_box_feeEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    ship_box_feeEdit = HczyCommon.extend(ship_box_feeEdit, ctrl_bill_public);
    ship_box_feeEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"ship_box_fee",
        key:"ship_fee_id",
        //wftempid:
        FrmInfo: {},
        grids:[]
    };
    /**----弹出框区域*---------------*/
    /**------保存校验区域-----*/
    $scope.validate = function () {
        var errorlist = [];
        if ($scope.data.currItem.fee_amt>0 && $scope.data.currItem.fee_rate>0) {
            errorlist.push("预计费用和费用比例不能同时大于0");
        }
        if (errorlist.length) {
            BasemanService.notice(errorlist, "alert-warning");
            return false;
        }
        return true;
    }
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss')
        };
    };
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
    //货币
    $scope.currencyid = function () {
        $scope.FrmInfo = {
            title: "货币查询",
            thead: [
                {
                    name: "货币代码",
                    code: "currency_code"
                }, {
                    name: "货币名称",
                    code: "currency_name"
                }, {
                    name: "备注",
                    code: "note"
                }],
            classid: "base_currency",
            postdata: {},
            searchlist: ["currency_code", "currency_name"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.currency_id = result.currency_id;
            $scope.data.currItem.currency_code = result.currency_code;
            $scope.data.currItem.currency_name = result.currency_name;
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
    /****系统词汇值***/
    $scope.useable =[{dictvalue:1, dictname:"否"},{dictvalue:1, dictname:"是"}];
        //贸易类型
    //BasemanService.RequestPost("base_search", "searchdict", {dictcode:"trade_type"})
    //    .then(function(data) {
    //        $scope.trade_types = HczyCommon.stringPropToNum(data.dicts);
    //    });
    $scope.trade_types =[{dictvalue:1, dictname:"进出口贸易"}];
    //柜型
    BasemanService.RequestPost("base_search", "searchdict", {dictcode:"box_type"})
        .then(function(data) {
            $scope.box_types = HczyCommon.stringPropToNum(data.dicts);
        });
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            trade_types:1,
            useable:2

        };
    };

    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('ship_box_feeEdit', ship_box_feeEdit);
