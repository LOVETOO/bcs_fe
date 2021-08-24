/**
 * 演示 - 空白页面
 * @since 2019-04-30
 */
(function (defineFn) {
	define(['module', 'controllerApi', 'base_diy_page', 'requireApi', 'directive/hcBox', 'directive/hcChart', 'directive/hcOrgChart', 'directive/hcRichText', 'plugins/echarts/4.2.1/map/js/china', 'plugins/echarts/4.2.1/map/js/china-contour', 'plugins/echarts/4.2.1/map/js/province/guangdong', 'directive/hcSortable'], defineFn);
})(function (module,   controllerApi,   base_diy_page,   requireApi) {

	/**
	 * 控制器
	 */
	DemoDiyPage.$inject = ['$scope', '$timeout'];
	function DemoDiyPage(   $scope,   $timeout) {

		controllerApi.extend({
			controller: base_diy_page.controller,
			scope: $scope
		});

		$scope.onFocus = function ($event) {
			$scope.$eval("data.currItem.focusOrBlur = '获得焦点'");
		};

		$scope.onBlur = function ($event) {
			$scope.$eval("data.currItem.focusOrBlur = '失去焦点'");
		};

		//==================== 表格 ====================

		/**
		 * 表格选项
		 */
		$scope.gridOptions = {
			//上下文（作用：此对象会被传入表格的部分回调的参数中）
			context: {
				//考核结果等级
				//放在上下文这里是为了共享给单元格渲染器选择器和值格式化器
				result_levels: {
					names: ['优', '良', '及格', '不及格'],
					values: [1, 2, 3, 4]
				}
			},
			defaultColDef: {
				editable: true
			},
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'result_type',
					headerName: '结果类型',
					type: '词汇',
					cellEditorParams: {
						names: ['等级', '成绩'],
						values: [1, 2]
					},
					onCellValueChanged: function (params) {
						if (params.newValue == params.oldValue) {
							return;
						}

						//修改【结果类型】后，应清空【考核结果】的值
						params.api.hcApi.setCellValue(params.node, 'result', undefined);
					}
				},
				{
					field: 'result',
					headerName: '考核结果',
					//单元格编辑器选择器（作用：根据实际情形返回单元格编辑器和单元格编辑器参数）
					cellEditorSelector: function (params) {
						return Switch(params.data.result_type, '==')
							//若【结果类型】=【1-等级】，【考核结果】下拉选择
							.case(1, {
								component: 'HcSelectCellEditor',
								params: $scope.gridOptions.context.result_levels
							})
							.result;
					},
					//值格式化器（作用：把实际值格式化为展示给用户看的值）
					valueFormatter: function (params) {
						var valueFormatted; //格式化后的值

						//若【结果类型】=【1-等级】
						if (params.data.result_type == 1) {
							//匹配词汇选项
							var index = params.context.result_levels.values.findIndex(function (value) {
								return value == params.value;
							});

							//若值匹配上词汇选项值，格式化为词汇选项名
							if (index >= 0) {
								valueFormatted = params.context.result_levels.names[index];
							}
							else {
								valueFormatted = '';
							}
						}
						else {
							valueFormatted = params.value;
						}

						return valueFormatted;
					},
					//值解析器（作用：把展示给用户看的值解析为实际值）
					valueParser: function (params) {
						var valueParsed; //解析后的值

						//若【结果类型】=【1-等级】
						if (params.data.result_type == 1) {
							//匹配词汇选项
							var index = params.context.result_levels.names.findIndex(function (name) {
								return name == params.newValue;
							});

							//若值匹配上词汇选项名，解析为词汇选项值
							if (index >= 0) {
								valueParsed = params.context.result_levels.values[index];
							}
							else {
								valueParsed = undefined;
							}
						}
						else {
							valueParsed = params.newValue;
						}

						return valueParsed;
					},
					//复制时，使用值格式化器
					hcUseFormatterWhenCopy: true
				}
			],
			rowData: [{}, {}, {}]
		};

		//==================== 图表 ====================
		/**
		 * 图表选项
		 */
		$scope.chartOption = {
			title: {
				text: '中国',
			},
			tooltip: {
				trigger: 'item',
				formatter: '{b}'
			},
			toolbox: {
				show: true,
				orient: 'vertical',
				left: 'right',
				top: 'center',
				feature: {
					dataView: { readOnly: false },
					restore: {},
					saveAsImage: {}
				}
			},
			visualMap: {
				min: 800,
				max: 50000,
				text: ['High', 'Low'],
				realtime: false,
				calculable: true,
				inRange: {
					color: ['lightskyblue', 'yellow', 'orangered']
				}
			},
			series: [
				{
					name: 'xx',
					type: 'map',
					mapType: '广东',
					data: [
						{ name: '广州', value: 5 },
						{ name: '深圳', value: 7 }
					]
				}
			]
		};

		/**
		 * 图表选项
		 */
		/* $scope.chartOption = {
			title: { //标题
				text: '饼图' //标题的内容
			},
			series: [ //系列
				{
					type: 'pie', //饼图
					data: [ //数据
						{ name: 'X', value: 30 },
						{ name: 'Y', value: 40 },
						{ name: 'Z', value: 50 }
					]
				}
			]
		}; */

		/**
		 * 图表就绪后的回调
		 */
		$scope.doWhenChartReady = function ($chart) {
			console.log('图表实例', $chart);

			return;

			//3秒后修改图表的类型和数据
			$timeout(function () {
				//直接给图表选项赋值可修改部分选项
				$scope.chartOption = {
					title: { //标题
						text: '柱状图' //标题的内容
					},
					xAxis: { //x轴
						type: 'category', //分类
						label: { //文本标签
							show: true //显示
						}
					},
					yAxis: { //y轴
						type: 'value' //值
					},
					series: [ //系列
						{
							type: 'bar', //柱状图
							label: { //文本标签
								show: true, //显示
								position: 'top' //显示位置
							},
							data: [ //数据
								{ name: '春', value: 10 },
								{ name: '夏', value: 20 },
								{ name: '秋', value: 30 },
								{ name: '冬', value: 40 }
							]
						}
					]
				};
			}, 3000);
		};

		//==================== 组织架构图 ====================

		/**
		 * 组织架构图选项
		 */
		$scope.orgChartOption = {
			nodeTemplate: function (data) {
				return '<div class="title">' + data.name + '</div><div class="content"><i class="iconfont hc-institute"></i>' + data.name + '</div>';
			},
			data: {
				name: '父组织',
				children: [
					{
						name: '子组织1'
					},
					{
						name: '子组织2'
					}
				]
			}
		};

		/**
		 * 组织架构图就绪后的回调
		 */
		$scope.doWhenOrgChartReady = function ($orgChart) {
			console.log('组织架构图实例', $orgChart);

			//3秒后修改组织架构图数据
			$timeout(function () {
				//直接给组织架构图选项赋值可修改部分选项
				$scope.orgChartOption = {
					data: {
						name: '父组织',
						children: [
							{
								name: '子组织1',
								children: [
									{
										name: '子组织1.1'
									},
									{
										name: '子组织1.2'
									}
								]
							},
							{
								name: '子组织2',
								children: [
									{
										name: '子组织2.1'
									},
									{
										name: '子组织2.2'
									}
								]
							}
						]
					}
				};
			}, 3000);
		};

		$scope.items = [
			1, 2, 3
		];

		$scope.sortableUpdate = function () {
			console.debug('sortableUpdate', $scope.items.join());
		};

		$scope.$on('hc-sortable:moved', function () {
			console.debug('hc-sortable:moved', $scope.items.join(), arguments);
		});

		$scope.showProjAttach = function () {
			if ($scope.projAttachVisible) return;

			requireApi.usePromiseToRequire('directive/hcProjAttach')
				.then(function () {
					$scope.projAttachVisible = true;
				});
		};

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: DemoDiyPage
	});
});