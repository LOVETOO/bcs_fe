/**
 * 投资项目类型-列表页
 * date:2018-11-26
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {
                /**数据定义 */
                $scope.data = {};
                $scope.data.currItem = {};
                /**通用查询 */
                $scope.getSubject = function () {
                    $modal.openCommonSearch({
                            classId: 'gl_account_subject',
                            postData: {},
                            action: 'search',
                            title: "会计科目",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "会计科目编码",
                                    field: "km_code",
                                    width: 60,
                                    height: 80
                                }, {
                                    headerName: "会计科目名称",
                                    field: "km_name",
                                    width: 150,
                                    height: 80
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.subject_no = result.km_code;
                            $scope.data.currItem.subject_name = result.km_name;
                        });
                }
                /**继承主控制器 */
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                //更改标题
                $scope.tabs.base.title = "投资项目";
                //隐藏标签
                $scope.tabs.attach.hide = true;
                $scope.tabs.wf.hide = true;
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