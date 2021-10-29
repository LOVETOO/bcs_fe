var basemanControllers = angular.module('inspinia');
function report_view($rootScope, $scope, $location, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "rptset_head",
        // key: "funds_id",
        // nextStat: "report_viewEdit",
        classids: "rptset_heads",
        postdata: {},
        FrmInfo: {
            is_high: true,
            title: "查询报表",
            thead: [],
            type: 'sqlback',
            classid: "rptset_head",
            postdata: {},
        },
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };

    //继承基类方法
    report_view = HczyCommon.extend(report_view, ctrl_view_public);
    report_view.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    $scope.headername = "查询报表";
    $scope.hide = true;
    $scope.viewColumns = [];

    //高级查询方法
    $scope.init_table = function () {
        $scope.FrmInfo = $scope.objconf.FrmInfo;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            if (result.sqlwhere) {
                $scope.highsql = result.sqlwhere;
            }
            $scope.search();
        });
    };

    $scope.set_stat = function () {
    }
    //数据缓存
    $scope.initData();

    $scope.setAll = function (data) {
        $scope.headername = data.rpt_titile;
        var cols = data.rptset_lineofrptset_heads;
	
        data.viewColumns = [];
        data.viewColumns[0] = {
            headerName: "序号", field: "queue", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        };
        for (var i = 0; i < cols.length; i++) {
            data.viewColumns[i + 1] = {
                headerName: cols[i].field_name,
                field: cols[i].field_code.toLowerCase(),
                editable: false,
                filter: 'set',
                width: Number(cols[i].field_width) + 20,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                hide: cols[i].is_hide == 2,
            };
            if (cols[i].field_type == "1") {
                data.viewColumns[i + 1].cellEditor = "文本框"
            } else if (cols[i].field_type == "2") {
                data.viewColumns[i + 1].cellEditor = "时分秒"
            } else if (cols[i].field_type == "3") {
                data.viewColumns[i + 1].cellEditor = "整数框"
            } else if (cols[i].field_type == "4") {
                data.viewColumns[i + 1].cellEditor = "浮点框"
            }
            $scope.objconf.FrmInfo.thead[i] = {
                name: cols[i].field_name,
                code: cols[i].field_code.toLowerCase(),
                show: true,
                iscond: true,
                type: 'string'
            };

            if (cols[i].field_type == "1") {
                $scope.objconf.FrmInfo.thead[i].type = "string"
            } else if (cols[i].field_type == "2") {
                $scope.objconf.FrmInfo.thead[i].type = "date"
            } else if (cols[i].field_type == "3") {
                $scope.objconf.FrmInfo.thead[i].type = "number"
            } else if (cols[i].field_type == "4") {
                $scope.objconf.FrmInfo.thead[i].type = "number"
            }

        }
        $scope.objconf.postdata = {
            flag: 2,
            rptset_head_id: data.rptset_head_id,
        }
        $scope.objconf.FrmInfo.postdata = $scope.objconf.postdata;
    }
    $scope.viewOptions.rowDoubleClicked = undefined;;

    if ($scope.data.currItem == undefined) {
        $scope.data.currItem = {};
    }
    if ($scope.$state.params) {
        if ($scope.data.currItem.rptset_head_id != undefined && $scope.data.currItem.rptset_head_id > 0) { //页面切换不需要重新查询
            $scope.viewColumns = $scope.data.currItem.viewColumns;
            $scope.setitemline1($scope.data.currItem);
            $scope.setAll($scope.data.currItem);
            return;
        }
        var rptset_head_id = $scope.$state.params.rptset_head_id;
        if (rptset_head_id != undefined && rptset_head_id > 0) {
            var requesetobj = BasemanService.RequestPostNoWait("rptset_head", "select", {rptset_head_id: rptset_head_id});
            if (requesetobj.pass) {
                $scope.data.currItem = requesetobj.data;
                $scope.setAll($scope.data.currItem);
            }
        }
        $scope.viewColumns = $scope.data.currItem.viewColumns;
    }


}
//加载控制器
basemanControllers
    .controller('report_view', report_view);

