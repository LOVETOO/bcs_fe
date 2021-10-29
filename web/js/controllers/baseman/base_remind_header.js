var basemanControllers = angular.module('inspinia');
function base_remind_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "base_remind_header",
        key: "remind_id",
        nextStat: "base_remind_headerEdit",
        classids: "base_remind_headers",
        sqlBlock:"1=1",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    $scope.headername="提醒";
    base_remind_header = HczyCommon.extend(base_remind_header,ctrl_view_public);
    base_remind_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    /**----网格列区域  ----------*/
    $scope.viewColumns = [
        {
            headerName: "序号", field: "queue", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "提醒名称", field: "remind_type",editable: false, filter: 'set',  width: 300,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "权限类型", field: "power_type",editable: false, filter: 'set',  width: 150,
            cellEditor:"下拉框",
            cellEditorParams:{values:[{value:1,desc:'部门'},{value:2,desc:'客户'},{value:3,desc:'用户'},{value:4,desc:'仓库'},{value:5,desc:'<不控制>'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "制单时间", field: "create_time",editable: false, filter: 'set',  width: 200,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "制单人", field: "creator",editable: false, filter: 'set',  width: 120,
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
    .controller('base_remind_header',base_remind_header);

