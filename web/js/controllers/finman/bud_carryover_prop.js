/**
 * 预算转结-属性页
 * 2018-10-11
 */
define(
    ['module', 'controllerApi', 'base_obj_prop','swalApi','requestApi'],
    function (module, controllerApi, base_obj_prop,swalApi,requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                /*-------------------数据定义开始------------------------*/
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                            // headerCheckboxSelection: true,
                            // headerCheckboxSelectionFilteredOnly: true,
                            // checkboxSelection: true,
                            // width:100
                        }
                        , {
                            field: 'dname',
                            headerName: '期间名称'
                        }
                        , {
                            field: 'start_date',
                            headerName: '开始日期',
                            type: '日期'
                        }
                        , {
                            field: 'end_date',
                            headerName: '结束日期',
                            type: '日期'
                        }
                        , {
                            field: 'usable',
                            headerName: '已结转',
                            type: '否是'
                        }
                        , {
                            field: 'settle_user',
                            headerName: '结转人'
                        }
                        , {
                            field: 'settle_time',
                            headerName: '结转时间'
                        }
                    ]
                };


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });


                //把数据扔到到明细表
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.api.setRowData(bizData.fin_bud_period_lineoffin_bud_period_headers)
                };

                $scope.footerRightButtons.save.hide = true;
                $scope.footerRightButtons.add.hide = true;

                $scope.footerLeftButtons.Settle = {
                    title: '结转',
                    click: function() {
                        $scope.doSettle && $scope.doSettle();
                    }
                };

                $scope.footerLeftButtons.unSettle = {
                    title: '反结转',
                    click: function() {
                        $scope.doUnsettle && $scope.doUnsettle();
                    }
                };

                /**
                 * 预算结转
                 */
                $scope.doSettle = function () {
                    var settleRow = [];//$scope.gridOptions.api.getSelectedRows();
                    settleRow.push($scope.gridOptions.hcApi.getFocusedData());
                    if(settleRow.length == 0){
                        swalApi.info("请勾选要进行结转的预算期间" );
                        return;
                    };
                    $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers = settleRow;

                    return requestApi.post("fin_bud_period_header", "settle", $scope.data.currItem)
                        .then(function (data) {
                            $scope.gridOptions.hcApi.setRowData(data.fin_bud_period_lineoffin_bud_period_headers);
                            swalApi.success("结转成功！" );
                        }).then(doSelect);
                }

                /**
                 * 预算反结转
                 */
                $scope.doUnsettle = function () {
                    var unSettleRow =[];//$scope.gridOptions.api.getSelectedRows();
                    unSettleRow.push($scope.gridOptions.hcApi.getFocusedData());
                    if(unSettleRow.length == 0){
                        swalApi.info("请勾选要进行反结转的预算期间" );
                        return;
                    };
                    if(unSettleRow.length > 1){
                        swalApi.info("每次只能反结转一个预算期间" );
                        return;
                    };
                    for(var i = 0; i < unSettleRow.length; i++) {
                        if (unSettleRow[i].usable === 2) {
                            swalApi.info("该预算期间已经为非结转状态，无须反结转" );
                            return;
                        }
                    }
                    var unSettleData = {};
                    unSettleData.period_type = $scope.data.currItem.period_type;
                    unSettleData.entid = unSettleRow[0].entid;
                    unSettleData.period_line_id = unSettleRow[0].period_line_id;
                    unSettleData.dname = unSettleRow[0].dname;
                    unSettleData.period_id = $scope.data.currItem.period_id;
                    requestApi.post("fin_bud_period_header", "unsettle",unSettleData)
                        .then(function (data) {
                            $scope.gridOptions.hcApi.setRowData(data.fin_bud_period_lineoffin_bud_period_headers);
                            swalApi.success("反结转成功" );
                        }).then(doSelect);
                }

                function doSelect() {
                    return requestApi.post("fin_bud_period_header", "select",$scope.data.currItem)
                        .then(function (data) {
                            $scope.data.currItem = data;
                            $scope.gridOptions.hcApi.setRowData(data.fin_bud_period_lineoffin_bud_period_headers);
                        });
                }


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