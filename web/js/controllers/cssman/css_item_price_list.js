/**
* 配件价格
* 2019/7/20.     
* zhuohuixiong
*/
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
    //
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
                    field:'stat',
                    headerName:'单据状态',
                    hcDictCode:'stat'
                },{
                     field:'price_no',
                     headerName:'单据编号'
                 },{
                    field:'org_code',
                    headerName:'机构编号'
                },{
                    field:'org_name',
                    headerName:'机构名称'
                },{
                    field:'start_date',
                    headerName:'开始时间'
                },{
                    field:'end_date',
                    headerName:'结束时间'
                },{
                    field:'note',
                    headerName:'备注',
                    width:200
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