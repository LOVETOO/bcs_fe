/**
 * 图标API
 * @since 2019-07-24
 */
define(['exports'], function (api) {

	api.chooseIcon = function (params) {
		return ['$modal', function ($modal) {
			return $modal
				.open({
					templateUrl: 'views/baseman/icon_explorer.html',
                    controller: IconExplorerController,
                    size: 'lg'
				})
				.result;
		}].callByAngular();
	};

	IconExplorerController.$inject = ['$scope', '$http'];
	function IconExplorerController(   $scope,   $http) {
        $scope.title = '图标';

        $scope.iconBoxes = [];
        
        [
            {
                name: '通用',
                url: 'css/iconfont/iconfont.json'
            },
            {
                url: 'img/iconfont/iconfont.json'
            }
        ].forEach(function (item, index) {
            $http.get(item.url).then(function (response) {
                var iconConfig = response.data;

                var iconBox = {
                    name: item.name || iconConfig.name,
                    icons: iconConfig.glyphs.map(function (icon) {
                        return {
                            name: icon.name,
                            class: iconConfig.font_family + ' ' + iconConfig.css_prefix_text + icon.font_class
                        };
                    })
                };

                if (index >= $scope.iconBoxes.length) {
                    $scope.iconBoxes.push(iconBox);
                }
                else {
                    $scope.iconBoxes.splice(index, 0, iconBox);
                }
            });
        });

		angular.extend($scope.footerRightButtons.ok, {
			click: function () {
				$scope.$close($scope.activeIcon);
			},
			hide: false,
			disabled: function () {
				return !$scope.activeIcon;
			}
		});

		(function ($close) {
			$scope.$close = function (icon) {
				icon = angular.extend({}, icon);

				if ($scope.activeColorClass) {
					icon.class += ' ' + $scope.activeColorClass;
				}

				return $close.call(this, icon);
			};
		})($scope.$close);
	}

});