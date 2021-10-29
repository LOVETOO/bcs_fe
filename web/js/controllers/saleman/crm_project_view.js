/**
 * 工程项目透视
 * @since 2018-06-05
 */
HczyCommon.mainModule().controller('crm_project_view', function ($scope, $q, $log, $timeout, BasemanService, SlickGridService, Magic) {

    $log.info('开始加载控制器：crm_project_view');

    /**
     * 表格列定义
     * @type {{}[]}
     */
    var columns = [SlickGridService.columnSeq(), {
        field: 'project_code',
        name: '工程项目编码',
        width: 140
    }, {
        field: 'project_name',
        name: '工程项目名称',
        width: 300
    }, {
        field: 'project_type',
        name: '项目类型',
        dictcode: '.',
        width: 120
    }, {
        field: 'dealer_name',
        name: '经销商',
        width: 160
    }, {
        field: 'sale_center_name',
        name: '归属方',
        width: 160
    }, {
        field: 'project_period',
        name: '项目当前阶段',
        dictcode: '.',
        width: 120
    }, {
        field: 'amount_plan',
        name: '预采购总额(万元)',
        width: 120,
        formatter: Slick.Formatters.Money,
        cssClass: 'amt'
    }, {
        field: 'main_product',
        name: '主要采购品类',
        width: 200
    }, {
        field: 'audittime',
        name: '报备日期',
        width: 100,
        formatter: Slick.Formatters.Date
    }, {
        field: 'sample_date',
        name: '送样日期',
        width: 100,
        formatter: Slick.Formatters.Date
    }, {
        field: 'contract_date',
        name: '签约日期',
        width: 100,
        formatter: Slick.Formatters.Date
    }, {
        field: 'sa_salebillno',
        name: '订单号',
        width: 240
    }, {
        field: 'order_date',
        name: '下单日期',
        width: 100,
        formatter: Slick.Formatters.Date
    }, {
        field: 'audit_qty',
        name: '出库数量',
        width: 120
    }, {
        field: 'qty_recbill',
        name: '签收数量',
        width: 120
    }];

    /**
     * 表格列定义-交付详情
     * @type {{}[]}
     */
    var paycolumns = [SlickGridService.columnSeq(),{
        field: 'sa_salebillno',
        name: '销售订单号',
        width: 130
    }, {
        field: 'attribute1',
        name: 'ERP订单号',
        width: 130
    },  {
        field: 'item_code',
        name: '产品编码',
        width: 120
    }, {
        field: 'item_name',
        name: '产品名称',
        width: 300
    }, {
        field: 'qty_bill',
        name: '订货数量',
        dictcode: '.',
        width: 100
    }, {
        field: 'note',
        name: '承诺交期',
        width: 200
    }, {
        field: 'invbillno',
        name: '出库单号',
        width: 130
    }, {
        field: 'invbill_sap_no',
        name: 'ERP出库单号',
        width: 130
    },{
        field: 'audit_qty',
        name: '出库数量',
        width: 100
    }];

    /**
     * 表格列定义-回款详情
     * @type {{}[]}
     */
    var fundcolumns = [SlickGridService.columnSeq(), {
        field: 'fund_stage',
        name: '款项阶段',
        dictcode: 'crm_project.fund_stage',
        width: 160
    }, {
        field: 'fund_form',
        name: '付款形式',
        dictcode: 'crm_project.fund_form',
        width: 120
    }, {
        field: 'fund_rate',
        name: '比例(%)',
        width: 80,
        formatter: Slick.Formatters.Money,
        cssClass: 'amt'
    }, {
        field: 'fund_amt',
        name: '金额(万元)',
        width: 120,
        formatter: Slick.Formatters.Money,
        cssClass: 'amt'
    }, {
        field: 'fund_plan_date',
        name: '预计到款时间',
        width: 100,
        formatter: Slick.Formatters.Date,
    }, {
        field: 'fund_act_date',
        name: '实际到款时间',
        width: 100,
        formatter: Slick.Formatters.Date,
    }, {
        field: 'note',
        name: '备注',
        width: 300
    }];

    //加载词汇
    BasemanService.loadDictToColumns({
        columns: columns
    });
    BasemanService.loadDictToColumns({
        columns: fundcolumns
    });

    /**
     * 表格选项
     * @type {{}}
     */
    var options = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };

    /**
     * 表格
     * @type {Slick.Grid}
     */
    var grid = new Slick.Grid('#grid', [], columns, options);
    var paygrid = new Slick.Grid('#payGrid', [], paycolumns, options);
    var fundgrid = new Slick.Grid('#fundgrid', [], fundcolumns, options);

    /**
     * 激活单元格切换事件
     */
    grid.onActiveCellChanged.subscribe(function (event, args) {
        $scope.project = grid.getDataItem(args.row);
    });

    /**
     * 表格双击事件
     */
    grid.onDblClick.subscribe(function (event, args) {
        BasemanService.openModal({
            url: '/index.jsp#/saleman/proj/' + grid.getDataItem(args.row).project_id,
            title: '工程项目',
            obj: $scope
        });
    });

    /**
     * 头部对象
     * @return {{}}
     */
    function head() {
        return $scope.head;
    }

    /**
     * 项目对象
     * @return {{}}
     */
    function project() {
        return $scope.project;
    }

    /**
     * 业务类名
     * @return {string}
     */
    function classId() {
        return 'crm_project_view';
    }

    /**
     * 搜索请求
     * @param {{}} [postData] 请求数据
     * @return {Promise}
     */
    function rqSearch(postData) {
        return BasemanService
            .RequestPost(classId(), 'search', postData || {});
    }

    /**
     * 交付详情查询请求
     * @param {{}} [postData] 请求数据
     * @return {Promise}
     */
    function paydetail(postData) {
        return BasemanService
            .RequestPost(classId(), 'paydetail', postData || {});
    }

    /**
     * 回款详情查询请求
     * @param {{}} [postData] 请求数据
     * @return {Promise}
     */
    function funddetail(postData) {
        return BasemanService
            .RequestPost(classId(), 'funddetail', postData || {});
    }

    /**
     * 设置数据
     * @param {{projects: {}[]}} head 数据头部
     */
    function setData(head) {
        SlickGridService.setData({
            grid: grid,
            data: head.projects
		});

		grid.gotoCell(0, 0);

		BasemanService.pageInfoOp($scope, head.pagination);
    }

    $scope.searchData = searchData;

    /**
     * 搜索数据
     * @param {{}} [postData] 请求数据
     * @return {Promise}
     */
    function searchData(postData) {
        postData = postData || {};

		angular.extend(postData, head());

		if (!postData.pagination) {
			$scope.oldPage = 1;
			$scope.currentPage = 1;
			if (!$scope.pageSize) $scope.pageSize = '20';
			$scope.totalCount = 1;
			$scope.pages = 1;
			postData.pagination = 'pn=1,ps=' + $scope.pageSize + ',pc=0,cn=0,ci=0';
		}

        return rqSearch(postData)
            .then(setData);
    }

    $scope.clickSearch = clickSearch;


    /**
     * 点击查询
     * @return {Promise}
     */
    function clickSearch() {
        $scope.searching = true;

        return searchData()
            .finally(function () {
                $scope.searching = false;
            });
    }

    $scope.pressSearch = pressSearch;

    /**
     * 敲击回车查询
     * @param $event
     * @return {Promise}
     */
    function pressSearch($event) {
        if ($event.which === 13)
            return clickSearch();
    }

    (function () {
        /**
         * @type {string[]}
         */
        var keyList = ['customer_id', 'customer_code', 'customer_name'];

        $scope.chooseCustomer = chooseCustomer;

        /**
         * 选择客户
         * @return {Promise}
         */
        function chooseCustomer() {
            return BasemanService
                .chooseCustomer({
                    scope: $scope
                })
                .then(function (customer) {
                    keyList
                        .forEach(function (key) {
                            head()[key] = customer[key];
                        });
                })
                .then(clickSearch);
        }

        $scope.clearCustomer = clearCustomer;

        /**
         * 清除客户
         * @return {Promise}
         */
        function clearCustomer() {
            keyList
                .forEach(function (key) {
                    delete head()[key];
                });

            return clickSearch();
        }
    })();

    $scope.valueToName = valueToName;

    /**
     * 词汇值转名称
     * @param {string} field 字段名称
     * @param {string} dictCode 词汇编码
     * @return {string} 词汇名称
     */
    function valueToName(field, dictCode) {
        if (!dictPool[dictCode] || !project())
            return '';

        var dict = dictPool[dictCode]
            .find(function (d) {
                return d.value === project()[field];
            });

        if (dict)
            return dict.name;

        return '';
    }

    /**
     * 词汇池
     * @type {{}}
     */
    var dictPool = {
        'project_type': null,
        'project_period': null,
        'crm_project.qgd_form': null, //质保金形式
        'crm_project.fund_stage': {
            isStr: true
        }, //款项阶段
        'crm_project.fund_form': {
            isStr: true
        } //付款形式
    };

    $scope.dictPool = dictPool;

    /**
     * 加载词汇
     */
    angular.forEach($scope.dictPool, function (dictOption, dictCode) {
        $q
            .when(dictCode)
            .then(rqDict)
            .then(function (dictHead) {
                $scope.dictPool[dictCode] = dictHead.dicts.map(function (dict) {
                    return {
                        name: dict.dictname,
                        value: dictOption && dictOption.isStr ? dict.dictvalue : Magic.toInt(dict.dictvalue)
                    };
                });
            })
        ;
    });

    /**
     * 查询词汇的请求
     * @param {string} dictCode 词汇编码
     * @return {Promise}
     */
    function rqDict(dictCode) {
        return BasemanService
            .RequestPost('base_search', 'searchdict', {
                dictcode: dictCode
            });
    }

    /**
     * 查询项目跟进进度说明
     */
    rqProcessNote()
        .then(function (dataHead) {
            $scope.dictPool['complete_percent'] = dataHead
                .crm_project_process_notes
                .map(function (e) {
                    return {
                        value: e.value,
                        name: e.name + (e.note ? ('：' + e.note) : '')
                    }
                });
        });

    /**
     * 查询项目跟进进度说明的请求
     * @return {Promise}
     */
    function rqProcessNote() {
        return BasemanService.RequestPost('crm_project', 'select_process_note', {})
    }

    $scope.payDetailView = payDetailView;
    /**
     * 查看交付详情
     */
    function payDetailView (postData) {
        postData = postData || {};
        postData.project_id = $scope.project.project_id;
        // angular.extend(postData, head());
        return paydetail(postData)
            .then(function (data) {
                SlickGridService.setData({
                    grid: paygrid,
                    data: data.pays
                });
                $("#payModal").modal();
            });
    }

    $scope.fundDetailView = fundDetailView;
    /**
     * 查看回款详情
     */
    function fundDetailView(postData) {
        postData = postData || {};
        postData.project_id = $scope.project.project_id;

        return funddetail(postData)
            .then(function (data) {
                $scope.fund = data;
                $scope.fund.verificated_amt = $scope.fund.verificated_amt.toString();
                SlickGridService.setData({
                    grid: fundgrid,
                    data: data.funds
                });
                $("#fundModal").modal();
            });
    }

    /**
     * 饼图请求
     * @return {Promise}
     */
    function rqPie() {
        return BasemanService
            .RequestPost(classId(), 'pie', {});
    }

    $q
        .when()
        .then(function () {
            $scope.head = {
                //start_date_to: Magic.today()
            }
        });

    /**
     * 分页
     */
    $q
        .when($scope)
        .then(BasemanService.pageGridInit);

    /**
     * 饼图
     */
    $q
        .when()
        .then(rqPie)
        .then(function (dataHead) {
            var pieSections = dataHead
                .piesections
                .map(function (e) {
					return {
						id: e.value,
                        name: e.pie_name,
                        value: e.pie_value,
                        itemStyle: {
                            color: e.pie_color
                        }
                    };
                });

            var chartOption = {
                title : {
                    text: '项目统计', //标题
                    subtext: '', //副标题
                    x: 'center' //标题居中
                },
                tooltip : {
                    trigger: 'item',
                    formatter: '{b}：{d}%({c})'
                },
                legend: {
                    orient: 'vertical', //标签垂直排列
                    left: 'left' //标签剧左
                },
                series : [
                    {
                        name: '工程项目',
                        type: 'pie',
                        radius : '70%',
                        center: ['65%', '60%'],
                        data: pieSections,
                        label: {
                            show: true,
                            formatter: '{d}%({c})'
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
						}
                    }
                ]
            };

            $log.info('echarts version: ' + echarts.version);

            var chart = echarts.init($('#chart').get(0));
			chart.setOption(chartOption);
			//点击事件
			chart.on('click', function (params) {
				searchData({
                    stage_value: params.data.id
				});
			});
        });

    $log.info('控制器加载完毕：crm_project_view');

});