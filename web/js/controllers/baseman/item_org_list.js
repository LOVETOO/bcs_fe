/**
 * 产品资料列表页
 * @since 2018-10-10
 * update by limeng 2019/6/15
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'fileApi', 'requestApi', 'swalApi'],
    function (module, controllerApi, base_obj_list, fileApi, requestApi, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {
                $scope.gridOptions = {
                    hcPostData: {
                        searchflag: 1 //查询场景：产品资料列表页
                    },
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'item_code',
                            headerName: '产品编码'
                        }, {
                            field: 'item_name',
                            headerName: '产品名称'
                        }
                        , {
                            field: 'item_desc',
                            headerName: '产品描述'
                        }
                        , {
                            field: 'division_id',
                            headerName: '品牌事业部',
                            hcDictCode: 'epm.division'
                        }
                        , {
                            field: 'sales_status',
                            headerName: '上/下架状态',
                            hcDictCode: 'item.sales_status'
                        }
                        , {
                            field: 'item_model',
                            headerName: '型号'
                        }
                        /*, {
                         field: 'crm_entid',
                         headerName: '品类',
                         hcDictCode: 'crm_entid'
                         }*/
                        , {
                            field: 'entorgid',
                            headerName: '产品线',
                            hcDictCode: 'entorgid'
                        }
                        , {
                            field: 'item_class1_name',
                            headerName: '产品大类'
                        }
                        , {
                            field: 'item_class2_name',
                            headerName: '产品中类'
                        }
                        , {
                            field: 'item_class3_name',
                            headerName: '产品小类'
                        }
                        , {
                            field: 'length',
                            headerName: '长(mm)',
                            cellStyle: {
                                'text-align': 'center'
                            }
                        }
                        , {
                            field: 'width',
                            headerName: '宽(mm)',
                            cellStyle: {
                                'text-align': 'center'
                            }
                        }
                        , {
                            field: 'height',
                            headerName: '高(mm)',
                            cellStyle: {
                                'text-align': 'center'
                            }
                        }
                        , {
                            field: 'uom_name',
                            headerName: '计量单位',
                            cellStyle: {
                                'text-align': 'center'
                            }
                        },
                        /*{
                         field: 'item_type',
                         headerName: '产品类别',
                         hcDictCode: 'item_type'
                         }
                         ,*/
                        {
                            field: 'specs',
                            headerName: '规格'
                        }
                        , {
                            field: 'gross_weigth',
                            headerName: '毛重(kg)',
                            cellStyle: {
                                'text-align': 'center'
                            }
                        }
                        , {
                            field: 'net_weigth',
                            headerName: '净重(kg)',
                            cellStyle: {
                                'text-align': 'center'
                            }
                        }
                        , {
                            field: 'cubage',
                            headerName: '单位体积(m³)',
                            cellStyle: {
                                'text-align': 'center'
                            }
                        }
                        , {
                            field: 'acreage',
                            headerName: '面积(m²)',
                            cellStyle: {
                                'text-align': 'center'
                            }
                        }
                        /*, {
                         field: 'item_usable',
                         headerName: '有效',
                         type:'是否'
                         }
                         , {
                         field: 'is_retail',
                         headerName: '零售',
                         type:'是否'
                         }*/
                        , {
                            field: 'bar_code',
                            headerName: '国际条形码'
                        },
                        {
                            field: 'item_loc',
                            headerName: '产品定位'
                        }
                        , {
                            field: 'item_color',
                            headerName: '颜色'
                        }
                        // , {
                        //     field: 'colorbox_size',
                        //     headerName: '彩箱尺寸'
                        // }
                        // , {
                        //     field: 'inbox_size',
                        //     headerName: '中箱尺寸'
                        // }
                        // , {
                        //     field: 'outbox_size',
                        //     headerName: '外箱尺寸'
                        // }
                        , {
                            field: 'channel_id',
                            headerName: '销售渠道',
                            hcDictCode: 'item.channel'
                        }
                        /*, {
                         field: 'asset_subject_code',
                         headerName: '资产科目编码'
                         },
                         {
                         field: 'asset_subject_name',
                         headerName: '资产科目名称'
                         }*/
                        /*, {
                         field: 'max_inv',
                         headerName: '库存上限',
                         type:'数量'
                         }
                         , {
                         field: 'min_inv',
                         headerName: '库存下限',
                         type:'数量'
                         }*/
                        , {
                            field: 'spec_qty',
                            headerName: '包装数量',
                            cellStyle: {
                                'text-align': 'center'
                            }
                        }, {
                            field: 'pack_code',
                            headerName: '包装码'
                        },
                        {
                            field: 'old_item_code',
                            headerName: '旧产品编码'
                        }
                        // , {
                        //     field: 'is_stock',
                        //     headerName: '可采购',
                        //     type:'是否'
                        // }
                        // , {
                        //     field: 'is_syscreate',
                        //     headerName: '系统预设',
                        //     type:'是否'
                        // }
                        , {
                            field: 'outbox_cubage',
                            headerName: '包装体积(m³)',
                            cellStyle: {
                                'text-align': 'center'
                            }
                        }
                        , {
                            field: 'pack_uom',
                            headerName: '包装单位'
                        }
                        , {
                            field: 'is_old',
                            headerName: '老品',
                            type: '是否'
                        }
                        , {
                            field: 'is_wl',
                            headerName: '推广物料',
                            type: '是否'
                        }
                        , {
                            field: 'is_eliminate',
                            headerName: '淘汰品',
                            type: '是否'
                        }
                        , {
                            field: 'is_special_supply',
                            headerName: '专供',
                            type: '是否'
                        }
                        // , {
                        //     field: 'is_import_ec',
                        //     headerName: '引入电商',
                        //     type:'是否'
                        // }
                        , {
                            field: 'is_csspj',
                            headerName: '配件',
                            type: '是否'
                        }
                        , {
                            field: 'is_install',
                            headerName: '需要安装',
                            type: '是否'
                        }
                        , {
                            field: 'is_round',
                            headerName: '凑整开单',
                            type: '是否'
                        }
                        , {
                            field: 'can_sale',
                            headerName: '可销售',
                            type: '是否'
                        }
                        , {
                            field: 'note',
                            headerName: '备注'
                        }, {
                            headerName: '正面主图',
                            hcImgIdField: "docid1"
                        }, {
                            headerName: '爆炸图',
                            hcImgIdField: "docid2"
                        }, {
                            headerName: '尺寸图',
                            hcImgIdField: "docid3"
                        }, {
                            headerName: '其他图一',
                            hcImgIdField: "docid4"
                        }, {
                            headerName: '其他图二',
                            hcImgIdField: "docid5"
                        }
                    ],
                    // hcObjType: 1003
                    hcClassId: 'item_org',
                    hcBeforeRequest: function (searchObj) {
                        if (user.isCustomer) {
                            //查询当前组织的事业部
                            return requestApi
                                .post({
                                    classId: 'epm_division',
                                    action: 'select',
                                    data: {}
                                })
                                .then(function (data) {
                                    searchObj.division_id = data.division_id;
                                });
                        }
                    },
                    hcAfterRequest: function (data) {
                        var fileds = [
                            'outbox_cubage',       //包装体积
                            'spec_qty',            //包装数量
                            'acreage',             //面积
                            'cubage',              //单位体积
                            'net_weigth',          //净重
                            'gross_weigth',        //毛重
                            'height',              //高
                            'width',               //宽
                            'length'               //长
                        ];
                        data.item_orgs.forEach(function (value) {
                            fileds.forEach(function (filed) {
                                if (value[filed] == 0) {
                                    value[filed] = undefined;
                                }
                            });
                        });
                    }
                };

                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });


                /**
                 * 导入
                 */
                $scope.import = function () {

                };

                $scope.toolButtons.downloadImportFormat.hide = false;
                $scope.toolButtons.import.hide = false;

                $scope.toolButtons.downloadImportFormat.click = function () {
                    fileApi.downloadFile(7164);
                };

                /**
                 *删除前校验 外部系统引入的分类，不允许删除
                 */
                $scope.doBeforeDelete = function () {
                    var rowData = $scope.gridOptions.hcApi.getFocusedData();
                    return requestApi.post('item_org', 'select', {item_org_id: rowData.item_org_id})
                        .then(function (result) {
                            if (result.is_init == 2) {
                                return swalApi.info('该产品资料为外部系统引入，不允许删除')
                                    .then(function () {
                                        return $q.reject()
                                    });
                            }
                        });
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
