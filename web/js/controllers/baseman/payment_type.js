var basemanControllers = angular.module('inspinia');
function payment_type($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "payment_type",
        key: "payment_type_id",
        nextStat: "payment_typeEdit",
        classids: "payment_types",
        sqlBlock:"1=1",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    $scope.headername="付款方式";
    //$scope.contain=$
    // scope.objconf.classids;4
    payment_type = HczyCommon.extend(payment_type,ctrl_view_public);
    payment_type.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);


    /**----网格列区域  ----------*/
    $scope.viewColumns = [
        {
            headerName: "付款方式", field: "payment_type_code",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "付款方式名称", field: "payment_type_name",editable: false, filter: 'set',  width: 150,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "ERP名称", field: "erp_type_id",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "是否可用", field: "usable",editable: false, filter: 'set',  width: 100,
            cellEditor:"下拉框",
            cellEditorParams:{values:[{value:1,desc:'否'},{value:2,desc:'是'}]},
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "操作", field: "",editable: false, filter: 'set',  width: 58,
            //cellchange:$scope.bankBalance,
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
    .controller('payment_type',payment_type);

