var basemanControllers = angular.module('inspinia');
function customer_user_apply_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    customer_user_apply_headerEdit = HczyCommon.extend(customer_user_apply_headerEdit, ctrl_bill_public);
    customer_user_apply_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "customer_user_apply_header",
        key: "apply_id",
        wftempid: 10124,
        FrmInfo: {},
        grids: [{optionname: 'options_3', idname: 'customer_user_apply_lineofcustomer_user_apply_headers'}]
    };

    /************************系统词汇**************************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        var stats = [];
        for (var i = 0; i < data.dicts.length; i++) {
            object = {};
            object.id = data.dicts[i].dictvalue;
            object.name = data.dicts[i].dictname;
            stats.push(object);
        }
        $scope.stats = stats;
    })
    /***************************弹出框***********************/
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
            $scope.data.currItem.idpath = result.idpath;
        });
    }
    //客户
    $scope.selectcust = function () {
        if ($scope.data.currItem.org_id == 0 || $scope.data.currItem.org_id == undefined) {
            BasemanService.notice("请先选业务部门", "alert-warning");
        }
        $scope.FrmInfo = {
            classid: "customer",
            sqlBlock: "org_id=" + $scope.data.currItem.org_id +
            " or other_org_ids like '%," + $scope.data.currItem.org_id + ",%'"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var data = [];
            var index = $scope.options_3.api.getFocusedCell().rowIndex;
            var node = $scope.options_3.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            data[index].cust_id = result.cust_id;
            data[index].cust_code = result.sap_code;
            data[index].cust_name = result.cust_name;
            data[index].org_id = result.org_id;
            data[index].org_code = result.org_code;
            data[index].org_name = result.org_name;
            data[index].other_org_ids = result.other_org_ids;
            data[index].other_org_codes = result.other_org_codes;
            data[index].other_org_names = result.other_org_names;
            $scope.options_3.api.setRowData(data)
        });
    }
    /***********************网格处理事件***************************/
    //增加行
    $scope.addpo = function () {
        var data = [];
        var node = $scope.options_3.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        item = {
            seq: node.length + 1,
            line_id: node.length + 1,
        };
        data.push(item);
        $scope.options_3.api.setRowData(data);
    };

    //删除行
    $scope.delpo = function () {
        var data = $scope.gridGetData("options_3");
        var rowidx = $scope.options_3.api.getFocusedCell().rowIndex;
        data.splice(rowidx, 1);
        $scope.options_3.api.setRowData(data);
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
    $scope.columns_3 = [
        {
            headerName: "客户SAP编码", field: "cust_code", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            action: $scope.selectcust,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户所在部门", field: "org_name", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",

            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户兼营部门", field: "other_org_names", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_3 = {
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
            var isGrouping = $scope.options_3.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    /** 弹出框*/
    function ButtonCellEditor() {
        ButtonCellEditor.prototype.init = function (params) {
            $div=$('<div  tabindex="0"><div class="input-group" style="width:100%;height:100%;"></div></div>')
            this.params = params;
            this.input = document.createElement("INPUT");
            this.input.className="input-sm form-control"
            if(params.value!=undefined){
                this.input.value = params.value;}
            //this.input.type="text"
            this.input.focus();

            this.A = document.createElement("A");
            this.A.className="input-group-addon"
            if(this.params.column.colDef.action!=undefined){
                this.A.addEventListener ("click", this.params.column.colDef.action);
            }


            this.I = document.createElement("I");
            this.I.className="fa fa-ellipsis-h"

            this.getGui().querySelector('.input-group').appendChild(this.input);
            this.getGui().querySelector('.input-group').appendChild(this.A);
            this.getGui().querySelector('.input-group-addon').appendChild(this.I);
            //this.addGuiEventListener('cellDoubleClicked', this.onKeyDown.bind(this));
        };
        ButtonCellEditor.prototype.getGui = function() {
            return $div[0];
        };

        ButtonCellEditor.prototype.afterGuiAttached = function () {
            this.input.focus();
        };
        ButtonCellEditor.prototype.addDestroyableEventListener = function () {
        };
        ButtonCellEditor.prototype.getValue = function () {
            return this.input.value;
        };
    }
    /**自定义接口框具体实现*/
    for(var i=0;i<$scope.columns_3.length;i++){
        if($scope.columns_3[i].children){
            for(var j=0;j<$scope.columns_3[i].children.length;j++){
                if($scope.columns_3[i].children[j].cellEditor=="弹出框"){
                    $scope.columns_3[i].children[j].cellEditor=ButtonCellEditor;
                }
            }
        }else{
            if($scope.columns_3[i].cellEditor=="弹出框"){
                $scope.columns_3[i].cellEditor=ButtonCellEditor;
            }
        }

    }
    /****************************初始化**********************/
    var myDate = new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,
            create_time: myDate.toLocaleDateString(),
            customer_user_apply_lineofcustomer_user_apply_headers: []
        };
    };
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('customer_user_apply_headerEdit', customer_user_apply_headerEdit);
