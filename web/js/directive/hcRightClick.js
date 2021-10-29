/**
 * 右键指令
 */
define(
    ['module', 'directiveApi', 'swalApi', '$q'],
    function (module, directiveApi, swalApi, $q) {

        var directive = [
            '$timeout', '$modal',
            function ($timeout, $modal) {
                return {
                    scope: {
                        hcRightClick: '=hcRightClick'
                    },
                    link: function ($scope, element, attrs) {

                        $(element).off("contextmenu");
                        $(element).contextmenu(function ($event) {
                            $scope.hcRightClick($event);
                            return false;
                        });
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

/*
forEach(
    'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '),
    function(eventName) {
        var directiveName = directiveNormalize('ng-' + eventName);
        ngEventDirectives[directiveName] = ['$parse', '$rootScope', function($parse, $rootScope) {
            return {
                restrict: 'A',
                compile: function($element, attr) {
                    // We expose the powerful $event object on the scope that provides access to the Window,
                    // etc. that isn't protected by the fast paths in $parse.  We explicitly request better
                    // checks at the cost of speed since event handler expressions are not executed as
                    // frequently as regular change detection.
                    var fn = $parse(attr[directiveName], /!* interceptorFn *!/ null, /!* expensiveChecks *!/ true);
                    return function ngEventHandler(scope, element) {
                        element.on(eventName, function(event) {
                            var callback = function() {
                                fn(scope, {$event:event});
                            };
                            if (forceAsyncEvents[eventName] && $rootScope.$$phase) {
                                scope.$evalAsync(callback);
                            } else {
                                scope.$apply(callback);
                            }
                        });
                    };
                }
            };
        }];
    }
);*/
