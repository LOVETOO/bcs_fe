/**
 *  门店档案
 *
 *
 */
define(
    ['module', 'controllerApi', 'requestApi', 'base_obj_prop', 'openBizObj', 'swalApi', 'directive/hcImg'],
    function (module, controllerApi, requestApi, base_obj_prop, openBizObj, swalApi) {

        var terminalProp = [
            '$scope',

            function ($scope) {
                /*----------------------------------能否编辑-------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------表格定义-------------------------------------------*/
                // 终端资产
                $scope.gridOptions_education = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'start_month',
                        headerName: '资产编号'
                    }, {       
                        field: 'end_month',
                        headerName: '资产名称'
                    }, {
                        field: 'school',
                        headerName: '数量'

                    }, {
                        field: 'speciality',
                        headerName: '单价'
                    }, {
                        field: 'education',
                        headerName: '金额'

                    }]
                };
                //表格定义  "工作经历"
                $scope.gridOptions_line = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'work_no',
                        headerName: '工号',
                        hcDictCode: 'stat'
                    }, {
                        field: 'employee_name',
                        headerName: '姓名'
                    }, {
                        field: 'start_date',
                        headerName: '上岗日期'
                    }, {
                        field: 'idcard',
                        headerName: '身份证号'
                    }, {
                        field: 'sex',
                        headerName: '性别'
                    }, {
                        field: 'birthday',
                        headerName: '出生年月'
                    }, {
                        field: 'is_married',
                        headerName: '婚否',
                        hcDictCode: 'is_valuation'
                    }, {
                        field: 'stat1',
                        headerName: '状态',
                        hcDictCode: 'stat1'
                    }, {
                        field: 'career',
                        headerName: '学历',
                        hcDictCode: 'degree_req'
                    }, {
                        field: 'school_name',
                        headerName: '毕业学校'
                    }, {
                        field: 'nation',
                        headerName: '民族'
                    }, {
                        field: 'hometown',
                        headerName: '籍贯'
                    }, {
                        field: 'card_addrinfo',
                        headerName: '户籍地'
                    }, {
                        field: 'address',
                        headerName: '家庭地址'
                    }, {
                        field: 'org_name',
                        headerName: '部门名称'
                    }, {
                        field: 'bank',
                        headerName: '开户行'
                    }, {
                        field: 'bank_acc',
                        headerName: '账号'
                    }, {
                        field: 'try_day',
                        headerName: '使用天数'
                    }, {
                        field: 'contactor1',
                        headerName: '紧急联系人'
                    }, {
                        field: 'contactor1_tel',
                        headerName: '紧急联系人电话'
                    }, {
                        field: 'phone',
                        headerName: '联系电话'
                    }, {
                        field: 'phone',
                        headerName: '移动电话'
                    }, {
                        field: 'formal_date',
                        headerName: '转正日期'
                    }, {
                        field: 'zipcode',
                        headerName: '邮编'
                    }, {
                        field: 'item_type_names',
                        headerName: '负责产品类别'
                    }, {
                        field: 'guider_type',
                        headerName: '导购类型',
                        hcDictCode: 'guider_type'
                    }, {
                        field: 'e_mail',
                        headerName: 'E_MAIL'
                    }, {
                        field: 'contract_expire',
                        headerName: '合同到期日期'
                    }, {
                        field: 'assure_no',
                        headerName: '社保编号'
                    }, {
                        field: 'assure_stat',
                        headerName: '参保状态',
                        hcDictCode: 'assure_stat'
                    }, {
                        field: 'assure_no',
                        headerName: '社保编号'
                    }, {
                        field: 'engage_type',
                        headerName: '招聘类型',
                        hcDictCode: 'engage_type'

                    }, {
                        field: 'cust_code',
                        headerName: '经销商编码'
                    }, {
                        field: 'cust_name',
                        headerName: '经销商名称'
                    }, {
                        field: 'assure_stat', /*未知字段*/
                        headerName: '售点编码'
                    }, {
                        field: 'assure_stat', /*未知字段*/
                        headerName: '售点名称'
                    }, {
                        field: 'userid', /*未知字段*/
                        headerName: '账户名'
                    }, {
                        field: 'crm_entid',
                        headerName: '品类'
                    }, {
                        field: 'entorgid',
                        headerName: '产品组织'
                    }, {
                        field: 'note',
                        headerName: '备注'
                    }]
                };
                //售点负责产品
                $scope.gridOptions_surveyitem_norm = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'crm_entid',
                        headerName: '品类',
                        editable: true,
                        width: 150
                    }, {
                        field: 'entorgid',
                        headerName: '产品线',
                        editable: true,
                        width: 150
                    }, {
                        field: 'crm_terminal_code',
                        headerName: 'CRM售点编码',
                        editable: true,
                        width: 150
                    }, {
                        field: 'crm_terminal_name',
                        headerName: 'CRM售点名称',
                        editable: true,
                        width: 150
                    }
                    ]
                };

                /*----------------------------------通用查询-------------------------------------------*/
                // 用户名查询
                $scope.commonSearchSettingOfErpemployee = {
                    afterOk: function (result) {
                        $scope.data.currItem.userid = result.employee_code;
                        $scope.data.currItem.username = result.employee_name;
                    }
                };

                //部门 查询
                $scope.commonSearchSettingOfDept = {
                    afterOk: function (result) {
                        $scope.data.currItem.org_id = result.dept_id;
                        $scope.data.currItem.org_code = result.dept_code;
                        $scope.data.currItem.org_name = result.dept_name;
                    }
                };
                //客户 查询
                $scope.commonSearchSettingOfCust = {
                    beforeOpen: function () {
                        $scope.commonSearchSettingOfCust.postData =
                            {
                                search_flag: 129,
                                dept_id: $scope.data.currItem.org_id
                            }
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.cust_id = result.customer_id;
                        $scope.data.currItem.cust_code = result.customer_code;
                        $scope.data.currItem.cust_name = result.customer_name;
                    }
                };
                //所属系统
                $scope.commonSearchSettingOfSys = {
                    afterOk: function (result) {
                        $scope.data.currItem.sys_id = result.sys_id;
                        $scope.data.currItem.sys_code = result.sys_code;
                        $scope.data.currItem.sys_name = result.sys_name;
                    }
                };
                //终端负责人
                $scope.commonSearchSettingOfEmployee = {
                    afterOk: function (result) {
                        $scope.data.currItem.employee_id = result.employee_id;
                        $scope.data.currItem.employee_code = result.employee_code;
                        $scope.data.currItem.employee_name = result.employee_name;
                    }
                };
                //推广代表
                $scope.commonSearchSettingOfRepEmployee = {
                    afterOk: function (result) {
                        $scope.data.currItem.chap_id = result.employee_id;
                        $scope.data.currItem.chap_code = result.employee_code;
                        $scope.data.currItem.chap_name = result.employee_code;
                    }
                };
                //业务员
                $scope.commonSearchSettingOfSalesman = {
                    afterOk: function (result) {
                        $scope.data.currItem.salesman_id = result.employee_id;
                        $scope.data.currItem.salesman_code = result.employee_code;
                        $scope.data.currItem.salesman_name = result.employee_code;
                    }
                };
                //代销仓
                $scope.commonSearchSettingOfWarehouse = {
                    afterOk: function (result) {
                        $scope.data.currItem.warehouse_id = result.warehouse_id;
                        $scope.data.currItem.warehouse_code = result.warehouse_code;
                        $scope.data.currItem.warehouse_name = result.warehouse_name;
                    }
                };
                //所属区域
                $scope.commonSearchOfScparea = {
                    sqlWhere: "areatype in (4,5)",
                    afterOk: function (result) {
                        $scope.data.currItem.area_id = result.areaid;
                        $scope.data.currItem.area_code = result.areacode;
                        $scope.data.currItem.area_name = result.areaname;
                    }
                }
                //县/市
                $scope.commonSearchOfScpareaCity = {
                    beforeOpen: function () {
                        $scope.commonSearchOfScpareaCity.postData =
                            {superid: $scope.data.currItem.area_id}
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.city_areaid = result.areaid;
                        $scope.data.currItem.city_areacode = result.areacode;
                        $scope.data.currItem.city_areaname = result.areaname;
                    }
                };
                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //添加终端资产
                    bizData.employee_apply_educationofemployee_apply_headers = [];
                    $scope.gridOptions_education.hcApi.setRowData(bizData.employee_apply_educationofemployee_apply_headers);
                    //添加导购员
                    bizData.mkt_terminal_employeeofmkt_terminals = [];
                    $scope.gridOptions_line.hcApi.setRowData(bizData.mkt_terminal_employeeofmkt_terminals);
                    // 售点负责产品
                    bizData.mkt_terminal_lineofmkt_terminals = [{}];
                    $scope.gridOptions_surveyitem_norm.hcApi.setRowData(bizData.mkt_terminal_lineofmkt_terminals);
                };
                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    //终端资产
                    $scope.gridOptions_education.hcApi.setRowData(bizData.employee_apply_educationofemployee_apply_headers);
                    //导购人员信息
                    $scope.gridOptions_line.hcApi.setRowData(bizData.mkt_terminal_employeeofmkt_terminals);
                    //售点负责产品
                    $scope.gridOptions_surveyitem_norm.hcApi.setRowData(bizData.mkt_terminal_lineofmkt_terminals);
                    $scope.getemployeeItems();
                };
                /**
                 * 根据 terminal_id  查询导购员信息
                 */
                $scope.getemployeeItems = function () {
                    requestApi.post({
                        classId: 'employee_header',
                        action: 'search',
                        data: {
                            sqlwhere: "is_guider=2 and terminal_id="+ $scope.data.currItem.terminal_id
                        }
                    })
                        .then(function (response) {
                            $scope.data.currItem.mkt_terminal_employeeofmkt_terminals=response.employee_headers;
                            $scope.gridOptions_line.hcApi.setRowData($scope.data.currItem.mkt_terminal_employeeofmkt_terminals);
                        })
                };

                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow = {
                    title: '增加明细',
                    click: function () {
                        if ($scope.tabs.education.active) {
                            $scope.add_education && $scope.add_education();
                        }
                        if ($scope.tabs.line.active) {
                            $scope.add_line && $scope.add_line();
                        }
                        if ($scope.tabs.base.active) {
                            $scope.add_surveyitem_norm && $scope.add_surveyitem_norm();
                        }
                    }
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return (!$scope.tabs.education.active && !$scope.tabs.line.active && !$scope.tabs.base.active);
                };
                $scope.footerLeftButtons.deleteRow = {
                    title: "删除明细",
                    click: function () {
                        if ($scope.tabs.education.active) {
                            $scope.del_education && $scope.del_education();
                        }
                        if ($scope.tabs.line.active) {
                            $scope.del_line && $scope.del_line();
                        }
                        if ($scope.tabs.base.active) {
                            $scope.del_surveyitem_norm && $scope.del_surveyitem_norm();
                        }
                    }
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return (!$scope.tabs.education.active && !$scope.tabs.line.active && !$scope.tabs.base.active);
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                //添加售点负责产品
                $scope.add_surveyitem_norm = function () {
                    $scope.gridOptions_surveyitem_norm.api.stopEditing();
                    var data = $scope.data.currItem.mkt_terminal_lineofmkt_terminals;
                    data.push({});
                    $scope.gridOptions_surveyitem_norm.hcApi.setRowData(data);
                };
                //删除售点负责产品
                $scope.del_surveyitem_norm = function () {
                    var idx = $scope.gridOptions_surveyitem_norm.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.mkt_terminal_lineofmkt_terminals.splice(idx, 1);
                        $scope.gridOptions_surveyitem_norm.hcApi.setRowData($scope.data.currItem.mkt_terminal_lineofmkt_terminals);
                    }
                };

                //添加终端资产
                $scope.add_education = function () {
                    $scope.gridOptions_education.api.stopEditing();
                    var data = $scope.data.currItem.employee_apply_educationofemployee_apply_headers;
                    data.push({});
                    $scope.gridOptions_education.hcApi.setRowData(data);
                };
                /**
                 * 删除终端资产
                 */
                $scope.del_education = function () {
                    var idx = $scope.gridOptions_education.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.employee_apply_educationofemployee_apply_headers.splice(idx, 1);
                        $scope.gridOptions_education.hcApi.setRowData($scope.data.currItem.employee_apply_educationofemployee_apply_headers);
                    }
                };
                //添加导购员信息
                $scope.add_line = function () {
                    $scope.gridOptions_line.api.stopEditing();
                    var data = $scope.data.currItem.mkt_terminal_employeeofmkt_terminals;
                    data.push({});
                    $scope.gridOptions_line.hcApi.setRowData(data);
                };
                /**
                 * 删除导购员信息
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions_line.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.mkt_terminal_employeeofmkt_terminals.splice(idx, 1);
                        $scope.gridOptions_line.hcApi.setRowData($scope.data.currItem.mkt_terminal_employeeofmkt_terminals);
                    }
                };
                /*----------------------------------顶部按钮-------------------------------------------*/
                $scope.kpi_tab = {};
                $scope.kpi_tab.score = {
                    title: '售点负责产品',
                    active: true
                };
                $scope.tabs.base = {
                    title: '基本信息',
                    active: true
                };
                $scope.tabs.education = {
                    title: '终端资产'
                };
                $scope.tabs.line = {
                    title: '导购信息'
                };
            }
        ]
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: terminalProp
        });

    });