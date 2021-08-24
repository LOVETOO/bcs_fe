/**
 * 条码库管理列表页
 * @since 2019-12-18
 * 巫奕海
 */ 
define(
    ['module', 'controllerApi', 'base_obj_list','requestApi'],
    function (module, controllerApi, base_obj_list,requestApi) {
        /**
         * 控制器
         */
        var bcs_barcode_list = [
            '$scope', 
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'code',
                        headerName: '条码批次号'
                    }, {
                        field: 'downloaduser',
                        headerName: '下载用户'
                    }, {
                        field: 'downloadtime',
                        headerName: '下载时间'      
                    } , {
                        field: 'filename', 
                        headerName: '文件名称'
                    }] 
                }; 



                //继承列表页基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });
            }
        ];
        
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: bcs_barcode_list
        });
    });