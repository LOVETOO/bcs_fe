/**
 * 生成费用凭证-空白自定义页
 * 2018-12-19
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'openBizObj', 'swalApi', 'loopApi'],
    function (module, controllerApi, base_diy_page, requestApi, openBizObj, swalApi, loopApi) {
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
                            $scope.data.currItem.fin_fee_credence_dealwiths = $scope.gridOptions.hcApi.getRowData();

                            //当前焦点单元格信息
                            var curr_node = $scope.gridOptions.hcApi.getFocusedNode();
                            var curr_data = $scope.gridOptions.hcApi.getFocusedData();
                            var curr_bx_id = curr_data.order_id;

                            //选中或取消选中同一单据的所有行
                            loopApi.forLoop($scope.data.currItem.fin_fee_credence_dealwiths.length, function (i) {
                                var bx_id = $scope.data.currItem.fin_fee_credence_dealwiths[i].order_id;

                                if (bx_id == curr_bx_id) {
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
                            headerName: '类型'
                        }
                        , {
                            field: 'docket_name',
                            headerName: '摘要',
                            onCellDoubleClicked: function (args) {
                                $scope.openBxProp(args);
                            }
                        }
                        , {
                            headerName: '会计科目',
                            children: [
                                {
                                    field: 'km_code',
                                    headerName: '科目编码',
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
                                    headerName: '科目名称'
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
                        // , {
                        //     headerName: '经费科目',
                        //     children:[
                        //         {
                        //             field: 'charge_item_code',
                        //             headerName: '编码'
                        //         },
                        //         {
                        //             field: 'charge_item_name',
                        //             headerName: '名称'
                        //         }
                        //     ]
                        // }
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
                            headerName: '个人',
                            children: [
                                {
                                    field: 'employee_code',
                                    headerName: '编码',
                                    editable: true,
                                    onCellDoubleClicked: function (args) {
                                        $scope.chooseUser(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.getInfoByCode('base_view_erpemployee_org', 'employee_code', args.data.employee_code)
                                            .then(function (info) {
                                                if (info) {
                                                    args.data.employee_id = info.employee_id;
                                                    args.data.employee_name = info.employee_name;
                                                } else {
                                                    swalApi.info('个人编码【' + args.data.employee_code + '】不存在');
                                                    args.data.employee_code = '';
                                                    args.data.employee_id = 0;
                                                    args.data.employee_name = '';
                                                }
                                                args.api.refreshView();
                                            })
                                    }
                                },
                                {
                                    field: 'employee_name',
                                    headerName: '名称'
                                }
                            ]
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
                            headerName: '资金账号',
                            children: [
                                {
                                    field: 'fund_account_code',
                                    headerName: '编码',
                                    editable: true,
                                    onCellDoubleClicked: function (args) {
                                        $scope.chooseFundAccount(args)
                                    },
                                    onCellValueChanged: function (args) {
                                        $scope.getInfoByCode('fd_fund_account', 'fund_account_code', args.data.fund_account_code)
                                            .then(function (info) {
                                                if (info) {
                                                    args.data.fd_fund_account_id = info.fd_fund_account_id;
                                                    args.data.fund_account_name = info.fund_account_name;
                                                } else {
                                                    swalApi.info('资金账号编码【' + args.data.fund_account_code + '】不存在');
                                                    args.data.fund_account_code = '';
                                                    args.data.fd_fund_account_id = 0;
                                                    args.data.fund_account_name = '';
                                                }
                                                args.api.refreshView();
                                            })
                                    }
                                },
                                {
                                    field: 'fund_account_name',
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
                            headerName: '门店',
                            children: [
                                {
                                    field: 'shop_code',
                                    headerName: '编码'
                                },
                                {
                                    field: 'shop_name',
                                    headerName: '名称'
                                }
                            ]
                        }
                        , {
                            headerName: '区域',
                            children: [
                                {
                                    field: 'sale_area_code',
                                    headerName: '编码'
                                },
                                {
                                    field: 'sale_area_name',
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
                        // , {
                        //     field: 'entorgid',
                        //     headerName: '产品线',
                        //     hcDictCode: '*',
                        //     editable: true
                        // }
                    ],
                    hcObjType: 18121901,
                    hcRequestAction: 'getdata',
                    hcBeforeRequest: function (searchObj) {
                        //报销部门
                        searchObj.dept_id = $scope.data.currItem.dept_id;
                        //结算方式
                        searchObj.base_balance_type_ids = $scope.data.currItem.base_balance_type_ids;
                        //结算类型
                        searchObj.settlement_type = $scope.data.currItem.settlement_type;
                        //是否仅显示已支付完的报销单
                        searchObj.is_onlypayed = $scope.data.currItem.is_onlypayed;

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
                 * 查结算方式
                 */
                $scope.chooseBalanceType = function () {
                    $modal.openCommonSearch({
                            classId: 'base_balance_type',
                            checkbox: true
                        })
                        .result//响应数据
                        .then(function (result) {
                            var codes = [];
                            var names = [];
                            var ids = [];
                            loopApi.forLoop(result.length, function (i) {
                                ids.push(result[i].base_balance_type_id);
                                codes.push(result[i].balance_type_code);
                                names.push(result[i].balance_type_name);
                            });

                            $scope.data.currItem.base_balance_type_ids = ids.join(',');
                            $scope.data.currItem.balance_type_codes = codes.join(',');
                            $scope.data.currItem.balance_type_names = names.join(',');

                        });
                };

                /**
                 * 查资金账户
                 */
                $scope.chooseFundAccount = function (args) {
                    $modal.openCommonSearch({
                            classId: 'fd_fund_account'
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.fd_fund_account_id = result.fd_fund_account_id;
                            args.data.fund_account_code = result.fund_account_code;
                            args.data.fund_account_name = result.fund_account_name;
                            args.api.refreshView();
                        });
                };

                /**
                 * 查用户
                 */
                $scope.chooseUser = function (args) {
                    $modal.openCommonSearch({
                            classId: 'base_view_erpemployee_org'
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.employee_name = result.employee_name;
                            args.data.employee_code = result.employee_code;
                            args.data.employee_id = result.employee_id;
                            args.api.refreshView();
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
                 * 打开费用报销属性页
                 */
                $scope.openBxProp = function (args) {
                    return openBizObj({
                        stateName: 'finman.fin_fee_bx_prop',
                        params: {
                            id: args.data.order_id,
                            title: '费用报销'
                        }
                    }).result
                };

                /**
                 * 条件搜索
                 */
                $scope.searchBySqlWhere = function () {
                    $scope.gridOptions.hcApi.search();
                };

                /**
                 * 初始化数据
                 */
                $scope.initData = function () {
                    $scope.data.currItem.dealwith_type = 1;//处理方式：1单个处理 2汇总处理
                    $scope.data.currItem.is_onlypayed = 2;

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

                    $scope.data.currItem.fin_fee_credence_dealwiths = selectedRows;
                    return requestApi.post('fin_fee_credence_dealwith', 'writedata', $scope.data.currItem)
                        .then(function (data) {
                            $scope.data.currItem.credence_no = data.credence_no;
                            swalApi.success({
                                title: '数据生成成功，凭证号：\n' + $scope.data.currItem.credence_no,
                                timer: null
                            });

                            $scope.gridOptions.hcApi.search();
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
