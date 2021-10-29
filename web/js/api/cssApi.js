/**
 * css相关Api
 * @since 2018-11-28
 */
define(['exports', 'jquery', 'angular', '$q'], function (api, $, angular, $q) {

	var cssCache = Object.create(null);

	/**
	 * 加载css
	 * @since 2018-11-28
	 */
	api.loadCss = function (cssHrefList) {
		if (!angular.isArray(cssHrefList)) {
			cssHrefList = Array.prototype.slice.call(arguments);
		}

		return $q.all(cssHrefList.map(function (cssHref) {
			var cssId;

			//确保 css 的唯一性
			(function () {
				var lastDotIndex = cssHref.lastIndexOf('.');
				var suffix = lastDotIndex >= 0 ? cssHref.substr(lastDotIndex + 1) : '';

				//若 css 的 url 指定了合法后缀，css 的ID为后缀前面部分
				if (['css', 'gzcss'].indexOf(suffix) >= 0) {
					cssId = cssHref.substring(0, lastDotIndex);
				}
				//否则，css 的ID为指定的 url，同时 该 url 需要添加后缀
				else {
					cssId = cssHref;
					cssHref += '.css';
				}
			})();

			if (cssId in cssCache) return;

			cssHref += '?' + $.param({
				v: window.rev
			});

			var cssElement = $('<link rel="stylesheet" async>').attr('href', cssHref).insertBefore('#loadBefore');

			cssCache[cssId] = cssElement;
		}));
	};

});