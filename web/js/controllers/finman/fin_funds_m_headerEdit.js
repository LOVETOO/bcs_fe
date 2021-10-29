var basemanControllers = angular.module('inspinia');
function fin_funds_m_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_funds_m_headerEdit = HczyCommon.extend(fin_funds_m_headerEdit, ctrl_bill_public);
    fin_funds_m_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_funds_m_header",
        key: "funds_m_id",
        wftempid: 10046,
        FrmInfo: {},
        grids: [
            {optionname: 'options_11', idname: 'fin_funds_m_kind_lineoffin_funds_m_headers'},
            {optionname: 'options_12', idname: 'fin_funds_m_lineoffin_funds_m_headers'}
            
        ]
    };
    $scope.beforClearInfo = function () {
        var name = $rootScope.$state.$current.self.name;
        if (name == "crmman.fin_funds_m_header_ttEdit") {//TT到款变更
            $scope.s_flag = 1;
            $scope.objconf.FrmInfo = {sqlBlock: "funds_type=1"}
        } else if (name == "crmman.fin_funds_m_header_kfEdit") {//扣费变更
            $scope.s_flag = 2;
            $scope.objconf.FrmInfo = {sqlBlock: "funds_type=1 and change_type=4"}
        } else if (name == "crmman.fin_funds_m_header_ttrlEdit") {//客户认领变更
            $scope.s_flag = 3;
            $scope.objconf.FrmInfo = {sqlBlock: "funds_type=1 and change_type=2"}
        } else if (name == "crmman.fin_funds_m_header_zjxtEdit") {//资金变更
            $scope.s_flag = 4;
            $scope.objconf.FrmInfo = {sqlBlock: "funds_type=1 and change_type=3"}
        } else if (name == "crmman.fin_funds_m_header_lcEdit") {//信用证到款录入变更
            $scope.s_flag = 5;
            $scope.objconf.FrmInfo = {sqlBlock: "funds_type=2"}
        }
    };
    $scope.beforClearInfo();
    /******************网格定义区域**********************/
    {
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
        $scope.columns_12 = [
            {
                headerName: "产品部", field: "item_kind", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{value: "1", desc: "空调组织"}]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "通知单号", field: "notice_no", editable: false, filter: 'set', width: 150,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "发票流水号", field: "invoice_no", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "实际发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
            , {
                headerName: "待核销总额", field: "tt_amt", editable: false, filter: 'set', width: 120,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "已核销金额", field: "tt_check_amt", editable: false, filter: 'set', width: 120,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "待核销金额", field: "amount", editable: false, filter: 'set', width: 120,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "此次分配金额", field: "allot_amt", editable: false, filter: 'set', width: 130,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
            , {
                headerName: "更改前分配金额", field: "old_allot_amt", editable: false, filter: 'set', width: 130,
                cellEditor: "浮点框",
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
        $scope.columns_11 = [
            {
                headerName: "产品部", field: "item_kind", editable: false, filter: 'set', width: 100,
                cellEditor: "下拉框",
                cellEditorParams: {
                    values: [{value: "1", desc: "空调组织"}]
                },
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "实收金额", field: "amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "扣费", field: "amt_deduct", editable: false, filter: 'set', width: 150,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "利息", field: "lc_interest", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "付款总额", field: "fact_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "已分配金额", field: "allocated_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
            , {
                headerName: "可分配金额", field: "canuse_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }
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
    }
    /*******************弹出框区域*********************/
    {
        //会计期间
        $scope.fin_bud_period_header = function () {
            $scope.FrmInfo = {
                classid: "fin_bud_period_header",
                commitRigthNow: true,
                postdata: {
                    flag: 3
                },
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.period_year = result.period_year;
                $scope.data.currItem.period_id = result.period_id;
                $scope.data.currItem.period_line_id = result.period_line_id;
                $scope.data.currItem.dname = result.dname;
            })
        };
        //到款单号
        $scope.fin_funds_header = function () {
            $scope.FrmInfo = {
                title: "到款单查询",
                thead: [
                    {
                        name: "到款单号", code: "funds_no",
                        show: true, iscond: true, type: 'string',
                    }, {
                        name: "资金系统单", code: "other_no",
                        show: true, iscond: true, type: 'string',
                    }, {
                        name: "实际到款", code: "fact_amt",
                        show: true, iscond: true, type: 'string',
                    }, {
                        name: "已分配金额", code: "allocated_amt",
                        show: true, iscond: true, type: 'string',
                    }, {
                        name: "确认时间", code: "confirm_date",
                        show: true, iscond: true, type: 'date',
                    }, {
                        name: "确认人", code: "confirm_man",
                        show: true, iscond: true, type: 'string',
                    }, {
                        name: "业务部门", code: "org_name",
                        show: true, iscond: true, type: 'string',
                    }, {
                        name: "客户名称", code: "cust_name",
                        show: true, iscond: true, type: 'string',
                    }, {
                        name: "传资金系统发票号", code: "tt_invoice_no",
                        show: true, iscond: true, type: 'string',
                    }, {
                        name: "备注", code: "note",
                        show: true, iscond: true, type: 'string',
                    }],
                classid: "fin_funds_header",
                is_custom_search: "true",
                searchlist: ["funds_no", "other_no", "fact_amt",
                    "allocated_amt", "confirm_date", "confirm_man", "org_name", "cust_name", "confirm_date", "confirm_man", "note","tt_invoice_no"],
            };
            var name = $rootScope.$state.$current.self.name;
            if (name == "crmman.fin_funds_m_header_ttrlEdit") {
                $scope.FrmInfo.sqlBlock = "confirm_stat = 2 and not exists ( select 1 from Fin_Funds_m_Header where Fin_Funds_Header.Funds_Id=Fin_Funds_m_Header.Funds_Id and Fin_Funds_m_Header.Stat<5) and Funds_Type = 1 and nvl(allocated_amt, 0) = 0 and cust_id > 0";
            } else if (name == "crmman.fin_funds_m_header_ttEdit") {
                $scope.FrmInfo.sqlBlock = "confirm_stat = 2 and not exists ( select 1 from Fin_Funds_m_Header where Fin_Funds_Header.Funds_Id=Fin_Funds_m_Header.Funds_Id and Fin_Funds_m_Header.Stat<5) and Funds_Type = 1 and ( nvl(allocated_amt, 0) <= nvl(fact_amt, 0) or (fact_amt =0 and allocated_amt =0) )";
            } else if (name == "crmman.fin_funds_m_header_zjxtEdit") {
                $scope.FrmInfo.sqlBlock = "confirm_stat = 2 and not exists ( select 1 from Fin_Funds_m_Header where Fin_Funds_Header.Funds_Id=Fin_Funds_m_Header.Funds_Id and Fin_Funds_m_Header.Stat<5)";
            } else if (name == "crmman.fin_funds_m_header_kfEdit") {
                $scope.FrmInfo.sqlBlock = "confirm_stat = 2 and not exists ( select 1 from Fin_Funds_m_Header where Fin_Funds_Header.Funds_Id=Fin_Funds_m_Header.Funds_Id and Fin_Funds_m_Header.Stat<5) and Funds_Type = 1 and tt_type<=2 and ( nvl(allocated_amt, 0) <= nvl(fact_amt, 0) or (fact_amt =0 and allocated_amt =0) )";
            }else if (name == "crmman.fin_funds_m_header_lcEdit") {
                $scope.FrmInfo.sqlBlock = "confirm_stat = 2 and not exists ( select 1 from Fin_Funds_m_Header where Fin_Funds_Header.Funds_Id=Fin_Funds_m_Header.Funds_Id and Fin_Funds_m_Header.Stat<5) and Funds_Type = 2 and stat = 5";
            }
            BasemanService.open(CommonPopController, $scope, '', 'lg').result.then(function (result) {
                result = HczyCommon.stringPropToNum(result);
                result.creator = $scope.data.currItem.creator || "";
                result.create_time = $scope.data.currItem.create_time || "";
                result.wfid = $scope.data.currItem.wfid || "";
                result.wfflag = $scope.data.currItem.wfflag || "";
                result.creator = $scope.data.currItem.creator || "";
                result.create_time = $scope.data.currItem.create_time || "";
                result.wfid = $scope.data.currItem.wfid || "";
                result.wfflag = $scope.data.currItem.wfflag || "";
                result.stat = $scope.data.currItem.stat || "";
                result.sale_order_type = parseInt(result.sale_order_type);
                result.funds_type = parseInt(result.funds_type);
                result.return_ent_type = parseInt(result.return_ent_type);
                result.is_yin = parseInt(result.is_yin);
                result.currency_id = parseInt(result.currency_id);


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
                for (var name in result) {
                    if (result[name] != undefined) {
                        if (!isNaN(Number(result[name]))) {
                            if (Number(result[name]) > 0) result[name] = Number(result[name])
                        }
                        $scope.data.currItem[name] = result[name];
                    }
                }
                BasemanService.RequestPost("fin_funds_header", "select", {funds_id: result.funds_id})
                    .then(function (data) {
                        $scope.data.currItem.f_amt=data.f_amt;
                        $scope.data.currItem.f_amt_deduct=data.f_amt_deduct;
                        $scope.data.currItem.f_fact_amt=data.f_fact_amt;
                        $scope.options_11.api.setRowData(data.fin_funds_kind_lineoffin_funds_headers);
                        $scope.data.currItem.fin_funds_m_kind_lineoffin_funds_m_headers = data.fin_funds_kind_lineoffin_funds_headers;
                        /*if (data.fin_funds_m_lineoffin_funds_m_headers.length > 0) {
                         for (var i = 0; i < data.fin_funds_m_lineoffin_funds_m_headers.length; i++) {
                         $scope.data.currItem.fin_funds_m_lineoffin_funds_m_headers[i].old_allot_amt = data.fin_funds_m_lineoffin_funds_m_headers[i].allot_amt;
                         }
                         }*/
                    });
                //TT到款变更
                var name = $rootScope.$state.$current.self.name;
                if (name == "crmman.fin_funds_m_header_ttEdit") {
                    for (var i = 0; i < $scope.columns_11.length; i++) {
                        if ($scope.columns_11[i].field == "amt") {
                            $scope.columns_11[i].editable = true;
                        }
                        if ($scope.columns_11[i].field == "amt_deduct") {
                            $scope.columns_11[i].editable = true;
                        }
                        if ($scope.columns_11[i].field == "lc_interest") {
                            $scope.columns_11[i].editable = true;
                        }
                    }

                }


            })
        };
        //银行
        $scope.bank = function () {
            if ($scope.s_flag == 2) {
                return;
            }
            $scope.FrmInfo = {
                classid: "bank",
                sqlBlock: "usable=2",
            };
            BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
                $scope.data.currItem.bank_name = result.bank_name;
                $scope.data.currItem.bank_code = result.bank_code;
                $scope.data.currItem.bank_jc = result.bank_jc;
                $scope.data.currItem.account_no = result.account_no;
                $scope.data.currItem.sap_account = result.sap_account;
                $scope.data.currItem.bank_id = result.bank_id;
            })
        };
        //客户
        $scope.customer = function () {
            if (!($scope.data.currItem.change_type == 2)) {
                return;
            }
            if ($scope.data.currItem.org_code == undefined) {
                BasemanService.notice("请先选择业务部门", "alert-warning");
                return;
            }
            $scope.FrmInfo = {
                title: "客户查询",
                thead: [{
                    name: "客户编码", code: "cust_code",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "SAP编码", code: "sap_code",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "客户名称", code: "cust_name",
                    show: true, iscond: true, type: 'string'
                }, {
                    name: "客户描述", code: "cust_desc",
                    show: true, iscond: true, type: 'string'
                }],
                postdata: {
                    flag: 1
                },
                classid: "customer",
                sqlBlock: "",
                searchlist: ["cust_code", "sap_code", "cust_name", "cust_desc"],
            };
            if ($scope.data.currItem.currency_code == "CNY") {
                $scope.FrmInfo.sqlBlock = " cust_code like '%N%'";
            } else {
                $scope.FrmInfo.sqlBlock = " cust_code like '%W%' ";
            }
            $scope.FrmInfo.sqlBlock = $scope.FrmInfo.sqlBlock + " and (org_id="
                + $scope.data.currItem.org_id + " or other_org_ids like '%," + $scope.data.currItem.org_id + ",%')";
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                //明细清空
                if($scope.s_flag==3 && $scope.data.currItem.cust_id!=result.cust_id){
                    $scope.data.currItem.fin_funds_kind_lineoffin_funds_headers = [];
                }
                $scope.data.currItem.cust_desc = result.cust_desc;
                $scope.data.currItem.cust_id = result.cust_id;
                $scope.data.currItem.cust_name = result.cust_name;
                $scope.data.currItem.cust_code = result.sap_code;


            })
        };
        $scope.ChangeName=function(){
            //明细清空
            if($scope.s_flag==3){
                var data = $scope.gridGetData("options_11");
                var griddata = [];
                var item={}
                item.item_kind="";
                item.amt_deduct = "";
                item.amt = "";
                item.lc_interest = "";
                item.fact_amt ="";
                item.canuse_amt = "";//可分配金额
                griddata.push(item);
                $scope.options_11.api.setRowData(griddata);
                $scope.data.currItem.fin_funds_kind_lineoffin_funds_headers = [];
            }
            $scope.data.currItem.cust_desc = "";
            $scope.data.currItem.cust_id = "";
            $scope.data.currItem.cust_name = "";
            $scope.data.currItem.cust_code = "";
        }
        //付款总额=实收金额-扣费
        $scope.lc_interestChange = function () {
            $scope.data.currItem.amt = parseFloat($scope.data.currItem.amt) || 0;//实收金额
            $scope.data.currItem.amt_deduct = parseFloat($scope.data.currItem.amt_deduct) || 0;//扣费
            $scope.data.currItem.lc_interest = parseFloat($scope.data.currItem.lc_interest) || 0;//利息
            $scope.data.currItem.fact_amt = Number((Number($scope.data.currItem.amt || 0) + Number($scope.data.currItem.amt_deduct || 0)
            + Number($scope.data.currItem.lc_interest || 0)).toFixed(2));//付款总额
            //网格
            if ($scope.data.currItem.fin_funds_m_kind_lineoffin_funds_m_headers != undefined && $scope.data.currItem.fin_funds_m_kind_lineoffin_funds_m_headers.length > 0) {
                var data = $scope.data.currItem.fin_funds_m_kind_lineoffin_funds_m_headers;
                var griddata = [];
                data[0].amt_deduct = $scope.data.currItem.amt_deduct;
                data[0].amt = $scope.data.currItem.amt;
                data[0].lc_interest = $scope.data.currItem.lc_interest;
                data[0].fact_amt = $scope.data.currItem.amt + $scope.data.currItem.amt_deduct + $scope.data.currItem.lc_interest;
                // data[0].canuse_amt = $scope.data.currItem.amt + $scope.data.currItem.amt_deduct + $scope.data.currItem.lc_interest;//可分配金额
                griddata.push(data[0]);
                $scope.options_11.api.setRowData(griddata);
                $scope.data.currItem.fin_funds_m_kind_lineoffin_funds_m_headers = griddata;
            }
        };
    }
    /******************系统词汇*************************/
    {
        //转换币种
        $scope.GetTransCurrency = function () {
            $scope.data.currItem.trans_currency_code = "";
            $scope.data.currItem.trans_currency_name = "";
            $scope.data.currItem.trans_currency_id = "";
            var requestobj = BasemanService.RequestPostNoWait("base_search", "searchcurrency", {sqlwhere: "1=1"});
            if (requestobj.pass && requestobj.data.base_currencys.length > 0) {
                for (i = 0; i < requestobj.data.base_currencys.length; i++) {
                    $scope.data.currItem.trans_currency_code = requestobj.data.base_currencys[i].currency_code;
                    $scope.data.currItem.trans_currency_id = requestobj.data.base_currencys[i].currency_id;
                    $scope.data.currItem.trans_currency_name = requestobj.data.base_currencys[i].currency_name;
                }
            }
        };
        //币种
        $scope.changeCurrency = function () {
            for (i = 0; i < $scope.base_currencys.length; i++) {
                if ($scope.base_currencys[i].currency_code == $scope.data.currItem.currency_code) {
                    $scope.data.currItem.currency_code = $scope.base_currencys[i].currency_code;
                    $scope.data.currItem.currency_id = $scope.base_currencys[i].currency_id;
                    $scope.data.currItem.currency_name = $scope.base_currencys[i].currency_name;
                    break;
                }
            }
        };
        $scope.changetranscurrency=function(){
            for (i = 0; i < $scope.base_currencys.length; i++) {
                if ($scope.base_currencys[i].currency_id == $scope.data.currItem.trans_currency_id) {
                    $scope.data.currItem.trans_currency_code = $scope.base_currencys[i].currency_code;
                    $scope.data.currItem.trans_currency_id = $scope.base_currencys[i].currency_id;
                    $scope.data.currItem.trans_currency_name = $scope.base_currencys[i].currency_name;
                    break;
                }
            }
        }
        //货币类型
        BasemanService.RequestPostAjax("base_search", "searchcurrency", {}).then(function (data) {
            $scope.base_currencys = HczyCommon.stringPropToNum(data.base_currencys);
        });
        //状态
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
            $scope.stats = data.dicts;
        });
        //回款组织
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "return_ent_type"}).then(function (data) {
            $scope.return_ent_types = data.dicts;
        });
        //到款类型2
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "tt_type"}).then(function (data) {
            $scope.tt_types = HczyCommon.stringPropToNum(data.dicts);
        });
        //到款类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"}).then(function (data) {
            $scope.pay_types = HczyCommon.stringPropToNum(data.dicts);
        });
        //LC到款类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "lc_cash_type"}).then(function (data) {
            $scope.lc_cash_types = HczyCommon.stringPropToNum(data.dicts);
        });
        //融资类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "rongzi_type"}).then(function (data) {
            $scope.rongzi_types = HczyCommon.stringPropToNum(data.dicts);
        });
        //订单类型
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "sale_order_type"}).then(function (data) {
            $scope.sale_order_types = HczyCommon.stringPropToNum(data.dicts);
        });
        $scope.trueorfalsetests = [
            {
                id: 1,
                name: "否"
            }, {
                id: 2,
                name: "是"
            }];
        $scope.trans_currency_names = [
            {
                id: 4,
                name: "美元"
            }, {
                id: 5,
                name: "人民币"
            },
            {
                id: 6,
                name: "欧元"
            }, {
                id: 45,
                name: "港币"
            }, {
                id: 46,
                name: "测试币"
            },
            {
                id: 47,
                name: "英镑"
            },
            {
                id: 48,
                name: "加拿元"
            }];
        $scope.change_types = [
            {
                id: 1,
                name: "常规变更"
            }, {
                id: 2,
                name: "客户认领错"
            }, {
                id: 3,
                name: "资金系统单号变更"
            }, {
                id: 4,
                name: "扣费变更"
            }];
    }
    /******************保存校验、初始化*****************/
    {
        $scope.validate = function () {
            //转换币种
            if ($scope.data.currItem.trans_currency_id) {
                if (($scope.data.currItem.currency_id != $scope.data.currItem.trans_currency_id)
                    && parseFloat($scope.data.currItem.trans_currency_amt || 0) == 0) {
                    BasemanService.notice("'转换币种金额'不能为空或0", "alert-warning");
                    return;
                }
                if (($scope.data.currItem.currency_id != $scope.data.currItem.trans_currency_id)
                    && ($scope.data.currItem.trans_amt==""||$scope.data.currItem.trans_amt==undefined)) {
                    BasemanService.notice("'转换币种扣费'不能为空", "alert-warning");
                    return;
                }

            }
            //当转换币种<>币种
            if (($scope.data.currItem.currency_id != $scope.data.currItem.trans_currency_id)
                && (parseFloat($scope.data.currItem.is_yd || 0) == 0)) {
                BasemanService.notice("'是否客户约定汇率'不能为空或0", "alert-warning");
                return;
            }
            if (Number($scope.data.currItem.is_yd || 0) == 2
                && (parseFloat($scope.data.currItem.yd_rate || 0)==0)) {
                BasemanService.notice("'约定汇率'不能为空或为0", "alert-warning");
                return;
            }
            if (($scope.data.currItem.currency_id != $scope.data.currItem.trans_currency_id)
                && Number($scope.data.currItem.is_yd || 0) >0) {
                //扣费=转换币种扣费/约定汇率，保留2位小数；
                if(parseFloat($scope.data.currItem.trans_amt || 0)>0 && parseFloat($scope.data.currItem.yd_rate || 0)>0){
                    $scope.data.currItem.amt_deduct = (parseFloat($scope.data.currItem.trans_amt || 0) / parseFloat($scope.data.currItem.yd_rate || 0)).toFixed(2);
                }else{
                    $scope.data.currItem.amt_deduct=0;
                }
                //实收金额=转换币种金额/约定汇率，保留2位小数；
                if(Number($scope.data.currItem.trans_currency_amt || 0)>0&&Number($scope.data.currItem.yd_rate || 0)>0){
                    $scope.data.currItem.amt = (Number($scope.data.currItem.trans_currency_amt || 0) / Number($scope.data.currItem.yd_rate || 0)).toFixed(2);
                }else{
                    $scope.data.currItem.amt=0;
                }
                //付款总额=实收金额+扣费，保留2位小数；
                $scope.data.currItem.fact_amt = (parseFloat($scope.data.currItem.amt || 0) + parseFloat($scope.data.currItem.amt_deduct || 0)).toFixed(2);
            }
            var errorlist = []; 
            var name = $rootScope.$state.$current.self.name;
            if (name == "crmman.fin_funds_m_header_kfEdit") {
                if ($scope.data.currItem.objattachs.length == 0) {
                    errorlist.push("附件为空")
                }
            }
            if (errorlist.length) {
                BasemanService.notice(errorlist, "alert-warning");
                return false;
            }
            return true;
        };
        $scope.refresh_after = function () {
            if ($scope.data.currItem.stat != 1) {
                $("#funds_m_id").attr("disabled", true);
            }
            //可编辑
            var name = $rootScope.$state.$current.self.name;
            if (name == "crmman.fin_funds_m_header_ttEdit") {
                for (var i = 0; i < $scope.columns_11.length; i++) {
                    if ($scope.columns_11[i].field == "amt") {
                        $scope.columns_11[i].editable = true;
                    }
                }

            }

        };
        $scope.save_before = function () {
            $scope.changeCurrency();
            $scope.changetranscurrency();
            $scope.data.currItem.amt = $scope.data.currItem.amt || 0;
            $scope.data.currItem.amt_deduct = $scope.data.currItem.amt_deduct || 0;
            $scope.data.currItem.fact_amt = $scope.data.currItem.fact_amt || 0;
            $scope.data.currItem.flag = 1;
            if($scope.s_flag==3){
                $scope.data.currItem.fin_funds_m_kind_lineoffin_funds_m_headers=[];
                delete $scope.data.currItem.fin_funds_kind_lineoffin_funds_headers;
                delete $scope.data.currItem.fin_funds_m_lineoffin_funds_m_headers;

            }
            if(!($scope.data.currItem.trans_currency_id)){
                $scope.data.currItem.trans_currency_code = $scope.data.currItem.currency_code;
                $scope.data.currItem.trans_currency_id = $scope.data.currItem.currency_id;
                $scope.data.currItem.trans_currency_name = $scope.data.currItem.currency_name;
            }
        };
        //刷新数据并且设置初始化
        $scope.clearinformation = function () {
            $scope.data.currItem.org_id = window.userbean.org_id;
            $scope.data.currItem.org_name = window.userbean.org_name;
            $scope.data.currItem.org_code = window.userbean.org_code;
            $scope.data.currItem.idpath = window.userbean.idpath;
            $scope.data.currItem.sales_user_id = window.userbean.userid;
            $scope.data.currItem.creator = window.userbean.userid;
            $scope.data.currItem.funds_type = 1;
            $scope.data.currItem.stat = 1;
            $scope.data.currItem.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
            $scope.data.currItem.currency_name = "美元";
            $scope.data.currItem.currency_code = "USD";
            $scope.data.currItem.currency_id = 4;
            $scope.data.currItem.trans_currency_name = "美元";
            $scope.data.currItem.trans_currency_code = "USD";
            $scope.data.currItem.trans_currency_id = 4;
            $scope.data.currItem.wfid = "";
            $scope.data.currItem.wfflag = "";
            $scope.data.currItem.objattachs=[];
            var name = $rootScope.$state.$current.self.name;
            if (name == "crmman.fin_funds_m_header_ttEdit") {//TT到款变更
                $scope.data.currItem.change_type = 1;
            } else if (name == "crmman.fin_funds_m_header_kfEdit") {//扣费变更
                $scope.data.currItem.change_type = 4;
            } else if (name == "crmman.fin_funds_m_header_ttrlEdit") {//客户认领变更
                $scope.data.currItem.change_type = 2;
            } else if (name == "crmman.fin_funds_m_header_zjxtEdit") {//资金变更
                $scope.data.currItem.change_type = 3;
            } else if (name == "crmman.fin_funds_m_header_lcEdit") {//信用证到款录入变更
            }
        };
    }
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('fin_funds_m_headerEdit', fin_funds_m_headerEdit);
