/**
 * INSPINIA - Responsive Admin Theme

 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $$qProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    
//	$urlRouterProvider.otherwise("/crmman/home");
	if(window.userbean.userauth.disable_dashboard){
		$urlRouterProvider.otherwise("/crmman/work");
	}else if(window.userbean.userauth.default_desktop){
		$urlRouterProvider.otherwise("/crmman/home");
	}else {
		$urlRouterProvider.otherwise("/crmman/work");
	}

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
                    },{
                    	files: ['js/plugins/RaphaelJS/chinamapPath.js']
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
       /** .state('crmman.callnotify', {
        	url: "/callnotify",
        	templateUrl: "views/callnotify.html",
        	data: { pageTitle: '服务提醒' },
        	resolve: {
        		load: function($templateCache, $ocLazyLoad, $q, $http) {
        			lazyDeferred = $q.defer();
        			return $ocLazyLoad.load([{
        				name: 'inspinia',
        				files: ['js/controllers/mywork/ctrl_callnotify.js']
        			}]);
        		}
        	}
        })   */
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
			
		.state('crmman.BaseA_0_1_E', {
            url: "/BaseA_0_1_E",
            templateUrl: "views/common/base_search.jsp?obj=base_area",
            data: {
                pageTitle: '国家'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_area.js']
                    });
                }
            }
        })
		.state('crmman.BaseA_0_2_E', {
            url: "/BaseA_0_2_E",
            templateUrl: "views/baseman/Base_AreaEdit.html",
            data: {
                pageTitle: '国家编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_areaEdit.js']
                    });
                }
            }
        })

        .state('crmman.base_notice_header', {
            url: "/base_notice_header",
            templateUrl: "views/common/base_search.jsp?obj=base_notice_header",
            data: {
                pageTitle: '公告维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_notice_header.js']
                    });
                }
            }
        })
        .state('crmman.base_notice_headerEdit', {
            url: "/base_notice_headerEdit",
            templateUrl: "views/baseman/base_notice_headerEdit.html",
            data: {
                pageTitle: '公告维护详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_notice_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.base_remind_header', {
            url: "/base_remind_header",
            templateUrl: "views/common/base_search.jsp?obj=base_remind_header",
            data: {
                pageTitle: '工作提醒维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_remind_header.js']
                    });
                }
            }
        })
        .state('crmman.base_remind_headerEdit', {
            url: "/base_remind_headerEdit",
            templateUrl: "views/baseman/base_remind_headerEdit.html",
            data: {
                pageTitle: '工作提醒维护详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_remind_headerEdit.js']
                    });
                }
            }
        })

        .state('crmman.base_currency', {
            url: "/base_currency",
            templateUrl: "views/common/base_search.jsp?obj=base_currency",
            data: {
                pageTitle: '币种'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_currency.js']
                    });
                }
            }
        })

        .state('crmman.base_currencyEdit', {
            url: "/base_currencyEdit",
            templateUrl: "views/baseman/base_currencyEdit.html",
            data: {
                pageTitle: '币种编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_currencyEdit.js']
                    });
                }
            }
        })

        .state('crmman.seaport', {
            url: "/seaport",
            templateUrl: "views/common/base_search.jsp?obj=seaport_search",
            data: {
                pageTitle: '港口'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/seaport.js']
                    });
                }
            }
        })

        .state('crmman.seaportEdit', {
            url: "/seaportEdit",
            templateUrl: "views/baseman/seaportEdit.html",
            data: {
                pageTitle: '港口编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/seaportEdit.js']
                    });
                }
            }
        })
       /*********************************关键物料规则维护*****************************/
        .state('crmman.base_critical_material', {
              url: "/base_critical_material",
              templateUrl: "views/common/base_search.jsp?obj=base_critical_material",
              data: {
                  pageTitle: '关键物料规则维护'
              },
              resolve: {
                  load: function ($templateCache, $ocLazyLoad, $q, $http) {
                      lazyDeferred = $q.defer();

                      return $ocLazyLoad.load({
                          name: 'inspinia',
                          files: ['js/controllers/baseman/base_critical_material.js']
                      });
                  }
              }
          })

          .state('crmman.base_critical_materialEdit', {
              url: "/base_critical_materialEdit",
              templateUrl: "views/baseman/base_critical_materialEdit.html",
              data: {
                  pageTitle: '关键物料规则维护'
              },
              resolve: {
                  load: function ($templateCache, $ocLazyLoad, $q, $http) {
                      lazyDeferred = $q.defer();

                      return $ocLazyLoad.load({
                          name: 'inspinia',
                          files: ['js/controllers/baseman/base_critical_materialEdit.js']
                      });
                  }
              }
          })

        .state('crmman.exchange_rate', {
            url: "/exchange_rate",
            templateUrl: "views/common/base_search.jsp?obj=exchange_rate",
            data: {
                pageTitle: '汇率设置'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/exchange_rate.js']
                    });
                }
            }
        })

        .state('crmman.exchange_rateEdit', {
            url: "/exchange_rateEdit",
            templateUrl: "views/baseman/exchange_rateEdit.html",
            data: {
                pageTitle: '汇率设置详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/exchange_rateEdit.js']
                    });
                }
            }
        })

        .state('crmman.bank', {
            url: "/bank",
            templateUrl: "views/common/base_search.jsp?obj=bank",
            data: {
                pageTitle: '银行信息'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/bank.js']
                    });
                }
            }
        })
        .state('crmman.bankEdit', {
            url: "/bankEdit",
            templateUrl: "views/baseman/bankEdit.html",
            data: {
                pageTitle: '银行信息详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/bankEdit.js']
                    });
                }
            }
        })

        .state('crmman.base_uom', {
            url: "/base_uom",
            templateUrl: "views/common/base_search.jsp?obj=base_uom",
            data: {
                pageTitle: '计量单位'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_uom.js']
                    });
                }
            }
        })

        .state('crmman.base_uomEdit', {
            url: "/base_uomEdit",
            templateUrl: "views/baseman/base_uomEdit.html",
            data: {
                pageTitle: '计量单位'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_uomEdit.js']
                    });
                }
            }
        })

        .state('crmman.edi_bankinfo', {
            url: "/edi_bankinfo",
            templateUrl: "views/common/base_search.jsp?obj=edi_bankinfo",
            data: {
                pageTitle: '银行档案'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/edi_bankinfo.js']
                    });
                }
            }
        })
        .state('crmman.edi_bankinfoEdit', {
            url: "/edi_bankinfoEdit",
            templateUrl: "views/baseman/edi_bankinfoEdit.html",
            data: {
                pageTitle: '银行档案详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/edi_bankinfoEdit.js']
                    });
                }
            }
        })
	.state('crmman.edi_lcquotaapplyinfoEdit', {
            url: "/edi_lcquotaapplyinfoEdit",
            templateUrl: "views/billman/edi_lcquotaapplyinfoEdit.html",
            data: {
                pageTitle: 'LC限额申请制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/edi_lcquotaapplyinfoEdit.js']
                    });
                }
            }
        })
        .state('crmman.edi_lcquotaapplyinfo', {
            url: "/edi_lcquotaapplyinfo",
            templateUrl: "views/billman/edi_lcquotaapplyinfo.html",
            data: {
                pageTitle: 'LC限额已使用金额修改'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/edi_lcquotaapplyinfo.js']
                    });
                }
            }
        })
	.state('crmman.fin_tddf_headerEdit', {
            url: "/fin_tddf_headerEdit",
            templateUrl: "views/finman/fin_tddf_headerEdit.html",
            data: {
                pageTitle: '提单放单制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_tddf_headerEdit.js']
                    });
                }
            }
        })
		.state('crmman.sale_ship_out_header', {
            url: "/sale_ship_out_header",
            templateUrl: "views/saleman/sale_ship_out_header.html",
            data: {
                pageTitle: '佣金预提报表查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_out_header.js']
                    });
                }
            }
        })
			.state('crmman.fin_funds_header_list', {
            url: "/fin_funds_header_list",
            templateUrl: "views/finman/fin_funds_header_list.html",
            data: {
                pageTitle: '外销回款引入ERR'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_header_list.js']
                    });
                }
            }
        })
		.state('crmman.fin_funds_headerSearch', {
            url: "/fin_funds_headerSearch",
            templateUrl: "views/finman/fin_funds_headerSearch.html",
            data: {
                pageTitle: '到款引入资金系统'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_headerSearch.js']
                    });
                }
            }
        })
		.state('crmman.fin_funds_zj', {
            url: "/fin_funds_zj",
            templateUrl: "views/finman/fin_funds_zj.html",
            data: {
                pageTitle: '同步资金系统到款单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_zj.js']
                    });
                }
            }
        })
		.state('crmman.fin_funds_bill_listfo', {
            url: "/fin_funds_bill_listfo",
            templateUrl: "views/finman/fin_funds_bill_listfo.html",
            data: {
                pageTitle: '收汇引信保通处理结果'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_bill_listfo.js']
                    });
                }
            }
        })
        .state('crmman.po_warehouse', {
            url: "/po_warehouse",
            templateUrl: "views/common/base_search.jsp?obj=po_warehouse",
            data: {
                pageTitle: '外购件仓库资料查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/po_warehouse.js']
                    });
                }
            }
        })

        .state('crmman.po_warehouseEdit', {
            url: "/po_warehouseEdit",
            templateUrl: "views/baseman/po_warehouseEdit.html",
            data: {
                pageTitle: '仓库资料编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/po_warehouseEdit.js']
                    });
                }
            }
        })
        .state('crmman.po_item', {
            url: "/po_item",
            templateUrl: "views/common/base_search.jsp?obj=po_item",
            data: {
                pageTitle: '外购件物料查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/po_item.js']
                    });
                }
            }
        })

        .state('crmman.po_itemEdit', {
            url: "/po_itemEdit",
            templateUrl: "views/baseman/po_itemEdit.html",
            data: {
                pageTitle: '外购件物料维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/po_itemEdit.js']
                    });
                }
            }
        })
        .state('crmman.po_org_budget', {
            url: "/po_org_budget",
            templateUrl: "views/common/base_search.jsp?obj=po_org_budget",
            data: {
                pageTitle: '统一采购预算'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/po_org_budget.js']
                    });
                }
            }
        })

        .state('crmman.po_org_budgetEdit', {
            url: "/po_org_budgetEdit",
            templateUrl: "views/baseman/po_org_budgetEdit.html",
            data: {
                pageTitle: '统一采购维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/po_org_budgetEdit.js']
                    });
                }
            }
        })
		.state('crmman.fin_funds_bill_list', {
            url: "/fin_funds_bill_list",
            templateUrl: "views/finman/fin_funds_bill_list.html",
            data: {
                pageTitle: '收汇引信保通'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_bill_list.js']
                    });
                }
            }
        })
		.state('crmman.sale_ship_sap_headerEdit', {
            url: "/sale_ship_sap_headerEdit",
            templateUrl: "views/saleman/sale_ship_sap_headerEdit.html",
            data: {
                pageTitle: '手工录入发货单对应的90凭证'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_sap_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.edi_buyerinfo_rlEdit', {
            url: "/edi_buyerinfo_lcEdit",
            templateUrl: "views/billman/edi_buyerinfo_rlEdit.html",
            data: {
                pageTitle: '买方档案客户认领'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/edi_buyerinfo_rlEdit.js']
                    });
                }
            }
        })
			.state('crmman.bill_allinv_headerEdit', {
            url: "/bill_allinv_headerEdit",
            templateUrl: "views/billman/bill_allinv_headerEdit.html",
            data: {
                pageTitle: '费用发票批量制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/bill_allinv_headerEdit.js']
                    });
                }
            }
        })
		.state('crmman.edi_nolcquotaapplyinfoEdit', {
            url: "/edi_nolcquotaapplyinfoEdit",
            templateUrl: "views/billman/edi_nolcquotaapplyinfoEdit.html",
            data: {
                pageTitle: '非LC限额申请制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/edi_nolcquotaapplyinfoEdit.js']
                    });
                }
            }
        })
        .state('crmman.payment_type', {
            url: "/payment_type",
            templateUrl: "views/common/base_search.jsp?obj=payment_type",
            data: {
                pageTitle: '付款方式'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/payment_type.js']
                    });
                }
            }
        })
        .state('crmman.payment_typeEdit', {
            url: "/payment_typeEdit",
            templateUrl: "views/baseman/payment_typeEdit.html",
            data: {
                pageTitle: '付款方式'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/payment_typeEdit.js']
                    });
                }
            }
        })
        .state('crmman.sale_order_fee', {
            url: "/sale_order_fee",
            templateUrl: "views/common/base_search.jsp?obj=sale_order_fee",
            data: {
                pageTitle: '费用项目设置'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/sale_order_fee.js']
                    });
                }
            }
        })
        .state('crmman.sale_order_feeEdit', {
            url: "/sale_order_feeEdit",
            templateUrl: "views/baseman/sale_order_feeEdit.html",
            data: {
                pageTitle: '费用项目设置'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/sale_order_feeEdit.js']
                    });
                }
            }
        })

        .state('crmman.base_print_templet', {
            url: "/base_print_templet",
            templateUrl: "views/common/base_search.jsp?obj=base_print_templet",
            data: {
                pageTitle: '打印模板'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_print_templet.js']
                    });
                }
            }
        })
        .state('crmman.base_print_templetEdit', {
            url: "/base_print_templetEdit",
            templateUrl: "views/baseman/base_print_templetEdit.html",
            data: {
                pageTitle: '打印模板'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_print_templetEdit.js']
                    });
                }
            }
        })
        .state('crmman.base_shipping_user', {
            url: "/base_shipping_user",
            templateUrl: "views/common/base_search.jsp?obj=base_shipping_user",
            data: {
                pageTitle: '船务单证人员维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_shipping_user.js']
                    });
                }
            }
        })
        .state('crmman.base_type_sx', {
            url: "/base_type_sx",
            templateUrl: "views/common/base_search.jsp?obj=base_type_sx",
            data: {
                pageTitle: '参数维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_type_sx.js']
                    });
                }
            }
        })

        .state('crmman.base_type_sxEdit', {
            url: "/base_type_sxEdit",
            templateUrl: "views/baseman/base_type_sxEdit.html",
            data: {
                pageTitle: '参数维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_type_sxEdit.js']
                    });
                }
            }
        })

        .state('crmman.base_contract', {
            url: "/base_contract",
            templateUrl: "views/common/base_search.jsp?obj=base_contract",
            data: {
                pageTitle: '部门成本中心维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_contract.js']
                    });
                }
            }
        })

        .state('crmman.base_contractEdit', {
            url: "/base_contractEdit",
            templateUrl: "views/baseman/base_contractEdit.html",
            data: {
                pageTitle: '部门成本中心维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_contractEdit.js']
                    });
                }
            }
        })


        .state('crmman.base_tech_para_conf', {
            url: "/base_tech_para_conf",
            templateUrl: "views/common/base_search.jsp?obj=base_tech_para_conf",
            data: {
                pageTitle: '技术参数维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_tech_para_conf.js']
                    });
                }
            }
        })

        .state('crmman.base_tech_para_confEdit', {
            url: "/base_tech_para_confEdit",
            templateUrl: "views/baseman/base_tech_para_confEdit.html",
            data: {
                pageTitle: '技术参数维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_tech_para_confEdit.js']
                    });
                }
            }
        })

        /*******************************船务信息维护************************************/
        .state('crmman.base_sale_org', {
            url: "/base_sale_org",
            templateUrl: "views/common/base_search.jsp?obj=base_sale_org",
            data: {
                pageTitle: '空调销售组织'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_sale_org.js']
                    });
                }
            }
        })

        .state('crmman.base_sale_orgEdit', {
            url: "/base_sale_orgEdit",
            templateUrl: "views/baseman/base_sale_orgEdit.html",
            data: {
                pageTitle: '空调销售组织编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_sale_orgEdit.js']
                    });
                }
            }
        })

        .state('crmman.ship_box_fee', {
            url: "/ship_box_fee",
            templateUrl: "views/common/base_search.jsp?obj=ship_box_fee",
            data: {
                pageTitle: '船务费用对照表'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ship_box_fee.js']
                    });
                }
            }
        })

        .state('crmman.ship_box_feeEdit', {
            url: "/ship_box_feeEdit",
            templateUrl: "views/baseman/ship_box_feeEdit.html",
            data: {
                pageTitle: '船务费用对照表编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ship_box_feeEdit.js']
                    });
                }
            }
        })
        .state('crmman.ocean_freight_set', {
            url: "/ocean_freight_set",
            templateUrl: "views/common/base_search.jsp?obj=ocean_freight_set",
            data: {
                pageTitle: '海运费标准设置'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ocean_freight_set.js']
                    });
                }
            }
        })

        .state('crmman.ocean_freight_setEdit', {
            url: "/ocean_freight_setEdit",
            templateUrl: "views/baseman/ocean_freight_setEdit.html",
            data: {
                pageTitle: '海运费标准设置编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ocean_freight_setEdit.js']
                    });
                }
            }
        })
        .state('crmman.price_type', {
            url: "/price_type",
            templateUrl: "views/common/base_search.jsp?obj=price_type",
            data: {
                pageTitle: '价格条款维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/price_type.js']
                    });
                }
            }
        })
        .state('crmman.price_typeEdit', {
            url: "/price_typeEdit",
            templateUrl: "views/baseman/price_typeEdit.html",
            data: {
                pageTitle: '价格条款维护编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/price_typeEdit.js']
                    });
                }
            }
        })

        .state('crmman.supplier', {
            url: "/supplier",
            templateUrl: "views/common/base_search.jsp?obj=supplier",
            data: {
                pageTitle: '船公司及货代公司'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/supplier.js']
                    });
                }
            }
        })

        .state('crmman.supplierEdit', {
            url: "/supplierEdit",
            templateUrl: "views/baseman/supplierEdit.html",
            data: {
                pageTitle: '船公司及货代公司编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/supplierEdit.js']
                    });
                }
            }
        })
        .state('crmman.base_box_rule', {
            url: "/base_box_rule",
            templateUrl: "views/common/base_search.jsp?obj=base_box_rule",
            data: {
                pageTitle: '柜型最大值维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_box_rule.js']
                    });
                }
            }
        })

        .state('crmman.base_box_ruleEdit', {
            url: "/base_box_ruleEdit",
            templateUrl: "views/baseman/base_box_ruleEdit.html",
            data: {
                pageTitle: '柜型最大值维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_box_ruleEdit.js']
                    });
                }
            }
        })

        .state('crmman.customer_brand_grant', {
            url: "/customer_brand_grant",
            templateUrl: "views/common/base_search.jsp?obj=customer_brand_grant",
            data: {
                pageTitle: '客户品牌授权'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/customer_brand_grant.js']
                    });
                }
            }
        })
        .state('crmman.customer_brand_grantEdit', {
            url: "/customer_brand_grantEdit",
            templateUrl: "views/baseman/customer_brand_grantEdit.html",
            data: {
                pageTitle: '客户品牌授权制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/customer_brand_grantEdit.js']
                    });
                }
            }
        })


        /*******************************文档发布************************************/
        .state('crmman.base_pagedoc_header', {
            url: "/base_pagedoc_header",
            templateUrl: "views/common/base_search.jsp?obj=base_pagedoc_header",
            data: {
                pageTitle: '首页文档维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_pagedoc_header.js']
                    });
                }
            }
        })

        .state('crmman.base_pagedoc_headerEdit', {
            url: "/base_pagedoc_headerEdit",
            templateUrl: "views/baseman/base_pagedoc_headerEdit.html",
            data: {
                pageTitle: '首页文档维护详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_pagedoc_headerEdit.js']
                    });
                }
            }
        })

        .state('crmman.base_shipping_userEdit', {
            url: "/base_shipping_userEdit",
            templateUrl: "views/baseman/base_shipping_userEdit.html",
            data: {
                pageTitle: '船务单证人员维护编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_shipping_userEdit.js']
                    });
                }
            }
        })

        .state('crmman.ProItemHeaderDetail', {
            url: "/ProItemHeaderDetail",
            templateUrl: "views/proman/ProItemHeaderDetail.html",
            data: {
                pageTitle: '标准机型详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/proman/ProItemHeaderDetail.js']
                    });
                }
            }

        })
        .state('crmman.customer_apply_header', {
            url: "/customer_apply_header",
            templateUrl: "views/common/base_search.jsp?obj=cust_search",
            data: {
                pageTitle: '客户资料申请'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/customer_apply_header.js']
                    });
                }
            }
        })
        .state('crmman.customer_apply_headerEdit', {
            url: "/customer_apply_headerEdit",
            templateUrl: "views/baseman/customer_apply_headerEdit.html",
            data: {
                pageTitle: '客户资料编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/customer_apply_headerEdit.js']
                    });
                }
            }
        })
		
		.state('crmman.customer', {
            url: "/customer",
            templateUrl: "views/common/base_search.jsp?obj=customer",
            data: {
                pageTitle: '客户资料'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/customer.js']
                    });
                }
            }
        })
		
		.state('crmman.customerEdit', {
            url: "/customerEdit",
            templateUrl: "views/baseman/customerEdit.html",
            data: {
                pageTitle: '客户资料编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/customerEdit.js']
                    });
                }
            }
        })
		 //------------------------------产品管理模块---------------------------------------
        .state('crmman.pro_new_products', {
            url: "/pro_new_products",
            templateUrl: "views/common/base_search.jsp?obj=pro_new_products",
            data: {
                pageTitle: '机型新品维护查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/proman/pro_new_products.js']
                    });
                }
            }
        })
        .state('crmman.pro_new_productsEdit', {
            url: "/pro_new_productsEdit",
            templateUrl: "views/proman/pro_new_productsEdit.html",
            data: {
                pageTitle: '机型新品维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/proman/pro_new_productsEdit.js']
                    });
                }
            }
        })

        .state('crmman.pro_item_header', {
            url: "/pro_item_header",
            templateUrl: "views/common/base_search.jsp?obj=pro_item_header",
            data: {
                pageTitle: '标准机型维护查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/proman/pro_item_header.js']
                    });
                }
            }
        })
         .state('crmman.pro_item_headerEdit', {
             url: "/pro_item_headerEdit",
             templateUrl: "views/proman/pro_item_headerEdit.html",
             data: {
                 pageTitle: '标准机型维护'
             },
             resolve: {
                 load: function ($templateCache, $ocLazyLoad, $q, $http) {
                     lazyDeferred = $q.defer();
                     return $ocLazyLoad.load({
                         name: 'inspinia',
                         files: ['js/controllers/proman/pro_item_headerEdit.js']
                     });
                 }
             }
         })
        .state('crmman.sale_spectrum', {
            url: "/sale_spectrum",
            templateUrl: "views/common/base_search.jsp?obj=sale_spectrum",
            data: {
                pageTitle: '销售型谱维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/proman/sale_spectrum.js']
                    });
                }
            }
        })
       .state('crmman.sale_spectrumEdit', {
            url: "/sale_spectrumEdit",
            templateUrl: "views/proman/sale_spectrumEdit.html",
            data: {
                pageTitle: '销售型谱维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/proman/sale_spectrumEdit.js']
                    });
                }
            }
        })

        .state('crmman.erpitem', {
            url: "/erpitem",
            templateUrl: "views/proman/erpitem.html",
            data: {
                pageTitle: '标准机型同步'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/proman/erpitem.js']
                    });
                }
            }
        })
		 //------------------------------产品管理模块-------------------------------------------
		 //------------------------------产品管理模块---------------------------------------
        //------------------------------单证管理-------------------------------------------
        .state('crmman.fin_lc_bill', {
            url: "/fin_lc_bill",
            templateUrl: "views/common/base_search.jsp?obj=fin_lc_bill",
            data: {
                pageTitle: '信用证录入查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/fin_lc_bill.js']
                    });
                }
            }
        })
        .state('crmman.fin_lc_billEdit', {
            url: "/fin_lc_billEdit",
            templateUrl: "views/billman/fin_lc_billEdit.html",
            data: {
                pageTitle: '信用证录入编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/fin_lc_billEdit.js']
                    });
                }
            }
        })
        .state('crmman.fin_lc_bill_fh', {
            url: "/fin_lc_bill_fh",
            templateUrl: "views/common/base_search.jsp?obj=fin_lc_bill_fh",
            data: {
                pageTitle: '信用证不再发货登记'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/fin_lc_bill_fh.js']
                    });
                }
            }
        })
        .state('crmman.fin_lc_bill_fhEdit', {
            url: "/fin_lc_bill_fhEdit",
            templateUrl: "views/billman/fin_lc_bill_fhEdit.html",
            data: {
                pageTitle: '信用证不再发货登记'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/fin_lc_bill_fhEdit.js']
                    });
                }
            }
        })
        .state('crmman.fin_lc_allot_header', {
            url: "/fin_lc_allot_header",
            templateUrl: "views/common/base_search.jsp?obj=fin_lc_allot_header",
            data: {
                pageTitle: '信用证用途分配查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/fin_lc_allot_header.js']
                    });
                }
            }
        })
        .state('crmman.fin_lc_allot_headerEdit', {
            url: "/fin_lc_allot_headerEdit",
            templateUrl: "views/billman/fin_lc_allot_headerEdit.html",
            data: {
                pageTitle: '信用证用途分配编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/fin_lc_allot_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.bill_invoice_header', {
            url: "/bill_invoice_header",
            templateUrl: "views/common/base_search.jsp?obj=bill_invoice_header",
            data: {
                pageTitle: '商业发票查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/bill_invoice_header.js']
                    });
                }
            }
        })
        .state('crmman.bill_invoice_headerEdit', {
            url: "/bill_invoice_headerEdit",
            templateUrl: "views/billman/bill_invoice_headerEdit.html",
            data: {
                pageTitle: '商业发票制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/bill_invoice_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.bill_invoice_header_redEdit', {
            url: "/bill_invoice_header_redEdit",
            templateUrl: "views/billman/bill_invoice_header_redEdit.html",
            data: {
                pageTitle: '商业发票红冲'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/bill_invoice_header_redEdit.js']
                    });
                }
            }
        })
        .state('crmman.bill_invoice_header_red', {
            url: "/bill_invoice_header_red",
            templateUrl: "views/common/base_search.jsp?obj=bill_invoice_header_red",
            data: {
                pageTitle: '商业发票红冲查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/bill_invoice_header_red.js']
                    });
                }
            }
        })
        .state('crmman.bill_invoice_split_headerEdit', {
            url: "/bill_invoice_split_headerEdit",
            templateUrl: "views/billman/bill_invoice_split_headerEdit.html",
            data: {
                pageTitle: '商业发票发票拆分/合并制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/bill_invoice_split_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.bill_invoice_split_header', {
            url: "/bill_invoice_split_header",
            templateUrl: "views/common/base_search.jsp?obj=bill_invoice_split_header",
            data: {
                pageTitle: '商业发票拆分/合并查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/bill_invoice_split_header.js']
                    });
                }
            }
        })
		.state('crmman.bill_invoice_headerList', {
            url: "/bill_invoice_headerList",
            templateUrl: "views/billman/bill_invoice_headerList.html",
            data: {
                pageTitle: '商业发票引入ERP'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/bill_invoice_headerList.js']
                    });
                }
            }
        })
        .state('crmman.bill_invoice_header_fy', {
            url: "/bill_invoice_header_fy",
            templateUrl: "views/common/base_search.jsp?obj=bill_invoice_header_fy",
            data: {
                pageTitle: '费用发票'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/bill_invoice_header_fy.js']
                    });
                }
            }
        })
        .state('crmman.bill_invoice_header_fyEdit', {
            url: "/bill_invoice_header_fyEdit",
            templateUrl: "views/billman/bill_invoice_header_fyEdit.html",
            data: {
                pageTitle: '费用发票制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/bill_invoice_header_fyEdit.js']
                    });
                }
            }
        })
    //----------------------------开票---------------------------------------------
        .state('crmman.bill_invoice_header_kp', {
             url: "/bill_invoice_header_kp",
             templateUrl: "views/billman/bill_invoice_header_kp.html",
             data: {
                 pageTitle: '公司间开票'
             },
             resolve: {
                 load: function ($templateCache, $ocLazyLoad, $q, $http) {
                     lazyDeferred = $q.defer();
                     return $ocLazyLoad.load({
                         name: 'inspinia',
                         files: ['js/controllers/billman/bill_invoice_header_kp.js']
                     });
                 }
             }
        })
    //----------------------------商业发货明细录入---------------------------------------------
          .state('crmman.bill_deliver_header', {
              url: "/bill_deliver_header",
              templateUrl: "views/common/base_search.jsp?obj=bill_deliver_header",
              data: {
                  pageTitle: '商业发货明细录入查询'
              },
              resolve: {
                  load: function ($templateCache, $ocLazyLoad, $q, $http) {
                      lazyDeferred = $q.defer();

                      return $ocLazyLoad.load({
                          name: 'inspinia',
                          files: ['js/controllers/billman/bill_deliver_header.js']
                      });
                  }
              }
          })
        .state('crmman.bill_deliver_headerEdit', {
             url: "/bill_deliver_headerEdit",
             templateUrl: "views/billman/bill_deliver_headerEdit.html",
             data: {
                 pageTitle: '商业发货明细录入'
             },
             resolve: {
                 load: function ($templateCache, $ocLazyLoad, $q, $http) {
                     lazyDeferred = $q.defer();
                     return $ocLazyLoad.load({
                         name: 'inspinia',
                         files: ['js/controllers/billman/bill_deliver_headerEdit.js']
                     });
                 }
             }
        })
        //----------------------------交单处理---------------------------------------------
        .state('crmman.bill_invoice_header_jd', {
              url: "/bill_invoice_header_jd",
              templateUrl: "views/common/base_search.jsp?obj=bill_invoice_header_jd",
              data: {
                  pageTitle: '商业发票交单处理查询'
              },
              resolve: {
                  load: function ($templateCache, $ocLazyLoad, $q, $http) {
                      lazyDeferred = $q.defer();
                      return $ocLazyLoad.load({
                          name: 'inspinia',
                          files: ['js/controllers/billman/bill_invoice_header_jd.js']
                      });
                  }
              }
        })
        .state('crmman.bill_invoice_header_jdEdit', {
             url: "/bill_invoice_header_jdEdit",
             templateUrl: "views/billman/bill_invoice_header_jdEdit.html",
             data: {
                 pageTitle: '商业发票交单处理'
             },
             resolve: {
                 load: function ($templateCache, $ocLazyLoad, $q, $http) {
                     lazyDeferred = $q.defer();
                     return $ocLazyLoad.load({
                         name: 'inspinia',
                         files: ['js/controllers/billman/bill_invoice_header_jdEdit.js']
                     });
                 }
             }
        })

        /*******************************销售模块************************************/
        .state('crmman.sale_comminspec_header', {
            url: "/sale_comminspec_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_comminspec_header",
            data: {
                pageTitle: '商检单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_comminspec_header.js']
                    });
                }
            }
        })
        .state('crmman.sale_comminspec_headerEdit', {
            url: "/sale_comminspec_headerEdit",
            templateUrl: "views/saleman/sale_comminspec_headerEdit.html",
            data: {
                pageTitle: '商检单制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_comminspec_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.sale_guide_priceapply_cancel', {
            url: "/sale_guide_priceapply_cancel",
            templateUrl: "views/saleman/sale_guide_priceapply_cancel.html",
            data: {
                pageTitle: '指导价作废'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_guide_priceapply_cancel.js']
                    });
                }
            }
        })
        .state('crmman.sale_guide_priceapply_header', {
            url: "/sale_guide_priceapply_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_guide_priceapply_header",
            data: {
                pageTitle: '指导价格维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_guide_priceapply_header.js']
                    });
                }
            }
        })
        .state('crmman.sale_guide_priceapply_headerEdit', {
            url: "/sale_guide_priceapply_headerEdit",
            templateUrl: "views/saleman/sale_guide_priceapply_headerEdit.html",
            data: {
                pageTitle: '指导价维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_guide_priceapply_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.sale_std_priceapply_cancel', {
            url: "/sale_std_priceapply_cancel",
            templateUrl: "views/saleman/sale_std_priceapply_cancel.html",
            data: {
                pageTitle: '工厂标准结算价作废'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_std_priceapply_cancel.js']
                    });
                }
            }
        })
        .state('crmman.sale_std_priceapply_header', {
            url: "/sale_std_priceapply_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_std_priceapply_header",
            data: {
                pageTitle: '工厂标准结算价维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_std_priceapply_header.js']
                    });
                }
            }
        })
        .state('crmman.sale_std_priceapply_headerEdit', {
            url: "/sale_std_priceapply_headerEdit",
            templateUrl: "views/saleman/sale_std_priceapply_headerEdit.html",
            data: {
                pageTitle: '工厂标准结算价维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_std_priceapply_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.sale_pi_priceapply_cancel', {
            url: "/sale_pi_priceapply_cancel",
            templateUrl: "views/saleman/sale_pi_priceapply_cancel.html",
            data: {
                pageTitle: '产品结算价作废'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_pi_priceapply_cancel.js']
                    });
                }
            }
        })
        .state('crmman.sale_pi_priceapply_header', {
            url: "/sale_pi_priceapply_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_pi_priceapply_header",
            data: {
                pageTitle: '产品结算价维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_pi_priceapply_header.js']
                    });
                }
            }
        })
        .state('crmman.sale_pi_priceapply_headerEdit', {
            url: "/sale_pi_priceapply_headerEdit",
            templateUrl: "views/saleman/sale_pi_priceapply_headerEdit.html",
            data: {
                pageTitle: '产品结算价维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_pi_priceapply_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.sale_box_maintain', {
            url: "/sale_box_maintain",
            templateUrl: "views/common/base_search.jsp?obj=sale_box_maintain",
            data: {
                pageTitle: '箱型查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_box_maintain.js']
                    });
                }
            }
        })
        .state('crmman.sale_allprice_synch', {
            url: "/sale_allprice_synch",
            templateUrl: "views/saleman/sale_allprice_synch.html",
            data: {
                pageTitle: '产品价格同步'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_allprice_synch.js']
                    });
                }
            }
        })
        .state('crmman.sale_box_maintainEdit', {
            url: "/sale_box_maintainEdit",
            templateUrl: "views/saleman/sale_box_maintainEdit.html",
            data: {
                pageTitle: '箱型维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_box_maintainEdit.js']
                    });
                }
            }
        })
        .state('crmman.sale_cust_box_header', {
            url: "/sale_cust_box_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_cust_box_header",
            data: {
                pageTitle: '散件机型装载量查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_cust_box_header.js']
                    });
                }
            }
        })
        .state('crmman.sale_cust_box_headerEdit', {
            url: "/sale_cust_box_headerEdit",
            templateUrl: "views/saleman/sale_cust_box_headerEdit.html",
            data: {
                pageTitle: '散件机型装载量维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_cust_box_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.sale_item_maintain', {
            url: "/sale_item_maintain",
            templateUrl: "views/common/base_search.jsp?obj=sale_item_maintain",
            data: {
                pageTitle: '物料最小包装量查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_item_maintain.js']
                    });
                }
            }
        })
        .state('crmman.sale_item_maintainEdit', {
            url: "/sale_item_maintainEdit",
            templateUrl: "views/saleman/sale_item_maintainEdit.html",
            data: {
                pageTitle: '物料最小包装量维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_item_maintainEdit.js']
                    });
                }
            }
        })
        .state('crmman.sale_pack_type', {
            url: "/sale_pack_type",
            templateUrl: "views/common/base_search.jsp?obj=sale_pack_type",
            data: {
                pageTitle: '包装方案类型查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_pack_type.js']
                    });
                }
            }
        })
        .state('crmman.sale_pack_typeEdit', {
            url: "/sale_pack_typeEdit",
            templateUrl: "views/saleman/sale_pack_typeEdit.html",
            data: {
                pageTitle: '包装方案类型维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_pack_typeEdit.js']
                    });
                }
            }
        })

        .state('crmman.sale_package_header', {
            url: "/sale_package_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_package_header",
            data: {
                pageTitle: '包装方案查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_package_header.js']
                    });
                }
            }
        })
        .state('crmman.sale_package_headerEdit', {
            url: "/sale_package_headerEdit",
            templateUrl: "views/saleman/sale_package_headerEdit.html",
            data: {
                pageTitle: '包装方案维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_package_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.base_make_factor', {
            url: "/base_make_factor",
            templateUrl: "views/common/base_search.jsp?obj=base_make_factor",
            data: {
                pageTitle: '打散大类查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/base_make_factor.js']
                    });
                }
            }
        })
        .state('crmman.base_make_factorEdit', {
            url: "/base_make_factorEdit",
            templateUrl: "views/saleman/base_make_factorEdit.html",
            data: {
                pageTitle: '打散大类维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/base_make_factorEdit.js']
                    });
                }
            }
        })
		.state('crmman.app', {
            url: "/app",
            templateUrl: "views/common/base_search.jsp?obj=sale_pi_header",
            data: {
                pageTitle: '形式发票查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_pi_header.js']
                    });
                }
            }
        })
	        .state('crmman.sale_pi_header', {
            url: "/sale_pi_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_pi_header",
            data: {
                pageTitle: '形式发票查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_pi_header.js']
                    });
                }
            }
        })

        .state('crmman.sale_pi_headerEdit', {
            url: "/sale_pi_headerEdit",
            templateUrl: "views/saleman/sale_pi_headerEdit.html",
            data: {
                pageTitle: '形式发票编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_pi_headerEdit.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_pi_break_package_headerEdit', {
            url: "/sale_pi_break_package_headerEdit",
            templateUrl: "views/saleman/sale_pi_break_package_headerEdit.html",
            data: {
                pageTitle: '包装方案编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_pi_break_package_headerEdit.js']
                    });
                }
            }
        })
		.state('crmman.sale_prod_header', {
            url: "/sale_prod_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_prod_header",
            data: {
                pageTitle: '生产通知查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_prod_header.js']
                    });
                }
            }
        })

        .state('crmman.sale_prod_headerEdit', {
            url: "/sale_prod_headerEdit",
            templateUrl: "views/saleman/sale_prod_headerEdit.html",
            data: {
                pageTitle: '生产通知编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_prod_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.sale_ship_warn_header', {
            url: "/sale_ship_warn_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_ship_warn_header",
            data: {
                pageTitle: '出货预告管理'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_warn_header.js']
                    });
                }
            }

        })
        .state('crmman.sale_ship_warn_headerEdit', {
            url: "/sale_ship_warn_headerEdit",
            templateUrl: "views/saleman/sale_ship_warn_headerEdit.html",
            data: {
                pageTitle: '出货预告管理制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_warn_headerEdit.js']
                    });
                }
            }

        })
        .state('crmman.sale_ship_notice_header', {
            url: "/sale_ship_notice_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_ship_notice_header",
            data: {
                pageTitle: '发货通知管理查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_notice_header.js']
                    });
                }
            }
        })
        .state('crmman.sale_ship_noticeYP_headerEdit', {
            url: "/sale_ship_noticeYP_headerEdit",
            templateUrl: "views/saleman/sale_ship_noticeYP_headerEdit.html",
            data: {
                pageTitle: '船务预排时间修改'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_noticeYP_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.sale_ship_notice_headerEdit', {
            url: "/sale_ship_notice_headerEdit",
            templateUrl: "views/saleman/sale_ship_notice_headerEdit.html",
            data: {
                pageTitle: '发货通知管理制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_notice_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.sale_enquiry_list_header', {
            url: "/sale_enquiry_list_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_enquiry_list_header",
            data: {
                pageTitle: '询价管理查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_enquiry_list_header.js']
                    });
                }
            }
        })
        .state('crmman.sale_enquiry_list_headerEdit', {
            url: "/sale_enquiry_list_headerEdit",
            templateUrl: "views/saleman/sale_enquiry_list_headerEdit.html",
            data: {
                pageTitle: '询价管理制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_enquiry_list_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.sale_customs_header', {
            url: "/sale_customs_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_customs_header",
            data: {
                pageTitle: '报关单查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_customs_header.js']
                    });
                }
            }
        })
        .state('crmman.sale_customs_headerEdit', {
            url: "/sale_customs_headerEdit",
            templateUrl: "views/saleman/sale_customs_headerEdit.html",
            data: {
                pageTitle: '报关单制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_customs_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.sale_customsYB_header', {
            url: "/sale_customsYB_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_customsYB_header",
            data: {
                pageTitle: '预报关单查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_customsYB_header.js']
                    });
                }
            }
        })
        .state('crmman.sale_customsYB_headerEdit', {
            url: "/sale_customsYB_headerEdit",
            templateUrl: "views/saleman/sale_customsYB_headerEdit.html",
            data: {
                pageTitle: '预报关单制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_customsYB_headerEdit.js']
                    });
                }
            }
        })

        .state('crmman.sale_customsZZ_header', {
            url: "/sale_customsZZ_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_customsZZ_header",
            data: {
                pageTitle: '预报关单转正查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_customsZZ_header.js']
                    });
                }
            }
        })
        .state('crmman.sale_customsZZ_headerEdit', {
            url: "/sale_customsZZ_headerEdit",
            templateUrl: "views/saleman/sale_customsZZ_headerEdit.html",
            data: {
                pageTitle: '预报关单转正'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_customsZZ_headerEdit.js']
                    });
                }
            }
        })

        .state('crmman.sale_break_header', {
            url: "/sale_break_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_break_header",
            data: {
                pageTitle: '打散方案查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_break_header.js']
                    });
                }
            }
        })

        .state('crmman.sale_break_headerEdit', {
            url: "/sale_break_headerEdit",
            templateUrl: "views/saleman/sale_break_headerEdit.html",
            data: {
                pageTitle: '打散方案'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_break_headerEdit.js']
                    });
                }
            }
        })

        .state('crmman.sale_zy_header', {
            url: "/sale_zy_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_zy_header",
            data: {
                pageTitle: '散件专用机型查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_zy_header.js']
                    });
                }
            }
        })

        .state('crmman.sale_zy_headerEdit', {
            url: "/sale_zy_headerEdit",
            templateUrl: "views/saleman/sale_zy_headerEdit.html",
            data: {
                pageTitle: '散件专用机型制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_zy_headerEdit.js']
                    });
                }
            }
        })

    /**-------------------------------------财务管理----------------------------------*/
        .state('crmman.fin_funds_header_tt', {
            url: "/fin_funds_header_tt",
            templateUrl: "views/common/base_search.jsp?obj=fin_funds_header_tt",
            data: {
                pageTitle: 'TT到款录入查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_header_tt.js']
                    });
                }
            }
        })
        .state('crmman.fin_funds_header_ttEdit', {
            url: "/fin_funds_header_ttEdit",
            templateUrl: "views/finman/fin_funds_header_ttEdit.html",
            data: {
                pageTitle: 'TT到款录入编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_header_ttEdit.js']
                    });
                }
            }
        })
       
        .state('crmman.fin_funds_header_ttrl', {
            url: "/fin_funds_header_ttrl",
            templateUrl: "views/common/base_search.jsp?obj=fin_funds_header_ttrl",
            data: {
                pageTitle: 'TT到款客户认领查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_header_ttrl.js']
                    });
                }
            }
        })
        .state('crmman.fin_funds_header_ttrlEdit', {
            url: "/fin_funds_header_ttrlEdit",
            templateUrl: "views/finman/fin_funds_header_ttrlEdit.html",
            data: {
                pageTitle: 'TT到款客户认领制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_header_ttrlEdit.js']
                    });
                }
            }
        })
        .state('crmman.fin_funds_m_header_ttrl', {
            url: "/fin_funds_m_header_ttrl",
            templateUrl: "views/common/base_search.jsp?obj=fin_funds_m_header_ttrl",
            data: {
                pageTitle: 'TT到款变更-客户认领变更查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_m_header_ttrl.js']
                    });
                }
            }
        })
        .state('crmman.fin_funds_m_header_ttrlEdit', {
            url: "/fin_funds_m_header_ttrlEdit",
            templateUrl: "views/finman/fin_funds_m_header_ttrlEdit.html",
            data: {
                pageTitle: 'TT到款变更-客户认领变更制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_m_header_ttrlEdit.js']
                    });
                }
            }
        })
		
		.state('crmman.fin_funds_allo_header', {
            url: "/fin_funds_allo_header",
            templateUrl: "views/common/base_search.jsp?obj=fin_funds_allo_header",
            data: {
                pageTitle: '到款PI分配查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_allo_header.js']
                    });
                }
            }
        })
        .state('crmman.fin_funds_allo_headerEdit', {
            url: "/fin_funds_allo_headerEdit",
            templateUrl: "views/finman/fin_funds_allo_headerEdit.html",
            data: {
                pageTitle: '到款PI分配制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_allo_headerEdit.js']
                    });
                }
            }
        })

        .state('crmman.fin_funds_allo_header_sg', {
            url: "/fin_funds_allo_header_sg",
            templateUrl: "views/common/base_search.jsp?obj=fin_funds_allo_header_sg",
            data: {
                pageTitle: '到款PI分配查询(手工录入)'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_allo_header_sg.js']
                    });
                }
            }
        })

        .state('crmman.fin_funds_allo_header_sgEdit', {
            url: "/fin_funds_allo_header_sgEdit",
            templateUrl: "views/finman/fin_funds_allo_header_sgEdit.html",
            data: {
                pageTitle: '到款PI分配制单(手工录入)'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_allo_header_sgEdit.js']
                    });
                }
            }
        })

        .state('crmman.fin_funds_header', {
            url: "/fin_funds_header",
            templateUrl: "views/common/base_search.jsp?obj=fin_funds_header",
            data: {
                pageTitle: '信用证到款录入查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_header.js']
                    });
                }
            }
        })
        .state('crmman.fin_funds_headerEdit', {
            url: "/fin_funds_headerEdit",
            templateUrl: "views/finman/fin_funds_headerEdit.html",
            data: {
                pageTitle: '信用证到款录入制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_headerEdit.js']
                    });
                }
            }
        })
        
        .state('crmman.sale_prod_allo_header', {
            url: "/sale_prod_allo_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_prod_allo_header",
            data: {
                pageTitle: '到款转入生产单查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/sale_prod_allo_header.js']
                    });
                }
            }
        })
	 .state('crmman.edi_buyercodeapplyinfoEdit', {
            url: "/edi_buyercodeapplyinfoEdit",
            templateUrl: "views/billman/edi_buyercodeapplyinfoEdit.html",
            data: {
                pageTitle: '买方代码申请制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/edi_buyercodeapplyinfoEdit.js']
                    });
                }
            }
        })
		 .state('crmman.edi_quotaapplybackinfoEdit', {
            url: "/edi_quotaapplybackinfoEdit",
            templateUrl: "views/billman/edi_quotaapplybackinfoEdit.html",
            data: {
                pageTitle: '限额倒签制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/edi_quotaapplybackinfoEdit.js']
                    });
                }
            }
        })
			.state('crmman.edi_shipmentapplyinfoEdit', {
            url: "/edi_shipmentapplyinfoEdit",
            templateUrl: "views/billman/edi_shipmentapplyinfoEdit.html",
            data: {
                pageTitle: '出运申报制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/edi_shipmentapplyinfoEdit.js']
                    });
                }
            }
        })
        .state('crmman.edi_shipmentalterapplyinfoEdit', {
            url: "/edi_shipmentalterapplyinfoEdit",
            templateUrl: "views/billman/edi_shipmentalterapplyinfoEdit.html",
            data: {
                pageTitle: '出运申报变更制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/edi_shipmentalterapplyinfoEdit.js']
                    });
                }
            }
        })
			.state('crmman.edi_bankcodeapplyinfoEdit', {
            url: "/edi_bankcodeapplyinfoEdit",
            templateUrl: "views/billman/edi_bankcodeapplyinfoEdit.html",
            data: {
                pageTitle: '银行代码申请制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/edi_bankcodeapplyinfoEdit.js']
                    });
                }
            }
        })

			.state('crmman.edi_buyerinfoEdit', {
            url: "/edi_buyerinfoEdit",
            templateUrl: "views/billman/edi_buyerinfoEdit.html",
            data: {
                pageTitle: '买方档案查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/edi_buyerinfoEdit.js']
                    });
                }
            }
        })
			
        .state('crmman.sale_prod_allo_headerEdit', {
            url: "/sale_prod_allo_headerEdit",
            templateUrl: "views/finman/sale_prod_allo_headerEdit.html",
            data: {
                pageTitle: '到款转入生产单编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/sale_prod_allo_headerEdit.js']
                    });
                }
            }
        })
		.state('crmman.edi_plnoticeEdit', {
            url: "/edi_plnoticeEdit",
            templateUrl: "views/billman/edi_plnoticeEdit.html",
            data: {
                pageTitle: '可损通知制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/edi_plnoticeEdit.js']
                    });
                }
            }
        })
		
		.state('crmman.edi_plnotice_settEdit', {
            url: "/edi_plnotice_settEdit",
            templateUrl: "views/billman/edi_plnotice_settEdit.html",
            data: {
                pageTitle: '可损结案处理'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/billman/edi_plnotice_settEdit.js']
                    });
                }
            }
        })
        .state('crmman.fin_funds_invoice_header', {
            url: "/fin_funds_invoice_header",
            templateUrl: "views/common/base_search.jsp?obj=fin_funds_invoice_header",
            data: {
                pageTitle: '商业发票手工行核销查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_invoice_header.js']
                    });
                }
            }
        })
        .state('crmman.fin_funds_invoice_headerEdit', {
            url: "/fin_funds_invoice_headerEdit",
            templateUrl: "views/finman/fin_funds_invoice_headerEdit.html",
            data: {
                pageTitle: '商业发票手工行核销'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_invoice_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.fin_funds_m_invoice_header', {
            url: "/fin_funds_m_invoice_header",
            templateUrl: "views/common/base_search.jsp?obj=fin_funds_m_invoice_header",
            data: {
                pageTitle: '商业发票手工行更改查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_m_invoice_header.js']
                    });
                }
            }
        })
        .state('crmman.fin_funds_m_invoice_headerEdit', {
            url: "/fin_funds_m_invoice_headerEdit",
            templateUrl: "views/finman/fin_funds_m_invoice_headerEdit.html",
            data: {
                pageTitle: '商业发票手工行更改'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_m_invoice_headerEdit.js']
                    });
                }
            }
        })
        .state('crmman.fin_funds_allinv_header', {
            url: "/fin_funds_allinv_header",
            templateUrl: "views/common/base_search.jsp?obj=fin_funds_allinv_header",
            data: {
                pageTitle: '费用发票批量核销查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_allinv_header.js']
                    });
                }
            }
        })
        .state('crmman.fin_funds_allinv_headerEdit', {
            url: "/fin_funds_allinv_headerEdit",
            templateUrl: "views/finman/fin_funds_allinv_headerEdit.html",
            data: {
                pageTitle: '费用发票批量核销'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_funds_allinv_headerEdit.js']
                    });
                }
            }
        })
        //----------------------------合同---------------------------------------------
        .state('crmman.sale_po_contract_header', {
            url: "/sale_po_contract_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_po_contract_header",
            data: {
                pageTitle: '合同查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_po_contract_header.js']
                    });
                }
            }
        })
       .state('crmman.sale_po_contract_headerEdit', {
            url: "/sale_po_contract_headerEdit",
            templateUrl: "views/saleman/sale_po_contract_headerEdit.html",
            data: {
                pageTitle: '合同'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_po_contract_headerEdit.js']
                    });
                }
            }
        })
       //----------------------------外购件采购申请---------------------------------------------
        .state('crmman.sale_po_purchase_header', {
            url: "/sale_po_purchase_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_po_purchase_header",
            data: {
                pageTitle: '外购件采购申请'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_po_purchase_header.js']
                    });
                }
            }
        })
        .state('crmman.sale_po_purchase_headerEdit', {
            url: "/sale_po_purchase_headerEdit",
            templateUrl: "views/saleman/sale_po_purchase_headerEdit.html",
            data: {
                pageTitle: '外购件采购申请'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_po_purchase_headerEdit.js']
                    });
                }
            }
        })
        //----------------------------供应商档案查询---------------------------------------------
         .state('crmman.sale_vender', {
             url: "/sale_vender",
             templateUrl: "views/common/base_search.jsp?obj=sale_vender",
             data: {
                 pageTitle: '供应商档案查询'
             },
             resolve: {
                 load: function ($templateCache, $ocLazyLoad, $q, $http) {
                     lazyDeferred = $q.defer();

                     return $ocLazyLoad.load({
                         name: 'inspinia',
                         files: ['js/controllers/saleman/sale_vender.js']
                     });
                 }
             }
         })
        //----------------------------年度销售计划---------------------------------------------
        .state('crmman.sale_year_sell_cale', {
            url: "/sale_year_sell_cale",
            templateUrl: "views/common/base_search.jsp?obj=sale_year_sell_cale",
            data: {
                pageTitle: '年度销售计划'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_year_sell_cale.js']
                    });
                }
            }
        })
       .state('crmman.sale_year_sell_caleEdit', {
            url: "/sale_year_sell_caleEdit",
            templateUrl: "views/saleman/sale_year_sell_caleEdit.html",
            data: {
                pageTitle: '年度销售计划制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_year_sell_caleEdit.js']
                    });
                }
            }
        })
        //----------------------------年度销售预测录入---------------------------------------------
        .state('crmman.sale_year_sell_bud_header', {
            url: "/sale_year_sell_bud_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_year_sell_bud_header",
            data: {
                pageTitle: '年度销售预测录入'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_year_sell_bud_header.js']
                    });
                }
            }
        })
       .state('crmman.sale_year_sell_bud_headerEdit', {
            url: "/sale_year_sell_bud_headerEdit",
            templateUrl: "views/saleman/sale_year_sell_bud_headerEdit.html",
            data: {
                pageTitle: '年度销售预测录入制单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_year_sell_bud_headerEdit.js']
                    });
                }
            }
        })
		
		.state('crmman.oms_material_apply_headerEdit', {
            url: "/oms_material_apply_headerEdit",
            templateUrl: "views/saleman/oms_material_apply_headerEdit.html",
            data: {
                pageTitle: '长线备料申请'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/oms_material_apply_headerEdit.js']
                    });
                }
            }
        })

        //----------------------------三月滚动发起计划---------------------------------------------
        .state('crmman.sale_months_plan_launch_header', {
            url: "/sale_months_plan_launch_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_months_plan_launch_header",
            data: {
                pageTitle: '三月滚动发起计划'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_months_plan_launch_header.js']
                    });
                }
            }
        })
       .state('crmman.sale_months_plan_launch_headerEdit', {
            url: "/sale_months_plan_launch_headerEdit",
            templateUrl: "views/saleman/sale_months_plan_launch_headerEdit.html",
            data: {
                pageTitle: '三月滚动发起计划'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_months_plan_launch_headerEdit.js']
                    });
                }
            }
        })
    //----------------------------三月滚动计划录入---------------------------------------------
         .state('crmman.sale_months_plan_header', {
             url: "/sale_months_plan_header",
             templateUrl: "views/common/base_search.jsp?obj=sale_months_plan_header",
             data: {
                 pageTitle: '三月滚动计划录入'
             },
             resolve: {
                 load: function ($templateCache, $ocLazyLoad, $q, $http) {
                     lazyDeferred = $q.defer();

                     return $ocLazyLoad.load({
                         name: 'inspinia',
                         files: ['js/controllers/saleman/sale_months_plan_header.js']
                     });
                 }
             }
         })
        .state('crmman.sale_months_plan_headerEdit', {
            url: "/sale_months_plan_headerEdit",
            templateUrl: "views/saleman/sale_months_plan_headerEdit.html",
            data: {
                pageTitle: '三月滚动计划录入'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_months_plan_headerEdit.js']
                    });
                }
            }
        })
        //----------------------------月度计划---------------------------------------------
        .state('crmman.sale_months_inv_header', {
            url: "/sale_months_inv_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_months_inv_header",
            data: {
                pageTitle: '月度发起计划'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_months_inv_header.js']
                    });
                }
            }
        })
        .state('crmman.sale_months_inv_headerEdit', {
            url: "/sale_months_inv_headerEdit",
            templateUrl: "views/saleman/sale_months_inv_headerEdit.html",
            data: {
                pageTitle: '月度发起计划'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_months_inv_headerEdit.js']
                    });
                }
            }
        })
        //----------------------------月度计划---------------------------------------------
        .state('crmman.sale_months_invplan_header', {
            url: "/sale_months_invplan_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_months_invplan_header",
            data: {
                pageTitle: '月度计划录入查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_months_invplan_header.js']
                    });
                }
            }
        })
        .state('crmman.sale_months_invplan_headerEdit', {
            url: "/sale_months_invplan_headerEdit",
            templateUrl: "views/saleman/sale_months_invplan_headerEdit.html",
            data: {
                pageTitle: '月度计划录入'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_months_invplan_headerEdit.js']
                    });
                }
            }
        })
        //----------------------------费用登记---------------------------------------------
        .state('crmman.sale_payreg_header', {
            url: "/sale_payreg_header",
            templateUrl: "views/common/base_search.jsp?obj=sale_payreg_header",
            data: {
                pageTitle: '费用登记查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                     return $ocLazyLoad.load({
                         name: 'inspinia',
                         files: ['js/controllers/saleman/sale_payreg_header.js']
                     });
                 }
             }
         })

        .state('crmman.sale_payreg_headerEdit', {
             url: "/sale_payreg_headerEdit",
             templateUrl: "views/saleman/sale_payreg_headerEdit.html",
             data: {
                 pageTitle: '费用登记'
             },
             resolve: {
                 load: function ($templateCache, $ocLazyLoad, $q, $http) {
                     lazyDeferred = $q.defer();
                     return $ocLazyLoad.load({
                         name: 'inspinia',
                         files: ['js/controllers/saleman/sale_payreg_headerEdit.js']
                     });
                 }
             }
        })
    //----------------------------配件打包---------------------------------------------
         .state('crmman.sale_prod_header_pj', {
             url: "/sale_prod_header_pj",
             templateUrl: "views/common/base_search.jsp?obj=sale_prod_header_pj",
             data: {
                 pageTitle: '配件打包查询'
             },
             resolve: {
                 load: function ($templateCache, $ocLazyLoad, $q, $http) {
                     lazyDeferred = $q.defer();

                     return $ocLazyLoad.load({
                         name: 'inspinia',
                         files: ['js/controllers/saleman/sale_prod_header_pj.js']
                     });
                 }
             }
         })
        .state('crmman.sale_prod_header_pjEdit', {
             url: "/sale_prod_header_pjEdit",
             templateUrl: "views/saleman/sale_prod_header_pjEdit.html",
             data: {
                 pageTitle: '配件打包'
             },
             resolve: {
                 load: function ($templateCache, $ocLazyLoad, $q, $http) {
                     lazyDeferred = $q.defer();
                     return $ocLazyLoad.load({
                         name: 'inspinia',
                         files: ['js/controllers/saleman/sale_prod_header_pjEdit.js']
                     });
                 }
             }
        })
        .state('crmman.exchange_bf', {
            url: "/exchange_bf",
            templateUrl: "views/common/base_search.jsp?obj=exchange_bf",
            data: {
                pageTitle: '汇率查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/exchange_bf.js']
                    });
                }
            }
        })

        .state('crmman.exchange_bfEdit', {
            url: "/exchange_bfEdit",
            templateUrl: "views/baseman/exchange_bfEdit.html",
            data: {
                pageTitle: '汇率设置'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/exchange_bfEdit.js']
                    });
                }
            }
        })
        
        .state('crmman.customs_name', {
            url: "/customs_name",
            templateUrl: "views/common/base_search.jsp?obj=customs_name",
            data: {
                pageTitle: '报关税率设置'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/customs_name.js']
                    });
                }
            }
        })
		
		.state('crmman.customs_nameEdit', {
            url: "/customs_nameEdit",
            templateUrl: "views/baseman/customs_nameEdit.html",
            data: {
                pageTitle: '报关税率设置'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/customs_nameEdit.js']
                    });
                }
            }
        })
		
		.state('crmman.base_area_sx', {
            url: "/base_area_sx",
            templateUrl: "views/common/base_search.jsp?obj=base_area_sx",
            data: {
                pageTitle: '标准价大区系数维护'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_area_sx.js']
                    });
                }
            }
        })
		
		.state('crmman.base_area_sxEdit', {
            url: "/base_area_sxEdit",
            templateUrl: "views/baseman/base_area_sxEdit.html",
            data: {
                pageTitle: '标准价大区系数维护编辑'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_area_sxEdit.js']
                    });
                }
            }
       })
		.state('crmman.sale_list', {
            url: "/sale_list",
            templateUrl: "views/saleman/sale_list.html",
            data: {
                pageTitle: '海外交期数据_按机型'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_list.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_prod_weight_search', {
            url: "/sale_prod_weight_search",
            templateUrl: "views/saleman/sale_prod_weight_search.html",
            data: {
                pageTitle: '产品称重数据查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_prod_weight_search.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_pi_header_ds', {
            url: "/sale_pi_header_ds",
            templateUrl: "views/saleman/sale_pi_header_ds.html",
            data: {
                pageTitle: '打散方案引用查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_pi_header_ds.js']
                    });
                }
            }
        })
		.state('crmman.sale_ship_package', {
            url: "/sale_ship_package",
            templateUrl: "views/saleman/sale_ship_package.html",
            data: {
                pageTitle: '散件包装箱实际装柜与预排柜差异查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_package.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_ship_packagelineseach', {
            url: "/sale_ship_packagelineseach",
            templateUrl: "views/saleman/sale_ship_packagelineseach.html",
            data: {
                pageTitle: '装柜查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_packagelineseach.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_warn_packagesearch', {
            url: "/sale_warn_packagesearch",
            templateUrl: "views/saleman/sale_warn_packagesearch.html",
            data: {
                pageTitle: '出货预告包装清单查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_warn_packagesearch.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_forecast_search', {
            url: "/sale_prod_listsearch",
            templateUrl: "views/saleman/sale_forecast_search.html",
            data: {
                pageTitle: '销售预测明细查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_forecast_search.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_bud_fact_search', {
            url: "/sale_bud_fact_search",
            templateUrl: "views/saleman/sale_bud_fact_search.html",
            data: {
                pageTitle: '预测与实际对比查询报表'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_bud_fact_search.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_part_listsearch', {
            url: "/sale_part_listsearch",
            templateUrl: "views/saleman/sale_part_listsearch.html",
            data: {
                pageTitle: '生产通知配件清单查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_part_listsearch.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_xdwcx_search', {
            url: "/sale_xdwcx_search",
            templateUrl: "views/saleman/sale_xdwcx_search.html",
            data: {
                pageTitle: '下单未出库明细查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_xdwcx_search.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_price_list_search', {
            url: "/sale_price_list_search",
            templateUrl: "views/saleman/sale_price_list_search.html",
            data: {
                pageTitle: '销售型谱查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_price_list_search.js']
                    });
                }
            }
        })
		/*1111111111111111111111111111111111111111111111111111111*/
		
		/*财务财务财务*/
		.state('crmman.amount_allot_analysis', {
            url: "/amount_allot_analysis",
            templateUrl: "views/saleman/amount_allot_analysis.html",
            data: {
                pageTitle: '到款PI分配完成情况查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/amount_allot_analysis.js']
                    });
                }
            }
        })
		.state('crmman.sale_search_pi_amtbalance', {
            url: "/sale_search_pi_amtbalance",
            templateUrl: "views/saleman/sale_search_pi_amtbalance.html",
            data: {
                pageTitle: 'PI到款使用结余查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_search_pi_amtbalance.js']
                    });
                }
            }
        })
		
		.state('crmman.fin_cust_amount_search5', {
            url: "/fin_cust_amount_search5",
            templateUrl: "views/finman/fin_cust_amount_search5.html",
            data: {
                pageTitle: '客户发生额对账单(新)'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_cust_amount_search5.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_xdmxdst_search', {
            url: "/sale_xdmxdst_search",
            templateUrl: "views/finman/sale_xdmxdst_search.html",
            data: {
                pageTitle: '下单明细查询(按时点)'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/sale_xdmxdst_search.js']
                    });
                }
            }
        })
		
		.state('crmman.fin_account_aging_sumshid2', {
            url: "/fin_account_aging_sumshid2",
            templateUrl: "views/finman/fin_account_aging_sumshid2.html",
            data: {
                pageTitle: '应收逾期预警时点(新)'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_account_aging_sumshid2.js']
                    });
                }
            }
        })
		
		.state('crmman.fin_account_aging_sumshid', {
            url: "/fin_account_aging_sumshid",
            templateUrl: "views/finman/fin_account_aging_sumshid.html",
            data: {
                pageTitle: '应收账龄查询(按时点)'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_account_aging_sumshid.js']
                    });
                }
            }
        })
		
		.state('crmman.fin_receivable_in_yssd', {
            url: "/fin_receivable_in_yssd",
            templateUrl: "views/finman/fin_receivable_in_yssd.html",
            data: {
                pageTitle: '预收查询(按时点)'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_receivable_in_yssd.js']
                    });
                }
            }
        })
		
		.state('crmman.fin_sap_list_search', {
            url: "/fin_sap_list_search",
            templateUrl: "views/finman/fin_sap_list_search.html",
            data: {
                pageTitle: '到款台帐查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_sap_list_search.js']
                    });
                }
            }
        })
		
		.state('crmman.fin_ship_invoice_search', {
            url: "/fin_ship_invoice_search",
            templateUrl: "views/finman/fin_ship_invoice_search.html",
            data: {
                pageTitle: '开票接口数据表'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_ship_invoice_search.js']
                    });
                }
            }
        })
		
		.state('crmman.base_dict_item_search', {
            url: "/base_dict_item_search",
            templateUrl: "views/finman/base_dict_item_search.html",
            data: {
                pageTitle: '开票接口数据表'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/base_dict_item_search.js']
                    });
                }
            }
        })
		/*财务财务财务*/
		
		
		
		.state('crmman.sale_list_used', {
            url: "/sale_list_used",
            templateUrl: "views/saleman/sale_list_used.html",
            data: {
                pageTitle: '海外交期数据_用时'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_list_used.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_prod_headera', {
            url: "/sale_prod_headera",
            templateUrl: "views/saleman/sale_prod_headera.html",
            data: {
                pageTitle: 'BOM散件物料数量与包装数量对比'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_prod_headera.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_ship_warn_getoutlt', {
            url: "/sale_ship_warn_getoutlt",
            templateUrl: "views/saleman/sale_ship_warn_getoutlt.html",
            data: {
                pageTitle: '出货品牌统计报表'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_warn_getoutlt.js']
                    });
                }
            }
        })
		
		
		.state('crmman.sale_prod_email', {
            url: "/sale_prod_email",
            templateUrl: "views/saleman/sale_prod_email.html",
            data: {
                pageTitle: '客户Email查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_prod_email.js']
                    });
                }
            }
        })
		
		
		.state('crmman.sale_ship_warn_runlt', {
            url: "/sale_ship_warn_runlt",
            templateUrl: "views/saleman/sale_ship_warn_runlt.html",
            data: {
                pageTitle: '运费清单查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_warn_runlt.js']
                    });
                }
            }
        })
		
		
		.state('crmman.sale_ship_warn_liult', {
            url: "/sale_ship_warn_liult",
            templateUrl: "views/saleman/sale_ship_warn_liult.html",
            data: {
                pageTitle: '业务流转汇总表'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_warn_liult.js']
                    });
                }
            }
        })
		
		
		.state('crmman.sale_ship_warn_inlt', {
            url: "/sale_ship_warn_inlt",
            templateUrl: "views/saleman/sale_ship_warn_inlt.html",
            data: {
                pageTitle: '集装箱装箱记录'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_warn_inlt.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_ship_warn_speaklt', {
            url: "/sale_ship_warn_speaklt",
            templateUrl: "views/saleman/sale_ship_warn_speaklt.html",
            data: {
                pageTitle: '发货通知单流程表'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_warn_speaklt.js']
                    });
                }
            }
        })
		
		
		
		.state('crmman.sale_ship_warn_badlt', {
            url: "/sale_ship_warn_badlt",
            templateUrl: "views/saleman/sale_ship_warn_badlt.html",
            data: {
                pageTitle: '发货产品报关价格查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_warn_badlt.js']
                    });
                }
            }
        })
		
		
		.state('crmman.sale_ship_warn_hositylt', {
            url: "/sale_ship_warn_hositylt",
            templateUrl: "views/saleman/sale_ship_warn_hositylt.html",
            data: {
                pageTitle: 'BOM散件物料数量与包装数量对比'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_warn_hositylt.js']
                    });
                }
            }
        })
		
		
		
		.state('crmman.sale_ship_warn_headerlt', {
            url: "/sale_ship_warn_headerlt",
            templateUrl: "views/saleman/sale_ship_warn_headerlt.html",
            data: {
                pageTitle: '出货预告流程表'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_warn_headerlt.js']
                    });
                }
            }
        })
		
		
		
		
		.state('crmman.sale_customs_header_lt', {
            url: "/sale_customs_header_lt",
            templateUrl: "views/saleman/sale_customs_header_lt.html",
            data: {
                pageTitle: '报关差异调整凭证查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_customs_header_lt.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_list_outinfor', {
            url: "/sale_list_outinfor",
            templateUrl: "views/saleman/sale_list_outinfor.html",
            data: {
                pageTitle: '下单明细报表查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_list_outinfor.js']
                    });
                }
            }
        })
		
		
		
		
		.state('crmman.sale_break_m_seach', {
            url: "/sale_break_m_seach",
            templateUrl: "views/saleman/sale_break_m_seach.html",
            data: {
                pageTitle: '包装方案引用查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_break_m_seach.js']
                    });
                }
            }
        })
		
		
		
		.state('crmman.sale_list_prodinfor', {
            url: "/sale_list_prodinfor",
            templateUrl: "views/saleman/sale_list_prodinfor.html",
            data: {
                pageTitle: '生成通知明细查询-计划管理'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_list_prodinfor.js']
                    });
                }
            }
        })
		
		
		.state('crmman.sale_list_prodinfor_err', {
            url: "/sale_list_prodinfor_err",
            templateUrl: "views/saleman/sale_list_prodinfor_err.html",
            data: {
                pageTitle: '生成通知明细查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_list_prodinfor_err.js']
                    });
                }
            }
        })
		
		
		
		
		
		
		.state('crmman.sale_prod_spa', {
            url: "/sale_prod_spa",
            templateUrl: "views/saleman/sale_prod_spa.html",
            data: {
                pageTitle: '发货单开票信息查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_prod_spa.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_prod_one', {
            url: "/sale_prod_one",
            templateUrl: "views/saleman/sale_prod_one.html",
            data: {
                pageTitle: '包装清单查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_prod_one.js']
                    });
                }
            }
        })
		
		//----------------------------PI接单生产套数查询---------------------------------------------
		.state('crmman.sale_report_pi', {
            url: "/sale_report_pi",
            templateUrl: "views/saleman/sale_report_pi.html",
            data: {
                pageTitle: 'PI接单生产套数查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_report_pi.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_pi_header_profit', {
            url: "/sale_pi_header_profit",
            templateUrl: "views/saleman/sale_pi_header_profit.html",
            data: {
                pageTitle: '按下单数据计算毛利'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_pi_header_profit.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_prod_header_bom', {
            url: "/sale_prod_header_bom",
            templateUrl: "views/saleman/sale_prod_header_bom.html",
            data: {
                pageTitle: '备料订单跟踪查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_prod_header_bom.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_report_warn_delivery', {
            url: "/sale_report_warn_delivery",
            templateUrl: "views/saleman/sale_report_warn_delivery.html",
            data: {
                pageTitle: '订舱发货对比查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_report_warn_delivery.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_ship_notice_header_ncrelation', {
            url: "/sale_ship_notice_header_ncrelation",
            templateUrl: "views/saleman/sale_ship_notice_header_ncrelation.html",
            data: {
                pageTitle: '发货与报关关联报表'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_notice_header_ncrelation.js']
                    });
                }
            }
        })
		
		.state('crmman.sale_ship_notice_header_purchbill', {
            url: "/sale_ship_notice_header_purchbill",
            templateUrl: "views/saleman/sale_ship_notice_header_purchbill.html",
            data: {
                pageTitle: '进货发票查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_ship_notice_header_purchbill.js']
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
        $rootScope.showmode = 1;
        $rootScope.gobackhome = function(){
            $state.go("crmman.main");
        }
    });
