/**
 * 折叠左侧菜单栏
 * @since 2019-01-11
 */
(function (defineFn) {
	define(['module', 'directiveApi', 'jquery'], defineFn);
})(function (module,   directiveApi,   $) {

	/**
	 * 指令
	 */
	function hcCollapseLeftBarDirective() {
		return {
			scope: {},
			template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="collapseLeftBar()"><i class="fa fa-bars"></i></a>',
			link: hcCollapseLeftBarLink
		};
	}

	/**
	 * 连接函数
	 */
	function hcCollapseLeftBarLink($scope) {
		$scope.collapseLeftBar = function () {
			$("body").toggleClass("mini-navbar");
			if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
				// Hide menu in order to smoothly turn on when maximize menu
				// $("body").toggleClass("mini-navbar");
				$('#side-menu').hide();
				// For smoothly turn on menu
				setTimeout(
					function () {
						$('#side-menu').fadeIn(500);
					}, 100);
			} else if ($('body').hasClass('fixed-sidebar')) {
				// alert('#side-menu2');
				$('#side-menu').hide();
				setTimeout(
					function () {
						$('#side-menu').fadeIn(500);
					}, 300);
			} else {
				// Remove all inline style from jquery fadeIn function to reset menu state
				//alert('#side-menu3');
				//                    $('#side-menu').removeAttr('style');
			}

			// add by dhw 2016-03-17
			if ($('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
				$("#mymenu").removeClass("mini-navbar2");
			} else {
				$("#mymenu").addClass("mini-navbar2");
			}
			setTimeout(function () {
				var nav_header = $('#side-menu').siblings("ul.nav").height();
				var heigth = document.body.clientHeight - nav_header;
				$('#side-menu').css({
					height: heigth
				});
				$('#side-menu').perfectScrollbar('update');
				$('#side-menu').perfectScrollbar('resize');

				$('div.page-heading').css({
					width: $("#MainCtrl").width()
				});
			}, 500);
		}
	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcCollapseLeftBarDirective
	});
});