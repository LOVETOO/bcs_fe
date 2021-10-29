var basemanControllers = angular.module('inspinia');
function rpt_report_show($rootScope, $scope, $location, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "rptset_head",
        key: "rptset_head_id",
        //nextStat: "pro_main_tain_headerEdit",
        classids: "rptset_heads",
        // sqlblock:"1=1",
        postdata:{flag:2,rptset_head_id:28},
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };
    $scope.hide = true;
    rpt_report_show = HczyCommon.extend(rpt_report_show, ctrl_view_public);
    rpt_report_show.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    // $scope.search = function () {
    //
    // }
//高级查询方法
    $scope.init_table = function () {
       $scope.FrmInfo = {
			classid : "rptset_head",
			is_custom_search:true,//控制高级查询不调用FrmInfo.js文件里的
			//sqlBlock : "stat=5",
			is_high : true,
			 type: 'sqlback',
			title : "查询报表",
			thead: [
				{
				name: "发货通知单号",
                code: "notice_no",
				 show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "业务员",
                code: "sales_user_id",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "发票号",
                code: "fact_invoice_no",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "发票流水号",
                code: "invoice_no",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "报关单号",
                code: "customs_no",
				show: true,
                iscond: true,
                type: 'string'
            }]
		};
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            if (result.sqlwhere) {
                $scope.highsql = result.sqlwhere;
            }
            $scope.search();
        });
    };

    $scope.viewColumns = [{
        headerName: "序号", field: "queue", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "发货通知单号", field: "notice_no", editable: false, filter: 'set', width: 170,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "业务员",
        field: "sales_user_id",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        width: 100,
    }, {
        headerName: "发票号",
        field: "fact_invoice_no",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        width: 140,
    }, {
        headerName: "发票流水号",
        field: "invoice_no",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 120,
    }, {
        headerName: "报关单号",
        field: "customs_no",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 170
    }];
    //数据缓存
    $scope.initData();
}

//加载控制器
basemanControllers
    .controller('rpt_report_show', rpt_report_show)
