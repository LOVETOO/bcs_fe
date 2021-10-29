/**
 * 拖拽指令
 * @since 2018-10-10
 */
define(
    ['module', 'directiveApi', 'jquery-ui'],
	function (module, directiveApi) {
		//定义指令
		var directive = [
            '$timeout',
			function ($timeout) {
				return {
                    restrict: 'AE',
                    link: function (scope, element, attrs) {
						return;
                        var $ = top.$;

                        $timeout(function () {
                            var startX = 0,
                                startY = 0,
                                x = 0,
                                y = 0;
                            $(element).css({
                                cursor: 'move'
                            });
                            var $dialog = $(element).closest("div.modal-dialog");
                            $(element).on("mousedown", function (event) {
                                mousedown(event);
                            });
                            var _e;
                            var $e;

                            function mousedown(event) {
                                // console.log('down');
                                // console.log(event.target);
                                $e=$(event.target);
                                _e=event;
                                //放出按钮
                                if (event.target.className == 'close'||event.target.getAttribute('aria-hidden')=='true') {
                                    if(
                                        $(event.target).closest(".modal.fade").length!=0
                                        &&
                                        $(event.target).closest(".modal.fade").attr("id")=="commonModal"
                                    ){
                                        startX = 0;
                                        startY = 0;
                                        x = 0;
                                        y = 0;
                                    }
                                    return;
                                }
                                if (event.target.className == 'modmax' || event.target.className.indexOf('fa fa-expand') != -1) {
                                    return;
                                }
                                event.preventDefault();
                                startX = event.pageX - x;
                                startY = event.pageY - y;
                                $(event.target).closest('body').on('mousemove', mousemove);
                                $(event.target).closest('body').on('mouseup', mouseup);
                                $(event.target).closest('.ui-resizable').addClass('resizing');
                                // console.log($(event.target));
                                // console.log($(event.target).closest('body'));
                                // console.log($(event.target).closest('body').on('mousemove', mousemove));
                            }

                            function mousemove(event) {
                                y = event.pageY - startY;
                                x = event.pageX - startX;
                                $e.closest("div.modal-dialog").css({
                                    //$dialog.css({
                                    top: y + 'px',
                                    left: x + 'px'
                                });
                               // console.log("x:"+x+",y:"+y)
                            }

                            function mouseup(event) {
                                //console.log('up');
                                $(_e.target).closest('body').off('mousemove', mousemove);
                                $(_e.target).closest('body').off('mouseup',mouseup);
                                $(_e.target).closest('.ui-resizable').removeClass('resizing')
                            }

                            //关闭模态框时注销事件
                            $dialog.find('[aria-hidden=true]').on('click',function(){
                                mouseup(_e);
                            });
                            /*$dialog.on('mouseout',function () {
                             startX=0;
                             startY=0;
                             mouseup();
                             })*/

                        }, 50)

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