var basemanControllers = angular.module('inspinia');
function sale_price_list_search($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_price_list_search = HczyCommon.extend(sale_price_list_search, ctrl_bill_public);
    sale_price_list_search.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_list",
        /*        key: "out_id",*/
        //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_lists'}]
    };


    //查询
    $scope.search = function () {
        sqlBlock = "";
        //BasemanService.getSqlWhereBlock(sqlBlock);
        var postdata = {
            flag: 4,
            sqlwhere: sqlBlock,
            item_h_id: $scope.data.currItem.item_h_id,
            item_id: $scope.data.currItem.item_id
        };
        var data = $scope.data.currItem.sale_lists;
        BasemanService.RequestPost("sale_list", "search", postdata)
            .then(function (data) {
                $scope.data.currItem.sale_lists = data.sale_lists;
                $scope.options_13.api.setRowData(data.sale_lists);
            });
    }
    //清空
    //清空编码
    $scope.item_code = function () {
        $scope.data.currItem.item_id = "";
        $scope.data.currItem.item_code = "";
        $scope.data.currItem.item_name = "";
    };
    $scope.item_h_code = function () {
        $scope.data.currItem.item_h_id = "";
        $scope.data.currItem.item_h_code = "";
        $scope.data.currItem.item_h_name = "";
    };
    $scope.clearSelection = function () {
        $("#sqlWhereBlock").find("select").each(function () {
            this.value = "";                                          //清空查询使用值
            $("#sqlWhereBlock").find("select").each(function () {  //清空界面显示值
                var id = "#" + this.id + "_chosen";
                $(id).find("span").each(function () {
                    this.textContent = "";
                })
            });
        });
        $("#sqlWhereBlock").find("input").each(function () {
            this.value = "";
        })
        for(var name in $scope.data.currItem){
            if($scope.data.currItem[name]!=undefined&&$scope.data.currItem[name]!=""&&!($scope.data.currItem[name] instanceof Array)){
                $scope.data.currItem[name]=undefined;
            }
        }
    };
    $scope.selectcust = function () {
        $scope.FrmInfo = {
            classid: "pro_item_header",
            postdata: {},
            backdatas: "pro_item_headers"
            /*sqlBlock: "org_id = " + $scope.data.currItem.org_id*/
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.item_h_id = result.item_h_id;
            $scope.data.currItem.item_h_code = result.item_h_code;
            $scope.data.currItem.item_h_name = result.item_h_name;
            /*$scope.data.currItem.cust_id = result.cust_id;*/
        });

    };
    $scope.selectcust1 = function () {
        $scope.FrmInfo = {
            classid: "pro_item",
            postdata: {},
            backdatas: "pro_items"
            /*sqlBlock: "org_id = " + $scope.data.currItem.org_id*/
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.item_id = result.item_id;
            $scope.data.currItem.item_code = result.item_code;
            $scope.data.currItem.item_name = result.item_name;
        });

    };
   
    /************************网格定义区域**************************/
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
        cellRendererParams: {
            checkbox: true
        }
    };
    $scope.columns_13 = [
        {
            headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "大类名称", field: "item_type_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "电源", field: "power", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "冷媒", field: "refrigerant", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "冷量范围", field: "item_cool", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "冷暖类型", field: "cool_type", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "工厂型号", field: "item_h_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "适用面板", field: "stand_conf", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "是否含连接线", field: "sfljx", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "电源连接线长度", field: "dyljxcd", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "电源连接线金额", field: "dyljxcd_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "截止阀规格", field: "jzfgg", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "连接管长度", field: "conn_length", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "内机编码", field: "item_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "内机大小", field: "item_platform", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "包装尺寸", field: "bzcc", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "净重", field: "nw", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "外机编码", field: "item_code1", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "箱体大小", field: "standinfo", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "冷凝器规格", field: "condenser", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "压缩机型号", field: "comp_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "包装尺寸", field: "bzcc1", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "净重", field: "nw1", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "内机指导价", field: "base_price1", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "外机指导价", field: "settle_price", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "整机指导价（USD）", field: "base_price", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "无管无线整机面价（USD）", field: "wgwxamt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "装箱量", field: "trait_value1", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "灯显示颜色", field: "trait_value2", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "遥控器", field: "trait_value3", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "内机编码2", field: "item_code2", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "内机名称2", field: "Item_name2", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "内机价格2", field: "settle_price1", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "冷量标准", field: "cool_stand", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "标配面板", field: "MB_stand", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_13 = {
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
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_13.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('sale_price_list_search', sale_price_list_search);
