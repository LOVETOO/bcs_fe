/**
 * OA
 * @since 2019-03-12
 */
(function (defineFn) {
	define(['app', 'jquery', 'requestApi', 'numberApi', 'swalApi','promiseApi', 'directive/hcSortable', 'directive/hcWidget', 'datetimepicker.zh-CN', 'directive/hcImg'], defineFn);
})(function (app, $, requestApi, numberApi, swalApi,promiseApi) {

	$(function () {
		$('.date').datetimepicker({
			language: 'zh-CN',
			container: $('.date')   //容器
		});
	});

	/**
	 * OA首页控制器
	 */
	HcOaController.$inject = ['$scope', '$modal', '$state', '$timeout'];
	function HcOaController($scope, $modal, $state, $timeout) {

		(function () {
			requestApi
				.post({
					classId: 'scp_ent_config',
					action: 'select',
					data: {
						entid: userbean.entid
					}
				})
				.then(function (entConfig) {
					$scope.entConfig = window.entConfig = entConfig;
					if($scope.entConfig.enable_oa != 2){
						// 向网页body中添加元素。
						var div = '<div>当前企业未激活OA系统</div>';
						$("body").append(div);
					}
				});

			requestApi
				.post({
					classId: 'scpuser',
					action: 'select',
					data: {
						userid: userbean.userid
					}
				})
				.then(function (user) {
					$scope.user = window.user = user;
				});
		})();

		/**
		 * 获取布局
		 */
		function getLayout() {
			return requestApi
				.post({
					classId: 'base_widget_layout',
					action: 'getlayout'
				})
				.then(function (response) {
					$scope.layoutId = numberApi.toNumber(response.layoutid);

					var layout = JSON.parse(response.layoutjson);

					$scope.widgetCols = layout.cols;
				});
		}

		//获取布局
		getLayout();

		/**
		 * 排序选项
		 */
		$scope.sortableOption = {
			//如果设置为 true，则禁用该 sortable。
			//原始默认值：false
			//开始时先禁用排序，点击【编辑布局】后再允许排序
			disabled: true,

			//如果指定了该选项，则限制在指定的元素上开始排序。
			//原始默认值：false
			handle: '.hc-list-tittle',

			//指定元素内的哪一个项目应是 sortable。
			//元素默认值：'> *'
			// items: '>.hc-sortable-item',

			//列表中的项目需被连接的其他 sortable 元素的选择器。
			//这是一个单向关系，
			//如果您想要项目被双向连接，
			//必须在两个 sortable 元素上都设置 connectWith 选项。
			connectWith: '[hc-sortable="sortableOption"]',

			//当用户停止排序且 DOM 位置改变时触发该事件。
			update: function (event, ui) {
				//跨列拖拽时，会触发2次
				//第2次是源列触发，会有 sender 属性
				if (ui.sender) return;

				$timeout(saveLayout);
			}
		};

		/**
		 * 保存布局
		 */
		function saveLayout() {
			var layout = {
				cols: $scope.widgetCols
			};

			return requestApi
				.post({
					classId: 'base_widget_layout',
					action: 'adjustlayout',
					data: {
						layoutid: $scope.layoutId,
						layoutjson: JSON.stringify(layout)
					}
				})
				.then(function (response) {
					$scope.layoutId = numberApi.toNumber(response.layoutid);
				});
		}

		/**
		 * 添加首页卡片组件
		 */
		$scope.addWidget = function (col) {
			var postData = {
				widgets: []
			};

			$scope.widgetCols.forEach(function (col) {
				col.widgets.forEach(function (widget) {
					postData.widgets.push({
						widgetid: widget.widgetId
					});
				});
			});

			return $modal
				.openCommonSearch({
					classId: 'base_widget',
					postData: postData
				})
				.result
				.then(function (widgetData) {
					col.widgets.push({
						widgetId: numberApi.toNumber(widgetData.widgetid),
						templateUrl: widgetData.templateurl,
						scriptUrl: widgetData.scripturl,
						class: widgetData.class
					});

					saveLayout();
				});
		};

		/**
		 * 删除首页卡片组件
		 */
		$scope.deleteWidget = function (col, widget) {
			var index = col.widgets.indexOf(widget);

			if (index < 0) return;

			col.widgets.splice(index, 1);

			saveLayout();
		};

		/**
		 * 重置布局
		 */
		$scope.resetLayout = function () {
			return swalApi
				.confirm('确定要重置为默认布局吗？')
				.then(function () {
					return requestApi
						.post({
							classId: 'base_widget_layout',
							action: 'resetlayout'
						});
				})
				.then(getLayout);
		};

		/**
		 * 退出登录
		 */
		$scope.logout = function () {
			return swalApi
				.confirm('确定要退出登录吗?')
				.then(function () {
					location = "/web/oalogout.do";
				});
		};


		/**
		 * 应用链接
		 */
		$scope.appLinks = [
			{
				name: '协同办公',
				icon: 'hc-xietongbangong'
			},
			{
				name: '进 销 存',
				icon: 'hc-kucun'
			},
			{
				name: '财务管理',
				icon: 'hc-caiwuguanli'
			},
			{
				name: '预算管理',
				icon: 'hc-yusuanguanli'
			},
			{
				name: '资金管理',
				icon: 'hc-zijinguanli'
			},
			{
				name: '工程项目',
				icon: 'hc-shichang'
			},
			{
				name: '人力资源',
				icon: 'hc-renliziyuan'
			},
		];

		//生成链接
		$scope.appLinks.forEach(function (appLink) {
			appLink.href = '/web/index.jsp' + $state.href('home', {
				modName: appLink.name
			});
		});

		$scope.i = 0;
		$scope.getMods = function () {
			requestApi.post({
				classId: "base_modmenu",
				action: "getuserallmenu",
				data: {
					sqlwhere: "1=1"
				}
			}).then(function (response) {
				$scope.mods = response;
				$scope.mods.base_modmenus.forEach(function (item) {
					item.href = '/web/index.jsp' + $state.href('home', {
						modName: item.modname
					});
				});
				if($scope.mods.base_modmenus.length<=8){
					promiseApi.whenTrue(function () {
						return $('#li_next').length > 0 && $('#li_next').length > 0
					}, 200).then(function(){
						$('#li_next').attr('disabled','disabled');
					});
				}
			})
		}
		$scope.getMods();
		$scope.prevClick=true;//防止用户连续点击按钮的变量
		$scope.nextClick=true;//防止用户连续点击按钮的变量
		promiseApi.whenTrue(function () {
			return $('#li_prev').length > 0 && $('#li_next').length > 0
		}, 200).then(function(){
			$('#li_prev').click(function (e) {
				if($scope.prevClick){
					$scope.prevClick=false;
					setTimeout(function(){ 
						$scope.prevClick = false;
						$scope.prevClick = true;
					}, 300);
					if ($scope.mods.base_modmenus.length > 8) {
							$('#li_next').removeAttr('disabled','disabled');
							$scope.i++;
							var left = $scope.i * 100 + 'px';
							$('#modul').css('margin-left', left);
							if($scope.i==0){
								$('#li_prev').attr('disabled','disabled');
							}
					} else {
						$('#li_prev').attr('disabled','disabled');
					}
				}
			});
			
			$('#li_next').click(function (e) {
				if($scope.nextClick){
					$scope.nextClick=false;
					setTimeout(function(){ 
						$scope.nextClick = false;
						$scope.nextClick = true;
					}, 300);
					if ($scope.mods.base_modmenus.length > 8) {
							$('#li_prev').removeAttr('disabled','disabled');
							$scope.i--;
							var left = $scope.i * 100 + 'px';
							$('#modul').css('margin-left', left);
							if ($scope.i == -($scope.mods.base_modmenus.length-8)){
								$('#li_next').attr('disabled','disabled');
							}
					} else {
						$('#li_next').attr('disabled','disabled');
					}	
				}
			});
			$('li.js-use').hover(
				function(){
					$("div.oa-nav-list").addClass('js-use-toggle');
				},
				function(){
					if($scope.prevClick && $scope.nextClick){
						console.log("没拦住的hover out事件");
						$("div.oa-nav-list").removeClass('js-use-toggle');
					}
				}
			)
		});
		
		
		/**
		 * 点击应用链接
		 */
		$scope.appLinkClick = function (appLink) {
			open(appLink.href);
		};
		$scope.linkSchedule = function () {
			var url = '/web/index.jsp';
			url += $state.href('oa.schedule_detail');
			window.open(url);
		}
		$scope.linkaddress = function () {
			var url = '/web/index.jsp';
			url += $state.href('oa.address');
			window.open(url);
		}
		/**
		 * 打开我的设置
		 */
		$scope.openMySetting = function () {
			$state.go('baseman.mysettings');
		};

	}

	app.controller('oa', HcOaController);

	/**
	 * OA首页指令
	 */
	function hcOaDirective() {
		return {
			scope: true,
			controller: 'oa'
		};
	}

	app.directive('hcOa', hcOaDirective);
});