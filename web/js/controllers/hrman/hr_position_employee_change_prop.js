/**
 * 员工异动申请 hr_position_employee_change_prop
 * Created by ljb on 2019/4/18.
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'dateApi','swalApi'], defineFn)
})(function (module, controllerApi, base_obj_prop, requestApi,  dateApi ,swalApi) {

    HrPositionEmployeeChangeProp.$inject = ['$scope', '$stateParams']

    function HrPositionEmployeeChangeProp($scope, $stateParams) {
        /*----------------------------------能否编辑-------------------------------------------*/
        function editable() {
            if ($scope.data.currItem.stat == 1)
                return true;
            return false;
        }
        //继承基础控制器
        controllerApi.extend({
            controller: base_obj_prop.controller,
            scope: $scope
        });

        /*----------------------------------表格定义-------------------------------------------*/
        //表格定义  "教育经历"
        $scope.gridOptions_fsalay = {
            columnDefs: [{
                type: '序号'
            },{
                field: 'fsalary_item_name',
                headerName: '固薪项目名称'
            },{
                field: 'fsalary_limits',
                headerName: '调整后固薪范围标准'
            },{
                field: 'fsalary_amount_old',
                headerName: '调整前固薪额'
            },{
                field: 'fsalary_amount',
                headerName: '调整后固薪额',
                editable: true
            }],
        };



        /*----------------------------------通用查询相关内容-------------------------------------------*/

        //员工 查询
        $scope.commonSearchSettingOfEmployee = {
            afterOk: function (result) {
                $scope.data.currItem.employee_id = result.employee_id;
                $scope.data.currItem.employee_code = result.employee_code;
                $scope.data.currItem.employee_name = result.employee_name;
                $scope.data.currItem.org_name=result.org_name;
                $scope.data.currItem.hr_position_id=result.hr_position_id;
                $scope.data.currItem.position_name=result.position_name;
                $scope.data.currItem.assure_stat=result.assure_stat;
                $scope.data.currItem.start_date=result.start_date;
                $scope.data.currItem.try_day=result.try_day;
                $scope.data.currItem.formal_date=result.formal_date;
            },
            beforeOpen:function(){
                if(!$scope.data.currItem.change_type_name){
                    swalApi.info('请先选异动类型');
                    return false;
                }
            }

        };

        //部门 查询
        $scope.commonSearchSettingOfDept = {
            afterOk: function (result) {
                $scope.data.currItem.new_org_id = result.dept_id;
                $scope.data.currItem.new_org_code = result.dept_code;
                $scope.data.currItem.new_org_name = result.dept_name;
            }
            ,
            beforeOpen:function(){
                if(!$scope.data.currItem.change_type_name){
                    swalApi.info('请先选异动类型');
                    return false;
                }
            }
        };

        //职位 查询
        $scope.commonSearchSettingOfPosition = {
            afterOk: function (result) {
                $scope.data.currItem.new_hr_position_id = result.hr_position_id;
                $scope.data.currItem.new_hr_position_code = result.position_code;
                $scope.data.currItem.new_position_name = result.position_name;
            }
            ,
            beforeOpen:function(){
                if(!$scope.data.currItem.change_type_name){
                    swalApi.info('请先选异动类型');
                    return false;
                }
            }
        };

        //社保组 查询
        $scope.commonSearchSettingOfnsrncGroup = {
            afterOk: function (result) {
                $scope.data.currItem.hr_insrnc_group_id = result.hr_insrnc_group_id;
                $scope.data.currItem.hr_insrnc_group_code = result.insrnc_group_code;
                $scope.data.currItem.insrnc_group_name = result.insrnc_group_name;
            }
            ,
            beforeOpen:function(){
                if(!$scope.data.currItem.change_type_name){
                    swalApi.info('请先选异动类型');
                    return false;
                }
            }
        };

        //异动类型 查询
        $scope.commonSearchSettingOfchangeType = {
            sqlWhere: function () {
                return " usable = 2 and for_billtype = 2";
            },
            afterOk: function (result) {
                $scope.data.currItem.change_type=result.hr_change_type_id;
                $scope.data.currItem.hr_change_type_id = result.hr_change_type_id;
                $scope.data.currItem.change_type_code = result.change_type_code;
                $scope.data.currItem.change_type_name = result.change_type_name;

                if(result.is_writeendsalarytime==2){
                    var date_time=new Date($scope.data.currItem.change_date).getTime();
                    date_time=date_time-24*60*60*1000
                    var stop_time=new Date(date_time);

                    var year = stop_time.getFullYear();
                    var month = stop_time.getMonth()+1;
                    if(month<10){
                        month="0"+month;
                    }
                    var today = stop_time.getDate();
                    if(today<10){
                        today="0"+today;
                    }
                    $scope.data.currItem.salary_stop_date=year+"-"+month+"-"+today;
                }
                if(result.is_inheimingdan==2){
                    $scope.data.currItem.is_heimingdan=2;
                    $scope.data.lock_flag=true;
                }else{
                    $scope.data.currItem.is_heimingdan=1;
                    $scope.data.lock_flag=false;
                }
            }
        };



        /*----------------------------------数据定义-------------------------------------------*/
        $scope.data.lock_flag=false;
        $scope.salary_groups=[];
        /**
         * 新增时数据
         */
        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);

            bizData.employee_change_fsalaryofemployee_changes = [];
            $scope.gridOptions_fsalay.hcApi.setRowData(bizData.employee_change_fsalaryofemployee_changes);

            $scope.data.f=false;
            $scope.data.currItem.change_date=dateApi.today();
            //试用期预警跳转
            if($stateParams.employee){
                var employee =JSON.parse($stateParams.employee)
                $scope.data.currItem.employee_id=employee.employee_id;
                $scope.data.currItem.employee_name=employee.employee_name;
                $scope.data.currItem.employee_code=employee.employee_code;
                $scope.data.currItem.org_name=employee.org_name;
                $scope.data.currItem.position_name=employee.position_name;
                $scope.data.currItem.assure_stat=employee.assure_stat;
                $scope.data.currItem.start_date=employee.start_date;
                $scope.data.currItem.try_day=employee.try_day;
                $scope.data.currItem.formal_date=employee.formal_date;
                $scope.data.currItem.change_type_name=employee.change_type_name;
                delete $scope.data.currItem.lock_type;
                delete $scope.data.currItem.lock_start_date;
                delete $scope.data.currItem.lock_days;
                delete $scope.data.currItem.lock_end_date;
                delete $scope.data.currItem.heimingdan_reson;
                //试用期预警跳转，部分标签设为只读
                 $scope.data.f=true;
                 return;
            }

            $scope.data.currItem.lock_start_date=dateApi.today();
        };

        //自执行获取薪资组信息
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
        //添加薪资项目明细
        function add_employee_policy(args) {
            var rowCount = args.length;
            var data = $scope.data.currItem.employee_change_fsalaryofemployee_changes;

            for (var i = 0; i < rowCount; i++) {
                var newLine = {
                    fsalary_item_name : args[i].salary_item_name,
                    fsalary_item_code:args[i].salary_item_code,
                    fsalary_limits : args[i].f_salary_limits,
                    // fsalary_amount_old : $scope.data.currItem.fsalary_amount_old

                };
                data.push(newLine);
            }
            $scope.gridOptions_fsalay.hcApi.setRowData(data);
        }
        //薪资组选择
        $scope.changePosition = function () {

            var l=$scope.data.currItem.employee_change_fsalaryofemployee_changes.length;

            for(var j=0;j<l;j++){
                $scope.del_fsalay();
            }

            return requestApi.post({
                classId: 'hr_position_grade_salary',
                action: 'getsalaryitemcaption',
                data: {
                    flag:88,
                    hr_salary_group_id:$scope.data.currItem.hr_salary_group_id,
                    employee_id:$scope.data.currItem.employee_id,
                    position_grade:10

                }
            })
            .then(function ( response ) {
                add_employee_policy(response.hr_position_grade_salarys);
            })
        }
        //删除薪资项目明细
        $scope.del_fsalay = function () {
            var idx = $scope.gridOptions_fsalay.hcApi.getFocusedRowIndex();
            if (idx < 0) {

            } else {
                $scope.data.currItem.employee_change_fsalaryofemployee_changes.splice(idx, 1);
                $scope.gridOptions_fsalay.hcApi.setRowData($scope.data.currItem.employee_change_fsalaryofemployee_changes);
            }
        };

        //验证异动类型是否已填
        $scope.isChangeChose = function (key) {
            if(!$scope.data.currItem.change_type_name){
                swalApi.info('请先选异动类型');
                delete $scope.data.currItem[key];
            }
            if($scope.data.currItem.is_heimingdan==1){
                delete $scope.data.currItem.lock_type;
                delete $scope.data.currItem.lock_start_date;
                delete $scope.data.currItem.lock_days;
                delete $scope.data.currItem.lock_end_date;
                delete $scope.data.currItem.heimingdan_reson;
            }else{
                $scope.data.currItem.lock_type=2;
                $scope.data.currItem.lock_start_date=dateApi.today();
            }

        }
        /**
         * 设置数据
         */
        $scope.setBizData = function (bizData) {
            $scope.hcSuper.setBizData(bizData);
            // $scope.data.currItem.change_date=dateApi.today();
            // $scope.data.currItem.lock_start_date=dateApi.today();
        };

        /*----------------------------------保存前的验证-------------------------------------------*/


        //验证表头信息是否填完
        $scope.validHead = function (invalidBox) {
            $scope.hcSuper.validCheck(invalidBox);
            if($scope.data.currItem.try_day.isNaN()){
                invalidBox.push('试用期请填写数字');
            }
            return invalidBox;
        }

        /*----------------------------------计算-------------------------------------------*/
        //计算转正日期
        $scope.setLockEndDate=function() {
            var l_days=$scope.data.currItem.lock_days;
            var str=/^[0-9]*$/ ;
            if(l_days<0||!str.test(l_days)){
                swalApi.info('期限输入有误，请重新填写');
                $scope.data.currItem.lock_days=0;
                delete $scope.data.currItem.lock_end_date;
                return;
            }else{
                var start_time=new Date($scope.data.currItem.lock_start_date);
                start_time=start_time.getTime();
                var try_time=$scope.data.currItem.lock_days*24*60*60*1000;
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
                $scope.data.currItem.lock_end_date=year+"-"+month+"-"+today;
            }
        };
        //计算试用天数
        $scope.setEndDay= function () {
            var start_time=new Date($scope.data.currItem.lock_start_date).getTime();
            var end_time=new Date($scope.data.currItem.lock_end_date).getTime();
            if((end_time-start_time)<0){
                swalApi.info('结束日期有误，请重新选择');
                $scope.data.currItem.lock_days=0;
                delete $scope.data.currItem.lock_end_date;
                return
            }else{
                var try_time=end_time-start_time;
                $scope.data.currItem.lock_days = parseInt(try_time/1000/60/60/24);
            }
        };
        //锁定类型修改
        $scope.chLockType= function () {
            if($scope.data.currItem.lock_type==2){
                $scope.data.currItem.lock_start_date=dateApi.today();
            }else{
                delete $scope.data.currItem.lock_start_date ;
                delete $scope.data.currItem.lock_days ;
                delete $scope.data.currItem.lock_end_date ;
            }
        };

        /*----------------------------------标签定义-------------------------------------------*/

        $scope.tabs.base = {
            title: '基本信息',
            active:true
        };
        $scope.tabs.salary = {
            title: '薪酬福利信息'
        };
        $scope.tabs.other = {
            title: '其他'
        };




    }
    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: HrPositionEmployeeChangeProp
    });

});