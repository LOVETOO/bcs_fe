/**
 * 按钮
 * @since 2018-10-08
 */
define(
	['module', 'directiveApi'],
	function (module, directiveApi) {
		//定义指令
		var directive = [
			'$q',
			function ($q) {
				var colorClasses = {
					'btn-white': true,
					'btn-red': true,
					'btn-blue': true,
					'btn-green': true,
					'btn-orange': true,
					'btn-default': true,
					'btn-primary': true,
					'btn-shadow': true,
					'btn-info': true,
					'btn-success': true,
					'btn-warning': true,
					'btn-danger': true
				};

				var defaultColorClass = 'btn-white';

				return {
					replace: true,
					transclude: true,
					templateUrl: directiveApi.getTemplateUrl(module),
					scope: {
						click: '&hcButton',
						icon: '@hcIcon',
						title: '@hcTitle',
						disabled: '&hcDisabled'
					},
					link: function ($scope, $element, $attrs) {
						//点击保护，避免多次点击影响
						$scope.click = (function (click) {
							return function () {
								if ($scope.clickRunning) return;

								$scope.clickRunning = true;

								var _this = this,
									_arguments = arguments;

								$q
									.when()
									.then(function () {
										return click.apply(_this, _arguments);
									})
									.finally(function () {
										$scope.clickRunning = false;
									});
							};
						})($scope.click);

						var classValue = $element.attr('class');

						var hasColorClass = classValue.split(/\s+/).some(function (className) {
							return colorClasses[className];
						});

						if (!hasColorClass) {
							$element.addClass(defaultColorClass);
						}
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