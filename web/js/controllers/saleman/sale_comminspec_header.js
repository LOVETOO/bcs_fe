'use strict';
var promanControllers = angular.module('inspinia');

function sale_comminspec_header($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope) {
    //继承基类方法
    sale_comminspec_header = HczyCommon.extend(sale_comminspec_header, ctrl_view_public);
    sale_comminspec_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_comminspec_header",
        key: "comminspec_id",
        nextStat: "sale_comminspec_headerEdit",
        classids: "sale_comminspec_headers",
        sqlBlock: "1=1",
        thead: [],
        postdata: {},
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    }
    $scope.headername = "商检单";
    if ($scope.$state.params.ExpandValue || $scope.$state.current.url == "/sale_comminspec_header1") {
        $scope.ExpandValue = 2;
        $scope.objconf.postdata.sqlwhere = " stat in(5,99)";
        $scope.headername = "商检单作废";
        $scope.objconf.nextStat = "sale_comminspec_headerEdit1";
    }
    /**------ 下拉框词汇值------------*/
    var promise = BasemanService.RequestPost("base_search", "searchdict", {dictcode: "stat"});
    promise.then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            $scope.viewColumns[0].cellEditorParams.values[i] = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname,
            }
        }
    });

    /**-----------------------------------*/
    /**----网格列区域  ----------*/
    $scope.viewColumns = [

        {
            headerName: "状态", field: "stat", editable: false, filter: 'set', width: 60,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "商检单编码", field: "comminspec_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "商检批号", field: "inspection_batchnos", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "出货预告", field: "warn_no", editable: false, filter: 'set', width: 80,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "合同号", field: "cpi_no", editable: false, filter: 'set', width: 80,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "AB票", field: "ab_votes", editable: false, filter: 'set', width: 80,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "启运港", field: "seaport_out_name", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "目的港", field: "seaport_in_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "价格类型名称", field: "price_type_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "商检日期", field: "comminspec_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "国家", field: "area_name", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
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

// 产品资料
promanControllers
    .controller('sale_comminspec_header', sale_comminspec_header)

