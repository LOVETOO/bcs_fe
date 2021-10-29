/**
 * 控制器Api
 * @since 2018-09-10
 */
define(
	['app', 'requireApi'],
	function (app, requireApi) {
		var api = {};

		api.controller = function (params) {
			var controllerName;

			//取不带后缀名的文件名为控制器名
			if (params.module)
				controllerName = requireApi.getModuleFileName(params.module, false);
			else
				controllerName = params.name;

			//默认为主app
			if (!params.app) params.app = app;

			//注册控制器
			app.controller(controllerName, params.controller);

			return {
				name: controllerName,
				controller: params.controller
			};
		};

		/**
		 * 注册控制器
		 * @param params
         */
        api.registerController = api.controller;

		/**
		 * 运行控制器
		 * @param params
		 * {
		 *   controller: 控制器
		 *   scope     : 作用域
		 * }
		 */
		api.run = function (params) {
            app.$injector.instantiate(params.controller, {
				$scope: params.scope
			});
		};

        /**
         * 实现面向对象的继承效果
         * @param params
         * {
		 *   controller: 控制器
		 *   scope     : 作用域
		 * }
         */
        api.extend = api.run;

		return api;
	}
);