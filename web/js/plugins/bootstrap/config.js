/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $$qProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/index/main");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "views/common/content.html",
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "views/main.html",
            data: {
                pageTitle: 'Home'
            },
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        serie: true,
                        name: 'angular-flot',
                        files: ['js/plugins/flot/jquery.flot.js', 'js/plugins/flot/jquery.flot.time.js', 'js/plugins/flot/jquery.flot.tooltip.min.js', 'js/plugins/flot/jquery.flot.spline.js', 'js/plugins/flot/jquery.flot.resize.js', 'js/plugins/flot/jquery.flot.pie.js', 'js/plugins/flot/curvedLines.js', 'js/plugins/flot/angular-flot.js', ]
                    }, {
                        files: ['js/plugins/jvectormap/jquery-jvectormap-2.0.2.min.js', 'js/plugins/jvectormap/jquery-jvectormap-2.0.2.css']
                    }, {
                        files: ['js/plugins/jvectormap/jquery-jvectormap-world-mill-en.js']
                    }]);
                }
            }
        })
        .state('gallery', {
            abstract: true,
            url: "/main",
            templateUrl: "views/common/content.html",
        })
        .state('gallery.mywork1', {
            url: "/mywork_uncheck",
            templateUrl: "views/mywork/mywork_uncheck.html",

            data: { pageTitle: '工作流|当前待批的流程' },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/workhits_uncheck.js']
                    });
                }
            }
        })
		.state('gallery.mywork2', {
            url: "/mywork_mystart",
            templateUrl: "views/mywork/mywork_mystart.html",

            data: { pageTitle: '工作流|我启动的流程' },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/workhits_mystart.js']
                    });
                }
            }
        })
        .state('gallery.mywork3', {
            url: "/mywork_unachieve",
            templateUrl: "views/mywork/mywork_unachieve.html",

            data: { pageTitle: '工作流|未达到的流程' },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/workhits_unachieve.js']
                    });
                }
            }
        })
        .state('gallery.mywork4', {
            url: "/mywork_finished",
            templateUrl: "views/mywork/mywork_finished.html",

            data: { pageTitle: '工作流|已完成的流程' },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/workhits_finished.js']
                    });
                }
            }
        })	
        .state('gallery.chgpsw', {
            url: "/chgpsw",
            templateUrl: "views/mywork/chgpsw.html",

            data: { pageTitle: 'chgpsw' },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/workhits.js']
                    });
                }
            }
        })		
		/**------------------------基础数据-------------------------*/
        .state('gallery.BaseA_0_23', {
            url: "/base_print_templet",
            templateUrl: "views/baseman/PrintTemplate.html",
            data: {
                pageTitle: '基础数据  | 打印模板'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_print_templet.js']
                    });
                }
            }
        })
        .state('gallery.BaseA_0_23_E', {
            url: "/base_print_templetedit",
            templateUrl: "views/baseman/PrintTemplateEdit.html",
            data: {
                pageTitle: '基础数据  | 打印模板'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_print_templet.js']
                    });
                }
            }
        })
        .state('gallery.BaseBoxRule', {
            url: "/baseboxrule",
            templateUrl: "views/baseman/Base_Box_Rule.html",
            data: { pageTitle: '基础数据 | 柜型最大值维护' },
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_Base_Box_Rule.js']
                    });
                }
            }
        })
		.state('gallery.BaseBoxRuleEdit', {
            url: "/baseboxrule_edit",
            templateUrl: "views/baseman/Base_Box_RuleEdit.html",
            data: { pageTitle: '基础数据 | 柜型最大值维护' },
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_Base_Box_Rule.js']
                    });
                }
            }
        })		
        .state('gallery.CustOMS_Name', {
            url: "/CustOMS_Name",
            templateUrl: "views/saleman/CustOMS_Name.html",
            data: { pageTitle: '销售管理|报关税率设置|查询' },
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/ctrl_CustOMS_Name.js']
                    });
                }
            }
        })
		.state('gallery.CustOMS_NameEdit', {
            url: "/CustOMS_NameEdit",
            templateUrl: "views/saleman/CustOMS_NameEdit.html",
            data: { pageTitle: '销售管理|报关税率设置|编辑' },
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/ctrl_CustOMS_Name.js']
                    });
                }
            }
        })
        .state('gallery.BaseA_0_1', {
            url: "/base_area",
            templateUrl: "views/baseman/Base_Area.html",
            data: {
                pageTitle: '基础数据  | 国家'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_area.js']
                    });
                }
            }
        })
        .state('gallery.BaseA_0_1_E', {
            url: "/base_area_edit",
            templateUrl: "views/baseman/Base_AreaEdit.html",
            data: {
                pageTitle: '基础数据  | 国家'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_area.js']
                    });
                }
            }
        })
        .state('gallery.BaseA_0_2', {
            url: "/base_currency",
            templateUrl: "views/baseman/Base_Currency.html",
            data: {
                pageTitle: '基础资料 | 币种'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_currency.js']
                    });
                }
            }
        })
         .state('gallery.BaseA_0_2_E', {
            url: "/base_currency_edit",
            templateUrl: "views/baseman/Base_CurrencyEdit.html",
            data: {
                pageTitle: '基础资料 | 币种'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_currency.js']
                    });
                }
            }
        })
        .state('gallery.BaseA_0_3', {
            url: "/exchange_rate",
            templateUrl: "views/baseman/Exchange_Rate.html",
            data: {
                pageTitle: '基础资料 | 汇率设置'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_exchange_rate.js']
                    });
                }
            }
        })
         .state('gallery.BaseA_0_3_E', {
            url: "/exchange_rate_edit",
            templateUrl: "views/baseman/Exchange_RateEdit.html",
            data: {
                pageTitle: '基础资料 | 汇率设置'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_exchange_rate.js']
                    });
                }
            }
        })
        .state('gallery.Seaport', {
            url: "/Seaport_edit",
            templateUrl: "views/baseman/SeaPort.html",
            data: {
                pageTitle: '基础资料 | 港口'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_seaport.js']
                    });
                }
            }
        })
        .state('gallery.Seaport_E', {
            url: "/Seaport_edit",
            templateUrl: "views/baseman/SeaPortEdit.html",
            data: {
                pageTitle: '基础资料 |港口|编辑'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_seaport.js']
                    });
                }
            }
        })
        .state('gallery.Payment_TypeEdit', {
            url: "/Payment_TypeEdit",
            templateUrl: "views/baseman/Payment_TypeEdit.html",
            data: {
                pageTitle: '基础资料 | 付款方式|编辑'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_payment.js']
                    });
                }
            }
        })
        .state('gallery.Payment_Type', {
            url: "/Payment_Type",
            templateUrl: "views/baseman/Payment_Type.html",
            data: {
                pageTitle: '基础资料|付款条件'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_payment.js']
                    });
                }
            }
        })
        .state('gallery.Uom', {
            url: "/uom",
            templateUrl: "views/baseman/Base_UomEdit.html",
            data: {
                pageTitle: '基础资料|计量单位|编辑'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_uom.js']
                    });
                }
            }
        })
         .state('gallery.Sale_Order_Fee', {
            url: "/Sale_Order_Fee",
            templateUrl: "views/baseman/Sale_Order_Fee.html",
            data: {
                pageTitle: '基础资料|费用项目设置|编辑'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_sale_order_fee.js']
                    });
                }
            }
        })
         .state('gallery.Sale_Order_FeeEdit', {
            url: "/Sale_Order_FeeEdit",
            templateUrl: "views/baseman/Sale_Order_FeeEdit.html",
            data: {
                pageTitle: '基础资料|费用项目设置|编辑'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_sale_order_fee.js']
                    });
                }
            }
        })
        .state('gallery.BaseContract', {
            url: "/BaseContract",
            templateUrl: "views/baseman/Base_ContractEdit.html",
            data: {
                pageTitle: '基础资料|部门成本中心维护|编辑'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_contract.js']
                    });
                }
            }
        })
        .state('gallery.SaleBaseTypeSx', {
            url: "/SaleBaseTypeSx",
            templateUrl: "views/baseman/Base_TypeSxEdit.html",
            data: {
                pageTitle: '基础资料|参数维护|编辑'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_typesx.js']
                    });
                }
            }
        })
        .state('gallery.BaseTechParaConf', {
            url: "/basetechparaconf",
            templateUrl: "views/baseman/Base_Tech_Para_ConfEdit.html",
            data: {
                pageTitle: '基础资料|技术参数维护|编辑'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_base_tech_para_conf.js']
                    });
                }
            }
        })
        .state('gallery.BaseXS', {
            url: "/BaseXS",
            templateUrl: "views/baseman/Base_SxEdit.html",
            data: {
                pageTitle: '基础资料|价格系数维护|编辑'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_sx.js']
                    });
                }
            }
        })
        .state('gallery.BaseShippingUser', {
            url: "/BaseA_0_38",
            templateUrl: "views/baseman/Base_Shipping_UserEdit.html",
            data: {
                pageTitle: '基础资料|船务单证人员维护|编辑'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_shipping_user.js']
                    });
                }
            }
        })
        .state('gallery.Price_Type', {
            url: "/BaseA_3_04",
            templateUrl: "views/baseman/Price_TypeEdit.html",
            data: {
                pageTitle: '基础资料|价格条款维护|编辑'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_price_type.js']
                    });
                }
            }
        })
        .state('gallery.oms1-4-1-6', {
            url: "/supplier",
            templateUrl: "views/baseman/Supplier.html",
            data: {
                pageTitle: '基础数据 | 供应商'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_supplier.js']
                    });
                }
            }
        })
        .state('gallery.BaseSupplier', {
            url: "/BaseA_3_07",
            templateUrl: "views/baseman/SupplierEdit.html",
            data: {
                pageTitle: '基础数据|船公司及货代公司|编辑'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files : [ 'js/controllers/baseman/ctrl_supplier.js']
                    });
                }
            }
        })
          //------------------------------客户管理模块-------------------------------------------
        .state('gallery.Customer_Apply_Header_E', {
            url: "/customer_apply_header",
            templateUrl: "views/baseman/Customer_Apply_Header.html",
            data: {
                pageTitle: '基础数据|客户开户申请'
            },
          //  controller: "customerApplyHeaderController",
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_customer_apply_header.js']
                    });
                }
            }
        })
        .state('gallery.Customer_Apply_Header', {
            url: "/customer_apply_header_edit",
            templateUrl: "views/baseman/Customer_Apply_HeaderEdit.html",
            data: {
                pageTitle: '基础数据|客户开户申请|编辑'
            },
           // controller: "customerApplyHeaderEditController",
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_customer_apply_header.js']
                    });
                }
            }
        })
       .state('gallery.Customer_Visit_Record', {
            url: "/BaseC_0_16",
            templateUrl: "views/baseman/Customer_Visit_RecordEdit.html",
            data: {
                pageTitle: '基础数据|客户拜访记录|编辑'
            },
           // controller: "customerApplyHeaderEditController",
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_customer_visit_record.js']
                    });
                }
            }
        })
        .state('gallery.CustomerCoreItem', {
            url: "/customer_apply_header_edit",
            templateUrl: "views/baseman/Customer_Core_ItemEdit.html",
            data: {
                pageTitle: '基础数据|中心名称维护编辑'
            },
           // controller: "customerApplyHeaderEditController",
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_customer_apply_header.js']
                    });
                }
            }
        })
        
        .state('gallery.oms1-1-1-4', {
            url: "/oms1-1-1-4",
            templateUrl: "views/baseman/Customer_Apply_HeaderEdit.html",
            data: {
                pageTitle: '基础数据|客户开户申请'
            },
           // controller: "customerApplyHeaderEditController",
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_customer_apply_header_edit.js']
                    });
                }
            }
        })
        .state('gallery.oms1-1-1-5', {
            url: "/customer",
            templateUrl: "views/baseman/customer.html",
            data: {
                pageTitle: '基础数据|客户'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_customer.js']
                    });
                }
            }
        })
        .state('gallery.customer_edit', {
            url: "/CustomerEdit1",
            templateUrl: "views/baseman/CustomerEdit1.html",
            data: {
                pageTitle: '基础数据|客户|编辑'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_customer_edit.js']
                    });
                }
            }
        })
        .state('gallery.oms1-1-1-3', {
            url: "/CustomerEdit",
            templateUrl: "views/baseman/CustomerEdit.html",
            data: {
                pageTitle: '基础数据|客户'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_customer_edit.js']
                    });
                }
            }
        })
        .state('gallery.BaseProItemHeader--', {
            url: "/pro_item_header",
            templateUrl: "views/baseman/Pro_Item_Header.html",
            data: { pageTitle: '基准机型' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css','js/plugins/iCheck/icheck.min.js']
                        }
                    ]);
                },
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_pro_item_header.js']
                    });
                }
            }
        }) 
        .state('gallery.BaseProItemHeader', {
            url: "/pro_item_headeredit",
            templateUrl: "views/baseman/Pro_Item_HeaderEdit.html",
            data: { pageTitle: '基准机型|编辑' },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_pro_item_header.js']
                    });
                }
            }
        })
		.state('gallery.oms1-3-1-2', {
            url: "/Base_Css_Item",
            templateUrl: "views/baseman/Base_Css_Item.html",
            data: { pageTitle: '基础数据 | 配件清单' },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_css_item.js']
                    });
                }
            }
        })
		.state('gallery.Base_Css_ItemEdit', {
            url: "/Base_Css_ItemEdit",
            templateUrl: "views/baseman/Base_Css_ItemEdit.html",
            data: { pageTitle: '基础数据 | 配件清单' },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_css_item.js']
                    });
                }
            }
        })
        .state('gallery.oms1-2-1-1', {
            url: "/sale_pricelist",
            templateUrl: "views/baseman/Sale_Pricelist.html",
            data: { pageTitle: '基础数据 | 指导价格' },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_sale_pricelist.js']
                    });
                }
            }
        })
        .state('gallery.sale_pricelist_edit', {
            url: "/sale_pricelist_edit",
            templateUrl: "views/baseman/Sale_PricelistEdit.html",
            data: { pageTitle: '基础数据|指导价格|编辑' },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_sale_pricelist.js']
                    });
                }
            }
        })
        .state('gallery.Bank', {
            url: "/bank",
            templateUrl: "views/baseman/Base_Bank.html",
            data: { pageTitle: '基础数据 | 银行资料' },
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_bank.js']
                    });
                }
            }
        })
        .state('gallery.Bank_E', {
            url: "/bank_e",
            templateUrl: "views/baseman/Base_BankEdit.html",
            data: { pageTitle: '基础数据 |银行资料|编辑' },
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_bank.js']
                    });
                }
            }
        })
		.state('gallery.oms1-4-1-8', {
        	url: "/printTemplate",
        	templateUrl: "views/baseman/PrintTemplate.html",
        	data: { pageTitle: '基础数据 | 打印模板' },
        	resolve: {
        		load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_print_templet.js']
                    });
                }
            }
        })
        .state('gallery.printTemplateEdit', {
        	url: "/printTemplateEdit",
        	data: { pageTitle: '基础数据 | 打印模板 | 编辑' },
        	templateUrl: "views/baseman/PrintTemplateEdit.html",
        	resolve: {
        		load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_print_templet.js']
                    });
                }
            }
        })
        .state('gallery.bank_edit', {
            url: "/bank_edit",
            templateUrl: "views/baseman/BankEdit.html",
            data: { pageTitle: '基础数据|银行资料|编辑' },
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_bank.js']
                    });
                }
            }
        })
		.state('gallery.oms1-2-1-2', {
            url: "/Base_Css_Item",
            templateUrl: "views/baseman/Base_Css_Item.html",
            data: { pageTitle: '基础数据 | 配件价格清单' },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_css_item.js']
                    });
                }
            }
        })

		.state('gallery.oms1-2-1-3', {
            url: "/sale_customs_price",
            templateUrl: "views/baseman/Sale_CustOms_Price.html",
            data: { pageTitle: '基础数据 | 报关单价格维护' },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_sale_customs_price.js']
                    });
                }
            }
        })

        .state('gallery.sale_customs_priceedit', {
            url: "/sale_customs_priceedit",
            templateUrl: "views/baseman/Sale_CustOms_PriceEdit.html",
            data: { pageTitle: '基础数据|报关单价格维护|编辑' },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_sale_customs_price.js']
                    });
                }
            }
        })
		.state('gallery.oms1-4-1-9', {
            url: "/brand",
            templateUrl: "views/baseman/Brand.html",
            data: { pageTitle: '基础数据 | 品牌资料|查询' },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'promanControllers',
                        files: ['js/controllers/baseman/ctrl_brand.js']
                    });
                }
            }
        })
        .state('gallery.brandEdit', {
            url: "/brandEdit",
            templateUrl: "views/baseman/BrandEdit.html",
            data: { pageTitle: '基础数据 | 品牌资料|查询' },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'promanControllers',
                        files: ['js/controllers/baseman/ctrl_brand.js']
                    });
                }
            }
        })
		.state('gallery.oms3-1', {
        	url: "/oms3-1",
        	templateUrl: "views/saleman/sale_prod_headerPlan.html",
            data: { pageTitle: 'oms3-1' },
			resolve: {
				loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                       
                        files: ['lib/slickgrid/plugins/slick.checkboxselectcolumn.js',
                                'lib/slickgrid/plugins/slick.autotooltips.js',
                                'lib/slickgrid/plugins/slick.cellrangeselector.js',
                                'lib/slickgrid/plugins/slick.cellcopymanager.js',
                                'lib/slickgrid/slick.dataview.js',
                                'lib/slickgrid/plugins/slick.cellselectionmodel.js',
                                'lib/slickgrid/plugins/slick.rowselectionmodel.js',
                                'lib/slickgrid/plugins/slick.cellrangedecorator.js']
                    }]);
                },
				load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'promanControllers',
                        files: ['js/controllers/saleman/ctrl_sale_prod_header_plan.js']
                    });
                }
            }
        })
        .state('gallery.oms3-8', {
            url: "/oms3-8",
            templateUrl: "views/saleman/sale_box_list.html",
            data: {
                pageTitle: 'oms3-8'
            },
            resolve: {
            	load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'promanControllers',
                        files: ['js/controllers/saleman/ctrl_sale_box_list.js']
                    });
                }
            }

        })
        .state('gallery.oms3-9', {
            url: "/oms3-9",
            templateUrl: "views/saleman/sale_warehouse_list.html",
            data: {
                pageTitle: 'oms3-9'
            },
            resolve: {
            	load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'promanControllers',
                        files: ['js/controllers/saleman/ctrl_sale_warehouse_list.js']
                    });
                }
            }

        })
     //------------------------------产品管理模块-------------------------------------------
       .state('gallery.ProPriceSynchron', {
            url: "/ProPriceSynchron",
            templateUrl: "views/proman/ProPriceSynchron.html",
            data: {
                pageTitle: '产品管理|产品价格同步'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/proman/ProPriceSynchron.js']
                    });
                }
            }

        })
       .state('gallery.ProItemErp', {
            url: "/ProItemErp",
            templateUrl: "views/proman/ProItemErp.html",
            data: {
                pageTitle: '产品管理|标准机型同步'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/proman/ProItemErp.js']
                    });
                }
            }

        })

       .state('gallery.ProItemHeaderDetail', {
            url: "/ProItemHeaderDetail",
            templateUrl: "views/proman/ProItemHeaderDetail.html",
            data: {
                pageTitle: '产品管理|标准机型详情'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/proman/ProItemHeaderDetail.js']
                    });
                }
            }

        })
         .state('gallery.ProAuthorization', {
            url: "/ProAuthorization",
            templateUrl: "views/proman/ProAuthorization.html",
            data: {
                pageTitle: '产品管理  | 价格权限价'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/proman/ProAuthorization.js']
                    });
                }
            }
        })
        .state('gallery.ProAuthorizationEdit', {
            url: "/ProAuthorizationEdit",
            templateUrl: "views/proman/ProAuthorizationEdit.html",
            data: {
                pageTitle: '产品管理  | 价格权限价'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/proman/ProAuthorization.js']
                    });
                }
            }
        })
        //------------------------------客户管理模块-------------------------------------------
             .state('gallery.CrmCustomer', {
            url: "/CrmCustomer",
            templateUrl: "views/crmman/CrmCustomer.html",
            data: {
                pageTitle: '产品管理  | 价格权限价'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmman/CrmCustomer.js']
                    });
                }
            }
        })
         .state('gallery.CrmCustomerEdit', {
            url: "/CrmCustomerEdit",
            templateUrl: "views/crmman/CrmCustomerEdit.html",
            data: {
                pageTitle: '产品管理  | 价格权限价'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmman/CrmCustomerEdit.js']
                    });
                }
            }
        })
        .state('gallery.CrmSalesman', {
            url: "/CrmSalesman",
            templateUrl: "views/crmman/CrmSalesman.html",
            data: {
                pageTitle: '客户管理  | 业务员'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmman/CrmSaleman.js']
                    });
                }
            }
        })
         .state('gallery.CrmSalesmanEdit', {
            url: "/CrmSalesmanEdit",
            templateUrl: "views/crmman/CrmSalesmanEdit.html",
            data: {
                pageTitle: '客户管理  | 业务员'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmman/CrmSaleman.js']
                    });
                }
            }
        })
        //------------------------------销售管理模块-------------------------------------------
        .state('gallery.Sale_Pi_Header', {
            url: "/sale010",
            templateUrl: "views/saleman/sale_pi_header.html",
            data: {
                pageTitle: '销售管理|形式发票|查询'
            },
            resolve: {
            	load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'promanControllers',
                        files: ['js/controllers/saleman/ctrl_sale_pi_header.js']
                    });
                }
            }

        })
        .state('gallery.Sale_Pi_HeaderEdit', {
            url: "/sale011",
            templateUrl: "views/saleman/sale_pi_headerEdit.html",
            data: {
                pageTitle: '销售管理|形式发票|编辑'
            },
            resolve: {
            	load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'promanControllers',
                        files: ['js/controllers/saleman/ctrl_sale_pi_header.js']
                    });
                }
            }

        })
		.state('gallery.Sale_Prod_Header', {
            url: "/sale110",
            templateUrl: "views/saleman/sale_prod_header.html",
            data: {
                pageTitle: '销售管理|生产通知单|查询'
            },
            resolve: {
            	load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'promanControllers',
                        files: ['js/controllers/saleman/ctrl_sale_prod_header.js']
                    });
                }
            }

        })
        .state('gallery.Sale_Prod_HeaderEdit', {
            url: "/sale111",
            templateUrl: "views/saleman/sale_prod_headerEdit.html",
            data: {
                pageTitle: '销售管理|生产通知单|编辑'
            },
            resolve: {
            	load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'promanControllers',
                        files: ['js/controllers/saleman/ctrl_sale_prod_header.js']
                    });
                }
            }

        })
        .state('gallery.CrmSapFinanceSubjects', {
            url: "/sale12_24",
            templateUrl: "views/saleman/Crm_Sap_Finance_SubjectsEdit.html",
            data: {
                pageTitle: '销售管理|费用编码|编辑'
            },
            resolve: {
            	load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'promanControllers',
                        files: ['js/controllers/saleman/ctrl_crm_sap_finance_subjects.js']
                    });
                }
            }

        })
        .state('gallery.Custom_Elements', {
            url: "/Custom_Elements",
            templateUrl: "views/saleman/Custom_Elements.html",
            data: {
                pageTitle: '销售管理|报关要素|查询'
            },
            resolve: {
            	load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/ctrl_custom_elements.js']
                    });
                }
            }

        })
        .state('gallery.Custom_ElementsEdit', {
            url: "/Custom_ElementsEdit",
            templateUrl: "views/saleman/Custom_ElementsEdit.html",
            data: {
                pageTitle: '销售管理|报关要素|编辑'
            },
            resolve: {
            	load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/ctrl_custom_elements.js']
                    });
                }
            }

        })
         //------------------------------财务管理模块-------------------------------------------
        .state('gallery.FinFundsItem', {
            url: "/FinD_1_330",
            templateUrl: "views/finman/Fin_Funds_ItemEdit.html",
            data: {
                pageTitle: '财务管理|业务员与汇款人对应关系维护|编辑'
            },
            resolve: {
            	load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'promanControllers',
                        files: ['js/controllers/finman/ctrl_fin_funds_item.js']
                    });
                }
            }

        })
		  //------------------------------财务管理模块-------------------------------------------
        .state('gallery.BillBank', {
            url: "/Bill118",
            templateUrl: "views/billman/bill_bankEdit.html",
            data: {
                pageTitle: '财务管理|银行名称维护(单证)|编辑'
            },
            resolve: {
            	load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'promanControllers',
                        files: ['js/controllers/billman/ctrl_bill_bank.js']
                    });
                }
            }

        })
          //------------------------------单证管理模块-------------------------------------------
		.state('gallery.Fin_Lc_Bill_E', {
            url: "/fin_lc_bill_e",
            templateUrl: "views/finman/MyHtml.html",
            data: {
                pageTitle: '单证管理|信用证录入'
            },
            resolve: {
                  load: function($templateCache, $ocLazyLoad, $q, $http) {
                        lazyDeferred = $q.defer();

                        return $ocLazyLoad.load({
                            name: 'inspinia',
                            files: ['js/controllers/baseman/ctrl_supplier.js']
                        });
                    }
            }
        })
        .state('gallery.Fin_Lc_Bill', {
            url: "/Fin_Lc_Bill",
            templateUrl: "views/finman/Fin_Lc_BillEdit.html",
            data: {
                pageTitle: '单证管理|信用证录入'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'promanControllers',
                        files: ['js/controllers/finman/ctrl_fin_lc_bill_header.js']
                    });
                }
            }
        })
        
}
angular
    .module('inspinia')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
