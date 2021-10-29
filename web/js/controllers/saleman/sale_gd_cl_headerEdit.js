var basemanControllers = angular.module('inspinia');
function sale_gd_cl_headerEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_gd_cl_headerEdit = HczyCommon.extend(sale_gd_cl_headerEdit, ctrl_bill_public);
    sale_gd_cl_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_gd_cl_header",
        key: "gd_id",
        wftempid: 10151,
        FrmInfo: {},
        grids: []
    };
    var myDate= new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,
            create_time:myDate.toLocaleDateString(),
            objattachs:[]
        };
    };
    $scope.warn_no = function () {
        if ($scope.data.currItem.stat > 1) {
            return;
        }
        $scope.FrmInfo = {
            classid: "sale_ship_warn_header",
            postdata: {},
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            if(result.warn_id==undefined){
                return;
            }
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.warn_no = result.warn_no;
            $scope.data.currItem.pi_no = result.pi_no;
        });
    }
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('sale_gd_cl_headerEdit', sale_gd_cl_headerEdit);
