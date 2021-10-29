/**
 * 出纳轧账
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi','$q','dateApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi,$q,dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope','BasemanService','$timeout',
            //控制器函数
            function ($scope, BasemanService,$timeout) {
                $scope.data = {};
                $scope.data.currItem = {};

                $scope.lines = [];

                $scope.gridOptions = {
                    columnDefs: [{
                            type: '序号'
                         },
                        {
                            headerName: "检查项编码",
                            field: "check_item_code",
                        },
                        {
                            headerName: "检查项名称",
                            field: "check_item_name",
                        },
                        {
                            headerName: "允许跳过",
                            field: "is_roll_up",
                            type:"是否"
                        },
                        {
                            headerName: "状态",
                            field: "stat",
                            type:"词汇",
                            cellEditorParams:{
                                names:['待检查','检查中...','通过','未通过','跳过'],
                                values:[0,1,2,3,4]
                            },
                            cellStyle: function (params) {
                                var color = null;
                                switch (params.data.stat) {
                                    case 1:
                                        color = 'orange';
                                        break;
                                    case 2:
                                        color = 'green';
                                        break;
                                    case 3:
                                        color = 'red';
                                        break;
                                    case 4:
                                        color = 'red';
                                        break;
                                }
                                return {
                                    color: color
                                };
                            }
                        }
                    ]

                };

                $scope.detailOptions = {
                    columnDefs: [{
                            type: '序号'
                        },
                        {
                            headerName: "检查项编码",
                            field: "check_item_code"
                        },
                        {
                            headerName: "检查结果信息",
                            field: "result_info"
                        }
                        ,
                        {
                            headerName: "单据号",
                            field: "bill_no"
                        }
                    ]

                };


                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });


                var postData1 = {
                    classId: "gl_check_item",
                    action: 'settlecheck',
                    data: {}
                };


                $scope.check = function () {
                    //检查结账期间
                    if($scope.data.currItem.checkoutfnyearmonth==undefined){
                        return swalApi.info("没有找到启用的出纳期间");
                    }
                    //数据重置
                    $scope.lines.forEach(function (value) {
                        value.stat = 0;
                    });
                    $scope.gridOptions.hcApi.setRowData($scope.lines);
                    $scope.detailOptions.hcApi.setRowData([]);


                    swalApi.confirm({
                        title: '确定要轧账吗？',
                        confirmButtonText: '继续',
                        cancelButtonText: '取消'
                    }).then(function () {
                        var flag = true;
                        for(var i=0;i<$scope.lines.length;i++){
                            var value = $scope.lines[i];
                            value.flag = 1;
                            value.year_month = $scope.data.currItem.checkoutfnyearmonth;
                            value.stat = 1;//修改为执行中
                            $scope.gridOptions.hcApi.setRowData($scope.lines);
                            var rst = BasemanService.RequestPostSync("gl_check_item","settlecheck",value);
                            if(rst.flag==2&&value.is_roll_up==1){
                                $scope.detailOptions.hcApi.setRowData(rst.gl_check_itemofgl_check_items);
                                value.stat = 3;//未通过
                                $scope.gridOptions.hcApi.setRowData($scope.lines);
                                flag = false;
                                break;
                            }else if(rst.flag==2&&value.is_roll_up==2){
                                $scope.detailOptions.hcApi.setRowData(rst.gl_check_itemofgl_check_items);
                                value.stat = 4;//跳过
                                $scope.gridOptions.hcApi.setRowData($scope.lines);
                            }else{
                                value.stat = 2;//通过
                                $scope.gridOptions.hcApi.setRowData($scope.lines);
                            }
                        }
                        return flag;
                    }).then(function (flag) {
                        return $timeout(function() {
                            return flag;
                        },500);
                    }).then(function (flag) {
                        if(flag){
                            return swalApi.confirm({
                                title: '数据检查完毕，立即轧账？',
                                confirmButtonText: '确定',
                                cancelButtonText: '取消'
                            }).then(function () {
                                return $scope.doCheckYearMonth();
                            });
                        }
                    });
                }



                $scope.uncheck = function () {
                    //检查结账期间
                    if($scope.data.currItem.lastcheckoutfnyearmonth==undefined||$scope.data.currItem.lastcheckoutfnyearmonth==''){
                        return swalApi.info("没有找到上一次轧账的出纳期间");
                    }
                    swalApi.confirmThenSuccess({
                        title: "确定要取消轧账吗？",
                        okFun: function () {
                            var postData = {
                                classId: "gl_account_period",
                                action: 'fduncheckout',
                                data: $scope.data.currItem
                            };
                            return requestApi.post(postData).then($scope.getYearMonth);
                        },
                        okTitle: '取消成功！'
                    });

                }


                //添加按钮
                $scope.toolButtons = {

                    check: {
                        title: '轧账',
                        icon: 'glyphicon glyphicon-check',
                        click: function () {
                            $scope.check && $scope.check();
                        }
                    },

                    uncheck: {
                        title: '取消轧账',
                        icon: 'glyphicon glyphicon-step-backward',
                        click: function () {
                            $scope.uncheck && $scope.uncheck();
                        }

                    }

                };

                //月结
                $scope.doCheckYearMonth = function () {
                    var postData = {
                        classId: "gl_account_period",
                        action: 'fdcheckout',
                        data: $scope.data.currItem
                    };
                    return requestApi.post(postData).then($scope.getYearMonth);
                }


                //月结月份
                $scope.getYearMonth = function () {
                    var postData = {
                        classId: "gl_account_period",
                        action: 'getcheckoutinfo',
                        data: {}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            $scope.data.currItem.checkoutfnyearmonth = data.checkoutfnyearmonth;
                            $scope.data.currItem.lastcheckoutfnyearmonth = data.lastcheckoutfnyearmonth;
                            $scope.data.currItem.priorcheckoutfninfo = data.priorcheckoutfninfo;
                        });
                }



                //获取月结项目
                $scope.getmodsetchkitem = function () {
                    var postData = {
                        classId: "gl_check_item",
                        action: 'getmodsetchkitem',
                        data: {search_flag:1}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            $scope.lines = data.gl_check_itemofgl_check_items;
                            $scope.gridOptions.hcApi.setRowData($scope.lines);
                        });
                }

                //获本月月结月份
                $scope.getYearMonth().then($scope.getmodsetchkitem);


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