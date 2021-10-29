/**
 * 按钮组
 * @since 2018-12-07
 */
define([
    'module', 'directiveApi', 'angular', 'directive/hcButton'
], function (module, directiveApi, angular) {
    'use strict';

    /**
     * 指令
     */
    function hcButtonsDirective() {
        return {
            templateUrl: directiveApi.getTemplateUrl(module),
            scope: {
                getButtons: '&hcButtons',
                getButtonsSortBy: '&hcButtonsSortBy',
                getGroups: '&hcBtnGroups',
                defaultGroupId: '@hcBtnDefaultGroup'
            },
            compile: hcButtonsCompile,
            controller: HcButtonsController
        };
    }

    /**
     * 编译
     */
    function hcButtonsCompile(tElement, tAttrs) {
        if (angular.isString(tAttrs.hcButtonsPullLeft))
            tElement.addClass('pull-left');
        else if (angular.isString(tAttrs.hcButtonsPullRight))
            tElement.addClass('pull-right');
        tElement.css('display', 'inline-block');
    }

    /**
     * 控制器
     */
    HcButtonsController.$inject = ['$scope', '$attrs'];

    function HcButtonsController($scope, $attrs) {

        $scope.pullLeft = angular.isString($attrs.hcButtonsPullLeft);
        $scope.pullRight = angular.isString($attrs.hcButtonsPullRight);

        var getGroups = $scope.getGroups;
        var getButtons = $scope.getButtons;

        $scope.getGroups = (function () {
            var actualGroups = {};

            return function () {
                clearProp(actualGroups);

                var groups = getGroups.apply(this) || {};

                var groupIds = Object.keys(groups);

                var buttons = getButtons.apply(this) || {};

                var buttonIds = Object.keys(buttons);

                if (angular.isString($attrs.hcButtonsPullRight)) {
                    groupIds.reverse();
                    buttonIds.reverse();
                }

                buttonIds.forEach(function (buttonId) {
                    var button = buttons[buttonId];
                    var groupId;

                    if (button.groupId)
                        groupId = button.groupId;
                    else
                        button.groupId = groupId = $scope.defaultGroupId || 'group_' + buttonId;

                    if (!(groupId in groups))
                        groupIds.push(groupId);
                });

                groupIds.forEach(function (groupId) {
                    actualGroups[groupId] = groups[groupId];
                });

                return actualGroups;
            };
        })();

        $scope.getButtons = (function () {
            var groupMapButtons = {};

            return function (params) {
                var groupId = params.groupId;
                var group = params.group || {};

                var buttons = getButtons.apply($scope) || {};

                var actualButtons = groupMapButtons[groupId] || (groupMapButtons[groupId] = {});

                clearProp(actualButtons);

                if (buttons) {
                    var buttonIds = Object.keys(buttons).filter(function (buttonId) {
                        return buttons[buttonId].groupId === groupId;
                    });

                    var buttonsSortBy = $scope.getButtonsSortBy();
                    if (angular.isFunction(buttonsSortBy))
                        buttonIds.sort(buttonsSortBy);

                    if (group.type !== 'dropdown' && angular.isString($attrs.hcButtonsPullRight))
                        buttonIds.reverse();

                    buttonIds.forEach(function (buttonId) {
                        actualButtons[buttonId] = buttons[buttonId];
                    });
                }

                return actualButtons;
            };
        })();

        $scope.isButtonNeedHide = isButtonNeedHide;

        /**
         * 是否隐藏按钮
         * @param params = {
		 *     id: 按钮ID - string
		 *     button: 按钮定义 - object
		 * }
         * @return {boolean}
         */
        function isButtonNeedHide(params) {
            var hide = params.button.hide;

            if (hide === true)
                return true;

            if (angular.isFunction(hide))
                return hide(params);

            return false;
        }

        $scope.isButtonDisabled = isButtonDisabled;

        /**
         * 是否禁用按钮
         * @param params = {
		 *     id: 按钮ID - string
		 *     button: 按钮定义 - object
		 * }
         * @return {boolean}
         */
        function isButtonDisabled(params) {
            var disabled = params.button.disabled;

            if (disabled === true)
                return true;

            if (angular.isFunction(disabled))
                return disabled(params);

            return false;
        }

        $scope.getButtonTitle = getButtonTitle;

        /**
         * 返回按钮显示名称
         * @param params = {
		 *     id: 按钮ID - string
		 *     button: 按钮定义 - object
		 * }
         * @return {string}
         */
        function getButtonTitle(params) {
            var title = params.button.title;

            if (angular.isFunction(title))
                return title(params);

            return title;
		}
		
		$scope.getButtonIcon = getButtonIcon;

        /**
         * 返回按钮图标
         * @param params = {
		 *     id: 按钮ID - string
		 *     button: 按钮定义 - object
		 * }
         * @return {string}
         */
		function getButtonIcon(params) {
			var icon = params.button.icon;

			if (angular.isFunction(icon))
				return icon(params);

			return icon;
		}

        $scope.groupClick = groupClick;

        /**
         *
         * @param params
         */
        function groupClick(params) {
            if (params.group.click) {
                params.event.stopPropagation();

                if (angular.isString(params.group.click)) {
                    var id = params.group.click,
                        button = getButtons()[id];

                    return button && button.click({
                        id: id,
                        button: button,
                        event: params.event
                    });
                }

                return params.group.click(params);
            }
        }


    }

    function clearProp(obj) {
        Object.keys(obj).forEach(function (key) {
            delete obj[key];
        });
    }

    //使用Api注册指令
    //需传入require模块和指令定义
    return directiveApi.directive({
        module: module,
        directive: hcButtonsDirective
    });
});