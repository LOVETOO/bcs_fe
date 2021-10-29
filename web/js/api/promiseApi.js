/**
 * 承诺Api
 * @since 2018-09-17
 */
define(
	['angular', '$q', '$timeout', 'arrayApi'],
	function (angular, $q, $timeout, arrayApi) {

		/**
		 * 返回1个带 resolve 和 reject 的Promise
		 * @return {Promise}
		 */
		function api() {
			var deferred = $q.defer();

			['resolve', 'reject'].forEach(function (fnName) {
				deferred.promise[fnName] = deferred[fnName].bind(deferred);
			});

			return deferred.promise;
		}

		/**
		 * 开始异步执行函数
		 * @param {function} fn 目标函数
		 * @param 剩余参数为目标函数的参数
		 * @return {Promise}
		 */
		api.start = function (fn) {
			if (!angular.isFunction(fn))
				return $q.reject();

			if (arguments.length === 1)
				return $q.when().then(fn);

			return $q.when().then(function () {
				return fn.apply(null, arrayApi.toArray(arguments, 1));
			});
		};

		/**
		 * 此函数返回一个未解决的承诺。
		 * 每隔一段时间，会执行一次检查函数。
		 * 若检查函数返回`true`，则 返回的承诺会解决。
		 * @param {() => boolean} testFn 检查函数，必须显式地返回`true`或`false`
		 * @param {number} [interval=100] 检查时间间隔，默认100
		 * @return {Promise<undefined>}
		 * @since
		 */
		api.whenTrue = function (testFn, interval) {
			var promise = api();

			if (!interval) interval = 100;

			/**
			 * 周期执行函数
			 */
			function periodicFn() {
				$timeout(testFn, interval).then(function (testResult) {
					if (testResult === true)
						promise.resolve();
					else
						periodicFn();
				});
			}

			periodicFn();

			return promise;
		};

		/**
		 * 此函数返回一个未解决的承诺。
		 * 每隔一段时间，会执行一次检查函数。
		 * 若检查函数返回`false`，则 返回的承诺会解决。
		 * @param {() => boolean} testFn 检查函数，必须显式地返回`true`或`false`
		 * @param {number} [interval=100] 检查时间间隔，默认100
		 * @return {Promise<undefined>}
		 * @since
		 */
		api.whenFalse = function (testFn, interval) {
			return api.whenTrue(function () {
				return testFn() === false;
			}, interval);
		};

		/**
		 * 判断对象是否是承诺
		 * @param obj
		 * @return {boolean}
		 */
		api.isPromise = function (obj) {
			return obj && angular.isFunction(obj.then);
		};

		/**
		 * 把对象转为承诺
		 * @param obj
		 * @return {Promise}
		 */
		api.toPromise = function (obj) {
			return api.isPromise(obj) ? obj : api.resolve(obj);
		};

		['resolve', 'reject', 'all'].forEach(function (fnName) {
			api[fnName] = $q[fnName].bind($q);
		});

		return api;
	}
);