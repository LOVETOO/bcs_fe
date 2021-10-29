var basemanControllers = angular.module('inspinia');
function base_notice_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "base_notice_header",
        key: "notice_id",
        nextStat: "base_notice_headerEdit",
        classids: "base_notice_headers",
        //sqlBlock:"1=1",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    $scope.headername="公告维护";
    //$scope.contain=$
    // scope.objconf.classids;4
    base_notice_header = HczyCommon.extend(base_notice_header,ctrl_view_public);
    base_notice_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    /**----网格列区域  ----------*/
    $scope.viewColumns = [
        {
            headerName: "公告标题", field: "notice_title",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "公告内容", field: "notice_content",editable: false, filter: 'set',  width: 85,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发布时间", field: "fb_date",editable: false, filter: 'set',  width: 100,
            cellEditor:"年月日",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "失效时间", field: "sx_date",editable: false, filter: 'set',  width: 100,
            cellEditor:"年月日",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "查看部门", field: "org_names",editable: false, filter: 'set',  width: 100,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "查看人", field: "usernames",editable: false, filter: 'set',  width: 80,
            cellEditor:"文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否有附件", field: "is_fj",editable: false, filter: 'set',  width: 100,
            cellEditor:"下拉框",
            cellEditorParams:{values:[{value:1,desc:'否'},{value:2,desc:'是'}]},
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "制单人", field: "creator",editable: false, filter: 'set',  width: 80,
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
            cellRenderer:"链接渲染"
        }];
    //数据缓存
    $scope.initData();
}
//加载控制器
basemanControllers
    .controller('base_notice_header',base_notice_header);

