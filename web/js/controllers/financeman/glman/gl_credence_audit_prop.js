/**
 * 记账凭证审核
 * 2019-01-28
 * huderong
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'dateApi', 'numberApi', 'strApi', 'openBizObj'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, dateApi, numberApi, strApi, openBizObj) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$stateParams', '$q',
            //控制器函数
            function ($scope, $stateParams, $q) {
                /**==============================网格定义========================= */
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'docket_name',
                            headerName: '摘要',
                            width: 300,
                            editable: false,
                        },
                        {
                            id: 'km_code',
                            headerName: "会计科目编码",
                            field: "km_code",
                            editable: false
                        }, {
                            id: 'km_name',
                            headerName: "会计科目名称",
                            field: "km_name",
                            editable: false
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
                            field: 'line_doc_id',
                            headerName: '附件',
                            editable: false
                        }
                    ],
                    hcObjType: $stateParams.objtypeid,
                    hcEvents: {
                        selectionChanged: function (args) {
                        },
                        rowClicked: function (args) {
                            $q.when()
                                .then(function () {
                                    var oldLine = $scope.data.currLine;
                                    $scope.data.currLine = args.data;
                                    $scope.data.currLine.rowIndex = args.rowIndex;
                                    return oldLine;
                                });
                        }
                    }
                }

                /**继承主控制器 */
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

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

                /**==============================数据定义========================= */
                $scope.data.currLine = {};
                /**============================ 明细行逻辑计算=================================**/


                /**============================ 点击事件=================================**/
                /**
                 * 打开来源的现金日记账
                 */
                $scope.openCash_journal_list = openCash_journal_list;

                function openCash_journal_list(bizData) {

                    if (!$scope.data.cash_journal_list_router) {
                        return swalApi.info('未找到现金日记账的路由参数,请联系管理员');
                    }

                    var bizData = $scope.data.currItem;
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
                $scope.footerRightButtons.openCash_journal_list = {
                    title: '打开来源单据',
                    click: $scope.openCash_journal_list,
                    hide: function () {
                        return !($scope.data.currItem.gl_credence_head_id && $scope.data.currItem.gl_credence_head_id > 0);
                    }
                };

                //反审核
                $scope.footerRightButtons.cancelaudit = {
                    title: '反审核',
                    click: $scope.doAudit_or_CancelAudit,
                    action: "cancelcheck",
                    hide: buttonHide
                };

                //审核
                $scope.footerRightButtons.audit = {
                    title: '审核',
                    click: $scope.doAudit_or_CancelAudit,
                    action: "check",
                    hide: buttonHide
                };

                function buttonHide(params) {
                    var assess_flag = $scope.data.currItem.assess_flag ? parseInt($scope.data.currItem.assess_flag) : 0
                    if (params.button.action === "check" && assess_flag != 2) {
                        return false;
                    } else if (params.button.action === "cancelcheck" && assess_flag == 2) {
                        return false;
                    } else return true;
                }

                /**
                 * 审核、反审核方法
                 */
                $scope.doAudit_or_CancelAudit = doAudit_or_CancelAudit;

                function doAudit_or_CancelAudit() {
                    var action_cn = this.title;
                    var action = this.action;
                    $q.when()
                        .then(function () {
                            if (action_cn === '') {
                            }
                        })
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

                $scope.footerRightButtons.saveThenSubmit.hide = true;//隐藏保存并新增按钮
                $scope.footerRightButtons.save.hide = function () {
                    return true;
                };//隐藏保存按钮
                /**============================ 点击事件结束=================================**/

                /**============================数据处理 ================================**/

                $scope.setBizData = function (bizData) {
                    // $scope.aa=JSON.stringify(bizData);
                    // $scope.hcSuper.setBizData(bizData); //继承基础控制器的方法，类似Java的super
                    //设置头部数据的步骤已在基础控制器实现
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.api.setRowData(bizData.gl_credence_lines);
                };

                /**
                 * 初始化数据
                 */
                $scope.initData = function (bizData) {
                    angular.extend($scope.data.currItem, {
                        created_by: strUserName,
                        creation_date: dateApi.now(),
                        credence_date: dateApi.now(),
                        gl_credence_lines: [{}, {}, {}, {}],
                        stat: 1,
                        year_month: new Date(dateApi.today()).Format('yyyy-MM'),
                        credence_type: 1,
                        is_relation: 1
                    });

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
                 * 检查数据
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                }

                /**
                 * 刷新
                 */
                $scope.refresh = function () {
                    $scope.hcSuper.refresh(); //继承基础控制器的方法，类似Java的super
                };


                /*----------------------通用查询开始----------------------*/

                //查现金日记账的router信息
                requestApi.post('base_router', 'search', {sqlwhere: " pagetitle = '现金日记账' and type = 2 "})
                    .then(function (response) {
                        if (response.base_routers.length > 0) {
                            $scope.data.cash_journal_list_router = response.base_routers[0];
                        }
                    })

                /**============================通用查询 ===================**/
            }

        ]
//使用控制器Api注册控制器
//需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
)
;