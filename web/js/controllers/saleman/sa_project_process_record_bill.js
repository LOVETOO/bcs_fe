/**
 * 工程进度登记(编辑页)
 * @since 2018-05-22
 */
HczyCommon.mainModule().controller('sa_project_process_record_bill', function ($scope, $stateParams, $q, BasemanService, SlickGridService, BillService, Magic, FormValidatorService, $log) {

    $log.info('控制器开始加载：sa_project_process_record_bill');

    $scope.head = {};
    head()[idField()] = parseInt($stateParams.id);

    /**
     * 头部对象
     * @return {Object}
     */
    function head() {
        return $scope.head;
    }

    /**
     * 头部业务类名
     * @return {string}
     */
    function classId() {
        return 'sa_project_process_record';
    }

    /**
     * 头部主键名
     * @return {string}
     */
    function idField() {
        return 'process_record_id';
    }

    /**
     * 头部主键值
     * @return {number}
     */
    function id() {
        return head()[idField()];
    }

    /*/!**
     * 流程模板ID
     * @return {number}
     *!/
    function wfTempId() {
        return head().wftempid;
    }

    /!**
     * 流程实例ID
     * @return {number}
     *!/
    function wfId() {
        return head().wfid;
    }*/

    /**
     * 查询请求
     * @return {Promise}
     */
    function rqSelect() {
        if (!id()) {
            var reason = '未指定主键';
            BasemanService.swal('查询数据失败', reason);
            return $q.reject(reason);
        }

        var postData = {};
        postData[idField()] = id();

        return BasemanService.RequestPost(classId(), 'select', postData);
    }

    window.currScope = $scope; //暴露这个作用域，才能被流程窗口访问到
    $scope.selectCurrenItem = refreshData; //暴露这个方法给流程窗口进行调用刷新
    //$scope.refreshData = refreshData;

    /**
     * 刷新数据
     * @return {Promise}
     */
    function refreshData() {
        return rqSelect().then(setData);
    }

    /**
     * 设置数据
     * @param data
     * @return {data}
     */
    function setData(data) {
        $scope.head = data;

        return $q
            .when()
            .then(function () {
                //若没有数据
                if (!Magic.isNotEmptyArray(data[fundDrName]))
                    return fundStages
                        .then(angular.copy)
                        .then(function () {
                            data[fundDrName] = arguments[0];
                        });
            })
            .then(function () {
                [{
                    grid: productGrid,
                    drName: 'sa_project_item_records'
                }, {
                    grid: fundGrid,
                    drName: fundDrName
                }].forEach(function (args) {
                    if (!canSave()) {
                        args.grid.setColumns(
                            args
                                .grid
                                .getColumns()
                                .filter(function (column) {
                                    return column.name !== '操作';
                                })
                        );
                    }

                    if (!data[args.drName])
                        data[args.drName] = [];

                    SlickGridService.setData({
                        grid: args.grid,
                        data: data[args.drName]
                    });
                });

                return data;
            });
    }

    $scope.canSave = canSave;

    /**
     * 允许保存
     * @return {boolean}
     */
    function canSave() {
        return head().stat <= 1;
    }

    /**
     * 保存请求
     * @return {Promise}
     */
    function rqSave() {
        var action = id() ? 'update' : 'insert';

        var postData = JSON.stringify(head());

        return BasemanService.RequestPost(classId(), action, postData);
    }

    $scope.saveData = saveData;

    /**
     * 保存数据
     * @return {Promise}
     */
    function saveData() {
		return $q
			.when({
				parent: '#page-common' + (needFund() ? ',#page-fund' : '')
			})
			.then(FormValidatorService.emptyMsg)
			.then(function (msg) {
				//当【跟进进度】>=【阶段2】时
				if (head().complete_percent >= 2) {
					//【送样日期】、【投标日期】必填其一
					if (!head().sample_date && !head().bid_date) {
						msg.push('送样日期 或 投标日期');
					}
				}

				if (msg.length) {
					//必填提醒
					FormValidatorService.noEmptyAlert(msg);

					return $q.reject();
				}
			})
            .then(function () {
                if (needFund()) {
                    var qgdRate;
                    if (qgdRateVisible()) {
                        qgdRate = Magic.toNum(head().qgd_rate);
                        if (qgdRate > 20) {
                            return Magic
                                .swalError('质保金比例不能超过20%')
                                .then($q.reject);
                        }
                    }
                    else
                        qgdRate = 0;

                    //计算付款比例之和
                    var rate = fundGrid.getData().reduce(function (result, rowData) {
                        return result + Magic.toNum(rowData.fund_rate);
                    }, qgdRate);

                    //付款比例之和必须=100%
                    if (rate !== 100) {
                        return Magic
                            .swalError({
                                title: '当前付款比例之和=' + rate + '%，不满足以下条件，请修改：<br>'
                                    + '预付款比例+到货款项比例+产品验收合格款项比例+项目验收合格款项比例+质保金货款比例=100%',
                                html: true
                            })
                            .then($q.reject);
                    }
                }
            })
            .then(rqSave)
            .then(setData)
            .then(function (data) {
                return Magic
                    .swalSuccess('保存成功')
                    .then(function () {
                        return data;
                    });
            });
    }

    $scope.saveAndSubmit = saveAndSubmit;

    /**
     * 保存并提交
     * @return {Promise}
     */
    function saveAndSubmit() {
        return saveData().then($scope.hcWf().submitWf);
    }

    $scope.closeWindow = BillService.closeWindow;

    /**
     * 词汇池
     */
    $scope.dictPool = {
        'stat': null, //状态
        'project_type': null, //项目类型
        'project_period': null, //项目阶段
        //'sale_center': null, //销售中心
        'crm_project.model': null, //采购模式
        'crm_project.soure_amt': null, //预采金额来源
        'crm_project.qgd_form': null, //质保金形式
        'crm_project.fund_stage': {
            isStr: true
        }, //款项阶段
        'crm_project.fund_form': {
            isStr: true
        } //付款形式
    };

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
     * 查询项目跟进进度说明
     */
    BasemanService.RequestPostAjax('crm_project', 'select_process_note', {})
        .then(function (data) {
            data.crm_project_process_notes.forEach(function (e) {
                e.note = e.name + (e.note ? ('：' + e.note) : '');
            });

            $scope.dictPool['crm_project.complete_percent'] = data.crm_project_process_notes;
        });

    /**
     * 过滤进度下拉值
     * @param e
     * @return {boolean}
     */
    $scope.filterCompletePercent = function (e) {
        return e.value >= head().old_complete_percent;
    };

    $scope.chooseManager = chooseManager;

    /**
     * 选择项目跟进人
     * @return {Promise}
     */
    function chooseManager () {
        return $q
            .when({
                title: '选择项目跟进人',
                scope: $scope

            })
            .then(BasemanService.chooseUser)
            .then(function (data) {
                head().manager = data.employee_code;
                head().manager_phone = data.mobil;
            });
    }

    $scope.calAmountPlan = calAmountPlan;

    /**
     * 计算灯具预计采购总量
     */
    function calAmountPlan() {
        head().amount_plan = Magic.toNum(head().in_amt) + Magic.toNum(head().out_amt);
    }

    /**
     * 需要付款信息时显示付款信息页
     * @type {needFund}
     */
    $scope.tabFundVisible = needFund;

    /**
     * 需要付款信息
     * @return {boolean}
     */
    function needFund() {
        return head().complete_percent >= 4 //项目已到达阶段【阶段4：合同实施，项目进行供货】
            && head().sale_center_code === 'KA' //且【归属方】为【KA】
            ;
    }

    $scope.qgdAmtVisible = qgdAmtVisible;

    /**
     * 【质保金金额】的可见性
     * @return {boolean}
     */
    function qgdAmtVisible() {
        return [1, 2].indexOf(head().qgd_form) >= 0;
    }

    $scope.qgdRateVisible = qgdRateVisible;

    /**
     * 【质保金比例】的可见性
     * @return {boolean}
     */
    function qgdRateVisible() {
        return [3].indexOf(head().qgd_form) >= 0;
    }

    /**
     * 当【合同总额】改变时
     */
    $scope.onCompactAmtChange = onCompactAmtChange;

    function onCompactAmtChange() {
        fundGrid.getData().forEach(function (rowData) {
            rowData.fund_amt = Magic.toNum(head().compact_amt) * Magic.toNum(rowData.fund_rate) / 100;
        });

        fundGrid.invalidate();
    }

    $scope.onFundRateChange = onFundRateChange;

    /**
     * 当【付款比例】改变时
     */
    function onFundRateChange() {
        fund().fund_amt = Magic.toNum(head().compact_amt) * Magic.toNum(fund().fund_rate) / 100;
    }

    /**
     * 含有字段【款项阶段】的对象的数组
     * @type {Promise}
     */
    var fundStages = $q
        .when('crm_project.fund_stage')
        .then(rqDict)
        .then(function (dictHead) {
            return dictHead
                .dicts
                .map(function (dict) {
                    return {
                        fund_stage: dict.dictvalue
                    };
                });
        });

    function dateColumnFormatter(row, cell, value) {
        return Magic.isStr(value) ? value.substr(0, 10) : '';
    }

    /**
     * 付款表格的列定义
     * @type {Array}
     */
    var fundColumns = [{
        field: 'seq',
        name: '序号',
        width: 48
    }, {
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
        formatter: dateColumnFormatter
    }, {
        field: 'fund_act_date',
        name: '实际到款时间',
        width: 100,
        formatter: dateColumnFormatter
    }, {
        field: 'note',
        name: '备注',
        width: 300
    }];

    BasemanService.loadDictToColumns({
        columns: fundColumns
    });

    /**
     * 付款表格的选项
     * @type {Object}
     */
    var fundOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };

    /**
     * 付款明细的关联对象名
     * @type {string}
     */
    var fundDrName = 'sa_project_process_funds';

    /**
     * 付款表格
     * @type {Slick.Grid}
     */
    var fundGrid = new Slick.Grid('#grid-fund', [], fundColumns, fundOptions);

    //绑定产品表格的单击事件
    fundGrid.onClick.subscribe(function (event, args) {

    });

    //绑定产品表格的双击事件
    fundGrid.onDblClick.subscribe(function (event, args) {
        editFund(args.row);
    });

    function fundModal() {
        return $('#modal-fund');
    }

    function fund() {
        return $scope.fund;
    }

    function editFund(row) {
        if (row >= 0) {
            $scope.fund = angular.copy(fundGrid.getData()[row]);
            fundModal().modal();
        }
    }

    $scope.saveFund = saveFund;

    function saveFund() {
        return FormValidatorService.noEmptyCheck({
            parent: fundModal()
        }).then(function () {
            var data = fundGrid.getData();
            data[fund().seq - 1] = fund();


            SlickGridService.setData({
                grid: fundGrid,
                data: data
            });

            fundModal().modal('hide');
        });
    }

    /**
     * 产品表格的列
     * @type {Array}
     */
    var productColumns = [{
        field: 'seq',
        name: '序号',
        width: 48
    }, {
        name: '操作',
        formatter: function gridButtons (/*row, cell, value, columnDef, dataContext*/) {
            return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>编辑</button>" +
                "<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
        },
        width: 90
    }, {
        field: 'item_name',
        name: '产品名称',
        width: 120
    }, {
        field: 'qty',
        name: '采购数量',
        width: 90
    }, {
        field: 'amount',
        name: '采购金额(万元)',
        width: 160,
        cssClass: 'amt',
        formatter: Slick.Formatters.Money
    }, {
        field: 'note',
        name: '备注',
        width: 200
    }];

    /**
     * 产品表格的选项
     * @type {Object}
     */
    var productOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };

    /**
     * 产品表格
     * @type {Slick.Grid}
     */
    var productGrid = new Slick.Grid("#grid-product", [], productColumns, productOptions);

    /**
     * 产品表格单击事件
     * @param event 事件
     * @param args 参数
     */
    productGrid.onClick.subscribe(function productGridClick(event, args) {
        var target = $(event.target);
        if (target.hasClass("viewbtn")) {
            editProduct(args.row);
        }
        else if (target.hasClass("delbtn")) {
            deleteProduct(args.row);
        }
    });

    /**
     * 产品表格双击事件
     * @param event 事件
     * @param args 参数
     */
    productGrid.onDblClick.subscribe(function productGridDblClick(event, args) {
        editProduct(args.row);
    });

    /**
     * 产品模态窗口
     */
    function productModal() {
        return $('#modal-product');
    }

    /**
     * 产品对象
     * @return {Object}
     */
    function product() {
        return $scope.product;
    }

    $scope.editProduct = editProduct;

    /**
     * 编辑产品
     * @param row 行
     */
    function editProduct (row) {
        if (row >= 0) {
            $scope.product = angular.copy(productGrid.getDataItem(row));
        }
        else {
            $scope.product = {};
        }

        productModal().modal();
    }

    $scope.saveProduct = saveProduct;

    /**
     * 保存产品
     */
    function saveProduct () {
        return FormValidatorService.noEmptyCheck({
            parent: productModal()
        }).then(function () {
            var data = productGrid.getData();

            if (product().seq > 0) {
                data[product().seq - 1] = product();
            }
            else {
                data.push(product());
            }

            SlickGridService.setData({
                grid: productGrid,
                data: data
            });

            productModal().modal('hide');
        });
    }

    /**
     * 删除产品
     * @param row
     */
    function deleteProduct(row) {
        SlickGridService.setData({
            grid: productGrid,
            type: 'splice',
            index: row,
            deleteCount: 1
        });
    }

    /**
     * 查询词汇的请求
     * @param dictCode 词汇编码
     * @return {Promise}
     */
    function rqDict(dictCode) {
        return BasemanService
            .RequestPost('base_search', 'searchdict', {
                dictcode: dictCode
            });
    }

    $q
        .when()
        .then(function() {
            if (!id()) {
                $scope.closeWindow();
                return $q.reject();
            }
        })
        .then(function () {
            return rqDict('crm_project.fund_stage');
        })
        .then(function (dictHead) {


            //head().
            SlickGridService.setData({
                grid: fundGrid,
                data: dictHead.dicts.map(function (dict) {
                    return {
                        fund_stage: dict.dictname
                    }
                })
            });
        })
        .then(refreshData)
    ;

    $log.info('控制器加载完毕：sa_project_process_record_bill');

});