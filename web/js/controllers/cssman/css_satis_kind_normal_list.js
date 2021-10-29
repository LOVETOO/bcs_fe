/**
* 正负激励申请
* 2019/7/17.     
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
                     field:'normal_code',
                     headerName:'奖罚单号'
                 },{
                     field:'normal_code_strive',
                     headerName:'维修单号'
                 },{
                     field:'stat',
                     headerName:'状态',
					 hcDictCode:'stat_up'
                 }
                //  ,{
                //      field:'entid',
                //      headerName:'机构编码'
                //  }
                 ,{
                     field:'entname',
                     headerName:'机构名称'
                 }
                //  ,{
                //      field:'assign_idpath',
                //      headerName:'网点编码'
                //  }
                 ,{
                     field:'assign_name',
                     headerName:'网点名称'
                 },{
                     field:'normal_name',
                     headerName:'安装/维修人员'
                 },{
                     field:'identification_level',
                     headerName:'满意度',
					 hcDictCode:'identification_level'
                 },{
                     field:'normal_amt',
                     headerName:'奖罚金额',
                     type:"金额"
                 },{
                     field:'settlement_type',
                     headerName:'结算类型',
                     hcDictCode:'pay_settlement_type'
                 },{
                     field:'normal_code_settlement',
                     headerName:'结算单号'
					 
                 },{
                     field:'creator',
                     headerName:'创建人'
                 },{
                     field:'create_time',
                     headerName:'创建时间'
                 },{
                     field:'updator',
                     headerName:'修改人'
                 },{
                     field:'update_time',
                     headerName:'修改时间'
                 }
                 ,{
                     field:'checkor',
                     headerName:'审核人'
                 },{
                     field:'check_time',
                     headerName:'审核时间'
                 }
                //  ,{
                //      field:'usable',
                //      headerName:'处理状态',
                //      hcDictCode:'usable'
                //  }
                 ,{
                     field:'note',
                     headerName:'备注'
                 },{
                     field:'old_entid',
                     headerName:'历史组织'
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