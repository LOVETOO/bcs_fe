/**
 * 客户资料属性页 customer_org_prop
 * 2018-12-06
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', '$q', 'swalApi', 'loopApi'],
    function (module, controllerApi, base_obj_prop, $q, swalApi, loopApi) {
        'use strict';

        var controller = [
                //声明依赖注入
                '$scope', '$modal', '$stateParams',
                //控制器函数
                function ($scope, $modal, $stateParams) {
                    //网格定义 基本信息
                    $scope.gridOptions = {
                        columnDefs: [
                            {
                                type: '序号'
                            }, {
                                field: 'address1',
                                headerName: '送货地址',
                                editable: true,
                                suppressSizeToFit: false,
                                minWidth: 311
                            }, {
                                field: 'defaulted',
                                headerName: '默认地址',
                                type: '是否',
                                editable: true,
                                suppressSizeToFit: false,
                                minWidth: 101,
                                onCellValueChanged: function (args) {
                                    if (args.newValue === args.oldValue)
                                        return;

                                    $scope.onDefaultedChange(args);
                                }
                            }, {
                                field: 'take_man',
                                headerName: '提货人姓名',
                                editable: true,
                                suppressSizeToFit: false,
                                minWidth: 120
                            }, {
                                field: 'phone_code',
                                headerName: '提货人电话',
                                editable: true,
                                suppressSizeToFit: false,
                                minWidth: 120
                            }, {
                                field: 'note',
                                headerName: '备注',
                                editable: true,
                                suppressSizeToFit: false,
                                minWidth: 276
                            }
                        ],
                        hcObjType: $stateParams.objtypeid
                    };

                    //网格定义 经销品类
                    $scope.gridOptions_cs = {
                        columnDefs: [
                            {
                                type: '序号'
                            }, {
                                field: 'crm_entid',
                                headerName: '品类',
                                hcDictCode: 'crm_entid',
                                editable: true,
                                suppressSizeToFit: false,
                                minWidth: 180

                            }, {
                                field: 'saleprice_type_name',
                                headerName: '价格类型',
                                onCellDoubleClicked: function (args) {
                                    $scope.chooseSalePriceType(args);
                                },
                                onCellValueChanged: function (args) {
                                    if (args.newValue === args.oldValue)
                                        return;
                                },
                                suppressSizeToFit: false,
                                minWidth: 180
                            }, {
                                field: 'sale_employee_name',
                                headerName: '业务员',
                                onCellDoubleClicked: function (args) {
                                    $scope.chooseSaleEmployee(args);
                                },
                                onCellValueChanged: function (args) {
                                    if (args.newValue === args.oldValue)
                                        return;
                                },
                                suppressSizeToFit: false,
                                minWidth: 180
                            }, {
                                field: 'dept_name',
                                headerName: '部门',
                                onCellDoubleClicked: function (args) {
                                    $scope.chooseDept(args);
                                },
                                onCellValueChanged: function (args) {
                                    if (args.newValue === args.oldValue)
                                        return;
                                },
                                suppressSizeToFit: false,
                                minWidth: 180
                            }, {
                                field: 'note',
                                headerName: '备注',
                                editable: true,
                                suppressSizeToFit: false,
                                minWidth: 222
                            }
                        ]
                    };

                    //继承基础控制器
                    controllerApi.run({
                        controller: base_obj_prop.controller,
                        scope: $scope
                    });

                    /*-------------------数据定义、初始化、校验 开始----------------*/

                    //获取绑定数据
                    function getCurrItem() {
                        return $scope.data.currItem;
                    }

                    /**
                     * 保存前验证以下内容
                     * （1）、只能有一行明细是默认地址
                     */
                    $scope.validCheck = function (invalidBox) {
                        $scope.hcSuper.validCheck(invalidBox);

                        var defaultedRow = [];//记录第几行被选为了默认地址
                        var index = 0;
                        var lines = getCurrItem().customer_addressofcustomer_orgs.slice(0);

                        //检验 只能由一行明细为默认地址
                        if (lines.length) {
                            loopApi.forLoop(lines.length, function (i) {
                                if (lines[i].defaulted == 2) {
                                    defaultedRow[index] = i + 1;
                                    index++;
                                }
                            });
                        }

                        var rowOfWarning = '';
                        if (defaultedRow.length > 1) {
                            loopApi.forLoop(defaultedRow.length, function (i) {
                                if (i == 0)
                                    rowOfWarning += '[第' + defaultedRow[i] + '行,';//首个
                                else if ((i + 1) == defaultedRow.length)
                                    rowOfWarning += '第' + defaultedRow[i] + '行]';//最后
                                else
                                    rowOfWarning += '第' + defaultedRow[i] + '行,';//中间
                            });

                            invalidBox.push('只能有一行明细是默认地址！请检查以下行：' + rowOfWarning);
                        }

                        return invalidBox;
                    };

                    /**
                     * 新增时的绑定数据、网格默认设置
                     */
                    $scope.newBizData = function (bizData) {
                        //$scope.hcSuper.newBizData(bizData);
                        $scope.hcSuper.newBizData($scope.data.currItem = bizData);

                        bizData.ar_type = 1;
                        bizData.base_currency_id = 1;
                        bizData.usable = 2;
                        bizData.is_relation = 1;

                        bizData.customer_addressofcustomer_orgs = [];
                        $scope.gridOptions.hcApi.setRowData(bizData.customer_addressofcustomer_orgs);

                        bizData.customer_salepriceofcustomer_orgs = [];
                        $scope.gridOptions.hcApi.setRowData(bizData.customer_salepriceofcustomer_orgs);
                    };

                    /**
                     * 加载属性页时初始化,设置数据
                     */
                    $scope.setBizData = function (bizData) {
                        $scope.hcSuper.setBizData(bizData);

                        $scope.gridOptions.hcApi.setRowData(bizData.customer_addressofcustomer_orgs);
                        $scope.gridOptions_cs.hcApi.setRowData(bizData.customer_salepriceofcustomer_orgs);
                    };

                    /**
                     * 保存前的数据处理
                     */
                    $scope.saveBizData = function (bizData) {
                        $scope.hcSuper.saveBizData(bizData);
                        bizData.customer_kind = 1;
                    };
                    /**
                     * 复制时的默认数据设置
                     */
                    $scope.copyBizData = function (bizData) {
                        $scope.hcSuper.copyBizData(bizData);

                        //初始化不需要复制的数据
                        bizData.created_by = '';
                        bizData.creation_date = '';
                        bizData.last_updated_by = '';
                        bizData.last_update_date = '';

                        bizData.customer_addressofcustomer_orgs = [];//明细
                        bizData.short_name = '';//简称
                        bizData.note = '';//简介


                    };

                    /*-------------------数据定义、初始化、校验 结束----------------*/

                    /*--------------------- 通用查询 开始---------------------------*/

                    //点击查询按钮 查询销售价格类型
                    $scope.commonSearchSettingOfSalePriceType = {
                        afterOk: function (result) {
                            getCurrItem().sa_saleprice_type_id = result.sa_saleprice_type_id;
                            getCurrItem().saleprice_type_code = result.saleprice_type_code;
                            getCurrItem().saleprice_type_name = result.saleprice_type_name;
                        }
                    };

                    //双击网格 查询销售价格类型
                    $scope.chooseSalePriceType = function (args) {
                        if (!args)
                            return;

                        $modal.openCommonSearch({
                                classId: 'sa_saleprice_type',
                                postData: {},
                                title: "销售价格类型",
                                gridOptions: {
                                    columnDefs: [
                                        {
                                            field: "saleprice_type_code",
                                            headerName: "类型编码"
                                        },
                                        {
                                            field: "saleprice_type_name",
                                            headerName: "类型名称"
                                        }
                                    ]
                                },
                                ignorecase: true,
                                searchlist: ["saleprice_type_code", "saleprice_type_name"]
                            })
                            .result
                            .then(function (result) {
                                $scope.gridOptions.api.stopEditing();

                                args.data.sa_saleprice_type_id = result.sa_saleprice_type_id;
                                args.data.saleprice_type_code = result.saleprice_type_code;
                                args.data.saleprice_type_name = result.saleprice_type_name;
                                args.api.refreshView();
                            });
                    };

                    //点击查询按钮 查业务员
                    $scope.commonSearchSettingOfSaleEmployee = {
                        afterOk: function (result) {
                            getCurrItem().sale_employee_id = result.sale_employee_id;
                            getCurrItem().employee_code = result.employee_code;
                            getCurrItem().employee_name = result.employee_name;
                        }
                    };

                    //双击网格 查业务员
                    $scope.chooseSaleEmployee = function (args) {
                        if (!args)
                            return;

                        $modal.openCommonSearch({
                                classId: 'sale_employee',
                                postData: {},
                                title: "业务员资料",
                                gridOptions: {
                                    columnDefs: [
                                        {
                                            field: "employee_code",
                                            headerName: "业务员编码"
                                        },
                                        {
                                            field: "employee_name",
                                            headerName: "业务员名称"
                                        }
                                    ]
                                },
                                ignorecase: true,
                                searchlist: ["employee_code", "employee_name"]
                            })
                            .result
                            .then(function (result) {
                                $scope.gridOptions.api.stopEditing();

                                args.data.sale_employee_id = result.sale_employee_id;
                                args.data.sale_employee_code = result.employee_code;
                                args.data.sale_employee_name = result.employee_name;
                                args.api.refreshView();
                            });
                    };

                    //查业行政区域
                    $scope.commonSearchSettingOfCpcarea = {
                        afterOk: function (result) {
                            getCurrItem().areaid = result.areaid;
                            getCurrItem().areacode = result.areacode;
                            getCurrItem().areaname = result.areaname;
                        }
                    };

                    //查业销售区域
                    $scope.commonSearchSettingOfSalearea = {
                        afterOk: function (result) {
                            getCurrItem().sale_area_id = result.sale_area_id;
                            getCurrItem().sale_area_code = result.sale_area_code;
                            getCurrItem().sale_area_name = result.sale_area_name;
                        }
                    };

                    //点击查询按钮 查部门
                    $scope.commonSearchSettingOfDept = {
                        afterOk: function (result) {
                            getCurrItem().dept_id = result.dept_id;
                            getCurrItem().dept_code = result.dept_code;
                            getCurrItem().dept_name = result.dept_name;
                        }
                    };

                    //双击网格 查部门
                    $scope.chooseDept = function (args) {
                        if (!args)
                            return;

                        $modal.openCommonSearch({
                                classId: 'dept',
                                postData: {},
                                title: "部门查询",
                                gridOptions: {
                                    columnDefs: [
                                        {
                                            field: "dept_code",
                                            headerName: "部门编码"
                                        },
                                        {
                                            field: "dept_name",
                                            headerName: "部门名称"
                                        }
                                    ]
                                },
                                ignorecase: true,
                                searchlist: ["dept_code", "dept_name"]
                            })
                            .result
                            .then(function (result) {
                                $scope.gridOptions.api.stopEditing();

                                args.data.dept_id = result.dept_id;
                                args.data.dept_code = result.dept_code;
                                args.data.dept_name = result.dept_name;
                                args.api.refreshView();
                            });
                    };

                    //查业会计科目
                    $scope.commonSearchSettingOfAccountSubject = {
                        //主营业务收入科目
                        zyywsrkm: {
                            sqlWhere: " end_km = 2 ",
                            afterOk: function (result) {
                                getCurrItem().gl_account_subject_id_zyysl = result.gl_account_subject_id;
                                getCurrItem().code_zyysl = result.km_code;
                                getCurrItem().name_zyysl = result.km_name;
                            }
                        },
                        //应收账科目
                        yszkm: {
                            sqlWhere: " end_km = 2 ",
                            afterOk: function (result) {
                                getCurrItem().gl_account_subject_id_yszk = result.gl_account_subject_id;
                                getCurrItem().code_yszk = result.km_code;
                                getCurrItem().name_yszk = result.km_name;
                            }
                        },
                        //应收票据科目
                        yspjkm: {
                            sqlWhere: " end_km = 2 ",
                            afterOk: function (result) {
                                getCurrItem().gl_account_subject_id_ar = result.gl_account_subject_id;
                                getCurrItem().code_ar = result.km_code;
                                getCurrItem().name_ar = result.km_name;
                            }
                        },
                        //其他业务收入科目
                        qtywsrkm: {
                            sqlWhere: " end_km = 2 ",
                            afterOk: function (result) {
                                getCurrItem().gl_account_subject_id_qtywsl = result.gl_account_subject_id;
                                getCurrItem().code_qtywsl = result.km_code;
                                getCurrItem().name_qtywsl = result.km_name;
                            }
                        },
                        //主营业务成本
                        zyywcb: {
                            sqlWhere: " end_km = 2 ",
                            afterOk: function (result) {
                                getCurrItem().gl_account_subject_id_zyywcb = result.gl_account_subject_id;
                                getCurrItem().code_zyywcb = result.km_code;
                                getCurrItem().name_zyywcb = result.km_name;
                            }
                        },
                        //其他业务支出
                        qtywzc: {
                            sqlWhere: " end_km = 2 ",
                            afterOk: function (result) {
                                getCurrItem().gl_account_subject_id_qtywzc = result.gl_account_subject_id;
                                getCurrItem().code_qtywzc = result.km_code;
                                getCurrItem().name_qtywzc = result.km_name;
                            }
                        }
                    }

                    //查询总公司客户
                    $scope.commonSearchGroupCustomer = {
                        sqlWhere: (getCurrItem().customer_org_id ) ?
                            (" is_groupcustomer = 2 and customer_org_id <> " + getCurrItem().customer_org_id) : (" is_groupcustomer = 2"),
                        afterOk: function (result) {
                            getCurrItem().group_customer_id = result.customer_id;
                            getCurrItem().group_customer_code = result.customer_code;
                            getCurrItem().group_customer_name = result.customer_name;
                        }
                    }

                    //查询货币
                    $scope.commonSearchSettingOfCurrency = {
                        afterOk: function (result) {
                            getCurrItem().base_currency_id = result.base_currency_id;
                            getCurrItem().currency_name = result.currency_name;
                        }
                    }

                    /*--------------------- 通用查询 结束---------------------------*/

                    /*-------------------事件开始---------------------*/
                    /*
                     * “科目”相关的按钮[x]点击后触发事件。
                     * @param suffix : 后缀名称
                     * */
                    $scope.clearSubjectAfterDelete = function (suffix) {
                        var target = '';

                        //依次删除对应id、code、name
                        target = 'gl_account_subject_id_' + suffix;
                        getCurrItem()[target] = '';
                        target = 'code_' + suffix;
                        getCurrItem()[target] = '';
                        target = 'name_' + suffix;
                        getCurrItem()[target] = '';
                    }

                    /**
                     *“子公司”、“总公司”单选框点击事件
                     * @param boxType 选框类型
                     */
                    $scope.onBoxChange = function (boxType) {

                        if (boxType == "groupcustomer") {//当“总公司”选框被点击
                            //将“子公司”取消勾选
                            if (getCurrItem().is_relation == 2)
                                getCurrItem().is_relation = 1;
                            //清空对应的内容
                            getCurrItem().group_customer_code = '';
                            getCurrItem().group_customer_name = '';
                            getCurrItem().group_customer_id = '';
                        } else {//当“子公司”选框被点击
                            //将“总公司”取消勾选
                            if (getCurrItem().is_groupcustomer == 2)
                                getCurrItem().is_groupcustomer = 1;
                            //当“子公司”变为不勾选状态时，清空对应内容
                            if (getCurrItem().is_relation == 1) {
                                getCurrItem().group_customer_code = '';
                                getCurrItem().group_customer_name = '';
                                getCurrItem().group_customer_id = '';
                            }
                        }
                    }

                    //网格"默认送货地址"变更事件
                    $scope.onDefaultedChange = function (args) {
                        if (args.data.defaulted == 1)
                            return;

                        var lines = getCurrItem().customer_addressofcustomer_orgs.slice(0);
                        var rowIndex = args.node.rowIndex;//发生改变的行的索引

                        if (lines.length > 0) {
                            loopApi.forLoop(lines.length, function (i) {
                                //不是正在修改行，且默认地址为“是”
                                if (i != rowIndex && lines[i].defaulted == 2) {
                                    lines[i].defaulted = 1;
                                }
                            });
                        }

                        $scope.gridOptions.hcApi.setRowData(lines);
                    }

                    //“发货类型”值变更事件
                    $scope.saleTypeChanged = function () {
                        var saleType = getCurrItem().sale_type;
                        if (saleType == 1)
                            getCurrItem().crebit_ctrl = 2;//发货类型选择为“先款后货”，则财务属性页下的“发货信用控制”自动勾选
                        else
                            getCurrItem().crebit_ctrl = 1;//发货类型为其他选项时，财务属性页下的“发货信用控制”不勾选；


                    }

                    /*-------------------事件结束---------------------*/

                    /*-----------------按钮定义及相关函数 开始----------------------*/

                    //隐藏标签页
                    //$scope.tabs.wf.hide = true;
                    //$scope.tabs.attach.hide = true;
                    //修改标签页标题
                    $scope.tabs.base.title = '基本信息';

                    $scope.tabs.fa = {
                        title: '财务属性'
                    };

                    $scope.tabs.cs = {
                        title: '经销品类'
                    };

                    $scope.tabs.other = {
                        title: "其他"
                    }

                    //底部左边按钮
                    $scope.footerLeftButtons.add_line = {
                        title: '增加行',
                        click: function () {
                            $scope.add_line && $scope.add_line();
                        },
                        hide: function () {
                            return (!$scope.tabs.cs.active && !$scope.tabs.base.active);//不用写onTabChange事件
                        }
                    };
                    $scope.footerLeftButtons.del_line = {
                        title: '删除行',
                        click: function () {
                            $scope.del_line && $scope.del_line();
                        },
                        hide: function () {
                            return (!$scope.tabs.cs.active && !$scope.tabs.base.active);
                        }
                    };

                    /**
                     * 增加行
                     */
                    $scope.add_line = function () {
                        $scope.gridOptions.api.stopEditing();
                        if ($scope.tabs.base.active == true) {
                            //基本信息’"
                            var line = {
                                address1: getCurrItem().address1,
                                defaulted: getCurrItem().defaulted,
                                take_man: getCurrItem().take_man,
                                phone_code: getCurrItem().phone_code,
                            };

                            //判断是否已有地址明细
                            var addresses_length = getCurrItem().customer_addressofcustomer_orgs.length;

                            //判断是否所有地址明细都不是默认地址
                            var lines = getCurrItem().customer_addressofcustomer_orgs.slice(0);
                            var allDinied = true;
                            if (lines.length) {
                                loopApi.forLoop(lines.length, function (i) {
                                    if (lines[i].defaulted == 2)
                                        allDinied = false;
                                });
                            }

                            //当没有地址明细时或者全部明细都不是默认地址，新增行为默认地址
                            addresses_length == 0 || allDinied ? line.defaulted = 2 : line.defaulted = 1;

                            getCurrItem().customer_addressofcustomer_orgs.push(line);
                            $scope.gridOptions.hcApi.setRowData(getCurrItem().customer_addressofcustomer_orgs);
                        }
                        if ($scope.tabs.cs.active == true) {
                            //‘品类与价格类型’

                            var line_cs = {
                                crm_name: "",
                                saleprice_type_name: "",
                                sale_employee_name: "",
                                dept_name: "",
                                note: "",
                            };

                            //getCurrItem().customer_salepriceofcustomer_orgs = [];
                            getCurrItem().customer_salepriceofcustomer_orgs.push(line_cs);
                            $scope.gridOptions_cs.hcApi.setRowData(getCurrItem().customer_salepriceofcustomer_orgs);
                        }

                    };

                    /**
                     * 删除行
                     */
                    $scope.del_line = function () {
                        var idx;
                        if ($scope.tabs.base.active == true)
                            idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                        else
                            idx = $scope.gridOptions_cs.hcApi.getFocusedRowIndex();

                        if (idx < 0) {
                            swalApi.info('请选中要删除的行');
                        } else {
                            if ($scope.tabs.base.active == true) {
                                getCurrItem().customer_addressofcustomer_orgs.splice(idx, 1);
                                $scope.gridOptions.hcApi.setRowData(getCurrItem().customer_addressofcustomer_orgs);
                            }
                            if ($scope.tabs.cs.active == true) {
                                getCurrItem().customer_salepriceofcustomer_orgs.splice(idx, 1);
                                $scope.gridOptions_cs.hcApi.setRowData(getCurrItem().customer_salepriceofcustomer_orgs);
                            }
                        }
                    };

                    /*-----------------按钮定义及相关函数 结束----------------------*/

                }
            ]
            ;

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);
