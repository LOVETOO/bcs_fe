/**
 *  author: Li Meng
 *  time: 2019/7/30
 *  module:配件出库-新件&旧件 列表页
 **/
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        /**
         * 控制器  
         */
        var Css_Itemsale_List = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'stat',
                        hcDictCode:'stat',
                        headerName: '状态'
                    }, {
                        field: 'itemsale_no',
                        headerName: '单据编号'
                    }, {
                        field: 'create_time',
                        headerName: '制单时间',
                        type:"时间"
                    }, {
                        field: 'creator',
                        headerName: '制单人'
                    }, {
                        field: 'org_name',
                        headerName: '所属区域'
                    }, {
                        headerName: "网点名称",
                        field: "fix_org_name",
                    },{
                        headerName: "入库仓库",
                        field: "warehouse_name",
                    } ,{
                        field: 'note',
                        width: 250,
                        headerName: '备注'
                    }]
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
            controller: Css_Itemsale_List
        });
    });
