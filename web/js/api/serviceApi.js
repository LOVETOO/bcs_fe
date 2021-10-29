/**
 * 服务Api
 * @since 2018-09-14
 */
define(
	['requireApi', 'angular', 'app'],
	function (requireApi, angular, app) {
		var api = {};

		var ngInjector;

		/**
		 * 获取注入器
		 * @return {Injector} 注入器
		 */
		function getInjector() {
			//若 app 已启动，返回app的注入器
			console.assert(app.$injector, '缺少注入器');
			return app.$injector;
		}

		/**
		 * 获取服务
		 * @param {string|{module:{}}} params
		 */
		api.getService = function (params) {
			var serviceName;

			//直接指定了服务名
			if (angular.isString(params))
				serviceName = params;
			else {
				var module;

				if (params.id)
					module = params;
				else
					module = params.module;

				//取不带后缀名的文件名为服务名
				serviceName = requireApi.getModuleFileName(module, false);
			}

			return getInjector().get(serviceName);
		};

		return api;
	}
);