var finmanControllers = angular.module('inspinia');
function sale_ship_item_line_seach($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_ship_item_line_seach = HczyCommon.extend(sale_ship_item_line_seach, ctrl_bill_public);
    sale_ship_item_line_seach.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_package_header",
        /*     key: "funds_id",*/
        wftempid: 10008,
        FrmInfo: {

        },
        grids: [{optionname: 'options_11', idname: 'sale_package_headers'},
            {potionname:'options_11', idname:'sale_package_headers'}/*, {
         optionname: 'options_12',
         idname: 'fin_funds_kind_lineoffin_funds_headers'
         }, {optionname: 'options_13', idname: 'fin_funds_xypmoffin_funds_headers'}, {
         optionname: 'options_14',
         idname: 'fin_funds_sapoffin_funds_headers'
         }*/]
    };


    /*查询*/
    $scope.search = function () {
        var items="";
        var sqlBlock=" 1=1 ";
        var items=$scope.gridGetData("options_12");
        var str="'0'";
        for(var i=0;i<items.length;i++){
            if(items[i].pc_no!=undefined&&items[i].pc_no.length>0){
                str += ",'"+items[i].pc_no+"'";
            }
        }
        if(str!="'0'"){
            sqlBlock+=" and pc_no in ("+str+")";
        }else{
            sqlBlock=" 1=1 ";
        }
       // sqlBlock="";
        //BasemanService.getSqlWhereBlock(sqlBlock);
        var postdata = { flag:66,
            sqlwhere  : sqlBlock,
            org_code: $scope.data.currItem.org_code,
            org_id: $scope.data.currItem.org_id,
            cust_id: $scope.data.currItem.cust_id,
            cust_code: $scope.data.currItem.cust_code,
            start_date: $scope.data.currItem.startdate,
            pc_no:$scope.data.currItem.pc_no,
            end_date: $scope.data.currItem.enddate
        };
        BasemanService.RequestPost("sale_package_header", "search", postdata)
            .then(function(data){
                $scope.data.currItem.sale_package_headers=data.sale_package_headers;
                $scope.options_11.api.setRowData(data.sale_package_headers);
            });
    }
    //清空
    $scope.clear_cust = function (){
        $scope.data.currItem.cust_name="";
        $scope.data.currItem.cust_id="";
    }
    $scope.clear_org = function (){
        $scope.data.currItem.org_name="";
        $scope.data.currItem.org_id="";
    }
    $scope.selectcode = function () {

        $scope.FrmInfo = {
            classid: "scporg",
            postdata:{},
            backdatas:"orgs",
            sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = result.orgid;
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            /*$scope.data.currItem.cust_id = result.cust_id;*/
        });

    }

    $scope.selectcodedq = function () {

        $scope.FrmInfo = {
            classid: "scporg",
            postdata:{},
            backdatas:"orgs"
            /*sqlBlock: "org_id = " + $scope.data.currItem.org_id*/
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.area_id = result.areaid;
            $scope.data.currItem.org_codedq = result.areacode;
            $scope.data.currItem.org_namedq = result.areaname;
            /*$scope.data.currItem.cust_id = result.cust_id;*/
        });

    }


    $scope.selectcust = function () {

        $scope.FrmInfo = {
            classid: "customer",
            postdata:{},
            backdatas:"customers"
            /*sqlBlock: "org_id = " + $scope.data.currItem.org_id*/
        };

        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_id = result.cust_id;
        });

    }
    /**********************隐藏、显示*************************/
    $scope.show_11 = false;
    $scope.show11 = function () {
        $scope.show_11 = !$scope.show_11;
    };
    $scope.show_12 = false;
    $scope.show12 = function () {
        $scope.show_12 = !$scope.show_12;
    };

    //隐藏区域
    $scope.show_11 = false;
    $scope.show_sap = function () {
        $scope.show_11 = !$scope.show_11;
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
    //单据明细
    $scope.columns_11 = [
        {
            headerName: "最后发货时间", field: "transportdate", editable: false, filter: 'set', width: 140,
            cellEditor: "年月日",
            /*            cellEditorParams: {
             values: [{value: "1", desc: "空调组织"}]
             },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "商品批号", field: "pc_no", editable: false, filter: 'set', width: 120,
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
    //产品部信息
    $scope.columns_12 = [
        {
            headerName: "批次号", field: "pc_no", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            /*            cellEditorParams: {
             values: [{value: "1", desc: "空调组织"}]
             },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
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
   /* $scope.initdata();
   */$timeout(
        function () {
            for(var i=0;i<5;i++){
                $scope.gridAddItem("options_12");
            }
        },10
    )

}

//加载控制器
finmanControllers
    .controller('sale_ship_item_line_seach', sale_ship_item_line_seach);
