var basemanControllers = angular.module('inspinia');
function bill_invoice_header_fy($rootScope, $scope, $location, $modal,$timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "bill_invoice_header",
        key: "invoice_id",
        nextStat: "bill_invoice_header_fyEdit",
        classids: "bill_invoice_headers",
        postdata:{sqlwhere:"(nvl(invoice_type, 0) =2)"},
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };
    $scope.headername="费用发票";
    //继承基类方法
    bill_invoice_header_fy = HczyCommon.extend(bill_invoice_header_fy, ctrl_view_public);
    bill_invoice_header_fy.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    /************网格下拉************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            var stats = [];
            for (var i = 0; i < data.dicts.length; i++) {
                stats[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'stat')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'stat')].cellEditorParams.values = stats;
            }
        });
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"})
        .then(function (data) {
            var trade_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                trade_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'sale_ent_type')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'sale_ent_type')].cellEditorParams.values = trade_types;
            }
        });
    $scope.viewColumns = [
        {
            headerName: "序号", field: "queue", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "单据状态", field: "stat", editable: false, filter: 'set', width: 85,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: []
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "商业发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 110,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发票流水号", field: "invoice_no", editable: false, filter: 'set', width: 110,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "部门名称", field: "org_name", editable: false, filter: 'set', width: 85,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 85,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "贸易类型", field: "sale_ent_type", editable: false, filter: 'set', width: 85,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: []
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "付款方式", field: "payment_type_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户", field: "cust_code", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "货币", field: "currency_code", editable: false, filter: 'set', width: 85,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "货币名称", field: "currency_name", editable: false, filter: 'set', width: 85,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "付款方式", field: "payment_type_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "付款方式名称", field: "payment_type_name", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }

        , {
            headerName: "本次开票金额", field: "invoice_amt", editable: false, filter: 'set', width: 85,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "到款总金额", field: "return_amt", editable: false, filter: 'set', width: 85,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },

        {
            headerName: "制单人", field: "creator", editable: false, filter: 'set', width: 85,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "制单时间", field: "create_time", editable: false, filter: 'set', width: 130,
            cellEditor: "时分秒",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "审核时间", field: "check_time", editable: false, filter: 'set', width: 130,
            cellEditor: "时分秒",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "导ERP时间", field: "erp_time", editable: false, filter: 'set', width: 130,
            cellEditor: "时分秒",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "会计期间", field: "dname", editable: false, filter: 'set', width: 85,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        , {
            headerName: "操作", field: "", editable: false, filter: 'set', width: 58,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            // pinned: 'right',
            cellRenderer: "链接渲染"
        }];
    //数据缓存
    $scope.initData();
}
//加载控制器
basemanControllers
    .controller('bill_invoice_header_fy', bill_invoice_header_fy);

