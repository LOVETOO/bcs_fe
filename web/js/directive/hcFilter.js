/**
 * 过滤器组件
 * @since 2018-12-17
 */
(function (defineFn) {
	define(['module', 'directiveApi', 'angular'], defineFn);
})(function (module, directiveApi, angular) {

	/**
	 * 指令
	 */
	function hcFilterDirective() {
		return {
			scope: {
				getSetting: '&hcFilter'
			},
			templateUrl: directiveApi.getTemplateUrl(module),
			controller: HcFilterController,
			link: hcFilterLink
		};
	}

	/**
	 * 控制器
	 */
	HcFilterController.$inject = ['$scope'];
	function HcFilterController($scope) {
		var filterController = this;

		$scope.setting = $scope.getSetting();
		$scope.setting.controller = filterController;

		angular.forEach($scope.setting.filters, function (filter) {
			filter.options.push({
				name: '全部',
				value: '',
				active: filter.options.every(function (option) {
					return !option.active;
				}),
				isAll: true
			});
		});

		$scope.filterClick = function (params) {
			if (params.option.active) return;

			params.filter.options.forEach(function (option) {
				option.active = option === params.option;
			});

			(function () {
				var onChange = $scope.setting.onChange;
				if (angular.isFunction(onChange))
					onChange.call(null, angular.extend({}, params, {
						controller: filterController
					}));
			})();
		};

		/**
		 * 返回查询条件
		 * @returns {string}
		 */
		filterController.getSqlWhere = function () {
			var filterWheres = [];

			angular.forEach($scope.setting.filters, function (filter, filterId) {
				var activeOption = filter.options.find(function (option, index) {
					return !option.isAll && option.active;
				});

				if (!activeOption) return;

				var where;
				if (angular.isNumber(activeOption.value))
					where = filterId + ' = ' + activeOption.value;
				else
					where = filterId + ' = ' + "'" + activeOption.value + "'";

				filterWheres.push(where);
			});

			if (filterWheres.length === 0)
				return '1 = 1';

			if (filterWheres.length === 1)
				return filterWheres[0];

			return '(' + filterWheres.reduce(result, function (where) {
				return ') and (' + where;
			}) + ')';
		};

		/**
		 * 返回指定过滤器的激活项
		 * @returns { { name: string, value: string|number } }
		 */
		filterController.getActiveOption = function (filterId) {
			var filter = $scope.setting.filters[filterId];

			if (!filter) {
				console.error('过滤器【%s】不存在', filterId);
				return null;
			}

			return filter.options.find(function (option) {
				return option.active;
			});
		};
	}

	/**
	 * 连接函数
	 */
	function hcFilterLink($scope, $element) {
		$element.addClass('hc-filter');
	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcFilterDirective
	});
});