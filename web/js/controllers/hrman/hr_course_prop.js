/**
 * 培训课程维护属性表
 * Created by sgc
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, swalApi, numberApi) {
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
                        field: "positionid",
                        headerName: "岗位",
                        width: 100,
                        editable: true,
                        onCellDoubleClicked: function (args) {
                            $scope.choose_scpposition_name(args);
                        },
                        hcRequired: true
                    }, {
                        field: "note",
                        headerName: "备注",
                        editable: true,
                        width: 800
                    }

                    ],
                };

                //指定网格对象
                $scope.data.currGridModel = 'data.currItem.hr_course_lineofhr_courses';
                $scope.data.currGridOptions = $scope.gridOptions;

                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 新增时数据、网格默认设置
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
                    bizData.hr_course_lineofhr_courses = [{}];
                    $scope.gridOptions.hcApi.setRowData(bizData.hr_course_lineofhr_courses);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.hr_course_lineofhr_courses);
                };
                /*----------------------------------通用查询-------------------------------------------*/

                //课程信息 查询
                $scope.commonSearchSettingOfHr_Course = {
                    afterOk: function (result) {
                        $scope.data.currItem.course_id = result.course_id;
                        $scope.data.currItem.course_code = result.course_code;
                        $scope.data.currItem.course_name = result.course_name;

                    }
                };

                /**
                 * 查岗位
                 */
                $scope.choose_scpposition_name = function (args) {
                    $modal.openCommonSearch({
                            classId: 'scpposition',
                            dataRelationName: 'positions',
                        })
                        .result//响应数据
                        .then(function (response) {
                            for (var i = 0; i < $scope.data.currItem.hr_course_lineofhr_courses.length; i++) {
                                var obj = $scope.data.currItem.hr_course_lineofhr_courses[i];
                                if (obj.positionid == response.positionid) {
                                    return swalApi.info("员工【" + obj.positionid + "】已添加，不能重复添加");
                                }
                            }
                            args.data.positionid = response.positionid;
                            args.data.superposition = response.superposition;
                            args.data.positiondesc = response.positiondesc;
                            args.api.refreshView();
                        });
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /*底部左边按钮*/
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();
                }
                //隐藏其他按钮，只保留增减行
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;

                /*隐藏底部右边边按钮*/
                $scope.footerRightButtons.saveThenSubmit.hide = true;
                $scope.footerRightButtons.saveThenAdd.hide = true;


                $scope.numberCheck = function () {
                    var hour = $scope.data.currItem.course_hour;
                    if (numberApi.toNumber(hour, 0) == 0) {
                        swalApi.info('请输入大于0的数字');
                        $scope.data.currItem.course_hour = '';
                    }
                };

                /*----------------------------------按钮方法 定义-------------------------------------------*/
                /**
                 * 删除明细
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.hr_course_lineofhr_courses.splice(idx, 1);
                        if ($scope.data.currItem.hr_course_lineofhr_courses.length == 0) {
                            $scope.data.currItem.hr_course_lineofhr_courses.push({});
                        }
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.hr_course_lineofhr_courses);
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