/**
 * 调查问卷设置
 *  2019/5/15.
 *  zengjinhua
 *  update by limeng
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', '$modal', 'swalApi', 'dateApi', 'openBizObj', 'requestApi'],
    function (module, controllerApi, base_obj_prop, $modal, swalApi, dateApi, openBizObj, requestApi) {
        'use strict';
        var KpiQuestionnaireHeaderProp = [
            '$scope', '$stateParams',
            function ($scope) {
                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------通用查询-------------------------------------------*/
                $scope.commonSearchSettingOfDept = {
                    //部门
                    checkbox: true,
                    afterOk: function (response) {
                        var org_id = '';
                        var org_name = '';
                        for (let i = 0; i < response.length; i++) {
                            if (i < response.length - 1) {
                                org_id += response[i].dept_id.toString() + ',';
                                org_name += response[i].dept_name.toString() + ',';
                            } else {
                                org_id += response[i].dept_id.toString();
                                org_name += response[i].dept_name.toString();
                            }
                        }x
                        if (org_id.length > 0 && org_name.length > 0) {
                            $scope.data.currItem.org_id = org_id;
                            $scope.data.currItem.org_name = org_name;
                        } else {
                            $scope.data.currItem.org_id = undefined;
                            $scope.data.currItem.org_name = undefined;
                        }
                    },
                    sqlWhere: "status=2"
                };
                /*----------------------------------表格定义-------------------------------------------*/
                //表格定义  "增加调研项目类别"
                $scope.gridOptions_itemkind = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'itemkind',
                        headerName: '调研项目类别',
                        editable: true,
                        width: 254,
                        onCellDoubleClicked: function (args) {
                            $scope.show_Kpi_surveyitem(args);
                        }
                    }]
                };
                //表格定义  "增加调研项目"
                $scope.gridOptions_kpi_surveyitem = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'surveyitem_name',
                        headerName: '调研项目名称',
                        width: 209,
                        onCellDoubleClicked: function (args) {
                            $scope.read_surveyitem(args);
                        }
                    }, {
                        field: 'itemtype',
                        hcDictCode: 'itemtype',
                        headerName: '答题类别',
                        width: 200,
                        onCellDoubleClicked: function (args) {
                            $scope.read_surveyitem(args);
                        }
                    }, {
                        field: 'sortno',
                        headerName: '排序号',
                        type: '数字',
                        width: 180,
                        onCellDoubleClicked: function (args) {
                            $scope.read_surveyitem(args);
                        }
                    }]
                };
                /**
                 * 初始化考核期间类别
                 */
                $scope.assess_time = [];
                /**
                 * 改变考核周期类型，自动改变考核期间取值范围
                 */
                $scope.changeKpiPeriod = function () {
                    $scope.data.currItem.seasonmth = undefined;
                    if ($scope.data.currItem.kpi_period == 0 || $scope.data.currItem.kpi_period == undefined || $scope.data.currItem.kpi_period == null) {
                        return;
                    }
                    if ($scope.data.currItem.kpi_period == 2) {//半年度
                        $scope.assess_time.length = 0;
                        $scope.assess_time.push({
                            name: '上半年',
                            value: '1'
                        }, {
                            name: '下半年',
                            value: '2'
                        });
                    }
                    if ($scope.data.currItem.kpi_period == 3) {//季度
                        $scope.assess_time.length = 0;
                        $scope.assess_time.push(
                            {
                                name: '1季度',
                                value: '1'
                            }, {
                                name: '2季度',
                                value: '2'
                            }, {
                                name: '3季度',
                                value: '3'
                            }, {
                                name: '4季度',
                                value: '4'
                            });
                    }
                };
                /**
                 * 设置数据之前先改变考核期间取值范围
                 */
                $scope.setChangeKpiPeriod = function (bizData) {
                    if (bizData.kpi_period == 0 || bizData.kpi_period == undefined || bizData.kpi_period == null) {
                        return;
                    }
                    if (bizData.kpi_period == 2) {//半年度
                        $scope.assess_time.length = 0;
                        $scope.assess_time.push({
                            name: '上半年',
                            value: '1'
                        }, {
                            name: '下半年',
                            value: '2'
                        });
                    }
                    if (bizData.kpi_period == 3) {//季度
                        $scope.assess_time.length = 0;
                        $scope.assess_time.push(
                            {
                                name: '1季度',
                                value: '1'
                            }, {
                                name: '2季度',
                                value: '2'
                            }, {
                                name: '3季度',
                                value: '3'
                            }, {
                                name: '4季度',
                                value: '4'
                            });
                    }
                };
                /**
                 * 校验是否选择考核周期类型
                 */
                $scope.clickKpi = function () {
                    if ($scope.data.currItem.kpi_period == 0 || $scope.data.currItem.kpi_period == undefined || $scope.data.currItem.kpi_period == null) {
                        swalApi.info('请先选择考核周期类型！');
                    }
                };
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    $scope.data.currItem.kpi_questionnaire_lineofkpi_questionnaire_headers = [];
                    $scope.data.currItem.kpi_surveyitemofkpi_questionnaire_lines = [{}];
                    $scope.gridOptions_kpi_surveyitem.hcApi.setRowData($scope.data.currItem.kpi_surveyitemofkpi_questionnaire_lines);
                    $scope.data.currItem.kpi_questionnaire_lineofkpi_questionnaire_headers = [{}];
                    $scope.gridOptions_itemkind.hcApi.setRowData($scope.data.currItem.kpi_questionnaire_lineofkpi_questionnaire_headers);
                    bizData.create_time = dateApi.now();
                    $scope.data.flag = false;
                };
                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions_kpi_surveyitem.hcApi.setRowData(bizData.kpi_surveyitemofkpi_questionnaire_lines);
                    $scope.gridOptions_itemkind.hcApi.setRowData(bizData.kpi_questionnaire_lineofkpi_questionnaire_headers);
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow = {
                    title: '增加调研项目类别',
                    click: function () {
                        $scope.add_itemkind && $scope.add_itemkind();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };
                $scope.footerLeftButtons.deleteRow = {
                    title: '删除调研项目类别',
                    click: function () {
                        $scope.del_itemkind && $scope.del_itemkind();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };
                $scope.footerLeftButtons.get = {
                    title: '增加调研项目',
                    click: function () {
                        $scope.add_surveyitem && $scope.add_surveyitem();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };
                $scope.footerLeftButtons.shen = {
                    title: '生成答卷',
                    click: function () {
                        /*    if ($scope.data.currItem.stat != 5) {
                                swalApi.info('调研问卷未审核');
                                return;
                            }*/
                        if ($scope.data.flag) {
                            return
                        }
                        $scope.data.flag = true;
                        /*   $scope.add_del_poliy && $scope.add_del_poliy();*/
                        if ($scope.data.currItem.answerflag == 2) {
                            swalApi.info('答卷已下发不能重复提交');
                            return;
                        }
                        $scope.get_Kpi_surveyitem();
                    },
                    /* hide: function () {
                         return $scope.data.currItem.stat > 1&&$scope.data.currItem.stat<5;
                     }*/
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                //添加调研项目类别
                $scope.add_itemkind = function () {
                    var data = $scope.data.currItem.kpi_questionnaire_lineofkpi_questionnaire_headers;
                    var newLine = {};
                    data.push(newLine);
                    $scope.gridOptions_itemkind.hcApi.setRowData(data);
                };
                /**
                 * 删除调研项目类别
                 */
                $scope.del_itemkind = function () {
                    var idx = $scope.gridOptions_itemkind.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    }
                    else {
                        $scope.data.currItem.kpi_questionnaire_lineofkpi_questionnaire_headers.splice(idx, 1);
                        if ($scope.data.currItem.kpi_questionnaire_lineofkpi_questionnaire_headers.length == 0) {
                            $scope.data.currItem.kpi_questionnaire_lineofkpi_questionnaire_headers.push({});
                            $scope.gridOptions_itemkind.hcApi.setRowData($scope.data.currItem.kpi_questionnaire_lineofkpi_questionnaire_headers);
                        }
                        if ($scope.data.currItem.kpi_questionnaire_lineofkpi_questionnaire_headers.length > 0) {
                            $scope.gridOptions_itemkind.hcApi.setRowData($scope.data.currItem.kpi_questionnaire_lineofkpi_questionnaire_headers);
                        }
                    }
                };
                /**
                 *  跳转到 调研项目设置属性页面
                 */
                $scope.add_surveyitem = function (data) {
                    var index = $scope.gridOptions_itemkind.hcApi.getFocusedRowIndex();
                    if (!$scope.data.currItem.subject) {
                        swalApi.info('调研主题不能为空');
                        return;
                    }
                    if (!$scope.data.currItem.kpi_questionnaire_lineofkpi_questionnaire_headers[index].itemkind) {
                        swalApi.info('调研项目类别不能为空');
                        return;
                    }
                    var param = $scope.data.currItem.kpi_questionnaire_lineofkpi_questionnaire_headers[index].itemkind + ',' + $scope.data.currItem.subject;
                    param += ',' + $scope.data.currItem.org_id + ',' + $scope.data.currItem.org_name;
                    param += ',' + $scope.data.currItem.questionnaire_id;
                    openBizObj({
                        stateName: 'hrman.kpi_surveyitem_prop',
                        params: {
                            id: param,
                            openedByListPage: 'kpi_questionnaire'
                        }
                    });
                };
                /**
                 *  跳转到 调研项目设置属性页面
                 */
                $scope.read_surveyitem = function (args) {
                    openBizObj({
                        stateName: 'hrman.kpi_surveyitem_prop',
                        params: {
                            id: args.data.surveyitem_id
                        }
                    });
                };
                /**
                 *   通用查询 根据项目类别名查 调研项目
                 */
                $scope.show_Kpi_surveyitem = function (args) {
                    requestApi.post({
                        classId: 'kpi_questionnaire_line',
                        action: 'search',
                        data: {
                            searchflag: 1,
                            itemkind: args.data.itemkind
                        }
                    }).then(function (response) {
                        $scope.data.currItem.kpi_surveyitemofkpi_questionnaire_lines = [{}];
                        $scope.gridOptions_kpi_surveyitem.hcApi.setRowData($scope.data.currItem.kpi_surveyitemofkpi_questionnaire_lines);
                        for (let i = 0; i < response.kpi_surveyitemofkpi_questionnaire_lines.length; i++) {
                            $scope.data.currItem.kpi_surveyitemofkpi_questionnaire_lines[i] = response.kpi_surveyitemofkpi_questionnaire_lines[i];
                        }
                        $scope.gridOptions_kpi_surveyitem.hcApi.setRowData($scope.data.currItem.kpi_surveyitemofkpi_questionnaire_lines);
                        args.api.refreshView();
                    });
                };
                $scope.get_Kpi_surveyitem = function (args) {
                    requestApi.post({
                        classId: 'kpi_questionnaire_header',
                        action: 'createreply2',
                        data: {
                            questionnaire_id: $scope.data.currItem.questionnaire_id
                        }
                    }).then(function (response) {
                        if (response.answerflag == 2) {
                            swalApi.info('已生产答卷');
                            $scope.data.currItem.answerflag = 2;
                            $scope.data.flag = false;
                        } else {
                            swalApi.info('请重新生成');
                            $scope.data.flag = false;
                        }
                    });
                };
            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: KpiQuestionnaireHeaderProp
        });

    });