/**
 * 富文本
 * @since 2019-05-30
 */
define(['module', 'directiveApi', 'summernote', 'xss', 'fileApi'], function (module, directiveApi, summernote, xss, fileApi) {

	/**
	 * 指令
	 */
	hcRichTextDirective.$inject = ['$parse'];
	function hcRichTextDirective($parse) {
		return {
			restrict: 'E',
			template: function (tElement, tAttrs) {
				return '<textarea ng-model="' + tAttrs.hcModel + '" class="ng-scope"></textarea>';
			},
			require: '?^form',
			/**
			* 连接函数
			* @param $scope 作用域
			* @param $element 元素
			* @param $attrs 属性
			*/
			link: function hcRichTextLink($scope, $element, $attrs, $form) {
				$scope.$form = $form;
				var first = true;
				var $textarea = $element.find('textarea');
				var option = $scope.$eval($attrs.hcOption);
				var minHeight
				if (option) {
					minHeight = option.minHeight;
				} else {
					minHeight = 400;
				}

				function uploadFile(file, editor, welEditable) {
					fileApi.uploadFile({
						multiple: false,
						files: [file]
					}).then(function (docs) {
						var url = '/downloadfile?docid=' + docs[0].docid;
						editor.summernote('insertImage', url);
					});
				};
				$textarea.summernote({
					minHeight: minHeight,
					lang: 'zh-CN',
					fontNames: ["微软雅黑", "华文细黑", 'Arial', 'sans-serif', "宋体", "Times New Roman", 'Times', 'serif', "华文细黑", 'Courier New', 'Courier', '华文仿宋', 'Georgia', "Times New Roman", 'Times', "黑体", 'Verdana', 'sans-seri', "方正姚体", 'Geneva', 'Arial', 'Helvetica', 'sans-serif'],
					toolbar: [
						['style', ['style']],
						['font', ['bold', 'underline', 'clear']],
						['fontname', ['fontname']],
						['color', ['color']],
						['para', ['paragraph']],
						['table', ['table']],
						['insert', ['link', 'picture', 'video']],
						['view', ['fullscreen', 'codeview', 'help']],
					],
					callbacks: {
						onImageUpload: function (files, editor, welEditable) {
							editor = $(this);
							uploadFile(files[0], editor, welEditable); //此处定义了上传文件方法
						},
						onFocus: function () {
							console.log('focus');
							first = false;
						}
					},
				});
				var xssoption = {
					whiteList: {
						p: ['style', 'class', 'color'],
						div: ['class', 'style', 'color'],
						span: ['style', 'class', 'color'],
						img: ['src', 'alt', 'style', 'color'],
						b: ['style', 'class', 'color'],
						h1: ['style', 'class', 'color'],
						h2: ['style', 'class', 'color'],
						h3: ['style', 'class', 'color'],
						h4: ['style', 'class', 'color'],
						h5: ['style', 'class', 'color'],
						h6: ['style', 'class', 'color'],
						font: ['color', 'style', 'class', 'color'],
						br: ['style', 'class', 'color'],
						i: ['style', 'class', 'color'],
						u: ['style', 'class', 'color'],
						sup: ['style', 'class', 'color'],
						sub: ['style', 'class', 'color'],
						a: ['href', 'title', 'target', 'style', 'class', 'color'],
						strong: ['style', 'class', 'color'],
						ins: ['style', 'class', 'color'],
						table: ['style', 'class', 'width', 'cellpadding', 'cellspacing'],
						td: ['style', 'class'],
						tbody: ['style', 'class'],
						tr: ['style', 'class'],
						th: ['style', 'class'],
						thead: ['style', 'class'],
						tfoot: ['style', 'class'],
						caption: ['style', 'class'],
						ul: ['style', 'class'],
						li: ['style', 'class'],
						blockquote: ['style', 'class', "cite"],
						section: ['powered-by', 'style', 'class'],
						video: ["autoplay", "controls", "loop", "preload", "src", "height", "width"],
						audio: ["autoplay", "controls", "loop", "preload", "src"],
						small: ['style', 'class', 'color'],
						col: ["align", "valign", "span", "width", 'style', 'class', 'color'],
						colgroup: ["align", "valign", "span", "width", 'style', 'class', 'color'],
						del: ["datetime", 'style', 'class', 'color'],
						details: ["open", 'style', 'class', 'color'],
						abbr: ["title"],
						address: ['style', 'class'],
						area: ["shape", "coords", "href", "alt", 'style', 'class'],
						article: ['style', 'class'],
						aside: ['style', 'class'],
						big: ['style', 'class'],
						center: ['style', 'class'],
						cite: ['style', 'class'],
						code: ['style', 'class'],
						dd: ['style', 'class'],
						details: ["open", 'style', 'class'],
						dl: ['style', 'class'],
						dt: ['style', 'class'],
						em: ['style', 'class'],
						header: ['style', 'class'],
						hr: ['style', 'class'],
						mark: ['style', 'class'],
						nav: ['style', 'class'],
						ol: ['style', 'class'],
						pre: ['style', 'class'],
						s: ['style', 'class'],
						'o:p': ['style', 'class']
					},
					onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
						if (name.substr(0, 5) === 'data-') {
							// 通过内置的escapeAttrValue函数来对属性值进行转义
							return name + '="' + xss.escapeAttrValue(value) + '"';
						}
					}
				};
				var getter = $parse($attrs.hcModel),
					setter = getter.assign;

				$textarea.on('summernote.change', function (we, contents, $editable) {
					setter($scope, contents);
				});

				$scope.$watch($attrs.hcModel, function (value) {
					if (first && value) {
						var html = xss(value, xssoption);
						$textarea.summernote('code', html);
						first = false;
					}
				});
				$scope.$watch('$form.isReadonly()', function (value) {
					console.log(value);
					if (value) {
						$textarea.summernote('disable');
					} else {
						$textarea.summernote('enable');
					}
				})
			},
			scope: true
		};
	}



	//使用Api注册指令
	//需传入require模块和指令定义
	return directiveApi.directive({
		module: module,
		directive: hcRichTextDirective
	});

});