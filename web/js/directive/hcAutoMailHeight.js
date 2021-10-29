/**
 * 邮件自适应高度
 * @since 2018-10-27
 */
define(
	['module', 'directiveApi'],
	function (module, directiveApi) {
		//定义指令
		var directive = [
			'$timeout',
			function ($timeout) {
				return {
					link: function (scope, element, attrs) {
						function hcAutoMailHeight() {
							console.log('start mail-height');
                            var $e = $(element);
                            //窗口高度
                            var bodyH = $e.closest("body").height();

                            var headH = $(".mail-box-header").height();
                            var footH = $('.mail-body.text-right.tooltip-demo').height();

                            var rows = $e.closest('.form-group').prevAll('.form-group');
                            var rowsH = 0;
                            for (var i = 0; i < rows.length; i++) {
                                rowsH += $(rows[i]).height();
                            }

                            $e.find(".note-editor.note-frame.panel.panel-default").css('cssText', 'height:' + bodyH - headH - footH - rowsH + 'px!important');
                        	//表格的自适应高度
                            if (attrs.hcAutoMailHeight === 'right') {}

                        }
						$timeout(hcAutoMailHeight, 50);
		                $(window).resize(hcAutoMailHeight);
					}
				}
			}
		];

		//使用Api注册指令
		//需传入require模块和指令定义
		return directiveApi.directive({
			module: module,
			directive: directive
		});
	}
);