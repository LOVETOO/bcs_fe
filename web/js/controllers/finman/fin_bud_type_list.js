/**
 * 预算类别 - 对象列表页
 * 2018-10-29
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
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
                            field: 'bud_type_code',
                            headerName: '预算类别编码',
                            type: "string",
                            width: 100,
                            pinned: 'left'
                        }
                        , {
                            field: 'bud_type_name',
                            headerName: '预算类别名称',
                            type: "string",
                            pinned: 'left'
                        }
                        , {
                            field: 'fee_type_code',
                            headerName: '费用大类编码',
                            pinned: 'left'
                        }
                        , {
                            field: 'fee_type_name',
                            headerName: '费用项目名称',
                            pinned: 'left'
                        }
                        , {
                            field: 'fee_type_level',
                            headerName: '费用项目层级',
                            hcDictCode: "fee_type_level",
                            type: "list",
                            pinned: 'left'
                        }
                        , {
                            field: 'period_type',
                            headerName: '预算期间类别',
                            hcDictCode: "period_type",
                            type: "list",
                            pinned: 'left'
                        }
                        , {
                            field: 'feenames',
                            headerName: '包含费用项目',
                        }
                        , {
                            field: 'description',
                            headerName: '描述',
                        }
                        , {
                            field: 'is_control_bud',
                            headerName: '受预算控制',
                            type: '是否'
                        }, {
                            field: 'fee_property',
                            headerName: '费用类型',
                            type: '词汇',
                            cellEditorParams: {
                                names: ['变动费用', '固定费用'],
                                values: [1, 2]
                            }
                        }, {
                            field: 'control_type',
                            headerName: '预算释放方式',
                            hcDictCode: 'fin_bud_control_types'
                        }
                    ],
                    hcObjType: 1810291,
                    hcBeforeRequest:function(searchObj){
                        searchObj.fin_bud_type_kind = 1
                    }
                };

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
            controller: controller
        });
    }
);