var basemanControllers = angular.module('inspinia');
function bill_invoice_bl_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    bill_invoice_bl_headerEdit = HczyCommon.extend(bill_invoice_bl_headerEdit, ctrl_bill_public);
    bill_invoice_bl_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "bill_invoice_bl_header",
        key: "invoice_id",
        // wftempid: 10137,
        FrmInfo: {},
        grids:[],
    };

    /****************************初始化**********************/
    var myDate = new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            is_hx: 2,
        };
    };
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('bill_invoice_bl_headerEdit', bill_invoice_bl_headerEdit);
