/**
 * 资产负债表公式设置
 * 2019-03-01
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'swalApi', 'numberApi', 'loopApi'],
    function (module, controllerApi, base_diy_page, requestApi, swalApi, numberApi, loopApi) {
        'use strict';

        var controller = [
                //声明依赖注入
                '$scope', '$stateParams', '$modal',
                //控制器函数
                function ($scope, $stateParams, $modal) {
                    //资产项目科目相关网格
                    $scope.assetsGridOptions = {
                        columnDefs: [
                            {
                                type: '序号'
                            }, {
                                field: 'assets_subject_code',
                                headerName: '科目编码',
                                editable: true,
                                hcRequired: true,
                                width: 200,
                                onCellDoubleClicked: function (args) {
                                    $scope.chooseSubject(args);
                                },
                                onCellValueChanged: function (args) {
                                    if(!args.newValue || args.newValue === args.oldValue){
                                        return;
                                    }
                                    $scope.getInfoByCode('gl_account_subject','km_code', args.data.assets_subject_code)
                                        .then(function (info) {
                                            if(info){
                                                args.data.assets_subject_id = info.gl_account_subject_id;
                                                args.data.assets_subject_name = info.km_name;
                                            }else{
                                                swalApi.info('科目编码【' + args.data.assets_subject_code + '】不存在!');
                                                args.data.assets_subject_code = '';
                                                args.data.assets_subject_name = '';
                                                args.data.assets_subject_id = 0;
                                            }

                                            args.api.refreshView();
                                        })
                                }
                            }
                            , {
                                field: 'assets_subject_name',
                                headerName: '科目名称',
                                width: 270
                            }
                            , {
                                field: 'assets_run',
                                headerName: '运算符号',
                                hcDictCode: 'operators',
                                hcRequired: true,
                                editable: true
                            }
                            , {
                                field: 'assets_type',
                                headerName: '取数规则',
                                hcDictCode: 'getdata_type',
                                hcRequired: true,
                                editable: true
                            }]
                    };

                    //负债项目科目相关网格
                    $scope.liabilitiesGridOptions = {
                        columnDefs: [
                            {
                                type: '序号'
                            }, {
                                field: 'liabilities_subject_code',
                                headerName: '科目编码',
                                width: 200,
                                hcRequired: true,
                                editable: true,
                                onCellDoubleClicked: function (args) {
                                    $scope.chooseSubject(args);
                                },
                                onCellValueChanged: function (args) {
                                    if(!args.newValue || args.newValue === args.oldValue){
                                        return;
                                    }
                                    $scope.getInfoByCode('gl_account_subject','km_code', args.data.liabilities_subject_code)
                                        .then(function (info) {
                                            if(info){
                                                args.data.liabilities_subject_id = info.gl_account_subject_id;
                                                args.data.liabilities_subject_name = info.km_name;
                                            }else{
                                                swalApi.info('科目编码【' + args.data.liabilities_subject_code + '】不存在!');
                                                args.data.liabilities_subject_code = '';
                                                args.data.liabilities_subject_name = '';
                                                args.data.liabilities_subject_id = 0;
                                            }

                                            args.api.refreshView();
                                        })
                                }
                            }
                            , {
                                field: 'liabilities_subject_name',
                                headerName: '科目名称',
                                width: 270
                            }
                            , {
                                field: 'liabilities_run',
                                headerName: '运算符号',
                                hcDictCode: 'operators',
                                hcRequired: true,
                                editable: true
                            }
                            , {
                                field: 'liabilities_type',
                                headerName: '取数规则',
                                hcDictCode: 'getdata_type',
                                hcRequired: true,
                                editable: true
                            }]
                    };

                    //数据定义
                    $scope.data = {};
                    $scope.data.currItem = {};
                    var runMap = {};
                    var typeMap = {};


                    //继承基础控制器
                    controllerApi.extend({
                        controller: base_diy_page.controller,
                        scope: $scope
                    });

                    $scope.getInfoByCode = function (classid, postField, code) {
                        var postdata = {
                            sqlwhere: " " + postField + "='" + code + "'"
                        };
                        var responseData = {};

                        return requestApi.post(classid, 'search', postdata)
                            .then(function (res) {
                                if(res[classid + 's'].length){
                                    return responseData = res[classid + 's'][0];
                                }
                            })
                    };

                    //会计科目通用查询
                    $scope.chooseSubject = function (args) {
                        $modal.openCommonSearch({
                                classId:'gl_account_subject'
                            })
                            .result//响应数据
                            .then(function(result){
                                switch (numberApi.toNumber($scope.data.currItem.obj_type)){
                                    case 1: {
                                        args.data.assets_subject_id = result.gl_account_subject_id;
                                        args.data.assets_subject_code = result.km_code;
                                        args.data.assets_subject_name = result.km_name;
                                        break;
                                    }
                                    case 2: {
                                        args.data.liabilities_subject_id = result.gl_account_subject_id;
                                        args.data.liabilities_subject_code = result.km_code;
                                        args.data.liabilities_subject_name = result.km_name;
                                        break;
                                    }
                                }
                                args.api.refreshView();
                            });
                    };

                    /**
                     * 初始化
                     */
                    $scope.doInit = function () {
                        $scope.hcSuper.doInit().then(function () {
                            $scope.data.currItem.obj_type = $stateParams.obj_type;
                            $scope.data.currItem.line_no = $stateParams.line_no;
                            $scope.data.currItem.desc = $stateParams.desc;
                            var subjects = JSON.parse($stateParams.subjects);

                            //新增设置时显示选择完的会计科目
                            if(subjects.length){
                                switch (numberApi.toNumber($scope.data.currItem.obj_type)){
                                    case 1: {
                                        subjects.forEach(function (item) {
                                            item.assets_subject_id = item.gl_account_subject_id;
                                            item.assets_subject_code = item.km_code;
                                            item.assets_subject_name = item.km_name;

                                            item.obj_type = $scope.data.currItem.obj_type;
                                            item.assets_desc = $scope.data.currItem.desc;
                                        });
                                        $scope.assetsGridOptions.api.setRowData(subjects);
                                        break;
                                    }
                                    case 2: {
                                        subjects.forEach(function (item) {
                                            item.liabilities_subject_id = item.gl_account_subject_id;
                                            item.liabilities_subject_code = item.km_code;
                                            item.liabilities_subject_name = item.km_name;

                                            item.obj_type = $scope.data.currItem.obj_type;
                                            item.liabilities_desc = $scope.data.currItem.desc;
                                        });
                                        $scope.liabilitiesGridOptions.api.setRowData(subjects);
                                        break;
                                    }
                                }
                                $scope.data.currItem.gl_balance_sheet_param_details = subjects;
                            }
                            //修改设置时，显示已设置的科目内容
                            else{
                                return requestApi.post('gl_balance_sheet_param', 'select',
                                    {line_no: $scope.data.currItem.line_no, obj_type: $scope.data.currItem.obj_type})
                            }

                        }).then(function (data) {
                            if(data){
                                $scope.data.currItem.gl_balance_sheet_param_details = data.gl_balance_sheet_param_details;
                                switch (numberApi.toNumber($scope.data.currItem.obj_type)){
                                    case 1: {
                                        $scope.assetsGridOptions.api.setRowData($scope.data.currItem.gl_balance_sheet_param_details);
                                        break;
                                    }
                                    case 2: {
                                        $scope.liabilitiesGridOptions.api.setRowData($scope.data.currItem.gl_balance_sheet_param_details);
                                        break;
                                    }
                                }
                            }

                        }).then(function () {
                            //查词汇值
                            return requestApi.getDict('operators')
                        }).then(function (dicts) {
                            dicts.forEach(function (item) {
                                runMap[item.dictvalue] = item.dictname;
                            });
                            return requestApi.getDict('getdata_type')
                        }).then(function (dicts) {
                            dicts.forEach(function (item) {
                                typeMap[item.dictvalue] = item.dictname;
                            })
                        });
                    };

                    /**
                     * 保存
                     */
                    $scope.save = function () {
                        if($scope.data.currItem.gl_balance_sheet_param_details.length){
                            var msg = [];
                            var repeatMsg = [];
                            switch (numberApi.toNumber($scope.data.currItem.obj_type)){
                                case 1: {
                                    //检查是否有重复的科目
                                    for(var i = 0; i < $scope.data.currItem.gl_balance_sheet_param_details.length - 1; i++){
                                        var repeatLine = [];
                                        for(var j = i + 1; j < $scope.data.currItem.gl_balance_sheet_param_details.length; j++){
                                            if($scope.data.currItem.gl_balance_sheet_param_details[i].assets_subject_id
                                                && $scope.data.currItem.gl_balance_sheet_param_details[i].assets_subject_id
                                                == $scope.data.currItem.gl_balance_sheet_param_details[j].assets_subject_id){
                                                if(repeatMsg.join('、').indexOf(i+1) == -1){
                                                    repeatLine.push(j+1);
                                                }
                                            }
                                        }
                                        if(repeatLine.length){
                                            repeatLine.unshift(i+1);
                                            repeatMsg.push('第' + repeatLine.join('、') + '行');
                                        }
                                    }

                                    //检查必填
                                    var requiredMsg = $scope.assetsGridOptions.hcApi.validCheckForRequired([]);
                                    break;
                                }
                                case 2: {
                                    //检查是否有重复的科目
                                    for(var i = 0; i < $scope.data.currItem.gl_balance_sheet_param_details.length - 1; i++){
                                        var repeatLine = [];
                                        for(var j = i + 1; j < $scope.data.currItem.gl_balance_sheet_param_details.length; j++){
                                            if($scope.data.currItem.gl_balance_sheet_param_details[i].liabilities_subject_id
                                                && $scope.data.currItem.gl_balance_sheet_param_details[i].liabilities_subject_id
                                                == $scope.data.currItem.gl_balance_sheet_param_details[j].liabilities_subject_id){
                                                if(repeatMsg.join('、').indexOf(i+1) == -1){
                                                    repeatLine.push(j+1);
                                                }
                                            }
                                        }
                                        if(repeatLine.length){
                                            repeatLine.unshift(i+1);
                                            repeatMsg.push('第' + repeatLine.join('、') + '行');
                                        }
                                    }

                                    //检查必填
                                    var requiredMsg = $scope.liabilitiesGridOptions.hcApi.validCheckForRequired([]);
                                    break;
                                }
                            }
                            if(repeatMsg.length){
                                repeatMsg.unshift('以下科目重复，请修改');
                                Array.prototype.push.apply(msg, repeatMsg);
                            }
                            if(requiredMsg.length){
                                requiredMsg.unshift('以下内容为必填项，请补充完整');
                                Array.prototype.push.apply(msg, requiredMsg);
                            }
                            if(msg.length){
                                return swalApi.info(msg);
                            }

                            var str = '';
                            $scope.data.currItem.gl_balance_sheet_param_details.forEach(function (item) {
                                switch (numberApi.toNumber($scope.data.currItem.obj_type)) {
                                    case 1: {
                                        //赋值项目描述
                                        item.assets_desc = $scope.data.currItem.desc;
                                        //整合科目运算规则
                                        str += runMap[item.assets_run] + item.assets_subject_code + '(' + typeMap[item.assets_type] + ')';
                                        $scope.data.currItem.assets_operational_rule = str;
                                        break;
                                    }
                                    case 2:{
                                        item.liabilities_desc = $scope.data.currItem.desc;
                                        str += runMap[item.liabilities_run] + item.liabilities_subject_code + '(' + typeMap[item.liabilities_type] + ')';
                                        $scope.data.currItem.liabilities_operational_rule = str;
                                        break;
                                    }
                                }
                                item.obj_type = $scope.data.currItem.obj_type;
                            });
                        }
                        //保存
                        return requestApi.post('gl_balance_sheet_param', 'update', $scope.data.currItem)
                            .then(function () {
                                swalApi.info('保存成功！');

                                if(top.modal_al_detail){
                                    top.modal_al_detail.close(str);
                                }
                            })
                    };

                    //隐藏头部工具栏
                    $scope.hideToolButtons = true;

                    //底部左边按钮
                    $scope.footerLeftButtons = {
                        add_line: {
                            title: '增加行',
                            click: function() {
                                var newline = {};
                                $scope.data.currItem.gl_balance_sheet_param_details.push(newline);
                                switch (numberApi.toNumber($scope.data.currItem.obj_type)){
                                    case 1: {
                                        $scope.assetsGridOptions.api.setRowData($scope.data.currItem.gl_balance_sheet_param_details);
                                        break;
                                    }
                                    case 2: {
                                        $scope.liabilitiesGridOptions.api.setRowData($scope.data.currItem.gl_balance_sheet_param_details);
                                        break;
                                    }
                                }
                            }
                        },
                        del_line: {
                            title: '删除行',
                            click: function() {
                                var idx;
                                switch (numberApi.toNumber($scope.data.currItem.obj_type)){
                                    case 1: {
                                        idx = $scope.assetsGridOptions.hcApi.getFocusedRowIndex();
                                        if(idx < 0) {
                                            return swalApi.info('请选中要删除的行');
                                        }
                                        $scope.data.currItem.gl_balance_sheet_param_details.splice(idx,1);
                                        $scope.assetsGridOptions.api.setRowData($scope.data.currItem.gl_balance_sheet_param_details);
                                        break;
                                    }
                                    case 2: {
                                        idx = $scope.liabilitiesGridOptions.hcApi.getFocusedRowIndex();
                                        if(idx < 0) {
                                            return swalApi.info('请选中要删除的行');
                                        }
                                        $scope.data.currItem.gl_balance_sheet_param_details.splice(idx,1);
                                        $scope.liabilitiesGridOptions.api.setRowData($scope.data.currItem.gl_balance_sheet_param_details);
                                        break;
                                    }
                                }
                            }
                        }
                    };

                    //底部右边按钮
                    $scope.footerRightButtons = {
                        close: {
                            title: '关闭',
                            click: function() {
                                top.modal_al_detail.close();
                            }
                        },
                        save: {
                            title: '保存',
                            click: function() {
                                $scope.save && $scope.save();
                            }
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
    }
);