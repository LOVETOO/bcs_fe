/**
 * 工程订单透视
 * @since 2019-11-11
 */
define(['module', 'controllerApi', 'directiveApi', 'requestApi', 'gridApi', 'jquery', 'angular', 'directive/hcButtons', 'directive/hcTab', 'directive/hcTabPage', 'directive/hcBox', 'directive/hcInput', 'directive/hcGrid', 'directive/hcChart', 'directive/hcProgress'], function (module, controllerApi, directiveApi, requestApi, gridApi, $, angular) {

    /**
     * 控制器-工程订单透视
     */
    EpmProjectView.$inject = ['$scope', '$q', '$modal'];
    function EpmProjectView(   $scope,   $q,   $modal) {

        /**
         * 工具栏
         */
        $scope.toolButtons = {
            toggleSearchPanelVisible: {
                title: function () {
                    return ($scope.searchPanelVisible ? '收起' : '展开') + '查询面板';
                },
                icon: function () {
                    return 'iconfont ' + ($scope.searchPanelVisible ? 'hc-less' : 'hc-moreunfold');
                },
                click: function () {
                    $scope.searchPanelVisible = !$scope.searchPanelVisible;
                }
            },
            clear: {
                title: '清除',
                icon: 'iconfont hc-qingsao',
                click: function () {
                    $scope.searchObj = {};
                },
                hide: function () {
                    return !$scope.searchPanelVisible;
                }
            },
            search: {
                title: '查询',
                icon: 'iconfont hc-search',
                click: function () {
                    return $scope.search();
                }
            }
        };

        [
            'deliveryProgress',
            'receiveProgress',
            'orderQtyProgress',
            'orderAmtProgress',
            'returnProgress'
        ].forEach(function (key) {
            $scope[key] = {};
        });

        /**
         * 表格选项-查询结果
         */
        $scope.gridOptions = {
            hcClassId: 'epm_project_view',
            hcRequestAction: 'search_project',
            hcPostData: function () {
                return angular.extend({}, $scope.staticSearchObj, $scope.searchObj);
            },
            hcDataRelationName: 'projects',
            hcEvents: {
                cellFocused: function (params) {
                    var proj = $scope.proj = params.api.hcApi.getDataOfRowIndex(params.rowIndex);

                    //交付进度
                    $scope.deliveryProgress.value = 0;
                    $scope.deliveryProgress.max = proj.effective_qty; //有效产品数量
                    $scope.deliveryProgress.value = proj.confirm_out_qty; //出库确认数量

                    //签收进度
                    $scope.receiveProgress.value = 0;
                    $scope.receiveProgress.max = proj.confirm_out_qty; //出库确认数量
                    $scope.receiveProgress.value = proj.received_qty; //签收数量

                    //下单进度(数量)
                    $scope.orderQtyProgress.value = 0;
                    $scope.orderQtyProgress.max = proj.effective_qty; //有效产品数量
                    $scope.orderQtyProgress.value = proj.ordered_qty; //下单数量

                    //下单进度(金额)
                    $scope.orderAmtProgress.value = 0;
                    $scope.orderAmtProgress.max = proj.effective_amt; //有效产品金额
                    $scope.orderAmtProgress.value = proj.ordered_amt; //下单金额

                    //回款进度
                    $scope.returnProgress.value = 0;
                    $scope.returnProgress.max = proj.effective_amt; //有效产品金额
                    $scope.returnProgress.value = proj.returned_amt; //回款金额
                }
            },
            hcOpenState: {
                '*': {
                    name: function (params) {
                        return Switch(params.data.report_type, '==')
                            .case(1, 'epmman.epm_report_prop')
                            .case(2, 'epmman.epm_strategy_report_prop')
                            .result;
                    },
                    params: function (params) {
                        return {
                            id: params.data.report_id
                        };
                    }
                }
            }
        };

        /**
         * 图表选项-单体项目-统计结果
         */
        $scope.chartOption = {
            legend: {
                type: 'scroll',
                orient: 'vertical',
                left: 'left'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}：{d}% ({c})'
            },
            series: [
                {
                    type: 'pie',
                    center: ['55%', '50%'],
                    minAngle: 5
                }
            ]
        };

        /**
         * 刷新表格
         */
        $scope.refreshGrid = function () {
            return gridApi.execute($scope.gridOptions, function (gridOptions) {
                return gridOptions.hcApi.search();
            });
        };

        /** 默认统计维度 */
        $scope.group_by = 'stage_id';

        /**
         * 刷新图表
         */
        $scope.refreshChart = function () {
            $scope.chart.showLoading(null, {
                text: '加载中...'
            });

            return $q
                .when()
                .then(function () {
                    return requestApi.post({
                        classId: 'epm_project_view',
                        action: 'statis_project',
                        data: angular.extend({}, $scope.staticSearchObj, $scope.searchObj)
                    });
                })
                .then(function (response) {
                    $scope.groups = response.groups;

                    $scope.chartOption = {
                        legend: {
                            data: $scope.groups.map(function (group) {
                                return group.name;
                            })
                        },
                        series: [
                            {
                                data: $scope.groups
                            }
                        ]
                    };
                })
                .finally(function () {
                    $scope.chart.hideLoading();
                });
        };

        /**
         * 静态查询对象
         */
        $scope.staticSearchObj = {
            group_by: 'stage_id'
        }

        /**
         * 查询对象
         */
        $scope.searchObj = {};

        /**
         * 查询
         */
        $scope.search = function () {
            return $q.all([
                $scope.refreshGrid(),
                $scope.refreshChart()
            ]);
        };

        /**
         * 显示详情
         */
        $scope.showProgressDetail = function (progress_name, title) {
            if (!$scope.proj) {
                return;
            }

            return $modal.open({
                title: title,
                template: '<div class="flex1 flex-column padding"><div class="flex1" hc-grid="gridOptions"></div></div>',
                controller: EpmProjectViewProgressDetail,
                resolve: {
                    progress_name: progress_name,
                    proj: $scope.proj
                },
                size: 'max',
                fullScreen: true
            }).result;
        };

    }

    /**
     * 控制器-单体工程订单透视
     */
    EpmSingleProjectView.$inject = ['$scope'];
    function EpmSingleProjectView(   $scope) {
        $scope.$parent.singleController = this;
        $scope.$parent.activeController = this;

        controllerApi.extend({
            controller: EpmProjectView,
            scope: $scope
        });

        //报备类型：1-单体报备
        $scope.staticSearchObj.report_type = 1;
        //默认统计维度：工程类型
        $scope.staticSearchObj.group_by = 'project_source';

        /**
         * 表格选项-单体项目-查询结果
         */
        $scope.gridOptions.columnDefs = [
            {
                type: '序号'
            },
            {
                field: 'project_valid',
                headerName: '有效状态',
                hcDictCode: 'valid'
            },
            {
                field: 'project_code',
                headerName: '项目编码'
            },
            {
                field: 'project_name',
                headerName: '项目名称'
            },
            {
                field: 'customer_code',
                headerName: '客户编码'
            },
            {
                field: 'customer_name',
                headerName: '客户名称'
            },
            {
                field: 'customer_short_name',
                headerName: '客户简称'
            },
            {
                field: 'report_time',
                headerName: '申报日期',
                type: '时间'
            },
            {
                field: 'province_name',
                headerName: '省'
            },
            {
                field: 'city_name',
                headerName: '市'
            },
            {
                field: 'area_name',
                headerName: '区'
            },
            {
                field: 'address',
                headerName: '详细地址'
            },
            {
                field: 'project_valid_date',
                headerName: '报备有效期至',
                type: '日期'
            },
            {
                field: 'stage_update_deadline',
                headerName: '进度更新期限',
                type: '日期'
            },
            {
                field: 'stage_name',
                headerName: '项目当前进度'
            },
            {
                field: 'division_id',
                headerName: '所属事业部',
                hcDictCode: 'epm.division'

            },
            {
                field: 'is_discount',
                headerName: '已生成折扣单',
                type: '是否'
            },
            {
                field: 'is_contract',
                headerName: '已生成合同',
                type: '是否'
            },
            {
                field: 'trading_company_name',
                headerName: '交易公司'
            },
            {
                field: 'manager',
                headerName: '项目经理'
            },
            {
                field: 'pdt_line',
                headerName: '产品线',
                hcDictCode: 'epm.order_pdt_line'
            },
            {
                field: 'project_source',
                headerName: '工程类型',
                hcDictCode: 'epm.project_source'
            },
            {
                field: 'party_a_name',
                headerName: '甲方名称'
            },
            {
                field: 'party_a_link_person',
                headerName: '甲方联系人'
            },
            {
                field: 'party_a_phone_hide',
                headerName: '甲方联系电话'
            },
            {
                field: 'party_b_name',
                headerName: '乙方名称'
            },
            {
                field: 'party_b_link_person',
                headerName: '乙方联系人'
            },
            {
                field: 'party_b_phone_hide',
                headerName: '乙方联系电话'
            },
            {
                field: 'agent_opinion',
                headerName: '经办人意见'
            },
            {
                field: 'agent',
                headerName: '经办人'
            },
            {
                field: 'agent_phone',
                headerName: '经办人电话'
            },
            {
                field: 'rel_project_code',
                headerName: '战略项目编码'
            },
            {
                field: 'rel_project_name',
                headerName: '战略项目名称'
            },
            {
                field: 'operating_mode',
                headerName: '管理类型',
                hcDictCode: 'epm.operating_mode'
            },
            {
                field: 'is_local',
                headerName: '本地/异地',
                hcDictCode: 'epm.is_local'
            },
            {
                field: 'need_deposit',
                headerName: '缴纳保证金',
                type: '词汇',
                cellEditorParams: {
                    names: ['同意', '不同意'],
                    values: [2, 1]
                }
            },
            {
                field: 'project_type',
                headerName: '业主类型',
                hcDictCode: 'epm.project_type'
            },
            {
                field: 'background',
                headerName: '背景关系',
                hcDictCode: 'epm.background'
            },
            {
                field: 'predict_sales_amount',
                headerName: '预估合同金额(元)',
                type: '金额'
            },
            {
                field: 'site_area',
                headerName: '工程建筑面积'
            },
            {
                field: 'predict_pdt_qty',
                headerName: '工程用量（套）'
            },
            {
                field: 'is_foreign',
                headerName: '海外',
                type: '是否'
            },
            {
                field: 'construction_stage',
                headerName: '工程施工进度'
            },
            {
                field: 'completion_date',
                headerName: '竣工日期',
                type: '日期'
            },
            {
                field: 'intent_product',
                headerName: '工程意向产品'
            },
            {
                field: 'competitor',
                headerName: '竞争对手'
            },
            {
                field: 'stage_desc',
                headerName: '项目进度描述'
            },
            {
                field: 'dealer_follower',
                headerName: '客户现场跟进人'
            },
            {
                field: 'dealer_follower_phone',
                headerName: '客户跟进人电话'
            },
            {
                field: 'own_follower',
                headerName: '乐华现场跟进人'
            },
            {
                field: 'own_follower_phone',
                headerName: '乐华跟进人电话'
            },
            {
                field: 'need_sample',
                headerName: '产品已送样',
                type: '是否'
            },
            {
                field: 'need_quote',
                headerName: '产品已报价',
                type: '是否'
            },
            {
                field: 'creator_name',
                headerName: '创建人'
            },
            {
                field: 'createtime',
                headerName: '创建时间',
                type: '时间'
            },
            {
                field: 'updator_name',
                headerName: '修改人'
            },
            {
                field: 'updatetime',
                headerName: '修改时间',
                type: '时间'
            }
        ];
    }

    /**
     * 控制器-战略工程订单透视
     */
    EpmStrategicProjectView.$inject = ['$scope'];
    function EpmStrategicProjectView(   $scope) {
        $scope.$parent.strategicController = this;

        controllerApi.extend({
            controller: EpmProjectView,
            scope: $scope
        });

        //报备类型：2-战略报备
        $scope.staticSearchObj.report_type = 2;
        //默认统计维度：管理类型
        $scope.staticSearchObj.group_by = 'operating_mode';

        /**
         * 表格选项-战略项目-查询结果
         */
        $scope.gridOptions.columnDefs = [
            {
                type: '序号'
            },
            {
                field: 'project_code',
                headerName: '项目编码'
            },
            {
                field: 'project_name',
                headerName: '项目名称'
            },
            {
                field: 'report_time',
                headerName: '申报日期',
                type: '时间'
            },
            {
                field: 'stage_name',
                headerName: '项目当前进度'
            },
            {
                field: 'trading_company_name',
                headerName: '交易公司'
            },
            {
                field: 'manager',
                headerName: '项目经理'
            },
            {
                field: 'pdt_line',
                headerName: '产品线',
                hcDictCode: 'epm.order_pdt_line'
            },
            {
                field: 'operating_mode',
                headerName: '管理类型',
                hcDictCode: 'epm.operating_mode'
            },
            {
                field: 'party_a_name',
                headerName: '甲方名称'
            },
            {
                field: 'party_a_link_person',
                headerName: '甲方联系人'
            },
            {
                field: 'party_a_phone_hide',
                headerName: '甲方联系电话'
            },
            {
                field: 'party_b_name',
                headerName: '乙方名称'
            },
            {
                field: 'party_b_link_person',
                headerName: '乙方联系人'
            },
            {
                field: 'party_b_phone_hide',
                headerName: '乙方联系电话'
            },
            {
                field: 'strategic_stage',
                headerName: '战略对接进度'
            },
            {
                field: 'project_type',
                headerName: '项目类型',
                hcDictCode: 'epm.project_type'
            },
            {
                field: 'background',
                headerName: '背景关系',
                hcDictCode: 'epm.background'
            },
            {
                field: 'predict_proj_qty',
                headerName: '预计项目数量'
            },
            {
                field: 'predict_pdt_qty',
                headerName: '工程用量（套）'
            },
            {
                field: 'predict_sign_date',
                headerName: '预计签订日期',
                type: '日期'
            },
            {
                field: 'predict_sales_amount',
                headerName: '预计销售收入（万元）',
                type: '万元'
            },
            {
                field: 'intent_product',
                headerName: '工程意向产品'
            },
            {
                field: 'competitor',
                headerName: '竞争对手'
            },
            {
                field: 'creator_name',
                headerName: '创建人'
            },
            {
                field: 'createtime',
                headerName: '创建时间',
                type: '时间'
            },
            {
                field: 'updator_name',
                headerName: '修改人'
            },
            {
                field: 'updatetime',
                headerName: '修改时间',
                type: '时间'
            }
        ];
    }

    /**
     * 控制器-工程订单透视进度详情
     */
    EpmProjectViewProgressDetail.$inject = ['$scope', 'proj', 'progress_name'];
    function EpmProjectViewProgressDetail(   $scope,   proj,   progress_name) {
        $scope.gridOptions = {
            hcClassId: 'epm_project_view',
            hcRequestAction: 'search_progress_detail',
            hcPostData: {
                progress_name: progress_name,
                project_id: proj.project_id
            },
            hcDataRelationName: 'details',
            hcNoPaging: true
        };

        Switch(progress_name)
            //交付进度
            .case('deliveryProgress', function () {
                $scope.gridOptions.columnDefs = [
                    {
                        type: '序号'
                    },
                    {
                        field: 'contract_code',
                        headerName: '合同编码'
                    },
                    {
                        field: 'contract_name',
                        headerName: '合同名称'
                    },
                    {
                        field: 'discount_apply_code',
                        headerName: '折扣单号'
                    },
                    {
                        field: 'discount_seq',
                        headerName: '折扣行号'
                    },
                    {
                        field: 'item_code',
                        headerName: '产品编码'
                    },
                    {
                        field: 'effective_qty',
                        headerName: '有效产品数量'
                    },
                    {
                        field: 'item_name',
                        headerName: '产品名称'
                    },
                    {
                        field: 'sa_salebillno',
                        headerName: '订单号'
                    },
                    {
                        field: 'order_seq',
                        headerName: '订单行号'
                    },
                    {
                        field: 'ordered_qty',
                        headerName: '下单数量'
                    },
                    {
                        field: 'invbillno',
                        headerName: '出库单号'
                    },
                    {
                        field: 'delivery_seq',
                        headerName: '出库行号'
                    },
                    {
                        field: 'confirm_out_qty',
                        headerName: '出库数量'
                    }
                ];
            })
            //签收进度
            .case('receiveProgress', function () {
                $scope.gridOptions.columnDefs = [
                    {
                        type: '序号'
                    },
                    {
                        field: 'invbillno',
                        headerName: '出库单号'
                    },
                    {
                        field: 'delivery_seq',
                        headerName: '出库行号'
                    },
                    {
                        field: 'item_code',
                        headerName: '产品编码'
                    },
                    {
                        field: 'item_name',
                        headerName: '产品名称'
                    },
                    {
                        field: 'confirm_out_qty',
                        headerName: '出库数量'
                    },
                    {
                        field: 'diffbill_no',
                        headerName: '签收单号'
                    },
                    {
                        field: 'received_qty',
                        headerName: '签收数量'
                    }
                ];
            })
            //下单进度
            .case('orderQtyProgress', 'orderAmtProgress', function () {
                $scope.gridOptions.columnDefs = [
                    {
                        type: '序号'
                    },
                    {
                        field: 'contract_code',
                        headerName: '合同编码'
                    },
                    {
                        field: 'contract_name',
                        headerName: '合同名称'
                    },
                    {
                        field: 'discount_apply_code',
                        headerName: '折扣单号'
                    },
                    {
                        field: 'discount_seq',
                        headerName: '折扣行号'
                    },
                    {
                        field: 'item_code',
                        headerName: '产品编码'
                    },
                    {
                        field: 'effective_qty',
                        headerName: '有效产品数量'
                    },
                    {
                        field: 'item_name',
                        headerName: '产品名称'
                    },
                    {
                        field: 'sa_salebillno',
                        headerName: '订单号'
                    },
                    {
                        field: 'order_seq',
                        headerName: '订单行号'
                    },
                    {
                        field: 'ordered_qty',
                        headerName: '下单数量'
                    },
                    {
                        field: 'ordered_amt',
                        headerName: '下单金额',
                        type: '金额'
                    }
                ];
            })
            //回款进度
            .case('returnProgress', function () {
                $scope.gridOptions.columnDefs = [
                    {
                        type: '序号'
                    },
                    {
                        field: 'contract_code',
                        headerName: '合同编码'
                    },
                    {
                        field: 'contract_name',
                        headerName: '合同名称'
                    },
                    {
                        field: 'contract_amt',
                        headerName: '合同金额',
                        type: '金额'
                    },
                    {
                        field: 'payment_allot_code',
                        headerName: '回款认领单号'
                    },
                    {
                        field: 'returned_amt',
                        headerName: '回款金额',
                        type: '金额'
                    }
                ];
            })
            .default(function () {
                throw new Error('未知的进度：' + progress_name);
            });
    }

    function ppItem() {
        return {
            template: function (tElement, tAttrs) {
                if (!tAttrs.col) {
                    tAttrs.$set('col', 12);
                }

                tElement.addClass('col-md-' + tAttrs.col || 12);

                var $key = $('<span>', {
                    class: 'pp-item-key'
                });
                processProperty($key, tAttrs, 'key');

                var $value = $('<span>', {
                    class: 'pp-item-value'
                });
                processProperty($value, tAttrs, 'value');

                var $progress, $detail;
                if (tAttrs.percent) {
                    $progress = $('<hc-progress>', {
                        name: tAttrs.percent
                    });

                    $detail = $('<div>', {
                        css: {
                            'margin-left': '8px'
                        },
                        'hc-icon': 'iconfont hc-search',
                        'hc-title': '详情',
                        'hc-button': 'showProgressDetail("' + tAttrs.percent + '", "' + tAttrs.key + '")'
                    });
                }

                return [
                    $key,
                    $('<span>', {
                        text: '：'
                    }),
                    $value,
                    $progress,
                    $detail
                ];
            }
        };

        function processProperty(element, attrs, property) {
            var exp;

            if (exp = attrs[property]) {
                var attrName = attrs.$attr[property];
                if (attrName === ':' + property) {
                    element.attr('ng-bind', exp);

                    if (property === 'value') {
                        element.attr('title', '{{ ' + exp + ' }}');
                    }
                }
                else {
                    element.text(exp);

                    if (property === 'value') {
                        element.attr('title', exp);
                    }
                }
            }

            return element;
        }
    }

    directiveApi.directive({
        name: 'ppItem',
        directive: ppItem
    });

    controllerApi.controller({
        name: 'EpmSingleProjectView',
        controller: EpmSingleProjectView
    });

    controllerApi.controller({
        name: 'EpmStrategicProjectView',
        controller: EpmStrategicProjectView
    });

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: function () {}
    });
});