/**
 * 引入采购付款 introduce_sale_payment
 * Created by zhl on 2019/3/19.
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
                        }, /*{
                         field: 'settlement_type',
                         headerName: '结算类型',
                         hcDictCode: '*'
                         //用作测试，测试后是否保留？
                         },*/ {
                            field: 'date_fund',
                            headerName: '记账日期',
                            type:'日期'
                        }, {
                            field: 'docket',
                            headerName: '摘要'
                        },{
                            headerName: '供应商',
                            children: [
                                {
                                    field: 'vendor_code',
                                    headerName: '编码',//必填
                                    editable: true,
                                    onCellValueChanged: function (args) {
                                        if (args)
                                            if (args.newValue === args.oldValue)
                                                return;
                                        //获取产品
                                        $scope.getVendor(args.newValue)
                                            .catch(function (reason) {
                                                return {
                                                    vendor_id: 0,
                                                    vendor_code: '',
                                                    vendor_name: reason
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
                                        $scope.getVendorDoubleClicked(args);
                                    }
                                },
                                {
                                    field: 'vendor_name',
                                    headerName: '名称'
                                }
                            ]
                        }, /* {
                            field: 'crm_entid',
                            headerName: '品类',
                            hcDictCode:'crm_entid',
                            editable: true
                        },*/ {
                            headerName: '金额',
                            children:[
                                {
                                    field: 'amount_debit',
                                    headerName: '借方',
                                    type:'金额'
                                },{
                                    field: 'amount_credit',
                                    headerName: '贷方',
                                    type:'金额'
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
                        },/*{
                            field: 'employee_name',
                            headerName: '业务员'
                        },*/ {
                            headerName: '资金账号',
                            children: [
                                {
                                    field: 'fund_account_code',
                                    headerName: '编码',
                                    hcRequired: true
                                }, {
                                    field: 'fund_account_name',
                                    headerName: '名称'
                                }
                            ]
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
                        },{
                            headerName: '收支类型',
                            children: [
                                {
                                    field: 'io_type_code',
                                    headerName: '编码'
                                }, {
                                    field: 'io_type_name',
                                    headerName: '名称'
                                }
                            ]
                        },{
                            field: 'credence_no',
                            headerName: '凭证号'
                        },  {
                            field: 'bill_no',
                            headerName: '票据号'
                        }, {
                            field: 'is_need_creedence',
                            headerName: '要会计凭证',
                            type: '是否'
                        }, {
                            field: 'is_credence',
                            headerName: '产生凭证否',
                            type: '是否'
                        }, {
                            field: 'attachcount',
                            headerName: '附件'
                        }, {
                            field: 'note',
                            headerName: '备注'
                        }
                    ],
                    hcClassId:'fd_fund_business',
                    hcBeforeRequest: function (searchObj) {
                        searchObj.sqlwhere = '';
                        searchObj.searchflag = 12;
                        searchObj.sqlwhere = 'stat = 5 and amount_credit = 0 ';

                        /*//替换sqlwhere stat = 1 ,改为 已审核、结算类型为 “现金”（settlement_type=1）或“银行”（settlement_type=2）、当前月、贷方金额=0
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
                        searchObj.sqlwhere =
                            where.replace('stat = 1',
                                'stat = 5 and amount_credit = 0');*/
                    },
                    hcAfterRequest: function (data) {
                        $scope.data.currItem = data;

                        console.log($scope.data.currItem.fd_fund_businesss,'test');

                        //“凭证号”不为空时，设置“产生凭证否”为“是”
                        loopApi.forLoop($scope.data.currItem.fd_fund_businesss.length, function (i) {
                            if($scope.data.currItem.fd_fund_businesss[i].credence_no != '')
                                $scope.data.currItem.fd_fund_businesss[i].is_credence = 2;
                        });
                    },
                    hcEvents: function () {
                        cellDoubleClicked = function () {};//覆盖掉父控制器的双击事件（不打开模态框）
                    }
                };

                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                /*--------------关联数据查询 开始-----------------*/

                //客户 输入、粘贴查询
                $scope.getVendor = function(code) {
                    var postData = {
                        classId: "vendor_org",
                        action: 'search',
                        data: {sqlwhere: "vendor_code = '" + code + "'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.vendor_orgs.length > 0) {
                                var item = data.vendor_orgs[0];
                                return {
                                    vendor_id: item.vendor_id,
                                    vendor_code: item.vendor_code,
                                    vendor_name: item.vendor_name,
                                };
                            } else {
                                return $q.reject("客户编码【" + code + "】无效");
                            }
                        });
                }

                //客户 (单元格双击查询)
                $scope.getVendorDoubleClicked = function (args) {
                    $modal.openCommonSearch({  //打开模态框
                            classId: 'vendor_org',  //类id
                            postData: {},  //请求的携带数据(可以没有)
                            title: "客户资料",  //模态框标题
                            gridOptions: {  //表格定义
                                columnDefs: [
                                    {
                                        field: "vendor_code",
                                        headerName: "客户编码"
                                    }, {
                                        field: "vendor_name",
                                        headerName: "客户名称"
                                    }
                                ]
                            }
                        })
                        .result  //响应数据
                        .then(function (result) {
                            args.data.vendor_id = result.vendor_id;
                            args.data.vendor_code = result.vendor_code;
                            args.data.vendor_name = result.vendor_name;
                            args.api.refreshView();
                        });
                };

                /*--------------关联数据查询 结束-----------------*/

                /*--------------按钮定义 开始-----------------*/

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
                    },
                };

                //导出
                $scope.export = function () {
                    $scope.gridOptions.hcApi.exportToExcel();
                }

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

                    var searchflag = 7;//增加一条数据到【采购付款】

                    var checkRow = $scope.checkRowData(selectedNodes, selectRows);

                    if (checkRow.length > 0)
                        return swalApi.info("保存失败，【供应商编码】必须填写且是有效数据,请检查以下行：" + checkRow);

                    loopApi.forLoop(selectRows.length, function (i) {

                        var item = selectRows[i];//行数据

                        var postData = {};

                        //请求数据设置(请求数据只携带列表表头中包含的数据，多余的数据可能导致单据被判定为不当的类型，所以不直接绑定关联数据)
                        postData.docket = item.docket;//摘要
                        postData.vendor_id = item.vendor_id;//供应商
                        postData.amount_debit = item.amount_debit;//借方金额
                        postData.amount_credit = item.amount_credit;//贷方金额
                        postData.dept_id = item.dept_id;//部门

                        postData.fd_fund_account_id = item.fd_fund_account_id;//资金账户
                        postData.base_balance_type_id = item.base_balance_type_id;//结算类型
                        postData.fd_io_type_id = item.fd_io_type_id;//收支类型
                        postData.credence_no = item.credence_no;//凭证号
                        postData.bill_no = item.bill_no;//票据号
                        postData.is_need_creedence = item.is_need_creedence;//要会计凭证
                        postData.is_credence = item.is_credence;//产生凭证否
                        postData.note = item.note;//备注

                        //默认设置
                        postData.stat = 1;//设置为“制单”
                        postData.date_busine = dateApi.today();//业务日期
                        postData.date_fund = item.date_fund//记账日期

                        postData.searchflag = searchflag;

                        requestApi.post("fd_fund_business", "insert", postData);

                    });

                    swalApi.info('保存成功');

                }

                /**
                 * 校验数据:
                 * （1）“客户信息”不能为空
                 * （2）“品类”不能为空
                 *
                 * @param selectedNodes 行节点（包含行索引）
                 * @param selectRows 行数据
                 * @returns {string} 数组：需要检查的行数
                 */
                $scope.checkRowData = function (selectedNodes, selectRows) {
                    var checkRow = [];

                    for (var i = 0; i < selectRows.length; i++) {
                        var rowNumber = selectedNodes[i].rowIndex + 1;//行数

                        if (!selectRows[i].vendor_id || selectRows[i].vendor_id == 0) {
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







