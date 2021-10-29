<%@ page language="java" contentType="application/x-javascript; charset=UTF-8"%>
<%@ page import="com.sinocc.base.session.*"%>
<%@ page import="com.sinocc.base.server.CPCServer"%>
<%@ page import="com.sinocc.util.GlobalVariable"%>
<%@ page import="com.sinocc.accesscontrol.*"%>
<%@ page import="com.sinocc.util.Date"%>
<%@ page import="com.sinocc.util.CPCUserBean,com.hczy.web2.SCPUserData,java.util.Hashtable"%>
<%@ page import="java.io.*"%>
<%@ page import="java.net.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.sinocc.util.*"%>
<%@ page import="com.sinocc.systemdbmanager.CPCDao"%>
<%@ page import="com.alibaba.fastjson.JSON"%>
<%@ page import="com.sinocc.exception.*"%>
<%@ page import="com.hczy.baseman.Base_ModMenu"%>
<%
    com.sinocc.systemdbmanager.CPCDao dao = new com.sinocc.systemdbmanager.CPCDao("1");
    dao.setTransation(false);
    Vector shts = null;
    Vector menushts = null;
    try{
    	shts = dao.multiRowSelect("select modid, modname, modtag from scpmod where modtag>0 and webrefaddr='crmman.sht'");

    	menushts = dao.multiRowSelect("select menuid modid, menuname modname, menutag modtag from scpmenu where menutag>0 and webrefaddr='crmman.sht'");

    }catch(Exception e)  {
		out.println(e.toString());
		out.print("<p>出错了，请重试！</p>");
		e.printStackTrace();
	} finally {
		dao.freeConnection();
	}
%>
/**
 * INSPINIA - Responsive Admin Theme

 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $$qProvider, $urlRouterProvider, $ocLazyLoadProvider) {

	$urlRouterProvider.otherwise("/crmman/myhome");

	$ocLazyLoadProvider.config({
		// Set to true if you want to see what and when is dynamically loaded
		debug: true
	});

	$stateProvider
		.state('crmman', {
			abstract: true,
			url: "/crmman",
			templateUrl: "views/common/content.html",
		})
		.state('crmman.dashboard', {
			url: "/dashboard",
			templateUrl: "views/mywork/oa_saledash_data.html",
			data: {
				pageTitle: '经营首页'
			},
			resolve: {
				loadPlugin: function($ocLazyLoad) {
					return $ocLazyLoad.load([

							{
								name: 'inspinia',
								files: ['js/controllers/mywork/oa_saledash_data.js']
							},

							{
								name: 'angles',
								files: ['js/plugins/chartJs/angles.js', 'js/plugins/chartJs/Chart.min.js']
							},
							{
								name: 'angular-peity',
								files: ['js/plugins/peity/jquery.peity.min.js', 'js/plugins/peity/angular-peity.js']
							},
							{
								name: 'ui.checkbox',
								files: ['js/bootstrap/angular-bootstrap-checkbox.js']
							},
							{
								serie: true,
								name: 'angular-flot',
								files: ['js/plugins/flot/jquery.flot.js', 'js/plugins/flot/jquery.flot.time.js', 'js/plugins/flot/jquery.flot.tooltip.min.js', 'js/plugins/flot/jquery.flot.spline.js', 'js/plugins/flot/jquery.flot.resize.js', 'js/plugins/flot/jquery.flot.pie.js', 'js/plugins/flot/curvedLines.js', 'js/plugins/flot/angular-flot.js', ]
							}

						]

					);
				}
			}
		})
		.state('crmman.worktest', {
			url: "/worktest",
			templateUrl: "views/worktest.html",

			data: {
				pageTitle: '工作台'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load([{
						name: 'inspinia',
						files: ['js/controllers/mywork/ctrl_mydesktoptest.js']

					}, {
						name: 'angular-peity',
						files: ['js/plugins/peity/jquery.peity.min.js', 'js/plugins/peity/angular-peity.js']

					}]);
				}
			}
		})
		.state('crmman.mywork1', {
			url: "/mywork1",
			templateUrl: "views/mywork/mywork_uncheck.html",

			data: {
				pageTitle: '当前待批的流程'
			},
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

			data: {
				pageTitle: 'chgpsw'
			},
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

			data: {
				pageTitle: '未到达流程'
			},
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

			data: {
				pageTitle: '我启的流程'
			},
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

			data: {
				pageTitle: '已完成流程'
			},
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
		.state('crmman.myhome', {
			url: "/myhome",
			templateUrl: "views/mywork/oa_myhome.html",

			data: {
				pageTitle: '个人首页'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load({
						name: 'inspinia',
						files: ['js/controllers/mywork/oa_myhome.js']
					});
				}
			}
		})
		.state('crmman.home', {
			url: "/home",
			templateUrl: "views/mywork/oa_home.html",

			data: {
				pageTitle: '公司首页'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load({
						name: 'inspinia',
						files: ['js/controllers/mywork/oa_home.js']
					});
				}
			}
		})

		.state('crmman.manage_home', {
			url: "/manage_home",
			templateUrl: "views/mywork/manage_home.html",

			data: {
				pageTitle: '管理首页'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load({
						name: 'inspinia',
						files: ['js/controllers/mywork/manage_home.js']
					});
				}
			}
		})
		/**********************************权限设置****************************************/
		.state('crmman.base_drp_cust', {
			url: "/base_drp_cust",
			templateUrl: "views/baseman/mail.html",
			data: {
				pageTitle: '邮箱'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load({
						name: 'inspinia',
						files: ['js/controllers/baseman/mail.js']
					});
				}
			}
		})
		.state("crmman.files", {
			url: "/files",
			templateUrl: "views/baseman/company_files.html",
			data: {
				pageTitle: '公司文件'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

						{
							name: 'inspinia',
							files: ['js/controllers/baseman/compfiles.js']
						}

					);
				}
			}
		})
		.state("crmman.myfiles", {
			url: "/myfiles",
			templateUrl: "views/baseman/myfiles.html",
			data: {
				pageTitle: '我的文件'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

						{
							name: 'inspinia',
							files: ['js/controllers/baseman/myfiles.js']
						}

					);
				}
			}
		})
		.state("crmman.base_org", {
			url: "/base_org",
			templateUrl: "views/baseman/base_org.html",
			data: {
				pageTitle: '机构'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

						{
						name: 'inspinia',
						files: ['js/controllers/baseman/base_org.js']
						}

					);
				}
			}
		})
		.state("crmman.base_position", {
			url: "/base_position",
			templateUrl: "views/baseman/base_position.html",
			data: {
				pageTitle: '岗位'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();
					return $ocLazyLoad.load(
						{
						name: 'inspinia',
						files: ['js/controllers/baseman/base_position.js']
						}

					);
				}
			}
		})
		.state("crmman.base_role", {
			url: "/base_role",
			templateUrl: "views/baseman/base_role.html",
			data: {
				pageTitle: '角色'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

						{
						name: 'inspinia',
						files: ['js/controllers/baseman/base_role.js']
						}

					);
				}
			}
		})
		.state("crmman.base_flow", {
			url: "/base_flow",
			templateUrl: "views/baseman/base_flow.html",
			data: {
				pageTitle: '流程'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

						{
						name: 'inspinia',
						files: ['js/controllers/baseman/base_flow.js']
						}

					);
				}
			}
		})
		.state("crmman.base_code", {
			url: "/base_code",
			templateUrl: "views/baseman/base_code.html",
			data: {
				pageTitle: '编码'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

						{
						name: 'inspinia',
						files: ['js/controllers/baseman/base_code.js']
						}

					);
				}
			}
		})
		.state("crmman.sys_param", {
			url: "/sys_param",
			templateUrl: "views/baseman/sys_param.html",
			data: {
				pageTitle: '系统参数'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

						{
						name: 'inspinia',
						files: ['js/controllers/baseman/sys_param.js']
						}

					);
				}
			}
		})
	.state("crmman.authority_con", {
	             url: "/authority_con",
	             templateUrl: "views/baseman/authority_con.html?v="+window.rev,
	             data: {
	                   pageTitle: '权限管理'
	              },
	              resolve: {
	                   load: function($templateCache, $ocLazyLoad, $q, $http) {
	                        lazyDeferred = $q.defer();

	                         return $ocLazyLoad.load(

	                           {
	                              name: 'inspinia',
	                              files: ['js/controllers/baseman/authority_con.js?v='+window.rev]
	                            }

	                          );
	                    }
	               }
	})
		.state("crmman.cpcobjconf", {
			url: "/cpcobjconf",
			templateUrl: "views/baseman/cpcobjconf.html",
			data: {
				pageTitle: '窗体对象配置'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();
					return $ocLazyLoad.load(
						{
						name: 'inspinia',
						files: ['js/controllers/baseman/cpcobjconf.js']
						}

					);
				}
			}
		})
		.state("crmman.sys_mod", {
			url: "/sys_mod",
			templateUrl: "views/baseman/sys_mod.html",
			data: {
				pageTitle: '模块定义'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();
					return $ocLazyLoad.load(
						{
						name: 'inspinia',
						files: ['js/controllers/baseman/sys_mod.js']
						}

					);
				}
			}
		})
		.state("crmman.sys_menu", {
			url: "/sys_menu",
			templateUrl: "views/baseman/sys_menu.html",
			data: {
				pageTitle: '菜单定义'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();
					return $ocLazyLoad.load(
						{
						name: 'inspinia',
						files: ['js/controllers/baseman/sys_menu.js']
						}

					);
				}
			}
		})
		.state('crmman.sht', {
			url: "/sht/:shtid",
			templateUrl: "views/baseman/sht_view.html",
			data: {
				pageTitle: '表单'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load({
						name: 'inspinia',
						files: ['js/controllers/baseman/base_shtcontroner.js']
					});
				}
			}
		})
		.state("crmman.wfsht", {
			url: "/wfsht",
			templateUrl: "views/mywork/wfsht.html",
			data: {
				pageTitle: '表单审批'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

						{
							name: 'inspinia',
							files: ['js/controllers/mywork/wfsht.js']
						}

					);
				}
			}
		})
		.state("crmman.wffile", {
			url: "/wffile",
			templateUrl: "views/mywork/wffile.html",
			data: {
				pageTitle: '文件审批'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

						{
							name: 'inspinia',
							files: ['js/controllers/mywork/wffile.js']
						}

					);
				}
			}
		})
		//查看流程页面
		.state("crmman.flow_path", {
			url: "/flow_path",
			templateUrl: "views/mywork/flow_path.html",
			data: {
				pageTitle: '更多流程'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

						{
							name: 'inspinia',
							files: ['js/controllers/mywork/flow_path.js']
						}

					);
				}
			}
		})
		//个人设置my_settings
		.state("crmman.my_settings", {
			url: "/my_settings",
			templateUrl: "views/mywork/my_settings.html",
			data: {
				pageTitle: '个人设置'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

						{
							name: 'inspinia',
							files: ['js/controllers/mywork/my_settings.js']
						}

					);
				}
			}
		})
		.state("crmman.resource", {
			url: "/resource",
			templateUrl: "views/mywork/resource.html",
			data: {
				pageTitle: '资源管理'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

						{
							name: 'inspinia',
							files: ['js/controllers/mywork/resource.js']
						}

					);
				}
			}
		})
		//预算期间
		.state("crmman.fin_bud_period_header", {
			url: "/fin_bud_period_header",
			templateUrl: "views/finman/fin_bud_period_header.html",
			data: {
				pageTitle: '预算期间'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

						{
							name: 'inspinia',
							files: ['js/controllers/finman/fin_bud_period_header.js']
						}

					);
				}
			}
		})
		//预算类别
		.state("crmman.fin_bud_type_header", {
				url: "/fin_bud_type_header",
				templateUrl: "views/finman/fin_bud_type_header.html",
				data: {
					pageTitle: '预算类别'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

						{
							name: 'inspinia',
							files: ['js/controllers/finman/fin_bud_type_header.js']
						}

					);
				}
			}
		})
        .state("crmman.fin_fee_type", {
            url: "/fin_fee_type",
            templateUrl: "views/finman/fin_fee_type.html",
            data: {
                pageTitle: '费用类别'
            },
            resolve: {
                load: function($templateCache, $ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();

                    return $ocLazyLoad.load(

                        {
                            name: 'inspinia',
                            files: ['js/controllers/finman/fin_fee_type.js']
                        }

                    );
                }
            }
        })

	//费用项目
	    .state("crmman.fin_fee_header",{
	         url: "/fin_fee_header",
	         templateUrl: "views/finman/fin_fee_header.html",
	         data: {
	             pageTitle: '费用项目'
	         },
	         resolve: {
	             load: function($templateCache, $ocLazyLoad, $q, $http) {
	                   lazyDeferred = $q.defer();
	                   return $ocLazyLoad.load(
	                     {
	                         name: 'inspinia',
	                         files: ['js/controllers/finman/fin_fee_header.js']
	                      }

	                    );
	              }
	          }
	    })
		//预算调整
		.state("crmman.fin_bud_adjust_header",{
			url: "/fin_bud_adjust_header",
			templateUrl: "views/finman/fin_bud_adjust_header.html",
			data: {
				pageTitle: '预算调整'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

					{
						name: 'inspinia',
						files: ['js/controllers/finman/fin_bud_adjust_header.js']
					}

					);
				}
			}
		})
		//预算结转
		.state("crmman.fin_bud_carryover", {
			url: "/fin_bud_carryover",
			templateUrl: "views/finman/fin_bud_carryover.html",
			data: {
				pageTitle: '预算结转'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

					{
						name: 'inspinia',
						files: ['js/controllers/finman/fin_bud_carryover.js']
					}

					);
				}
			}
		})
		//预算编制
		.state("crmman.fin_bud_make", {
			url: "/fin_bud_make",
			templateUrl: "views/finman/fin_bud_make.html",
			data: {
				pageTitle: '预算编制'
			},
				resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

						{
							name: 'inspinia',
							files: ['js/controllers/finman/fin_bud_make.js']
						}

					);
				}
			}
		})
		//费用申请
		.state("crmman.fin_fee_apply_header", {
			url: "/fin_fee_apply_header",
			templateUrl: "views/finman/fin_fee_apply_header.html",
			data: {
				pageTitle: '费用申请'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

					{
						name: 'inspinia',
						files: ['js/controllers/finman/fin_fee_apply_header.js']
					}

					);
				}
			}
		})
		//预算审核
		.state("crmman.fin_bud_audit_head", {
			url: "/fin_bud_audit_head",
			templateUrl: "views/finman/fin_bud_audit_head.html",
			data: {
				pageTitle: '预算审核'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

					{
						name: 'inspinia',
						files: ['js/controllers/finman/fin_bud_audit_head.js']
					}

					);
				}
			}
		})
		//费用报销查询
		.state("crmman.fin_fee_bx_header_search", {
			url: "/fin_fee_bx_header_search",
			templateUrl: "views/finman/fin_fee_bx_header_search.html",
			data: {
				pageTitle: '费用报销查询'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

					{
						name: 'inspinia',
						files: ['js/controllers/finman/fin_fee_bx_header_search.js']
					}

					);
				}
			}
		})
		//费用报销
		.state("crmman.fin_fee_bx_header", {
			url: "/fin_fee_bx_header",
			templateUrl: "views/finman/fin_fee_bx_header.html",
			data: {
				pageTitle: '费用报销'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

					{
						name: 'inspinia',
						files: ['js/controllers/finman/fin_fee_bx_header.js']
					}

					);   
				}
			}
		})
		//预算编制—变动
		.state("crmman.fin_bud_make_change", {
			url: "/fin_bud_make_change",
			templateUrl: "views/finman/fin_bud_make_change.html",
			data: {
				pageTitle: '预算编制-变动'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

				return $ocLazyLoad.load(

					{
						name: 'inspinia',
						files: ['js/controllers/finman/fin_bud_make_change.js']
					}

				);
				}
			}
		})
		//借款申请
		.state("crmman.mkt_loan_header", {
			url: "/mkt_loan_header",
			templateUrl: "views/finman/mkt_loan_header.html",
			data: {
				pageTitle: '借款申请'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

					{
						name: 'inspinia',
						files: ['js/controllers/finman/mkt_loan_header.js']
					}

				);
				}
			}
		})
		//费用申请结案
		.state("crmman.fin_fee_apply_header_over", {
			url: "/fin_fee_apply_header_over",
			templateUrl: "views/finman/fin_fee_apply_header_over.html",
			data: {
				pageTitle: '费用申请结案'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
				lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

						{
							name: 'inspinia',
							files: ['js/controllers/finman/fin_fee_apply_header_over.js']
						}

					);
				}
			}
		})
	//预算执行进度统计页面
	     .state("crmman.fin_bud_execution_progress", {
	         url: "fin_bud_execution_progress",
	         templateUrl: "views/finman/fin_bud_execution_progress.html",
	         data: {
	                pageTitle: '预算执行进度统计'
	         },
	         resolve: {
	               load: function($templateCache, $ocLazyLoad, $q, $http) {
	               lazyDeferred = $q.defer();

	                   return $ocLazyLoad.load(

	                   {
	                       name: 'inspinia',
	                       files: ['js/controllers/finman/fin_bud_execution_progress.js']
	                    }

	                );
	          }
	      }
	   })
		//预算使用明细页面
		.state("crmman.fin_bud_employ_detail", {
			url: "fin_bud_employ_detail",
			templateUrl: "views/finman/fin_bud_employ_detail.html",
			data: {
				pageTitle: '预算使用明细'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
				lazyDeferred = $q.defer();

					return $ocLazyLoad.load(

					{
						name: 'inspinia',
						files: ['js/controllers/finman/fin_bud_employ_detail.js']
					}

					);
				}
			}
		})
		//流程页面
		.state("crmman.wfform", {
		     url: "/wfform/:wftempid/:wfid",
             templateUrl: "views/baseman/base_wf.html",
			 data: {
					  pageTitle: '流程'
					},
					 resolve: {
					   load: function($templateCache, $ocLazyLoad, $q, $http) {
						   lazyDeferred = $q.defer();
						   return $ocLazyLoad.load({
							  name: 'inspinia',
							  files: ['js/controllers/baseman/ctrl_base_wf.js']
						   });
					  }
			  }
		})
		//流程实例页面
		.state("crmman.wfins", {
			url: "/wfins/:wftempid/:wfid/:objtypeid/:objid",
			templateUrl: "views/baseman/base_wfexec.html",
			data: {
				pageTitle: '流程实例'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();
					return $ocLazyLoad.load({
						name: 'inspinia',
						files: ['js/controllers/baseman/ctrl_base_wfexec.js']
					});
				}
			}
		})
	//销售管理页面
		.state("crmman.sale_yeartask_head", {
			url: "/sale_yeartask_head",
			templateUrl: "views/saleman/sale_yeartask_head.html",
			data: {
				pageTitle: '年度销售任务'
			},
			resolve: {
				load: function($templateCache, $ocLazyLoad, $q, $http) {
					lazyDeferred = $q.defer();
					return $ocLazyLoad.load({
						name: 'inspinia',
						files: ['js/controllers/saleman/sale_yeartask_head.js']
					});
				}
			}
		})
	//资料发布
	.state('crmman.info_share', {
	url: "/info_share",
	templateUrl: "views/mywork/info_share.html?v=" + window.rev,

	data: {
	pageTitle: '资料发布'
	},
	resolve: {
	load: function ($templateCache, $ocLazyLoad, $q, $http) {
	lazyDeferred = $q.defer();

	return $ocLazyLoad.load({
	name: 'inspinia',
	files: ['js/controllers/mywork/info_share.js?v=' + window.rev]
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