/**
 * 员工培训登记属性表
 * Created by shenguocheng
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'numberApi', 'dateApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, numberApi, dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数


            function ($scope, $modal) {
                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    currItem: {}
                };
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: "employee_code",
                        headerName: "人员编码",
                        width: 150,
                        editable: true,
                        onCellDoubleClicked: function (args) {
                            $scope.choose_employee_name(args);
                        },
                        hcRequired: true
                    }, {
                        field: "employee_name",
                        headerName: "人员姓名",
                        hcRequired: true
                    }, {
                        field: "score",
                        headerName: "考核得分",
                        editable: true,
                        type: 'number',

                    }, {
                        field: "note",
                        headerName: "备注",
                        width: 500,
                        editable: true
                    }],
                };

                //指定网格对象
                $scope.data.currGridModel = 'data.currItem.hr_train_lineofhr_train_headers';
                $scope.data.currGridOptions = $scope.gridOptions;

                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------通用查询-------------------------------------------*/

                //课程信息 查询
                $scope.commonSearchSettingOfHr_Course = {
                    afterOk: function (result) {
                        $scope.data.currItem.course_id = result.course_id;
                        $scope.data.currItem.course_code = result.course_code;
                        $scope.data.currItem.course_name = result.course_name;
                        $scope.data.currItem.teacher = result.teacher;
                        $scope.data.currItem.course_hour = result.course_hour;
                    }
                };

                /**
                 * 查员工
                 */
                $scope.choose_employee_name = function (args) {
                    $modal.openCommonSearch({
                            classId: 'employee_header'
                        })
                        .result//响应数据
                        .then(function (response) {
                            for (var i = 0; i < $scope.data.currItem.hr_train_lineofhr_train_headers.length; i++) {
                                var obj = $scope.data.currItem.hr_train_lineofhr_train_headers[i];
                                if (obj.employee_code == response.employee_code) {
                                    return swalApi.info("员工【" + obj.employee_code + "】已添加，不能重复添加");
                                }
                            }
                            args.data.employee_id = response.employee_id;
                            args.data.employee_code = response.employee_code;
                            args.data.employee_name = response.employee_name;
                            args.api.refreshView();
                        });
                };
                //校验输入的费用
                $scope.feeIsNumber = function () {
                    var fee = $scope.data.currItem.course_fee;
                    if (numberApi.toNumber(fee, -1) == -1) {
                        swalApi.info('请输入数字');
                        $scope.data.currItem.course_fee = '';
                    }
                }
                //校验输入的培训课时
                $scope.hourIsNumber = function () {
                    var hour = $scope.data.currItem.course_hour;
                    if (hour <= 0) {
                        swalApi.info('请输入大于0的数字');
                        $scope.data.currItem.course_hour = '';
                    }
                }
                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.cyear = new Date().getFullYear();
                    bizData.cmonth = new Date().getMonth() + 1;
                    if (numberApi.toNumber(bizData.cmonth) >= 10) {
                        bizData.year_month = bizData.cyear + '-' + bizData.cmonth;
                    } else {
                        bizData.year_month = bizData.cyear + '-0' + bizData.cmonth;
                    }
                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    $scope.data.currItem.train_date = dateApi.today();
                    bizData.hr_train_lineofhr_train_headers = [{}];
                    $scope.gridOptions.hcApi.setRowData(bizData.hr_train_lineofhr_train_headers);
                };

                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.hr_train_lineofhr_train_headers);
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /*底部左边按钮*/
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();

                };
                //隐藏其他按钮，只保留增减按钮
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;

                /*隐藏底部右边边按钮*/
                $scope.footerRightButtons.saveThenSubmit.hide = true;
                $scope.footerRightButtons.saveThenAdd.hide = true;

                /*----------------------------------按钮方法 定义-------------------------------------------*/
                /**
                 * 删除行明细
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.hr_train_lineofhr_train_headers.splice(idx, 1);
                        if ($scope.data.currItem.hr_train_lineofhr_train_headers.length == 0) {
                            $scope.data.currItem.hr_train_lineofhr_train_headers.push({});
                        }
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.hr_train_lineofhr_train_headers);
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