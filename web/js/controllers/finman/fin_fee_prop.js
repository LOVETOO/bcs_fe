/**
 * 费用项目-属性页
 * 2018-10-27
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                /*-------------------数据定义开始------------------------*/
                $scope.data = {
                    currItem : {}
                };


                //新增时的默认数据设置
                $scope.newBizData = function (bizData) {
                    bizData.creator = strUserId; //创建人
                    bizData.usable = 2; //创建人
                    bizData.apply_type = "2";
                    bizData.stat = 1;//未使用
                };

                /*-------------------数据定义结束------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*-------------------通用查询开始------------------------*/

                //会计科目查询
                $scope.commonSearchSettingOfAccountSubject = {
                    //无票应付科目
                    sqlWhere: " end_km = 2 ",
                    afterOk: function (result) {
                        $scope.data.currItem.subject_id = result.gl_account_subject_id;
                        $scope.data.currItem.subject_no = result.km_code;
                        $scope.data.currItem.subject_name = result.km_name;
                    }
                }

                /*-------------------通用查询结束---------------------*/

                /*---------------------事件开始-------------------------*/
                /*
                 * “科目”相关的按钮[x]点击后触发事件。
                 * @param suffix : 后缀名称
                 * */
                $scope.clearSubjectAfterDelete = function () {
                    $scope.data.currItem.subject_no = '';
                    $scope.data.currItem.subject_name = '';
                    $scope.data.currItem.subject_id = '';
                }
                /*---------------------事件 结束-------------------------*/

                //修改标签页标题
                $scope.tabs.base.title = '费用项目';

            }
        ];

        //使用控制器Api注册控制器 2018-12-7
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);