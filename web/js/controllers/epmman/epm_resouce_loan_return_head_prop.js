/**
 * 资源借出申请
 * 2019/5/27
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', '$modal', 'numberApi'],
    function (module, controllerApi, base_obj_prop, swalApi, $modal, numberApi) {
        'use strict';

        var controller = [

            '$scope',
            function ($scope) {
                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 标签定义
                 */
                $scope.tabs.base = {
                    title: '基本信息',
                    active:true
                };

                /**
                 * 是否是不编辑状态
                 */
                function isReadonly(){
                    return $scope.hcSuper.isFormReadonly();
                }
                

                /*----------------------------------表格定义-------------------------------------------*/
                /**
                 * 表格定义  "基本详情"
                 */
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'resouce_type',
                        headerName: '服务资源类型',
                        hcDictCode: 'resouce_type',
                        hcRequired: true,
                        editable: function(){
                            return $scope.data.currItem.stat==1
                        },
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue) {
                                return;
                            } else if (args.newValue == undefined || args.newValue == null || args.newValue == "" || args.newValue <= 0) {
                                args.data.resouce_category_name = undefined;
                                args.data.resource_archives_code = undefined;
                                return;
                            }
                            args.data.resouce_category_name = undefined;
                            args.data.resource_archives_code = undefined;
                            $scope.onechooseHrInsrncGroup(args);
                        }
                    }, {
                        field: 'resouce_category_name',
                        headerName: '资源类别',
                        hcRequired: true,
                        onCellDoubleClicked: function (args) {
                            if(isReadonly()){
                                return;
                            }
                            $scope.onechooseHrInsrncGroup(args);
                        },
                        editable: function(){
                            return $scope.data.currItem.stat==1
                        }
                    }, {
                        field: 'resource_archives_code',
                        headerName: '资源编码',
                        hcRequired: true,
                        onCellDoubleClicked: function (args) {
                            if(isReadonly()){
                                return;
                            }
                            $scope.onechooseResourceArchivesCode(args);
                        },
                        editable: function(){
                            return $scope.data.currItem.stat==1
                        }
                    }, {
                        field: 'resource_identifier',
                        headerName: '资源编号'
                    }, {
                        field: 'resource_name',
                        headerName: '资源名称'
                    }, {
                        field: 'employee_name',
                        headerName: '姓名'
                    }, {
                        field: 'exp_date',
                        headerName: '有效期',
                        type:'日期'
                    }, {
                        field: 'stat',
                        headerName: '资源在库状态',
                        cellStyle: {
                            'text-align': 'center'
                        }
                    }, {
                        field: 'keeper_name',
                        headerName: '保管人'
                    }, {
                        field: 'loan_date',
                        headerName: '借出日期',
                        type:'日期'
                    }, {
                        field: 'return_date',
                        headerName: '归还日期',
                        type:'日期'
                    }, {
                        field: 'loan_return_stat',
                        headerName: '借还状态',
                        hcDictCode:'loan_return_stat'
                    }, {
                        field: 'line_remark',
                        headerName: '备注',
                        editable: function(){
                            return $scope.data.currItem.stat==1
                        }
                    }]
                };

                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 资源类别
                 */
                $scope.onechooseHrInsrncGroup = function (args){
                    if(!args.data.resouce_type>0){
                        swalApi.info('请选择服务资源类型');
                        return;
                    }
                    return $modal.openCommonSearch({
                        classId:'epm_resouce_archives',
                        postData : {
                            search_flag : 1,
                            resouce_type : args.data.resouce_type
                        },
                        dataRelationName:'epm_resouce_archivess',
                        action:'search',
                        title:"服务资源类别",
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "资源分类编码",
                                    field: "resouce_category_code"
                                },{
                                    headerName: "资源分类名称",
                                    field: "resouce_category_name"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function(result){
                            args.data.resouce_category_id = result.resouce_category_id;
                            args.data.resouce_category_name = result.resouce_category_name;
                            args.api.refreshView();//刷新网格视图
                            $scope.onechooseResourceArchivesCode (args);
                        });
                };

                /**
                 * 借出资源
                 */
                $scope.onechooseResourceArchivesCode = function (args){
                    if(args.data.resouce_category_name==null||args.data.resouce_category_name==undefined||args.data.resouce_category_name==""){
                        swalApi.info('请选择资源类别');
                        return;
                    }
                    return $modal.openCommonSearch({
                        classId:'epm_resouce_archives',
                        sqlWhere:'is_usable = 2  and resouce_category_id = ' + args.data.resouce_category_id + " and resouce_type = " + args.data.resouce_type,
                        action:'search',
                        title:"资源类型",
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "资源分类编码",
                                    field: "resource_archives_code"
                                },{
                                    headerName: "资源分类名称",
                                    field: "resource_name"
                                },{
                                    headerName: "资源分类编号",
                                    field: "resource_identifier"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function(result){
                            args.data.resouce_archives_id = result.resouce_archives_id;
                            args.data.resource_archives_code = result.resource_archives_code;//编码
                            args.data.resource_name = result.resource_name;//证件名称
                            args.data.resource_identifier = result.resource_identifier;//编号
                            args.data.stat = result.stat;//状态
                            args.data.exp_date = result.exp_date;//有效期
                            args.data.keeper_name = result.keeper_name;//保管人
                            args.data.employee_name = result.employee_name;//姓名
                            args.api.refreshView();//刷新网格视图
                        });
                };

                /**
                 * 查申请人
                 */
                $scope.scpuserSerachObj = {
                    sqlWhere:'actived = 2',
                    afterOk: function (result) {
                        $scope.data.currItem.apply_person_id = result.sysuserid;
                        $scope.data.currItem.apply_person_name = result.username;
                    }
                };

                /**
                 * 查使用人
                 */
                $scope.scpuserSerachShiYong = {
                    sqlWhere:'actived = 2',
                    afterOk: function (result) {
                        $scope.data.currItem.loan_person_id = result.sysuserid;
                        $scope.data.currItem.loan_person_name = result.username;
                    }
                };

                /**
                 * 查部门
                 */
                $scope.deptSerachObj = {
                    afterOk: function (result) {
                        $scope.data.currItem.apply_dept_id = result.dept_id;
                        $scope.data.currItem.apply_dept_name = result.dept_name;
                    }
                };

                /**
                 * 查使用项目
                 */
                $scope.epmProjectSerachObj = {
                    postData:{
                        search_flag : 120
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.loan_project_id = result.project_id;
                        $scope.data.currItem.loan_project_name = result.project_name;
                    }
                };

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //基本详情
                    bizData.epm_resouce_loan_return_lineofepm_resouce_loan_return_heads = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_resouce_loan_return_lineofepm_resouce_loan_return_heads);
                    bizData.estimated_loan_date = new Date().Format('yyyy-MM-dd');
                    bizData.apply_dept_id = userbean.loginuserifnos[0].org_id;
                    bizData.apply_dept_name = userbean.loginuserifnos[0].org_name;
                    bizData.loan_person_id = userbean.sysuserid;
                    bizData.loan_person_name = userbean.userid;
                    bizData.apply_person_id = userbean.sysuserid;
                    bizData.apply_person_name = userbean.userid;
                    $scope.addLine();
                };

                /**
                 * 复制
                 */
                $scope.copyBizData = function (bizData) {
                    $scope.hcSuper.copyBizData(bizData);
                    bizData.estimated_loan_date = new Date().Format('yyyy-MM-dd');
                    bizData.estimated_return_date = undefined;
                    bizData.apply_dept_id = userbean.loginuserifnos[0].org_id;
                    bizData.apply_dept_name = userbean.loginuserifnos[0].org_name;
                    bizData.loan_person_id = userbean.sysuserid;
                    bizData.loan_person_name = userbean.userid;
                    bizData.apply_person_id = userbean.sysuserid;
                    bizData.apply_person_name = userbean.userid;
                };

                /**
                 * 数据处理
                 */
                $scope.doAfterSave = function(responseData) {
                    responseData.epm_resouce_loan_return_lineofepm_resouce_loan_return_heads.forEach(function (val) {
                        if(val.loan_return_stat == null || val.loan_return_stat == undefined){
                            val.loan_return_stat = 0;
                        }
                    });
                };

                /**
                 * 保存验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    $scope.data.currItem.epm_resouce_loan_return_lineofepm_resouce_loan_return_heads.forEach(function (value,index) {
                        if(numberApi.sub(new Date($scope.data.currItem.estimated_loan_date).getTime(),86400000) >new Date(value.exp_date).getTime()){
                            invalidBox.push('第'+(index+1)+'行，预计借出日期大于有效期');
                        }
                        if(numberApi.sub(new Date($scope.data.currItem.estimated_return_date).getTime(),86400000) >new Date(value.exp_date).getTime()){
                            invalidBox.push('第'+(index+1)+'行，预计归还日期大于有效期');
                        }
                    });
                    return invalidBox;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    //设置基本经历
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_resouce_loan_return_lineofepm_resouce_loan_return_heads);
                };

                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/

                $scope.footerLeftButtons.addRow.click = function(){
                    $scope.addLine && $scope.addLine();
                };
                $scope.footerLeftButtons.addRow.hide = function(){
                    return $scope.data.currItem.stat > 1;
                };
                $scope.footerLeftButtons.deleteRow.click=function(){
                    $scope.delLine && $scope.delLine();
                };
                $scope.footerLeftButtons.deleteRow.hide=function(){
                    return $scope.data.currItem.stat > 1;
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                //添加明细
                $scope.addLine = function () {
                    $scope.gridOptions.api.stopEditing();
                    $scope.data.currItem.epm_resouce_loan_return_lineofepm_resouce_loan_return_heads.push({});
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_resouce_loan_return_lineofepm_resouce_loan_return_heads);
                };
                /**
                 * 删除行教育经历
                 */
                $scope.delLine = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_resouce_loan_return_lineofepm_resouce_loan_return_heads.splice(idx, 1);
                        if ($scope.data.currItem.epm_resouce_loan_return_lineofepm_resouce_loan_return_heads.length == 0) {
                            $scope.data.currItem.epm_resouce_loan_return_lineofepm_resouce_loan_return_heads.push({});
                        }
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_resouce_loan_return_lineofepm_resouce_loan_return_heads);
                    }
                };

                /**
                 * 时间校验
                 */
                $scope.dateLock = function(){
                    if($scope.data.currItem.estimated_loan_date==null||$scope.data.currItem.estimated_loan_date==undefined||$scope.data.currItem.estimated_loan_date==""
                        ||$scope.data.currItem.estimated_return_date==null||$scope.data.currItem.estimated_return_date==undefined||$scope.data.currItem.estimated_return_date==""){
                        return;
                    }
                    if(new Date($scope.data.currItem.estimated_loan_date).getTime()>new Date($scope.data.currItem.estimated_return_date).getTime()){
                        swalApi.info('预计归还时间应大于预计借出时间');
                    }
                };

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });

    });