'use strict';
var promanControllers = angular.module('inspinia');
function pro_new_products($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope) {
    pro_new_products = HczyCommon.extend(pro_new_products, ctrl_view_public);
    pro_new_products.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "pro_new_products",
        key: "new_products_id",
        nextStat: "pro_new_productsEdit",
        classids: "pro_new_productss",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };
    $scope.headername = "机型新品维护";
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cool_stand"})
        .then(function (data) {
            var cool_stands = [];
            for (var i = 0; i < data.dicts.length; i++) {
                cool_stands[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'cool_stand')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'cool_stand')].cellEditorParams.values = cool_stands;
            }
        });
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
            headerName: "单号",
            field: "new_products_code",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
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
            headerName: "国家",
            field: "country",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            headerName: "新品项目描述",
            field: "product_name",
            width: 120,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "产品编码",
            field: "item_code",
            width: 120,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "产品类别",
            field: "item_type_name",
            width: 100,
            editable: true,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        }, {
            headerName: "产品类别编码",
            field: "item_type_no",
            width: 120,
            editable: true,
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
            editable: true,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        }, {
            headerName: "冷量",
            field: "cool_stand",
            width: 85,
            editable: false,
            filter: 'set',
            cellEditor: "下拉框",
            cellEditorParams: {
                values: []
            },
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
            field: "nclass_code",
            width: 85,
            editable: true,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "外机平台",
            field: "wclass_code",
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
            field: "cool_spec",
            width: 110,
            editable: true,
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
            editable: true,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        },
        {
            headerName: "参考机型编码",
            field: "ref_item_code",
            width: 100,
            editable: true,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        },
        {
            headerName: "参考机型描述",
            field: "ref_item_name",
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
            headerName: "标准价",
            field: "base_price",
            width: 140,
            editable: false,
            filter: 'set',
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        },
        {
            headerName: "结算价",
            field: "settle_price",
            width: 140,
            editable: false,
            filter: 'set',
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        },
        {
            headerName: "指导价",
            field: "guide_price",
            width: 85,
            editable: false,
            filter: 'set',
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        },
        {
            headerName: "创建时间", field: "create_time", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "创建人", field: "creator", editable: false, filter: 'set', width: 100,
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
    .controller('pro_new_products', pro_new_products)



