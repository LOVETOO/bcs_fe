/**
 * 销售价格
 * @since 2018-11-02
 */
define(
    ['module', 'controllerApi', 'base_obj_list','requestApi','swalApi', 'openBizObj', 'fileApi'],
    function (module, controllerApi, base_obj_list,requestApi,swalApi, openBizObj, fileApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        ,{
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'saleorder_no',
                            headerName: '价格单号'
                        }
                        , {
                            field: 'start_date',
                            headerName: '生效日期',
                            type:'日期'
                        },
                        {
                            field: 'end_date',
                            headerName: '失效日期',
                            type:'日期'
                        },
                        {
                            field: 'saleprice_type_code',
                            headerName: '价格类型编码'
                        }
                        , {
                            field: 'saleprice_type_name',
                            headerName: '价格类型名称'
                        }, {
                            field: 'is_cancellation',
                            headerName: '作废',
                            type:"是否"
                        }
                        , {
                            field: 'creator',
                            headerName: '创建人'
                        }
                        , {
                            field: 'create_time',
                            headerName: '创建时间',
                            type:'时间'
                        }
                        , {
                            field: 'note',
                            headerName: '备注'
                        }

                    ],
                    hcObjType: 1001,
                    hcBeforeRequest:function (searchObj) {
                        if(searchObj.sqlwhere){
                            searchObj.sqlwhere = searchObj.sqlwhere +" and is_sale_promotion_price = 1"
                        }else{
                            searchObj.sqlwhere = "is_sale_promotion_price = 1"
                        }

                    }
                };

                controllerApi.run({
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
