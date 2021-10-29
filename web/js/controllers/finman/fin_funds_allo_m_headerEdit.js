'use strict';
function fin_funds_allo_m_headerEdit($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_funds_allo_m_headerEdit = HczyCommon.extend(fin_funds_allo_m_headerEdit, ctrl_bill_public);
    fin_funds_allo_m_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_funds_allo_m_header",
        key: "allo_m_id",
        wftempid: 10038,
        FrmInfo: {},
        grids: [{optionname: 'options_11', idname: 'fin_funds_allo_m_lineoffin_funds_allo_m_headers'},//金额分配明细
            {optionname: 'options_12', idname: 'fin_funds_allo_m_reduce_lineoffin_funds_allo_m_headers'},//待核销明细
            {optionname: 'options_13', idname: 'fin_funds_allo_m_invoice_lineoffin_funds_allo_m_headers'},//
            {optionname: 'options_14', idname: 'fin_funds_allo_m_kind_lineoffin_funds_allo_m_headers'}//产品部明细
        ]
    };
    $scope.beforClearInfo = function () {
        if ($rootScope.$state.$current.self.name == "crmman.fin_funds_allo_m_headerEdit") {
            $scope.s_flag = 1;//到款PI变更
            $scope.objconf.FrmInfo = {sqlBlock: "nvl(is_byhand,0) <> 2"}
        } else if ($rootScope.$state.$current.self.name == "crmman.fin_funds_allo_m_header_sgEdit") {
            $scope.s_flag = 2;//到款PI变更手工录入
            $scope.objconf.FrmInfo = {sqlBlock: "nvl(is_byhand,0)=2 "}
        }
        ;
    };
    $scope.beforClearInfo();
    /************************初始化页面***********************/
    $scope.clearinformation = function () {
        $scope.isEdit = true;
        $scope.data = {};
        if (window.userbean) {
            $scope.userbean = window.userbean;
        }
        ;
        $scope.data.currItem = {
            objattachs: [],
            stat: 1,
            creator: $scope.userbean.userid,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            funds_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            sales_user_id: $scope.userbean.userid,
            currency_name: "美元",
            currency_id: "USD",
            allo_type: 1,
            is_byhand: 1
        };
        if ($rootScope.$state.$current.self.name == "crmman.fin_funds_allo_m_headerEdit") {
            $scope.s_flag = 1;//到款PI变更
        } else if ($rootScope.$state.$current.self.name == "crmman.fin_funds_allo_m_header_sgEdit") {
            $scope.s_flag = 2;//到款PI变更手工录入
            $scope.data.currItem.is_byhand = 2
        }
        ;
    };
    /************保存校验区域***********************/
    $scope.validate = function () {
        var name = $rootScope.$state.$current.self.name;
        var piid;
        var modify_amt;
        var allo_amt;
        var send_amt;
        var tq_amt;
        var invamt1;
        var invamt2;
        var amt;
        var amt2;
        var allo_amt2;
        var tt_amt_gathering;
        var thisamt;
        var pino;
        if (name == "crmman.fin_funds_allo_m_headerEdit") {
            //校验金额
            var GridData = $scope.gridGetData("options_11");
            for (var i = 0; i < GridData.length; i++) {
                //生产订金分配金额不能为0或空
                if(GridData[i].prod_no!=""||GridData[i].prod_no!=undefined){
                    if(GridData[i].modify_prod_amt==0||GridData[i].modify_prod_amt==undefined){
                        BasemanService.notice("金额分配明细中第"+(i+1)+"行'生产定金调整金额'不能为0", "alert-info");
                        return false
                    }
                 
                }
                //校验调整金额
                if (parseFloat(GridData[i].modify_amt || 0) > 0) {
                    BasemanService.notice("金额分配明细,'调整金额'必须为负数!", "alert-warning");
                    return false;
                } else if (parseFloat(GridData[i].modify_prod_amt || 0) > 0) {
                    BasemanService.notice('生产定金分配调整金额必须是负数!', "alert-warning");
                    return false;
                }
                //校验提前到款调整金额、生产定金分配金额
                modify_amt = parseFloat(GridData[i].modify_amt || 0);
                invamt1 = parseFloat(GridData[i].modify_tq_amt|| 0);
                invamt2 = parseFloat(GridData[i].used_amt || 0);
                allo_amt = parseFloat(GridData[i].tq_amt || 0);
                if (Math.abs(invamt1) < Math.abs(modify_amt)) {
                    BasemanService.notice('第' + (i + 1) + '行的提前到款调整金额小于本次分配调整金额', "alert-warning");
                    return false;
                }
                //校验生产定金分配金额
                modify_amt = parseFloat(GridData[i].modify_amt) || 0;
                invamt1 = parseFloat(GridData[i].modify_prod_amt) || 0;
                if (Math.abs(invamt1) != Math.abs(modify_amt) && (GridData[i].prod_no != "" || GridData[i].prod_no != undefined)) {
                    BasemanService.notice('第' + (i + 1) + '行的生产定金分配调整金额应等于本次分配调整金额', "alert-warning");
                    return false;
                }

                //校验提前到款调整金额
                allo_amt = parseFloat(GridData[i].allo_amt) || 0;
                modify_amt = parseFloat(GridData[i].modify_amt) || 0;
                invamt1 = parseFloat(GridData[i].modify_tq_amt) || 0;
                invamt2 = parseFloat(GridData[i].used_amt) || 0;
                if (Math.abs(invamt1) < Math.abs(modify_amt)) {
                    BasemanService.notice('第' + (i + 1) + '行的提前到款调整金额小于本次分配调整金额', "alert-warning");
                    return false;
                } else if (Math.abs(modify_amt) + Math.abs(allo_amt) < Math.abs(invamt1) + Math.abs(invamt2)) {
                    BasemanService.notice('第' + (i + 1) + '行的调整后提前到款金额大于调整后本次分配金额', "alert-warning");
                    return false;
                }
                //校验生产定金分配金额
                invamt1 = parseFloat(GridData[i].modify_prod_amt) || 0;
                invamt2 = parseFloat(GridData[i].prod_amt) || 0;
                if ((Math.abs(modify_amt) + Math.abs(allo_amt)) < ( Math.abs(invamt1) + Math.abs(invamt2))) {
                    BasemanService.notice('第' + (i + 1) + '行的调整后生产定金分配金额大于调整后本次分配金额', "alert-warning");
                    return false;
                }
                //校验生产定金调整金额只能两位小数
                thisamt = parseFloat(GridData[i].modify_prod_amt) || 0;
            }
        }
        if (name == "crmman.fin_funds_allo_m_header_sgEdit") {
            modify_amt = parseFloat($scope.data.currItem.modify_amt || 0);
            var total_allo_amt = parseFloat($scope.data.currItem.total_allo_amt || 0);
            if (modify_amt > 0) {
                BasemanService.notice("分配调整金额必须为负数", "alert-warning");
                return false;
            }
            modify_amt=Math.abs(modify_amt).toFixed(2)
            if(Number(modify_amt||0) > (total_allo_amt)) {
                BasemanService.notice('调整金额的绝对值不能大于本次分配总金额!', "alert-warning");
                return false;
            }
        } else {
            //TT正常更改
            if ($scope.data.currItem.allo_type == 1) {
                // var GridData = $scope.data.currItem.fin_funds_allo_m_lineoffin_funds_allo_m_headers;
                var GridData = $scope.gridGetData("options_11");
                for (var i = 0; i < GridData.length; i++) {
                    if (parseFloat(GridData[i].modify_amt || 0) != 0) {
                        GridData[i].modify_amt = parseFloat(GridData[i].modify_amt || 0);
                        GridData[i].allo_amt = parseFloat(GridData[i].allo_amt || 0);
                        amt = GridData[i].modify_amt + GridData[i].allo_amt;
                        pino = GridData[i].pi_no || "";
                        amt2 = 0;
                        allo_amt = 0;
                        modify_amt = 0;
                        allo_amt2 = 0;
                    }
                    var amt2 = 0;
                    var allo_amt = 0;
                    var allo_amt2 = 0;
                    var Grid3Data = $scope.gridGetData("options_13");
                    for (var j = 1; j < Grid3Data.length; j++) {
                        if (Grid3Data[j].pi_no == pino) {
                            modify_amt = parseFloat(GridData[j].modify_amt || 0);
                            allo_amt = parseFloat(GridData[j].invoice_check_amt || 0);
                            allo_amt2 = parseFloat(GridData[j].allo_amt2) + parseFloat(GridData[j].allo_amt);
                            amt2 = amt2 + (parseFloat(GridData[j].allo_amt) + modify_amt);
                        }
                    }
                    if ((amt < amt2) && (allo_amt2 > 0)) {
                        BasemanService.notice('PI:' + pino + ' 有对应的核销明细,不能是TT正常更改!', "alert-warning");
                        return false;
                    }
                }
            }
        }
        if ($scope.data.currItem.stat == 1 && $scope.data.currItem.objattachs.length == 0 || $scope.data.currItem.objattachs.length == undefined) {
            BasemanService.notice("到款PI分配变更,必须上传附件", "alert-warning");
            return false;
        }
        return true;
        /*var thisamt = parseFloat(GridData[i].modify_amt) || 0;
         //分配调整金额应该与待核销明细校验
         if ($scope.data.currItem.allo_type = 2) {
         modify_amt = parseFloat(GridData[i].modify_amt || 0);
         piid = GridData[i].pi_id || 0;
         pino = GridData[i].pi_no || "";
         tq_amt = parseFloat(GridData[i].modify_tq_amt || 0);
         allo_amt = 0;
         var Grid1Data = $scope.gridGetData("options_12");
         for (var j = 0; j < Grid1Data.length; j++) {
         if (piid == Grid1Data[j].pi_id) {
         allo_amt = allo_amt + parseFloat(GridData[j].modify_amt || 0);
         } else if (parseFloat(GridData[j].tq_amt || 0) > 0) {
         if ((Math.abs(modify_amt) - Math.abs(allo_amt)) != 0 && (Math.abs(tq_amt) - Math.abs(allo_amt)) != 0 && Math.abs(tq_amt) > 0) {
         BasemanService.notice('PI[%s]分配调整金额应该与待核销明细保持一致', "alert-warning");
         return false;
         }
         } else {
         if ((Math.abs(modify_amt) - Math.abs(allo_amt)) != 0) {
         BasemanService.notice('PI[%s]分配调整金额应该与待核销明细保持一致', "alert-warning");
         return false;
         }
         }
         var allo_amt = 0;
         var Grid3Data = $scope.gridGetData("options_12");
         for (var i = 0; i < Grid3Data.length; j++) {
         modify_amt = parseFloat(GridData[i].modify_amt || 0);
         allo_amt = parseFloat(GridData[i].invoice_check_amt || 0);
         allo_amt2 = parseFloat(GridData[i].allo_amt2 || 0) + parseFloat(GridData[i].allo_amt || 0);
         amt2 = amt2 + (parseFloat(GridData[i].allo_amt || 0) + modify_amt);
         if ((Math.abs(modify_amt) - Math.abs(allo_amt)) > 0) {
         BasemanService.notice('商业发票核销明细第' + (j + 1) + '行分配调整金额(' + parseFloat(modify_amt) + ')的绝对值大于本次分配金额(' + parseFloat(allo_amt) + ')!', "alert-warning");
         return false;
         }
         /*var k1 = 0;
         for (var j = 1; j < Grid3Data.length; j++) {
         if (Grid3Data[j].invoice_no == Grid3Data[i].invoice_no) {
         k1 = k1 + 1;
         }
         var k2 = 0;
         if (k1 = k2) {
         // var Grid1Data = $scope.data.currItem.fin_funds_allo_m_reduce_lineoffin_funds_allo_m_headers ;
         var Grid1Data = $scope.gridGetData("options_12");
         for (var j = 0; j < Grid1Data.length; j++) {
         if (Grid3Data[j].invoice_no == Grid3Data[i].invoice_no) {
         if (parseFloat(Grid3Data[j].modify_amt || 0) != parseFloat(Grid3Data[i].modify_amt||0)) {
         BasemanService.notice('商业发票核销明细与待核销明细相同发票号[' + Grid3Data[j].invoice_no + '分配调整金额应相等!', "alert-warning");
         return false;
         }
         }
         }
         }
         }
         }
         }
         }*/
        /*if ($scope.data.currItem.funds_type == 0 || $scope.data.currItem.funds_type < 0) {
         modify_amt = parseFloat(GridData[i].modify_amt || 0);
         allo_amt = parseFloat(GridData[i].allo_amt || 0);
         send_amt = parseFloat(GridData[i].send_amt || 0);
         if ($scope.data.currItem.allo_type == 1) {
         if ((Math.abs(modify_amt) - (Math.abs(allo_amt) - Math.abs(send_amt))) > 0) {
         BasemanService.notice('第' + (i + 1) + '行分配调整金额的绝对值大于本次分配金额减发货金额!', "alert-warning");
         return false;
         }
         } else {
         if ((Math.abs(modify_amt) - Math.abs(allo_amt)) > 0) {
         BasemanService.notice('第' + (i + 1) + '行分配调整金额的绝对值大于本次分配金额!', "alert-warning");
         return false;
         }
         }
         } else {
         modify_amt = parseFloat(GridData[i].modify_amt || 0);
         allo_amt = parseFloat(GridData[i].allo_amt || 0);
         if ((Math.abs(modify_amt) - Math.abs(allo_amt)) > 0) {
         BasemanService.notice('第' + (i + 1) + '行分配调整金额(%f)的绝对值大于本次分配金额(%f)!', "alert-warning");
         return false;
         }
         }
         //校验"TT定金更改'modify_prod_amt
         if ($scope.data.currItem.allo_type == 3 && (GridData[i].modify_amt == 0 || GridData[i].modify_amt == undefined)) {
         BasemanService.notice('第' + (i + 1) + '行的调整后生产定金分配金额不能为0', "alert-warning");
         return false;
         }*/
    }
    $scope.save_before = function () {
        $scope.data.currItem.total_allo_amt = parseFloat($scope.data.currItem.total_allo_amt || 0);
        $scope.data.currItem.modify_amt = parseFloat($scope.data.currItem.modify_amt || 0);
        if ($scope.s_flag == 2) {
            delete $scope.data.currItem.fin_funds_allo_m_invoice_lineoffin_funds_allo_m_headers;
            delete $scope.data.currItem.fin_funds_allo_m_kind_lineoffin_funds_allo_m_headers;
            delete $scope.data.currItem.fin_funds_allo_m_lineoffin_funds_allo_m_headers;
            delete $scope.data.currItem.fin_funds_allo_m_reduce_lineoffin_funds_allo_m_headers;
        }

    };
    /**********************下拉框值查询（系统词汇）***************/
    //更改类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "allo_type"}).then(function (data) {
        $scope.allo_types = HczyCommon.stringPropToNum(data.dicts);
    });
    //回款组织
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "return_ent_type"}).then(function (data) {
        $scope.return_ent_types = HczyCommon.stringPropToNum(data.dicts);
    });
    //订单类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "sale_order_type"}).then(function (data) {
        $scope.sale_order_types = HczyCommon.stringPropToNum(data.dicts);
    });
    //到款类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"}).then(function (data) {
        $scope.pay_types = HczyCommon.stringPropToNum(data.dicts);
    });
    /************************网格下拉**********************/
    //到款类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"})
        .then(function (data) {
            var pay_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                pay_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_12', 'pay_type')) {
                $scope.columns_12[$scope.getIndexByField('columns_12', 'pay_type')].cellEditorParams.values = pay_types;
            }
        });
    /**********************弹出框值查询**************************/
    // 分配单查询
    $scope.fin_funds_header = function () {
        $scope.FrmInfo = {
            classid: "fin_funds_allo_header"
        };
        var name = $rootScope.$state.$current.self.name;
        if (name == "crmman.fin_funds_allo_m_headerEdit") {
            $scope.FrmInfo.sqlBlock = "stat = 5 and nvl(is_byhand,0) <> 2 and not exists (select 1 from fin_funds_allo_m_header mh where mh.allo_id=Fin_Funds_Allo_Header.allo_id and mh.stat<>5)";
        } else if (name == "crmman.fin_funds_allo_m_header_sgEdit") {
            $scope.FrmInfo.sqlBlock = "stat = 5 and nvl(is_byhand,0) =2 and not exists (select 1 from fin_funds_allo_m_header mh where mh.allo_id=Fin_Funds_Allo_Header.allo_id and mh.stat<>5)"
        }
        BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
            HczyCommon.stringPropToNum(result);
            result.creator = $scope.data.currItem.creator;
            result.stat = $scope.data.currItem.stat;
            result.create_time = $scope.data.currItem.create_time;
            result.wfid = undefined;
            result.wfflag = undefined;
            result.check_time = undefined;
            result.checkor = undefined;
            for (var name in result) {
                if (result[name] != undefined && !(result[name] instanceof Array)) {
                    $scope.data.currItem[name] = result[name];
                }
            }
            $scope.data.currItem.stat = 1;
            /*if($scope.data.currItem.funds_type==2){}else{//改变颜色}*/
            BasemanService.RequestPost("fin_funds_allo_header", "select", {
                allo_id: $scope.data.currItem.allo_id,
                allo_no: $scope.data.currItem.allo_no
            }).then(function (data) {
                $scope.data.currItem.sap_no = data.sap_no;
                if (data.fin_funds_allo_lineoffin_funds_allo_headers.length != 0) {
                    $scope.options_11.api.setRowData(data.fin_funds_allo_lineoffin_funds_allo_headers);
                    $scope.data.currItem.fin_funds_allo_m_lineoffin_funds_allo_m_headers = data.fin_funds_allo_lineoffin_funds_allo_headers;
                }
                if (data.fin_funds_allo_kind_lineoffin_funds_allo_headers.length > 0) {
                    $scope.options_14.api.setRowData(data.fin_funds_allo_kind_lineoffin_funds_allo_headers);
                    $scope.data.currItem.fin_funds_allo_m_kind_lineoffin_funds_allo_m_headers = data.fin_funds_allo_kind_lineoffin_funds_allo_headers;
                }
                if (data.fin_funds_allo_reduce_lineoffin_funds_allo_headers.length > 0) {
                    $scope.options_12.api.setRowData(data.fin_funds_allo_reduce_lineoffin_funds_allo_headers);
                    $scope.data.currItem.fin_funds_allo_m_reduce_lineoffin_funds_allo_m_headers = data.fin_funds_allo_reduce_lineoffin_funds_allo_headers;
                }
                if (data.fin_funds_allo_invoice_lineoffin_funds_allo_headers.length > 0) {
                    $scope.options_13.api.setRowData(data.fin_funds_allo_invoice_lineoffin_funds_allo_headers);
                    $scope.data.currItem.fin_funds_allo_m_invoice_lineoffin_funds_allo_m_headers = data.fin_funds_allo_invoice_lineoffin_funds_allo_headers;

                }
            });
        })
    };
    //业务部门
    $scope.scporg = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            sqlBlock: "1=1 and stat =2 and OrgType = 5",
            backdatas: "orgs"
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_id = result.orgid;
            $scope.options_11.api.setRowData([]);
            $scope.data.currItem.fin_funds_allo_m_lineoffin_funds_allo_m_headers = [];
        })
    };
    /**************************网格定义********************************/
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
            headerName: "产品部", field: "item_kind", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 1, desc: '空调组织'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分配单号", field: "allo_no", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 100,
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
        }, {
            headerName: "调整金额", field: "modify_amt", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
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
            headerName: "本次分配金额", field: "allo_amt", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产单号", field: "prod_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产定金分配金额", field: "prod_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产定金调整金额", field: "modify_prod_amt", editable: true, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "原生产定金率", field: "p_prod_rate", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "调整后生产定金率", field: "prod_rate", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "提前到款调整金额", field: "modify_tq_amt", editable: true, filter: 'set', width: 150,
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
            cellEditor: "文本框",
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
            cellEditor: "复选框",
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
            headerName: "已发货确认金额", field: "confirm_amt", editable: false, filter: 'set', width: 130,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已使用金额", field: "used_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    //待核销明细
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
            headerName: "发票流水号", field: "invoice_no", editable: false, filter: 'set', width: 135,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "商业发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 140,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "金额", field: "amount", editable: false, filter: 'set', width: 100,
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
            headerName: "此次分配金额", field: "allot_amt", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分配调整金额", field: "modify_amt", editable: true, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    //资金到款分配商业发票核销明细
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
            headerName: "此次核销金额", field: "invoice_check_amt", editable: false, filter: 'set', width: 120,
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
            headerName: "商业发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 140,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "分配调整金额", field: "modify_amt", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
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
            headerName: "到款总额", field: "fact_amt", editable: false, filter: 'set', width: 100,
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
    //数据缓存
    $scope.initdata();
}
;
angular.module('inspinia')
    .controller('fin_funds_allo_m_headerEdit', fin_funds_allo_m_headerEdit)
