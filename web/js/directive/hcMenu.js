/**
 * 右键菜单
 * @since 2019-02-19
 */
define(
    ['module', 'directiveApi', 'swalApi'],
    function (module, directiveApi, swalApi) {
        //定义指令
        var directive = [
            function () {
                return {
                    templateUrl: directiveApi.getTemplateUrl(module),
                    controller: [
                        '$scope', '$element', '$attrs', '$compile',
                        function ($scope, $element, $attrs, $compile) {

                            var hcMenu = $scope.hcMenu ? $scope.hcMenu : {};//定义菜单对象

                            if (!$scope.hcMenu) {
                                console.log("请使用$scope.hcMenu对象来定义菜单按钮");
                                return;
                            }
                            angular.forEach(hcMenu, function (obj, objname) {

                            })

                            /** =================树右键菜单绑定 =============**/
                            var treeSetting = $scope.hcMenu.treeSetting;

                            if ($scope.hcMenu.treeSetting) {
                                var treeSetting = $scope[$scope.hcMenu.treeSetting];
                                if (treeSetting.callback) { //绑定树右键事件
                                    treeSetting.callback.onRightClick = OnRightClick;
                                }
                                if (treeSetting.zTreeObj) {
                                    treeSetting.zTreeObj.refresh();
                                }
                            }

                            /**
                             * 树右键
                             */
                            function OnRightClick(event, treeId, treeNode) {
                                if (treeNode) {
                                    var top = $(window).scrollTop();
                                    $scope[$scope.hcMenu.treeSetting].zTreeObj.selectNode(treeNode);
                                    if (treeNode.getParentNode()) {
                                        var isParent = treeNode.isParent;
                                        if (isParent) { //非叶子节点
                                            showRMenu("firstNode", event.clientX, event.clientY + top); //处理位置，使用的是绝对位置
                                        } else { //叶子节点
                                            showRMenu("secondNode", event.clientX, event.clientY + top);
                                        }
                                    } else {
                                        showRMenu("root", event.clientX, event.clientY + top); //根节点
                                    }
                                }
                            }

                            /**
                             * 显示树右键菜单
                             */
                            function showRMenu(type, x, y) {
                                $element.find("#rMenu ul").show();
                                $element.find('[hc-menu="hcMenu"]').css({
                                    "top": y + "px",
                                    "left": x + "px",
                                    "visibility": "visible"
                                });
                                $scope.$apply();
                                //在当前页面绑定 鼠标事件
                                $(document).bind("mousedown", onBodyMouseDown);
                            }

                            /**================网格右键菜单绑定 =======**/
                            if ($scope.gridOptions) {
                                $scope.gridOptions.getContextMenuItems = getContextMenuItems;
                            }

                            function getContextMenuItems(params) {
                                if (params.node && params.node.selected == false) {
                                    params.node.setSelected(true, true);
                                } else {

                                }
                                $scope.data.flag = 2;
                                var obj1 = { // custom item
                                    name: '搜索',
                                    action: function () {
                                        window.alert('Alerting about ' + params.value);
                                    },
                                    icon: '<i class="fa fa-search"></i>',
                                    cssClasses: ['redFont', 'bold']
                                }
                                var obj2 = {
                                    name: '复制',
                                    icon: '<i class="fa fa-files-o"></i>',
                                    action: function (params) {
                                        return $scope.hcMenu.file_copy.func
                                    }
                                }
                                var obj3 = {
                                    name: '剪切',
                                    icon: '<i class="fa fa-arrows"></i>',
                                    action: function (params) {
                                        return $scope.file_cut1()
                                    }
                                }
                                var obj23 = {
                                    name: '粘贴',
                                    icon: '<i class="fa fa-clipboard"></i>',
                                    action: function (params) {
                                        return $scope.paste_file()
                                    }
                                }
                                var obj4 = {
                                    name: '权限',
                                    icon: '<i class="fa fa-share"></i>',
                                    action: function (params) {
                                        return $scope.share(3);
                                    }
                                }
                                //文件夹删除
                                var obj4_2 = {
                                    name: '删除',
                                    icon: '<i class="fa fa-trash-o"></i>',
                                    action: function (params) {
                                        return $scope.del_file(2, 0);
                                    }
                                }
                                //文件删除
                                var obj4_3 = {
                                    name: '删除',
                                    icon: '<i class="fa fa-trash-o"></i>',
                                    action: function (params) {
                                        return $scope.del_file(3, 0);
                                    }
                                }
                                //文件夹重命名
                                var obj5_2 = {
                                    name: '重命名',
                                    icon: '<i class="fa fa-pencil"></i>',
                                    action: function (params) {
                                        return $scope.new_name(2);
                                    }
                                }
                                //文件重命名
                                var obj5_3 = {
                                    name: '重命名',
                                    icon: '<i class="fa fa-pencil"></i>',
                                    action: function (params) {
                                        return $scope.new_name(3);
                                    }
                                }
                                var obj6 = {
                                    name: '替换',
                                    icon: '<i class="fa fa-repeat"></i>',
                                    action: function (params) {
                                        return $scope.exchange(3);
                                    }
                                }
                                var obj7 = {
                                    name: '历史版本',
                                    icon: '<i class="fa fa-history"></i>',
                                    action: function (params) {
                                        return $scope.history_version(3);
                                    }
                                }
                                var obj8 = {
                                    name: '发邮件',
                                    icon: '<i class="fa fa-envelope-o"></i>',
                                    action: function (params) {
                                        return $scope.send_email(3);
                                    }
                                }
                                var obj9 = {
                                    name: '流程',
                                    icon: '<i class="fa fa-plane"></i>',
                                    action: function (params) {
                                        return $scope.process(3);
                                    }
                                }
                                var obj10 = {
                                    name: '下载',
                                    icon: '<i class="fa fa-download"></i>',
                                    action: function (params) {
                                        return $scope.download(params);
                                    }
                                }
                                var obj11 = {
                                    name: '',
                                    action: function (params) {
                                        return $scope.open_double(3);
                                    }
                                }
                                var obj12 = {
                                    name: '属性',//文件夹属性
                                    icon: '<i class="fa fa-info-circle"></i>',
                                    action: function (params) {
                                        return $scope.ftr_attr();
                                    }
                                }
                                var obj12_2 = {
                                    name: '属性',//文件属性
                                    icon: '<i class="fa fa-info-circle"></i>',
                                    action: function (params) {
                                        return $scope.doc_attr();
                                    }
                                }
                                if (params.value) {
                                    //itemtype 1 文件夹 2 文件
                                    var result = [];
                                    //解析权限
                                    $scope.judge_left(params.node.data);
                                    //如果是文件夹
                                    if (params.node.data.item_type == 1) {
                                        result.push({ // custom item
                                            name: '搜索',
                                            action: function () {
                                                window.alert('Alerting about ' + params.value);
                                            },
                                            icon: '<i class="fa fa-search"></i>',
                                            cssClasses: ['redFont', 'bold']
                                        })
                                        //判断是否有转授权限
                                        if ($scope.data.transfer == 2 || $scope.userbean.userid == 'admin') {
                                            result.push(obj2);
                                            result.push(obj3);
                                            $scope.file_list && $scope.file_list.length > 0 && result.push(obj23);
                                            result.push(obj4);
                                            result.push(obj4_2);
                                            result.push(obj5_2);
                                        } else {
                                            //判断是否有删除的权限
                                            if ($scope.data.delete == 2) {
                                                result.push(obj2);
                                                result.push(obj3);
                                                $scope.file_list && $scope.file_list.length > 0 && result.push(obj23);
                                                result.push(obj4_2);
                                                result.push(obj5_2);

                                            } else {
                                                //判断是否有修改的权限
                                                if ($scope.data.modify == 2) {
                                                    result.push(obj2);
                                                    result.push(obj3);
                                                    $scope.file_list && $scope.file_list.length > 0 && result.push(obj23);
                                                    result.push(obj4_2);
                                                    result.push(obj5_2);
                                                }
                                            }
                                        }
                                        result.push(obj12);
                                    } else {

                                        //判断是否有转授权限
                                        if ($scope.data.transfer == 2 || $scope.userbean.userid == 'admin') {
                                            result.push(obj2);
                                            result.push(obj3);
                                            $scope.file_list && $scope.file_list.length > 0 && result.push(obj23);
                                            result.push(obj4);
                                            result.push(obj6);
                                            result.push(obj7);
                                            result.push(obj8);
                                            result.push(obj4_3);
                                            result.push(obj5_3);
                                            // result.push(obj9);
                                            result.push(obj10);
                                        } else {
                                            //判断是否有删除的权限
                                            if ($scope.data.delete == 2) {
                                                result.push(obj2);
                                                result.push(obj3);
                                                $scope.file_list && $scope.file_list.length > 0 && result.push(obj23);
                                                result.push(obj6);
                                                result.push(obj7);
                                                result.push(obj8);
                                                result.push(obj4_3);
                                                result.push(obj5_3);
                                                // result.push(obj9);
                                                result.push(obj10);

                                            } else {
                                                //判断是否有修改的权限
                                                if ($scope.data.modify == 2) {
                                                    result.push(obj2);
                                                    result.push(obj3);
                                                    $scope.file_list && $scope.file_list.length > 0 && result.push(obj23);
                                                    result.push(obj6);
                                                    result.push(obj7);
                                                    result.push(obj8);
                                                    result.push(obj5_3);
                                                    // result.push(obj9);
                                                    result.push(obj10);
                                                } else {
                                                    //判断是否有新增的权限
                                                    if ($scope.data.new == 2) {
                                                        result.push(obj7);
                                                        result.push(obj8);
                                                        // result.push(obj9);
                                                        result.push(obj10);
                                                    } else {
                                                        //判断是否有输出的权限
                                                        if ($scope.data.new == 2) {
                                                            result.push(obj7);
                                                            result.push(obj8);
                                                            result.push(obj10);
                                                        } else {
                                                            //判断是否有只读的权限
                                                            if ($scope.data.read == 2) {
                                                                result.push(obj7);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        result.push(obj12_2);
                                    }

                                }
                                else {
                                    //右边空白处
                                    var result = [{ // custom item
                                        name: '搜索',
                                        action: function () {
                                            window.alert('Alerting about ' + params.value);
                                        },
                                        icon: '<i class="fa fa-search"></i>',
                                        cssClasses: ['redFont', 'bold']
                                    },
                                        { // custom item
                                            name: '刷新',
                                            icon: '<i class="fa fa-refresh"></i>',
                                            action: function () {
                                                var node = ztreeObj.getSelectedNodes()[0];
                                                if (node.id == 0) {
                                                    return $scope.getDirectory()
                                                } else {
                                                    return menuShowNode()
                                                }
                                            },
                                            tooltip: 'Very long tooltip, did I mention that I am very long, well I am! Long!  Very Long!'
                                        }
                                    ]
                                    //判断左边权限
                                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                                    var node = ztreeObj.getSelectedNodes()[0];
                                    $scope.judge_left(node);
                                    if ($scope.data.modify == 2) {
                                        result.push('separator');
                                        $scope.file_list && $scope.file_list.length > 0 && result.push(obj23);
                                    }
                                    if ($scope.data.new == 2) {
                                        result.push('separator');
                                        result.push({
                                            name: '新建',
                                            icon: '<i class="fa fa-folder-open-o"></i>',
                                            subMenu: [{
                                                name: '文件夹',
                                                action: $scope.create_file,
                                                icon: '<img src="img/file.png"/>'
                                            }]
                                        })
                                        result.push('separator');
                                        result.push({ // custom item
                                            name: '文件录入',
                                            icon: '<i class="fa fa-file-o"></i>',
                                            action: function () {
                                                var node = ztreeObj.getSelectedNodes()[0];
                                                if (node.id == 0) {
                                                    swalApi.info("最上层不能添加文件")
                                                } else {
                                                    $scope.addfile();
                                                }
                                            },
                                            cssClasses: ['dropzone']
                                        })
                                    }
                                }
                                return result;
                            }

                            /** ================= 菜单事件 =============**/
                            //鼠标点击事件触发 隐藏菜单
                            function onBodyMouseDown(event) {
                                if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
                                    $("#rMenu").css({
                                        "visibility": "hidden"
                                    });
                                }
                            }

                            //隐式 隐藏右键菜单
                            function hideRMenu() {
                                if ($("#rMenu")) {
                                    $("#rMenu").css({
                                        "visibility": "hidden"
                                    });
                                }
                                //取消绑定
                                $(document).unbind("mousedown", onBodyMouseDown);
                            }
                        }
                    ]
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