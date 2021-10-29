'use strict';
var promanControllers = angular.module('inspinia');

function sale_customsZZ_header($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope) {
    sale_customsZZ_header = HczyCommon.extend(sale_customsZZ_header, ctrl_view_public);
    sale_customsZZ_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_customs_header",
        key: "customs_id",
        nextStat: "sale_customsZZ_headerEdit",
        classids: "sale_customs_headers",
        sqlBlock: "1=1",
        thead: [],
        postdata:{
            sqlwhere:" bill_type=2 and stat=5 "
        },
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    }

    $scope.hide=true;
    $scope.headername = "预报关单转正";
    if ($scope.$state.current.url == "/sale_customsDJ_header") {
        $scope.ExpandValue = 1;
        $scope.objconf.postdata.sqlwhere = "stat  in (2,3,4,5) and bill_type=1 ";
        $scope.headername = "登记报关单号";
        $scope.objconf.nextStat = "sale_customsDJ_headerEdit";
    }

    /**------ 下拉框词汇值------------*/
    var promise = BasemanService.RequestPost("base_search", "searchdict", {dictcode: "stat"});
    promise.then(function (data) {
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
            headerName: "报关单编码",
            field: "customs_no",
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
            headerName: "出货预告",
            field: "warn_no",
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
            headerName: "发货单号",
            field: "notice_no",
            editable: false,
            filter: 'set',
            width: 80,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "商检批号",
            field: "inspection_batchnos",
            editable: false,
            filter: 'set',
            width: 200,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "AB票",
            field: "ab_votes",
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
            headerName: "出货港名称",
            field: "seaport_out_name",
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
            headerName: "到货港名称",
            field: "seaport_in_name",
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
            headerName: "客户名称",
            field: "cust_name",
            editable: false,
            filter: 'set',
            width: 200,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "所在国家名称",
            field: "area_name",
            editable: false,
            filter: 'set',
            width: 200,
            cellEditor:"文本框",
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
            cellRenderer:"链接渲染"
        }];

    //数据缓存
    $scope.initData();

}

// 产品资料
promanControllers
    .controller('sale_customsZZ_header', sale_customsZZ_header)



