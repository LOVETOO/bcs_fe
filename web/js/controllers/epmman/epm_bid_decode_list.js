/**
 * 招标文件解读
 * 2019/6/6
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        /**
         * 控制器
         */
        var EpmBidDecodeList = [
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
                    },  {
                        field: 'guarantee_amount_type',
                        headerName: '保证金类型',
                        hcDictCode:'epm.guarantee_amount_type'
                    }, {
                        field: 'guarantee_amount',
                        headerName: '保证金',
                        cellStyle: {
                            'text-align': 'right'
                        }
                    }, {
                        field: 'ctrl_price',
                        headerName: '控制价',
                        cellStyle: {
                            'text-align': 'right'
                        }
                    },  {
                        field: 'business_result',
                        headerName: '商务评审结果',
                        hcDictCode:'epm.bid_review_result'
                    }, {
                        field: 'tech_result',
                        headerName: '技术评审结果',
                        hcDictCode:'epm.bid_review_result'
                    }, {
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
            controller: EpmBidDecodeList
        });
    });

