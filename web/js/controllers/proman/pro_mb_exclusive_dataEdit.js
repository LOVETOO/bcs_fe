var basemanControllers = angular.module('inspinia');
function pro_mb_exclusive_dataEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    pro_mb_exclusive_dataEdit = HczyCommon.extend(pro_mb_exclusive_dataEdit, ctrl_bill_public);
    pro_mb_exclusive_dataEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "pro_mb_exclusive_data",
        key: "pro_id",
        FrmInfo: {},
        grids:[],
    };

    /***************************弹出框***********************/
    $scope.selectmb_style = function () {
        $scope.FrmInfo = {
            title: "面板款式",
            thead: [{
                name: "面板款式",
                code: "mb_style",
                show: true,
                iscond: true,
                type: 'string'

            }],
            is_custom_search:true,
            classid: "pro_mb_general_data",
            postdata: {flag: 2}

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.mb_style = result.mb_style;
        });
    }

    $scope.selectcust = function () {
        $scope.FrmInfo = {
            title: "客户",
            thead: [{
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
            }],
            is_custom_search:true,
            is_high:true,
            classid: "customer",
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_name = result.cust_name;
        });
    }
    /****************************初始化**********************/
    var myDate = new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: myDate.toLocaleDateString(),
        };
    };
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('pro_mb_exclusive_dataEdit', pro_mb_exclusive_dataEdit);
