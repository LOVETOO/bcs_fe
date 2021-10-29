/**
 * 图片查看器
 * @since 2018-12-14
 */
define([
	'module', 'directiveApi', 'cssApi', 'angular', 'plugins/viewer/viewer'
], function (module, directiveApi, cssApi, angular, Viewer) {
	'use strict';

	cssApi.loadCss('plugins/viewer/viewer');

	/**
	 * 指令
	 */
	function hcImageViewerDirective() {
		return {
			require: 'hcImageViewer',
			templateUrl: directiveApi.getTemplateUrl(module),
			scope: {},
			controller: HcImageViewerController,
			link: hcImageViewerLink
		};
	}

	/**
	 * 控制器
	 */
	HcImageViewerController.$inject = ['$scope', '$element', '$q'];
	function HcImageViewerController($scope, $element, $q) {
		var imageViewerController = this;
		$element.data('imageViewerController', imageViewerController);

		var viewer;

		/**
		 * 初始化
		 */
		imageViewerController.init = (function (initTrigger) {
			initTrigger.promise.then(function () {
				viewer = new Viewer($element[0]);
			});

			return function init() {
				initTrigger.resolve();
			};
		})($q.defer());

		/**
		 * 设置图片
		 */
		imageViewerController.setDocs = function (docs) {
			docs = angular.copy(docs);

			docs.forEach(function (doc) {
				var lastIndexOfDot = doc.docname.lastIndexOf('.');
				doc.suffix = doc.docname.substr(lastIndexOfDot + 1).toLowerCase();
			});

			var imageSuffixes = {
				jpg: true,
				jpeg: true,
				gif: true,
				png: true,
				bmp: true
			};

			docs = docs.filter(function (doc) {
				return imageSuffixes[doc.suffix];
			});

			$scope.docs = docs;

			return imageViewerController;
		};

		imageViewerController.show = function (docId) {
			var imageIndex = $scope.docs.findIndex(function (doc) {
				return doc.docid == docId;
			});

			if (imageIndex < 0)
				throw new Error('文件[' + docId + ']不是图片');

			viewer.index = imageIndex;
			viewer.show();

			return imageViewerController;
		};
	}

	/**
	 * 连接函数
	 * @param {*} $scope
	 * @param {*} $element
	 * @param {*} $attrs
	 * @param {*} imageViewerController
	 */
	function hcImageViewerLink($scope, $element, $attrs, imageViewerController) {
		imageViewerController.init();
	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcImageViewerDirective
	});
});