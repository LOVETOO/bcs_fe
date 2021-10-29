/**
 * 对象列表页模板
 * @since 2018-09-19
 */
define(['module', 'directiveApi', 'jquery', 'angular', 'requireApi', 'directive/hcGrid', 'directive/hcButtons', 'directive/hcFilter'], function (module, directiveApi, $, angular, requireApi) {
	//定义指令
	var directive = ['$q', '$compile', function ($q, $compile) {
		return {
			templateUrl: directiveApi.getTemplateUrl(module),
			link: function ($scope, $element, $attrs) {
				$element.height('100%');

				/**
				 * 处理查询条件面板
				 */
				(function () {
					var $searchPanel;
					var searchPanelVisible = false;

					Object.defineProperty($scope, 'hasSearchPanel', {
						value: !!$attrs.$$children.filter('hc-obj-list-search-panel').length
					});

					Object.defineProperty($scope, 'searchPanelVisible', {
						get: function () {
							return searchPanelVisible;
						},
						set: function (value) {
							if (!$scope.hasSearchPanel) {
								return;
							}

							value = !!value;

							if (value === searchPanelVisible) {
								return;
							}

							if (value) {
								if ($searchPanel) {
									$searchPanel.removeClass('ng-hide');
								}
								else {
									$searchPanel = $attrs.$$children.filter('hc-obj-list-search-panel');

									if ($searchPanel.length) {
										$searchPanel.addClass('ng-hide');

										$searchPanel.css({
											padding: '0 15px'
										});

										$compile($searchPanel)($scope);

										$searchPanel.on('keydown', function (event) {
											if (event.key === 'Enter'
												&& !event.ctrlKey
												&& !event.shiftKey
												&& !event.altKey) {
												$scope.refresh();
											}
										});

										$element.find('hc-obj-list-search-panel').replaceWith($searchPanel);

										//延时显示，以免弹性布局调整失效
										setTimeout(function () {
											$searchPanel.removeClass('ng-hide');
										}, 100);
									}
								}
							}
							else {
								if ($searchPanel) {
									$searchPanel.addClass('ng-hide');
								}
							}

							searchPanelVisible = value;
						}
					});
				})();
			}
		}
	}];

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: directive
	});
});