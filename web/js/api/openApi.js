/**
 * 用于打开各种东西的Api
 * @since 2018-10-05
 */
define(
	['jquery'],
	function ($) {
		'use strict';

		var $modal;

		function get$modal() {
			if (!$modal)
				$modal = $('body').injector().get('$modal');

			return $modal;
		}

		var api = function (params) {
			get$modal().open({
				template: '<iframe></iframe>'
			});
		};

		return api;
	}
);