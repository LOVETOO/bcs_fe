var billmanControllers = angular.module('inspinia');
function po_payment_headerEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    po_payment_headerEdit = HczyCommon.extend(po_payment_headerEdit, ctrl_bill_public);
    po_payment_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "po_payment_header",
        key:"pay_id",
        wftempid:10170,
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
            curr_code:"CNY",
            biz_type:"付款-费用发票报销-OA提交",
            create_time:myDate.toLocaleDateString()
        };
    };
    
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
    //付款方式
    $scope.payment_types=[{dictvalue:"A",dictname:"银行汇款"},{dictvalue:"B",dictname:"银行承兑"},
        {dictvalue:"C",dictname:"转货款"},{dictvalue:"D",dictname:"置换支付"},
        {dictvalue:"E",dictname:"转账支票"},{dictvalue:"F",dictname:"现金"}];
    // BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "payment_type"}).then(function (data) {
    //     $scope.payment_types = data.dicts;
    // })
    // BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "payment_content"}).then(function (data) {
    //     $scope.payment_contents = data.dicts;
    // })
    // BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "biz_type"}).then(function (data) {
    //     $scope.biz_types = data.dicts;
    // })
    /**********************弹出框值查询**************************/
    $scope.selectvender = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        $scope.FrmInfo = {
            is_high: true,
            is_custom_search: true,
            title: "供应商",
            thead: [{
                name: "供应商编码",
                code: "vender_code",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "供应商名称",
                code: "vender_name",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "银行名称",
                code: "bank_name",
                show: true,
                iscond: true,
                type: 'string'
            }],

            classid: "sale_vender"
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            for (name in result) {
                $scope.data.currItem[name] = result[name];
            }
        });
    }
    //部门
    $scope.selectorg = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        $scope.FrmInfo = {

            classid: "scporg",
            postdata:{},
            sqlBlock: "stat =2 and OrgType = 5",
            backdatas: "orgs",

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = result.orgid;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_code = result.code;

        });
    }
    $scope.selectqy_user = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        $scope.FrmInfo = {
            is_high:true,
            is_custom_search:true,
            title: "国家经理",
            thead: [{
                name: "用户编码",
                code: "userid",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "用户名称",
                code: "username",
                show: true,
                iscond: true,
                type: 'string'
            },{
                name: "机构路径",
                code: "namepath",
                show: true,
                iscond: true,
                type: 'string'
            }],
            backdatas: "users",
            classid: "scpuser",
            searchlist:["userid","username"],
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
            $scope.data.currItem.po_man = result.username
        });
    }
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('po_payment_headerEdit', po_payment_headerEdit)
