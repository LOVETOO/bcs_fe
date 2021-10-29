/**
 * 职位设置 属性  hr_position_setting_prop
 * Created by zhl on 2019/4/4.
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', '$q', 'numberApi', 'dateApi'], defineFn)
})(function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, $q, numberApi, dateApi) {

    HrPositionSettionProp.$inject = ['$scope']

    function HrPositionSettionProp($scope) {


        $scope.position_grades = [];
        /*----------------------------------能否编辑-------------------------------------------*/
        function editable() {
            return true;
        }
        /*----------------------------------表格 定义-------------------------------------------*/

        //表格定义  "职位工作内容"
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'work',
                headerName: '工作内容',
                width:300,
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'work_rule',
                headerName: '工作标准',
                width:300,
                editable: function (args) {
                    return editable();
                }
            }, {
                field: 'work_access',
                headerName: '权限',
                width:300,
                hcDictCode:'work_access',
                editable: function (args) {
                    return editable();
                }
            }]
        };

        //表格定义  "包含用户"
        $scope.gridOptions_users = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'temp',
                headerName: '用户编码'
            }, {
                field: 'temp',
                headerName: '用户名称'
            }, {
                field: 'temp',
                headerName: '状态'
            }]
        };

        //继承基础控制器
        controllerApi.extend({
            controller: base_obj_prop.controller,
            scope: $scope
        });


        $scope.doAfterSelect = function (responseData) {
            //初始化职等
            $scope.initGrade(responseData.hr_position_level_id);
        };

        $scope.doAfterSearch = function (responseData) {
            //初始化职等
            $scope.initGrade(responseData.hr_position_level_id);
        };

        //更新职等
        $scope.initGrade = function(leveId){
            $scope.position_grades.length = 0;
            $scope.position_grade
            var postData = {
                sqlwhere: ' hr_position_level_id = ' + leveId
            };

            //初始化 “职等”
            requestApi.post('hr_position_levelgrade', 'search', postData)
                .then(function (response) {
                    if(response.hr_position_levelgrades.length > 0){
                        var hr_position_levelgrade = response.hr_position_levelgrades[0];

                        var bottom, top;
                        bottom = hr_position_levelgrade.grade_bottom_line;
                        top = hr_position_levelgrade.grade_top_line;

                        for (bottom; bottom <= top; bottom++) {
                            $scope.position_grades.push({name:bottom,value:bottom});
                        }

                    }
                });
        }

        /*----------------------------------通用查询相关内容-------------------------------------------*/

        //部门 查询
        $scope.commonSearchSettingOfDept = {
            afterOk: function (result) {
                $scope.data.currItem.dept_id = result.dept_id;
                $scope.data.currItem.dept_code = result.dept_code;
                $scope.data.currItem.dept_name = result.dept_name;
            }
        };
        //职群/职种 查询
        $scope.commonSearchSettingOfPositionGroup = {

            //sqlWhere: ' usable = 2 ',
            afterOk: function (result) {
                $scope.data.currItem.hr_position_group_id = result.hr_position_group_id;
                $scope.data.currItem.position_group_code = result.position_group_code;
                $scope.data.currItem.position_group_name = result.position_group_name;
            }
        };
        //职位 查询
        $scope.commonSearchSettingOfPosition = {
            super : {
                sqlWhere: " hr_position_id <> " + $scope.data.currItem.hr_position_id,
                afterOk: function (result) {
                    console.log(result, 'super of commonSearchSettingOfPosition');
                }
            },
            low : {
                sqlWhere: " hr_position_id <> " + $scope.data.currItem.hr_position_id,
                afterOk: function (result) {
                    console.log(result, 'low of commonSearchSettingOfPosition');
                }
            }
        };

        //职类 查询 (先查出职类，再查出职类对应的职级，最后根据职级职等关系设定职等)
        $scope.commonSearchSettingOfPositionClass = {
            sqlWhere: " usable = 2 ",
            afterOk: function (result) {
                $scope.data.currItem.hr_position_class_id = result.hr_position_class_id;
                $scope.data.currItem.position_class_code = result.position_class_code;
                $scope.data.currItem.position_class_name = result.position_class_name;
            }
        };
        //职级 查询
        $scope.commonSearchSettingOfLevel = {

            /* beforeOpen: function () {
             if(!$scope.data.currItem.hr_position_class_id){
             swalApi.info('请选择职类');
             return false;
             }
             },*/

            sqlWhere: function () {
                return " usable = 2 and hr_position_class_id = \'" + $scope.data.currItem.hr_position_class_id + "\'";
            },
            afterOk: function (result) {
                $scope.data.currItem.hr_position_level_id = result.hr_position_level_id;
                $scope.data.currItem.position_level_code = result.remark;//显示备注

                //更新职等
                $scope.initGrade(result.hr_position_level_id);
            },
            beforeOpen:function(){
                if($scope.data.currItem.position_class_name==undefined||$scope.data.currItem.position_class_name==""){
                    swalApi.info('请先选择职类');
                    return false;
                }
            }
        };

        /**
         * 新增时数据
         */
        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);
            bizData.hr_position_workofhr_positions = [];
            $scope.gridOptions.hcApi.setRowData(bizData.hr_position_workofhr_positions);
            bizData.Hr_Positions = [];
            $scope.gridOptions_users.hcApi.setRowData(bizData.Hr_Positions);
            bizData.usable=2;
        };

        //保存验证
        $scope.validCheck = function (invalidBox) {
            var len = 0;
            return requestApi.post({
                    classId: 'hr_position',
                    action: 'search',
                    data: {
                        sqlwhere:"position_code='"+$scope.data.currItem.position_code+"'"
                    }
                })
                .then(function ( response ) {
                    if(response.hr_positions.length>0){
                        invalidBox.push("职位编码不能重复");
                    }
                }).then(function(){
                    $scope.hcSuper.validCheck(invalidBox);
                    return invalidBox;
            });
        };

        //验证表头信息是否填完
        $scope.validHead = function (invalidBox) {
            $scope.hcSuper.validCheck(invalidBox);
            return invalidBox;
        };

        /**
         * 设置数据
         */
        $scope.setBizData = function (bizData) {
            $scope.hcSuper.setBizData(bizData);
            $scope.gridOptions.hcApi.setRowData(bizData.hr_position_workofhr_positions);
            $scope.gridOptions_users.hcApi.setRowData(bizData.Hr_Positions);
        }



        $scope.copyBizData = function (bizData) {
            //基础控制器的处理复制对象，已处理了ID、状态等字段
            $scope.hcSuper.copyBizData(bizData);
            bizData.date_invbill = dateApi.today();
            bizData.creation_date = dateApi.now();
            bizData.created_by = strUserId;
            bizData.is_copy = 2;
        };



        /*底部左边按钮-函数定义*/
        //添加base
        $scope.add_line = function () {
            var msg = $scope.validHead([]);
            if (msg.length > 0) {
                return swalApi.info(msg);
            }
            $scope.gridOptions.api.stopEditing();
            swal({
                title: '请输入要增加的行数',
                type: 'input', //类型为输入框
                inputValue: 1, //输入框默认值
                closeOnConfirm: false, //点击确认不关闭，由后续代码判断是否关闭
                showCancelButton: true //显示【取消】按钮
            }, function (inputValue) {
                if (inputValue === false) {
                    swal.close();
                    return;
                }

                var rowCount = Number(inputValue);
                if (rowCount <= 0) {
                    swal.showInputError('请输入有效的行数');
                    return;
                }
                else if (rowCount > 1000) {
                    swal.showInputError('请勿输入过大的行数(1000以内为宜)');
                    return;
                }

                swal.close();

                var data = $scope.data.currItem.hr_position_workofhr_positions;

                for (var i = 0; i < rowCount; i++) {
                    var newLine = {

                    };
                    data.push(newLine);
                }
                $scope.gridOptions.hcApi.setRowData(data);
            });
        };

        //添加user
        $scope.add_user = function () {
            var msg = $scope.validHead([]);
            if (msg.length > 0) {
                return swalApi.info(msg);
            }
            $scope.gridOptions_users.api.stopEditing();
            swal({
                title: '请输入要增加的行数',
                type: 'input', //类型为输入框
                inputValue: 1, //输入框默认值
                closeOnConfirm: false, //点击确认不关闭，由后续代码判断是否关闭
                showCancelButton: true //显示【取消】按钮
            }, function (inputValue) {
                if (inputValue === false) {
                    swal.close();
                    return;
                }

                var rowCount = Number(inputValue);
                if (rowCount <= 0) {
                    swal.showInputError('请输入有效的行数');
                    return;
                }
                else if (rowCount > 1000) {
                    swal.showInputError('请勿输入过大的行数(1000以内为宜)');
                    return;
                }

                swal.close();

                var data = $scope.data.currItem.Hr_Positions;

                for (var i = 0; i < rowCount; i++) {
                    var newLine = {

                    };
                    data.push(newLine);
                }
                $scope.gridOptions_users.hcApi.setRowData(data);
            });
        };
        /**
         * 删除行base
         */
        $scope.del_line = function () {
            var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
            if (idx < 0) {
                swalApi.info('请选中要删除的行');
            } else {
                $scope.data.currItem.hr_position_workofhr_positions.splice(idx, 1);
                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.hr_position_workofhr_positions);
            }
        };
        /**
         * 删除行user
         */
        $scope.del_user = function () {
            var idx = $scope.gridOptions_users.hcApi.getFocusedRowIndex();
            if (idx < 0) {
                swalApi.info('请选中要删除的行');
            } else {
                $scope.data.currItem.Hr_Positions.splice(idx, 1);
                $scope.gridOptions_users.hcApi.setRowData($scope.data.currItem.Hr_Positions);
            }
        };

        /*----------------------------------按钮及标签 定义-------------------------------------------*/

        /*底部左边按钮*/

        $scope.footerLeftButtons.addRow.click = function(){
            if($scope.tabs.base.active){
                $scope.add_line && $scope.add_line();
            }
            if($scope.tabs.users.active){
                $scope.add_user && $scope.add_user();
            }
        }
        $scope.footerLeftButtons.addRow.hide = function(){
            return (!$scope.tabs.users.active && !$scope.tabs.base.active);
        }
        $scope.footerLeftButtons.deleteRow.click=function(){

            if($scope.tabs.base.active){
                $scope.del_line && $scope.del_line();
            }
            if($scope.tabs.users.active){
                $scope.del_user && $scope.del_user();
            }
        }
        $scope.footerLeftButtons.deleteRow.hide=function(){
            return (!$scope.tabs.users.active && !$scope.tabs.base.active);
        }


        //标签定义

        $scope.tabs.users = {
            title: '包含用户'
        };


    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: HrPositionSettionProp
    });

});


