/**
 * AngularJS ng指令 的 hc版本
 * @since 2018-11-20
 */
define(['jquery', 'angular', 'app'], function ($, angular, app) {
	var directives = {
		'hcIf': ['$animate', function ($animate) {
			return {
				multiElement: true,
				transclude: 'element',
				priority: 600,
				terminal: true,
				restrict: 'A',
				$$tlb: true,
				link: function (scope, element, attr, ctrl, transclude) {
					var block, childScope, previousElements;
					scope.$watch(attr.hcIf, function hcIfWatchAction(value) {
						if (value) {
							if (!childScope) {
								transclude(scope, /* ng版是创建隔离作用域；hc版使用原作用域 */ function (clone, newScope) {
									childScope = newScope;
									clone[clone.length++] = document.createComment(' end hcIf: ' + attr.hcIf + ' ');
									// Note: We only need the first/last node of the cloned nodes.
									// However, we need to keep the reference to the jqlite wrapper as it might be changed later
									// by a directive with templateUrl when its template arrives.
									block = {
										clone: clone
									};

									var parentElement = element.parent();
									if (parentElement.is('[hc-tab-page]')) {
										clone.filter(':not(.tab-pane)').addClass('tab-pane');
									}
									$animate.enter(clone, parentElement, element);
								});
							}
						}
						else {
							if (previousElements) {
								previousElements.remove();
								previousElements = null;
							}
							
							if (block) {
								previousElements = angular.getBlockNodes(block.clone);

								if (childScope) {
									// childScope.$destroy(); /* ng版创建隔离作用域，所以需要销毁；hc版使用原作用域，不需要销毁 */
									destroyChildScope(previousElements, childScope);
									childScope = null;
								}

								$animate.leave(previousElements).then(function () {
									previousElements = null;
								});
								block = null;
							}
						}
					});
				}
			};
		}],

		'hcSwitch': ['$animate', function ($animate) {
			return {
				require: 'hcSwitch',
				// asks for $scope to fool the BC controller module
				controller: ['$scope', function hcSwitchController() {
					this.cases = {};
				}],
				link: function (scope, element, attr, hcSwitchController) {
					var watchExpr = attr.hcSwitch || attr.on,
						selectedTranscludes = [],
						selectedElements = [],
						previousLeaveAnimations = [],
						selectedScopes = [];

					var spliceFactory = function (array, index) {
						return function () { array.splice(index, 1); };
					};

					scope.$watch(watchExpr, function hcSwitchWatchAction(value) {
						var i, ii;
						for (i = 0, ii = previousLeaveAnimations.length; i < ii; ++i) {
							$animate.cancel(previousLeaveAnimations[i]);
						}
						previousLeaveAnimations.length = 0;

						for (i = 0, ii = selectedScopes.length; i < ii; ++i) {
							var selected = angular.getBlockNodes(selectedElements[i].clone);
							// selectedScopes[i].$destroy(); /* ng版创建隔离作用域，所以需要销毁；hc版使用原作用域，不需要销毁 */
							destroyChildScope(selected, selectedScopes[i]);
							var promise = previousLeaveAnimations[i] = $animate.leave(selected);
							promise.then(spliceFactory(previousLeaveAnimations, i));
						}

						selectedElements.length = 0;
						selectedScopes.length = 0;

						if ((selectedTranscludes = hcSwitchController.cases['!' + value] || hcSwitchController.cases['?'])) {
							angular.forEach(selectedTranscludes, function (selectedTransclude) {
								selectedTransclude.transclude(scope, /* ng版是创建隔离作用域；hc版使用原作用域 */ function (caseElement, selectedScope) {
									selectedScopes.push(selectedScope);
									var anchor = selectedTransclude.element;
									caseElement[caseElement.length++] = document.createComment(' end hcSwitchWhen: ');
									var block = { clone: caseElement };

									selectedElements.push(block);
									$animate.enter(caseElement, anchor.parent(), anchor);
								});
							});
						}
					});
				}
			};
		}],

		'hcSwitchWhen': function () {
			return {
				transclude: 'element',
				priority: 1200,
				require: '^hcSwitch',
				multiElement: true,
				link: function (scope, element, attrs, ctrl, transclude) {
					ctrl.cases['!' + attrs.hcSwitchWhen] = (ctrl.cases['!' + attrs.hcSwitchWhen] || []);
					ctrl.cases['!' + attrs.hcSwitchWhen].push({ transclude: transclude, element: element });
				}
			};
		},

		'hcSwitchDefault': function () {
			return {
				transclude: 'element',
				priority: 1200,
				require: '^hcSwitch',
				multiElement: true,
				link: function (scope, element, attr, ctrl, transclude) {
					ctrl.cases['?'] = (ctrl.cases['?'] || []);
					ctrl.cases['?'].push({ transclude: transclude, element: element });
				}
			};
		},

		'hcTransclude': function () {
			return {
				restrict: 'EAC',
				link: function (scope, element, attrs, controller, transclude) {
					if (!transclude) {
						/* ng版异常 */
						/* throw minErr('hcTransclude')('orphan',
							'Illegal use of hcTransclude directive in the template! ' +
							'No parent directive that requires a transclusion found. ' +
							'Element: {0}',
							startingTag($element)); */

						/* hc版不抛异常，直接忽略 */
						return;
					}

					var transcludeScope;
					switch (attrs.hcTransclude) {
						case 'parent': //父作用域
							transcludeScope = scope.$parent;
							break;

						case 'child': //子作用域
							transcludeScope = scope.$new();
							break;

						case 'isolate': //隔离作用域
							transcludeScope = scope.$new(true);
							break;

						default:
							transcludeScope = scope;
					}

					transclude(transcludeScope, /* ng版是创建隔离作用域；hc版使用原作用域 */ function (clone) {
						/* ng版把克隆元素作为原来的元素的子元素 */
						/* element.empty();
						element.append(clone); */

						/* hc版用克隆元素替换掉原来的元素 */
						element.replaceWith(clone);
					});
				}
			};
		},

		'hcInit': ['$q', function ($q) {
			return {
				multiElement: true,
				link: function ($scope, $element, $attrs) {
                    var promises = $element.find('[hc-grid]').map(function (index, element) {
                        return $q(function (resolve) {
                            $(element).on('gridReady', function (event, data) {
                                resolve(data.gridOptions);
                            });
                        });
                    });

                    if (promises.length) {
                        $q.all(promises).then(function () {
                            $scope.$eval($attrs.hcInit);
                        });
                    }
                    else {
                        $scope.$applyAsync($attrs.hcInit);
                    }
				}
			};
		}],

		'hcTooltip': ['$tooltip', function ($tooltip) {
			return $tooltip('hcTooltip', 'hcTooltip', 'mouseenter');
		}],

		'hcTooltipPopup': function () {
			return {
				replace: true,
				scope: {
					title: '@',
					content: '@',
					placement: '@',
					animation: '&',
					isOpen: '&',
					asHtml: '&'
				},
				templateUrl: 'views/directive/hcTooltipPopup.html'
			};
		},

		/* 'hcSaas': ['$q', function ($q) {
			return {
				scope: true,
				link: function ($scope, $element, $attrs) {
					if (window === top) {
						require(['requestApi'], function (requestApi) {
							requestApi
								.post({
									classId: 'scp_ent_config',
									action: 'select',
									data: {
										entid: userbean.entid
									},
									noShowWaiting: true
								})
								.then(function (entConfig) {
									$scope.entConfig = window.entConfig = entConfig;
								});

							requestApi
								.post({
									classId: 'scpuser',
									action: 'select',
									data: {
										userid: userbean.userid
									},
									noShowWaiting: true
								})
								.then(function (user) {
									$scope.user = window.user = user;

									if (!user.customer_id) {
										$scope.customer = window.customer = null;
										return $q.reject();
									}

									return requestApi.post({
										classId: 'customer',
										action: 'search',
										data: {
											flag: -1,
											customer_id: user.customer_id
										},
										noShowWaiting: true
									});
								})
								.then(function (response) {
									$scope.customer = window.customer = response.customers[0];
								});
						});
					}
					else {
						['entConfig', 'user', 'customer'].forEach(function (key) {
							$scope[key] = window[key] = top[key];
						});
					}
				}
			}
		}], */

		/**
		 * 模态框内容
		 */
		'modalContent': ['$timeout', '$injector', function ($timeout, $injector) {
			return {
				restrict: 'C',
				link: function ($scope, $element, $attrs) {
					$timeout(function () {
						//若模态框已使用 draggable-model 指令，不再处理
						//if ($element.is(':has([draggable-model])')) return;

						$element.draggable({
							//拖拽操作期间的 CSS 光标。
							//默认值：'auto'
							cursor: 'move',

							//鼠标按下后直到拖拽开始为止的时间，以毫秒计。
							//该选项可以防止点击在某个元素上时不必要的拖拽。
							//默认值：0
							delay: 100,

							//鼠标按下后拖拽开始前必须移动的距离，以像素计。
							//该选项可以防止点击在某个元素上时不必要的拖拽。
							//默认值：1
							distance: 2,

							//如果指定了该选项，则限制开始拖拽，除非鼠标在指定的元素上按下。
							//只有可拖拽（draggable）元素的后代元素才允许被拖拽。
							//默认值：false
							handle: '.modal-header'
						});

						if ($scope.$parent.fullScreen) {
							$element.draggable('disable');
						}

						$element.resizable({
							//resizable 允许被调整到的最小高度。
							//默认值：10
							minHeight: Math.min($element.height(), 400),

							//resizable 允许被调整到的最小宽度。
							//默认值：10
							minWidth: Math.min($element.width(), 800),

							//事件：当调整尺寸操作开始时触发。
							start: function (event, ui) {
								if ($element.is('.hc-resizable-resized')) return;

								//标记元素已调整过大小
								$element.addClass('hc-resizable-resized');

								//把模态框身体部分的高度变为动态
								$element.find('.modal-body').css('height', 'calc(100% - 96.2px)'); //96.2px .modal-header + .modal-footer 的高度

								$iframe = $element.find('iframe');
								//若有 iframe 元素，说明 模态框身体 就是 iframe
								if ($iframe.length) {
									var $hcAutoHeightController = $iframe.data('$hcAutoHeightController');

									if ($hcAutoHeightController) {
										//禁用自动高度
										$hcAutoHeightController.disabled = true;
									}

									$iframe.css('height', 'calc(100% - 48px)'); //48px .modal-header 的高度
								}
							}
						});

						if ($scope.$parent.fullScreen) {
							$element.resizable('disable');
						}
					}, 1000, false);

					//执行模态框初始化函数
					if ($element.is('body>.modal>.modal-dialog>.modal-content') && $scope.$parent.doInit) {
						$injector.invoke($scope.$parent.doInit, $scope.$parent, {
							$scope: $scope.$parent,
							$modalElement: $element.closest('.modal'),
							$modalDialogElement: $element.closest('.modal-dialog'),
							$modalContentElement: $element,
							$modalHeaderElement: $element.find('.modal-header'),
							$modalBodyElement: $element.find('.modal-body'),
							$modalFooterElement: $element.find('.modal-footer')
						});
					}
				}
			};
		}],

		/**
		 * 模态框头部
		 */
		'modalHeader': [function () {
			return {
				restrict: 'C',
				link: function ($scope, $element, $attrs) {
					var $maxButton = $element.find('.modmax');

					$element.on('dblclick', function (event) {
						if (!$(event.target).is('button,button *')) {
							$maxButton.click();
						}
					});
				}
			};
		}],

		/**
		 * 模态框身体
		 */
		'modalBody': [function () {
			return {
				restrict: 'C',
				link: function ($scope, $element, $attrs) {}
			};
		}],

		/**
		 * 模态框底部
		 */
		'modalFooter': [function () {
			return {
				restrict: 'C',
				link: function ($scope, $element, $attrs) {}
			};
		}],

		/**
		 * 模态框全屏按钮
		 */
		'modmax': [function () {
			return {
				restrict: 'C',
				link: function ($scope, $element, $attrs) {
					var $modal = $element.closest('.modal'),
						$modalScope,
						$modalContent = $element.closest('.modal-content'),
						$buttonIcon = $element.children('i'),
						fullScreen = false;

					if ($scope.hasOwnProperty('$close')) {
						$modalScope = $scope;
					}
					else {
						$modalScope = $scope.$parent;
					}

					$element.on('click', function (event) {
						var method;

						//禁用或启用【拖拽位置】和【调整大小】
						method = fullScreen ? 'enable' : 'disable';

						if ($modalContent.is('.ui-draggable')) {
							$modalContent.draggable(method);
						}

						if ($modalContent.is('.ui-resizable')) {
							$modalContent.resizable(method);
						}

						//添加或删除全屏样式
						method = fullScreen ? 'removeClass' : 'addClass';
						$modal[method]('hc-modal-max');

						//切换按钮图标
						$buttonIcon.removeClass(fullScreen ? 'hc-suoxiao' : 'hc-quanping');
						$buttonIcon.addClass(fullScreen ? 'hc-quanping' : 'hc-suoxiao');

						fullScreen = !fullScreen;
					});

					if ($modalScope.fullScreen) {
						$element.click();
					}

					Object.defineProperty($modalScope, 'fullScreen', {
						get: function () {
							return fullScreen;
						},
						set: function (value) {
							value = !!value;

							if (fullScreen === value) {
								return;
							}

							$element.click();
						}
					});
				}
			}
        }],
        
        'hcView': ['$state', '$q', '$controller', '$templateRequest', '$compile', '$resolve', function ($state, $q, $controller, $templateRequest, $compile, $resolve) {
            return function ($scope, $element, $attrs) {
                var destroyWatcher = $scope.$watch($attrs.hcState, function (state) {
                    if (!state) return;

                    destroyWatcher();

                    var tabRef = $scope.$eval($attrs.hcTabRef);

                    var params = $scope.$eval($attrs.hcParams);

                    params = (function (originaPparams) {
                        var params = {};

                        angular.forEach(originaPparams, function (value, key) {
                            if (value === undefined || value === null) {
                                return;
                            }

                            if (Array.isArray(value)) {
                                value = value.map(function (value) {
                                    return value + '';
                                });
                            }
                            else {
                                value += '';
                            }

                            params[key] = value;
                        });

                        return params;
                    })(params);

                    if (typeof state === 'string') {
                        state = $state.get(state);
                    }

                    $attrs.$set('hcStateName', state.name);

                    $attrs.$set('hcStateHref', $state.href(state, params));

                    var $viewScope = $scope.$new(true);

                    if (tabRef) {
                        Object.defineProperty($viewScope, 'titleConfig', {
                            value: Object.defineProperties({}, {
                                title: {
                                    get: function () {
                                        return tabRef.name;
                                    },
                                    set: function (title) {
                                        tabRef.name = title;
                                    }
                                },
                                originalTitle: {
                                    value: tabRef.originalName
                                }
                            })
                        });
                    }

                    $resolve
                        .resolve(state.resolve, {
                            $scope: $viewScope,
                            $stateParams: params
                        })
                        .then(resolveTemplate)
                        .then(afterResolve);

                    function resolveTemplate(resolve) {
                        if (state.templateUrl) {
                            return $templateRequest(state.templateUrl).then(afterGetTemplate);
                        }

                        return afterGetTemplate(state.template);

                        function afterGetTemplate(template) {
                            resolve.template = template;
                            return resolve;
                        }
                    }

                    function afterResolve(resolve) {
                        angular.extend(resolve.$scope, {
                            $state: {
                                name: state.name,
                                params: params,
                                element: $element,
                                template: resolve.template,
                                objConf: resolve.objConf
                            }
                        });

                        resolve.$scope.controller = state.controller ? $controller(state.controller, resolve) : null;

                        $compile($(resolve.template).appendTo($element.empty()))(resolve.$scope);
                    }
                });
            };
        }],

        template: function () {
            return {
                restrict: 'E',
                priority: 2000,
                terminal: true,
                link: function ($scope, $element, $attrs) {
                    $element.remove();
                }
            };
        },

        slot: function () {
            return {
                restrict: 'E',
                priority: 2000,
                terminal: true,
                link: function ($scope, $element, $attrs) {
                    $element.remove();
                }
            };
        }

	};

	/**
	 * 销毁指定元素中，指定父作用域的子作用域
	 * @param {HTMLElement} $elements 元素
	 * @param {Scope} $parentScope 父作用域
	 */
	function destroyChildScope($elements, $parentScope) {
		var scopesToDestroy = {};

		$($elements)
			//找到所有带作用域标识的子元素
			.find('.ng-scope,.ng-isolate-scope')
			//加上原本的那批元素
			.addBack()
			//寻找指定父作用域的子作用域
			.each(function () {
				var $element = $(this),
					$scope = $element.scope(),
					needDestroy = $scope.$parent === $parentScope;

				if (needDestroy) {
					scopesToDestroy[$scope.$id] = $scope;
				}
			});

		angular.forEach(scopesToDestroy, function ($scope) {
			$scope.$destroy();
		});
	};

	app.directive(directives);

	return directives;
});