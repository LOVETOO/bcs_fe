/**
 * 杜邦分析图
 * @since 2019-04-24
 */
(function (defineFn) {
	define(['module', 'controllerApi','cssApi', 'directive/hcButtons', 'directive/hcChart'], defineFn);
})(function (module,   controllerApi,  cssApi) {
	cssApi.loadCss('css/tree.css');

	/**
	 * 控制器
	 */
	DupontAnalysisChart.$inject = ['$scope'];
	function DupontAnalysisChart(   $scope) {

		$scope.data = {
			currItem: {
				year: new Date().getFullYear()
			}
		};
		/**
		 * 工具栏按钮
		 */
		$scope.toolButtons = {
			export: {
				title: '导出',
				icon: 'iconfont hc-daochu'
			},
			search: {
				title: '查询',
				icon: 'iconfont hc-search'
			}
		};

		$scope.profitChartOption = {
			tooltip: {
				formatter: "{a} <br/>{b} : {c}%"
			},
			grid:{
                x:10,
                y:10,
                x2:10,
                y2:10,
            },
			 series: [
				{
					name: '净利润',
					type: 'gauge',
					min:0,
					max:2000,
					detail: { 
		                formatter:'{value}万',
		                fontSize:16,
		                color:'#333',
		                fontWeight:'400',
		                offsetCenter: [0, 65],
		                textShadowColor:'#ccc',
		                textShadowBlur:2,
		                textShadowOffsetX:2,
		                textShadowOffsetY:2,
	                 },
					data: [{ 
						value: 1760, //默认值
					}],
            		radius: '94%',
            		splitNumber:5,
            		pointer: { 
		                width:3,//指针宽度
		                length:'55%',//指针长度
		            },
					axisLine: {
			            lineStyle: {
			                width: 30,
			                // 仪表盘透明度设置为0
			                opacity: 1,
			                //环形区域颜色,默认影响指针颜色
			                color: [
			                  [0.2, '#12c7a8'],
			                  [0.8, '#00a1f9'],
			                  [1, '#fc773e ']
			                ]
			            }
					},

				}
			]
		};

		$scope.incomeChartOption = {
			tooltip: {
				formatter: "{a} <br/>{b} : {c}%"
			},
			grid:{
                x:10,
                y:10,
                x2:10,
                y2:10,
            },
			 series: [
				{
					name: '净利润',
					type: 'gauge',
					min:0,
					max:10000,
					detail: { 
		                formatter:'{value}万',
		                fontSize:16,
		                color:'#333',
		                fontWeight:'400',
		                offsetCenter: [0, 65],
		                textShadowColor:'#ccc',
		                textShadowBlur:2,
		                textShadowOffsetX:2,
		                textShadowOffsetY:2,
	                 },
					data: [{ 
						value: 8096, //默认值
					}],
            		// center: ['40%', '40%'],//图形占比位置
            		width:'90%',
            		radius: '94%',
		            pointer: { 
		                width:3,//指针宽度
		                length:'55%',//指针长度
		            },
            		splitNumber:5,//区间数
		           
					axisLine: {
			            lineStyle: {
			                width: 30,
			                // 仪表盘透明度设置为0
			                opacity: 1,
			                //环形区域颜色,默认影响指针颜色
			                color: [
			                  [0.2, '#fbb93f  '],
			                  [0.8, '#00a1f9'],
			                  [1, '#fc773e']
			                ]
			            }
					},

		            axisLabel: { // 坐标轴数字
		                distance:5,//环形-数字间距
                        textStyle: {       // 属性lineStyle控制线条样式
                        	fontSize:'10',
                            fontWeight: '300',
                            color: '#333',
                            shadowColor : '#ccc', //默认透明
                            shadowBlur: 20,
                        },
                        formatter: function (value) {
                            return parseInt(value);//坐标轴数字变整数
                        }

                    }
				}
			]
		};
	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: DupontAnalysisChart
	});
});