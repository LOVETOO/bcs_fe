/**
 * 投资项目类型-列表页
 * date:2018-11-26
 */
define(
    ['module', 'controllerApi', 'base_edit_list', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_edit_list, swalApi, requestApi) {
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
                            field: 'invitem_code',
                            headerName: '投资项目编码'
                        }, {
                            field: 'invitem_name',
                            headerName: '投资项目名称'
                        }, {
                            field: 'invitem_type',
                            headerName: '投资项目类型',
                        }, {
                            field: 'subject_no',
                            headerName: '会计科目编码',
                        }, {
                            field: 'subject_name',
                            headerName: '会计科目名称'
                        }, {
                            field: 'fee_code',
                            headerName: '费用项目编码',
                        }, {
                            field: 'fee_name',
                            headerName: '费用项目名称'
                        }, {
                            field: 'note',
                            headerName: '备注',
                            suppressSizeToFit: false,
                            minWidth: 500,
                            maxWidth: 600
                        }

                        ]
                    };

                    /*-------------------通用查询开始------------------------*/

                    /**
                     * 查投资项目类型
                     */
                    $scope.selectInvItemType = function () {
                        $modal.openCommonSearch({
                                classId: 'fin_investitem_type',
                                postData: {searchflag: 1},
                                action: 'search',
                                title: "投资项目类型",
                                gridOptions: {
                                    columnDefs: [{
                                        headerName: "投资项目类型编码",
                                        field: "invitem_type_code",
                                        width: 60,
                                        height: 80
                                    }, {
                                        headerName: "投资项目类型名称",
                                        field: "invitem_type",
                                        width: 150,
                                        height: 80
                                    }, {
                                        headerName: "备注",
                                        field: "note"
                                    }]
                                }
                            })
                            .result//响应数据
                            .then(function (result) {
                                $scope.data.currItem.invitem_type = result.invitem_type;
                                $scope.data.currItem.invitem_type_id = result.invitem_type_id;
                                $scope.data.currItem.invitem_type_code = result.invitem_type_code;
                            });
                    };

                    /**
                     * 查询费用项目
                     */
                    $scope.searchFeeObject = function () {
                        //过滤条件
                        if (!$scope.data.currItem.bud_type_id) {
                            swalApi.info("请先选择预算类别");
                            return;
                        } else {
                            var postdata = {
                                bud_type_id: $scope.data.currItem.bud_type_id,
                                fee_type_id: $scope.data.currItem.fee_type_id
                            };
                        }
                        $modal.openCommonSearch({
                                classId: 'fin_bud_type_header',
                                postData: postdata,
                                dataRelationName: 'fin_bud_type_lineoffin_bud_type_headers',
                                action: 'select',
                                title: "费用项目查询",
                                gridOptions: {
                                    columnDefs: [{
                                        headerName: "费用项目编码",
                                        field: "object_code"
                                    }, {
                                        headerName: "费用项目名称",
                                        field: "object_name"
                                    }]
                                }
                            })
                            .result//响应数据
                            .then(function (result) {
                                $scope.data.currItem.fee_id = result.object_id;
                                $scope.data.currItem.fee_name = result.object_name;
                                $scope.data.currItem.fee_code = result.object_code;

                                return requestApi.post("fin_fee_header", "select", {fee_id: $scope.data.currItem.fee_id})
                                    .then(function (response) {
                                        $scope.data.currItem.subject_id = response.subject_id;
                                        $scope.data.currItem.subject_no = response.subject_no;
                                        $scope.data.currItem.subject_name = response.subject_name;
                                        $scope.data.currItem.subject_desc = response.subject_desc;
                                    })
                            });
                    };

                    /**
                     * 预算类别
                     */
                    $scope.searchBudType = function () {
                        $modal.openCommonSearch({
                                classId: 'fin_bud_type_header',
                                postData: {maxsearchrltcmt: 10},
                                action: 'search',
                                title: "预算类别",
                                gridOptions: {
                                    columnDefs: [{
                                        headerName: "类别名称",
                                        field: "bud_type_name"
                                    }, {
                                        headerName: "类别编码",
                                        field: "bud_type_code"
                                    }, {
                                        headerName: "机构层级",
                                        field: "Org_Level"
                                    }, {
                                        headerName: "费用层级",
                                        field: "Fee_Type_Level",
                                    }, {
                                        headerName: "预算期间类别",
                                        field: "Period_Type"
                                    }, {
                                        headerName: "描述",
                                        field: "Description"
                                    }]
                                }
                            })
                            .result//响应数据
                            .then(function (result) {
                                ['bud_type_name', 'bud_type_code', 'bud_type_id', 'fee_type_id', 'period_type'].forEach(function (fieldName) {
                                    $scope.data.currItem[fieldName] = result[fieldName];
                                });
                                if ($scope.data.currItem.fee_id) {
                                    ['fee_id', 'fee_name', 'fee_code', 'subject_id', 'subject_no', 'subject_name', 'subject_desc'].forEach(function (fieldName) {
                                        $scope.data.currItem[fieldName] = typeof ($scope.data.currItem[fieldName]) === "string" ? '' : 0;
                                    });
                                }
                            });
                    };

                    /*-------------------通用查询结束---------------------*/
                    controllerApi.extend({
                        controller: base_edit_list.controller,
                        scope: $scope
                    });
                }
            ]
            ;

//使用控制器Api注册控制器
//需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
)
;