var billmanControllers = angular.module('inspinia');
function sale_ship_notice_m_headerEdit($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {

    //继承基类方法
    sale_ship_notice_m_headerEdit = HczyCommon.extend(sale_ship_notice_m_headerEdit, ctrl_bill_public);
    sale_ship_notice_m_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_ship_notice_m_header",
        key: "notice_m_id",
        wftempid: 10045,
        FrmInfo: {},
        grids: [{//产品明细
            optionname: 'itemoptions',
            idname: 'sale_ship_m_item_lineofsale_ship_notice_m_headers'
        }
        ]
    };
    //出货预告
    $scope.notice_no = function () {
        $scope.FrmInfo = {
            classid:"sale_ship_notice_header",
            sqlBlock: ' sale_ship_notice_header.stat = 5 '
            + ' and not exists (select 1 from sale_ship_notice_m_header mh where mh.notice_id=sale_ship_notice_header.notice_id'
            + '     and mh.stat < 5 )',
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (data) {
            if (data.notice_id == undefined) {
                return;
            }
            BasemanService.RequestPost("sale_ship_notice_header", "select", {notice_id: data.notice_id}).then(function (data) {
                delete data.wfid;
                delete data.wfflag;
                delete data.stat;
                delete data.creator;
                delete data.create_time;
                delete data.updator;
                delete data.update_time;
                delete data.checkor;
                delete data.check_time;
                HczyCommon.stringPropToNum(data);
                for (var name in data) {
                    if (data[name] instanceof Array) {
                        continue;
                    }
                    $scope.data.currItem[name] = data[name];
                }
                $scope.data.currItem.sale_ship_m_item_lineofsale_ship_notice_m_headers = data.sale_ship_item_lineofsale_ship_notice_headers;
                $scope.data.currItem.sale_ship_m_item_h_lineofsale_ship_notice_m_headers = data.sale_ship_item_h_lineofsale_ship_notice_headers;
                $scope.setitemline1($scope.data.currItem);
            })
        })
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


        //itemoptions
        {
            //itemoptions,根据是否是空白行，判断列的可编辑

            $scope.itemoptions = {
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
                rowClicked: undefined,
                groupSelectsChildren: false, // one of [true, false]
                suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
                groupColumnDef: groupColumn,
                showToolPanel: false,
                checkboxSelection: function (params) {
                    var isGrouping = $scope.itemoptions.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                }
            };


            $scope.moveto = function () {
                $scope["itemoptions"].api.ensureColumnVisible("saleorder_type")
                $scope["itemoptions"].api.setFocusedCell(0, "saleorder_type");
            }

          $scope.itemcolumns = [
                 {
                     headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
                     cellEditor: "文本框",
                     enableRowGroup: true,
                     enablePivot: true,
                     enableValue: true,
                     floatCell: true,
                 },
                 {
                     headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 120,
                     cellEditor: "文本框",
                     enableRowGroup: true,
                     enablePivot: true,
                     enableValue: true,
                     floatCell: true
                 },
                 {
                     headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 150,
                     cellEditor: "文本框",
                     enableRowGroup: true,
                     enablePivot: true,
                     enableValue: true,
                     floatCell: true
                 },
                 {
                     headerName: "机型类别", field: "pro_type", editable: false, filter: 'set', width: 100,
                     cellEditor: "下拉框",
                     cellEditorParams: {values: []},
                     enableRowGroup: true,
                     enablePivot: true,
                     enableValue: true,
                     floatCell: true
                },{
                     headerName: "生产单号", field: "prod_no", editable: false, filter: 'set', width: 120,
                     cellEditor: "文本框",
                     enableRowGroup: true,
                     enablePivot: true,
                     enableValue: true,
                     floatCell: true
                 },
                 {
                    headerName: "柜型", field: "box_type", editable: false, filter: 'set', width: 80,
                    cellEditor: "下拉框",
                    cellEditorParams: {values: []},
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                  },
                 {
                    headerName: "类型", field: "line_type", editable: false, filter: 'set', width: 80,
                    cellEditor: "下拉框",
                    cellEditorParams: {values: []},
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                  }, {
                     headerName: "客户机型", field: "cust_item_name", editable: false, filter: 'set', width: 100,
                     cellEditor: "文本框",
                     enableRowGroup: true,
                     enablePivot: true,
                     enableValue: true,
                     floatCell: true
                 },{
                     headerName: "型号", field: "spec", editable: false, filter: 'set', width: 100,
                     cellEditor: "文本框",
                     enableRowGroup: true,
                     enablePivot: true,
                     enableValue: true,
                     floatCell: true
                 },
                 {
                     headerName: "Erp产品编码", field: "erp_code", editable: false, filter: 'set', width: 140,
                     cellEditor: "文本框",
                     enableRowGroup: true,
                     enablePivot: true,
                     enableValue: true,
                     floatCell: true
                 }, {
                     headerName: "工厂型号编码", field: "item_code", editable: false, filter: 'set', width: 120,
                     cellEditor: "文本框",
                     enableRowGroup: true,
                     enablePivot: true,
                     enableValue: true,
                     floatCell: true
                 },
                 {
                     headerName: "工厂型号", field: "item_name", editable: false, filter: 'set', width: 120,
                     cellEditor: "文本框",
                     enableRowGroup: true,
                     enablePivot: true,
                     enableValue: true,
                     floatCell: true
                 },
                 {
                     headerName: "产品简称", field: "item_short_name", editable: false, filter: 'set', width: 120,
                     cellEditor: "文本框",
                     enableRowGroup: true,
                     enablePivot: true,
                     enableValue: true,
                     floatCell: true
                 },
                 {
                     headerName: "参考柜号", field: "ref_box_no", editable: false, filter: 'set', width: 100,
                     cellEditor: "文本框",
                     enableRowGroup: true,
                     enablePivot: true,
                     enableValue: true,
                     floatCell: true
                 },
                 {
                     headerName: "实际柜号", field: "actual_box_no", editable: false, filter: 'set', width: 100,
                     cellEditor: "文本框",
                     enableRowGroup: true,
                     enablePivot: true,
                     enableValue: true,
                     floatCell: true
                 },
                 {
                     headerName: "装柜数量", field: "qty", editable: false, filter: 'set', width: 85,
                     cellEditor: "整数框",
                     enableRowGroup: true,
                     enablePivot: true,
                     enableValue: true,
                     floatCell: true
                 },{
                     headerName: "已发货确认数量", field: "actual_out_qty", editable: false, filter: 'set', width: 160,
                     cellEditor: "整数框",
                     enableRowGroup: true,
                     enablePivot: true,
                     enableValue: true,
                     floatCell: true
                 }, {
                     headerName: "备注", field: "note", editable: true, filter: 'set', width: 100,
                     cellEditor: "文本框",
                     enableRowGroup: true,
                     enablePivot: true,
                     enableValue: true,
                     floatCell: true
                 }];
        }
    }

    /**系统词汇*/
    {

        //订单类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "sale_order_type"})
            .then(function (data) {
                $scope.sale_order_types=data.dicts
            });

        //需要查询--贸易类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"})
            .then(function (data) {
                $scope.sale_ent_types = data.dicts;
            });

        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "ship_type"}).then(function (data) {
            $scope.ship_types = HczyCommon.stringPropToNum(data.dicts);
        });

        //行类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "line_type"})
            .then(function (data) {
                var line_types = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    line_types[i] = {
                        value: data.dicts[i].dictvalue,
                        desc: data.dicts[i].dictname
                    }
                }
                if ($scope.getIndexByField('itemcolumns', 'line_type')) {
                    $scope.itemcolumns[$scope.getIndexByField('itemcolumns', 'line_type')].cellEditorParams.values = line_types;
                }
         });
        //柜型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "box_type"})
            .then(function (data) {
                var box_types = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    box_types[i] = {
                        value: data.dicts[i].dictvalue,
                        desc: data.dicts[i].dictname
                    }
                }
                if ($scope.getIndexByField('itemcolumns', 'box_type')) {
                    $scope.itemcolumns[$scope.getIndexByField('itemcolumns', 'box_type')].cellEditorParams.values = box_types;
                }
         });
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pro_type"})
            .then(function (data) {
                var pro_types = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    pro_types[i] = {
                        value: data.dicts[i].dictvalue,
                        desc: data.dicts[i].dictname
                    };
                }
                if ($scope.getIndexByField('itemcolumns', 'pro_type')) {
                    $scope.itemcolumns[$scope.getIndexByField('itemcolumns', 'pro_type')].cellEditorParams.values = pro_types;
                }
            });

    }
   
    /**保存校验区域*/
    $scope.validate = function () {
        var errorlist = [];
        $scope.data.currItem.sale_ship_m_item_lineofsale_ship_notice_m_headers.length == 0 ? errorlist.push("明细不能为空") : 0;
        return true;
    };
    $scope.clearinformation = function () {
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.creator = window.userbean.userid;
        $scope.data.currItem.org_id = window.userbean.org_id;
        $scope.data.currItem.arr_entid = 101;//家用
    }

    $scope.initdata();

}

//加载控制器
billmanControllers
    .controller('sale_ship_notice_m_headerEdit', sale_ship_notice_m_headerEdit)

