/**
 * 期末损益结转-空白自定义页
 * 2019-02-20
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'openBizObj', 'swalApi', 'loopApi'],
    function (module, controllerApi, base_diy_page, requestApi, openBizObj, swalApi, loopApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'km_code',
                            headerName: '会计科目编码',
                            width: 120
                        }
                        , {
                            field: 'km_name',
                            headerName: '会计科目名称',
                            width: 300
                        }
                        , {
                            field: 'km_code_ly',
                            headerName: '转入科目编码',
                            width: 120,
                            editable: function () {
                                return $scope.data.currItem.is_setting == 2 ? true : false
                            },
                            onCellDoubleClicked: function (args) {
                                if ($scope.data.currItem.is_setting != 2) {
                                    return;
                                }
                                $scope.chooseSubject(args);
                            },
                            onCellValueChanged: function (args) {
                                if (!args.newValue || args.newValue === args.oldValue) {
                                    return;
                                }
                                var postdata = {
                                    sqlwhere: " km_type=3 and end_km=2 and km_code='" + args.data.km_code_ly + "'"
                                };

                                return requestApi.post('gl_account_subject', 'search', postdata)
                                    .then(function (res) {
                                        if (res.gl_account_subjects.length) {
                                            var info = res.gl_account_subjects[0];
                                            args.data.gl_account_subject_id_ly = info.gl_account_subject_id;
                                            args.data.km_name_ly = info.km_name;
                                        } else {
                                            swalApi.info('科目编码【' + args.data.km_code + '】不存在!');
                                            args.data.km_code_ly = '';
                                            args.data.km_name_ly = '';
                                            args.data.gl_account_subject_id_ly = 0;
                                        }
                                        args.api.refreshView();
                                    })
                            }
                        }
                        , {
                            field: 'km_name_ly',
                            headerName: '转入科目名称',
                            width: 300
                        }
                        , {
                            field: 'is_statement',
                            headerName: '收益科目',
                            type: '是否',
                            cellStyle: {'text-align': 'center'},
                            editable: function () {
                                return $scope.data.currItem.is_setting == 2 ? true : false
                            }
                        }
                    ],
                    hcObjType: 19022001,
                    hcRequestAction: 'statementlistsearch',
                    hcAfterRequest: function (data) {
                        $scope.data.currItem.year_month = data.year_month;
                        $scope.data.currItem.gl_credence_heads = data.gl_credence_heads;
                    }
                };

                $scope.data = {};
                $scope.data.currItem = {
                    is_setting: 1 //是否开启设置模式：1 否 2 是
                };


                /*---------------------通用查询开始------------------------*/

                /**
                 * 查会计科目
                 */
                $scope.chooseSubject = function (args) {
                    $modal.openCommonSearch({
                            classId: 'gl_account_subject',
                            sqlWhere: "km_type=3 and end_km=2"
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.gl_account_subject_id_ly = result.gl_account_subject_id;
                            args.data.km_code_ly = result.km_code;
                            args.data.km_name_ly = result.km_name;
                            args.api.refreshView();

                        });
                };
                /*---------------------通用查询结束------------------------*/

                controllerApi.run({
                    controller: base_diy_page.controller,
                    scope: $scope
                });


                /*-------------------------------------------------------*/

                /**
                 * 初始化数据
                 */
                $scope.initData = function () {
                    $scope.data.currItem.credence_settle_type = 1;//凭证结转类型:1 收益和损失同时结转,2 收益和损失分开结转

                    //查凭证字
                    return requestApi.post('gl_credence_type', 'search', {})
                        .then(function (response) {
                            $scope.data.currItem.character_id = response.gl_credence_types[0].character_id;
                            $scope.data.currItem.character_code = response.gl_credence_types[0].character_code;
                            $scope.data.currItem.character_name = response.gl_credence_types[0].character_name;
                            //组合编码和名称
                            $scope.data.currItem.character = $scope.data.currItem.character_code + ' ' + $scope.data.currItem.character_name;
                        })
                };

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                        .then($scope.initData)
                };

                /**
                 * 结转
                 */
                $scope.settle = function () {
                    $scope.data.currItem.tally_flag = 1;
                    //检查是否在设置状态
                    if ($scope.data.currItem.is_setting == 2) {
                        return swalApi.info('请先保存设置后再进行结转！');
                    }
                    //检查转入科目是否为空
                    if (!$scope.data.currItem.gl_credence_heads.length) {
                        return swalApi.info('无可结转的损益科目');
                    }
                    for (var i = 0; i < $scope.data.currItem.gl_credence_heads.length; i++) {
                        if (!$scope.data.currItem.gl_credence_heads[i].gl_account_subject_id_ly) {
                            return swalApi.info('转入科目不允许为空，请补充!');
                        }
                    }

                    //1.损益同时结转：损失和收益生成同一张记账凭证
                    if ($scope.data.currItem.credence_settle_type == 1) {
                        return swalApi.confirm('确定要结转吗？')
                            .then(function () {
                                return requestApi.post('gl_credence_head', 'statementcost', $scope.data.currItem)
                                    .then(function (data) {
                                        if (data) {
                                            return swalApi.success({
                                                title: '结转成功!\n已生成凭证：' + data.attribute1,
                                                timer: 5000
                                            });
                                        }
                                    })
                            });
                    }
                    //2.损益分开结转：收益生成一张记账凭证，损失生成一张记账凭证（由网格is_statement字段区分）
                    else {
                        return swalApi.confirm('确定要结转吗？')
                            .then(function () {
                                return requestApi.post('gl_credence_head', 'statementcostSSAndSY', $scope.data.currItem)
                                    .then(function (data) {
                                        if (data) {
                                            return swalApi.success({
                                                title: '结转成功!已生成凭证：\n' + data.attribute1 + '\n' + data.attribute2,
                                                timer: 5000
                                            });
                                        }
                                    })
                            });
                    }

                };

                //工具栏按钮
                var old_data = [];
                $scope.toolButtons.cancelSetting = {
                    title: '取消设置',
                    icon: 'iconfont hc-setting',
                    click: function () {
                        $scope.data.currItem.is_setting = 1;
                        $scope.gridOptions.hcApi.setRowData(old_data);
                    },
                    hide: function () {
                        return $scope.data.currItem.is_setting == 2 ? false : true;
                    }
                };
                $scope.toolButtons.setting = {
                    title: '设置',
                    icon: 'iconfont hc-setting',
                    click: function () {
                        old_data = angular.copy($scope.data.currItem.gl_credence_heads);
                        $scope.data.currItem.is_setting = 2;
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.gl_credence_heads);
                    },
                    hide: function () {
                        return $scope.data.currItem.is_setting == 2 ? true : false;
                    }
                };
                $scope.toolButtons.saveSetting = {
                    title: '保存',
                    icon: 'iconfont hc-save',
                    click: function () {
                        return requestApi.post('gl_credence_head', 'savestatementlistsetting', $scope.data.currItem)
                            .then(function () {
                                swalApi.info('保存设置成功！');
                                $scope.data.currItem.is_setting = 1;
                                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.gl_credence_heads);
                            })
                    },
                    hide: function () {
                        return $scope.data.currItem.is_setting == 2 ? false : true;
                    }
                };
                $scope.toolButtons.settle = {
                    title: '结转',
                    icon: 'iconfont hc-jiezhuan',
                    click: function () {
                        $scope.settle && $scope.settle();
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
