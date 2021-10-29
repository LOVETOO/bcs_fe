/**
 * 绩效考核方案
 * 2019/6/15
 * liujianbing
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
                $scope.data = {
                    currItem: {}
                };
                $scope.assess_time =[];
                /**
                 * 列表定义
                 **/
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'org_name',
                            headerName: '部门名称',
                        }, {
                            field: 'userid',
                            headerName: '员工姓名',
                        }, {
                            field: 'empid',
                            headerName: '员工工号',
                        }, {
                            field: 'positionid',
                            headerName: '员工岗位',
                        }, {
                            field: 'collscore',
                            headerName: '考核得分',
                        }, {
                            field: 'add_value',
                            headerName: '加分',
                        }, {
                            field: 'deduct_value',
                            headerName: '扣分',
                        }, {
                            field: '',
                            headerName: '综合得分',
                        }, {
                            field: 'kpi_empgrade',
                            headerName: '员工分等',
                        }, {
                            field: 'ifgrade',
                            headerName: '是否分等',
                        }, {
                            field: 'grade_date',
                            headerName: '最后评分时间',
                        }
                    ]

                }

                /**
                 * 继承控制器
                 **/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /**
                 * 通用查询
                 **/
                $scope.commonSearchOfScale = {
                    afterOk: function (result) {
                        $scope.data.currItem.scale = result.scale;
                    }
                }
                /**
                 * 底部按钮定义
                 **/
                $scope.footerRightButtons.saveThenAdd.hide = true;


                $scope.footerLeftButtons.creat = {
                    title: '生成绩效分等',
                    click: function () {

                    }
                }

                /**
                 * 新增设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.setChangeKpiPeriod(bizData);
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.kpi_empkpiclassify_lineofkpi_empkpiclassify_headers);
                }

                /**
                 * 设置数据之前先改变考核期间取值范围
                 */
                $scope.setChangeKpiPeriod = function(bizData){
                    if(bizData.kpi_period==0||bizData.kpi_period==undefined||bizData.kpi_period==null){
                        return;
                    }
                    if(bizData.kpi_period==2){//半年度
                        $scope.assess_time.length = 0;
                        $scope.assess_time.push({
                            name:'上半年',
                            value:'1'
                        },{
                            name:'下半年',
                            value:'2'
                        })
                    }
                    if(bizData.kpi_period==3){//季度
                        $scope.assess_time.length = 0;
                        $scope.assess_time .push(
                            {
                                name:'1季度',
                                value:'1'
                            },{
                                name:'2季度',
                                value:'2'
                            },{
                                name:'3季度',
                                value:'3'
                            },{
                                name:'4季度',
                                value:'4'
                            })
                    }
                };



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