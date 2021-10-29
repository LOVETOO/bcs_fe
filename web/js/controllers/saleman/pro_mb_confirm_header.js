'use strict';
var salemanControllers = angular.module('inspinia');
function pro_mb_confirm_header($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope) {
    pro_mb_confirm_header = HczyCommon.extend(pro_mb_confirm_header, ctrl_view_public);
    pro_mb_confirm_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "pro_mb_confirm_header",
        key: "confirm_id",
        nextStat: "pro_mb_confirm_headerEdit",
        classids: "pro_mb_confirm_headers",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    }
    $scope.headername = "销售面板";
    $scope.hide=true;

    /**------ 下拉框词汇值------------*/
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "wfflag"})
    .then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            $scope.viewColumns[0].cellEditorParams.values[i] = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
        }
    });

    /**-----------------------------------*/
    /**----网格列区域  ----------*/
    $scope.viewColumns = [
        {
            headerName: "状态",
            field:"stat",
            editable: false,
            filter: 'set',
            width: 85,
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
            headerName: "单号",
            field: "confirm_no",
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
            headerName: "申请人",
            field: "creator",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor:"文本框",
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
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "失效时间",
            field: "due_time",
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
            headerName: "申请类型",
            field: "apply_type",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor:"文本框",
            // cellEditorParams: {
            //     values: [{value: 1, desc: '新增机型'}, {value: 2, desc: '临时方案申请'}, {value: 3, desc: '选配库完善'}]
            // },
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
            width: 100,
            cellEditor:"年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "更新人",
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
            headerName: "更新时间",
            field: "update_time",
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
            headerName: "对应单号",
            field: "bill_no",
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
            headerName: "确认信息",
            field: "note",
            editable: false,
            filter: 'set',
            width: 220,
            cellEditor:"文本框",
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
    .controller('pro_mb_confirm_header', pro_mb_confirm_header)



