/**
 * 数组Api
 * @since 2018-09-17
 */
define(
	['angular'],
	function (angular) {
		'use strict';

		var api = {};

		/**
		 * 把【带length属性的对象】转换为【数组】
		 * @param {{ length: number }} objWithLength 带length属性的对象
		 * @param {number} start 开始位置(包含)
		 * @param {number} end 结束位置(不包含)
		 */
		api.toArray = function (objWithLength) {
			if (angular.isArray(objWithLength))
				return objWithLength;

			return Array.prototype.slice.call(objWithLength);
		};

		/**
		 * 返回对象数组
		 * 若是数组，直接返回
		 * 若是对象，返回包含该对象的一元数组
		 * 其他返回空数组
		 * @param obj
		 * @return {object[]}
		 */
		api.toObjArray = function (obj) {
			if (angular.isArray(obj))
				return obj;

			if (angular.isObject(obj))
				return [obj];

			return [];
		};

		return api;
	}
);