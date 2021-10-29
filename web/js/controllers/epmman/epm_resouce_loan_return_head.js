/**
 * 资源借还登记
 * 2019/5/29 epm_resouce_loan_return_head
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', '$q', '$modal','directive/hcTab','directive/hcTabPage'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, $q, $modal) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                /**
                 * 数据定义
                 */
                $scope.data = {};
                $scope.data.currItem = {
                    search_flag:1
                };
                /**
                 * 定义页签
                 */
                $scope.epm_tab={};
                $scope.epm_tab.score = {
                    title: '待借出',
                    active:true
                };
                $scope.epm_tab.completion = {
                    title: '已借出'
                };
                $scope.epm_tab.back = {
                    title: '已归还'
                };
                /**
                 * 表格定义
                 */
                $scope.gridOptions_jie = {
                    hcName:"资源借还登记", 
                    columnDefs: [{
                        type: '序号'
                    }, {
                        headerName: "借出申请单号",
                        field: "apply_bill_no",
                        checkboxSelection: true
                    },{
                        headerName: "申请日期",
                        field: "apply_bill_date"
                    }, {
                        headerName: "申请人",
                        field: "apply_person_name"
                    }, {
                        headerName: "申请部门",
                        field: "apply_dept_name"
                    }, {
                        headerName: "姓名",
                        field: "employee_name"
                    }, {
                        headerName: "资源类型",
                        field: "resouce_type",
                        hcDictCode:'resouce_type'
                    }, {
                        headerName: "资源类别",
                        field: "resouce_category_name"
                    }, {
                        headerName: "资源编号",
                        field: "resource_identifier"
                    }, {
                        headerName: "资源名称",
                        field: "resource_name"
                    }, {
                        headerName: "保管人",
                        field: "keeper_name"
                    }, {
                        headerName: "预计归还时间",
                        field: "estimated_return_date"
                    }, {
                        headerName: "使用项目",
                        field: "loan_project_name"
                    }, {
                        headerName: "使用用途",
                        field: "loan_description"
                    }, {
                        headerName: "备注",
                        field: "remark"
                    }],
                    hcBeforeRequest: function (searchObj) {
                        searchObj.search_flag = $scope.data.currItem.search_flag,
                        searchObj.apply_bill_no = $scope.data.currItem.apply_bill_no,
                        searchObj.apply_bill_dates = $scope.data.currItem.apply_bill_dates,
                        searchObj.apply_bill_datee = $scope.data.currItem.apply_bill_datee,
                        searchObj.loan_project_name = $scope.data.currItem.loan_project_name,
                        searchObj.apply_dept_name = $scope.data.currItem.apply_dept_name,
                        searchObj.apply_person_name = $scope.data.currItem.apply_person_name,
                        searchObj.resouce_type = $scope.data.currItem.resouce_type,
                        searchObj.resouce_category_name = $scope.data.currItem.resouce_category_name,
                        searchObj.loan_description = $scope.data.currItem.loan_description,
                        searchObj.resource_identifier = $scope.data.currItem.resource_identifier,
                        searchObj.resource_name = $scope.data.currItem.resource_name,
                        searchObj.keeper = $scope.data.currItem.keeper
                    },
                    hcRequestAction:'search',
                    hcDataRelationName:'epm_resouce_loan_return_heads',
                    hcClassId:'epm_resouce_loan_return_head'
                };
                /**
                 * 表格定义
                 */
                $scope.gridOptions_completionrate = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        headerName: "借出时间",
                        field: "loan_date",
                        checkboxSelection: true
                    }, {
                        headerName: "借出申请单号",
                        field: "apply_bill_no"
                    },{
                        headerName: "申请日期",
                        field: "apply_bill_date"
                    }, {
                        headerName: "申请人",
                        field: "apply_person_name"
                    }, {
                        headerName: "申请部门",
                        field: "apply_dept_name"
                    }, {
                        headerName: "姓名",
                        field: "employee_name"
                    }, {
                        headerName: "资源类型",
                        field: "resouce_type",
                        hcDictCode:'resouce_type'
                    }, {
                        headerName: "资源类别",
                        field: "resouce_category_name"
                    }, {
                        headerName: "资源编号",
                        field: "resource_identifier"
                    }, {
                        headerName: "资源名称",
                        field: "resource_name"
                    }, {
                        headerName: "保管人",
                        field: "keeper_name"
                    }, {
                        headerName: "预计归还时间",
                        field: "estimated_return_date"
                    }, {
                        headerName: "使用项目",
                        field: "loan_project_name"
                    }, {
                        headerName: "使用用途",
                        field: "loan_description"
                    }, {
                        headerName: "使用合伙人",
                        field: "loan_partner_name"
                    }, {
                        headerName: "使用业主",
                        field: "loan_holder_id"
                    }, {
                        headerName: "备注",
                        field: "remark"
                    }],
                    hcBeforeRequest: function (searchObj) {
                        searchObj.search_flag = $scope.data.currItem.search_flag,
                        searchObj.apply_bill_no = $scope.data.currItem.apply_bill_no,
                        searchObj.apply_bill_dates = $scope.data.currItem.apply_bill_dates,
                        searchObj.apply_bill_datee = $scope.data.currItem.apply_bill_datee,
                        searchObj.loan_project_name = $scope.data.currItem.loan_project_name,
                        searchObj.apply_dept_name = $scope.data.currItem.apply_dept_name,
                        searchObj.apply_person_name = $scope.data.currItem.apply_person_name,
                        searchObj.resouce_type = $scope.data.currItem.resouce_type,
                        searchObj.resouce_category_name = $scope.data.currItem.resouce_category_name,
                        searchObj.loan_description = $scope.data.currItem.loan_description,
                        searchObj.resource_identifier = $scope.data.currItem.resource_identifier,
                        searchObj.resource_name = $scope.data.currItem.resource_name,
                        searchObj.keeper = $scope.data.currItem.keeper
                    },
                    hcRequestAction:'search',
                    hcDataRelationName:'epm_resouce_loan_return_heads',
                    hcClassId:'epm_resouce_loan_return_head'
                };
                /**
                 * 表格定义
                 */
                $scope.gridOptions_back = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        headerName: "归还日期",
                        field: "return_date",
                        checkboxSelection: true
                    }, {
                        headerName: "借出时间",
                        field: "loan_date"
                    }, {
                        headerName: "借出申请单号",
                        field: "apply_bill_no"
                    },{
                        headerName: "申请日期",
                        field: "apply_bill_date"
                    }, {
                        headerName: "申请人",
                        field: "apply_person_name"
                    }, {
                        headerName: "申请部门",
                        field: "apply_dept_name"
                    }, {
                        headerName: "姓名",
                        field: "employee_name"
                    }, {
                        headerName: "资源类型",
                        field: "resouce_type",
                        hcDictCode:'resouce_type'
                    }, {
                        headerName: "资源类别",
                        field: "resouce_category_name"
                    }, {
                        headerName: "资源编号",
                        field: "resource_identifier"
                    }, {
                        headerName: "资源名称",
                        field: "resource_name"
                    }, {
                        headerName: "保管人",
                        field: "keeper_name"
                    }, {
                        headerName: "预计归还时间",
                        field: "estimated_return_date"
                    }, {
                        headerName: "使用项目",
                        field: "loan_project_name"
                    }, {
                        headerName: "使用用途",
                        field: "loan_description"
                    }, {
                        headerName: "使用合伙人",
                        field: "loan_partner_name"
                    }, {
                        headerName: "使用业主",
                        field: "loan_holder_id"
                    }, {
                        headerName: "备注",
                        field: "remark"
                    }],
                    hcBeforeRequest: function (searchObj) {
                        searchObj.search_flag = $scope.data.currItem.search_flag,
                            searchObj.apply_bill_no = $scope.data.currItem.apply_bill_no,
                            searchObj.apply_bill_dates = $scope.data.currItem.apply_bill_dates,
                            searchObj.apply_bill_datee = $scope.data.currItem.apply_bill_datee,
                            searchObj.loan_project_name = $scope.data.currItem.loan_project_name,
                            searchObj.apply_dept_name = $scope.data.currItem.apply_dept_name,
                            searchObj.apply_person_name = $scope.data.currItem.apply_person_name,
                            searchObj.resouce_type = $scope.data.currItem.resouce_type,
                            searchObj.resouce_category_name = $scope.data.currItem.resouce_category_name,
                            searchObj.loan_description = $scope.data.currItem.loan_description,
                            searchObj.resource_identifier = $scope.data.currItem.resource_identifier,
                            searchObj.resource_name = $scope.data.currItem.resource_name,
                            searchObj.keeper = $scope.data.currItem.keeper
                    },
                    hcRequestAction:'search',
                    hcDataRelationName:'epm_resouce_loan_return_heads',
                    hcClassId:'epm_resouce_loan_return_head'
                };

                //控制器继承
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /**
                 * 改变借出情况
                 */
                $scope.onTabChange_hr = function (params) {
                    $q.when()
                        .then(function () {
                            if (params.tab.title == '待借出') {
                                $scope.data.currItem.search_flag = 1;
                                $scope.toolButtons.loan.hide = false;
                                $scope.toolButtons.back.hide = true;
                                $scope.toolButtons.cancel.hide = true;
                                $scope.gridOptions_jie.hcApi.search();
                            } else if (params.tab.title == '已借出') {
                                $scope.data.currItem.search_flag = 2;
                                $scope.toolButtons.loan.hide = true;
                                $scope.toolButtons.back.hide = false;
                                $scope.toolButtons.cancel.hide = false;
                                $scope.gridOptions_completionrate.hcApi.search();
                            } else if (params.tab.title == '已归还') {
                                $scope.data.currItem.search_flag = 3;
                                $scope.toolButtons.loan.hide = true;
                                $scope.toolButtons.back.hide = true;
                                $scope.toolButtons.cancel.hide = true;
                                $scope.gridOptions_back.hcApi.search();
                            }
                        })
                };

                /*----------------------------------通用查询-------------------------------------------*/
                /**
                 * 借出申请号查询
                 */
                $scope.commonSearchSettingOfApplyBillNo = {
                    title:'借出申请查询',
                    gridOptions:{
                    columnDefs:[
                        {
                            headerName: "申请单号",
                            field: "apply_bill_no"
                        }]
                    },
                    postData:function(){
                        return {
                            search_flag:$scope.data.currItem.search_flag
                        }
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.apply_bill_no = result.apply_bill_no;
                        $scope.seasonmthDate();
                    }
                };
                /**
                 * 项目查询
                 */
                $scope.commonSearchSettingOfLoanProjectName = {
                    postData:{
                        search_flag:120
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.loan_project_name = result.project_name;
                        $scope.seasonmthDate();
                    }
                };
                /**
                 * 申请部门查询
                 */
                $scope.deptSerachObj = {
                    afterOk: function (result) {
                        $scope.data.currItem.apply_dept_name = result.dept_name;
                        $scope.seasonmthDate();
                    }
                };

                /**
                 * 申请人查询
                 */
                $scope.scpuserSerachObj = {
                    sqlWhere:'actived = 2',
                    afterOk: function (result) {
                        $scope.data.currItem.apply_person_name = result.username;
                        $scope.seasonmthDate();
                    }
                };

                /**
                 * 资源类别查询
                 */
                $scope.epmResouceCategorySerachObj = function () {
                    if($scope.data.currItem.resouce_type>0){
                        return $modal.openCommonSearch({
                            classId:'epm_resouce_archives',
                            postData:{
                                search_flag : 1,
                                resouce_type : $scope.data.currItem.resouce_type
                            },
                            title:"服务资源分类",
                            dataRelationName:'epm_resouce_archivess',
                            gridOptions:{
                                columnDefs:[{
                                    headerName: "服务资源分类编码",
                                    field: "resouce_category_code"
                                },{
                                    headerName: "服务资源分类名称",
                                    field: "resouce_category_name"
                                }]
                            }
                        })
                            .result//响应数据
                            .then(function(result){
                                $scope.data.currItem.resouce_category_name = result.resouce_category_name;
                                $scope.seasonmthDate();
                            });
                    }else{
                        return $modal.openCommonSearch({
                            classId:'epm_resouce_category',
                            title:"服务资源分类",
                            dataRelationName:'epm_resouce_categorys',
                            gridOptions:{
                                columnDefs:[{
                                    headerName: "服务资源分类编码",
                                    field: "resouce_category_code"
                                },{
                                    headerName: "服务资源分类名称",
                                    field: "resouce_category_name"
                                }]
                            }
                        })
                            .result//响应数据
                            .then(function(result){
                                $scope.data.currItem.resouce_category_name = result.resouce_category_name;
                                $scope.seasonmthDate();
                            });
                    }
                };

                /**
                 * 资源编号查询
                 */
                $scope.resourceIdentifierSerachObj = {
                    afterOk: function (result) {
                        $scope.data.currItem.resource_identifier = result.resource_identifier;//编号
                        $scope.seasonmthDate();
                    }
                };

                /**
                 * 资源名称查询
                 */
                $scope.resourceNameSerachObj = {
                    afterOk: function (result) {
                        $scope.data.currItem.resource_name = result.resource_name;//证件名称
                        $scope.seasonmthDate();
                    }
                };

                /**
                 * 保管人查询
                 */
                $scope.keeperNameSerachObj = {
                    sqlWhere:'actived = 2',
                    afterOk: function (result) {
                        $scope.data.currItem.keeper = result.sysuserid;
                        $scope.data.currItem.keeper_name = result.username;
                        $scope.seasonmthDate();
                    }
                };

                /**
                 * 改变保管人条件
                 */
                $scope.changeColor=function() {
                    if($scope.data.currItem.keeper_name== undefined||$scope.data.currItem.keeper_name==null||$scope.data.currItem.keeper_name==""){
                        $scope.data.currItem.keeper=undefined;
                    }
                    switch($scope.data.currItem.search_flag){
                        case 1 :
                            $scope.gridOptions_jie.hcApi.search();
                            break;
                        case 2 :
                            $scope.gridOptions_completionrate.hcApi.search();
                            break;
                        case 3 :
                            $scope.gridOptions_back.hcApi.search();
                            break;
                    }
                };

                /**
                 * 改变查询条件条件
                 */
                $scope.seasonmthDate = function (){
                    switch($scope.data.currItem.search_flag){
                        case 1 :
                            $scope.gridOptions_jie.hcApi.search();
                            break;
                        case 2 :
                            $scope.gridOptions_completionrate.hcApi.search();
                            break;
                        case 3 :
                            $scope.gridOptions_back.hcApi.search();
                            break;
                    }
                };

                /**
                 * 添加按钮
                 */
                $scope.toolButtons = {
                    search: {
                        title: '查询',
                        icon: 'iconfont hc-search',
                        click: function () {
                            switch($scope.data.currItem.search_flag){
                                case 1 :
                                    $scope.gridOptions_jie.hcApi.search();
                                    break;
                                case 2 :
                                    $scope.gridOptions_completionrate.hcApi.search();
                                    break;
                                case 3 :
                                    $scope.gridOptions_back.hcApi.search();
                                    break;
                            }
                        }
                    },
                    loan: {
                        title: '借出确认',
                        icon: 'iconfont hc-save',
                        click: function () {
                            $scope.loanSearch && $scope.loanSearch();
                        },
                        hide: function(){
                            $scope.data.currItem.search_flag!=1
                        }
                    },
                    back: {
                        title: '归还确认',
                        icon: 'iconfont hc-save',
                        click: function () {
                            $scope.backSearch && $scope.backSearch();
                        },
                        hide: function(){
                            return true;
                        }
                    },
                    cancel: {
                        title: '取消借出',
                        icon: 'iconfont hc-close',
                        click: function () {
                            $scope.cancelSelect && $scope.cancelSelect();
                        },
                        hide: function(){
                            return true;
                        }
                    },
                    clear: {
                        title: '清除',
                        icon: 'iconfont hc-qingsao',
                        click: function () {
                            $scope.reset && $scope.reset();
                        }
                    }
                };

                /**
                 * 重置方法,将过滤条件清空
                 */
                $scope.reset = function () {
                    ["apply_bill_no",
                    "apply_bill_dates",
                    "apply_bill_datee",
                    "loan_project_name",
                    "apply_dept_name",
                    "apply_person_name",
                    "resouce_type",
                    "resouce_category_name",
                    "loan_description",
                    "resource_identifier",
                    "resource_name",
                    "keeper",
                    "keeper_name"].forEach(function (data) {
                        $scope.data.currItem[data] = undefined;
                    });
                };

                /**
                 * 借出
                 */
                $scope.loanSearch = function () {
                    var action = 'changeresourcestat';
                    var postdata = {
                        epm_resouce_loan_return_lineofepm_resouce_loan_return_heads: $scope.gridOptions_jie.api.getSelectedRows(),
                        flag:1
                    };
                    if($scope.gridOptions_jie.api.getSelectedRows()<=0){
                        return swalApi.info('先选择行');
                        return;
                    }
                    //调用后台保存方法
                    return requestApi.post("epm_resouce_loan_return_head", action,postdata).then(function (data) {
                        return swalApi.success('借出成功!');
                    }).then($scope.serarch);
                };

                /**
                 * 归还
                 */
                $scope.backSearch = function () {
                    var action = 'changeresourcestat';
                    var postdata = {
                        epm_resouce_loan_return_lineofepm_resouce_loan_return_heads: $scope.gridOptions_completionrate.api.getSelectedRows(),
                        flag:2
                    };
                    if($scope.gridOptions_completionrate.api.getSelectedRows()<=0){
                        return swalApi.info('先选择行');
                        return;
                    }
                    //调用后台保存方法
                    return requestApi.post("epm_resouce_loan_return_head", action,postdata).then(function (data) {
                        return swalApi.success('归还成功!');
                    }).then($scope.serarch);
                };

                /**
                 * 取消借出
                 */
                $scope.cancelSelect = function () {
                    var action = 'changeresourcestat';
                    var postdata = {
                        epm_resouce_loan_return_lineofepm_resouce_loan_return_heads: $scope.gridOptions_completionrate.api.getSelectedRows(),
                        flag:3
                    };
                    if($scope.gridOptions_completionrate.api.getSelectedRows()<=0){
                        return swalApi.info('先选择行');
                        return;
                    }
                    //调用后台保存方法
                    return requestApi.post("epm_resouce_loan_return_head", action,postdata).then(function (data) {
                        return swalApi.success('取消成功!');
                    }).then($scope.serarch);
                };

                /**
                 * 执行成功
                 */
                $scope.serarch = function (){
                    switch($scope.data.currItem.search_flag){
                        case 1 :
                            $scope.gridOptions_jie.hcApi.search();
                            break;
                        case 2 :
                            $scope.gridOptions_completionrate.hcApi.search();
                            break;
                        case 3 :
                            $scope.gridOptions_completionrate.hcApi.search();
                            break;
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
    }
);