/**
 * 员工薪资分配
 * 2019/5/6.     hr_searchempsalarygroup_list
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi) {
        'use strict';

        var HrSearchempsalarygroupList = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                /*----------------------------------能否编辑-------------------------------------------*/
                function editable() {
                    return true;
                }

                $scope.data = {};
                $scope.data.currItem = {
                    search_flag: 1
                };
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        headerName: "员工编码",
                        field: "employee_code"
                    }, {
                        headerName: "员工名称",
                        field: "employee_name"
                    }, {
                        headerName: "所属部门",
                        field: "org_name"
                    }, {
                        headerName: "薪资组编码",
                        field: "salary_group_code",
                        editable: function (args) {
                            return editable();
                        },
                        onCellDoubleClicked: function (args) {
                            $scope.choose_salary_group_code(args);
                        },
                        onCellValueChanged: function (args) {

                            if (args.newValue === args.oldValue) {
                                return;
                            }
                            if ((args.data.salary_group_code == 0) || (args.data.salary_group_code = null)) {
                                $scope.chooseItem(args);
                                return;
                            }
                            getSalaryGroup(args.newValue)
                                .catch(function (reason) {
                                    return {
                                        hr_salary_group_id: 0,
                                        salary_group_code: '',
                                        salary_group_name: reason
                                    };
                                })
                                .then(function (line) {
                                    angular.extend(args.data, line);
                                    return args.data;
                                })
                                .then(function () {
                                    args.api.refreshView();
                                });

                        }
                    }, {
                        headerName: "薪资组名称",
                        field: "salary_group_name"
                    }, {
                        headerName: "在职状态",
                        field: "stat",
                        hcDictCode: 'emp_stat'
                    }],
                    hcBeforeRequest: function (searchObj) {
                        searchObj.search_flag = $scope.data.currItem.search_flag,
                            searchObj.employee_id = $scope.data.currItem.employee_id,
                            searchObj.hr_salary_group_id = $scope.data.currItem.hr_salary_group_id
                    },
                    hcRequestAction: 'searchempsalarygroup',
                    hcDataRelationName: 'employee_headerofemployee_headers',
                    hcClassId: 'employee_header'
                };

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });


                /**
                 * 查表头薪资组
                 */
                $scope.choose_salary_group_area_name = {
                    afterOk: function (result) {
                        $scope.data.currItem.salary_group_name = result.salary_group_name;
                        $scope.data.currItem.salary_group_code = result.salary_group_code;
                        $scope.data.currItem.hr_salary_group_id = result.hr_salary_group_id;
                        $scope.gridOptions.hcApi.search()
                    }
                };


                /**
                 * 查员工
                 */
                $scope.choose_employee_name = {
                    afterOk: function (result) {
                        $scope.data.currItem.employee_name = result.employee_name;
                        $scope.data.currItem.employee_code = result.employee_code;
                        $scope.data.currItem.employee_id = result.employee_id;
                        $scope.gridOptions.hcApi.search();
                    }
                };

                /**
                 * 查薪资组
                 */
                $scope.choose_salary_group_code = function (args) {
                    $modal.openCommonSearch({
                            classId: 'hr_salary_group',
                            postData: {},
                            action: 'search',
                            title: "薪资组查询",
                            sqlWhere: 'usable = 2 ',
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "薪资组编码",
                                        field: "salary_group_code"
                                    }, {
                                        headerName: "薪资组名称",
                                        field: "salary_group_name"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.hr_salary_group_id = result.hr_salary_group_id;
                            args.data.salary_group_code = result.salary_group_code;
                            args.data.salary_group_name = result.salary_group_name;
                            args.api.refreshView();//刷新网格视图
                        });
                };

                //copy薪资组处理
                function getSalaryGroup(code) {
                    var postData = {
                        classId: "hr_salary_group",
                        action: 'search',
                        data: {sqlwhere: "salary_group_code = '" + code + "' and usable = 2"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.hr_salary_groups.length > 0) {
                                return data.hr_salary_groups[0];
                            } else {
                                return $q.reject("薪资组编码【" + code + "】不可用");
                            }
                        });
                }

                //取消员工薪资组
                $scope.chooseItem = function (args) {
                    args.data.salary_group_name = undefined;
                    args.data.hr_salary_group_id = 0;
                };
                //改变分配条件
                $scope.changeSearchFlag = function () {
                    if ($scope.data.currItem.search_flag == 0 || $scope.data.currItem.search_flag == null) {
                        $scope.data.currItem.search_flag = undefined;
                    }
                    ;
                    $scope.gridOptions.hcApi.search()
                };
                //改变薪资组查询条件
                $scope.changeSalary = function () {
                    if ($scope.data.currItem.salary_group_name == 0 || $scope.data.currItem.salary_group_name == null) {
                        $scope.data.currItem.hr_salary_group_id = undefined;
                    }
                    ;
                    $scope.gridOptions.hcApi.search()
                };
                //改变员工查询条件
                $scope.changeEmployeeName = function () {
                    if (($scope.data.currItem.employee_name == 0) || ($scope.data.currItem.employee_name = null)) {
                        $scope.data.currItem.employee_id = undefined
                    }
                    ;
                    $scope.gridOptions.hcApi.search()
                };

                //添加按钮
                $scope.toolButtons = {


                    search: {
                        title: '查询',
                        icon: 'fa fa-search',
                        click: function () {
                            $scope.gridOptions.hcApi.search();
                        }
                    },
                    save: {
                        title: '保存',
                        icon: 'fa fa-search',
                        click: function () {
                            $scope.save && $scope.save();
                        }
                    }
                };
                /**
                 * 保存
                 */
                $scope.save = function () {
                    var action = 'empsalarygroupupdateupdate';
                    var postdata = {
                        employee_headerofemployee_headers: $scope.gridOptions.hcApi.getRowData()
                    };
                    //调用后台保存方法
                    requestApi.post("employee_header", action, postdata).then(function (data) {
                        return swalApi.success('保存成功!');
                    }).then($scope.serarch);
                };

                //保存按钮函数
                $scope.serarch = function () {
                    $scope.gridOptions.hcApi.search()
                };

            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: HrSearchempsalarygroupList
        });
    }
);