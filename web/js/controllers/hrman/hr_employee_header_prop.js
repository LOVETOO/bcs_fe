/**
 * Created by asus on 2019/4/17.
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_prop', 'requestApi',  'swalApi',   'dateApi','fileApi','directive/hcImg'], defineFn)
})(function (module, controllerApi, base_obj_prop, requestApi,  swalApi,   dateApi,fileApi) {

    EmployeeHeaderProp.$inject = ['$scope']

    function EmployeeHeaderProp($scope) {
        /*----------------------------------数据定义-------------------------------------------*/
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
                type:'年月',
                editable: $scope.data.currItem.stat == 1
            }, {
                field: 'end_month',
                headerName: '结束月份',
                type:'年月',
                editable: $scope.data.currItem.stat == 1
            }, {
                field: 'school',
                headerName: '学校',
                editable: $scope.data.currItem.stat == 1
            }, {
                field: 'speciality',
                headerName: '专业',
                editable: $scope.data.currItem.stat == 1
            }, {
                field: 'education',
                headerName: '学历',
                editable:$scope.data.currItem.stat == 1
            }, {
                field: 'witness',
                headerName: '证明人',
                editable: $scope.data.currItem.stat == 1
            }, {
                field: 'witness_tel',
                headerName: '联系电话',
                editable: $scope.data.currItem.stat == 1
            }]
        };
        //表格定义  "工作经历"
        $scope.gridOptions_line = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'company',
                headerName: '任职单位',
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'position_desc',
                headerName: '任职岗位',
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'func',
                headerName: '职务',
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'start_date',
                headerName: '起始日期',
                type:'年月',
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'end_date',
                headerName: '结束日期',
                type:'年月',
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'work_type',
                headerName: '工种',
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'description',
                headerName: '奖惩',
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'witness',
                headerName: '证明人',
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'witness_tel',
                headerName: '联系电话',
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'is_group_experience',
                headerName: '属于集团',
                type:'是否',
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'is_vocation_experience',
                headerName: '有行业经历',
                type:'是否',
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'note',
                headerName: '备注',
                editable: function (args) {
                    return editable();
                }
            }]
        };

        //表格定义  "培训经历"
        $scope.gridOptions_training = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'start_month',
                headerName: '起始月份',
                type:'年月',
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'end_month',
                headerName: '结束月份',
                type:'年月',
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'training_course',
                headerName: '培训课程',
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'training_provider',
                headerName: '培训单位',
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'certificate',
                headerName: '所获证书',
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'remark',
                headerName: '备注',
                editable: function (args) {
                    return editable();
                }
            }]
        };

        //表格定义  "社保信息"
        $scope.gridOptions_assure = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'fsalary_item_name',
                headerName: '生效月份'
            }]
        };

        //表格定义  "薪资福利"
        $scope.gridOptions_fsalay = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'fsalary_item_name',
                headerName: '生效月份'
            }]
        };

        //表格定义  "异动记录"
        $scope.gridOptions_change = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'change_type_name',
                headerName: '异动类型',
            },{
                field: 'change_date',
                headerName: '异动日期',
                type:'日期'
            },{
                field: 'org_name',
                headerName: '原部门名称'
            },{
                field: 'position_name',
                headerName: '原职位'
            },{
                field: 'try_day',
                headerName: '原试用期天数'
            },{
                field: 'formal_date',
                headerName: '原转正日期',
                type:'日期'
            },{
                field: 'new_org_code',
                headerName: '新部门编码',
            }, {
                field: 'new_org_name',
                headerName: '新部门名称 '
            },{
                field: 'new_position_name',
                headerName: '新职位'
            },{
                field: 'new_try_day',
                headerName: '新试用天数'
            },{
                field: 'new_formal_date',
                headerName: '新转正日期',
                type:'日期'
            },{
                field: 'salary_stop_date',
                headerName: '薪资截止日期',
                type:'日期'
            },{
                field: 'is_need_insure',
                headerName: '需要参保',
                type:'是否'
            },{
                field: 'is_need_stop_insure',
                headerName: '需要停保',
                type:'是否'
            },{
                field: 'is_heimingdan',
                headerName: '特殊名单标识',
                type:'是否'
            },{
                field: 'reason',
                headerName: '异动原因'
            },{
                field: 'remark',
                headerName: '备注',
            }]
        };

        //表格定义  "内训经历"
        $scope.gridOptions_train = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'train_no',
                headerName: '登记单编码',
            }, {
                field: 'content',
                headerName: '培训内容',
            }, {
                field: 'train_date',
                headerName: '培训日期',
                type:'日期'
            }, {
                field: 'address',
                headerName: '培训地点',
            }, {
                field: 'teacher',
                headerName: '培训讲师',
            }, {
                field: 'create_time',
                headerName: '创建时间',
                type:'日期'
            }, {
                field: 'creator',
                headerName: '创建人',
            }, {
                field: 'note',
                headerName: '主表备注',
            }, {
                field: 'course_code',
                headerName: '课程编码',
            }, {
                field: 'course_name',
                headerName: '课程名称',
            }, {
                field: 'course_hour',
                headerName: '培训课时',
            }, {
                field: 'course_fee',
                headerName: '培训费用',
            }, {
                field: 'evaluation',
                headerName: '效果评价',
            }, {
                field: '序号',
                headerName: '序号',
            }, {
                field: 'employee_code',
                headerName: '人员编码',
            }, {
                field: 'employee_name',
                headerName: '姓名',
            }, {
                field: 'score',
                headerName: '考核得分',
            }, {
                field: 'note',
                headerName: '明细备注',
            }]
        };

        //表格定义  "合同信息"
        $scope.gridOptions_contract = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'contract_no',
                headerName: '合同编号',

            }, {
                field: 'contract_type',
                headerName: '合同类型',
                hcDictCode:'contract_type'
            }, {
                field: 'contract_stat',
                headerName: '合同状态',
                hcDictCode:'contract_stat'
            }, {
                field: 'start_date',
                headerName: '生效年份',
                type:'年月'
            }, {
                field: 'end_date',
                headerName: '结束年份',
                type:'年月'
            },{
                field: 'sign_date',
                headerName: '签订时间',
                type:'日期'

            }, {
                field: 'sign_address',
                headerName: '签订地点'

            }, {
                field: 'change_reason',
                headerName: '变更原因'

            }, {
                field: 'change_remark',
                headerName: '变更说明'

            }, {
                field: 'attribute4',
                headerName: '已签竞业协议',
                type:'是否'
            }, {
                field: 'attribute5',
                headerName: '已签保密协议',
                type:'是否'
            }]
        };

        /*----------------------------------通用查询-------------------------------------------*/

        //入职类型
        $scope.commonSearchOfChangeTypeName = {
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

        /*----------------------------------图片方法-------------------------------------------*/

        $scope.uploadFile= function(){
            fileApi.uploadFile({
                multiple: false,
                accept: 'image/*'
            }) .then(function (docs) {
                $scope.data.currItem.docid1 = docs[0].docid;
                $(".invoice_div_img").css("height", "130px");
            });
        }


        /**
         * 移除图片
         */
        $scope.del_invoice_image = function () {
            $scope.data.currItem.docid1 = undefined;
            $(".invoice_div_img").css("height", "auto");
        };


        /*----------------------------------按钮方法数据 定义-------------------------------------------*/

        $scope.salary_groups=[];
        /**
         * 新增时数据
         */
        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);
            //教育经历
            bizData.employee_educationofemployee_headers = [];
            $scope.gridOptions_education.hcApi.setRowData(bizData.employee_educationofemployee_headers);
            //工作经历
            bizData.employee_lineofemployee_headers = [];
            $scope.gridOptions_line.hcApi.setRowData(bizData.employee_lineofemployee_headers);
            //培训经历
            bizData.employee_trainingofemployee_headers = [];
            $scope.gridOptions_training.hcApi.setRowData(bizData.employee_trainingofemployee_headers);
            //社保合同
            bizData.hr_insrnc_policy_lineofemployee_headers = [];
            $scope.gridOptions_assure.hcApi.setRowData(bizData.hr_insrnc_policy_lineofemployee_headers);
            //固薪标准
            bizData.employee_fsalaryofemployee_headers = [];
            $scope.gridOptions_fsalay.hcApi.setRowData(bizData.employee_fsalaryofemployee_headers);
            //异动记录
            bizData.employee_changeofemployee_headers = [];
            $scope.gridOptions_change.hcApi.setRowData(bizData.employee_changeofemployee_headers);
            //内训记录
            bizData.employee_trainofemployee_headers = [];
            $scope.gridOptions_train.hcApi.setRowData(bizData.employee_trainofemployee_headers);
            //合同信息
            bizData.hr_contractofemployee_headers = [];
            $scope.gridOptions_contract.hcApi.setRowData(bizData.hr_contractofemployee_headers);
        };

        //自执行获取薪资组
        var position = function () {
            requestApi.post({
                classId: 'hr_salary_group',
                action: 'search',
                data: {
                }
            })
            .then(function ( response ) {
                    return  response.hr_salary_groups;
            })
            .then(function (value){
                value.forEach(function(val){
                    var o = {};
                    o.value = val.hr_salary_group_id;
                    o.name =val.salary_group_name;
                    $scope.salary_groups.push(o);
                });
            });
        }();

        //添加明细
        function add_employee_policy(args) {
            var rowCount = args.length;
            var data = $scope.data.currItem.employee_fsalaryofemployee_headers;

            for (var i = 0; i < rowCount; i++) {
                var newLine = {
                    fsalary_item_name : args[i].salary_item_name,
                    fsalary_item_code:args[i].salary_item_code,
                    fsalary_limits : args[i].f_salary_limits
                };
                data.push(newLine);
            }
            $scope.gridOptions_fsalay.hcApi.setRowData(data);
        }

        //修改薪资组选项
        $scope.changePosition = function () {
            var l=$scope.data.currItem.employee_fsalaryofemployee_headers.length;
            for(var j=0;j<l;j++){
                $scope.del_fsalay();
            }
            requestApi.post({
                classId: 'hr_position_grade_salary',
                action: 'getsalaryitemcaption',
                data: {
                    flag:88,
                    hr_salary_group_id:$scope.data.currItem.hr_salary_group_id,
                    position_grade:$scope.data.currItem.position_grade
                }
            })
                .then(function ( response ) {
                    add_employee_policy(response.hr_position_grade_salarys);
                })
        };




        /**
         * 设置数据
         */
        $scope.setBizData = function (bizData) {
            $scope.hcSuper.setBizData(bizData);
            //设置教育经历
            $scope.gridOptions_education.hcApi.setRowData(bizData.employee_educationofemployee_headers);
            //设置工作经历
            $scope.gridOptions_line.hcApi.setRowData(bizData.employee_lineofemployee_headers);
            //设置培训经历
            $scope.gridOptions_training.hcApi.setRowData(bizData.employee_trainingofemployee_headers);
            //设置固薪标准
            $scope.gridOptions_fsalay.hcApi.setRowData(bizData.employee_fsalaryofemployee_headers);
            //社保合同
            $scope.gridOptions_assure.hcApi.setRowData(bizData.hr_insrnc_policy_lineofemployee_headers);
            //异动记录
            $scope.gridOptions_change.hcApi.setRowData(bizData.employee_changeofemployee_headers);
            //内训记录
            $scope.gridOptions_train.hcApi.setRowData(bizData.employee_trainofemployee_headers);
            //合同信息
            $scope.gridOptions_contract.hcApi.setRowData(bizData.hr_contractofemployee_headers);
            

        }

        /*----------------------------------按钮及标签 定义-------------------------------------------*/

        /*底部左边按钮*/

        $scope.footerLeftButtons.addRow.click = function(){
            if($scope.tabs.education.active){
                $scope.add_education && $scope.add_education();
            }
            if($scope.tabs.line.active){
                $scope.add_line && $scope.add_line();
            }
            if($scope.tabs.training.active){
                $scope.add_training && $scope.add_training();
            }
        }
        $scope.footerLeftButtons.addRow.hide = function(){
            return (!$scope.tabs.education.active && !$scope.tabs.line.active && !$scope.tabs.training.active);
        }
        $scope.footerLeftButtons.deleteRow.click=function(){
            if($scope.tabs.education.active){
                $scope.del_education && $scope.del_education();
            }
            if($scope.tabs.line.active){
                $scope.del_line && $scope.del_line();
            }
            if($scope.tabs.training.active){
                $scope.del_training && $scope.del_training();
            }

        }
        $scope.footerLeftButtons.deleteRow.hide=function(){
            return (!$scope.tabs.education.active && !$scope.tabs.line.active && !$scope.tabs.training.active);
        }
        /*----------------------------------按钮方法 定义-------------------------------------------*/
        //添加教育经历
        $scope.add_education = function () {
            var msg = $scope.validHead([]);
            if (msg.length > 0) {
                return swalApi.info(msg);
            }
            $scope.gridOptions_education.api.stopEditing();
            swal({
                title: '请输入要增加的行数',
                type: 'input', //类型为输入框
                inputValue: 1, //输入框默认值
                closeOnConfirm: false, //点击确认不关闭，由后续代码判断是否关闭
                showCancelButton: true //显示【取消】按钮
            }, function (inputValue) {
                if (inputValue === false) {
                    swal.close();
                    return;
                }

                var rowCount = Number(inputValue);
                if (rowCount <= 0) {
                    swal.showInputError('请输入有效的行数');
                    return;
                }
                else if (rowCount > 1000) {
                    swal.showInputError('请勿输入过大的行数(1000以内为宜)');
                    return;
                }

                swal.close();

                var data = $scope.data.currItem.employee_educationofemployee_headers;

                for (var i = 0; i < rowCount; i++) {
                    var newLine = {

                    };
                    data.push(newLine);
                }
                $scope.gridOptions_education.hcApi.setRowData(data);
            });
        };
        /**
         * 删除行教育经历
         */
        $scope.del_education = function () {
            var idx = $scope.gridOptions_education.hcApi.getFocusedRowIndex();
            if (idx < 0) {
                swalApi.info('请选中要删除的行');
            } else {
                $scope.data.currItem.employee_educationofemployee_headers.splice(idx, 1);
                $scope.gridOptions_education.hcApi.setRowData($scope.data.currItem.employee_educationofemployee_headers);
            }
        };

        //添加工作经历
        $scope.add_line = function () {
            var msg = $scope.validHead([]);
            if (msg.length > 0) {
                return swalApi.info(msg);
            }
            $scope.gridOptions_line.api.stopEditing();
            swal({
                title: '请输入要增加的行数',
                type: 'input', //类型为输入框
                inputValue: 1, //输入框默认值
                closeOnConfirm: false, //点击确认不关闭，由后续代码判断是否关闭
                showCancelButton: true //显示【取消】按钮
            }, function (inputValue) {
                if (inputValue === false) {
                    swal.close();
                    return;
                }

                var rowCount = Number(inputValue);
                if (rowCount <= 0) {
                    swal.showInputError('请输入有效的行数');
                    return;
                }
                else if (rowCount > 1000) {
                    swal.showInputError('请勿输入过大的行数(1000以内为宜)');
                    return;
                }

                swal.close();

                var data = $scope.data.currItem.employee_lineofemployee_headers;

                for (var i = 0; i < rowCount; i++) {
                    var newLine = {

                    };
                    data.push(newLine);
                }
                $scope.gridOptions_line.hcApi.setRowData(data);
            });
        };
        /**
         * 删除行工作经历
         */
        $scope.del_line = function () {
            var idx = $scope.gridOptions_line.hcApi.getFocusedRowIndex();
            if (idx < 0) {
                swalApi.info('请选中要删除的行');
            } else {
                $scope.data.currItem.employee_lineofemployee_headers.splice(idx, 1);
                $scope.gridOptions_line.hcApi.setRowData($scope.data.currItem.employee_lineofemployee_headers);
            }
        };

        //添加培训经历
        $scope.add_training = function () {
            var msg = $scope.validHead([]);
            if (msg.length > 0) {
                return swalApi.info(msg);
            }
            $scope.gridOptions_training.api.stopEditing();
            swal({
                title: '请输入要增加的行数',
                type: 'input', //类型为输入框
                inputValue: 1, //输入框默认值
                closeOnConfirm: false, //点击确认不关闭，由后续代码判断是否关闭
                showCancelButton: true //显示【取消】按钮
            }, function (inputValue) {
                if (inputValue === false) {
                    swal.close();
                    return;
                }

                var rowCount = Number(inputValue);
                if (rowCount <= 0) {
                    swal.showInputError('请输入有效的行数');
                    return;
                }
                else if (rowCount > 1000) {
                    swal.showInputError('请勿输入过大的行数(1000以内为宜)');
                    return;
                }

                swal.close();

                var data = $scope.data.currItem.employee_trainingofemployee_headers;

                for (var i = 0; i < rowCount; i++) {
                    var newLine = {

                    };
                    data.push(newLine);
                }
                $scope.gridOptions_training.hcApi.setRowData(data);
            });
        };
        /**
         * 删除行培训经历
         */
        $scope.del_training = function () {
            var idx = $scope.gridOptions_training.hcApi.getFocusedRowIndex();
            if (idx < 0) {
                swalApi.info('请选中要删除的行');
            } else {
                $scope.data.currItem.employee_trainingofemployee_headers.splice(idx, 1);
                $scope.gridOptions_training.hcApi.setRowData($scope.data.currItem.employee_trainingofemployee_headers);
            }
        };


        //添加薪资福利
        $scope.add_fsalay = function () {
            $scope.gridOptions_fsalay.api.stopEditing();

            var data = $scope.data.currItem.employee_fsalaryofemployee_headers;

            var newLine = {

            };
            data.push(newLine);

            $scope.gridOptions_fsalay.hcApi.setRowData(data);
        };
        /**
         * 删除行薪资福利
         */
        $scope.del_fsalay = function () {
            var idx = $scope.gridOptions_fsalay.hcApi.getFocusedRowIndex();
            if (idx < 0) {

            } else {
                $scope.data.currItem.employee_fsalaryofemployee_headers.splice(idx, 1);
                $scope.gridOptions_fsalay.hcApi.setRowData($scope.data.currItem.employee_fsalaryofemployee_headers);
            }
        };
        /*----------------------------------计算-------------------------------------------*/
        //计算转正日期
        $scope.setFormalDate=function() {
            var start_time=new Date($scope.data.currItem.start_date);
            start_time=start_time.getTime();
            var try_time=$scope.data.currItem.try_day*24*60*60*1000;
            var formal_time=start_time+try_time;
            var formal_li=new Date(formal_time);

            var year = formal_li.getFullYear();
            var month = formal_li.getMonth()+1;
            if(month<10){
                month="0"+month;
            }
            var today = formal_li.getDate();
            if(today<10){
                today="0"+today;
            }
            $scope.data.currItem.formal_date=year+"-"+month+"-"+today;
        };
        //计算试用天数
        $scope.setTryDay= function () {
            var formal_time=new Date($scope.data.currItem.formal_date).getTime();
            var start_time=new Date($scope.data.currItem.start_date).getTime();
            var try_time=formal_time-start_time;
            $scope.data.currItem.try_day = parseInt(try_time/1000/60/60/24);
        };


        /**
         * 校验身份证号
         */
        $scope.birthdaySex = function (args) {
            var str = $scope.data.currItem.idcard;
            var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

            if(str.length<18||!p.test(str)){
                swalApi.info('请正确输入18位身份证号');
                return;
            }
            var date=str.slice(6,14);
            var y=date.slice(0,4);
            var m=date.slice(4,6);
            var d=date.slice(6);
            $scope.data.currItem.birthday = y+"-"+m+"-"+d;
            var sex=str.charAt(16);
            if(sex%2==1){
                $scope.data.currItem.sex=1;
            }
            if(sex%2==0){
                $scope.data.currItem.sex=2;
            }

        };
        //保存验证
        $scope.validCheck = function (invalidBox) {
            var str = $scope.data.currItem.idcard;
            var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
            if(!p.test(str)){
                invalidBox.push("请正确输入18位身份证号");
                $scope.hcSuper.validCheck(invalidBox);
                return invalidBox;
            }else{
                return requestApi.post({
                    classId: 'employee_blacklist',
                    action: 'search',
                    data: {
                        sqlwhere:"Idcard='"+$scope.data.currItem.idcard+"'"
                    }
                })
                    .then(function ( response ) {
                        if(response.employee_blacklists.length>0){
                            invalidBox.push("已加入特殊名单，不能再入职");
                        }
                    }).then(function(){
                        $scope.hcSuper.validCheck(invalidBox);
                        return invalidBox;
                    });
            }
        };

        //验证表头信息是否填完
        $scope.validHead = function (invalidBox) {
            $scope.hcSuper.validCheck(invalidBox);
            return invalidBox;
        }
        /*----------------------------------标签定义-------------------------------------------*/

        $scope.tabs.base = {
            title: '基本信息',
            active:true
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
        $scope.tabs.change = {
            title: '异动记录'
        };
        $scope.tabs.train = {
            title: '内训记录'
        };
        $scope.tabs.contract = {
            title: '劳动合同'
        };

        $scope.footerRightButtons['saveThenAdd'].hide = true;
    }
    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: EmployeeHeaderProp
    });

});