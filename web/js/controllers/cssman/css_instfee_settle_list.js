/**
 * Created by zhl on 2019/7/8.
 * 安装费结算标准 css_instfee_settle_list
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode:'stat'
                    }, {
                        field: 'norm_id',
                        headerName: '标准Id'
                    }, {
                        field: 'norm_name',
                        headerName: '标准名称'
                    }, {
                        field: 'distance_start',
                        headerName: '公里数开始',
                        type:'数字'
                    }, {
                        field: 'distance_end',
                        headerName: '公里数结束',
                        type:'数字'
                    }, {
                        field: 'way_fee',
                        headerName: '上门费',
                        type:'金额'
                    }, {
                        field: 'is_perdistance',
                        headerName: '按每公里计算',
                        type:'是否'
                    }, {
                        field: 'perdistance_fee',
                        headerName: '每公里上门费',
                        type:'金额'
                    }, {
                        field: 'perdistance_basefee',
                        headerName: '按公里数计算的基础上门费',
                        type:'金额'
                    }, {
                        field: 'inst_fee',
                        headerName: '安装费',
                        type:'金额'
                    }, {
                        field: 'info_fee',
                        headerName: '信息费',
                        type:'金额'
                    }, {
                        field: 'repair_way',
                        headerName: '服务方式',
                        hcDictCode:'service_way'
                    }, {
                        field: 'start_date',
                        headerName: '开始日期',
                        type:'日期'
                    }, {
                        field: 'end_date',
                        headerName: '结束日期',
                        type:'日期'
                    }, {
                        field: 'item_type_no',
                        headerName: '产品大类编码'
                    }, {
                        field: 'item_type_name',
                        headerName: '产品大类名称'
                    }, {
                        field: 'smallc_code',
                        headerName: '小类编码'
                    }, {
                        field: 'smallc_name',
                        headerName: '小类名称'
                    }, {
                        field: 'series_code',
                        headerName: '系列编码'
                    }, {
                        field: 'series_name',
                        headerName: '系列名称'
                    }, {
                        field: 'item_code',
                        headerName: '产品编码'
                    }, {
                        field: 'item_name',
                        headerName: '产品名称'
                    }, /*{
                        field: 'spec',
                        headerName: '产品型号'
                    }, */{
                        field: 'creator',
                        headerName: '制单人'
                    }, {
                        field: 'create_time',
                        headerName: '制单时间',
                        type:'日期'
                    }, {
                        field: 'updator',
                        headerName: '修改人'
                    }, {
                        field: 'update_time',
                        headerName: '修改时间',
                        type:'日期'
                    },/* {
                        field: 'checkor',
                        headerName: '审核人'
                    }, {
                        field: 'check_time',
                        headerName: '审核时间',
                        type:'日期'
                    }*/{
                        field: 'note',
                        headerName: '备注'
                    }]
                };

                //继承基础控制器
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
            controller: controller
        });
    }
);
