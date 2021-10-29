var basemanControllers = angular.module('inspinia');
function sale_prod_allo_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_prod_allo_header",
        key: "prod_allo_id",
        nextStat: "sale_prod_allo_headerEdit",
        classids: "sale_prod_allo_headers",
        sqlBlock:"1=1",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };
    $scope.headername="到款转入生产单";
    //网格下拉
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            };
            $scope.viewColumns[0].cellEditorParams.values.push(newobj)
        }
    });
    sale_prod_allo_header = HczyCommon.extend(sale_prod_allo_header,ctrl_view_public);
    sale_prod_allo_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    /**----网格列区域  ----------*/
    $scope.viewColumns = [
       {
            headerName: "单据状态", field: "stat",editable: false, filter: 'set',  width: 100,
            cellEditor:"下拉框",
            cellEditorParams:{values:[]},
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "单据号", field: "prod_allo_no",editable: false, filter: 'set',  width: 150,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单据类型", field: "bill_type",editable: false, filter: 'set',  width: 100,
            cellEditor:"下拉框",
            cellEditorParams:{values:[{value:0,desc:'到款PI分配'},{value:1,desc:'信用证用途分配'},{value:2,desc:'无分配单'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "到款PI分配单号", field: "allo_no",editable: false, filter: 'set',  width:100,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "信用证用途分配单号", field: "lc_allot_no",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "部门编码", field: "org_code",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "部门名称", field: "org_name",editable: false, filter: 'set',  width: 150,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户编码", field: "cust_code",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户名称", field: "cust_name",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "创建人", field: "creator",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "创建时间", field: "create_time",editable: false, filter: 'set',  width: 100,
            cellEditor:"年月日",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "修改人", field: "updator",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "修改时间", field: "update_time",editable: false, filter: 'set',  width: 120,
            cellEditor:"年月日",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
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
         pinned: 'right',
         cellRenderer:"链接渲染"
         }];
    //数据缓存
    $scope.initData();
}
//加载控制器
basemanControllers
    .controller('sale_prod_allo_header',sale_prod_allo_header);

