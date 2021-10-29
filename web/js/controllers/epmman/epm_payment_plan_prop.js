/**
 * 项目回款计划
 * 2019/7/8
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi, numberApi) {

        var controller = [
            '$scope',

            function ($scope) {
                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------表格定义-------------------------------------------*/
                /**
                 * 表格定义
                 */
                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                        type: '序号'
                    },{
                        field: 'dute_date',
                        headerName: '回款到期日'
                    }, {
                        field: 'payment_type',
                        headerName: '款项类别',
                        hcDictCode : 'epm.payment_type'
                    }, {
                        field: 'proportion',
                        headerName: '计划回款比列(%)',
                        type:'百分比'
                    }, {
                        field: 'plan_amt',
                        headerName: '计划回款金额',
                        type:'金额'
                    }, {
                        field: 'received_amt',
                        headerName: '已回款金额',
                        type:'金额'
                    }, {
                        field: 'collected_amt',
                        headerName: '待回款金额',
                        type:'金额'
                    }],
                    hcRequestAction : 'insert'
                };

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    //计划回款金额
                    $scope.data.currItem.plan_amt
                        = numberApi.sum($scope.data.currItem.epm_payment_plan_lines, 'plan_amt');
                    //已回款金额
                    $scope.data.currItem.received_amt
                        = numberApi.sum($scope.data.currItem.epm_payment_plan_lines, 'received_amt');
                    //待回款金额
                    $scope.data.currItem.collected_amt
                        = numberApi.sub($scope.data.currItem.plan_amt, $scope.data.currItem.received_amt);
                    //计算行
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            plan_amt: numberApi.sum($scope.data.currItem.epm_payment_plan_lines, 'plan_amt'),//计划回款金额
                            received_amt: numberApi.sum($scope.data.currItem.epm_payment_plan_lines, 'received_amt'), //已回款金额
                            collected_amt: numberApi.sum($scope.data.currItem.epm_payment_plan_lines, 'collected_amt')//待回款金额
                        }
                    ]);
                    if($scope.data.currItem.received_amt == 0){//已回款金额==0
                        //回款状态等于待回款
                        $scope.data.currItem.payment_stat = 1;
                    }
                    if($scope.data.currItem.received_amt > 0
                        && $scope.data.currItem.received_amt < $scope.data.currItem.plan_amt){//已回款金额>0并且小于计划回款金额
                        //回款状态等于部分收款
                        $scope.data.currItem.payment_stat = 2;
                    }
                    if($scope.data.currItem.received_amt == $scope.data.currItem.plan_amt){//已回款金额等于计划回款金额
                        //回款状态为收款完成
                        $scope.data.currItem.payment_stat = 3;
                    }
                };
                /*----------------------------------按钮方法数据 定义-------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.epm_payment_plan_lines = [];
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    bizData.epm_payment_plan_lines.forEach(function (val) {
                        val.collected_amt = numberApi.sub(val.plan_amt , val.received_amt);
                    });
                    //设置计划明细
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_payment_plan_lines);
                    $scope.calSum();
                };

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });

    });