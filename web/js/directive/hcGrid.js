/**
 * 表格
 * @since 2018-10-02
 */
define(
    ['module', 'directiveApi', 'gridApi', 'directive/hcAutoHeight'],
    function (module, directiveApi, gridApi) {

        /**
         * 指令
         */
        hcGridDirective.$inject = ['$timeout'];
        function hcGridDirective(   $timeout) {
            return {
                link: function hcGridLink($scope, $element, $attrs) {
                    var destoryWatcher = $scope.$watch($attrs.hcGrid, function (gridOptions) {
                        if (!gridOptions) return;

                        destoryWatcher();
                        destoryWatcher = null;

                        gridApi.create($element, gridOptions);

                        $element.trigger('gridReady', {
                            gridOptions: gridOptions
                        });
                    });

                    $timeout(5000).then(function () {
                        if (!destoryWatcher) return;

                        destoryWatcher();
                        destoryWatcher = null;

                        console.error('创建表格失败', '$scope.' + $attrs.hcGrid + '不存在');
                    });
                }
            }
        }

        //使用Api注册指令
        //需传入require模块和指令定义
        return directiveApi.directive({
            module: module,
            directive: hcGridDirective
        });
    }
);