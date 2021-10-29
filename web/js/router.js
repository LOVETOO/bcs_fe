/**
 * 路由
 * @since 2018-09-11
 */
define(
	['app', 'angular'],
	function (app, angular) {
		'use strict';

		app.config([
			'$urlRouterProvider', '$stateProvider',
			function ($urlRouterProvider, $stateProvider) {
				$urlRouterProvider.otherwise('home');
				[
					{
						//主页
						name: 'home',
						templateUrl: 'views/common/content.html'
					}
					, {
						pkg: 'demo'
					}
					, {
						pkg: 'crmman'
					}
					, {
						pkg: 'saleman'
					}
					, {
						//首页
						pkg: 'mywork',
						name: 'oa_myhome',
						stateName: 'crmman.myhome',
						url: '/myhome'
					}
					, {
						pkg: 'demo',
						name: 'head',
						title: '演示 - 浏览页'
					}
					, {
						pkg: 'saleman',
						name: 'sa_out_bill_head',
						title: '销售订单'
					}
				].forEach(function (defineParams) {
					//defineParams是简单定义路由的参数，stateParams是真正传给的$stateProvider的路由参数
					var stateParams = angular.extend({}, defineParams);
					delete stateParams.pkg;
					delete stateParams.name;
					delete stateParams.stateName;

					var name; //路由名称

					if (defineParams.stateName) //若定义了路由名称，则使用该路由名称
						name = defineParams.stateName;
					else if (defineParams.pkg && defineParams.name) //若同时有包名和文件名，则 路由名称 = 包名.文件名
						name = defineParams.pkg + '.' + defineParams.name;
					else if (defineParams.name) //有文件名无包名，则路由名称 = 文件名
						name = defineParams.name;
					else if (defineParams.pkg) //有包名无文件名，则路由名称 = 包名
						name = defineParams.pkg;

					//若没定义url
					if (!defineParams.url) {
						if (defineParams.name) //有文件名，则 url = /文件名
							stateParams.url = '/' + defineParams.name;
						else if (defineParams.pkg) //有包名无文件名，则 url = /包名
							stateParams.url = '/' + defineParams.pkg;
					}

					//是包路由
					var isPkg = defineParams.pkg && !defineParams.name;

					//若是包路由，使用ui-view
					if (isPkg)
						stateParams.template = '<div ui-view></div>';

					//若未定义模板路径，使用 views/包名/文件名.html
					if (!isPkg && !defineParams.templateUrl) {
						stateParams.templateUrl = 'views/' + defineParams.pkg + '/' + defineParams.name + '.html';
					}

					//模板路径加上版本参数
					if (stateParams.templateUrl && !stateParams.templateUrl.includes('?v='))
						stateParams.templateUrl += '?v=' + rev;

					//若非包路由，但是有包名
					if (!isPkg && defineParams.pkg) {
						//控制器
						stateParams.controller = defineParams.name;

						stateParams.resolve = {
							controller: function ($q) {
								//加载 js/controllers/包名/文件名.js
								var jsUrl = 'controllers/' + defineParams.pkg + '/' + defineParams.name;

								return $q(function (resolve, reject) {
									require(
										[jsUrl/*  + '.gzjs' */], //先请求压缩版
										resolve,
										reject
										/* function () {
											console.info(jsUrl + '：请求压缩版失败，改为请求非压缩版');

											require(
												[jsUrl], //请求不到压缩版再请求非压缩版
												resolve,
												reject
											);
										} */
									);
								});
							}
						};

						stateParams.data = {
							pageTitle: defineParams.title || name
						};
					}

					$stateProvider.state(name, stateParams);
				});
			}
		]);

		app.run([
			'$rootScope',
			function ($rootScope) {
				//路由开始变化事件
				$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

					var title = 'CRM系统 | 首页';
					if (toState.data && toState.data.pageTitle) title = 'CRM系统 | ' + toState.data.pageTitle;
					$rootScope.$broadcast("page_stat", {
						toState: toState,
						toParams: toParams,
						fromState: fromState,
						fromParams: fromParams
					});
					console.log("broadcast stateChangeStart showmode：" + $rootScope.showmode + "  toState: " + toState.name + "  fromState name: " + JSON.stringify(fromState) + "  href: " + window.location.href + "  " + new Date().getTime());
					if (window.parent.location.hash != "#/home" && !window.parent.userbean && !window.userbean) {
						var userbean;
						$.ajax({
							type: "GET",
							url: "/jsp/authman.jsp",
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
							return
						} else {
							//如果是从子页面打开子页面则拦截，并且用父页面打开
							window.parent.location.hash = window.location.hash;
							// if (window.parent.SCOPE_INIT[toState.name] && !window.userbean.new_tab) {
							//     window.parent.SCOPE_INIT[toState.name]();
							// }
							event.preventDefault();
							return
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

				//路由开始变化事件
				$rootScope.$on('$stateChangeStart', function (event, toState) {
					console.log('路由开始 %c%s %O', 'color:blue;font-weight:bold;', toState.name, toState);
				});

				//路由加载成功后事件
				$rootScope.$on('$stateChangeSuccess', function (event, toState) {
					console.log("路由成功 %c%s %O", 'color:blue;font-weight:bold;', toState.name, toState);
				});

				//路由取消后事件
				$rootScope.$on('$stateChangeCancel', function (event, toState) {
					console.warn("路由取消 %c%s %O", 'color:blue;font-weight:bold;', toState.name, toState);
				});

				//路由失败事件
				$rootScope.$on('$stateChangeError', function (event, toState) {
					console.error("路由失败 %c%s %O", 'color:blue;font-weight:bold;', toState.name, toState);
				});

				//找不到路由事件
				$rootScope.$on('$stateNotFound', function (event, toState) {
					console.error("路由找不到 %c%s %O", 'color:blue;font-weight:bold;', toState.name, toState);
				});
			}
		]);
	}
);