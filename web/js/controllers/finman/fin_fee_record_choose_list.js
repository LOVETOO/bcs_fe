/**
 * 费用记录查询
 * 2018-11-26
 */
define(
    ['module', 'controllerApi', 'base_diy_page','requestApi', 'openBizObj', 'swalApi', 'loopApi'],
    function (module, controllerApi, base_diy_page, requestApi, openBizObj, swalApi, loopApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope','$stateParams',
            //控制器函数
            function ($scope, $stateParams) {
                $scope.gridOptions = {
                    onRowDoubleClicked: openRecordProp,
                    columnDefs : [
                        {
                            type: '序号',
                            checkboxSelection: function (params){
                                if(!$scope.fin_fee_bx_lines || $scope.fin_fee_bx_lines.length == 0)
                                    return true;
                                for(var i = 0; i < $scope.fin_fee_bx_lines.length; i++) {
                                    if(params.data.fee_record_id == $scope.fin_fee_bx_lines[i].fee_record_id){
                                        return false;
                                    }
                                }
                                return true;
                            }
                        }
                        , {
                            field: 'fee_record_no',
                            headerName: '费用记录单号'
                        }
                        , {
                            field: 'bud_type_name',
                            headerName: '预算类别名称'
                        }
                        , {
                            field: 'fee_name',
                            headerName: '费用项目名称'
                        }
                        , {
                            field: 'xf_date',
                            headerName: '消费时间',
                            type: '日期'
                        }
                        , {
                            field: 'note',
                            headerName: '消费说明'
                        }
                        , {
                            field: 'xf_amt',
                            headerName: '金额'
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
                 * 查看费用记录详情
                 */
                function openRecordProp () {
                    var bizData = $scope.gridOptions.hcApi.getFocusedData();

                    return openBizObj({
                        stateName: 'finman.fin_fee_record_prop',
                        params: {
                            id: bizData.fee_record_id
                        }
                    }).result
                }
                $scope.openRecordProp = openRecordProp;


                /**
                 * 查询未被引用的费用记录单
                 */
                $scope.searchRecord = function () {
                    var postData = {
                        search_flag: 1,
                        bud_type_id : $stateParams.bud_type_id
                    };
                    if($scope.data.currItem.search_word){
                        postData.search_word = $scope.data.currItem.search_word;
                    }
                    return requestApi.post('fin_fee_record','search',postData)
                };

                
                /**
                 * 选择单据-带出信息到费用报销单
                 */
                $scope.selectBill = function () {
                    //勾选的节点
                    var selectedNodes = $scope.gridOptions.api.getSelectedNodes();
                    if(selectedNodes.length == 0){
                        return swalApi.info("请选择费用记录" );
                    }
                    //选中行数据
                    var records = [];
                    loopApi.forLoop(selectedNodes.length, function (i) {
                        records.push(selectedNodes[i].data);
                    });
                    top.modal_record.close(records);
                };

                /**
                 * 条件搜索
                 */
                $scope.searchBySqlWhere = function (e) {
                    $scope.searchRecord()
                    .then(function (response) {
                        $scope.gridOptions.hcApi.setRowData(response.fin_fee_records);
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
                    .then($scope.searchRecord)
                    .then(function (response) {
                        if($stateParams.lines){
                            var lines = JSON.parse($stateParams.lines);
                            if(lines.length > 0){
                                $scope.fin_fee_bx_lines = lines;
                            }
                        }

                        $scope.gridOptions.hcApi.setRowData(response.fin_fee_records);

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
