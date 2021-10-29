/**
 * 带分割条的容器
 * 分割条会产生在第一和第二个子元素中间
 * @since 2019-02-28
 */
(function (defineFn) {
	define(['module', 'directiveApi', 'cssApi', 'angular', 'jquery.splitter'], defineFn);
})(function (module,   directiveApi,   cssApi,   angular) {

	cssApi.loadCss('js/plugins/splitter/jquery.splitter.css');

	/**
	 * 指令
	 */
	function hcSplitterBoxDirective() {
		return {
			link: function hcSplitterBoxLink($scope, $element, $attrs) {
				var setting = $scope.$eval($attrs.hcSplitterBox);

				setting = angular.extend({
					orientation: 'v',
					limit: 0,
					position: '25%'
				}, setting);

				if (setting.orientation === 'h')
					setting.orientation = 'horizontal';
				else if (setting.orientation === 'v')
					setting.orientation = 'vertical';

				$scope.splitter = $element.split(setting);
			}
		};
	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcSplitterBoxDirective
	});
});