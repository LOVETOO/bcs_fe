/**
 * 缓存
 * @since 2018-10-12
 */
(function () {
	if (window === top) {
		//顶层窗口，创建缓存
		console.log('顶层窗口，创建缓存');

		define(['exports'], function (exports) {
			exports.name = 'z';

			console.log('缓存创建完毕', exports);
		});
	}
	else {
		//非顶层窗口，引用顶层窗口的缓存
		console.log('非顶层窗口，引用顶层窗口的缓存');

		top.require(['cache'], function (cache) {
			console.log('顶层窗口的缓存', cache);

			define([], function () {
				console.log('非顶层窗口缓存定义完毕', cache);

				return cache;
			});
		});
	}
})();