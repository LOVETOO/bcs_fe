/**
 * 公司证照
 *  2019/5/23
 *  zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'fileApi'],
    function (module, controllerApi, base_obj_list, fileApi) {
    'use strict';
    /**
     * 控制器
     */
        var EpmResouceCLicenseList = [
            '$scope',
            function ($scope) {
                $scope.gridOptions={
                    columnDefs:[{
                        type:'序号'
                    },{
                        field:'stat',
                        headerName:'当前状态',
                        cellStyle: {
                            'text-align': 'center'
                        }
                    },{
                        field:'resource_archives_code',
                        headerName:'系统编码'
                    },{
                        field:'resouce_category_name',//查epm_resouce_category
                        headerName:'证照类别'
                    },{
                        field:'resource_name',
                        headerName:'证照名称'
                    },{
                        field:'is_usable',
                        headerName:'可用',
                        type:'是否'
                    },{
                        field:'resource_identifier',
                        headerName:'证照编号'
                    },{
                        field:'keeper_name',//查scpuser
                        headerName:'保管人'
                    },{
                        field:'certifying_authority',
                        headerName:'发证机构'
                    },{
                        field:'effective_date',
                        headerName:'生效日期',
                        type:'日期'
                    },{
                        field:'exp_date',
                        headerName:'失效日期',
                        type:'日期'
                    },{
                        field:'remark',
                        headerName:'备注'
                    },{
                        field:'loan_date',
                        headerName:'借出时间'
                    },{
                        field:'estimated_return_date',
                        headerName:'预计归还时间'
                    },{
                        field:'loan_person_name',//回写
                        headerName:'使用人'
                    }
                    ,{
                        field:'loan_project_name',//回写
                        headerName:'使用项目'
                    },{
                        field:'loan_description',
                        headerName:'使用用途'
                    },{
                        field:'create_by_name',
                        headerName:'创建人'
                    },{
                        field:'create_date',
                        headerName:'创建时间'
                    },{
                        field:'last_update_by_name',
                        headerName:'修改人'
                    },{
                        field:'last_update_date',
                        headerName:'修改时间'
                    }],hcPostData:{
                        /*只查公司证照*/
                        resouce_type : 1
                    }
                };

                //继承列表页基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });
                //按钮显示
                $scope.toolButtons.downloadImportFormat.hide = false;
                $scope.toolButtons.import.hide = false;
                /**
                 * 导入时发送的数据
                 * @returns {{data: {resouce_type: number}}}
                 */
                $scope.getImportSetting = function () {
                    return {
                        data: {
                            resouce_type : 1
                        }
                    };
                };

                $scope.toolButtons.downloadImportFormat.click = function () {
                    fileApi.downloadFile(7262);
                };
            }
    ];

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: EpmResouceCLicenseList
    });
});

