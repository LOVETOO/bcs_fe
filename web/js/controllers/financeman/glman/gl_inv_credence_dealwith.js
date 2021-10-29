/**
 * 生成存货凭证-空白自定义页
 * 2019-02-14
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'openBizObj', 'swalApi', 'loopApi', 'numberApi'],
    function (module, controllerApi, base_diy_page, requestApi, openBizObj, swalApi, loopApi, numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {
                $scope.gridOptions = {
                    suppressRowTransform: true,
                    hcEvents: {
                        selectionChanged: function (args) {
                            $scope.data.currItem.inv_credence_dealwiths = $scope.gridOptions.hcApi.getRowData();

                            //当前焦点单元格信息
                            var curr_node = $scope.gridOptions.hcApi.getFocusedNode();
                            var curr_data = $scope.gridOptions.hcApi.getFocusedData();
                            var curr_order_id = curr_data.order_id;

                            //选中或取消选中同一单据的所有行
                            loopApi.forLoop($scope.data.currItem.inv_credence_dealwiths.length, function (i) {
                                var order_id = $scope.data.currItem.inv_credence_dealwiths[i].order_id;

                                if (order_id == curr_order_id) {
                                    var node = $scope.gridOptions.api.getRowNode(i);

                                    if (curr_node.isSelected()) {
                                        node.setSelected(true);
                                    } else {
                                        node.setSelected(false);
                                    }
                                }
                            })
                        }
                    },
                    columnDefs: [
                        {
                            type: '序号',
                            checkboxSelection: true
                        }
                        , {
                            field: 'affairtype',
                            headerName: '业务类型',
                            hcDictCode: 'inv_order_type'
                        }
                        , {
                            field: 'docket_name',
                            headerName: '摘要',
                            onCellDoubleClicked: function (args) {
                                var stateName = '';
                                switch (numberApi.toNumber(args.data.bill_type)) {
                                    case 1: //采购入库单
                                        stateName = 'proman.inv_in_bill_none_prop';
                                        break;
                                    case 2: //采购订单入库
                                        stateName = 'proman.inv_in_bill_prop';
                                        break;
                                    case 3: //销售出库
                                        stateName = 'invman.inv_out_bill_no_order_prop';
                                        // case 4: //销售订单出库
                                        //     break;
                                        break;
                                    case 5: //销售退货入库
                                        stateName = 'saleman.sa_out_bill_return_prop';
                                        break;
                                    case 6: //委托代销开单
                                        stateName = 'saleman.sa_out_bill_proxy_prop';
                                        break;
                                    case 7: //委托代销退货
                                        stateName = 'saleman.sa_out_bill_con_return_prop';
                                        break;
                                    case 8: //委托代销结算
                                        stateName = 'saleman.sa_out_bill_con_settle_prop';
                                        break;
                                    case 9: //存货金额调整
                                        stateName = 'invman.stkamountadjustbill_prop';
                                        break;
                                    case 10: //其他入库
                                        stateName = 'invman.inv_in_ware_bill_prop';
                                        break;
                                    case 11: //其他出库
                                        stateName = 'invman.inv_out_ware_bill_prop';
                                        break;
                                    // case 12: //委外入库
                                    //     break;
                                }
                                if (!args.data.order_id) {
                                    return swalApi.info('该单据id不存在或已被删除！');
                                }
                                return openBizObj({
                                    stateName: stateName,
                                    params: {
                                        id: numberApi.toNumber(args.data.order_id)
                                    }
                                }).result;
                            }
                        }
                        , {
                            headerName: '会计科目',
                            children: [
                                {
                                    field: 'km_code',
                                    headerName: '编码',
                                    editable: true,
                                    onCellDoubleClicked: function (args) {
                                        $scope.chooseSubject(args);
                                    },
                                    onCellValueChanged: function (args) {
                                        if (!args.newValue || args.newValue === args.oldValue) {
                                            return;
                                        }
                                        $scope.getInfoByCode('gl_account_subject', 'km_code', args.data.km_code)
                                            .then(function (info) {
                                                if (info) {
                                                    args.data.gl_account_subject_id = info.gl_account_subject_id;
                                                    args.data.km_name = info.km_name;
                                                } else {
                                                    swalApi.info('会计科目编码【' + args.data.km_code + '】不存在!');
                                                    args.data.km_code = '';
                                                    args.data.km_name = '';
                                                    args.data.gl_account_subject_id = 0;
                                                }

                                                args.api.refreshView();
                                            })
                                    }
                                },
                                {
                                    field: 'km_name',
                                    headerName: '名称'
                                }
                            ]
                        }
                        , {
                            field: 'amount_debit',
                            headerName: '借方金额',
                            type: '金额'
                        }
                        , {
                            field: 'amount_credit',
                            headerName: '贷方金额',
                            type: '金额'
                        }
                        , {
                            headerName: '客户',
                            children: [
                                {
                                    field: 'customer_code',
                                    headerName: '编码',
                                    editable: true,
                                    onCellDoubleClicked: function (args) {
                                        $scope.chooseCustomer(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.getInfoByCode('customer_org', 'customer_code', args.data.customer_code)
                                            .then(function (info) {
                                                if (info) {
                                                    args.data.customer_org_id = info.customer_org_id;
                                                    args.data.customer_name = info.customer_name;
                                                } else {
                                                    swalApi.info('客户编码【' + args.data.customer_code + '】不存在');
                                                    args.data.customer_code = '';
                                                    args.data.customer_org_id = 0;
                                                    args.data.customer_name = '';
                                                }
                                                args.api.refreshView();
                                            })
                                    }
                                },
                                {
                                    field: 'customer_name',
                                    headerName: '名称'
                                }
                            ]
                        }
                        , {
                            headerName: '供应商',
                            children: [
                                {
                                    field: 'vendor_code',
                                    headerName: '编码',
                                    editable: true,
                                    onCellDoubleClicked: function (args) {
                                        $scope.chooseVendor(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.getInfoByCode('vendor_org', 'vendor_code', args.data.vendor_code)
                                            .then(function (info) {
                                                if (info) {
                                                    args.data.vendor_org_id = info.vendor_org_id;
                                                    args.data.vendor_name = info.vendor_name;
                                                } else {
                                                    swalApi.info('部门编码【' + args.data.vendor_code + '】不存在');
                                                    args.data.vendor_code = '';
                                                    args.data.vendor_org_id = 0;
                                                    args.data.vendor_name = '';
                                                }
                                                args.api.refreshView();
                                            })
                                    }
                                },
                                {
                                    field: 'vendor_name',
                                    headerName: '名称'
                                }
                            ]
                        }
                        , {
                            headerName: '部门',
                            children: [
                                {
                                    field: 'dept_code',
                                    headerName: '编码',
                                    editable: true,
                                    onCellDoubleClicked: function (args) {
                                        $scope.chooseOrg(args);
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.getInfoByCode('dept', 'dept_code', args.data.dept_code)
                                            .then(function (info) {
                                                if (info) {
                                                    args.data.dept_id = info.dept_id;
                                                    args.data.dept_name = info.dept_name;
                                                } else {
                                                    swalApi.info('部门编码【' + args.data.dept_code + '】不存在');
                                                    args.data.dept_code = '';
                                                    args.data.dept_id = 0;
                                                    args.data.dept_name = '';
                                                }
                                                args.api.refreshView();
                                            })
                                    }
                                },
                                {
                                    field: 'dept_name',
                                    headerName: '名称'
                                }
                            ]
                        }
                        , {
                            headerName: '往来对象',
                            children: [
                                {
                                    field: 'base_ac_object_code',
                                    headerName: '编码',
                                    editable: true,
                                    onCellDoubleClicked: function (args) {
                                        $scope.chooseAcObject(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.getInfoByCode('base_ac_object', 'base_ac_object_code', args.data.base_ac_object_code)
                                            .then(function (info) {
                                                if (info) {
                                                    args.data.base_ac_object_id = info.base_ac_object_id;
                                                    args.data.base_ac_object_name = info.base_ac_object_name;
                                                } else {
                                                    swalApi.info('往来对象编码【' + args.data.base_ac_object_code + '】不存在');
                                                    args.data.base_ac_object_code = '';
                                                    args.data.base_ac_object_id = 0;
                                                    args.data.base_ac_object_name = '';
                                                }
                                                args.api.refreshView();
                                            })
                                    }
                                },
                                {
                                    field: 'base_ac_object_name',
                                    headerName: '名称'
                                }
                            ]
                        }
                        , {
                            field: 'crm_entid',
                            headerName: '品类',
                            hcDictCode: '*',
                            editable: true
                        }
                    ],
                    hcObjType: 19021402,
                    hcRequestAction: 'getdata',
                    hcBeforeRequest: function (searchObj) {
                        //开始日期
                        searchObj.binvbilldate = $scope.data.currItem.binvbilldate;
                        //结束日期
                        searchObj.einvbilldate = $scope.data.currItem.einvbilldate;
                        //业务类型
                        searchObj.selectindex = $scope.data.currItem.affairtype;
                    }
                };

                $scope.data = {};
                $scope.data.currItem = {};


                /*---------------------通用查询开始------------------------*/

                /**
                 * 查部门
                 */
                $scope.chooseOrg = function (args) {
                    $modal.openCommonSearch({
                            classId: 'dept'
                        })
                        .result//响应数据
                        .then(function (result) {
                            if (args) {
                                args.data.dept_id = result.dept_id;
                                args.data.dept_code = result.dept_code;
                                args.data.dept_name = result.dept_name;
                                args.api.refreshView();
                            } else {
                                $scope.data.currItem.dept_id = result.dept_id;
                                $scope.data.currItem.dept_code = result.dept_code;
                                $scope.data.currItem.dept_name = result.dept_name;
                            }
                        });
                };

                /**
                 * 查客户
                 */
                $scope.chooseCustomer = function (args) {
                    $modal.openCommonSearch({
                            classId: 'customer_org'
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.customer_name = result.customer_name;
                            args.data.customer_code = result.customer_code;
                            args.data.customer_id = result.customer_id;
                            args.api.refreshView();
                        });
                };

                /**
                 * 查供应商
                 */
                $scope.chooseVendor = function (args) {
                    $modal.openCommonSearch({
                            classId: 'vendor_org'
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.vendor_name = result.vendor_name;
                            args.data.vendor_code = result.vendor_code;
                            args.data.vendor_id = result.vendor_id;
                            args.api.refreshView();
                        });
                };

                /**
                 * 查往来对象
                 */
                $scope.chooseAcObject = function (args) {
                    $modal.openCommonSearch({
                            classId: 'base_ac_object'
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.base_ac_object_code = result.base_ac_object_code;
                            args.data.base_ac_object_name = result.base_ac_object_name;
                            args.data.base_ac_object_id = result.base_ac_object_id;
                            args.api.refreshView();
                        });
                };

                /**
                 * 查会计科目
                 */
                $scope.chooseSubject = function (args) {
                    $modal.openCommonSearch({
                            classId: 'gl_account_subject',
                            sqlWhere: " end_km = 2"
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.gl_account_subject_id = result.gl_account_subject_id;
                            args.data.km_code = result.km_code;
                            args.data.km_name = result.km_name;
                            args.api.refreshView();
                        });
                };
                /*---------------------通用查询结束------------------------*/

                controllerApi.run({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /*---------------------通过编码查id和名称-------------------*/

                $scope.getInfoByCode = function (classid, postField, code) {
                    var postdata = {
                        sqlwhere: " " + postField + "='" + code + "'"
                    };
                    if (postField === 'km_code') {
                        postdata.sqlwhere += ' and end_km = 2';
                    }
                    var responseData = {};

                    return requestApi.post(classid, 'search', postdata)
                        .then(function (res) {
                            if (res[classid + 's'].length) {
                                return responseData = res[classid + 's'][0];
                            }
                        })
                };

                /*-------------------------------------------------------*/

                /**
                 * 条件搜索
                 */
                $scope.searchBySqlWhere = function () {
                    if (!$scope.data.currItem.affairtype) {
                        return swalApi.info('请选择要查询的业务类型');
                    }
                    $scope.gridOptions.hcApi.search();
                };

                //业务类型：1.采购入库 2.产品销售出库 3.产品销售退货 4.委托代销出库 5.委托代销结算 6.存货金额调整 7.其他入库 8.其他出库 9.委外入库
                $scope.data.currItem.affairtype = 1;

                /**
                 * 初始化数据
                 */
                $scope.initData = function () {
                    $scope.data.currItem.dealwithtype = 1;//处理方式：1单个处理 2汇总处理
                    $scope.data.currItem.is_relation = 1;

                    //查凭证字
                    return requestApi.post('gl_credence_type', 'search', {})
                        .then(function (response) {
                            $scope.data.currItem.character_id = response.gl_credence_types[0].character_id;
                            $scope.data.currItem.character_code = response.gl_credence_types[0].character_code;
                            $scope.data.currItem.character_name = response.gl_credence_types[0].character_name;
                            //组合编码和名称
                            $scope.data.currItem.character = $scope.data.currItem.character_code + ' ' + $scope.data.currItem.character_name;
                        })
                };

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                        .then($scope.initData)
                };


                /**
                 * 保存：写数据到记账凭证
                 */
                $scope.writeData = function () {
                    var selectedNodes = $scope.gridOptions.api.getSelectedNodes();
                    var selectedRows = $scope.gridOptions.api.getSelectedRows();
                    if (!selectedNodes.length) {
                        return swalApi.info('请勾选要保存的行');
                    }

                    $scope.data.currItem.inv_credence_dealwiths = selectedRows;
                    loopApi.forLoop($scope.data.currItem.inv_credence_dealwiths.length, function (i) {
                        $scope.data.currItem.inv_credence_dealwiths[i].is_relation = $scope.data.currItem.is_relation;
                    });

                    return requestApi.post('inv_credence_dealwith', 'writedata', $scope.data.currItem)
                        .then(function (data) {
                            if (data) {
                                $scope.data.currItem.credence_no = data.credence_no;
                                swalApi.success({
                                    title: '数据生成成功，凭证号：' + $scope.data.currItem.credence_no,
                                    timer: null
                                });
                                $scope.gridOptions.hcApi.search();
                            }
                        })
                };

                //工具栏按钮
                $scope.toolButtons.export = {
                    title: '导出',
                    icon: 'iconfont hc-daochu',
                    click: function () {
                        $scope.gridOptions.hcApi.exportToExcel();
                    }
                };
                $scope.toolButtons.refresh = {
                    title: '刷新',
                    icon: 'iconfont hc-refresh',
                    click: function () {
                        return $scope.gridOptions.hcApi.search();
                    }
                };
                $scope.toolButtons.writeData = {
                    title: '保存',
                    icon: 'iconfont hc-save',
                    click: function () {
                        $scope.writeData && $scope.writeData();
                    }
                };
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
