/**
 * 产品资料-属性页
 * 2018-10-11
 * update by limeng 2019/6/15
 * update by zengjinhua 2019/7/15
 */
define(
	['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'fileApi', 'openBizObj', 'numberApi', '$modal', 'requestApi', 'gridApi'],
    function (module, controllerApi, base_obj_prop, swalApi, fileApi, openBizObj, numberApi, $modal, requestApi, gridApi) {
        'use strict';
        var controller = [
                //声明依赖注入
                '$scope',
                //控制器函数
                function ($scope) {
                    //是否有操作产品图片的权限(“产品图册管理员”或者“admins”角色或者admin本人有该权限)
                    $scope.hasRightOfPic = userbean.hasRole('产品图册管理员', true);

                    controllerApi.extend({
                        controller: base_obj_prop.controller,
                        scope: $scope
                    });

                    /*---------------------数据定义--------------------------*/
                    //
                    //
                    /**
                     * 网格数据的切片(按大中小类分)，查看时将item_props分解到切片，
                     * 保存时将item_class_parts处理到item_props,
                     * item_class_parts格式如: {"597":[{}、{}...{}],"598":[{}、{}...{}],"599":[{}、{}...{}]}
                     * @type {{}}
                     */
                    $scope.data.item_class_parts = {};
                    //保存item_class_id(不重复)，也用于指向$scope.data.item_class_parts的元素
                    $scope.data.item_class_parts_ref = [];

                    /*-------------------表格定义------------------------*/
                    //表格定义
                    $scope.gridOptions = {
                        columnDefs: [{
                            type: '序号'
                        }, {
                            field: 'customer_code',
                            headerName: '客户编码',
                            width: 96
                        }, {
                            field: 'customer_name',
                            headerName: '客户名称',
                            width: 100
                        }]
                    };

                    //网格定义-其他参数
                    $scope.gridOptionsOfProp = {
                        context: {
                            //当【参数类型】为枚举型时供【属性值】选择的枚举值，
                            //放在上下文这里是为了共享给单元格渲染器选择器和值格式化器
                            prop_sets: {
                                names: [],
                                values: []
                            }
                        },
                        columnDefs: [
                            {
                                type: '序号'
                            },
                            {
                                field: 'prop_name',
                                headerName: '属性名称',
                                width: 150
                            },
                            {
                                field: 'prop_value',
                                headerName: '属性值',
                                suppressAutoSize: true,
                                minWidth: 150,
                                width: 200,
                                editable: true,
                                cellEditorSelector: function (params) {
                                    var prop_sets = {names: [], values: []};
                                    params.data.prop_set.split(';').forEach(function (cur) {
                                        prop_sets.names.push(cur);
                                        prop_sets.values.push(cur);
                                    });

                                    $scope.gridOptionsOfProp.context.prop_sets = prop_sets;

                                    return Switch(params.data.prop_type, '==')
                                    //【参数类型】为枚举型时，样式为下拉框
                                        .case(4, {
                                            component: 'HcSelectCellEditor',
                                            params: $scope.gridOptionsOfProp.context.prop_sets
                                        })
                                        .result;
                                },
                                onCellValueChanged:function(params){
                                    if (params.newValue == params.oldValue ||
                                        !(params.data.prop_type == 2 || params.data.prop_type == 3)) {
                                        return;
                                    }

                                    params.data.prop_value = numberApi.toNumber(params.newValue);
                                    //参数类型是整数时取整数
                                    if(params.data.prop_type == 2){
                                        params.data.prop_value = ~~params.data.prop_value;
                                    }
                                }
                            },
                            {
                                field: 'prop_type',//1=字符串,2=整数,3=实数,4=枚举型...
                                headerName: '参数类型',
                                hcDictCode: '*',
                                width: 150
                            },
                            {
                                field: 'prop_class',
                                headerName: '参数所属分类',
                                width: 150
                            }
                        ]
                    };

                    /*---------------------页标签定义--------------------------*/

                    //修改标签页标题
                    $scope.tabs.base = {
                        title: '基本信息'
                    }

                    //增加标签页-配件属性、电商属性、其他
                    // $scope.tabs.acc = {
                    //     title: '配件属性'
                    // };
                    // $scope.tabs.ec = {
                    //     title: '电商属性'
                    // };
                    $scope.tabs.exclusively = {
                        title: '专供客户',
                        hide: true
                    };

                    $scope.tabs.otherProp = {
                        title: '其他参数'
                    };

                    $scope.tabs.other = {
                        title: '其他'
                    };
                    /*-------------------通用查询开始------------------------*/
                    $scope.commonSearchSetting = {
                        //资产科目
                        gl_account_subject: {
                            sqlWhere: 'km_type = 1 and end_km = 2',//科目类型：资产
                            afterOk: function (response) {
                                $scope.data.currItem.gl_account_subject_id_zc = response.gl_account_subject_id;
                                $scope.data.currItem.asset_subject_code = response.km_code;
                                $scope.data.currItem.asset_subject_name = response.km_name;
                            }
                        },
                        //单位
                        uom: {
                            afterOk: function (response) {
                                $scope.data.currItem.uom_id = response.uom_id;
                                $scope.data.currItem.uom_code = response.uom_code;
                                $scope.data.currItem.uom_name = response.uom_name;
                            }
                        },
                        //包装单位
                        pack_uom: {
                            afterOk: function (response) {
                                $scope.data.currItem.pack_uom = response.uom_name;
                            }
                        },
                        //产品品牌
                        bas_brand: {
                            afterOk: function (response) {
                                $scope.data.currItem.bas_brand_id = response.bas_brand_id;
                                $scope.data.currItem.bas_brand_name = response.brand_name;
                            }
                        },
                        //产品大类
                        item_class1: {
                            sqlWhere: 'item_usable = 2 and item_class_level = 1',
                            afterOk: function (response) {

                                //更新模型与模型指针
                                $scope.clearProps($scope.data.currItem.item_class1, $scope.data.currItem.item_class2, $scope.data.currItem.item_class3);
                                $scope.data.currItem.item_class2 = 0;
                                $scope.data.currItem.item_class2_code = '';
                                $scope.data.currItem.item_class2_name = '';
                                $scope.data.currItem.item_class3 = 0;
                                $scope.data.currItem.item_class3_code = '';
                                $scope.data.currItem.item_class3_name = '';

                                $scope.data.currItem.item_class1 = response.item_class_id;
                                $scope.data.currItem.item_class1_code = response.item_class_code;
                                $scope.data.currItem.item_class1_name = response.item_class_name;
                                //重新设置其他参数
                                $scope.initProps();
                            }
                        }
                    };

                    //产品中类通用查询
                    $scope.commonSearchSettingOfItem_class2 = function () {
                        return {
                            beforeOpen: function () {
                                if (!$scope.data.currItem.item_class1) {
                                    swalApi.info('请选择产品大类');
                                    return false;
                                }
                            },
                            sqlWhere: 'item_usable = 2 and item_class_level = 2 '
                            + ' and item_class_pid = ' + $scope.data.currItem.item_class1,
                            afterOk: function (response) {
                                //更新模型与模型指针
                                $scope.clearProps($scope.data.currItem.item_class2, $scope.data.currItem.item_class3);
                                $scope.data.currItem.item_class3 = 0;
                                $scope.data.currItem.item_class3_code = '';
                                $scope.data.currItem.item_class3_name = '';

                                $scope.data.currItem.item_class2 = response.item_class_id;
                                $scope.data.currItem.item_class2_code = response.item_class_code;
                                $scope.data.currItem.item_class2_name = response.item_class_name;
                                //重新设置其他参数
                                $scope.initProps();
                            }
                        }
                    };
                    //产品小类通用查询
                    $scope.commonSearchSettingOfItem_class3 = function () {
                        return {
                            beforeOpen: function () {
                                if (!$scope.data.currItem.item_class2) {
                                    swalApi.info('请选择产品中类');
                                    return false;
                                }
                            },
                            sqlWhere: 'item_usable = 2 and item_class_level = 3 '
                            + ' and item_class_pid = ' + $scope.data.currItem.item_class2,
                            afterOk: function (response) {
                                //更新模型与模型指针
                                $scope.clearProps($scope.data.currItem.item_class3);
                                $scope.data.currItem.item_class3 = response.item_class_id;
                                $scope.data.currItem.item_class3_code = response.item_class_code;
                                $scope.data.currItem.item_class3_name = response.item_class_name;
                                //重新设置其他参数
                                $scope.initProps();
                            }
                        }
                    };

                    /*-------------------通用查询结束---------------------*/
                    /*----------------------------------图片方法-------------------------------------------*/

                    $scope.uploadFile = function (index) {
                        fileApi.uploadFile({
                            multiple: false,
                            accept: 'image/*'
                        }).then(function (rspeData) {
                            $scope.data.currItem.item_org_imgofitem_orgs[index] = {
                                "docid": numberApi.toNumber(rspeData[0].docid),
                                "img_name": $scope.data.currItem.item_org_imgofitem_orgs[index].img_name,
                                "locationid": $scope.data.currItem.item_org_imgofitem_orgs[index].locationid
                            }
                        });
                    };

                    $scope.open = function (doc) {
                        return openBizObj({
                            imageId: doc.docid,
                            images: $scope.data.currItem.item_org_imgofitem_orgs
                        });
                    };
                    /**
                     * 移除图片
                     */
                    $scope.del_image = function (index) {
                        $scope.data.currItem.item_org_imgofitem_orgs[index] = {
                            "img_name": $scope.data.currItem.item_org_imgofitem_orgs[index].img_name,
                            "locationid": $scope.data.currItem.item_org_imgofitem_orgs[index].locationid
                        };
                    };

                    /*---------------------数据初始化与数据设置--------------------------*/

                    /**
                     * 新增时数据
                     */
                    $scope.newBizData = function (bizData) {
                        $scope.hcSuper.newBizData(bizData);
                        $scope.data.currItem.item_org_imgofitem_orgs = [{}, {}, {}, {}, {}];
                        $scope.setitem_org_imgofitem_orgs();
                        bizData.item_org_imgofitem_orgs.sort(function (a, b) {
                            return a.locationid - b.locationid;
                        });
                        bizData.created_by = strUserId;
                        bizData.creation_date = new Date().Format('yyyy-MM-dd hh:mm:ss');
                        bizData.last_updated_by = strUserId;
                        bizData.last_update_date = new Date().Format('yyyy-MM-dd hh:mm:ss');
                        //专供客户
                        bizData.item_supply_customers = [];
                        //查询当前组织的事业部
                        requestApi
                            .post({
                                classId: 'epm_division',
                                action: 'select',
                                data: {}
                            })
                            .then(function (data) {
                                $scope.data.currItem.division_id = data.division_id;
                            });
                    };

                    /**
                     * 查看时初始化数据
                     * @param bizData
                     */
                    $scope.setBizData = function (bizData) {
                        $scope.hcSuper.setBizData(bizData);
                        bizData.item_org_imgofitem_orgs.sort(function (a, b) {
                            return a.locationid - b.locationid;
                        });
                        if (!$scope.data.currItem.item_org_imgofitem_orgs
                            || $scope.data.currItem.item_org_imgofitem_orgs.length == 0) {
                            $scope.data.currItem.item_org_imgofitem_orgs = [{}, {}, {}, {}, {}];
                            $scope.setitem_org_imgofitem_orgs();
                        } else if ($scope.data.currItem.item_org_imgofitem_orgs
                            && $scope.data.currItem.item_org_imgofitem_orgs.length > 0) {
                            $scope.setitem_org_imgofitem_orgs();
                        }

						gridApi.execute($scope.gridOptions, function () {
							//专供客户
							$scope.gridOptions.hcApi.setRowData(bizData.item_supply_customers);
						});

                        $scope.changeExclusively1();
                        $scope.clearNumber();

                        //其他参数 初始化
                        if ($scope.data.item_class_parts_ref.length == 0) {
                            $scope.initProps();
                        }
                    };

                    /**
                     * 保存前的数据处理
                     * @param bizData
                     */
                    $scope.saveBizData = function (bizData) {
                        $scope.hcSuper.saveBizData(bizData);
                        var i = 0;
                        var imgdata = [];
                        for (i = bizData.item_org_imgofitem_orgs.length - 1; i > -1; i--) {
                            if (bizData.item_org_imgofitem_orgs[i].img_name) {
                                //bizData.item_org_imgofitem_orgs.splice(i);
                                imgdata.push(bizData.item_org_imgofitem_orgs[i]);
                            }
                        }
                        bizData.item_org_imgofitem_orgs = imgdata;

                        //设置明细 其他参数(将item_class_parts的数据解析到item_props)
                        bizData.item_props = $scope.mergePartsToProps();
                    };

                    /*---------------------明细 其它参数的相关函数--------------------------*/

                    /**
                     * 其他参数 初始化
                     */
                    $scope.initProps = function () {

                        //最下级分类的分类id
                        var item_class_id = 0;
                        if ($scope.data.currItem.item_class3) {
                            item_class_id = $scope.data.currItem.item_class3;
                        } else if ($scope.data.currItem.item_class2) {
                            item_class_id = $scope.data.currItem.item_class2;
                        } else if ($scope.data.currItem.item_class1) {
                            item_class_id = $scope.data.currItem.item_class1;
                        } else {
                            return;
                        }

                        //由下至上，查询关联的分类参数信息 item_class_prop_sets
                        requestApi
                            .post('item_class', 'select', {item_class_id: item_class_id})
                            .then(function (result) {

                                //新的分类参数赋值value为空串
                                var newProp;
                                //初始化切片模型(这些切片构成网格的数据模型,保存时作为至多3条明细保存)
                                result.item_class_prop_sets.forEach(function (cur) {

                                    //设置item_class_parts_ref和item_class_parts
                                    if (!$scope.data.item_class_parts[cur.item_class_id]) {
                                        if ($scope.data.item_class_parts_ref.indexOf(cur.item_class_id) == -1) {
                                            $scope.data.item_class_parts_ref.push(cur.item_class_id);
                                            $scope.data.item_class_parts[cur.item_class_id] = [];
                                            newProp = cur.item_class_id;
                                        }
                                    }

                                    //初始化item_class_parts新元素
                                    if (cur.item_class_id == newProp) {
                                        $scope.data.item_class_parts[cur.item_class_id].push({
                                            prop_name: cur.prop_name,
                                            prop_value: '',
                                            prop_type: cur.prop_type,
                                            prop_class: cur.item_class_name,
                                            prop_field_name: cur.prop_field_name,
                                            prop_set: cur.prop_set
                                        });
                                    }
                                });

                                //设置切片数据。外层循环明细关联数据item_props
                                if ($scope.data.currItem.item_props) {
                                    $scope.data.currItem.item_props.forEach(function (curOut) {
                                        //内层循环设置切片模型的属性值
                                        if ($scope.data.item_class_parts[curOut.item_class_id]) {
                                            $scope.data.item_class_parts[curOut.item_class_id].forEach(function (curIn, idx) {
                                                $scope.data.item_class_parts[curOut.item_class_id][idx].prop_value
                                                    = curOut[curIn.prop_field_name];
                                            })

                                        }
                                    });
                                }

                                //设置参数网格数据模型
                                $scope.setDataOfProps();

                            })
                    };

                    /**
                     * 设置网格数据（其他参数）
                     */
                    $scope.setDataOfProps = function () {

                        //绑定网格数据模型
                        if ($scope.data.item_class_parts_ref.length == 3) {//产品有大中小类
                            $scope.gridOptionsOfProp.api.setRowData(
                                $scope.data.item_class_parts[$scope.data.item_class_parts_ref[0]]
                                    .concat($scope.data.item_class_parts[$scope.data.item_class_parts_ref[1]])
                                    .concat($scope.data.item_class_parts[$scope.data.item_class_parts_ref[2]])
                            )
                        } else if ($scope.data.item_class_parts_ref.length == 2) {//产品只有大中类
                            $scope.gridOptionsOfProp.api.setRowData(
                                $scope.data.item_class_parts[$scope.data.item_class_parts_ref[0]]
                                    .concat($scope.data.item_class_parts[$scope.data.item_class_parts_ref[1]])
                            )
                        } else if ($scope.data.item_class_parts_ref.length == 1) {//产品只有大类
                            $scope.gridOptionsOfProp.api.setRowData(
                                $scope.data.item_class_parts[$scope.data.item_class_parts_ref[0]]
                            )
                        }

                    };

                    /**
                     * 产品分类删除,删除关联参数(修改item_class_parts与item_class_parts_ref)
                     */
                    $scope.clearProps = function () {
                        //删除大类时网格内容清空
                        if (arguments.length == 3) {
                            $scope.data.item_class_parts = {};
                            $scope.data.item_class_parts_ref = [];
                            return $scope.gridOptionsOfProp.api.setRowData([]);
                        }

                        var idx;
                        for (var obj in arguments) {
                            if (!arguments[obj]) {
                                return $scope.setDataOfProps();
                            }
                            delete $scope.data.item_class_parts[arguments[obj] + ''];
                            idx = $scope.data.item_class_parts_ref.indexOf(arguments[obj] + '');
                            $scope.data.item_class_parts_ref.splice(idx, 1);

                        }
                        //绑定网格与数据模型
                        $scope.setDataOfProps();
                    };

                    /**
                     * 将item_class_parts数据处理到item_props
                     * @returns {Array}
                     */
                    $scope.mergePartsToProps = function () {
                        $scope.data.item_props = [];

                        var idx = 0;
                        for (var item_class_id in $scope.data.item_class_parts) {
                            var tempObj = {};
                            tempObj['item_class_id'] = item_class_id;
                            tempObj['item_id'] = $scope.data.currItem.item_id;

                            $scope.data.item_class_parts[item_class_id].forEach(function (cur) {
                                tempObj[cur.prop_field_name] = cur.prop_value;
                            });

                            $scope.data.item_props.push(tempObj);

                            idx++;
                            if ($scope.data.item_class_parts_ref.length == idx) {
                                break;
                            }
                        }

                        return $scope.data.item_props;
                    };

                    /**
                     * 清除数据
                     */
                    $scope.clearNumber = function () {
                        if ($scope.data.currItem.length == 0) {
                            $scope.data.currItem.length = undefined;
                        }
                        if ($scope.data.currItem.width == 0) {
                            $scope.data.currItem.width = undefined;
                        }
                        if ($scope.data.currItem.height == 0) {
                            $scope.data.currItem.height = undefined;
                        }
                        if ($scope.data.currItem.cubage == 0) {
                            $scope.data.currItem.cubage = undefined;
                        }
                        if ($scope.data.currItem.spec_qty == 0) {
                            $scope.data.currItem.spec_qty = undefined;
                        }
                        if ($scope.data.currItem.outbox_cubage == 0) {
                            $scope.data.currItem.outbox_cubage = undefined;
                        }
                        if ($scope.data.currItem.gross_weigth == 0) {
                            $scope.data.currItem.gross_weigth = undefined;
                        }
                        if ($scope.data.currItem.net_weigth == 0) {
                            $scope.data.currItem.net_weigth = undefined;
                        }
                        if ($scope.data.currItem.acreage == 0) {
                            $scope.data.currItem.acreage = undefined;
                        }
                    };

                    /**
                     * 初始化图片
                     */
                    $scope.setitem_org_imgofitem_orgs = function () {
                        $scope.data.currItem.item_org_imgofitem_orgs.forEach(function (val, index) {
                            switch (index) {
                                case 0:
                                    val.img_name = '正面主图';
                                    val.locationid = 0;
                                    break;
                                case 1:
                                    val.img_name = '爆炸图';
                                    val.locationid = 1;
                                    break;
                                case 2:
                                    val.img_name = '尺寸图';
                                    val.locationid = 2;
                                    break;
                                case 3:
                                    val.img_name = '其他图一';
                                    val.locationid = 3;
                                    break;
                                case 4:
                                    val.img_name = '其他图二';
                                    val.locationid = 4;
                                    break;
                            }
                        })
                    };

                    /**
                     * 是否显示专供
                     */
                    $scope.changeExclusively = function () {
                        if ($scope.data.currItem.is_special_supply == 2) {
                            $scope.tabs.exclusively.hide = false;
                            $scope.tabController.setActiveTab('exclusively');
                        } else {
                            if ($scope.data.currItem.item_supply_customers.length > 0) {
                                $scope.data.currItem.is_special_supply = 2;
                                $scope.tabController.setActiveTab('exclusively');
                                swalApi.confirmThenSuccess({
                                    title: "已维护专供客户，是否确定取消?",
                                    okFun: function () {
                                        $scope.tabs.exclusively.hide = true;
                                        $scope.tabs.base.active = true;
                                        $scope.data.currItem.item_supply_customers = [];
                                        $scope.gridOptions.hcApi.setRowData([]);
                                        $scope.data.currItem.is_special_supply = 1;
                                        $scope.tabController.setActiveTab('base');
                                    }
                                });
                            } else {
                                $scope.tabs.exclusively.hide = true;
                            }
                        }
                    };
                    $scope.changeExclusively1 = function () {
                        if ($scope.data.currItem.is_special_supply == 2) {
                            $scope.tabs.exclusively.hide = false;
                        } else {
                            if ($scope.data.currItem.item_supply_customers.length > 0) {
                                $scope.data.currItem.item_supply_customers = [];
                                $scope.gridOptions.hcApi.setRowData([]);
                                $scope.tabs.exclusively.hide = true;
                            } else {
                                $scope.tabs.exclusively.hide = true;
                            }
                        }
                    };

                    /*底部左边按钮*/
                    $scope.footerLeftButtons.addRow.click = function () {
                        $scope.add_line && $scope.add_line();
                    };
                    $scope.footerLeftButtons.addRow.hide = function () {
                        return !$scope.tabs.exclusively.active;
                    };
                    $scope.footerLeftButtons.deleteRow.click = function () {
                        $scope.del_line && $scope.del_line();
                    };
                    $scope.footerLeftButtons.deleteRow.hide = function () {
                        return !$scope.tabs.exclusively.active;
                    };
                    //添加专供客户
                    $scope.add_line = function () {
                        $scope.gridOptions.api.stopEditing();
                        //新增一行先选择客户
                        $modal.openCommonSearch({
                                classId: 'customer_org',
                                postData: {
                                    search_flag: 126
                                },
                                dataRelationName: 'customer_orgs',
                                title: '客户信息',
                                gridOptions: {
                                    columnDefs: [
                                        {
                                            headerName: "客户编码",
                                            field: "customer_code"
                                        }, {
                                            headerName: "客户名称",
                                            field: "customer_name"
                                        }
                                    ]
                                }
                            })
                            .result//响应数据
                            .then(function (result) {
                                $scope.data.currItem.item_supply_customers.push({
                                    customer_id: result.customer_id,
                                    customer_code: result.customer_code,
                                    customer_name: result.customer_name

                                });
                                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.item_supply_customers);
                            });
                    };
                    /**
                     * 删除行专供客户
                     */
                    $scope.del_line = function () {
                        var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                        if (idx < 0) {
                            swalApi.info('请选中要删除的行');
                        } else {
                            $scope.data.currItem.item_supply_customers.splice(idx, 1);
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.item_supply_customers);
                        }
                    };

                }
            ]
            ;

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.registerController({
            module: module,
            controller: controller
        });
    }
)
;

var getBigPicture = function () {
    window.location.href = $(this).src;
}



