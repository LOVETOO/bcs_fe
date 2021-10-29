/**
 * 单体家装报备变更
 * zengjinhua
 * 2020/03/17
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', '$q'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, $q) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                //继承基础控制器
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*---------------------数据定义--------------------------*/
                // 根据“项目编码”带出的基本信息字段
                $scope.baseFields = [
                    'report_time',              //报备时间
                    'pdt_line',                 //产品线
                    'trading_company_name',     //交易公司
                    'competitive_brand',        //竞争品牌
                    'cooperation_area',         //合作区域
                    'agent_opinion',            //审批经办人意见
                    'agent',                    //审批经办人
                    'strac_coop_inv_region',    //战略合作范围涉及区域
                    'natureb_usiness',          //公司性质
                    'line_business',            //业务范围
                    'background',               //背景关系
                    'area_full_name',           //总部所在地
                    'address',                  //详细地址
                    'own_follower',             //总部联系人
                    'follow_people_duty',       //联系人职务
                    'own_follower_phone',       //联系人电话
                    'predict_sales_amount',     //年销售额
                    'intent_product',           //意向产品
                    'project_valid_date',       //报备有效期至
                    'customer_code',            //经销商编码
                    'customer_name',            //经销商名称
                    'dealer_follower',          //经办人
                    'dealer_follower_phone',    //经办人电话
                    'business_name',            //营业执照名称
                    'project_legal_name'        //公司法人
                ];

                /*---------------------网格定义--------------------------*/

                //网点调整
                $scope.gridOptionsOfBranchAuth = {
                    defaultColDef: {
                        editable: true
                    },
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'auth_ecn_type',
                            headerName: '调整类型',
                            hcDictCode: 'epm.auth_ecn_type',// 1失效 2新增
                            hcRequired: true,
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue) {
                                    return;
                                } else {
                                    // 值变更时清空网点编码、名称
                                    args.data.branch_message_code = '';
                                    args.data.branch_message_name = '';
                                }
                            }
                        },
                        {
                            field: 'branch_message_code',
                            headerName: '网点编码',
                            editable: true,//不允许手动输入、粘贴
                            onCellDoubleClicked: function (args) {
                                if (!args.data.auth_ecn_type) {
                                    return swalApi.info('请先选择调整类型');
                                }
                                else {
                                    $scope.getBranchDoubleClicked(args);
                                }
                            }
                        },
                        {
                            field: 'branch_message_name',
                            headerName: '网点名称',
                            editable: false
                        },
                        {
                            field: 'remark',
                            headerName: '备注'
                        }
                    ],
                    hcButtons: {
                        customerAuthAdd: {
                            icon: 'iconfont hc-add',
                            click: function () {
                                $scope.addCustomerAuth && $scope.addCustomerAuth();
                            },
                            hide: function () {
                                return $scope.isFormReadonly() || !$scope.form.editing || $scope.data.currItem.change_type != 2
                            }
                        },
                        customerAuthDel: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                $scope.delCustomerAuth && $scope.delCustomerAuth();
                            },
                            hide: function () {
                                return $scope.isFormReadonly() || !$scope.form.editing || $scope.data.currItem.change_type != 2
                            }
                        }
                    }
                };

                //现有网点调整
                $scope.gridOptionsOfBranch = {
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'branch_message_code',
                            headerName: '网点编码'
                        },
                        {
                            field: 'branch_message_name',
                            headerName: '网点名称'
                        },
                        {
                            field: 'disabled',
                            headerName: '已失效',
                            type: '是否'
                        }
                    ]
                };

                /*---------------------初始化&数据设置--------------------------*/
                /**
                 * 查看时数据设置
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    $scope.gridOptionsOfBranchAuth.hcApi.setRowData(bizData.epm_report_auth_branch_ecns);
                    $scope.gridOptionsOfBranch.hcApi.setRowData(bizData.epm_report_auth_branchs);
                };

                /**
                 * 新增时数据初始化
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.ecn_type = 4;//单体家装报备变更
                    bizData.change_type = 1;//变更附件

                    bizData.epm_report_auth_branchs = [];//网点变更前数据
                    bizData.epm_report_auth_branch_ecns = [];//变更后数据
                };

                /**
                 * 查询网点 双击单元格
                 * @param args 行对象
                 */
                $scope.getBranchDoubleClicked = function (args) {
                    $scope.gridOptionsOfBranchAuth.api.stopEditing();
                    if (!$scope.data.currItem.project_id) {
                        return swalApi.info('请先选择单体家装编码');
                    }

                    return $modal.openCommonSearch({  //打开模态框
                            classId: 'epm_branch_message',  //类id
                            postData: {
                                search_flag : 4,
                                customer_code : $scope.data.currItem.customer_code,
                                auth_ecn_type : args.data.auth_ecn_type,
                                project_id : $scope.data.currItem.project_id,
                                epm_branch_message_lines : $scope.data.currItem.epm_report_auth_branch_ecns
                            }
                        })
                        .result  //响应数据
                        .then(function (branchs) {
                            args.data.branch_message_id = branchs.branch_message_id;
                            args.data.branch_message_code = branchs.branch_message_code;
                            args.data.branch_message_name = branchs.branch_message_name;
                            args.data.rel_customer_code = $scope.data.currItem.customer_code;
                            $scope.gridOptionsOfBranchAuth.api.refreshCells({
                                rowNodes: [args.node],
                                force: true,//改变了值才进行刷新
                                columns: $scope.gridOptionsOfBranchAuth.columnApi.getColumns(['branch_message_code'
                                    ,'branch_message_name'])
                            });
                        });
                };

                /*---------------------通用查询--------------------------*/
                $scope.commonSearch = {
                    //单体家装报备
                    strategy_project: {
                        postData: function () {
                            return {
                                report_type: 4, //单体报备
                                search_flag: 2//过滤正在发生变更的报备项目
                            };
                        },
                        sqlWhere: function () {
                            var sqlwhere = " 1 = 1 "
                            if (!userbean.isAdmin) {
                                sqlwhere += " and (creator = '" + userbean.loginuserifnos[0].username + "' " +
                                    " or " +
                                    " creator = '" + userbean.loginuserifnos[0].userid + "')"
                            }
                            return sqlwhere;
                        },
                        afterOk: function (result) {
                            // 如果选中的是当前已选择的项目，不进行处理
                            if ($scope.data.currItem.project_id == result.project_id) {
                                return;
                            }

                            $scope.data.currItem.project_id = result.project_id;
                            $scope.data.currItem.project_code = result.project_code;
                            $scope.data.currItem.project_name = result.project_name;

                            // 根据所选编码，带出基本信息
                            $scope.baseFields.forEach(function (cur) {
                                $scope.data.currItem[cur] = result[cur];
                            });
                            getReportAttach();
                            $scope.getProjectAuth();
                        },
                        beforeOk: function (result) {
                            return requestApi
                                .post({
                                    classId: 'epm_project_auth_ecn',
                                    action: 'checkbeforesave',
                                    data: {
                                        project_id: result.project_id,
                                        project_auth_ecn_id : $scope.data.currItem.project_auth_ecn_id > 0 ?
                                            $scope.data.currItem.project_auth_ecn_id : 0
                                    }
                                })
                                .then(function (data) {
                                    if(data.project_auth_ecns.length > 0){
                                        swalApi.info('该战略存在有未审批完毕的变更单【'
                                                + data.project_auth_ecns[0].project_auth_ecn_code
                                                + '】，请检查');
                                        return false;
                                    }else{
                                        return result;
                                    }
                                });
                        }
                    }
                };

                /*---------------------单元格查询--------------------------*/

                /**
                 * 获取项目的所有现有经销商
                 */
                $scope.getProjectAuth = function () {
                    requestApi.post('epm_project_auth_ecn'
                        , 'getreportauth'
                        , {project_id: $scope.data.currItem.project_id})
                        .then(function (result) {
                            $scope.data.currItem.epm_report_auth_branchs = result.epm_report_auth_branchs;
                            $scope.gridOptionsOfBranch.hcApi.setRowData($scope.data.currItem.epm_report_auth_branchs);
                        });
                };

                /**
                 * 获取单体报备附件
                 */
                function getReportAttach() {
                    requestApi.post('epm_project_auth_ecn'
                        , 'getreportattach'
                        , {project_id: $scope.data.currItem.project_id})
                        .then(function (result) {
                            $scope.projAttachController.setAttaches(result.epm_project_attachs);
                        });
                }

                /*---------------------数据校验--------------------------*/
                /**
                 * 保存前校验数据
                 * @param invalidBox
                 * @returns {*}
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.stopEditingAllGrid();
                    $scope.hcSuper.validCheck(invalidBox);

                    if($scope.data.currItem.change_type == 1){
                        //附件变更
                        if($scope.projAttachController.getAttaches().length <  3){
                            invalidBox.push("请最少上传三个附件");
                        }
                    }else{
                        //网点变更
                        if($scope.data.currItem.epm_report_auth_branch_ecns.length < 1){
                            invalidBox.push("请最少维护一行网点变更");
                        }
                    }
                    return invalidBox;
                };

                /**
                 * 标签页切换事件
                 */
                $scope.onTabChange = function (params) {
                    $q.when(params)
                        .then($scope.hcSuper.onTabChange)
                        .then(function () {
                            if($scope.data.currItem.stat == 1 && $scope.data.currItem.change_type == 2){
                                if(params.id == 'base'){
                                    //切换单据详情
                                    $scope.isFormReadonly = function(){
                                        return false;
                                    }
                                }else{
                                    $scope.isFormReadonly = function(){
                                        return true;
                                    }
                                }
                            }
                        });
                };

                /**
                 * 改变变更类型事件
                 */
                $scope.onChange = function () {
                    if($scope.data.currItem.change_type == 1){
                        /**
                         * 修改为变更附件
                         * 情况变更网点网格数据
                         */
                        $scope.data.currItem.epm_report_auth_branch_ecns = [];
                        $scope.gridOptionsOfBranchAuth.hcApi.setRowData($scope.data.currItem.epm_report_auth_branch_ecns);
                    }else{
                        /**
                         * 修改为变更网点
                         * 重置附件
                         */
                        getReportAttach();
                    }
                }

                /*---------------------按钮事件定义--------------------------*/

                /**
                 * 新增明细 网点调整
                 */
                $scope.addCustomerAuth = function () {
                    $scope.gridOptionsOfBranchAuth.api.stopEditing();
                    //默认新增
                    var line = {
                        auth_ecn_type: 2
                    };
                    $scope.data.currItem.epm_report_auth_branch_ecns.push(line);
                    $scope.gridOptionsOfBranchAuth.hcApi.setRowData($scope.data.currItem.epm_report_auth_branch_ecns);
                };

                /**
                 * 删除明细 网点调整
                 */
                $scope.delCustomerAuth = function () {
                    var idx = $scope.gridOptionsOfBranchAuth.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_report_auth_branch_ecns.splice(idx, 1);
                        $scope.gridOptionsOfBranchAuth.hcApi.setRowData($scope.data.currItem.epm_report_auth_branch_ecns);
                    }
                };

                /**
                 * 查看地图
                 */
                $scope.showMap = function () {
                    var address
                    if ($scope.data.currItem.area_full_name) {
                        address = $scope.data.currItem.area_full_name + $scope.data.currItem.address;
                    }
                    top.require(['openBizObj'], function (openBizObj) {
                        openBizObj({
                            stateName: 'baseman.map',
                            params: {
                                address: encodeURI(address)
                            }
                        });
                    });
                }

            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.registerController({
            module: module,
            controller: controller
        });
    }
);


