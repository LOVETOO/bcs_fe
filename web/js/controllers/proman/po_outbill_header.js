'use strict';
var salemanControllers = angular.module('inspinia');
function po_outbill_header($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope) {
    po_outbill_header = HczyCommon.extend(po_outbill_header, ctrl_view_public);
    po_outbill_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "po_outbill_header",
        key: "out_id",
        classids: "po_outbill_headers",
        nextStat:"po_outbill_headerEdit",
        sqlBlock:"1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    }
    $scope.headername = "其他出库";
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            var line_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                line_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                }
            }
            if ($scope.getIndexByField('viewColumns', 'stat')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'stat')].cellEditorParams.values = line_types;
            }
        });
    /**----网格列区域  ----------*/
    $scope.viewColumns = [{
            headerName: "序号", field: "queue", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "状态",
            field: "stat",
            editable: false,
            filter: 'set',
            width: 85,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: []
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "出库单号",
            field: "out_no",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "出库类型",
            field: "out_type",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '发货出库'}, {value: 2, desc: '领用出库'}, {value: 3, desc: '其它出库'}]
        },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "仓库编码",
            field: "wh_code",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "仓库名称",
            field: "wh_name",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "出库日期",
            field: "out_date",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "部门名称",
            field: "org_name",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户编码",
            field: "cust_code",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户名称",
            field: "cust_name",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "来源单据号",
            field: "source_no",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "总数量",
            field: "total_qty",
            editable: false,
            filter: 'set',
            width: 80,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "总金额",
            field: "total_amt",
            editable: false,
            filter: 'set',
            width: 90,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "创建人",
            field: "creator",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "创建时间",
            field: "create_time",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "最后修改人",
            field: "updator",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "最后修改时间",
            field: "update_time",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "审核人",
            field: "checkor",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "审核时间",
            field: "check_time",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "备注",
            field: "note",
            editable: false,
            filter: 'set',
            width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "详情",
            field: "",
            editable: false,
            filter: 'set',
            width: 78,
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

salemanControllers
    .controller('po_outbill_header', po_outbill_header)



