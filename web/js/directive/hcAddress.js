/**
 * 地址选择器
 * @since 2019-12-29
 */
define(['module', 'directiveApi', 'text!/web/views/directive/hcAddress.html', 'requestApi', 'angular', 'vue', 'element-ui'], function (module, directiveApi, template, requestApi, angular, Vue) {

    var AddressSelector = Vue.extend({
        mixins: [Vue.angularMixin],
        template: template,
        angularTextProps: [
            'label',                //标签
            {
                name: 'separator',  //分隔符
                default: '/'
            }
        ],
        angularProps: [
            'idPath',                   //全路径ID
            'namePath',                 //全路径名称
            'provinceId',               //省ID
            'provinceName',             //省名称
            'cityId',                   //市ID
            'cityName',                 //市名称
            'countyId',                 //县ID
            'countyName',               //县名称
            'address',                  //详细地址
            {
                name: 'disabled',       //禁用
                type: Boolean
            },
            {
                name: 'required',
                type: Boolean
            },
            {
                name: 'hcRequired',
                type: Boolean
            },
            {
                name: 'hcRequire',
                type: Boolean
            }
        ],
        angularEvents: [
            'onAreaChange',             //区域改变事件
            'onAddressChange',          //地址改变事件
            'onChange',                 //改变事件
            'onBtnClick'                //按钮点击事件
        ],
        angularData: function (data) {
            var $attrs = this.$options.$attrs;

            angular.extend(data, {
                hasButton: 'onBtnClick' in $attrs,
                needAdress: 'address' in $attrs,
                areas: areas,
                props: {
                    /* lazy: true, //是否动态加载子节点，需与 lazyLoad 方法结合使用，默认值：false
                    lazyLoad: function (node, resolve) { //加载动态数据的方法，仅在 lazy 为 true 时有效
                        var superId = node.root ? 0 : node.value;

                        getArea(superId).then(function (areas) {
                            if (node.level >= 2) {
                                areas.forEach(function (area) {
                                    area.leaf = true;
                                });
                            }

                            resolve(areas);
                        });
                    }, */
                    value: 'areaid', //指定选项的值为选项对象的某个属性值，默认值：'value'
                    label: 'areaname', //指定选项标签为选项对象的某个属性值，默认值：'label'
                    children: 'scpareas', //指定选项的子选项为选项对象的某个属性值，默认值：'children'
                    disabled: '' //指定选项的禁用为选项对象的某个属性值，默认值：'disabled'
                }
            });

            data._areaNames = '';
        },
        computed: {
            actualRequired: function () {
                return this[this._prop_name_required];
            },
            presentText: {
                get: function () {
                    var presentText;
                    if (this.$refs.cascader) {
                        presentText = this.$refs.cascader.presentText;
                    }
                    presentText = presentText || '';
                    return presentText;
                },
                set: function (presentText) {
                    if (this.$refs.cascader) {
                        this.$refs.cascader.presentText = presentText;
                    }
                    else {
                        console.warn('地址选择器内部的级联选择器尚未初始化，赋值 presentText 暂时没有效果');
                    }
                }
            },
            areaIds: {
                get: function () {
                    return [(this.provinceId || '') + '', (this.cityId || '') + '', (this.countyId || '') + ''];
                },
                set: function (areaIds) {
                    this.provinceId = areaIds[0];
                    this.cityId = areaIds[1];
                    this.countyId = areaIds[2];
                }
            },
            areaNames: {
                get: function () {
                    var areaNames = [this.provinceName, this.cityName, this.countyName]
                        .filter(function (name) {
                            return !!name;
                        })
                        .join(this.separator);

                    if (areaNames) {
                        this.namePath = areaNames;
                    }

                    setTimeout(function () {
                        this.presentText = this.namePath;
                    }.bind(this), 300);

                    return areaNames;
                },
                set: function () {
                }
            }
        },
        methods: {
            handleAreaChange: function ($event) {
                this.$nextTick(function () {
                    var nodes = this.$refs.cascader.getCheckedNodes();
                    var node;

                    if (nodes.length && (node = nodes[0])) {
                        //省
                        var provinceNode = node.pathNodes[0];
                        this.provinceId = provinceNode.value;
                        this.provinceName = provinceNode.label;

                        //市
                        var cityNode = node.pathNodes[1];
                        this.cityId = cityNode.value;
                        this.cityName = cityNode.label;

                        //县
                        var countyNode = node.pathNodes[2];
                        this.countyId = countyNode.value;
                        this.countyName = countyNode.label;

                        //全路径
                        this.idPath = node.path.join(this.separator);
                        this.namePath = node.pathLabels.join(this.separator);
                    }
                    else {
                        [
                            'provinceId',       //省ID
                            'provinceName',     //省名称
                            'cityId',           //市ID
                            'cityName',         //市名称
                            'countyId',         //县ID
                            'countyName',       //县名称
                            'idPath',           //全路径ID
                            'namePath'          //全路径名称
                        ].forEach(function (propName) {
                            this[propName] = '';
                        }, this);
                    }

                    this.onChange($event);
                    this.onAreaChange($event);
                });
            },
            handleAddressChange: function ($event) {
                this.onChange($event);
                this.onAddressChange($event);
            }
        },
        beforeCreate: function () {
            var $attrs = this.$options.$attrs;

            if ('hcRequire' in $attrs) {
                console.warn('hcAddress 的 hcRequire 属性已过时，请改为 required');
                this._prop_name_required = 'hcRequire';
            }
            if ('hcRequired' in $attrs) {
                console.warn('hcAddress 的 hcRequired 属性已过时，请改为 required');
                this._prop_name_required = 'hcRequired';
            }
            if ('required' in $attrs) {
                this._prop_name_required = 'required';
            }
            if (!this._prop_name_required) {
                this._prop_name_required = 'required';
            }
        }
    });

    function hcAddress() {
        return {
            restrict: 'E',
            replace: true,
            require: '^?form',
            template: '<div class="hc-address input-inline hc-form-item flex-row"></div>',
            link: function ($scope, $element, $attrs, formCtrl) {
                ready.then(function () {
                    (function () {
                        var noWidthClass = [1, 2, 3, 4].every(function (i) {
                            return !$element.hasClass('hc-w' + i);
                        });

                        if (noWidthClass) {
                            $element.addClass('hc-w' + ($attrs.address ? 2 : 1));
                        }
                    })();

                    v = new AddressSelector({
                        $scope: $scope,
                        $element: $element,
                        $attrs: $attrs
                    }).$injectForm(formCtrl).$mount();
                });
            }
        };
    }

    var areas;

    var ready = requestApi
        .post({
            classId: 'scparea',
            action: 'get_area_of_china',
            noShowWaiting: true
        })
        .then(function (response) {
            areas = response.scpareas;
        });

    var cache = Object.create(null);

    function getArea(superId) {
        superId = +superId || 0;

        var promise;
        if (superId in cache) {
            promise = cache[superId];
        }
        else {
            promise = requestApi
                .post({
                    classId: 'scparea',
                    data: {
                        superid: superId,
                        areatype: superId ? 0 : 4
                    }
                })
                .then(function (response) {
                    return response.scpareas;
                });

            cache[superId] = promise;
        }

        return promise.then(angular.copy);
    }

    //使用Api注册指令
    //需传入require模块和指令定义
    return directiveApi.directive({
        module: module,
        directive: hcAddress
    });
});