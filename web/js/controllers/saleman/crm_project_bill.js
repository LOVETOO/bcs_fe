/**
 * 工程项目报备(编辑页)
 * @since 2018-04-27
 */
angular.module('inspinia').controller('crm_project_bill', function ($scope, BasemanService, $stateParams, SlickGridService, $q, Magic, FormValidatorService) {

    window.currScope = $scope; //暴露这个作用域，才能被流程窗口访问到

    $scope.data={}
    $scope.data.currItem ={}
    $scope.data = { wftemps: [], bSubmit: false, canmodify: true};
    $scope.data.currItem = {"objattachs": [], "project_id": $stateParams.id};

    /**
     * 标题
     * @returns {string}
     */
    /*function getTitle () {
        return '工程项目报备';
    };*/

    /**
     * 对象配置ID
     * @returns {number}
     */
    function getObjType () {
        return 1804270001;
    }

    /**
     * 业务类名
     * @returns {string}
     */
    function getClassId () {
        return 'crm_project';
    }

    /**
     * ID字段名
     * @returns {string}
     */
    function getIdField () {
        return 'project_id';
    }

    /**
     * 取ID
     * @returns {number}
     */
    function getId () {
        if (hasBiz()) {
            var id = biz()[getIdField()];
            if (id > 0) return id;
        }

        return 0;
    }

    /**
     * 有当前业务对象吗？
     * @returns {boolean}
     */
    function hasBiz () {
        return angular.isObject(biz());
    }

    /**
     * 有ID吗？
     * @returns {boolean}
     */
    function hasId () {
        return getId() > 0;
    }

    /**
     * 刷新数据
     */
    $scope.selectCurrenItem = refreshData; //暴露这个方法给流程窗口进行调用刷新
    $scope.refreshData = refreshData;
    function refreshData () {
        var errorTitle = '查询数据失败';

        if (!hasId()) {
            BasemanService.swal(errorTitle, '未指定主键：' + getIdField());
            return $q.reject();
        }

        var postData = {};
        postData[getIdField()] = getId();

        return BasemanService.RequestPost(getClassId(), 'select', postData).then(setData);
    }

    /**
     * 设置数据
     * @param data
     */
    function setData (data) {
        $scope.biz = data;

        if (!biz().crm_project_items) biz().crm_project_items = [];

        SlickGridService.setData({
            grid: $scope.productGrid,
            data: biz()['crm_project_items']
        });
    }

    /**
     * 校验数据
     */
    /*function verifyData() {
        var s = '';
        $('#form-head :text.non-empty,#form-head select.non-empty').each(function () {
            var jqThis = $(this);
            if (!jqThis.val())
                s += '【' + jqThis.prev().text() + '】\n';
        });
        if (s) {
            BasemanService.swal('以下内容，不能为空，请补充', s);
            return false;
        }
        else
            return true;
    }*/

    /**
     * 保存数据
     */
    $scope.saveData = saveData;
    function saveData () {
        /*if (!verifyData()) return $q.reject('校验不通过');*/

		return $q
			.when({
				parent: '#form-head'
			})
			.then(FormValidatorService.emptyMsg)
			.then(function (msg) {
				//当【跟进进度】>=【阶段2】时
				if (biz().complete_percent >= 2) {
					//【送样日期】、【投标日期】必填其一
					if (!biz().sample_date && !biz().bid_date) {
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
                var action = hasId() ? 'update' : 'insert';

                var postData = JSON.stringify(biz());

                return BasemanService.RequestPost(getClassId(), action, postData);
			})
			.then(setData)
			.then(function () {
				return Magic.swalSuccess('保存成功');
			})
		;
    }

    /**
     * 提交数据
     */
    $scope.submitData = submitData;
    function submitData() {
        saveData().then(function () {
            wfTrigger.setCause(2).run();
        });
    }

    /**
     * 流程标签头
     * @returns
     */
    function tabWf() {
        return $('#tab_wf');
    }

    /**
     * 流程窗口的嵌入位置
     * @returns
     */
    function bodyWf () {
        return $('#body_wf');
    }

    /**
     * 流程窗口
     * @returns
     */
    function formWf () {
        return $('#form_wf');
    }

    //var loadingWf = false;

    /**
     * 加载流程
     * @param args = {
     *     submit: 是否提交
     * }
     */
    /*function loadWf (args) {
        if (loadingWf) return;

        loadingWf = true;
        try {
            //制单后才显示流程
            if (hasId()) {
                //未确定流程模板时，选择流程模板
                if (!getWfTempId()) chooseWfTemp();

                if (!getWfTempId()) return;

                if (formWf().length === 0) {
                    bodyWf().append("<iframe id='form_wf' style='width:100%;height:100%;background-color:#e2e5ec;'></iframe>");
                }

                var oldSrc = formWf().attr('src');

                if (!oldSrc || (args && args.refreshSrc)) {
                    var newSrc = '/index.jsp#/crmman/wfins'
                        + '/' + (hasWfId() ? '' : getWfTempId()) //流程模板ID
                        + '/' + (hasWfId() ? getWfId() : '') //流程ID
                        + '/' + getObjType() //对象配置ID
                        + '/' + getId() //自身ID
                        + '/' + (args && args.submit ? 1 : 0) //是否提交节点
                        + '?showmode=2';

                    if (oldSrc !== newSrc)
                        formWf().attr('src', newSrc);
                }

                if (!tabWf().parent().hasClass('active'))
                    tabWf().tab('show');
            }
        }
        finally {
            loadingWf = false;
        }
    }*/

    var wfTrigger = new function () {

        /**
         * 1 = 切换到流程标签页
         * 2 = 点击按钮【保存并提交】
         * @type {number}
         */
        var cause = 0;

        /**
         * 由切换到流程标签页触发的
         * @returns {boolean}
         */
        /*function isByTabChange() {
            return cause === 1;
        }*/

        /**
         * 由点击按钮【保存并提交】触发的
         * @returns {boolean}
         */
        function isByClickSubmit() {
            return cause === 2;
        }

        this.setCause = function (theCause) {
            if (!cause) cause = theCause;
            return this;
        };

        this.run = function () {
            chooseWfTemp()
                .then(function () {
                    if (!getWfTempId())
                        return;

                    if (formWf().length === 0) {
                        bodyWf().append("<iframe id='form_wf' style='width:100%;height:100%;background-color:#e2e5ec;'></iframe>");
                    }

                    var oldSrc = formWf().attr('src');

                    var newSrc = '/web/index.jsp?t=' + (new Date()).getTime() + '#/crmman/wfins'
                        + '/' + (hasWfId() ? '' : getWfTempId()) //流程模板ID
                        + '/' + (hasWfId() ? getWfId() : '') //流程ID
                        + '/' + getObjType() //对象配置ID
                        + '/' + getId() //自身ID
                        + '/' + (isByClickSubmit() ? 1 : 0) //是否提交节点
                        + '?showmode=2';

                    if (oldSrc !== newSrc)
                        formWf().attr('src', newSrc);

                    if (!tabWf().parent().hasClass('active'))
                        tabWf().tab('show');
                })
                .finally(function () {
                    cause = 0;
                });
        };

    };

    /**
     * 标签头组
     * @returns
     */
    function tabs() {
        return $('#tabs');
    }

    /**
     * 标签页切换事件
     */
    tabs().on('shown.bs.tab', function (e) {
        if ($(e.target).is(tabWf())) {
            //loadWf();
            wfTrigger.setCause(1).run();
        }
    });

    /**
     * 产品模态窗口
     */
    function productModal() {
        return $('#productModal');
    }

    /**
     * 编辑产品
     * @param row 行
     */
    $scope.editProduct = editProduct;
    function editProduct (row) {
        if (row >= 0) {
            $scope.data.currProduct = angular.copy($scope.productGrid.getData()[row]);
        }
        else {
            $scope.data.currProduct = {};
        }

        productModal().modal();
    }

    /**
     * 能否编辑产品？
     */
    $scope.canEditProduct = canEditProduct;
    function canEditProduct () {
        return true;
    }

    /**
     * 保存产品
     */
    $scope.saveProduct = saveProduct;
    function saveProduct () {
        return FormValidatorService.noEmptyCheck({
            parent: productModal()
        }).then(function () {
            var data = $scope.productGrid.getData();

            if ($scope.data.currProduct.seq > 0) {
                data[$scope.data.currProduct.seq - 1] = $scope.data.currProduct;
            }
            else {
                data.push($scope.data.currProduct);
            }

            SlickGridService.setData({
                grid: $scope.productGrid,
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
            grid: $scope.productGrid,
            type: 'splice',
            index: row,
            deleteCount: 1
        });
    }

    /**
     * 关闭
     */
    $scope.close = close;
    function close () {
        if (window !== window.parent) {
            BasemanService.closeModal();
        } else {
            window.close();
        }
    }

    /**
     * 业务对象的整数值
     * @param key 键
     * @returns {number}
     */
    function bizIntValue(key) {
        var value;
        if (hasBiz()) {
            value = biz()[key];
            if (angular.isNumber(value)) {
                //
            }
            else if (angular.isString(value)) {
                value = parseInt(value);
            }
            else {
                value = 0;
            }
        }
        else {
            value = 0;
        }

        if (value !== value) value = 0;

        return value;
    }

    /**
     * 单据状态
     * @returns {number}
     */
    function getStat () {
        return bizIntValue('stat');
    }

    /**
     * 流程ID
     * @returns {number}
     */
    function getWfId () {
        return bizIntValue('wfid');
    }

    /**
     * 流程模板ID
     */
    function getWfTempId () {
        return bizIntValue('wftempid');
    }

    $scope.wfTemps = [];

    /**
     * 加载流程模板列表
     */
    function loadWfTempList() {
        return BasemanService.RequestPost('scpobjconf', 'select', { objtypeid: getObjType() })
            .then(function (data) {
                if (angular.isArray(data.objwftempofobjconfs)) {
                    $scope.wfTemps = [];

                    angular.forEach(data.objwftempofobjconfs, function (element) {
                        var needPush = true;
                        if (element.execcond) {
                            //运行表达式，符合条件的才加入列表
                            needPush = eval(element.execcond.replace(new RegExp("<item>", "gm"), '$scope.biz'));
                        }

                        if (needPush) $scope.wfTemps.push(element);
                    });
                }
            });
    }

    var chooseWfTempDefer;

    /**
     * 单击流程模板
     * @param {number}
     */
    $scope.clickWfTemp = clickWfTemp;
    function clickWfTemp(wfTempId) {
        formWfTemp().modal('hide');
        chooseWfTempDefer.resolve(wfTempId);
    }

    /**
     * 选择流程模板
     */
    function chooseWfTemp() {
        if (getWfTempId()) {
            return $q.when();
        }
        else {
            chooseWfTempDefer = $q.defer();

            if ($scope.wfTemps.length === 1) {
                chooseWfTempDefer.resolve($scope.wfTemps[0].wftempid);
            }
            else if ($scope.wfTemps.length > 1) {
                formWfTemp().modal(); //弹出模态框供用户选择
            }
            else {
                var s = '没有配置流程模板，或没有流程模板符合使用条件';
                BasemanService.swal('', s);
                chooseWfTempDefer.reject(s);
            }

            return chooseWfTempDefer.promise.then(function (wfTempId) {
                biz().wftempid = wfTempId;
            });
        }
    }

    /**
     * 流程模板窗口
     * @returns
     */
    function formWfTemp() {
        return $("#form-wf-temp");
    }

    /**
     * 有流程ID吗？
     * @returns {boolean}
     */
    function hasWfId() {
        return getWfId() > 0;
    }

    /**
     * 能否保存？
     * @returns {boolean}
     */
    $scope.canSave = canSave;
    function canSave () {
        return getStat() <= 1;
    }

    /**
     * 能否提交？
     * @returns {boolean}
     */
    $scope.canSubmit = canSubmit;
    function canSubmit () {
        return getWfId() === 0;
    }

    /**
     * 附件数量
     * @returns {number}
     */
    $scope.getAttachCount = getAttachCount;
    function getAttachCount() {
        if (hasBiz() && biz().objattachs && biz().objattachs.length > 0)
            return biz().objattachs.length;

        return 0;
    }

    /**
     * 选择操作方（即客户）
     */
    $scope.chooseCustomer = chooseCustomer;
    function chooseCustomer () {
		return BasemanService
			.chooseCustomer({
				scope: $scope
			})
			.then(function (customer) {
				/* 字段列表 */ [
					'customer_id',
					'customer_code',
					'customer_name',
					'dept_id',
					'dept_code',
					'dept_name'
				]
					.forEach(function (key) {
						//带出指定字段
						biz()[key] = customer[key];
					});
			})
		;
    }

    /**
     * 选择操作方
     */
    /*$scope.chooseOperator = chooseOperator;
    function chooseOperator() {
        BasemanService.chooseCustomer({
            scope: $scope,
            then: function (data) {
                biz().operator_id = data.customer_id;
                biz().operator_code = data.customer_code;
                biz().operator = data.customer_name;
            }
        });
    }*/

    /**
     * 选择归属方
     */
    $scope.chooseSaleCenter = chooseSaleCenter;
    function chooseSaleCenter() {
		return BasemanService
			.chooseSaleCenter({
				title: '选择归属方',
				scope: $scope
			})
			.then(function (saleCenter) {
				angular
					.forEach({
						dept_id: 'sale_center',
						short_name: 'sale_center_code',
						dept_name: 'sale_center_name'
					}, function (saleCenterKey, deptKey) {
						biz()[saleCenterKey] = saleCenter[deptKey];
					});
			})
		;
    }

    /**
     * 选择项目所属销售中心
     */
    $scope.chooseProjectSaleCenter = chooseProjectSaleCenter;
    function chooseProjectSaleCenter() {
        return BasemanService
            .chooseSaleCenter({
                title: '选择项目所属销售中心',
                scope: $scope,
                sqlWhere: "short_name <> 'ZY'" //不需出现【专业照明销售中心】
            })
            .then(function (data) {
                biz().project_sale_center = data.dept_id;
                biz().project_sale_center_name = data.dept_name;
            });
    }

    /**
     * 选择申请人
     */
    $scope.chooseProposer = chooseProposer;
    function chooseProposer () {
        BasemanService.chooseUser({
            title: '选择申请人',
            scope: $scope,
            then: function (data) {
                biz().proposer = data.employee_code;
                biz().proposer_phone = data.mobil;
            }
        });
    }

    /**
     * 选择项目跟进人
     */
    $scope.chooseManager = chooseManager;
    function chooseManager () {
        BasemanService.chooseUser({
            title: '选择项目跟进人',
            scope: $scope,
            then: function (data) {
                biz().manager = data.employee_code;
                biz().manager_phone = data.mobil;
            }
        });
    }

    /**
     * 选择城市
     */
    $scope.chooseCity = chooseCity;
    function chooseCity() {
        BasemanService.chooseCity({
            scope: $scope,
            then: function (data) {
                biz().city_id = data.areaid;
                biz().city = data.areaname_full;
            }
        });
    }

    /**
     * 计算灯具预计采购总量
     */
    $scope.calAmountPlan = calAmountPlan;
    function calAmountPlan() {
        var a = parseFloat(biz().in_amt);
        var b = parseFloat(biz().out_amt);
        if (a !== a) a = 0;
        if (b !== b) b = 0;
        biz().amount_plan = a + b;
    }

    $scope.searchLikeness = searchLikeness;

    /**
     * 相似性搜索
     */
    function searchLikeness() {
        return BasemanService
            .chooseProject({
                scope: $scope,
                sqlBlock: "project_name = '"
                    + biz().project_name
                    + "' and dev_unit_name = '"
                    + biz().dev_unit_name
                    + "' and project_id <> "
                    + Magic.toNum(biz().project_id)
            });
    }

    /**
     * 表格按钮
     * @returns {string}
     */
    function gridButtons (/*row, cell, value, columnDef, dataContext*/) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>编辑</button>" +
            "<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    }

    /**
     * 产品表格的列
     * @type {Array}
     */
    $scope.productColumns = [{
        field: 'seq',
        name: '序号',
        width: 48
    }, {
        name: '操作',
        formatter: gridButtons,
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
    $scope.productOptions = {
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
    $scope.productGrid = new Slick.Grid("#productGrid", [], $scope.productColumns, $scope.productOptions);

    /**
     * 产品表格单击事件
     * @param e 事件
     * @param args 参数
     */
    function productGridClick(e, args) {
        var target = $(e.target);
        if (target.hasClass("viewbtn")) {
            editProduct(args.row);
        }
        else if (target.hasClass("delbtn")) {
            deleteProduct(args.row);
        }
    }

    /**
     * 产品表格双击事件
     * @param e 事件
     * @param args 参数
     */
    function productGridDblClick(e, args) {
        editProduct(args.row);
    }

    //产品表格绑定点击事件
    $scope.productGrid.onClick.subscribe(productGridClick);
    $scope.productGrid.onDblClick.subscribe(productGridDblClick);

    /**
     * 相似检索按钮的可见性
     */
    $scope.data.visibleOfLikenessButton = userbean.hasRole('工程相似性检索', true);

    /**
     * 词汇池
     */
    $scope.dictPool = {
        'stat': {}, //状态
        'project_type': {}, //项目类型
        'project_period': {}, //项目阶段
        'sale_center': {}, //销售中心
        'crm_project.model': {}, //采购模式
        'crm_project.soure_amt': {} //预采金额来源
    };

    /**
     * 加载词汇
     */
    angular.forEach($scope.dictPool, function (dictOption, dictCode) {
        BasemanService.RequestPostAjax('base_search', 'searchdict', {dictcode: dictCode})
            .then(function (dictHead) {
                if (!dictOption.isStr) {
                    dictHead.dicts.forEach(function (dict) {
                        dict.value = parseInt(dict.value);
                    });
                }

                $scope.dictPool[dictCode] = dictHead.dicts;
            });
    });

    /**
     * 当前业务对象
     */
    $scope.biz = {};

    /**
     * 当前业务对象
     * @returns
     */
    function biz () {
        return $scope.biz;
    }

    biz()[getIdField()] = $stateParams.id;

    loadWfTempList();

    /**
     * 查询项目跟进进度说明
     */
    BasemanService.RequestPostAjax(getClassId(), 'select_process_note', {})
        .then(function (data) {
            data.crm_project_process_notes.forEach(function (e) {
                e.note = e.name + (e.note ? ('：' + e.note) : '');
            });

            $scope.dictPool['crm_project.complete_percent'] = data.crm_project_process_notes;
        });

    //有ID的话
    if (hasId()) {
        refreshData(); //刷新
    }
    else {
        BasemanService.getUserQ().then(function (data) {
            setData({
                proposer: data.userid, //申请人
                proposer_phone: data.mobil, //申请人联系电话
                createtime: Magic.today(), //创建时间
                process_update_time: Magic.now() //进度更新时间
            });
        });
    }

    BasemanService.getPrintService($scope)

    // //附件上传下载
    // $scope.addFile = function () {
    //     BasemanService.setScope($scope)
    //     BasemanService.addFile()
    //
    // }
    //
    // $scope.deleteFile =function (doc) {
    //     BasemanService.deleteFile(doc,$scope)
    // }
    //
    //
    // $scope.downloadAttFile =function (doc) {
    //     BasemanService.downloadAttFile(doc)
    // }

});