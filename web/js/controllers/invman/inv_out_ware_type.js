/**
 * 出入库类型设置-列表页
 * date:2018-12-12
 */
define(
    ['module', 'controllerApi', 'base_edit_list', 'swalApi', 'requestApi', 'dateApi'],
    function (module, controllerApi, base_edit_list, swalApi, requestApi, dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {
                /**数据定义 */
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'out_ware_type_code',
                        headerName: '类型编码'
                    }, {
                        field: 'out_ware_type_name',
                        headerName: '类型名称'
                    }, {
                        field: 'out_ware_direction',
                        headerName: '出入库方向',
                        hcDictCode: "out_ware_direction",
                        minWidth: 65
                    }, {
                        field: 'account_subject_no',
                        headerName: '记账科目编码',
                    }, {
                        field: 'account_subject_name',
                        headerName: '记账科目名称'
                    }, {
                        field: 'fee_subject_no',
                        headerName: '经费科目编码',
                    }, {
                        field: 'fee_subject_name',
                        headerName: '经费科目名称'
                    }, {
                        field: 'is_active',
                        headerName: '有效',
                        type: '是否'
                    }, {
                        field: 'is_bud_control',
                        headerName: '扣预算',
                        type: '是否'
                    }, {
                        field: 'is_cost_count',
                        headerName: '参与成本计算',
                        type: '是否'
                    }, {
                        headerName: "预算类别编码",
                        field: "bud_type_code",
                    }, {
                        headerName: "预算类别名称",
                        field: "bud_type_name",
                    }, {
                        headerName: "费用项目编码",
                        field: "fee_code",
                    }, {
                        headerName: "费用项目名称",
                        field: "fee_name",
                    }, {
                        field: 'creator',
                        headerName: '创建人',
                    }, {
                        field: 'create_time',
                        headerName: '创建时间',
                    }, {
                        field: 'note',
                        headerName: '备注',
                    }
                    ]
                };


                /*-------------------通用查询开始------------------------*/
                /**
                 * 会计科目查询
                 */
                $scope.searchSub = function (searchType) {
                    $modal.openCommonSearch({
                            classId: 'gl_account_subject'
                        })
                        .result//响应数据
                        .then(function (result) {
                            if (searchType == 'fee') {
                                $scope.data.currItem.fee_subject_id = result.gl_account_subject_id;
                                $scope.data.currItem.fee_subject_no = result.km_code;
                                $scope.data.currItem.fee_subject_name = result.km_name;
                            }
                            if (searchType == 'account') {
                                $scope.data.currItem.account_subject_id = result.gl_account_subject_id;
                                $scope.data.currItem.account_subject_no = result.km_code;
                                $scope.data.currItem.account_subject_name = result.km_name;
                            }

                        });
                };

                /**
                 * 预算类别
                 */
                $scope.searchBudType = function () {
                    $modal.openCommonSearch({
                            classId: 'fin_bud_type_header',
                            postData: {maxsearchrltcmt: 10}
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.bud_type_name = result.bud_type_name;
                            $scope.data.currItem.bud_type_code = result.bud_type_code;
                            $scope.data.currItem.bud_type_id = result.bud_type_id;
                            $scope.data.currItem.fee_type_id = result.fee_type_id;
                            $scope.data.currItem.period_type = result.period_type;

                            //逻辑关联,预算类别改变,需要清空费用对象,让用户重新选择
                            delete $scope.data.currItem.object_name;
                            delete $scope.data.currItem.object_code;
                            delete $scope.data.currItem.object_type;
                            delete $scope.data.currItem.object_id;
                        });
                };

                /**
                 * 查询费用项目postdata
                 */
                $scope.searchFeeObject = function (name, postdata) {
                    //过滤条件
                    if (!$scope.data.currItem.bud_type_id) {
                        swalApi.info("请先选择预算类别");
                        return;
                    } else {
                        postdata = {
                            bud_type_id: $scope.data.currItem.bud_type_id,
                            fee_type_id: $scope.data.currItem.fee_type_id,
                            flag: 4
                        };
                    }
                    $modal.openCommonSearch({
                            classId:'fin_bud_type_line_obj',
                            postData: postdata,
                        })
                        .result//响应数据
                        .then(function(result){
                            $scope.data.currItem.fee_id = result.fee_id;
                            $scope.data.currItem.fee_name = result.fee_name;
                            $scope.data.currItem.fee_code = result.fee_code;
                            $scope.data.currItem.fee_type = result.object_type;
                        });
                };
                /*-------------------通用查询结束---------------------*/

                $scope.outWareDirectionChanged = function () {
                    if ($scope.data.currItem.out_ware_direction == 1)
                        $scope.data.currItem.is_cost_count = 1;
                }

                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData); //继承基础控制器的方法，类似Java的super
                    angular.extend($scope.data.currItem, {
                        creator: strUserName,
                        create_time: dateApi.now(),
                        is_active: 2,
                        is_bud_control: 1,
                        is_cost_count: 1
                    });
                };


                controllerApi.extend({
                    controller: base_edit_list.controller,
                    scope: $scope
                });
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