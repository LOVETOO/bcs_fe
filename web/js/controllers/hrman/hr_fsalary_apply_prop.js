/**
 * 固定薪资申请
 * Created by liujianbing on 2019/4/20.
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', 'dateApi'], defineFn)
})(function (module, controllerApi, base_obj_prop, requestApi, swalApi, dateApi) {

    HrFsalaryApply.$inject = ['$scope', '$modal'];

    function HrFsalaryApply($scope, $modal) {

        //继承基础控制器
        controllerApi.extend({
            controller: base_obj_prop.controller,
            scope: $scope
        });

        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'employee_code',
                headerName: '员工编码',
                editable: true,
                onCellDoubleClicked: function (args) {
                    $scope.chooseEmployee(args);
                },
                hcRequired: true
            }, {
                field: 'employee_name',
                headerName: '姓名'
            }, {
                field: 'position_name',
                headerName: '职位',

            }, {
                field: 'is_cancle',
                headerName: '需要作废',
                hcDictCode: 'is_cancle',
                editable: true,
                hcRequired: true
            }, {
                field: 'line_remark',
                headerName: '调薪原因',
                editable: true,
                hcRequired: true
            }]


        };

        /*----------------------------------通用查询相关内容-------------------------------------------*/

        $scope.commonSearchSettingOfDept = {
            afterOk: function (result) {
                $scope.data.currItem.dept_id = result.dept_id;
                $scope.data.currItem.dept_code = result.dept_code;
                $scope.data.currItem.dept_name = result.dept_name;
            }
        };

        //薪资组查询
        $scope.commonSearchSettingOfSalaryGroup = {
            afterOk: function (result) {
                $scope.data.currItem.salary_group_code = result.salary_group_code;
                $scope.data.currItem.salary_group_name = result.salary_group_name;
                $scope.data.currItem.hr_salary_group_id = result.hr_salary_group_id;
            }
        };

        $scope.chooseEmployee = function (args) {
            $modal.openCommonSearch({
                    classId: 'employee_header',
                    postData: {},
                    action: 'search',
                    title: "个人社保",
                    gridOptions: {
                        columnDefs: [{
                            headerName: "人员编码",
                            field: "employee_code"
                        }, {
                            headerName: "人员名称",
                            field: "employee_name"
                        }, {
                            headerName: "职位",
                            field: "position_name"
                        }]
                    }
                })
                .result//响应数据
                .then(function (response) {
                    args.data.employee_id = response.employee_id;
                    args.data.employee_code = response.employee_code;
                    args.data.employee_name = response.employee_name;
                    args.data.position_name = response.position_name;
                }).then(function () {
                args.api.refreshView();
            });
        };


        /*----------------------------------下拉框选项-------------------------------------------*/
        //初始化薪资组选项的数组
        $scope.salary_groups = [];

        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);

            bizData.hr_employee_fsalary_lineofhr_employee_fsalary_heads = [];
            var data = $scope.data.currItem.hr_employee_fsalary_lineofhr_employee_fsalary_heads;
            var newLine = {};
            data.push(newLine);
            $scope.gridOptions.hcApi.setRowData(bizData.hr_employee_fsalary_lineofhr_employee_fsalary_heads);

            $scope.data.currItem.year_month = dateApi.nowYear() + "-" + dateApi.nowMonth();
        };

        //验证表头信息是否填完
        $scope.validHead = function (invalidBox) {
            $scope.hcSuper.validCheck(invalidBox);
            return invalidBox;
        };


        //薪资组选项获取
        var position = function () {
            requestApi.post({
                    classId: 'hr_salary_group',
                    action: 'search',
                    data: {}
                })
                .then(function (response) {
                    return response.hr_salary_groups;
                })
                .then(function (value) {
                    value.forEach(function (val) {
                        var o = {};
                        o.value = val.hr_salary_group_id;
                        o.name = val.salary_group_name;
                        $scope.salary_groups.push(o);
                    });
                });
        }();

        //设置数据
        $scope.setBizData = function (bizData) {
            $scope.hcSuper.setBizData(bizData);
            $scope.gridOptions.hcApi.setRowData(bizData.hr_employee_fsalary_lineofhr_employee_fsalary_heads);


        };


        /*----------------------------------按钮及标签 定义-------------------------------------------*/

        /*底部左边按钮*/

        $scope.footerLeftButtons.addRow.click = function () {
            $scope.add_line && $scope.add_line();
        };
        $scope.footerLeftButtons.addRow.hide = function () {
            return $scope.data.currItem.stat > 1;
        };
        $scope.footerLeftButtons.deleteRow.click = function () {
            $scope.del_line && $scope.del_line();

        };
        $scope.footerLeftButtons.deleteRow.hide = function () {
            return $scope.data.currItem.stat > 1;
        };

        /*----------------------------------按钮方法 定义-------------------------------------------*/
        //添加明细
        $scope.add_line = function () {

            $scope.gridOptions.api.stopEditing();
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

                var data = $scope.data.currItem.hr_employee_fsalary_lineofhr_employee_fsalary_heads;

                for (var i = 0; i < rowCount; i++) {
                    var newLine = {};
                    data.push(newLine);
                }
                $scope.gridOptions.hcApi.setRowData(data);
            });
        };
        /**
         * 删除行明细
         */
        $scope.del_line = function () {
            var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
            if (idx < 0) {
                swalApi.info('请选中要删除的行');
            } else {
                $scope.data.currItem.hr_employee_fsalary_lineofhr_employee_fsalary_heads.splice(idx, 1);
                if ($scope.data.currItem.hr_employee_fsalary_lineofhr_employee_fsalary_heads.length == 0) {
                    var newLine = {};
                    $scope.data.currItem.hr_employee_fsalary_lineofhr_employee_fsalary_heads.push(newLine);
                }
                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.hr_employee_fsalary_lineofhr_employee_fsalary_heads);
            }
        };

        $scope.tabs.base = {
            title: '基本信息'
        };
    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: HrFsalaryApply
    });
});