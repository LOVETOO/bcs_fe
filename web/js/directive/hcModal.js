/**
 * 模态框
 * @since 2019-01-08
 */
(function (defineFn) {
	define(['module', 'directiveApi', 'jquery', 'angular', 'angularApi'], defineFn);
})(function (module,   directiveApi,   $,        angular,   angularApi) {

	top.require([
		'directive/hcBox',
		'directive/hcInput',
		'directive/hcGrid'
	]);

	/**
	 * 指令
	 */
	function hcModalDirective() {
		return {
			compile: hcModalCompile
		};
	}

	/**
	 * 编译函数
	 */
	function hcModalCompile(tElement) {
		tElement.css('display', 'none');

		//把模态框的模板提取出来
		var template = tElement.html();
		tElement.empty();

		/**
		 * 链接函数
		 */
		return function hcModalLink($scope, $element, $attrs) {
			['$modal', function ($modal) {
				var modalHandler = {};

				var name = $attrs.hcModal || $attrs.name;
				if (name)
					$scope[name] = modalHandler;
				else {
					console.error('当使用 hc-modal 指令时，请在 hc-modal 或 name 属性上指定名称，否则无法将对象注入 $scope');
					return;
				}

				var fixedModalSetting = {
					template: template
				};

				modalHandler.open = function (modalSetting) {
					if (!modalSetting) modalSetting = $scope.$eval($attrs.hcModalSetting);

					modalSetting = angular.extend({}, modalSetting, fixedModalSetting);

					var modalInstance = $modal.open(modalSetting);

					return modalInstance;
				};
			}].callByAngular();
		};
	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcModalDirective
	});
});