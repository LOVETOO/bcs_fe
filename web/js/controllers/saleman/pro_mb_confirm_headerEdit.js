var billmanControllers = angular.module('inspinia');
function pro_mb_confirm_headerEdit($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {

    //继承基类方法
    pro_mb_confirm_headerEdit = HczyCommon.extend(pro_mb_confirm_headerEdit, ctrl_bill_public);
    pro_mb_confirm_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "pro_mb_confirm_header",
        key: "confirm_id",
        wftempid:10159,
        // FrmInfo: { postdata: {flag:1}},
        FrmInfo: {},
        grids: [
            {optionname: 'options_8', idname: 'pro_mb_confirm_lineofpro_mb_confirm_headers'}
        ]
    };
    //初始化界面
    var myDate = new Date();
    $scope.data = {};
    $scope.data.currItem = {
        creator: window.strUserId,
        create_time: myDate.toLocaleDateString(),

    };
    //下拉框
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.wfflag = data.dictcode;
            $scope.stats = HczyCommon.stringPropToNum(data.dicts);
        });

    $scope.selectarea = function () {
        $scope.FrmInfo = {
            title: "国家",
            is_custom_search:true,
            is_high: true,
            thead: [
                {
                    name: "地区编码",
                    code: "areacode",
                    show: true,
                    iscond: true,
                    type: 'string'

                }, {
                    name: "地区名称",
                    code: "areaname",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "助记码",
                    code: "assistcode",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "电话区号",
                    code: "telzone",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "邮政编码",
                    code: "postcode",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "备注",
                    code: "note",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            classid: "scparea",
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
            $scope.data.currItem.area_id = result.areaid;
            $scope.data.currItem.area_code = result.areacode;
            $scope.data.currItem.area_name = result.telzone;
        });
    }
    /**网格配置*/
    {
        //分组功能
        var groupColumn = {
            headerName: "Group",
            width: 200,
            field: 'name',
            valueGetter: function (params) {
                if (params.node.group) {
                    return params.node.key;
                } else {
                    return params.data[params.colDef.field];
                }
            },
            comparator: agGrid.defaultGroupComparator,
            cellRenderer: 'group',
            cellRendererParams: function (params) {
            }
        };

        //itemline_options
        {

            $scope.options_8 = {
                rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
                pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
                groupKeys: undefined,
                groupHideGroupColumns: false,
                enableColResize: true, //one of [true, false]
                enableSorting: true, //one of [true, false]
                enableFilter: true, //one of [true, false]
                enableStatusBar: false,
                enableRangeSelection: true,
                rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
                rowDeselection: false,
                quickFilterText: null,
                rowClicked: $scope.itemline_rowClicked,
                groupSelectsChildren: false, // one of [true, false]
                suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
                groupColumnDef: groupColumn,
                showToolPanel: false,
                checkboxSelection: function (params) {
                    var isGrouping = $scope.options_8.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                },
                getRowHeight: function (params) {
                    if (params.data.rowHeight == undefined) {
                        params.data.rowHeight = 25;
                    }
                    return params.data.rowHeight;
                }
            };

            $scope.columns_8 = [{
                headerName: "机型类型",
                field: "item_type",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                width: 100,
            }, {
                headerName: "机型编码",
                field: "item_h_code",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                width: 100,
            }, {
                headerName: "机型名称",
                field: "item_h_name",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 120,
            }, {
                headerName: "数量",
                field: "qty",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 80
            }, {
                headerName: "国家",
                field: "area_name",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 100
            }, {
                headerName: "面板款式",
                field: "mb_style",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 100
            }, {
                headerName: "面板颜色",
                field: "mb_color",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 130
            }, {
                headerName: "装饰条颜色",
                field: "mb_article",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 130
            }];
        }
        $scope.save_before = function () {
            //網格不保存
            delete $scope.data.currItem.pro_area_attributes;
        }
    }
    $scope.initdata();
}//加载控制器
billmanControllers
    .controller('pro_mb_confirm_headerEdit', pro_mb_confirm_headerEdit)

