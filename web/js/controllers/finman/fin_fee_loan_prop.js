/**
 * 借款申请-属性页
 * 2018-11-21
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                /*-------------------数据定义开始------------------------*/
                $scope.isOverdue = false; //借款是否逾期默认为否
                function currItem() {
                    return $scope.data.currItem;
                }

                $scope.gridOptions = {
                    columnDefs : [
                        {
                            type: '序号' 
                        }
                        ,{
                            field: 'fee_name',
                            headerName: '借款项目名称'
                        }
                        ,{
                            field: 'warm_prompt',
                            headerName: '借款项目提示'
                        }
                        ,{
                            field: 'apply_amt',
                            headerName: '申请金额',
                            type: '金额'
                        }
                        ,{
                            field: 'allow_amt',
                            headerName: '批准金额',
                            type: '金额'
                        }
                        ,{
                            field: 'finish_payed_amt',
                            headerName: '已还款金额',
                            type: '金额'
                        }
                        ,{
                            field: 'note',
                            headerName: '备注'
                        }
                    ]
                };

                /*-------------------数据定义结束------------------------*/

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    $scope.gridOptions.hcApi.setRowData(bizData.fin_fee_loan_lines);
                };

                /**
                 * 检查借款是否有逾期单
                 */
                $scope.checkLoanOverdueBill = function () {
                    requestApi.post('fin_fee_loan_header', 'checkloanbill', 
                        {
                            creator: currItem().creator,
                            create_time: currItem().create_time
                        })
                    .then(function (response) {
                        if(response.is_overdue == 2){
                            $scope.isOverdue = true;
                        }
                    })
                };

                //底部右边按钮
                $scope.footerRightButtons.save.hide = true;

                $scope.footerRightButtons.add.hide = true;


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
