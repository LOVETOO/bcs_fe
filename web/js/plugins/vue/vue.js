/**
 * Vue
 * @since 2019-12-04
 */
define(['plugins/vue/2.6.10/dist/vue' + (isDebug ? '' : '.min'), 'jquery', 'requestApi'], function (Vue, $, requestApi) {
    ['$rootScope', '$parse', function ($rootScope, $parse) {
        Vue.applyAngular = applyAngular;

        Vue.bindProxy = bindProxy;

        Vue.prototype.$bindAnuglarProps = function $bindAnuglarProps(props, proxy) {
            var map = {},
                $scope = this.$options.$scope,
                $attrs = this.$options.$attrs;

            props.forEach(function (prop) {
                if (!prop) {
                    return;
                }

                var propName,                           //属性名
                    propType,                           //属性类型
                    defaultValue,                       //默认值
                    hasDefaultValue = false,            //是否具有默认值
                    exp,                                //表达式
                    propUsed;                           //属性是否被使用了

                Switch(typeof prop)
                    .case('string', function () {
                        propName = prop;
                    })
                    .case('object', function () {
                        propName = prop.name;
                        propType = prop.type;
                        defaultValue = prop.default;
                        hasDefaultValue = 'default' in prop;
                    });

                //属性是否被使用了
                propUsed = propName in $attrs;

                //表达式
                exp = $attrs[propName];

                //若没有表达式
                if (!exp) {
                    //若有默认值
                    if (hasDefaultValue) {
                        exp = JSON.stringify(defaultValue);
                    }
                    //若属性类型为【布尔】，且没配置默认值，则以属性是否被使用了为准
                    else if (propType === Boolean) {
                        exp = propUsed.toString();
                    }
                }

                map[propName] = exp;
            });

            return bindProxy($scope, map, proxy);
        };

        Vue.angularMixin = {
            data: function () {
                var $attrs, data;

                $attrs = this.$options.$attrs;

                data = {};

                if (this.$options.angularProps && this.$options.angularProps.length) {
                    this.$bindAnuglarProps(this.$options.angularProps, data);
                }

                data.formDisabled = false;

                if (this.$options.angularTextProps && this.$options.angularTextProps.length) {
                    this.$options.angularTextProps.forEach(function (prop) {
                        var propName,                           //属性名
                            propType,                           //属性类型
                            defaultValue,                       //默认值
                            hasDefaultValue = false,            //是否具有默认值
                            text,                               //文本值
                            propUsed;                           //属性是否被使用了

                        Switch(typeof prop)
                            .case('string', function () {
                                propName = prop;
                            })
                            .case('object', function () {
                                propName = prop.name;
                                propType = prop.type;
                                defaultValue = prop.default;
                                hasDefaultValue = 'default' in prop;
                            });

                        //属性是否被使用了
                        propUsed = propName in $attrs;

                        //文本值
                        text = $attrs[propName];

                        //若没有文本值
                        if (!text) {
                            //若有默认值
                            if (hasDefaultValue) {
                                text = defaultValue + '';
                            }
                        }

                        data[propName] = text;
                    });
                }

                if (this.$options.angularData) {
                    this.$options.angularData.call(this, data);
                }

                return data;
            },
            computed: {
                actualDisabled: function () {
                    return this.disabled || this.formDisabled;
                }
            },
            methods: {
                $injectForm: function (formCtrl) {
                    if (!formCtrl) {
                        return this;
                    }

                    var self = this;

                    self.form = formCtrl;

                    var $scope = self.$options.$scope;

                    $scope.$watch(self.form.$name + '.isReadonly && !' + self.form.$name + '.editing || ' + self.form.$name + '.isReadonly()', function (formDisabled) {
                        self.formDisabled = formDisabled;
                    });

                    return self;
                }
                /* isFormDisabled: function () {
                    var $scope = this.$options.$scope;

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
                    var readonlyRules = $scope.$eval('data.objConf.readonlyRules') || [];

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

                    return this;
                } */
            },
            beforeCreate: function () {
                var self = this,
                    angularEvents = self.$options.angularEvents,
                    $scope = self.$options.$scope,
                    $attrs = self.$options.$attrs,
                    methods = self.$options.methods;

                $scope.$on('$destroy', function () {
                    self.$destroy();
                });

                if (angularEvents && angularEvents.length) {
                    angularEvents.forEach(function (eventName) {
                        methods[eventName] = function ($event) {
                            var result = $scope.$eval($attrs[eventName], {
                                $event: $event
                            });

                            if (typeof result === 'function') {
                                result = result.apply($scope, arguments);
                            }

                            $scope.$evalAsync();

                            return result;
                        };
                    });
                }
            },
            mounted: function () {
                if (this.$options.$element) {
                    this.$options.$element.html($(this.$el).children());
                    this.$options.$element.data('$vue', this);
                }
                else {
                    $(this.$el).data('$vue', this);
                }

                if (this.$options.$form) {
                    this.$injectForm(this.$options.$form);
                }
            }
        };

        Vue.component('DictText', {
            template: '<span>{{ dictName }}</span>',
            props: {
                dictCode: {
                    type: String,
                    required: true
                },
                dictValue: {
                    type: [String, Number],
                    required: true
                }
            },
            data: function () {
                return {
                    dictItems: []
                };
            },
            computed: {
                dictName: function () {
                    if (!this.dictItems || !this.dictItems.length) {
                        return '';
                    }

                    var dictItem = this.dictItems.find(function (dictItem) {
                        return dictItem.dictValue == this.dictValue;
                    }, this);

                    return dictItem ? dictItem.dictName : '';
                }
            },
            watch: {
                dictCode: {
                    immediate: true,
                    handler: function(dictCode) {
                        var vm = this;
                        requestApi
                            .getDict(dictCode)
                            .then(function (dictItems) {
                                vm.dictItems = dictItems.map(function (dictItem) {
                                    return {
                                        dictValue: dictItem.dictvalue,
                                        dictName: dictItem.dictname
                                    };
                                });
                            });
                    }
                }
            }
        });

        function bindProxy(src, map, proxy) {
            if (!proxy) {
                proxy = {};
            }

            var srcIsScope = isScope(src);

            angular.forEach(map, function (exp, key) {
                if (!exp) {
                    proxy[key] = undefined;
                    return;
                }

                var getter, setter, get, set, value, angularToVue = false;

                getter = $parse(exp);
                setter = getter.assign;
                value = getter(src);

                if (srcIsScope) {
                    src.$watch(exp, function (newValue) {
                        if (isSameValue(value, newValue)) {
                            return;
                        }

                        //若新值跟缓存值不一致，说明是 angular 引发的改动，通知 vue
                        angularToVue = true;
                        proxy[key] = newValue;
                    });
                }

                get = function () {
                    return value;
                };

                if (setter) {
                    set = function (newValue) {
                        if (!angularToVue) {
                            setter(src, newValue);
                        }

                        value = newValue;

                        //若源对象是作用域
                        if (srcIsScope) {
                            //若是 angular 引发的改动，无需处理
                            if (angularToVue) {
                                angularToVue = false;
                            }
                            //若是 vue 引发的改动，通知 angular
                            else {
                                applyAngular(src);
                            }
                        }
                    };
                }
                else {
                    set = function (newValue) {
                        value = newValue;
                    };
                }

                Object.defineProperty(proxy, key, {
                    configurable: true,
                    enumerable: true,
                    get: get,
                    set: set
                });
            });

            return proxy;
        }

        /**
         * 使 Angular 响应
         * @param {Scope} $scope
         */
        function applyAngular($scope, exp, locals) {
            if (!$scope) {
                return;
            }

            $scope.$evalAsync(exp, locals);
        }

        /**
         * 判断是否是作用域
         * @param {*} value
         * @returns {boolean}
         */
        function isScope(value) {
            return !!value && value.$root === $rootScope;
        }

        /**
         * 判断是否同一个值
         * @param {*} value1
         * @param {*} value2
         * @returns {boolean}
         */
        function isSameValue(value1, value2) {
            return value1 === value2 || (isNaN(value1) && isNaN(value2));
        }

        /**
         * 判断是否是`NaN`
         * @param {*} value
         * @returns {boolean}
         */
        function isNaN(value) {
            return value !== value;
        }
    }].callByAngular();

    return Vue;
});