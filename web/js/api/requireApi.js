/**
 * requireApi
 */
define(
	['angular'],
	function (angular) {
		var api = {};

		/**
		 * 取模块的文件名
		 * @param {string|{ uri: string }} uri 模块或模块的路径
		 * @param {boolean} withSuffix 返回文件名是否带后缀名，默认带后缀名
		 */
		api.getModuleFileName = function (uri, withSuffix) {
			if (angular.isObject(uri) && angular.isString(uri.uri))
				return api.getModuleFileName(uri.uri, withSuffix);

			if (!angular.isString(uri))
				return '';

			(function () {
				//最后一个右斜杠的位置
				var lastIndexOfSprit = uri.lastIndexOf('/');
				if (lastIndexOfSprit !== -1)
					uri = uri.substring(lastIndexOfSprit + 1);
			})();


			if (withSuffix === false)
				(function () {
					//最后一个点号的位置
					var lastIndexOfDot = uri.lastIndexOf('.');
					if (lastIndexOfDot !== -1) {
						uri = uri.substring(0, lastIndexOfDot);

						lastIndexOfDot = uri.lastIndexOf('.');
						if (lastIndexOfDot !== -1) {
							//若是压缩文件（带.min），截掉.min
							if (uri.substring(lastIndexOfDot + 1) === 'min')
								uri = uri.substring(0, lastIndexOfDot);
						}
					}
				})();

			return uri;
		};

		/**
		 * 使用 Promise 机制加载依赖
		 * @param {string|string[]} depends 依赖数组
		 * @since 2019-06-27
		 */
		api.usePromiseToRequire = function (depends) {
			var $q, deferred, promise, then;

			$q = '$q'.asAngularService;

			deferred = $q.defer();

			promise = deferred.promise;
			
			then = promise.then;

			//把成功回调改造成 require 风格
			promise.then = function (callback) {
				var originalCallback = callback;

				callback = function (dependInstances) {
					return originalCallback.apply(this, dependInstances);
				};

				return then.apply(this, arguments);
			};

			if (typeof depends === 'string') {
				depends = [depends];
			}

			require(depends, function () {
				var dependInstances = Array.prototype.slice.call(arguments);

				deferred.resolve(dependInstances);
			}, deferred.reject);

			return promise;
		};

		return api;
	}
);