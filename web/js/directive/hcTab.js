/**
 * 标签页头部组件
 * @since 2018-10-06
 */
define(
	['module', 'directiveApi', 'jquery', 'angular', 'angularApi'],
	function (module, directiveApi, $, angular, angularApi) {
        'use strict';
        
        HcTabController.maxId = 0;

		//控制器
		HcTabController.$inject = ['$scope', '$element', '$attrs','$parse'];
		function HcTabController(   $scope,   $element,   $attrs,  $parse) {
			var controller, activeTabId, activeTab;

            controller = this;
            $scope.navId = controller.id = ++HcTabController.maxId;

            $element.attr('id', 'hc-nav-tabs-' + $scope.navId);

			$scope.tabs = $scope.getTabs();

			$scope.$watchCollection('tabs', function () {
				$scope.sortedTabs = [];

				angular.forEach($scope.tabs, function (tab, id) {
					$scope.sortedTabs.push({
						id: id,
						tab: tab
					});
				});

				if (typeof $scope.tabSort === 'function') {
					$scope.sortedTabs.sort($scope.tabSort);
				}
			});

			if ($attrs.hcTabAs) {
				$parse($attrs.hcTabAs).assign($scope.$parent, controller);
			}

			Object.defineProperties($scope.tabs, {
				activeTabId: {
					get: function () {
						return activeTabId;
					}
				},
				activeTab: {
					get: function () {
						return activeTab;
					}
				}
			});

			(function () {
				var tabIds = Object.keys($scope.tabs);

				if (!tabIds.length) return;

				activeTabId = tabIds.find(function (tabId) {
					return $scope.tabs[tabId].active;
				});

				if (!activeTabId)
					activeTabId = tabIds[0];

				activeTab = $scope.tabs[activeTabId];
			})();

			$element.on('show.bs.tab', function (event) {
				var tabScope = $(event.target).scope();

				angular.forEach($scope.tabs, function (tab, id) {
					tab.active = id === tabScope.id;

					if (tab.active) {
						activeTabId = id;
						activeTab = tab;
					}
				});

				$scope.onTabChange({
					params: {
						id: tabScope.id,
						tab: tabScope.tab
					}
				});

				angularApi.applyToScope($scope);
			});

			/**
			 * 判断指定的标签页是否处于激活状态
			 * @param {string|object} tab 标签页定义或其ID
			 * @returns {boolean}
			 */
			controller.isTabActive = function (tab) {
				return tab === activeTabId || tab === activeTab;
			};

			/**
			 * 返回处于激活状态的标签页定义
			 * @returns {object}
			 */
			controller.getActiveTab = function () {
				activeTab.id = activeTabId;

				return activeTab;
			};

			/**
			 * 激活指定的标签页
			 * @param {string|object} tab 标签页定义或其ID
			 */
			controller.setActiveTab = function (tab) {
				var tabId;

				if (typeof tab === 'string') {
					tabId = tab;
				}
				else {
					tabId = Object.keys($scope.tabs).find(function (theTabId) {
						return $scope.tabs[theTabId] === tab;
					});
				}

				if (tabId) {
					tab = $scope.tabs[tabId];
				}
				else {
					tab = null;
				}

				if (tabId && tab) {
					var $tabElement = $element
						.children('ul')
						.children('li')
						.children('a[hc-tab-id="' + tabId + '"]')

					$tabElement.tab && $tabElement.tab('show');
				}
			};

			/**
			 * 标签页是否需要隐藏
			 * @param params = {
			 *     id: 标签页ID - string
			 *     tab: 标签页定义 - object
			 * }
			 * @return {boolean}
			 * @since 2018-10-11
			 */
			$scope.isTabNeedHide = function (params) {
				var hide = params.tab.hide;

				if (hide === true)
					return true;

				if (angular.isFunction(hide))
					return hide(params);

				return false;
			};

			/**
			 * 返回标签页标题
			 * @param params = {
			 *     id: 标签页ID - string
			 *     tab: 标签页定义 - object
			 * }
			 * @return {boolean}
			 * @since 2018-12-20
			 */
			$scope.getTitle = function (params) {
				var title = params.tab.title;

				if (angular.isString(title))
					return title;

				if (angular.isFunction(title))
					return title(params);

				return '未命名标签页';
			};

		}

		//定义指令
		var directive = function () {
			return {
				restrict: 'A',
				templateUrl: directiveApi.getTemplateUrl(module),
				scope: {
					getTabs: '&hcTab',
					classOfUl: '@hcTabClassUl',
					classOfLi: '@hcTabClassLi',
					classOfA: '@hcTabClassA',
					onTabChange: '&hcTabChange',
					tabSort: '=hcTabSort'
				},
				controller: HcTabController,
				link: function ($scope, $element, $attrs) {
					if ($attrs.hcTabReady) {
						$scope.$parent.$eval($attrs.hcTabReady);
					}
				}
			};
		};

		//使用Api注册指令
		//需传入require模块和指令定义
		return directiveApi.directive({
			module: module,
			directive: directive
		});
	}
);