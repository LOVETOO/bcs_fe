/**
 *  author: Li Meng
 *  time: 2019/7/26
 *  module:配件签收单 列表页
 **/
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        /**
         * 控制器
         */
        var Css_Item_Diffproc_HeaderList = [
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
                        field: 'diffproc_no',
                        headerName: '单据编号'
                    }, {
                        field: 'create_time',
                        headerName: '制单时间',
                        type:"时间"
                    }, {
                        field: 'creator',
                        headerName: '制单人'
                    }, {
                        field: 'apply_no',
                        headerName: '配件申请单'
                    }, {
                        field: 'apply_time',
                        type:"时间",
                        headerName: '申请时间'
                    }, {
                        field: 'sendout_no',
                        headerName: '配件发放单'
                    }, {
                        field: 'sendout_time',
                        type:"时间",
                        headerName: '发放时间'
                    }, {
                        field: 'org_name',
                        headerName: '所属区域'
                    }, {
                        headerName: "网点名称",
                        field: "fix_org_name",
                    },{
                        headerName: "入库仓库",
                        field: "in_warehouse_name",
                    },{
                        headerName: "配件受理机构",
                        field: "out_org_name",
                    },{
                        headerName: "受理网点",
                        field: "out_fix_org_name",
                    }, {
                        field: 'out_warehouse_name',
                        headerName: '出库仓库'
                    } ,{
                        field: 'ship_type',
                        hcDictCode:'ship_type',
                        headerName: '发运类型'
                    } ,{
                        field: 'ship_org',
                        headerName: '物流公司'
                    },{
                        field: 'ship_no',
                        headerName: '物流单号'
                    },{
                        field: 'ship_man',
                        headerName: '司机姓名'
                    },{
                        field: 'ship_tel',
                        headerName: '司机电话'
                    } ,{
                        field: 'to_area_name',
                        headerName: '收货城市'
                    } ,{
                        field: 'to_address',
                        headerName: '详细地址'
                    } ,{
                        field: 'to_name',
                        headerName: '收货人'
                    } ,{
                        field: 'to_tel',
                        headerName: '电话号码'
                    } ,{
                        field: 'note',
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
            controller: Css_Item_Diffproc_HeaderList
        });
    });

