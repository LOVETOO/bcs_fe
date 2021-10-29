var salemanControllers = angular.module('inspinia');
function sale_po_purchase_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_po_purchase_headerEdit = HczyCommon.extend(sale_po_purchase_headerEdit, ctrl_bill_public);
    sale_po_purchase_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "po_purchase_header",
        key: "po_id",
        wftempid: 10163,
        FrmInfo: {},
        grids: [{optionname: 'options_11', idname: 'po_purchase_lineofpo_purchase_headers'}]
    };
    /******************界面初始化****************************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD'),
            stat: 1,
            curr_code: "CNY",
        };
    };
    $scope.save_before = function () {
        $scope.data.currItem.po_purchase_lineofpo_purchase_headers = $scope.gridGetData("options_11");
    }
    $scope.wfstart1 = function () {
        var postdata = {po_id: $scope.data.currItem.po_id};
        BasemanService.RequestPost("po_purchase_header", "commitcheck", postdata)
            .then(function (data) {
                $scope.wfstart()
            });
    }
    /***************************词汇值***************************/
    // 订单类型词汇
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.wfflag = data.dictcode;
            $scope.stats = HczyCommon.stringPropToNum(data.dicts);
        });
    //采购类型
    $scope.po_types = [{dictvalue: 1, dictname: "客户采购"}, {dictvalue: 2, dictname: "统一采购"}];

    //网格明细新增
    $scope.addline11 = function () {
        var data = $scope.gridGetData("options_11");
        var item = {seq: data.length + 1};
        data.push(item);
        $scope.options_11.api.setRowData(data);
    }
    //删除明细
    $scope.delline11 = function () {
        var data = [];
        var rowidx = $scope.options_11.api.getFocusedCell().rowIndex;
        var node = $scope.options_11.api.getModel().rootNode.childrenAfterSort;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_11.api.setRowData(data);
    }

    /******************弹出框*****************/
    //部门
    $scope.selectorg = function () {
        if ($scope.data.currItem.stat != 1) {
            return
        }
        $scope.FrmInfo = {

            classid: "scporg",
            postdata: {},
            sqlBlock: "stat =2 and OrgType = 5",
            backdatas: "orgs",

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_id = result.orgid;

        });
    }
    //档案单号
    $scope.selectvender = function () {
        if ($scope.data.currItem.stat != 1) {
            return
        }
        $scope.FrmInfo = {
            is_high: true,
            is_custom_search: true,
            title: "供应商",
            thead: [{
                name: "供应商编码",
                code: "vender_code",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "供应商名称",
                code: "vender_name",
                show: true,
                iscond: true,
                type: 'string'

            }],

            classid: "sale_vender"
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            for (name in result) {
                $scope.data.currItem[name] = result[name];
            }
        });
    }
    //客户
    $scope.selectcust = function () {
        if ($scope.data.currItem.stat != 1) {
            return
        }
        if ($scope.data.currItem.org_code == undefined || $scope.data.currItem.org_code == "") {
            BasemanService.notice("请先部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            title: "客户",
            thead: [{
                name: "客户编码",
                code: "cust_code",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "客户名称",
                code: "cust_name",
                show: true,
                iscond: true,
                type: 'string'
            }],
            is_custom_search: true,
            is_high: true,
            classid: "customer",
            sqlBlock: "org_id=" + $scope.data.currItem.org_id,
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;
        });
    }
    $scope.selectman = function () {
        if ($scope.data.currItem.stat != 1) {
            return
        }
        if ($scope.data.currItem.org_code == undefined || $scope.data.currItem.org_code == "") {
            BasemanService.notice("请先部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            is_high: true,
            is_custom_search: true,
            title: "申请人",
            thead: [{
                name: "用户编码",
                code: "userid",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "用户名称",
                code: "username",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "机构路径",
                code: "namepath",
                show: true,
                iscond: true,
                type: 'string'
            }],
            postdata:{flag:10},
            sqlBlock: "orgid=" + $scope.data.currItem.org_id,
            backdatas: "users",
            classid: "scpuser",
            searchlist: ["userid", "username"]
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.po_man = result.username
        });
    }
   $scope.selectitem = function () {
        $scope.FrmInfo = {
            title: "物料",
            thead: [{
                name: "物料编码",
                code: "po_item_code",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name : "物料名称",
                code: "po_item_name",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "单位",
                code: "uom_name",
                show: true,
                iscond: true,
                type: 'string'

            }],
            is_custom_search: true,
            is_high: true,
            classid: "po_item"

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var data = [];
            var index = $scope.options_11.api.getFocusedCell().rowIndex;
            var node = $scope.options_11.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            var postdata = {po_item_code: result.po_item_code,
                vender_id:$scope.data.currItem.vender_id,
                vender_code:$scope.data.currItem.vender_code,
                curr_code:$scope.data.currItem.curr_code,
            }
            BasemanService.RequestPost("po_contract_header", "getcontractprice", postdata)
                .then(function (data1) {
                    data[index].price = data1.price;
                    data[index].uom_name = result.uom_name;
                    data[index].po_item_code = result.po_item_code;
                    data[index].po_item_name = result.po_item_name;
                    $scope.options_11.api.setRowData(data);
                });
        });
    }
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
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料编码", field: "po_item_code", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            action: $scope.selectitem,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料名称", field: "po_item_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单位", field: "uom_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单价", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "数量", field: "qty", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
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
    .controller('sale_po_purchase_headerEdit', sale_po_purchase_headerEdit);
