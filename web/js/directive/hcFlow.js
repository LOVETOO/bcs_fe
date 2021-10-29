/**
 * 流程图组件
 * @since 2018-12-19
 */
(function (defineFn) {
	define(['module', 'directiveApi', 'angular', 'promiseApi', 'angularApi', 'GooFlow'], defineFn);
})(function (module, directiveApi, angular, promiseApi, angularApi) {
	require(['cssApi'], function (cssApi) {
		cssApi.loadCss([
			'js/plugins/GooFlow/GooFlow.css',
			'js/plugins/GooFlow/fonts/iconflow.css'
		]);
	});

	/**
	 * 指令
	 */
	function hcFlowDirective() {
		return {
			scope: {},
			compile: hcFlowCompile,
			controller: HcFlowController
		};
	}

	/**
	 * 控制器
	 * @constructor
	 */
	HcFlowController.$inject = ['$scope', '$element', '$attrs'];
	function HcFlowController($scope, $element, $attrs) {
		var flowController = this;
		var setting = $scope.$parent.$eval($attrs.hcFlow);

		flowController.getSetting = function () {
			return setting;
		};

		setting.hcElement = $element;
		setting.hcController = flowController;
		setting.hcReady = setting.hcReady || promiseApi();
	}

	/**
	 * 编译函数
	 * @param {*} tElement
	 * @param {*} tAttrs
	 */
	function hcFlowCompile(tElement, tAttrs) {
		return hcFlowLink;
	}

	/**
	 * 连接函数
	 * @param {*} $scope
	 * @param {*} $element
	 * @param {*} $attrs
	 * @param {*} flowController
	 */
	function hcFlowLink($scope, $element, $attrs, flowController) {
		var setting = flowController.getSetting();
		var hcFlow = $.createGooFlow($element, setting);

		setting.hcFlow = hcFlow;
		setting.hcReady.resolve(hcFlow);

		if (setting.hcName)
			$scope.$parent[setting.hcName] = hcFlow;

		if (setting.hcEvents) {
			//注册事件
			angular.forEach(setting.hcEvents, function (eventHandler, eventName) {
				hcFlow[eventName] = function () {
					var result = eventHandler.apply(hcFlow, arguments);

					angularApi.applyToScope($scope);

					return result;
				};
			});
		}
	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcFlowDirective
	});
});