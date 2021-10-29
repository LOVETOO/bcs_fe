/**
 * 未完成报销费用申请单查询
 * 2018-11-23
 */
define(
    ['module', 'controllerApi', 'base_diy_page','requestApi', 'openBizObj', 'swalApi'],
    function (module, controllerApi, base_diy_page, requestApi, openBizObj, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    onRowDoubleClicked: openApplyProp,
                    columnDefs : [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'fee_apply_no',
                            headerName: '费用申请单号'
                        }
                        , {
                            field: 'bud_type_code',
                            headerName: '预算类别编码'
                        }
                        , {
                            field: 'bud_type_name',
                            headerName: '预算类别名称'
                        }
                        , {
                            field: 'purpose',
                            headerName: '费用用途'
                        }
                        , {
                            field: 'total_allow_amt',
                            headerName: '批准金额',
                            type: '金额'
                        }
                        , {
                            field: 'fee_loan_no',
                            headerName: '借款单号'
                        }
                        , {
                            field: 'loan_total_allow_amt',
                            headerName: '借款批准金额',
                            type: '金额'
                        }
                    ]
                };

                $scope.data = {};
                $scope.data.currItem = {};

                controllerApi.run({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /**
                 * 查看费用申请详情
                 */
                function openApplyProp () {
                    var bizData = $scope.gridOptions.hcApi.getFocusedData();

                    return openBizObj({
                        stateName: 'finman.fin_fee_apply_prop',
                        params: {
                            id: bizData.fee_apply_id
                        }
                    }).result
                }
                $scope.openApplyProp = openApplyProp;


                /**
                 * 查询未完成报销的申请单
                 */
                $scope.searchUnfinishedApply = function () {
                    var postData = {
                        flag: 2
                    };
                    if($scope.data.currItem.search_word){
                        postData.search_word = $scope.data.currItem.search_word;
                    }
                    return requestApi.post('fin_fee_apply_header','search',postData)
                };

                
                /**
                 * 选择单据-带出信息到费用报销单
                 */
                $scope.selectBill = function () {
                    var data = $scope.gridOptions.hcApi.getFocusedData();
                    if(!data){
                        return swalApi.info("请选择一条记录" );
                    }

                    top.modalScope.close(data);
                };

                /**
                 * 条件搜索
                 */
                $scope.searchBySqlWhere = function (e) {
                    $scope.searchUnfinishedApply()
                    .then(function (response) {
                        $scope.gridOptions.hcApi.setRowData(response.fin_fee_apply_headers);
                    })
                };

                 /**
                 * 输入框回车事件
                 */
                $scope.enterEvent = function (e) {
                    var keycode = window.event ? e.keyCode : e.which;
                    if(keycode == 13){
                        $scope.searchBySqlWhere();
                    }
                };
                
                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                    .then($scope.searchUnfinishedApply)
                    .then(function (response) {
                        $scope.gridOptions.hcApi.setRowData(response.fin_fee_apply_headers);

                    })
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
