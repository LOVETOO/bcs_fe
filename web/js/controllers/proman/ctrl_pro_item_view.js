var promanControllers = angular.module('inspinia');
function pro_item_view($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "pro_item",
        key: "item_id",
        classids: "pro_item_partofpro_items",
        hasStats: false,
        //SqlWhere:"1=1", 该条不存在就不要赋值
    }
    //继承基类方法
    pro_item_view = HczyCommon.extend(pro_item_view, ctrl_view_public);
    pro_item_view.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    $scope.beforeSearch = function (postdata) {
        postdata.flag=2;
    }


    $scope.viewColumns = [
        {
            id: "id",
            name: "#",
            field: "id",
            behavior: "select",
            cssClass: "cell-selection",
            width: 40,
            cannotTriggerInsert: true,
            resizable: false,
            selectable: false,
            focusable: false
        },{
            id: "item_h_code",
            name: "整机编码",
            field: "item_h_code",
            width: 125
        },{
            id: "item_h_name",
            name: "整机名称",
            field: "item_h_name",
            width: 150
        },{
            id: "item_code",
            name: "分体机编码",
            field: "item_code",
            width: 125
        },{
            id: "item_name",
            name: "分体机名称",
            field: "item_name",
            width: 150
        },{
            id: "item_p_code",
            name: "配件编码",
            field: "item_p_code",
            width: 120
        },{
            id: "part_desc",
            name: "配件描述",
            field: "part_desc",
            width: 150
        } ,{
            id: "part_en_name",
            name: "英文名",
            field: "part_en_name",
            width: 100
        },{
            id: "qty",
            name: "单台用量",
            field: "qty",
            width: 100
        },{
            id: "price",
            name: "成本",
            field: "price",
            width: 80
        }
    ];

    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {};
    };
    $scope.clearinformation();
    HczyCommon.pushGrid($scope);
    HczyCommon.commitGrid_GetData_setSeq($scope);


    $scope.initData();

}


promanControllers
    .controller('pro_item_view', pro_item_view)

