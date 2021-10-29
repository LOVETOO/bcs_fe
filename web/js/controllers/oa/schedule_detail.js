/**
 * 演示 - 日程编辑
 * @hzj 2019-05-21
 */
(function (defineFn) {
	define(['module', 'controllerApi', 'base_diy_page', 'requestApi', 'base_obj_prop', 'promiseApi', 'swalApi',
		'@fullcalendar/core', '@fullcalendar/interaction', '@fullcalendar/daygrid', '@fullcalendar/timegrid',
		'directive/wuiDate','directive/hcModal'
	], defineFn);
})(function (module, controllerApi, base_diy_page, requestApi, base_obj_prop, promiseApi, swalApi,
	FullCalendar, interaction, dayGrid, timeGrid
) {

	/**
	 * 控制器
	 */
	scheduleDetail.$inject = ['$scope'];
	function scheduleDetail($scope) {
		$scope.data = {
			currItem: {},
			event: [],
			click: 0
		};
		var calendar, calendarEl;
		controllerApi.extend({
			controller: base_diy_page.controller,
			scope: $scope
		});

		/**
		 * 获取数据
		 */
		$scope.getData = function () {
			var param = {
				ownerid: window.userbean.userid,
				ownertype: 13
			}
			requestApi.post('scpcalend', 'selectall', param)
				.then(function (response) {
					console.log(response)
					$scope.data.event = response.calends;
					$scope.data.event.map(function (item) {
						item['start'] = item.statime.replace(" ", "T");
						item['end'] = item.endtime.replace(" ", "T");
						item['title'] = item.subject;
						item['_allday'] = item.allday;
						if (item.allday == '2') {
							item.allday = true;
						} else {
							item.allday = false;
						}
					})
					console.log($scope.data.event);
					$scope.initFullCalendar();
				});
		}
		$scope.getData();

		/**
		 * 打开模态框
		 */
		$scope.addschedule = function (event) {
			console.log(event);
			$scope.scheduleModal.open({
				controller: ['$scope', function ($modalScope) {
					$modalScope.footerRightButtons.delete =
						{
							title: '删除',
							click: function () {
								swalApi.confirm('确认删除该日程？').then(function () {
									var param = {
										ownerid: window.userbean.userid,
										ownertype: 13,
										calendid: $modalScope.data.calendid
									}
									requestApi.post('scpcalend', 'delete', param)
										.then(function (response) {
											console.log(response);
											$scope.getData();
											$modalScope.$close();
											swalApi.info("删除成功");
										});
								});
							}
						};
					$modalScope.footerRightButtons.rightTest = {
						title: '保存',
						click: function () {
							if (!$modalScope.data.duedate && !$modalScope.data.subject) {
								swalApi.info("至少填写主题和开始时间");
								return;
							}
							var statime = new Date($modalScope.data.statime).getTime();
							var endtime = new Date($modalScope.data.endtime).getTime();
							if (endtime < statime) {
								swalApi.info("结束时间不能小于开始时间");
								$modalScope.data.endtime = '';
								return;
							}
							/*if($modalScope.data._allday=="2" && $modalScope.data.endtime.length<19){
								$modalScope.data.endtime+=" 24:00:00";
							}*/
							var param = {
								ownerid: window.userbean.userid,
								ownertype: 13,
								calendid: $modalScope.data.calendid,
								statime: $modalScope.data.statime,
								endtime: $modalScope.data.endtime,
								subject: $modalScope.data.subject,
								allday: $modalScope.data._allday,
								location: $modalScope.data.location,
								contact: $modalScope.data.contact,
								tel: $modalScope.data.tel,
								note: $modalScope.data.note
							}
							requestApi.post('scpcalend', action, param)
								.then(function (response) {
									console.log(response);
									$scope.getData();
									$modalScope.$close();
									swalApi.info("保存成功");
									//calendar.getEventSources()[0].refetch();
									//eventSource.refetch()
									//calendar.refetchEvents()
									//calendar.renderableEventStore = $scope.data.event
								})
						}
					};
					var action
					if (event) {
						var obj = {}
						for (var key in event._def.extendedProps) {
							obj[key] = event._def.extendedProps[key];
						}
						$modalScope.data = obj;
						action = 'update';
					} else {
						$modalScope.data = {};
						$modalScope.data._allday = "2";
						action = 'insert';
						$modalScope.footerRightButtons.delete.hide = true;
					}
					// $modalScope.data = event || {};
					$modalScope.title = "添加日程";

				}]
			});
		}
		$scope.initFullCalendar = function () {
			promiseApi.whenTrue(function () {
				return $('#calendar').length > 0
			}, 200)
				.then(function () {
					var option = {
						plugins: ['interaction', 'dayGrid', 'timeGrid'],
						//plugins: [ interaction,dayGrid,timeGrid ],
						header: {
							left: 'prev,next today',
							center: 'title',
							right: 'dayGridMonth,timeGridWeek,timeGridDay'
						},
						locale: 'zh-cn',
						buttonText: {
							today: '今天',
							month: '月',
							week: '周',
							day: '日',
						},
						allDayText: '全天',
						timezone: 'local',
						//defaultDate: '2019-06-12',
						navLinks: true, // can click day/week names to navigate views
						selectable: false,
						selectMirror: true,
						select: function (arg) {

						},
						dateClick: function (info) {//点击某一天事件 - 新建日程
							$scope.addschedule();
						},
						eventClick: function (event) {
							$scope.addschedule(event.event);
						},
						eventMouseEnter: function (event) {

						},
						eventMouseLeave: function (event) {

						},
						editable: false,
						eventLimit: true, // allow "more" link when too many events
						events: $scope.data.event
					}
					calendarEl = document.getElementById('calendar');
					calendarEl.innerHTML = '';
					calendar = new FullCalendar.Calendar(calendarEl, option);
					calendar.render();
					$(".fc-content").hover(
						function () {
							$(this).addClass("calendar_hover");
						},
						function () {
							$(this).removeClass("calendar_hover");
						}
					);
				});
		}



	}
	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: scheduleDetail
	});
});