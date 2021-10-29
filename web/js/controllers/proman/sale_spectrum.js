'use strict';
var promanControllers = angular.module('inspinia');
function sale_spectrum($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope) {
    sale_spectrum = HczyCommon.extend(sale_spectrum, ctrl_view_public);
    sale_spectrum.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_spectrum",
        key: "spectrum_id",
        nextStat: "sale_spectrumEdit",
        classids: "sale_spectrums",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    }
    //contains
    $scope.headername = "销售型谱维护";
    /**----网格列区域  ----------*/
    /**网格配置*/
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
            field: "spectrum_stat",
            width: 85,
            editable: false,
            filter: 'set',
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: '在售'}, {value: 2, desc: '预警'}, {value: 3, desc: '冻结'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        },
        {
            headerName: "大区",
            field: "area_name",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "业务部",
            field: "org_name",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            headerName: "业务提案人",
            field: "sale_man",
            width: 100,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "整机型号",
            field: "item_h_name",
            width: 200,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "整机编码",
            field: "item_h_code",
            width: 130,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "规划时间",
            field: "plan_time",
            width: 100,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        }, {
            headerName: "产品类别",
            field: "item_type",
            width: 100,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        }, {
            headerName: "定/变频",
            field: "is_hz",
            width: 100,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        }, {
            headerName: "冷量",
            field: "cold",
            width: 85,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "款式",
            field: "style",
            width: 85,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "内机平台",
            field: "n_class",
            width: 85,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "外机平台",
            field: "w_class",
            width: 85,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "冷凝器规格",
            field: "condenser",
            width: 110,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        }, {
            headerName: "压缩机",
            field: "compressor",
            width: 100,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        },
        {
            headerName: "海外企划书编号",
            field: "project_number",
            width: 140,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        },
        {
            headerName: "计划可接单时间",
            field: "order_time",
            width: 140,
            editable: false,
            filter: 'set',
            cellEditor: "时分秒",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        },
        {
            headerName: "实际接单时间",
            field: "actual_time",
            width: 140,
            editable: false,
            filter: 'set',
            cellEditor: "时分秒",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        },
        {
            headerName: "销量",
            field: "qty",
            width: 85,
            editable: false,
            filter: 'set',
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
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
    .controller('sale_spectrum', sale_spectrum)



