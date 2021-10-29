/**
 * 模块、菜单授权
 * @since 2019-01-25
 */
(function (defineFn) {
	define(['module', 'directiveApi', 'requestApi', 'directive/hcTree', 'ztree.excheck', 'ztree.exhide'], defineFn);
})(function (module,   directiveApi,   requestApi) {

	/**
	 * 指令
	 */
	function hcModMenuDirective() {
		return {
			scope: {
				getSetting: '&hcModMenu'
			},
			templateUrl: directiveApi.getTemplateUrl(module),
			compile: function (tElement) {
				tElement.addClass('TreeGridBox');
			},
			controller: HcModMenuController
		};
	}

	/**
	 * 控制器
	 */
	HcModMenuController.$inject = ['$scope', '$attrs', '$q', '$cacheFactory']
	function HcModMenuController(   $scope,   $attrs,   $q,   $cacheFactory) {
		var controller = this;

		requestApi
			.post({
				classId: 'cpcmod',
				action: 'search',
				noShowWaiting: true,
				noShowError: true
			})
			.then(function (response) {
				$scope.modTreeSetting.zTreeObj.addNodes(null, response.cpcmods.map(function (mod) {
					return {
						data: mod,
						id: mod.modid,
						pId: mod.modpid,
						name: mod.modname,
						open: true
					};
				}));
			})
			.then(update);

		requestApi
			.post({
				classId: 'cpcmenu',
				action: 'search',
				noShowWaiting: true,
				noShowError: true
			})
			.then(function (response) {
				$scope.menuTreeSetting.zTreeObj.addNodes(null, response.cpcmenus.map(function (menu) {
					return {
						data: menu,
						id: menu.menuid,
						pId: menu.menupid,
						name: menu.menuname,
						open: true
					};
				}));
			});

		var eventDisabled = false;

		/**
		 * 【模块】树
		 */
		$scope.modTreeSetting = {
			data: {
				simpleData: {
					enable: true,
					idKey: 'id',
					pIdKey: 'pId'
				}
			},
			check: {
				enable: true,
				autoCheckTrigger: true
			},
			callback: {
				onCheck: function (event, treeId, treeNode) {
					if (eventDisabled) return;

					if (treeNode.checked)
						mods.push(treeNode.data);
					else
						mods.splice(mods.indexOf(treeNode.data), 1);
				}
			}
		};

		/**
		 * 【菜单】树
		 */
		$scope.menuTreeSetting = {
			data: {
				simpleData: {
					enable: true,
					idKey: 'id',
					pIdKey: 'pId'
				}
			},
			check: {
				enable: true
			}
		};

		var setting = $scope.getSetting();

		var mods = [];

		$scope.$watchCollection('$parent.' + setting.mods, function (newValue, oldValue) {
			if (!Array.isArray(newValue)) return;

			mods = newValue;

			update();
		});

		function update() {
			eventDisabled = true;
			try {
				$scope.modTreeSetting.zTreeObj.checkAllNodes(false);

				var modMap = {};

				mods.forEach(function (mod) {
					modMap[mod.modid] = mod;
				});

				var checkedNodes = $scope.modTreeSetting.zTreeObj.getNodesByFilter(function (node) {
					return !!modMap[node.id];
				});

				checkedNodes.forEach(function (node) {
					$scope.modTreeSetting.zTreeObj.checkNode(node, true);
				});
			}
			finally {
				eventDisabled = false;
			}
		}

	}

	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcModMenuDirective
	});
});