/**
 * 邮件控制器
 */
define(
  ['module',
    'angular',
    'swalApi',
    '$q',
    'xss',
    'requestApi',
    'controllerApi',
    'jquery_base64',
    'plugins/sweetalert/sweetalert.min',
    'openBizObj',
    'base/ctrl_bill_public',
    'common/myfilesCtrl',
    'base_diy_page',
    'summernote',
    'bootstrap',
    'plugins/dropzone/dropzone',
    'directive/swfUpload',
    'directive/hcGrid',
    'directive/hcModal',
    'directive/hcRightClick',
    'services'
    // 'js/plugins/z-tree/jquery.ztree.excheck.js'
  ],
  function (module, angular, swalApi, $q, xss, requestApi, controllerApi, jquery_base64, swal, openBizObj, ctrl_bill_public, myfilesCtrl, base_diy_page) {
    'use strict';

    var MailController = [
      //声明angular依赖
      '$scope', 'BasemanService', '$sce', '$timeout', '$compile', '$stateParams',
      //控制器函数
      function ($scope, BasemanService, $sce, $timeout, $compile, $stateParams) {
        $scope.pageSize = 20;//页大小
        $scope.pn = 1;//当前页
        $scope.pc;//所有页数
        $scope.cn;//所有数据数
        $scope.temporary_flag;//分页时保存flag
        //当前对象配置
        $scope.objconf = {
          name: "scpemail",
          key: "emailid",
          FrmInfo: {},
          grids: []
        };

        $scope.data = {
          show: 1,
          currItem: {
            attachofemails1: [],
            sendtoname_array: [],
            sendto_array: [],
            totype_array: [],
            sendtoorg_array: [],
            sendtoo_array: [],
            toorgtype_array: [],
          },
          outusermails: [],//存储外部邮箱
          disUpBtn: null,//存储上一封邮件id
          disDownBtn: null,//存储下一封邮件id

          addrModal: {},//通讯录模态框数据
          addrModalShow: false,//通讯录是否显示
          //mailattachsize限制附件大小系统参数
          scpemailc: [],//自定义文件夹数据
          user_search_data: [],//模糊查询数据
          rightEdit: {},//收/抄编辑数据
          sendSuccess: {},//发送成功提示
        };

        var TimeFn = null;

        /**
         * 判断为空
         */
        $scope.isNull = function (str) {
          return str === "" || str === undefined || str === null;
        };

        /**
         * 补0,返回字符串
         */
        $scope.supplement = function (str) {
          str *= 1;
          return str < 10 ? "0" + str : str + "";
        };

        /*==========================================循环收件箱===========================================*/
        $scope.tbody_list = [
          {
            name: '今天',
            field: 'today_emails'
          }, {
            name: '周六',
            field: 'xq6_emails'
          }, {
            name: '周五',
            field: 'xq5_emails'
          }, {
            name: '周四',
            field: 'xq4_emails'
          }, {
            name: '周三',
            field: 'xq3_emails'
          }, {
            name: '周二',
            field: 'xq2_emails'
          }, {
            name: '周一',
            field: 'xq1_emails'
          }, {
            name: '上周',
            field: 'lastweek_emails'
          }, {
            name: '更早',
            field: 'early_emails'
          }
        ];


        /*==========================================获取外部邮箱列表===========================================*/
        $scope.getOutMails = function () {
          requestApi.post({classId: "scpusermail", action: "search", data: {}})
            .then(function (data) {
              $scope.data.outusermails = data.usermails;
            });
        };
        $scope.getOutMails();


        /*==========================================监听界面切换===========================================*/
        $scope.$watch('data.show', function (newValue, oldValue, scope) {
          $scope.autoHeight();
        });


        /*==========================================自动高度===========================================*/
        $scope.autoHeight = function () {
          setTimeout(function () {
            var $e = $('[ng-show="data.show==' + $scope.data.show + '"]');
            var bodyH = $e.closest('body').height();
            var headH = $e.find(".mail-box-header").outerHeight(true);
            var footH = $e.find('.mail-foot').outerHeight(true);

            if ($scope.data.show == 1) {
              $e.find('.table-box').css('cssText', 'height:' + (bodyH - headH - footH - 10) + 'px!important;');
            } else if ($scope.data.show == 2) {
              var mbody = $e.find('.mail-body:not(.mail-foot)');
              var mbodyP = mbody.innerHeight() - mbody.height();

              //通讯录
              $e.find('#addwidth,#addwidth1').css('cssText', 'height:' + (bodyH - headH - footH - mbodyP - 10) + 'px!important;');

              var rows = $e.find('.form-horizontal>.form-group:not(:last-child)');
              var rowsH = 0;
              for (var i = 0; i < rows.length; i++) {
                rowsH += $(rows[i]).outerHeight(true);
              }

              //书写栏
              var ntoolbarH = $e.find('.note-toolbar').outerHeight(true);
              var nstatusbarH = $e.find('.note-statusbar').outerHeight(true);
              $e.find(".note-editable").css('cssText', 'height:' + (bodyH - headH - footH - rowsH - mbodyP - ntoolbarH - nstatusbarH - 12) + 'px!important');
            } else if ($scope.data.show == 3) {
              $e.find(".look-body").css('cssText', 'height:' + (bodyH - headH - footH - 10) + 'px!important;');
            }
          }, 100)
        };


        /*==========================================页码操作===========================================*/
        //首页
        $scope.firstpage = function () {
          var pagination = "pn=1,ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0";
          var item = $scope.re_left_data().item;
          /*外部/自定义需传入item*/
          $scope.search(pagination, item)
        };
        //上一页
        $scope.prevpage = function () {
          $scope.pn = $scope.pn * 1;
          var pagination = "pn=" + (($scope.pn - 1 >= 1) ? $scope.pn - 1 : 1) + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0";
          var item = $scope.re_left_data().item;
          $scope.search(pagination, item)
        };
        //下一页
        $scope.nextpage = function () {
          $scope.pn = $scope.pn * 1;
          var pagination = "pn=" + (($scope.pn + 1 <= $scope.pc) ? $scope.pn + 1 : $scope.pc) + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0";
          var item = $scope.re_left_data().item;
          $scope.search(pagination, item)
        };
        //尾页
        $scope.lastpage = function () {
          var pagination = "pn=" + $scope.pc + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0";
          var item = $scope.re_left_data().item;
          $scope.search(pagination, item)
        };
        //页大小变化
        $scope.pschange = function (pageSize) {
          var pagination = "pn=" + 1 + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0";
          var item = $scope.re_left_data().item;
          $scope.search(pagination, item)
        };
        //页码变化
        $scope.pnchange = function () {
          $scope.pn = parseInt($scope.pn);
          if ($scope.pn < 1) {
            $scope.pn = 1
          }
          if ($scope.pn > $scope.pc) {
            $scope.pn = $scope.pc;
          }
          var pagination = "pn=" + $scope.pn + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0";
          var item = $scope.re_left_data().item;
          $scope.search(pagination, item)
        };


        /*==========================================邮件上/下一封===========================================*/
        $scope.upMail = function () {
          if ($scope.data.disUpBtn !== null)
            $scope.show($scope.data.show, $scope.data.emails[$scope.data.disUpBtn].emailid);
        };


        $scope.downMail = function () {
          if ($scope.data.disDownBtn !== null)
            $scope.show($scope.data.show, $scope.data.emails[$scope.data.disDownBtn].emailid);
        };


        /**
         * 判断上下一封按钮是否禁用
         */
        $scope.getUDBtn = function () {
          var i;
          $scope.data.disUpBtn = null;
          $scope.data.disDownBtn = null;
          for (i = 0; i < $scope.data.emails.length; i++) {
            var row = $scope.data.emails[i];
            if (row.emailid == $scope.data.currItem.emailid) {
              break;
            }
          }
          if (i !== undefined) {
            if (i - 1 >= 0) {
              $scope.data.disUpBtn = (i - 1);
            }
            if (i + 1 <= $scope.data.emails.length) {
              $scope.data.disDownBtn = (i + 1);
            }
          }
        };


        /*==========================================右键菜单 start===========================================*/
        /*-------菜单操作-------*/
        /**
         * 右键-添加事件  取消 - 使用自定义指令ng-right-click
         */
        /*$timeout(function () {
         /!**
         * 外部邮件
         *!/
         $('.hc-right-outmail').off("contextmenu");
         $('.hc-right-outmail').contextmenu(function ($event) {
         var dom = $(this);
         for (var i = 0; i < $scope.data.outusermails.length; i++) {
         var row = JSON.parse(JSON.stringify($scope.data.outusermails[i]));
         if (row.email == dom.text().trim()) {
         $("#right_outmail").attr("data-i", i);
         }
         }
         $scope.toggle_outmenu($event, $("#right_outmail"));
         return false;
         });

         /!**
         * 自定义文件夹
         *!/
         $('.hc-right-custom').off("contextmenu");
         $('.hc-right-custom').contextmenu(function ($event) {
         var $e = $($event.target);
         var dom = $('#right_custom');
         dom.attr("data-emailcname", $e.attr("data-emailcname"));
         dom.attr("data-emailcid", $e.attr("data-emailcid"));
         $scope.toggle_outmenu($event, $("#right_custom"));
         return false;
         });
         }, 100);*/

        /**
         * 外部邮件右键
         * @param $event
         */
        $scope.hc_right_out = function ($event) {
          var $e = $(this);
          var dom = $('#right_outmail');
          for (var i = 0; i < $scope.data.outusermails.length; i++) {
            var row = JSON.parse(JSON.stringify($scope.data.outusermails[i]));
            if (row.email == $e.text().trim()) {
              dom.attr("data-i", i);
            }
          }
          $scope.toggle_outmenu($event, dom);
          return false;
        };

        /**
         * 自定义文件夹右键
         * @param $event
         * @returns {boolean}
         */
        $scope.hc_right_custom = function ($event) {
          var $e = $($event.target);
          var dom = $('#right_custom');
          dom.attr("data-emailcname", $e.attr("data-emailcname"));
          dom.attr("data-emailcid", $e.attr("data-emailcid"));
          $scope.toggle_outmenu($event, dom);
          return false;
        };

        /**
         * 隐藏菜单时机
         */
        $('body').on('click contextmenu', function (e) {
          $timeout(function () {
            $scope.hide_menu();
          }, 100);
        });

        /**
         * 右键菜单开关
         * @param $event
         */
        $scope.toggle_outmenu = function ($event, dom) {
          $scope.hide_menu();

          if (dom.css("display") == "none") {
            $scope.show_menu(dom, $event)
          } else {
            $scope.hide_menu(dom)
          }
        };

        /**
         * 显示菜单
         * @param dom
         * @param $event
         */
        $scope.show_menu = function (dom, $event) {
          dom.css({display: "block", top: $event.clientY, left: $event.clientX})
        };

        /**
         * 隐藏菜单
         * @param dom
         */
        $scope.hide_menu = function (dom) {
          if (dom) {
            dom.css({display: "none"});
          } else {
            $('#right_final,#right_outmail,#right_custom').css({display: "none"});
          }
        };


        /*---------外部邮箱---------*/
        /**
         * 外部邮箱-右键-收信
         */
        $scope.menu_rout = function ($event) {
          $scope.add_outmail($("#right_outmail").attr("data-i"));
        };


        /*-------收件人/抄送人-------*/
        /**
         * 收/超-删除
         */
        $scope.right_del_elem = function () {
          $scope.del_elem();
        };

        /**
         * 收/超-复制
         */
        $scope.right_copy_elem = function (e) {
          $scope.copy_elem('复制');
        };

        /**
         * 收/超-剪切
         */
        $scope.right_cut_elem = function (e) {
          $scope.copy_elem('剪切');
          $scope.del_elem();
        };

        /**
         * 收/超-全选
         */
        $scope.right_checkall_elem = function (e) {
          var id = "#toAreaCtrl";
          if ($scope.focus == 2) {
            id = "#toAreaCtrl1";
          }
          $(id + ' .addr_text .js_input').select();
          $timeout(function () {
            $(id + ' .addr_base').addClass('attbg_focus');
          }, 100);
          return false;
        };

        /**
         * 收/超-复制操作
         */
        $scope.copy_elem = function (str) {
          var id = "#toAreaCtrl";
          if ($scope.focus == 2) {
            id = "#toAreaCtrl1"
          }
          var text = $(id + ' .attbg_focus').text().trim().slice(0, -1);
          var oInput = document.createElement('input');
          oInput.value = text;
          document.body.appendChild(oInput);
          oInput.select(); // 选择对象
          document.execCommand("Copy"); // 执行浏览器复制命令
          oInput.className = 'oInput';
          oInput.style.display = 'none';
          swalApi.success(str + '成功:' + text);
        };


        /*----------编辑----------*/
        /**
         * 收/抄-右键-编辑
         */
        $scope.right_edit_elem = function (e) {
          var id = "#toAreaCtrl";
          if ($scope.focus == 2) {
            id = "#toAreaCtrl1"
          }
          var dom = $(id + ' .attbg_focus');
          $scope.data.rightEdit.data = dom.text().trim().slice(0, -1);
          $scope.data.rightEdit.show = true;
          /*移动编辑input*/
          $(dom).after($('.right_edit_elem_input'));
          $scope.data.rightEdit.width = dom[0].scrollWidth - 20;
          $scope.del_elem(true);
          $scope.right_edit_elem_focus();
        };

        /**
         * 编辑-使聚焦编辑input
         * (ng-show有延迟,right_edit_elem时还没有显示无法focus)
         */
        $scope.right_edit_elem_focus = function () {
          $timeout(function () {
            var dom = $('.right_edit_elem_input');
            if (dom.css("display") == "none")
              $scope.right_edit_elem_focus();
            else
              dom.focus();
          }, 20);
        };

        /**
         * 编辑-键盘
         */
        $scope.right_edit_elem_keydown = function (e) {
          if (e.keyCode === 186 || e.keyCode === 13) {// ;/enter
            var inputfield = 'snedto';
            if ($scope.focus == 2) {
              inputfield = 'cc';
            }
            $scope.importInput('search_edit', '.right_edit_elem_input', inputfield, $scope.data.rightEdit.data);
            $scope.right_edit_elem_hide();
          }
        };

        /**
         * 编辑-变化
         */
        $scope.right_edit_elem_change = function () {
          $scope.data.rightEdit.width = $('.right_edit_elem_input')[0].scrollWidth;
        };

        /**
         * 编辑-失焦
         */
        $scope.right_edit_elem_blur = function () {
          $scope.right_edit_elem_keydown({keyCode: 186})
        };

        /**
         * 编辑-关闭
         */
        $scope.right_edit_elem_hide = function () {
          $scope.data.rightEdit.data = "";
          $scope.data.rightEdit.show = false;
          $(".right_edit_elem_div").after($('.right_edit_elem_input'));
        };


        /*-------自定义文件夹-------*/
        /**
         * 自-重命名
         */
        $scope.right_rename_custom = function (e) {
          var $e = $(e.target);
          $scope.scpemailcModal
            .open({
              controller: ['$scope', function ($modalScope) {
                $modalScope.title = "重命名自定义文件夹";
                $modalScope.data = {
                  emailcname: $e.closest('#right_custom').attr('data-emailcname'),
                  emailcid: $e.closest('#right_custom').attr('data-emailcid')
                };
                $modalScope.footerRightButtons.rightTest = {
                  title: '确定',
                  click: function () {
                    $modalScope.$close($modalScope.data)
                  }
                };
              }]
            })
            .result
            .then(function (data) {
              return requestApi.post("scpemailc", "update", {scpemailc: data})
            })
            .then(function (data) {
              $scope.get_scpemailc();
            })
        };

        /**
         * 自-删除
         */
        $scope.right_del_custom = function (e) {
          var $e = $(e.target);
          var postdata = {
            scpemailc: {
              emailcid: $e.closest('#right_custom').attr('data-emailcid')
            }
          };
          requestApi.post("scpemailc", "delete", postdata)
            .then(function (data) {
              $scope.get_scpemailc();
            })
        };


        /*==========================================右键菜单 end===========================================*/


        /*==========================================自定义文件夹 start===========================================*/
        /**
         * 获取自定义文件夹根目录及目录下邮件信息(未读/总数)
         */
        $scope.get_scpemailc = function () {
          /*刷新时保留自定义文件夹的选中状态*/
          var length;
          if ($('#scpe_mail li.high').length > 0) {
            length = $('#scpe_mail li.high').prevAll().length;
          }
          requestApi.post("scpemailc", "selectref", {emailcid: 0})
            .then(function (data) {
              $scope.data.scpemailc = data.scpemailcs;
              $timeout(function () {
                if (length != undefined) {
                  $($('#scpe_mail li')[length]).addClass("high")
                }
              });
            })
        };
        $scope.get_scpemailc();

        /**
         * 添加自定义文件夹
         */
        $scope.add_scpemailc = function () {
          $scope.scpemailcModal
            .open({
              controller: ['$scope', function ($modalScope) {
                $modalScope.title = "新建自定义文件夹";
                $modalScope.data = {};
                $modalScope.footerRightButtons.rightTest = {
                  title: '确定',
                  click: function () {
                    $modalScope.$close($modalScope.data)
                  }
                };
              }]
            })
            .result
            .then(function (data) {
              return requestApi.post("scpemailc", "insert", {scpemailc: data})
            })
            .then(function (data) {
              $scope.get_scpemailc();
            })
        };

        /**
         * 自定义文件夹-添加邮件
         */
        $scope.add_scpemailtrk = function (item) {
          var postdata = {
            emailcid: item.emailcid,
            emailid: $scope.data.currItem.emailid
          };
          requestApi.post("scpemailtrk", "move", postdata)
            .then(function (data) {
              console.log(data);
              swalApi.success(item.emailcname + "添加邮件成功")
            })
            .then(function (data) {
              $scope.get_scpemailc();
            })
        };

        /**
         * 自定义文件夹-添加邮件-多选
         */
        $scope.add_scpemailtrk_s = function (item) {
          var emails = [];
          for (var i = 0; i < $scope.data.emails.length; i++) {
            if ($scope.data.emails[i].checkbox == 2) {
              emails.push($scope.data.emails[i]);
            }
          }
          if (emails.length == 0)
            return swalApi.info('请先选择邮件');

          var promises = [];

          emails.forEach(function (email) {
            var postdata = {
              emailcid: item.emailcid,
              emailid: email.emailid
            };
            promises.push(requestApi.post("scpemailtrk", "move", postdata))
          });
          $q
            .all(promises)
            .then(function () {
              swalApi.success(item.emailcname + "添加邮件成功");
            })
            .then(function () {
              $scope.get_scpemailc();
            })
        };
        /*==========================================自定义文件夹 end===========================================*/


        /*==========================================获取外部邮件/自定义文件选中状态的数据及位置 start===========================================*/
        /**
         * 获取外部邮件/自定义文件选中状态的数据及位置
         */
        $scope.re_left_data = function () {
          /*自定义文件夹*/
          var item, length;
          if ($scope.data.flag == 4.7) {
            length = $("#scpe_mail li.high").prevAll().length;
            item = $scope.data.scpemailc[length];
          }
          /*外部邮件*/
          if ($scope.data.flag == 6) {
            length = $("#out_mail li.high").prevAll().length;
            item = $scope.data.outusermails[length];
          }
          return {item: item, length: length}
        };
        /*==========================================获取外部邮件/自定义文件选中状态的数据及位置 end===========================================*/


        /*==========================================系统附件===========================================*/
        $scope.fw_addfile = function () {
          BasemanService.openFrm("views/baseman/myfiles_frm.html", myfilesCtrl.controller[myfilesCtrl.controller.length - 1], $scope, "", "").result.then(function (res) {
            var info = [];
            for (var i = 0; i < res.length; i++) {
              /*防止重复添加*/
              for (var j = 0; j < $scope.data.currItem.attachofemails1.length; j++) {
                if (parseInt(res[i].docid) == parseInt($scope.data.currItem.attachofemails1[j].docid)) {
                  break;
                }
              }
              /*限制大小*/
              if ((res[0].oldsize / 1024 / 1024) > ($scope.data.currItem.mailattachsize * 1)) {
                info.push(res[i].name);
                break;
              }
              if (j == $scope.data.currItem.attachofemails1.length) {
                $scope.data.currItem.attachofemails1 = $scope.data.currItem.attachofemails1.concat([res[i]]);
              }
            }
            if (info.length > 0) {
              swalApi.info(info.toString + " 文件大小超过" + $scope.data.currItem.mailattachsize + "M")
            }
          })
        }


        /*==========================================设置===========================================*/
        $scope.open_setting = function () {
          BasemanService.openFrm("views/baseman/mail_setting.html", mail_setting, $scope, "", "").result.then(function (res) {
            $scope.getOutMails();//更新侧边栏外部邮箱列表
          })
        };

        var mail_setting = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
          // mail_setting = SinoccCommon.extend(mail_setting, ctrl_bill_public);
          //mail_setting.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
          $scope.data = {};
          $scope.data.currItem = {};
          $scope.mailserverids = [];
          $scope.accounts = [];
          //收发模式
          $scope.disableds = [
            {name: "允许收发", value: 1},
            {name: "仅允许发送", value: 2},
            {name: "禁止", value: 3}
          ];

          $timeout(function () {
            $('#contents3').summernote({
              height: 300,
              fontNames: ["微软雅黑", "华文细黑", 'Arial', 'sans-serif', "宋体", "Times New Roman", 'Times', 'serif', "华文细黑", 'Courier New', 'Courier', '华文仿宋', 'Georgia', "Times New Roman", 'Times', "黑体", 'Verdana', 'sans-seri', "方正姚体", 'Geneva', 'Arial', 'Helvetica', 'sans-serif'],
              callbacks: {
                onImageUpload: function (files, editor, welEditable) {
                  editor = $(this);
                  uploadFile(files[0], editor, welEditable); //此处定义了上传文件方法
                }
              }
            });
          })

          //邮箱类型下拉
          requestApi.post({
            classId: "scpmailserver", action: "search", data: {}
          })
            .then(function (data) {
              for (var i = 0; i < data.mailservers.length; i++) {
                data.mailservers[i].name = data.mailservers[i].domain;
                data.mailservers[i].value = data.mailservers[i].domain;
                $scope.mailserverids.push(data.mailservers[i]);
              }
            });

          //邮箱类型下拉变化
          $scope.change_domain = function () {
            for (var i = 0; i < $scope.mailserverids.length; i++) {
              var row = $scope.mailserverids[i];
              if ($scope.data.currItem.domain == row.domain) {
                $scope.data.currItem.mailserverid = row.mailserverid;
                $scope.data.currItem.ailserverid = row.ailserverid;
                $scope.data.currItem.pop3server = row.pop3server;
                $scope.data.currItem.smtpsvrname = row.smtpserver;
                $scope.data.currItem.smtpsvrport = row.smtpport;
                $scope.data.currItem.pop3svrname = row.pop3server;
                $scope.data.currItem.pop3svrport = row.pop3port;
              }
            }
            $scope.$applyAsync();
          };

          requestApi.post({
            classId: "scpusermail", action: "search", data: {}
          })
            .then(function (data) {
              $scope.data.usermails = data.usermails;

              if (data.dicts) {
                for (var i = 0; i < data.dicts.length; i++) {
                  data.dicts[i].value = parseInt(data.dicts[i].value);
                }
              }

              for (var i = 0; i < $scope.data.usermails.length; i++) {
                var object = {};
                object.value = $scope.data.usermails[i].email;
                object.desc = $scope.data.usermails[i].email;
                $scope.accounts.push(object);
              }
              $scope.accounts.push({value: '内部邮箱', desc: '内部邮箱'})


              for (var i = 0; i < $scope.data.usermails.length; i++) {
                if ($scope.data.usermails[i].isdefault == 2) {
                  $scope.data.currItem.isdefault = 1;
                  $scope.isdefault = 1;
                  return;
                }
              }
              $scope.data.currItem.isdefault = 2;
              $scope.isdefault = 2;

            })
            .then(function () {
              //若侧边栏选择有外部邮箱账号,则显示对应账号 否则默认第一个
              $timeout(function () {
                var li = $('#out_mail li.high');
                var j = 0;
                if (li && li.length > 0) {
                  for (var i = 0; i < $scope.data.usermails.length; i++) {
                    var row = $scope.data.usermails[i];
                    if (row.email == li.text().trim()) {
                      j = i;
                    }
                  }
                }
                $scope.out_mail(undefined, j, $scope.data.usermails[j])
              }, 100);
            });
          $scope.del_mail = function () {
            if ($scope.out_index == undefined) {
              swalApi.info("请选择删除明细");
              return;
            }
            swalApi.confirm({
              title: "确定删除？"
            })
              .then(function () {
                return requestApi.post({
                  classId: "scpusermail", action: "delete",
                  data: {
                    usermailid: $scope.data.usermails[$scope.out_index].usermailid
                  }
                })
              })
              .then(function (data) {
                //BasemanService.notice("删除成功", "alert-info");
                swalApi.success({
                  title: '删除成功'
                });
                $scope.data.usermails.splice($scope.out_index, 1);
                $scope.new_mail();
                $scope.$applyAsync();
              });
          }

          $scope.new_mail = function () {
            //var isdefault = $scope.data.currItem.isdefault;
            $scope.data.currItem = {
              isdefault: $scope.isdefault,
              smtpauthtype: 2,
              nodelservermail: 2,
              disabled: 1
            };
          }

          //select
          $scope.out_mail = function (e, index, item) {
            $scope.out_index = index;
            if ($scope.out_index == undefined) {

            } else {
              $scope.data.usermails[$scope.out_index].mail_autograph = $('#contents3').summernote('code');
            }
            // $(e.delegateTarget).siblings().removeClass("high");
            // $(e.delegateTarget).addClass('high');
            for (var i = 0; i < $scope.data.usermails.length; i++) {
              $scope.data.usermails[i].high = false;
            }
            item.high = true;

            requestApi.post({
              classId: "scpusermail", action: "select",
              data: {
                usermailid: $scope.data.usermails[index].usermailid
              }
            })
              .then(function (data) {
                $scope.data.currItem = data;
                return data;
              })
              /*$scope.data.currItem.usermailid = parseInt($scope.data.usermails[index].usermailid);
               $scope.data.currItem.email = $scope.data.usermails[index].email;
               //$scope.data.currItem.smtppsw = $scope.data.usermails[index].smtppsw;
               $scope.data.currItem.username = $scope.data.usermails[index].username;
               $scope.data.currItem.to_email = $scope.data.usermails[index].to_email;
               $scope.data.currItem.mailserverid = parseInt($scope.data.usermails[index].mailserverid);
               $scope.data.currItem.isdefault = parseInt($scope.data.usermails[index].isdefault);
               $scope.data.currItem.mail_autograph = ($scope.data.usermails[index].mail_autograph);*/
              .then(function (data) {
                for (var i = 0; i < $scope.mailserverids.length; i++) {
                  if (data.mailserverid == $scope.mailserverids[i].mailserverid) {
                    $scope.data.currItem.domain = $scope.mailserverids[i].domain;
                  }
                }
              })
              .then($scope.change_domain)
              .then(function () {
                $scope.$applyAsync();
              });


            if ($scope.data.currItem.email == "内部邮箱") {
              $('#maintabs').children().removeClass('active');
              $('#maintabs').children().eq(1).addClass('active');

              $('#main-tab-content').children().removeClass('active');
              $('#main-tab-content').children().eq(1).addClass('active');
            }
            $('#contents3').summernote('code', $scope.data.usermails[index].mail_autograph);

          };

          $scope.isNull = function (str) {
            return str === "" || str === undefined || str === null;
          };
          $scope.ok = function () {
            var msg = [];
            if ($scope.isNull($scope.data.currItem.domain)) {
              msg.push("邮件服务器");
            }
            if ($scope.isNull($scope.data.currItem.disabled)) {
              msg.push("收发模式");
            }
            if ($scope.isNull($scope.data.currItem.email)) {
              msg.push("邮件地址");
            }
            if ($scope.isNull($scope.data.currItem.pop3svrname)) {
              msg.push("pop3服务器");
            }
            if ($scope.isNull($scope.data.currItem.smtpsvrname)) {
              msg.push("smtp服务器");
            }
            if ($scope.isNull($scope.data.currItem.pop3user)) {
              msg.push("账号名");
            }
            if ($scope.isNull($scope.data.currItem.pop3psw)) {
              msg.push("密码/授权码");
            }
            if ($scope.isNull($scope.data.currItem.smtpsvrport)) {
              msg.push("外发邮件端口");
            }
            if ($scope.isNull($scope.data.currItem.pop3svrport)) {
              msg.push("接收邮件端口");
            }
            if (msg.length > 0) {
              swalApi.info(msg.toString() + "不能为空");
              return;
            }

            $scope.data.currItem.mail_autograph = $('#contents3').summernote('code');
            var postdata = $scope.data.currItem;
            var action = 'update';
            if ($scope.data.currItem.usermailid) {

            } else {
              action = 'insert';
              postdata.smtpsamepop3 = 2;
            }
            requestApi.post({
              classId: "scpusermail",
              action: action,
              data: postdata
            }).then(function (data) {
              //BasemanService.notice("新建成功!", "alert-info");
              swalApi.success({
                title: '保存成功'
              });
              $modalInstance.close($scope.data.currItem);
            })
          };
          $scope.cancel = function () {
            // $modalInstance.dismiss(close);
            $modalInstance.close();
          }
        }


        /*==========================================跟踪邮件===========================================*/
        /**
         * 收件箱跟踪
         */
        $scope.follow_mail_new = function (item) {
          $scope.emailofemails = [];
          $scope.emailofemails.push(item);
          BasemanService.openFrm("views/baseman/follow_mail.html", follow_mail, $scope, "", "").result.then(function (res) {
          })
        };
        /**
         * 工具栏跟踪按钮
         */
        $scope.follow_mail = function () {
          var postdata = {};
          $scope.emailofemails = [];
          for (var i = $scope.data.emails.length - 1; i > -1; i--) {
            if ($scope.data.emails[i].checkbox == 2) {
              $scope.emailofemails.push($scope.data.emails[i]);
            }
          }
          if ($scope.emailofemails.length != 1) {
            return swalApi.info('跟踪只能是一条邮件')
          }

          BasemanService.openFrm("views/baseman/follow_mail.html", follow_mail, $scope, "", "").result.then(function (res) {
          })
        }
        // 跟踪邮件
        var follow_mail = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance, $parent) {
          $scope.$parent = $parent;
          /*follow_mail = SinoccCommon.extend(follow_mail, ctrl_bill_public);
           follow_mail.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService]);*/
          //继承
          controllerApi.extend({
            controller: ctrl_bill_public.controller,
            scope: $scope
          });

          $scope.data = {};
          $scope.data.currItem = {
            subject: $scope.$parent.emailofemails[0].subject
          };

          requestApi.post({
            classId: "scpemail",
            action: "selecttrk",
            data: {emailid: parseInt($scope.$parent.emailofemails[0].emailid)}
          }).then(function (data) {
              $scope.data.currItem.emailtrkofemails = data.emailtrkofemails;
              $scope.options_acl.hcApi.setRowData($scope.data.currItem.emailtrkofemails);
            }
          );


          $scope.ok = function () {
            $modalInstance.close($scope.data.currItem);
          };
          $scope.cancel = function () {
            $modalInstance.dismiss(close);
          };
//权限列表
          $scope.options_acl = {
            columnDefs: [{
              headerName: "收件人",
              field: "sendto",
              width: 120
            }, {
              headerName: "阅读时间",
              field: "readtime",
              width: 190
            }, {
              headerName: "阅读状态",
              field: "flag",
              type: '词汇',
              cellEditorParams: {
                names: ["未阅", "已阅", "已撤回"],
                values: ['1', '2', '3']
              },
              width: 120
            }]
          };
          /*$scope.columns_acl = [{
           headerName: "阅读状态",
           field: "flag",
           width: 120,
           cellEditor: "下拉框",
           editable: false,
           cellEditorParams: {
           values: [{
           value: 1,
           desc: "未阅"
           }, {
           value: 2,
           desc: "已阅"
           }, {
           value: 9,
           desc: "已撤回"
           }]
           }
           }, {
           headerName: "收件人",
           field: "sendto",
           width: 100,
           cellEditor: "文本框",
           editable: false
           }, {
           headerName: "阅读时间",
           field: "readtime",
           width: 140,
           cellEditor: "文本框",
           editable: false
           };]*/
        };


        //回撤
        $scope.retreat_mail = function () {
          var postdata = {};
          var emailofemails = [];
          for (var i = $scope.data.emails.length - 1; i > -1; i--) {
            if ($scope.data.emails[i].checkbox == 2) {
              emailofemails.push($scope.data.emails[i]);
            }
          }
          if (emailofemails.length != 1) {
            swalApi.info("回撤只能是一条邮件");
            return;
          }

          postdata.emailid = parseInt(emailofemails[0].emailid);
          postdata.subject = (emailofemails[0].subject);
          /*ds.dialog.confirm("确定撤回邮件吗?\n 1.仅支持撤回OA邮件 \n 2.如果撤回成功,对方看到的邮件被清除 \n 3.对方已阅读,不予撤回 \n 4.撤回结果可点邮件跟踪查看", function () {
           requestApi.post({
           classId: "scpemail",
           action: "revoke",
           data: postdata
           }).then(function (data) {
           //BasemanService.notice("回撤成功!", "alert-info");
           $scope.follow_mail();
           })
           });*/
          swal({
              title: "确定撤回邮件吗?\n 1.仅支持撤回OA邮件 \n 2.如果撤回成功,对方看到的邮件被清除 \n 3.对方已阅读,不予撤回 \n 4.撤回结果可点邮件跟踪查看",
              type: "warning",
              showCancelButton: true,
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              allowEscapeKey: false, //如果设置为true，用户可以通过按下Escape键关闭弹窗。
              allowOutsideClick: false, //如果设置为true，用户点击弹窗外部可关闭弹窗。
              timer: null//不允许超时消失
            },
            function (isConfirm) {
              if (isConfirm) {
                requestApi.post({
                  classId: "scpemail",
                  action: "revoke",
                  data: postdata
                }).then(function (data) {
                  //BasemanService.notice("回撤成功!", "alert-info");
                  $scope.follow_mail();
                })
              } else {
              }
            });
        };
        $scope.scroll = function () {

          $('.mail-attachment')[0].scrollIntoView(true);

        };


        /**
         * 文件预览
         */
        $scope.viewDoc = function (doc) {
          doc.docname = doc.refname;
          doc.docid = doc.refid;
          var url = "";
          if (doc.docname && (doc.docname.toLowerCase().toString().endsWith(".jpg") || doc.docname.toLowerCase().endsWith(".png") || doc.docname.toLowerCase().endsWith(".jpeg") || doc.docname.toLowerCase().endsWith(".bmp"))) {
            url = /*window.userbean.xturl +*/ "/viewImage.jsp?" + "filecode=" + doc.downloadcode + '' + "&filename=" + doc.docname;
          }
          else if (doc.docname && (doc.docname.toLowerCase().endsWith(".doc") || doc.docname.toLowerCase().endsWith(".docx") || doc.docname.toLowerCase().endsWith(".xlsx") || doc.docname.toLowerCase().endsWith(".xls") || doc.docname.toLowerCase().endsWith(".txt")) || (doc.docname.toLowerCase().endsWith(".ppt")) || (doc.docname.toLowerCase().endsWith(".pptx"))) {
            url = /*window.userbean.xturl +*/ "/viewFile.jsp?" + "filecode=" + doc.downloadcode + '' + "&filename=" + doc.docname;
          }
          else if (doc.docname && (doc.docname.toLowerCase().endsWith(".pdf"))) {
            url = /*window.userbean.xturl +*/ "/viewPDF.jsp?docid=" + doc.docid + "&filecode=" + doc.downloadcode + '' + "&filename=" + doc.docname + "&loginguid=" + encodeURIComponent(strLoginGuid);
          } else {
            swalApi.info("文件格式不支持");
          }
          if (url.length > 1) {
            window.open(url);
          }
        };

        requestApi.post({classId: "scpusermail", action: "search", data: {}}).then(function (data) {
          $scope.data.usermails = data.usermails;
          for (var i = 0; i < $scope.data.usermails.length; i++) {
            if (parseInt($scope.data.usermails[i].isdefault) == 2) {
              $scope.data.email = $scope.data.usermails[i].email
              $scope.data.usermailid = $scope.data.usermails[i].usermailid
            }
          }
          $scope.mailserverids = [];
          if (data.dicts) {
            for (var i = 0; i < data.dicts.length; i++) {
              data.dicts[i].value = parseInt(data.dicts[i].value);
            }
          }

          $scope.mailserverids = data.dicts;
        });

        /**
         * 收信
         * menu 邮件列表,传点击的数据
         */
        $scope.add_outmail = function (i) {
          if (!($scope.data.outusermails && $scope.data.outusermails.length)) {
            swalApi.info("请先设置外部邮箱");
            return;
          }

          var usermailid;
          if (i != null && i != undefined) {
            usermailid = $scope.data.outusermails[i].usermailid;
          } else {
            var index = 0;
            if ($("#out_mail li.high").length != 0) {
              var index = $("#out_mail li").index($("#out_mail li.high"));
            }
            usermailid = $scope.data.outusermails[index].usermailid;
          }

          // $(".desabled-window").css("display", "flex");
          requestApi.post({
            classId: "scpusermail",
            action: "receive",
            data: {
              flag: 99,
              usermailid: usermailid
            }
          }).then(function (data) {
            swalApi.success("收信成功");
            $scope.show_box(6);
            // $(".desabled-window").css("display", "none");
          }, function () {
            // $(".desabled-window").css("display", "none");
          })
        }


        /**
         * 切换 通讯录/分组
         * @param e
         */
        $scope.tooglass = function (e) {
          if (e.currentTarget.id == 'stationery_cmd') {
            e.currentTarget.className = 'cptab cpslt';
            $('#addr_cmd').removeClass('cpslt');
            $('#stationeryTab')[0].style.display = 'block';
            $('#AddrTab')[0].style.display = 'none'
          } else {
            e.currentTarget.className = 'cptab cpslt';
            $('#stationery_cmd').removeClass('cpslt');
            $('#stationeryTab')[0].style.display = 'none';
            $('#AddrTab')[0].style.display = 'block'
          }
        }
        $scope.tooglass_out = function (e) {
          if (e.currentTarget.id == 'addr_cmdin') {
            e.currentTarget.className = 'cptab cpslt'
            $('#addr_cmdout').removeClass('cpslt');
            $('#addr_in')[0].style.display = 'block'
            $('#addr_out')[0].style.display = 'none'
          } else {
            e.currentTarget.className = 'cptab cpslt'
            $('#addr_cmdin').removeClass('cpslt');
            $('#addr_in')[0].style.display = 'none'
            $('#addr_out')[0].style.display = 'block'
          }
        }


        /*==========================================点击收件人 / 外部通讯录添加/修改分组 start===========================================*/
        $scope.addpeople = function (e) {
          //内部邮箱
          if ($scope.data.flag <= 5) {
            $scope.addpeople_in();
          } else {
            //外部邮箱加联系人
            $scope.addpeople_out();
          }
        };

        /**
         * 内部邮箱 添加联系人模态框
         */
        $scope.addpeople_in = function () {
          BasemanService.openFrm("views/baseman/addpeople.html", addpeople, $scope, "", "").result.then(function (res) {
            /**
             * 添加抄送人
             */
            if (res.cs_people) {
              if ($scope.data.currItem.cc == undefined) {
                $scope.data.currItem.cc = '';

              }
              for (var i = 0; i < res.cs_people.length; i++) {
                if ($scope.data.currItem.cc == '') {
                  $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, res.cs_people[i], 2)
                } else {
                  if ($scope.data.currItem.cc.indexOf($scope.data.currItem.cc + res.cs_people[i].username) > -1) {
                    continue;
                  } else {
                    $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, res.cs_people[i], 2)
                  }

                }
              }
            }

            /**
             * 添加收件人
             */
            if (res.sj_people) {
              if ($scope.data.currItem.snedto == undefined) {
                $scope.data.currItem.snedto = '';
              }
              for (var i = 0; i < res.sj_people.length; i++) {
                if ($scope.data.currItem.snedto == '') {
                  $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, res.sj_people[i], 1);
                } else {
                  if ($scope.data.currItem.snedto.indexOf($scope.data.currItem.snedto + res.sj_people[i].username) > -1) {
                    continue;
                  } else {
                    $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, res.sj_people[i], 1)
                  }

                }
              }
            }
          })
        }

        /**
         * 内部邮箱 添加联系人模态框控制器
         */
        var addpeople = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance, $parent) {
          $scope.$parent = $parent;
          /*addpeople = SinoccCommon.extend(addpeople, ctrl_bill_public);
           addpeople.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);*/
          controllerApi.extend({
            controller: ctrl_bill_public.controller,
            scope: $scope
          });

          $scope.data = {};
          $scope.data.currItem = {};
          //$scope.data.currItem.scpemail_contact_lists = $scope.$parent.data.currItem.scpemail_contact_lists
          //收件人
          $scope.data.currItem.sj_people = [];
          $scope.add_sj = function () {
            if ($scope.index == undefined) {
              BasemanService.notice("请选择人员", "alert-info");
            }
            var object = {};
            object = $scope.data.scporgs[$scope.index];
            for (var i = 0; i < $scope.data.currItem.sj_people.length; i++) {
              if (object.userid == $scope.data.currItem.sj_people[i].userid) {
                return;
              }
            }
            if (object.username) {
              $scope.data.currItem.sj_people.push(object);
            }
          }
          $scope.click_sj = function (e, index) {
            $scope.sj_index = index;
            $(e.delegateTarget).siblings().removeClass("high");
            $(e.delegateTarget).addClass('high');
          }
          $scope.del_sj = function () {
            $scope.data.currItem.sj_people.splice($scope.sj_index, 1);
          }
          //抄送人
          $scope.data.currItem.cs_people = [];
          $scope.add_cs = function () {
            if ($scope.index == undefined) {
              BasemanService.notice("请选择人员", "alert-info");
            }
            var object = {};
            object = $scope.data.scporgs[$scope.index];
            for (var i = 0; i < $scope.data.currItem.cs_people.length; i++) {
              if (object.userid == $scope.data.currItem.cs_people[i].userid) {
                return;
              }
            }
            if (object.username) {
              $scope.data.currItem.cs_people.push(object);
            }
          }
          $scope.click_cs = function (e, index) {
            $scope.cs_index = index;
            $(e.delegateTarget).siblings().removeClass("high");
            $(e.delegateTarget).addClass('high');
          }

          $scope.del_cs = function () {
            $scope.data.currItem.cs_people.splice($scope.cs_index, 1);
          }
          //公司同事
          $scope.data.scporgs_h = $scope.$parent.data.scporgs
          //联系分组
          $scope.data.currItem.scpemail_contact_group_lists = $scope.$parent.data.currItem.scpemail_contact_group_lists
          $scope.cancel = function () {
            $modalInstance.dismiss(close);
          }

          $scope.ok = function () {
            $modalInstance.close($scope.data.currItem);
          }
          var setting4 = {
            view: {
              showIcon: showIconForTree
            },
            data: {
              simpleData: {
                enable: true
              }
            },
            callback: {
              //beforeExpand: beforeExpand
              //onRightClick : OnRightClick,//右键事件
              onClick: onClick
            }
          };
          var setting3 = {
            view: {
              showIcon: showIconForTree
            },
            data: {
              simpleData: {
                enable: true
              }
            },
            callback: {
              onClick: onClick1,
              //onRightClick : OnRightClick,//右键事件
              //onClick : menuShowNode
              onDblClick: onDblClick
            }
          };

          //联系人弹出公司同事单击
          function onClick1(treeId, treeNode) {

            var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
            var node = zTree.getSelectedNodes()[0];
            var postdata = {};
            for (name in node) {
              if (name != 'children') {
                postdata[name] = node[name];
              }
            }
            postdata.emailtype = 3
            postdata.flag = 2;
            postdata.list_id = postdata.id
            requestApi.post({classId: 'scpemail_contact_list', action: 'search', data: postdata})
              .then(function (data) {
                $scope.data.scporgs = data.scpemail_contact_group_lists;
                $scope.$apply()
                //$scope.options.api.setRowData(data.scporgs) ;
              });
          }

          function onDblClick(treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
            var node = zTree.getSelectedNodes()[0];
            if (node.contactname) {
              return;
            }
            $scope.node = node;
            BasemanService.openFrm("views/baseman/addgroup.html", addgroup, $scope, "", "").result.then(function (res) {
              var postdata = res;
              postdata.emailtype = 3;
              requestApi.post({
                classId: "scpemail_contact_list",
                action: 'add_contact_group',
                data: postdata
              })
                .then(function (data) {
                  //BasemanService.notice("分组创建成功", "alert-info");
                  swalApi.success({
                    title: '分组创建成功'
                  }).then(function () {
                    $scope.$apply()
                  });
                })
            })
          }

          $scope.addcolor = function (e, index) {
            $scope.index = index;
            $(e.delegateTarget).siblings().removeClass("high");
            $(e.delegateTarget).addClass('high');
          }

          //联系人弹出公司同事单击
          function onClick(treeId, treeNode) {

            var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
            var node = zTree.getSelectedNodes()[0];
            var postdata = {};
            for (name in node) {
              if (name != 'children') {
                postdata[name] = node[name];
              }
            }
            postdata.emailtype = 3
            postdata.flag = 1;
            if (postdata.id) {
              postdata.orgid = parseInt(postdata.id);
            }
            requestApi.post({classId: 'scpemail_contact_list', action: 'search', data: postdata})
              .then(function (data) {
                $scope.data.scporgs = data.scporgs;
                $scope.$apply()
                //$scope.options.api.setRowData(data.scporgs) ;
              });
          }


          /*========================================内部邮箱 收件人 添加分组 start==================================*/
          $scope.addgroup = function (flag) {
            $scope.flag = flag;
            BasemanService.openFrm("views/baseman/addgroup.html", addgroup, $scope, "", "").result.then(function (res) {
              var postdata = res;
              postdata.emailtype = 3;
              requestApi.post({
                classId: "scpemail_contact_list",
                action: "add_contact_group",
                data: postdata
              })
                .then(function (data) {
                  data.name = data.list_name;
                  data.id = data.list_id
                  data.isParent = true;
                  var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
                  zTree.addNodes(null, data);
                  $scope.$parent.treeDemo_in.addNodes(null, data);
                  var node_parent = $scope.$parent.treeDemo_in.getNodesByParam("id", data.id);
                  for (var i = 0; i < data.scpemail_contact_group_lists.length; i++) {
                    data.scpemail_contact_group_lists[i].name = data.scpemail_contact_group_lists[i].contactname;
                    data.scpemail_contact_group_lists[i].id = data.scpemail_contact_group_lists[i].contactid;
                    data.scpemail_contact_group_lists[i].pId = data.id;
                  }
                  $scope.$parent.treeDemo_in.addNodes(node_parent[0], data.scpemail_contact_group_lists);
                  $scope.$parent.data.currItem.scpemail_contact_group_lists = $scope.$parent.data.currItem.scpemail_contact_group_lists.concat(data.scpemail_contact_group_lists);
                  $scope.$parent.data.currItem.scpemail_contact_group_lists.push(data);
                  BasemanService.notice("分组创建成功", "alert-info");
                })
            })
          }
          var addgroup = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
            /*addgroup = SinoccCommon.extend(addgroup, ctrl_bill_public);
             addgroup.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);*/
            controllerApi.extend({
              controller: ctrl_bill_public.controller,
              scope: $scope
            });
            $scope.data = {};
            $scope.data.currItem = {};

            //分组联系人列表
            if ($scope.flag != 2) {
              $scope.data.currItem.scpemail_contact_group_lists = $scope.$parent.node.children;
              $scope.data.currItem.list_name = $scope.$parent.node.list_name;
              $scope.data.currItem.list_id = $scope.$parent.node.list_id;
            } else {
              $scope.data.currItem.scpemail_contact_group_lists = [];
              $scope.data.currItem.list_name = '';
              $scope.data.currItem.list_id = 0;
            }

            $scope.ok = function () {
              if ($scope.data.currItem.list_name == undefined || $scope.data.currItem.list_name == '') {
                swalApi.info("分组名称为空");
                return;
              }
              $modalInstance.close($scope.data.currItem);
            }
            $scope.cancel = function () {
              $modalInstance.dismiss(close);
            }
            //删除联系人
            $scope.del = function (index) {
              $scope.data.currItem.scpemail_contact_group_lists.splice(index, 1);
            }
            var setting = {
              view: {
                showIcon: showIconForTree
              },
              data: {
                simpleData: {
                  enable: true
                }
              },
              callback: {
                onDblClick: onDblClick
                //onRightClick : OnRightClick,//右键事件
                //onClick : menuShowNode
              }
            };

            function onDblClick(treeId, treeNode) {
              var zTree = $.fn.zTree.getZTreeObj("treeDemo2");
              var node = zTree.getSelectedNodes();
              var object = {};
              if (node[0].orgname) {
                object.orgname = node[0].orgname;
                object.contactid = node[0].sysuserid;
                object.contactname = node[0].username;
                object.contactuserid = node[0].userid;
                if ($scope.data.currItem.list_id) {
                  object.list_id = $scope.data.currItem.list_id;
                }
              }
              for (var i = 0; i < $scope.data.currItem.scpemail_contact_group_lists.length; i++) {
                if ($scope.data.currItem.scpemail_contact_group_lists[i].contactuserid == object.contactuserid) {
                  return;
                }
              }
              if (object.contactname) {
                $scope.data.currItem.scpemail_contact_group_lists.push(object);
              }

            }

            function showIconForTree(treeId, treeNode) {
              return !treeNode.isParent;
            };
            $timeout(function () {
              $.fn.zTree.init($("#treeDemo2", parent.document), setting, $scope.$parent.$parent.data.scporgs);
            })
          }
          /*========================================内部邮箱 收件人 添加分组 end==================================*/


          $scope.delgroup = function () {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
            var node = zTree.getSelectedNodes();
            if ((node[0] == undefined || node[0].list_id == undefined || node[0].list_id == '') || (node[0].contactuserid)) {
              swalApi.info("请选中一组!");
              return;
            }

            swal({
                title: "是否删除该组",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                allowEscapeKey: false, //如果设置为true，用户可以通过按下Escape键关闭弹窗。
                allowOutsideClick: false, //如果设置为true，用户点击弹窗外部可关闭弹窗。
                timer: null//不允许超时消失
              },
              function (isConfirm) {
                if (isConfirm) {
                  requestApi.post({
                      classId: "scpemail_contact_list", action: "del_contact_group",
                      data: {
                        list_id: parseInt(node[0].list_id)
                      }
                    }
                  )
                    .then(function (data) {
                      zTree.removeNode(node[0]);
                      var node_parent = $scope.$parent.treeDemo_in.getNodesByParam("id", node[0].id);
                      $scope.$parent.treeDemo_in.removeNode(node_parent[0]);
                      //最近联系人
                      requestApi.post({
                          classId: "scpemail_contact_list", action: "search",
                          data: {
                            emailtype: 3
                          }
                        }
                      )
                        .then(function (data) {
                          //内部邮件通讯显示
                          for (var i = 0; i < data.scpemail_contact_group_lists.length; i++) {
                            data.scpemail_contact_group_lists[i].id = parseInt(data.scpemail_contact_group_lists[i].list_id)
                            data.scpemail_contact_group_lists[i].pId = parseInt(data.scpemail_contact_group_lists[i].list_pid)
                            if (data.scpemail_contact_group_lists[i].contactname) {
                              data.scpemail_contact_group_lists[i].name = (data.scpemail_contact_group_lists[i].contactname)
                            } else {
                              data.scpemail_contact_group_lists[i].name = (data.scpemail_contact_group_lists[i].list_name);
                              data.scpemail_contact_group_lists[i].isParent = true;
                            }
                          }
                          $scope.$parent.data.currItem.scpemail_contact_group_lists = data.scpemail_contact_group_lists;
                        })
                      BasemanService.notice("删除成功!", "alert-info");

                    })
                } else {
                }
              });
            /*ds.dialog.confirm("是否删除该组？", function () {
             requestApi.post({
             classId: "scpemail_contact_list", action: "del_contact_group",
             data: {
             list_id: parseInt(node[0].list_id)
             }
             }
             )
             .then(function (data) {
             zTree.removeNode(node[0]);
             var node_parent = $scope.$parent.treeDemo_in.getNodesByParam("id", node[0].id);
             $scope.$parent.treeDemo_in.removeNode(node_parent[0]);
             //最近联系人
             requestApi.post({
             classId: "scpemail_contact_list", action: "search",
             data: {
             emailtype: 3
             }
             }
             )
             .then(function (data) {
             //内部邮件通讯显示
             for (var i = 0; i < data.scpemail_contact_group_lists.length; i++) {
             data.scpemail_contact_group_lists[i].id = parseInt(data.scpemail_contact_group_lists[i].list_id)
             data.scpemail_contact_group_lists[i].pId = parseInt(data.scpemail_contact_group_lists[i].list_pid)
             if (data.scpemail_contact_group_lists[i].contactname) {
             data.scpemail_contact_group_lists[i].name = (data.scpemail_contact_group_lists[i].contactname)
             } else {
             data.scpemail_contact_group_lists[i].name = (data.scpemail_contact_group_lists[i].list_name);
             data.scpemail_contact_group_lists[i].isParent = true;
             }
             }
             $scope.$parent.data.currItem.scpemail_contact_group_lists = data.scpemail_contact_group_lists;
             })
             BasemanService.notice("删除成功!", "alert-info");

             })
             }, function () {

             });*/
          }

          function showIconForTree(treeId, treeNode) {
            return !treeNode.isParent;
          };

          $timeout(function () {
            //联系人 公司同事
            $.fn.zTree.init($("#treeDemo4", parent.document), setting4, $scope.data.scporgs_h);
            //联系人分组
            $.fn.zTree.init($("#treeDemo3", parent.document), setting3, $scope.data.currItem.scpemail_contact_group_lists);
          })
        };


        /**
         * 外部邮箱 添加联系人模态框
         */
        $scope.addpeople_out = function () {
          BasemanService.openFrm("views/baseman/addpeople_out.html", addpeople_out, $scope, "", "").result.then(function (res) {
            if (res.cs_people) {
              if ($scope.data.currItem.cc == undefined) {
                $scope.data.currItem.cc = '';

              }
              for (var i = 0; i < res.cs_people.length; i++) {
                if ($scope.data.currItem.cc == '') {
                  $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, res.cs_people[i], 1)
                } else {
                  if ($scope.data.currItem.cc.indexOf($scope.data.currItem.cc + res.cs_people[i].username) > -1) {
                    continue;
                  } else {
                    $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, res.cs_people[i], 1)
                  }

                }
              }
            }

            if (res.sj_people) {
              if ($scope.data.currItem.snedto == undefined) {
                $scope.data.currItem.snedto = '';
              }
              for (var i = 0; i < res.sj_people.length; i++) {
                if ($scope.data.currItem.snedto == '') {
                  $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, res.sj_people[i], 2)
                } else {
                  if ($scope.data.currItem.snedto.indexOf($scope.data.currItem.snedto + res.sj_people[i].username) > -1) {
                    continue;
                  } else {
                    $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, res.sj_people[i], 2)
                  }

                }
              }
            }
          })
        }

        /**
         * 外部邮箱 添加联系人模态框 控制器
         */
        var addpeople_out = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance, $parent) {
          $scope.$parent = $parent;
          /*addpeople_out = SinoccCommon.extend(addpeople_out, ctrl_bill_public);
           addpeople_out.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);*/
          controllerApi.extend({
            controller: ctrl_bill_public.controller,
            scope: $scope
          });
          $scope.data = {};
          $scope.data.currItem = {};
          //$scope.data.currItem.scpemail_contact_lists = $scope.$parent.data.currItem.scpemail_contact_lists
          //收件人
          $scope.data.currItem.sj_people = [];
          $scope.add_sj = function () {
            if ($scope.index == undefined) {
              BasemanService.notice("请选择人员", "alert-info");
            }
            var object = {};
            object = $scope.data.scporgs[$scope.index];
            for (var i = 0; i < $scope.data.currItem.sj_people.length; i++) {
              if (object.userid == $scope.data.currItem.sj_people[i].userid) {
                return;
              }
            }
            if (object.username) {
              $scope.data.currItem.sj_people.push(object);
            }
          }
          $scope.click_sj = function (e, index) {
            $scope.sj_index = index;
            $(e.delegateTarget).siblings().removeClass("high");
            $(e.delegateTarget).addClass('high');
          }
          $scope.del_sj = function () {
            $scope.data.currItem.sj_people.splice($scope.sj_index, 1);
          }
          //抄送人
          $scope.data.currItem.cs_people = [];
          $scope.add_cs = function () {
            if ($scope.index == undefined) {
              BasemanService.notice("请选择人员", "alert-info");
            }
            var object = {};
            object = $scope.data.scporgs[$scope.index];
            for (var i = 0; i < $scope.data.currItem.cs_people.length; i++) {
              if (object.userid == $scope.data.currItem.cs_people[i].userid) {
                return;
              }
            }
            if (object.username) {
              $scope.data.currItem.cs_people.push(object);
            }
          }
          $scope.click_cs = function (e, index) {
            $scope.cs_index = index;
            $(e.delegateTarget).siblings().removeClass("high");
            $(e.delegateTarget).addClass('high');
          }

          $scope.del_cs = function () {
            $scope.data.currItem.cs_people.splice($scope.cs_index, 1);
          }
          //联系分组
          $scope.data.currItem.scpemail_contact_group_wb_lists = $scope.$parent.data.currItem.scpemail_contact_group_wb_lists
          $scope.cancel = function () {
            $modalInstance.dismiss(close);
          }
          $scope.ok = function () {
            $modalInstance.close($scope.data.currItem);
          }
          var setting3 = {
            view: {
              showIcon: showIconForTree
            },
            data: {
              simpleData: {
                enable: true
              }
            },
            callback: {
              onClick: onClick1
            }
          };

          //联系人弹出公司同事单击
          function onClick1(treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
            var node = zTree.getSelectedNodes()[0];
            var postdata = {};
            for (name in node) {
              if (name != 'children') {
                postdata[name] = node[name];
              }
            }
            postdata.emailtype = 4
            postdata.flag = 2;
            postdata.list_id = postdata.id
            requestApi.post({classId: 'scpemail_contact_list', action: 'search', data: postdata})
              .then(function (data) {
                $scope.data.scporgs = data.scpemail_contact_group_wb_lists;
                $scope.$apply()
              });
          }

          $scope.addcolor = function (e, index) {
            $scope.index = index;
            $(e.delegateTarget).siblings().removeClass("high");
            $(e.delegateTarget).addClass('high');
          }


          /*---外部邮箱 外部通讯录 添加分组 end---*/
          $scope.addgroup = function (flag) {
            $scope.flag = flag;
            BasemanService.openFrm("views/baseman/addgroup_out.html", addgroup_out, $scope, "", "").result.then(function (res) {
              var postdata = res;
              postdata.emailtype = 4;
              requestApi.post({
                classId: "scpemail_contact_list",
                action: "add_contact_group",
                data: postdata
              })
                .then(function (data) {
                  data.name = data.list_name;
                  data.id = data.list_id
                  data.isParent = true;
                  var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
                  zTree.addNodes(null, data);
                  $scope.$parent.treeDemo_out.addNodes(null, data);
                  $scope.$parent.data.currItem.scpemail_contact_group_wb_lists.push(data);
                  swalApi.success("分组创建成功");
                })
            })
          }

          var addgroup_out = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
            /*addgroup_out = SinoccCommon.extend(addgroup_out, ctrl_bill_public);
             addgroup_out.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);*/
            controllerApi.extend({
              controller: ctrl_bill_public.controller,
              scope: $scope
            });
            $scope.data = {};
            $scope.data.currItem = {};
            $scope.data.currItem.scpemail_contact_group_lists = [];
            $scope.data.currItem.list_name = '';
            $scope.data.currItem.list_id = 0;
            $scope.ok = function () {
              if ($scope.data.currItem.list_name == undefined || $scope.data.currItem.list_name == '') {
                swalApi.info("分组名称为空");
                return;
              }
              $modalInstance.close($scope.data.currItem);
            }
            $scope.cancel = function () {
              $modalInstance.dismiss(close);
            }
          }
          /*---外部邮箱 外部通讯录 添加分组 end---*/


          /*---外部邮箱 外部通讯录 增加分组成员 start---*/
          $scope.addgrouppeop_out = function () {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
            var node = zTree.getSelectedNodes();
            if (node.length == 0) {
              swalApi.info("请选择一个分组");
              return;
            }
            $scope.change_index = 0;
            BasemanService.openFrm("views/baseman/addgrouppeop_out.html", addgrouppeop_out, $scope, "", "").result.then(function (res) {
              var postdata = res;
              postdata.emailtype = 4;
              postdata.list_pid = node[0].id;
              postdata.list_name = node[0].name;

              requestApi.post({
                classId: "scpemail_contact_list",
                action: "add_contact",
                data: postdata
              })
                .then(function (data) {
                  data.name = data.contactname;
                  data.id = data.list_id;
                  $scope.data.scporgs.push(data);
                  var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
                  var node = zTree.getSelectedNodes();
                  var node_parent = $scope.$parent.treeDemo_out.getNodesByParam("id", node[0].id);
                  data.Pid = node_parent[0].id;
                  $scope.$parent.treeDemo_out.addNodes(node_parent[0], 1, data);
                  BasemanService.notice("新增成功", "alert-info");
                })
            })
          }

          var addgrouppeop_out = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
            /*addgrouppeop_out = SinoccCommon.extend(addgrouppeop_out, ctrl_bill_public);
             addgrouppeop_out.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);*/
            controllerApi.extend({
              controller: ctrl_bill_public.controller,
              scope: $scope
            });
            $scope.data = {};
            $scope.data.currItem = {};
            if ($scope.$parent.change_index == 2) {
              $scope.data.currItem = $scope.$parent.data.scporgs[$scope.$parent.index]
            } else {
              $scope.data.currItem.list_name = '';
              $scope.data.currItem.list_id = 0;
            }

            $scope.ok = function () {
              if ($scope.data.currItem.contactname == undefined || $scope.data.currItem.contactname == '') {
                swalApi.info("名称为空");
                return;
              }
              if ($scope.data.currItem.contactuserid == undefined || $scope.data.currItem.contactuserid == '') {
                swalApi.info("邮箱为空");
                return;
              }
              $modalInstance.close($scope.data.currItem);
            }
            $scope.cancel = function () {
              $modalInstance.dismiss(close);
            }
          }
          /*---外部邮箱 外部通讯录 增加分组成员 end---*/


          /*---外部邮箱 外部通讯录 删除分组成员 start---*/
          $scope.delgrouppeop_out = function () {
            if (typeof $scope.index != 'number') {
              return swalApi.info('请选择要删除的分组成员')
            }
            var postdata = $scope.data.scporgs[$scope.index];

            requestApi.post({classId: "scpemail_contact_list", action: "del_contact", data: postdata})
              .then(function (data) {
                $scope.data.scporgs.splice($scope.index, 1);
                var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
                var node = zTree.getSelectedNodes();
                var node_parent = $scope.$parent.treeDemo_out.getNodesByParam("id", data.list_id);
                $scope.$parent.treeDemo_out.removeNode(node_parent[0]);

                swalApi.success('删除成功');
              })
          }
          /*---外部邮箱 外部通讯录 删除分组成员 end---*/

          $scope.chagrouppeop_out = function () {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
            var node = zTree.getSelectedNodes();
            if (node.length == 0) {
              //BasemanService.notice("请选择一个分组", "alert-info");
              swalApi.success({
                title: '请选择一个分组'
              });
              return;
            }
            $scope.change_index = 2;
            BasemanService.openFrm("views/baseman/addgrouppeop_out.html", addgrouppeop_out, $scope, "", "").result.then(function (res) {
              var postdata = res;
              postdata.emailtype = 4;
              postdata.list_pid = node[0].id;
              postdata.list_name = node[0].name;

              requestApi.post({
                classId: "scpemail_contact_list",
                action: "add_contact",
                data: postdata
              })
                .then(function (data) {
                  var node_parent = $scope.$parent.treeDemo_out.getNodesByParam("id", data.list_id);
                  node_parent[0].list_name = data.list_name;
                  node_parent[0].contactuserid = data.contactuserid;
                  $scope.$parent.treeDemo_out.refresh();
                  //BasemanService.notice("修改成功", "alert-info");
                  swalApi.success({
                    title: '修改成功'
                  });
                })
            })
          }
          //联系人 分组
          $scope.delgroup = function () {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
            var node = zTree.getSelectedNodes();
            if ((node[0] == undefined || node[0].list_id == undefined || node[0].list_id == '') || (node[0].contactuserid)) {
              BasemanService.notice("请选中一组!", "alert-info");
              return;
            }
            ds.dialog.confirm("是否删除该组？", function () {
              requestApi.post({
                  classId: "scpemail_contact_list", action: "del_contact_group",
                  data: {
                    list_id: parseInt(node[0].list_id)
                  }
                }
              ).then(function (data) {
                zTree.removeNode(node[0]);
                var node_parent = $scope.$parent.treeDemo_out.getNodesByParam("id", node[0].id);
                $scope.$parent.treeDemo_out.removeNode(node_parent[0]);
                requestApi.post({
                    classId: "scpemail_contact_list", action: "search",
                    data: {
                      emailtype: 3
                    }
                  }
                ).then(function (data) {
                  //外部邮箱分组
                  for (var i = 0; i < data.scpemail_contact_group_wb_lists.length; i++) {
                    data.scpemail_contact_group_wb_lists[i].id = parseInt(data.scpemail_contact_group_wb_lists[i].list_id)
                    data.scpemail_contact_group_wb_lists[i].pId = parseInt(data.scpemail_contact_group_wb_lists[i].list_pid)
                    if (data.scpemail_contact_group_wb_lists[i].contactname) {
                      data.scpemail_contact_group_wb_lists[i].name = (data.scpemail_contact_group_wb_lists[i].contactname)
                    } else {
                      data.scpemail_contact_group_wb_lists[i].name = (data.scpemail_contact_group_wb_lists[i].list_name);
                      data.scpemail_contact_group_wb_lists[i].isParent = true;
                    }

                  }
                  $scope.$parent.data.currItem.scpemail_contact_group_wb_lists = data.scpemail_contact_group_wb_lists;
                })
                //BasemanService.notice("删除成功!", "alert-info");
                swalApi.success({
                  title: '删除成功'
                });
              })
            }, function () {

            });
          }

          function showIconForTree(treeId, treeNode) {
            return !treeNode.isParent;
          };

          $timeout(function () {
            //联系人分组
            $.fn.zTree.init($("#treeDemo3", parent.document), setting3, $scope.data.currItem.scpemail_contact_group_wb_lists);
          })

        }
        /*==========================================点击收件人 / 外部通讯录添加/修改分组 end===========================================*/


        /**
         * 切换外部邮件人?
         */
        $scope.choose_mailbox = function (usermailid, email) {
          $scope.data.usermailid = usermailid;
          $scope.data.email = email;
        }

//关闭查询联系人
        $scope.close_people = function () {
          if ($scope.data.is_search == 2) {
            $scope.data.is_search = 1;
            $scope.data.username = '';
          }
        }

//查询联系人
        $scope.search_peopele = function (flag) {
          $scope.data.is_search = 2;
          if ($scope.data.username == '' || $scope.data.username == undefined) {
            $scope.data.is_search = 1;
            return;
          }
          if (flag == 2) {
            var emailtype = 4;
          } else {
            var emailtype = 3;
          }
          requestApi.post({
            classId: "scpemail_contact_list", action: "search", data: {
              username: $scope.data.username,
              flag: 3,
              emailtype: emailtype
            }
          }).then(function (data) {
            $scope.data.currItem.scporgs = data.scporgs;
          })
        };
        $scope.contact_people = function (e, index) {
          $scope.index = index;
          $(e.delegateTarget).siblings().removeClass("high");
          $(e.delegateTarget).addClass('high');
          //增加抄送人
          if ($scope.focus == 2) {
            if ($scope.data.flag <= 5) {
              $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, $scope.data.currItem.scporgs[index]);
            } else {
              $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, $scope.data.currItem.scporgs[index]);
            }


            //增加收件人
          } else {
            if ($scope.data.flag <= 5) {
              $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, $scope.data.currItem.scporgs[index]);
            } else {

              $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, $scope.data.currItem.scporgs[index]);
            }
          }
          //var l=$("input:focus");
        };
//点击通讯录联系人
        $scope.contact_man = function (e, index) {
          $scope.index = index;
          $(e.delegateTarget).siblings().removeClass("high");
          $(e.delegateTarget).addClass('high');
          //增加抄送人
          if ($scope.focus == 2) {
            if ($scope.data.flag <= 5) {
              $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, $scope.data.currItem.scpemail_contact_lists[index]);
            } else {
              $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, $scope.data.currItem.scpemail_contact_wb_lists[index]);
            }


            //增加收件人
          } else {
            if ($scope.data.flag <= 5) {
              $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, $scope.data.currItem.scpemail_contact_lists[index]);
            } else {
              $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, $scope.data.currItem.scpemail_contact_wb_lists[index]);
            }
          }

          //var l=$("input:focus");
        };
        $scope.add_contact_man = function () {
          $scope.add_index = true;
          BasemanService.openFrm("views/baseman/addgrouppeop_out.html", cha_contact_man, $scope, "", "").result.then(function (res) {
            var postdata = res;
            postdata.emailtype = 4;
            requestApi.post({classId: "scpemail_contact_list", action: "add_contact", data: postdata})
              .then(function (data) {
                $scope.data.currItem.scpemail_contact_wb_lists.push(data);
                //BasemanService.notice("新增成功", "alert-info");
              })
          })
        };

        $scope.del_contact_man = function () {
          if (($scope.index == '' || $scope.index == undefined) && $scope.index != 0) {
            BasemanService.notice("请选中一行", "alert-info");
            return;
          }
          var postdata = {};
          postdata.list_id = parseInt($scope.data.currItem.scpemail_contact_wb_lists[$scope.index].list_id)
          requestApi.post({classId: "scpemail_contact_list", action: "del_contact", data: postdata})
            .then(function (data) {
              //BasemanService.notice("删除成功", "alert-info");
              $scope.data.currItem.scpemail_contact_wb_lists.splice($scope.index, 1);
            });
        };


        /*==========================================外部邮箱 外部通信录 添加最近联系人 start===========================================*/
        $scope.cha_contact_man = function () {
          $scope.add_index = false;
          if (!$scope.add_index) {
            if (($scope.index == '' || $scope.index == undefined) && ($scope.index != 0)) {
              BasemanService.notice("请选中一行联系人", "alert-info");
              return;
            }
          }
          BasemanService.openFrm("views/baseman/addgrouppeop_out.html", cha_contact_man, $scope, "", "").result.then(function (res) {
            var postdata = res;
            postdata.emailtype = 4;
            requestApi.post({classId: "scpemail_contact_list", action: "add_contact", data: postdata})
              .then(function (data) {
                BasemanService.notice("修改成功", "alert-info");
              })
          })
        };

        var cha_contact_man = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
          /*cha_contact_man = SinoccCommon.extend(cha_contact_man, ctrl_bill_public);
           cha_contact_man.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);*/
          controllerApi.extend({
            controller: ctrl_bill_public.controller,
            scope: $scope
          });
          $scope.data = {};
          $scope.data.currItem = {};
          if ($scope.add_index) {

          } else {
            $scope.data.currItem = $scope.$parent.data.currItem.scpemail_contact_wb_lists[$scope.$parent.index];
          }

          $scope.ok = function () {
            if ($scope.data.currItem.contactname == undefined || $scope.data.currItem.contactname == '') {
              swalApi.info("名称为空");
              return;
            }
            if ($scope.data.currItem.contactuserid == undefined || $scope.data.currItem.contactuserid == '') {
              swalApi.info("邮箱为空");
              return;
            }
            $modalInstance.close($scope.data.currItem);
          }
          $scope.cancel = function () {
            $modalInstance.dismiss(close);
          }
        }
        /*==========================================外部邮箱 外部通信录 添加最近联系人 end===========================================*/


        /**
         * 树单击-增加收件人/抄送人div-返回数据
         * @param str
         * @param data
         * @param index 3为机构 隐藏生成div的<id>
         * @returns {*}
         */
        $scope.addpeople_str = function (str, data, index) {
          if (str == '' || str == undefined) {
            str = ''
          }
          if (data.contactname) {
            data.username = data.contactname
          }
          if (data.contactuserid) {
            data.userid = data.contactuserid
          }
          if (data.username) {
            if (str == '') {
              str += data.username;
              if (data.userid) {
                str += '<' + data.userid + '>'
              }
            } else {
              if (str.indexOf("<" + data.userid + ">") > -1) {
                return str;
              }
              str += ';';
              str += data.username;
              if (data.userid) {
                str += '<' + data.userid + '>'
              }

            }
            if (index == 3) {
              var add_elem = $scope.add_elem(data.username, data.is_bumen, data.userid, true);
            } else {
              var add_elem = $scope.add_elem(data.username, data.is_bumen, data.userid);
            }
            if (index) {
              //弹出窗选人的时候加的
              //手动选择加div的input
              if (index == 3) {
                $('#final3').before(add_elem);
              } else if (index == 2) {
                $('#final1').before(add_elem);
              } else {
                $('#final').before(add_elem);
              }
              $scope.addfunction();
            } else {
              if ($scope.focus == 2) {
                $('#final1').before(add_elem);
              } else {
                $('#final').before(add_elem);
              }
              $scope.addfunction();
            }
          }
          return str;
        };

        /**
         * 收/抄-焦点
         * @param index
         */
        $scope.mousedown = function (index) {
          $timeout(function () {
            $scope.focus = index;
          });
        };


        /*==========================================内部邮箱 增加分组 start===========================================*/
        $scope.addgroup = function (flag) {
          if ($scope.node) {
            delete $scope.node;
          }
          BasemanService.openFrm("views/baseman/addgroup.html", addgroup, $scope, "", "").result.then(function (res) {
            var postdata = res;
            if (flag == 2) {
              postdata.emailtype = 4;
            } else {
              postdata.emailtype = 3;
            }
            requestApi.post({
              classId: "scpemail_contact_list",
              action: "add_contact_group",
              data: postdata
            }).then(function (data) {
              data.name = data.list_name;
              data.id = data.list_id
              data.isParent = true;
              if (flag == 2) {
                $scope.treeDemo_out.addNodes(null, data);
                var node_parent = $scope.treeDemo_out.getNodesByParam("id", data.id);
                for (var i = 0; i < data.scpemail_contact_group_lists.length; i++) {
                  data.scpemail_contact_group_lists[i].name = data.scpemail_contact_group_lists[i].contactname;
                  data.scpemail_contact_group_lists[i].id = data.scpemail_contact_group_lists[i].contactid;
                  data.scpemail_contact_group_lists[i].pId = data.id;
                }
                $scope.treeDemo_out.addNodes(node_parent[0], data.scpemail_contact_group_lists);
                $scope.data.currItem.scpemail_contact_group_wb_lists = $scope.data.currItem.scpemail_contact_group_wb_lists.concat(data.scpemail_contact_group_lists);
                $scope.data.currItem.scpemail_contact_group_wb_lists.push(data);
              } else {
                $scope.treeDemo_in.addNodes(null, data);
                var node_parent = $scope.treeDemo_in.getNodesByParam("id", data.id);
                for (var i = 0; i < data.scpemail_contact_group_lists.length; i++) {
                  data.scpemail_contact_group_lists[i].name = data.scpemail_contact_group_lists[i].contactname;
                  data.scpemail_contact_group_lists[i].id = data.scpemail_contact_group_lists[i].contactid;
                  data.scpemail_contact_group_lists[i].pId = data.id;
                }
                $scope.treeDemo_in.addNodes(node_parent[0], data.scpemail_contact_group_lists);
                $scope.data.currItem.scpemail_contact_group_lists = $scope.data.currItem.scpemail_contact_group_lists.concat(data.scpemail_contact_group_lists);
                $scope.data.currItem.scpemail_contact_group_lists.push(data);
              }

              //BasemanService.notice("分组创建成功", "alert-info");
              swalApi.success('分组创建成功');
            })
          })
        };

        var addgroup = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance, $parent) {
          $scope.$parent = $parent;
          /*addgroup = SinoccCommon.extend(addgroup, ctrl_bill_public);
           addgroup.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);*/
          controllerApi.extend({
            controller: ctrl_bill_public.controller,
            scope: $scope
          });

          $scope.data = {};
          $scope.data.currItem = {};
          //分组联系人列表
          if ($scope.$parent.node) {
            $scope.data.currItem.scpemail_contact_group_lists = $scope.$parent.node.children;
            $scope.data.currItem.list_name = $scope.$parent.node.list_name;
            $scope.data.currItem.list_id = $scope.$parent.node.list_id;
          } else {
            $scope.data.currItem.scpemail_contact_group_lists = [];
            $scope.data.currItem.list_name = '';
            $scope.data.currItem.list_id = 0;
          }

          $scope.ok = function () {
            if ($scope.data.currItem.list_name == undefined || $scope.data.currItem.list_name == '') {
              swalApi.info("分组名称为空");
              return;
            }
            $modalInstance.close($scope.data.currItem);
          }
          $scope.cancel = function () {
            $modalInstance.dismiss(close);
          }
          //删除联系人
          $scope.del = function (index) {
            $scope.data.currItem.scpemail_contact_group_lists.splice(index, 1);
          }
          var setting = {
            async: {
              enable: true,
              url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
              autoParam: ["id", "name=n", "level=lv"],
              otherParam: {
                "flag": 1
              },
              dataFilter: filter
            },
            view: {
              showIcon: showIconForTree
            },
            data: {
              simpleData: {
                enable: true
              }
            },
            callback: {
              onDblClick: onDblClick
              //onRightClick : OnRightClick,//右键事件
              //onClick : menuShowNode
            }
          };

          //这个是异步
          /*function filter(treeId, parentNode, childNodes) {
           var treeNode = parentNode;
           if (treeNode && treeNode.children) {
           return;
           }
           if (treeNode) {
           var postdata = treeNode
           } else {
           var postdata = {};
           }
           postdata.flag = 1;
           postdata.emailtype = 3;
           if(postdata.id){
           postdata.orgid = parseInt(postdata.id);
           }
           var obj = BasemanService.RequestPostNoWait('scpemail_contact_list', 'search', postdata)
           var children = obj.data.scporgs;
           if (children) {
           treeNode.children = [];
           for (var i = 0; i < children.length; i++) {
           if (parseInt(children[i].sysuserid) > 0) {
           children[i].name = children[i].username;
           } else {
           children[i].isParent = true;
           }

           }
           }
           return children;

           }*/

          /**
           * 树双击 添加人员至分组
           */
          function onDblClick(treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo2");
            var node = zTree.getSelectedNodes();
            var object = {};
            if (node[0].username) {
              //object.orgname = node[0].orgname;
              object.contactid = node[0].sysuserid;
              object.contactname = node[0].username;
              object.contactuserid = node[0].userid;
              object.name = object.contactname;
              object.id = object.contactid;
              if ($scope.data.currItem.list_id) {
                object.list_id = $scope.data.currItem.list_id;
              }
            }
            if ($scope.data.currItem.scpemail_contact_group_lists === undefined) {
              $scope.data.currItem.scpemail_contact_group_lists = [];
            }
            for (var i = 0; i < $scope.data.currItem.scpemail_contact_group_lists.length; i++) {
              if ($scope.data.currItem.scpemail_contact_group_lists[i].contactuserid == object.contactuserid) {
                return;
              }
            }
            if (object.contactname) {
              $scope.data.currItem.scpemail_contact_group_lists.push(object);
            }
          }

          function showIconForTree(treeId, treeNode) {
            return !treeNode.isParent;
          };
          $timeout(function () {
            $.fn.zTree.init($("#treeDemo2", parent.document), setting, $scope.$parent.data.scporgs);
          })
        };
        /*==========================================内部邮箱 增加分组 end===========================================*/


        /*==========================================内部邮箱 删除分组 start===========================================*/
        $scope.delgroup = function (flag) {
          if (flag == 2) {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo_out");
          } else {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
          }

          var node = zTree.getSelectedNodes();
          if ((node[0] == undefined || node[0].list_id == undefined || node[0].list_id == '') || (node[0].contactuserid)) {
            swalApi.info("请选中一组!");
            return;
          }
          swalApi.confirm("是否删除分组 " + node[0].name + " ？")
            .then(function () {
              requestApi.post({
                classId: "scpemail_contact_list", action: "del_contact_group",
                data: {
                  list_id: parseInt(node[0].list_id)
                }
              })
                .then(function (data) {
                  if (flag == 2) {
                    $scope.treeDemo_out.removeNode(node[0]);
                    var postdata = {emailtype: 4}
                  } else {
                    $scope.treeDemo_in.removeNode(node[0]);
                    var postdata = {emailtype: 3}
                  }
                  requestApi.post({
                    classId: "scpemail_contact_list",
                    action: "search",
                    data: postdata
                  })
                    .then(function (data) {
                      if (flag == 2) {
                        //内部邮件通讯显示
                        for (var i = 0; i < data.scpemail_contact_group_wb_lists.length; i++) {
                          data.scpemail_contact_group_wb_lists[i].id = parseInt(data.scpemail_contact_group_wb_lists[i].list_id)
                          data.scpemail_contact_group_wb_lists[i].pId = parseInt(data.scpemail_contact_group_wb_lists[i].list_pid)
                          if (data.scpemail_contact_group_wb_lists[i].contactname) {
                            data.scpemail_contact_group_wb_lists[i].name = (data.scpemail_contact_group_wb_lists[i].contactname)
                          } else {
                            data.scpemail_contact_group_wb_lists[i].name = (data.scpemail_contact_group_wb_lists[i].list_name);
                            data.scpemail_contact_group_wb_lists[i].isParent = true;
                          }
                        }
                        $scope.data.currItem.scpemail_contact_group_wb_lists = data.scpemail_contact_group_wb_lists;
                      } else {
                        //内部邮件通讯显示
                        for (var i = 0; i < data.scpemail_contact_group_lists.length; i++) {
                          data.scpemail_contact_group_lists[i].id = parseInt(data.scpemail_contact_group_lists[i].list_id)
                          data.scpemail_contact_group_lists[i].pId = parseInt(data.scpemail_contact_group_lists[i].list_pid)
                          if (data.scpemail_contact_group_lists[i].contactname) {
                            data.scpemail_contact_group_lists[i].name = (data.scpemail_contact_group_lists[i].contactname)
                          } else {
                            data.scpemail_contact_group_lists[i].name = (data.scpemail_contact_group_lists[i].list_name);
                            data.scpemail_contact_group_lists[i].isParent = true;
                          }
                        }
                        $scope.data.currItem.scpemail_contact_group_lists = data.scpemail_contact_group_lists;
                      }

                    });
                  swalApi.success("删除成功!");
                })
            });
        }
        /*==========================================内部邮箱 删除分组 end===========================================*/


//全选
        $scope.selectall = function () {
          if ($scope.data.type == 2) {
            for (var i = 0; i < $scope.data.emails.length; i++) {
              $scope.data.emails[i].checkbox = 2;
            }
          } else {
            for (var i = 0; i < $scope.data.emails.length; i++) {
              $scope.data.emails[i].checkbox = 1;
            }
          }
        }
//点击未读邮件
        $scope.unread = function () {
          $scope.search(100);
        };

        /**
         * 刷新
         */
        $scope.refresh_emails = function () {
          var item = $scope.re_left_data().item;
          $scope.show_box($scope.data.flag || 99, undefined, item, true);
        };

//星标邮件
        $scope.batchstar = function () {
          var postdata = {};
          postdata.emailofemails = [];
          for (var i = $scope.data.emails.length - 1; i > -1; i--) {
            if ($scope.data.emails[i].checkbox == 2) {
              postdata.emailofemails.push($scope.data.emails[i]);
            }
          }
          if (postdata.emailofemails.length == 0)
            return swalApi.info('请先选择邮件');

          $scope.readstep = 0;
          star_email(postdata.emailofemails[$scope.readstep].emailid);

          function star_email(id) {
            requestApi.post({
                classId: "scpemailtrk", action: "addmyflag",
                data: {
                  emailid: parseInt(id), myflag: 999
                }
              }
            )
              .then(function (data) {
                $scope.readstep = $scope.readstep + 1;
                if ($scope.readstep == postdata.emailofemails.length) {
                  for (var i = 0; i < postdata.emailofemails.length; i++) {
                    postdata.emailofemails[i].myflag = 999;
                  }
                  return;
                }
                postdata.emailofemails.length >= $scope.readstep && star_email(postdata.emailofemails[$scope.readstep].emailid);
              })
          }
        };

        /**
         * 批量未读
         */
        $scope.batchunread = function () {
          var postdata = {emailtype: 3};
          postdata.emailofemails = [];
          for (var i = 0; i < $scope.data.emails.length; i++) {
            if ($scope.data.emails[i].checkbox == 2) {
              postdata.emailofemails.push($scope.data.emails[i]);
            }
          }
          if (postdata.emailofemails.length == 0)
            return swalApi.info('请先选择邮件');

          requestApi.post({classId: "scpemail", action: "update_wd_email", data: postdata})
            .then(function (data) {
              /*手动更新数据*/
              for (var i = 0; i < postdata.emailofemails.length; i++) {
                postdata.emailofemails[i].flag = 1;
              }
              $scope.data.receivenew = data.receivenew;
            })
            .then(function () {
              $scope.get_scpemailc()
            })
        };
//批量删除
        $scope.delete_emails = function () {
          var postdata = {};
          postdata.emailofemails = [];
          for (var i = $scope.data.emails.length - 1; i > -1; i--) {
            if ($scope.data.emails[i].checkbox == 2) {
              postdata.emailofemails.push($scope.data.emails[i]);
            }
          }

          if (postdata.emailofemails.length == 0) {
            swalApi.info({
              title: '请选择要删除的数据!'
            });
            return false;
          }

          /* if ($scope.data.flag == 5 || $scope.data.flag == 10) {
           ds.dialog.confirm("邮件将永久删除，是否继续", function () {
           requestApi.post({classId: "scpemail", action: "batchdelete", data: postdata})
           .then(function (data) {
           swalApi.success({
           title: '删除成功!'
           });
           $scope.show_box($scope.data.flag);

           })
           }, function () {

           });
           } else {
           requestApi.post({classId: "scpemail", action: "batchhide", data: postdata})
           .then(function (data) {
           swalApi.success({
           title: '删除成功!'
           });
           $scope.show_box($scope.data.flag);

           })
           }*/


          var action;
          if ($scope.data.flag == 5 || $scope.data.flag == 10 || $scope.data.flag == 4.5) {
            //删 垃圾箱/?/已删除
            action = "batchdelete";
          } else {
            action = "batchhide";
          }

          swalApi.confirmThenSuccess({
            title: (action == "batchdelete" || $scope.data.flag == 4) ? "彻底删除后邮件将无法恢复，您确定要删除吗?" : "是否删除邮件?",
            okFun: function () {
              //函数区域
              requestApi.post("scpemail", action, postdata)
                .then(function (data) {
                  $scope.show_box($scope.data.flag);
                });
            },
            okTitle: '删除成功'
          });
        };

        /**
         * 已读
         */
        $scope.is_read = function () {
          var postdata = {};
          postdata.read_email = [];
          for (var i = 0; i < $scope.data.emails.length; i++) {
            if ($scope.data.emails[i].checkbox == 2) {
              postdata.read_email.push($scope.data.emails[i]);
            }
          }
          if (postdata.read_email.length == 0)
            return swalApi.info('请先选择邮件');

          $scope.readstep = 0;
          postdata.read_email.length >= $scope.readstep && read_email(postdata.read_email[$scope.readstep].emailid);

          function read_email(id) {
            requestApi.post({
                classId: "scpemail", action: "select",
                data: {
                  emailid: parseInt(id)
                }
              }
            )
              .then(function (data) {
                /*手动更新数据*/
                postdata.read_email[$scope.readstep].flag = 2;
                $scope.readstep = $scope.readstep + 1;
                if ($scope.readstep == postdata.read_email.length) {
                  return;
                }
                postdata.read_email.length >= $scope.readstep && read_email(postdata.read_email[$scope.readstep].emailid);
              })
          }
        }
//清空发件内容
        $scope.clearsend_email = function () {
          // $('.high').removeClass('high');
          $scope.index = '';
          $scope.data.is_search = 1;
          $scope.data.username = '';
          $scope.data.currItem.search_peop = '';
          $scope.data.currItem.search_linep = '';
          $scope.data.currItem.search_org = '';
          // 清空邮件id
          $scope.data.currItem.emailid = 0;

          $scope.data.currItem.snedto = '';
          $scope.data.currItem.snedtoorg = '';
          $scope.data.currItem.totype = '';
          $scope.data.currItem.cc = '';
          $scope.data.currItem.subject_send = '';
          $scope.data.currItem.attachofemails1 = [];
          $scope.data.currItem.cctype = '';

          /*清空树勾选*/
          var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
          treeObj.checkAllNodes(false);
          /*清空自动回执*/
          $scope.data.currItem.autoreturn = 1;
          /*隐藏编辑框*/
          $scope.right_edit_elem_hide();

          var str = '';
          if ($scope.data.flag <= 5) {
            for (var i = 0; i < $scope.data.usermails.length; i++) {
              if ($scope.data.usermails[i].email == '内部邮箱') {
                if ($scope.data.usermails[i].mail_autograph) {
                  str = '<p><br></br></p><p><br></br></p><p><br></br></p><p><br>——————————————</br></p>' + $scope.data.usermails[i].mail_autograph;
                }
              }
            }
            ;
            //   $('.summernote').summernote('code', str);
          } else {

            for (var i = 0; i < $scope.data.usermails.length; i++) {
              if (parseInt($scope.data.usermails[i].isdefault) == 2) {
                if ($scope.data.usermails[i].mail_autograph) {
                  str = '<p><br></br></p><p><br></br></p><p><br></br></p><p><br>——————————————</br></p>' + $scope.data.usermails[i].mail_autograph;
                }
              }
            }
            ;
            $('.summernote').summernote('code', str);
          }
          $('.summernote').summernote('code', '');
          //清空收件人
          $('#toAreaCtrl .addr_base,#toAreaCtrl1 .addr_base,#toAreaCtrl3 .addr_base').remove();
        };


        /**
         * 判断是否需要保存草稿
         */
        $scope.is_draft = function () {
          return $q(function (resolve, reject) {
            if ($scope.data.show != 2) {
              resolve()
            } else {
              //如果是有emailid的那么要判断该数据是否已经被改变了；如果没有，那么直接提示是否保存草稿
              if ($scope.data.currItem.emailid != undefined && ($scope.data.currItem.emailid != 0)) {
                requestApi.post({
                  classId: "scpemail", action: "select",
                  data: {
                    emailid: parseInt($scope.data.currItem.emailid)
                  }
                })
                  .then(function (data) {
                    var jud1 = ($scope.data.currItem.snedto.indexOf(data.sendtoname) > -1 ? true : false) && (data.sendtoname.indexOf($scope.data.currItem.snedto) > -1 ? true : false);
                    var jud2 = ($scope.data.currItem.cc.indexOf(data.ccname) > -1 ? true : false) && (data.ccname.indexOf($scope.data.currItem.cc) > -1 ? true : false);
                    var content = $('.summernote').summernote('code');

                    var jud3 = (content.indexOf(data.content) > -1 ? true : false) && (data.content.indexOf(content) > -1 ? true : false);
                    if (jud1 && jud2 && jud3) {
                      resolve();
                    } else {
                      /*ds.dialog.confirm('数据已改变是否保存草稿？', function () {
                       $scope.send_email(2);
                       }, function () {
                       $scope.clearsend_email();
                       /!**$scope.data.show =2;
                       $scope.clearsend_email();
                       $scope.$apply();*!/
                       });*/
                      swal({
                          title: "数据已改变是否保存草稿？",
                          type: "warning",
                          showCancelButton: true,
                          confirmButtonText: "确定",
                          cancelButtonText: "取消",
                          allowEscapeKey: false, //如果设置为true，用户可以通过按下Escape键关闭弹窗。
                          allowOutsideClick: false, //如果设置为true，用户点击弹窗外部可关闭弹窗。
                          timer: null//不允许超时消失
                        },
                        function (isConfirm) {
                          if (isConfirm) {
                            $scope.send_email(2);
                            resolve()
                          } else {
                            $scope.clearsend_email();
                            resolve()
                          }
                        });
                    }
                  })
              } else {
                var content = $('.summernote').summernote('code');
                var jud = ($scope.data.currItem.emailid == undefined || $scope.data.currItem.emailid == 0) && ($scope.data.currItem.snedto == undefined || $scope.data.currItem.snedto == '') && ($scope.data.currItem.cc == undefined || $scope.data.currItem.cc == '') && (content == '')
                if (jud) {
                  resolve()
                } else {
                  /*ds.dialog.confirm('是否保存草稿？', function () {
                   $scope.send_email(2);
                   }, function () {
                   $scope.clearsend_email();
                   /!**$scope.data.show =2;
                   $scope.clearsend_email();
                   $scope.$apply();*!/
                   });*/
                  swal({
                      title: "是否保存草稿？",
                      type: "warning",
                      showCancelButton: true,
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      allowEscapeKey: false, //如果设置为true，用户可以通过按下Escape键关闭弹窗。
                      allowOutsideClick: false, //如果设置为true，用户点击弹窗外部可关闭弹窗。
                      timer: null//不允许超时消失
                    },
                    function (isConfirm) {
                      if (isConfirm) {
                        $scope.send_email(2);
                        resolve()
                      } else {
                        $scope.clearsend_email();
                        resolve()
                      }
                    });
                }
              }
            }
          })
        };


        //在离开之前要判断是否是发件箱，如果是发件箱在离开的时候如果数据要提醒是否保存草稿
        //item外部邮箱信息/自定义文件夹信息
        //isRefresh是否刷新
        $scope.show_box = function (flag, e, item, isRefresh) {
          $q
            .when($scope.is_draft())
            .then(function () {
              $scope.data.show = 1;
              $scope.data.flag = flag;
              /*左边栏选中状态*/
              if (e) {
                $(e.currentTarget).parent().siblings().removeClass("high");
                $(e.currentTarget).parent().addClass("high");
              }
              if ($scope.data.flag == 6) {
                /*外部邮件*/
                $('#inn_mail').children().removeClass("high");
                $('#scpe_mail').children().removeClass("high");
              } else if ($scope.data.flag == 4.7) {
                /*自定义文件*/
                $('#inn_mail').children().removeClass("high");
                $('#out_mail').children().removeClass("high");
              } else {
                /*内部邮件*/
                $('#out_mail').children().removeClass("high");
                $('#scpe_mail').children().removeClass("high");
              }

              if ((flag) == 1 || (flag) == 6) {
                $scope.data.title = "收件箱";
                (flag) == 6 && ($scope.data.title += item.email);
                $scope.search(99, item, isRefresh);
              } else if ((flag) == 2) {
                $scope.data.title = "已发邮件";
                $scope.search(88, item, isRefresh);
              } else if ((flag) == 3) {
                $scope.data.title = "重要邮件";
                $scope.search(999, item, isRefresh);
              } else if ((flag) == 4) {
                $scope.data.title = "草稿";
                $scope.search(77, item, isRefresh);
              } else if ((flag) == 5) {
                $scope.data.title = "垃圾箱";
                $scope.search(66, item, isRefresh);
              } else if ((flag) == 4.5) {
                $scope.data.title = "已删除";
                $scope.search(4, item, isRefresh);
              } else if ((flag) == 4.7) {
                $scope.data.title = "自定义文件夹";
                $scope.search(7777, item, isRefresh);
              } else {
                $scope.data.title = "";
              }
            })
            .then($scope.autoHeight);
        };

        $scope.sizeshow = function (flag) {
          $scope.data.sizeshow = flag;
        };

        /**
         * 搜索邮件
         */
        $scope.sendReceive_email = function (flag) {
          var postdata = {};
          $scope.data.show = 1;
          //有条件则隐藏分页栏
          $scope.hidePage = $scope.data.sqlwhere ? true : false;

          if (flag == 1) {
            if ($scope.data.sqlwhere == undefined || $scope.data.sqlwhere == '') {
              $scope.data.sqlwhere = '';
            }
            postdata.sendtoname = $scope.data.sqlwhere;
            if ($scope.data.flag > 5) {
              postdata.emailtype = 4;
            } else {
              postdata.emailtype = 3;
            }

          } else {
            postdata.sendtoname = $scope.data.currItem.email_name;
          }

          requestApi.post({classId: "scpallemail", action: "select_name_all", data: postdata})
            .then(function (data) {
              $scope.data.emails = data.emails;
              for (var i = 0; i < $scope.data.emails.length; i++) {
                if ($scope.data.emails[i].receivetime == '' || $scope.data.emails[i].receivetime == undefined) {
                  $scope.data.emails[i].receivetime = $scope.data.emails[i].sendtime;
                }
              }
              //星期一
              $scope.data.xq1_emails = [];
              //星期二
              $scope.data.xq2_emails = [];
              //星期三
              $scope.data.xq3_emails = [];
              //星期四
              $scope.data.xq4_emails = [];
              //星期五
              $scope.data.xq5_emails = [];
              //星期六
              $scope.data.xq6_emails = [];
              //今天
              $scope.data.today_emails = [];
              //上周
              $scope.data.lastweek_emails = [];
              //更早
              $scope.data.early_emails = [];
              var today = new Date().toDateString()
              var j = 0;
              //1.判断今天是星期几
              if (today.indexOf('Mon') > -1) {
                //星期1
                j = 1;
              }
              if (today.indexOf('Tue') > -1) {
                //星期2
                j = 2;
              }
              if (today.indexOf('Wed') > -1) {
                //星期3
                j = 3;
              }
              if (today.indexOf('Thu') > -1) {
                //星期4
                j = 4;
              }
              if (today.indexOf('Fri') > -1) {
                //星期5
                j = 5;
              }
              if (today.indexOf('Sat') > -1) {
                //星期6
                j = 6;
              }
              if (today.indexOf('Sun') > -1) {
                //星期天
                j = 7;
              }
              for (var i = 0; i < $scope.data.emails.length; i++) {
                //没有receivetime时直接放入更早
                if (!$scope.data.emails[i].receivetime) {
                  $scope.data.early_emails.push($scope.data.emails[i]);
                  continue;
                }

                /**
                 * new Date(ie需  **** / ** / ** 格式,不能用****-**-**)
                 */
                //今天
                if (new Date($scope.data.emails[i].receivetime.replace(/-/g, "/")).toDateString() === new Date().toDateString()) {
                  $scope.data.today_emails.push($scope.data.emails[i]);
                }
                var day = getDays(new Date($scope.data.emails[i].receivetime.replace(/-/g, "/")).Format('yyyy-MM-dd'), new Date().Format('yyyy-MM-dd'))
                //console.warn(-);
                //var day = Math.abs(new Date($scope.data.emails[i].receivetime)-new Date());
                //星期6
                if (day <= (j - 6) && day > (j - 7) && (j - 6) != 0) {
                  $scope.data.xq6_emails.push($scope.data.emails[i]);
                }
                if (day <= (j - 5) && day > (j - 6) && (j - 5) != 0) {
                  $scope.data.xq5_emails.push($scope.data.emails[i]);
                }
                if (day <= (j - 4) && day > (j - 5) && (j - 4) != 0) {
                  $scope.data.xq4_emails.push($scope.data.emails[i]);
                }
                if (day <= (j - 3) && day > (j - 4) && (j - 3) != 0) {
                  $scope.data.xq3_emails.push($scope.data.emails[i]);
                }
                if (day <= (j - 2) && day > (j - 3) && (j - 2) != 0) {
                  $scope.data.xq2_emails.push($scope.data.emails[i]);
                }
                if (day <= (j - 1) && day > (j - 2) && (j - 1) != 0) {
                  $scope.data.xq1_emails.push($scope.data.emails[i]);
                }

                //昨天
                /**if(new Date($scope.data.emails[i].receivetime).toDateString() === new Date(new Date()-24*3600*1000).toDateString()){
					  $scope.data.yesterday_emails.push($scope.data.emails[i]);
				  }*/
                //上周
                if (day <= (j + 6) && day > (j)) {
                  $scope.data.lastweek_emails.push($scope.data.emails[i]);
                }
                //更早
                if (day > (j + 6)) {
                  $scope.data.early_emails.push($scope.data.emails[i]);
                }
                $.base64.utf8encode = true;
                var param = {
                  id: parseInt($scope.data.emails[i][$scope.objconf.key]),
                  userid: window.strUserId
                }
                $scope.data.emails[i].url_param = $.base64.btoa(JSON.stringify(param), true);
              }
              if (data.pagination.length > 0) {
                BasemanService.pageInfoOp($scope, data.pagination);
              }
            })
        };


        /**
         * 查看邮件详情
         * (草稿是特殊情况)
         * (写信show(2))
         * @param flag
         * @param id
         */
        $scope.show = function (flag, id) {
          //记录上次的路
          $scope.data.last_show = $scope.data.show;
          if (flag == 2) {
            /*点击外部邮件写信时,根据左边栏确定当前外部邮件*/
            var data = $scope.re_left_data();
            if (data && data.item) {
              $scope.data.usermailid = data.item.usermailid;
              $scope.data.email = data.item.email;
            }
            $scope.clearsend_email();
          }

          //点击写信的时候有用
          $scope.data.show = flag;
          if ($scope.data.title == '草稿' && id) {
            $scope.data.show = 2;
          }
          if (id) {
            var postdata = {emailid: parseInt(id)};
            if ($scope.data.flag > 5) {
              postdata.emailtype = 4;
            } else {
              postdata.emailtype = 3;
            }
            postdata.flag = 99;
            requestApi.post({classId: "scpemail", action: "select", data: postdata})
              .then(function (data) {
                $scope.data.currItem = $.extend({}, $scope.data.currItem, data)
                var left = $scope.data.currItem.fromuser.indexOf('<');
                var right = $scope.data.currItem.fromuser.indexOf('>');
                $scope.data.currItem.email = $scope.data.currItem.fromuser.substr(left + 1, right - left - 1);

                /*处理收件人收件机构*/
                var sendtoname_array = $scope.data.currItem.sendtoname.split(';');
                var sendto_array = $scope.data.currItem.sendto.split(';');
                var totype_array = $scope.data.currItem.totype.split(';');
                $scope.data.currItem.sendtoname_array = [];//收件人name
                $scope.data.currItem.sendto_array = [];//收件人id
                $scope.data.currItem.totype_array = [];//收件人type
                $scope.data.currItem.sendtoorg_array = [];//收件机构name
                $scope.data.currItem.sendtoo_array = [];//收件机构id
                $scope.data.currItem.toorgtype_array = [];//收件机构type
                for (var i = 0; i < totype_array.length; i++) {
                  if (totype_array[i] == '12') {
                    $scope.data.currItem.sendtoorg_array.push(sendtoname_array[i]);
                    $scope.data.currItem.sendtoo_array.push(sendto_array[i]);
                    $scope.data.currItem.toorgtype_array.push(totype_array[i]);
                  }
                  if (totype_array[i] == '13') {
                    $scope.data.currItem.sendtoname_array.push(sendtoname_array[i]);
                    $scope.data.currItem.sendto_array.push(sendto_array[i]);
                    $scope.data.currItem.totype_array.push(totype_array[i]);
                  }
                }
                /*处理抄送人*/
                if ($scope.data.currItem.cc) {
                  $scope.data.currItem.cc_array = $scope.data.currItem.cc.split(';');
                }
                if ($scope.data.currItem.ccname) {
                  $scope.data.currItem.ccname_array = $scope.data.currItem.ccname.split(';');
                }


                if ($scope.data.title != '草稿') {
                  for (var i = 0; i < $scope.data.currItem.attachofemails.length; i++) {
                    $scope.data.currItem.attachofemails[i].icon_file = BasemanService.getAttachIcon($scope.data.currItem.attachofemails[i].refname);
                  }
                  if (data.contentid < 0) {
                    var option={
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
                          del: ['style', 'class', 'color'],
                          table: ['style', 'class'],
                          td: ['style', 'class'],
                          tbody: ['style', 'class'],
                          tr: ['style', 'class'],
                          thead: ['style', 'class'],
                          tfoot: ['style', 'class'],
                          caption: ['style', 'class']
                      },
                        onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
                          if (name.substr(0, 5) === 'data-') {
                            // 通过内置的escapeAttrValue函数来对属性值进行转义
                            return name + '="' + xss.escapeAttrValue(value) + '"';
                          }
                      },
                  }
                    var html = xss($scope.data.currItem.content,option);
                    $scope.data.contentHtml = $sce.trustAsHtml(html);
                  }
                  if ($scope.data.title == '收件箱') {
                    /*影响分页保存的页码*/
                    /*$scope.search(99);
                     $scope.data.show = flag;*/
                  }
                  //处理显示收件人和抄送人

                } else {

                  $scope.data.currItem.snedto = $scope.data.currItem.sendtoname;
                  if ($scope.data.currItem.ccname) {
                    $scope.data.currItem.cc = $scope.data.currItem.ccname
                  }
                  $scope.show_people();
                  $scope.data.currItem.subject_send = $scope.data.currItem.subject;
                  if ($scope.data.currItem.content) {
                    var option={
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
                        table: ['style', 'class','width','cellpadding','cellspacing'],
                        td: ['style', 'class'],
                        tbody: ['style', 'class'],
                        tr: ['style', 'class'],
                        th: ['style', 'class'],
                        thead: ['style', 'class'],
                        tfoot: ['style', 'class'],
                        caption: ['style', 'class'],
                        ul: ['style', 'class'],
                        li: ['style', 'class'],
                        blockquote : ['style', 'class',"cite"],
                        section : ['powered-by','style', 'class'],
                        video: ["autoplay", "controls", "loop", "preload", "src", "height", "width"],
                        audio: ["autoplay", "controls", "loop", "preload", "src"],
                        small: ['style', 'class', 'color'],
                        col: ["align", "valign", "span", "width",'style', 'class', 'color'],
                        colgroup: ["align", "valign", "span", "width",'style', 'class', 'color'],
                        del: ["datetime",'style', 'class', 'color'],
                        details: ["open",'style', 'class', 'color'],
                        abbr: ["title"],
                        address: ['style', 'class'],
                        area: ["shape", "coords", "href", "alt",'style', 'class'],
                        article: ['style', 'class'],
                        aside: ['style', 'class'],
                        big: ['style', 'class'],
                        center: ['style', 'class'],
                        cite: ['style', 'class'],
                        code: ['style', 'class'],
                        dd: ['style', 'class'],
                        details: ["open",'style', 'class'],
                        dl: ['style', 'class'],
                        dt: ['style', 'class'],
                        em: ['style', 'class'],
                        header: ['style', 'class'],
                        hr: ['style', 'class'],
                        mark: ['style', 'class'],
                        nav: ['style', 'class'],
                        ol: ['style', 'class'],
                        pre: ['style', 'class'],
                        s: ['style', 'class']
                      },
                        onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
                        if (name.substr(0, 5) === 'data-') {
                          // 通过内置的escapeAttrValue函数来对属性值进行转义
                          return name + '="' + xss.escapeAttrValue(value) + '"';
                        }
                      },
                    }
                    var html = xss($scope.data.currItem.content,option);
                    $('.summernote').summernote('code', html)
                  } else {
                    var empty = '';
                    $('.summernote').summernote('code', empty);
                  }
                  //深度拷贝附件
                  $scope.data.currItem.attachofemails1 = []
                  if ($scope.data.currItem.attachofemails) {
                    for (var i = 0; i < $scope.data.currItem.attachofemails.length; i++) {
                      var object = {};
                      $scope.data.currItem.attachofemails[i].docid = $scope.data.currItem.attachofemails[i].refid;
                      $scope.data.currItem.attachofemails[i].docname = $scope.data.currItem.attachofemails[i].refname;
                      $scope.data.currItem.attachofemails[i].oldsize = $scope.data.currItem.attachofemails[i].refsize;
                      $scope.data.currItem.attachofemails[i].createtime = new Date().Format('yyyy-MM-dd hh:mm:ss');
                      for (name in $scope.data.currItem.attachofemails[i]) {
                        object[name] = $scope.data.currItem.attachofemails[i][name];
                      }
                      $scope.data.currItem.attachofemails1.push(object);
                    }

                  }
                }

              })
              .then($scope.getUDBtn)
              .then($scope.autoHeight)
              .then($scope.get_scpemailc)
          }
        };

        /**
         * 收件人/抄送人生成div
         */
        $scope.show_people = function () {
          $scope.data.currItem.snedto = "";
          $scope.data.currItem.snedtoorg = "";
          $scope.data.currItem.cc = "";
          if ($scope.data.currItem.sendtoname_array) {
            for (var i = 0; i < $scope.data.currItem.sendtoname_array.length; i++) {
              var itemname = $scope.data.currItem.sendtoname_array[i];
              var itemid = $scope.data.currItem.sendto_array[i];
              /*有@时div中不显示id*/
              var add_elem = $scope.add_elem(toTxt(itemname), toTxt(itemname), itemid.indexOf("@") == -1 ? itemid : undefined);
              $('#final').before(add_elem);
              $scope.data.currItem.snedto += itemname + "<" + itemid + ">;";
            }
          }
          if ($scope.data.currItem.ccname_array) {
            for (var i = 0; i < $scope.data.currItem.ccname_array.length; i++) {
              var itemname = $scope.data.currItem.ccname_array[i];
              var itemid = $scope.data.currItem.cc_array[i];
              var add_elem = $scope.add_elem(toTxt(itemname), toTxt(itemname), itemid.indexOf("@") == -1 ? itemid : undefined);
              $('#final1').before(add_elem);
              $scope.data.currItem.cc += itemname + "<" + itemid + ">;";
            }
          }
          if ($scope.data.currItem.sendtoorg_array) {
            for (var i = 0; i < $scope.data.currItem.sendtoorg_array.length; i++) {
              var itemname = $scope.data.currItem.sendtoorg_array[i];
              var itemid = $scope.data.currItem.sendtoo_array[i];
              var add_elem = $scope.add_elem(toTxt(itemname), toTxt(itemname), itemid);
              $('#final3').before(add_elem);
              $scope.data.currItem.snedtoorg += itemname + "<" + itemid + ">;";
            }
          }
          $scope.addfunction();

          /*if ($scope.data.currItem.snedtoorg) {
           var array = $scope.data.currItem.snedtoorg.split(';');
           for (var i = 0; i < array.length; i++) {
           if (array[i] == '' || array[i] == undefined) {
           continue;
           }
           var add_elem = $scope.add_elem(toTxt(array[i]),toTxt(array[i]));
           $('#final3').before(add_elem);
           $scope.addfunction();
           }
           }
           if ($scope.data.currItem.snedto) {
           var array = $scope.data.currItem.snedto.split(';');
           for (var i = 0; i < array.length; i++) {
           if (array[i] == '' || array[i] == undefined) {
           continue;
           }
           var add_elem = $scope.add_elem(toTxt(array[i]),toTxt(array[i]));
           $('#final').before(add_elem);
           $scope.addfunction();
           }
           }
           if ($scope.data.currItem.cc) {
           var array = $scope.data.currItem.cc.split(';');
           for (var i = 0; i < array.length; i++) {
           if (array[i] == '' || array[i] == undefined) {
           continue;
           }
           var add_elem = $scope.add_elem(toTxt(array[i]),toTxt(array[i]));
           $('#final1').before(add_elem);
           $scope.addfunction();
           }
           }*/
        };

        /**
         * 特殊字符转换
         * @param str
         * @returns {*}
         */
        function toTxt(str) {
          var RexStr = /\<|\>|\"|\'|\&/g
          str = str.replace(RexStr, function (MatchStr) {
            switch (MatchStr) {
              case "<":
                return "&lt;";
                break;
              case ">":
                return "&gt;";
                break;
              case "\"":
                return "&quot;";
                break;
              case "'":
                return "&#39;";
                break;
              case "&":
                return "&amp;";
                break;
              default:
                break;
            }
          })
          return str;
        };

//删除
        $scope.delete_email = function () {
          var action;
          if ($scope.data.flag == 5 || $scope.data.flag == 10 || $scope.data.flag == 4.5) {
            //删 垃圾箱/?/已删除
            action = "batchdelete";
          } else {
            action = "batchhide";
          }

          swalApi.confirmThenSuccess({
            title: (action == "batchdelete") ? "彻底删除后邮件将无法恢复，您确定要删除吗?" : "是否删除邮件?",
            okFun: function () {
              var postdata = {};
              postdata.emailofemails = [];
              postdata.emailofemails.push($scope.data.currItem);

              requestApi.post("scpemail", action, postdata)
                .then(function (data) {
                  $scope.show_box($scope.data.flag);
                });
            },
            okTitle: '删除成功'
          });
        }

        /**
         * 邮件详情返回
         */
        $scope.back = function () {
          var temp = $scope.data.show;
          $scope.data.show = $scope.data.last_show;
          $scope.data.last_show = temp;
          /*返回时刷新列表*/
          $scope.refresh_emails();
        };


        /**
         * 回复生成邮件内容
         */
        $scope.reply_common = function () {
          $scope.clearsend_email();
          $scope.data.last_show = $scope.data.show;
          $scope.data.show = 2;
          var email = $scope.deal_data($scope.data.currItem.sendtoname);
          $scope.data.currItem.email = email.substr(0, email.length - 1);
          $scope.data.currItem.subject_send = '回复:' + $scope.data.currItem.subject;
          var head = '<div style="background:#efefef"><div>主题:' + $scope.data.currItem.subject + '</div>';
          if ($scope.data.currItem.fromuser) {
            head += '<div>发件人:' + $scope.data.currItem.fromuser + '</div>'
          }
          if ($scope.data.currItem.sendtime) {
            head += '<div>发送时间:' + $scope.data.currItem.sendtime + '</div>'
          }
          if ($scope.data.currItem.sendtoname) {
            head += '<div>收件人:' + $scope.data.currItem.sendtoname + '</div>'
          }
          if ($scope.data.currItem.ccname) {
            head += '<div>抄送人:' + $scope.data.currItem.ccname + '</div>'
          }
          head += '</div>';

          var str = '';
          if ($scope.data.flag <= 5) {
            for (var i = 0; i < $scope.data.usermails.length; i++) {
              if ($scope.data.usermails[i].email == '内部邮箱') {
                if ($scope.data.usermails[i].mail_autograph) {
                  str = '<br>——————————————</br>' + $scope.data.usermails[i].mail_autograph;
                }
              }
            }
          } else {

            for (var i = 0; i < $scope.data.usermails.length; i++) {
              if (parseInt($scope.data.usermails[i].isdefault) == 2) {
                if ($scope.data.usermails[i].mail_autograph) {
                  str = '<br>——————————————</br>' + $scope.data.usermails[i].mail_autograph;
                }
              }
            }
          }
          var code = '<br></br><br></br>' + str +
            '<div style="font-size: 12px;color: #828282;">———————————— 原始邮件 ————————————</div>' + head + $scope.data.currItem.content;
          $('.summernote').summernote('code', code);

          //拷贝附件
          $scope.data.currItem.attachofemails1 = [];
          if ($scope.data.currItem.attachofemails) {
            for (var i = 0; i < $scope.data.currItem.attachofemails.length; i++) {
              var object = {};
              $scope.data.currItem.attachofemails[i].docid = $scope.data.currItem.attachofemails[i].refid;
              $scope.data.currItem.attachofemails[i].docname = $scope.data.currItem.attachofemails[i].refname;
              $scope.data.currItem.attachofemails[i].oldsize = $scope.data.currItem.attachofemails[i].refsize;
              $scope.data.currItem.attachofemails[i].createtime = new Date().Format('yyyy-MM-dd hh:mm:ss');
              for (name in $scope.data.currItem.attachofemails[i]) {
                object[name] = $scope.data.currItem.attachofemails[i][name];
              }
              $scope.data.currItem.attachofemails1.push(object);
            }

          }
        };


        /**
         * 转发
         */
        $scope.tansfer = function () {
          $scope.clearsend_email();
          $scope.data.last_show = $scope.data.show;
          $scope.data.show = 2;
          $scope.data.currItem.subject_send = '转发:' + $scope.data.currItem.subject;
          var head = '<div style="background:#efefef"><div>主题:' + $scope.data.currItem.subject + '</div>';
          if ($scope.data.currItem.fromuser) {
            head += '<div>发件人:' + $scope.data.currItem.fromuser + '</div>'
          }
          if ($scope.data.currItem.sendtime) {
            head += '<div>发送时间:' + $scope.data.currItem.sendtime + '</div>'
          }
          if ($scope.data.currItem.sendtoname) {
            head += '<div>收件人:' + $scope.data.currItem.sendtoname + '</div>'
          }
          if ($scope.data.currItem.ccname) {
            head += '<div>抄送人:' + $scope.data.currItem.ccname + '</div>'
          }
          head += '</div>'
          if ($scope.data.flag <= 5) {
            for (var i = 0; i < $scope.data.usermails.length; i++) {
              if ($scope.data.usermails[i].email == '内部邮箱') {
                var str = '<br>——————————————</br>' + $scope.data.usermails[i].mail_autograph;
              }
            }
          } else {
            var str = '';
            for (var i = 0; i < $scope.data.usermails.length; i++) {
              if (parseInt($scope.data.usermails[i].isdefault) == 2) {
                str = '<br>——————————————</br>' + $scope.data.usermails[i].mail_autograph;
              }
            }
          }

          //拷贝附件
          $scope.data.currItem.attachofemails1 = []
          if ($scope.data.currItem.attachofemails) {
            for (var i = 0; i < $scope.data.currItem.attachofemails.length; i++) {
              var object = {};
              $scope.data.currItem.attachofemails[i].docid = $scope.data.currItem.attachofemails[i].refid;
              $scope.data.currItem.attachofemails[i].docname = $scope.data.currItem.attachofemails[i].refname;
              $scope.data.currItem.attachofemails[i].oldsize = $scope.data.currItem.attachofemails[i].refsize;
              $scope.data.currItem.attachofemails[i].createtime = new Date().Format('yyyy-MM-dd hh:mm:ss');
              for (name in $scope.data.currItem.attachofemails[i]) {
                object[name] = $scope.data.currItem.attachofemails[i][name];
              }
              $scope.data.currItem.attachofemails1.push(object);
            }

          }
          var code = '<br></br><br></br>' + str + '<div>——————————————原始邮件——————————————</div>' + head + $scope.data.currItem.content;
          $('.summernote').summernote('code', code);
        };

        /**
         * 回复
         */
        $scope.reply = function () {
          $scope.data.currItem.cc = "";
          $scope.reply_common();
          $scope.data.currItem.snedto = $scope.data.currItem.fromuser + ";";
          if ($scope.data.currItem.snedto) {
            var array = $scope.data.currItem.snedto.split(';');
            for (var i = 0; i < array.length; i++) {
              if (array[i] == '' || array[i] == undefined) {
                continue;
              }
              var add_elem = $scope.add_elem(toTxt(array[i]), toTxt(array[i]));
              $('#final').before(add_elem);
            }
          }
          $scope.addfunction();
          // $scope.show_people();
        };

        /**
         * 全部回复
         */
        $scope.reply_all = function () {
          $scope.reply_common();
          $scope.data.currItem.cc = $scope.data.currItem.ccname;

          /*收件人*/
          /*if ($scope.data.currItem.sendtoname != undefined && $scope.data.currItem.sendtoname != '') {
           var send_array = $scope.data.currItem.sendtoname.split(';');
           for (var i = 0; i < send_array.length; i++) {
           if (send_array[i].indexOf(userbean.userid) > -1) {
           continue;
           } else {
           $scope.data.currItem.snedto += ';' + send_array[i];
           }
           }
           }*/
          $scope.show_people();
        };

        function getDays(strDateStart, strDateEnd) {
          var strSeparator = "-"; //日期分隔符
          var oDate1;
          var oDate2;
          var iDays;
          oDate1 = strDateStart.split(strSeparator);
          oDate2 = strDateEnd.split(strSeparator);
          var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
          var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
          iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)//把相差的毫秒数转换为天数
          return iDays;
        }

        //外部邮件/自定义传入item
        //isRefresh是否是刷新,保留当前页数
        $scope.search = function (params, item, isRefresh) {
          var postdata = {
            pagination: "pn=" + (isRefresh ? $scope.pn : 1) + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
          };
          if (params && typeof params == 'string') {
            postdata.pagination = params;
            $scope.temporary_flag && (postdata.params = $scope.temporary_flag);
          } else if (params) {
            postdata.params = params;
            $scope.temporary_flag = params;
          }
          $scope._pageLoad(postdata, item)
        };

        $scope._pageLoad = function (postdata, item) {
          if ($scope.data.sqlwhere) {
            postdata.sqlwhere = " a.subject like '%" + $scope.data.sqlwhere + "%' or a.fromusername like '%" + $scope.data.sqlwhere + "%'"
          }
          if (postdata.params) {
            if (postdata.params == 4) {
              postdata.stat = 4;
            } else if (postdata.params == 999) {
              postdata.stat = 99;
              postdata.flag = 99;
              postdata.myflag = 999;
            } else {
              //未读邮件
              if (postdata.params == 100) {
                postdata.stat = 99;
                postdata.flag = 1;
              } else {
                postdata.stat = postdata.params;
                postdata.flag = postdata.params;
              }
            }

          } else {
            postdata.stat = 99;
            postdata.flag = 99;
          }


          //内部邮箱
          postdata.emailtype = 3;
          //外部邮箱
          if (parseInt($scope.data.flag || 0) > 5) {
            postdata.emailtype = 4;
          }
          item && (postdata.usermailid = item.usermailid);
          /*自定义文件夹*/
          if (postdata.params == 7777) {
            var post = {
              emailcid: item.emailcid,
              pagination: postdata.pagination
            };
            $scope.scpemail_selectref(post, 'scpemailc');
          } else {
            $scope.scpemail_selectall(postdata);
            $scope.scpemail_selectref(postdata);
          }
        };

        /**
         * scpemail selectall请求 数目
         */
        $scope.scpemail_selectall = function (postdata) {
          return requestApi.post({classId: "scpemail", action: "selectall", data: postdata})
            .then(function (data) {
              console.warn(data);
              //未读
              if (postdata.params == 99 || postdata.params == 77) {
                $scope.data.receivenew_out = parseInt(data.receivenew_out || 0);
                $scope.data.receivenew = parseInt(data.receivenew || 0);
                $scope.data.receivedraft_out = parseInt(data.receivedraft_out || 0);
                $scope.data.receivedraft = parseInt(data.receivedraft || 0);
              }

              //总共多少封
              /*使用分页的结果*/
              /*if (data.emails.length > 0) {
               var num = 0;
               for (var i = 0; i < num; i++) {
               num += parseInt(data.emails[i].receivetotal || 0);
               }
               $scope.data.receivetotal = num;
               } else {
               $scope.data.receivetotal = 0;
               }*/
              //$scope.data.emails=data.emails;
            });
        };

        /**
         * scpemail selectref请求 邮件列表
         */
        $scope.scpemail_selectref = function (postdata, classid) {
          return requestApi.post({
            classId: (classid ? classid : "scpemail"),
            action: "selectref",
            data: postdata
          })
            .then(function (data) {
              var pg;
              //处理页码数据
              if (data.pg) {
                pg = data.pg;
              } else {
                //自定义文件分页返回的字段不同
                pg = data.pagination
              }
              pg.split(',').map(function (item) {
                var arr = item.split('=');
                if (arr[0] == 'pn') {
                  $scope.pn = arr[1] * 1;
                } else if (arr[0] == 'ps') {
                  $scope.pageSize = arr[1] * 1;
                } else if (arr[0] == 'pc') {
                  $scope.pc = arr[1] * 1;
                } else if (arr[0] == 'cn') {
                  $scope.cn = arr[1] * 1;
                }
              });
              /*获取列表上方邮件总数*/
              $scope.data.receivetotal = ($scope.cn || 0);

              $scope.data.emails = data.emails;
              for (var i = 0; i < $scope.data.emails.length; i++) {
                if ($scope.data.emails[i].receivetime == '' || $scope.data.emails[i].receivetime == undefined) {
                  $scope.data.emails[i].receivetime = $scope.data.emails[i].sendtime;
                }
              }
              //星期一
              $scope.data.xq1_emails = [];
              //星期二
              $scope.data.xq2_emails = [];
              //星期三
              $scope.data.xq3_emails = [];
              //星期四
              $scope.data.xq4_emails = [];
              //星期五
              $scope.data.xq5_emails = [];
              //星期六
              $scope.data.xq6_emails = [];
              //今天
              $scope.data.today_emails = [];
              //上周
              $scope.data.lastweek_emails = [];
              //更早
              $scope.data.early_emails = [];
              var today = new Date().toDateString();
              var j = 0;
              //1.判断今天是星期几
              if (today.indexOf('Mon') > -1) {
                //星期1
                j = 1;
              }
              if (today.indexOf('Tue') > -1) {
                //星期2
                j = 2;
              }
              if (today.indexOf('Wed') > -1) {
                //星期3
                j = 3;
              }
              if (today.indexOf('Thu') > -1) {
                //星期4
                j = 4;
              }
              if (today.indexOf('Fri') > -1) {
                //星期5
                j = 5;
              }
              if (today.indexOf('Sat') > -1) {
                //星期6
                j = 6;
              }
              if (today.indexOf('Sun') > -1) {
                //星期天
                j = 7;
              }

              for (var i = 0; i < $scope.data.emails.length; i++) {
                //没有receivetime时直接放入更早
                if (!$scope.data.emails[i].receivetime) {
                  $scope.data.early_emails.push($scope.data.emails[i]);
                  continue;
                }

                /**
                 * new Date(ie需  **** / ** / ** 格式,不能用****-**-**)
                 */
                //今天
                if (new Date($scope.data.emails[i].receivetime.replace(/-/g, "/")).toDateString() === new Date().toDateString()) {
                  $scope.data.today_emails.push($scope.data.emails[i]);
                }

                var day = getDays(new Date($scope.data.emails[i].receivetime.replace(/-/g, "/")).Format('yyyy-MM-dd'), new Date().Format('yyyy-MM-dd'));
                //console.warn(-);
                //var day = Math.abs(new Date($scope.data.emails[i].receivetime)-new Date());
                //星期
                if (day <= (j - 6) && day > (j - 7) && (j - 6) != 0) {
                  $scope.data.xq6_emails.push($scope.data.emails[i]);
                }
                if (day <= (j - 5) && day > (j - 6) && (j - 5) != 0) {
                  $scope.data.xq5_emails.push($scope.data.emails[i]);
                }
                if (day <= (j - 4) && day > (j - 5) && (j - 4) != 0) {
                  $scope.data.xq4_emails.push($scope.data.emails[i]);
                }
                if (day <= (j - 3) && day > (j - 4) && (j - 3) != 0) {
                  $scope.data.xq3_emails.push($scope.data.emails[i]);
                }
                if (day <= (j - 2) && day > (j - 3) && (j - 2) != 0) {
                  $scope.data.xq2_emails.push($scope.data.emails[i]);
                }
                if (day <= (j - 1) && day > (j - 2) && (j - 1) != 0) {
                  $scope.data.xq1_emails.push($scope.data.emails[i]);
                }

                //昨天
                /*if(new Date($scope.data.emails[i].receivetime).toDateString() === new Date(new Date()-24*3600*1000).toDateString()){
                 $scope.data.yesterday_emails.push($scope.data.emails[i]);
                 }*/
                //上周
                if (day <= (j + 6) && day >= (j)) {
                  $scope.data.lastweek_emails.push($scope.data.emails[i]);
                }
                //更早
                if (day > (j + 6)) {
                  $scope.data.early_emails.push($scope.data.emails[i]);
                }
                $.base64.utf8encode = true;
                var param = {
                  id: parseInt($scope.data.emails[i][$scope.objconf.key]),
                  userid: window.strUserId
                };
                $scope.data.emails[i].url_param = $.base64.btoa(JSON.stringify(param), true);
              }
              data.pagination = data.pg;
              if (data.pagination && data.pagination.length > 0) {
                BasemanService.pageInfoOp($scope, data.pagination);
              }

              /*console.log(JSON.stringify($scope.data.today_emails));
               console.log(JSON.stringify($scope.data.early_emails));
               console.log(JSON.stringify($scope.data.xq6_emails));
               console.log(JSON.stringify($scope.data.xq5_emails));
               console.log(JSON.stringify($scope.data.xq4_emails));
               console.log(JSON.stringify($scope.data.xq3_emails));
               console.log(JSON.stringify($scope.data.xq2_emails));
               console.log(JSON.stringify($scope.data.xq1_emails));*/
            });
        };

        /**
         * 标记星标邮件
         */
        $scope.star = function (e, id) {
          var postdata = {emailid: id};
          if (e.currentTarget.attributes.class.value.indexOf('lightstar') != -1) {
            e.currentTarget.attributes.class.value = e.currentTarget.attributes.class.value.replace('lightstar', 'star');
            postdata.myflag = 1;
          } else {
            e.currentTarget.attributes.class.value = e.currentTarget.attributes.class.value.replace('star', 'lightstar');
            postdata.myflag = 999;
          }
          requestApi.post({classId: "scpemailtrk", action: "addmyflag", data: postdata})
            .then(function (data) {
            })
        }
        $scope.show_box(1);

        // setInterval(function () {
        //     if ($scope.data.flag == 1 || $scope.data.flag == 6) {
        //         //$scope.search(99);
        //     }
        //     requestApi.post({
        //             classId: "scpallemail", action: "email_wdqty",
        //             data: {}
        //         }
        //     )
        //         .then(function (data) {
        //             $scope.data.receivenew_out = parseInt(data.receivenew_out || 0);
        //             $scope.data.receivenew = parseInt(data.receivenew || 0);
        //             $scope.data.receivedraft_out = parseInt(data.receivedraft_out || 0);
        //             $scope.data.receivedraft = parseInt(data.receivedraft || 0);
        //         })
        // }, 4000);
//自适应高度
//                 setInterval(function () {
//
//                     if ($scope.data.flag > 5) {
//                         $('#addwidth1').height($(document).height() - $('#addwidth1')[0].offsetTop * 2 + $scope.data.currItem.attachofemails1.length * 30 - 30);
//                         $('#lm150338581407203951792705359891tree').height($(document).height() - $('#addwidth1')[0].offsetTop * 2 + $scope.data.currItem.attachofemails1.length * 30 - 80 - 30);
//                         $('#main .panel-body').height($('#addwidth1').height() - $('#contents').parent().parent()[0].offsetTop - $('#addwidth1')[0].offsetTop - 20);
//                     } else {
//                         $('#addwidth').height($(document).height() - $('#addwidth')[0].offsetTop * 2 + $scope.data.currItem.attachofemails1.length * 30 - 30);
//                         $('#lm150338581407203951792705359891tree').height($(document).height() - $('#addwidth')[0].offsetTop * 2 + $scope.data.currItem.attachofemails1.length * 30 - 80 - 30);
//                         $('#main .panel-body').height($('#addwidth').height() - $('#contents').parent().parent()[0].offsetTop - $('#addwidth')[0].offsetTop - 20);
//
//                     }
//                     //
//                     if ($('#mail_content').height() > ($(document).height() - 120 - 30)) {
//
//                     } else {
//                         //$('#mail_content').height($(document).height()-120-30);
//                     }
//
//                     $('.limit').height($(document).height() - $('.limit')[0].offsetTop);
//
//
//                 }, 200);

        /*$(document).on("click", function (e) {
         $('.attbg_focus').removeClass('attbg_focus');
         if ($scope.focus == 2) {
         if ($scope.data.currItem.search_linep) {
         var add_elem = $scope.add_elem($scope.data.currItem.search_linep,$scope.data.currItem.search_linep);
         $('#final1').before(add_elem);
         $scope.addfunction();
         $scope.data.currItem.cc += $scope.data.currItem.search_linep + ';';
         $scope.data.currItem.search_linep = '';
         }
         } else if ($scope.focus == 3) {
         if ($scope.data.currItem.search_org) {
         var add_elem = $scope.add_elem($scope.data.currItem.search_org,$scope.data.currItem.search_org);
         $('#final3').before(add_elem);
         $scope.addfunction();
         $scope.data.currItem.snedtoorg += $scope.data.currItem.search_org + ';';
         $scope.data.currItem.search_org = '';
         }
         } else {
         if ($scope.data.currItem.search_peop) {
         var add_elem = $scope.add_elem($scope.data.currItem.search_peop,$scope.data.currItem.search_peop);
         $('#final').before(add_elem);
         $scope.addfunction();
         $scope.data.currItem.snedto += $scope.data.currItem.search_peop + ';';
         $scope.data.currItem.search_peop = '';
         }
         }
         })*/


        /*========================================收件人/抄送人操作 start===================================================*/
        /*-----------收件人/抄送人操作事件-----------*/
        /**
         * div点击聚焦
         */
        $('#toAreaCtrl').click(function (e) {
          if (e.target.className.indexOf("right_edit_elem_input") == -1)
            $('#toAreaCtrl .addr_text .js_input').focus();
        });
        $('#toAreaCtrl1').click(function (e) {
          if (e.target.className.indexOf("right_edit_elem_input") == -1)
            $('#toAreaCtrl1 .addr_text .js_input').focus();
        });
        $('#toAreaCtrl3').click(function (e) {
          if (e.target.className.indexOf("right_edit_elem_input") == -1)
            $('#toAreaCtrl3 .addr_text .js_input').focus();
        });

        /**
         * div双击全选
         */
        $('#toAreaCtrl').dblclick(function (e) {
          /*双击编辑input*/
          if (e.target.className.indexOf("right_edit_elem_input") != -1) {
            return;
          }

          /*双击elem*/
          if (e.target.className.indexOf("addr_base") != -1 || $(e.target).parent(".addr_base").length != 0) {
            $scope.right_edit_elem();
            return;
          }
          /*全选*/
          $('#toAreaCtrl .addr_text .js_input').select();
          $('#toAreaCtrl .addr_base').addClass('attbg_focus');
          return false;
        });
        $('#toAreaCtrl1').dblclick(function (e) {
          if (e.target.className.indexOf("right_edit_elem_input") != -1) {
            return;
          }

          if (e.target.className.indexOf("addr_base") != -1 || $(e.target).parent(".addr_base").length != 0) {
            $scope.right_edit_elem();
            return;
          }
          $('#toAreaCtrl1 .addr_text .js_input').select();
          $('#toAreaCtrl1 .addr_base').addClass('attbg_focus');
          return false;
        });
        $('#toAreaCtrl3').dblclick(function (e) {
          if (e.target.className.indexOf("right_edit_elem_input") != -1) {
            return;
          }

          if (e.target.className.indexOf("addr_base") != -1 || $(e.target).parent(".addr_base").length != 0) {
            $scope.right_edit_elem();
            return;
          }
          $('#toAreaCtrl3 .addr_text .js_input').select();
          $('#toAreaCtrl3 .addr_base').addClass('attbg_focus');
          return false;
        });

        /**
         * input双击全选
         */
        /*$('#toAreaCtrl .addr_text .js_input').dblclick(function (e) {
         $('#toAreaCtrl .addr_text .js_input').select();
         if ($scope.data.currItem.search_peop == '' || $scope.data.currItem.search_peop == undefined) {

         } else {
         return false;
         }
         });
         $('#toAreaCtrl1 .addr_text .js_input').dblclick(function (e) {
         $('#toAreaCtrl1 .addr_text .js_input').select();
         if ($scope.data.currItem.search_linep == '' || $scope.data.currItem.search_linep == undefined) {

         } else {
         return false;
         }
         });
         $('#toAreaCtrl3 .addr_text .js_input').dblclick(function (e) {
         $('#toAreaCtrl3 .addr_text .js_input').select();
         if ($scope.data.currItem.search_org == '' || $scope.data.currItem.search_org == undefined) {

         } else {
         return false;
         }
         });*/

        /**
         * input聚焦 去除选择状态
         */
        $('#toAreaCtrl .addr_text .js_input,#toAreaCtrl1 .addr_text .js_input,#toAreaCtrl3 .addr_text .js_input').focus(function () {
          $('#toAreaCtrl,#toAreaCtrl1,#toAreaCtrl3').children().removeClass('attbg_focus');
        });

        /**
         * 收/抄-失焦
         * 模糊查询失焦时不执行js_input_key
         * 编辑失焦时不执行
         */
        $('#toAreaCtrl .addr_text .js_input,#toAreaCtrl1 .addr_text .js_input,#toAreaCtrl3 .addr_text .js_input').blur(function (e) {
          if (e.target.className.indexOf("right_edit_elem_input") != -1)
            return;

          /*使模糊查询click先于js_input的blur*/
          $timeout(function () {
            console.log($scope.user_search_click_bool);
            if (!$scope.user_search_click_bool) {
              $scope.js_input_key({keyCode: 186}, $(e.target).attr("data-model"));
              $scope.data.user_search_data.length = 0;
            }
            $scope.user_search_click_bool = false;
          }, 100);
        });

        /**
         * 收件人input
         */
        $('#toAreaCtrl .addr_text .js_input').keydown(function (e) {
          /*if (e.keyCode === 8) {//backspace
           if ($scope.data.currItem.search_peop == '' || $scope.data.currItem.search_peop == undefined) {

           } else {
           var l = e.currentTarget.selectionStart;
           if (e.currentTarget.selectionStart == e.currentTarget.selectionEnd) {
           $scope.data.currItem.search_peop = $scope.data.currItem.search_peop.substr(0, e.currentTarget.selectionStart - 1) + $scope.data.currItem.search_peop.substr(e.currentTarget.selectionEnd, $scope.data.currItem.search_peop.length - 1);
           $scope.$apply();
           e.currentTarget.selectionStart = l - 1;
           e.currentTarget.selectionEnd = l - 1;
           } else {
           $scope.data.currItem.search_peop = $scope.data.currItem.search_peop.substr(0, e.currentTarget.selectionStart) + $scope.data.currItem.search_peop.substr(e.currentTarget.selectionEnd, $scope.data.currItem.search_peop.length - 1);
           $scope.$apply();
           e.currentTarget.selectionStart = l;
           e.currentTarget.selectionEnd = l;
           }
           return false;
           }
           } else if (e.keyCode === 186) {//;
           if ($scope.data.currItem.search_peop) {
           var add_elem = $scope.add_elem($scope.data.currItem.search_peop,$scope.data.currItem.search_peop);
           $('#final').before(add_elem);
           $scope.addfunction();
           $scope.data.currItem.snedto += $scope.data.currItem.search_peop + ';';
           $scope.data.currItem.search_peop = '';
           }
           $scope.$apply();
           return false;
           }*/
          $scope.js_input_key(e, 'search_peop');
        });

        /**
         * 抄送人input
         */
        $('#toAreaCtrl1 .addr_text .js_input').keydown(function (e) {
          /*if (e.keyCode === 8) {
           if ($scope.data.currItem.search_linep == '' || $scope.data.currItem.search_linep == undefined) {

           } else {
           var l = e.currentTarget.selectionStart;
           if (e.currentTarget.selectionStart == e.currentTarget.selectionEnd) {
           $scope.data.currItem.search_linep = $scope.data.currItem.search_linep.substr(0, e.currentTarget.selectionStart - 1) + $scope.data.currItem.search_linep.substr(e.currentTarget.selectionEnd, $scope.data.currItem.search_linep.length - 1);
           $scope.$apply();
           e.currentTarget.selectionStart = l - 1;
           e.currentTarget.selectionEnd = l - 1
           } else {
           $scope.data.currItem.search_linep = $scope.data.currItem.search_linep.substr(0, e.currentTarget.selectionStart) + $scope.data.currItem.search_linep.substr(e.currentTarget.selectionEnd, $scope.data.currItem.search_linep.length - 1);
           $scope.$apply();
           e.currentTarget.selectionStart = l
           e.currentTarget.selectionEnd = l
           }
           return false;
           }
           } else if (e.keyCode === 186) {
           if ($scope.data.currItem.search_linep) {
           var add_elem = $scope.add_elem($scope.data.currItem.search_linep,$scope.data.currItem.search_linep);
           $('#final1').before(add_elem);
           $scope.addfunction();
           $scope.data.currItem.cc += $scope.data.currItem.search_linep + ';'
           $scope.data.currItem.search_linep = '';
           }
           $scope.$apply();
           return false;
           }*/
          $scope.js_input_key(e, 'search_linep');
        });

        /**
         * 收件机构input
         */
        $('#toAreaCtrl3 .addr_text .js_input').keydown(function (e) {
          $scope.js_input_key(e, 'search_org');
        });

        /**
         * 整合监听input方法
         * @param e
         * @param field  search_peop收件  search_linep抄送
         * @returns {boolean}
         */
        $scope.js_input_key = function (e, field) {
          var inputfield, dom;
          if (field == 'search_linep') {
            inputfield = 'cc';
            dom = '#final1';
          }
          else if (field == 'search_peop') {
            inputfield = 'snedto';
            dom = '#final';
          }
          else if (field == 'search_org') {
            inputfield = 'snedtoorg';
            dom = '#final3';
          }

          if (e.keyCode === 8) {//backspace
            if ($scope.data.currItem[field] == '' || $scope.data.currItem[field] == undefined) {
              $scope.del_elem();
            }

          } else if (e.keyCode === 186) {// ;
            $scope.importInput(field, dom, inputfield);

          } else if (e.keyCode === 13) {// enter
            //有模糊查询时
            if ($scope.data.user_search_data.length > 0) {
              //点击hover模糊节点数据
              $scope.user_search_click($scope.user_search_getdata());
              //清空input
              $timeout(function () {
                $scope.data.currItem[field] = '';
                $scope.user_search_hide();
                // $scope.$apply();
              });
            }
            //正常输入
            else {
              $scope.importInput(field, dom, inputfield);
            }

          } else if (e.keyCode === 38 || e.keyCode === 40) {//↑ ↓
            if ($scope.data.user_search_data.length > 0) {
              e.preventDefault();
              var i = $scope.user_search_geti();
              $scope.data.user_search_data.forEach(function (item) {
                item.hcHover = false;
              });
              if (e.keyCode === 38) {
                $scope.data.user_search_data[i - 1 > 0 ? i - 1 : 0].hcHover = true;
              }
              if (e.keyCode === 40) {
                $scope.data.user_search_data[i + 1 < $scope.data.user_search_data.length ? i + 1 : i].hcHover = true;
              }
              $scope.user_search_scroll();
              $timeout(function () {
                // $scope.$apply();
              });
            }

          } else {
            //去除div选中状态
            $('#toAreaCtrl,#toAreaCtrl1,#toAreaCtrl3').children().removeClass('attbg_focus');
          }
        };

        /**
         * 往input及字段中输入数据
         * @param field 显示字段 search_peop,search_linep
         * @param dom 存储生成div的dom节点 #final #final1
         * @param inputfield 存储字段 snedto cc
         */
        $scope.importInput = function (field, dom, inputfield, data) {
          /*特殊情况时直接使用传入的数据*/
          if (data) {
            $scope.data.currItem[field] = data;
          }
          /*中文输入法时keydown无法识别 ； 手动拆分*/
          if ($scope.data.currItem[field].indexOf("；") != -1) {
            var fields = $scope.data.currItem[field].split("；");
            fields.forEach(function (item) {
              if (item != "") {
                $scope.importInput(field, dom, inputfield, item);
              }
            });
            return;
          }
          if ($scope.data.currItem[field]) {
            /* 输入格式为 **<**> 时,解析<>内为id */
            /* 不然所有都作为id */
            var id, name;
            var left = $scope.data.currItem[field].indexOf('<');
            if (left == -1) {

            } else {
              var right = $scope.data.currItem[field].indexOf('>');
              id = $scope.data.currItem[field].substr(left + 1, right - left - 1);
              name = $scope.data.currItem[field].substr(0, left);
            }

            if (id)
              var add_elem = $scope.add_elem(name, name, id);
            else
              var add_elem = $scope.add_elem($scope.data.currItem[field], $scope.data.currItem[field]);
            $(dom).before(add_elem);
            $scope.addfunction();
            if ($scope.data.currItem[inputfield] == '') {
              $scope.data.currItem[inputfield] += $scope.data.currItem[field];
            } else {
              $scope.data.currItem[inputfield] += ';' + $scope.data.currItem[field];
            }
          }
          $timeout(function () {
            $scope.data.currItem[field] = '';
            $scope.user_search_hide();
            // $scope.$apply();
          });
        };


        $('#zuti').keydown(function (e) {
          if (e.keyCode === 8) {
            if ($scope.data.currItem.subject_send == '' || $scope.data.currItem.subject_send == undefined) {
              return false;
            } else {
              var l = e.currentTarget.selectionStart;
              if (e.currentTarget.selectionStart == e.currentTarget.selectionEnd) {
                $scope.data.currItem.subject_send = $scope.data.currItem.subject_send.substr(0, e.currentTarget.selectionStart - 1) + $scope.data.currItem.subject_send.substr(e.currentTarget.selectionEnd, $scope.data.currItem.subject_send.length - 1);
                $scope.$apply();
                e.currentTarget.selectionStart = l - 1;
                e.currentTarget.selectionEnd = l - 1
              } else {
                $scope.data.currItem.subject_send = $scope.data.currItem.subject_send.substr(0, e.currentTarget.selectionStart) + $scope.data.currItem.subject_send.substr(e.currentTarget.selectionEnd, $scope.data.currItem.subject_send.length - 1);
                $scope.$apply();
                e.currentTarget.selectionStart = l;
                e.currentTarget.selectionEnd = l
              }
              return false;
            }

          }
        });

        $('#toAreaCtrl .addr_text .js_input,#toAreaCtrl1 .addr_text .js_input,#toAreaCtrl3 .addr_text .js_input').click(function (e) {
          return false;
        });


        /**
         * 生成抄送人/收件人div
         * addr:部门  收件人-取消 抄送人-仍然使用
         */
        $scope.add_elem = function (name, addr, id, hideid) {
          var div = '<div class="addr_base addr_normal attbg" style="float:left;white-space:nowrap;" title="' + name + (id ? '&lt;' + id + '&gt;' : '') + '" addr="' + addr + '" unselectable="on">' +
            '<b unselectable="on" addr="' + addr + '">' + name + '</b>' +
            (id && !hideid ? '<span unselectable="on" addr="bob1987bao@163.com">&lt;' + id + '&gt;</span>' : '') +
            '<a href="javascript:;" class="addr_del iconfont hc-close" name="del" style="padding-left: 2px;padding-right: 2px;font-size: 12px;"></a>' +
            '<span class="semicolon">;</span>' +
            '</div>';
          return div;
        };


        /**
         * 抄送人/接收人div添加事件
         */
        $scope.addfunction = function () {
          /**
           * 选中
           */
          $(".addr_base").off("click");
          $('.addr_base').click(function (e) {
            $scope.addr_base_select(this, e);
            return false
          });
          /**
           * 右键
           */
          $(".addr_base").off("contextmenu");
          $(".addr_base").contextmenu(function (e) {
            $scope.addr_base_select(this, e);
            $scope.toggle_outmenu(e, $("#right_final"));
            if (this.parentNode.attributes.id.value == 'toAreaCtrl' || this.parentNode.attributes.id.value == 'toAreaCtrl1') {
              $scope.right_final_isorg = false;
            }
            if (this.parentNode.attributes.id.value == 'toAreaCtrl3') {
              $scope.right_final_isorg = true;
            }
            $scope.$apply();
            return false;
          });
          /**
           * x按钮
           */
          $(".addr_base>.addr_del").off("click");
          $('.addr_base>.addr_del').click(function (e) {
            $timeout(function () {
              $scope.del_elem();
            }, 100)
          });
        };
        $scope.addfunction();


        /**
         * 抽出抄送人/接收人div选中事件
         */
        $scope.addr_base_select = function (self, e) {
          $(self).siblings().removeClass('attbg_focus');
          $(self).siblings().removeClass('attbg');
          $(self).siblings().addClass('attbg');
          $(self).removeClass('attbg');
          $(self).addClass('attbg_focus');
          if (self.parentNode.attributes.id.value == 'toAreaCtrl') {
            $('#toAreaCtrl1').children().removeClass('attbg_focus');
            $('#toAreaCtrl3').children().removeClass('attbg_focus');
          }
          else if (self.parentNode.attributes.id.value == 'toAreaCtrl1') {
            $('#toAreaCtrl').children().removeClass('attbg_focus');
            $('#toAreaCtrl3').children().removeClass('attbg_focus');
          }
          else if (self.parentNode.attributes.id.value == 'toAreaCtrl3') {
            $('#toAreaCtrl').children().removeClass('attbg_focus');
            $('#toAreaCtrl1').children().removeClass('attbg_focus');
          }
        };


        /**
         * 收件人/抄送-键盘监控
         */
        /*$scope.one_click = function () {
         $(document).one("keydown", function (e) {
         if (e.target && e.target.id == 'lm15034559988030725050352368402searchtext') {
         return;
         }
         /!*backspace键*!/
         if (e.keyCode === 8) {
         $scope.del_elem();
         }
         $scope.one_click();
         });
         };*/
        // $scope.one_click();


        /**
         * 删除抄送人/收件人-数据
         * notadd 不自动选中最后一个div
         */
        $scope.del_elem = function (notadd) {
          var divdom, inputdom, inputfield;
          if ($scope.focus == 1) {
            divdom = "#toAreaCtrl";
            inputdom = "#final";
            inputfield = "snedto";
          } else if ($scope.focus == 2) {
            divdom = "#toAreaCtrl1";
            inputdom = "#final1";
            inputfield = "cc";
          } else if ($scope.focus == 3) {
            divdom = "#toAreaCtrl3";
            inputdom = "#final3";
            inputfield = "snedtoorg";
          }

          $(divdom + ' .attbg_focus').remove();
          $scope.data.currItem[inputfield] = '';
          for (var i = 0; i < $(divdom + ' .addr_base').length; i++) {
            if (i == 0) {
              $scope.data.currItem[inputfield] = $(divdom + ' .addr_base')[i].attributes.title.value;
            } else {
              $scope.data.currItem[inputfield] += ';' + $(divdom + ' .addr_base')[i].attributes.title.value;
            }
          }
          if (!notadd)
            $(inputdom).prev().addClass('attbg_focus');

          /*if ($scope.focus == 2) {
           $('#toAreaCtrl1 .attbg_focus').remove();
           $scope.data.currItem.cc = '';
           for (var i = 0; i < $('#toAreaCtrl1 .addr_base').length; i++) {
           if (i == 0) {
           $scope.data.currItem.cc = $('#toAreaCtrl1 .addr_base')[i].attributes.title.value;
           } else {
           $scope.data.currItem.cc += ';' + $('#toAreaCtrl1 .addr_base')[i].attributes.title.value;
           }
           }
           $('#final1').prev().addClass('attbg_focus');
           } else if ($scope.focus == 3) {
           $('#toAreaCtrl3 .attbg_focus').remove();
           $scope.data.currItem.snedtoorg = '';
           for (var i = 0; i < $('#toAreaCtrl3 .addr_base').length; i++) {
           if (i == 0) {
           $scope.data.currItem.snedtoorg = $('#toAreaCtrl3 .addr_base')[i].attributes.title.value;
           } else {
           $scope.data.currItem.snedtoorg += ';' + $('#toAreaCtrl3 .addr_base')[i].attributes.title.value;
           }
           }
           $('#final3').prev().addClass('attbg_focus');
           }else {
           $('#toAreaCtrl .attbg_focus').remove();
           $scope.data.currItem.snedto = '';
           for (var i = 0; i < $('#toAreaCtrl .addr_base').length; i++) {
           if (i == 0) {
           $scope.data.currItem.snedto = $('#toAreaCtrl .addr_base')[i].attributes.title.value;
           } else {
           $scope.data.currItem.snedto += ';' + $('#toAreaCtrl .addr_base')[i].attributes.title.value;
           }
           }
           $('#final').prev().addClass('attbg_focus');
           }*/
        };


        /**
         * 收/抄input变化-模糊查询div定位
         */
        $scope.search_change = function (field) {
          var id = "#toAreaCtrl";
          if (field == 'linep') {
            id = "#toAreaCtrl1";
          }
          var dom = $(id);
          var modal = $("#user_search");

          if ($scope.data.currItem['search_' + field] && $scope.data.currItem['search_' + field] != ";") {
            $scope.get_user_search($scope.data.currItem['search_' + field], field);
            modal.css({
              "top": dom.offset().top + 22,
              "left": dom.offset().left,
              "width": dom.css("width")
            });
          } else {
            $scope.user_search_hide();
          }
        };

        /**
         * 关闭模糊查询悬窗
         */
        $scope.user_search_hide = function () {
          $scope.data.user_search_data = [];
        };

        /**
         * 获取模糊查询数据
         */
        $scope.get_user_search = function (str, field) {
          $scope.data.user_search_data = [];
          requestApi.post({classId: "scpuser", action: "search", data: {userid: str}, noShowWaiting: true})
            .then(function (data) {
              for (var i = 0; i < data.users.length; i++) {
                data.users[i].data_field = field;
                i == 0 && (data.users[i].hcHover = true);
              }
              /*防止异步获取结果后input已清空*/
              if ($scope.data.currItem['search_' + field] != "") {
                $scope.data.user_search_data = data.users;
              }
            });
        };

        /**
         * 模糊查询点击 - user_search_click_bool用以取消js_input blur事件
         */
        $scope.user_search_click = function (item) {
          console.log(item);
          $scope.user_search_click_bool = true;

          var field = item.data_field;
          var inputfield, dom;
          if (field == 'linep') {
            inputfield = 'cc';
            dom = '#final1';
          }
          if (field == 'peop') {
            inputfield = 'snedto';
            dom = '#final';
          }
          var add_elem = $scope.add_elem(item.username, item.username, item.userid);
          $(dom).before(add_elem);
          $scope.addfunction();
          if ($scope.data.currItem[inputfield] == '') {
            $scope.data.currItem[inputfield] += item.username + "<" + item.userid + ">";
          } else {
            $scope.data.currItem[inputfield] += ';' + item.username + "<" + item.userid + ">";
          }
          $scope.data.currItem["search_" + field] = '';
          $scope.user_search_hide();
        };

        /**
         * 上下滚动时判断hover元素是否在可视范围内,不在则进行滚动
         */
        $scope.user_search_scroll = function () {
          $timeout(function () {
            var ul = $(".hc-searchli-div");
            var li = $(".hc-searchli-hover");
            var ulH = ul.height();
            //ul滚动距离
            var ulS = ul.scrollTop();
            var liH = li.outerHeight(true);
            //li距ul顶部距离
            var liP = li[0].offsetTop - 30;

            console.log(ulH, ulS, liH, liP);

            //↓出可视范围
            if (liP + liH > ulH + ulS) {
              ul.scrollTop(liP + liH - ulH);
            }
            //↑出可视范围
            if (liP < ulS) {
              ul.scrollTop(liP);
            }
          }, 50)
        };

        /**
         * 模拟鼠标hover事件
         */
        $scope.user_search_mouseover = function (item, $event) {
          $scope.data.user_search_data.forEach(function (row) {
            row.hcHover = false;
          });
          item.hcHover = true;
        };

        /**
         * 获取hover节点数据
         */
        $scope.user_search_getdata = function () {
          var data;
          $scope.data.user_search_data.forEach(function (row) {
            if (row.hcHover)
              data = row
          });
          return data;
        };

        /**
         * 获取hover节点位置
         * 无则0
         */
        $scope.user_search_geti = function () {
          var x = 0;
          $scope.data.user_search_data.forEach(function (item, i) {
            if (item.hcHover)
              x = i;
          });
          return x;
        };

        /*===================================抄送人/接收人操作 end=====================================*/


//$scope.search(99)
        $scope.viewColumns = [];
//界面初始化
        $scope.clearinformation = function () {
          if (!$scope.data) $scope.data = {}
          $scope.data.title = "收件箱";
          $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            usable: 2,
            seaport_type: 1,
            attachofemails1: []
          };
        };
        /**--------系统词汇词------*/
        requestApi.post({
            classId: "base_search", action: "searchdict", data: {
              dictcode: "seaport_type"
            }
          }
        ).then(function (data) {
          $scope.seaport_types = data.dicts;
        });
        /**----弹出框区域*---------------*/
//收件人查询
        $scope.openuserFrm = function () {
          $scope.FrmInfo = {
            classid: "scpuser",
            backdatas: "users",
            sqlBlock: "1=1 ",
            type: 'checkbox'
          };
          BasemanService.open(CommonPopController, $scope).result.then(function (data) {
            //判断用户是否已经重复多选，如果重复的话就不给他加入。
            if ($scope.data.currItem.snedto == '' || $scope.data.currItem.snedto == undefined) {
              $scope.data.currItem.snedto = '';
              $scope.data.currItem.totype = '';
              for (var i = 0; i < data.length; i++) {
                if ($scope.data.currItem.snedto.indexOf(data[i].username) == -1) {
                  if (i == data.length - 1) {
                    $scope.data.currItem.snedto += data[i].username;
                    $scope.data.currItem.totype += '13';
                  } else {
                    $scope.data.currItem.snedto += data[i].username + ';';
                    $scope.data.currItem.totype += '13' + ';';
                  }
                }
              }
            } else {
              for (var i = 0; i < data.length; i++) {
                $scope.data.currItem.snedto += ';' + data[i].username;
                $scope.data.currItem.totype += ';' + '13';
              }
            }

          });
        };
//抄送
        $scope.sendTo = function () {
          $scope.FrmInfo = {
            classid: "scpuser",
            backdatas: "users",
            sqlBlock: "1=1 ",
            type: 'checkbox'
          };
          BasemanService.open(CommonPopController, $scope).result.then(function (data) {
            //判断用户是否已经重复多选，如果重复的话就不给他加入。
            if ($scope.data.currItem.cc == '' || $scope.data.currItem.cc == undefined) {
              $scope.data.currItem.cc = '';
              for (var i = 0; i < data.length; i++) {
                if ($scope.data.currItem.cc.indexOf(data[i].username) == -1) {
                  if (i == data.length - 1) {
                    $scope.data.currItem.cc += data[i].username;
                    $scope.data.currItem.cctype += '13';
                  } else {
                    $scope.data.currItem.cc += data[i].username + ';';
                    $scope.data.currItem.cctype += '13' + ';';
                  }
                }
              }
            } else {
              for (var i = 0; i < data.length; i++) {
                $scope.data.currItem.cc += ';' + data[i].username;
                $scope.data.currItem.cctype += ';' + '13';
              }
            }

          });
        };

        /**
         * 收/抄-去掉与id无关数据
         * 若无<**>则直接使用当前数据作为id
         * @param str
         * @returns {string}
         */
        $scope.deal_data = function (str) {
          var new_str = '';
          var arr = str.split(';');
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] == '' || arr[i] == undefined) {
              continue;
            }
            var left = arr[i].indexOf('<');
            if (left == -1) {
              new_str += arr[i] + ';'
            } else {
              var right = arr[i].indexOf('>');
              var s = arr[i].substr(left + 1, right - left - 1);
              new_str += s + ';';
            }

          }
          return new_str;
        };

        /**
         * 取消按钮
         */
        $scope.send_cancel = function () {
          var content = $('.summernote').summernote('code');
          var jud = ($scope.data.currItem.snedto == undefined || $scope.data.currItem.snedto == '') && ($scope.data.currItem.cc == undefined || $scope.data.currItem.cc == '') && (content == '')
          if (jud) {
            $scope.send_cancel_fun();
          } else {
            swal({
                title: "是否取消当前编辑的邮件？",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "确定取消",
                cancelButtonText: "存为草稿",
                allowEscapeKey: false, //如果设置为true，用户可以通过按下Escape键关闭弹窗。
                allowOutsideClick: false, //如果设置为true，用户点击弹窗外部可关闭弹窗。
                timer: null//不允许超时消失
              },
              function (isConfirm) {
                if (isConfirm) {
                  $scope.send_cancel_fun()
                } else {
                  $scope.send_email(2);
                }
              });
          }
        };

        /**
         * 取消按钮事件
         */
        $scope.send_cancel_fun = function () {
          var temp = 0;
          temp = $scope.data.show;
          $scope.data.show = $scope.data.last_show;
          $scope.data.last_show = temp;
          $scope.clearsend_email();
        };

        /**
         * 添加邮件的类型
         * 取消发件人添加类型移至add_snedto_type
         * 保留抄送人添加类型
         */
        $scope.add_type = function () {
          /*$scope.data.currItem.totype = "";
           for (var i = 0; i < $('#toAreaCtrl .addr_normal').length; i++) {
           if ($('#toAreaCtrl .addr_normal')[i].attributes.addr.value == '部门') {

           $scope.data.currItem.totype += '12;';
           } else {
           $scope.data.currItem.totype += '13;';
           }
           }*/
          for (var i = 0; i < $('#toAreaCtrl1 .addr_normal').length; i++) {
            if ($('#toAreaCtrl1 .addr_normal')[i].attributes.addr.value == '部门') {
              $scope.data.currItem.cctype += '12;';
            } else {
              $scope.data.currItem.cctype += '13;';
            }
          }
        };

        /**
         * 添加收件人/收件机构邮件的类型
         */
        $scope.add_snedto_type = function (field, type) {
          var totype = "";
          var arr = $scope.data.currItem[field].split(';');
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] == '' || arr[i] == undefined) {
              continue;
            }
            totype += (type + ';');
          }
          return totype;
        };


        /**
         * 定时发送
         */
        $scope.after_sending = function () {
          $scope.aftersendingModal
            .open({
              controller: ['$scope', function ($modalScope) {
                $modalScope.title = "定时发送";
                $modalScope.data = {};
                /*初始化选项*/
                $modalScope.data.hours = new Array(24).toString().split(',').map(function (item, index) {
                  return {name: $scope.supplement(index), value: $scope.supplement(index)};
                });
                $modalScope.data.minutes = new Array(12).toString().split(',').map(function (item, index) {
                  return {name: $scope.supplement(index * 5), value: $scope.supplement(index * 5)};
                });
                /*初始化时间*/
                var date = new Date(new Date().getTime() + 1 * 60 * 60 * 1000);
                var min = date.getMinutes();
                min = $scope.supplement(min);
                var min1 = min.split("")[1] * 1;
                var num = (min1 < 5 ? 5 - min1 : 10 - min1);
                date.setMinutes(min * 1 + num);

                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hh = date.getHours();
                var mm = date.getMinutes();
                $modalScope.data.date = year + "-" + $scope.supplement(month) + "-" + $scope.supplement(day);
                $modalScope.data.hour = $scope.supplement(hh);
                $modalScope.data.minute = $scope.supplement(mm);

                $modalScope.footerRightButtons.rightTest = {
                  title: '确定',
                  click: function () {
                    console.log($modalScope.data);
                    if ($scope.isNull($modalScope.data.date) || $scope.isNull($modalScope.data.hour) || $scope.isNull($modalScope.data.minute)) {
                      return swalApi.info("请选择邮件自动发送时间!");
                    }
                    var sendtime = $modalScope.data.date + " " + $modalScope.data.hour + ":" + $modalScope.data.minute + ":00";
                    if (new Date(sendtime) <= new Date()) {
                      return swalApi.info("日期已过期");
                    }
                    $modalScope.$close(sendtime);
                  }
                };
              }]
            })
            .result
            .then(function (sendtime) {
              $scope.send_email(2, sendtime)
            })
        };


        /**
         * 发送邮件
         * @param flag 2草稿
         * @param sendtime flag==2&&sendtime定时发送
         */
        $scope.send_email = function (flag, sendtime) {
          $timeout(function () {
            var postdata = {
              sysuserid: userbean.sysuserid,
              fromuser: userbean.userid,
              emailtype: 3,
              stat: 2,
              myflag: 0,
              contentid: -2
            };
            //外部邮箱
            if ($scope.data.flag > 5) {
              postdata.emailtype = 4;
              if ($scope.data.mailserverid)
              //是什么类型邮件
                postdata.mailserverid = $scope.data.mailserverid;
              postdata.email = $scope.data.email;
              postdata.usermailid = $scope.data.usermailid;
              //发件人改为外部邮箱
              // postdata.fromuser = $scope.data.email;
              postdata.fromuser = "";
            }
            //草稿/定时发送
            if (flag == 2) {
              postdata.stat = 1;
            }

            /*处理收/抄数据及类型数据*/
            postdata.totype = "";
            if ($scope.data.currItem.snedto) {
              /*加收件人名称*/
              postdata.sendtoname = $scope.data.currItem.snedto;
              /*加收件人id*/
              postdata.sendto = $scope.deal_data($scope.data.currItem.snedto);
              /*加收件人类型*/
              postdata.totype += $scope.add_snedto_type('snedto', '13');
            }
            if ($scope.data.currItem.snedtoorg) {
              /*加机构名称*/
              if (postdata.sendtoname) {
                postdata.sendtoname += ";" + $scope.data.currItem.snedtoorg;
              } else {
                postdata.sendtoname = $scope.data.currItem.snedtoorg;
              }
              /*加机构id*/
              if (postdata.sendto) {
                postdata.sendto += $scope.deal_data($scope.data.currItem.snedtoorg);
              } else {
                postdata.sendto = $scope.deal_data($scope.data.currItem.snedtoorg);
              }
              /*加机构 类型*/
              postdata.totype += $scope.add_snedto_type('snedtoorg', '12');
            }
            if ($scope.data.currItem.cc) {
              /*加抄送名称*/
              postdata.ccname = ($scope.data.currItem.cc);
              /*加抄送id*/
              postdata.cc = $scope.deal_data($scope.data.currItem.cc);
              /*加抄送类型*/
              $scope.add_type();
              postdata.cctype = $scope.data.currItem.cctype.substr(0, $scope.data.currItem.cctype.length - 1)
            }

            /*附件*/
            if ($scope.data.currItem.attachofemails1) {
              for (var i = 0; i < $scope.data.currItem.attachofemails1.length; i++) {
                $scope.data.currItem.attachofemails1[i].downloadcode = $scope.data.currItem.attachofemails1[i].downloadcode;
                $scope.data.currItem.attachofemails1[i].refid = $scope.data.currItem.attachofemails1[i].docid;
                $scope.data.currItem.attachofemails1[i].refname = $scope.data.currItem.attachofemails1[i].docname;
                $scope.data.currItem.attachofemails1[i].refsize = $scope.data.currItem.attachofemails1[i].oldsize;
                $scope.data.currItem.attachofemails1[i].reftype = 6;

              }
              postdata.attachofemails = $scope.data.currItem.attachofemails1;
            }

            /*正文*/
            postdata.content = $('.summernote').summernote('code');
            /*自动回执*/
            if ($scope.data.currItem.autoreturn == 2) {
              postdata.autoreturn = $scope.data.currItem.autoreturn;
            }
            /*定时发送*/
            if (flag == 2 && sendtime) {
              postdata.sendtime = sendtime;
            }

            if (($scope.data.currItem.subject_send == '' || $scope.data.currItem.subject_send == undefined)) {
              var title = '主题为空，是否继续发送？';
              if (flag == 2) {
                title = '主题为空，是否存为草稿？'
              }
              if (sendtime) {
                title = '主题为空，是否定时发送？'
              }

              swalApi.confirm(title)
                .then(function () {
                  postdata.subject = '(无主题)';
                  return requestApi.post("scpemail", "insert", postdata)
                })
                .then(function (data) {
                  //清空发件内容
                  $scope.clearsend_email();
                  //返回收件箱
                  // $scope.search(99);
                  // $scope.show_box(2);
                  $scope.data.showSendtoname = data.sendtoname;
                  if (sendtime) {
                    $scope.data.sendSuccess.title = "定时邮件保存成功";
                    $scope.data.sendSuccess.content = '该邮件暂时保存在“草稿”中，它将在您指定的时间发出。';
                  } else if (flag == 2) {
                    $scope.data.sendSuccess.title = "存为草稿成功";
                    $scope.data.sendSuccess.content = '此邮件保存成功，已保存到“草稿”文件夹。';
                  } else {
                    $scope.data.sendSuccess.title = "您的邮件已发送";
                    $scope.data.sendSuccess.content = '此邮件发送成功，已保存到“已发邮件”文件夹。';
                  }
                  $scope.show(4);
                })

              /*ds.dialog.confirm(title, function () {
               postdata.subject = '(无主题)'
               requestApi.post({classId: "scpemail", action: "insert", data: postdata})
               .then(function (data) {
               //清空发件内容
               $scope.clearsend_email();
               if (flag == 2) {
               swalApi.success("存为草稿成功!");
               } else {
               swalApi.success("发送成功!");
               //返回收件箱
               $scope.search(99);
               }

               });
               }, function () {

               });*/

            } else {
              postdata.subject = $scope.data.currItem.subject_send;
              requestApi.post({classId: "scpemail", action: "insert", data: postdata})
                .then(function (data) {
                  //清空发件内容
                  $scope.clearsend_email();
                  // $scope.search(99);
                  // $scope.show_box(2);
                  $scope.data.showSendtoname = data.sendtoname;
                  if (sendtime) {
                    $scope.data.sendSuccess.title = "定时邮件保存成功";
                    $scope.data.sendSuccess.content = '该邮件暂时保存在“草稿”中，它将在您指定的时间发出。';
                  } else if (flag == 2) {
                    $scope.data.sendSuccess.title = "存为草稿成功";
                    $scope.data.sendSuccess.content = '此邮件保存成功，已保存到“草稿”文件夹。';
                  } else {
                    $scope.data.sendSuccess.title = "您的邮件已发送";
                    $scope.data.sendSuccess.content = '此邮件发送成功，已保存到“已发邮件”文件夹。';
                  }
                  $scope.show(4);
                });
            }
          }, 150);
        };


        var HelloButton = function (context) {
          var ui = $.summernote.ui;

          // create button
          var button = ui.button({
            contents: '<i class="fa fa-child"/> Hello',
            tooltip: 'hello',
            click: function () {
              // invoke insertText method with 'hello' on editor module.
              context.invoke('editor.insertText', 'hello');
            }
          });

          return button.render();   // return button as jquery object
        };

        /**
         * 初始化富文本编辑框
         */
        $('.summernote').summernote({
          height: 300,
          lang: 'zh-CN',
          fontNames: ["微软雅黑", "华文细黑", 'Arial', 'sans-serif', "宋体", "Times New Roman", 'Times', 'serif', "华文细黑", 'Courier New', 'Courier', '华文仿宋', 'Georgia', "Times New Roman", 'Times', "黑体", 'Verdana', 'sans-seri', "方正姚体", 'Geneva', 'Arial', 'Helvetica', 'sans-serif'],
          callbacks: {
            onImageUpload: function (files, editor, welEditable) {
              editor = $(this);
              uploadFile(files[0], editor, welEditable); //此处定义了上传文件方法
            }
          },
          /*buttons: {
           hello: HelloButton
           },
           toolbar: [
           ['style', ['bold', 'italic', 'underline', 'clear']],
           ['font', ['strikethrough', 'superscript', 'subscript']],
           ['fontsize', ['fontsize']],
           ['color', ['color']],
           ['para', ['ul', 'ol', 'paragraph']],
           ['height', ['height']],
           ['mybutton', ['hello']]
           ]*/
        });

        function uploadFile(file, editor, welEditable) {
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            //base64_code.innerHTML = this.result;
            //img_area.innerHTML = '<div>图片img标签展示：</div><img src="'+this.result+'" alt=""/>';
            console.log(' base64_code.innerHTML: ' + this.result);
            editor.summernote('insertImage', this.result);
          };
          /*var fd = new FormData();
           fd.append("docFile0", file);
           $.ajax({
           data: fd,
           type: "POST",
           url: '/web/scp/filesuploadsave2.do', //此处配置后端的上传文件，PHP，JSP或者其它
           cache: false,
           contentType: false,
           processData: false,
           success: function (res) {
           var obj = strToJson(res);
           //obj.data[0].downloadcode
           //'img/p1.jpg'
           editor.summernote('insertImage', '/downloadfile.do?iswb=true&docid=' + obj.data[0].docid); //完成上传后插入图片到编辑器

           }
           });*/
        };

        function strToJson(str) {
          var json = (new Function("return " + str))();
          return json;
        }

        $('.note-editing-area').keydown(function (event) {
          event.stopPropagation();
          console.warn(event);
        });

        /**
         * 内部邮件-通讯录树配置
         */
        var setting = {
          async: {
            enable: true,
            url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
            autoParam: ["id", "name=n", "level=lv"],
            otherParam: {
              "flag": 1
            },
            dataFilter: filter
          },
          view: {
            //dblClickExpand: false,
            // showIcon: showIconForTree,
            // selectedMulti: true,
            addHoverDom: addHoverDom,
            removeHoverDom: removeHoverDom,
          },
          check: {
            enable: true,//设置zTree的节点上是否显示checkbox/radio框，默认值: false
            chkboxType: {"Y": "", "N": ""}
          },
          key: {
            checked: "checked"//zTree 节点数据中保存check状态的属性名称。默认值："checked"
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          callback: {
            beforeExpand: beforeExpand,
            //onRightClick : OnRightClick,//右键事件
            onCheck: onCheck,
            onClick: onClick_tons,
            //dblClick:dblClick_ts
          }
        };


        /**
         * 外部邮件-内部通讯录树配置
         */
        var setting_in = {
          async: {
            enable: true,
            url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
            autoParam: ["id", "name=n", "level=lv"],
            otherParam: {
              "flag": 1
            },
            dataFilter: filter
          },
          view: {
            // showIcon: showIconForTree,
            showIcon: true,
            // selectedMulti: true,
            addHoverDom: addHoverDom,
            removeHoverDom: removeHoverDom,
          },
          check: {
            enable: true,//设置zTree的节点上是否显示checkbox/radio框，默认值: false
            // chkboxType: {"Y": "ps", "N": "ps"}
            chkboxType: {"Y": "", "N": ""}
          },
          key: {
            checked: "checked"//zTree 节点数据中保存check状态的属性名称。默认值："checked"
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          callback: {
            //beforeExpand: beforeExpand,
            //onRightClick : OnRightClick,//右键事件

            // onCheck: onCheck_in,
            // onClick: onClick_in_tons,
            onCheck: onCheck,
            onClick: onClick_tons,
          }
        };

        function beforeExpand() {
          //双击时取消单机事件
          if (TimeFn) {
            clearTimeout(TimeFn);
          }
        }

//这个是异步
        function filter(treeId, parentNode, childNodes) {

          var treeNode = parentNode;
          if (treeNode && treeNode.children) {
            return;
          }
          if (treeNode) {
            var postdata = treeNode
          } else {
            var postdata = {};
          }
          postdata.flag = 1;
          postdata.emailtype = 3;
          if (postdata.id) {
            postdata.orgid = parseInt(postdata.id);
          }
          var obj = BasemanService.RequestPostNoWait('scpemail_contact_list', 'search', postdata)
          var children = obj.data.scporgs;
          if (children) {
            treeNode.children = [];
            for (var i = 0; i < children.length; i++) {
              if (parseInt(children[i].sysuserid) > 0) {
                //用户
                // children[i].icon='/web/img/renyuan.png';
                children[i].iconSkin = 'renyuan';
                children[i].name = children[i].username;
              } else {
                //机构
                // children[i].icon='/web/img/jigou.png';
                children[i].iconSkin = 'jigou';
                children[i].isParent = true;
              }

            }
          }
          return children;
        }


        /**
         * 内部邮箱-通讯录树-勾选/外-内   treeDemo
         */
        function onCheck(e, treeId, treeNode) {
          /*if (treeNode.checked) {
           if (treeNode.isParent) {
           /!**
           * 父节点-请求子节点数据加载人员
           *!/
           var postdata = {};
           postdata.flag = 1;
           postdata.emailtype = 3;
           postdata.orgid = parseInt(treeNode.id);
           var obj = BasemanService.RequestPostNoWait('scpemail_contact_list', 'search', postdata)
           var children = obj.data.scporgs;
           for (var i = 0; i < children.length; i++) {
           if (parseInt(children[i].sysuserid) > 0) {
           if ($scope.focus == 2) {
           $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, children[i]);
           //增加收件人
           } else {
           $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, children[i]);
           }
           }
           }
           }
           else {
           /!**
           * 子节点-直接添加收件人
           * 光标不在抄送时默认加收件
           *!/
           if ($scope.focus == 2) {
           $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, treeNode);
           } else {
           $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, treeNode);
           }
           }
           }*/
          if (treeNode.checked) {
            /**
             * 勾选
             */
            var node = treeNode;
            if (node.isParent) {
              node.is_bumen = '部门';
              node.userid = node.id;
              node.username = node.name;
            }
            if ($scope.focus == 2) {
              //增加抄送人
              $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, node);
            } else {
              if (node.isParent) {
                //增加收件机构
                $scope.data.currItem.snedtoorg = $scope.addpeople_str($scope.data.currItem.snedtoorg, node, 3);
              } else {
                //增加收件人
                $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, node);
              }
            }
            $scope.data.addrModal = null;
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            treeObj.selectNode(treeNode);
          }
        }

        /**
         * 外部邮箱-内部通讯录树-勾选   换成onCheck
         */
        /*function onCheck_in(e, treeId, treeNode) {
         if (treeNode.checked) {
         if (treeNode.isParent) {
         /!**for(var i=0;i<treeNode.children.length;i++){
         //增加抄送人
         if($scope.focus==2){
         $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc,treeNode.children[i]);

         //增加收件人
         }else{
         $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto,treeNode.children[i]);
         }
         }*!/
         var postdata = {};
         postdata.flag = 1;
         postdata.emailtype = 3;
         postdata.orgid = parseInt(treeNode.id);
         var obj = BasemanService.RequestPostNoWait('scpemail_contact_list', 'search', postdata)
         var children = $.extend(true, [], obj.data.scporgs);
         for (var i = 0; i < children.length; i++) {
         if (parseInt(children[i].sysuserid) > 0) {
         if ($scope.focus == 2) {
         if (children[i].email) {
         children[i].userid = children[i].email;
         $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, children[i]);
         }
         //增加收件人
         } else {
         if (children[i].email) {
         children[i].userid = children[i].email;
         $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, children[i]);
         }
         }
         }

         }
         }
         }
         }*/

        /**
         * 勾选分组树/外部邮件-外部通讯录树 添加收件人
         */
        function onCheck_fz(e, treeId, treeNode) {
          if (treeNode.checked) {
            /*if (treeNode.isParent&&treeNode.children) {
             for (var i = 0; i < treeNode.children.length; i++) {
             if ($scope.focus == 2) {
             //增加抄送人
             $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, treeNode.children[i]);
             } else {
             //增加收件人
             $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, treeNode.children[i]);
             }
             }
             }/!**
             * 增加 勾选子节点时直接添加收件人
             *!/
             else {
             if ($scope.focus == 2) {
             $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, treeNode);
             } else {
             $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, treeNode);
             }
             }*/
            if ($scope.focus == 2) {
              $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, treeNode);
            } else {
              $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, treeNode);
            }
            $scope.data.addrModal = null;
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            treeObj.selectNode(treeNode);
          }
        }

        /**
         * 内部邮箱-通信录树单击
         */
        function onClick_tons(e, treeId, treeNode) {
          // 取消上次延时未执行的方法
          clearTimeout(TimeFn);
          //执行延时
          var TimeFn = setTimeout(function () {
            var node = treeNode;
            /*node.checked = true;
             var treeObj=$.fn.zTree.getZTreeObj(treeId);
             treeObj.updateNode(node);*/
            //机构
            if (node.isParent) {
              node.is_bumen = '部门';
              node.userid = node.id;
              node.username = node.name;
            }
            if ($scope.focus == 2) {
              //增加抄送人
              $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, node);
            } else {
              if (node.isParent) {
                //增加收件机构
                $scope.data.currItem.snedtoorg = $scope.addpeople_str($scope.data.currItem.snedtoorg, node, 3);
              } else {
                //增加收件人
                $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, node);
              }
            }
          }, 300)
        }

        /**
         * 外部邮箱-内部通信录树单击  换成onClick_tons
         */
        /*function onClick_in_tons(treeId, treeNode) {
          // 取消上次延时未执行的方法
          clearTimeout(TimeFn);
          //执行延时
          TimeFn = setTimeout(function () {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo_in");
            var node = zTree.getSelectedNodes()[0];
            //增加抄送人
            if ($scope.focus == 2) {
              if (node.email) {
                node.userid = node.email;
                $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, node);
              }

              //增加收件人
            } else {
              if (node.email) {
                node.userid = node.email;
                $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, node);
              }
            }
          }, 300)
        }*/

        /**
         * 内部邮件-分组树配置
         */
        var setting1 = {
          view: {
            // showIcon: showIconForTree,
            showIcon: false,
            addHoverDom: addHoverDom,
            removeHoverDom: removeHoverDom,
          },
          check: {
            enable: true,
            chkboxType: {"Y": "", "N": ""}
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          callback: {
            onClick: onClick_fz,
            onCheck: onCheck_fz
            //onDblClick: onDblClick
          }
        };
        /**
         * 外部邮件-外部通讯录树配置
         */
        var setting1_out = {
          view: {
            // showIcon: showIconForTree,
            showIcon: false,
            addHoverDom: addHoverDom,
            removeHoverDom: removeHoverDom,
          },
          check: {
            enable: true,
            chkboxType: {"Y": "", "N": ""}
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          callback: {
            onClick: onClick_fz,
            onCheck: onCheck_fz
            //onDblClick: onDblClick
          }
        };

        /**
         * 内外通讯录树是否显示图标
         */
        function showIconForTree(treeId, treeNode) {
          return !treeNode.isParent;
        }


        /*==========================================通讯树hover操作 start===========================================*/
        function addHoverDom(treeId, treeNode) {
          if ($scope.data.addrModal === null) {
            $scope.data.addrModal = {};
            return;
          }
          //addHoverDom重复加载两次
          if (JSON.stringify($scope.data.addrModal) != '{}')
            return;
          //是父节点时不显示
          if (treeNode.isParent)
            return;
          //是外部通讯录时不显示
          if (treeId == 'treeDemo_out')
            return;
          $scope.data.addrModal = treeNode;
          //显示模态框
          $scope.data.addrModal.timeout = setTimeout(function () {
            $scope.data.addrModalShow = true;
            $scope.$applyAsync();
          }, 500);
          //鼠标移出事件
          $("#" + treeNode.tId + "_a").one('mouseout', function () {
            console.log('mouseout', treeNode);
            $scope.data.addrModalShow = false;
            if ($scope.data.addrModal.timeout)
              clearTimeout($scope.data.addrModal.timeout);
            $scope.data.addrModal = {};
            $scope.$applyAsync();
          });
        }

        //选中节点时移出鼠标事件不生效
        function removeHoverDom(treeId, treeNode) {
        }

        /*==========================================通讯树hover操作 end===========================================*/


        /**
         * 内部邮箱-分组树/外部邮箱-外部通讯录 单击
         */
        function onClick_fz(treeId, treeNode) {
          var zTree = $.fn.zTree.getZTreeObj(treeNode);
          var node = zTree.getSelectedNodes()[0];
          //增加抄送人
          if ($scope.focus == 2) {
            $scope.data.currItem.cc = $scope.addpeople_str($scope.data.currItem.cc, node);

            //增加收件人
          } else {
            $scope.data.currItem.snedto = $scope.addpeople_str($scope.data.currItem.snedto, node);
          }
        }

        function onDblClick(treeId, treeNode) {
          var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
          var node = zTree.getSelectedNodes()[0];
          if (node.contactname) {
            return;
          }
          $scope.node = node;
          BasemanService.openFrm("views/baseman/addgroup.html", addgroup, $scope, "", "").result.then(function (res) {
            var postdata = res;
            postdata.emailtype = 3;
            requestApi.post({
              classId: "scpemail_contact_list",
              action: "add_contact_group",
              data: postdata
            }).then(function (data) {

              BasemanService.notice("分组创建成功", "alert-info");

            })
          })
        }


        /*==========================================内部邮箱 修改分组 start===========================================*/
        $scope.group_change = function (flag) {
          /*if (flag == 2) {
           var zTree = $.fn.zTree.getZTreeObj("treeDemo_out");
           var node = zTree.getSelectedNodes()[0];
           if (node.contactname) {
           return;
           }
           } else {
           var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
           var node = zTree.getSelectedNodes()[0];
           if (node.contactname) {
           return;
           }
           }*/
          var zTree = $.fn.zTree.getZTreeObj((flag == 2 ? "treeDemo_out" : "treeDemo1"));
          var node = zTree.getSelectedNodes()[0];
          if (!node) {
            return swalApi.info("请先选择分组");
          }
          /**
           * 分组的node.contactname===""
           */
          if (node.contactname) {
            return swalApi.info("此节点不是分组");
          }

          $scope.node = node;
          BasemanService.openFrm("views/baseman/addgroup.html", addgroup, $scope, "", "").result.then(function (res) {
              var postdata = res;
              if (flag == 2) {
                postdata.emailtype = 4;
              } else {
                postdata.emailtype = 3;
              }
              requestApi.post({
                  classId: "scpemail_contact_list",
                  action: "add_contact_group",
                  data: postdata
                }
              ).then(function (data) {
                /**
                 * 更新树父节点
                 */
                $scope.node.name = res.list_name;
                zTree.updateNode($scope.node);

                if (flag == 2) {
                  $scope.treeDemo_out.refresh();
                } else {
                  $scope.treeDemo_in.refresh();
                }

                swalApi.success("分组保存成功");
              })
            }
          )
        }
        /*==========================================内部邮箱 修改分组 end===========================================*/


        /*==========================================获取通信录信息 start===========================================*/
        $scope.getTreeData = function () {
          return requestApi.post({
            classId: "scpemail_contact_list",
            action: "search",
            data: {
              emailtype: 3
            }
          }).then(function (data) {
            //内部邮件通讯显示
            /**
             * 最近联系人
             */
            $scope.data.currItem.scpemail_contact_lists = data.scpemail_contact_lists;

            /**
             * 内部-分组树数据处理
             */
            for (var i = 0; i < data.scpemail_contact_group_lists.length; i++) {
              data.scpemail_contact_group_lists[i].id = parseInt(data.scpemail_contact_group_lists[i].list_id);
              data.scpemail_contact_group_lists[i].pId = parseInt(data.scpemail_contact_group_lists[i].list_pid);
              if (data.scpemail_contact_group_lists[i].contactname) {
                data.scpemail_contact_group_lists[i].name = (data.scpemail_contact_group_lists[i].contactname)
              } else {
                data.scpemail_contact_group_lists[i].name = (data.scpemail_contact_group_lists[i].list_name);
                data.scpemail_contact_group_lists[i].isParent = true;
              }

            }
            $scope.data.currItem.scpemail_contact_group_lists = data.scpemail_contact_group_lists;
            //内部邮件-分组树
            $scope.treeDemo_in = $.fn.zTree.init($("#treeDemo1"), setting1, data.scpemail_contact_group_lists);

            /**
             * 内/外-(内部)通讯录树数据处理
             */
            for (var i = 0; i < data.scporgs.length; i++) {
              data.scporgs[i].id = parseInt(data.scporgs[i].id);
              data.scporgs[i].pId = parseInt(data.scporgs[i].pid);
            }
            for (var i = 0; i < data.scporgs.length; i++) {
              if (data.scporgs[i].username) {
                // data.scporgs[i].icon = "/web/img/renyuan.png";
                data.scporgs[i].iconSkin = "renyuan";
                data.scporgs[i].orgname = data.scporgs[i].name;
                data.scporgs[i].name = data.scporgs[i].username;
              } else {
                // data.scporgs[i].icon = "/web/img/jigou.png";
                data.scporgs[i].iconSkin = "jigou";
                data.scporgs[i].isParent = true;
              }
            }
            $scope.data.scporgs = data.scporgs;
            //内部邮件-通讯录树
            $.fn.zTree.init($("#treeDemo"), setting, data.scporgs);
            //外部邮件-内部通讯录树
            $.fn.zTree.init($("#treeDemo_in"), setting_in, data.scporgs);


            //外部邮箱通讯显示 联系人
            $scope.data.currItem.scpemail_contact_wb_lists = data.scpemail_contact_wb_lists;

            /**
             * 外部-外部通讯录树数据处理
             */
            for (var i = 0; i < data.scpemail_contact_group_wb_lists.length; i++) {
              data.scpemail_contact_group_wb_lists[i].id = parseInt(data.scpemail_contact_group_wb_lists[i].list_id)
              data.scpemail_contact_group_wb_lists[i].pId = parseInt(data.scpemail_contact_group_wb_lists[i].list_pid)
              if (data.scpemail_contact_group_wb_lists[i].contactname) {
                data.scpemail_contact_group_wb_lists[i].name = (data.scpemail_contact_group_wb_lists[i].contactname)
              } else {
                data.scpemail_contact_group_wb_lists[i].name = (data.scpemail_contact_group_wb_lists[i].list_name);
                data.scpemail_contact_group_wb_lists[i].isParent = true;
              }
            }
            //外部邮箱分组
            $scope.data.currItem.scpemail_contact_group_wb_lists = data.scpemail_contact_group_wb_lists;
            //外部邮件-外部通讯录树
            $scope.treeDemo_out = $.fn.zTree.init($("#treeDemo_out"), setting1_out, data.scpemail_contact_group_wb_lists);
          });
        };
        /*==========================================获取通信录信息 end===========================================*/


        $('#send_people').mouseover(function (body) {////body可以随便
          $scope.data.currItem.fromuser_name = $scope.data.currItem.fromuser;
          var left = $scope.data.currItem.fromuser_name.indexOf('<');
          var right = $scope.data.currItem.fromuser_name.indexOf('>');
          $scope.data.currItem.email_name = $scope.data.currItem.fromuser_name.substr(left + 1, right - left - 1);
          $('.profileTip').css({'display': 'block', 'top': 50 + 'px', left: (body.pageX - 300) + 'px'});
          $scope.$apply();
        });
        $('#send_people').mouseout(function (body) {////body可以随便
          $('.profileTip').css('display', 'none');
        })
        $('#sj_people').mouseover(function (body) {////body可以随便
          $('.profileTip').css({'display': 'block', 'top': 88 + 'px'});
        });
        $('#sj_people').mouseout(function (body) {////body可以随便
          $('#send_people .profileTip').css('display', 'none');
        })
        $('.profileTip').mouseover(function () {
          $('.profileTip').css({'display': 'block'});
        })
        $('.profileTip').mouseout(function () {
          $('.profileTip').css({'display': 'none'});
        })
        $scope.mouseover_sj = function (item, index, e) {
          $scope.data.currItem.fromuser_name = item;
          var left = $scope.data.currItem.fromuser_name.indexOf('<');
          var right = $scope.data.currItem.fromuser_name.indexOf('>');
          $scope.data.currItem.email_name = $scope.data.currItem.fromuser_name.substr(left + 1, right - left - 1);
          $('.profileTip').css({'display': 'block', 'top': 88 + 'px', left: (e.pageX - 300) + 'px'});
        }
//增加高度
        $scope.addheight = function () {
          $('#addwidth').height(480 + $scope.data.currItem.attachofemails1.length * 29);
          $('#lm150338581407203951792705359891tree').height(400 + $scope.data.currItem.attachofemails1.length * 29)
        }
        var watch = $scope.$watch('data.currItem.attachofemails1', function (newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }
          $scope.addheight();
        }, true);

        $scope.mail = [];

        $("#mail").keyup(function () {
          console.warn('1111111111111111111');
          var postdata = {};
          postdata.clas = 2;
          if ($scope.focus == 2) {
            postdata.sqlwhere = " userid like '%" + $scope.data.currItem.cc + "%' or  username like '%" + $scope.data.currItem.cc + "%'";
          }

          requestApi.post({classId: "scpuser", action: "search", data: postdata})
            .then(function (data) {
              $("ul.autoul li").detach();
              for (var i = 0; i < data.users.length; i++) {
                var strname = '';
                strname = data.users[i].username + '<' + data.users[i].userid + '>';
                //把邮箱列表加入下拉
                //将取出的数据清空

                var $liElement = $("<li class=\"autoli\"><span class=\"ex\"></span><span class=\"at\">@</span><span class=\"step\">" + strname + "</span></li>");
                $liElement.appendTo("ul.autoul");

              }
              //下拉显示
              $(".autoul").show();
              //同时去掉原先的高亮，把第一条提示高亮
              if ($(".autoul li.lihover").hasClass("lihover")) {
                $(".autoul li.lihover").removeClass("lihover");
              }
              $(".autoul li:visible:eq(0)").addClass("lihover");
              if (event.keyCode == 8 || event.keyCode == 46) {

                $(this).next().children().removeClass("lihover");
                $(this).next().children("li:visible:eq(0)").addClass("lihover");
              }//删除事件结束

              if (event.keyCode == 38) {
                //使光标始终在输入框文字右边
                $(this).val($(this).val());
              }//方向键↑结束

              if (event.keyCode == 13) {
                if ($("ul.autoul li").is(".lihover")) {
                  $("#mail").val($("ul.autoul li.lihover").children(".ex").text() + "@" + $("ul.autoul li.lihover").children(".step").text());
                }
                $(".autoul").children().hide();
                $(".autoul").children().removeClass("lihover");
                $("#mail").focus();//回车后输入栏获得焦点
              }
            })
        })
//下拉菜单初始隐藏
        $(".autoul").hide();
        /**$("#mail").keyup(function(){

             if(event.keyCode!=38 && event.keyCode!=40 && event.keyCode!=13){

		          //菜单展现，需要排除空格开头和"@"开头
				  if( $.trim($(this).val())!="" && $.trim(this.value).match(/^@/)==null ) {

					$(".autoul").show();
					//同时去掉原先的高亮，把第一条提示高亮
					if($(".autoul li.lihover").hasClass("lihover")) {
					  $(".autoul li.lihover").removeClass("lihover");
					}
					$(".autoul li:visible:eq(0)").addClass("lihover");
				  }else{//如果为空或者"@"开头
					$(".autoul").hide();
					$(".autoul li:eq(0)").removeClass("lihover");
				  }

				  //把输入的字符填充进提示，有两种情况：1.出现"@"之前，把"@"之前的字符进行填充；2.出现第一次"@"时以及"@"之后还有字符时，不填充
				  //出现@之前
				  if($.trim(this.value).match(/[^@]@/)==null){//输入了不含"@"的字符或者"@"开头

					if($.trim(this.value).match(/^@/)==null){
					  //不以"@"开头
					  $(this).next().children("li").children(".ex").text($(this).val());
					}
				  }else{

					//输入字符后，第一次出现了不在首位的"@"
					//当首次出现@之后，有2种情况：1.继续输入；2.没有继续输入
					//当继续输入时
					var str = this.value;//输入的所有字符
					var strs = new Array();
					strs = str.split("@");//输入的所有字符以"@"分隔
					$(".ex").text(strs[0]);//"@"之前输入的内容
					var len = strs[0].length;//"@"之前输入内容的长度
					if(this.value.length>len+1){

					  //截取出@之后的字符串,@之前字符串的长度加@的长度,从第(len+1)位开始截取
					  var strright = str.substr(len+1);

					  //正则屏蔽匹配反斜杠"\"
					  if(strright.match(/[\\]/)!=null){
						strright.replace(/[\\]/,"");
						return false;
					  }

					  //遍历li
					  $("ul.autoul li").each(function(){

						//遍历span
						//$(this) li
						$(this).children("span.step").each(function(){

						  //@之后的字符串与邮件后缀进行比较
						  //当输入的字符和下拉中邮件后缀匹配并且出现在第一位出现
						  //$(this) span.step
						  if($("ul.autoul li").children("span.step").text().match(strright)!=null && $(this).text().indexOf(strright)==0){
							//class showli是输入框@后的字符和邮件列表对比匹配后给匹配的邮件li加上的属性
							$(this).parent().addClass("showli");
							//如果输入的字符和提示菜单完全匹配，则去掉高亮和showli，同时提示隐藏
							if(strright.length>=$(this).text().length){
							  $(this).parent().removeClass("showli").removeClass("lihover").hide();
							}
						  }else{
							$(this).parent().removeClass("showli");
						  }
						  if($(this).parent().hasClass("showli")){
							$(this).parent().show();
							$(this).parent("li").parent("ul").children("li.showli:eq(0)").addClass("lihover");
						  }else{
							$(this).parent().hide();
							$(this).parent().removeClass("lihover");
						  }
						});
					  });
					}else{
					  //"@"后没有继续输入时
					  $(".autoul").children().show();
					  $("ul.autoul li").removeClass("showli");
					  $("ul.autoul li.lihover").removeClass("lihover");
					  $("ul.autoul li:eq(0)").addClass("lihover");
					}
				  }
			}//有效输入按键事件结束




	    })*/
        $("#mail").keydown(function () {
          if (event.keyCode == 40) {
            //当键盘按下↓时,如果已经有li处于被选中的状态,则去掉状态,并把样式赋给下一条(可见的)li
            if ($("ul.autoul li").is(".lihover")) {
              //如果还存在下一条(可见的)li的话
              if ($("ul.autoul li.lihover").nextAll().is("li:visible")) {

                if ($("ul.autoul li.lihover").nextAll().hasClass("showli")) {

                  $("ul.autoul li.lihover").removeClass("lihover")
                    .nextAll(".showli:eq(0)").addClass("lihover");
                } else {

                  $("ul.autoul li.lihover").removeClass("lihover").removeClass("showli")
                    .next("li:visible").addClass("lihover");
                  $("ul.autoul").children().show();
                }
              } else {

                $("ul.autoul li.lihover").removeClass("lihover");
                $("ul.autoul li:visible:eq(0)").addClass("lihover");
              }
            }
          }
          if (event.keyCode == 38) {

            //当键盘按下↓时,如果已经有li处于被选中的状态,则去掉状态,并把样式赋给下一条(可见的)li
            if ($("ul.autoul li").is(".lihover")) {

              //如果还存在上一条(可见的)li的话
              if ($("ul.autoul li.lihover").prevAll().is("li:visible")) {


                if ($("ul.autoul li.lihover").prevAll().hasClass("showli")) {

                  $("ul.autoul li.lihover").removeClass("lihover")
                    .prevAll(".showli:eq(0)").addClass("lihover");
                } else {

                  $("ul.autoul li.lihover").removeClass("lihover").removeClass("showli")
                    .prev("li:visible").addClass("lihover");
                  $("ul.autoul").children().show();
                }
              } else {

                $("ul.autoul li.lihover").removeClass("lihover");
                $("ul.autoul li:visible:eq(" + ($("ul.autoul li:visible").length - 1) + ")").addClass("lihover");
              }
            } else {

              //当键盘按下↓时,如果之前没有一条li被选中的话,则第一条(可见的)li被选中
              $("ul.autoul li:visible:eq(" + ($("ul.autoul li:visible").length - 1) + ")").addClass("lihover");
            }
          }

        })

        $(".autoli").click(function () {
          $("#mail").val($(this).children(".ex").text() + $(this).children(".at").text() + $(this).children(".step").text());
          $(".autoul").hide();
        });//鼠标点击下拉菜单具体内容事件结束
        $("body").click(function () {
          $(".autoul").hide();
        });//鼠标点击document事件结束
        $("ul.autoul li").hover(function () {

          if ($("ul.autoul li").hasClass("lihover")) {

            $("ul.autoul li").removeClass("lihover");
          }
          $(this).addClass("lihover");
        });//鼠标滑动时

        /**
         * 系统参数
         * 获取限制附件大小系统参数
         * 单位为M
         */
        requestApi.post("scpsysconf", "select", {confname: 'mailattachsize'})
          .then(function (data) {
            $scope.data.currItem.mailattachsize = data.confvalue;
          });


        /*==========================================服务端另存 start===========================================*/
        /**
         * 附件
         * 服务端另存
         * @param docid
         * @param reftype
         */
        $scope.server_save = function (docid, reftype) {
          var l = 0;
          BasemanService.openFrm("views/baseman/file_structure.html", file_structure, $scope, "", "").result.then(function (res) {
            requestApi.post('scpdoc_web_rev', 'copy_to', {
              docid: docid,
              fdrid: res.fdrid,
              idpath: res.idpath,
              typepath: res.typepath
            })
              .then(function (data) {
                swalApi.success("另存成功");
              })
          })
        };

        var file_structure = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance, $parent) {
          // file_structure = SinoccCommon.extend(file_structure, ctrl_bill_public);
          // file_structure.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
          $scope.$parent = $parent;
          controllerApi.extend({
            controller: ctrl_bill_public.controller,
            scope: $scope
          });

          $scope.objconf = {
            name: "myfiles",
            key: "fileid",
            FrmInfo: {},
            grids: []
          };
          var setting = {
            async: {
              enable: true,
              url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
              autoParam: ["id", "name=n", "level=lv"],
              otherParam: {
                "id": 108
              },
              dataFilter: filter
            },
            data: {
              /*simpleData: {
               enable: true
               }*/
            },
            callback: {
              beforeExpand: beforeExpand
            }
          };


          function beforeExpand(treeId, treeNode) {
            if (treeNode.children) {
              return;
            }
            if (treeNode.wsid) {
              var classname = 'scpworkspace'
            } else {
              var classname = 'scpfdr'
            }
            var postdata = treeNode;
            postdata.excluderight = 1;
            var obj = BasemanService.RequestPostNoWait(classname, 'selectref', postdata);
            requestApi.post(classname, 'selectref', postdata)
              .then(function () {
                var data = obj.data;
                if (data.shortcuts && data.shortcuts.length > 0) {
                  for (var i = 0; i < data.shortcuts.length; i++) {
                    data.shortcuts[i].fdrname = data.shortcuts[i].scname;
                    data.shortcuts[i].fdrid = data.shortcuts[i].refid;
                  }
                  data.children = data.shortcuts;
                } else {
                  data.children = data.fdrs;
                }

                if (data.children) {
                  treeNode.children = [];
                  var zTree = $.fn.zTree.getZTreeObj("treeDemo_frm");
                  for (var i = 0; i < data.children.length; i++) {
                    data.children[i].isParent = true;
                    data.children[i].name = data.children[i].fdrname;
                    data.children[i].pId = parseInt(treeNode.id);
                    data.children[i].id = parseInt(data.children[i].fdrid);
                    data.children[i].item_type = 1;
                    if (data.children[i].creator == userbean.userid) {
                      data.children[i].objaccess = treeNode.objaccess;
                    }
                  }
                  zTree.addNodes(treeNode, data.children)
                }
              });
          }

          function filter(treeId, parentNode, childNodes) {
            return null;
          }

          /**
           * 服务端另存控制器-初始化
           */
          $scope.clearinformation = function () {
            $timeout(function () {
              /*BasemanService.RequestPost('scpworkspace', 'selectall', {
               wstype: 4,
               userid: window.userbean.userid,
               modid: 933,
               sysuserid: window.userbean.sysuserid
               })
               .then(function(data) {
               //var  post   =data.workspaces[1]
               var zNodes = {
               icon: "/web/img/file_01.png"
               };
               zNodes.name = window.userbean.userid + "的文件管理";
               if(userbean.userauth.admins) {
               zNodes.objaccess = '2222222';
               }
               //zNodes.name = '公司文档'
               zNodes.id = 0;
               zNodes.isParent = true;
               zNodes.fdrid = 0;
               $scope.data.fdrs_levelOne = data.workspaces;
               data.children = data.workspaces;

               for(var i = 0; i < data.children.length; i++) {
               data.children[i].isParent = true;
               data.children[i].name = data.children[i].wsname;
               //文件夹的时候设置为1
               data.children[i].item_type = 1;
               data.children[i].id = parseInt(i + 1);
               data.children[i].fdrid = parseInt(i + 1);
               data.children[i].icon = '/web/img/computer.png';
               data.children[i].objaccess = '2222222';
               }
               zNodes.children.push(data.children[0]);
               $scope.zTree = $.fn.zTree.init($("#treeDemo_frm",parent.document), setting, zNodes)
               });*/

              requestApi.post({
                classId: 'scpworkspace',
                action: 'selectref',
                data: {
                  wsid: userbean.wsid,
                  wstype: 4,
                  excluderight: 1,
                  wsright: 'FF0000FFFF0000000000000000FF'
                }
              })
                .then(function (data) {
                  var zNodes = {
                    icon: "/web/img/file_01.png"
                  };
                  zNodes.name = window.userbean.userid + "的文件管理";
                  if (userbean.userauth.admins) {
                    zNodes.objaccess = '2222222';
                  }
                  zNodes.id = 0;
                  zNodes.isParent = true;
                  zNodes.fdrid = 0;
                  zNodes.open = true;
                  $scope.data.fdrs_levelOne = data.workspaces;
                  data.children = data.fdrs;

                  for (var i = 0; i < data.children.length; i++) {
                    data.children[i].isParent = true;
                    data.children[i].name = data.children[i].fdrname;
                    //文件夹的时候设置为1
                    data.children[i].item_type = 1;
                    data.children[i].objaccess = '2222222';
                  }
                  zNodes.children = data.children;
                  $scope.zTree = $.fn.zTree.init($("#treeDemo_frm", parent.document), setting, zNodes)
                })

            });
          };

          $scope.ok = function () {
            if ($scope.validate()) {
              var node = $scope.zTree.getSelectedNodes();
              $modalInstance.close(node[0]);
            }
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
          $scope.validate = function () {
            var node = $scope.zTree.getSelectedNodes();
            if (node == '' || node == undefined) {
              BasemanService.notice('请选中一行');
              return false;
            }
            return true;
          };
          $scope.initdata();
        }
        /*==========================================服务端另存 end===========================================*/

        /**
         * 获取页面传参-跳转至指定show
         */
        $scope.init = function () {
          $scope.getTreeData()
            .then(function () {
              if ($stateParams.oatype == "write") {
                $scope.show(2);
              }
              if (!$scope.isNull($stateParams.emailid)) {
                $scope.show(3, $stateParams.emailid)
              }
            })
        };
      }
    ];


//使用控制器Api注册控制器
//需传入require模块和控制器定义
    return controllerApi.controller({
      module: module,
      controller: MailController
    });
  }
);

