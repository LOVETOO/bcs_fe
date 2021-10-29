/**
 * 调研项目设置
 * 2019/5/15.
 * zengjinhua
 *  update by limeng
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', '$q', 'numberApi', 'dateApi', 'fileApi', '$modal'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, $q, numberApi, dateApi, fileApi, $modal) {
        var KpiQuestionnaireHeaderProp = [
            '$scope', '$stateParams',

            function ($scope, $stateParams) {
                $scope.data = {};
                $scope.data.currItem = {};
                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                $scope.commonSearchSettingOfSubject = {
                    //调研项目主题
                    afterOk: function (response) {
                        $scope.data.currItem.subject = response.subject;
                    },
                };

                /*----------------------------------表格定义-------------------------------------------*/
                //表格定义  "答案明细"
                $scope.gridOptions_surveyitem_norm = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'answercode',
                        headerName: '答案代码',
                        editable: true,
                        width: 150
                    }, {
                        field: 'answername',
                        headerName: '答案名称',
                        editable: true,
                        width: 150
                    }, {
                        field: 'answertype',
                        hcDictCode: 'answertype',
                        headerName: '答案属性',
                        editable: true,
                        width: 150
                    }]
                };
                //表格定义  "答题人设置"
                $scope.gridOptions_surveyitem_appraiser = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'org_name',
                        headerName: '答题人部门',
                        hcRequired: true,
                        onCellDoubleClicked: function (args) {
                            $scope.choose_org_name(args);
                        },
                        width: 150
                    }, {
                        field: 'userid',
                        headerName: '答题人姓名',
                        hcRequired: true,
                        onCellDoubleClicked: function (args) {
                            $scope.choose_user(args);
                        },
                        width: 150
                    }, {
                        field: 'empid',
                        headerName: '答题人工号',
                        hcRequired: true,
                        editable: false,
                        width: 150
                    }, {
                        field: 'assesstype',
                        headerName: '答题人类别',
                        hcRequired: true,
                        editable: true,
                        hcDictCode: 'assesstype',
                        width: 150
                    }]
                };


                /*----------------------------------按钮方法数据 定义-------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.kpi_surveyitem_normofkpi_surveyitems = [];
                    $scope.gridOptions_surveyitem_norm.hcApi.setRowData(bizData.kpi_surveyitem_normofkpi_surveyitems);
                    bizData.kpi_surveyitem_appraiserofkpi_surveyitems = [];
                    $scope.gridOptions_surveyitem_appraiser.hcApi.setRowData(bizData.kpi_surveyitem_appraiserofkpi_surveyitems);
                    $scope.data.currItem.create_time = dateApi.now();
                    $scope.add_surveyitem_norm();
                    $scope.add_surveyitem_appraiser();
                    if ($stateParams.openedByListPage.replace(/\s+/g, "") == 'kpi_questionnaire') {
                        var param = $stateParams.id.split(",");
                        $scope.data.currItem.itemkind = param[0];
                        $scope.data.currItem.subject = param[1];
                        $scope.data.currItem.kpi_surveyitem_appraiserofkpi_surveyitems[0].orgid = param[2];
                        $scope.data.currItem.kpi_surveyitem_appraiserofkpi_surveyitems[0].org_name = param[3];
                        $scope.data.currItem.questionnaire_id = param[4];
                        $scope.gridOptions_surveyitem_appraiser.hcApi.setRowData(bizData.kpi_surveyitem_appraiserofkpi_surveyitems);
                    }
                };
                /**
                 * 保存数据之后
                 */

                $scope.doafterSave = function (responseData) {
                    console.log("执行条件");
                    window.close();
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions_surveyitem_norm.hcApi.setRowData(bizData.kpi_surveyitem_normofkpi_surveyitems);
                    $scope.gridOptions_surveyitem_appraiser.hcApi.setRowData(bizData.kpi_surveyitem_appraiserofkpi_surveyitems);
                };
                /**
                 * 保存之前
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    bizData.kpi_surveyitem_appraiserofkpi_surveyitems = $scope.resetArrayData(bizData.kpi_surveyitem_appraiserofkpi_surveyitems);
                    bizData.kpi_surveyitem_normofkpi_surveyitems = $scope.resetArrayData(bizData.kpi_surveyitem_normofkpi_surveyitems);
                };
                /**
                 * 保存之前 方法 对数组进行处理
                 * arrayData 数组对象
                 * arrayItem 数组项中的一个属性
                 */
                $scope.resetArrayData = function (arrayData) {
                    var i = 0;
                    var tampdata = [];
                    for (i = arrayData.length - 1; i > -1; i--) {
                        if (JSON.stringify(arrayData[i]) != '{}') {
                            tampdata.push(arrayData[i]);
                        }
                    }
                    return tampdata;
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow = {
                    title: '增加明细',
                    click: function () {
                        if ($scope.kpi_tab.score.active) {
                            $scope.add_surveyitem_norm && $scope.add_surveyitem_norm();
                        }
                        if ($scope.kpi_tab.completion.active) {
                            $scope.add_surveyitem_appraiser && $scope.add_surveyitem_appraiser();
                        }
                    }
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return $scope.data.currItem.stat > 1;
                };
                $scope.footerLeftButtons.deleteRow = {
                    title: "删除明细",
                    click: function () {
                        if ($scope.kpi_tab.score.active) {
                            $scope.del_surveyitem_norm && $scope.del_surveyitem_norm();
                        }
                        if ($scope.kpi_tab.completion.active) {
                            $scope.del_surveyitem_appraiser && $scope.del_surveyitem_appraiser();
                        }
                    }
                };
                /*  $scope.footerLeftButtons.addRows={
                      title:"增加多行",
                      click:function () {
                          if ($scope.kpi_tab.score.active) {
                              $scope.add_surveyitem_norm_rows && $scope.add_surveyitem_norm_rows();
                          }
                          if ($scope.kpi_tab.completion.active) {
                              $scope.add_surveyitem_appraiser_rows && $scope.add_surveyitem_appraiser_rows();
                          }
                      }
                  };*/
                $scope.changeItems = function () {
                    if ($scope.data.currItem.itemtype == '' || $scope.data.currItem.itemtype == null) {
                        $scope.footerLeftButtons.getItems.title = "生成答案明细";
                    } else {
                        switch (parseInt($scope.data.currItem.itemtype)) {
                            case 1:
                                $scope.footerLeftButtons.getItems.title = "生成评分题明细";
                                break;
                            default:
                                $scope.footerLeftButtons.getItems.title = "生成答案明细";
                        }
                    }
                };
                $scope.footerLeftButtons.getItems = {
                    title: "生成答案明细",
                    click: function () {
                        if ($scope.data.currItem.itemtype == 1) {
                            $scope.add_surveyitem_norm_rows();
                        }
                    }
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return $scope.data.currItem.stat > 1;
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                //添加答案明细
                $scope.add_surveyitem_norm = function () {
                    var data = $scope.data.currItem.kpi_surveyitem_normofkpi_surveyitems;
                    var newLine = {};
                    data.push(newLine);
                    $scope.gridOptions_surveyitem_norm.hcApi.setRowData(data);
                };
                //添加答题人明细
                $scope.add_surveyitem_appraiser = function () {
                    var data = $scope.data.currItem.kpi_surveyitem_appraiserofkpi_surveyitems;
                    var newLine = {};
                    data.push(newLine);
                    $scope.gridOptions_surveyitem_appraiser.hcApi.setRowData(data);
                };
                //删除答案明细
                $scope.del_surveyitem_norm = function () {
                    var idx = $scope.gridOptions_surveyitem_norm.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                    } else {
                        $scope.data.currItem.kpi_surveyitem_normofkpi_surveyitems.splice(idx, 1);
                        $scope.gridOptions_surveyitem_norm.hcApi.setRowData($scope.data.currItem.kpi_surveyitem_normofkpi_surveyitems);
                    }
                    if ($scope.data.currItem.kpi_surveyitem_normofkpi_surveyitems.length <= 0) {
                        $scope.add_surveyitem_norm();
                    }
                };
                //删除答题人明细
                $scope.del_surveyitem_appraiser = function () {
                    var idx = $scope.gridOptions_surveyitem_appraiser.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                    } else {
                        $scope.data.currItem.kpi_surveyitem_appraiserofkpi_surveyitems.splice(idx, 1);
                        $scope.gridOptions_surveyitem_appraiser.hcApi.setRowData($scope.data.currItem.kpi_surveyitem_appraiserofkpi_surveyitems);
                    }
                    if ($scope.data.currItem.kpi_surveyitem_appraiserofkpi_surveyitems.length <= 0) {
                        $scope.add_surveyitem_appraiser();
                    }
                };

                //生成问答题明细
                $scope.add_surveyitem_norm_rows = function () {
                    $scope.data.currItem.kpi_surveyitem_normofkpi_surveyitems = [];
                    $scope.addrows($scope.gridOptions_surveyitem_norm, $scope.data.currItem.kpi_surveyitem_normofkpi_surveyitems)
                };
                /* //增加答题人多行
                 $scope.add_surveyitem_appraiser_rows=function(){
                     $scope.addrows($scope.gridOptions_surveyitem_appraiser,$scope.data.currItem.kpi_surveyitem_appraiserofkpi_surveyitems,'userid')
                 };*/
                //生成问答题明细方法
                $scope.addrows = function (choosed_gridOption, choosed_args) {
                    choosed_gridOption.api.stopEditing();
                    swal({
                        title: '请输入要增加的答案数',
                        type: 'input', //类型为输入框
                        inputValue: 2, //输入框默认值
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
                        else if (rowCount > 10) {
                            swal.showInputError('请勿输入过大的行数(10以内为宜)');
                            return;
                        }
                        swal.close();
                        var data = choosed_args;
                        for (var i = 0; i < rowCount; i++) {
                            var newLine = {};
                            newLine.answercode = String.fromCharCode(64 + parseInt(i + 1));
                            newLine.answername = i == rowCount - 1 ? 10 : parseInt(10 / rowCount) * (i + 1);
                            newLine.answertype = 1;
                            data.push(newLine);
                        }
                        choosed_gridOption.hcApi.setRowData(data);
                    });
                };
                //表格切换定义
                $scope.kpi_tab = {};
                $scope.kpi_tab.score = {
                    title: '答案明细',
                    active: true
                };
                $scope.kpi_tab.completion = {
                    title: '答题人设置'
                };
                /*----------------------------------通用查询-------------------------------------------*/
                //答题人部门
                $scope.choose_org_name = function (args) {
                    $modal.openCommonSearch({
                        classId: 'kpi_surveyitem',
                        postData: {
                            searchflag: 1
                        },
                        action: 'search',
                        dataRelationName: 'scporgofkpi_surveyitems',
                        title: "答题人部门",
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "部门ID",
                                    field: "orgid"
                                }, {
                                    headerName: "部门名称",
                                    field: "orgname"
                                }
                            ]
                        }
                    }).result//响应数据
                        .then(function (result) {
                            args.data.org_name = result.orgname;
                            args.data.orgid = result.orgid;
                            args.api.refreshView();
                        });
                };
                //答题人姓名公告
                $scope.choose_user = function (args) {
                    $modal.openCommonSearch({
                        classId: 'kpi_surveyitem',
                        postData: {
                            searchflag: 2,
                            orgid: args.data.orgid
                        },
                        action: 'search',
                        dataRelationName: 'scpuserofkpi_surveyitems',
                        title: "答题人信息",
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "答题人姓名",
                                    field: "userid"
                                }, {
                                    headerName: "答题人工号",
                                    field: "empid"
                                }
                            ]
                        }
                    }).result//响应数据
                        .then(function (result) {
                            args.data.userid = result.userid;
                            args.data.empid = result.empid;
                            args.api.refreshView();
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