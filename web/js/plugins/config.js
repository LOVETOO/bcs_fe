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
        debug: true
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
                pageTitle: 'XF'
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
		.state('index.work', {
            url: "/work",
            templateUrl: "views/work.html",

            data: { pageTitle: '工作台' },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load([{
                        name: 'inspinia',
                        files: ['js/controllers/mywork/ctrl_mydesktop.js']

                    },{
                        name: 'angular-peity',
                        files: ['js/plugins/peity/jquery.peity.min.js', 'js/plugins/peity/angular-peity.js']

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
        .state('gallery.chgpsw', {
            url: "/mywork2",
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
		.state('gallery.mywork2', {
            url: "/mywork_unachieve",
            templateUrl: "views/mywork/mywork_unachieve.html",

            data: { pageTitle: '工作流|未到达流程' },
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
        .state('gallery.mywork3', {
            url: "/mywork_mystart",
            templateUrl: "views/mywork/mywork_mystart.html",

            data: { pageTitle: '工作流|我启的流程' },
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
        .state('gallery.mywork4', {
            url: "/mywork_finished",
            templateUrl: "views/mywork/mywork_finished.html",

            data: { pageTitle: '工作流|已完成流程' },
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
		.state('base', {
            abstract: true,
            url: "/base",
            templateUrl: "views/common/content.html",
        })
        .state('gallery.base_drp_item', {
            url: "/drp_item",
            templateUrl: "views/crmdrp/view_drp_itemedit.html",

            data: {
                pageTitle: '基础资料|物料属性'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_drp_item.js']
                    });
                }
            }
        })
        .state('gallery.base_drp_itemedit', {
            url: "/drp_itemedit",
            templateUrl: "views/crmdrp/view_drp_item.html",

            data: {
                pageTitle: '基础资料|物料属性'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_drp_item.js']
                    });
                }
            }
        })

        .state('gallery.base_drp_uom', {
            url: "/drp_uom",
            templateUrl: "views/crmdrp/drp_uomedit.html",

            data: {
                pageTitle: '基础资料|单位属性维护'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/drp_uom.js']
                    });
                }
            }
        })

        .state('gallery.base_drp_uomedit', {
            url: "/drp_uomedit",
            templateUrl: "views/crmdrp/drp_uom.html",

            data: {
                pageTitle: '基础资料|单位属性维护'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/drp_uom.js']
                    });
                }
            }
        })

        .state('gallery.base_drp_Currency', {
            url: "/drp_Currency",
            templateUrl: "views/crmdrp/drp_Base_Currencyedit.html",

            data: {
                pageTitle: '基础资料|货币属性维护'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/drp_Base_Currency.js']
                    });
                }
            }
        })

        .state('gallery.base_drp_Base_Currencyedit', {
            url: "/drp_Base_Currencyedit",
            templateUrl: "views/crmdrp/drp_Base_Currency.html",

            data: {
                pageTitle: '基础资料|货币属性维护'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/drp_Base_Currency.js']
                    });
                }
            }
        })

        .state('gallery.Drp_WareHouse', {
            url: "/Drp_WareHouse",
            templateUrl: "views/crmdrp/Drp_WareHouseedit.html",

            data: {
                pageTitle: '基础资料|仓库属性维护'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/Drp_WareHouse.js']
                    });
                }
            }
        })

        .state('gallery.Drp_WareHouseedit', {
            url: "/Drp_WareHouseedit",
            templateUrl: "views/crmdrp/Drp_WareHouse.html",

            data: {
                pageTitle: '基础资料|仓库属性维护'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/Drp_WareHouse.js']
                    });
                }
            }
        })
           .state('gallery.base_drp_cust', {
            url: "/drp_cust",
            templateUrl: "views/crmdrp/drp_custedit.html",

            data: {
                pageTitle: '基础资料|客户资料'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/drp_cust.js']
                    });
                }
            }
        })

	   .state('gallery.base_drp_custedit', {
            url: "/drp_custedit",
            templateUrl: "views/crmdrp/drp_cust.html",

            data: {
                pageTitle: '基础资料|客户资料'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/drp_cust.js']
                    });
                }
            }
        })
      .state('gallery.drp_cust_print', {
            url: "/drp_cust_print",
            templateUrl: "views/crmdrp/drp_cust_print.html",

            data: {
                pageTitle: '基础资料|客户资料-打印'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/drp_cust.js','js/Lodop/LodopFuncs.js']
                    });
                }
            }
        })		
		
           .state('gallery.base_drp_price', {
            url: "/drp_price",
            templateUrl: "views/crmdrp/view_drp_pricelistedit.html",

            data: {
                pageTitle: '基础资料|总部价格列表'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_drp_pricelist.js']
                    });
                }
            }
        })
        .state('gallery.base_drp_priceedit', {
            url: "/drp_priceedit",
            templateUrl: "views/crmdrp/view_drp_pricelist.html",

            data: {
                pageTitle: '基础资料|总部价格列表'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_drp_pricelist.js']
                    });
                }
            }
        })
        .state('gallery.base_drpgcust', {
            url: "/drpgcust",
            templateUrl: "views/crmdrp/Drp_GCust_SaleOrder_Header.html",

            data: {
                pageTitle: '订单管理|常规订单查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_GCust_SaleOrder_Header.js']
                    });
                }
            }
        })
        .state('gallery.drp_gcust_saleorder_headerEdit', {
            url: "/drp_gcust_saleorder_headerEdit",
            templateUrl: "views/crmdrp/view_Drp_GCust_SaleOrder_Header.html",

            data: {
                pageTitle: '订单管理|常规订单创建'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_GCust_SaleOrder_Header.js']
                    });
                }
            }
        })
        
        .state('gallery.base_drpgcust1', {
            url: "/drpgcust1",
            templateUrl: "views/crmdrp/Drp_GCust_SaleOrder_HeaderDPS.html",

            data: {
                pageTitle: '订单管理|代配送订单查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_GCust_SaleOrder_HeaderDPS.js']
                    });
                }
            }
        })
        .state('gallery.drp_gcust_saleorder_headerEdit1', {
            url: "/drp_gcust_saleorder_headerEdit1",
            templateUrl: "views/crmdrp/view_Drp_GCust_SaleOrder_HeaderDPS.html",

            data: {
                pageTitle: '订单管理|代配送订单创建'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_GCust_SaleOrder_HeaderDPS.js']
                    });
                }
            }
        })
          .state('gallery.drp_close_saleorder', {
            url: "/drp_close_saleorder",
            templateUrl: "views/crmdrp/drp_close_saleorder.html",
            data: { pageTitle: '订单管理|订单关闭' },
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
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/drp_close_saleorder.js']
                    });
                }
            }
        })
      
    .state('gallery.base_drp_gcust', {
            url: "/drp_gcust",
            templateUrl: "views/crmdrp/view_Drp_GCust_PriceApply_Headeredit.html",

            data: {
                pageTitle: '基础资料|价格申请表'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_GCust_PriceApply_Header.js']
                    });
                }
            }
        })	
 		.state('gallery.base_drp_gcustedit', {
            url: "/drp_gcustedit",
            templateUrl: "views/crmdrp/view_Drp_GCust_PriceApply_Header.html",

            data: {
                pageTitle: '基础资料|价格申请表'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_GCust_PriceApply_Header.js']
                    });
                }
            }
        })
   	 	.state('gallery.view_drp_gcust_priceapply_print', {
            url: "/drp_gcust",
            templateUrl: "views/crmdrp/view_drp_gcust_priceapply_print.html",

            data: {
                pageTitle: '基础资料|价格申请打印'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_GCust_PriceApply_Header.js',
						       'js/lodop/LodopFuncs.js']
                    });
                }
            }
        })
    .state('gallery.base_drp_par', {
            url: "/drp_par",
            templateUrl: "views/crmdrp/Drp_Parameteredit.html",

            data: {
                pageTitle: '基础资料|系统业务参数设定'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/Drp_Parameter.js']
                    });
                }
            }
        })
        .state('gallery.base_drp_paredit', {
            url: "/drp_paredit",
            templateUrl: "views/crmdrp/Drp_Parameter.html",

            data: {
                pageTitle: '基础资料|系统业务参数设定'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/Drp_Parameter.js']
                    });
                }
            }
        })    	
    .state('gallery.base_pi_header', {
            url: "/pi_header",
            templateUrl: "views/crmdrp/Drp_Trans_Fee_Normedit.html",

            data: {
                pageTitle: '基础资料|运价设定'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/Drp_Trans_Fee_Norm.js']
                    });
                }
            }
        })

    .state('gallery.base_pi_headeredit', {
            url: "/pi_headeredit",
            templateUrl: "views/crmdrp/Drp_Trans_Fee_Norm.html",

            data: {
                pageTitle: '基础资料|运价设定'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/Drp_Trans_Fee_Norm.js']
                    });
                }
            }
        })

    .state('gallery.base_Drp_Sales', {
            url: "/Drp_Sales",
            templateUrl: "views/crmdrp/Drp_SalesManedit.html",

            data: {
                pageTitle: '基础资料|业务员资料'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/Drp_SalesMan.js']
                    });
                }
            }
        })
    .state('gallery.base_Drp_Salesedit', {
            url: "/Drp_Salesedit",
            templateUrl: "views/crmdrp/Drp_SalesMan.html",

            data: {
                pageTitle: '基础资料|业务员资料'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/Drp_SalesMan.js']
                    });
                }
            }
        })
    .state('gallery.base_Drp_Print_Bill_Ctrl', {
            url: "/Drp_Print_Bill_Ctrl",
            templateUrl: "views/crmdrp/Drp_Print_Bill_Ctrl.html",

            data: {
                pageTitle: '基础资料|打印解锁'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/Drp_Print_Bill_Ctrl.js']
                    });
                }
            }
        })
        .state('gallery.printTemplate', {
        	url: "/printTemplate",
        	templateUrl: "views/crmbase/PrintTemplate.html",
        	data: { pageTitle: '基础数据 | 打印模板' },
        	resolve: {
        		load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmbase/ctrl_base_print_templet.js']
                    });
                }
            }
        })
        .state('gallery.printTemplateEdit', {
        	url: "/printTemplateEdit",
        	data: { pageTitle: '基础数据 | 打印模板 | 编辑' },
        	templateUrl: "views/crmbase/PrintTemplateEdit.html",
        	resolve: {
        		load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmbase/ctrl_base_print_templet.js']
                    });
                }
            }
        })
		 .state('gallery.pubnotice', {
        	url: "/pubnotice",
        	templateUrl: "views/crmbase/pubnotice.html",
        	data: { pageTitle: '基础数据 | 公告维护' },
        	resolve: {
        		load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmbase/ctrl_base_notice_header.js']
                    });
                }
            }
        })
        .state('gallery.pubnoticeEdit', {
        	url: "/pubnoticeEdit",
        	data: { pageTitle: '基础数据 | 公告维护 | 编辑' },
        	templateUrl: "views/crmbase/pubnoticeEdit.html",
        	resolve: {
        		load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmbase/ctrl_base_notice_header.js']
                    });
                }
            }
        })
		.state('gallery.baseremind', {
        	url: "/base_remind_header",
        	templateUrl: "views/crmbase/Base_remind_header.html",
        	data: { pageTitle: '基础数据 | 工作提醒维护' },
        	resolve: {
        		load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmbase/ctrl_base_remind_header.js']
                    });
                }
            }
        })
        .state('gallery.base_remind_headerEdit', {
        	url: "/base_remind_headerEdit",
        	data: { pageTitle: '基础数据 | 工作提醒维护 | 编辑' },
        	templateUrl: "views/crmbase/Base_remind_headerEdit.html",
        	resolve: {
        		load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmbase/ctrl_base_remind_header.js']
                    });
                }
            }
        })
         .state('gallery.base_drpgtran', {
            url: "/drpgtran",
            templateUrl: "views/crmdrp/DrpTransLoad.html",

            data: {
                pageTitle: '订单管理|分车拼车'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_DrpTransLoad.js']
                    });
                }
            }
        })
         .state('gallery.base_drpgtran2', {
            url: "/drpgtran2",
            templateUrl: "views/crmdrp/DrpTransLoad_new.html",

            data: {
                pageTitle: '订单管理|分车拼车'
            },
            resolve: {
        		loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                       
                        files: ['lib/slickgrid/plugins/slick.checkboxselectcolumn.js',
                                'lib/slickgrid/plugins/slick.autotooltips.js',
                                'lib/slickgrid/plugins/slick.cellrangeselector.js',
                                'lib/slickgrid/plugins/slick.cellcopymanager.js',
                                'lib/slickgrid/plugins/slick.cellselectionmodel.js',
                                'lib/slickgrid/plugins/slick.rowselectionmodel.js',
                                'lib/slickgrid/plugins/slick.cellrangedecorator.js']
                    }]);
                },
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_DrpTransLoad_new.js']
                    });
                }
            }
        })
        .state('gallery.DrpOutBillHeader', {
            url: "/DrpOutBillHeader",
            templateUrl: "views/crmdrp/Drp_OutBill_HeaderNo.html",

            data: {
                pageTitle: '订单管理|出仓单确认(按出仓单)'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_OutBill_HeaderNo.js']
                    });
                }
            }
        })
		.state('gallery.DrpOutBillHeaderPc', {
            url: "/DrpOutBillHeaderPc",
            templateUrl: "views/crmdrp/Drp_OutBill_HeaderPc.html",

            data: {
                pageTitle: '订单管理|出仓单确认(按排车号)'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_OutBill_HeaderPc.js','js/Lodop/LodopFuncs.js']
                    });
                }
            }
        })
		.state('gallery.DrpOutBillHeaderSelectedit', {
            url: "/DrpOutBillHeaderSelectedit",
			templateUrl: "views/crmdrp/Drp_OutBill_Header.html",
           // templateUrl: "views/crmdrp/Drp_OutBill_HeaderSelect.html",

            data: {
                pageTitle: '订单管理|出仓单查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
						files: ['js/controllers/crmdrp/ctrl_Drp_OutBill_Header.js','js/Lodop/LodopFuncs.js']
                        //files: ['js/controllers/crmdrp/ctrl_Drp_OutBill_HeaderPc.js']
                    });
                }
            }
        })
		.state('gallery.DrpOutBillPrint', {
            url: "/DrpOutBillPrint",
			templateUrl: "views/crmdrp/Drp_OutBill_Print.html",
           // templateUrl: "views/crmdrp/Drp_OutBill_HeaderSelect.html",

            data: {
                pageTitle: '订单管理|出仓单查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
						files: ['js/controllers/crmdrp/ctrl_Drp_OutBill_Header.js','js/Lodop/LodopFuncs.js']
                        //files: ['js/controllers/crmdrp/ctrl_Drp_OutBill_HeaderPc.js']
                    });
                }
            }
        })		
        .state('gallery.DrpOutBillHeaderSelect', {
            url: "/DrpOutBillHeaderSelect",
            templateUrl: "views/crmdrp/Drp_OutBill_Headeredit.html",
           // templateUrl: "views/crmdrp/Drp_OutBill_HeaderSelect.html",

            data: {
                pageTitle: '订单管理|出仓单查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_OutBill_Header.js','js/Lodop/LodopFuncs.js']
                        //files: ['js/controllers/crmdrp/ctrl_Drp_OutBill_HeaderPc.js']
                    });
                }
            }
        })
         .state('gallery.Drp_Dviceondeliv_Header', {
            url: "/Drp_Dviceondeliv_Header",
            templateUrl: "views/crmdrp/Drp_Dviceondeliv_Header.html",
           // templateUrl: "views/crmdrp/Drp_Deliver_HeaderSelect.html",

            data: {
                pageTitle: '订单管理|发货通知'
            },
            
            resolve: {
            	loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                       
                        files: ['lib/slickgrid/plugins/slick.checkboxselectcolumn.js',
                                'lib/slickgrid/plugins/slick.autotooltips.js',
                                'lib/slickgrid/plugins/slick.cellrangeselector.js',
                                'lib/slickgrid/plugins/slick.cellcopymanager.js',
                                'lib/slickgrid/plugins/slick.cellselectionmodel.js',
                                'lib/slickgrid/plugins/slick.rowselectionmodel.js',
                                'lib/slickgrid/plugins/slick.cellrangedecorator.js']
                    }]);
                },
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/Drp_Dviceondeliv_Header.js','js/Lodop/LodopFuncs.js']
                        //files: ['js/controllers/crmdrp/ctrl_Drp_Deliver_Header.js']
                    });
                }
            }
        })

        .state('gallery.drp_dviceondeliv_headersearch', {
            url: "/drp_dviceondeliv_headersearch",
            templateUrl: "views/crmdrp/drp_dviceondeliv_headersearchedit.html",
           // templateUrl: "views/crmdrp/Drp_Deliver_HeaderSelect.html",
            data: {
                pageTitle: '订单管理|发货通知查询'
            },
            
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                       
                        files: ['lib/slickgrid/plugins/slick.checkboxselectcolumn.js',
                                'lib/slickgrid/plugins/slick.autotooltips.js',
                                'lib/slickgrid/plugins/slick.cellrangeselector.js',
                                'lib/slickgrid/plugins/slick.cellcopymanager.js',
                                'lib/slickgrid/plugins/slick.cellselectionmodel.js',
                                'lib/slickgrid/plugins/slick.rowselectionmodel.js',
                                'lib/slickgrid/plugins/slick.cellrangedecorator.js']
                    }]);
                },
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/drp_dviceondeliv_headersearch.js']
                        //files: ['js/controllers/crmdrp/ctrl_Drp_Deliver_Header.js']
                    });
                }
            }
        })
      .state('gallery.drp_dviceondeliv_headersearchedit', {
            url: "/drp_dviceondeliv_headersearchedit",
            templateUrl: "views/crmdrp/drp_dviceondeliv_headersearch.html",
           // templateUrl: "views/crmdrp/Drp_Deliver_HeaderSelect.html",

            data: {
                pageTitle: '订单管理|发货通知查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/drp_dviceondeliv_headersearch.js']
                        //files: ['js/controllers/crmdrp/ctrl_Drp_Deliver_Header.js']
                    });
                }
            }
        })
		.state('gallery.DrpDeliverHeaderSelectedit', {
            url: "/DrpDeliverHeaderedit",
			templateUrl: "views/crmdrp/Drp_Deliver_Header.html",
           // templateUrl: "views/crmdrp/Drp_Deliver_HeaderSelect.html",

            data: {
                pageTitle: '订单管理|送货单查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
						files: ['js/controllers/crmdrp/ctrl_Drp_Deliver_Header.js']
                        //files: ['js/controllers/crmdrp/ctrl_Drp_Deliver_Header.js']
                    });
                }
            }
        })

        .state('gallery.DrpDeliverHeaderSelect', {
            url: "/DrpDeliverHeader",
            templateUrl: "views/crmdrp/Drp_Deliver_Headeredit.html",
           // templateUrl: "views/crmdrp/Drp_Deliver_HeaderSelect.html",

            data: {
                pageTitle: '订单管理|送货单查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_Deliver_Header.js']
                        //files: ['js/controllers/crmdrp/ctrl_Drp_Deliver_Header.js']
                    });
                }
            }
        })

        .state('gallery.DrpDiffProcBillHeaderQs', {
            url: "/DrpDiffProcBillHeaderQs",
            templateUrl: "views/crmdrp/Drp_DiffProcBill_HeaderQs.html",
           // templateUrl: "views/crmdrp/Drp_Deliver_HeaderSelect.html",

            data: {
                pageTitle: '订单管理|送货签收单'
            },
            
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                       
                        files: ['lib/slickgrid/plugins/slick.checkboxselectcolumn.js',
                                'lib/slickgrid/plugins/slick.autotooltips.js',
                                'lib/slickgrid/plugins/slick.cellrangeselector.js',
                                'lib/slickgrid/plugins/slick.cellcopymanager.js',
                                'lib/slickgrid/plugins/slick.cellselectionmodel.js',
                                'lib/slickgrid/plugins/slick.rowselectionmodel.js',
                                'lib/slickgrid/plugins/slick.cellrangedecorator.js']
                    }]);
                },
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_DiffProcBill_HeaderQs.js','js/Lodop/LodopFuncs.js']
                        //files: ['js/controllers/crmdrp/ctrl_Drp_Deliver_Header.js']
                    });
                }
            }
        })
	
		.state('gallery.DrpDiffProcBillHeaderSelectedit', {
            url: "/DrpDiffProcBillHeaderSelectedit",
			templateUrl: "views/crmdrp/Drp_DiffProcBill_Header.html",
           
            data: {
                pageTitle: '订单管理|签收单查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
						files: ['js/controllers/crmdrp/ctrl_Drp_DiffProcBill_Header.js']
                        
                    });
                }
            }
        })

        .state('gallery.DrpDiffProcBillHeaderSelect', {
            url: "/DrpDiffProcBillHeader",
            templateUrl: "views/crmdrp/Drp_DiffProcBill_Headeredit.html",
           
            data: {
                pageTitle: '订单管理|签收单查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_DiffProcBill_Header.js']
                        
                    });
                }
            }
        })
		.state('gallery.drp_outbill_headerEdit', {
            url: "/drp_outbill_headerEdit",
			templateUrl: "views/crmdrp/Drp_OutBill_HeaderHc.html",
           
            data: {
                pageTitle: '订单管理|出仓单红冲'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
						files: ['js/controllers/crmdrp/ctrl_Drp_OutBill_HeaderHc.js']
                        
                    });
                }
            }
        })
        .state('gallery.DrpOutBillHeaderHc', {
            url: "/DrpOutBillHeaderHc",
            templateUrl: "views/crmdrp/Drp_OutBill_HeaderHcedit.html",
           
            data: {
                pageTitle: '订单管理|出仓单红冲'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_OutBill_HeaderHc.js']
                        
                    });
                }
            }
        })
		.state('gallery.drp_itemback_headerEdit', {
            url: "/drp_itemback_headerEdit",
			templateUrl: "views/crmdrp/Drp_ItemBack_Header.html",
           
            data: {
                pageTitle: '订单管理|退货单'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
						files: ['js/controllers/crmdrp/ctrl_Drp_ItemBack_Header.js']
                        
                    });
                }
            }
        })
         
         .state('gallery.DrpItemBackHeader', {
            url: "/DrpItemBackHeader",
            templateUrl: "views/crmdrp/Drp_ItemBack_Headeredit.html",
           
            data: {
                pageTitle: '订单管理|退货单'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_ItemBack_Header.js']
                        
                    });
                }
            }
        })
        .state('gallery.DrpItemmoveHeader', {
            url: "/DrpItemmoveHeader",
            templateUrl: "views/crmdrp/Drp_ItemMove_Header.html",
           
            data: {
                pageTitle: '订单管理|调拨单查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_ItemMove_Header.js']
                        
                    });
                }
            }
        })
        .state('gallery.DrpItemmoveHeaderEdit', {
            url: "/DrpItemmoveHeaderEdit",
            templateUrl: "views/crmdrp/Drp_ItemMove_HeaderEdit.html",
           
            data: {
                pageTitle: '订单管理|调拨单'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_ItemMove_Header.js']
                        
                    });
                }
            }
        })
        .state('gallery.base_PriceStop', {
            url: "/PriceStop",
            templateUrl: "views/crmdrp/view_Drp_GCust_PriceStop_Header.html",
            data: { pageTitle: '基础资料|价格作废' },
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
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_GCust_PriceStop_Header.js']
                    });
                }
            }
        })
        
    .state('gallery.base_SaleOrder', {
            url: "/SaleOrder",
            templateUrl: "views/crmdrp/view_Drp_Cust_SaleOrder_Header.html",

            data: {
                pageTitle: '基础资料|客户订单申请'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_Cust_SaleOrder_Header.js']
                    });
                }
            }
        })
		// 预算管理模块
	    .state('gallery.fin_fee_header', {
            url: "/fin_fee_header",
            templateUrl: "views/crmfin/fin_fee_header.html",
            data: {
                pageTitle: '预算管理|费用项目'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_fee_header.js']
                    });
                }
            }
        })	
	    .state('gallery.fin_fee_header_edit', {
            url: "/fin_fee_header_edit",
            templateUrl: "views/crmfin/fin_fee_header_edit.html",
            data: {
                pageTitle: '预算管理|费用项目'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_fee_header.js']
                    });
                }
            }
        })
	    .state('gallery.mkt_act', {
            url: "/mkt_act",
            templateUrl: "views/crmfin/view_mkt_act.html",

            data: {
                pageTitle: '活动申请单'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_mkt_act.js']
                    });
                }
            }
        })
	    .state('gallery.mkt_act_edit', {
            url: "/mkt_act_edit",
            templateUrl: "views/crmfin/view_mkt_act_edit.html",

            data: {
                pageTitle: '活动申请单编辑'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_mkt_act.js']
                    });
                }
            }
        })
	    .state('gallery.mkt_act_bx', {
            url: "/mkt_act_bx",
            templateUrl: "views/crmfin/view_mkt_act_bx.html",

            data: {
                pageTitle: '活动报销单'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_mkt_act_bx.js']
                    });
                }
            }
        })
	    .state('gallery.mkt_act_bx_edit', {
            url: "/mkt_act_bx_edit",
            templateUrl: "views/crmfin/view_mkt_act_bx_edit.html",

            data: {
                pageTitle: '活动报销单编辑'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_mkt_act_bx.js']
                    });
                }
            }
        })
	      .state('gallery.mkt_act_close', {
            url: "/mkt_act_close",
            templateUrl: "views/crmfin/view_mkt_act_close_edit.html",

            data: {
                pageTitle: '活动结案'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_mkt_act_close.js']
                    });
                }
            }
        })
	    .state('gallery.fin_bud_period', {
            url: "/fin_bud_period_header",
            templateUrl: "views/crmfin/fin_bud_period_header.html",

            data: {
                pageTitle: '预算管理|预算期间'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_bud_period_header.js']
                    });
                }
            }
        })	
        .state('gallery.fin_bud_period_header_edit', {
            url: "/fin_bud_period_header_edit",
            templateUrl: "views/crmfin/fin_bud_period_header_edit.html",

            data: {
                pageTitle: '预算管理|预算期间'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_bud_period_header.js']
                    });
                }
            }
        })		
	    .state('gallery.fin_fee_type', {
            url: "/fin_fee_type",
            templateUrl: "views/crmfin/view_fin_fee_type.html",

            data: {
                pageTitle: '预算管理|费用项目类别'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_fee_type.js']
                    });
                }
            }
        })		
	    .state('gallery.fin_bud_type_header', {
            url: "/fin_bud_type_header",
            templateUrl: "views/crmfin/view_fin_bud_type_header.html",

            data: {
                pageTitle: '预算管理|预算类别'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_bud_type_header.js']
                    });
                }
            }
        })	
        .state('gallery.fin_bud_type_header_edit', {
            url: "/fin_bud_type_header_edit",
            templateUrl: "views/crmfin/view_fin_bud_type_header_edit.html",

            data: {
                pageTitle: '预算管理|预算类别'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_bud_type_header.js']
                    });
                }
            }
        })
	    .state('gallery.fin_bud_adjust_header', {
            url: "/fin_bud_adjust_header",
            templateUrl: "views/crmfin/view_fin_bud_adjust_header.html",

            data: {
                pageTitle: '预算管理|预算调整单制单'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_bud_adjust_header.js']
                    });
                }
            }
        })	
        .state('gallery.fin_bud_adjust_header_edit', {
            url: "/fin_bud_adjust_header_edit",
            templateUrl: "views/crmfin/view_fin_bud_adjust_header_edit.html",

            data: {
                pageTitle: '预算管理|预算调整单制单'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_bud_adjust_header.js']
                    });
                }
            }
        })  
	    .state('gallery.fin_bud_adjust_list', {
            url: "/fin_bud_adjust_list",
            templateUrl: "views/crmfin/view_fin_bud_adjust_header.html",

            data: {
                pageTitle: '预算管理|预算调整单查询 '
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_bud_adjust_header.js']
                    });
                }
            }
        })	
        .state('gallery.fin_bud_adjust_list_edit', {
            url: "/fin_bud_adjust_list_edit",
            templateUrl: "views/crmfin/view_fin_bud_adjust_header_edit.html",

            data: {
                pageTitle: '预算管理|预算调整单查询 '
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_bud_adjust_header.js']
                    });
                }
            }
        })  
	    .state('gallery.fin_fee_apply_header', {
            url: "/fin_fee_apply_header",
            templateUrl: "views/crmfin/view_fin_fee_apply_header.html",

            data: {
                pageTitle: '预算管理|费用申请单制单 '
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_fee_apply_header.js']
                    });
                }
            }
        })	
        .state('gallery.fin_fee_apply_header_edit', {
            url: "/fin_fee_apply_header_edit",
            templateUrl: "views/crmfin/view_fin_fee_apply_header_edit.html",

            data: {
                pageTitle: '预算管理|费用申请单制单 '
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_fee_apply_header.js']
                    });
                }
            }
        })  
	   .state('gallery.fin_fee_apply_list', {
            url: "/fin_fee_apply_list",
            templateUrl: "views/crmfin/view_fin_fee_apply_list.html",

            data: {
                pageTitle: '预算管理|费用申请单查询 '
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_fee_apply_header.js']
                    });
                }
            }
        })
        .state('gallery.fin_fee_apply_list_edit', {
            url: "/fin_fee_apply_list_edit",
            templateUrl: "views/crmfin/view_fin_fee_apply_list_edit.html",

            data: {
                pageTitle: '预算管理|费用申请单查询 '
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_fee_apply_header.js']
                    });
                }
            }
        })	
	   .state('gallery.fin_fee_bx_header', {
            url: "/fin_fee_bx_headder",
            templateUrl: "views/crmfin/view_fin_fee_bx_headder_edit.html",

            data: {
                pageTitle: '预算管理|费用报销单制单 '
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_fee_bx_headder.js']
                    });
                }
            }
        })
        .state('gallery.fin_fee_bx_header_edit', {
            url: "/fin_fee_bx_headder_edit",
            templateUrl: "views/crmfin/view_fin_fee_bx_headder_edit.html",

            data: {
                pageTitle: '预算管理|费用报销单制单 '
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_fee_bx_headder.js']
                    });
                }
            }
        })  	
	   .state('gallery.fin_fee_bx_list', {
            url: "/fin_fee_bx_list",
            templateUrl: "views/crmfin/view_fin_fee_bx_list.html",

            data: {
                pageTitle: '预算管理|费用报销单查询 '
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_fee_bx_headder.js']
                    });
                }
            }
        })	
       .state('gallery.fin_fee_bx_list_edit', {
            url: "/fin_fee_bx_list_edit",
            templateUrl: "views/crmfin/view_fin_fee_bx_list_edit.html",

            data: {
                pageTitle: '预算管理|费用报销单查询 '
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_fee_bx_headder.js']
                    });
                }
            }
        })
	     .state('gallery.fin_bud_list', {
            url: "/fin_bud_list",
            templateUrl: "views/crmfin/view_fin_bud_list.html",

            data: {
                pageTitle: '预算管理|预算报表查询 '
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_bud_list.js']
                    });
                }
            }
        })
        .state('gallery.finbud', {
            url: "/finbud",
            templateUrl: "views/crmfin/view_fin_bud.html",

            data: {
                pageTitle: '预算管理|预算报表查询 '
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_bud.js']
                    });
                }
            }
        })
		.state('gallery.Fin_GReturn_Header', {
            url: "/Fin_GReturn_Header",
            templateUrl: "views/crmfin/Fin_GReturn_Headeredit.html",

            data: {
                pageTitle: '财务管理|客户回款录入'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_Fin_GReturn_Header.js']
                    });
                }
            }
        })
        .state('gallery.Fin_GReturn_Headeredit', {
            url: "/Fin_GReturn_Headeredit",
            templateUrl: "views/crmfin/Fin_GReturn_Header.html",

            data: {
                pageTitle: '财务管理|客户回款录入'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_Fin_GReturn_Header.js']
                    });
                }
            }
        })

        .state('gallery.Drp_Invoice_Apply_Header', {
            url: "/Drp_Invoice_Apply_Header",
            templateUrl: "views/crmdrp/Drp_Invoice_Apply_Headeredit.html",

            data: {
                pageTitle: '财务管理|客户开票申请'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/Drp_Invoice_Apply_Header.js']
                    });
                }
            }
        })

        .state('gallery.Drp_Invoice_Apply_Headeredit', {
            url: "/Drp_Invoice_Apply_Headeredit",
            templateUrl: "views/crmdrp/Drp_Invoice_Apply_Header.html",

            data: {
                pageTitle: '财务管理|客户开票申请'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/Drp_Invoice_Apply_Header.js']
                    });
                }
            }
        })
        .state('gallery.Fin_Compensate_list', {
            url: "/Fin_Compensate_list",
            templateUrl: "views/crmfin/Fin_Compensate_list.html",

            data: {
                pageTitle: '财务管理|补差计算'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

        
            return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_Fin_Compensate_list.js']
                    });
                }
            }
        })
       .state('gallery.Drp_Cust_Return', {
            url: "/Drp_Cust_Return",
            templateUrl: "views/crmdrp/Drp_Cust_ReturnAmount_header.html",
           
            data: {
                pageTitle: '报表管理|客户发货余额查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/Drp_Cust_ReturnAmount_header.js']
                        
                    });
                }
            }
        })
        .state('gallery.Drp_Item_WareHouse', {
            url: "/Drp_Item_WareHouse",
            templateUrl: "views/crmdrp/Drp_Item_WareHouse_Search_header.html",
           
            data: {
                pageTitle: '报表管理|产品库存查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/Drp_Item_WareHouse_Search_header.js']
                        
                    });
                }
            }
        }) 

        .state('gallery.Drp_SaleOrder', {
            url: "/Drp_SaleOrder",
            templateUrl: "views/crmdrp/Drp_SaleOrder_Search_header.html",
           
            data: {
                pageTitle: '报表管理|订单明细查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/Drp_SaleOrder_Search_header.js']
                        
                    });
                }
            }
        })
        .state('gallery.Drp_OutBill', {
            url: "/Drp_OutBill",
            templateUrl: "views/crmdrp/Drp_OutBill_Search_header.html",
           
            data: {
                pageTitle: '报表管理|出仓明细查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/Drp_OutBill_Search_header.js']
                        
                    });
                }
            }
        })

        .state('gallery.Drp_SaleRanking_list', {
            url: "/Drp_SaleRanking_list",
            templateUrl: "views/crmdrp/Drp_SaleRanking_list.html",
           
            data: {
                pageTitle: '报表管理|出仓明细查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/Drp_SaleRanking_list.js']
                        
                    });
                }
            }
        })
		.state('gallery.fin_cost_accrued_set_header', {
            url: "/fin_cost_accrued_set_header",
            templateUrl: "views/crmfin/Fin_Cost_Accrued_Set_Header.html",
           
            data: {
                pageTitle: '预算管理|费用计提比例'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_cost_accrued_set_header.js']
                        
                    });
                }
            }
        })
        .state('gallery.fin_materiel_apply_header', {
            url: "/fin_materiel_apply_header",
            templateUrl: "views/crmfin/Fin_Materiel_Apply_Header.html",
           
            data: {
                pageTitle: '预算管理|物料申请单'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_materiel_apply_header.js']
                        
                    });
                }
            }
        })
        .state('gallery.fin_materiel_apply_header_edit', {
            url: "/fin_materiel_apply_header_edit",
            templateUrl: "views/crmfin/Fin_Materiel_Apply_Header_Edit.html",
           
            data: {
                pageTitle: '预算管理|物料申请单编辑'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_materiel_apply_header.js']
                        
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
        $rootScope.gobackhome = function(){
    		$state.go("index.main");
    	}
    });
