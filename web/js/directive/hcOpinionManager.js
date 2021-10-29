/**
 * 流程意见管理器
 * @since 2019-11-07
 */
define(['module', 'directiveApi', 'jquery', 'angular', 'requestApi', 'swalApi'], function (module, directiveApi, $, angular, requestApi, swalApi) {

    function hcOpinionManagerDirective() {
        return {
            restrict: 'E',
            scope: {
                opinionContent: '=hcOpinionContent'
            },
            templateUrl: directiveApi.getTemplateUrl(module),
            controller: HcOpinionManagerController
        };
    }

    HcOpinionManagerController.$inject = ['$scope', '$modal'];
    function HcOpinionManagerController(   $scope,   $modal) {
        $scope.opinions = [];

        requestApi
            .post({
                classId: 'scpopinion'
            })
            .then(function (response) {
                $scope.opinions = response.scpopinions;
            });

        /**
         * 保存意见
         */
        $scope.saveOpinion = function (opinionContent) {
            return requestApi
                .post({
                    classId: 'scpopinion',
                    action: 'save',
                    data: {
                        opinion_content: opinionContent
                    }
                })
                .then(function (opinion) {
                    if (!$scope.opinions.find(function (x) {
                        return x.opinion_id == opinion.opinion_id;
                    })) {
                        $scope.opinions.unshift(opinion);

                        if (opinion.opinion_content == $scope.opinionContent) {
                            $scope.visibleOfSaveCurrentOpinion = false;
                        }
                    }
                });
        };

        /**
         * 添加意见
         */
        $scope.addOpinion = function () {
            return $modal
                .open({
                    title: '请输入意见',
                    template: '<div hc-box><div hc-input="opinionContent" hc-type="textarea" hc-required="true" hc-col-count="8" hc-row="6"></div></div>',
                    controller: ['$scope', function ($scope) {
                        angular.extend($scope.footerRightButtons.ok, {
                            hide: false,
                            disabled: function () {
                                return $scope.modalForm.$invalid;
                            },
                            click: function () {
                                $scope.$close($scope.opinionContent);
                            }
                        });

                        setTimeout(function () {
                            $('[hc-input="opinionContent"] textarea').focus();
                        }, 100);
                    }]
                })
                .result
                .then($scope.saveOpinion);
        };

        /**
         * 删除意见
         */
        $scope.deleteOpinion = function (opinion) {
            return swalApi
                .confirm('确定要删除此意见吗？')
                .then(function () {
                    return requestApi.post({
                        classId: 'scpopinion',
                        action: 'delete',
                        data: opinion
                    });
                })
                .then(function () {
                    $scope.opinions.remove(opinion);

                    if (opinion.opinion_content == $scope.opinionContent && $scope.opinionContent !== '同意！') {
                        $scope.visibleOfSaveCurrentOpinion = true;
                    }
                });
        };

        $scope.$watch('opinionContent', function (opinionContent) {
            if (opinionContent) {
                if (opinionContent === '同意！') {
                    $scope.visibleOfSaveCurrentOpinion = false;
                }
                else {
                    $scope.visibleOfSaveCurrentOpinion = $scope.opinions.every(function (opinion) {
                        return opinion.opinion_content != opinionContent;
                    });
                }
            }
            else {
                $scope.visibleOfSaveCurrentOpinion = false;
            }
        });
    }

    //使用Api注册指令
    //需传入require模块和指令定义
    return directiveApi.directive({
        module: module,
        directive: hcOpinionManagerDirective
    });
});