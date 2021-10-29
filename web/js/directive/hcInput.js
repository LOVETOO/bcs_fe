/**
 * 输入组件
 * @since 2018-10-02
 */
(function (defineFn) {
	define(['module', 'directiveApi', 'requestApi', 'jquery', 'angular', 'numberApi', 'angularApi', 'strApi', 'dateApi', 'openBizObj','directive/hcAutoWidth'], defineFn);
})(function (module, directiveApi, requestApi, $, angular, numberApi, angularApi, strApi, dateApi, openBizObj) {

    directiveApi.directiveAll({
        'hcActualInput': ['$timeout', function ($timeout) {
            return {
                require: ['^hcInput', 'ngModel'],
                link: function ($scope, $element, $attrs, controllers) {
                    var inputController = controllers[0];	//输入组件控制器
                    var modelController = controllers[1];	//模型控制器

                    //互相关联
                    inputController.setModelController(modelController);

                    modelController.getInputController = function () {
                        return inputController;
                    };

                    /**
                     * 返回实际的 input 元素
                     */
                    inputController.getActualInputElement = function () {
                        return $element;
                    };

                    /**
                     * 获取焦点
                     */
                    inputController.focus = function () {
                        $timeout(100).then(function () {
                            $element.focus();
                        });
                    };
                }
            };
        }],
        'hcPlaceholder': [function () {
            return {
                link: function ($scope, $element, $attrs) {
                    //若没使用 hc-input 指令，退出
                    if ($attrs.hcInput) return;

                    //监视指令指定的表达式，动态设置 placeholder
                    $scope.$watch($attrs.hcPlaceholder, function (newValue, oldValue) {
                        $element.attr('placeholder', newValue);
                    });
                }
            };
        }],
        'hcRequired': ['$parse', function ($parse) {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function ($scope, $element, $attr, modelController) {
                    if (!modelController) return;

                    //必填验证器名称
                    var validatorName = 'required';

                    //必填验证器
                    function requiredValidator(modelValue, viewValue) {
                        return !modelController.$isEmpty(viewValue);
                    }

                    //根据表达式动态切换验证器和结果
                    $scope.$watch($attr.hcRequired, function (newValue) {
                        //若表达式成立，说明需要验证
                        if (newValue) {
                            //若验证器还未加入
                            if (!(validatorName in modelController.$validators)) {
                                //加入验证器
                                modelController.$validators[validatorName] = requiredValidator;
                                //执行验证
								//modelController.$validate();
								modelController.$$runValidators(modelController.$$rawModelValue, modelController.$$lastCommittedViewValue, angular.noop);
                            }
                        }
                        //否则不需要验证
                        else {
                            //若验证器已加入
                            if (validatorName in modelController.$validators) {
                                //删除验证器
                                delete modelController.$validators[validatorName];
                                //标记验证通过
                                modelController.$setValidity(validatorName, true);
                            }
                        }
                    });
                }
            };
        }],
        'hcModelNumber': [function () {
            return {
                require: ['ngModel', 'hcModelNumber'],
                controller: [function HcModelNumberController() {
                    var modelNumberController = this,
                        modelIsMoney = false, //模型是【金额】吗？
                        modelUnitIsWan = false, //模型的单位是【万元】吗？
                        modelUnitIsPercent = false, //模型的单位是【百分比】吗？
                        wan = 1e4,//万
                        hundred = 1e2;//百

                    modelNumberController.enableMoneyFeature = function () {
                        modelIsMoney = true;
                    };

                    modelNumberController.enableUnitWanFeature = function () {
                        modelUnitIsWan = true;
                    };

                    modelNumberController.enableUnitPercentFeature = function () {
                        modelUnitIsPercent = true;
                    };

                    modelNumberController.getParsers = function () {
                        return [
                            function toNumber(value) {
                                return numberApi.toNumber(value);
                            },
                            //解析为【元】
                            function asYun(value) {
                                return modelUnitIsWan ? value * wan : value;
                            },
                            //解析为百分比
                            function asPercent(value) {
                                if (value && parseFloat(value) != 0)
                                    return modelUnitIsPercent ? value / hundred : value;
                                return value;
                            }
                        ];
                    };

                    modelNumberController.getFormatters = function () {
                        return [
                            function toMoney(value) {
                                return (modelIsMoney && !modelUnitIsWan) ? numberApi.toMoney(value) : value;
                            },
                            //格式化为【万元】
                            function asWanYun(value) {
                                return modelUnitIsWan ? value / wan : value;
                            },
                            //格式化为【百分比】
                            function asPercent(value) {
                                if (value === undefined || value === null) {
                                    return;
                                }
                                return modelUnitIsPercent ? parseFloat(value * hundred).toFixed(2) : value;
                            }
                        ];
                    };
                }],
                link: function ($scope, $element, $attrs, controllers) {
                    var modelController = controllers[0];
                    var modelNumberController = controllers[1];

                    if ($scope.$eval($attrs.hcModelNumber)) {
                        Array.prototype.push.apply(modelController.$parsers, modelNumberController.getParsers());
						Array.prototype.push.apply(modelController.$formatters, modelNumberController.getFormatters());
						
						renderAgain(modelController);
                    }
                }
            };
        }],
        'hcModelMoney': [function () {
            return {
                require: 'hcModelNumber',
                link: function ($scope, $element, $attrs, modelNumberController) {
                    if ($scope.$eval($attrs.hcModelMoney)) {
                        modelNumberController.enableMoneyFeature();
                    }
                }
            };
        }],
        'hcModelUnit': [function () {
            return {
                require: 'hcModelNumber',
                link: function ($scope, $element, $attrs, modelNumberController) {
                    if ($scope.unit === '万元') {
                        modelNumberController.enableMoneyFeature();
                        modelNumberController.enableUnitWanFeature();
                    }
                    if ($scope.unit === '%') {
                        // modelNumberController.enableMoneyFeature();
                        modelNumberController.enableUnitPercentFeature();
                    }
                }
            };
        }],
		'hcModelDate': [function () {
            return {
				priority: 2,
                require: 'ngModel',
                link: function ($scope, $element, $attrs, modelController) {
                    //加载 datetimepicker 后
                    require(['datetimepicker.zh-CN'], function () {
                        //增加截掉时分秒的格式化器
                        modelController.$formatters.push(function (value) {
                            if (typeof value === 'string' && value.length > 10) {
								value = value.substr(0, 10);
							}
								
							return value;
						});
						
						renderAgain(modelController);

						var $container = $element.parent();
						
						var $hcInput = $element.closest('[hc-input]');
						var options = $scope.$eval($hcInput.attr('hc-date-options'));

						options = angular.extend({
							format: 'yyyy-mm-dd',	//格式化
							autoclose: true,		//自动关闭
							minView: 'month',		//最小视图：月
							todayBtn: true,			//显示【今天】按钮
							todayHighlight: true,	//高亮今天
							language: 'zh-CN',		//语言：简体中文
							container: $container	//容器
						}, options);

						if (options.startDate === 'today') {
							options.startDate = dateApi.today();
						}

						if (options.endDate === 'today') {
							options.endDate = dateApi.today();
						}

						$element.datetimepicker(options);

                        $scope.btnClick = function () {
                            toggleDateTimePicker($element);
                        };
                    });
                }
            };
        }],
        'hcModelTime': [function () {
            return {
                require: 'ngModel',
                link: function ($scope, $element, $attrs, modelController) {
                    //加载 datetimepicker 后
                    require(['datetimepicker.zh-CN'], function () {
                        var $container = $element.parent();

                        $element.datetimepicker({
                            format: 'yyyy-mm-dd hh:ii:ss',	//格式化
                            autoclose: true,				//自动关闭
                            todayBtn: true,					//显示【今天】按钮
                            todayHighlight: true,			//高亮今天
                            language: 'zh-CN',				//语言：简体中文
                            container: $container			//容器
                        });

                        $scope.btnClick = function () {
                            toggleDateTimePicker($element);
                        };
                    });
                }
            };
        }],
        'hcModelYearMonth': [function () {

            return {
                require: 'ngModel',
                link: function ($scope, $element, $attrs, modelController) {
                    //加载 datetimepicker 后
                    require(['datetimepicker.zh-CN'], function () {
                        var $container = $element.parent();

                        $element.datetimepicker({
                            format: 'yyyy-mm',		//格式化
                            autoclose: true,		//自动关闭
                            startView: 'year',		//开始视图：年
                            minView: 'year',		//最小视图：年
                            todayBtn: true,			//显示【今天】按钮
                            todayHighlight: true,	//高亮今天
                            language: 'zh-CN',		//语言：简体中文
                            container: $container	//容器
                        });

                        $scope.btnClick = function () {
                            toggleDateTimePicker($element);
                        };
                    });
                }
            };
        }],
        'hcModelMonth': [function () {
            return {
                require: 'ngModel',
                link: function ($scope, $element, $attrs, modelController) {
                    //加载 datetimepicker 后
                    require(['datetimepicker.zh-CN'], function () {
                        var $container = $element.parent();

                        $element.datetimepicker({
                            format: 'm',			//格式化
                            autoclose: true,		//自动关闭
                            startView: 'year',		//开始视图：年
                            minView: 'year',		//最小视图：年
                            maxView: 'year',		//最大视图：年
                            todayBtn: true,			//显示【今天】按钮
                            todayHighlight: true,	//高亮今天
                            language: 'zh-CN',		//语言：简体中文
                            container: $container	//容器
                        });

                        //隐藏面板上面的切换视图的工具栏
                        $container
                            .find('.datetimepicker>.datetimepicker-months>table').css('width', '100%')
                            .children('thead').css('display', 'none');

                        $scope.btnClick = function () {
                            toggleDateTimePicker($element);
                        };
                    });
                }
            };
        }],
        'hcModelYear': [function () {
            return {
                require: 'ngModel',
                link: function ($scope, $element, $attrs, modelController) {
                    //加载 datetimepicker 后
                    require(['datetimepicker.zh-CN'], function () {
                        var $container = $element.parent();

                        $element.datetimepicker({
                            format: 'yyyy',			//格式化
                            autoclose: true,		//自动关闭
                            startView: 'decade',	//开始视图：十年
                            minView: 'decade',		//最小视图：十年
                            maxView: 'decade',		//最大视图：十年
                            todayBtn: true,			//显示【今天】按钮
                            todayHighlight: true,	//高亮今天
                            language: 'zh-CN',		//语言：简体中文
                            container: $container	//容器
                        });

                        $scope.btnClick = function () {
                            toggleDateTimePicker($element);
                        };
                    });
                }
            };
        }],
        'hcModelSelect': [function () {
            return {
                require: ['^hcInput', 'ngModel'],
                link: function ($scope, $element, $attrs, controllers) {
                    var inputController = controllers[0];	//输入组件控制器
                    var modelController = controllers[1];	//模型控制器

                    //var selectOptions = inputController.getSelectOptions();

					modelController.$formatters.push(function (modelValue) {
						var selectOption = $scope.selectOptions && $scope.selectOptions.find(function (selectOption) {
							return selectOption.value == modelValue;
						});

						return selectOption ? selectOption.name : '';
					});

					modelController.$parsers.push(function (viewValue) {
						var selectOption = $scope.selectOptions && $scope.selectOptions.find(function (selectOption) {
							return selectOption.name == viewValue;
						});

						return selectOption ? selectOption.value : '';
					});

					renderAgain(modelController);
                }
            };
        }],
        'hcModelCheckbox': [function () {
            return {
                require: 'ngModel',
                link: function ($scope, $element, $attrs, modelController) {
                    /* var modelValue = modelController.getModel();
                    if (angular.isUndefined(modelValue)) {
                        modelController.setModel(1); //默认值为1
                    } */
                }
            };
		}],
        'hcFormReadonly': [function () {
            var DisableEditingControl = false;

            var sysParamReady = requestApi.getSysParam('DisableEditingControl').then(function (sysParam) {
                DisableEditingControl = sysParam.param_value === 'true';
            });

            return {
                require: '?form',
                link: function ($scope, $element, $attrs, formController) {
					if (!formController) {
						return;
                    }

                    sysParamReady.then(function () {
                        if (DisableEditingControl) {
                            Object.defineProperty(formController, 'editing', {
                                get: function () {
                                    return true;
                                },
                                set: function () { }
                            });
                        }
                        else {
                            formController.editing = $attrs.hcFormEditing === 'true';
                        }

                        formController.isReadonly = function () {
                            return !formController.editing || $scope.$eval($attrs.hcFormReadonly);
                        };
                    });
                }
            };
        }]
	});
	
	/**
	 * 模型控制器重新渲染
	 * @param {NgModelController} modelController 模型控制器
	 */
	function renderAgain(modelController) {
		if (!modelController) {
			return;
		}

		modelController.$modelValue = NaN;
		modelController.$viewValue = NaN;
		modelController.$$rawModelValue = undefined;
		modelController.$$lastCommittedViewValue = undefined;

		modelController.$scope.$parent.$evalAsync();
	}

	function toggleDateTimePicker($element) {
		$element = $($element);

		if ($element.data('datetimepicker').isVisible) {
			return;
		}

		setTimeout(function () {
			$element.datetimepicker('show');
		});
	}

    /**
     * 指令
     */
    hcInputDirective.$inject = ['$parse'];

    function hcInputDirective($parse) {
        return {
            restrict: 'A',
            require: 'hcInput',
            templateUrl: directiveApi.getTemplateUrl(module),
            scope: {
                // model: '=hcInput',
                label: '@hcLabel',
                btnClick: '&hcBtnClick',
                btnTitle: '@hcBtnTitle',
                btnIcon: '@hcBtnIcon',
                placeholder: '@hcPlaceholder',
                ngChange: '&hcChange',
                ngFocus: '&hcFocus',
                ngBlur: '&hcBlur',
                ngRequired: '&hcRequired',
                ngReadonly: '&hcReadonly',
                selectOptions: '=hcSelectOptions',
                selectFilter: '&hcSelectFilter',
                canInput: '&hcCanInput',
                beforeDelete: '&hcBeforeDelete',
                afterDelete: '&hcAfterDelete',
                style: '@hcStyle',
                cantClean: '@hcCantClean'
            },
            controller: HcInputController,
            /**
             * 编译函数
             */
            compile: function hcInputCompile(tElement, tAttrs) {
                if (tAttrs.ngIf)
                    throw new Error('请勿在 hc-input 上使用 ng-if，请改为 hc-if');

                tElement.addClass('input-inline flex-row');

                var inputs = tElement.find('[ng-model]');

                inputs.attr('spellcheck', 'false');		//禁用拼写检查
                inputs.attr('autocomplete', 'off');		//禁用自动完成

                //设置模型表达式和名称
                inputs.attr('ng-model', '$parent.' + tAttrs.hcInput/*.replace(/(?<=\[)(.+?)(?=\])/g, '$parent.$1')*/);
                inputs.attr('name', (function () {
                    var name;

                    var modelExp = tAttrs.hcInput;

                    var lastIndexOfDot = modelExp.lastIndexOf('.');

                    if (lastIndexOfDot === -1)
                        name = modelExp;
                    else
                        name = modelExp.substr(lastIndexOfDot + 1);

                    return name;
                })());

                /**
                 * 处理 hc-true-value 和 hc-false-value
                 */
                (function () {
                    if (tAttrs.hcType !== 'checkbox') return;

                    (function () {
                        var getTrueValue, trueValue, hcTrueValue;

                        if (tAttrs.hcTrueValue) {
                            getTrueValue = $parse(tAttrs.hcTrueValue);

                            if (!getTrueValue.constant)
                                throw new Error('hc-true-value的表达式必须为常量表达式');

                            trueValue = getTrueValue();

                            switch (typeof trueValue) {
                                case "boolean":
                                    if (trueValue === false)
                                        throw new Error('不能指定 hc-true-value="false" ');

                                    hcTrueValue = 'true';

                                    break;

                                case "number":
                                    hcTrueValue = trueValue + '';

                                    break;

                                case "string":
                                    hcTrueValue = "'" + trueValue + "'";

                                    break;

                                default:
                                    throw new Error('hc-true-value 指定的值不合法：', trueValue);
                            }

                            inputs.filter('[ng-true-value]').attr('ng-true-value', hcTrueValue);
                        }
                    })();

                    (function () {
                        var getFalseValue, falseValue, hcFalseValue;

                        if (tAttrs.hcFalseValue) {
                            getFalseValue = $parse(tAttrs.hcFalseValue);

                            if (!getFalseValue.constant)
                                throw new Error('hc-false-value的表达式必须为常量表达式');

                            falseValue = getFalseValue();

                            switch (typeof falseValue) {
                                case "boolean":
                                    if (falseValue === true)
                                        throw new Error('不能指定 hc-false-value="true" ');

                                    hcFalseValue = 'false';

                                    break;

                                case "number":
                                    hcFalseValue = falseValue + '';

                                    break;

                                case "string":
                                    hcFalseValue = "'" + falseValue + "'";

                                    break;

                                default:
                                    throw new Error('hc-false-value 指定的值不合法：', falseValue);
                            }

                            inputs.filter('[ng-false-value]').attr('ng-false-value', hcFalseValue);
                        }
                    })();
                })();

                //若列数设为 *，代表输入组件独占一行
                if (tAttrs.hcColCount === '*') {
                    tElement.find('.input-group').css('width', '100%');
                }

                return hcInputLink;
            }
        }
    }

    /**
     * 控制器
     */
	HcInputController.$inject = ['$scope', '$element', '$attrs', '$parse', '$q', '$timeout', '$modal'];
    function HcInputController(   $scope,   $element,   $attrs,   $parse,   $q,   $timeout,   $modal) {
        var inputController = this;		//输入组件控制器
        var modelController;			//模型控制器
        var $parent = $scope.$parent;
        var $eval = $scope.$eval.bind($scope);
        var modelShortName = $attrs.hcInput.substr($attrs.hcInput.lastIndexOf('.') + 1);

        $parent.inputControllers = $parent.inputControllers || {};
		$parent.inputControllers[$attrs.hcInput] = inputController;

		(function () {
			[
				'label',
				'btnTitle',
				'btnIcon',
				'placeholder',
				'style',
				'cantClean'
			].forEach(function (key) {
				$scope[key] = $scope[key] || '';
			});
		})();

		(function () {
			var privateData = {
				clickRunning: false
			};

			Object.defineProperties($scope, {
				clickRunning: {
					get: function () {
						return privateData.clickRunning;
					},
					set: function (value) {
						value = !!value;

						if (privateData.clickRunning === value) {
							return;
						}

						privateData.clickRunning = value;

						var $button = $element.find('.input-group-btn > button:not(.hc-input-del-btn)');

						if ($button.length) {
							var $buttonIcon = $button.children('i'),
								$buttonTitle = $button.children('span');

							$buttonIcon.removeAttr('class');

							if (privateData.clickRunning) {
								$button.attr('disabled', 'disabled');
								$buttonTitle.addClass('ng-hide');
								$buttonIcon.addClass('fa fa-spinner fa-pulse');
							}
							else {
								$buttonIcon.addClass($scope.btnIcon);
								$buttonTitle.removeClass('ng-hide');
								$button.removeAttr('disabled');
							}
						}
					}
				}
			});
		})();

        /**
         * 返回模型控制器
         * @return {ModelController}
         * @since 2018-11-21
         */
        inputController.getModelController = function () {
            return modelController;
        };

        /**
         * 设置模型控制器
         * @param {ModelController} modelControllerToSet 模型控制器
         * @since 2018-11-21
         */
        inputController.setModelController = function (modelControllerToSet) {
            if (modelController === modelControllerToSet)
                return;

            if (modelController)
                throw new Error('与输入组件关联的模型控制器必须唯一');

            modelController = modelControllerToSet;

            $scope.modelController = modelController;
        };

        /**
         * 返回文本标签内容
         * @return {string}
         * @since 2018-11-22
         */
        inputController.getLabel = function () {
            return $scope.label;
        };

        /**
         * 返回下拉选项
         * @return {{ name: string, value: number|string }[]}
         * @since 2018-11-27
         */
        /* inputController.getSelectOptions = function () {
            return $scope.selectOptions;
		}; */

		/**
		 * 触发按钮点击事件
		 * @since 2019-08-21
		 */
		inputController.btnClick = function () {
			return $scope.btnClick();
		};

        $scope.data = {};
        $scope.type = $attrs.hcType || 'text';
        $scope.hasBtnClick = !!$attrs.hcBtnClick;

        if (!$scope.btnIcon)
            $scope.btnTitle = $scope.btnTitle || '···';

        if (typeof $attrs.hcCommonSearch === 'string') {
            $scope.hasBtnClick = true;

            $scope.btnClick = function () {
                var commonSearchSetting = $parent.$eval($attrs.hcCommonSearch) || {};

                return $q
                    .when()
                    .then(commonSearchSetting.beforeOpen)
                    .then(function (canOpen) {
                        if (canOpen === false)
                            return $q.reject('阻止打开通用查询');
                    })
                    .then(function () {
                        commonSearchSetting.classId = commonSearchSetting.classId || $attrs.hcClassId;
                        return $modal.openCommonSearch(commonSearchSetting).result;
                    });
            }
        }

        if ($scope.type === 'password') {
            $scope.btnClick = function () {
                $scope.passwordVisible = !$scope.passwordVisible;
                inputController.getActualInputElement().attr('type', $scope.passwordVisible ? 'text' : 'password');
            }
        }

        //针对按钮点击事件做脏值检查
        if ($scope.hasBtnClick) {
            $scope.btnClick = (function (btnClick) {
                return function () {
                    if (modelController.$dirty)
                        return btnClick.apply($scope, arguments);

                    var oldValue = getValue(); //原值

                    //执行点击事件
                    var result = btnClick.apply($scope, arguments);

                    //异步脏值检查
                    if (result && result.then) {
                        result.finally(dirtyCheck);
                    }
                    //同步脏值检查
                    else {
                        dirtyCheck();
                    }

                    return result;

                    /**
                     * 返回模型值
                     */
                    function getValue() {
                        return $parent.$eval($attrs.hcInput);
                    }

                    /**
                     * 脏值检查
                     */
                    function dirtyCheck() {
                        var newValue = getValue();

                        if (!angular.equals(newValue, oldValue))
                            modelController.$setDirty();
                    }
                };
            })($scope.btnClick);
		}

        //点击保护，避免多次点击影响
        if ($scope.hasBtnClick) {
            $scope.btnClick = (function (btnClick) {
                return function () {
					if ($scope.clickRunning) return;
					
					if ($scope.ngReadonly()) {
						return;
					}

                    $scope.clickRunning = true;

                    var _this = this,
                        _arguments = arguments;

                    return $q
                        .when()
                        .then(function () {
                            return btnClick.apply(_this, _arguments);
                        })
                        .then(function () {
                            $scope.clickRunning = false;
                        }, function () {
                            $scope.clickRunning = false;
                        });
                };
            })($scope.btnClick);
		}
		
		$scope.dropdown = function () {
			if ($scope.ngReadonly()) {
				return;
			}

			var $button = $element.find('button.dropdown-toggle');
			if ($button.attr('aria-expanded') !== 'true') {
				setTimeout(function () {
					$button.dropdown('toggle');
				});
			}
		};

		$scope.showDate = function ($event) {
			if ($scope.ngReadonly()) {
				return;
			}

			toggleDateTimePicker($event.target);
		};

        (function () {
            var lastDotIndex = $attrs.hcInput.lastIndexOf('.'), //最后一个点号的位置
                prefixWithObj = lastDotIndex >= 0 ? $attrs.hcInput.substring(0, lastDotIndex + 1) : '', //表达式对象前缀
                deleteKeys = strApi.commonSplit($attrs.hcDeleteTogether).map(function (key) {
                    return prefixWithObj + key;
                }); //一起删除的字段

            var isId = $attrs.hcInput.endsWith('id'),
                isCode = $attrs.hcInput.endsWith('code'),
                isName = $attrs.hcInput.endsWith('name');

            //若模型是ID、编码、名称之一，同时清除关联的值
            if (isId || isCode || isName) {
                var len = $attrs.hcInput.length - (isId ? 2 : 4),
                    prefix = $attrs.hcInput.substr(0, len);

                deleteKeys.unshift(
                    prefix + 'id',
                    prefix + 'code',
                    prefix + 'name'
                );
            }

            deleteKeys.unshift($attrs.hcInput);

            //去重
            (function (t) {
                t = deleteKeys;
                deleteKeys = {};
                t.forEach(function (key) {
                    deleteKeys[key] = true;
                });
            })();

            /**
             * 删除按钮点击事件
             */
            $scope.deleteClick = function () {
                $scope.focused = false; //失去焦点的状态延迟到这里执行

                $q
                    .when()
                    .then($scope.beforeDelete)
                    .then(function (allowed) {
                        if (allowed === false) return $q.reject('不允许删除');

                        angular.forEach(deleteKeys, function (value, key) {
                            var inputControllerToDeleteValue;
                            if ($parent.inputControllers && (inputControllerToDeleteValue = $parent.inputControllers[key])) {
                                inputControllerToDeleteValue.getActualInputElement().val('');
                                inputControllerToDeleteValue.getModelController().$setViewValue('');
                            }
                            else
                                $parse(key).assign($parent, '');
                        });
                    })
                    .then($scope.afterDelete);
            };
        })();

        if ($scope.type === 'checkbox') {
            $scope.trueValue = $attrs.hcTrueValue ? $scope.$eval($attrs.hcTrueValue) : 2;
            $scope.falseValue = $attrs.hcFalseValue ? $scope.$eval($attrs.hcFalseValue) : 1;
            (function () {
                var modelExp = $parse($attrs.hcInput);

                if (modelExp($parent) === undefined)
                    modelExp.assign($parent, $scope.falseValue);
            })();
        }

        $scope.dictCode = $attrs.hcDictCode;
        $scope.unit = $attrs.hcUnit;
        if (!$scope.unit) {
            switch ($scope.type) {
                case 'money':
                    $scope.unit = '元';
                    break;

                case 'volume':
                    $scope.unit = 'm³';
					break;
					
				case 'square':
					$scope.unit = 'm²';
					break;

                case 'percent':
                    $scope.unit = '%';
                    break;

                default:
                    break;
            }
        }

        //$scope.selectOptions = $scope.getSelectOptions();

        //若指定了【词汇编码】
        if ($attrs.hcSelectOptions || $scope.dictCode) {
            //【类型】改为【下拉】
			$scope.type = 'select';
			$attrs.$set('hcType', 'select');

            $scope.selectClick = function (selectOption) {
                inputController.getActualInputElement().val(selectOption.name);
                modelController.$setViewValue(selectOption.name);
            };

            //绑定显示值的模型
            if ($attrs.hcSelectName) {
                (function () {
                    var syncName = $parse($attrs.hcSelectName).assign.bind(null, $parent);

                    $parent.$watch($attrs.hcInput, sync);

                    $scope.$watchCollection('selectOptions', sync);

                    function sync() {
                        var value = $parent.$eval($attrs.hcInput);
                        var selectOption;

                        if ($scope.selectOptions && $scope.selectOptions.length) {
                            selectOption = $scope.selectOptions.find(function (selectOption) {
                                return selectOption.value == value;
                            });
                        }

                        syncName((selectOption && selectOption.name) || '');
                    }
                })();
            }

            var applyFn = function () {
				renderAgain(modelController);
            };

			if ($scope.dictCode === 'yesno') {
				$scope.selectOptions = [
					{
						name: '是',
						value: 2
					},
					{
						name: '否',
						value: 1
					}
				];

				applyFn();
			}
			else if ($scope.dictCode === 'noyes') {
				$scope.selectOptions = [
					{
						name: '是',
						value: 1
					},
					{
						name: '否',
						value: 2
					}
				];

				applyFn();
			}
			else if ($scope.dictCode) {
				//请求词汇
				requestApi
					.getDict($scope.dictCode)
					.then(function (dicts) {
						$scope.selectOptions = dicts.map(function (dict) {
							return {
								name: dict.dictname,
								value: dict.dictvalue,
								disabled: dict.usable != 2
							};
						});
						
						applyFn();
					});
			}
			else if (angular.isArray($scope.selectOptions)) {
				applyFn();
			}
			
			if ($attrs.hcSelectOptions) {
				$scope.$watchCollection('selectOptions', function () {
					applyFn();
				});
			}
        }

        //没有定义下拉过滤器时，默认不过滤
        if (!$attrs.hcSelectFilter) {
            $scope.selectFilter = function alwaysReturnTrue() {
                return true;
			};
		}

		(function (selectFilter) {
			$scope.selectFilter = function (params) {
				return !params.option.disabled && selectFilter(params);
			};
		})($scope.selectFilter);

		/**
		 * 点击星标时
		 */
		$scope.starClick = function (value) {
			if ($scope.ngReadonly()) return;

			modelController.$setViewValue(value);
		};

		/**
		 * 点击爱心时
		 */
		$scope.heartClick = function (value) {
			if ($scope.ngReadonly()) return;

			modelController.$setViewValue(value);
		};

        $scope.ngClass = (function () {
            var classObj = {};

            // if ($attrs.hcColCount === '*') {
            // }
            // else {
            //     //组件所占列数
            //     var colCount = ($attrs.hcColCount || 2) - 0;

            //     if ($scope.type !== 'checkbox') {
            //         //输入框所占列数 = 组件所占列数 - 文本标签所在列数(有标签占1列，无占0列)
            //         colCount = colCount - ($scope.label ? 1 : 0);
            //     }

            //     for (var i = 1; i <= 8; i++) {
            //         classObj['hc-w' + i] = colCount === i;
            //     }
            // }

            classObj.unit = !!$scope.unit;

            return function () {
                //验证通过
                classObj['hc-valid'] = $eval('modelController.$valid');
                //验证不通过
                classObj['hc-invalid'] = $eval('modelController.$invalid');
                //必填项
				classObj['hc-required'] = $eval('ngRequired()');
                //只读项
                classObj['hc-readonly'] = $eval('ngReadonly()');
                //可编辑项
                classObj['hc-editable'] = !classObj['hc-readonly'];
                //修改过的
                classObj['hc-dirty'] = $eval('modelController.$dirty');
                //未修改过的
				classObj['hc-pristine'] = $eval('modelController.$pristine');
				//有点击按钮
				classObj['hc-has-btn-click'] = $scope.hasBtnClick;
				//可输入
				classObj['hc-can-input'] = $scope.canInput();

                return classObj;
            };
        })();

        $scope.ngStyle = (function () {
            var styleObj = {};

            if (
                false
                || $scope.type === 'number'
                || $scope.type === 'money'
                || $scope.unit
            )
                styleObj['text-align'] = 'right';

            var needPaddingRight = $scope.hasBtnClick
                || ['select', 'date', 'time', 'month', 'year', 'year-month', 'password'].indexOf($scope.type) >= 0
                || $scope.unit;

            var setPaddingRightMission;

            return function () {
                if (needPaddingRight && inputController.getActualInputElement && !setPaddingRightMission) {
                    setPaddingRightMission = $timeout(100, false);
                    setPaddingRightMission.then(function () {
                        var inputGroupBtn = inputController.getActualInputElement().siblings('.input-group-btn');
                        var inputGroupAddon = inputController.getActualInputElement().siblings('.input-group-addon');
                        var paddingRight = numberApi.sum(inputGroupBtn.outerWidth(), inputGroupAddon.outerWidth());

                        inputController.getActualInputElement().css('padding-right', paddingRight + 'px');
                        setPaddingRightMission = null;
                    });
                }

                return styleObj;
            };
		})();

        /**
         * 获得焦点事件
         */
        $scope.ngFocus = (function (ngFocus) {
            return function ($event) {
				$scope.focused = true;

				(function () {
					var $deleteButton = $element.find('.hc-input-del-btn');

					if (!$deleteButton.length) {
						return;
					}

					var $input = $element.find('input');

					if ($input.val()) {
						if ($scope.$eval($attrs.hcCanDelete)) {
							$deleteButton.removeClass('ng-hide');
						}
					}
					else {
						$deleteButton.addClass('ng-hide');
					}
				})();

                if (ngFocus) {
                    return ngFocus({
                        $event: $event
                    });
                }
            };
        })($scope.ngFocus);

        /**
         * 失去焦点事件
         */
        $scope.ngBlur = (function (ngBlur) {
            return function ($event) {
                //若是点击删除按钮【×】导致失去焦点的，延迟失去焦点的状态直到点击删除按钮【×】时。
                //否则会导致删除按钮【×】先隐藏了而点击不到
                /* if (!$($event.relatedTarget).is('.hc-input-del-btn')) {
                    $scope.focused = false;
				} */
				
				$scope.focused = false;

                setTimeout(function () {
					var $deleteButton = $element.find('.hc-input-del-btn');

					if (!$deleteButton.length) {
						return;
					}

					$deleteButton.addClass('ng-hide');
				}, 300);

                if (ngBlur) {
                    return ngBlur({
                        $event: $event
                    });
                }
            };
        })($scope.ngBlur);

        /**
         * 通过事件判断是否是【有效地】敲击回车
         * @param {Event} $event 事件
         */
        function isPressEnterEffectively($event) {
            return $event.key === 'Enter'
                && !$event.target.readOnly
                && !$event.ctrlKey
                && !$event.shiftKey
                && !$event.altKey;
        }

        //当有按钮点击事件时
        if ($scope.hasBtnClick) {
            $scope.ngKeydown = function ($event) {
                //敲击回车键触发按钮点击事件
                if (isPressEnterEffectively($event)) {
                    $scope.btnClick();
                }
            };
        }

        //若自定义了敲击回车事件
        if ($attrs.hcPressEnter) {
            if ($scope.type === 'textarea') {
                console.error('类型为 textarea 的输入组件不能定义 敲击回车事件', $attrs.hcInput);
            }
            else {
                $scope.ngKeydown = function ($event) {
                    if (isPressEnterEffectively($event)) {
                        $parent.$eval($attrs.hcPressEnter);
                    }
                };
            }
		}
		
		if ($attrs.hcReadonlyPrivate !== 'true') {
			/**
			 * 只读判断
			 */
			$scope.ngReadonly = (function (ngReadonly) {
				return function () {
					//若组件本身应该是只读的
					var result = ngReadonly.apply($scope, arguments);
					if (result) {
                        return true;
                    }

                    var formController = modelController && modelController.getFormController && modelController.getFormController();
                    //若有表单控制器
                    if (formController) {
                        //表单控制器设置了只读条件，且未处于编辑状态，组件只读
                        if (formController.isReadonly && !formController.editing) {
                            return true;
                        }
                    }

					//若有只读规则
					var readonlyRules = $parent.$eval('data.objConf.readonlyRules') || [];

					var myReadonlyRules = readonlyRules.filter(function (rule) {
						return rule.fields.indexOf(modelShortName) >= 0;
					});

					//若有属于这个字段的只读规则
                    if (myReadonlyRules.length) {
                        var editable = false, readonly = false;

                        myReadonlyRules.forEach(function (rule) {
                            if (rule.readonly == 1) {
                                editable = true;
                            }
                            else if (rule.readonly == 2) {
                                readonly = true;
                            }
                        });

                        //若有矛盾的规则，保险起见，设为只读
                        if (editable && readonly) {
                            return true;
                        }

                        //有可编辑的规则
                        if (editable) {
                            return false;
                        }

                        //有只读的规则
                        if (readonly) {
                            return true;
                        }
                    }

					//若表单是只读的，则组件必定是只读的，反之不一定成立
                    if (formController && formController.isReadonly) {
                        return formController.isReadonly();
					}

					return false;
				};
			})($scope.ngReadonly);
		}

        //若有隐藏规则
        if ($parent.$eval('data.objConf.hideRules.length')) {
            if (!$parent._isHideFieldByObjConf)
                $parent._isHideFieldByObjConf = function (modelShortName) {
                    var hideRules = $parent.$eval('data.objConf.hideRules') || [],
                        myHideRules = hideRules.filter(function (rule) {
                            return rule.fields.indexOf(modelShortName) >= 0;
                        });

                    return !!myHideRules.length;
                };

            //若已有显隐指令，合并条件
            if ($attrs.ngShow || $attrs.ngHide || $attrs.hcIf) {
                if ($attrs.ngShow) {
                    $attrs.$set('ngShow', $attrs.ngShow + " && !_isHideFieldByObjConf('" + modelShortName + "')", false);
                }
                else if ($attrs.ngHide) {
                    $attrs.$set('ngHide', $attrs.ngHide + " || _isHideFieldByObjConf('" + modelShortName + "')", false);
                }
                else if ($attrs.hcIf) {
                    $attrs.$set('hcIf', $attrs.hcIf + " && !_isHideFieldByObjConf('" + modelShortName + "')", false);
                }
            }
            //否则直接使用隐藏class
            else {
                ['$animate', function ($animate) {
                    $parent.$watch("_isHideFieldByObjConf('" + modelShortName + "')", function (value) {
                        $animate[value ? 'addClass' : 'removeClass']($element, 'ng-hide', {
                            tempClasses: 'ng-hide-animate'
                        });
                    });
                }].callByAngular();
            }
		}
		
		/**
		 * 显示帮助
		 */
		$scope.showHelp = function () {
			var tooltip = $parent.data.objConf.$objFields[modelController.$name].tooltip;

			$modal.open({
				template: '<div hc-box>' + tooltip + '</div>',
				controller: ['$scope', function ($scope) {
					$scope.title = '帮助';

					$scope.doInit = ['$modalContentElement', function ($modalContentElement) {
						var h;

						for (var i = 1; i <= 6; i++) {
							h = $modalContentElement.find('h1');

							if (!h.length) continue;

							$scope.title = h.text();
						}
					}];
				}],
				size: 'max'
			});
		};

		/**
		 * 双击事件
		 */
		$scope.ngDblclick = function ($event) {
			if (!$attrs.hcOpenState) {
				return;
			}

			var openParams = $scope.$parent.$eval($attrs.hcOpenState);

			if (!openParams || !openParams.name) {
				return;
			}

			if (openParams.params && 'id' in openParams.params) {
				if (!+openParams.params.id) {
					return;
				}
			}

			return openBizObj({
				stateName: openParams.name,
				params: openParams.params
			}).result;
		};
    }

    /**
     * 连接函数
     */
    function hcInputLink($scope, $element, $attrs, inputController) {
		setTimeout(function () {
			['hc-input-height', 'hc-input-width'].forEach(function (attrName) {
				var attrValue = $attrs[$.camelCase(attrName)];

				if (!attrValue) return;

				var cssName = attrName.substr(9);

				inputController.getActualInputElement().css(cssName, attrValue);
			});
		}, 100);

        if ($scope.type === 'checkbox') {
            if (!$element.prev().length) {
                var parent = $element.parent();

                if (parent.hasClass('row'))
                    parent.addClass('checkbox-list');
            }
        }

        if ($scope.$parent.$eval($attrs.hcAutofocus)) {
            ['$interval', function ($interval) {
                var promise = $interval(function () {
                    if (inputController.getActualInputElement) {
                        $interval.cancel(promise);
                        inputController.getActualInputElement().focus();
                    }
                }, 100);
            }].callByAngular();
        }
        // if ($scope.type !== 'checkbox') {
            //组件所占列数
            var colCount = (+$attrs.hcColCount || 2) / 2;

            $element.addClass('hc-w' + colCount);
		// }

		//若是大文本
		if ($scope.type === 'textarea') {
			(function () {
                setTimeout(function() {
                    $element.addClass("textarea-inline");
                    //大文本框
                    var $textarea = $element.find('textarea');
                    var $label = $element.find('label');
                        // $textarea.css('text-indent',$label.outerWidth(true) + 'px');

                    //渲染完成后判断内容是否超出1行
                    if($attrs.hcRow){
                        var height = ($attrs.hcRow * 22) + 'px';
                        $textarea.css("min-height",height);
						if ($attrs.hcRow > 1) {
							$textarea.addClass("solidborder");
						}
                    }else{
                        $scope.$parent.$watch($attrs.hcInput, function (text) {
                            if (text) {
                                setTimeout(function() {
                                    var texth = $textarea[0].scrollHeight;
                                    var h = $textarea[0].clientHeight;
                                    if(texth > h){
                                        //超出1行把高度设置为48
                                        $textarea.css("min-height","48px");
                                        $textarea.addClass("solidborder");
                                    }
                                }, 30);
                            }
                        });
                    }
                    //滚动时隐藏浮动label
                    // $textarea.on('scroll', function(){
                    //     var st = $textarea.scrollTop();
                    //       if(st > 0){
                    //         $label.hide();
                    //       }
                    //       else{
                    //         $label.show();
                    //       }
                    // });
                }, 30);
			})();
		}

        // inputController.applyAutoWidth = function () {
        //     //自动宽度
        //     setTimeout(function(){
        //         // var parentW = $element.parent().parent().width();
        //         var bigbox = $element.width();
        //         var siblingbox = $element.children("label").outerWidth(true)||0;
        //         var textbox = $element.find(".hc-input,.hc-textarea");
        //         // $element.parent().width(parentW);
        //         // textbox.width(bigbox - siblingbox);
        //         textbox.parent().css("width","calc(100% - "+ siblingbox + "px");
        //         // $element.find(".hc-input,.hc-textarea").css("width","calc(100% - "+ siblingbox + "px");

        //     }, 500);
        // };

        // inputController.applyAutoWidth();
        // $(window).resize(inputController.applyAutoWidth);

    }

    //使用Api注册指令
    //需传入require模块和指令定义
    return directiveApi.directive({
        module: module,
        directive: hcInputDirective
    });
});