/**
 * 记账凭证
 * 2019-01-25
 * huderong
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'swalApi', 'requestApi', 'loopApi', 'numberApi', 'openBizObj'],
    function (module, controllerApi, base_obj_list, swalApi, requestApi, loopApi, numberApi, openBizObj) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams', '$q', '$modal',
            //控制器函数
            function ($scope, $stateParams, $q, $modal) {
                $scope.gridOptions = {
                    //suppressRowTransform: true,
                    hcEvents: {
                        // selectionChanged: function (args) {
                        //     $scope.data.currItem.gl_credence_lines = $scope.gridOptions.hcApi.getRowData();
                        //
                        //     //当前焦点单元格信息
                        //     var curr_node = $scope.gridOptions.hcApi.getFocusedNode();
                        //     var curr_data = $scope.gridOptions.hcApi.getFocusedData();
                        //     var curr_field = $scope.gridOptions.api.getFocusedCell().column.colId;
                        //
                        //     var credence_no = curr_data.credence_no;
                        //
                        //     loopApi.forLoop($scope.data.currItem.gl_credence_lines.length, function (i) {
                        //         //选中或取消选中同一单据的所有行
                        //         if ($scope.data.currItem.gl_credence_lines[i].credence_no == credence_no) {
                        //             var node = $scope.gridOptions.api.getRowNode(i);
                        //
                        //             if (curr_node.isSelected()) {
                        //                 if (curr_field !== 'temp') {
                        //                     node.setSelected(true);
                        //                 }
                        //             } else {
                        //                 if (curr_field !== 'temp') {
                        //                     node.setSelected(false);
                        //                 }
                        //             }
                        //         }
                        //     })
                        // }
                    },
                    columnDefs: [
                        {
                            field: 'merge_credence_no',
                            headerName: '凭证号',
                            pinned: 'left',
                            // checkboxSelection: true,
                            rowSpan: function (params) {
                                if (params.data.merge_credence_no) {
                                    return params.data.count_seq;
                                }
                            },
                            //cellStyle: setStyle
                        },
                        {
                            field: 'assess_flag',
                            headerName: '已审核',
                            pinned: 'left',
                            type: "是否",
                            rowSpan: function (params) {
                                if (params.data.merge_credence_no) {
                                    return params.data.count_seq;
                                }
                            },
                            //cellStyle: setStyle
                        }
                        // {
                        //     field: 'temp',
                        //     headerName: '',
                        //     pinned: 'left',
                        //     checkboxSelection: true,
                        //     cellStyle: {'text-align': 'center'}
                        // }
                        , {
                            field: 'credence_date',
                            headerName: '记账日期',
                            type: "日期",
                            rowSpan: function (params) {
                                if (params.data.merge_credence_no) {
                                    return params.data.count_seq;
                                }
                            },
                            //cellStyle: setStyle
                        }
                        , {
                            field: 'year_month',
                            headerName: '记账月份',
                            rowSpan: function (params) {
                                if (params.data.merge_credence_no) {
                                    return params.data.count_seq;
                                }
                            },
                            //cellStyle: setStyle
                        }, {
                            field: 'credence_type',
                            headerName: '凭证类型',
                            editable: false,
                            hcDictCode: "credence_type",
                            rowSpan: function (params) {
                                if (params.data.merge_credence_no) {
                                    return params.data.count_seq;
                                }
                            },
                            //cellStyle: setStyle
                        }
                        , {
                            headerName: "会计科目",
                            children: [
                                {
                                    id: 'km_code',
                                    headerName: "编码",
                                    field: "km_code"
                                }, {
                                    id: 'km_name',
                                    headerName: "名称",
                                    field: "km_name"
                                }
                            ]
                        },
                        {
                            field: 'amount_debit',
                            headerName: '借方金额',
                            cellStyle: moneycellStyle,
                            valueFormatter: moneyvalueFormatter,
                            editable: false
                        },
                        {
                            field: 'amount_credit',
                            headerName: '贷方金额',
                            cellStyle: moneycellStyle,
                            valueFormatter: moneyvalueFormatter,
                            editable: false
                        },

                        {
                            field: 'docket_name',
                            headerName: '摘要',
                            editable: false
                        }, {
                            field: 'amount_bill',
                            headerName: '附单据（张）',
                            rowSpan: function (params) {
                                if (params.data.merge_credence_no) {
                                    return params.data.count_seq;
                                }
                            },
                            //cellStyle: setStyle
                        },
                        {
                            field: '是否关联交易',
                            headerName: '是否关联交易',
                            type: "是否",
                            rowSpan: function (params) {
                                if (params.data.merge_credence_no) {
                                    return params.data.count_seq;
                                }
                            },
                            //cellStyle: setStyle
                        },
                        {
                            field: 'created_by',
                            headerName: '创建人',
                            rowSpan: function (params) {
                                if (params.data.merge_credence_no) {
                                    return params.data.count_seq;
                                }
                            },
                            //cellStyle: setStyle
                        },
                        {
                            field: 'cashier_employee_by',
                            headerName: '出纳',
                            rowSpan: function (params) {
                                if (params.data.merge_credence_no) {
                                    return params.data.count_seq;
                                }
                            },
                            //cellStyle: setStyle
                        },
                        {
                            field: 'assessor_employee_by',
                            headerName: '审核',
                            rowSpan: function (params) {
                                if (params.data.merge_credence_no) {
                                    return params.data.count_seq;
                                }
                            },
                            //cellStyle: setStyle
                        },
                        {
                            field: 'tally_employee_by',
                            headerName: '登账',
                            rowSpan: function (params) {
                                if (params.data.merge_credence_no) {
                                    return params.data.count_seq;
                                }
                            },
                            //cellStyle: setStyle
                        },
                        {
                            headerName: "资金账号",
                            children: [
                                {
                                    id: 'fund_account_code',
                                    headerName: "编码",
                                    field: "fund_account_code"
                                }, {
                                    id: 'fund_account_name',
                                    headerName: "名称",
                                    field: "fund_account_name"
                                }
                            ]
                        }, {
                            headerName: "往来对象",
                            children: [
                                {
                                    id: 'base_ac_object_code',
                                    headerName: "编码",
                                    field: "base_ac_object_code"
                                }, {
                                    id: 'base_ac_object_name',
                                    headerName: "名称",
                                    field: "base_ac_object_name"
                                }
                            ]
                        },
                        {
                            headerName: "客户",
                            children: [
                                {
                                    id: 'customer_code',
                                    headerName: "编码",
                                    field: "customer_code"
                                }, {
                                    id: 'customer_name',
                                    headerName: "名称",
                                    field: "customer_name"
                                }
                            ]
                        },
                        {
                            headerName: "供应商",
                            children: [
                                {
                                    id: 'vendor_code',
                                    headerName: "编码",
                                    field: "vendor_code"
                                }, {
                                    id: 'vendor_name',
                                    headerName: "名称",
                                    field: "vendor_name"
                                }
                            ]
                        },
                        {
                            headerName: "部门",
                            children: [
                                {
                                    id: 'dept_code',
                                    headerName: "编码",
                                    field: "dept_code"
                                }, {
                                    id: 'dept_name',
                                    headerName: "名称",
                                    field: "dept_name"
                                }
                            ]
                        },
                        {
                            headerName: "资金流向",
                            children: [
                                {
                                    id: 'obj_code',
                                    headerName: "编码",
                                    field: "obj_code"
                                }, {
                                    id: 'obj_name',
                                    headerName: "名称",
                                    field: "obj_name"
                                }
                            ]
                        },
                        {
                            field: 'crm_entid',
                            headerName: '品类',
                            hcDictCode: "crm_entid"
                        },
                        {
                            field: 'employee_name',
                            headerName: '个人'
                        },
                        {
                            field: 'sale_area_name',
                            headerName: '区域'
                        }
                    ],
                    hcObjType: $stateParams.objtypeid,
                    hcRequestAction: 'search',
                    hcBeforeRequest: function (searchObj) {
                        searchObj.flag = 3;
                    },
                    hcDataRelationName: 'gl_credence_heads',
                };

                // 金额样式
                function moneycellStyle(params) {
                    return angular.extend($scope.gridOptions.hcApi.getDefaultCellStyle(params), {
                        'text-align': 'right' //文本居右
                    });
                }

                //金额样式值格式化器
                function moneyvalueFormatter(params) {
                    if (params.value == 0 || params.value == '0') {
                        return '';
                    }
                    return HczyCommon.formatMoney(params.value);
                }

                /**
                 * 加载继承基础控制器
                 */
                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                $scope.data.searchItem = {};
                $scope.data.currItem = {};


                function setStyle(params) {
                    var style = {
                        'text-align': 'center',
                        'background': 'white',
                        'border-left': '1px dotted lightgrey !important',
                        'border-right': '1px dotted lightgrey !important',
                        'border-top': '1px dotted lightgrey !important'
                    };
                    if (parseInt(params.data.count_seq) > 1) {
                        style['line-height'] = params.data.count_seq * params.node.rowHeight + 'px'
                    }
                    return style;
                }

                /*---------------------- 按钮 开始----------------------*/

                /**
                 * 红字
                 */
                $scope.red = red;

                function red(bizData) {
                    if (!$scope.data.propStateName)
                        return swalApi.error('无法' + $scope.toolButtons.red.title + '，请检查路由配置及命名是否符合标准').then($q.reject);

                    if (!$scope.data.idField)
                        return swalApi.error('无法' + $scope.toolButtons.red.title + '，请检查对象配置是否定义了主键').then($q.reject);

                    var rowNode = $scope.gridOptions.hcApi.getFocusedNode();
                    if (!rowNode)
                        return swalApi.info('请先选中要' + $scope.toolButtons.red.title + '的行').then($q.reject);

                    var bizData = rowNode.data;

                    var propRouterParams = {
                        title: $stateParams.title,
                    }; //属性页的路由参数

                    if (angular.isFunction($scope.getPropRouterParams)) {
                        angular.extend(propRouterParams, $scope.getPropRouterParams({
                            rowNode: rowNode,
                            data: bizData
                        }));
                    }

                    propRouterParams.redFrom = bizData[$scope.data.idField];

                    var modalResultPromise = openBizObj({
                        stateName: $scope.data.propStateName,
                        params: propRouterParams
                    }).result;

                    modalResultPromise.finally($scope.refresh);

                    return modalResultPromise;
                }

                //红字
                $scope.toolButtons.red = {
                    title: '红字',
                    click: $scope.red
                };

                /**
                 * 打开来源的单据或日记账
                 */
                $scope.openOrginal_journalOrlist = openOrginal_journalOrlist;

                function openOrginal_journalOrlist() {

                    var rowNode = $scope.gridOptions.hcApi.getFocusedNode();
                    if (!rowNode)
                        return swalApi.info('请先选中要' + $scope.toolButtons.openOrginal_journalOrlist.title + '的行').then($q.reject);

                    var bizData = rowNode.data;
                    var objId = bizData[$scope.data.idField];

                    var credence_type = numberApi.toNumber(bizData.credence_type);

                    switch (credence_type) {
                        case 1:
                            return swalApi.info('人工凭证无来源单据');
                        case 14:
                            openCredenceType13(bizData);
                            break;
                        default:
                            openCredenceTypeDefault(bizData);
                            break;
                    }
                    // var propRouterParams = {
                    //     title: '日记账'
                    // }; //属性页的路由参数
                    //
                    // propRouterParams.id = $scope.data.fd_fund_business_id;
                    // var stataName = $scope.data.cash_journal_list_router.pkgname + "." + $scope.data.cash_journal_list_router.routename;
                    // var modalResultPromise = openBizObj({
                    //     stateName: stataName,
                    //     params: propRouterParams
                    // }).result;
                    //
                    // modalResultPromise.finally($scope.refresh);
                    // return modalResultPromise;
                }

                /**
                 * 默认打开日记账方式
                 */
                function openCredenceTypeDefault(bizData) {
                    $q.when()
                        .then(function () {
                            //查现金日记账表
                            return requestApi.post('fd_fund_business', 'search', {sqlwhere: " Gl_Credence_Head_Id =" + bizData.gl_credence_head_id})
                                .then(function (response) {
                                    if (response.fd_fund_businesss.length > 0) {
                                        return {
                                            fd_fund_business_id: response.fd_fund_businesss[0].fd_fund_business_id,
                                            fund_account_type: response.fd_fund_businesss[0].fund_account_type
                                        }
                                    }
                                    else {
                                        swalApi.info('未找到来源单据，或已被删除');
                                        return $q.reject();
                                    }
                                })
                        })
                        .then(function (data) {
                            switch (numberApi.toNumber(data.fund_account_type)) {
                                case 1: //现金日记账
                                    return openBizObj({
                                        stateName: 'financeman.fundman.cash_journal_prop',
                                        params: {
                                            id: numberApi.toNumber(data.fd_fund_business_id)
                                        }
                                    }).result;
                                case 2: //银行日记账
                                    return openBizObj({
                                        stateName: 'financeman.fundman.bank_journal_prop',
                                        params: {
                                            id: numberApi.toNumber(data.fd_fund_business_id)
                                        }
                                    }).result;
                            }
                        });
                }

                /**
                 * 打开费用凭证
                 */
                function openCredenceType13(bizData) {
                    $q
                        .when()
                        .then(function () {
                            $modal
                                .openCommonSearch({
                                    title: '费用报销列表查询',
                                    classId: 'fin_fee_bx_header',
                                    postData: {},
                                    sqlWhere: ' Gl_Credence_Head_Id= ' + bizData.gl_credence_head_id,
                                    hcDataRelationName: 'fin_fee_bx_headers',
                                    gridOptions: {
                                        columnDefs: [
                                            {
                                                type: '序号',
                                            }
                                            , {
                                                field: 'stat',
                                                headerName: '单据状态',
                                                hcDictCode: '*'
                                            }
                                            , {
                                                field: 'bx_no',
                                                headerName: '报销单号'
                                            }
                                            , {
                                                field: 'bud_type_name',
                                                headerName: '预算类别'
                                            }
                                            , {
                                                field: 'chap_name',
                                                headerName: '报销人'
                                            }
                                            , {
                                                field: 'org_name',
                                                headerName: '报销部门'
                                            }
                                            , {
                                                field: 'balance_type_name',
                                                headerName: '结算方式'
                                            }
                                            , {
                                                field: 'cyear',
                                                headerName: '年度',
                                                cellStyle: {
                                                    'text-align': 'center'
                                                }
                                            }
                                            , {
                                                field: 'cmonth',
                                                headerName: '月度',
                                                type: '数量'
                                            }
                                            , {
                                                field: 'fee_apply_no',
                                                headerName: '申请单号'
                                            }
                                            , {
                                                field: 'total_apply_amt',
                                                headerName: '报销申请总额',
                                                type: '金额'
                                            }
                                            , {
                                                field: 'total_allow_amt',
                                                headerName: '报销批准总额',
                                                type: '金额'
                                            }
                                            , {
                                                field: 'purpose',
                                                headerName: '费用用途'
                                            }
                                            , {
                                                field: 'receiver',
                                                headerName: '收款人'
                                            }
                                            , {
                                                field: 'receive_bank',
                                                headerName: '收款银行'
                                            }
                                            , {
                                                field: 'receive_accno',
                                                headerName: '收款账号'
                                            }
                                            , {
                                                field: 'creator',
                                                headerName: '创建人'
                                            }
                                            , {
                                                field: 'create_time',
                                                headerName: '创建时间'
                                            }
                                            , {
                                                field: 'credence_no',
                                                headerName: '凭证号'
                                            }
                                        ]
                                    },
                                    cellDoubleFunc: function (params) {
                                        var bx_id = numberApi.toNumber(params.node.data.bx_id);
                                        return openBizObj({
                                            stateName: 'finman.fin_fee_bx_prop',
                                            params: {
                                                id: bx_id
                                            }
                                        }).result;
                                    }
                                })
                        })
                }

                //打开来源单据按钮定义
                $scope.toolButtons.openOrginal_journalOrlist = {
                    title: '打开来源单据',
                    click: openOrginal_journalOrlist
                };

                /**
                 * 重新删除按钮方法
                 */
                $scope.delete = function () {
                    $q.when()
                        .then($scope.hcSuper.delete)
                        .then($scope.refresh);
                    // $scope.hcSuper.delete();
                    // $scope.refresh();
                }
                /*----------------------通用查询开始----------------------*/

                // //查现金日记账的router信息
                // requestApi.post('base_router', 'search', {sqlwhere: " pagetitle = '现金日记账' and type = 2 "})
                //     .then(function (response) {
                //         if (response.base_routers.length > 0) {
                //             $scope.data.cash_journal_list_router = response.base_routers[0];
                //         }
                //     })
                /*----------------------通用查询结束----------------------*/

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
