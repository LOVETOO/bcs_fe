var basemanControllers = angular.module('inspinia');
function sale_box_maintainEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_box_maintainEdit = HczyCommon.extend(sale_box_maintainEdit, ctrl_bill_public);
    sale_box_maintainEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"sale_box_maintain",
        key:"box_id",
        //wftempid:
        FrmInfo: {},
        grids:[]
    };
    /**----弹出框区域*---------------*/
    //界面初始化
    $scope.clearbox = function (){
        $scope.data.currItem.sale_box_maintainEdit="";
        $scope.data.currItem.box_name="";
    }
    $scope.box_styles=[{value:1,desc:'木箱'},{value:2,desc:'纸箱'}];
    
    $scope.getitem = function () {
        $scope.FrmInfo = {
            is_high: true,
            title: "物料查询",
            is_custom_search: true,
            thead: [
                {
                    name: "物料编码",
                    code: "itemcode",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "物料名称",
                    code: "itemname",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            classid: "sale_package_header",
            postdata: {
                flag: 1,
            },
            sqlBlock:" itemdesc like '%箱%'",
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (data) {
            if(data.itemid==undefined){
                return
            }
            $scope.data.currItem.box_code=data.itemcode;
            $scope.data.currItem.box_name=data.itemname;
            BasemanService.RequestPost("sale_box_maintain","getboxmsg",{box_code:$scope.data.currItem.box_code}).then(function (result) {
                $scope.data.currItem.box_long=result.box_long;
                $scope.data.currItem.box_wide=result.box_wide;
                $scope.data.currItem.box_high=result.box_high;
            })
        })
    }
    $scope.clearinformation=function () {
        $scope.data.currItem.is_default=2
    }

    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('sale_box_maintainEdit', sale_box_maintainEdit);
