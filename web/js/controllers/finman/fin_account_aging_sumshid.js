var finmanControllers = angular.module('inspinia');
function fin_account_aging_sumshid($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_account_aging_sumshid = HczyCommon.extend(fin_account_aging_sumshid, ctrl_bill_public);
    fin_account_aging_sumshid.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "bill_invoice_header",
        /*     key: "funds_id",*/
        wftempid: 10008,
        FrmInfo: {
            /* sqlBlock: "funds_type=2",*/
        },
        grids: [{optionname: 'options_11', idname: 'bill_invoice_lineofbill_invoice_headers'}/*, {
         optionname: 'options_12',
         idname: 'fin_funds_kind_lineoffin_funds_headers'
         }, {optionname: 'options_13', idname: 'fin_funds_xypmoffin_funds_headers'}*/]
    };

    /**********************初始化*************************/
    $scope.clearinformation = function () {

        $scope.data.currItem.end_date = moment().format('YYYY-MM-DD HH:mm:ss');
    };

    /*查询*/
    $scope.search = function () {
        var date1 = $scope.data.currItem.startdate;
        var date2 = $scope.data.currItem.enddate;
        var sqlBlock = "";
        if (date1 > date2) {
            BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
            return;
        }
        if ($scope.data.currItem.time_flag != 2) {
            $scope.data.currItem.time_flag = 1;
        }
        sqlBlock = "";
        //BasemanService.getSqlWhereBlock(sqlBlock);
        var postdata = {
            flag: 15,
            sqlwhere: sqlBlock,
            org_id: $scope.data.currItem.org_id,
            cust_id: $scope.data.currItem.cust_id,
            org_code: $scope.data.currItem.area_code,
            start_date: $scope.data.currItem.startdate,
            end_date: $scope.data.currItem.end_date,
            fact_invoice_no: $scope.data.currItem.fact_invoice_no,
            pi_no: $scope.data.currItem.pi_no,

            bill_type: $scope.data.currItem.time_flag,
            inspection_batchno: $scope.data.currItem.inspection_batchno
        };
        BasemanService.RequestPost("bill_invoice_header", "accountaging", postdata)
            .then(function (data) {
                $scope.data.currItem.bill_invoice_lineofbill_invoice_headers = data.bill_invoice_lineofbill_invoice_headers;
                $scope.options_11.api.setRowData(data.bill_invoice_lineofbill_invoice_headers);
            });
    }


    //业务部门
    $scope.changeAreaName = function () {
        $scope.data.currItem.org_code = "";
        $scope.data.currItem.org_name = "";
        $scope.data.currItem.org_id = "";
    };
    //客户 
    $scope.change_customer = function () {
        $scope.data.currItem.cust_code = "";
        $scope.data.currItem.cust_name = "";
        $scope.data.currItem.cust_id = "";
    };
    //大区
    $scope.change_area = function () {
        $scope.data.currItem.area_code = "";
        $scope.data.currItem.area_name = "";
    };
    $scope.cheked2 = function () {
        if ($scope.data.currItem.deliver_date == 2) {

            $scope.data.currItem.time_flag = 2;
        } else
            $scope.data.currItem.time_flag = 1;
    }
    $scope.area = function () {

        $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
            backdatas: "orgs",
            sqlBlock: "stat =2 and orgtype in (3)"
            /*sqlBlock: "org_id = " + $scope.data.currItem.org_id*/
        };

        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_code = result.orgid;
            $scope.data.currItem.area_code = result.orgid;
            $scope.data.currItem.area_name = result.orgname;
        });

    }

    $scope.selectorg = function () {
        $scope.FrmInfo = {

            classid: "scporg",
            postdata: {},
            sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",
            backdatas: "orgs",

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = result.orgid;
            $scope.data.currItem.org_codea = result.code;
            $scope.data.currItem.org_name = result.orgname
        });
    }


    $scope.selectcust = function () {

//		if ($scope.data.currItem.org_code == undefined || $scope.data.currItem.org_code == "") {
//            BasemanService.notice("请先选业务部门", "alert-warning");
//            return;
//			}
        var flg = "";
        if ($scope.data.currItem.org_id != "" && $scope.data.currItem.org_id != undefined) {
            flg = "org_id = " + $scope.data.currItem.org_id;
        }
        $scope.FrmInfo = {
            title: "客户",
            thead: [
                {
                    name: "客户编码",
                    code: "cust_code",
                    show: true,
                    iscond: true,
                    type: 'string'

                }, {
                    name: "SAP编码",
                    code: "sap_code",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户名称",
                    code: "cust_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "客户描述",
                    code: "cust_desc",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            is_custom_search: true,
            is_high: true,
            classid: "customer",
            sqlBlock: flg
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.sap_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_id = result.cust_id;
        });

    }
    /**------- 系统词汇词查询区域------*/
    //需要查询--贸易类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"})
        .then(function (data) {
            var trade_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                trade_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_11', 'sale_ent_type')) {
                $scope.columns_11[$scope.getIndexByField('columns_11', 'sale_ent_type')].cellEditorParams.values = trade_types;
            }
        });
    /**********************隐藏、显示*************************/
    //汇总

    $scope.clickchange3 = function () {
        if ($scope.data.currItem.check3 != true) {
            //$scope.options_12.columnApi.hideColumns(["org_name"]);
            $scope.options_12.columnApi.setColumnsVisible(["org_name"]);
        } else {
            //$scope.options_12.columnApi.setColumnsVisible(["org_name"]);
            $scope.options_12.columnApi.hideColumns(["org_name"]);
           // $scope.options_12.columnApi.setColumnsVisible(["end_date"]);
            $scope.options_12.columnApi.setColumnsVisible(["amt_gathering"]);
            $scope.options_12.columnApi.setColumnsVisible(["invoice_amt"]);
            $scope.options_12.columnApi.setColumnsVisible(["invoice_time"]);
            $scope.options_12.columnApi.setColumnsVisible(["notice_no"]);
            $scope.options_12.columnApi.setColumnsVisible(["funds_no"]);
            $scope.options_12.columnApi.setColumnsVisible(["fact_invoice_no"]);
            //$scope.options_12.columnApi.setColumnsVisible(["pay_type"]);
            //$scope.options_12.columnApi.setColumnsVisible(["pi_no"]);
            $scope.options_12.columnApi.setColumnsVisible(["day"]);
            if($scope.data.currItem.check4 != true){
                $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
                $scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
            }
            if($scope.data.currItem.check5 != true){
                $scope.options_12.columnApi.setColumnsVisible(["pay_type"]);

            }
            if($scope.data.currItem.check6 != true){
                $scope.options_12.columnApi.setColumnsVisible(["pi_no"]);

            }
            if($scope.data.currItem.check7 != true){
                $scope.options_12.columnApi.setColumnsVisible(["end_date"]);

            }
        }
    };
    $scope.clickchange4 = function () {
        if ($scope.data.currItem.check4 != true) {
            $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
        } else {
            $scope.options_12.columnApi.hideColumns(["cust_name"]);
            //$scope.options_12.columnApi.hideColumns(["cust_code"]);
            //$scope.options_12.columnApi.setColumnsVisible(["end_date"]);
           // $scope.options_12.columnApi.setColumnsVisible(["org_name"]);
          //  $scope.options_12.columnApi.setColumnsVisible(["pay_type"]);
           // $scope.options_12.columnApi.setColumnsVisible(["pi_no"]);
            $scope.options_12.columnApi.setColumnsVisible(["amt_gathering"]);
            $scope.options_12.columnApi.setColumnsVisible(["invoice_amt"]);
            $scope.options_12.columnApi.setColumnsVisible(["invoice_time"]);
            $scope.options_12.columnApi.setColumnsVisible(["notice_no"]);
            $scope.options_12.columnApi.setColumnsVisible(["funds_no"]);
            $scope.options_12.columnApi.setColumnsVisible(["fact_invoice_no"]);
            $scope.options_12.columnApi.setColumnsVisible(["day"]);
            if($scope.data.currItem.check3 != true){
                $scope.options_12.columnApi.setColumnsVisible(["org_name"]);

            }
            if($scope.data.currItem.check5 != true){
                $scope.options_12.columnApi.setColumnsVisible(["pay_type"]);

            }
            if($scope.data.currItem.check6 != true){
                $scope.options_12.columnApi.setColumnsVisible(["pi_no"]);

            }
            if($scope.data.currItem.check7 != true){
                $scope.options_12.columnApi.setColumnsVisible(["end_date"]);

            }
        }
    };
    $scope.clickchange5 = function () {
        if ($scope.data.currItem.check5 != true) {
            $scope.options_12.columnApi.setColumnsVisible(["pay_type"]);
        } else {
            $scope.options_12.columnApi.hideColumns(["pay_type"]);
            //$scope.options_12.columnApi.setColumnsVisible(["end_date"]);
            //$scope.options_12.columnApi.setColumnsVisible(["org_name"]);
           // $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
           // $scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
            $scope.options_12.columnApi.setColumnsVisible(["pi_no"]);
            $scope.options_12.columnApi.setColumnsVisible(["amt_gathering"]);
            $scope.options_12.columnApi.setColumnsVisible(["invoice_amt"]);
            $scope.options_12.columnApi.setColumnsVisible(["invoice_time"]);
            $scope.options_12.columnApi.setColumnsVisible(["notice_no"]);
            $scope.options_12.columnApi.setColumnsVisible(["funds_no"]);
            $scope.options_12.columnApi.setColumnsVisible(["fact_invoice_no"]);
            $scope.options_12.columnApi.setColumnsVisible(["day"]);
            if($scope.data.currItem.check3 != true){
                $scope.options_12.columnApi.setColumnsVisible(["org_name"]);

            }
            if($scope.data.currItem.check4 != true){
                $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
                $scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
            }
            if($scope.data.currItem.check6 != true){
                $scope.options_12.columnApi.setColumnsVisible(["pi_no"]);

            }
            if($scope.data.currItem.check7 != true){
                $scope.options_12.columnApi.setColumnsVisible(["end_date"]);

            }
        }
    };
    $scope.clickchange6 = function () {
        if ($scope.data.currItem.check6 != true) {
            $scope.options_12.columnApi.setColumnsVisible(["pi_no"]);
        } else {
            $scope.options_12.columnApi.hideColumns(["pi_no"]);
            //$scope.options_12.columnApi.setColumnsVisible(["pay_type"]);
            //$scope.options_12.columnApi.setColumnsVisible(["end_date"]);
            //$scope.options_12.columnApi.setColumnsVisible(["org_name"]);
            //$scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
            $scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
            $scope.options_12.columnApi.setColumnsVisible(["amt_gathering"]);
            $scope.options_12.columnApi.setColumnsVisible(["invoice_amt"]);
            $scope.options_12.columnApi.setColumnsVisible(["invoice_time"]);
            $scope.options_12.columnApi.setColumnsVisible(["notice_no"]);
            $scope.options_12.columnApi.setColumnsVisible(["funds_no"]);
            $scope.options_12.columnApi.setColumnsVisible(["fact_invoice_no"]);
            $scope.options_12.columnApi.setColumnsVisible(["day"]);
            if($scope.data.currItem.check3 != true){
                $scope.options_12.columnApi.setColumnsVisible(["org_name"]);

            }
            if($scope.data.currItem.check4 != true){
                $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
                $scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
            }
            if($scope.data.currItem.check5 != true){
                $scope.options_12.columnApi.setColumnsVisible(["pay_type"]);

            }
            if($scope.data.currItem.check7 != true){
                $scope.options_12.columnApi.setColumnsVisible(["end_date"]);

            }
        }
    };
    $scope.clickchange7 = function () {
        if ($scope.data.currItem.check7 != true) {
            $scope.options_12.columnApi.setColumnsVisible(["end_date"]);
        } else {
            $scope.options_12.columnApi.hideColumns(["end_date"]);
           // $scope.options_12.columnApi.setColumnsVisible(["pi_no"]);
            //$scope.options_12.columnApi.setColumnsVisible(["pay_type"]);
            //$scope.options_12.columnApi.setColumnsVisible(["org_name"]);
          //  $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
            $scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
            $scope.options_12.columnApi.setColumnsVisible(["amt_gathering"]);
            $scope.options_12.columnApi.setColumnsVisible(["invoice_amt"]);
            $scope.options_12.columnApi.setColumnsVisible(["invoice_time"]);
            $scope.options_12.columnApi.setColumnsVisible(["notice_no"]);
            $scope.options_12.columnApi.setColumnsVisible(["funds_no"]);
            $scope.options_12.columnApi.setColumnsVisible(["fact_invoice_no"]);
            $scope.options_12.columnApi.setColumnsVisible(["day"]);
            if($scope.data.currItem.check3 != true){
                $scope.options_12.columnApi.setColumnsVisible(["org_name"]);

            }
            if($scope.data.currItem.check4 != true){
                $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
                $scope.options_12.columnApi.setColumnsVisible(["cust_code"]);
            }
            if($scope.data.currItem.check5 != true){
                $scope.options_12.columnApi.setColumnsVisible(["pay_type"]);

            }
            if($scope.data.currItem.check6 != true){
                $scope.options_12.columnApi.setColumnsVisible(["pi_no"]);

            }
        }
    };


    //汇总保留2位
    $scope.sum_retain = function () {
        var nodes = $scope.options_12.api.getModel().rootNode.childrenAfterSort;
        var data = $scope.gridGetData("options_12");
        for (var i = 0; i < $scope.columns_12.length; i++) {
            for (var j = 0; j < data.length; j++) {
                if ($scope.columns_12[i].field == "prod_amt") {
                    if (data[j].prod_amt != undefined) {
                        data[j].prod_amt = parseFloat(data[j].prod_amt || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "new_qty") {
                    if (data[j].new_qty != undefined) {
                        data[j].new_qty = parseFloat(data[j].new_qty || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "redo_qty") {
                    if (data[j].redo_qty != undefined) {
                        data[j].redo_qty = parseFloat(data[j].redo_qty || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "s1") {
                    if (data[j].s1 != undefined) {
                        data[j].s1 = parseFloat(data[j].s1 || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "s3") {
                    if (data[j].s3 != undefined) {
                        data[j].s3 = parseFloat(data[j].s3 || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "s8") {
                    if (data[j].s8 != undefined) {
                        data[j].s8 = parseFloat(data[j].s8 || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "s6") {
                    if (data[j].s6 != undefined) {
                        data[j].s6 = parseFloat(data[j].s6 || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "s11") {
                    if (data[j].s11 != undefined) {
                        data[j].s11 = parseFloat(data[j].s11 || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "s12") {
                    if (data[j].s12 != undefined) {
                        data[j].s12 = parseFloat(data[j].s12 || 0).toFixed(2);
                    }
                }
                if ($scope.columns_12[i].field == "amt4") {
                    if (data[j].amt4 != undefined) {
                        data[j].amt4 = parseFloat(data[j].amt4 || 0).toFixed(2);
                    }
                }
            }

        }
        $scope.options_12.api.refreshCells(nodes, ["prod_amt", "amt4", "s12", "s11", "s6", "s8", "s3", "s1", "redo_qty", "new_qty", "prod_amt"]);
    };
    //汇总列
    $scope.groupby = function (arr, column, datas) {
    if($scope.data.currItem.check7 == true){
        $scope.options_12.columnApi.setColumnsVisible(["pi_no"]);
        $scope.options_12.columnApi.setColumnsVisible(["pay_type"]);
        $scope.options_12.columnApi.setColumnsVisible(["org_name"]);
        $scope.options_12.columnApi.setColumnsVisible(["cust_name"]);
        $scope.data.currItem.check3=false;
        $scope.data.currItem.check4=false;
        $scope.data.currItem.check5=false;
        $scope.data.currItem.check6=false;
    }
        $scope.sumcontainer = [];
        var arr = [], column = [];
        var sortmodel = [];
        var data = $scope.gridGetData("options_11");

        if ($scope.data.currItem.check3 == true) {
            arr.push("org_name");
            $scope.options_12.columnApi.hideColumns(["org_name"])
            sortmodel.push({colId: "org_name", sort: "desc"})
        }
        if ($scope.data.currItem.check4 == true) {
            arr.push("cust_name");
            $scope.options_12.columnApi.hideColumns(["cust_name"])
            sortmodel.push({colId: "cust_name", sort: "desc"})
        }
        if ($scope.data.currItem.check6 == true) {
            arr.push("pi_no");
            $scope.options_12.columnApi.hideColumns(["pi_no"])
            sortmodel.push({colId: "pi_no", sort: "desc"})
        }
        if ($scope.data.currItem.check5 == true) {
            arr.push("pay_type");
            $scope.options_12.columnApi.hideColumns(["pay_type"])
            sortmodel.push({colId: "pay_type", sort: "desc"})
        }
        if ($scope.data.currItem.check7 == true) {
            arr.push("end_date");
            $scope.options_12.columnApi.hideColumns(["end_date"])
            sortmodel.push({colId: "end_date", sort: "desc"})
        }

        column[0] = "invoice_time";
        column[1] = "amount6";
        column[2] = "amount5";
        column[3] = "amount4";
        column[4] = "amount3";
        column[5] = "amount2";
        column[6] = "amount1";
        column[7] = "amount0";
        column[8] = "allow_amt";
        column[9] = "rec_amount";
        column[10] = "s12";
        column[11] = "amt4";
        var sumcontainer = HczyCommon.Summary(arr, column, data);

        //汇总最后一行
        var total = {};
        for (var j = 0; j < column.length; j++) {
            var arr = column[j];
            total[arr] = 0;
        }
        for (var i = 0; i < sumcontainer.length; i++) {
            for (var j = 0; j < column.length; j++) {
                var arr = column[j];
                if (sumcontainer[i][arr] != undefined) {
                    total[arr] += parseFloat(sumcontainer[i][arr]);
                }
            }
        }
        for (var j = 0; j < column.length; j++) {
            var arr = column[j];
            total[arr] = parseFloat(total[arr]).toFixed(2);
        }
        total.cust_code = "合计";
        sumcontainer.push(total);
        $scope.options_12.api.setRowData(sumcontainer);
        $scope.options_12.api.setSortModel(sortmodel)

        $scope.sum_retain();
    };
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
            headerName: "截止日期", field: "end_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "贸易类型", field: "sale_ent_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发票类型", field: "invoice_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "业务部门名称", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 100,
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
            headerName: "商业发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "付款方式", field: "pay_type", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "付款比例1（%）", field: "pay_ratio1", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "付款方式2（%）", field: "pay_ratio2", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "币种", field: "currency_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "金额", field: "invoice_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            /*            cellEditorParams: {
             values: [{value: "1", desc: "空调组织"}]
             },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已回款金额", field: "amt_gathering", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "应收账款余额", field: "rec_amount", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "人民币应收账款余额", field: "allow_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "出货日期", field: "send_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "到期日期", field: "pay_date", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "到期天数", field: "day", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "当前", field: "amount0", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "0-30天", field: "amount1", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "30-60天", field: "amount2", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "60-90天", field: "amount3", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "90-120天", field: "amount4", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "120-180天", field: "amount5", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "180天以上", field: "amount6", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "风险金", field: "fxj_amt", editable: false, filter: 'set', width: 150,
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
    //产品部信息
    $scope.columns_12 = [{
            headerName: "截止日期", field: "end_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
    },{
            headerName: "业务部门", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户", field: "cust_name", editable: false, filter: 'set', width: 150,
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
            headerName: "付款方式", field: "pay_type", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "金额", field: "invoice_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        , {
            headerName: "已回款金额", field: "amt_gathering", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "应收账款余额", field: "rec_amount", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "人民币应收余额", field: "allow_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "当前", field: "amount0", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "0-30天", field: "amount1", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "30-60天", field: "amount2", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "60-90天", field: "amount3", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "90-120天", field: "amount4", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "120-180天", field: "amount5", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "超过180天", field: "amount6", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "回款期限", field: "day", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "实际发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "资金单号", field: "funds_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发货通知单号", field: "notice_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "开票时间", field: "invoice_time", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "风险金", field: "invoice_time", editable: false, filter: 'set', width: 100,
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


    $scope.initdata();
}

//加载控制器
finmanControllers
    .controller('fin_account_aging_sumshid', fin_account_aging_sumshid);
