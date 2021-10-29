/**
 * 进度条
 * @since 2018-12-11
 */
define(['module', 'directiveApi', 'constant', 'numberApi', 'Decimal'], function (module, directiveApi, constant, numberApi, Decimal) {

	/**
	 * 进度条指令
	 * @since 2018-12-11
	 */
	function hcProgressDirective() {
		return {
			scope: {},
			templateUrl: directiveApi.getTemplateUrl(module),
			controller: HcProgressController
		};
	}

	/**
	 * 进度条控制器
	 * @since 2018-12-11
	 */
	HcProgressController.$inject = ['$scope', '$element', '$attrs'];
	function HcProgressController(   $scope,   $element,   $attrs) {
		constant.defineConstProp($scope, 'data', constant.getConstClone({
			min: 0
		}));

		var ZERO = Decimal('0'),
			HUNDRED = Decimal('100');

		(function (data) {
			Object.defineProperties($scope.data, {
				value: {
					get: function () {
						return data.value;
					},
					set: function (value) {
						value = numberApi.toNumber(value);

						if (data.value === value) return;

						if (value < 0)
							throw new Error('进度值必须 ≥ 0，不能赋值为' + value);

						data.value = value;
						data.calPercent();
					}
				},
				max: {
					get: function () {
						return data.max;
					},
					set: function (max) {
						max = numberApi.toNumber(max);

						if (data.max === max) return;

						if (max < 0)
							throw new Error('最大进度值必须 ≥ 0，不能赋值为' + max);

						data.max = max;
						data.calPercent();
					}
				},
				percent: {
					get: function () {
						return data.percent;
					},
					set: function () {
						throw new Error('不能直接修改进度百分比，请修改 value 和 max，percent 会自动赋值');
					}
				},
				exactPercent: {
					get: function () {
						return data.exactPercent;
					}
				},
				percentAsStr: {
					get: function () {
						return data.percentAsStr;
					}
                },
                width: {
                    get: function () {
                        return data.width;
                    }
                }
			});
		})({
			value: 0,
			max: 0,
			percent: 0,
			exactPercent: ZERO,
            percentAsStr: '0.00',
            width: '0%',
			calPercent: function calPercent() {
				if (this.value === 0 || this.max === 0) {
					this.exactPercent = ZERO;
					this.percent = 0;
                    this.percentAsStr = '0.00';
                    this.width = '0%';
				}
				else {
					this.exactPercent = HUNDRED.mul(this.value).div(this.max);
					this.percent = +this.exactPercent;
                    this.percentAsStr = this.exactPercent.toFixed(2);
                    this.width = (this.percent < 100 ? this.percent : 100) + '%';
				}

				return this.percent;
			}
		});

        var progressName = $attrs.name || 'progress';

        var progress = $scope.$parent[progressName];

        if (progress) {
            if (progress.value >= 0 && progress.max >= 0 && progress.value <= progress.max) {
                $scope.data.max = progress.max;
                $scope.data.value = progress.value;
            }
        }

		constant.defineConstProp($scope.$parent, progressName, $scope.data);
	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcProgressDirective
	});
});