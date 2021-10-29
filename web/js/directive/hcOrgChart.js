/**
 * 组织架构图
 * @since 2019-05-16
 */
(function (defineFn) {
	define(['module', 'directiveApi', 'cssApi', 'angular', 'orgchart'], defineFn);
})(function (module,   directiveApi,   cssApi,   angular) {

	cssApi.loadCss(
		'js/plugins/OrgChart/dist/css/jquery.orgchart.min.css',
		'css/hc.orgchart.css'
	);

	/**
	 * hc-org-chart-option（必须）：指定组织架构图选项的存取器
	 * hc-org-chart-as：指定产生组织架构图实例后赋值到作用域的位置
	 * hc-org-chart-ready：组织架构图就绪后执行的表达式，注入本地变量 $element、$orgChart
	 */
	hcOrgChartDirective.$inject = ['$parse'];
	function hcOrgChartDirective(   $parse) {
		return {
			restrict: 'E',
			link: function hcOrgChartLink($scope, $element, $attrs) {
				if (!$attrs.hcOrgChartOption) {
					throw new Error('hc-org-chart 元素必须具有 hc-org-chart-option 属性');
				}

				if (!/^\w+$/.test($attrs.hcOrgChartOption)) {
					throw new Error('hc-org-chart 元素的 hc-org-chart-option 属性只能是单层属性表达式');
				}

				var setOrgChart; //组织架构图实例赋值器

				if ($attrs.hcOrgChartAs) {
					setOrgChart = $parse($attrs.hcOrgChartAs).assign;

					if (!setOrgChart) {
						throw new Error('hc-org-chart 元素的 hc-org-chart-as 属性必须为可赋值的表达式');
					}
				}

				var orgChart,															//组织架构图实例
					orgChartOptionToInit = angular.extend({
						zoom: true,								//允许缩放
						pan: true,
						draggable: true
					}, $scope.$eval($attrs.hcOrgChartOption));							//初始化的组织架构图选项

				//把组织架构图选项的表达式改造为赋值器，使得赋值时会调用 setOption
				Object.defineProperty($scope, $attrs.hcOrgChartOption, {
					get: function () {
						return orgChart.options;
					},
					set: function (option) {
						orgChart.setOptions(option);
					}
				});

				//创建组织架构图
				orgChart = $element.orgchart(orgChartOptionToInit);

				//把组织架构图实例放入元素
				$element.data('$orgChart', orgChart);

				if (setOrgChart) {
					//把组织架构图实例赋值到作用域
					setOrgChart($scope, orgChart);
				}

				//若有就绪事件，回调
				if ($attrs.hcOrgChartReady) {
					$scope.$eval($attrs.hcOrgChartReady, {
						$element: $element,
						$orgChart: orgChart
					});
				}
			}
		};
	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcOrgChartDirective
	});
});