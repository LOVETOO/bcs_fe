/**
 * hjx
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'fileApi', 'zTreeApi', 'openBizObj', 'promiseApi', 'swalApi', 'requestApi', '$timeout', 'summernote', 'xss', 'specialProperty', 'directive/swfUpload', 'directive/hcRichText', 'directive/hcImg', 'directive/hcModal', /*'directive/hcDatePicker'*/],
    function (module, controllerApi, base_obj_prop, fileApi, zTreeApi, openBizObj, promiseApi, swalApi, requestApi, $timeout, summernote, xss, specialProperty) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal', '$stateParams', '$timeout', '$parse',
            //控制器函数


            function ($scope, $modal, $stateParams) {
                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    currItem: {
                        mailattachsize: 5
                    },
                    bool: false,
                    imgbool: false,
                    noteOption: {
                        minHeight: 400
                    }
                };

                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //上传图片
                $scope.uploadFile = function () {
                    fileApi.uploadFile({
                        multiple: false,
                        accept: 'image/*'
                    }).then(function (docs) {
                        $scope.data.currItem.title_img_id = docs[0].docid;
                        console.log($scope.data.currItem.title_img_id)
                        $(".invoice_div_img").css("height", "142px");
                        $(".invoice_div_img").css("display", "block");
                        $scope.data.imgbool = true;
                    });
                };

                //移除图片
                $scope.del_invoice_image = function () {
                    $scope.data.currItem.title_img_id = undefined;
                    $scope.data.imgbool = false;
                    $(".invoice_div_img").css("display", "none");
                };

                //删除可阅读者
                $scope.delete = function (i) {
                    $scope.data.currItem.readers.splice(i, 1)
                };

                //清空可阅读者
                $scope.clean = function () {
                    $scope.data.currItem.readers = [];
                };

                //标签定义 
                $scope.tabs.base = {
                    title: '发文信息',
                    active: true
                };
                $scope.tabs.readed = {
                    title: '已阅读记录'
                };
                $scope.tabs.notread = {
                    title: '未阅读记录'
                };

                /**
                 * 监听滚动条
                 */
                $scope.scrollwatch = function () {
                    promiseApi.whenTrue(function () {
                        return $('[hc-tab-page]').length > 0
                    }, 200).then(function () {
                        $('[hc-tab-page]').scroll(function () {
                            var height = $('[hc-tab-page]').scrollTop();
                            var contenth = $('#base').height();//内容高度
                            //var viewH = $(window.top.document).find('div.modal-content').height();  //可见高度
                            var viewH = $('div[hc-tab-page]').height();
                            console.log('height:' + height, 'contenth:' + contenth, 'viewh' + viewH)
                            if (height > 250) {
                                var width = $('#main').width();
                                $("div.note-toolbar").addClass('fixedtop');
                                $("div.note-toolbar").innerWidth(width - 2);
                                contenth = $('#base').height();//内容高度
                            } else {
                                contenth = $('#base').height();//内容高度
                                $("div.note-toolbar").removeClass('fixedtop');
                            }
                            if ((height + viewH) > (contenth - 5)) {
                                contenth = $('#base').height();//内容高度
                                $("div.note-toolbar").removeClass('fixedtop');
                            }
                        });
                    });
                };

                //长度验证
                $scope.checkStrLength = function (str, maxLength, name, invalidBox) {
                    var w = 0;
                    var tempCount = 0;
                    //length 获取字数数，不区分汉子和英文 
                    if (str != '' && str != undefined) {
                        for (var i = 0; i < str.length; i++) {
                            //charCodeAt()获取字符串中某一个字符的编码 
                            var c = str.charCodeAt(i);
                            //单字节加1  
                            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                                w++;
                            } else {
                                w += 2;
                            }
                            if (w > maxLength) {
                                invalidBox.push(name + '长度超过' + maxLength + '字节');
                                break;
                            }
                        }
                    }
                };

                /*----------------------------------表格定义-------------------------------------------*/
                // 已阅读记录 
                $scope.gridOptions_readed = {

                    columnDefs: [{
                        type: '序号'
                    },
                    {
                        field: 'username',
                        headerName: '名称'
                    },
                    {
                        field: 'vh_time',
                        headerName: '阅读时间'
                    }]
                }

                // 未阅读记录 
                $scope.gridOptions_notread = {
                    columnDefs: [{
                        type: '序号'
                    },
                    {
                        field: 'username',
                        headerName: '名称'
                    }]
                }

                /*-------------------通用查询开始------------------------*/

                /* 批量选择机构 */
                $scope.treeAddDept = function () {
                    top.require(['ztree.excheck'], function () {
                        $scope.treeModal.open({
                            title: '机构',
                            controller: ['$scope', function ($modalScope) {
                                // 数据定义
                                $modalScope.data = {
                                    currItem: {}
                                };

                                $modalScope.data.title = "选择机构";
                                $modalScope.data.rootOrgId = 0;
                                $modalScope.data.rootOrgName = "机构";
                                $modalScope.data.checkOrg = [];

                                // 树参数定义
                                $modalScope.treeSetting = {
                                    data: {
                                        simpleData: {
                                            enable: true,
                                            idKey: "id",
                                            pIdKey: "pId",
                                            rootPId: "0"
                                        }
                                    },
                                    check: {
                                        enable: true
                                    }
                                };

                                // 查询树数据
                                setOrgData.dataPromise = requestApi.post({
                                    classId: "scporg",
                                    action: "search",
                                    data: {}
                                });
                                //设置模块菜单数据
                                function setOrgData() {
                                    return setOrgData.dataPromise
                                        .then(function (result) {
                                            var orgNodes = [];
                                            result.orgs.forEach(function (data) {
                                                var orgNode = {};
                                                orgNode.name = data.orgname;
                                                orgNode.id = data.orgid;
                                                orgNode.pId = data.superid;
                                                orgNode.isParent = true;
                                                orgNode.open = true;
                                                orgNode.data = data;
                                                if (!$scope.data.currItem.scp_news_readers) {
                                                    $scope.data.currItem.scp_news_readers = [];
                                                }
                                                $scope.data.currItem.scp_news_readers.forEach(function (item) {
                                                    if (item.readerid == item.readerid && item.reader_type == 2) {
                                                        orgNode.checked = true;
                                                    }
                                                });
                                                orgNodes.push(orgNode);
                                            });
                                            var t = setInterval(function () {
                                                if (top.$("#zTree").length > 0) {
                                                    var Tree = top.$("#zTree");
                                                    $scope.zTree = zTreeApi.create(Tree, $modalScope.treeSetting);
                                                    $scope.zTree.addNodes(null, orgNodes);
                                                    $modalScope.treeSetting.hcApi.reload(orgNodes);
                                                    clearInterval(t);
                                                }
                                            }, 100);

                                        })
                                }
                                setOrgData()
                                // 模态框按钮定义
                                $modalScope.footerRightButtons.rightTest = {
                                    title: '确定',
                                    click: function () {
                                        // 获取所有勾选的节点
                                        $modalScope.data.allSelectedNodes = $modalScope.treeSetting.zTreeObj.getCheckedNodes(true);
                                        console.log('$modalScope.data.allSelectedNodes', $modalScope.data.allSelectedNodes);
                                        //编辑勾选的节点，获取无子节点的数据，插入数组
                                        for (var i = 0; i < $modalScope.data.allSelectedNodes.length; i++) {
                                            var obj = {
                                                type: 2,
                                                name: $modalScope.data.allSelectedNodes[i].data.orgname + "（机构）",
                                                id: $modalScope.data.allSelectedNodes[i].data.orgid
                                            };
                                            if ($scope.data.currItem.readers != undefined && $scope.data.currItem.readers.length != 0) {
                                                for (var j = 0; j < $scope.data.currItem.readers.length; j++) {
                                                    if (j == $scope.data.currItem.readers.length - 1 && $scope.data.currItem.readers[j].name != obj.name && $scope.data.currItem.readers[j].id) {
                                                        if ($modalScope.data.allSelectedNodes[i].check_Child_State == -1) {
                                                            $scope.data.currItem.readers.push(obj)
                                                        }
                                                    }
                                                }
                                            } else {
                                                if ($modalScope.data.allSelectedNodes[i].check_Child_State == -1) {
                                                    $scope.data.currItem.readers.push(obj)
                                                }
                                            }
                                        }
                                        $modalScope.$close($modalScope.data);
                                    }
                                };

                            }]
                        })
                    });
                };

                /* 批量选择岗位 */
                // $scope.treeWorksDept = function () {
                //     var rootNode;
                //     top.require(['ztree.excheck'], function () {
                //         $scope.treeModal_2.open({
                //             controller: ['$scope', function ($modalScope) {
                //                 // 数据定义
                //                 $modalScope.data = {
                //                     currItem: {}
                //                 };
                //                 $modalScope.data.title = "选择岗位";
                //                 $modalScope.data.rootWorkId = 0;
                //                 $modalScope.data.rootWorkName = "岗位";
                //                 $modalScope.data.checkWork = [];

                //                 // 树参数定义
                //                 $modalScope.treeSetting_2 = {
                //                     check: {
                //                         enable: true,
                //                         chkStyle: "checkbox",
                //                         chkboxType: { "Y": "p", "N": "s" }
                //                     },
                //                     //返回根节点或其承诺
                //                     hcGetRootNodes: function () {
                //                         return {
                //                             name: $modalScope.data.rootWorkName,
                //                             data: {
                //                                 orgid: $modalScope.data.rootWorkId
                //                             },
                //                             isParent: true
                //                         };
                //                     },
                //                     //返回指定节点的子节点或其承诺
                //                     hcGetChildNodes: function (node) {
                //                         if (node.name == '岗位' && node.data.orgid == 0) {
                //                             return requestApi.post({
                //                                 classId: 'scpworkspace',
                //                                 action: 'selectref',
                //                                 data: {
                //                                     excluderight: 1,
                //                                     wsid: -16,
                //                                     wstag: -16
                //                                 }
                //                             })
                //                                 .then(function (response) {
                //                                     node.data.orgs = response.orgs;
                //                                     return response.orgs.map(function (data) {
                //                                         return {
                //                                             name: data.orgname,
                //                                             objType: 13,
                //                                             isParent: true,
                //                                             data: data,
                //                                         };
                //                                     });
                //                                 });
                //                         } else {
                //                             return requestApi.post({
                //                                 classId: 'scporg',
                //                                 action: 'selectref',
                //                                 data: node.data
                //                             })
                //                                 .then(function (response) {
                //                                     node.data.orgs = response.orgoforgs;
                //                                     return response.orgoforgs.map(function (data) {
                //                                         return {
                //                                             name: data.orgname,
                //                                             objType: 13,
                //                                             isParent: true,
                //                                             data: data
                //                                         };
                //                                     });
                //                                 });
                //                         }

                //                     },
                //                     //返回指定节点的表格数据或其承诺
                //                     hcGetGridData: function (node) {
                //                         return node.data.orgs
                //                     }
                //                 };
                //                 // 模态框按钮定义
                //                 $modalScope.footerRightButtons.rightTest = {
                //                     title: '确定',
                //                     click: function () {
                //                         // 获取所有勾选的节点
                //                         $modalScope.data.allSelectedNodes = $modalScope.treeSetting_2.zTreeObj.getCheckedNodes(true);
                //                         console.log('$modalScope.allSelectedNodes', $modalScope.allSelectedNodes);
                //                         //编辑勾选的节点，获取无子节点的数据，插入数组
                //                         for (var i = 0; i < $modalScope.data.allSelectedNodes.length; i++) {
                //                             var obj = {
                //                                 type: 2,
                //                                 name: $modalScope.data.allSelectedNodes[i].data.orgname,
                //                                 id: $modalScope.data.allSelectedNodes[i].data.orgid
                //                             };
                //                             if ($scope.data.currItem.readers != undefined && $scope.data.currItem.readers.length != 0) {
                //                                 for (var j = 0; j < $scope.data.currItem.readers.length; j++) {
                //                                     if (j == $scope.data.currItem.readers.length - 1 && $scope.data.currItem.readers[j].name != obj.name && $scope.data.currItem.readers[j].id) {
                //                                         if ($modalScope.data.allSelectedNodes[i].check_Child_State == -1) {
                //                                             $scope.data.currItem.readers.push(obj)
                //                                         }
                //                                     }
                //                                 }
                //                             } else {
                //                                 if ($modalScope.data.allSelectedNodes[i].check_Child_State == -1) {
                //                                     $scope.data.currItem.readers.push(obj)
                //                                 }
                //                             }
                //                         }
                //                         $modalScope.$close($modalScope.data);
                //                     }
                //                 };

                //             }]
                //         })
                //             .result
                //             .then(function (result) {
                //                 /*   $scope.data.currItem.css_fix_org_apply_ser_areas = $scope.areadeal(2, result);
                //                   $scope.gridOptions_serviceArea.hcApi.setRowData($scope.data.currItem.css_fix_org_apply_ser_areas);
                //                   console.log("result " + result); */
                //             })
                //     });


                // };

                /**
                 * 选择岗位
                 */
                $scope.searchWorksDept = function () {
                    $modal
                        .openCommonSearch({
                            classId: 'scpposition',
                            checkbox: true,
                            postData: {
                                entid: userbean.entid
                            }
                        })
                        .result
                        .then(function (roles) {
                            roles.forEach(function (item) {
                                var obj = {
                                    type: 4,
                                    name: item.positionid + "（岗位）",
                                    id: item.syspositionid
                                };
                                //防止重复添加
                                if ($scope.data.currItem.readers.every((item) => {
                                    return item.name != obj.name
                                })) {
                                    $scope.data.currItem.readers.push(obj)
                                }
                            });
                        })
                };

                /**
                 * 查询角色
                 */
                $scope.searchRole = function () {
                    $modal
                        .openCommonSearch({
                            classId: 'scprole',
                            checkbox: true,
                            postData: {
                                entid: userbean.entid
                            }
                        })
                        .result
                        .then(function (roles) {
                            roles.forEach(function (item) {
                                var obj = {
                                    type: 3,
                                    name: item.rolename + "（角色）",
                                    id: item.sysroleid
                                };
                                //防止重复添加
                                if ($scope.data.currItem.readers.every((item) => {
                                    return item.name != obj.name
                                })) {
                                    $scope.data.currItem.readers.push(obj)
                                }
                            });
                        })

                };


                $scope.commonSearchSetting = {
                    //部门 
                    // dept: {
                    //     afterOk: function (response) {
                    //         $scope.data.currItem.publish_dept = response.dept_name;
                    //         $scope.data.currItem.dept=response.dept_id;  
                    //     }
                    // },
                    //用户
                    scpuser: {
                        searchWhenReady: true,
                        afterOk: function (response) {
                            $scope.data.currItem.publisher = response.username;
                            $scope.data.currItem.publish_dept = response.orgname;
                        }
                    },
                    //知识库类型
                    news_type: {
                        sqlWhere: ' news_type_level = 2 ',
                        afterOk: function (response) {
                            $scope.data.currItem.news_type_id = response.news_type_id;
                            $scope.data.currItem.news_type_name = response.news_type_name;
                        }
                    }
                };

                //可阅读部门
                $scope.chooseDept = function () {
                    $modal.openCommonSearch({
                        classId: 'dept',
                        checkbox: true
                    })
                        .result
                        .then(function (response) {
                            console.log(response)
                            response.map((item) => {
                                var obj = {
                                    type: 2,
                                    id: item.dept_id,
                                    name: item.dept_name
                                };
                                //防止重复添加
                                if ($scope.data.currItem.readers.every((item) => {
                                    return item.name != obj.name
                                })) {
                                    $scope.data.currItem.readers.push(obj)
                                }
                            });
                        });
                };

                //可阅读人员
                $scope.chooseUser = function () {

                    $modal.openCommonSearch({
                        
                        postData: {
                            search_flag : 1
                        },
                        searchWhenReady: true,
                        checkbox: true,
                        keys:['userid','username','short_name','customer_code','customer_code','address', 'area_full_name'],
                        title: "用户",
                        classId: 'scpuser',
                        gridOptions: {
                            columnDefs: [{
                                type: '序号'
                            },
                            {
                                field: 'username',
                                headerName: '名称'
                            },
                            {
                                field: 'userid',
                                headerName: '账号'
                            },
                            {
                                field: 'orgname',
                                headerName: '所属部门'
                            },
                            {
                                field: 'short_name',
                                headerName: '客户简称'
                            },
                            {
                                field: 'customer_code',
                                headerName: '客户编码'
                            },
                            { 
                                field: 'customer_name',
                                headerName: '客户名称'
                            },
                            {
                                field: 'address',
                                headerName: '客户地址'
                            },
                            {
                                field: 'area_full_name',
                                headerName: '地址'
                            }, {
                                field: 'dept',
                                headerName: '所属机构'
                            },
                            ]
                        }
                    }).result
                        .then(function (response) {
                            console.log(response)
                            response.map((item) => {
                                var obj = {
                                    type: 1,
                                    name: item.username + "（人员）",
                                    id: item.sysuserid
                                };
                                //防止重复添加
                                if ($scope.data.currItem.readers.every((item) => {
                                    return item.name != obj.name
                                })) {
                                    $scope.data.currItem.readers.push(obj)
                                }
                            })
                                ;
                        });
                }

                //保存前验证
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    //验证长度
                    if ($scope.data.currItem.tags) {
                        $scope.checkStrLength($scope.data.currItem.tags, 2000, '标签', invalidBox);
                    }
                    $scope.checkStrLength($scope.data.currItem.subject, 2000, '主题', invalidBox);
                    $scope.checkStrLength($scope.data.currItem.summary, 2000, '摘要', invalidBox);

                    //验证富文本是否为空
                    if (!$scope.data.currItem.content) {
                        invalidBox.push('内容不能为空');
                    }

                    if (!$scope.data.currItem.pub_time) {
                        invalidBox.push('发布日期不能为空');
                    }

                    if (!$scope.data.currItem.expire_date) {
                        invalidBox.push('过期日期不能为空');
                    }

                    //比较发布日期与过期日期
                    if ($scope.data.currItem.pub_time && $scope.data.currItem.expire_date) {
                        var pub_time = new Date($scope.data.currItem.pub_time).getTime();
                        var expire_time = new Date($scope.data.currItem.expire_date).getTime();
                        var nowtime = new Date();
                        console.log(pub_time, expire_time)
                        if (expire_time <= pub_time) {
                            invalidBox.push('过期时间不能小于发布时间');
                        }
                        if (expire_time < nowtime) {
                            invalidBox.push('过期时间不能小于当前时间');
                        }
                    }

                };

                //复选框
                $scope.changedAttach = function () {
                    $scope.data.currItem.cannot_download_attach = 2;

                }
                $scope.changedDispatch = function () {
                    $scope.data.currItem.cannot_download_dispatch = 2;
                }
                $scope.changecShowProcess = function () {
                    $scope.data.currItem.cannot_show_process = 1;
                }
                $scope.changecRRecords = function () {
                    $scope.data.currItem.cannot_reading_records = 1;
                }
                $scope.changeuPeminders = function () {
                    $scope.data.currItem.no_unread_peminders = 2;
                }



                //发布按钮
                $scope.footerRightButtons.saveThenAdd.hide = true;

                /**
                 * 新增时数据、网格默认设置
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    /*                   $scope.footerRightButtons.publish.hide = true; */
                    angular.extend($scope.data.currItem, {
                        author: strUserName
                    });
                    //发布状态
                    /**
                     1    未发布
                     3    审批中
                     5    已发布
                     6    编辑中
                     7    到期下架
                     8    强制下架**/

                    // 附件数组初始化
                    $scope.data.currItem.scp_news_attachs = [];

                    // 默认数据设置
                    // $scope.data.currItem.news_type = $stateParams.newstype;
                    //默认通知公告
                    $scope.data.currItem.news_type = 2;
                    $scope.data.currItem.is_top = 1;
                    $scope.data.currItem.noticewf = 6;
                    //发布人
                    $scope.data.currItem.publisher = strUserId;
                    //通知类型
                    $scope.data.currItem.readers = [];


                    $scope.data.currItem.cannot_download_attach = 1;
                    $scope.data.currItem.cannot_download_dispatch = 1
                    $scope.data.currItem.cannot_show_process = 2;
                    $scope.data.currItem.cannot_reading_records = 2;
                    $scope.data.currItem.no_unread_peminders = 1;

                    //制单人
                    $scope.data.currItem.creator = strUserId;
                    //发布时间默认当前时间（改为：精确到日期）
                    $scope.data.currItem.pub_time = new Date().Format('yyyy-MM-dd');
                    $scope.data.currItem.pub_time_start = $scope.data.currItem.pub_time;

                    //制单部门
                    requestApi.post('scpuser', 'select', { "userid": strUserId })
                        .then(function (data) {
                            console.log(data)
                            for (var i = 0; i < data.orgofusers.length; i++) {
                                if (data.orgofusers[i].isdefault == 2) {
                                    $scope.data.currItem.dept_name = data.orgofusers[i].orgname;
                                    $scope.data.currItem.publish_dept = data.orgofusers[i].orgname;
                                    $scope.data.currItem.dept = data.orgofusers[i].orgid;
                                }
                            }
                        });

                    //监听滚动条
                    $scope.scrollwatch();
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    // 如果流程未启动，设置发布状态为编辑中
                    if ($scope.data.currItem.stat == 1) {
                        $scope.data.currItem.noticewf = 6;

                    }
                    //设置已阅读记录
                    $scope.gridOptions_readed.hcApi.setRowData(bizData.scp_readers);
                    //设置未阅读记录
                    $scope.gridOptions_notread.hcApi.setRowData(bizData.scp_noreaders);

                    // 时间只精确到日期
                    if (bizData.expire_date) {
                        bizData.expire_date = bizData.expire_date.substring(-1, 10);
                    }

                    if (bizData.pub_time) {
                        bizData.pub_time = bizData.pub_time.substring(-1, 10);
                    }

                    // 设置发布日期最早时间限制
                    $scope.data.currItem.pub_time_start = new Date().Format('yyyy-MM-dd');

                    $scope.data.currItem.readers = [];
                    $scope.data.currItem.attachofemails1 = [];
                    //if ($scope.data.currItem.scp_news_attachs) {
                    //    $scope.data.currItem.scp_news_attachs.map((item, i) => {
                    //        $scope.data.currItem.attachofemails1.push(item);
                    //    })
                    //        ;
                    //}
                    //图片id
                    if (bizData.title_img_id) {
                        //$scope.data.currItem.docid1=$scope.data.currItem.title_img_id
                        $(".invoice_div_img").css("height", "142px");
                        $scope.data.imgbool = true;
                    }
                    //拷贝可阅读者
                    if ($scope.data.currItem.scp_news_readerss) {
                        $scope.data.currItem.scp_news_readerss.map((item) => {
                            $scope.data.currItem.readers.push({
                                type: item.reader_type,
                                id: item.readerid,
                                name: item.readername,
                            });
                        });
                    }
                    //当状态为已发布时不能修改数据
                    if (bizData.stat > 1) {
                        $scope.data.bool = true;
                        $scope.data.imgbool = true;
                        //禁止富文本输入
                        $('#contents').summernote('disable');
                        $scope.data.noteOption.disable = true;
                        //隐藏图片删除按钮
                        if (bizData.title_img_id) {
                            $("button.invoice_del").addClass('none')
                        }
                        //隐藏附件删除按钮
                        if ($scope.data.currItem.scp_news_attachs) {
                            promiseApi.whenTrue(function () {
                                if ($('a.delete').length > 0) {
                                    return true
                                } else {
                                    return false
                                }
                            }, 200).then(function () {
                                $('a.delete').hide();
                            });
                        }
                        //隐藏发布按钮
                        /*   $scope.footerRightButtons.publish.hide = true; */
                        //隐藏保存按钮
                        //$scope.footerRightButtons.save.hide = true;

                    } else {
                        $scope.data.bool = false;
                        $scope.data.imgbool = false;
                        $scope.data.noteOption.disable = function () {
                            //  $scope.data.currItem.stat <=1 &&
                            return $scope.form.editing;
                        };
                        $scope.scrollwatch();
                    }


                }

                //保存数据
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    //保存正文内容
                    //保存附件id
                    //if ($scope.data.currItem.scp_news_attachs) {
                    //    bizData.scp_news_attachs = [];
                    //    $scope.data.currItem.scp_news_attachs.map((item) => {
                    //        bizData.scp_news_attachs.push({
                    //            newsid: $scope.data.currItem.newsid,
                    //            attachid: item.docid
                    //        });
                    //    });
                    //}

                    //添加可阅读者
                    if ($scope.data.currItem.readers && $scope.data.currItem.readers.length > 0) {
                        bizData.scp_news_readerss = [];
                        $scope.data.currItem.readers.map((item) => {
                            bizData.scp_news_readerss.push({
                                newsid: $scope.data.currItem.newsid,
                                reader_type: item.type,
                                readerid: item.id,
                                right_type: 1,
                                readername: item.name
                            });
                        })
                            ;
                    }
                    if ($scope.data.currItem.tags) {
                        //去除两端空格
                        var str = $scope.data.currItem.tags;
                        str = str.replace(/\s+/g, ' ');
                        bizData.tags = str;
                    }

                }
                /*$scope.doAfterSave = function (bizData) {
                   $scope.footerRightButtons.publish.hide = false;
                  
               } */

                /*---------------------控件相关设置--------------------------*/

                /**
                 *  发布日期限制
                 * @type {{disabledDate: (function(*)), shortcuts: undefined}}
                 */
                $scope.publicDateOption = {
                    disabledDate(time) {
                        var dateTime = new Date();
                        dateTime = dateTime.setDate(dateTime.getDate() - 1);
                        return dateTime > time.getTime();
                    },
                    shortcuts: undefined
                };

                /**
                 * 发布日期变更事件
                 */
                $scope.onPublicDateChanged = function () {

                };

                /*---------------------附件相关方法--------------------------*/
                /**
                 * 附件添加
                 */
                $scope.addAttach = function () {
                    return fileApi.uploadFile({
                        multiple: true,
                        accept: 'txt/doc/docx/xlsx/*'
                    }).then(function (docs) {
                        docs.forEach(function (value) {
                            var obj = {};
                            obj.docid = value.docid;
                            obj.docname = value.docname;
                            $scope.data.currItem.scp_news_attachs.push(obj);
                        })
                    });
                };

                /**
                 * 附件删除
                 */
                $scope.delAttach = function (idx) {
                    $scope.data.currItem.scp_news_attachs.splice(idx, 1);
                };

                /**
                 * 附件下载
                 * @param idx
                 */
                $scope.downloadAttach = function (idx) {
                    fileApi.downloadFile($scope.data.currItem.scp_news_attachs[idx]);
                };

                /**
                 * 附件打开
                 */
                $scope.open = function (doc) {
                    if (fileApi.isImage(doc)) {
                        openBizObj({
                            imageId: doc.docid,
                            images: $scope.data.currItem.scp_news_attachs
                        });
                    } else {
                        fileApi.openFile(doc);
                    }
                };

                /**
                 * 附件样式
                 * @param idx
                 * @returns {*}
                 */
                $scope.attachClass = function (idx) {
                    var doc = $scope.data.currItem.scp_news_attachs[idx];
                    var docname = doc.docname;
                    var suffix = $scope.getAttachSuffix(docname);

                    if (suffix == 'doc' || suffix == 'docx') {
                        return 'hc-word';
                    } else if (suffix == 'xls' || suffix == 'xlsx') {
                        return 'hc-excel';
                    } else if (suffix == 'ppt' || suffix == 'pptx') {
                        return 'hc-ppt';
                    } else if (suffix == 'mp4') {
                        return 'hc-file_classify_video';
                    } else {
                        return 'hc-file_classify_image';
                    }

                };

                /**
                 * 附件后缀获取
                 */
                $scope.getAttachSuffix = function (docname) {
                    var suffix = docname.substr(docname.lastIndexOf('.') + 1);
                    return suffix;
                };

                /**
                 * 是否图片格式(jpg,png,jpeg)
                 */
                $scope.isImage = function (docname) {
                    var picSuffix = ['jpg', 'png', 'jpeg'];
                    var suffix = docname.substr(docname.lastIndexOf('.') + 1);

                    if (picSuffix.indexOf(suffix) != -1) {
                        return true;
                    }

                    return false;
                };


            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);