/**
* 工程师档案
* 2019/7/15.     
* zhuohuixiong
*/

define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
    
        /**
         * 控制器
         */
        var CssServiceHeaderList = [
            '$scope',
            function ($scope) {
 
                $scope.gridOptions = {
                 columnDefs:[{
                     type:'序号'
                 },{
                     field:'engineer_code',
                     headerName:'人员编号'
                 },{
                     field:'engineer_name',
                     headerName:'姓名'
                 },{
                     field:'identity_number',
                     headerName:'身份证号'
                 },{
                     field:'detailed_address',
                     headerName:'户口所在地'
                 },{
                     field:'sex',
                     headerName:'性别',
					 hcDictCode:'sex'
                 },{
                     field:'phone',
                     headerName:'手机号'
                 },{
                     field:'age',
                     headerName:'年龄'
                 },{
                     field:'email',
                     headerName:'邮箱'
                 },{
                     field:'education',
                     headerName:'学历',
					 hcDictCode:'educational_level'
                 },{
                     field:'mount_guard',
                     headerName:'上岗编号'
                 },{
                     field:'entry_date',
                     headerName:'入职时间',
                     type:'time'
                 },{
                     field:'note',
                     headerName:'备注'
                 },{
                     field:'position',
                     headerName:'职位',
					 hcDictCode:'network_engineer'
                 },{
                     field:'job_attributes',
                     headerName:'岗位属性',
					 hcDictCode:'job_attributes'
                 },{
                     field:'qualification_level',
                     headerName:'资格证级别',
					 hcDictCode:'Qualification'
                 },{
                     field:'information_number',
                     headerName:'信息员上岗证编号'
                 },{
                     field:'spare_number',
                     headerName:'备件员上岗证编号'
                 },{
                     field:'rejects_number',
                     headerName:'不良品上岗证编号'
                 },{
                     field:'settlement_number',
                     headerName:'结算员上岗证编号'
                 },{
                     field:'is_part_spare',
                     headerName:'兼职备件',
					 hcDictCode:'whether'
                 },{
                     field:'is_part_reject',
                     headerName:'兼职不良品',
					 hcDictCode:'whether'
                 },{
                     field:'is_part_sale',
                     headerName:'兼职销售',
					 hcDictCode:'whether'
                 },{
                     field:'is_part_repair',
                     headerName:'兼职维修',
					 hcDictCode:'whether'
                 },{
                     field:'is_part_settlement',
                     headerName:'兼职结算',
					 hcDictCode:'whether'
                 },{
                     field:'',
                     headerName:'权限'
                 },{
                     field:'',
                     headerName:''
                 }
                 ]};
 
                
                 //继承列表页基础控制器
        controllerApi.extend({
            controller: base_obj_list.controller,
            scope: $scope
        });
    }
 ]
    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: CssServiceHeaderList
    });
 });