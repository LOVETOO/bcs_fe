/**
 * 引用附件列表页
 * @since 2018-11-16
 */
define(
    ['module', 'controllerApi', 'base_obj_list','swalApi'],
    function (module, controllerApi, base_obj_list, swalApi) {
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
                        , {
                            field: 'code',
                            headerName: '引用编码'
                        }
                        , {
                            field: 'docname',
                            headerName: '文件名称'
                        }
                        , {
                            field: 'note',
                            headerName: '备注'
                        }
                    ],
                    hcObjType: 181116
                };

                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                $scope.toolButtons.download = {
                    title: '下载',
                    icon: 'fa fa-download',
                    click: function () {
                        var row = $scope.gridOptions.hcApi.getFocusedNode();
                        if(!row){
                            return swalApi.info('请选中要下载的行');
                        }

                        window.open('/downloadfile?docid=' + row.data.docid);
                    }
                }
                
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
