/**
 *  经销商档案
 *  2019/7/9.
 *  zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', '$modal', 'numberApi', 'requestApi'],
    function (module, controllerApi, base_obj_prop, swalApi, $modal, numberApi, requestApi) {

        var controller = [
            '$scope',
            function ($scope) {
                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //系统参数是否启用法人客户
                $scope.systemParameter = 2;

                //定义一个开票信息子表操作参数
                $scope.entityParame = 0;

                //定义一个全局递增参数
                $scope.addIndex = 0;

                //是否为导入的数据,默认不是
                $scope.initData = false;

                //经销商权限
                $scope.needSelect = false;

                /*----------------------------------表格定义-------------------------------------------*/
                /**
                 * 定义列表 合同信息
                 */
                $scope.gridOptions_contract = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'created_date',
                        headerName: '合同年号',
                        type : '日期',
                        width:100
                    }, {
                        field: 'contract_code',
                        headerName: '合同编号',
                        width:100
                    }, {
                        field: 'contract_desc',
                        headerName: '合同说明',
                        width:100
                    }, {
                        field: 'effect_date',
                        headerName: '开始日期',
                        width:100,
                        type : '日期'
                    }, {
                        field: 'expire_date',
                        headerName: '结束日期',
                        width:100,
                        type : '日期'
                    }, {
                        field: 'completed_date',
                        headerName: '结案日期',
                        width:100,
                        type : '日期'
                    }, {
                        field: 'delivery_deadline',
                        headerName: '延迟发货日期',
                        width:100,
                        type : '日期'
                    }, {
                        field: 'ad_fee',
                        headerName: '广告费',
                        width:100,
                        type : '金额'
                    }, {
                        field: 'rebate_rate',
                        headerName: '返点',
                        width:100,
                        type : '金额'
                    }, {
                        field: 'status',
                        headerName: '状态',
                        width:100
                    }, {
                        field: 'limit_delivery',
                        headerName: '是否限制发货',
                        width:100
                    }]
                };

                /**
                 * 定义列表 联系人
                 */
                $scope.gridOptions_linkman = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'contact_man',
                        headerName: '姓名',
                        editable: true,
                        width:100
                    }, {
                        field: 'con_duty',
                        headerName: '所在公司角色',
                        editable: true,
                        width:100
                    }, {
                        field: 'con_cell1',
                        headerName: '手机号码',
                        editable: true,
                        width:100
                    }, {
                        field: 'con_mail',
                        headerName: '电子邮箱',
                        editable: true,
                        width:100
                    }, {
                        field: 'con_sex',
                        headerName: '性别',
                        width:100,
                        editable: true,
                        hcDictCode : 'sex'
                    }, {
                        field: 'con_edu',
                        headerName: '学历',
                        editable: true,
                        width:100
                    }, {
                        field: 'actived',
                        headerName: '状态',
                        editable: true,
                        width:100,
                        hcDictCode : 'usable_code'
                    }]
                };

                /**
                 * 定义列表 收货信息
                 */
                $scope.gridOptions_receipt = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'take_man',
                        headerName: '联系人',
                        editable: true,
                        width:100
                    }, {
                        field: 'phone_code',
                        headerName: '联系电话',
                        editable: true,
                        width:100
                    }, {
                        field: 'provice_name',
                        headerName: '省',
                        editable: true,
                        width:100,
                        onCellDoubleClicked: function (args) {
                            $scope.selectReceipt(args);
                        }
                    }, {
                        field: 'city_name',
                        headerName: '市',
                        width:100
                    }, {
                        field: 'county_name',
                        headerName: '区县',
                        width:100
                    }, {
                        field: 'address1',
                        headerName: '详细地址',
                        editable: true,
                        width:100
                    }]
                };

                /**
                 * 表格定义  "开票单位"
                 */
                $scope.gridOptions_invoice = {
                    hcEvents: {
                        /**
                         * 焦点事件
                         */
                        cellFocused: function (params) {
                            if($scope.invoice_line != undefined && params.rowIndex!=null){
                                $scope.entityParame =
                                    $scope.data.currItem.customer_legal_entitys[params.rowIndex].row_id;
                                //清除余额
                                $scope.invoice_line[$scope.entityParame].forEach(function (value) {
                                    [
                                        'credit_line',
                                        'goods_payment_balance',
                                        'credit_balance'
                                    ].forEach(function (field) {
                                        if(value[field] != undefined){
                                            value[field] = undefined;
                                        }
                                    });
                                });
                                $scope.gridOptions_invoice_line.hcApi
                                    .setRowData($scope.invoice_line[$scope.entityParame]);
                            }

                        }
                    },
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'trading_company_name',
                        headerName: '交易公司',
                        editable: function () {
                            return (!$scope.needSelect) && (!$scope.initData);
                        },
                        hcRequired : true,
                        onCellDoubleClicked: function (args) {
                            if((!$scope.needSelect) && (!$scope.initData)){
                                $scope.trading(args,1);
                            }
                        }
                    }, {
                        field: 'customer_invoice_type',
                        headerName: '开票客户类型',
                        editable: function () {
                            return (!$scope.needSelect) && (!$scope.initData);
                        },
                        hcDictCode : 'epm.customer_invoice_type'
                    }, {
                        field: 'legal_entity_code',
                        headerName: '开票单位编码'
                    }, {
                        field: 'legal_entity_name',
                        headerName: '开票单位名称'
                    }, {
                        field: 'invoice_type',
                        headerName: '发票类型',
                        hcDictCode : 'epm.invoice_type'
                    }, {
                        field: 'bank',
                        headerName: '开票银行'
                    }, {
                        field: 'bank_accno',
                        headerName: '银行账户'
                    }, {
                        field: 'tax_no',
                        headerName: '纳税人识别号'
                    }, {
                        field: 'tax_type',
                        headerName: '纳税人类型',
                        hcDictCode : 'tax_type'
                    }, {
                        field: 'tax_rate',
                        headerName: '税率'
                    }, {
                        field: 'attribute1',
                        headerName: '现金流量表项',
                        hcDictCode : 'epm.cash_flow_item'
                    }, {
                        field: 'currency_name',
                        headerName: '结算货币'
                    }, {
                        field: 'is_project_entity',
                        headerName: '是否工程法人',
                        type:'是否'
                    }, {
                        field: 'is_base',
                        headerName: '是否基地',
                        type:'是否'
                    }, {
                        field: 'is_loan',
                        headerName: '是否垫资',
                        editable: function () {
                            return (!$scope.needSelect) && (!$scope.initData);
                        },
                        type:'是否'
                    }, {
                        field: 'is_credit_control',
                        headerName: '是否信用管控',
                        editable: function () {
                            return (!$scope.needSelect) && (!$scope.initData);
                        },
                        type:'是否'
                    }, {
                        field: 'valid',
                        headerName: '有效状态',
                        hcDictCode:'valid'
                    }],
                    //定义表格增减行按钮
                    hcButtons: {
                        invoiceAdd: {
                            icon: 'iconfont hc-add',
                            click: function () {
                                $scope.addInvoice && $scope.addInvoice();
                            },
                            hide: function (){
                                return $scope.needSelect || ($scope.isFormReadonly() || !$scope.form.editing) || $scope.initData;
                            }
                        },
                        invoiceDel: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                $scope.delInvoice && $scope.delInvoice();
                            },
                            hide: function (){
                                return $scope.needSelect || ($scope.isFormReadonly() || !$scope.form.editing) || $scope.initData;
                            }
                        }
                    }
                };

                /**
                 * 表格定义  "账户信息"
                 */
                $scope.gridOptions_invoice_line = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'account_name',
                        headerName: '账户名称'
                    }, {
                        field: 'order_pdt_line',
                        headerName: '产品线',
                        editable: function () {
                            return (!$scope.needSelect) && (!$scope.initData);
                        },
                        hcDictCode : 'epm.order_pdt_line',
                        onCellValueChanged: function (args) {
                            if (args.oldValue == args.newValue) {
                                return;
                            }else if($scope.data.currItem.short_name == undefined 
                                || $scope.data.currItem.short_name == null 
                                || $scope.data.currItem.short_name == ""){
                                    swalApi.info('请先维护客户简称');
                                    return;
                            }
                            combiningStrings(args);
                        }
                    }, {
                        field: 'channel',
                        headerName: '渠道',
                        editable: function () {
                            return (!$scope.needSelect) && (!$scope.initData);
                        },
                        hcDictCode : 'sales.channel',
                        onCellValueChanged: function (args) {
                            if (args.oldValue == args.newValue) {
                                return;
                            }else if($scope.data.currItem.short_name == undefined 
                                || $scope.data.currItem.short_name == null 
                                || $scope.data.currItem.short_name == ""){
                                    swalApi.info('请先维护客户简称');
                                    return;
                            }
                            combiningStrings(args);
                        }
                    },{
                        field : 'credit_line',
                        headerName : '授信额度'
                    },{
                        field : 'goods_payment_balance',
                        headerName : '货款余额'
                    },{
                        field : 'credit_balance',
                        headerName : '授信余额'
                    }],
                    //定义表格增减行按钮
                    hcButtons: {
                        invoiceLineAdd: {
                            icon: 'iconfont hc-add',
                            click: function () {
                                $scope.addInvoiceLine && $scope.addInvoiceLine();
                            },
                            hide: function (){
                                return $scope.needSelect || ($scope.isFormReadonly() || !$scope.form.editing) || $scope.initData;
                            }
                        },
                        invoiceLineDel: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                $scope.delInvoiceLine && $scope.delInvoiceLine();
                            },
                            hide: function (){
                                return $scope.needSelect || ($scope.isFormReadonly() || !$scope.form.editing) || $scope.initData;
                            }
                        },
                        balance : {
                            title : '查询余额',
                            click: function () {
                                var idx = $scope.gridOptions_invoice_line.hcApi.getFocusedRowIndex();
                                if (idx < 0) {
                                    swalApi.info('请选中要查询的行');
                                } else {
                                    if($scope.data.currItem.division_name == undefined 
                                        || $scope.data.currItem.division_name == null 
                                        || $scope.data.currItem.division_name == ""){
                                            swalApi.info('缺失事业部');
                                            return;
                                    }
                                    if($scope.invoice_line[$scope.entityParame][idx].ext_account_id == undefined 
                                        || $scope.invoice_line[$scope.entityParame][idx].ext_account_id == null 
                                        || $scope.invoice_line[$scope.entityParame][idx].ext_account_id == ""){
                                            swalApi.info('缺失账户id');
                                            return;
                                    }
                                    $scope.data.currItem.customer_balances = [{
                                        P_PROJECT_AMOUNT : 0,
                                        P_BU_CODE : $scope.data.currItem.division_name,
                                        P_AGENT_ACCT_ID : $scope.invoice_line[$scope.entityParame][idx].ext_account_id,
                                        P_AGENT_AMOUNT : 0,
                                        P_ORDER_TYPE : '查询'
                                    }];
                                    requestApi
                                        .post({
                                            classId: 'customer_org',
                                            action: 'getCustomerBlance',
                                            data: {
                                                customer_balances : $scope.data.currItem.customer_balances
                                            }
                                        })
                                        .then(function (data) {
                                            var x_available_amount = data.customer_balances[0].x_available_amount;
                                            var x_credit_amount = data.customer_balances[0].x_credit_amount;//授信额度
                                            var x_acredit_amount = data.customer_balances[0].x_acredit_amount;

                                            var isNum = true;
                                            //判断授信额度
                                            if(numberApi.isNum(Number(x_credit_amount))){
                                                x_credit_amount = x_credit_amount;
                                            }else{
                                                isNum = false;
                                                $scope.invoice_line[$scope.entityParame][idx].goods_payment_balance = x_credit_amount;
                                            }
                                            //判断授信余额
                                            if(numberApi.isNum(Number(x_acredit_amount))){
                                                x_acredit_amount = x_acredit_amount;
                                            }else{
                                                isNum = false;
                                                $scope.invoice_line[$scope.entityParame][idx].goods_payment_balance = x_acredit_amount;
                                            }

                                            //授信额度
                                            $scope.invoice_line[$scope.entityParame][idx].credit_line = x_credit_amount;

                                            if(isNum){
                                                //贷款余额
                                                $scope.invoice_line[$scope.entityParame][idx].goods_payment_balance
                                                    = numberApi.sub(x_available_amount, x_acredit_amount);
                                            }
                                            
                                            //授信余额
                                            $scope.invoice_line[$scope.entityParame][idx].credit_balance = x_acredit_amount;
                                            $scope.gridOptions_invoice_line.hcApi.setRowData($scope.invoice_line[$scope.entityParame]);
                                        });
                                }
                                
                            }
                        }
                    }
                };

                /**
                 * 表格定义  "工程相关方"
                 */
                $scope.gridOptions_interested = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'trading_company_name',
                        headerName: '交易公司',
                        editable: true,
                        hcRequired : true,
                        onCellDoubleClicked: function (args) {
                            $scope.trading(args,2);
                        }
                    }, {
                        field: 'engineering_code',
                        headerName: '工程客户编码'
                    }, {
                        field: 'engineering_name',
                        headerName: '工程客户名称'
                    }, {
                        field: 'short_name',
                        headerName: '工程客户简称'
                    }, {
                        field: 'invoice_type',
                        headerName: '发票类型',
                        hcDictCode : 'epm.invoice_type'
                    }, {
                        field: 'bank',
                        headerName: '开票银行'
                    }, {
                        field: 'bank_accno',
                        headerName: '银行账户'
                    }, {
                        field: 'tax_no',
                        headerName: '纳税人识别号'
                    }, {
                        field: 'tax_type',
                        headerName: '纳税人类型',
                        hcDictCode : 'tax_type'
                    }, {
                        field: 'tax_rate',
                        headerName: '税率'
                    }, {
                        field: 'customer_invoice_type',
                        headerName: '开票客户类型',
                        editable: true,
                        hcDictCode : 'epm.customer_invoice_type'
                    }, {
                        field: 'is_loan',
                        headerName: '是否垫资',
                        editable: true,
                        type:'是否'
                    }, {
                        field: 'is_credit_control',
                        headerName: '是否信用管控',
                        editable: true,
                        type:'是否'
                    }]
                };

                //表格定义 "业务员"
                $scope.gridOptions_saleman = {
                    defaultColDef:{
                      editable:function () {
                          return (!$scope.initData);
                      }
                    },
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'order_pdt_line',
                            headerName: '产品线',
                            hcDictCode:'epm.order_pdt_line'
                        },
                        {
                            field: 'username',
                            headerName: '业务员',
                            onCellDoubleClicked:function(args){
                                if($scope.initData){
                                    return;
                                }
                                $scope.getUserDoubleClicked(args);
                            }
                        },
                        {
                            field: 'division_id',
                            headerName: '事业部',
                            hcDictCode:'epm.division'
                        },
                        {
                            field: 'dept_name',
                            headerName: '部门'//手动填写
                        }
                    ],
                    //定义表格增减行按钮
                    hcButtons: {
                        salemanAdd: {
                            icon: 'iconfont hc-add',
                            click: function () {
                                $scope.addSaleman && $scope.addSaleman();
                            },
                            hide: function (){
                                return $scope.needSelect || ($scope.isFormReadonly() || !$scope.form.editing) || $scope.initData;
                            }
                        },
                        salemanDel: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                $scope.deleteSaleman && $scope.deleteSaleman();
                            },
                            hide: function (){
                                return $scope.needSelect || ($scope.isFormReadonly() || !$scope.form.editing) || $scope.initData;
                            }
                        }
                    }
                };

                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 省市区查询
                 */
                $scope.selectReceipt = function (args) {
                    $scope.gridOptions_receipt.api.stopEditing();
                    return $modal.openCommonSearch({
                        title: '请选择省级行政区',
                        classId: 'scparea',
                        postData: {
                            areatype: 4
                        }
                    })
                        .result//响应数据
                        .then(function (res) {
                            args.data.provice_name = res.areaname;//省名称
                            args.data.provice_id = res.areaid;
                            $modal.openCommonSearch({
                                classId: 'scparea',
                                postData: {
                                    areatype: 5,
                                    superid: res.areaid
                                },
                                action: 'search',
                                title: '请选择市级行政区'
                            })
                                .result//响应数据
                                .then(function (result) {
                                    args.data.city_name = result.areaname;//市名称
                                    args.data.city_id = result.areaid;
                                    return result.areaid
                                }, function (line) {
                                    if (line == "头部关闭") {//中途关闭查询则清空
                                        args.data.provice_name = undefined;
                                        args.data.city_name = undefined;
                                        args.data.county_name = undefined;
                                        $scope.gridOptions_receipt.api.refreshCells({
                                            rowNodes: [args.node],
                                            force: true,//改变了值才进行刷新
                                            columns: $scope.gridOptions_receipt.columnApi.getColumns(['city_name'
                                                ,'provice_name','county_name'])
                                        });
                                        return -99;
                                    }
                                }).then(function (id) {
                                if (id == -99) {
                                    return;
                                }
                                $modal.openCommonSearch({
                                    classId: 'scparea',
                                    postData: {
                                        areatype: 6,
                                        superid: id
                                    },
                                    action: 'search',
                                    title: '请选择区级行政区'
                                }).result//响应数据
                                    .then(function (results) {
                                        args.data.county_name = results.areaname;//区名称
                                        args.data.county_id = results.areaid;

                                        $scope.gridOptions_receipt.api.refreshCells({
                                            rowNodes: [args.node],
                                            force: true,//改变了值才进行刷新
                                            columns: $scope.gridOptions_receipt.columnApi.getColumns(['city_name'
                                                ,'provice_name','county_name'])
                                        });
                                    }, function (line) {
                                        if (line == "头部关闭") {
                                            args.data.provice_name = undefined;
                                            args.data.city_name = undefined;
                                            args.data.county_name = undefined;
                                            $scope.gridOptions_receipt.api.refreshCells({
                                                rowNodes: [args.node],
                                                force: true,//改变了值才进行刷新
                                                columns: $scope.gridOptions_receipt.columnApi.getColumns(['city_name'
                                                    ,'provice_name','county_name'])
                                            });
                                        }
                                    })
                            });
                        });
                };
                /**
                 * 交易公司查询
                 */
                $scope.trading = function (args,type) {
                    if(type == 1){
                        $scope.gridOptions_invoice.api.stopEditing();
                        return $modal.openCommonSearch({
                            classId:'epm_trading_company',
                            title : '交易公司',
                            postData : {
                                search_flag : 3
                            }
                        })
                            .result//响应数据
                            .then(function(result){
                                args.data.trading_company_id = result.trading_company_id;
                                args.data.trading_company_name = result.trading_company_name;
                            })
                            .then(function () {
                                $scope.gridOptions_invoice.api.refreshCells({
                                    rowNodes: [args.node],
                                    force: true,//改变了值才进行刷新
                                    columns: $scope.gridOptions_invoice.columnApi.getColumns(['trading_company_name'])
                                });
                            });
                    }else if(type == 2){
                        $scope.gridOptions_interested.api.stopEditing();
                        return $modal.openCommonSearch({
                            classId:'epm_trading_company',
                            title : '交易公司',
                            postData : {
                                search_flag : 3
                            }
                        })
                            .result//响应数据
                            .then(function(result){
                                args.data.trading_company_id = result.trading_company_id;
                                args.data.trading_company_name = result.trading_company_name;
                            })
                            .then(function () {
                                $scope.gridOptions_interested.api.refreshCells({
                                    rowNodes: [args.node],
                                    force: true,//改变了值才进行刷新
                                    columns: $scope.gridOptions_interested.columnApi.getColumns(['trading_company_name'])
                                });
                            });
                    }
                };

                /**
                 * 查销售区域
                 */
                $scope.commonSearchOfScparea = {
                    postData: {
                        use_type: 2
                    },
                    sqlWhere:"isuseable = 2",
                    afterOk: function (result) {
                        $scope.data.currItem.areaid = result.sale_area_id;
                        $scope.data.currItem.areacode = result.sale_area_code;
                        $scope.data.currItem.areaname = result.sale_area_name;
                    }
                };

                /**
                 * 地址省市区 查询
                 */
                $scope.commonSearchSettingOfOrigin = {
                    title: '请选择省级行政区',
                    postData:{
                        areatype: 4
                    },
                    afterOk: function (res) {
                        $scope.data.currItem.province_name = res.areaname;//省名称
                        $scope.data.currItem.province_id = res.areaid;
                        $scope.data.currItem.area_full_name = res.areaname;//省名称
                        $modal.openCommonSearch({
                            classId: 'scparea',
                            postData:{
                                areatype: 5,
                                superid : res.areaid
                            },
                            action: 'search',
                            title: '请选择市级行政区'
                        })
                            .result//响应数据
                            .then(function (result) {
                                $scope.data.currItem.city_name = result.areaname;//市名称
                                $scope.data.currItem.area_full_name += "-" + result.areaname;//拼接市名称
                                $scope.data.currItem.city_id = result.areaid;
                                return result.areaid
                            },function (line) {
                                if(line=="头部关闭"){//中途关闭查询则清空
                                    $scope.data.currItem.area_full_name = undefined;
                                    return -99;
                                }
                            }).then(function (id) {
                            if(id == -99){
                                return;
                            }
                            $modal.openCommonSearch({
                                classId: 'scparea',
                                postData:{
                                    areatype: 6,
                                    superid : id
                                },
                                action: 'search',
                                title: '请选择区级行政区'
                            }).result//响应数据
                                .then(function (results) {
                                    $scope.data.currItem.district_name = results.areaname;//区名称
                                    $scope.data.currItem.area_full_name += "-" + results.areaname;//区名称
                                    $scope.data.currItem.district_id = results.areaid;
                                },function (line) {
                                    if(line=="头部关闭"){
                                        $scope.data.currItem.area_full_name = undefined;
                                    }
                                })
                        });


                    }
                };

                /**
                 * 查询业务员 双击单元格
                 * @param args 行对象
                 */
                $scope.getUserDoubleClicked = function (args) {
                    $modal.openCommonSearch({  //打开模态框
                            classId: 'scpuser',  //类id
                            sqlWhere:' actived = 2 ',
                            title: "业务员",  //模态框标题
                            gridOptions: {  //表格定义
                                columnDefs: [
                                    {
                                        "field": "username",
                                        "headerName": "名称"
                                    },
                                    {
                                        "field": "userid",
                                        "headerName": "账号"
                                    },
                                    {
                                        "field": "namepath",
                                        "headerName": "所属机构"
                                    }
                                ]
                            }
                        })
                        .result  //响应数据
                        .then(function (result) {
                            args.data.userid = result.userid;
                            args.data.username = result.username;
                            args.api.refreshView();  //刷新网格视图
                        });
                };


                /*----------------------------------------计算方法定义-------------------------------------------*/

                /**
                 * 折扣率校验
                 */
                $scope.changeDiscount = function () {
                    if($scope.data.currItem.discount_rate!=undefined && $scope.data.currItem.discount_rate!=null){
                        if(numberApi.isNum(Number($scope.data.currItem.discount_rate))){
                            if($scope.data.currItem.discount_rate <= 0){
                                $scope.data.currItem.discount_rate=undefined;
                                swalApi.info('请输入大于0的数字');
                            }
                        }else{
                            $scope.data.currItem.discount_rate=undefined;
                            swalApi.info('输入的不是数字，请重新输入');
                        }
                    }
                };

                /**
                 * 拼接字符串
                 */
                function combiningStrings(args){
                    if(args.data.order_pdt_line != undefined && args.data.order_pdt_line != null && args.data.order_pdt_line != ""
                        && args.data.channel != undefined && args.data.channel != null && args.data.channel != ""){
                        var performActions = true;
                        $scope.invoice_line[$scope.entityParame].some(function (value, index) {
                            if(args.node.rowIndex != index){
                                if(args.data.order_pdt_line == value.order_pdt_line && args.data.channel == value.channel){
                                    performActions = false;
                                    swalApi.info('同一个账户不能存在相同的产品线与渠道');
                                    args.data.order_pdt_line = undefined;
                                    args.data.channel = undefined;
                                    return true;
                                }
                            }
                        });
                        if(performActions){
                            return requestApi
                                .post({
                                    classId: 'customer_org',
                                    action: 'search',
                                    data: {
                                        search_flag : 133,
                                        order_pdt_line : args.data.order_pdt_line,
                                        channel : args.data.channel
                                    }
                                })
                                .then(function (val) {
                                    args.data.account_name =
                                        $scope.data.currItem.short_name + "-" + $scope.data.currItem.division_name
                                        + "-" + val.order_pdt_line_name + "-" + val.channel_name;
                                    $scope.gridOptions_invoice_line.api.refreshCells({
                                        rowNodes: [args.node],
                                        force: true,//改变了值才进行刷新
                                        columns: $scope.gridOptions_invoice_line.columnApi.getColumns(['account_name'])
                                    });
                                });
                        }
                    }
                }
                /*----------------------------------按钮方法数据 定义-------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //基本详情
                    //bizData.customer_org_partners = [];
                    bizData.customer_legal_entitys = [];
                    bizData.customer_engineerings = [];
                    bizData.customer_contracts = [];
                    bizData.customer_contactofcustomer_orgs = [];
                    bizData.customer_workflow_ctrls = [];
                    bizData.customer_addressofcustomer_orgs = [];
                    bizData.epm_legal_entity_accounts = [];
                    bizData.valid = 1;
                    bizData.usable = 2;
                    bizData.discount_rate = 1;//折扣率
                    $scope.invoice_line = {};
                    //查询当前组织的事业部
                    requestApi
                        .post({
                            classId: 'epm_division',
                            action: 'select',
                            data: {}
                        })
                        .then(function (data) {
                            $scope.data.currItem.division_id = data.division_id;
                            $scope.data.currItem.division_name = data.division_name;
                        });
                };

                /**
                 * 保存前的数据处理
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    //清空数组
                    bizData.epm_legal_entity_accounts = [];
                    //重组数组
                    bizData.customer_legal_entitys.forEach(function (value) {
                        $scope.invoice_line[value.row_id].forEach(function (val) {
                            var pos = val.account_name.lastIndexOf("-") - 1;
                            var pos = val.account_name.lastIndexOf("-", pos) - 1;
                            val.account_name = bizData.short_name + val.account_name.substr(val.account_name.lastIndexOf("-", pos));
                            bizData.epm_legal_entity_accounts.push(val);
                        });
                    });
                    bizData.customer_kind = 1;//经销商默认1
                    bizData.base_currency_id = 1;
                };

                /**
                 * 自执行函数，定义标签页
                 */
                var a = function systemParameter(){
                    return requestApi
                        .post({
                            classId: 'customer_org',
                            action: 'search',
                            data: {
                                search_flag : 130
                            }
                        })
                        .then(function (response) {
                            $scope.systemParameter =response.customer_accounts[0].confvalue;
                            return {
                                classId: 'customer_org',
                                action: 'filtrationaccess',
                                data: {}
                            }
                        })
                        .then(requestApi.post)
                        .then(function(data){
                            $scope.tabs.base = {
                                title: '基本信息',
                                active: true
                            };
                            
                            if($scope.systemParameter == 2){
                                $scope.tabs.invoice = {
                                    title: '开票单位'
                                };

                            }else{
                                $scope.tabs.interested = {
                                    title: '工程相关方'
                                };
                            }
                            $scope.tabs.linkman = {
                                title: '联系人'
                            };
                            $scope.tabs.receipt = {
                                title: '收货信息'
                            };
                            if (data.need_select == 2) {
                                $scope.needSelect = true;
                                /*底部右边按钮*/
                                $scope.footerRightButtons.saveThenAdd.hide = true;
                                $scope.tabs.projAttach.hide = function () {
                                    return true;
                                }
                            }else{
                                $scope.tabs.contract = {
                                    title: '合同信息'
                                };
                                $scope.tabs.saleman = {
                                    title: '业务员'
                                };
                            }
                        });
                }();
                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.initData = bizData.is_init == 2;
                    //设置基本经历
                    //$scope.gridOptions.hcApi.setRowData(bizData.customer_org_partners);
                    $scope.gridOptions_interested.hcApi.setRowData(bizData.customer_engineerings);
                    $scope.gridOptions_contract.hcApi.setRowData(bizData.customer_contracts);
                    $scope.gridOptions_linkman.hcApi.setRowData(bizData.customer_contactofcustomer_orgs);
                    $scope.gridOptions_receipt.hcApi.setRowData(bizData.customer_addressofcustomer_orgs);
                    $scope.gridOptions_invoice.hcApi.setRowData(bizData.customer_legal_entitys);
                    //定义一个对象用来保存开票信息的子表数据
                    $scope.invoice_line = {};
                    //将开票信息的子表信息进行数据的组装
                    $scope.addIndex = 0;//归零
                    bizData.customer_legal_entitys.forEach(function (value) {
                        $scope.addIndex = numberApi.sum($scope.addIndex, 1);
                        value.row_id = $scope.addIndex;
                        $scope.invoice_line[value.row_id] = [];//有一条明细行则生成一个属性
                        bizData.epm_legal_entity_accounts.forEach(function (val) {
                            if(val.rel_id == value.rel_id){
                                val.row_id = $scope.addIndex;
                                $scope.invoice_line[value.row_id].push(val);
                            }
                        });
                    });
                    $scope.gridOptions_invoice.hcApi.setFocusedCell(0);
                    if(bizData.customer_legal_entitys.length > 0){
                        $scope.gridOptions_invoice_line.hcApi.setRowData(
                            $scope.invoice_line[$scope.data.currItem.customer_legal_entitys[0].row_id]);
                    }
                    $scope.gridOptions_saleman.hcApi.setRowData(bizData.customer_workflow_ctrls);

                    //地址拼接
                    $scope.data.currItem.area_full_name = $scope.data.currItem.province_name + "-"
                        + $scope.data.currItem.city_name + "-"
                        + $scope.data.currItem.district_name;
                    //查询当前组织的事业部
                    return requestApi
                        .post({
                            classId: 'epm_division',
                            action: 'select',
                            data: {}
                        })
                        .then(function (data) {
                            $scope.data.currItem.division_name = data.division_name;
                        });
                };

                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.click = function () {
                    if($scope.needSelect == 2 && $scope.tabs.linkman != undefined){
                        if ($scope.tabs.linkman.active) {//联系人
                            $scope.addLine && $scope.addLine();
                        }else if($scope.tabs.receipt.active){//收货地址
                            $scope.addReceipt && $scope.addReceipt();
                        }
                    }else if(!($scope.tabs.contract === undefined)){
                        if ($scope.tabs.linkman.active) {//联系人
                            $scope.addLine && $scope.addLine();
                        }else if($scope.tabs.receipt.active){//收货地址
                            $scope.addReceipt && $scope.addReceipt();
                        }else if($scope.systemParameter == 1){
                            if ($scope.tabs.interested.active) {
                                $scope.addInterested && $scope.addInterested();
                            }
                        }
                    }
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    if($scope.needSelect == 2 && $scope.tabs.linkman != undefined){
                        return (!$scope.tabs.linkman.active && !$scope.tabs.receipt.active)
                    }else if(!($scope.tabs.contract === undefined)){
                        if($scope.systemParameter == 2){
                            return (!$scope.tabs.linkman.active && !$scope.tabs.receipt.active);
                        }else{
                            return (!$scope.tabs.linkman.active && !$scope.tabs.interested.active
                                && !$scope.tabs.receipt.active);
                        }
                    }else{
                        return true;
                    }
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    if($scope.needSelect == 2 && $scope.tabs.linkman != undefined){
                        if ($scope.tabs.linkman.active) {
                            $scope.delLine && $scope.delLine();
                        }else if($scope.tabs.receipt.active){//收货地址
                            $scope.delReceipt && $scope.delReceipt();
                        }
                    }else if(!($scope.tabs.contract === undefined)){
                        if ($scope.tabs.linkman.active) {
                            $scope.delLine && $scope.delLine();
                        }else if($scope.tabs.receipt.active){//收货地址
                            $scope.delReceipt && $scope.delReceipt();
                        }else if($scope.systemParameter == 1){
                            if ($scope.tabs.interested.active) {
                                $scope.delInterested && $scope.delInterested();
                            }
                        }
                    }
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    if($scope.needSelect == 2 && $scope.tabs.linkman != undefined){
                        return (!$scope.tabs.linkman.active && !$scope.tabs.receipt.active)
                    }else if(!($scope.tabs.contract === undefined)){
                        if($scope.systemParameter == 2){
                            return (!$scope.tabs.linkman.active && !$scope.tabs.receipt.active);
                        }else{
                            return (!$scope.tabs.linkman.active && !$scope.tabs.interested.active
                                && !$scope.tabs.receipt.active);
                        }
                    }else{
                        return true;
                    }
                };
                
                /**
                 * 定义按钮生效或再次生效
                 */
                $scope.footerLeftButtons.effectButtom = {
                    title: function () {
                        return $scope.data.currItem.valid == 3 ? "恢复生效" : "生效"
                    },
                    click: function () {
                        $scope.effectMethod(2, "生效");
                    },
                    hide: function () {
                        return (!$scope.tabs.base.active)
                            || ($scope.data.currItem.valid == 2)
                            || (!$scope.data.currItem.customer_org_id > 0)
                            || $scope.needSelect
                            || $scope.initData;
                    }
                };

                /**
                 * 定义按钮失效
                 */
                $scope.footerLeftButtons.loseEffectButtom = {
                    title: "失效",
                    click: function () {
                        $scope.effectMethod(3,"失效");
                    },
                    hide: function () {
                        return (!$scope.tabs.base.active)
                            || ($scope.data.currItem.valid != 2)
                            || (!$scope.data.currItem.customer_org_id > 0)
                            || $scope.needSelect
                            || $scope.initData;
                    }
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                /**
                 * 生效或者失效档案
                 */
                $scope.effectMethod = function (valid, reminder) {
                    return swalApi.confirmThenSuccess({
                        title: "确定要" + reminder + "吗?",
                        okFun: function () {
                            //函数区域
                           return requestApi.post("customer_org", "takeeffect", {
                                "valid": valid,
                                "customer_org_id" : $scope.getId()
                            }).then(function () {
                                $scope.data.currItem.valid = valid;
                            });
                        },
                        okTitle: reminder + '成功'
                    });
                };
                /**
                 * 添加联系人
                 */
                $scope.addLine = function () {
                    $scope.gridOptions_linkman.api.stopEditing();
                    $scope.data.currItem.customer_contactofcustomer_orgs.push({});
                    $scope.gridOptions_linkman.hcApi.setRowData($scope.data.currItem.customer_contactofcustomer_orgs);
                };
                /**
                 * 删除行联系人
                 */
                $scope.delLine = function () {
                    var idx = $scope.gridOptions_linkman.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.customer_contactofcustomer_orgs.splice(idx, 1);
                        $scope.gridOptions_linkman.hcApi.setRowData($scope.data.currItem.customer_contactofcustomer_orgs);
                    }
                };

                /**
                 * 添加 业务员
                 */
                $scope.addSaleman = function(){
                    $scope.gridOptions_linkman.api.stopEditing();
                    $scope.data.currItem.customer_workflow_ctrls.push({});
                    $scope.gridOptions_saleman.hcApi.setRowData($scope.data.currItem.customer_workflow_ctrls);
                };

                /**
                 * 删除 业务员
                 */
                $scope.deleteSaleman = function(){
                    var idx = $scope.gridOptions_saleman.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.customer_workflow_ctrls.splice(idx, 1);
                        $scope.gridOptions_saleman.hcApi.setRowData($scope.data.currItem.customer_workflow_ctrls);
                    }
                };

                /**
                 * 添加收货地址
                 */
                $scope.addReceipt = function () {
                    $scope.gridOptions_receipt.api.stopEditing();
                    $scope.data.currItem.customer_addressofcustomer_orgs.push({});
                    $scope.gridOptions_receipt.hcApi.setRowData($scope.data.currItem.customer_addressofcustomer_orgs);
                };
                /**
                 * 删除行收货地址
                 */
                $scope.delReceipt = function () {
                    var idx = $scope.gridOptions_receipt.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.customer_addressofcustomer_orgs.splice(idx, 1);
                        $scope.gridOptions_receipt.hcApi.setRowData($scope.data.currItem.customer_addressofcustomer_orgs);
                    }
                };

                /**
                 * 添加开票单位
                 */
                $scope.addInvoice = function () {
                    $scope.gridOptions_invoice.api.stopEditing();
                    var ids = "";
                    $scope.data.currItem.customer_legal_entitys.forEach(function (value, index) {//收集已选择的法人客户id
                        if(index == 0){
                            ids += value.legal_entity_id + "";
                        }else{
                            ids += "," + value.legal_entity_id;
                        }
                    });
                    //新增一行先选择开票单位
                    return $modal.openCommonSearch({
                        classId:'customer_org',
                        postData :{
                            search_flag : 123
                        },
                        sqlWhere : ids == "" ? " 1 = 1 " : " customer_id not in (" + ids + ")",
                        dataRelationName:'customer_orgs',
                        title : '开票单位信息',
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "开票单位编码",
                                    field: "customer_code"
                                },{
                                    headerName: "开票单位名称",
                                    field: "customer_name"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function(result){
                            $scope.addIndex = numberApi.sum($scope.addIndex, 1);
                            $scope.data.currItem.customer_legal_entitys.push({
                                legal_entity_id : result.customer_id,
                                legal_entity_code : result.customer_code,
                                legal_entity_name : result.customer_name,
                                invoice_type : result.invoice_type,
                                bank : result.bank,
                                bank_accno : result.bank_accno,
                                tax_no : result.tax_no,
                                tax_type : result.tax_type,
                                tax_rate : result.tax_rate,
                                attribute1 : result.attribute1,
                                currency_name : result.currency_name,
                                is_project_entity : result.is_project_entity,
                                is_base : result.is_base,
                                valid : 2,
                                row_id : $scope.addIndex
                            });
                            if($scope.invoice_line[$scope.addIndex] == undefined){
                                $scope.invoice_line[$scope.addIndex] = [];
                            }
                            $scope.gridOptions_invoice.hcApi.setRowData($scope.data.currItem.customer_legal_entitys);
                        });
                };
                /**
                 * 删除行开票单位
                 */
                $scope.delInvoice = function () {
                    var idx = $scope.gridOptions_invoice.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.invoice_line[$scope.data.currItem.customer_legal_entitys[idx].row_id] = undefined;
                        $scope.data.currItem.customer_legal_entitys.splice(idx, 1);
                        $scope.gridOptions_invoice.hcApi.setRowData($scope.data.currItem.customer_legal_entitys);
                    }
                };

                /**
                 * 添加开票单位子表
                 */
                $scope.addInvoiceLine = function () {
                    var idx = $scope.gridOptions_invoice.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请先选中要操作的开票单位行');
                    } else {
                        $scope.gridOptions_invoice_line.api.stopEditing();
                        $scope.invoice_line[$scope.entityParame].push({
                            row_id : $scope.entityParame
                        });
                        $scope.gridOptions_invoice_line.hcApi.setRowData($scope.invoice_line[$scope.entityParame]);
                    }
                };

                /**
                 * 删除行票单位子表
                 */
                $scope.delInvoiceLine = function () {
                    var idx = $scope.gridOptions_invoice_line.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.invoice_line[$scope.entityParame].splice(idx, 1);
                        $scope.gridOptions_invoice_line.hcApi.setRowData($scope.invoice_line[$scope.entityParame]);
                    }
                };

                /**
                 * 添加工程相关方
                 */
                $scope.addInterested = function () {
                    $scope.gridOptions_interested.api.stopEditing();
                    //新增一行先选择法人
                    return $modal.openCommonSearch({
                        classId:'customer_org',
                        postData :{
                            search_flag : 122
                        },
                        dataRelationName:'customer_orgs',
                        title : '工程客户信息',
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "工程客户编码",
                                    field: "customer_code"
                                },{
                                    headerName: "工程客户名称",
                                    field: "customer_name"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function(result){
                            $scope.data.currItem.customer_engineerings.push({
                                engineering_id : result.customer_id,
                                engineering_code : result.customer_code,
                                engineering_name : result.customer_name,
                                short_name : result.short_name,
                                invoice_type : result.invoice_type,
                                bank : result.bank,
                                bank_accno : result.bank_accno,
                                tax_no : result.tax_no,
                                tax_type : result.tax_type,
                                tax_rate : result.tax_rate

                            });
                            $scope.gridOptions_interested.hcApi.setRowData($scope.data.currItem.customer_engineerings);
                        });
                };
                /**
                 * 删除行工程相关方
                 */
                $scope.delInterested = function () {
                    var idx = $scope.gridOptions_interested.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.customer_engineerings.splice(idx, 1);
                        $scope.gridOptions_interested.hcApi.setRowData($scope.data.currItem.customer_engineerings);
                    }
                };
            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });

    });