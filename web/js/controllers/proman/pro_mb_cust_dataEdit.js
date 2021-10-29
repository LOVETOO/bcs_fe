var basemanControllers = angular.module('inspinia');
function pro_mb_cust_dataEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    pro_mb_cust_dataEdit = HczyCommon.extend(pro_mb_cust_dataEdit, ctrl_bill_public);
    pro_mb_cust_dataEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "pro_mb_cust_data",
        key: "pro_id",
        FrmInfo: {},
        grids:[],
    };
    $scope.item_types=[{dictvalue:"挂机",dictname:"挂机"},{dictvalue:"柜机",dictname:"柜机"},{dictvalue:"移动空调",dictname:"移动空调"}];
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
    $scope.selectarea = function () {
        $scope.FrmInfo = {
            title: "国家",
            is_custom_search:true,
            is_high: true,
            thead: [
                {
                    name: "地区编码",
                    code: "areacode",
                    show: true,
                    iscond: true,
                    type: 'string'

                }, {
                    name: "地区名称",
                    code: "areaname",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "助记码",
                    code: "assistcode",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "电话区号",
                    code: "telzone",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "邮政编码",
                    code: "postcode",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "备注",
                    code: "note",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            classid: "scparea",
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
            $scope.data.currItem.area_id = result.areaid;
            $scope.data.currItem.area_code = result.areacode;
            $scope.data.currItem.area_name = result.telzone;
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
    .controller('pro_mb_cust_dataEdit', pro_mb_cust_dataEdit);
