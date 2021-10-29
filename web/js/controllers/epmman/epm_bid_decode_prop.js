/**
 * 招标文件解读
 * 2019/6/6.
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'numberApi', '$modal'],
    function (module, controllerApi, base_obj_prop, swalApi, numberApi, $modal) {


        var controller = [
            '$scope',

            function ($scope) {

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //定义商务分数判断数据
                $scope.data.businessScore = 0;

                //定义技术分数判断数据
                $scope.data.technologyScore = 0;

                //表头数据是否必填参数
                $scope.busRequired = 1;
                $scope.required = 1;
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
                        hcDictCode:'resouce_type',
                        hcRequired:true,
                        width:120,
                        editable: true
                    }, {
                        field: 'name',
                        headerName: '内容',
                        hcRequired:true,
                        onCellDoubleClicked: function (args) {
                            //查询证照
                            $scope.chooseMatter(args);
                        },
                        width:400,
                        editable: true
                    }, {
                        field: 'note',
                        headerName: '备注',
                        width: 428,
                        editable: true
                    }],
                    //定义表格增减行按钮
                    hcButtons: {
                        callAdd: {
                            icon: 'iconfont hc-add',
                            click: function () {
                                $scope.addCall && $scope.addCall();
                            }
                        },
                        invoiceDel: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                $scope.delCall && $scope.delCall();
                            }
                        }
                    }
                };
                /**
                 * 表格定义  "商务评审"
                 */
                $scope.gridOptions_business = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'norm_type',
                        headerName: '评审指标',
                        hcRequired:true,
                        width:120,
                        editable: true
                    }, {
                        field: 'norm_detail',
                        headerName: '指标内容',
                        hcRequired:true,
                        width:600,
                        editable: true
                    }, {
                        field: 'norm_score',
                        headerName: '评审分数',
                        editable: true,
                        hcRequired:true,
                        width:120,
                        hide:false,
                        type:'金额',
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue){
                                return;
                            }
                            $scope.changeBusinessScore(args);
                        }
                    }],
                    //定义表格增减行按钮
                    hcButtons: {
                        businessAdd: {
                            icon: 'iconfont hc-add',
                            click: function () {
                                $scope.addBusiness && $scope.addBusiness();
                            }
                        },
                        invoiceDel: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                $scope.delBusiness && $scope.delBusiness();
                            }
                        }
                    }
                };

                /**
                 * 表格定义  "技术评审"
                 */
                $scope.gridOptions_technology = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'norm_type',
                        headerName: '评审指标',
                        hcRequired:true,
                        width:120,
                        editable: true
                    }, {
                        field: 'norm_detail',
                        headerName: '指标内容',
                        hcRequired:true,
                        width:600,
                        editable: true
                    }, {
                        field: 'norm_score',
                        headerName: '评审分数',
                        editable: true,
                        hcRequired:true,
                        width:120,
                        hide:false,
                        type:'金额',
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue){
                                return;
                            }
                            $scope.changeArtScore(args);
                        }
                    }],
                    //定义表格增减行按钮
                    hcButtons: {
                        technologyAdd: {
                            icon: 'iconfont hc-add',
                            click: function () {
                                $scope.addTechnology && $scope.addTechnology();
                            }
                        },
                        invoiceDel: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                $scope.delTechnology && $scope.delTechnology();
                            }
                        }
                    }
                };
                /**
                 * 表格定义  "封标注意"
                 */
                $scope.gridOptions_sealed = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'matter',
                        headerName: '注意事项',
                        hcRequired:true,
                        width:120,
                        editable: true
                    }
                    , {
                        field: 'name',
                        headerName: '内容',
                        hcRequired:true,
                        width:400,
                        editable: true
                    }, {
                        field: 'note',
                        headerName: '备注',
                        width:428,
                        editable: true
                    }],
                    //定义表格增减行按钮
                    hcButtons: {
                        sealedAdd: {
                            icon: 'iconfont hc-add',
                            click: function () {
                                $scope.addSealed && $scope.addSealed();
                            }
                        },
                        invoiceDel: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                $scope.delSealed && $scope.delSealed();
                            }
                        }
                    }
                };


                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 工程项目查询
                 */
                $scope.commonSearchOfEpmProject = {
                    postData: {
                        search_flag: 5,                                             //过滤已选项目
                        table_name:'epm_bid_decode',                            //表名
                        primary_key_name:'bid_decode_id',                       //主键
                        primary_key_id:$scope.data.currItem.bid_decode_id > 0 ? //主键id
                            $scope.data.currItem.bid_decode_id : 0
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.project_id = result.project_id;
                        $scope.data.currItem.project_code = result.project_code;
                        $scope.data.currItem.project_name = result.project_name;
                    }
                };

                /**
                 * 证照文件查询
                 */
                $scope.chooseMatter = function (args) {
                    if(args.data.matter==undefined||args.data.matter==null||args.data.matter==""){
                        swalApi.info('请先选择投标注意事项');
                        return;
                    }
                    return $modal.openCommonSearch({
                        classId:'epm_resouce_archives',
                        postData:{
                            resouce_type:args.data.matter,
                            search_flag:99
                        }
                    })
                        .result//响应数据
                        .then(function(result){
                            args.data.name = result.resource_name;
                        })
                        .then(function () {
                        args.api.refreshView();//刷新网格视图
                    });
                };

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /**
                 * 校验商务表格数字
                 */
                $scope.changeBusinessScore = function(args){
                    if(!numberApi.isNum(Number(args.data.norm_score))){
                        args.data.norm_score = undefined;
                        swalApi.info('请输入正确的数字');
                        return;
                    }
                    if(Number(args.data.norm_score)<=0){
                        args.data.norm_score = undefined;
                        swalApi.info('请输入大于零的数字');
                        return;
                    }
                    //数据清零
                    $scope.data.currItem.sumBusSroce = 0;
                    $scope.data.currItem.epm_bid_decode_review_businesss.forEach(function (val) {
                        //合计总评分
                        if(val.norm_score>0){
                            $scope.data.currItem.sumBusSroce = numberApi.sum($scope.data.currItem.sumBusSroce,val.norm_score);
                        }
                    });
                    //转换金额格式
                    $scope.data.currItem.sumBusSroce = numberApi.toMoney($scope.data.currItem.sumBusSroce);
                };

                /**
                 * 校验技术表格数字
                 */
                $scope.changeArtScore = function(args){
                    if(!numberApi.isNum(Number(args.data.norm_score))){
                        args.data.norm_score = undefined;
                        swalApi.info('请输入正确的数字');
                        return;
                    }
                    if(Number(args.data.norm_score)<=0){
                        args.data.norm_score = undefined;
                        swalApi.info('请输入大于零的数字');
                        return;
                    }
                    //数据清零
                    $scope.data.currItem.sumRevSroce = 0;
                    $scope.data.currItem.epm_bid_decode_review_trainings.forEach(function (val) {
                        //合计总评分
                        if(val.norm_score>0){
                            $scope.data.currItem.sumRevSroce = numberApi.sum($scope.data.currItem.sumRevSroce,val.norm_score);
                        }
                    });
                    //转换金额格式
                    $scope.data.currItem.sumRevSroce = numberApi.toMoney($scope.data.currItem.sumRevSroce);
                };

                /**
                 * 校验表头数字
                 */
                $scope.changeCtrlPrice = function(){
                    if($scope.data.currItem.ctrl_price == undefined || $scope.data.currItem.ctrl_price == ""){
                        return;
                    }
                    if(!numberApi.isNum(numberApi.toNumber($scope.data.currItem.ctrl_price))){
                        swalApi.info('请输入正确的数字');
                        $scope.data.currItem.ctrl_price = undefined;
                    }else if($scope.data.currItem.ctrl_price < 0){
                        swalApi.info('请输入大于零的数字');
                        $scope.data.currItem.ctrl_price = undefined;
                    }else{
                        $scope.data.currItem.ctrl_price = numberApi
                            .toMoney(numberApi.toNumber($scope.data.currItem.ctrl_price));
                    }
                };
                $scope.changeCtrlGuarante = function(){
                    if($scope.data.currItem.guarantee_amount == undefined || $scope.data.currItem.guarantee_amount == ""){
                        return;
                    }
                    if(!numberApi.isNum(numberApi.toNumber($scope.data.currItem.guarantee_amount))){
                        swalApi.info('请输入正确的数字');
                        $scope.data.currItem.guarantee_amount = undefined;
                    }else if($scope.data.currItem.guarantee_amount < 0){
                        swalApi.info('请输入大于零的数字');
                        $scope.data.currItem.guarantee_amount = undefined;
                    }else{
                        $scope.data.currItem.guarantee_amount = numberApi
                            .toMoney(numberApi.toNumber($scope.data.currItem.guarantee_amount));
                    }
                };
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.epm_bid_decode_matter_calls = [];
                    bizData.epm_bid_decode_review_businesss = [];
                    bizData.epm_bid_decode_review_trainings = [];
                    bizData.epm_bid_decode_matter_sealeds = [];
                    //默认打分制
                    bizData.tech_meth = 1;
                    bizData.business_meth = 1;
                };

                /**
                 * 商务评分方式发生变化
                 */
                $scope.changePosition = function () {
                    if($scope.data.currItem.business_meth==1){//打分制
                        $scope.gridOptions_business.columnDefs[3].hide = false;//可见评分列
                        $scope.data.businessScore = 0;//判断数据
                        //计算商务总分
                        $scope.data.currItem.sumBusSroce = 0;//数据清零
                        $scope.data.currItem.epm_bid_decode_review_businesss.forEach(function (val) {
                            //合计总评分
                            if(val.norm_score>0){
                                $scope.data.currItem.sumBusSroce = numberApi.sum($scope.data.currItem.sumBusSroce,val.norm_score);
                            }else{
                                //清除数据
                                val.norm_score = undefined;
                            }
                        });
                        //将数据调整为小数点后两位
                        $scope.data.currItem.sumBusSroce = numberApi.toMoney($scope.data.currItem.sumBusSroce);
                    }else if($scope.data.currItem.business_meth==2){//非打分制
                        $scope.gridOptions_business.columnDefs[3].hide = true;//隐藏平分列
                        $scope.data.businessScore = 1;//修改判断数据
                    }
                    //将数据调整为小数点后两位
                    $scope.gridOptions_business.api.setColumnDefs($scope.gridOptions_business.columnDefs);
                };

                /**
                 * 技术评分方式发生变化
                 */
                $scope.changeTech = function () {
                    if($scope.data.currItem.tech_meth==1){//打分制
                        $scope.gridOptions_technology.columnDefs[3].hide = false;//可见评分列
                        $scope.data.technologyScore = 0;//判断数据
                        //计算技术总分
                        $scope.data.currItem.sumRevSroce = 0;//数据清零
                        $scope.data.currItem.epm_bid_decode_review_trainings.forEach(function (val) {
                            //合计总评分
                            if(val.norm_score>0){
                                $scope.data.currItem.sumRevSroce = numberApi.sum($scope.data.currItem.sumRevSroce,val.norm_score);
                            }else{
                                val.norm_score = undefined;//清除数据
                            }
                        });
                        //将数据调整为小数点后两位
                        $scope.data.currItem.sumRevSroce = numberApi.toMoney($scope.data.currItem.sumRevSroce);
                    }else if($scope.data.currItem.tech_meth==2){//非打分制
                        $scope.gridOptions_technology.columnDefs[3].hide = true;//隐藏平分列
                        $scope.data.technologyScore = 1;//修改判断数据
                    }
                    //将数据调整为小数点后两位
                    $scope.gridOptions_technology.api.setColumnDefs($scope.gridOptions_technology.columnDefs);
                };

                /**
                 * 保存验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    var index = 0;
                    $scope.data.currItem.epm_bid_decode_matter_calls.forEach(function(val){
                        index++;
                        if(val.matter==null||val.matter==""||val.matter==undefined||val.matter==0){
                            invalidBox.push("投标注意事项第"+index+"行注意事项为空，请修改");
                        }
                        if(val.name==null||val.name==""||val.name==undefined){
                            invalidBox.push("投标注意事项第"+index+"行内容为空，请修改");
                        }
                    });
                    var len = 0;
                    $scope.data.currItem.epm_bid_decode_matter_sealeds.forEach(function(val){
                        len++;
                        if(val.matter==null||val.matter==""||val.matter==undefined){
                            invalidBox.push("封标注意事项第"+len+"行注意事项为空，请修改");
                        }
                        if(val.name==null||val.name==""||val.name==undefined){
                            invalidBox.push("封标注意事项第"+len+"行内容为空，请修改");
                        }
                    });
                    if ($scope.data.currItem.guarantee_amount_type == 4){
                        //当保证金类型为保函时，附件必须上传
                        if($scope.projAttachController.getAttaches().length <= 0 ){
                            invalidBox.push("请上传'银行保函'附件！");
                        }else {
                            var whether = true;
                            $scope.projAttachController.getAttaches().forEach(function (value) {
                                if(value.attach_type == "银行保函"){
                                    whether = false;
                                }
                            });
                            if(whether){
                                invalidBox.push("请上传'银行保函'附件！");
                            }
                        }
                    }

                    return invalidBox;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions_call.hcApi.setRowData(bizData.epm_bid_decode_matter_calls);
                    $scope.gridOptions_business.hcApi.setRowData(bizData.epm_bid_decode_review_businesss);
                    $scope.gridOptions_technology.hcApi.setRowData(bizData.epm_bid_decode_review_trainings);
                    $scope.gridOptions_sealed.hcApi.setRowData(bizData.epm_bid_decode_matter_sealeds);
                    $scope.changeTech();//技术评分方式发生变化
                    $scope.changePosition();//商务评分方式发生变化
                    if(bizData.epm_bid_decode_review_businesss.length > 0){
                        $scope.busRequired = 2;
                    }else{
                        $scope.busRequired = 1;
                    }
                    if(bizData.epm_bid_decode_review_trainings.length > 0){
                        $scope.required = 2;
                    }else{
                        $scope.required = 1;
                    }
                    if($scope.data.currItem.ctrl_price == ""){
                        $scope.data.currItem.ctrl_price = undefined;
                    }
                    if($scope.data.currItem.guarantee_amount == ""){
                        $scope.data.currItem.guarantee_amount = undefined;
                    }
                };

                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.hide = true;
                $scope.footerLeftButtons.deleteRow.hide = true;
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                //添加投标
                $scope.addCall = function () {
                    $scope.gridOptions_call.api.stopEditing();
                    $scope.data.currItem.epm_bid_decode_matter_calls.push({});
                    $scope.gridOptions_call.hcApi.setRowData($scope.data.currItem.epm_bid_decode_matter_calls);
                };
                /**
                 * 删除投标
                 */
                $scope.delCall = function () {
                    var idx = $scope.gridOptions_call.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_bid_decode_matter_calls.splice(idx, 1);
                        $scope.gridOptions_call.hcApi.setRowData($scope.data.currItem.epm_bid_decode_matter_calls);
                    }
                };

                /**
                 * 添加商务评审
                 */
                $scope.addBusiness = function () {
                    $scope.gridOptions_business.api.stopEditing();
                    var data = $scope.data.currItem.epm_bid_decode_review_businesss;
                    data.push({});
                    $scope.gridOptions_business.hcApi.setRowData(data);
                    $scope.busRequired = 2;
                };
                /**
                 * 删除商务评审
                 */
                $scope.delBusiness = function () {
                    var idx = $scope.gridOptions_business.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_bid_decode_review_businesss.splice(idx, 1);
                        $scope.gridOptions_business.hcApi.setRowData($scope.data.currItem.epm_bid_decode_review_businesss);
                        if($scope.data.currItem.business_meth==1){//打分制时
                            //计算商务总分
                            $scope.data.currItem.sumBusSroce = 0;总评分清零
                            $scope.data.currItem.epm_bid_decode_review_businesss.forEach(function (val) {
                                //计算总评分
                                if(val.norm_score>0){
                                    $scope.data.currItem.sumBusSroce = numberApi.sum($scope.data.currItem.sumBusSroce,val.norm_score);
                                }
                            });
                            //调整总评分为小数点后两位
                            $scope.data.currItem.sumBusSroce = numberApi.toMoney($scope.data.currItem.sumBusSroce);
                        }
                        if($scope.gridOptions_business.hcApi.getFocusedRowIndex()<0){
                            $scope.busRequired = 1;
                        }
                    }
                };

                /**
                 *  添加技术评审
                 */
                $scope.addTechnology = function () {
                    $scope.gridOptions_technology.api.stopEditing();
                    var data = $scope.data.currItem.epm_bid_decode_review_trainings;
                    data.push({});
                    $scope.gridOptions_technology.hcApi.setRowData(data);
                    $scope.required = 2;
                };
                /**
                 * 删除行技术评审
                 */
                $scope.delTechnology = function () {
                    var idx = $scope.gridOptions_technology.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_bid_decode_review_trainings.splice(idx, 1);
                        $scope.gridOptions_technology.hcApi.setRowData($scope.data.currItem.epm_bid_decode_review_trainings);
                        if($scope.data.currItem.tech_meth==1){
                            //计算技术总分
                            $scope.data.currItem.sumRevSroce = 0;
                            $scope.data.currItem.epm_bid_decode_review_trainings.forEach(function (val) {
                                if(val.norm_score>0){
                                    $scope.data.currItem.sumRevSroce = numberApi.sum($scope.data.currItem.sumRevSroce,val.norm_score);
                                }
                            });
                            $scope.data.currItem.sumRevSroce = numberApi.toMoney($scope.data.currItem.sumRevSroce);
                        }
                        if($scope.gridOptions_technology.hcApi.getFocusedRowIndex() < 0){
                            $scope.required = 1;
                        }
                    }
                };


                /**
                 * 添加封标
                 */
                $scope.addSealed = function () {
                    $scope.gridOptions_sealed.api.stopEditing();
                    $scope.data.currItem.epm_bid_decode_matter_sealeds.push({});
                    $scope.gridOptions_sealed.hcApi.setRowData($scope.data.currItem.epm_bid_decode_matter_sealeds);
                };
                /**
                 * 删除封标
                 */
                $scope.delSealed = function () {
                    var idx = $scope.gridOptions_sealed.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_bid_decode_matter_sealeds.splice(idx, 1);
                        $scope.gridOptions_sealed.hcApi.setRowData($scope.data.currItem.epm_bid_decode_matter_sealeds);
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

    });