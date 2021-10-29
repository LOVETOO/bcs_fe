var billmanControllers = angular.module('inspinia');
function pro_main_tain_headerEdit($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {

    //继承基类方法
    pro_main_tain_headerEdit = HczyCommon.extend(pro_main_tain_headerEdit, ctrl_bill_public);
    pro_main_tain_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "pro_maintain_header",
        key: "maintain_id",
        wftempid: 10073,
        FrmInfo: {},
        grids: [
            {
                optionname: 'itemline_options', idname: 'pro_maintain_line2ofpro_maintain_headers'
            }, {optionname: 'line2_options', idname: 'pro_maintain_lineofpro_maintain_headers'}
        ]
    };
    //初始化界面
    var myDate = new Date();
    $scope.clearinformation = function () {
        var orgtype = window.userbean.orgtype;
        if (orgtype == 5) {
            $scope.data.currItem.org_id = orgtype.org_id;
            $scope.data.currItem.org_code = orgtype.org_code;
            $scope.data.currItem.org_id = orgtype.org_name;
        }
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,
            apply_type: "1",
            create_time: myDate.toLocaleDateString(),
            pro_maintain_line2ofpro_maintain_headers: [],
            pro_maintain_lineofpro_maintain_headers: [],
            objattachs:{}
        };
    };
    $scope.save_before = function (){
        if(window.userbean.stringofrole.indexOf("研发")
            &&($scope.data.currItem.fk_time==""||$scope.data.currItem.fk_time==undefined)){
            var myDate = new Date();
            $scope.data.currItem.fk_time= myDate.toLocaleDateString();
        }
    }
    $scope.validate = function () {
        if (window.userbean.username == "销售人员") {
            var errorlist = [];
            var data = $scope.data.currItem.pro_maintain_line2ofpro_maintain_headers;
            for (var i = 0; i < data.length; i++) {
                var seq = i + 1;
                if (data[i].item_h_name == undefined || data[i].item_h_name == "") {
                    errorlist.push("业务新增机型要求第" + seq + "行整机型号不能为空");
                }
            }

            for (var i = 0; i < data.length; i++) {
                var seq = i + 1;
                if (data[i].comp_name == undefined || data[i].comp_name == "") {
                    errorlist.push("业务新增机型要求第" + seq + "行选用压缩机不能为空");
                }
            }
            for (var i = 0; i < data.length; i++) {
                var seq = i + 1;
                if (data[i].item_platform == undefined || data[i].item_platform == "") {
                    errorlist.push("业务新增机型要求第" + seq + "行内机大小不能为空");
                }
            }
            for (var i = 0; i < data.length; i++) {
                var seq = i + 1;
                if (data[i].standinfo == undefined || data[i].standinfo == "") {
                    errorlist.push("业务新增机型要求第" + seq + "行外机箱体大小不能为空");
                }
            }
            for (var i = 0; i < data.length; i++) {
                var seq = i + 1;
                if (data[i].condenser == undefined || data[i].condenser == "") {
                    errorlist.push("业务新增机型要求第" + seq + "行冷凝器规格不能为空");
                }
            }
            for (var i = 0; i < data.length; i++) {
                var seq = i + 1;
                if (data[i].has_power_line == undefined || data[i].has_power_line == "") {
                    errorlist.push("业务新增机型要求第" + seq + "行有无电源连接线不能为空");
                }
            }
            if ($scope.data.currItem.apply_type = "临时方案申请") {
                errorlist.push("临时方案申请走线下签字");
            }
            if (errorlist.length) {
                BasemanService.notify(notify, errorlist, "alert-danger");
                return false;
            }
            return true;
        }
        return true;
    }
    $scope.refresh_after = function () {
        $scope.data.currItem.apply_type = Number($scope.data.currItem.apply_type);
        if ($scope.data.currItem.stat < 4) {
            for (var i = 0; i < $scope.line2_columns.length; i++) {
                $scope.line2_columns[i].editable = true;
            }
        }
    }
    //申请类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "apply_type"}).then(function (data) {
        $scope.apply_types = data.dicts;
    })
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

            $scope.add_line = function () {
                var data = [];
                var node = $scope.itemline_options.api.getModel().rootNode.allLeafChildren;
                for (var i = 0; i < node.length; i++) {
                    data.push(node[i].data);
                }
                item = {
                    seq: node.length + 1,
                    line_id: node.length + 1,

                };
                data.push(item);
                $scope.itemline_options.api.setRowData(data);
            };
            $scope.del_line = function () {
                var data = $scope.gridGetData("itemline_options");
                var rowidx = $scope.itemline_options.api.getFocusedCell().rowIndex;
                data.splice(rowidx, 1);
                $scope.itemline_options.api.setRowData(data);
            }
            $scope.itemline_options = {
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
                    var isGrouping = $scope.itemline_options.columnApi.getRowGroupColumns().length > 0;
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

            $scope.itemline_columns = [{
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
                width: 80,
            }, {
                headerName: "整机型号",
                field: "item_h_name",
                editable: true,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                pinned: "left",
                width: 80,
            }, {
                headerName: "选用压缩机",
                field: "comp_name",
                editable: true,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 120,
            }, {
                headerName: "内机大小",
                field: "item_platform",
                editable: true,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 120
            }, {
                headerName: "外机箱体大小",
                field: "standinfo",
                editable: true,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 100
            }, {
                headerName: "冷凝器规格",
                field: "condenser",
                editable: true,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 100
            }, {
                headerName: "有无电源连接线",
                field: "has_power_line",
                cellEditorParams: {
                    values: [{value: 0, desc: '有'}, {value: 1, desc: '无'}]
                },
                editable: true,
                filter: 'set',
                cellEditor: "下拉框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 130
            }, {
                headerName: "有无左右摆风",
                field: "has_wind",
                cellEditorParams: {
                    values: [{value: 0, desc: '有'}, {value: 1, desc: '无'}]
                },
                editable: true,
                filter: 'set',
                cellEditor: "下拉框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 130
            }, {
                headerName: "其他项",
                field: "other_note",
                editable: true,
                filter: 'set',
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                width: 180
            }];
        }

        //line2_options
        {

            $scope.line2_options = {
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
                    var isGrouping = $scope.line2_options.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                },
            };
            $scope.add_line2 = function () {
                var data = [];
                var node = $scope.line2_options.api.getModel().rootNode.allLeafChildren;
                for (var i = 0; i < node.length; i++) {
                    data.push(node[i].data);
                }
                item = {
                    seq: node.length + 1,
                    line_id: node.length + 1,

                };
                data.push(item);
                $scope.line2_options.api.setRowData(data);
            };
            $scope.del_line2 = function () {
                var data = $scope.gridGetData("line2_options");
                var rowidx = $scope.itemline_options.api.getFocusedCell().rowIndex;
                data.splice(rowidx, 1);
                $scope.line2_options.api.setRowData(data);
            }
            $scope.line2_columns = [
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
                    width: 80,
                }, {
                    headerName: "内机编码",
                    field: "new_item_code",
                    editable: true,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 120,
                }, {
                    headerName: "内机名称",
                    field: "new_item_name",
                    editable: true,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 120
                }, {
                    headerName: "内机版本",
                    field: "version1",
                    editable: true,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 130
                }, {
                    headerName: "外机编码",
                    field: "new_item_code2",
                    editable: true,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 130
                }, {
                    headerName: "外机名称",
                    field: "new_item_name2",
                    editable: true,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 180
                }, {
                    headerName: "外机版本",
                    field: "version2",
                    editable: true,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 100
                }, {
                    headerName: "整机编码反馈",
                    field: "new_item_h_code",
                    editable: true,
                    filter: 'set',
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 100
                }];
        }
    }
    $scope.initdata();
}//加载控制器
billmanControllers
    .controller('pro_main_tain_headerEdit', pro_main_tain_headerEdit)

