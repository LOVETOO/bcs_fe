/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $$qProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/crmman/home");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });
 
    $stateProvider

        .state('crmman', {  
            abstract: true,
            url: "/crmman",
            templateUrl: "views/common/content.html",
        })
        .state('crmman.home', {
            url: "/home",
            templateUrl: "views/main.html",
            data: {
                pageTitle: '首页'
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
        .state('crmman.work', {
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
        .state('crmman.mywork1', {
            url: "/mywork1",
            templateUrl: "views/mywork/mywork_uncheck.html",

            data: { pageTitle: '当前待批的流程' },
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
        .state('crmman.chgpsw', {
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
        .state('crmman.mywork2', {
            url: "/mywork2",
            templateUrl: "views/mywork/mywork_unachieve.html",

            data: { pageTitle: '未到达流程' },
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
        .state('crmman.mywork3', {
            url: "/mywork3",
            templateUrl: "views/mywork/mywork_mystart.html",

            data: { pageTitle: '我启的流程' },
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
        .state('crmman.mywork4', {
            url: "/mywork4",
            templateUrl: "views/mywork/mywork_finished.html",

            data: { pageTitle: '已完成流程' },
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
        .state('crmman.base_drp_item', {
            url: "/base_drp_item",
            templateUrl: "views/crmdrp/view_drp_itemedit.html",

            data: {
                pageTitle: '物料属性'
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
        .state('crmman.base_drp_itemedit', {
            url: "/base_drp_itemedit",
            templateUrl: "views/crmdrp/view_drp_item.html",

            data: {
                pageTitle: '物料属性'
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

        .state('crmman.base_drp_uom', {
            url: "/base_drp_uom",
            templateUrl: "views/crmdrp/drp_uomedit.html",

            data: {
                pageTitle: '单位属性维护'
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

        .state('crmman.base_drp_uomedit', {
            url: "/base_drp_uomedit",
            templateUrl: "views/crmdrp/drp_uom.html",

            data: {
                pageTitle: '单位属性维护'
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

        .state('crmman.base_drp_Currency', {
            url: "/base_drp_Currency",
            templateUrl: "views/crmdrp/drp_Base_Currencyedit.html",

            data: {
                pageTitle: '货币属性维护'
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

        .state('crmman.base_drp_Base_Currencyedit', {
            url: "/base_drp_Base_Currencyedit",
            templateUrl: "views/crmdrp/drp_Base_Currency.html",

            data: {
                pageTitle: '货币属性维护'
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

        .state('crmman.Drp_WareHouse', {
            url: "/Drp_WareHouse",
            templateUrl: "views/crmdrp/Drp_WareHouseedit.html",

            data: {
                pageTitle: '仓库属性维护'
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

        .state('crmman.Drp_WareHouseedit', {
            url: "/Drp_WareHouseedit",
            templateUrl: "views/crmdrp/Drp_WareHouse.html",

            data: {
                pageTitle: '仓库属性维护'
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
           .state('crmman.base_drp_cust', {
            url: "/base_drp_cust",
            templateUrl: "views/crmdrp/drp_custedit.html",

            data: {
                pageTitle: '客户资料'
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

       .state('crmman.base_drp_custedit', {
            url: "/base_drp_custedit",
            templateUrl: "views/crmdrp/drp_cust.html",

            data: {
                pageTitle: '客户资料'
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
      .state('crmman.drp_cust_print', {
            url: "/drp_cust_print",
            templateUrl: "views/crmdrp/drp_cust_print.html",

            data: {
                pageTitle: '客户资料-打印'
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
        
           .state('crmman.base_drp_price', {
            url: "/base_drp_price",
            templateUrl: "views/crmdrp/view_drp_pricelistedit.html",

            data: {
                pageTitle: '总部价格列表'
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
        .state('crmman.base_drp_priceedit', {
            url: "/base_drp_priceedit",
            templateUrl: "views/crmdrp/view_drp_pricelist.html",

            data: {
                pageTitle: '总部价格列表'
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
        .state('crmman.base_drpgcust', {
            url: "/base_drpgcust",
            templateUrl: "views/crmdrp/Drp_GCust_SaleOrder_Header.html",

            data: {
                pageTitle: '常规订单查询'
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
        .state('crmman.drp_gcust_saleorder_headerEdit', {
            url: "/drp_gcust_saleorder_headerEdit",
            templateUrl: "views/crmdrp/view_Drp_GCust_SaleOrder_Header.html",

            data: {
                pageTitle: '常规订单创建'
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
        
        .state('crmman.base_drpgcust1', {
            url: "/base_drpgcust1",
            templateUrl: "views/crmdrp/Drp_GCust_SaleOrder_HeaderDPS.html",

            data: {
                pageTitle: '代配送订单查询'
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
        .state('crmman.drp_gcust_saleorder_headerEdit1', {
            url: "/drp_gcust_saleorder_headerEdit1",
            templateUrl: "views/crmdrp/view_Drp_GCust_SaleOrder_HeaderDPS.html",

            data: {
                pageTitle: '代配送订单创建'
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
          .state('crmman.drp_close_saleorder', {
            url: "/drp_close_saleorder",
            templateUrl: "views/crmdrp/drp_close_saleorder.html",
            data: { pageTitle: '订单关闭' },
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
      
    .state('crmman.base_drp_gcust', {
            url: "/base_drp_gcust",
            templateUrl: "views/crmdrp/view_Drp_GCust_PriceApply_Headeredit.html",

            data: {
                pageTitle: '价格申请表'
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
        .state('crmman.base_drp_gcustedit', {
            url: "/base_drp_gcustedit",
            templateUrl: "views/crmdrp/view_Drp_GCust_PriceApply_Header.html",

            data: {
                pageTitle: '价格申请表'
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
        .state('crmman.view_drp_gcust_priceapply_print', {
            url: "/view_drp_gcust_priceapply_print",
            templateUrl: "views/crmdrp/view_drp_gcust_priceapply_print.html",

            data: {
                pageTitle: '价格申请打印'
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
    .state('crmman.base_drp_par', {
            url: "/base_drp_par",
            templateUrl: "views/crmdrp/Drp_Parameteredit.html",

            data: {
                pageTitle: '系统业务参数设定'
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
        .state('crmman.base_drp_paredit', {
            url: "/base_drp_paredit",
            templateUrl: "views/crmdrp/Drp_Parameter.html",

            data: {
                pageTitle: '系统业务参数设定'
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
    .state('crmman.base_pi_header', {
            url: "/base_pi_header",
            templateUrl: "views/crmdrp/Drp_Trans_Fee_Normedit.html",

            data: {
                pageTitle: '运价设定'
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

    .state('crmman.base_pi_headeredit', {
            url: "/base_pi_headeredit",
            templateUrl: "views/crmdrp/Drp_Trans_Fee_Norm.html",

            data: {
                pageTitle: '运价设定'
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

    .state('crmman.base_Drp_Sales', {
            url: "/base_Drp_Sales",
            templateUrl: "views/crmdrp/Drp_SalesManedit.html",

            data: {
                pageTitle: '业务员资料'
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
    .state('crmman.base_Drp_Salesedit', {
            url: "/base_Drp_Salesedit",
            templateUrl: "views/crmdrp/Drp_SalesMan.html",

            data: {
                pageTitle: '业务员资料'
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
    .state('crmman.base_Drp_Print_Bill_Ctrl', {
            url: "/base_Drp_Print_Bill_Ctrl",
            templateUrl: "views/crmdrp/Drp_Print_Bill_Ctrl.html",

            data: {
                pageTitle: '打印解锁'
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
        .state('crmman.printTemplate', {
            url: "/printTemplate",
            templateUrl: "views/crmbase/PrintTemplate.html",
            data: { pageTitle: '基础数据  打印模板' },
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
        .state('crmman.printTemplateEdit', {
            url: "/printTemplateEdit",
            data: { pageTitle: '基础数据  打印模板  编辑' },
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
         .state('crmman.pubnotice', {
            url: "/pubnotice",
            templateUrl: "views/crmbase/pubnotice.html",
            data: { pageTitle: '基础数据  公告维护' },
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
        .state('crmman.pubnoticeEdit', {
            url: "/pubnoticeEdit",
            data: { pageTitle: '基础数据  公告维护  编辑' },
            templateUrl: "views/crmbase/printTemplateEdit.html",
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
        .state('crmman.baseremind', {
            url: "/baseremind",
            templateUrl: "views/crmbase/baseremind.html",
            data: { pageTitle: '基础数据 | 工作提醒维护' },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmbase/ctrl_baseremind.js']
                    });
                }
            }
        })
        .state('crmman.baseremindEdit', {
            url: "/baseremindEdit",
            data: { pageTitle: '基础数据 | 工作提醒维护 | 编辑' },
            templateUrl: "views/crmbase/baseremindEdit.html",
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmbase/ctrl_baseremind.js']
                    });
                }
            }
        })
         .state('crmman.base_drpgtran', {
            url: "/base_drpgtran",
            templateUrl: "views/crmdrp/DrpTransLoad.html",

            data: {
                pageTitle: '分车拼车'
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
		.state('crmman.Drp_Outbill_Trans_Header', {
            url: "/Drp_Outbill_Trans_Header",
            templateUrl: "views/crmdrp/Drp_Outbill_Trans_Header.html",
           
            data: {
                pageTitle: '出仓单运费查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_Outbill_Trans_Header.js']
                        
                    });
                }
            }
        })
        .state('crmman.Drp_Outbill_Trans_HeaderEdit', {
            url: "/Drp_Outbill_Trans_HeaderEdit",
            templateUrl: "views/crmdrp/Drp_Outbill_Trans_HeaderEdit.html",
           
            data: {
                pageTitle: '出仓单'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_Outbill_Trans_Header.js']
                        
                    });
                }
            }
        })
         .state('crmman.base_drpgtran2', {
            url: "/base_drpgtran2",
            templateUrl: "views/crmdrp/DrpTransLoad_new.html",

            data: {
                pageTitle: '分车拼车'
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
        .state('crmman.DrpOutBillHeader', {
            url: "/DrpOutBillHeader",
            templateUrl: "views/crmdrp/Drp_OutBill_HeaderNo.html",

            data: {
                pageTitle: '出仓单确认(按出仓单)'
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
        .state('crmman.DrpOutBillHeaderPc', {
            url: "/DrpOutBillHeaderPc",
            templateUrl: "views/crmdrp/Drp_OutBill_HeaderPc.html",

            data: {
                pageTitle: '出仓单确认(按排车号)'
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
        .state('crmman.DrpOutBillHeaderSelectedit', {
            url: "/DrpOutBillHeaderSelectedit",
            templateUrl: "views/crmdrp/Drp_OutBill_Header.html",
           // templateUrl: "views/crmdrp/Drp_OutBill_HeaderSelect.html",

            data: {
                pageTitle: '出仓单查询'
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
        .state('crmman.DrpOutBillPrint', {
            url: "/DrpOutBillPrint",
            templateUrl: "views/crmdrp/Drp_OutBill_Print.html",
           // templateUrl: "views/crmdrp/Drp_OutBill_HeaderSelect.html",

            data: {
                pageTitle: '出仓单查询'
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
        .state('crmman.DrpOutBillHeaderSelect', {
            url: "/DrpOutBillHeaderSelect",
            templateUrl: "views/crmdrp/Drp_OutBill_Headeredit.html",
           // templateUrl: "views/crmdrp/Drp_OutBill_HeaderSelect.html",

            data: {
                pageTitle: '出仓单查询'
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
         .state('crmman.Drp_Dviceondeliv_Header', {
            url: "/Drp_Dviceondeliv_Header",
            templateUrl: "views/crmdrp/Drp_Dviceondeliv_Header.html",
           // templateUrl: "views/crmdrp/Drp_Deliver_HeaderSelect.html",

            data: {
                pageTitle: '发货通知'
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

        .state('crmman.drp_dviceondeliv_headersearch', {
            url: "/drp_dviceondeliv_headersearch",
            templateUrl: "views/crmdrp/drp_dviceondeliv_headersearchedit.html",
           // templateUrl: "views/crmdrp/Drp_Deliver_HeaderSelect.html",

            data: {
                pageTitle: '发货通知查询'
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
                        files: ['js/controllers/crmdrp/drp_dviceondeliv_headersearch.js','js/Lodop/LodopFuncs.js']
                        //files: ['js/controllers/crmdrp/ctrl_Drp_Deliver_Header.js']
                    });
                }
            }
        })
      .state('crmman.drp_dviceondeliv_headersearchedit', {
            url: "/drp_dviceondeliv_headersearchedit",
            templateUrl: "views/crmdrp/drp_dviceondeliv_headersearch.html",
           // templateUrl: "views/crmdrp/Drp_Deliver_HeaderSelect.html",

            data: {
                pageTitle: '发货通知查询'
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
        .state('crmman.DrpDeliverHeaderSelectedit', {
            url: "/DrpDeliverHeaderSelectedit",
            templateUrl: "views/crmdrp/Drp_Deliver_Header.html",
           // templateUrl: "views/crmdrp/Drp_Deliver_HeaderSelect.html",

            data: {
                pageTitle: '送货单查询'
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

        .state('crmman.DrpDeliverHeaderSelect', {
            url: "/DrpDeliverHeaderSelect",
            templateUrl: "views/crmdrp/Drp_Deliver_Headeredit.html",
           // templateUrl: "views/crmdrp/Drp_Deliver_HeaderSelect.html",

            data: {
                pageTitle: '送货单查询'
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

        .state('crmman.DrpDiffProcBillHeaderQs', {
            url: "/DrpDiffProcBillHeaderQs",
            templateUrl: "views/crmdrp/Drp_DiffProcBill_HeaderQs.html",
           // templateUrl: "views/crmdrp/Drp_Deliver_HeaderSelect.html",

            data: {
                pageTitle: '送货签收单'
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
    
        .state('crmman.DrpDiffProcBillHeaderSelectedit', {
            url: "/DrpDiffProcBillHeaderSelectedit",
            templateUrl: "views/crmdrp/Drp_DiffProcBill_Header.html",
           
            data: {
                pageTitle: '签收单查询'
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

        .state('crmman.DrpDiffProcBillHeaderSelect', {
            url: "/DrpDiffProcBillHeaderSelect",
            templateUrl: "views/crmdrp/Drp_DiffProcBill_Headeredit.html",
           
            data: {
                pageTitle: '签收单查询'
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
        .state('crmman.drp_outbill_headerEdit', {
            url: "/drp_outbill_headerEdit",
            templateUrl: "views/crmdrp/Drp_OutBill_HeaderHc.html",
           
            data: {
                pageTitle: '出仓单红冲'
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
        .state('crmman.DrpOutBillHeaderHc', {
            url: "/DrpOutBillHeaderHc",
            templateUrl: "views/crmdrp/Drp_OutBill_HeaderHcedit.html",
           
            data: {
                pageTitle: '出仓单红冲'
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
        .state('crmman.drp_itemback_headerEdit', {
            url: "/drp_itemback_headerEdit",
            templateUrl: "views/crmdrp/Drp_ItemBack_Header.html",
           
            data: {
                pageTitle: '退货单'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_Drp_ItemBack_Header.js','js/Lodop/LodopFuncs.js']
                        
                    });
                }
            }
        })
         
         .state('crmman.DrpItemBackHeader', {
            url: "/DrpItemBackHeader",
            templateUrl: "views/crmdrp/Drp_ItemBack_Headeredit.html",
           
            data: {
                pageTitle: '退货单'
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
        .state('crmman.DrpItemmoveHeader', {
            url: "/DrpItemmoveHeader",
            templateUrl: "views/crmdrp/Drp_ItemMove_Header.html",
           
            data: {
                pageTitle: '调拨单查询'
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
        .state('crmman.DrpItemmoveHeaderEdit', {
            url: "/DrpItemmoveHeaderEdit",
            templateUrl: "views/crmdrp/Drp_ItemMove_HeaderEdit.html",
           
            data: {
                pageTitle: '调拨单'
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
        .state('crmman.base_PriceStop', {
            url: "/base_PriceStop",
            templateUrl: "views/crmdrp/view_Drp_GCust_PriceStop_Header.html",
            data: { pageTitle: '价格作废' },
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
        
    .state('crmman.base_SaleOrder', {
            url: "/base_SaleOrder",
            templateUrl: "views/crmdrp/view_Drp_Cust_SaleOrder_Header.html",

            data: {
                pageTitle: '客户订单申请'
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
        .state('crmman.fin_fee_header', {
            url: "/fin_fee_header",
            templateUrl: "views/crmfin/fin_fee_header.html",
            data: {
                pageTitle: '费用项目'
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
        .state('crmman.fin_fee_header_edit', {
            url: "/fin_fee_header_edit",
            templateUrl: "views/crmfin/fin_fee_header_edit.html",
            data: {
                pageTitle: '费用项目'
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
        .state('crmman.mkt_act', {
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
        .state('crmman.mkt_act_edit', {
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
        .state('crmman.mkt_act_bx', {
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
        .state('crmman.mkt_act_bx_edit', {
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
          .state('crmman.mkt_act_close', {
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
        .state('crmman.fin_bud_period', {
            url: "/fin_bud_period",
            templateUrl: "views/crmfin/fin_bud_period_header.html",

            data: {
                pageTitle: '预算期间'
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
        .state('crmman.fin_bud_period_header_edit', {
            url: "/fin_bud_period_header_edit",
            templateUrl: "views/crmfin/fin_bud_period_header_edit.html",

            data: {
                pageTitle: '预算期间'
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
        .state('crmman.fin_fee_type', {
            url: "/fin_fee_type",
            templateUrl: "views/crmfin/view_fin_fee_type.html",

            data: {
                pageTitle: '费用项目类别'
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
        .state('crmman.fin_bud_type_header', {
            url: "/fin_bud_type_header",
            templateUrl: "views/crmfin/view_fin_bud_type_header.html",

            data: {
                pageTitle: '预算类别'
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
        .state('crmman.fin_bud_type_header_edit', {
            url: "/fin_bud_type_header_edit",
            templateUrl: "views/crmfin/view_fin_bud_type_header_edit.html",

            data: {
                pageTitle: '预算类别'
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
        .state('crmman.fin_bud_adjust_header', {
            url: "/fin_bud_adjust_header",
            templateUrl: "views/crmfin/view_fin_bud_adjust_header.html",

            data: {
                pageTitle: '预算调整单制单'
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
        .state('crmman.fin_bud_adjust_header_edit', {
            url: "/fin_bud_adjust_header_edit",
            templateUrl: "views/crmfin/view_fin_bud_adjust_header_edit.html",

            data: {
                pageTitle: '预算调整单制单'
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
        .state('crmman.fin_bud_adjust_list', {
            url: "/fin_bud_adjust_list",
            templateUrl: "views/crmfin/view_fin_bud_adjust_header.html",

            data: {
                pageTitle: '预算调整单查询 '
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
        .state('crmman.fin_bud_adjust_list_edit', {
            url: "/fin_bud_adjust_list_edit",
            templateUrl: "views/crmfin/view_fin_bud_adjust_header_edit.html",

            data: {
                pageTitle: '预算调整单查询 '
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
        .state('crmman.fin_fee_apply_header', {
            url: "/fin_fee_apply_header",
            templateUrl: "views/crmfin/view_fin_fee_apply_header.html",

            data: {
                pageTitle: '费用申请单制单 '
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
        .state('crmman.fin_fee_apply_header_edit', {
            url: "/fin_fee_apply_header_edit",
            templateUrl: "views/crmfin/view_fin_fee_apply_header_edit.html",

            data: {
                pageTitle: '费用申请单制单 '
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
       .state('crmman.fin_fee_apply_list', {
            url: "/fin_fee_apply_list",
            templateUrl: "views/crmfin/view_fin_fee_apply_list.html",

            data: {
                pageTitle: '费用申请单查询 '
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
        .state('crmman.fin_fee_apply_list_edit', {
            url: "/fin_fee_apply_list_edit",
            templateUrl: "views/crmfin/view_fin_fee_apply_list_edit.html",

            data: {
                pageTitle: '费用申请单查询 '
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
       .state('crmman.fin_fee_bx_header', {
            url: "/fin_fee_bx_headder",
            templateUrl: "views/crmfin/view_fin_fee_bx_headder.html",

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
        .state('crmman.fin_fee_bx_header_edit', {
            url: "/fin_fee_bx_header_edit",
            templateUrl: "views/crmfin/view_fin_fee_bx_headder_edit.html",

            data: {
                pageTitle: '费用报销单制单 '
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
       .state('crmman.fin_fee_bx_list', {
            url: "/fin_fee_bx_list",
            templateUrl: "views/crmfin/view_fin_fee_bx_list.html",

            data: {
                pageTitle: '费用报销单查询 '
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
       .state('crmman.fin_fee_bx_list_edit', {
            url: "/fin_fee_bx_list_edit",
            templateUrl: "views/crmfin/view_fin_fee_bx_list_edit.html",

            data: {
                pageTitle: '费用报销单查询 '
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
         .state('crmman.fin_bud_list', {
            url: "/fin_bud_list",
            templateUrl: "views/crmfin/view_fin_bud_list.html",

            data: {
                pageTitle: '预算报表查询 '
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
        .state('crmman.finbud', {
            url: "/finbud",
            templateUrl: "views/crmfin/view_fin_bud.html",

            data: {
                pageTitle: '预算报表查询 '
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
        .state('crmman.Fin_GReturn_Header', {
            url: "/Fin_GReturn_Header",
            templateUrl: "views/crmfin/Fin_GReturn_Headeredit.html",

            data: {
                pageTitle: '客户回款录入'
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
        .state('crmman.Fin_GReturn_Headeredit', {
            url: "/Fin_GReturn_Headeredit",
            templateUrl: "views/crmfin/Fin_GReturn_Header.html",

            data: {
                pageTitle: '客户回款录入'
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

        .state('crmman.Drp_Invoice_Apply_Header', {
            url: "/Drp_Invoice_Apply_Header",
            templateUrl: "views/crmdrp/Drp_Invoice_Apply_Headeredit.html",

            data: {
                pageTitle: '客户开票申请'
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

        .state('crmman.Drp_Invoice_Apply_Headeredit', {
            url: "/Drp_Invoice_Apply_Headeredit",
            templateUrl: "views/crmdrp/Drp_Invoice_Apply_Header.html",

            data: {
                pageTitle: '客户开票申请'
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
		
        .state('crmman.Fin_Compensate_list', {
            url: "/Fin_Compensate_list",
            templateUrl: "views/crmfin/Fin_Compensate_list.html",

            data: {
                pageTitle: '补差计算'
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
       .state('crmman.Drp_Cust_Return', {
            url: "/Drp_Cust_Return",
            templateUrl: "views/crmdrp/Drp_Cust_ReturnAmount_header.html",
           
            data: {
                pageTitle: '客户发货余额查询'
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
        .state('crmman.Drp_Item_WareHouse', {
            url: "/Drp_Item_WareHouse",
            templateUrl: "views/crmdrp/Drp_Item_WareHouse_Search_header.html",
           
            data: {
                pageTitle: '产品库存查询'
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

        .state('crmman.Drp_SaleOrder', {
            url: "/Drp_SaleOrder",
            templateUrl: "views/crmdrp/Drp_SaleOrder_Search_header.html",
           
            data: {
                pageTitle: '订单明细查询'
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
		 .state('crmman.fin_greturn_header_line', {
            url: "/fin_greturn_header_line",
            templateUrl: "views/crmfin/fin_greturn_header_line.html",
           
            data: {
                pageTitle: '到款明细查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_greturn_header_line.js']
                        
                    });
                }
            }
        })
        .state('crmman.Drp_OutBill', {
            url: "/Drp_OutBill",
            templateUrl: "views/crmdrp/Drp_OutBill_Search_header.html",
           
            data: {
                pageTitle: '出仓明细查询'
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

        .state('crmman.Drp_SaleRanking_list', {
            url: "/Drp_SaleRanking_list",
            templateUrl: "views/crmdrp/Drp_SaleRanking_list.html",
           
            data: {
                pageTitle: '出仓明细查询'
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
        .state('crmman.fin_cost_accrued_set_header', {
            url: "/fin_cost_accrued_set_header",
            templateUrl: "views/crmfin/Fin_Cost_Accrued_Set_Header.html",
           
            data: {
                pageTitle: '费用计提比例'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_cost_accrued_set_header1.js']
                        
                    });
                }
            }
        })
        .state('crmman.fin_materiel_apply_header', {
            url: "/fin_materiel_apply_header",
            templateUrl: "views/crmfin/Fin_Materiel_Apply_Header.html",
           
            data: {
                pageTitle: '物料申请单'
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
        .state('crmman.fin_materiel_apply_header_edit', {
            url: "/fin_materiel_apply_header_edit",
            templateUrl: "views/crmfin/Fin_Materiel_Apply_Header_Edit.html",
           
            data: {
                pageTitle: '物料申请单编辑'
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
        .state('crmman.outbillheadercl', {
            url: "/outbillheadercl",
            templateUrl: "views/crmdrp/Drp_OutBill_HeaderCL.html",
           
            data: {
                pageTitle: '物料申请单编辑'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmdrp/ctrl_drp_outbill_headercl.js']
                        
                    });
                }
            }
        })
		.state('crmman.fin_dj_materiel_header', {
            url: "/fin_dj_materiel_header",
            templateUrl: "views/finman/fin_dj_materiel_header.html",
           
            data: {
                pageTitle: '物料申请登记'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_fin_dj_materiel_header.js']
                        
                    });
                }
            }
        })
		.state('crmman.drp_project_header', {
            url: "/drp_project_header",
            templateUrl: "views/crmfin/drp_project_header.html",
           
            data: {
                pageTitle: '工程申报'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_drp_project_header.js']
                        
                    });
                }
            }
        })
		.state('crmman.mkt_guider', {
            url: "/mkt_guider",
            templateUrl: "views/crmfin/mkt_guider.html",

            data: {
                pageTitle: '导购员档案'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_mkt_guider.js']

                    });
                }
            }
        })
        .state('crmman.mkt_terminal', {
            url: "/mkt_terminal",
            templateUrl: "views/crmfin/mkt_terminal.html",

            data: {
                pageTitle: '终端档案'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/crmfin/ctrl_mkt_terminal.js']

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
            $state.go("crmman.main");
        }
    });
