
define(
        ['module', 'controllerApi', 'openBizObj', 'requestApi', 'swalApi', 'echarts', 'numberApi', 'gridApi', 'promiseApi', 'wfApi', 'webSocketApi', 'directive/hcImg', 'directive/hcSortable', 'directive/hcModal', 'directive/hcChart'], 
        function (module, controllerApi, openBizObj, requestApi, swalApi, echarts, numberApi, gridApi, promiseApi, wfApi, webSocketApi) {
    'use strict';

    var controller = ['$scope', '$state', '$modal', '$q', function oa_myhome($scope, $state, $modal, $q) {
        $scope.data = {};

        $scope.data.currItem = { "works": [], "workstat": 1, "objattachs": [] };
        $scope.data.currItem.menus = [];
        $scope.data.currItem.workstatnames = ['当前', '未到达', '已完成', '我启动'];
        $scope.i = 0//控制菜单左移右移
        $scope.downBool = true;
        $scope.menurows = 1;//快捷应用所占行数 
        $scope.data.currItem.notice = [];//通知公告
        //是否有权限查看报表
        $scope.expertJurisdiction = false;

        //是否有权限查看报表详情
        $scope.openExpertJurisdiction = false;

        if(user.userid == 'admin'){//判断登陆用户
            $scope.expertJurisdiction = true;
            $scope.openExpertJurisdiction = true;
        }else{//判断用的角色代号
            user.roleofusers.some(function(value){
                if(value.roleid == 'admins' || value.roleid == 'home_page_funnel_plots_detail'){
                    $scope.expertJurisdiction = true;
                    $scope.openExpertJurisdiction = true;
                    return true;
                }
            });

            if(!$scope.expertJurisdiction){
                user.roleofusers.some(function(value){
                    if(value.roleid == 'home_page_funnel_plots'){
                        $scope.expertJurisdiction = true;
                        return true;
                    }
                });
            }
        }
        
        /* 报表时间日期查询 */
        $scope.now_year = new Date().getFullYear();//当年
        $scope.now_month = new Date().getMonth() + 1;//当月
        $scope.now_day = new Date().getDate();//当日

        
        /**
         * 首页报表配置参数
         */
        $scope.parameterConfiguration = {
            /**
             * key : 配置参数，点击方法传送名称
             * action : 查询报表具体数据发送的请求方法
             * title : 打开模态框的标题
             * sum : 是否需要进行合计
             * pinned : 合计使用的对象,需要合计时配置合计字段
             * columnDefs : 打开模态框的网格columnDefs配置
             */
            proj : {/* 单体报备 */
                action : 'selectprojectsql',
                title : '单体报备',
                sum : false,
                columnDefs : [//单体报备网格
                    {
                        type: '序号'
                    }, 
                    {
                        field: 'project_valid',
                        headerName: '有效状态',
                        hcDictCode : 'valid'
                    },
                    {
                        field: 'project_code',
                        headerName: '项目编码'
                    },
                    {
                        field: 'project_name',
                        headerName: '项目名称'
                    },
                    {
                        field: 'customer_code',
                        headerName: '客户编码'
                    },
                    {
                        field: 'customer_name',
                        headerName: '客户名称'
                    },
                    {
                        field: 'province_name',
                        headerName: '省'
                    },
                    {
                        field: 'city_name',
                        headerName: '市'
                    },
                    {
                        field: 'area_name',
                        headerName: '区'
                    },
                    {
                        field: 'address',
                        headerName: '详细地址'
                    },
                    {
                        field: 'stage_name',
                        headerName: '项目当前进度'
                    },
                    {
                        field: 'project_source',
                        headerName: '工程类型',
                        hcDictCode : 'epm.project_source'
                    },
                    {
                        field: 'party_a_name',
                        headerName: '甲方名称'
                    },
                    {
                        field: 'party_b_name',
                        headerName: '乙方名称'
                    },
                    {
                        field: 'rel_project_name',
                        headerName: '战略工程名称'
                    },
                    {
                        field: 'is_local',
                        headerName: '本地/异地',
                        hcDictCode : 'epm.is_local'
                    },
                    {
                        field: 'construction_stage',
                        headerName: '工程施工进度'
                    },
                    {
                        field: 'intent_product',
                        headerName: '工程意向产品'
                    }
                ]
            },
            disount : {/* 折扣申请 */
                action : 'selectdisountsql',
                title : '折扣申请',
                sum : true,
                pinned : ['contract_amt', 'discounted_amount'],
                columnDefs :[//折扣申请网格
                    {
                        type: '序号'
                    }, 
                    {
                        field: 'discount_apply_code',
                        headerName: '折扣单号'
                    },
                    {
                        field: 'customer_code',
                        headerName: '客户编码'
                    },
                    {
                        field: 'customer_name',
                        headerName: '客户名称'
                    },
                    {
                        field: 'project_code',
                        headerName: '项目编码'
                    },
                    {
                        field: 'project_name',
                        headerName: '项目名称'
                    },
                    {
                        field: 'contract_code',
                        headerName: '合同编码'
                    },
                    {
                        field: 'contract_name',
                        headerName: '合同名称'
                    },
                    {
                        field: 'discount_type',
                        headerName: '折扣类型',
                        hcDictCode : 'epm.discount_type'
                    },
                    {
                        field: 'discount_rate',
                        headerName: '审批折扣率'
                    },
                    {
                        field: 'contract_amt',
                        headerName: '合同金额',
                        type : '金额'
                    },
                    {
                        field: 'discounted_amount',
                        headerName: '折扣金额',
                        type : '金额'
                    }
                ]
            },
            saoutbill : {/* 要货订单 */
                action : 'selectsaoutbillsql',
                title : '要货订单',
                sum : true,
                pinned : ['amount_total', 'wtamount_bill'],
                columnDefs :[//要货订单网格
                    {
                        type: '序号'
                    }, 
                    {
                        field: 'sa_salebillno',
                        headerName: '要货单号'
                    },
                    {
                        field: 'date_invbill',
                        headerName: '订单日期',
                        type : '日期'
                    },
                    {
                        field: 'customer_code',
                        headerName: '客户编码'
                    },
                    {
                        field: 'customer_name',
                        headerName: '客户名称'
                    },
                    {
                        field: 'project_code',
                        headerName: '项目编码'
                    },
                    {
                        field: 'project_name',
                        headerName: '项目名称'
                    },
                    {
                        field: 'contract_code',
                        headerName: '合同编码'
                    },
                    {
                        field: 'contract_name',
                        headerName: '合同名称'
                    },
                    {
                        field: 'amount_total',
                        headerName: '折前总金额',
                        type : '金额'
                    },
                    {
                        field: 'wtamount_bill',
                        headerName: '折后总金额',
                        type : '金额'
                    }
                ]  
            },
            projectout : {/* 工程出库 */
                action : 'selectprojectoutsql',
                title : '工程出库',
                sum : true,
                pinned : ['wtamount_total_f'],
                columnDefs :[//工程出库网格
                    {
                        type: '序号'
                    }, 
                    {
                        field: 'invbill_sap_no',
                        headerName: 'ERP出库单号'
                    },
                    {
                        field: 'outbill_date',
                        headerName: '发货日期',
                        type : '日期'
                    },
                    {
                        field: 'customer_code',
                        headerName: '客户编码'
                    },
                    {
                        field: 'customer_name',
                        headerName: '客户名称'
                    },
                    {
                        field: 'contract_code',
                        headerName: '合同编码'
                    },
                    {
                        field: 'contract_name',
                        headerName: '合同名称'
                    },
                    {
                        field: 'delivery_base',
                        headerName: '发货基地'
                    },
                    {
                        field: 'wtamount_total_f',
                        headerName: '总金额',
                        type : '金额'
                    }
                ]
            }
        }

        /**
         * 查询报表字段数据
         */
        $scope.searchStatement = function (){
            /** 
             * 首页展示数组配置 
             * */
            $scope.data.currItem.statementProjs = [
                {/* 单体报备 */
                    title : '单体报备',
                    nowDay : $scope.now_month + '月' + $scope.now_day + '日',
                    nowMonth : $scope.now_month + '月',
                    nowYear : $scope.now_year + '年',
                    dayNum : '0',
                    monthNum : '0',
                    yearNum : '0',
                    dayNumName : 'project_day',
                    monthNumName : 'project_month',
                    yearNumName : 'project_year',
                    openParam : 'proj',
                    uint : '单',
                    isMillesimal : false
                },
                {/* 折扣申请 */
                    title : '折扣申请',
                    nowDay : $scope.now_month + '月' + $scope.now_day + '日',
                    nowMonth : $scope.now_month + '月',
                    nowYear : $scope.now_year + '年',
                    dayNum : '0',
                    monthNum : '0',
                    yearNum : '0',
                    dayNumName : 'disount_day',
                    monthNumName : 'disount_month',
                    yearNumName : 'disount_year',
                    openParam : 'disount',
                    uint : '万元',
                    isMillesimal : true
                },
                {/* 要货订单 */
                    title : '要货订单',
                    nowDay : $scope.now_month + '月' + $scope.now_day + '日',
                    nowMonth : $scope.now_month + '月',
                    nowYear : $scope.now_year + '年',
                    dayNum : '0',
                    monthNum : '0',
                    yearNum : '0',
                    dayNumName : 'sa_out_bill_day',
                    monthNumName : 'sa_out_bill_month',
                    yearNumName : 'sa_out_bill_year',
                    openParam : 'saoutbill',
                    uint : '万元',
                    isMillesimal : true
                },
                {/* 工程出库 */
                    title : '工程出库',
                    nowDay : $scope.now_month + '月' + $scope.now_day + '日',
                    nowMonth : $scope.now_month + '月',
                    nowYear : $scope.now_year + '年',
                    dayNum : '0',
                    monthNum : '0',
                    yearNum : '0',
                    dayNumName : 'project_out_day',
                    monthNumName : 'project_out_month',
                    yearNumName : 'project_out_year',
                    openParam : 'projectout',
                    uint : '万元',
                    isMillesimal : true
                }
            ]
            return requestApi
                .post({
                    classId: 'epm_statement',
                    action: 'searchall',
                    data: {}
                })
                .then(function (response) {
                    $scope.data.currItem.statementProjs.forEach(function(value){
                        //数据赋值
                        value.dayNum = numFormatNumber(response[value.dayNumName], value.isMillesimal) + value.uint;
                        value.monthNum = numFormatNumber(response[value.monthNumName], value.isMillesimal) + value.uint;
                        value.yearNum = numFormatNumber(response[value.yearNumName], value.isMillesimal) + value.uint;
                    });
                });
        }

        /**
         * 格式化金额方法
         * @param {Integer} num 
         * @param {boolean} isMillesimal 是否需要格式化
         */
        function numFormatNumber (num,isMillesimal){
            if(isMillesimal){
                return numberApi.formatNumber(''+ num, 0);
            }else{
                return num;
            }
        }

        /**
         * 查询报表具体数据
         */
        $scope.openDataState = function(name, flag){
            if($scope.openExpertJurisdiction){
                //初始化数据值
                var response = {};
                response.title = $scope.parameterConfiguration[name].title;
                response.name = name;
                response.flag = flag;
                //打开模态框
                $scope.openStatementModal(response);
            }
        }

        /**
         * 打开报表模态框
         */
        $scope.openStatementModal = function (data){
            $scope.statementModalBox.open({//打开模态框
                size: 'lg',
                controller: ['$scope', function ($modalScope) {
                    $modalScope.title = data.title;
                    $modalScope.gridOptionStatement = {
                        columnDefs: $scope.parameterConfiguration[data.name].columnDefs,
                        hcRequestAction:$scope.parameterConfiguration[data.name].action,
                        hcClassId:'epm_statement',
                        hcDataRelationName:'statement_now_datas',
                        hcAfterRequest:function(args){
                            data.statement_now_datas = args.statement_now_datas;
                            $modalScope.sum();
                        },
                        hcBeforeRequest: function (searchObj) {//发送查询条件
                            searchObj.search_flag = 2;
                            searchObj.flag = data.flag;
                        }
                    };
                    if($scope.parameterConfiguration[data.name].sum){
                        $modalScope.gridOptionStatement.pinnedBottomRowData = [{ seq: '合计' }];
                    }
                    
                    $modalScope.sum = function (){
                        if($scope.parameterConfiguration[data.name].sum){
                            var proj = {
                                seq: '合计'
                            }
                            $scope.parameterConfiguration[data.name].pinned.forEach(function(field){
                                proj[field] = numberApi.sum(data.statement_now_datas, field);
                            });
                            $modalScope.gridOptionStatement.api.setPinnedBottomRowData([proj]);
                        }
                    }
                }]
            });
        }

        /**
         * 刷新流程
         */
        $scope.refreshWF = function () {
            return $scope.serachMyWork($scope.data.currItem.workstat);
        };

        /**
         * 查询我的工作
         */
        $scope.serachMyWork = function (stat) {
            $scope.data.currItem.workstat = stat;
            $scope.data.currItem.workstatname = $scope.data.currItem.workstatnames[stat - 1];
            return requestApi
                .post("scpallwf", "webwf", { flag: $scope.data.currItem.workstat })
                .then(function (data) {
                    $scope.data.currItem.works = data.wfs;
                    //去除重复的流程实例(如果当前用户对于某个流程实例可提交多个过程，在提交时让用户选择)
                    var result = [];
                    var obj = {};

                    $scope.data.currItem.works.forEach(function (work) {
                        if (!obj[work.wfid]) {
                            result.push(work);
                            obj[work.wfid] = 1;
                        }
                    });

                    $scope.data.currItem.works = angular.copy(result);
                });
        };

        wfApi.onRefresh($scope.refreshWF);

        webSocketApi.on(function (msg) {
            //若是流程消息
            if (msg.msgtype == 12) {
                //刷新流程
                $scope.serachMyWork($scope.data.currItem.workstat);
            }
        });

        /**
         * 查询事务预警
         */
        $scope.getAffairsWarning = function () {
            //$scope.warningCount = 0;

            $scope.warnings = [
                {
                    name: '报备冻结预警',
                    icon: 'hc-ziyuankuorong',
                    valueKey: 'reported_warning_num',
                    showKey: 'is_reported_warning',
                    action: 'reportedfreezenum',
                    search_flag: 2,
                    openMethodName: 'openReportedFreeze'
                },
                {
                    name: '提货计划超期/预警',
                    icon: 'hc-daisonghuo',
                    valueKey: 'demand_plan_num',
                    showKey: 'is_demand_plan',
                    action: 'requirementschedulewarning',
                    search_flag: 2,
                    openMethodName: 'openRequirementSchedule'
                },
                {
                    name: '折扣单超期预警',
                    icon: 'hc-jiekuanlixi',
                    valueKey: 'overdue_discount_num',
                    showKey: 'is_overdue_discount',
                    action: 'warningoverduediscount',
                    search_flag: 2,
                    openMethodName: 'openOverdueDiscount'
                },
                {
                    name: '回款预警',
                    icon: 'hc-feiyong',
                    valueKey: 'receivable_warning_num',
                    showKey: 'is_receivable_warning',
                    action: 'selectreceivablewarning',
                    search_flag: 1,
                    openMethodName: 'openSeeThePush'
                },
                {
                    name: '回款逾期',
                    icon: 'hc-jiekuanjilu',
                    valueKey: 'receivable_overdue_num',
                    showKey: 'is_receivable_overdue',
                    action: 'selectreceivablewarning',
                    search_flag: 2,
                    openMethodName: 'openSeeThePush'
                },
                {
                    name: '紧急要货预警(已保留未提货/待预占)',
                    icon: 'hc-jiekuanlixi',
                    valueKey: 'emergency_cargo_num',
                    showKey: 'is_emergency_cargo',
                    action: '',
                    search_flag: 2,
                    openMethodName: 'emergencyCargo'
                }
            ];

            

            var colors = ['blue', 'purple', 'green', 'orange', 'red'];

            $scope.warnings.forEach(function (warning, index) {
                warning.color = colors[index % colors.length];
            });

            return requestApi
                .post({
                    classId: 'epm_payment_plan_list',
                    action: 'searchAll',
                    data: {}
                })
                .then(function (response) {
                    //设置数组数据
                    $scope.warnings.forEach(function (warning) {
                        if (response[warning.showKey] == 2) {
                            warning.value = response[warning.valueKey]; 
                            warning.show = true;
                        }
                        else {
                            warning.value = 0;
                            warning.show = false;
                        }
                        //$scope.warningCount = numberApi.sum($scope.warningCount, warning.value);
                    });

                    //可见模块
                    $scope.warnings = $scope.warnings.filter(function(val){
                        return val.show;
                    });
                });
        };      

        /**
         * 查询发布文件
         */
        $scope.searchPubFiles = function () {

        };

        /**
         * 查询报表数据
         */
        $scope.searchReportData = function () {
             
        };

        /**
         * 查询共享资料文件
         */
        $scope.searchBbs = function () {
            requestApi.post("scpbbs", "searchattach", {}).then(function (data) {

                if (data.objattachs) {
                    $scope.data.currItem.objattachs = data.objattachs;
                }
             
            });
        }; 

        /**查询发文公告  hjx
                 */
                $scope.searchScpNews = function () {
                    //查询未阅读的公告
                    /*                     requestApi.post("scp_news", "search", { sqlwhere: "viewnum = 1", news_type: type, is_publish: 5 })
                                            .then(function (data) {
                                                if (type == 1) {
                                                    $scope.data.currItem.notice = data.scp_newss;//通知公告
                                                } else if (type == 2) {
                                                    $scope.data.currItem.activity = data.scp_newss;//最新活动
                    
                                                } else if (type == 3) {
                                                    $scope.data.currItem.news = data.scp_newss;//公司新闻
                                                }
                                            }); */
                    requestApi.post("scp_news", "search", { is_publish: 5, search_flag: 6})
                        .then(function (data) {

                            // 未读文章计数器
                            $scope.data.unreadCounter = {
                                notice: 0, // 通知公告
                                notice2:0
                                 
                            };

                            data.scp_newss.forEach(function (item) {
                                if (item.news_type == 2) { 
                                    $scope.data.currItem.notice.push(item);//通知公告
                                    if (item.vh_viewnum == 0) {//判断该用户的阅读数为0的公告
                                        $scope.data.unreadCounter.notice++;
                                        if(item.no_unread_peminders!=2){ 
                                            $scope.data.unreadCounter.notice2++; 
                                        }
                                    }  
                                }  
                            });  
                           
                            if($scope.data.unreadCounter.notice>0 && $scope.data.unreadCounter.notice2>0){ 

                                $scope.messagesOpenProj = $scope.messages.open({//打开模态框
                                    size:'sm',
                                    title:'未读通知公告', 
                                    height:250,
                                    width:440, 
                                    controller:['$scope',function ($modalScope){
                                        $modalScope.custlines={
                                            columnDefs:[{  
                                                type: '序号' 
                                            }, {  
                                                field: 'subject',
                                                headerName: '公告主题',
                                                hcReadonly: true, 
                                                suppressAutoSize: true,
                                                suppressSizeToFit: true,
                                                width:295
                                            },{
                                                field:'newsid', 
                                                headerName: '操作', 
                                                cellRenderer:showmessage,
                                                cellStyle:{ 
                                                    "text-align": "center"
                                                }
                                            }]
                                        }  
                                        requestApi.post({
                                            classId:'scp_news',
                                            action:'search',
                                            data:{//赋值
                                                is_publish: 6,   
                                                search_flag: 6 
                                            }
                                        }).then(function(result){
                                            
                                            gridApi.execute($modalScope.custlines,function(){//将数据渲染到网格上
                                                $modalScope.custlines.hcApi.setRowData(result.scp_newss);
                                            })
                                            // $modalScope.$close()
                                        })
                                    }]
                                });
                            
                            }
                        });
                    
                }

                        
         /**
         * 公告刷新按钮   
         */
        $scope.redrawNewss = function () {
            $scope.data.currItem.notice = [];//通知公告
            $scope.data.currItem.knowledge = [];
            $scope.searchScpNews();
            $scope.searchBbs();
        /* $scope.searchScpNews(2);
                            $scope.searchScpNews(3); */
        }

         /**
         * 点击公告跳转公告详情页
         */ 
        $scope.gonews = function (id,modify_status,process,record,dispatch) {  
            $state.go('oa.scp_news_show', { id: id , modify_status:modify_status,process:process,record:record,dispatch:dispatch});
            setTimeout($scope.redrawNewss, 1000)
        }
 
        $scope.goknowledge = function (id) {
            $state.go('oa.scp_news_detail', { news_id: id });
            setTimeout($scope.redrawNewss, 1000)
        }
        
         /**
         * 公告更多按钮  hjx 
         */
        // $scope.moreNews = function () { 
        //     var notice = $('ul.scpnotive>li.active a').html();
        //     if (notice == '通知公告') {

        //         $state.go('oa.scp_news_notice');

        //     } else if (notice == '共享资料') {

        //         $state.go('baseman.info_share_list');

        //     }
        
        // }

        /**
         * 查看预警信息
         */
        $scope.openWarning = function (warning) {
            //查询对应的数据进行展示
            $scope[warning.openMethodName](warning);
        };

        /**
         * 紧急要货预警模态框
         */
        $scope.emergencyCargo = function(warning){
            $scope.seeThePushCargo.open({//打开模态框
                size: 'lg',
                controller: ['$scope', function ($modalScope) {
                    //表格切换定义
                    $modalScope.warningEmergencyCargo = {
                        delivery : {
                            title: '已保留',
                            active: true
                        },
                        await : {
                            title: '待保留'
                        }
                    };
                    $modalScope.title = "紧急要货预警";
                    $modalScope.gridOptionsDelivery = {
                        columnDefs: [{
                            type: '序号'
                        },
                        {
                            field: 'sa_salebillno',
                            headerName: '要货单号'
                        },
                        {
                            field: 'urgent_order_billno',
                            headerName: '紧急要货单号'
                        },
                        {
                            field: 'item_data',
                            headerName: '产品信息'
                        },
                        {
                            field: 'model',
                            headerName: '型号'
                        },
                        {
                            field: 'uom_name',
                            headerName: '单位'
                        },
                        {
                            field: 'reserved_qty',
                            headerName: '当前保留数量',
                            type : '数量'
                        },
                        {
                            field: 'pre_reserved_qty',
                            headerName: '当前预占数量',
                            type : '数量'
                        },
                        {
                            field: 'released_qty',
                            headerName: '已释放数量',
                            type : '数量'
                        },
                        {
                            field: 'pre_qty',
                            headerName: '剩余未提(以保留)',
                            type : '数量',
                            headerClass: 'emergencyCargoDelivery',
                            cellStyle: {
                                'color': 'red',
                                'text-align': 'center'
                            }
                        },
                        {
                            field: 'pick_up_date',
                            headerName: '提货时间回复',
                            type : '日期'
                        },
                        {
                            field: 'valid_date',
                            headerName: '有效期至',
                            type : '日期'
                        },
                        {
                            field: 'delivery_base_name',
                            headerName: '发货基地'
                        },
                        {
                            field: 'urgent_extend_billno',
                            headerName: '延期单号(审核中)',
                            headerClass: 'emergencyCargoDelivery',
                            cellStyle: {
                                'color': 'red'
                            }
                        },
                        {
                            field: 'extend_valid_date',
                            headerName: '申请延期至',
                            type : '日期',
                            headerClass: 'emergencyCargoDelivery',
                            cellStyle: {
                                'color': 'red'
                            }
                        },
                        {
                            field: 'customer_data',
                            headerName: '客户信息'
                        },
                        {
                            field: 'project_data',
                            headerName: '工程信息'
                        }],
                        hcBeforeRequest: function (searchObj) {//发送查询条件
                            searchObj.search_flag = warning.search_flag;
                        },
                        //定义查询类与方法
                        hcRequestAction:'emergencycargodeliveryall',
                        hcDataRelationName:'emergency_cargo_deliverys',
                        hcClassId:'epm_payment_plan_list'
                    };

                    $modalScope.gridOptionsAwait = {
                        columnDefs: [{
                            type: '序号'
                        },
                        {
                            field: 'sa_salebillno',
                            headerName: '要货单号'
                        },
                        {
                            field: 'urgent_order_billno',
                            headerName: '紧急要货单号'
                        },
                        {
                            field: 'item_data',
                            headerName: '产品信息'
                        },
                        {
                            field: 'model',
                            headerName: '型号'
                        },
                        {
                            field: 'uom_name',
                            headerName: '单位'
                        },
                        {
                            field: 'pre_reserved_qty',
                            headerName: '待保留数量',
                            type : '数量'
                        },
                        {
                            field: 'pick_up_date',
                            headerName: '提货时间回复',
                            type : '日期'
                        },
                        {
                            field: 'valid_date',
                            headerName: '有效期至',
                            type : '日期'
                        },
                        {
                            field: 'delivery_base_name',
                            headerName: '发货基地'
                        },
                        {
                            field: 'customer_data',
                            headerName: '客户信息'
                        },
                        {
                            field: 'project_data',
                            headerName: '工程信息'
                        }],
                        hcBeforeRequest: function (searchObj) {//发送查询条件
                            searchObj.search_flag = warning.search_flag;
                        },
                        //定义查询类与方法
                        hcRequestAction:'emergencycargoawaitall',
                        hcDataRelationName:'emergency_cargo_awaits',
                        hcClassId:'epm_payment_plan_list'
                    };
                }]

                
            });
        }

        /**
         * 打开折扣单超期预警模态框
         */
        $scope.openOverdueDiscount = function (warning) {
            $scope.seeThePush.open({//打开模态框
                size: 'lg',
                controller: ['$scope', function ($modalScope) {
                    $modalScope.title = "折扣单超期预警";
                    $modalScope.gridOptionWarning = {
                        columnDefs: [{
                            type: '序号'
                        }, {
                            field: 'customer_code',
                            headerName: '客户编码',
                            rowSpan: function (params) {
                                if (params.node.data.span_count) {
                                    return params.node.data.span_count;
                                }
                            }
                        }, {
                            field: 'customer_name',
                            headerName: '客户名称',
                            rowSpan: function (params) {
                                if (params.node.data.span_count) {
                                    return params.node.data.span_count;
                                }
                            }
                        }, {
                            field: 'discount_apply_code',
                            headerName: '折扣单号',
                            rowSpan: function (params) {
                                if (params.node.data.span_count) {
                                    return params.node.data.span_count;
                                }
                            }
                        }, {
                            field: 'discount_valid_date',
                            headerName: '有效期至',
                            type: '日期',
                            rowSpan: function (params) {
                                if (params.node.data.span_count) {
                                    return params.node.data.span_count;
                                }
                            }
                        }, {
                            field: 'contract_code',
                            headerName: '合同编码',
                            rowSpan: function (params) {
                                if (params.node.data.span_count) {
                                    return params.node.data.span_count;
                                }
                            }
                        }, {
                            field: 'contract_name',
                            headerName: '合同名称',
                            rowSpan: function (params) {
                                if (params.node.data.span_count) {
                                    return params.node.data.span_count;
                                }
                            }
                        }, {
                            field: 'item_code',
                            headerName: '产品编码'
                        }, {
                            field: 'item_name',
                            headerName: '产品名称'
                        }, {
                            field: 'active_qty',
                            headerName: '剩余可下单数量',
                            type: '数量'
                        }],hcAfterRequest:function(response){
                            //行合并
                            var discount_apply_code = 0;
                            var rowProj = {};
                            response.overdue_discounts.forEach(function (value, index) {
                                if (index == 0) {
                                    rowProj[value.discount_apply_code] = 1;
                                } else if (rowProj[value.discount_apply_code] == undefined) {
                                    rowProj[value.discount_apply_code] = 1;
                                } else {
                                    rowProj[value.discount_apply_code] = numberApi.sum(rowProj[value.discount_apply_code], 1);
                                }
                            });
                            response.overdue_discounts.forEach(function (value, index) {
                                if (index == 0) {
                                    discount_apply_code = value.discount_apply_code;
                                    value.span_count = rowProj[value.discount_apply_code];
                                } else if (value.discount_apply_code != discount_apply_code) {
                                    discount_apply_code = value.discount_apply_code;
                                    value.span_count = rowProj[value.discount_apply_code];
                                } else {
                                    value.span_count = undefined;
                                }
                            });
                            $modalScope.gridOptionWarning.hcApi.setRowData(response.overdue_discounts);
                        },
                        hcBeforeRequest: function (searchObj) {//发送查询条件
                            searchObj.search_flag = warning.search_flag;
                        },
                        //取消分页
                        //hcNoPaging:true,
                        //定义查询类与方法
                        hcRequestAction:warning.action,
                        hcDataRelationName:'overdue_discounts',
                        hcClassId:'epm_payment_plan_list'
                    };
                }]
            });
        };

        /**
         * 打开要货计划模态框
         */
        $scope.openRequirementSchedule = function (warning) {
            $scope.seeThePush.open({//打开模态框
                size: 'lg',
                controller: ['$scope', function ($modalScope) {
                    $modalScope.title = "提货计划超期/预警";
                    $modalScope.gridOptionWarning = {
                        columnDefs: [{
                            type: '序号'
                        }, {
                            field: 'customer_code',
                            headerName: '客户编码',
                            rowSpan: function (params) {
                                if (params.node.data.span_count) {
                                    return params.node.data.span_discount;
                                }
                            }
                        }, {
                            field: 'customer_name',
                            headerName: '客户名称',
                            rowSpan: function (params) {
                                if (params.node.data.span_count) {
                                    return params.node.data.span_discount;
                                }
                            }
                        }, {
                            field: 'discount_apply_code',
                            headerName: '折扣单号',
                            rowSpan: function (params) {
                                if (params.node.data.span_count) {
                                    return params.node.data.span_discount;
                                }
                            }
                        }, {
                            field: 'contract_code',
                            headerName: '合同编码',
                            rowSpan: function (params) {
                                if (params.node.data.span_count) {
                                    return params.node.data.span_discount;
                                }
                            }
                        }, {
                            field: 'contract_name',
                            headerName: '合同名称',
                            rowSpan: function (params) {
                                if (params.node.data.span_count) {
                                    return params.node.data.span_discount;
                                }
                            }
                        }, {
                            field: 'item_code',
                            headerName: '产品编码',
                            rowSpan: function (params) {
                                if (params.node.data.span_count) {
                                    return params.node.data.span_count;
                                }
                            }
                        }, {
                            field: 'item_name',
                            headerName: '产品名称',
                            rowSpan: function (params) {
                                if (params.node.data.span_count) {
                                    return params.node.data.span_count;
                                }
                            }
                        }, {
                            field: 'ordered_qty',
                            headerName: '实际已下数量',
                            type: '数量',
                            rowSpan: function (params) {
                                if (params.node.data.span_count) {
                                    return params.node.data.span_count;
                                }
                            }
                        }, {
                            field: 'total_plan_qty',
                            headerName: '累计应下数量',
                            type: '数量'
                        }, {
                            field: 'plan_date',
                            headerName: '预提货时间',
                            type: '日期',
                            cellStyle: function (args){
                                return {
                                    'color': new Date(args.data.plan_date).getTime()+(24*60*60*1000) <= new Date().getTime()?'red':'#333'
                                }
                            }
                        }, {
                            field: 'plan_qty',
                            headerName: '预提货数量',
                            type: '数量'
                        }],hcAfterRequest:function(response){
                            //行合并
                        var discountApplyLineId = 0;
                        var discountApplyCode = "";
                        var rowProj = {};
                        response.requirement_schedules.forEach(function (value, index) {
                            if (index == 0) {
                                rowProj[value.discount_apply_line_id] = 1;
                            } else if (rowProj[value.discount_apply_line_id] == undefined) {
                                rowProj[value.discount_apply_line_id] = 1;
                            } else {
                                rowProj[value.discount_apply_line_id] = numberApi.sum(rowProj[value.discount_apply_line_id], 1);
                            }
                            if (index == 0) {
                                rowProj[value.discount_apply_code] = 1;
                            } else if (rowProj[value.discount_apply_code] == undefined) {
                                rowProj[value.discount_apply_code] = 1;
                            } else {
                                rowProj[value.discount_apply_code] = numberApi.sum(rowProj[value.discount_apply_code], 1);
                            }
                        });
                        response.requirement_schedules.forEach(function (value, index) {
                            if (index == 0) {
                                discountApplyLineId = value.discount_apply_line_id;
                                value.span_count = rowProj[value.discount_apply_line_id];
                            } else if (value.discount_apply_line_id != discountApplyLineId) {
                                discountApplyLineId = value.discount_apply_line_id;
                                value.span_count = rowProj[value.discount_apply_line_id];
                            } else {
                                value.span_count = undefined;
                            }
                            if (index == 0) {
                                discountApplyCode = value.discount_apply_code;
                                value.span_discount = rowProj[value.discount_apply_code];
                            } else if (value.discount_apply_code != discountApplyCode) {
                                discountApplyCode = value.discount_apply_code;
                                value.span_discount = rowProj[value.discount_apply_code];
                            } else {
                                value.span_discount = undefined;
                            }
                        });
                        $modalScope.gridOptionWarning.hcApi.setRowData(response.requirement_schedules);
                        },
                        hcBeforeRequest: function (searchObj) {//发送查询条件
                            searchObj.search_flag = warning.search_flag;
                        },
                        //取消分页
                        //hcNoPaging:true,
                        //定义查询类与方法
                        hcRequestAction:warning.action,
                        hcDataRelationName:'requirement_schedules',
                        hcClassId:'epm_payment_plan_list'
                    };
                }]
            });
        };

        /**
         * 打开报备推送模态框
         */
        $scope.openReportedFreeze = function (warning) {
            $scope.seeThePush.open({//打开模态框
                size: 'lg',
                controller: ['$scope', function ($modalScope) {
                    $modalScope.title = "报备冻结预警";
                    $modalScope.gridOptionWarning = {
                        columnDefs: [{
                            type: '序号'
                        }, {
                            field: 'freeze_date',
                            headerName: '冻结倒计时',
                            valueGetter: function (params) {
                                return params.data.freeze_date + "天后冻结";
                            }
                        }, {
                            field: 'customer_code',
                            headerName: '客户编码'
                        }, {
                            field: 'customer_name',
                            headerName: '客户名称'
                        }, {
                            field: 'project_code',
                            headerName: '项目编码'
                        }, {
                            field: 'project_name',
                            headerName: '项目名称'
                        }, {
                            field: 'report_time',
                            headerName: '报备时间',
                            type: '日期'
                        }, {
                            field: 'stage_name',
                            headerName: '当前进度'
                        }, {
                            field: 'stage_desc',
                            headerName: '当前进度描述'
                        }, {
                            field: 'updatetime',
                            headerName: '进度更新时间',
                            type: '日期'
                        }, {
                            field: 'freeze_type',
                            headerName: '冻结类型',
                            hcDictCode: 'epm.proj.freeze_type'
                        }]
                        // ,hcAfterRequest:function(response){
                            
                        // },
                        // hcBeforeRequest: function (searchObj) {//发送查询条件
                        //     searchObj.search_flag = warning.search_flag;
                        // },
                        //取消分页
                        //hcNoPaging:true,
                        //定义查询类与方法
                        // hcRequestAction:warning.action,
                        // hcDataRelationName:'report_freezing_periods',
                        // hcClassId:'epm_payment_plan_list'
                    };
                    gridApi.execute($modalScope.gridOptionWarning, function () {
                        requestApi
                            .post({
                                classId: 'epm_payment_plan_list',
                                action: warning.action,
                                data: {
                                    search_flag : warning.search_flag
                                }
                            })
                            .then(function(response){
                                var arr = [];
                                //周期冻结
                                response.report_freezing_periods.forEach(function (value) {
                                    value.freeze_type = 1;
                                    arr.push(value);
                                });
                                //更新超时冻结
                                response.progress_update_timeouts.forEach(function (value) {
                                    value.freeze_type = 2;
                                    arr.push(value);
                                });
                                $modalScope.gridOptionWarning.hcApi.setRowData(arr);
                            });
                    });
                    
                }]
            });
        };

        /**
         * 打开回款推送模态框
         */
        $scope.openSeeThePush = function (warning) {
            $scope.seeThePush.open({//打开模态框
                size: 'lg',
                controller: ['$scope', function ($modalScope) {
                    $modalScope.title = warning.search_flag == 2 ? "回款逾期" : "回款预警";
                    $modalScope.gridOptionWarning = {
                        columnDefs: [{
                            type: '序号'
                        }, {
                            field: 'contract_code',
                            headerName: '合同编码'
                        }, {
                            field: 'contract_name',
                            headerName: '合同名称'
                        }, {
                            field: 'contract_expire_date',
                            headerName: '合作结束时间',
                            type: '日期'
                        }, {
                            field: 'contract_amt',
                            headerName: '合同总额',
                            type: '金额'
                        }, {
                            field: 'payment_type',
                            headerName: '款项类别',
                            hcDictCode: 'epm.payment_type'
                        }, {
                            field: 'plan_time',
                            headerName: '计划回款时间',
                            type: '日期'
                        }, {
                            field: 'overdue_date',
                            headerName: '逾期天数',
                            hide: !(warning.search_flag == 2)
                        }, {
                            field: 'plan_amt',
                            headerName: '计划回款金额',
                            type: '金额'
                        }, {
                            field: 'received_amt',
                            headerName: '已回款金额',
                            type: '金额',
                            valueGetter: function (params) {
                                //未回款金额小于计划回款，才有回款金额，否则为0
                                return Number(params.data.unpaid_amount) < Number(params.data.plan_amt) ?
                                    numberApi.sub(params.data.plan_amt, params.data.unpaid_amount) : 0;
                            }
                        }, {
                            field: 'unpaid_amount_show',
                            headerName: '未回款金额',
                            type: '金额',
                            valueGetter: function (params) {
                                //累计未回款金额大于计划回款金额，则设为计划回款金额
                                return Number(params.data.unpaid_amount) > Number(params.data.plan_amt) ?
                                    params.data.plan_amt : params.data.unpaid_amount
                            }
                        }],hcAfterRequest:function(response){
                            if (response.search_flag == 1) {//设置预警数据
                                $modalScope.gridOptionWarning.hcApi.setRowData(response.receivable_warning);
                            } else if (response.search_flag == 2) {//设置逾期数据
                                $modalScope.gridOptionWarning.hcApi.setRowData(response.receivable_overdues);
                            }
                        },
                        hcBeforeRequest: function (searchObj) {//发送查询条件
                            searchObj.search_flag = warning.search_flag;
                        },
                        //取消分页
                        //hcNoPaging:true,
                        //定义查询类与方法
                        hcRequestAction:warning.action,
                        hcDataRelationName:warning.search_flag == 2?'receivable_overdues':'receivable_warning',
                        hcClassId:'epm_payment_plan_list'
                    };
                }] 
            });
        };  
 
        /**查看公告 */ 
        function showmessage(params){ 

                var html =$('<a>',{ 
                    text:"查看",   
                    css:{  
                        width:'59px', 
                        height:'19px',  
                        backgroundColor: '#298645',
                        display: 'inline-block',
                        borderRadius: '15px', 
                        color : 'white'
                    }, 
                    on :{
                        click:function(){
                            $scope.messagesOpenProj.close();
                            $state.go('oa.scp_news_show', { id: params.data.newsid,modify_status:1,process:1,record:1,dispatch:1});
                        }
                    }
            });
           
            return html[0];
            
            
        }


        /**
         * 打开单据
         * @param obj
         */
        $scope.openBill = function (obj) {
            var modalResultPromise = openBizObj({
                wfId: obj.wfid
            }).result;

            //关闭模态框时刷新“待办流程”
            modalResultPromise.finally(function () {
                $scope.serachMyWork(1);
            });

            return modalResultPromise;
        };

        /**
         * 检查密码是否应该修改
         */
        $scope.checkUpdatePass = function () {
            //判断是否需要打开模态框来修改密码
            var updatePassTip;
            var shouldUpdatePass = false;
            if (userbean.loginuserifnos[0].userpass_updatetime) {
                var today = new Date();
                var userpass_updatetime = new Date(userbean.loginuserifnos[0].userpass_updatetime);
                var daysDif = ((today - userpass_updatetime) / (1000 * 60 * 60 * 24));//相差天数
                //密码过期
                if (daysDif >= 90) {
                    shouldUpdatePass = true;
                    updatePassTip = '密码已过期，需修改密码后才可继续访问';
                }
            } else if (userbean.loginuserifnos[0].userpass_updatetime == '') {
                shouldUpdatePass = true;
                updatePassTip = '密码已过期，需修改密码后才可继续访问';
            }
            if (userbean.loginuserifnos[0].shouldresetpass == 2 && !shouldUpdatePass) {
                shouldUpdatePass = true;
                updatePassTip = '密码已被修改，需修改密码后才可继续访问';
            }
            if (userbean.loginuserifnos[0].login_count == 0 && !shouldUpdatePass) {
                //首次登录
                shouldUpdatePass = true;
                updatePassTip = '首次登录，需修改密码后才可继续访问';
            }

            if (shouldUpdatePass) {
                return $q.when()
                    .then($modal.open({
                        title: updatePassTip,
                        template: '<div style="padding: 0 16px">'
                            + '  <div class="row">'
                            + '    <div hc-label="密码" hc-input="userpass" hc-type="password" hc-required="true" hc-col-count="8"></div>'
                            + '  </div>'
                            + '  <div class="row">'
                            + '    <div hc-label="确认密码" hc-input="confirm_userpass" hc-type="password" hc-required="true" hc-col-count="8"></div>'
                            + '  </div>'
                            + '</div>',
                        closeable: false,
                        fullScreen: false,
                        controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                            $scope.footerRightButtons.ok.hide = false;
                            $scope.footerRightButtons.ok.title = '确定';
                            $scope.footerRightButtons.ok.click = function () {
                                if ($scope.userpass != $scope.confirm_userpass) {
                                    return swalApi.info('两次输入密码不一致');
                                }

                                return requestApi.post('scpuser', 'updateuserpass', { userpass: $scope.userpass })
                                    .then(function () {
                                        requestApi.post('scpuser', 'updateuserlogincount', {});
                                        $modalInstance.dismiss();
                                        return swalApi.info('保存成功,请重新登录').then(function () {
                                            top.location.href = "/web/logout.do";
                                        });
                                    });
                            };
                            $scope.footerRightButtons.ok.disabled = function () {
                                return $scope.modalForm.$invalid;
                            };

                            //退出系统
                            /*$scope.footerRightButtons.close.hide = false;
                            $scope.footerRightButtons.close.title = '退出';
                            $scope.footerRightButtons.close.click = function () {
                                swalApi.confirm('是否退出账号?').then(function () {
                                    $modalInstance.dismiss();
                                    window.location.href = "/web/logout.do";
                                });
                            }*/

                        }]
                    }));
            } else {
                //登录首页，登录次数加1
                requestApi.post('scpuser', 'updateuserlogincount', {});
            }
        };

        /**
         * 首页数据初始化
         */
        $scope.initHomeData = function () {
            $scope.serachMyWork(1);
            $scope.searchPubFiles();
            $scope.searchReportData();
            $scope.searchBbs();
            $scope.getUserMenus();
            $scope.getAffairsWarning();
            $scope.checkUpdatePass();
            $scope.searchStatement();
            //查询发文公告
            $scope.searchScpNews();
        };

        //qch
        $scope.color = ['#A3E1D4', '#A4CEE8', '#B5B8CF', '#DEDEDE'];

        //任务预算执行比
        $scope.myDate = new Date().getFullYear();

        /**
         * 页面导航
         * @param route 路由地址
         * @param param 参数
         */
        $scope.naviPage = function (route, param) {
            $state.go(route, param);
        };

        $scope.addMenu = function () {

        };

        //通用查询 - 可收藏的菜单和模块
        $scope.searchMenufavorites = function () {
            $modal
                .openCommonSearch({
                    title: '自定义快捷应用菜单',
                    classId: 'scpmenu',
                    action: 'getuseracceptmenus',
                    checkbox: true
                })
                .result
                .then(function (menus) {
                    var promise = $q.when();

                    menus.forEach(function (menu) {
                        promise = promise
                            .then(function () {
                                return requestApi.post({
                                    classId: 'scpmenu',
                                    action: 'insertprofmenus',
                                    data: menu
                                });
                            })
                            .then(function (response) {
                                $scope.data.currItem.menus = response.menus;
                                /*if ($scope.data.currItem.menus.length > 12) {
                                    $('#next').removeAttr('disabled', 'disabled');
                                }
                                $scope.setaddBtnLeft();*/
                            });
                    });

                    return promise;
                })
                .then(function () {
                    var oldmenurows = $scope.menurows;
                    $scope.getMenuRows(oldmenurows);
                    return swalApi.success('添加成功');
                });
        };
        $scope.getUserMenus = function () {
            requestApi.post("scpmenu", "getusermenus", {})
                .then(function (data) {
                    $scope.data.currItem.menus = data.menus;
                    $scope.getMenuRows();
                    /*if ($scope.data.currItem.menus.length <= 12) {
                        $('#next').attr('disabled', 'disabled');
                    }
                    $scope.setaddBtnLeft();*/
                });
        };

        /**
         * 获取快捷应用行数
         */
        $scope.getMenuRows = function (oldmenurows) {
            promiseApi.whenTrue(function () {
                return $('#menus').length > 0;
            }).then(function () {
                var width = $('#menus').width();
                var row = Math.floor(width / 90);
                var length = $scope.data.currItem.menus.length + 1;
                $scope.menurows = Math.ceil(length / row);
                if (oldmenurows) {
                    if (oldmenurows > $scope.menurows) {
                        if ($('#menus').height() > 94.3) {
                            var i = oldmenurows - $scope.menurows;
                            var height = $('#menus').height() - (i * 94.3);
                            $('#menus').height(height);
                        }
                    } else if (oldmenurows < $scope.menurows) {
                        var i = $scope.menurows - oldmenurows;
                        var height = $('#menus').height() + (i * 94.3);
                        $('#menus').height(height);
                        if ($scope.downBool) {
                            $scope.downBool = false;
                        }
                    }
                }
            });
        };

        /**
         * 下拉按钮
         */
        $scope.down = function () {
            $scope.downBool = false;
            var height = $scope.menurows * 93.4;
            $('#menus').height(height);
        };

        /**
         * 上拉按钮
         */
        $scope.up = function () {
            $scope.downBool = true;
            $('#menus').height(93.4);
        };

        $scope.delMenu = function (item, $event) {
            console.log(item)
            swalApi.confirm({
                title: '您确认要删除"' + item.menuname + '"快捷应用吗？'
            }).then(function () {
                requestApi.post("scpmenu", "deleteusermenus", JSON.stringify({ "menuid": item.menuid, "objtype": item.objtype }))
                    .then(function (data) {
                        $scope.data.currItem.menus = data.menus;
                        var oldmenurows = $scope.menurows;
                        $scope.getMenuRows(oldmenurows);
                        swalApi.success('删除成功');
                        data.menus.forEach(function (item, index) {
                            item.seq = index + 1;
                        });
                        $scope.getMenuRows();
                        /*if ($scope.data.currItem.menus.length >= 12) {
                            if ($scope.i < 0) {
                                $scope.prev();
                            }
                        } else {
                            $('#prev').attr('disabled', 'disabled')
                        }*/
                    });
            })
            $event.stopPropagation();
        };

        $scope.showTips = function (webrefaddr) {
            if (!webrefaddr) {
                swalApi.info('功能还在建设中...！');
            }
        };

        /**
         * 拖拽配置
         */
        $scope.sortableOption = {
            handle: '.home_nav_name',
            distance: 0,
            // axis: 'x',
            scrollSensitivity: 10,
            update: function (event, ui) {
                $scope.updateMenu();
            },
        };
        $scope.updateMenu = function () {
            $scope.data.currItem.menus.forEach(function (item, index) {
                item.seq = index + 1
            });
            requestApi.post("scpmenu", "updateusermenuseq", { menus: $scope.data.currItem.menus }).then(function (data) {
                $scope.data.currItem.menus = data.menus;
            });
        };
        $scope.toUrl = function (url) {
            window.location.href = url;
        };


        /**
        *图表配置项---漏斗
        */
        $scope.chartOption4 = {
            tooltip: {
                trigger: 'item',
                formatter: "{b}"
            },
            backgroundColor:'rgba(0,0,0,0)',
            color:['#525cbc','#1bafe8','#00c7a3', '#f3a148'],
            series: [
                {
                    name: '预期',
                    type: 'funnel',
                    left: '15px',
                    top:'5px',
                    bottom:'25px',
                    right:'0px',
                    width: '50%',
                    minSize:'120px',
                    maxSize: '100%',
                    label: {
                        normal: {
                            formatter: '{b}'
                        },
                        emphasis: {
                            position:'inside',
                            formatter: '{b}: {c}%'
                        }
                    },
                    labelLine: {
                        length:5000,
                    },
                    itemStyle: {
                        normal: {
                            opacity: 0.5,
                            borderColor: 'rgba(0,0,0,0)',
                            borderWidth: 4
                        }
                    },
                    data: [
                        {value: 80, name: '单体报备'},
                        {value: 60, name: '折扣申请'},
                        {value: 40, name: '要货订单'},
                        {value: 20, name: '工程出库'}
                    ]
                },
                {
                    name: '实际',
                    type: 'funnel',
                    left: '15px',
                    top:'15px',
                    bottom:'15px',
                    right:'0px',
                    width: '50%',
                    minSize:'90px',
                    maxSize: '90%',
                    label: {
                        normal: {
                            position: 'inside',
                            formatter: '{b}',
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        emphasis: {
                            position:'inside',
                            formatter: '{b}'
                        }
                    },
                    itemStyle: {
                        normal: {
                            opacity: 1,
                            borderColor: 'rgba(0,0,0,0)',
                            borderWidth: 4
                        }
                    },
                    data: [
                        {value: 80, name: '单体报备'},
                        {value: 60, name: '折扣申请'},
                        {value: 40, name: '要货订单'},
                        {value: 20, name: '工程出库'}
                    ]
                }
            ]
        };


    }];

    //加载控制器
    return controllerApi.controller({
        controller: controller,
        module: module
    });
});