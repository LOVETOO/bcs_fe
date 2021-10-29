/**
 * INSPINIA - Responsive Admin Theme

 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $$qProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/home");
    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: true
    });

    $stateProvider
        .state('home', {
            // abstract: true,
            url: "/home",
            templateUrl: "views/common/content.html?v="+window.rev,
        })
        .state('crmman', {
            url: '/crmman',
            template: '<div ui-view=""></div>',
        })
        .state('crmman.mywork1', {
            url: "/mywork1",
            templateUrl: "views/mywork/mywork_uncheck.html?v="+window.rev,

            data: {
                pageTitle: '当前待批的流程'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/workhits_uncheck.js?v='+window.rev]
                    });
                }
            }
        })
        .state('crmman.chgpsw', {
            url: "/chgpsw",
            templateUrl: "views/mywork/chgpsw.html?v="+window.rev,

            data: {
                pageTitle: 'chgpsw'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/workhits.js?v='+window.rev]
                    });
                }
            }
        })
        .state('crmman.mywork2', {
            url: "/mywork2",
            templateUrl: "views/mywork/mywork_unachieve.html?v="+window.rev,

            data: {
                pageTitle: '未到达流程'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/workhits_unachieve.js?v='+window.rev]
                    });
                }
            }
        })
        .state('crmman.mywork3', {
            url: "/mywork3",
            templateUrl: "views/mywork/mywork_mystart.html?v="+window.rev,

            data: {
                pageTitle: '我启的流程'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/workhits_mystart.js?v='+window.rev]
                    });
                }
            }
        })
        .state('crmman.mywork4', {
            url: "/mywork4",
            templateUrl: "views/mywork/mywork_finished.html?v="+window.rev,

            data: {
                pageTitle: '已完成流程'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/workhits_finished.js?v='+window.rev]
                    });
                }
            }
        })
        .state('crmman.myhome', {
            url: "/myhome",
            templateUrl: "views/mywork/oa_myhome.html?v="+window.rev,
            data: {
                pageTitle: '个人首页'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/oa_myhome.js?v='+window.rev]
                    });
                }
            }
        })
        .state('crmman.home', {
            url: "/home",
            templateUrl: "views/mywork/oa_home.html?v="+window.rev,

            data: {
                pageTitle: '公司首页'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/oa_home.js?v='+window.rev]
                    });
                }
            }
        })

        .state('crmman.manage_home', {
            url: "/manage_home",
            templateUrl: "views/mywork/manage_home.html?v="+window.rev,

            data: {
                pageTitle: '管理首页'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/manage_home.js?v='+window.rev]
                    });
                }
            }
        })
        /**********************************权限设置****************************************/
        .state('crmman.base_drp_cust', {
            url: "/base_drp_cust",
            templateUrl: "views/baseman/mail.html?v="+window.rev,
            data: {
                pageTitle: '邮箱'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/mail.js?v='+window.rev]
                    });
                }
            }
        })
        .state("crmman.files", {
            url: "/files",
            templateUrl: "views/baseman/company_files.html?v="+window.rev,
            data: {
                pageTitle: '公司文件'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/company_files.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        .state("crmman.myfiles", {
            url: "/myfiles",
            templateUrl: "views/baseman/myfiles.html?v="+window.rev,
            data: {
                pageTitle: '我的文件'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/myfiles.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        .state("crmman.base_org", {
            url: "/base_org",
            templateUrl: "views/baseman/base_org.html?v="+window.rev,
            data: {
                pageTitle: '机构'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/base_org.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        .state("crmman.base_position", {
            url: "/base_position",
            templateUrl: "views/baseman/base_position.html?v="+window.rev,
            data: {
                pageTitle: '岗位'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/base_position.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        .state("crmman.base_role", {
            url: "/base_role",
            templateUrl: "views/baseman/base_role.html?v="+window.rev,
            data: {
                pageTitle: '角色'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/base_role.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        .state("crmman.base_flow", {
            url: "/base_flow",
            templateUrl: "views/baseman/base_flow.html?v="+window.rev,
            data: {
                pageTitle: '流程'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/base_flow.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        .state("crmman.base_code", {
            url: "/base_code",
            templateUrl: "views/baseman/base_code.html?v="+window.rev,
            data: {
                pageTitle: '编码'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/base_code.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        .state("crmman.sys_param", {
            url: "/sys_param",
            templateUrl: "views/baseman/sys_param.html?v="+window.rev,
            data: {
                pageTitle: '系统参数'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/sys_param.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        .state("crmman.scpobjconf", {
            url: "/scpobjconf",
            templateUrl: "views/baseman/scpobjconf.html?v="+window.rev,
            data: {
                pageTitle: '窗体对象配置'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/scpobjconf.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        .state("crmman.sys_mod", {
            url: "/sys_mod",
            templateUrl: "views/baseman/sys_mod.html?v="+window.rev,
            data: {
                pageTitle: '模块定义'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/sys_mod.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        .state("crmman.sys_menu", {
            url: "/sys_menu",
            templateUrl: "views/baseman/sys_menu.html?v="+window.rev,
            data: {
                pageTitle: '菜单定义'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/sys_menu.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        .state("crmman.scpdict", {
            url: "/scpdict",
            templateUrl: "views/baseman/scpdict.html?v="+window.rev,
            data: {
                pageTitle: '系统词汇'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/scpdict.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        .state('crmman.sht', {
            url: "/sht/:shtid",
            templateUrl: "views/baseman/sht_view.html?v="+window.rev,
            data: {
                pageTitle: '表单'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_shtcontroner.js?v='+window.rev]
                    });
                }
            }
        })
        .state("crmman.wfsht", {
            url: "/wfsht",
            templateUrl: "views/mywork/wfsht.html?v="+window.rev,
            data: {
                pageTitle: '表单审批'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/mywork/wfsht.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        .state("crmman.wffile", {
            url: "/wffile",
            templateUrl: "views/mywork/wffile.html?v="+window.rev,
            data: {
                pageTitle: '文件审批'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/mywork/wffile.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        //查看流程页面
        .state("crmman.flow_path", {
            url: "/flow_path",
            templateUrl: "views/mywork/flow_path.html?v="+window.rev,
            data: {
                pageTitle: '更多流程'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/mywork/flow_path.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        //个人设置my_settings
        .state("crmman.my_settings", {
            url: "/my_settings",
            templateUrl: "views/mywork/my_settings.html?v="+window.rev,
            data: {
                pageTitle: '个人设置'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/mywork/my_settings.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        .state("crmman.resource", {
            url: "/resource",
            templateUrl: "views/mywork/resource.html?v="+window.rev,
            data: {
                pageTitle: '资源管理'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/mywork/resource.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        .state('finman', {
            url: '/crmman',
            template: '<div ui-view=""></div>',
        })
        //预算期间
        .state("crmman.fin_bud_period_header", {
            url: "/fin_bud_period_header",
            templateUrl: "views/finman/fin_bud_period_header.html?v="+window.rev,
            data: {
                pageTitle: '预算期间'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_period_header.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        //预算类别
        .state("crmman.fin_bud_type_header", {
            url: "/fin_bud_type_header",
            templateUrl: "views/finman/fin_bud_type_header.html?v="+window.rev,
            data: {
                pageTitle: '预算类别'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_type_header.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        .state("crmman.fin_fee_type", {
            url: "/fin_fee_type",
            templateUrl: "views/finman/fin_fee_type.html?v="+window.rev,
            data: {
                pageTitle: '费用类别'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_type.js?v='+window.rev]
                        }

                    );
                }
            }
        })

        //费用项目
        .state("crmman.fin_fee_header",{
            url: "/fin_fee_header",
            templateUrl: "views/finman/fin_fee_header.html?v="+window.rev,
            data: {
                pageTitle: '费用项目'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_header.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        //预算调整
        .state("crmman.fin_bud_adjust_header",{
            url: "/fin_bud_adjust_header",
            templateUrl: "views/finman/fin_bud_adjust_header.html?v="+window.rev,
            data: {
                pageTitle: '预算调整'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_adjust_header.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        //预算结转
        .state("crmman.fin_bud_carryover", {
            url: "/fin_bud_carryover",
            templateUrl: "views/finman/fin_bud_carryover.html?v="+window.rev,
            data: {
                pageTitle: '预算结转'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_carryover.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        //预算编制
        .state("crmman.fin_bud_make", {
            url: "/fin_bud_make",
            templateUrl: "views/finman/fin_bud_make.html?v="+window.rev,
            data: {
                pageTitle: '预算编制'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_make.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        //费用申请
        .state("crmman.fin_fee_apply_header", {
            url: "/fin_fee_apply_header",
            templateUrl: "views/finman/fin_fee_apply_header.html?v="+window.rev,
            data: {
                pageTitle: '费用申请'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_apply_header.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        //预算审核
        .state("crmman.fin_bud_audit_head", {
            url: "/fin_bud_audit_head",
            templateUrl: "views/finman/fin_bud_audit_head.html?v="+window.rev,
            data: {
                pageTitle: '预算审核'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_audit_head.js?v='+window.rev]
                        }
                    );
                }
            }
        })
        //费用报销查询
        .state("crmman.fin_fee_bx_header_search", {
            url: "/fin_fee_bx_header_search",
            templateUrl: "views/finman/fin_fee_bx_header_search.html?v="+window.rev,
            data: {
                pageTitle: '费用报销查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_bx_header_search.js?v='+window.rev,'js/plugins/ajaxfileupload.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        //费用报销
        .state("crmman.fin_fee_bx_header", {
            url: "/fin_fee_bx_header",
            templateUrl: "views/finman/fin_fee_bx_header.html?v="+window.rev,
            data: {
                pageTitle: '费用报销'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_bx_header.js?v='+window.rev]
                        }
                    );
                }
            }
        })
        //预算编制—变动
        .state("crmman.fin_bud_make_change", {
            url: "/fin_bud_make_change",
            templateUrl: "views/finman/fin_bud_make_change.html?v="+window.rev,
            data: {
                pageTitle: '预算编制-变动'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_make_change.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        //借款申请
        .state("crmman.mkt_loan_header", {
            url: "/mkt_loan_header",
            templateUrl: "views/finman/mkt_loan_header.html?v="+window.rev,
            data: {
                pageTitle: '借款申请'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/mkt_loan_header.js?v='+window.rev]
                        }

                    );
                }
            }
        })
        //费用申请结案
        .state("crmman.fin_fee_apply_header_over", {
            url: "/fin_fee_apply_header_over",
            templateUrl: "views/finman/fin_fee_apply_header_over.html?v="+window.rev,
            data: {
                pageTitle: '费用申请结案'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_apply_header_over.js?v='+window.rev,'js/plugins/ajaxfileupload.js?v='+window.rev]
                        }
                    );
                }
            }
        })
        //预算执行进度统计页面
        .state("crmman.fin_bud_execution_progress", {
            url: "/fin_bud_execution_progress",
            templateUrl: "views/finman/fin_bud_execution_progress.html?v="+window.rev,
            data: {
                pageTitle: '预算执行进度统计'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_execution_progress.js?v='+window.rev]
                        }
                    );
                }
            }
        })
        //预算使用明细页面
        .state("crmman.fin_bud_list", {
            url: "/fin_bud_list",
            templateUrl: "views/finman/fin_bud_list.html?v="+window.rev,
            data: {
                pageTitle: '预算使用明细页面'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_list.js?v='+window.rev]
                        }
                    );
                }
            }
        })
        //费用申请与报销进度查询页面
        .state("crmman.fin_fee_apply_bx_search", {
            url: "/fin_fee_apply_bx_search",
            templateUrl: "views/finman/fin_fee_apply_bx_search.html?v="+window.rev,
            data: {
                pageTitle: '费用申请与报销进度查询'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_apply_bx_search.js?v='+window.rev]
                        }
                    );
                }
            }
        })
        //流程页面
        .state("crmman.wfform", {
            url: "/wfform/:wftempid/:wfid",
            templateUrl: "views/baseman/base_wf.html?v="+window.rev,
            data: {
                pageTitle: '流程'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_wf.js?v='+window.rev]
                    });
                }
            }
        })
        //流程实例页面
        .state("crmman.wfins", {
            url: "/wfins/:wftempid/:wfid/:objtypeid/:objid",
            templateUrl: "views/baseman/base_wfexec.html?v="+window.rev,
            data: {
                pageTitle: '流程实例'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_wfexec.js?v='+window.rev]
                    });
                }
            }
        })
        //销售管理页面
        .state("crmman.sale_yeartask_head", {
            url: "/sale_yeartask_head",
            templateUrl: "views/saleman/sale_yeartask_head.html?v="+window.rev,
            data: {
                pageTitle: '年度销售任务'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_yeartask_head.js?v='+window.rev]
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
        $rootScope.gobackhome = function() {
            $state.go("crmman.main");
        }
    });