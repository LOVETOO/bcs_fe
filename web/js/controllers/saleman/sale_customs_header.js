'use strict';
var salemanControllers = angular.module('inspinia');
function sale_customs_header($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_customs_header",
        key: "customs_id",
        nextStat: "sale_customs_headerEdit",
        classids: "sale_customs_headers",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };
    $scope.headername="报关单";
    sale_customs_header = HczyCommon.extend(sale_customs_header, ctrl_view_public);
    sale_customs_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    /**------ 下拉框词汇值------------*/
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
    //贸易类型
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
            width: 130,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "出货预告号",
            field: "warn_no",
            editable: false,
            filter: 'set',
            width: 130,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "合同号",
            field: "cpi_no",
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
            headerName: "商检批号",
            field: "inspection_batchnos",
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
            headerName: "合同号",
            field: "contract_no",
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
            headerName: "发货单号",
            field: "notice_no",
            editable: false,
            filter: 'set',
            width: 130,
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
            width: 150,
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
            width: 130,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "价格类型名称",
            field: "price_type_name",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "所在国家名称",
            field: "area_name",
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
            headerName: "客户名称",
            field: "cust_name",
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
            headerName: "客户编码",
            field: "cust_code",
            editable: false,
            filter: 'set',
            width: 130,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "报关总数量",
            field: "total_qty",
            editable: false,
            filter: 'set',
            width: 130,
            cellEditor:"整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "报关总金额",
            field: "total_amt",
            editable: false,
            filter: 'set',
            width: 130,
            cellEditor:"浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "报关单号",
            field: "customs_code",
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
            headerName: "区域名称",
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
            headerName: "创建时间",
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
            headerName: "创建人",
            field: "creator",
            editable: false,
            filter: 'set',
            width: 130,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "报关日期",
            field: "customs_date",
            editable: false,
            filter: 'set',
            width: 130,
            cellEditor:"年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "退单日期",
            field: "customs_step_date",
            editable: false,
            filter: 'set',
            width: 130,
            cellEditor:"年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "修改时间",
            field: "update_time",
            editable: false,
            filter: 'set',
            width: 130,
            cellEditor:"时分秒",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "修改人",
            field: "updator",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor:"文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "审核人",
            field: "checkor",
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
            headerName: "审核时间",
            field: "check_time",
            editable: false,
            filter: 'set',
            width: 130,
            cellEditor:"时分秒",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "贸易类型",
            field: "sale_ent_type",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor:"下拉框",
            cellEditorParams: {
                values: []
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "产品大类名称",
            field: "item_type_name",
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
            headerName: "货币",
            field: "currency_code",
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
salemanControllers
    .controller('sale_customs_header', sale_customs_header);



