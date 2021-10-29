/**
 * Created by liujianbing on 2019/4/28.
 */
(function (defineFn) {
    define(['module','controllerApi','base_diy_page', 'requestApi','openBizObj','directive/hcObjList','directive/hcBox'], defineFn);
})(function (module,controllerApi,base_diy_page, requestApi,openBizObj) {
    HrProbationWarm.$inject=['$scope','$parse'];
    function HrProbationWarm($scope,$parse){
        /*----------------------------------数据定义-------------------------------------------*/
        
        $scope.gridOptions={
            columnDefs:[{
                type:'序号'
            },{
                field: 'employee_code',
                headerName: '员工编码'
            },{
                field: 'employee_name',
                headerName: '员工名称'
            },{
                field: 'org_name',
                headerName: '所属部门'
            },{
                field: 'position_name',
                headerName: '职位'
            },{
                field: 'start_date',
                headerName: '入职日期',
                type:'日期'
            }, {
                field: 'try_day',
                headerName: '试用期天数'
            },{
                field: 'formal_date',
                headerName: '预计转正日期',
                type:'日期'
            },{
                field: '',
                headerName: '到期状态',
                hcDictCode:'assure_stat'
            }, {
                field: 'assure_stat',
                headerName: '参保状态',
                hcDictCode:'assure_stat'
            },  {
                field: 'idcard',
                headerName: '身份证'
            },{
                field: 'sex',
                headerName: '性别',
                hcDictCode:'gender'
            },  {
                field: 'hometown',
                headerName: '籍贯'
            }],

            hcClassId: 'employee_header'
        };
        //继承控制器
        controllerApi.extend({
            controller:base_diy_page.controller,
            scope:$scope
        });
        //初始化页面
        $scope.doInit=function(){
            $parse('data.currItem.try_day_search').assign($scope, 0);
            $parse('data.currItem.probation_stat').assign($scope, 2);
            return $scope.hcSuper.doInit()
                .then($scope.getdata)
                .then($scope.setdata)
        };

        /*----------------------------------数据定义-------------------------------------------*/

        //
        $scope.changePosition = function () {
            if ($scope.data.currItem.probation_stat==1){
                $scope.data.currItem.end_days=0;
            }
        }
        /*----------------------------------通用查询相关内容-------------------------------------------*/


        //部门 查询
        $scope.commonSearchSettingOfDept = {
            afterOk: function (result) {
                $scope.data.currItem.org_id = result.dept_id;
                $scope.data.currItem.org_code = result.dept_code;
                $scope.data.currItem.org_name_search = result.dept_name;
            }
        };

        //职位 查询
        $scope.commonSearchSettingOfPosition = {
            afterOk: function (result) {
                $scope.data.currItem.hr_position_id = result.hr_position_id;
                $scope.data.currItem.hr_position_code = result.position_code;
                $scope.data.currItem.position_name_search = result.position_name;

            }
        };

        /*----------------------------------按钮定义-------------------------------------------*/
        $scope.toolButtons = {
            search: {
                groupId: 'base',
                title: '查询',
                icon: 'iconfont ',
                click: function () {
                    return $scope.search && $scope.search();
                }
            },
            openProp3: {
                title: '转正',
                icon: 'iconfont',
                click: function () {
                    return $scope.change && $scope.change_formal();
                }
            },
            openProp2: {
                title: '中止试用期',
                icon: 'iconfont',
                click: function () {
                    return $scope.change && $scope.change('中止试用期');
                }
            },

            openProp1: {
                title: '延长试用期',
                icon: 'iconfont',
                click: function () {
                    return $scope.change && $scope.change('延长试用期');
                }
            },

             export: {
                title: '导出',
                    icon: 'iconfont ',
                    click: function () {
                    return $scope.gridOptions.hcApi.exportToExcel();
                }
             }
        };
        //查询方法定义
        $scope.search=function () {
            return requestApi.post({
                classId: 'employee_header',
                action: 'search',
                data: {
                    org_name:$scope.data.currItem.org_name_search,
                    hr_position_id:$scope.data.currItem.hr_position_id,
                    try_day:$scope.data.currItem.try_day_search,
                    flag:1904
                }})
                .then(function ( response ) {
                    $scope.gridOptions.hcApi.setRowData(response.employee_headers);
                })
        };
        //试用期修改
        $scope.change=function (str) {
            var emp=$scope.gridOptions.hcApi.getFocusedData()
            emp.change_type_name=str;
            var employee=JSON.stringify(emp)
            openBizObj({
                stateName: 'hrman.hr_position_employee_change_prop',		//路由名
                params: {
                     employee: employee
                }			//路由参数
            });
        }
        //转正
        $scope.change_formal=function () {
            var emp=$scope.gridOptions.hcApi.getFocusedData();
            emp.change_type_name="转正";
            var employee=JSON.stringify(emp);
            openBizObj({
                stateName: 'hrman.hr_position_employee_change_prop',		//路由名
                params: {
                    employee: employee
                }			//路由参数
            });
        }

    }



    return controllerApi.controller({
        module:module,
        controller:HrProbationWarm
    });

})