var basemanControllers = angular.module('inspinia');
function sale_box_maintain($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_box_maintain",
        key: "box_id",
        nextStat: "sale_box_maintainEdit",
        classids: "sale_box_maintains",
        postdata:{
            sqlwhere:"1=1",
        },
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    $scope.headername="箱型";
    sale_box_maintain = HczyCommon.extend(sale_box_maintain,ctrl_view_public);
    sale_box_maintain.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
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
            headerName: "编码", field: "box_code",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "箱型名称", field: "box_name",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分类", field: "box_style",editable: false, filter: 'set',  width: 80,
            cellEditor:"下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams:{
                values:[{value:1,desc:'木箱'},{value:2,desc:'纸箱'}],
            },
        },
        {
            headerName: "长", field: "box_long",editable: false, filter: 'set',  width: 80,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "宽", field: "box_wide",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "高", field: "box_high",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否标准箱", field: "is_default",editable: false, filter: 'set',  width: 100,
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
    .controller('sale_box_maintain',sale_box_maintain);

