/**
 * 工程项目报价
 * 2019/6/19
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'requestApi', 'swalApi', '$q'],
    function (module, controllerApi, base_obj_list, requestApi, swalApi, $q) {
        'use strict';
        /**
         * 控制器
         */
        var EpmPdtQuotedPriceList = [
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
                        field: 'project_code',
                        headerName: '项目编码'
                    }, {
                        field: 'project_name',
                        headerName: '项目名称'
                    },  {
                        field: 'quoted_person',
                        headerName: '报价人'
                    }, {
                        field: 'quoted_date',
                        headerName: '报价日期',
                        type:'日期'
                    }, {
                        field: 'quoted_times',
                        headerName: '项目报价次数',
                        type:'数量'
                    }, {
                        field: 'trading_company_name',
                        headerName: '报价单位'
                    }, {
                        field: 'quoted_type',
                        headerName: '报价类型',
                        hcDictCode: 'epm.quoted_type'
                    }, {
                        field: 'tax_included',
                        headerName: '价格含税',
                        type : '是否'
                    }, {
                        field: 'freight_included',
                        headerName: '价格含运费',
                        type : '是否'
                    }, {
                        field: 'valid_time_limit',
                        headerName: '报价有效期',
                        hcDictCode: 'epm.quoted.valid_time_limit'
                    }, {
                        field: 'remark',
                        headerName: '备注'
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


                $scope.copy = function () {
                    return $q
                        .when()
                        .then(function () {
                            return requestApi
                                .post({
                                    classId: "epm_pdt_quoted_price",
                                    action: 'search',
                                    data: {
                                        sqlwhere : "project_id = " + $scope.currItem.project_id + "and  stat <> 5"
                                    }
                                })
                                .then(function (data) {
                                    if(data.epm_pdt_quoted_prices.length>0){
                                        swalApi.info('该项目存在未审核完毕的报价单【'+data.epm_pdt_quoted_prices[0].project_code+'】，请检查。');
                                        return $q.reject();
                                    }
                                })
                                .then($scope.hcSuper.copy);
                        })

                };

                $scope.toolButtons.copy.hide = function () {
                    return !$scope.$eval('currItem.stat == 5');
                };
                $scope.toolButtons.print.hide = true;

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: EpmPdtQuotedPriceList
        });
    });

