var basemanControllers = angular.module('inspinia');
function supplierEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    supplierEdit = HczyCommon.extend(supplierEdit, ctrl_bill_public);
    supplierEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "supplier",
        key: "supplier_id",
        wftempid: 10169,
        FrmInfo: {},
        grids: [
            {optionname: 'aoptions', idname: 'supplier_itemofsuppliers'},
            {optionname: 'lineOptions', idname: 'supplier_lineofsuppliers'},
        ]
    };
    $scope.auth_right = {
        cw: false
    };
    $scope.refresh_after = function () {
        if (window.userbean.stringofrole.indexOf("船务") != -1||window.userbean.stringofrole.indexOf("admins") != -1) {
            $scope.auth_right.cw = true;
        }
        //序号
        for (var i = 0; i < $scope.data.currItem.supplier_lineofsuppliers.length; i++) {
            $scope.data.currItem.supplier_lineofsuppliers[i].seq = parseInt(i + 1);
        }
    };
    /**设置网格状态*/
    $scope.setgridstat = function (stat) {
        //if(data.stat && data.stat != 1){
        if (stat == undefined) {
            return;
        }
        for (var i = 0; i < $scope.objconf.grids.length; i++) {
            if ($scope[$scope.objconf.grids[i].optionname].columnApi) {
                var allcol = $scope[$scope.objconf.grids[i].optionname].columnApi.getAllColumns();

                if (parseInt(stat) > 1) {
                    for (var j = 0; j < allcol.length; j++) {
                        allcol[j].colDef.editable = true;
                    }
                } else {
                    var defaultcols = $scope[$scope.objconf.grids[i].optionname].defaultColumns;
                    if (defaultcols) {
                        for (var j = 0; j < allcol.length; j++) {
                            if (defaultcols[j] && allcol[j].colDef && allcol[j].colDef.field == defaultcols[j].field) {

                                allcol[j].colDef.editable = defaultcols[j].editable;
                            }
                        }
                    }
                }

            }
            if ($scope.objconf.grids[i].line && $scope[$scope.objconf.grids[i].line.optionname].columnApi) {
                var allcol = $scope[$scope.objconf.grids[i].line.optionname].columnApi.getAllColumns();
                if (stat && parseInt(stat) > 1) {
                    for (var j = 0; j < allcol.length; j++) {
                        allcol[j].colDef.editable = true;
                    }
                } else {
                    var defaultcols = $scope[$scope.objconf.grids[i].line.optionname].defaultColumns;
                    if (defaultcols) {
                        for (var j = 0; j < allcol.length; j++) {
                            if (defaultcols[j] && allcol[j].colDef && allcol[j].colDef.field == defaultcols[j].field) {
                                allcol[j].colDef.editable = defaultcols[j].editable;
                            }
                        }
                    }
                }
            }
        }
        //下拉选项是否可编辑
        $timeout(function () {
            if ($scope.data.currItem.stat == 1) {
                $("select.chosen-select").each(function () {

                    var _this = $(this);
                    var c_disbled = false;
                    if (_this[0].disabled && _this.attr("readonly")) {
                        c_disbled = true;
                    }
                    _this.attr('disabled', c_disbled).trigger("chosen:updated");
                });
            } else {
                $("select.chosen-select").each(function () {
                    var _this = $(this);
                    if(window.userbean.stringofrole.indexOf("船务")!= -1||window.userbean.stringofrole.indexOf("admins")!= -1){
                        var c_disbled = false;
                    }else{
                        c_disbled = true;
                    }
                    _this.attr('disabled', c_disbled).trigger("chosen:updated");
                });
            }
        }, 1000);
    };
    //船公司、货代公司
    $scope.Change_Supplier = function () {
        if ($scope.data.currItem.supplier_type == 2) {
            $scope.data.currItem.hd_type = "";
        }
    };
    $scope.Hd_Type = function () {
        if ($scope.data.currItem.supplier_type == 2) {
            $scope.data.currItem.hd_type = "";
        }
    };
    /**-------网格定义区域 ------*/
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
    $scope.aoptions = {
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
        //rowClicked:$scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.aoptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.acolumns = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "联系人", field: "relaman", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "电话", field: "phone", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "传真", field: "fax", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "Email", field: "email", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.lineOptions = {
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
            var isGrouping = $scope.lineOptions.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.lineColumns = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "柜型",
            field: "box_type",
            editable: true,
            filter: 'set',
            width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "固定加价", field: "add_price", editable: true, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    /*系统词汇值*/
    //类型
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "supplier_type"})
        .then(function (data) {
            $scope.supplier_types = HczyCommon.stringPropToNum(data.dicts);
        });
    //货代类型
    BasemanService.RequestPost("base_search", "searchhdtype", {dictcode: "hd_type"})
        .then(function (data) {
            $scope.hd_types = HczyCommon.stringPropToNum(data.dicts);
        });
    //柜型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "box_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: Number(data.dicts[i].dictvalue),
                desc: data.dicts[i].dictname
            };
            $scope.lineColumns[$scope.getIndexByField("lineColumns","box_type")].cellEditorParams.values.push(newobj);
        }
    })
    /**------ 对网格操作区域-------*/
    //增加当前行、删除当行前    //付款条件明细
    $scope.additem = function () {
        //避免填写数据丢失
        $scope.aoptions.api.stopEditing(false);
        var data = [];
        var node = $scope.aoptions.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        var item = {
            seq: node.length + 1
        };
        data.push(item);
        $scope.aoptions.api.setRowData(data);
        $scope.data.currItem.supplier_itemofsuppliers = data;
    };
    $scope.delitem = function () {
        //避免填写数据丢失
        $scope.aoptions.api.stopEditing(false);
        var data = [];
        var rowidx = $scope.aoptions.api.getFocusedCell().rowIndex;
        var node = $scope.aoptions.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.aoptions.api.setRowData(data);
        $scope.data.currItem.supplier_itemofsuppliers = data;

    };
    //付款比例明细
    $scope.additem2 = function () {
        var item = {
            seq:0,
        };
        $scope.gridAddItem("lineOptions",item);
        $scope.data.currItem.supplier_lineofsuppliers = item;
        for (var i = 0; i < $scope.data.currItem.supplier_lineofsuppliers.length; i++) {
            $scope.data.currItem.supplier_lineofsuppliers[i].seq = parseInt(i + 1);
        }
    };
    /**------保存校验区域-----*/
    //保存校验
    $scope.validate = function () {
        if ($scope.data.currItem.supplier_type == 1) {
            if ($scope.data.currItem.hd_type == "") {
                BasemanService.notice('货代类型不能为空!', "alert-info");
                return false;
            }
        }
        //校验柜型
        var dataline=  $scope.data.currItem.supplier_lineofsuppliers;
        var ary = [];
        for(var i=0;i<dataline.length;i++){
            var item=(dataline[i].box_type).toString();
            ary.push(item);
        };
        var s = ary.join(",")+",";
        for(var i=0;i<ary.length;i++) {
            if(s.replace(ary[i]+",","").indexOf(ary[i]+",")>-1) {
                BasemanService.notice("'固定加价'明细中有重复柜型,请核对!", "alert-warning");
                return false;
            }
        }
        return true;
    };
    $scope.save_before = function () {
        $scope.data.currItem.flag = 1;//审核状态的数据允许“船务”角色的用户修改“证书到期”、附件；
    }
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.supplier_type = 2
    };
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('supplierEdit', supplierEdit);
