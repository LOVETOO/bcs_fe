var salemanControllers = angular.module('inspinia');
function sale_material_apply_headerrEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_material_apply_headerrEdit = HczyCommon.extend(sale_material_apply_headerrEdit, ctrl_bill_public);
    sale_material_apply_headerrEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_material_apply_header",
        key: "ma_id",
        wftempid: 10162,
        FrmInfo: {},
        grids: [
            {optionname: 'options_11', idname: 'sale_material_apply_lineofsale_material_apply_headers'},
        ]
    };
    //是否引入
    $scope.sub = function () {
        $scope.showType = !$scope.showType;
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
    /***************************词汇值***************************/
    // 订单类型词汇
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.stats = HczyCommon.stringPropToNum(data.dicts);
        });
    /********************************弹出框******************************/
    //部门
    $scope.prod_code11 = function () {
        $scope.FrmInfo = {
            classid: "pro_item_header",
            postdata: {}
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var data = $scope.gridGetData("options_11");
            var index = $scope.options_11.api.getFocusedCell().rowIndex;
            data[index].prod_code = result.item_h_code;
            data[index].prod_name = result.item_h_name;
            data[index].prod_id = result.item_h_id;
            $scope.options_11.api.setRowData(data);

        });
    };
    $scope.item_code11 = function () {
        var data = $scope.gridGetData("options_11");
        var index = $scope.options_11.api.getFocusedCell().rowIndex;
        if (data[index].prod_code == "" || data[index].prod_code == undefined) {
            BasemanService.notice("请先选择标机", "alert-info");
            return;
        }
        $scope.FrmInfo = {
            is_custom_search: true,
            is_high: true,
            title: "物料",
            thead: [
                {
                    name: "物料编码",
                    code: "itemcode",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "物料名称",
                    code: "itemname",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            classid: "sale_material_apply_header",
            postdata: {item_h_code: data[index].prod_code},
            action: "getbom"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            data[index].item_name = result.itemname;
            data[index].item_code = result.itemcode;
            data[index].item_id = result.itemid;
            $scope.options_11.api.setRowData(data);
        });
    };
    $scope.selectorg = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
            backdatas: "orgs",
            sqlBlock: "( idpath like '%211%' or idpath like '%273%') and 1=1 and stat =2 and OrgType = 5",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_id = result.orgid;
        });
    };
    //业务员查询
    $scope.scpuser = function () {
        if ($scope.data.currItem.org_id == undefined || $scope.data.currItem.org_id == "") {
            BasemanService.notice("请先选择业务部门", "alert-warning")
            return;
        }
        $scope.FrmInfo = {
            classid: "scpuser",
            postdata: {
                flag: 10
            },
            backdatas: "users",
            sqlBlock: " scporguser.orgid =" + parseInt($scope.data.currItem.org_id || 0)
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.sales = result.userid;
        });
    };
    /**----------------------------弹出框-----------------------------*/
    $scope.addline11 = function () {
        var data = $scope.gridGetData("options_11");
        var item = {seq: 0};
        data.push(item);
        $scope.options_11.api.setRowData(data);
    };
    $scope.delline11 = function () {
        var data = [];
        var rowidx = $scope.options_11.api.getFocusedCell().rowIndex;
        var node = $scope.options_11.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_11.api.setRowData(data);
    };
    /****************************提交校验******************************/
    $scope.wfstart_validDate =function(){
        var data = $scope.gridGetData("options_11");
        if(data.length==0){
            BasemanService.notice("标机编码不能为空！", "alter-warning");
            return false;
        }
        return true;
    };
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
    //明细
    $scope.columns_11 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
//            cellEditor: "弹出框",
//            action: $scope.org_name,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "标机编码", field: "prod_code", editable: true, filter: 'set', width: 100,
            cellEditor: "弹出框",
            action: $scope.prod_code11,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "标机名称", field: "prod_name", editable: true, filter: 'set', width: 160,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "要求到货日期", field: "req_date", editable: true, filter: 'set', width: 150,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料编码", field: "item_code", editable: true, filter: 'set', width: 120,
            cellEditor: "弹出框",
            action: $scope.item_code11,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料名称", field: "item_name", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "申请数量", field: "qty", editable: true, filter: 'set', width: 110,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已消耗数量", field: "prod_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "是否发布到公司", field: "published", editable: true, filter: 'set', width: 130,
            cellEditor: "复选框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发布人", field: "pub_man", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发布时间", field: "pub_time", editable: true, filter: 'set', width: 110,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "SAP订单号", field: "sap_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "SAP订单行号", field: "sap_seq", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "备注", field: "note", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
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

    $scope.initdata();

}

//加载控制器
salemanControllers
    .controller('sale_material_apply_headerrEdit',sale_material_apply_headerrEdit);
