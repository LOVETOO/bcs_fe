var basemanControllers = angular.module('inspinia');
function crm_sap_finance_subjectsEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    crm_sap_finance_subjectsEdit = HczyCommon.extend(crm_sap_finance_subjectsEdit, ctrl_bill_public);
    crm_sap_finance_subjectsEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "crm_sap_finance_subjects",
        key: "subjects_id",
        // wftempid: 10137,
        FrmInfo: {},
        grids:[],
    };
    //初始化
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            is_sendcbzx:2,
            fin_type:1
        };
    };
    $scope.refresh_after= function(){
        $scope.data.currItem.fin_type=Number($scope.data.currItem.fin_type);
    }
    $scope.fin_types=[{dictvalue:1,dictname:"费用编码"},{dictvalue:2,dictname:"信用证费用编码"}];

    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('crm_sap_finance_subjectsEdit', crm_sap_finance_subjectsEdit);
