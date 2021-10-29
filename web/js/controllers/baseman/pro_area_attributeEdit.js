var billmanControllers = angular.module('inspinia');
function pro_area_attributeEdit($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {

    //继承基类方法
    pro_area_attributeEdit = HczyCommon.extend(pro_area_attributeEdit, ctrl_bill_public);
    pro_area_attributeEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "pro_area_attribute",
        key: "pro_id",
        // FrmInfo: { postdata: {flag:1}},
        FrmInfo: {},
        grids: [
            {optionname: 'options_history', idname: 'pro_area_attributes'}
        ]
    };
    //初始化界面
    var myDate = new Date();
    $scope.data = {};
    $scope.data.currItem = {
        creator: window.strUserId,
        create_time: myDate.toLocaleDateString(),

    };
    $scope.refresh_after=function () {
        var postdata={flag:1};
        BasemanService.RequestPost("pro_area_attribute", "search", postdata)
            .then(function (data) {
                $scope.gridSetData("options_history", data.pro_area_attributes);
            });
    }
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

            $scope.options_history = {
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
                    var isGrouping = $scope.options_history.columnApi.getRowGroupColumns().length > 0;
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

            $scope.columns_history = [{
                headerName: "国家",
                field: "area_name",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                width: 100,
            }, {
                headerName: "区域经理",
                field: "area_user",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                width: 100,
            }, {
                headerName: "制冷剂类型",
                field: "refrigerant",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 120,
            }, {
                headerName: "气候类型",
                field: "climate_type",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 120
            }, {
                headerName: "电压类型",
                field: "power_type",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 100
            }, {
                headerName: "低电压",
                field: "low_voltage",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 100
            }, {
                headerName: "夏季最高温度",
                field: "high_temperature",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 130
            }, {
                headerName: "冬季最低温度",
                field: "low_temperature",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 130
            }, {
                headerName: "能效",
                field: "energy",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 120
            }, {
                headerName: "产品认证法规",
                field: "certification",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                width: 180,
            }, {
                headerName: "备注",
                field: "note",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                width: 100,
            }, {
                headerName: "创建人",
                field: "creator",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 120,
            }, {
                headerName: "创建时间",
                field: "create_time",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 120
            }, {
                headerName: "更新人",
                field: "updator",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 100
            }, {
                headerName: "更新时间",
                field: "update_time",
                editable: false,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 100
            }];
        }
        $scope.save_before = function () {
            //網格不保存
            delete $scope.data.currItem.pro_area_attributes;
        }

        // {
        //     $scope.setdata = function (e) {
        //         var postdata = {flag:1};
        //         BasemanService.RequestPost("pro_area_attribute", "search", postdata)
        //             .then(function (data) {
        //                 $scope.gridSetData("options_history", data.pro_area_attributes);
        //             });
        //         for (name in e.data) {
        //             $scope.data.currItem[name] = e.data[name];
        //         }
        //     }
        // }
    }
    $scope.initdata();
}//加载控制器
billmanControllers
    .controller('pro_area_attributeEdit', pro_area_attributeEdit)

