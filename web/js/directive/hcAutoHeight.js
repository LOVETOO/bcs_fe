/**
 * 自适应高度
 * @since 2018-10-27
 */
define(
	['module', 'directiveApi'],
	function (module, directiveApi) {
		//定义指令
		var directive = [
			'$timeout',
			function ($timeout) {
				return {
                    compile: function (tElement) {
                        tElement.addClass('flex1');
                    }
					/* controller: ['$element', '$attrs', function ($element, $attrs) {
						var $hcAutoHeightController = this;

						var privateProperties = {
							disabled: false
						};

						Object.defineProperties($hcAutoHeightController, {
							disabled: {
								get: function () {
									return privateProperties.disabled;
								},
								set: function (value) {
									privateProperties.disabled = !!value;
								}
							}
						});

						$hcAutoHeightController.autoHeight = function autoHeight() {
							//若已禁用，退出
							if ($hcAutoHeightController.disabled) return;

							//窗口高度
							var bodyH = $("body").height();
							// var boxH = $(element).parents().first("[hc-auto-height]").outerHeight(true);

							//指令对象父级同胞高度
							var other = $($element).parents().siblings(".other-h");
							var otherH = 0;
							for (var i = 0; i < other.length; i++) {
								otherH += $(other[i]).outerHeight(true);
							}

							//指令对象同胞高度
							var siblings = $($element).siblings(".other-h");
							var siblingsH = 0;
							for (var i = 0; i < siblings.length; i++) {
								siblingsH += $(siblings[i]).outerHeight(true);
							}

							//元素内外边距
							var padding = $($element).outerHeight(true) - $($element).height();

							//表格的自适应高度
							if ($attrs.hcAutoHeight === 'grid') {
								var gridOther = $(".grid-other-h");
								var gridOtherH = 0;
								for (var i = 0; i < gridOther.length; i++) {
									gridOtherH += $(gridOther[i]).outerHeight(true);
								}

								var parentsOuter = $($element).parents("div[hc-auto-height]:first");
								var parentsOuterH = 0;
								if (parentsOuter.length > 0) {
									parentsOuterH = parentsOuter.outerHeight(true) - parentsOuter.height();
								}
								$($element).height(bodyH - otherH - parentsOuterH - siblingsH - gridOtherH - padding - 6);
							}
							//通用的自适应高度
							else {
								//指令对象高度为窗口高度 - 其他高度 - 内外边距 - iframe滚动条兼容距离1
								$($element).height(bodyH - otherH - siblingsH - padding - 6);
							}
						};
					}],
					link: function ($scope, $element, $attrs, $hcAutoHeightController) {
						$timeout($hcAutoHeightController.autoHeight, 500);
						$(window).resize($hcAutoHeightController.autoHeight);
					} */
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