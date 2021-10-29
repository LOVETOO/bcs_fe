var basemanControllers = angular.module('inspinia');
function exchange_bf($rootScope, $scope, $location, $modal,$timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "exchange_bf",
        key: "rate_id",
        nextStat: "exchange_bfEdit",
        classids: "exchange_bfs",
        sqlBlock:"1=1",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };
    $scope.headername="汇率设置";
    exchange_bf = HczyCommon.extend(exchange_bf,ctrl_view_public);
    exchange_bf.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    /**----弹出框事件区域  ----------*/
    /**----修改文本框触发事件区域  ----------*/
    /**----网格列区域  ----------*/
    $scope.viewColumns = [
        {
            headerName: "货币编码", field: "currency_code",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "货币名称", field: "currency_name",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "年份", field: "rate_year",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "月份", field: "rate_month",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "汇率", field: "exch_rate",editable: false, filter: 'set',  width: 60,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "是否远期汇率", field: "is_future",editable: false, filter: 'set',  width: 130,
            cellEditor:"复选框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "会计区间(月份)", field: "kunaji_month",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "会计期间是否可用", field: "is_usable",editable: false, filter: 'set',  width: 150,
            cellEditor:"复选框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "备注", field: "note",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
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
    .controller('exchange_bf',exchange_bf)
