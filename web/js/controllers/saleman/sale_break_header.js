'use strict';
var promanControllers = angular.module('inspinia');

function sale_break_header($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope) {
    sale_break_header = HczyCommon.extend(sale_break_header, ctrl_view_public);
    sale_break_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_break_header",
        key: "break_id",
        nextStat: "sale_break_headerEdit",
        classids: "sale_break_headers",
        postdata: {},
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]

    }
    $scope.headername = "打散方案查询";

    if ($scope.$state.params.ExpandValue || $scope.$state.current.url == "/sale_break_header1") {
        $scope.ExpandValue = 2;
        $scope.objconf.postdata.sqlwhere = " stat in(5,99)";
        $scope.headername = "打散方案作废查询";
        $scope.hide=true;
        $scope.objconf.nextStat = "sale_break_headerEdit1";
    }

    /**-----------------------------------*/
    /**----网格列区域  ----------*/
    $scope.viewColumns = [
        {
            headerName: "状态",
            field: "stat",
            editable: false,
            filter: 'set',
            width: 60,
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
            headerName: "方案号",
            field: "break_id",
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
            headerName: "方案名称",
            field: "break_name",
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
            headerName: "区域编码",
            field: "area_codes",
            editable: false,
            filter: 'set',
            width: 80,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "国家",
            field: "area_names",
            editable: false,
            filter: 'set',
            width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分类编码",
            field: "class_codes",
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
            headerName: "机型分类",
            field: "class_names",
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
        },
        {
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
        },
        {
            headerName: "装配规则",
            field: "assembly_name",
            editable: false,
            filter: 'set',
            width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "注意事项",
            field: "precautions",
            editable: false,
            filter: 'set',
            width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户要求",
            field: "cust_note",
            editable: false,
            filter: 'set',
            width: 200,
            cellEditor: "文本框",
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
            width: 200,
            cellEditor: "文本框",
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
            headerName: "更新人",
            field: "updator",
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
        }];

    //数据缓存
    $scope.initData();

}

// 产品资料
promanControllers
    .controller('sale_break_header', sale_break_header)
