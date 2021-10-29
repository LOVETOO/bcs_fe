/**这是信息编辑界面js*/
function oa_home_info_attach($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
	oa_home_info_attach = HczyCommon.extend(oa_home_info_attach, ctrl_bill_public);
	oa_home_info_attach.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

	$scope.objconf = {
		name: "oa_home_info",
		key: "info_id",
		//预览新闻
		nextStat: "oa_home_info_news",
		wftempid: 10164,
		FrmInfo: {},
		grids: []
	};
	/******************界面初始化****************************/
	$scope.clearinformation = function() {
		$scope.searchlist = false;
		$scope.data = {};
		$scope.data.currItem = {
			creator: userbean.userid,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			stat: 1
		};
		//页面初始化时将内容框清空
		$('.summernote').summernote('code', '');
	};

	//初始化网格模块名字段的下拉列表值
	$scope.info_mod = [{
			desc: '新闻中心',
			value: 1
		},
		{
			desc: '通知公告',
			value: 2
		},
		{
			desc: '公司制度',
			value: 3
		},
		{
			desc: '员工活动',
			value: 4
		},
		{
			desc: '发展历程',
			value: 5
		},
		{
			desc: '人才体系',
			value: 6
		},
		{
			desc: '知识管理',
			value: 7
		}
	];

	$scope.info_type = [{
			desc: '公司动态',
			value: 1
		},
		//		{
		//			desc: '销售新闻',
		//			value: 2
		//		},
		//		{
		//			desc: '项目新闻',
		//			value: 3
		//		},
		{
			desc: '市场新闻',
			value: 4
		}
		//		,
		//		{
		//			desc: '产品动态',
		//			value: 5
		//		}
	];

	//设置状态的默认值
	$scope.stat = [{
			desc: '发布',
			value: 1
		},
		{
			desc: '不发布',
			value: 99
		}
	];

	//保存时校验
	$scope.validate = function() {
		//全不能为空..
		var checklist = [{
				key: 'title',
				desc: '标题'
			},
			{
				key: 'info_mod',
				desc: '模块名'
			},
			{
				key: 'stat',
				desc: '状态'
			}
		];
		var item = $scope.data.currItem;
		for(var i = 0; i < checklist.length; i++) {
			var value = checklist[i]
			if(item[value.key] == 0 || item[value.key] == '' || item[value.key] == undefined) {
				BasemanService.notice(value.desc + '为空，请输入！', "alert-warning");
				return;
			}
		}
		/**判断新闻模块名时分类是否为空*/
		if($scope.data.currItem.info_mod == 1) {
			if($scope.data.currItem.info_type == 0 || $scope.data.currItem.info_type == undefined) {
				BasemanService.notice('分类为空，请输入！', "alert-warning");
				return;
			}
		} else {
			//如果用户选择的不是新闻模块,分类则为0
			$scope.data.currItem.info_type = 0;
		}

		/**判断内容是否为空*/
		if($('.summernote').summernote('code') == '' || $('.summernote').summernote('code') == undefined) {
			BasemanService.notice('内容为空，请输入！', "alert-warning");
			return;
		}

		return true;
	}

	//保存时将内容框的数据保存
	$scope.save_before = function(postdata) {
		postdata.contant = $('.summernote').summernote('code');
	}
	//修改时将内容显示在内容框中
	$scope.refresh_after = function() {
		$('.summernote').summernote('code', $scope.data.currItem.contant);
	}

	//查询用户
	$scope.searchuser = function() {
		$scope.FrmInfo = {
			classid: "oa_home_info", //请求类
			backdatas: "oa_home_infos",
			sqlBlock: "1=1"
		};

		BasemanService.open(CommonPopController, $scope).result.then(function(data) {
			$scope.data.currItem.sysuserid = data.sysuserid;
			$scope.data.currItem.username = data.username;
			$scope.clearItem();
		});
	}

	/**设置内容框*/
	$('.summernote').summernote({
		height: 300,
		fontNames: ["微软雅黑", "华文细黑", 'Arial', 'sans-serif', "宋体", "Times New Roman", 'Times', 'serif', "华文细黑", 'Courier New', 'Courier', '华文仿宋', 'Georgia', "Times New Roman", 'Times', "黑体", 'Verdana', 'sans-seri', "方正姚体", 'Geneva', 'Arial', 'Helvetica', 'sans-serif'],
		callbacks: {
			onImageUpload: function(files, editor, welEditable) {
				editor = $(this);
				uploadFile(files[0], editor, welEditable); //此处定义了上传文件方法
			}
		}
	});

	function uploadFile(file, editor, welEditable) {
		fd = new FormData();
		fd.append("docFile0", file);
		$.ajax({
			data: fd,
			type: "POST",
			url: '/web/scp/filesuploadsave2.do', //此处配置后端的上传文件，PHP，JSP或者其它
			cache: false,
			contentType: false,
			processData: false,
			success: function(res) {
				var obj = strToJson(res);
				//obj.data[0].downloadcode
				//'img/p1.jpg'
				editor.summernote('insertImage', '/downloadfile.do?iswb=true&docid=' + obj.data[0].docid); //完成上传后插入图片到编辑器

			}
		});
	}

	$('.note-editing-area').keydown(function(event) {
		event.stopPropagation();
		console.warn(event);
	})
	$scope.data = {};
	$scope.data.currItem = {};
	$scope.data.currItem.objattachs = [];
	/**新闻预览*/
	$scope.preview = function() {
		//获取id
		var param = {
			id: $scope.data.currItem.info_id
		}
		//将id加密
		var url_param = $.base64.btoa(JSON.stringify(param), true);
		//拼接网址并跳转网页
		window.location.href = "#/crmman/" + $scope.objconf.nextStat + "?param=" + url_param;
	}
	$scope.initdata();
}

//注册控制器
angular.module('inspinia')
	.controller('oa_home_info_attach', oa_home_info_attach)