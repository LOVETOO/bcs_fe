/**
 *  工程服务费核算-属性页
 *  2019/08/05
 *  weihulin
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', 'numberApi', '$modal'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi, numberApi, $modal) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                /*----定义数据---*/
                $scope.gridOptions = {
                    hcName: '出库信息行',
                    hcRequired : true,
                    columnDefs: [{
                        type: '序号'
                    },{
                        headerName: 'ERP出库单号',
                        field: 'invbill_sap_no'
                    },{
                        headerName: '客户编码',
                        field: 'customer_code'
                    },{
                        headerName: '客户名称',
                        field: 'customer_name'
                    },{
                        headerName: '订单类型',
                        field: 'order_type',
                        hcDictCode : 'epm.bill_type'
                    },{
                        headerName: '发货基地',
                        field: 'trading_company_name'
                    },{
                        headerName: '合同编码',
                        field: 'contract_code'
                    },{
                        headerName: '合同名称',
                        field: 'contract_name'
                    },{
                        headerName: '工程项目编码',
                        field: 'project_code'
                    },{
                        headerName: '工程项目名称',
                        field: 'project_name'
                    },{
                        headerName: '法人客户编码',
                        field: 'legal_entity_code'
                    },{
                        headerName: '法人客户名称',
                        field: 'legal_entity_name'
                    },{
                        headerName: '产品编码',
                        field: 'item_code'
                    },{
                        headerName: '产品名称',
                        field: 'item_name'
                    },{
                        headerName: '订单单号',
                        field: 'sa_salebillno'
                    },{
                        headerName: '实发数量',
                        field: 'qty_bill',
                        type : '数量'
                    },{
                        headerName: '标准单价',
                        field: 'price_bill_f',
                        type: '金额'
                    },{
                        headerName: '合同单价',
                        field: 'contract_price',
                        type: '金额'
                    },{
                        headerName: '应用折扣率',
                        field: 'discount_tax',
                        type : '数量'
                    },{
                        field: 'wtpricec_bill_f',
                        headerName: '折后单价',
                        type: '金额'
                    },{
                        headerName: '合同金额',
                        field: 'contract_amt',
                        type: '金额'
                    },{
                        headerName: '实际结算金额',
                        field: 'wtamount_bill_f',
                        type: '金额'
                    },{
                        headerName: '服务费金额',
                        field: 'service_charge_amt',
                        type: '金额'
                    }]
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //指定网格对象,否则左下按钮出不来
                $scope.data.currGridModel = 'data.currItem.epm_service_expense_lines';
                $scope.data.currGridOptions = $scope.gridOptions;

                /**
                 * 清除网格数据
                 */
                function clearData (){
                    $scope.data.currItem.epm_service_expense_lines = [];
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_service_expense_lines);
                    $scope.getOrderLines();
                }

                /*-----------------通用查询----------------*/
                $scope.commonSearchSetting = {
                    //客户查询
                    CustomerOrg : {
                        title:'客户',
                        postData:{
                            search_flag : 124,/* 经销商客户查询 */
                            valid : 2/* 查询已生效的 */
                        },
                        afterOk: function (result) {
                            $scope.data.currItem.customer_id = result.customer_id;
                            $scope.data.currItem.customer_code = result.customer_code;
                            $scope.data.currItem.customer_name = result.customer_name;
                            $scope.data.currItem.billing_unit_id = undefined;
                            $scope.data.currItem.billing_unit_code = undefined;
                            $scope.data.currItem.billing_unit_name = undefined;
                            //清空相关数据
                            clearData ();
                        }
                    },
                    //法人客户查询
                    legalEntityName : {
                        title:'开票单位',
                        dataRelationName:'epm_project_contracts',
                        postData:function(){
                            return {
                                flag : 12,
                                customer_id : $scope.data.currItem.customer_id
                            }
                        },
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "开票单位编码",
                                    field: "legal_entity_code"
                                },{
                                    headerName: "开票单位名称",
                                    field: "legal_entity_name"
                                }
                            ]
                        },
                        afterOk: function (result) {
                            $scope.data.currItem.billing_unit_code = result.legal_entity_code;
                            $scope.data.currItem.billing_unit_name = result.legal_entity_name;
                            $scope.data.currItem.billing_unit_id = result.legal_entity_id;
                            $scope.getOrderLines();
                        },
                        beforeOk : function (result) {
                            return requestApi
                                .post({
                                    classId: 'inv_out_bill_head',
                                    action: 'verifycode',
                                    data: {
                                        customer_id: $scope.data.currItem.customer_id,
                                        billing_unit_id : result.legal_entity_id
                                    }
                                })
                                .then(function (data) {
                                    if (data.sqlwhere.length > 0) {
                                        swalApi.error(data.sqlwhere);
                                    }
                                    $scope.data.currItem.epm_service_expense_lines = data.inv_out_bill_heads;
                                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_service_expense_lines);
                                    return result;
                                });
                        },
                        beforeOpen : function(){
                            if((!$scope.data.currItem.customer_id > 0)){
                                swalApi.info('请先选择客户信息');
                                return false;
                            }
                        }
                    },
                    // 工程项目
                    ProjectName : {
                        postData: function(){
                            return {
                                contract_type : 1,/* 限定自营 */
                                flag : 11
                            };
                        },
                        title : '工程项目',
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "项目编码",
                                    field: "project_code"
                                },{
                                    headerName: "项目名称",
                                    field: "project_name"
                                }
                            ]
                        },
                        beforeOk : function (result) {
                            return requestApi
                                .post({
                                    classId: 'inv_out_bill_head',
                                    action: 'verifycode',
                                    data: {
                                        project_id: result.project_id
                                    }
                                })
                                .then(function (data) {
                                    if (data.sqlwhere.length > 0) {
                                        swalApi.error(data.sqlwhere);
                                        return false;
                                    }else{
                                        $scope.data.currItem.epm_service_expense_lines = data.inv_out_bill_heads;
                                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_service_expense_lines);
                                        return result;
                                    }
                                });
                        },
                        afterOk : function (result) {
                            $scope.data.currItem.project_id = result.project_id;
                            $scope.data.currItem.project_code= result.project_code;
                            $scope.data.currItem.project_name = result.project_name;
                            $scope.getOrderLines();
                        }
                    }
                };

                /**
                 * 获取订单数据
                 *
                 *  已发合同总额：已发合同金额合计；total_auditt_amt
                 8、已发结算总额：已发结算金额合计；total_check_amt
                 9、服务费金额：= 已发合同总额-已发结算总额；service_amt
                 10、已兑现金额：从已兑现的服务费累计回写；（此模块暂未开发）total_cash_amt
                 11、未兑现金额：=服务费金额-已兑现金额 total_uncash_amt
                 */
                $scope.getOrderLines = function () {
                    var total_auditt_amt = 0,// 合同发货总额
                        total_check_amt = 0,// 发货结算总额
                        service_amt = 0;
                    $scope.data.currItem.epm_service_expense_lines.forEach(function (value) {
                        total_auditt_amt = numberApi.sum(total_auditt_amt,value.contract_amt);
                        total_check_amt = numberApi.sum(total_check_amt,value.wtamount_bill_f);
                        service_amt = numberApi.sum(service_amt,value.service_charge_amt);
                    });

                    $scope.data.currItem.total_auditt_amt = total_auditt_amt;
                    $scope.data.currItem.total_check_amt = total_check_amt;
                    $scope.data.currItem.service_amt = service_amt;
                };

                $scope.isCustomerCode = user.isCustomer;

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
                    }
                };

                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_service_expense_lines);
                    $scope.getOrderLines();
                };

                /*---------按钮及标签 定义------*/
                $scope.footerLeftButtons.addRow.click = function (){
                    $scope.add_line && $scope.add_line();
                };
                /**
                 * 删除明细按钮
                 * */
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();
                };
                /**
                 * 新增明细行
                 */
                $scope.add_line = function (){
                    $scope.gridOptions.api.stopEditing();
                    if($scope.data.currItem.billing_unit_id > 0){
                    return $modal.openCommonSearch({
                        classId:'inv_out_bill_head',
                        postData: {
                            customer_id: $scope.data.currItem.customer_id,
                            billing_unit_id : $scope.data.currItem.billing_unit_id,
                            inv_out_bill_heads : $scope.data.currItem.epm_service_expense_lines
                        },
                        action : 'getorderlines',
                        checkbox: true,
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "ERP出库单号",
                                    field: "invbill_sap_no"
                                },{
                                    headerName: "合同编码",
                                    field: "contract_code"
                                },{
                                    headerName: "合同名称",
                                    field: "contract_name"
                                },{
                                    headerName: "工程项目编码",
                                    field: "project_code"
                                },{
                                    headerName: "工程项目名称",
                                    field: "project_name"
                                },{
                                    headerName: "折后金额",
                                    field: "wtamount_bill_f",
                                    type: "金额"
                                },{
                                    headerName: "产品编码",
                                    field: "item_code"
                                },{
                                    headerName: "产品名称",
                                    field: "item_name"
                                },{
                                    headerName: "订单单号",
                                    field: "sa_salebillno"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function(result){
                            result.forEach(function(value){
                                $scope.data.currItem.epm_service_expense_lines.push(value);
                                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_service_expense_lines);
                            });
                        });
                    }else{
                        swalApi.error('请先选择开票单位');
                    }
                };
                /**
                 * 删除行明细
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_service_expense_lines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_service_expense_lines);
                    }
                };

                /*隐藏底部左边按钮*/
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;


            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);