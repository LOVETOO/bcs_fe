/**
 * create by liujianbing 2019/05/24
 * 用章申请功能
 **/
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi','$modal','dateApi','requestApi'],
    function (module, controllerApi, base_obj_prop, swalApi,$modal,dateApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                $scope.data = {
                    currItem: {}
                };

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'resouce_category_name',
                            headerName: '印章类别',
                            editable: true,
                            onCellDoubleClicked: function (args) {
                                $scope.chooseResouce(args);
                            },
                            hcRequired:true
                        }, {
                            field: 'resource_archives_code',
                            headerName: '系统编码',
                            editable: true,
                            onCellDoubleClicked: function (args) {
                                $scope.chooseArchives(args);
                            },
                            hcRequired:true
                        }, {
                            field: 'resource_identifier',
                            headerName: '印章编码'
                        }, {
                            field: 'resource_name',
                            headerName: '名称'
                        }, {
                            field: 'stat',
                            headerName: '在库状态'
                        }, {
                            field: 'keeper_name',
                            headerName: '保管人'
                        }, {
                            field: 'line_remark',
                            headerName: '备注',
                            editable: true
                        }
                    ],

                }

                /**
                 * 继承控制器
                 **/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*----------------------------------通用查询-------------------------------------------*/
                /**
                 * 工程项目
                 **/
                $scope.commonSearchSettingOfEpmProject = {
                    postData:{search_flag:120},
                    afterOk: function (result) {
                        $scope.data.currItem.apply_project_id = result.project_id;
                        $scope.data.currItem.apply_partner_id = result.project_id;
                        $scope.data.currItem.apply_holder_id = result.project_id;
                        $scope.data.currItem.apply_project_name = result.project_name;
                        $scope.data.currItem.apply_partner_name = result.partner;
                        $scope.data.currItem.apply_holder_name = result.holder;
                    }
                };
                /**
                 * 部门查询
                 **/
                $scope.commonSearchSettingOfDept = {
                    afterOk: function (result) {
                        $scope.data.currItem.apply_dept_id = result.dept_id;
                        $scope.data.currItem.apply_dept_name = result.dept_name;
                    }
                };
                /**
                 * 申请人查询
                 **/
                $scope.commonSearchSettingOfScpuser = {
                    // sqlWhere:'actived = 2',
                    afterOk: function (result) {
                        $scope.data.currItem.apply_person_id = result.sysuserid;
                        $scope.data.currItem.apply_person_name = result.username;

                        var path = result.idpath;
                        var arr = path.split('\\');
                        var dept_id =  arr[arr.length-2];

                        return requestApi.post({
                            classId: 'dept',
                            action: 'search',
                            data: {
                                sqlwhere: ' dept_id='+dept_id,
                            }
                        })
                            .then(function (response) {
                                $scope.data.currItem.apply_dept_id = response.depts[0].dept_id;
                                $scope.data.currItem.apply_dept_name = response.depts[0].dept_name;
                            })


                    }
                };
                $scope.chooseResouce = function (args) {
                    $modal.openCommonSearch({
                        classId:'epm_resouce_archives',
                        postData:{
                            search_flag : 1,
                            resouce_type : 3
                        },
                        title:"印章类别",
                        dataRelationName:'epm_resouce_archivess',
                        gridOptions:{
                            columnDefs:[{
                                headerName: "印章编码",
                                field: "resouce_category_code"
                            },{
                                headerName: "印章名称",
                                field: "resouce_category_name"
                            }]
                        }
                    })
                        .result//响应数据
                        .then(function(result){
                            args.data.resouce_category_id = result.resouce_category_id;
                            args.data.resouce_category_name = result.resouce_category_name;
                            args.api.refreshView();//刷新网格视图
                        });
                };

                $scope.chooseArchives = function (args) {
                    $modal.openCommonSearch({
                        classId:'epm_resouce_archives',
                        postData:{},
                        sqlWhere: 'resouce_type=3',
                        title:"资源查询",
                        dataRelationName:'epm_resouce_archivess',
                        gridOptions:{
                            columnDefs:[{
                                headerName: "系统资源编码",
                                field: "resource_archives_code"
                            },{
                                headerName: "资源编码",
                                field: "resource_identifier"
                            },{
                                headerName: "资源名称",
                                field: "resource_name"
                            },{
                                headerName: "状态",
                                field: "stat"
                            },{
                                headerName: "保管人",
                                field: "keeper_name"
                            }]
                        }
                    })
                        .result//响应数据
                        .then(function(result){
                            args.data.resouce_archives_id = result.resouce_archives_id;
                            args.data.resource_archives_code = result.resource_archives_code;
                            args.data.resource_identifier = result.resource_identifier;
                            args.data.resource_name = result.resource_name;
                            args.data.stat = result.stat;
                            args.data.keeper_name = result.keeper_name;
                            args.api.refreshView();//刷新网格视图
                        });
                };


                /*----------------------------------通用查询结束-------------------------------------------*/



                /**
                 * 新增设置数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    $scope.data.currItem.flowstat = 1;
                    $scope.data.currItem.apply_type="";
                    bizData.epm_resouce_stamp_apply_lineofepm_resouce_stamp_apply_heads = [{}];
                    $scope.data.apply_sum = 0;
                    var date = dateApi.now();
                    var arr = date.split(' ');
                    $scope.data.currItem.apply_bill_date = arr[0];
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_resouce_stamp_apply_lineofepm_resouce_stamp_apply_heads);

                    bizData.apply_dept_id = userbean.loginuserifnos[0].org_id;
                    bizData.apply_dept_name = userbean.loginuserifnos[0].org_name;
                    bizData.apply_person_id = userbean.sysuserid;
                    bizData.apply_person_name = userbean.userid;
                };

                /**
                 * 复制
                 */
                $scope.copyBizData = function (bizData) {
                    $scope.hcSuper.copyBizData(bizData);
                    bizData.apply_bill_date = new Date().Format('yyyy-MM-dd');
                    bizData.apply_person_name = undefined;
                    bizData.apply_dept_name = undefined;
                };

                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    // $scope.data.currItem.apply_data = parseInt(bizData.apply_data);
                    // $scope.data.currItem.apply_bid_doc = parseInt(bizData.apply_bid_doc);
                    // $scope.data.currItem.apply_record = parseInt(bizData.apply_record);
                    // $scope.data.currItem.apply_construction_project = parseInt(bizData.apply_construction_project);
                    // $scope.data.currItem.apply_sign_up_data = parseInt(bizData.apply_sign_up_data);
                    // $scope.data.currItem.apply_others = parseInt(bizData.apply_others);
                    var cutArr = $scope.data.currItem.apply_type.split("，");
                    $scope.data.apply_sum = cutArr.length;
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_resouce_stamp_apply_lineofepm_resouce_stamp_apply_heads);
                }
                /**
                 * 明细按钮设置
                 */
                $scope.footerLeftButtons.addRow.hide = false;

                $scope.footerLeftButtons.deleteRow.hide = false;

                $scope.footerLeftButtons.addRow.click = function () {
                    $scope.add_line && $scope.add_line();
                };

                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();
                };

                /**
                 * 添加行明细
                 */
                $scope.add_line = function () {

                    $scope.gridOptions.api.stopEditing();
                    var data = $scope.data.currItem.epm_resouce_stamp_apply_lineofepm_resouce_stamp_apply_heads;
                    data.push({});
                    $scope.gridOptions.hcApi.setRowData(data);
                };

                /**
                 * 删除行明细
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    var data = $scope.data.currItem.epm_resouce_stamp_apply_lineofepm_resouce_stamp_apply_heads;
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        data.splice(idx, 1);
                        if (data.length == 0) {
                            data.push({});
                        }
                        $scope.gridOptions.hcApi.setRowData(data);
                    }
                };

                /**
                 * 用章项选择
                 */
                $scope.applyTypeChange = function (type) {
                    var arr = type.split("|");
                    var cutArr = [];
                    if($scope.data.currItem[arr[0]] == 2){
                        $scope.data.apply_sum+=1;
                        if($scope.data.apply_sum > 1){
                            $scope.data.currItem.apply_type+="，";
                        }
                        $scope.data.currItem.apply_type+=[arr[1]];
                    }else{
                        $scope.data.apply_sum-=1;
                        cutArr = $scope.data.currItem.apply_type.split("，");
                        var l_arr = angular.copy(cutArr);
                        for(var i = 0;i<l_arr.length;i++){
                            if(l_arr[i] == [arr[1]]){
                                cutArr.splice(i,1);
                            }
                        }
                        $scope.data.currItem.apply_type = cutArr.join("，");
                    }
                }
                //验证表头信息是否填完
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    // if($scope.data.apply_sum == 0){
                    //     invalidBox.push('用章项选择未填');
                    // }
                    return invalidBox;
                }
            }
        ]

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
)