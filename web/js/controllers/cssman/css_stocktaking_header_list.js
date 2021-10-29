/**
* 配件盘点单
* 2019/7/30.     
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
                     field:'stocktalking_no',
                     headerName:'盘点单编号'
                 },{
                    field:'org_name',
                    headerName:'所属区域'
                },{
                    field:'fix_org_name',
                    headerName:'所属网点'
                },{
                    field:'warehouse_name',
                    headerName:'所属仓库'
                },{
                    field:'create_time',
                    headerName:'创建人'
                },{
                    field:'creator',
                    headerName:'创建时间'
                },{
                    field:'updator',
                    headerName:'更新人'
                },{
                    field:'update_time',
                    headerName:'更新时间'
                },{
                    field:'note',
                    headerName:'备注'
                }
                
                 ]};
/*--------------------------列表字段设置结束--------------------------------------------------------------------*/
 
                
/*-------------------------------------------------------------------------------------------------------------*/
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