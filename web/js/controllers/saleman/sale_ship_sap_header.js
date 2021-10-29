'use strict';
var salemanControllers = angular.module('inspinia');

function sale_ship_sap_header($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope) {
    sale_ship_sap_header = HczyCommon.extend(sale_ship_sap_header, ctrl_view_public);
    sale_ship_sap_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_ship_sap_header",
        key: "ship_id",
        nextStat: "sale_ship_sap_headerEdit",
        classids: "sale_ship_sap_headers",
        sqlBlock: "1=1",
        postata:{wfflag:2},
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    }
    $scope.headername = "手工录入发货单对应的90凭证";
    /**------ 下拉框词汇值------------*/
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "stat"})
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
            headerName: "凭证NO",
            field: "ship_no",
            editable: false,
            filter: 'set',
            width: 140,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "开票时间",
            field: "kaip_date",
            editable: false,
            filter: 'set',
            width: 110,
            cellEditor: "年月日",
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
            width: 70,
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
            width: 110,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发货单号",
            field: "notice_no",
            editable: false,
            filter: 'set',
            width: 140,
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
            width: 120,
            cellEditor: "文本框",
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
            // pinned: 'right',
            cellRenderer:"链接渲染"
        }];

    //数据缓存
    $scope.initData();

}

// 产品资料
salemanControllers
    .controller('sale_ship_sap_header', sale_ship_sap_header);



