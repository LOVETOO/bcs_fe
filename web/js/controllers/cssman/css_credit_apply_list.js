/**
* 配件授信申请  
* 2019/7/19.     
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
                     field:'apply_no',
                     headerName:'单据编号'
                 },{
                    field:'org_code',
                    headerName:'机构编号'
                },{
                    field:'org_name',
                    headerName:'机构名称'
                },{
                    field:'fix_org_code',
                    headerName:'网点编码'
                },{
                    field:'fix_org_name',
                    headerName:'网点名称',
                    cellStyle:{
                        alignSelf:'center'
                    }
                },{
                    field:'apply_amt',
                    headerName:'申请金额',
                    type:'金额'
                },{
                    field:'check_amt',
                    headerName:'审批金额',
                    type:'金额'
                },{
                    field:'end_date',
                    headerName:'到期日期'
                },{
                    field:'stat',
                    headerName:'流程状态',
                    hcDictCode:'stat'
                },{
                    field:'note',
                    headerName:'备注'
                },{
                    field:'creator',
                    headerName:'创建人'
                },{
                    field:'create_time',
                    headerName:'创建时间'
                },{
                    field:'updator',
                    headerName:'更新人'
                },{
                    field:'update_time',
                    headerName:'更新时间'
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


