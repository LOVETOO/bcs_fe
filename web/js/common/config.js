define(['app'], function (app) {

/**
 * INSPINIA - Responsive Admin Theme

 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $$qProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/home");
    //$ocLazyLoad - API中文翻译
    //http://dreamapple.leanapp.cn/gitbook/oclazyload-doc/
    $ocLazyLoadProvider.config({
            debug: true,
            //events: true,
            modules: [{
                name: "aggrid",
                serie: true, //默认值为false，当此参数为true时，顺序加载files里的文件，否则是异步加载，当加载的文件有依赖关系时，请打开此参数
                files: ["js/plugins/dist/ag-grid-enterprise.min.js.gzjs", "js/plugins/dist/ag-grid-enterprise.min.noStyle.js.gzjs"]
            },
                {
                    name: "bt-datepicker",
                    serie: true, //默认值为false，当此参数为true时，顺序加载files里的文件，否则是异步加载，当加载的文件有依赖关系时，请打开此参数
                    files: [
                        "lib/bootstrap-datepicker-1.4.0/js/bootstrap-datepicker.min.js",
                        "lib/bootstrap-datepicker-1.4.0/locales/bootstrap-datepicker.zh-CN.min.js",
                        "lib/bootstrap-datepicker-1.4.0/css/bootstrap-datepicker3.css"
                    ]
                },
                {
                    name: "bt-datetimepicker",
                    serie: true, //默认值为false，当此参数为true时，顺序加载files里的文件，否则是异步加载，当加载的文件有依赖关系时，请打开此参数
                    files: ["lib/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
                        "lib/bootstrap-datetimepicker/locales/bootstrap-datetimepicker.zh-CN.js",
                        "lib/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css"
                    ]
                },
                {
                    name: "ajaxfileupload",
                    files: ["js/ajaxfileupload.js"]
                },
                {
                    name: "gooflow",
                    serie: true, //默认值为false，当此参数为true时，顺序加载files里的文件，否则是异步加载，当加载的文件有依赖关系时，请打开此参数
                    files: ["js/plugins/GooFlow/fonts/iconflow.css", "js/plugins/GooFlow/GooFlow.css", "js/plugins/GooFlow/GooFlow_GooFunc.js", "js/plugins/GooFlow/GooFlow.js"]
                },
                {
                    name: "ztree",
                    serie: true, //默认值为false，当此参数为true时，顺序加载files里的文件，否则是异步加载，当加载的文件有依赖关系时，请打开此参数
                    files: [
                        "js/plugins/z-tree/css/zTreeStyle/zTreeStyle.css",
                        "js/plugins/z-tree/jquery.ztree.core.min.js",
                        "js/plugins/z-tree/jquery.ztree.excheck.js",
                        "js/plugins/z-tree/jquery.ztree.exhide.js"
                    ]
                },
                {
                    name: "slickgrid",
                    serie: true, //默认值为false，当此参数为true时，顺序加载files里的文件，否则是异步加载，当加载的文件有依赖关系时，请打开此参数
                    files: [
                        "lib/slickgrid/slick.grid.css",
                        //"lib/slickgrid/css/smoothness/jquery-ui-1.8.16.custom.css",
                        "lib/slickgrid/css/slickgrid.css",
                        //"lib/slickgrid/css/slick.pager.css",
                        "lib/slickgrid/lib/jquery.event.drag-2.2.js",
                        "lib/slickgrid/slick.core.js",
                        //"lib/slickgrid/plugins/slick.cellrangedecorator.js",
                        //"lib/slickgrid/plugins/slick.cellrangeselector.js",
                        //"lib/slickgrid/plugins/slick.cellselectionmodel.js",
                        "lib/slickgrid/slick.formatters.js",
                        "lib/slickgrid/slick.editors.js",
                        //"lib/slickgrid/slick.pager.js",
                        "lib/slickgrid/slick.grid.min.js.gzjs",
                        "lib/slickgrid/slick.dataview.js",
                        "lib/slickgrid/plugins/slick.checkboxselectcolumn.js",
                        //"lib/slickgrid/plugins/slick.autotooltips.js",
                        //"lib/slickgrid/plugins/slick.cellcopymanager.js",
                        //"lib/slickgrid/plugins/slick.cellselectionmodel.js",
                        "lib/slickgrid/plugins/slick.rowselectionmodel.js"
                    ]
                },
                {
                    name: "jquery-ui",
                    files: [
                        "js/plugins/jquery-ui/jquery-ui.min.js.gzjs"
                    ]
                },
                {
                    name: "jquery.flot",
                    serie: true, //默认值为false，当此参数为true时，顺序加载files里的文件，否则是异步加载，当加载的文件有依赖关系时，请打开此参数
                    files: [
                        "js/plugins/flot/jquery.flot.js",
                        "js/plugins/flot/jquery.flot.tooltip.min.js",
                        "js/plugins/flot/jquery.flot.resize.js",
                        "js/plugins/flot/jquery.flot.pie.js",
                        "js/plugins/flot/jquery.flot.time.js"
                    ]
                },
                {
                    name: "footable",
                    serie: true, //默认值为false，当此参数为true时，顺序加载files里的文件，否则是异步加载，当加载的文件有依赖关系时，请打开此参数
                    files: [
                        "js/plugins/footable/footable.all.min.js",
                        "js/plugins/footable/footable.js",
                        "js/plugins/footable/footable.filter.js",
                        "js/plugins/footable/footable.grid.js",
                        "js/plugins/footable/footable.grid.js",
                        "js/plugins/footable/footable.sort.js",
                        "js/plugins/footable/footable.striping.js",
                        "js/plugins/footable/footable.paginate.js"
                    ]
                },
                {
                    name: "echarts",
                    files: ["lib/echarts/echarts.min.js.gzjs"]
                },
                {
                    name: "directives",
                    files: ["js/base/directives.js"]
                }
            ]
        }
    );

    $stateProvider
        .state('home', {
            //abstract: true,
            url: "/home",
            templateUrl: "views/common/content.html?v=" + window.rev,
        })
        .state('crmman', {
            url: '/crmman',
            template: '<div ui-view=""></div>',
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["jquery-ui", "slickgrid", "aggrid",
                        "js/base/ctrl_bill_public.js",
                        "js/base/ctrl_view_public.js",
                        "js/base/ctrl_bill_wfaudit.js"
                    ]);
                }
            }
        })
        .state('finman', {
            url: '/finman',
            template: '<div ui-view=""></div>',
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["jquery-ui", "slickgrid", "aggrid",
                        "js/base/ctrl_bill_public.js",
                        "js/base/ctrl_view_public.js",
                        "js/base/ctrl_bill_wfaudit.js"
                    ]);
                }
            }
        })
        .state('baseman', {
            url: '/baseman',
            template: '<div ui-view=""></div>',
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["jquery-ui", "slickgrid", "aggrid",
                        "js/base/ctrl_bill_public.js",
                        "js/base/ctrl_view_public.js",
                        "js/base/ctrl_bill_wfaudit.js"
                    ]);
                }
            }
        })
        .state('saleman', {
            url: '/saleman',
            template: '<div ui-view=""></div>',
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["jquery-ui", "slickgrid", "aggrid",
                        "js/base/ctrl_bill_public.js",
                        "js/base/ctrl_view_public.js",
                        "js/base/ctrl_bill_wfaudit.js"
                    ]);
                }
            }
        })
        .state('mktman', {
            url: '/mktman',
            template: '<div ui-view=""></div>',
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["jquery-ui", "slickgrid", "aggrid",
                        "js/base/ctrl_bill_public.js",
                        "js/base/ctrl_view_public.js",
                        "js/base/ctrl_bill_wfaudit.js"
                    ]);
                }
            }
        })
        .state('crmman.mywork1', {
            url: "/mywork1",
            templateUrl: "views/mywork/mywork_uncheck.html?v=" + window.rev,

            data: {
                pageTitle: '当前待批的流程'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/workhits_uncheck.js?v=' + window.rev]
                    });
                }
            }
        })
        .state('crmman.chgpsw', {
            url: "/chgpsw",
            templateUrl: "views/mywork/chgpsw.html?v=" + window.rev,

            data: {
                pageTitle: 'chgpsw'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/workhits.js?v=' + window.rev]
                    });
                }
            }
        })
        .state('crmman.mywork2', {
            url: "/mywork2",
            templateUrl: "views/mywork/mywork_unachieve.html?v=" + window.rev,

            data: {
                pageTitle: '未到达流程'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/workhits_unachieve.js?v=' + window.rev]
                    });
                }
            }
        })
        .state('crmman.mywork3', {
            url: "/mywork3",
            templateUrl: "views/mywork/mywork_mystart.html?v=" + window.rev,

            data: {
                pageTitle: '我启的流程'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/workhits_mystart.js?v=' + window.rev]
                    });
                }
            }
        })
        .state('crmman.mywork4', {
            url: "/mywork4",
            templateUrl: "views/mywork/mywork_finished.html?v=" + window.rev,

            data: {
                pageTitle: '已完成流程'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/workhits_finished.js?v=' + window.rev]
                    });
                }
            }
        })
        .state('crmman.info_share', {
            url: "/info_share",
            templateUrl: "views/mywork/info_share.html?v=" + window.rev,

            data: {
                pageTitle: '共享资料'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(["ajaxfileupload", {
                        name: 'inspinia',
                        files: ['js/controllers/mywork/info_share.js?v=' + window.rev]
                    }]);
                }
            }
        })
        .state('crmman.myhome', {
            url: "/myhome",
            templateUrl: "views/mywork/oa_myhome.html?v=" + window.rev,
            data: {
                pageTitle: '首页'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: [/*'lib/echarts/echarts.js?v=' + window.rev,*/ 'js/controllers/mywork/oa_myhome.js?v=' + window.rev]
                    });
                }
            }
        })
        .state('crmman.home', {
            url: "/home",
            templateUrl: "views/mywork/oa_home.html?v=" + window.rev,

            data: {
                pageTitle: '公司首页'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/oa_home.js?v=' + window.rev]
                    });
                }
            }
        })

        .state('crmman.manage_home', {
            url: "/manage_home",
            templateUrl: "views/mywork/manage_home.html?v=" + window.rev,

            data: {
                pageTitle: '管理首页'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mywork/manage_home.js?v=' + window.rev]
                    });
                }
            }
        })
        /**********************************权限设置****************************************/
        .state('crmman.base_drp_cust', {
            url: "/base_drp_cust",
            templateUrl: "views/baseman/mail.html?v=" + window.rev,
            data: {
                pageTitle: '邮箱'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/mail.js?v=' + window.rev]
                    });
                }
            }
        })
        .state("crmman.files", {
            url: "/files",
            templateUrl: "views/baseman/company_files.html?v=" + window.rev,
            data: {
                pageTitle: '公司文件'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/compfiles.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("crmman.myfiles", {
            url: "/myfiles",
            templateUrl: "views/baseman/myfiles.html?v=" + window.rev,
            data: {
                pageTitle: '我的文件'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/myfiles.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("crmman.base_org", {
            url: "/base_org",
            templateUrl: "views/baseman/base_org.html?v=" + window.rev,
            data: {
                pageTitle: '机构'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(["ztree",
                            {
                                name: 'inspinia',
                                files: ['js/controllers/baseman/base_org.js?v=' + window.rev]
                            }
                        ]
                    );
                }
            }
        })
        .state("crmman.base_position", {
            url: "/base_position",
            templateUrl: "views/baseman/base_position.html?v=" + window.rev,
            data: {
                pageTitle: '岗位'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["ztree",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/base_position.js?v=' + window.rev]
                        }]
                    );
                }
            }
        })
        .state("crmman.base_role", {
            url: "/base_role",
            templateUrl: "views/baseman/base_role.html?v=" + window.rev,
            data: {
                pageTitle: '角色'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(["ztree",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/base_role.js?v=' + window.rev]
                        }]
                    );
                }
            }
        })
        .state("crmman.base_flow", {
            url: "/base_flow",
            templateUrl: "views/baseman/base_flow.html?v=" + window.rev,
            data: {
                pageTitle: '流程'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(["ztree",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/base_flow.js?v=' + window.rev]
                        }]
                    );
                }
            }
        })
        .state("crmman.base_code", {
            url: "/base_code",
            templateUrl: "views/baseman/base_code.html?v=" + window.rev,
            data: {
                pageTitle: '编码'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/base_code.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("crmman.sys_param", {
            url: "/sys_param",
            templateUrl: "views/baseman/sys_param.html?v=" + window.rev,
            data: {
                pageTitle: '系统参数'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/sys_param.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("crmman.authority_con", {
            url: "/authority_con",
            templateUrl: "views/baseman/authority_con.html?v=" + window.rev,
            data: {
                pageTitle: '部门访问权限'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/authority_con.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("crmman.scpobjconf", {
            url: "/scpobjconf",
            templateUrl: "views/baseman/scpobjconf.html?v=" + window.rev,
            data: {
                pageTitle: '对象配置'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/scpobjconf.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("crmman.scpscheduler", {
            url: "/scpscheduler",
            templateUrl: "views/baseman/scpscheduler.html?v=" + window.rev,
            data: {
                pageTitle: '调度管理'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/scpscheduler.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("crmman.scpintf", {
            url: "/scpintf",
            templateUrl: "views/baseman/scpintf.html?v=" + window.rev,
            data: {
                pageTitle: '接口定义'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/scpintf.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("crmman.sys_mod", {
            url: "/sys_mod",
            templateUrl: "views/baseman/sys_mod.html?v=" + window.rev,
            data: {
                pageTitle: '模块定义'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["ztree",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/sys_mod.js?v=' + window.rev]
                        }]
                    );
                }
            }
        })
        .state("crmman.sys_menu", {
            url: "/sys_menu",
            templateUrl: "views/baseman/sys_menu.html?v=" + window.rev,
            data: {
                pageTitle: '菜单定义'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["ztree",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/sys_menu.js?v=' + window.rev]
                        }]
                    );
                }
            }
        })
        .state("crmman.scpdict", {
            url: "/scpdict",
            templateUrl: "views/baseman/scpdict.html?v=" + window.rev,
            data: {
                pageTitle: '系统词汇'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["ztree",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/scpdict.js?v=' + window.rev]
                        }]
                    );
                }
            }
        })
        .state('crmman.sht', {
            url: "/sht/:shtid",
            templateUrl: "views/baseman/sht_view.html?v=" + window.rev,
            data: {
                pageTitle: '表单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/base_shtcontroner.js?v=' + window.rev]
                    });
                }
            }
        })
        .state("crmman.wfsht", {
            url: "/wfsht",
            templateUrl: "views/mywork/wfsht.html?v=" + window.rev,
            data: {
                pageTitle: '表单审批'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/mywork/wfsht.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("crmman.wffile", {
            url: "/wffile",
            templateUrl: "views/mywork/wffile.html?v=" + window.rev,
            data: {
                pageTitle: '文件审批'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/mywork/wffile.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        //查看流程页面
        .state("crmman.flow_path", {
            url: "/flow_path",
            templateUrl: "views/mywork/flow_path.html?v=" + window.rev,
            data: {
                pageTitle: '更多流程'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/mywork/flow_path.js?v=' + window.rev]
                        }
                    );
                }
            }
        })

        .state("crmman.resource", {
            url: "/resource",
            templateUrl: "views/mywork/resource.html?v=" + window.rev,
            data: {
                pageTitle: '资源管理'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/mywork/resource.js?v=' + window.rev]
                        }
                    );
                }
            }
        })




        //流程页面
        .state("crmman.wfform", {
            url: "/wfform/:wftempid/:fdrid",
            templateUrl: "views/baseman/base_wf.html?v=" + window.rev,
            data: {
                pageTitle: '流程'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["gooflow",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/ctrl_base_wf.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //流程实例页面
        .state("crmman.wfins", {
            url: "/wfins/:wftempid/:wfid/:objtypeid/:objid/:submit",
            templateUrl: "views/baseman/base_wfexec.html?v=" + window.rev,
            data: {
                pageTitle: '流程实例'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["gooflow", {
                        name: 'inspinia',
                        files: ['js/controllers/baseman/ctrl_base_wfexec.js?v=' + window.rev]
                    }]);
                }
            }
        })
        //销售管理页面
        .state("crmman.sale_yeartask_head", {
            url: "/sale_yeartask_head",
            templateUrl: "views/saleman/sale_yeartask_head.html?v=" + window.rev,
            data: {
                pageTitle: '年度销售任务'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/saleman/sale_yeartask_head.js?v=' + window.rev]
                    });
                }
            }
        })

        //附件
        .state("crmman.bbsattach", {
            url: "/bbsattach/:id",
            templateUrl: "views/finman/mkt_loan_bill.html?v=" + window.rev,
            data: {
                pageTitle: '附件'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/finman/mkt_loan_bill.js?v=' + window.rev]
                    });
                }
            }
        })

        //产品分类首页
        .state("baseman.item_class", {
            url: "/item_class",
            templateUrl: "views/baseman/item_class.html?v=" + window.rev,
            data: {
                pageTitle: '产品分类'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["ztree",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/item_class.js?v=' + window.rev]
                        }]
                    );
                }
            }
        })
        //产品分类详情页面
        .state("baseman.item_class_detail", {
            url: "/item_class_detail/:id",
            templateUrl: "views/baseman/item_class_pro.html?v=" + window.rev,
            data: {
                pageTitle: '产品分类详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/item_class_pro.js?v=' + window.rev]
                    });
                }
            }
        })
        .state("baseman.base_uom", {
            url: "/base_uom",
            templateUrl: "views/baseman/Base_Uom.html?v=" + window.rev,
            data: {
                pageTitle: '计量单位'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/base_uom.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("baseman.scparea", {
            url: "/scparea",
            templateUrl: "views/baseman/scparea.html?v=" + window.rev,
            data: {
                pageTitle: '行政区域'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["ztree",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/scparea.js?v=' + window.rev]
                        }]
                    );
                }
            }
        })

        //区域详情页面
        .state("baseman.scparea_pro", {
            url: "/scparea_pro/:id",
            templateUrl: "views/baseman/scparea_pro.html?v=" + window.rev,
            data: {
                pageTitle: '行政区域详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/scparea_pro.js?v=' + window.rev]
                    });
                }
            }
        })

        //个人设置
        .state("crmman.mysettings", {
            url: "/mysettings",
            templateUrl: "views/mywork/mysettings.html?v=" + window.rev,
            data: {
                pageTitle: '个人设置'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["ztree",{
                        name: 'inspinia',
                        files: ['js/controllers/mywork/my_settings.js?v=' + window.rev],
                    }]);
                }
            }
        })

        .state("baseman.warehouse", {
            url: "/warehouse",
            templateUrl: "views/baseman/warehouse.html?v=" + window.rev,
            data: {
                pageTitle: '仓库资料'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["ztree",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/warehouse.js?v=' + window.rev]
                        }]
                    );
                }
            }
        })

        //仓库资料详情页面
        .state("baseman.warehouse_pro", {
            url: "/warehouse_pro/:id",
            templateUrl: "views/baseman/warehouse_pro.html?v=" + window.rev,
            data: {
                pageTitle: '仓库资料详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/warehouse_pro.js?v=' + window.rev]
                    });
                }
            }
        })

        .state("baseman.sale_salearea", {
            url: "/sale_salearea",
            templateUrl: "views/baseman/sale_salearea.html?v=" + window.rev,
            data: {
                pageTitle: '销售区域'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/sale_salearea.js?v=' + window.rev]
                        }
                    );
                }
            }
        })

        //详情页面
        .state("baseman.sale_salearea_pro", {
            url: "/sale_salearea_pro/:id",
            templateUrl: "views/baseman/sale_salearea_pro.html?v=" + window.rev,
            data: {
                pageTitle: '销售区域'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/sale_salearea_pro.js?v=' + window.rev]
                    });
                }
            }
        })

        .state("baseman.sale_employee", {
            url: "/sale_employee",
            templateUrl: "views/baseman/sale_employee.html?v=" + window.rev,
            data: {
                pageTitle: '业务员资料'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/sale_employee.js?v=' + window.rev]
                        }
                    );
                }
            }
        })

        //详情页面
        .state("baseman.sale_employee_pro", {
            url: "/sale_employee_pro/:id",
            templateUrl: "views/baseman/sale_employee_pro.html?v=" + window.rev,
            data: {
                pageTitle: '业务员资料'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/sale_employee_pro.js?v=' + window.rev]
                    });
                }
            }
        })
        .state("baseman.sa_saleprice_type", {
            url: "/sa_saleprice_type",
            templateUrl: "views/baseman/sa_saleprice_type.html?v=" + window.rev,
            data: {
                pageTitle: '价格类型'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/sa_saleprice_type.js?v=' + window.rev]
                        }
                    );
                }
            }
        })

        .state("baseman.item_org", {
            url: "/item_org",
            templateUrl: "views/baseman/item_org.html?v=" + window.rev,
            data: {
                pageTitle: '产品资料'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/item_org.js?v=' + window.rev]
                        }
                    );
                }
            }
        })

        //详情页面
        .state("baseman.item_org_pro", {
            url: "/item_org_pro/:id",
            templateUrl: "views/baseman/item_org_pro.html?v=" + window.rev,
            data: {
                pageTitle: '产品资料'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/item_org_pro.js?v=' + window.rev]
                    });
                }
            }
        })
        .state("baseman.customer", {
            url: "/customer",
            templateUrl: "views/baseman/customer.html?v=" + window.rev,
            data: {
                pageTitle: '客户资料'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/customer.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("baseman.customer_pro", {
            url: "/customer_pro/:id",
            templateUrl: "views/baseman/customer_pro.html?v=" + window.rev,
            data: {
                pageTitle: '客户资料'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/customer_pro.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        //仓库访问权限
        .state("baseman.warehouse_authority", {
            url: "/warehouse_authority",
            templateUrl: "views/baseman/warehouse_authority.html?v=" + window.rev,
            data: {
                pageTitle: '仓库访问权限'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/baseman/warehouse_authority.js?v=' + window.rev]
                    });
                }
            }
        })
        .state("saleman.sa_saleprice_head", {
            url: "/sa_saleprice_head",
            templateUrl: "views/saleman/sa_saleprice_head.html?v=" + window.rev,
            data: {
                pageTitle: '销售价目表'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        ["ajaxfileupload",
                            {
                                name: 'inspinia',
                                files: ['js/controllers/saleman/sa_saleprice_head.js?v=' + window.rev]
                            }]
                    );
                }
            }
        })
        //销售价格列表查询
        .state("saleman.sa_saleprice_list", {
            url: "/sa_saleprice_list",
            templateUrl: "views/saleman/sa_saleprice_list.html?v=" + window.rev,
            data: {
                pageTitle: '销售价格查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/sa_saleprice_list.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("saleman.sa_saleprice_head_special", {
            url: "/sa_saleprice_head_special",
            templateUrl: "views/saleman/sa_saleprice_head_special.html?v=" + window.rev,
            data: {
                pageTitle: '客户特价申请'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        ["ajaxfileupload",
                            {
                                name: 'inspinia',
                                files: ['js/controllers/saleman/sa_saleprice_head_special.js?v=' + window.rev]
                            }]
                    );
                }
            }
        })
        .state("saleman.sa_saleprice_special_pro", {
            url: "/sa_saleprice_special_pro/:id",
            templateUrl: "views/saleman/sa_saleprice_special_pro.html?v=" + window.rev,
            data: {
                pageTitle: '客户特价申请'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/sa_saleprice_special_pro.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("saleman.sa_saleprice_head_project", {
            url: "/sa_saleprice_head_project",
            templateUrl: "views/saleman/sa_saleprice_head_project.html?v=" + window.rev,
            data: {
                pageTitle: '工程特价申请'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/sa_saleprice_head_project.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("saleman.sa_saleprice_project_bill", {
            url: "/sa_saleprice_project_bill/:id",
            templateUrl: "views/saleman/sa_saleprice_project_bill.html?v=" + window.rev,
            data: {
                pageTitle: '工程特价申请'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/sa_saleprice_project_bill.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("saleman.sa_saleprice_pro", {
            url: "/sa_saleprice_pro/:id",
            templateUrl: "views/saleman/sa_saleprice_pro.html?v=" + window.rev,
            data: {
                pageTitle: '销售价格'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["ajaxfileupload",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/sa_saleprice_pro.js?v=' + window.rev]
                        }]
                    );
                }
            }
        })

        //价格管理（关闭/打开）
        .state("saleman.sa_saleprice_man", {
            url: "/sa_saleprice_man",
            templateUrl: "views/saleman/sa_saleprice_man.html?v=" + window.rev,
            data: {
                pageTitle: '价格关闭/启用'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/sa_saleprice_man.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("saleman.sa_out_bill_head", {
            url: "/sa_out_bill_head",
            templateUrl: "views/saleman/sa_out_bill_head.html?v=" + window.rev,
            data: {
                pageTitle: '订货申请'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/sa_out_bill_head.js?v=' + window.rev]
                        }
                    );
                }
            }
        })

        .state("saleman.sa_out_bill_pro", {
            url: "/sa_out_bill_pro/:id",
            templateUrl: "views/saleman/sa_out_bill_pro.html?v=" + window.rev,
            data: {
                pageTitle: '订货申请'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["ajaxfileupload",
                            {
                                name: 'inspinia',
                                files: ['js/controllers/saleman/sa_out_bill_pro.js?v=' + window.rev]
                            }
                        ]
                    );
                }
            }
        })

        /*.state("saleman.crm_project_header", {
            url: "/crm_project_header",
            templateUrl: "views/saleman/crm_project_header.html?v=" + window.rev,
            data: {
                pageTitle: '工程项目报备'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/crm_project_header.js?v=' + window.rev]
                        }
                    );
                }
            }
        })

        .state("saleman.crm_project_bill", {
            url: "/crm_project_bill/:id",
            templateUrl: "views/saleman/crm_project_bill.html?v=" + window.rev,
            data: {
                pageTitle: '工程项目报备'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/crm_project_bill.js?v=' + window.rev]
                        }
                    );
                }
            }
        })

        .state("saleman.crm_project_process_header", {
            url: "/crm_project_process_header",
            templateUrl: "views/saleman/crm_project_process_header.html?v=" + window.rev,
            data: {
                pageTitle: '工程项目进度登记'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/crm_project_process_header.js?v=' + window.rev]
                        }
                    );
                }
            }
        })

        .state("saleman.crm_project_process_bill", {
            url: "/crm_project_process_bill/:id",
            templateUrl: "views/saleman/crm_project_process_bill.html?v=" + window.rev,
            data: {
                pageTitle: '工程项目进度登记'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/crm_project_process_bill.js?v=' + window.rev]
                        }
                    );
                }
            }
        })

        .state("saleman.sa_proj_pre_order_header", {
            url: "/sa_proj_pre_order_header",
            templateUrl: "views/saleman/sa_proj_pre_order_header.html?v=" + window.rev,
            data: {
                pageTitle: '工程预订单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/sa_proj_pre_order_header.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("saleman.sa_proj_pre_order_bill", {
            url: "/sa_proj_pre_order_bill/:id",
            templateUrl: "views/saleman/sa_proj_pre_order_bill.html?v=" + window.rev,
            data: {
                pageTitle: '工程预订单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/sa_proj_pre_order_bill.js?v=' + window.rev]
                        }
                    );
                }
            }
        })*/

        //客户回款单
        .state("finman.fd_fund_business", {
            url: "/fd_fund_business",
            templateUrl: "views/finman/fd_fund_business.html?v=" + window.rev,
            data: {
                pageTitle: '客户回款单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fd_fund_business.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        //月度提货计划
        .state("saleman.drp_custforecast_mth_header", {
            url: "/drp_custforecast_mth_header",
            templateUrl: "views/saleman/drp_custforecast_mth_header.html?v=" + window.rev,
            data: {
                pageTitle: '月度提货计划'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/drp_custforecast_mth_header.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        .state("saleman.drp_custforecast_mth_bill", {
            url: "/drp_custforecast_mth_bill/:id",
            templateUrl: "views/saleman/drp_custforecast_mth_bill.html?v=" + window.rev,
            data: {
                pageTitle: '月度提货计划'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/drp_custforecast_mth_bill.js?v=' + window.rev]
                        }
                    );
                }
            }
        })

        //工程回款单
        .state("finman.fd_verification_head", {
            url: "/fd_verification_head",
            templateUrl: "views/finman/fd_verification_head.html?v=" + window.rev,
            data: {
                pageTitle: '工程回款核销'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fd_verification_head.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        //销售出库单
        .state("saleman.inv_out_bill_head", {
            url: "/inv_out_bill_head",
            templateUrl: "views/saleman/inv_out_bill_head.html?v=" + window.rev,
            data: {
                pageTitle: '销售出库单'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/inv_out_bill_head.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        //送货单签收
        .state("saleman.drp_diffprocbill_header", {
            url: "/drp_diffprocbill_header",
            templateUrl: "views/saleman/drp_diffprocbill_header.html?v=" + window.rev,
            data: {
                pageTitle: '送货单签收'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/drp_diffprocbill_header.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        //送货单签收详情
        .state("saleman.drp_diffprocbill_bill", {
            url: "/drp_diffprocbill_bill/:id",
            templateUrl: "views/saleman/drp_diffprocbill_bill.html?v=" + window.rev,
            data: {
                pageTitle: '送货单签收详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/drp_diffprocbill_bill.js?v=' + window.rev]
                        }
                    );
                }
            }
        })

        //订单进度跟踪表
        .state("saleman.order_progress_following", {
            url: "/order_progress_following",
            templateUrl: "views/saleman/order_progress_following.html?v=" + window.rev,
            data: {
                pageTitle: '订单进度跟踪表'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/saleman/order_progress_following.js?v=' + window.rev]
                        }
                    );
                }
            }
        })

        //客户返利查询
        .state("finman.fd_month_rebate_search", {
            url: "/fd_month_rebate_search",
            templateUrl: "views/finman/fd_month_rebate.html?v=" + window.rev,
            data: {
                pageTitle: '客户返利查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fd_month_rebate.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        //驻外人员设置
        .state("baseman.personnel_association_outside", {
            url: "/personnel_association_outside",
            templateUrl: "views/baseman/personnel_association.html?v=" + window.rev,
            data: {
                pageTitle: '驻外人员设置'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/personnel_association.js?v=' + window.rev]
                        }
                    );
                }
            }
        })
        //报备专员设置
        .state("baseman.personnel_association_report", {
            url: "/personnel_association_report",
            templateUrl: "views/baseman/personnel_association.html?v=" + window.rev,
            data: {
                pageTitle: '报备专员设置'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(
                        {
                            name: 'inspinia',
                            files: ['js/controllers/baseman/personnel_association.js?v=' + window.rev]
                        }
                    );
                }
            }
        })

        /*-----------------------------预算费用系统模块-------------------------------*/
        //--------------------基础资料----------------------------
        //预算期间
        .state("crmman.fin_bud_period_header", {
            url: "/fin_bud_period_header",
            templateUrl: "views/finman/fin_bud_period_header.html?v=" + window.rev,
            data: {
                pageTitle: '预算期间'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(["bt-datepicker", "slickgrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_period_header.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //预算类别
        .state("crmman.fin_bud_type_header", {
            url: "/fin_bud_type_header",
            templateUrl: "views/finman/fin_bud_type_header.html?v=" + window.rev,
            data: {
                pageTitle: '预算类别'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(["slickgrid", "aggrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_type_header.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //费用类别
        .state("crmman.fin_fee_type", {
            url: "/fin_fee_type",
            templateUrl: "views/finman/fin_fee_type.html?v=" + window.rev,
            data: {
                pageTitle: '费用类别'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["slickgrid", "ztree",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_type.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //费用项目
        .state("crmman.fin_fee_header", {
            url: "/fin_fee_header",
            templateUrl: "views/finman/fin_fee_header.html?v=" + window.rev,
            data: {
                pageTitle: '费用项目'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["slickgrid", "aggrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_header.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //预算结转
        .state("crmman.fin_bud_carryover", {
            url: "/fin_bud_carryover",
            templateUrl: "views/finman/fin_bud_carryover.html?v=" + window.rev,
            data: {
                pageTitle: '预算结转'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(["slickgrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_carryover.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //--------------------编制、调整----------------------------
        //预算编制
        .state("crmman.fin_bud_make", {
            url: "/fin_bud_make",
            templateUrl: "views/finman/fin_bud_make.html?v=" + window.rev,
            data: {
                pageTitle: '预算编制'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(["slickgrid", 'aggrid',
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_make.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //预算编制—变动
        .state("crmman.fin_bud_make_chang", {
            url: "/fin_bud_make_chang",
            templateUrl: "views/finman/fin_bud_make_chang.html?v=" + window.rev,
            data: {
                pageTitle: '预算编制-变动'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(["slickgrid", "aggrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_make_chang.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //预算调整
        .state("crmman.fin_bud_adjust_header", {
            url: "/fin_bud_adjust_header",
            templateUrl: "views/finman/fin_bud_adjust_header.html?v=" + window.rev,
            data: {
                pageTitle: '预算调整'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(["slickgrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_adjust_header.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //--------------------详情页----------------------------
        //费用申请详情页面
        .state("crmman.feeapply", {
            url: "/feeapply/:id",
            templateUrl: "views/finman/fin_fee_apply_bill.html?v=" + window.rev,
            data: {
                pageTitle: '费用申请详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["bt-datetimepicker", "aggrid", "ajaxfileupload", {
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_fee_apply_bill.js?v=' + window.rev, 'js/Lodop/LodopFuncs.js']
                    }]);
                }
            }
        })
        //费用报销详情页面
        .state("crmman.feebx", {
            url: "/feebx/:id",
            templateUrl: "views/finman/fin_fee_bx_bill.html?v=" + window.rev,
            data: {
                pageTitle: '费用报销详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["bt-datetimepicker", "ajaxfileupload", "aggrid", {
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_fee_bx_bill.js?v=' + window.rev, 'js/Lodop/LodopFuncs.js']
                    }]);
                }
            }
        })
        //预算调整详情页面
        .state("crmman.finbudadjust", {
            url: "/finbudadjust/:id",
            templateUrl: "views/finman/fin_bud_adjust_bill.html?v=" + window.rev,
            data: {
                pageTitle: '预算调整详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["slickgrid", "aggrid", {
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_bud_adjust_bill.js?v=' + window.rev, 'js/Lodop/LodopFuncs.js']
                    }]);
                }
            }
        })
        //--------------------申请、报销、结案----------------------------
        //费用申请
        .state("crmman.fin_fee_apply_header", {
            url: "/fin_fee_apply_header",
            templateUrl: "views/finman/fin_fee_apply_header.html?v=" + window.rev,
            data: {
                pageTitle: '费用申请'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    // $ocLazyLoad.load('aggrid');
                    return $ocLazyLoad.load(["bt-datetimepicker",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_apply_header.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //费用报销
        .state("crmman.fin_fee_bx_header", {
            url: "/fin_fee_bx_header",
            templateUrl: "views/finman/fin_fee_bx_header.html?v=" + window.rev,
            data: {
                pageTitle: '费用报销'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["bt-datetimepicker",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_bx_header.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //费用申请结案
        .state("crmman.fin_fee_apply_header_over", {
            url: "/fin_fee_apply_header_over",
            templateUrl: "views/finman/fin_fee_apply_header_over.html?v=" + window.rev,
            data: {
                pageTitle: '费用申请结案'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["slickgrid", "aggrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_apply_header_over.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //--------------------报表----------------------------
        //费用报销查询
        .state("crmman.fin_fee_bx_header_search", {
            url: "/fin_fee_bx_header_search",
            templateUrl: "views/finman/fin_fee_bx_header_search.html?v=" + window.rev,
            data: {
                pageTitle: '费用报销查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["slickgrid", "aggrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_bx_header_search.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })

        /*------------------------------end-------------------------------------------*/

        /*-----------------------------工程费用管理模块-------------------------------*/

        //--------------------基础资料----------------------------
        //预算期间
        .state("saleman.proj_bud_period_header", {
            url: "/proj_bud_period_header",
            templateUrl: "views/finman/fin_bud_period_header.html?v=" + window.rev,
            data: {
                pageTitle: '预算期间'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(["bt-datepicker", "slickgrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_period_header.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //预算类别
        .state("saleman.proj_bud_type_header", {
            url: "/proj_bud_type_header",
            templateUrl: "views/finman/fin_bud_type_header.html?v=" + window.rev,
            data: {
                pageTitle: '预算类别'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(["slickgrid", "aggrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_type_header.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //费用类别
        .state("saleman.proj_fee_type", {
            url: "/proj_fee_type",
            templateUrl: "views/finman/fin_fee_type.html?v=" + window.rev,
            data: {
                pageTitle: '费用类别'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["slickgrid", "ztree",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_type.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //费用项目
        .state("saleman.proj_fee_header", {
            url: "/proj_fee_header",
            templateUrl: "views/finman/fin_fee_header.html?v=" + window.rev,
            data: {
                pageTitle: '费用项目'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["slickgrid", "aggrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_header.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //--------------------详情页----------------------------
        //费用申请详情页面
        .state("saleman.projfeeapply", {
            url: "/projfeeapply/:id",
            templateUrl: "views/finman/fin_fee_apply_bill.html?v=" + window.rev,
            data: {
                pageTitle: '工程费用申请详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["bt-datetimepicker", "aggrid", "ajaxfileupload", {
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_fee_apply_bill.js?v=' + window.rev, 'js/Lodop/LodopFuncs.js']
                    }]);
                }
            }
        })
        //费用报销详情页面
        .state("saleman.projfeebx", {
            url: "/projfeebx/:id",
            templateUrl: "views/finman/fin_fee_bx_bill.html?v=" + window.rev,
            data: {
                pageTitle: '工程费用报销详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["bt-datetimepicker", "ajaxfileupload", "aggrid", {
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_fee_bx_bill.js?v=' + window.rev, 'js/Lodop/LodopFuncs.js']
                    }]);
                }
            }
        })
        //--------------------申请、报销、结案----------------------------
        //费用申请
        .state("saleman.proj_fee_apply_header", {
            url: "/proj_fee_apply_header",
            templateUrl: "views/finman/fin_fee_apply_header.html?v=" + window.rev,
            data: {
                pageTitle: '工程费用申请'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    // $ocLazyLoad.load('aggrid');
                    return $ocLazyLoad.load(["bt-datetimepicker",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_apply_header.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //费用报销
        .state("saleman.proj_fee_bx_header", {
            url: "/proj_fee_bx_header",
            templateUrl: "views/finman/fin_fee_bx_header.html?v=" + window.rev,
            data: {
                pageTitle: '工程费用报销'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["bt-datetimepicker",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_bx_header.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //费用申请结案
        .state("saleman.proj_fee_apply_header_over", {
            url: "/proj_fee_apply_header_over",
            templateUrl: "views/finman/fin_fee_apply_header_over.html?v=" + window.rev,
            data: {
                pageTitle: '工程费用结案'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["slickgrid", "aggrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_apply_header_over.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //--------------------报表----------------------------
        //费用报销查询
        .state("saleman.proj_fee_bx_header_search", {
            url: "/proj_fee_bx_header_search",
            templateUrl: "views/finman/fin_fee_bx_header_search.html?v=" + window.rev,
            data: {
                pageTitle: '费用报销查询'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["slickgrid", "aggrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_bx_header_search.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })

        /*----------------------------------------end---------------------------------------*/

        /*------------------------------------市场资源费用管理-----------------------------*/
        //--------------------基础资料----------------------------
        //预算期间
        .state("mktman.mkt_bud_period_header", {
            url: "/mkt_bud_period_header",
            templateUrl: "views/finman/fin_bud_period_header.html?v=" + window.rev,
            data: {
                pageTitle: '资源期间设置'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(["bt-datepicker", "slickgrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_period_header.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //预算类别
        .state("mktman.mkt_bud_type_header", {
            url: "/mkt_bud_type_header",
            templateUrl: "views/finman/fin_bud_type_header.html?v=" + window.rev,
            data: {
                pageTitle: '市场预算类别'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(["slickgrid", "aggrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_type_header.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //费用类别
        .state("mktman.mkt_fee_type", {
            url: "/mkt_fee_type",
            templateUrl: "views/finman/fin_fee_type.html?v=" + window.rev,
            data: {
                pageTitle: '市场费用类别'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["slickgrid", "ztree",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_type.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //费用项目
        .state("mktman.mkt_fee_header", {
            url: "/mkt_fee_header",
            templateUrl: "views/finman/fin_fee_header.html?v=" + window.rev,
            data: {
                pageTitle: '市场费用项目'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["slickgrid", "aggrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_header.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //预算结转
        .state("mktman.mkt_bud_carryover", {
            url: "/mkt_bud_carryover",
            templateUrl: "views/finman/fin_bud_carryover.html?v=" + window.rev,
            data: {
                pageTitle: '资源预算结转'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(["slickgrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_carryover.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //--------------------编制、调整----------------------------
        //预算编制
        .state("mktman.mkt_bud_make", {
            url: "/mkt_bud_make",
            templateUrl: "views/finman/fin_bud_make.html?v=" + window.rev,
            data: {
                pageTitle: '资源预算编制'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(["slickgrid", 'aggrid',
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_make.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //预算调整
        .state("mktman.mkt_bud_adjust_header", {
            url: "/mkt_bud_adjust_header",
            templateUrl: "views/finman/fin_bud_adjust_header.html?v=" + window.rev,
            data: {
                pageTitle: '资源预算调整'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(["slickgrid",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_bud_adjust_header.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
        //--------------------详情页----------------------------
        //门店装修申请详情页
        .state("mktman.decoratefeeapply", {
            url: "/decoratefeeapply/:id",
            templateUrl: "views/mktman/decorate_fee_apply_bill.html?v=" + window.rev,
            data: {
                pageTitle: '费用申请详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["bt-datetimepicker", "aggrid", "ajaxfileupload", {
                        name: 'inspinia',
                        files: ['js/controllers/mktman/decorate_fee_apply_bill.js?v=' + window.rev, 'js/Lodop/LodopFuncs.js']
                    }]);
                }
            }
        })
        //广告投放申请详情页
        .state("mktman.advertfeeapply", {
            url: "/advertfeeapply/:id",
            templateUrl: "views/finman/fin_fee_apply_bill.html?v=" + window.rev,
            data: {
                pageTitle: '费用申请详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["bt-datetimepicker", "aggrid", "ajaxfileupload", {
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_fee_apply_bill.js?v=' + window.rev, 'js/Lodop/LodopFuncs.js']
                    }]);
                }
            }
        })
        //推广活动申请详情页
        .state("mktman.extendfeeapply", {
            url: "/extendfeeapply/:id",
            templateUrl: "views/finman/fin_fee_apply_bill.html?v=" + window.rev,
            data: {
                pageTitle: '费用申请详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["bt-datetimepicker", "aggrid", "ajaxfileupload", {
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_fee_apply_bill.js?v=' + window.rev, 'js/Lodop/LodopFuncs.js']
                    }]);
                }
            }
        })
        //装修申请报销详情页
        .state("mktman.decoratefeebx", {
            url: "/decoratefeebx/:id",
            templateUrl: "views/finman/fin_fee_bx_bill.html?v=" + window.rev,
            data: {
                pageTitle: '费用报销详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["bt-datetimepicker", "ajaxfileupload", "aggrid", {
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_fee_bx_bill.js?v=' + window.rev, 'js/Lodop/LodopFuncs.js']
                    }]);
                }
            }
        })
        //广告申请报销详情页
        .state("mktman.advertfeebx", {
            url: "/advertfeebx/:id",
            templateUrl: "views/finman/fin_fee_bx_bill.html?v=" + window.rev,
            data: {
                pageTitle: '费用报销详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["bt-datetimepicker", "ajaxfileupload", "aggrid", {
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_fee_bx_bill.js?v=' + window.rev, 'js/Lodop/LodopFuncs.js']
                    }]);
                }
            }
        })
        //推广申请报销详情页
        .state("mktman.extendfeebx", {
            url: "/extendfeebx/:id",
            templateUrl: "views/finman/fin_fee_bx_bill.html?v=" + window.rev,
            data: {
                pageTitle: '费用报销详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["bt-datetimepicker", "ajaxfileupload", "aggrid", {
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_fee_bx_bill.js?v=' + window.rev, 'js/Lodop/LodopFuncs.js']
                    }]);
                }
            }
        })
        //预算调整详情页面
        .state("mktman.mktbudadjust", {
            url: "/mktbudadjust/:id",
            templateUrl: "views/finman/fin_bud_adjust_bill.html?v=" + window.rev,
            data: {
                pageTitle: '预算调整详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["slickgrid", "aggrid", {
                        name: 'inspinia',
                        files: ['js/controllers/finman/fin_bud_adjust_bill.js?v=' + window.rev, 'js/Lodop/LodopFuncs.js']
                    }]);
                }
            }
        })
        //推广费用核销
        .state("mktman.extend_fee_bx_header", {
            url: "/extend_fee_bx_header",
            templateUrl: "views/finman/fin_fee_bx_header.html?v=" + window.rev,
            data: {
                pageTitle: '推广费用核销'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load(["bt-datetimepicker",
                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_bx_header.js?v=' + window.rev]
                        }
                    ]);
                }
            }
        })
    /*----------------------------------------end-------------------------------------*/

        //经销商资料详情页面
        .state("mktman.customer_org_pro", {
            url: "/customer_org_pro/:id",
            templateUrl: "views/mktman/customer_org_pro.html?v=" + window.rev,
            data: {
                pageTitle: '经销商资料详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mktman/customer_org_pro.js?v=' + window.rev]
                    });
                }
            }
        })
        // //经销商资料详情页面
        // .state("mktman.customer_org", {
        //     url: "/customer_org/:id",
        //     templateUrl: "views/mktman/customer_org.html?v=" + window.rev,
        //     data: {
        //         pageTitle: '经销商资料'
        //     },
        //     resolve: {
        //         load: function ($templateCache, $ocLazyLoad, $q, $http) {
        //             lazyDeferred = $q.defer();
        //             return $ocLazyLoad.load({
        //                 name: 'inspinia',
        //                 files: ['js/controllers/mktman/customer_org.js?v=' + window.rev]
        //             });
        //         }
        //     }
        // })
        //网点授权管理详情页面
        .state("mktman.mkt_terminal_manager_pro", {
            url: "/mkt_terminal_manager_pro/:id",
            templateUrl: "views/mktman/mkt_terminal_manager_pro.html?v=" + window.rev,
            data: {
                pageTitle: '网点授权管理详情'
            },
            resolve: {
                load: function ($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load({
                        name: 'inspinia',
                        files: ['js/controllers/mktman/mkt_terminal_manager_pro.js?v=' + window.rev]
                    });
                }
            }
        })
    ;


    /**
     * 简易路由配置器
     * 实际是上面的配置方式抽象共同点而成
     * 符合规范的菜单可用此工具简单配置 {
     *     pkg: 包名
     *     name: 文件名(html和js名称要一致)
     *     title: 标题
     *     needId: 是否需要ID参数
     *     params: 除ID外的参数，字符串数组
     *     files: 需加载文件，字符串数组
     * }
     * 需要特殊或复杂的配置的话，请仍旧按上面的方式配置
     * @since 2018-05-16
     * @return {this}
     */
    ({
        state: function (stateOption) {
            var url = '/' + stateOption.name + (stateOption.needId ? '/:id' : '');

            if (angular.isArray(stateOption.params) && stateOption.params.length)
                url = stateOption.params.reduce(function (url, param) {
                    return url + '/:' + param;
                }, url);

            var files;
            if (stateOption.files)
                files = stateOption
                    .files
                    .map(function (name) {
                        if (name.endsWith('.js'))
                            return name + '?v=' + window.rev;
                        else
                            return name;
                    });
            else
                files = [];

            files.push('js/controllers/' + stateOption.pkg + '/' + stateOption.name + '.js?v=' + window.rev);

            $stateProvider.state(stateOption.pkg + '.' + stateOption.name, {
                url: url,//'/' + stateOption.name + (stateOption.needId ? '/:id' : ''),
                templateUrl: 'views/' + stateOption.pkg + '/' + stateOption.name + '.html?v=' + window.rev,
                data: {
                    pageTitle: stateOption.title
                },
                resolve: {
                    load: function ($ocLazyLoad, $q) {
                        lazyDeferred = $q.defer();
                        return $ocLazyLoad.load(files);
                    }
                }
            });

            return this;
        }
    })
        .state({
            pkg: 'baseman',
            name: 'z_test',
            title: '测试',
            needId: false
        })
        .state({
            pkg: 'saleman',
            name: 'crm_project_header',
            title: '工程项目报备',
            needId: false
        })
        .state({
            pkg: 'saleman',
            name: 'crm_project_bill',
            title: '工程项目报备',
            needId: true,
            files: ['ajaxfileupload']
        })
        /*.state({
            pkg: 'saleman',
            name: 'crm_project_process_header',
            title: '项目进度更新',
            needId: false
        })
        .state({
            pkg: 'saleman',
            name: 'crm_project_process_bill',
            title: '项目进度更新',
            needId: true
        })*/
        .state({
            pkg: 'saleman',
            name: 'sa_proj_pre_order_header',
            title: '工程预订单',
            needId: false
        })
        .state({
            pkg: 'saleman',
            name: 'sa_proj_pre_order_bill',
            title: '工程预订单',
            needId: true
        })
        .state({
            pkg: 'saleman',
            name: 'sa_project_process_record_head',
            title: '项目进度更新',
            needId: false
        })
        .state({
            pkg: 'saleman',
            name: 'sa_project_process_record_bill',
            title: '项目进度更新',
            needId: true
        })
        .state({
            pkg: 'saleman',
            name: 'proj_head',
            title: '工程项目'
        })
        .state({
            pkg: 'saleman',
            name: 'proj',
            title: '工程项目',
            needId: true,
            files: ['ajaxfileupload']
        })
        .state({
            pkg: 'saleman',
            name: 'proj_ecn',
            title: '工程项目变更',
            needId: true
        })
        .state({
            pkg: 'saleman',
            name: 'proj_import',
            title: '工程项目导入',
            files: ['ajaxfileupload']
        })
        .state({
            pkg: 'saleman',
            name: 'crm_project_view',
            title: '工程项目透视',
            needId: false,
            files: ['echarts'] //['lib/echarts/echarts.js']
        })
        .state({
            pkg: 'saleman',
            name: 'sale_statistics_analysis',
            title: '销售统计分析',
            needId: false,
            files: ['echarts'] //['lib/echarts/echarts.js']
        })
        .state({
            pkg: 'finman',
            name: 'fd_month_rebate',
            title: '客户返利结果',
            needId: false
        })
        .state({
            pkg: 'saleman',
            name: 'sa_order_plan_week',
            title: '提货计划提交',
            needId: false
        })
        .state({
            pkg: 'finman',
            name: 'fd_rebate_head',
            title: '工程返利申请',
            needId: false
        })
        .state({
            pkg: 'finman',
            name: 'fd_rebate_pro',
            title: '工程返利申请',
            needId: true
        })
        .state({
            pkg: 'finman',
            name: 'fd_current_account',
            title: '往来对账查询',
            needId: false
        })
        .state({
            pkg: 'baseman',
            name: 'authority_customer',
            title: '客户访问权限',
            needId: false
        })
        .state({
            pkg: 'saleman',
            name: 'sa_order_delivery_head',
            title: '订单交期反馈',
            needId: false,
            files: ['ajaxfileupload']
        })
        .state({
            pkg: 'saleman',
            name: 'sa_order_delivery_pro',
            title: '订单交期反馈',
            needId: true
        })
        .state({
            pkg: 'saleman',
            name: 'sa_order_delivery_view',
            title: '订单交期反馈',
            needId: true
        })
        .state({
            pkg: 'saleman',
            name: 'sa_order_delivery_change',
            title: '订单交期变更',
            needId: false
        })
        .state({
            pkg: 'mktman',
            name: 'mkt_terminal',
            title: '终端网点资料',
            needId: false,
            files: ['ajaxfileupload'] //['lib/echarts/echarts.js']
        })
        .state({
            pkg: 'mktman',
            name: 'mkt_terminal_manager',
            title: '网点授权管理',
            needId: false,
            files: ['ajaxfileupload'] //['lib/echarts/echarts.js']
        })
        .state({
            pkg: 'mktman',
            name: 'customer_org',
            title: '经销商资料',
            needId: false,
            files: ['ajaxfileupload'] //['lib/echarts/echarts.js']
        })
        .state({
            pkg: 'saleman',
            name: 'project_specialPrice_search',
            title: '工程特价查询',
            needId: false
        });
}

app.config(config).run(function ($rootScope, $state, $location) {
        $rootScope.$state = $state;
        if ($location.$$absUrl.indexOf("showmode=3") > -1) {
            $rootScope.showmode = 3;
        } else if ($location.search().showmode == '2') {
            $rootScope.showmode = 2;
        } else if ($location.search().showmode == '3') {
            $rootScope.showmode = 3;
        } else {
            $rootScope.showmode = 1;
            //angular.element('body').css("background-color","#2f4050");
        }
        $rootScope.gobackhome = function () {
            $state.go("crmman.main");
        };

        //路由开始变化事件
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            var title = 'CRM系统 | 首页';
            if (toState.data && toState.data.pageTitle) title = 'CRM系统 | ' + toState.data.pageTitle;
            $rootScope.$broadcast("page_stat", {
                toState: toState,
                toParams: toParams,
                fromState: fromState,
                fromParams: fromParams
            });
            console.log("broadcast stateChangeStart showmode："
                + $rootScope.showmode + "  toState: " + toState.name + "  fromState name: " + JSON.stringify(fromState) + "  href: " + window.location.href+ "  " + new Date().getTime());
            if (window.parent.location.hash != "#/home" && !window.parent.userbean && !window.userbean) {
                var userbean;
                $.ajax({
                    type: "GET",
                    url: "/jsp/req.jsp",
                    data: {
                        classid: 'base_search',
                        action: 'loginuserinfo',
                        format: 'mjson',
                        id: Math.random(),
                        loginguid: window.strLoginGuid
                    },
                    async: false,
                    success: function (data) {
                        var userdata = JSON.parse(data).loginuserifnos[0];
                        var userbean = userdata.orgdata[0];
                        userbean.sessionid = userdata.sessionid;
                        userbean.entid = Number(userdata.entid); //登录用户当前属于哪个组织
                        userbean.entname = userdata.entname;
                        userbean.entidall = userdata.entidall;
                        userbean.userauth = {};
                        var stringlist = userbean.stringofrole.split(",");
                        for (var i = 0; i < stringlist.length; i++) {
                            userbean.userauth[stringlist[i]] = true;
                        }
                        window.userbean = window.parent.userbean = userbean;
                    }
                });
            }
            if (window.location.hash.indexOf("?param=") > -1) {
                window.CURR_LOCATION[toState.name] = window.location.hash.replace("#/crmman" + toState.url + "?", "");
            }
            if (window.location.hash != "#/home") {
                //如果是自己的页面则打开
                if (fromState.name == null || fromState.name == '') {
                    // if (window.parent.SCOPE_INIT[toState.name]) {
                    //     window.parent.SCOPE_INIT[toState.name]();
                    // }
                    //event.preventDefault();
                    return;
                } else {
                    //如果是从子页面打开子页面则拦截，并且用父页面打开
                    window.parent.location.hash = window.location.hash;
                    // if (window.parent.SCOPE_INIT[toState.name] && !window.userbean.new_tab) {
                    //     window.parent.SCOPE_INIT[toState.name]();
                    // }
                    event.preventDefault();
                    return;
                }
            } else {
                if (toState.name.indexOf("crmman") == -1) {
                    return;
                }
                if (fromState.name == "") {
                    localeStorageService.setcurrent(toState);
                }
                event.preventDefault();
            }
        });

        //路由加载成功后事件
        $rootScope.$on('$stateChangeSuccess', function (to, toParams, from, fromParams) {
            console.log("$stateChangeSuccess ");
        });

        //路由取消后事件
        $rootScope.$on('$stateChangeCancel', function (to, toParams, from, fromParams) {
            console.log("$stateChangeCancel ");
        });

        //路由失败事件
        $rootScope.$on('$stateChangeError', function (to, toParams, from, fromParams, error) {
            console.log("$stateChangeError ");
        });

        $rootScope.$on('$viewContentLoading', function (options) {
            console.log("$viewContentLoading ");
        });

        $rootScope.$on('$stateNotFound', function (redirect, state, params) {
            console.log("$stateNotFound ");
        });

    });

});