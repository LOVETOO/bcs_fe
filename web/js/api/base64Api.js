/**
 * base64相关Api
 * @since 2018-11-08
 */
define(
	['exports', 'jquery', 'angular', 'jquery_base64'],
	function (api, $, angular) {
		'use strict';

		//全部使用UTF-8编码
		$.base64.utf8encode = true;
		//全部使用UTF-8解码
		$.base64.utf8decode = true;

		/**
		 * base64加密
		 * @param {string} plain 明文
		 * @return {string} 密文
		 * @since 2018-11-08
		 */
		api.encode = $.base64.encode;

		/**
		 * base64解密
		 * @param {string} coded 密文
		 * @return {string} 明文
		 * @since 2018-11-08
		 */
		api.decode = $.base64.decode;

		/**
		 * 对象加密为base64
		 * @param {object} obj 对象
		 * @return {string} 密文
		 * @since 2018-11-08
		 */
		api.encodeFromObj = function (obj) {
			var json = JSON.stringify(obj);

			return api.encode(json);
		};

		/**
		 * base64解密为对象
		 * @param {string} coded 密文
		 * @return {object} 对象
		 * @since 2018-11-08
		 */
		api.decodeToObj = function (coded) {
			var json = api.decode(coded);

			return JSON.parse(json);
		};

	}
);