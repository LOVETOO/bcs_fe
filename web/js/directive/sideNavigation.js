/**
 * 给菜单添加展开事件
 * @since 2018-09-27
 */
define(
	['module', 'directiveApi', 'jquery', 'jquery.metisMenu'],
	function (module, directiveApi, $) {
		//定义指令
		var directive = [
			'$timeout', '$interval',
			function ($timeout, $interval) {
				return {
					restrict: 'A',
					link: function (scope, element) {
						// Call the metsiMenu plugin and plug it to sidebar navigation
						$timeout(function () {
							//菜单下选中子菜单没有收回处理
							//                $(element).find("ul.item-list").find("a").on("click",function(e){
							//                  $(this).closest("ul.nav").siblings("a.nv").trigger("click");
							//                });
							//新菜单样式
							var $second_container = $(element).siblings("ul.nav").find("li.second_menu");
							$(element).find("a.nv").click(function (event) {
								var $e = event;

								var $this = $(this);
								if ($this.parent().hasClass("active")) {
									var scrollTop = $(element).scrollTop();
									var thisoffHeight = $this.parent()[0].offsetTop;

									var $secondmenu = $this.siblings("ul.nav-second-level").clone(true);

									//                      var k = $secondmenu.removeClass("hide").height();
									//                      $secondmenu.addClass("hide");

									$secondmenu.find("a").on("click", function () {
										$secondmenu.addClass("hide");
										$this.parent().removeClass("active").end().siblings("ul.nav").removeClass("in");
									});

									$secondmenu.css({
										height: 'auto',
										display: 'none'
									}).removeClass("hide");
									//
									$second_container.html("");
									$second_container.append($secondmenu).children().fadeIn(function () {
										$timeout(function () {
											//                              var h = $secondmenu.height();
											//                              h = h < 100 ? 100:h;
											////                                var top = thisoffHeight-130 - scrollTop;
											//                              var top = $e.clientY;
											//                              var li_header = $second_container.siblings("li.nav-header").height();
											//                              if((top + li_header + h) >document.body.clientHeight){
											////                                    $secondmenu.css({bottom:0})
											//                                  top = 0;
											//                              }else{
											//                                  top = thisoffHeight - h - scrollTop - li_header;
											//                              }
											//                              $secondmenu.css({top:top})
										});
									});
								} else {
									$second_container.html("");
								}
							});
							var nav_header = $(element).siblings("ul.nav").height();
							var heigth = document.body.clientHeight - nav_header;
							$(element).css({
								height: heigth
							});
							//$(element).perfectScrollbar();
						});

						(function () {
							var promise = $interval(function () {
								if (!element.find('li').has('ul').children('a').length) return;

								$interval.cancel(promise);

								element.metisMenu();
							});
						})();
					}
				};
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