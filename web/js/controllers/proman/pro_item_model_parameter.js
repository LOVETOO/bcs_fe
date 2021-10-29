var basemanControllers = angular.module('inspinia');
function pro_item_model_parameter($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    pro_item_model_parameter = HczyCommon.extend(pro_item_model_parameter, ctrl_bill_public);
    pro_item_model_parameter.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "pro_item_update_bill",
        key: "item_code",
        //  wftempid:10008,
        FrmInfo: {},
        grids: [{optionname: 'options_2', idname: 'pro_itemofpro_item_headers'},
            {optionname: 'options_19', idname: 'pro_itemofpro_item_headers'}]
    };
    /***************************按钮*********************/
    $scope.clear_item = function (){
        $scope.data.currItem.item_h_name = "";
        $scope.data.currItem.item_h_code = "";
    }
    //查询
    $scope.search = function (){
       var postdata={flag:16};
        BasemanService.RequestPost("sale_list", "search", postdata)
            .then(function (data) {
                $scope.gridSetData("options_2", data.sale_lists);
            }
            );
        var postdata2={flag:15,
            item_code:$scope.data.currItem.item_h_code,
            mb_stand:$scope.data.currItem.mb_stand,
            comp_name:$scope.data.currItem.comp_name,
            standinfo:$scope.data.currItem.standinfo,
            power:$scope.data.currItem.power,
            cool_type:$scope.data.currItem.cool_type,
            power_frequency:$scope.data.currItem.power_frequency,
            cool_stand:$scope.data.currItem.cool_stand,
        };
        BasemanService.RequestPost("sale_list", "search", postdata2)
            .then(function (data) {
                var cols=[];
                HczyCommon.copyobj($scope.columns_2,cols);
                $scope.gridSetData("options_19", data.sale_lists);
                for(var i=0;i<data.sale_lists.length;i++){
                    var item = data.sale_lists[i];
                    var temp={ headerName: "机型"+(i+1), field: "x_"+item.item_h_code, editable: false, filter: 'set', width: 90,
                        cellEditor: "文本框",
                        enableRowGroup: true,
                        enablePivot: true,
                        enableValue: true,
                        floatCell: true,
                    };
                    cols.push(temp);
                }
                $scope.options_2.api.setColumnDefs(cols);
                var datas = $scope.gridGetData("options_19");
                var data2=$scope.gridGetData("options_2");
                for(var j=0;j<data2.length;j++){
                    for(var i=0;i<datas.length;i++){
                        var field_name = $scope.columns_19[j].field;
                        var item = datas[i];
                        data2[j]['x_'+item.item_h_code]=item[field_name];
                    }
                }
                $scope.gridSetData("options_2", data2);
            }
            );
    }
    //下拉框值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cool_stand"}).then(function (data) {
        $scope.cool_stands = data.dicts;
    })
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "mb_stand"}).then(function (data) {
        $scope.mb_stands = data.dicts;
    })
    /***************************弹出框***********************/
    $scope.selectitem = function () {

        $scope.FrmInfo = {
            title: "整机查询",
            thead: [
                {
                    name: "整机编码",
                    code: "item_h_code",
                    show: true,
                    iscond: true,
                    type: 'string'

                }, {
                    name: "整机名称",
                    code: "item_h_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "整机型号",
                    code: "h_spec",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            is_custom_search: true,
            is_high: true,
            type: "checkbox",
            classid: "pro_item_header",
            sqlBlock: "item_type in (1,2) and usable=2",
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (items) {
            if (items.length == 0) {
                return
            }
            var ids = '', names = '', ids = [];
            for (var i = 0; i < items.length; i++) {
                names += "'"+items[i].item_h_name+"'" + ',';
                ids += "'"+items[i].item_h_code+"'" + ',';
                // items.push[items[i].box_ids]
            }
            // $scope.setColumnsVisible(ids);
            names = names.substring(0, names.length - 1);
            ids = ids.substring(0, ids.length - 1);
            $scope.data.currItem.item_h_name = names;
            $scope.data.currItem.item_h_code = ids;
        });

    }
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
    $scope.columns_2 = [{
        headerName: "参数", field: "para_name", editable: false, filter: 'set', width: 160,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    },{
        headerName: "参数列名", field: "para_field", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }];
    $scope.options_2 = {
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
            var isGrouping = $scope.options_2.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_19 = [{
        headerName: "整机编码", field: "item_h_code", editable: false, filter: 'set', width: 160,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "工厂型号", field: "item_h_name", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    },{
        headerName: "内机编码", field: "item_code1", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "外机编码", field: "item_code2", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    },{
        headerName: "压缩机型号", field: "comp_name", editable: false, filter: 'set', width: 160,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "电源", field: "power", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    },{
        headerName: "冷媒", field: "refrigerant", editable: false, filter: 'set', width: 160,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "连接管线长", field: "conn_length", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    },{
        headerName: "电源连接线长", field: "dyljxcd", editable: false, filter: 'set', width: 160,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "截止阀规格", field: "jzfgg", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    },{
        headerName: "内机包装尺寸", field: "bzcc1", editable: false, filter: 'set', width: 160,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "外机包装尺寸", field: "bzcc2", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    },{
        headerName: "冷凝器规格", field: "condenser", editable: false, filter: 'set', width: 160,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "标配面板", field: "mb_stand", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    },{
        headerName: "适配面板", field: "stand_conf", editable: false, filter: 'set', width: 160,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "装箱量", field: "ait_value1", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "箱体大小", field: "standinfo", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    },{
        headerName: "单冷/冷暖", field: "seq", editable: false, filter: 'set', width: 160,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "定速/变频", field: "power_frequency", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }];
    $scope.options_19 = {
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
            var isGrouping = $scope.options_19.columnApi.getRowGroupColumns().length > 0;
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
    .controller('pro_item_model_parameter', pro_item_model_parameter);
