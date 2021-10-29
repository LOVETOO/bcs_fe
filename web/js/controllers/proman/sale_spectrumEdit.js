var promanControllers = angular.module('inspinia');
function sale_spectrumEdit($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {
    //继承基类方法
    sale_spectrumEdit = HczyCommon.extend(sale_spectrumEdit, ctrl_bill_public);
    sale_spectrumEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_spectrum",
        key: "spectrum_id",
        FrmInfo: {},
        grids: []
    };
    /*系统词汇*/
    {
        //状态
        $scope.new_stats = [
            {
                id: 1,
                name: "在售"
            }, {
                id: 2,
                name: "预警"
            }, {
                id: 3,
                name: "冻结"
            }];
        $scope.stats=[
            {id: 1,name: "制单"},
            {id: 2,name: "提交"},
            {id: 3,name: "启动"},
            {id: 4,name: "驳回"},
            {id: 5,name: "已审核"},
            {id: 10,name: "红冲"},
            {id: 99,name: "关闭"}
        ]
    }
    
    $scope.refresh_after=function(){
        $scope.data.currItem.stat=1;
    };
    $scope.initdata();
}//加载控制器
promanControllers
    .controller('sale_spectrumEdit', sale_spectrumEdit)

