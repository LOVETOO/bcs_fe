/**
 * 部件
 * @since 2019-03-12
 */
(function (defineFn) {
	define(['module', 'directiveApi'], defineFn);
})(function (module,   directiveApi) {

	/**
	 * 指令
	 */
	hcWidgetDirective.$inject = [];
	function hcWidgetDirective() {
		return {
			scope: {},
			controller: HcWidgetController,
			compile: hcWidgetCompile
		};
	}

	/**
	 * 编译函数
	 */
	function hcWidgetCompile(tElement, tAttrs) {
		tElement.addClass('hc-list-box');

		return hcWidgetLink;
	}

	/**
	 * 控制器
	 */
	HcWidgetController.$inject = ['$scope', '$attrs', '$controller', '$q'];
	function HcWidgetController(   $scope,   $attrs,   $controller,   $q) {
		var setting = angular.extend({
			templateUrl: 'views/none.html'
		}, $scope.$parent.$eval($attrs.hcWidget));

		var $hcWidgetController; //卡片控制器
		if (setting.controller) {
			$hcWidgetController = $controller(setting.controller, {
				$scope: $scope,
				$element: $element
			});
		}
		else {
			$hcWidgetController = this;
		}

		Object.defineProperty($hcWidgetController, 'setting', {
			value: setting
		});

		return $hcWidgetController;
	}

	/**
	 * 连接函数
	 */
	function hcWidgetLink($scope, $element, $attrs, $hcWidgetController) {
		var $templateRequest = '$templateRequest'.asAngularService,
			$controller = '$controller'.asAngularService,
			$compile = '$compile'.asAngularService,
			$q = '$q'.asAngularService,
			setting = $hcWidgetController.setting,
			contentLinkFn,
			contentElement,
			scriptPromise,
			templatePromise;

		if (setting.class)
			$element.addClass(setting.class);

		if (setting.scriptUrl) {
			scriptPromise = $q(function (resolve, reject) {
				require(['/web/' + setting.scriptUrl], resolve, reject);
			});
		}
		else
			scriptPromise = $q.resolve();

		if (setting.templateUrl) {
			templatePromise = $templateRequest(setting.templateUrl);
		}

		$q.all([scriptPromise, templatePromise]).then(function (args) {
			var controller = args[0],
				template = args[1],
				ready = $q.defer();

			$hcWidgetController.ready = ready.promise;

			if ($hcWidgetController instanceof HcWidgetController && controller) {
				(function () {
					if (angular.isString(controller)
						|| angular.isFunction(controller)
						|| angular.isArray(controller)) { }
					else if (controller.controller) {
						controller = controller.controller;
					}
					else
						return;

					$controller(controller, {
						$scope: $scope,
						$element: $element,
						$hcWidgetController: $hcWidgetController
					});
				})();
			}

			contentLinkFn = $compile(template);			//编译

			contentElement = contentLinkFn($scope);		//连接

			$element.append(contentElement);			//插入

			ready.resolve();
		});
	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcWidgetDirective
	});
});