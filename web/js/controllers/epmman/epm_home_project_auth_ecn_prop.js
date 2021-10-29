/**
 * 家装战略报备经销商变更
 * zengjinhua
 * 2020/03/11
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi) {
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
                    'intent_product'            //意向产品
                ];

                /*---------------------网格定义--------------------------*/
                // 经销商调整
                $scope.gridOptions = {
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
                                    // 值变更时清空经销商编码、名称
                                    args.data.customer_code = '';
                                    args.data.customer_name = '';
                                }
                            }
                        },
                        {
                            field: 'customer_code',
                            headerName: '经销商编码',
                            hcRequired: true,
                            editable: true,//不允许手动输入、粘贴
                            onCellDoubleClicked: function (args) {
                                if (!args.data.auth_ecn_type) {
                                    return swalApi.info('请先选择调整类型');
                                }
                                else {
                                    $scope.getCustomerDoubleClicked(args);
                                }
                            }
                        },
                        {
                            field: 'customer_name',
                            headerName: '经销商名称',
                            hcRequired: true,
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
                                return $scope.isFormReadonly() || !$scope.form.editing
                            }
                        },
                        customerAuthDel: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                $scope.delCustomerAuth && $scope.delCustomerAuth();
                            },
                            hide: function () {
                                return $scope.isFormReadonly() || !$scope.form.editing
                            }
                        }
                    }
                };

                // 项目有效现有经销商
                $scope.gridOptionsOfProjectauth = {
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'customer_code',
                            headerName: '经销商编码'
                        },
                        {
                            field: 'customer_name',
                            headerName: '经销商名称',
                            suppressAutoSize: true,
                            suppressSizeToFit: false,
                            width: 185,
                            minWidth: 185
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
                    $scope.gridOptions.hcApi.setRowData(bizData.project_auth_ecn_lines);
                    $scope.gridOptionsOfProjectauth.hcApi.setRowData(bizData.project_auth_ecn_original_lines);
                };

                /**
                 * 新增时数据初始化
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.ecn_type = 2;//家装战略变更

                    bizData.project_auth_ecn_lines = [];

                    bizData.project_auth_ecn_original_lines = [];
                };

                /*---------------------通用查询--------------------------*/
                $scope.commonSearch = {
                    //战略报备项目
                    strategy_project: {
                        postData: function () {
                            return {
                                report_type: 3, //战略报备
                                search_flag: 2//过滤正在发生变更的战略项目
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

                            // 清空明细数据
                            $scope.data.currItem.project_auth_ecn_lines = [];
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.project_auth_ecn_lines);

                            $scope.data.currItem.project_id = result.project_id;
                            $scope.data.currItem.project_code = result.project_code;
                            $scope.data.currItem.project_name = result.project_name;

                            // 根据所选编码，带出基本信息
                            $scope.baseFields.forEach(function (cur) {
                                $scope.data.currItem[cur] = result[cur];
                            });

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
                            $scope.data.currItem.project_auth_ecn_original_lines = result.epm_project_auths;
                            $scope.gridOptionsOfProjectauth.hcApi
                                .setRowData($scope.data.currItem.project_auth_ecn_original_lines);
                        });

                };

                /**
                 * 查询经销商 双击单元格
                 * @param args 行对象
                 */
                $scope.getCustomerDoubleClicked = function (args) {
                    if (!$scope.data.currItem.project_id) {
                        return swalApi.info('请先选择项目编码');
                    }

                    return $modal.openCommonSearch({  //打开模态框
                            classId: 'customer_org',  //类id
                            postData: {
                                search_flag:124
                            },
                            sqlWhere: function () {
                                //过滤掉已被选择的
                                var str = '1=1';

                                if ($scope.data.currItem.project_auth_ecn_lines.length > 0) {
                                    var lineData = angular.copy($scope.data.currItem.project_auth_ecn_lines);

                                    lineData.forEach(function (cur, index) {
                                        if (cur.customer_id) {
                                            if (str == '1=1') {
                                                str += ' and customer_id not in ( ' + cur.customer_id;
                                            } else {
                                                str += ',' + cur.customer_id;
                                            }
                                        }
                                    });
                                }

                                //补充括号
                                var regExLeft = new RegExp('[(]');
                                var regExRight = new RegExp('[)]');
                                if (regExLeft.test(str) && !regExRight.test(str)) {
                                    str += ')';
                                }

                                // 根据“调整类型”添加过滤条件
                                if (args.data.auth_ecn_type == 1) {
                                    //失效
                                    str += " and customer_id in(select e.customer_id from epm_report_auth e left join epm_project ep on ep.report_id = e.report_id where ep.project_id="
                                        + $scope.data.currItem.project_id + " and e.disabled<>2) ";
                                } else if (args.data.auth_ecn_type == 2) {
                                    //新增
                                    str += " and customer_id not in" +
                                        "(select distinct (e.customer_id) from epm_report_auth e left join epm_project ep on ep.report_id = e.report_id " +
                                        "where ep.project_id = " + $scope.data.currItem.project_id + ") "
                                } else {
                                    //复用
                                    str += " and customer_id in(select e.customer_id from epm_report_auth e left join epm_project ep on ep.report_id = e.report_id where ep.project_id="
                                        + $scope.data.currItem.project_id + " and e.disabled=2) ";
                                }

                                str += " and division_id = (select distinct (division_id) " +
                                    " from division_ent_rel where organization_id = " + userbean.entid + " )";

                                return str;
                            },
                            title: "经销商",  //模态框标题
                            gridOptions: {  //表格定义
                                columnDefs: [
                                    {
                                        field: "customer_code",
                                        headerName: "经销商编码"
                                    }, {
                                        field: "customer_name",
                                        headerName: "经销商名称"
                                    }
                                ]
                            }
                        })
                        .result  //响应数据
                        .then(function (result) {
                            args.data.customer_id = result.customer_id;
                            args.data.customer_code = result.customer_code;
                            args.data.customer_name = result.customer_name;
                            args.data.contact = result.contact;
                            args.data.tele = result.tele;
                            args.api.refreshView();  //刷新网格视图
                        });
                };

                /*---------------------数据校验--------------------------*/
                /**
                 * 保存前校验数据
                 * 1、至少包含一条明细
                 * @param invalidBox
                 * @returns {*}
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.stopEditingAllGrid();
                    $scope.hcSuper.validCheck(invalidBox);

                    if (!$scope.data.currItem.project_auth_ecn_lines.length) {
                        invalidBox.push('至少要有一行明细数据');
                    }

                    return invalidBox;
                };

                /*---------------------按钮事件定义--------------------------*/

                /**
                 * 新增明细 经销商调整
                 */
                $scope.addCustomerAuth = function () {
                    $scope.gridOptions.api.stopEditing();
                    //默认新增
                    var line = {
                        auth_ecn_type: 2
                    };

                    $scope.data.currItem.project_auth_ecn_lines.push(line);
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.project_auth_ecn_lines);
                };

                /**
                 * 删除明细 经销商调整
                 */
                $scope.delCustomerAuth = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.project_auth_ecn_lines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.project_auth_ecn_lines);
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


