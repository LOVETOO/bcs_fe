/**
 * 历史销售数据
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
                            field: 'feedata_no',
                            headerName: '单据编号'
                        }
                        , {
                            field: 'fee_year',
                            headerName: '编制年度'
                        },
                        {
                            field: 'total_lyear_fee_amt',
                            headerName: '去年累计费用金额',
                            type:"金额"
                        },
                        {
                            field: 'total_tyear_fee_amt',
                            headerName: '本年累计费用金额',
                            type:"金额"
                        }
                        , {
                            field: 'create_time',
                            headerName: '创建时间',
                            type:"日期"
                        }
                        , {
                            field: 'creator',
                            headerName: '创建人'
                        }
                        , {
                            field: 'update_time',
                            headerName: '修改时间',
                            type: '日期'
                        }
                        , {
                            field: 'updator',
                            headerName: '修改人'
                        }
                    ],
                    hcObjType: 181127
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

                /**
                 * 确认
                 */
                $scope.confirm_state = function () {

                    var node = $scope.gridOptions.hcApi.getFocusedNode();
                    if (!node)
                        return swalApi.info('请先选中要审核的行').then($q.reject);

                    var title = '确定要审核该记录吗？';
                    (function () {
                        var field = $scope.data.codeField || $scope.data.nameField;
                        if (!field) return;

                        var headerName = $scope.$eval('gridOptions.columnApi.getColumn(field).colDef.headerName', {
                            field: field
                        });

                        if (!headerName) return;

                        var value = node.data[$scope.data.codeField];
                        if (!value) return;

                        title = '确定要审核"' + headerName + '"为"' + value + '"的记录吗？';
                    })();

                    return swalApi.confirmThenSuccess({
                        title: title,
                        okFun: function () {
                            var postData = {
                                classId: "fin_feedata_head",
                                action: 'confirm_state',
                                data: {}
                            };
                            postData.data[$scope.data.idField] = node.data[$scope.data.idField];

                            return requestApi.post(postData)
                                .then(function () {
                                    node.data.stat = 5;
                                    $scope.gridOptions.api.refreshView();
                                });
                        },
                        okTitle: '审核成功'
                    });
                }

                // $scope.toolButtons.confirm = {
                //     title: '审核',
                //     icon: 'glyphicon glyphicon-ok',
                //     click: function () {
                //         $scope.confirm_state && $scope.confirm_state();
                //     }
                // };

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
                    var code = 'fin_feedata_head.import';
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
