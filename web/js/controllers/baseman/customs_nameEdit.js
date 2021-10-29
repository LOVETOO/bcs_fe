var basemanControllers = angular.module('inspinia');
function customs_nameEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    customs_nameEdit = HczyCommon.extend(customs_nameEdit, ctrl_bill_public);
    customs_nameEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"customs_name",
        key:"name_id",
        FrmInfo: {},
        grids:[]
    };
    //品名要素
    $scope.brand_name = function (item) {
        $scope.FrmInfo = {
            is_high: true,
            is_custom_search: true,
            title: "报关要素查询",
            thead: [
                {
                    name: "报关要素品名",
                    code: "brand_name",
                    show: true,
                    iscond: true,
                    type: 'string',
                }, {
                    name: "报关要素",
                    code: "elements_name",
                    show: true,
                    iscond: true,
                    type: 'string',
                }, {
                    name: "备注",
                    code: "note",
                    show: true,
                    iscond: true,
                    type: 'string',
                }],
            searchlist: ["brand_name", "elements_name", "note"],
            classid: "custom_elements",
            postdata: {flag: 5},
            sqlBlock: " usable = 2",
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (data) {
            $scope.data.currItem.elements_name=data.elements_name;
            $scope.data.currItem.brand_name=data.brand_name;
        });
    }
    //报关要素
    $scope.elements_name = function (item) {
        $scope.FrmInfo = {
            is_high: true,
            is_custom_search: true,
            title: "报关要素查询",
            thead: [
                {
                    name: "报关要素品名",
                    code: "brand_name",
                    show: true,
                    iscond: true,
                    type: 'string',
                }, {
                    name: "报关要素",
                    code: "elements_name",
                    show: true,
                    iscond: true,
                    type: 'string',
                }, {
                    name: "备注",
                    code: "note",
                    show: true,
                    iscond: true,
                    type: 'string',
                }],
            searchlist: ["brand_name", "elements_name", "note"],
            classid: "custom_elements",
            postdata: {flag: 5},
            sqlBlock: " usable = 2",
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (data) {
            $scope.data.currItem.elements_name=data.elements_name;
            $scope.data.currItem.brand_name=data.brand_name;
        });
    }
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss')
        };
    };

    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('customs_nameEdit', customs_nameEdit);
