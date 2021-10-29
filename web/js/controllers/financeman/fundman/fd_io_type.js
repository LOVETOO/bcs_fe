/**
 * 收支类别设置-编辑+列表页
 * 2018-12-21
 */
define(
    ['module', 'controllerApi', 'base_edit_list'],
    function (module, controllerApi, base_edit_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                /**数据定义 */
                $scope.data = {};
                $scope.data.currItem = {};

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'io_type_code',
                            headerName: '收支类型编码'
                        }
                        , {
                            field: 'io_type_name',
                            headerName: '收支类型名称'
                        }
                        , {
                            field: 'io',
                            headerName: '收支方向',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'io_business',
                            headerName: '所属业务类型',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'subject_code',
                            headerName: '会计科目编码'
                        }
                        , {
                            field: 'subject_name',
                            headerName: '会计科目名称'
                        }
                        , {
                            field: 'usable',
                            headerName: '可用',
                            type: '是否'
                        }
                    ]
                };

                /*--------------------通用查询开始-------------------*/
                $scope.commonSearchSetting = {
                    //会计科目
                    gl_account_subject: {
                        sqlWhere: ' end_km = 2',
                        afterOk: function (response) {
                            $scope.data.currItem.gl_account_subject_id = response.gl_account_subject_id;
                            $scope.data.currItem.subject_code = response.km_code;
                            $scope.data.currItem.subject_name = response.km_name;
                        }
                    }
                };


                /*--------------------通用查询结束-------------------*/

                controllerApi.extend({
                    controller: base_edit_list.controller,
                    scope: $scope
                });

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.usable = 2;
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