/**
 * 工程项目(详情页)
 * @since 2018-07-14
 */
HczyCommon.mainModule().controller('proj', function ($scope, $stateParams, $q, $modal, BasemanService, Magic, AgGridService, BillService, FormValidatorService, ProjService) {

    console.log('控制器开始：proj');
    console.log('$scope = ');
    console.log($scope);

    $scope.userbean = userbean;

    /* ==============================数据定义 - 开始============================== */
    $scope.data = {
        currItem: {
            project_id: 0,
            proj_attachs: []
        },
        ngOptions: {}, //下拉值
        ngChange: {
            //室内预采金额
            in_amt: function () {
                currItem().amount_plan = Magic.toNum(currItem().in_amt) + Magic.toNum(currItem().out_amt);
            },
            //户外预采金额
            out_amt: function () {
                currItem().amount_plan = Magic.toNum(currItem().in_amt) + Magic.toNum(currItem().out_amt);
            }
        }/*,
        editable: {
            //所属方
            sale_center_name: function () {
                return currItem().stat < 5 && userbean.hasRole('project_audit');
            },
            //工程名称
            project_name: function () {
                return currItem().stat <= 1;
            },
            //工程相似性检索
            project_name_likeness: function () {
                return userbean.hasRole('project_audit');
            },
            //项目类型
            project_type: function () {
                return currItem().stat <= 1;
            },
            //工程地址
            project_address: function () {
                return currItem().stat <= 1;
            },
            //经销商
            dealer_name: function () {
                return currItem().stat <= 1;
            }
        }*/
    };

    /**
     * 当前业务对象
     * @return {Object}
     */
    function currItem() {
        return $scope.data.currItem;
    }

    $scope.editable = editable;

    function editable(field) {
        var result = (currItem().stat <= 1) || (currItem().stat == 3 && currItem().wfright > 1);

        if (['project_name', 'project_type', 'project_address', 'dealer_name'].indexOf(field) >= 0)
            result = result && (currItem().stat < 5);

        else if (field === 'sale_center_name')
            result = (result && userbean.hasRole('project_audit')) || (currItem().stat == 5 && userbean.hasRole('proj_adjust'));

        //本地/异地
        else if (field === 'remote')
            result = result;

        else
            result = result || (currItem().stat == 5);

        //本地/异地，销售中心只能报异地项目
        if (field === 'remote')
            result = result && (currItem().dept_type != 5);

        //报备方所在城市，非运营中心才可选
        if (field === 'apply_city_name')
            result = result && (currItem().dept_type != 6);

        //工程所在运营区域，异地项目才可选
        if (field === 'proj_city_name')
            result = result && (currItem().remote == 2);

        return result;
    }

    /* ==============================加载词汇 - 开始============================== */
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

    angular.forEach({
        'stat': {}, //状态
        'project_type': {}, //项目类型
        'project_period': {}, //项目阶段
        'model': {
            dictCode: 'crm_project.model'
        }, //采购模式
        'soure_amt': {
            dictCode: 'crm_project.soure_amt'
        }, //预采金额来源
        'remote': {
            dictCode: 'project.remote'
        }, //本地/异地
        'dealer_type': {
            dictCode: 'project.dealer_type'
        },
        'qgd_form': {
            dictCode: 'crm_project.qgd_form'
        } //质保金形式
    }, function (params, field) {
        if (!params.dictCode)
            params.dictCode = field;

        $q
            .when(params.dictCode)
            .then(rqDict)
            .then(function (response) {
                $scope.data.ngOptions[field] = response.dicts.map(function (e) {
                    return {
                        'value': params.isStr ? e.dictvalue : parseInt(e.dictvalue),
                        'name': e.dictname
                    };
                });
            });
    });

    BasemanService
        .RequestPost('crm_project', 'select_process_note', {})
        .then(function (response) {
            $scope.data.ngOptions.stage_value = response.crm_project_process_notes.map(function (e) {
                return {
                    'value': Magic.toNum(e.value),
                    'name': e.name + '：' + e.note
                };
            });
        });
    /* ==============================加载词汇 - 结束============================== */

    /* ==============================数据定义 - 结束============================== */

    /* ==============================进度表格 - 开始============================== */
    var stageGridColumnDefs = [{
        type: '序号'
    }, {
        field: 'stage_name',
        headerName: '名称',
        width: 60
    }, {
        field: 'stage_note',
        headerName: '备注',
        width: 200
    }, {
        field: 'stage_desc',
        headerName: '描述',
        width: 200
    }, {
        field: 'creator',
        headerName: '创建人',
        width: 80
    }, {
        field: 'createtime',
        headerName: '创建时间',
        type: '时间'
    }, {
        field: 'updator',
        headerName: '修改人',
        width: 80
    }, {
        field: 'updatetime',
        headerName: '修改时间',
        type: '时间'
    }];

    var stageGridOptions = {
        columnDefs: stageGridColumnDefs,
        getRowStyle: function (params) {
            if (params.node.rowIndex === 0) {
                return {
                    'color': 'red', //字体红色
                    'font-weight': 'bold' //字体加粗
                };
            }

            return null;
        }
    };

    AgGridService.createAgGrid('grid_stage', stageGridOptions);
    /* ==============================进度表格 - 结束============================== */

    /* ==============================付款信息表格 - 开始============================== */
    var fundGridColumnDefs = [{
        type: '序号'
    }, {
        field: 'fund_stage',
        headerName: '款项阶段',
        hcDictCode: 'crm_project.fund_stage',
        width: 144,
        editable: false
    }, {
        field: 'fund_form',
        headerName: '付款形式',
        hcDictCode: 'crm_project.fund_form',
        width: 88
    }, {
        field: 'fund_rate',
        headerName: '比例(%)',
        width: 80,
        type: '百分比',
        onCellValueChanged: function (params) {
            console.log('onCellValueChanged: fund_rate');
            console.log(params);

            if (params.newValue === params.oldValue)
                return;

            params.data.fund_amt = Magic.toNum(currItem().compact_amt) * Magic.toNum(params.newValue) / 100;

            fundGridOptions.api.refreshRows([params.node]);
        }
    }, {
        field: 'fund_amt',
        headerName: '金额(万元)',
        width: 96,
        type: '万元',
        editable: false
    }, {
        field: 'fund_plan_date',
        headerName: '预计到款时间',
        width: 115,
        type: '日期'
    }, {
        field: 'fund_act_date',
        headerName: '实际到款时间',
        width: 115,
        type: '日期'
    }, {
        field: 'note',
        headerName: '备注',
        width: 240,
        type: '大文本'
    }];

    var fundGridOptions = {
        suppressColumnVirtualisation: true, //表格不可见时，大部分效果不会渲染，必须关闭虚拟列技术，使其渲染所有列。但在数据较多时不建议这么做，会影响性能
        defaultColDef: {
            editable: function (params) {
                return editable('proj_fund');
            }
        },
        columnDefs: fundGridColumnDefs
    };

    AgGridService.createAgGrid('grid_fund', fundGridOptions);

    $scope.needFund = needFund;

    /**
     * 需要付款信息
     * @return {boolean}
     */
    function needFund() {
        return currItem().stage_value >= 5 //项目已到达阶段【阶段5：中标或达到购买协议，合同签约付定金。】
            && currItem().sale_center_code === 'KA' //且【归属方】仅为【KA】
            ;
    }

    $scope.qgdAmtVisible = qgdAmtVisible;

    /**
     * 【质保金金额】的可见性
     * @return {boolean}
     */
    function qgdAmtVisible() {
        return [1, 2].indexOf(currItem().qgd_form) >= 0;
    }

    $scope.qgdRateVisible = qgdRateVisible;

    /**
     * 【质保金比例】的可见性
     * @return {boolean}
     */
    function qgdRateVisible() {
        return [3].indexOf(currItem().qgd_form) >= 0;
    }

    /**
     * 当【合同总额】改变时
     */
    $scope.onCompactAmtChange = onCompactAmtChange;

    function onCompactAmtChange() {
        fundGridOptions.api.getModel().forEachNode(function (node) {
            var data = node.data;
            data.fund_amt = Magic.toNum(currItem().compact_amt) * Magic.toNum(data.fund_rate) / 100;
        });

        fundGridOptions.api.refreshView();
    }

    $scope.onFundRateChange = onFundRateChange;

    /**
     * 当【付款比例】改变时
     */
    function onFundRateChange() {
        fund().fund_amt = Magic.toNum(currItem().compact_amt) * Magic.toNum(fund().fund_rate) / 100;
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
                    var result = fundGridColumnDefs.reduce(function (result, colDef) {
                        if (colDef.field)
                            result[colDef.field] = '';

                        return result;
                    }, {});

                    result.fund_stage =  dict.dictvalue;

                    return result;
                });
        });
    /* ==============================付款信息表格 - 结束============================== */

    /* ==============================附件表格 - 开始============================== */
    var attachGridColumnDefs = [{
        type: '序号'
    }, {
        field: 'docname',
        headerName: '附件名称',
        width: 300
    }];

    var attachGridOptions = {
        columnDefs: attachGridColumnDefs,
        hcEvents: {
            cellDoubleClicked: function (params) {
                console.log('cellDoubleClicked', params.colDef.field, params);

                var lowerDocName = params.data.docname.toLowerCase();

                var isPicture = ['.jpg', '.jpeg', '.png', '.bmp'].some(function (suffix) {
                    return lowerDocName.endsWith(suffix);
                });

                if (isPicture)
                    btnViewAttachClick();
                else
                    btnDownloadAttachClick();
            }
        }
    };

    AgGridService.createAgGrid('grid_attach', attachGridOptions);

    $scope.btnUploadAttachClick = btnUploadAttachClick;

    /**
     * 上传附件
     */
    function btnUploadAttachClick () {
        return $q.when()
            .then(Magic.uploadFile)
            .then(function (response) {
                Array.prototype.push.apply(currItem().proj_attachs, response.data);
                attachGridOptions.hcApi.setRowData(currItem().proj_attachs);
            });
    }

    $scope.btnDownloadAttachClick = btnDownloadAttachClick;

    /**
     * 下载附件
     */
    function btnDownloadAttachClick () {
        var doc = attachGridOptions.hcApi.getFocusedData();
        if (!doc) {
            Magic.swalInfo('请先选中要下载的附件')
            return;
        }

        window.open('/downloadfile.do?docid=' + doc.docid);
    }

    $scope.btnViewAttachClick = btnViewAttachClick;

    /**
     * 查看附件
     */
    function btnViewAttachClick () {
        var doc = attachGridOptions.hcApi.getFocusedData();
        if (!doc) {
            Magic.swalInfo('请先选中要查看的附件')
            return;
        }

        window.open('/viewImage.jsp?filecode=' + doc.downloadcode + '&filename=' + doc.docname);
    }

    $scope.btnDeleteAttachClick = btnDeleteAttachClick;

    /**
     * 删除附件
     */
    function btnDeleteAttachClick () {
        var node = attachGridOptions.hcApi.getFocusedNode();
        if (!node) {
            Magic.swalInfo('请先选中要删除的附件')
            return;
        }

        return Magic
            .swalConfirmThenSuccess({
                title: '确定要删除附件【' + node.data.docname + '】吗？',
                okTitle: '成功删除',
                okFun: function () {
                    currItem().proj_attachs.splice(node.rowIndex, 1);
                    attachGridOptions.hcApi.setRowData(currItem().proj_attachs);
                }
            });
    }
    /* ==============================附件信息表格 - 结束============================== */

    /* ==============================变更单表格 - 开始============================== */
    /*var ecnGridColumnDefs = [{
        type: '序号'
    }, {
        field: 'proj_ecn_id',
        headerName: 'ID',
        width: 80
    }, {
        field: 'creator',
        headerName: '创建人',
        width: 80
    }, {
        field: 'createtime',
        headerName: '创建时间',
        type: '时间'
    }, {
        field: 'updator',
        headerName: '修改人',
        width: 80
    }, {
        field: 'updatetime',
        headerName: '修改时间',
        type: '时间'
    }];

    var ecnGridOptions = {
        columnDefs: ecnGridColumnDefs,
        hcEvents: {
            cellDoubleClicked: function (params) {
                console.log('cellDoubleClicked: ' + params.column.colDef.field);

                $('#iframe_ecn').attr('src', '/index.jsp#/saleman/proj_ecn/' + params.data.proj_ecn_id);
                $('#modal_ecn').modal('show');
            }
        }
    };

    AgGridService.createAgGrid('grid_ecn', ecnGridOptions);*/
    /* ==============================变更单表格 - 结束============================== */

    $scope.filterStage = filterStage;

    /**
     * 过滤进度下拉值
     * @param e
     * @return {boolean}
     */
    function filterStage(e) {
        if (currItem().stat == 5 && Magic.isNotEmptyArray(currItem().proj_stages)) {
            return Magic.toNum(e.value) >= Magic.toNum(currItem().proj_stages[0].stage_value);
        }

        return true;
    }

    $scope.filterDealerType = filterDealerType;

    /**
     * 过滤经销商类型
     * @param e
     * @return {boolean}
     */
    function filterDealerType(e) {
        //对于运营中心，只出现【自营工程】【渠道经销商】的选项。#715
        if (currItem().dept_type == 6)
            return e.value <= 2;

        return true;
    }

    /* ==============================按钮方法 - 开始============================== */

    $scope.whenStageValueChange = whenStageValueChange;

    /**
     * 当进度改变时
     */
    function whenStageValueChange() {
        //切换进度后，清空描述，让用户重新填写
        if (currItem().stat == 5)
            currItem().stage_desc = '';
    }

    $scope.whenRemoteChange = whenRemoteChange;

    /**
     * 当 本地/异地 改变时
     */
    function whenRemoteChange() {
        //若是本地项目，把报备方城市赋值给工程所在运营区域
        if (currItem().remote == 1) {
            Magic.assignProperty(currItem(), currItem(), {
                'apply_city_id': 'proj_city_id',
                'apply_city_name': 'proj_city_name'
            });
        }
    }

    $scope.btnSaveClick = btnSaveClick;

    /**
     * 点击保存按钮
     */
    function btnSaveClick() {
        return saveData();
    }

    /**
     * 保存数据
     * @return {Promise}
     */
    function saveData() {
        return $q
            .when()
            .then(checkData)
            .then(function () {
                Magic.swalInfo({
                    title: '保存中...',
                    closeOnConfirm: false
                });
            })
            .then(requestSave)
            .catch(Magic.defaultCatch)
            .then(setData)
            .then(function () {
                return Magic.swalSuccess('保存成功');
            })
        ;
    }

    /**
     * 校验数据
     * @return {Promise}
     */
    function checkData() {
        return $q
            .when({
                parent: '#form_head'
            })
            .then(function () {
                var selector = $('#form_head').find(':text,select,textarea');
                if (!needFund()) selector = selector.filter(':not(#fs_fund *)');

                return {
                    selector: selector
                };
            })
            .then(FormValidatorService.noEmptyCheck)
            .then(function () {
                //异地项目
                if (currItem().remote == 2) {
                    //必须上传附件
                    if (!currItem().proj_attachs.length) {
                        return Magic
                            .swalError('异地项目必须上传图片')
                            .then($q.reject);
                    }
                }
            })
            .then(function () {
                if (needFund()) {
                    var qgdRate;
                    if (qgdRateVisible()) {
                        qgdRate = Magic.toNum(currItem().qgd_rate);
                        if (qgdRate > 20) {
                            return Magic
                                .swalError('质保金比例不能超过20%')
                                .then($q.reject);
                        }
                    }
                    else
                        qgdRate = 0;

                    //计算付款比例之和
                    var rate = currItem().proj_funds.reduce(function (result, rowData) {
                        return result + Magic.toNum(rowData.fund_rate);
                    }, qgdRate);

                    //付款比例之和必须=100%
                    if (rate !== 100) {
                        return Magic
                            .swalError({
                                title: [
                                    '当前付款比例之和=' + rate + '%，不满足以下条件，请修改：',
                                    '预付款比例+到货款项比例+产品验收合格款项比例+项目验收合格款项比例+质保金货款比例=100%'
                                ]
                            })
                            .then($q.reject);
                    }
                }
            });
    }

    /**
     * 保存请求
     * @return {Promise}
     */
    function requestSave() {
        return BasemanService.RequestPost('proj', 'save', JSON.stringify(currItem()));
    }

    /**
     * 设置数据
     * @param data
     */
    function setData(data) {
        $scope.data.currItem = data;

        //进度
        stageGridOptions.api.setRowData(data.proj_stages);

        //附件
        attachGridOptions.hcApi.setRowData(data.proj_attachs);

        //付款信息
        fundStages
            .then(angular.copy)
            .then(function (proj_funds) {
                if (data.proj_funds.length) {
                    proj_funds.forEach(function (a, i) {
                        var c = data.proj_funds.find(function (b) {
                            return a.fund_stage == b.fund_stage;
                        });

                        if (c) proj_funds[i] = c;
                    });
                }

                data.proj_funds = proj_funds;
                fundGridOptions.api.setRowData(proj_funds);
            });
        //ecnGridOptions.api.setRowData(data.proj_ecns);
    }

    /**
     * 点击关闭按钮
     */
    $scope.btnCloseClick = BillService.closeWindow;

    $scope.chooseSaleCenter = chooseSaleCenter;

    /**
     * 选择销售中心
     * @return {Promise}
     */
    function chooseSaleCenter() {
        return BasemanService
            .chooseSaleCenter({
                scope: $scope,
                checkBox: true
            })
            .then(function (saleCenters) {
                if (saleCenters.length > 2) {
                    return Magic.swalError('所属方不能超过2个').then($q.reject);
                }

                var result = {};

                ['dept_id', 'dept_name', 'short_name'].forEach(function (key) {
                    result[key] = saleCenters.reduce(function (prev, curr, index) {
                        if (index === 0)
                            return curr[key];

                        return prev + ',' + curr[key];
                    }, '');
                });

                Magic.assignProperty(result, currItem(), {
                    'dept_id': 'sale_center_id',
                    'dept_name': 'sale_center_name',
                    'short_name': 'sale_center_code'
                });
            })
        ;
    }

    $scope.projLikeness = projLikeness;

    /**
     * 相似性检索
     * @return {Promise}
     */
    function projLikeness() {
        return ProjService.projLikeness({
            scope: $scope,
            project_id: currItem().project_id
        });

        /*$scope.FrmInfo = {
            title: '相似性检索',
            thead: [{
                name: '编码',
                code: 'project_code'
            }, {
                name: '名称',
                code: 'project_name'
            }, {
                name: '单据状态',
                code: 'stat',
                type: 'list',
                dicts: [{
                    value: '1',
                    desc: '制单'
                }, {
                    value: '3',
                    desc: '流程中'
                }, {
                    value: '5',
                    desc: '已审核'
                }]
            }, {
                name: '项目开发方',
                code: 'dev_unit_name'
            }, {
                name: '工程地址',
                code: 'project_address'
            }],
            classid: 'proj',
            postdata: {
                searchflag: 2,
                project_id: currItem().project_id
            },
            searchlist: ['project_code', 'project_name', 'project_address', 'dev_unit_name']
        };

        return BasemanService.open(CommonPopController, $scope).result;*/
    }

    $scope.chooseProjCity = chooseProjCity;

    /**
     * 选择工程城市
     * @return {Promise}
     */
    function chooseProjCity() {
        /*return .BasemanService
            chooseArea({
                scope: $scope,
                sqlWhere: '(areatype = 2 or areaid in (select areaid from scporg where orgtype = 6))'
            })*/

        $scope.FrmInfo = {
            title: '选择工程所在运营区域',
            thead: [{
                name: '名称',
                code: 'areaname'
            }, {
                name: '区号',
                code: 'telzone'
            }, {
                name: '运营中心',
                code: 'orgname'
            }],
            classid: 'scparea',
            postdata: {
                search_flag: 2
            },
            searchlist: ['areaname', 'areaname_full', 'telzone', 'orgname']
        };

        $scope.isSetPage = true; //打开设置分页开关
        $scope.pageS = 50; //重新设置分页

        return BasemanService
            .open(CommonPopController, $scope)
            .result
            .then(function (city) {
                Magic.assignProperty(city, currItem(), {
                    'areaid': 'proj_city_id',
                    'areaname': 'proj_city_name'
                });
            })
            .finally(function () {
                $scope.isSetPage = false; //关闭设置分页开关
            })
        ;
    }

    $scope.chooseApplyCity = chooseApplyCity;

    /**
     * 选择报备方所在城市
     * @return {Promise}
     */
    function chooseApplyCity() {
        return BasemanService
            .chooseCity({
                scope: $scope
            })
            .then(function (city) {
                Magic.assignProperty(city, currItem(), {
                    'areaid': 'apply_city_id',
                    'areaname': 'apply_city_name'
                });

                //本地项目的话，同时赋值
                if (currItem().remote == 1) {
                    Magic.assignProperty(city, currItem(), {
                        'areaid': 'proj_city_id',
                        'areaname': 'proj_city_name'
                    });
                }
            })
        ;
    }

    $scope.chooseMainProduct = chooseMainProduct;

    /**
     * 选择主要预采产品品类
     * @return {Promise}
     */
    function chooseMainProduct() {
        var prods;
        if (currItem().main_product)
            prods = Magic.commonSplit(currItem().main_product);
        else
            prods = [];

        $scope.data.prods = prods.reduce(function (result, prod) {
            result[prod] = false;
            return result;
        }, {});

        $scope.data.ppkds.forEach(function (ppkd) {
            ppkd.ppds.forEach(function (ppd) {
                ppd.checked = ppd.pp_name in $scope.data.prods;
                if (ppd.checked)
                    $scope.data.prods[ppd.pp_name] = true;
            });
        });

        modalMainProduct().modal('show');
    }

    $scope.chooseMainProductOK = chooseMainProductOK;

    /**
     * 主要预采产品品类选择完毕
     * @return {Promise}
     */
    function chooseMainProductOK() {
        modalMainProduct().modal('hide');

        currItem().main_product = $scope.data.ppkds.reduce(function (result, ppkd) {
            return ppkd.ppds
                .filter(function (ppd) {
                    return ppd.checked;
                })
                .reduce(function (result, ppd) {
                    if (result)
                        return result + '、' + ppd.pp_name;

                    return ppd.pp_name;
                }, result);
        }, '');

        angular.forEach($scope.data.prods, function (value, key) {
            if (value)
                return;

            if (currItem().main_product)
                currItem().main_product += '、';

            currItem().main_product += key;
        });
    }

    /**
     * 选择主要预采产品品类的模态窗口
     * @return {jQuery}
     */
    function modalMainProduct() {
        return $('#modal_main_product');
    }

    //获取主要预采产品品类定义
    BasemanService
        .RequestPost('proj', 'get_proj_prod_def', {})
        .then(function (response) {
            $scope.data.ppkds = response.ppkds;
        })
    ;

    /* ==============================按钮方法 - 结束============================== */

    /**
     * 刷新
     * @return {Promise}
     */
    function refreshData() {
        return BasemanService
            .RequestPost('proj', 'select', {
                project_id: currItem().project_id
            })
            .then(setData);
    }

    /* ==============================初始化 - 开始============================== */
    /**
     * 初始化
     */
    function doInit() {
        var id = Magic.toNum($stateParams.id);

        //修改
        if (id) {
            currItem().project_id = id;
            refreshData();
        }
        //新增
        else {
            BasemanService
                .getUserQ()
                .then(function (user) {
                    angular.extend(currItem(), {
                        creator: user.userid,
                        createtime: Magic.today(),
                        stat: 1
                    });

                    if (user.orgofusers.length) {
                        var org = user.orgofusers[0];
                        Magic.assignProperty(org, currItem(), {
                            orgid: 'dept_id',
                            orgname: 'dept_name',
                            code: 'dept_code',
                            orgtype: 'dept_type',
                            areaid: 'apply_city_id',
                            areacode: 'apply_city_code',
                            areaname: 'apply_city_name'
                        });

                        //销售中心只能报异地项目
                        if (currItem().dept_type == 5)
                            currItem().remote = 2;
                    }
                });
        }

        window.currScope = $scope; //暴露这个作用域，才能被流程窗口访问到
        $scope.selectCurrenItem = refreshData; //暴露这个方法给流程窗口进行调用刷新
    }

    doInit(); //初始化
    /* ==============================初始化 - 结束============================== */

    console.log('控制器结束：proj');

});