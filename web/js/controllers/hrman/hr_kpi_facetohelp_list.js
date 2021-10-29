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
                /**
                 * 列表定义
                 *
                 **/
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode:"stat"
                        },{
                            field: 'facehelp_no',
                            headerName: '面谈记录单号'
                        },{
                            field: 'kpicase_name',
                            headerName: '考核方案名称'
                        },{
                            field: 'interviewtime',
                            type:'日期',
                            headerName: '面谈时间'
                        },{
                            field: 'presideman',
                            headerName: '面谈主持人'
                        },{
                            field: 'userid',
                            headerName: '员工姓名'
                        },{
                            field: 'org_name',
                            headerName: '部门名称'
                        },{
                            field: 'positionid',
                            headerName: '员工岗位'
                        },{
                            field: 'empid',
                            headerName: '员工工号'
                        },{
                            field: 'talkabout',
                            headerName: '面谈摘要'
                        },
                        {
                            field: 'improveplan',
                            headerName: '改善计划'
                        },
                        {
                            field: 'advice',
                            headerName: '处理意见'
                        },
                        {
                            field: 'note',
                            headerName: '备注'
                        },
                        {
                            field: 'creator',
                            headerName: '创建人'
                        },
                        {
                            field: 'create_time',
                            headerName: '创建时间'
                        },{
                            field: 'updator',
                            headerName: '修改人'
                        },
                        {
                            field: 'update_time',
                            headerName: '修改时间'
                        },

                    ]


                }
                /**
                 * 继承控制器
                 **/
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });


                $scope.toolButtons.copy.hide = false;



                /*   $scope.toolButtons.copy.click=function () {
                       return $scope.copy && $scope.copy();
                   }*/

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