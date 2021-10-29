/**
 * 记账凭证审核
 * 2019-01-25
 * huderong
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'swalApi', 'requestApi', 'loopApi', 'numberApi', 'openBizObj'],
    function (module, controllerApi, base_obj_list, swalApi, requestApi, loopApi, numberApi, openBizObj) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams', '$q',
            //控制器函数
            function ($scope, $stateParams, $q) {
                $scope.gridOptions = {
                    //suppressRowTransform: true,
                    hcEvents: {},
                    columnDefs: [
                        {
                            field: 'merge_credence_no',
                            headerName: '凭证号',
                            pinned: 'left',
                            checkboxSelection: true,
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
                        }, {
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
                        }
                        , {
                            field: 'docket_name',
                            headerName: '摘要',
                            editable: false
                        },
                        {
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
                            headerName: '过账',
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
                        'border-top': '1px dotted lightgrey !important',
                    };
                    if (parseInt(params.data.count_seq) > 1) {
                        style['line-height'] = params.data.count_seq * params.node.rowHeight + 'px'
                    }
                    return style;
                }

                /*---------------------- 按钮 开始----------------------*/

                $scope.toolButtons.add.hide = true;
                $scope.toolButtons.delete.hide = true;
                $scope.toolButtons.batchAudit.hide = true;

                /**
                 * 审核、反审核
                 */
                $scope.doAudit_or_CancelAudit = doAudit_or_CancelAudit;

                function doAudit_or_CancelAudit() {
                    var action_cn = this.title;
                    var action = this.action;
                    $q.when()
                        .then(getgl_credence_heads.bind(undefined, action_cn))
                        .then(function () {
                            return requestApi.post('gl_credence_head', action, {gl_credence_heads: $scope.gl_credence_heads})
                                .then(function (response) {
                                    if (response.gl_credence_heads.length > 0) {
                                        swalApi.success(action_cn + '成功');
                                        $scope.refresh();
                                    }
                                })
                        })
                }

                /** 获取 勾选的行数据 **/
                function getgl_credence_heads(action) {
                    var rowNodes = $scope.gridOptions.hcApi.getSelectedNodes('checkbox');
                    if (rowNodes.length < 1)
                        return swalApi.info('请先勾选要' + action + '的凭证号').then($q.reject);

                    $scope.gl_credence_heads = [];
                    rowNodes.forEach(function (rowNode) {
                        var bizData = rowNode.data;
                        var flag = true;
                        try {
                            $scope.gl_credence_heads.forEach(function (gl_credence_head) {
                                if (parseInt(gl_credence_head.gl_credence_head_id) === parseInt(bizData.gl_credence_head_id)) {
                                    throw new Error("hasData");//已经存在于数据中，就跳出循环
                                }
                            })
                        }
                        catch (e) {
                            flag = false;
                        }
                        if (flag) {
                            $scope.gl_credence_heads.push(bizData);
                        }
                    });
                }

                /**
                 * 打开来源的现金日记账
                 */
                $scope.openCash_journal_list = openCash_journal_list;

                function openCash_journal_list(bizData) {

                    var rowNode = $scope.gridOptions.hcApi.getFocusedNode();
                    if (!rowNode)
                        return swalApi.info('请先选中要' + $scope.toolButtons.openCash_journal_list.title + '的行').then($q.reject);
                    if (!$scope.data.cash_journal_list_router) {
                        return swalApi.info('未找到现金日记账的路由参数,请联系管理员');
                    }

                    var bizData = rowNode.data;
                    var objId = bizData[$scope.data.idField];
                    $q.when()
                        .then(function () {
                            //查现金日记账表
                            return requestApi.post('fd_fund_business', 'search', {sqlwhere: " gl_credence_head_id =" + bizData.gl_credence_head_id})
                                .then(function (response) {
                                    if (response.fd_fund_businesss.length > 0) {
                                        $scope.data.fd_fund_business_id = response.fd_fund_businesss[0].fd_fund_business_id;
                                    }
                                    else {
                                        swalApi.info('未找到来源单据，或已被删除');
                                        return $q.reject();
                                    }
                                })
                        })
                        .then(function () {
                            var propRouterParams = {
                                title: '现金日记账'
                            }; //属性页的路由参数

                            propRouterParams.id = $scope.data.fd_fund_business_id;
                            var stataName = $scope.data.cash_journal_list_router.pkgname + "." + $scope.data.cash_journal_list_router.routename;
                            var modalResultPromise = openBizObj({
                                stateName: stataName,
                                params: propRouterParams
                            }).result;

                            modalResultPromise.finally($scope.refresh);
                            return modalResultPromise;
                        })
                }

                //打开来源单据按钮定义
                $scope.toolButtons.openCash_journal_list = {
                    title: '打开来源单据',
                    click: $scope.openCash_journal_list
                };

                //反审核
                $scope.toolButtons.cancelaudit = {
                    title: '反审核',
                    click: $scope.doAudit_or_CancelAudit,
                    action: "batchcancelcheck"
                };

                //审核
                $scope.toolButtons.audit = {
                    title: '审核',
                    click: $scope.doAudit_or_CancelAudit,
                    action: "batchcheck"
                };
                /*----------------------通用查询开始----------------------*/

                //查现金日记账的router信息
                requestApi.post('base_router', 'search', {sqlwhere: " pagetitle = '现金日记账' and type = 2 "})
                    .then(function (response) {
                        if (response.base_routers.length > 0) {
                            $scope.data.cash_journal_list_router = response.base_routers[0];
                        }
                    })
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