/**
 * 网点信息申请
 * 2020/03/04
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', '$modal'],
    function (module, controllerApi, base_obj_prop, $modal) {

        var controller = [
            '$scope',

            function ($scope) {
                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //是否经销商登陆
                $scope.isCustomerCode = user.isCustomer;
                /**
                 * 表格定义
                 */
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'project_code',
                        headerName: '战略报备编码',
                        hcRequired : true,
                        minWidth : 80
                    }, {
                        field: 'project_name',
                        headerName: '家装公司名称',
                        minWidth : 150
                    }]
                };

                /*----------------------------------通用查询-------------------------------------------*/
                $scope.commonSearchCustomerCode = {
                    title: '客户',
                    postData: {
                        search_flag: 142
                    },
                    afterOk: function (customer) {
                        ['customer_id', 'customer_code', 'customer_name'].forEach(function (field) {
                            $scope.data.currItem[field] = customer[field];
                        });
                        /* 清空关联战略 */
                        $scope.data.currItem.epm_branch_message_lines = [];
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_branch_message_lines);
                    }
                }

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /*---------按钮及标签 定义------*/
                $scope.footerLeftButtons.addRow.click = function (){
                    $scope.add_line && $scope.add_line();
                };
                $scope.footerLeftButtons.addRow.hide = function(){
                    return $scope.data.currItem.stat > 1
                }
                /**
                 * 删除明细按钮
                 * */
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();
                };
                $scope.footerLeftButtons.deleteRow.hide = function(){
                    return $scope.data.currItem.stat > 1
                }

                /**
                 * 新增明细行
                 */
                $scope.add_line = function (){
                    if(!$scope.data.currItem.customer_name){
                        return swalApi.error('请先选择经销商信息');
                    }
                    return $modal.openCommonSearch({
                        classId:'epm_branch_message',
                        title:"战略项目",
                        action:'selectreport',
                        postData: function () {
                            return {
                                customer_id: $scope.data.currItem.customer_id
                            };
                        },
                        checkbox: true,
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "家装战略编码",
                                    field: "project_code"
                                },{
                                    headerName: "家装战略名称",
                                    field: "project_name"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function(projects){
                            var projectDatas = $scope.gridOptions.hcApi.getRowData();

                            projects = projects.filter(function (project) {
                                return projectDatas.every(function (projectData) {
                                    return projectData.report_id != project.report_id;
                                });
                            });

                            if (!projects.length) return;

                            Array.prototype.push.apply($scope.data.currItem.epm_branch_message_lines, projects);

                            $scope.gridOptions.api.updateRowData({
                                add: projects
                            });
                        });
                };

                /**
                 * 删除行明细
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_branch_message_lines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_branch_message_lines);
                    }
                };

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //经销商账户登陆
                    if(customer){
                        $scope.data.currItem.customer_id = customer.customer_id;
                        $scope.data.currItem.customer_code = customer.customer_code;
                        $scope.data.currItem.customer_name = customer.customer_name;
                    }
                    bizData.epm_branch_message_lines = [];
                    bizData.branch_valid = 1;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_branch_message_lines);
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