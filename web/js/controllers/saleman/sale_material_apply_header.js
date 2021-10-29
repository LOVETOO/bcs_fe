'use strict';
var salemanControllers = angular.module('inspinia');
function sale_material_apply_header($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope) {
    sale_material_apply_header = HczyCommon.extend(sale_material_apply_header, ctrl_view_public);
    sale_material_apply_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_material_apply_header",
        key: "ma_id",
        nextStat: "sale_material_apply_headerEdit",
        classids: "sale_material_apply_headers",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname:'viewOptions', idname: 'contains'}]
    }
    $scope.headername = "长线备料申请";
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
            headerName: "状态",
            field:"stat",
            editable: false,
            filter: 'set',
            width: 60,
            cellEditor:"下拉框",
            cellEditorParams:{
                values:[]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
          {
            headerName: "申请单号",
            field: "ma_no",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "申请日期",
            field: "ma_date",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor:"年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "申请部门编码",
            field: "org_code",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "申请部门名称",
            field: "org_name",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务员",
            field: "sales",
            editable: false,
            filter: 'set',
            width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "制单人",
            field: "creator",
            editable: false,
            filter: 'set',
            width: 85,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "制单时间",
            field: "create_time",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor:"时分秒",
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
            width: 100,
            cellEditor:"文本框",
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
            width: 120,
            cellEditor:"时分秒",
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
            width: 120,
            cellEditor:"文本框",
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
            width: 120,
            cellEditor:"时分秒",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "SAP订单号",
            field: "sap_no",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "是否引入SAP",
            field: "is_sap",
            editable: false,
            filter: 'set',
            width: 110,
            cellEditor: "复选框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "引SAP时间",
            field: "sap_date",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor:"时分秒",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
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
            cellRenderer:"链接渲染"
        }
        ];
    //数据缓存
    $scope.initData();

}

salemanControllers
    .controller('sale_material_apply_header', sale_material_apply_header)



