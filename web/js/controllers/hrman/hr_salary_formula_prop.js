/**
 * 薪资公式 - 属性页
 * @since 2019-05-17
 */
(function (defineFn) {
	define(['module', 'controllerApi', 'base_obj_prop', 'jquery', 'app', 'requestApi', 'promiseApi', 'swalApi'], defineFn);
})(function (module,   controllerApi,   base_obj_prop,   $,        app,   requestApi,   promiseApi,   swalApi) {

	app.directive('hrSalaryFormula', [function () {
		return {
			restrict: 'A',
			required: 'hcInput',
			link: function ($scope, $element, $attrs, inputController) {
				var $formula;

				promiseApi
					.whenTrue(function () {
						$formula = $element.find('textarea');

						return !!$formula.length;
					})
					.then(initFormula);

				function initFormula() {
					$scope.$parent.formula = $formula[0];

					$formula.on({
						'keypress': function (event) {
							if (allowedKeys.indexOf(event.key) < 0) {
								event.preventDefault();
							}
						},
						'input': function () {
							if (event.data) {
								event.target.value = event.target.value.substr(0, event.target.value.length - 1) + inputValue(event.data);
							}
						}
					});

					(function () {
						var inputEvents = $._data($formula[0], 'events').input;

						if (inputEvents.length > 1) {
							inputEvents.unshift(inputEvents.pop());
						}
					})();
				}

				var allowedKeys = [
					' ', ',',
					'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
					'.', '%',
					'+', '-', '*', '/',
					'(', ')',
					'<', '=', '>'
				];
			}
		};
	}]);

	function inputValue(value) {
		switch (value) {
			case ',':
				value += ' ';
				break;

			case '+':
			case '-':
			case '×':
			case '÷':
			case '<':
			case '≤':
			case '=':
			case '≠':
			case '≥':
			case '>':
			case '并且':
			case '或者':
				value = ' ' + value + ' ';
				break;

			case '*':
				value = ' × ';
				break;

			case '/':
				value = ' ÷ ';
				break;
		}

		return value;
	}

	/**
	 * 控制器
	 */
	HrSalaryFormulaProp.$inject = ['$scope', '$timeout'];
	function HrSalaryFormulaProp(   $scope,   $timeout) {

		//继承
		controllerApi.extend({
			controller: base_obj_prop.controller,
			scope: $scope
		});

		/**
		 * 聚焦公式
		 * 开始位置、结束位置都不传时，维持原来的位置
		 * 位置可以传数字，也可以传'start'、'end'，分别表示开始和结束位置
		 * @param {number|string} start 开始位置
		 * @param {number|string} end 结束位置，可不传，不传时，和开始位置一致
		 * @returns {Promise}
		 */
		function focusFormula() {
			var args = arguments;

			return $timeout(function () {
				_focusFormula.apply(null, args);
			});

			function _focusFormula(start, end) {
				if (start === 'start') {
					start = 0;
				}
				else if (start === 'end') {
					start = $scope.formula.value.length;
				}

				if (end === 'start') {
					end = 0;
				}
				else if (end === 'end') {
					end = $scope.formula.value.length;
				}

				if (arguments.length === 0) {
					start = $scope.formula.selectionStart;
					end = $scope.formula.selectionEnd;
				}
				else if (arguments.length === 1) {
					end = start;
				}

				$scope.formula.focus();

				$scope.formula.setSelectionRange(start, end);
			}
		}

		function insertIntoFormula(data) {
			if (!data) return $q.reject();

			var formula, start, end;

			$scope.$eval('data.currItem.salary_formula_desc = data.currItem.salary_formula_desc || ""');

			formula = $scope.data.currItem.salary_formula_desc;

			start = $scope.formula.selectionStart;
			end = $scope.formula.selectionEnd;

			formula = formula.substring(0, start) + data + formula.substring(end);

			$scope.data.currItem.salary_formula_desc = formula;

			return focusFormula(start + data.length);
		}

		$scope.tabs.base.hide = true;

		$scope.footerRightButtons.saveThenAdd.hide = true;

		/**
		 * 按钮
		 */
		$scope.buttons = {
			'n1': {
				groupId: 'number',
				title: '1'
			},
			'n2': {
				groupId: 'number',
				title: '2'
			},
			'n3': {
				groupId: 'number',
				title: '3'
			},
			'n4': {
				groupId: 'number',
				title: '4'
			},
			'n5': {
				groupId: 'number',
				title: '5'
			},
			'n6': {
				groupId: 'number',
				title: '6'
			},
			'n7': {
				groupId: 'number',
				title: '7'
			},
			'n8': {
				groupId: 'number',
				title: '8'
			},
			'n9': {
				groupId: 'number',
				title: '9'
			},
			'n0': {
				groupId: 'number',
				title: '0'
			},
			'n00': {
				groupId: 'number',
				title: '00'
			},
			'comma': {
				groupId: 'numericalSymbol',
				title: ','
			},
			'dot': {
				groupId: 'numericalSymbol',
				title: '.'
			},
			'percent': {
				groupId: 'numericalSymbol',
				title: '%'
			},
			'plus': {
				groupId: 'fourOperator',
				title: '+'
			},
			'minus': {
				groupId: 'fourOperator',
				title: '-'
			},
			'multiply': {
				groupId: 'fourOperator',
				title: '×'
			},
			'divide': {
				groupId: 'fourOperator',
				title: '÷'
			},
			'leftBracket': {
				groupId: 'bracket',
				title: '('
			},
			'rightBracket': {
				groupId: 'bracket',
				title: ')'
			},
			'less': {
				groupId: 'comparisonOperator',
				title: '<'
			},
			'lessOrEqual': {
				groupId: 'comparisonOperator',
				title: '≤'
			},
			'equal': {
				groupId: 'comparisonOperator',
				title: '='
			},
			'notEqual': {
				groupId: 'comparisonOperator',
				title: '≠'
			},
			'greaterOrEqual': {
				groupId: 'comparisonOperator',
				title: '≥'
			},
			'greater': {
				groupId: 'comparisonOperator',
				title: '>'
			},
			'and': {
				groupId: 'logicalOperator',
				title: '并且'
			},
			'or': {
				groupId: 'logicalOperator',
				title: '或者'
			},
			'clear': {
				title: '清空',
				click: function () {
					$scope.data.currItem.salary_formula_desc = '';

					$scope.onFormulaChange();

					focusFormula('start');
				},
				disabled: function () {
					return !$scope.data.currItem.salary_formula_desc;
				}
			},
			'check': {
				title: '校验',
				click: function () {
					requestApi
						.post({
							classId: 'hr_salary_item_set',
							action: 'checkformula',
							data: $scope.data.currItem,
							noShowError: true
						})
						.then(
							function () {
								$scope.formulaError = '';

								return swalApi.success('校验通过');
							},
							function (reason) {
								$scope.formulaError = reason;
								throw reason;
							}
						);
				},
				disabled: function () {
					return !$scope.data.currItem.salary_formula_desc;
				}
			}
		};

		angular.forEach($scope.buttons, function (button) {
			if (!button.click) {
				button.click = defaultButtonClick;
			}
		});

		function defaultButtonClick(params) {
			insertIntoFormula(inputValue(params.button.title));

			$scope.onFormulaChange();
		}

		/**
		 * 表格 - 薪资项目
		 */
		$scope.itemGridOptions = {
			columnDefs: [
				{
					type: '序号'
				},
				/* {
					field: 'salary_item_code',
					headerName: '薪资项目编码'
				}, */
				{
					field: 'salary_item_name',
					headerName: '薪资项目名称',
					width: 300
				},
				{
					headerName: '',
					suppressMenu: true, //禁用头部菜单
					width: 24,
					maxWidth: 24,
					cellRenderer: function (params) {
						return $('<div>', {
							'css': {
								'position': 'absolute',
								'top': '0',
								'left': '0',
								'height': '100%',
								'width': '100%',
								'display': 'flex',
								'justify-content': 'center',
								'align-items': 'center',
								'cursor': 'pointer'
							},
							'text': '+',
							'title': '插入薪资项目到公式',
							'on': {
								'click': function () {
									insertIntoFormula('[' + params.data.salary_item_name + ']');
								},
								'dblclick': function (event) {
									event.preventDefault();
								}
							}
						})[0];
					}
				}
			],
			hcEvents: {
				cellDoubleClicked: function (params) {
					insertIntoFormula('[' + params.data.salary_item_name + ']');
				}
			}
		};

		/**
		 * 表格 - 函数
		 */
		$scope.functionGridOptions = {
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'funchn',
					headerName: '函数名'
				},
				{
					field: 'funparament',
					headerName: '参数说明'
				},
				{
					headerName: '',
					suppressMenu: true, //禁用头部菜单
					width: 24,
					maxWidth: 24,
					cellRenderer: function (params) {
						return $('<div>', {
							'css': {
								'position': 'absolute',
								'top': '0',
								'left': '0',
								'height': '100%',
								'width': '100%',
								'display': 'flex',
								'justify-content': 'center',
								'align-items': 'center',
								'cursor': 'pointer'
							},
							'text': '+',
							'title': '插入函数到公式',
							'on': {
								'click': function () {
									insertIntoFormula(params.data.funchn + '()').then(function () {
										return focusFormula($scope.formula.selectionStart - 1);
									});
								},
								'dblclick': function (event) {
									event.preventDefault();
								}
							}
						})[0];
					}
				}
			],
			rowData: [
				{ funchn: 'FN_计税收入', funparament: '(应纳税所得额, 年月, 组织)' },
				{ funchn: 'FN_个人扣缴税金', funparament: '(计税收入, 年月)' },
				{ funchn: 'FN_个人扣缴社保', funparament: '(社保类型, 年月, 组织)' },
				{ funchn: 'FN_条件判断', funparament: '(条件等式, 满足值, 不满足值)' },
				{ funchn: 'FN_绝对值', funparament: '(数值或计算结果)' },
				{ funchn: 'FN_四舍五入', funparament: '(数值, 小数位数)' }
			],
			onGridReady: function (params) {
				params.hcApi.setFocusedCell();
				params.columnApi.autoSizeAllColumns();
			},
			hcEvents: {
				cellDoubleClicked: function (params) {
					insertIntoFormula(params.data.funchn + '()').then(function () {
						return focusFormula($scope.formula.selectionStart - 1);
					});
				}
			}
		};

		$scope.onFormulaChange = function () {
			$scope.formulaError = '';
		};

		/**
		 * 设置数据
		 */
		$scope.setBizData = function (bizData) {
			$scope.hcSuper.setBizData(bizData);

			focusFormula('end');

			return requestApi
				.post({
					classId: 'hr_salary_item_set',
					action: 'getsetsalary',
					data: {
						hr_salary_group_id: bizData.hr_salary_group_id
					}
				})
				.then(function (response) {
					var rowData = response.hr_salary_item_setofhr_salary_item_sets;

					rowData = rowData.filter(function (x) {
						return x.salary_item_code !== bizData.salary_item_code;
					});

					$scope.itemGridOptions.hcApi.setRowData(rowData);
				});
		};

		/**
		 * 保存请求前
		 * @override
		 */
		$scope.doBeforeSave = function (postParams) {
			postParams.action = 'updateformula';
			postParams.data = {
				hr_salary_item_setofhr_salary_item_sets: [postParams.data]
			};
		};

		/**
		 * 保存请求后
		 */
		$scope.doAfterSave = function (bizData) {
			$scope.data.currItem = bizData.hr_salary_item_setofhr_salary_item_sets[0];
		};

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: HrSalaryFormulaProp
	});
});