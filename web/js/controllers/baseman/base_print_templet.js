var basemanControllers = angular.module('inspinia');
function base_print_templet($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "base_print_templet",
        key: "templet_id",
        nextStat: "base_print_templetEdit",
        classids: "base_print_templets",
        sqlBlock:"1=1",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    $scope.headername="打印模板";
    base_print_templet = HczyCommon.extend(base_print_templet,ctrl_view_public);
    base_print_templet.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    /**----网格列区域  ----------*/
    $scope.viewColumns = [
        {
            headerName: "模板代号", field: "templet_code",editable: false, filter: 'set',  width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "模板名称", field: "templet_name",editable: false, filter: 'set',  width: 130,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "制单人", field: "creator",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "制单时间", field: "create_time",editable: false, filter: 'set',  width: 100,
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
    .controller('base_print_templet',base_print_templet);

