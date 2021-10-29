var basemanControllers = angular.module('inspinia');
function sale_item_maintain($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_item_maintain",
        key: "item_maintain_id",
        nextStat: "sale_item_maintainEdit",
        classids: "sale_item_maintains",
        postdata:{
            sqlwhere:"1=1",
        },
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    $scope.headername="物料最小包装量";
    sale_item_maintain = HczyCommon.extend(sale_item_maintain,ctrl_view_public);
    sale_item_maintain.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    /**----网格列区域  ----------*/
    $scope.viewColumns = [
        {
            headerName: "序号",
            field: "queue",
            editable: false,
            filter: 'set',
            width: 60,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料编码", field: "item_code",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料描述", field: "item_name",editable: false, filter: 'set',  width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "最小包装量", field: "qty",editable: false, filter: 'set',  width: 120,
            cellEditor:"整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否可用", field: "usable",editable: false, filter: 'set',  width: 100,
            cellEditor:"复选框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note",editable: false, filter: 'set',  width: 200,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "操作", field: "",editable: false, filter: 'set',  width: 58,
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellRenderer:"链接渲染",
        }];
    //数据缓存
    $scope.initData();
}
//加载控制器
basemanControllers
    .controller('sale_item_maintain',sale_item_maintain);

