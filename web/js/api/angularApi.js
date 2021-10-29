/**
 * AnuglarJS 相关Api
 * @since 2018-11-22
 */
define(
	['exports'],
	function (api) {

		/**
		 * 执行表达式并触发脏值检查循环
		 * 此函数不会导致错误：`$apply already in progress` 或 `$digest already in progress`
		 * @param {Scope} scope 作用域
		 * @param {string|function} [exp] 表达式，可省略
		 * @since 2018-11-22
		 */
		api.applyToScope = function (scope) {
			var fn = scope.$root.$$phase ? scope.$evalAsync : scope.$apply;

			var args = Array.prototype.slice.call(arguments, 1);

			fn.apply(scope, args);
		};

		/**
		 * 获取包含当前窗口的 iframe 的作用域
		 * @return {Scope}
		 * @since 2018-11-27
		 */
		api.getIframeScope = function () {
			if (!frameElement) return null;

			return parent.$(frameElement).scope();
		};

	}
);