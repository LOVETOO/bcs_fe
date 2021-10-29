/**
 * 费用记录中关联发票列表页
 * @since 2018-11-14
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'loopApi', 'swalApi'],
    function (module, controllerApi, base_diy_page, requestApi, loopApi, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope,$stateParams) {
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号',
                            checkboxSelection: function (params){
                                if(!$scope.fin_fee_record_lines || $scope.fin_fee_record_lines.length == 0)
                                    return true;
                                for(var i = 0; i < $scope.fin_fee_record_lines.length; i++) {
                                    if(params.data.invoice_id == $scope.fin_fee_record_lines[i].invoice_id){
                                        return false;
                                    }
                                }
                                return true;
                            }
                        }
                        , {
                            field: 'is_related',
                            headerName: '已关联',
                            type: '是否'
                        }
                        , {
                            field: 'create_time',
                            headerName: '创建时间'
                        }
                        , {
                            field: 'invoice_date',
                            headerName: '开票时间',
                            type: '日期'
                        }
                        , {
                            field: 'invoice_amt',
                            headerName: '价税合计',
                            type: '金额'
                        }
                        , {
                            field: 'seller',
                            headerName: '销售方'
                        }
                        , {
                            field: 'invoice_type',
                            headerName: '发票类型',
                            hcDictCode: '*'
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
                 * 条件搜索
                 */
                $scope.searchBySqlWhere = function (e) {
                    $scope.searchInvoice()
                    .then(function (response) {
                        $scope.gridOptions.hcApi.setRowData(response.fin_fee_invoices);
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
                 * 增加选中的发票记录
                 */
                $scope.add_invoice = function () {
                    //勾选的节点
                    var selectedNodes = $scope.gridOptions.api.getSelectedNodes();
                    if(selectedNodes.length == 0){
                        return swalApi.info("请选择发票记录" );
                    }
                    //选中行数据
                    var invoices = [];
                    loopApi.forLoop(selectedNodes.length, function (i) {
                        invoices.push(selectedNodes[i].data);
                    });

                    if(top.modal_invoice_record){
                        top.modal_invoice_record.close(invoices);
                    }else{
                        top.modal_invoice_bx.close(invoices);
                    }

                };

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                    .then($scope.searchInvoice)
                    .then(function (response) {
                        //设置头部复选框
                        var col_seq = $scope.gridOptions.columnDefs[0];
                        col_seq.headerCheckboxSelection = false;

                        //当前费用记录关联的发票
                        if($stateParams.lines){
                            var lines = JSON.parse($stateParams.lines);
                            if(lines.length > 0){
                                $scope.fin_fee_record_lines = lines;
                            }
                        }
                        $scope.gridOptions.hcApi.setRowData(response.fin_fee_invoices);
                    })
                    
                };

                /**
                 * 查询发票列表
                 */
                $scope.searchInvoice = function () {
                    var postData = {
                        sqlwhere: " is_related = 1 "
                    };
                    if($scope.data.currItem.search_word)
                        postData.search_word = $scope.data.currItem.search_word;
                    return requestApi.post('fin_fee_invoice','search',postData)
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
