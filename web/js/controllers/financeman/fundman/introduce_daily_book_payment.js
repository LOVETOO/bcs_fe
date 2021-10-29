/**
 * 引入日记账-付款 introduce_daily_book_payment
 * Created by DELL on 2019/3/18.
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'loopApi', 'requestApi', 'swalApi', 'dateApi'],
    function (module, controllerApi, base_obj_list, loopApi, requestApi, swalApi, dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams', '$q', '$modal',
            //控制器函数
            function ($scope, $stateParams, $q, $modal) {
                $scope.data = {};
                $scope.data.currItem = {};

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号',
                            checkboxSelection: true
                        }, {
                            field: 'ordinal_no',
                            headerName: '流水号'
                        }, {
                            field: 'settlement_type',
                            headerName: '结算类型',
                            hcDictCode: '*'
                            //用作测试，测试后是否保留？
                        }, {
                            field: 'date_fund',
                            headerName: '记账日期',
                            type:'日期'
                        }, {
                            headerName: '结算方式',
                            children: [
                                {
                                    field: 'balance_type_code',
                                    headerName: '编码'
                                }, {
                                    field: 'balance_type_name',
                                    headerName: '名称'
                                }
                            ]
                        }, {
                            headerName: '资金账号',
                            children: [
                                {
                                    field: 'fund_account_code',
                                    headerName: '编码',
                                    editable: true,
                                    hcRequired: true,
                                    onCellValueChanged: function (args) {
                                        if (args)
                                            if (args.newValue === args.oldValue)
                                                return;
                                        //获取产品
                                        getFundAccount(args.newValue)
                                            .catch(function (reason) {
                                                return {
                                                    fd_fund_account_id: 0,
                                                    fund_account_code: '',
                                                    fund_account_name: reason
                                                };
                                            })
                                            .then(function (line) {
                                                angular.extend(args.data, line);
                                                return args.data;
                                            })
                                            .then(function () {
                                                args.api.refreshView();
                                            });
                                    },
                                    onCellDoubleClicked: function (args) {
                                        $scope.getFundAccountDoubleClicked(args);
                                    }
                                }, {
                                    field: 'fund_account_name',
                                    headerName: '名称'
                                }
                            ]
                        }, {
                            headerName: '收支类型',
                            children: [
                                {
                                    field: 'io_type_code',
                                    headerName: '编码',
                                    editable: true,
                                    onCellValueChanged: function (args) {
                                        if (args)
                                            if (args.newValue === args.oldValue)
                                                return;
                                        //获取产品
                                        getIoType(args.newValue)
                                            .catch(function (reason) {
                                                return {
                                                    fd_io_type_id: 0,
                                                    io_type_code: '',
                                                    io_type_name: reason
                                                };
                                            })
                                            .then(function (line) {
                                                angular.extend(args.data, line);
                                                return args.data;
                                            })
                                            .then(function () {
                                                args.api.refreshView();
                                            });
                                    },
                                    onCellDoubleClicked: function (args) {
                                        $scope.getIoTypeDoubleClicked(args);
                                    }
                                }, {
                                    field: 'io_type_name',
                                    headerName: '名称'
                                }
                            ]
                        }, {
                            field: 'amount_credit',
                            headerName: '付款金额',
                            type:'金额'
                        }, {
                            field: 'bill_no',
                            headerName: '票据号',
                            editable: true
                        }, {
                            field: 'crm_entid',
                            headerName: '品类',
                            hcDictCode: "crm_entid"
                        }, {
                            headerName: '供应商',
                            children: [
                                {
                                    field: 'vendor_code',
                                    headerName: '编码',
                                    editable: false
                                },
                                {
                                    field: 'vendor_name',
                                    headerName: '名称',
                                    editable: false
                                }
                            ]
                        }, {
                            headerName: '部门',
                            children: [
                                {
                                    field: 'dept_code',
                                    headerName: '编码'
                                },
                                {
                                    field: 'dept_name',
                                    headerName: '名称'
                                }]
                        }, {
                            field: 'attachcount',
                            headerName: '附件'
                        }, {
                            field: 'note',
                            headerName: '备注'
                        }
                    ],
                    hcBeforeRequest: function (searchObj) {
                        searchObj.sqlwhere = '';
                        searchObj.searchflag = 14;
/*
                        //替换sqlwhere,stat = 1 ,改为 已审核、结算类型为 “现金”（settlement_type=1）或“银行”（settlement_type=2）、当前月
                        var where = searchObj.sqlwhere;
                        //去字符串中间除多余的空格
                        for (var i = 0; i < where.length; i++) {
                            if (where[i] == ' ') {
                                if (where[i + 1] == ' ') {
                                    var buffer1 = where.substring(0, i);
                                    var buffer2 = where.substring(i + 1, where.length);
                                    where = buffer1 + buffer2;
                                    i--;
                                }
                            }
                        }
``
                        var checkoutfnyearmonth
                        requestApi.post('gl_account_period','getcheckoutinfo',{}).then(function(data){

                        });


                        searchObj.sqlwhere =
                            where.replace('stat = 1',
                                'stat = 5 and Extract(month from date_fund)> = (select to_char(sysdate, \'MM\') month from dual ) ' +
                                ' and (settlement_type = 1 or settlement_type = 2)');*/
                    },
                    hcAfterRequest: function (data) {
                        $scope.data.currItem = data;
                    },
                    hcEvents: function () {
                        cellDoubleClicked = function () {
                        };//覆盖掉父控制器的双击事件（不打开模态框）
                    }
                };

                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                /*--------------关联数据查询 开始-----------------*/

                //收支类型 (输入、粘贴查询)
                function getIoType(code) {
                    var postData = {
                        classId: "fd_io_type",
                        action: 'search',
                        data: {sqlwhere: "io_type_code = '" + code + "'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.fd_io_types.length > 0) {
                                var item = data.fd_io_types[0];
                                return {
                                    fd_io_type_id: item.fd_io_type_id,
                                    io_type_code: item.io_type_code,
                                    io_type_name: item.io_type_name,
                                };
                            } else {
                                return $q.reject("收支类型编码【" + code + "】无效");
                            }
                        });
                }

                //收支类型 (单元格双击查询)
                $scope.getIoTypeDoubleClicked = function (args) {
                    $modal.openCommonSearch({  //打开模态框
                            classId: 'fd_io_type',  //类id
                            postData: {},  //请求的携带数据(可以没有)
                            title: "收支类型",  //模态框标题
                            gridOptions: {  //表格定义
                                columnDefs: [
                                    {
                                        field: "io_type_code",
                                        headerName: "类型编码"
                                    }, {
                                        field: "io_type_name",
                                        headerName: "类型名称"
                                    }
                                ]
                            }
                        })
                        .result  //响应数据
                        .then(function (result) {
                            args.data.fd_io_type_id = result.fd_io_type_id;
                            args.data.io_type_code = result.io_type_code;
                            args.data.io_type_name = result.io_type_name;
                            args.api.refreshView();
                        });
                };

                //资产账户 输入、粘贴查询
                function getFundAccount(code) {
                    var postData = {
                        classId: "fd_fund_account",
                        action: 'search',
                        data: {sqlwhere: "fund_account_code = '" + code + "'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.fd_fund_accounts.length > 0) {
                                var item = data.fd_fund_accounts[0];
                                return {
                                    fd_fund_account_id: item.fd_fund_account_id,
                                    fund_account_code: item.fund_account_code,
                                    fund_account_name: item.fund_account_name,
                                };
                            } else {
                                return $q.reject("资金账户编码【" + code + "】无效");
                            }
                        });
                }

                //资金账户 (单元格双击查询)
                $scope.getFundAccountDoubleClicked = function (args) {
                    $modal.openCommonSearch({  //打开模态框
                            classId: 'fd_fund_account',  //类id
                            postData: {},  //请求的携带数据(可以没有)
                            title: "资金账户",  //模态框标题
                            gridOptions: {  //表格定义
                                columnDefs: [
                                    {
                                        field: "fund_account_code",
                                        headerName: "账户编码"
                                    }, {
                                        field: "fund_account_name",
                                        headerName: "账户名称"
                                    }
                                ]
                            }
                        })
                        .result  //响应数据
                        .then(function (result) {
                            args.data.fd_fund_account_id = result.fd_fund_account_id;
                            args.data.fund_account_code = result.fund_account_code;
                            args.data.fund_account_name = result.fund_account_name;
                            args.api.refreshView();
                        });
                };

                /*--------------关联数据查询 结束-----------------*/

                /*--------------按钮定义 开始-----------------*/

                //$scope.toolButtons = {};

                $scope.buttons = {
                    export: {
                        title: '导出',
                        icon: 'iconfont hc-daochu',
                        click: function () {
                            $scope.export && $scope.export();
                        }
                    },
                    save: {
                        title: '保存',
                        icon: 'fa fa-save',
                        click: function () {
                            $scope.save && $scope.save();
                        }
                    },
                    search: {
                        title: '筛选',
                        icon: 'iconfont hc-shaixuan',
                        click: function () {
                            $scope.is_filter = 2;
                            $scope.search && $scope.search();
                        }
                    }
                };

                //导出
                $scope.export = function () {
                    $scope.gridOptions.hcApi.exportToExcel();
                };

                /**
                 * 保存按钮事件
                 *
                 * 将勾选的数据新增到“现金日记账”或“银行日记账”
                 */
                $scope.save = function () {

                    var selectedNodes = $scope.gridOptions.api.getSelectedNodes();//行节点数据（包括rowIndex）
                    var selectRows = $scope.gridOptions.api.getSelectedRows();//行数据

                    if (selectRows.length <= 0) {
                        swalApi.info('请先选择要保存的行');
                        return;
                    }

                    var searchflag = 0;//1：现金日记账 ； 2：银行日记账

                    var checkRow = $scope.checkRowData(selectedNodes, selectRows);

                    if (checkRow.length > 0)
                        return swalApi.info("保存失败，【资金账户】必须填写且是有效的账户,请检查以下行：" + checkRow);

                    loopApi.forLoop(selectRows.length, function (i) {

                        var item = selectRows[i];//行数据

                        var postData = {};

                        //请求数据设置(请求数据只携带列表表头中包含的数据，多余的数据可能导致单据被判定为不当的类型，所以不直接绑定关联数据)
                        postData.base_balance_type_id = item.postData;//结算类型
                        postData.fd_fund_account_id = item.fd_fund_account_id;//资金账户
                        postData.fd_io_type_id = item.fd_io_type_id;//收支类型
                        postData.bill_no = item.bill_no;//票据号
                        postData.crm_entid = item.crm_entid;//品类
                        postData.vendor_id = item.vendor_id;//客户
                        postData.dept_id = item.dept_id;//部门
                        postData.note = item.note;//备注

                        //默认设置
                        postData.stat = 1;//设置为“制单”
                        postData.is_need_creedence = 1;//不勾选“要会计凭证”
                        postData.date_busine = dateApi.today();//业务日期
                        postData.date_fund = item.date_fund//记账日期ta.year_month = item.date_fund.substr(0, 7);//年月

                        /**
                         * 设置：借方金额(amount_credit)、贷方金额(amount_credit)
                         *
                         * 如果“付款金额” > 0
                         * 则：借方金额 = 0 ；贷方金额 = 采购付款单金额
                         *
                         *如果“回款金额” < 0（不存在等于0的情况）
                         * 则：借方金额 = 采购付款单金额(取绝对值) ；贷方金额 = 0
                         */
                        if (item.amount_credit > 0) {
                            postData.amount_credit = 0;//借方金额
                            postData.amount_credit = item.amount_credit;//贷方金额
                        } else if (item.amount_credit < 0) {
                            postData.amount_credit = Math.abs(item.amount_credit);//借方金额
                            postData.amount_credit = 0;//贷方金额
                        }

                        /**
                         * searchflag设置，设置请求数据postData，fund_account_type 资金账户
                         *
                         * fund_account_type（现金1）：
                         * 增加“现金日记账”,searchflag = 1
                         *
                         * fund_account_type（银行2、票据3）
                         * 增加“银行日记账”,searchflag = 2
                         */
                        if (selectRows[i].fund_account_type == 1) {
                            postData.searchflag = 1;
                        }
                        else {
                            postData.searchflag = 2;
                        }

                        requestApi.post("fd_fund_business", "insert", postData);

                    });

                    swalApi.info('保存成功');

                };

                /**
                 * 校验数据:
                 * （1）"资金账户"不能为空
                 *
                 * @param selectedNodes 行节点（包含行索引）
                 * @param selectRows 行数据
                 * @returns {string}
                 */
                $scope.checkRowData = function (selectedNodes, selectRows) {
                    var checkRow = [];

                    for (var i = 0; i < selectRows.length; i++) {
                        var rowNumber = selectedNodes[i].rowIndex + 1;//行数

                        if (selectRows[i].fd_fund_account_id == 0) {
                            checkRow.push(rowNumber);
                        }
                    }

                    return checkRow;
                }

                /*--------------按钮定义 结束-----------------*/
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




