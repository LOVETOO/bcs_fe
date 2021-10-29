'use strict';
function fin_funds_allo_headerEdit($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_funds_allo_headerEdit = HczyCommon.extend(fin_funds_allo_headerEdit, ctrl_bill_public);
    fin_funds_allo_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_funds_allo_header",
        key: "allo_id",
        wftempid: 10009,
        FrmInfo: {sqlBlock: " nvl(is_byhand,0) <> 2"},
        grids: [{optionname: 'options_11', idname: 'fin_funds_allo_lineoffin_funds_allo_headers'},//金额分配明细
            {optionname: 'options_12', idname: 'fin_funds_allo_invoice_lineoffin_funds_allo_headers'},//商业发票核销明细
            {optionname: 'options_13', idname: 'fin_funds_allo_reduce_lineoffin_funds_allo_headers'},//待核销明细
            {optionname: 'options_14', idname: 'fin_funds_allo_kind_lineoffin_funds_allo_headers'}//产品部明细
        ]
    };
    $scope.headername = "到款PI分配";
    if ($scope.$state.params.ExpandValue || $scope.$state.current.url == "/fin_funds_allo_header_sgEdit") {
        $scope.ExpandValue = 1;
        $scope.objconf.FrmInfo.sqlBlock = " nvl(is_byhand,0)=2";
        $scope.headername = "到款PI分配制单(手工录入)";
    }
    /******************下拉框值查询（系统词汇）**************/
    {
        //货币类型
        BasemanService.RequestPostAjax("base_search", "searchcurrency", {}).then(function (data) {
            $scope.base_currencys = HczyCommon.stringPropToNum(data.base_currencys);
        });
        //汇款组织
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "return_ent_type"}).then(function (data) {
            $scope.return_ent_types = data.dicts;
        });
        //订单类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "sale_order_type"}).then(function (data) {
            $scope.sale_order_types = data.dicts;
        });
        //贸易类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
            $scope.tradeTypes = data.dicts;
        });
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"}).then(function (data) {
            $scope.pay_types = data.dicts;
        });
        //单据状态
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
            $scope.stats = data.dicts;
        });
        //到款用途
        $scope.is_purposes = [
            {
                id: 1,
                name: "订金"
            }, {
                id: 2,
                name: "余额"
            }];
    }
    /**********************弹出框值查询*********************/
    {
        //合同号
        $scope.changePINo = function () {
            if ($scope.data.currItem.pi_no.indexOf("PI") == 0) {
                BasemanService.notice("不能填写以PI号开头", "alter-warning")
            }
        };
        $scope.changePINo = function () {
            $scope.FrmInfo = {
                classid: "bill_invoice_bl_header",
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                BasemanService.RequestPost("sale_ship_notice_header", "dogetlcline", {
                        flag: 2,
                        allo_id: result.allo_id,
                        cust_id: result.cust_id,
                    })
                    .then(function (data) {
                        $scope.data.currItem.pi_no = result.pi_no;
                        $scope.data.currItem.pi_id = result.pi_id;
                        $scope.data.currItem.invoice_no = result.invoice_no;
                        $scope.data.currItem.invoice_id = result.invoice_id;
                    })
            })
        };
        // 到款单号
        $scope.fin_funds_header = function () {
            $scope.FrmInfo = {
                classid: "fin_funds_header",
                postdata: {flag: 11},
                sqlBlock: "nvl(Fin_Funds_Header.Allocated_Amt,0) < nvl(Fin_Funds_Header.Fact_Amt,0) " +
                "and stat =5 and nvl(Fin_Funds_Header.lc_cash_type,0) <> 1 " +
                "and nvl(Fin_Funds_Header.tt_type,0) not in ( 3,6,7) " +
                "and not exists (select 1 from fin_funds_allo_header h where h.funds_id=Fin_Funds_Header.funds_id and h.stat<5)",
            };
            BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
                result.creator = $scope.data.currItem.creator || "";
                result.create_time = $scope.data.currItem.create_time || "";
                result.wfid = $scope.data.currItem.wfid || "";
                result.wfflag = $scope.data.currItem.wfflag || "";
                result.creator = $scope.data.currItem.creator || "";
                result.create_time = $scope.data.currItem.create_time || "";
                result.wfid = $scope.data.currItem.wfid || "";
                result.wfflag = $scope.data.currItem.wfflag || "";
                result.stat = $scope.data.currItem.stat;

                result.sale_order_type = parseInt(result.sale_order_type);
                result.funds_type = parseInt(result.funds_type);
                result.return_ent_type = parseInt(result.return_ent_type);
                result.currency_code = result.currency_code;
                result.currency_name = result.currency_name;
                result.currency_id = result.currency_id;
                result.trade_type = parseInt(result.trade_type);

                result.cur_amt = result.amt;
                result.cur_amt_deduct = result.amt_deduct;
                result.cur_fact_amt = result.fact_amt;
                result.cur_lc_interest = result.lc_interest;
                result.bgq_fact_amt = result.fact_amt;
                result.dname = '';
                result.allocated_amt = result.allocated_amt || 0;
                result.allocated_amt = result.allocated_amt || 0;
                result.fact_amt = result.fact_amt || 0;
                result.tt_type = result.tt_type || 0;
                result.total_amt = result.fact_amt;
                result.canuse_amt = result.total_amt - result.allocated_amt;
                result.canuse_amt = result.canuse_amt.toFixed(2);
                HczyCommon.stringPropToNum(result);
                for (var name in result) {
                    $scope.data.currItem[name] = result[name];
                }
                if (result.funds_type == 1) {  //TT
                    $scope.e_flag = 1;
                    if (result.allocated_amt <= result.fact_amt) {//分配金额为0时，默认是可以修改所有
                        if (result.tt_type <= 2) {
                            $scope.e_flag = 2; //能够修改扣费
                            if (result.tt_type > 0 && result.allocated_amt == 0) {//没有分配金额
                                $scope.e_flag = 3; //能够修改客户
                            }
                        }
                    }
                } else if (result.funds_type == 2) { //LC
                    $scope.e_flag = 4;
                }
                if (result.version != '') {
                    $scope.data.currItem.version = result.version || 0;
                } else {
                    $scope.data.currItem.version = 1
                }
                BasemanService.RequestPost("fin_funds_header", "select", {funds_id: result.funds_id}).then(function (data) {
                    if (data.fin_funds_kind_lineoffin_funds_headers.length > 0) {
                        $scope.options_14.api.setRowData(data.fin_funds_kind_lineoffin_funds_headers);
                        $scope.data.currItem.fin_funds_allo_kind_lineoffin_funds_allo_headers = data.fin_funds_kind_lineoffin_funds_headers;
                    }
                });
            })
        };
        //业务部门
        $scope.scporg = function () {
            if ($scope.ExpandValue == 0) {
                return;
            }
            $scope.FrmInfo = {
                classid: "scporg",
                sqlBlock: "1=1 and stat =2 and OrgType = 5",
                backdatas: "orgs"
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.org_name = result.orgname;
                $scope.data.currItem.org_code = result.code;
                $scope.data.currItem.org_id = result.orgid;
            })
        };
    }
    /**********************网格事件*************************/
    {
        //生产单查询
        $scope.prod_no11 = function () {
            var index = $scope.options_11.api.getFocusedCell().rowIndex;
            var node = $scope.options_11.api.getModel().rootNode.childrenAfterSort;
            $scope.FrmInfo = {
                title: "生产单查询",
                thead: [],
                classid: "sale_prod_header",
                sqlBlock: " pi_id=" + node[index].data.pi_id + "and prod_amt > 0 and new_prod=2",
                backdatas: "sale_prod_headers"
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                var data = [];
                for (var i = 0; i < node.length; i++) {
                    data.push(node[i].data)
                }
                data[index].prod_no = result.prod_no;
                data[index].prod_id = result.prod_id;
                $scope.options_11.api.setRowData(data);
            })
        };
        //发货通知单
        $scope.fnotice_no11=function(){
            var item = $scope.gridGetRow("options_11");
            var sql="pi_id="+item.pi_id+"and stat <> 99 " +
                "and (exists (select 1 from bill_invoice_header iv where ','||iv.notice_ids||',' like '%,'||sale_ship_notice_header.notice_id||',%' and iv.stat < 5 ) " +
                "or not exists (select 1 from bill_invoice_header iv where ','||iv.notice_id ||',' like '%,'||sale_ship_notice_header.notice_id||',%'))";
            $scope.FrmInfo = {
                title: "发货单查询",
                thead: [],
                classid: "sale_ship_notice_header",
                sqlBlock: sql,
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                item.fnotice_id=result.notice_id;
                item.fnotice_no=result.notice_no;
                $scope.gridUpdateRow("options_11", item);
            })
        }
        //此次分配金额
        $scope.numberMore = function () {
            if ($scope.data.currItem.total_allo_amt < 0) {
                BasemanService.notice("请填写大于0的数值");
                $scope.data.currItem.total_allo_amt = "";
                return;
            }
        };
        //金额分配明细 新增行
        $scope.addline11 = function () {
            if ($scope.data.currItem.cust_id == undefined) {
                BasemanService.notice("客户未选择");
                return;
            }
            if ($scope.data.currItem.org_id == undefined) {
                BasemanService.notice("部门未选择");
                return;
            }
            if ($scope.data.currItem.lc_no == undefined) {
                BasemanService.notice("信用证号没有");
                return;
            }
            $scope.FrmInfo = {
                title: "形式发票",
                is_high: true,
                is_custom_search: true,
                thead: [
                    {
                        name: "形式发票单号",
                        code: "pi_no",
                        show: true,
                        iscond: true,
                        type: 'string'
                    },
                    {
                        name: "实际发票号",
                        code: "fact_invoice_no",
                        show: true,
                        iscond: true,
                        type: 'string'
                    },
                    {
                        name: "业务部门",
                        code: "org_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    },
                    {
                        name: "客户名称",
                        code: "cust_name",
                        show: true,
                        iscond: true,
                        type: 'string'
                    }, {
                        name: "PI总金额",
                        code: "amt_total",
                        show: true,
                        iscond: true,
                        type: 'string'
                    },
                    {
                        name: "付款方式",
                        code: "payment_type_name",
                        show: true,
                        iscond: true,
                        type: 'date'
                    }],
                type: "checkbox",
                classid: "sale_pi_header",
                commitRigthNow: true,
                searchlist: ["org_name", "cust_name", "amt_total", "payment_type_name", "pi_no", "fact_invoice_no"],
                postdata: {},
                backdatas: "sale_pi_headers",
            };
            if ($scope.data.currItem.funds_type == 2) {
                $scope.FrmInfo.sqlBlock = "stat<>99 " +
                    "and nvl(amt_total,0)>nvl(amt_gathering,0) " +
                    "and cust_id=" + $scope.data.currItem.cust_id +
                    "and org_id =" + $scope.data.currItem.org_id +
                    "and nvl(bill_flag,0) not in ( 2,3) " +
                    "and a.PI_Id in (select distinct Fin_Lc_Allot_Line.PI_Id from Fin_Lc_Allot_Header, Fin_Lc_Allot_Line where Fin_Lc_Allot_Header.Lc_Allot_Id = Fin_Lc_Allot_Line.Lc_Allot_Id"
                    + "and Fin_Lc_Allot_Header.Lc_No ='" + $scope.data.currItem.lc_no + "')";
            }
            if ($scope.data.currItem.funds_type == 1) {
                $scope.FrmInfo.postdata.flag = 6;
            }
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                var push2 = [];
                var node = $scope.options_11.api.getModel().rootNode.allLeafChildren;
                for (var j = 0; j < node.length; j++) {
                    push2.push(node[j].data);
                }
                for (var i = 0; i < result.length; i++) {
                    result[i].seq = (node.length + i + 1);
                    for (var j = 0; j < push2.length; j++) {
                        if (parseInt(push2[j].pi_id) == parseInt(result[i].pi_id)) {
                            break;
                        }
                    }
                    if (j != push2.length) {
                        continue;
                    }
                    var item = {};
                    item.pi_no = result[i].pi_no,
                        item.item_kind=parseInt(result[i].item_kind);
                        item.pi_id = result[i].pi_id,
                        item.payment_type_id = result[i].payment_type_id,
                        item.payment_type_code = result[i].payment_type_code,
                        item.payment_type_name = result[i].payment_type_name,
                        item.pi_amt = parseFloat(result[i].amt_total),
                        item.pi_amt_gathering = parseFloat(result[i].amt_gathering),
                        item.pi_send_amt = parseFloat(result[i].pi_send_amt);
                    item.tt_total_amt = parseFloat(result[i].tt_total_amt);
                    item.tt_amt_gathering = parseFloat(result[i].tt_amt_gathering);
                    item.tt_waitamt = parseFloat(result[i].tt_total_amt) - parseFloat(result[i].tt_amt_gathering);
                    item.note = "";
                    push2.push(item);
                    var push = [], push1 = [];
                    var node = $scope.options_13.api.getModel().rootNode.allLeafChildren;
                    for (var j = 0; j < node.length; j++) {
                        push.push(node[j].data);
                    }
                    var postdata = {};
                    postdata.pi_id = result[i].pi_id;
                    postdata.pi_no = result[i].pi_no;
                    //amt_total
                    postdata.sale_pi_money_lineofsale_pi_headers = result;
                    if ($scope.data.currItem.funds_type == 1) {
                        postdata.sqlwhere = ' m.pay_type <> 2'
                    } else {
                        postdata.sqlwhere = ' m.pay_type = 2  and nvl(n.bill_type,1) <> 2 ' + '  and nvl(n.is_red,0) <> 2  and  n.tt_amt >n.tt_check_amt  ';
                    }
                    ;
                    var promise = BasemanService.RequestPost("sale_pi_header", "getpiallotmoneyline", postdata);
                    promise.then(function (data) {
                        for (var j = 0; j < data.sale_pi_money_lineofsale_pi_headers.length; j++) {
                            data.sale_pi_money_lineofsale_pi_headers[j].seq = (node.length + j + 1);
                            push.push(data.sale_pi_money_lineofsale_pi_headers[j]);
                        }
                        //待核销明细
                        $scope.options_13.api.setRowData(push);
                        $scope.data.currItem.fin_funds_allo_reduce_lineoffin_funds_allo_headers = push;

                    })
                    var node1 = $scope.options_12.api.getModel().rootNode.allLeafChildren;
                    for (var j = 0; j < node1.length; j++) {
                        push1.push(node1[j].data);
                    }
                    var postdata1 = {};
                    postdata1.flag = 12;
                    postdata1.sqlwhere = " a.pi_id=" + result[i].pi_id + " and a.is_check_over <> 2 and nvl(a.bill_type,1) <> 2 and nvl(a.is_red,1) <> 2 and a.stat = 5 "
                    var promise = BasemanService.RequestPost("bill_invoice_header", "search", postdata1);
                    promise.then(function (data) {
                        for (var j = 0; j < data.bill_invoice_headers.length; j++) {
                            data.bill_invoice_headers[j].seq = (node1.length + j + 1);
                            push1.push(data.bill_invoice_headers[j]);
                        }
                        // 商业发票核销明细
                        $scope.options_12.api.setRowData(push1);
                        $scope.data.currItem.fin_funds_allo_invoice_lineoffin_funds_allo_headers = push1;

                    })
                }
                $scope.options_11.api.setRowData(push2);
                $scope.data.currItem.fin_funds_allo_lineoffin_funds_allo_headers = push2;

            })
        };
        $scope.delline11 = function () {
            var data = [];
            var rowidx = $scope.options_11.api.getFocusedCell().rowIndex;
            var node = $scope.options_11.api.getModel().rootNode.allLeafChildren;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data);
            }


            var data1 = [];
            var node = $scope.options_12.api.getModel().rootNode.allLeafChildren;
            for (var i = 0; i < node.length; i++) {
                if (node[i].data.pi_no != data[rowidx].pi_no) {
                    data1.push(node[i].data);
                }
            }

            var data2 = [];
            var node = $scope.options_13.api.getModel().rootNode.allLeafChildren;
            for (var i = 0; i < node.length; i++) {
                if (node[i].data.pi_no != data[rowidx].pi_no) {
                    data2.push(node[i].data);
                }
            }

            data.splice(rowidx, 1);
            $scope.options_11.api.setRowData(data);

            $scope.options_12.api.setRowData(data1);

            $scope.options_13.api.setRowData(data2);
        };
       /* $scope.allo_amt11 = function () {
            //与产品部明细中分配金额同步更新
            var _this = $(this);
            var val = _this.val();
            var data = [];
            var rowidx = $scope.options_11.api.getFocusedCell().rowIndex;
            var node = $scope.options_11.api.getModel().rootNode.allLeafChildren;
            var allo_amt = 0;
            for (var i = 0; i < node.length; i++) {
                if (i == parseInt(rowidx)) {
                    allo_amt += parseFloat(val);
                } else {
                    allo_amt += node[i].data.allo_amt;
                }

            }

            var node1 = $scope.options_14.api.getModel().rootNode.allLeafChildren;
            node1[0].data.allo_amt = allo_amt;
            data.push(node1[0].data);
            $scope.options_14.api.setRowData(data);
        };*/
        $scope.CellChange11=function(){
            var Allo_Amt=0;var Total_Allo_Amt=0;var item_kind;
            var GridData = $scope.gridGetData("options_11");
            var _this = $(this);
            var val = _this.val();
            var nodes = $scope.options_11.api.getModel().rootNode.childrenAfterGroup;
            var cell = $scope.options_11.api.getFocusedCell();
            var field = cell.column.colDef.field;
            var h_line = nodes[cell.rowIndex].data;
            var refreshFields = [];
            if (field == "is_line_purpose") {
                if(Number(h_line.is_line_purpose||0)==1){
                    var piid=parseInt(h_line.pi_id||0);
                    //待核销明细
                    var Grid1Data=$scope.gridGetData("options_13");
                    var items = [];
                    for(var i=0;i<Grid1Data.length;i++){
                        if(piid!=parseInt(Grid1Data[i].pi_id||0)){
                            items.push(Grid1Data[i])
                        }
                    }
                    $scope.options_13.api.setRowData(items);
                    //商业发票核销明细
                    var Grid3Data=$scope.gridGetData("options_12");
                    var items2 = [];
                    for(var i=0;i<Grid3Data.length;i++){
                        if(piid!=parseInt(Grid3Data[i].pi_id||0)){
                            items2.push(Grid3Data[i])
                        }
                    }
                    $scope.options_13.api.setRowData(items2);
                }
            } else if (field == "allo_amt") {
                Total_Allo_Amt=Total_Allo_Amt+Number(val||0);
                for(var iRow=0;iRow<GridData.length;iRow++){
                    if(cell.rowIndex!=iRow){
                        Allo_Amt=parseFloat(GridData[iRow].allo_amt||0);
                        Total_Allo_Amt=Total_Allo_Amt+Allo_Amt;
                    }
                }
                $scope.data.currItem.total_allo_amt=parseFloat(Total_Allo_Amt||0);
            }else if (field == "fnotice_no") {
                if (val == undefined || val == "") {
                    h_line.fnotice_id = 0;
                    refreshFields = ["fnotice_id"]
                }
            } else if (field == "prod_no") {
                if (val == undefined || val == "") {
                    h_line.prod_id = 0;
                    refreshFields = ["prod_id"]
                }
            }
            $scope.options_11.api.refreshCells(nodes, refreshFields);
            //产品明细
            var kindnodes=$scope.options_14.api.getModel().rootNode.childrenAfterGroup;
            var KindData=$scope.gridGetData("options_14");
            for(var m=0;m<KindData.length;m++){
                KindData[m].allo_amt=0;
                item_kind=parseInt(KindData[m].item_kind||0);
                for(var n=0;n<GridData.length;n++){
                    if(parseInt(GridData[n].item_kind||0)==item_kind){
                        KindData[m].allo_amt=KindData[m].allo_amt+Number(val||0);
                        $scope.options_14.api.refreshCells(kindnodes, "allo_amt");
                    }
                }
            }
           
        };
    }
    /**************************网格定义*********************/
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
        //金额分配明细
        $scope.options_11 = {
            rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
            pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
            groupKeys: undefined,
            groupHideGroupColumns: false,
            enableColResize: true, //one of [true, false]
            enableSorting: true, //one of [true, false]
            enableFilter: true, //one of [true, false]
            enableStatusBar: false,
            enableRangeSelection: false,
            rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
            rowDeselection: false,
            quickFilterText: null,
            //rowClicked: $scope.rowClicked,
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
        $scope.columns_11 = [
            {
                headerName: "产品部", field: "item_kind", editable: false, filter: 'set', width: 85,
                cellEditor: "下拉框",
                cellEditorParams: {values: [{value: 1, desc: '空调组织'}]},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                hide:true
            },{
                headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 85,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "付款方式", field: "payment_type_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "PI总金额", field: "pi_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "已回款金额", field: "pi_amt_gathering", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "非LC部分总额", field: "tt_total_amt", editable: false, filter: 'set', width: 120,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "非LC部分已回款金额", field: "tt_amt_gathering", editable: false, filter: 'set', width: 160,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "非LC部分未回款金额", field: "tt_waitamt", editable: false, filter: 'set', width: 160,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "本次分配金额", field: "allo_amt", editable: true, filter: 'set', width: 120,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                // cellchange: $scope.allo_amt11,
                cellchange: $scope.CellChange11
            },
            {
                headerName: "到款用途", field: "is_line_purpose", editable: true, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {values: [{value: 1, desc: "订金"}, {value: 2, desc: "余额"}]},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellchange: $scope.CellChange11
            },
            {
                headerName: "生产单号", field: "prod_no", editable: true, filter: 'set', width: 100,
                cellEditor: "弹出框",
                action: $scope.prod_no11,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellchange: $scope.CellChange11,
            },
            {
                headerName: "生产定金分配金额", field: "prod_amt", editable: true, filter: 'set', width: 150,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "提前到款金额", field: "tq_amt", editable: true, filter: 'set', width: 110,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "发货通知单号", field: "fnotice_no", editable: true, filter: 'set', width: 120,
                cellEditor: "弹出框",
                action: $scope.fnotice_no11,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                cellchange: $scope.CellChange11,
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
                headerName: "已核销商业发票金额", field: "invoice_check_amt", editable: false, filter: 'set', width: 160,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "已核销完成", field: "invoice_check_over", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "发货金额", field: "send_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "PI已发货金额", field: "pi_send_amt", editable: false, filter: 'set', width: 120,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "已发货确认金额", field: "confirm_amt", editable: false, filter: 'set', width: 130,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
        ];
        //商业发票核销明细
        $scope.options_12 = {
            rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
            pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
            groupKeys: undefined,
            groupHideGroupColumns: false,
            enableColResize: true, //one of [true, false]
            enableSorting: true, //one of [true, false]
            enableFilter: true, //one of [true, false]
            enableStatusBar: false,
            enableRangeSelection: false,
            rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
            rowDeselection: false,
            quickFilterText: null,
            //rowClicked: $scope.rowClicked,
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
        $scope.columns_12 = [
            {
                headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 85,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "发票流水号", field: "invoice_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "通知单号", field: "notice_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "此次核销金额", field: "invoice_check_amt", editable: true, filter: 'set', width: 120,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "待核销总额", field: "tt_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "已核销金额", field: "tt_check_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "商业发票号", field: "fact_invoice_no", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
        ];
        //待核销明细
        $scope.options_13 = {
            rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
            pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
            groupKeys: undefined,
            groupHideGroupColumns: false,
            enableColResize: true, //one of [true, false]
            enableSorting: true, //one of [true, false]
            enableFilter: true, //one of [true, false]
            enableStatusBar: false,
            enableRangeSelection: false,
            rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
            rowDeselection: false,
            quickFilterText: null,
            //rowClicked: $scope.rowClicked,
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
        $scope.columns_13 = [
            {
                headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 85,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "基础付款方式", field: "pay_type", editable: false, filter: 'set', width: 120,
                cellEditor: "下拉框",
                cellEditorParams: {values: []},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "对应单据号", field: "source_bill_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "发票流水号", field: "invoice_no", editable: true, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "商业发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "金额", field: "amount", editable: false, filter: 'set', width: 85,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "已核销金额", field: "reduce_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "此次分配金额", field: "allot_amt", editable: true, filter: 'set', width: 120,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "生产单号", field: "sprod_no", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
        ];
        //产品部明细
        $scope.options_14 = {
            rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
            pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
            groupKeys: undefined,
            groupHideGroupColumns: false,
            enableColResize: true, //one of [true, false]
            enableSorting: true, //one of [true, false]
            enableFilter: true, //one of [true, false]
            enableStatusBar: false,
            enableRangeSelection: false,
            rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
            rowDeselection: false,
            quickFilterText: null,
            //rowClicked: $scope.rowClicked,
            groupSelectsChildren: false, // one of [true, false]
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            groupColumnDef: groupColumn,
            showToolPanel: false,
            checkboxSelection: function (params) {
                var isGrouping = $scope.options_14.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
        $scope.columns_14 = [
            {
                headerName: "产品部", field: "item_kind", editable: false, filter: 'set', width: 85,
                cellEditor: "下拉框",
                cellEditorParams: {values: [{value: 1, desc: '空调组织'}]},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "付款总额", field: "fact_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "已分配金额", field: "allocated_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "可分配金额", field: "canuse_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "本次分配金额", field: "allo_amt", editable: false, filter: 'set', width: 120,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
        ];
    }
    /************保存校验区域、初始化页面********************/
    {
        $scope.validate = function () {
            var GridData = $scope.gridGetData("options_11");
            var Grid3Data = $scope.gridGetData("options_12");
            var Grid1Data = $scope.gridGetData("options_13");
            if ($scope.ExpandValue == 1) {
                if ($scope.data.currItem.pi_no == "" || $scope.data.currItem.pi_no == undefined) {
                    BasemanService.notice('合同号不能为空！', "alert-warning");
                    return false;
                }
                if ($scope.data.currItem.is_purpose == "" || $scope.data.currItem.is_purpose == undefined) {
                    BasemanService.notice('到款用途不能为空！', "alert-warning");
                    return false;
                }
                if ($scope.data.currItem.trade_type == "" || $scope.data.currItem.trade_type == undefined) {
                    BasemanService.notice('贸易类型不能为空！', "alert-warning");
                    return false;
                }
                if (parseFloat($scope.data.currItem.total_allo_amt || 0) == 0) {
                    BasemanService.notice('本次分配金额不能为0！', "alert-warning");
                    return false;
                }
                if (parseFloat($scope.data.currItem.total_allo_amt || 0) > parseFloat($scope.data.currItem.canuse_amt || 0)) {
                    BasemanService.notice('本次分配金额不能大于可分配金额！', "alert-warning");
                    return false;
                }
            }
            else {
                //金额分配明细为空!
                var Allot_Amt, Amount, Amount1, Invoice_Check_Amt, Tt_Amt, Tt_Check_Amt, boo;
                var Allo_Amt, factamt, invamt1, invamt2, invamt3, item_kind1, item_kind2, invoice_id, invoice_id1, pino, itemkind, thisamt;
                if (GridData.length == 0) {
                    BasemanService.notice('金额分配明细为空!', "alert-info");
                    return false;
                }
                var KindData = $scope.gridGetData("options_14");
                //测试单号FFCH201702083664
                //PI的本次分配金额不能大于对应产品部的到款总额 -减已分配金额
                for (var i = 0; i < GridData.length; i++) {
                    Allo_Amt = parseFloat(GridData[i].allo_amt || 0);
                    item_kind1 = parseFloat(GridData[i].item_kind || 0);
                    factamt = 0
                    for (var j = 0; j < KindData.length; j++) {
                        item_kind2 = parseFloat(KindData[j].item_kind || 0);
                        if (item_kind1 == item_kind2) {
                            factamt = factamt + parseFloat(KindData[j].fact_amt || 0) - parseFloat(KindData[j].allocated_amt || 0)
                        }
                        if (item_kind2 == 1) {
                            factamt = factamt + parseFloat(KindData[j].fact_amt || 0) - parseFloat(KindData[j].allocated_amt || 0)
                        }
                    }
                    Allo_Amt = (Allo_Amt).toFixed(2);
                    factamt = (factamt).toFixed(2);
                    if ((Number(Allo_Amt||0) + 0.000001) > Number(factamt||0)) {
                        pino = GridData[i].pi_no;
                        itemkind = GridData[i].item_kind;
                        BasemanService.notice('PI号:' + pino + '的本次分配金额不能大于产品部:' + itemkind + '的到款总额', "alert-info");
                        return false;
                    }
                }
                //金额分配明细中的相同产品部的本次分配金额之和不能大于对应产品部的到款总额 -减已分配金额
                //到款用途不能为空
                for (var i = 0; i < GridData.length; i++) {
                    Allo_Amt = parseFloat(GridData[i].allo_amt || 0);
                    item_kind1 = parseFloat(GridData[i].item_kind || 0);
                    factamt = 0
                    for (var j = i + 1; j < GridData.length; j++) {
                        item_kind2 = parseFloat(GridData[j].item_kind || 0);
                        if (item_kind1 == item_kind2) {
                            Allo_Amt = Allo_Amt + parseFloat(KindData[j].allo_amt || 0);
                        }
                    }
                    for (var j = 0; j < KindData.length; j++) {
                        item_kind2 = parseFloat(KindData[j].item_kind || 0);
                        if (item_kind1 == item_kind2) {
                            factamt = factamt + parseFloat(KindData[j].fact_amt || 0) - parseFloat(KindData[j].allocated_amt || 0)
                        }
                        if (item_kind2 == 1) {
                            factamt = factamt + parseFloat(KindData[j].fact_amt || 0) - parseFloat(KindData[j].allocated_amt || 0)
                        }
                    }
                    Allo_Amt = (Allo_Amt).toFixed(2);
                    factamt = (factamt).toFixed(2);
                    if ((Number(Allo_Amt||0) + 0.000001) > Number(factamt||0)) {
                        itemkind = GridData[i].item_kind;
                        BasemanService.notice('金额分配明细中产品部:' + factamt + '的本次分配金额之和不能大于产品部:' + factamt + '的到款总额减已分配金额', "alert-info");
                        return false;
                    }
                    if (parseFloat(GridData[i].is_line_purpose || 0) == 0) {
                        BasemanService.notice('金额分配明细中第' + (i + 1) + '行到款用途未选择!', "alert-info");
                        return false;
                    }
                }
                //资金分配明细中本次分配金额%大于订单总额%减已回款金额
                boo = true;
                for (var iRow = 0; iRow < GridData.length; iRow++) {
                    if (parseFloat(GridData[iRow].allo_amt || 0) != 0) {
                        boo = false;
                    }
                    if (Number($scope.data.currItem.funds_type || 0) == 1) {
                        var PI_AMT = parseFloat(GridData[iRow].pi_amt || 0).toFixed(2);
                        var PI_Amt_Gathering = parseFloat(GridData[iRow].pi_amt_gathering || 0).toFixed(2);
                        var Allo_Amt = parseFloat(GridData[iRow].allo_amt || 0).toFixed(2);
                        if ((Number(PI_AMT||0) - (Number(PI_Amt_Gathering||0) - Number(Allo_Amt||0))) < 0.00001) {
                            BasemanService.notice('资金分配明细中第' + (iRow + 1) + '行本次分配金额:' + Allo_Amt + '大于订单总额:' + PI_AMT + '减已回款金额:' + PI_Amt_Gathering + '!', "alert-info");
                            return false;
                        }
                    }
                }
                if (boo) {
                    BasemanService.notice('资金分配明细中本次分配金额全部为0，不能进行保存操作!' + PI_Amt_Gathering + '!', "alert-info");
                    return false;
                }
                else {
                    Allot_Amt =0;
                    for (var iRow = 0; iRow < Grid1Data.length; iRow++) {
                        if (Grid1Data.length > 0) {
                            Allot_Amt = Allot_Amt + parseFloat(GridData[iRow].allot_amt || 0)
                        }
                    }
                    Allot_Amt = (Allot_Amt).toFixed(2);
                    var Total_Allo_Amt = parseFloat($scope.data.currItem.total_allo_amt || 0).toFixed(2);
                    if (Number(Allot_Amt||0) > Number(Total_Allo_Amt||0) + 0.000001) {
                        BasemanService.notice('待核销明细本次分配金额总和:' + Allot_Amt + '大于此次分配总额:' + Total_Allo_Amt + '!', "alert-info");
                        return false;
                    }
                    if (Number($scope.data.currItem.funds_type || 0) == 3) {
                        if ((Number(Allot_Amt||0) - Number(Total_Allo_Amt||0)) < 0.000001 && ((Number(Allot_Amt||0) - Number(Total_Allo_Amt||0)) > -0.000001)) {
                            BasemanService.notice('本次待核销总额:' + Allot_Amt + '不等于本次分配总额:' + Total_Allo_Amt + '应当相等!', "alert-info");
                            return false;
                        }
                    }
                    //-----------------------商业发票核销明细----------------------
                    /*{若为信用证类型：
                     1、待核销明细中一定要有待核销的信用证类型的款项明细，并且核销金额之和一定要等于分配到这张pi的金额
                     2、对应pi的商业发票的核销金额之和也要等于此次pi的分配金额
                     3、填写Invoice_Check_Amt商业发票核销金额时，不能大于待核销金额与已核销金额之差（TT_Amt-TT_Check_Amt）}*/
                    if (parseFloat($scope.data.currItem.funds_type == 2)) {
                        if (Grid3Data.length == 0 || (Grid3Data[0].invoice_no == "" || Grid3Data[0].invoice_no == undefined)) {
                            BasemanService.notice('资金到款分配商业发票核销明细不能为空!', "alert-info");
                            return false;
                        } else {
                            for (var iRow1 = 0; iRow1 < GridData.length; iRow1++) {
                                for (var iRow = 0; iRow < Grid3Data.length; iRow++) {
                                    if (GridData[iRow1].pi_id == Grid3Data[iRow].pi_id) {
                                        Amount = Amount + parseFloat(Grid3Data[iRow].invoice_check_amt || 0);
                                    }
                                }
                                Amount = (Amount).toFixed(2);
                                if (Number(Amount||0) != 0) {
                                    BasemanService.notice('PI单号:' + GridData[iRow1].pi_id + '的本次分配金额:' + GridData[iRow1].allo_amt + '与相应的商业发票此次核销总额:' + Amount + '不相等,应当相等!', "alert-info");
                                    return false;
                                }
                            }
                            for (var iRow = 0; iRow < Grid3Data.length; iRow++) {
                                Invoice_Check_Amt = parseFloat(Grid3Data[iRow].invoice_check_amt || 0).toFixed(2);
                                Tt_Amt = parseFloat(Grid3Data[iRow].tt_amt || 0).toFixed(2);
                                Tt_Check_Amt = parseFloat(Grid3Data[iRow].tt_check_amt || 0).toFixed(2);
                                if (Number(Invoice_Check_Amt||0) > Number(Tt_Amt||0) - Number(Tt_Check_Amt||0)) {
                                    BasemanService.notice('商业发票明细第' + (iRow + 1) + '行此次核销金额:' + Invoice_Check_Amt + '大于待核销金额:' + Tt_Amt + '与已核销金额:' + Tt_Check_Amt + '之差!', "alert-info");
                                    return false;
                                }
                            }
                        }
                        Amount = 0;
                        if (Grid1Data.length == 0) {
                            BasemanService.notice('待核销明细不能为空!', "alert-info");
                            return false;
                        } else {
                            for (var iRow1 = 0; iRow1 < GridData.length; iRow1++) {
                                Amount = 0
                                for (var iRow = 0; iRow < Grid1Data.length; iRow++) {
                                    if (GridData[iRow1].pi_id == Grid1Data[iRow].pi_id) {
                                        Amount = Amount + parseFloat(Grid1Data[iRow].allot_amt || 0);
                                    }
                                }
                                var allot_amt = parseFloat(Grid1Data[iRow1].allot_amt || 0).toFixed(2);
                                if ((Number(Amount||0) - Number(allot_amt||0)) != 0) {
                                    BasemanService.notice('PI单号' + GridData[iRow1].pi_no + '的本次分配金额' + allo_amt + '与相应的待核销明细中此次核销总额' + Amount + '不相等，应当相等!', "alert-info");
                                    return false;
                                }
                            }
                            for (var iRow = 0; iRow < Grid1Data.length; iRow++) {
                                Allot_Amt = parseFloat(Grid1Data[iRow].allot_amt || 0).toFixed(2);
                                Amount = parseFloat(Grid3Data[iRow].amount || 0).toFixed(2);
                                var Reduce_Amt = parseFloat(Grid3Data[iRow].reduce_amt || 0).toFixed(2);
                                if (Number(Allot_Amt||0) > (Number(Amount||0) - Number(Reduce_Amt||0))) {
                                    BasemanService.notice('待核销明细第' + (iRow + 1) + '行本次分配金额:' + Allot_Amt + '大于金额:' + Amount + '与已核销金额:' + Reduce_Amt + '之差!', "alert-info");
                                    return false;
                                }
                            }
                        }


                    }
                    //-----------------------商业发票核销明细----------------------
                    /*{若为TT类型：
                     1、若查出的待核销明细中有oA的，则oa部分一定要填核销金额，
                     并且此时也一定要有相应的商业发票（核销金额要与OA核销金额一致）
                     2、若查出的待核销明细中有特批款的，并且同时存在商业发票，则特批款一定要进行核销}*/
                    Amount1 = 0;
                    if (parseFloat($scope.data.currItem.funds_type) == 1) {
                        Amount1 = 0;
                        Amount = 0;
                        if (Grid3Data.length == 0) {

                        } else {
                            for (var iRow1 = 0; iRow1 < GridData.length; iRow1++) {
                                Amount1 = 0;
                                Amount = 0;
                                for (var iRow = 0; iRow < Grid3Data.length; iRow++) {
                                    if (GridData[iRow1].pi_id == Grid3Data[iRow].pi_id) {
                                        Amount = Amount + parseFloat(Grid3Data[iRow].invoice_check_amt || 0);
                                        Amount1 = Amount1 + (parseFloat(Grid3Data[iRow].tt_amt || 0) - parseFloat(Grid3Data[iRow].tt_check_amt || 0))
                                    }
                                }
                                if (Amount1 > 0) {
                                    if ((Amount - parseFloat(GridData[iRow1].allo_amt || 0) - parseFloat(GridData[iRow1].tq_amt || 0) != 0)) {
                                        BasemanService.notice('PI单号' + GridData[iRow1].pi_no + '的本次分配金额' + GridData[iRow1].allo_amt + '与相应的商业发票此次核销总额' + Amount + '不相等，应当相等！', "alert-info");
                                        return false;
                                    }
                                }
                            }
                            for (var iRow = 0; iRow < Grid3Data.length; iRow++) {
                                Invoice_Check_Amt = parseFloat(Grid3Data[iRow].invoice_check_amt || 0).toFixed(2);
                                Tt_Amt = parseFloat(Grid3Data[iRow].tt_amt || 0).toFixed(2);
                                Tt_Check_Amt = parseFloat(Grid3Data[iRow].tt_check_amt || 0).toFixed(2);
                                if (Number(Invoice_Check_Amt||0) - Number(Tt_Amt||0) - Number(Tt_Check_Amt||0) > 0.00000001) {
                                    if ((Amount - parseFloat(GridData[iRow].allo_amt || 0) - parseFloat(GridData[iRow].tq_amt || 0) != 0)) {
                                        BasemanService.notice('商业发票明细第' + (iRow + 1) + '行商业发票核销金额:' + Invoice_Check_Amt + '大于待核销金额:' + Tt_Amt + '与已核销金额:' + Tt_Check_Amt + '之差!', "alert-info");
                                        return false;
                                    }
                                }
                            }
                        }

                        Amount = 0;
                        Amount1 = 0;
                        if (Grid1Data.length == 0) {

                        } else {
                            for (var iRow1 = 0; iRow1 < GridData.length; iRow1++) {
                                Amount1 = 0;
                                Amount = 0;
                                for (var iRow = 0; iRow < Grid3Data.length; iRow++) {
                                    if (GridData[iRow1].pi_id == Grid3Data[iRow].pi_id) {
                                        Amount = Amount + parseFloat(Grid3Data[iRow].allot_amt || 0);
                                        Amount1 = Amount1 + (parseFloat(Grid3Data[iRow].amount || 0) - parseFloat(Grid3Data[iRow].reduce_amt || 0))
                                    }
                                }
                                if (Amount1 > 0) {
                                    if ((Amount - parseFloat(GridData[iRow1].allo_amt || 0) - parseFloat(GridData[iRow1].tq_amt || 0) != 0)) {
                                        BasemanService.notice('PI单号:' + GridData[iRow1].pi_no + '的本次分配金额:' + GridData[iRow1].allo_amt + '与相应的待核销明细中本次核销总额:' + Amount + '不相等，应当相等！', "alert-info");
                                        return false;
                                    }
                                }
                            }
                            ;
                            for (var iRow = 0; iRow < Grid1Data.length; iRow++) {
                                Allot_Amt = parseFloat(Grid1Data[iRow].allot_amt || 0);
                                Reduce_Amt = parseFloat(Grid1Data[iRow].reduce_amt || 0).toFixed(2);
                                Amount = parseFloat(Grid1Data[iRow].amount || 0).toFixed(2);
                                if (Number(Allot_Amt||0) - Number(Reduce_Amt||0) > Amount) {
                                    if ((Amount - parseFloat(GridData[iRow1].allo_amt || 0) - parseFloat(GridData[iRow1].tq_amt || 0) != 0)) {
                                        BasemanService.notice('待核销明细第' + (iRow + 1) + '行本次分配金额:' + Grid1Data[iRow].allot_amt + '大于金额:' + Grid1Data[iRow].amount + '与已核销金额:' + Grid1Data[iRow].reduce_amt + '之差!', "alert-info");
                                        return false;
                                    }
                                }
                            }
                        }

                        var Total_Allo_Amt = parseFloat($scope.data.currItem.total_allo_amt).toFixed(2);
                        var Total_Amt = parseFloat($scope.data.currItem.total_amt).toFixed(2);
                        if (Number(Total_Allo_Amt||0) > Number(Total_Amt||0)) {
                            BasemanService.notice('此次分配总额' + Total_Allo_Amt + '大于可分配金额' + Total_Amt + '!', "alert-info");
                            return false;
                        }
                    }
                }

                //
                for (var i = 0; i < Grid1Data.length; i++) {
                    invamt1=0;
                    invoice_id=Number(Grid1Data[i].invoice_id||0);
                    for(var j=0;j<Grid1Data.length; j++){
                        if(invoice_id==Number(Grid1Data[j].invoice_id||0)){
                            invamt1=invamt1+parseFloat(Grid1Data[j].allot_amt||0);
                        }
                    }
                    invamt2=0;
                    for(var j=0;j<Grid3Data.length;j++){
                        if(invoice_id==Number(Grid3Data[j].invoice_id||0)){
                            invamt2=invamt2+parseFloat(Grid1Data[j].invoice_check_amt||0);
                        }
                    }
                    if(Math.abs(invamt1- invamt2)>0.0000001){
                        BasemanService.notice('商业发票:'+Grid1Data[i].invoice_id+'的核销明细金额与商业发票核销金额不一致', "alert-info");
                        return false;
                    }
                }
            };
            if (GridData.length > 0) {
                for(var i=0;i<GridData.length;i++){
                    if(Number(GridData[i].prod_id||0)==0 && Number(GridData[i].prod_amt||0)>0){
                        BasemanService.notice('第'+(i+1)+'行的生产单不能为空(生产单号不能是粘贴)!', "alert-warning");
                        return false;
                    }
                    /*if(Number(GridData[i].fnotice_id||0)==0 && (GridData[i].fnotice_no!=""||GridData[i].fnotice_no!=undefined)){
                        BasemanService.notice('第'+(i+1)+'行的发货单号不能为空(发货单号不能是粘贴)!', "alert-warning");
                        return false;
                    }*/
                    if((GridData[i].prod_no!=""||GridData[i].prod_no!=undefined) && Number(GridData[i].prod_amt||0)<=0){
                        BasemanService.notice('第'+(i+1)+'行的生产定金分配金额须大于0!', "alert-warning");
                        return false;
                    }
                    invamt1=Number(GridData[i].allo_amt||0);
                    invamt2=Number(GridData[i].tq_amt||0);
                    if(invamt2>invamt1){
                        BasemanService.notice('第'+(i+1)+'行的提前到款金额大于本次分配金额', "alert-warning");
                        return false;
                    }
                    invamt1=Number(GridData[i].allo_amt||0);
                    invamt2=Number(GridData[i].prod_amt||0);
                    if(invamt2>invamt1){
                        BasemanService.notice('第'+(i+1)+'行的生产定金分配金额大于本次分配金额', "alert-warning");
                        return false;
                    }
                    invamt1=Number(GridData[i].allo_amt||0);
                    invamt2=Number(GridData[i].prod_amt||0);
                    invamt3=Number(GridData[i].tq_amt||0);
                    if((invamt2>0)&&(invamt3>0)){
                        if(invamt1!= invamt2&&invamt1!= invamt3){
                            BasemanService.notice('第'+(i+1)+'行的生产定金分配金额、提前到款金额、本次分配金额必须相等!', "alert-warning");
                            return false;
                        }
                        if((GridData[i].prod_no==""||GridData[i].prod_no==undefined)){
                            BasemanService.notice('第'+(i+1)+'行的生产单单号不能为空!', "alert-warning");
                            return false;
                        }
                        if((GridData[i].fnotice_no==""||GridData[i].fnotice_no==undefined)){
                            BasemanService.notice('第'+(i+1)+'行的发货单号不能为空!', "alert-warning");
                            return false;
                        }

                    }
                    //核销明细上有生产单号时，对应的金额应与分配明细生产单金额一致
                    invamt2=Number(GridData[i].prod_amt||0);
                    invamt1=0;
                    for(var j=0;j<Grid1Data.length;j++){
                        if((Grid1Data[j].sprod_no==Grid1Data[j].prod_no)&&(GridData[i].prod_no!=""||GridData[i].prod_no!=undefined)){
                            invamt1=invamt1+Number(GridData[i].allot_amt||0);
                        }
                    }
                    if((GridData[i].prod_no!=""||GridData[i].prod_no!=undefined)){
                        if((invamt1!=invamt2)&&(invamt1>0)){
                            BasemanService.notice('第'+(i+1)+'行的生产单分配金额应与待核销明细上生产单分配金额相等!', "alert-warning");
                            return false;
                        }
                    }
                }
                for(var j=0;j<Grid1Data.length;j++){
                    if(Grid1Data[j].sprod_no!=""||Grid1Data[j].sprod_no!=undefined){
                        invamt1=invamt1+Number(Grid1Data[j].allot_amt||0);
                        invamt2=0;
                        for(var i=0;i<GridData.length;i++){
                            if(GridData[j].sprod_no==GridData[i].prod_no){
                                invamt2=invamt2+Number(Grid1Data[j].prod_amt||0);
                            }
                        }
                        if((invamt1!=invamt2) && (invamt1>0)){
                            BasemanService.notice('第'+(i+1)+'行的生产单分配金额应与待核销明细上生产单分配金额相等!', "alert-warning");
                            return false;
                        }
                    }
                }
                for(var i=0;i<GridData.length;i++){
                    thisamt=(GridData[i].prod_amt).toString();
                    var reg = /.*\..*/;
                    if(reg.test(thisamt)>0 && thisamt.split(".")[1].length>2){
                        alert('生产定金分配金额只能两位小数!');
                    }
                }
            }
            var errorlist = [];
            $scope.data.currItem.funds_no == undefined ? errorlist.push("到款单号为空") : 0;
            $scope.data.currItem.funds_type == undefined ? errorlist.push("到款类型为空") : 0;
            $scope.data.currItem.org_code == undefined ? errorlist.push("业务部门为空") : 0;
            if (errorlist.length) {
                BasemanService.notify(notify, errorlist, "alert-danger");
                return false;
            }
            return true;
        };
        $scope.save_before = function () {
            $scope.changeCurrency();
            if ($rootScope.$state.$current.self.name == "crmman.fin_funds_allo_header_sgEdit") {
                $scope.data.currItem.is_byhand = 2;
            } else if ($rootScope.$state.$current.self.name == "crmman.fin_funds_allo_headerEdit") {
                // $scope.data.currItem.is_byhand=1;
            }
        };
        $scope.changeCurrency = function () {
            for (var i = 0; i < $scope.base_currencys.length; i++) {
                if ($scope.base_currencys[i].currency_code == $scope.data.currItem.currency_code) {
                    $scope.data.currItem.currency_code = $scope.base_currencys[i].currency_code;
                    $scope.data.currItem.currency_id = $scope.base_currencys[i].currency_id;
                    $scope.data.currItem.currency_name = $scope.base_currencys[i].currency_name;
                    break;
                }
            }
        };
        // 此次分配金额
        $scope.refresh_after = function () {
            $scope.amt11();
        };
        $scope.amt11 = function (e) {
            var data = $scope.gridGetData("options_11");
            var total_allo_amt = 0;
            //设置初始化
            for (var i = 0; i < data.length; i++) {
                var allo_amt = parseFloat(data[i].allo_amt || 0);
                total_allo_amt = total_allo_amt + allo_amt;
            }
            $scope.data.currItem.total_allo_amt = parseFloat(total_allo_amt || 0);
        };
        $scope.clearinformation = function () {
            if (window.userbean) {
                $scope.userbean = window.userbean;
            }
            ;
            $scope.data.currItem.stat = 1;
            $scope.data.currItem.org_id = window.userbean.org_id;
            $scope.data.currItem.org_code = window.userbean.org_code;
            $scope.data.currItem.org_name = window.userbean.org_name;
            $scope.data.currItem.idpath = window.userbean.idpath;
            $scope.data.currItem.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
            $scope.data.currItem.creator = $scope.userbean.userid;
            $scope.data.currItem.allo_type = 1;
            $scope.data.currItem.can_visible = 1;
            $scope.data.currItem.wfid = "";
            $scope.data.currItem.wfflag = "";
            $scope.data.currItem.currency_name = "美元";
            $scope.data.currItem.currency_id = 4;
            $scope.data.currItem.currency_code = "USD";
        };
    }
    //数据缓存
    $scope.initdata();
}

angular.module('inspinia')
    .controller('fin_funds_allo_headerEdit', fin_funds_allo_headerEdit)
