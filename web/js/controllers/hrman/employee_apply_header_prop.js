/**
 * 员工入职申请
 * 2019/5/6.
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', '$q', 'numberApi', 'dateApi', 'fileApi', '$modal', 'directive/hcImg'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, $q, numberApi, dateApi, fileApi, $modal) {


        var EmployeeApplyHeaderProp = [
            '$scope',

            function ($scope) {
                /*----------------------------------能否编辑-------------------------------------------*/
                function editable() {
                    return $scope.data.currItem.stat == 1;
                }

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------表格定义-------------------------------------------*/
                //表格定义  "教育经历"
                $scope.gridOptions_education = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'start_month',
                        headerName: '起始月份',
                        type: '年月',
                        editable: editable
                    }, {
                        field: 'end_month',
                        headerName: '结束月份',
                        type: '年月',
                        editable: editable
                    }, {
                        field: 'school',
                        headerName: '学校',
                        editable: editable
                    }, {
                        field: 'speciality',
                        headerName: '专业',
                        editable: editable
                    }, {
                        field: 'education',
                        headerName: '学历',
                        editable: editable
                    }, {
                        field: 'witness',
                        headerName: '证明人',
                        editable: editable
                    }, {
                        field: 'witness_tel',
                        headerName: '联系电话',
                        editable: editable
                    }]
                };
                //表格定义  "工作经历"
                $scope.gridOptions_line = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'company',
                        headerName: '任职单位',
                        editable: editable
                    }, {
                        field: 'position_desc',
                        headerName: '任职岗位',
                        editable: editable
                    }, {
                        field: 'func',
                        headerName: '职务',
                        editable: editable
                    }, {
                        field: 'start_date',
                        headerName: '起始日期',
                        type: '年月',
                        editable: editable
                    }, {
                        field: 'end_date',
                        headerName: '结束日期',
                        type: '年月',
                        editable: editable
                    }, {
                        field: 'work_type',
                        headerName: '工种',
                        editable: editable
                    }, {
                        field: 'description',
                        headerName: '奖惩',
                        editable: editable
                    }, {
                        field: 'witness',
                        headerName: '证明人',
                        editable: editable
                    }, {
                        field: 'witness_tel',
                        headerName: '联系电话',
                        editable: editable
                    }, {
                        field: 'is_group_experience',
                        headerName: '属于集团',
                        type: '是否',
                        editable: editable
                    }, {
                        field: 'is_vocation_experience',
                        headerName: '有行业经历',
                        type: '是否',
                        editable: editable
                    }, {
                        field: 'note',
                        headerName: '备注',
                        editable: editable
                    }]
                };

                //表格定义  "培训经历"
                $scope.gridOptions_training = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'start_month',
                        headerName: '起始月份',
                        type: '年月',
                        editable: editable
                    }, {
                        field: 'end_month',
                        headerName: '结束月份',
                        type: '年月',
                        editable: editable
                    }, {
                        field: 'training_course',
                        headerName: '培训课程',
                        editable: editable
                    }, {
                        field: 'training_provider',
                        headerName: '培训单位',
                        editable: editable
                    }, {
                        field: 'certificate',
                        headerName: '所获证书',
                        editable: editable
                    }, {
                        field: 'remark',
                        headerName: '备注',
                        editable: editable
                    }]
                };
                //表格定义  "薪资福利"
                $scope.gridOptions_fsalay = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'fsalary_item_name',
                        headerName: '固薪项目名称'
                    }, {
                        field: 'fsalary_limits',
                        headerName: '固薪范围标准'
                    }, {
                        field: 'fsalary_amount',
                        headerName: '固薪申请额',
                        editable: editable,
                        type: '金额'
                    }]
                };


                /*----------------------------------通用查询-------------------------------------------*/

                //入职类型
                $scope.commonSearchOfChangeTypeName = {
                    sqlWhere: " usable = " + 2 + "and for_billtype= " + 1,
                    afterOk: function (result) {
                        $scope.data.currItem.hr_change_type_id = result.hr_change_type_id;
                        $scope.data.currItem.change_type_code = result.change_type_code;
                        $scope.data.currItem.change_type_name = result.change_type_name;
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
                        $scope.data.currItem.org_id = result.dept_id;
                        $scope.data.currItem.org_code = result.dept_code;
                        $scope.data.currItem.org_name = result.dept_name;
                    }
                };
                //社保组 查询
                $scope.commonSearchSettingOfHrInsrncGroup = {
                    afterOk: function (result) {
                        $scope.data.currItem.hr_insrnc_group_id = result.hr_insrnc_group_id;
                        $scope.data.currItem.insrnc_group_code = result.insrnc_group_code;
                        $scope.data.currItem.insrnc_group_name = result.insrnc_group_name;
                    }
                };

                //职位 查询
                $scope.commonSearchSettingOfPosition = {
                    afterOk: function (result) {
                        $scope.data.currItem.hr_position_id = result.hr_position_id;
                        $scope.data.currItem.position_code = result.position_code;
                        $scope.data.currItem.position_grade = result.position_grade;
                        $scope.data.currItem.position_name = result.position_name;
                    }
                };

                //籍贯 查询
                $scope.commonSearchSettingOfOrigin = {
                    sqlWhere: "superid=1",
                    afterOk: function (res) {
                        var shengid = res.areaid;
                        if(res.areaname=="香港特别行政区"||res.areaname=="澳门"){
                            $scope.data.currItem.hometown= res.areaname.substring(0, 2);
                            return;
                        }
                        function selShi(response) {
                            $modal.openCommonSearch({
                                classId: 'scparea',
                                sqlWhere: 'superid=' + shengid,
                                action: 'search',
                                title: "所属市选择",

                                gridOptions: {
                                    columnDefs: [
                                        {
                                            headerName: "所属市名称",
                                            field: "areaname"
                                        }, {
                                            headerName: "区号",
                                            field: "telzone"
                                        }
                                    ]
                                }
                            })
                                .result//响应数据
                                .then(function (result) {

                                    if (response.areaname == "黑龙江省" || response.areaname == "内蒙古自治区") {
                                        $scope.data.currItem.hometown
                                            = response.areaname.substring(0, 3) + ','
                                            + result.areaname.substring(0, result.areaname.length-1)+'区';
                                        return;
                                    } else {
                                        $scope.data.currItem.hometown
                                            = response.areaname.substring(0, 2) + ','
                                            + result.areaname.substring(0, result.areaname.length-1)+'区';
                                        return;
                                    }

                                });
                        };
                        requestApi.post({
                            classId: 'scparea',
                            action: 'search',
                            data: {
                                sqlwhere: '(superid=' + shengid + ') and (1=1) '
                            }
                        })
                            .then(function ( respon ) {
                                if(respon.scpareas.length==1){
                                    shengid = respon.scpareas[0].areaid;
                                    selShi(res);
                                }else{
                                    selShi(res);
                                }
                            })

                    }
                };
                /*----------------------------------图片方法-------------------------------------------*/

                $scope.uploadFile = function () {
                    fileApi.uploadFile({
                        multiple: false,
                        accept: 'image/*'
                    }).then(function (docs) {
                        $scope.data.currItem.docid1 = docs[0].docid;
                        $(".invoice_div_img").css("height", "130px");
                    });
                };


                /**
                 * 移除图片
                 */
                $scope.del_invoice_image = function () {
                    $scope.data.currItem.docid1 = undefined;
                    $(".invoice_div_img").css("height", "auto");

                };

                /**
                 * 校验身份证号
                 */
                $scope.birthdaySex = function () {
                    var str = $scope.data.currItem.idcard;
                    if (str.length < 18) {
                        return;
                    }
                    var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

                    if (!p.test(str)) {
                        swalApi.info('请正确输入18位身份证号');
                        return;
                    }
                    var date = str.slice(6, 14);
                    var y = date.slice(0, 4);
                    var m = date.slice(4, 6);
                    var d = date.slice(6);
                    $scope.data.currItem.birthday = y + "-" + m + "-" + d;
                    var sex = str.charAt(16);
                    if (sex % 2 == 1) {
                        $scope.data.currItem.sex = 1;
                    }
                    if (sex % 2 == 0) {
                        $scope.data.currItem.sex = 2;
                    }

                };


                /*----------------------------------按钮方法数据 定义-------------------------------------------*/

                $scope.salary_groups = [];
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //教育经历
                    bizData.employee_apply_educationofemployee_apply_headers = [];
                    $scope.gridOptions_education.hcApi.setRowData(bizData.employee_apply_educationofemployee_apply_headers);
                    //工作经历
                    bizData.employee_apply_lineofemployee_apply_headers = [];
                    $scope.gridOptions_line.hcApi.setRowData(bizData.employee_apply_lineofemployee_apply_headers);
                    //培训经历
                    bizData.employee_apply_trainingofemployee_apply_headers = [];
                    $scope.gridOptions_training.hcApi.setRowData(bizData.employee_apply_trainingofemployee_apply_headers);
                    //固薪标准
                    bizData.employee_apply_fsalaryofemployee_apply_headers = [];
                    $scope.gridOptions_fsalay.hcApi.setRowData(bizData.employee_apply_fsalaryofemployee_apply_headers);
                    bizData.is_need_insure = 2;
                    bizData.is_insured = 2;
                    bizData.assure_stat = 3;
                    bizData.stat1 = 2;
                    bizData.hr_change_type_id = 1;
                    bizData.change_type_code = 'SYS01';
                    bizData.change_type_name = '新入职';
                    var formal_li = new Date();
                    var year = formal_li.getFullYear();
                    var month = formal_li.getMonth() + 1;
                    if (month < 10) {
                        month = "0" + month;
                    }
                    var today = formal_li.getDate();
                    if (today < 10) {
                        today = "0" + today;
                    }
                    bizData.start_date = year + "-" + month + "-" + today;
                    $(".invoice_div_img").css("height", "auto");
                };
                //自执行获取薪资组信息
                var position = function () {
                    requestApi.post({
                        classId: 'hr_salary_group',
                        action: 'search',
                        data: {}
                    })
                        .then(function (response) {
                            return response.hr_salary_groups;
                        }).then(function (value) {
                        value.forEach(function (val) {
                            var o = {};
                            o.value = val.hr_salary_group_id;
                            o.name = val.salary_group_name;
                            $scope.salary_groups.push(o);
                        });
                    });
                }();

                //将获取的数据添加进明细
                function add_employee_policy(args) {
                    var rowCount = args.length;
                    var data = $scope.data.currItem.employee_apply_fsalaryofemployee_apply_headers;

                    for (var i = 0; i < rowCount; i++) {
                        var newLine = {
                            fsalary_item_name: args[i].salary_item_name,
                            fsalary_item_code: args[i].salary_item_code,
                            fsalary_limits: args[i].f_salary_limits
                        };
                        data.push(newLine);
                    }
                    $scope.gridOptions_fsalay.hcApi.setRowData(data);
                }

                //薪资组发生变化查询薪资福利
                $scope.changePosition = function () {
                    var l = $scope.data.currItem.employee_apply_fsalaryofemployee_apply_headers.length;
                    for (var j = 0; j < l; j++) {
                        $scope.del_fsalay();
                    }
                    requestApi.post({
                        classId: 'hr_position_grade_salary',
                        action: 'getsalaryitemcaption',
                        data: {
                            flag: 88,
                            hr_salary_group_id: $scope.data.currItem.hr_salary_group_id,
                            position_grade: $scope.data.currItem.position_grade
                        }
                    })
                        .then(function (response) {
                            add_employee_policy(response.hr_position_grade_salarys);
                        })
                };

                //保存验证
                $scope.validCheck = function (invalidBox) {
                    var str = $scope.data.currItem.idcard;
                    var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
                    if (!p.test(str)) {
                        invalidBox.push("请正确输入18位身份证号");
                        $scope.hcSuper.validCheck(invalidBox);
                        return invalidBox;
                    } else {
                        return requestApi.post({
                            classId: 'employee_blacklist',
                            action: 'search',
                            data: {
                                sqlwhere: "Idcard='" + $scope.data.currItem.idcard + "' and bill_stat=1"
                            }
                        })
                            .then(function (response) {
                                if (response.employee_blacklists.length > 0) {
                                    invalidBox.push("已加入特殊名单，不能再入职");
                                }
                            }).then(function () {
                                $scope.hcSuper.validCheck(invalidBox);
                                return invalidBox;
                            });
                    }
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    //设置教育经历
                    $scope.gridOptions_education.hcApi.setRowData(bizData.employee_apply_educationofemployee_apply_headers);
                    //设置工作经历
                    $scope.gridOptions_line.hcApi.setRowData(bizData.employee_apply_lineofemployee_apply_headers);
                    //设置培训经历
                    $scope.gridOptions_training.hcApi.setRowData(bizData.employee_apply_trainingofemployee_apply_headers);
                    //设置固薪标准
                    $scope.gridOptions_fsalay.hcApi.setRowData(bizData.employee_apply_fsalaryofemployee_apply_headers);
                };

                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/

                $scope.footerLeftButtons.addRow.click = function () {
                    if ($scope.tabs.education.active) {
                        $scope.add_education && $scope.add_education();
                    }
                    if ($scope.tabs.line.active) {
                        $scope.add_line && $scope.add_line();
                    }
                    if ($scope.tabs.training.active) {
                        $scope.add_training && $scope.add_training();
                    }
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return (!$scope.tabs.education.active && !$scope.tabs.line.active && !$scope.tabs.training.active);
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    if ($scope.tabs.education.active) {
                        $scope.del_education && $scope.del_education();
                    }
                    if ($scope.tabs.line.active) {
                        $scope.del_line && $scope.del_line();
                    }
                    if ($scope.tabs.training.active) {
                        $scope.del_training && $scope.del_training();
                    }

                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return (!$scope.tabs.education.active && !$scope.tabs.line.active && !$scope.tabs.training.active);
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                //添加教育经历
                $scope.add_education = function () {
                    $scope.gridOptions_education.api.stopEditing();
                    var data = $scope.data.currItem.employee_apply_educationofemployee_apply_headers;
                    data.push({});
                    $scope.gridOptions_education.hcApi.setRowData(data);
                };
                /**
                 * 删除行教育经历
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

                //添加工作经历
                $scope.add_line = function () {
                    $scope.gridOptions_line.api.stopEditing();
                    var data = $scope.data.currItem.employee_apply_lineofemployee_apply_headers;
                    data.push({});
                    $scope.gridOptions_line.hcApi.setRowData(data);
                };
                /**
                 * 删除行工作经历
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions_line.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.employee_apply_lineofemployee_apply_headers.splice(idx, 1);
                        $scope.gridOptions_line.hcApi.setRowData($scope.data.currItem.employee_apply_lineofemployee_apply_headers);
                    }
                };

                //添加培训经历
                $scope.add_training = function () {
                    $scope.gridOptions_training.api.stopEditing();
                    var data = $scope.data.currItem.employee_apply_trainingofemployee_apply_headers;
                    data.push({});
                    $scope.gridOptions_training.hcApi.setRowData(data);
                };
                /**
                 * 删除行培训经历
                 */
                $scope.del_training = function () {
                    var idx = $scope.gridOptions_training.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.employee_apply_trainingofemployee_apply_headers.splice(idx, 1);
                        $scope.gridOptions_training.hcApi.setRowData($scope.data.currItem.employee_apply_trainingofemployee_apply_headers);
                    }
                };


                //添加薪资福利
                $scope.add_fsalay = function () {
                    $scope.gridOptions_fsalay.api.stopEditing();

                    var data = $scope.data.currItem.employee_apply_fsalaryofemployee_apply_headers;

                    var newLine = {};
                    data.push(newLine);

                    $scope.gridOptions_fsalay.hcApi.setRowData(data);
                };
                /**
                 * 删除行薪资福利
                 */
                $scope.del_fsalay = function () {
                    var idx = $scope.gridOptions_fsalay.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.employee_apply_fsalaryofemployee_apply_headers.splice(idx, 1);
                        $scope.gridOptions_fsalay.hcApi.setRowData($scope.data.currItem.employee_apply_fsalaryofemployee_apply_headers);
                    }
                };
                /*----------------------------------计算-------------------------------------------*/
                //计算转正日期
                $scope.setFormalDate = function () {
                    var start_time = new Date($scope.data.currItem.start_date);
                    start_time = start_time.getTime();
                    var try_time = $scope.data.currItem.try_day * 24 * 60 * 60 * 1000;
                    var formal_time = start_time + try_time;
                    var formal_li = new Date(formal_time);

                    var year = formal_li.getFullYear();
                    var month = formal_li.getMonth() + 1;
                    if (month < 10) {
                        month = "0" + month;
                    }
                    var today = formal_li.getDate();
                    if (today < 10) {
                        today = "0" + today;
                    }
                    $scope.data.currItem.formal_date = year + "-" + month + "-" + today;
                };
                //计算试用天数
                $scope.setTryDay = function () {
                    var formal_time = new Date($scope.data.currItem.formal_date).getTime();
                    var start_time = new Date($scope.data.currItem.start_date).getTime();
                    var try_time = formal_time - start_time;
                    $scope.data.currItem.try_day = parseInt(try_time / 1000 / 60 / 60 / 24);
                };

                /*----------------------------------标签定义-------------------------------------------*/

                $scope.tabs.base = {
                    title: '基本信息',
                    active: true
                };
                $scope.tabs.education = {
                    title: '教育经历'
                };
                $scope.tabs.line = {
                    title: '工作经历'
                };
                $scope.tabs.training = {
                    title: '培训经历'
                };
                $scope.tabs.fsalay = {
                    title: '薪酬福利信息'
                };


            }
        ]
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: EmployeeApplyHeaderProp
        });

    });