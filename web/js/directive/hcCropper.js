/**
 * 裁剪图片
 * @since 2019-01-28 qch
 */
define(
    ['module', 'directiveApi', '$q', 'plugins/cropperjs/cropper', 'plugins/cropperjs/canvas-to-blob'],
    function (module, directiveApi, $q, Cropper, canvasToBlob) {
        //定义指令
        var directive = [
            '$timeout', '$modal',
            function ($timeout, $modal) {
                return {
                    scope: {
                        option: '=hcCropper'
                    },
                    link: function ($scope, element, attrs) {
                        console.log("hc-cropper:", $scope.option);
                        $timeout(function () {
                            element.cropper($scope.option);
                            $scope.option.$dom = element;
                        })
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