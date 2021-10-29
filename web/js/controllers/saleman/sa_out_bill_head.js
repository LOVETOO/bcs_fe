define(
    ['module', 'controllerApi', 'gridApi', 'requestApi'],
    function (module, controllerApi, gridApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal', 'BaseService', 'Magic', '$q',
            //控制器函数
            function ($scope, $modal, BaseService, Magic, $q) {
                $scope.data = {};
                $scope.data.currItem = {};

                //定义网格字段
                $scope.headerColumns = [
                    {
                        type: "序号"
                    },
                    {
                        id: "sa_salebillno",
                        name: "订单编号",
                        field: "sa_salebillno",
                        width: 120,
                        type: "string",
                        pinned: 'left'
                    }, {
                        id: "attribute1",
                        name: "ERP订单号",
                        field: "attribute1",
                        width: 90,
                        type: "string",
                        pinned: 'left'
                    }, {
                        id: "stat",
                        name: "流程状态",
                        field: "stat",
                        width: 80,
                        type: "list",
                        hcDictCode: "stat",
                        pinned: 'left'
                    }, {
                        id: "customer_code",
                        name: "客户编码",
                        field: "customer_code",
                        width: 90,
                        type: "string",
                        pinned: 'left'
                    }, {
                        id: "customer_name",
                        name: "客户名称",
                        field: "customer_name",
                        width: 200,
                        type: "string"
                    }, {
                        id: "dept_name",
                        name: "运营中心",
                        field: "dept_name",
                        width: 100,
                        type: "string"
                    }, {
                        id: "bill_type",
                        name: "订单类型",
                        field: "bill_type",
                        width: 100,
                        type: "list",
                        hcDictCode: "order_type"
                    }, {
                        id: "attribute4",
                        name: "折扣率(%)",
                        field: "attribute4",
                        width: 90,
                        type: "数量"
                    }, {
                        id: "amount_total_f",
                        name: "折前总额",
                        field: "amount_total_f",
                        width: 100,
                        type: "金额"
                    }, {
                        id: "wtamount_billing",
                        name: "折后总额",
                        field: "wtamount_billing",
                        width: 100,
                        type: "金额"
                    }, {
                        id: "sale_center_code",
                        name: "销售组织编码",
                        field: "sale_center_code",
                        width: 120,
                        type: "string"
                    }, {
                        id: "ent_name",
                        name: "销售组织名称",
                        field: "ent_name",
                        width: 150,
                        type: "string"
                    },
                    {
                        id: "entorgname",
                        name: "产品组",
                        field: "entorgname",
                        width: 100,
                        type: "string"
                    },
                    {
                        id: "address1",
                        name: "收货地址",
                        field: "address1",
                        width: 200,
                        type: "string"
                    }, {
                        id: "take_man",
                        name: "收货人",
                        field: "take_man",
                        width: 100,
                        type: "string"
                    }, {
                        id: "phone_code",
                        name: "联系电话",
                        field: "phone_code",
                        width: 150,
                        type: "string"
                    }, {
                        id: "note",
                        name: "运输说明",
                        field: "note",
                        width: 200,
                        type: "string"
                    }, {
                        id: "source_no",
                        name: "来源单号",
                        field: "source_no",
                        width: 120,
                        type: "string"
                    }, {
                        id: "mo_remark",
                        name: "备注",
                        field: "mo_remark",
                        width: 250,
                        type: "string"
                    }, {
                        id: "date_invbill",
                        name: "制单时间",
                        field: "date_invbill",
                        width: 130,
                        type: "date"
                    }, {
                        id: "created_by",
                        name: "制单人",
                        field: "created_by",
                        width: 100,
                        type: "string"
                    }
                ];


                $scope.headerColumns.forEach(function (column) {
                    if (!column.headerName && column.name)
                        column.headerName = column.name;
                })
                ;

                //明细表网格设置
                $scope.headerOptions = {
                    columnDefs: $scope.headerColumns,
                    onGridReady: function () {
                        $scope.headerOptions.whenReady.resolve($scope.headerOptions);
                    },
                    whenReady: Magic.deferPromise(),
                    onRowDoubleClicked: viewDetail,
                    getContextMenuItems: function (params) {
                        var items = $scope.headerOptions.hcDefaultOptions.getContextMenuItems(params);

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

                        return items;
                    },
                };
                gridApi.create('headerGridView', $scope.headerOptions);


                $scope.editData = editData;

                $scope.deleteData = deleteData;
                /**
                 * 查看
                 * @return {Promise}
                 */
                function editData() {
                    var cell = $scope.headerOptions.api.getFocusedCell();
                    var node;
                    if (cell)
                        node = $scope.headerOptions.api.getModel().getRow(cell.rowIndex);
                    if (!node) {
                        var msg = '请选中要查看的单据';
                        Magic.swalInfo(msg);
                        return $q.reject(msg);
                    }
                    $scope.viewDetail(node);
                }

                /**
                 * 删除
                 * @return {Promise}
                 */
                function deleteData() {
                    var cell = $scope.headerOptions.api.getFocusedCell();

                    var node;

                    if (cell)
                        node = $scope.headerOptions.api.getModel().getRow(cell.rowIndex);

                    var msg;

                    if (!node) {
                        msg = '请选中要删除的订单';
                        Magic.swalInfo(msg);
                        return $q.reject(msg);
                    }

                    del(node);
                }

                /**
                 * 事件判断
                 */
                function viewDetail(args) {
                    $scope.viewDetail(args);
                }

                /**
                 * 查询后台数据
                 */
                $scope.searchData = function (postdata) {
                    if (!postdata) {
                        if (!$scope.oldPage) {
                            $scope.oldPage = 1;
                        }
                        if (!$scope.currentPage) {
                            $scope.currentPage = 1;
                        }
                        if (!$scope.pageSize) {
                            $scope.pageSize = "20";
                        }
                        $scope.totalCount = 1;
                        $scope.pages = 1;
                        postdata = {
                            pagination: "pn=" + $scope.currentPage + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
                        }
                    }
                    if ($scope.sqlwhere && $scope.sqlwhere != "") {
                        postdata.sqlwhere = $scope.sqlwhere
                    }
                    requestApi.post("sa_out_bill_head", "search", postdata).then(function (data) {
                        BaseService.pageInfoOp($scope, data.pagination);
                        $scope.data.sa_out_bill_heads = data.sa_out_bill_heads;
                        refreshLineData();
                    });
                }


                /**
                 * 刷新明细表格数据
                 * return {Promise}
                 */
                function refreshLineData() {
                    return $scope.headerOptions.whenReady.then(function () {
                        $scope.headerOptions.hcApi.setRowData($scope.data.sa_out_bill_heads);
                    });
                }

                /**
                 * 刷新
                 */
                $scope.refresh = function () {
                    $scope.searchData();
                }

                /**
                 * 详情
                 * @param args
                 */
                $scope.viewDetail = function (args) {
                    BasemanService.openModal({
                        "style": {width: 1050, height: 600},
                        "url": "/index.jsp#/saleman/sa_out_bill_pro/" + args.data.sa_out_bill_head_id,
                        "title": "订货申请",
                        "obj": $scope,
                        "action": "update",
                        ondestroy: $scope.refresh
                    });
                };

                /**
                 * 添加
                 */
                $scope.add = function () {
                    BasemanService.openModal({
                        "style": {width: 1050, height: 600},
                        "url": "/index.jsp#/saleman/sa_out_bill_pro/0",
                        "title": "订货申请",
                        "obj": $scope,
                        "action": "insert",
                        ondestroy: $scope.refresh
                    });
                };


                /**
                 * 删除
                 */
                function del(args) {

                    var data = args.data;

                    var stat = Magic.toNum(data.stat);
                    if (stat > 1) {
                        var msg = '订单【' + data.sa_salebillno + '】' + (stat === 5 ? '已审核' : '正在走工作流') + '，不能删除！';
                        Magic.swalError(msg);
                        return $q.reject(msg);
                    }

                    return Magic.swalConfirmThenSuccess({
                        title: '确定要删除订单【' + data.sa_salebillno + '】吗？',
                        okFun: function () {
                            return requestApi.post('sa_out_bill_head', 'delete', {
                                    sa_out_bill_head_id: data.sa_out_bill_head_id
                                })
                                .then(function () {
                                    $scope.headerOptions.api.removeItems([args]);
                                });
                        },
                        okTitle: '删除成功'
                    });
                };

                /**
                 * 条件查询
                 */
                $scope.searchBySql = function () {
                    $scope.FrmInfo = {
                        title: "",
                        thead: [],
                        url: "/jsp/req.jsp",
                        direct: "left",
                        sqlBlock: "",
                        backdatas: "sa_out_bill_head",
                        ignorecase: "true", //忽略大小写
                        postdata: {},
                        is_high: true
                    };

                    $scope.FrmInfo.thead = $scope.headerColumns
                        .slice(1)
                        .map(function (column) {
                            var result = {
                                name: column.headerName,
                                code: column.field,
                                type: column.type
                            };
                            if (column.type === '词汇') {
                                result.type = 'list';
                                result.dicts = column.cellEditorParams.values.map(function (value, index) {
                                    return {
                                        value: value,
                                        desc: column.cellEditorParams.names[index]
                                    };
                                });
                            }
                            if (column.type === '数量' || column.type === '金额') result.type = 'number';
                            return result;
                        });

                    var obj = $scope.FrmInfo;
                    var str = JSON.stringify(obj);
                    sessionStorage.setItem("frmInfo", str);
                    BasemanService.open(CommonPopController1, $scope).result.then(function (result) {
                        $scope.oldPage = 1;
                        $scope.currentPage = 1;
                        if (!$scope.pageSize) {
                            $scope.pageSize = "20";
                        }
                        $scope.totalCount = 1;
                        $scope.pages = 1;
                        var postdata = {
                            pagination: "pn=1,ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0",
                            sqlwhere: result,                                                          //result为返回的sql语句
                        }
                        $scope.sqlwhere = result;
                        $scope.searchData(postdata)
                    })
                }

                //网格高度自适应 , 控制器后面调用：
                BasemanService.initGird();

                //初始化分页
                BaseService.pageGridInit($scope);
            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);