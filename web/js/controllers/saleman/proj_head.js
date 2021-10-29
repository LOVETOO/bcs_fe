/**
 * 工程项目(浏览页)
 * @since 2018-07-14
 */
HczyCommon.mainModule().controller('proj_head', function ($scope, $q, $timeout, Magic, BasemanService, AgGridService) {
    console.log('控制器开始：proj_head');
    console.log('$scope = ');
    console.log($scope);

    $scope.userbean = userbean;

    /* ==============================头部表格列定义 - 开始============================== */
    /**
     * 头部表格列定义
     * @type {Object[]}
     */
    var headerGridColumns = [
        {
            type: '序号'
        },
        {
            field: 'project_code',
            headerName: '工程编码',
            pinned: 'left'
        },
        {
            field: 'project_name',
            headerName: '工程项目名称(加开发方)',
            pinned: 'left'
        },
        {
            field: 'stage_name',
            headerName: '跟进进度'
        },
        {
            field: 'stage_note',
            headerName: '跟进进度备注'
        },
        {
            field: 'stage_desc',
            headerName: '跟进进度描述'
        },
        {
            field: 'dealer_name',
            headerName: '经销商'
        },
        {
            field: 'dealer_type',
            headerName: '经销商类型',
            hcDictCode: 'project.dealer_type'
        },
        {
            field: 'dept_name',
            headerName: '运营中心/申请机构'
        },
        {
            field: 'sale_center_name',
            headerName: '归属方'
        },
        {
            field: 'proj_city_name',
            headerName: '工程所在运营区域'
        },
        {
            field: 'apply_city_name',
            headerName: '报备方城市'
        },
        {
            field: 'createtime',
            headerName: '申请时间',
            type: '时间'
        },
        {
            field: 'creator',
            headerName: '申请人'
        },
        {
            field: 'stat',
            headerName: '单据状态',
            hcDictCode: '*'
        },
        {
            field: 'remote',
            headerName: '本地/异地',
            hcDictCode: 'project.remote'
        },
        {
            field: 'project_type',
            headerName: '项目类型',
            hcDictCode: '*'
        },
        {
            field: 'project_period',
            headerName: '项目阶段',
            hcDictCode: '*'
        },
        {
            field: 'project_address',
            headerName: '工程地址'
        },
        {
            field: 'dealer_manager',
            headerName: '项目跟进人'
        },
        {
            field: 'dealer_tel',
            headerName: '联系电话'
        },
        {
            field: 'hq_manager',
            headerName: '雷士跟进人'
        },
        {
            field: 'hq_tel',
            headerName: '联系电话'
        },
        {
            field: 'oc_manager',
            headerName: '运营中心跟进人'
        },
        {
            field: 'oc_tel',
            headerName: '联系电话'
        },
        {
            field: 'dev_unit_name',
            headerName: '项目开发方'
        },
        {
            field: 'dev_unit_man',
            headerName: '联系人'
        },
        {
            field: 'dev_unit_phone',
            headerName: '联系电话'
        },
        {
            field: 'des_unit_name',
            headerName: '内装设计方'
        },
        {
            field: 'des_unit_man',
            headerName: '联系人'
        },
        {
            field: 'des_unit_phone',
            headerName: '联系电话'
        },
        {
            field: 'con_unit_name',
            headerName: '内装总包/分包方'
        },
        {
            field: 'con_unit_man',
            headerName: '联系人'
        },
        {
            field: 'con_unit_phone',
            headerName: '联系电话'
        },
        {
            field: 'setup_date',
            headerName: '立项日期',
            type: '日期'
        },
        {
            field: 'sample_date',
            headerName: '送样日期',
            type: '日期'
        },
        {
            field: 'bid_date',
            headerName: '投标日期',
            type: '日期'
        },
        {
            field: 'contract_date',
            headerName: '签约日期',
            type: '日期'
        },
        {
            field: 'supply_date',
            headerName: '首次供货日期',
            type: '日期'
        },
        {
            field: 'accept_date',
            headerName: '验收日期',
            type: '日期'
        },
        {
            field: 'cpt_brand',
            headerName: '竞品品牌'
        },
        {
            field: 'cpt_product',
            headerName: '竞品产品'
        },
        {
            field: 'sourcing_date',
            headerName: '预采日期',
            type: '日期'
        },
        {
            field: 'main_product',
            headerName: '主要预采产品品类',
            type: '日期'
        },
        {
            field: 'model',
            headerName: '采购模式',
            hcDictCode: 'crm_project.model'
        },
        {
            field: 'amount_plan',
            headerName: '合计预采总额(万元)',
            type: '万元'
        },
        {
            field: 'in_amt',
            headerName: '室内预采金额(万元)',
            type: '万元'
        },
        {
            field: 'out_amt',
            headerName: '户外预采金额(万元)',
            type: '万元'
        }
    ];
    /* ==============================头部表格列定义 - 结束============================== */

    /* ==============================头部表格选项 - 开始============================== */
    /**
     * 头部表格选项
     * @type {Object}
     */
    var headerGridOptions = {
        columnDefs: headerGridColumns,
        //右键菜单
        getContextMenuItems: function (params) {
            var items = headerGridOptions.hcDefaultOptions.getContextMenuItems(params);

            items.push('separator');

            items.push({
                icon: '<i class="fa fa-edit"></i>',
                name: '查看详情',
                action: $scope.editData
            });

            if (params.node.data.stat <= 1)
                items.push({
                    icon: '<i class="fa fa-trash">',
                    name: '删除',
                    action: $scope.deleteData
                });

            items.push('separator');

            items.push({
                name: '发起变更审核',
                action: $scope.btnEcnClick
            }, {
                name: '变更审核记录',
                action: $scope.btnEcnHClick
            });

            return items;
        },
        hcEvents: {
            //双击事件
            cellDoubleClicked: function (params) {
                console.log('cellDoubleClicked：' + params.colDef.field);
                console.log(params);

                if (!params.colDef.onCellDoubleClicked)
                    showDetail(params.data.project_id);
            }
        }
    };
    /* ==============================头部表格选项 - 结束============================== */

    /* ==============================变更表格列定义 - 开始============================== */
    /**
     * 变更表格列定义
     * @type {Object[]}
     */
    var ecnGridColumns = [
        {
            type: '序号'
        },
        {
            field: 'stat',
            headerName: '单据状态',
            hcDictCode: '*',
            width: 90
        },
        {
            field: 'creator',
            headerName: '创建人',
            width: 80
        },
        {
            field: 'createtime',
            headerName: '创建时间',
            type: '时间'
        },
        {
            field: 'audittime',
            headerName: '审核时间',
            type: '时间'
        }
    ];
    /* ==============================变更表格列定义 - 结束============================== */

    /* ==============================变更表格选项 - 开始============================== */
    /**
     * 变更表格选项
     * @type {Object}
     */
    var ecnGridOptions = {
        columnDefs: ecnGridColumns,
        hcEvents: {
            //双击事件
            cellDoubleClicked: function (params) {
                console.log('cellDoubleClicked：' + params.colDef.field);
                console.log(params);

                if (!params.colDef.onCellDoubleClicked) {
                    return showEcnDetail(params.data.proj_ecn_id);
                }
            }
        }
    };
    /* ==============================变更表格选项 - 结束============================== */

    /* ==============================按钮方法 - 开始============================== */
    $scope.searchData = searchData;

    /**
     * 搜索
     * @param postData
     * @return {*}
     */
    function searchData(postData) {
        postData = postData || {};

        postData.searchflag = 1;

        if (!postData.sqlwhere)
            postData.sqlwhere = $scope.sqlwhere;

        if (!postData.pagination) {
            $scope.oldPage = 1;
            $scope.currentPage = 1;
            if (!$scope.pageSize) $scope.pageSize = '20';
            $scope.totalCount = 1;
            $scope.pages = 1;
            postData.pagination = 'pn=1,ps=' + $scope.pageSize + ',pc=0,cn=0,ci=0';
        }

        return BasemanService
            .RequestPost('proj', 'search', postData)
            .then(function (response) {
                setHeadData(response.projs);
                BasemanService.pageInfoOp($scope, response.pagination);
            });
    }

    /**
     * 设置头部数据
     * @param {Object[]} headData
     */
    function setHeadData(headData) {
        headerGridOptions.api.setRowData(headData);
        headerGridOptions.columnApi.autoSizeAllColumns();
    }

    $scope.searchBySql = searchBySql;

    /**
     * 条件搜索
     */
    function searchBySql() {
        $scope.FrmInfo = {
            ignorecase: 'true', //忽略大小写
            is_high: true
        };

        $scope.FrmInfo.thead = headerGridColumns
            .slice(1)
            .map(function (column) {
                var result = {
                    name: column.headerName,
                    code: column.field
                };

                result.type = 'string';
                if (column.type === '词汇') {
                    result.type = 'list';
                    result.dicts = column.cellEditorParams.values.map(function (value, index) {
                        return {
                            value: value,
                            desc: column.cellEditorParams.names[index]
                        };
                    });
                }

                return result;
            });

        sessionStorage.setItem('frmInfo', JSON.stringify($scope.FrmInfo));

        return BasemanService
            .open(CommonPopController1, $scope)
            .result
            .then(function (sqlwhere) {
                $scope.sqlwhere = sqlwhere;
            })
            .then($scope.searchData);
    }

    $scope.editData = editData;

    /**
     * 查看
     * @return {Promise}
     */
    function editData() {
        var cell = headerGridOptions.api.getFocusedCell();
        var node;

        if (cell)
            node = headerGridOptions.api.getModel().getRow(cell.rowIndex);

        if (!node) {
            var msg = '请选中要查看的工程项目';
            Magic.swalInfo(msg);
            return $q.reject(msg);
        }


        var data = node.data;

        showDetail(data.project_id);
    }

    $scope.addData = addData;

    /**
     * 增加
     */
    function addData() {
        return showDetail(0);
    }

    $scope.deleteData = deleteData;

    /**
     * 删除
     * @return {Promise}
     */
    function deleteData() {
        var cell = headerGridOptions.api.getFocusedCell();

        var node;

        if (cell)
            node = headerGridOptions.api.getModel().getRow(cell.rowIndex);

        var msg;

        if (!node) {
            msg = '请选中要删除的工程项目';
            Magic.swalInfo(msg);
            return $q.reject(msg);
        }

        var data = node.data;

        var stat = Magic.toNum(data.stat);
        if (stat > 1) {
            msg = '工程项目【' + data.project_name + '】' + (stat === 5 ? '已审核' : '正在走工作流') + '，不能删除！';
            Magic.swalError(msg);
            return $q.reject(msg);
        }

        return Magic.swalConfirmThenSuccess({
            title: '确定要删除工程项目【' + data.project_name + '】吗？',
            okFun: function () {
                return BasemanService
                    .RequestPost('proj', 'delete', {
                        project_id: data.project_id
                    })
                    .then(function () {
                        headerGridOptions.api.removeItems([node]);
                    });
            },
            okTitle: '删除成功'
        });
    }

    $scope.btnEcnClick = function () {
        var cell = headerGridOptions.api.getFocusedCell();

        var node;

        if (cell)
            node = headerGridOptions.api.getModel().getRow(cell.rowIndex);

        var msg;

        if (!node) {
            msg = '请选中工程项目';
            Magic.swalInfo(msg);
            return $q.reject(msg);
        }

        var data = node.data;

        if (data.stat != 5) {
            msg = '该工程尚未审核，不能变更';
            Magic.swalError(msg);
            return $q.reject(msg);
        }

        return BasemanService
            .RequestPost('proj', 'select', {
                project_id: data.project_id
            })
            .then(function (response) {
                if (response.proj_ecns.filter(function (proj_ecn) {
                    return proj_ecn.stat < 5;
                }).length) {
                    msg = '该工程已存在未走完流程变更单，请点击按钮【变更审核记录】查看';
                    Magic.swalError(msg);
                    return $q.reject(msg);
                }

                $scope.proj = response;
            })
            .then(function () {
                return showEcnDetail(0);
            })
        ;
    };

    $scope.btnEcnHClick = function () {
        var cell = headerGridOptions.api.getFocusedCell();

        var node;

        if (cell)
            node = headerGridOptions.api.getModel().getRow(cell.rowIndex);

        var msg;

        if (!node) {
            msg = '请选中工程项目';
            Magic.swalInfo(msg);
            return $q.reject(msg);
        }

        var data = node.data;

        BasemanService
            .RequestPost('proj', 'select', {
                project_id: data.project_id
            })
            .then(function (response) {
                if (Magic.isNotEmptyArray(response.proj_ecns)) {
                    ecnGridOptions.api.setRowData(response.proj_ecns);
                    $('#modal_ecn').modal('show');
                }
                else {
                    Magic.swalInfo('该工程未进行过变更审核');
                }
            })
        ;
    };

    function showEcnDetail(id) {
        return BasemanService.openModal({
            url: '/index.jsp#/saleman/proj_ecn/' + id,
            title: '工程项目变更',
            obj: $scope
        });
    }
    /* ==============================按钮方法 - 结束============================== */

    function showDetail(id) {
        return BasemanService.openModal({
            url: '/index.jsp#/saleman/proj/' + id,
            title: '工程项目',
            obj: $scope,
            ondestroy: searchData
        });
    }

    /* ==============================初始化 - 开始============================== */
    /**
     * 初始化
     */
    function doInit() {
        IncRequestCount();
        DecRequestCount();

        //创建AgGrid
        AgGridService.createAgGrid('headerGrid', headerGridOptions);
        AgGridService.createAgGrid('grid_ecn', ecnGridOptions);

        //初始化网格高度
        BasemanService.initGird();

        //初始化分页
        $scope.pageSize = 100;
        BasemanService.pageGridInit($scope);

        headerGridOptions.hcReady.then(function () {
            headerGridOptions.columnApi.autoSizeAllColumns();
        });
    }

    doInit(); //初始化
    /* ==============================初始化 - 结束============================== */

    console.log('控制器结束：proj_head');

});