/**
 * 菜单浏览器
 * @since 2019-06-21
 */
define(['module', 'controllerApi', 'requestApi', 'numberApi', 'base_diy_page', 'directive/hcBox', 'directive/hcImg'], function (module, controllerApi, requestApi, numberApi, base_diy_page) {

	MenuExplorer.$inject = ['$scope', '$stateParams'];
	function MenuExplorer(   $scope,   $stateParams) {
		controllerApi.extend({
			controller: base_diy_page.controller,
			scope: $scope
		});

		var modId = numberApi.toNumber($stateParams.id);

		if (modId) {
			requestApi
				.post({
					classId: 'base_modmenu',
					action: 'getmodmenus',
					data: {
						modid: modId
					}
				})
				.then(function (response) {
					$scope.menuCategories = response.modmenus;
				});
		}
	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: MenuExplorer
	});
});