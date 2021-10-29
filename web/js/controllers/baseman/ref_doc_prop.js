/**
 * 引用附件-属性页
 * 2018-11-16
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'fileApi'],
    function (module, controllerApi, base_obj_prop, fileApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', 
            //控制器函数
            function ($scope) {

                /*-------------------数据定义开始------------------------*/
                $scope.data = {};
                
                /*-------------------数据定义结束------------------------*/


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 选择并上传文件
                 */
                $scope.chooseFile = function () {
                    fileApi.uploadFile(false)
                    .then(function (docs) {
                        console.log('返回文件：' +docs[0])
                        $scope.data.currItem.docid = docs[0].docid;
                        $scope.data.currItem.docname = docs[0].docname;
                    })
                };

                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;
                
                $scope.tabs.base.title = '详情';

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



