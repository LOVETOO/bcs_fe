/**
 * 裁剪图片modal
 * @since 2018-12-28 qch
 */
define(
    ['module', 'directiveApi', 'swalApi', 'openBizObj', '$q', 'plugins/cropperjs/cropper','directive/hcCropper'],
    function (module, directiveApi, swalApi, openBizObj, $q, Cropper,hcCropper) {
        top.require(['directive/hcCropper']);

        //定义指令
        var directive = [
            '$timeout', '$modal',
            function ($timeout, $modal) {
                return {
                    scope: {
                        hcCropperModal: '=hcCropperModal'
                    },
                    link: function ($scope, element, attrs) {
                        /**
                         * src默认显示的图片路径 str
                         */
                        $scope.src = '';

                        /**
                         * hcCropper配置
                         * @param hcCropper ={
                         *   option  :  obj       cropper配置,没有则使用默认配置
                         *   reData  :  function  在形参中返回结果
                         *   title   :  str       标题
                         * }
                         */
                        console.log("hc-cropper-modal:",$scope.hcCropperModal);

                        if ($scope.hcCropperModal.reData == undefined) {
                            return swalApi.info("hc-cropper:请配置reData方法")
                        }
                        if (typeof $scope.hcCropperModal.reData != 'function') {
                            return swalApi.info("hc-cropper:reData类型需为function")
                        }

                        /**
                         * 绑定点击事件
                         */
                        $(element).click(function () {
                            $scope.openModal();
                        });

                        /**
                         * 打开模态窗
                         */
                        $scope.openModal = function () {
                            $scope.src = $(element).attr('src');
                            $modal.open({
                                templateUrl: directiveApi.getTemplateUrl(module),
                                controller: $scope.cropperController,
                                scope: $scope,
                                resolve: {
                                    $parent: function () {
                                        return $scope;
                                    }
                                }
                            }).result.then(function (result) {
                                $scope.hcCropperModal.reData(result);
                            });
                        };

                        /**
                         * 模态框控制器
                         */
                        $scope.cropperController = function ($scope, $parent, $timeout) {

                            $scope.data = {};
                            $scope.data.src = $parent.src;
                            $scope.data.option={};
                            $scope.file = {};

                            /*=========================初始化配置==========================*/
                            /**
                             * 模态框配置
                             */
                            $scope.title = '裁剪图片';
                            if ($parent && $parent.hcCropperModal && $parent.hcCropperModal.title != undefined) {
                                $scope.title = $parent.hcCropperModal.title;
                            }
                            $scope.footerRightButtons.rightTest = {
                                title: '确定',
                                click: function () {
                                    $scope.getCropper()
                                }
                            };
                            $scope.width = 640;

                            /**
                             * 插件配置
                             */
                            $scope.data.option = {};
                            if ($parent.hcCropperModal && $parent.hcCropperModal.option) {
                                $scope.data.option = $parent.hcCropperModal.option;
                            }


                            /**
                             * 初始化
                             */
                            $scope.doInit = function () {
                                // $scope.$dom = $('#hcCropperModal', parent.document);
                                // $scope.$dom.cropper($scope.data.option);
                            };


                            /*=========================确定==========================*/
                            /**
                             * 获取裁剪文件
                             */
                            $scope.getCropper = function () {
                                $scope.data.option.$dom.cropper('getCroppedCanvas', {
                                    maxWidth: 768,
                                    maxHeight: 768
                                })
                                    .toBlob(function (blob) {
                                        $scope.$close(blob);
                                    })
                            };


                            /*=========================事件==========================*/
                            /**
                             * 缩放
                             */
                            $scope.zoom = function (num) {
                                $scope.data.option.$dom.cropper('zoom', num);
                            };

                            /**
                             * 设置拖拽模式
                             * 默认/移动/裁剪  'none'，'crop'，'move'
                             * 可以通过双击裁剪器来切换“裁剪”和“移动”模式。
                             */
                            $scope.setDragMode = function (str) {
                                $scope.data.option.$dom.cropper('setDragMode', str);
                            };

                            /**
                             * 移动画布
                             * @param x
                             * @param y
                             */
                            $scope.move = function (x, y) {
                                $scope.data.option.$dom.cropper('move', x, y);
                            };

                            /**
                             * 旋转
                             * @param degree
                             */
                            $scope.rotate = function (degree) {
                                $scope.data.option.$dom.cropper('rotate', degree);
                            };

                            /**
                             * 翻转
                             */
                            $scope.scale = function (x, y) {
                                $scope.data.option.$dom.cropper('scale', x, y);
                            };

                            /**
                             * 裁剪
                             */
                            $scope.crop = function () {
                                $scope.data.option.$dom.cropper('crop');
                            };

                            /**
                             * 清除
                             */
                            $scope.clear = function () {
                                $scope.data.option.$dom.cropper('clear');
                            };

                            /**
                             * 禁用
                             */
                            $scope.disable = function () {
                                $scope.data.option.$dom.cropper('disable');
                            };

                            /**
                             * 启用
                             */
                            $scope.enable = function () {
                                $scope.data.option.$dom.cropper('enable');
                            };

                            /**
                             * 重启
                             */
                            $scope.reset = function () {
                                $scope.data.option.$dom.cropper('reset');
                            };

                            /**
                             * 破坏
                             */
                            $scope.destroy = function () {
                                $scope.data.option.$dom.cropper('destroy');
                            };

                            /**
                             * 上传图片
                             */
                            function fileChange(e) {
                                $scope.file = e.target.files[0];
                                $scope.data.option.$dom.cropper('replace', URL.createObjectURL($scope.file));
                                e.target.value = '';
                            }

                            $timeout(function () {
                                $('#inputImage', parent.document).change(function (event) {
                                    fileChange(event);
                                });
                            },500);
                        };

                    }
                }
            }
        ];

        //使用Api注册指令
        //需传入require模块和指令定义
        return directiveApi.directive({
            module: module,
            directive: directive
        });
    }
);