'use strict';
var promanControllers = angular.module('inspinia');
function pro_item_header($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope) {
    pro_item_header = HczyCommon.extend(pro_item_header, ctrl_view_public);
    pro_item_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "pro_item_header",
        key: "item_h_id",
        nextStat: "pro_item_headerEdit",
        classids: "pro_item_headers",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    }
    $scope.headername = "标准机型维护";
    $scope.hide="true";
    /**------ 下拉框词汇值------------*/
    //机型分类
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "item_type"})
        .then(function (data) {
            var item_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                item_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'item_type')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'item_type')].cellEditorParams.values = item_types;
            }
        });
    //机型详细分类
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "typefl"})
        .then(function (data) {
            var protypes = [];
            for (var i = 0; i < data.dicts.length; i++) {
                protypes[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'protype')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'protype')].cellEditorParams.values = protypes;
            }
        });
    //冷量
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
    //面板
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "mb_stand"})
        .then(function (data) {
            var mb_stands = [];
            for (var i = 0; i < data.dicts.length; i++) {
                mb_stands[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'mb_stand')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'mb_stand')].cellEditorParams.values = mb_stands;
            }
        });
    /**----网格列区域  ----------*/
    /**网格配置*/
    $scope.viewColumns = [
        {
            headerName: "序号", field: "queue", editable: false, filter: 'set', width: 60,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "状态",
            field: "spectrum_stat",
            width: 100,
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
        }, {
            headerName: "整机编码",
            field: "item_h_code",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "整机描述",
            field: "item_h_name",
            editable: false,
            filter: 'set',
            width: 160,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        },
         {
            headerName: "款式",
            field: "mb_stand",
            width: 85,
            editable: false,
            filter: 'set',
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "是否可用",
            field: "usable",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "复选框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
        }, {
            headerName: "机型分类",
            field: "item_type",
            width: 100,
            editable: false,
            filter: 'set',
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "大类编码",
            field: "item_type_no",
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
            headerName: "大类名称",
            field: "item_type_name",
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
            headerName: "机型详细分类",
            field: "protype",
            width: 110,
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
            headerName: "工况",
            field: "gk",
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
            headerName: "制冷剂",
            field: "refrigerant",
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
            headerName: "定/变频",
            field: "power_frequency",
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
            headerName: "电源",
            field: "power",
            width: 85,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        }, {
            headerName: "内机平台",
            field: "item_platform",
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
            headerName: "冷暖类型",
            field: "cool_type",
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
            headerName: "制冷能力",
            field: "cool_ability",
            width: 100,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }
        , {
            headerName: "制冷量",
            field: "item_cool",
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
            headerName: "适用面板",
            field: "stand_conf",
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
            headerName: "EER",
            field: "eer",
            width: 85,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        }, {
            headerName: "制热量",
            field: "item_hot",
            width: 85,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        }, {
            headerName: "内机噪音",
            field: "voice",
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
            headerName: "塑壳",
            field: "molded_case",
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
            headerName: "认证",
            field: "authen",
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
            headerName: "内机风量",
            field: "in_air",
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
            headerName: "外机平台",
            field: "standinfo",
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
            headerName: "创建人",
            field: "creator",
            width: 85,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        }, {
            headerName: "创建时间",
            field: "create_time",
            width: 100,
            editable: false,
            filter: 'set',
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        }, {
            headerName: "修改时间",
            field: "update_time",
            width: 120,
            editable: false,
            filter: 'set',
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "最后修改用户",
            field: "updator",
            width: 110,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "外机连接管长度",
            field: "conn_length",
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
            headerName: "是否含连接线",
            field: "sfljx",
            width: 110,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "截止阀规格",
            field: "jzfgg",
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
            headerName: "额定制冷量标准值",
            field: "item_cool_bzz",
            width: 120,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        }, {
            headerName: "额定制热冷量标准值",
            field: "eer_bzz",
            width: 130,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        }, {
            headerName: "EER标准值",
            field: "item_hot_bzz",
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
            headerName: "COP标准值",
            field: "cop_bzz",
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
            headerName: "电源连接线长度",
            field: "dyljxcd",
            width: 110,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "是否外机供电",
            field: "sfwjgd",
            width: 100,
            editable: false,
            filter: 'set',
            cellEditor: "复选框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "装箱量",
            field: "trait_value1",
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
            headerName: "灯显示颜色",
            field: "trait_value2",
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
            headerName: "遥控器",
            field: "trait_value3",
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
            headerName: "外机噪音",
            field: "trait_value4",
            width: 100,
            editable: false,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }
        , {
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
        }, {
            headerName: "规划时间",
            field: "plan_time",
            width: 100,
            editable: false,
            filter: 'set',
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false,
        }, {
            headerName: "计划可接单时间",
            field: "order_time",
            width: 140,
            editable: false,
            filter: 'set',
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
            headerName: "实际接单时间",
            field: "actual_time",
            width: 140,
            editable: false,
            filter: 'set',
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide: false
        }, {
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
    .controller('pro_item_header', pro_item_header)



