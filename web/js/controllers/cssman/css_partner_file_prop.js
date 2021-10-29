/**
 *  module:合伙人档案-属性
 *  time: 2019/7/11    
 *  author: Li Meng
 */
define(
    ['module', 'controllerApi', 'requestApi', 'base_obj_prop', 'openBizObj', 'swalApi', 'directive/hcImg'],
    function (module, controllerApi, requestApi, base_obj_prop, openBizObj, swalApi) {

        var partnerFile = [
            '$scope',

            function ($scope) {
                /*----------------------------------能否编辑-------------------------------------------*/
                function editable() {
                    return $scope.data.currItem.stat == 1;
                }

                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------表格定义-------------------------------------------*/
                // 财务信息
                $scope.gridOptions_accountInfo = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'start_month',
                        headerName: '系统编号',
                        type: '年月',
                        editable: editable
                    }, {
                        field: 'end_month',
                        headerName: '合同单号',
                        type: '年月',
                        editable: editable
                    }, {
                        field: 'school',
                        headerName: '合同状态',
                        editable: editable
                    }, {
                        field: 'speciality',
                        headerName: '签订日期',
                        editable: editable
                    }, {
                        field: 'education',
                        headerName: '起始日期',
                        editable: editable
                    }, {
                        field: 'education',
                        headerName: '到期日期',
                        editable: editable
                    }, {
                        field: 'education',
                        headerName: '客户名称',
                        editable: editable
                    }, {
                        field: 'education',
                        headerName: '所属区域',
                        editable: editable
                    }, {
                        field: 'education',
                        headerName: '免费商务服务数',
                        editable: editable
                    }, {
                        field: 'education',
                        headerName: '合同金额',
                        editable: editable
                    }, {
                        field: 'education',
                        headerName: '创建者',
                        editable: editable
                    }, {
                        field: 'education',
                        headerName: '创建时期',
                        editable: editable
                    }, {
                        field: 'education',
                        headerName: '备注',
                        editable: editable
                    }]
                };

                //联系人信息
                $scope.gridOptions_customer_contact = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'contact_man',
                        headerName: '联系人',
                        editable: true,
                        width: 150
                    }, {
                        field: 'con_dept',
                        headerName: '部门',
                        editable: true,
                        width: 150
                    }, {
                        field: 'con_duty',
                        headerName: '职位/称呼',
                        editable: true,
                        width: 150
                    }, {
                        field: 'con_drect_line',
                        headerName: '电话',
                        editable: true,
                        width: 150
                    }, {
                        field: 'con_cell1',
                        headerName: '手机',
                        editable: true,
                        width: 150
                    }, {
                        field: 'con_mail',
                        headerName: '邮箱',
                        editable: true,
                        width: 150
                    }
                    ]
                };
                /*----------------------------------通用查询-------------------------------------------*/
                //所属省
                $scope.commonSearchOfProvince = {
                    sqlWhere: "areatype=4",
                    afterOk: function (result) {
                        $scope.data.currItem.province_id = result.areaid;
                        $scope.data.currItem.province_name = result.areaname;
                    }
                };
                //所属市
                $scope.commonSearchOfCity = {
                    beforeOpen: function () {
                        if (!$scope.data.currItem.province_name) {
                            swalApi.info("请先选择所在省份");
                            return false;
                        }
                        $scope.commonSearchOfCity.postData =
                            {
                                superid: $scope.data.currItem.province_id
                            }
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.city_id = result.areaid;
                        $scope.data.currItem.city_name = result.areaname;
                    }
                };
                //所属区县
                $scope.commonSearchOfDistrict = {
                    beforeOpen: function () {
                        if (!$scope.data.currItem.city_name) {
                            swalApi.info("请先选择所在市");
                            return false;
                        }
                        $scope.commonSearchOfDistrict.postData =
                            {
                                superid: $scope.data.currItem.city_id
                            }
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.district_id = result.areaid;
                        $scope.data.currItem.district_name = result.areaname;
                    }
                };
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
                        $scope.data.currItem.dept_id = result.dept_id;
                        $scope.data.currItem.dept_code = result.dept_code;
                        $scope.data.currItem.dept_name = result.dept_name;
                    }
                };
                //所属区域查询
                $scope.commonSearchSettingOfSalearea = {
                    afterOk: function (result) {
                        $scope.data.currItem.sale_area_id = result.sale_area_id;
                        $scope.data.currItem.sale_area_code = result.sale_area_code;
                        $scope.data.currItem.sale_area_name = result.sale_area_name;
                        $scope.data.currItem.areaid = result.areaid;
                        $scope.data.currItem.areaname = result.areaname;
                        $scope.data.currItem.areacode = result.areacode;

                    }
                };
                //业务员
                $scope.commonSearchSettingOfSalesman = {
                    afterOk: function (result) {
                        $scope.data.currItem.employee_partner_name = result.employee_name;
                    }
                };
                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //添加详情信息
                    bizData.customer_contactofcustomer_orgs = [];
                    $scope.gridOptions_customer_contact.hcApi.setRowData(bizData.customer_contactofcustomer_orgs);
                };
                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions_customer_contact.hcApi.setRowData(bizData.customer_contactofcustomer_orgs);
                };
                /**
                 * 保存之前
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    bizData.customer_kind = 5;
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow = {
                    title: '增加明细',
                    click: function () {
                        if ($scope.tabs.base.active) {
                            $scope.add_customer_contact && $scope.add_customer_contact();
                        }
                    }
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return (!$scope.tabs.base.active);
                };
                $scope.footerLeftButtons.deleteRow = {
                    title: "删除明细",
                    click: function () {
                        if ($scope.tabs.base.active) {
                            $scope.del_customer_contact && $scope.del_customer_contact();
                        }
                    }
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return (!$scope.tabs.base.active);
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                //联系人
                $scope.add_customer_contact = function () {
                    $scope.gridOptions_customer_contact.api.stopEditing();
                    var data = $scope.data.currItem.customer_contactofcustomer_orgs;
                    data.push({});
                    $scope.gridOptions_customer_contact.hcApi.setRowData(data);
                };
                //删除联系人
                $scope.del_customer_contact = function () {
                    var idx = $scope.gridOptions_customer_contact.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.customer_contactofcustomer_orgs.splice(idx, 1);
                        $scope.gridOptions_customer_contact.hcApi.setRowData($scope.data.currItem.customer_contactofcustomer_orgs);
                    }
                };
                $scope.areaChange = function (areaType) {
                    if (areaType == 4) {
                        $scope.data.currItem.city_id = 0;
                        $scope.data.currItem.city_name = '';
                        $scope.data.currItem.district_id = 0;
                        $scope.data.currItem.district_name = '';
                    }
                    if (areaType == 5) {
                        $scope.data.currItem.district_id = 0;
                        $scope.data.currItem.district_name = '';
                    }
                };
                /*----------------------------------顶部按钮-------------------------------------------*/
                $scope.customer_tab = {};
                $scope.customer_tab.customer_contact = {
                    title: '联系人',
                    active: true
                };
                $scope.tabs.base = {
                    title: '基本信息',
                    active: true
                };
                $scope.tabs.accountInfo = {
                    title: '财务信息'
                };
                $scope.tabs.detaileInfo = {
                    title: '详细信息'
                };
                $scope.tabs.extra = {
                    title: '其他'
                };
            }
        ]
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: partnerFile
        });

    });