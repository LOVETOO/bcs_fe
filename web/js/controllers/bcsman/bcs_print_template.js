define(
    ['module', 'controllerApi', 'fileApi', 'lodop', 'base_edit_list', 'jquery', 'angular', 'requestApi', 'constant', 'specialProperty', 'openBizObj', 'directive/hcObjProp'],
    function (module, controllerApi, fileApi, lodop, base_edit_list, $, angular, requestApi, constant, specialProperty, openBizObj) {
        // 'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                /**数据定义 */
                $scope.data = {};
                $scope.data.currItem = {};

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'temp_name',
                            headerName: '模板名称',
                        }, {
                            field: 'temp_desc',
                            headerName: '模板描述',
                        }, {
                            field: 'print_software',
                            headerName: '打印软件',
                            hcDictCode: 'print_software'
                        }, {
                            field: 'creator',
                            headerName: '创建人',
                        }, {
                            field: 'createtime',
                            headerName: '创建时间',
                        }, {
                            field: 'updator',
                            headerName: '更新人',
                        }, {
                            field: 'updatetime',
                            headerName: '更新时间',
                        }
                    ]
                };

                $scope.getPrint = function () {
                    var LODOP = getLodop();
                    eval($scope.data.currItem.temp_content);
                    if (LODOP.CVERSION) CLODOP.On_Return = function (TaskID, Value) {
                        var index = Value.indexOf('\n')
                        Value = Value.substring(index + 1, Value.length);
                        $scope.data.currItem.temp_content = Value;
                    };
                    LODOP.PRINT_DESIGN();
                }

                $scope.chooseFile = function () {
                    fileApi.uploadFile({
                        multiple: false
                    }).then(function (docs) {
                        $scope.data.currItem.docid = docs[0].docid;
                        $scope.data.currItem.filename = docs[0].docname
                    });
                }

                $scope.downLoadFile = function () {
                    fileApi.downloadFile($scope.data.currItem.docid);
                }

                controllerApi.extend({
                    controller: base_edit_list.controller,
                    scope: $scope
                });
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
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