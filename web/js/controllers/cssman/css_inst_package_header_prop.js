/**
 * 安装套餐设置 
 * 2019/8/05.     
 * zhuohuixiong
 */
define(
    ['module','controllerApi','base_obj_prop','swalApi','$modal'],
    function (module, controllerApi, base_obj_prop, swalApi,  $modal) {

        var controller = [
            '$scope',
            function ($scope) {

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                function editable(args) {
                    return $scope.data.currItem.stat == 2;
                };
                /*----------------------标签定义---------------------*/
                
                $scope.tabs.base = {
                    title: '基本信息',
                    active: true
                };
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'drp_item_code',
                            headerName: '产品编码',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellDoubleClicked: function (args) {
                                $scope.chooseItemCode(args);
                            }
                        }
                        , {
                            field: 'drp_item_name',
                            headerName: '产品名称'
                        }
                        , {
                            field: 'pkg_qty',

                            headerName: '套餐数量',
                            type: '数量',
                            editable: function (args) {
                                return editable(args)
                            }
                        }
                        , {
                            field: 'note',
                            headerName: '备注',
                            editable: true,
                            width: 150

                        }
                    ]
                };

                /*----------------------------------通配查询-------------------------------------------*/
                /** 配件查询  */
                $scope.chooseItemCode = function (args) {
                    $modal.openCommonSearch ({
                        classId: 'css_item'
                    })
                        .result//响应数据
                        .then(function (result) {
                            if ($scope.checkCss_ItemDouble(result.item_id)) {
                                swalApi.info('产品 :'+ result.item_name+'已存在');
                                return false;
                            }
                            args.data.drp_item_id  = result.item_id;
                            args.data.drp_item_code  = result.item_code;
                            args.data.drp_item_name  = result.item_name;
                            args.api.refreshView();

                        });
                };
                /** 机构名称通用查询 */
                $scope.commonSearchOfScporg = {
                    sqlWhere: "",
                    afterOk: function (result) {
                        $scope.data.currItem.org_id = result.orgid;
                        $scope.data.currItem.org_code = result.code;
                        $scope.data.currItem.org_name = result.orgname;
                    }
                };

                /*----------------------------------初始化数据------------------------------------*/

                /**   新增时init数据   */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.stat = 2;
                    bizData.css_inst_package_headeroflines = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.css_inst_package_headeroflines);
                };

                /**  修改时数据  */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.css_inst_package_headeroflines);
                };
                /*-----------------------------------响应事件----------------------	*/

                /**  增加行  */
                $scope.add_line = function () {

                    $scope.gridOptions.api.stopEditing();
                    var line = {};
                    $scope.data.currItem.css_inst_package_headeroflines.push(line);
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.css_inst_package_headeroflines);
                };
                /**
                 *   检查 产品 配件 种类 是否重复
                 */
                $scope.checkCss_ItemDouble = function (itemId) {
                    for (let i = 0,len=$scope.data.currItem.css_inst_package_headeroflines.length; i < len; i++) {
                          if ($scope.data.currItem.css_inst_package_headeroflines[i].drp_item_id == itemId)
                              return true;
                    }
                };
                /*  删除行  */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.css_inst_package_headeroflines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.css_inst_package_headeroflines);
                    }
                };
                /**-------------定义按钮---------------- */
                $scope.footerLeftButtons.add_line = {
                    title: '增加行',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    }
                };
                $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    }
                }
                /**---------------------End----------------------------------------- */
            }

        ]
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });