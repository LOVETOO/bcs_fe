/**
 *  配件资料
 *
 */
define(
    ['module', 'controllerApi', 'requestApi', 'base_obj_prop', 'openBizObj', 'swalApi','numberApi', 'fileApi','directive/hcImg'],
    function (module, controllerApi, requestApi, base_obj_prop, openBizObj, swalApi,numberApi,fileApi) {
        'use strict';
        var controller = [
            '$scope', '$modal',
            function ($scope,$modal) {
                /*----------------------------------能否编辑-------------------------------------------*/
                function editable() {
                    return $scope.data.currItem.stat == 1;
                }

                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------表格定义-------------------------------------------*/
                //可替换配件
                $scope.gridOptions_css_item_alt = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'css_item_alt_code',
                        headerName: '编码',
                        onCellDoubleClicked:function(args){
                            $scope.search_item(args);
                        },
                        editable: true,
                        width:350

                    }, {
                        field: 'css_item_alt_name',
                        headerName: '名称',
                        onCellDoubleClicked:function(args){
                            $scope.search_item(args);
                        },
                        editable: true,
                        width:350
                    }
                    ]
                };
                /*----------------------------------通用查询-------------------------------------------*/
                //配件
                $scope.commonSearchOfUom = {
                    afterOk: function (result) {
                        $scope.data.currItem.uom_id = result.uom_id;
                        $scope.data.currItem.uom_code = result.uom_code;
                        $scope.data.currItem.uom_name = result.uom_name;
                    }
                };
                $scope.search_item=function(args){
                        $modal.openCommonSearch({
                            classId: 'css_item',
                            postData: {
                                flag:20,
                                usable:2
                            },
                            action: 'search',
                            title: "可替换配件",
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "配件编码",
                                        field: "css_item_code"
                                    }, {
                                        headerName: "配件名称",
                                        field: "css_item_name"
                                    }
                                ]
                            }
                        })
                            .result//响应数据
                            .then(function (result) {
                                args.data.css_item_alt_id=result.css_item_id;
                                args.data.css_item_alt_code = result.css_item_code;
                                args.data.css_item_alt_name = result.css_item_name;
                                args.api.refreshView();
                            });
                };
                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //添加详情信息
                    if (!bizData.css_item_photoofcss_items) {
                        bizData.css_item_photoofcss_items = [{}];
                    }else{
                        bizData.css_item_photoofcss_items.push({});
                    }
                    bizData.css_item_altofcss_items = [{}];
                    $scope.gridOptions_css_item_alt.hcApi.setRowData(bizData.css_item_altofcss_items);
                };
                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    if (bizData.css_item_photoofcss_items&&bizData.css_item_photoofcss_items==0) {
                        bizData.css_item_photoofcss_items = [{}];
                    }else{
                        bizData.css_item_photoofcss_items.push({});
                    }
                    $scope.gridOptions_css_item_alt.hcApi.setRowData(bizData.css_item_altofcss_items);
                };
                /**
                 * 保存之前
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    var i = 0;
                    var imgdata = [];
                    for (i = bizData.css_item_photoofcss_items.length - 1; i > -1; i--) {
                        if (bizData.css_item_photoofcss_items[i].docid) {
                            imgdata.push(bizData.css_item_photoofcss_items[i]);
                        }
                    }
                    bizData.css_item_photoofcss_items = imgdata;
                };
                /**
                 * 保存验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    if ($scope.data.currItem.min_inv_qty&&$scope.data.currItem.max_inv_qty){
                        if ($scope.data.currItem.min_inv_qty>$scope.data.currItem.max_inv_qty) {
                            invalidBox.push('最小库存不能大于最大库存');
                        }
                    }
                    if ($scope.data.currItem.norm_inv_qty&&$scope.data.currItem.min_inv_qty){
                        if ($scope.data.currItem.norm_inv_qty<$scope.data.currItem.min_inv_qty) {
                            invalidBox.push('合理库存不能小于最小库存');
                        }
                    }
                    if ($scope.data.currItem.norm_inv_qty&&$scope.data.currItem.max_inv_qty){
                        if ($scope.data.currItem.norm_inv_qty>$scope.data.currItem.max_inv_qty) {
                            invalidBox.push('合理库存不能大于最大库存');
                        }
                    }

                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow = {
                    title: '增加明细',
                    click: function () {
                        if ($scope.tabs.base.active) {
                            $scope.add_css_item_alt && $scope.add_css_item_alt();
                        }
                    }
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return (!$scope.tabs.base.active);
                };
                $scope.footerLeftButtons.deleteRow = {
                    title: "删除明细",
                    click: function () {
                        if ($scope.tabs.base.active) {
                            $scope.del_css_item_alt && $scope.del_css_item_alt();
                        }
                    }
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return (!$scope.tabs.base.active);
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                //增加可替换配件
                $scope.add_css_item_alt = function () {
                    $scope.gridOptions_css_item_alt.api.stopEditing();
                    var data = $scope.data.currItem.css_item_altofcss_items;
                    data.push({});
                    $scope.gridOptions_css_item_alt.hcApi.setRowData(data);
                };
                //删除可替换配件
                $scope.del_css_item_alt = function () {
                    var idx = $scope.gridOptions_css_item_alt.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.css_item_altofcss_items.splice(idx, 1);
                        $scope.gridOptions_css_item_alt.hcApi.setRowData($scope.data.currItem.css_item_altofcss_items);
                        if ($scope.data.currItem.css_item_altofcss_items.length == 0) {
                            $scope.data.currItem.css_item_altofcss_items.push({});
                            $scope.gridOptions_css_item_alt.hcApi.setRowData($scope.data.currItem.css_item_altofcss_items);
                        }
                        if ($scope.data.currItem.css_item_altofcss_items.length > 0) {
                            $scope.gridOptions_css_item_alt.hcApi.setRowData($scope.data.currItem.css_item_altofcss_items);
                        }
                    }
                };

                /*----------------------------------图片上传与删除-------------------------------------------*/

                /**
                 * 上传图片
                 */
                $scope.uploadFile = function (index) {
                    fileApi.uploadFile({
                        multiple: false,
                        accept: 'image/*'
                    }).then(function (rspeData) {
                        $scope.data.currItem.css_item_photoofcss_items[index] = {
                            "docid": numberApi.toNumber(rspeData[0].docid)
                        };
                        $scope.data.currItem.css_item_photoofcss_items.push({});
                    });
                };

                $scope.open = function (doc) {
                    return openBizObj({
                        imageId: doc.docid,
                        images: $scope.data.currItem.css_item_photoofcss_items
                    });
                };
                /**
                 * 移除图片
                 */
                $scope.del_image = function (index) {
                        $scope.data.currItem.css_item_photoofcss_items.splice(index, 1);
                };
                /*----------------------------------通用方法定义-------------------------------------------*/
                /**
                 * 验证是否数字
                 */
                $scope.isNumFormat=function(num,prop){
                    if (!numberApi.isStrOfNum(num)) {
                        swalApi.info('输入的不是一个数');
                        $scope.data.currItem[prop]=0;
                    }
                };
                /*----------------------------------顶部按钮-------------------------------------------*/

                $scope.tabs.base = {
                    title: '基本信息',
                    active: true
                };
            }
        ]
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });

    });