/**
 * 绩效考核方案
 * 2019/5/30
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {
                    currItem: {}
                };
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode:'check_stat'
                        }, {
                            field: 'kpicase_name',
                            headerName: '考核方案名称'
                        }, {
                            field: 'kpicase_type',
                            headerName: '方案类别',
                            hcDictCode:'kpicase_type'
                        }, {
                            field: 'kpi_period',
                            headerName: '考核周期类型',
                            hcDictCode:'kpi_period'
                        }, {
                            field: 'cyear',
                            headerName: '考核年度',
                            type:'年'
                        }, {
                            field: 'seasonmth',
                            headerName: '考核期间',
                            type:'',
                            hcSelectOptions:'',
                            col_type:1
                        }, {
                            field: 'masterscale',
                            headerName: '主评人权重',
                            type:'数量'
                        }, {
                            field: 'selfscale',
                            headerName: '自评人权重',
                            type:'数量'
                        }, {
                            field: 'note',
                            headerName: '备注'
                        }, {
                            field: 'creator',
                            headerName: '创建人'
                        }, {
                            field: 'create_time',
                            headerName: '创建时间'
                        }, {
                            field: 'updator',
                            headerName: '修改人'
                        }, {
                            field: 'update_time',
                            headerName: '修改时间'
                        }
                    ],
                    hcAfterRequest:function(args){
                        determine(args);
                    }
                };

                function determine(args){
                    args.kpi_kpicase_headers.forEach(function(val){
                        switch (parseInt(val.kpi_period)) {
                            case 1:
                                $scope.gridOptions.columnDefs.forEach(function(col){
                                    if(col.col_type){
                                        val[col.type] = '数量';
                                    }
                                });
                                break;
                            case 2:
                                $scope.gridOptions.columnDefs.forEach(function(col){
                                    if(col.col_type){
                                        if(val.seasonmth==1){
                                            val.seasonmth = '上半年'
                                        }
                                        if(val.seasonmth==2){
                                            val.seasonmth = '下半年'
                                        }
                                    }
                                });
                                break;
                            case 3:
                                $scope.gridOptions.columnDefs.forEach(function(col){
                                    if(col.col_type){
                                        if(val.seasonmth==1){
                                            val.seasonmth = '1季度'
                                        }
                                        if(val.seasonmth==2){
                                            val.seasonmth = '2季度'
                                        }
                                        if(val.seasonmth==3){
                                            val.seasonmth = '3季度'
                                        }
                                        if(val.seasonmth==4){
                                            val.seasonmth = '4季度'
                                        }
                                    }
                                });
                                break;
                            case 4:
                                $scope.gridOptions.columnDefs.forEach(function(col){
                                    if(col.col_type){
                                        val[col.type] = '数量';
                                    }
                                });
                                break;
                        }
                    })
                }




                /*$scope.toolButtons.confirm = {
                    title: '确认',
                    click: function () {
                        $scope.confirm && $scope.confirm();
                    },
                    hide: false
                };*/
                /*$scope.toolButtons.confirm = {
                    groupId: 'base',
                    title: '确认',
                    click: function () {
                        $scope.confirm && $scope.confirm();
                    }
                };*/


                controllerApi.extend({
                    controller: base_obj_list.controller,
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