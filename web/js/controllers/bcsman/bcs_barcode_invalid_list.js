/**
 * htp
 * 2020-08-06
 * 条码作废列表页
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        /**
         * 控制器
         */
        var bcs_invalid_list = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode:"stat" 
                    }, {
                        field: 'invalid_no',
                        headerName: '作废单号'
                    }, {
                        field: 'vendor_code', 
                        headerName: '供应商编码'
                    }, {
                        field: 'detp_name',
                        headerName: '使用部门名称'
                    }, {
                        field: 'creator',
                        headerName: '申请人'
                    }, {
                        field: 'create_time',
                        headerName: '申请时间'
                    }, {
                        field: 'updator',
                        headerName: '更新人',

                    }, {
                        field: 'update_time',
                        headerName: '更新时间',

                    }, {
                        field: 'remark',
                        headerName: '说明',
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
            controller: bcs_invalid_list
        });
    });  