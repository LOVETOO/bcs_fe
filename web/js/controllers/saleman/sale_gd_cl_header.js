var basemanControllers = angular.module('inspinia');
function sale_gd_cl_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_gd_cl_header",
        key: "gd_id",
        nextStat: "sale_gd_cl_headerEdit",
        classids: "sale_gd_cl_headers",
        sqlBlock:"1=1",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    $scope.headername="改单处理";
    sale_gd_cl_header = HczyCommon.extend(sale_gd_cl_header,ctrl_view_public);
    sale_gd_cl_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
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
            headerName: "单据状态", field: "stat",editable: false, filter: 'set',  width: 100,
            cellEditor:"下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams:{
                values:[],
            },
        },
        {
            headerName: "单号", field: "gd_no",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "出货预告号", field: "warn_no",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "创建人", field: "creator",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "创建时间", field: "create_time",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "合同号", field: "pi_no",editable: false, filter: 'set',  width: 160,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "改单费", field: "gd_amt",editable: false, filter: 'set',  width: 100,
            cellEditor:"复选框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "费用承担人", field: "bearers",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "改单员", field: "gd_member",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "改单原因", field: "gd_action",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "改单内容", field: "gd_content",editable: false, filter: 'set',  width: 100,
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
            pinned: 'right',
        }];
    //数据缓存
    $scope.initData();
}
//加载控制器
basemanControllers
    .controller('sale_gd_cl_header',sale_gd_cl_header);

