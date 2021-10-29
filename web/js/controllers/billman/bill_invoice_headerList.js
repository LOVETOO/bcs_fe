'use strict';
function bill_invoice_headerList($scope, $location, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    bill_invoice_headerList = HczyCommon.extend(bill_invoice_headerList, ctrl_bill_public);
    bill_invoice_headerList.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    $scope.objconf = {
        grids: [
            {optionname: 'options_11', idname: 'bill_invoice_headers'},
            {optionname: 'options_21', idname: 'sale_notice_sapofsale_ship_notice_headers'},
            {optionname: 'options_31', idname: 'sale_customs_lineofsale_customs_headers'}
        ]
    };
    $scope.is_cshs = [{
        dictvalue: 1,
        dictname: "手工在SAP开票"
    }, {
        dictvalue: 2,
        dictname: "OMS引入SAP开票"
    }];
    $scope.is_erp_processs = [{
        dictvalue: 1,
        dictname: "未引入"
    }, {
        dictvalue: 2,
        dictname: "已引入"
    }];
    $scope.search = function () {
        if ($scope.data.currItem.is_csh == undefined) {
            BasemanService.notice("开票状态未选择", "alert-info");
            return;
        }
        var postdata = {};
        postdata.flag = 13;
        postdata.sqlwhere = " stat = 5 ";
        if ($scope.data.currItem.start_date) {
            postdata.sqlwhere += " and check_time >= to_date('" + $scope.data.currItem.start_date + "','yyyy-mm-dd hh24:mi:ss')"
        }
        if ($scope.data.currItem.end_date) {
            postdata.sqlwhere += " and check_time <= to_date('" + $scope.data.currItem.end_date + "','yyyy-mm-dd hh24:mi:ss')"
        }
        if ($scope.data.currItem.invoice_no) {
            postdata.sqlwhere += ' and invoice_id=' + $scope.data.currItem.invoice_id;
        }
        if ($scope.data.currItem.cust_id) {
            postdata.sqlwhere += " and cust_id=" + $scope.data.currItem.cust_id;
        }
        if ($scope.data.currItem.cust_id) {
            postdata.sqlwhere += " and cust_id=" + $scope.data.currItem.cust_id;
        }
        if ($scope.data.currItem.cust_id) {
            postdata.sqlwhere += " and cust_id=" + $scope.data.currItem.cust_id;
        }
        if ($scope.data.currItem.is_erp_process == 2) {
            postdata.sqlwhere += " and Is_Erp_Process = 2";
        } else {
            postdata.sqlwhere += " and nvl(Is_Erp_Process,1) in (0,1)";
        }

        if ($scope.data.currItem.notice_no) {
            postdata.notice_no = $scope.data.currItem.notice_no;
        }
        if ($scope.data.currItem.warn_no) {
            postdata.warn_no = $scope.data.currItem.warn_no;
        }
        if ($scope.data.currItem.pi_no) {
            postdata.pi_no = $scope.data.currItem.pi_no;
        }
        if ($scope.data.currItem.invoice_no) {
            postdata.invoice_no = $scope.data.currItem.invoice_no;
        }
        postdata.is_csh = $scope.data.currItem.is_csh;
        if ($scope.data.currItem.is_invoice) {
            postdata.is_invoice = $scope.data.currItem.is_invoice;
        } else {
            postdata.is_invoice = 1;
        }
        if ($scope.data.currItem.erp_time) {
            postdata.erp_time = $scope.data.currItem.erp_time;
        }
        BasemanService.RequestPostAjax("bill_invoice_header", "search", postdata).then(function (data) {
            $scope.options_11.api.stopEditing(false);
            var notice_id = "";
            for (var i = 0; i < data.bill_invoice_headers.length; i++) {
                data.bill_invoice_headers[i].seq = parseInt(i + 1);
                data.bill_invoice_headers[i].erp_time=$scope.data.currItem.erp_time||"";
                if (i != data.bill_invoice_headers.length - 1) {
                    notice_id += data.bill_invoice_headers[i].invoice_id + ",";
                } else {
                    notice_id += data.bill_invoice_headers[i].invoice_id
                }
            }
            $scope.data.currItem.bill_invoice_headers = data.bill_invoice_headers;
            $scope.options_11.api.setRowData(data.bill_invoice_headers);
            if (data.bill_invoice_headers.length == 0) {
                BasemanService.notice("出库单引SAP无数据", "alert-info");
                return;
            }
            var postdata = {};
            postdata.flag = 2;
            postdata.notice_id = notice_id;
            BasemanService.RequestPostAjax("sale_customs_header", "getdiffoutmsg", postdata).then(function (data) {
                for (var i = 0; i < data.sale_customs_lineofsale_customs_headers.length; i++) {
                    data.sale_customs_lineofsale_customs_headers[i].seq = parseInt(i + 1);
                }
                $scope.data.currItem.sale_customs_lineofsale_customs_headers = data.sale_customs_lineofsale_customs_headers;
                $scope.options_31.api.setRowData(data.sale_customs_lineofsale_customs_headers);
            })
            var postdata = {};
            postdata.flag = 0;
            postdata.notice_ids = notice_id;
            BasemanService.RequestPostAjax("sale_ship_notice_header", "getsapline", postdata).then(function (data) {
                for (var i = 0; i < data.sale_notice_sapofsale_ship_notice_headers.length; i++) {
                    data.sale_notice_sapofsale_ship_notice_headers[i].seq = parseInt(i + 1);
                }
                $scope.data.currItem.sale_notice_sapofsale_ship_notice_headers = data.sale_notice_sapofsale_ship_notice_headers;
                $scope.options_21.api.setRowData(data.sale_notice_sapofsale_ship_notice_headers);
            })
        })
    };
   
    $scope.ERP = function (e) {
        ds.dialog.confirm("发票收汇信息写入信保通,是否确认?", function () {
            try {
                e.currentTarget.disabled = true;
                if ($scope.data.currItem.erp_time == undefined || $scope.data.currItem.erp_time == "") {
                    BasemanService.notice("请选择导ERP时间", "alert-danger");
                    return;
                }
                var data = $scope.gridGetData("options_11");
                // var selectRows = $scope.selectGridGetData('options_11');
                $scope.options_11.api.stopEditing(false);
                var selectRows = $scope.options_11.api.getSelectedRows();
                if (!selectRows.length) {
                    BasemanService.notice("请先选择要处理的商业发票单", "alert-warning");
                    return;
                };
                for (var i = 0; i < selectRows.length; i++) {
                    var msg = []; var seq = i + 1; var errorlist = [];
                    if (selectRows[i].erp_time == "" || selectRows[i].erp_time == undefined) {
                        errorlist.push("第" + seq + "导ERP时间为空");
                    }
                    if (selectRows[i].is_erp_process == 2) {
                        errorlist.push("第" + seq + "已导入了ERP,不可重复导入");
                    }
                    if (parseInt(selectRows[i].flag) == 3) {
                        if (selectRows[i].fapiao_sap == "" || selectRows[i].fapiao_sap == undefined) {
                            errorlist.push("第" + seq + "行SAP发票号不能为空!");
                        }
                        if (selectRows[i].kaipiao_sap == "" || selectRows[i].kaipiao_sap == undefined) {
                            errorlist.push("第" + seq + "行SAP凭证号不能为空!");
                        }
                    };
                    if (msg.length > 0) {
                        BasemanService.notice(msg);
                        return;
                    }
                    //
               
                    var obj = selectRows[i];
                    if(obj.is_erp_process!=2){
                        var postdata=obj;
                        if ($scope.data.currItem.erp_time) {
                            postdata.erp_time = $scope.data.currItem.erp_time;
                        }
                        var postobj= BasemanService.RequestPostNoWait("bill_invoice_header", "dealerp", postdata);
                        if (postobj.pass) {
                            obj.is_erp_process = 2;
                            obj.erp_time = $scope.data.currItem.erp_time;
                            BasemanService.notice("引入成功", "alert-warning");
                            return;
                        }
                    }
                }
                e.currentTarget.disabled = false;
            } catch (error) {
                BasemanService.notice(error.message);
                e.currentTarget.disabled = false;
            } finally {
                e.currentTarget.disabled = false;
            }
        })
        
        
        
      

       

    };
    //产品差异
    $scope.chaypzClick = function () {
        if ($scope.data.currItem.erp_time == undefined || $scope.data.currItem.erp_time == "") {
            BasemanService.notice("请选择导ERP时间", "alert-danger");
            return;
        }
        var data = $scope.gridGetData("options_31");
        for (var i = 0; i < data.length; i++) {
            if (data[i].erp_code == undefined || data[i].erp_code == "") {
                continue;
            }
            var postdata = {};
            postdata.customs_id = data[i].customs_id || 0;
            postdata.out_total_amt = parseFloat(data[i].out_total_amt) || 0;
            postdata.check_time = $scope.data.currItem.check_time || "";
            BasemanService.RequestPostAjax("sale_customs_header", "insertsap", postdata).then(function (result) {
                data[i].sap_no = result.sap_no;
            })
        }
    }
    $scope.save = function () {
        var data = $scope.options_11.api.getSelectedRows();
        for (var i = 0; i < data.length; i++) {
            var postdata = {};
            if (data[i].erp_time == undefined || data[i].erp_time == "") {
                BasemanService.notice("第" + (i + 1) + "行导入ERP时间为空", "alert-info");
                return;
            }
            for (var name in data[i]) {
                postdata[name] = data[i][name];
            }
            BasemanService.RequestPostAjax("bill_invoice_header", "dealerp", postdata).then(function (data) {

            })
        }
    }
    /**--------------*/
    /**----弹出框区域*---------------*/

    $scope.invoice_no = function () {
        $scope.FrmInfo = {
            classid: "bill_invoice_header",
            sqlBlock: " stat=5"
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.invoice_no = result.invoice_no;
            $scope.data.currItem.invoice_id = result.invoice_id;
        })
    }
    $scope.cust_code = function () {
        $scope.FrmInfo = {
            classid: "customer"
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_id = result.cust_id;
        })
    }

    //业务部门
    $scope.selectorg = function () {
        $scope.FrmInfo = {
            title: "地区查询",
            thead: [{
                name: "机构编码",
                code: "code",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "机构名称",
                code: "orgname",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "负责人",
                code: "manager",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "备注",
                code: "note",
                show: true,
                iscond: true,
                type: 'string'
            }],
            classid: "scporg",
            sqlBlock: "( idpath like '%1%') and 1=1 and stat =2 and OrgType = 5",
            searchlist: ["code", "orgname", "manager", "note"],
            backdatas: "orgs"
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_id = result.orgid;
        })
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
    //收货信息
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
            headerName: "引入ERP状态", field: "is_erp_process", editable: false, filter: 'set', width: 120,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: "未引入"}, {value: 2, desc: "已引入"}]
            },
            checkboxSelection: function (params) {
                // we put checkbox on the name if we are not doing no grouping
                return params.columnApi.getRowGroupColumns().length === 0;
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发票流水号", field: "invoice_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "出货预告号", field: "warn_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "通知单号", field: "notice_no", editable: false, filter: 'set', width: 120,
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
            headerName: "费用编码", field: "subjects_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "费用名称", field: "subjects_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务部门名称", field: "org_name", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "发货金额", field: "send_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "本次开票金额", field: "invoice_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "报关金额", field: "return_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "货币", field: "currency_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "出库时间", field: "send_confirm_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "导ERP时间", field: "erp_time", editable: true, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "SAP发票号", field: "fapiao_sap", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "SAP凭证号", field: "kaipiao_sap", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "SAP发货凭证号(80凭证)", field: "delorder_sap", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_21 = {
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
            var isGrouping = $scope.options_21.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };

    //客户销售产品组织
    $scope.columns_21 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发货通知单号", field: "notice_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "ERP编码", field: "erp_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发货数量", field: "out_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发货价格", field: "out_price", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发货金额", field: "line_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "开票价格", field: "kaip_price", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "开票金额", field: "kaip_amt", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "差异金额", field: "chayamt", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "调整金额", field: "trim_amt", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];

    $scope.options_31 = {
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
        rowClicked: $scope.rowClicked31,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_31.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_31 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            checkboxSelection: function (params) {
                return params.columnApi.getRowGroupColumns().length === 0;
            },
        }, {
            headerName: "报关流水号", field: "customs_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "报关单号", field: "customs_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "合同号", field: "cpi_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "凭证号", field: "sap_no", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户产品名称", field: "cust_spec", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "ERP产品编码", field: "erp_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "报关数量", field: "customs_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "报关单价", field: "customs_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "报关金额", field: "customs_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发货数量", field: "out_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发货单价", field: "price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发货金额", field: "line_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "差异数量", field: "chayqty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "差异金额", field: "chayamt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "发货单号", field: "notice_no", editable: false, filter: 'set', width: 160,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.initdata();
};


angular.module('inspinia')
    .controller('bill_invoice_headerList', bill_invoice_headerList)

