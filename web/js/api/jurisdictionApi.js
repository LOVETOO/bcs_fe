/**
 * 权限相关Api
 * @since 2018-10-29
 */
define(
    ['exports', 'angular', 'numberApi', 'controllerApi', 'requestApi', 'swalApi', 'base/ctrl_bill_public'],
    function (api, angular, numberApi, controllerApi, requestApi, swalApi, ctrl_bill_public) {

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

        /*rightObj = {
         all: 0,//所有完全控制
         view: 0,//浏览
         read: 0,//读取
         modify: 0,//修改
         add: 0,//新增
         delete: 0,//删除
         dir: 0,//目录列表
         export: 0,//输出
         cantransfer: 1//能否转授 1-不可转授 2-可转授
         //cantransfer是单独属性,不在objaccess内判断
         //用户有完全权限后才判断是否可以转授
         };*/


        /**
         * 树节点 右键 权限解析
         * @param treeNode
         * treeNode.objaccess 权限内容(十进制)
         * treeNode.hcIsVirtual=true 虚拟节点,只使用treeNode.objaccess进行权限判断
         */
        api.initObjRights = function (treeNode) {
            if (treeNode === undefined) {
                return console.error("treeNode属性不存在");
            }
            var rightObj = {};

            var objaccess = '00000000';
            if (treeNode.objaccess) {
                objaccess = numberApi.inttobin(treeNode.objaccess, 8);
            }
            //快捷方式权限特殊处理
            if (treeNode.reftype && treeNode.reftype == "-2") {
                var objaccess = '01100000';
            }
            //转授权限
            rightObj.cantransfer = 1;
            if ((!treeNode.reftype && treeNode.reftype != "-2") && (numberApi.toNumber(treeNode.objaccess) > 126 || userbean.isAdmins) && !treeNode.hcIsVirtual) {
                //不是别人共享的文件夹节点的时候，如果权限大于126或者是管理员，则设置所有权限位为1 并且不是虚拟节点时
                rightObj.all = 1;
                rightObj.view = 1;
                rightObj.read = 1;
                rightObj.modify = 1;
                rightObj.add = 1;
                rightObj.delete = 1;
                rightObj.dir = 1;
                rightObj.export = 1;
                //用户有完全权限后才判断是否可以转授
                rightObj.cantransfer = treeNode.cantransfer ? treeNode.cantransfer : 1;
                UserIsManager = true;
            } else if (objaccess == '00000000') {
                rightObj.all = 0;
                rightObj.view = 0;
                rightObj.read = 0;
                rightObj.modify = 0;
                rightObj.add = 0;
                rightObj.delete = 0;
                rightObj.dir = 0;
                rightObj.export = 0;
            } else {
                for (var j = 0; j <= 7; j++) {
                    var value = parseInt(objaccess.substr(j, 1) || 0);
                    if (!value || parseInt(value) != 1) {
                        value = 0;
                    }

                    if (j == 0) {
                        rightObj.all = value;
                    }
                    else if (j == 1) {
                        rightObj.view = value;
                    }
                    else if (j == 2) {
                        rightObj.read = value;
                    }
                    else if (j == 3) {
                        rightObj.modify = value;
                    }
                    else if (j == 4) {
                        rightObj.add = value;
                    }
                    else if (j == 5) {
                        rightObj.delete = value;
                    }
                    else if (j == 6) {
                        rightObj.dir = value;
                    }
                    else if (j == 7) {
                        rightObj.export = value;
                    }
                }
            }
            console.log("data.rightObj", rightObj);
            return rightObj;
        }

        /**
         * 判断是否有权限
         * @param rightNames 数组
         * @param rightNames 权限对象
         * @returns {boolean}
         */
        api.hasRight = function (rightNames, rightObj) {
            return rightNames.some(function (rightName) {
                if (rightName == 'cantransfer')
                    return rightObj[rightName] == 2;
                else
                    return rightObj[rightName] == 1;
            });
        };


        /**
         * 解析权限
         * @param objaccess 权限(十进制)
         * @param cantransfer 转授
         * @param obj assign
         * @returns {{}}
         */
        api.analysisRights = function (object) {
            var objaccess = object.objaccess;
            var cantransfer = object.cantransfer;
            var obj = object.obj;
            if (objaccess === undefined) {
                return console.error("objaccess属性不存在");
            }
            var rightObj = {};
            objaccess = numberApi.inttobin(objaccess, 8);
            //转授权限
            /*rightObj.cantransfer = 1;
            if ((numberApi.bintoint(objaccess) > 126)) {
                //不是别人共享的文件夹节点的时候，如果权限大于126，则设置所有权限位为1
                rightObj.all = 1;
                rightObj.view = 1;
                rightObj.read = 1;
                rightObj.modify = 1;
                rightObj.add = 1;
                rightObj.delete = 1;
                rightObj.dir = 1;
                rightObj.export = 1;
                //用户有完全权限后才判断是否可以转授
                rightObj.cantransfer = cantransfer ? cantransfer : 1;
            } else */if (objaccess == '00000000') {
                rightObj.all = 0;
                rightObj.view = 0;
                rightObj.read = 0;
                rightObj.modify = 0;
                rightObj.add = 0;
                rightObj.delete = 0;
                rightObj.dir = 0;
                rightObj.export = 0;
            } else {
                for (var j = 0; j <= 7; j++) {
                    var value = parseInt(objaccess.substr(j, 1) || 0);
                    if (!value || parseInt(value) != 1) {
                        value = 0;
                    }

                    if (j == 0) {
                        rightObj.all = value;
                    }
                    else if (j == 1) {
                        rightObj.view = value;
                    }
                    else if (j == 2) {
                        rightObj.read = value;
                    }
                    else if (j == 3) {
                        rightObj.modify = value;
                    }
                    else if (j == 4) {
                        rightObj.add = value;
                    }
                    else if (j == 5) {
                        rightObj.delete = value;
                    }
                    else if (j == 6) {
                        rightObj.dir = value;
                    }
                    else if (j == 7) {
                        rightObj.export = value;
                    }
                }
            }
            console.log("data.rightObj", rightObj);
            if (obj)
                Object.assign(obj, rightObj);
            return rightObj;
        };


        /**
         * 根据权限属性生成十进制objaccess
         * @param obj   (all view read modify add delete dir export)
         */
        api.createrRights = function (obj) {
            var objaccess = '' + parseInt(obj.all || 0) + parseInt(obj.view || 0) + parseInt(obj.read || 0) + parseInt(obj.modify || 0) + parseInt(obj.add || 0) + parseInt(obj.delete || 0) + parseInt(obj.dir || 0) + parseInt(obj.export || 0);
            obj.objaccess = objaccess;
            return objaccess;
        };


        /**
         * views/baseman/share.html
         * 权限控制器
         */
        api.shareController = function ($scope, $q, $modalInstance, $parent, $modal) {
            // $parent = $parent;
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
            $scope.title="权限设置";
            $scope.footerRightButtons.rightTest = {
                title: '确定',
                click: function () {
                    $scope.rightsok();
                }
            };
            $scope.footerRightButtons.close.click = function(){
                $scope.rightscancel();
            };
            $scope.search_orgname = function () {
                $scope.chooseDeptName = function (args){
                    $modal.openCommonSearch({
                        classId:'scporg',
                        postData:{},
                        action:'search',
                        title:"部门",
                        sqlWhere:'stat=2 and orgtype=5',
                        dataRelationName:'orgs',
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "部门编码",
                                    field: "dept_code"
                                },{
                                    headerName: "部门名称",
                                    field: "dept_name"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function(result){
                            $scope.data.currItem.orgid = data.orgid;
                            $scope.data.currItem.orgname = data.orgname;
                        });
                };

                /*$scope.FrmInfo = {
                    classid: "scporg",
                    backdatas: "orgs",
                    sqlBlock: "stat=2 and orgtype=5"
                };

                BasemanService.open(CommonPopController, $scope).result.then(function (data) {
                    $scope.data.currItem.orgid = data.orgid;
                    $scope.data.currItem.orgname = data.orgname;
                });*/
            }

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
                $modal.open({
                    templateUrl:"views/baseman/share_add.html",
                    controller:share_addController,
                    resolve: {
                        $parent: function () {
                            return $scope;
                        }
                    }
                }).result.then(function(data){
                    var acl_data = $scope.gridGetData('options_acl');
                    //添加用户
                    for (var i = 0; i < data.sj_people.length; i++) {
                        data.sj_people[i].receivername = data.sj_people[i].username;
                        data.sj_people[i].receiverid = data.sj_people[i].userid;
                        data.sj_people[i].myright = 1;
                        data.sj_people[i].dir = 1;//目录
                        data.sj_people[i].view = 1;//浏览
                        data.sj_people[i].read = 1;
                        data.sj_people[i].new = 0;
                        data.sj_people[i].modify = 0;
                        data.sj_people[i].delete = 0;
                        data.sj_people[i].export = 0;
                        data.sj_people[i].denied = 0;
                        data.sj_people[i].cantransfer = 1;
                        if ($parent.share_choose_data.flag == 'grid') {
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
                        data.cs_people[i].dir = 1;//目录
                        data.cs_people[i].view = 1;//浏览
                        data.cs_people[i].read = 1;
                        data.cs_people[i].new = 0;
                        data.cs_people[i].modify = 0;
                        data.cs_people[i].delete = 0;
                        data.cs_people[i].export = 0;
                        data.cs_people[i].denied = 0;
                        data.cs_people[i].cantransfer = 1;
                        data.cs_people[i].flag = 1;
                        data.cs_people[i].ismanager = 1;
                        if ($parent.share_choose_data.flag == 'grid') {
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
                });
                /*BasemanService.openFrm("views/baseman/share_add.html", share_addController, $scope, "", "").result.then(function (data) {
                    var acl_data = $scope.gridGetData('options_acl');
                    //添加用户
                    for (var i = 0; i < data.sj_people.length; i++) {
                        data.sj_people[i].receivername = data.sj_people[i].username;
                        data.sj_people[i].receiverid = data.sj_people[i].userid;
                        data.sj_people[i].myright = 1;
                        data.sj_people[i].dir = 1;//目录
                        data.sj_people[i].view = 1;//浏览
                        data.sj_people[i].read = 1;
                        data.sj_people[i].new = 0;
                        data.sj_people[i].modify = 0;
                        data.sj_people[i].delete = 0;
                        data.sj_people[i].export = 0;
                        data.sj_people[i].denied = 0;
                        data.sj_people[i].cantransfer = 1;
                        if ($parent.share_choose_data.flag == 'grid') {
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
                        data.cs_people[i].dir = 1;//目录
                        data.cs_people[i].view = 1;//浏览
                        data.cs_people[i].read = 1;
                        data.cs_people[i].new = 0;
                        data.cs_people[i].modify = 0;
                        data.cs_people[i].delete = 0;
                        data.cs_people[i].export = 0;
                        data.cs_people[i].denied = 0;
                        data.cs_people[i].cantransfer = 1;
                        data.cs_people[i].flag = 1;
                        data.cs_people[i].ismanager = 1;
                        if ($parent.share_choose_data.flag == 'grid') {
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
                })*/
            }
            //删除按钮
            $scope.del = function () {
                $scope.gridDelItem('options_acl');
            }
            //双击修改机构和用户的权限
            $scope.rowDoubleClick_az = function (e) {
                $scope.flag = 1;
                e.data.UserIsManager = $scope.data.UserIsManager;
                $scope.data = e.data;
                $modal.open({
                    templateUrl:"views/baseman/share_detail.html",
                    controller:share_detailController,
                    scope:$scope,
                    resolve: {
                        $parent: function () {
                            return $scope;
                        }
                    }
                }).result.then(function(res){
                    console.log(111,res);
                    for (name in res) {
                        $scope.data[name] = res[name];
                    }
                    var objaccess = '' + parseInt($scope.data.all || 0) + parseInt($scope.data.view || 0) + parseInt($scope.data.read || 0) + parseInt($scope.data.modify || 0) + parseInt($scope.data.add || 0) + parseInt($scope.data.delete || 0) + parseInt($scope.data.dir || 0) + parseInt($scope.data.export || 0);
                    $scope.data.objaccess = objaccess;//numberApi.bintoint(objaccess);
                    $scope.options_acl.api.refreshView();
                });
                /*BasemanService.openFrm("views/baseman/share_detail.html", share_detailController, $scope, "", "").result.then(function (res) {
                    for (name in res) {
                        $scope.data[name] = res[name];
                    }
                    var objaccess = '' + parseInt($scope.data.all || 0) + parseInt($scope.data.view || 0) + parseInt($scope.data.read || 0) + parseInt($scope.data.modify || 0) + parseInt($scope.data.add || 0) + parseInt($scope.data.delete || 0) + parseInt($scope.data.dir || 0) + parseInt($scope.data.export || 0);
                    $scope.data.objaccess = objaccess;//numberApi.bintoint(objaccess);
                    $scope.options_acl.api.refreshView();
                })*/
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
                hcReady: $q.deferPromise(),
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
            $scope.checkUserIsManager = function (treeNode) {
                $scope.data.UserIsManager = false;
                if (window.userbean.isAdmins || (treeNode.creator && treeNode.creator == userbean.userid)) {
                    $scope.data.UserIsManager = true;
                }
            }

            $scope.clearinformation = function () {
                var node = null;
                if ($parent.share_choose_data.flag == 'grid') {
                    node = $parent.gridGetRow('options');
                } else {
                    var zTree = $parent.treeSetting.zTreeObj;
                    node = $parent.share_choose_data.node.data;
                }
                requestApi.post('scpobjright', 'select', {
                    idpath: node.idpath,
                    typepath: node.typepath
                })
                    .then(function (data) {
                        //初始化管理权限
                        $scope.checkUserIsManager(node);
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
                        $scope.options_acl.hcReady.then(function () {
                            $scope.options_acl.api.setRowData(data.objrights);
                        });
                        $scope.$applyAsync();
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
                    //BasemanService.notice(msg);
                    swalApi.info(msg);
                    return false;
                }
                return true;

            }

            $scope.initdata();

            /*==================复制share_detail里的东西出来 end===============*/

            /**
             * 添加机构和用户 控制器
             */
            var share_addController = function ($scope, $timeout, $modalInstance, $parent,$q) {
                // $parent= $parent;
                $scope.data={};
                $scope.data.currItem = {};
                $scope.title="添加机构和用户";
                $scope.footerRightButtons.rightTest = {
                    title: '确定',
                    click: function (e) {
                        $modalInstance.close($scope.data.currItem);
                    }//$scope.cancel
                };
                $scope.footerRightButtons.close.click = function(){
                    $modalInstance.dismiss('cancel');
                };
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
                requestApi.post("scpemail_contact_list", "search", {
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
                    // var obj = RequestPostNoWait('scpemail_contact_list', 'search', postdata)
                    // var children = obj.data.scporgs;
                    var children = requestApi.syncPost('scpemail_contact_list', 'search', postdata).scporgs;
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

            /**
             * 修改权限控制器
             */
            var share_detailController = function ($scope, $timeout, $modalInstance, $parent) {
                // $parent = $parent;
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
                    $modal.openCommonSearch({
                        classId:'scporg',
                        postData:{},
                        action:'search',
                        title:"部门",
                        sqlWhere:"stat=2 and orgtype=5",
                        dataRelationName:'orgs',
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "部门编码",
                                    field: "dept_code"
                                },{
                                    headerName: "部门名称",
                                    field: "dept_name"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function(data){
                            $scope.data.currItem.orgid = data.orgid;
                            $scope.data.currItem.orgname = data.orgname;
                        });
                }

                    /*$scope.FrmInfo = {
                        classid: "scporg",
                        backdatas: "orgs",
                        sqlBlock: "stat=2 and orgtype=5"
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (data) {
                        $scope.data.currItem.orgid = data.orgid;
                        $scope.data.currItem.orgname = data.orgname;
                    });*/
                $scope.clearinformation = function () {
                    $scope.data = {bReadOnly: true};
                    $scope.data.currItem = {};
                    if ($parent.flag == 1) {
                        //复制父控制器的数据到当前控制器对象
                        for (name in $parent.data) {
                            $scope.data.currItem[name] = $parent.data[name];
                            if ($parent.data.targettype == 1) {
                                $scope.data.currItem.orgname = $parent.data.receivername;
                            } else {
                                $scope.data.currItem.username = $parent.data.receivername;
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
                    $scope.chooseDeptName = function (args){
                        $modal.openCommonSearch({
                            classId:'scpuser',
                            postData:{},
                            action:'search',
                            title:"用户",
                            dataRelationName:'scpusers',
                            sqlWhere:"1=1 ",
                            gridOptions:{
                                columnDefs:[
                                    {
                                        field: "username",
                                        headerName: "名称"
                                    },
                                    {
                                        field: "userid",
                                        headerName: "账号"
                                    },
                                    {
                                        field: "namepath",
                                        headerName: "所属机构"
                                    }
                                ]
                            }
                        })
                            .result//响应数据
                            .then(function(data){
                                $scope.data.currItem.sysuserid = data.sysuserid;
                                $scope.data.currItem.username = data.username;
                            });
                    };
                    /*$scope.FrmInfo = {
                        classid: "scpuser",
                        backdatas: "scpusers",
                        sqlBlock: "1=1 "
                    };

                    BasemanService.open(CommonPopController, $scope).result.then(function (data) {
                        $scope.data.currItem.sysuserid = data.sysuserid;
                        $scope.data.currItem.username = data.username;

                    });*/
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
            };
        };

        /**
         * 权限确定后数据操作
         */
        api.shareControllerOk = function (data, flag, $scope) {
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
            //文件权限
            if (flag == 'grid') {
                //上级人员取出
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                var node = $scope.zTree.getSelectedNodes()[0];
                requestApi.post('scpobjright', 'select', {
                    idpath: node.idpath,
                    typepath: node.typepath
                }).then(function (res) {
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
                    requestApi.post('scpobjright', 'update', {
                        objrights: data,
                        typepath: node.typepath,
                        idpath: node.idpath
                    }).then(function (data) {
                        swalApi.success('权限设置成功');
                    })
                })
            } else {
                var node = $scope.share_choose_data.node.data;
                requestApi.post('scpobjright', 'update', {
                    objrights: data,
                    typepath: node.typepath,
                    idpath: node.idpath
                })
                    .then(function (data) {
                        swalApi.success('权限设置成功');
                    })
            }
        }
        /**
         * 打开权限模态框
         */
        api.openshare = function (flag,$scope) {
            '$modal'.asAngularService.open({
                templateUrl:"views/baseman/share.html",
                controller:api.shareController,
                size: 'md',
                resolve: {
                    $parent: function () {
                        return $scope;
                    }
                }
            }).result.then(function(data){
                api.shareControllerOk(data, flag,$scope)
            })
        }
    }
);