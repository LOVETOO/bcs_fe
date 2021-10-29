/**
 * 客户授信申请 - 对象属性页 sa_confer_believe_prop
 * @since 2019-01-03
 */

define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'dateApi'],
    function (module, controllerApi, base_obj_prop, requestApi, dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', 'BasemanService', '$stateParams',
            //控制器函数
            function ($scope, BasemanService, $stateParams) {

                //网格定义
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'bill_no',
                        headerName: '授信单号'
                    }, {
                        field: 'bill_date',
                        headerName: '单据日期',
                        type: '日期'
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode: 'stat'
                    }, {
                        field: 'customer_code',
                        headerName: '客户编码'
                    }, {
                        field: 'customer_name',
                        headerName: '客户名称'
                    }, {
                        field: 'amount',
                        headerName: '授信额度',
                        type: '金额'
                    }, {
                        field: 'star_date',
                        headerName: '生效日期',
                        type: '日期'
                    }, {
                        field: 'end_date',
                        headerName: '失效日期',
                        type: '日期'
                    }, {
                        field: 'fact_return_date',
                        headerName: '承诺还款日期',
                        type: '日期'
                    }, {
                        field: 'is_cancellation',
                        headerName: '作废',
                        type: '是否'
                    }, {
                        field: 'employee_name',
                        headerName: '责任人'
                    }, {
                        field: 'crm_entid',
                        headerName: '授信品类',
                        hcDictCode: 'crm_entid'
                    }, {
                        field: 'cnsx',
                        headerName: '承诺事项'
                    }, {
                        field: 'floor_type',
                        headerName: '授信类型',
                        hcDictCode: 'saleman.floor_type'
                    }, {
                        field: 'remark',
                        headerName: '备注'
                    }, {
                        field: 'created_by',
                        headerName: '创建人'
                    }, {
                        field: 'creation_date',
                        headerName: '创建时间'
                    }],
                    hcObjType: $stateParams.objtypeid
                };

                //继承基础控制器
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                $scope.doAfterSelect = function (response) {
                    $scope.data.currItem = response;
                    //var data = $scope.getCustomerAmountSum(response);

                    $scope.getCustomerAmountSum()
                        .then(function (data) {
                            console.log(data);
                            if (data)
                                $scope.data.currItem.current_receive_balance = data.amount_sum;
                        })
                }

                /*--------------------- 通用查询 开始---------------------------*/

                //查客户
                $scope.commonSearchSettingOfCustomer = {
                    afterOk: function (result) {
                        $scope.data.currItem.customer_name = result.customer_name;
                        $scope.data.currItem.customer_code = result.customer_code;
                        $scope.data.currItem.customer_id = result.customer_id;
                    }
                };

                //查业务员
                $scope.commonSearchSettingOfSaleEmployee = {
                    afterOk: function (result) {
                        $scope.data.currItem.duty_employee = result.employee_id;
                        $scope.data.currItem.employee_code = result.employee_code;
                        $scope.data.currItem.employee_name = result.employee_name;
                    }
                };

                /*--------------------- 通用查询 结束---------------------------*/

                /*--------------------- 数据定义 开始---------------------------*/
                /**
                 * 新增时的绑定数据、网格默认设置
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.bill_date = new Date().Format('yyyy-MM-dd');//默认“单据日期”为今天
                    bizData.star_date = bizData.bill_date;//默认“生效日期”为今天

                    //设置“失效日期”默认为“生效日期”30天后（格式化后的Date对象无法正常调用getDate方法）
                    var date1 = new Date();
                    var date2 = new Date(date1);
                    date2.setDate(date1.getDate() + 30);
                    var nextMonth = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate()
                    bizData.end_date = new Date(dateApi.DateFormatter(nextMonth)).Format('yyyy-MM-dd');

                    bizData.fact_return_date = bizData.end_date;//默认“承诺还款日期”同失效日期

                    bizData.created_by = strUserId;//默认"创建人"

                    bizData.creation_date = new Date().Format('yyyy-MM-dd hh:mm:ss');//默认“创建时间”

                    bizData.floor_type = 1;//授信类型，默认“普通额度”

                    bizData.is_cancellation = 1;//作废，默认“否”
                }

                /**
                 * 取客户对应应收账款余额
                 * 参数：记账月份、客户id
                 */
                $scope.getCustomerAmountSum = function () {
                    console.log($scope.data.currItem.customer_id, $scope.data.currItem.bill_date);
                    var postdata = {
                        customer_id: $scope.data.currItem.customer_id,
                        year_month: $scope.data.currItem.bill_date.substr(0, 7)
                    };
                    return requestApi.post('ar_month_sum', 'getcustomeraramount', postdata)
                };

                /*--------------------- 数据定义 结束---------------------------*/

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

/**
 * 取客户对应应收账款余额
 * 参数：记账月份、客户id
 */
/*$scope.getCustomerAmountSum = function () {
    var postdata = {
        customer_id: $scope.data.currItem.customer_id,
        year_month: $scope.data.currItem.year_month
    };
    return requestApi.post('ar_month_sum','getcustomeraramount',postdata)
};
 */