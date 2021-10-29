/**
 * 图片盒子
 * @since 2019-06-05
 */
(function (defineFn) {
	define(['module', 'directiveApi', 'jquery', 'fileApi', 'directive/hcImg'], defineFn);
})(function (module,   directiveApi,   $,        fileApi) {

	/**
	 * 指令
	 */
	hcImgBoxDirective.$inject = ['$parse'];
	function hcImgBoxDirective(   $parse) {
		return {
			restrict: 'E',
			template: function hcImgTemplate(tElement, tAttrs) {
				tElement.addClass('hc-img-box');

				return [
					$('<img>', {
						'class': 'hc-img-box-img',
						'ng-style': '{ opacity: +' + tAttrs.hcImg + ' ? null : 0 }',
						'hc-img': tAttrs.hcImg,
						'hc-img-default': tAttrs.hcImgDefault
					}),

					$('<i>', {
						'class': 'iconfont hc-add hc-img-box-add',
						'ng-style': '{ opacity: +' + tAttrs.hcImg + ' ? 0 : null }'
					}),

					$('<i>', {
						'class': 'iconfont hc-delete hc-img-box-delete'
					})
				];
			},
			link: function hcImgBoxLink($scope, $element, $attrs) {
				var getImgId = $parse($attrs.hcImg),
					setImgId = getImgId.assign;

				getImgId = getImgId.bind(null, $scope);
				setImgId = setImgId.bind(null, $scope);

				$element.find('.hc-img-box-add').on('click', function () {
					fileApi
						.uploadFile({
							multiple: false,
							accept: 'image/*'
						})
						.then(function (docs) {
							setImgId(docs[0].docid);
						});
				});

				$element.find('.hc-img-box-delete').on('click', function () {
					$scope.$evalAsync(function () {
						setImgId(0);
					});
				});
			}
		};
	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcImgBoxDirective
	});
});