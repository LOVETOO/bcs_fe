<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ page import="java.net.*" %>
<%@ page import="java.util.*" %>
<%
	Vector<Hashtable<String, String>> vc = null;
   com.hczy.base.util.SysUseObject useObject = null;
   String rn = request.getParameter("rn");
   //System.out.println("rn: " + rn);
   try {
        useObject = new com.hczy.base.util.SysUseObject("system");
        if(null != rn && rn.length() > 0){
            vc = useObject.getDataCentre().multiRowSelect("select  * from base_router where usable = 2 and pkgname||'.'||routename = '"+rn+"'");
        }else{
			vc = useObject.getDataCentre().multiRowSelect("select  * from base_router where usable = 2");
		}
	} catch (Exception e) {
		e.printStackTrace();
	}finally{
		if (useObject != null) {
	useObject.freeAllConn();
	useObject = null;
		}
    }
%>

/**
 * 路由
 * @since 2018-09-27
 */
define(
	['angular'],
	function (angular) {
		'use strict';
		router.$inject = ['$urlRouterProvider', '$stateProvider'];
		function router($urlRouterProvider, $stateProvider) {
			$urlRouterProvider.otherwise('home');
			[{
					//主页
					name: 'home',
					templateUrl: 'views/common/content.html',
					params: 'modName'
			}, {
				pkg: 'demo'
			}, {
				pkg: 'oa'
			}, {
				pkg: 'baseman'
			}, {
				pkg: 'crmman'
			}, {
				pkg: 'proman'
			}, {
				pkg: 'saleman'
			}, {
				pkg: 'invman'
			}, {
				pkg: 'finman'
			}, {
				pkg: 'financeman'
			}, {
				pkg: 'financeman.fundman'
			}, {
				pkg: 'financeman.glman'
			}, {
				pkg: 'financeman.arman'
			}, {
				pkg: 'financeman.apman'
			}, {
				pkg: 'stkman'
			}, {
				pkg: 'hrman'
			}, {
				pkg: 'epmman'
			}, {
	            pkg: 'cssman'
            }, {
	            pkg: 'bcsman'
            }
			<%
				if (null != vc && vc.size() > 0) {
				   String pkg = "";
				   String name = "";
				   String stateName = "";
				   String url = "";
				   String templateUrl = "";
				   String title = "";
				   int type = 0;
				   int objTypeId = 0;
				   int diy_html = 0;
			       String params = "";
					for (Hashtable<String, String> ht: vc) {
							pkg = ht.get("pkgname");
							name = ht.get("routename");
							stateName = ht.get("statename");
							url = ht.get("url");
							templateUrl = ht.get("templateurl");
							title = ht.get("pagetitle");
							type = Integer.parseInt(ht.get("type"));
							objTypeId = Integer.parseInt(ht.get("objtypeid"));
							diy_html = Integer.parseInt(ht.get("diy_html"));
							params = ht.get("params");
			%>, {pkg:'<%=pkg%>',name:'<%=name%>',title:'<%=title%>',stateName:'<%=stateName%>',url:'<%=url%>',templateUrl:'<%=templateUrl%>',type:<%=type%>,objTypeId:<%=objTypeId%>,diy_html:<%=diy_html%>==2,params:'<%=params%>'}
			<%}}%>
				, {
					pkg: 'saleman',
					name: 'sa_out_bill_head',
					title: '销售订单'
				}
			].forEach(function (defineParams) {
				try {
					//defineParams是简单定义路由的参数，stateParams是真正传给的$stateProvider的路由参数
					var stateParams = angular.extend({}, defineParams);
					delete stateParams.pkg;
					delete stateParams.name;
					delete stateParams.stateName;
					delete stateParams.type;
					delete stateParams.objTypeId;
					delete stateParams.diy_html;
					delete stateParams.params;

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
						//有包名无文件名，则 url = /最后包名
						else if (defineParams.pkg) {
							var lastDotIndex = defineParams.pkg.lastIndexOf('.');
							if (lastDotIndex >= 0)
								stateParams.url = '/' + defineParams.pkg.substr(lastDotIndex + 1);
							else
								stateParams.url = '/' + defineParams.pkg;
						}
					}

					//是包路由
					var isPkg = defineParams.pkg && !defineParams.name;

					//若是包路由，使用ui-view
					if (isPkg) {
						stateParams.template = '<div ui-view></div>';
					}
					//若是自定义html
					else if (!defineParams.diy_html
						&& (defineParams.type == 1 || defineParams.type == 3)
						) {
						//若是对象列表页
						if (defineParams.type == 1) {
							stateParams.template = '<div hc-obj-list></div>';
						}
						//若是树列表页
						else if (defineParams.type == 3) {
							stateParams.template = '<div hc-tree-list></div>';
						}
					}
					//若未定义模板路径，使用 views/包名/文件名.html
					else if (!defineParams.templateUrl) {
						stateParams.templateUrl = 'views/' + defineParams.pkg.replace(/\./g, '/') + '/' + defineParams.name + '.html';
					}

					//模板路径加上版本参数
					if (stateParams.templateUrl && stateParams.templateUrl.indexOf('?v=') < 0)
						stateParams.templateUrl += '?v=' + rev;

					//若非包路由，但是有包名
					if (!isPkg && defineParams.pkg) {
						//控制器
						stateParams.controller = defineParams.name;

						stateParams.resolve = {
							controller: [
								'$q',
								function ($q) {
									//加载 js/controllers/包名/文件名.js
									var jsUrl = 'controllers/' + defineParams.pkg.replace(/\./g, '/') + '/' + defineParams.name;
									return $q(function (resolve, reject) {
										//调试模式直接请求非压缩版
										if (isDebug) {
											require(
												[jsUrl],
												resolve,
												reject
											);
										}
										else {
											require(
												[jsUrl + '.min.gzjs'], //先请求压缩版
												resolve,
												function () {
													console.error(jsUrl + '：请求压缩版失败，改为请求非压缩版');

													require(
														[jsUrl], //请求不到压缩版再请求非压缩版
														resolve,
														reject
													);
												}
											);
										}
									});
								}
							],

							objConf: [
								'$q',
								function ($q) {
									if (defineParams.objTypeId)
										return $q
											.when()
											.then(function () {
												return $q(function (resolve, reject) {
													require(['requestApi'], resolve, reject);
												});
											})
											.then(function (requestApi) {
												return requestApi.getObjConf(defineParams.objTypeId);
											})
											.then(function (response) {
												stateParams.data.objConf = response;
												return response;
											});

									return {
										error: '路由' + name + '尚未关联对象配置'
									};
								}
							]

						};

						stateParams.data = {
							pageTitle: defineParams.title || name
						};
					}

					//处理url接收参数
					(function () {
						var urlParams;

						if (defineParams.params) {
							urlParams = defineParams.params.split(',');
						}
						else {
							urlParams = [];
						}

						if (defineParams.type == 2) {
							urlParams.unshift('id', 'copyFrom', 'readonly', 'openedByListPage');
						}

						if (!isPkg)
							urlParams.unshift('title', 'debug');

						if (urlParams.length) {
							stateParams.url += '?' + urlParams.reduce(function (result, currentParam) {
								return result + '&' + currentParam;
							});
						}
					})();

					$stateProvider.state(name, stateParams);
				}
				catch (e) {
					console.error('路由定义失败！', defineParams, e);
				}
			});
		}

		router.routerEvent = routerEvent;
		routerEvent.$inject = ['$rootScope', '$state'];
		function routerEvent($rootScope, $state) {
			//路由开始变化事件
			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
				//若是从虚拟路由开始，直接跳转
				if (fromState.abstract) {
				  console.log('路由开始 %c%s %O', 'color:blue', toState.name, toState);
				  return;
				}

				//若是流程实例状态发生变化，允许直接跳转
				if (fromState.name === 'crmman.wfins' && toState.name === fromState.name) {
					console.log('流程实例状态发生变化 %c%s %O', 'color:blue', fromState.name, fromParams, toParams);
					return;
				}

				//否则都要阻止默认事件
				event.preventDefault();

				//若不是顶层窗口，让他在顶层窗口响应
				if (window !== top) {
					top.$('body').scope().$root.$apply(function () {
						['$state', function ($state) {
							$state.go(toState.name, angular.copy(toParams));
						}].callByTopAngular();
					});
				}
			});

			//路由加载成功后事件
			//$rootScope.$on('$stateChangeSuccess', function (event, toState) {
			//	console.log("路由成功：%c%s", 'color:blue', location.href);
			//});

			//路由取消后事件
			/* $rootScope.$on('$stateChangeCancel', function (event, toState) {
				//若是从虚拟路由开始，说明是真的跳转失败
				// if (fromState.abstract)
				// console.error("路由取消 %c%s %O", 'color:blue', toState.name, arguments);
			}); */

			//路由失败事件
			$rootScope.$on('$stateChangeError', function (event, toState) {
				console.error("路由失败 %c%s %O", 'color:blue', toState.name, arguments);
			});

			//找不到路由事件
			$rootScope.$on('$stateNotFound', function (event, toState) {
				console.error("路由找不到 %c%s %O", 'color:blue', toState.name, arguments);
			});
		}

		return router;
	}
);