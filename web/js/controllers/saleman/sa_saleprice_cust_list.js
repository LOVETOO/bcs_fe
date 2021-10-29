/**
 * 销售特价
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
                            field: 'customer_code',
                            headerName: '客户编码'
                        }
                        , {
                            field: 'customer_name',
                            headerName: '客户名称'
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
                    hcObjType: 1002,
                    hcBeforeRequest:function (searchObj) {
                        if(searchObj.sqlwhere){
                            searchObj.sqlwhere = searchObj.sqlwhere +" and is_sale_promotion_price = 2"
                        }else{
                            searchObj.sqlwhere = "is_sale_promotion_price = 2"
                        }
                    }
                };

                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                /**
                 * 导入
                 */
                $scope.import = function () {

                };

                /**
                 * 导出
                 */
                $scope.export = function () {

                };


                $scope.toolButtons.downloadImportFormat = {
                    title: '下载导入格式',
                    icon: 'fa fa-download',
                    click: function () {
                        $scope.downloadImportFormat && $scope.downloadImportFormat();
                    }
                };
                $scope.toolButtons.import = {
                    title: '导入',
                    icon: 'glyphicon glyphicon-log-in',
                    click: function () {
                        $scope.import && $scope.import();
                    }
                };
                $scope.toolButtons.export = {
                    title: '导出',
                    icon: 'glyphicon glyphicon-log-out',
                    click: function () {
                        $scope.export && $scope.export();
                    }
                };

                /**
                 * 下载导入格式
                 */
                $scope.downloadImportFormat = function () {
                    var code = 'sa_saleprice_head.export';
                    return requestApi.post('ref_doc', 'search', {
                        code: code
                    })
                        .then(function (response) {
                            if (response.ref_docs.length > 0) {
                                if (response.ref_docs.length === 1)
                                    return response.ref_docs[0];

                                return swalApi.info('此编码【' + code + '】查到多个匹配值');
                            }
                            else
                                return swalApi.info('查无此编码【' + code + '】');
                        })
                        .then(function (ref_doc) {
                            window.open("/downloadfile?docid=" + ref_doc.docid);
                        })
                };

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
