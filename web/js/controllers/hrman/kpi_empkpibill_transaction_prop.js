/**
 * 参评人异动处理
 *  2019/5/16.
 *  zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi','numberApi','dateApi', 'directive/hcTab', 'directive/hcTabPage'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi,numberApi,dateApi) {
        'use strict';

        var KpiEmpkpibillTransactionProp = [
            //声明依赖注入
            '$scope',
            //控制器函数


            function ($scope) {
                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {};
                $scope.data.currItem = {
                };

                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: "kpiitem_type",
                        headerName: "指标类别",
                        hcRequired:true
                    },{
                        field: "kpiitem_type_scale",
                        headerName: "指标类别权重",
                        hcRequired:true
                    },{
                        field: "kpiitem_no",
                        headerName: "考核指标编码"
                    },{
                        field: "kpiitem_name",
                        headerName: "考核指标名称"
                    },{
                        field: "kpiitem_scale",
                        headerName: "考核指标权重"
                    },{
                        field: "notes",
                        headerName: "备注"
                    }]
                };

                $scope.gridOptions_completionrate = {
                    columnDefs: [
                        {
                            field: "appraiseman_type",
                            headerName: "参评人类别"
                        },{
                            field: "appraiseman_userid",
                            headerName: "参评人姓名",
                            hcRequired:true,
                            editable:$scope.transaction == 1 ? true:false
                        },{
                            field: "scale_value",
                            headerName: "权重"
                        },{
                            field: "appraiseman_empid",
                            headerName: "参评人工号"
                        }
                    ]
                };

                $scope.gridOptions_scoringstandard = {
                    columnDefs: [
                        {
                            field: "kpiitem_type",
                            headerName: "评分项目"
                        },{
                            field: "score",
                            headerName: "分值"
                        }
                    ]
                };
                /*----------------------------------指定网格对象-------------------------------------------*/
                $scope.data.currGridModel = 'data.currItem.kpi_empkpibill_lineofkpi_empkpibill_headers';
                $scope.data.currGridOptions = $scope.gridOptions;

                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------通用查询-------------------------------------------*/
                //员工信息 查询
                $scope.commonSearchSettingOfEmployee = {
                    afterOk: function (result) {
                        $scope.data.currItem.employee_id = result.employee_id;
                        $scope.data.currItem.employee_code = result.employee_code;
                        $scope.data.currItem.employee_name = result.employee_name;
                    }
                };

                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.cyear = new Date().getFullYear();
                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    bizData.kpi_empkpibill_lineofkpi_empkpibill_headers = [];
                    var data = bizData.kpi_empkpibill_lineofkpi_empkpibill_headers;
                    var newLine;
                    data.push(newLine);
                    $scope.gridOptions.hcApi.setRowData(bizData.kpi_empkpibill_lineofkpi_empkpibill_headers);
                };

                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.kpi_empkpibill_lineofkpi_empkpibill_headers);
                    $scope.transaction = 0;
                };
                //验证表头信息是否填完
                $scope.validHead = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    return invalidBox;
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /**
                 * 标签页
                 */
                $scope.kpi_tab={};
                $scope.kpi_tab.score = {
                    title: '评分标准',
                    active:true
                };
                $scope.kpi_tab.completion = {
                    title: '重点工作完成率'
                };

                //隐藏其他按钮，只保留增减按钮
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;
                $scope.footerLeftButtons.addRow.hide = true;
                $scope.footerLeftButtons.deleteRow.hide = true;
                $scope.footerLeftButtons.tran = {
                    title: '参评人异动',
                    click: function () {
                        $scope.transaction = 1;
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };



                /*隐藏底部右边边按钮*/
                $scope.footerRightButtons.saveThenSubmit.hide=true;
                $scope.footerRightButtons.saveThenAdd.hide=true;


            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: KpiEmpkpibillTransactionProp
        });
    }
);