/**
 * 家装费用摊销-属性页
 * shenguocheng
 * 2019-07-10
 * Updator : zengjinhua
 * UpdateTime : 2019-07-17
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'numberApi', 'requestApi'],
    function (module, controllerApi, base_obj_prop, swalApi, numberApi, requestApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$modal', '$q',
            //控制器函数
            function ($scope, $modal, $q) {
                /*-------------------------------------------------继承控制器------------------------------------------------------*/
                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*-------------------------------------------------------网格定义------------------------------------------------------------*/
                $scope.gridOptions = {
                    hcEvents: {
                        /**
                         * 焦点事件
                         */
                        cellFocused: function (params) {
                            if($scope.projects != undefined){
                                /**
                                 * 选中了那一行，将当前行工程id与费用
                                 * 记录id对应的数据显示出来
                                 */
                                $scope.gridOptions_projects.hcApi
                                    .setRowData($scope.projects[$scope.data.currItem.epm_fin_fee_allot_lines[params.rowIndex].project_id]);
                                $scope.gridOptions_fin.hcApi
                                    .setRowData($scope.fin[$scope.data.currItem.epm_fin_fee_allot_lines[params.rowIndex].fee_record_id]);
                            }
                        }
                    },
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'project_code',
                            headerName: '工程编码'
                        }, {
                            field: 'project_name',
                            headerName: '工程名称'
                        }, {
                            field: 'customer_code_name',
                            headerName: '客户信息',
                            width : 120,
                            suppressAutoSize: true,
                            suppressSizeToFit: true

                        }, {
                            field: 'fee_record_no',
                            headerName: '费用记录单号'
                        }, {
                            field: 'allot_amt',
                            headerName: '摊销金额',
                            type : '金额',
                            editable: true,
                            hcRequired : true,
                            onCellValueChanged: function (args) {
                                var money = numberApi.sub(args.newValue , args.oldValue);//获取修改后的修改金额
                                if (args.oldValue == args.newValue) {
                                    return;
                                } else if (!numberApi.isNum(Number(args.newValue))) {//校验
                                    swalApi.info("请输入正确的数字");
                                    args.data.allot_amt = args.oldValue;
                                    return
                                } else if (numberApi.sum($scope.fin[args.data.fee_record_id][0].allot_amt,money)
                                    > numberApi.toNumber($scope.fin[args.data.fee_record_id][0].can_allot_amt)) {
                                    swalApi.info("摊销总金额不可大于可摊销金额，请重新输入");
                                    args.data.allot_amt = args.oldValue;
                                    args.api.refreshView();//刷新网格视图
                                    return;
                                }
                                changeMoney(args,money);
                            }
                        }, {
                            field: 'creator',
                            headerName: '申请人'
                        }, {
                            field: 'apply_org_name',
                            headerName: '申请部门'
                        }, {
                            field: 'create_time',
                            headerName: '申请日期',
                            type : '日期'
                        }, {
                            field: 'org_name',
                            headerName: '报销部门'
                        }, {
                            field: 'bud_type_name',
                            headerName: '预算类别'
                        }, {
                            field: 'fee_name',
                            headerName: '费用项目'
                        }
                    ]
                };

                /**
                 * 工程项目摊销合计网格定义
                 */
                $scope.gridOptions_projects = {
                    columnDefs: [
                        {
                            field: 'project_code',
                            headerName: '工程项目编码',
                            minWidth : 150,
                            width : 150,
                            maxWidth : 150,
                            suppressAutoSize: true,
                            suppressSizeToFit: true
                        }, {
                            field: 'project_name',
                            headerName: '工程项目名称',
                            minWidth : 150,
                            width : 150,
                            maxWidth : 150,
                            suppressAutoSize: true,
                            suppressSizeToFit: true
                        }, {
                            field: 'allot_amt',
                            headerName: '摊销金额合计',
                            type: '金额',
                            minWidth : 150,
                            width : 150,
                            maxWidth : 150,
                            suppressAutoSize: true,
                            suppressSizeToFit: true
                        }
                    ]
                };

                /**
                 * 费用摊销合计网格定义
                 */
                $scope.gridOptions_fin = {
                    columnDefs: [
                        {
                            field: 'fee_record_no',
                            headerName: '费用记录',
                            minWidth : 150,
                            width : 150,
                            maxWidth : 150,
                            suppressAutoSize: true,
                            suppressSizeToFit: true
                        }, {
                            field: 'can_allot_amt',
                            headerName: '可摊销金额',
                            type: '金额',
                            minWidth : 140,
                            width : 140,
                            maxWidth : 140,
                            suppressAutoSize: true,
                            suppressSizeToFit: true
                        }, {
                            field: 'allot_amt',
                            headerName: '摊销金额合计',
                            type: '金额',
                            minWidth : 160,
                            width : 160,
                            maxWidth : 160,
                            suppressAutoSize: true,
                            suppressSizeToFit: true
                        }
                    ]
                };

                /*-------------------------------------------------计算方法------------------------------------------------------*/

                /**
                 * 改变金额
                 */
                function changeMoney(args, money) {
                    //改变对应的项目id的摊销金额
                    $scope.projects[args.data.project_id][0].allot_amt = numberApi
                        .sum($scope.projects[args.data.project_id][0].allot_amt,money);
                    //改变对应的费用记录id的摊销金额
                    $scope.fin[args.data.fee_record_id][0].allot_amt = numberApi
                        .sum($scope.fin[args.data.fee_record_id][0].allot_amt,money);
                    //设置数据
                    $scope.gridOptions_projects.hcApi.setRowData($scope.projects[args.data.project_id]);
                    $scope.gridOptions_fin.hcApi.setRowData($scope.fin[args.data.fee_record_id]);
                }

                /*-------------------------------------------------数据方法定义------------------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //$scope.data.currItem.creator = userbean.username;
                    $scope.data.currItem.dept_id = userbean.loginuserifnos[0].org_id;
                    $scope.data.currItem.dept_name = userbean.loginuserifnos[0].org_name;
                    $scope.data.currItem.epm_fin_fee_allot_lines = [];
                    $scope.data.currItem.epm_fee_allot_records = [];//费用
                    $scope.data.currItem.epm_fee_allot_projs = [];//工程
                    //创建两个容器
                    $scope.projects = {};
                    $scope.fin = {};
                    $scope.data.currItem.is_home = 2
                };

                /**
                 * 数据处理
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    var project = [];
                    var fin = [];
                    var id = 0;
                    //以费用记录id进行排序
                    bizData.epm_fin_fee_allot_lines.sort(function (a, b) {
                        return a.fee_record_id - b.fee_record_id;
                    });
                    //合计摊销总额
                    bizData.allot_amt = numberApi.sum(bizData.epm_fin_fee_allot_lines, 'allot_amt');
                    //费用记录id去重保存
                    bizData.epm_fin_fee_allot_lines.forEach(function (value,index) {
                        if(index == 0){
                            id = value.fee_record_id;
                            fin.push(value.fee_record_id);
                        }
                        if(id != value.fee_record_id){
                            id = value.fee_record_id;
                            fin.push(value.fee_record_id);
                        }
                    });
                    //以工程id进行排序
                    bizData.epm_fin_fee_allot_lines.sort(function (a, b) {
                        return a.project_id - b.project_id;
                    });
                    //工程id去重保存
                    bizData.epm_fin_fee_allot_lines.forEach(function (value,index) {
                        if(index == 0){
                            id = value.project_id;
                            project.push(value.project_id);
                        }
                        if(id != value.project_id){
                            id = value.project_id;
                            project.push(value.project_id);
                        }
                    });
                    //清空数组
                    bizData.epm_fee_allot_projs = [];
                    bizData.epm_fee_allot_records = [];
                    //保存数据到关联对象
                    project.forEach(function (val) {
                        bizData.epm_fee_allot_projs.push({
                            project_id : val,
                            allot_amt : $scope.projects[val][0].allot_amt,
                            project_name : $scope.projects[val][0].project_name,
                            project_code : $scope.projects[val][0].project_code
                        });

                    });
                    //保存数据到关联对象
                    fin.forEach(function (value) {
                        bizData.epm_fee_allot_records.push({
                            fee_record_id : value ,
                            allot_amt : $scope.fin[value][0].allot_amt,
                            fee_record_no : $scope.fin[value][0].fee_record_no
                        });
                    });
                    presentUsable();
                };

                /**
                 * 保存验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    if(!$scope.data.currItem.epm_fin_fee_allot_lines.length > 0){
                        invalidBox.push("还未进行摊销!");
                    }
                    return invalidBox;
                };

                /**
                 * 更新当前可用摊销额度
                 */
                function presentUsable(){
                    var fin = [];
                    var id = 0;
                    //排序费用记录id
                    $scope.data.currItem.epm_fin_fee_allot_lines.sort(function (a, b) {
                        return a.fee_record_id - b.fee_record_id;
                    });
                    //去重保存
                    $scope.data.currItem.epm_fin_fee_allot_lines.forEach(function (value,index) {
                        if(index == 0){
                            id = value.fee_record_id;
                            fin.push(value.fee_record_id);
                        }
                        if(id != value.fee_record_id){
                            id = value.fee_record_id;
                            fin.push(value.fee_record_id);
                        }
                    });
                    var arr = [];
                    fin.forEach(function (value) {
                        arr.push(requestApi
                            .post({
                                classId: 'epm_fee_allot',
                                action: 'select',
                                data: {
                                    search_flag : 10,
                                    fee_record_id : value
                                }
                            })
                            .then(function (response) {
                                if (response.containers.length > 0) {
                                    //获取费用记录id对应的最新可摊销金额
                                    $scope.fin[value][0].can_allot_amt = numberApi.sum(response.containers[0].unallot_amt, $scope.fin[value][0].allot_amt);
                                }
                            }));
                    });
                    $scope.data.currItem.epm_fin_fee_allot_lines.sort(function (a, b) {
                        return a.project_id - b.project_id;
                    });
                    return arr;
                }

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    bizData.epm_fin_fee_allot_lines.forEach(function (value) {
                        value.customer_code_name = value.customer_code + "-" + value.customer_name;
                    });
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_fin_fee_allot_lines);
                    //数据重组
                    setDataStructure();
                };

                /**
                 * 组装数据
                 */
                function setDataStructure(){
                    //定义两个容器
                    $scope.projects = {};
                    $scope.fin = {};
                    //将关联数据中的数据取出进行对应的处理
                    $scope.data.currItem.epm_fee_allot_records.forEach(function (value) {
                        $scope.fin[value.fee_record_id] = [{
                            fee_record_no : value.fee_record_no,
                            allot_amt : value.allot_amt,
                            can_allot_amt : 0
                        }];
                    });
                    var arr = presentUsable();
                    //将关联数据中的数据取出进行对应的处理
                    $scope.data.currItem.epm_fee_allot_projs.forEach(function (value) {
                        $scope.projects[value.project_id] = [{
                            project_code : value.project_code,
                            project_name : value.project_name,
                            allot_amt : value.allot_amt
                        }];
                    });
                    $q.all(arr).then(function () {
                        $scope.gridOptions_projects.hcApi
                            .setRowData($scope.projects[$scope.data.currItem.epm_fin_fee_allot_lines[0].project_id]);
                        $scope.gridOptions_fin.hcApi
                            .setRowData($scope.fin[$scope.data.currItem.epm_fin_fee_allot_lines[0].fee_record_id]);
                    });
                    //默认选择第一行
                    $scope.gridOptions.hcApi.setFocusedCell(0);
                }


                /*-------------------------------------------------底部左边按钮------------------------------------------------------*/
                $scope.footerLeftButtons.addRow.click = function () {
                    if ($scope.data.currItem.allot_dimension == 1) {//以项目为主
                        $scope.addEpmProjectsHeads && $scope.addEpmProjectsHeads();
                    }else if ($scope.data.currItem.allot_dimension == 2) {//以费用为主
                        $scope.addEpmFinHeads && $scope.addEpmFinHeads();
                    }else{
                        swalApi.info("请先选择摊销形式");
                    }
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return $scope.data.currItem.stat>1;
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.delHeads && $scope.delHeads();
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return $scope.data.currItem.stat>1;
                };

                /*-------------------------------------------------以项目为主的按钮方法------------------------------------------------------*/
                /**
                 * 按项目的工程信息增加行
                 */
                $scope.addEpmProjectsHeads = function () {
                    //停止编辑
                    $scope.gridOptions.api.stopEditing();
                    return $modal.openCommonSearch({
                        classId: 'epm_project',
                        postData: {
                            search_flag: 7
                        },
                        action: 'search',
                        title: "工程项目",
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "项目编码",
                                    field: "project_code"
                                }, {
                                    headerName: "项目名称",
                                    field: "project_name"
                                }, {
                                    headerName: "报备时间",
                                    field: "report_time",
                                    type: '日期'
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function (response) {
                            $modal.openCommonSearch({
                                classId: 'epm_fin_fee_record',
                                postData: { 
                                    is_home : 2
                                },
                                checkbox: true,
                                action: 'search',
                                dataRelationName: 'fin_fee_records',
                                sqlWhere:  "Creator='" + $scope.data.currItem.creator + "' and unallot_amt>0" ,
                                title: "费用记录",
                                gridOptions: {
                                    columnDefs: [
                                        {
                                            headerName: "费用记录单号",
                                            field: "fee_record_no"
                                        }, {
                                            headerName: "申请人",
                                            field: "creator"
                                        }, {
                                            headerName: "申请部门",
                                            field: "apply_org_name"
                                        }, {
                                            headerName: "报销部门",
                                            field: "org_name"
                                        }, {
                                            headerName: "预算类别",
                                            field: "bud_type_name"
                                        }, {
                                            headerName: "费用项目",
                                            field: "fee_name"
                                        }
                                    ]
                                }
                            })
                                .result//响应数据
                                .then(function (respon) {
                                    respon.forEach(function (val) {
                                        if($scope.projects[response.project_id] == undefined){
                                            $scope.projects[response.project_id] = [{
                                                project_code : response.project_code,
                                                project_name : response.project_name,
                                                allot_amt : 0
                                            }];
                                        }
                                        if($scope.fin[val.fee_record_id] == undefined){
                                            $scope.fin[val.fee_record_id] = [{
                                                fee_record_no : val.fee_record_no,
                                                allot_amt : 0 ,
                                                can_allot_amt : val.unallot_amt
                                            }];
                                        }
                                        $scope.data.currItem.epm_fin_fee_allot_lines.push({
                                            project_id : response.project_id,
                                            project_code : response.project_code,//项目编码
                                            project_name : response.project_name,//项目名称
                                            customer_code_name : response.customer_code + "-" + response.customer_name,//客户信息

                                            fee_record_id : val.fee_record_id,
                                            fee_record_no : val.fee_record_no,//单号
                                            creator : val.creator,//申请人
                                            apply_org_name : val.apply_org_name,//申请部门
                                            create_time : val.create_time,//申请日期
                                            org_name : val.org_name,//报销部门
                                            bud_type_name : val.bud_type_name,//预算类别
                                            fee_name : val.fee_name//费用项目
                                        });
                                    });
                                    //数据排序
                                    $scope.data.currItem.epm_fin_fee_allot_lines.sort(function (a, b) {
                                        return a.fee_record_no - b.fee_record_no;
                                    });
                                    //数据排序
                                    $scope.data.currItem.epm_fin_fee_allot_lines.sort(function (a, b) {
                                        return a.project_code - b.project_code;
                                    });
                                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                                    if(idx == -1){
                                        idx = 0;
                                    }
                                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_fin_fee_allot_lines);
                                    $scope.gridOptions_projects.hcApi
                                        .setRowData($scope.projects[$scope.data.currItem.epm_fin_fee_allot_lines[idx].project_id]);
                                    $scope.gridOptions_fin.hcApi
                                        .setRowData($scope.fin[$scope.data.currItem.epm_fin_fee_allot_lines[idx].fee_record_id]);
                                });
                        });
                };

                /**
                 * 删除行
                 */
                $scope.delHeads = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        var data = $scope.data.currItem.epm_fin_fee_allot_lines.splice(idx, 1);//删除项目数据
                        if(data[0].allot_amt > 0){
                            $scope.projects[data[0].project_id][0].allot_amt = numberApi
                                .sub($scope.projects[data[0].project_id][0].allot_amt, data[0].allot_amt);
                            $scope.fin[data[0].fee_record_id][0].allot_amt = numberApi
                                .sub($scope.fin[data[0].fee_record_id][0].allot_amt, data[0].allot_amt);
                        }
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_fin_fee_allot_lines);
                        idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                        if(idx == -1){
                            $scope.gridOptions_projects.hcApi.setRowData([]);
                            $scope.gridOptions_fin.hcApi.setRowData([]);
                        }
                        $scope.gridOptions_projects.hcApi
                            .setRowData($scope.projects[$scope.data.currItem.epm_fin_fee_allot_lines[idx].project_id]);
                        $scope.gridOptions_fin.hcApi
                            .setRowData($scope.fin[$scope.data.currItem.epm_fin_fee_allot_lines[idx].fee_record_id]);
                    }
                };

                /**
                 * 按费用记录的费用记录增加行
                 */
                $scope.addEpmFinHeads = function () {
                    $scope.gridOptions.api.stopEditing();
                    return $modal.openCommonSearch({
                            classId: 'epm_fin_fee_record',
                            postData: {
                                is_home : 2
                            },
                            action: 'search',
                            dataRelationName: 'fin_fee_records',
                            sqlWhere: "Creator='" + $scope.data.currItem.creator + "' and unallot_amt>0" ,
                            title: "费用记录",
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "费用记录单号",
                                        field: "fee_record_no"
                                    }, {
                                        headerName: "申请人",
                                        field: "creator"
                                    }, {
                                        headerName: "申请部门",
                                        field: "apply_org_name"
                                    }, {
                                        headerName: "报销部门",
                                        field: "org_name"
                                    }, {
                                        headerName: "预算类别",
                                        field: "bud_type_name"
                                    }, {
                                        headerName: "费用项目",
                                        field: "fee_name"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (response) {
                            $modal.openCommonSearch({
                                classId: 'epm_project',
                                postData: {
                                    search_flag: 7
                                },
                                checkbox: true,
                                action: 'search',
                                title: "工程项目",
                                gridOptions: {
                                    columnDefs: [
                                        {
                                            headerName: "项目编码",
                                            field: "project_code"
                                        }, {
                                            headerName: "项目名称",
                                            field: "project_name"
                                        }, {
                                            headerName: "报备时间",
                                            field: "report_time",
                                            type: '日期'
                                        }
                                    ]
                                }
                            })
                                .result//响应数据
                                .then(function (respon) {
                                    respon.forEach(function (val) {
                                        if($scope.fin[response.fee_record_id] == undefined){
                                            $scope.fin[response.fee_record_id] = [{
                                                fee_record_no : response.fee_record_no,
                                                allot_amt : 0 ,
                                                can_allot_amt : response.unallot_amt
                                            }];
                                        }
                                        if($scope.projects[val.project_id] == undefined){
                                            $scope.projects[val.project_id] = [{
                                                project_code : val.project_code,
                                                project_name : val.project_name,
                                                allot_amt : 0
                                            }];
                                        }
                                        $scope.data.currItem.epm_fin_fee_allot_lines.push({
                                            fee_record_id : response.fee_record_id,
                                            fee_record_no : response.fee_record_no,//单号
                                            creator : response.creator,//申请人
                                            apply_org_name : response.apply_org_name,//申请部门
                                            create_time : response.create_time,//申请日期
                                            org_name : response.org_name,//报销部门
                                            bud_type_name : response.bud_type_name,//预算类别
                                            fee_name : response.fee_name,//费用项目

                                            project_id : val.project_id,
                                            project_code : val.project_code,//项目编码
                                            project_name : val.project_name,//项目名称
                                            customer_code_name : val.customer_code + "-" + val.customer_name//客户信息
                                        });
                                    });
                                    //数据排序
                                    $scope.data.currItem.epm_fin_fee_allot_lines.sort(function (a, b) {
                                        return a.fee_record_no - b.fee_record_no;
                                    });
                                    //数据排序
                                    $scope.data.currItem.epm_fin_fee_allot_lines.sort(function (a, b) {
                                        return a.project_code - b.project_code;
                                    });
                                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                                    if(idx == -1){
                                        idx = 0;
                                    }
                                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_fin_fee_allot_lines);
                                    $scope.gridOptions_projects.hcApi
                                        .setRowData($scope.projects[$scope.data.currItem.epm_fin_fee_allot_lines[idx].project_id]);
                                    $scope.gridOptions_fin.hcApi
                                        .setRowData($scope.fin[$scope.data.currItem.epm_fin_fee_allot_lines[idx].fee_record_id]);
                                });
                        });
                };

                //隐藏右边按钮
                $scope.footerRightButtons.saveThenAdd.hide = true;

            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });
