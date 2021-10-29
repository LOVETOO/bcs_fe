/**
 * 发票信息
 * 2019/8/16
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', '$timeout', 'directive/hcBox'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, $timeout) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                //*--------------------------------数据定义------------------------------------*/
                $scope.data = {};
                $scope.data.currItem = {};

                //默认可编辑
                $scope.resellerEditable = false;
                /*--------------------------------网格定义------------------------------------*/
                /**
                 * 表格定义
                 */
                $scope.gridOptions = {
                    hcCanExportRoles : 'invoice_record_export',
                    columnDefs: [{
                        type: '序号'
                    }, {
                        headerName: "发票编号",
                        field: "invoice_no"
                    },{
                        headerName: "开票日期",
                        field: "date_invoice",
                        type :'日期'
                    }, {
                        headerName: "发票类型",
                        field: "invoice_class_name"
                    }, {
                        headerName: "发票金额",
                        field: "gt_amount_bill_f",
                        type : '金额'
                    }, {
                        headerName: "客户编码",
                        field: "customer_code"
                    }, {
                        headerName: "客户名称",
                        field: "customer_name"
                    }, {
                        headerName: "开票公司",
                        field: "trading_company_name"
                    }, {
                        headerName: "法人客户",
                        field: "legal_entity_name"
                    }, {
                        headerName: "工程合同号",
                        field: "contract_code"
                    }, {
                        headerName: "快递单号",
                        field: "express_no"
                    }, {
                        headerName: "客户旧编码",
                        field: "crm_cust_code"
                    }, {
                        headerName: "出库单号",
                        field: "inv_out_bill_no"
                    }, {
                        headerName: "销售单号",
                        field: "sa_out_bill_no"
                    }, {
                        headerName: "产品编码",
                        field: "item_code"
                    }, {
                        headerName: "产品名称",
                        field: "item_name"
                    }, {
                        headerName: "单位",
                        field: "uom_name"
                    }, {
                        headerName: "数量",
                        field: "qty_bill"
                    }, {
                        headerName: "单价",
                        field: "price_tax"
                    }, {
                        headerName: "含税金额",
                        field: "amount_bill",
                        type : '金额'
                    }, {
                        headerName: "税率",
                        field: "tax_rate"
                    }, {
                        headerName: "税额",
                        field: "amount_tax",
                        type : '金额'
                    }, {
                        headerName: "不含税金额",
                        field: "amount_notax",
                        type : '金额'
                    }],
                    hcBeforeRequest: function (searchObj) {//发送查询条件
                        searchObj.customer_code = $scope.data.currItem.customer_code;
                        searchObj.customer_name = $scope.data.currItem.customer_name;
                        searchObj.crm_cust_code = $scope.data.currItem.crm_cust_code;
                        searchObj.date_invoice = $scope.data.currItem.date_invoice;
                        searchObj.date_invoice_end = $scope.data.currItem.date_invoice_end;
                        searchObj.invoice_no = $scope.data.currItem.invoice_no;
                        searchObj.attribute11 = $scope.data.currItem.attribute11;
                        searchObj.trading_company_name = $scope.data.currItem.trading_company_name;
                        searchObj.legal_entity_name = $scope.data.currItem.legal_entity_name;
                        searchObj.contract_code = $scope.data.currItem.contract_code;
                        searchObj.express_no = $scope.data.currItem.express_no;
                        searchObj.item_code = $scope.data.currItem.item_code;
                    },
                    //定义查询类与方法
                    hcRequestAction:'search',
                    hcDataRelationName:'epm_ar_invoices',
                    hcClassId:'epm_ar_invoice'
                };

                //控制器继承
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /**
                 * 是否经销商登陆
                 */
                $timeout(function () {
                    if(user.isCustomer){
                        $scope.resellerEditable = true;
                        ['customer_code', 'customer_name', 'crm_cust_code'].forEach(function (filed) {
                            $scope.data.currItem[filed] = customer[filed];
                        });
                        $scope.gridOptions.hcApi.search();
                    }
                },1000);


                /*----------------------------------时间校验-------------------------------------------*/
                /**
                 * 时间校验
                 */
                $scope.changeDate = function(){
                    if(($scope.data.currItem.date_invoice != ""
                        && $scope.data.currItem.date_invoice != undefined
                        && $scope.data.currItem.date_invoice != null)
                        && ($scope.data.currItem.date_invoice_end != ""
                            && $scope.data.currItem.date_invoice_end != undefined
                            && $scope.data.currItem.date_invoice_end != null)){
                        if(new Date($scope.data.currItem.date_invoice).Format('yyyy-MM-dd')
                            != new Date($scope.data.currItem.date_invoice_end).Format('yyyy-MM-dd')){
                            if(new Date($scope.data.currItem.date_invoice).getTime()
                                >= new Date($scope.data.currItem.date_invoice_end).getTime()){
                                swalApi.info("'截止时间'不能小于'起始时间'");
                                $scope.data.currItem.date_invoice = undefined;
                                $scope.data.currItem.date_invoice_end = undefined;
                            }
                        }
                    }
                };

                /*--------------------------------定义按钮------------------------------------*/
                /**
                 * 添加按钮
                 */
                $scope.toolButtons = {
                    search: {
                        title: '清除',
                        icon: 'iconfont hc-qingsao',
                        click: function () {
                            $scope.reset && $scope.reset();
                        }
                    },
                    loan: {
                        title: '查询',
                        icon: 'fa fa-search',
                        click: function () {
                            $scope.gridOptions.hcApi.search();
                        }
                    }
                };
                /*--------------------------------定义按钮方法------------------------------------*/
                /**
                 * 重置方法,将过滤条件清空
                 */
                $scope.reset = function () {
                    var fileds = ["date_invoice", "date_invoice_end","invoice_no","attribute11",
                        "trading_company_name", "legal_entity_name", "contract_code", "express_no"];
                    if(!$scope.resellerEditable){
                        fileds.push(
                            'customer_code',			//经销商编码
                            'customer_name',			//经销商名称
                            'crm_cust_code'				//旧编码
                        );
                    }
                    fileds.forEach(function (data) {
                        $scope.data.currItem[data] = undefined;
                    });
                };

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