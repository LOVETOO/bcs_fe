var basemanControllers = angular.module('inspinia');
function fin_lc_allot_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_lc_allot_headerEdit = HczyCommon.extend(fin_lc_allot_headerEdit, ctrl_bill_public);
    fin_lc_allot_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_lc_allot_header",
        key: "lc_allot_id",
        wftempid: 10012,
        FrmInfo: {},
        grids: [
            {optionname: 'options_11', idname: 'fin_lc_allot_lineoffin_lc_allot_headers'},
            {optionname: 'options_12', idname: 'fin_lc_allot_prod_lineoffin_lc_allot_headers'},
            {optionname: 'options_13', idname: 'fin_lc_allot_reduce_lineoffin_lc_allot_headers'}
        ]
    };
    /******************页面隐藏****************************/
    $scope.show_11 = false;
    $scope.show11 = function () {
        $scope.show_11 = !$scope.show_11;
    };
    $scope.show_12 = false;
    $scope.show12 = function () {
        $scope.show_12 = !$scope.show_12;
    };
    $scope.show_13 = false;
    $scope.show13 = function () {
        $scope.show_13 = !$scope.show_13;
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
    //金额分配明细
    $scope.columns_11 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "信用证付款总额", field: "pi_lc_amt", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已分配信用证金额", field: "amt_finished", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分配金额", field: "amt", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发货金额", field: "send_amt", editable: false, filter: 'set', width: 85,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已核销金额", field: "reduce_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
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
    //生产单分配明细
    $scope.columns_12 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "形式发票单号", field: "pi_no", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产单号", field: "prod_no", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产单应分配金额", field: "amt", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已分配金额", field: "alloed_amt", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分配金额", field: "prod_amt", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
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

    //待核销明细
    $scope.columns_13 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "基础付款方式", field: "pay_type", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "对应单据号", field: "source_bill_no", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "金额", field: "amount", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "已核销金额", field: "reduce_amt", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "此次分配金额", field: "allot_amt", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发票流水号", field: "invoice_no", editable: true, filter: 'set', width: 200,
            cellEditor: "弹出框",
            action: $scope.picolumn13,
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
            var isGrouping = $scope.options_13.columnApi.getRowGroupColumns().length > 0;
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
    /******************弹出框区域****************************/
    //查询业务部门
    $scope.openCPCOrgFrm = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
            sqlBlock: " orgtype=5 ",
            backdatas: "orgs",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = result.orgid;
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
        });
    };
    //业务员查询
    $scope.openSalesUserFrm = function () {
        if ($scope.data.currItem.org_name == undefined) {
            BasemanService.notice("请先选择业务部门", "alert-warning");
            return;
        }
        return $modal.open({
            templateUrl: "views/common/Pop_Common.html",
            controller: function ($scope, $modalInstance) {
                $scope.FrmInfo = {
                    title: "业务员查询",
                    is_high: true,
                    thead: [{
                        name: "用户ID",
                        code: "userid",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "用户名",
                        code: "username",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }]
                };
                $scope.ok = function (index) {
                    $modalInstance.close($scope.item);
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
                $scope.search = function () {
                    //配件信息,cust_id:$scope.customer.cust_id
                    if (!$scope.data.currItem.org_id)$scope.data.currItem.org_id = 0;
                    var sqlWhere = BasemanService.getSqlWhere(["userid", "username"], $scope.searchtext)
                    sqlWhere = sqlWhere + "exists(select 1 from scporguser where scpuser.sysuserid=sysuserid and orgid="
                        + $scope.data.currItem.org_id + ")";
                    var postdata = {sqlwhere: sqlWhere, flag: 2, org_id: $scope.data.currItem.org_id};

                    var promise = BasemanService.RequestPost("CPCAllUser", "search", postdata);
                    promise.then(function (data) {
                        $scope.items = data.users;
                    });
                }
                $scope.addLine = function (index, $event) {
                    $($event.currentTarget).addClass("info").siblings("tr").removeClass("info");
                    $modalInstance.close($scope.items[index]);
                };
                $scope.addConfirm = function (index) {
                    $modalInstance.close($scope.items[index]);
                }
            },
            scope: $scope
        }).result.then(function (result) {
            $scope.data.currItem.sales_user_id = result.userid;
        });
    };
    //信用证查询
    $scope.openLcNoSearchFrm = function () {
        $scope.FrmInfo = {
            classid: "fin_lc_bill",
            sqlBlock: " stat=5 and is_money_over<>2",
            postdata: {
                flag: 10
            }
        };
        BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
            delete  result.stat;
            delete  result.note;
            delete  result.wfid;
            delete  result.wfflag;
            delete  result.wfid;
            delete  result.deliver_amt;
            delete  result.amt_dist;
            result.amt_deliver = result.deliver_amt
            result.lc_amt = result.amt;
            result.amt = result.amt || 0 - result.amt_dist || 0;
            HczyCommon.stringPropToNum(result)
            for (var name in result) {
                if (!( result[name] in Array))
                    $scope.data.currItem[name] = result[name];
            }
        })
    };
    //增加行-形式发票号查询
    $scope.additem = function () {
        if ($scope.data.currItem.org_name == undefined) {
            BasemanService.notice("请先选择业务部门", "alert-warning");
            return;
        }
        var data = $scope.gridGetData("options_11");
        var pi_id = "-1";
        for (i = 0; i < data.length; i++) {
            pi_id = data[i].pi_id + "," + pi_id;
        }
        $scope.FrmInfo = {
            title: "形式发票",
            is_high: true,
            thead: [
                {
                    name: "形式发票",
                    code: "pi_no",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "产品大类",
                    code: "item_type_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户名称",
                    code: "cust_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                },
                {
                    name: "单据日期",
                    code: "pi_date",
                    show: true,
                    iscond: true,
                    type: 'date'
                },
                {
                    name: "部门",
                    code: "org_name",
                    show: true,
                    iscond: false,
                    type: 'string'
                },
                {
                    name: "PI总金额",
                    code: "amt_total",
                    show: true,
                    iscond: false,
                    type: 'string'
                }, {
                    name: "付款方式",
                    code: "payment_type_name",
                    show: true,
                    iscond: false,
                    type: 'string'
                }, {
                    name: "备注",
                    code: "note",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            is_custom_search: true,
            classid: "sale_pi_header",
            postdata: {
                flag: 1
            },
            sqlBlock: "",
        };
        if ($scope.data.currItem.org_id == undefined) $scope.data.currItem.org_id = 0;
        if ($scope.data.currItem.cust_id == undefined)$scope.data.currItem.cust_id = 0;
        $scope.FrmInfo.sqlBlock = "a.org_id = " + $scope.data.currItem.org_id + " and a.cust_id = "
            + $scope.data.currItem.cust_id + " and nvl(a.bill_flag,0) not in ( 2,3)"
            + "and a.pi_id not in(" + pi_id + ")";
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var node = $scope.options_11.api.getModel().rootNode.allLeafChildren;
            var data = [];
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            }
            var tempobj = new Object();
            $scope.pi_id = $scope.pi_id + "," + result.pi_id;
            tempobj.seq = node.length + 1;
            tempobj.pi_id = result.pi_id;
            tempobj.amt_finished = result.amt_finished;
            tempobj.amt = result.pi_lc_amt - result.amt_finished;
            tempobj.pi_lc_amt = result.pi_lc_amt;
            tempobj.pi_no = result.pi_no;
            tempobj.send_amt = result.send_amt;
            tempobj.reduce_amt = result.reduce_amt;
            tempobj.note = result.note;
            $scope.pi_id = result.pi_id + "," + pi_id;
            $scope.options_11.api.stopEditing(false);
            data.push(tempobj);
            $scope.options_11.api.setRowData(data);
            $scope.data.currItem.fin_lc_allot_lineoffin_lc_allot_headers = data;
        });
    };
    $scope.delitem = function () {
        var data = [];
        var rowidx = $scope.options_11.api.getFocusedCell().rowIndex;
        var node = $scope.options_11.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_11.api.setRowData(data);
        $scope.data.currItem.fin_lc_allot_lineoffin_lc_allot_headers = data;
        var griddata = $scope.gridGetData("options_11");
        $scope.deloptions_21(griddata[rowidx].pi_no);
    };
    $scope.deloptions_21 = function (pi_no) {
        var data = $scope.gridGetData("options_12");
        for (var i = 0; i < data.length; i++) {
            if (data[i].pi_no == pi_no) {
                data.splice(i, 1);
            }
        }
        for (var i = 0; i < data.length; i++) {
            data.seq = i + 1;
        }
        $scope.options_12.api.setRowData(data);
    };
    //增加行-生产单
    $scope.additem2 = function (length) {
        var data = $scope.data.currItem.fin_lc_allot_lineoffin_lc_allot_headers;
        if (data.length == 0 || (data[0].pi_no == "" || data[0].pi_no == undefined)) {
            BasemanService.notice("'金额分配明细'中PI号为空，请选择PI号", "alert-warning");
            return;
        }
        var data = $scope.gridGetData("options_11");
        var pi_id = "-1";
        for (var i = 0; i < data.length; i++) {
            if (data[i].pi_id != undefined) {
                pi_id = pi_id + "," + data[i].pi_id;
            }
        }
        var data2 = $scope.gridGetData("options_12");
        var prod_id = "-1";
        for (var i = 0; i < data2.length; i++) {
            if (data2[i].prod_id != undefined) {
                prod_id = prod_id + "," + data2[i].prod_id;
            }
        }
        $scope.FrmInfo = {
            classid: "sale_prod_header",
            sqlBlock: "pi_id in (" + pi_id + ") and prod_amt > 0 and new_prod=2 and prod_id not in (" + prod_id + ")",
            postdata: {flag: 15},
            type: "checkbox"
        };
        BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
            var node = $scope.options_12.api.getModel().rootNode.allLeafChildren;
            var data = [];
            for (var j = 0; j < node.length; j++) {
                data.push(node[j].data);
            }
            for (var i = 0; i < result.length; i++) {
                var item = {};
                item.seq = i + 1;
                item.prod_id = result[i].prod_id;
                item.pi_id = result[i].pi_id;
                item.prod_no = result[i].prod_no;
                item.pi_no = result[i].pi_no;
                item.amt = result[i].prod_amt;
                item.prod_amt = result[i].prod_amt;
                item.alloed_amt = result[i].amt1;
                data.push(item);
            }
            $scope.options_12.api.setRowData(data);
            $scope.data.currItem.fin_lc_allot_prod_lineoffin_lc_allot_headers = data;
        })
    };
    //删除行-形式发票号查询
    $scope.delitem = function () {
        //避免填写数据丢失
        $scope.options_11.api.stopEditing(false);
        var data = [];
        var rowidx = $scope.options_11.api.getFocusedCell().rowIndex;
        var node = $scope.options_11.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_11.api.setRowData(data);
        $scope.data.currItem.fin_lc_allot_lineoffin_lc_allot_headers = data;

    };
    //删除行-生产单
    $scope.delitem2 = function () {
        //避免填写数据丢失
        $scope.options_12.api.stopEditing(false);

        var data = [];
        var rowidx = $scope.options_12.api.getFocusedCell().rowIndex;
        var node = $scope.options_12.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_12.api.setRowData(data);
        $scope.data.currItem.fin_lc_allot_prod_lineoffin_lc_allot_headers = data;

    };
    /*********************网格处理事件*****************************/
    //发票流水号
    $scope.picolumn13 = function () {
        $scope.FrmInfo = {
            title: "发票流水号",
            classid: "bill_invoice_header",
            postdata: {},
            sqlBlock: "pi_id = 0 and Is_Check_Over <> 2",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            var data = [];
            var index = $scope.options_13.api.getFocusedCell().rowIndex;
            var node = $scope.options_13.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            data[index].invoice_no = result.invoice_no;
            $scope.options_13.api.setRowData(data);
        });
    };
    // 此次分配金额
    $scope.amt11 = function (e) {
        var data = $scope.gridGetData("options_11");
        //设置初始化
        var total_allot_amt11 = 0;
        for (var i = 0; i < data.length; i++) {
            total_allot_amt11 += parseFloat(data[i].amt);
        }
        $scope.data.currItem.total_allot_amt = total_allot_amt11 ? total_allot_amt11 : 0;
    };
    $scope.refresh_after = function () {
        $scope.amt11();
    };
    /******************保存校验区域****************************/

    $scope.wfstart = function (e) {

        if (e) e.currentTarget.disabled = true;
        var obj = BasemanService.RequestPostNoWait("fin_lc_allot_header", "checkday", {lc_allot_id: $scope.data.currItem.lc_allot_id});
        if (!obj.pass) {
            BasemanService.notice(obj.msg);
            return obj;
        }
        BasemanService.RequestPost("fin_lc_allot_header", "check", {lc_allot_id: $scope.data.currItem.lc_allot_id}).then(function (data) {

            BasemanService.notice("提交成功", "alert-info");
            if (e) e.currentTarget.disabled = false;

            $scope.refresh(2);
        }, function (error) {
            if (e) e.currentTarget.disabled = false;
        })
    };

    /******************界面初始化****************************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            stat: 1,
            cust_id: 0,
            lc_date: moment().format('YYYY-MM-DD HH:mm:ss'),

        };
    };
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('fin_lc_allot_headerEdit', fin_lc_allot_headerEdit);
