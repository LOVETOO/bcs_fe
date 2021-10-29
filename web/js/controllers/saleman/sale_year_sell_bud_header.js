var salemanControllers = angular.module('inspinia');
function sale_year_sell_bud_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_year_sell_bud_header",
        key: "bud_id",
        nextStat: "sale_year_sell_bud_headerEdit",
        classids: "sale_year_sell_bud_headers",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };
    $scope.beforClearInfo = function () {
        if ($rootScope.$state.$current.self.name == "crmman.sale_year_sell_bud_header") {
            $scope.objconf.postdata = {sqlwhere: "1=1"};
            $scope.objconf.nextStat = "sale_year_sell_bud_headerEdit";
            $scope.headername = "年度销售预测录入";
            $scope.hide = "true";
        } else if ($rootScope.$state.$current.self.name == "crmman.sale_year_sell_bud_header_zf") {
            $scope.objconf.postdata = {sqlwhere: "stat=5"};  //作废
            $scope.objconf.nextStat = "sale_year_sell_bud_header_zfEdit";
            $scope.headername = "年度销售预测录入作废";
            $scope.hide = "true";
        }
    };
    $scope.beforClearInfo();
    sale_year_sell_bud_header = HczyCommon.extend(sale_year_sell_bud_header, ctrl_view_public);
    sale_year_sell_bud_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
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
        }, {
            headerName: "状态", field: "stat", editable: false, filter: 'set', width: 60,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "单号", field: "bud_no", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "部门名称", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "中心名称", field: "core_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },

        {
            headerName: "创建人", field: "creator", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "创建时间", field: "create_time", editable: false, filter: 'set', width: 85,
            cellEditor: "时分秒",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "修改人", field: "updator", editable: false, filter: 'set', width: 85,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "修改时间", field: "update_time", editable: false, filter: 'set', width: 85,
            cellEditor: "时分秒",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },

        {
            headerName: "度销售发起单号", field: "sell_no", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "操作", field: "", editable: false, filter: 'set', width: 58,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            pinned: 'right',
            cellRenderer: "链接渲染"
        }];

    //数据缓存
    $scope.initData();
}
//加载控制器
salemanControllers
    .controller('sale_year_sell_bud_header', sale_year_sell_bud_header);

