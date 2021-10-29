var salemanControllers = angular.module('inspinia');
function po_contract_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    po_contract_headerEdit = HczyCommon.extend(po_contract_headerEdit, ctrl_bill_public);
    po_contract_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "po_contract_header",
        key: "pc_id",
        wftempid: 10164,
        FrmInfo: {},
        grids: [
            {optionname: 'options_11', idname: 'po_contract_lineofpo_contract_headers'},
        ]
    };
    // $scope.save_before=function(){
    //     }
    /******************界面初始化****************************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            stat: 1,
            cust_id: 0,
            // curr_code:
        };
    };
    /***************************词汇值***************************/
    // 订单类型词汇
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.wfflag = data.dictcode;
            $scope.stats = HczyCommon.stringPropToNum(data.dicts);
        });
    //币种
    BasemanService.RequestPostAjax("base_search", "searchcurrency", {dictcode: "base_currency"}).then(function (data) {
//        $scope.curr_code=data.dictcode;
        $scope.base_currencys = HczyCommon.stringPropToNum(data.base_currencys);
    });

    $scope.currency_change = function () {
        for (var i = 0; i < $scope.base_currencys.length; i++) {
            if ($scope.data.currItem.currency_code == $scope.base_currencys[i].currency_code) {
                $scope.data.currItem.currency_id = $scope.base_currencys[i].currency_id;
                $scope.data.currItem.currency_name = $scope.base_currencys[i].currency_name;
                break;
            }

        }
    }
    $scope.validate = function () {
        var errorlist = [];
        var data = $scope.gridGetData("options_11");
        if(data.length==0){
            BasemanService.notice("合同明细不能为空", "alert-warning");
            return;
        }
        for(var i=0;i<data.length;i++){
            if(data[i].po_item_code==""||data[i].po_item_code==undefined){
                errorlist.push("明细物料编码不能为空")
            }
            if(data[i].uom_name==""||data[i].uom_name==undefined){
                errorlist.push("明细物料单位不能为空")
            }
            if(data[i].price==""||data[i].price==undefined){
                errorlist.push("明细物料单价不能为空")
            }
        }
        if (errorlist.length) {
            BasemanService.notify(notify,errorlist, "alert-danger");
            return false;
        }
        return true;
    }
    $scope.addline11 = function () {
        var data = $scope.gridGetData("options_11");
        var item = {seq: data.length + 1};
        data.push(item);
        $scope.options_11.api.setRowData(data);
    }
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

    /******************弹出框******************/
    //档案单号
    $scope.selectvender = function () {
        if($scope.data.currItem.stat!=1){
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

            }, {
                name: "银行名称",
                code: "bank_name",
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
    $scope.selectitem = function () {
        $scope.FrmInfo = {
            title: "外购件",
            thead: [{
                name: "物料编码",
                code: "po_item_code",
                show: true,
                iscond: true,
                type: 'string'

            },{
                name: "外购件名称",
                code: "po_item_name",
                show: true,
                iscond: true,
                type: 'string'

            }],

            is_custom_search: true,
            is_high:true,
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
            data[index].po_item_id = result.po_item_id;
            data[index].po_item_name = result.po_item_name;
            data[index].po_item_code = result.po_item_code;
            $scope.options_11.api.setRowData(data)

        });
    }
    $scope.selectuom = function () {
        $scope.FrmInfo = {
            title: "单位",
            thead: [{
                name: "单位编码",
                code: "uom_code",
                show: true,
                iscond: true,
                type: 'string'

            },{
                name: "单位名称",
                code: "uom_name",
                show: true,
                iscond: true,
                type: 'string'

            }],

            is_custom_search: true,
            is_high:true,
            classid: "uom"

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var data = [];
            var index = $scope.options_11.api.getFocusedCell().rowIndex;
            var node = $scope.options_11.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            data[index].uom_id = result.uom_id;
            data[index].uom_name = result.uom_name;
            data[index].uom_code = result.uom_code;
            $scope.options_11.api.setRowData(data)

        });
    }
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
            headerName: "合同编号", field: "pc_no", editable: false, filter: 'set', width: 150,hide:true,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "物料编码", field: "po_item_code", editable: true, filter: 'set', width: 100,
            cellEditor: "弹出框",
            action: $scope.prod_code11,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            action:$scope.selectitem,
        },
        {
            headerName: "外购件名称", field: "po_item_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单位", field: "uom_name", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            action:$scope.selectuom,
        },
        {
            headerName: "单价", field: "price", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            // action: $scope.item_code11,
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
    .controller('po_contract_headerEdit', po_contract_headerEdit);
