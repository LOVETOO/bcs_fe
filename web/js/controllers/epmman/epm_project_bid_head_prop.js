/**
 * 项目评审立项
 * 2019/6/10
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi'],
    function (module, controllerApi, base_obj_prop, requestApi) {


        var controller = [
            '$scope',

            function ($scope) {

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------表格定义-------------------------------------------*/
                /**
                 * 表格定义  "投标注意"
                 */
                $scope.gridOptions_call = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'matter',
                        headerName: '注意事项',
                        width:120,
                        hcDictCode:'epm.submit_bid_norm'
                    }, {
                        field: 'name',
                        headerName: '内容',
                        width:400
                    }, {
                        field: 'note',
                        width: 428,
                        headerName: '备注'
                    }]
                };
                /**
                 * 表格定义  "商务评审"
                 */
                $scope.gridOptions_business = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'norm_type',
                        width:120,
                        headerName: '评审指标'
                    }, {
                        field: 'norm_detail',
                        headerName: '指标内容',
                        width:600
                    }, {
                        field: 'norm_score',
                        headerName: '评审分数',
                        width:120,
                        hide:false,
                        type:'数量'
                    }]
                };

                /**
                 * 表格定义  "技术评审"
                 */
                $scope.gridOptions_technology = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'norm_type',
                        width:120,
                        headerName: '评审指标'
                    }, {
                        field: 'norm_detail',
                        headerName: '指标内容',
                        width:600
                    }, {
                        field: 'norm_score',
                        headerName: '评审分数',
                        width:120,
                        hide:false,
                        type:'数量'
                    }]
                };

                /**
                 * 表格定义  "封标注意"
                 */
                $scope.gridOptions_sealed = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'matter',
                        width:120,
                        headerName: '注意事项'
                    }, {
                        field: 'code',
                        width:120,
                        headerName: '编码'
                    }, {
                        field: 'name',
                        headerName: '内容',
                        width:400
                    }, {
                        field: 'note',
                        width:308,
                        headerName: '备注'
                    }]
                };

                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 工程项目查询
                 */
                $scope.searchObjEpmProject = {
                    postData: {
                        search_flag: 5,                                             //过滤已选项目
                        table_name:'epm_project_bid_head',                            //表名
                        primary_key_name:'project_bid_head_id',                       //主键
                        primary_key_id:$scope.data.currItem.project_bid_head_id > 0 ? //主键id
                            $scope.data.currItem.project_bid_head_id : 0
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.project_id = result.project_id;
                        $scope.data.currItem.project_code = result.project_code;
                        $scope.data.currItem.project_name = result.project_name;
                        ["report_time", "project_type", "future_prices",
                            "address", "signup_time", "signup_plan_people", "signup_method"].forEach(function (data) {
                            $scope.data.currItem[data] = undefined;
                        });
                        $scope.data.currItem.report_time = result.report_time;
                        $scope.data.currItem.project_type = result.project_type;
                        $scope.data.currItem.future_prices = result.future_prices;
                        $scope.data.currItem.address = result.address;
                        $scope.data.currItem.signup_time = result.signup_time;
                        $scope.data.currItem.signup_plan_people = result.signup_plan_people;
                        $scope.data.currItem.signup_method = result.signup_method;
                        $scope.data.currItem.project_source = result.project_source;
                        //查询对应的招标文件解读数据
                        return requestApi.post({
                            classId: 'epm_bid_decode',
                            action: 'select',
                            data: {
                                flag : 1,
                                project_id : $scope.data.currItem.project_id
                            }
                        }).then(function (data) {
                            $scope.data.currItem.business_meth = data.business_meth;
                            $scope.data.currItem.business_result = data.business_result;
                            $scope.data.currItem.business_analysis = data.business_analysis;
                            $scope.data.currItem.tech_meth = data.tech_meth;
                            $scope.data.currItem.tech_result = data.tech_result;
                            $scope.data.currItem.tech_analysis = data.tech_analysis;

                            $scope.gridOptions_call.hcApi.setRowData(data.epm_bid_decode_matter_calls);
                            $scope.gridOptions_business.hcApi.setRowData(data.epm_bid_decode_review_businesss);
                            $scope.gridOptions_technology.hcApi.setRowData(data.epm_bid_decode_review_trainings);
                            $scope.gridOptions_sealed.hcApi.setRowData(data.epm_bid_decode_matter_sealeds);
                            $scope.changeTech();
                            $scope.changePosition();
                        });
                    }
                };

                /**
                 * 工程项目查询
                 */
                $scope.searchObjScpuser = {
                    sqlWhere:"actived = 2",
                    afterOk: function (result) {
                        $scope.data.currItem.bid_open_person_id = result.sysuserid;
                        $scope.data.currItem.bid_open_primary = result.username;
                    }
                };

                /**
                 * 查合伙人机构
                 */
                $scope.searchObjCustomerOrg = {
                    gridOptions:{
                        columnDefs:[
                            {
                                headerName: "机构编码",
                                field: "customer_code"
                            },{
                                headerName: "机构名称名称",
                                field: "customer_name"
                            },{
                                headerName: "联系人",
                                field: "contact"
                            },{
                                headerName: "联系人电话",
                                field: "tele"
                            }
                        ]
                    },
                    title:"招标机构",
                    postData:{
                        search_flag : 91
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.bid_org_name = result.customer_name;
                        $scope.data.currItem.bid_org_linkman = result.contact;
                        $scope.data.currItem.bid_org_phoneno = result.tele;
                    }
                };

                /**
                 * 清空数据时
                 */
                $scope.changeEpmProject = function(){
                    if($scope.data.currItem.project_code==null||$scope.data.currItem.project_code==undefined||$scope.data.currItem.project_code==""){
                        $scope.data.currItem.project_name = undefined;
                        return;
                    }
                };

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.epm_bid_decode_matter_calls = [];
                    bizData.epm_bid_decode_review_businesss = [];
                    bizData.epm_bid_decode_review_trainings = [];
                    bizData.epm_bid_decode_matter_sealeds = [];
                };

                /**
                 * 商务评分方式发生变化
                 */
                $scope.changePosition = function () {
                    if($scope.data.currItem.business_meth==1){
                        $scope.gridOptions_business.columnDefs[3].hide = false;
                    }else if($scope.data.currItem.business_meth==2){
                        $scope.gridOptions_business.columnDefs[3].hide = true;
                    }
                    $scope.gridOptions_business.api.setColumnDefs($scope.gridOptions_business.columnDefs);
                };

                /**
                 * 技术评分方式发生变化
                 */
                $scope.changeTech = function () {
                    if($scope.data.currItem.tech_meth==1){
                        $scope.gridOptions_technology.columnDefs[3].hide = false;
                    }else if($scope.data.currItem.tech_meth==2){
                        $scope.gridOptions_technology.columnDefs[3].hide = true;
                    }
                    $scope.gridOptions_technology.api.setColumnDefs($scope.gridOptions_technology.columnDefs);
                };


                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    return requestApi.post({
                        classId: 'epm_bid_decode',
                        action: 'select',
                        data: {
                            flag : 1,
                            project_id : $scope.data.currItem.project_id
                        }
                    }).then(function (data) {
                        $scope.data.currItem.business_meth = data.business_meth;
                        $scope.data.currItem.business_result = data.business_result;
                        $scope.data.currItem.business_analysis = data.business_analysis;
                        $scope.data.currItem.tech_meth = data.tech_meth;
                        $scope.data.currItem.tech_result = data.tech_result;
                        $scope.data.currItem.tech_analysis = data.tech_analysis;

                        $scope.gridOptions_call.hcApi.setRowData(data.epm_bid_decode_matter_calls);
                        $scope.gridOptions_business.hcApi.setRowData(data.epm_bid_decode_review_businesss);
                        $scope.gridOptions_technology.hcApi.setRowData(data.epm_bid_decode_review_trainings);
                        $scope.gridOptions_sealed.hcApi.setRowData(data.epm_bid_decode_matter_sealeds);
                        $scope.changeTech();
                        $scope.changePosition();
                    });
                };

                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.hide = true;
                $scope.footerLeftButtons.deleteRow.hide = true;

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });

    });