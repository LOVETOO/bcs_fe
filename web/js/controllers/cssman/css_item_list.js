/**
 * 配件资料
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        /**
         * 控制器
         */
        var EmployeeApplyHeaderList = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'css_item_code',
                        headerName: '配件编码'
                    }, {
                        field: 'css_item_name',
                        headerName: '配件名称'
                    }, {
                        field: 'usable',
                        headerName: '可用',
                        type:'是否'
                    }, {
                        field: 'uom_name',
                        headerName: '单位'
                    }, {
                        field: 'use_type',
                        hcDictCode:"use_type",
                        headerName: '主要用途'
                    }, {
                        field: 'rec_type',
                        hcDictCode:"rec_type",
                        headerName: '旧处理方式'
                    },{
                        field: 'sur_stat',
                        hcDictCode:"sur_stat",
                        headerName: '供应状态'
                    },{
                        field: 'met_type',
                        hcDictCode:"met_type",
                        headerName: '材料属性'
                    },{
                        field: 'norm_inv_qty',
                        type: "数量",
                        headerName: '合理库存'
                    },{
                        field: 'max_inv_qty',
                        type: "数量",
                        headerName: '最大库存'
                    },{
                        field: 'min_inv_qty',
                        type: "数量",
                        headerName: '最小库存'
                    },{
                        field: 'note',
                        headerName: '备注'
                    } ]
                };
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
            controller: EmployeeApplyHeaderList
        });
    });

