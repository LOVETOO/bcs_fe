var basemanControllers = angular.module('inspinia');
function sale_package_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_package_header",
        key: "package_id",
        nextStat: "sale_package_headerEdit",
        classids: "sale_package_headers",
        sqlBlock: "1=1",
        postdata: {},
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };

    $scope.headername = "包装方案查询";
    sale_package_header = HczyCommon.extend(sale_package_header, ctrl_view_public);
    sale_package_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    if ($scope.$state.params.ExpandValue || $scope.$state.current.url == "/sale_package_header1") {
        $scope.ExpandValue = 2;
        $scope.objconf.postdata.sqlwhere = " stat in(5,99)";
        $scope.headername = "包装方案作废";
        $scope.objconf.nextStat = "sale_package_headerEdit1";
        $scope.hide="true";
    }
    //$sco

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
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "package_ware"})
        .then(function (data) {
            var package_wares = [];
            for (var i = 0; i < data.dicts.length; i++) {
                package_wares[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'package_ware')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'package_ware')].cellEditorParams.values = package_wares;
            }
        });
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "package_ware"})
        .then(function (data) {
            var package_wares = [];
            for (var i = 0; i < data.dicts.length; i++) {
                package_wares[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'package_factory')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'package_factory')].cellEditorParams.values = package_wares;
            }
        });
    /**-----------------------------------*/
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
            headerName: "状态", field: "stat", editable: false, filter: 'set', width: 60,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "创建时间", field: "create_time", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "方案号", field: "package_id", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "方案名称", field: "package_name", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料编码", field: "item_code", editable: false, filter: 'set', width: 140,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料描述", field: "item_desc", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单位", field: "item_uom", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包装方式", field: "package_desc", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "BOM包类型", field: "package_ware", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "包装工厂", field: "package_factory", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产类型", field: "made_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 1, desc: '外购件'}, {value: 2, desc: '自制件'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "方案类型", field: "pack_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: '内箱',
            children: [
                {
                    headerName: "原包装数量", field: "inner_qty", editable: false, filter: 'set', width: 100,
                    tooltipField: 'gameName',
                    cellClass: function () {
                        return 'alphabet';
                    },
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    icons: {
                        sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
                        sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
                    }
                }, {
                    headerName: "包装箱编码", field: "inner_code", editable: false, filter: 'set', width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "箱型名称", field: "inner_desc", editable: false, filter: 'set', width: 170,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "长", field: "inner_long", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "宽", field: "inner_wide", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "高", field: "inner_high", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }
            ]
        }, {
            headerName: '外箱',
            children: [
                {
                    headerName: "原包装数量", field: "out_qty", editable: false, filter: 'set', width: 100,
                    tooltipField: 'gameName',
                    cellClass: function () {
                        return 'alphabet';
                    },
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "包装箱编码", field: "out_code", editable: false, filter: 'set', width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "箱型名称", field: "out_desc", editable: false, filter: 'set', width: 200,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "长", field: "out_long", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                },
                {
                    headerName: "宽", field: "out_wide", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "高", field: "out_high", editable: false, filter: 'set', width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }
            ]
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
//加载控制器
basemanControllers
    .controller('sale_package_header', sale_package_header);

