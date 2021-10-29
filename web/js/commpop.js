define(['jquery', 'jquery-ui'], function ($) {
	$(document).ready(function () {
		//全屏
		$(".modmax").click(function () {
			var windowH = $(window).height();
			var tittleH = $(this).parent().height() + 11;
			var mod = $(this).parent().next();
			var modW = $(this).parents(".modal-dialog");
			$(this).children(".fa-expand").toggleClass("fa-compress");
			modW.toggleClass("bigmax");
			if (modW.hasClass("bigmax")) {
				mod.height(windowH - tittleH);
			}
			else {
				mod.removeAttr("style")
			}
		})
		$(".modal_lgmax .modal-header").dblclick(function () {
			var windowH = $(window).height();
			var tittleH = $(this).height() + 11;
			var mod = $(this).next();
			var modW = $(this).parents(".modal-dialog");
			$(this).find(".fa-expand").toggleClass("fa-compress");
			modW.toggleClass("bigmax");
			if (modW.hasClass("bigmax")) {
				mod.height(windowH - tittleH);
			}
			else {
				mod.removeAttr("style");
			}
		})
        /**
         * 拖拽模态框
         */
		$(".ui-widget-content").resizable({
			distance: 0,
			minHeight: 440
		});
		$(".ui-widget-content").resize(function () {
			var mH = $(this).height();
			var mhH = $(this).children().children(".modal-header").outerHeight(true);
			$(this).children().children(".modal-body").css("height", mH - mhH);
			$("#commonModalFrame").find("body").css("overflow", "auto");
		});
		//删除事件点击兼容拖拽，点击后再加载
		$(".ui-resizable-se,.ui-resizable-s,.ui-resizable-e").mousedown(function () {
			$(".ui-resizable").addClass("resizing");
			console.log('mousedown');
			$(".ui-resizable-se").closest("body").on('mouseup', mouseup1);
		});
		function mouseup1() {
			$(".ui-resizable").removeClass("resizing");
			$(".ui-resizable-se").closest("body").off('mouseup', mouseup1);
			console.log('mouseup');
		}

		//slickHeight指令
		var cH = $(".modal-body").height();
		//service.currModalH = cH;
	});
});