var billmanControllers = angular.module('inspinia');
function sale_break_headerEdit($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {

    //继承基类方法
    sale_break_headerEdit = HczyCommon.extend(sale_break_headerEdit, ctrl_bill_public);
    sale_break_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_break_header",
        key: "break_id",
        wftempid: 10110,
        FrmInfo: {},
        grids: [
            {
                optionname: 'detail1_options',
                idname: 'sale_break_lineofsale_break_headers',
            }, {
                optionname: 'break_line_options',
                idname: 'sale_pi_break_itemofsale_pi_headers'
            }, {
                optionname: 'bom_options',
                istree:true,
                idname: 'sale_pi_item_lineofsale_pi_headers'
            }
        ]
    };
    $scope.headername = "打散方案制单";
    if ($scope.$state.params.ExpandValue || $scope.$state.current.url == "/sale_break_headerEdit1") {
        $scope.ExpandValue = 2;
        $scope.objconf.FrmInfo.sqlBlock = " stat in(5,99)";
        $scope.headername = "打散方案作废";
    }

    //作废方法
    $scope.docancel = function (e) {
        if ($scope.data.currItem.modify_note == undefined || $scope.data.currItem.modify_note == "") {
            BasemanService.notice("请填写作废原因!")
            return;
        }
        try {
            var msg = '确定要将' + $scope.data.currItem.break_name + '单据作废!';
            ds.dialog.confirm(msg, function () {
                if (e) e.currentTarget.disabled = true;
                $(".desabled-window").css("display", "flex");
                var postdata = {
                    break_id: $scope.data.currItem.break_id,
                    modify_note: $scope.data.currItem.modify_note,
                }
                BasemanService.RequestPost($scope.objconf.name, "cancel", postdata)
                    .then(function (data) {
                        BasemanService.notice("作废成功!");
                        $scope.data.currItem.stat = 99;
                        $(".desabled-window").css("display", "none");
                        if (e) e.currentTarget.disabled = false;
                    }, function () {
                        $(".desabled-window").css("display", "none");
                        if (e) e.currentTarget.disabled = false;
                    });
            }, function () {
                $(".desabled-window").css("display", "none");
                if (e) e.currentTarget.disabled = false;
            })
        } finally {
            $(".desabled-window").css("display", "none");
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
        $scope.to_detail = function () {
            var datas = $scope.selectGridGetData('bom_options');
            var details = $scope.gridGetData('detail1_options');
            var isexists = false;
            var data = {}
            for (var k = 0; k < datas.length; k++) {
                HczyCommon.copyobj(datas[k], data)
                for (var i = 0; i < details.length; i++) {
                    if (details[i].item_code == data.item_code || details[i].item_name == data.item_name) {
                        isexists = true;
                        break;
                    }
                }
                if (isexists) {
                    return;
                }
                data.item_code = data.item_code.substring(0, 6)
                $scope.gridAddItem('detail1_options', data, undefined, true)
            }
        }

        $scope.to_break = function () {
            var datas = $scope.selectGridGetData('bom_options');
            var data = {}
            var details = $scope.gridGetData('break_line_options');
            var isexists = false;
            for (var k = 0; k < datas.length; k++) {
                HczyCommon.copyobj(datas[k], data)
                for (var i = 0; i < details.length; i++) {
                    if (details[i].item_code == data.item_code) {
                        isexists = true;
                        break;
                    }
                }
                if (isexists) {
                    return;
                }
                $scope.gridAddItem('break_line_options', data, undefined, true)
            }
        }


        //detail1_options
        {
            $scope.detail1_options = {
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
                    var isGrouping = $scope.detail1_options.columnApi.getRowGroupColumns().length > 0;
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

            $scope.detail1_columns = [
                {
                    headerName: "序号",
                    field: "seq",
                    editable: false,
                    filter: 'set',
                    width: 50,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    pinned: "left"
                }, {
                    headerName: "序号ID",
                    field: "line_id",
                    editable: false,
                    filter: 'set',
                    width: 70,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "父项序号",
                    field: "p_seq",
                    editable: true,
                    filter: 'set',
                    width: 80,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "编码前缀",
                    field: "item_code",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "物料描述包含",
                    field: "item_name",
                    editable: true,
                    filter: 'set',
                    width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "物料描述不包含",
                    field: "item_name2",
                    editable: true,
                    filter: 'set',
                    width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "包装方式",
                    field: "pack_name",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellEditorParams: {
                        values: [{value: 1, desc: "单独打包"}, {value: 2, desc: "下层打包"}, {value: 3, desc: "删除"}]
                    },
                }, {
                    headerName: "备注",
                    field: "note",
                    editable: true,
                    filter: 'set',
                    width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }];

        }

        //break_line_options
        {

            $scope.break_line_options = {
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
                    var isGrouping = $scope.break_line_options.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                },
            };

            $scope.break_line_columns = [
                {
                    headerName: "序号",
                    field: "seq",
                    editable: false,
                    filter: 'set',
                    width: 60,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    pinned: "left"
                }, {
                    headerName: "序号ID",
                    field: "line_id",
                    editable: true,
                    filter: 'set',
                    width: 70,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true
                }, {
                    headerName: "物料编码",
                    field: "item_code",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "物料描述",
                    field: "item_name",
                    editable: false,
                    filter: 'set',
                    width: 120,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "包装方式",
                    field: "pack_name",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "下拉框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    cellEditorParams: {
                        values: [{value: 1, desc: "单独打包"}, {value: 2, desc: "下层打包"}, {value: 3, desc: "删除"}]
                    },
                }, {
                    headerName: "单台用量",
                    field: "item_qty",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "BOM层次",
                    field: "bom_level",
                    editable: true,
                    filter: 'set',
                    width: 80,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "备注",
                    field: "note",
                    editable: true,
                    filter: 'set',
                    width: 120,
                    cellEditor: "弹出框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }];
            ;

        }

        //bom_options
        {
            var getNodeChildDetails = function (rowItem) {
                if (rowItem.haschild) {
                    return rowItem;
                } else {
                    return null;
                }
            }
            $scope.bom_options = {
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
                getNodeChildDetails: getNodeChildDetails,
                showToolPanel: false,
                checkboxSelection: function (params) {
                    var isGrouping = $scope.bom_options.columnApi.getRowGroupColumns().length > 0;
                    return params.colIndex === 0 && !isGrouping;
                },
                icons: {
                    columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                    filter: '<i class="fa fa-filter"/>',
                    sortAscending: '<i class="fa fa-long-arrow-down"/>',
                    sortDescending: '<i class="fa fa-long-arrow-up"/>',
                }
            };

            $scope.bom_columns = [
                {
                    headerName: "序号",
                    field: "seq",
                    editable: false,
                    filter: 'set',
                    width: 60,
                    cellEditor: "树状结构",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                    checkboxSelection: function (params) {
                        // we put checkbox on the name if we are not doing no grouping
                        return params.columnApi.getRowGroupColumns().length === 0;
                    },
                }, {
                    headerName: "物料编码",
                    field: "item_code",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "物料描述",
                    field: "item_name",
                    editable: true,
                    filter: 'set',
                    width: 220,
                    cellEditor: "文本框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }, {
                    headerName: "数量",
                    field: "qty",
                    editable: true,
                    filter: 'set',
                    width: 100,
                    cellEditor: "浮点框",
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    floatCell: true,
                }];
        }

    }


    //弹出框
    {
        $scope.scparea = function () {
            $scope.FrmInfo = {
                type: "checkbox",
                classid: "scparea",
                sqlBlock: "areatype = 2",
                postdata: {},
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                if (data.length == 0) {
                    return
                }
                $scope.data.currItem.area_names = HczyCommon.wm_concat(data, "areaname", ",");
                $scope.data.currItem.area_codes = HczyCommon.wm_concat(data, "areacode", ",");
                $scope.data.currItem.area_ids = HczyCommon.wm_concat(data, "areaid", ",");
            });
        };


        //customer
        $scope.customer = function () {

            var sqlBlock = {}
            if ($scope.data.currItem.area_codes == undefined || $scope.data.currItem.area_codes == "") {
                BasemanService.notice("请先选择国家", "alert-warning");
                return;
            } else {
                sqlBlock = " area_code in(" + $scope.data.currItem.area_codes + ")";
            }
            $scope.FrmInfo = {
                classid: "customer",
                postdata: {},
                sqlBlock: sqlBlock,
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                $scope.data.currItem.cust_id = result.cust_id;
                $scope.data.currItem.cust_code = result.sap_code;
                $scope.data.currItem.cust_name = result.cust_name;
            });
        }

        $scope.sale_assembly_header = function () {
            $scope.FrmInfo = {
                classid: "sale_assembly_header",
                sqlBlock: "stat = 5",
                postdata: {},
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                $scope.data.currItem.assembly_id = data.assembly_id
                $scope.data.currItem.assembly_name = data.assembly_name
            });
        };

        $scope.sale_break_header = function () {
            $scope.FrmInfo = {
                title: "机型查询",
                is_high: true,
                type: "checkbox",
                thead: [
                    {
                        name: "编码",
                        code: "class_code",
                        show: true,
                        iscond: true,
                        type: 'string'
                    },
                    {
                        name: "名称",
                        code: "class_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }],
                classid: "sale_break_header",
                postdata: {
                    flag: 1
                },
                searchlist: ["class_code", "class_name"],
                is_custom_search: true,
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                $scope.data.currItem.class_ids = HczyCommon.wm_concat(data, "class_id", ",");
                $scope.data.currItem.class_codes = HczyCommon.wm_concat(data, "class_code", ",");
                $scope.data.currItem.class_names = HczyCommon.wm_concat(data, "class_name", ",");
            });
        };

        $scope.getItem_Code = function (property) {//property="item_code","item_codeto"
            if ($scope.data.currItem.class_codes == undefined || $scope.data.currItem.class_codes == "") {
                BasemanService.notice("请先选择机型分类", "alert-warning");
                return;
            }
            $scope.FrmInfo = {
                title: "机型查询",
                is_high: true,
                thead: [
                    {
                        name: "编码",
                        code: "psc_item_code",
                        show: true,
                        iscond: true,
                        type: 'string'
                    },
                    {
                        name: "名称",
                        code: "psc_item_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }],
                classid: "sale_break_header",
                postdata: {
                    flag: 2,
                    class_codes: $scope.data.currItem.class_codes,
                },
                is_custom_search: true,
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                $scope.data.currItem[property] = data.psc_item_code;
            });
        };

        //button
        $scope.breakItem = function () {
            if ($scope.data.currItem.break_id == undefined || $scope.data.currItem.break_id == "") {
                BasemanService.notice("请选择打散方案!", "alert-warning");
                return;
            }
            if ($scope.data.currItem.item_codeto == undefined || $scope.data.currItem.item_codeto == "") {
                BasemanService.notice("请选择机型编码!", "alert-warning");
                return;
            }
            BasemanService.RequestPost("sale_pi_header", "getsparebom", {
                item_code: $scope.data.currItem.item_codeto.replace(/(^\s*)|(\s*$)/g, ""),
                break_id: $scope.data.currItem.break_id,
                flag: 3
            }).then(function (data) {
                $scope.gridSetData("break_line_options", data.sale_pi_break_itemofsale_pi_headers);
            })
        }

        $scope.getBOM = function () {
            if ($scope.data.currItem.item_code == undefined || $scope.data.currItem.item_code == "") {
                BasemanService.notice("请选择标准机型!", "alert-warning");
                return;
            }
            BasemanService.RequestPost("sale_pi_header", "getdeploybom", {
                item_code: String($scope.data.currItem.item_code).replace(/(^\s*)|(\s*$)/g, ""),
            }).then(function (data) {
                var datas = data.sale_pi_item_lineofsale_pi_headers;
                datas.splice(0, 0, {item_code: $scope.data.currItem.item_code, asmid2: "/"})
                var trees = $scope.setTree(datas, "item_id2", "asmid2");
                $scope.gridSetData("bom_options", [trees]);
            })
        }

        $scope.setTree = function (datas, childID, parentID) { //childID="item_id2" ，parentID="asmid2"
            if (datas.length == 0) {
                return;
            }
            var level = [];
            if (datas.length == 1) {//只有根节点
                return datas;
            }
            datas[0].Children = []
            datas[0][childID] = datas[1][parentID]; //datas[0].item_id2=datas[1].asmid2;
            level.push(datas[0]);
            for (var i = 0; i < datas.length; i++) {
                datas[i].seq = i + 1;
                //加入下层，或者创建新层
                while (level.length > 0) {
                    /* *判断data[i]是哪个level的下层
                     *要求datas是按照childID排序的
                     *level匹配不上会减少level数组数目
                     * */
                    if (datas[i][parentID] == level[level.length - 1][childID]) {
                        datas[i].Children = []
                        level[level.length - 1].Children.push(datas[i])
                        level[level.length - 1].HasChild = true;
                        level[level.length - 1].Expanded = false;
                        level.push(datas[i]);
                        break;
                    } else if (level.length > 1) {
                        level.splice(level.length - 1, 1);
                    } else {
                        break;
                    }
                }

            }
            level[0].Expanded = true //根节点设置成展开
            return level[0]; //返回根节点即可

        }
    }


    /*网格操作*/
    {
        $scope.detail1_copy = function () {
            $scope.FrmInfo = {
                classid: "sale_break_header",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (data) {
                if (data.break_id == undefined || data.break_id == "") {
                    return;
                }
                BasemanService.RequestPost("sale_break_header", "select", {break_id: data.break_id}).then(function (result) {
                    if (data.sale_pi_break_lineofsale_pi_break_headers.length == 0) {
                        return;
                    }
                    $scope.gridSetData("detail1_options", data.sale_pi_break_lineofsale_pi_break_headers);
                })
            });
        };

    }

    $scope.save_before = function () {
        $scope.data.noSave = {
            sale_pi_break_itemofsale_pi_headers: $scope.data.currItem.sale_pi_break_itemofsale_pi_headers,
            sale_pi_item_lineofsale_pi_headers: $scope.data.currItem.sale_pi_item_lineofsale_pi_headers,
        }
        delete $scope.data.currItem.sale_pi_break_itemofsale_pi_headers
        delete $scope.data.currItem.sale_pi_item_lineofsale_pi_headers
    }

    $scope.refresh_after = function () {
        if ($scope.data.noSave != undefined) {
            $scope.data.currItem.sale_pi_break_itemofsale_pi_headers = $scope.data.noSave.sale_pi_break_itemofsale_pi_headers;
            $scope.data.currItem.sale_pi_item_lineofsale_pi_headers = $scope.data.noSave.sale_pi_item_lineofsale_pi_headers;
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
    .controller('sale_break_headerEdit', sale_break_headerEdit)

