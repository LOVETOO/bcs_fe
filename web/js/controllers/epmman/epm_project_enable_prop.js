/**
 * 报备恢复生效
 * 2019/12/25
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi) {

        var controller = [
            '$scope',

            function ($scope) {
                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //字段名称
                var fileds_project = ['project_id', 'project_code', 'project_name', 'division_id', 'area_full_name',
                'address', 'is_local', 'party_a_name', 'party_b_name', 'disable_reason'];

                /*----------------------------------通用查询-------------------------------------------*/
                /**
                 * 项目查询
                 */
                $scope.commonSearchSetting = {
                    epmProject : {
                        title:"项目查询",
                        postData : {
                            report_type : 1,//查询单体报备
                            search_flag : 6//报备恢复生效查询
                        },
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "项目编码",
                                    field: "project_code"
                                },{
                                    headerName: "项目名称",
                                    field: "project_name"
                                },{
                                    field: "is_local",
                                    headerName: '本地/异地',
                                    hcDictCode: 'epm.is_local'
                                },{
                                    headerName: "事业部",
                                    field: "division_id",
                                    hcDictCode : 'epm.division'
                                },{
                                    field: 'party_a_name',
					                headerName: '甲方名称'
                                },{
                                    field: 'party_b_name',
					                headerName: '乙方名称'
                                }
                            ]
                        },
                        afterOk: function (project) {
                            //赋值项目相关字段
                            fileds_project.forEach(function(file){
                                $scope.data.currItem[file] = project[file];
                            });
                        },
                        beforeOk : function (project) {
                            return requestApi
                                .post({
                                    classId: 'epm_project_enable',
                                    action: 'verifycode',
                                    data: {
                                        project_id: project.project_id
                                    }
                                })
                                .then(function (data) {
                                    if (data.sqlwhere.length > 0) {
                                        //存在有未审核完毕的单号
                                        swalApi.error(data.sqlwhere);
                                        return false;
                                    }else{
                                        //赋值前期失效原因字段
                                        project.disable_reason = data.disable_reason;
                                        return project;
                                    }
                                });
                        }
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



