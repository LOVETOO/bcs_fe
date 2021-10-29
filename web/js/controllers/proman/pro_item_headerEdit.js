var basemanControllers = angular.module('inspinia');
function pro_item_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    pro_item_headerEdit = HczyCommon.extend(pro_item_headerEdit, ctrl_bill_public);
    pro_item_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "pro_item_header",
        key: "item_h_id",
//        wftempid: 10012,
        FrmInfo: {},
        grids: [
            {
                optionname: 'options_11',
                idname: 'pro_itemofpro_item_headers',
                line: {optionname: "options_12", idname: "pro_item_partofpro_items"}
            },//订单明细  分体机
            {optionname: 'options_13', idname: 'pro_item_box_lineofpro_item_headers'}
        ]
    };
    /******************页面隐藏****************************/
    $scope.show_12 = true;
    $scope.show12 = function () {
        $scope.show_12 = !$scope.show_12;
    };
    /******************词汇值****************************/
    //状态
    $scope.new_stats = [
        {
            id: 1,
            name: "在售"
        }, {
            id: 2,
            name: "预警"
        }, {
            id: 3,
            name: "冻结"
        }];
    $scope.stats = [
        {id: 1, name: "制单"},
        {id: 2, name: "提交"},
        {id: 3, name: "启动"},
        {id: 4, name: "驳回"},
        {id: 5, name: "已审核"},
        {id: 10, name: "红冲"},
        {id: 99, name: "关闭"}
    ];
    $scope.refresh_after=function(){
        $scope.data.currItem.stat=1;
    };
    // 机型类别
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pro_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            //柜型柜量
            $scope.columns_11[0].cellEditorParams.values.push(newobj)
        }
    })
    //柜型 box_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "box_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            //柜型柜量
            $scope.columns_13[0].cellEditorParams.values.push(newobj)
        }
    })
    //面板标准
    BasemanService.RequestPost("Base_search", "searchdict", {dictcode: 'mb_stand'}).then(function (data) {
        $scope.mb_stands = HczyCommon.stringPropToNum(data.dicts);
    });
    //冷量标准
    BasemanService.RequestPost("Base_search", "searchdict", {dictcode: 'cool_stand'}).then(function (data) {
        $scope.cool_stands = HczyCommon.stringPropToNum(data.dicts);
    });
    //机型详细分类
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "typefl"})
        .then(function (data) {
            $scope.typefls = HczyCommon.stringPropToNum(data.dicts);
        });
    //机型分类
    BasemanService.RequestPost("Base_search", "searchdict", {dictcode: 'item_type'}).then(function (data) {
        $scope.item_types = HczyCommon.stringPropToNum(data.dicts);
    })

    //是否可用
    $scope.sub = function () {
        $scope.showType = !$scope.showType;
    };

    /******************弹出框区域****************************/
    //大区
    $scope.area_name = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            sqlBlock: "OrgType = 3",
            backdatas: "orgs"
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.area_name = result.orgname;
            $scope.data.currItem.area_code = result.code;
            $scope.data.currItem.area_id = result.area_id;
        })
    };
    //业务部门
    $scope.org_name = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            sqlBlock: "OrgType = 5",
            backdatas: "orgs"
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_id = result.orgid;
        })
    };
    //业务员
    $scope.sale_man = function () {
        if ($scope.data.currItem.org_name == undefined || $scope.data.currItem.org_name == "") {
            BasemanService.notice("请先选择业务部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            classid: "scpuser",
            postdata: {flag: 10},
            sqlBlock:' scporguser.orgid =' + $scope.data.currItem.org_id,
            backdatas: "users"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.sale_man = result.userid;
        });
    };
    //分类
    $scope.item_type_no = function () {
        $scope.FrmInfo = {
            title: "机构查询",
            is_high: true,
            thead: [{
                name: "产品类别编码",
                code: "item_type_no",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "产品类别名称",
                code: "item_type_name",
                show: true,
                iscond: true,
                type: 'string'
            }],
            classid: "pro_item_type",
            postdata: {},
            sqlBlock: "usable = 2",
            searchlist: ["item_type_no", "item_type_name"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.item_type_no = result.item_type_no;
            $scope.data.currItem.item_type_name = result.item_type_name;
            $scope.data.currItem.item_type_id = Number(result.item_type_id);
        });
    };
    $scope.addline11 = function () {
        $scope.options_11.api.stopEditing(false);
        var data = [];
        var node = $scope.options_11.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        var item = {
            seq: node.length + 1
        };
        data.push(item);
        $scope.options_11.api.setRowData(data);
        $scope.data.currItem.pro_itemofpro_item_headers = data;
    };
    $scope.addline12 = function () {
        if (!$scope.options_11.api.getFocusedCell()) {
            BasemanService.notify(notify, "请点击行对应分体机", "alert-info", 1000);
            return;
        }
        var rowidx = $scope.options_11.api.getFocusedCell().rowIndex;
        $scope.options_12.api.stopEditing(false);
        var data = [];
        var node = $scope.options_12.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        var item = {
            seq: node.length + 1
        };
        data.push(item);
        $scope.options_12.api.setRowData(data);
        $scope.data.currItem.pro_itemofpro_item_headers[rowidx].pro_item_partofpro_items = data;
    };
    $scope.addline13 = function () {
        $scope.options_13.api.stopEditing(false);
        var data = [];
        var node = $scope.options_13.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        var item = {
            seq: node.length + 1
        };
        data.push(item);
        $scope.options_13.api.setRowData(data);
        $scope.data.currItem.pro_item_box_lineofpro_item_headers = data;
    };
    //配件分类
    $scope.part_class = function () {
        $scope.FrmInfo = {
            title: "机构查询",
            is_high: true,
            thead: [{
                name: "分类",
                code: "part_class",
                show: true,
                iscond: true,
                type: 'string'
            }
                , {
                    name: "描述",
                    code: "part_desc",
                    show: true,
                    iscond: true,
                    type: 'string'
                }
                , {
                    name: "英文名",
                    code: "part_en_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }
            ],
            classid: "base_pro_part",
            postdata: {},
            searchlist: ["part_class", "part_desc", "part_en_name"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (data) {
            var focusData = $scope.gridGetRow('options_12');
            focusData.part_class = data.part_class;
            focusData.part_desc = data.part_desc;
            focusData.part_en_name = data.part_en_name;
            focusData.price = 0;
            $scope.gridUpdateRow('options_12', focusData);
        });
    };
    /*********************网格处理事件*****************************/
    $scope.rowClicked11 = function (event) {
        //配件
        if (event.data) {
            if ($scope.options_12.api.getFocusedCell()) {
                var rowidx = $scope.options_11.api.getFocusedCell().rowIndex;
                if ($scope.data.currItem.pro_itemofpro_item_headers[rowidx].pro_type != $scope.data.currItem.pro_itemofpro_item_headers[rowidx].pro_item_partofpro_items[rowidx].pro_type) {
                    $scope.options_12.api.setRowData(event.data.pro_item_partofpro_items);
                }
            } else {
                $scope.options_12.api.setRowData(event.data.pro_item_partofpro_items);
            }
        }
    };
    $scope.save_before = function () {
        delete $scope.data.currItem.pro_item_partofpro_items;
        var postdata = $scope.data.currItem;
        postdata.item_type_id = $scope.data.currItem.item_type_id;
        postdata.bigc_id = $scope.data.currItem.item_type_id;
    }
    /******************保存校验区域****************************/
    /******************网格定义区域****************************/
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
    //分体机
    $scope.columns_11 = [
        {
            headerName: "机型类别", field: "pro_type", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分体机编码", field: "item_code", editable: true, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分体机描述", field: "item_name", editable: true, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "型号", field: "spec", editable: true, filter: 'set', width: 85,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "体积(m3)", field: "volume", editable: true, filter: 'set', width: 85,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "毛重(kg)", field: "gw", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "净重(kg)", field: "nw", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "压缩机编码", field: "comp_code", editable: true, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "压缩机名称", field: "comp_name", editable: true, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "包装尺寸", field: "bzcc", editable: true, filter: 'set', width: 85,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "材料成本", field: "pdm_pri", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
    ];
    $scope.options_11 = {
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
        rowClicked: $scope.rowClicked11,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
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
    //易损件
    $scope.columns_12 = [
        {
            headerName: "序号", field: "seq", editable: true, filter: 'set', width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "配件分类", field: "part_class", editable: true, filter: 'set', width: 100,
            cellEditor: "弹出框",
            action: $scope.part_class,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "配件描述", field: "part_desc", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "英文名", field: "part_en_name", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "数量", field: "qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        , {
            headerName: "单价", field: "price", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        , {
            headerName: "是否必选项", field: "is_need", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 1, desc: "否"}, {value: 2, desc: "是"}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    $scope.options_12 = {
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
            var isGrouping = $scope.options_12.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    //分体机
    $scope.columns_13 = [
        {
            headerName: "柜型", field: "box_type", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "装柜数量", field: "qty", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: true, filter: 'set', width: 100,
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
            var isGrouping = $scope.options_12.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    /******************界面初始化****************************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            stat: 1
        };
    };
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('pro_item_headerEdit', pro_item_headerEdit);
