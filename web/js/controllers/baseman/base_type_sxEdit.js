var basemanControllers = angular.module('inspinia');
function base_type_sxEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    base_type_sxEdit = HczyCommon.extend(base_type_sxEdit, ctrl_bill_public);
    base_type_sxEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "base_type_sx",
        key: "sx_id",
        // wftempid: 10137,
        FrmInfo: {},
        grids:[],
        // grids: [{optionname: 'options_13', idname: 'pro_item_ysamts'}]
    };
     BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cool_stand"}).then(function (data) {
         $scope.cool_stands = data.dicts;
     })
    $scope.selectitem = function () {
        if($scope.data.currItem.sx_id>0){
            return;
        }
        $scope.FrmInfo = {
            title: "产品类别查询",
            is_custom_search:true,
            is_high: true,
            thead: [
                {
                    name: "产品类别编号",
                    code: "item_type_id",
                    show: true,
                    iscond: true,
                    type: 'string'

                }, {
                    name: "产品类别名称",
                    code: "item_type_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            classid: "pro_item_type",
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
            $scope.data.currItem.source_code = result.corpserialno;
            $scope.data.currItem.quotasum = 0;
            for (name in result) {
                $scope.data.currItem[name] = result[name];
            }
        });
    }
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('base_type_sxEdit', base_type_sxEdit);
