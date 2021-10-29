/**
 * 指令Api
 * @since 2018-09-10
 */
define(
	['app', 'requireApi'],
	function (app, requireApi) {
		var api = {};

		/**
		 * 注册指令
		 * @param params = {
		 *     directive: 指令定义
		 *     module: 指令所在require模块
		 *     app: 指令注册到哪个app，默认为主app
		 * }
		 */
		api.directive = function (params) {
			var directiveName;
			if (params.name)
				directiveName = params.name;
			else
				//取不带后缀名的文件名为指令名
				directiveName = requireApi.getModuleFileName(params.module, false);

			//默认为主app
			if (!params.app) params.app = app;

			//注册指令
			params.app.directive(directiveName, params.directive);

			return {
				name: directiveName,
				directive: params.directive
			};
		};

		/**
		 * 注册全部指令
		 */
		api.directiveAll = function (directives) {
			app.directive(directives);
		};

		/**
		 * 取指令的模板路径
		 * @param params = {
		 *     module: 指令所在require模块
		 * }
		 */
		api.getTemplateUrl = function (params) {
			if (!params.module)
				params = {
					module: params
				};

			//取不带后缀名的文件名为指令名
			var directiveName = requireApi.getModuleFileName(params.module, false);

			return 'views/directive/' + directiveName + '.html';
		};

		return api;
	}
);