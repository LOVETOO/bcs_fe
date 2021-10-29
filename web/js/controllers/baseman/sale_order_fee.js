var basemanControllers = angular.module('inspinia');
function sale_order_fee($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_order_fee",
        key: "order_fee_id",
        nextStat: "sale_order_feeEdit",
        classids: "sale_order_fees",
        sqlBlock:"1=1",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    $scope.headername="费用项目设置";
    sale_order_fee = HczyCommon.extend(sale_order_fee,ctrl_view_public);
    sale_order_fee.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    /*系统词汇*/
    // 订单费用类型
    /*BasemanService.RequestPost("base_search", "searchdict", {dictcode: "order_fee_type"})
    .then(function (data) {
        $scope.Order_Fee_Types = HczyCommon.stringPropToNum(data.dicts);
    });*/
    $scope.orderfeetypes =[{dictvalue:1, dictname:"费用类型"}]
    /**----网格列区域  ----------*/
    $scope.viewColumns = [
        {
            headerName: "订单费用编码", field: "order_fee_code",editable: false, filter: 'set',  width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单费用名称", field: "order_fee_name",editable: false, filter: 'set',  width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "订单费用类型", field: "order_fee_type",editable: false, filter: 'set',  width: 150,
            cellEditor:"文本框",
            cellEditorParams:{values:[{value:1,desc:'费用类型'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否可用", field: "usable",editable: false, filter: 'set',  width: 100,
            cellEditor:"下拉框",
            cellEditorParams:{values:[{value:1,desc:'否'},{value:2,desc:'是'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "操作", field: "",editable: false, filter: 'set',  width: 58,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellRenderer:"链接渲染"
        }];
    //数据缓存
    $scope.initData();
}
//加载控制器
basemanControllers
    .controller('sale_order_fee',sale_order_fee);

