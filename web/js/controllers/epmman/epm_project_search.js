/**
 * 项目查重
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', 'directive/hcTab', 'directive/hcTabPage', 'directive/hcBox'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope, $stateParams) {

                var single = $stateParams.report_type == 1,	//单体报备
                    strategic = $stateParams.report_type == 2;	//战略报备

                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    placeholder: "此处输入关键字进行搜索"
                };

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'project_name',
                            headerName: strategic ? '战略项目名称' : '工程名称',
                            cellRenderer: function (params) {
                                var result = params.node.data.project_name;
                                if(params.node.data.project_names != undefined){
                                    var arr = params.node.data.project_names.split(',');
                                    arr.forEach(function(value){
                                        var str = value.slice(13);
                                        result = result.replace(str, '<span style="color: red;">' + str + '</span>');
                                    });
                                }
                                return result;
                            }
                        },
                        {
                            field: 'address',
                            headerName: '详细地址',
                            hide: !single,
                            cellRenderer: function (params) {
                                var result = params.node.data.address;
                                if(params.node.data.addresss != undefined){
                                    var arr = params.node.data.addresss.split(',');
                                    arr.forEach(function(value){
                                        var str = value.slice(8);
                                        result = result.replace(str, '<span style="color: red;">' + str + '</span>');
                                    });
                                }
                                return result;
                            }
                        },
                        {
                            field: 'party_a_name',
                            headerName: '甲方名称',
                            cellRenderer: function (params) {
                                var result = params.node.data.party_a_name;
                                if(params.node.data.party_a_names != undefined){
                                    var arr = params.node.data.party_a_names.split(',');
                                    arr.forEach(function(value){
                                        var str = value.slice(13);
                                        result = result.replace(str, '<span style="color: red;">' + str + '</span>');
                                    });
                                }
                                return result;
                            }
                        },
                        {
                            field: 'party_b_name',
                            headerName: '乙方名称',
                            cellRenderer: function (params) {
                                var result = params.node.data.party_b_name;
                                if(params.node.data.party_b_names != undefined){
                                    var arr = params.node.data.party_b_names.split(',');
                                    arr.forEach(function(value){
                                        var str = value.slice(13);
                                        result = result.replace(str, '<span style="color: red;">' + str + '</span>');
                                    });
                                }
                                return result;
                            }
                        },
                        {
                            field: 'project_code',
                            headerName: single ? '单体报备号' : (strategic ? '战略报备号' : '报备号')
                        },
                        {
                            field: 'report_time',
                            headerName: '申报日期',
                            type: '日期'
                        },
                        {
                            field: 'stat',
                            headerName: '审核状态',
                            hcDictCode: '*'
                        },
                        {
                            field: 'stage_name',
                            headerName: '项目当前进度'
                        },
                        {
                            field: 'division_name',
                            headerName: '所属事业部',
                            hide: !single
                        },
                        {
                            field: 'customer_code',
                            headerName: '经销商编号',
                            hide: !single
                        },
                        {
                            field: 'customer_name',
                            headerName: '经销商名称',
                            hide: !single
                        },
                        {
                            field: 'trading_company_name',
                            headerName: '交易公司'
                        },
                        {
                            field: 'manager',
                            headerName: single ? '单体项目经理' : (strategic ? '战略项目经理' : '项目经理')
                        },
                        {
                            field: 'pdt_line',
                            headerName: '产品线',
                            hcDictCode: 'epm.pdt_line'
                        },
                        {
                            field: 'operating_mode',
                            headerName: '管理类型',
                            hcDictCode: 'epm.operating_mode',
                            hide: !strategic
                        },
                        {
                            field: 'project_source',
                            headerName: '工程类型',
                            hcDictCode: 'epm.project_source',
                            hide: !single
                        },

                        {
                            field: 'party_a_link_person',
                            headerName: '甲方联系人'
                        },
                        {
                            field: 'party_a_phone',
                            headerName: '甲方联系电话'
                        },
                        {
                            field: 'party_b_link_person',
                            headerName: '乙方联系人'
                        },
                        {
                            field: 'party_b_phone',
                            headerName: '乙方联系电话'
                        },
                        {
                            field: 'rel_project_code',
                            headerName: '战略报备号',
                            hide: !single
                        },
                        {
                            field: 'rel_project_name',
                            headerName: '战略项目名称',
                            hide: !single
                        },
                        {
                            field: 'operating_mode',
                            headerName: '管理类型',
                            hcDictCode: 'epm.operating_mode',
                            hide: !single
                        },

                        {
                            field: 'strategic_stage',
                            headerName: '战略对接进度',
                            hide: !strategic
                        },
                        {
                            field: 'is_local',
                            headerName: '本地/异地',
                            hcDictCode: 'epm.is_local',
                            hide: !single
                        },
                        {
                            field: 'project_type',
                            headerName: single ? '业主类型' : '项目类型',
                            hcDictCode: 'epm.project_type'
                        },
                        {
                            field: 'background',
                            headerName: '背景关系',
                            hcDictCode: 'epm.background'
                        },
                        {
                            field: 'predict_proj_qty',
                            headerName: '预计单体项目数量',
                            hide: !strategic
                        },
                        {
                            field: 'site_area',
                            headerName: '工程建筑面积',
                            hide: !single
                        },
                        {
                            field: 'predict_pdt_qty',
                            headerName: '工程用量（套）'
                        },
                        {
                            field: 'province_name',
                            headerName: '省',
                            hide: !single
                        },
                        {
                            field: 'city_name',
                            headerName: '市',
                            hide: !single
                        },
                        {
                            field: 'area_name',
                            headerName: '区',
                            hide: !single
                        },

                        {
                            field: 'construction_stage',
                            headerName: '工程施工进度',
                            hide: !single
                        },
                        {
                            field: 'completion_date',
                            headerName: '竣工日期',
                            type: '日期',
                            hide: !single
                        },
                        {
                            field: 'predict_sign_date',
                            headerName: '预计签订日期',
                            type: '日期',
                            hide: !strategic
                        },
                        {
                            field: 'predict_sales_amount',
                            headerName: '预计销售收入（万元）',
                            type: '万元',
                            hide: !strategic
                        },
                        {
                            field: 'intent_product',
                            headerName: '工程意向产品'
                        },
                        {
                            field: 'competitor',
                            headerName: '竞争对手'
                        },
                        {
                            field: 'stage_desc',
                            headerName: '项目进度描述',
                            hide: !single
                        },
                        {
                            field: 'dealer_follower',
                            headerName: '经销商现场跟进人',
                            hide: !single
                        },
                        {
                            field: 'dealer_follower_phone',
                            headerName: '经销商跟进人电话',
                            hide: !single
                        },
                        {
                            field: 'own_follower',
                            headerName: '乐华现场跟进人',
                            hide: !single
                        },
                        {
                            field: 'own_follower_phone',
                            headerName: '乐华跟进人电话',
                            hide: !single
                        },
                        {
                            field: 'need_sample',
                            headerName: '产品送样',
                            type: '是否',
                            hide: !single
                        },
                        {
                            field: 'need_quote',
                            headerName: '产品报价',
                            type: '是否',
                            hide: !single
                        }
                    ],
                    hcOpenState: {
                        '*': {
                            name: function(){
                                var name = Switch($scope.data.report_type, '==')
                                    .case(1, 'epmman.epm_report_prop')		                    //单体项目
                                    .case(2, 'epmman.epm_strategy_report_prop')		            //战略项目
                                    .case(3, 'epmman.epm_home_strategy_report_prop')			//家装战略
                                    .case(4, 'epmman.epm_home_report_prop')		                //家装单体
                                    .result;
                                return name;
                            },
                            idField: 'report_id'
                        }
                    }
                };

                $scope.gridOptions1 = {
                    hcClassId: "epm_project",
                    hcPostData : {
                        search_flag: $stateParams.search_flag //查询场景
                    },
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'project_name',
                            headerName: strategic ? '战略项目名称' : '工程名称'
                        },
                        {
                            field: 'address',
                            headerName: '详细地址',
                            hide: !single
                        },
                        {
                            field: 'party_a_name',
                            headerName: '甲方名称'
                        },
                        {
                            field: 'project_code',
                            headerName: single ? '单体报备号' : (strategic ? '战略报备号' : '报备号')
                        },
                        {
                            field: 'report_time',
                            headerName: '申报日期',
                            type: '日期'
                        },
                        {
                            field: 'stat',
                            headerName: '审核状态',
                            hcDictCode: '*'
                        },
                        {
                            field: 'stage_name',
                            headerName: '项目当前进度'
                        },
                        {
                            field: 'division_name',
                            headerName: '所属事业部',
                            hide: !single
                        },
                        {
                            field: 'customer_code',
                            headerName: '经销商编号',
                            hide: !single
                        },
                        {
                            field: 'customer_name',
                            headerName: '经销商名称',
                            hide: !single
                        },
                        {
                            field: 'trading_company_name',
                            headerName: '交易公司'
                        },
                        {
                            field: 'manager',
                            headerName: single ? '单体项目经理' : (strategic ? '战略项目经理' : '项目经理')
                        },
                        {
                            field: 'pdt_line',
                            headerName: '产品线',
                            hcDictCode: 'epm.pdt_line'
                        },
                        {
                            field: 'operating_mode',
                            headerName: '管理类型',
                            hcDictCode: 'epm.operating_mode',
                            hide: !strategic
                        },
                        {
                            field: 'project_source',
                            headerName: '工程类型',
                            hcDictCode: 'epm.project_source',
                            hide: !single
                        },

                        {
                            field: 'party_a_link_person',
                            headerName: '甲方联系人'
                        },
                        {
                            field: 'party_a_phone',
                            headerName: '甲方联系电话'
                        },
                        {
                            field: 'party_b_name',
                            headerName: '乙方名称'
                        },
                        {
                            field: 'party_b_link_person',
                            headerName: '乙方联系人'
                        },
                        {
                            field: 'party_b_phone',
                            headerName: '乙方联系电话'
                        },
                        {
                            field: 'rel_project_code',
                            headerName: '战略报备号',
                            hide: !single
                        },
                        {
                            field: 'rel_project_name',
                            headerName: '战略项目名称',
                            hide: !single
                        },
                        {
                            field: 'operating_mode',
                            headerName: '管理类型',
                            hcDictCode: 'epm.operating_mode',
                            hide: !single
                        },

                        {
                            field: 'strategic_stage',
                            headerName: '战略对接进度',
                            hide: !strategic
                        },
                        {
                            field: 'is_local',
                            headerName: '本地/异地',
                            hcDictCode: 'epm.is_local',
                            hide: !single
                        },
                        {
                            field: 'project_type',
                            headerName: single ? '业主类型' : '项目类型',
                            hcDictCode: 'epm.project_type'
                        },
                        {
                            field: 'background',
                            headerName: '背景关系',
                            hcDictCode: 'epm.background'
                        },
                        {
                            field: 'predict_proj_qty',
                            headerName: '预计单体项目数量',
                            hide: !strategic
                        },
                        {
                            field: 'site_area',
                            headerName: '工程建筑面积',
                            hide: !single
                        },
                        {
                            field: 'predict_pdt_qty',
                            headerName: '工程用量（套）'
                        },
                        {
                            field: 'province_name',
                            headerName: '省',
                            hide: !single
                        },
                        {
                            field: 'city_name',
                            headerName: '市',
                            hide: !single
                        },
                        {
                            field: 'area_name',
                            headerName: '区',
                            hide: !single
                        },

                        {
                            field: 'construction_stage',
                            headerName: '工程施工进度',
                            hide: !single
                        },
                        {
                            field: 'completion_date',
                            headerName: '竣工日期',
                            type: '日期',
                            hide: !single
                        },
                        {
                            field: 'predict_sign_date',
                            headerName: '预计签订日期',
                            type: '日期',
                            hide: !strategic
                        },
                        {
                            field: 'predict_sales_amount',
                            headerName: '预计销售收入（万元）',
                            type: '万元',
                            hide: !strategic
                        },
                        {
                            field: 'intent_product',
                            headerName: '工程意向产品'
                        },
                        {
                            field: 'competitor',
                            headerName: '竞争对手'
                        },
                        {
                            field: 'stage_desc',
                            headerName: '项目进度描述',
                            hide: !single
                        },
                        {
                            field: 'dealer_follower',
                            headerName: '经销商现场跟进人',
                            hide: !single
                        },
                        {
                            field: 'dealer_follower_phone',
                            headerName: '经销商跟进人电话',
                            hide: !single
                        },
                        {
                            field: 'own_follower',
                            headerName: '乐华现场跟进人',
                            hide: !single
                        },
                        {
                            field: 'own_follower_phone',
                            headerName: '乐华跟进人电话',
                            hide: !single
                        },
                        {
                            field: 'need_sample',
                            headerName: '产品送样',
                            type: '是否',
                            hide: !single
                        },
                        {
                            field: 'need_quote',
                            headerName: '产品报价',
                            type: '是否',
                            hide: !single
                        }
                    ],
                    hcOpenState: {
                        '*': {
                            name: function(){
                                var name = Switch($scope.data.report_type, '==')
                                    .case(1, 'epmman.epm_report_prop')		                    //单体项目
                                    .case(2, 'epmman.epm_strategy_report_prop')		            //战略项目
                                    .case(3, 'epmman.epm_home_strategy_report_prop')			//家装战略
                                    .case(4, 'epmman.epm_home_report_prop')		                //家装单体
                                    .result;
                                return name;
                            },
                            idField: 'report_id'
                        }
                    }
                };

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                //表格切换定义
                $scope.kpi_tab = {};
                $scope.kpi_tab.score = {
                    title: '查重',
                    active: true
                };
                $scope.kpi_tab.completion = {
                    title: '查询'
                };


                $scope.search = function () {

                    //没有勾选时，清空表格，不展示任何数据
                    if ($scope.data.by_project_name == 1 && $scope.data.by_address == 1
                        && $scope.data.by_party_a_name == 1 && $scope.data.by_party_b_name == 1) {
                        return $scope.gridOptions.hcApi.setRowData([]);
                    }

                    $scope.data.report_id = $stateParams.report_id;
                    return requestApi({
                        classId: "epm_report",
                        action: 'checkReport',
                        data: $scope.data
                    }).then(function (data) {
                        $scope.gridOptions.hcApi.setRowData(data.epm_reports);
                    });
                }

                $scope.searchByKeyword = function () {
                    $scope.gridOptions1.hcApi.searchByKeyword($scope.data.keyword);
                }
                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                        .then(function(){
                            return requestApi({
                                classId: "epm_report",
                                action: 'select',
                                data: {report_id: $stateParams.report_id}
                            }).then(function (data) {
                                angular.extend($scope.data, data);
                                $scope.data.search_flag = $stateParams.search_flag;
                                $scope.data.by_project_name = 2;
                                $scope.data.by_address = 2;
                                $scope.data.by_party_a_name = 2;
                                $scope.data.by_party_b_name = 2;
                                if($scope.data.report_type == 3 || $scope.data.report_type == 4){
                                    $scope.data.by_party_a_name = 1;
                                    $scope.data.by_party_b_name = 1;
                                }
                                $scope.search();
                            })
                        });
                };
/*
                var doInit = function () {
                    return requestApi({
                        classId: "epm_report",
                        action: 'select',
                        data: {report_id: $stateParams.report_id}
                    }).then(function (data) {
                        angular.extend($scope.data, data);
                        $scope.data.by_project_name = 2;
                        $scope.data.by_address = 2;
                        $scope.data.by_party_a_name = 2;
                        $scope.search();
                    });
                }();
*/

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