/**
 * 图片指令
 * @since 2019-04-22
 */
(function (defineFn) {
	define(['module', 'directiveApi', 'numberApi', 'requestApi', 'fileApi', 'angular'], defineFn);
})(function (module,   directiveApi,   numberApi,   requestApi,   fileApi,   angular) {

	/**
	 * 指令
	 */
	function hcImgDirective() {
		return {
			link: hcImgLink
		};
	}

	/**
	 * 连接函数
	 */
	function hcImgLink($scope, $element, $attrs) {
		if ($element.is('hc-img-box')) return;

		if (!$element.is('img,link')) {
			throw new Error('hc-img 指令只能用于 img、link、hc-img-box 标签');
		}

		$scope.$watch($attrs.hcImg, function (img) {
			var id = 0;

			if (angular.isString(img) || angular.isNumber(img)) {
				id = numberApi.toNumber(img);
			}
			else if (angular.isObject(img)) {
				id = numberApi.toNumber(img.docid);
			}

			setSrc(id);

			function setSrc(id) {
				var id = numberApi.toNumber(id),
					src;

				if (id) {
					src = '/downloadfile?docid=' + id;

					//若是缩略图
					if ($scope.$eval($attrs.hcImgThumb)) {
						src += '&viewtype=1';
					}
				}
				else {
					src = $attrs.hcImgDefault || '';
				}

				var key = $element.is('link') ? 'href' : 'src';

				$element.attr(key, src);
			}
		});
	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcImgDirective
	});
});