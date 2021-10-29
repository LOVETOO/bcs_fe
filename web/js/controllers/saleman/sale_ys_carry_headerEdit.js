var salemanControllers = angular.module('inspinia');
function sale_ys_carry_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_ys_carry_headerEdit = HczyCommon.extend(sale_ys_carry_headerEdit, ctrl_bill_public);
    sale_ys_carry_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_ys_carry_header",
        key: "carry_id",
        wftempid: 10119,
        FrmInfo: {},
        grids: [
            {optionname: 'options_11', idname: 'sale_ys_carry_lineofsale_ys_carry_headers'},
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
        $scope.data.currItem.sale_ys_carry_lineofsale_ys_carry_headers = data;
    };
    //部门
    $scope.Bud_No = function () {
            $scope.FrmInfo = {
                classid: "sale_year_sell_bud_header",
                postdata: {},
                sqlBlock:"1=1 and h.stat = 5 and not exists (select 1 from sale_ys_carry_line l where l.bud_id = h.bud_id )",
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (result) {
                var data2=[];
                data2.push(result);
                var data=$scope.gridGetData("options_11");
                for(var i=0;i<data.length;i++){
                    var isExists = false;
                    var isExists = HczyCommon.isExist(data2,data[i],["bud_no"], ["bud_no"]).exist;
                    if(isExists==true){return;}
                }
                var focusRow=$scope.gridGetRow("options_11");
                focusRow.note=result.note;
                focusRow.creator_bud=result.creator;
                focusRow.sell_year=result.sell_year;
                focusRow.org_id=result.org_id;
                focusRow.org_name=result.org_name;
                focusRow.org_code=result.org_code;
                focusRow.bud_no=result.bud_no;
                focusRow.bud_id=result.bud_id;
                $scope.gridUpdateRow("options_11",focusRow);

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
            headerName: "年度销售预测录入单号", field: "bud_no", editable: true, filter: 'set', width: 300,
            cellEditor: "弹出框",
            action: $scope.Bud_No,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "部门名称", field: "org_name", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "预测年度", field: "sell_year", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "制单人", field: "creator_bud", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 200,
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
    /******************保存校验****************************/
    $scope.validate = function () {
        var errorlist = [];
        // $scope.data.currItem.usd_rate== undefined ? errorlist.push("美元汇率不能为空") : 0;
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
            BasemanService.notice("年度销售预测录入单号不能为空！", "alter-warning");
            return false;
        }
        for(var i=0;i<data.length;i++){
            var msg = [];
            var seq = i + 1;
            if (data[i].bud_no == undefined||data[i].bud_no == "") {
                msg.push("第" + seq + "行年度销售预测录入单号不能为空");
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
    .controller('sale_ys_carry_headerEdit', sale_ys_carry_headerEdit);
