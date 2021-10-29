var billmanControllers = angular.module('inspinia');
function bill_invoice_header_kp($rootScope, $scope, $location, $modal,$timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    bill_invoice_header_kp = HczyCommon.extend(bill_invoice_header_kp, ctrl_bill_public);
    bill_invoice_header_kp.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "bill_invoice_header",
        key: "invoice_id",
        postdata:{flag:113},
        FrmInfo: {},
        grids: [
            {//船务信息
                optionname: 'options_11',
                idname: 'bill_invoice_headers'
            }
        ]
    };
    $scope.objconf.item = {};
    /*********************网格列描述事件************************/
    function getColumnValue(item, columns_11) {
        var values = item[columns_11.field];
        if (columns_11.options !== undefined) {
            if (typeof(columns_11.options_11) == "object") {
                for (i = 0; i < columns_11.options_11.length; i++) {
                    if (values == columns_11.options_11[i].value) {
                        return columns_11.options_11[i].desc;
                    }
                }
                return "";
            } else {
                return values;
            }
        } else {
            return values;
        }
    }
    $scope.is_cshs = [{
        id: 1,
        name: "手工在SAP开票"
    }, {
        id: 2,
        name: "OMS引入SAP开票"
    }];
    $scope.is_erps = [{
        id: 1,
        name: "否"
    }, {
        id: 2,
        name: "是"
    }];
    /*********************弹出框*******************/
    //客户
    $scope.openCustFrm = function () {
        $scope.FrmInfo = {
            classid: "customer",
            postdata: {flag:1},
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.item.cust_id = result.cust_id;
            $scope.item.cust_code = result.sap_code;
            $scope.item.cust_name = result.cust_name;
        });
    }
    //商业发票号
    $scope.Invoice_No = function () {
        $scope.FrmInfo = {
            classid: "bill_invoice_header",
            postdata: {stat: 5},
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.item.invoice_id = result.invoice_id;
            $scope.item.invoice_no = result.invoice_no;
        });
    }
    //查询selectBillinvoice
    $scope.search  =function(){
        /*if($scope.item.is_csh == undefined){
            BasemanService.notice("请选择开票状态","alert-danger");
            return;
        };*/
        var sql= "stat = 5 "
        if ($scope.item.check_time != undefined && $scope.item.check_time != "") {
            sql = sql + " and check_time >= to_date(''" +$scope.item.check_Time
                + " 00:00:00'',''yyyy-mm-dd hh24:mi:ss'')";
        }
        if ($scope.item.check_time2 != undefined && $scope.item.check_time2 != "") {
            sql = sql + " and check_time <= to_date(''" + $scope.item.check_time2
                + " 23:59:59'',''yyyy-mm-dd hh24:mi:ss'')";
        };
        sql += "and nvl(Is_Erp_Process,1) in (0,1)"
        var postdata = {flag :113,
            sqlwhere  : sql,
            is_csh:$scope.item.is_csh
        };
        if ($scope.item.cust_code !=undefined && $scope.item.cust_code != "") {
            postdata.cust_code = $scope.item.cust_code;
        }
        if ($scope.item.notice_no !=undefined && $scope.item.notice_no != "") {
            postdata.notice_no = $scope.item.notice_no;
        }//invoice_no
        if ($scope.item.warn_no !=undefined && $scope.item.warn_no != "") {
            postdata.warn_no = $scope.item.warn_no;
        }
        if ($scope.item.pi_no !=undefined && $scope.item.pi_no != "") {
            postdata.pi_no = $scope.item.pi_no;
        }
        /*if ($scope.item.chkis_invoice != "") {
            var is_invoice = $scope.item.chkis_invoice;
            if(is_invoice == 1 || is_invoice == 0){
                postdata.is_invoice = 1;
            }else {
                postdata.is_invoice = 2;
            }
        }*/
        BasemanService.RequestPost("bill_invoice_header", "search", postdata)
            .then(function(data){
                $scope.options_11.api.setRowData(data.bill_invoice_headers);
                $scope.data.currItem.bill_invoice_headers=data.bill_invoice_headers;
            });
    };
    //导入ERP
    $scope.impErp = function () {
        if ($scope.item.erp_time == undefined||$scope.item.erp_time =="") {
            BasemanService.notice("请选择导ERP时间", "alert-danger");
            return;
        }
        var data = $scope.gridGetData("options_11");
        var selectRows = $scope.selectGridGetData('options_11');
        if (!selectRows.length) {
            BasemanService.notice("请先选择要处理的商业发票单", "alert-warning");
            return;
        };

        var j=0;
        for(var i=0;i<selectRows.length;i++){
            var postdata=selectRows[i];
            if(postdata.erp_time==undefined){
                postdata.erp_time=$scope.item.erp_time;
            };
            ds.dialog.confirm("是否导入ERP？", function () {
                BasemanService.RequestPost("bill_invoice_header", "dealerp", postdata)
                    .then(function (result) {
                        selectRows[j].is_erp_process="2" ;
                        j++;
                        if(j==i){
                            $scope.selectGridGetData([]);
                            $scope.options_11.api.setRowData(data);
                        };
                    });
            },function () {$scope.newWindow.close();});

        };
        //保存发票凭证号
        $scope.saveInvoice = function () {
            if ($scope.item.erp_time == undefined||$scope.item.erp_time =="") {
                BasemanService.notice("请选择导ERP时间", "alert-danger");
                return;
            }
            var data = $scope.gridGetData("options_11");
            var selectRows = $scope.selectGridGetData('options_11');
            if (!selectRows.length) {
                BasemanService.notice("请先选择要处理的商业发票单", "alert-warning");
                return;
            }
            var j=0;
            for(var i=0;i<selectRows.length;i++){
                var postdata=data[selectRows[i]];
                if(postdata.erp_time==undefined){
                    postdata.erp_time=$scope.item.erp_time;
                }
                ds.dialog.confirm("是否导入ERP？", function () {
                    BasemanService.RequestPost("bill_invoice_header", "dealerp", postdata)
                        .then(function (data) {
                            data[selectRows[j]].is_erp_process="2" ;
                            j++;
                            if(j==i){
                                $scope.selectGridGetData([]);
                                $scope.options_11.api.setRowData(data);
                            }
                        })
                },function () {$scope.newWindow.close();
                });
            }
        };
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
        //sheet页第二页订单明细
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
            rowClicked:$scope.rowClicked21,
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
            /*  {
             headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
             cellEditor: "文本框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true,
             checkboxSelection: function (params) {
             return params.columnApi.getRowGroupColumns().length === 0;
             },
             },*/
            {
                headerName: "引入ERP状态", field: "is_erp_process", editable: true, filter: 'set', width: 110,
                cellEditor: "下拉框",
                cellEditorParams: {values: [{value:"1",desc:"否"},{value:"2",desc:"是"}]},
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                checkboxSelection: function (params) {
                    return params.columnApi.getRowGroupColumns().length === 0;
                },
            }, {
                headerName: "商业发票号", field: "invoice_no", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "出货预告号", field: "warn_no", editable: false, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "通知单号", field: "notice_no", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },/* {
             headerName: "费用编码", field: "subjects_no", editable: false, filter: 'set', width: 130,
             cellEditor: "文本框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
             },
             {
             headerName: "费用名称", field: "subjects_name", editable: false, filter: 'set', width: 130,
             cellEditor: "文本框",
             enableRowGroup: true,
             enablePivot: true,
             enableValue: true,
             floatCell: true
             },*/
            {
                headerName: "业务部门", field: "org_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
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
            }, {
                headerName: "开票金额", field: "invoice_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "报关金额", field: "return_amt", editable: false, filter: 'set', width: 100,
                cellEditor: "浮点框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "货币", field: "currency_code", editable: false, filter: 'set', width: 85,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "出库时间", field: "send_confirm_date", editable: false, filter: 'set', width: 100,
                cellEditor: "年月日",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "导ERP时间", field: "erp_time", editable: true, filter: 'set', width: 120,
                cellEditor: "年月日",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "SAP发票号", field: "fapiao_sap", editable: false, filter: 'set', width: 120,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            }, {
                headerName: "SAP凭证号", field: "kaipiao_sap", editable: false, filter: 'set', width: 130,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "SAP发货凭证号(80凭证)", field: "delorder_sap", editable: false, filter: 'set', width: 200,
                cellEditor: "文本框",
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
            },
            {
                headerName: "操作", field: "", editable: false, filter: 'set', width: 58,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true,
                // pinned: 'right',
                cellRenderer: "链接渲染"
            }];
        //数据缓存
        $scope.initdata();
    }
    //保存发票凭证号
    $scope.saveInvoice = function () {
        if ($scope.item.erp_time == undefined||$scope.item.erp_time =="") {
            BasemanService.notice("请选择导ERP时间", "alert-danger");
            return;
        }
        var data = $scope.gridGetData("options_11");
        var selectRows = $scope.selectGridGetData('options_11');
        if (!selectRows.length) {
            BasemanService.notice("请先选择要处理的商业发票单", "alert-warning");
            return;
        }
        var j=0;
        for(var i=0;i<selectRows.length;i++){
            var postdata=data[selectRows[i]];
            if(postdata.erp_time==undefined){
                postdata.erp_time=$scope.item.erp_time;
            }
            ds.dialog.confirm("是否导入ERP？", function () {
                BasemanService.RequestPost("bill_invoice_header", "dealerp", postdata)
                    .then(function (data) {
                        data[selectRows[j]].is_erp_process="2" ;
                        j++;
                        if(j==i){
                            $scope.selectGridGetData([]);
                            $scope.options_11.api.setRowData(data);
                        }
                    })
            },function () {$scope.newWindow.close();
            });
        }
    };
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
    //sheet页第二页订单明细
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
        rowClicked:$scope.rowClicked21,
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
        /*  {
         headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
         cellEditor: "文本框",
         enableRowGroup: true,
         enablePivot: true,
         enableValue: true,
         floatCell: true,
         checkboxSelection: function (params) {
         return params.columnApi.getRowGroupColumns().length === 0;
         },
         },*/
        {
            headerName: "引入ERP状态", field: "is_erp_process", editable: true, filter: 'set', width: 110,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value:1,desc:"否"},{value:2,desc:"是"}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            checkboxSelection: function (params) {
                return params.columnApi.getRowGroupColumns().length === 0;
            },
        }, {
            headerName: "商业发票号", field: "invoice_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "出货预告号", field: "warn_no", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "通知单号", field: "notice_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },/* {
         headerName: "费用编码", field: "subjects_no", editable: false, filter: 'set', width: 130,
         cellEditor: "文本框",
         enableRowGroup: true,
         enablePivot: true,
         enableValue: true,
         floatCell: true
         },
         {
         headerName: "费用名称", field: "subjects_name", editable: false, filter: 'set', width: 130,
         cellEditor: "文本框",
         enableRowGroup: true,
         enablePivot: true,
         enableValue: true,
         floatCell: true
         },*/
        {
            headerName: "业务部门", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
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
        }, {
            headerName: "开票金额", field: "invoice_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "报关金额", field: "return_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "货币", field: "currency_code", editable: false, filter: 'set', width: 85,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "出库时间", field: "send_confirm_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "导ERP时间", field: "erp_time", editable: true, filter: 'set', width: 120,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "SAP发票号", field: "fapiao_sap", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "SAP凭证号", field: "kaipiao_sap", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "SAP发货凭证号(80凭证)", field: "delorder_sap", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "操作", field: "", editable: false, filter: 'set', width: 58,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            // pinned: 'right',
            cellRenderer: "链接渲染"
        }];
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('bill_invoice_header_kp', bill_invoice_header_kp);

