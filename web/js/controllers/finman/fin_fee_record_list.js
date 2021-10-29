/**
 * 费用记录列表页
 * @since 2018-11-02
 */
define(
    ['module', 'controllerApi', 'base_obj_list','requestApi','swalApi', 'openBizObj'],
    function (module, controllerApi, base_obj_list,requestApi,swalApi, openBizObj) {
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
                            field: 'cited_stat',
                            headerName: '状态',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'fee_record_no',
                            headerName: '费用记录单号'
                        }
                        , {
                            field: 'org_name',
                            headerName: '报销部门'
                        }
                        , {
                            field: 'bud_type_name',
                            headerName: '预算类别'
                        }
                        , {
                            field: 'fee_name',
                            headerName: '费用项目名称'
                        }
                        , {
                            field: 'xf_amt',
                            headerName: '金额',
                            type: '金额'
                        }
                        , {
                            field: 'xf_date',
                            headerName: '发生时间',
                            type: '日期'
                        }
                        , {
                            field: 'xf_addr',
                            headerName: '发生地点'
                        }
                        , {
                            field: 'note',
                            headerName: '发生事由'
                        }
                    ],
                    hcObjType: 2280
                };

                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                /**
                 * 复制并新增单据
                 */
                $scope.copyBill = function () {
                    var node = $scope.gridOptions.hcApi.getFocusedNode();

                    if (!node)
                        return swalApi.info('请选中要复制的行');

                    var copyData = $scope.gridOptions.hcApi.getFocusedData();

                    //打开费用记录属性页
                    return openBizObj({
                        stateName: 'finman.fin_fee_record_prop',
                        params: {
                            id: 0,
                            isCopy: true,
                            preItem: JSON.stringify(copyData)
                        }
                    }).result;
                };

                /**
                 * 下载导入格式
                 */
                $scope.downloadImportFormat = function () {
                    var code = 'fin_fee_record.import';
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

                /**
                 * 导入
                 */
                $scope.import = function () {

                };

                $scope.toolButtons.downloadImportFormat.hide = false;
                $scope.toolButtons.import.hide = false;
                $scope.toolButtons.copy.hide = false;


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
