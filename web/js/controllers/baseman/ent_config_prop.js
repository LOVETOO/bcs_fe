 /**
 * 新闻通知属性页
 * @hzj 2019-05-21
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'fileApi', 'promiseApi', 'swalApi', 'requestApi', '$timeout', 'directive/swfUpload','directive/hcRichText'],
    function (module, controllerApi, base_obj_prop, fileApi, promiseApi, swalApi, requestApi, $timeout) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal', '$timeout','$parse',
            //控制器函数


            function ($scope, $modal) {
                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    currItem: {},
                }

                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                $scope.page=[
                    { id: 1, name: "OA", value: "OA" },
                    { id: 2, name: "SAAS", value: "SAAS" }
                ]

                //上传图片
                $scope.uploadFile = function () {
                    fileApi.uploadFile({
                        multiple: false,
                        accept: 'image/*'
                    }).then(function (docs) {
                        $scope.data.currItem.logo_id = docs[0].docid;
                        $(".invoice_div_img").css("height", "58px");
                        $(".invoice_div_img").css("display", "block");
                    });
                }

                //移除图片
                $scope.del_invoice_image = function () {
                    $scope.data.currItem.logo_id = undefined;
                    $(".invoice_div_img").css("display", "none");
                }

                $scope.setOAPage = function () {
                }

                //保存前验证
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);

                }

                /**
                 * 新增时数据、网格默认设置
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                }

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    //图片id
                    if (bizData.logo_id) {
                        //$scope.data.currItem.docid1=$scope.data.currItem.title_img_id
                        $(".invoice_div_img").css("height", "58px");
                    }
                }
                //保存数据
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);

                }
                $scope.doAfterSave = function (bizData) {

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