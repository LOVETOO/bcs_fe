'use strict';
function erpitem($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    erpitem = HczyCommon.extend(erpitem, ctrl_bill_public);
    erpitem.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "erpitem",
        key: "inventory_item_id",
        FrmInfo: {},
        grids: [{optionname: 'options_11', idname: 'erpitems'},
        ]
    };
    $scope.custusable = function () {
        // $scope.data.currItem.custusable = 2;
        $scope.data.currItem.orgusable = 1;
        $scope.data.currItem.chausable = 1;
        $scope.data.currItem.priceusable = 1;
        $scope.data.currItem.itemusable = 1;
        $scope.data.currItem.bigusable = 1;
    };
    $scope.orgusable = function () {
        $scope.data.currItem.custusable = 1;
        // $scope.data.currItem.orgusable = 2;
        $scope.data.currItem.chausable = 1;
        $scope.data.currItem.priceusable = 1;
        $scope.data.currItem.itemusable = 1;
        $scope.data.currItem.bigusable = 1;
    };
    $scope.chausable = function () {
        $scope.data.currItem.custusable = 1;
        $scope.data.currItem.orgusable = 1;
        // $scope.data.currItem.chausable = 2;
        $scope.data.currItem.priceusable = 1;
        $scope.data.currItem.itemusable = 1;
        $scope.data.currItem.bigusable = 1;
    };
    $scope.priceusable = function () {
        $scope.data.currItem.custusable = 1;
        $scope.data.currItem.orgusable = 1;
        $scope.data.currItem.chausable = 1;
        // $scope.data.currItem.priceusable = 2;
        $scope.data.currItem.itemusable = 1;
        $scope.data.currItem.bigusable = 1;
    }
    $scope.itemusable = function () {
        $scope.data.currItem.custusable = 1;
        $scope.data.currItem.orgusable = 1;
        $scope.data.currItem.chausable = 1;
        $scope.data.currItem.priceusable = 1;
        // $scope.data.currItem.itemusable = 2;
        $scope.data.currItem.bigusable = 1;
    }
    $scope.bigusable = function () {
        $scope.data.currItem.custusable = 1;
        $scope.data.currItem.orgusable = 1;
        $scope.data.currItem.chausable = 1;
        $scope.data.currItem.priceusable = 1;
        $scope.data.currItem.itemusable = 1;
        // $scope.data.currItem.bigusable = 2;
    }

    /************************初始化页面***********************/
    $scope.clearinformation = function () {
        $scope.isEdit = true;
        $scope.data = {};
        if (window.userbean) {
            $scope.userbean = window.userbean;
        }
        ;
        $scope.data.currItem = {};
    };
    /************下拉框***********************/
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pro_type"})
        .then(function (data) {
            var pro_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                pro_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_11', 'pro_type')) {
                $scope.columns_11[$scope.getIndexByField('columns_11', 'pro_type')].cellEditorParams.values = pro_types;
            }
        });
    /**------------------------网格事件处理--------------------------**/
    $scope.search = function (postdata) {
        var postdata = {
            item_code: $scope.data.currItem.item_code,
            item_name: $scope.data.currItem.item_name
        };
        BasemanService.RequestPost("erpitem", "search", postdata)
            .then(function (data) {
                $scope.data.currItem.erpitems = data.erpitems;
                $scope.options_11.api.setRowData(data.erpitems);
                for (var i = 0; i < $scope.data.currItem.erpitems.length; i++) {
                    $scope.data.currItem.erpitems[i].seq = parseInt(i + 1);
                }
                if (data.pagination.length > 0) {
                    BasemanService.pageInfoOp($scope, data.pagination);
                }
            });
    }
    $scope.exporttocrm = function () {
        var select_row = $scope.selectGridGetData('options_11');
        if (select_row.length == 0 && ($scope.data.currItem.item_code == undefined || $scope.data.currItem.item_code == "")) {
            BasemanService.notice("请选择需要同步的明细!", "alert-warning");
            return;
        }
        // var data = [];
        var item_codes = "";
        var item_names = "";
        for (var i = 0; i < select_row.length; i++) {
            if (select_row[i] == undefined || select_row[i] == "") {
                continue
            }
            if (item_codes == "") {
                item_codes += "'"+ select_row[i].item_code+"'"+",";
                item_names += "'"+ select_row[i].item_name+"'"+",";
            } else {
                item_codes += "'"+select_row[i].item_code+"'";
                item_codes += ',';
                item_names += "'"+select_row[i].item_name+"'";
                item_names += ',';
            }
        };
        if (($scope.data.currItem.item_code)|| ($scope.data.currItem.item_name)) {
            if (item_codes = "") {
                item_codes ="'"+ $scope.data.currItem.item_code+"'"+",";
                item_names ="'"+ $scope.data.currItem.item_name+"'"+",";
            } else {
                item_codes += "'"+$scope.data.currItem.item_code+"'";
                item_codes += ',';
                item_names += "'"+$scope.data.currItem.item_name+"'";
                item_names += ',';
            }
        }
        if (item_codes != "") {
            var tblx = 0;
            if ($scope.data.currItem.custusable == 2) {
                tblx = 1;
            }
            if ($scope.data.currItem.orgusable == 2) {
                tblx = 3;
            }
            if ($scope.data.currItem.chausable == 2) {
                tblx = 5;
            }
            if ($scope.data.currItem.priceusable == 2) {
                tblx = 2;
            }
            if ($scope.data.currItem.itemusable == 2) {
                tblx = 4;
            }
            if ($scope.data.currItem.bigusable == 2) {
                tblx = 6;
            }
            if (tblx == 0) {
                BasemanService.notice("请勾选同步类型", "alter-warning");
                return;
            }
            var postdata = {};
            postdata.item_codes = item_codes;
            postdata.tblx = tblx;
//             postdata.erpitems = data;
            BasemanService.RequestPost("erpitem", "exporttocrm", postdata)
                .then(function (result) {
                    if (result.erpitems.length> 0) {
                        for (var i = 0; i < result.erpitems.length; i++) {
                            var line = result.erpitems[i];
                            var data = $scope.gridGetData("options_11");
                            for (var j = 0; j < data.length; j++) {
                                if (data[j].item_code == line.item_code) {
//                                     $scope.columns_11[j].editable = false;
                                    if (Number(line.receiveflag) == 1) {
//                                         $scope.columns_11[j].non_empty = true;
                                        data[j].receiveflag = 1;
                                        $scope.gridUpdateRow('options_11', data[j]);
                                        for (var i = 0; i < $scope.columns_11.length; i++) {
                                            if ($scope.columns_11[j].field == "out_qty") {
                                                $scope.columns_21[i].editable = true;
                                            }
                                            if ($scope.columns_21[i].field == "actual_box_no") {
                                                $scope.columns_21[i].editable = true;
                                            }
                                            if ($scope.columns_21[i].field == "car_intime") {
                                                $scope.columns_21[i].editable = true;
                                            }
                                            if ($scope.columns_21[i].field == "car_outtime") {
                                                $scope.columns_21[i].editable = true;
                                            }
                                            if ($scope.columns_21[i].field == "seal") {
                                                $scope.columns_21[i].editable = true;
                                            }
                                            if ($scope.columns_21[i].field == "td_code") {
                                                $scope.columns_21[i].editable = true;
                                            }
                                            if ($scope.columns_21[i].field == "car_note") {
                                                $scope.columns_21[i].editable = true;
                                            }
                                            if ($scope.columns_21[i].field == "car_code") {
                                                $scope.columns_21[i].editable = true;
                                            }
                                            if ($scope.columns_21[i].field == "deal_other") {
                                                $scope.columns_21[i].editable = true;
                                            }

                                        }
                                    } else {
//                                         $scope.columns_11[j].non_empty = false;
                                        data[j].receiveflag = 2;
                                        $scope.gridUpdateRow('options_11', data[j]);
                                    }
                                    break;
                                }
                               

                            }
                        }
                    }
                    BasemanService.notice("同步机型成功", "alert-info");

                });

            
        };
    };
    /**************************网格定义********************************/
    $scope.changeseq=function(){
        
    };
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
    //同步
    $scope.options_11 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        //rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        cellRenderer:function(params){return colorRenderer(params)},
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_11.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_11 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty: false,
            cellchange:$scope.changeseq(),
            cellRenderer:function(params){return colorRenderer(params)},
            checkboxSelection: function (params) {
                return params.columnApi.getRowGroupColumns().length === 0;
            },
        },
        {
            headerName: "产品编码", field: "item_code", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty: false,
            cellRenderer:function(params){return colorRenderer(params)},
        },
        {
            headerName: "产品名称", field: "item_name", editable: false, filter: 'set', width: 240,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty: false,
            cellRenderer:function(params){return colorRenderer(params)},
        },
        {
            headerName: "是否有效", field: "usable", editable: false, filter: 'set', width: 100,
            cellEditor: "复选框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty: false,
            cellRenderer:function(params){return colorRenderer(params)},
        },
        {
            headerName: "单位", field: "primary_unit_of_measure", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty: false,
            cellRenderer:function(params){return colorRenderer(params)},
        },
        /* {
         headerName: "机型类别", field: "pro_type", editable: false, filter: 'set', width: 100,
         cellEditor: "下拉框",
         cellEditorParams: {values: []},
         enableRowGroup: true,
         enablePivot: true,
         enableValue: true,
         floatCell: true
         },
         {
         headerName: "最后更新日期", field: "last_update_date", editable: false, filter: 'set', width: 120,
         cellEditor: "年月日",
         enableRowGroup: true,
         enablePivot: true,
         enableValue: true,
         floatCell: true
         },*/
        {
            headerName: "产品型号", field: "spec", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty: false,
            cellRenderer:function(params){return colorRenderer(params)},
        },
        {
            headerName: "已同步标志", field: "receiveflag", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 1, desc: "否"}, {value: 2, desc: "是"}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty: false,
            cellRenderer:function(params){return colorRenderer(params)},
        }];
    function colorRenderer(params){
        if(parseInt(params.data.receiveflag)==2){
            params.eGridCell.style.color="green";
        }
        if(params.value==undefined){
            return ""
        }else{
            return params.value;
        }

    }
  
    /**------------------------网格定义-------------------------------*/
    //数据缓存
    $scope.initdata();

}

angular.module('inspinia')
    .controller('erpitem', erpitem)
