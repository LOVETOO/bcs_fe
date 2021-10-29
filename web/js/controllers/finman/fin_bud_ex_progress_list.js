/*
* 预算执行进度调查 fin_bud_ex_progress_list
*  date:2019-1-3
* */
define(
    ['module', 'controllerApi', 'base_diy_page', 'fileApi', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_diy_page, fileApi, swalApi , requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal' ,
            //控制器函数
            function ($scope , $modal) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'unknown',
                        headerName: '部门编码'
                    }, {
                        field: 'unknown',
                        headerName: '部门名称'
                    },  {
                        field: 'unknown',
                        headerName: '品类'
                    }, {
                        field: 'unknown',
                        headerName: '费用编码'
                    }, {
                        field: 'unknown',
                        headerName: '费用名称'
                    }, {
                        field: 'unknown',
                        headerName: '月度'
                    }, {
                        field: 'unknown',
                        headerName: '期初预算'
                    }, {
                        field: 'unknown',
                        headerName: '期末实际预算'
                    }, {
                        field: 'unknown',
                        headerName: '上期节转金额'
                    }, {
                        field: 'unknown',
                        headerName: '本期调整金额'
                    }, {
                        field: 'unknown',
                        headerName: '本期已使用金额'
                    },{
                        field: 'note',
                        headerName: '本期可使用金额'
                    }]
                };
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });


                /*----------------------------  通用查询开始  ----------------------------------*/
                //查预算类别
                $scope.chooseFinType = function (){
                    $modal.openCommonSearch({
                            classId:'fin_bud_type_header',
                            postData:{
                                maxsearchrltcmt: 10,
                            },
                            sqlWhere: " Fin_Bud_Type_Header.Usable=2 and Fin_Bud_Type_Header.Org_Level<>5 ",
                            action:'search',
                            title:"预算类别",
                            dataRelationName:'fin_bud_type_headers',
                            gridOptions:{
                                columnDefs:[{
                                    name: "类别名称",
                                    code: "bud_type_name"
                                }, {
                                    name: "类别编码",
                                    code: "bud_type_code"
                                }, {
                                    name: "费用层级",
                                    code: "fee_type_level"
                                }, {
                                    name: "预算期间类别",
                                    code: "period_type"
                                }, {
                                    name: "描述",
                                    code: "description"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function(result){
                            $scope.data.bud_type_id = result.bud_type_id;//预算类别数据
                            // $scope.data.bud_type_code = result.bud_type_code;
                            $scope.data.bud_type_name = result.bud_type_name;
                            $scope.data.period_type = result.period_type;//期间类型

                            requestApi.post(
                                "fin_bud_type_header", "select",
                                {
                                    "bud_type_id": $scope.data.bud_type_id
                                }
                            ).then(function (result) {
                                    $scope.object_ids = [];
                                    $scope.data.object_id = "";
                                    $.each(result.fin_bud_type_lineoffin_bud_type_headers, function (i, item) {
                                        $scope.object_ids[i] = item;
                                        $scope.object_ids[i].name = item.object_name;
                                        $scope.object_ids[i].id = item.object_id;
                                    });
                                    //默认选择第一个费用项目
                                    $scope.data.object_id = result.fin_bud_type_lineoffin_bud_type_headers[0].object_id;

                                    //执行$watch  在数组中的bud_type_code都一样
                                    $scope.data.bud_type_code = result.fin_bud_type_lineoffin_bud_type_headers[0].bud_type_code;

                                    //查询机构
                                    deptSearch();
                                }
                            );
                        });
                };

                //查费用类别
                $scope.chooseFeeType = function (){
                    $modal.openCommonSearch({
                            classId:'fin_fee_type',
                            postData:{
                                maxsearchrltcmt: 30,
                            },
                            sqlWhere: " fin_fee_type.usable=2 and fin_fee_type.lev=1 ",
                            action:'search',
                            title:"费用类别查询",
                            dataRelationName:'fin_fee_types',
                            gridOptions:{
                                columnDefs:[{
                                    name: "费用类别编码",
                                    code: "fee_type_code"
                                }, {
                                    name: "费用类别名称",
                                    code: "fee_type_name"
                                }, {
                                    name: "备注",
                                    code: "note"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function(result){
                            $scope.data.currItem.fee_type_code = result.fee_type_code;
                            $scope.data.currItem.fee_type_name = result.fee_type_name;
                            $scope.data.currItem.fee_type_id = result.fee_type_id;
                            $scope.data.currItem.lev = result.lev;
                            $scope.data.currItem.idpath = result.idpath;
                        });
                };

                //查部门
                $scope.chooseDept = function () {
                    $modal.openCommonSearch({
                            classId:'dept'
                        })
                        .result//响应数据
                        .then(function(response){
                            $scope.data.searchItem.org_id = response.dept_id;
                            $scope.data.searchItem.org_code = response.dept_code;
                            $scope.data.searchItem.org_name = response.dept_name;

                        });
                };
                    /*----------------------------  通用查询结束  ----------------------------------*/

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
