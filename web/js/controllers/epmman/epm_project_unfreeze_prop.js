/**
 * 工程解冻申请
 * 2019/9/4
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', '$modal'],
    function (module, controllerApi, base_obj_prop, requestApi, $modal) {

        var controller = [
            '$scope',

            function ($scope) {
                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //经销商id
                $scope.data.customer_id = 0;
                /*----------------------------------计算方法-------------------------------------------*/

                /**
                 * 清除数据
                 */
                function clear(){
                    var fileds = ['project_id', 'project_code', 'project_name', 'area_full_name',
                        'address', 'is_local', 'party_a_name', 'party_a_link_person', 'party_a_phone',
                        'party_b_name', 'party_b_phone', 'party_b_link_person', 'freeze_type', 'freeze_time',
                        'stage_date_before', 'reason', 'stage_desc_after', 'stage_desc_before',
                        'stage_value_before', 'stage_value_after', 'stage_name_before', 'stage_name_after'];
                    fileds.forEach(function (filed) {
                        $scope.data.currItem[filed] = undefined;
                    });
                }
                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 工程项目查询
                 */
                $scope.searchObjectEpmProject = function () {
                    $modal.openCommonSearch({
                        classId: 'epm_project',
                        postData : {
                            /* 项目解冻申请通用查询 */
                            search_flag : 1,
                            division_id : $scope.data.currItem.division_id,
                            primary_key_id :
                                $scope.data.currItem.proj_unfreeze_id > 0 ?
                                    $scope.data.currItem.proj_unfreeze_id : 0,
                            customer_id : $scope.data.customer_id > 0 ? $scope.data.customer_id : 0
                        }
                    })
                        .result//响应数据
                        .then(function (response) {
                            //赋值前先清除数据
                            clear();
                            $scope.data.currItem.freeze_type = response.freeze_type;
                            var fileds = ['project_id', 'project_code', 'project_name', 'area_full_name',
                                'address', 'is_local', 'party_a_name', 'party_a_link_person', 'party_a_phone',
                                'party_b_name', 'party_b_phone', 'party_b_link_person', 'freeze_time'];
                            fileds.forEach(function (filed) {
                                $scope.data.currItem[filed] = response[filed];
                            });
                            //需查询其他数据
                            return requestApi
                                .post({
                                    classId: 'epm_project_unfreeze',
                                    action: 'selectsupermarket',
                                    data: {
                                        project_id : $scope.data.currItem.project_id
                                    }
                                })
                                .then(function (data) {
                                    ['stage_date_before', 'stage_desc_before',
                                        'stage_value_before', 'stage_name_before'].forEach(function (selectFiled) {
                                        $scope.data.currItem[selectFiled] = data[selectFiled];
                                    });
                                });
                            
                        });
                };

                /**
                 * 项目进度查询
                 */
                $scope.commonSearchEpmStageDef = {
                    postData: function () {
						return {
							search_flag: 2,
                            stage_id: $scope.data.currItem.stage_value_before > 0 ? 
                                $scope.data.currItem.stage_value_before : 0
						};
					},
                    afterOk: function (stage) {
                        $scope.data.currItem.stage_value_after = stage.stage_id;
                        $scope.data.currItem.stage_name_after = stage.stage_name;
                    }
                };

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //经销商账户登陆
                    if(customer){
                        $scope.data.customer_id = customer.customer_id;
                    }
                    //查询当前组织的事业部
                    return requestApi
                        .post({
                            classId: 'epm_division',
                            action: 'select',
                            data: {}
                        })
                        .then(function (data) {
                            $scope.data.currItem.division_id = data.division_id;
                            $scope.data.currItem.division_name = data.division_name;
                        })
                        .then(function () {
                            $scope.searchObjectEpmProject();
                        });
                };

                /**
                 * 保存验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    return invalidBox;
                };

                /**
                 * 保存数据前处理数据
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    //经销商账户登陆
                    if(customer){
                        $scope.data.customer_id = customer.customer_id;
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

    });