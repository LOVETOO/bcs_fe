var billmanControllers = angular.module('inspinia');
function sale_std_priceapply_cancel($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {

    //继承基类方法
    sale_std_priceapply_cancel = HczyCommon.extend(sale_std_priceapply_cancel, ctrl_bill_public);
    sale_std_priceapply_cancel.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_std_priceapply_header",
        key: "price_apply_id",
        wftempid: 10062,
        FrmInfo: {},
        grids: [
            {
                optionname: 'view_options',
                idname: 'sale_std_priceapply_lineofsale_std_priceapply_headers',
            }
        ]
    };


    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        var datas=[];
        for (var i = 0; i < data.dicts.length; i++) {
            datas[i] = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
        }
        $scope.view_columns[$scope.getIndexByField("view_columns", "stat")].cellEditorParams.values=datas;
    })

    $scope.search = function (e) {
        try {
            if (e) e.currentTarget.disabled = true;
            var postdata = {}
            if ($scope.data.currItem.item_id > 0) {
                postdata.item_id = $scope.data.currItem.item_id
            }
            if ($scope.data.currItem.start_date != undefined) {
                postdata.start_date = $scope.data.currItem.start_date
            }
            if ($scope.data.currItem.end_date != undefined) {
                postdata.end_date = $scope.data.currItem.end_date
            }
            BasemanService.RequestPost("sale_std_priceapply_header", "getcancellist", postdata).then(function (data) {
                $scope.gridSetData("view_options", data.sale_std_priceapply_lineofsale_std_priceapply_headers);
            })
        } catch (error) {
            BasemanService.notice(error.message)
        }finally {
            if (e) e.currentTarget.disabled = false;
        }
    };

    $scope.cancel = function (e) {
        try {
            if (e) e.currentTarget.disabled = true;
            var datas = $scope.selectGridGetData("view_options");
            var j = 0
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].stat == "99") {
                    continue;
                }
                var obj = BasemanService.RequestPostNoWait("sale_std_priceapply_header", "cancel", {
                    price_apply_id: datas[i].price_apply_id,
                    item_id: datas[i].item_id,
                })
                if(obj.pass){
                    datas[i].stat="99"
                }
            }
            $scope["view_options"].api.refreshView()
        } catch (error) {
            BasemanService.notice(error.message)
        }finally {
            if (e) e.currentTarget.disabled = false;
        }
    };

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

        //view_options
        {
            $scope.view_options = {
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
                    var isGrouping = $scope.view_options.columnApi.getRowGroupColumns().length > 0;
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

            $scope.view_columns = [
                {
                    headerName: "序号",
                    field: "seq",
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    pinned: "left",
                    width: 60,
                    checkboxSelection: function (params) {
                        return params.columnApi.getRowGroupColumns().length == 0
                    },
                }, {
                    headerName: "状态",
                    field: "stat",
                    editable: false,
                    filter: 'set',
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 60,
                    cellEditorParams: {
                        values: [],
                    },
                }, {
                    headerName: "申请单号",
                    field: "price_apply_no",
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 120,
                }, {
                    headerName: "工厂型号编码",
                    field: "item_code",
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 125,
                }, {
                    headerName: "工厂型号",
                    field: "item_name",
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 220
                }, {
                    headerName: "起始日期",
                    field: "start_date",
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 120
                }, {
                    headerName: "结束日期",
                    field: "end_date",
                    editable: false,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 120
                },  {
                    headerName: "工厂标准结算价(美元)",
                    field: "base_price",
                    editable: true,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 130
                }];

        }
    }

    {
        //Item_Code
        $scope.Item_Code = function () {
            $scope.FrmInfo = {
                classid: "pro_item_header",
                postdata: {},
                sqlBlock: " usable=2 ",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                if (result.item_h_id == undefined) {
                    return;
                }
                $scope.data.currItem.item_id = result.item_h_id;
                $scope.data.currItem.item_code = result.item_h_code;
                $scope.data.currItem.item_name = result.item_h_name;
            });
        }
    }

    $scope.clearinformation = function () {
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.create_time = new Date();
        $scope.data.currItem.creator = window.userbean.userid;
    }

    $scope.initdata();
}//加载控制器
billmanControllers
    .controller('sale_std_priceapply_cancel', sale_std_priceapply_cancel)

