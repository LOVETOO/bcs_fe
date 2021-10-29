var salemanControllers = angular.module('inspinia');
function sale_year_sell_cale($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_year_sell_cale",
        key: "sell_id",
        nextStat: "sale_year_sell_caleEdit",
        classids: "sale_year_sell_cales",
        sqlBlock:"1=1",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    $scope.headername="年度销售计划";
    sale_year_sell_cale = HczyCommon.extend(sale_year_sell_cale,ctrl_view_public);
    sale_year_sell_cale.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    /*************网格列区域***************/
    $scope.viewColumns = [
        {
            headerName: "序号", field: "queue", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "状态", field: "stat",editable: false, filter: 'set',  width: 60,
            cellEditor:"下拉框",
            cellEditorParams:{values:[]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单号", field: "sell_no",editable: false, filter: 'set',  width: 125,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "要求录入时间", field: "finish_date",editable: false, filter: 'set',  width: 120,
            cellEditor:"时分秒",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "预算年度", field: "sell_year",editable: false, filter: 'set',  width: 85,
            cellEditor:"整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "美元汇率", field: "usd_rate",editable: false, filter: 'set',  width: 85,
            cellEditor:"浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "欧元汇率", field: "eur_rate",editable: false, filter: 'set',  width: 85,
            cellEditor:"浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "创建人", field: "creator",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "创建时间", field: "create_time",editable: false, filter: 'set',  width: 120,
            cellEditor:"时分秒",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
         {
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
salemanControllers
    .controller('sale_year_sell_cale',sale_year_sell_cale);

