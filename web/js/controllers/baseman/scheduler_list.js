/**
 * 调度管理
 * 2018-10-25 modify by wzf
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
                            field: "schedulername",
                            headerName: "调度名称"
                        },
                        {
                            field: "autorun",
                            headerName: "自动运行",
                            type: '是否'
                        },
                        {
                            field: "runinterval",
                            headerName: "间隔时间"
                        },
                        {
                            field: "intervalunit",
                            headerName: "间隔单位",
                            type: '词汇',
                            cellEditorParams: {
                                names: ['分钟', '小时', '天', '月'],
                                values: [1, 2, 3, 4]
                            }
                        },
                        {
                            field: "nexttime",
                            headerName: "开始/下次运行时间"
                        },
                        {
                            field: "lasttime",
                            headerName: "上次运行时间"
                        },
                        {
                            field: "totalcount",
                            headerName: "已经运行次数"
                        },
                        {
                            field: "maxcount",
                            headerName: "最大运行次数"
                        },
                        {
                            field: "aheaddays",
                            headerName: "月末提前执行天数"
                        },
                        {
                            field: "pausetime",
                            headerName: "暂停时间"
                        },
                        {
                            field: "resumetime",
                            headerName: "重新开始时间"
                        },
                        {
                            field: "noticeuser",
                            headerName: "运行失败时通知用户"
                        },
                        {
                            field: "serverid",
                            headerName: "服务器ID"
                        },
                        {
                            field: "param1",
                            headerName: "参数1"
                        },
                        {
                            field: "param2",
                            headerName: "参数2"
                        },
                        {
                            field: "param3",
                            headerName: "参数3"
                        },
                        {
                            headerName: "说明",
                            field: "note",
                            width: 180
                        }],
                    hcObjType: -2
                };


                //基类继承
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