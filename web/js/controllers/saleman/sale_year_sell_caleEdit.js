var salemanControllers = angular.module('inspinia');
function sale_year_sell_caleEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_year_sell_caleEdit = HczyCommon.extend(sale_year_sell_caleEdit, ctrl_bill_public);
    sale_year_sell_caleEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_year_sell_cale",
        key: "sell_id",
        wftempid: 10117,
        FrmInfo: {},
        grids: [
            {optionname: 'options_11', idname: 'sale_year_sell_cale_itemofsale_year_sell_cales'},
        ]
    };
    /******************页面隐藏****************************/
    $scope.show_11 = true;
    $scope.show11 = function () {
        $scope.show_11 = !$scope.show_11;
    };
    //增加当前行、删除当行前
    $scope.additem = function () {
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
        $scope.data.currItem.sale_year_sell_cale_itemofsale_year_sell_cales = data;
    };
    //部门
    $scope.org_name = function () {
            $scope.FrmInfo = {
                classid: "scporg",
                postdata: {},
                backdatas: "orgs",
                sqlBlock:"stat =2 and OrgType = 5",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                var data = [];
                var index = $scope.options_11.api.getFocusedCell().rowIndex;
                var node = $scope.options_11.api.getModel().rootNode.childrenAfterSort;
                for (var i = 0; i < node.length; i++) {
                    data.push(node[i].data)
                }
                data[index].org_name = result.orgname;
                data[index].org_code = result.code;
                data[index].org_id = result.orgid;
                //清空业务员
                data[index].sales_user_id = "";
                $scope.options_11.api.setRowData(data);
                $scope.data.currItem.sale_year_sell_cale_itemofsale_year_sell_cales = data;
               
                
            });
        };
    //业务员
    $scope.sales_user_id = function () {
         if($scope.data.currItem.sale_year_sell_cale_itemofsale_year_sell_cales[$scope.options_11.api.getFocusedCell().rowIndex].org_id==undefined||$scope.data.currItem.sale_year_sell_cale_itemofsale_year_sell_cales[$scope.options_11.api.getFocusedCell().rowIndex].org_id==""){
           BasemanService.notice("请选择部门！", "alter-warning")
           return;
         }
         $scope.FrmInfo = {
             classid: "scpuser",
             postdata: {
                 flag: 10
             },
             backdatas: "users",
         };
         $scope.FrmInfo.sqlBlock = 'scporguser.orgid ='+$scope.data.currItem.sale_year_sell_cale_itemofsale_year_sell_cales[$scope.options_11.api.getFocusedCell().rowIndex].org_id;
         BasemanService.open(CommonPopController, $scope)
             .result.then(function (result) {
                var data = [];
                var index = $scope.options_11.api.getFocusedCell().rowIndex;
                var node = $scope.options_11.api.getModel().rootNode.childrenAfterSort;
                for (var i = 0; i < node.length; i++) {
                    data.push(node[i].data)
                }
                data[index].sales_user_id = result.userid;
                $scope.options_11.api.setRowData(data);
                $scope.data.currItem.sale_year_sell_cale_itemofsale_year_sell_cales = data;

         });
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
            headerName: "部门名称", field: "org_name", editable: true, filter: 'set', width: 260,
            cellEditor: "弹出框",
            action: $scope.org_name,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务员", field: "sales_user_id", editable: true, filter: 'set', width: 260,
            cellEditor: "弹出框",
            action: $scope.sales_user_id,
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
    /******************词汇值****************************/
    //信用证类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.stats = HczyCommon.stringPropToNum(data.dicts);
        });
    //信用证类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "lc_type"})
        .then(function (data) {
            $scope.lc_types = HczyCommon.stringPropToNum(data.dicts);
        });
    //LC受益人--回款组织
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "return_ent_type"})
        .then(function (data) {
            $scope.return_ent_types = HczyCommon.stringPropToNum(data.dicts);
        });
    /******************保存校验****************************/
    $scope.validate = function () {
        var errorlist = [];
        $scope.data.currItem.usd_rate== undefined ? errorlist.push("美元汇率不能为空") : 0;
        $scope.data.currItem.eur_rate== undefined ? errorlist.push("欧元汇率不能为空") : 0;
        if (errorlist.length) {
            BasemanService.notice(errorlist, "alert-warning");
            return false;
        }
        return true;
    };
    /*********************网格处理事件*****************************/
    $scope.wfstart_validDate =function(){
        var data = $scope.gridGetData("options_11");
        if(data.length==0){
            BasemanService.notice("部门,业务员不能为空！", "alter-warning");
            return false;
        }
        for(var i=0;i<data.length;i++){
            var msg = [];
            var seq = i + 1;
            if (data[i].org_name == undefined||data[i].org_name == "") {
                msg.push("第" + seq + "行部门不能为空");
            }
            if (data[i].sales_user_id == undefined||data[i].sales_user_id == "") {
                msg.push("第" + seq + "行业务员不能为空");
            }
            if (msg.length > 0) {
                BasemanService.notice(msg);
                return false;
            }
        }
        return true;
    }
    /******************界面初始化****************************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            stat: 1,
            cust_id: 0,

        };
    };
    $scope.initdata();

}

//加载控制器
salemanControllers
    .controller('sale_year_sell_caleEdit', sale_year_sell_caleEdit);
