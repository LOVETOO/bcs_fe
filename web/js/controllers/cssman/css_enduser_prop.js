/**
 * Created by zhl on 2019/7/9.
 * 顾客档案信息 css_enduser_prop
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi','numberApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi,numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                /**数据定义 */
               /* $scope.data = {};
                $scope.data.currItem = {};*/

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'item_code',
                            headerName: '商品编码',
                            editable: true,
                            onCellDoubleClicked: function (args) {
                                $scope.chooseItem(args);
                            },
                            onCellValueChanged: function (args) {

                                if (args.newValue === args.oldValue)
                                    return;

                                getItem(args.newValue)
                                    .catch(function (reason) {
                                        return {
                                            item_id: 0,
                                            item_code: '',
                                            item_name: reason
                                        };
                                    })
                                    .then(function (line) {
                                        angular.extend(args.data, line);
                                        args.api.refreshView();
                                    });
                            }
                        }, {
                            field: 'item_name',
                            headerName: '商品名称',
                            editable: false
                        }, {
                            field: 'qty',
                            headerName: '购买数量',
                            editable: true,
                            type: '金额',
                            onCellValueChanged: function (args) {
                                $scope.calAmount(args);
                            }
                        }, {
                            field: 'price',
                            headerName: '购买价格',
                            editable: true,
                            type: '金额',
                            onCellValueChanged: function (args) {
                                $scope.calAmount(args);
                            }
                        }, {
                            field: 'amount',
                            headerName: '购买金额',
                            type: '金额'
                        }, {
                            field: 'barcode',
                            headerName: '出厂编号',
                            editable: true
                        }, {
                            field: 'spec',
                            headerName: '商品型号',
                            editable: true
                        }, {
                            field: 'purch_date',
                            headerName: '购买日期',
                            editable: true,
                            type: '日期'
                        }, {
                            field: 'buy_address',
                            headerName: '购买商店',
                            editable: true
                        }, {
                            field: 'bill_type',
                            headerName: '票据类型',
                            editable: true,
                            hcDictCode: 'enduser_bill_type'
                        }, {
                            field: 'bill_no',
                            headerName: '票据号',
                            editable: true
                        }, /* {
                         field: 'vip_type',
                         headerName: 'VIP卡类型',
                         editable:true
                         }, {
                         field: 'vip_no',
                         headerName: 'VIP卡号',
                         editable:true
                         },*/ {
                            field: 'pro_batch_no',
                            headerName: '生产批号',
                            editable: true
                        }
                    ]
                };

                //继承基础控制器
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*-------------------数据处理---------------------*/

                function getCurrItem() {
                    return $scope.data.currItem;
                }

                //新增时数据处理
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.css_enduser_lineofcss_endusers = [];//明细
                    $scope.gridOptions.hcApi.setRowData(bizData.css_enduser_lineofcss_endusers);
                };

                /**
                 * 加载属性页时初始化,设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    $scope.gridOptions.hcApi.setRowData(bizData.css_enduser_lineofcss_endusers);
                };

                $scope.calAmount = function(args){
                    if (args.newValue === args.oldValue)
                        return;
                    if (!args.data.qty || !args.data.price){
                        args.data.amount = 0;
                        return;
                    }
                    args.data.amount = numberApi.mutiply(args.data.qty, args.data.price);
                };

                /*-------------------通用查询---------------------*/

                //查询区域
                $scope.commonSearchSettingOfArea = {
                    afterOk: function (result) {
                        getCurrItem().area_id = result.areaid;
                        getCurrItem().area_code = result.areacode;
                        getCurrItem().area_name = result.areaname;
                    }
                };

                //查询机构
                $scope.commonSearchSettingOfScporg = {
                    afterOk: function (result) {
                        if (!result.code)
                            getCurrItem().org_code = '该部门无编码';
                        else
                            getCurrItem().org_code = result.code;
                        getCurrItem().org_id = result.orgid;
                        getCurrItem().org_name = result.orgname;

                    }
                };

                /**
                 * 查商品(双击单元格)
                 */
                $scope.chooseItem = function (args) {
                    $modal.openCommonSearch({
                            classId: 'item_org'
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.item_id = result.item_id;
                            args.data.item_code = result.item_code;
                            args.data.item_name = result.item_name;
                            args.data.uom_id = result.uom_id;
                            args.data.uom_name = result.uom_name;
                            args.api.refreshView();//刷新网格视图
                        });
                };

                /**
                 * 查商品(粘贴文本到单元格)
                 */
                function getItem(code) {
                    var postData = {
                        classId: "item_org",
                        action: 'search',
                        data: {sqlwhere: "item_code = '" + code + "'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.item_orgs.length > 0) {
                                return data.item_orgs[0];
                            } else {
                                return $q.reject("产品编码【" + code + "】不可用");
                            }
                        });
                };

                //底部左边按钮
                $scope.footerLeftButtons.add_line = {
                    title: '增加行',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    },
                    hide: function () {
                        return (!$scope.tabs.base.active);
                    }
                };
                $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    },
                    hide: function () {
                        return (!$scope.tabs.base.active);
                    }
                };

                /**
                 * 增加行
                 */
                $scope.add_line = function () {
                    $scope.gridOptions.api.stopEditing();

                    //基本信息’"
                    var line = {
                        address1: getCurrItem().address1,
                        defaulted: getCurrItem().defaulted,
                        take_man: getCurrItem().take_man,
                        phone_code: getCurrItem().phone_code,
                    };

                    getCurrItem().css_enduser_lineofcss_endusers.push(line);
                    $scope.gridOptions.hcApi.setRowData(getCurrItem().css_enduser_lineofcss_endusers);
                };

                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var rowIndex;

                    rowIndex = $scope.gridOptions.hcApi.getFocusedRowIndex();

                    if (rowIndex < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        getCurrItem().css_enduser_lineofcss_endusers.splice(rowIndex, 1);
                        $scope.gridOptions.hcApi.setRowData(getCurrItem().css_enduser_lineofcss_endusers);
                    }
                };

                //修改标签页标题
                $scope.tabs.base.title = '基本信息';

                $scope.tabs.other = {
                    title: "其他"
                }


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