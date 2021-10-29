'use strict';
var salemanControllers = angular.module('inspinia');
function sale_po_purchase_header($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope) {
    sale_po_purchase_header = HczyCommon.extend(sale_po_purchase_header, ctrl_view_public);
    sale_po_purchase_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "po_purchase_header",
        key: "po_id",
        nextStat: "sale_po_purchase_headerEdit",
        classids: "po_purchase_headers",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    }
    $scope.headername = "外购件采购申请";

    /**----网格列区域  ----------*/
    $scope.viewColumns = [
        {
            headerName: "序号", field: "queue", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
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
            headerName: "采购申请单号",
            field: "po_no",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "供应商编码",
            field: "vender_code",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "供应商名称",
            field: "vender_name",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "币种",
            field: "curr_code",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "申请日期",
            field: "po_date",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        /*{
            headerName: "有效期止",
            field: "end_date",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },*/
        {
            headerName: "采购类型",
            field: "po_type",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: '客户采购'}, {value: 2, desc: '统一采购'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "部门编码",
            field: "org_code",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "部门名称",
            field: "org_name",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "申请人",
            field: "po_man",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "可用额度",
            field: "canused_amt",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "总数量",
            field: "total_qty",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
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
            width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
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
        },
        {
            headerName: "创建时间",
            field: "create_time",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "最后修改人",
            field: "updator",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "最后修改时间",
            field: "update_time",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
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
        },
        {
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
        },
        {
            headerName: "备注",
            field: "note",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "操作",
            field: "",
            editable: false,
            filter: 'set',
            width: 58,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            pinned: 'right',
            cellRenderer: "链接渲染"
        }
    ];
    //数据缓存
    $scope.initData();

}

salemanControllers
    .controller('sale_po_purchase_header', sale_po_purchase_header)



