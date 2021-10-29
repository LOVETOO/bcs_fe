/**
 * 部门重点工作属性表
 * Created by shenguocheng
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, numberApi) {
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
                        field: "pivotjob",
                        headerName: "重点工作项目",
                        editable: function () {
                            return $scope.data.currItem.stat == 1
                        },
                        hcRequired: true
                    }, {
                        field: "pivotjob_aim",
                        headerName: "重点工作完成目标",
                        hcRequired: true,
                        editable: function () {
                            return $scope.data.currItem.stat == 1
                        }
                    }, {
                        field: "itemtype_name",
                        headerName: "指标类别",
                    }, {
                        field: "kpiitem_no",
                        headerName: "考核指标编码",
                        hcRequired: true,
                        editable: function () {
                            return $scope.data.currItem.stat == 1
                        },
                        onCellDoubleClicked: function (args) {
                            $scope.choose_kpiItem_code(args);
                        }
                    }, {
                        field: "kpiitem_name",
                        headerName: "考核指标名称",
                    }, {
                        field: "planenddate",
                        headerName: "计划完成时间",
                        hcRequired: true,
                        type: '日期',
                        editable: function () {
                            return $scope.data.currItem.stat == 1
                        }
                    }, {
                        field: "pivotjob_fulfill",
                        headerName: "实际完成进度",
                        type: '百分比',
                        editable: function () {
                            return $scope.data.currItem.stat == 1
                        }
                    }, {
                        field: "principal",
                        headerName: "责任人",
                        hcRequired: true,
                        editable: function () {
                            return $scope.data.currItem.stat == 1
                        }
                    }
                    ],
                };

                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //指定网格对象
                $scope.data.currGridModel = 'data.currItem.kpi_deptpivotjob_lineofkpi_deptpivotjob_headers';
                $scope.data.currGridOptions = $scope.gridOptions;
                /*----------------------------------通用查询-------------------------------------------*/

                //课程信息 查询
                $scope.commonSearchSettingOfDept = {
                    afterOk: function (result) {
                        $scope.data.currItem.org_id = result.dept_id;
                        $scope.data.currItem.org_code = result.dept_code;
                        $scope.data.currItem.org_name = result.dept_name;
                    }
                };

                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.org_name = userbean.loginuserifnos[0].org_name;
                    bizData.cyear = new Date().getFullYear();
                    bizData.cmonth = new Date().getMonth() + 1;
                    if (numberApi.toNumber(bizData.cmonth) >= 10) {
                        bizData.year_month = bizData.cyear + '-' + bizData.cmonth;
                    } else {
                        bizData.year_month = bizData.cyear + '-0' + bizData.cmonth;
                    }
                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    bizData.planenddate = new Date().Format('yyyy-MM-dd');
                    bizData.kpi_deptpivotjob_lineofkpi_deptpivotjob_headers = [{}];
                    $scope.gridOptions.hcApi.setRowData(bizData.kpi_deptpivotjob_lineofkpi_deptpivotjob_headers);
                };

                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    bizData.cyear = new Date().getFullYear();
                    bizData.cmonth = new Date().getMonth() + 1;
                    if (numberApi.toNumber(bizData.cmonth) >= 10) {
                        bizData.year_month = bizData.cyear + '-' + bizData.cmonth;
                    } else {
                        bizData.year_month = bizData.cyear + '-0' + bizData.cmonth;
                    }
                    $scope.gridOptions.hcApi.setRowData(bizData.kpi_deptpivotjob_lineofkpi_deptpivotjob_headers);
                };

                //查询考核指标编码
                $scope.choose_kpiItem_code = function (args) {
                    $modal.openCommonSearch({
                            classId: 'kpi_kpiitems',
                            action: 'kpiitemsearch'
                        })
                        .result//响应数据
                        .then(function (response) {
                            for (var i = 0; i < $scope.data.currItem.kpi_deptpivotjob_lineofkpi_deptpivotjob_headers.length; i++) {
                                var obj = $scope.data.currItem.kpi_deptpivotjob_lineofkpi_deptpivotjob_headers[i];
                                if (obj.kpiitem_no == response.kpiitem_no) {
                                    return swalApi.info("员工【" + obj.kpiitem_no + "】已添加，不能重复添加");
                                }
                            }
                            args.data.kpiitem_id = response.kpiitem_id;
                            args.data.kpiitem_no = response.kpiitem_no;
                            args.data.kpiitem_name = response.kpiitem_name;
                            args.data.itemtype_name = response.itemtype_name;
                            args.api.refreshView();
                        });
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                //确认按钮
                $scope.footerRightButtons.check = {
                    title: '确认',
                    click: function () {
                        $scope.check && $scope.check();
                    }
                };
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
                //$scope.footerRightButtons.save.hide = true;
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                /**
                 * 删除行明细
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else if ($scope.data.currItem.kpi_deptpivotjob_lineofkpi_deptpivotjob_headers.length == 1) {
                        swalApi.info('这是最后一行了');
                        $scope.data.currItem.kpi_deptpivotjob_lineofkpi_deptpivotjob_headers[0].pivotjob = '';
                        $scope.data.currItem.kpi_deptpivotjob_lineofkpi_deptpivotjob_headers[0].pivotjob_aim = '';
                        $scope.data.currItem.kpi_deptpivotjob_lineofkpi_deptpivotjob_headers[0].kpiitem_type = '';
                        $scope.data.currItem.kpi_deptpivotjob_lineofkpi_deptpivotjob_headers[0].kpiitem_code = '';
                        $scope.data.currItem.kpi_deptpivotjob_lineofkpi_deptpivotjob_headers[0].kpiitem_name = '';
                        $scope.data.currItem.kpi_deptpivotjob_lineofkpi_deptpivotjob_headers[0].planenddate = '';
                        $scope.data.currItem.kpi_deptpivotjob_lineofkpi_deptpivotjob_headers[0].pivotjob_fulfill = '';
                        $scope.data.currItem.kpi_deptpivotjob_lineofkpi_deptpivotjob_headers[0].principal = '';
                    } else {
                        $scope.data.currItem.kpi_deptpivotjob_lineofkpi_deptpivotjob_headers.splice(idx, 1);
                    }
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_deptpivotjob_lineofkpi_deptpivotjob_headers);
                };

                //验证表头信息是否填完
                $scope.validHead = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    return invalidBox;
                };
                /**
                 * 确认
                 */
                $scope.check = function () {
                    var msg = $scope.validHead([]);
                    if (msg.length > 0) {
                        return swalApi.info(msg);
                    }
                    //调用后台确认方法
                    requestApi.post(
                        {
                            classId: "kpi_deptpivotjob_header",
                            action: 'check',
                            data: $scope.data.currItem
                        }).then(function (data) {
                        return swalApi.success('确认成功!');
                    }).then($scope.refresh);
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