/**
 * wrapHeight
 * @since 2018-09-10
 */
define(
	['module', 'directiveApi', 'angular', 'inspinia', 'jquery.divscroll'],
	function (module, directiveApi, angular, inspinia) {
		//定义指令
		var directive = [
			'$timeout',
			function ($timeout) {
				return {
					restrict: 'AE',
					link: function (scope, element, attrs) {
						$timeout(function () {
							var header_height = $("#MainCtrl").height();
							$(element).css({
								// 'margin-right': '-12px',
								// 'padding-right': '12px',
								'overflow-x': 'hidden'//,
								//"height": document.body.offsetHeight - header_height - $("div.footer").height() - 4
							});

							var height = document.body.offsetHeight;
							if (angular.isNumber(header_height) && header_height === header_height)
								height -= header_height;
							var footer_height = $("div.footer").height();
							if (angular.isNumber(footer_height) && footer_height === footer_height)
								height -= footer_height;
							height -= 4;
							element.height(height);

							$(element).perfectScrollbar();
							//              $(element).children().css({'overflow-x':'hidden'});
							inspinia.fix_height();
						}, 100);

						$("body").on("click", function () {
							$timeout(function () {
								var header_height = $("#MainCtrl").height();
								$("div.wrap-height").css({
									"height": document.body.offsetHeight - header_height - $("div.footer").height()
								});
								inspinia.fix_height();
								$('div.wrap-height').perfectScrollbar('update');
								$('div.wrap-height').perfectScrollbar('resize');
							});
						});
					}
				}
			}
		];

		//使用Api注册指令
		//需传入require模块和指令定义
		return directiveApi.directive({
			module: module,
			directive: directive
		});
	}
);