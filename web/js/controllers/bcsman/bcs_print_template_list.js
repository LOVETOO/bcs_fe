/**
 * 巫奕海
 * 2019-12-25
 * 工单查询列表
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        /**
         * 控制器
         */
        var bcs_mo = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'temp_name',
                            headerName: '模板名称',
                        }, {
                            field: 'temp_desc',
                            headerName: '模板描述'
                        },
                        //  {
                        //     field: 'print_software',
                        //     headerName: '打印软件',
                        //     hcDictCode: 'print_software'
                        // },
                        {
                            field: 'inneruse',
                            headerName: '内部可用',
                            type: '是否'
                        }
                        , {
                            field: 'outeruse',
                            headerName: '外部可用',
                            type: '是否'
                        },
                        {
                            field: 'width',
                            headerName: '模板宽度(mm)',
                            type: "数量"
                        }
                        , {
                            field: 'height',
                            headerName: '模板长度(mm)',
                            type: "数量"
                        },
                        {
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
            controller: bcs_mo
        });
    });

