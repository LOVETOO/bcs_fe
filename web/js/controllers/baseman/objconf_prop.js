/**
 * 对象配置属性页 - 对象属性页
 * @since 2018-10-02
 * 2018-12-12 modify by qch
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'summernote','xss', 'gridApi','directive/hcRichText', 'directive/hcModal'],
    function (module, controllerApi, base_obj_prop, summernote,xss, gridApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q', '$modal',
            //控制器函数
            function ($scope, $q, $modal) {
                
                /*-------------------数据定义------------------------*/
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                //隐藏标签页
                // $scope.tabs.base.hide = true;
                // $scope.tabs.wf.hide = true;
                // $scope.tabs.attach.hide = true;
                $scope.data.noteOption={
                    minHeight:230
                }

                $scope.tabs = angular.extend($scope.tabs, {
                    base: {
                        title: "常规",
                        active: true
                    },
                    field: {
                        title: '字段配置'
					},
					workflow: {
						title: "工作流配置"
					},
					attachType: {
						title: '附件类型'
					},
					projAttachRel: {
						title: '项目附件关联'
					},
                    rightRule: {
                        title: '权限规则'
                    },
                    accessSettings: {
                        title: '访问设置'
                    },
                    diyOpinion: {
                        title: '自定义意见'
                    },
                    printtemplate: { title: "打印模板配置" },
                    wf: { hide: true },
                    attach: { hide: true }
                });


                /*-------------------网格定义------------------------*/
                $scope.fieldOption = {
                    columnDefs: [
                        {
                            type: '序号',
                            width: 65
                        },
                        {
                            field: 'field_name',
                            headerName: '字段名称',
                            editable: true,
                            width: 105
                        },
                        {
                            field: 'field_type',
                            headerName: '字段类型',
                            editable: true,
                            hcDictCode: 'field_type',
                            width: 105
                        },
                        {
                            field: 'tooltip',
                            headerName: '工具提示',
                            width: 105,
                            onCellDoubleClicked: function (args) {
                                $scope.openModel(args);
                            },
                        }
                    ]
				}
				
				$scope.attachTypeGridOptions = {
					defaultColDef: {
						editable: true
					},
					columnDefs: [
						{
							type: '序号'
						},
						{
							field: 'attach_type',
							headerName: '附件类型'
						},
						{
							field: 'suffix',
							headerName: '附件后缀'
						},
						{
							field: 'at_least',
							headerName: '至少需要附件数量'
						},
						{
							field: 'note',
							headerName: '说明'
						}
					]
				};

				$scope.projAttachRelGridOptions = {
					columnDefs: [
						{
							type: '序号'
						},
						{
							field: 'rel_obj_type',
							headerName: '关联对象类型ID'
						},
						{
							field: 'rel_obj_type_name',
							headerName: '关联对象类型名称'
						},
						{
							field: 'target_type_name',
							headerName: '关联目标类型'
						},
						{
							field: 'target_code',
							headerName: '关联目标编码'
						},
						{
							field: 'target_name',
							headerName: '关联目标名称'
						}
					]
				};

                $scope.wfTempGridOptions = {
                    columnDefs: [
                        {
                            type: '序号',
                            width: 65
                        }
                        , {
                            field: 'wftempname',
                            headerName: '工作流模板名称',
                            onCellDoubleClicked: function (args) {
                                $scope.chooseCpcwftemp(args);
                            },
                            width: 144
                        }
                        , {
                            field: 'isdefault',
                            headerName: '缺省',
                            type: '是否',
                            editable: true,
                            width: 79,
                            onCellValueChanged:function(args){
                                $scope.data.currItem.objwftempofobjconfs.forEach(function(cur){
                                    cur.isdefault = 1;
                                });
                                $scope.wfTempGridOptions.hcApi.setRowData($scope.data.currItem.objwftempofobjconfs);
                                args.data.isdefault = 2;
                                args.api.refreshView();
                            }
                        }
                        , {
                            field: 'execcond',
                            headerName: '执行条件',
                            editable: true,
                            width: 105
                        }
                        , {
                            field: 'note',
                            headerName: '备注',
                            editable: true,
                            width: 65
                        }
                    ]
                };


                $scope.printGridOptions = {
                    columnDefs: [
                        {
                            type: '序号',
                            width: 65
                        }
                        , {
                            field: 'rptname',
                            headerName: '打印模板名称',
                            editable: true,
                            width: 144
                        }
                        , {
                            field: 'isdefault',
                            headerName: '缺省',
                            type: '是否',
                            editable: true,
                            width: 79
                        }
                        , {
                            field: 'execcond',
                            headerName: '执行条件',
                            editable: true,
                            width: 105
                        },
                        // {
                        //     field: 'express',
                        //     headerName: '表达式',
                        //     editable: true,
                        //     width: 105
                        // },
                        {
                            field: 'tempurl',
                            headerName: '打印模板路径',
                            editable: true,
                            width: 105
                        },
                        {
                            field: 'is_printnum_control',
                            headerName: '受打印次数控制',
                            type: '是否',
                            editable: true,
                            width: 105
                        },
                        {
                            field: 'print_password',
                            headerName: '打印密码',
                            editable: true,
                            width: 105
                        }
                        , {
                            field: 'note',
                            headerName: '备注',
                            editable: true,
                            width: 65
                        }
                    ]
                };

                /**
                 * 访问设置
                 */
                $scope.accessObjConfigSet = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'action',
                        hide: true
                    }, {
                        field: 'action_name',
                        headerName: '行为'
                    }, {
                        field: 'roleid',
                        headerName: '角色ID',
                        hide: true
                    }, {
                        field: 'rolename',
                        headerName: '角色',
                        onCellDoubleClicked: function (args) {
                            $scope.openAccessSettingsmodal(args, "roleid");
                        },
                        valueFormatter: function (params) {
                            return $scope.valueFormatterMethod(params, "roleid");
                        }

                    }, {
                        field: 'userid',
                        headerName: '用户ID',
                        hide: true
                    }, {
                        field: 'username',
                        headerName: '用户',
                        onCellDoubleClicked: function (args) {
                            $scope.openAccessSettingsmodal(args, "userid");
                        },
                        valueFormatter: function (params) {
                            return $scope.valueFormatterMethod(params, "userid");
                        }
                    }, {
                        field: 'orgid',
                        headerName: '机构ID',
                        hide: true
                    }, {
                        field: 'orgname',
                        headerName: '机构',
                        onCellDoubleClicked: function (args) {
                            $scope.openAccessSettingsmodal(args, "orgid");
                        },
                        valueFormatter: function (params) {
                            return $scope.valueFormatterMethod(params, "orgid");
                        }
                    }],
                    //定义表格增减行按钮
                    hcButtons: {
                        accessAdd: {
                            icon: 'iconfont hc-add',
                            click: function () {
                                $scope.addAccessObj && $scope.addAccessObj();
                            },
                            hide : function () {
                                return $scope.isFormReadonly() || !$scope.form.editing
                            }
                        },
                        accessDel: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                $scope.delAccessObj && $scope.delAccessObj();
                            },
                            hide : function () {
                                return $scope.isFormReadonly() || !$scope.form.editing
                            }
                        }
                    }
                };

                /**
                 * 统一格式
                 */
                $scope.valueFormatterMethod = function (params, id) {
                    var name = {
                        orgid : '机构',
                        userid : '用户',
                        roleid :'角色'
                    }
                    if(params.data[id] != undefined && params.data[id].length > 0){
                        if(params.data[id][0] == "-"){
                            return '以下' + name[id] + '排除：' + params.value;
                        }else{
                            return '允许以下'+ name[id] + '：' + params.value;
                        }
                    }else{
                        return params.value;
                    }
                }

                /**
                 * 打开访问设置模态框
                 */
                $scope.openAccessSettingsmodal = function (args, ID) {
                    $scope.accessSettingsModel.open({//打开模态框
                        resolve: {
                            before_line: args.data,
                            gridApi : gridApi
                        },
                        controller: ['$scope', '$q', 'before_line', 'gridApi',
                            function ($modalScope, $q, before_line, gridApi) {
                                //获取数据
                                $modalScope.before_line = before_line;
                                /*=====================参数配置=====================*/
                                var accessSettingProj = {
                                    roleid : {//角色配置
                                        patternArr : [{name:'包含以下角色',value:'1'},{name:'排除以下角色',value:'2'}],
                                        title : "角色设置",
                                        id : 'roleid',
                                        name : 'rolename',
                                        idField : '角色ID',
                                        nameField : '角色',
                                        classId: 'scprole',
                                        sqlWhere:'',
                                        postData : function () {
                                            return {
                                                entid : userbean.entid,
                                                roles : $modalScope.accessSets
                                            }
                                        }
                                    },
                                    userid : {//用户配置
                                        patternArr : [{name:'包含以下用户',value:'1'},{name:'排除以下用户',value:'2'}],
                                        title : "用户设置",
                                        id : 'userid',
                                        name : 'username',
                                        idField : '用户ID',
                                        nameField : '用户',
                                        classId: 'scpuser',
                                        sqlWhere:' actived = 2 ',
                                        postData : function () {
                                            return {
                                                users : $modalScope.accessSets
                                            }
                                        }
                                    },
                                    orgid : {//机构配置
                                        patternArr : [{name:'包含以下机构',value:'1'},{name:'排除以下机构',value:'2'}],
                                        title : "机构设置",
                                        id : 'orgid',
                                        name : 'orgname',
                                        idField : '机构ID',
                                        nameField : '机构',
                                        classId: 'scporg',
                                        sqlWhere:' stat = 2 ',
                                        postData : function () {
                                            return {
                                                orgs : $modalScope.accessSets
                                            }
                                        }
                                    }
                                }
                                /*==========================================================*/
                                $modalScope.before_line.patternArr = accessSettingProj[ID].patternArr;
                                $modalScope.title = accessSettingProj[ID].title;
                                $modalScope.gridOptionAccessSet = {
                                    columnDefs: [
                                        {
                                            type: '序号'
                                        },
                                        {
                                            field: accessSettingProj[ID].id,
                                            headerName: accessSettingProj[ID].idField
                                        },
                                        {
                                            field: accessSettingProj[ID].name,
                                            headerName: accessSettingProj[ID].nameField
                                        }
                                    ],
                                    //定义表格增减行按钮
                                    hcButtons: {
                                        businessAdd: {
                                            icon: 'iconfont hc-add',
                                            click: function () {
                                                $modal.openCommonSearch({
                                                    classId: accessSettingProj[ID].classId,
                                                    sqlWhere: accessSettingProj[ID].sqlWhere,
                                                    title: accessSettingProj[ID].nameField,
                                                    checkbox: true,
                                                    postData: accessSettingProj[ID].postData
                                                })
                                                .result
                                                .then(function (data) {
                                                    data.forEach(function (value) {
                                                        $modalScope.accessSets.push({
                                                            [accessSettingProj[ID].id] : value[accessSettingProj[ID].id],
                                                            [accessSettingProj[ID].name] : value[accessSettingProj[ID].name]
                                                        });
                                                    });
                                                    //设置数据
                                                    $modalScope.gridOptionAccessSet.hcApi.setRowData(
                                                        $modalScope.accessSets);
                                                });
                                            }
                                        },
                                        invoiceDel: {
                                            icon: 'iconfont hc-reduce',
                                            click: function () {
                                                var idx = $modalScope.gridOptionAccessSet.hcApi
                                                    .getFocusedRowIndex();
                                                if (idx < 0) {
                                                    swalApi.info('请选中要删除的行');
                                                } else {
                                                    $modalScope.accessSets.splice(idx, 1);
                                                    $modalScope.gridOptionAccessSet.hcApi.setRowData(
                                                        $modalScope.accessSets);
                                                }
                                            }
                                        }
                                    }
                                };
                                //定义数组
                                $modalScope.accessSets = [];
                                gridApi.execute($modalScope.gridOptionAccessSet, function () {
                                    //赋值操作模式
                                    if($modalScope.before_line[accessSettingProj[ID].id] != undefined && $modalScope.before_line[accessSettingProj[ID].id].length > 0){
                                        if($modalScope.before_line[accessSettingProj[ID].id][0] == "-"){
                                            $modalScope.before_line.is_contain = 2;
                                        }else{
                                            $modalScope.before_line.is_contain = 1;
                                        }
                                        //截取拆分字符串
                                        $modalScope.before_line[accessSettingProj[ID].id] = $modalScope.before_line[accessSettingProj[ID].id].substr(1);
                                        var accessidArr = $modalScope.before_line[accessSettingProj[ID].id].split(',');
                                        var accessnameArr = $modalScope.before_line[accessSettingProj[ID].name].split(',');
                                        accessidArr.forEach(function(value, index){
                                            $modalScope.accessSets.push({
                                                [accessSettingProj[ID].id] : value,
                                                [accessSettingProj[ID].name] : accessnameArr[index]
                                            });
                                        });
                                    }else{
                                        $modalScope.before_line.is_contain = 1;
                                    }
                                    //设置数据
                                    $modalScope.gridOptionAccessSet.hcApi.setRowData(
                                        $modalScope.accessSets);
                                });
                                angular.extend($modalScope.footerRightButtons, {
                                    ok: {
                                        title: '确定',
                                        click: function () {
                                            return $q
                                                .when()
                                                .then(function () {
                                                    //判断模式
                                                    if ($modalScope.before_line.is_contain == 1){
                                                        args.data[accessSettingProj[ID].id] = "+";
                                                        args.data[accessSettingProj[ID].name] = "";
                                                    }else if($modalScope.before_line.is_contain == 2){
                                                        args.data[accessSettingProj[ID].id] = "-";
                                                        args.data[accessSettingProj[ID].name] = "";
                                                    }else{
                                                        swalApi.error('请选择模式');
                                                        return false;
                                                    }
                                                    //拼接字符串
                                                    if($modalScope.accessSets.length > 0){
                                                        $modalScope.accessSets.forEach(function (value, index){
                                                            if (index == 0){
                                                                args.data[accessSettingProj[ID].id] += value[[accessSettingProj[ID].id]];
                                                                args.data[accessSettingProj[ID].name] += value[accessSettingProj[ID].name];
                                                            }else{
                                                                args.data[accessSettingProj[ID].id] += "," + value[[accessSettingProj[ID].id]];
                                                                args.data[accessSettingProj[ID].name] += "," + value[accessSettingProj[ID].name];
                                                            }
                                                        });
                                                    }else{
                                                        args.data[accessSettingProj[ID].id] = "";
                                                        args.data[accessSettingProj[ID].name] = "";
                                                    }
                                                    $scope.accessObjConfigSet.api.refreshCells({
                                                        rowNodes: [args.node],
                                                        force: true,//改变了值才进行刷新
                                                        columns: $scope.accessObjConfigSet.columnApi.getColumns([accessSettingProj[ID].id
                                                            ,accessSettingProj[ID].name])
                                                    });
                                                    return true;
                                                })
                                                .then(function (isExecute) {
                                                    if(isExecute){//关闭窗口
                                                        $modalScope.$close();
                                                    }
                                                });
                                        }
                                    }
                                });
                            }]
                    })
                }

                /*-------------------通用查询------------------------*/
                /**
                 * 流程模板查询
                 */
                $scope.chooseCpcwftemp = function (params) {
					$modal
						.openCommonSearch({
							classId: 'scpwftemp'
						})
						.result
						.then(function (wfTemp) {
							params.data.wftempid = wfTemp.wftempid;
							params.data.wftempname = wfTemp.wftempname;
							
							params.api.refreshCells({
								rowNodes: [params.node]
							});
						});
                };

                /*---------------------事件------------------------*/
                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                };

                /**
                 * 新增单据时数据处理
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    $scope.summerInit(bizData);
					$scope.fieldOption.hcApi.setRowData(bizData.objfields = []);
					$scope.attachTypeGridOptions.hcApi.setRowData(bizData.attach_types = []);
					$scope.projAttachRelGridOptions.hcApi.setRowData(bizData.proj_attach_rels = []);
                    $scope.wfTempGridOptions.hcApi.setRowData(bizData.objwftempofobjconfs = []);
                    $scope.rightRuleGridOptions.hcApi.setRowData(bizData.obj_right_rules = []);
                    $scope.diyOpinionGridOptions.hcApi.setRowData(bizData.obj_diy_opinions = []);
                    $scope.printGridOptions.hcApi.setRowData(bizData.objrptconfofobjconfs = []);
                    $scope.accessObjConfigSet.hcApi.setRowData(bizData.obj_actions = []);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    //$scope.summerInit(bizData);
					$scope.fieldOption.hcApi.setRowData(bizData.objfields);
					$scope.attachTypeGridOptions.hcApi.setRowData(bizData.attach_types);
					//$scope.projAttachRelGridOptions.hcApi.setRowData(bizData.proj_attach_rels);
					setProjAttachRel($scope.data.currItem.proj_attach_rels);
                    $scope.wfTempGridOptions.hcApi.setRowData(bizData.objwftempofobjconfs);
                    $scope.rightRuleGridOptions.hcApi.setRowData(bizData.obj_right_rules);
                    $scope.diyOpinionGridOptions.hcApi.setRowData(bizData.obj_diy_opinions);
                    $scope.printGridOptions.hcApi.setRowData(bizData.objrptconfofobjconfs);
                    $scope.accessObjConfigSet.hcApi.setRowData(bizData.obj_actions);
                };
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    //保存工具提示内容
                    //bizData.tooltip = $("div.note-editable").html();

                }
                //保存前验证
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    console.log($scope.data.currItem.objfields);
                    $scope.data.currItem.objfields.map((item) => {
                        if (!item.field_name) {
                            invalidBox.push('字段配置第' + item.seq + '行字段名称不能为空');
                        }
                    })
                }

                /**
                 * 初始化富文本
                 */
                /*$scope.option= {
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
                    }
                };*/
                $scope.summerInit = function (bizData) {
                    //初始化富文本
                    /*$('.note-editing-area').keydown(function (event) {
                        event.stopPropagation();
                        console.warn(event);
                    });
                    $('#contents').summernote({
                        minHeight: 200,
                        lang: 'zh-CN',
                        fontNames: ["微软雅黑", "华文细黑", 'Arial', 'sans-serif', "宋体", "Times New Roman", 'Times', 'serif', "华文细黑", 'Courier New', 'Courier', '华文仿宋', 'Georgia', "Times New Roman", 'Times', "黑体", 'Verdana', 'sans-seri', "方正姚体", 'Geneva', 'Arial', 'Helvetica', 'sans-serif'],
                    });
                    //xss过滤正文内容
                    var html = xss(bizData.tooltip, $scope.option);
                    $("div.note-editable").html(html);*/
                }

                /**
                 * 打开模态框
                 */
                $scope.openModel = function (args) {
                    console.log(args)
                    if (!args.value) {
                        args.value = ''
                    }
                    top.require(['summernote','directive/hcRichText'], function () {
                        $scope.tooltipModal.open({
                            controller: ['$scope', function ($modalScope) {
                                $modalScope.data={};
                                $modalScope.data.noteOption = {
                                    minHeight:300
                                };
                                $modalScope.data.tooltip = args.value;
                                $modalScope.title = "工具提示";
                                $modalScope.footerRightButtons.rightTest = {
                                    title: '确定',
                                    click: function () {
                                        //var html = top.$("div.note-editable").html()
                                        args.api.hcApi.setCellValue(args.node, args.column, $modalScope.data.tooltip);
                                        $modalScope.$close();
                                    }
                                };
                            }]
                        });   
                    });
                    
                }

                /**
                 * 新增行，访问设置
                 */
                $scope.addAccessObj = function (){
                    $modal.openCommonSearch({
                        classId:'scp_action',
                        checkbox : true,
                        postData : function () {
                            return {
                                access_configurable : 2,
                                scp_actions: $scope.data.currItem.obj_actions
                            }
                        }
                    })
                        .result//响应数据
                        .then(function(result){
                            result.forEach(function(value){
                                $scope.data.currItem.obj_actions.push({
                                    action : value.action,
                                    action_name : value.action_name
                                });
                            });
                            $scope.accessObjConfigSet.hcApi.setRowData($scope.data.currItem.obj_actions);
                        });
                }

                /**
                 * 删除，访问设置
                 */
                $scope.delAccessObj = function (){
                    var idx = $scope.accessObjConfigSet.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.obj_actions.splice(idx, 1);
                        $scope.accessObjConfigSet.hcApi.setRowData($scope.data.currItem.obj_actions);
                    }
                }

                /**
                 * 增加行
                 */
                $scope.add_line = function () {
                    $scope.wfTempGridOptions.api.stopEditing();
                    var line = {};
                    $scope.data.currItem.objwftempofobjconfs.push(line);
                    $scope.wfTempGridOptions.hcApi.setRowData($scope.data.currItem.objwftempofobjconfs);
                };

                /**
                 * 增加打印模板行
                 */
                $scope.add_line_print = function () {
                    $scope.printGridOptions.api.stopEditing();
                    var line = {};
                    $scope.data.currItem.objrptconfofobjconfs.push(line);
                    $scope.printGridOptions.hcApi.setRowData($scope.data.currItem.objrptconfofobjconfs);
                };

                /**
                 * 删除行
                 */
                $scope.del_line_print = function () {
                    var idx = $scope.printGridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.objrptconfofobjconfs.splice(idx, 1);
                        $scope.printGridOptions.hcApi.setRowData($scope.data.currItem.objrptconfofobjconfs);
                    }
                };

                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.wfTempGridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.objwftempofobjconfs.splice(idx, 1);
                        $scope.wfTempGridOptions.hcApi.setRowData($scope.data.currItem.objwftempofobjconfs);
                    }
                };


                /*-------------------底部左边按钮------------------------*/
                Object.defineProperty($scope.data, 'currGridModel', {
                    get: function () {
                        if ($scope.tabs.workflow.active)
                            return 'data.currItem.objwftempofobjconfs';
                        else if ($scope.tabs.rightRule.active)
                            return 'data.currItem.obj_right_rules';
                        else if ($scope.tabs.diyOpinion.active)
                            return 'data.currItem.obj_diy_opinions';
                        else if ($scope.tabs.printtemplate.active)
                            return 'data.currItem.objrptconfofobjconfs';
                        else if ($scope.tabs.field.active)
							return 'data.currItem.objfields';
						else if ($scope.tabs.attachType.active)
							return 'data.currItem.attach_types';
						else if ($scope.tabs.projAttachRel.active)
							return 'data.currItem.proj_attach_rels';
                    }
                });

                Object.defineProperty($scope.data, 'currGridOptions', {
                    get: function () {
                        if ($scope.tabs.workflow.active)
                            return $scope.wfTempGridOptions;
                        else if ($scope.tabs.rightRule.active)
                            return $scope.rightRuleGridOptions;
                        else if ($scope.tabs.diyOpinion.active)
                            return $scope.diyOpinionGridOptions;
                        else if ($scope.tabs.printtemplate.active)
                            return $scope.printGridOptions;
                        else if ($scope.tabs.field.active)
							return $scope.fieldOption;
						else if ($scope.tabs.attachType.active)
							return $scope.attachTypeGridOptions;
						else if ($scope.tabs.projAttachRel.active)
							return $scope.projAttachRelGridOptions;
                    }
				});
				
				$scope.isMoveRowDisabled = function () {
					return $scope.tabs.projAttachRel.active;
				};

				(function (addRow) {
					$scope.footerLeftButtons.addRow.click = function () {
						if ($scope.tabs.projAttachRel.active) {
							var relObjConf, targetObjConf;

							$q
								.when()
								.then(function () {
									return $modal
										.openCommonSearch({
											title: '请选择要关联的对象类型',
											classId: 'scpobjconf',
											sqlWhere: 'objtypeid <> ' + ($scope.data.currItem.objtypeid || 0)
										})
										.result;
								})
								.then(function () {
									relObjConf = arguments[0];
								
									return $modal
										.openCommonSearch({
											title: '请选择要关联的目标类型',
											classId: 'scpobjconf',
											sqlWhere: 'objtypeid in (13, 14)'
										})
										.result;
								})
								.then(function () {
									targetObjConf = arguments[0];

									return $modal
										.openCommonSearch({
											title: '请选择要关联的' + targetObjConf.objtypename,
											classId: targetObjConf.tablename,
											checkbox: true
										})
										.result;
								})
								.then(function (targets) {
									var rels = targets.map(function (target) {
										return {
											rel_obj_type: relObjConf.objtypeid,
											rel_obj_type_name: relObjConf.objtypename,
											target_type: targetObjConf.objtypeid,
											target_type_name: targetObjConf.objtypename,
											target_id: target[targetObjConf.pkfield],
											target_code: target[targetObjConf.codefield],
											target_name: target[targetObjConf.namefield]
										};
									});

									var oldRels = $scope.projAttachRelGridOptions.hcApi.getRowData().filter(function (data) {
										return data.rel_obj_type == relObjConf.objtypeid && data.target_type == targetObjConf.objtypeid;
									});

									rels = rels.filter(function (rel) {
										return oldRels.every(function (oldRel) {
											return rel.target_id != oldRel.target_id;
										});
									});

									if (rels.length) {
										Array.prototype.push.apply($scope.data.currItem.proj_attach_rels, rels);

										setProjAttachRel($scope.data.currItem.proj_attach_rels, rels[0]);
									}
								});
						}
						else {
							return addRow.apply(this, arguments);
						}
					};
				})($scope.footerLeftButtons.addRow.click);

				(function (deleteRow) {
					$scope.footerLeftButtons.deleteRow.click = function () {
						var result = deleteRow.apply(this, arguments);

						if ($scope.tabs.projAttachRel.active) {
							setProjAttachRel($scope.data.currItem.proj_attach_rels);
						}

						return result;
					};
				})($scope.footerLeftButtons.deleteRow.click);

				function setProjAttachRel(rels, focusRel) {
					var relObjTypes = {};

					rels.forEach(function (rel) {
						var relObjType = relObjTypes[rel.rel_obj_type];

						if (!relObjType) {
							relObjTypes[rel.rel_obj_type] = relObjType = {
								users: [],
								roles: []
							};
						}

						relObjType[rel.target_type == 13 ? 'users' : 'roles'].push(rel);
					});

					rels.splice(0, rels.length);

					angular.forEach(relObjTypes, function (relObjType) {

						relObjType.users.forEach(function (rel) {
							rels.push(rel);
						});

						relObjType.roles.forEach(function (rel) {
							rels.push(rel);
						});
					});

					$scope.projAttachRelGridOptions.hcApi.setRowData(rels);

					if (focusRel) {
						var focusRowIndex = rels.indexOf(focusRel);

						if (focusRowIndex >= 0) {
							$scope.projAttachRelGridOptions.hcApi.setFocusedCell(focusRowIndex);
						}
					}

					return rels;
				}

                /**
                 * 增加行
                 */
                /* $scope.footerLeftButtons.add_line = {
                    title: '增加行',
                    click: function () {
                        if ($scope.tabs.printtemplate.active) {
                            return $scope.add_line_print();
                        }
                        $scope.add_line && $scope.add_line();
                    }
                }; */

                /**
                 * 删除行
                 */
                /* $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function () {
                        if ($scope.tabs.printtemplate.active) {
                            return $scope.del_line_print();
                        }
                        $scope.del_line && $scope.del_line();
                    }
                }; */

                /**
                 * 权限规则
                 */
                $scope.rightRuleGridOptions = {
                    defaultColDef: {
                        editable: true
                    },
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'wftempnames',
                        headerName: '流程模板(可多值)，不填或填0认为是制单状态',
                        onCellDoubleClicked: function (params) {
                            $modal
                                .openCommonSearch({
                                    classId: 'scpwftemp',
                                    checkbox: true
                                })
                                .result
                                .then(function (wfTemps) {
                                    params.api.stopEditing();
                                    if(params.node.data.wftempids){
                                        var wfTempIds = params.node.data.wftempids.split(',');
                                        wfTemps.forEach(function(value){
                                            if (wfTempIds.indexOf(value.wftempid) < 0) {
                                                params.node.data.wftempids += "," + value.wftempid;
                                                params.node.data.wftempnames += "," + value.wftempname;
                                            }
                                        });
                                    }else{
                                        //选中的模板id
                                        var newWfTempIds = wfTemps.map(function (wfTemp) {
                                            return wfTemp.wftempid + '';
                                        });
                                        //选中的模板名称
                                        var newWfTempNames = wfTemps.map(function (wfTemp) {
                                            return wfTemp.wftempname + '';
                                        });
                                        params.node.data.wftempids = newWfTempIds.join(',');
                                        params.node.data.wftempnames = newWfTempNames.join(',');
                                    }
                                    $scope.rightRuleGridOptions.api.refreshCells({
                                        rowNodes: [params.node],
                                        force: true,//改变了值才进行刷新
                                        columns: $scope.rightRuleGridOptions.columnApi.getColumns(['wftempids','wftempnames'])
                                    });
                                });
                        }
                    }, {
                        field: 'procids',
                        headerName: '流程节点(可多值)'
                    }, {
                        field: 'fields',
                        headerName: '涉及字段(可多值)'
                    }, {
                        field: 'grids',
                        headerName: '涉及表格(可多值、JSON)'
                    }, {
                        field: 'readonly',
                        headerName: '可编辑性',
                        type: '词汇',
                        cellEditorParams: {
                            names: ['/', '可编辑', '只读'],
                            values: [0, 1, 2]
                        }
                    }, {
                        field: 'hide',
                        headerName: '显示和隐藏',
                        type: '词汇',
                        cellEditorParams: {
                            names: ['/', '隐藏'],
                            values: [0, 2]
                        }
                    }]
                };

                /**
                 * 自定义流程意见
                 */
                $scope.diyOpinionGridOptions = {
                    defaultColDef: {
                        editable: true
                    },
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'wftempids',
                        headerName: '流程模板(可多值)',
                        onCellDoubleClicked: function (params) {
                            $modal
                                .openCommonSearch({
                                    classId: 'scpwftemp',
                                    checkbox: true
                                })
                                .result
                                .then(function (wfTemps) {
                                    var newWfTempIds = wfTemps.map(function (wfTemp) {
                                        return wfTemp.wftempid + '';
                                    });

                                    var wfTempIds;
                                    if (params.node.data.wftempids)
                                        wfTempIds = params.node.data.wftempids.split(',');
                                    else
                                        wfTempIds = [];

                                    newWfTempIds = newWfTempIds.filter(function (wfTempId) {
                                        return wfTempIds.indexOf(wfTempId) < 0;
                                    });

                                    if (newWfTempIds.length) {
                                        Array.prototype.push.apply(wfTempIds, newWfTempIds);

                                        params.api.stopEditing();

                                        params.api.hcApi.setCellValue(params.node, params.column, wfTempIds.join(','));
                                    }
                                });
                        },
                        hcRequired: true
                    }, {
                        field: 'procids',
                        headerName: '流程节点(可多值)',
                        hcRequired: true
                    }, {
                        field: 'html_url',
                        headerName: 'html路径',
                        width: 200,
                        hcRequired: true
                    }, {
                        field: 'js_url',
                        headerName: 'js路径',
                        width: 200,
                        hcRequired: true
                    }]
                };

                $scope.copyRule = function (rule) {
                    var index = $scope.rules.indexOf(rule),
                        ruleClone = angular.copy(rule);

                    $scope.rules.splice(index + 1, 0, ruleClone);
                };

                $scope.deleteRule = function (rule) {
                    var index = $scope.rules.indexOf(rule);

                    $scope.rules.splice(index, 1);
                };

                $scope.insertRule = function (rule) {
                    var index = $scope.rules.indexOf(rule);

                    $scope.rules.splice(index, 0, {
                        users: [],
                        roles: [],
                        wfTempIds: [],
                        procIds: [],
                        fields: [],
                        grid: {
                            line: []
                        },
                        readonly: true
                    });
                };

                $scope.addRule = function () {
                    if (!$scope.rules) $scope.rules = [];

                    $scope.rules.push({
                        users: [],
                        roles: [],
                        wfTempIds: [],
                        procIds: [],
                        fields: [],
                        grid: {
                            line: []
                        },
                        readonly: true
                    });
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