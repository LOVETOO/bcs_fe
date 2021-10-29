/**
 * 项目评审立项
 * 2019/6/10
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        /**
         * 控制器
         */
        var EpmProjectBidHeadList = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode: 'stat'
                    }, {
                        field: 'project_bid_no',
                        headerName: '单据编码'
                    }, {
                        field: 'project_code',
                        headerName: '项目编码'
                    }, {
                        field: 'project_name',
                        headerName: '项目名称'
                    }, {
                        field: 'project_source',
                        headerName: '工程类型',
                        hcDictCode : 'epm.project_source'
                    }, {
                        field: 'bid_open_address',
                        headerName: '开标地点'
                    }, {
                        field: 'tech_service_type',
                        headerName: '标书及技术使用',
                        hcDictCode: 'epm.bid_make_method'
                    }, {
                        field: 'bid_open_date',
                        headerName: '开标时间',
                        type: '日期'
                    }, {
                        field: 'bid_open_method',
                        headerName: '开标方式',
                        hcDictCode: 'epm.bid_make_method'
                    }, {
                        field: 'bid_open_primary',
                        headerName: '开标授权人'
                    }, {
                        field: 'aq_end_date',
                        headerName: '答疑截止时间',
                        type: '日期'
                    }, {
                        field: 'bid_security',
                        headerName: '保证金金额',
                        type: '金额'
                    }, {
                        field: 'bid_security_end_date',
                        headerName: '保证金截止时间',
                        type: '日期'
                    }, {
                        field: 'bid_org_name',
                        headerName: '招标机构'
                    }, {
                        field: 'bid_org_linkman',
                        headerName: '招标联系人'
                    }, {
                        field: 'bid_org_phoneno',
                        headerName: '招标联系电话'
                    }, {
                        field: 'is_to_performance',
                        headerName: '保证金是否转履约',
                        type: '是否'
                    }, {
                        field: 'bid_org_bank',
                        headerName: '招标机构开户行'
                    }, {
                        field: 'bid_org_account',
                        headerName: '招标机构账号'
                    }, {
                        field: 'report_time',
                        headerName: '报备时间',
                        type: '时间'
                    }, {
                        field: 'signup_time',
                        headerName: '报名时间',
                        type: '日期'
                    }, {
                        field: 'signup_plan_people',
                        headerName: '报名经办人'
                    }
                        , {
                            field: 'signup_method',
                            headerName: '报名方式'
                        }
                        , {
                            field: 'creator_name',
                            headerName: '创建人'
                        }, {
                            field: 'createtime',
                            headerName: '创建时间',
                            type: '时间'
                        }, {
                            field: 'updator_name',
                            headerName: '修改人'
                        }, {
                            field: 'updatetime',
                            headerName: '修改时间',
                            type: '时间'
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
            controller: EpmProjectBidHeadList
        });
    });

