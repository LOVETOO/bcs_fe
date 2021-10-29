/**
 *  社保增减员作废
 *  2019/5/22.  hr_insrnc_apply_list
 *  zengjinhua
 */
define(
    ['module','controllerApi','base_obj_list','numberApi','requestApi','$q','swalApi'],
    function (module,controllerApi,base_obj_list,numberApi,requestApi,$q,swalApi) {

        var HrInsrncApplyList=[
            '$scope',
            function HrInsrncApplyList($scope){
                $scope.gridOptions = {
                    columnDefs: [{
                        field: 'bill_no',
                        headerName: '申请单号',
                        checkboxSelection: true
                    }, {
                        field: 'year_month',
                        headerName: '增减年月',
                        type:'年月'
                    }, {
                        field: 'addorsub_type',
                        headerName: '增减类型',
                        hcDictCode:'addorsub_type'
                    }, {
                        field: 'insrnc_no',
                        headerName: '个人社保号'
                    }, {
                        field: 'employee_code',
                        headerName: '员工编码'
                    }, {
                        field: 'employee_name',
                        headerName: '姓名'
                    }, {
                        field: 'sex',
                        headerName: '性别',
                        hcDictCode:'sex'
                    }, {
                        field: 'idcard',
                        headerName: '身份证号'
                    }, {
                        field: 'card_addrinfo',
                        headerName: '户籍所在地'
                    }, {
                        field: 'for_employee_type',
                        headerName: '适用员工类型',
                        hcDictCode:'for_employee_type'
                    }, {
                        field: 'for_domicile_type',
                        headerName: '适用户籍类型',
                        hcDictCode:'for_domicile_type'
                    }, {
                        field: 'useemployee_type',
                        headerName: '用工类型',
                        hcDictCode:'useemployee_type'
                    }, {
                        field: 'insrnc_reason_name',
                        headerName: '社保增减原因'
                    }, {
                        field: 'insrnc_group_name',
                        headerName: '所属社保组'
                    }, {
                        field: 'mobile_no',
                        headerName: '参保人手机号'
                    }, {
                        field: 'line_remark',
                        headerName: '备注'
                    }, {
                        field: 'is_cancel',
                        headerName: '是否作废',
                        type:'是否'
                    }, {
                        field: 'confirmed_by',
                        headerName: '确认人'
                    }, {
                        field: 'confirm_date',
                        headerName: '确认年月',
                        type:'年月'
                    }, {
                        field: 'is_confirm',
                        headerName: '是否确认',
                        hcDictCode:'is_confirm'
                    }],
                    hcPostData: {
                        is_confirm:2,
                        is_cancel:1
                    },
                    hcAfterRequest:function(args){
                        return $q.all(determine(args));
                    }
                };

                controllerApi.extend({
                    controller:base_obj_list.controller,
                    scope:$scope
                });
                     //新增社保列
                var lines = function () {
                     requestApi.post({
                         classId: 'hr_insrnc_type',
                         action: 'search',
                         data: {
                             sqlwhere:"usable = 2"
                         }
                     }) .then(function ( response ) {
                             response.hr_insrnc_types.forEach(function(value){
                                     var val = {
                                         field: value.hr_insrnc_type_id,
                                         headerName: value.insrnc_type_name,
                                         col_type:1,
                                        type:'是否'
                                     };
                                 $scope.gridOptions.columnDefs.push(val);
                             });
                         if($scope.gridOptions.columnApi){
                             $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                         }


                         });
                 }();

                /*----------------------------------按钮定义-------------------------------------------*/
                $scope.toolButtons.add.hide = function (){
                    return true;
                };
                $scope.toolButtons.delete.hide = function (){
                    return true;
                };
                $scope.toolButtons.openProp.hide = function (){
                    return true;
                };
                $scope.toolButtons.batchAudit.hide = function (){
                    return true;
                };
                $scope.toolButtons.cancellation = {
                    groupId: 'base',
                    title: '作废',
                    click: function () {
                        $scope.cancellation_line && $scope.cancellation_line();
                    }
                };
                /*----------------------------------按钮方法定义-------------------------------------------*/
                $scope.cancellation_line = function () {
                    var row = $scope.gridOptions.api.getSelectedRows();
                    if(!row.length>0){
                        swalApi.info('请选中要作废的员工');
                        return;
                    }
                    posting(row)
                };
                function posting(data){
                    requestApi.post({
                            classId: 'hr_insrnc_apply_head',
                            action: 'cancel',
                            data: {
                                hr_insrnc_apply_lineofhr_insrnc_apply_heads:data
                            }
                        })
                        .then(function ( ) {
                            refresh();
                            swalApi.info('作废成功');

                        });
                }
                refresh = function () {
                    //刷新即是用上此的查询条件再查询一次
                    return $scope.gridOptions.hcApi.search();
                };
                 //判断社保政策
                 function determine(args){
                     var promises = [];
                     args.hr_insrnc_apply_lists.forEach(function(val){
                         promises.push(requestApi.post({
                             classId: "hr_insrnc_policy",
                             action: 'select',
                             data: {hr_insrnc_policy_id: val.hr_insrnc_policy_id }
                         }).then(function (data) {
                             $scope.gridOptions.columnDefs.forEach(function(col){
                                 if(col.col_type){
                                     data.hr_insrnc_policy_lineofhr_insrnc_policys.forEach(function(d){
                                         if(d.hr_insrnc_type_id == col.field){
                                             val[col.field] = 2;
                                         }
                                     })
                                 }
                             });
                         }));
                     });
                     return promises;
                 }

                 //验证表头信息是否填完
                 $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    return invalidBox;
                 };
            }
        ];
    return controllerApi.controller({
        module:module,
        controller:HrInsrncApplyList
    });

});