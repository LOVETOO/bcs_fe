console.log("in appRouterjs init 1");
define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
        //$urlRouterProvider.otherwise("/home");
        // 默认路由
        $urlRouterProvider.when('', 'home');
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

        $stateProvider.state('home', {
            //abstract: true,
            url: "/home",
            templateUrl: "views/common/content.html?v=" + window.rev,
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
            });
    }]);
});
console.log("in appRouterjs init 2");