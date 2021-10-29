/**
 * 项目付款申请-属性页
 * shenguocheng
 * 2019-07-15
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                /*-------------------通用查询开始------------------------*/
                $scope.commonSearch = {
                    //查询工程项目信息
                    projectName: {
                        postData: {
                            search_flag: 120
                        },
                        sqlWhere: 'stat = 5 and report_type = 1',
                        afterOk: function (result) {
                            $scope.data.currItem.project_id = result.project_id;
                            $scope.data.currItem.project_code = result.project_code;
                            $scope.data.currItem.project_name = result.project_name;
                            $scope.data.currItem.manager = result.manager;
                        }
                    },
                    //查询项目付款合同信息
                    contractName: {
                        sqlWhere: "contract_character = 'AP'",
                        afterOk: function (result) {
                            $scope.data.currItem.contract_id = result.contract_id;
                            $scope.data.currItem.contract_code = result.contract_code;
                            $scope.data.currItem.contract_name = result.contract_name;//合同名称

                            $scope.data.currItem.contract_amt = result.contract_amt;//合同金额
                        }
                    },
                    //查询申请人信息
                    applyPeople: {  
                        afterOk: function (result) {
                            $scope.data.currItem.apply_people_id = result.employee_id;
                            $scope.data.currItem.apply_people = result.employee_name;
                        }
                    }
                };

                /*-------------------通用查询结束---------------------*/
                //继承控制器
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.apply_date = new Date().Format('yyyy-MM-dd');
                    $scope.data.currItem.apply_people_id = userbean.loginuserifnos[0].sysuserid;
                    $scope.data.currItem.apply_people = userbean.loginuserifnos[0].username;
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
