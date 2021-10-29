/**
 * 公司文件
 */
define(
    ['module', 'angular', 'swalApi', '$q', 'requestApi', 'controllerApi', 'base/ctrl_bill_public', 'numberApi',
		'ztree.core', 'common', 'directive/hcGrid', 'plugins/dropzone/dropzone', 'directive/hcModal', 'services'
    ],
    function (module, angular, swalApi, $q, requestApi, controllerApi, ctrl_bill_public, numberApi) {
        'use strict';

        var compfilesController = [
            //声明angular依赖
            '$rootScope', '$scope', '$timeout', '$modal', '$state', 'BasemanService',
            function ($rootScope, $scope, $timeout, $modal, $state, BasemanService) {
                //继承
                controllerApi.extend({
                    controller: ctrl_bill_public.controller,
                    scope: $scope
                });

                //权限对照表
                //          十六进制	十进制	八进制	二进制
                //完全控制	0xFF	    255	    377	    1111,1111
                //完全控制	0x7F	    127	    177	    0111,1111
                //没有权限	0x00	    0	    0	    0000,0000
                //所有对象	0x80	    128	    200	    1000,0000
                //浏览权限	0x40	    64	    100	    0100,0000
                //读取权限	0x20	    32	    40	    0010,0000
                //修改权限	0x10	    16	    20	    0001,0000
                //新增权限	0x08	    8	    10	    0000,1000
                //删除权限	0x04	    4	    4	    0000,0100
                //目录列表	0x02	    2	    2	    0000,0010
                //输出权限	0x01	    1	    1	    0000,0001

                $scope.data = {
                    currItem: {},
                    //权限对象
                    rightObj: {
                        all: 0,//所有完全控制
                        view: 0,//浏览
                        read: 0,//读取
                        modify: 0,//修改
                        add: 0,//新增
                        delete: 0,//删除
                        dir: 0,//目录列表
                        export: 0,//输出
                        cantransfer: 1//能否转授2-客转授
                    }
                };
                //设置当前单据对象基本信息
                $scope.objconf = {
                    name: "myfiles",
                    key: "fileid",
                    parentid: "pid",
                    FrmInfo: {},
                    backdata: 'files',
                    grids: [{
                        optionname: 'options',
                        idname: 'files'
                    }],
                    z_trees: [{
                        optionname: 'treeDemo',
                        idname: 'tree_datas'
                    }]
                };

                //是否可用
                $scope.usables = [{
                    value: 1,
                    desc: '不可用'
                }, {
                    value: 2,
                    desc: '可用'
                }];
                //仓库属性
                $scope.warehouse_propertys = [];
                $scope.docids = [];
                $scope.file_types = [];
                $scope.pro = 0;

                function strToJson(data) {
                    return JSON.parse(data);
                }

                //初始化
                $scope.clearinformation = function () {
                    $scope.data.currItem[$scope.objconf.grids[0].idname] = [];
                    $scope.data.currItem.create_time = new Date();
                    $scope.data.currItem.creator = window.userbean.userid;
                    $scope.data.currItem.entid = window.userbean.entid;
                };
                $scope.eror = function (index) {
                    $scope.replace_file = $scope.file_list[index];
                    if ($scope.replace_file && parseInt($scope.replace_file.wfid) > 0) {
                        swalApi.info($scope.replace_file.docname + "文件正在走流程")
                        return true;
                    } else if ($scope.replace_file && parseInt($scope.replace_file.stat) == 8) {
                        swalApi.info($scope.replace_file.docname + "该文件正在归档")
                        return true;
                    }
                    return false;
                }


                /*===================================文件录入 start=================================*/
                $timeout(function () {
                    var tpl = $("<div id='preview-template' style='display: none;'><div></div></div>");
                    $("#my-awesome-dropzone").dropzone({
                        url: '/web/scp/filesuploadsave2.do',
                        maxFilesize: 500,
                        paramName: "docFile0",
                        fallback: function () {
                            swalApi.info("浏览器版本太低,文件上传功能将不可用！");
                        },
                        addRemoveLinks: true,
                        params: {
                            scpsession: window.strLoginGuid,
                            sessionid: window.strLoginGuid
                        },
                        previewTemplate: tpl.prop("outerHTML"),
                        maxThumbnailFilesize: 5,
                        //uploadMultiple:true,
                        init: function () {
                            this.on('addedfile', function (file) {
                                //var l=0;
                            })
                            this.on('success', function (file, json) {
                                try {
                                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                                    var node = $scope.zTree.getSelectedNodes()[0];
                                    var object = strToJson(json);
                                    requestApi.post({
                                            classId: 'scpfdrref',
                                            action: 'insert',
                                            data: {
                                                refid: object.data[0].docid,
                                                fdrid: node.fdrid,
                                                reftype: 6,
                                                wsid: -4,
                                                idpath: node.idpath
                                            }
                                        })
                                        .then(function (data) {
                                        })
                                    requestApi.post({
                                            classId: 'scpfdr',
                                            action: 'upwebscpdoc',
                                            data: {
                                                wsid: -4,
                                                idpath: node.idpath,
                                                typepath: node.typepath,
                                                docid: object.data[0].docid
                                            }
                                        })
                                        .then(function (data) {
                                        })
                                    $scope.selectfdr(node)
                                } catch (e) {
                                    swalApi.info("请选择文件夹");
                                    $(".desabled-window").css("display", "none");
                                    if ($('#pro')) {
                                        $('#pro').css({
                                            "visibility": "hidden"
                                        });
                                    }
                                }
                            })

                            this.on("queuecomplete", function (file) {
                                menuShowNode();
                                $(".desabled-window").css("display", "none");
                                if ($('#pro')) {
                                    $('#pro').css({
                                        "visibility": "hidden"
                                    });
                                }
                            });
                            this.on("totaluploadprogress", function (progress) {
                                $(".desabled-window").css("display", "flex");
                                if ($('#pro')) {
                                    $('#pro').css({
                                        "visibility": "visible"
                                    });
                                }


                                $scope.pro = progress;
                                $scope.$apply();
                            });
                            this.on("error", function () {
                                console.log("File upload error");
                                if ($('#pro')) {
                                    $('#pro').css({
                                        "visibility": "hidden"
                                    });
                                }
                                $(".desabled-window").css("display", "none");
                            })

                        }
                    });
                }, 300);
                /*===================================文件录入 end=================================*/


                /*===================================文件复制/移动 --不再使用 start=================================*/
                //文件复制到
                $scope.file_copy = function () {
                    //权限控制
                    $scope.file_list = [];
                    $scope.error_list = [];
                    for (var i = 0; i < $scope.gridGetSelectedData('options').length; i++) {
                        if ($scope.judge_copy($scope.gridGetSelectedData('options')[i])) {
                            $scope.file_list.push($scope.gridGetSelectedData('options')[i]);
                        } else {
                            $scope.error_list.push($scope.gridGetSelectedData('options')[i]);
                        }
                    }
                    BasemanService.openFrm("views/baseman/file_structure.html", file_structure, $scope, "", "").result.then(function (res) {
                        $scope.copy_file(0, res);
                    })
                }

                //文件移动到
                $scope.file_move = function () {
                    $scope.file_list = [];
                    $scope.error_list = [];
                    for (var i = 0; i < $scope.gridGetSelectedData('options').length; i++) {
                        if ($scope.judge_copy($scope.gridGetSelectedData('options')[i])) {
                            $scope.file_list.push($scope.gridGetSelectedData('options')[i]);
                        } else {
                            $scope.error_list.push($scope.gridGetSelectedData('options')[i]);
                        }
                    }
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    var node = zTree.getSelectedNodes()[0];
                    $scope.file_list.is_cut = true;
                    $scope.file_list.fdrid = node.fdrid;

                    BasemanService.openFrm("views/baseman/file_structure.html", file_structure, $scope, "", "").result.then(function (res) {
                        $scope.cut_file(0, res);
                    })
                }

                //复制/移动 控制器
                var file_structure = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
                    //继承
                    controllerApi.extend({
                        controller: ctrl_bill_public.controller,
                        scope: $scope
                    });
                    //file_structure = HczyCommon.extend(file_structure, ctrl_bill_public);
                    //file_structure.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
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
                            simpleData: {
                                enable: true
                            }
                        },
                        callback: {
                            //beforeExpand: beforeExpand
                        }
                    };

                    function beforeExpand(treeId, treeNode) {
                        if (treeNode.children) {
                            return;
                        }
                    }

                    function filter(treeId, parentNode, childNodes) {
                        if (parentNode && parentNode.children) {
                            return '';
                        }
                        var postdata = parentNode;
                        var init_data = BasemanService.RequestPostSync('scpfdr', "selectref", postdata);

                        var children = init_data.fdrs;
                        if (children) {
                            parentNode.children = [];
                            for (var i = 0; i < children.length; i++) {
                                children[i].isParent = true;
                                children[i].name = children[i].fdrname
                                children[i].pId = parseInt(parentNode.id);
                                children[i].id = parseInt(children[i].fdrid)
                                children[i].item_type = 1;
                            }
                            //$scope.options.api.setRowData(children);
                        }
                        return children
                    }

                    $scope.clearinformation = function () {
                        $timeout(function () {
                            $scope.zTree = $.fn.zTree.init($("#treeDemo_frm"), setting, $scope.$parent.tree_data)
                        });
                    }

                    $scope.ok = function () {
                        if ($scope.validate()) {
                            var node = $scope.zTree.getSelectedNodes();
                            $modalInstance.close(node[0]);
                        }
                    }

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    }
                    $scope.validate = function () {
                        var node = $scope.zTree.getSelectedNodes();
                        if (node == '' || node == undefined) {
                            swalApi.info('请选中一行');
                            return false;
                        }
                        if (node[0].id == 0 || node[0].wsid) {
                            swalApi.info('最上级无法加文件');
                            return false;
                        }
                        return true;
                    }
                    //$scope.initdata();
                }
                /*===================================文件复制/移动 end=================================*/

                $scope.share = function (flag) {
                    if (flag == 3) {
                        $scope.choose_grid = true;
                    } else {
                        hideRMenu();
                        $scope.choose_grid = false;
                    }
                    BasemanService.openFrm("views/baseman/share.html", shareController, $scope, "", "").result.then(function (data) {
                        //转换权限为10进制
                        if (data && data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                data[i].objaccess = numberApi.bintoint(data[i].objaccess);
                                if (!data[i].idpath || !data[i].typepath) {
                                    data[i].idpath = data.idpath;
                                    data[i].typepath = data.typepath;
                                }
                            }
                        }
                        if (flag == 3) {
                            //上级人员取出
                            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                            var node = $scope.zTree.getSelectedNodes()[0];
                            BasemanService.RequestPost('scpobjright', 'select', {
                                    idpath: node.idpath,
                                    typepath: node.typepath
                                })
                                .then(function (res) {
                                    var node = $scope.zTree.getSelectedNodes()[0];
                                    for (var i = 0; i < res.objrights.length; i++) {
                                        res.objrights[i].accesstype = 2;
                                        res.objrights[i].accesspath = node.name;
                                    }
                                    for (var i = 0; i < data.length; i++) {
                                        data[i].accesstype = 1;
                                    }
                                    data = data.concat(res.objrights);
                                    var node = $scope.gridGetRow('options');
                                    BasemanService.RequestPost('scpobjright', 'update', {
                                            objrights: data,
                                            typepath: node.typepath,
                                            idpath: node.idpath
                                        })
                                        .then(function (data) {
                                            swalApi.success('操作成功');
                                        })
                                })
                        } else {
                            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                            var node = $scope.zTree.getSelectedNodes()[0];
                            BasemanService.RequestPost('scpobjright', 'update', {
                                    objrights: data,
                                    typepath: node.typepath,
                                    idpath: node.idpath
                                })
                                .then(function (data) {
                                    swalApi.success('操作成功');
                                })
                        }
                    })
                };

                //权限控制器
                var shareController = function ($scope, notify, $modal, $state, $timeout, BasemanService, localeStorageService, $rootScope, $modalInstance, $parent) {
                    $scope.$parent = $parent;
                    $scope.data = {UserIsManager: false};
                    $scope.objconf = {
                        name: "myfiles",
                        key: "fileid",
                        FrmInfo: {},
                        grids: [{
                            optionname: 'options_acl',
                            idname: 'files'
                        }]
                    };

                    controllerApi.extend({
                        controller: ctrl_bill_public.controller,
                        scope: $scope
                    });


                    /*==================复制share_detail里出来的东西 start===============*/
                    $scope.objconf = {
                        name: "myfiles",
                        key: "fileid",
                        FrmInfo: {},
                        grids: []
                    };

                    $scope.search_orgname = function () {
                        $scope.FrmInfo = {
                            classid: "scporg",
                            backdatas: "orgs",
                            sqlBlock: "stat=2 and orgtype=5"
                        };

                        BasemanService.open(CommonPopController, $scope).result.then(function (data) {
                            $scope.data.currItem.orgid = data.orgid;
                            $scope.data.currItem.orgname = data.orgname;
                        });
                    };

                    Date.prototype.Format = function (fmt) { //author: meizz
                        var o = {
                            "M+": this.getMonth() + 1, //月份
                            "d+": this.getDate(), //日
                            "h+": this.getHours(), //小时
                            "m+": this.getMinutes(), //分
                            "s+": this.getSeconds(), //秒
                            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                            "S": this.getMilliseconds() //毫秒
                        };
                        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                        for (var k in o)
                            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                        return fmt;
                    }

                    //添加按钮
                    $scope.add = function () {
                        $scope.flag = 2;
                        //权限添加机构和用户
                        BasemanService.openFrm("views/baseman/share_add.html", share_addController, $scope, "", "").result.then(function (data) {
                            var acl_data = $scope.gridGetData('options_acl');
                            //添加用户
                            for (var i = 0; i < data.sj_people.length; i++) {
                                data.sj_people[i].receivername = data.sj_people[i].username;
                                data.sj_people[i].receiverid = data.sj_people[i].userid;
                                data.sj_people[i].myright = 1;
                                data.sj_people[i].read = 1;
                                data.sj_people[i].new = 0;
                                data.sj_people[i].modify = 0;
                                data.sj_people[i].delete = 0;
                                data.sj_people[i].export = 0;
                                data.sj_people[i].denied = 0;
                                data.sj_people[i].cantransfer = 1;
                                if ($scope.$parent.choose_grid == true) {
                                    data.sj_people[i].accesstype = 1;
                                } else {
                                    data.sj_people[i].accesstype = 1;
                                }
                                //默认有目录，读取权限 并转成二进制
                                data.sj_people[i].objaccess = numberApi.inttobin(98);
                                data.sj_people[i].ismanager = 1;
                                data.sj_people[i].flag = 2;
                                var myDate = new Date();
                                data.sj_people[i].statime = new Date().Format("yyyy-MM-dd");
                                data.sj_people[i].endtime = '9999-12-31';
                                data.sj_people[i].grantor = window.userbean.userid;
                                for (var j = 0; j < acl_data.length; j++) {
                                    if (acl_data[j].receiverid == data.sj_people[i].receiverid) {
                                        break;
                                    }
                                }
                                if (j == acl_data.length) {
                                    acl_data.push(data.sj_people[i]);
                                }
                            }
                            //添加机构
                            for (var i = 0; i < data.cs_people.length; i++) {
                                data.cs_people[i].receivername = data.cs_people[i].orgname;
                                data.cs_people[i].receiverid = data.cs_people[i].orgid;
                                data.cs_people[i].myright = 1;
                                data.cs_people[i].read = 1;
                                data.cs_people[i].new = 0;
                                data.cs_people[i].modify = 0;
                                data.cs_people[i].delete = 0;
                                data.cs_people[i].export = 0;
                                data.cs_people[i].denied = 0;
                                data.cs_people[i].cantransfer = 1;
                                data.cs_people[i].flag = 1;
                                data.cs_people[i].ismanager = 1;
                                if ($scope.$parent.choose_grid == true) {
                                    data.cs_people[i].accesstype = 1;
                                } else {
                                    data.cs_people[i].accesstype = 1;
                                }
                                //默认为读取、浏览权限
                                data.cs_people[i].objaccess = numberApi.inttobin(98);
                                var myDate = new Date();
                                data.cs_people[i].statime = new Date().Format("yyyy-MM-dd");
                                data.cs_people[i].endtime = '9999-12-31';
                                data.cs_people[i].grantor = window.userbean.userid
                                for (var j = 0; j < acl_data.length; j++) {
                                    if (acl_data[j].receiverid == data.cs_people[i].receiverid) {
                                        break;
                                    }
                                }
                                if (j == acl_data.length) {
                                    acl_data.push(data.cs_people[i]);
                                }
                            }
                            $scope.options_acl.api.setRowData(acl_data);
                        })
                    }

                    $scope.del = function () {
                        $scope.gridDelItem('options_acl');
                    }
                    //双击修改机构和用户的权限
                    $scope.rowDoubleClick_az = function (e) {
                        $scope.flag = 1;
                        e.data.UserIsManager = $scope.data.UserIsManager;
                        $scope.data = e.data;
                        BasemanService.openFrm("views/baseman/share_detail.html", share_detailController, $scope, "", "").result.then(function (res) {
                            for (name in res) {
                                $scope.data[name] = res[name];
                            }
                            var objaccess = '' + parseInt($scope.data.all || 0) + parseInt($scope.data.view || 0) + parseInt($scope.data.read || 0) + parseInt($scope.data.modify || 0) + parseInt($scope.data.add || 0) + parseInt($scope.data.delete || 0) + parseInt($scope.data.dir || 0) + parseInt($scope.data.export || 0);
                            $scope.data.objaccess = objaccess;//numberApi.bintoint(objaccess);
                            $scope.options_acl.api.refreshView();
                        })
                    }
                    //权限列表
                    $scope.options_acl = {
                        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
                        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
                        groupKeys: undefined,
                        groupHideGroupColumns: false,
                        enableColResize: true, //one of [true, false]
                        enableSorting: true, //one of [true, false]
                        enableFilter: true, //one of [true, false]
                        enableStatusBar: false,
                        enableRangeSelection: false,
                        rowSelection: "single", // one of ['single','multiple'], leave blank for no selection
                        rowDeselection: false,
                        quickFilterText: null,
                        hcEvents: {rowDoubleClicked: $scope.rowDoubleClick_az},
                        // selectAll:true,
                        groupSelectsChildren: false, // one of [true, false]
                        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
                        showToolPanel: false,
                        icons: {
                            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                            filter: '<i class="fa fa-filter"/>',
                            sortAscending: '<i class="fa fa-long-arrow-down"/>',
                            sortDescending: '<i class="fa fa-long-arrow-up"/>',
                        },
                        columnDefs: [{
                            headerName: "用户/机构",
                            field: "receivername",
                            width: 140,
                            cellEditor: "弹出框",
                            action: $scope.username,
                            editable: false

                        }, {
                            headerName: "权限",
                            field: "myright",
                            width: 80,
                            type: "词汇",
                            cellEditorParams: {
                                names: ["部分", "完全", "拒绝"],
                                values: [1, 2, 3]
                            },
                            editable: false
                        }, {
                            headerName: "目录",
                            field: "dir",
                            width: 80,
                            type: "词汇",
                            cellEditorParams: {
                                names: ["√"],
                                values: [1]
                            },
                            editable: false
                        }, {
                            headerName: "浏览",
                            field: "view",
                            width: 80,
                            type: "词汇",
                            cellEditorParams: {
                                names: ["√"],
                                values: [1]
                            },
                            editable: false
                        }, {
                            headerName: "只读",
                            field: "read",
                            width: 80,
                            type: "词汇",
                            cellEditorParams: {
                                names: ["√"],
                                values: [1]
                            },
                            editable: false
                        }, {
                            headerName: "新增",
                            field: "add",
                            width: 80,
                            type: "词汇",
                            cellEditorParams: {
                                names: ["√"],
                                values: [1]
                            },
                            editable: false
                        }, {
                            headerName: "修改",
                            field: "modify",
                            width: 80,
                            type: "词汇",
                            cellEditorParams: {
                                names: ["√"],
                                values: [1]
                            },
                            editable: false
                        }, {
                            headerName: "删除",
                            field: "delete",
                            width: 80,
                            type: "词汇",
                            cellEditorParams: {
                                names: ["√"],
                                values: [1]
                            },
                            editable: false
                        }, {
                            headerName: "输出",
                            field: "export",
                            width: 80,
                            type: "词汇",
                            cellEditorParams: {
                                names: ["√"],
                                values: [1]
                            },
                            editable: false
                        }, {
                            headerName: "拒绝访问",
                            field: "denied",
                            width: 100,
                            type: "词汇",
                            cellEditorParams: {
                                names: ["√"],
                                values: [1]
                            },
                            editable: false
                        }, {
                            headerName: "可转授",
                            field: "cantransfer",
                            width: 100,
                            type: "词汇",
                            cellEditorParams: {
                                names: ["√"],
                                values: [2]
                            },
                            editable: false
                        }, {
                            headerName: "授权者",
                            field: "grantor",
                            width: 80,
                            cellEditor: "文本框",
                            editable: false

                        }, {
                            headerName: "生效日期",
                            field: "statime",
                            width: 120,
                            cellEditor: "文本框",
                            editable: false
                        }, {
                            headerName: "失效日期",
                            field: "endtime",
                            width: 120,
                            cellEditor: "文本框",
                            editable: false
                        }]
                    };

                    $scope.invorgids = [{
                        id: "0",
                        name: "<无>"
                    }];

                    /**
                     * 检查用户是否为管理员
                     * @param data
                     */
                    $scope.checkUserIsManager = function (rightDatas) {
                        $scope.data.UserIsManager = false;
                        if (window.userbean.isAdmins) {
                            $scope.data.UserIsManager = true;
                        }
                        else if (rightDatas && rightDatas.length > 0) {
                            for (var i = 0; i < rightDatas.length; i++) {
                                if (rightDatas[i].ismanager == '2' && rightDatas[i].receiverid == window.userbean.userid) {
                                    $scope.data.UserIsManager = true;
                                    break;
                                }
                            }
                        }
                    }

                    $scope.clearinformation = function () {
                        if ($scope.$parent.choose_grid == true) {
                            var node = $scope.$parent.gridGetRow('options');
                        } else {
                            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                            var node = zTree.getSelectedNodes()[0];
                        }
                        BasemanService.RequestPost('scpobjright', 'select', {
                                idpath: node.idpath,
                                typepath: node.typepath
                            })
                            .then(function (data) {
                                //初始化管理权限
                                $scope.checkUserIsManager(data.objrights);
                                data.objrights = $scope.merge_right(data.objrights);
                                for (var i = 0; i < data.objrights.length; i++) {
                                    if (data.objrights[i].objaccess == '' && data.objrights[i].objaccess_fdr == '') {
                                        data.objrights[i].myright = 3;
                                    } else if (numberApi.toNumber(data.objrights[i].objaccess) > 126 || (data.objrights[i].cantransfer == '2' && data.objrights[i].receiverid == window.userbean.userid)) {
                                        data.objrights[i].myright = 2;
                                        data.objrights[i].all = 1;
                                        data.objrights[i].view = 1;
                                        data.objrights[i].read = 1;
                                        data.objrights[i].modify = 1;
                                        data.objrights[i].add = 1;
                                        data.objrights[i].delete = 1;
                                        data.objrights[i].dir = 1;
                                        data.objrights[i].export = 1;

                                    } else {
                                        data.objrights[i].myright = 1;
                                        var l = data.objrights[i].objaccess.length;

                                        var objaccess = '00000000';
                                        if (data.objrights[i].objaccess) {
                                            objaccess = numberApi.inttobin(data.objrights[i].objaccess, 8);
                                        }

                                        var objaccess_fdr = '00000000';
                                        if (data.objrights[i].objaccess_fdr) {
                                            objaccess_fdr = numberApi.inttobin(data.objrights[i].objaccess_fdr, 8);
                                        }

                                        for (var j = 0; j < objaccess.length; j++) {
                                            var value_file = parseInt(objaccess.substr(j, 1) || 1);
                                            var value_fdr = 0;
                                            var value = 0;
                                            if (data.objrights[i].objaccess_fdr) {
                                                value_fdr = parseInt(objaccess_fdr.substr(j, 1) || 0);
                                            }
                                            if (value_file == 1 || value_fdr == 1) {
                                                value = 1;
                                            }

                                            if (j == 0) {
                                                data.objrights[i].all = value;
                                            }
                                            else if (j == 1) {
                                                data.objrights[i].view = value;
                                            }
                                            else if (j == 2) {
                                                data.objrights[i].read = value;
                                            }
                                            else if (j == 3) {
                                                data.objrights[i].modify = value;
                                            }
                                            else if (j == 4) {
                                                data.objrights[i].add = value;
                                            }
                                            else if (j == 5) {
                                                data.objrights[i].delete = value;
                                            }
                                            else if (j == 6) {
                                                data.objrights[i].dir = value;
                                            }
                                            else if (j == 7) {
                                                data.objrights[i].export = value;
                                            }
                                        }
                                    }
                                    //把对象中的数据转为二进制格式
                                    data.objrights[i].objaccess = numberApi.inttobin(data.objrights[i].objaccess, 8);
                                }
                                $scope.options_acl.api.setRowData(data.objrights);
                            })
                    }
                    $scope.clearinformation();

                    $scope.merge_right = function (objrights) {
                        var data = [];
                        //accesstype 1定义 2继承 3经过
                        for (var i = 0; i < objrights.length; i++) {
                            if (parseInt(objrights[i].accesstype) == 1) {
                                data.push(objrights[i]);
                            }
                        }
                        for (var i = 0; i < objrights.length; i++) {
                            for (var j = 0; j < data.length; j++) {
                                if (data[j].receiverid == objrights[i].receiverid) {
                                    data[j].objaccess_fdr = objrights[i].objaccess;
                                    break;
                                }
                            }
                            if (j == data.length) {
                                data.push(objrights[i]);
                            }
                        }
                        return data;
                    }

                    $scope.rightsok = function () {
                        if ($scope.validate()) {
                            var data = $scope.gridGetData('options_acl');
                            $modalInstance.close(data);
                        }
                    }

                    $scope.rightscancel = function () {
                        $modalInstance.dismiss('cancel');
                    }
                    $scope.validate = function () {
                        var msg = []
                        // if ($scope.data.currItem.filename == undefined || $scope.data.currItem.filenames == "") {
                        // msg.push("名称不能为空");
                        //   }

                        if (msg.length > 0) {
                            BasemanService.notice(msg);
                            return false;
                        }
                        return true;

                    }

                    $scope.initdata();

                    /*==================复制share_detail里的东西出来 end===============*/

                    /**
                     * 添加机构和用户 控制器
                     */
                    var share_addController = function ($scope, notify, $state, $timeout, BasemanService, localeStorageService, $rootScope, $modalInstance, $parent) {
                        $scope.$parent = $parent;
                        $scope.data.currItem = {};
                        var TimeFn = null;
                        //用户
                        $scope.data.currItem.sj_people = [];
                        //添加用户
                        $scope.add_sj = function () {
                            if ($scope.data.is_search == 2) {
                                var object = $scope.data.currItem.scporgs[$scope.index];
                                for (var i = 0; i < $scope.data.currItem.sj_people.length; i++) {
                                    if (object.userid == $scope.data.currItem.sj_people[i].userid) {
                                        swalApi.info("选择人员重复");
                                        return;
                                    }
                                }
                            } else {
                                var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
                                var node = zTree.getSelectedNodes()[0];

                                if (node == undefined || node.isParent == true) {
                                    swalApi.info("请选择人员");
                                    return;
                                }
                                var object = {};
                                object.username = node.name;
                                object.userid = (node.userid);
                                for (var i = 0; i < $scope.data.currItem.sj_people.length; i++) {
                                    if (object.userid == $scope.data.currItem.sj_people[i].userid) {
                                        swalApi.info("选择人员重复");
                                        return;
                                    }
                                }
                            }
                            $scope.data.currItem.sj_people.push(object);
                        };

                        //查询联系人
                        $scope.search_peopele = function (flag) {
                            $scope.data.is_search = 2;
                            if ($scope.data.username == '' || $scope.data.username == undefined) {
                                $scope.data.is_search = 1;
                                return;
                            }

                            /*BasemanService.RequestPost("scpemail_contact_list", "search", {
                             username: $scope.data.username,
                             flag: 3,
                             emailtype: 3
                             })*/
                            requestApi.post({
                                    classId: 'scpemail_contact_list',
                                    action: 'search',
                                    data: {
                                        username: $scope.data.username,
                                        flag: 3,
                                        emailtype: 3
                                    }
                                })
                                .then(function (data) {
                                    $scope.data.currItem.scporgs = data.scporgs;
                                })
                        };

                        //删除查询条件
                        $scope.close_people = function () {
                            if ($scope.data.is_search == 2) {
                                $scope.data.is_search = 1;
                                $scope.data.username = '';
                            }
                        };

                        $scope.contact_people = function (e, index) {
                            $scope.index = index;
                            $(e.delegateTarget).siblings().removeClass("high");
                            $(e.delegateTarget).addClass('high');

                            $scope.add_sj();
                        };
                        //点击当前用户加光标
                        $scope.click_sj = function (e, index) {
                            $scope.sj_index = index;
                            $(e.delegateTarget).siblings().removeClass("high");
                            $(e.delegateTarget).addClass('high');
                        };
                        //删除用户
                        $scope.del_sj = function () {
                            $scope.data.currItem.sj_people.splice($scope.sj_index, 1);
                        };

                        //机构
                        $scope.data.currItem.cs_people = [];
                        //添加机构
                        $scope.add_cs = function () {
                            var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
                            var node = zTree.getSelectedNodes()[0];

                            if (node == undefined || node.isParent != true) {
                                swalApi.info("请选择机构");
                                return;
                            }
                            var object = {};
                            object.orgname = node.name;
                            object.orgid = parseInt(node.id);
                            for (var i = 0; i < $scope.data.currItem.cs_people.length; i++) {
                                if (object.orgid == $scope.data.currItem.cs_people[i].orgid) {
                                    swalApi.info("选择机构重复");
                                    return;
                                }
                            }
                            ;
                            $scope.data.currItem.cs_people.push(object);
                        };
                        //点击当前机构加光标
                        $scope.click_cs = function (e, index) {
                            $scope.cs_index = index;
                            $(e.delegateTarget).siblings().removeClass("high");
                            $(e.delegateTarget).addClass('high');
                        };
                        //删除机构
                        $scope.del_cs = function () {
                            $scope.data.currItem.cs_people.splice($scope.cs_index, 1);
                        };

                        function showIconForTree(treeId, treeNode) {
                            return !treeNode.isParent;
                        };
                        BasemanService.RequestPost("scpemail_contact_list", "search", {
                                emailtype: 3
                            })
                            .then(function (data) {
                                for (var i = 0; i < data.scporgs.length; i++) {
                                    data.scporgs[i].id = parseInt(data.scporgs[i].id);
                                    data.scporgs[i].pId = parseInt(data.scporgs[i].pid);
                                    if (data.scporgs[i].username) {
                                        data.scporgs[i].orgname = data.scporgs[i].name;
                                        data.scporgs[i].name = data.scporgs[i].username
                                    } else {
                                        data.scporgs[i].isParent = true;
                                    }
                                }
                                $scope.data.scporgs = data.scporgs;
                                var tree = ($("#treeDemo4").length == 0 ? $('#treeDemo4', parent.document) : $("#treeDemo4"));
                                $.fn.zTree.init(tree, setting4, $scope.data.scporgs);
                            });
                        //树状结构定义
                        var setting4 = {
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
                                beforeExpand: beforeExpand,
                                //onRightClick : OnRightClick,//右键事件
                                onClick: onClick_p
                            }
                        };

                        function beforeExpand() {
                            //双击时取消单机事件
                            if (TimeFn) {
                                clearTimeout(TimeFn);
                            }
                        };

                        function onClick_p(event, treeId, treeNode) {

                            clearTimeout(TimeFn);
                            //执行延时
                            TimeFn = setTimeout(function () {
                                if (treeNode.userid) {
                                    $scope.add_sj();
                                } else {
                                    $scope.add_cs();
                                }
                                $scope.$apply();
                            }, 300)
                        };

                        //这个是异步
                        function filter(treeId, parentNode, childNodes) {
                            var treeNode = parentNode;
                            if (treeNode && treeNode.children) {
                                return;
                            }
                            ;
                            var postdata = null;
                            if (treeNode) {
                                postdata = treeNode
                            } else {
                                postdata = {};
                            }
                            ;
                            postdata.flag = 1;
                            postdata.emailtype = 3;
                            postdata.orgid = parseInt(postdata.id);
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
                        };

                        $scope.cancel = function (e) {
                            $modalInstance.dismiss('cancel');
                        };

                        $scope.ok = function (e) {
                            $modalInstance.close($scope.data.currItem);
                        }

                    }
                }
                /*===================================权限 end=================================*/

                /**
                 * 文件权限设置控制器
                 */
                var share_detailController = function ($scope, notify, $modal, $state, $timeout, BasemanService, $rootScope, $modalInstance, $parent) {
                    $scope.$parent = $parent;
                    //继承
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

                    $scope.search_orgname = function () {
                        $scope.FrmInfo = {
                            classid: "scporg",
                            backdatas: "orgs",
                            sqlBlock: "stat=2 and orgtype=5"
                        };
                        BasemanService.open(CommonPopController, $scope).result.then(function (data) {
                            $scope.data.currItem.orgid = data.orgid;
                            $scope.data.currItem.orgname = data.orgname;
                        });
                    };
                    $scope.clearinformation = function () {
                        $scope.data = {bReadOnly: true};
                        $scope.data.currItem = {};
                        if ($scope.$parent.flag == 1) {
                            //复制父控制器的数据到当前控制器对象
                            for (name in $scope.$parent.data) {
                                $scope.data.currItem[name] = $scope.$parent.data[name];
                                if ($scope.$parent.data.targettype == 1) {
                                    $scope.data.currItem.orgname = $scope.$parent.data.receivername;
                                } else {
                                    $scope.data.currItem.username = $scope.$parent.data.receivername;
                                }
                            }
                        } else {
                            $scope.data.currItem = {};
                            $scope.data.currItem.myright = 1;
                            $scope.data.currItem.myright = 1;
                            $scope.data.currItem.read = 1;
                            var date = new Date();
                            $scope.data.currItem.statime = date;
                            $scope.data.currItem.endtime = '9999-12-31';
                        }
                        //初始化权限 !$scope.data.currItem.UserIsManager
                        $scope.data.bReadOnly = $scope.data.currItem.accesstype != 1 || $scope.data.currItem.cantransfer != 2;

                        console.log('share_detail:', $scope.data.currItem);
                    }

                    $scope.del_orgname = function () {
                        $scope.data.currItem.orgid = 0;
                        $scope.data.currItem.orgname = "";
                    };
                    $scope.search_user = function () {
                        $scope.FrmInfo = {
                            classid: "scpuser",
                            backdatas: "scpusers",
                            sqlBlock: "1=1 "
                        };

                        BasemanService.open(CommonPopController, $scope).result.then(function (data) {
                            $scope.data.currItem.sysuserid = data.sysuserid;
                            $scope.data.currItem.username = data.username;

                        });
                    }
                    $scope.clearuser = function () {
                        $scope.data.currItem.sysuserid = 0;
                        $scope.data.currItem.username = "";

                    };
                    $scope.myright = function () {
                        //部分权限
                        if ($scope.data.currItem.myright == 1) {
                            $scope.data.currItem.all = 0;
                            $scope.data.currItem.view = 1;
                            $scope.data.currItem.read = 1;
                            $scope.data.currItem.modify = 0;
                            $scope.data.currItem.add = 0;
                            $scope.data.currItem.delete = 0;
                            $scope.data.currItem.dir = 1;
                            $scope.data.currItem.export = 0;
                            //$scope.data.currItem.cantransfer = 0;
                        }  //完全权限
                        else if ($scope.data.currItem.myright == 2) {
                            $scope.data.currItem.all = 1;
                            $scope.data.currItem.view = 1;
                            $scope.data.currItem.read = 1;
                            $scope.data.currItem.modify = 1;
                            $scope.data.currItem.add = 1;
                            $scope.data.currItem.delete = 1;
                            $scope.data.currItem.dir = 1;
                            $scope.data.currItem.export = 1;
                           // $scope.data.currItem.cantransfer = 2;

                        }//拒绝
                        else {
                            $scope.data.currItem.all = 0;
                            $scope.data.currItem.view = 0;
                            $scope.data.currItem.read = 0;
                            $scope.data.currItem.modify = 0;
                            $scope.data.currItem.add = 0;
                            $scope.data.currItem.delete = 0;
                            $scope.data.currItem.dir = 0;
                            $scope.data.currItem.export = 0;
                            //$scope.data.currItem.cantransfer = 0;
                        }
                    };
                    $scope.rightsdetailok = function () {
                        if ($scope.validate()) {
                            $modalInstance.close($scope.data.currItem);
                        }
                    };

                    $scope.rightsdetailcancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    $scope.validate = function () {
                        var msg = []
                        if (($scope.data.currItem.username == undefined || $scope.data.currItem.username == "") && ($scope.data.currItem.orgname == undefined || $scope.data.currItem.orgname == "")) {
                            msg.push("用户和机构不能同时为空");
                        }

                        if (($scope.data.currItem.statime == undefined || $scope.data.currItem.statime == "") || ($scope.data.currItem.endtime == undefined || $scope.data.currItem.endtime == "")) {
                            msg.push("生效日期或结束日期不能为空");
                        }
                        if ($scope.data.currItem.statime > $scope.data.currItem.endtime) {
                            msg.push("生效日期大于结束日期");
                        }
                        if (msg.length > 0) {
                            swalApi.info(msg.toString());
                            return false;
                        }
                        return true;
                    }
                }

                /*===================================新建文件夹 start=================================*/
                $scope.create_file = function () {
                    BasemanService.openFrm("views/baseman/create_file.html", create_file, $scope, "", "").result.then(function (res) {
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        var data = $scope.gridGetData('options');
                        res.item_type = 1;
                        res.name = res.fdrname;
                        res.id = res.fdrid;
                        data.push(res);
                        $scope.options.api.setRowData(data);

                        var node = $scope.zTree.getSelectedNodes()[0];
                        res.isParent = true;
                        res.pId = node.id;
                        res.icon = "/web/img/file.png";
                        $scope.zTree.addNodes(node, res)
                    })
                }

                var create_file = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance, $parent) {
                    $scope.$parent = $parent;
                    //继承
                    controllerApi.extend({
                        controller: ctrl_bill_public.controller,
                        scope: $scope
                    });
                    //create_file = HczyCommon.extend(create_file, ctrl_bill_public);
                    //create_file.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
                    $scope.objconf = {
                        name: "myfiles",
                        key: "fileid",
                        FrmInfo: {},
                        grids: []
                    };
                    var flag = $scope.$parent.data.flag;
                    $scope.invorgids = [{
                        id: "0",
                        name: "<无>"
                    }]
                    $scope.clearinformation = function () {
                        if (flag == 1) { //1表示查看属性

                        } else if (flag == 2) { //2表示增加子节点

                        }
                    }
                    $scope.ok = function () {
                        if ($scope.validate()) {
                            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                            var node = zTree.getSelectedNodes()[0];
                            if (node.id == 0) {
                                var postdata = {
                                    parentid: -4,
                                    parenttype: 1,
                                    flag: 0,
                                    fdrid: 0,
                                    actived: 2,
                                };
                            } else {
                                var postdata = {
                                    parentid: node.idpath,
                                    actived: 2,
                                    parenttype: node.typepath
                                };

                            }
                            if ($scope.data.currItem.filename) {
                                postdata.fdrname = $scope.data.currItem.filename;
                            }
                            if ($scope.data.currItem.note) {
                                postdata.note = $scope.data.currItem.note;
                            }
                            BasemanService.RequestPost('scpfdr', 'insert', postdata)
                                .then(function (data) {
                                    $modalInstance.close(data);
                                })
                        }
                    }

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    }
                    $scope.validate = function () {
                        var msg = []
                        if ($scope.data.currItem.filename == undefined || $scope.data.currItem.filenames == "") {
                            msg.push("名称不能为空");
                        }

                        if (msg.length > 0) {
                            swalApi.info(msg.toString());
                            return false;
                        }
                        return true;

                    }
                    //$scope.initdata();
                }
                /*===================================新建文件夹 end=================================*/


                /*===================================重命名 start=================================*/
                $scope.new_name = function (flag) {
                    hideRMenu();
                    if (flag == 1) {
                        //左边右键修改文件夹名称
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        var node = $scope.zTree.getSelectedNodes()[0];
                        $scope.data.fdrid = node.fdrid;
                        $scope.data.fdrname = node.fdrname;
                        //右边右键修改文件夹名称
                    } else if (flag == 2) {
                        //右边右键修改文件名称
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        var treenode = $scope.zTree.getSelectedNodes()[0];
                        var node = $scope.gridGetRow('options');
                        $scope.data.fdrid = node.fdrid;
                        $scope.data.fdrname = node.fdrname;

                    } else if (flag == 3) {
                        var node = $scope.gridGetRow('options');
                        $scope.data.fdrid = node.docid;
                        $scope.data.fdrname = node.docname;

                    }
                    BasemanService.openFrm("views/baseman/new_name.html", new_name, $scope, "", "").result.then(function (data) {
                        if (flag == 3) {
                            var classid = 'scpdoc';
                            var postdata = {
                                docname: data.new_name,
                                docid: parseInt(data.fileid)
                            };
                        } else {
                            var postdata = {
                                fdrname: data.new_name,
                                fdrid: parseInt(data.fileid)
                            }
                            var classid = 'scpfdr';
                        }
                        requestApi.post({
                                classId: classid,
                                action: 'rename',
                                data: postdata
                            })
                            .then(function (data) {
                                if (flag == 1) {
                                    node.fdrname = data.fdrname;
                                    node.name = data.fdrname
                                    $scope.zTree.updateNode(node);
                                    var data = $scope.gridGetData('options');
                                    for (var i = 0; i < data.length; i++) {
                                        if (parseInt(data[i].fdrid) == node.id) {
                                            data[i].name = node.name;
                                            $scope.options.api.refreshView();
                                        }
                                    }
                                } else if (flag == 2) {
                                    if (treenode.children) {
                                        for (var i = 0; i < treenode.children.length; i++) {
                                            if (treenode.children[i].id == data.fdrid) {
                                                treenode.children[i].name = data.fdrname;
                                                treenode.children[i].fdrname = data.fdrname;
                                                $scope.zTree.updateNode(treenode.children[i]);
                                            }
                                        }
                                    }
                                    node.name = data.fdrname;
                                    node.fdrname = data.fdrname;
                                    $scope.options.api.refreshView();
                                } else if (flag == 3) {
                                    node.name = data.docname;
                                    node.docname = data.docname;
                                    $scope.options.api.refreshView();
                                }
                                swalApi.success('重命名成功');
                            })
                    })
                }

                var new_name = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance, $parent) {
                    $scope.$parent = $parent;
                    //继承
                    controllerApi.extend({
                        controller: ctrl_bill_public.controller,
                        scope: $scope
                    });
                    //new_name = HczyCommon.extend(new_name, ctrl_bill_public);
                    //new_name.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
                    $scope.objconf = {
                        name: "myfiles",
                        key: "fileid",
                        FrmInfo: {},
                        grids: []
                    };
                    $scope.invorgids = [{
                        id: "0",
                        name: "<无>"
                    }]
                    $scope.clearinformation = function () {
                        $scope.data = {};
                        $scope.data.currItem = {};
                        $scope.data.currItem.filename = $scope.$parent.data.fdrname;
                        $scope.data.currItem.new_name = $scope.$parent.data.fdrname;
                        $scope.data.currItem.fileid = $scope.$parent.data.fdrid;
                    }
                    $scope.ok = function () {
                        if ($scope.validate()) {
                            $modalInstance.close($scope.data.currItem);
                        }
                    }

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    }
                    $scope.validate = function () {
                        var msg = []
                        if ($scope.data.currItem.new_name == undefined || $scope.data.currItem.new_name == "") {
                            msg.push("新名称不能为空");
                        }

                        if (msg.length > 0) {
                            swalApi.info(msg.toString());
                            return false;
                        }
                        return true;

                    }
                    //$scope.initdata();
                }
                /*===================================重命名 end=================================*/


                /*===================================删除文件/文件夹  start=================================*/
                $scope.del_file = function (flag, index) {
                    hideRMenu();
                    if (index == 0) {
                        /*ds.dialog.confirm("确定删除？", function () {
                         $scope.del_mutifile(flag, index);
                         }, function () {
                         //if (e) e.currentTarget.disabled = false;
                         });*/
                        swalApi.confirm({
                            title: "确定删除？"
                        }).then(function () {
                            $scope.del_mutifile(flag, index);
                        })
                    } else {
                        $scope.del_mutifile(flag, index);
                    }
                }

                /**
                 *
                 * @param flag 1树 2文件夹 3文件
                 */
                $scope.del_mutifile = function (flag, index) {
                    $scope.file_list = $scope.gridGetSelectedData('options').length == 0 ? $scope.gridGetRow('options') : $scope.gridGetSelectedData('options')

                    var treenode = $scope.zTree.getSelectedNodes()[0];
                    if ($scope.file_list && $scope.file_list.length > 0) {
                        var node = $scope.file_list[index];
                        if (node.docid) {
                            flag = 3
                        } else {
                            flag = 2
                        }

                    }

                    if (flag == 1) {
                        //左边右键删除文件
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        var node = $scope.zTree.getSelectedNodes()[0];
                        $scope.data.fdrid = node.fdrid;
                        $scope.data.fdrname = node.fdrname;
                        //右边右键删除文件夹
                    } else if (flag == 2) {
                        //右边右键删除文件
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");

                        //var node = $scope.gridGetRow('options');
                        $scope.data.fdrid = node.fdrid;
                        $scope.data.fdrname = node.fdrname;

                    } else if (flag == 3) {

                        //var node = $scope.gridGetRow('options');
                        $scope.data.fdrid = node.docid;
                        $scope.data.fdrname = node.docname;

                    }
                    if (flag == 3) {
                        //校验
                        if ($scope.eror(index)) {
                            if (index < $scope.file_list.length - 1) {
                                $scope.del_file(flag, index + 1);
                            }
                            return;
                        }
                        var classid = 'scpdoc';
                        var postdata = {
                            docname: $scope.data.fdrname,
                            docid: parseInt($scope.data.fdrid),
                            flag: 1
                        };
                    } else {
                        var postdata = {
                            fdrname: $scope.data.fdrname,
                            fdrid: parseInt($scope.data.fdrid),
                            flag: 1
                        }
                        var classid = 'scpfdr';
                    }

                    // BasemanService.RequestPost(classid, 'delete', postdata)
                    requestApi.post({
                            classId: classid,
                            action: 'delete',
                            data: postdata
                        })
                        .then(function (data) {
                            if (flag == 1) {
                                node.fdrname = data.fdrname;
                                node.name = data.fdrname;
                                var pnode = node.getParentNode();
                                $scope.zTree.removeNode(node);
                                pnode.isParent = true;
                                $scope.zTree.updateNode(pnode);
                                var data = $scope.gridGetData('options');
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].id == node.id) {
                                        data.splice(i, 1);
                                        $scope.options.api.setRowData(data);
                                    }
                                }
                            } else if (flag == 2) {
                                if (treenode.children) {
                                    for (var i = 0; i < treenode.children.length; i++) {
                                        if (treenode.children[i].id == data.fdrid) {
                                            treenode.children[i].name = data.fdrname;
                                            $scope.zTree.removeNode(treenode.children[i]);
                                            treenode.isParent = true;
                                            $scope.zTree.updateNode(treenode);
                                        }
                                    }
                                }

                                if (index < $scope.file_list.length - 1) {
                                    $scope.del_file(2, index + 1);
                                } else {
                                    $scope.selectfdr(treenode);
                                }
                            } else if (flag == 3) {

                                if (index < $scope.file_list.length - 1) {
                                    $scope.del_file(3, index + 1);
                                } else {
                                    $scope.selectfdr(treenode);
                                }
                            }
                            swalApi.success('删除成功');
                        }, function (e) {
                            if (index < $scope.file_list.length - 1) {
                                $scope.del_file(flag, index + 1);
                            } else {
                                $scope.selectfdr(treenode);
                            }
                        })
                }
                /*===================================删除文件/文件夹  end=================================*/


                $scope.addfile = function () {
                    $("#my-awesome-dropzone").click();
                    //$('#upJQuery').click();
                }
                $scope.process = function () {
                    var file = $scope.gridGetRow('options');
                    if (parseInt(file.wfid) != 0) {
                        //弹出流程图
                        $scope.wfid = parseInt(file.wfid);
                        BasemanService.openFrm("views/baseman/doc_wf.html", doc_wf, $scope, "", "", false).result.then(function (data) {

                        })
                    } else {
                        //弹出选择流程
                        BasemanService.openFrm("views/baseman/choose_wf.html", choose_wf, $scope, "", "", false).result.then(function (data) {
                            //选择流程后在查询返回流程的数据，显示在界面上
                            BasemanService.RequestPost('scpwftemp', 'selectref', {
                                    wftempid: data.wftempid
                                })
                                .then(function (res) {
                                    for (var i = 0; i < res.wfproctempofwftemps.length; i++) {
                                        if (res.wfproctempofwftemps[i].wfpubtempofwfproctemps != undefined) {
                                            var keys = "wfpublishofwfprocs";

                                            res.wfproctempofwftemps[i][keys] = res.wfproctempofwftemps[i]["wfpubtempofwfproctemps"];
                                            delete res.wfproctempofwftemps[i]["wfpubtempofwfproctemps"];
                                        }
                                    }
                                    //判断是某每一个节点都是一个人
                                    for (var i = 0; i < res.wfproctempofwftemps.length; i++) {
                                        //开始和结束不用判断
                                        if (i != 0 && i != res.wfproctempofwftemps.length - 1) {
                                            //判断每个节点是否都是一个人如果不是则要选择
                                            if (res.wfproctempofwftemps[i].procusertempofwfproctemps.length == 0) {
                                                $scope.referring(res, file);
                                                return
                                            }
                                            //每个节点信息res.wfproctempofwftemps[i]
                                            var arr = $scope.if_isposition(res.wfproctempofwftemps[i].procusertempofwfproctemps);
                                            if (arr) {
                                                if (arr.length > 1) {
                                                    //某个节点中的审批人isposition=3的有两个人以上时需要选人
                                                    console.log(res.wfproctempofwftemps[i].procusertempofwfproctemps);
                                                    $scope.referring(res, file);
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                    //如果都是一个人,直接走流程
                                    var postdata = {
                                        flag: 2,
                                        wfid: 0,
                                        submitctrl: 2,
                                        breakprocid: 99999,
                                        priority: 1,
                                        period: 0,
                                        aperiod: 0,
                                        objid: 0,
                                        objtype: 0,
                                        stat: 0,
                                        autosubmitmode: 1
                                    };
                                    postdata.wfname = res.wftempname;
                                    postdata.subject = file.docname
                                    postdata.wftempid = res.wftempid;
                                    postdata.proccondofwfs = res.proccondtempofwftemps;
                                    postdata.wfprocofwfs = res.wfproctempofwftemps;
                                    for (var i = 0; i < postdata.wfprocofwfs.length; i++) {
                                        postdata.wfprocofwfs[i].procid = parseInt(postdata.wfprocofwfs[i].proctempid)
                                        postdata.wfprocofwfs[i].procname = (postdata.wfprocofwfs[i].proctempname)
                                        if (postdata.wfprocofwfs[i].procusertempofwfproctemps) {
                                            postdata.wfprocofwfs[i].procuserofwfprocs = postdata.wfprocofwfs[i].procusertempofwfproctemps
                                            for (var j = 0; j < postdata.wfprocofwfs[i].procuserofwfprocs.length; j++) {
                                                postdata.wfprocofwfs[i].procuserofwfprocs[j].procid = parseInt(postdata.wfprocofwfs[i].procuserofwfprocs[j].proctempid);
                                                //postdata.wfprocofwfs[i].procuserofwfprocs[j].procname = (postdata.wfprocofwfs[i].procuserofwfprocs[j].proctempname);
                                                if (postdata.wfprocofwfs[i].procuserofwfprocs[j].username == '流程启动者') {
                                                    postdata.wfprocofwfs[i].procuserofwfprocs[j].username = $scope.userbean.username;
                                                    postdata.wfprocofwfs[i].procuserofwfprocs[j].userid = $scope.userbean.userid;
                                                }
                                            }
                                        }

                                        delete postdata.wfprocofwfs[i].procusertempofwfproctemps

                                    }
                                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                                    var node = $scope.zTree.getSelectedNodes()[0];
                                    postdata.wfobjofwfs = [];
                                    postdata.wfobjofwfs.push($scope.gridGetRow('options'));
                                    postdata.wfobjofwfs[0].wfid = 0;
                                    postdata.wfobjofwfs[0].objtype = 6;
                                    postdata.wfobjofwfs[0].objid = parseInt(postdata.wfobjofwfs[0].docid)
                                    postdata.wfobjofwfs[0].procid = 0;
                                    postdata.wfobjofwfs[0].stat = 0;
                                    postdata.wfobjofwfs[0].objname = postdata.wfobjofwfs[0].docname;
                                    postdata.wfobjofwfs[0].objrev = 1;
                                    BasemanService.RequestPost('scpwf', 'insert', postdata)
                                        .then(function (data) {
                                            file.wfid = parseInt(data.wfid);
                                            $scope.wfid = parseInt(data.wfid);
                                            $scope.options.api.refreshView();
                                            BasemanService.openFrm("views/baseman/doc_wf.html", doc_wf, $scope, "", "", false).result.then(function (data) {

                                            })
                                            swalApi.success("提交成功");
                                        })
                                })

                        })
                    }
                }

                //该方法用于判断节点中是否有isposition==3;
                $scope.if_isposition = function (arrays) {
                    for (var i = 0; i < arrays.length; i++) {
                        if (arrays[i].isposition == 3) {
                            var arr = arrays;
                        }
                    }
                    return arr;
                }

                $scope.referring = function (res, file) {
                    $scope.data_res = res;
                    BasemanService.openFrm("views/baseman/approval_options.html", approval_options, $scope, "", "").result.then(function (data) {
                        var postdata = {
                            flag: 2,
                            wfid: 0,
                            submitctrl: 2,
                            breakprocid: 99999,
                            priority: 1,
                            period: 0,
                            aperiod: 0,
                            objid: 0,
                            objtype: 0,
                            stat: 0,
                            autosubmitmode: 1
                        };
                        postdata.wfname = res.wftempname;
                        postdata.subject = file.docname
                        postdata.wftempid = res.wftempid;
                        postdata.proccondofwfs = res.proccondtempofwftemps;
                        postdata.wfprocofwfs = data;
                        for (var i = 0; i < postdata.wfprocofwfs.length; i++) {
                            postdata.wfprocofwfs[i].procid = parseInt(postdata.wfprocofwfs[i].proctempid)
                            postdata.wfprocofwfs[i].procname = (postdata.wfprocofwfs[i].proctempname)
                            if (postdata.wfprocofwfs[i].procusertempofwfproctemps) {
                                postdata.wfprocofwfs[i].procuserofwfprocs = postdata.wfprocofwfs[i].procusertempofwfproctemps
                                for (var j = 0; j < postdata.wfprocofwfs[i].procuserofwfprocs.length; j++) {
                                    postdata.wfprocofwfs[i].procuserofwfprocs[j].procid = parseInt(postdata.wfprocofwfs[i].procuserofwfprocs[j].proctempid);
                                    //postdata.wfprocofwfs[i].procuserofwfprocs[j].procname = (postdata.wfprocofwfs[i].procuserofwfprocs[j].proctempname);
                                    if (postdata.wfprocofwfs[i].procuserofwfprocs[j].username == '流程启动者') {
                                        postdata.wfprocofwfs[i].procuserofwfprocs[j].username = $scope.userbean.username;
                                        postdata.wfprocofwfs[i].procuserofwfprocs[j].userid = $scope.userbean.userid;
                                    }
                                }
                            }

                            delete postdata.wfprocofwfs[i].procusertempofwfproctemps

                        }
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        var node = $scope.zTree.getSelectedNodes()[0];
                        postdata.wfobjofwfs = [];
                        postdata.wfobjofwfs.push($scope.gridGetRow('options'));
                        postdata.wfobjofwfs[0].wfid = 0;
                        postdata.wfobjofwfs[0].objtype = 6;
                        postdata.wfobjofwfs[0].objid = parseInt(postdata.wfobjofwfs[0].docid)
                        postdata.wfobjofwfs[0].procid = 0;
                        postdata.wfobjofwfs[0].stat = 0;
                        postdata.wfobjofwfs[0].objname = postdata.wfobjofwfs[0].docname;
                        postdata.wfobjofwfs[0].objrev = 1;
                        BasemanService.RequestPost('scpwf', 'insert', postdata)
                            .then(function (data) {
                                file.wfid = parseInt(data.wfid);
                                $scope.wfid = parseInt(data.wfid);
                                $scope.options.api.refreshView();
                                BasemanService.openFrm("views/baseman/doc_wf.html", doc_wf, $scope, "", "", false).result.then(function (data) {

                                })
                                swalApi.success("提交成功");
                            })
                    })

                }
                var doc_wf = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
                    //继承
                    controllerApi.extend({
                        controller: ctrl_bill_public.controller,
                        scope: $scope
                    });
                    //doc_wf = HczyCommon.extend(doc_wf, ctrl_bill_public);
                    //doc_wf.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
                    $scope.objconf = {
                        name: "myfiles",
                        key: "fileid",
                        FrmInfo: {},
                        grids: []
                    };
                    $scope.refresh = function () {
                        var node = $scope.$parent.zTree.getSelectedNodes()[0];
                        $scope.selectfdr(node);
                    };

                    $scope.data.currItem = {};
                    $scope.ok = function () {

                        $modalInstance.close($scope.data.currItem);
                    }
                    $scope.close_down = function (e) {
                        $modalInstance.dismiss('cancel');
                    }
                    BasemanService.RequestPost('scpwf', 'select', {
                            wfid: $scope.$parent.wfid
                        })
                        .then(function (data) {
                            $scope.data.currItem = data;
                        })
                }
                var choose_wf = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
                    //继承
                    controllerApi.extend({
                        controller: ctrl_bill_public.controller,
                        scope: $scope
                    });
                    //choose_wf = HczyCommon.extend(choose_wf, ctrl_bill_public);
                    //choose_wf.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
                    $scope.objconf = {
                        name: "myfiles",
                        key: "fileid",
                        FrmInfo: {},
                        grids: []
                    };
                    $scope.ok = function () {
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
                        var treeNode = zTree.getSelectedNodes()[0];
                        $modalInstance.close(treeNode);
                    }
                    $scope.cancel = function (e) {
                        $modalInstance.dismiss('cancel');
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
                        data: {
                            simpleData: {
                                enable: true
                            }
                        },
                        callback: {
                            beforeExpand: beforeExpand,
                            onAsyncSuccess: onAsyncSuccess
                        }
                    };

                    function beforeExpand(treeId, treeNode) {
                        /**var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
                         var treeNode = zTree.getSelectedNodes()[0];
                         if(treeNode.children){
				return;
			}
                         var postdata = treeNode
                         postdata.flag=2;
                         BasemanService.RequestPost('scpfdr', 'selectref', postdata)
                         .then(function(data) {

				data.children = data.wftemps;
				if(data.children){
					treeNode.children=[];
					var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
					for(var i=0;i<data.children.length;i++){
							data.children[i].name = data.children[i].wftempname
							data.children[i].pId=parseInt(treeNode.id);
							data.children[i].id = parseInt(data.children[i].wftempid)

					}
                    zTree.addNodes(treeNode,data.children)
				}

			});*/
                    }

                    function onAsyncSuccess(event, treeId, treeNode, msg) {
                        //showLog("[ " + getTime() + " onAsyncSuccess ]&nbsp;&nbsp;&nbsp;&nbsp;" + ((!!treeNode && !!treeNode.name) ? treeNode.name : "root"));
                    }

                    function filter(treeId, parentNode, childNodes) {
                        var treeNode = parentNode;
                        if (treeNode && treeNode.children) {
                            return;
                        }
                        var postdata = treeNode
                        postdata.flag = 2;
                        postdata.excluderight = 2;

                        var obj = BasemanService.RequestPostNoWait('scpfdr', 'selectref', postdata)
                        var children = obj.data.fdrs.concat(obj.data.wftemps);
                        if (children) {
                            treeNode.children = [];
                            for (var i = 0; i < children.length; i++) {
                                if (children[i].wftempid) {
                                    children[i].name = children[i].wftempname
                                    children[i].id = parseInt(children[i].wftempid)
                                }
                                if (children[i].fdrid) {
                                    children[i].isParent = true;
                                    children[i].name = children[i].fdrname;
                                    children[i].id = parseInt(children[i].fdrid)
                                }
                                children[i].icon = "/web/img/file.png";
                            }
                        }
                        return children;

                    }

                    function showIconForTree(treeId, treeNode) {
                        return !treeNode.isParent;
                    };
                    BasemanService.RequestPost('scpworkspace', 'selectref', {
                            wsid: -19,
                            wstag: -19,
                            wsname: '工作流工作区',
                            wstype: 1,
                            excluderight: 2,
                            entid: 1
                        })
                        .then(function (data) {
                            for (var i = 0; i < data.fdrs.length; i++) {
                                data.fdrs[i].name = data.fdrs[i].fdrname;
                                data.fdrs[i].id = data.fdrs[i].fdrid;
                                data.fdrs[i].isParent = true;
                            }
                            var zNodes = data.fdrs;
                            var zTree = $.fn.zTree.init($("#treeDemo4"), setting, zNodes);
                        })
                }

                //发邮件
                $scope.send_email = function () {
                    $scope.file = [];
                    var file = $scope.gridGetRow('options');
                    $scope.file = $scope.gridGetSelectedData('options');
                    ;

                    BasemanService.openFrm("views/baseman/send_mail.html", send_mail, $scope, "", "", false).result.then(function (data) {

                    })
                }
                $scope.download = function (params) {
                    var data = $scope.gridGetRow('options');
                    var url = "/downloadfile.do?iswb=true&filecode=" + data.downloadcode;

                    window.open(url);
                }


                /*===================================替换 start=================================*/
                $scope.exchange = function (flag) {
                    //校验
                    if ($scope.eror()) {
                        return;
                    }
                    $scope.replace_file = $scope.gridGetRow('options');
                    BasemanService.openFrm("views/baseman/replace_file.html", replace_file, $scope, "", "", false).result.then(function (data) {
                        if (data.docid == undefined) {
                            return swalApi.info("数据异常")
                        }
                        var treeNode = $scope.zTree.getSelectedNodes()[0];
                        var postdata = {};
                        postdata.docname = $scope.replace_file.docname;
                        postdata.docid = $scope.replace_file.docid;
                        postdata.idpath = treeNode.idpath;
                        postdata.docid_new = data.docid;
                        postdata.fdrid = treeNode.fdrid;

                        //UpWebReplaceFile
                        if (data.is_th == 2) {
                            postdata.isvirtual = $scope.replace_file.isvirtual;
                            var classid = 'scpfdr'
                            var action = 'upwebreplacefile'
                        } else {
                            postdata.rev_docid = data.docid;

                            var classid = 'scpdoc_web_rev'
                            var action = 'add_rev'

                        }
                        BasemanService.RequestPost(classid, action, postdata)
                            .then(function (res) {
                                //刷新节点
                                var node = $scope.zTree.getSelectedNodes()[0];
                                $scope.selectfdr(node);
                                if (data.is_th == 2) {
                                    swalApi.success("替换成功")
                                } else {
                                    swalApi.success("版本升级成功")
                                }
                            })
                    })
                }

                var replace_file = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance, $parent) {
                    $scope.$parent = $parent;
                    //继承
                    controllerApi.extend({
                        controller: ctrl_bill_public.controller,
                        scope: $scope
                    });
                    //replace_file = HczyCommon.extend(replace_file, ctrl_bill_public);
                    //replace_file.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
                    $scope.data = $scope.$parent.replace_file;
                    $scope.data.currItem = {};
                    $scope.data.currItem.is_th = 2
                    $scope.add_file = function () {
                        $timeout(function () {
                            $("#dropzone_add", parent.document).click();
                        }, 0)
                    }
                    $scope.get = function (name) {
                        var doc = {};
                        doc.docname = name;
                        if (doc.docname && (doc.docname.toLowerCase().toString().endsWith(".jpg") || doc.docname.toLowerCase().endsWith(".png") || doc.docname.toLowerCase().endsWith(".jpeg") || doc.docname.toLowerCase().endsWith(".bmp"))) {
                            return '.jpg,.png,.jpeg,.bmp'
                        } else if (doc.docname && (doc.docname.toLowerCase().endsWith(".doc") || doc.docname.toLowerCase().endsWith(".docx"))) {
                            return '.doc,.docx'
                        } else if (doc.docname && doc.docname.toLowerCase().endsWith(".xlsx") || doc.docname.toLowerCase().endsWith(".xls")) {
                            return '.xlsx,.xls'
                        } else if (doc.docname && doc.docname.toLowerCase().endsWith(".txt")) {
                            return '.txt'
                        } else if (doc.docname && (doc.docname.toLowerCase().endsWith(".ppt")) || (doc.docname.toLowerCase().endsWith(".pptx"))) {
                            return '.ppt,.pptx'
                        } else if (doc.docname && (doc.docname.toLowerCase().endsWith(".pdf"))) {
                            return '.pdf'
                        } else {
                            return ''
                        }
                    }
                    $scope.ok = function () {
                        $modalInstance.close($scope.data.currItem);
                    }
                    $scope.cancel = function (e) {
                        $modalInstance.dismiss('cancel');
                    }
                    $timeout(function () {
                        var tpl = $("<div id='preview-template' style='display: none;'><div></div></div>");
                        $("#dropzone_add", parent.document).dropzone({
                            url: '/web/scp/filesuploadsave2.do',
                            maxFilesize: 500,
                            paramName: "docFile0",
                            fallback: function () {
                                swalApi.info("浏览器版本太低,文件上传功能将不可用！");
                            },
                            acceptedFiles: $scope.get($scope.data.docname),
                            autoProcessQueue: false,
                            uploadMultiple: false,
                            addRemoveLinks: true,
                            params: {
                                scpsession: window.strLoginGuid,
                                sessionid: window.strLoginGuid
                            },
                            previewTemplate: tpl.prop("outerHTML"),
                            maxThumbnailFilesize: 5,
                            //uploadMultiple:true,
                            init: function () {
                                var myzone = this;
                                //myzone.options.acceptedFiles =$scope.get($scope.data.docname);
                                this.on('addedfile', function (file) {

                                    if (myzone.files.length > 1) {
                                        myzone.files.splice(0, 1);
                                    }
                                    $scope.data.currItem.docname = file.name;
                                    $scope.$apply();
                                })
                                $scope.ok = function () {
                                    myzone.processQueue();

                                }
                                this.on('success', function (file, json) {
                                    try {
                                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                                        var node = zTree.getSelectedNodes()[0];
                                        var object = strToJson(json);
                                        BasemanService.RequestPost('scpfdrref', 'insert', {
                                                refid: object.data[0].docid,
                                                fdrid: node.fdrid,
                                                reftype: 6,
                                                wsid: -4,
                                                idpath: node.idpath,
                                                objaccess: node.objaccess
                                            })
                                            .then(function (data) {
                                            })
                                        BasemanService.RequestPost('scpfdr', 'upwebscpdoc', {
                                                wsid: -4,
                                                idpath: node.idpath,
                                                typepath: node.typepath,
                                                docid: object.data[0].docid
                                            })
                                            .then(function (data) {
                                            })
                                        for (name in object.data[0]) {
                                            $scope.data.currItem[name] = object.data[0][name];
                                        }

                                    } catch (e) {
                                        swalApi.info("上传数据异常!");
                                    }
                                })
                                this.on('complete', function (file) {
                                    $modalInstance.close($scope.data.currItem);
                                })
                                this.on("error", function () {
                                    console.log("File upload error");
                                })
                            }
                        });
                    })

                }
                /*===================================替换 end=================================*/


                /*===================================历史版本 start=================================*/
                $scope.history_version = function (flag) {
                    BasemanService.openFrm("views/baseman/history_version.html", history_version, $scope, "", "", false).result.then(function (data) {
                    })
                }

                var history_version = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance, $parent) {
                    $scope.$parent = $parent;
                    //继承
                    controllerApi.extend({
                        controller: ctrl_bill_public.controller,
                        scope: $scope
                    });
                    //history_version = HczyCommon.extend(history_version, ctrl_bill_public);
                    //history_version.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
                    //$scope.data = $scope.$parent.replace_file;
                    var postdata = $scope.$parent.gridGetRow('options');
                    // BasemanService.RequestPost('scpdoc_web_rev', 'search', postdata)
                    requestApi.post({
                            classId: 'scpdoc_web_rev',
                            action: 'search',
                            data: postdata
                        })
                        .then(function (data) {
                            $scope.options_version.api.setRowData(data.scpdoc_web_revs);
                        })
                    $scope.add_file = function () {
                        $("#dropzone_add", parent.document).click();
                    }
                    $scope.ok = function () {
                        $modalInstance.close($scope.data.currItem);
                    }
                    $scope.cancel = function (e) {
                        $modalInstance.dismiss('cancel');
                    }
                    //加
                    $scope.open_view = function () {
                        var data = $scope.gridGetRow('options_version');
                        $scope.viewDoc(data);
                    }
                    //输出版本
                    $scope.out_version = function () {
                        var data = $scope.gridGetRow('options_version');
                        var url = "/downloadfile.do?iswb=true&filecode=" + data.downloadcode;
                        window.open(url);
                    }
                    //删除版本
                    $scope.del_version = function () {
                        var data = $scope.gridGetRow('options_version');
                        if (parseInt(data.wfid) > 0) {
                            swalApi.info("该文件正在走流程")
                            return;
                        }
                        if (parseInt(data.stat) == 8) {
                            swalApi.info("该文件已归档")
                            return;
                        }
                        var node = $scope.$parent.zTree.getSelectedNodes()[0];
                        postdata = data;
                        postdata.idpath = node.idpath;
                        postdata.fdrid = node.fdrid;
                        // BasemanService.RequestPost('scpdoc_web_rev', 'delete', postdata)
                        requestApi.post({
                                classId: 'scpdoc_web_rev',
                                action: 'delete',
                                data: postdata
                            })
                            .then(function (res) {
                                var index = $scope.options_version.api.getFocusedCell().rowIndex;
                                var data = $scope.gridGetData('options_version');
                                data.splice(index, 1);
                                $scope.options_version.api.setRowData(data);
                            })
                    }
                    //打开文件
                    $scope.open_version = function () {
                        $scope.open_view();
                    }

                    $scope.options_version = {
                        hcEvents: {rowDoubleClicked: $scope.open_view},
                        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
                        rowHeight: 25,
                        enableColResize: true,
                        icons: {
                            groupExpanded: '<i class="fa fa-minus-square-o"/>',
                            groupContracted: '<i class="fa fa-plus-square-o"/>',
                            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                            filter: '<i class="fa fa-filter"/>',
                            sortAscending: '<i class="fa fa-long-arrow-down"/>',
                            sortDescending: '<i class="fa fa-long-arrow-up"/>',
                        },
                        columnDefs: [{
                            headerName: "版本",
                            field: "rev",
                            width: 60
                        }, {
                            headerName: "名字",
                            field: "docname",
                            width: 170
                        }, {
                            headerName: "编码",
                            field: "code",
                            width: 120
                        }, {
                            headerName: "用户",
                            field: "creator",
                            width: 100
                        }, {
                            headerName: "时间",
                            field: "filetime",
                            width: 150,
                            cellEditor: "时分秒"
                        }, {
                            headerName: "动作",
                            field: "act",
                            width: 100,
                            cellEditor: "文本框",
                            cellRenderer: function (params) {
                                if (params.data.updatetime) {
                                    return '检入'
                                } else {
                                    return '创建'
                                }
                            }
                        }],
                    };
                    $timeout(function () {
                        var tpl = $("<div id='preview-template' style='display: none;'><div></div></div>");
                        $("#dropzone_add", parent.document).dropzone({
                            url: '/web/scp/filesuploadsave2.do',
                            maxFilesize: 500,
                            paramName: "docFile0",
                            fallback: function () {
                                swalApi.info("浏览器版本太低,文件上传功能将不可用！");
                            },
                            addRemoveLinks: true,
                            params: {
                                scpsession: window.strLoginGuid,
                                sessionid: window.strLoginGuid
                            },
                            previewTemplate: tpl.prop("outerHTML"),
                            maxThumbnailFilesize: 5,
                            //uploadMultiple:true,
                            init: function () {
                                this.on('addedfile', function (file) {
                                    //var l=0;
                                })
                                this.on('success', function (file, json) {
                                    try {
                                        var object = strToJson(json);
                                        for (name in object.data[0]) {
                                            $scope.data.currItem[name] = object.data[0][name];
                                            $scope.$apply();
                                        }

                                    } catch (e) {
                                        swalApi.info("上传数据异常!");
                                    }
                                })
                                this.on("error", function () {
                                    console.log("File upload error");
                                })
                            }
                        });
                    })

                }
                /*===================================历史版本 end=================================*/


                /*===================================网格配置  start=================================*/

                //右键菜单
                function getContextMenuItems(params) {
                    if (params.node && params.node.selected == false) {
                        params.node.setSelected(true, true);
                    } else {

                    }
                    $scope.data.flag = 2;
                    var pmiSearch = { // custom item
                        name: '搜索',
                        action: function () {
                            window.alert('Alerting about ' + params.value);
                        },
                        icon: '<i class="fa fa-search"></i>',
                        cssClasses: ['redFont', 'bold']
                    }
                    var pmiCopy = {
                        name: '复制',
                        icon: '<i class="fa fa-files-o"></i>',
                        action: function (params) {
                            // return $scope.file_copy()
                            return $scope.file_copy1()
                        }
                    }
                    var pmiCut = {
                        name: '剪切',
                        icon: '<i class="fa fa-scissors"></i>',
                        action: function (params) {
                            // return $scope.file_move()
                            return $scope.file_cut1()
                        }
                    }
                    var pmiPaste = {
                        name: '粘贴',
                        icon: '<i class="fa fa-clipboard"></i>',
                        action: function (params) {
                            return $scope.paste_file()
                        }
                    }
                    var pmiRights = {
                        name: '权限',
                        icon: '<i class="fa fa-share"></i>',
                        action: function (params) {
                            return $scope.share(3);
                        }
                    }
                    //文件夹删除
                    var pmiDeleteFolder = {
                        name: '删除',
                        icon: '<i class="fa fa-trash-o"></i>',
                        action: function (params) {
                            return $scope.del_file(2, 0);
                        }
                    }
                    //文件删除
                    var pmiDeleteFile = {
                        name: '删除',
                        icon: '<i class="fa fa-trash-o"></i>',
                        action: function (params) {
                            return $scope.del_file(3, 0);
                        }
                    }
                    //文件夹重命名
                    var pmiRenameFolder = {
                        name: '重命名',
                        icon: '<i class="fa fa-pencil"></i>',
                        action: function (params) {
                            return $scope.new_name(2);
                        }
                    }
                    //文件重命名
                    var pmiRenameFile = {
                        name: '重命名',
                        icon: '<i class="fa fa-pencil"></i>',
                        action: function (params) {
                            return $scope.new_name(3);
                        }
                    }
                    var pmiReplace = {
                        name: '替换',
                        icon: '<i class="fa fa-repeat"></i>',
                        action: function (params) {
                            return $scope.exchange(3);
                        }
                    }
                    var pmiHistoryRev = {
                        name: '历史版本',
                        icon: '<i class="fa fa-history"></i>',
                        action: function (params) {
                            return $scope.history_version(3);
                        }
                    }
                    var pmiEmail = {
                        name: '发邮件',
                        icon: '<i class="fa fa-envelope-o"></i>',
                        action: function (params) {
                            return $scope.send_email(3);
                        }
                    }
                    var pmiWf = {
                        name: '流程',
                        icon: '<i class="fa fa-plane"></i>',
                        action: function (params) {
                            return $scope.process(3);
                        }
                    }
                    var pmiDownLoad = {
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
                    var pmiPropFolder = {
                        name: '属性',//文件夹属性
                        icon: '<i class="fa fa-info-circle"></i>',
                        action: function (params) {
                            return $scope.ftr_attr();
                        }
                    }
                    var pmiPropFile = {
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
                        $scope.initObjRights(params.node.data);
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
                            if ($scope.data.rightObj.cantransfer == 2 || $scope.userbean.userid == 'admin') {
                                result.push(pmiCopy);
                                result.push(pmiCut);
                                $scope.file_list && $scope.file_list.length > 0 && result.push(pmiPaste);
                                result.push(pmiRights);
                                result.push(pmiDeleteFolder);
                                result.push(pmiRenameFolder);
                            } else {
                                //判断是否有删除的权限
                                if ($scope.data.rightObj.delete == 1) {
                                    result.push(pmiCopy);
                                    result.push(pmiCut);
                                    $scope.file_list && $scope.file_list.length > 0 && result.push(pmiPaste);
                                    result.push(pmiDeleteFolder);
                                    result.push(pmiRenameFolder);

                                } else {
                                    //判断是否有修改的权限
                                    if ($scope.data.rightObj.modify == 1) {
                                        result.push(pmiCopy);
                                        result.push(pmiCut);
                                        $scope.file_list && $scope.file_list.length > 0 && result.push(pmiPaste);
                                        result.push(pmiDeleteFolder);
                                        result.push(pmiRenameFolder);
                                    }
                                }
                            }
                            result.push(pmiPropFolder);
                        } else {

                            //判断是否有转授权限
                            if ($scope.data.cantransfer == 2 || $scope.userbean.userid == 'admin') {
                                result.push(pmiCopy);
                                result.push(pmiCut);
                                $scope.file_list && $scope.file_list.length > 0 && result.push(pmiPaste);
                                result.push(pmiRights);
                                result.push(pmiReplace);
                                result.push(pmiHistoryRev);
                                result.push(pmiEmail);
                                result.push(pmiDeleteFile);
                                result.push(pmiRenameFile);
                                // result.push(pmiWf);
                                result.push(pmiDownLoad);
                            } else {
                                //判断是否有删除的权限
                                if ($scope.data.rightObj.delete == 1) {
                                    result.push(pmiCopy);
                                    result.push(pmiCut);
                                    $scope.file_list && $scope.file_list.length > 0 && result.push(pmiPaste);
                                    result.push(pmiReplace);
                                    result.push(pmiHistoryRev);
                                    result.push(pmiEmail);
                                    result.push(pmiDeleteFile);
                                    result.push(pmiRenameFile);
                                    // result.push(pmiWf);
                                    result.push(pmiDownLoad);

                                } else {
                                    //判断是否有修改的权限
                                    if ($scope.data.rightObj.modify == 1) {
                                        result.push(pmiCopy);
                                        result.push(pmiCut);
                                        $scope.file_list && $scope.file_list.length > 0 && result.push(pmiPaste);
                                        result.push(pmiReplace);
                                        result.push(pmiHistoryRev);
                                        result.push(pmiEmail);
                                        result.push(pmiRenameFile);
                                        // result.push(pmiWf);
                                        result.push(pmiDownLoad);
                                    } else {
                                        //判断是否有新增的权限
                                        if ($scope.data.rightObj.add == 1) {
                                            result.push(pmiHistoryRev);
                                            result.push(pmiEmail);
                                            // result.push(pmiWf);
                                            result.push(pmiDownLoad);
                                        } else {
                                            //判断是否有输出的权限
                                            if ($scope.data.rightObj.add == 1) {
                                                result.push(pmiHistoryRev);
                                                result.push(pmiEmail);
                                                result.push(pmiDownLoad);
                                            } else {
                                                //判断是否有只读的权限
                                                if ($scope.data.rightObj.read == 1) {
                                                    result.push(pmiHistoryRev);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            result.push(pmiPropFile);
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
                                    var node = $scope.zTree.getSelectedNodes()[0];
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
                        var node = $scope.zTree.getSelectedNodes()[0];
                        $scope.initObjRights(node);
                        if ($scope.data.rightObj.modify == 1) {
                            result.push('separator');
                            /* result.push({ // custom item
                             name: '复制',
                             icon:'<i class="fa fa-files-o"></i>',
                             action: function () {
                             // console.log('Windows Item Selected');
                             }
                             })
                             result.push({ // custom item
                             name: '剪切',
                             icon:'<i class="fa fa-arrows"></i>',
                             action: function () {
                             console.log('Windows Item Selected');
                             }
                             })*/
                            $scope.file_list && $scope.file_list.length > 0 && result.push(pmiPaste);
                        }
                        if ($scope.data.rightObj.add == 1) {
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
                                    var node = $scope.zTree.getSelectedNodes()[0];
                                    if (node.id == 0) {
                                        swalApi.info("最上层不能添加文件")
                                    } else {
                                        $scope.addfile();
                                    }
                                },
                                cssClasses: ['dropzone']
                            })
                            /**result.push({
					name: '导入',
					subMenu: [{
							name: '文件夹',
							action: function() {
								console.log('Niall was pressed');
							},
							icon: '<img src="../img/file.png"/>'
						},
						{
							name: '文档',
							action: function() {
								console.log('Niall was pressed');
							},
							icon: '<img src="../img/file.png"/>'
						}
					]
				})*/
                        }
                    }
                    return result;
                }

                /**
                 * 网格双击
                 */
                $scope.rowDoubleClicked = function (e) {
                    var data = $scope.gridGetRow('options');
                    if (data.docid) {
                        $scope.viewDoc(data);
                    } else {
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        var postdata = {};
                        for (name in e.data) {
                            if (name != 'children') {
                                postdata[name] = e.data[name];
                            }
                        }
                        BasemanService.RequestPost('scpfdr', 'selectref', postdata)
                            .then(function (data) {
                                data.children = data.fdrs;
                                var treeNode = $scope.zTree.getNodesByParam("id", e.data.fdrid, null);
                                //var treeNode = zTree.getNodesByParam("id",e.data.id,null);
                                $scope.zTree.selectNode(treeNode[0]);
                                if (data.children) {
                                    for (var i = 0; i < data.docs.length; i++) {
                                        data.docs[i].name = data.docs[i].docname;
                                    }

                                    //treeNode[0].children=[];

                                    for (var i = 0; i < data.fdrs.length; i++) {
                                        data.fdrs[i].name = data.fdrs[i].fdrname;
                                        data.fdrs[i].item_type = 1;
                                    }
                                    $scope.data.currItem.files = data.fdrs.concat(data.docs);
                                    ;

                                    for (var i = 0; i < data.children.length; i++) {
                                        data.children[i].isParent = true;
                                        data.children[i].name = data.children[i].fdrname
                                        data.children[i].pId = parseInt(treeNode.id);
                                        data.children[i].id = parseInt(data.children[i].fdrid)
                                        data.children[i].item_type = 1;
                                        data.children[i].icon = "/web/img/file.png";
                                    }
                                    if (!treeNode[0].children) {
                                        treeNode[0].children = [];
                                        $scope.zTree.addNodes(treeNode[0], data.children);
                                    }
                                    $scope.zTree.expandNode(treeNode[0], true, false, true, true);
                                    $timeout(
                                        function () {

                                            $scope.options.api.setRowData($scope.data.currItem.files);
                                            $scope.options.api.hideOverlay();
                                        }, 250
                                    )

                                }

                            });
                    }

                };

                $('#dropzone').click(function (e) {
                    if (e.target.className == "ag-body-viewport") {
                        $scope.options.api.deselectAll();
                    }
                });

                /**
                 * 网格列配置
                 */
                $scope.options = {
                    hcEvents: {rowDoubleClicked: $scope.rowDoubleClicked},
                    suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
                    rowDeselection: true,
                    //rowClicked:$scope.setUnselect,
                    rowHeight: 25,
                    getContextMenuItems: getContextMenuItems,
                    getNodeChildDetails: function (file) {
                        if (file.group) {
                            file.group = file.group;
                            return file;
                        } else {
                            return null;
                        }
                    },
                    enableColResize: true,
                    icons: {
                        groupExpanded: '<i class="fa fa-minus-square-o"/>',
                        groupContracted: '<i class="fa fa-plus-square-o"/>',
                        columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                        filter: '<i class="fa fa-filter"/>',
                        sortAscending: '<i class="fa fa-long-arrow-down"/>',
                        sortDescending: '<i class="fa fa-long-arrow-up"/>',
                    },
                    columnDefs: [{
                        headerName: "名称",
                        field: "name",
                        width: 280,
                        onclick: $scope.rowClicked,
                        //cellClass:function(params){return cellClassf(params)},
                        cellRenderer: function (params) {
                            return imageRenderer(params)
                        },
                        //cellClass: 'fa fa-file-excel-o'

                    }, {
                        headerName: "类型",
                        field: "item_type",
                        width: 100,
                        cellEditor: "文本框",
                        cellRenderer: function (params) {
                            return itemtypeRenderer(params)
                        }
                    }, {
                        headerName: "版本",
                        field: "isvirtual",
                        width: 80,
                        cellStyle: {
                            'font-style': 'normal'
                        }
                    }, {
                        headerName: "大小",
                        field: "oldsize",
                        width: 100,
                        cellStyle: {
                            'font-style': 'normal'
                        }
                    }, {
                        headerName: "时间",
                        field: "createtime",
                        width: 150,
                        cellEditor: "时分秒",
                        cellStyle: {
                            'font-style': 'normal'
                        }
                    }, {
                        headerName: "用户",
                        field: "creator",
                        width: 100,
                        cellEditor: "文本框",
                        cellStyle: {
                            'font-style': 'normal'
                        }
                    }]
                };

                /**
                 * 细胞渲染器
                 */
                function imageRenderer(params) {
                    if (params.data.item_type == 1) {
                        return "<img src='/web/img/file.png'>" + params.data[params.colDef.field];
                    } else {
                        var classname = HczyCommon.getAttachIcon(params.value);
                        var plus = '';
                        if (parseInt(params.data.wfid) > 0) {
                            plus += ';background-color:#5de466';
                        }
                        if (parseInt(params.data.stat) == 8) {
                            plus += ';background-color:#e2e20e';
                        }

                        var color = '';
                        //通过css控制颜色
                        /*if (classname == 'fa-file-pdf-o') {
                         color = 'style="color:#8c0404' + plus + '"';
                         } else if (classname == 'fa-file-excel-o') {
                         color = 'style="color:green' + plus + '"'
                         } else if (classname == 'fa-file-word-o') {
                         color = 'style="color:#0808de' + plus + '"'
                         } else if (classname == 'fa-file-powerpoint-o') {
                         color = 'style="color:red' + plus + '"'
                         } else if (classname == 'fa-file-image-o') {
                         color = 'style="color:blue' + plus + '"';
                         } else {
                         color = ''
                         }*/

                        return '<i class="fa ' + classname + ' fa-lg"' + color + '>' + '</i>' + params.data[params.colDef.field];
                    }
                };

                function itemtypeRenderer(params) {
                    if (parseInt(params.value) == 1) {
                        return '文件夹';
                    } else {
                        var doc = params.data;
                        if (doc.docname && (doc.docname.toLowerCase().toString().endsWith(".jpg") || doc.docname.toLowerCase().endsWith(".png") || doc.docname.toLowerCase().endsWith(".jpeg") || doc.docname.toLowerCase().endsWith(".bmp"))) {
                            return '图片文件'
                        } else if (doc.docname && (doc.docname.toLowerCase().endsWith(".doc") || doc.docname.toLowerCase().endsWith(".docx"))) {
                            return 'word 文件'
                        } else if (doc.docname && doc.docname.toLowerCase().endsWith(".xlsx") || doc.docname.toLowerCase().endsWith(".xls")) {
                            return 'excel 文件'
                        } else if (doc.docname && doc.docname.toLowerCase().endsWith(".txt")) {
                            return '文本文件'
                        } else if (doc.docname && (doc.docname.toLowerCase().endsWith(".ppt")) || (doc.docname.toLowerCase().endsWith(".pptx"))) {
                            return 'PPT 文件'
                        } else if (doc.docname && (doc.docname.toLowerCase().endsWith(".pdf"))) {
                            return 'pdf 文件'
                        } else {
                            return '其它文件'
                        }
                    }
                };

                function cellClassf(params) {
                    if (params.data.item_type != 1) {
                        var classname = HczyCommon.getAttachIcon(params.value);
                        return 'fa ' + classname + ' fa-lg';
                    }
                }

                /*===================================网格配置  end=================================*/


                //$scope.initdata();


                /*================================树设置 start================================*/
                var tree_setting = {
                    async: {
                        enable: true,
                        url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
                        autoParam: ["id", "name=n", "level=lv"],
                        otherParam: {
                            "id": 108
                        },
                        dataFilter: filter_first
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        //beforeExpand: beforeExpand,
                        onRightClick: OnRightClick, //右键事件
                        //onAsyncSuccess: onAsyncSuccess,//回调函数，在异步的时候，进行节点处理（有时间延迟的），后续章节处理
                        onClick: menuShowNode
                    }
                };

                function beforeExpand(treeId, treeNode) {
                    if (treeNode.children) {
                        return;
                    } else {
                        return '';
                    }
                }

                function filter_first(treeId, parentNode, childNodes) {
                    if (parentNode && parentNode.children) {
                        return '';
                    }
                    var postdata = parentNode;
                    var init_data = BasemanService.RequestPostSync('scpfdr', "selectref", postdata);

                    var children = init_data.fdrs;
                    if (children) {
                        parentNode.children = [];
                        for (var i = 0; i < children.length; i++) {
                            children[i].isParent = true;
                            children[i].name = children[i].fdrname
                            children[i].pId = parseInt(parentNode.id);
                            children[i].id = parseInt(children[i].fdrid)
                            children[i].item_type = 1;
                            children[i].icon = "/web/img/file.png";
                        }
                        //$scope.options.api.setRowData(children);
                    }
                    return children
                }

                function ajaxGetNodes(treeNode, reloadType) {
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    if (reloadType == "refresh") {
                        $scope.zTree.updateNode(treeNode);
                    }
                }

                $scope.judge_copy = function (treeNode) {
                    $scope.initObjRights(treeNode);
                    if ($scope.data.rightObj.all == 1 || $scope.data.rightObj.modify == 1 || $scope.data.rightObj.delete == 1) {
                        return true;
                    } else {
                        return false;
                    }
                }

                //设置菜单权限
                $scope.initObjRights = function (treeNode) {
                    if (treeNode === undefined) {
                        return;
                    }
                    var objaccess = '00000000';
                    if (treeNode.objaccess) {
                        objaccess = numberApi.inttobin(treeNode.objaccess, 8);
                    }
                    if (objaccess == '00000000') {
                        $scope.data.rightObj.all = 0;
                        $scope.data.rightObj.view = 0;
                        $scope.data.rightObj.read = 0;
                        $scope.data.rightObj.modify = 0;
                        $scope.data.rightObj.add = 0;
                        $scope.data.rightObj.delete = 0;
                        $scope.data.rightObj.dir = 0;
                        $scope.data.rightObj.export = 0;
                    } else if (objaccess == '11111111' || userbean.userauth.admins) {
                        $scope.data.rightObj.all = 1;
                        $scope.data.rightObj.view = 1;
                        $scope.data.rightObj.read = 1;
                        $scope.data.rightObj.modify = 1;
                        $scope.data.rightObj.add = 1;
                        $scope.data.rightObj.delete = 1;
                        $scope.data.rightObj.dir = 1;
                        $scope.data.rightObj.export = 1;
                        $scope.data.rightObj.cantransfer = 2;
                    } else {
                        for (var j = 0; j <= 7; j++) {
                            var value = parseInt(objaccess.substr(j, 1) || 0);
                            if (!value || parseInt(value) != 1) {
                                value = 0;
                            }

                            if (j == 0) {
                                $scope.data.rightObj.all = value;
                            }
                            else if (j == 1) {
                                $scope.data.rightObj.view = value;
                            }
                            else if (j == 2) {
                                $scope.data.rightObj.read = value;
                            }
                            else if (j == 3) {
                                $scope.data.rightObj.modify = value;
                            }
                            else if (j == 4) {
                                $scope.data.rightObj.add = value;
                            }
                            else if (j == 5) {
                                $scope.data.rightObj.delete = value;
                            }
                            else if (j == 6) {
                                $scope.data.rightObj.dir = value;
                            }
                            else if (j == 7) {
                                $scope.data.rightObj.export = value;
                            }
                        }
                    }
                }

                /**
                 * 树右键
                 */
                function OnRightClick(event, treeId, treeNode) {
                    if (treeNode) {
                        //初始化权限
                        $scope.initObjRights(treeNode);
                        var top = $(window).scrollTop();

                        $scope.zTree.selectNode(treeNode);
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
                    $("#rMenu ul").show();
                    $scope.rMenu.css({
                        "top": y + "px",
                        "left": x + "px",
                        "visibility": "visible"
                    });
                    $scope.$apply();
                    //在当前页面绑定 鼠标事件
                    $(document).bind("mousedown", onBodyMouseDown);
                }

                //事件触发 隐藏菜单
                function onBodyMouseDown(event) {
                    if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
                        $scope.rMenu.css({
                            "visibility": "hidden"
                        });
                    }
                }

                //隐式 隐藏右键菜单
                function hideRMenu() {
                    if ($scope.rMenu) {
                        $scope.rMenu.css({
                            "visibility": "hidden"
                        });
                    }
                    //取消绑定
                    $(document).unbind("mousedown", onBodyMouseDown);
                }

                //单击节点 显示节点
                function menuShowNode() {
                    var node = $scope.zTree.getSelectedNodes()[0];
                    $scope.selectfdr(node);
                }

                //刷新节点
                $scope.selectfdr = function (node) {
                    if (node.id == 0) {
                        $scope['options'].api.setRowData($scope.data.fdrs_levelOne);
                    } else {
                        var postdata = {};
                        for (name in node) {
                            if (name != 'children') {
                                postdata[name] = node[name];
                            }
                        }
                        postdata.flag = 1;
                        BasemanService.RequestPost('scpfdr', 'selectref', postdata)
                            .then(function (data) {
                                //如果是文件，那么提前放到左边的父类文件夹中
                                if (data.fdrs) {
                                    if (!node.children) {
                                        node.children = [];
                                        var children = [];
                                        for (var i = 0; i < data.fdrs.length; i++) {
                                            data.fdrs[i].isParent = true;
                                            data.fdrs[i].pId = node.id;
                                            data.fdrs[i].id = parseInt(data.fdrs[i].fdrid);
                                            data.fdrs[i].item_type = 1;
                                            data.fdrs[i].name = data.fdrs[i].fdrname;
                                            data.fdrs[i].icon = "/web/img/file.png";
                                            children.push(data.fdrs[i]);
                                        }
                                        $scope.zTree.addNodes(node, children, true)
                                    }

                                }
                                for (var i = 0; i < data.docs.length; i++) {
                                    data.docs[i].name = data.docs[i].docname;
                                }
                                for (var i = 0; i < data.fdrs.length; i++) {
                                    data.fdrs[i].name = data.fdrs[i].fdrname;
                                    data.fdrs[i].item_type = 1;
                                }
                                $scope.data.currItem.files = data.fdrs.concat(data.docs);
                                $scope['options'].api.setRowData($scope.data.currItem.files);
                                $scope.options.api.hideOverlay();

                            });
                    }
                }
                /*================================树设置 end================================*/


                /*=======================================查询根目录 start===========================================*/
                $scope.getDirectory = function () {
                    BasemanService.RequestPost('scpworkspace', 'selectref', {
                            wsid: -4,
                            sysuserid: window.userbean.sysuserid,
                            excluderight: 1,
                            entid: window.userbean.entid
                        })
                        .then(function (data) {
                            var zNodes = {
                                // icon: '/web/img/computer.png'
                                icon: '/web/img/file.png'
                            };
                            //zNodes.name = window.userbean.userid+"的文件";
                            zNodes.objaccess = 0;

                            zNodes.name = '公司文档'
                            zNodes.id = 0;
                            zNodes.isParent = true;
                            zNodes.fdrid = 0;
                            $scope.data.fdrs_levelOne = data.fdrs
                            data.children = data.fdrs;

                            for (var i = 0; i < data.children.length; i++) {
                                data.children[i].isParent = true;
                                data.children[i].name = data.children[i].fdrname;
                                //文件夹的时候设置为1
                                data.children[i].item_type = 1;
                                data.children[i].id = parseInt(data.children[i].fdrid);
                                data.children[i].icon = "/web/img/file.png";
                            }
                            zNodes.children = data.children;
                            $scope.tree_data = zNodes;
                            $scope.rMenu = $("#rMenu");
                            $timeout(function () {
                                if ($scope.data.currItem.tree_datas) {
                                    $scope.tree_data = $scope.data.currItem.tree_datas;
                                }
                                ;
                                $scope.zTree = $.fn.zTree.init($("#treeDemo"), tree_setting, $scope.tree_data);
                                $scope.zTree = $.fn.zTree.getZTreeObj("treeDemo");
                                //展开根节点
                                $scope.zTree.expandNode($scope.zTree.getNodes()[0], true, false, false);
                                //选择节点
                                if ($scope.data.currItem.selectNode) {
                                    var id = $scope.data.currItem.selectNode[0].id;
                                    var selectNode = $scope.zTree.getNodeByParam('id', id, null);
                                    $scope.zTree.selectNode(selectNode);
                                }
                                //点击根节点
                                var selectNode = $scope.zTree.getNodeByParam('id', 0, null);
                                $scope.zTree.selectNode(selectNode);
                                menuShowNode()
                            }, 100)
                        });
                };
                $scope.getDirectory();
                /*=======================================查询根目录 end===========================================*/

                //加载控制器
                var approval_options = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance, FormValidatorService) {
                    //继承
                    controllerApi.extend({
                        controller: ctrl_bill_public.controller,
                        scope: $scope
                    });
                    //approval_options = HczyCommon.extend(approval_options, ctrl_bill_public);
                    //approval_options.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
                    $scope.title = "选择审批人";
                    $scope.data_res = $scope.$parent.data_res;
                    //用于存放人员数据
                    $scope.leadership = [];
                    for (var i = 0; i < $scope.data_res.wfproctempofwftemps.length; i++) {
                        console.log($scope.data_res.wfproctempofwftemps[i]);
                        if (i != 0 && i != $scope.data_res.wfproctempofwftemps.length - 1) {
                            if ($scope.data_res.wfproctempofwftemps[i].procusertempofwfproctemps.length == 0) {
                                $scope.data_res.wfproctempofwftemps[i].needselect = 2;
                            }
                        }
                        $scope.leadership.push($scope.data_res.wfproctempofwftemps[i]);
                    }

                    $scope.stats = 0;
                    $scope.new_leadership = function (item, andix) {
                        $scope.proctempname = item.proctempname;
                        item.needselect = 2;
                        $scope.andix = andix;
                        BasemanService.openFrm("views/baseman/add_examinant.html", share_addController, $scope, "", "").result.then(function (data) {
                            for (var i = 0; i < data.length; i++) {
                                if (angular.isUndefined(data[i].orgname)) {
                                    data[i].orgname = "";
                                }
                                var obj = "{userid:'" + data[i].userid + "',username:'" + data[i].username + "',positionid:" + data[i].positionid + ",orgname:'" + data[i].orgname + "',proctempid:" + 0 + ",stats:" + 1 + "}";
                                item.procusertempofwfproctemps.push(eval("(" + obj + ")"));
                            }
                        })

                    }

                    $scope.leaderships = function (a) {
                        if (a.stats == undefined || a.stats == 0) {
                            a.stats = 1;
                        } else {
                            a.stats = 0;
                        }
                    }

                    $scope.ok = function () {
                        //定义一个数组放全部数据
                        $scope.arrays_sum = $scope.leadership;

                        for (var i = 0; i < $scope.arrays_sum.length; i++) {
                            //流程节点的第一个和最后一个不用判断,如果该节点是一个人的时候不用判断
                            if (i != 0 && i != $scope.arrays_sum.length - 1 && $scope.arrays_sum[i].needselect == 2) {
                                console.log($scope.arrays_sum[i]);

                                var users = $scope.arrays_sum[i].procusertempofwfproctemps;

                                if (users.length == 0) {
                                    swalApi.info($scope.arrays_sum[i].proctempname + '没有选择审批人！');
                                    return;
                                } else {
                                    var valid = false;
                                    for (var j = 0; j < users.length; j++) {
                                        var user = users[j]
                                        if (parseInt(user.stats) == 1) {
                                            valid = true;
                                            break;
                                        }
                                    }
                                    if (!valid) {
                                        swalApi.info($scope.arrays_sum[i].proctempname + '没有选择审批人！');
                                        return;
                                    }
                                }
                            }
                        }

                        for (var i = 0; i < $scope.arrays_sum.length; i++) {
                            //流程节点的第一个和最后一个不用判断,如果该节点是一个人的时候不用判断
                            if (i != 0 && i != $scope.arrays_sum.length - 1 && $scope.arrays_sum[i].needselect == 2) {
                                for (var j = 0; j < $scope.arrays_sum[i].procusertempofwfproctemps.length; j++) {
                                    //如果没有状态或是状态为0时删该用户
                                    if ($scope.arrays_sum[i].procusertempofwfproctemps[j].stats == undefined || $scope.arrays_sum[i].procusertempofwfproctemps[j].stats == 0) {
                                        //此处删除..$scope.arrays_sum[i].procusertempofwfproctemps[j]
                                        //调用删除数组听元素方法
                                        $scope.arrays_sum[i].procusertempofwfproctemps.remove($scope.arrays_sum[i].procusertempofwfproctemps[j]);
                                        j--;
                                    }
                                }
                            }
                        }
                        $modalInstance.close($scope.arrays_sum);
                    }
                    $scope.cancel = function (e) {
                        $modalInstance.dismiss('cancel');
                    }
                    Array.prototype.indexOf = function (val) {
                        for (var k = 0; k < this.length; k++) {
                            if (this[k] == val) return k;
                        }
                        return -1;
                    };
                    Array.prototype.remove = function (val) {
                        var index = this.indexOf(val);
                        if (index > -1) {
                            this.splice(index, 1);
                        }
                    };

                }
                var share_addController = function ($scope, notify, $modal, $state, $timeout, $location, BasemanService, localeStorageService, $rootScope, $modalInstance) {
                    //继承
                    controllerApi.extend({
                        controller: ctrl_bill_public.controller,
                        scope: $scope
                    });
                    //share_add = HczyCommon.extend(share_add, ctrl_bill_public);
                    //share_add.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
                    $scope.data.currItem = {};

                    $scope.title = "添加" + $scope.$parent.proctempname;
                    $scope.data.currItem.sj_people = [];
                    var TimeFn = null;
                    $scope.search_peopele = function (flag) {
                        $scope.data.is_search = 2;
                        if ($scope.data.username == '' || $scope.data.username == undefined) {
                            $scope.data.is_search = 1;
                            return;
                        }

                        BasemanService.RequestPost("scpemail_contact_list", "search", {
                            username: $scope.data.username,
                            flag: 3,
                            emailtype: 3
                        }).then(function (data) {
                            $scope.data.currItem.scporgs = data.scporgs;
                        })
                    }
                    $scope.contact_people = function (item) {
                        var object = {};
                        object.userid = item.userid
                        object.username = item.username;
                        object.orgcode = item.code;
                        object.orgname = item.name;
                        for (var i = 0; i < $scope.data.currItem.sj_people.length; i++) {
                            if (object.userid == $scope.data.currItem.sj_people[i].userid) {
                                swalApi.info("选择人员重复");
                                return;
                            }
                        }
                        $scope.data.currItem.sj_people.push(object);
                    }
                    //用户

                    Array.prototype.push.apply($scope.data.currItem.sj_people, $scope.arrays_user);
                    //添加用户
                    $scope.add_sj = function () {
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
                        var node = zTree.getSelectedNodes()[0];

                        if (node == undefined || node.isParent == true) {
                            swalApi.info("请选择人员");
                            return;
                        }
                        var object = {};
                        object.username = node.name;
                        object.userid = (node.userid);
                        for (var i = 0; i < $scope.data.currItem.sj_people.length; i++) {
                            if (object.userid == $scope.data.currItem.sj_people[i].userid) {
                                swalApi.info("选择人员重复");
                                return;
                            }
                        }

                        $scope.data.currItem.sj_people.push(node);
                    }

                    //点击当前用户加光标
                    $scope.click_sj = function (e, index) {
                        $scope.sj_index = index;
                        $(e.delegateTarget).siblings().removeClass("high");
                        $(e.delegateTarget).addClass('high');
                    }

                    //删除用户
                    $scope.del_sj = function () {
                        $scope.data.currItem.sj_people.splice($scope.sj_index, 1);
                    }

                    //双击删除用户
                    $scope.del_user = function () {
                        $scope.data.currItem.sj_people.splice($scope.sj_index, 1);
                    }

                    function showIconForTree(treeId, treeNode) {
                        return !treeNode.isParent;
                    };
                    BasemanService.RequestPost("scpemail_contact_list", "search", {
                            emailtype: 3
                        })
                        .then(function (data) {
                            for (var i = 0; i < data.scporgs.length; i++) {
                                data.scporgs[i].id = parseInt(data.scporgs[i].id);
                                data.scporgs[i].pId = parseInt(data.scporgs[i].pid);
                                if (data.scporgs[i].username) {
                                    data.scporgs[i].orgname = data.scporgs[i].name;
                                    data.scporgs[i].name = data.scporgs[i].username
                                } else {
                                    data.scporgs[i].isParent = true;
                                }
                            }
                            $scope.data.scporgs = data.scporgs;
                            $.fn.zTree.init($("#treeDemo4"), setting4, $scope.data.scporgs);
                        })
                    //树状结构定义
                    var setting4 = {
                        async: {
                            enable: true,
                            url: "../jsp/req.jsp?classid=base_search&action=loginuserinfo&format=mjson",
                            autoParam: ["id", "name=n", "level=lv"],
                            otherParam: {
                                "id": 108
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
                            beforeExpand: beforeExpand,
                            //onRightClick : OnRightClick,//右键事件
                            onClick: zTreeOnClick //双击事件
                        }
                    };

                    function beforeExpand() {
                        //双击时取消单机事件
                        if (TimeFn) {
                            clearTimeout(TimeFn);
                        }
                    }

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
                        postdata.orgid = parseInt(postdata.id);
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
                                children[i].icon = "/web/img/file.png";
                            }
                        }
                        return children;

                    }

                    $scope.cancel = function (e) {
                        $modalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (e) {
                        $modalInstance.close($scope.data.currItem.sj_people);
                    }

                    //双击选择添加用户和机构
                    function zTreeOnClick(event, treeId, treeNode) {
                        // 取消上次延时未执行的方法
                        clearTimeout(TimeFn);
                        //执行延时
                        TimeFn = setTimeout(function () {
                            var zTree = $.fn.zTree.getZTreeObj("treeDemo4");
                            var node = zTree.getSelectedNodes()[0];

                            if (node == undefined) {
                                swalApi.info("请选择审批人");
                                return;
                            }
                            if (node.isParent == true) {
                                return;
                            }
                            console.log(node);
                            var object = {};
                            object.username = node.name;
                            object.userid = node.userid;
                            for (var i = 0; i < $scope.data.currItem.sj_people.length; i++) {
                                if (object.userid == $scope.data.currItem.sj_people[i].userid) {
                                    swalApi.info("选择人员重复");
                                    return;
                                }
                            }
                            $scope.data.currItem.sj_people.push(node);
                        })
                    };
                }

                /*=======================================Ctrl+c/v复制粘贴 start===========================================*/
                $scope.file_list = [];
                /**
                 * 键盘操作
                 */
                $(document).on("keydown", function (e) {
                    if (event.ctrlKey == true && event.keyCode == 67) {//Ctrl+c
                        $scope.file_copy1();
                    }
                    if (event.ctrlKey == true && event.keyCode == 88) {//Ctrl+X
                        $scope.file_cut1();
                    }
                    if (event.ctrlKey == true && event.keyCode == 86) {//Ctrl+v
                        if ($scope.file_list.length > 0) {
                            if ($scope.file_list.is_cut) {
                                // $scope.cut_file(0);
                                $scope.paste_file();
                            } else {
                                // $scope.copy_file(0);
                                $scope.paste_file();
                            }
                        }
                    }
                    /*if (event.ctrlKey == true && event.keyCode == 67) {//Ctrl+c
                     $scope.file_list = [];
                     for (var i = 0; i < $scope.gridGetSelectedData('options').length; i++) {
                     if ($scope.judge_copy($scope.gridGetSelectedData('options')[i])) {
                     $scope.file_list.push($scope.gridGetSelectedData('options')[i]);
                     }
                     }
                     }
                     if (event.ctrlKey == true && event.keyCode == 88) {//Ctrl+X
                     $scope.file_list = [];
                     var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                     var node = zTree.getSelectedNodes()[0];
                     for (var i = 0; i < $scope.gridGetSelectedData('options').length; i++) {
                     if ($scope.judge_copy($scope.gridGetSelectedData('options')[i])) {
                     $scope.file_list.push($scope.gridGetSelectedData('options')[i]);
                     }
                     }
                     $scope.file_list.is_cut = true;
                     $scope.file_list.fdrid = node.fdrid;

                     }
                     if (event.ctrlKey == true && event.keyCode == 86) {//Ctrl+v
                     if ($scope.file_list.length > 0) {
                     if ($scope.file_list.is_cut) {
                     $scope.cut_file(0);
                     } else {
                     $scope.copy_file(0);
                     }

                     }

                     }
                     if (event.ctrlKey == true && event.keyCode == 79) {//Ctrl+N

                     }*/
                })

                /**
                 * 复制文件/文件夹
                 */
                $scope.file_copy1 = function (str) {
                    var row;
                    if (str == 'tree') {
                        hideRMenu();
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        row = zTree.getSelectedNodes()[0];//选中树节点数据
                    } else {
                        var FocusedNode = $scope.options.hcApi.getFocusedNode();
                        if (!FocusedNode || !FocusedNode.data) {
                            return swalApi.info("请先选择文件")
                        }
                        row = FocusedNode.data;//选中网格行数据
                    }
                    $scope.file_list = [];
                    if ($scope.judge_copy(row)) {
                        $scope.file_list.push(row);
                        console.log(row, "复制成功");
                    }
                };

                /**
                 * 剪切文件/文件夹
                 */
                $scope.file_cut1 = function (str) {
                    var row;
                    if (str == 'tree') {
                        hideRMenu();
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        row = zTree.getSelectedNodes()[0];//选中树节点数据
                    } else {
                        var FocusedNode = $scope.options.hcApi.getFocusedNode();
                        if (!FocusedNode || !FocusedNode.data) {
                            return swalApi.info("请先选择文件")
                        }
                        row = FocusedNode.data;//选中网格行数据
                    }
                    $scope.file_list = [];
                    if ($scope.judge_copy(row)) {
                        $scope.file_list.push(row);
                        console.log(row, "剪切成功");
                    }
                    $scope.file_list.is_cut = true;
                };

                /**
                 * 粘贴
                 */
                $scope.paste_file = function () {
                    if ($scope.file_list.length <= 0) {
                        return swalApi.info("请先选择文件");
                    }
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    var node = zTree.getSelectedNodes()[0];
                    var row = $scope.file_list[0];
                    if ((node.id == 0 || node.wsid) && row.docid > 0) {
                        return swalApi.info("最上级无法添加文件");//但可以添加文件夹
                    }
                    //复制/剪切到的目标路径
                    //前台没有parentid数据,通过请求返回
                    requestApi.post({
                            classId: 'scpfdr',
                            action: 'selectref',
                            data: node
                        })
                        .then(function (result) {
                            var data = {
                                parentid: result.parentid + result.fdrid + "\\",
                                parenttype: result.parenttype + "2\\",
                                wsright: result.wsright
                            };
                            //文件
                            if (row.docid > 0) {
                                data.docid = row.docid;
                                data.docname = row.docname;
                                data.rev = row.rev;
                            }
                            //文件夹
                            if (row.fdrid > 0) {
                                data.fdrid = row.fdrid;
                                data.fdrname = row.fdrname;
                                data.rev = row.rev;
                            }
                            return data;
                        })
                        .then(function (data) {
                            return requestApi.post({
                                classId: row.docid ? 'scpdoc' : 'scpfdr',
                                action: ($scope.file_list.is_cut == true ? 'cut' : 'paste'),
                                data: data
                            })
                        })
                        .then(function (result) {
                            $scope.file_list.length = 0;
                            menuShowNode();
                            swalApi.success(($scope.file_list.is_cut == true ? '剪切' : '复制') + "成功");
                        })
                        .catch(function (result) {
                            /**
                             * 重名时自动重命名
                             */
                            if (result.indexOf('重名') == -1) {
                                return;
                            }
                            var rename = "";
                            var row = $scope.file_list[0];
                            //文件
                            if (row.docid > 0) {
                                var i = row.docname.indexOf(".");
                                rename = row.docname.slice(0, i) + "(" + ($scope.file_list.is_cut == true ? '剪切' : '复制') + ")" + row.docname.slice(i);
                            }
                            //文件夹
                            if (row.fdrid > 0) {
                                rename = row.fdrname + "(" + ($scope.file_list.is_cut == true ? '剪切' : '复制') + ")";
                            }
                            $timeout(function () {
                                swalApi.confirm({
                                        title: '是否将文件重命名为"' + rename + '"',
                                    })
                                    .then(function () {
                                        row[row.docid > 0 ? 'docname' : 'fdrname'] = rename;
                                    })
                                    .then($scope.paste_file)
                            }, 100);
                        })
                };

                //旧
                $scope.copy_file = function (i, res) {
                    var docid = $scope.file_list[i].docid;
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    var node = res || zTree.getSelectedNodes()[0];
                    if (node.id == 0) {
                        swalApi.info("最上级无法加文件");
                        return;
                    }
                    BasemanService.RequestPost('scpdoc_web_rev', 'copy_to', {
                            docid: docid,
                            fdrid: node.fdrid,
                            idpath: node.idpath,
                            typepath: node.typepath
                        })
                        .then(function (data) {
                            menuShowNode();
                            //$scope.selectfdr(node);
                            if (i < $scope.file_list.length - 1) {
                                $scope.copy_file(i + 1, res);
                            } else {
                                swalApi.success("操作成功");
                            }
                            //BasemanService.notice("粘贴成功", "alert-info");
                        })
                }

                //旧
                $scope.cut_file = function (i, res) {
                    var docid = $scope.file_list[i].docid;
                    var docname = $scope.file_list[i].docname;
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    var node = res || zTree.getSelectedNodes()[0];
                    if (node.id == 0) {
                        swalApi.info("最上级无法加文件");
                        return;
                    }
                    var fdrid = $scope.file_list.fdrid;
                    BasemanService.RequestPost('scpdoc_web_rev', 'move_to', {
                            docname: docname,
                            docid: parseInt(docid),
                            move_to_fdrid: node.fdrid,
                            move_to_idpath: node.idpath,
                            move_to_typepath: node.typepath,
                            fdrid: fdrid
                        })
                        .then(function (data) {

                            if (i < $scope.file_list.length - 1) {
                                $scope.cut_file(i + 1, res);
                            } else {
                                $scope.file_list = [];
                                menuShowNode();
                                //$scope.selectfdr(node);
                            }

                        })
                }
                /*=======================================Ctrl+c/v end===========================================*/


                /*=======================================刷新树===========================================*/
                $scope.refreshTree = function () {
                    hideRMenu();
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    var node = zTree.getSelectedNodes()[0];
                    $scope.zTree.removeChildNodes(node);
                    if (node.id == 0) {
                        //根节点 删除子节点重新加载
                        $scope.getDirectory()
                    } else if (node.zAsync == false) {
                        //没有预加载过的节点 直接展开
                        $scope.zTree.expandNode(
                            node, //treeNodeJSON 需要 展开 / 折叠 的节点
                            true, //expandFlag 省略此参数，则根据对此节点的展开状态进行 toggle 切换
                            null, //sonSign = false，只影响此节点，对于其 子孙节点无任何影响。省略此参数，等同于 false
                            null, //focus = true，表示 展开 / 折叠 操作后，通过设置焦点保证此焦点进入可视区域内。省略此参数，等同于 true
                            true //callbackFlag = true 表示执行此方法时触发 beforeExpand / onExpand 或 beforeCollapse / onCollapse 事件回调函数。省略此参数，等同于 false
                        );
                    } else {
                        //预加载过的节点 删除节点重新加载
                        $scope.zTree.addNodes(node, filter_first(null, node))
                    }
                }

                /*=======================================属性===========================================*/
                /**
                 * 文件夹属性
                 */
                $scope.ftr_attr = function (str) {
                    var node = $scope.reSelect(str);
                    $scope.fdrModal
                        .open($scope.re_ModalSetting(node, '文件夹属性'))
                        .result
                        .then(function (data) {
                            console.log(data)
                        })
                    /*.then(function (data) {
                     return requestApi("scpfdr","update",data)
                     })
                     .then(function (data) {
                     swalApi.success("文件夹属性修改成功")
                     });*/
                };

                /**
                 * 文件属性
                 */
                $scope.doc_attr = function (str) {
                    var node = $scope.reSelect(str);
                    $scope.docModal
                        .open($scope.re_ModalSetting(node, '文件属性'))
                        .result
                        .then(function (data) {
                            console.log(data)
                        })
                };

                /**
                 * 文件夹/文件 属性modal配置
                 */
                $scope.re_ModalSetting = function (node, title) {
                    var ModalSetting = {
                        controller: ['$scope', function ($modalScope) {
                            $modalScope.title = title;
                            $modalScope.data = node;
                            if (title == '文件属性') {
                                $modalScope.doctypeList = [
                                    {name: '文本', value: '1'},
                                    {name: '工程图', value: '2'},
                                    {name: 'AutoCad', value: '3'},
                                    {name: 'IDeas Drafting', value: '4'},
                                    {name: 'Protel ', value: '5'},
                                    {name: '普通报表', value: '6'},
                                    {name: '分析报表', value: '7'},
                                    {name: '圈阅文件', value: '8'},
                                    {name: '其他', value: '9'}
                                ];
                                $modalScope.statList = [
                                    {name: '计划 ', value: '1'},
                                    {name: '下达 ', value: '2'},
                                    {name: '启动 ', value: '3'},
                                    {name: '执行 ', value: '4'},
                                    {name: '中止  ', value: '5'},
                                    {name: '中止 ', value: '6'},
                                    {name: '完成 ', value: '7'},
                                    {name: '归档 ', value: '8'},
                                    {name: '发布 ', value: '9'},
                                    {name: '变更  ', value: '10'},
                                    {name: '废止 ', value: '11'}
                                ];
                            }
                            $modalScope.footerRightButtons.rightTest = {
                                title: '确定',
                                click: function () {
                                    $modalScope.$close($modalScope.data)
                                }
                            };
                        }]
                    };
                    return ModalSetting;
                };

                /*=======================================返回选择节点/网格数据===========================================*/
                /**
                 * 返回选择节点/网格数据
                 * @param str tree树节点数据 else网格行数据
                 * @returns {*}
                 */
                $scope.reSelect = function (str) {
                    var data;
                    if (str == 'tree') {
                        hideRMenu();
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        data = zTree.getSelectedNodes()[0];//选中树节点数据
                    } else {
                        var FocusedNode = $scope.options.hcApi.getFocusedNode();
                        if (!FocusedNode || !FocusedNode.data) {
                            return swalApi.info("请先选择文件")
                        }
                        data = FocusedNode.data;//选中网格行数据
                    }
                    return data;
                }
            }];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.registerController({
            module: module,
            controller: compfilesController
        });
    }
);
