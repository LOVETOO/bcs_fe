var basemanControllers = angular.module('inspinia');
function pro_mb_general_dataEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    pro_mb_general_dataEdit = HczyCommon.extend(pro_mb_general_dataEdit, ctrl_bill_public);
    pro_mb_general_dataEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "pro_mb_general_data",
        key: "pro_id",
        // wftempid: 10137,
        FrmInfo: {},
        grids:[],
        // grids: [{optionname: 'options_13', idname: 'pro_item_ysamts'}]
    };
    // BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "type"}).then(function (data) {
    //     $scope.item_types = data.dicts;
    // })
    $scope.item_types=[{dictname:"挂机",dictname:"挂机"},{dictname:"柜机",dictname:"柜机"},{dictname:"移动空调",dictname:"移动空调"}];
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
    $scope.selectmb_color = function () {
        $scope.FrmInfo = {
            title: "面板颜色",
            thead: [{
                name: "面板颜色",
                code: "mb_color",
                show: true,
                iscond: true,
                type: 'string'

            }],
            is_custom_search:true,
            classid: "pro_mb_general_data",
            postdata: {flag: 3}

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.mb_color = result.mb_color;
        });
    }
    $scope.selectmb_article = function () {
        $scope.FrmInfo = {
            title: "装饰条颜色",
            thead: [{
                name: "装饰条颜色",
                code: "mb_article",
                show: true,
                iscond: true,
                type: 'string'
            }],
            is_custom_search:true,
            classid: "pro_mb_general_data",
            postdata: {flag: 4}

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.mb_article  = result.mb_article ;
        });
    }
    $scope.selectarea_name = function () {
        $scope.FrmInfo = {
            title: "国家",
            thead: [{
                name: "地区编码",
                code: "areacode ",
                show: true,
                iscond: true,
                type: 'string'

            },{
                name: "地区名称",
                code: "areaname ",
                show: true,
                iscond: true,
                type: 'string'

            },{
                name: "助记码",
                code: "assistcode ",
                show: true,
                iscond: true,
                type: 'string'

            },{
                name: "电话区号",
                code: "telzone ",
                show: true,
                iscond: true,
                type: 'string'

            },{
                name: "邮政编码",
                code: "postcode ",
                show: true,
                iscond: true,
                type: 'string'

            },{
                name: "备注",
                code: "note ",
                show: true,
                iscond: true,
                type: 'string'

            }],
            classid: "scparea",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.area_id  = result.areaid ;
            $scope.data.currItem.area_code  = result.areacode ;
            $scope.data.currItem.area_name  = result.telzone ;
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
    .controller('pro_mb_general_dataEdit', pro_mb_general_dataEdit);
