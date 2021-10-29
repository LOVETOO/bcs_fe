/**
 * 项目失效申请
 * 2019/9/12
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', '$modal', 'swalApi'],
    function (module, controllerApi, base_obj_prop, requestApi, $modal, swalApi) {

        var controller = [
            '$scope',

            function ($scope) {
                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 工程项目查询
                 */
                $scope.searchObjectEpmProject = function () {
                    $modal.openCommonSearch({
                        classId: 'epm_project',
                        postData : {
                            search_flag : 2,
                            division_id : $scope.data.currItem.division_id,
                            report_type : 1, /* 选择单体项目 */
                            primary_key_id :
                                $scope.data.currItem.proj_disable_id > 0 ? $scope.data.currItem.proj_disable_id : 0
                        },
                        beforeOk: function (result) {
                            return requestApi
                                .post({
                                    classId: 'epm_project_contract',
                                    action: 'search',
                                    data: {
                                        project_id: result.project_id,      //查询属于这个项目的合同
                                        valid : 2,                          //查询有效的
                                        is_frame : 1,                       //查询非战略合同
                                        sqlwhere : ' contract_type >0 ' //查询经销商合同与自营合同
                                    }
                                })
                                .then(function (data) {
                                    if(data.epm_project_contracts.length > 0){
                                        var codes = "";
                                        data.epm_project_contracts.forEach(function (value) {
                                            codes =  "\r\n    【" + value.contract_code + "】";
                                        });
                                        swalApi.info("该项目存在有效的合同:"
                                            + codes
                                            + "\r\n请进行合同失效，可指定合同失效时一并失效工程。");
                                        return false;
                                    }else{
                                        return result;
                                    }
                                });
                        }
                    })
                        .result//响应数据
                        .then(function (response) {
                            var fileds = ['project_id', 'project_code', 'project_name', 'area_full_name',
                                'address', 'is_local', 'party_a_name', 'party_b_name'];
                            fileds.forEach(function (filed) {
                                $scope.data.currItem[filed] = response[filed];
                            });
                        });
                };
                /*----------------------------------按钮方法数据 定义-------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    $scope.searchProject();
                };

                /**
                 * 项目查询
                 */
                $scope.searchProject = function() {
                    return requestApi
                        .post({
                            classId: 'epm_division',
                            action: 'select',
                            data: {}
                        })
                        .then(function (data) {
                            $scope.data.currItem.division_id = data.division_id;
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
                    if($scope.data.currItem.auditor == "由单体报备发起的项目失效"){
                        requestApi
                            .post({
                                classId: 'epm_project_disable',
                                action: 'delete',
                                data: {
                                    proj_disable_id: $scope.data.currItem.proj_disable_id
                                }
                            })
                            .then(function () {
                                $scope.data.currItem.stat = 1;
                                $scope.data.currItem.wfid = 0;
                                $scope.data.currItem.wfflag = 0;
                                ['organization_id', 'audittime', 'auditor', 'updatetime', 'updator',
                                    'createtime', 'proj_disable_code', 'proj_disable_id'].forEach(function (filed) {
                                    $scope.data.currItem[filed] = undefined;
                                });
                            });
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