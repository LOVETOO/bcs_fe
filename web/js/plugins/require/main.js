//console.timeEnd('z');
//console.time('z');

//为窗口编制ID
(function () {
    //若是顶层窗口
    if (window === top) {
        window.windowId = 1;                        //顶层窗口的窗口ID为1
        window.nextWindowId = window.windowId + 1;  //下个窗口的ID
        window.windows = Object.create(null);       //窗口缓存
    }
    //若非顶层窗口
    else {
        window.windowId = top.nextWindowId++;       //取窗口ID后窗口ID+1
    }

    top.windows[window.windowId] = window;
})();

//重写关闭方法
var close = (function (close) {

    /**
     * 取 iframe 元素所在作用域
     * @returns {Scope}
     * @since 2018-12-28
     */
    function getIframeScope() {
        if (!frameElement) return null;

        return parent.$(frameElement).scope();
    }

    /**
     * 应用到作用域
     * @param {Scope} scope 作用域
     * @since 2018-12-28
     */
    function applyToScope(scope) {
        var fn = scope.$root.$$phase ? scope.$evalAsync : scope.$apply;

        var args = Array.prototype.slice.call(arguments, 1);

        return fn.apply(scope, args);
    }

    /**
     * Angular 框架下的关闭
     * @since 2018-12-28
     */
    function angularClose() {
        //取 iframe 元素所在作用域
        var iframeScope = getIframeScope();
        //iframe 的关闭
        if (iframeScope) {
            //模态框的关闭
            if (iframeScope.$dismiss) {
                iframeScope.$dismiss('底部关闭');
            }
            //标签页的关闭
            else if (iframeScope.tab && iframeScope.tab.close) {
                if (!iframeScope.tab.unclosable)
                    applyToScope(iframeScope, function () {
                        iframeScope.tab.close();
                    });
            }
            else {
                close();
            }
        }
        //单独窗口的关闭
        else {
            close();
        }
    }

    //把原始的关闭方法作为属性
    angularClose.originalClose = close;

    return angularClose;
})(close);

/**
 * 加载指令压缩版
 */
(function (_require, _define) {
	window.require = window.requirejs = function require(deps, callback, errback, optional) {
		if (!isDebug) {
			if (Array.isArray(deps) && deps.length) {
				deps.forEach(function (dep, i) {
					if (dep.indexOf('directive/') === 0) {
						//加载指令压缩版
						deps[i] = dep + '.min.gzjs';
					}
				});
			}
		}

		return _require.apply(null, arguments);
	};

	Object.keys(_require).forEach(function (key) {
		window.require[key] = _require[key];
	});

	window.define = function define(name, deps, callback) {
		if (!isDebug) {
			var actualDeps;

			if (Array.isArray(name)) {
				actualDeps = name;
			}
			else if (Array.isArray(deps)) {
				actualDeps = deps;
			}

			if (Array.isArray(actualDeps) && actualDeps.length) {
				actualDeps.forEach(function (dep, i) {
					if (dep.indexOf('directive/') === 0) {
						//加载指令压缩版
						actualDeps[i] = dep + '.min.gzjs';
					}
				});
			}
		}

		return _define.apply(null, arguments);
	};

	Object.keys(_define).forEach(function (key) {
		window.define[key] = _define[key];
	});

})(window.requirejs, window.define);

(function () {
    var paths = {
        //require-text: 文本 加载插件
        'text': isDebug ? 'plugins/require/require-text/text' : 'plugins/require/require-text/text.min.gzjs',
        //require-css: css 加载插件
		'css': isDebug ? 'plugins/require/require-css/css' : 'plugins/require/require-css/css.min',
		'async': 'plugins/require/async',

        'jquery': isDebug ? 'jquery/jquery-3.3.1' : 'jquery/jquery-3.3.1.min.js.gzjs',
        'jquery-migrate': 'plugins/jquery-ui/jquery-migrate-3.0.0.min',
        'jquery-ui': 'plugins/jquery-ui/jquery-ui.min.js.gzjs',
        'bootstrap': isDebug ? 'plugins/bootstrap/bootstrap' : 'plugins/bootstrap/bootstrap.min.js.gzjs',
        'jquery.validate': 'jquery/jquery.validate',
        'jquery_base64': 'jquery/jquery.base64',
        'jquery.metisMenu': 'plugins/metisMenu/jquery.metisMenu',
        'jquery.divscroll': isDebug ? 'jquery/divscroll' : 'jquery/divscroll.min.js.gzjs',
		'jquery.slimscroll': 'plugins/slimscroll/jquery.slimscroll.min',
		'jquery.actual': isDebug ? 'plugins/jquery-actual/1.0.19/jquery.actual' : 'plugins/jquery-actual/1.0.19/jquery.actual.min',
        'moment': 'jquery/moment.min',
        'angular': isDebug ? 'plugins/angular/angular.hc' : 'plugins/angular/angular.hc.min.gzjs',
        'angular-translate': 'plugins/angular-translate/angular-translate.min',
        'ocLazyLoad': 'plugins/oclazyload/dist/ocLazyLoad.require',
        'angular-ui-router': isDebug ? 'plugins/ui-router/angular-ui-router' : 'plugins/ui-router/angular-ui-router.min.js.gzjs',
        'ui-bootstrap-tpls': isDebug ? 'plugins/bootstrap/ui-bootstrap-tpls-0.12.0' : 'plugins/bootstrap/ui-bootstrap-tpls-0.12.0.min.js.gzjs',
        'angular-popup': 'plugins/angular-popup/ngPopup.min',
        'angular-notify': 'plugins/angular-notify/angular-notify.min',
        'domReady': 'lib/domReady',
        'app': 'app',
        'chosen.jquery': 'plugins/chosen/chosen.jquery',
        'ystep': 'plugins/ystep/ystep',
        'ngJsTree': 'plugins/jstree/ngJsTree',
        'jquery.flot': 'plugins/flot/jquery.flot',
        'jquery.flot.resize': 'plugins/flot/jquery.flot.resize',
        'jquery.splitter': 'plugins/splitter/jquery.splitter-0.14.0',
        'icheck': 'plugins/iCheck/icheck.min',
        'datepicker': '../lib/bootstrap-datepicker-1.4.0/js/bootstrap-datepicker',
        'datepicker.zh-CN': '../lib/bootstrap-datepicker-1.4.0/locales/bootstrap-datepicker.zh-CN.min',
        'datetimepicker': isDebug ? 'plugins/bootstrap/datetimepicker/bootstrap-datetimepicker' : 'plugins/bootstrap/datetimepicker/bootstrap-datetimepicker.js.gzjs',
        'datetimepicker.zh-CN': 'plugins/bootstrap/datetimepicker/locales/bootstrap-datetimepicker.zh-CN',
        'data_map': 'jquery/data_map',
        'toastr': 'plugins/toastr/toastr.min',
        'lodop': 'plugins/Lodop/LodopFuncs',
        'ztree.all': isDebug ? 'plugins/z-tree/jquery.ztree.all' : 'plugins/z-tree/jquery.ztree.all.min.js.gzjs',
        'ztree.core': isDebug ? 'plugins/z-tree/jquery.ztree.core' : 'plugins/z-tree/jquery.ztree.core.min.js.gzjs',
        'ztree.exhide': isDebug ? 'plugins/z-tree/jquery.ztree.exhide' : 'plugins/z-tree/jquery.ztree.exhide.min.js.gzjs',
        'ztree.excheck': isDebug ? 'plugins/z-tree/jquery.ztree.excheck' : 'plugins/z-tree/jquery.ztree.excheck.min.js.gzjs',
        'ztree.exedit': isDebug ? 'plugins/z-tree/jquery.ztree.exedit' : 'plugins/z-tree/jquery.ztree.exedit.min.js.gzjs',
        'GooFunc': 'plugins/GooFlow/GooFunc',
        'GooFlow': isDebug ? 'plugins/GooFlow/GooFlow' : 'plugins/GooFlow/GooFlow.gzjs',
        'Decimal': isDebug ? 'plugins/decimal/decimal.light' : 'plugins/decimal/decimal.light.min.js.gzjs',
        'FileSaver': 'plugins/FileSaver',
        'services': isDebug ? 'services' : 'services.min.gzjs',
        'Sortable': 'plugins/Sortable/Sortable',
        'summernote': 'plugins/summernote/summernote.min',
        'CommonPopCtrl': 'common/CommonPopCtrl.js.gzjs',
        'echarts': isDebug ? 'plugins/echarts/4.2.1/dist/echarts' : 'plugins/echarts/4.2.1/dist/echarts.min.gzjs', //百度 eCharts
		'bmap': isDebug ? 'plugins/echarts/4.2.1/dist/extension/bmap' : 'plugins/echarts/4.2.1/dist/extension/bmap.min.gzjs', //百度地图
		'baidu': 'http://api.map.baidu.com/api?v=2.0&ak=RPQOeLteQcIOOuGhZw8903MAFannGxvq',
        'orgchart': isDebug ? 'plugins/OrgChart/dist/js/jquery.orgchart' : 'plugins/OrgChart/dist/js/jquery.orgchart.min.gzjs', //组织架构图
        'xss': 'plugins/xss/xss.min.gzjs',
        '@fullcalendar/core': 'plugins/fullcalendar/dist/core/main',
        '@fullcalendar/interaction': 'plugins/fullcalendar/dist/interaction/main',
        '@fullcalendar/daygrid': 'plugins/fullcalendar/dist/daygrid/main',
        '@fullcalendar/timegrid': 'plugins/fullcalendar/dist/timegrid/main',
        'vue': 'plugins/vue/vue' + (isDebug ? '' : '.min.gzjs'),
        'ELEMENT': 'plugins/element-ui/2.13.0/lib/index'
    };

    var folderAndId = {
        'api': [
            'angularApi',
            'arrayApi',
            'base64Api',
            'cache',
            'controllerApi',
            'cssApi',
            'dateApi',
            'directiveApi',
            'fileApi',
			'gridApi',
			'iconApi',
            'loopApi',
            'numberApi',
            'openBizObj',
            'promiseApi',
            'requestApi',
            'requireApi',
            'serviceApi',
            'specialProperty',
            'startWf',
            'strApi',
            'swalApi',
            'whereApi',
            'zTreeApi',
            'unblockSwalApi',
            'printApi',
			'jurisdictionApi',
			'webSocketApi',
			'wfApi'
        ],
        'service': [
            '$compile',
            '$http',
            '$q',
            '$timeout',
            '$modal',
            '$filter'
        ],

        'controllers/public': [
            'base_obj_list',    //对象列表页基础控制器
            'base_obj_prop',    //对象属性页基础控制器
            'base_tree_list',   //树+列表页基础控制器
            'base_diy_page',    //空白页面基础控制器
            'base_edit_list',    //编辑+列表页基础控制器
            'base_print_controller'
        ]
    };

    for (var folder in folderAndId) {
        folderAndId[folder].forEach(
            isDebug ?
                function (id) {
                    paths[id] = [folder + '/' + id];
                }
                :
                function (id) {
                    paths[id] = [folder + '/' + id + '.min.gzjs', folder + '/' + id];
                }
        );
    }

    require.config({
        baseUrl: 'js',
        urlArgs: 'v=' + rev,
        paths: paths,
        shim: {
            'angular': {
                deps: ["jquery"],
                exports: 'angular'
            },
            'angular-ui-router': {
                deps: ['jquery', 'angular'],
                exports: 'angular'
            },
            'bootstrap': {
                deps: ['jquery', 'jquery-ui'],
                exports: 'jQuery.fn.affix'
            },
            'select2': {
                deps: ['jquery', 'css!https://cdn.jsdelivr.net/npm/select2@4.0.12/dist/css/select2' + (isDebug ? '' : '.min') + '.css'],
                exports: 'jQuery.select2'
            },
            'jquery_base64': {
                deps: ['jquery'],
                exports: 'jQuery.base64'
            },
            'jquery-ui': {
                deps: ['jquery','css!plugins/jquery-ui/jquery-ui.min'],
                exports: 'jQuery.fn.tooltip'
            },
            'jquery-migrate': { 
                deps: ["jquery"],
                exports: 'jquery-migrate'
            },
            'jquery.divscroll': {
                deps: ['jquery'],
                exports: 'jQuery.fn.scrollTop'
            },
            'orgchart': {
                deps: ['jquery'],
                exports: 'jQuery.fn.orgchart'
            },
            'angular-translate': {
                deps: ['angular'],
                exports: 'angular'
            },
            'ocLazyLoad': {
                deps: ['angular'],
                exports: 'angular'
            },
            'angular-popup': {
                deps: ['angular'],
                exports: 'angular'
            },
            'angular-notify': {
                deps: ['angular'],
                exports: 'angular'
            },
            'ui-bootstrap-tpls': {
                deps: ['angular'],
                exports: 'angular'
            },
            'jquery.metisMenu': {
                deps: ['jquery'],
                exports: 'jQuery.fn.metisMenu'
            },
            'jquery.splitter': {
                deps: ['jquery'],
                exports: 'jQuery.fn.split'
            },
            'datetimepicker': {
                deps: ['jquery'],
                exports: 'jQuery.fn.datetimepicker'
            },
            'datetimepicker.zh-CN': {
                deps: ['datetimepicker'],
                exports: 'jQuery.fn.datetimepicker'
            },
            'ztree.all': {
                deps: ['jquery'],
                exports: 'jQuery.fn.zTree'
            },
            'ztree.core': {
                deps: ['jquery'],
                exports: 'jQuery.fn.zTree'
            },
            'ztree.exhide': {
                deps: ['ztree.core'],
                exports: 'jQuery.fn.zTree'
            },
            'ztree.excheck': {
                deps: ['ztree.core'],
                exports: 'jQuery.fn.zTree'
            },
            'GooFunc': {
                exports: 'mousePosition'
            },
            'GooFlow': {
                deps: ['jquery', 'GooFunc'],
                exports: 'GooFlow'
            },
            'summernote': ['bootstrap', 'xss', 'css!../css/plugins/summernote/dist/summernote'],
            'CommonPopCtrl': {
                exports: 'CommonPopController'
            },
            'lodop': {
                exports: 'getLodop'
            },
            'xss': {
                exports: 'filterXSS'
            },
            '@fullcalendar/daygrid': {
                deps: ['css!plugins/fullcalendar/dist/daygrid/main', '@fullcalendar/core'], exports: '@fullcalendar/daygrid'
            },
            '@fullcalendar/timegrid': {
                deps: ['css!plugins/fullcalendar/dist/timegrid/main', '@fullcalendar/core', '@fullcalendar/daygrid'],
                exports: '@fullcalendar/timegrid'
            },
            '@fullcalendar/interaction': {
                deps: ['@fullcalendar/core'],
                exports: '@fullcalendar/interaction'
            },
            '@fullcalendar/core': {
                deps: ['css!plugins/fullcalendar/dist/core/main'],
                exports: '@fullcalendar/core'
            },
            'ELEMENT': ['css!plugins/element-ui/2.13.0/lib/theme-chalk/index']
        },
        waitSeconds: 0, //超时不中断
        enforceDefine: true //强制使用 define 和 shim，用于兼容 IE9、10
    });
})();

define('element-ui', ['vue', 'ELEMENT'], function (Vue, ELEMENT) {
    Vue.use(ELEMENT); //安装 element-ui
    Vue.prototype.$ELEMENT.size = 'mini'; //默认大小：迷你
    Vue.prototype.$ELEMENT.zIndex = 3000; //初始zIndex：3000
    return ELEMENT;
});

(function () {
    // 引入主模块，对应各自文件
    var deps = [
        'angular',
        'domReady',
        'app',
        'cssApi',
        'angular-ui-router',
        'ocLazyLoad',
        //'bootstrap',
        'ui-bootstrap-tpls',
        //'angular-notify',
        'jquery.metisMenu',
        'css_init',
        'common',
        //'common/FrmInfo',
        // 'app',
        '/web/js/router.jsp?rn='+rn,
        //'inspinia',
        //'filter',
        // 'base/directives',
        //'services',
        'controllers',
        //'CommonPopCtrl',
        //'base/ctrl_bill_wfaudit',
        //'controllers/mywork/workhits',
        //'toastr',
        // 'sweetalert',
        //'commpop',
        'directive/comboOfMain' //主页面用的指令套餐
    ];

    if (window === top && window.isOA)
        deps.push('oa');

    define(
        deps,
        function (angular, domReady, app, cssApi) {
			//console.timeEnd('z');
			//console.time('z');
            // 页面加载完毕
            domReady(function () {
				//console.timeEnd('z');
				//console.time('z');
                // 动态绑定ng-app指令
                // 注意中括号中字符串需要与app.js中一致
                console.assert(app.$injector, '缺少注入器');
                angular.bootstrap(document, [app.name]);
            });
            var requireModules = arguments;
            var mainModule = {
                deps: {}
            };

            deps.forEach(function (depName, requireIndex) {
                var depModule = requireModules[requireIndex];
                // console.log(depName, '=', depModule);
                mainModule.deps[depName] = depModule;
            });

            cssApi.loadCss(
                'js/plugins/jquery-ui/jquery-ui.min.css'
			);
			
			require(['bootstrap', 'toastr']);

            return mainModule;
        }
    );
})();