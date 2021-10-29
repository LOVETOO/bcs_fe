/**
 * 封标核查
 * 2019/6/12 epm_project_bid_sealed_list
 * taosilan
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        /**
         * 控制器
         */
        var Epm_ProjectBidSealedList = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'project_code',
                        headerName: '项目编码'
                    },{
                        field: 'project_name',
                        headerName: '项目名称'
                    }, {
                        field: 'report_time',
                        headerName: '报备时间',
                        type:'时间'
                    },  {
                        field: 'project_source',
                        headerName: '工程类型',
                        hcDictCode:'epm.project_source'
                    },  {
                        field: 'signup_time',
                        headerName: '报名时间',
                        type:'日期'
                    }, {
                        field: 'signup_people',
                        headerName: '报名经办人'
                    }, {
                        field: 'bid_sealed_time',
                        headerName: '封标时间',
                        type:'日期'
                    },{
                        field:'bid_sealed_person',
                        headerName:'封标人'
                    },{
                        field:'bid_sealed_address',
                        headerName:'封标地点'
                    },{
                        field:'bid_open_attendee',
                        headerName:'出场人'
                    },{
                        field:'stamp_no',
                        headerName:'印章编号'
                    },{
                        field:'creator_name',
                        headerName:'创建人'
                    },{
                        field:'createtime',
                        headerName:'创建时间',
                        type:'时间'
                    },{
                        field:'updator_name',
                        headerName:'修改人'
                    },{
                        field:'updatetime',
                        headerName:'修改时间',
                        type:'时间'
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
            controller: Epm_ProjectBidSealedList
        });
    });