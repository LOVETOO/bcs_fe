/**
 * main.js需要的指令组
 * @since 2018-09-07
 */
(function () {
	var directiveNames = [
		//'wrapHeight',
		'sideNavigation',
		//'draggableModel',
		'hcDirective',
		'hcAutoHeight'
	];

	if (window === top) {
		directiveNames.push(
			'hcBox',
			'hcCollapseLeftBar',
			'hcInput',
			'hcTab',
			'hcTabPage',
			'hcTree',
			'hcImg'
		);
	}

	var directivePaths = directiveNames.map(function (directiveName) {
		return 'directive/' + directiveName;
	});

	define(directivePaths, function () {
		var exports = {};

		for (var i = 0; i < arguments.length; i++) {
			exports[arguments[i].name] = arguments[i];
		}

		//导出各个指令
		return exports;
	});
})();