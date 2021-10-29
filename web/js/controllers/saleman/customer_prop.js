/**
 * 客户资料属性页
 * 2018-12-06
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'loopApi'],
    function (module, controllerApi, base_obj_prop, swalApi, loopApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', 'BasemanService', '$stateParams',
            //控制器函数
            function ($scope, BasemanService, $stateParams) {
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
                    ]
                };

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
                                $scope.chooseSalePrice(args);
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
                                $scope.chooseEmployee(args);
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

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*-------------------通用查询开始------------------------*/

                //查销售价格类型
                $scope.chooseSalePrice = function (args) {
                    $scope.FrmInfo = {
                        title: "销售价格类型",
                        thead: [{
                            name: "类型编码",
                            code: "saleprice_type_code"
                        }, {
                            name: "类型名称",
                            code: "saleprice_type_name"
                        }],
                        classid: "sa_saleprice_type",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        //sqlBlock: "km_type = 1",//科目类型：资产
                        ignorecase: true,
                        searchlist: ["saleprice_type_code", "saleprice_type_name", "sa_saleprice_type_id"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        if (args == null || args == '') {//对“基本信息”中的“销售价格类型”进行变更
                            $scope.data.currItem.sa_saleprice_type_id = result.sa_saleprice_type_id;
                            $scope.data.currItem.saleprice_type_code = result.saleprice_type_code;
                            $scope.data.currItem.saleprice_type_name = result.saleprice_type_name;
                        } else {//对“品类与销售价格”网格中的“价格类型”部分进行变更
                            args.data.sa_saleprice_type_id = result.sa_saleprice_type_id;
                            args.data.saleprice_type_code = result.saleprice_type_code;
                            args.data.saleprice_type_name = result.saleprice_type_name;
                            args.api.refreshView();
                        }
                    })
                };

                //查业务员
                $scope.chooseEmployee = function (args) {
                    $scope.FrmInfo = {
                        title: "业务员资料   ",
                        thead: [{
                            name: "业务员编码",
                            code: "employee_code"
                        }, {
                            name: "业务员名称",
                            code: "employee_name"
                        }],
                        classid: "sale_employee",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        ignorecase: true,
                        searchlist: ["employee_code", "employee_name", "sale_employee_id"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        if (args == null || args == '') {//对“基本信息”中的“业务员”进行变更
                            $scope.data.currItem.sale_employee_id = result.sale_employee_id;
                            $scope.data.currItem.employee_code = result.employee_code;
                            $scope.data.currItem.employee_name = result.employee_name;
                        } else {//对“品类与销售价格”网格中的“业务员”部分进行变更
                            //swalApi.info( result.employee_name +  result.sale_employee_id);
                            args.data.sale_employee_id = result.sale_employee_id;
                            args.data.sale_employee_code = result.employee_code;
                            args.data.sale_employee_name = result.employee_name;
                            args.api.refreshView();
                        }
                    })
                };

                //查业行政区域
                $scope.chooseCpcarea = function () {
                    $scope.FrmInfo = {
                        title: "行政区域",
                        thead: [{
                            name: "区域编码",
                            code: "areacode"
                        }, {
                            name: "区域名称",
                            code: "areaname"
                        }],
                        classid: "cpcarea",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        //sqlBlock: "km_type = 1",//科目类型：资产
                        ignorecase: true,
                        searchlist: ["areacode", "areaname", "areaid"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        $scope.data.currItem.areaid = result.areaid;
                        $scope.data.currItem.areacode = result.areacode;
                        $scope.data.currItem.areaname = result.areaname;
                    })
                };

                //查业销售区域
                $scope.chooseSalearea = function () {
                    $scope.FrmInfo = {
                        title: "销售区域",
                        thead: [{
                            name: "区域编码",
                            code: "sale_area_code"
                        }, {
                            name: "区域名称",
                            code: "sale_area_name"
                        }],
                        classid: "sale_salearea",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        //sqlBlock: "km_type = 1",//科目类型：资产
                        ignorecase: true,
                        searchlist: ["sale_area_code", "sale_area_name", "sale_area_id"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        $scope.data.currItem.sale_area_id = result.sale_area_id;
                        $scope.data.currItem.sale_area_code = result.sale_area_code;
                        $scope.data.currItem.sale_area_name = result.sale_area_name;
                    })
                };

                //查业会计科目
                $scope.chooseSubject = function (searchType) {
                    $scope.FrmInfo = {
                        title: "会计科目",
                        thead: [{
                            name: "科目编码",
                            code: "km_code"
                        }, {
                            name: "科目名称",
                            code: "km_name"
                        }/*, {
                         name: "id",
                         code: "gl_account_subject_id"
                         }*/],
                        classid: "gl_account_subject",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        //sqlBlock: "km_type = 1",//科目类型：资产
                        ignorecase: true,
                        searchlist: ["km_code", "km_name"]//模糊查询允许使用的字段
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        if (searchType == 'zyywsrkm') {
                            $scope.data.currItem.gl_account_subject_id_zyysl = result.gl_account_subject_id;
                            $scope.data.currItem.code_zyysl = result.km_code;
                            $scope.data.currItem.name_zyysl = result.km_name;
                        }
                        else if (searchType == 'yszkm') {
                            $scope.data.currItem.gl_account_subject_id_yszk = result.gl_account_subject_id;
                            $scope.data.currItem.code_yszk = result.km_code;
                            $scope.data.currItem.name_yszk = result.km_name;
                        } else if (searchType == 'yspjkm') {
                            $scope.data.currItem.gl_account_subject_id_ar = result.gl_account_subject_id;
                            $scope.data.currItem.code_ar = result.km_code;
                            $scope.data.currItem.name_ar = result.km_name;
                        } else if (searchType == 'qtywsrkm') {
                            $scope.data.currItem.gl_account_subject_id_qtywsl = result.gl_account_subject_id;
                            $scope.data.currItem.code_qtywsl = result.km_code;
                            $scope.data.currItem.name_qtywsl = result.km_name;
                        } else if (searchType == 'zyywcb') {
                            $scope.data.currItem.gl_account_subject_id_zyywcb = result.gl_account_subject_id;
                            $scope.data.currItem.code_zyywcb = result.km_code;
                            $scope.data.currItem.name_zyywcb = result.km_name;
                        } else if (searchType == 'qtywzc') {
                            $scope.data.currItem.gl_account_subject_id_qtywzc = result.gl_account_subject_id;
                            $scope.data.currItem.code_qtywzc = result.km_code;
                            $scope.data.currItem.name_qtywzc = result.km_name;
                        }
                    })
                };

                //查询总公司客户
                $scope.chooseGroupcustomer = function (isRelation) {
                    /*if(!isRelation){
                     swalApi.info("【总公司】已勾选，无需在此选择");
                     return;
                     }*/

                    $scope.FrmInfo = {
                        title: "总公司客户",
                        thead: [{
                            name: "客户编码",
                            code: "customer_code"
                        }, {
                            name: "客户名称",
                            code: "customer_name"
                        }],
                        classid: "customer",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        //sqlBlock: "km_type = 1",//科目类型：资产
                        ignorecase: true,
                        searchlist: ["customer_code", "customer_name", "customer_id"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        $scope.data.currItem.group_customer_id = result.customer_id;
                        $scope.data.currItem.group_customer_code = result.customer_code;
                        $scope.data.currItem.group_customer_name = result.customer_name;
                    })
                };

                /**
                 * 查询销售归属部门
                 */
                $scope.searchDept = function (args) {
                    $scope.FrmInfo = {
                        title: "部门或机构查询  ",
                        thead: [{
                            name: "部门或机构编码",
                            code: "dept_code",
                        }, {
                            name: "部门或机构名称",
                            code: "dept_name",
                        },],
                        classid: "dept",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        sqlBlock: "",//过滤？
                        backdatas: "depts",
                        ignorecase: "true", //忽略大小写
                        postdata: {},
                        realtime: true,
                        searchlist: ["dept_code", "dept_name", "dept_id"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        $scope.data.currItem.dept_id = result.dept_id;
                        $scope.data.currItem.dept_code = result.dept_code;
                        $scope.data.currItem.dept_name = result.dept_name;
                    });
                };
                $scope.chooseDept = function (args) {
                    $scope.FrmInfo = {
                        title: "部门或机构查询  ",
                        thead: [{
                            name: "部门或机构编码",
                            code: "dept_code",
                        }, {
                            name: "部门或机构名称",
                            code: "dept_name",
                        },],
                        classid: "Dept",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        sqlBlock: "",//过滤？
                        backdatas: "depts",
                        ignorecase: "true", //忽略大小写
                        postdata: {},
                        realtime: true,
                        searchlist: ["dept_code", "dept_name", "dept_id"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        args.data.dept_id = result.dept_id;
                        args.data.dept_code = result.dept_code;
                        args.data.dept_name = result.dept_name;
                        args.api.refreshView();
                    })
                };

                /*-------------------通用查询结束---------------------*/

                /*-------------------事件开始---------------------*/
                //“子公司”、“总公司”单选框点击事件
                $scope.onBoxChange = function (isGP) {//是否总公司
                    if (isGP == "groupcustomer") {
                        //swalApi.info($scope.data.currItem.is_relation);
                        if ($scope.data.currItem.is_relation == 2)
                            $scope.data.currItem.is_relation = 1;
                        $scope.data.currItem.group_customer_code = '';
                        $scope.data.currItem.group_customer_name = '';
                        $scope.data.currItem.group_customer_id = '';

                    } else {
                        if ($scope.data.currItem.is_groupcustomer == 2)
                            $scope.data.currItem.is_groupcustomer = 1;
                    }
                }

                //网格"默认送货地址"变更事件
                $scope.onDefaultedChange = function(args){
                    if(args.data.defaulted == 1)
                        return;
                    var lines = $scope.data.currItem.customer_addressofcustomer_orgs.slice(0);
                    var id = args.data.customer_address_id;//发生改变的行
                    if (lines.length) {
                        loopApi.forLoop(lines.length, function (i) {
                            if (lines[i].customer_address_id != id && lines[i].defaulted == 2) {
                                lines[i].defaulted = 1;
                            }
                        });
                    }
                    $scope.gridOptions.hcApi.setRowData(lines);
                }

                /*-------------------事件结束---------------------*/

                /**
                 * 保存前验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);

                    var defaultedRow = [];
                    var index = 0;
                    var lines = $scope.data.currItem.customer_addressofcustomer_orgs.slice(0);
                    //检验 只能由一行明细为默认地址
                    if (lines.length) {
                        loopApi.forLoop(lines.length, function (i) {
                            if (lines[i].defaulted == 2) {
                                defaultedRow[index] = i + 1;
                                index++;
                                console.log(i);
                            }
                        });
                    }
                    var rowStr = '';
                    if (defaultedRow.length > 1) {
                        loopApi.forLoop(defaultedRow.length, function (i) {
                            if (i == 0)
                                rowStr += '[第' + defaultedRow[i] + '行,';//首个
                            else if ((i + 1) == defaultedRow.length)
                                rowStr += '第' + defaultedRow[i] + '行]';//最后
                            else
                                rowStr += '第' + defaultedRow[i] + '行,';//中间
                        });
                        //console.log(defaultedRow);
                        invalidBox.push('只能有一行明细是默认地址！请检查以下行：' + rowStr);
                    }

                    return invalidBox;
                };

                /**
                 * 新增时数据、网格默认设置
                 */
                $scope.newBizData = function (bizData) {
                    //$scope.hcSuper.newBizData(bizData);
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);

                    bizData.ar_type = 1;
                    bizData.base_currency_id = 1;
                    bizData.usable = 2;

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
                 * 复制
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

                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;
                //修改标签页标题
                $scope.tabs.base.title = '基本信息';

                $scope.tabs.fa = {
                    title: '财务属性'
                };

                //cs:customer_saleprice
                $scope.tabs.cs = {
                    title: '经销品类'
                };

                $scope.tabs.other = {
                    title: "其他"
                }


                /*hide: function () {
                 return !$scope.tabs.cs.active;
                 }*/
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
                        //swalApi.info("当前正在编辑‘基本信息’");

                        var line = {
                            address1: $scope.data.currItem.address1,
                            defaulted: $scope.data.currItem.defaulted,
                            take_man: $scope.data.currItem.take_man,
                            phone_code: $scope.data.currItem.phone_code,
                        };
                        // $scope.data.currItem.customer_addressofcustomer_org = [];
                        line.defaulted = 1;
                        $scope.data.currItem.customer_addressofcustomer_orgs.push(line);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.customer_addressofcustomer_orgs);
                    }
                    if ($scope.tabs.cs.active == true) {
                        //swalApi.info("当前正在编辑‘品类与价格类型’");

                        var line_cs = {
                            crm_name: "",
                            saleprice_type_name: "",
                            sale_employee_name: "",
                            dept_name: "",
                            note: "",
                        };

                        //$scope.data.currItem.customer_salepriceofcustomer_orgs = [];
                        $scope.data.currItem.customer_salepriceofcustomer_orgs.push(line_cs);
                        $scope.gridOptions_cs.hcApi.setRowData($scope.data.currItem.customer_salepriceofcustomer_orgs);
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
                            $scope.data.currItem.customer_addressofcustomer_orgs.splice(idx, 1);
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.customer_addressofcustomer_orgs);
                        }
                        if ($scope.tabs.cs.active == true) {
                            $scope.data.currItem.customer_salepriceofcustomer_orgs.splice(idx, 1);
                            $scope.gridOptions_cs.hcApi.setRowData($scope.data.currItem.customer_salepriceofcustomer_orgs);
                        }
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
