/**
 * 产品资料
 * @since 2020-3-6
 * wzf
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'fileApi', 'swalApi', 'numberApi', 'openBizObj'],
    function (module, controllerApi, base_obj_prop, requestApi, fileApi, swalApi, numberApi, openBizObj) {
        var controller = [
            '$scope', '$modal',
            function ($scope, $modal) {
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'elementname',
                        headerName: '参数名称',
                        editable: true,
                        hcRequired: true
                    }, {
                        field: 'elementvalue',
                        headerName: '参数值',
                        editable: true
                    }],
                    //定义表格增减行按钮
                    hcButtons: {
                        addRow: {
                            title: '新增',
                            click: function () {
                                $scope.add_line && $scope.add_line();
                            },
                        },
                        deleteRow: {
                            title: '删除',
                            click: function () {
                                $scope.del_line && $scope.del_line();
                            },
                            hide: false
                        },
                        syncProp: {
                            title: '属性同步',
                            click: function () {
                                $scope.syncitemprop && $scope.syncitemprop();
                            },
                            hide: false
                        }
                    }
                }

                /*底部左边按钮*/

                // $scope.footerLeftButtons.addRow = {
                //     title: '新增',
                //     click: function () {
                //         $scope.add_line && $scope.add_line();
                //     },
                //     hide: false
                // };

                // $scope.footerLeftButtons.deleteRow = {
                //     title: '删除',
                //     click: function () {
                //         $scope.del_line && $scope.del_line();
                //     },
                //     hide: false
                // };
                // $scope.footerLeftButtons.syncProp = {
                //     title: '属性同步',
                //     click: function () {
                //         $scope.syncitemprop && $scope.syncitemprop();
                //     },
                //     hide: false
                // };
                /*----------------------------------按钮方法 定义----------------------------------*/
                //添加明细
                $scope.add_line = function () {
                    $scope.data.currItem.bcs_itemprops.push({});
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.bcs_itemprops);

                };
                /**
                 * 删除行明细
                 */
                $scope.del_line = function () {

                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                    } else {
                        $scope.data.currItem.bcs_itemprops.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.bcs_itemprops);

                    }
                };
                /**
                 * 属性同步
                 */
                $scope.syncitemprop = function () {
                    requestApi.post({
                        classId: "bcs_item",
                        action: "syncitemprop",
                        data: {
                            itemid: $scope.data.currItem.itemid,
                        }
                    }).then(function (data) {
                        // notify({ message: "提示:同步属性数据成功！！！", classes: "alert-success", templateUrl: 'views/common/notify.html' });
                        $scope.data.currItem.bcs_itemprops = data.bcs_itemprops
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.bcs_itemprops)
                        swal("提示:同步属性数据成功！！！");
                    })
                    // BasemanService.RequestPost("bcs_item", "syncitemprop", JSON.stringify($scope.data.currItem.itemid))
                    //     .then(function (data) {
                    //         $scope.data.currItem.bcs_itemprops = data.bcs_itemprops
                    //         $scope.gridOptions.hcApi.setRowData($scope.data.currItem.bcs_itemprops)
                    //         BasemanService.notice("同步属性数据成功！！！", "alert-success");
                    //     });
                };

                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.bcs_itemprops);
                };

                $scope.newBizData = function (bizData) {
                    bizData.bcs_itemprops = [];
                    $scope.hcSuper.newBizData(bizData);
                };
                //打开图片预览
                $scope.open = function (docid) {
                    if(docid==0){
                        return;
                    }
                    return openBizObj({
                        imageId: docid,
                        images: $scope.data.currItem.bcs_itemprops_images
                    });
                };

                //上传图片
                $scope.uploadImg = function () {
                    fileApi.uploadFile({
                        multiple: false,
                        accept: 'image/*'
                    }).then(function (response) {
                        $scope.data.currItem.docid = response[0].docid;
                        $scope.data.currItem.img_name = response[0].docname;
                        console.log(response);
                        $scope.data.currItem.bcs_itemprops_images = {
                            docid: response[0].docid,
                            img_name: response[0].docname,
                        };
                    });
                };
                //图片删除
                $scope.deleteImg = function (idx) {
                    //重置图片数组中的元素
                    $scope.data.currItem.bcs_itemprops_images[idx]
                        = { docid: 0, seq: idx + 1, img_name: $scope.imgMap[idx + 1 + ''] };
                };
                /**清空文本框中的图片名称 */
                $scope.clearImg = function () {
                    /**当img_name有值时才清空 */
                    if ($scope.data.currItem.img_name != '' && $scope.data.currItem.img_name != null) {
                        $scope.data.currItem.img_name = '';
                        $scope.data.currItem.docid = 0;
                    }
                };
            }];


        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });