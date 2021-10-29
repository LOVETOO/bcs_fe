/**
 * 投标文件评审
 * 2019/6/12
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list','requestApi','$q'],
    function (module, controllerApi, base_obj_list,requestApi,$q) {
        'use strict';
        /**
         * 控制器
         */
        var EpmPropjectBidReviewHeadList = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode:'stat'
                    },{
                        field: 'project_bid_review_no',
                        headerName: '单据编号'
                    }, {
                        field: 'project_code',
                        headerName: '项目编码'
                    },  {
                        field: 'project_name',
                        headerName: '项目名称'
                    }, {
                        field: 'bid_doc_maker',
                        headerName: '标书制作人'
                    }, {
                        field: 'bid_doc_finish_time',
                        headerName: '标书完成时间',
                        type:'日期'
                    }, {
                        field: 'report_time',
                        headerName: '报备时间',
                        type:'时间'
                    }, {
                        field: 'project_source',
                        headerName: '工程类型',
                        hcDictCode:'epm.project_source'
                    }, {
                        field: 'signup_time',
                        headerName: '报名时间',
                        type:'日期'
                    }, {
                        field: 'signup_plan_people',
                        headerName: '报名经办人'
                    }
                    , {
                        field: 'signup_method',
                        headerName: '报名方式'
                    }
                    ,  {
                        field: 'bid_open_date',
                        headerName: '开标时间',
                        type:'日期'
                    }, {
                        field: 'bid_open_method',
                        headerName: '开标方式',
                        hcDictCode:'epm.bid_open_method'
                    }, {
                        field: 'bid_open_address',
                        headerName: '开标地点'
                    }, {
                        field: 'bid_open_primary',
                        headerName: '开标授权人'
                    }, {
                        field: 'bid_security',
                        headerName: '保证金金额',
                        type:'金额'
                    }, {
                        field: 'bid_security_end_date',
                        headerName: '保证金截止时间',
                        type:'日期'
                    }],
                    hcAfterRequest:function(args){
                        return $q.all(determine(args));
                    }
                };
                //继承列表页基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });
                //新增评审指标
                var lines = function () {
                    requestApi.post({
                        classId: 'epm_project_bid_review_head',
                        action: 'search',
                        data: {
                            search_flag : 1
                        }
                    }) .then(function ( response ) {
                        response.epm_project_bid_review_heads.forEach(function(value){
                            var val = {
                                field: value.dictvalue,
                                headerName: value.dictname,
                                col_type:1,
                                type:'是否'
                            };
                            $scope.gridOptions.columnDefs.push(val);
                        });
                        $scope.gridOptions.columnDefs.push({
                            field: 'creator_name',
                            headerName: '创建人'
                        }, {
                            field: 'createtime',
                            headerName: '创建时间',
                            type:'时间'
                        }, {
                            field: 'updator_name',
                            headerName: '修改人'
                        }, {
                            field: 'updatetime',
                            headerName: '修改时间',
                            type:'时间'
                        });
                        if($scope.gridOptions.columnApi){
                            $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                        }


                    });
                }();
                /**
                 * 判断评审指标
                 */
                function determine(args){
                    var promises = [];
                    args.epm_project_bid_review_heads.forEach(function(val){
                        promises.push(requestApi.post({
                            classId: "epm_project_bid_review_head",
                            action: 'select',
                            data: {
                                project_bid_review_head_id: val.project_bid_review_head_id,
                                search_flag:1
                            }
                        }).then(function (data) {
                            $scope.gridOptions.columnDefs.forEach(function(col){
                                if(col.col_type){
                                    data.epm_project_bid_review_lineofepm_project_bid_review_heads.forEach(function(d){
                                        if(d.eligible_type_name == col.headerName){
                                            val[col.field] = d.is_match;
                                        }
                                    })
                                }
                            });
                        }));
                    });
                    return promises;
                }

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: EpmPropjectBidReviewHeadList
        });
    });

