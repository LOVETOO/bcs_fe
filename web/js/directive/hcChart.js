/**
 * 图表组件
 * @since 2019-04-24
 */
(function (defineFn) {
	define(['module', 'directiveApi', 'cssApi', 'angular', 'echarts'], defineFn);
})(function (module,   directiveApi,   cssApi,   angular,   echarts) {

	require(['css!../css/hc.chart.css']);

	//地图
	var maps = [
		'anhui',
		'aomen',
		'beijing',
		'chongqing',
		'fujian',
		'gansu',
		'guangdong',
		'guangxi',
		'guizhou',
		'hainan',
		'hebei',
		'heilongjiang',
		'henan',
		'hubei',
		'hunan',
		'jiangsu',
		'jiangxi',
		'jilin',
		'liaoning',
		'neimenggu',
		'ningxia',
		'qinghai',
		'shandong',
		'shanghai',
		'shanxi',
		'shanxi1',
		'sichuan',
		'taiwan',
		'tianjin',
		'xianggang',
		'xinjiang',
		'xizang',
		'yunnan',
		'zhejiang'
	].map(function (name) {
		return 'plugins/echarts/4.2.1/map/js/province/' + name;
	});

	maps.unshift('plugins/echarts/4.2.1/map/js/china');

	/* setTimeout(function () {
		require(maps); //预加载地图
	}, 5000); */

	var extensions = {};	//eCharts 扩展

	/**
	 * hc-chart-option（必须）：指定图表选项的存取器
	 * hc-chart-theme：指定图表的主题：light、dark
	 * hc-chart-as：指定产生图表实例后赋值到作用域的位置
	 * hc-chart-ready：图表就绪后执行的表达式，注入本地变量 $element、$chart、$echarts
	 */
	hcChartDirective.$inject = ['$parse'];
	function hcChartDirective(   $parse) {
		return {
			restrict: 'E',
			link: function hcChartLink($scope, $element, $attrs) {
				if (!$attrs.hcChartOption) {
					throw new Error('hc-chart 元素必须具有 hc-chart-option 属性');
				}

				if (!/^\w+$/.test($attrs.hcChartOption)) {
					throw new Error('hc-chart 元素的 hc-chart-option 属性只能是单层属性表达式');
				}

				var setChart; //图表实例赋值器

				if ($attrs.hcChartAs) {
					setChart = $parse($attrs.hcChartAs).assign;

					if (!setChart) {
						throw new Error('hc-chart 元素的 hc-chart-as 属性必须为可赋值的表达式');
					}
				}

				var chart,														//图表实例
					chartOptionToInit = $scope.$eval($attrs.hcChartOption);		//初始化的图表选项

				//把图表选项的表达式改造为赋值器，使得赋值时会调用 setOption
				Object.defineProperty($scope, $attrs.hcChartOption, {
					get: function () {
						return chart.getOption();
					},
					set: function (option) {
						//图表类型
						var type = $parse('series[0].type')(option);

						//若需要使用百度地图，而还未加载时
						if (option.bmap && !extensions.bmap) {
							require(['bmap'], function (bmap) {
								extensions.bmap = bmap;

								//把 bmap 放入元素
								$element.data('$bmap', bmap);

								chart.setOption(option);
							});
						}
						else if (type === 'map') {
							require(maps, function () {
								chart.setOption(option);
							});
						}
						else {
							chart.setOption(option);
						}
					}
				});

				//创建图表
				chart = echarts.init($element[0], $attrs.hcChartTheme);

				//把图表实例放入元素
				$element.data('$chart', chart);
				//把 eCharts 放入元素
				$element.data('$echarts', chart);

				if (setChart) {
					//把图表实例赋值到作用域
					setChart($scope, chart);
				}

				//若有初始的图表选项，设置选项
				if (chartOptionToInit) {
					$scope[$attrs.hcChartOption] = chartOptionToInit;
				}

				//若有就绪事件，回调
				if ($attrs.hcChartReady) {
					$scope.$eval($attrs.hcChartReady, {
						$element: $element,
						$chart: chart,
						$echarts: echarts
					});
                }
                
                //自适应尺寸
                (function () {
                    var height, width;

                    saveSize($element.height(), $element.width());

                    function saveSize(h, w) {
                        height = h;
                        width = w;
                    };

                    var taskId = setInterval(function () {
                        var h = $element.height();
                        var w = $element.width();

                        if (h <= 0 || w <= 0) {
                            return;
                        }

                        if (h == height && w == width) {
                            return;
                        }

                        saveSize(h, w);

                        chart.resize();
                    }, 1e3);

                    $scope.$on('$destroy', function () {
                        clearInterval(taskId);
                    });
                })();
			}
		};
	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcChartDirective
	});
});