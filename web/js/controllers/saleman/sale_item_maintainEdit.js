var basemanControllers = angular.module('inspinia');
function sale_item_maintainEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_item_maintainEdit = HczyCommon.extend(sale_item_maintainEdit, ctrl_bill_public);
    sale_item_maintainEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"sale_item_maintain",
        key:"item_maintain_id",
        //wftempid:
        FrmInfo: {},
        grids:[]
    };
    /**----弹出框区域*---------------*/
    //界面初始化

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
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (data) {
            if(data.itemid==undefined){
                return
            }
            $scope.data.currItem.item_id=data.itemid;
            $scope.data.currItem.item_code=data.itemcode;
            $scope.data.currItem.item_name=data.itemname;
        })
    }
    $scope.clearinformation=function () {
        $scope.data.currItem.usable=2
    }

    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('sale_item_maintainEdit', sale_item_maintainEdit);
