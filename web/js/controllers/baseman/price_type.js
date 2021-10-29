var basemanControllers = angular.module('inspinia');
function price_type($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "price_type",
        key: "price_type_id",
        nextStat: "price_typeEdit",
        classids: "price_types",
        sqlBlock:"1=1",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    $scope.headername="价格条款维护";
    price_type = HczyCommon.extend(price_type,ctrl_view_public);
    price_type.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    /**----网格列区域  ----------*/
    $scope.viewColumns = [
        /*{
            headerName: "序号", field: "rn", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },*/{
            headerName: "价格类型编码", field: "price_type_code",editable: false, filter: 'set',  width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "价格类型名称", field: "price_type_name",editable: false, filter: 'set',  width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "贸易类型", field: "trade_type",editable: false, filter: 'set',  width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 1, desc: '进出口贸易'}, {value: 2, desc: '香港转口贸易'}, {value: 3, desc: '香港直营'}]},
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "ERP名称", field: "erp_type_name",editable: false, filter: 'set',  width: 90,
            cellEditor:"文本框",
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
    .controller('price_type',price_type);

