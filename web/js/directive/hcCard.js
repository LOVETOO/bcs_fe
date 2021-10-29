/**
 * 卡片
 * @since 2019-03-12
 */
(function (defineFn) {
	define(['module', 'directiveApi'], defineFn);
})(function (module,   directiveApi) {

	/**
	 * 指令
	 */
	hcCardDirective.$inject = ['$interpolate'];
	function hcCardDirective(   $interpolate) {
		return {
			scope: {},
			controller: HcCardController,
			compile: hcCardCompile
		};
	}

	/**
	 * 编译函数
	 */
	function hcCardCompile(tElement, tAttrs) {
		tElement.addClass('hc-list-box');

		return hcCardLink;
	}

	/**
	 * 控制器
	 */
	HcCardController.$inject = ['$scope', '$attrs', '$controller'];
	function HcCardController(   $scope,   $attrs,   $controller) {
		var setting = angular.extend({
			templateUrl: 'views/none.html'
		}, $scope.$parent.$eval($attrs.hcCard));

		var $hcCardController; //卡片控制器
		if (setting.controller) {
			$hcCardController = $controller(setting.controller, {
				$scope: $scope
			});
		}
		else {
			$hcCardController = this;
		}

		Object.defineProperty($hcCardController, 'setting', {
			value: setting
		});

		return $hcCardController;
	}

	/**
	 * 连接函数
	 */
	function hcCardLink($scope, $element, $attrs, $hcCardController) {
		var $templateRequest = '$templateRequest'.asAngularService,
			$controller = '$controller'.asAngularService,
			$compile = '$compile'.asAngularService,
			$q = '$q'.asAngularService,
			setting = $hcCardController.setting,
			contentLinkFn,
			contentElement,
			scriptPromise,
			templatePromise;

		if (setting.scriptUrl) {
			scriptPromise = $q(function (resolve, reject) {
				require([location.origin + '/web/' + setting.scriptUrl], resolve, reject);
			});
		}
		else
			scriptPromise = $q.resolve();

		if (setting.templateUrl) {
			templatePromise = $templateRequest(setting.templateUrl);
		}

		$q.all([scriptPromise, templatePromise]).then(function (args) {
			var controller = args[0],
				template = args[1];

			if ($hcCardController instanceof HcCardController && controller) {
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
						$hcCardController: $hcCardController
					});
				})();
			}

			contentLinkFn = $compile(template);			//编译

			contentElement = contentLinkFn($scope);		//连接

			$element.append(contentElement);			//插入
		});
	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcCardDirective
	});
});