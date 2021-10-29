/**
 * 客户授信终止 sa_confer_believe_stop_list
 *  * 2018-12-28 zhl
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'fileApi', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_diy_page, fileApi, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                //网格定义
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号',
                        headerCheckboxSelection: true,
                        headerCheckboxSelectionFilteredOnly: true,
                        checkboxSelection: true,
                        width: 100
                    }, {
                        field: 'is_cancellation',
                        headerName: '作废',
                        type: '是否'
                    }, {
                        field: 'bill_no',
                        headerName: '授信单号'
                    }, {
                        field: 'bill_date',
                        headerName: '单据日期',
                        type: '日期'
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode: 'stat'
                    }, {
                        field: 'customer_code',
                        headerName: '客户编码'
                    }, {
                        field: 'customer_name',
                        headerName: '客户名称'
                    }, {
                        field: 'amount',
                        headerName: '授信额度',
                        type: '金额'
                    }, {
                        field: 'star_date',
                        headerName: '生效日期',
                        type: '日期'
                    }, {
                        field: 'end_date',
                        headerName: '失效日期',
                        type: '日期'
                    }, {
                        field: 'fact_return_date',
                        headerName: '承诺还款日期',
                        type: '日期'
                    }, {
                        field: 'employee_name',
                        headerName: '责任人'
                    }, {
                        field: 'crm_entid',
                        headerName: '授信品类',
                        hcDictCode: 'crm_entid'
                    }, {
                        field: 'cnsx',
                        headerName: '承诺事项'
                    }, {
                        field: 'floor_type',
                        headerName: '授信类型',
                        hcDictCode: 'saleman.floor_type'
                    }, {
                        field: 'unknown',
                        headerName: '客户单号'
                    }, {
                        field: 'remark',
                        headerName: '备注'
                    }, {
                        field: 'created_by',
                        headerName: '创建人'
                    }, {
                        field: 'creation_date',
                        headerName: '创建日期',
                        type: '日期'
                    }],
                    hcObjType: 18122801,
                    hcBeforeRequest: function (searchObj) {
                        searchObj.search_flag = 1;
                    }
                };

                //继承基础控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /*-----------------按钮定义及相关函数 开始----------------------*/

                /*
                 * 保存
                 * */
                $scope.toolButtons.save = {
                    title: '作废',
                    //icon: 'fa fa-save',
                    click: function () {
                        $scope.cancel && $scope.cancel();
                    }
                };

                /**
                 *筛选
                 */
                $scope.toolButtons.search = {
                    title: '筛选',
                    icon: 'fa fa-filter',
                    click: function () {
                        $scope.search && $scope.search();
                    }
                }

                $scope.cancel = function () {
                    //批量作废
                    var selectRows = $scope.gridOptions.api.getSelectedRows();
                    var len = selectRows.length;

                    if (len == 0) {
                        return swalApi.info('请选择要作废的授信申请');
                    }

                    return swalApi.confirmThenSuccess({
                        title: "确定要作废吗?",

                        okFun: function () {
                            var idMutiple = '';
                            for (var i = 0; i < len; i++) {
                                if (i < len - 1)
                                    idMutiple += selectRows[i].sa_confer_believe_id + ',';
                                else
                                    idMutiple += selectRows[i].sa_confer_believe_id;
                            }

                            var postdata = {
                                sqlwhere: idMutiple
                            };
                            //函数区域
                            requestApi.post("sa_confer_believe", "cancel", postdata).then(function () {
                                $scope.gridOptions.hcApi.search();
                            });
                        },
                        okTitle: '作废成功'
                    });
                };

                //查询
                $scope.search = function () {
                    //用表格产生条件，并筛选
                    return $scope.gridOptions.hcApi.searchByGrid();
                };

                //刷新
                $scope.refresh = function () {
                    //刷新即是用上此的查询条件再查询一次
                    return $scope.gridOptions.hcApi.search();
                };

                /*-----------------按钮定义及相关函数 结束----------------------*/

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

