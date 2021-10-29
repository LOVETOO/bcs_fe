/**
 * 项目开票申请 属性页
 * 2019/7/4
 * shenguocheng
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', 'dateApi', 'numberApi', 'directive/hcTab', 'directive/hcTabPage', 'directive/hcModal'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi, dateApi, numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q', '$modal',
            //控制器函数
            function ($scope, $q, $modal) {
                /*----------------------------------定义数据-------------------------------------------*/
                /**
                 * tab标签页
                 */
                $scope.inv_tab = {
                    contract: {
                        title: '合同信息',
                        active: true
                    },
                    out: {
                        title: '出库信息'
                    },
                    item: {
                        title: '产品信息'
                    }
                };
                /** 定义保存参数*/
                $scope.verification = true;
                // 合同标签页初始化
                $scope.tabc = "gridOptions_contract";

                //是否单经销商
                $scope.onlyCustomer = false;

                //合同信息表格定义
                $scope.gridOptions_contract = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'contract_code',
                        headerName: '合同编码',
                        hcRequired: true,
                        onCellDoubleClicked: function (args) {
                            $scope.chooseContractCode(args);
                        }
                    }, {
                        field: 'contract_name',
                        headerName: '合同名称'
                    }, {
                        field: 'signed_date',
                        headerName: '签订时间',
                        type: '日期'
                    }, {
                        field: 'contract_amount',
                        headerName: '合同金额(元)',
                        type: '金额'
                    }, {
                        field: 'billing_unit_name',
                        headerName: '开票单位名称'
                    }, {
                        field: 'tax_identify_num',
                        headerName: '纳税识别号'
                    }, {
                        field: 'billing_bank',
                        headerName: '开户行'
                    }, {
                        field: 'billing_account',
                        headerName: '开户账号'
                    }, {
                        field: 'billing_address',
                        headerName: '地址'
                    }, {
                        field: 'billing_phone',
                        headerName: '电话'
                    }, {
                        field: 'project_code',
                        headerName: '工程编码'
                    }, {
                        field: 'project_name',
                        headerName: '工程名称'
                    }]
                };

                //出库信息表格定义
                $scope.gridOptions_out = {
                    hcName: '出库信息',
                    hcRequired:function () {
                        return $scope.data.currItem.invoice_make_out_type == 1;
                    },
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'invbillno',
                        headerName: '出库单号',
                        editable: true,
                        onCellValueChanged: function (args) {
                            if ((args.data.invbillno == "") || (args.data.invbillno == null) || (args.data.invbillno == undefined)) {
                                ['wtamount_total_f', 'atta', 'contract_code', 
                                'contract_id', 'contract_name', 'inv_out_bill_head_id', 
                                'invbillno', 'qty_sum'].forEach(function(field){
                                    args.data[field] = undefined;
                                });
                                args.api.refreshView();
                                return;
                            }
                            if (args.newValue === args.oldValue){
                                return;
                            }
                            args.data.inv_out_bill_head_id = undefined;
                            $scope.gridOptions_out.api.refreshCells({
                                rowNodes: [args.node],
                                columns: $scope.gridOptions_out.columnApi.getColumns(['inv_out_bill_head_id'])
                            });
                            getInvbillNo(args.newValue, args);
                        }
                    }, 
                    // {
                    //     field: 'invbill_sap_no',
                    //     headerName: 'ERP出库单号'
                    // }, 
                    {
                        field: 'qty_sum',
                        headerName: '出库数量',
                        type: '数量'
                    }, {
                        field: 'amount_total',
                        headerName: '出库金额(元)',
                        type: '金额'
                    }, {
                        field: 'has_receipt',
                        headerName: '是否有签收单',
                        type: '是否',
                        editable: true
                    }, {
                        field: 'receipt_to_fin',
                        headerName: '原件是否交财务',
                        type: '是否',
                        editable: true
                    }, {
                        field: 'contract_code',
                        headerName: '合同编码'
                    }, {
                        field: 'contract_name',
                        headerName: '合同名称'
                    }, {
                        field: 'atta',
                        headerName: '出库附件',
                        onCellDoubleClicked: function (args) {
                            //打开附件模态框
                            $scope.showOutAttachMents(args.data);
                        }
                    }]
                };

                //产品信息表格定义
                $scope.gridOptions_item = {
                    hcName: '产品信息',
                    pinnedBottomRowData: [{ seq: '合计' }],
                    hcRequired:function () {
                        return $scope.data.currItem.invoice_make_out_type == 2;
                    },
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'item_code',
                        headerName: '产品编码'
                    }, {
                        field: 'item_name',
                        headerName: '产品名称'
                    }, {
                        field: 'model',
                        headerName: '产品型号'
                    }, {
                        field: 'spec',
                        headerName: '产品规格'
                    }, {
                        field: 'color',
                        headerName: '颜色'
                    }, {
                        field: 'can_pre_invoice_qty',
                        headerName: '剩余可预开数量',
                        type: '数量'
                    }, {
                        field: 'invoice_qty',
                        headerName: '开票数量',
                        type: '数量',
                        editable : function(args){
                            return (!args.node.rowPinned);
                        },
                        onCellValueChanged: function (args) {
                            if($scope.verification){
                                if (args.newValue === args.oldValue){
                                    return;
                                }
                                var str = '';
                                if(!numberApi.isNum(Number(args.data.invoice_qty))){//判断输入是否是数字
                                    str = '输入不是数字，请重新输入!';
                                }else if(Number(args.data.invoice_qty)<0){
                                    str = '数量不能小于0，请重新输入!';
                                }else if(Number(args.data.invoice_qty) > Number(args.data.can_pre_invoice_qty)){
                                    str = '不能大于剩余可预开数量，请重新输入!';
                                }
                                if(str.length > 0){
                                    swalApi.info(str);
                                    args.data.invoice_qty = undefined;
                                    $scope.gridOptions_item.api.refreshCells({
                                        rowNodes: [args.node],
                                        force: true,//改变了值才进行刷新
                                        columns: $scope.gridOptions_item.columnApi.getColumns(['invoice_qty'])
                                    });
                                    return;
                                }
                            }
                            calculateNum (args);
                        }
                    }, {
                        field: 'uom_name',
                        headerName: '单位'
                    }, {
                        field: 'contract_price',
                        headerName: '产品合同单价(元)',
                        type: '金额'
                    }, {
                        field: 'contract_amount',
                        headerName: '产品合同金额(元)',
                        type: '金额'
                    }, {
                        field: 'tax_rate',
                        headerName: '税率',
                        type: '金额'
                    }, {
                        field: 'tax_price',
                        headerName: '税额(单)'
                    }, {
                        field: 'tax_amount',
                        headerName: '税额(总)',
                        type: '金额'
                    }, {
                        field: 'contract_code',
                        headerName: '合同编码'
                    }, {
                        field: 'contract_name',
                        headerName: '合同名称'
                    }, {
                        field: 'discount_apply_code',
                        headerName: '折扣单号'
                    }]
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------合计数据-------------------------------------------*/
                //合计数据
                $scope.calSum = function () {
                    $scope.gridOptions_item.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            invoice_qty: numberApi.sum($scope.data.currItem.epm_invoice_item_lines, 'invoice_qty'),
                            contract_amount: numberApi.sum($scope.data.currItem.epm_invoice_item_lines, 'contract_amount')
                        }
                    ]);
                };
                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 打开附件模态框
                 */
                $scope.showOutAttachMents = function (data) {
                    if(data.diffbill_id > 0){
                        //查询附件数据
                        return requestApi
                        .post({
                            classId: "drp_diffprocbill_header",
                            action: 'select',
                            data: {
                                diffbill_id: data.diffbill_id
                            }
                        })
                        .then(function (data) {
                            top.require(['directive/hcProjAttach'], function () {
                                $scope.attachmentModalBox.open({
                                    controller: ['$scope', function ($modalScope) {
                                        $modalScope.title = "出库签收附件";

                                        var destroyWatcher = $modalScope.$watch('outboundAttach', function (outboundAttach) {
                                            if (!outboundAttach) {
                                                return;
                                            }
                                            destroyWatcher();
                                            outboundAttach.setAttaches(data.epm_project_attachs);
                                        });
                                    }]
                                });
                            });
                        });
                    }else{
                        swalApi.info('还未进行出库签收');
                    }
                    
                };
                /**
                 * 查询经销商
                 */
                $scope.chooseCustomerCode = function () {
                    var customer_code = $scope.data.currItem.customer_code;
                    $modal.openCommonSearch({
                        classId: 'customer_org',
                        postData: {
                            search_flag: 124
                        },
                        sqlWhere: 'valid = 2',// 2-已审核
                        action: 'search'
                    })
                        .result//响应数据
                        .then(function (result) {
                            if (customer_code == result.customer_code) {
                                $scope.data.currItem.customer_id = result.customer_id;
                                $scope.data.currItem.customer_code = result.customer_code;
                                $scope.data.currItem.customer_name = result.customer_name;
                            }else{
                                var confirm = "";
                                if ($scope.data.currItem.epm_invoice_contract_lines[0].contract_id > 0){
                                    confirm = "维护的对应合同信息也将一并删除，是否确定删除？";
                                }
                                if ($scope.data.currItem.epm_invoice_inv_lines.length > 0){
                                    confirm += "\n维护的对应出库信息也将一并删除，是否确定删除？";
                                }
                                if ($scope.data.currItem.epm_invoice_item_lines.length > 0){
                                    confirm += "\n维护的对应产品信息也将一并删除，是否确定删除？";
                                }
                                if(confirm.length > 0){
                                    return swalApi
                                        .confirm(confirm)
                                        .then(function () {
                                            $scope.data.currItem.customer_id = result.customer_id;
                                            $scope.data.currItem.customer_code = result.customer_code;
                                            $scope.data.currItem.customer_name = result.customer_name;

                                            $scope.data.currItem.legal_entity_id = undefined;
                                            $scope.data.currItem.legal_entity_code = undefined;
                                            $scope.data.currItem.legal_entity_name = undefined; // 清空法人相关信息
    
                                            $scope.data.currItem.trading_company_id = undefined;
                                            $scope.data.currItem.trading_company_code = undefined;
                                            $scope.data.currItem.trading_company_name = undefined;// 清空交易公司相关信息
                                            $scope.data.currItem.sort = undefined;

                                            $scope.data.currItem.ext_account_id = undefined;
                                            $scope.data.currItem.ext_account_name = undefined;//清空账户信息

                                            $scope.data.currItem.epm_invoice_contract_lines = [{}]; // 清空合同信息
                                            $scope.gridOptions_contract.hcApi.setRowData($scope.data.currItem.epm_invoice_contract_lines);
                        
                                            $scope.data.currItem.epm_invoice_inv_lines = [];//清空出库单明细
                                            $scope.gridOptions_out.hcApi.setRowData($scope.data.currItem.epm_invoice_inv_lines);
                                            $scope.data.currItem.epm_invoice_item_lines = [];//清空产品明细
                                            $scope.gridOptions_item.hcApi.setRowData($scope.data.currItem.epm_invoice_item_lines);
                                        });
                                }else{
                                    $scope.data.currItem.customer_id = result.customer_id;
                                    $scope.data.currItem.customer_code = result.customer_code;
                                    $scope.data.currItem.customer_name = result.customer_name;

                                    $scope.data.currItem.legal_entity_id = undefined;
                                    $scope.data.currItem.legal_entity_code = undefined;
                                    $scope.data.currItem.legal_entity_name = undefined; // 清空法人相关信息
    
                                    $scope.data.currItem.trading_company_id = undefined;
                                    $scope.data.currItem.trading_company_code = undefined;
                                    $scope.data.currItem.trading_company_name = undefined;// 清空交易公司相关信息
                                    $scope.data.currItem.sort = undefined;

                                    $scope.data.currItem.ext_account_id = undefined;
                                    $scope.data.currItem.ext_account_name = undefined;//清空账户信息
                                }
                            }
                            $scope.calSum();
                        });
                };

                /**
                 * 查询法人客户
                 */
                $scope.chooseLegalEntityCode = function () {
                    if ($scope.data.currItem.trading_company_code == undefined || $scope.data.currItem.trading_company_code == "") {
                        swalApi.info('请先选择交易公司');
                        return;
                    }
                    $modal.openCommonSearch({
                        title: "法人客户",
                        classId: 'epm_project_contract',
                        postData : function () {
                            return {
                                flag : 9,
                                customer_id : $scope.data.currItem.customer_id,
                                trading_company_id : $scope.data.currItem.trading_company_id
                            }
                        },
                        dataRelationName: 'epm_project_contracts',
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "法人客户编码",
                                    field: "legal_entity_code"
                                },{
                                    headerName: "法人客户名称",
                                    field: "legal_entity_name"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function (result) {
                            if ($scope.data.currItem.legal_entity_code == result.legal_entity_code) {
                                $scope.data.currItem.legal_entity_id = result.legal_entity_id;
                                $scope.data.currItem.legal_entity_code = result.legal_entity_code;
                                $scope.data.currItem.legal_entity_name = result.legal_entity_name;
                            }else{
                                var confirm = "";
                                if ($scope.data.currItem.epm_invoice_contract_lines[0].contract_id > 0){
                                    confirm = "维护的对应合同信息也将一并删除，是否确定删除？";
                                }
                                if ($scope.data.currItem.epm_invoice_inv_lines.length > 0){
                                    confirm += "\n维护的对应出库信息也将一并删除，是否确定删除？";
                                }
                                if ($scope.data.currItem.epm_invoice_item_lines.length > 0){
                                    confirm += "\n维护的对应产品信息也将一并删除，是否确定删除？";
                                }
                                if(confirm.length > 0){
                                    return swalApi
                                        .confirm(confirm)
                                        .then(function () {
                                            $scope.data.currItem.legal_entity_id = result.legal_entity_id;
                                            $scope.data.currItem.legal_entity_code = result.legal_entity_code;
                                            $scope.data.currItem.legal_entity_name = result.legal_entity_name;

                                            $scope.data.currItem.ext_account_id = undefined;
                                            $scope.data.currItem.ext_account_name = undefined;//清空账户信息

                                            $scope.data.currItem.epm_invoice_contract_lines = [{}]; // 清空合同信息
                                            $scope.gridOptions_contract.hcApi.setRowData($scope.data.currItem.epm_invoice_contract_lines);
                        
                                            $scope.data.currItem.epm_invoice_inv_lines = [];//清空出库单明细
                                            $scope.gridOptions_out.hcApi.setRowData($scope.data.currItem.epm_invoice_inv_lines);
                                            $scope.data.currItem.epm_invoice_item_lines = [];//清空产品明细
                                            $scope.gridOptions_item.hcApi.setRowData($scope.data.currItem.epm_invoice_item_lines);
                                        });
                                }else{
                                    $scope.data.currItem.legal_entity_id = result.legal_entity_id;
                                    $scope.data.currItem.legal_entity_code = result.legal_entity_code;
                                    $scope.data.currItem.legal_entity_name = result.legal_entity_name;

                                    $scope.data.currItem.ext_account_id = undefined;
                                    $scope.data.currItem.ext_account_name = undefined;//清空账户信息
                                }
                            }
                            $scope.calSum();
                        });
                };

                 /**
                 * 查询交易公司
                 */
                $scope.searchObjectTran = function () {
                    if ($scope.data.currItem.customer_code == undefined || $scope.data.currItem.customer_code == "") {
                        swalApi.info('请先选择客户编码');
                        return;
                    }
                    $modal.openCommonSearch({
                        classId: 'epm_trading_company',
                        postData : function(){
                            return {
                                /** 5-根据客户查询 */
                                search_flag : 5,
                                customer_id : $scope.data.currItem.customer_id
                            }
                        }
                    })
                        .result//响应数据
                        .then(function (result) {
                            if ($scope.data.currItem.trading_company_code == result.trading_company_code) {
                                $scope.data.currItem.trading_company_id = result.trading_company_id;
                                $scope.data.currItem.trading_company_code = result.trading_company_code;
                                $scope.data.currItem.trading_company_name = result.trading_company_name;
                                $scope.data.currItem.sort = result.trading_company_code + "-工程预开";
                            }else{
                                var confirm = "";
                                if ($scope.data.currItem.epm_invoice_contract_lines[0].contract_id > 0){
                                    confirm = "维护的对应合同信息也将一并删除，是否确定删除？";
                                }
                                if ($scope.data.currItem.epm_invoice_inv_lines.length > 0){
                                    confirm += "\n维护的对应出库信息也将一并删除，是否确定删除？";
                                }
                                if ($scope.data.currItem.epm_invoice_item_lines.length > 0){
                                    confirm += "\n维护的对应产品信息也将一并删除，是否确定删除？";
                                }
                                if(confirm.length > 0){
                                    return swalApi
                                        .confirm(confirm)
                                        .then(function () {
                                            $scope.data.currItem.trading_company_id = result.trading_company_id;
                                            $scope.data.currItem.trading_company_code = result.trading_company_code;
                                            $scope.data.currItem.trading_company_name = result.trading_company_name;
                                            $scope.data.currItem.sort = result.trading_company_code + "-工程预开";
                                            $scope.data.currItem.legal_entity_id = undefined;//法人客户ID
                                            $scope.data.currItem.legal_entity_code = undefined;//法人客户编码
                                            $scope.data.currItem.legal_entity_name = undefined;//法人客户名称

                                            $scope.data.currItem.ext_account_id = undefined;
                                            $scope.data.currItem.ext_account_name = undefined;//清空账户信息
                                            
                                            $scope.data.currItem.epm_invoice_contract_lines = [{}]; // 清空合同信息
                                            $scope.gridOptions_contract.hcApi.setRowData($scope.data.currItem.epm_invoice_contract_lines);
                        
                                            $scope.data.currItem.epm_invoice_inv_lines = [];//清空出库单明细
                                            $scope.gridOptions_out.hcApi.setRowData($scope.data.currItem.epm_invoice_inv_lines);
                                            $scope.data.currItem.epm_invoice_item_lines = [];//清空产品明细
                                            $scope.gridOptions_item.hcApi.setRowData($scope.data.currItem.epm_invoice_item_lines);
                                        });
                                }else{
                                    $scope.data.currItem.trading_company_id = result.trading_company_id;
                                    $scope.data.currItem.trading_company_code = result.trading_company_code;
                                    $scope.data.currItem.trading_company_name = result.trading_company_name;
                                    $scope.data.currItem.sort = result.trading_company_code + "-工程预开";
                                    $scope.data.currItem.legal_entity_id = undefined;//法人客户ID
                                    $scope.data.currItem.legal_entity_code = undefined;//法人客户编码
                                    $scope.data.currItem.legal_entity_name = undefined;//法人客户名称

                                    $scope.data.currItem.ext_account_id = undefined;
                                    $scope.data.currItem.ext_account_name = undefined;//清空账户信息
                                }
                            }
                            $scope.calSum();
                        });
                };

                /**
                 * 合同信息 查询
                 */
                $scope.chooseContractCode = function (args) {
                    if ($scope.data.currItem.legal_entity_code == '' || $scope.data.currItem.legal_entity_code == undefined) {
                        swalApi.info("请先选择法人客户");
                        return;
                    }
                    if (!($scope.data.currItem.invoice_make_out_type > 0)) {
                        swalApi.info("请先选择开票类型");
                        return;
                    }
                    $modal.openCommonSearch({
                        classId: 'epm_invoice_apply',
                        action: 'selectforcontract',
                        title:"合同信息",
                        postData:{
                            invoice_make_out_type: $scope.data.currItem.invoice_make_out_type,
                            customer_id : $scope.data.currItem.customer_id,
                            trading_company_id : $scope.data.currItem.trading_company_id,
                            billing_unit_id : $scope.data.currItem.legal_entity_id
                        },
                        dataRelationName:'epm_invoice_applys',
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "合同编号",
                                    field: "contract_code"
                                },{
                                    headerName: "合同名称",
                                    field: "contract_name"
                                },{
                                    headerName: "签订时间",
                                    field: "signed_date"
                                },{
                                    headerName: "开票单位",
                                    field: "billing_unit_name"
                                },{
                                    headerName: "项目编码",
                                    field: "project_code"
                                },{
                                    headerName: "项目名称",
                                    field: "project_name"
                                }
                            ]
                        },
                        beforeOk: function (result) {
                            return requestApi
                                .post({
                                    classId: 'epm_invoice_apply',
                                    action: 'verifycontract',
                                    data: {
                                        invoice_make_out_type: $scope.data.currItem.invoice_make_out_type,
                                        contract_id : result.contract_id
                                    }
                                })
                                .then(function (data) {
                                    if(data.sqlwhere.length > 0){
                                        swalApi.info(data.sqlwhere);
                                        return false;
                                    }else{
                                        return result;
                                    }
                                });
                        }
                    })
                        .result//响应数据
                        .then(function (result) {
                            if(result.contract_id == $scope.data.currItem.epm_invoice_contract_lines[0].contract_id){
                                ['contract_id', 'contract_code', 'contract_name', 'signed_date', 
                                'contract_amount', 'project_id', 'project_code', 'project_name', 
                                'billing_unit_id', 'billing_unit_name', 'tax_identify_num', 'billing_bank', 
                                'billing_account', 'billing_address', 'billing_phone'].forEach(function (field){
                                    args.data[field] = result[field];
                                });
                                args.data.contract_amount = parseInt(args.data.contract_amount);
                                args.api.refreshView();//刷新网格视图
                            }else if($scope.data.currItem.epm_invoice_inv_lines.length > 0){
                                return swalApi
                                    .confirm("替换合同信息，原合同相关的出库信息记录也将一并删除，是否确定替换？")
                                    .then(function () {
                                        ['contract_id', 'contract_code', 'contract_name', 'signed_date', 
                                        'contract_amount', 'project_id', 'project_code', 'project_name', 
                                        'billing_unit_id', 'billing_unit_name', 'tax_identify_num', 'billing_bank', 
                                        'billing_account', 'billing_address', 'billing_phone'].forEach(function (field){
                                            args.data[field] = result[field];
                                        });
                                        args.data.contract_amount = parseInt(args.data.contract_amount);
                                        args.api.refreshView();//刷新网格视图
                                        $scope.data.currItem.epm_invoice_inv_lines = [];//清空出库单明细
                                        $scope.gridOptions_out.hcApi.setRowData($scope.data.currItem.epm_invoice_inv_lines);
                                    });
                            }else if($scope.data.currItem.epm_invoice_item_lines.length > 0){
                                return swalApi
                                    .confirm("替换合同信息，原合同相关的产品信息记录也将一并删除，是否确定替换？")
                                    .then(function () {
                                        ['contract_id', 'contract_code', 'contract_name', 'signed_date', 
                                        'contract_amount', 'project_id', 'project_code', 'project_name', 
                                        'billing_unit_id', 'billing_unit_name', 'tax_identify_num', 'billing_bank', 
                                        'billing_account', 'billing_address', 'billing_phone'].forEach(function (field){
                                            args.data[field] = result[field];
                                        });
                                        args.data.contract_amount = parseInt(args.data.contract_amount);
                                        args.api.refreshView();//刷新网格视图
                                        $scope.data.currItem.epm_invoice_item_lines = [];//清空产品明细
                                $scope.gridOptions_item.hcApi.setRowData($scope.data.currItem.epm_invoice_item_lines);
                                    });
                            }else{
                                ['contract_id', 'contract_code', 'contract_name', 'signed_date', 
                                'contract_amount', 'project_id', 'project_code', 'project_name', 
                                'billing_unit_id', 'billing_unit_name', 'tax_identify_num', 'billing_bank', 
                                'billing_account', 'billing_address', 'billing_phone'].forEach(function (field){
                                    args.data[field] = result[field];
                                });
                                args.data.contract_amount = parseInt(args.data.contract_amount);
                                args.api.refreshView();//刷新网格视图
                            }
                            $scope.calSum();
                        })
                };

                /**
                 * 查询账户信息
                 */
                $scope.chooseEntityAccount = function () {
                    if ($scope.data.currItem.legal_entity_code == '' || $scope.data.currItem.legal_entity_code == undefined) {
                        swalApi.info("请先选择法人客户");
                        return;
                    }
                    $modal.openCommonSearch({
                        classId: 'epm_invoice_apply',
                        action: 'selectforentityaccount',
                        title:"账户信息",
                        postData:{
                            customer_id : $scope.data.currItem.customer_id,
                            trading_company_id : $scope.data.currItem.trading_company_id,
                            billing_unit_id : $scope.data.currItem.legal_entity_id
                        },
                        dataRelationName:'epm_invoice_applys',
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "账户名称",
                                    field: "account_name"
                                },{
                                    headerName: "订单产品线",
                                    field: "channel",
                                    hcDictCode : 'sales.channel'
                                },{
                                    headerName: "销售渠道",
                                    field: "order_pdt_line",
                                    hcDictCode : 'epm.order_pdt_line'
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.ext_account_id = result.ext_account_id;
                            $scope.data.currItem.ext_account_name = result.account_name;
                        })
                };
                /**=================================事件方法===================================*/
                /**
                 * 计算方法
                 */
                function calculateNum (args){
                    if(args){
                        args.data.tax_amount = numberApi.mutiply(numberApi.mutiply(
                            numberApi.divide(args.data.contract_price,numberApi.sum(1, args.data.tax_rate)), args.data.tax_rate), args.data.invoice_qty);
                        
                        args.data.tax_amount = Number(args.data.tax_amount).toFixed(2);
                        
                        args.data.tax_price = Number(numberApi.divide(args.data.tax_amount, args.data.invoice_qty)).toFixed(3);
    
                        //计算产品合同金额
                        args.data.contract_amount = numberApi.mutiply(args.data.contract_price, args.data.invoice_qty);
                    }
                    //合计税额
                    $scope.data.currItem.tax_amount
                        = numberApi.sum($scope.data.currItem.epm_invoice_item_lines, 'tax_amount');
                    //合计开票金额
                    $scope.data.currItem.invoice_amount
                        = numberApi.sum($scope.data.currItem.epm_invoice_item_lines, 'contract_amount');
                    $scope.calSum();
                }
                /**
                 * 开票类型改变事件
                 */
                $scope.changeMakeOutType = function () {
                    if ($scope.data.currItem.invoice_make_out_type == 1) {//开票类型:1-开票
                        if ($scope.data.currItem.epm_invoice_item_lines.length > 0){
                            $scope.data.currItem.invoice_make_out_type = 2;
                            return swalApi
                                .confirm("产品信息已维护数据，切换类型将清除数据,确定切换开票类型吗？")
                                .then(function () {
                                    $scope.data.currItem.invoice_make_out_type = 1;
                                    $scope.data.currItem.promise_payment_time = undefined;//清空预计回款时间
                                    $scope.data.currItem.tax_amount = undefined;//清空税额
                                    $scope.inv_tab.out.hide = false;//隐藏出库信息明细
                                    $scope.inv_tab.item.hide = true;//隐藏产品信息明细
                                    $scope.data.currItem.epm_invoice_item_lines = [];
                                    $scope.gridOptions_item.hcApi.setRowData($scope.data.currItem.epm_invoice_item_lines);
                                    $scope.invTabController.setActiveTab('contract');
                                });
                        }else{
                            $scope.data.currItem.promise_payment_time = undefined;//清空预计回款时间
                            $scope.data.currItem.tax_amount = undefined;//清空税额
                            $scope.inv_tab.out.hide = false;//隐藏出库信息明细
                            $scope.inv_tab.item.hide = true;//隐藏产品信息明细
                        }
                    } else {//开票类型:2-预开票
                        if ($scope.data.currItem.epm_invoice_inv_lines.length > 0 
                            || $scope.data.currItem.epm_invoice_contract_lines[0].contract_id > 0){
                            $scope.data.currItem.invoice_make_out_type = 1;
                            return swalApi
                                .confirm("合同信息与出库信息已维护数据，切换类型将清除数据,确定切换开票类型吗？")
                                .then(function () {
                                    $scope.data.currItem.invoice_make_out_type = 2;
                                    $scope.inv_tab.out.hide = true;//隐藏出库信息明细
                                    $scope.inv_tab.item.hide = false;//隐藏产品信息明细
                                    $scope.data.currItem.epm_invoice_contract_lines = [{}]; // 清空合同信息
                                    $scope.gridOptions_contract.hcApi.setRowData($scope.data.currItem.epm_invoice_contract_lines);
                                    $scope.data.currItem.epm_invoice_inv_lines = [];
                                    $scope.gridOptions_out.hcApi.setRowData($scope.data.currItem.epm_invoice_inv_lines);
                                    $scope.invTabController.setActiveTab('contract');
                                });
                        }else{
                            $scope.inv_tab.out.hide = true;
                            $scope.inv_tab.item.hide = false;
                        }
                    }
                    $scope.invTabController.setActiveTab('contract');
                    $scope.calSum();
                };

                /**
                 * 取消选择客户编码事件
                 */
                $scope.afterDeleteCustomerCode = function () {
                    var confirm = "";
                    if ($scope.data.currItem.epm_invoice_contract_lines[0].contract_id > 0){
                        confirm = "维护的对应合同信息也将一并删除，是否确定删除？";
                    }
                    if ($scope.data.currItem.epm_invoice_inv_lines.length > 0){
                        confirm += "\n维护的对应出库信息也将一并删除，是否确定删除？";
                    }
                    if ($scope.data.currItem.epm_invoice_item_lines.length > 0){
                        confirm += "\n维护的对应产品信息也将一并删除，是否确定删除？";
                    }
                    if(confirm.length > 0){
                        return swalApi
                            .confirm(confirm)
                            .then(function () {
                                $scope.data.currItem.legal_entity_id = undefined;
                                $scope.data.currItem.legal_entity_code = undefined;
                                $scope.data.currItem.legal_entity_name = undefined; // 清空法人相关信息

                                $scope.data.currItem.trading_company_id = undefined;
                                $scope.data.currItem.trading_company_code = undefined;

                                $scope.data.currItem.trading_company_name = undefined;// 清空交易公司相关信息
                                $scope.data.currItem.epm_invoice_contract_lines = [{}]; // 清空合同信息
                                $scope.gridOptions_contract.hcApi.setRowData($scope.data.currItem.epm_invoice_contract_lines);
            
                                $scope.data.currItem.epm_invoice_inv_lines = [];//清空出库单明细
                                $scope.gridOptions_out.hcApi.setRowData($scope.data.currItem.epm_invoice_inv_lines);
                                $scope.data.currItem.epm_invoice_item_lines = [];//清空产品明细
                                $scope.gridOptions_item.hcApi.setRowData($scope.data.currItem.epm_invoice_item_lines);
                            });
                    }else{
                        $scope.data.currItem.legal_entity_id = undefined;
                        $scope.data.currItem.legal_entity_code = undefined;
                        $scope.data.currItem.legal_entity_name = undefined; // 清空法人相关信息

                        $scope.data.currItem.trading_company_id = undefined;
                        $scope.data.currItem.trading_company_code = undefined;
                        $scope.data.currItem.trading_company_name = undefined;// 清空交易公司相关信息
                    }
                    $scope.calSum();
                };

                /**
                 * 取消选择开票类型事件
                 */
                // $scope.afterDeleteInvoiceMakeOutType = function () {
                //     $scope.inv_tab.item.hide = true;//隐藏产品信息明细
                //     $scope.data.currItem.epm_invoice_item_lines = [];//清空产品信息明细
                //     $scope.inv_tab.out.hide = true;//隐藏出库信息明细
                //     $scope.data.currItem.epm_invoice_inv_lines = [];//清空出库信息
                //     $scope.invTabController.setActiveTab('contract');
                // };

                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //判断是否为经销商账户登陆
                    if(user.isCustomer){
                        $scope.data.currItem.customer_id = customer.customer_id;
                        $scope.data.currItem.customer_code = customer.customer_code;
                        $scope.data.currItem.customer_name = customer.customer_name;
                        $scope.onlyCustomer = true;
                    }else{
                        $scope.onlyCustomer = false;
                    }
                    bizData.payment_term = "立即";
                    $scope.data.currItem.gl_date = dateApi.today();
                    $scope.data.currItem.source = "手工录入";
                    $scope.inv_tab.out.hide = true;//新增时默认隐藏出库信息明细
                    $scope.inv_tab.item.hide = true;//新增时默认隐藏产品信息明细
                    $scope.data.currItem.epm_invoice_inv_lines = [];//出库单明细数组
                    $scope.data.currItem.epm_invoice_contract_lines = [{}];//合同信息明细数组
                    $scope.data.currItem.epm_invoice_item_lines = [];//产品信息明细数组
                    $scope.data.currItem.org_name = userbean.loginuserifnos[0].org_name;// 申请部门
                    $scope.data.currItem.org_id = userbean.loginuserifnos[0].org_id;
                    $scope.gridOptions_out.hcApi.setRowData($scope.data.currItem.epm_invoice_inv_lines);
                    $scope.gridOptions_item.hcApi.setRowData($scope.data.currItem.epm_invoice_item_lines);
                    $scope.gridOptions_contract.hcApi.setRowData($scope.data.currItem.epm_invoice_contract_lines);
                    $scope.footerLeftButtons.add_line.hide = true;// 隐藏按钮
                    $scope.footerLeftButtons.del_line.hide = true;
                };
                /**
                 * 保存验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    //判断产品申请数量
                    var invalidNum = [];
                    var invalidQty = [];
                    $scope.data.currItem.epm_invoice_item_lines.forEach(function (value, index) {
                        if(!numberApi.isNum(Number(value.invoice_qty))){//判断输入是否是数字
                            invalidNum.push(index + 1);
                        }else if(Number(value.invoice_qty)<=0){
                            invalidQty.push(index + 1);
                        }
                    });
                    if (invalidNum.length) {
                        invalidBox.push(
                            '',
                            '产品信息，开票数量必须输入数字，以下行不合法：',
                            '第' + invalidNum.join('、') + '行'
                        );
                    }
                    if (invalidQty.length) {
                        invalidBox.push(
                            '',
                            '产品信息，开票数量必须大于零，以下行不合法：',
                            '第' + invalidQty.join('、') + '行'
                        );
                    }
                    if ($scope.data.currItem.remittances_received == 2){
                        //已汇款
                        if($scope.projAttachController.getAttaches().length <= 0 ){
                            invalidBox.push("请上传'汇款凭证'附件！");
                        }else {
                            var whether = true;
                            $scope.projAttachController.getAttaches().forEach(function (value) {
                                if(value.attach_type == "汇款凭证"){
                                    whether = false;
                                }
                            });
                            if(whether){
                                invalidBox.push("请上传'汇款凭证'附件！");
                            }
                        }
                    }
                    return invalidBox;
                };
                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    if ($scope.data.currItem.invoice_make_out_type == 1) {//开票类型:1-开票
                        $scope.inv_tab.out.hide = false;//隐藏出库信息明细
                        $scope.inv_tab.item.hide = true;//隐藏产品信息明细
                    } else {//开票类型:2-预开票
                        $scope.inv_tab.out.hide = true;
                        $scope.inv_tab.item.hide = false;
                    }
                    $scope.invTabController.setActiveTab('contract');
                    $scope.footerLeftButtons.add_line.hide = true;// 隐藏按钮
                    $scope.footerLeftButtons.del_line.hide = true;
                    //$scope.data.currItem.org_name = userbean.loginuserifnos[0].org_name;// 申请部门
                    //$scope.data.currItem.org_code = userbean.loginuserifnos[0].org_id;
                    bizData.epm_invoice_inv_lines.forEach(function (value) {
                        value.atta = "查看附件";
                    });
                    $scope.gridOptions_out.hcApi.setRowData(bizData.epm_invoice_inv_lines);
                    $scope.gridOptions_contract.hcApi.setRowData(bizData.epm_invoice_contract_lines);
                    $scope.gridOptions_item.hcApi.setRowData(bizData.epm_invoice_item_lines);
                    $scope.calSum();
                };
                /**
                 * 保存时改变状态
                 */
                $scope.save = function(){
                    $scope.verification = false;
                    $scope.hcSuper.save().finally(function () {
                        $scope.verification = true;
                    });
                };
                /**
                 * 获取出库单信息
                 */
                function getInvbillNo(code, args) {
                    var postData = {
                        classId: "epm_invoice_apply",
                        action: 'selectforinvoiceinv',
                        data: {
                            sqlwhere: "invbillno = '" + code + "'",
                            epm_invoice_contract_lines: $scope.gridOptions_contract.hcApi.getRowData(),
                            epm_invoice_item_lines: $scope.gridOptions_item.hcApi.getRowData(),
                            invoice_apply_id : $scope.data.currItem.invoice_apply_id > 0 ? $scope.data.currItem.invoice_apply_id : 0
                        }
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.epm_invoice_inv_lines.length > 0) {
                                data.epm_invoice_inv_lines[0].atta = "查看附件";
                                angular.extend(args.data, data.epm_invoice_inv_lines[0]);
                            } else {
                                ['wtamount_total_f', 'atta', 'contract_code', 
                                'contract_id', 'contract_name', 'inv_out_bill_head_id', 
                                'invbillno', 'qty_sum'].forEach(function(field){
                                    args.data[field] = undefined;
                                });
                                args.data.invbillno = "出库单号【" + code + "】不可用";
                            }
                            args.api.refreshView();
                        });
                };

                /**
                 * 获取产品信息
                 */
                // function getItemCode(code) {
                //     var postData = {
                //         classId: "epm_invoice_apply",
                //         action: 'selectforinvoiceitem',
                //         data: {
                //             sqlwhere: "item_code = '" + code + "'",
                //             epm_invoice_contract_lines: $scope.gridOptions_contract.hcApi.getRowData(),
                //             epm_invoice_item_lines: $scope.gridOptions_item.hcApi.getRowData()
                //         }
                //     };
                //     return requestApi.post(postData)
                //         .then(function (data) {
                //             if (data.epm_invoice_item_lines.length > 0) {
                //                 return data.epm_invoice_item_lines[0];
                //             } else {
                //                 return $q.reject("产品编码【" + code + "】不可用");
                //             }
                //         });
                // };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                //增加行
                $scope.footerLeftButtons.add_line = {
                    icon: 'iconfont hc-add',
                    click: function () {
                        return $scope.add_line && $scope.add_line();
                    }
                };

                //删除行
                $scope.footerLeftButtons.del_line = {
                    icon: 'iconfont hc-reduce',
                    click: function () {
                        return $scope.del_line && $scope.del_line();
                    }
                };

                /*隐藏底部左边按钮*/
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;

                /**
                 * 基本信息中标签页改变事件
                 * @param params
                 */
                $scope.onInvTabChange = function (params) {
                    if (params.id == 'contract') {
                        $scope.tabc = "gridOptions_contract";
                        $scope.footerLeftButtons.add_line.hide = true;// 隐藏按钮
                        $scope.footerLeftButtons.del_line.hide = true;
                    } else if (params.id == 'out') {
                        $scope.tabc = "gridOptions_out";
                        $scope.footerLeftButtons.add_line.hide = false;
                        $scope.footerLeftButtons.del_line.hide = false;
                    } else {
                        $scope.tabc = "gridOptions_item";
                        $scope.footerLeftButtons.add_line.hide = false;
                        $scope.footerLeftButtons.del_line.hide = false;
                    }
                };

                /**
                 * 标签页改变事件
                 * @param params
                 */
                $scope.onTabChange = function (params) {
                    $q.when(params)
                        .then($scope.hcSuper.onTabChange)
                        .then(function () {
                            if (params.id == "base" && $scope.tabc != "gridOptions_contract") {
                                // 基本信息页显示增删行按钮，其他页面隐藏
                                $scope.footerLeftButtons.add_line.hide = false;
                                $scope.footerLeftButtons.del_line.hide = false;
                            } else {
                                $scope.footerLeftButtons.add_line.hide = true;// 隐藏按钮
                                $scope.footerLeftButtons.del_line.hide = true;
                            }
                        });
                };

                /**
                 * 添加明细
                 */
                $scope.add_line = function () {
                    var epm_invoice_contract_lines = $scope.data.currItem.epm_invoice_contract_lines;
                    $scope[$scope.tabc].api.stopEditing();
                    if ($scope.tabc == "gridOptions_out") {
                        var data = [];
                        for (var i = 0; i < epm_invoice_contract_lines.length; i++) {
                            if (!epm_invoice_contract_lines[i].contract_id) {// 判断是否有合同信息
                                data.push("请先维护合同信息");
                            }
                        }
                        if (data.length > 0) {
                            swalApi.error(data);
                            return;
                        }
                        // 查询出库单信息
                        $modal.openCommonSearch({
                            classId: 'epm_invoice_apply',
                            action: 'selectforinvoiceinv',
                            dataRelationName: 'epm_invoice_inv_lines',
                            checkbox: true,
                            postData: {
                                epm_invoice_contract_lines: $scope.gridOptions_contract.hcApi.getRowData(),
                                epm_invoice_inv_lines: $scope.gridOptions_out.hcApi.getRowData(),
                                invoice_apply_id : $scope.data.currItem.invoice_apply_id > 0 ? $scope.data.currItem.invoice_apply_id : 0
                            },
                            title: "出库信息",
                            gridOptions: {
                                columnDefs: [
                                    {
                                        field: 'invbillno',
                                        headerName: '出库单号'
                                    }, {
                                        field: 'qty_sum',
                                        headerName: '出库数量'
                                    }, {
                                        field: 'amount_total',
                                        headerName: '出库金额(元)',
                                        type: '金额'
                                    }
                                ]
                            }
                        }).result//响应数据
                            .then(function (response) {
                                for (var i = 0; i < response.length; i++) {
                                    $scope.data.currItem.epm_invoice_inv_lines.push(response[i]);
                                }
                                $scope.data.currItem.epm_invoice_inv_lines.forEach(function (value) {
                                    value.atta = "查看附件";
                                });
                                $scope.gridOptions_out.hcApi.setRowData($scope.data.currItem.epm_invoice_inv_lines);
                            });
                    } else {
                        var data = [];
                        for (var i = 0; i < epm_invoice_contract_lines.length; i++) {
                            if (!epm_invoice_contract_lines[i].contract_id) {//判断是否有合同信息
                                data.push("请先维护合同信息");
                            }
                        }
                        if (data.length > 0) {
                            swalApi.error(data);
                            return;
                        }
                        // 查询产品信息
                        $modal.openCommonSearch({
                            classId: 'epm_invoice_apply',
                            action: 'selectforinvoiceitem',
                            checkbox: true,
                            postData: {
                                epm_invoice_contract_lines: $scope.gridOptions_contract.hcApi.getRowData(),
                                epm_invoice_item_lines: $scope.gridOptions_item.hcApi.getRowData()
                            },
                            title: "产品信息",
                            dataRelationName: 'epm_invoice_item_lines',
                            gridOptions: {
                                columnDefs: [
                                    {
                                        field: 'item_code',
                                        headerName: '产品编码'
                                    }, {
                                        field: 'item_name',
                                        headerName: '产品名称'
                                    }, {
                                        field: 'model',
                                        headerName: '产品型号'
                                    }, {
                                        field: 'spec',
                                        headerName: '产品规格'
                                    }, {
                                        field: 'color',
                                        headerName: '颜色'
                                    }, {
                                        field: 'can_pre_invoice_qty',
                                        headerName: '剩余可预开数量'
                                    }, {
                                        field: 'uom_name',
                                        headerName: '单位'
                                    }, {
                                        field: 'discount_apply_code',
                                        headerName: '工程折扣单编码'
                                    }]
                            }
                        })
                            .result//响应数据
                            .then(function (response) {
                                for (var i = 0; i < response.length; i++) {
                                    $scope.data.currItem.epm_invoice_item_lines.push(response[i]);
                                }
                                $scope.gridOptions_item.hcApi.setRowData($scope.data.currItem.epm_invoice_item_lines);
                            });
                    }
                };

                /**
                 * 删除明细
                 */
                $scope.del_line = function () {
                    var idx = $scope[$scope.tabc].hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                        return;
                    } else {
                        var data;
                        if ($scope.tabc == "gridOptions_out") {
                            data = $scope.data.currItem.epm_invoice_inv_lines;
                            data.splice(idx, 1);
                            $scope.gridOptions_out.hcApi.setRowData(data);
                        } else {
                            data = $scope.data.currItem.epm_invoice_item_lines;
                            data.splice(idx, 1);
                            $scope.gridOptions_item.hcApi.setRowData(data);
                            calculateNum();
                        }
                    }
                };

                /**
                 * 监听提交事件
                 */
                requestApi.on({
                    classId: 'scpwfproc',
                    action: 'submit',
                    error: function (eventData) {
                        if (eventData.data.wfid == $scope.data.currItem.wfid) {
                            $scope.refresh();
                        }
                    },
                    $scope: $scope
                });
            }];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);