/**
 * 售后BOM通用-属性
 * time: 2019/7/24
 * createby limeng
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', '$modal', 'swalApi', 'dateApi', 'openBizObj', 'numberApi', 'requestApi', 'fileApi'],
    function (module, controllerApi, base_obj_prop, $modal, swalApi, dateApi, openBizObj, numberApi, requestApi, fileApi) {
        'use strict';
        var CssItemBom = [
            '$scope', '$stateParams',
            function ($scope) {

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------导入-------------------------------------------*/
                //配置导入请求
                $scope.importSettingInfo = {
                    classId: 'css_item_bom',
                    action: 'import'
                };
                $scope.improtfile = function () {
                    fileApi.chooseExcelAndGetData()
                        .then(function (val) {
                            var postData = {
                                classId: "css_item_bom",
                                action: 'import',
                                data: {
                                    css_item_boms: val.rows
                                }
                            };
                            return postData;

                        }).then(requestApi.post)
                        .then(function () {
                            swalApi.in
                        }).then(function () {
                        swalApi.info('导入成功');
                    });
                };
                /*----------------------------------表格定义-------------------------------------------*/
                //表格定义  "产品 "
                $scope.gridOptions_Drp_Item = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'drp_item_code',
                        headerName: '产品编码',
                        width: 254,
                        onCellDoubleClicked: function (args) {
                            $scope.search_drp_item(args);
                        },
                        onCellClicked: function (args) {
                            $scope.search_Item_Bom(args);
                        }
                    }, {
                        field: 'drp_item_name',
                        headerName: '产品名称',
                        width: 254,
                        onCellDoubleClicked: function (args) {
                            $scope.search_drp_item(args);
                        },
                        onCellClicked: function (args) {
                            $scope.search_Item_Bom(args);
                        }
                    }, {
                        field: 'drp_item_spec',
                        headerName: '规格型号',
                        width: 254,
                        onCellDoubleClicked: function (args) {
                            $scope.search_drp_item(args);
                        },
                        onCellClicked: function (args) {
                            $scope.search_Item_Bom(args);
                        }
                    }]
                };
                //表格定义  "配件"
                $scope.gridOptions_Item = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'item_code',
                        headerName: '配件编码',
                        width: 209,
                        onCellDoubleClicked: function (args) {
                            $scope.search_item(args);
                        }
                    }, {
                        field: 'item_name',
                        headerName: '配件名称',
                        width: 200,
                        onCellDoubleClicked: function (args) {
                            $scope.search_item(args);
                        }
                    }, {
                        field: 'item_spec',
                        headerName: '规格型号',
                        width: 180,
                        onCellDoubleClicked: function (args) {
                            $scope.search_item(args);
                        }
                    }, {
                        field: 'qty',
                        headerName: 'BOM数量',
                        type: "数量",
                        width: 180,
                        editable: true,
                        onCellValueChanged: function (args) {
                            if (!numberApi.isStrOfNum(args.data.qty)) {
                                swalApi.info('输入的不是一个数');
                                args.data.qty = 0;
                                args.api.refreshView();
                            }
                        }

                    }]
                };

                /*----------------------------------通用查询-------------------------------------------*/
                /**
                 * 查询产品信息
                 */
                $scope.search_drp_item = function (args) {
                    $modal.openCommonSearch({
                        classId: 'drp_item',
                        postData: {
                            flag: 20,
                            usable: 2
                        },
                        action: 'search',
                        title: "产品信息",
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "产品编码",
                                    field: "item_code"
                                }, {
                                    headerName: "产品名称",
                                    field: "item_name"
                                }, {
                                    headerName: "产品型号",
                                    field: "spec"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function (result) {
                            if ($scope.checkDrp_ItemDouble(result.item_id)) {
                                swalApi.info('已有产品:  ' + result.item_name);
                                return false;
                            }
                            args.data.drp_item_id = result.item_id;
                            args.data.drp_item_code = result.item_code;
                            args.data.drp_item_name = result.item_name;
                            args.data.drp_item_spec = result.spec;
                            args.api.refreshView();
                        });
                };

                /**
                 * 查询配件信息  可用
                 */
                $scope.search_item = function (args) {
                    $modal.openCommonSearch({
                        classId: 'css_item',
                        postData: {
                            flag: 20,//查询可用的配件信息
                            usable: 2
                        },
                        action: 'search',
                        title: "配件信息",
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "配件编码",
                                    field: "item_code"
                                }, {
                                    headerName: "配件名称",
                                    field: "item_name"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function (result) {
                            if ($scope.checkCss_ItemDouble(result.item_id)) {
                                swalApi.info('该产品已有  ' + result.item_name + ' 配件');
                                return false;
                            }
                            args.data.item_id = result.item_id;
                            args.data.item_code = result.item_code;
                            args.data.item_name = result.item_name;
                            args.data.item_spec = result.item_spec;
                            args.api.refreshView();
                        });
                };

                /**
                 *  根据产品信息 查询 配件BOM
                 */
                $scope.search_Item_Bom = function (args) {
                    if ($scope.data.currItem.bom_flag == 1) {
                        var item_bom = [{}];
                        item_bom[0] = args.data;
                        $scope.data.currItem.css_item_boms = item_bom;
                        $scope.gridOptions_Item.hcApi.setRowData($scope.data.currItem.css_item_boms);
                        args.api.refreshView();
                        return;
                    }
                    requestApi.post({
                        classId: 'css_item_bom',
                        action: 'search',
                        data: {
                            searchflag: 2,
                            drp_item_id: args.data.drp_item_id
                        }
                    }).then(function (response) {
                        $scope.data.currItem.css_item_boms = response.css_item_boms;
                        $scope.gridOptions_Item.hcApi.setRowData($scope.data.currItem.css_item_boms);
                        args.api.refreshView();
                    });
                };
                /*----------------------------------通用查询结束-------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    $scope.data.currItem.drp_itemofcss_item_boms = [{}];
                    $scope.gridOptions_Drp_Item.hcApi.setRowData($scope.data.currItem.drp_itemofcss_item_boms);
                    $scope.data.currItem.css_item_boms = [];
                };
                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions_Item.hcApi.setRowData(bizData.css_item_boms);
                    $scope.gridOptions_Drp_Item.hcApi.setRowData(bizData.drp_itemofcss_item_boms);
                };
                /**
                 * 保存前校验
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    if (bizData.css_item_boms.length == 0) {
                        var indexCssItem = $scope.gridOptions_Drp_Item.hcApi.getFocusedRowIndex();
                        if (bizData.drp_itemofcss_item_boms[indexCssItem]) {
                            var newData = {};
                            for (var prop in bizData.drp_itemofcss_item_boms[indexCssItem]) {
                                if (prop == 'bom_id') {
                                    continue;
                                }
                                newData[prop] = bizData.drp_itemofcss_item_boms[indexCssItem][prop];
                            }
                            bizData.css_item_boms.push(newData);
                        }
                    }
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addDrp_Item = {
                    title: '增加产品信息',
                    click: function () {
                        $scope.addDrp_Item && $scope.addDrp_Item();
                    }
                };
                $scope.footerLeftButtons.deleteDrp_Item = {
                    title: '删除产品信息',
                    click: function () {
                        $scope.deleteDrp_Item && $scope.deleteDrp_Item();
                    }
                };
                $scope.footerRightButtons.deleteItem = {
                    title: '删除配件信息',
                    click: function () {
                        $scope.deleteItem && $scope.deleteItem();
                    }
                };
                $scope.footerRightButtons.addItem = {
                    title: '增加配件信息',
                    click: function () {
                        $scope.addItem && $scope.addItem();
                    }
                };
                $scope.footerRightButtons.saveThenAdd.hide = true;
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                //添加产品信息
                $scope.addDrp_Item = function () {
                    $scope.gridOptions_Drp_Item.api.stopEditing();
                    var data = $scope.data.currItem.drp_itemofcss_item_boms;
                    var newLine = {};
                    data.push(newLine);
                    $scope.gridOptions_Drp_Item.hcApi.setRowData(data);
                };

                /**
                 * 删除产品信息
                 */
                $scope.deleteDrp_Item = function () {
                    var idx = $scope.gridOptions_Drp_Item.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    }
                    else {
                        $scope.data.currItem.drp_itemofcss_item_boms.splice(idx, 1);
                        if ($scope.data.currItem.drp_itemofcss_item_boms.length == 0) {
                            $scope.data.currItem.drp_itemofcss_item_boms.push({});
                            $scope.gridOptions_Drp_Item.hcApi.setRowData($scope.data.currItem.drp_itemofcss_item_boms);
                        }
                        else if ($scope.data.currItem.drp_itemofcss_item_boms.length > 0) {
                            $scope.gridOptions_Drp_Item.hcApi.setRowData($scope.data.currItem.drp_itemofcss_item_boms);

                        }
                    }
                };

                //添加配件信息
                $scope.addItem = function () {
                    $scope.gridOptions_Item.api.stopEditing();
                    var data = $scope.data.currItem.css_item_boms;
                    var indexDrp = $scope.gridOptions_Drp_Item.hcApi.getFocusedRowIndex();
                    var newLine = {};
                    if ($scope.data.currItem.drp_itemofcss_item_boms[indexDrp]) {
                        for (var prop in $scope.data.currItem.drp_itemofcss_item_boms[indexDrp]) {
                            if (prop == 'bom_id') {
                                continue;
                            }
                            newLine[prop] = $scope.data.currItem.drp_itemofcss_item_boms[indexDrp][prop];
                        }
                    } else {
                        swalApi.info('产品信息不能为空');
                        return false;
                    }
                    data.push(newLine);
                    $scope.gridOptions_Item.hcApi.setRowData(data);
                };

                /**
                 * 删除配件信息
                 */
                $scope.deleteItem = function () {
                    var idx = $scope.gridOptions_Item.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    }
                    else {
                        var index = $scope.gridOptions_Drp_Item.hcApi.getFocusedRowIndex();
                        if ($scope.data.currItem.css_item_boms[idx]) {
                            if ($scope.data.currItem.drp_itemofcss_item_boms[index].bom_id) {
                                $scope.deleteCss_Item($scope.data.currItem.css_item_boms[idx].drp_item_code,
                                    $scope.data.currItem.css_item_boms[idx].item_code);
                            }
                        }
                        $scope.data.currItem.css_item_boms.splice(idx, 1);
                        if ($scope.data.currItem.css_item_boms.length == 0) {
                            var newDate = {};
                            for (var prop in $scope.data.currItem.drp_itemofcss_item_boms[index]) {
                                if (prop == 'bom_id') {
                                    continue;
                                }
                                newDate[prop] = $scope.data.currItem.drp_itemofcss_item_boms[index][prop];
                            }
                            $scope.data.currItem.css_item_boms.push(newDate);
                            $scope.gridOptions_Item.hcApi.setRowData($scope.data.currItem.css_item_boms);
                        }
                        else if ($scope.data.currItem.css_item_boms.length > 0) {
                            $scope.gridOptions_Item.hcApi.setRowData($scope.data.currItem.css_item_boms);
                        }
                    }
                };

                /**
                 *  条件查询 BOM产品
                 */
                $scope.searchDrp_Item = function () {
                    if (!$scope.data.currItem.bom_flag) {
                        $scope.data.currItem.bom_flag = 2;
                    }
                    requestApi.post({
                        classId: 'css_item_bom',
                        data: {
                            searchflag: 3,
                            bom_flag: $scope.data.currItem.bom_flag,
                            searchkey: $scope.data.currItem.searchkey
                        },
                        action: 'search'
                    }).then(function (response) {
                        if (response.drp_itemofcss_item_boms.length == 0) {
                            var item_bom = [{}];
                            $scope.data.currItem.drp_itemofcss_item_boms = item_bom;
                            swalApi.info('没有此产品记录');
                        } else {
                            $scope.data.currItem.drp_itemofcss_item_boms = response.drp_itemofcss_item_boms;
                        }
                        $scope.gridOptions_Drp_Item.hcApi.setRowData($scope.data.currItem.drp_itemofcss_item_boms);
                    });
                };

                /**
                 *   删除 BOM产品 对应配件
                 */
                $scope.deleteCss_Item = function (drp_code, code) {
                    requestApi.post({
                        classId: 'css_item_bom',
                        data: {
                            drp_item_code: drp_code,
                            item_code: code
                        },
                        action: 'delete'
                    }).then(function () {
                        swalApi.info('配件资料已删除');
                    });
                };

                /**
                 *   检查 产品 配件 种类 是否重复
                 */

                $scope.checkCss_ItemDouble = function (itemId) {
                    for (let i = 0, len = $scope.data.currItem.css_item_boms.length; i < len; i++) {
                        if ($scope.data.currItem.css_item_boms[i].item_id == itemId)
                            return '该产品已有该配件';
                    }
                };
 
                /**
                 *   检查 产品  种类 是否重复
                 */
                $scope.checkDrp_ItemDouble = function (DrpItemId) {
                    for (let i = 0, len = $scope.data.currItem.drp_itemofcss_item_boms.length; i < len; i++) {
                        if ($scope.data.currItem.drp_itemofcss_item_boms[i].drp_item_id == DrpItemId)
                            return '已有该产品';
                    }
                };

            }];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: CssItemBom
        });
    });